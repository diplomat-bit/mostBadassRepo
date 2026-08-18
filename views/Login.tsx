// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Login.tsx
================================================================================


import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Key, 
  Terminal, 
  Lock, 
  Loader2, 
  CheckCircle2, 
  Zap,
  ShieldAlert,
  ArrowRight,
  Fingerprint,
  Activity,
  Crown,
  Star,
  Info,
  ExternalLink,
  Link2
} from 'lucide-react';
import { apiClient } from '../services/api.ts';
import { useAppTier } from '../App';

const Login: React.FC = () => {
  const { tier, setTier } = useAppTier();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'IDLE' | 'SYNCING' | 'VERIFIED'>('IDLE');
  const [isKeyLinked, setIsKeyLinked] = useState(false);
  const [logs, setLogs] = useState<string[]>(["LQI Auth Engine v1.4.0 online. Awaiting parity handshake..."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Listen for OAuth success message
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        addLog("AUTH: Handshake successful. Identity verified.");
        setStage('VERIFIED');
        setTimeout(() => {
          window.dispatchEvent(new Event('auth-update'));
        }, 1000);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString([], { hour12: false })} - ${msg}`]);

  const handleHandshake = async () => {
    if (loading) return;
    
    setLoading(true);
    addLog("AUTH: Initializing mTLS Handshake via OIDC...");

    try {
      const response = await fetch('/api/auth/url');
      if (!response.ok) throw new Error('Failed to fetch auth URL');
      const { url } = await response.json();

      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        addLog("CRITICAL: Popup blocked. Please allow popups.");
        setLoading(false);
      } else {
        addLog("AUTH: Awaiting user authorization in secure popup...");
        setStage('SYNCING');
      }
    } catch (err: any) {
      addLog(`CRITICAL: Handshake failed: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_transparent_60%)]"></div>
        <div className="matrix-line"></div>
      </div>

      <div className="w-full max-w-5xl bg-zinc-950 border border-white/5 rounded-[5rem] shadow-2xl relative z-10 overflow-hidden backdrop-blur-3xl flex flex-col md:flex-row min-h-[680px]">
        {/* Left: Metadata & Logs */}
        <div className="md:w-1/2 p-16 bg-white/[0.02] border-r border-white/5 flex flex-col justify-between">
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-zinc-900">
                <Cpu size={32} className="text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                  Lumina <span className="text-blue-500 not-italic">Quantum</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.5em] font-black text-zinc-600 mt-2">Identity Node v1.4</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-6xl font-black text-white leading-[0.8] tracking-tighter uppercase italic">
                Neural <br /> 
                <span className="text-blue-500 not-italic">Handshake</span>
              </h2>
              <p className="text-zinc-500 text-lg font-bold leading-relaxed italic max-w-xs">
                "Link your Gemini API key to establish a secure machine-to-machine connection with the registry."
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Terminal size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.4em]">Fabric Trace</span>
            </div>
            <div className="h-40 bg-black/60 rounded-[2.5rem] p-8 overflow-y-auto font-mono text-[10px] border border-white/5 custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className={`mb-1 ${
                  log.includes('GRANTED') || log.includes('SUCCESS') ? 'text-emerald-400 font-black' : 
                  log.includes('INIT') || log.includes('AUTH') ? 'text-blue-400' : 
                  'text-zinc-700'
                }`}>
                  {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Right: Interaction Node */}
        <div className="md:w-1/2 p-16 flex flex-col justify-center items-center bg-black/40 text-center">
          {stage === 'VERIFIED' ? (
            <div className="space-y-8 animate-in zoom-in-95 duration-700">
              <div className="w-32 h-32 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(16,185,129,0.1)]">
                <CheckCircle2 size={64} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Authenticated</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Initializing Subspace Node...</p>
              </div>
            </div>
          ) : stage === 'SYNCING' ? (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="relative">
                  <div className="w-48 h-48 rounded-full border-8 border-white/5 border-t-blue-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Fingerprint size={64} className="text-blue-500 animate-pulse" />
                  </div>
               </div>
               <div className="space-y-2">
                  <p className="text-white font-black text-xs uppercase tracking-[0.4em]">Synchronizing Registry...</p>
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest italic">Parity Confidence: 99.9%</p>
               </div>
            </div>
          ) : (
            <div className="w-full space-y-12 animate-in fade-in duration-700">
              <div className="space-y-6">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Selected Access Tier</p>
                 <div className="flex bg-black border border-white/5 p-2 rounded-[2rem] max-w-sm mx-auto">
                    <button 
                      onClick={() => setTier('STANDARD')}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-widest ${tier === 'STANDARD' ? 'bg-white text-black shadow-xl' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      <Star size={14} /> Standard
                    </button>
                    <button 
                      onClick={() => setTier('ENTERPRISE')}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-widest ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      <Crown size={14} /> Apex
                    </button>
                 </div>

                 <div className="flex items-center justify-center gap-4 py-2">
                    <div className={`px-4 py-1.5 rounded-full border flex items-center gap-3 transition-all ${isKeyLinked ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${isKeyLinked ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                       <span className="text-[9px] font-black uppercase tracking-widest">
                          {isKeyLinked ? 'Key Linked' : 'Awaiting Authorization'}
                       </span>
                    </div>
                    {tier === 'ENTERPRISE' && (
                       <a 
                          href="https://ai.google.dev/gemini-api/docs/billing" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-zinc-600 hover:text-blue-500 transition-colors flex items-center gap-1 font-bold uppercase"
                       >
                          <Info size={10} /> Billing <ExternalLink size={8} />
                       </a>
                    )}
                 </div>
              </div>

              <button 
                onClick={handleHandshake}
                className="group relative w-full aspect-square max-w-[220px] bg-white/5 hover:bg-blue-600/10 border border-white/10 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl active:scale-95 mx-auto"
              >
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 group-hover:scale-110 group-hover:opacity-0 transition-all duration-1000"></div>
                <div className="absolute inset-8 rounded-full border border-blue-500/40 group-hover:animate-ping opacity-20"></div>
                
                <Fingerprint size={64} className={`${isKeyLinked ? 'text-blue-500' : 'text-zinc-800'} group-hover:text-blue-500 transition-colors duration-700 mb-6`} />
                <span className="text-[10px] font-black text-zinc-600 group-hover:text-white uppercase tracking-[0.4em] transition-colors">
                  {isKeyLinked ? 'Authorize Node' : 'Link Gemini Key'}
                </span>
              </button>

              <div>
                 <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.8em]">Fdx Node Authority Verified</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Login.tsx
================================================================================


import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Key, 
  Terminal, 
  Lock, 
  Loader2, 
  CheckCircle2, 
  Zap,
  ShieldAlert,
  ArrowRight,
  Fingerprint,
  Activity,
  Crown,
  Star,
  Info,
  ExternalLink,
  Link2
} from 'lucide-react';
import { apiClient } from '../services/api.ts';
import { useAppTier } from '../App';

