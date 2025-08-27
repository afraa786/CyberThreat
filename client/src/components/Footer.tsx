import { 
  Terminal as TerminalIcon, 
  Shield, 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  AlertTriangle, 
  ShieldCheck,
  User,
  Wifi
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border-t border-emerald-500/20 py-12 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05),transparent_60%)]" />
      </div>

      <div className="absolute inset-0 opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(16 185 129) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <TerminalIcon className="h-8 w-8 text-emerald-400" />
                <div className="absolute -top-1 -right-1 h-3 w-3">
                  <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></div>
                  <div className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-neutral-100">Securo</h2>
            </div>
            
            <p className="text-neutral-400 text-sm leading-relaxed">
              Smarter, safer, and built for everyone — Securo protects you from 
              scams, threats, and digital fraud in real time.
            </p>
            
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-neutral-400">System Online</span>
            </div>
          </div>

          <div>
            <h3 className="text-neutral-100 font-semibold mb-4">Features</h3>
            <ul className="space-y-3 text-neutral-400 text-sm">
              <li>
                <a href="/url" className="flex items-center space-x-2 hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                  <Shield className="w-4 h-4" />
                  <span>Scan a Link</span>
                </a>
              </li>
              <li>
                <a href="/wifi" className="flex items-center space-x-2 hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                  <Wifi className="w-4 h-4" />
                  <span>Scan a WiFi Network</span>
                </a>
              </li>
              <li>
                <a href="/threat" className="flex items-center space-x-2 hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Report a threat</span>
                </a>
              </li>
              <li>
                <a href="/chatbot" className="flex items-center space-x-2 hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                  <TerminalIcon className="w-4 h-4" />
                  <span>AstraAI</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-neutral-100 font-semibold mb-4">Community</h3>
            <ul className="space-y-3 text-neutral-400 text-sm">
              <li>
                <a href="/community" className="hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                  Community
                </a>
              </li>
              <li>
                <a href="/faqs" className="hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/token" className="hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                  For Developers
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-neutral-100 font-semibold mb-4">Connect</h3>
            <ul className="space-y-3 text-neutral-400 text-sm mb-6">
              <li className="hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                Privacy Policy
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                Terms of Service
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors duration-200">
                Contact Support
              </li>
            </ul>

            <div className="flex space-x-3">
              <a href="#" className="flex items-center justify-center rounded-full bg-neutral-800/50 p-2 text-neutral-400 transition-all hover:bg-emerald-400/10 hover:text-emerald-400">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="flex items-center justify-center rounded-full bg-neutral-800/50 p-2 text-neutral-400 transition-all hover:bg-emerald-400/10 hover:text-emerald-400">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="flex items-center justify-center rounded-full bg-neutral-800/50 p-2 text-neutral-400 transition-all hover:bg-emerald-400/10 hover:text-emerald-400">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="flex items-center justify-center rounded-full bg-neutral-800/50 p-2 text-neutral-400 transition-all hover:bg-emerald-400/10 hover:text-emerald-400">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-800/60">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-neutral-500 text-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>© {new Date().getFullYear()} Securo. Protecting your digital life.</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-neutral-400">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}