import React, { useState } from "react";

// Custom SVG Icons matching your theme
const Shield = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Globe = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Server = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const Search = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

const Eye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const MapPin = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CyberThreatDashboard = () => {
  const [input, setInput] = useState("");
  const [type, setType] = useState("ip");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = "";
      if (type === "ip") {
        url = `http://localhost:6969/threats/ip/${encodeURIComponent(input)}`;
      } else if (type === "domain") {
        url = `http://localhost:6969/threats/domain/${encodeURIComponent(input)}`;
      } else {
        url = `http://localhost:6969/threats/map?limit=10`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getTypeIcon = () => {
    switch(type) {
      case 'ip': return <Server className="w-6 h-6" />;
      case 'domain': return <Globe className="w-6 h-6" />;
      case 'map': return <Eye className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  const renderIPResponse = (data) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="relative rounded-2xl bg-neutral-800/50 p-6 backdrop-blur-sm border border-neutral-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <Server className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">IP Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">IP Address:</span> <span className="text-white font-mono">{data.indicator}</span></p>
              <p><span className="text-gray-400">Type:</span> <span className="text-emerald-300">{data.type_title}</span></p>
              <p><span className="text-gray-400">ASN:</span> <span className="text-white">{data.asn || 'N/A'}</span></p>
              <p><span className="text-gray-400">Reputation:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  data.reputation === 0 ? 'bg-emerald-900/30 text-emerald-300' : 'bg-red-900/30 text-red-300'
                }`}>
                  {data.reputation === 0 ? 'Clean' : `Score: ${data.reputation}`}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Geographic Info */}
        <div className="relative rounded-2xl bg-neutral-800/50 p-6 backdrop-blur-sm border border-neutral-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Location</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Country:</span> <span className="text-white">{data.country_name || 'Unknown'}</span></p>
              <p><span className="text-gray-400">Country Code:</span> <span className="text-white">{data.country_code2 || 'N/A'}</span></p>
              <p><span className="text-gray-400">Region:</span> <span className="text-white">{data.region || 'N/A'}</span></p>
              <p><span className="text-gray-400">City:</span> <span className="text-white">{data.city || 'N/A'}</span></p>
              <p><span className="text-gray-400">Coordinates:</span> <span className="text-white font-mono">{data.latitude}, {data.longitude}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Results */}
      {data.validation && data.validation.length > 0 && (
        <div className="relative rounded-2xl bg-neutral-800/50 p-6 backdrop-blur-sm border border-neutral-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Security Validation</h3>
            </div>
            <div className="grid gap-3">
              {data.validation.map((validation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-neutral-900/30 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-300 font-medium text-sm">{validation.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{validation.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDomainResponse = (data) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="relative rounded-2xl bg-neutral-800/50 p-6 backdrop-blur-sm border border-neutral-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Domain Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Domain:</span> <span className="text-white font-mono">{data.indicator}</span></p>
              <p><span className="text-gray-400">Type:</span> <span className="text-emerald-300">{data.type_title}</span></p>
              {data.alexa && (
                <p><span className="text-gray-400">Alexa Info:</span> 
                  <a href={data.alexa} target="_blank" rel="noopener noreferrer" 
                     className="text-emerald-400 hover:text-emerald-300 ml-2 text-xs">View Report</a>
                </p>
              )}
              {data.whois && (
                <p><span className="text-gray-400">WHOIS:</span> 
                  <a href={data.whois} target="_blank" rel="noopener noreferrer" 
                     className="text-emerald-400 hover:text-emerald-300 ml-2 text-xs">View WHOIS</a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pulse Information */}
        <div className="relative rounded-2xl bg-neutral-800/50 p-6 backdrop-blur-sm border border-neutral-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Threat Intelligence</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Pulse Count:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  data.pulse_info?.count === 0 ? 'bg-emerald-900/30 text-emerald-300' : 'bg-red-900/30 text-red-300'
                }`}>
                  {data.pulse_info?.count || 0} threats found
                </span>
              </p>
              <p><span className="text-gray-400">References:</span> <span className="text-white">{data.pulse_info?.references?.length || 0}</span></p>
              <p><span className="text-gray-400">Adversaries:</span> <span className="text-white">{data.pulse_info?.related?.alienvault?.adversary?.length || 0}</span></p>
              <p><span className="text-gray-400">Malware Families:</span> <span className="text-white">{data.pulse_info?.related?.alienvault?.malware_families?.length || 0}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Results */}
      {data.validation && data.validation.length > 0 && (
        <div className="relative rounded-2xl bg-neutral-800/50 p-6 backdrop-blur-sm border border-neutral-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Security Validation</h3>
            </div>
            <div className="grid gap-3">
              {data.validation.map((validation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-neutral-900/30 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-300 font-medium text-sm">{validation.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{validation.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMapResponse = (data) => (
    <div className="space-y-6">
      {data.results && data.results.map((result, index) => (
        <div key={result.id || index} className="relative rounded-2xl bg-neutral-800/50 p-6 backdrop-blur-sm border border-neutral-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-emerald-300">{result.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Rev: {result.revision}</span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{result.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">Author:</span> <span className="text-white">{result.author_name}</span></p>
                <p><span className="text-gray-400">Created:</span> <span className="text-white">{formatDate(result.created)}</span></p>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">Modified:</span> <span className="text-white">{formatDate(result.modified)}</span></p>
                <p><span className="text-gray-400">Indicators:</span> 
                  <span className="ml-2 px-2 py-1 bg-emerald-900/30 text-emerald-300 rounded text-xs">
                    {result.indicators.length} IOCs
                  </span>
                </p>
              </div>
            </div>
            
            <div className="bg-neutral-900/30 rounded-xl p-4">
              <h4 className="text-emerald-400 font-semibold mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Indicators of Compromise</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-600">
                      <th className="text-left py-2 text-gray-400">Indicator</th>
                      <th className="text-left py-2 text-gray-400">Type</th>
                      <th className="text-left py-2 text-gray-400">Created</th>
                      <th className="text-left py-2 text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.indicators.map((indicator, idx) => (
                      <tr key={indicator.id || idx} className="border-b border-neutral-700/50">
                        <td className="py-2 font-mono text-white">{indicator.indicator}</td>
                        <td className="py-2 text-emerald-300">{indicator.type}</td>
                        <td className="py-2 text-gray-300">{formatDate(indicator.created)}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            indicator.is_active ? 'bg-red-900/30 text-red-300' : 'bg-gray-700/50 text-gray-400'
                          }`}>
                            {indicator.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Threat Intelligence Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced cyberthreat analysis and real-time security monitoring.
              Investigate IPs, domains, and view global threat patterns.
            </p>
          </div>

          {/* Search Section */}
          <div className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-3">
                {getTypeIcon()}
                <span>Threat Analysis</span>
              </h2>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-neutral-900/50 border border-neutral-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 appearance-none pr-10"
                  >
                    <option value="ip">Analyze IP Address</option>
                    <option value="domain">Analyze Domain</option>
                    <option value="map">Live Threat Map</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {type !== "map" && (
                  <input
                    type="text"
                    placeholder={`Enter ${type === 'ip' ? 'IP address (e.g., 8.8.8.8)' : 'domain (e.g., example.com)'}`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-neutral-900/50 border border-neutral-600 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  />
                )}

                <button
                  onClick={callApi}
                  disabled={loading || (type !== "map" && !input)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 hover:scale-105 active:scale-95 transform min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-6 bg-red-900/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-red-300 font-semibold">Analysis Failed</h3>
                  <p className="text-red-200 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {response && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-emerald-400 mb-2">Analysis Results</h2>
                <p className="text-gray-400">Comprehensive threat intelligence report</p>
              </div>

              {type === 'ip' && renderIPResponse(response)}
              {type === 'domain' && renderDomainResponse(response)}
              {type === 'map' && renderMapResponse(response)}
            </div>
          )}

          {/* Information Section */}
          <div className="mt-12 space-y-8">
            {/* Why This Matters */}
            <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
              <div className="relative z-10 p-8">
                <div className="text-center mb-8">
                  <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">Why Threat Intelligence Matters</h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Understanding the cyber threat landscape is crucial for modern cybersecurity defense strategies
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="relative rounded-xl bg-neutral-900/30 p-6 border border-neutral-600/50">
                    <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Proactive Defense</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Identify threats before they impact your organization. Early detection of malicious IPs and domains 
                      allows security teams to implement preventive measures and update firewall rules proactively.
                    </p>
                  </div>

                  <div className="relative rounded-xl bg-neutral-900/30 p-6 border border-neutral-600/50">
                    <Eye className="w-8 h-8 text-emerald-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Incident Response</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      When security incidents occur, threat intelligence provides context about attackers, their methods, 
                      and infrastructure. This accelerates investigation and helps determine the scope of compromise.
                    </p>
                  </div>

                  <div className="relative rounded-xl bg-neutral-900/30 p-6 border border-neutral-600/50">
                    <Globe className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Global Awareness</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Stay informed about emerging threats worldwide. Understanding global attack patterns helps 
                      organizations prepare for threats that may target their industry or geographic region.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Cases by Type */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* IP Analysis */}
              <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-2xl"></div>
                <div className="relative z-10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Server className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">IP Address Analysis</h3>
                  </div>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong className="text-white">Network Security:</strong> Block malicious IPs at firewalls and network perimeters</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong className="text-white">Log Analysis:</strong> Investigate suspicious connections in server logs</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong className="text-white">Threat Hunting:</strong> Identify compromised systems communicating with known bad IPs</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong className="text-white">Geolocation:</strong> Detect unusual traffic patterns from unexpected regions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Domain Analysis */}
              <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent rounded-2xl"></div>
                <div className="relative z-10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Domain Analysis</h3>
                  </div>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong className="text-white">Phishing Detection:</strong> Identify malicious domains used in email campaigns</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong className="text-white">DNS Filtering:</strong> Block access to known malicious domains</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong className="text-white">Brand Protection:</strong> Monitor for typosquatting and domain abuse</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong className="text-white">Reputation Checking:</strong> Verify legitimacy of third-party domains</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Indicators */}
            <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent rounded-2xl"></div>
              <div className="relative z-10 p-8">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-orange-400" />
                  <h2 className="text-2xl font-bold text-white">Key Threat Indicators to Monitor</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-orange-300 mb-4">High-Risk Indicators</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span className="text-red-200 text-sm"><strong>High reputation scores</strong> - indicates known malicious activity</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span className="text-red-200 text-sm"><strong>Multiple pulse references</strong> - actively tracked by security community</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span className="text-red-200 text-sm"><strong>Recent IOC activity</strong> - fresh indicators suggest active campaigns</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span className="text-red-200 text-sm"><strong>Malware associations</strong> - linked to known malware families</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-emerald-300 mb-4">Positive Indicators</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                        <span className="text-emerald-200 text-sm"><strong>Whitelisted status</strong> - verified as legitimate by security vendors</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                        <span className="text-emerald-200 text-sm"><strong>High Alexa ranking</strong> - popular, established websites</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                        <span className="text-emerald-200 text-sm"><strong>Zero reputation score</strong> - no known malicious activity</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                        <span className="text-emerald-200 text-sm"><strong>False positive flags</strong> - previously misidentified, now cleared</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
              <div className="relative z-10 p-8">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Shield className="w-8 h-8 text-emerald-400" />
                  <h2 className="text-2xl font-bold text-white">Threat Intelligence Best Practices</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-emerald-300 mb-3">Collection</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• <strong>Automate feeds</strong> - Set up automated threat intelligence feeds</p>
                      <p>• <strong>Multiple sources</strong> - Use diverse, reputable threat intelligence providers</p>
                      <p>• <strong>Real-time monitoring</strong> - Implement continuous monitoring systems</p>
                      <p>• <strong>Context enrichment</strong> - Add organizational context to threat data</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-emerald-300 mb-3">Analysis</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• <strong>Risk scoring</strong> - Develop internal risk scoring methodologies</p>
                      <p>• <strong>False positive reduction</strong> - Regularly tune detection rules</p>
                      <p>• <strong>Pattern recognition</strong> - Look for campaign indicators and TTPs</p>
                      <p>• <strong>Historical analysis</strong> - Track threat evolution over time</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-emerald-300 mb-3">Action</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• <strong>Automated blocking</strong> - Implement automated response workflows</p>
                      <p>• <strong>Team coordination</strong> - Share intelligence across security teams</p>
                      <p>• <strong>Incident correlation</strong> - Link threats to security incidents</p>
                      <p>• <strong>Continuous improvement</strong> - Refine processes based on outcomes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Integration Note */}
            <div className="relative rounded-2xl bg-gradient-to-r from-emerald-900/20 to-teal-900/20 backdrop-blur-sm border border-emerald-500/30 shadow-2xl">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-300">Powered by AlienVault OTX</h3>
                    <p className="text-emerald-200 text-sm">Open Threat Exchange - World's largest collaborative threat intelligence platform</p>
                  </div>
                </div>
                <p className="text-emerald-100 text-sm">
                  This dashboard integrates with AlienVault's Open Threat Exchange to provide real-time threat intelligence 
                  from a global community of security researchers, analysts, and organizations sharing threat indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberThreatDashboard;