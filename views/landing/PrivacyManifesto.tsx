// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/landing/PrivacyManifesto.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Lock, EyeOff, Scissors, Trash2 } from 'lucide-react';

const PrivacyManifesto: React.FC = () => {
  const [shredding, setShredding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShredding(true);
      setTimeout(() => setShredding(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-60 border-b border-zinc-900 bg-[#020202] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_transparent_70%)] opacity-20"></div>
      
      <div className="max-w-5xl mx-auto px-10 text-center space-y-16 relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full mx-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500">Security_Ethos</span>
          </div>
          <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
            Privacy <br /> <span className="text-rose-600 not-italic">Manifesto</span>
          </h2>
        </div>

        <p className="text-white text-5xl font-black italic tracking-tighter leading-tight uppercase max-w-4xl mx-auto">
          "Data <span className="text-rose-500 underline decoration-8 decoration-rose-900/50 underline-offset-[12px]">sovereignty</span> is the foundation of the Lumina protocol. We believe in <span className="text-rose-500">zero-persistence</span> logging and node-level <span className="text-rose-500">shredding</span> of all packets once ledger parity is achieved."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-20">
          {[
            { label: 'Zero Trace', val: 'VERIFIED', icon: EyeOff },
            { label: 'P2P Sync', val: 'PRIVATE', icon: Fingerprint },
            { label: 'Secret Cache', val: 'FLUSHED', icon: Trash2 },
            { label: 'Sovereign', val: 'ABSOLUTE', icon: Lock },
          ].map((item, i) => (
            <div key={i} className="p-10 bg-zinc-950 border border-zinc-900 rounded-[3rem] group hover:border-rose-500/40 transition-all shadow-2xl relative overflow-hidden">
              <div className={`p-4 rounded-2xl bg-zinc-900 text-zinc-700 group-hover:text-rose-500 transition-all mb-8 ${shredding && i === 2 ? 'animate-bounce text-rose-500' : ''}`}>
                 <item.icon size={32} />
              </div>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">{item.label}</p>
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">{item.val}</h3>
            </div>
          ))}
        </div>

        <div className="pt-40 max-w-2xl mx-auto space-y-10">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
           <p className="text-zinc-500 text-lg font-medium italic leading-relaxed">
             "Lumina does not store your history. We facilitate consensus and evaporate. Metadata persistence is an institutional liability that we mathematically eliminate."
           </p>
           <div className="flex justify-center gap-16 grayscale opacity-10 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
              <Shield size={48} />
              <Scissors size={48} />
              <EyeOff size={48} />
           </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyManifesto;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/landing/PrivacyManifesto.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Lock, EyeOff, Scissors, Trash2 } from 'lucide-react';

const PrivacyManifesto: React.FC = () => {
  const [shredding, setShredding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShredding(true);
      setTimeout(() => setShredding(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-60 border-b border-zinc-900 bg-[#020202] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_transparent_70%)] opacity-20"></div>
      
      <div className="max-w-5xl mx-auto px-10 text-center space-y-16 relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full mx-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500">Security_Ethos</span>
          </div>
          <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
            Privacy <br /> <span className="text-rose-600 not-italic">Manifesto</span>
          </h2>
        </div>

        <p className="text-white text-5xl font-black italic tracking-tighter leading-tight uppercase max-w-4xl mx-auto">
          "Data <span className="text-rose-500 underline decoration-8 decoration-rose-900/50 underline-offset-[12px]">sovereignty</span> is the foundation of the Lumina protocol. We believe in <span className="text-rose-500">zero-persistence</span> logging and node-level <span className="text-rose-500">shredding</span> of all packets once ledger parity is achieved."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-20">
          {[
            { label: 'Zero Trace', val: 'VERIFIED', icon: EyeOff },
            { label: 'P2P Sync', val: 'PRIVATE', icon: Fingerprint },
            { label: 'Secret Cache', val: 'FLUSHED', icon: Trash2 },
            { label: 'Sovereign', val: 'ABSOLUTE', icon: Lock },
          ].map((item, i) => (
            <div key={i} className="p-10 bg-zinc-950 border border-zinc-900 rounded-[3rem] group hover:border-rose-500/40 transition-all shadow-2xl relative overflow-hidden">
              <div className={`p-4 rounded-2xl bg-zinc-900 text-zinc-700 group-hover:text-rose-500 transition-all mb-8 ${shredding && i === 2 ? 'animate-bounce text-rose-500' : ''}`}>
                 <item.icon size={32} />
              </div>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">{item.label}</p>
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">{item.val}</h3>
            </div>
          ))}
        </div>

        <div className="pt-40 max-w-2xl mx-auto space-y-10">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
           <p className="text-zinc-500 text-lg font-medium italic leading-relaxed">
             "Lumina does not store your history. We facilitate consensus and evaporate. Metadata persistence is an institutional liability that we mathematically eliminate."
           </p>
           <div className="flex justify-center gap-16 grayscale opacity-10 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
              <Shield size={48} />
              <Scissors size={48} />
              <EyeOff size={48} />
           </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyManifesto;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/landing/PrivacyManifesto.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Lock, EyeOff, Scissors, Trash2 } from 'lucide-react';

const PrivacyManifesto: React.FC = () => {
  const [shredding, setShredding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShredding(true);
      setTimeout(() => setShredding(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-60 border-b border-zinc-900 bg-[#020202] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_transparent_70%)] opacity-20"></div>
      
      <div className="max-w-5xl mx-auto px-10 text-center space-y-16 relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full mx-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500">Security_Ethos</span>
          </div>
          <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
            Privacy <br /> <span className="text-rose-600 not-italic">Manifesto</span>
          </h2>
        </div>

        <p className="text-white text-5xl font-black italic tracking-tighter leading-tight uppercase max-w-4xl mx-auto">
          "Data <span className="text-rose-500 underline decoration-8 decoration-rose-900/50 underline-offset-[12px]">sovereignty</span> is the foundation of the Lumina protocol. We believe in <span className="text-rose-500">zero-persistence</span> logging and node-level <span className="text-rose-500">shredding</span> of all packets once ledger parity is achieved."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-20">
          {[
            { label: 'Zero Trace', val: 'VERIFIED', icon: EyeOff },
            { label: 'P2P Sync', val: 'PRIVATE', icon: Fingerprint },
            { label: 'Secret Cache', val: 'FLUSHED', icon: Trash2 },
            { label: 'Sovereign', val: 'ABSOLUTE', icon: Lock },
          ].map((item, i) => (
            <div key={i} className="p-10 bg-zinc-950 border border-zinc-900 rounded-[3rem] group hover:border-rose-500/40 transition-all shadow-2xl relative overflow-hidden">
              <div className={`p-4 rounded-2xl bg-zinc-900 text-zinc-700 group-hover:text-rose-500 transition-all mb-8 ${shredding && i === 2 ? 'animate-bounce text-rose-500' : ''}`}>
                 <item.icon size={32} />
              </div>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">{item.label}</p>
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">{item.val}</h3>
            </div>
          ))}
        </div>

        <div className="pt-40 max-w-2xl mx-auto space-y-10">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
           <p className="text-zinc-500 text-lg font-medium italic leading-relaxed">
             "Lumina does not store your history. We facilitate consensus and evaporate. Metadata persistence is an institutional liability that we mathematically eliminate."
           </p>
           <div className="flex justify-center gap-16 grayscale opacity-10 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
              <Shield size={48} />
              <Scissors size={48} />
              <EyeOff size={48} />
           </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyManifesto;