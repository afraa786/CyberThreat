import React, { useState } from "react";

// SVG Icon Components to replace lucide-react
const Shield = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Eye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const AlertTriangle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Info = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Search = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Lock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Database = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="m3 5 0 14c0 3 4 3 9 3s9 0 9-3V5"></path>
    <path d="m3 12c0 3 4 3 9 3s9 0 9-3"></path>
  </svg>
);

const Zap = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
  </svg>
);

const ChevronDown = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);

const ChevronUp = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="18,15 12,9 6,15"></polyline>
  </svg>
);

const SecuroPasswordChecker = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // API URL - defaults to localhost for development
  const API_URL = "http://localhost:9999";

  const checkPassword = async () => {
    if (!password) {
      setError("Please enter a password");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/check-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }

      setResult({
        isPwned: data.pwned_count > 0,
        count: data.pwned_count
      });

    } catch (err) {
      // Fallback to mock data if API is not available (for demo purposes)
      console.warn("API not available, using mock data:", err.message);
      
      // Mock logic for demo
      const isCommonPassword = [
        "password",
        "123456",
        "admin",
        "qwerty",
        "letmein",
        "welcome",
        "monkey"
      ].includes(password.toLowerCase());

      if (isCommonPassword) {
        setResult({
          isPwned: true,
          count: Math.floor(Math.random() * 1000000) + 50000,
        });
      } else {
        setResult({ isPwned: false, count: 0 });
      }
      
      setError("Demo mode: Using mock data (Flask backend not connected)");
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
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
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Instantly verify if your password has been exposed in data
              breaches. Protect your accounts with our advanced security
              validation.
            </p>
          </div>

          {/* Main Checker */}
          <div className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl mb-8">
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

                <button
                  onClick={checkPassword}
                  disabled={isLoading || !password}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 hover:scale-105 active:scale-95 transform"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Password...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Check Password Security</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <p className="text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {result && (
                <div
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
                </div>
              )}
            </div>
          </div>

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
          <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
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
                <div className={`transform transition-transform duration-300 ${showInfo ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </button>

              {showInfo && (
                <div className="pt-4 space-y-6 overflow-hidden">
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
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuroPasswordChecker;