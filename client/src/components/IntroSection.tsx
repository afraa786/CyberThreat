import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Clock, CheckCircle } from 'lucide-react';

const IntroSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 mb-8"
    >
      <div className="text-center mb-6">
        <motion.h2 
          className="text-3xl font-orbitron font-bold text-cyan-400 mb-2"
          animate={{ textShadow: ["0 0 10px #00ffff", "0 0 20px #00ffff", "0 0 10px #00ffff"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          NEURAL DEFENSE NETWORK
        </motion.h2>
        <p className="text-cyan-300 font-mono">
          Protecting the digital frontier through collective intelligence
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-xl font-orbitron font-bold text-cyan-400 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Why Report Threats?
          </h3>
          <ul className="space-y-2 text-cyan-300 font-mono text-sm">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
              Help protect millions of users from cyber attacks
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
              Contribute to global threat intelligence
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
              Enable rapid response to emerging threats
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
              Build a stronger, more secure digital ecosystem
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-orbitron font-bold text-cyan-400 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            What Happens Next?
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-sm">1</span>
              </div>
              <span className="text-cyan-300 font-mono text-sm">
                Immediate threat analysis begins
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-sm">2</span>
              </div>
              <span className="text-cyan-300 font-mono text-sm">
                Security team review within 24 hours
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-sm">3</span>
              </div>
              <span className="text-cyan-300 font-mono text-sm">
                Protective measures deployed globally
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <motion.div
          className="inline-flex items-center space-x-2 text-cyan-400 font-mono text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Users className="w-4 h-4" />
          <span>Join thousands of cyber defenders worldwide</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IntroSection;