import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue' | 'yellow';
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  delay = 0
}) => {
  const colorClasses = {
    green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      className={`relative rounded-2xl p-6 backdrop-blur-sm border shadow-xl bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-neutral-800/30`}>
          <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[3]}`} />
        </div>
        <div className="text-right">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="text-sm text-neutral-400"
          >
            {change}
          </motion.div>
        </div>
      </div>
      
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.1 }}
          className="text-2xl font-bold text-neutral-100 mb-1"
        >
          {value}
        </motion.div>
        <div className="text-neutral-300 text-sm">{title}</div>
      </div>
    </motion.div>
  );
};

export default StatsCard;