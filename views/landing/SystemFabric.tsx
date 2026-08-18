// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/landing/SystemFabric.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { Infinity, Globe, Database, Network, ShieldCheck, Cpu, Radio, Server, Activity, Shield } from 'lucide-react';

const SystemFabric: React.FC = () => {
  const [load, setLoad] = useState(14.2);
  const [activeRegion, setActiveRegion] = useState('US-EAST');
  const [nodeCount, setNodeCount] = useState(1242);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoad(prev => Math.max(10, Math.min(25, prev + (Math.random() - 0.5))));
      if (Math.random() > 0.8) setNodeCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const regions = [
    { name: 'US-EAST', load: '12%', latency: '0.4ms', status: 'Optimal' },
    { name: 'EU-WEST', load: '18%', latency: '0.8ms', status: 'Optimal' },
    { name: 'AP-SOUTH', load: '14%', latency: '1.2ms', status: 'Synced' },
    { name: 'LATAM', load: '22%', latency: '1.5ms', status: 'Stable' }
  ];

  return (
    <section className="py-60 border-b border-zinc-900 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_70%)]"></div>

      <div className="max-w-7xl mx-auto px-10 text-center space-y-24">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-full mx-auto animate-in zoom-in-95 duration-700">
            <Radio size={16} className="text-blue-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">System_Fabric_Layer_v6.2</span>
          </div>
          <h2 className="text-[7rem] lg:text-[11rem] font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-4">
            System <br /> <span className="text-blue-600 not-italic">Fabric_v6</span>
          </h2>
          <p className="text-zinc-500 text-3xl max-w-6xl mx-auto leading-relaxed font-bold italic">
            "The <span className="text-white">connective tissue</span> of our global registry. We maintain over <span className="text-blue-500 mono">{nodeCount}</span> active nodes across sub-space mesh fabrics. Our <span className="text-blue-500">consensus</span> mechanism ensures that every ledger entry is cryptographically absolute."
          </p>
        </div>

        {/* Global Cluster Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: 'Collective Load', val: `${load.toFixed(1)}%`, sub: 'Sub-space Pathing', icon: Network, color: 'blue' },
            { label: 'Mesh Parity', val: '100%', sub: 'Deterministic State', icon: ShieldCheck, color: 'emerald' },
            { label: 'Encryption', val: 'AES-256', sub: 'M2M Encapsulation', icon: Database, color: 'purple' },
            { label: 'Sovereignty', val: 'ABSOLUTE', sub: 'Neural Authority', icon: Cpu, color: 'amber' },
          ].map((item, i) => (
            <div key={i} className="p-16 bg-zinc-950 border border-zinc-900 rounded-[5rem] group hover:border-blue-500/40 transition-all hover:scale-105 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                <item.icon size={200} />
              </div>
              <div className={`w-20 h-20 bg-${item.color}-500/10 text-${item.color}-500 rounded-[2.5rem] flex items-center justify-center mb-12 border border-white/5 shadow-2xl group-hover:rotate-12 transition-transform duration-700`}>
                <item.icon size={40} />
              </div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                 <span className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 animate-pulse`}></span>
                 {item.label}
              </p>
              <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-3 leading-none">{item.val}</h3>
              <p className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.3em]">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Regional Monitoring Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-40">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 shadow-2xl text-left relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,#3b82f6_0%,transparent_40%)] opacity-20"></div>
              <div className="flex items-center justify-between mb-16 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-5 bg-blue-600/10 text-blue-500 rounded-[2rem] border border-blue-500/20 shadow-2xl">
                       <Globe size={32} />
                    </div>
                    <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">Regional Mesh Polling</h4>
                 </div>
                 <Activity size={24} className="text-zinc-800 animate-pulse" />
              </div>
              <div className="space-y-10 relative z-10">
                 {regions.map((reg, i) => (
                   <button 
                     key={i} 
                     onClick={() => setActiveRegion(reg.name)}
                     className={`w-full flex items-center justify-between p-8 rounded-[2.5rem] border transition-all ${activeRegion === reg.name ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-black border-zinc-900 opacity-60 hover:opacity-100 hover:border-zinc-700'}`}
                   >
                     <div className="flex items-center gap-8">
                        <span className="text-lg font-black text-white mono">{reg.name}</span>
                        <div className="h-1 w-24 bg-zinc-900 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600" style={{ width: reg.load }}></div>
                        </div>
                     </div>
                     <div className="flex items-center gap-10">
                        <div className="text-right">
                           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Latency</p>
                           <p className="text-sm font-black text-blue-400 mono">{reg.latency}</p>
                        </div>
                        <div className="text-right min-w-[80px]">
                           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Status</p>
                           <p className="text-sm font-black text-emerald-500 uppercase">{reg.status}</p>
                        </div>
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 shadow-2xl text-left flex flex-col justify-between group">
              <div className="space-y-10">
                 <div className="p-6 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 shadow-2xl inline-block group-hover:scale-110 transition-transform duration-700">
                    <Shield size={48} className="text-blue-500" />
                 </div>
                 <h4 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">Absolute <br /> <span className="text-blue-500">Node Architecture</span></h4>
                 <p className="text-zinc-500 text-lg font-bold leading-relaxed italic">
                    "Every node in the Lumina fabric is a self-contained vault, performing real-time zero-knowledge proofs to ensure total network integrity without centralized reliance."
                 </p>
              </div>
              <div className="pt-16 border-t border-zinc-900 grid grid-cols-3 gap-8">
                 {[
                   { icon: Server, label: 'Bare Metal Cluster' },
                   { icon: ShieldCheck, label: 'Quantum Sealed' },
                   { icon: Infinity, label: 'Zero Persistence' }
                 ].map((t, i) => (
                   <div key={i} className="text-center space-y-3 opacity-40 hover:opacity-100 transition-opacity">
                      <t.icon size={24} className="text-zinc-500 mx-auto" />
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-tight">{t.label}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-20 opacity-10 hover:opacity-100 transition-all duration-1000 grayscale hover:grayscale-0">
           {['Global Hub', 'Encrypted Core', 'Hard Consensus', 'State Elasticity'].map((label, i) => (
             <div key={i} className="flex flex-col items-center gap-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">{label}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default SystemFabric;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/landing/SystemFabric.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { Infinity, Globe, Database, Network, ShieldCheck, Cpu, Radio, Server, Activity, Shield } from 'lucide-react';

const SystemFabric: React.FC = () => {
  const [load, setLoad] = useState(14.2);
  const [activeRegion, setActiveRegion] = useState('US-EAST');
  const [nodeCount, setNodeCount] = useState(1242);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoad(prev => Math.max(10, Math.min(25, prev + (Math.random() - 0.5))));
      if (Math.random() > 0.8) setNodeCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const regions = [
    { name: 'US-EAST', load: '12%', latency: '0.4ms', status: 'Optimal' },
    { name: 'EU-WEST', load: '18%', latency: '0.8ms', status: 'Optimal' },
    { name: 'AP-SOUTH', load: '14%', latency: '1.2ms', status: 'Synced' },
    { name: 'LATAM', load: '22%', latency: '1.5ms', status: 'Stable' }
  ];

  return (
    <section className="py-60 border-b border-zinc-900 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_70%)]"></div>

      <div className="max-w-7xl mx-auto px-10 text-center space-y-24">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-full mx-auto animate-in zoom-in-95 duration-700">
            <Radio size={16} className="text-blue-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">System_Fabric_Layer_v6.2</span>
          </div>
          <h2 className="text-[7rem] lg:text-[11rem] font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-4">
            System <br /> <span className="text-blue-600 not-italic">Fabric_v6</span>
          </h2>
          <p className="text-zinc-500 text-3xl max-w-6xl mx-auto leading-relaxed font-bold italic">
            "The <span className="text-white">connective tissue</span> of our global registry. We maintain over <span className="text-blue-500 mono">{nodeCount}</span> active nodes across sub-space mesh fabrics. Our <span className="text-blue-500">consensus</span> mechanism ensures that every ledger entry is cryptographically absolute."
          </p>
        </div>

        {/* Global Cluster Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: 'Collective Load', val: `${load.toFixed(1)}%`, sub: 'Sub-space Pathing', icon: Network, color: 'blue' },
            { label: 'Mesh Parity', val: '100%', sub: 'Deterministic State', icon: ShieldCheck, color: 'emerald' },
            { label: 'Encryption', val: 'AES-256', sub: 'M2M Encapsulation', icon: Database, color: 'purple' },
            { label: 'Sovereignty', val: 'ABSOLUTE', sub: 'Neural Authority', icon: Cpu, color: 'amber' },
          ].map((item, i) => (
            <div key={i} className="p-16 bg-zinc-950 border border-zinc-900 rounded-[5rem] group hover:border-blue-500/40 transition-all hover:scale-105 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                <item.icon size={200} />
              </div>
              <div className={`w-20 h-20 bg-${item.color}-500/10 text-${item.color}-500 rounded-[2.5rem] flex items-center justify-center mb-12 border border-white/5 shadow-2xl group-hover:rotate-12 transition-transform duration-700`}>
                <item.icon size={40} />
              </div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                 <span className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 animate-pulse`}></span>
                 {item.label}
              </p>
              <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-3 leading-none">{item.val}</h3>
              <p className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.3em]">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Regional Monitoring Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-40">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 shadow-2xl text-left relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,#3b82f6_0%,transparent_40%)] opacity-20"></div>
              <div className="flex items-center justify-between mb-16 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-5 bg-blue-600/10 text-blue-500 rounded-[2rem] border border-blue-500/20 shadow-2xl">
                       <Globe size={32} />
                    </div>
                    <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">Regional Mesh Polling</h4>
                 </div>
                 <Activity size={24} className="text-zinc-800 animate-pulse" />
              </div>
              <div className="space-y-10 relative z-10">
                 {regions.map((reg, i) => (
                   <button 
                     key={i} 
                     onClick={() => setActiveRegion(reg.name)}
                     className={`w-full flex items-center justify-between p-8 rounded-[2.5rem] border transition-all ${activeRegion === reg.name ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-black border-zinc-900 opacity-60 hover:opacity-100 hover:border-zinc-700'}`}
                   >
                     <div className="flex items-center gap-8">
                        <span className="text-lg font-black text-white mono">{reg.name}</span>
                        <div className="h-1 w-24 bg-zinc-900 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600" style={{ width: reg.load }}></div>
                        </div>
                     </div>
                     <div className="flex items-center gap-10">
                        <div className="text-right">
                           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Latency</p>
                           <p className="text-sm font-black text-blue-400 mono">{reg.latency}</p>
                        </div>
                        <div className="text-right min-w-[80px]">
                           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Status</p>
                           <p className="text-sm font-black text-emerald-500 uppercase">{reg.status}</p>
                        </div>
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 shadow-2xl text-left flex flex-col justify-between group">
              <div className="space-y-10">
                 <div className="p-6 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 shadow-2xl inline-block group-hover:scale-110 transition-transform duration-700">
                    <Shield size={48} className="text-blue-500" />
                 </div>
                 <h4 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">Absolute <br /> <span className="text-blue-500">Node Architecture</span></h4>
                 <p className="text-zinc-500 text-lg font-bold leading-relaxed italic">
                    "Every node in the Lumina fabric is a self-contained vault, performing real-time zero-knowledge proofs to ensure total network integrity without centralized reliance."
                 </p>
              </div>
              <div className="pt-16 border-t border-zinc-900 grid grid-cols-3 gap-8">
                 {[
                   { icon: Server, label: 'Bare Metal Cluster' },
                   { icon: ShieldCheck, label: 'Quantum Sealed' },
                   { icon: Infinity, label: 'Zero Persistence' }
                 ].map((t, i) => (
                   <div key={i} className="text-center space-y-3 opacity-40 hover:opacity-100 transition-opacity">
                      <t.icon size={24} className="text-zinc-500 mx-auto" />
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-tight">{t.label}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-20 opacity-10 hover:opacity-100 transition-all duration-1000 grayscale hover:grayscale-0">
           {['Global Hub', 'Encrypted Core', 'Hard Consensus', 'State Elasticity'].map((label, i) => (
             <div key={i} className="flex flex-col items-center gap-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">{label}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default SystemFabric;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/landing/SystemFabric.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { Infinity, Globe, Database, Network, ShieldCheck, Cpu, Radio, Server, Activity, Shield } from 'lucide-react';

const SystemFabric: React.FC = () => {
  const [load, setLoad] = useState(14.2);
  const [activeRegion, setActiveRegion] = useState('US-EAST');
  const [nodeCount, setNodeCount] = useState(1242);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoad(prev => Math.max(10, Math.min(25, prev + (Math.random() - 0.5))));
      if (Math.random() > 0.8) setNodeCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const regions = [
    { name: 'US-EAST', load: '12%', latency: '0.4ms', status: 'Optimal' },
    { name: 'EU-WEST', load: '18%', latency: '0.8ms', status: 'Optimal' },
    { name: 'AP-SOUTH', load: '14%', latency: '1.2ms', status: 'Synced' },
    { name: 'LATAM', load: '22%', latency: '1.5ms', status: 'Stable' }
  ];

  return (
    <section className="py-60 border-b border-zinc-900 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_70%)]"></div>

      <div className="max-w-7xl mx-auto px-10 text-center space-y-24">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-full mx-auto animate-in zoom-in-95 duration-700">
            <Radio size={16} className="text-blue-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">System_Fabric_Layer_v6.2</span>
          </div>
          <h2 className="text-[7rem] lg:text-[11rem] font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-4">
            System <br /> <span className="text-blue-600 not-italic">Fabric_v6</span>
          </h2>
          <p className="text-zinc-500 text-3xl max-w-6xl mx-auto leading-relaxed font-bold italic">
            "The <span className="text-white">connective tissue</span> of our global registry. We maintain over <span className="text-blue-500 mono">{nodeCount}</span> active nodes across sub-space mesh fabrics. Our <span className="text-blue-500">consensus</span> mechanism ensures that every ledger entry is cryptographically absolute."
          </p>
        </div>

        {/* Global Cluster Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: 'Collective Load', val: `${load.toFixed(1)}%`, sub: 'Sub-space Pathing', icon: Network, color: 'blue' },
            { label: 'Mesh Parity', val: '100%', sub: 'Deterministic State', icon: ShieldCheck, color: 'emerald' },
            { label: 'Encryption', val: 'AES-256', sub: 'M2M Encapsulation', icon: Database, color: 'purple' },
            { label: 'Sovereignty', val: 'ABSOLUTE', sub: 'Neural Authority', icon: Cpu, color: 'amber' },
          ].map((item, i) => (
            <div key={i} className="p-16 bg-zinc-950 border border-zinc-900 rounded-[5rem] group hover:border-blue-500/40 transition-all hover:scale-105 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                <item.icon size={200} />
              </div>
              <div className={`w-20 h-20 bg-${item.color}-500/10 text-${item.color}-500 rounded-[2.5rem] flex items-center justify-center mb-12 border border-white/5 shadow-2xl group-hover:rotate-12 transition-transform duration-700`}>
                <item.icon size={40} />
              </div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                 <span className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 animate-pulse`}></span>
                 {item.label}
              </p>
              <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-3 leading-none">{item.val}</h3>
              <p className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.3em]">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Regional Monitoring Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-40">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 shadow-2xl text-left relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,#3b82f6_0%,transparent_40%)] opacity-20"></div>
              <div className="flex items-center justify-between mb-16 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-5 bg-blue-600/10 text-blue-500 rounded-[2rem] border border-blue-500/20 shadow-2xl">
                       <Globe size={32} />
                    </div>
                    <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">Regional Mesh Polling</h4>
                 </div>
                 <Activity size={24} className="text-zinc-800 animate-pulse" />
              </div>
              <div className="space-y-10 relative z-10">
                 {regions.map((reg, i) => (
                   <button 
                     key={i} 
                     onClick={() => setActiveRegion(reg.name)}
                     className={`w-full flex items-center justify-between p-8 rounded-[2.5rem] border transition-all ${activeRegion === reg.name ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-black border-zinc-900 opacity-60 hover:opacity-100 hover:border-zinc-700'}`}
                   >
                     <div className="flex items-center gap-8">
                        <span className="text-lg font-black text-white mono">{reg.name}</span>
                        <div className="h-1 w-24 bg-zinc-900 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600" style={{ width: reg.load }}></div>
                        </div>
                     </div>
                     <div className="flex items-center gap-10">
                        <div className="text-right">
                           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Latency</p>
                           <p className="text-sm font-black text-blue-400 mono">{reg.latency}</p>
                        </div>
                        <div className="text-right min-w-[80px]">
                           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Status</p>
                           <p className="text-sm font-black text-emerald-500 uppercase">{reg.status}</p>
                        </div>
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 shadow-2xl text-left flex flex-col justify-between group">
              <div className="space-y-10">
                 <div className="p-6 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 shadow-2xl inline-block group-hover:scale-110 transition-transform duration-700">
                    <Shield size={48} className="text-blue-500" />
                 </div>
                 <h4 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">Absolute <br /> <span className="text-blue-500">Node Architecture</span></h4>
                 <p className="text-zinc-500 text-lg font-bold leading-relaxed italic">
                    "Every node in the Lumina fabric is a self-contained vault, performing real-time zero-knowledge proofs to ensure total network integrity without centralized reliance."
                 </p>
              </div>
              <div className="pt-16 border-t border-zinc-900 grid grid-cols-3 gap-8">
                 {[
                   { icon: Server, label: 'Bare Metal Cluster' },
                   { icon: ShieldCheck, label: 'Quantum Sealed' },
                   { icon: Infinity, label: 'Zero Persistence' }
                 ].map((t, i) => (
                   <div key={i} className="text-center space-y-3 opacity-40 hover:opacity-100 transition-opacity">
                      <t.icon size={24} className="text-zinc-500 mx-auto" />
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-tight">{t.label}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-20 opacity-10 hover:opacity-100 transition-all duration-1000 grayscale hover:grayscale-0">
           {['Global Hub', 'Encrypted Core', 'Hard Consensus', 'State Elasticity'].map((label, i) => (
             <div key={i} className="flex flex-col items-center gap-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600">{label}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default SystemFabric;