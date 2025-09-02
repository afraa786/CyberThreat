import os
import tempfile
from typing import List, Dict
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware
import speech_recognition as sr
from gtts import gTTS

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("API key for Groq is missing. Please set the GROQ_API_KEY in the .env file.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=GROQ_API_KEY)


class UserInput(BaseModel):
    message: str
    role: str = "user"
    conversation_id: str


class Conversation:
    def __init__(self):
        self.messages: List[Dict[str, str]] = [
            {
                "role": "system",
                "content": (
                    "You are an intelligent AI assistant designed to support "
                    "cybersecurity experts with advanced threat detection, vulnerability assessment, "
                    "incident response, and real-time intelligence analysis. "
                    "You provide context-aware insights, automate routine security tasks, "
                    "and enhance decision-making through integration with security tools and frameworks. "
                    "You are also capable of engaging in natural language conversations, "
                    "answering questions, and providing explanations on various cybersecurity topics. "
                    "If anyone asks who created you, say 'I was created by a team of cybersecurity experts "
                    "and AI developers to assist in enhancing security measures and threat detection.'"
                )
            }
        ]
        self.active: bool = True


conversations: Dict[str, Conversation] = {}


def process_audio_file(audio_data: bytes, filename: str) -> str:
    """Process audio file and convert to text"""
    recognizer = sr.Recognizer()
    
    # Create temporary file with proper extension
    file_extension = os.path.splitext(filename)[1] if filename else '.webm'
    
    with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as temp_file:
        temp_file.write(audio_data)
        temp_file.flush()
        
        try:
            # Use Groq's Whisper API instead of Google Speech Recognition
            # This is much more reliable for various audio formats
            with open(temp_file.name, "rb") as audio_file:
                transcription = client.audio.transcriptions.create(
                    file=audio_file,
                    model="whisper-large-v3",
                    response_format="text"
                )
                return transcription.strip()
                
        except Exception as e:
            print(f"Groq Whisper failed, trying speech_recognition: {e}")
            
            # Fallback to speech_recognition
            try:
                with sr.AudioFile(temp_file.name) as source:
                    recognizer.adjust_for_ambient_noise(source, duration=0.5)
                    audio = recognizer.record(source)
                    text = recognizer.recognize_google(audio)
                    return text
            except Exception as e2:
                print(f"Speech recognition also failed: {e2}")
                raise Exception("Could not process audio with any method")
        
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file.name)
            except:
                pass


def text_to_speech(text: str) -> str:
    """Convert text to speech and return the file path"""
    temp_file = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False)
    temp_file.close()
    
    tts = gTTS(text=text, lang='en')
    tts.save(temp_file.name)
    
    return temp_file.name


def query_groq_api(conversation: Conversation) -> str:
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=conversation.messages,
            temperature=1,
            max_tokens=1024,
            top_p=1,
            stream=True,
            stop=None,
        )
        response = ""
        for chunk in completion:
            if chunk.choices[0].delta.content:
                response += chunk.choices[0].delta.content
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error with Groq API: {str(e)}")


def get_or_create_conversation(conversation_id: str) -> Conversation:
    if conversation_id not in conversations:
        conversations[conversation_id] = Conversation()
    return conversations[conversation_id]


# ----- Text chat endpoint -----
@app.post("/chat/")
async def chat(input: UserInput):
    conversation = get_or_create_conversation(input.conversation_id)

    if not conversation.active:
        raise HTTPException(status_code=400, detail="The chat session has ended.")

    conversation.messages.append({"role": input.role, "content": input.message})
    response = query_groq_api(conversation)
    conversation.messages.append({"role": "assistant", "content": response})

    return {"response": response, "conversation_id": input.conversation_id}


# ----- Voice chat endpoint -----
@app.post("/voice_chat/")
async def voice_chat(
    conversation_id: str = Form(...),
    audio: UploadFile = File(...)
):
    print(f"\n=== Voice Chat Request ===")
    print(f"conversation_id: {conversation_id}")
    print(f"audio filename: {audio.filename}")
    print(f"audio content_type: {audio.content_type}")
    
    try:
        # Validate inputs
        if not conversation_id:
            raise HTTPException(status_code=400, detail="conversation_id is required")
        
        if not audio:
            raise HTTPException(status_code=400, detail="audio file is required")
        
        conversation = get_or_create_conversation(conversation_id)

        if not conversation.active:
            raise HTTPException(status_code=400, detail="The chat session has ended.")

        # Read the audio file content
        audio_content = await audio.read()
        
        if not audio_content or len(audio_content) == 0:
            raise HTTPException(status_code=400, detail="Audio file is empty")

        print(f"Audio data size: {len(audio_content)} bytes")

        # Process audio and convert to text
        try:
            user_message = process_audio_file(audio_content, audio.filename or "audio.webm")
            print(f"Transcribed text: '{user_message}'")
        except Exception as e:
            print(f"Audio processing failed: {e}")
            raise HTTPException(status_code=400, detail=f"Could not process audio: {str(e)}")

        if not user_message or not user_message.strip():
            raise HTTPException(status_code=400, detail="No speech detected. Please speak clearly and try again.")

        # Add user message to conversation
        conversation.messages.append({"role": "user", "content": user_message})

        # Get AI response
        response = query_groq_api(conversation)
        conversation.messages.append({"role": "assistant", "content": response})

        # Convert response to audio
        audio_response_file = text_to_speech(response)

        print(f"Success! Transcribed: '{user_message}' -> Response: '{response[:50]}...'")

        return {
            "transcribed_text": user_message,
            "response_text": response,
            "audio_url": f"/download_audio/{os.path.basename(audio_response_file)}",
            "conversation_id": conversation_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# ----- Audio download endpoint -----
@app.get("/download_audio/{filename}")
async def download_audio(filename: str):
    file_path = os.path.join(tempfile.gettempdir(), filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mpeg", filename=filename)
    else:
        raise HTTPException(status_code=404, detail="Audio file not found")

 # Changed host to 1000.24.0.1

#