import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navibar } from "./Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  Wifi,
  Shield,
  AlertTriangle,
  Search,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  CheckCircle,
  XCircle,
  WifiOff,
  Router,
  Smartphone,
  Home,
  Coffee,
  Building,
  Signal,
  Clock,
  Globe,
  Settings,
  Filter,
  Play,
  Pause,
  Info
} from 'lucide-react';

// API base URL
const API_BASE = 'http://localhost:8000';

// Types based on WiChain API responses
interface NetworkDevice {
  ssid: string;
  bssid: string;
  is_spoof: boolean;
  ml_confidence: number;
  ml_prediction: number;
  rule_based_reasons: string[];
  vendor?: string;
  features: {
    signal_strength: number;
    frequency: number;
    channel: number;
    encryption: string;
    latitude: number;
    longitude: number;
    vendor: string;
  };
  timestamp: string;
}

interface ScanConfig {
  interface: string;
  duration: number;
  channels: string[];
  enable_detection: boolean;
}

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];

// Mock data generator that matches WiChain API format
const generateMockNetworks = (): NetworkDevice[] => {
  const networks = [
    {
      ssid: "HomeNetwork_5G",
      bssid: "aa:bb:cc:dd:ee:01",
      is_spoof: false,
      ml_confidence: 0.95,
      ml_prediction: 0,
      rule_based_reasons: [],
      timestamp: new Date().toISOString(),
      features: {
        signal_strength: -45,
        frequency: 5.0,
        channel: 36,
        encryption: "WPA2",
        latitude: 19.08,
        longitude: 72.88,
        vendor: "NETGEAR"
      }
    },
    {
      ssid: "Starbucks_WiFi",
      bssid: "bb:cc:dd:ee:ff:02",
      is_spoof: true,
      ml_confidence: 0.88,
      ml_prediction: 1,
      rule_based_reasons: ["vendor mismatch", "suspicious signal pattern"],
      timestamp: new Date().toISOString(),
      features: {
        signal_strength: -65,
        frequency: 2.4,
        channel: 6,
        encryption: "OPEN",
        latitude: 19.08,
        longitude: 72.88,
        vendor: "Unknown"
      }
    },
    {
      ssid: "FreeWiFi_Connect",
      bssid: "cc:dd:ee:ff:00:03",
      is_spoof: true,
      ml_confidence: 0.92,
      ml_prediction: 1,
      rule_based_reasons: ["common rogue pattern", "open encryption"],
      timestamp: new Date().toISOString(),
      features: {
        signal_strength: -55,
        frequency: 2.4,
        channel: 11,
        encryption: "OPEN",
        latitude: 19.08,
        longitude: 72.88,
        vendor: "Generic"
      }
    },
    {
      ssid: "OfficeNetwork_Secure",
      bssid: "dd:ee:ff:00:11:04",
      is_spoof: false,
      ml_confidence: 0.98,
      ml_prediction: 0,
      rule_based_reasons: [],
      timestamp: new Date().toISOString(),
      features: {
        signal_strength: -50,
        frequency: 5.0,
        channel: 1,
        encryption: "WPA3",
        latitude: 19.08,
        longitude: 72.88,
        vendor: "Cisco"
      }
    },
    {
      ssid: "AndroidAP_1234",
      bssid: "ee:ff:00:11:22:05",
      is_spoof: false,
      ml_confidence: 0.85,
      ml_prediction: 0,
      rule_based_reasons: [],
      timestamp: new Date().toISOString(),
      features: {
        signal_strength: -70,
        frequency: 2.4,
        channel: 6,
        encryption: "WPA2",
        latitude: 19.08,
        longitude: 72.88,
        vendor: "Samsung"
      }
    }
  ];
  return networks;
};

