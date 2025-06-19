import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Shield, 
  MapPin, 
  Info, 
  Clock, 
  Link, 
  Camera,
  Footprints,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Send
} from 'lucide-react';

import ParticlesBackground from './ParticlesBackground';
import ThreatLevelMeter from './ThreatLevelMeter';
import UserProgress from './UserProgress';
import IntroSection from './IntroSection';
import ThreatTypeCard from './ThreatTypeCard';
import FormStep from './FormStep';
import ConfirmationScreen from './ConfirmationScreen';

import { ThreatFormData, ThreatType, UserProgress as UserProgressType, ValidationError, SubmissionResult } from '../types';

const ThreatReportApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ThreatFormData>({
    threatDetails: '',
    threatDate: '',
    threatType: '',
    incidentLocation: '',
    moreInformation: '',
    delayReason: '',
    locationUrl: '',
    evidence: null,
    firstStep: ''
  });
  
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  
  // Mock data for demonstration
  const [threatLevel] = useState(67);
  const [recentReports] = useState(1247);
  const [userProgress] = useState<UserProgressType>({
    level: 5,
    xp: 450,
    badges: ['first-report', 'defender'],
    reportsSubmitted: 12
  });

  const threatTypes: ThreatType[] = [
    {
      id: 'phishing',
      name: 'Phishing',
      description: 'Fraudulent attempt to steal credentials or personal information',
      example: 'Fake login page mimicking a bank website',
      severity: 'high',
      icon: '🎣'
    },
    {
      id: 'malware',
      name: 'Malware',
      description: 'Malicious software designed to damage or gain unauthorized access',
      example: 'Suspicious email attachment or infected download',
      severity: 'critical',
      icon: '🦠'
    },
    {
      id: 'ransomware',
      name: 'Ransomware',
      description: 'Malware that encrypts files and demands payment for decryption',
      example: 'Files encrypted with ransom note demanding Bitcoin payment',
      severity: 'critical',
      icon: '🔒'
    },
    {
      id: 'social-engineering',
      name: 'Social Engineering',
      description: 'Psychological manipulation to trick people into revealing information',
      example: 'Phone call pretending to be from IT support asking for passwords',
      severity: 'medium',
      icon: '🎭'
    },
    {
      id: 'ddos',
      name: 'DDoS Attack',
      description: 'Distributed denial-of-service attack overwhelming servers',
      example: 'Website becomes unavailable due to traffic flood',
      severity: 'high',
      icon: '⚡'
    },
    {
      id: 'other',
      name: 'Other',
      description: 'Other types of cyber threats not listed above',
      example: 'Any suspicious cyber activity not covered by other categories',
      severity: 'medium',
      icon: '❓'
    }
  ];

  const locationOptions = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'snapchat', label: 'SnapChat' },
    { value: 'other-online', label: 'Other Online Platform' },
    { value: 'offline', label: 'Offline/Physical' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS/Text Message' },
    { value: 'other', label: 'Other' }
  ];

  const steps = [
    { id: 1, title: 'Threat Details', icon: FileText, description: 'Describe the threat you encountered' },
    { id: 2, title: 'Date & Time', icon: Calendar, description: 'When did this threat occur?' },
    { id: 3, title: 'Threat Type', icon: Shield, description: 'What type of threat was it?' },
    { id: 4, title: 'Location', icon: MapPin, description: 'Where did you encounter this threat?' },
    { id: 5, title: 'Additional Info', icon: Info, description: 'Any additional details?' },
    { id: 6, title: 'Delay Reason', icon: Clock, description: 'Why are you reporting this now?' },
    { id: 7, title: 'URL/Link', icon: Link, description: 'Provide the suspicious URL if applicable' },
    { id: 8, title: 'Evidence', icon: Camera, description: 'Upload screenshots or files as evidence' },
    { id: 9, title: 'First Steps', icon: Footprints, description: 'What was your immediate response?' }
  ];

  const validateStep = (stepIndex: number): ValidationError[] => {
    const newErrors: ValidationError[] = [];
    
    switch (stepIndex) {
      case 0:
        if (!formData.threatDetails.trim()) {
          newErrors.push({ field: 'threatDetails', message: 'Please describe the threat' });
        }
        break;
      case 1:
        if (!formData.threatDate) {
          newErrors.push({ field: 'threatDate', message: 'Please select the date' });
        }
        break;
      case 2:
        if (!formData.threatType) {
          newErrors.push({ field: 'threatType', message: 'Please select a threat type' });
        }
        break;
      case 3:
        if (!formData.incidentLocation) {
          newErrors.push({ field: 'incidentLocation', message: 'Please select where you encountered this threat' });
        }
        break;
    }
    
    return newErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    setErrors(stepErrors);
    
    if (stepErrors.length === 0 && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors([]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result: SubmissionResult = {
      success: true,
      reportId: `TR-${Date.now().toString(36).toUpperCase()}`,
      message: 'Your threat report has been successfully submitted to our security team.',
      nextSteps: [
        'Immediate threat analysis and classification',
        'Security team review within 24 hours',
        'Protective measures deployed if confirmed',
        'Follow-up notification if additional info needed'
      ]
    };
    
    setSubmissionResult(result);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      threatDetails: '',
      threatDate: '',
      threatType: '',
      incidentLocation: '',
      moreInformation: '',
      delayReason: '',
      locationUrl: '',
      evidence: null,
      firstStep: ''
    });
    setCurrentStep(0);
    setErrors([]);
    setSubmissionResult(null);
    setShowIntro(true);
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field);
  };

  if (submissionResult) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <ParticlesBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <ConfirmationScreen
            formData={formData}
            result={submissionResult}
            onReportAnother={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-black/90 backdrop-blur-sm border-b border-cyan-500/30 p-6"
      >
        <div className="container mx-auto">
          <motion.h1
            className="text-4xl font-orbitron font-bold text-center"
            animate={{ 
              textShadow: [
                "0 0 10px #00ffff", 
                "0 0 20px #00ffff", 
                "0 0 10px #00ffff"
              ] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              CYBER THREAT REPORT
            </span>
          </motion.h1>
          <p className="text-center text-cyan-300 font-mono mt-2">
            Neural Defense Network • Threat Intelligence Division
          </p>
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ThreatLevelMeter level={threatLevel} recentReports={recentReports} />
            <UserProgress progress={userProgress} />
            
            {/* Progress Steps */}
            <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-lg font-orbitron font-bold text-cyan-400 mb-4">
                PROGRESS
              </h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <FormStep
                    key={step.id}
                    step={index + 1}
                    title={step.title}
                    isActive={currentStep === index}
                    isCompleted={currentStep > index}
                    onClick={() => setCurrentStep(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {showIntro && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <IntroSection />
                  <div className="text-center">
                    <motion.button
                      onClick={() => setShowIntro(false)}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>BEGIN THREAT REPORT</span>
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {!showIntro && (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8"
                >
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      {React.createElement(steps[currentStep].icon, { 
                        className: "w-8 h-8 text-cyan-400" 
                      })}
                      <h2 className="text-2xl font-orbitron font-bold text-cyan-400">
                        {steps[currentStep].title}
                      </h2>
                    </div>
                    <p className="text-cyan-300 font-mono">
                      {steps[currentStep].description}
                    </p>
                  </div>

                  {/* Step Content */}
                  <div className="space-y-6">
                    {currentStep === 0 && (
                      <div>
                        <label className="block text-sm font-mono text-cyan-400 mb-2">
                          Describe the threat you encountered *
                        </label>
                        <textarea
                          value={formData.threatDetails}
                          onChange={(e) => setFormData({ ...formData, threatDetails: e.target.value })}
                          placeholder="e.g., I received a suspicious email claiming to be from my bank asking me to verify my account..."
                          className={`w-full bg-gray-900/50 border rounded-lg px-4 py-3 text-cyan-100 placeholder-cyan-500/40 font-mono focus:outline-none focus:ring-2 transition-all duration-300 ${
                            getFieldError('threatDetails') 
                              ? 'border-red-500 focus:ring-red-400/20' 
                              : 'border-cyan-500/50 focus:border-cyan-400 focus:ring-cyan-400/20'
                          }`}
                          rows={4}
                        />
                        {getFieldError('threatDetails') && (
                          <p className="text-red-400 text-sm font-mono mt-1">
                            {getFieldError('threatDetails')?.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div>
                        <label className="block text-sm font-mono text-cyan-400 mb-2">
                          When did this threat occur? *
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.threatDate}
                          onChange={(e) => setFormData({ ...formData, threatDate: e.target.value })}
                          className={`w-full bg-gray-900/50 border rounded-lg px-4 py-3 text-cyan-100 font-mono focus:outline-none focus:ring-2 transition-all duration-300 ${
                            getFieldError('threatDate') 
                              ? 'border-red-500 focus:ring-red-400/20' 
                              : 'border-cyan-500/50 focus:border-cyan-400 focus:ring-cyan-400/20'
                          }`}
                        />
                        {getFieldError('threatDate') && (
                          <p className="text-red-400 text-sm font-mono mt-1">
                            {getFieldError('threatDate')?.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div>
                        <label className="block text-sm font-mono text-cyan-400 mb-4">
                          Select the type of threat *
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                          {threatTypes.map((type) => (
                            <ThreatTypeCard
                              key={type.id}
                              threatType={type}
                              isSelected={formData.threatType === type.id}
                              onSelect={(selectedType) => 
                                setFormData({ ...formData, threatType: selectedType.id })
                              }
                            />
                          ))}
                        </div>
                        {getFieldError('threatType') && (
                          <p className="text-red-400 text-sm font-mono mt-2">
                            {getFieldError('threatType')?.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div>
                        <label className="block text-sm font-mono text-cyan-400 mb-2">
                          Where did you encounter this threat? *
                        </label>
                        <div className="grid md:grid-cols-2 gap-2">
                          {locationOptions.map((option) => (
                            <motion.button
                              key={option.value}
                              onClick={() => setFormData({ ...formData, incidentLocation: option.value })}
                              className={`p-3 rounded-lg border-2 text-left transition-all duration-300 ${
                                formData.incidentLocation === option.value
                                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                                  : 'border-gray-600 bg-gray-800/50 text-cyan-300 hover:border-cyan-500/50'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-mono text-sm">{option.label}</span>
                            </motion.button>
                          ))}
                        </div>
                        {getFieldError('incidentLocation') && (
                          <p className="text-red-400 text-sm font-mono mt-2">
                            {getFieldError('incidentLocation')?.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div>
                        <label className="block text-sm font-mono text-cyan-400 mb-2">
                          Additional information (optional)
                        </label>
                        <textarea
                          value={formData.moreInformation}
                          onChange={(e) => setFormData({ ...formData, moreInformation: e.target.value })}
                          placeholder="Any additional details that might help our security team..."
                          className="w-full bg-gray-900/50 border border-cyan-500/50 rounded-lg px-4 py-3 text-cyan-100 placeholder-cyan-500/40 font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                          rows={3}
                        />
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div>
                        <label className="block text-sm font-mono text-cyan-400 mb-2">
                          Why are you reporting this now? (optional)
                        </label>
                        <textarea
                          value={formData.delayReason}
                          onChange={(e) => setFormData({ ...formData, delayReason: e.target.value })}
                          placeholder="e.g., I just realized this was suspicious, I was busy and forgot to report it earlier..."
                          className="w-full bg-gray-900/50 border border-cyan-500/50 rounded-lg px-4 py-3 text-cyan-100 placeholder-cyan-500/40 font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                          rows={3}
                        />
                      </div>
                    )}

                    {currentStep === 6 && (
                      <div>
                        <label className="block text-sm font-mono text-cyan-400 mb-2">
                          Suspicious URL or link (optional)
                        </label>
                        <input
                          type="url"
                          value={formData.locationUrl}
                          onChange={(e) => setFormData({ ...formData, locationUrl: e.target.value })}
                          placeholder="https://suspicious-website.com"
                          className="w-full bg-gray-900/50 border border-cyan-500/50 rounded-lg px-4 py-3 text-cyan-100 placeholder-cyan-500/40 font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                        />
                        <p className="text-cyan-500/60 text-xs font-mono mt-1">
                          ⚠️ Do not click on suspicious links. Copy and paste the URL here.
                        </p>
                      </div>
                    )}

                    {currentStep === 7 && (
                      <div>
                        <label className="block text-sm font-mono text-cyan-400 mb-2">
                          Upload evidence (optional)
                        </label>
                        <div className="border-2 border-dashed border-cyan-500/50 rounded-lg p-8 text-center">
                          <Camera className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                          <input
                            type="file"
                            onChange={(e) => setFormData({ ...formData, evidence: e.target.files?.[0] || null })}
                            accept="image/*,.pdf,.doc,.docx"
                            className="hidden"
                            id="evidence-upload"
                          />
                          <label
                            htmlFor="evidence-upload"
                            className="cursor-pointer text-cyan-400 font-mono hover:text-cyan-300 transition-colors"
                          >
                            Click to upload screenshots or documents
                          </label>
                          <p className="text-cyan-500/60 text-xs font-mono mt-2">
                            Supported: Images, PDF, Word documents (Max 10MB)
                          </p>
                          {formData.evidence && (
                            <p className="text-green-400 font-mono text-sm mt-2">
                              ✓ {formData.evidence.name}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {currentStep === 8 && (
                      <div>
                        <label className="block text-sm font-mono text-cyan-400 mb-2">
                          What was your immediate response? (optional)
                        </label>
                        <textarea
                          value={formData.firstStep}
                          onChange={(e) => setFormData({ ...formData, firstStep: e.target.value })}
                          placeholder="e.g., I closed the browser, I didn't click on anything, I changed my password..."
                          className="w-full bg-gray-900/50 border border-cyan-500/50 rounded-lg px-4 py-3 text-cyan-100 placeholder-cyan-500/40 font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-cyan-500/30">
                    <motion.button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white font-mono rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                      whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
                      whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>PREVIOUS</span>
                    </motion.button>

                    <div className="text-center">
                      <span className="text-cyan-400 font-mono text-sm">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                    </div>

                    {currentStep === steps.length - 1 ? (
                      <motion.button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-700 disabled:to-gray-600 text-white font-orbitron font-bold rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                        whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>SUBMITTING...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>SUBMIT REPORT</span>
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={nextStep}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono rounded-lg transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>NEXT</span>
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>

                  {/* Error Display */}
                  {errors.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-mono font-bold">
                          Please fix the following errors:
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {errors.map((error, index) => (
                          <li key={index} className="text-red-300 font-mono text-sm">
                            • {error.message}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatReportApp;