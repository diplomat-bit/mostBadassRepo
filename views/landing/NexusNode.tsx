// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/landing/NexusNode.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Network, Activity, Zap, ShieldCheck, Radio, Terminal as TerminalIcon, Cpu, Globe, Server, Layers, Link2 } from 'lucide-react';

const NexusNode: React.FC = () => {
  const [load, setLoad] = useState(82.4);
  const [logs, setLogs] = useState<string[]>([]);
  const [uptime, setUptime] = useState(0);
  const [activePacket, setActivePacket] = useState<number>(0);

  const nodeStats = useMemo(() => [
    { id: 'n1', label: 'Identity Protocol', val: 'RSA-OAEP-4096', icon: ShieldCheck, color: 'blue' },
    { id: 'n2', label: 'Mainnet Status', val: 'SYNCHRONIZED', icon: Activity, color: 'emerald' },
    { id: 'n3', label: 'Priority Level', val: 'L9 CRITICAL', icon: Zap, color: 'amber' },
    { id: 'n4', label: 'Sync Latency', val: '0.0004ms', icon: Radio, color: 'purple' },
  ], []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLoad(prev => Math.max(70, Math.min(99, prev + (Math.random() - 0.5) * 2)));
      setUptime(u => u + 1);
      setActivePacket(p => (p + 1) % 1000);
      const regions = ['US-EAST-1', 'EU-CENTRAL-1', 'AP-SOUTHEAST-2', 'SA-EAST-1', 'AF-SOUTH-1', 'ME-CENTRAL-1'];
      const actions = ['Parity Check', 'Quantum Handshake', 'Entanglement Verify', 'Fabric Sync', 'Hash Collision Scan', 'Protocol Seal'];
      const newLog = `[${regions[Math.floor(Math.random() * regions.length)]}] ${actions[Math.floor(Math.random() * actions.length)]}: 0x${Math.random().toString(16).substring(2, 10).toUpperCase()} - Parity delta: 0.000${Math.floor(Math.random() * 9)}ns`;
      setLogs(prev => [newLog, ...prev].slice(0, 100));
    }, 1500);
    return () => clearInterval(logInterval);
  }, []);

  return (
    <section className="py-60 border-b border-zinc-900 relative overflow-hidden bg-black selection:bg-blue-600/30">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="20" x2="100" y2="80" stroke="url(#line-grad)" strokeWidth="0.1" />
          <line x1="100" y1="20" x2="0" y2="80" stroke="url(#line-grad)" strokeWidth="0.1" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
          <div className="space-y-16">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-5 px-6 py-3 bg-blue-600/10 border border-blue-600/20 rounded-full animate-in slide-in-from-left-4 duration-700">
                <Cpu size={18} className="text-blue-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">Core_Protocol_Apex_v6.2</span>
              </div>
              <h2 className="text-[7rem] lg:text-[11rem] font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-4">Quantum <br /> <span className="text-blue-600 not-italic">Nexus_01</span></h2>
              <p className="text-zinc-500 text-3xl font-bold italic leading-relaxed max-w-2xl">
                "The architectural <span className="text-white">apex</span> of corporate treasury management. We facilitate the high-velocity routing of institutional grade digital assets via <span className="text-blue-500">subspace entanglement</span> mechanisms."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {nodeStats.map((stat, i) => (
                <div key={stat.id} style={{ transitionDelay: `${i * 150}ms` }} className="p-10 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-blue-600/40 transition-all hover:translate-y-[-10px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-10 transition-opacity duration-700">
                    <stat.icon size={160} />
                  </div>
                  <div className={`p-6 rounded-[2rem] bg-${stat.color}-500/10 text-${stat.color}-500 mb-10 group-hover:scale-110 transition-transform duration-700 inline-block border border-white/5 shadow-2xl`}>
                    <stat.icon size={36} />
                  </div>
                  <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-3">
                     <span className={`w-1.5 h-1.5 rounded-full bg-${stat.color}-500 animate-pulse`}></span>
                     {stat.label}
                  </p>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{stat.val}</h3>
                </div>
              ))}
            </div>

            <div className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[4rem] flex items-center justify-between group hover:border-blue-500/20 transition-all shadow-2xl backdrop-blur-md">
               <div className="flex items-center gap-10">
                  <div className="w-16 h-16 bg-black rounded-[1.8rem] border border-zinc-800 flex items-center justify-center text-blue-500 shadow-2xl group-hover:rotate-180 transition-transform duration-1000">
                     <Globe size={32} className="animate-spin [animation-duration:20s]" />
                  </div>
                  <div>
                     <p className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-1">Global Mesh Uptime</p>
                     <p className="text-xl font-bold text-zinc-500 mono uppercase tracking-widest italic">
                       {Math.floor(uptime / 3600)}H {Math.floor((uptime % 3600) / 60)}M {uptime % 60}S
                     </p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]"></div>
                    <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">Node Healthy</span>
                  </div>
                  <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">ID: {activePacket}</p>
               </div>
            </div>
          </div>

          <div className="relative group">
            {/* Visual Halo Effects */}
            <div className="absolute -inset-10 bg-blue-600/10 blur-[150px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="bg-zinc-950 border border-zinc-900 rounded-[6rem] p-24 aspect-square flex flex-col justify-between shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_60%)] opacity-40"></div>
              
              <div className="flex justify-between items-start relative z-10">
                 <div className="w-36 h-36 bg-blue-600 rounded-[4rem] flex items-center justify-center text-white shadow-[0_40px_80px_rgba(37,99,235,0.4)] border border-blue-400/20 group-hover:scale-105 transition-transform duration-1000">
                    <Network size={72} className="animate-pulse" />
                 </div>
                 <div className="text-right space-y-4">
                    <p className="text-[14px] font-black text-zinc-500 uppercase tracking-[0.6em] mb-2">Registry Parity</p>
                    <p className="text-9xl font-black text-white mono tracking-tighter italic leading-none">100<span className="text-4xl text-blue-500">%</span></p>
                 </div>
              </div>

              {/* Complex SVG Radial Dashboard */}
              <div className="flex-1 my-20 relative flex items-center justify-center">
                 <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-900" />
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="1,25" className="text-blue-600/20 animate-spin [animation-duration:40s]" />
                    <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,8" className="text-zinc-800" />
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="120,40" className="text-blue-500/10 animate-spin [animation-duration:20s]" />
                 </svg>
                 
                 <div className="text-center z-10 bg-black/50 backdrop-blur-3xl p-16 rounded-full border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-1000">
                    <p className="text-[12px] font-black text-blue-500 uppercase tracking-[0.8em] mb-6">Fabric Density</p>
                    <h4 className="text-[10rem] font-black text-white italic tracking-tighter mono leading-none">{load.toFixed(1)}<span className="text-3xl text-zinc-600">%</span></h4>
                    <div className="mt-10 flex justify-center gap-4">
                       {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-700 ${load > i*12 ? 'bg-blue-600 shadow-[0_0_10px_#3b82f6]' : 'bg-zinc-800'}`}></div>)}
                    </div>
                 </div>

                 {/* Orbital Node Assets */}
                 <div className="absolute inset-0 animate-spin [animation-duration:30s] pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] text-blue-400 shadow-2xl">
                       <Server size={24} />
                    </div>
                 </div>
                 <div className="absolute inset-0 animate-reverse-spin [animation-duration:25s] pointer-events-none">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-4 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] text-emerald-400 shadow-2xl">
                       <ShieldCheck size={24} />
                    </div>
                 </div>
                 <div className="absolute inset-0 animate-spin [animation-duration:45s] pointer-events-none">
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] text-purple-400 shadow-2xl">
                       <Layers size={24} />
                    </div>
                 </div>
              </div>

              {/* Console Output Integration */}
              <div className="bg-black/95 border border-zinc-900 rounded-[4rem] p-14 h-96 overflow-hidden relative group/console shadow-inner animate-in slide-in-from-bottom-10">
                <div className="absolute top-0 inset-x-0 px-14 py-8 border-b border-zinc-900 bg-zinc-900/60 flex justify-between items-center backdrop-blur-xl z-20">
                   <div className="flex items-center gap-6">
                      <TerminalIcon size={18} className="text-blue-500" />
                      <span className="text-[12px] font-black uppercase text-zinc-500 tracking-[0.5em]">LQI_CORE_FABRIC Trace Stream</span>
                   </div>
                   <div className="flex gap-3">
                      <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                      <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse shadow-[0_0_12px_#3b82f6]"></div>
                   </div>
                </div>
                <div className="mt-20 space-y-3 font-mono text-[11px] custom-scrollbar overflow-y-auto h-56 pt-8 px-4 relative z-10">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-10 group/line animate-in slide-in-from-right-4 duration-500">
                       <span className="text-zinc-800 font-black shrink-0 tracking-tighter">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                       <span className={`${log.includes('Success') || log.includes('Verify') ? 'text-blue-400' : 'text-zinc-500'} group-hover/line:text-white transition-colors tracking-tight`}>{log}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent z-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-reverse-spin { animation: reverse-spin linear infinite; }
      `}</style>
    </section>
  );
};

