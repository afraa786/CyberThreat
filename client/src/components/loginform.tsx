import React, { useState } from 'react';
import { Terminal, Zap, Loader2 } from 'lucide-react';
import { LoginRequest, ApiError } from '../types';
interface LoginFormProps {
  onLogin: (loginData: LoginRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => {
  const [username, setUsername] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsGlitching(true);
    try {
      await onLogin({ username: username.trim() });
    } finally {
      setTimeout(() => setIsGlitching(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)] animate-pulse"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8 shadow-2xl shadow-cyan-500/20">
          {/* Terminal header */}
          <div className="flex items-center mb-6 pb-4 border-b border-cyan-500/30">
            <Terminal className="w-6 h-6 text-cyan-400 mr-3" />
            <h1 className={`text-xl font-orbitron font-bold text-cyan-400 ${isGlitching ? 'animate-pulse' : ''}`}>
              CYBERCHAT TERMINAL
            </h1>
          </div>

          {/* ASCII Art */}
          <div className="text-center mb-6">
            <pre className="text-cyan-400 text-xs font-mono leading-tight opacity-60">
{`    ╭─────────────────╮
    │ ACCESS REQUIRED │
    ╰─────────────────╯`}
            </pre>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-mono text-cyan-400 mb-2">
                &gt; ENTER USERNAME_
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_handle"
                  className="w-full bg-black/50 border border-cyan-500/50 rounded px-4 py-3 text-cyan-100 placeholder-cyan-500/40 font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <div className="absolute inset-0 rounded bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite] pointer-events-none"></div>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded p-3 animate-pulse">
                <p className="text-red-400 text-sm font-mono">
                  ERROR: {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className={`w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-600 text-white font-mono font-bold py-3 px-6 rounded transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 ${
                isLoading ? 'animate-pulse' : ''
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>CONNECTING...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>JACK IN</span>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-cyan-500/60 text-xs font-mono">
              Welcome to the neural network...
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;   