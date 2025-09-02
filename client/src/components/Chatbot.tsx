import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Send, ArrowLeft, Bot, User, Paperclip, MoreHorizontal, Mic, Square } from 'lucide-react';

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
  timestamp?: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId] = useState(() => Date.now().toString());
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState<string>("unknown");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize media recorder
  useEffect(() => {
    const initMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 44100,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        streamRef.current = stream;
        setMicrophonePermission("granted");
        
        const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' :
                         MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' :
                         MediaRecorder.isTypeSupported('audio/ogg') ? 'audio/ogg' : '';
        
        console.log("Using MIME type:", mimeType);
        
        const recorder = new MediaRecorder(stream, {
          mimeType: mimeType || undefined
        });
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            console.log("Audio chunk received:", event.data.size, "bytes");
            audioChunksRef.current.push(event.data);
          }
        };
        
        recorder.onstop = async () => {
          console.log("Recording stopped, chunks:", audioChunksRef.current.length);
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            console.log("Created blob:", audioBlob.size, "bytes, type:", audioBlob.type);
            await sendVoiceMessage(audioBlob);
            audioChunksRef.current = [];
          }
          setIsRecording(false);
        };
        
        recorder.onerror = (event) => {
          console.error("MediaRecorder error:", event);
          setIsRecording(false);
        };
        
        mediaRecorderRef.current = recorder;
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setMicrophonePermission("denied");
        setMessages((prev) => [
          ...prev,
          { 
            role: "error", 
            content: "Microphone access denied. Please allow microphone permissions to use voice input.",
            timestamp: new Date()
          },
        ]);
      }
    };

    initMediaRecorder();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      audioChunksRef.current = [];
      console.log("Starting recording...");
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log("Stopping recording...");
      mediaRecorderRef.current.stop();
    }
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    setLoading(true);
    
    try {
      console.log("Sending voice message, blob size:", audioBlob.size);
      
      const formData = new FormData();
      formData.append('conversation_id', conversationId); // conversationId must be a string
      formData.append('audio', audioBlob, 'audio.webm');  // audioBlob is a Blob/File

      console.log("Sending request to backend...");
      const response = await fetch(`http://localhost:1000/voice_chat/`, {
        method: "POST",
        body: formData
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Response data:", data);

      const userMessage: Message = { 
        role: "user", 
        content: data.transcribed_text || "Voice message",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, userMessage]);
      
      const botMessage: Message = { 
        role: "assistant", 
        content: data.response_text || "I received your voice message",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
      
      if (data.audio_url) {
        try {
          const audio = new Audio(`http://localhost:1000${data.audio_url}`);
          audio.play().catch(err => console.error("Error playing audio:", err));
        } catch (audioError) {
          console.error("Error creating audio:", audioError);
        }
      }
    } catch (err) {
      console.error("Error sending voice message:", err);
      setMessages((prev) => [
        ...prev,
        { 
          role: "error", 
          content: `Failed to process voice message: ${err instanceof Error ? err.message : 'Unknown error'}`,
          timestamp: new Date()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:1000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          role: "user",
          conversation_id: conversationId,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      const botMessage: Message = { 
        role: "assistant", 
        content: data.response || "I received your message",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { 
          role: "error", 
          content: `Network error: ${err instanceof Error ? err.message : 'Unknown error'}`,
          timestamp: new Date()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-emerald-300">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-neutral-700/30 bg-neutral-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => (window.location.href = "/home")}
            className="group flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Bot className="h-4 w-4 text-neutral-900" />
          </div>
          <span className="text-emerald-200 font-medium">AstraAI</span>
        </div>
        
        <button className="p-2 hover:bg-neutral-700/50 rounded-xl transition-colors">
          <MoreHorizontal className="h-5 w-5 text-emerald-400" />
        </button>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                <Bot className="h-8 w-8 text-neutral-900" />
              </div>
              <h1 className="text-2xl font-bold text-emerald-200 mb-4">Welcome to AstraAI</h1>
              <p className="text-emerald-300/80 max-w-md mb-8">
                Your intelligent guardian in the digital realm. I'm here to help you detect, analyze, and respond to cyber threats with real-time insights and smart defense.
              </p>
              
              {microphonePermission === "denied" && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-600/50 rounded-xl max-w-md">
                  <p className="text-red-300 text-sm">
                    Microphone access is required for voice features. Please enable microphone permissions in your browser settings.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                <button
                  onClick={() => setInput("Analyze this suspicious email for phishing attempts")}
                  className="p-4 text-left border border-neutral-700/50 rounded-xl hover:border-emerald-500/30 hover:bg-neutral-800/50 transition-all duration-200 text-emerald-200 backdrop-blur-sm"
                >
                  <div className="font-medium mb-1">Analyze suspicious emails</div>
                  <div className="text-sm text-emerald-300/70">Check for phishing attempts</div>
                </button>
                
                <button
                  onClick={() => setInput("What are the latest cybersecurity threats I should know about?")}
                  className="p-4 text-left border border-neutral-700/50 rounded-xl hover:border-emerald-500/30 hover:bg-neutral-800/50 transition-all duration-200 text-emerald-200 backdrop-blur-sm"
                >
                  <div className="font-medium mb-1">Latest security threats</div>
                  <div className="text-sm text-emerald-300/70">Stay updated on cyber risks</div>
                </button>
                
                <button
                  onClick={() => setInput("How can I secure my network infrastructure?")}
                  className="p-4 text-left border border-neutral-700/50 rounded-xl hover:border-emerald-500/30 hover:bg-neutral-800/50 transition-all duration-200 text-emerald-200 backdrop-blur-sm"
                >
                  <div className="font-medium mb-1">Network security</div>
                  <div className="text-sm text-emerald-300/70">Protect your infrastructure</div>
                </button>
                
                <button
                  onClick={() => setInput("Explain common social engineering tactics")}
                  className="p-4 text-left border border-neutral-700/50 rounded-xl hover:border-emerald-500/30 hover:bg-neutral-800/50 transition-all duration-200 text-emerald-200 backdrop-blur-sm"
                >
                  <div className="font-medium mb-1">Social engineering</div>
                  <div className="text-sm text-emerald-300/70">Learn about common tactics</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 max-w-4xl mx-auto w-full space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className="flex gap-4 animate-fade-in">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
                      msg.role === "user" 
                        ? "bg-emerald-600" 
                        : msg.role === "assistant"
                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                        : "bg-red-600"
                    }`}>
                      {msg.role === "user" ? (
                        <User className="h-4 w-4 text-neutral-900" />
                      ) : msg.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-neutral-900" />
                      ) : (
                        <span className="text-xs text-white">!</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span className="text-sm font-medium text-emerald-200">
                        {msg.role === "user" ? "You" : msg.role === "assistant" ? "AstraAI" : "System"}
                      </span>
                    </div>
                    <div className="prose prose-emerald max-w-none">
                      <div className={`text-emerald-100 whitespace-pre-wrap leading-relaxed ${
                        msg.role === "error" ? "text-red-300" : ""
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                      <Bot className="h-4 w-4 text-neutral-900" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span className="text-sm font-medium text-emerald-200">AstraAI</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-300">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm">Processing voice...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-700/30 p-4 bg-neutral-800/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3">
              <button className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-neutral-700/50 rounded-xl transition-colors mb-2">
                <Paperclip className="h-5 w-5" />
              </button>
              
              <div className="flex-1">
                <textarea
                  rows={1}
                  className="w-full p-3 bg-neutral-800/50 border border-neutral-600/50 rounded-xl resize-none text-emerald-100 placeholder-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 min-h-[44px] max-h-32 backdrop-blur-sm"
                  placeholder="Message AstraAI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading || isRecording}
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>
              
              {isRecording ? (
                <div className="relative">
                  <div className="absolute -inset-2 bg-red-500/20 rounded-full animate-pulse"></div>
                  <button
                    onClick={stopRecording}
                    className="relative p-2 bg-red-600 hover:bg-red-500 rounded-xl transition-colors mb-2 flex items-center justify-center min-w-[40px] h-10 shadow-sm z-10"
                  >
                    <Square className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={startRecording}
                  disabled={loading || microphonePermission === "denied"}
                  className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-neutral-700/50 disabled:hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors mb-2 flex items-center justify-center min-w-[40px] h-10"
                >
                  <Mic className="h-5 w-5" />
                </button>
              )}
              
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim() || isRecording}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-xl transition-colors mb-2 flex items-center justify-center min-w-[40px] h-10 shadow-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4 text-neutral-900" />
                )}
              </button>
            </div>
            
            <div className="mt-2 text-xs text-emerald-400/70 text-center">
              {isRecording ? (
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  Recording... Click to stop
                </div>
              ) : microphonePermission === "denied" ? (
                "Microphone access denied. Please enable microphone permissions to use voice features."
              ) : (
                "AstraAI can make mistakes. Verify important security information."
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .prose-green {
          color: rgb(134 239 172);
        }
      `}</style>
    </div>
  );
}