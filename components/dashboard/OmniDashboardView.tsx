// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/dashboard/OmniDashboardView.tsx
================================================================================

```typescript
import React, { useState, useEffect, useCallback, useReducer, useRef, Suspense } from 'react';
import { 
  Activity, 
  BarChart2, 
  Brain, 
  Code, 
  CreditCard, 
  Globe, 
  Home, 
  Layout, 
  Lock, 
  Menu, 
  MessageSquare, 
  Settings, 
  Shield, 
  TrendingUp, 
  User, 
  Zap, 
  Bell, 
  Search, 
  Mic, 
  Terminal, 
  Cpu, 
  Database,
  Layers,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// --- Types & Interfaces ---

type UserRole = 'admin' | 'developer' | 'corporate' | 'personal' | 'auditor';
type ThemeMode = 'light' | 'dark' | 'matrix' | 'quantum';
type ViewMode = 'overview' | 'analytics' | 'investments' | 'code-engine' | 'security' | 'ai-nexus' | 'settings';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  biometricVerified: boolean;
  securityClearanceLevel: number;
}

interface DashboardState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  activeView: ViewMode;
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  notifications: NotificationItem[];
  aiSessionId: string | null;
  systemHealth: number; // 0-100
  networkLatency: number; // ms
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  type: 'security' | 'finance' | 'system' | 'ai';
}

interface DashboardMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  history: number[];
}

// --- Mock Data Generators (simulating API responses) ---

const generateMockMetrics = (): DashboardMetric[] => [
  { label: 'Total Assets', value: '$12,450,290.00', change: 2.5, trend: 'up', history: [10, 15, 13, 18, 25, 22, 30] },
  { label: 'AI Compute Usage', value: '845 PetaFLOPS', change: 12.1, trend: 'up', history: [40, 50, 45, 60, 75, 80, 85] },
  { label: 'Active Neural Nets', value: '42', change: 0, trend: 'neutral', history: [40, 41, 41, 42, 42, 42, 42] },
  { label: 'Security Threats', value: '0', change: -100, trend: 'down', history: [5, 2, 1, 3, 1, 0, 0] },
];

const mockNotifications: NotificationItem[] = [
  { id: '1', title: 'Quantum Encryption Key Rotation', message: 'Scheduled key rotation completed successfully.', timestamp: new Date(), priority: 'low', read: false, type: 'security' },
  { id: '2', title: 'Market Anomaly Detected', message: 'AI Advisor suggests reviewing Tech Sector allocations.', timestamp: new Date(Date.now() - 3600000), priority: 'high', read: false, type: 'finance' },
  { id: '3', title: 'Codebase Refactor Suggestion', message: 'Generative Engine found 15 optimization opportunities.', timestamp: new Date(Date.now() - 7200000), priority: 'medium', read: true, type: 'system' },
];

// --- Reducer for State Management ---

type Action = 
  | { type: 'LOGIN_SUCCESS'; payload: UserProfile }
  | { type: 'LOGOUT' }
  | { type: 'SET_VIEW'; payload: ViewMode }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'ADD_NOTIFICATION'; payload: NotificationItem }
  | { type: 'MARK_READ'; payload: string }
  | { type: 'UPDATE_METRICS'; payload: { health: number; latency: number } };

const dashboardReducer = (state: DashboardState, action: Action): DashboardState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, user: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n)
      };
    case 'UPDATE_METRICS':
      return { ...state, systemHealth: action.payload.health, networkLatency: action.payload.latency };
    default:
      return state;
  }
};

const initialState: DashboardState = {
  isLoading: true,
  isAuthenticated: false, // Default to false to trigger auth flow
  user: null,
  activeView: 'overview',
  theme: 'dark', // Default theme for modern tech look
  sidebarCollapsed: false,
  notifications: mockNotifications,
  aiSessionId: null,
  systemHealth: 98,
  networkLatency: 24,
};

// --- Sub-Components ---

const MetricCard: React.FC<{ metric: DashboardMetric }> = ({ metric }) => {
  const isPositive = metric.trend === 'up';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{metric.label}</h3>
        {metric.trend === 'up' ? <TrendingUp className="text-green-400 w-5 h-5" /> : 
         metric.trend === 'down' ? <Activity className="text-red-400 w-5 h-5" /> : 
         <Shield className="text-blue-400 w-5 h-5" />}
      </div>
      <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        <span>{isPositive ? '+' : ''}{metric.change}%</span>
        <span className="text-gray-500 ml-2">vs last week</span>
      </div>
      <div className="mt-4 h-10 w-full">
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metric.history.map((val, i) => ({ i, val }))}>
              <Line type="monotone" dataKey="val" stroke={isPositive ? '#4ade80' : '#f87171'} strokeWidth={2} dot={false} />
            </LineChart>
         </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const SidebarItem: React.FC<{ 
  icon: React.FC<any>; 
  label: string; 
  active: boolean; 
  collapsed: boolean; 
  onClick: () => void;
}> = ({ icon: Icon, label, active, collapsed, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 mb-2 rounded-lg transition-all duration-200 group relative
      ${active ? 'bg-cyan-900/30 text-cyan-400 border-r-2 border-cyan-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
    `}
  >
    <Icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
    {!collapsed && <span className="font-medium text-sm">{label}</span>}
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
        {label}
      </div>
    )}
  </button>
);

