import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Zap, Award } from 'lucide-react';
import { UserProgress as UserProgressType } from '../types';

interface UserProgressProps {
  progress: UserProgressType;
}

const UserProgress: React.FC<UserProgressProps> = ({ progress }) => {
  const xpToNextLevel = (progress.level * 100) - progress.xp;
  const xpProgress = (progress.xp % 100) / 100 * 100;

  const badges = [
    { id: 'first-report', name: 'First Report', icon: Star, color: 'text-yellow-400' },
    { id: 'defender', name: 'Cyber Defender', icon: Shield, color: 'text-blue-400' },
    { id: 'vigilant', name: 'Vigilant Guardian', icon: Zap, color: 'text-purple-400' },
    { id: 'expert', name: 'Threat Expert', icon: Award, color: 'text-red-400' },
  ];

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-orbitron font-bold text-cyan-400">
          AGENT PROFILE
        </h3>
        <Trophy className="w-6 h-6 text-cyan-400" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono text-cyan-300">Level:</span>
          <span className="text-2xl font-bold font-mono text-cyan-400">
            {progress.level}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono text-cyan-300">
            <span>XP Progress</span>
            <span>{progress.xp} / {progress.level * 100}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs font-mono text-cyan-500/60">
            {xpToNextLevel} XP to next level
          </p>
        </div>
        
        <div className="space-y-2">
          <span className="text-sm font-mono text-cyan-300">Reports Submitted:</span>
          <motion.span 
            className="text-lg font-bold font-mono text-cyan-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {progress.reportsSubmitted}
          </motion.span>
        </div>
        
        <div className="space-y-2">
          <span className="text-sm font-mono text-cyan-300">Badges Earned:</span>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => {
              const isEarned = progress.badges.includes(badge.id);
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.id}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${
                    isEarned 
                      ? `${badge.color} border-current bg-current/10` 
                      : 'text-gray-600 border-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  title={badge.name}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-mono">{badge.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;