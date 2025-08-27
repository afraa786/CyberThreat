import React, { useState } from 'react';
import { Navibar } from './navbar';
import { 
  Key, 
  Copy, 
  RefreshCw, 
  CheckCircle, 
  ExternalLink, 
  Clock, 
  Activity, 
  TrendingUp, 
  Shield,
  AlertTriangle,
  Zap,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

const Tokens: React.FC = () => {
  // Navigation will be handled by parent component or routing system
  const [apiKey, setApiKey] = useState<string>('sk-live-3f4e1c9a12xx...');
  const [copied, setCopied] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [usageStats, setUsageStats] = useState({
    used: 382,
    limit: 1000,
    requestsPerSecond: 5,
    resetTime: '2023-06-18T00:00:00Z'
  });

  const regenerateKey = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const randomPart = Math.random().toString(36).substring(2, 10);
      setApiKey(`ak-live-${randomPart}12xx...`);
      setIsRegenerating(false);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey.replace('...', ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatResetTime = (timeString: string) => {
    const resetDate = new Date(timeString);
    return resetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleViewDocs = () => {
    // This will need to be implemented based on your routing setup
    window.location.href = '/docs';
  };

  const usagePercentage = (usageStats.used / usageStats.limit) * 100;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Navibar />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <Key className="h-8 w-8 text-emerald-400" />
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
          <h1 className="text-4xl font-bold text-neutral-100">API Tokens</h1>
        </div>
        
        <p className="text-neutral-400 text-xl leading-relaxed max-w-4xl">
          Manage your API authentication keys and monitor usage statistics for seamless integration 
          with our phishing detection system.
        </p>
      </motion.div>

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
        {/* API Key Management - Takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <Shield className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-neutral-100">Your API Key</h2>
            </div>
            
            {/* API Key Display */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="font-mono bg-neutral-900/70 px-6 py-4 rounded-xl border border-neutral-600 text-emerald-400 text-lg">
                    {apiKey}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent rounded-xl"></div>
                </div>
                
                <motion.button
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-6 py-4 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/20 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center space-x-2">
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
              
              {/* Regenerate Button */}
              <motion.button
                onClick={regenerateKey}
                disabled={isRegenerating}
                whileHover={!isRegenerating ? { scale: 1.02 } : {}}
                whileTap={!isRegenerating ? { scale: 0.98 } : {}}
                className={`group px-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-lg relative overflow-hidden ${
                  isRegenerating
                    ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-red-500/20'
                }`}
              >
                {!isRegenerating && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                )}
                <span className="relative flex items-center space-x-2">
                  <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Key'}</span>
                </span>
              </motion.button>
              
              <div className="mt-4 p-4 bg-amber-900/20 border border-amber-500/50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-amber-200 text-sm">
                    <strong>Warning:</strong> Regenerating your key will immediately invalidate the previous one. 
                    Update all your applications with the new key to avoid service interruptions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="h-6 w-6 text-emerald-400" />
              <h3 className="text-xl font-semibold text-neutral-100">Quick Stats</h3>
            </div>
            
            <div className="space-y-6">
              {/* Usage Overview */}
              <div className="p-4 bg-neutral-900/30 rounded-xl border border-neutral-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-400 text-sm">Daily Usage</span>
                  <span className="text-emerald-400 font-semibold">{Math.round(usagePercentage)}%</span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-3 mb-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-emerald-500 h-3 rounded-full"
                  />
                </div>
                <p className="text-neutral-300 text-sm">
                  {usageStats.used} / {usageStats.limit} requests
                </p>
              </div>
              
              {/* Rate Limit */}
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-100 mb-1">
                  {usageStats.requestsPerSecond}
                </div>
                <p className="text-neutral-400 text-sm">Requests per second</p>
              </div>
              
              {/* Reset Time */}
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {formatResetTime(usageStats.resetTime)}
                </div>
                <p className="text-neutral-400 text-sm">Next reset (UTC)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Usage Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <BarChart3 className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-neutral-100">Usage Statistics</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {/* Daily Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-neutral-900/30 rounded-xl border border-neutral-600"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-100">Daily Requests</h3>
              </div>
              
              <div className="text-3xl font-bold text-neutral-100 mb-2">
                {usageStats.used}
                <span className="text-neutral-400 text-lg font-normal"> / {usageStats.limit}</span>
              </div>
              
              <div className="w-full bg-neutral-700 rounded-full h-2 mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-2 rounded-full ${
                    usagePercentage > 80 ? 'bg-red-500' : 
                    usagePercentage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
              
              <p className="text-neutral-400 text-sm">
                {usagePercentage > 80 ? 'Approaching limit' : 
                 usagePercentage > 60 ? 'Moderate usage' : 'Light usage'}
              </p>
            </motion.div>

            {/* Rate Limit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-neutral-900/30 rounded-xl border border-neutral-600"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-100">Rate Limit</h3>
              </div>
              
              <div className="text-3xl font-bold text-neutral-100 mb-2">
                {usageStats.requestsPerSecond}
                <span className="text-neutral-400 text-lg font-normal"> req/s</span>
              </div>
              
              <p className="text-neutral-400 text-sm">
                Maximum requests per second allowed for your API key
              </p>
            </motion.div>

            {/* Reset Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 bg-neutral-900/30 rounded-xl border border-neutral-600"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Clock className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-100">Next Reset</h3>
              </div>
              
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {formatResetTime(usageStats.resetTime)}
              </div>
              
              <p className="text-neutral-400 text-sm">
                Usage counters reset daily at midnight UTC
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Documentation Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <div className="relative rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 p-8 backdrop-blur-sm border border-emerald-400/20 shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-neutral-100 mb-4">Ready to Integrate?</h3>
            <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
              Check out our comprehensive API documentation to start building with our phishing detection system.
            </p>
            
            <motion.button
              onClick={handleViewDocs}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <ExternalLink className="h-5 w-5" />
                <span>View API Documentation</span>
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Tokens;