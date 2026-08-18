// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/TechnicalDeepDive.tsx
================================================================================


import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Terminal, ShieldCheck, Cpu, Globe, Database, 
  Code, Activity, Lock, Layers, Zap, Network, Radio, Server,
  ChevronRight, ArrowUpRight, Copy, Share2, Loader2, Sparkles, BrainCircuit, BarChart3, Crown,
  ImageIcon, Volume2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { callGemini, generateProtocolVisual, synthesizeSpeech } from '../services/geminiService';
import { TECHNICAL_REGISTRY, ProtocolSpec } from './technical/technicalRegistry';
import { useAppTier } from '../App';

const TechnicalDeepDive: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { tier } = useAppTier();
  const [logs, setLogs] = useState<string[]>([]);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [visualUrl, setVisualUrl] = useState<string | null>(null);
  const [generatingVisual, setGeneratingVisual] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const spec = useMemo((): ProtocolSpec => {
    return TECHNICAL_REGISTRY[slug || ''] || {
      id: `LQI-${slug?.toUpperCase()}-UNKN`,
      title: slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Protocol Node',
      description: 'Generalized technical specification for the Lumina Quantum Mesh. Standard parity rules apply.',
      category: 'GENERAL',
      tier: 'L2',
      uptime: '99.9%',
      latency: '0.1ms',
      parity: '100%',
      load: '12%',
      hardware: 'Distributed Cluster',
      codeSnippet: `// Default Implementation\nLumina.init("${slug}");`
    };
  }, [slug]);

  // Remove restriction for AI visuals - all tiers can see them
  const isRestricted = false; 

  const chartData = useMemo(() => {
    const isHighVolatility = spec.category === 'INTELLIGENCE' || spec.category === 'FINANCE';
    return Array.from({ length: 20 }, (_, i) => ({
      name: `t-${20 - i}`,
      val: 50 + (isHighVolatility ? Math.random() * 40 : Math.random() * 10) + Math.sin(i / 2) * 5
    }));
  }, [spec]);

  useEffect(() => {
    const initProtocol = async () => {
      setLoadingAi(true);
      setGeneratingVisual(true);
      
      const [analysis, visual] = await Promise.all([
        callGemini(
          'gemini-3-flash-preview',
          `Analyze this institutional protocol: "${spec.title}". ID: "${spec.id}". Summarize its importance in one concise, technical sentence.`
        ).catch(() => ({ text: "Parity achieved. Protocol logic verified." })),
        generateProtocolVisual(spec.title, spec.description)
      ]);

      setAiReport(analysis.text || "Audit synchronized.");
      setVisualUrl(visual);
      setLoadingAi(false);
      setGeneratingVisual(false);

      // Automated Neural Narration
      setIsSpeaking(true);
      const narrationText = `Initializing protocol audit for ${spec.title}. ${analysis.text || spec.description}`;
      await synthesizeSpeech(narrationText, 'Kore');
      setIsSpeaking(false);
    };
    
    initProtocol();
    
    const logInt = setInterval(() => {
      const msgs = ['Parity verify...', 'Handshake OK', 'Keys rotated', 'Consensus reached', 'Fabric sync', 'Block sealed'];
      setLogs(prev => [msgs[Math.floor(Math.random() * msgs.length)] + ' : ' + Math.random().toString(16).substring(7), ...prev].slice(0, 10));
    }, 2000);
    
    return () => clearInterval(logInt);
  }, [spec, tier]);

  return (
    <div className="min-h-screen bg-black text-white pb-40 selection:bg-blue-600/30 font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto py-32 px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-24">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Return to Nexus Hub</span>
          </button>
          <div className="flex items-center gap-4">
             {isSpeaking && (
               <div className="flex items-center gap-3 px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full animate-pulse">
                  <Volume2 size={14} className="text-blue-500" />
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Neural Narration Active</span>
               </div>
             )}
             <div className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{tier} Node State</span>
             </div>
          </div>
        </div>

        <div className="space-y-32">
          <div className="relative h-[650px] w-full rounded-[4rem] overflow-hidden border border-zinc-900 shadow-2xl group/hero">
             {generatingVisual ? (
               <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center space-y-8">
                  <Loader2 size={64} className="animate-spin text-blue-500" />
                  <p className="text-[14px] font-black text-zinc-700 uppercase tracking-[1em] animate-pulse italic">Synthesizing Protocol Artifact...</p>
               </div>
             ) : (
               <>
                 <img src={visualUrl || ''} className="w-full h-full object-cover opacity-70 group-hover/hero:scale-105 transition-transform duration-[15s] ease-linear" alt={spec.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                 <div className="absolute bottom-20 left-20 right-20 space-y-10 animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center gap-6">
                       <span className="px-5 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">{spec.id}</span>
                       <div className="px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3">
                          <Sparkles size={14} className="text-blue-500" />
                          <span className="text-[9px] font-black uppercase text-zinc-400">Gemini Neural Visual v2.5</span>
                       </div>
                    </div>
                    <h1 className="text-[10rem] lg:text-[14rem] font-black italic text-white uppercase tracking-tighter leading-[0.7]">
                      {spec.title}
                    </h1>
                 </div>
               </>
             )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-24">
              <div className="space-y-12">
                 <p className="text-zinc-500 text-4xl font-bold leading-relaxed italic max-w-5xl">
                   "{spec.description}"
                 </p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-900 rounded-[4rem] p-16 relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <BrainCircuit size={180} className="text-blue-500" />
                 </div>
                 <div className="flex items-center gap-6 mb-12 relative z-10">
                    <div className="p-5 bg-blue-600/10 text-blue-500 rounded-3xl border border-blue-500/20">
                       <Sparkles size={32} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Neural Audit Log</h3>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Real-time model synthesis active</p>
                    </div>
                 </div>
                 {loadingAi ? (
                   <div className="flex items-center gap-6 text-zinc-600 animate-pulse">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-[12px] font-black uppercase tracking-widest">Synthesizing Protocol Logic...</span>
                   </div>
                 ) : (
                   <p className="text-zinc-300 text-2xl font-medium leading-relaxed italic border-l-4 border-blue-500/30 pl-12 py-4">
                      "{aiReport}"
                   </p>
                 )}
              </div>

              <div className="space-y-10">
                 <h3 className="text-white font-black text-2xl uppercase tracking-widest italic flex items-center gap-4">
                   <Activity size={32} className="text-blue-500" />
                   Sub-space Telemetry
                 </h3>
                 <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 h-96 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_#1e1b4b_0%,_transparent_60%)] opacity-30"></div>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="col-val" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={5} fill="url(#col-val)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="space-y-10">
                 <h3 className="text-white font-black text-2xl uppercase tracking-widest italic flex items-center gap-4">
                   <Code size={32} className="text-blue-500" />
                   Logic Fabric
                 </h3>
                 <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                    <div className="bg-zinc-900/50 px-12 py-6 border-b border-zinc-800 flex justify-between items-center">
                       <div className="flex items-center gap-4">
                         <Terminal size={18} className="text-zinc-600" />
                         <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">protocol_v6_5_0.ts</span>
                       </div>
                       <button className="text-zinc-500 hover:text-white transition-colors"><Copy size={16} /></button>
                    </div>
                    <div className="p-16 font-mono text-base text-emerald-500/80 leading-relaxed overflow-x-auto custom-scrollbar">
                       <pre>{spec.codeSnippet}</pre>
                    </div>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
               <div className="bg-zinc-950 border border-zinc-900 rounded-[3.5rem] p-12 shadow-2xl sticky top-10">
                  <div className="flex items-center gap-6 mb-12 pb-12 border-b border-zinc-900">
                     <div className="p-5 bg-zinc-900 rounded-3xl">
                        <Radio size={32} className="text-blue-500 animate-pulse" />
                     </div>
                     <div>
                        <h4 className="text-white font-black text-lg uppercase tracking-widest italic leading-none">Node Poll</h4>
                        <p className="text-[10px] text-zinc-600 font-black uppercase mt-2 tracking-widest">Hard-state verification</p>
                     </div>
                  </div>

                  <div className="space-y-10">
                     {[
                       { label: 'Latency Delta', val: spec.latency, icon: Activity },
                       { label: 'Network Parity', val: spec.parity, icon: Globe },
                       { label: 'Collective Load', val: spec.load, icon: Server },
                       { label: 'Hardware Spec', val: spec.hardware, icon: Cpu },
                     ].map((stat, i) => (
                       <div key={i} className="flex justify-between items-center group/stat border-b border-zinc-900/50 pb-8 last:border-0 last:pb-0">
                          <div className="flex items-center gap-6">
                             <stat.icon size={20} className="text-zinc-700 group-hover/stat:text-blue-500 transition-colors" />
                             <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</span>
                          </div>
                          <span className="text-sm font-black text-white mono">{stat.val}</span>
                       </div>
                     ))}
                  </div>

                  <div className="mt-16 space-y-6">
                     <button className="w-full py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-4">
                        Execute Protocol Seal <ArrowUpRight size={20} />
                     </button>
                  </div>

                  <div className="mt-12 p-10 bg-black rounded-[3rem] border border-zinc-900 h-80 overflow-hidden relative">
                     <div className="flex items-center gap-4 mb-8">
                        <Terminal size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.3em]">Live Trace Stream</span>
                     </div>
                     <div className="space-y-2 font-mono text-[10px] text-zinc-800">
                        {logs.map((log, i) => (
                          <div key={i} className="flex gap-6">
                             <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                             <span className="text-blue-500/40 uppercase tracking-tighter truncate">{log}</span>
                          </div>
                        ))}
                     </div>
                     <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDeepDive;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/TechnicalDeepDive.tsx
================================================================================


import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Terminal, ShieldCheck, Cpu, Globe, Database, 
  Code, Activity, Lock, Layers, Zap, Network, Radio, Server,
  ChevronRight, ArrowUpRight, Copy, Share2, Loader2, Sparkles, BrainCircuit, BarChart3, Crown,
  ImageIcon, Volume2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { callGemini, generateProtocolVisual, synthesizeSpeech } from '../services/geminiService';
import { TECHNICAL_REGISTRY, ProtocolSpec } from './technical/technicalRegistry';
import { useAppTier } from '../App';

const TechnicalDeepDive: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { tier } = useAppTier();
  const [logs, setLogs] = useState<string[]>([]);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [visualUrl, setVisualUrl] = useState<string | null>(null);
  const [generatingVisual, setGeneratingVisual] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const spec = useMemo((): ProtocolSpec => {
    return TECHNICAL_REGISTRY[slug || ''] || {
      id: `LQI-${slug?.toUpperCase()}-UNKN`,
      title: slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Protocol Node',
      description: 'Generalized technical specification for the Lumina Quantum Mesh. Standard parity rules apply.',
      category: 'GENERAL',
      tier: 'L2',
      uptime: '99.9%',
      latency: '0.1ms',
      parity: '100%',
      load: '12%',
      hardware: 'Distributed Cluster',
      codeSnippet: `// Default Implementation\nLumina.init("${slug}");`
    };
  }, [slug]);

  // Remove restriction for AI visuals - all tiers can see them
  const isRestricted = false; 

  const chartData = useMemo(() => {
    const isHighVolatility = spec.category === 'INTELLIGENCE' || spec.category === 'FINANCE';
    return Array.from({ length: 20 }, (_, i) => ({
      name: `t-${20 - i}`,
      val: 50 + (isHighVolatility ? Math.random() * 40 : Math.random() * 10) + Math.sin(i / 2) * 5
    }));
  }, [spec]);

  useEffect(() => {
    const initProtocol = async () => {
      setLoadingAi(true);
      setGeneratingVisual(true);
      
      const [analysis, visual] = await Promise.all([
        callGemini(
          'gemini-3-flash-preview',
          `Analyze this institutional protocol: "${spec.title}". ID: "${spec.id}". Summarize its importance in one concise, technical sentence.`
        ).catch(() => ({ text: "Parity achieved. Protocol logic verified." })),
        generateProtocolVisual(spec.title, spec.description)
      ]);

      setAiReport(analysis.text || "Audit synchronized.");
      setVisualUrl(visual);
      setLoadingAi(false);
      setGeneratingVisual(false);

      // Automated Neural Narration
      setIsSpeaking(true);
      const narrationText = `Initializing protocol audit for ${spec.title}. ${analysis.text || spec.description}`;
      await synthesizeSpeech(narrationText, 'Kore');
      setIsSpeaking(false);
    };
    
    initProtocol();
    
    const logInt = setInterval(() => {
      const msgs = ['Parity verify...', 'Handshake OK', 'Keys rotated', 'Consensus reached', 'Fabric sync', 'Block sealed'];
      setLogs(prev => [msgs[Math.floor(Math.random() * msgs.length)] + ' : ' + Math.random().toString(16).substring(7), ...prev].slice(0, 10));
    }, 2000);
    
    return () => clearInterval(logInt);
  }, [spec, tier]);

  return (
    <div className="min-h-screen bg-black text-white pb-40 selection:bg-blue-600/30 font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto py-32 px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-24">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Return to Nexus Hub</span>
          </button>
          <div className="flex items-center gap-4">
             {isSpeaking && (
               <div className="flex items-center gap-3 px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full animate-pulse">
                  <Volume2 size={14} className="text-blue-500" />
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Neural Narration Active</span>
               </div>
             )}
             <div className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{tier} Node State</span>
             </div>
          </div>
        </div>

        <div className="space-y-32">
          <div className="relative h-[650px] w-full rounded-[4rem] overflow-hidden border border-zinc-900 shadow-2xl group/hero">
             {generatingVisual ? (
               <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center space-y-8">
                  <Loader2 size={64} className="animate-spin text-blue-500" />
                  <p className="text-[14px] font-black text-zinc-700 uppercase tracking-[1em] animate-pulse italic">Synthesizing Protocol Artifact...</p>
               </div>
             ) : (
               <>
                 <img src={visualUrl || ''} className="w-full h-full object-cover opacity-70 group-hover/hero:scale-105 transition-transform duration-[15s] ease-linear" alt={spec.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                 <div className="absolute bottom-20 left-20 right-20 space-y-10 animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center gap-6">
                       <span className="px-5 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">{spec.id}</span>
                       <div className="px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3">
                          <Sparkles size={14} className="text-blue-500" />
                          <span className="text-[9px] font-black uppercase text-zinc-400">Gemini Neural Visual v2.5</span>
                       </div>
                    </div>
                    <h1 className="text-[10rem] lg:text-[14rem] font-black italic text-white uppercase tracking-tighter leading-[0.7]">
                      {spec.title}
                    </h1>
                 </div>
               </>
             )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-24">
              <div className="space-y-12">
                 <p className="text-zinc-500 text-4xl font-bold leading-relaxed italic max-w-5xl">
                   "{spec.description}"
                 </p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-900 rounded-[4rem] p-16 relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <BrainCircuit size={180} className="text-blue-500" />
                 </div>
                 <div className="flex items-center gap-6 mb-12 relative z-10">
                    <div className="p-5 bg-blue-600/10 text-blue-500 rounded-3xl border border-blue-500/20">
                       <Sparkles size={32} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Neural Audit Log</h3>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Real-time model synthesis active</p>
                    </div>
                 </div>
                 {loadingAi ? (
                   <div className="flex items-center gap-6 text-zinc-600 animate-pulse">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-[12px] font-black uppercase tracking-widest">Synthesizing Protocol Logic...</span>
                   </div>
                 ) : (
                   <p className="text-zinc-300 text-2xl font-medium leading-relaxed italic border-l-4 border-blue-500/30 pl-12 py-4">
                      "{aiReport}"
                   </p>
                 )}
              </div>

              <div className="space-y-10">
                 <h3 className="text-white font-black text-2xl uppercase tracking-widest italic flex items-center gap-4">
                   <Activity size={32} className="text-blue-500" />
                   Sub-space Telemetry
                 </h3>
                 <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 h-96 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_#1e1b4b_0%,_transparent_60%)] opacity-30"></div>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="col-val" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={5} fill="url(#col-val)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="space-y-10">
                 <h3 className="text-white font-black text-2xl uppercase tracking-widest italic flex items-center gap-4">
                   <Code size={32} className="text-blue-500" />
                   Logic Fabric
                 </h3>
                 <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                    <div className="bg-zinc-900/50 px-12 py-6 border-b border-zinc-800 flex justify-between items-center">
                       <div className="flex items-center gap-4">
                         <Terminal size={18} className="text-zinc-600" />
                         <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">protocol_v6_5_0.ts</span>
                       </div>
                       <button className="text-zinc-500 hover:text-white transition-colors"><Copy size={16} /></button>
                    </div>
                    <div className="p-16 font-mono text-base text-emerald-500/80 leading-relaxed overflow-x-auto custom-scrollbar">
                       <pre>{spec.codeSnippet}</pre>
                    </div>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
               <div className="bg-zinc-950 border border-zinc-900 rounded-[3.5rem] p-12 shadow-2xl sticky top-10">
                  <div className="flex items-center gap-6 mb-12 pb-12 border-b border-zinc-900">
                     <div className="p-5 bg-zinc-900 rounded-3xl">
                        <Radio size={32} className="text-blue-500 animate-pulse" />
                     </div>
                     <div>
                        <h4 className="text-white font-black text-lg uppercase tracking-widest italic leading-none">Node Poll</h4>
                        <p className="text-[10px] text-zinc-600 font-black uppercase mt-2 tracking-widest">Hard-state verification</p>
                     </div>
                  </div>

                  <div className="space-y-10">
                     {[
                       { label: 'Latency Delta', val: spec.latency, icon: Activity },
                       { label: 'Network Parity', val: spec.parity, icon: Globe },
                       { label: 'Collective Load', val: spec.load, icon: Server },
                       { label: 'Hardware Spec', val: spec.hardware, icon: Cpu },
                     ].map((stat, i) => (
                       <div key={i} className="flex justify-between items-center group/stat border-b border-zinc-900/50 pb-8 last:border-0 last:pb-0">
                          <div className="flex items-center gap-6">
                             <stat.icon size={20} className="text-zinc-700 group-hover/stat:text-blue-500 transition-colors" />
                             <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</span>
                          </div>
                          <span className="text-sm font-black text-white mono">{stat.val}</span>
                       </div>
                     ))}
                  </div>

                  <div className="mt-16 space-y-6">
                     <button className="w-full py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-4">
                        Execute Protocol Seal <ArrowUpRight size={20} />
                     </button>
                  </div>

                  <div className="mt-12 p-10 bg-black rounded-[3rem] border border-zinc-900 h-80 overflow-hidden relative">
                     <div className="flex items-center gap-4 mb-8">
                        <Terminal size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.3em]">Live Trace Stream</span>
                     </div>
                     <div className="space-y-2 font-mono text-[10px] text-zinc-800">
                        {logs.map((log, i) => (
                          <div key={i} className="flex gap-6">
                             <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                             <span className="text-blue-500/40 uppercase tracking-tighter truncate">{log}</span>
                          </div>
                        ))}
                     </div>
                     <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDeepDive;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/TechnicalDeepDive.tsx
================================================================================


import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Terminal, ShieldCheck, Cpu, Globe, Database, 
  Code, Activity, Lock, Layers, Zap, Network, Radio, Server,
  ChevronRight, ArrowUpRight, Copy, Share2, Loader2, Sparkles, BrainCircuit, BarChart3, Crown,
  ImageIcon, Volume2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { callGemini, generateProtocolVisual, synthesizeSpeech } from '../services/geminiService';
import { TECHNICAL_REGISTRY, ProtocolSpec } from './technical/technicalRegistry';
import { useAppTier } from '../App';

const TechnicalDeepDive: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { tier } = useAppTier();
  const [logs, setLogs] = useState<string[]>([]);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [visualUrl, setVisualUrl] = useState<string | null>(null);
  const [generatingVisual, setGeneratingVisual] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const spec = useMemo((): ProtocolSpec => {
    return TECHNICAL_REGISTRY[slug || ''] || {
      id: `LQI-${slug?.toUpperCase()}-UNKN`,
      title: slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Protocol Node',
      description: 'Generalized technical specification for the Lumina Quantum Mesh. Standard parity rules apply.',
      category: 'GENERAL',
      tier: 'L2',
      uptime: '99.9%',
      latency: '0.1ms',
      parity: '100%',
      load: '12%',
      hardware: 'Distributed Cluster',
      codeSnippet: `// Default Implementation\nLumina.init("${slug}");`
    };
  }, [slug]);

  // Remove restriction for AI visuals - all tiers can see them
  const isRestricted = false; 

  const chartData = useMemo(() => {
    const isHighVolatility = spec.category === 'INTELLIGENCE' || spec.category === 'FINANCE';
    return Array.from({ length: 20 }, (_, i) => ({
      name: `t-${20 - i}`,
      val: 50 + (isHighVolatility ? Math.random() * 40 : Math.random() * 10) + Math.sin(i / 2) * 5
    }));
  }, [spec]);

  useEffect(() => {
    const initProtocol = async () => {
      setLoadingAi(true);
      setGeneratingVisual(true);
      
      const [analysis, visual] = await Promise.all([
        callGemini(
          'gemini-3-flash-preview',
          `Analyze this institutional protocol: "${spec.title}". ID: "${spec.id}". Summarize its importance in one concise, technical sentence.`
        ).catch(() => ({ text: "Parity achieved. Protocol logic verified." })),
        generateProtocolVisual(spec.title, spec.description)
      ]);

      setAiReport(analysis.text || "Audit synchronized.");
      setVisualUrl(visual);
      setLoadingAi(false);
      setGeneratingVisual(false);

      // Automated Neural Narration
      setIsSpeaking(true);
      const narrationText = `Initializing protocol audit for ${spec.title}. ${analysis.text || spec.description}`;
      await synthesizeSpeech(narrationText, 'Kore');
      setIsSpeaking(false);
    };
    
    initProtocol();
    
    const logInt = setInterval(() => {
      const msgs = ['Parity verify...', 'Handshake OK', 'Keys rotated', 'Consensus reached', 'Fabric sync', 'Block sealed'];
      setLogs(prev => [msgs[Math.floor(Math.random() * msgs.length)] + ' : ' + Math.random().toString(16).substring(7), ...prev].slice(0, 10));
    }, 2000);
    
    return () => clearInterval(logInt);
  }, [spec, tier]);

  return (
    <div className="min-h-screen bg-black text-white pb-40 selection:bg-blue-600/30 font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto py-32 px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-24">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Return to Nexus Hub</span>
          </button>
          <div className="flex items-center gap-4">
             {isSpeaking && (
               <div className="flex items-center gap-3 px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full animate-pulse">
                  <Volume2 size={14} className="text-blue-500" />
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Neural Narration Active</span>
               </div>
             )}
             <div className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{tier} Node State</span>
             </div>
          </div>
        </div>

        <div className="space-y-32">
          <div className="relative h-[650px] w-full rounded-[4rem] overflow-hidden border border-zinc-900 shadow-2xl group/hero">
             {generatingVisual ? (
               <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center space-y-8">
                  <Loader2 size={64} className="animate-spin text-blue-500" />
                  <p className="text-[14px] font-black text-zinc-700 uppercase tracking-[1em] animate-pulse italic">Synthesizing Protocol Artifact...</p>
               </div>
             ) : (
               <>
                 <img src={visualUrl || ''} className="w-full h-full object-cover opacity-70 group-hover/hero:scale-105 transition-transform duration-[15s] ease-linear" alt={spec.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                 <div className="absolute bottom-20 left-20 right-20 space-y-10 animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center gap-6">
                       <span className="px-5 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">{spec.id}</span>
                       <div className="px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3">
                          <Sparkles size={14} className="text-blue-500" />
                          <span className="text-[9px] font-black uppercase text-zinc-400">Gemini Neural Visual v2.5</span>
                       </div>
                    </div>
                    <h1 className="text-[10rem] lg:text-[14rem] font-black italic text-white uppercase tracking-tighter leading-[0.7]">
                      {spec.title}
                    </h1>
                 </div>
               </>
             )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-24">
              <div className="space-y-12">
                 <p className="text-zinc-500 text-4xl font-bold leading-relaxed italic max-w-5xl">
                   "{spec.description}"
                 </p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-900 rounded-[4rem] p-16 relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <BrainCircuit size={180} className="text-blue-500" />
                 </div>
                 <div className="flex items-center gap-6 mb-12 relative z-10">
                    <div className="p-5 bg-blue-600/10 text-blue-500 rounded-3xl border border-blue-500/20">
                       <Sparkles size={32} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Neural Audit Log</h3>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Real-time model synthesis active</p>
                    </div>
                 </div>
                 {loadingAi ? (
                   <div className="flex items-center gap-6 text-zinc-600 animate-pulse">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-[12px] font-black uppercase tracking-widest">Synthesizing Protocol Logic...</span>
                   </div>
                 ) : (
                   <p className="text-zinc-300 text-2xl font-medium leading-relaxed italic border-l-4 border-blue-500/30 pl-12 py-4">
                      "{aiReport}"
                   </p>
                 )}
              </div>

              <div className="space-y-10">
                 <h3 className="text-white font-black text-2xl uppercase tracking-widest italic flex items-center gap-4">
                   <Activity size={32} className="text-blue-500" />
                   Sub-space Telemetry
                 </h3>
                 <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 h-96 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_#1e1b4b_0%,_transparent_60%)] opacity-30"></div>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="col-val" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={5} fill="url(#col-val)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="space-y-10">
                 <h3 className="text-white font-black text-2xl uppercase tracking-widest italic flex items-center gap-4">
                   <Code size={32} className="text-blue-500" />
                   Logic Fabric
                 </h3>
                 <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                    <div className="bg-zinc-900/50 px-12 py-6 border-b border-zinc-800 flex justify-between items-center">
                       <div className="flex items-center gap-4">
                         <Terminal size={18} className="text-zinc-600" />
                         <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">protocol_v6_5_0.ts</span>
                       </div>
                       <button className="text-zinc-500 hover:text-white transition-colors"><Copy size={16} /></button>
                    </div>
                    <div className="p-16 font-mono text-base text-emerald-500/80 leading-relaxed overflow-x-auto custom-scrollbar">
                       <pre>{spec.codeSnippet}</pre>
                    </div>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
               <div className="bg-zinc-950 border border-zinc-900 rounded-[3.5rem] p-12 shadow-2xl sticky top-10">
                  <div className="flex items-center gap-6 mb-12 pb-12 border-b border-zinc-900">
                     <div className="p-5 bg-zinc-900 rounded-3xl">
                        <Radio size={32} className="text-blue-500 animate-pulse" />
                     </div>
                     <div>
                        <h4 className="text-white font-black text-lg uppercase tracking-widest italic leading-none">Node Poll</h4>
                        <p className="text-[10px] text-zinc-600 font-black uppercase mt-2 tracking-widest">Hard-state verification</p>
                     </div>
                  </div>

                  <div className="space-y-10">
                     {[
                       { label: 'Latency Delta', val: spec.latency, icon: Activity },
                       { label: 'Network Parity', val: spec.parity, icon: Globe },
                       { label: 'Collective Load', val: spec.load, icon: Server },
                       { label: 'Hardware Spec', val: spec.hardware, icon: Cpu },
                     ].map((stat, i) => (
                       <div key={i} className="flex justify-between items-center group/stat border-b border-zinc-900/50 pb-8 last:border-0 last:pb-0">
                          <div className="flex items-center gap-6">
                             <stat.icon size={20} className="text-zinc-700 group-hover/stat:text-blue-500 transition-colors" />
                             <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</span>
                          </div>
                          <span className="text-sm font-black text-white mono">{stat.val}</span>
                       </div>
                     ))}
                  </div>

                  <div className="mt-16 space-y-6">
                     <button className="w-full py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-4">
                        Execute Protocol Seal <ArrowUpRight size={20} />
                     </button>
                  </div>

                  <div className="mt-12 p-10 bg-black rounded-[3rem] border border-zinc-900 h-80 overflow-hidden relative">
                     <div className="flex items-center gap-4 mb-8">
                        <Terminal size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.3em]">Live Trace Stream</span>
                     </div>
                     <div className="space-y-2 font-mono text-[10px] text-zinc-800">
                        {logs.map((log, i) => (
                          <div key={i} className="flex gap-6">
                             <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                             <span className="text-blue-500/40 uppercase tracking-tighter truncate">{log}</span>
                          </div>
                        ))}
                     </div>
                     <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDeepDive;