const WiFiScanner: React.FC = () => {
  const [networks, setNetworks] = useState<NetworkDevice[]>([]);
  const [scanConfig, setScanConfig] = useState<ScanConfig>({
    interface: 'wlan0',
    duration: 60,
    channels: ['1', '6', '11'],
    enable_detection: true,
  });
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [manualNetwork, setManualNetwork] = useState({
    ssid: "Free Public WiFi",
    bssid: "12:34:56:78:90:AB",
    signal_strength: -75,
    frequency: 2.4,
    channel: 6,
    encryption: "OPEN",
    latitude: 19.08,
    longitude: 72.88,
    vendor: "TP-Link"
  });

  const getSignalStrength = (strength: number) => {
    if (strength >= -50) return { level: 'Excellent', percentage: 100, color: 'text-emerald-400', bars: 4 };
    if (strength >= -60) return { level: 'Good', percentage: 80, color: 'text-emerald-400', bars: 3 };
    if (strength >= -70) return { level: 'Fair', percentage: 60, color: 'text-yellow-400', bars: 2 };
    if (strength >= -80) return { level: 'Weak', percentage: 40, color: 'text-orange-400', bars: 1 };
    return { level: 'Very Weak', percentage: 20, color: 'text-red-400', bars: 1 };
  };

  const getSecurityLevel = (encryption: string) => {
    return encryption === 'OPEN' || encryption === 'WEP' 
      ? { status: 'No Password', icon: Unlock, color: 'text-red-400', variant: 'destructive' as const, description: 'Anyone can connect without a password' }
      : { status: 'Password Protected', icon: Lock, color: 'text-emerald-400', variant: 'default' as const, description: 'Requires password to connect' };
  };

  const getThreatLevel = (isSpoof: boolean, confidence: number) => {
    if (isSpoof) {
      return { 
        status: 'Dangerous', 
        icon: AlertTriangle, 
        color: 'text-red-400', 
        variant: 'destructive' as const,
        description: 'This network might be trying to steal your information'
      };
    }
    return { 
      status: 'Safe', 
      icon: CheckCircle, 
      color: 'text-emerald-400', 
      variant: 'default' as const,
      description: 'This network appears to be safe and legitimate'
    };
  };

  const getNetworkTypeIcon = (ssid: string) => {
    const name = ssid.toLowerCase();
    if (name.includes('home') || name.includes('house')) return Home;
    if (name.includes('coffee') || name.includes('cafe') || name.includes('starbucks')) return Coffee;
    if (name.includes('office') || name.includes('work') || name.includes('corp')) return Building;
    if (name.includes('phone') || name.includes('mobile') || name.includes('hotspot') || name.includes('android')) return Smartphone;
    return Router;
  };

  const fetchNetworks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/scan_real/`);
      if (!response.ok) {
        if (response.status === 404) {
          setNetworks(generateMockNetworks());
          return;
        }
        throw new Error('Failed to fetch networks');
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setNetworks(generateMockNetworks());
        return;
      }
      const data = await response.json();
      setNetworks(data);
    } catch (err) {
      setNetworks(generateMockNetworks());
      setError('Using demo data - scanner not connected');
    } finally {
      setLoading(false);
    }
  }, []);

  const startScan = async () => {
    try {
      setIsScanning(true);
      const response = await fetch(`${API_BASE}/api/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          setNetworks(generateMockNetworks());
          return;
        }
        throw new Error('Failed to start scan');
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setNetworks(generateMockNetworks());
        return;
      }
      const data = await response.json();
      setNetworks(data);
    } catch (err) {
      setNetworks(generateMockNetworks());
      setError('Using demo data - scanner not connected');
    } finally {
      setIsScanning(false);
    }
  };

  const runDetection = async () => {
    try {
      for (const network of networks) {
        const response = await fetch(`${API_BASE}/api/detect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ssid: network.ssid,
            bssid: network.bssid,
            signal_strength: network.features.signal_strength,
            frequency: network.features.frequency,
            channel: network.features.channel,
            encryption: network.features.encryption,
            latitude: network.features.latitude,
            longitude: network.features.longitude,
            vendor: network.features.vendor
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          setNetworks(prev => prev.map(n => 
            n.bssid === network.bssid ? result : n
          ));
        }
      }
    } catch (err) {
      const updatedNetworks = networks.map(network => ({
        ...network,
        is_spoof: Math.random() > 0.8
      }));
      setNetworks(updatedNetworks);
      setError('Using demo data - scanner not connected');
    }
  };

  const detectManualNetwork = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualNetwork),
      });
      
      if (response.ok) {
        const result = await response.json();
        // Add the result to the networks list
        setNetworks(prev => [result, ...prev]);
      }
    } catch (err) {
      setError('Failed to detect manual network');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, [fetchNetworks]);

  const filteredNetworks = networks.filter((network) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'safe') return !network.is_spoof;
    if (selectedFilter === 'suspicious') return network.is_spoof;
    if (selectedFilter === 'open') return network.features.encryption === 'OPEN';
    if (selectedFilter === 'secure') return network.features.encryption !== 'OPEN';
    return true;
  });

  const safeNetworks = networks.filter(n => !n.is_spoof).length;
  const suspiciousNetworks = networks.filter(n => n.is_spoof).length;
  const openNetworks = networks.filter(n => n.features.encryption === 'OPEN').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="container mx-auto p-4 md:p-8">
         <Navibar />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <Wifi className="h-8 w-8 text-emerald-400" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-neutral-100">
              WiFi Security Scanner
            </h1>
          </div>

          <p className="text-neutral-400 text-lg mb-8">
            Discover nearby WiFi networks and analyze their security to protect yourself from malicious hotspots and data theft.
          </p>

          {error && (
            <Alert className="bg-neutral-900/80 border-yellow-400 mb-6 rounded-xl">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-400">{error}</AlertDescription>
            </Alert>
          )}
        </motion.div>

        {/* Scanner Controls */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 mb-8">
          {/* Scan Control */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl bg-neutral-900/80 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-neutral-100 mb-6 flex items-center space-x-2">
                <Search className="h-5 w-5 text-emerald-400" />
                <span>Network Discovery</span>
              </h2>

              <div className="space-y-6">
                <p className="text-neutral-400">
                  Start scanning to find WiFi networks around you. We'll check each one for security threats and help you stay safe.
                </p>

                <motion.button
                  onClick={startScan}
                  disabled={isScanning}
                  whileHover={{ scale: isScanning ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center space-x-2">
                    {isScanning ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="rounded-full h-5 w-5 border-2 border-neutral-900 border-t-transparent"
                        />
                        <span>Scanning for Networks...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        <span>Start WiFi Scan</span>
                      </>
                    )}
                  </span>
                </motion.button>

                <motion.button
                  onClick={runDetection}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full py-4 px-6 bg-gradient-to-r from-neutral-700 to-neutral-600 text-emerald-400 font-semibold rounded-xl border border-emerald-400/30 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-emerald-500 hover:text-neutral-900 transition-all duration-300 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Run Security Check</span>
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Filter Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-2xl bg-neutral-900/80 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-neutral-100 mb-6 flex items-center space-x-2">
                <Filter className="h-5 w-5 text-emerald-400" />
                <span>Filter Networks</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <Label className="text-neutral-300 mb-2 block">Show me:</Label>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-full bg-neutral-900/50 border-emerald-400/30 text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-emerald-400/30 rounded-xl">
                      <SelectItem value="all">All Networks ({networks.length})</SelectItem>
                      <SelectItem value="safe">Safe Networks ({safeNetworks})</SelectItem>
                      <SelectItem value="suspicious">Dangerous Networks ({suspiciousNetworks})</SelectItem>
                      <SelectItem value="open">No Password ({openNetworks})</SelectItem>
                      <SelectItem value="secure">Password Protected ({networks.length - openNetworks})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={fetchNetworks} 
                  disabled={loading} 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Networks
                </Button>

                {networks.length > 0 && (
                  <div className="p-4 bg-neutral-900/30 rounded-xl border border-neutral-600">
                    <p className="text-sm text-neutral-400 mb-2">Scan Status:</p>
                    <div className="text-xs text-neutral-500 space-y-1">
                      <div>Found {networks.length} networks nearby</div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last scan: {networks.length > 0 ? new Date(networks[0].timestamp).toLocaleTimeString() : 'Never'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Manual Network Detection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative rounded-2xl bg-neutral-900/80 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-neutral-100 mb-6 flex items-center space-x-2">
              <Wifi className="h-5 w-5 text-emerald-400" />
              <span>Manual Network Detection</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-neutral-300 mb-2 block">SSID</Label>
                    <Input 
                      value={manualNetwork.ssid}
                      onChange={(e) => setManualNetwork({...manualNetwork, ssid: e.target.value})}
                      className="bg-neutral-900/50 border-emerald-400/30 text-white rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-300 mb-2 block">BSSID</Label>
                    <Input 
                      value={manualNetwork.bssid}
                      onChange={(e) => setManualNetwork({...manualNetwork, bssid: e.target.value})}
                      className="bg-neutral-900/50 border-emerald-400/30 text-white rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-neutral-300 mb-2 block">Signal Strength</Label>
                    <Input 
                      type="number"
                      value={manualNetwork.signal_strength}
                      onChange={(e) => setManualNetwork({...manualNetwork, signal_strength: parseInt(e.target.value)})}
                      className="bg-neutral-900/50 border-emerald-400/30 text-white rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-300 mb-2 block">Vendor</Label>
                    <Input 
                      value={manualNetwork.vendor}
                      onChange={(e) => setManualNetwork({...manualNetwork, vendor: e.target.value})}
                      className="bg-neutral-900/50 border-emerald-400/30 text-white rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-neutral-300 mb-2 block">Encryption</Label>
                    <Select 
                      value={manualNetwork.encryption}
                      onValueChange={(value) => setManualNetwork({...manualNetwork, encryption: value})}
                    >
                      <SelectTrigger className="w-full bg-neutral-900/50 border-emerald-400/30 text-white rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-emerald-400/30 rounded-xl">
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="WEP">WEP</SelectItem>
                        <SelectItem value="WPA">WPA</SelectItem>
                        <SelectItem value="WPA2">WPA2</SelectItem>
                        <SelectItem value="WPA3">WPA3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-neutral-300 mb-2 block">Channel</Label>
                    <Input 
                      type="number"
                      value={manualNetwork.channel}
                      onChange={(e) => setManualNetwork({...manualNetwork, channel: parseInt(e.target.value)})}
                      className="bg-neutral-900/50 border-emerald-400/30 text-white rounded-xl"
                    />
                  </div>
                </div>

                <Button 
                  onClick={detectManualNetwork}
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Check Network Safety
                </Button>
              </div>

              <div className="p-6 bg-neutral-900/30 rounded-xl border border-neutral-600">
                <h3 className="text-lg font-semibold text-neutral-100 mb-4">About Manual Detection</h3>
                <p className="text-neutral-400 text-sm">
                  Manually check a specific network for spoofing by providing its details. This is useful for networks that might not appear in automatic scans or for testing specific access points.
                </p>
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Tip: Use this to verify suspicious networks before connecting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative rounded-2xl bg-neutral-900/80 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-100 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>Security Overview</span>
              </h2>
              <div className="text-sm text-neutral-400">
                Found {networks.length} networks
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="group p-6 bg-neutral-900/50 rounded-xl border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-emerald-400 font-semibold text-lg">{safeNetworks}</p>
                    <p className="text-xs text-neutral-400">Safe Networks</p>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm">
                  These networks appear legitimate and safe to connect to.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="group p-6 bg-neutral-900/50 rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-red-400/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-400 font-semibold text-lg">{suspiciousNetworks}</p>
                    <p className="text-xs text-neutral-400">Dangerous Networks</p>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm">
                  Avoid these networks - they may be trying to steal your data.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="group p-6 bg-neutral-900/50 rounded-xl border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Unlock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-yellow-400 font-semibold text-lg">{openNetworks}</p>
                    <p className="text-xs text-neutral-400">Open Networks</p>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm">
                  Networks without passwords - use with extra caution.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Networks List */}
        {networks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="relative rounded-2xl bg-neutral-900/80 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-100 flex items-center space-x-2">
                  <Wifi className="h-5 w-5 text-emerald-400" />
                  <span>Discovered Networks</span>
                </h2>
                <div className="text-sm text-neutral-400">
                  Showing {filteredNetworks.length} of {networks.length} networks
                </div>
              </div>

              {filteredNetworks.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-16 h-16 rounded-xl bg-neutral-700/50 flex items-center justify-center mb-4 mx-auto"
                  >
                    <WifiOff className="w-8 h-8 text-neutral-500" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-neutral-400 mb-2">No Networks Found</h3>
                  <p className="text-neutral-500">Try changing the filter or running a new scan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNetworks.map((network, index) => {
                    const threat = getThreatLevel(network.is_spoof, network.ml_confidence);
                    const security = getSecurityLevel(network.features.encryption);
                    const signal = getSignalStrength(network.features.signal_strength);
                    const NetworkIcon = getNetworkTypeIcon(network.ssid);
                    
                    return (
                      <motion.div
                        key={network.bssid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-6 bg-neutral-900/50 rounded-xl border border-neutral-700/50 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-neutral-700/50 rounded-xl flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
                              <NetworkIcon className="w-6 h-6 text-neutral-300 group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-100">
                                {network.ssid || 'Hidden Network'}
                              </h3>
                              <p className="text-neutral-400 text-sm">
                                {/* Prefer top-level vendor, fallback to features.vendor */}
                                {network.vendor || network.features.vendor || "Unknown"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={threat.variant} 
                              className={`gap-2 px-3 py-1 rounded-xl ${
                                network.is_spoof 
                                  ? 'bg-red-500/20 text-red-400 border-red-400/30' 
                                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30'
                              }`}
                            >
                              <threat.icon className="w-4 h-4" />
                              {threat.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="p-4 bg-neutral-900/30 rounded-xl border border-neutral-600">
                            <p className="text-sm text-neutral-400 mb-2">Signal Strength</p>
                            <div className="flex items-center gap-3">
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4].map((bar) => (
                                  <div
                                    key={bar}
                                    className={`w-1.5 rounded-full transition-all duration-300 ${
                                      bar <= signal.bars
                                        ? 'bg-emerald-400'
                                        : 'bg-neutral-600'
                                    }`}
                                    style={{ height: `${bar * 4 + 8}px` }}
                                  />
                                ))}
                              </div>
                              <span className={`text-sm font-medium ${signal.color}`}>
                                {signal.level}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-neutral-900/30 rounded-xl border border-neutral-600">
                            <p className="text-sm text-neutral-400 mb-2">Security</p>
                            <div className="flex items-center gap-2">
                              <security.icon className={`w-4 h-4 ${security.color}`} />
                              <span className={`text-sm font-medium ${security.color}`}>
                                {security.status}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-neutral-900/30 rounded-xl border border-neutral-600">
                            <p className="text-sm text-neutral-400 mb-2">Safety Score</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-neutral-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    network.is_spoof ? 'bg-red-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${(network.ml_confidence || 0) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-neutral-300">
                                {Math.round((network.ml_confidence || 0) * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs text-neutral-500">
                          <div className="flex items-center gap-1">
                            <Signal className="w-3 h-3" />
                            <span>Channel {network.features.channel || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(network.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        {network.is_spoof && network.rule_based_reasons.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                          >
                            <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Warning: Dangerous Network Detected
                            </p>
                            <p className="text-neutral-400 text-xs mt-2">
                              Reasons: {network.rule_based_reasons.join(', ')}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Educational Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="relative rounded-2xl bg-neutral-900/80 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-neutral-100 mb-4">
                How Our WiFi Scanner Protects You
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                Learn how malicious WiFi networks work and discover the best practices for staying safe when connecting to public internet.
              </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex items-start space-x-6 p-6 bg-neutral-900/30 rounded-xl border border-neutral-600 group hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-xl"></div>
                      <div className="relative z-10">
                        <Search className="h-8 w-8 text-emerald-400" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-neutral-900 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-100 mb-3">
                    Network Discovery
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Our scanner actively searches for all WiFi networks broadcasting in your area. We analyze signal strength, encryption types, and network characteristics to build a comprehensive picture of your local wireless environment.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="flex items-start space-x-6 p-6 bg-neutral-900/30 rounded-xl border border-neutral-600 group hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-xl"></div>
                      <div className="relative z-10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Shield className="h-8 w-8 text-emerald-400" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-neutral-900 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-100 mb-3">
                    AI-Powered Threat Detection
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Advanced machine learning algorithms analyze network patterns to identify potential rogue access points and evil twin attacks. Our system checks vendor authenticity, signal anomalies, and suspicious naming patterns to protect you from fake networks.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="flex items-start space-x-6 p-6 bg-neutral-900/30 rounded-xl border border-neutral-600 group hover:border-red-500/30 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl border border-red-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-transparent rounded-xl"></div>
                      <div className="relative z-10">
                        <AlertTriangle className="h-8 w-8 text-red-400" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      !
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-100 mb-3">
                    Common WiFi Threats
                  </h3>
                  <div className="space-y-2 text-neutral-400">
                    <p>• Evil Twin Networks: Fake hotspots that mimic legitimate ones</p>
                    <p>• Man-in-the-Middle Attacks: Intercepting your data traffic</p>
                    <p>• Credential Harvesting: Stealing login credentials and passwords</p>
                    <p>• Malware Distribution: Injecting malicious software into your device</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="flex items-start space-x-6 p-6 bg-neutral-900/30 rounded-xl border border-neutral-600 group hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-xl"></div>
                      <div className="relative z-10">
                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-neutral-900 rounded-full flex items-center justify-center font-bold text-sm">
                      ✓
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-100 mb-3">
                    Best Practices for Safe WiFi
                  </h3>
                  <div className="space-y-2 text-neutral-400">
                    <p>• Always verify network names with establishment staff</p>
                    <p>• Prefer password-protected networks over open ones</p>
                    <p>• Use your mobile hotspot when public WiFi seems risky</p>
                    <p>• Enable VPN protection for additional security layers</p>
                    <p>• Avoid accessing sensitive accounts on public networks</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              className="mt-12 p-6 bg-neutral-900/50 rounded-xl border border-neutral-600 text-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Shield className="h-8 w-8 text-emerald-400" />
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0"
                  >
                    <Shield className="h-8 w-8 text-emerald-400/50" />
                  </motion.div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-neutral-100 mb-4">
                    Advanced Protection Features
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-neutral-300 max-w-2xl mx-auto">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span>Real-time network monitoring</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span>ML-powered threat detection</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span>Vendor authenticity verification</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span>Signal strength analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WiFiScanner;