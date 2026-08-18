// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/landing/AssetFoundry.tsx
================================================================================

import React, { useState } from 'react';
import { Hammer, Zap, Box, Layers, ArrowUpRight, CheckCircle2, FlaskConical } from 'lucide-react';

const AssetFoundry: React.FC = () => {
  const [forging, setForging] = useState(false);

  const startForge = () => {
    setForging(true);
    setTimeout(() => setForging(false), 3000);
  };

  return (
    <section className="py-40 border-b border-zinc-900 bg-black">
      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
        <div className="relative group order-2 lg:order-1">
          <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/30 to-blue-500/30 blur-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 aspect-[4/5] flex flex-col justify-between shadow-2xl relative z-10 overflow-hidden">
             <div className="flex justify-between items-start">
                <div className="space-y-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
                      <Zap size={10} className="animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Synthesis Node</span>
                   </div>
                   <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Quantum Relic <br /> <span className="text-zinc-600">#8821</span></h3>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-3xl text-amber-500">
                   <FlaskConical size={32} />
                </div>
             </div>

             <div className="flex-1 my-12 bg-black rounded-[3rem] border border-zinc-900 flex items-center justify-center overflow-hidden relative group/inner">
                <div className={`transition-all duration-1000 ${forging ? 'scale-125 opacity-0 blur-2xl' : 'scale-100 opacity-100 blur-0'}`}>
                   <Box size={220} className="text-blue-500 opacity-10 group-hover/inner:opacity-20 transition-opacity" />
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${forging ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}>
                   <div className="w-64 h-64 bg-amber-500/20 rounded-full blur-[100px] animate-pulse"></div>
                   <Zap size={120} className="text-amber-500 animate-bounce" />
                </div>
                {!forging && (
                   <div className="absolute bottom-10 inset-x-0 flex justify-center animate-in fade-in slide-in-from-bottom-4">
                      <button 
                         onClick={startForge}
                         className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
                      >
                         Execute Synthesis
                      </button>
                   </div>
                )}
             </div>

             <div className="grid grid-cols-3 gap-6">
                {[
                  { l: 'Forge State', v: forging ? 'ACTIVE' : 'READY', c: forging ? 'text-amber-500' : 'text-emerald-500' },
                  { l: 'Asset Grade', v: 'ELITE', c: 'text-white' },
                  { l: 'Block State', v: 'MINED', c: 'text-zinc-500' },
                ].map((t, i) => (
                  <div key={i} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center space-y-1">
                     <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{t.l}</p>
                     <p className={`text-[10px] font-black uppercase tracking-widest ${t.c}`}>{t.v}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-12 order-1 lg:order-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">Relic_Synthesis</span>
            </div>
            <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
              Asset <br /> <span className="text-amber-500 not-italic">Foundry</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-2xl leading-relaxed font-bold italic">
            "Forging <span className="text-white">neural relics</span> from the heat of transaction data. Our foundry synthesizes high-fidelity digital assets that represent <span className="text-amber-500">institutional milestones</span> within the quantum mesh."
          </p>
          <ul className="space-y-8">
             {[
               'Neural Block Validation', 
               'IPFS Metadata Pinning', 
               'Proof of Transaction Heritage', 
               'Smart Contract Encapsulation'
             ].map((u, i) => (
               <li key={i} className="flex items-center gap-8 group cursor-default">
                  <div className="w-12 h-12 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center text-zinc-700 group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all shadow-xl">
                     <Hammer size={20} />
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Protocol v6.0</p>
                     <p className="text-lg font-black text-white uppercase italic tracking-tighter">{u}</p>
                  </div>
               </li>
             ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AssetFoundry;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/landing/AssetFoundry.tsx
================================================================================

import React, { useState } from 'react';
import { Hammer, Zap, Box, Layers, ArrowUpRight, CheckCircle2, FlaskConical } from 'lucide-react';

const AssetFoundry: React.FC = () => {
  const [forging, setForging] = useState(false);

  const startForge = () => {
    setForging(true);
    setTimeout(() => setForging(false), 3000);
  };

  return (
    <section className="py-40 border-b border-zinc-900 bg-black">
      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
        <div className="relative group order-2 lg:order-1">
          <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/30 to-blue-500/30 blur-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 aspect-[4/5] flex flex-col justify-between shadow-2xl relative z-10 overflow-hidden">
             <div className="flex justify-between items-start">
                <div className="space-y-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
                      <Zap size={10} className="animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Synthesis Node</span>
                   </div>
                   <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Quantum Relic <br /> <span className="text-zinc-600">#8821</span></h3>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-3xl text-amber-500">
                   <FlaskConical size={32} />
                </div>
             </div>

             <div className="flex-1 my-12 bg-black rounded-[3rem] border border-zinc-900 flex items-center justify-center overflow-hidden relative group/inner">
                <div className={`transition-all duration-1000 ${forging ? 'scale-125 opacity-0 blur-2xl' : 'scale-100 opacity-100 blur-0'}`}>
                   <Box size={220} className="text-blue-500 opacity-10 group-hover/inner:opacity-20 transition-opacity" />
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${forging ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}>
                   <div className="w-64 h-64 bg-amber-500/20 rounded-full blur-[100px] animate-pulse"></div>
                   <Zap size={120} className="text-amber-500 animate-bounce" />
                </div>
                {!forging && (
                   <div className="absolute bottom-10 inset-x-0 flex justify-center animate-in fade-in slide-in-from-bottom-4">
                      <button 
                         onClick={startForge}
                         className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
                      >
                         Execute Synthesis
                      </button>
                   </div>
                )}
             </div>

             <div className="grid grid-cols-3 gap-6">
                {[
                  { l: 'Forge State', v: forging ? 'ACTIVE' : 'READY', c: forging ? 'text-amber-500' : 'text-emerald-500' },
                  { l: 'Asset Grade', v: 'ELITE', c: 'text-white' },
                  { l: 'Block State', v: 'MINED', c: 'text-zinc-500' },
                ].map((t, i) => (
                  <div key={i} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center space-y-1">
                     <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{t.l}</p>
                     <p className={`text-[10px] font-black uppercase tracking-widest ${t.c}`}>{t.v}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-12 order-1 lg:order-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">Relic_Synthesis</span>
            </div>
            <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
              Asset <br /> <span className="text-amber-500 not-italic">Foundry</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-2xl leading-relaxed font-bold italic">
            "Forging <span className="text-white">neural relics</span> from the heat of transaction data. Our foundry synthesizes high-fidelity digital assets that represent <span className="text-amber-500">institutional milestones</span> within the quantum mesh."
          </p>
          <ul className="space-y-8">
             {[
               'Neural Block Validation', 
               'IPFS Metadata Pinning', 
               'Proof of Transaction Heritage', 
               'Smart Contract Encapsulation'
             ].map((u, i) => (
               <li key={i} className="flex items-center gap-8 group cursor-default">
                  <div className="w-12 h-12 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center text-zinc-700 group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all shadow-xl">
                     <Hammer size={20} />
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Protocol v6.0</p>
                     <p className="text-lg font-black text-white uppercase italic tracking-tighter">{u}</p>
                  </div>
               </li>
             ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AssetFoundry;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/landing/AssetFoundry.tsx
================================================================================

import React, { useState } from 'react';
import { Hammer, Zap, Box, Layers, ArrowUpRight, CheckCircle2, FlaskConical } from 'lucide-react';

const AssetFoundry: React.FC = () => {
  const [forging, setForging] = useState(false);

  const startForge = () => {
    setForging(true);
    setTimeout(() => setForging(false), 3000);
  };

  return (
    <section className="py-40 border-b border-zinc-900 bg-black">
      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
        <div className="relative group order-2 lg:order-1">
          <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/30 to-blue-500/30 blur-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 aspect-[4/5] flex flex-col justify-between shadow-2xl relative z-10 overflow-hidden">
             <div className="flex justify-between items-start">
                <div className="space-y-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
                      <Zap size={10} className="animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Synthesis Node</span>
                   </div>
                   <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Quantum Relic <br /> <span className="text-zinc-600">#8821</span></h3>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-3xl text-amber-500">
                   <FlaskConical size={32} />
                </div>
             </div>

             <div className="flex-1 my-12 bg-black rounded-[3rem] border border-zinc-900 flex items-center justify-center overflow-hidden relative group/inner">
                <div className={`transition-all duration-1000 ${forging ? 'scale-125 opacity-0 blur-2xl' : 'scale-100 opacity-100 blur-0'}`}>
                   <Box size={220} className="text-blue-500 opacity-10 group-hover/inner:opacity-20 transition-opacity" />
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${forging ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}>
                   <div className="w-64 h-64 bg-amber-500/20 rounded-full blur-[100px] animate-pulse"></div>
                   <Zap size={120} className="text-amber-500 animate-bounce" />
                </div>
                {!forging && (
                   <div className="absolute bottom-10 inset-x-0 flex justify-center animate-in fade-in slide-in-from-bottom-4">
                      <button 
                         onClick={startForge}
                         className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
                      >
                         Execute Synthesis
                      </button>
                   </div>
                )}
             </div>

             <div className="grid grid-cols-3 gap-6">
                {[
                  { l: 'Forge State', v: forging ? 'ACTIVE' : 'READY', c: forging ? 'text-amber-500' : 'text-emerald-500' },
                  { l: 'Asset Grade', v: 'ELITE', c: 'text-white' },
                  { l: 'Block State', v: 'MINED', c: 'text-zinc-500' },
                ].map((t, i) => (
                  <div key={i} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center space-y-1">
                     <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{t.l}</p>
                     <p className={`text-[10px] font-black uppercase tracking-widest ${t.c}`}>{t.v}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-12 order-1 lg:order-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">Relic_Synthesis</span>
            </div>
            <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
              Asset <br /> <span className="text-amber-500 not-italic">Foundry</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-2xl leading-relaxed font-bold italic">
            "Forging <span className="text-white">neural relics</span> from the heat of transaction data. Our foundry synthesizes high-fidelity digital assets that represent <span className="text-amber-500">institutional milestones</span> within the quantum mesh."
          </p>
          <ul className="space-y-8">
             {[
               'Neural Block Validation', 
               'IPFS Metadata Pinning', 
               'Proof of Transaction Heritage', 
               'Smart Contract Encapsulation'
             ].map((u, i) => (
               <li key={i} className="flex items-center gap-8 group cursor-default">
                  <div className="w-12 h-12 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center text-zinc-700 group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all shadow-xl">
                     <Hammer size={20} />
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Protocol v6.0</p>
                     <p className="text-lg font-black text-white uppercase italic tracking-tighter">{u}</p>
                  </div>
               </li>
             ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AssetFoundry;