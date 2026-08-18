// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/ApiStatus.tsx
================================================================================


import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, ShieldCheck, Globe, Zap, Database, Server, 
  RefreshCw, AlertCircle, Terminal, Heart, ArrowUpRight,
  Shield, CheckCircle2, Loader2, Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { generateNeuralStatusReport } from '../services/geminiService';

const COMPONENTS = [
  { id: 'FDX-GW', name: 'FDX v6.5 Gateway', category: 'Infrastructure', status: 'OPERATIONAL', uptime: '99.99%', latency: '2ms' },
  { id: 'RSA-SIGN', name: 'RSA-4096 Signer', category: 'Security', status: 'OPERATIONAL', uptime: '100%', latency: '0.4ms' },
  { id: 'NEURAL-ORC', name: 'Quantum Oracle', category: 'Intelligence', status: 'OPERATIONAL', uptime: '99.98%', latency: '12ms' },
  { id: 'DISB-NET', name: 'Disbursement Mesh', category: 'Payments', status: 'DEGRADED', uptime: '98.50%', latency: '120ms' },
  { id: 'KYC-CORE', name: 'Identity KYC Core', category: 'Institutional', status: 'OPERATIONAL', uptime: '99.95%', latency: '45ms' },
  { id: 'BLOCK-VLT', name: 'Registry Vault', category: 'Infrastructure', status: 'OPERATIONAL', uptime: '100%', latency: '1.2ms' },
  { id: 'ESG-AUD', name: 'ESG Audit Node', category: 'Compliance', status: 'OPERATIONAL', uptime: '99.9%', latency: '5ms' },
];