export default NexusNode;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/landing/NexusNode.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Network, Activity, Zap, ShieldCheck, Radio, Terminal as TerminalIcon, Cpu, Globe, Server, Layers, Link2 } from 'lucide-react';

const NexusNode: React.FC = () => {
  const [load, setLoad] = useState(82.4);
  const [logs, setLogs] = useState<string[]>([]);
  const [uptime, setUptime] = useState(0);
  const [activePacket, setActivePacket] = useState<number>(0);

  const nodeStats = useMemo(() => [
    { id: 'n1', label: 'Identity Protocol', val: 'RSA-OAEP-4096', icon: ShieldCheck, color: 'blue' },
    { id: 'n2', label: 'Mainnet Status', val: 'SYNCHRONIZED', icon: Activity, color: 'emerald' },
    { id: 'n3', label: 'Priority Level', val: 'L9 CRITICAL', icon: Zap, color: 'amber' },
    { id: 'n4', label: 'Sync Latency', val: '0.0004ms', icon: Radio, color: 'purple' },
  ], []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLoad(prev => Math.max(70, Math.min(99, prev + (Math.random() - 0.5) * 2)));
      setUptime(u => u + 1);
      setActivePacket(p => (p + 1) % 1000);
      const regions = ['US-EAST-1', 'EU-CENTRAL-1', 'AP-SOUTHEAST-2', 'SA-EAST-1', 'AF-SOUTH-1', 'ME-CENTRAL-1'];
      const actions = ['Parity Check', 'Quantum Handshake', 'Entanglement Verify', 'Fabric Sync', 'Hash Collision Scan', 'Protocol Seal'];
      const newLog = `[${regions[Math.floor(Math.random() * regions.length)]}] ${actions[Math.floor(Math.random() * actions.length)]}: 0x${Math.random().toString(16).substring(2, 10).toUpperCase()} - Parity delta: 0.000${Math.floor(Math.random() * 9)}ns`;
      setLogs(prev => [newLog, ...prev].slice(0, 100));
    }, 1500);
    return () => clearInterval(logInterval);
  }, []);

  return (
    <section className="py-60 border-b border-zinc-900 relative overflow-hidden bg-black selection:bg-blue-600/30">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="20" x2="100" y2="80" stroke="url(#line-grad)" strokeWidth="0.1" />
          <line x1="100" y1="20" x2="0" y2="80" stroke="url(#line-grad)" strokeWidth="0.1" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
          <div className="space-y-16">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-5 px-6 py-3 bg-blue-600/10 border border-blue-600/20 rounded-full animate-in slide-in-from-left-4 duration-700">
                <Cpu size={18} className="text-blue-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">Core_Protocol_Apex_v6.2</span>
              </div>
              <h2 className="text-[7rem] lg:text-[11rem] font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-4">Quantum <br /> <span className="text-blue-600 not-italic">Nexus_01</span></h2>
              <p className="text-zinc-500 text-3xl font-bold italic leading-relaxed max-w-2xl">
                "The architectural <span className="text-white">apex</span> of corporate treasury management. We facilitate the high-velocity routing of institutional grade digital assets via <span className="text-blue-500">subspace entanglement</span> mechanisms."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {nodeStats.map((stat, i) => (
                <div key={stat.id} style={{ transitionDelay: `${i * 150}ms` }} className="p-10 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-blue-600/40 transition-all hover:translate-y-[-10px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-10 transition-opacity duration-700">
                    <stat.icon size={160} />
                  </div>
                  <div className={`p-6 rounded-[2rem] bg-${stat.color}-500/10 text-${stat.color}-500 mb-10 group-hover:scale-110 transition-transform duration-700 inline-block border border-white/5 shadow-2xl`}>
                    <stat.icon size={36} />
                  </div>
                  <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-3">
                     <span className={`w-1.5 h-1.5 rounded-full bg-${stat.color}-500 animate-pulse`}></span>
                     {stat.label}
                  </p>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{stat.val}</h3>
                </div>
              ))}
            </div>

            <div className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[4rem] flex items-center justify-between group hover:border-blue-500/20 transition-all shadow-2xl backdrop-blur-md">
               <div className="flex items-center gap-10">
                  <div className="w-16 h-16 bg-black rounded-[1.8rem] border border-zinc-800 flex items-center justify-center text-blue-500 shadow-2xl group-hover:rotate-180 transition-transform duration-1000">
                     <Globe size={32} className="animate-spin [animation-duration:20s]" />
                  </div>
                  <div>
                     <p className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-1">Global Mesh Uptime</p>
                     <p className="text-xl font-bold text-zinc-500 mono uppercase tracking-widest italic">
                       {Math.floor(uptime / 3600)}H {Math.floor((uptime % 3600) / 60)}M {uptime % 60}S
                     </p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]"></div>
                    <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">Node Healthy</span>
                  </div>
                  <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">ID: {activePacket}</p>
               </div>
            </div>
          </div>

          <div className="relative group">
            {/* Visual Halo Effects */}
            <div className="absolute -inset-10 bg-blue-600/10 blur-[150px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="bg-zinc-950 border border-zinc-900 rounded-[6rem] p-24 aspect-square flex flex-col justify-between shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_60%)] opacity-40"></div>
              
              <div className="flex justify-between items-start relative z-10">
                 <div className="w-36 h-36 bg-blue-600 rounded-[4rem] flex items-center justify-center text-white shadow-[0_40px_80px_rgba(37,99,235,0.4)] border border-blue-400/20 group-hover:scale-105 transition-transform duration-1000">
                    <Network size={72} className="animate-pulse" />
                 </div>
                 <div className="text-right space-y-4">
                    <p className="text-[14px] font-black text-zinc-500 uppercase tracking-[0.6em] mb-2">Registry Parity</p>
                    <p className="text-9xl font-black text-white mono tracking-tighter italic leading-none">100<span className="text-4xl text-blue-500">%</span></p>
                 </div>
              </div>

              {/* Complex SVG Radial Dashboard */}
              <div className="flex-1 my-20 relative flex items-center justify-center">
                 <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-900" />
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="1,25" className="text-blue-600/20 animate-spin [animation-duration:40s]" />
                    <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,8" className="text-zinc-800" />
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="120,40" className="text-blue-500/10 animate-spin [animation-duration:20s]" />
                 </svg>
                 
                 <div className="text-center z-10 bg-black/50 backdrop-blur-3xl p-16 rounded-full border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-1000">
                    <p className="text-[12px] font-black text-blue-500 uppercase tracking-[0.8em] mb-6">Fabric Density</p>
                    <h4 className="text-[10rem] font-black text-white italic tracking-tighter mono leading-none">{load.toFixed(1)}<span className="text-3xl text-zinc-600">%</span></h4>
                    <div className="mt-10 flex justify-center gap-4">
                       {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-700 ${load > i*12 ? 'bg-blue-600 shadow-[0_0_10px_#3b82f6]' : 'bg-zinc-800'}`}></div>)}
                    </div>
                 </div>

                 {/* Orbital Node Assets */}
                 <div className="absolute inset-0 animate-spin [animation-duration:30s] pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] text-blue-400 shadow-2xl">
                       <Server size={24} />
                    </div>
                 </div>
                 <div className="absolute inset-0 animate-reverse-spin [animation-duration:25s] pointer-events-none">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-4 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] text-emerald-400 shadow-2xl">
                       <ShieldCheck size={24} />
                    </div>
                 </div>
                 <div className="absolute inset-0 animate-spin [animation-duration:45s] pointer-events-none">
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] text-purple-400 shadow-2xl">
                       <Layers size={24} />
                    </div>
                 </div>
              </div>

              {/* Console Output Integration */}
              <div className="bg-black/95 border border-zinc-900 rounded-[4rem] p-14 h-96 overflow-hidden relative group/console shadow-inner animate-in slide-in-from-bottom-10">
                <div className="absolute top-0 inset-x-0 px-14 py-8 border-b border-zinc-900 bg-zinc-900/60 flex justify-between items-center backdrop-blur-xl z-20">
                   <div className="flex items-center gap-6">
                      <TerminalIcon size={18} className="text-blue-500" />
                      <span className="text-[12px] font-black uppercase text-zinc-500 tracking-[0.5em]">LQI_CORE_FABRIC Trace Stream</span>
                   </div>
                   <div className="flex gap-3">
                      <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                      <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse shadow-[0_0_12px_#3b82f6]"></div>
                   </div>
                </div>
                <div className="mt-20 space-y-3 font-mono text-[11px] custom-scrollbar overflow-y-auto h-56 pt-8 px-4 relative z-10">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-10 group/line animate-in slide-in-from-right-4 duration-500">
                       <span className="text-zinc-800 font-black shrink-0 tracking-tighter">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                       <span className={`${log.includes('Success') || log.includes('Verify') ? 'text-blue-400' : 'text-zinc-500'} group-hover/line:text-white transition-colors tracking-tight`}>{log}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent z-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-reverse-spin { animation: reverse-spin linear infinite; }
      `}</style>
    </section>
  );
};

