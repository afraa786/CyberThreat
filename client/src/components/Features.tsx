import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Wifi,
  MessageSquare,
  Users,
  Link,
  Scan,
  Zap,
  Eye,
  ShieldCheck,
} from "lucide-react";

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: "url-scanning",
      title: "URL Scanning",
      subtitle: "Real-time analysis of suspicious links",
      icon: Link,
      color: "emerald",
      description:
        "Paste any link and instantly verify whether it’s safe, malicious, or part of a phishing attempt.",
      benefits: [
        "Threat detection in under a second",
        "Cross-checks with 50+ security databases",
        "Behavioral analysis of suspicious sites",
        "Supports shortened and obfuscated URLs",
      ],
      demoText: "Scanning: https://definitely-not-a-scam.com",
      bgPattern: "chain",
    },
    {
      id: "threat-report",
      title: "Threat Reporting",
      subtitle: "Strengthening security through collaboration",
      icon: AlertTriangle,
      color: "red",
      description:
        "Submit fraudulent websites, emails, and scams to protect others and improve collective threat intelligence.",
      benefits: [
        "Contribute to community protection",
        "Accelerates inclusion in blocklists",
        "Supports AI detection models",
        "Enhances global cybersecurity data",
      ],
      demoText: "Reporting: Fake crypto investment site",
      bgPattern: "warning",
    },
    {
      id: "wifi-scanning",
      title: "WiFi Security",
      subtitle: "Safeguarding your network connections",
      icon: Wifi,
      color: "cyan",
      description:
        "Evaluate WiFi networks to ensure strong encryption and detect unsafe or fraudulent access points.",
      benefits: [
        "Detects rogue access points",
        "Analyzes encryption standards",
        "Identifies abnormal network activity",
        "Provides quick security status reports",
      ],
      demoText: "Scanning: Starbucks_Guest_Network",
      bgPattern: "waves",
    },
    {
      id: "ai-assistant",
      title: "AstraAI Assistant",
      subtitle: "Your intelligent cybersecurity advisor",
      icon: MessageSquare,
      color: "purple",
      description:
        "Consult AstraAI for guidance on suspicious emails, websites, and digital threats—powered by advanced AI models.",
      benefits: [
        "On-demand threat evaluation",
        "Available 24/7",
        "Clear and practical recommendations",
        "Continuously updated with global threat data",
      ],
      demoText: "AstraAI: This email shows clear signs of phishing.",
      bgPattern: "neural",
    },
    {
      id: "community",
      title: "Community Hub",
      subtitle: "A network built on shared security",
      icon: Users,
      color: "orange",
      description:
        "Engage with a global community exchanging verified reports, cybersecurity insights, and prevention strategies.",
      benefits: [
        "Access collective threat knowledge",
        "Learn from expert and peer experiences",
        "Share verified security insights",
        "Strengthen awareness through collaboration",
      ],
      demoText: "Latest: “How I identified a fake IRS call”",
      bgPattern: "community",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: {
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        glow: "shadow-emerald-500/20",
        gradient: "from-emerald-500/20 to-emerald-600/20",
      },
      red: {
        text: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        glow: "shadow-red-500/20",
        gradient: "from-red-500/20 to-red-600/20",
      },
      cyan: {
        text: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/30",
        glow: "shadow-cyan-500/20",
        gradient: "from-cyan-500/20 to-cyan-600/20",
      },
      purple: {
        text: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        glow: "shadow-purple-500/20",
        gradient: "from-purple-500/20 to-purple-600/20",
      },
      orange: {
        text: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        glow: "shadow-orange-500/20",
        gradient: "from-orange-500/20 to-orange-600/20",
      },
    };
    return colors[color];
  };

  const BackgroundPattern = ({ pattern, color }) => {
    const colorClasses = getColorClasses(color);

    switch (pattern) {
      case "chain":
        return (
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="chain"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="5"
                    cy="5"
                    r="2"
                    fill="currentColor"
                    className={colorClasses.text}
                  />
                  <circle
                    cx="15"
                    cy="15"
                    r="2"
                    fill="currentColor"
                    className={colorClasses.text}
                  />
                  <path
                    d="M5,5 L15,15"
                    stroke="currentColor"
                    strokeWidth="1"
                    className={colorClasses.text}
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#chain)" />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-4 h-4 rotate-45 border-2 border-red-400"></div>
            <div className="absolute bottom-8 right-6 w-3 h-3 rotate-12 border-2 border-red-400"></div>
            <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
          </div>
        );
      case "waves":
        return (
          <div className="absolute inset-0 opacity-20">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0,50 Q25,30 50,50 T100,50 V100 H0 V50"
                fill="currentColor"
                className={colorClasses.text}
              />
            </svg>
          </div>
        );
      case "neural":
        return (
          <div className="absolute inset-0 opacity-15">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="neural"
                  x="0"
                  y="0"
                  width="15"
                  height="15"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="7.5"
                    cy="7.5"
                    r="1"
                    fill="currentColor"
                    className={colorClasses.text}
                  />
                  <line
                    x1="0"
                    y1="7.5"
                    x2="15"
                    y2="7.5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className={colorClasses.text}
                  />
                  <line
                    x1="7.5"
                    y1="0"
                    x2="7.5"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className={colorClasses.text}
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#neural)" />
            </svg>
          </div>
        );
      case "community":
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-6 left-8 w-8 h-8 rounded-full border-2 border-orange-400"></div>
            <div className="absolute bottom-12 right-12 w-6 h-6 rounded-full border-2 border-orange-400"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-orange-400/30"></div>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <path
                d="M20,30 Q50,10 80,30"
                stroke="currentColor"
                strokeWidth="1"
                className="text-orange-400"
                fill="none"
                opacity="0.3"
              />
              <path
                d="M30,70 Q50,90 70,70"
                stroke="currentColor"
                strokeWidth="1"
                className="text-orange-400"
                fill="none"
                opacity="0.3"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-16 mb-32 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-neutral-900/50 to-cyan-900/10 blur-3xl"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="absolute top-20 left-1/4 w-2 h-2 bg-emerald-400/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-3 h-3 bg-cyan-400/20 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-40 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping delay-1000"></div>

        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
            <span className="text-sm text-emerald-400 font-medium">
              Use Cases
            </span>
          </div>

          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Features That Set Us Apart{" "}
          </h3>

          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Our platform combines essential security features with practical use
            cases.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            const Icon = feature.icon;

            return (
              <motion.button
                key={feature.id}
                onClick={() => setActiveTab(index)}
                className={`relative group px-6 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === index
                    ? `${colorClasses.bg} ${colorClasses.border} border shadow-lg ${colorClasses.glow}`
                    : "bg-neutral-800/30 border border-neutral-700/50 hover:bg-neutral-800/60"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeTab === index
                        ? `bg-gradient-to-br ${colorClasses.gradient}`
                        : "bg-neutral-700/50"
                    }`}
                    animate={
                      activeTab === index ? { rotate: [0, 5, -5, 0] } : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        activeTab === index
                          ? colorClasses.text
                          : "text-neutral-400"
                      }`}
                    />
                  </motion.div>

                  <span
                    className={`font-semibold text-sm ${
                      activeTab === index
                        ? colorClasses.text
                        : "text-neutral-400 group-hover:text-white"
                    }`}
                  >
                    {feature.title}
                  </span>
                </div>

                {activeTab === index && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-2xl ${colorClasses.bg} ${colorClasses.border} border -z-10`}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {features.map((feature, index) => {
              if (index !== activeTab) return null;

              const colorClasses = getColorClasses(feature.color);
              const Icon = feature.icon;

              return (
                <div
                  key={feature.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <motion.div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClasses.gradient} flex items-center justify-center shadow-lg ${colorClasses.glow}`}
                          animate={{
                            boxShadow: [
                              `0 0 0 ${
                                feature.color === "emerald"
                                  ? "rgba(16, 185, 129, 0)"
                                  : feature.color === "red"
                                  ? "rgba(239, 68, 68, 0)"
                                  : feature.color === "cyan"
                                  ? "rgba(34, 211, 238, 0)"
                                  : feature.color === "purple"
                                  ? "rgba(168, 85, 247, 0)"
                                  : "rgba(249, 115, 22, 0)"
                              }`,
                              `0 0 20px ${
                                feature.color === "emerald"
                                  ? "rgba(16, 185, 129, 0.3)"
                                  : feature.color === "red"
                                  ? "rgba(239, 68, 68, 0.3)"
                                  : feature.color === "cyan"
                                  ? "rgba(34, 211, 238, 0.3)"
                                  : feature.color === "purple"
                                  ? "rgba(168, 85, 247, 0.3)"
                                  : "rgba(249, 115, 22, 0.3)"
                              }`,
                              `0 0 0 ${
                                feature.color === "emerald"
                                  ? "rgba(16, 185, 129, 0)"
                                  : feature.color === "red"
                                  ? "rgba(239, 68, 68, 0)"
                                  : feature.color === "cyan"
                                  ? "rgba(34, 211, 238, 0)"
                                  : feature.color === "purple"
                                  ? "rgba(168, 85, 247, 0)"
                                  : "rgba(249, 115, 22, 0)"
                              }`,
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Icon className={`w-8 h-8 ${colorClasses.text}`} />
                        </motion.div>

                        <div>
                          <h4 className="text-3xl font-bold text-white">
                            {feature.title}
                          </h4>
                          <p className={`text-sm ${colorClasses.text} mt-1`}>
                            {feature.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="text-lg text-zinc-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {feature.benefits.map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start space-x-3"
                        >
                          <motion.div
                            className={`w-6 h-6 rounded-full bg-gradient-to-br ${colorClasses.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}
                            whileHover={{ scale: 1.1 }}
                          >
                            <Zap className={`w-3 h-3 ${colorClasses.text}`} />
                          </motion.div>
                          <span className="text-zinc-300">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      className={`relative bg-neutral-800/60 border ${colorClasses.border} rounded-3xl p-8 backdrop-blur-xl shadow-2xl overflow-hidden`}
                    >
                      <BackgroundPattern
                        pattern={feature.bgPattern}
                        color={feature.color}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${colorClasses.bg} ${colorClasses.text} animate-pulse`}
                            ></div>
                            <span className="text-sm text-zinc-400">
                              Status: Active
                            </span>
                          </div>
                          <Eye className={`w-5 h-5 ${colorClasses.text}`} />
                        </div>

                        <div className="bg-neutral-900/80 rounded-xl p-4 font-mono text-sm">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>

                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                            className="overflow-hidden"
                          >
                            <div
                              className={`${colorClasses.text} whitespace-nowrap`}
                            >
                              {feature.demoText}
                            </div>
                          </motion.div>

                          <div className="mt-2 text-emerald-400">
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              ▋
                            </motion.span>
                          </div>
                        </div>

                        <div className="mt-6 space-y-3">
                          {[
                            "Threat Analysis",
                            "Security Check",
                            "Final Verdict",
                          ].map((label, idx) => (
                            <div key={label} className="space-y-1">
                              <div className="flex justify-between text-xs text-zinc-400">
                                <span>{label}</span>
                                <span>100%</span>
                              </div>
                              <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full bg-gradient-to-r ${colorClasses.gradient} rounded-full`}
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{
                                    delay: idx * 0.3,
                                    duration: 1.5,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <motion.div
                      className={`absolute -top-6 -right-6 w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses.gradient} rotate-12 opacity-80`}
                      animate={{ rotate: [12, 18, 12] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    <motion.div
                      className={`absolute -bottom-4 -left-4 w-8 h-8 rounded-xl bg-gradient-to-br ${colorClasses.gradient} -rotate-12 opacity-60`}
                      animate={{ rotate: [-12, -18, -12] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeaturesSection;
