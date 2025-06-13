import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Send, Zap, Shield, AlertTriangle } from 'lucide-react';

interface Message {
  role: "system" | "user" | "assistant" | "error";
  content: string;
  timestamp?: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "system", 
      content: "Hey I am AstraAi — your intelligent guardian in the digital realm, empowering you to detect, analyze, and respond to cyber threats with real-time insights and smart defense. So, what is your query?",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [conversationId] = useState(() => Date.now().toString());
  const [loading, setLoading] = useState(false);
  const [glitchText, setGlitchText] = useState("AstraAI");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Glitch effect for the title
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const originalText = "AstraAI";
    
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        const glitched = originalText
          .split('')
          .map(char => Math.random() < 0.3 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char)
          .join('');
        setGlitchText(glitched);
        
        setTimeout(() => setGlitchText(originalText), 100);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

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
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          role: "user",
          conversation_id: conversationId,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        const botMessage: Message = { 
          role: "assistant", 
          content: data.response,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMsg = data.detail || "Neural link severed. Attempting reconnection...";
        setMessages((prev) => [
          ...prev,
          { 
            role: "error", 
            content: errorMsg,
            timestamp: new Date()
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { 
          role: "error", 
          content: "Network anomaly detected. Try again.",
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Glitch overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 flex flex-col h-screen">
        {/* Header */}
        <div className="mb-8 text-center relative">
          <div className="inline-block relative">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400 bg-clip-text text-transparent">
              {glitchText}
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400 rounded-lg blur opacity-25 animate-pulse"></div>
          </div>
          <p className="text-cyan-300 text-lg tracking-wider">
            {'>'} CYBER_DEFENSE_PROTOCOL_INITIATED
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-green-400">
              <Shield className="w-4 h-4 animate-pulse" />
              <span className="text-sm">SECURE</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm">QUANTUM_LINK</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-cyan-600">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-in`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg relative overflow-hidden ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-900/80 to-purple-900/80 text-cyan-100 border border-blue-400/50"
                    : msg.role === "assistant"
                    ? "bg-gradient-to-r from-green-900/80 to-cyan-900/80 text-green-100 border border-green-400/50"
                    : "bg-gradient-to-r from-orange-900/80 to-yellow-900/80 text-orange-100 border border-orange-400/50"
                }`}
              >
                {/* Holographic effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                
                {/* Message content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    {msg.role === "user" && <span className="text-xs text-cyan-300">USER</span>}
                    {msg.role === "assistant" && <span className="text-xs text-green-300">ASTRA_AI</span>}
                    {msg.role === "error" && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                    {msg.timestamp && (
                      <span className="text-xs opacity-60 ml-auto">
                        {formatTime(msg.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>

                {/* Glowing border effect */}
                <div className={`absolute inset-0 rounded-lg opacity-50 ${
                  msg.role === "user" 
                    ? "shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                    : msg.role === "assistant"
                    ? "shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                    : "shadow-[0_0_20px_rgba(251,146,60,0.5)]"
                }`}></div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start animate-slide-in">
              <div className="bg-gradient-to-r from-green-900/80 to-cyan-900/80 text-green-100 border border-green-400/50 p-4 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">PROCESSING_NEURAL_PATTERNS...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="relative">
          <div className="flex gap-4 bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-cyan-400/30 relative overflow-hidden">
            {/* Holographic input effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-purple-500/10 animate-pulse"></div>
            
            <div className="flex-1 relative z-10">
              <textarea
                rows={2}
                className="w-full p-3 bg-black/50 border border-cyan-400/50 rounded-md resize-none text-green-400 placeholder-green-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
                placeholder="{'>'} Enter neural command..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="relative z-10 group bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-md transition-all duration-300 font-semibold text-white shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>{loading ? "SENDING..." : "TRANSMIT"}</span>
              </div>
              
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
          
          {/* Status indicators */}
          <div className="flex justify-between items-center mt-2 text-xs text-cyan-600">
            <span>ENCRYPTION: QUANTUM_LEVEL</span>
            <span>LATENCY: {loading ? "PROCESSING..." : "0.001ms"}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-track-gray-900 {
          scrollbar-color: #0891b2 #111827;
        }
      `}</style>
    </div>
  );
}