import React from 'react';
import { Wifi, WifiOff, Terminal, LogOut, Users } from 'lucide-react';

interface ChatHeaderProps {
  username: string;
  isConnected: boolean;
  onLogout: () => void;
  messageCount: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  username, 
  isConnected, 
  onLogout,
  messageCount 
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm border-b border-cyan-500/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-orbitron font-bold text-cyan-400">
              CYBERCHAT
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400 animate-pulse" />
              )}
              <span className={`font-mono ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-cyan-400">
              <Users className="w-4 h-4" />
              <span className="font-mono">{messageCount}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-cyan-400">
            <span className="text-sm font-mono">USER: </span>
            <span className="font-mono font-bold">{username}</span>
          </div>
          
          <button
            onClick={onLogout}
            className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-mono text-sm">EXIT</span>
          </button>
        </div>
      </div>
      
      {/* Status bar */}
      <div className="mt-3 flex items-center justify-between text-xs text-cyan-500/60 font-mono">
        <div>
          Terminal session active • Real-time messaging enabled
        </div>
        <div>
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;