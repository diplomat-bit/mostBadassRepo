// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/landing/EncryptionProtocol.tsx
================================================================================

import React from 'react';
import { Lock, ShieldCheck, RefreshCw, ShieldAlert, Fingerprint, Key, Layers } from 'lucide-react';

const EncryptionProtocol: React.FC = () => {
  return (
    <section className="py-40 border-b border-zinc-900 bg-black relative">
      <div className="max-w-7xl mx-auto px-10 text-center space-y-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mx-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">RSA_Handshake</span>
          </div>
          <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
            Encryption <br /> <span className="text-blue-500 not-italic">Protocol</span>
          </h2>
        </div>

        <p className="text-zinc-500 text-3xl max-w-5xl mx-auto leading-relaxed font-bold italic mb-32">
          "Utilizing <span className="text-white">RSA-OAEP-4096</span> and high-entropy neural seeds to secure every Machine-to-Machine handshake. Our security grade is <span className="text-blue-500">beyond</span> institutional standards."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { label: 'AES-256', val: 'TUNNELING', icon: ShieldCheck, sub: 'Payload Encapsulation' },
            { label: 'RSA-4096', val: 'HANDSHAKE', icon: Lock, sub: 'Identity Verification' },
            { label: 'Seeds', val: 'ROTATING', icon: RefreshCw, sub: 'Entropy Refresh' },
            { label: 'Breach Prob', val: '0.00%', icon: ShieldAlert, sub: 'Calculated Risk' },
          ].map((e, i) => (
            <div key={i} className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-blue-500/50 transition-all relative overflow-hidden text-left shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <e.icon size={140} />
               </div>
               <div className={`w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mb-12 group-hover:scale-110 transition-transform ${e.label === 'Seeds' ? 'animate-spin [animation-duration:10s]' : ''}`}>
                  <e.icon size={32} />
               </div>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {e.label}
               </p>
               <h5 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none">{e.val}</h5>
               <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{e.sub}</p>
            </div>
          ))}
        </div>

        <div className="pt-40 flex flex-col items-center gap-12">
           <div className="flex gap-16 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <Fingerprint size={64} className="text-zinc-500" />
              <Key size={64} className="text-zinc-500" />
              <Layers size={64} className="text-zinc-500" />
           </div>
           <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[1em]">Absolute Security Architecture v6.2</p>
        </div>
      </div>
    </section>
  );
};

export default EncryptionProtocol;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/landing/EncryptionProtocol.tsx
================================================================================

import React from 'react';
import { Lock, ShieldCheck, RefreshCw, ShieldAlert, Fingerprint, Key, Layers } from 'lucide-react';

const EncryptionProtocol: React.FC = () => {
  return (
    <section className="py-40 border-b border-zinc-900 bg-black relative">
      <div className="max-w-7xl mx-auto px-10 text-center space-y-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mx-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">RSA_Handshake</span>
          </div>
          <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
            Encryption <br /> <span className="text-blue-500 not-italic">Protocol</span>
          </h2>
        </div>

        <p className="text-zinc-500 text-3xl max-w-5xl mx-auto leading-relaxed font-bold italic mb-32">
          "Utilizing <span className="text-white">RSA-OAEP-4096</span> and high-entropy neural seeds to secure every Machine-to-Machine handshake. Our security grade is <span className="text-blue-500">beyond</span> institutional standards."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { label: 'AES-256', val: 'TUNNELING', icon: ShieldCheck, sub: 'Payload Encapsulation' },
            { label: 'RSA-4096', val: 'HANDSHAKE', icon: Lock, sub: 'Identity Verification' },
            { label: 'Seeds', val: 'ROTATING', icon: RefreshCw, sub: 'Entropy Refresh' },
            { label: 'Breach Prob', val: '0.00%', icon: ShieldAlert, sub: 'Calculated Risk' },
          ].map((e, i) => (
            <div key={i} className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-blue-500/50 transition-all relative overflow-hidden text-left shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <e.icon size={140} />
               </div>
               <div className={`w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mb-12 group-hover:scale-110 transition-transform ${e.label === 'Seeds' ? 'animate-spin [animation-duration:10s]' : ''}`}>
                  <e.icon size={32} />
               </div>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {e.label}
               </p>
               <h5 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none">{e.val}</h5>
               <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{e.sub}</p>
            </div>
          ))}
        </div>

        <div className="pt-40 flex flex-col items-center gap-12">
           <div className="flex gap-16 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <Fingerprint size={64} className="text-zinc-500" />
              <Key size={64} className="text-zinc-500" />
              <Layers size={64} className="text-zinc-500" />
           </div>
           <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[1em]">Absolute Security Architecture v6.2</p>
        </div>
      </div>
    </section>
  );
};

export default EncryptionProtocol;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/landing/EncryptionProtocol.tsx
================================================================================

import React from 'react';
import { Lock, ShieldCheck, RefreshCw, ShieldAlert, Fingerprint, Key, Layers } from 'lucide-react';

const EncryptionProtocol: React.FC = () => {
  return (
    <section className="py-40 border-b border-zinc-900 bg-black relative">
      <div className="max-w-7xl mx-auto px-10 text-center space-y-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mx-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">RSA_Handshake</span>
          </div>
          <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
            Encryption <br /> <span className="text-blue-500 not-italic">Protocol</span>
          </h2>
        </div>

        <p className="text-zinc-500 text-3xl max-w-5xl mx-auto leading-relaxed font-bold italic mb-32">
          "Utilizing <span className="text-white">RSA-OAEP-4096</span> and high-entropy neural seeds to secure every Machine-to-Machine handshake. Our security grade is <span className="text-blue-500">beyond</span> institutional standards."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { label: 'AES-256', val: 'TUNNELING', icon: ShieldCheck, sub: 'Payload Encapsulation' },
            { label: 'RSA-4096', val: 'HANDSHAKE', icon: Lock, sub: 'Identity Verification' },
            { label: 'Seeds', val: 'ROTATING', icon: RefreshCw, sub: 'Entropy Refresh' },
            { label: 'Breach Prob', val: '0.00%', icon: ShieldAlert, sub: 'Calculated Risk' },
          ].map((e, i) => (
            <div key={i} className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-blue-500/50 transition-all relative overflow-hidden text-left shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <e.icon size={140} />
               </div>
               <div className={`w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mb-12 group-hover:scale-110 transition-transform ${e.label === 'Seeds' ? 'animate-spin [animation-duration:10s]' : ''}`}>
                  <e.icon size={32} />
               </div>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {e.label}
               </p>
               <h5 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none">{e.val}</h5>
               <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{e.sub}</p>
            </div>
          ))}
        </div>

        <div className="pt-40 flex flex-col items-center gap-12">
           <div className="flex gap-16 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <Fingerprint size={64} className="text-zinc-500" />
              <Key size={64} className="text-zinc-500" />
              <Layers size={64} className="text-zinc-500" />
           </div>
           <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[1em]">Absolute Security Architecture v6.2</p>
        </div>
      </div>
    </section>
  );
};

export default EncryptionProtocol;