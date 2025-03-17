import { Terminal as TerminalIcon, Shield, Cpu, Network, Activity, Lock, AlertTriangle } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { NetworkGraph } from './components/NetworkGraph';
import { ActivityLog } from './components/ActivityLog';
import { Terminal } from './components/Terminal';
import { ThreatMap } from './components/ThreatMap';
import { SystemResources } from './components/SystemResources';
import { SecurityScore } from './components/SecurityScore';
import { LiveAlerts } from './components/LiveAlerts';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <TerminalIcon className="h-8 w-8 text-emerald-400" />
              <div className="absolute -top-1 -right-1 h-3 w-3">
                <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></div>
                <div className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-neutral-100">HackDash</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-neutral-400">System Online</span>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="text-sm text-neutral-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <SecurityScore />
          <DashboardCard
            title="CPU Usage"
            value="42%"
            icon={<Cpu className="h-4 w-4" />}
            glowColor="rgba(255, 86, 86, 0.2)"
          />
          <DashboardCard
            title="Network Traffic"
            value="1.2 TB"
            icon={<Network className="h-4 w-4" />}
            glowColor="rgba(86, 182, 255, 0.2)"
          />
          <LiveAlerts />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="grid gap-8 md:grid-cols-2">
              <NetworkGraph />
              <SystemResources />
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Terminal />
              <ThreatMap />
            </div>
          </div>
          <div className="space-y-8">
            <ActivityLog />
            <div className="grid gap-4 grid-cols-2">
              <DashboardCard
                title="Firewall Status"
                value="Active"
                icon={<Lock className="h-4 w-4" />}
                className="col-span-1"
              />
              <DashboardCard
                title="System Load"
                value="Normal"
                icon={<Activity className="h-4 w-4" />}
                className="col-span-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;