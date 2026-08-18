// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Overview.tsx
================================================================================


import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Zap, 
  Activity, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  Terminal, 
  ShieldAlert,
  Building2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Shield,
  Loader2,
  ImageIcon,
  Server
} from 'lucide-react';
import { getSystemIntelligenceFeed, getPortfolioSuggestions } from '../services/geminiService';
import { apiClient } from '../services/api';
import { cryptoService } from '../services/cryptoService';
import { InternalAccount, AIInsight } from '../types/index';
import { CardSkeleton, Skeleton } from '../components/Skeleton';
import { TECHNICAL_REGISTRY } from './technical/technicalRegistry';

const MOCK_BALANCE_HISTORY = {
  '24H': [
    { time: '00:00', balance: 1245000 },
    { time: '04:00', balance: 1247000 },
    { time: '08:00', balance: 1246000 },
    { time: '12:00', balance: 1248000 },
    { time: '16:00', balance: 1249103 },
    { time: '20:00', balance: 1251200 },
  ],
  '7D': [
    { time: 'Mon', balance: 1100000 },
    { time: 'Tue', balance: 1150000 },
    { time: 'Wed', balance: 1240000 },
    { time: 'Thu', balance: 1220000 },
    { time: 'Fri', balance: 1250000 },
    { time: 'Sat', balance: 1260000 },
    { time: 'Sun', balance: 1251200 },
  ]
};

