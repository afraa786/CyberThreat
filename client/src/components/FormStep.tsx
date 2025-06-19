import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface FormStepProps {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

const FormStep: React.FC<FormStepProps> = ({ 
  step, 
  title, 
  isActive, 
  isCompleted, 
  onClick 
}) => {
  return (
    <motion.div
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-cyan-400/20 border border-cyan-400' 
          : isCompleted 
            ? 'bg-green-400/20 border border-green-400' 
            : 'bg-gray-800/50 border border-gray-600 hover:border-gray-500'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        isCompleted 
          ? 'bg-green-400 text-black' 
          : isActive 
            ? 'bg-cyan-400 text-black' 
            : 'bg-gray-600 text-gray-300'
      }`}>
        {isCompleted ? <Check className="w-4 h-4" /> : step}
      </div>
      
      <span className={`font-mono text-sm ${
        isActive 
          ? 'text-cyan-400' 
          : isCompleted 
            ? 'text-green-400' 
            : 'text-gray-400'
      }`}>
        {title}
      </span>
    </motion.div>
  );
};

export default FormStep;