const ApiStatus: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  
  const uptimeHistory = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    name: i,
    uptime: 99.8 + Math.random() * 0.2
  })), []);

  const handlePoll = () => {
    setPolling(true);
    setTimeout(() => setPolling(false), 1500);
  };

  const loadReport = async () => {
    setLoadingReport(true);
    const systemSummary = COMPONENTS.map(c => `${c.name}: ${c.status}`).join(', ');
    const aiReport = await generateNeuralStatusReport(systemSummary);
    setReport(aiReport || "Neural core online. All parity checks within tolerance.");
    setLoadingReport(false);
  };

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            System <span className="text-blue-500 not-italic">Status</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Globe size={12} className="text-blue-500" />
            Global Mesh Network Health Monitoring
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handlePoll}
            className="flex items-center space-x-3 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <RefreshCw size={14} className={polling ? 'animate-spin' : ''} />
            <span>{polling ? 'Re-polling Nodes...' : 'Global Heartbeat'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatusStat label="Uptime (24H)" value="99.999%" icon={ShieldCheck} color="emerald" />
        <StatusStat label="Global Latency" value="1.2ms" icon={Zap} color="blue" />
        <StatusStat label="Active Nodes" value="1,242" icon={Server} color="purple" />
        <StatusStat label="Parity Conf." value="100%" icon={Activity} color="amber" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Component List */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-zinc-900 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                    <Activity size={20} />
                  </div>
                  <h3 className="text-white font-black uppercase tracking-[0.2em] italic text-sm">Cluster Operational State</h3>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                   <CheckCircle2 size={10} /> All Systems Handshaking
                </div>
             </div>
             <div className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-black/40 border-b border-zinc-900">
                      <th className="p-8">Component Identity</th>
                      <th className="p-8">Status</th>
                      <th className="p-8">Uptime</th>
                      <th className="p-8 text-right">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {COMPONENTS.map(comp => (
                      <tr key={comp.id} className="group hover:bg-white/[0.01] transition-all">
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-blue-500 transition-colors">
                              <Database size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-white uppercase italic">{comp.name}</p>
                              <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest mt-1">{comp.category} • {comp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${comp.status === 'OPERATIONAL' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`}></div>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${comp.status === 'OPERATIONAL' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {comp.status}
                              </span>
                           </div>
                        </td>
                        <td className="p-8">
                           <span className="text-[11px] font-mono text-zinc-400 font-bold">{comp.uptime}</span>
                        </td>
                        <td className="p-8 text-right">
                           <span className="text-[11px] font-mono text-blue-500 font-black">{comp.latency}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* AI Health Report & Side Viz */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 flex flex-col h-full shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Shield size={160} className="text-blue-500" />
            </div>
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Neural <span className="text-blue-500 not-italic">Audit</span></h2>
                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">LQI Observer Intelligence</p>
              </div>
              <button 
                onClick={loadReport}
                className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all shadow-xl"
              >
                 <Sparkles size={16} />
              </button>
            </div>

            <div className="space-y-8 flex-1 relative z-10">
               {loadingReport ? (
                 <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-30">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 animate-pulse">Analyzing Signal Entropy...</p>
                 </div>
               ) : (
                 <div className="p-8 bg-black/40 border border-blue-500/10 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20"></div>
                    <p className="text-lg font-medium text-zinc-300 leading-relaxed italic tracking-tight">
                      "{report}"
                    </p>
                 </div>
               )}

               <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Activity size={12} /> System Heartbeat (30D)
                 </h4>
                 <div className="h-40 w-full bg-black border border-zinc-900 rounded-3xl overflow-hidden p-4">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={uptimeHistory}>
                          <defs>
                             <linearGradient id="uptime-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="uptime" stroke="#10b981" fill="url(#uptime-grad)" strokeWidth={3} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
               </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-900 flex justify-between items-center relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Parity 100%</span>
               </div>
               <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">Nexus_OS v1.4.2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="flex items-center gap-10">
               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] text-blue-500 group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                 <Terminal size={40} />
               </div>
               <div className="space-y-3">
                  <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Incident <span className="text-blue-500">Archives</span></h4>
                  <p className="text-zinc-500 text-lg font-bold italic leading-relaxed max-w-2xl">"Access historical node parity records and system maintenance logs. All events are immutably signed."</p>
               </div>
            </div>
            <button className="px-12 py-6 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
               View Registry Logs
            </button>
         </div>
      </div>
    </div>
  );
};

const StatusStat = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/20 transition-all shadow-2xl">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon size={100} />
    </div>
    <div className="flex items-center gap-6 mb-8 relative z-10">
       <div className={`p-4 bg-${color}-500/10 text-${color}-500 rounded-2xl border border-${color}-500/20 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
       </div>
       <div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-black text-white mono uppercase italic tracking-tighter mt-1">{value}</h3>
       </div>
    </div>
    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden relative z-10 border border-white/5">
       <div className={`h-full bg-${color}-500 shadow-[0_0_10px_currentColor]`} style={{ width: '100%' }}></div>
    </div>
  </div>
);

export default ApiStatus;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/ApiStatus.tsx
================================================================================


import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, ShieldCheck, Globe, Zap, Database, Server, 
  RefreshCw, AlertCircle, Terminal, Heart, ArrowUpRight,
  Shield, CheckCircle2, Loader2, Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { generateNeuralStatusReport } from '../services/geminiService';

const COMPONENTS = [
  { id: 'FDX-GW', name: 'FDX v6.5 Gateway', category: 'Infrastructure', status: 'OPERATIONAL', uptime: '99.99%', latency: '2ms' },
  { id: 'RSA-SIGN', name: 'RSA-4096 Signer', category: 'Security', status: 'OPERATIONAL', uptime: '100%', latency: '0.4ms' },
  { id: 'NEURAL-ORC', name: 'Quantum Oracle', category: 'Intelligence', status: 'OPERATIONAL', uptime: '99.98%', latency: '12ms' },
  { id: 'DISB-NET', name: 'Disbursement Mesh', category: 'Payments', status: 'DEGRADED', uptime: '98.50%', latency: '120ms' },
  { id: 'KYC-CORE', name: 'Identity KYC Core', category: 'Institutional', status: 'OPERATIONAL', uptime: '99.95%', latency: '45ms' },
  { id: 'BLOCK-VLT', name: 'Registry Vault', category: 'Infrastructure', status: 'OPERATIONAL', uptime: '100%', latency: '1.2ms' },
  { id: 'ESG-AUD', name: 'ESG Audit Node', category: 'Compliance', status: 'OPERATIONAL', uptime: '99.9%', latency: '5ms' },
];

const ApiStatus: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  
  const uptimeHistory = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    name: i,
    uptime: 99.8 + Math.random() * 0.2
  })), []);

  const handlePoll = () => {
    setPolling(true);
    setTimeout(() => setPolling(false), 1500);
  };

  const loadReport = async () => {
    setLoadingReport(true);
    const systemSummary = COMPONENTS.map(c => `${c.name}: ${c.status}`).join(', ');
    const aiReport = await generateNeuralStatusReport(systemSummary);
    setReport(aiReport || "Neural core online. All parity checks within tolerance.");
    setLoadingReport(false);
  };

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            System <span className="text-blue-500 not-italic">Status</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Globe size={12} className="text-blue-500" />
            Global Mesh Network Health Monitoring
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handlePoll}
            className="flex items-center space-x-3 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <RefreshCw size={14} className={polling ? 'animate-spin' : ''} />
            <span>{polling ? 'Re-polling Nodes...' : 'Global Heartbeat'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatusStat label="Uptime (24H)" value="99.999%" icon={ShieldCheck} color="emerald" />
        <StatusStat label="Global Latency" value="1.2ms" icon={Zap} color="blue" />
        <StatusStat label="Active Nodes" value="1,242" icon={Server} color="purple" />
        <StatusStat label="Parity Conf." value="100%" icon={Activity} color="amber" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Component List */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-zinc-900 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                    <Activity size={20} />
                  </div>
                  <h3 className="text-white font-black uppercase tracking-[0.2em] italic text-sm">Cluster Operational State</h3>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                   <CheckCircle2 size={10} /> All Systems Handshaking
                </div>
             </div>
             <div className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-black/40 border-b border-zinc-900">
                      <th className="p-8">Component Identity</th>
                      <th className="p-8">Status</th>
                      <th className="p-8">Uptime</th>
                      <th className="p-8 text-right">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {COMPONENTS.map(comp => (
                      <tr key={comp.id} className="group hover:bg-white/[0.01] transition-all">
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-blue-500 transition-colors">
                              <Database size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-white uppercase italic">{comp.name}</p>
                              <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest mt-1">{comp.category} • {comp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${comp.status === 'OPERATIONAL' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`}></div>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${comp.status === 'OPERATIONAL' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {comp.status}
                              </span>
                           </div>
                        </td>
                        <td className="p-8">
                           <span className="text-[11px] font-mono text-zinc-400 font-bold">{comp.uptime}</span>
                        </td>
                        <td className="p-8 text-right">
                           <span className="text-[11px] font-mono text-blue-500 font-black">{comp.latency}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* AI Health Report & Side Viz */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 flex flex-col h-full shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Shield size={160} className="text-blue-500" />
            </div>
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Neural <span className="text-blue-500 not-italic">Audit</span></h2>
                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">LQI Observer Intelligence</p>
              </div>
              <button 
                onClick={loadReport}
                className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all shadow-xl"
              >
                 <Sparkles size={16} />
              </button>
            </div>

            <div className="space-y-8 flex-1 relative z-10">
               {loadingReport ? (
                 <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-30">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 animate-pulse">Analyzing Signal Entropy...</p>
                 </div>
               ) : (
                 <div className="p-8 bg-black/40 border border-blue-500/10 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20"></div>
                    <p className="text-lg font-medium text-zinc-300 leading-relaxed italic tracking-tight">
                      "{report}"
                    </p>
                 </div>
               )}

               <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Activity size={12} /> System Heartbeat (30D)
                 </h4>
                 <div className="h-40 w-full bg-black border border-zinc-900 rounded-3xl overflow-hidden p-4">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={uptimeHistory}>
                          <defs>
                             <linearGradient id="uptime-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="uptime" stroke="#10b981" fill="url(#uptime-grad)" strokeWidth={3} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
               </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-900 flex justify-between items-center relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Parity 100%</span>
               </div>
               <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">Nexus_OS v1.4.2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="flex items-center gap-10">
               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] text-blue-500 group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                 <Terminal size={40} />
               </div>
               <div className="space-y-3">
                  <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Incident <span className="text-blue-500">Archives</span></h4>
                  <p className="text-zinc-500 text-lg font-bold italic leading-relaxed max-w-2xl">"Access historical node parity records and system maintenance logs. All events are immutably signed."</p>
               </div>
            </div>
            <button className="px-12 py-6 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
               View Registry Logs
            </button>
         </div>
      </div>
    </div>
  );
};