const StatCard = ({ label, value, trend, icon: Icon, color, subValue, onClick, loading }: any) => {
  if (loading) return <CardSkeleton />;
  return (
    <div 
      onClick={onClick}
      className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group relative overflow-hidden shadow-2xl cursor-pointer"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-2xl bg-white/5 text-white group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} text-[10px] font-black uppercase tracking-widest`}>
          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
        <h3 className="text-3xl font-bold text-white mono tracking-tighter mb-1">{value}</h3>
        {subValue && <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{subValue}</p>}
      </div>
    </div>
  );
};

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [activeRange, setActiveRange] = useState<keyof typeof MOCK_BALANCE_HISTORY>('24H');
  const [intelFeed, setIntelFeed] = useState<AIInsight[]>([]);
  const [bankingAccounts, setBankingAccounts] = useState<InternalAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [accounts, intel] = await Promise.all([
        apiClient.getRegistryNodes(),
        getSystemIntelligenceFeed()
      ]);
      setBankingAccounts(accounts);
      setIntelFeed(intel);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalLiquidity = useMemo(() => {
    return bankingAccounts.reduce((sum, acc) => sum + acc.availableBalance, 0);
  }, [bankingAccounts]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          loading={isLoading}
          label="Total Liquidity" 
          value={`$${totalLiquidity.toLocaleString()}`} 
          trend={12.4} 
          icon={Wallet} 
          color="blue" 
          subValue={`${bankingAccounts.length} Registry Nodes Active`} 
          onClick={() => navigate('/registry')} 
        />
        <StatCard 
          loading={isLoading} 
          label="Mesh Expansion" 
          value="999 Nodes" 
          trend={100} 
          icon={Server} 
          color="blue" 
          subValue="Protocol 999: SYNCHRONIZED" 
          onClick={() => navigate('/app-factory')}
        />
        <StatCard loading={isLoading} label="Fabric Load" value="1.2 P/s" trend={0.5} icon={Zap} color="blue" subValue="Subspace Polling Active" />
        <StatCard loading={isLoading} label="Deficit Offset" value="1,242 Kg" trend={-4.2} icon={Globe} color="rose" subValue="ESG Neutrality Level: AA" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8 min-w-0">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-6">
              <div>
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Aggregate <span className="text-blue-500 not-italic">Cash Curve</span></h2>
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-zinc-800' : 'bg-emerald-500'} animate-pulse`}></span>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Live Node Trace</p>
                </div>
              </div>
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                {(Object.keys(MOCK_BALANCE_HISTORY) as Array<keyof typeof MOCK_BALANCE_HISTORY>).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setActiveRange(t)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${t === activeRange ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full relative z-10 min-h-[400px] h-[400px]">
              {isLoading ? <Skeleton className="w-full h-full rounded-2xl" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_BALANCE_HISTORY[activeRange]}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 800 }} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} tick={{ fontWeight: 800 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#3b82f6', fontWeight: 900, fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8 min-w-0">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Quantum <span className="text-blue-500 not-italic">Intel</span></h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Neural Feedback Stream</p>
              </div>
              <Terminal size={18} className="text-zinc-700" />
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
              ) : (
                intelFeed.map((intel, idx) => (
                  <div key={idx} className="p-5 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group/item">
                    <div className="flex items-start gap-4">
                      {intel.severity === 'CRITICAL' ? <ShieldAlert size={16} className="text-rose-500 mt-1" /> : <Activity size={16} className="text-blue-500 mt-1" />}
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{intel.title}</p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed group-hover/item:text-zinc-300 transition-colors">{intel.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button onClick={() => navigate('/advisor')} className="mt-8 w-full py-5 bg-white/5 hover:bg-white text-white hover:text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10 flex items-center justify-center gap-4 shadow-xl">
              <ChevronRight size={18} />
              <span>Deep Advisory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Overview.tsx
================================================================================


import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Zap, 
  Activity, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  Terminal, 
  ShieldAlert,
  Building2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Shield,
  Loader2,
  ImageIcon,
  Server
} from 'lucide-react';
import { getSystemIntelligenceFeed, getPortfolioSuggestions } from '../services/geminiService';
import { apiClient } from '../services/api';
import { cryptoService } from '../services/cryptoService';
import { InternalAccount, AIInsight } from '../types/index';
import { CardSkeleton, Skeleton } from '../components/Skeleton';
import { TECHNICAL_REGISTRY } from './technical/technicalRegistry';

const MOCK_BALANCE_HISTORY = {
  '24H': [
    { time: '00:00', balance: 1245000 },
    { time: '04:00', balance: 1247000 },
    { time: '08:00', balance: 1246000 },
    { time: '12:00', balance: 1248000 },
    { time: '16:00', balance: 1249103 },
    { time: '20:00', balance: 1251200 },
  ],
  '7D': [
    { time: 'Mon', balance: 1100000 },
    { time: 'Tue', balance: 1150000 },
    { time: 'Wed', balance: 1240000 },
    { time: 'Thu', balance: 1220000 },
    { time: 'Fri', balance: 1250000 },
    { time: 'Sat', balance: 1260000 },
    { time: 'Sun', balance: 1251200 },
  ]
};

const StatCard = ({ label, value, trend, icon: Icon, color, subValue, onClick, loading }: any) => {
  if (loading) return <CardSkeleton />;
  return (
    <div 
      onClick={onClick}
      className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group relative overflow-hidden shadow-2xl cursor-pointer"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-2xl bg-white/5 text-white group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} text-[10px] font-black uppercase tracking-widest`}>
          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
        <h3 className="text-3xl font-bold text-white mono tracking-tighter mb-1">{value}</h3>
        {subValue && <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{subValue}</p>}
      </div>
    </div>
  );
};

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [activeRange, setActiveRange] = useState<keyof typeof MOCK_BALANCE_HISTORY>('24H');
  const [intelFeed, setIntelFeed] = useState<AIInsight[]>([]);
  const [bankingAccounts, setBankingAccounts] = useState<InternalAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [accounts, intel] = await Promise.all([
        apiClient.getRegistryNodes(),
        getSystemIntelligenceFeed()
      ]);
      setBankingAccounts(accounts);
      setIntelFeed(intel);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalLiquidity = useMemo(() => {
    return bankingAccounts.reduce((sum, acc) => sum + acc.availableBalance, 0);
  }, [bankingAccounts]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          loading={isLoading}
          label="Total Liquidity" 
          value={`$${totalLiquidity.toLocaleString()}`} 
          trend={12.4} 
          icon={Wallet} 
          color="blue" 
          subValue={`${bankingAccounts.length} Registry Nodes Active`} 
          onClick={() => navigate('/registry')} 
        />
        <StatCard 
          loading={isLoading} 
          label="Mesh Expansion" 
          value="999 Nodes" 
          trend={100} 
          icon={Server} 
          color="blue" 
          subValue="Protocol 999: SYNCHRONIZED" 
          onClick={() => navigate('/app-factory')}
        />
        <StatCard loading={isLoading} label="Fabric Load" value="1.2 P/s" trend={0.5} icon={Zap} color="blue" subValue="Subspace Polling Active" />
        <StatCard loading={isLoading} label="Deficit Offset" value="1,242 Kg" trend={-4.2} icon={Globe} color="rose" subValue="ESG Neutrality Level: AA" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8 min-w-0">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-6">
              <div>
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Aggregate <span className="text-blue-500 not-italic">Cash Curve</span></h2>
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-zinc-800' : 'bg-emerald-500'} animate-pulse`}></span>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Live Node Trace</p>
                </div>
              </div>
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                {(Object.keys(MOCK_BALANCE_HISTORY) as Array<keyof typeof MOCK_BALANCE_HISTORY>).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setActiveRange(t)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${t === activeRange ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full relative z-10 min-h-[400px] h-[400px]">
              {isLoading ? <Skeleton className="w-full h-full rounded-2xl" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_BALANCE_HISTORY[activeRange]}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 800 }} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} tick={{ fontWeight: 800 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#3b82f6', fontWeight: 900, fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8 min-w-0">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Quantum <span className="text-blue-500 not-italic">Intel</span></h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Neural Feedback Stream</p>
              </div>
              <Terminal size={18} className="text-zinc-700" />
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
              ) : (
                intelFeed.map((intel, idx) => (
                  <div key={idx} className="p-5 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group/item">
                    <div className="flex items-start gap-4">
                      {intel.severity === 'CRITICAL' ? <ShieldAlert size={16} className="text-rose-500 mt-1" /> : <Activity size={16} className="text-blue-500 mt-1" />}
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{intel.title}</p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed group-hover/item:text-zinc-300 transition-colors">{intel.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button onClick={() => navigate('/advisor')} className="mt-8 w-full py-5 bg-white/5 hover:bg-white text-white hover:text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10 flex items-center justify-center gap-4 shadow-xl">
              <ChevronRight size={18} />
              <span>Deep Advisory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Overview.tsx
================================================================================


import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Zap, 
  Activity, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  Terminal, 
  ShieldAlert,
  Building2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Shield,
  Loader2,
  ImageIcon,
  Server
} from 'lucide-react';
import { getSystemIntelligenceFeed, getPortfolioSuggestions } from '../services/geminiService';
import { apiClient } from '../services/api';
import { cryptoService } from '../services/cryptoService';
import { InternalAccount, AIInsight } from '../types/index';
import { CardSkeleton, Skeleton } from '../components/Skeleton';
import { TECHNICAL_REGISTRY } from './technical/technicalRegistry';

const MOCK_BALANCE_HISTORY = {
  '24H': [
    { time: '00:00', balance: 1245000 },
    { time: '04:00', balance: 1247000 },
    { time: '08:00', balance: 1246000 },
    { time: '12:00', balance: 1248000 },
    { time: '16:00', balance: 1249103 },
    { time: '20:00', balance: 1251200 },
  ],
  '7D': [
    { time: 'Mon', balance: 1100000 },
    { time: 'Tue', balance: 1150000 },
    { time: 'Wed', balance: 1240000 },
    { time: 'Thu', balance: 1220000 },
    { time: 'Fri', balance: 1250000 },
    { time: 'Sat', balance: 1260000 },
    { time: 'Sun', balance: 1251200 },
  ]
};

const StatCard = ({ label, value, trend, icon: Icon, color, subValue, onClick, loading }: any) => {
  if (loading) return <CardSkeleton />;
  return (
    <div 
      onClick={onClick}
      className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group relative overflow-hidden shadow-2xl cursor-pointer"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-2xl bg-white/5 text-white group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} text-[10px] font-black uppercase tracking-widest`}>
          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
        <h3 className="text-3xl font-bold text-white mono tracking-tighter mb-1">{value}</h3>
        {subValue && <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{subValue}</p>}
      </div>
    </div>
  );
};

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [activeRange, setActiveRange] = useState<keyof typeof MOCK_BALANCE_HISTORY>('24H');
  const [intelFeed, setIntelFeed] = useState<AIInsight[]>([]);
  const [bankingAccounts, setBankingAccounts] = useState<InternalAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [accounts, intel] = await Promise.all([
        apiClient.getRegistryNodes(),
        getSystemIntelligenceFeed()
      ]);
      setBankingAccounts(accounts);
      setIntelFeed(intel);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalLiquidity = useMemo(() => {
    return bankingAccounts.reduce((sum, acc) => sum + acc.availableBalance, 0);
  }, [bankingAccounts]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          loading={isLoading}
          label="Total Liquidity" 
          value={`$${totalLiquidity.toLocaleString()}`} 
          trend={12.4} 
          icon={Wallet} 
          color="blue" 
          subValue={`${bankingAccounts.length} Registry Nodes Active`} 
          onClick={() => navigate('/registry')} 
        />
        <StatCard 
          loading={isLoading} 
          label="Mesh Expansion" 
          value="999 Nodes" 
          trend={100} 
          icon={Server} 
          color="blue" 
          subValue="Protocol 999: SYNCHRONIZED" 
          onClick={() => navigate('/app-factory')}
        />
        <StatCard loading={isLoading} label="Fabric Load" value="1.2 P/s" trend={0.5} icon={Zap} color="blue" subValue="Subspace Polling Active" />
        <StatCard loading={isLoading} label="Deficit Offset" value="1,242 Kg" trend={-4.2} icon={Globe} color="rose" subValue="ESG Neutrality Level: AA" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8 min-w-0">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-6">
              <div>
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Aggregate <span className="text-blue-500 not-italic">Cash Curve</span></h2>
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-zinc-800' : 'bg-emerald-500'} animate-pulse`}></span>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Live Node Trace</p>
                </div>
              </div>
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                {(Object.keys(MOCK_BALANCE_HISTORY) as Array<keyof typeof MOCK_BALANCE_HISTORY>).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setActiveRange(t)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${t === activeRange ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full relative z-10 min-h-[400px] h-[400px]">
              {isLoading ? <Skeleton className="w-full h-full rounded-2xl" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_BALANCE_HISTORY[activeRange]}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 800 }} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} tick={{ fontWeight: 800 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#3b82f6', fontWeight: 900, fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8 min-w-0">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Quantum <span className="text-blue-500 not-italic">Intel</span></h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Neural Feedback Stream</p>
              </div>
              <Terminal size={18} className="text-zinc-700" />
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
              ) : (
                intelFeed.map((intel, idx) => (
                  <div key={idx} className="p-5 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group/item">
                    <div className="flex items-start gap-4">
                      {intel.severity === 'CRITICAL' ? <ShieldAlert size={16} className="text-rose-500 mt-1" /> : <Activity size={16} className="text-blue-500 mt-1" />}
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{intel.title}</p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed group-hover/item:text-zinc-300 transition-colors">{intel.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button onClick={() => navigate('/advisor')} className="mt-8 w-full py-5 bg-white/5 hover:bg-white text-white hover:text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10 flex items-center justify-center gap-4 shadow-xl">
              <ChevronRight size={18} />
              <span>Deep Advisory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
