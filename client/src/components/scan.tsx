import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Wifi,
  Shield,
  Activity,
  AlertTriangle,
  Search,
  Play,
  Pause,
  RefreshCw,
  Settings,
  TrendingUp,
  Network,
  Lock,
  Unlock,
  MapPin,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  Database,
  BarChart3,
  Globe,
  Smartphone,
  Laptop,
  Router,
} from 'lucide-react';

// API base URL
const API_BASE = 'http://localhost:8000';

// Types based on your API responses
interface NetworkDevice {
  ssid: string;
  bssid: string;
  is_spoof: boolean;
  vendor: string;
  ml_confidence: number;
  ml_prediction: number;
  timestamp: string;
  features: {
    signal_strength: number;
    channel: number;
    frequency: number;
    ssid_length: number;
    has_common_rogue_pattern: number;
    is_hidden: number;
    vendor_risk: number;
    is_locally_administered: number;
    encryption_risk: number;
    signal_category: number;
    channel_width: number;
    is_DFS_channel: number;
  };
  reasons: string[];
}

interface BlockchainData {
  block_height?: number;
  hash?: string;
  timestamp: string;
  transactions?: number;
  size?: number;
  difficulty?: string;
  // Your API returns network data in blockchain
  ssid?: string;
  bssid?: string;
  is_spoof?: boolean;
  vendor?: string;
  ml_confidence?: number;
}

interface SystemStats {
  total_networks: number;
  spoof_networks: number;
  legitimate_networks: number;
  spoof_percentage: number;
}

interface ScanConfig {
  interface: string;
  duration: number;
  channels: string[];
  enable_detection: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Sidebar Component
const Sidebar: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'detection', label: 'Network Detection', icon: Shield },
    { id: 'blockchain', label: 'Blockchain Explorer', icon: Database },
    { id: 'statistics', label: 'System Statistics', icon: BarChart3 },
    { id: 'monitoring', label: 'Real-time Monitoring', icon: Activity },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-card border-r border-border h-screen p-4 fixed left-0 top-0"
    >
      <div className="flex items-center gap-2 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold">Wifi Detection</h1>
      </div>
      <nav className="space-y-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab(id)}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </nav>
    </motion.div>
  );
};

