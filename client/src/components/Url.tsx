import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, ExternalLink, Search, Lock, Unlock, Globe, Clock, CheckCircle, XCircle } from 'lucide-react';

interface AnalysisResult {
  url: string;
  score: number;
  analyzed: boolean;
  threats: string[];
  domain: string;
  timestamp: string;
}

const URLAnalyzer: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

const analyzeURL = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!url.trim()) return;

  setIsLoading(true);

  try {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.trim() }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze URL');
    }

    const data = await response.json();

    const threats = data.prediction === "phishing"
      ? ['Potential phishing detected', 'Malicious patterns found']
      : ['No phishing detected', 'Secure domain'];

    setResult({
      url: url.trim(),
      score: data.probabilities.safe, // use "safe" probability for frontend confidence
      analyzed: true,
      threats: threats,
      domain: new URL(url.trim()).hostname,
      timestamp: new Date().toLocaleString(),
    });
  } catch (error) {
    console.error('Error analyzing URL:', error);
    alert('Error connecting to backend: ' + error);
  } finally {
    setIsLoading(false);
  }
};


  const openURL = () => {
    if (result?.url) {
      window.open(result.url, '_blank');
    }
  };

  const getDisplayPercentage = () => {
    if (!result) return 0;
    let num = result.score * 100;
    if (result.score >= 0 && result.score < 0.50) {
      num = 100 - num;
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
      `Website is ${percentage}% safe to use` : 
      `Website is ${percentage}% unsafe to use`;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
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
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-neutral-100">URL Security Analyzer</h1>
        </div>
        
        <p className="text-neutral-400 text-lg">
          Analyze any URL for potential phishing threats and security risks using our advanced AI detection system.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Analysis Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl"
        >
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
                  placeholder="Enter URL to analyze (e.g., https://example.com)"
                  required
                  className="w-full px-4 py-4 bg-neutral-900/50 border border-neutral-600 rounded-xl text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300 text-lg"
                />
                <Globe className="absolute right-4 top-4 h-5 w-5 text-neutral-500" />
              </div>
              
              <motion.button
                type="submit"
                disabled={isLoading || !url.trim()}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="rounded-full h-5 w-5 border-2 border-neutral-900 border-t-transparent"
                      />
                      <span>Analyzing Security...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      <span>Analyze URL Security</span>
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-neutral-100 mb-6 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-emerald-400" />
              <span>Security Analysis Results</span>
            </h2>
            
            {!result ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-full bg-neutral-700/50 flex items-center justify-center mb-4"
                >
                  <Search className="h-8 w-8 text-neutral-500" />
                </motion.div>
                <p className="text-neutral-400 text-lg">
                  Enter a URL above to begin comprehensive security analysis
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* URL Details */}
                <div className="grid gap-4">
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-600">
                      <p className="text-sm text-neutral-400 mb-1">Domain:</p>
                      <p className="text-neutral-100 font-mono text-sm">{result.domain}</p>
                    </div>
                    <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-600">
                      <p className="text-sm text-neutral-400 mb-1">Analyzed:</p>
                      <p className="text-neutral-100 text-sm flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{result.timestamp}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Safety Score */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`p-6 rounded-xl border-2 ${
                    isSafe() 
                      ? 'bg-emerald-900/20 border-emerald-500/50' 
                      : 'bg-red-900/20 border-red-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {isSafe() ? (
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-400" />
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
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${getDisplayPercentage()}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-3 rounded-full ${
                        isSafe() ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </motion.div>
                
                {/* Threat Analysis */}
                <div className="p-6 bg-neutral-900/30 rounded-xl border border-neutral-600">
                  <h4 className="text-lg font-semibold text-neutral-100 mb-4">Threat Analysis</h4>
                  <div className="space-y-2">
                    {result.threats.map((threat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-2"
                      >
                        {isSafe() ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-neutral-300 text-sm">{threat}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openURL}
                  className={`group w-full py-4 px-6 font-semibold rounded-xl transition-all duration-300 relative overflow-hidden shadow-lg ${
                    isSafe()
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 hover:from-emerald-400 hover:to-emerald-500 shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-red-500/20'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center space-x-2">
                    <ExternalLink className="h-5 w-5" />
                    <span>{isSafe() ? 'Continue to Website' : 'Proceed with Caution'}</span>
                  </span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default URLAnalyzer;