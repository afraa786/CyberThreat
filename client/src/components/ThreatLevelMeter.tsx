import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Zap } from 'lucide-react';

interface ThreatLevelMeterProps {
  level: number; // 1-100
  recentReports: number;
}

const ThreatLevelMeter: React.FC<ThreatLevelMeterProps> = ({ level, recentReports }) => {
  const getThreatColor = (level: number) => {
    if (level < 25) return 'from-green-400 to-green-600';
    if (level < 50) return 'from-yellow-400 to-yellow-600';
    if (level < 75) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getThreatLabel = (level: number) => {
    if (level < 25) return 'LOW';
    if (level < 50) return 'MODERATE';
    if (level < 75) return 'HIGH';
    return 'CRITICAL';
  };

  const getThreatIcon = (level: number) => {
    if (level < 25) return Shield;
    if (level < 75) return AlertTriangle;
    return Zap;
  };

  const Icon = getThreatIcon(level);

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-orbitron font-bold text-cyan-400">
          THREAT LEVEL MONITOR
        </h3>
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono text-cyan-300">Current Status:</span>
          <span className={`text-lg font-bold font-mono ${
            level < 25 ? 'text-green-400' :
            level < 50 ? 'text-yellow-400' :
            level < 75 ? 'text-orange-400' : 'text-red-400'
          }`}>
            {getThreatLabel(level)}
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getThreatColor(level)} relative`}
              initial={{ width: 0 }}
              animate={{ width: `${level}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </motion.div>
          </div>
          <div className="absolute -top-8 left-0 w-full flex justify-between text-xs font-mono text-cyan-500/60">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono text-cyan-300">Recent Reports:</span>
          <motion.span 
            className="font-bold font-mono text-cyan-400"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {recentReports}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default ThreatLevelMeter;