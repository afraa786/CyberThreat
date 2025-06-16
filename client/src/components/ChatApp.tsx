import React, { useState, useEffect, useRef } from 'react';
import { Client, Message, over } from 'stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
  type: 'MESSAGE' | 'JOIN' | 'LEAVE' | 'ERROR';
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Gradient background style
  const gradientBg = {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  };

  // Connect to WebSocket
  const connect = () => {
    setIsJoining(true);
    const socket = new SockJS('http://localhost:8080/ws');
    stompClientRef.current = over(socket);
    
    stompClientRef.current.connect({}, () => {
      setConnected(true);
      setIsJoining(false);
      
      // Subscribe to public messages
      stompClientRef.current?.subscribe('/topic/group', (message: Message) => {
        const receivedMessage: ChatMessage = JSON.parse(message.body);
        setMessages(prev => [...prev, receivedMessage]);
      });

      // Send join notification
      stompClientRef.current?.send('/app/newUser', {}, JSON.stringify({
        sender: username,
        type: 'JOIN'
      }));
      
    }, (err: any) => {
      setError('Failed to connect to chat server');
      setIsJoining(false);
      console.error(err);
    });
  };

  // Disconnect from WebSocket
  const disconnect = () => {
    if (stompClientRef.current && connected) {
      stompClientRef.current.send('/app/sendMessage', {}, JSON.stringify({
        sender: username,
        type: 'LEAVE'
      }));
      stompClientRef.current.disconnect(() => {
        // Disconnected callback (optional)
      });
    }
    setConnected(false);
    setUsername('');
  };

  // Send message via WebSocket
  const sendMessage = () => {
    if (messageInput.trim() && stompClientRef.current && connected) {
      const chatMessage: ChatMessage = {
        sender: username,
        content: messageInput,
        timestamp: new Date().toISOString(),
        type: 'MESSAGE'
      };
      
      stompClientRef.current.send('/app/sendMessage', {}, JSON.stringify(chatMessage));
      setMessageInput('');
    }
  };

  // Fallback to REST if WebSocket fails
  const sendMessageViaRest = async () => {
    if (messageInput.trim() && username) {
      try {
        await axios.post('/api/send', {
          sender: username,
          content: messageInput,
          type: 'MESSAGE'
        });
        setMessageInput('');
      } catch (err) {
        setError('Failed to send message');
      }
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (connected) {
      sendMessage();
    } else {
      sendMessageViaRest();
    }
  };

  // Determine message color based on type
  const getMessageColor = (type: ChatMessage['type']) => {
    switch (type) {
      case 'JOIN':
        return 'text-emerald-400';
      case 'LEAVE':
        return 'text-red-400';
      case 'ERROR':
        return 'text-red-500';
      default:
        return 'text-gray-200';
    }
  };

  return (
    <div 
      className="flex flex-col h-screen p-4 max-w-4xl mx-auto"
      style={gradientBg}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Group Chat</h1>
        {connected ? (
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
          >
            Leave Chat
          </button>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="px-4 py-2 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            />
            <button
              onClick={connect}
              disabled={!username.trim() || isJoining}
              className={`px-4 py-2 rounded-lg text-white transition-all duration-300 hover:shadow-lg ${
                !username.trim() || isJoining
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30'
              }`}
            >
              {isJoining ? 'Joining...' : 'Join Chat'}
            </button>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg text-red-200">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="float-right text-white hover:text-gray-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            {connected ? 'Send a message to start chatting!' : 'Join the chat to see messages'}
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${msg.type === 'MESSAGE' ? 'bg-gray-700 bg-opacity-60' : 'bg-gray-800 bg-opacity-40'}`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className={`font-semibold ${getMessageColor(msg.type)}`}>
                    {msg.sender}
                    {msg.type === 'JOIN' && ' joined'}
                    {msg.type === 'LEAVE' && ' left'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {msg.type === 'MESSAGE' && (
                  <p className="text-gray-100">{msg.content}</p>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      {connected && (
        <form onSubmit={handleSubmit} className="mt-auto">
          <div className="relative">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-gray-700 bg-opacity-70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-transparent peer"
              id="messageInput"
            />
            <label
              htmlFor="messageInput"
              className="absolute left-4 -top-2.5 bg-gray-800 px-1 text-sm text-emerald-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-emerald-400"
            >
              Type your message...
            </label>
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className={`absolute right-2 top-2 p-1.5 rounded-md transition-all ${
                !messageInput.trim()
                  ? 'text-gray-500'
                  : 'text-emerald-400 hover:text-white hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/30'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChatApp;