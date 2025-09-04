import { useNavigate } from "react-router-dom";
import {
  Terminal as TerminalIcon,
  ShieldCheck,
  Shield,
  User,
  Smartphone,
  Activity,
  Chrome,
  Globe,
  Users,
  Key,
  MapPin,
  Wifi,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeaturesSection from "./components/Features.tsx";
import Footer from "./components/Footer.jsx";
import { Navibar } from "./components/navbar.tsx";

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: { clientX: any; clientY: any }) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
      animate={{
        x: position.x - 10,
        y: position.y - 10,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 300,
        mass: 0.2,
      }}
    >
      <div className="w-5 h-5 bg-white rounded-full shadow-lg">
        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full animate-pulse" />
      </div>
    </motion.div>
  );
};

function App() {
  const navigate = useNavigate();
  const testimonials = [
    {
      name: "Sarah M.",
      text: "Securo stopped me from clicking a fake bank link. Saved me from losing money!",
    },
    {
      name: "James T.",
      text: "I scanned a suspicious email link — Securo flagged it instantly. Huge relief.",
    },
    {
      name: "Priya K.",
      text: "My parents aren't tech-savvy, but with Securo, I know they're safer online.",
    },
    {
      name: "Daniel R.",
      text: "The WiFi scanner exposed a risky public network I almost connected to.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800">
   
      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-4 md:mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-3 mb-3 md:mb-0">
            <div className="relative">
              <TerminalIcon className="h-8 w-8 text-emerald-400" />
              <div className="absolute -top-1 -right-1 h-3 w-3">
                <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></div>
                <div className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-neutral-100">Securo</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-neutral-400">System Online</span>
            </div>
            <div className="hidden md:block h-8 w-px bg-neutral-800" />
            <div className="text-sm text-neutral-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Use Navbar component */}
        <Navibar />

        <header className="px-6 pt-10 pb-20 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            scams are dumb, <br />
            stay safe with <span className="typewriter">Securo</span>.
          </h2>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            securo helps protect <span className="text-emerald-400">kids</span>,
            <span className="text-emerald-400"> elders</span>, and
            <span className="text-emerald-400"> non-tech folks</span> from
            online frauds & digital scams.
          </p>

          {/* Buttons row */}
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <button
              onClick={() => navigate("/url")}
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition shadow-lg"
            >
              scan a link!
            </button>

            <button
              onClick={() => navigate("/docs")}
              className="px-6 py-3 rounded-2xl bg-gray-300 text-black font-semibold hover:bg-gray-100 transform transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              add web extension
            </button>
          </div>

          {/* Testimonials slider */}
          <div className="mt-12 overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                repeat: Infinity,
                duration: 25,
                ease: "linear",
              }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={i}
                  className="min-w-[300px] max-w-sm rounded-2xl bg-neutral-800/60 border border-neutral-700 p-5 shadow-md hover:shadow-lg transition"
                >
                  <p className="text-zinc-300 italic">"{t.text}"</p>
                  <p className="mt-3 text-emerald-400 font-semibold">
                    – {t.name}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-5 text-center">
            <p className="mt-2 text-zinc-400 max-w-xl mx-auto text-sm">
              Trusted by millions of people worldwide.
            </p>
          </div>

          <FeaturesSection />

          <div className="mt-32 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5 blur-3xl"></div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-emerald-400 font-medium">
                    Live Demo
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                  See Securo in Action
                </h3>
                <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                  Experience real-time threat detection with our AI-powered
                  security platform. Watch how we protect millions of users
                  every day.
                </p>
              </div>

              <div className="max-w-7xl mx-auto px-4">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl rotate-12 opacity-80"></div>
                  <div className="absolute -top-4 -right-8 w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl rotate-45 opacity-60"></div>

                  <div className="relative bg-gradient-to-br from-neutral-900/80 via-neutral-800/60 to-neutral-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-transparent to-cyan-500/20 opacity-50"></div>
                    <div className="absolute inset-[1px] bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 rounded-3xl"></div>

                    <div className="relative z-10 p-6 lg:p-8">
                      <div className="flex justify-end mb-6">
                        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-emerald-400 font-medium">
                            demo video
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        <div className="lg:col-span-3">
                          <div className="relative group">
                            <div
                              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 shadow-2xl"
                              style={{ aspectRatio: "16/10" }}
                            >
                              <div
                                className="absolute inset-0 opacity-5"
                                style={{
                                  backgroundImage:
                                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
                                  backgroundSize: "20px 20px",
                                }}
                              ></div>

                              <img
                                src="../public/securo.jpeg"
                                alt="Securo Demo Preview"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex items-center justify-center">
                                <button className="relative flex items-center justify-center w-28 h-28 bg-white/10 backdrop-blur-md border border-white/20 rounded-full transition-all duration-500 hover:scale-110 hover:bg-white/20 group">
                                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  <svg
                                    className="w-12 h-12 text-white ml-1 relative z-10"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="absolute -bottom-6 left-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg">
                              <div className="text-2xl font-bold text-white">
                                99.9%
                              </div>
                              <div className="text-sm text-zinc-400">
                                Threat Detection
                              </div>
                            </div>

                            <div className="absolute -top-6 right-8 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
                              <div className="text-2xl font-bold text-emerald-400">
                                &lt;1s
                              </div>
                              <div className="text-sm text-zinc-400">
                                Response Time
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                          <div>
                            <h4 className="text-xl font-bold text-white mb-3 leading-tight">
                              Next-Gen
                              <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Protection
                              </span>
                            </h4>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                              Watch our AI analyze millions of data points in
                              real-time.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <motion.div
                              className="group relative p-4 rounded-xl bg-neutral-800/30 border border-neutral-700/50 transition-all duration-500 hover:bg-neutral-800/60 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20 overflow-hidden cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                              <div className="relative z-10 flex items-center space-x-3 mb-2">
                                <motion.div
                                  className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300"
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.6 }}
                                >
                                  <Shield className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                                </motion.div>
                                <h5 className="font-semibold text-white text-sm group-hover:text-emerald-300 transition-colors">
                                  Real-time
                                </h5>
                              </div>
                              <p className="text-zinc-400 text-xs ml-13 group-hover:text-zinc-300 transition-colors">
                                Instant detection of anomalies and threats
                                before they impact your system.
                              </p>

                              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-full h-full bg-emerald-500 animate-pulse"></div>
                              </div>
                            </motion.div>

                            <motion.div
                              className="group relative p-4 rounded-xl bg-neutral-800/30 border border-neutral-700/50 transition-all duration-500 hover:bg-neutral-800/60 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20 overflow-hidden cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-cyan-500/10"></div>
                                <svg
                                  className="absolute inset-0 w-full h-full"
                                  viewBox="0 0 100 100"
                                >
                                  <defs>
                                    <pattern
                                      id="dots"
                                      x="0"
                                      y="0"
                                      width="20"
                                      height="20"
                                      patternUnits="userSpaceOnUse"
                                    >
                                      <circle
                                        cx="2"
                                        cy="2"
                                        r="1"
                                        fill="rgba(34, 211, 238, 0.3)"
                                      />
                                    </pattern>
                                  </defs>
                                  <rect
                                    width="100%"
                                    height="100%"
                                    fill="url(#dots)"
                                  />
                                </svg>
                              </div>

                              <div className="relative z-10 flex items-center space-x-3 mb-2">
                                <motion.div
                                  className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300"
                                  whileHover={{ scale: 1.1 }}
                                  animate={{
                                    boxShadow: [
                                      "0 0 0 rgba(34, 211, 238, 0)",
                                      "0 0 20px rgba(34, 211, 238, 0.3)",
                                      "0 0 0 rgba(34, 211, 238, 0)",
                                    ],
                                  }}
                                  transition={{
                                    boxShadow: {
                                      duration: 2,
                                      repeat: Infinity,
                                    },
                                    scale: { duration: 0.3 },
                                  }}
                                >
                                  <TerminalIcon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                                </motion.div>
                                <h5 className="font-semibold text-white text-sm group-hover:text-cyan-300 transition-colors">
                                  AI Engine
                                </h5>
                              </div>
                              <p className="text-zinc-400 text-xs ml-13 group-hover:text-zinc-300 transition-colors">
                                Machine-learning models trained on billions of
                                data points.
                              </p>

                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex space-x-1">
                                  {[...Array(3)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="w-1 h-1 bg-cyan-400 rounded-full"
                                      animate={{
                                        scale: [0.5, 1, 0.5],
                                        opacity: [0.3, 1, 0.3],
                                      }}
                                      transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </motion.div>

                            <motion.div
                              className="group relative p-4 rounded-xl bg-neutral-800/30 border border-neutral-700/50 transition-all duration-500 hover:bg-neutral-800/60 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-purple-400/10 to-purple-500/5 animate-pulse"></div>
                              </div>

                              <div className="relative z-10 flex items-center space-x-3 mb-2">
                                <motion.div
                                  className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300"
                                  whileHover={{
                                    rotate: [0, -10, 10, -10, 0],
                                    scale: 1.1,
                                  }}
                                  transition={{ duration: 0.6 }}
                                >
                                  <User className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                </motion.div>
                                <h5 className="font-semibold text-white text-sm group-hover:text-purple-300 transition-colors">
                                  Zero Friction
                                </h5>
                              </div>
                              <p className="text-zinc-400 text-xs ml-13 group-hover:text-zinc-300 transition-colors">
                                Security that integrates seamlessly with your
                                workflow.
                              </p>

                              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <motion.div
                                  className="w-6 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"
                                  animate={{
                                    x: [-20, 20, -20],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                />
                              </div>
                            </motion.div>
                          </div>

                          <div className="pt-4">
                            <motion.button
                              onClick={() => navigate("/url")}
                              className="group relative w-full overflow-hidden rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300 hover:scale-105"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-500 bg-size-200 animate-gradient-x"></div>

                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                              <div className="relative flex items-center justify-center space-x-2 text-neutral-900">
                                <motion.span
                                  className="font-bold"
                                  animate={{
                                    textShadow: [
                                      "0 0 0px rgba(255,255,255,0)",
                                      "0 0 10px rgba(255,255,255,0.8)",
                                      "0 0 0px rgba(255,255,255,0)",
                                    ],
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  Try Free
                                </motion.span>
                                <motion.svg
                                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  animate={{
                                    x: [0, 3, 0],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                  />
                                </motion.svg>
                              </div>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
            <span className="text-sm text-emerald-400 font-medium">
              Mobile App
            </span>
          </div>

          <h3 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Try our Mobile App today!
          </h3>

          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            With new features, and easy smartphone access for you!
          </p>
        </div>

        {/* Android App Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/20 via-neutral-900/60 to-emerald-800/20 border border-emerald-500/20 backdrop-blur-xl shadow-2xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 opacity-50"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                  <Smartphone className="w-4 h-4 text-emerald-400 mr-2" />
                  <span className="text-sm text-emerald-400 font-medium">
                    Download on Android
                  </span>
                </div>

                <div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Get Started with
                    <span className="block bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                      Securo Mobile
                    </span>
                    Today!
                  </h3>
                  <p className="text-xl text-zinc-400 leading-relaxed max-w-lg">
                    Securo Mobile gives you everything you need to stay safe
                    from digital threats with easy access from your smartphone.
                  </p>
                </div>

                <motion.button
                  className="group relative overflow-hidden rounded-2xl px-8 py-4 transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-size-200 animate-gradient-x"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

                  <div className="relative flex items-center justify-center space-x-3 text-neutral-900">
                    <span className="text-lg font-bold">Download the app</span>
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{
                        x: [0, 3, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </motion.svg>
                  </div>
                </motion.button>
              </div>

              {/* Phone Images */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                  <motion.div
                    className="relative"
                    animate={{
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <img
                      src="../public/securo.png"
                      alt="Securo Mobile App Screenshots"
                      className="max-w-full h-auto drop-shadow-2xl"
                      style={{
                        maxWidth: "500px",
                        filter:
                          "drop-shadow(0 25px 50px rgba(16, 185, 129, 0.3))",
                      }}
                    />
                  </motion.div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute -top-4 -left-4 w-16 h-16 bg-emerald-500/20 rounded-2xl backdrop-blur-sm border border-emerald-400/30 flex items-center justify-center"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-6 -right-6 w-14 h-14 bg-emerald-600/20 rounded-xl backdrop-blur-sm border border-emerald-300/30 flex items-center justify-center"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, -10, 10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Smartphone className="w-6 h-6 text-emerald-300" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
            <span className="text-sm text-emerald-400 font-medium">
              Powered by AstraAI
            </span>
          </div>

          <h3 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Smarter Protection with AstraAI
          </h3>

          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            AstraAI analyzes threats in real time, detects scams before you fall
            for them, and gives you clear insights.
          </p>
        </div>

        <div
          className="ai-bot relative"
          style={{
            marginTop: "5px",
            marginBottom: "50px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            borderRadius: "16px",
            padding: "20px",
            zIndex: "1",
            width: "100%",
            maxWidth: "100vw",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              zIndex: "-1",
              overflow: "hidden",
            }}
          >
            <video
              autoPlay
              loop
              muted
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: "0.4",
              }}
            >
              <source src="../public/globebg.mp4" type="video/mp4" />
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#121212",
                }}
              ></div>
            </video>

            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%)",
                zIndex: "0",
              }}
            ></div>
          </div>

          <div
            className="flex flex-col md:flex-row"
            style={{ marginLeft: "25px" }}
          >
            <div className="ai-text md:mr-auto">
              <h1
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 2rem)",
                  fontWeight: "bold",
                  color: "#00ff99",
                  width: "100%",
                  maxWidth: "500px",
                  textShadow:
                    "0 0 10px #00ff99, 0 0 20px #00cc88, 0 0 30px #008866",
                  fontFamily: '"Orbitron", sans-serif',
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: "Pointer",
                  marginTop: "20px",
                }}
              >
                Your AI Voice-Powered Assistant Against Digital Scams
              </h1>

              <h2
                style={{
                  fontSize: "clamp(1rem, 3vw, 1.3rem)",
                  color: "white",
                  width: "100%",
                  maxWidth: "700px",
                  marginTop: "30px",
                }}
              >
                Get security guidance in your preferred language. Our AI
                assistant supports Hindi, Marathi, and multiple regional
                languages to ensure everyone stays protected.
              </h2>

              <div
                className="ai-button"
                style={{ marginTop: "30px", marginBottom: "20px" }}
              >
                <motion.button
                  onClick={() => navigate("/chatbot")}
                  className="group relative overflow-hidden rounded-full px-10 py-5 transition-all duration-300 hover:scale-110 focus:scale-110 active:scale-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative rounded-full bg-neutral-900 px-8 py-3 transition-all duration-300 group-hover:bg-neutral-800">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative flex items-center justify-center space-x-3">
                      <motion.svg
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-emerald-400 group-hover:text-cyan-400 transition-colors duration-300"
                        animate={{
                          rotate: [0, 180, 360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <path
                          className="path"
                          fill="currentColor"
                          d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                        />
                        <path
                          className="path"
                          fill="currentColor"
                          d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
                        />
                        <path
                          className="path"
                          fill="currentColor"
                          d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 5.84528 6.24282 5.75223 6.4085 5.697L7 5.5L6.4085 5.303C6.24282 5.24777 6.09226 5.15472 5.96877 5.03123C5.84528 4.90774 5.75223 4.75718 5.697 4.5915L6.5 4Z"
                        />
                      </motion.svg>

                      <motion.span
                        className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-emerald-400 transition-all duration-300"
                        animate={{
                          backgroundPosition: ["0%", "100%", "0%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        Try it out!
                      </motion.span>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              y: [0, -20, 0],
                              opacity: [0, 1, 0],
                              scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.3,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>

            <div
              className="ai-pic mt-6 md:mt-0"
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "auto",
                position: "relative",
                marginLeft: "auto",
                alignSelf: "center",
              }}
            >
              <img
                src="../public/green.png"
                alt="AI Assistant"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <style>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}

export default App;
