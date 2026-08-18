// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/landing/RegistryVault.tsx
================================================================================

import React from 'react';
import { Building2, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, Layers } from 'lucide-react';

const RegistryVault: React.FC = () => {
  return (
    <section className="py-40 border-b border-zinc-900 bg-black relative">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Vault_Integration</span>
              </div>
              <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
                Bank <br /> <span className="text-blue-600 not-italic">Registry_Node</span>
              </h2>
            </div>
            <p className="text-zinc-400 text-2xl leading-relaxed font-bold italic">
              "Direct M2M handshakes with <span className="text-white">institutional vaults</span>. We utilize the FDX-standard to provision virtual nodes that route liquidity directly from your treasury into the <span className="text-blue-500">Quantum foundry</span>."
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { t: 'FDX Native', s: 'Active' },
                 { t: 'Vault Sync', s: 'Priority' },
                 { t: 'Audit Log', s: 'Signed' },
                 { t: 'Routing', s: 'Layer 2' }
               ].map((line, i) => (
                 <div key={i} className="flex items-center gap-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl group hover:border-blue-500/50 transition-all shadow-xl">
                    <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform"><CheckCircle2 size={18} /></div>
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{line.t}</p>
                       <p className="text-[11px] font-black text-white uppercase tracking-widest">{line.s}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group relative z-10">
               <div className="flex items-center justify-between mb-16">
                  <div className="flex items-center gap-4">
                     <Building2 size={28} className="text-blue-500" />
                     <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Registry Metadata Node</span>
                  </div>
                  <div className="flex gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
                  </div>
               </div>
               <div className="space-y-10">
                  {[
                    { name: 'Citi Master Node', balance: '$1,245,000.50', status: 'ACTIVE', trend: '+1.2%' },
                    { name: 'Chase Liquidity Node', balance: '$840,200.00', status: 'SYNCING', trend: 'STABLE' },
                    { name: 'DB Treasury Hub', balance: '$2,105,000.12', status: 'ACTIVE', trend: '+0.4%' },
                  ].map((acc, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-zinc-900 pb-10 last:border-0 last:pb-0 hover:border-zinc-700 transition-colors group/item cursor-default">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 group-hover/item:text-blue-500 transition-colors">{acc.name}</p>
                          <h4 className="text-4xl font-black text-white mono tracking-tighter italic">{acc.balance}</h4>
                       </div>
                       <div className="text-right space-y-2">
                          <p className="text-[8px] font-black text-emerald-500 mono">{acc.trend}</p>
                          <p className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${acc.status === 'ACTIVE' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'}`}>
                            {acc.status}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-16 pt-10 border-t border-zinc-900 flex justify-between items-center">
                  <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                     <RefreshCw size={14} className="animate-spin [animation-duration:5s]" />
                     <span>Last Polled: 2m ago</span>
                  </div>
                  <button className="text-blue-500 hover:text-white transition-colors flex items-center gap-2 group/btn">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Full Registry</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistryVault;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/landing/RegistryVault.tsx
================================================================================

import React from 'react';
import { Building2, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, Layers } from 'lucide-react';

const RegistryVault: React.FC = () => {
  return (
    <section className="py-40 border-b border-zinc-900 bg-black relative">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Vault_Integration</span>
              </div>
              <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
                Bank <br /> <span className="text-blue-600 not-italic">Registry_Node</span>
              </h2>
            </div>
            <p className="text-zinc-400 text-2xl leading-relaxed font-bold italic">
              "Direct M2M handshakes with <span className="text-white">institutional vaults</span>. We utilize the FDX-standard to provision virtual nodes that route liquidity directly from your treasury into the <span className="text-blue-500">Quantum foundry</span>."
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { t: 'FDX Native', s: 'Active' },
                 { t: 'Vault Sync', s: 'Priority' },
                 { t: 'Audit Log', s: 'Signed' },
                 { t: 'Routing', s: 'Layer 2' }
               ].map((line, i) => (
                 <div key={i} className="flex items-center gap-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl group hover:border-blue-500/50 transition-all shadow-xl">
                    <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform"><CheckCircle2 size={18} /></div>
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{line.t}</p>
                       <p className="text-[11px] font-black text-white uppercase tracking-widest">{line.s}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group relative z-10">
               <div className="flex items-center justify-between mb-16">
                  <div className="flex items-center gap-4">
                     <Building2 size={28} className="text-blue-500" />
                     <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Registry Metadata Node</span>
                  </div>
                  <div className="flex gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
                  </div>
               </div>
               <div className="space-y-10">
                  {[
                    { name: 'Citi Master Node', balance: '$1,245,000.50', status: 'ACTIVE', trend: '+1.2%' },
                    { name: 'Chase Liquidity Node', balance: '$840,200.00', status: 'SYNCING', trend: 'STABLE' },
                    { name: 'DB Treasury Hub', balance: '$2,105,000.12', status: 'ACTIVE', trend: '+0.4%' },
                  ].map((acc, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-zinc-900 pb-10 last:border-0 last:pb-0 hover:border-zinc-700 transition-colors group/item cursor-default">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 group-hover/item:text-blue-500 transition-colors">{acc.name}</p>
                          <h4 className="text-4xl font-black text-white mono tracking-tighter italic">{acc.balance}</h4>
                       </div>
                       <div className="text-right space-y-2">
                          <p className="text-[8px] font-black text-emerald-500 mono">{acc.trend}</p>
                          <p className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${acc.status === 'ACTIVE' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'}`}>
                            {acc.status}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-16 pt-10 border-t border-zinc-900 flex justify-between items-center">
                  <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                     <RefreshCw size={14} className="animate-spin [animation-duration:5s]" />
                     <span>Last Polled: 2m ago</span>
                  </div>
                  <button className="text-blue-500 hover:text-white transition-colors flex items-center gap-2 group/btn">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Full Registry</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistryVault;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/landing/RegistryVault.tsx
================================================================================

import React from 'react';
import { Building2, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, Layers } from 'lucide-react';

const RegistryVault: React.FC = () => {
  return (
    <section className="py-40 border-b border-zinc-900 bg-black relative">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Vault_Integration</span>
              </div>
              <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
                Bank <br /> <span className="text-blue-600 not-italic">Registry_Node</span>
              </h2>
            </div>
            <p className="text-zinc-400 text-2xl leading-relaxed font-bold italic">
              "Direct M2M handshakes with <span className="text-white">institutional vaults</span>. We utilize the FDX-standard to provision virtual nodes that route liquidity directly from your treasury into the <span className="text-blue-500">Quantum foundry</span>."
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { t: 'FDX Native', s: 'Active' },
                 { t: 'Vault Sync', s: 'Priority' },
                 { t: 'Audit Log', s: 'Signed' },
                 { t: 'Routing', s: 'Layer 2' }
               ].map((line, i) => (
                 <div key={i} className="flex items-center gap-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl group hover:border-blue-500/50 transition-all shadow-xl">
                    <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform"><CheckCircle2 size={18} /></div>
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{line.t}</p>
                       <p className="text-[11px] font-black text-white uppercase tracking-widest">{line.s}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group relative z-10">
               <div className="flex items-center justify-between mb-16">
                  <div className="flex items-center gap-4">
                     <Building2 size={28} className="text-blue-500" />
                     <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Registry Metadata Node</span>
                  </div>
                  <div className="flex gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
                  </div>
               </div>
               <div className="space-y-10">
                  {[
                    { name: 'Citi Master Node', balance: '$1,245,000.50', status: 'ACTIVE', trend: '+1.2%' },
                    { name: 'Chase Liquidity Node', balance: '$840,200.00', status: 'SYNCING', trend: 'STABLE' },
                    { name: 'DB Treasury Hub', balance: '$2,105,000.12', status: 'ACTIVE', trend: '+0.4%' },
                  ].map((acc, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-zinc-900 pb-10 last:border-0 last:pb-0 hover:border-zinc-700 transition-colors group/item cursor-default">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 group-hover/item:text-blue-500 transition-colors">{acc.name}</p>
                          <h4 className="text-4xl font-black text-white mono tracking-tighter italic">{acc.balance}</h4>
                       </div>
                       <div className="text-right space-y-2">
                          <p className="text-[8px] font-black text-emerald-500 mono">{acc.trend}</p>
                          <p className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${acc.status === 'ACTIVE' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'}`}>
                            {acc.status}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-16 pt-10 border-t border-zinc-900 flex justify-between items-center">
                  <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                     <RefreshCw size={14} className="animate-spin [animation-duration:5s]" />
                     <span>Last Polled: 2m ago</span>
                  </div>
                  <button className="text-blue-500 hover:text-white transition-colors flex items-center gap-2 group/btn">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Full Registry</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistryVault;