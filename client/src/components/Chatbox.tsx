import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Wifi, WifiOff, MessageCircle } from 'lucide-react';
import { WebSocketService, ChatMessage, sendMessageREST } from '../utils';

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const webSocketService = useRef<WebSocketService | null>(null);

  useEffect(() => {
    // Initialize WebSocket service
    webSocketService.current = new WebSocketService();
    
    webSocketService.current.onMessage((message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    webSocketService.current.onConnectionChange((connected: boolean) => {
      setIsConnected(connected);
      if (!connected) {
        setError('Connection lost. Trying to reconnect...');
      } else {
        setError(null);
      }
    });

    return () => {
      webSocketService.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
      webSocketService.current?.connect();
      
      // Send new user notification after a brief delay to ensure connection
      setTimeout(() => {
        webSocketService.current?.sendNewUser(username);
      }, 1000);
    }
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    const message: ChatMessage = {
      sender: username,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    setIsLoading(true);
    setError(null);

    try {
      // Try WebSocket first, fallback to REST if needed
      if (webSocketService.current?.isConnected()) {
        webSocketService.current.sendMessage(message);
      } else {
        await sendMessageREST(message);
      }
      setNewMessage('');
    } catch (error) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStyle = (message: ChatMessage) => {
    if (message.type === 'join') {
      return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
    }
    if (message.type === 'leave') {
      return 'bg-red-500/10 border-red-500/20 text-red-300';
    }
    return message.sender === username 
      ? 'bg-emerald-600/20 border-emerald-500/30 ml-auto max-w-[80%]' 
      : 'bg-gray-700/50 border-gray-600/30 mr-auto max-w-[80%]';
  };

  if (!isUsernameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Chat</h1>
            <p className="text-gray-400">Enter your username to start chatting</p>
          </div>

          <form onSubmit={handleUsernameSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all duration-200 peer"
                placeholder="Enter your username"
                required
              />
              <label className="absolute left-4 -top-2.5 text-sm text-emerald-400 bg-gray-800 px-2 rounded transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-emerald-400 peer-focus:bg-gray-800">
                Username
              </label>
            </div>

            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              Start Chatting
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-t-2xl border border-gray-700/50 border-b-0 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Live Chat</h1>
              <p className="text-sm text-gray-400">Connected as {username}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Online</span>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              isConnected 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isConnected ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-gray-800/30 backdrop-blur-lg border-x border-gray-700/50 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm text-center">
                {error}
              </div>
            )}
            
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === username ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-2xl p-4 border backdrop-blur-sm shadow-lg max-w-xs sm:max-w-md ${getMessageStyle(message)}`}>
                    {message.type === 'message' && message.sender !== username && (
                      <p className="text-xs text-gray-400 mb-1 font-medium">{message.sender}</p>
                    )}
                    <p className="text-white text-sm leading-relaxed break-words">{message.content}</p>
                    <p className="text-xs text-gray-400 mt-2 text-right">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-b-2xl border border-gray-700/50 border-t-0 p-4">
          <form onSubmit={handleMessageSubmit} className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all duration-200 peer pr-12"
                placeholder="Type your message..."
                disabled={!isConnected || isLoading}
                required
              />
              <label className="absolute left-4 -top-2.5 text-sm text-emerald-400 bg-gray-800 px-2 rounded transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-emerald-400 peer-focus:bg-gray-800">
                Type your message...
              </label>
            </div>
            
            <button
              type="submit"
              disabled={!newMessage.trim() || !isConnected || isLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;