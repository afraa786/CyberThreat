import { useNavigate } from 'react-router-dom';
import { Terminal as TerminalIcon, Shield, Cpu, Network, Activity, Lock, Menu, LogOut } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { NetworkGraph } from './components/NetworkGraph';
import { ActivityLog } from './components/ActivityLog';
import { Terminal } from './components/Terminal';
import { ThreatMap } from './components/ThreatMap';
import { SystemResources } from './components/SystemResources';
import { SecurityScore } from './components/SecurityScore';
import { LiveAlerts } from './components/LiveAlerts';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    navigate('/');
    return;
  }

  try {
    await axios.post('http://localhost:8080/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.error('Logout failed:', err); // OK to skip
  } finally {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userEmail');
    navigate('/');
  }
};


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
            <h1 className="text-2xl font-bold text-neutral-100">CyberThreat</h1>
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
 
        <div className="Navbar">
          <div className="relative mb-6 flex items-center justify-between rounded-2xl bg-neutral-800/50 p-3 backdrop-blur-sm">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="relative"></div>
              </div>
              
              <nav className="hidden md:block">
                <ul className="flex space-x-6">
                  <li className="group relative">
                    <a href="#" className="flex items-center space-x-1 text-emerald-400 transition-colors">
                      <span>Home</span>
                      <div className="h-1 w-1 rounded-full bg-emerald-400"></div>
                    </a>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                  <li className="group relative">
                    <a href="#" className="flex items-center space-x-1 text-neutral-400 transition-colors hover:text-emerald-400">
                      <span>Community</span>
                    </a>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </li>
                  <li className="group relative">
                    <a href="#" className="flex items-center space-x-1 text-neutral-400 transition-colors hover:text-emerald-400">
                      <span>Tokens</span>
                    </a>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                    </li>
                    <li className="group">
                  <button onClick={() => navigate('/url')} className="block text-neutral-400 hover:text-emerald-400 py-1 w-full text-left">
                    URL Analyzer
                  </button>
                </li>
                </ul>
              </nav>
              
              <button 
                className="md:hidden text-emerald-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center justify-center rounded-full bg-emerald-400/10 p-2 text-emerald-400 transition-all hover:bg-emerald-400/20">
                <Shield className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => navigate('/chatbot')}
                className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-neutral-900 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400"
              >
               AstraAI
              </button>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center rounded-full bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <div className="md:hidden bg-neutral-800/90 backdrop-blur-sm rounded-lg p-4 mb-4">
              <ul className="space-y-3">
                <li className="group">
                  <a href="#" className="block text-emerald-400 py-1">
                    Home
                  </a>
                </li>
                <li className="group">
                  <a href="#" className="block text-neutral-400 hover:text-emerald-400 py-1">
                    Community
                  </a>
                </li>
                <li className="group">
                  <a href="#" className="block text-neutral-400 hover:text-emerald-400 py-1">
                    Tokens
                  </a>
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

        <div className="ai-bot relative" style={{
          marginTop: '5px',
          marginBottom: '50px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '20px',
          zIndex: '1',
          width: '100%',
          maxWidth: '100vw',
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '-1',
            overflow: 'hidden',
          }}>
            <video 
              autoPlay 
              loop 
              muted 
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: '0.4',
              }}
            >
              <source src="../public/globebg.mp4" type="video/mp4" />
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                left: '0', 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#121212' 
              }}></div>
            </video>
          
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%)',
              zIndex: '0',
            }}></div>
          </div>

          <div className="flex flex-col md:flex-row" style={{ marginLeft: '25px' }}>
            <div className='ai-text md:mr-auto'>
              <h1 style={{
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                fontWeight: 'bold',
                color: '#00ff99',
                width: '100%',
                maxWidth: '500px',
                textShadow: '0 0 10px #00ff99, 0 0 20px #00cc88, 0 0 30px #008866',
                fontFamily: '"Orbitron", sans-serif',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: 'Pointer',
                marginTop: '20px',
              }}>
                Your AI Smart Assistant Against Digital Scams
              </h1>

              <h2 style={{
                fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                color: 'white',
                width: '100%',
                maxWidth: '700px',
                marginTop: '30px',
              }}>
                Protect yourself from digital scams with our intelligent AI assistant. 
                Detect phishing links, fraudulent messages, and cyber threats in real time.
              </h2>

              <div className='ai-button' style={{ marginTop: '30px', marginBottom: '20px' }}>
                <button
                  onClick={() => navigate('/chatbot')}
                  className="group relative flex items-center gap-2 px-8 py-4 bg-transparent border-none rounded-full cursor-pointer transition-transform duration-300 ease-in-out transform origin-center hover:scale-110 focus:scale-110 active:scale-100"
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#1f1f1f] rounded-full z-0 shadow-[inset_0_0.5px_rgba(255,255,255,1),inset_0_-1px_2px_0_rgba(0,0,0,1),0px_4px_10px_-4px_rgba(0,0,0,1)]"></div>
                  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%+4px)] h-[calc(100%+4px)] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-400 opacity-70"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,transparent_50%,#10b981_75%,transparent_95%)] animate-[spin_4s_linear_infinite]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,transparent_50%,#10b981_75%,transparent_95%)] animate-[spin_5s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,transparent_50%,#10b981_75%,transparent_95%)] animate-[spin_6s_linear_infinite]"></div>
                  </div>
                  
                  <svg fill="none" viewBox="0 0 24 24" className="sparkle relative w-7 z-10 text-white">
                    <path className="path" d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"></path>
                    <path className="path" d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"></path>
                    <path className="path" d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"></path>
                  </svg>
                  
                  <span className="text_button relative z-10 text-base text-white">
                    Try it out!
                  </span>
                </button>
              </div>
            </div>

            <div className="ai-pic mt-6 md:mt-0" style={{ 
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              position: 'relative',
              marginLeft: 'auto',
              alignSelf: 'center'
            }}>
              <img 
                src="../public/green.png" 
                alt="AI Assistant" 
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              <NetworkGraph />
              <SystemResources />
            </div>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
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