import { useNavigate } from "react-router-dom";
import {
  Terminal as TerminalIcon,
  Shield,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export function Navibar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userEmail");
      navigate("/");
    }
  };

  function handleProfileClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    navigate("/profile");
  }

  // Function to handle community navigation
  const handleCommunityClick = () => {
    // Open the community application in a new tab
    window.open("http://localhost:3001/Login", "_blank");
  };

  return (
    <div className="w-full top-0 left-0 z-40 bg-neutral-900/80 backdrop-blur-sm">
      <div className="container mx-auto p-4 md:p-8">
        <div className="Navbar">
          <div className="relative mb-2 flex items-center justify-between rounded-2xl bg-neutral-800/50 p-3 backdrop-blur-sm">
            <div className="flex items-center min-w-0 flex-1">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="relative"></div>
              </div>

              <nav className="hidden lg:block flex-1 mx-4">
                <ul className="flex items-center justify-center space-x-3 xl:space-x-4">
                  <li className="group relative flex-shrink-0">
                    <button
                      onClick={() => navigate("/home")}
                      className="flex items-center px-2 py-1 text-sm xl:text-base text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      <span>Home</span>
                    </button>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                  <li className="group relative flex-shrink-0">
                    <button
                      onClick={handleCommunityClick}
                      className="flex items-center px-2 py-1 text-sm xl:text-base text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      <span>Community</span>
                    </button>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                  <li className="group relative flex-shrink-0">
                    <button
                      onClick={() => navigate("/threat")}
                      className="flex items-center px-2 py-1 text-sm xl:text-base text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      <span>Report Threat</span>
                    </button>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                  <li className="group relative flex-shrink-0">
                    <button
                      onClick={() => navigate("/url")}
                      className="flex items-center px-2 py-1 text-sm xl:text-base text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      <span>Scan Link</span>
                    </button>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                  
                  <li className="group relative flex-shrink-0">
                    <button
                      onClick={() => navigate("/wifi")}
                      className="flex items-center px-2 py-1 text-sm xl:text-base text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      <span>Scan WiFi</span>
                    </button>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                  <li className="group relative flex-shrink-0">
                    <button
                      onClick={() => navigate("/token")}
                      className="flex items-center px-2 py-1 text-sm xl:text-base text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      <span>Developers</span>
                    </button>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                  <li className="group relative flex-shrink-0">
                    <button
                      onClick={() => navigate("/faqs")}
                      className="flex items-center px-2 py-1 text-sm xl:text-base text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      <span>FAQs</span>
                    </button>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                  <li className="group relative flex-shrink-0">
                    <button
                      onClick={() => navigate("/email")}
                      className="flex items-center px-2 py-1 text-sm xl:text-base text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      <span>Password</span>
                    </button>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                    <li className="group relative flex-shrink-0">
                    <button
                      onClick={() => navigate("/map")}
                      className="flex items-center px-2 py-1 text-sm xl:text-base text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      <span>Analyze</span>
                    </button>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                </ul>
              </nav>

              {/* Mobile menu for medium screens */}
              <nav className="hidden md:block lg:hidden flex-1 mx-4">
                <ul className="flex items-center justify-center space-x-2">
                  <li className="group relative">
                    <button
                      onClick={() => navigate("/home")}
                      className="px-1 py-1 text-xs text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      Home
                    </button>
                  </li>
                  <li className="group relative">
                    <button
                      onClick={handleCommunityClick}
                      className="px-1 py-1 text-xs text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      Community
                    </button>
                  </li>
                  <li className="group relative">
                    <button
                      onClick={() => navigate("/threat")}
                      className="px-1 py-1 text-xs text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      Report
                    </button>
                  </li>
                  <li className="group relative">
                    <button
                      onClick={() => navigate("/url")}
                      className="px-1 py-1 text-xs text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      URL
                    </button>
                  </li>
                  <li className="group relative">
                    <button
                      onClick={() => navigate("/wifi")}
                      className="px-1 py-1 text-xs text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      WiFi
                    </button>
                  </li>
                  <li className="group relative">
                    <button
                      onClick={() => navigate("/token")}
                      className="px-1 py-1 text-xs text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      Dev
                    </button>
                  </li>
                  <li className="group relative">
                    <button
                      onClick={() => navigate("/faqs")}
                      className="px-1 py-1 text-xs text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      FAQ
                    </button>
                  </li>
                  <li className="group relative">
                    <button
                      onClick={() => navigate("/email")}
                      className="px-1 py-1 text-xs text-neutral-400 transition-colors hover:text-emerald-400 whitespace-nowrap"
                    >
                      Pass
                    </button>
                  </li>
                </ul>
              </nav>

              <button
                className="md:hidden lg:hidden text-emerald-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button className="flex items-center justify-center rounded-full bg-emerald-400/10 p-2 text-emerald-400 transition-all hover:bg-emerald-400/20">
                <Shield className="h-4 w-4 xl:h-5 xl:w-5" />
              </button>

              <motion.button
                onClick={() => navigate("/chatbot")}
                className="group relative overflow-hidden rounded-full px-4 xl:px-6 py-2 xl:py-3 transition-all duration-300 hover:scale-105 focus:scale-105 active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative rounded-full bg-neutral-900 px-3 xl:px-4 py-1 xl:py-2 transition-all duration-300 group-hover:bg-neutral-800">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex items-center justify-center space-x-1 xl:space-x-2">
                    <motion.svg
                      fill="none"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 xl:w-5 xl:h-5 text-emerald-400 group-hover:text-cyan-400 transition-colors duration-300"
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
                      className="text-sm xl:text-base font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-emerald-400 transition-all duration-300"
                      animate={{
                        backgroundPosition: ["0%", "100%", "0%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      AstraAI
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

              {/* Mobile/Tablet menu button */}
              <button
                className="lg:hidden text-emerald-400 ml-auto"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center rounded-full bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                title="Logout"
              >
                <LogOut className="h-4 w-4 xl:h-5 xl:w-5" />
              </button>

              {/* User Profile Button */}
              <button
                onClick={handleProfileClick}
                className="flex items-center justify-center rounded-full bg-blue-500/10 p-2 text-blue-400 transition-all hover:bg-blue-500/20 hover:text-blue-300"
                title="Profile"
              >
                <User className="h-4 w-4 xl:h-5 xl:w-5" />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden bg-neutral-800/90 backdrop-blur-sm rounded-lg p-4 mb-4">
              <ul className="space-y-3">
                <li className="group">
                  <button
                    onClick={() => navigate("/home")}
                    className="block text-neutral-400 hover:text-emerald-400 py-1"
                  >
                    Home
                  </button>
                </li>
                <li className="group">
                  <button
                    onClick={handleCommunityClick}
                    className="block text-neutral-400 hover:text-emerald-400 py-1"
                  >
                    Community
                  </button>
                </li>
                <li className="group">
                  <button
                    onClick={() => navigate("/threat")}
                    className="block text-neutral-400 hover:text-emerald-400 py-1"
                  >
                    Report a threat
                  </button>
                </li>
                <li className="group">
                  <button
                    onClick={() => navigate("/url")}
                    className="block text-neutral-400 hover:text-emerald-400 py-1"
                  >
                    Scan a Link
                  </button>
                </li>
                <li className="group">
                  <button
                    onClick={() => navigate("/wifi")}
                    className="block text-neutral-400 hover:text-emerald-400 py-1"
                  >
                    Scan a WiFi Network
                  </button>
                </li>
                <li className="group">
                  <button
                    onClick={() => navigate("/token")}
                    className="block text-neutral-400 hover:text-emerald-400 py-1"
                  >
                    For Developers
                  </button>
                </li>
                <li className="group">
                  <button
                    onClick={() => navigate("/faqs")}
                    className="block text-neutral-400 hover:text-emerald-400 py-1"
                  >
                    FAQs
                  </button>
                </li>
                <li className="group">
                  <button
                    onClick={() => navigate("/email")}
                    className="block text-neutral-400 hover:text-emerald-400 py-1"
                  >
                    Password
                  </button>
                </li>
                <li className="group pt-2 border-t border-neutral-700">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 py-1 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}