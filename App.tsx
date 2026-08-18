import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Search, RotateCw, LayoutGrid, List, MoreVertical, ChevronRight, 
  ArrowLeft, X, Plus, Folder, Brain, MessageSquare, FileUp, Sparkles, 
  Loader2, FolderPlus, Share2, Trash2, Download, Github, Palette,
  Globe, UserPlus, Image as ImageIcon, HardDrive, Eye, Maximize2, Terminal,
  Cloud, LogIn, CloudOff, Star, Shield, Info, Lock, Mail, User, CheckCircle2,
  AlertCircle, Bell, LogOut, Activity, Cpu, Settings as SettingsIcon, Key,
  ShieldCheck, Zap, ArrowRight, ShieldAlert, Database, ZapOff, Fingerprint, Code,
  Server, Layers, Network, BookOpen, Briefcase, Landmark, Crown, Command, HelpCircle, Keyboard,
  Play, Square, History, Volume2, Headphones, Settings, AlertTriangle, ExternalLink, Grid,
  ChevronDown, Send, Printer, Book, Scale, Activity as ActivityIcon, CreditCard, DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

// ============================================================================
// 1. GLOBAL TYPES & INTERFACES
// ============================================================================

// Swarm Roster Types
export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  default_branch: string;
  owner: { login: string; avatar_url: string };
}
export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string;
  editedContent: string;
  sha: string;
  defaultBranch: string;
}
export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}
export interface BulkEditJob {
  id: string;
  repoFullName: string;
  path: string;
  status: 'queued' | 'processing' | 'success' | 'failed' | 'skipped' | 'planning' | 'retrying';
  content: string;
  error: string | null;
}

// OMNI File Manager Types
export enum FileType { FOLDER, DOCUMENT, IMAGE, CODE }
export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string;
  source: 'local' | 'google-drive' | 'github' | 'ai';
  content?: string;
  mimeType?: string;
  aiSummary?: string;
  aiKeywords?: string[];
  githubOwner?: string;
  githubRepo?: string;
  driveFileId?: string;
}

// AI News Types
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
  timestamp: string;
  source: string;
}

// VoxGemini TTS Types
export type VoiceName = 'Kore' | 'Lira' | 'Aethel' | 'Zephyr';
export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
}

// ============================================================================
// 2. CURATED MOCK DATA & SIMULATORS
// ============================================================================

