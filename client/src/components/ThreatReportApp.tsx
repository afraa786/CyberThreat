import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import {Navibar} from './navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Shield, 
  Terminal as TerminalIcon,
  MapPin, 
  Info, 
  Clock, 
  Link, 
  Camera,
  Footprints,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Send,
  Home,
  CheckCircle,
  Activity
} from 'lucide-react';

const ThreatReportApp = () => {

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
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
  
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  
  // Mock data
  const [threatLevel] = useState(67);
  const [recentReports] = useState(1247);

  const threatTypes = [
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
      description: 'Distributed denial-of-service attacks overwhelming servers',
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

  const validateStep = (stepIndex) => {
    const newErrors = [];
    
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
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = {
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

  const getFieldError = (field) => {
    return errors.find(error => error.field === field);
  };

  const BackToHomeButton = () => (
    <div className="absolute top-6 left-6 z-50">
      <button
        onClick={() => window.history.back()}
        className="group flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-300"
        title="Back to Home"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gray-800/80 border border-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-700/80 group-hover:border-gray-600 transition-all duration-300">
            <ChevronLeft className="w-5 h-5" />
          </div>
        </div>
        <span className="font-medium text-sm tracking-wide">Back to Home</span>
      </button>
    </div>
  );

  const ThreatLevelIndicator = () => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Current Threat Level</h3>
        <Activity className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex-1 bg-gray-700 rounded-lg h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-lg transition-all duration-300"
            style={{ width: `${threatLevel}%` }}
          />
        </div>
        <span className="text-emerald-400 text-sm font-medium">{threatLevel}%</span>
      </div>
      <p className="text-gray-400 text-xs mt-2">{recentReports.toLocaleString()} reports analyzed today</p>
    </div>
  );

  const ProgressSteps = () => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Progress</h3>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 cursor-pointer ${
              currentStep === index 
                ? 'bg-emerald-500/20 border border-emerald-500/30' 
                : currentStep > index 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
            onClick={() => setCurrentStep(index)}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
              currentStep === index 
                ? 'bg-emerald-500 text-white' 
                : currentStep > index 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {currentStep > index ? <CheckCircle className="w-3 h-3" /> : index + 1}
            </div>
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const ThreatTypeCard = ({ threatType, isSelected, onSelect }) => (
    <motion.button
      onClick={() => onSelect(threatType)}
      className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
        isSelected
          ? 'border-emerald-500 bg-emerald-500/10 text-white'
          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-800/70'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-lg">{threatType.icon}</span>
        <span className="font-semibold text-sm">{threatType.name}</span>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">{threatType.description}</p>
    </motion.button>
  );

  const IntroSection = () => (
    <div className="text-center mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Report a Cyber Threat</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Help protect others by reporting suspicious activities, scams, and cyber threats. 
          Your report helps us strengthen our defenses and keep everyone safe.
        </p>
      </motion.div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Secure Reporting</h3>
          <p className="text-gray-400 text-sm">All reports are encrypted and handled confidentially</p>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Real-time Analysis</h3>
          <p className="text-gray-400 text-sm">Threats are analyzed immediately by our security team</p>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Community Protection</h3>
          <p className="text-gray-400 text-sm">Help protect others from similar threats</p>
        </div>
      </div>
    </div>
  );

  const ConfirmationScreen = () => (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/50 border border-gray-700 rounded-lg p-8"
      >
        <div className="w-16 h-16 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Report Submitted Successfully</h2>
        <p className="text-gray-400 mb-6">{submissionResult.message}</p>
        
        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
          <p className="text-emerald-400 font-medium mb-2">Report ID: {submissionResult.reportId}</p>
          <p className="text-gray-400 text-sm">Save this ID for future reference</p>
        </div>
        
        <div className="text-left mb-8">
          <h3 className="text-white font-semibold mb-3">What happens next:</h3>
          <ul className="space-y-2">
            {submissionResult.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start space-x-2 text-gray-400">
                <span className="text-emerald-400 mt-1">•</span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button
          onClick={resetForm}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
        >
          Report Another Threat
        </button>
      </motion.div>
    </div>
  );

  if (submissionResult) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <BackToHomeButton />
        <div className="container mx-auto px-6 py-16">
          <ConfirmationScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      
      {/* Header */}
      
      <Navibar/>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <ThreatLevelIndicator />
            <ProgressSteps />
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
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Start Report</span>
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
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-8"
                >
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      {React.createElement(steps[currentStep].icon, { 
                        className: "w-6 h-6 text-emerald-400" 
                      })}
                      <h2 className="text-xl font-bold text-white">
                        {steps[currentStep].title}
                      </h2>
                    </div>
                    <p className="text-gray-400">
                      {steps[currentStep].description}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {currentStep === 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Describe the threat you encountered *
                        </label>
                        <textarea
                          value={formData.threatDetails}
                          onChange={(e) => setFormData({ ...formData, threatDetails: e.target.value })}
                          placeholder="e.g., I received a suspicious email claiming to be from my bank asking me to verify my account..."
                          className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            getFieldError('threatDetails') 
                              ? 'border-red-500 focus:ring-red-500/20' 
                              : 'border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20'
                          }`}
                          rows={4}
                        />
                        {getFieldError('threatDetails') && (
                          <p className="text-red-400 text-sm mt-1">
                            {getFieldError('threatDetails')?.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          When did this threat occur? *
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.threatDate}
                          onChange={(e) => setFormData({ ...formData, threatDate: e.target.value })}
                          className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                            getFieldError('threatDate') 
                              ? 'border-red-500 focus:ring-red-500/20' 
                              : 'border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20'
                          }`}
                        />
                        {getFieldError('threatDate') && (
                          <p className="text-red-400 text-sm mt-1">
                            {getFieldError('threatDate')?.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-4">
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
                          <p className="text-red-400 text-sm mt-2">
                            {getFieldError('threatType')?.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Where did you encounter this threat? *
                        </label>
                        <div className="grid md:grid-cols-2 gap-2">
                          {locationOptions.map((option) => (
                            <motion.button
                              key={option.value}
                              onClick={() => setFormData({ ...formData, incidentLocation: option.value })}
                              className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                                formData.incidentLocation === option.value
                                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                  : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="text-sm">{option.label}</span>
                            </motion.button>
                          ))}
                        </div>
                        {getFieldError('incidentLocation') && (
                          <p className="text-red-400 text-sm mt-2">
                            {getFieldError('incidentLocation')?.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Additional information (optional)
                        </label>
                        <textarea
                          value={formData.moreInformation}
                          onChange={(e) => setFormData({ ...formData, moreInformation: e.target.value })}
                          placeholder="Any additional details that might help our security team..."
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                          rows={3}
                        />
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Why are you reporting this now? (optional)
                        </label>
                        <textarea
                          value={formData.delayReason}
                          onChange={(e) => setFormData({ ...formData, delayReason: e.target.value })}
                          placeholder="e.g., I just realized this was suspicious, I was busy and forgot to report it earlier..."
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                          rows={3}
                        />
                      </div>
                    )}

                    {currentStep === 6 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Suspicious URL or link (optional)
                        </label>
                        <input
                          type="url"
                          value={formData.locationUrl}
                          onChange={(e) => setFormData({ ...formData, locationUrl: e.target.value })}
                          placeholder="https://suspicious-website.com"
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                        />
                        <p className="text-gray-500 text-xs mt-1">
                          ⚠️ Do not click on suspicious links. Copy and paste the URL here.
                        </p>
                      </div>
                    )}

                    {currentStep === 7 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Upload evidence (optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <input
                            type="file"
                            onChange={(e) => setFormData({ ...formData, evidence: e.target.files?.[0] || null })}
                            accept="image/*,.pdf,.doc,.docx"
                            className="hidden"
                            id="evidence-upload"
                          />
                          <label
                            htmlFor="evidence-upload"
                            className="cursor-pointer text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            Click to upload screenshots or documents
                          </label>
                          <p className="text-gray-500 text-xs mt-2">
                            Supported: Images, PDF, Word documents (Max 10MB)
                          </p>
                          {formData.evidence && (
                            <p className="text-emerald-400 text-sm mt-2">
                              ✓ {formData.evidence.name}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {currentStep === 8 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          What was your immediate response? (optional)
                        </label>
                        <textarea
                          value={formData.firstStep}
                          onChange={(e) => setFormData({ ...formData, firstStep: e.target.value })}
                          placeholder="e.g., I closed the browser, I didn't click on anything, I changed my password..."
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                    <motion.button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                      whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
                      whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Previous</span>
                    </motion.button>

                    <div className="text-center">
                      <span className="text-gray-400 text-sm">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                    </div>

                    {currentStep === steps.length - 1 ? (
                      <motion.button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                        whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-lg"
                            />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Submit Report</span>
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={nextStep}
                        className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Next</span>
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
                        <span className="text-red-400 font-medium">
                          Please fix the following errors:
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {errors.map((error, index) => (
                          <li key={index} className="text-red-300 text-sm">
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