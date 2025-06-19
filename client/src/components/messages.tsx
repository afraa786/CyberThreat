import React, { useEffect, useRef } from 'react';
import { User, MessageSquare, Clock } from 'lucide-react';
import { Message } from '../types';

interface MessagesProps {
  messages: Message[];
  currentUser: string;
  isLoading: boolean;
}

const Messages: React.FC<MessagesProps> = ({ messages, currentUser, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-cyan-400 font-mono">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-cyan-500/30 mx-auto mb-4" />
            <p className="text-cyan-500/60 font-mono">No messages yet. Start the conversation!</p>
          </div>
        </div>
      ) : (
        messages.map((message) => {
          const isCurrentUser = message.username === currentUser;
          
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg relative group transition-all duration-300 ${
                  isCurrentUser
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-gray-800/80 text-cyan-100 border border-cyan-500/20 shadow-lg shadow-gray-900/20'
                }`}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isCurrentUser ? 'bg-cyan-400/10' : 'bg-gray-700/20'
                } blur-sm -z-10`}></div>
                
                {/* Username */}
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 mr-2 opacity-70" />
                  <span className={`text-sm font-mono font-bold ${
                    isCurrentUser ? 'text-cyan-100' : 'text-cyan-400'
                  }`}>
                    {message.username}
                  </span>
                </div>
                
                {/* Message content */}
                <p className="text-sm font-mono leading-relaxed mb-2">
                  {message.content}
                </p>
                
                {/* Timestamp */}
                <div className="flex items-center justify-end">
                  <Clock className="w-3 h-3 mr-1 opacity-50" />
                  <span className={`text-xs font-mono opacity-70 ${
                    isCurrentUser ? 'text-cyan-100' : 'text-cyan-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                
                {/* Message indicator */}
                <div className={`absolute top-3 ${isCurrentUser ? '-left-2' : '-right-2'} w-0 h-0 ${
                  isCurrentUser 
                    ? 'border-r-8 border-r-cyan-600 border-t-4 border-t-transparent border-b-4 border-b-transparent'
                    : 'border-l-8 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent'
                }`}></div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;