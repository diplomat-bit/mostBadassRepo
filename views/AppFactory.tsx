// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/AppFactory.tsx
================================================================================


import React, { useState, useEffect } from 'react';
// fix: Added missing useNavigate import from react-router-dom
import { useNavigate } from 'react-router-dom';
import { 
  Hammer, Zap, Box, Layers, ArrowUpRight, 
  CheckCircle2, Loader2, Sparkles, Cpu, 
  Globe, Radio, Plus, Play, ShieldCheck,
  Server, Database, Activity
} from 'lucide-react';
import { meshService, BankingNode } from '../services/meshService';
import { synthesizeSpeech } from '../services/geminiService';

const AppFactory: React.FC = () => {
  // fix: initialized navigate using useNavigate hook
  const navigate = useNavigate();
  const [deploying, setDeploying] = useState(false);
  const [nodes, setNodes] = useState<BankingNode[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState<string[]>([]);
  const [totalDeployed, setTotalDeployed] = useState(0);

  const startMassDeployment = async () => {
    setDeploying(true);
    setProgress(0);
    setTotalDeployed(0);
    setNodes([]);

    await synthesizeSpeech("Initializing the 999 Protocol. Commencing mass node synthesis across global fabrics.", "Kore");

    // Simulate batch deployment to reach 999 nodes
    const batchSize = 111; // 9 batches for 999 nodes
    for (let i = 0; i < 9; i++) {
      const batchNames = await meshService.thematizeNodes("Autonomous Treasury", 5);
      setCurrentBatch(batchNames);
      
      const newNodes = meshService.generateNodes(batchSize, totalDeployed);
      setNodes(prev => [...newNodes, ...prev].slice(0, 15)); // Keep UI snappy
      
      setTotalDeployed(prev => prev + batchSize);
      setProgress(Math.round(((i + 1) / 9) * 100));
      
      await new Promise(r => setTimeout(r, 1200));
    }

    setDeploying(false);
    await synthesizeSpeech("The 999 Protocol is complete. All banking nodes are now synchronized and active in the mesh.", "Kore");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">999 <span className="text-blue-500 not-italic">Protocol</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Mass Institutional App Synthesis & Mesh Expansion</p>
        </div>
        <button 
          onClick={startMassDeployment}
          disabled={deploying}
          className="flex items-center space-x-4 px-10 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40 group active:scale-95"
        >
          {deploying ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="group-hover:scale-125 transition-transform" />}
          <span>{deploying ? 'Forging Mesh...' : 'Initialize 999 Expansion'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Hammer size={120} />
              </div>
              <div className="flex items-center gap-6 mb-10 relative z-10">
                 <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                    <Cpu size={28} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Forge Status</h3>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Neural Layer v2.5</p>
                 </div>
              </div>

              <div className="space-y-8 relative z-10">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                       <span>Mesh Integration</span>
                       <span className="text-white mono">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-black border border-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 shadow-[0_0_15px_#3b82f6]" style={{ width: `${progress}%` }}></div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                       <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Deployed</p>
                       <h4 className="text-2xl font-black text-white mono">{totalDeployed}</h4>
                    </div>
                    <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                       <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Target</p>
                       <h4 className="text-2xl font-black text-blue-500 mono">999</h4>
                    </div>
                 </div>

                 {deploying && (
                    <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl animate-in slide-in-from-bottom-2">
                       <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Sparkles size={12} /> Recent Synthesis
                       </p>
                       <div className="space-y-2">
                          {currentBatch.map((name, i) => (
                            <div key={i} className="flex items-center gap-3">
                               <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                               <span className="text-[10px] font-bold text-zinc-400 uppercase italic">{name}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-black/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-xl">
              <h4 className="text-white font-black text-xs uppercase tracking-widest italic mb-6">Protocol Authority</h4>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed italic mb-10">
                "The 999 Protocol establishes an unprecedented scale of autonomous banking nodes. Each node acts as a sovereign ledger unit within the Lumina Fabric."
              </p>
              <div className="space-y-4">
                 {[
                   { l: 'Encryption', v: 'RSA-OAEP-4096', i: ShieldCheck },
                   { l: 'Consensus', v: 'Hard Hardened', i: CheckCircle2 },
                   { l: 'Latency', v: '< 0.0001ns', i: Activity }
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-4">
                         <stat.i size={16} className="text-blue-500" />
                         <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.l}</span>
                      </div>
                      <span className="text-[10px] font-black text-white mono">{stat.v}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col h-[750px]">
              <div className="p-10 border-b border-zinc-900 bg-black/40 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                       <Radio size={24} className="animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Live Deployment Stream</h3>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time registry expansion monitoring</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="px-5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Link: OK</span>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-6">
                 {nodes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20 group">
                       <Server size={80} className="mb-6 group-hover:scale-110 transition-transform duration-700" />
                       <p className="text-xl font-black uppercase tracking-[0.4em] text-zinc-600">Awaiting Signal</p>
                    </div>
                 ) : (
                    nodes.map((node) => (
                      <div key={node.id} className="bg-black/60 border border-zinc-900 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-blue-500/30 transition-all animate-in slide-in-from-right-4">
                         <div className="flex items-center gap-8">
                            <div className={`p-4 rounded-2xl bg-zinc-900 text-blue-500 border border-zinc-800 shadow-xl`}>
                               <Box size={24} />
                            </div>
                            <div>
                               <h5 className="text-lg font-black text-white italic uppercase tracking-tighter">{node.name}</h5>
                               <div className="flex items-center gap-4 mt-2">
                                  <span className="text-[9px] font-mono text-zinc-600">{node.id}</span>
                                  <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{node.region}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-12">
                            <div className="text-right">
                               <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Parity</p>
                               <p className="text-sm font-black text-emerald-500 mono">{node.parity.toFixed(4)}%</p>
                            </div>
                            <div className="text-right min-w-[80px]">
                               <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Status</p>
                               <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${node.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                  {node.status}
                               </span>
                            </div>
                            <button onClick={() => navigate(`/app-node/${node.id}`)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                               <ArrowUpRight size={18} />
                            </button>
                         </div>
                      </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppFactory;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/AppFactory.tsx
================================================================================


import React, { useState, useEffect } from 'react';
// fix: Added missing useNavigate import from react-router-dom
import { useNavigate } from 'react-router-dom';
import { 
  Hammer, Zap, Box, Layers, ArrowUpRight, 
  CheckCircle2, Loader2, Sparkles, Cpu, 
  Globe, Radio, Plus, Play, ShieldCheck,
  Server, Database, Activity
} from 'lucide-react';
import { meshService, BankingNode } from '../services/meshService';
import { synthesizeSpeech } from '../services/geminiService';

const AppFactory: React.FC = () => {
  // fix: initialized navigate using useNavigate hook
  const navigate = useNavigate();
  const [deploying, setDeploying] = useState(false);
  const [nodes, setNodes] = useState<BankingNode[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState<string[]>([]);
  const [totalDeployed, setTotalDeployed] = useState(0);

  const startMassDeployment = async () => {
    setDeploying(true);
    setProgress(0);
    setTotalDeployed(0);
    setNodes([]);

    await synthesizeSpeech("Initializing the 999 Protocol. Commencing mass node synthesis across global fabrics.", "Kore");

    // Simulate batch deployment to reach 999 nodes
    const batchSize = 111; // 9 batches for 999 nodes
    for (let i = 0; i < 9; i++) {
      const batchNames = await meshService.thematizeNodes("Autonomous Treasury", 5);
      setCurrentBatch(batchNames);
      
      const newNodes = meshService.generateNodes(batchSize, totalDeployed);
      setNodes(prev => [...newNodes, ...prev].slice(0, 15)); // Keep UI snappy
      
      setTotalDeployed(prev => prev + batchSize);
      setProgress(Math.round(((i + 1) / 9) * 100));
      
      await new Promise(r => setTimeout(r, 1200));
    }

    setDeploying(false);
    await synthesizeSpeech("The 999 Protocol is complete. All banking nodes are now synchronized and active in the mesh.", "Kore");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">999 <span className="text-blue-500 not-italic">Protocol</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Mass Institutional App Synthesis & Mesh Expansion</p>
        </div>
        <button 
          onClick={startMassDeployment}
          disabled={deploying}
          className="flex items-center space-x-4 px-10 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40 group active:scale-95"
        >
          {deploying ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="group-hover:scale-125 transition-transform" />}
          <span>{deploying ? 'Forging Mesh...' : 'Initialize 999 Expansion'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Hammer size={120} />
              </div>
              <div className="flex items-center gap-6 mb-10 relative z-10">
                 <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                    <Cpu size={28} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Forge Status</h3>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Neural Layer v2.5</p>
                 </div>
              </div>

              <div className="space-y-8 relative z-10">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                       <span>Mesh Integration</span>
                       <span className="text-white mono">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-black border border-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 shadow-[0_0_15px_#3b82f6]" style={{ width: `${progress}%` }}></div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                       <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Deployed</p>
                       <h4 className="text-2xl font-black text-white mono">{totalDeployed}</h4>
                    </div>
                    <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                       <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Target</p>
                       <h4 className="text-2xl font-black text-blue-500 mono">999</h4>
                    </div>
                 </div>

                 {deploying && (
                    <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl animate-in slide-in-from-bottom-2">
                       <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Sparkles size={12} /> Recent Synthesis
                       </p>
                       <div className="space-y-2">
                          {currentBatch.map((name, i) => (
                            <div key={i} className="flex items-center gap-3">
                               <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                               <span className="text-[10px] font-bold text-zinc-400 uppercase italic">{name}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-black/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-xl">
              <h4 className="text-white font-black text-xs uppercase tracking-widest italic mb-6">Protocol Authority</h4>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed italic mb-10">
                "The 999 Protocol establishes an unprecedented scale of autonomous banking nodes. Each node acts as a sovereign ledger unit within the Lumina Fabric."
              </p>
              <div className="space-y-4">
                 {[
                   { l: 'Encryption', v: 'RSA-OAEP-4096', i: ShieldCheck },
                   { l: 'Consensus', v: 'Hard Hardened', i: CheckCircle2 },
                   { l: 'Latency', v: '< 0.0001ns', i: Activity }
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-4">
                         <stat.i size={16} className="text-blue-500" />
                         <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.l}</span>
                      </div>
                      <span className="text-[10px] font-black text-white mono">{stat.v}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col h-[750px]">
              <div className="p-10 border-b border-zinc-900 bg-black/40 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                       <Radio size={24} className="animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Live Deployment Stream</h3>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time registry expansion monitoring</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="px-5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Link: OK</span>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-6">
                 {nodes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20 group">
                       <Server size={80} className="mb-6 group-hover:scale-110 transition-transform duration-700" />
                       <p className="text-xl font-black uppercase tracking-[0.4em] text-zinc-600">Awaiting Signal</p>
                    </div>
                 ) : (
                    nodes.map((node) => (
                      <div key={node.id} className="bg-black/60 border border-zinc-900 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-blue-500/30 transition-all animate-in slide-in-from-right-4">
                         <div className="flex items-center gap-8">
                            <div className={`p-4 rounded-2xl bg-zinc-900 text-blue-500 border border-zinc-800 shadow-xl`}>
                               <Box size={24} />
                            </div>
                            <div>
                               <h5 className="text-lg font-black text-white italic uppercase tracking-tighter">{node.name}</h5>
                               <div className="flex items-center gap-4 mt-2">
                                  <span className="text-[9px] font-mono text-zinc-600">{node.id}</span>
                                  <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{node.region}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-12">
                            <div className="text-right">
                               <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Parity</p>
                               <p className="text-sm font-black text-emerald-500 mono">{node.parity.toFixed(4)}%</p>
                            </div>
                            <div className="text-right min-w-[80px]">
                               <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Status</p>
                               <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${node.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                  {node.status}
                               </span>
                            </div>
                            <button onClick={() => navigate(`/app-node/${node.id}`)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                               <ArrowUpRight size={18} />
                            </button>
                         </div>
                      </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppFactory;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/AppFactory.tsx
================================================================================


import React, { useState, useEffect } from 'react';
// fix: Added missing useNavigate import from react-router-dom
import { useNavigate } from 'react-router-dom';
import { 
  Hammer, Zap, Box, Layers, ArrowUpRight, 
  CheckCircle2, Loader2, Sparkles, Cpu, 
  Globe, Radio, Plus, Play, ShieldCheck,
  Server, Database, Activity
} from 'lucide-react';
import { meshService, BankingNode } from '../services/meshService';
import { synthesizeSpeech } from '../services/geminiService';

const AppFactory: React.FC = () => {
  // fix: initialized navigate using useNavigate hook
  const navigate = useNavigate();
  const [deploying, setDeploying] = useState(false);
  const [nodes, setNodes] = useState<BankingNode[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState<string[]>([]);
  const [totalDeployed, setTotalDeployed] = useState(0);

  const startMassDeployment = async () => {
    setDeploying(true);
    setProgress(0);
    setTotalDeployed(0);
    setNodes([]);

    await synthesizeSpeech("Initializing the 999 Protocol. Commencing mass node synthesis across global fabrics.", "Kore");

    // Simulate batch deployment to reach 999 nodes
    const batchSize = 111; // 9 batches for 999 nodes
    for (let i = 0; i < 9; i++) {
      const batchNames = await meshService.thematizeNodes("Autonomous Treasury", 5);
      setCurrentBatch(batchNames);
      
      const newNodes = meshService.generateNodes(batchSize, totalDeployed);
      setNodes(prev => [...newNodes, ...prev].slice(0, 15)); // Keep UI snappy
      
      setTotalDeployed(prev => prev + batchSize);
      setProgress(Math.round(((i + 1) / 9) * 100));
      
      await new Promise(r => setTimeout(r, 1200));
    }

    setDeploying(false);
    await synthesizeSpeech("The 999 Protocol is complete. All banking nodes are now synchronized and active in the mesh.", "Kore");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">999 <span className="text-blue-500 not-italic">Protocol</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Mass Institutional App Synthesis & Mesh Expansion</p>
        </div>
        <button 
          onClick={startMassDeployment}
          disabled={deploying}
          className="flex items-center space-x-4 px-10 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40 group active:scale-95"
        >
          {deploying ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="group-hover:scale-125 transition-transform" />}
          <span>{deploying ? 'Forging Mesh...' : 'Initialize 999 Expansion'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Hammer size={120} />
              </div>
              <div className="flex items-center gap-6 mb-10 relative z-10">
                 <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                    <Cpu size={28} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Forge Status</h3>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Neural Layer v2.5</p>
                 </div>
              </div>

              <div className="space-y-8 relative z-10">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                       <span>Mesh Integration</span>
                       <span className="text-white mono">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-black border border-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 shadow-[0_0_15px_#3b82f6]" style={{ width: `${progress}%` }}></div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                       <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Deployed</p>
                       <h4 className="text-2xl font-black text-white mono">{totalDeployed}</h4>
                    </div>
                    <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                       <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Target</p>
                       <h4 className="text-2xl font-black text-blue-500 mono">999</h4>
                    </div>
                 </div>

                 {deploying && (
                    <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl animate-in slide-in-from-bottom-2">
                       <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Sparkles size={12} /> Recent Synthesis
                       </p>
                       <div className="space-y-2">
                          {currentBatch.map((name, i) => (
                            <div key={i} className="flex items-center gap-3">
                               <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                               <span className="text-[10px] font-bold text-zinc-400 uppercase italic">{name}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-black/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-xl">
              <h4 className="text-white font-black text-xs uppercase tracking-widest italic mb-6">Protocol Authority</h4>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed italic mb-10">
                "The 999 Protocol establishes an unprecedented scale of autonomous banking nodes. Each node acts as a sovereign ledger unit within the Lumina Fabric."
              </p>
              <div className="space-y-4">
                 {[
                   { l: 'Encryption', v: 'RSA-OAEP-4096', i: ShieldCheck },
                   { l: 'Consensus', v: 'Hard Hardened', i: CheckCircle2 },
                   { l: 'Latency', v: '< 0.0001ns', i: Activity }
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-4">
                         <stat.i size={16} className="text-blue-500" />
                         <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.l}</span>
                      </div>
                      <span className="text-[10px] font-black text-white mono">{stat.v}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col h-[750px]">
              <div className="p-10 border-b border-zinc-900 bg-black/40 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                       <Radio size={24} className="animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Live Deployment Stream</h3>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time registry expansion monitoring</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="px-5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Link: OK</span>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-6">
                 {nodes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20 group">
                       <Server size={80} className="mb-6 group-hover:scale-110 transition-transform duration-700" />
                       <p className="text-xl font-black uppercase tracking-[0.4em] text-zinc-600">Awaiting Signal</p>
                    </div>
                 ) : (
                    nodes.map((node) => (
                      <div key={node.id} className="bg-black/60 border border-zinc-900 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-blue-500/30 transition-all animate-in slide-in-from-right-4">
                         <div className="flex items-center gap-8">
                            <div className={`p-4 rounded-2xl bg-zinc-900 text-blue-500 border border-zinc-800 shadow-xl`}>
                               <Box size={24} />
                            </div>
                            <div>
                               <h5 className="text-lg font-black text-white italic uppercase tracking-tighter">{node.name}</h5>
                               <div className="flex items-center gap-4 mt-2">
                                  <span className="text-[9px] font-mono text-zinc-600">{node.id}</span>
                                  <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{node.region}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-12">
                            <div className="text-right">
                               <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Parity</p>
                               <p className="text-sm font-black text-emerald-500 mono">{node.parity.toFixed(4)}%</p>
                            </div>
                            <div className="text-right min-w-[80px]">
                               <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Status</p>
                               <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${node.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                  {node.status}
                               </span>
                            </div>
                            <button onClick={() => navigate(`/app-node/${node.id}`)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                               <ArrowUpRight size={18} />
                            </button>
                         </div>
                      </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppFactory;
