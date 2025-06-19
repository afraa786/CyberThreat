import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, AlertTriangle, Shield, Globe, Clock, TrendingUp, Database } from 'lucide-react';

interface ThreatData {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: string;
  description: string;
}

const ThreatMonitor: React.FC = () => {
  const navigate = useNavigate();
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const generateRandomThreat = (): ThreatData => {
    const types = ['Malware Detection', 'Phishing Attempt', 'DDoS Attack', 'Data Breach', 'Suspicious Activity'];
    const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const sources = ['Email Gateway', 'Web Filter', 'Network Monitor', 'Endpoint Security', 'Firewall'];
    const descriptions = [
      'Suspicious network traffic detected from unknown IP range',
      'Multiple failed login attempts from different geographic locations',
      'Malicious payload detected in email attachment',
      'Unauthorized access attempt to sensitive database',
      'Unusual data transfer patterns detected'
    ];

    return {
      id: Math.random().toString(36).substr(2, 9),
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      timestamp: new Date().toLocaleTimeString(),
      description: descriptions[Math.floor(Math.random() * descriptions.length)]
    };
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of new threat
          const newThreat = generateRandomThreat();
          setThreats(prev => [newThreat, ...prev.slice(0, 9)]); // Keep last 10 threats
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const threatCounts = {
    total: threats.length,
    critical: threats.filter(t => t.severity === 'critical').length,
    high: threats.filter(t => t.severity === 'high').length,
    medium: threats.filter(t => t.severity === 'medium').length,
    low: threats.filter(t => t.severity === 'low').length
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
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Activity className="h-8 w-8 text-emerald-400" />
              {isMonitoring && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                />
              )}
            </div>
            <h1 className="text-3xl font-bold text-neutral-100">Real-time Threat Monitor</h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isMonitoring
                ? 'bg-red-500 hover:bg-red-400 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-900'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </motion.button>
        </div>
        
        <p className="text-neutral-400 text-lg">
          Monitor cybersecurity threats in real-time with automated detection and analysis.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Database className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-neutral-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-neutral-100">{threatCounts.total}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
        >
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-300">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{threatCounts.critical}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30"
        >
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-orange-300">High</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{threatCounts.high}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-yellow-300">Medium</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{threatCounts.medium}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300">Low</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{threatCounts.low}</div>
        </motion.div>
      </div>

      {/* Threat Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-neutral-800/50 rounded-2xl p-6 backdrop-blur-sm border border-neutral-700/50"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-semibold text-neutral-100">Live Threat Feed</h2>
          {isMonitoring && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex items-center space-x-2 text-emerald-400"
            >
              <div className="h-2 w-2 bg-emerald-400 rounded-full"></div>
              <span className="text-sm">Monitoring Active</span>
            </motion.div>
          )}
        </div>

        {threats.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neutral-700/50 flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-neutral-500" />
            </div>
            <p className="text-neutral-400 text-lg">
              {isMonitoring ? 'Monitoring for threats...' : 'Start monitoring to see live threat data'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {threats.map((threat, index) => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${getSeverityColor(threat.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-semibold">{threat.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-neutral-400">
                    <Clock className="h-3 w-3" />
                    <span>{threat.timestamp}</span>
                  </div>
                </div>
                <p className="text-neutral-300 text-sm mb-2">{threat.description}</p>
                <div className="text-xs text-neutral-400">
                  Source: {threat.source}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ThreatMonitor;