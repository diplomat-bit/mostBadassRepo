// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/CryptoTerminal.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  Zap, 
  ArrowUpRight, 
  Cpu, 
  TrendingUp, 
  Terminal as TerminalIcon, 
  Activity, 
  Loader2, 
  Plus, 
  RefreshCw,
  Pause,
  Play,
  Settings,
  BrainCircuit,
  BarChart3,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { cryptoService } from '../services/cryptoService.ts';
import { getFinancialAdviceStream } from '../services/geminiService.ts';
import { CoinMarketData, GlobalData, AIInsight, AITradingBot } from '../types/index.ts';

// --- UI Components ---

const AIStatusBadge: React.FC<{ status: 'active' | 'learning' | 'processing' | 'thinking' }> = ({ status }) => {
    const colors = {
        active: 'bg-emerald-500',
        learning: 'bg-blue-500',
        processing: 'bg-purple-500',
        thinking: 'bg-cyan-400',
    };
    const text = {
        active: 'Fleet Online',
        learning: 'Adapting Models',
        processing: 'High Compute',
        thinking: 'Synthesizing Alpha',
    }
    
    return (
        <div className="flex items-center space-x-2 bg-black px-3 py-1.5 rounded-full border border-zinc-800 shadow-inner">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${colors[status]}`}></span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{text[status]}</span>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-6 py-4 text-[10px] font-black tracking-[0.2em] transition-all duration-300 border-b-2 uppercase whitespace-nowrap ${
            active 
            ? 'border-blue-500 text-white bg-blue-500/5' 
            : 'border-transparent text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02]'
        }`}
    >
        {label}
    </button>
);

const TerminalCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({ title, subtitle, children, className = "" }) => (
  <div className={`bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl ${className}`}>
      <div className="mb-6 relative z-10 flex justify-between items-start">
          <div>
              <h3 className="text-white font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {title}
              </h3>
              {subtitle && <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1">{subtitle}</p>}
          </div>
      </div>
      <div className="relative z-10">{children}</div>
  </div>
);

// --- Main Component ---

const CryptoTerminal: React.FC = () => {
    type ActiveTab = 'summary' | 'bot-fleet' | 'neural-intel' | 'quantum-depth';
    const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
    const [markets, setMarkets] = useState<CoinMarketData[]>([]);
    const [globalData, setGlobalData] = useState<GlobalData | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Stateful Bot Fleet Management
    const [bots, setBots] = useState<AITradingBot[]>([
        { id: 'bot-1', name: 'Orion Alpha', strategy: 'Arbitrage', status: 'active', pnl: 2450.12, uptime: '142h' },
        { id: 'bot-2', name: 'Vesper Node', strategy: 'Momentum', status: 'active', pnl: 810.45, uptime: '89h' },
        { id: 'bot-3', name: 'Helios Prime', strategy: 'Mean Reversion', status: 'paused', pnl: -120.30, uptime: '24h' },
        { id: 'bot-4', name: 'Ghost Protocol', strategy: 'Arbitrage', status: 'active', pnl: 11200.50, uptime: '450h' },
    ]);

    // Chat Interface
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ id: string; sender: 'user' | 'ai'; text: string; timestamp: Date }[]>([
        { id: '1', sender: 'ai', text: 'Fleet status verified. Orion Alpha is currently identifying spread opportunities on ETH/USDC.', timestamp: new Date() }
    ]);
    const [isAiThinking, setIsAiThinking] = useState(false);

    // --- Bot Logic ---
    const toggleBot = (id: string) => {
        setBots(prev => prev.map(bot => {
            if (bot.id === id) {
                const newStatus = bot.status === 'active' ? 'paused' : 'active';
                return { ...bot, status: newStatus as 'active' | 'paused' };
            }
            return bot;
        }));
    };

    const handleProvisionBot = () => {
        const name = prompt("Enter Neural Designation (e.g. Nebula 7):");
        if (!name) return;
        const newBot: AITradingBot = {
            id: `bot-${Date.now()}`,
            name,
            strategy: 'Momentum',
            status: 'active',
            pnl: 0,
            uptime: '0h'
        };
        setBots([newBot, ...bots]);
    };

    // --- Chat Logic ---
    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isAiThinking) return;
        
        const userMsg = { id: Date.now().toString(), sender: 'user' as const, text: chatInput, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsAiThinking(true);

        const assistantMsgId = (Date.now() + 1).toString();
        setChatHistory(prev => [...prev, { id: assistantMsgId, sender: 'ai', text: '', timestamp: new Date() }]);

        try {
            const context = { system: "NEXUS_OS_FLEET_CONTROL", activeBots: bots.filter(b => b.status === 'active').length };
            const stream = await getFinancialAdviceStream(chatInput, context);
            
            let fullContent = '';
            for await (const chunk of stream) {
                const text = chunk.text;
                if (text) {
                    fullContent += text;
                    setChatHistory(prev => prev.map(m => 
                        m.id === assistantMsgId ? { ...m, text: fullContent } : m
                    ));
                }
            }
        } catch (err) {
            setChatHistory(prev => prev.map(m => m.id === assistantMsgId ? { ...m, text: 'Neural handshake timed out. Core is still online.' } : m));
        } finally {
            setIsAiThinking(false);
        }
    };

    // --- Data Polling ---
    const fetchData = async () => {
        try {
            const [marketData, global] = await Promise.all([
                cryptoService.getMarkets('usd', 8),
                cryptoService.getGlobal()
            ]);
            setMarkets(marketData);
            setGlobalData(global);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // --- Mocks & Charts ---
    const aiInsights: AIInsight[] = useMemo(() => [
        { id: '1', type: 'alpha', message: 'Orion detected unusual L2 liquidity inflow on Optimism. Executing directional bid.', confidence: 98, timestamp: '15s ago', actionable: true },
        { id: '2', type: 'warning', message: 'Gas prices spiking. Vesper Node shifting to low-frequency mode.', confidence: 92, timestamp: '4m ago', actionable: false },
        { id: '3', type: 'opportunity', message: 'Ghost Protocol identifies BTC/USDC arbitrage on derivative nodes.', confidence: 99, timestamp: '12m ago', actionable: true }
    ], []);

    const quantumChartData = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
        name: `t-${40 - i}`,
        val: 50 + Math.sin(i / 5) * 30 + Math.random() * 10,
    })), []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Real-time Global Bar */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-y-0 left-0 w-1 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                <div className="flex items-center gap-10">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Cap</p>
                        <p className="text-sm font-bold text-white mono">
                            ${globalData ? (globalData.total_market_cap.usd / 1e12).toFixed(2) : '--'}T
                            <span className={`ml-2 text-[10px] ${(globalData?.market_cap_change_percentage_24h_usd ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {globalData?.market_cap_change_percentage_24h_usd?.toFixed(1) || '0.0'}%
                            </span>
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Fleet Health</p>
                        <div className="flex items-center gap-2">
                             <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                 <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '85%' }}></div>
                             </div>
                             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Optimal</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <AIStatusBadge status={isAiThinking ? 'thinking' : 'active'} />
                    <button onClick={fetchData} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 hover:text-white border border-zinc-800">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex overflow-x-auto border-b border-zinc-900 scrollbar-hide bg-black/20 rounded-t-3xl">
                <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} label="Control Summary" />
                <TabButton active={activeTab === 'bot-fleet'} onClick={() => setActiveTab('bot-fleet')} label="Manage Bot Fleet" />
                <TabButton active={activeTab === 'neural-intel'} onClick={() => setActiveTab('neural-intel')} label="Neural Intelligence" />
                <TabButton active={activeTab === 'quantum-depth'} onClick={() => setActiveTab('quantum-depth')} label="Quantum Depth" />
            </div>

            {/* View Layer */}
            {activeTab === 'summary' && (
                <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <TerminalCard title="Collective PNL Performance" subtitle="Total yield across 4 registered agents">
                                <div className="flex items-baseline gap-4 mt-4">
                                    <h3 className={`text-4xl font-black mono tracking-tighter ${bots.reduce((s, b) => s + b.pnl, 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        ${bots.reduce((s, b) => s + b.pnl, 0).toLocaleString()}
                                    </h3>
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Aggregated</span>
                                </div>
                                <div className="mt-8 space-y-4">
                                    {bots.slice(0, 3).map(bot => (
                                        <div key={bot.id} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-zinc-500 italic">{bot.name}</span>
                                            <span className={bot.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}>${bot.pnl.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                             </TerminalCard>

                             <TerminalCard title="Machine Sentiment" subtitle="Natural language model market polling">
                                <div className="space-y-6 pt-2">
                                    <div>
                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2">
                                            <span className="text-emerald-500">Bullish Momentum</span>
                                            <span className="text-white">74%</span>
                                        </div>
                                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                                            <div className="bg-emerald-500 h-full shadow-[0_0_10px_#10b981]" style={{ width: '74%' }}></div>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-black border border-zinc-900 rounded-2xl italic text-[11px] text-zinc-500 leading-relaxed font-medium">
                                        "LQI analysis detects extreme demand for Ethereum Layer 2 scaling tokens. Ghost Protocol is positioning for breakout."
                                    </div>
                                </div>
                             </TerminalCard>
                        </div>

                        <TerminalCard title="Live Subspace Signals" subtitle="Real-time entanglement of arbitrage opportunities">
                             <div className="h-64 w-full pt-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={quantumChartData}>
                                        <defs>
                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                             </div>
                        </TerminalCard>
                    </div>

                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <TerminalCard title="Recent Fleet Intel">
                            <div className="space-y-6">
                                {aiInsights.map(insight => (
                                    <div key={insight.id} className="border-l-2 border-zinc-800 pl-4 py-1 hover:border-blue-500/50 transition-all cursor-default">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{insight.type} • {insight.timestamp}</p>
                                        <p className="text-[11px] text-zinc-300 font-medium italic leading-relaxed">"{insight.message}"</p>
                                    </div>
                                ))}
                                <button onClick={() => setActiveTab('bot-fleet')} className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all border border-zinc-800 mt-4 flex items-center justify-center gap-3 shadow-xl">
                                    <Settings size={14} />
                                    Manage Registry
                                </button>
                            </div>
                        </TerminalCard>

                        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-6 opacity-10">
                                <BrainCircuit size={80} className="text-blue-500" />
                             </div>
                             <h4 className="text-white font-black text-xs uppercase tracking-widest italic mb-6">Neural Convergence</h4>
                             <p className="text-zinc-500 text-[11px] leading-relaxed mb-6 font-medium">Model parity is currently maintained at 99.98% across 12 distributed nodes.</p>
                             <div className="flex gap-2">
                                <span className="px-2 py-1 bg-blue-600/10 border border-blue-500/20 rounded text-[8px] font-black text-blue-400 uppercase">Flash 3.0</span>
                                <span className="px-2 py-1 bg-emerald-600/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-400 uppercase">Pro v2</span>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bot Fleet View */}
            {activeTab === 'bot-fleet' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TerminalCard title="Fleet Registry">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active Agents</p>
                                     <h3 className="text-3xl font-black text-white mono">{bots.filter(b => b.status === 'active').length} / {bots.length}</h3>
                                 </div>
                                 <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                                     <BrainCircuit size={24} />
                                 </div>
                             </div>
                        </TerminalCard>
                        <TerminalCard title="Aggregate Profit">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total USD Harvested</p>
                                     <h3 className={`text-3xl font-black mono ${bots.reduce((s, b) => s + b.pnl, 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        ${bots.reduce((s, b) => s + b.pnl, 0).toFixed(2)}
                                     </h3>
                                 </div>
                                 <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
                                     <TrendingUp size={24} />
                                 </div>
                             </div>
                        </TerminalCard>
                        <TerminalCard title="Node Provisioning">
                             <button 
                                onClick={handleProvisionBot}
                                className="w-full h-full min-h-[80px] flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-xl shadow-blue-900/20 group"
                             >
                                 <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500 mb-1" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Initialize Agent</span>
                             </button>
                        </TerminalCard>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-zinc-900 bg-black/20 flex items-center justify-between">
                            <h3 className="text-white font-black uppercase tracking-widest italic flex items-center gap-3 text-sm">
                                <TerminalIcon size={18} className="text-blue-500" />
                                Neural Control Matrix
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-zinc-900 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                        <th className="p-8">Agent Identity</th>
                                        <th className="p-8">Neural Strategy</th>
                                        <th className="p-8">Performance (PNL)</th>
                                        <th className="p-8">Sync Uptime</th>
                                        <th className="p-8 text-right">Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-900">
                                    {bots.map(bot => (
                                        <tr key={bot.id} className="group hover:bg-white/[0.01] transition-all">
                                            <td className="p-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${bot.status === 'active' ? 'bg-blue-600/10 border-blue-500/20 text-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                                                        <Activity size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white uppercase italic">{bot.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${bot.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
                                                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{bot.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-400 rounded-lg">
                                                    {bot.strategy}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <p className={`text-sm font-black mono ${bot.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {bot.pnl >= 0 ? '+' : ''}${bot.pnl.toFixed(2)}
                                                </p>
                                            </td>
                                            <td className="p-8 text-zinc-500 font-mono text-xs font-bold">
                                                {bot.uptime}
                                            </td>
                                            <td className="p-8 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => toggleBot(bot.id)}
                                                        className={`p-3 rounded-xl transition-all border ${bot.status === 'active' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                                                        title={bot.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
                                                    >
                                                        {bot.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                                                    </button>
                                                    <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all shadow-xl">
                                                        <Settings size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Neural Intel Tab */}
            {activeTab === 'neural-intel' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <TerminalCard title="Raw Alpha Stream" subtitle="Machine-generated signals filtered for corporate treasury">
                             <div className="space-y-4">
                                {aiInsights.map(insight => (
                                    <div key={insight.id} className="bg-black border border-zinc-900 p-8 rounded-3xl flex items-start gap-8 hover:border-blue-500/30 transition-all group/item shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/item:opacity-10 transition-opacity">
                                            <Zap size={60} />
                                        </div>
                                        <div className={`mt-1.5 p-3 rounded-xl ${insight.type === 'alpha' ? 'bg-amber-400/10 text-amber-400' : 'bg-blue-500/10 text-blue-500'} border border-white/5`}>
                                            <TrendingUp size={24} />
                                        </div>
                                        <div className="flex-1 space-y-4 relative z-10">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{insight.type} signal detected • {insight.timestamp}</h4>
                                                <span className="px-3 py-1 bg-zinc-900 rounded-full text-[9px] font-black text-blue-500 border border-blue-500/20 shadow-[0_0_10px_#3b82f622]">{insight.confidence}% Match</span>
                                            </div>
                                            <p className="text-zinc-200 text-lg font-bold leading-relaxed italic tracking-tight">"{insight.message}"</p>
                                            {insight.actionable && (
                                                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20">Authorize Trade</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </TerminalCard>
                    </div>
                    <div className="lg:col-span-1">
                        <TerminalCard title="Neural Terminal">
                            <div className="h-[400px] overflow-y-auto space-y-6 mb-6 custom-scrollbar pr-2">
                                {chatHistory.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[90%] p-6 rounded-[2rem] text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/20 font-bold' : 'bg-black border border-zinc-900 text-zinc-300 rounded-tl-none italic'}`}>
                                            {msg.text || (isAiThinking && <Loader2 className="animate-spin" size={14} />)}
                                            <p className={`text-[8px] mt-3 font-black uppercase tracking-widest opacity-40 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour12: false })} • {msg.sender === 'user' ? 'U_IDENT' : 'NEXUS_OUT'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleChatSubmit} className="relative">
                                <input 
                                    value={chatInput} 
                                    onChange={(e) => setChatInput(e.target.value)} 
                                    placeholder="Query fleet intelligence..." 
                                    className="w-full bg-black border border-zinc-800 rounded-2xl py-5 pl-8 pr-16 text-white text-xs outline-none focus:border-blue-500 transition-all font-bold placeholder:text-zinc-800" 
                                />
                                <button type="submit" disabled={isAiThinking} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white disabled:opacity-50 shadow-xl shadow-blue-900/30 transition-all">
                                    <ArrowUpRight size={20} />
                                </button>
                            </form>
                        </TerminalCard>
                    </div>
                </div>
            )}

            {/* Depth Tab */}
            {activeTab === 'quantum-depth' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                     <TerminalCard title="Price Action Entanglement" subtitle="Monitoring subspace correlation between BTC and ETH nodes">
                        <div className="h-96 w-full pt-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={quantumChartData}>
                                    <defs>
                                        <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide />
                                    <Area type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSignal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </TerminalCard>
                    <TerminalCard title="Network Load Analysis">
                         <div className="flex flex-col items-center justify-center h-96 text-center space-y-8">
                            <div className="w-40 h-40 rounded-full border-8 border-zinc-900 flex items-center justify-center relative">
                                 <div className="absolute inset-0 rounded-full border-8 border-t-emerald-500 border-r-emerald-500 border-b-emerald-500/20 border-l-emerald-500/20 animate-spin [animation-duration:3s]"></div>
                                 <h3 className="text-4xl font-black text-white mono">82<span className="text-sm text-zinc-600">%</span></h3>
                            </div>
                            <div>
                                <p className="text-white font-black text-sm uppercase tracking-widest italic">Core Utilization</p>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-2">Node stability verified across all regions</p>
                            </div>
                         </div>
                    </TerminalCard>
                </div>
            )}
        </div>
    );
};

export default CryptoTerminal;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/CryptoTerminal.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  Zap, 
  ArrowUpRight, 
  Cpu, 
  TrendingUp, 
  Terminal as TerminalIcon, 
  Activity, 
  Loader2, 
  Plus, 
  RefreshCw,
  Pause,
  Play,
  Settings,
  BrainCircuit,
  BarChart3,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { cryptoService } from '../services/cryptoService.ts';
import { getFinancialAdviceStream } from '../services/geminiService.ts';
import { CoinMarketData, GlobalData, AIInsight, AITradingBot } from '../types/index.ts';

// --- UI Components ---

const AIStatusBadge: React.FC<{ status: 'active' | 'learning' | 'processing' | 'thinking' }> = ({ status }) => {
    const colors = {
        active: 'bg-emerald-500',
        learning: 'bg-blue-500',
        processing: 'bg-purple-500',
        thinking: 'bg-cyan-400',
    };
    const text = {
        active: 'Fleet Online',
        learning: 'Adapting Models',
        processing: 'High Compute',
        thinking: 'Synthesizing Alpha',
    }
    
    return (
        <div className="flex items-center space-x-2 bg-black px-3 py-1.5 rounded-full border border-zinc-800 shadow-inner">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${colors[status]}`}></span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{text[status]}</span>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-6 py-4 text-[10px] font-black tracking-[0.2em] transition-all duration-300 border-b-2 uppercase whitespace-nowrap ${
            active 
            ? 'border-blue-500 text-white bg-blue-500/5' 
            : 'border-transparent text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02]'
        }`}
    >
        {label}
    </button>
);

const TerminalCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({ title, subtitle, children, className = "" }) => (
  <div className={`bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl ${className}`}>
      <div className="mb-6 relative z-10 flex justify-between items-start">
          <div>
              <h3 className="text-white font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {title}
              </h3>
              {subtitle && <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1">{subtitle}</p>}
          </div>
      </div>
      <div className="relative z-10">{children}</div>
  </div>
);

// --- Main Component ---

const CryptoTerminal: React.FC = () => {
    type ActiveTab = 'summary' | 'bot-fleet' | 'neural-intel' | 'quantum-depth';
    const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
    const [markets, setMarkets] = useState<CoinMarketData[]>([]);
    const [globalData, setGlobalData] = useState<GlobalData | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Stateful Bot Fleet Management
    const [bots, setBots] = useState<AITradingBot[]>([
        { id: 'bot-1', name: 'Orion Alpha', strategy: 'Arbitrage', status: 'active', pnl: 2450.12, uptime: '142h' },
        { id: 'bot-2', name: 'Vesper Node', strategy: 'Momentum', status: 'active', pnl: 810.45, uptime: '89h' },
        { id: 'bot-3', name: 'Helios Prime', strategy: 'Mean Reversion', status: 'paused', pnl: -120.30, uptime: '24h' },
        { id: 'bot-4', name: 'Ghost Protocol', strategy: 'Arbitrage', status: 'active', pnl: 11200.50, uptime: '450h' },
    ]);

    // Chat Interface
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ id: string; sender: 'user' | 'ai'; text: string; timestamp: Date }[]>([
        { id: '1', sender: 'ai', text: 'Fleet status verified. Orion Alpha is currently identifying spread opportunities on ETH/USDC.', timestamp: new Date() }
    ]);
    const [isAiThinking, setIsAiThinking] = useState(false);

    // --- Bot Logic ---
    const toggleBot = (id: string) => {
        setBots(prev => prev.map(bot => {
            if (bot.id === id) {
                const newStatus = bot.status === 'active' ? 'paused' : 'active';
                return { ...bot, status: newStatus as 'active' | 'paused' };
            }
            return bot;
        }));
    };

    const handleProvisionBot = () => {
        const name = prompt("Enter Neural Designation (e.g. Nebula 7):");
        if (!name) return;
        const newBot: AITradingBot = {
            id: `bot-${Date.now()}`,
            name,
            strategy: 'Momentum',
            status: 'active',
            pnl: 0,
            uptime: '0h'
        };
        setBots([newBot, ...bots]);
    };

    // --- Chat Logic ---
    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isAiThinking) return;
        
        const userMsg = { id: Date.now().toString(), sender: 'user' as const, text: chatInput, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsAiThinking(true);

        const assistantMsgId = (Date.now() + 1).toString();
        setChatHistory(prev => [...prev, { id: assistantMsgId, sender: 'ai', text: '', timestamp: new Date() }]);

        try {
            const context = { system: "NEXUS_OS_FLEET_CONTROL", activeBots: bots.filter(b => b.status === 'active').length };
            const stream = await getFinancialAdviceStream(chatInput, context);
            
            let fullContent = '';
            for await (const chunk of stream) {
                const text = chunk.text;
                if (text) {
                    fullContent += text;
                    setChatHistory(prev => prev.map(m => 
                        m.id === assistantMsgId ? { ...m, text: fullContent } : m
                    ));
                }
            }
        } catch (err) {
            setChatHistory(prev => prev.map(m => m.id === assistantMsgId ? { ...m, text: 'Neural handshake timed out. Core is still online.' } : m));
        } finally {
            setIsAiThinking(false);
        }
    };

    // --- Data Polling ---
    const fetchData = async () => {
        try {
            const [marketData, global] = await Promise.all([
                cryptoService.getMarkets('usd', 8),
                cryptoService.getGlobal()
            ]);
            setMarkets(marketData);
            setGlobalData(global);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // --- Mocks & Charts ---
    const aiInsights: AIInsight[] = useMemo(() => [
        { id: '1', type: 'alpha', message: 'Orion detected unusual L2 liquidity inflow on Optimism. Executing directional bid.', confidence: 98, timestamp: '15s ago', actionable: true },
        { id: '2', type: 'warning', message: 'Gas prices spiking. Vesper Node shifting to low-frequency mode.', confidence: 92, timestamp: '4m ago', actionable: false },
        { id: '3', type: 'opportunity', message: 'Ghost Protocol identifies BTC/USDC arbitrage on derivative nodes.', confidence: 99, timestamp: '12m ago', actionable: true }
    ], []);

    const quantumChartData = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
        name: `t-${40 - i}`,
        val: 50 + Math.sin(i / 5) * 30 + Math.random() * 10,
    })), []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Real-time Global Bar */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-y-0 left-0 w-1 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                <div className="flex items-center gap-10">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Cap</p>
                        <p className="text-sm font-bold text-white mono">
                            ${globalData ? (globalData.total_market_cap.usd / 1e12).toFixed(2) : '--'}T
                            <span className={`ml-2 text-[10px] ${(globalData?.market_cap_change_percentage_24h_usd ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {globalData?.market_cap_change_percentage_24h_usd?.toFixed(1) || '0.0'}%
                            </span>
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Fleet Health</p>
                        <div className="flex items-center gap-2">
                             <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                 <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '85%' }}></div>
                             </div>
                             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Optimal</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <AIStatusBadge status={isAiThinking ? 'thinking' : 'active'} />
                    <button onClick={fetchData} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 hover:text-white border border-zinc-800">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex overflow-x-auto border-b border-zinc-900 scrollbar-hide bg-black/20 rounded-t-3xl">
                <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} label="Control Summary" />
                <TabButton active={activeTab === 'bot-fleet'} onClick={() => setActiveTab('bot-fleet')} label="Manage Bot Fleet" />
                <TabButton active={activeTab === 'neural-intel'} onClick={() => setActiveTab('neural-intel')} label="Neural Intelligence" />
                <TabButton active={activeTab === 'quantum-depth'} onClick={() => setActiveTab('quantum-depth')} label="Quantum Depth" />
            </div>

            {/* View Layer */}
            {activeTab === 'summary' && (
                <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <TerminalCard title="Collective PNL Performance" subtitle="Total yield across 4 registered agents">
                                <div className="flex items-baseline gap-4 mt-4">
                                    <h3 className={`text-4xl font-black mono tracking-tighter ${bots.reduce((s, b) => s + b.pnl, 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        ${bots.reduce((s, b) => s + b.pnl, 0).toLocaleString()}
                                    </h3>
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Aggregated</span>
                                </div>
                                <div className="mt-8 space-y-4">
                                    {bots.slice(0, 3).map(bot => (
                                        <div key={bot.id} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-zinc-500 italic">{bot.name}</span>
                                            <span className={bot.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}>${bot.pnl.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                             </TerminalCard>

                             <TerminalCard title="Machine Sentiment" subtitle="Natural language model market polling">
                                <div className="space-y-6 pt-2">
                                    <div>
                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2">
                                            <span className="text-emerald-500">Bullish Momentum</span>
                                            <span className="text-white">74%</span>
                                        </div>
                                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                                            <div className="bg-emerald-500 h-full shadow-[0_0_10px_#10b981]" style={{ width: '74%' }}></div>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-black border border-zinc-900 rounded-2xl italic text-[11px] text-zinc-500 leading-relaxed font-medium">
                                        "LQI analysis detects extreme demand for Ethereum Layer 2 scaling tokens. Ghost Protocol is positioning for breakout."
                                    </div>
                                </div>
                             </TerminalCard>
                        </div>

                        <TerminalCard title="Live Subspace Signals" subtitle="Real-time entanglement of arbitrage opportunities">
                             <div className="h-64 w-full pt-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={quantumChartData}>
                                        <defs>
                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                             </div>
                        </TerminalCard>
                    </div>

                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <TerminalCard title="Recent Fleet Intel">
                            <div className="space-y-6">
                                {aiInsights.map(insight => (
                                    <div key={insight.id} className="border-l-2 border-zinc-800 pl-4 py-1 hover:border-blue-500/50 transition-all cursor-default">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{insight.type} • {insight.timestamp}</p>
                                        <p className="text-[11px] text-zinc-300 font-medium italic leading-relaxed">"{insight.message}"</p>
                                    </div>
                                ))}
                                <button onClick={() => setActiveTab('bot-fleet')} className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all border border-zinc-800 mt-4 flex items-center justify-center gap-3 shadow-xl">
                                    <Settings size={14} />
                                    Manage Registry
                                </button>
                            </div>
                        </TerminalCard>

                        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-6 opacity-10">
                                <BrainCircuit size={80} className="text-blue-500" />
                             </div>
                             <h4 className="text-white font-black text-xs uppercase tracking-widest italic mb-6">Neural Convergence</h4>
                             <p className="text-zinc-500 text-[11px] leading-relaxed mb-6 font-medium">Model parity is currently maintained at 99.98% across 12 distributed nodes.</p>
                             <div className="flex gap-2">
                                <span className="px-2 py-1 bg-blue-600/10 border border-blue-500/20 rounded text-[8px] font-black text-blue-400 uppercase">Flash 3.0</span>
                                <span className="px-2 py-1 bg-emerald-600/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-400 uppercase">Pro v2</span>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bot Fleet View */}
            {activeTab === 'bot-fleet' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TerminalCard title="Fleet Registry">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active Agents</p>
                                     <h3 className="text-3xl font-black text-white mono">{bots.filter(b => b.status === 'active').length} / {bots.length}</h3>
                                 </div>
                                 <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                                     <BrainCircuit size={24} />
                                 </div>
                             </div>
                        </TerminalCard>
                        <TerminalCard title="Aggregate Profit">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total USD Harvested</p>
                                     <h3 className={`text-3xl font-black mono ${bots.reduce((s, b) => s + b.pnl, 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        ${bots.reduce((s, b) => s + b.pnl, 0).toFixed(2)}
                                     </h3>
                                 </div>
                                 <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
                                     <TrendingUp size={24} />
                                 </div>
                             </div>
                        </TerminalCard>
                        <TerminalCard title="Node Provisioning">
                             <button 
                                onClick={handleProvisionBot}
                                className="w-full h-full min-h-[80px] flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-xl shadow-blue-900/20 group"
                             >
                                 <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500 mb-1" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Initialize Agent</span>
                             </button>
                        </TerminalCard>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-zinc-900 bg-black/20 flex items-center justify-between">
                            <h3 className="text-white font-black uppercase tracking-widest italic flex items-center gap-3 text-sm">
                                <TerminalIcon size={18} className="text-blue-500" />
                                Neural Control Matrix
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-zinc-900 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                        <th className="p-8">Agent Identity</th>
                                        <th className="p-8">Neural Strategy</th>
                                        <th className="p-8">Performance (PNL)</th>
                                        <th className="p-8">Sync Uptime</th>
                                        <th className="p-8 text-right">Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-900">
                                    {bots.map(bot => (
                                        <tr key={bot.id} className="group hover:bg-white/[0.01] transition-all">
                                            <td className="p-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${bot.status === 'active' ? 'bg-blue-600/10 border-blue-500/20 text-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                                                        <Activity size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white uppercase italic">{bot.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${bot.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
                                                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{bot.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-400 rounded-lg">
                                                    {bot.strategy}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <p className={`text-sm font-black mono ${bot.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {bot.pnl >= 0 ? '+' : ''}${bot.pnl.toFixed(2)}
                                                </p>
                                            </td>
                                            <td className="p-8 text-zinc-500 font-mono text-xs font-bold">
                                                {bot.uptime}
                                            </td>
                                            <td className="p-8 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => toggleBot(bot.id)}
                                                        className={`p-3 rounded-xl transition-all border ${bot.status === 'active' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                                                        title={bot.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
                                                    >
                                                        {bot.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                                                    </button>
                                                    <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all shadow-xl">
                                                        <Settings size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Neural Intel Tab */}
            {activeTab === 'neural-intel' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <TerminalCard title="Raw Alpha Stream" subtitle="Machine-generated signals filtered for corporate treasury">
                             <div className="space-y-4">
                                {aiInsights.map(insight => (
                                    <div key={insight.id} className="bg-black border border-zinc-900 p-8 rounded-3xl flex items-start gap-8 hover:border-blue-500/30 transition-all group/item shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/item:opacity-10 transition-opacity">
                                            <Zap size={60} />
                                        </div>
                                        <div className={`mt-1.5 p-3 rounded-xl ${insight.type === 'alpha' ? 'bg-amber-400/10 text-amber-400' : 'bg-blue-500/10 text-blue-500'} border border-white/5`}>
                                            <TrendingUp size={24} />
                                        </div>
                                        <div className="flex-1 space-y-4 relative z-10">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{insight.type} signal detected • {insight.timestamp}</h4>
                                                <span className="px-3 py-1 bg-zinc-900 rounded-full text-[9px] font-black text-blue-500 border border-blue-500/20 shadow-[0_0_10px_#3b82f622]">{insight.confidence}% Match</span>
                                            </div>
                                            <p className="text-zinc-200 text-lg font-bold leading-relaxed italic tracking-tight">"{insight.message}"</p>
                                            {insight.actionable && (
                                                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20">Authorize Trade</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </TerminalCard>
                    </div>
                    <div className="lg:col-span-1">
                        <TerminalCard title="Neural Terminal">
                            <div className="h-[400px] overflow-y-auto space-y-6 mb-6 custom-scrollbar pr-2">
                                {chatHistory.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[90%] p-6 rounded-[2rem] text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/20 font-bold' : 'bg-black border border-zinc-900 text-zinc-300 rounded-tl-none italic'}`}>
                                            {msg.text || (isAiThinking && <Loader2 className="animate-spin" size={14} />)}
                                            <p className={`text-[8px] mt-3 font-black uppercase tracking-widest opacity-40 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour12: false })} • {msg.sender === 'user' ? 'U_IDENT' : 'NEXUS_OUT'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleChatSubmit} className="relative">
                                <input 
                                    value={chatInput} 
                                    onChange={(e) => setChatInput(e.target.value)} 
                                    placeholder="Query fleet intelligence..." 
                                    className="w-full bg-black border border-zinc-800 rounded-2xl py-5 pl-8 pr-16 text-white text-xs outline-none focus:border-blue-500 transition-all font-bold placeholder:text-zinc-800" 
                                />
                                <button type="submit" disabled={isAiThinking} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white disabled:opacity-50 shadow-xl shadow-blue-900/30 transition-all">
                                    <ArrowUpRight size={20} />
                                </button>
                            </form>
                        </TerminalCard>
                    </div>
                </div>
            )}

            {/* Depth Tab */}
            {activeTab === 'quantum-depth' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                     <TerminalCard title="Price Action Entanglement" subtitle="Monitoring subspace correlation between BTC and ETH nodes">
                        <div className="h-96 w-full pt-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={quantumChartData}>
                                    <defs>
                                        <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide />
                                    <Area type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSignal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </TerminalCard>
                    <TerminalCard title="Network Load Analysis">
                         <div className="flex flex-col items-center justify-center h-96 text-center space-y-8">
                            <div className="w-40 h-40 rounded-full border-8 border-zinc-900 flex items-center justify-center relative">
                                 <div className="absolute inset-0 rounded-full border-8 border-t-emerald-500 border-r-emerald-500 border-b-emerald-500/20 border-l-emerald-500/20 animate-spin [animation-duration:3s]"></div>
                                 <h3 className="text-4xl font-black text-white mono">82<span className="text-sm text-zinc-600">%</span></h3>
                            </div>
                            <div>
                                <p className="text-white font-black text-sm uppercase tracking-widest italic">Core Utilization</p>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-2">Node stability verified across all regions</p>
                            </div>
                         </div>
                    </TerminalCard>
                </div>
            )}
        </div>
    );
};

export default CryptoTerminal;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/CryptoTerminal.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  Zap, 
  ArrowUpRight, 
  Cpu, 
  TrendingUp, 
  Terminal as TerminalIcon, 
  Activity, 
  Loader2, 
  Plus, 
  RefreshCw,
  Pause,
  Play,
  Settings,
  BrainCircuit,
  BarChart3,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { cryptoService } from '../services/cryptoService.ts';
import { getFinancialAdviceStream } from '../services/geminiService.ts';
import { CoinMarketData, GlobalData, AIInsight, AITradingBot } from '../types/index.ts';

// --- UI Components ---

const AIStatusBadge: React.FC<{ status: 'active' | 'learning' | 'processing' | 'thinking' }> = ({ status }) => {
    const colors = {
        active: 'bg-emerald-500',
        learning: 'bg-blue-500',
        processing: 'bg-purple-500',
        thinking: 'bg-cyan-400',
    };
    const text = {
        active: 'Fleet Online',
        learning: 'Adapting Models',
        processing: 'High Compute',
        thinking: 'Synthesizing Alpha',
    }
    
    return (
        <div className="flex items-center space-x-2 bg-black px-3 py-1.5 rounded-full border border-zinc-800 shadow-inner">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${colors[status]}`}></span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{text[status]}</span>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-6 py-4 text-[10px] font-black tracking-[0.2em] transition-all duration-300 border-b-2 uppercase whitespace-nowrap ${
            active 
            ? 'border-blue-500 text-white bg-blue-500/5' 
            : 'border-transparent text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02]'
        }`}
    >
        {label}
    </button>
);

const TerminalCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({ title, subtitle, children, className = "" }) => (
  <div className={`bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl ${className}`}>
      <div className="mb-6 relative z-10 flex justify-between items-start">
          <div>
              <h3 className="text-white font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {title}
              </h3>
              {subtitle && <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1">{subtitle}</p>}
          </div>
      </div>
      <div className="relative z-10">{children}</div>
  </div>
);

// --- Main Component ---

const CryptoTerminal: React.FC = () => {
    type ActiveTab = 'summary' | 'bot-fleet' | 'neural-intel' | 'quantum-depth';
    const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
    const [markets, setMarkets] = useState<CoinMarketData[]>([]);
    const [globalData, setGlobalData] = useState<GlobalData | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Stateful Bot Fleet Management
    const [bots, setBots] = useState<AITradingBot[]>([
        { id: 'bot-1', name: 'Orion Alpha', strategy: 'Arbitrage', status: 'active', pnl: 2450.12, uptime: '142h' },
        { id: 'bot-2', name: 'Vesper Node', strategy: 'Momentum', status: 'active', pnl: 810.45, uptime: '89h' },
        { id: 'bot-3', name: 'Helios Prime', strategy: 'Mean Reversion', status: 'paused', pnl: -120.30, uptime: '24h' },
        { id: 'bot-4', name: 'Ghost Protocol', strategy: 'Arbitrage', status: 'active', pnl: 11200.50, uptime: '450h' },
    ]);

    // Chat Interface
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ id: string; sender: 'user' | 'ai'; text: string; timestamp: Date }[]>([
        { id: '1', sender: 'ai', text: 'Fleet status verified. Orion Alpha is currently identifying spread opportunities on ETH/USDC.', timestamp: new Date() }
    ]);
    const [isAiThinking, setIsAiThinking] = useState(false);

    // --- Bot Logic ---
    const toggleBot = (id: string) => {
        setBots(prev => prev.map(bot => {
            if (bot.id === id) {
                const newStatus = bot.status === 'active' ? 'paused' : 'active';
                return { ...bot, status: newStatus as 'active' | 'paused' };
            }
            return bot;
        }));
    };

    const handleProvisionBot = () => {
        const name = prompt("Enter Neural Designation (e.g. Nebula 7):");
        if (!name) return;
        const newBot: AITradingBot = {
            id: `bot-${Date.now()}`,
            name,
            strategy: 'Momentum',
            status: 'active',
            pnl: 0,
            uptime: '0h'
        };
        setBots([newBot, ...bots]);
    };

    // --- Chat Logic ---
    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isAiThinking) return;
        
        const userMsg = { id: Date.now().toString(), sender: 'user' as const, text: chatInput, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsAiThinking(true);

        const assistantMsgId = (Date.now() + 1).toString();
        setChatHistory(prev => [...prev, { id: assistantMsgId, sender: 'ai', text: '', timestamp: new Date() }]);

        try {
            const context = { system: "NEXUS_OS_FLEET_CONTROL", activeBots: bots.filter(b => b.status === 'active').length };
            const stream = await getFinancialAdviceStream(chatInput, context);
            
            let fullContent = '';
            for await (const chunk of stream) {
                const text = chunk.text;
                if (text) {
                    fullContent += text;
                    setChatHistory(prev => prev.map(m => 
                        m.id === assistantMsgId ? { ...m, text: fullContent } : m
                    ));
                }
            }
        } catch (err) {
            setChatHistory(prev => prev.map(m => m.id === assistantMsgId ? { ...m, text: 'Neural handshake timed out. Core is still online.' } : m));
        } finally {
            setIsAiThinking(false);
        }
    };

    // --- Data Polling ---
    const fetchData = async () => {
        try {
            const [marketData, global] = await Promise.all([
                cryptoService.getMarkets('usd', 8),
                cryptoService.getGlobal()
            ]);
            setMarkets(marketData);
            setGlobalData(global);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // --- Mocks & Charts ---
    const aiInsights: AIInsight[] = useMemo(() => [
        { id: '1', type: 'alpha', message: 'Orion detected unusual L2 liquidity inflow on Optimism. Executing directional bid.', confidence: 98, timestamp: '15s ago', actionable: true },
        { id: '2', type: 'warning', message: 'Gas prices spiking. Vesper Node shifting to low-frequency mode.', confidence: 92, timestamp: '4m ago', actionable: false },
        { id: '3', type: 'opportunity', message: 'Ghost Protocol identifies BTC/USDC arbitrage on derivative nodes.', confidence: 99, timestamp: '12m ago', actionable: true }
    ], []);

    const quantumChartData = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
        name: `t-${40 - i}`,
        val: 50 + Math.sin(i / 5) * 30 + Math.random() * 10,
    })), []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Real-time Global Bar */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-y-0 left-0 w-1 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                <div className="flex items-center gap-10">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Cap</p>
                        <p className="text-sm font-bold text-white mono">
                            ${globalData ? (globalData.total_market_cap.usd / 1e12).toFixed(2) : '--'}T
                            <span className={`ml-2 text-[10px] ${globalData?.market_cap_change_percentage_24h_usd >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {globalData?.market_cap_change_percentage_24h_usd.toFixed(1)}%
                            </span>
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Fleet Health</p>
                        <div className="flex items-center gap-2">
                             <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                 <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '85%' }}></div>
                             </div>
                             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Optimal</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <AIStatusBadge status={isAiThinking ? 'thinking' : 'active'} />
                    <button onClick={fetchData} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 hover:text-white border border-zinc-800">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex overflow-x-auto border-b border-zinc-900 scrollbar-hide bg-black/20 rounded-t-3xl">
                <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} label="Control Summary" />
                <TabButton active={activeTab === 'bot-fleet'} onClick={() => setActiveTab('bot-fleet')} label="Manage Bot Fleet" />
                <TabButton active={activeTab === 'neural-intel'} onClick={() => setActiveTab('neural-intel')} label="Neural Intelligence" />
                <TabButton active={activeTab === 'quantum-depth'} onClick={() => setActiveTab('quantum-depth')} label="Quantum Depth" />
            </div>

            {/* View Layer */}
            {activeTab === 'summary' && (
                <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <TerminalCard title="Collective PNL Performance" subtitle="Total yield across 4 registered agents">
                                <div className="flex items-baseline gap-4 mt-4">
                                    <h3 className={`text-4xl font-black mono tracking-tighter ${bots.reduce((s, b) => s + b.pnl, 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        ${bots.reduce((s, b) => s + b.pnl, 0).toLocaleString()}
                                    </h3>
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Aggregated</span>
                                </div>
                                <div className="mt-8 space-y-4">
                                    {bots.slice(0, 3).map(bot => (
                                        <div key={bot.id} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-zinc-500 italic">{bot.name}</span>
                                            <span className={bot.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}>${bot.pnl.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                             </TerminalCard>

                             <TerminalCard title="Machine Sentiment" subtitle="Natural language model market polling">
                                <div className="space-y-6 pt-2">
                                    <div>
                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2">
                                            <span className="text-emerald-500">Bullish Momentum</span>
                                            <span className="text-white">74%</span>
                                        </div>
                                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                                            <div className="bg-emerald-500 h-full shadow-[0_0_10px_#10b981]" style={{ width: '74%' }}></div>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-black border border-zinc-900 rounded-2xl italic text-[11px] text-zinc-500 leading-relaxed font-medium">
                                        "LQI analysis detects extreme demand for Ethereum Layer 2 scaling tokens. Ghost Protocol is positioning for breakout."
                                    </div>
                                </div>
                             </TerminalCard>
                        </div>

                        <TerminalCard title="Live Subspace Signals" subtitle="Real-time entanglement of arbitrage opportunities">
                             <div className="h-64 w-full pt-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={quantumChartData}>
                                        <defs>
                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                             </div>
                        </TerminalCard>
                    </div>

                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <TerminalCard title="Recent Fleet Intel">
                            <div className="space-y-6">
                                {aiInsights.map(insight => (
                                    <div key={insight.id} className="border-l-2 border-zinc-800 pl-4 py-1 hover:border-blue-500/50 transition-all cursor-default">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{insight.type} • {insight.timestamp}</p>
                                        <p className="text-[11px] text-zinc-300 font-medium italic leading-relaxed">"{insight.message}"</p>
                                    </div>
                                ))}
                                <button onClick={() => setActiveTab('bot-fleet')} className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all border border-zinc-800 mt-4 flex items-center justify-center gap-3 shadow-xl">
                                    <Settings size={14} />
                                    Manage Registry
                                </button>
                            </div>
                        </TerminalCard>

                        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-6 opacity-10">
                                <BrainCircuit size={80} className="text-blue-500" />
                             </div>
                             <h4 className="text-white font-black text-xs uppercase tracking-widest italic mb-6">Neural Convergence</h4>
                             <p className="text-zinc-500 text-[11px] leading-relaxed mb-6 font-medium">Model parity is currently maintained at 99.98% across 12 distributed nodes.</p>
                             <div className="flex gap-2">
                                <span className="px-2 py-1 bg-blue-600/10 border border-blue-500/20 rounded text-[8px] font-black text-blue-400 uppercase">Flash 3.0</span>
                                <span className="px-2 py-1 bg-emerald-600/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-400 uppercase">Pro v2</span>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bot Fleet View */}
            {activeTab === 'bot-fleet' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TerminalCard title="Fleet Registry">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active Agents</p>
                                     <h3 className="text-3xl font-black text-white mono">{bots.filter(b => b.status === 'active').length} / {bots.length}</h3>
                                 </div>
                                 <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                                     <BrainCircuit size={24} />
                                 </div>
                             </div>
                        </TerminalCard>
                        <TerminalCard title="Aggregate Profit">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total USD Harvested</p>
                                     <h3 className={`text-3xl font-black mono ${bots.reduce((s, b) => s + b.pnl, 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        ${bots.reduce((s, b) => s + b.pnl, 0).toFixed(2)}
                                     </h3>
                                 </div>
                                 <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
                                     <TrendingUp size={24} />
                                 </div>
                             </div>
                        </TerminalCard>
                        <TerminalCard title="Node Provisioning">
                             <button 
                                onClick={handleProvisionBot}
                                className="w-full h-full min-h-[80px] flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-xl shadow-blue-900/20 group"
                             >
                                 <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500 mb-1" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Initialize Agent</span>
                             </button>
                        </TerminalCard>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-zinc-900 bg-black/20 flex items-center justify-between">
                            <h3 className="text-white font-black uppercase tracking-widest italic flex items-center gap-3 text-sm">
                                <TerminalIcon size={18} className="text-blue-500" />
                                Neural Control Matrix
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-zinc-900 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                        <th className="p-8">Agent Identity</th>
                                        <th className="p-8">Neural Strategy</th>
                                        <th className="p-8">Performance (PNL)</th>
                                        <th className="p-8">Sync Uptime</th>
                                        <th className="p-8 text-right">Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-900">
                                    {bots.map(bot => (
                                        <tr key={bot.id} className="group hover:bg-white/[0.01] transition-all">
                                            <td className="p-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${bot.status === 'active' ? 'bg-blue-600/10 border-blue-500/20 text-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                                                        <Activity size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white uppercase italic">{bot.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${bot.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
                                                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{bot.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-400 rounded-lg">
                                                    {bot.strategy}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <p className={`text-sm font-black mono ${bot.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {bot.pnl >= 0 ? '+' : ''}${bot.pnl.toFixed(2)}
                                                </p>
                                            </td>
                                            <td className="p-8 text-zinc-500 font-mono text-xs font-bold">
                                                {bot.uptime}
                                            </td>
                                            <td className="p-8 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => toggleBot(bot.id)}
                                                        className={`p-3 rounded-xl transition-all border ${bot.status === 'active' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                                                        title={bot.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
                                                    >
                                                        {bot.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                                                    </button>
                                                    <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all shadow-xl">
                                                        <Settings size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Neural Intel Tab */}
            {activeTab === 'neural-intel' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <TerminalCard title="Raw Alpha Stream" subtitle="Machine-generated signals filtered for corporate treasury">
                             <div className="space-y-4">
                                {aiInsights.map(insight => (
                                    <div key={insight.id} className="bg-black border border-zinc-900 p-8 rounded-3xl flex items-start gap-8 hover:border-blue-500/30 transition-all group/item shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/item:opacity-10 transition-opacity">
                                            <Zap size={60} />
                                        </div>
                                        <div className={`mt-1.5 p-3 rounded-xl ${insight.type === 'alpha' ? 'bg-amber-400/10 text-amber-400' : 'bg-blue-500/10 text-blue-500'} border border-white/5`}>
                                            <TrendingUp size={24} />
                                        </div>
                                        <div className="flex-1 space-y-4 relative z-10">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{insight.type} signal detected • {insight.timestamp}</h4>
                                                <span className="px-3 py-1 bg-zinc-900 rounded-full text-[9px] font-black text-blue-500 border border-blue-500/20 shadow-[0_0_10px_#3b82f622]">{insight.confidence}% Match</span>
                                            </div>
                                            <p className="text-zinc-200 text-lg font-bold leading-relaxed italic tracking-tight">"{insight.message}"</p>
                                            {insight.actionable && (
                                                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20">Authorize Trade</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </TerminalCard>
                    </div>
                    <div className="lg:col-span-1">
                        <TerminalCard title="Neural Terminal">
                            <div className="h-[400px] overflow-y-auto space-y-6 mb-6 custom-scrollbar pr-2">
                                {chatHistory.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[90%] p-6 rounded-[2rem] text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/20 font-bold' : 'bg-black border border-zinc-900 text-zinc-300 rounded-tl-none italic'}`}>
                                            {msg.text || (isAiThinking && <Loader2 className="animate-spin" size={14} />)}
                                            <p className={`text-[8px] mt-3 font-black uppercase tracking-widest opacity-40 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour12: false })} • {msg.sender === 'user' ? 'U_IDENT' : 'NEXUS_OUT'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleChatSubmit} className="relative">
                                <input 
                                    value={chatInput} 
                                    onChange={(e) => setChatInput(e.target.value)} 
                                    placeholder="Query fleet intelligence..." 
                                    className="w-full bg-black border border-zinc-800 rounded-2xl py-5 pl-8 pr-16 text-white text-xs outline-none focus:border-blue-500 transition-all font-bold placeholder:text-zinc-800" 
                                />
                                <button type="submit" disabled={isAiThinking} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white disabled:opacity-50 shadow-xl shadow-blue-900/30 transition-all">
                                    <ArrowUpRight size={20} />
                                </button>
                            </form>
                        </TerminalCard>
                    </div>
                </div>
            )}

            {/* Depth Tab */}
            {activeTab === 'quantum-depth' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                     <TerminalCard title="Price Action Entanglement" subtitle="Monitoring subspace correlation between BTC and ETH nodes">
                        <div className="h-96 w-full pt-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={quantumChartData}>
                                    <defs>
                                        <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide />
                                    <Area type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSignal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </TerminalCard>
                    <TerminalCard title="Network Load Analysis">
                         <div className="flex flex-col items-center justify-center h-96 text-center space-y-8">
                            <div className="w-40 h-40 rounded-full border-8 border-zinc-900 flex items-center justify-center relative">
                                 <div className="absolute inset-0 rounded-full border-8 border-t-emerald-500 border-r-emerald-500 border-b-emerald-500/20 border-l-emerald-500/20 animate-spin [animation-duration:3s]"></div>
                                 <h3 className="text-4xl font-black text-white mono">82<span className="text-sm text-zinc-600">%</span></h3>
                            </div>
                            <div>
                                <p className="text-white font-black text-sm uppercase tracking-widest italic">Core Utilization</p>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-2">Node stability verified across all regions</p>
                            </div>
                         </div>
                    </TerminalCard>
                </div>
            )}
        </div>
    );
};

export default CryptoTerminal;