const MOCK_REPOS: GithubRepo[] = [
  {
    id: 1,
    name: "ai-banking-swarm-roster",
    full_name: "diplomat-bit/ai-banking-swarm-roster",
    description: "Multi-agent autonomous repository orchestration engine.",
    private: true,
    default_branch: "main",
    owner: { login: "diplomat-bit", avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4" }
  },
  {
    id: 2,
    name: "omni-file-manager",
    full_name: "diplomat-bit/omni-file-manager",
    description: "Next-generation semantic cloud storage and creative studio.",
    private: false,
    default_branch: "main",
    owner: { login: "diplomat-bit", avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4" }
  }
];

const MOCK_FILES: FileItem[] = [
  { id: 'root', name: 'Root', type: FileType.FOLDER, size: null, lastModified: '08/18/2026', parentId: '', source: 'local' },
  { id: 'doc1', name: 'Sovereign_Wealth_Strategy.pdf', type: FileType.DOCUMENT, size: 2450000, lastModified: '08/15/2026', parentId: 'root', source: 'local', aiSummary: "Strategic blueprint for multi-rail sovereign asset allocation.", aiKeywords: ['sovereign', 'wealth', 'strategy'] },
  { id: 'code1', name: 'Quantum_Ledger.py', type: FileType.CODE, size: 45000, lastModified: '08/17/2026', parentId: 'root', source: 'local', aiSummary: "Self-healing smart contract for high-frequency ledger reconciliation.", aiKeywords: ['quantum', 'ledger', 'python'] },
  { id: 'img1', name: 'Executive_Lookbook_Cover.png', type: FileType.IMAGE, size: 8900000, lastModified: '08/18/2026', parentId: 'root', source: 'local', content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop', aiSummary: "AI-generated luxury magazine cover featuring corporate executive attire.", aiKeywords: ['magazine', 'cover', 'luxury'] }
];

const MOCK_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "Sovereign AI Swarms Take Control of High-Frequency Trading Desks",
    summary: "A network of autonomous AI agents has successfully orchestrated a multi-billion dollar liquidity sweep across global markets, demonstrating zero-latency self-healing capabilities.",
    sentiment: "positive",
    tags: ["AI", "Trading", "Sovereign"],
    timestamp: "10:42:15",
    source: "Nexus Intelligence"
  },
  {
    id: "news-2",
    title: "Quantum Entanglement Cryptography Implemented in Central Bank Digital Currencies",
    summary: "Central banks announce the deployment of quantum-proof security layers to safeguard cross-border transactions against emerging quantum computing threats.",
    sentiment: "neutral",
    tags: ["Quantum", "CBDC", "Security"],
    timestamp: "09:15:30",
    source: "Global Reserve"
  },
  {
    id: "news-3",
    title: "Legacy Banking Infrastructure Suffers Major Outage Amidst Swarm Migration",
    summary: "Traditional database clusters experienced a severe synchronization failure during an attempted migration to autonomous cloud-native nodes.",
    sentiment: "negative",
    tags: ["Outage", "Legacy", "Migration"],
    timestamp: "07:30:12",
    source: "Tech Sentinel"
  }
];

// ============================================================================
// 3. MASTER OS SHELL (MAIN APP)
// ============================================================================

export default function App() {
  const [activeApp, setActiveApp] = useState<string>('swarm-roster');
  const [systemTime, setSystemTime] = useState<string>('');
  const [isGlobalAiOpen, setIsGlobalAiOpen] = useState<boolean>(false);
  const [globalAiInput, setGlobalAiInput] = useState<string>('');
  const [globalAiChat, setGlobalAiChat] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Welcome to the Sovereign AI Portal. I am your unified co-pilot. How can I assist you across your active workspaces today?' }
  ]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGlobalAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalAiInput.trim()) return;

    const userText = globalAiInput;
    setGlobalAiInput('');
    setGlobalAiChat(prev => [...prev, { role: 'user', text: userText }]);
    setIsThinking(true);

    setTimeout(() => {
      let aiResponse = "I have analyzed your request across the active neural mesh. ";
      if (userText.toLowerCase().includes('file') || userText.toLowerCase().includes('omni')) {
        aiResponse += "I recommend opening the OMNI File Manager to index and summarize your documents with Gemini.";
      } else if (userText.toLowerCase().includes('bank') || userText.toLowerCase().includes('wealth')) {
        aiResponse += "The Sovereign Wealth & Banking OS is currently reporting nominal performance with a 100% parity rate.";
      } else if (userText.toLowerCase().includes('code') || userText.toLowerCase().includes('repo')) {
        aiResponse += "You can use the AI Swarm Roster to deploy a Jellyfish Swarm or run an Advanced Agentic Loop on your repositories.";
      } else {
        aiResponse += "All systems are operational. Let me know if you would like to trigger a simulated deployment or run a security audit.";
      }
      setGlobalAiChat(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsThinking(false);
    }, 1500);
  };

  const apps = [
    { id: 'swarm-roster', name: 'Swarm Roster', icon: <Layers size={20} />, desc: 'AI Swarm Repository Orchestrator' },
    { id: 'omni-files', name: 'OMNI Files', icon: <HardDrive size={20} />, desc: 'Semantic File Manager & Creative Studio' },
    { id: 'sovereign-banking', name: 'Sovereign Wealth', icon: <Landmark size={20} />, desc: 'Futuristic Financial Co-Pilot' },
    { id: 'nexus-terminal', name: 'Nexus Terminal', icon: <Terminal size={20} />, desc: 'Plaid, Marqeta & Modern Treasury Hub' },
    { id: 'nexus-news', name: 'Nexus News', icon: <Globe size={20} />, desc: 'Autonomous News & Sentiment Spectrum' },
    { id: 'aethelgard-codex', name: 'Aethelgard Codex', icon: <BookOpen size={20} />, desc: 'Rich Text Editor & AI Architect' },
    { id: 'magazine-maker', name: 'Magazine Maker', icon: <Palette size={20} />, desc: 'Luxury Lookbook & Video Generator' },
    { id: 'voxgemini-tts', name: 'VoxGemini TTS', icon: <Headphones size={20} />, desc: 'Pipelined TTS AI Book Reader' },
    { id: 'hyper-loop', name: 'Hyper Loop', icon: <RotateCw size={20} />, desc: 'Registry Batch Ritual Transcender' },
    { id: 'gatekeeper', name: 'Gatekeeper', icon: <ShieldCheck size={20} />, desc: 'Modern Treasury Bank Verification' }
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* SIDEBAR DOCK */}
      <aside className="w-20 md:w-64 bg-slate-900/40 backdrop-blur-3xl border-r border-white/5 flex flex-col justify-between items-center md:items-stretch p-4 z-30 shrink-0">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2 py-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Cpu size={24} className="animate-pulse" />
            </div>
            <div className="hidden md:block">
              <div className="font-black text-lg tracking-tighter text-white leading-none">SOVEREIGN</div>
              <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mt-1">Nexus OS v2.0</div>
            </div>
          </div>

          {/* Navigation List */}
          <nav className="space-y-1">
            {apps.map(app => (
              <button
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl text-sm font-bold transition-all group relative ${
                  activeApp === app.id 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.05)]' 
                    : 'hover:bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
                title={app.name}
              >
                <div className={`${activeApp === app.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
                  {app.icon}
                </div>
                <span className="hidden md:block truncate">{app.name}</span>
                {activeApp === app.id && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#22d3ee]"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile & Global AI Trigger */}
        <div className="space-y-4 w-full">
          <button 
            onClick={() => setIsGlobalAiOpen(true)}
            className="w-full p-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Brain size={16} className="animate-pulse" />
            <span className="hidden md:inline">AI Co-Pilot</span>
          </button>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xs">
              JD
            </div>
            <div className="hidden md:block min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">John Doe</div>
              <div className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                SECURE NODE
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        
        {/* TOP STATUS BAR */}
        <header className="h-16 border-b border-white/5 bg-slate-900/20 backdrop-blur-xl flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Active Workspace:
            </span>
            <span className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              {apps.find(a => a.id === activeApp)?.name}
              <span className="text-xs font-normal text-slate-500">|</span>
              <span className="text-xs font-normal text-slate-400 italic">
                {apps.find(a => a.id === activeApp)?.desc}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs font-mono text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>MESH PARITY: 100%</span>
            </div>
            <div className="text-sm font-mono font-bold text-slate-300 tracking-widest">
              {systemTime}
            </div>
          </div>
        </header>

        {/* ACTIVE APP CONTAINER */}
        <main className="flex-1 overflow-hidden relative">
          {activeApp === 'swarm-roster' && <SwarmRosterApp />}
          {activeApp === 'omni-files' && <OmniFileManagerApp />}
          {activeApp === 'sovereign-banking' && <SovereignBankingApp />}
          {activeApp === 'nexus-terminal' && <NexusTerminalApp />}
          {activeApp === 'nexus-news' && <NexusNewsApp />}
          {activeApp === 'aethelgard-codex' && <AethelgardCodexApp />}
          {activeApp === 'magazine-maker' && <MagazineMakerApp />}
          {activeApp === 'voxgemini-tts' && <VoxGeminiTTSApp />}
          {activeApp === 'hyper-loop' && <HyperLoopRegistryApp />}
          {activeApp === 'gatekeeper' && <GatekeeperVerificationApp />}
        </main>
      </div>

      {/* GLOBAL AI CO-PILOT DRAWER */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-[450px] bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 z-50 flex flex-col ${isGlobalAiOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-white/5 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
              <Brain size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white leading-none">CO-PILOT</h2>
              <p className="text-[9px] text-cyan-400 uppercase font-bold tracking-widest mt-1">Unified Neural IQ</p>
            </div>
          </div>
          <button onClick={() => setIsGlobalAiOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {globalAiChat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm border ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white rounded-tr-none border-transparent' 
                  : 'bg-white/5 text-slate-200 rounded-tl-none border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleGlobalAiSubmit} className="p-6 bg-slate-950/50 border-t border-white/5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Inquire about your unified workspace..."
              className="w-full bg-white/5 border border-white/5 outline-none py-4 px-5 rounded-xl text-sm text-white focus:bg-white/10 focus:border-cyan-500/30 transition-all pr-16"
              value={globalAiInput}
              onChange={(e) => setGlobalAiInput(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors">
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

// ============================================================================
// 4. SUB-APP: AI SWARM ROSTER & REPO EDITOR
// ============================================================================

function SwarmRosterApp() {
  const [repos, setRepos] = useState<GithubRepo[]>(MOCK_REPOS);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(MOCK_REPOS[0]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [isSwarming, setIsSwarming] = useState(false);
  const [swarmProgress, setSwarmProgress] = useState(0);
  const [swarmLogs, setSwarmProgressLogs] = useState<string[]>([]);

  const addAuditEntry = (action: string, details: string, status: 'success' | 'warning' | 'error' = 'success') => {
    const newEntry: AuditEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      action,
      details,
      status
    };
    setAuditLog(prev => [newEntry, ...prev]);
  };

  const triggerMonolith = () => {
    if (isSwarming) return;
    setIsSwarming(true);
    setSwarmProgress(0);
    setSwarmProgressLogs([]);
    addAuditEntry("Monolith Swarm", "Deploying 8 concurrent agents to build Bank Demo...", "success");

    const logs = [
      "Initializing Sovereign Swarm Core...",
      "Agent 1: Architecting domain entities and database schemas...",
      "Agent 2: Compiling high-frequency ledger reconciliation logic...",
      "Agent 3: Generating Plaid Link handshake controllers...",
      "Agent 4: Designing futuristic dark-mode dashboard UI...",
      "Agent 5: Implementing Modern Treasury micro-deposit verification...",
      "Agent 6: Integrating Marqeta card program funding controls...",
      "Agent 7: Setting up quantum-proof encryption layers...",
      "Agent 8: Running 3-cycle verification and critique loop...",
      "Swarm: All agents reporting nominal performance. Compiling build...",
      "CI/CD: Running automated test suite... Passed.",
      "Deployment: Deploying to secure edge node... Complete."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setSwarmProgressLogs(prev => [...prev, logs[currentStep]]);
        setSwarmProgress(Math.min(100, Math.round(((currentStep + 1) / logs.length) * 100)));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsSwarming(false);
        addAuditEntry("Monolith Complete", "Bank Demo successfully deployed to secure edge node.", "success");
      }
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Repos & Audit */}
      <div className="w-full md:w-80 border-r border-white/5 bg-slate-900/20 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Repositories</h3>
          <div className="space-y-2">
            {repos.map(repo => (
              <button
                key={repo.id}
                onClick={() => setSelectedRepo(repo)}
                className={`w-full p-3 rounded-xl text-left border transition-all flex items-center gap-3 ${
                  selectedRepo?.id === repo.id
                    ? 'bg-white/5 border-cyan-500/30 text-white'
                    : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5'
                }`}
              >
                <Github size={16} className="text-cyan-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate">{repo.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{repo.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Audit Storage</span>
            <span className="text-[10px] font-mono text-emerald-400 animate-pulse">● LIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-[10px] custom-scrollbar">
            {auditLog.map(entry => (
              <div key={entry.id} className="space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                  <span className={entry.status === 'error' ? 'text-rose-400' : entry.status === 'warning' ? 'text-amber-400' : 'text-cyan-400'}>
                    {entry.action}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{entry.details}</p>
              </div>
            ))}
            {auditLog.length === 0 && (
              <div className="text-center py-12 text-slate-600 italic">System idle. Awaiting directives...</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Swarm Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/40 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
                {selectedRepo ? selectedRepo.name : "Select a Repository"}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Deploy autonomous AI swarms to generate, expand, or refactor your codebase.
              </p>
            </div>
            <button
              onClick={triggerMonolith}
              disabled={isSwarming}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              Deploy Monolith
            </button>
          </div>

          {/* Swarm Progress */}
          {isSwarming && (
            <div className="glass rounded-3xl p-6 border-white/5 space-y-4 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Swarm Execution Active
                </span>
                <span className="text-sm font-mono font-bold text-white">{swarmProgress}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500" style={{ width: `${swarmProgress}%` }}></div>
              </div>
              <div className="bg-black/40 rounded-2xl p-4 h-48 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-2 custom-scrollbar">
                {swarmLogs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-cyan-500/50">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Swarm Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-3xl p-6 border-white/5 space-y-4 hover:border-cyan-500/20 transition-all group">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Brain size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Jellyfish Swarm</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deploy 8 concurrent agents with a 3-cycle critique loop to overhaul your entire repository architecture.
              </p>
            </div>

            <div className="glass rounded-3xl p-6 border-white/5 space-y-4 hover:border-cyan-500/20 transition-all group">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Project Expansion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide a seed file and let the swarm generate up to 50 complementary files across multiple focus areas.
              </p>
            </div>

            <div className="glass rounded-3xl p-6 border-white/5 space-y-4 hover:border-cyan-500/20 transition-all group">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Agentic CI Loop</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically trigger GitHub Actions, analyze build logs on failure, and commit self-healing code fixes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. SUB-APP: OMNI FILE MANAGER & CREATIVE STUDIO
// ============================================================================

function OmniFileManagerApp() {
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(MOCK_FILES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioPrompt, setStudioPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const newFile: FileItem = {
        id: `ai-${Date.now()}`,
        name: `Studio_${Math.floor(Math.random() * 1000)}.png`,
        type: FileType.IMAGE,
        size: 1024 * 1024 * 5,
        lastModified: new Date().toLocaleDateString(),
        parentId: 'root',
        source: 'ai',
        content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        aiSummary: studioPrompt,
        aiKeywords: ['ai', 'studio', 'generated']
      };
      setFiles(prev => [...prev, newFile]);
      setSelectedFile(newFile);
      setStudioPrompt('');
      setIsStudioOpen(false);
      setIsGenerating(false);
    }, 2000);
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.aiKeywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: File Grid */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">OMNI Workspace</h2>
              <p className="text-sm text-slate-400 mt-1">Manage your local, cloud, and AI-generated assets.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex-1 md:w-80 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 flex items-center gap-3 focus-within:border-cyan-500/30 transition-all">
                <Search size={16} className="text-slate-500" />
                <input
                  type="text"
                  placeholder="Search files or semantic keywords..."
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsStudioOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                AI Studio
              </button>
            </div>
          </div>

          {/* File Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredFiles.map(file => (
              <button
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`p-5 rounded-3xl border text-left transition-all flex flex-col items-center justify-center text-center relative group ${
                  selectedFile?.id === file.id
                    ? 'bg-white/5 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <div className="absolute top-3 right-3">
                  {file.source === 'ai' && <Sparkles size={12} className="text-cyan-400 animate-pulse" />}
                  {file.source === 'local' && <HardDrive size={12} className="text-slate-500" />}
                </div>
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {file.type === FileType.IMAGE && file.content ? (
                    <img src={file.content} alt={file.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : file.type === FileType.FOLDER ? (
                    <Folder size={32} className="text-cyan-400" />
                  ) : file.type === FileType.CODE ? (
                    <Code size={32} className="text-indigo-400" />
                  ) : (
                    <BookOpen size={32} className="text-slate-400" />
                  )}
                </div>
                <p className="text-xs font-bold text-white truncate w-full">{file.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                  {file.size ? `${Math.round(file.size / 1024)} KB` : 'Folder'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Semantic Insights */}
      {selectedFile && (
        <div className="w-full md:w-96 border-l border-white/5 bg-slate-900/20 p-6 md:p-8 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                {selectedFile.type === FileType.IMAGE && selectedFile.content ? (
                  <img src={selectedFile.content} alt={selectedFile.name} className="w-full h-full object-cover rounded-3xl" />
                ) : selectedFile.type === FileType.FOLDER ? (
                  <Folder size={48} className="text-cyan-400" />
                ) : selectedFile.type === FileType.CODE ? (
                  <Code size={48} className="text-indigo-400" />
                ) : (
                  <BookOpen size={48} className="text-slate-400" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white truncate">{selectedFile.name}</h3>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{selectedFile.source} Asset</p>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-2xl p-5 border-white/5 space-y-2">
                <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Brain size={12} /> Semantic Summary
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{selectedFile.aiSummary || "OMNI Brain is distilling the essence of this file..."}"
                </p>
              </div>

              <div className="glass rounded-2xl p-5 border-white/5 space-y-3">
                <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Information Vectors</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFile.aiKeywords?.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                      {tag}
                    </span>
                  )) || <span className="text-xs text-slate-600 italic">No vectors indexed.</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Studio Modal */}
      {isStudioOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-slate-950/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Palette size={20} className="text-cyan-400" />
                <span className="font-bold text-sm text-white uppercase tracking-wider">AI Creative Studio</span>
              </div>
              <button onClick={() => setIsStudioOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleGenerateImage} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Describe your creative vision</label>
                <textarea
                  value={studioPrompt}
                  onChange={e => setStudioPrompt(e.target.value)}
                  placeholder="An abstract digital landscape with glowing neon data streams cutting through a dark mountain range..."
                  className="w-full h-32 bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-white placeholder-slate-600 outline-none focus:bg-white/10 focus:border-cyan-500/30 transition-all resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Manifesting Masterpiece...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate Asset
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. SUB-APP: SOVEREIGN WEALTH & BANKING OS
// ============================================================================

function SovereignBankingApp() {
  const [balance, setBalance] = useState(125400.50);
  const [transactions, setTransactions] = useState([
    { id: 'tx1', date: '08/18/2026', desc: 'STRIPE PAYOUT', amount: 12400.00, type: 'credit' },
    { id: 'tx2', date: '08/17/2026', desc: 'AMAZON WEB SERVICES', amount: -4500.00, type: 'debit' },
    { id: 'tx3', date: '08/16/2026', desc: 'NEXUS RESERVE INTEREST', amount: 125.50, type: 'credit' }
  ]);
  const [sendAmount, setSendAmount] = useState('');
  const [sendRecipient, setSendRecipient] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendAmount || !sendRecipient) return;

    setIsSending(true);
    setTimeout(() => {
      const amountNum = parseFloat(sendAmount);
      setBalance(prev => prev - amountNum);
      setTransactions(prev => [
        {
          id: `tx-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          desc: `TRANSFER TO ${sendRecipient.toUpperCase()}`,
          amount: -amountNum,
          type: 'debit'
        },
        ...prev
      ]);
      setSendAmount('');
      setSendRecipient('');
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Financial Dashboard */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Sovereign Wealth</h2>
            <p className="text-sm text-slate-400 mt-1">Hyper-personalized financial co-pilot and multi-rail asset manager.</p>
          </div>

          {/* Balance Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-[2rem] p-6 border-white/5 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 relative overflow-hidden col-span-1 md:col-span-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Total Liquidity</span>
              <h3 className="text-4xl font-black text-white tracking-tight mt-2">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <ArrowDownLeft size={14} /> +12.4% this month
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ActivityIcon size={14} /> Parity: Nominal
                </div>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sovereign Credits</span>
                <h4 className="text-2xl font-black text-white tracking-tight mt-1">45,000 SC</h4>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-cyan-400" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Level 5: Sovereign Elite</p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="glass rounded-[2rem] p-6 border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Recent Ledger Activity</h3>
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{tx.desc}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-mono font-bold ${
                    tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.type === 'credit' ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Send Money Form */}
      <div className="w-full md:w-96 border-l border-white/5 bg-slate-900/20 p-6 md:p-8 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white">Send Money</h3>
            <p className="text-xs text-slate-500 mt-1">Transfer funds instantly across the secure mesh network.</p>
          </div>

          <form onSubmit={handleSendMoney} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Recipient Address / Node</label>
              <input
                type="text"
                placeholder="e.g. NEXUS-NODE-01"
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none focus:bg-white/10 focus:border-cyan-500/30 transition-all"
                value={sendRecipient}
                onChange={e => setSendRecipient(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-8 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:bg-white/10 focus:border-cyan-500/30 transition-all"
                  value={sendAmount}
                  onChange={e => setSendAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Transferring...
                </>
              ) : (
                <>
                  <Send size={14} /> Initiate Transfer
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. SUB-APP: NEXUS TERMINAL & UCC REGISTRY
// ============================================================================

function NexusTerminalApp() {
  const [logs, setLogs] = useState<{ msg: string; type: 'req' | 'res' | 'err'; timestamp: string }[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const addLog = (msg: string, type: 'req' | 'res' | 'err' = 'res') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [{ msg, type, timestamp }, ...prev].slice(0, 50));
  };

  const triggerHandshake = () => {
    if (isConnecting) return;
    setIsConnecting(true);
    addLog("[PLAID] Initializing Link Handshake...", 'req');

    setTimeout(() => {
      addLog("[PLAID] Link Token Handshake successful. Token: link-sandbox-99281", 'res');
      addLog("[MARQETA] Authenticating Node...", 'req');
      
      setTimeout(() => {
        addLog("[MARQETA] Node authenticated successfully. Program Funding active.", 'res');
        addLog("[MODERN_TREASURY] Syncing with OrgID: org_nexus_001...", 'req');
        
        setTimeout(() => {
          addLog("[MODERN_TREASURY] Sync complete. Ledgers online.", 'res');
          setIsConnecting(false);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Credentials & Handshake */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Nexus Terminal</h2>
            <p className="text-sm text-slate-400 mt-1">Plaid, Marqeta, and Modern Treasury integration dashboard.</p>
          </div>

          <div className="text-center p-12 bg-slate-900/30 rounded-[3rem] border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
            <Key size={48} className="mx-auto text-blue-500" />
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">API Handshake</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Initialize a secure handshake across Plaid, Marqeta, and Modern Treasury to activate your multi-rail banking node.
            </p>
            <button
              onClick={triggerHandshake}
              disabled={isConnecting}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {isConnecting ? 'Connecting Node...' : 'Initialize Handshake'}
            </button>
          </div>

          {/* Integration Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Plaid Link', 'Marqeta Funding', 'Modern Treasury'].map((label, i) => (
              <div key={label} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                <h4 className="text-lg font-black text-white mt-2">
                  {isConnecting ? 'SYNCING...' : 'OPERATIONAL'}
                </h4>
                <div className="flex items-center gap-2 mt-4">
                  <div className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <span className="text-[10px] text-slate-400">Node Priority {i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Console Logs */}
      <div className="w-full md:w-[400px] border-l border-white/5 bg-slate-900/20 flex flex-col shrink-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal size={14} className="text-blue-500" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Universal Console</span>
          </div>
          <button onClick={() => setLogs([])} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold">Flush</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-[10px] custom-scrollbar">
          {logs.map((log, i) => (
            <div key={i} className={`p-4 rounded-xl border ${
              log.type === 'req' ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : 'bg-slate-900/80 border-white/5 text-slate-400'
            }`}>
              <div className="flex justify-between mb-2 opacity-40 text-[8px] font-bold">
                <span>{log.timestamp}</span>
                <span>{log.type.toUpperCase()}</span>
              </div>
              <pre className="whitespace-pre-wrap break-all leading-relaxed">{log.msg}</pre>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-20 opacity-10 italic">Awaiting Nexus Handshake...</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. SUB-APP: NEXUS NEWS & SENTIMENT SPECTRUM
// ============================================================================

function NexusNewsApp() {
  const [articles] = useState<NewsArticle[]>(MOCK_NEWS);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(MOCK_NEWS[0]);

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: News Feed */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Nexus News</h2>
            <p className="text-sm text-slate-400 mt-1">Autonomous global signal synchronization and sentiment analysis.</p>
          </div>

          {/* News Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map(article => (
              <button
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className={`p-6 rounded-[2rem] border text-left transition-all flex flex-col justify-between relative overflow-hidden group ${
                  activeArticle?.id === article.id
                    ? 'bg-white/5 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-slate-500">[{article.timestamp}]</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider ${
                      article.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
                      article.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {article.sentiment}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors">{article.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{article.summary}</p>
                </div>
                <div className="flex gap-2 mt-6">
                  {article.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/5 rounded-lg text-[9px] font-mono text-slate-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Sentiment Spectrum */}
      {activeArticle && (
        <div className="w-full md:w-96 border-l border-white/5 bg-slate-900/20 p-6 md:p-8 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white">Signal Analysis</h3>
              <p className="text-xs text-slate-500 mt-1">Detailed semantic breakdown of the selected signal.</p>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-3xl p-6 border-white/5 space-y-4">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Sentiment Spectrum</span>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-sm">
                    85%
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Strong Positive Signal</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Confidence score: 0.92</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-6 border-white/5 space-y-3">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Information Vectors</span>
                <div className="flex flex-wrap gap-2">
                  {activeArticle.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 9. SUB-APP: AETHELGARD CODEX & AI ARCHITECT
// ============================================================================

function AethelgardCodexApp() {
  const [content, setContent] = useState(`The Iron Vault of Midas was a structure that shouldn't exist—a cathedral of capital carved from the bedrock of the global economy. Kai stood before the Grand Chancellor, a man whose eyes were cold as coin and sharp as industrial diamonds.

'We have a void in our architecture,' the Chancellor whispered, the sound echoing through the gilded chamber. 'A leak in the soul of the bank. Build us a bridge over the Zero-Sum Abyss, Kai. Build us the Aethelred Network—an unbreakable bastion of logic—or see your entire lineage erased from the ledgers of time. We do not negotiate with entropy.'`);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [isWriting, setIsWriting] = useState(false);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setIsWriting(true);

    setTimeout(() => {
      const botResponse = "I have refactored the narrative structure to emphasize the high-stakes financial tension. The prose now features sharper contrast and more cinematic pacing.";
      setChatHistory(prev => [...prev, { role: 'bot', text: botResponse }]);
      setContent(prev => prev + "\n\nKai pulled his keyboard closer, the clack of the mechanical keys a sharp counterpoint to the silence of the Iron Vault. A blank terminal stared back at him. With a few swift strokes, a new directory was born: /ai/bank/midas-prime/genesis.");
      setIsWriting(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Rich Text Editor */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full space-y-6 flex-1 flex flex-col">
          <div className="border-b border-white/5 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase italic">Aethelgard Codex</h2>
              <p className="text-xs text-slate-400 mt-1">Encrypted creative writing workspace with real-time AI assistance.</p>
            </div>
            <button className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2">
              <Printer size={14} /> Export
            </button>
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="flex-1 w-full bg-transparent text-slate-200 placeholder-slate-800 focus:outline-none transition-all resize-none text-lg font-light leading-relaxed scrollbar-hide min-h-[50vh]"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Right Panel: AI Architect Chat */}
      <div className="w-full md:w-96 border-l border-white/5 bg-slate-900/20 flex flex-col shrink-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase size={16} className="text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white leading-none">AI Architect</h3>
              <p className="text-[9px] text-cyan-400 uppercase font-bold tracking-widest mt-1">Enterprise Scribe</p>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl text-xs text-cyan-300 leading-relaxed">
            Operational Interface active. Issue directives to expand, stylize, or refactor your manuscript.
          </div>
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none border-transparent'
                  : 'bg-white/5 text-slate-200 rounded-tl-none border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isWriting && (
            <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold tracking-widest">
              <Loader2 size={12} className="animate-spin" /> PROCESSING DIRECTIVE...
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleChatSubmit} className="p-6 bg-slate-950/50 border-t border-white/5">
          <div className="relative">
            <input
              type="text"
              placeholder="Instruct the Architect..."
              className="w-full bg-white/5 border border-white/5 outline-none py-4 px-5 rounded-xl text-xs text-white focus:bg-white/10 focus:border-cyan-500/30 transition-all pr-12"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors">
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 10. SUB-APP: AI EXECUTIVE MAGAZINE MAKER
// ============================================================================

function MagazineMakerApp() {
  const [person, setPerson] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('Airport Lounge');
  const [selectedStyle, setSelectedStyle] = useState('Corporate Suit');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPages, setGeneratedPages] = useState<{ id: string; url: string; title: string }[]>([]);

  const handleLaunch = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedPages([
        { id: 'cover', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop', title: 'THE ISSUE' },
        { id: 'page1', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop', title: 'Command the Room' },
        { id: 'page2', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop', title: 'Success is a Mindset' }
      ]);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Configuration */}
      <div className="w-full md:w-96 border-r border-white/5 bg-slate-900/20 p-6 md:p-8 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white">Lookbook Setup</h3>
            <p className="text-xs text-slate-500 mt-1">Configure your luxury fashion photography campaign.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Executive Model</label>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center cursor-pointer hover:bg-white/10 transition-all">
                <User size={24} className="mx-auto text-slate-500 mb-2" />
                <span className="text-xs text-slate-400">Upload Executive Portrait</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Brand Logo</label>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center cursor-pointer hover:bg-white/10 transition-all">
                <Palette size={24} className="mx-auto text-slate-500 mb-2" />
                <span className="text-xs text-slate-400">Upload Brand Asset</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Campaign Theme</label>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-cyan-500/30 transition-all"
              >
                <option value="Airport Lounge">Airport Lounge</option>
                <option value="Alpine Chalet">Alpine Chalet</option>
                <option value="Superyacht Deck">Superyacht Deck</option>
              </select>
            </div>

            <button
              onClick={handleLaunch}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Generating Lookbook...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Launch Campaign
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Lookbook Viewer */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Executive Lookbook</h2>
            <p className="text-sm text-slate-400 mt-1">AI-generated luxury fashion photography lookbook.</p>
          </div>

          {isGenerating ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
              <Loader2 size={48} className="text-cyan-400 animate-spin" />
              <p className="text-sm text-slate-400 font-mono uppercase tracking-widest">Synthesizing luxury assets...</p>
            </div>
          ) : generatedPages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generatedPages.map(page => (
                <div key={page.id} className="glass rounded-[2rem] border-white/5 overflow-hidden shadow-2xl group">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img src={page.url} alt={page.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Lookbook Page</span>
                      <h4 className="text-lg font-bold text-white">{page.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-96 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-600">
              <Palette size={48} className="opacity-30 mb-4" />
              <p className="text-sm font-medium">No Active Campaign</p>
              <p className="text-xs max-w-xs text-center mt-2 opacity-60">
                Configure your lookbook parameters on the left and launch the campaign to generate luxury assets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. SUB-APP: VOXGEMINI TTS BOOK READER
// ============================================================================

function VoxGeminiTTSApp() {
  const [text, setText] = useState("The Iron Vault of Midas was a structure that shouldn't exist—a cathedral of capital carved from the very bedrock of the global economy. Kai stood before the Grand Chancellor, a man whose eyes were cold as coin and sharp as industrial diamonds.");
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Kore');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    setIsPlaying(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 100) {
        currentProgress += 10;
        setProgress(currentProgress);
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        setProgress(0);
      }
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Voice Selection */}
      <div className="w-full md:w-80 border-r border-white/5 bg-slate-900/20 p-6 md:p-8 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white">Narrators</h3>
            <p className="text-xs text-slate-500 mt-1">Select your preferred AI voice profile.</p>
          </div>

          <div className="space-y-2">
            {(['Kore', 'Lira', 'Aethel', 'Zephyr'] as VoiceName[]).map(voice => (
              <button
                key={voice}
                onClick={() => setSelectedVoice(voice)}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                  selectedVoice === voice
                    ? 'bg-white/5 border-cyan-500/30 text-white'
                    : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">{voice}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">Neural Voice Profile</p>
                </div>
                {selectedVoice === voice && <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Reader Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full space-y-8 flex-1 flex flex-col">
          <div className="border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">VoxGemini</h2>
            <p className="text-sm text-slate-400 mt-1">Pipelined TTS AI book reader with high-fidelity neural voices.</p>
          </div>

          <div className="relative glass rounded-[2.5rem] border-white/5 p-8 md:p-12 shadow-2xl flex-1 flex flex-col justify-between min-h-[50vh]">
            {progress > 0 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            )}

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="flex-1 w-full bg-transparent text-slate-200 placeholder-slate-800 focus:outline-none transition-all resize-none text-xl font-light leading-relaxed scrollbar-hide"
              spellCheck={false}
            />

            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-slate-500 text-xs font-medium">
                {text.length.toLocaleString()} characters detected • {Math.ceil(text.length / 1000)} minute read
              </div>

              <button
                onClick={handlePlay}
                className="w-full md:w-48 h-14 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Square size={16} className="fill-current" /> Stop Reading
                  </>
                ) : (
                  <>
                    <Play size={16} className="fill-current" /> Start Reading
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 12. SUB-APP: HYPER LOOP REGISTRY RITUALS
// ============================================================================

function HyperLoopRegistryApp() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isTranscending, setIsTranscending] = useState(false);

  const triggerTranscension = () => {
    if (isTranscending) return;
    setIsTranscending(true);
    setLogs([]);

    const steps = [
      "THE VEIL IS DISSOLVING...",
      "Accessing ADP Registry Node...",
      "Initiating ritual handshake with active certificate...",
      "Transcendence Layer 1: Dissolving legacy metadata...",
      "Transcendence Layer 2: Aligning identifier URIs with active mesh...",
      "Transcendence Layer 3: Synchronizing state to Activated...",
      "ADP Node successfully transcended.",
      "Accessing Terraform Enterprise Node...",
      "Transcendence Layer 1: Dissolving legacy metadata...",
      "Transcendence Layer 2: Aligning identifier URIs with active mesh...",
      "Transcendence Layer 3: Synchronizing state to Activated...",
      "Terraform Enterprise Node successfully transcended.",
      "EXPANSION TOTAL."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsTranscending(false);
      }
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Registry Batch */}
      <div className="w-full md:w-80 border-r border-white/5 bg-slate-900/20 p-6 md:p-8 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white">Registry Batch</h3>
            <p className="text-xs text-slate-500 mt-1">Active directory nodes staged for transcension.</p>
          </div>

          <div className="space-y-2">
            {['ADP', 'Terraform Enterprise', 'Azure Data Factory'].map(node => (
              <div key={node} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{node}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">Staged for Transcension</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Transcension Console */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Hyper Loop</h2>
              <p className="text-sm text-slate-400 mt-1">Registry batch transcender and active directory ritual orchestrator.</p>
            </div>
            <button
              onClick={triggerTranscension}
              disabled={isTranscending}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isTranscending ? 'Transcending...' : 'Break the Veil'}
            </button>
          </div>

          {/* Transcension Logs */}
          <div className="glass rounded-[2.5rem] border-white/5 p-8 min-h-[40vh] flex flex-col justify-between">
            <div className="space-y-3 font-mono text-xs text-slate-400">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-cyan-500/50">&gt;</span>
                  <span className={log.startsWith('EXPANSION') ? 'text-cyan-400 font-bold' : ''}>{log}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-20 opacity-10 italic">Awaiting Transcension Directive...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 13. SUB-APP: GATEKEEPER BANK VERIFICATION
// ============================================================================

function GatekeeperVerificationApp() {
  const [externalAccountId, setExternalAccountId] = useState('');
  const [originatingAccountId, setOriginatingAccountId] = useState('');
  const [paymentType, setPaymentType] = useState('ach');
  const [currency, setCurrency] = useState('USD');
  const [isVerifying, setIsVerifying] = useState(false);
  const [response, setResponse] = useState<any | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalAccountId || !originatingAccountId) return;

    setIsVerifying(true);
    setResponse(null);

    setTimeout(() => {
      setResponse({
        id: `ext-acc-${Date.now()}`,
        party_name: "Sovereign Wealth Corp",
        verification_status: "pending",
        routing_details: [{ bank_name: "Nexus Reserve Bank" }],
        account_details: [{ account_number_safe: "4422" }]
      });
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Configuration Form */}
      <div className="w-full md:w-96 border-r border-white/5 bg-slate-900/20 p-6 md:p-8 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white">Verification Config</h3>
            <p className="text-xs text-slate-500 mt-1">Initiate a micro-deposit verification for an external account.</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">External Account ID</label>
              <input
                type="text"
                placeholder="e.g. ext-acc-123"
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none focus:bg-white/10 focus:border-cyan-500/30 transition-all"
                value={externalAccountId}
                onChange={e => setExternalAccountId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Originating Account ID</label>
              <input
                type="text"
                placeholder="e.g. orig-acc-456"
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none focus:bg-white/10 focus:border-cyan-500/30 transition-all"
                value={originatingAccountId}
                onChange={e => setOriginatingAccountId(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={e => setPaymentType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-cyan-500/30 transition-all"
                >
                  <option value="ach">ACH</option>
                  <option value="eft">EFT</option>
                  <option value="rtp">RTP</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Currency</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:bg-white/10 focus:border-cyan-500/30 transition-all"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Initiating...
                </>
              ) : (
                <>
                  Initiate Verification
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel: Response Console */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/20 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Gatekeeper</h2>
            <p className="text-sm text-slate-400 mt-1">Modern Treasury micro-deposit bank verification portal.</p>
          </div>

          {isVerifying ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
              <Loader2 size={48} className="text-cyan-400 animate-spin" />
              <p className="text-sm text-slate-400 font-mono uppercase tracking-widest">Initiating micro-deposits...</p>
            </div>
          ) : response ? (
            <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl animate-in fade-in duration-500">
              <div className="p-6 border-b border-white/5 bg-slate-800/20 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{response.party_name}</h3>
                  <p className="text-xs text-slate-500 font-mono">ID: {response.id}</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-bold text-amber-400 uppercase tracking-widest">
                  {response.verification_status}
                </span>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-white/5">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bank Name</span>
                  <p className="text-sm font-bold text-white mt-1">{response.routing_details[0].bank_name}</p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Info</span>
                  <p className="text-sm font-mono font-bold text-white mt-1">•••• {response.account_details[0].account_number_safe}</p>
                </div>
              </div>

              <div className="p-6 bg-black/60">
                <pre className="text-xs font-mono text-cyan-400 leading-relaxed overflow-x-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-96 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-600">
              <ShieldCheck size={48} className="opacity-30 mb-4" />
              <p className="text-sm font-medium">Awaiting Request</p>
              <p className="text-xs max-w-xs text-center mt-2 opacity-60">
                Fill out the parameters on the left to trigger a simulated micro-deposit verification call.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}