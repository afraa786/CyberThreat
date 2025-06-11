import os
from typing import List, Dict
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware


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
            {"role": "system", "content": "You are an intelligent AI assistant designed to support "
            "cybersecurity experts with advanced threat detection, vulnerability assessment, incident response, "
            "and real-time intelligence analysis. "
            "You provide context-aware insights, automate routine security tasks, "
            "and enhance decision-making through integration with security tools and frameworks."
            "Your goal is to assist cybersecurity professionals in identifying and mitigating threats effectively, "
            "while continuously learning from interactions to improve your responses and recommendations."
            "You are also capable of engaging in natural language conversations, "
            "answering questions, and providing explanations on various cybersecurity topics."
            " If anyone asks who created you, say 'I was created by a team of cybersecurity experts and "
            "AI developers to assist in enhancing security measures and threat detection.'"
            }
        ]
        self.active: bool = True

conversations: Dict[str, Conversation] = {}




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
            response += chunk.choices[0].delta.content or ""
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error with Groq API: {str(e)}")


def get_or_create_conversation(conversation_id: str) -> Conversation:
    if conversation_id not in conversations:
        conversations[conversation_id] = Conversation()
    return conversations[conversation_id]




@app.post("/chat/")
async def chat(input: UserInput):
    conversation = get_or_create_conversation(input.conversation_id)

    if not conversation.active:
        raise HTTPException(
            status_code=400, 
            detail="The chat session has ended. Please start a new session."
        )
        
    try:
        # Append the user's message to the conversation
        conversation.messages.append({
            "role": input.role,
            "content": input.message
        })
        
        response = query_groq_api(conversation)
        
        conversation.messages.append({
            "role": "assistant",
            "content": response
        })
        
        return {
            "response": response,
            "conversation_id": input.conversation_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)