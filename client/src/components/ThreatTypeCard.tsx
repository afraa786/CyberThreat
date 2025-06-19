import React from 'react';
import { motion } from 'framer-motion';
import { ThreatType } from '../types';

interface ThreatTypeCardProps {
  threatType: ThreatType;
  isSelected: boolean;
  onSelect: (type: ThreatType) => void;
}

const ThreatTypeCard: React.FC<ThreatTypeCardProps> = ({ 
  threatType, 
  isSelected, 
  onSelect 
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'from-green-400 to-green-600';
      case 'medium': return 'from-yellow-400 to-yellow-600';
      case 'high': return 'from-orange-400 to-orange-600';
      case 'critical': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <motion.div
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-cyan-400 bg-cyan-400/10' 
          : 'border-gray-600 bg-black/40 hover:border-cyan-500/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(threatType)}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getSeverityColor(threatType.severity)} flex items-center justify-center text-2xl`}>
          {threatType.icon}
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-orbitron font-bold text-cyan-400 mb-1">
            {threatType.name}
          </h4>
          <p className="text-sm text-cyan-300 font-mono mb-2">
            {threatType.description}
          </p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-500/60">Example:</span>
              <span className="text-xs font-mono text-cyan-300">
                {threatType.example}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-500/60">Severity:</span>
              <span className={`text-xs font-mono font-bold uppercase ${
                threatType.severity === 'low' ? 'text-green-400' :
                threatType.severity === 'medium' ? 'text-yellow-400' :
                threatType.severity === 'high' ? 'text-orange-400' : 'text-red-400'
              }`}>
                {threatType.severity}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-cyan-400/5 border-2 border-cyan-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default ThreatTypeCard;