const OmniHeader: React.FC<{ 
  user: UserProfile | null; 
  toggleSidebar: () => void; 
  notifications: NotificationItem[];
  health: number;
}> = ({ user, toggleSidebar, notifications, health }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 mr-4">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
           </div>
           <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 hidden md:block">
             OMNI<span className="text-white">DASH</span>
           </span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Ask OmniAI about assets, code, or deployment status..." 
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-full pl-10 pr-10 py-2 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <Mic className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-4 h-4 cursor-pointer hover:scale-110 transition-transform" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden lg:flex items-center space-x-2 mr-4">
          <span className="text-xs text-gray-500 uppercase font-bold">Sys Health</span>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${health}%` }} />
          </div>
          <span className="text-xs text-green-400 font-mono">{health}%</span>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>

        <div className="flex items-center space-x-3 border-l border-gray-700 pl-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-white">{user?.name || 'Guest User'}</div>
            <div className="text-xs text-gray-500 uppercase">{user?.role || 'Unverified'}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 cursor-pointer">
             <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="User" /> : <User className="w-4 h-4 text-gray-300" />}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Feature Views ---

const OverviewPanel: React.FC = () => {
  const metrics = generateMockMetrics();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => <MetricCard key={i} metric={m} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Financial & System Convergence</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-cyan-900/50 text-cyan-400 text-xs rounded hover:bg-cyan-900/80">1H</button>
              <button className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600">1D</button>
              <button className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600">1W</button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: '00:00', assets: 4000, compute: 2400 },
                { name: '04:00', assets: 3000, compute: 1398 },
                { name: '08:00', assets: 2000, compute: 9800 },
                { name: '12:00', assets: 2780, compute: 3908 },
                { name: '16:00', assets: 1890, compute: 4800 },
                { name: '20:00', assets: 2390, compute: 3800 },
                { name: '24:00', assets: 3490, compute: 4300 },
              ]}>
                <defs>
                  <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }} />
                <Area type="monotone" dataKey="assets" stroke="#8884d8" fillOpacity={1} fill="url(#colorAssets)" />
                <Area type="monotone" dataKey="compute" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCompute)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">AI Advisor Highlights</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
             {[1,2,3,4].map((i) => (
               <div key={i} className="flex gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-800/80 transition-colors border border-gray-800">
                 <div className="mt-1"><Brain className="w-5 h-5 text-purple-400" /></div>
                 <div>
                   <h4 className="text-sm font-semibold text-gray-200">Portfolio Optimization</h4>
                   <p className="text-xs text-gray-400 mt-1">Detected a 15% inefficiency in cloud spending vs revenue generation. Recommending auto-scaling policy adjustment.</p>
                   <button className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 flex items-center">
                     Apply Fix <ChevronRight className="w-3 h-3 ml-1" />
                   </button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AICommandNexus: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Greetings. I am OmniAI. I have access to your entire financial, codebase, and corporate data spectrum. How may I assist you today?' }
  ]);

  const handleSend = () => {
    if(!query.trim()) return;
    setMessages([...messages, { role: 'user', content: query }]);
    setQuery('');
    // Simulate AI response delay
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: `I've analyzed the request "${query}". Based on the current multiverse financial projections and the codebase architecture in /api/multiverse-financial-projection.yaml, I suggest initiating a quantum-resistant ledger backup before proceeding.` }]);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
        <h2 className="font-bold text-lg text-white flex items-center gap-2">
          <Brain className="text-purple-500" /> OmniAI Nexus
        </h2>
        <div className="flex gap-2">
           <span className="text-xs px-2 py-1 rounded bg-green-900 text-green-400 border border-green-700">Model: Gemini Ultra 1.5</span>
           <span className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-400 border border-blue-700">Latency: 12ms</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-xl ${msg.role === 'user' ? 'bg-cyan-900/50 text-cyan-50 rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-white"><Zap className="w-5 h-5"/></button>
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Input command or query..."
            className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
          />
          <button onClick={handleSend} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors">
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

const DeveloperConsole: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="bg-black/80 rounded-xl border border-gray-800 font-mono text-sm p-4 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-2">
           <span className="text-green-400 font-bold flex items-center gap-2"><Terminal className="w-4 h-4"/> System Logs</span>
           <span className="text-gray-500 text-xs">Live Stream</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 text-xs">
           <div className="text-gray-400">[INFO] 10:42:01 - Initializing QuantumWeaverView...</div>
           <div className="text-gray-400">[INFO] 10:42:02 - Loading biometrics-quantum-authentication.yaml...</div>
           <div className="text-yellow-400">[WARN] 10:42:05 - Latency spike detected in eu-west-1 node.</div>
           <div className="text-green-400">[SUCCESS] 10:42:08 - Connected to Gemini_OpenAI_Proxy_API.</div>
           <div className="text-gray-400">[INFO] 10:42:09 - Fetching automated test reports from /features/AiUnitTestGenerator...</div>
           {Array.from({length: 10}).map((_, i) => (
              <div key={i} className="text-gray-500 opacity-50">[DEBUG] Trace ID #{Math.floor(Math.random() * 100000)} - Handshake validated.</div>
           ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-blue-400"/> API Usage Limits</h3>
           <div className="space-y-4">
              <div>
                 <div className="flex justify-between text-xs text-gray-400 mb-1">
                   <span>OpenAI GPT-4</span>
                   <span>85% Used</span>
                 </div>
                 <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[85%]"></div>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-xs text-gray-400 mb-1">
                   <span>Gemini Pro Vision</span>
                   <span>42% Used</span>
                 </div>
                 <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[42%]"></div>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-xs text-gray-400 mb-1">
                   <span>Internal Cloud Functions</span>
                   <span>12% Used</span>
                 </div>
                 <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-[12%]"></div>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Cpu className="w-5 h-5 text-red-400"/> Active Services</h3>
           <div className="grid grid-cols-2 gap-4">
              {['Auth Service', 'Payment Gateway', 'AI Engine', 'Notification Hub'].map(s => (
                <div key={s} className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                   <span className="text-sm text-gray-300">{s}</span>
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Authentication View (Embedded for this file) ---

const AuthOverlay: React.FC<{ onLogin: (user: UserProfile) => void }> = ({ onLogin }) => {
  const [step, setStep] = useState<'login' | 'biometric'>('login');
  const [loading, setLoading] = useState(false);

  const handleCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('biometric');
    }, 1000);
  };

  const handleBiometric = () => {
    setLoading(true);
    // Simulate biometric scan
    setTimeout(() => {
      onLogin({
        id: 'user-001',
        name: 'Alexander V.',
        email: 'alex.v@omnicorp.ai',
        role: 'admin',
        biometricVerified: true,
        securityClearanceLevel: 5,
        avatarUrl: 'https://i.pravatar.cc/150?img=11'
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gray-900/90 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">OmniDashboard Access</h2>
        <p className="text-gray-400 text-center mb-8">Secure Enterprise Environment</p>

        {step === 'login' && (
          <form onSubmit={handleCredentials} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Identity Identifier</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input type="email" defaultValue="alex.v@omnicorp.ai" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:border-cyan-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Passphrase</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input type="password" value="password123" readOnly className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:border-cyan-500 focus:outline-none" />
              </div>
            </div>
            <button disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all flex justify-center items-center">
              {loading ? <Activity className="animate-spin w-5 h-5" /> : 'Authenticate Identity'}
            </button>
          </form>
        )}

        {step === 'biometric' && (
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
               <div className={`absolute inset-0 rounded-full border-4 border-cyan-500/30 ${loading ? 'animate-ping' : ''}`}></div>
               <div className="relative z-10 bg-gray-800 p-4 rounded-full cursor-pointer hover:bg-gray-700 transition-colors" onClick={handleBiometric}>
                 <Zap className={`w-10 h-10 ${loading ? 'text-cyan-400' : 'text-gray-400'}`} />
               </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              {loading ? "Verifying Quantum Signature..." : "Touch sensor to verify biometric hash"}
            </p>
            {!loading && (
               <button onClick={handleBiometric} className="text-xs text-cyan-500 hover:underline">Use Fallback Key</button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// --- Main Component ---

const OmniDashboardView: React.FC = () => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Data Fetch Simulation
  useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(() => {
        dispatch({ 
          type: 'UPDATE_METRICS', 
          payload: { 
            health: Math.floor(95 + Math.random() * 5),
            latency: Math.floor(20 + Math.random() * 10)
          } 
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated]);

  const handleLogin = (user: UserProfile) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  };

  const renderContent = () => {
    switch (state.activeView) {
      case 'overview': return <OverviewPanel />;
      case 'ai-nexus': return <AICommandNexus />;
      case 'code-engine': return <DeveloperConsole />;
      // Placeholder for other views defined in file tree but simplified here
      case 'analytics': return <div className="text-white p-10 text-center">Analytics Module Loading via /components/analytics/ViewAnalyticsPreview.tsx...</div>;
      case 'investments': return <div className="text-white p-10 text-center">Investment Portfolio Loading via /components/InvestmentsView.tsx...</div>;
      case 'security': return <div className="text-white p-10 text-center">Security Policy Definitions Loading via /api_gateway/security_policy_definitions.yaml...</div>;
      default: return <OverviewPanel />;
    }
  };

  if (!state.isAuthenticated) {
    return <AuthOverlay onLogin={handleLogin} />;
  }

  return (
    <div className={`flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans selection:bg-cyan-500/30`}>
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 0 }}
        animate={{ width: state.sidebarCollapsed ? 80 : 280 }}
        className="flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col z-40 transition-all duration-300"
      >
        <div className="p-4 flex items-center justify-center h-16 border-b border-gray-800">
          {!state.sidebarCollapsed ? (
            <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-2 text-center text-xs font-mono text-gray-500 border border-gray-700">
              v24.0.1-RC
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <div className={`text-xs font-bold text-gray-600 uppercase mb-2 px-3 ${state.sidebarCollapsed ? 'hidden' : 'block'}`}>Main</div>
          <SidebarItem icon={Home} label="Overview" active={state.activeView === 'overview'} collapsed={state.sidebarCollapsed} onClick={() => dispatch({type: 'SET_VIEW', payload: 'overview'})} />
          <SidebarItem icon={Brain} label="AI Nexus" active={state.activeView === 'ai-nexus'} collapsed={state.sidebarCollapsed} onClick={() => dispatch({type: 'SET_VIEW', payload: 'ai-nexus'})} />
          <SidebarItem icon={BarChart2} label="Analytics" active={state.activeView === 'analytics'} collapsed={state.sidebarCollapsed} onClick={() => dispatch({type: 'SET_VIEW', payload: 'analytics'})} />
          
          <div className="my-4 border-t border-gray-800"></div>
          <div className={`text-xs font-bold text-gray-600 uppercase mb-2 px-3 ${state.sidebarCollapsed ? 'hidden' : 'block'}`}>Finance</div>
          <SidebarItem icon={CreditCard} label="Investments" active={state.activeView === 'investments'} collapsed={state.sidebarCollapsed} onClick={() => dispatch({type: 'SET_VIEW', payload: 'investments'})} />
          <SidebarItem icon={Globe} label="Marketplace" active={false} collapsed={state.sidebarCollapsed} onClick={() => {}} />
          
          <div className="my-4 border-t border-gray-800"></div>
          <div className={`text-xs font-bold text-gray-600 uppercase mb-2 px-3 ${state.sidebarCollapsed ? 'hidden' : 'block'}`}>Developer</div>
          <SidebarItem icon={Terminal} label="Console" active={state.activeView === 'code-engine'} collapsed={state.sidebarCollapsed} onClick={() => dispatch({type: 'SET_VIEW', payload: 'code-engine'})} />
          <SidebarItem icon={Layers} label="Infrastructure" active={false} collapsed={state.sidebarCollapsed} onClick={() => {}} />
          <SidebarItem icon={Lock} label="Security" active={state.activeView === 'security'} collapsed={state.sidebarCollapsed} onClick={() => dispatch({type: 'SET_VIEW', payload: 'security'})} />
        </div>

        <div className="p-4 border-t border-gray-800">
          <button 
             onClick={() => dispatch({ type: 'LOGOUT' })}
             className={`flex items-center w-full p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors ${state.sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5" />
            {!state.sidebarCollapsed && <span className="ml-3 font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <OmniHeader 
           user={state.user} 
           toggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} 
           notifications={state.notifications}
           health={state.systemHealth}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-950 p-6 relative" ref={scrollRef}>
           {/* Background Mesh Gradient */}
           <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
           
           <div className="relative z-10 max-w-7xl mx-auto">
             <div className="mb-8 flex justify-between items-end">
               <div>
                 <h1 className="text-3xl font-bold text-white mb-2">
                   {state.activeView === 'overview' && `Welcome back, ${state.user?.name.split(' ')[0]}`}
                   {state.activeView === 'ai-nexus' && 'AI Command Center'}
                   {state.activeView === 'code-engine' && 'Developer Operations'}
                   {state.activeView === 'analytics' && 'Data Analytics'}
                   {state.activeView === 'investments' && 'Investment Portfolio'}
                   {state.activeView === 'security' && 'Security Protocols'}
                 </h1>
                 <p className="text-gray-400">
                   {state.activeView === 'overview' && 'Here is what is happening in your multiverse today.'}
                   {state.activeView === 'ai-nexus' && 'Direct interface to neural assets and generative engines.'}
                 </p>
               </div>
               <div className="hidden sm:flex space-x-3">
                 <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-sm font-medium transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Config</span>
                 </button>
                 <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">
                    <Database className="w-4 h-4" />
                    <span>Export Report</span>
                 </button>
               </div>
             </div>

             <Suspense fallback={<div className="flex items-center justify-center h-64"><Activity className="w-8 h-8 animate-spin text-cyan-500"/></div>}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={state.activeView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
             </Suspense>
           </div>
        </main>
      </div>
    </div>
  );
};

export default OmniDashboardView;
```