const Login: React.FC = () => {
  const { tier, setTier } = useAppTier();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'IDLE' | 'SYNCING' | 'VERIFIED'>('IDLE');
  const [isKeyLinked, setIsKeyLinked] = useState(false);
  const [logs, setLogs] = useState<string[]>(["LQI Auth Engine v1.4.0 online. Awaiting parity handshake..."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Check if key is already linked on mount
    const checkKey = async () => {
      const hasKey = await window.aistudio?.hasSelectedApiKey?.() || false;
      setIsKeyLinked(hasKey);
    };
    checkKey();
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString([], { hour12: false })} - ${msg}`]);

  const handleHandshake = async () => {
    if (loading) return;
    
    // EXPLICIT SPOT FOR THE KEY:
    // This triggers the native Gemini API Key picker dialog.
    const hasKey = await window.aistudio?.hasSelectedApiKey?.() || false;
    if (!hasKey) {
      addLog("AUTH: Initializing Gemini API Key Picker...");
      try {
        await window.aistudio?.openSelectKey?.();
        setIsKeyLinked(true);
        addLog("AUTH: Key successfully linked to execution context.");
      } catch (err) {
        addLog("CRITICAL: Key selection aborted by user.");
        return;
      }
    }

    setLoading(true);
    setStage('SYNCING');
    addLog(`INIT: Establishing ${tier} tier handshake...`);
    
    const steps = [
      "Requesting RSA-OAEP-4096 identity fragment...",
      "Matching biometric hash against global registry...",
      "Entropy seed rotation: SUCCESS",
      "Node authorization confirmed."
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 500));
      addLog(step);
    }

    try {
      const { success, user } = await apiClient.auth.login('alex', 'password123');
      if (success && user) {
        addLog("DB_QUERY: Identity parity confirmed. Access GRANTED.");
        setStage('VERIFIED');
        setTimeout(() => {
          window.dispatchEvent(new Event('auth-update'));
        }, 1000);
      }
    } catch (err: any) {
      addLog(`CRITICAL: Handshake denied. Node timeout.`);
      setStage('IDLE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_transparent_60%)]"></div>
        <div className="matrix-line"></div>
      </div>

      <div className="w-full max-w-5xl bg-zinc-950 border border-white/5 rounded-[5rem] shadow-2xl relative z-10 overflow-hidden backdrop-blur-3xl flex flex-col md:flex-row min-h-[680px]">
        {/* Left: Metadata & Logs */}
        <div className="md:w-1/2 p-16 bg-white/[0.02] border-r border-white/5 flex flex-col justify-between">
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-zinc-900">
                <Cpu size={32} className="text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                  Lumina <span className="text-blue-500 not-italic">Quantum</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.5em] font-black text-zinc-600 mt-2">Identity Node v1.4</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-6xl font-black text-white leading-[0.8] tracking-tighter uppercase italic">
                Neural <br /> 
                <span className="text-blue-500 not-italic">Handshake</span>
              </h2>
              <p className="text-zinc-500 text-lg font-bold leading-relaxed italic max-w-xs">
                "Link your Gemini API key to establish a secure machine-to-machine connection with the registry."
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Terminal size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.4em]">Fabric Trace</span>
            </div>
            <div className="h-40 bg-black/60 rounded-[2.5rem] p-8 overflow-y-auto font-mono text-[10px] border border-white/5 custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className={`mb-1 ${
                  log.includes('GRANTED') || log.includes('SUCCESS') ? 'text-emerald-400 font-black' : 
                  log.includes('INIT') || log.includes('AUTH') ? 'text-blue-400' : 
                  'text-zinc-700'
                }`}>
                  {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Right: Interaction Node */}
        <div className="md:w-1/2 p-16 flex flex-col justify-center items-center bg-black/40 text-center">
          {stage === 'VERIFIED' ? (
            <div className="space-y-8 animate-in zoom-in-95 duration-700">
              <div className="w-32 h-32 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(16,185,129,0.1)]">
                <CheckCircle2 size={64} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Authenticated</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Initializing Subspace Node...</p>
              </div>
            </div>
          ) : stage === 'SYNCING' ? (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="relative">
                  <div className="w-48 h-48 rounded-full border-8 border-white/5 border-t-blue-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Fingerprint size={64} className="text-blue-500 animate-pulse" />
                  </div>
               </div>
               <div className="space-y-2">
                  <p className="text-white font-black text-xs uppercase tracking-[0.4em]">Synchronizing Registry...</p>
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest italic">Parity Confidence: 99.9%</p>
               </div>
            </div>
          ) : (
            <div className="w-full space-y-12 animate-in fade-in duration-700">
              <div className="space-y-6">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Selected Access Tier</p>
                 <div className="flex bg-black border border-white/5 p-2 rounded-[2rem] max-w-sm mx-auto">
                    <button 
                      onClick={() => setTier('STANDARD')}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-widest ${tier === 'STANDARD' ? 'bg-white text-black shadow-xl' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      <Star size={14} /> Standard
                    </button>
                    <button 
                      onClick={() => setTier('ENTERPRISE')}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-widest ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      <Crown size={14} /> Apex
                    </button>
                 </div>

                 <div className="flex items-center justify-center gap-4 py-2">
                    <div className={`px-4 py-1.5 rounded-full border flex items-center gap-3 transition-all ${isKeyLinked ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${isKeyLinked ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                       <span className="text-[9px] font-black uppercase tracking-widest">
                          {isKeyLinked ? 'Key Linked' : 'Awaiting Authorization'}
                       </span>
                    </div>
                    {tier === 'ENTERPRISE' && (
                       <a 
                          href="https://ai.google.dev/gemini-api/docs/billing" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-zinc-600 hover:text-blue-500 transition-colors flex items-center gap-1 font-bold uppercase"
                       >
                          <Info size={10} /> Billing <ExternalLink size={8} />
                       </a>
                    )}
                 </div>
              </div>

              <button 
                onClick={handleHandshake}
                className="group relative w-full aspect-square max-w-[220px] bg-white/5 hover:bg-blue-600/10 border border-white/10 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl active:scale-95 mx-auto"
              >
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 group-hover:scale-110 group-hover:opacity-0 transition-all duration-1000"></div>
                <div className="absolute inset-8 rounded-full border border-blue-500/40 group-hover:animate-ping opacity-20"></div>
                
                <Fingerprint size={64} className={`${isKeyLinked ? 'text-blue-500' : 'text-zinc-800'} group-hover:text-blue-500 transition-colors duration-700 mb-6`} />
                <span className="text-[10px] font-black text-zinc-600 group-hover:text-white uppercase tracking-[0.4em] transition-colors">
                  {isKeyLinked ? 'Authorize Node' : 'Link Gemini Key'}
                </span>
              </button>

              <div>
                 <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.8em]">Fdx Node Authority Verified</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Login.tsx
================================================================================


import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Key, 
  Terminal, 
  Lock, 
  Loader2, 
  CheckCircle2, 
  Zap,
  ShieldAlert,
  ArrowRight,
  Fingerprint,
  Activity,
  Crown,
  Star,
  Info,
  ExternalLink,
  Link2
} from 'lucide-react';
import { apiClient } from '../services/api.ts';
import { useAppTier } from '../App';

const Login: React.FC = () => {
  const { tier, setTier } = useAppTier();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'IDLE' | 'SYNCING' | 'VERIFIED'>('IDLE');
  const [isKeyLinked, setIsKeyLinked] = useState(false);
  const [logs, setLogs] = useState<string[]>(["LQI Auth Engine v1.4.0 online. Awaiting parity handshake..."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Check if key is already linked on mount
    const checkKey = async () => {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsKeyLinked(hasKey);
    };
    checkKey();
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString([], { hour12: false })} - ${msg}`]);

  const handleHandshake = async () => {
    if (loading) return;
    
    // EXPLICIT SPOT FOR THE KEY:
    // This triggers the native Gemini API Key picker dialog.
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      addLog("AUTH: Initializing Gemini API Key Picker...");
      try {
        await window.aistudio.openSelectKey();
        setIsKeyLinked(true);
        addLog("AUTH: Key successfully linked to execution context.");
      } catch (err) {
        addLog("CRITICAL: Key selection aborted by user.");
        return;
      }
    }

    setLoading(true);
    setStage('SYNCING');
    addLog(`INIT: Establishing ${tier} tier handshake...`);
    
    const steps = [
      "Requesting RSA-OAEP-4096 identity fragment...",
      "Matching biometric hash against global registry...",
      "Entropy seed rotation: SUCCESS",
      "Node authorization confirmed."
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 500));
      addLog(step);
    }

    try {
      const { success, user } = await apiClient.auth.login('alex', 'password123');
      if (success && user) {
        addLog("DB_QUERY: Identity parity confirmed. Access GRANTED.");
        setStage('VERIFIED');
        setTimeout(() => {
          window.dispatchEvent(new Event('auth-update'));
        }, 1000);
      }
    } catch (err: any) {
      addLog(`CRITICAL: Handshake denied. Node timeout.`);
      setStage('IDLE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_transparent_60%)]"></div>
        <div className="matrix-line"></div>
      </div>

      <div className="w-full max-w-5xl bg-zinc-950 border border-white/5 rounded-[5rem] shadow-2xl relative z-10 overflow-hidden backdrop-blur-3xl flex flex-col md:flex-row min-h-[680px]">
        {/* Left: Metadata & Logs */}
        <div className="md:w-1/2 p-16 bg-white/[0.02] border-r border-white/5 flex flex-col justify-between">
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-zinc-900">
                <Cpu size={32} className="text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                  Lumina <span className="text-blue-500 not-italic">Quantum</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.5em] font-black text-zinc-600 mt-2">Identity Node v1.4</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-6xl font-black text-white leading-[0.8] tracking-tighter uppercase italic">
                Neural <br /> 
                <span className="text-blue-500 not-italic">Handshake</span>
              </h2>
              <p className="text-zinc-500 text-lg font-bold leading-relaxed italic max-w-xs">
                "Link your Gemini API key to establish a secure machine-to-machine connection with the registry."
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Terminal size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.4em]">Fabric Trace</span>
            </div>
            <div className="h-40 bg-black/60 rounded-[2.5rem] p-8 overflow-y-auto font-mono text-[10px] border border-white/5 custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className={`mb-1 ${
                  log.includes('GRANTED') || log.includes('SUCCESS') ? 'text-emerald-400 font-black' : 
                  log.includes('INIT') || log.includes('AUTH') ? 'text-blue-400' : 
                  'text-zinc-700'
                }`}>
                  {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Right: Interaction Node */}
        <div className="md:w-1/2 p-16 flex flex-col justify-center items-center bg-black/40 text-center">
          {stage === 'VERIFIED' ? (
            <div className="space-y-8 animate-in zoom-in-95 duration-700">
              <div className="w-32 h-32 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(16,185,129,0.1)]">
                <CheckCircle2 size={64} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Authenticated</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Initializing Subspace Node...</p>
              </div>
            </div>
          ) : stage === 'SYNCING' ? (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="relative">
                  <div className="w-48 h-48 rounded-full border-8 border-white/5 border-t-blue-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Fingerprint size={64} className="text-blue-500 animate-pulse" />
                  </div>
               </div>
               <div className="space-y-2">
                  <p className="text-white font-black text-xs uppercase tracking-[0.4em]">Synchronizing Registry...</p>
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest italic">Parity Confidence: 99.9%</p>
               </div>
            </div>
          ) : (
            <div className="w-full space-y-12 animate-in fade-in duration-700">
              <div className="space-y-6">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Selected Access Tier</p>
                 <div className="flex bg-black border border-white/5 p-2 rounded-[2rem] max-w-sm mx-auto">
                    <button 
                      onClick={() => setTier('STANDARD')}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-widest ${tier === 'STANDARD' ? 'bg-white text-black shadow-xl' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      <Star size={14} /> Standard
                    </button>
                    <button 
                      onClick={() => setTier('ENTERPRISE')}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-widest ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      <Crown size={14} /> Apex
                    </button>
                 </div>

                 <div className="flex items-center justify-center gap-4 py-2">
                    <div className={`px-4 py-1.5 rounded-full border flex items-center gap-3 transition-all ${isKeyLinked ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${isKeyLinked ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                       <span className="text-[9px] font-black uppercase tracking-widest">
                          {isKeyLinked ? 'Key Linked' : 'Awaiting Authorization'}
                       </span>
                    </div>
                    {tier === 'ENTERPRISE' && (
                       <a 
                          href="https://ai.google.dev/gemini-api/docs/billing" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-zinc-600 hover:text-blue-500 transition-colors flex items-center gap-1 font-bold uppercase"
                       >
                          <Info size={10} /> Billing <ExternalLink size={8} />
                       </a>
                    )}
                 </div>
              </div>

              <button 
                onClick={handleHandshake}
                className="group relative w-full aspect-square max-w-[220px] bg-white/5 hover:bg-blue-600/10 border border-white/10 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl active:scale-95 mx-auto"
              >
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 group-hover:scale-110 group-hover:opacity-0 transition-all duration-1000"></div>
                <div className="absolute inset-8 rounded-full border border-blue-500/40 group-hover:animate-ping opacity-20"></div>
                
                <Fingerprint size={64} className={`${isKeyLinked ? 'text-blue-500' : 'text-zinc-800'} group-hover:text-blue-500 transition-colors duration-700 mb-6`} />
                <span className="text-[10px] font-black text-zinc-600 group-hover:text-white uppercase tracking-[0.4em] transition-colors">
                  {isKeyLinked ? 'Authorize Node' : 'Link Gemini Key'}
                </span>
              </button>

              <div>
                 <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.8em]">Fdx Node Authority Verified</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