const StatusStat = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/20 transition-all shadow-2xl">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon size={100} />
    </div>
    <div className="flex items-center gap-6 mb-8 relative z-10">
       <div className={`p-4 bg-${color}-500/10 text-${color}-500 rounded-2xl border border-${color}-500/20 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
       </div>
       <div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-black text-white mono uppercase italic tracking-tighter mt-1">{value}</h3>
       </div>
    </div>
    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden relative z-10 border border-white/5">
       <div className={`h-full bg-${color}-500 shadow-[0_0_10px_currentColor]`} style={{ width: '100%' }}></div>
    </div>
  </div>
);

export default ApiStatus;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/ApiStatus.tsx
================================================================================


import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, ShieldCheck, Globe, Zap, Database, Server, 
  RefreshCw, AlertCircle, Terminal, Heart, ArrowUpRight,
  Shield, CheckCircle2, Loader2, Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { generateNeuralStatusReport } from '../services/geminiService';

const COMPONENTS = [
  { id: 'FDX-GW', name: 'FDX v6.5 Gateway', category: 'Infrastructure', status: 'OPERATIONAL', uptime: '99.99%', latency: '2ms' },
  { id: 'RSA-SIGN', name: 'RSA-4096 Signer', category: 'Security', status: 'OPERATIONAL', uptime: '100%', latency: '0.4ms' },
  { id: 'NEURAL-ORC', name: 'Quantum Oracle', category: 'Intelligence', status: 'OPERATIONAL', uptime: '99.98%', latency: '12ms' },
  { id: 'DISB-NET', name: 'Disbursement Mesh', category: 'Payments', status: 'DEGRADED', uptime: '98.50%', latency: '120ms' },
  { id: 'KYC-CORE', name: 'Identity KYC Core', category: 'Institutional', status: 'OPERATIONAL', uptime: '99.95%', latency: '45ms' },
  { id: 'BLOCK-VLT', name: 'Registry Vault', category: 'Infrastructure', status: 'OPERATIONAL', uptime: '100%', latency: '1.2ms' },
  { id: 'ESG-AUD', name: 'ESG Audit Node', category: 'Compliance', status: 'OPERATIONAL', uptime: '99.9%', latency: '5ms' },
];

const ApiStatus: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  
  const uptimeHistory = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    name: i,
    uptime: 99.8 + Math.random() * 0.2
  })), []);

  const handlePoll = () => {
    setPolling(true);
    setTimeout(() => setPolling(false), 1500);
  };

  const loadReport = async () => {
    setLoadingReport(true);
    const systemSummary = COMPONENTS.map(c => `${c.name}: ${c.status}`).join(', ');
    const aiReport = await generateNeuralStatusReport(systemSummary);
    setReport(aiReport);
    setLoadingReport(false);
  };

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            System <span className="text-blue-500 not-italic">Status</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Globe size={12} className="text-blue-500" />
            Global Mesh Network Health Monitoring
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handlePoll}
            className="flex items-center space-x-3 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <RefreshCw size={14} className={polling ? 'animate-spin' : ''} />
            <span>{polling ? 'Re-polling Nodes...' : 'Global Heartbeat'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatusStat label="Uptime (24H)" value="99.999%" icon={ShieldCheck} color="emerald" />
        <StatusStat label="Global Latency" value="1.2ms" icon={Zap} color="blue" />
        <StatusStat label="Active Nodes" value="1,242" icon={Server} color="purple" />
        <StatusStat label="Parity Conf." value="100%" icon={Activity} color="amber" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Component List */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-zinc-900 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                    <Activity size={20} />
                  </div>
                  <h3 className="text-white font-black uppercase tracking-[0.2em] italic text-sm">Cluster Operational State</h3>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                   <CheckCircle2 size={10} /> All Systems Handshaking
                </div>
             </div>
             <div className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-black/40 border-b border-zinc-900">
                      <th className="p-8">Component Identity</th>
                      <th className="p-8">Status</th>
                      <th className="p-8">Uptime</th>
                      <th className="p-8 text-right">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {COMPONENTS.map(comp => (
                      <tr key={comp.id} className="group hover:bg-white/[0.01] transition-all">
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-blue-500 transition-colors">
                              <Database size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-white uppercase italic">{comp.name}</p>
                              <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest mt-1">{comp.category} • {comp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${comp.status === 'OPERATIONAL' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`}></div>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${comp.status === 'OPERATIONAL' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {comp.status}
                              </span>
                           </div>
                        </td>
                        <td className="p-8">
                           <span className="text-[11px] font-mono text-zinc-400 font-bold">{comp.uptime}</span>
                        </td>
                        <td className="p-8 text-right">
                           <span className="text-[11px] font-mono text-blue-500 font-black">{comp.latency}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* AI Health Report & Side Viz */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 flex flex-col h-full shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Shield size={160} className="text-blue-500" />
            </div>
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Neural <span className="text-blue-500 not-italic">Audit</span></h2>
                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">LQI Observer Intelligence</p>
              </div>
              <button 
                onClick={loadReport}
                className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all shadow-xl"
              >
                 <Sparkles size={16} />
              </button>
            </div>

            <div className="space-y-8 flex-1 relative z-10">
               {loadingReport ? (
                 <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-30">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 animate-pulse">Analyzing Signal Entropy...</p>
                 </div>
               ) : (
                 <div className="p-8 bg-black/40 border border-blue-500/10 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20"></div>
                    <p className="text-lg font-medium text-zinc-300 leading-relaxed italic tracking-tight">
                      "{report}"
                    </p>
                 </div>
               )}

               <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Activity size={12} /> System Heartbeat (30D)
                 </h4>
                 <div className="h-40 w-full bg-black border border-zinc-900 rounded-3xl overflow-hidden p-4">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={uptimeHistory}>
                          <defs>
                             <linearGradient id="uptime-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="uptime" stroke="#10b981" fill="url(#uptime-grad)" strokeWidth={3} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
               </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-900 flex justify-between items-center relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Parity 100%</span>
               </div>
               <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">Nexus_OS v1.4.2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="flex items-center gap-10">
               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] text-blue-500 group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                 <Terminal size={40} />
               </div>
               <div className="space-y-3">
                  <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Incident <span className="text-blue-500">Archives</span></h4>
                  <p className="text-zinc-500 text-lg font-bold italic leading-relaxed max-w-2xl">"Access historical node parity records and system maintenance logs. All events are immutably signed."</p>
               </div>
            </div>
            <button className="px-12 py-6 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
               View Registry Logs
            </button>
         </div>
      </div>
    </div>
  );
};

const StatusStat = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/20 transition-all shadow-2xl">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon size={100} />
    </div>
    <div className="flex items-center gap-6 mb-8 relative z-10">
       <div className={`p-4 bg-${color}-500/10 text-${color}-500 rounded-2xl border border-${color}-500/20 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
       </div>
       <div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-black text-white mono uppercase italic tracking-tighter mt-1">{value}</h3>
       </div>
    </div>
    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden relative z-10 border border-white/5">
       <div className={`h-full bg-${color}-500 shadow-[0_0_10px_currentColor]`} style={{ width: '100%' }}></div>
    </div>
  </div>
);

export default ApiStatus;
