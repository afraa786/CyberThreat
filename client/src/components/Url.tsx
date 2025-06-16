import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, ExternalLink, Search, Lock, Unlock } from 'lucide-react';

const URLAnalyzer: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{
    url: string;
    score: number;
    analyzed: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeURL = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    
    // Simulate API call with random score between 0 and 1 (matching your original logic)
    setTimeout(() => {
      const score = Math.random();
      
      setResult({
        url: url.trim(),
        score,
        analyzed: true
      });
      setIsLoading(false);
    }, 1500);
  };

  const openURL = () => {
    if (result?.url) {
      window.open(result.url, '_blank');
    }
  };

  // Logic exactly matching your original HTML/CSS
  const getDisplayPercentage = () => {
    if (!result) return 0;
    let num = result.score * 100;
    if (result.score >= 0 && result.score < 0.50) {
      num = 100 - num; // For unsafe URLs, show as unsafe percentage
    }
    return Math.round(num);
  };

  const isSafe = () => {
    return result && result.score >= 0.50;
  };

  const getSafetyMessage = () => {
    if (!result) return '';
    const percentage = getDisplayPercentage();
    return isSafe() ? 
      `Website is ${percentage}% safe to use...` : 
      `Website is ${percentage}% unsafe to use...`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800">
      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <Shield className="h-8 w-8 text-emerald-400" />
              <div className="absolute -top-1 -right-1 h-3 w-3">
                <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></div>
                <div className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-neutral-100">PHISHING URL DETECTION</h1>
          </div>
          
          <p className="text-neutral-400 text-lg">
            Analyze any URL for potential phishing threats and security risks using our advanced AI detection system.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Analysis Form */}
          <div className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-neutral-100 mb-6 flex items-center space-x-2">
                <Search className="h-5 w-5 text-emerald-400" />
                <span>URL Analysis</span>
              </h2>
              
              <form onSubmit={analyzeURL} className="space-y-6">
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL to analyze..."
                    required
                    className="w-full px-4 py-4 bg-neutral-900/50 border border-neutral-600 rounded-xl text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300 text-lg"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="group w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-neutral-900 border-t-transparent"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5" />
                        <span>Check here</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-neutral-100 mb-6 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-emerald-400" />
                <span>Analysis Results</span>
              </h2>
              
              {!result ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-700/50 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-neutral-500" />
                  </div>
                  <p className="text-neutral-400 text-lg">
                    Enter a URL above to begin security analysis
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* URL Display */}
                  <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-600">
                    <p className="text-sm text-neutral-400 mb-1">Analyzed URL:</p>
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-mono text-sm break-all underline"
                    >
                      {result.url}
                    </a>
                  </div>
                  
                  {/* Safety Score */}
                  <div className={`p-6 rounded-xl border-2 ${
                    isSafe() 
                      ? 'bg-emerald-900/20 border-emerald-500/50' 
                      : 'bg-red-900/20 border-red-500/50'
                  }`}>
                    <div className="flex items-center space-x-3 mb-4">
                      {isSafe() ? (
                        <Lock className="h-8 w-8 text-emerald-400" />
                      ) : (
                        <Unlock className="h-8 w-8 text-red-400" />
                      )}
                      <div>
                        <h3 className={`text-xl font-bold ${
                          isSafe() ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {getDisplayPercentage()}% {isSafe() ? 'Safe' : 'Unsafe'}
                        </h3>
                        <p className="text-neutral-300">
                          {getSafetyMessage()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-neutral-700 rounded-full h-3 mb-4">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          isSafe() ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${getDisplayPercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Action Button - Conditional display matching your original logic */}
                  {isSafe() ? (
                    <button
                      onClick={openURL}
                      className="group w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 relative overflow-hidden shadow-lg shadow-emerald-500/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative flex items-center justify-center space-x-2">
                        <ExternalLink className="h-5 w-5" />
                        <span>Continue</span>
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={openURL}
                      className="group w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-400 hover:to-red-500 transition-all duration-300 relative overflow-hidden shadow-lg shadow-red-500/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative flex items-center justify-center space-x-2">
                        <ExternalLink className="h-5 w-5" />
                        <span>Still want to Continue</span>
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-12 text-neutral-500">
          <p>©2024 CyberThreat Security Platform</p>
        </div>
      </div>
    </div>
  );
};

export default URLAnalyzer;