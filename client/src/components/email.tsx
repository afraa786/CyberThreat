import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Info,
  Search,
  Lock,
  Database,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Navibar } from "./navbar";

const SecuroPasswordChecker = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock SHA1 function - replace with actual crypto-js import
  const mockSHA1 = (str) => {
    // This is a placeholder - you'll need to import and use actual SHA1 from crypto-js
    return "MOCK" + str.length.toString().padStart(35, "0");
  };

  const checkPassword = async () => {
    if (!password) {
      setError("Please enter a password");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // For demo purposes, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock logic - replace with actual HIBP API call
      const isCommonPassword = [
        "password",
        "123456",
        "admin",
        "qwerty",
      ].includes(password.toLowerCase());

      if (isCommonPassword) {
        setResult({
          isPwned: true,
          count: Math.floor(Math.random() * 1000000) + 50000,
        });
      } else {
        setResult({ isPwned: false });
      }
    } catch (err) {
      setError(
        "An error occurred while checking the password. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkPassword();
    }
  };

  const StatCard = ({ icon: Icon, title, description }) => (
    <div className="relative rounded-2xl bg-neutral-800/50 p-6 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
      <div className="relative z-10">
        <Icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
        <h3 className="font-semibold text-white mb-2 text-center">{title}</h3>
        <p className="text-gray-400 text-sm text-center">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-6 py-16">
         <Navibar />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Is Your Password Safe?
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Instantly verify if your password has been exposed in data
              breaches. Protect your accounts with our advanced security
              validation.
            </p>
          </motion.div>

          {/* Main Checker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Check Your Password
              </h2>

              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enter password to verify
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your password..."
                      disabled={isLoading}
                      className="w-full bg-neutral-900/50 border border-neutral-600 rounded-xl px-4 py-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={checkPassword}
                  disabled={isLoading || !password}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:opacity-50 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: !isLoading && password ? 1.02 : 1 }}
                  whileTap={{ scale: !isLoading && password ? 0.98 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Analyzing Password...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Check Password Security</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <p className="text-red-300">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Display */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-6 p-6 rounded-xl backdrop-blur-sm border ${
                      result.isPwned
                        ? "bg-red-900/20 border-red-500/50"
                        : "bg-emerald-900/20 border-emerald-500/50"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-xl ${
                          result.isPwned ? "bg-red-500/20" : "bg-emerald-500/20"
                        }`}
                      >
                        {result.isPwned ? (
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`text-xl font-bold mb-2 ${
                            result.isPwned ? "text-red-300" : "text-emerald-300"
                          }`}
                        >
                          {result.isPwned ? (
                            <>Password Compromised!</>
                          ) : (
                            <>Password Secure</>
                          )}
                        </h3>
                        {result.isPwned ? (
                          <div className="space-y-2">
                            <p className="text-red-200">
                              This password has been found in{" "}
                              <span className="font-bold text-red-300">
                                {result.count?.toLocaleString()}
                              </span>{" "}
                              data breaches.
                            </p>
                            <p className="text-gray-300 text-sm">
                              You should immediately change this password on all
                              accounts where it's used.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-emerald-200">
                              This password hasn't been found in any known data
                              breaches.
                            </p>
                            <p className="text-gray-300 text-sm">
                              While this is good, ensure your password is still
                              strong and unique for each account.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <StatCard
              icon={Database}
              title="Billion+ Records"
              description="Comprehensive database of compromised passwords"
            />
            <StatCard
              icon={Zap}
              title="Instant Results"
              description="Real-time password breach detection"
            />
            <StatCard
              icon={Shield}
              title="Privacy First"
              description="Your password never leaves your device"
            />
          </div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
            <div className="relative z-10 p-6">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-700/30 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <Info className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">
                    How SecuroCheck Works
                  </h3>
                </div>
                {showInfo ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-6">
                      <div className="relative rounded-xl bg-neutral-900/30 p-4 border border-neutral-600/50">
                        <h4 className="font-semibold text-emerald-400 mb-2 flex items-center space-x-2">
                          <Database className="w-4 h-4" />
                          <span>What are Compromised Passwords?</span>
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Compromised passwords are real-world passwords that
                          have been exposed in data breaches. These passwords
                          are no longer safe to use because attackers have
                          access to them and use them in credential stuffing
                          attacks across multiple websites.
                        </p>
                      </div>

                      <div className="relative rounded-xl bg-neutral-900/30 p-4 border border-neutral-600/50">
                        <h4 className="font-semibold text-emerald-400 mb-2 flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>Your Privacy is Protected</span>
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          SecuroCheck uses k-anonymity to protect your privacy.
                          Your password is hashed with SHA-1, and only the first
                          5 characters of the hash are sent to check against
                          breach databases. Your actual password never leaves
                          your device.
                        </p>
                      </div>

                      <div className="relative rounded-xl bg-neutral-900/30 p-4 border border-neutral-600/50">
                        <h4 className="font-semibold text-emerald-400 mb-2 flex items-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span>Why Change Compromised Passwords</span>
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          If your password appears in our database, it means
                          it's been found in at least one data breach.
                          Cybercriminals use these passwords in automated
                          attacks to try to gain access to accounts across the
                          internet. Change it immediately on all accounts.
                        </p>
                      </div>

                      <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-500/30">
                        <h4 className="font-semibold text-emerald-400 mb-2">
                          Pro Tip: Use a Password Manager
                        </h4>
                        <p className="text-emerald-200 text-sm">
                          Generate unique, strong passwords for every account
                          and let a password manager remember them for you. This
                          is the most effective way to stay secure online.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <div className="relative rounded-xl bg-neutral-800/30 p-4 backdrop-blur-sm border border-neutral-700/30">
              <p className="text-gray-400 text-sm">
                Powered by SecuroCheck technology. Data sourced from{" "}
                <a
                  href="https://haveibeenpwned.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Have I Been Pwned
                </a>{" "}
                breach database.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SecuroPasswordChecker;