export default NexusNode;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/landing/NexusNode.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Network, Activity, Zap, ShieldCheck, Radio, Terminal as TerminalIcon, Cpu, Globe, Server, Layers, Link2 } from 'lucide-react';

const NexusNode: React.FC = () => {
  const [load, setLoad] = useState(82.4);
  const [logs, setLogs] = useState<string[]>([]);
  const [uptime, setUptime] = useState(0);
  const [activePacket, setActivePacket] = useState<number>(0);

  const nodeStats = useMemo(() => [
    { id: 'n1', label: 'Identity Protocol', val: 'RSA-OAEP-4096', icon: ShieldCheck, color: 'blue' },
    { id: 'n2', label: 'Mainnet Status', val: 'SYNCHRONIZED', icon: Activity, color: 'emerald' },
    { id: 'n3', label: 'Priority Level', val: 'L9 CRITICAL', icon: Zap, color: 'amber' },
    { id: 'n4', label: 'Sync Latency', val: '0.0004ms', icon: Radio, color: 'purple' },
  ], []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLoad(prev => Math.max(70, Math.min(99, prev + (Math.random() - 0.5) * 2)));
      setUptime(u => u + 1);
      setActivePacket(p => (p + 1) % 1000);
      const regions = ['US-EAST-1', 'EU-CENTRAL-1', 'AP-SOUTHEAST-2', 'SA-EAST-1', 'AF-SOUTH-1', 'ME-CENTRAL-1'];
      const actions = ['Parity Check', 'Quantum Handshake', 'Entanglement Verify', 'Fabric Sync', 'Hash Collision Scan', 'Protocol Seal'];
      const newLog = `[${regions[Math.floor(Math.random() * regions.length)]}] ${actions[Math.floor(Math.random() * actions.length)]}: 0x${Math.random().toString(16).substring(2, 10).toUpperCase()} - Parity delta: 0.000${Math.floor(Math.random() * 9)}ns`;
      setLogs(prev => [newLog, ...prev].slice(0, 100));
    }, 1500);
    return () => clearInterval(logInterval);
  }, []);

  return (
    <section className="py-60 border-b border-zinc-900 relative overflow-hidden bg-black selection:bg-blue-600/30">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="20" x2="100" y2="80" stroke="url(#line-grad)" strokeWidth="0.1" />
          <line x1="100" y1="20" x2="0" y2="80" stroke="url(#line-grad)" strokeWidth="0.1" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
          <div className="space-y-16">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-5 px-6 py-3 bg-blue-600/10 border border-blue-600/20 rounded-full animate-in slide-in-from-left-4 duration-700">
                <Cpu size={18} className="text-blue-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">Core_Protocol_Apex_v6.2</span>
              </div>
              <h2 className="text-[7rem] lg:text-[11rem] font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-4">Quantum <br /> <span className="text-blue-600 not-italic">Nexus_01</span></h2>
              <p className="text-zinc-500 text-3xl font-bold italic leading-relaxed max-w-2xl">
                "The architectural <span className="text-white">apex</span> of corporate treasury management. We facilitate the high-velocity routing of institutional grade digital assets via <span className="text-blue-500">subspace entanglement</span> mechanisms."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {nodeStats.map((stat, i) => (
                <div key={stat.id} style={{ transitionDelay: `${i * 150}ms` }} className="p-10 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-blue-600/40 transition-all hover:translate-y-[-10px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-10 transition-opacity duration-700">
                    <stat.icon size={160} />
                  </div>
                  <div className={`p-6 rounded-[2rem] bg-${stat.color}-500/10 text-${stat.color}-500 mb-10 group-hover:scale-110 transition-transform duration-700 inline-block border border-white/5 shadow-2xl`}>
                    <stat.icon size={36} />
                  </div>
                  <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-3">
                     <span className={`w-1.5 h-1.5 rounded-full bg-${stat.color}-500 animate-pulse`}></span>
                     {stat.label}
                  </p>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{stat.val}</h3>
                </div>
              ))}
            </div>

            <div className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[4rem] flex items-center justify-between group hover:border-blue-500/20 transition-all shadow-2xl backdrop-blur-md">
               <div className="flex items-center gap-10">
                  <div className="w-16 h-16 bg-black rounded-[1.8rem] border border-zinc-800 flex items-center justify-center text-blue-500 shadow-2xl group-hover:rotate-180 transition-transform duration-1000">
                     <Globe size={32} className="animate-spin [animation-duration:20s]" />
                  </div>
                  <div>
                     <p className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-1">Global Mesh Uptime</p>
                     <p className="text-xl font-bold text-zinc-500 mono uppercase tracking-widest italic">
                       {Math.floor(uptime / 3600)}H {Math.floor((uptime % 3600) / 60)}M {uptime % 60}S
                     </p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]"></div>
                    <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">Node Healthy</span>
                  </div>
                  <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">ID: {activePacket}</p>
               </div>
            </div>
          </div>

          <div className="relative group">
            {/* Visual Halo Effects */}
            <div className="absolute -inset-10 bg-blue-600/10 blur-[150px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="bg-zinc-950 border border-zinc-900 rounded-[6rem] p-24 aspect-square flex flex-col justify-between shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_60%)] opacity-40"></div>
              
              <div className="flex justify-between items-start relative z-10">
                 <div className="w-36 h-36 bg-blue-600 rounded-[4rem] flex items-center justify-center text-white shadow-[0_40px_80px_rgba(37,99,235,0.4)] border border-blue-400/20 group-hover:scale-105 transition-transform duration-1000">
                    <Network size={72} className="animate-pulse" />
                 </div>
                 <div className="text-right space-y-4">
                    <p className="text-[14px] font-black text-zinc-500 uppercase tracking-[0.6em] mb-2">Registry Parity</p>
                    <p className="text-9xl font-black text-white mono tracking-tighter italic leading-none">100<span className="text-4xl text-blue-500">%</span></p>
                 </div>
              </div>

              {/* Complex SVG Radial Dashboard */}
              <div className="flex-1 my-20 relative flex items-center justify-center">
                 <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-900" />
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="1,25" className="text-blue-600/20 animate-spin [animation-duration:40s]" />
                    <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,8" className="text-zinc-800" />
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="120,40" className="text-blue-500/10 animate-spin [animation-duration:20s]" />
                 </svg>
                 
                 <div className="text-center z-10 bg-black/50 backdrop-blur-3xl p-16 rounded-full border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-1000">
                    <p className="text-[12px] font-black text-blue-500 uppercase tracking-[0.8em] mb-6">Fabric Density</p>
                    <h4 className="text-[10rem] font-black text-white italic tracking-tighter mono leading-none">{load.toFixed(1)}<span className="text-3xl text-zinc-600">%</span></h4>
                    <div className="mt-10 flex justify-center gap-4">
                       {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-700 ${load > i*12 ? 'bg-blue-600 shadow-[0_0_10px_#3b82f6]' : 'bg-zinc-800'}`}></div>)}
                    </div>
                 </div>

                 {/* Orbital Node Assets */}
                 <div className="absolute inset-0 animate-spin [animation-duration:30s] pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] text-blue-400 shadow-2xl">
                       <Server size={24} />
                    </div>
                 </div>
                 <div className="absolute inset-0 animate-reverse-spin [animation-duration:25s] pointer-events-none">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-4 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] text-emerald-400 shadow-2xl">
                       <ShieldCheck size={24} />
                    </div>
                 </div>
                 <div className="absolute inset-0 animate-spin [animation-duration:45s] pointer-events-none">
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] text-purple-400 shadow-2xl">
                       <Layers size={24} />
                    </div>
                 </div>
              </div>

              {/* Console Output Integration */}
              <div className="bg-black/95 border border-zinc-900 rounded-[4rem] p-14 h-96 overflow-hidden relative group/console shadow-inner animate-in slide-in-from-bottom-10">
                <div className="absolute top-0 inset-x-0 px-14 py-8 border-b border-zinc-900 bg-zinc-900/60 flex justify-between items-center backdrop-blur-xl z-20">
                   <div className="flex items-center gap-6">
                      <TerminalIcon size={18} className="text-blue-500" />
                      <span className="text-[12px] font-black uppercase text-zinc-500 tracking-[0.5em]">LQI_CORE_FABRIC Trace Stream</span>
                   </div>
                   <div className="flex gap-3">
                      <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                      <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse shadow-[0_0_12px_#3b82f6]"></div>
                   </div>
                </div>
                <div className="mt-20 space-y-3 font-mono text-[11px] custom-scrollbar overflow-y-auto h-56 pt-8 px-4 relative z-10">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-10 group/line animate-in slide-in-from-right-4 duration-500">
                       <span className="text-zinc-800 font-black shrink-0 tracking-tighter">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                       <span className={`${log.includes('Success') || log.includes('Verify') ? 'text-blue-400' : 'text-zinc-500'} group-hover/line:text-white transition-colors tracking-tight`}>{log}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent z-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-reverse-spin { animation: reverse-spin linear infinite; }
      `}</style>
    </section>
  );
};

export default NexusNode;