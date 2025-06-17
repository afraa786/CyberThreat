import { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiRefreshCw, FiCheck, FiExternalLink } from 'react-icons/fi';

export default function Tokens() {
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
    // Simulate API call delay
    setTimeout(() => {
      const randomPart = Math.random().toString(36).substring(2, 10);
      setApiKey(`ak-live-${randomPart}12xx...`);
      setIsRegenerating(false);
    }, 800);
  };

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatResetTime = (timeString: string) => {
    const resetDate = new Date(timeString);
    return resetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-emerald-400">API Tokens</h1>
        
        {/* API Key Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Your API Key</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="font-mono bg-gray-700 px-4 py-2 rounded-lg flex-1">
              {apiKey}
            </div>
            <CopyToClipboard text={apiKey.replace('...', '')} onCopy={onCopy}>
              <button className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                {copied ? (
                  <>
                    <FiCheck className="inline" /> Copied!
                  </>
                ) : (
                  'Copy'
                )}
              </button>
            </CopyToClipboard>
          </div>
          <button
            onClick={regenerateKey}
            disabled={isRegenerating}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              isRegenerating
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-500'
            }`}
          >
            <FiRefreshCw className={`${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate Key'}
          </button>
          <p className="text-sm text-gray-400 mt-2">
            Note: Regenerating your key will immediately invalidate the previous one.
          </p>
        </div>

        {/* Usage Stats Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Daily Requests</h3>
              <div className="text-2xl font-bold">
                {usageStats.used} <span className="text-gray-400 text-lg">/ {usageStats.limit}</span>
              </div>
              <div className="w-full bg-gray-700 h-2 mt-2 rounded-full">
                <div 
                  className="bg-emerald-500 h-2 rounded-full" 
                  style={{ width: `${(usageStats.used / usageStats.limit) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-1">Rate Limit</h3>
              <div className="text-2xl font-bold">{usageStats.requestsPerSecond} <span className="text-gray-400 text-lg">req/s</span></div>
              <p className="text-sm text-gray-400 mt-1">Max requests per second</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-1">Next Reset</h3>
              <div className="text-2xl font-bold">{formatResetTime(usageStats.resetTime)}</div>
              <p className="text-sm text-gray-400 mt-1">Daily at midnight UTC</p>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <FiExternalLink />
            View API Documentation
          </button>
        </div>
      </div>
    </div>
  );
}