import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Loader2 } from 'lucide-react';

interface InputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
}

const Input: React.FC<InputProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled) return;

    const messageToSend = message.trim();
    setMessage('');
    
    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      // Error handling is done in the parent component
      setMessage(messageToSend); // Restore message on error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-black/90 backdrop-blur-sm border-t border-cyan-500/30">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={disabled ? "Connecting..." : "Type your message..."}
            disabled={disabled || isLoading}
            className="w-full bg-gray-900/50 border border-cyan-500/50 rounded-lg px-4 py-3 text-cyan-100 placeholder-cyan-500/40 font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            maxLength={1000}
          />
          
          {/* Focus glow effect */}
          {isFocused && !disabled && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-sm -z-10 animate-pulse"></div>
          )}
          
          {/* Typing indicator */}
          {message && !disabled && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-600 text-white font-mono font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
      
      {/* Command hint */}
      <div className="mt-2 text-xs text-cyan-500/60 font-mono">
        Press Enter to send • Shift+Enter for new line
      </div>
    </div>
  );
};

export default Input;