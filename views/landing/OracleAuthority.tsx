// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/landing/OracleAuthority.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Activity, Search, Terminal as TerminalIcon, CheckCircle2, AlertTriangle, Infinity, Eye, Cpu, Zap, Radio, Database } from 'lucide-react';

const OracleAuthority: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [disparity, setDisparity] = useState(0.001);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeLayer, setActiveLayer] = useState<'MESH' | 'CONSENSUS' | 'HARD_STATE'>('MESH');

  useEffect(() => {
    const logInterval = setInterval(() => {
      setDisparity(prev => Math.max(0.0001, Math.min(0.01, prev + (Math.random() - 0.5) * 0.0005)));
      const regions = ['US', 'EU', 'JP', 'SG', 'AU'];
      const actions = ['Scanning block', 'Verifying hash', 'M2M handshake', 'Fabric sync'];
      const newLog = `[OBSERVER] ${actions[Math.floor(Math.random()*actions.length)]} ${Math.floor(Math.random()*900000)}... REGION_${regions[Math.floor(Math.random()*regions.length)]} verified.`;
      setLogs(prev => [newLog, ...prev].slice(0, 100));
      setScanProgress(p => (p + 1) % 101);
    }, 3000);

    const layerInterval = setInterval(() => {
      setActiveLayer(l => l === 'MESH' ? 'CONSENSUS' : l === 'CONSENSUS' ? 'HARD_STATE' : 'MESH');
    }, 8000);

    return () => {
      clearInterval(logInterval);
      clearInterval(layerInterval);
    };
  }, []);

  const systemAttributes = useMemo(() => [
    { label: 'Observer', val: 'ACTIVE', sub: 'Omni-presence Polling', icon: Eye },
    { label: 'Disparity', val: disparity.toFixed(4) + '%', sub: 'Tolerance Threshold', icon: Activity },
    { label: 'Consensus', val: 'HARD', sub: 'Block Signature Fixed', icon: CheckCircle2 },
    { label: 'Registry State', val: 'ABSOLUTE', sub: 'Immutable Fabric', icon: Database }
  ], [disparity]);

  return (
    <section className="py-60 relative bg-black overflow-hidden selection:bg-blue-600/30">
      {/* Decorative SVG Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="oracle-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 0 40 L 80 40 M 40 0 L 40 80" stroke="#3b82f6" strokeWidth="0.5" fill="none" />
            <circle cx="40" cy="40" r="1.5" fill="#3b82f6" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#oracle-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
          <div className="space-y-20">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-blue-600/10 border border-blue-600/20 rounded-full animate-in zoom-in-95 duration-700">
                <Radio size={16} className="text-blue-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">Final_Authority_Node_v6.2</span>
              </div>
              <h2 className="text-[7rem] lg:text-[11rem] font-black italic text-white uppercase tracking-tighter leading-[0.8]">
                The <br /> <span className="text-blue-600 not-italic">Oracle_Node</span>
              </h2>
              <p className="text-zinc-400 text-3xl font-bold italic leading-relaxed">
                "The <span className="text-white">final authority</span> on system parity. The Oracle observes the mesh from a sub-space perspective to detect any <span className="text-blue-500">discrepancies</span> in the global registry fabric."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {systemAttributes.map((attr, i) => (
                 <div key={i} className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-blue-500/40 transition-all hover:translate-y-[-8px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                       <attr.icon size={120} />
                    </div>
                    <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                       <attr.icon size={28} />
                    </div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                       {attr.label}
                    </p>
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">{attr.val}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{attr.sub}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative group">
            {/* Massive Ambient Aura */}
            <div className="absolute -inset-20 bg-blue-600/5 blur-[150px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-20 shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden flex flex-col justify-between h-[1000px]">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_50%)] opacity-30"></div>
               
               <div className="flex justify-between items-start relative z-10">
                  <div className="p-8 bg-blue-600/10 text-blue-500 rounded-[3rem] border border-blue-500/20 shadow-2xl group-hover:rotate-6 transition-transform duration-1000">
                     <Cpu size={56} className="animate-pulse" />
                  </div>
                  <div className="text-right space-y-3">
                     <p className="text-[14px] font-black text-zinc-500 uppercase tracking-[0.5em]">Network Layer</p>
                     <p className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">{activeLayer}</p>
                  </div>
               </div>

               {/* Central Scanning Component */}
               <div className="flex-1 my-24 relative flex items-center justify-center">
                  <div className="absolute inset-0 border-[3px] border-dashed border-zinc-900 rounded-full animate-spin [animation-duration:60s]"></div>
                  <div className="absolute inset-20 border border-blue-500/10 rounded-full animate-reverse-spin [animation-duration:40s]"></div>
                  <div className="absolute inset-40 border-2 border-zinc-800 rounded-full animate-spin [animation-duration:20s]"></div>
                  
                  <div className="text-center z-10 bg-black/40 backdrop-blur-3xl p-20 rounded-full border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                     <Zap size={64} className="text-blue-500 mx-auto mb-8 animate-bounce" />
                     <p className="text-[12px] font-black text-zinc-500 uppercase tracking-[0.8em] mb-4">Observation Depth</p>
                     <h4 className="text-9xl font-black text-white italic tracking-tighter leading-none">{scanProgress}<span className="text-3xl text-blue-500">%</span></h4>
                  </div>

                  {/* Dynamic Indicators */}
                  <div className="absolute inset-0 animate-spin [animation-duration:15s] pointer-events-none">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
                        <div className="w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_20px_#3b82f6]"></div>
                        <span className="text-[10px] font-black text-blue-500 uppercase bg-black px-4 py-2 rounded-full border border-blue-500/30">SCANNER_01</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-10 relative z-10">
                  <div className="bg-black/90 border border-zinc-900 rounded-[4rem] p-12 h-80 overflow-hidden relative group/console shadow-inner">
                    <div className="absolute top-0 inset-x-0 px-12 py-6 border-b border-zinc-900 bg-zinc-900/50 flex justify-between items-center backdrop-blur-md">
                       <div className="flex items-center gap-5">
                          <TerminalIcon size={16} className="text-blue-500" />
                          <span className="text-[11px] font-black uppercase text-zinc-500 tracking-[0.4em]">Oracle_OS Consensus Trace</span>
                       </div>
                       <div className="flex gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
                       </div>
                    </div>
                    <div className="mt-16 space-y-3 font-mono text-[11px] custom-scrollbar overflow-y-auto h-48 pt-6 px-4">
                      {logs.map((log, i) => (
                        <div key={i} className="flex gap-8 group/line animate-in slide-in-from-left-4 duration-500">
                           <span className="text-zinc-800 font-bold shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                           <span className={`${log.includes('verified') ? 'text-blue-400' : 'text-zinc-500'} group-hover/line:text-white transition-colors`}>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-12">
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]"></div>
                           <span className="text-[12px] font-black text-white uppercase tracking-widest">State: ABSOLUTE</span>
                        </div>
                        <div className="h-6 w-px bg-zinc-800"></div>
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Block Height: 884,102</span>
                     </div>
                     <Infinity size={24} className="text-zinc-800" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin { animation: reverse-spin linear infinite; }
      `}</style>
    </section>
  );
};

export default OracleAuthority;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/landing/OracleAuthority.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Activity, Search, Terminal as TerminalIcon, CheckCircle2, AlertTriangle, Infinity, Eye, Cpu, Zap, Radio, Database } from 'lucide-react';

const OracleAuthority: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [disparity, setDisparity] = useState(0.001);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeLayer, setActiveLayer] = useState<'MESH' | 'CONSENSUS' | 'HARD_STATE'>('MESH');

  useEffect(() => {
    const logInterval = setInterval(() => {
      setDisparity(prev => Math.max(0.0001, Math.min(0.01, prev + (Math.random() - 0.5) * 0.0005)));
      const regions = ['US', 'EU', 'JP', 'SG', 'AU'];
      const actions = ['Scanning block', 'Verifying hash', 'M2M handshake', 'Fabric sync'];
      const newLog = `[OBSERVER] ${actions[Math.floor(Math.random()*actions.length)]} ${Math.floor(Math.random()*900000)}... REGION_${regions[Math.floor(Math.random()*regions.length)]} verified.`;
      setLogs(prev => [newLog, ...prev].slice(0, 100));
      setScanProgress(p => (p + 1) % 101);
    }, 3000);

    const layerInterval = setInterval(() => {
      setActiveLayer(l => l === 'MESH' ? 'CONSENSUS' : l === 'CONSENSUS' ? 'HARD_STATE' : 'MESH');
    }, 8000);

    return () => {
      clearInterval(logInterval);
      clearInterval(layerInterval);
    };
  }, []);

  const systemAttributes = useMemo(() => [
    { label: 'Observer', val: 'ACTIVE', sub: 'Omni-presence Polling', icon: Eye },
    { label: 'Disparity', val: disparity.toFixed(4) + '%', sub: 'Tolerance Threshold', icon: Activity },
    { label: 'Consensus', val: 'HARD', sub: 'Block Signature Fixed', icon: CheckCircle2 },
    { label: 'Registry State', val: 'ABSOLUTE', sub: 'Immutable Fabric', icon: Database }
  ], [disparity]);

  return (
    <section className="py-60 relative bg-black overflow-hidden selection:bg-blue-600/30">
      {/* Decorative SVG Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="oracle-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 0 40 L 80 40 M 40 0 L 40 80" stroke="#3b82f6" strokeWidth="0.5" fill="none" />
            <circle cx="40" cy="40" r="1.5" fill="#3b82f6" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#oracle-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
          <div className="space-y-20">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-blue-600/10 border border-blue-600/20 rounded-full animate-in zoom-in-95 duration-700">
                <Radio size={16} className="text-blue-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">Final_Authority_Node_v6.2</span>
              </div>
              <h2 className="text-[7rem] lg:text-[11rem] font-black italic text-white uppercase tracking-tighter leading-[0.8]">
                The <br /> <span className="text-blue-600 not-italic">Oracle_Node</span>
              </h2>
              <p className="text-zinc-400 text-3xl font-bold italic leading-relaxed">
                "The <span className="text-white">final authority</span> on system parity. The Oracle observes the mesh from a sub-space perspective to detect any <span className="text-blue-500">discrepancies</span> in the global registry fabric."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {systemAttributes.map((attr, i) => (
                 <div key={i} className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-blue-500/40 transition-all hover:translate-y-[-8px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                       <attr.icon size={120} />
                    </div>
                    <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                       <attr.icon size={28} />
                    </div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                       {attr.label}
                    </p>
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">{attr.val}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{attr.sub}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative group">
            {/* Massive Ambient Aura */}
            <div className="absolute -inset-20 bg-blue-600/5 blur-[150px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-20 shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden flex flex-col justify-between h-[1000px]">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_50%)] opacity-30"></div>
               
               <div className="flex justify-between items-start relative z-10">
                  <div className="p-8 bg-blue-600/10 text-blue-500 rounded-[3rem] border border-blue-500/20 shadow-2xl group-hover:rotate-6 transition-transform duration-1000">
                     <Cpu size={56} className="animate-pulse" />
                  </div>
                  <div className="text-right space-y-3">
                     <p className="text-[14px] font-black text-zinc-500 uppercase tracking-[0.5em]">Network Layer</p>
                     <p className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">{activeLayer}</p>
                  </div>
               </div>

               {/* Central Scanning Component */}
               <div className="flex-1 my-24 relative flex items-center justify-center">
                  <div className="absolute inset-0 border-[3px] border-dashed border-zinc-900 rounded-full animate-spin [animation-duration:60s]"></div>
                  <div className="absolute inset-20 border border-blue-500/10 rounded-full animate-reverse-spin [animation-duration:40s]"></div>
                  <div className="absolute inset-40 border-2 border-zinc-800 rounded-full animate-spin [animation-duration:20s]"></div>
                  
                  <div className="text-center z-10 bg-black/40 backdrop-blur-3xl p-20 rounded-full border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                     <Zap size={64} className="text-blue-500 mx-auto mb-8 animate-bounce" />
                     <p className="text-[12px] font-black text-zinc-500 uppercase tracking-[0.8em] mb-4">Observation Depth</p>
                     <h4 className="text-9xl font-black text-white italic tracking-tighter leading-none">{scanProgress}<span className="text-3xl text-blue-500">%</span></h4>
                  </div>

                  {/* Dynamic Indicators */}
                  <div className="absolute inset-0 animate-spin [animation-duration:15s] pointer-events-none">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
                        <div className="w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_20px_#3b82f6]"></div>
                        <span className="text-[10px] font-black text-blue-500 uppercase bg-black px-4 py-2 rounded-full border border-blue-500/30">SCANNER_01</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-10 relative z-10">
                  <div className="bg-black/90 border border-zinc-900 rounded-[4rem] p-12 h-80 overflow-hidden relative group/console shadow-inner">
                    <div className="absolute top-0 inset-x-0 px-12 py-6 border-b border-zinc-900 bg-zinc-900/50 flex justify-between items-center backdrop-blur-md">
                       <div className="flex items-center gap-5">
                          <TerminalIcon size={16} className="text-blue-500" />
                          <span className="text-[11px] font-black uppercase text-zinc-500 tracking-[0.4em]">Oracle_OS Consensus Trace</span>
                       </div>
                       <div className="flex gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
                       </div>
                    </div>
                    <div className="mt-16 space-y-3 font-mono text-[11px] custom-scrollbar overflow-y-auto h-48 pt-6 px-4">
                      {logs.map((log, i) => (
                        <div key={i} className="flex gap-8 group/line animate-in slide-in-from-left-4 duration-500">
                           <span className="text-zinc-800 font-bold shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                           <span className={`${log.includes('verified') ? 'text-blue-400' : 'text-zinc-500'} group-hover/line:text-white transition-colors`}>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-12">
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]"></div>
                           <span className="text-[12px] font-black text-white uppercase tracking-widest">State: ABSOLUTE</span>
                        </div>
                        <div className="h-6 w-px bg-zinc-800"></div>
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Block Height: 884,102</span>
                     </div>
                     <Infinity size={24} className="text-zinc-800" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin { animation: reverse-spin linear infinite; }
      `}</style>
    </section>
  );
};

