import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Activity, AlertTriangle, Users, Globe, TrendingUp, Lock } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import StatsCard from '../components/StatsCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'URL Phishing Detection',
      description: 'Advanced AI-powered analysis to detect malicious URLs and phishing attempts with real-time threat intelligence.',
      icon: Search,
      gradient: 'bg-neutral-800/50',
      onClick: () => navigate('/url-analyzer')
    },
    {
      title: 'Real-time Threat Monitor',
      description: 'Monitor cybersecurity threats in real-time with automated alerts and comprehensive threat analysis.',
      icon: Activity,
      gradient: 'bg-neutral-800/50',
      onClick: () => navigate('/threat-monitor')
    },
    {
      title: 'Security Assessment',
      description: 'Comprehensive security audits and vulnerability assessments for your digital infrastructure.',
      icon: Shield,
      gradient: 'bg-neutral-800/50'
    }
  ];

  const stats = [
    {
      title: 'URLs Analyzed',
      value: '12,847',
      change: '+23% this week',
      icon: Globe,
      color: 'green' as const
    },
    {
      title: 'Threats Blocked',
      value: '3,264',
      change: '+12% this week',
      icon: AlertTriangle,
      color: 'red' as const
    },
    {
      title: 'Protected Users',
      value: '98,547',
      change: '+5% this month',
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Security Score',
      value: '94.8%',
      change: '+2.1% improvement',
      icon: TrendingUp,
      color: 'yellow' as const
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="relative">
            <Shield className="h-12 w-12 text-emerald-400" />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2 h-4 w-4 bg-emerald-400 rounded-full"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent">
            CyberShield Security Platform
          </h1>
        </div>
        
        <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
          Advanced cybersecurity solutions powered by AI to protect your digital assets from emerging threats and vulnerabilities.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-neutral-100 mb-8 text-center">
          Security Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={0.6 + (index * 0.1)}
            />
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 rounded-2xl p-8 border border-emerald-500/20"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-neutral-100 mb-2">
            Ready to Secure Your Digital Presence?
          </h3>
          <p className="text-neutral-300">
            Start with our most popular security tools
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/url-analyzer')}
            className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Analyze URL</span>
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/threat-monitor')}
            className="group px-8 py-4 bg-neutral-800 text-neutral-100 font-semibold rounded-xl hover:bg-neutral-700 transition-all duration-300 border border-neutral-600 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Monitor Threats</span>
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="text-center mt-12 text-neutral-500"
      >
        <p>©2024 CyberShield Security Platform. Protecting the digital world.</p>
      </motion.div>
    </div>
  );
};

export default Dashboard;