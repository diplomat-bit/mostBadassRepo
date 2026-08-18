// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/AppNodeRunner.tsx
================================================================================


import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Terminal, Cpu, Zap, Activity, ShieldCheck, ArrowLeft, 
  Loader2, Play, Globe, Database, Settings, MessageSquare, 
  // fix: Added AlertCircle and Box to the lucide-react imports
  RefreshCw, Sparkles, Code, Power, AlertCircle, Box
} from 'lucide-react';
import { APP_NODES, AppNode } from './technical/appsRegistry';
import { callGemini, synthesizeSpeech } from '../services/geminiService';

const AppNodeRunner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booting, setBooting] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [appTools, setAppTools] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const node = useMemo(() => APP_NODES.find(n => n.id === id), [id]);

  useEffect(() => {
    if (!node) return;

    const runBootSequence = async () => {
      setLogs([`Initializing Node: ${node.displayName}...`]);
      await new Promise(r => setTimeout(r, 500));
      setLogs(prev => [...prev, `AppID: ${node.appId} verified.`, "Establishing RSA-4096 tunnel...", "Fetching Neural Configuration..."]);
      
      try {
        const response = await callGemini(
          'gemini-3-flash-preview',
          `Generate 3 unique functional treasury 'tools' for an app node named "${node.displayName}". 
           Context: Institutional finance, automation, data registry.
           Return ONLY JSON: [{"id": "string", "name": "string", "description": "string", "icon": "string"}]`,
          { responseMimeType: "application/json" }
        );
        
        const tools = JSON.parse(response.text || '[]');
        setAppTools(tools);
        setLogs(prev => [...prev, "Neural tools synchronized.", "Environment READY."]);
        
        await synthesizeSpeech(`Node ${node.displayName} is now online and running in the Lumina mesh.`, "Kore");
      } catch (err) {
        setLogs(prev => [...prev, "Neural sync failed. Running in generic mode."]);
        setAppTools([
          { id: '1', name: 'Balance Audit', description: 'Real-time ledger check for this node.' },
          { id: '2', name: 'Signal Trace', description: 'Monitor incoming M2M instructions.' }
        ]);
      }
      setBooting(false);
    };

    runBootSequence();
  }, [node]);

  if (!node) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-4">
        <AlertCircle size={48} className="text-rose-500 mx-auto" />
        <h2 className="text-white font-black uppercase tracking-widest">Node Not Found</h2>
        <button onClick={() => navigate('/institutional-apps')} className="text-blue-500 text-xs font-bold uppercase tracking-widest">Return to Registry</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-all">
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em]">Back to Hub</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center gap-3">
             <div className={`w-1.5 h-1.5 rounded-full ${booting ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
             <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{booting ? 'Booting Node' : 'Runtime Online'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Terminal View */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                <Cpu size={200} className="text-blue-500" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Box size={40} className="text-white" />
                   </div>
                   <div>
                      <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">{node.displayName}</h2>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em] mt-3">Node Environment: {node.id}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-black border border-zinc-900 rounded-[2.5rem] p-10 space-y-6">
                      <div className="flex items-center gap-4">
                         <Terminal size={18} className="text-blue-500" />
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Runtime Console</span>
                      </div>
                      <div className="font-mono text-[11px] h-48 overflow-y-auto custom-scrollbar space-y-2 pr-4">
                         {logs.map((log, i) => (
                           <div key={i} className="flex gap-4">
                              <span className="text-zinc-800">[{i}]</span>
                              <span className="text-zinc-400">{log}</span>
                           </div>
                         ))}
                         {booting && <div className="animate-pulse text-blue-500">{" >>> "} INITIALIZING...</div>}
                      </div>
                   </div>

                   <div className="bg-black border border-zinc-900 rounded-[2.5rem] p-10 flex flex-col justify-between">
                      <div className="space-y-4">
                         <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Parity Status</p>
                         <div className="flex items-center gap-3">
                            <Activity size={24} className="text-emerald-500 animate-pulse" />
                            <h4 className="text-4xl font-black text-white mono">100<span className="text-xl text-zinc-800">%</span></h4>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-zinc-900">
                         <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-700">
                            <span>Last Sync</span>
                            <span>{new Date().toLocaleTimeString()}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {appTools.map((tool, i) => (
               <div key={tool.id} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] group hover:border-blue-500/30 transition-all shadow-xl">
                  <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 text-blue-500 border border-zinc-800 group-hover:scale-110 transition-transform">
                     <Zap size={20} />
                  </div>
                  <h5 className="text-white font-black text-xs uppercase italic tracking-widest mb-2">{tool.name}</h5>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase leading-relaxed mb-6">{tool.description}</p>
                  <button 
                    disabled={booting || isExecuting}
                    onClick={() => { setIsExecuting(true); setTimeout(() => setIsExecuting(false), 2000); }}
                    className="w-full py-3 bg-zinc-900 hover:bg-white hover:text-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-zinc-800 disabled:opacity-20"
                  >
                    {isExecuting ? 'Executing...' : 'Run Tool'}
                  </button>
               </div>
             ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl">
              <h3 className="text-white font-black text-sm uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                 <Settings size={18} className="text-blue-500" />
                 Node Configuration
              </h3>
              <div className="space-y-6">
                 {[
                   { l: 'State', v: node.state, c: node.state === 'Activated' ? 'text-emerald-500' : 'text-rose-500' },
                   { l: 'Uptime', v: '99.98%', c: 'text-white' },
                   { l: 'Cluster', v: 'GLOBAL_01', c: 'text-zinc-500' },
                   { l: 'Auth', v: 'RSA-4096', c: 'text-blue-500' },
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-zinc-900 pb-4 last:border-0 last:pb-0">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stat.l}</span>
                      <span className={`text-[10px] font-black uppercase ${stat.c}`}>{stat.v}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-5 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                 Sever Node Link
              </button>
           </div>

           <div className="bg-blue-600 border border-blue-500 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                 <Sparkles size={80} className="text-white" />
              </div>
              <div className="relative z-10 space-y-6">
                 <h4 className="text-white font-black text-xl uppercase italic tracking-tighter leading-none">Neural Support</h4>
                 <p className="text-blue-100 text-sm font-medium leading-relaxed italic">"Our AI architects are monitoring this node for any drift."</p>
                 <button onClick={() => navigate('/advisor')} className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                    Ask Advisor
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppNodeRunner;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/AppNodeRunner.tsx
================================================================================


import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Terminal, Cpu, Zap, Activity, ShieldCheck, ArrowLeft, 
  Loader2, Play, Globe, Database, Settings, MessageSquare, 
  // fix: Added AlertCircle and Box to the lucide-react imports
  RefreshCw, Sparkles, Code, Power, AlertCircle, Box
} from 'lucide-react';
import { APP_NODES, AppNode } from './technical/appsRegistry';
import { callGemini, synthesizeSpeech } from '../services/geminiService';

const AppNodeRunner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booting, setBooting] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [appTools, setAppTools] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const node = useMemo(() => APP_NODES.find(n => n.id === id), [id]);

  useEffect(() => {
    if (!node) return;

    const runBootSequence = async () => {
      setLogs([`Initializing Node: ${node.displayName}...`]);
      await new Promise(r => setTimeout(r, 500));
      setLogs(prev => [...prev, `AppID: ${node.appId} verified.`, "Establishing RSA-4096 tunnel...", "Fetching Neural Configuration..."]);
      
      try {
        const response = await callGemini(
          'gemini-3-flash-preview',
          `Generate 3 unique functional treasury 'tools' for an app node named "${node.displayName}". 
           Context: Institutional finance, automation, data registry.
           Return ONLY JSON: [{"id": "string", "name": "string", "description": "string", "icon": "string"}]`,
          { responseMimeType: "application/json" }
        );
        
        const tools = JSON.parse(response.text || '[]');
        setAppTools(tools);
        setLogs(prev => [...prev, "Neural tools synchronized.", "Environment READY."]);
        
        await synthesizeSpeech(`Node ${node.displayName} is now online and running in the Lumina mesh.`, "Kore");
      } catch (err) {
        setLogs(prev => [...prev, "Neural sync failed. Running in generic mode."]);
        setAppTools([
          { id: '1', name: 'Balance Audit', description: 'Real-time ledger check for this node.' },
          { id: '2', name: 'Signal Trace', description: 'Monitor incoming M2M instructions.' }
        ]);
      }
      setBooting(false);
    };

    runBootSequence();
  }, [node]);

  if (!node) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-4">
        <AlertCircle size={48} className="text-rose-500 mx-auto" />
        <h2 className="text-white font-black uppercase tracking-widest">Node Not Found</h2>
        <button onClick={() => navigate('/institutional-apps')} className="text-blue-500 text-xs font-bold uppercase tracking-widest">Return to Registry</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-all">
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em]">Back to Hub</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center gap-3">
             <div className={`w-1.5 h-1.5 rounded-full ${booting ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
             <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{booting ? 'Booting Node' : 'Runtime Online'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Terminal View */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                <Cpu size={200} className="text-blue-500" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Box size={40} className="text-white" />
                   </div>
                   <div>
                      <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">{node.displayName}</h2>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em] mt-3">Node Environment: {node.id}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-black border border-zinc-900 rounded-[2.5rem] p-10 space-y-6">
                      <div className="flex items-center gap-4">
                         <Terminal size={18} className="text-blue-500" />
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Runtime Console</span>
                      </div>
                      <div className="font-mono text-[11px] h-48 overflow-y-auto custom-scrollbar space-y-2 pr-4">
                         {logs.map((log, i) => (
                           <div key={i} className="flex gap-4">
                              <span className="text-zinc-800">[{i}]</span>
                              <span className="text-zinc-400">{log}</span>
                           </div>
                         ))}
                         {booting && <div className="animate-pulse text-blue-500">{" >>> "} INITIALIZING...</div>}
                      </div>
                   </div>

                   <div className="bg-black border border-zinc-900 rounded-[2.5rem] p-10 flex flex-col justify-between">
                      <div className="space-y-4">
                         <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Parity Status</p>
                         <div className="flex items-center gap-3">
                            <Activity size={24} className="text-emerald-500 animate-pulse" />
                            <h4 className="text-4xl font-black text-white mono">100<span className="text-xl text-zinc-800">%</span></h4>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-zinc-900">
                         <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-700">
                            <span>Last Sync</span>
                            <span>{new Date().toLocaleTimeString()}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {appTools.map((tool, i) => (
               <div key={tool.id} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] group hover:border-blue-500/30 transition-all shadow-xl">
                  <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 text-blue-500 border border-zinc-800 group-hover:scale-110 transition-transform">
                     <Zap size={20} />
                  </div>
                  <h5 className="text-white font-black text-xs uppercase italic tracking-widest mb-2">{tool.name}</h5>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase leading-relaxed mb-6">{tool.description}</p>
                  <button 
                    disabled={booting || isExecuting}
                    onClick={() => { setIsExecuting(true); setTimeout(() => setIsExecuting(false), 2000); }}
                    className="w-full py-3 bg-zinc-900 hover:bg-white hover:text-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-zinc-800 disabled:opacity-20"
                  >
                    {isExecuting ? 'Executing...' : 'Run Tool'}
                  </button>
               </div>
             ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl">
              <h3 className="text-white font-black text-sm uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                 <Settings size={18} className="text-blue-500" />
                 Node Configuration
              </h3>
              <div className="space-y-6">
                 {[
                   { l: 'State', v: node.state, c: node.state === 'Activated' ? 'text-emerald-500' : 'text-rose-500' },
                   { l: 'Uptime', v: '99.98%', c: 'text-white' },
                   { l: 'Cluster', v: 'GLOBAL_01', c: 'text-zinc-500' },
                   { l: 'Auth', v: 'RSA-4096', c: 'text-blue-500' },
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-zinc-900 pb-4 last:border-0 last:pb-0">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stat.l}</span>
                      <span className={`text-[10px] font-black uppercase ${stat.c}`}>{stat.v}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-5 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                 Sever Node Link
              </button>
           </div>

           <div className="bg-blue-600 border border-blue-500 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                 <Sparkles size={80} className="text-white" />
              </div>
              <div className="relative z-10 space-y-6">
                 <h4 className="text-white font-black text-xl uppercase italic tracking-tighter leading-none">Neural Support</h4>
                 <p className="text-blue-100 text-sm font-medium leading-relaxed italic">"Our AI architects are monitoring this node for any drift."</p>
                 <button onClick={() => navigate('/advisor')} className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                    Ask Advisor
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppNodeRunner;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/AppNodeRunner.tsx
================================================================================


import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Terminal, Cpu, Zap, Activity, ShieldCheck, ArrowLeft, 
  Loader2, Play, Globe, Database, Settings, MessageSquare, 
  // fix: Added AlertCircle and Box to the lucide-react imports
  RefreshCw, Sparkles, Code, Power, AlertCircle, Box
} from 'lucide-react';
import { APP_NODES, AppNode } from './technical/appsRegistry';
import { callGemini, synthesizeSpeech } from '../services/geminiService';

const AppNodeRunner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booting, setBooting] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [appTools, setAppTools] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const node = useMemo(() => APP_NODES.find(n => n.id === id), [id]);

  useEffect(() => {
    if (!node) return;

    const runBootSequence = async () => {
      setLogs([`Initializing Node: ${node.displayName}...`]);
      await new Promise(r => setTimeout(r, 500));
      setLogs(prev => [...prev, `AppID: ${node.appId} verified.`, "Establishing RSA-4096 tunnel...", "Fetching Neural Configuration..."]);
      
      try {
        const response = await callGemini(
          'gemini-3-flash-preview',
          `Generate 3 unique functional treasury 'tools' for an app node named "${node.displayName}". 
           Context: Institutional finance, automation, data registry.
           Return ONLY JSON: [{"id": "string", "name": "string", "description": "string", "icon": "string"}]`,
          { responseMimeType: "application/json" }
        );
        
        const tools = JSON.parse(response.text || '[]');
        setAppTools(tools);
        setLogs(prev => [...prev, "Neural tools synchronized.", "Environment READY."]);
        
        await synthesizeSpeech(`Node ${node.displayName} is now online and running in the Lumina mesh.`, "Kore");
      } catch (err) {
        setLogs(prev => [...prev, "Neural sync failed. Running in generic mode."]);
        setAppTools([
          { id: '1', name: 'Balance Audit', description: 'Real-time ledger check for this node.' },
          { id: '2', name: 'Signal Trace', description: 'Monitor incoming M2M instructions.' }
        ]);
      }
      setBooting(false);
    };

    runBootSequence();
  }, [node]);

  if (!node) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-4">
        <AlertCircle size={48} className="text-rose-500 mx-auto" />
        <h2 className="text-white font-black uppercase tracking-widest">Node Not Found</h2>
        <button onClick={() => navigate('/institutional-apps')} className="text-blue-500 text-xs font-bold uppercase tracking-widest">Return to Registry</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-all">
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em]">Back to Hub</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center gap-3">
             <div className={`w-1.5 h-1.5 rounded-full ${booting ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
             <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{booting ? 'Booting Node' : 'Runtime Online'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Terminal View */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                <Cpu size={200} className="text-blue-500" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Box size={40} className="text-white" />
                   </div>
                   <div>
                      <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">{node.displayName}</h2>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em] mt-3">Node Environment: {node.id}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-black border border-zinc-900 rounded-[2.5rem] p-10 space-y-6">
                      <div className="flex items-center gap-4">
                         <Terminal size={18} className="text-blue-500" />
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Runtime Console</span>
                      </div>
                      <div className="font-mono text-[11px] h-48 overflow-y-auto custom-scrollbar space-y-2 pr-4">
                         {logs.map((log, i) => (
                           <div key={i} className="flex gap-4">
                              <span className="text-zinc-800">[{i}]</span>
                              <span className="text-zinc-400">{log}</span>
                           </div>
                         ))}
                         {booting && <div className="animate-pulse text-blue-500">>>> INITIALIZING...</div>}
                      </div>
                   </div>

                   <div className="bg-black border border-zinc-900 rounded-[2.5rem] p-10 flex flex-col justify-between">
                      <div className="space-y-4">
                         <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Parity Status</p>
                         <div className="flex items-center gap-3">
                            <Activity size={24} className="text-emerald-500 animate-pulse" />
                            <h4 className="text-4xl font-black text-white mono">100<span className="text-xl text-zinc-800">%</span></h4>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-zinc-900">
                         <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-700">
                            <span>Last Sync</span>
                            <span>{new Date().toLocaleTimeString()}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {appTools.map((tool, i) => (
               <div key={tool.id} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] group hover:border-blue-500/30 transition-all shadow-xl">
                  <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 text-blue-500 border border-zinc-800 group-hover:scale-110 transition-transform">
                     <Zap size={20} />
                  </div>
                  <h5 className="text-white font-black text-xs uppercase italic tracking-widest mb-2">{tool.name}</h5>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase leading-relaxed mb-6">{tool.description}</p>
                  <button 
                    disabled={booting || isExecuting}
                    onClick={() => { setIsExecuting(true); setTimeout(() => setIsExecuting(false), 2000); }}
                    className="w-full py-3 bg-zinc-900 hover:bg-white hover:text-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-zinc-800 disabled:opacity-20"
                  >
                    {isExecuting ? 'Executing...' : 'Run Tool'}
                  </button>
               </div>
             ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl">
              <h3 className="text-white font-black text-sm uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                 <Settings size={18} className="text-blue-500" />
                 Node Configuration
              </h3>
              <div className="space-y-6">
                 {[
                   { l: 'State', v: node.state, c: node.state === 'Activated' ? 'text-emerald-500' : 'text-rose-500' },
                   { l: 'Uptime', v: '99.98%', c: 'text-white' },
                   { l: 'Cluster', v: 'GLOBAL_01', c: 'text-zinc-500' },
                   { l: 'Auth', v: 'RSA-4096', c: 'text-blue-500' },
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-zinc-900 pb-4 last:border-0 last:pb-0">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stat.l}</span>
                      <span className={`text-[10px] font-black uppercase ${stat.c}`}>{stat.v}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-5 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                 Sever Node Link
              </button>
           </div>

           <div className="bg-blue-600 border border-blue-500 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                 <Sparkles size={80} className="text-white" />
              </div>
              <div className="relative z-10 space-y-6">
                 <h4 className="text-white font-black text-xl uppercase italic tracking-tighter leading-none">Neural Support</h4>
                 <p className="text-blue-100 text-sm font-medium leading-relaxed italic">"Our AI architects are monitoring this node for any drift."</p>
                 <button onClick={() => navigate('/advisor')} className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                    Ask Advisor
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppNodeRunner;
