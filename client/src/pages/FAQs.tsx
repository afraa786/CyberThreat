import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Users,
  Zap,
  Target,
  Award,
  Globe,
  Bell,
  Lock,
  ArrowLeft,
  Mail,
} from "lucide-react";

const FAQsPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const faqData = [
    {
      id: 1,
      icon: <Shield className="w-5 h-5" />,
      category: "Threat Reporting",
      question: "How do I report a cyber threat?",
      answer:
        "Simply navigate to the threat reporting section, select the type of threat (phishing URL, malware, suspicious activity), provide the details, and submit. Our AI assistant will analyze and categorize the threat in real-time.",
    },
    {
      id: 2,
      icon: <Zap className="w-5 h-5" />,
      category: "Threat Reporting",
      question: "What types of threats can I report?",
      answer:
        "You can report phishing URLs, malware samples, suspicious emails, fraudulent websites, social engineering attempts, data breaches, and any other cybersecurity incidents. Our AI categorizes and validates each report.",
    },
    {
      id: 3,
      icon: <Lock className="w-5 h-5" />,
      category: "Security",
      question: "How secure is my data on CyberThreat?",
      answer:
        "We implement JWT-based authentication for secure API access, end-to-end encryption for sensitive data, and follow industry-standard security protocols. Your personal information is never shared without consent.",
    },
    {
      id: 4,
      icon: <Shield className="w-5 h-5" />,
      category: "Security",
      question: "What makes the threat detection real-time?",
      answer:
        "We use Apache Kafka for real-time data streaming, which processes and aggregates threat intelligence as it's reported. This ensures immediate threat analysis and rapid community alerts.",
    },
    {
      id: 5,
      icon: <Award className="w-5 h-5" />,
      category: "Gamification",
      question: "How does the XP and badge system work?",
      answer:
        "You earn XP points for reporting valid threats, participating in missions, and contributing to the community. Badges are awarded for specific achievements like 'First Reporter', 'Threat Hunter', or 'Community Guardian'. Higher levels unlock exclusive features.",
    },
    {
      id: 6,
      icon: <Target className="w-5 h-5" />,
      category: "Gamification",
      question: "What are missions and how do I participate?",
      answer:
        "Missions are time-limited challenges that focus on specific threat types or security objectives. They might involve identifying phishing campaigns, analyzing malware samples, or contributing to threat intelligence. Complete missions to earn bonus XP and exclusive badges.",
    },
    {
      id: 7,
      icon: <Users className="w-5 h-5" />,
      category: "Community",
      question: "How does the leaderboard ranking work?",
      answer:
        "Rankings are based on your total XP, quality of threat reports, mission completions, and community engagement. Top contributors are featured on the leaderboard and receive special recognition badges.",
    },
    {
      id: 8,
      icon: <Globe className="w-5 h-5" />,
      category: "Community",
      question: "What is the Live Cyber Threat Map?",
      answer:
        "Our interactive map visualizes reported threats globally in real-time. You can see threat hotspots, trending attack types, and geographic distribution of cyber activities. It's updated instantly as new threats are reported.",
    },
    {
      id: 9,
      icon: <Bell className="w-5 h-5" />,
      category: "Security",
      question: "How do real-time notifications work?",
      answer:
        "You'll receive instant alerts for high-priority threats, mission updates, badge achievements, and community milestones. Notifications can be customized based on your interests and threat categories you want to monitor.",
    },
    {
      id: 10,
      icon: <Zap className="w-5 h-5" />,
      category: "Threat Reporting",
      question: "How does the AI assistant help with threat analysis?",
      answer:
        "Our intelligent AI assistant automatically analyzes reported threats, checks against known threat databases, performs URL reputation checks, and provides instant feedback on threat validity and severity levels.",
    },
  ];

  const categories = [
    "All",
    "Threat Reporting",
    "Security",
    "Gamification",
    "Community",
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const filteredFAQs =
    selectedCategory === "All"
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  // Updated to use navigate for home navigation - same pattern as other nav items
  const handleBackToHome = () => {
    navigate("/home");
  };

  const handleEmailContact = () => {
    window.location.href =
      "mailto:support@cyberthreat.com?subject=Support%20Request&body=Hello%20CyberThreat%20Team,%0D%0A%0D%0AI%20have%20a%20question%20about...";
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .grid-background {
            background-image: 
              linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: grid-move 20s linear infinite;
          }
          
          .floating-dot {
            animation: float ease-in-out infinite;
          }
          
          .fade-in-up {
            animation: fadeInUp 0.6s ease-out both;
          }
        `,
        }}
      />

      <div className="fixed inset-0">
        <div className="absolute inset-0 opacity-20 grid-background" />

        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 floating-dot"
              style={
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  animationDelay: `${Math.random() * 2}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 pt-8">
          <button
            onClick={handleBackToHome}
            className="group flex items-center space-x-3 text-green-400 hover:text-green-300 transition-all duration-300 mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative w-10 h-10 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center group-hover:bg-green-500/30 group-hover:border-green-400/70 transition-all duration-300">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </div>
            <span className="font-semibold text-lg">Back to Home</span>
          </button>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent blur-sm opacity-50">
                FREQUENTLY ASKED QUESTIONS
              </div>
            </div>
            <h1 className="relative text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
              FREQUENTLY ASKED QUESTIONS
            </h1>

            <div className="relative w-32 h-1 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent blur-sm"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
            </div>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get answers to common questions about CyberThreat's advanced
              security features, threat reporting system, and community-driven
              cybersecurity platform.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative group px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-green-500/30 border-green-400/70 text-green-300 shadow-lg shadow-green-500/20"
                    : "bg-gray-900/60 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-400/60"
                } border backdrop-blur-sm`}
              >
                {selectedCategory === category && (
                  <div className="absolute inset-0 bg-green-500/20 rounded-lg blur-md animate-pulse"></div>
                )}
                <span className="relative z-10">{category}</span>

                <span className="relative z-10 ml-2 text-xs bg-green-500/20 px-2 py-1 rounded-full">
                  {category === "All"
                    ? faqData.length
                    : faqData.filter((faq) => faq.category === category).length}
                </span>
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {filteredFAQs.map((faq, index) => (
              <div
                key={faq.id}
                className="relative group fade-in-up"
                style={
                  {
                    animationDelay: `${index * 0.1}s`,
                  } as React.CSSProperties
                }
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-400/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                <div className="relative bg-gray-900/40 backdrop-blur-md border border-green-500/20 rounded-xl overflow-hidden hover:border-green-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between group/button hover:bg-green-500/5 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-green-400 group-hover/button:text-green-300 transition-all duration-300">
                        <div className="absolute inset-0 bg-green-500/20 rounded-lg blur-sm group-hover/button:blur-md group-hover/button:bg-green-500/30 transition-all duration-300"></div>
                        <div className="relative z-10">{faq.icon}</div>
                      </div>
                      <div>
                        <div className="text-sm text-green-400 font-medium mb-1 group-hover/button:text-green-300 transition-colors duration-300">
                          {faq.category}
                        </div>
                        <div className="text-lg font-semibold text-white group-hover/button:text-green-100 transition-colors duration-300">
                          {faq.question}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-green-400 transform transition-all duration-300 group-hover/button:text-green-300 group-hover/button:scale-110">
                      {openFAQ === faq.id ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${
                      openFAQ === faq.id
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6">
                      <div className="ml-16 text-gray-300 leading-relaxed p-4 bg-green-500/5 rounded-lg border-l-2 border-green-500/30">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-400/5 rounded-2xl blur-xl"></div>

              <div className="relative bg-gray-900/60 backdrop-blur-md border border-green-500/30 rounded-2xl p-8 group-hover:border-green-400/50 transition-all duration-500">
                <h3 className="text-2xl font-bold text-green-400 mb-4">
                  Still Have Questions?
                </h3>
                <p className="text-gray-300 mb-6">
                  Contact our security experts for personalized assistance with
                  your cybersecurity needs.
                </p>

                <button
                  onClick={handleEmailContact}
                  className="relative group/btn px-8 py-4 bg-green-500/20 border border-green-500/50 rounded-lg font-semibold text-green-400 hover:bg-green-500/30 hover:border-green-400/70 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto"
                >
                  <div className="absolute inset-0 bg-green-500/10 rounded-lg blur-sm group-hover/btn:blur-md group-hover/btn:bg-green-500/20 transition-all duration-300"></div>
                  <Mail className="relative z-10 w-5 h-5" />
                  <span className="relative z-10">Email Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;