export default OracleAuthority;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/landing/OracleAuthority.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Activity, Search, Terminal as TerminalIcon, CheckCircle2, AlertTriangle, Infinity, Eye, Cpu, Zap, Radio, Database } from 'lucide-react';

const OracleAuthority: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [disparity, setDisparity] = useState(0.001);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeLayer, setActiveLayer] = useState<'MESH' | 'CONSENSUS' | 'HARD_STATE'>('MESH');

  useEffect(() => {
    const logInterval = setInterval(() => {
      setDisparity(prev => Math.max(0.0001, Math.min(0.01, prev + (Math.random() - 0.5) * 0.0005)));
      const regions = ['US', 'EU', 'JP', 'SG', 'AU'];
      const actions = ['Scanning block', 'Verifying hash', 'M2M handshake', 'Fabric sync'];
      const newLog = `[OBSERVER] ${actions[Math.floor(Math.random()*actions.length)]} ${Math.floor(Math.random()*900000)}... REGION_${regions[Math.floor(Math.random()*regions.length)]} verified.`;
      setLogs(prev => [newLog, ...prev].slice(0, 100));
      setScanProgress(p => (p + 1) % 101);
    }, 3000);

    const layerInterval = setInterval(() => {
      setActiveLayer(l => l === 'MESH' ? 'CONSENSUS' : l === 'CONSENSUS' ? 'HARD_STATE' : 'MESH');
    }, 8000);

    return () => {
      clearInterval(logInterval);
      clearInterval(layerInterval);
    };
  }, []);

  const systemAttributes = useMemo(() => [
    { label: 'Observer', val: 'ACTIVE', sub: 'Omni-presence Polling', icon: Eye },
    { label: 'Disparity', val: disparity.toFixed(4) + '%', sub: 'Tolerance Threshold', icon: Activity },
    { label: 'Consensus', val: 'HARD', sub: 'Block Signature Fixed', icon: CheckCircle2 },
    { label: 'Registry State', val: 'ABSOLUTE', sub: 'Immutable Fabric', icon: Database }
  ], [disparity]);

  return (
    <section className="py-60 relative bg-black overflow-hidden selection:bg-blue-600/30">
      {/* Decorative SVG Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="oracle-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 0 40 L 80 40 M 40 0 L 40 80" stroke="#3b82f6" strokeWidth="0.5" fill="none" />
            <circle cx="40" cy="40" r="1.5" fill="#3b82f6" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#oracle-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
          <div className="space-y-20">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-blue-600/10 border border-blue-600/20 rounded-full animate-in zoom-in-95 duration-700">
                <Radio size={16} className="text-blue-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">Final_Authority_Node_v6.2</span>
              </div>
              <h2 className="text-[7rem] lg:text-[11rem] font-black italic text-white uppercase tracking-tighter leading-[0.8]">
                The <br /> <span className="text-blue-600 not-italic">Oracle_Node</span>
              </h2>
              <p className="text-zinc-400 text-3xl font-bold italic leading-relaxed">
                "The <span className="text-white">final authority</span> on system parity. The Oracle observes the mesh from a sub-space perspective to detect any <span className="text-blue-500">discrepancies</span> in the global registry fabric."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {systemAttributes.map((attr, i) => (
                 <div key={i} className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-blue-500/40 transition-all hover:translate-y-[-8px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                       <attr.icon size={120} />
                    </div>
                    <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                       <attr.icon size={28} />
                    </div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                       {attr.label}
                    </p>
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">{attr.val}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{attr.sub}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative group">
            {/* Massive Ambient Aura */}
            <div className="absolute -inset-20 bg-blue-600/5 blur-[150px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-20 shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden flex flex-col justify-between h-[1000px]">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_50%)] opacity-30"></div>
               
               <div className="flex justify-between items-start relative z-10">
                  <div className="p-8 bg-blue-600/10 text-blue-500 rounded-[3rem] border border-blue-500/20 shadow-2xl group-hover:rotate-6 transition-transform duration-1000">
                     <Cpu size={56} className="animate-pulse" />
                  </div>
                  <div className="text-right space-y-3">
                     <p className="text-[14px] font-black text-zinc-500 uppercase tracking-[0.5em]">Network Layer</p>
                     <p className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">{activeLayer}</p>
                  </div>
               </div>

               {/* Central Scanning Component */}
               <div className="flex-1 my-24 relative flex items-center justify-center">
                  <div className="absolute inset-0 border-[3px] border-dashed border-zinc-900 rounded-full animate-spin [animation-duration:60s]"></div>
                  <div className="absolute inset-20 border border-blue-500/10 rounded-full animate-reverse-spin [animation-duration:40s]"></div>
                  <div className="absolute inset-40 border-2 border-zinc-800 rounded-full animate-spin [animation-duration:20s]"></div>
                  
                  <div className="text-center z-10 bg-black/40 backdrop-blur-3xl p-20 rounded-full border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                     <Zap size={64} className="text-blue-500 mx-auto mb-8 animate-bounce" />
                     <p className="text-[12px] font-black text-zinc-500 uppercase tracking-[0.8em] mb-4">Observation Depth</p>
                     <h4 className="text-9xl font-black text-white italic tracking-tighter leading-none">{scanProgress}<span className="text-3xl text-blue-500">%</span></h4>
                  </div>

                  {/* Dynamic Indicators */}
                  <div className="absolute inset-0 animate-spin [animation-duration:15s] pointer-events-none">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
                        <div className="w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_20px_#3b82f6]"></div>
                        <span className="text-[10px] font-black text-blue-500 uppercase bg-black px-4 py-2 rounded-full border border-blue-500/30">SCANNER_01</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-10 relative z-10">
                  <div className="bg-black/90 border border-zinc-900 rounded-[4rem] p-12 h-80 overflow-hidden relative group/console shadow-inner">
                    <div className="absolute top-0 inset-x-0 px-12 py-6 border-b border-zinc-900 bg-zinc-900/50 flex justify-between items-center backdrop-blur-md">
                       <div className="flex items-center gap-5">
                          <TerminalIcon size={16} className="text-blue-500" />
                          <span className="text-[11px] font-black uppercase text-zinc-500 tracking-[0.4em]">Oracle_OS Consensus Trace</span>
                       </div>
                       <div className="flex gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
                       </div>
                    </div>
                    <div className="mt-16 space-y-3 font-mono text-[11px] custom-scrollbar overflow-y-auto h-48 pt-6 px-4">
                      {logs.map((log, i) => (
                        <div key={i} className="flex gap-8 group/line animate-in slide-in-from-left-4 duration-500">
                           <span className="text-zinc-800 font-bold shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                           <span className={`${log.includes('verified') ? 'text-blue-400' : 'text-zinc-500'} group-hover/line:text-white transition-colors`}>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-12">
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]"></div>
                           <span className="text-[12px] font-black text-white uppercase tracking-widest">State: ABSOLUTE</span>
                        </div>
                        <div className="h-6 w-px bg-zinc-800"></div>
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Block Height: 884,102</span>
                     </div>
                     <Infinity size={24} className="text-zinc-800" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin { animation: reverse-spin linear infinite; }
      `}</style>
    </section>
  );
};

export default OracleAuthority;