// Network Detection Page
const NetworkDetection: React.FC = () => {
  const [networks, setNetworks] = useState<NetworkDevice[]>([]);
  const [scanConfig, setScanConfig] = useState<ScanConfig>({
    interface: 'wlan0',
    duration: 60,
    channels: ['1', '6', '11'],
    enable_detection: true,
  });
  const [isScanning, setIsScanning] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Move these two functions to the top of the component, before any usage!
  const getDeviceIcon = (encryptionRisk: number) => {
    return encryptionRisk === 1 ? Unlock : Lock;
  };

  const getSignalStrength = (strength: number) => {
    // Convert negative dBm to percentage (approx)
    if (strength >= -50) return 100;
    if (strength <= -100) return 0;
    return Math.round(2 * (strength + 100));
  };

  const fetchNetworks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/networks?limit=20`);
      if (!response.ok) {
        // If API doesn't exist, use mock data
        if (response.status === 404) {
          setNetworks(generateMockNetworks());
          return;
        }
        throw new Error('Failed to fetch networks');
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If response is not JSON, use mock data
        setNetworks(generateMockNetworks());
        return;
      }
      const data = await response.json();
      setNetworks(data);
    } catch (err) {
      // Use mock data on any error
      setNetworks(generateMockNetworks());
      setError('Using mock data - API not available');
    } finally {
      setLoading(false);
    }
  }, []);

  const startScan = async () => {
    try {
      setIsScanning(true);
      // Your API doesn't expect a body for /api/scan
      const response = await fetch(`${API_BASE}/api/scan`, {
        method: 'POST',
      });
      if (!response.ok) {
        if (response.status === 404) {
          // Simulate scan with mock data
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
      await fetchNetworks();
    } catch (err) {
      // Use mock data on error
      setNetworks(generateMockNetworks());
      setError('Using mock data - API not available');
    } finally {
      setIsScanning(false);
    }
  };

  const runDetection = async () => {
    try {
      // For each network, run detection
      const detectionResults = [];
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
            encryption: network.features.encryption_risk === 1 ? 'Open' : 'Secure',
            latitude: 0, // You might want to get actual location
            longitude: 0,
            vendor: network.vendor
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          detectionResults.push(result);
        }
      }
      
      if (detectionResults.length > 0) {
        setNetworks(detectionResults);
      }
    } catch (err) {
      // Simulate detection on error
      const updatedNetworks = networks.map(network => ({
        ...network,
        is_spoof: Math.random() > 0.8
      }));
      setNetworks(updatedNetworks);
      setError('Using mock data - API not available');
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, [fetchNetworks]);

  // This is correct:
  const filteredNetworks = networks.filter(
    (network) => selectedVendor === 'all' || network.vendor === selectedVendor
  );

  // Update the secure networks count calculation:
  <div className="flex justify-between">
    <span>Secure Networks</span>
    <Badge variant="default">
      {networks.filter((n) => n.features?.encryption_risk === 0).length}
    </Badge>
  </div>

  // In the table rendering, add safety checks for the features property:
  {filteredNetworks.map((network) => {
    const EncryptionIcon = getDeviceIcon(network.features?.encryption_risk || 0);
    const signalStrength = getSignalStrength(network.features?.signal_strength || -100);
    
    return (
      <TableRow key={network.bssid}>
        <TableCell className="flex items-center gap-2">
          <Wifi className="w-4 h-4" />
          {network.ssid || 'Hidden'}
        </TableCell>
        <TableCell className="font-mono text-sm">
          {network.bssid}
        </TableCell>
        <TableCell>{network.vendor}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Progress
              value={signalStrength}
              className="w-16"
            />
            <span className="text-sm">
              {signalStrength}%
            </span>
          </div>
        </TableCell>
        <TableCell>{network.features?.channel || 'N/A'}</TableCell>
        <TableCell>
          <Badge
            variant={
              network.features?.encryption_risk === 1
                ? 'destructive'
                : 'default'
            }
          >
            <EncryptionIcon className="w-3 h-3 mr-1" />
            {network.features?.encryption_risk === 1 ? 'Insecure' : 'Secure'}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge
            variant={network.is_spoof ? 'destructive' : 'default'}
          >
            {network.is_spoof ? (
              <AlertTriangle className="w-3 h-3 mr-1" />
            ) : (
              <Shield className="w-3 h-3 mr-1" />
            )}
            {network.is_spoof ? 'Spoofed' : 'Secure'}
          </Badge>
        </TableCell>
        <TableCell>
          <Progress value={(network.ml_confidence || 0) * 100} />
          <span className="text-xs">{Math.round((network.ml_confidence || 0) * 100)}%</span>
        </TableCell>
        <TableCell className="text-sm">
          {new Date(network.timestamp).toLocaleTimeString()}
        </TableCell>
      </TableRow>
    );
  })}
  const vendors = Array.from(new Set(networks.map((n) => n.vendor)));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-3xl font-bold">Network Detection</h2>
          <p className="text-muted-foreground">
            Scan and analyze network devices for security threats
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchNetworks} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={runDetection}>
            <Eye className="w-4 h-4 mr-2" />
            Detect Threats
          </Button>
        </div>
      </motion.div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Scan Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="interface">Network Interface</Label>
              <Select
                value={scanConfig.interface}
                onValueChange={(value) =>
                  setScanConfig({ ...scanConfig, interface: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wlan0">wlan0</SelectItem>
                  <SelectItem value="wlan1">wlan1</SelectItem>
                  <SelectItem value="eth0">eth0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                type="number"
                value={scanConfig.duration}
                onChange={(e) =>
                  setScanConfig({ ...scanConfig, duration: +e.target.value })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={scanConfig.enable_detection}
                onCheckedChange={(checked) =>
                  setScanConfig({ ...scanConfig, enable_detection: checked })
                }
              />
              <Label>Enable Threat Detection</Label>
            </div>
            <Button
              onClick={startScan}
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Networks</span>
                <Badge variant="secondary">{networks.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Spoofed Networks</span>
                <Badge variant="destructive">
                  {networks.filter((n) => n.is_spoof).length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Secure Networks</span>
                <Badge variant="default">
                  {networks.filter((n) => n.features?.encryption_risk === 0).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={vendors.map((vendor) => ({
                    name: vendor,
                    value: networks.filter((n) => n.vendor === vendor).length,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {vendors.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Detected Networks</span>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>
                      {vendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SSID</TableHead>
                <TableHead>BSSID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Security</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNetworks.map((network) => {
                const EncryptionIcon = getDeviceIcon(network.features?.encryption_risk || 0);
                const signalStrength = getSignalStrength(network.features?.signal_strength || -100);
                
                return (
                  <TableRow key={network.bssid}>
                    <TableCell className="flex items-center gap-2">
                      <Wifi className="w-4 h-4" />
                      {network.ssid || 'Hidden'}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {network.bssid}
                    </TableCell>
                    <TableCell>{network.vendor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={signalStrength}
                          className="w-16"
                        />
                        <span className="text-sm">
                          {signalStrength}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{network.features?.channel || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          network.features?.encryption_risk === 1
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        <EncryptionIcon className="w-3 h-3 mr-1" />
                        {network.features?.encryption_risk === 1 ? 'Insecure' : 'Secure'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={network.is_spoof ? 'destructive' : 'default'}
                      >
                        {network.is_spoof ? (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        ) : (
                          <Shield className="w-3 h-3 mr-1" />
                        )}
                        {network.is_spoof ? 'Spoofed' : 'Secure'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={(network.ml_confidence || 0) * 100} />
                      <span className="text-xs">{Math.round((network.ml_confidence || 0) * 100)}%</span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(network.timestamp).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Blockchain Explorer Page
const BlockchainExplorer: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockchainData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchBlockchainData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/blockchain`);
      if (!response.ok) {
        if (response.status === 404) {
          setBlocks(generateMockBlocks());
          return;
        }
        throw new Error('Failed to fetch blockchain data');
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setBlocks(generateMockBlocks());
        return;
      }
      const data = await response.json();
      setBlocks(data);
    } catch (err) {
      setBlocks(generateMockBlocks());
      setError('Using mock data - API not available');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 30000);
    return () => clearInterval(interval);
  }, [fetchBlockchainData]);

  // Prepare chart data from blockchain
  const chartData = blocks.map((block, index) => ({
    index,
    timestamp: new Date(block.timestamp).toLocaleTimeString(),
    is_spoof: block.is_spoof ? 1 : 0,
  }));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-3xl font-bold">Blockchain Explorer</h2>
          <p className="text-muted-foreground">
            Monitor blockchain activity and network validations
          </p>
        </div>
        <Button onClick={fetchBlockchainData} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </motion.div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Blocks</span>
                <Badge variant="secondary">{blocks.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Spoofed Validations</span>
                <Badge variant="destructive">
                  {blocks.filter(block => block.is_spoof).length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Secure Validations</span>
                <Badge variant="default">
                  {blocks.filter(block => !block.is_spoof).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validation Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="is_spoof"
                  stroke="#ff6b6b"
                  fill="#ff6b6b"
                  fillOpacity={0.6}
                  name="Spoof Detections"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Validation</CardTitle>
          </CardHeader>
          <CardContent>
            {blocks.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>SSID:</span>
                  <span className="font-medium">{blocks[0]?.ssid || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={blocks[0]?.is_spoof ? 'destructive' : 'default'}>
                    {blocks[0]?.is_spoof ? 'Spoofed' : 'Secure'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Time: {new Date(blocks[0]?.timestamp || '').toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Validations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>SSID</TableHead>
                <TableHead>BSSID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.slice(0, 10).map((block, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(block.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{block.ssid || 'Hidden'}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {block.bssid?.slice(0, 16)}...
                  </TableCell>
                  <TableCell>{block.vendor || 'Unknown'}</TableCell>
                  <TableCell>
                    <Badge variant={block.is_spoof ? 'destructive' : 'default'}>
                      {block.is_spoof ? 'Spoofed' : 'Secure'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {block.ml_confidence ? `${Math.round(block.ml_confidence * 100)}%` : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// System Statistics Page
const SystemStatistics: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/stats`);
      if (!response.ok) {
        if (response.status === 404) {
          const mockStats = generateMockStats();
          setStats(mockStats);
          return;
        }
        throw new Error('Failed to fetch statistics');
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const mockStats = generateMockStats();
        setStats(mockStats);
        return;
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      const mockStats = generateMockStats();
      setStats(mockStats);
      setError('Using mock data - API not available');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-3xl font-bold">System Statistics</h2>
          <p className="text-muted-foreground">
            Monitor system performance and detection metrics
          </p>
        </div>
        <Button onClick={fetchStats} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </motion.div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Networks
                </CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_networks}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Spoofed Networks
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.spoof_networks}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Legitimate Networks
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.legitimate_networks}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Spoof Percentage
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.spoof_percentage}%</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detection Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Spoofed', value: stats.spoof_networks, color: '#ff6b6b' },
                    { name: 'Legitimate', value: stats.legitimate_networks, color: '#51cf66' },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            </Card>
        </>
      )}
    </div>
  );
};

// Real-time Monitoring Page
const RealTimeMonitoring: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [realtimeData, setRealtimeData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchRealTimeData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/scan_real`);
      if (!response.ok) {
        // Simulate data if API not available
        const newData = {
          timestamp: new Date().toLocaleTimeString(),
          threats: Math.floor(Math.random() * 10),
          networks: Math.floor(Math.random() * 100) + 50,
        };
        setRealtimeData(prev => [...prev.slice(-19), newData]);
        return;
      }
      const data = await response.json();
      
      // Add to realtime data for charts
      setRealtimeData(prev => [
        ...prev.slice(-19),
        {
          timestamp: new Date().toLocaleTimeString(),
          threats: data.filter((n: NetworkDevice) => n.is_spoof).length,
          networks: data.length,
        }
      ]);

      // Check for new alerts
      const newSpoofs = data.filter((n: NetworkDevice) => n.is_spoof);
      if (newSpoofs.length > 0) {
        setAlerts(prev => [
          ...newSpoofs.map((network: NetworkDevice) => ({
            id: `${network.bssid}-${Date.now()}`,
            type: 'warning',
            message: `Spoofed network detected: ${network.ssid || 'Hidden'} (${network.bssid})`,
            timestamp: new Date(),
          })),
          ...prev.slice(0, 10 - newSpoofs.length)
        ]);
      }
    } catch (err) {
      // Simulate data on error
      const newData = {
        timestamp: new Date().toLocaleTimeString(),
        threats: Math.floor(Math.random() * 10),
        networks: Math.floor(Math.random() * 100) + 50,
      };
      setRealtimeData(prev => [...prev.slice(-19), newData]);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && isMonitoring) {
      interval = setInterval(fetchRealTimeData, refreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, isMonitoring, refreshInterval, fetchRealTimeData]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-3xl font-bold">Real-time Monitoring</h2>
          <p className="text-muted-foreground">
            Live monitoring of network security events
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Auto-refresh:</Label>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
          </div>
          <Select
            value={refreshInterval.toString()}
            onValueChange={(value) => setRefreshInterval(+value)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1s</SelectItem>
              <SelectItem value="5">5s</SelectItem>
              <SelectItem value="10">10s</SelectItem>
              <SelectItem value="30">30s</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? 'destructive' : 'default'}
          >
            {isMonitoring ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isMonitoring ? 'Stop' : 'Start'} Monitoring
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="#ff6b6b"
                  name="Threats"
                />
                <Line
                  type="monotone"
                  dataKey="networks"
                  stroke="#45b7d1"
                  name="Networks"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              { alerts.length === 0 ? (
                <p className="text-muted-foreground">No alerts</p>
              ) : (
                alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded"
                  >
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {isMonitoring ? 'ACTIVE' : 'STOPPED'}
              </div>
              <p className="text-sm text-muted-foreground">Monitoring Status</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {realtimeData.length > 0 ? realtimeData[realtimeData.length - 1]?.networks || 0 : 0}
              </div>
              <p className="text-sm text-muted-foreground">Active Networks</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {realtimeData.length > 0 ? realtimeData[realtimeData.length - 1]?.threats || 0 : 0}
              </div>
              <p className="text-sm text-muted-foreground">Threats Detected</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {refreshInterval}s
              </div>
              <p className="text-sm text-muted-foreground">Refresh Interval</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Mock data generators
const generateMockNetworks = (): NetworkDevice[] => {
  const vendors = ['vivo Mobile Communication Co., Ltd.', 'TP link Technologies Co., Ltd.'];
  return Array.from({ length: 15 }, (_, i) => ({
    ssid: `Network-${i + 1}`,
    bssid: `${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}`,
    is_spoof: Math.random() > 0.8,
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    ml_confidence: Math.random(),
    ml_prediction: Math.random() > 0.5 ? 1 : 0,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    features: {
      signal_strength: -Math.floor(Math.random() * 50) - 50, // -50 to -100 dBm
      channel: Math.floor(Math.random() * 11) + 1,
      frequency: Math.random() > 0.5 ? 2.4 : 5.0,
      ssid_length: Math.floor(Math.random() * 20) + 1,
      has_common_rogue_pattern: Math.random() > 0.8 ? 1 : 0,
      is_hidden: Math.random() > 0.9 ? 1 : 0,
      vendor_risk: Math.random() > 0.7 ? 1 : 0,
      is_locally_administered: Math.random() > 0.5 ? 1 : 0,
      encryption_risk: Math.random() > 0.3 ? 1 : 0,
      signal_category: Math.floor(Math.random() * 3),
      channel_width: 20,
      is_DFS_channel: 0
    },
    reasons: Math.random() > 0.8 ? ['Low signal strength', 'Suspicious vendor'] : []
  }));
};

const generateMockBlocks = (): BlockchainData[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 600000).toISOString(),
    ssid: `Network-${i + 1}`,
    bssid: `${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}`,
    is_spoof: Math.random() > 0.8,
    vendor: 'vivo Mobile Communication Co., Ltd.',
    ml_confidence: Math.random()
  }));
};

const generateMockStats = (): SystemStats => ({
  total_networks: Math.floor(Math.random() * 100) + 50,
  spoof_networks: Math.floor(Math.random() * 15),
  legitimate_networks: Math.floor(Math.random() * 85) + 15,
  spoof_percentage: Math.floor(Math.random() * 30)
});

// Main App Component
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('detection');

  const renderContent = () => {
    switch (activeTab) {
      case 'detection':
        return <NetworkDetection />;
      case 'blockchain':
        return <BlockchainExplorer />;
      case 'statistics':
        return <SystemStatistics />;
      case 'monitoring':
        return <RealTimeMonitoring />;
      default:
        return <NetworkDetection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;