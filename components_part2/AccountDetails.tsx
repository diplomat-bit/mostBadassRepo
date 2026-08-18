// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/AccountDetails.tsx
================================================================================

import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Activity, Clock, ShieldCheck, DollarSign } from 'lucide-react';

interface AccountDetailsProps {
  customerId: string;
  accountId: string;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ customerId, accountId }) => {
  const context = useContext(DataContext);
  const [balanceHistory, setBalanceHistory] = useState<{ date: string; balance: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const account = useMemo(() => {
    return context?.linkedAccounts.find(a => a.id === accountId) || context?.linkedAccounts[0];
  }, [context, accountId]);

  useEffect(() => {
    // Generate synthetic balance history for the chart
    const history = Array.from({ length: 30 }, (_, i) => ({
        date: `T-${30-i}d`,
        balance: (account?.balance || 5000) * (0.9 + Math.random() * 0.2)
    }));
    setBalanceHistory(history);
    setLoading(false);
  }, [account]);

  if (loading) return <div className="flex justify-center p-10 animate-pulse text-cyan-400">SYNCING_LEDGER...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Account Summary" className="md:col-span-1">
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol</span>
                <span className="text-xs font-bold text-white uppercase">{account?.name || 'NEXUS_VAULT'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Masked_ID</span>
                <span className="text-xs font-mono text-white">****{account?.mask || '0000'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Security</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><ShieldCheck size={12}/> HARDENED</span>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2" title="Balance Matrix">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-4">
               <div>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Available Capital</p>
                   <p className="text-5xl font-black text-white font-mono tracking-tighter">${(account?.balance || 0).toLocaleString()}</p>
                   <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">as of {new Date().toLocaleDateString()}</p>
               </div>
               <div className="flex gap-4">
                  <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 text-center min-w-[120px]">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Interest</p>
                      <p className="text-lg font-black text-cyan-400 font-mono">4.2%</p>
                  </div>
                  <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 text-center min-w-[120px]">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Risk_Tier</p>
                      <p className="text-lg font-black text-indigo-400 font-mono">ALPHA</p>
                  </div>
               </div>
           </div>
        </Card>
      </div>

      <Card title="Liquidity Flux (L30D)" icon={<Activity className="text-cyan-400" />}>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#22d3ee' }}
                formatter={(v: any) => [`$${v.toLocaleString()}`, 'Balance']}
              />
              <Line type="monotone" dataKey="balance" stroke="#06b6d4" strokeWidth={3} dot={false} animationDuration={2000} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AccountDetails;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/AccountDetails.tsx
================================================================================

import React, { useState, useEffect, useMemo, useContext, useRef, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { 
  Activity, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  Zap, 
  Gauge, 
  MessageSquare, 
  Send, 
  ShieldAlert, 
  Lock, 
  Key, 
  Database, 
  Cpu, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Terminal,
  Layers,
  Fingerprint,
  Globe,
  CreditCard,
  Wallet,
  History,
  Settings,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  Download,
  Share2,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL NEXUS - ACCOUNT CORE
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience.
 * - High-Performance Financial Engine.
 * - Homomorphic Encryption Simulation for Key Storage.
 * - Integrated AI Pilot (Gemini 3 Flash).
 * - Real-time Audit Logging.
 */

// --- TYPES & INTERFACES ---

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  metadata: any;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'data';
}

interface EncryptedKey {
  id: string;
  label: string;
  cipher: string; // Simulated homomorphic cipher
  checksum: string;
  createdAt: string;
}

interface AccountDetailsProps {
  customerId: string;
  accountId: string;
}

// --- UTILITIES: CRYPTO & AUDIT ---

/**
 * SIMULATED HOMOMORPHIC ENCRYPTION ENGINE
 * In a real production environment, this would use libraries like Microsoft SEAL or Concrete.
 * For this "Golden Ticket" demo, we simulate the ability to perform operations on encrypted data.
 */
const QuantumVault = {
  encrypt: (data: string): string => {
    const b64 = btoa(data);
    return `HE_V1_${b64.split('').reverse().join('')}_SIG_${Math.random().toString(36).substring(7)}`;
  },
  decrypt: (cipher: string): string => {
    if (!cipher.startsWith('HE_V1_')) return 'INVALID_CIPHER';
    const core = cipher.split('_')[2];
    return atob(core.split('').reverse().join(''));
  },
  // Simulated homomorphic check: verify key without decrypting
  verifyIntegrity: (cipher: string): boolean => {
    return cipher.includes('_SIG_') && cipher.length > 20;
  }
};

// --- MAIN COMPONENT ---

const AccountDetails: React.FC<AccountDetailsProps> = ({ customerId, accountId }) => {
  const context = useContext(DataContext);
  
  // -- STATE MANAGEMENT --
  const [balanceHistory, setBalanceHistory] = useState<{ date: string; balance: number; volume: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [vaultKeys, setVaultKeys] = useState<EncryptedKey[]>([]);
  const [showVault, setShowVault] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'security' | 'audit'>('overview');
  
  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // -- MEMOIZED DATA --
  const account = useMemo(() => {
    return context?.linkedAccounts.find(a => a.id === accountId) || context?.linkedAccounts[0];
  }, [context, accountId]);

  // -- AUDIT LOGGING --
  const logAction = useCallback((action: string, severity: AuditEntry['severity'] = 'INFO', metadata: any = {}) => {
    const entry: AuditEntry = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      actor: 'SYSTEM_USER_01',
      severity,
      metadata
    };
    setAuditTrail(prev => [entry, ...prev].slice(0, 100));
    console.log(`[AUDIT] ${action}`, metadata);
  }, []);

  // -- INITIALIZATION --
  useEffect(() => {
    // Generate synthetic high-fidelity data
    const history = Array.from({ length: 30 }, (_, i) => {
        const base = (account?.balance || 1250000);
        const variance = 0.85 + Math.random() * 0.3;
        return {
            date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            balance: base * variance,
            volume: Math.random() * 50000
        };
    });
    setBalanceHistory(history);
    
    // Initial Audit
    logAction('ACCOUNT_VIEW_INITIALIZED', 'INFO', { accountId, customerId });

    // Initial Keys
    setVaultKeys([
      { 
        id: 'K-992', 
        label: 'ERP_INTEGRATION_PROD', 
        cipher: QuantumVault.encrypt('sk_live_quantum_9928374'), 
        checksum: '0x882...F21',
        createdAt: new Date().toISOString() 
      }
    ]);

    setLoading(false);
  }, [account, accountId, customerId, logAction]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // -- AI ENGINE (GEMINI 3 FLASH) --
  const askAI = async (customPrompt?: string) => {
    const input = customPrompt || userInput;
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
        timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setUserInput("");
    setIsAiLoading(true);

    try {
        // Using the requested GoogleGenAI package with Vercel secrets
        const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || 'DEMO_MODE_KEY');
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const systemContext = `
            You are the "Quantum Financial Nexus AI Pilot". 
            This is a "Golden Ticket" business banking demo.
            Tone: Elite, Professional, High-Performance, Secure.
            Metaphor: Test-driving a luxury high-performance car.
            
            Capabilities:
            - You can trigger actions: [CREATE_PAYMENT], [GENERATE_KEY], [VIEW_AUDIT], [DOWNLOAD_REPORT].
            - You explain complex financial data simply.
            - You NEVER mention "Citibank". Use "Quantum Financial" or "The Demo Bank".
            - You are helping the user "kick the tires" of this financial engine.
            
            Current Account State:
            - Name: ${account?.name}
            - Balance: $${account?.balance}
            - Status: SECURE / ALPHA TIER
            
            If the user wants to pay or create something, include the action tag in your response.
        `;

        const result = await model.generateContent([systemContext, input]);
        const response = await result.response;
        const text = response.text();

        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: text,
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, aiMsg]);
        logAction('AI_INTERACTION', 'INFO', { prompt: input, responseLength: text.length });

        // Handle simulated actions triggered by AI
        if (text.includes('[CREATE_PAYMENT]')) setShowPaymentModal(true);
        if (text.includes('[GENERATE_KEY]')) setShowKeyModal(true);
        if (text.includes('[VIEW_AUDIT]')) setActiveTab('audit');

    } catch (error) {
        console.error("AI Error:", error);
        const fallbackMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I've encountered a telemetry glitch in the AI core, but the engine is still roaring. It's like test-driving a car – you get to kick the tires, see all the bells and whistles, and ensure it's the perfect fit. How can I assist with your liquidity today?",
            timestamp: new Date()
        };
        setChatHistory(prev => [...prev, fallbackMsg]);
    } finally {
        setIsAiLoading(false);
    }
  };

  // -- ACTION HANDLERS --

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    logAction('STRIPE_PAYMENT_INITIATED', 'INFO', { amount: 50000, currency: 'USD' });
    
    // Simulate Stripe Processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessingPayment(false);
    setShowPaymentModal(false);
    logAction('STRIPE_PAYMENT_SUCCESS', 'INFO', { transactionId: 'ch_3NqW...z91' });
    
    const successMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: "Payment successful. $50,000.00 has been injected into the liquidity pool. The engine is running at peak efficiency.",
        timestamp: new Date(),
        type: 'action'
    };
    setChatHistory(prev => [...prev, successMsg]);
  };

  const generateNewKey = (label: string) => {
    const newKey: EncryptedKey = {
        id: `K-${Math.floor(Math.random() * 1000)}`,
        label: label || 'NEW_INTEGRATION',
        cipher: QuantumVault.encrypt(`sk_test_${Math.random().toString(36).substring(7)}`),
        checksum: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()}...`,
        createdAt: new Date().toISOString()
    };
    setVaultKeys(prev => [...prev, newKey]);
    logAction('ENCRYPTED_KEY_GENERATED', 'WARN', { label, keyId: newKey.id });
    setShowKeyModal(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-cyan-500 font-mono">
        <RefreshCw className="animate-spin mb-4" size={48} />
        <p className="animate-pulse tracking-[0.5em]">INITIALIZING_QUANTUM_CORE...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      
      {/* --- HEADER / TELEMETRY --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">System Status: Optimal</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
            {account?.name || 'QUANTUM_VAULT'} 
            <span className="text-sm font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-400">
              ID: {accountId.substring(0, 8)}...
            </span>
          </h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.3)]"
          >
            <Plus size={18} /> INJECT LIQUIDITY
          </button>
          <button 
            onClick={() => setShowVault(!showVault)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${showVault ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            <Lock size={18} /> {showVault ? 'CLOSE VAULT' : 'OPEN VAULT'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: MAIN INTERFACE (8 COLS) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* TABS */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
            {(['overview', 'analytics', 'security', 'audit'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* BALANCE HERO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <DollarSign size={120} />
                  </div>
                  <p className="text-xs font-black text-cyan-500 uppercase tracking-[0.2em] mb-2">Available Liquidity</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white tracking-tighter">
                      ${(account?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1 text-sm">
                      <ArrowUpRight size={16} /> +2.4%
                    </span>
                  </div>
                  <div className="mt-8 flex gap-8">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Pending Wires</p>
                      <p className="text-xl font-mono text-white">$12,400.00</p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Daily Limit</p>
                      <p className="text-xl font-mono text-white">$5,000,000.00</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                        <ShieldCheck size={24} />
                      </div>
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded border border-emerald-500/20">ACTIVE</span>
                    </div>
                    <h4 className="font-bold text-white mb-1">Alpha Tier Security</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Multi-factor biometric auth and homomorphic key encryption enabled.</p>
                  </div>
                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-colors">
                    MANAGE PROTOCOLS
                  </button>
                </div>
              </div>

              {/* CHART SECTION */}
              <Card title="Liquidity Flux (30-Day Telemetry)" icon={<Activity className="text-cyan-500" />}>
                <div className="h-[300px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceHistory}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#475569" 
                        fontSize={10} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b' }}
                      />
                      <YAxis hide domain={['dataMin - 50000', 'dataMax + 50000']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#22d3ee' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#06b6d4" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorBalance)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
              <Card title="Transaction Volume" icon={<BarChart className="text-indigo-400" />}>
                <div className="h-[250px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={balanceHistory.slice(-10)}>
                      <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]}>
                        {balanceHistory.slice(-10).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                        ))}
                      </Bar>
                      <XAxis dataKey="date" hide />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card title="Global Exposure" icon={<Globe className="text-emerald-400" />}>
                <div className="space-y-4 mt-4">
                  {[
                    { region: 'North America', value: 65, color: 'bg-cyan-500' },
                    { region: 'EMEA', value: 20, color: 'bg-indigo-500' },
                    { region: 'APAC', value: 15, color: 'bg-emerald-500' },
                  ].map((r) => (
                    <div key={r.region}>
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                        <span>{r.region}</span>
                        <span>{r.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${r.color}`} style={{ width: `${r.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-indigo-500 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                    <Lock className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Quantum Vault Storage</h3>
                    <p className="text-slate-400">Homomorphic encryption ensures your API keys and secrets are never visible in plain text, even to the system memory.</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {vaultKeys.map(key => (
                    <div key={key.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-indigo-500/50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-lg text-slate-500 group-hover:text-indigo-400 transition-colors">
                          <Key size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{key.label}</p>
                          <p className="text-[10px] font-mono text-slate-500">{key.cipher.substring(0, 40)}...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] font-black text-slate-500 uppercase">Checksum</p>
                          <p className="text-[10px] font-mono text-emerald-500">{key.checksum}</p>
                        </div>
                        <button 
                          onClick={() => {
                            logAction('KEY_DELETION_ATTEMPT', 'CRITICAL', { keyId: key.id });
                            setVaultKeys(prev => prev.filter(k => k.id !== key.id));
                          }}
                          className="p-2 hover:bg-red-500/10 hover:text-red-500 text-slate-600 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setShowKeyModal(true)}
                    className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                  >
                    <Plus size={18} /> GENERATE NEW ENCRYPTED KEY
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-black border border-white/10 rounded-3xl overflow-hidden animate-in fade-in duration-500">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Terminal size={18} className="text-cyan-500" />
                  System Audit Trail
                </h3>
                <button className="text-[10px] font-bold text-cyan-500 hover:underline">EXPORT_LOGS.CSV</button>
              </div>
              <div className="max-h-[500px] overflow-y-auto font-mono text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-900 text-slate-500 uppercase">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Severity</th>
                      <th className="p-4">Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditTrail.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="p-4 font-bold text-white">{log.action}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded ${
                            log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 
                            log.severity === 'WARN' ? 'bg-yellow-500/20 text-yellow-500' : 
                            'bg-cyan-500/20 text-cyan-500'
                          }`}>
                            {log.severity}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 truncate max-w-[200px]">{JSON.stringify(log.metadata)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: AI PILOT & CHAT (4 COLS) --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI PILOT PANEL */}
          <div className="bg-gradient-to-b from-slate-900 to-black border border-cyan-500/30 rounded-3xl flex flex-col h-[700px] shadow-2xl shadow-cyan-900/20 relative overflow-hidden">
            
            {/* AI Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 bg-cyan-500 rounded-full flex items-center justify-center text-black">
                    <Cpu size={24} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm uppercase tracking-tighter">Nexus AI Pilot</h3>
                  <p className="text-[10px] text-cyan-500 font-bold uppercase">Gemini 3 Flash Core</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-pulse" />
                <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-pulse delay-75" />
                <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-pulse delay-150" />
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {chatHistory.length === 0 && (
                <div className="text-center py-10 space-y-4">
                  <div className="inline-block p-4 bg-white/5 rounded-full text-cyan-500 mb-2">
                    <Sparkles size={32} />
                  </div>
                  <h4 className="text-white font-bold">Welcome to the Driver's Seat</h4>
                  <p className="text-xs text-slate-400 leading-relaxed px-6">
                    I am your financial co-pilot. Kick the tires, see the engine roar, and let's explore your "Golden Ticket" to global banking.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 px-4">
                    {['Create Payment', 'Audit Logs', 'Security Check'].map(suggestion => (
                      <button 
                        key={suggestion}
                        onClick={() => askAI(suggestion)}
                        className="text-[10px] font-bold px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-cyan-500 hover:text-black transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-none' 
                      : msg.role === 'system'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-tl-none'
                        : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                  }`}>
                    {msg.content}
                    <div className="mt-2 text-[9px] opacity-50 font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce" />
                      <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce delay-75" />
                      <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/50 border-t border-white/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); askAI(); }}
                className="relative"
              >
                <input 
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask the Pilot..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                <button 
                  type="submit"
                  disabled={isAiLoading || !userInput.trim()}
                  className="absolute right-2 top-2 h-10 w-10 bg-cyan-500 text-black rounded-lg flex items-center justify-center hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </form>
              <p className="text-[9px] text-center text-slate-600 mt-3 font-bold uppercase tracking-widest">
                Quantum Financial Nexus v4.0.2-Stable
              </p>
            </div>
          </div>

          {/* QUICK STATS CARD */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Network Telemetry</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">API Latency</span>
                <span className="text-xs font-mono text-emerald-500">12ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Encryption Load</span>
                <span className="text-xs font-mono text-cyan-500">0.02%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Audit Sync</span>
                <span className="text-xs font-mono text-indigo-500">REAL-TIME</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS (POPUPS) --- */}

      {/* STRIPE PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10 bg-gradient-to-r from-cyan-600 to-blue-600">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/20 rounded-2xl text-white">
                  <CreditCard size={32} />
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="text-white/50 hover:text-white">
                  <Trash2 size={24} />
                </button>
              </div>
              <h3 className="text-2xl font-black text-white mt-4">Inject Liquidity</h3>
              <p className="text-white/70 text-sm">Powered by Stripe Connect</p>
            </div>
            <form onSubmit={handleStripePayment} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    defaultValue="50000"
                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-8 pr-4 text-xl font-mono text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Source</label>
                  <select className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white outline-none">
                    <option>External Treasury</option>
                    <option>Operating Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Speed</label>
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-bold">
                    <Zap size={14} /> INSTANT
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? <RefreshCw className="animate-spin" /> : 'CONFIRM TRANSACTION'}
              </button>
              <p className="text-[9px] text-slate-500 text-center uppercase font-bold">
                Securely processed via Quantum Shield Protocol
              </p>
            </form>
          </div>
        </div>
      )}

      {/* KEY GENERATION MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10 bg-indigo-600">
              <h3 className="text-2xl font-black text-white">Generate Encrypted Key</h3>
              <p className="text-white/70 text-sm">Homomorphic Vault Integration</p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Integration Label</label>
                <input 
                  id="keyLabel"
                  type="text" 
                  placeholder="e.g. SAP_ERP_PROD"
                  className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <div className="flex gap-3">
                  <ShieldAlert className="text-indigo-400 shrink-0" size={20} />
                  <p className="text-[11px] text-indigo-300 leading-relaxed">
                    This key will be stored using <strong>Homomorphic Encryption</strong>. You can perform API operations without the system ever decrypting the raw secret into memory.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowKeyModal(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => {
                    const label = (document.getElementById('keyLabel') as HTMLInputElement)?.value;
                    generateNewKey(label);
                  }}
                  className="flex-1 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-xl transition-all"
                >
                  GENERATE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountDetails;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/AccountDetails.tsx
================================================================================

import React, { useState, useEffect, useMemo, useContext, useRef, useCallback } from 'react';
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import Typography from './Typography';
import { apiClient } from '../lib/apiClient';
import { 
  Activity, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  Zap, 
  Cpu, 
  ArrowUpRight, 
  RefreshCw, 
  Terminal,
  Lock, 
  Key, 
  Plus,
  Trash2,
  CreditCard,
  ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  metadata: any;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'data';
}

interface EncryptedKey {
  id: string;
  label: string;
  cipher: string;
  checksum: string;
  createdAt: string;
}

interface AccountDetailsProps {
  customerId: string;
  accountId: string;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ customerId, accountId }) => {
  const context = useContext(DataContext);
  
  const [balanceHistory, setBalanceHistory] = useState<{ date: string; balance: number; volume: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [vaultKeys, setVaultKeys] = useState<EncryptedKey[]>([]);
  const [showVault, setShowVault] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'security' | 'audit'>('overview');
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const account = useMemo(() => {
    return context?.linkedAccounts?.find(a => a.id === accountId) || context?.linkedAccounts?.[0];
  }, [context, accountId]);

  const logAction = useCallback(async (action: string, severity: AuditEntry['severity'] = 'INFO', metadata: any = {}) => {
    try {
      const entry = await apiClient.post('/audit', { action, severity, metadata });
      setAuditTrail(prev => [entry.data, ...prev].slice(0, 100));
    } catch (err) {
      console.error("Audit logging failed", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, keysRes] = await Promise.all([
          apiClient.get(`/accounts/${accountId}/history`),
          apiClient.get(`/accounts/${accountId}/keys`)
        ]);
        setBalanceHistory(historyRes.data);
        setVaultKeys(keysRes.data);
        await logAction('ACCOUNT_VIEW_INITIALIZED', 'INFO', { accountId, customerId });
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accountId, customerId, logAction]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const askAI = async (customPrompt?: string) => {
    const input = customPrompt || userInput;
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    setUserInput("");
    setIsAiLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', { prompt: input, context: { accountId } });
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: response.data.text, timestamp: new Date() };
      setChatHistory(prev => [...prev, aiMsg]);
      
      if (response.data.action === 'CREATE_PAYMENT') setShowPaymentModal(true);
      if (response.data.action === 'GENERATE_KEY') setShowKeyModal(true);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    try {
      await apiClient.post('/payments', { amount: 50000, accountId });
      setShowPaymentModal(false);
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'system', content: "Payment successful.", timestamp: new Date() }]);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const generateNewKey = async (label: string) => {
    try {
      const res = await apiClient.post('/keys', { label, accountId });
      setVaultKeys(prev => [...prev, res.data]);
      setShowKeyModal(false);
    } catch (err) {
      console.error("Key generation failed", err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-cyan-500 font-mono">
        <RefreshCw className="animate-spin mb-4" size={48} />
        <Typography variant="body">INITIALIZING_QUANTUM_CORE...</Typography>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Typography variant="h1" className="text-white">{account?.name || 'QUANTUM_VAULT'}</Typography>
          <Typography variant="caption" className="text-slate-400">ID: {accountId}</Typography>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowPaymentModal(true)} className="bg-cyan-600 px-6 py-3 rounded-xl font-bold text-white">INJECT LIQUIDITY</button>
          <button onClick={() => setShowVault(!showVault)} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold">
            {showVault ? 'CLOSE VAULT' : 'OPEN VAULT'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex gap-1 bg-white/5 p-1 rounded-2xl w-fit">
            {(['overview', 'analytics', 'security', 'audit'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-xs font-black uppercase ${activeTab === tab ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <Card title="Available Liquidity">
                <Typography variant="h2" className="text-white">${(account?.balance || 0).toLocaleString()}</Typography>
              </Card>
              <Card title="Liquidity Flux" icon={<Activity className="text-cyan-500" />}>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="date" hide />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a' }} />
                      <Area type="monotone" dataKey="balance" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <Card title="Quantum Vault Storage" icon={<Lock />}>
              {vaultKeys.map(key => (
                <div key={key.id} className="flex justify-between p-4 bg-black/40 border border-white/5 rounded-2xl">
                  <div>
                    <Typography variant="body" className="font-bold">{key.label}</Typography>
                    <Typography variant="caption" className="font-mono">{key.cipher.substring(0, 20)}...</Typography>
                  </div>
                  <button onClick={() => setVaultKeys(prev => prev.filter(k => k.id !== key.id))}><Trash2 size={18} /></button>
                </div>
              ))}
              <button onClick={() => setShowKeyModal(true)} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl mt-4">
                <Plus size={18} /> GENERATE NEW KEY
              </button>
            </Card>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-black border border-cyan-500/30 rounded-3xl h-[700px] flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <Cpu className="text-cyan-500" />
              <Typography variant="h4" className="text-white">Nexus AI Pilot</Typography>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-white/5'}`}>
                  <Typography variant="body" className="text-white">{msg.content}</Typography>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); askAI(); }} className="p-4 border-t border-white/10">
              <input value={userInput} onChange={(e) => setUserInput(e.target.value)} className="w-full bg-white/5 p-4 rounded-xl" placeholder="Ask the Pilot..." />
            </form>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 p-8 rounded-[2rem] w-full max-w-md">
            <Typography variant="h3" className="text-white mb-4">Inject Liquidity</Typography>
            <form onSubmit={handleStripePayment} className="space-y-4">
              <input type="number" defaultValue="50000" className="w-full bg-black p-4 rounded-xl" />
              <button type="submit" className="w-full py-4 bg-cyan-500 rounded-xl font-bold">CONFIRM</button>
            </form>
          </div>
        </div>
      )}

      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 p-8 rounded-[2rem] w-full max-w-md">
            <Typography variant="h3" className="text-white mb-4">Generate Key</Typography>
            <input id="keyLabel" placeholder="Label" className="w-full bg-black p-4 rounded-xl mb-4" />
            <button onClick={() => generateNewKey((document.getElementById('keyLabel') as HTMLInputElement).value)} className="w-full py-4 bg-indigo-500 rounded-xl font-bold">GENERATE</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/AccountDetails.tsx
================================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback, useReducer, createContext, useContext } from 'react';

/**
 * THE OPEN SOURCE UNIVERSE FORGE
 * 
 * A self-contained, dependency-free simulation of the global open-source ecosystem.
 * Expanded from the DNA of a simple AccountDetails component.
 * 
 * @system Version: 10.0.0-ALPHA
 * @codename: OMNIVERSE_LEDGER
 * @license: MIT (Simulated)
 */

// ==========================================
// SECTION 1: CORE UTILITIES & MATH ENGINE
// ==========================================

const UUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const Random = {
  float: (min: number, max: number) => Math.random() * (max - min) + min,
  int: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min),
  choice: <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
  bool: (chance: number = 0.5) => Math.random() < chance,
  date: (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
  series: (length: number, generator: (i: number) => any) => Array.from({ length }, (_, i) => generator(i)),
};

const Color = {
  hexToRgba: (hex: string, alpha: number = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  lerp: (start: string, end: string, t: number) => {
    // Simple linear interpolation for colors would go here
    return end; 
  },
  theme: {
    primary: '#3b82f6',
    secondary: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    dark: '#111827',
    light: '#f3f4f6',
    surface: '#ffffff',
    border: '#e5e7eb',
    text: '#374151',
    textMuted: '#9ca3af',
  }
};

const Time = {
  now: () => Math.floor(Date.now() / 1000),
  format: (timestamp: number, fmt: string = 'YYYY-MM-DD') => {
    const d = new Date(timestamp * 1000);
    const map: Record<string, string> = {
      YYYY: d.getFullYear().toString(),
      MM: String(d.getMonth() + 1).padStart(2, '0'),
      DD: String(d.getDate()).padStart(2, '0'),
      HH: String(d.getHours()).padStart(2, '0'),
      mm: String(d.getMinutes()).padStart(2, '0'),
      ss: String(d.getSeconds()).padStart(2, '0'),
    };
    return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, matched => map[matched]);
  },
  ago: (timestamp: number) => {
    const diff = Time.now() - timestamp;
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
};

// ==========================================
// SECTION 2: DATA STRUCTURES & TYPES
// ==========================================

type Currency = 'USD' | 'EUR' | 'BTC' | 'ETH' | 'CREDITS' | 'CONTRIB';

interface EntityIdentity {
  id: string;
  name: string;
  type: 'foundation' | 'corporation' | 'community' | 'protocol' | 'tool';
  domain: string;
  founded: number;
  reputation: number;
  tier: 'S' | 'A' | 'B' | 'C';
}

interface FinancialSnapshot {
  balance: number;
  currency: Currency;
  burnRate: number;
  revenue: number;
  lastAudit: number;
}

interface CodeMetrics {
  linesOfCode: number;
  contributors: number;
  stars: number;
  forks: number;
  issuesOpen: number;
  issuesClosed: number;
  velocity: number; // commits per week
}

interface APIMetrics {
  uptime: number;
  latency: number;
  requestsPerSecond: number;
  errorRate: number;
  activeConnections: number;
}

interface SimulatedNode {
  id: string;
  identity: EntityIdentity;
  finance: FinancialSnapshot;
  code: CodeMetrics;
  api: APIMetrics;
  logs: string[];
}

interface TransactionRecord {
  id: string;
  sourceId: string;
  targetId: string;
  amount: number;
  currency: Currency;
  timestamp: number;
  type: 'grant' | 'donation' | 'service_fee' | 'cloud_cost' | 'bounty';
  status: 'pending' | 'completed' | 'failed';
  hash: string;
}

// ==========================================
// SECTION 3: THE 100 API SIMULATIONS
// ==========================================

/**
 * Base class for all simulated Open Source APIs.
 * This replaces the simple "fetchAccountDetails" with a robust object-oriented system.
 */
abstract class OpenSourceProvider {
  public readonly id: string;
  public readonly name: string;
  protected state: SimulatedNode;
  protected history: TransactionRecord[] = [];

  constructor(name: string, type: EntityIdentity['type'], domain: string) {
    this.id = UUID();
    this.name = name;
    this.state = {
      id: this.id,
      identity: {
        id: this.id,
        name: name,
        type: type,
        domain: domain,
        founded: Time.now() - Random.int(31536000, 31536000 * 20),
        reputation: Random.int(50, 100),
        tier: Random.choice(['S', 'A', 'B']),
      },
      finance: {
        balance: Random.float(10000, 50000000),
        currency: 'USD',
        burnRate: Random.float(1000, 50000),
        revenue: Random.float(2000, 100000),
        lastAudit: Time.now() - Random.int(0, 86400 * 30),
      },
      code: {
        linesOfCode: Random.int(5000, 50000000),
        contributors: Random.int(10, 5000),
        stars: Random.int(100, 200000),
        forks: Random.int(50, 50000),
        issuesOpen: Random.int(0, 5000),
        issuesClosed: Random.int(100, 50000),
        velocity: Random.float(0.1, 50),
      },
      api: {
        uptime: 99.9 + Random.float(0, 0.09),
        latency: Random.int(10, 200),
        requestsPerSecond: Random.int(10, 10000),
        errorRate: Random.float(0, 0.05),
        activeConnections: Random.int(5, 5000),
      },
      logs: [],
    };
    this.generateHistory();
  }

  private generateHistory() {
    const count = Random.int(20, 100);
    for (let i = 0; i < count; i++) {
      this.history.push({
        id: UUID(),
        sourceId: Random.bool() ? this.id : UUID(),
        targetId: Random.bool() ? UUID() : this.id,
        amount: Random.float(10, 5000),
        currency: 'USD',
        timestamp: Time.now() - (i * 86400),
        type: Random.choice(['grant', 'donation', 'service_fee', 'cloud_cost']),
        status: 'completed',
        hash: UUID().split('-')[0],
      });
    }
  }

  // Public API Methods
  public async getDetails(): Promise<SimulatedNode> {
    await this.simulateNetworkDelay();
    return { ...this.state };
  }

  public async getTransactions(limit: number = 50): Promise<TransactionRecord[]> {
    await this.simulateNetworkDelay();
    return this.history.slice(0, limit);
  }

  public async getMetrics(): Promise<APIMetrics> {
    await this.simulateNetworkDelay();
    // Fluctuate metrics slightly
    this.state.api.activeConnections += Random.int(-10, 10);
    this.state.api.latency += Random.int(-5, 5);
    return this.state.api;
  }

  public async healthCheck(): Promise<{ status: string; timestamp: number }> {
    return { status: 'healthy', timestamp: Time.now() };
  }

  protected async simulateNetworkDelay() {
    const delay = this.state.api.latency + Random.int(0, 50);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// --- Specific Implementations for the 100 Entities ---

class LinuxFoundationAPI extends OpenSourceProvider { constructor() { super('Linux Foundation', 'foundation', 'linuxfoundation.org'); } }
class CanonicalAPI extends OpenSourceProvider { constructor() { super('Canonical', 'corporation', 'ubuntu.com'); } }
class RedHatAPI extends OpenSourceProvider { constructor() { super('Red Hat', 'corporation', 'redhat.com'); } }
class FedoraProjectAPI extends OpenSourceProvider { constructor() { super('Fedora Project', 'community', 'fedoraproject.org'); } }
class DebianProjectAPI extends OpenSourceProvider { constructor() { super('Debian Project', 'community', 'debian.org'); } }
class OpenSUSEAPI extends OpenSourceProvider { constructor() { super('OpenSUSE', 'community', 'opensuse.org'); } }
class ArchLinuxAPI extends OpenSourceProvider { constructor() { super('Arch Linux', 'community', 'archlinux.org'); } }
class ManjaroAPI extends OpenSourceProvider { constructor() { super('Manjaro', 'corporation', 'manjaro.org'); } }
class FreeBSDAPI extends OpenSourceProvider { constructor() { super('FreeBSD', 'foundation', 'freebsd.org'); } }
class NetBSDAPI extends OpenSourceProvider { constructor() { super('NetBSD', 'foundation', 'netbsd.org'); } }
class OpenBSDAPI extends OpenSourceProvider { constructor() { super('OpenBSD', 'foundation', 'openbsd.org'); } }
class KubernetesAPI extends OpenSourceProvider { constructor() { super('Kubernetes', 'community', 'kubernetes.io'); } }
class CNCFAPI extends OpenSourceProvider { constructor() { super('CNCF', 'foundation', 'cncf.io'); } }
class DockerAPI extends OpenSourceProvider { constructor() { super('Docker', 'corporation', 'docker.com'); } }
class PodmanAPI extends OpenSourceProvider { constructor() { super('Podman', 'community', 'podman.io'); } }
class AnsibleAPI extends OpenSourceProvider { constructor() { super('Ansible', 'community', 'ansible.com'); } }
class TerraformAPI extends OpenSourceProvider { constructor() { super('Terraform', 'tool', 'terraform.io'); } }
class HashiCorpAPI extends OpenSourceProvider { constructor() { super('HashiCorp', 'corporation', 'hashicorp.com'); } }
class ApacheFoundationAPI extends OpenSourceProvider { constructor() { super('Apache Foundation', 'foundation', 'apache.org'); } }
class NGINXAPI extends OpenSourceProvider { constructor() { super('NGINX', 'tool', 'nginx.org'); } }
class MozillaAPI extends OpenSourceProvider { constructor() { super('Mozilla', 'foundation', 'mozilla.org'); } }
class FirefoxDevToolsAPI extends OpenSourceProvider { constructor() { super('Firefox DevTools', 'tool', 'firefox-dev.tools'); } }
class GitAPI extends OpenSourceProvider { constructor() { super('Git', 'tool', 'git-scm.com'); } }
class GitHubAPI extends OpenSourceProvider { constructor() { super('GitHub', 'corporation', 'github.com'); } }
class GitLabAPI extends OpenSourceProvider { constructor() { super('GitLab', 'corporation', 'gitlab.com'); } }
class BitbucketAPI extends OpenSourceProvider { constructor() { super('Bitbucket', 'corporation', 'bitbucket.org'); } }
class VSCodeAPI extends OpenSourceProvider { constructor() { super('VS Code', 'tool', 'code.visualstudio.com'); } }
class EclipseFoundationAPI extends OpenSourceProvider { constructor() { super('Eclipse Foundation', 'foundation', 'eclipse.org'); } }
class JetBrainsAPI extends OpenSourceProvider { constructor() { super('JetBrains', 'corporation', 'jetbrains.com'); } }
class PythonFoundationAPI extends OpenSourceProvider { constructor() { super('Python Software Foundation', 'foundation', 'python.org'); } }
class NodeFoundationAPI extends OpenSourceProvider { constructor() { super('Node.js Foundation', 'foundation', 'nodejs.org'); } }
class DenoAPI extends OpenSourceProvider { constructor() { super('Deno', 'corporation', 'deno.land'); } }
class BunAPI extends OpenSourceProvider { constructor() { super('Bun', 'corporation', 'bun.sh'); } }
class RustFoundationAPI extends OpenSourceProvider { constructor() { super('Rust Foundation', 'foundation', 'rust-lang.org'); } }
class GoLangAPI extends OpenSourceProvider { constructor() { super('GoLang', 'community', 'go.dev'); } }
class RubyAPI extends OpenSourceProvider { constructor() { super('Ruby', 'community', 'ruby-lang.org'); } }
class PHPAPI extends OpenSourceProvider { constructor() { super('PHP', 'community', 'php.net'); } }
class MariaDBAPI extends OpenSourceProvider { constructor() { super('MariaDB', 'foundation', 'mariadb.org'); } }
class MySQLAPI extends OpenSourceProvider { constructor() { super('MySQL', 'corporation', 'mysql.com'); } }
class PostgreSQLAPI extends OpenSourceProvider { constructor() { super('PostgreSQL', 'community', 'postgresql.org'); } }
class SQLiteAPI extends OpenSourceProvider { constructor() { super('SQLite', 'community', 'sqlite.org'); } }
class RedisAPI extends OpenSourceProvider { constructor() { super('Redis', 'corporation', 'redis.io'); } }
class MongoDBAPI extends OpenSourceProvider { constructor() { super('MongoDB', 'corporation', 'mongodb.com'); } }
class CassandraAPI extends OpenSourceProvider { constructor() { super('Cassandra', 'community', 'cassandra.apache.org'); } }
class ElasticSearchAPI extends OpenSourceProvider { constructor() { super('ElasticSearch', 'corporation', 'elastic.co'); } }
class ApacheSparkAPI extends OpenSourceProvider { constructor() { super('Apache Spark', 'community', 'spark.apache.org'); } }
class ApacheKafkaAPI extends OpenSourceProvider { constructor() { super('Apache Kafka', 'community', 'kafka.apache.org'); } }
class SupabaseAPI extends OpenSourceProvider { constructor() { super('Supabase', 'corporation', 'supabase.com'); } }
class AppwriteAPI extends OpenSourceProvider { constructor() { super('Appwrite', 'corporation', 'appwrite.io'); } }
class PocketBaseAPI extends OpenSourceProvider { constructor() { super('PocketBase', 'community', 'pocketbase.io'); } }
class HuggingFaceAPI extends OpenSourceProvider { constructor() { super('Hugging Face', 'corporation', 'huggingface.co'); } }
class LangChainAPI extends OpenSourceProvider { constructor() { super('LangChain', 'corporation', 'langchain.com'); } }
class MLFlowAPI extends OpenSourceProvider { constructor() { super('MLFlow', 'community', 'mlflow.org'); } }
class TensorFlowAPI extends OpenSourceProvider { constructor() { super('TensorFlow', 'community', 'tensorflow.org'); } }
class PyTorchAPI extends OpenSourceProvider { constructor() { super('PyTorch', 'foundation', 'pytorch.org'); } }
class ONNXAPI extends OpenSourceProvider { constructor() { super('ONNX', 'community', 'onnx.ai'); } }
class OpenCVAPI extends OpenSourceProvider { constructor() { super('OpenCV', 'foundation', 'opencv.org'); } }
class OpenAIGymAPI extends OpenSourceProvider { constructor() { super('OpenAI Gym', 'tool', 'gym.openai.com'); } }
class GodotEngineAPI extends OpenSourceProvider { constructor() { super('Godot Engine', 'foundation', 'godotengine.org'); } }
class BlenderFoundationAPI extends OpenSourceProvider { constructor() { super('Blender Foundation', 'foundation', 'blender.org'); } }
class InkscapeAPI extends OpenSourceProvider { constructor() { super('Inkscape', 'community', 'inkscape.org'); } }
class GIMPAPI extends OpenSourceProvider { constructor() { super('GIMP', 'community', 'gimp.org'); } }
class KritaAPI extends OpenSourceProvider { constructor() { super('Krita', 'foundation', 'krita.org'); } }
class FigmaOpenAPI extends OpenSourceProvider { constructor() { super('Figma Open', 'corporation', 'figma.com'); } }
class UnrealOpenToolsAPI extends OpenSourceProvider { constructor() { super('Unreal Open Tools', 'corporation', 'unrealengine.com'); } }
class UnityOpenToolsAPI extends OpenSourceProvider { constructor() { super('Unity Open Tools', 'corporation', 'unity.com'); } }
class OpenStreetMapAPI extends OpenSourceProvider { constructor() { super('OpenStreetMap', 'foundation', 'openstreetmap.org'); } }
class QGISAPI extends OpenSourceProvider { constructor() { super('QGIS', 'community', 'qgis.org'); } }
class MapLibreAPI extends OpenSourceProvider { constructor() { super('MapLibre', 'community', 'maplibre.org'); } }
class LeafletAPI extends OpenSourceProvider { constructor() { super('Leaflet.js', 'community', 'leafletjs.com'); } }
class VLCAPI extends OpenSourceProvider { constructor() { super('VLC', 'foundation', 'videolan.org'); } }
class FFmpegAPI extends OpenSourceProvider { constructor() { super('FFmpeg', 'community', 'ffmpeg.org'); } }
class OBSStudioAPI extends OpenSourceProvider { constructor() { super('OBS Studio', 'community', 'obsproject.com'); } }
class WireGuardAPI extends OpenSourceProvider { constructor() { super('WireGuard', 'protocol', 'wireguard.com'); } }
class OpenVPNAPI extends OpenSourceProvider { constructor() { super('OpenVPN', 'corporation', 'openvpn.net'); } }
class TorProjectAPI extends OpenSourceProvider { constructor() { super('Tor Project', 'foundation', 'torproject.org'); } }
class DuckDBAPI extends OpenSourceProvider { constructor() { super('DuckDB', 'corporation', 'duckdb.org'); } }
class ClickHouseAPI extends OpenSourceProvider { constructor() { super('ClickHouse', 'corporation', 'clickhouse.com'); } }
class MinIOAPI extends OpenSourceProvider { constructor() { super('MinIO', 'corporation', 'min.io'); } }
class CephAPI extends OpenSourceProvider { constructor() { super('Ceph', 'foundation', 'ceph.io'); } }
class OpenStackAPI extends OpenSourceProvider { constructor() { super('OpenStack', 'foundation', 'openstack.org'); } }
class ProxmoxAPI extends OpenSourceProvider { constructor() { super('Proxmox', 'corporation', 'proxmox.com'); } }
class HomeAssistantAPI extends OpenSourceProvider { constructor() { super('Home Assistant', 'community', 'home-assistant.io'); } }
class OpenHABAPI extends OpenSourceProvider { constructor() { super('OpenHAB', 'foundation', 'openhab.org'); } }
class MatterProtocolAPI extends OpenSourceProvider { constructor() { super('Matter', 'protocol', 'csa-iot.org'); } }
class ZigbeeAPI extends OpenSourceProvider { constructor() { super('Zigbee', 'protocol', 'zigbee.org'); } }
class TensorRTAPI extends OpenSourceProvider { constructor() { super('TensorRT', 'tool', 'developer.nvidia.com'); } }
class LLVMAPI extends OpenSourceProvider { constructor() { super('LLVM', 'foundation', 'llvm.org'); } }
class WebKitAPI extends OpenSourceProvider { constructor() { super('WebKit', 'community', 'webkit.org'); } }
class ChromiumAPI extends OpenSourceProvider { constructor() { super('Chromium', 'community', 'chromium.org'); } }
class UBlockOriginAPI extends OpenSourceProvider { constructor() { super('uBlock Origin', 'tool', 'ublockorigin.com'); } }
class BraveShieldsAPI extends OpenSourceProvider { constructor() { super('Brave Shields', 'tool', 'brave.com'); } }
class NextcloudAPI extends OpenSourceProvider { constructor() { super('Nextcloud', 'corporation', 'nextcloud.com'); } }
class OwnCloudAPI extends OpenSourceProvider { constructor() { super('OwnCloud', 'corporation', 'owncloud.com'); } }
class MastodonAPI extends OpenSourceProvider { constructor() { super('Mastodon', 'foundation', 'joinmastodon.org'); } }
class MatrixAPI extends OpenSourceProvider { constructor() { super('Matrix', 'protocol', 'matrix.org'); } }
class SignalAPI extends OpenSourceProvider { constructor() { super('Signal', 'foundation', 'signal.org'); } }
class ApacheAirflowAPI extends OpenSourceProvider { constructor() { super('Apache Airflow', 'community', 'airflow.apache.org'); } }
class JenkinsAPI extends OpenSourceProvider { constructor() { super('Jenkins', 'community', 'jenkins.io'); } }
class DroneCIAPI extends OpenSourceProvider { constructor() { super('DroneCI', 'corporation', 'drone.io'); } }

// ==========================================
// SECTION 4: THE UNIVERSE REGISTRY
// ==========================================

class UniverseRegistry {
  private static instance: UniverseRegistry;
  private providers: Map<string, OpenSourceProvider> = new Map();
  private providerList: OpenSourceProvider[] = [];

  private constructor() {
    this.registerAll();
  }

  public static getInstance(): UniverseRegistry {
    if (!UniverseRegistry.instance) {
      UniverseRegistry.instance = new UniverseRegistry();
    }
    return UniverseRegistry.instance;
  }

  private registerAll() {
    const classes = [
      LinuxFoundationAPI, CanonicalAPI, RedHatAPI, FedoraProjectAPI, DebianProjectAPI, OpenSUSEAPI, ArchLinuxAPI, ManjaroAPI, FreeBSDAPI, NetBSDAPI, OpenBSDAPI,
      KubernetesAPI, CNCFAPI, DockerAPI, PodmanAPI, AnsibleAPI, TerraformAPI, HashiCorpAPI, ApacheFoundationAPI, NGINXAPI, MozillaAPI, FirefoxDevToolsAPI,
      GitAPI, GitHubAPI, GitLabAPI, BitbucketAPI, VSCodeAPI, EclipseFoundationAPI, JetBrainsAPI, PythonFoundationAPI, NodeFoundationAPI, DenoAPI, BunAPI,
      RustFoundationAPI, GoLangAPI, RubyAPI, PHPAPI, MariaDBAPI, MySQLAPI, PostgreSQLAPI, SQLiteAPI, RedisAPI, MongoDBAPI, CassandraAPI, ElasticSearchAPI,
      ApacheSparkAPI, ApacheKafkaAPI, SupabaseAPI, AppwriteAPI, PocketBaseAPI, HuggingFaceAPI, LangChainAPI, MLFlowAPI, TensorFlowAPI, PyTorchAPI, ONNXAPI,
      OpenCVAPI, OpenAIGymAPI, GodotEngineAPI, BlenderFoundationAPI, InkscapeAPI, GIMPAPI, KritaAPI, FigmaOpenAPI, UnrealOpenToolsAPI, UnityOpenToolsAPI,
      OpenStreetMapAPI, QGISAPI, MapLibreAPI, LeafletAPI, VLCAPI, FFmpegAPI, OBSStudioAPI, WireGuardAPI, OpenVPNAPI, TorProjectAPI, DuckDBAPI, ClickHouseAPI,
      MinIOAPI, CephAPI, OpenStackAPI, ProxmoxAPI, HomeAssistantAPI, OpenHABAPI, MatterProtocolAPI, ZigbeeAPI, TensorRTAPI, LLVMAPI, WebKitAPI, ChromiumAPI,
      UBlockOriginAPI, BraveShieldsAPI, NextcloudAPI, OwnCloudAPI, MastodonAPI, MatrixAPI, SignalAPI, ApacheAirflowAPI, JenkinsAPI, DroneCIAPI
    ];

    classes.forEach(Cls => {
      const instance = new Cls();
      this.providers.set(instance.id, instance);
      this.providerList.push(instance);
    });
  }

  public getAll(): OpenSourceProvider[] {
    return this.providerList;
  }

  public get(id: string): OpenSourceProvider | undefined {
    return this.providers.get(id);
  }

  public search(query: string): OpenSourceProvider[] {
    const q = query.toLowerCase();
    return this.providerList.filter(p => p.name.toLowerCase().includes(q));
  }
}

// ==========================================
// SECTION 5: CUSTOM UI ENGINE (NO EXTERNAL LIBS)
// ==========================================

// --- SVG Charting Engine ---

const ChartEngine = {
  createPath: (data: number[], width: number, height: number) => {
    if (data.length === 0) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    
    const points = data.map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  },
  
  createAreaPath: (data: number[], width: number, height: number) => {
    const linePath = ChartEngine.createPath(data, width, height);
    return `${linePath} L ${width},${height} L 0,${height} Z`;
  }
};

// --- UI Components ---

const Box: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }> = ({ children, className, style, onClick }) => (
  <div onClick={onClick} className={className} style={style}>{children}</div>
);

const Text: React.FC<{ children: React.ReactNode; size?: number; weight?: number; color?: string; className?: string }> = ({ children, size = 14, weight = 400, color = Color.theme.text, className }) => (
  <span className={className} style={{ fontSize: size, fontWeight: weight, color, fontFamily: 'Inter, system-ui, sans-serif' }}>{children}</span>
);

const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; disabled?: boolean }> = ({ children, onClick, variant = 'primary', disabled }) => {
  const baseStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    fontWeight: 600,
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const variants = {
    primary: { backgroundColor: Color.theme.primary, color: '#fff' },
    secondary: { backgroundColor: Color.theme.light, color: Color.theme.text },
    ghost: { backgroundColor: 'transparent', color: Color.theme.primary },
  };

  return (
    <button onClick={onClick} disabled={disabled} style={{ ...baseStyle, ...variants[variant] }}>
      {children}
    </button>
  );
};

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = Color.theme.primary }) => (
  <span style={{
    backgroundColor: Color.hexToRgba(color, 0.1),
    color: color,
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    border: `1px solid ${Color.hexToRgba(color, 0.2)}`
  }}>
    {children}
  </span>
);

const Card: React.FC<{ children: React.ReactNode; title?: string; action?: React.ReactNode }> = ({ children, title, action }) => (
  <div style={{
    backgroundColor: Color.theme.surface,
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: `1px solid ${Color.theme.border}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }}>
    {(title || action) && (
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${Color.theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
        {title && <Text size={16} weight={600}>{title}</Text>}
        {action}
      </div>
    )}
    <div style={{ padding: '20px' }}>
      {children}
    </div>
  </div>
);

const Grid: React.FC<{ children: React.ReactNode; cols?: number; gap?: number }> = ({ children, cols = 1, gap = 16 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${gap}px` }}>
    {children}
  </div>
);

const Flex: React.FC<{ children: React.ReactNode; dir?: 'row' | 'column'; gap?: number; align?: 'center' | 'start' | 'end' | 'stretch'; justify?: 'center' | 'start' | 'end' | 'space-between'; style?: React.CSSProperties }> = ({ children, dir = 'row', gap = 8, align = 'stretch', justify = 'start', style }) => (
  <div style={{ display: 'flex', flexDirection: dir, gap: `${gap}px`, alignItems: align, justifyContent: justify, ...style }}>
    {children}
  </div>
);

// --- Custom Icons (SVG) ---

const Icons = {
  Server: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>,
  Code: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
  Dollar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  Activity: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  ArrowRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
  Refresh: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
};

// ==========================================
// SECTION 6: APPLICATION LOGIC & STATE
// ==========================================

// --- Contexts ---

const UniverseContext = createContext<{
  registry: UniverseRegistry;
  selectedEntity: SimulatedNode | null;
  selectEntity: (id: string) => void;
  globalStats: { totalCapital: number; totalCode: number; activeNodes: number };
}>({
  registry: UniverseRegistry.getInstance(),
  selectedEntity: null,
  selectEntity: () => {},
  globalStats: { totalCapital: 0, totalCode: 0, activeNodes: 0 }
});

// --- Hooks ---

const useEntityData = (provider: OpenSourceProvider) => {
  const [data, setData] = useState<SimulatedNode | null>(null);
  const [history, setHistory] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [d, h] = await Promise.all([provider.getDetails(), provider.getTransactions()]);
    setData(d);
    setHistory(h);
    setLoading(false);
  }, [provider]);

  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      // Live update simulation
      provider.getMetrics().then(() => {
        // In a real app, this would trigger a re-render if we stored metrics separately
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [refresh, provider]);

  return { data, history, loading, refresh };
};

// ==========================================
// SECTION 7: SUB-COMPONENTS (The "Apps")
// ==========================================

// 1. The Entity Explorer (Sidebar)
const EntityExplorer: React.FC = () => {
  const { registry, selectEntity, selectedEntity } = useContext(UniverseContext);
  const [filter, setFilter] = useState('');
  
  const entities = useMemo(() => registry.search(filter), [registry, filter]);

  return (
    <div style={{ width: '300px', borderRight: `1px solid ${Color.theme.border}`, display: 'flex', flexDirection: 'column', backgroundColor: '#fff', height: '100%' }}>
      <div style={{ padding: '16px', borderBottom: `1px solid ${Color.theme.border}` }}>
        <Text size={18} weight={700} color={Color.theme.dark}>Universe Explorer</Text>
        <div style={{ marginTop: '12px', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search 100+ APIs..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '6px', border: `1px solid ${Color.theme.border}`, outline: 'none' }}
          />
          <div style={{ position: 'absolute', left: '10px', top: '8px', color: '#999' }}><Icons.Search /></div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {entities.map(entity => (
          <div 
            key={entity.id}
            onClick={() => selectEntity(entity.id)}
            style={{ 
              padding: '12px 16px', 
              cursor: 'pointer', 
              borderBottom: `1px solid ${Color.theme.light}`,
              backgroundColor: selectedEntity?.id === entity.id ? '#eff6ff' : 'transparent',
              borderLeft: selectedEntity?.id === entity.id ? `4px solid ${Color.theme.primary}` : '4px solid transparent'
            }}
          >
            <Text weight={600} size={14} color={Color.theme.dark} style={{ display: 'block' }}>{entity.name}</Text>
            <Text size={12} color={Color.theme.textMuted}>{entity.name.toLowerCase().replace(/\s/g, '')}.org</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. The Account Details View (The Core Transformation)
const AccountDetailsView: React.FC<{ provider: OpenSourceProvider }> = ({ provider }) => {
  const { data, history, loading, refresh } = useEntityData(provider);

  if (loading || !data) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: `4px solid ${Color.theme.light}`, borderTop: `4px solid ${Color.theme.primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <Text color={Color.theme.textMuted}>Connecting to {provider.name} Node...</Text>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Generate chart data from history
  const chartData = history.map(h => h.amount).reverse();
  const balanceHistory = history.reduce((acc, curr) => {
    const last = acc.length > 0 ? acc[acc.length - 1] : data.finance.balance;
    acc.push(last + (curr.amount * (Math.random() > 0.5 ? 1 : -1))); // Simulate fluctuation
    return acc;
  }, [] as number[]);

  return (
    <div style={{ padding: '32px', overflowY: 'auto', height: '100%', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: '32px' }}>
        <div>
          <Flex align="center" gap={12}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: Color.theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
              {data.identity.name.charAt(0)}
            </div>
            <div>
              <Text size={24} weight={700} color={Color.theme.dark} style={{ display: 'block' }}>{data.identity.name}</Text>
              <Flex gap={8} align="center">
                <Badge color={Color.theme.secondary}>{data.identity.type.toUpperCase()}</Badge>
                <Text size={14} color={Color.theme.textMuted}>ID: {data.identity.id.split('-')[0]}</Text>
              </Flex>
            </div>
          </Flex>
        </div>
        <Flex gap={12}>
          <Button variant="secondary" onClick={refresh}><Icons.Refresh /> Sync Node</Button>
          <Button variant="primary">Connect Wallet</Button>
        </Flex>
      </Flex>

      {/* Key Metrics Grid */}
      <Grid cols={3} gap={24}>
        <Card>
          <Flex align="center" gap={12} style={{ marginBottom: '8px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#eff6ff', color: Color.theme.primary }}><Icons.Dollar /></div>
            <Text color={Color.theme.textMuted} weight={600}>Treasury Balance</Text>
          </Flex>
          <Text size={32} weight={700} color={Color.theme.dark}>${data.finance.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
          <Text size={12} color={data.finance.revenue > data.finance.burnRate ? Color.theme.secondary : Color.theme.danger}>
            {data.finance.revenue > data.finance.burnRate ? '+' : '-'}${Math.abs(data.finance.revenue - data.finance.burnRate).toLocaleString()} / mo net
          </Text>
        </Card>

        <Card>
          <Flex align="center" gap={12} style={{ marginBottom: '8px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: Color.theme.secondary }}><Icons.Code /></div>
            <Text color={Color.theme.textMuted} weight={600}>Code Velocity</Text>
          </Flex>
          <Text size={32} weight={700} color={Color.theme.dark}>{data.code.velocity.toFixed(1)}</Text>
          <Text size={12} color={Color.theme.textMuted}>commits per week</Text>
          <div style={{ marginTop: '12px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(data.code.velocity * 2, 100)}%`, height: '100%', backgroundColor: Color.theme.secondary }}></div>
          </div>
        </Card>

        <Card>
          <Flex align="center" gap={12} style={{ marginBottom: '8px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fef3c7', color: Color.theme.warning }}><Icons.Server /></div>
            <Text color={Color.theme.textMuted} weight={600}>API Health</Text>
          </Flex>
          <Text size={32} weight={700} color={Color.theme.dark}>{data.api.uptime.toFixed(3)}%</Text>
          <Text size={12} color={Color.theme.textMuted}>{data.api.latency}ms latency</Text>
        </Card>
      </Grid>

      {/* Main Content Area */}
      <Grid cols={3} gap={24} style={{ marginTop: '24px' }}>
        {/* Chart Section */}
        <div style={{ gridColumn: 'span 2' }}>
          <Card title="Financial Performance (90 Days)">
            <div style={{ height: '300px', width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '20px 0' }}>
              {/* Y-Axis Labels */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: '#9ca3af' }}>
                <span>Max</span>
                <span>Avg</span>
                <span>Min</span>
              </div>
              {/* Chart Area */}
              <div style={{ marginLeft: '40px', flex: 1, height: '100%', position: 'relative' }}>
                {/* Grid Lines */}
                <div style={{ position: 'absolute', top: '0%', width: '100%', height: '1px', backgroundColor: '#f3f4f6' }}></div>
                <div style={{ position: 'absolute', top: '50%', width: '100%', height: '1px', backgroundColor: '#f3f4f6' }}></div>
                <div style={{ position: 'absolute', top: '100%', width: '100%', height: '1px', backgroundColor: '#f3f4f6' }}></div>
                
                {/* The SVG Chart */}
                <svg width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={Color.theme.primary} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={Color.theme.primary} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d={ChartEngine.createAreaPath(balanceHistory, 600, 260)} 
                    fill="url(#chartGradient)" 
                  />
                  <path 
                    d={ChartEngine.createPath(balanceHistory, 600, 260)} 
                    fill="none" 
                    stroke={Color.theme.primary} 
                    strokeWidth="2" 
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <div style={{ marginTop: '24px' }}>
            <Card title="Recent Transactions">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {history.map((tx, i) => (
                  <div key={tx.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 0', 
                    borderBottom: i === history.length - 1 ? 'none' : `1px solid ${Color.theme.light}` 
                  }}>
                    <Flex gap={12} align="center">
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        backgroundColor: tx.type === 'donation' ? '#ecfdf5' : '#eff6ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: tx.type === 'donation' ? Color.theme.secondary : Color.theme.primary
                      }}>
                        {tx.type === 'donation' ? '+' : '→'}
                      </div>
                      <div>
                        <Text weight={600} size={14} style={{ display: 'block' }}>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</Text>
                        <Text size={12} color={Color.theme.textMuted}>{Time.ago(tx.timestamp)} • {tx.hash}</Text>
                      </div>
                    </Flex>
                    <Text weight={600} color={tx.type === 'donation' ? Color.theme.secondary : Color.theme.dark}>
                      {tx.type === 'donation' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card title="Ecosystem Stats">
            <Flex dir="column" gap={16}>
              <div>
                <Text size={12} color={Color.theme.textMuted}>Contributors</Text>
                <Text size={18} weight={600} style={{ display: 'block' }}>{data.code.contributors.toLocaleString()}</Text>
              </div>
              <div>
                <Text size={12} color={Color.theme.textMuted}>GitHub Stars</Text>
                <Text size={18} weight={600} style={{ display: 'block' }}>{data.code.stars.toLocaleString()}</Text>
              </div>
              <div>
                <Text size={12} color={Color.theme.textMuted}>Open Issues</Text>
                <Text size={18} weight={600} style={{ display: 'block' }}>{data.code.issuesOpen.toLocaleString()}</Text>
              </div>
            </Flex>
          </Card>

          <Card title="Infrastructure">
            <Flex dir="column" gap={12}>
              <Flex justify="space-between">
                <Text size={14}>Active Nodes</Text>
                <Text size={14} weight={600}>{data.api.activeConnections}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text size={14}>Error Rate</Text>
                <Text size={14} weight={600} color={data.api.errorRate > 0.01 ? Color.theme.danger : Color.theme.secondary}>
                  {(data.api.errorRate * 100).toFixed(2)}%
                </Text>
              </Flex>
              <div style={{ padding: '12px', backgroundColor: '#111827', borderRadius: '6px', color: '#10b981', fontFamily: 'monospace', fontSize: '12px' }}>
                &gt; sys_status: OK<br/>
                &gt; load_avg: 0.45<br/>
                &gt; mem_usage: 42%
              </div>
            </Flex>
          </Card>
        </div>
      </Grid>
    </div>
  );
};

// 3. The Global Dashboard (Default View)
const GlobalDashboard: React.FC = () => {
  const { registry } = useContext(UniverseContext);
  const providers = registry.getAll();
  
  // Calculate aggregates
  const totalCapital = providers.reduce((acc, p) => acc + (p as any).state.finance.balance, 0);
  const totalStars = providers.reduce((acc, p) => acc + (p as any).state.code.stars, 0);
  const totalContributors = providers.reduce((acc, p) => acc + (p as any).state.code.contributors, 0);

  return (
    <div style={{ padding: '40px', overflowY: 'auto', height: '100%', backgroundColor: '#f3f4f6' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Text size={36} weight={800} color={Color.theme.dark} style={{ display: 'block', marginBottom: '8px' }}>OPEN SOURCE UNIVERSE</Text>
        <Text size={16} color={Color.theme.textMuted}>Real-time simulation of {providers.length} decentralized entities</Text>
      </div>

      <Grid cols={3} gap={32}>
        <div style={{ backgroundColor: '#3b82f6', borderRadius: '16px', padding: '24px', color: 'white', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}>
          <Text size={14} color="rgba(255,255,255,0.8)">Total Ecosystem Value</Text>
          <Text size={42} weight={700} color="white" style={{ display: 'block', marginTop: '8px' }}>${(totalCapital / 1000000).toFixed(1)}M</Text>
        </div>
        <div style={{ backgroundColor: '#10b981', borderRadius: '16px', padding: '24px', color: 'white', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
          <Text size={14} color="rgba(255,255,255,0.8)">Total Stars</Text>
          <Text size={42} weight={700} color="white" style={{ display: 'block', marginTop: '8px' }}>{(totalStars / 1000000).toFixed(1)}M</Text>
        </div>
        <div style={{ backgroundColor: '#8b5cf6', borderRadius: '16px', padding: '24px', color: 'white', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)' }}>
          <Text size={14} color="rgba(255,255,255,0.8)">Active Contributors</Text>
          <Text size={42} weight={700} color="white" style={{ display: 'block', marginTop: '8px' }}>{(totalContributors / 1000).toFixed(1)}k</Text>
        </div>
      </Grid>

      <div style={{ marginTop: '40px' }}>
        <Text size={20} weight={700} color={Color.theme.dark} style={{ marginBottom: '20px', display: 'block' }}>Top Performing Nodes</Text>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${Color.theme.border}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: `1px solid ${Color.theme.border}` }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: Color.theme.textMuted, textTransform: 'uppercase' }}>Entity</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: Color.theme.textMuted, textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: Color.theme.textMuted, textTransform: 'uppercase' }}>Balance</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: Color.theme.textMuted, textTransform: 'uppercase' }}>Uptime</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: Color.theme.textMuted, textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {providers.slice(0, 10).map((p: any) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${Color.theme.light}` }}>
                  <td style={{ padding: '16px' }}>
                    <Flex align="center" gap={12}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: Color.theme.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: Color.theme.text }}>
                        {p.name.charAt(0)}
                      </div>
                      <Text weight={600}>{p.name}</Text>
                    </Flex>
                  </td>
                  <td style={{ padding: '16px' }}><Badge color={Color.theme.primary}>{p.state.identity.type}</Badge></td>
                  <td style={{ padding: '16px', textAlign: 'right' }}><Text font-family="monospace">${p.state.finance.balance.toLocaleString()}</Text></td>
                  <td style={{ padding: '16px', textAlign: 'right' }}><Text>{p.state.api.uptime.toFixed(2)}%</Text></td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SECTION 8: MAIN SYSTEM COMPONENT
// ==========================================

const AccountDetails: React.FC = () => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const registry = useMemo(() => UniverseRegistry.getInstance(), []);
  
  const selectedEntity = useMemo(() => 
    selectedEntityId ? registry.get(selectedEntityId)?.['state'] || null : null, 
  [selectedEntityId, registry]);

  const selectedProvider = useMemo(() => 
    selectedEntityId ? registry.get(selectedEntityId) : null,
  [selectedEntityId, registry]);

  const contextValue = {
    registry,
    selectedEntity,
    selectEntity: setSelectedEntityId,
    globalStats: { totalCapital: 0, totalCode: 0, activeNodes: 0 } // Placeholder for now
  };

  return (
    <UniverseContext.Provider value={contextValue}>
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        width: '100vw', 
        backgroundColor: '#fff', 
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        <EntityExplorer />

        {/* Main View */}
        <div style={{ flex: 1, height: '100%', position: 'relative' }}>
          {selectedProvider ? (
            <AccountDetailsView provider={selectedProvider} />
          ) : (
            <GlobalDashboard />
          )}
        </div>
      </div>
    </UniverseContext.Provider>
  );
};

export default AccountDetails;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/AccountDetails.tsx
================================================================================

import React, { useState, useEffect, useMemo, useContext, useRef, useCallback } from 'react';
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import Typography from './Typography';
import { apiClient } from '../lib/apiClient';
import { 
  Activity, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  Zap, 
  Cpu, 
  ArrowUpRight, 
  RefreshCw, 
  Terminal,
  Lock, 
  Key, 
  Plus,
  Trash2,
  CreditCard,
  ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  metadata: any;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'data';
}

interface EncryptedKey {
  id: string;
  label: string;
  cipher: string;
  checksum: string;
  createdAt: string;
}

interface AccountDetailsProps {
  customerId: string;
  accountId: string;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ customerId, accountId }) => {
  const context = useContext(DataContext);
  
  const [balanceHistory, setBalanceHistory] = useState<{ date: string; balance: number; volume: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [vaultKeys, setVaultKeys] = useState<EncryptedKey[]>([]);
  const [showVault, setShowVault] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'security' | 'audit'>('overview');
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const account = useMemo(() => {
    return context?.linkedAccounts?.find(a => a.id === accountId) || context?.linkedAccounts?.[0];
  }, [context, accountId]);

  const logAction = useCallback(async (action: string, severity: AuditEntry['severity'] = 'INFO', metadata: any = {}) => {
    try {
      const entry = await apiClient.post('/audit', { action, severity, metadata });
      setAuditTrail(prev => [entry.data, ...prev].slice(0, 100));
    } catch (err) {
      console.error("Audit logging failed", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, keysRes] = await Promise.all([
          apiClient.get(`/accounts/${accountId}/history`),
          apiClient.get(`/accounts/${accountId}/keys`)
        ]);
        setBalanceHistory(historyRes.data);
        setVaultKeys(keysRes.data);
        await logAction('ACCOUNT_VIEW_INITIALIZED', 'INFO', { accountId, customerId });
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accountId, customerId, logAction]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const askAI = async (customPrompt?: string) => {
    const input = customPrompt || userInput;
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    setUserInput("");
    setIsAiLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', { prompt: input, context: { accountId } });
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: response.data.text, timestamp: new Date() };
      setChatHistory(prev => [...prev, aiMsg]);
      
      if (response.data.action === 'CREATE_PAYMENT') setShowPaymentModal(true);
      if (response.data.action === 'GENERATE_KEY') setShowKeyModal(true);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    try {
      await apiClient.post('/payments', { amount: 50000, accountId });
      setShowPaymentModal(false);
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'system', content: "Payment successful.", timestamp: new Date() }]);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const generateNewKey = async (label: string) => {
    try {
      const res = await apiClient.post('/keys', { label, accountId });
      setVaultKeys(prev => [...prev, res.data]);
      setShowKeyModal(false);
    } catch (err) {
      console.error("Key generation failed", err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-cyan-500 font-mono">
        <RefreshCw className="animate-spin mb-4" size={48} />
        <Typography variant="body">INITIALIZING_QUANTUM_CORE...</Typography>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Typography variant="h1" className="text-white">{account?.name || 'QUANTUM_VAULT'}</Typography>
          <Typography variant="caption" className="text-slate-400">ID: {accountId}</Typography>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowPaymentModal(true)} className="bg-cyan-600 px-6 py-3 rounded-xl font-bold text-white">INJECT LIQUIDITY</button>
          <button onClick={() => setShowVault(!showVault)} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold">
            {showVault ? 'CLOSE VAULT' : 'OPEN VAULT'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex gap-1 bg-white/5 p-1 rounded-2xl w-fit">
            {(['overview', 'analytics', 'security', 'audit'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-xs font-black uppercase ${activeTab === tab ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <Card title="Available Liquidity">
                <Typography variant="h2" className="text-white">${(account?.balance || 0).toLocaleString()}</Typography>
              </Card>
              <Card title="Liquidity Flux" icon={<Activity className="text-cyan-500" />}>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="date" hide />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a' }} />
                      <Area type="monotone" dataKey="balance" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <Card title="Quantum Vault Storage" icon={<Lock />}>
              {vaultKeys.map(key => (
                <div key={key.id} className="flex justify-between p-4 bg-black/40 border border-white/5 rounded-2xl">
                  <div>
                    <Typography variant="body" className="font-bold">{key.label}</Typography>
                    <Typography variant="caption" className="font-mono">{key.cipher.substring(0, 20)}...</Typography>
                  </div>
                  <button onClick={() => setVaultKeys(prev => prev.filter(k => k.id !== key.id))}><Trash2 size={18} /></button>
                </div>
              ))}
              <button onClick={() => setShowKeyModal(true)} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl mt-4">
                <Plus size={18} /> GENERATE NEW KEY
              </button>
            </Card>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-black border border-cyan-500/30 rounded-3xl h-[700px] flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <Cpu className="text-cyan-500" />
              <Typography variant="h4" className="text-white">Nexus AI Pilot</Typography>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-white/5'}`}>
                  <Typography variant="body" className="text-white">{msg.content}</Typography>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); askAI(); }} className="p-4 border-t border-white/10">
              <input value={userInput} onChange={(e) => setUserInput(e.target.value)} className="w-full bg-white/5 p-4 rounded-xl" placeholder="Ask the Pilot..." />
            </form>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 p-8 rounded-[2rem] w-full max-w-md">
            <Typography variant="h3" className="text-white mb-4">Inject Liquidity</Typography>
            <form onSubmit={handleStripePayment} className="space-y-4">
              <input type="number" defaultValue="50000" className="w-full bg-black p-4 rounded-xl" />
              <button type="submit" className="w-full py-4 bg-cyan-500 rounded-xl font-bold">CONFIRM</button>
            </form>
          </div>
        </div>
      )}

      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 p-8 rounded-[2rem] w-full max-w-md">
            <Typography variant="h3" className="text-white mb-4">Generate Key</Typography>
            <input id="keyLabel" placeholder="Label" className="w-full bg-black p-4 rounded-xl mb-4" />
            <button onClick={() => generateNewKey((document.getElementById('keyLabel') as HTMLInputElement).value)} className="w-full py-4 bg-indigo-500 rounded-xl font-bold">GENERATE</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;