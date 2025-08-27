import React, { useState } from 'react';
import { Navibar } from '../components/navbar';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  Zap, 
  Globe, 
  Key,
  AlertTriangle,
  CheckCircle,
  Search,
  MessageCircle,
  Mail,
  ExternalLink,
  Users,
  Target,
  Award,
  Bell,
  Lock
} from 'lucide-react';

interface FAQ {
  id: number;
  icon: React.ReactNode;
  category: string;
  question: string;
  answer: string;
}

const FAQsPage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const faqData: FAQ[] = [
    {
      id: 1,
      icon: <Shield className="w-5 h-5" />,
      category: "Threat Reporting",
      question: "How do I report a cyber threat?",
      answer: "Simply navigate to the threat reporting section, select the type of threat (phishing URL, malware, suspicious activity), provide the details, and submit. Our AI assistant will analyze and categorize the threat in real-time."
    },
    {
      id: 2,
      icon: <Zap className="w-5 h-5" />,
      category: "Threat Reporting",
      question: "What types of threats can I report?",
      answer: "You can report phishing URLs, malware samples, suspicious emails, fraudulent websites, social engineering attempts, data breaches, and any other cybersecurity incidents. Our AI categorizes and validates each report."
    },
    {
      id: 3,
      icon: <Lock className="w-5 h-5" />,
      category: "Security",
      question: "How secure is my data on CyberThreat?",
      answer: "We implement JWT-based authentication for secure API access, end-to-end encryption for sensitive data, and follow industry-standard security protocols. Your personal information is never shared without consent."
    },
    {
      id: 4,
      icon: <Shield className="w-5 h-5" />,
      category: "Security",
      question: "What makes the threat detection real-time?",
      answer: "We use Apache Kafka for real-time data streaming, which processes and aggregates threat intelligence as it's reported. This ensures immediate threat analysis and rapid community alerts."
    },
    {
      id: 5,
      icon: <Award className="w-5 h-5" />,
      category: "Gamification",
      question: "How does the XP and badge system work?",
      answer: "You earn XP points for reporting valid threats, participating in missions, and contributing to the community. Badges are awarded for specific achievements like 'First Reporter', 'Threat Hunter', or 'Community Guardian'. Higher levels unlock exclusive features."
    },
    {
      id: 6,
      icon: <Target className="w-5 h-5" />,
      category: "Gamification",
      question: "What are missions and how do I participate?",
      answer: "Missions are time-limited challenges that focus on specific threat types or security objectives. They might involve identifying phishing campaigns, analyzing malware samples, or contributing to threat intelligence. Complete missions to earn bonus XP and exclusive badges."
    },
    {
      id: 7,
      icon: <Users className="w-5 h-5" />,
      category: "Community",
      question: "How does the leaderboard ranking work?",
      answer: "Rankings are based on your total XP, quality of threat reports, mission completions, and community engagement. Top contributors are featured on the leaderboard and receive special recognition badges."
    },
    {
      id: 8,
      icon: <Globe className="w-5 h-5" />,
      category: "Community",
      question: "What is the Live Cyber Threat Map?",
      answer: "Our interactive map visualizes reported threats globally in real-time. You can see threat hotspots, trending attack types, and geographic distribution of cyber activities. It's updated instantly as new threats are reported."
    },
    {
      id: 9,
      icon: <Bell className="w-5 h-5" />,
      category: "Security",
      question: "How do real-time notifications work?",
      answer: "You'll receive instant alerts for high-priority threats, mission updates, badge achievements, and community milestones. Notifications can be customized based on your interests and threat categories you want to monitor."
    },
    {
      id: 10,
      icon: <Zap className="w-5 h-5" />,
      category: "Threat Reporting",
      question: "How does the AI assistant help with threat analysis?",
      answer: "Our intelligent AI assistant automatically analyzes reported threats, checks against known threat databases, performs URL reputation checks, and provides instant feedback on threat validity and severity levels."
    },
    {
      id: 11,
      icon: <Key className="w-5 h-5" />,
      category: "API",
      question: "How do I get started with the API?",
      answer: "Getting started is simple! First, sign up for an account and navigate to the API Tokens page to generate your API key. Then, check our comprehensive API documentation for integration guides, code examples, and best practices."
    },
    {
      id: 12,
      icon: <CheckCircle className="w-5 h-5" />,
      category: "API",
      question: "What are the API rate limits?",
      answer: "Free accounts have a limit of 1,000 requests per day with 5 requests per second. Premium accounts get 10,000 requests per day with 20 requests per second. Enterprise plans offer custom limits based on your needs."
    }
  ];

  const categories = [
    "All",
    "Threat Reporting", 
    "Security",
    "Gamification",
    "Community",
    "API"
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const filteredFAQs = selectedCategory === "All" 
    ? faqData.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData.filter(faq => 
        faq.category === selectedCategory &&
        (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const handleEmailContact = () => {
    window.location.href = "mailto:support@cyberthreat.com?subject=Support%20Request&body=Hello%20CyberThreat%20Team,%0D%0A%0D%0AI%20have%20a%20question%20about...";
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Navibar />
      
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <HelpCircle className="h-8 w-8 text-emerald-400" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-100">Frequently Asked Questions</h1>
        </div>
        
        <p className="text-neutral-400 text-xl leading-relaxed max-w-4xl">
          Get answers to common questions about our cybersecurity platform, threat reporting system, 
          API integration, and community features.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <Search className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-neutral-100">Search FAQs</h3>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for questions or topics..."
                className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-xl text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300"
              />
              <Search className="absolute right-4 top-3 h-5 w-5 text-neutral-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative group px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                selectedCategory === category
                  ? "bg-emerald-500/20 border-emerald-400/70 text-emerald-300 shadow-lg shadow-emerald-500/20"
                  : "bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-emerald-500/10 hover:border-emerald-400/30"
              } border`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-xl"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <span>{category}</span>
                <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded-full">
                  {category === "All" 
                    ? faqData.length 
                    : faqData.filter((faq) => faq.category === category).length
                  }
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-6 mb-12">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-300 mb-2">No FAQs found</h3>
            <p className="text-neutral-400">Try adjusting your search terms or category filter.</p>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => (
            <div
              key={faq.id}
              className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
              
              <div className="relative z-10">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between group hover:bg-emerald-500/5 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-all duration-300">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-sm group-hover:blur-md group-hover:bg-emerald-500/30 transition-all duration-300"></div>
                      <div className="relative z-10">{faq.icon}</div>
                    </div>
                    <div>
                      <div className="text-sm text-emerald-400 font-medium mb-1 group-hover:text-emerald-300 transition-colors duration-300">
                        {faq.category}
                      </div>
                      <div className="text-lg font-semibold text-neutral-100 group-hover:text-emerald-50 transition-colors duration-300">
                        {faq.question}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-emerald-400 transform transition-all duration-300 group-hover:text-emerald-300 group-hover:scale-110">
                    {openFAQ === faq.id ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFAQ === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="px-6 pb-6">
                    <div className="ml-16 text-neutral-300 leading-relaxed p-4 bg-emerald-500/5 rounded-lg border-l-2 border-emerald-500/30">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Section */}
      <div className="text-center">
        <div className="relative max-w-2xl mx-auto rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 p-8 backdrop-blur-sm border border-emerald-400/20 shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-neutral-100 mb-4">Still Have Questions?</h3>
            <p className="text-neutral-300 mb-6 max-w-xl mx-auto">
              Contact our security experts for personalized assistance with your cybersecurity needs 
              and get detailed guidance on using our platform effectively.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleEmailContact}
                className="group px-6 py-3 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Support</span>
                </span>
              </button>

              <button
                onClick={() => window.location.href = '/docs'}
                className="group px-6 py-3 border border-emerald-400 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-400 hover:text-black transition-all duration-300"
              >
                <span className="flex items-center justify-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>API Documentation</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;