import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  gradient,
  delay = 0,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative group cursor-pointer rounded-2xl p-6 backdrop-blur-sm border border-neutral-700/50 shadow-2xl ${gradient} transition-all duration-300`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl group-hover:from-white/10 transition-all duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 rounded-xl bg-neutral-800/50 group-hover:bg-neutral-700/50 transition-colors">
            <Icon className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-100">{title}</h3>
        </div>
        
        <p className="text-neutral-300 leading-relaxed">{description}</p>
        
        <motion.div
          className="mt-4 flex items-center text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          <span>Learn more →</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;