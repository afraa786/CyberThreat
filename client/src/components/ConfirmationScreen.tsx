import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Shield, ArrowRight, RotateCcw } from 'lucide-react';
import { ThreatFormData, SubmissionResult } from '../types';

interface ConfirmationScreenProps {
  formData: ThreatFormData;
  result: SubmissionResult;
  onReportAnother: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ 
  formData, 
  result, 
  onReportAnother 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-black/80 backdrop-blur-sm border border-green-400/50 rounded-lg p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-400" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-orbitron font-bold text-green-400 mb-4"
        >
          THREAT REPORT SUBMITTED
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-cyan-300 font-mono mb-8"
        >
          {result.message}
        </motion.p>
        
        {result.reportId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/50 rounded-lg p-4 mb-6"
          >
            <p className="text-sm font-mono text-cyan-500/60 mb-1">Report ID:</p>
            <p className="text-lg font-mono text-cyan-400 font-bold">
              {result.reportId}
            </p>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-8"
        >
          <h3 className="text-xl font-orbitron font-bold text-cyan-400 flex items-center justify-center">
            <Clock className="w-5 h-5 mr-2" />
            What's Next?
          </h3>
          
          <div className="space-y-3">
            {result.nextSteps?.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center space-x-3 text-left"
              >
                <div className="w-6 h-6 bg-cyan-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 font-bold text-xs">{index + 1}</span>
                </div>
                <span className="text-cyan-300 font-mono text-sm">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-6"
        >
          <h4 className="text-lg font-orbitron font-bold text-blue-400 mb-2 flex items-center justify-center">
            <Shield className="w-5 h-5 mr-2" />
            Report Summary
          </h4>
          <div className="space-y-2 text-sm font-mono text-cyan-300">
            <div className="flex justify-between">
              <span className="text-cyan-500/60">Threat Type:</span>
              <span>{formData.threatType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-500/60">Date Reported:</span>
              <span>{formData.threatDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-500/60">Location:</span>
              <span>{formData.incidentLocation}</span>
            </div>
          </div>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={onReportAnother}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          <span>REPORT ANOTHER THREAT</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ConfirmationScreen;