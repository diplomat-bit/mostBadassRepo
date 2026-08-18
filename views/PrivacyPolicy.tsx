// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/PrivacyPolicy.tsx
================================================================================

import React from 'react';
import { ShieldAlert, Lock, EyeOff, Scale, Gavel, Globe, FileText, ChevronRight, ArrowLeft, Terminal, ShieldCheck, Activity, Database, Lock as LockIcon, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecurityManifesto: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-600/30 selection:text-white pb-40">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_60%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto py-40 px-10 relative z-10">
        <div className="flex flex-col items-center text-center mb-40">
          <div className="w-24 h-24 bg-rose-600/10 border border-rose-500/20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl group hover:rotate-12 transition-transform duration-700">
            <ShieldAlert size={48} className="text-rose-500 animate-pulse" />
          </div>
          <h1 className="text-[8rem] font-black italic text-white uppercase tracking-tighter leading-none mb-10">
            Security <br /> <span className="text-rose-600 underline decoration-rose-900/50 decoration-8 underline-offset-[20px]">Manifesto</span>
          </h1>
          <p className="text-[14px] font-black text-zinc-600 uppercase tracking-[1em]">Zero-Persistence Protocol v1.2 • FDX Compliant</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left: Terminal Log */}
          <div className="lg:col-span-4 space-y-10 sticky top-40">
             <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-4">
                      <Terminal size={18} className="text-rose-500" />
                      <span className="text-[11px] font-black uppercase text-zinc-500 tracking-[0.3em]">Compliance Trace</span>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                   </div>
                </div>
                <div className="space-y-4 font-mono text-[10px] text-zinc-700">
                   <p>[09:12:01] Initializing Shredder_Core...</p>
                   <p>[09:12:02] RSA-OAEP Key Rotation: OK</p>
                   <p>[09:12:05] Memory Flush executed: 0x8821...FF01</p>
                   <p className="text-rose-500/60 font-bold">[CRITICAL] Zero-Persistence SEALED.</p>
                   <p>[09:12:10] Syncing Identity nodes...</p>
                   <p>[09:12:15] Packet shredding active.</p>
                </div>
             </div>
             <div className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[3rem] backdrop-blur-xl">
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 italic">Protocol Status</h4>
                <div className="space-y-4">
                   {[
                     { l: 'Data Encryption', v: 'AES-256-GCM', c: 'text-rose-500' },
                     { l: 'Auth Method', v: 'RSA-4096', c: 'text-white' },
                     { l: 'Persistence', v: '0.0%', c: 'text-rose-500' },
                     { l: 'Audit State', v: 'VERIFIED', c: 'text-emerald-500' },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-4 last:border-0">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item.l}</span>
                        <span className={`text-[10px] font-black mono ${item.c}`}>{item.v}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right: Narrative Content */}
          <div className="lg:col-span-8 space-y-32">
             <section className="space-y-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700">
                      <LockIcon size={32} />
                   </div>
                   <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Zero Persistence</h2>
                </div>
                <p className="text-zinc-400 text-3xl leading-relaxed font-bold italic">
                   "Lumina is designed as a <span className="text-white">liminal processor</span>. We do not store your institutional metadata. Every packet that enters the mesh is shredded immediately after ledger parity is achieved. Persistence is a vulnerability we mathematically eliminate."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                   <div className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-rose-500/40 transition-all shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Database size={100} /></div>
                      <h5 className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-6">Ephemeral Vaults</h5>
                      <p className="text-zinc-500 font-medium italic leading-relaxed text-sm">Session-level vaults are initialized for transient handshakes and purged with 7-pass random overwrite logic on termination.</p>
                   </div>
                   <div className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-rose-500/40 transition-all shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={100} /></div>
                      <h5 className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-6">Packet Shredding</h5>
                      <p className="text-zinc-500 font-medium italic leading-relaxed text-sm">Encrypted payloads are shredded post-verification to ensure zero historical trace within the global registry nodes.</p>
                   </div>
                </div>
             </section>

             <section className="space-y-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-rose-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-900/40">
                      <ShieldCheck size={32} />
                   </div>
                   <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Institutional Terms</h2>
                </div>
                <p className="text-zinc-500 text-xl font-bold italic leading-relaxed">
                   By interacting with this registry, you acknowledge that you are entering an <span className="text-white">educational simulation</span> built for mathematical proof of AI expertise. This platform facilitates transient node interactions via FDX v6 protocols. Citibank Demo Business Inc is a 527 political organization and does not provide regulated banking services.
                </p>
                <ul className="space-y-4">
                   {[
                     "Identity remains encapsulated within the mesh",
                     "Logical consensus is hard-coded into the fabric",
                     "Metadata is mathematically destroyed post-parity",
                     "Handshakes are secured via RSA-OAEP-4096"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-6 p-8 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] group hover:border-rose-500/20 transition-all cursor-default">
                        <div className="w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_12px_#f43f5e]" />
                        <span className="text-[12px] font-black text-white uppercase tracking-[0.4em] italic">{item}</span>
                     </li>
                   ))}
                </ul>
             </section>

             <footer className="pt-40 border-t border-zinc-900 flex flex-col items-center gap-12">
                <div className="flex gap-20 grayscale opacity-20">
                   {/* Fix: Use Fingerprint which is now imported */}
                   <Globe size={48} /><Database size={48} /><Fingerprint size={48} />
                </div>
                <p className="text-[12px] font-black text-zinc-800 uppercase tracking-[1em]">Verified 2025 • Citibank Demo Business Inc • aibanking.dev</p>
                <button onClick={() => navigate(-1)} className="px-16 py-8 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.6em] hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-6">
                   <ArrowLeft size={24} /> Acknowledge Protocol
                </button>
             </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityManifesto;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/PrivacyPolicy.tsx
================================================================================

import React from 'react';
import { ShieldAlert, Lock, EyeOff, Scale, Gavel, Globe, FileText, ChevronRight, ArrowLeft, Terminal, ShieldCheck, Activity, Database, Lock as LockIcon, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecurityManifesto: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-600/30 selection:text-white pb-40">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_60%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto py-40 px-10 relative z-10">
        <div className="flex flex-col items-center text-center mb-40">
          <div className="w-24 h-24 bg-rose-600/10 border border-rose-500/20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl group hover:rotate-12 transition-transform duration-700">
            <ShieldAlert size={48} className="text-rose-500 animate-pulse" />
          </div>
          <h1 className="text-[8rem] font-black italic text-white uppercase tracking-tighter leading-none mb-10">
            Security <br /> <span className="text-rose-600 underline decoration-rose-900/50 decoration-8 underline-offset-[20px]">Manifesto</span>
          </h1>
          <p className="text-[14px] font-black text-zinc-600 uppercase tracking-[1em]">Zero-Persistence Protocol v1.2 • FDX Compliant</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left: Terminal Log */}
          <div className="lg:col-span-4 space-y-10 sticky top-40">
             <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-4">
                      <Terminal size={18} className="text-rose-500" />
                      <span className="text-[11px] font-black uppercase text-zinc-500 tracking-[0.3em]">Compliance Trace</span>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                   </div>
                </div>
                <div className="space-y-4 font-mono text-[10px] text-zinc-700">
                   <p>[09:12:01] Initializing Shredder_Core...</p>
                   <p>[09:12:02] RSA-OAEP Key Rotation: OK</p>
                   <p>[09:12:05] Memory Flush executed: 0x8821...FF01</p>
                   <p className="text-rose-500/60 font-bold">[CRITICAL] Zero-Persistence SEALED.</p>
                   <p>[09:12:10] Syncing Identity nodes...</p>
                   <p>[09:12:15] Packet shredding active.</p>
                </div>
             </div>
             <div className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[3rem] backdrop-blur-xl">
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 italic">Protocol Status</h4>
                <div className="space-y-4">
                   {[
                     { l: 'Data Encryption', v: 'AES-256-GCM', c: 'text-rose-500' },
                     { l: 'Auth Method', v: 'RSA-4096', c: 'text-white' },
                     { l: 'Persistence', v: '0.0%', c: 'text-rose-500' },
                     { l: 'Audit State', v: 'VERIFIED', c: 'text-emerald-500' },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-4 last:border-0">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item.l}</span>
                        <span className={`text-[10px] font-black mono ${item.c}`}>{item.v}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right: Narrative Content */}
          <div className="lg:col-span-8 space-y-32">
             <section className="space-y-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700">
                      <LockIcon size={32} />
                   </div>
                   <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Zero Persistence</h2>
                </div>
                <p className="text-zinc-400 text-3xl leading-relaxed font-bold italic">
                   "Lumina is designed as a <span className="text-white">liminal processor</span>. We do not store your institutional metadata. Every packet that enters the mesh is shredded immediately after ledger parity is achieved. Persistence is a vulnerability we mathematically eliminate."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                   <div className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-rose-500/40 transition-all shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Database size={100} /></div>
                      <h5 className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-6">Ephemeral Vaults</h5>
                      <p className="text-zinc-500 font-medium italic leading-relaxed text-sm">Session-level vaults are initialized for transient handshakes and purged with 7-pass random overwrite logic on termination.</p>
                   </div>
                   <div className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-rose-500/40 transition-all shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={100} /></div>
                      <h5 className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-6">Packet Shredding</h5>
                      <p className="text-zinc-500 font-medium italic leading-relaxed text-sm">Encrypted payloads are shredded post-verification to ensure zero historical trace within the global registry nodes.</p>
                   </div>
                </div>
             </section>

             <section className="space-y-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-rose-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-900/40">
                      <ShieldCheck size={32} />
                   </div>
                   <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Institutional Terms</h2>
                </div>
                <p className="text-zinc-500 text-xl font-bold italic leading-relaxed">
                   By interacting with this registry, you acknowledge that you are entering an <span className="text-white">educational simulation</span> built for mathematical proof of AI expertise. This platform facilitates transient node interactions via FDX v6 protocols. Citibank Demo Business Inc is a 527 political organization and does not provide regulated banking services.
                </p>
                <ul className="space-y-4">
                   {[
                     "Identity remains encapsulated within the mesh",
                     "Logical consensus is hard-coded into the fabric",
                     "Metadata is mathematically destroyed post-parity",
                     "Handshakes are secured via RSA-OAEP-4096"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-6 p-8 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] group hover:border-rose-500/20 transition-all cursor-default">
                        <div className="w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_12px_#f43f5e]" />
                        <span className="text-[12px] font-black text-white uppercase tracking-[0.4em] italic">{item}</span>
                     </li>
                   ))}
                </ul>
             </section>

             <footer className="pt-40 border-t border-zinc-900 flex flex-col items-center gap-12">
                <div className="flex gap-20 grayscale opacity-20">
                   {/* Fix: Use Fingerprint which is now imported */}
                   <Globe size={48} /><Database size={48} /><Fingerprint size={48} />
                </div>
                <p className="text-[12px] font-black text-zinc-800 uppercase tracking-[1em]">Verified 2025 • Citibank Demo Business Inc • aibanking.dev</p>
                <button onClick={() => navigate(-1)} className="px-16 py-8 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.6em] hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-6">
                   <ArrowLeft size={24} /> Acknowledge Protocol
                </button>
             </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityManifesto;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/PrivacyPolicy.tsx
================================================================================

import React from 'react';
import { ShieldAlert, Lock, EyeOff, Scale, Gavel, Globe, FileText, ChevronRight, ArrowLeft, Terminal, ShieldCheck, Activity, Database, Lock as LockIcon, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecurityManifesto: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-600/30 selection:text-white pb-40">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_60%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto py-40 px-10 relative z-10">
        <div className="flex flex-col items-center text-center mb-40">
          <div className="w-24 h-24 bg-rose-600/10 border border-rose-500/20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl group hover:rotate-12 transition-transform duration-700">
            <ShieldAlert size={48} className="text-rose-500 animate-pulse" />
          </div>
          <h1 className="text-[8rem] font-black italic text-white uppercase tracking-tighter leading-none mb-10">
            Security <br /> <span className="text-rose-600 underline decoration-rose-900/50 decoration-8 underline-offset-[20px]">Manifesto</span>
          </h1>
          <p className="text-[14px] font-black text-zinc-600 uppercase tracking-[1em]">Zero-Persistence Protocol v1.2 • FDX Compliant</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left: Terminal Log */}
          <div className="lg:col-span-4 space-y-10 sticky top-40">
             <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-4">
                      <Terminal size={18} className="text-rose-500" />
                      <span className="text-[11px] font-black uppercase text-zinc-500 tracking-[0.3em]">Compliance Trace</span>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                   </div>
                </div>
                <div className="space-y-4 font-mono text-[10px] text-zinc-700">
                   <p>[09:12:01] Initializing Shredder_Core...</p>
                   <p>[09:12:02] RSA-OAEP Key Rotation: OK</p>
                   <p>[09:12:05] Memory Flush executed: 0x8821...FF01</p>
                   <p className="text-rose-500/60 font-bold">[CRITICAL] Zero-Persistence SEALED.</p>
                   <p>[09:12:10] Syncing Identity nodes...</p>
                   <p>[09:12:15] Packet shredding active.</p>
                </div>
             </div>
             <div className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[3rem] backdrop-blur-xl">
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 italic">Protocol Status</h4>
                <div className="space-y-4">
                   {[
                     { l: 'Data Encryption', v: 'AES-256-GCM', c: 'text-rose-500' },
                     { l: 'Auth Method', v: 'RSA-4096', c: 'text-white' },
                     { l: 'Persistence', v: '0.0%', c: 'text-rose-500' },
                     { l: 'Audit State', v: 'VERIFIED', c: 'text-emerald-500' },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-4 last:border-0">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item.l}</span>
                        <span className={`text-[10px] font-black mono ${item.c}`}>{item.v}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right: Narrative Content */}
          <div className="lg:col-span-8 space-y-32">
             <section className="space-y-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700">
                      <LockIcon size={32} />
                   </div>
                   <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Zero Persistence</h2>
                </div>
                <p className="text-zinc-400 text-3xl leading-relaxed font-bold italic">
                   "Lumina is designed as a <span className="text-white">liminal processor</span>. We do not store your institutional metadata. Every packet that enters the mesh is shredded immediately after ledger parity is achieved. Persistence is a vulnerability we mathematically eliminate."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                   <div className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-rose-500/40 transition-all shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Database size={100} /></div>
                      <h5 className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-6">Ephemeral Vaults</h5>
                      <p className="text-zinc-500 font-medium italic leading-relaxed text-sm">Session-level vaults are initialized for transient handshakes and purged with 7-pass random overwrite logic on termination.</p>
                   </div>
                   <div className="p-12 bg-zinc-950 border border-zinc-900 rounded-[4rem] group hover:border-rose-500/40 transition-all shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={100} /></div>
                      <h5 className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-6">Packet Shredding</h5>
                      <p className="text-zinc-500 font-medium italic leading-relaxed text-sm">Encrypted payloads are shredded post-verification to ensure zero historical trace within the global registry nodes.</p>
                   </div>
                </div>
             </section>

             <section className="space-y-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-rose-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-900/40">
                      <ShieldCheck size={32} />
                   </div>
                   <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Institutional Terms</h2>
                </div>
                <p className="text-zinc-500 text-xl font-bold italic leading-relaxed">
                   By interacting with this registry, you acknowledge that you are entering an <span className="text-white">educational simulation</span> built for mathematical proof of AI expertise. This platform facilitates transient node interactions via FDX v6 protocols. Citibank Demo Business Inc is a 527 political organization and does not provide regulated banking services.
                </p>
                <ul className="space-y-4">
                   {[
                     "Identity remains encapsulated within the mesh",
                     "Logical consensus is hard-coded into the fabric",
                     "Metadata is mathematically destroyed post-parity",
                     "Handshakes are secured via RSA-OAEP-4096"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-6 p-8 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] group hover:border-rose-500/20 transition-all cursor-default">
                        <div className="w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_12px_#f43f5e]" />
                        <span className="text-[12px] font-black text-white uppercase tracking-[0.4em] italic">{item}</span>
                     </li>
                   ))}
                </ul>
             </section>

             <footer className="pt-40 border-t border-zinc-900 flex flex-col items-center gap-12">
                <div className="flex gap-20 grayscale opacity-20">
                   {/* Fix: Use Fingerprint which is now imported */}
                   <Globe size={48} /><Database size={48} /><Fingerprint size={48} />
                </div>
                <p className="text-[12px] font-black text-zinc-800 uppercase tracking-[1em]">Verified 2025 • Citibank Demo Business Inc • aibanking.dev</p>
                <button onClick={() => navigate(-1)} className="px-16 py-8 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.6em] hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-6">
                   <ArrowLeft size={24} /> Acknowledge Protocol
                </button>
             </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityManifesto;