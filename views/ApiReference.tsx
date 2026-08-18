// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/ApiReference.tsx
================================================================================

import React, { useState, useMemo } from 'react';
// fix: added useNavigate import to resolve "Cannot find name 'navigate'" error
import { useNavigate } from 'react-router-dom';
import { 
  Search, Terminal, ArrowRight, Activity, Globe, Database, 
  Code, ShieldCheck, Zap, Copy, Volume2, Loader2, Filter, 
  CheckCircle2, ChevronRight, Smartphone, Eye
} from 'lucide-react';
import { API_REGISTRY, ApiEndpoint } from './technical/apiRegistry';
import { synthesizeSpeech } from '../services/geminiService';

const ApiReference: React.FC = () => {
  // fix: initialized navigate using useNavigate hook
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_REGISTRY[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const filtered = useMemo(() => {
    return API_REGISTRY.filter(e => {
      const matchSearch = e.path.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = activeCategory === 'All' || e.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, activeCategory]);

  const categories = ['All', 'Accounts', 'Payments', 'Identity', 'Intelligence', 'Foundry', 'Fabric', 'Compliance'];

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const text = `Endpoint: ${selectedEndpoint.method} ${selectedEndpoint.path}. Description: ${selectedEndpoint.description}`;
    await synthesizeSpeech(text, 'Kore');
    setIsSpeaking(false);
  };

  const copyPath = () => {
    navigator.clipboard.writeText(`https://api.aibanking.dev${selectedEndpoint.path}`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Protocol <span className="text-blue-500 not-italic">Registry</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional API Reference • 100 Unique Endpoints Synchronized</p>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
           <div className="px-6 py-2.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3 bg-blue-600 shadow-xl shadow-blue-900/40">
             <Terminal size={14} /> v1.4.0 Production
           </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden flex h-[800px] shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative">
        {/* Sidebar Explorer */}
        <div className="w-96 border-r border-zinc-900 flex flex-col bg-black/40 backdrop-blur-3xl">
          <div className="p-10 border-b border-zinc-900 space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                 <Search size={18} />
               </div>
               <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Node Explorer</span>
            </div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Query 100 nodes..."
                className="w-full bg-black border border-zinc-800 rounded-[1.5rem] py-4 pl-14 pr-6 text-[10px] font-black text-white outline-none focus:border-blue-500 transition-all placeholder:text-zinc-800"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
               {categories.map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filtered.map((e, i) => (
              <button 
                key={i}
                onClick={() => setSelectedEndpoint(e)}
                className={`w-full p-8 text-left border-b border-zinc-900/50 transition-all hover:bg-white/[0.02] group relative ${selectedEndpoint.path === e.path ? 'bg-blue-600/5' : ''}`}
              >
                {selectedEndpoint.path === e.path && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>}
                <div className="flex items-center gap-4 mb-3">
                   <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${
                     e.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' : 
                     e.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                   }`}>
                     {e.method}
                   </span>
                   <span className="text-[10px] font-black text-zinc-600 group-hover:text-zinc-400">{e.category}</span>
                </div>
                <p className="text-[12px] font-mono text-zinc-300 truncate tracking-tight">{e.path}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Logic View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 relative">
          <div className="p-20 space-y-16">
             <div className="space-y-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="px-5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                           Endpoint Detail
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            <CheckCircle2 size={12} />
                            Ready for Deployment
                         </div>
                      </div>
                      <div className="flex items-baseline gap-8">
                         <span className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedEndpoint.method}</span>
                         <span className="text-3xl font-mono text-zinc-500 tracking-tighter break-all hover:text-white transition-colors cursor-pointer" onClick={copyPath}>{selectedEndpoint.path}</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={handleSpeak}
                        className={`p-5 rounded-2xl border transition-all flex items-center justify-center gap-4 ${isSpeaking ? 'bg-blue-600 text-white border-blue-500 animate-pulse' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'}`}
                        title="Neural Narration"
                      >
                         <Volume2 size={24} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{isSpeaking ? 'Speaking...' : 'Listen to Spec'}</span>
                      </button>
                      <button onClick={copyPath} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl">
                        <Copy size={24} />
                      </button>
                   </div>
                </div>
                <p className="text-zinc-400 text-3xl font-bold italic leading-relaxed max-w-4xl">
                  "{selectedEndpoint.description}"
                </p>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4">
                     <Smartphone size={16} className="text-blue-500" /> Authorized Request
                   </h4>
                   <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 font-mono text-xs text-zinc-400 shadow-inner group hover:border-blue-500/30 transition-all">
                      <pre className="whitespace-pre-wrap leading-relaxed">
{`// Header Handshake
{
  "Authorization": "Bearer lq_live_...",
  "X-Parity-Token": "rsa-4096-...",
  "Accept": "application/json"
}

// Payload Template
${selectedEndpoint.method === 'GET' ? '// [Query Parameters Only]' : '{\n  "id": "req_882190",\n  "intent": "execute",\n  "metadata": {\n    "node": "nexus_1",\n    "region": "global"\n  }\n}'}`}
                      </pre>
                   </div>
                </div>

                <div className="space-y-8">
                   <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4">
                     <Activity size={16} className="text-emerald-500" /> Response Body
                   </h4>
                   <div className="bg-black border border-zinc-900 rounded-[3rem] p-10 font-mono text-xs text-emerald-500/80 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <ShieldCheck size={140} />
                      </div>
                      <pre className="whitespace-pre-wrap relative z-10 leading-relaxed">{selectedEndpoint.responseSchema}</pre>
                   </div>
                </div>
             </div>

             <div className="space-y-10">
                <div className="flex items-center justify-between">
                   <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4">
                     <Code size={18} className="text-blue-500" /> Integration Logic
                   </h4>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden shadow-2xl">
                   <div className="bg-zinc-900/50 px-12 py-6 border-b border-zinc-800 flex justify-between items-center">
                      <div className="flex items-center gap-6">
                         <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                         <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                         <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                         <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] ml-4">protocol_execute.ts</span>
                      </div>
                      <Copy size={16} className="text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                   </div>
                   <div className="p-16 font-mono text-base text-blue-400/80 leading-relaxed overflow-x-auto custom-scrollbar">
<pre>{`const response = await fetch('https://api.aibanking.dev${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': 'Bearer <YOUR_GEMINI_KEY>',
    'X-Client-Node': 'LQI-MASTER-NODE'
  }
});

const { data, parity } = await response.json();
if (parity === 'verified') {
  console.log('Nexus Handshake Established.');
}`}</pre>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Institutional Call to Action */}
      <div className="p-16 bg-white/5 border border-white/10 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 group backdrop-blur-3xl shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
         <div className="flex items-center gap-10 flex-1 relative z-10">
            <div className="p-8 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-[2.5rem] group-hover:scale-110 transition-transform duration-700 shadow-2xl">
              <ShieldCheck size={48} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Enterprise <span className="text-blue-500">Node Compliance</span></h4>
              <p className="text-zinc-500 text-lg font-bold italic leading-relaxed max-w-2xl">
                "Our API mesh utilizes FDX-standard protocols. Every endpoint listed is cryptographically signed and verified by the Lumina Oracle."
              </p>
            </div>
         </div>
         <div className="flex gap-6 relative z-10">
            <button onClick={() => navigate('/documentation')} className="px-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all border border-zinc-800">System Manual</button>
            <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/40">Request Custom Node</button>
         </div>
      </div>
    </div>
  );
};

export default ApiReference;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/ApiReference.tsx
================================================================================

import React, { useState, useMemo } from 'react';
// fix: added useNavigate import to resolve "Cannot find name 'navigate'" error
import { useNavigate } from 'react-router-dom';
import { 
  Search, Terminal, ArrowRight, Activity, Globe, Database, 
  Code, ShieldCheck, Zap, Copy, Volume2, Loader2, Filter, 
  CheckCircle2, ChevronRight, Smartphone, Eye
} from 'lucide-react';
import { API_REGISTRY, ApiEndpoint } from './technical/apiRegistry';
import { synthesizeSpeech } from '../services/geminiService';

const ApiReference: React.FC = () => {
  // fix: initialized navigate using useNavigate hook
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_REGISTRY[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const filtered = useMemo(() => {
    return API_REGISTRY.filter(e => {
      const matchSearch = e.path.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = activeCategory === 'All' || e.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, activeCategory]);

  const categories = ['All', 'Accounts', 'Payments', 'Identity', 'Intelligence', 'Foundry', 'Fabric', 'Compliance'];

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const text = `Endpoint: ${selectedEndpoint.method} ${selectedEndpoint.path}. Description: ${selectedEndpoint.description}`;
    await synthesizeSpeech(text, 'Kore');
    setIsSpeaking(false);
  };

  const copyPath = () => {
    navigator.clipboard.writeText(`https://api.aibanking.dev${selectedEndpoint.path}`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Protocol <span className="text-blue-500 not-italic">Registry</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional API Reference • 100 Unique Endpoints Synchronized</p>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
           <div className="px-6 py-2.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3 bg-blue-600 shadow-xl shadow-blue-900/40">
             <Terminal size={14} /> v1.4.0 Production
           </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden flex h-[800px] shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative">
        {/* Sidebar Explorer */}
        <div className="w-96 border-r border-zinc-900 flex flex-col bg-black/40 backdrop-blur-3xl">
          <div className="p-10 border-b border-zinc-900 space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                 <Search size={18} />
               </div>
               <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Node Explorer</span>
            </div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Query 100 nodes..."
                className="w-full bg-black border border-zinc-800 rounded-[1.5rem] py-4 pl-14 pr-6 text-[10px] font-black text-white outline-none focus:border-blue-500 transition-all placeholder:text-zinc-800"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
               {categories.map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filtered.map((e, i) => (
              <button 
                key={i}
                onClick={() => setSelectedEndpoint(e)}
                className={`w-full p-8 text-left border-b border-zinc-900/50 transition-all hover:bg-white/[0.02] group relative ${selectedEndpoint.path === e.path ? 'bg-blue-600/5' : ''}`}
              >
                {selectedEndpoint.path === e.path && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>}
                <div className="flex items-center gap-4 mb-3">
                   <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${
                     e.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' : 
                     e.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                   }`}>
                     {e.method}
                   </span>
                   <span className="text-[10px] font-black text-zinc-600 group-hover:text-zinc-400">{e.category}</span>
                </div>
                <p className="text-[12px] font-mono text-zinc-300 truncate tracking-tight">{e.path}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Logic View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 relative">
          <div className="p-20 space-y-16">
             <div className="space-y-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="px-5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                           Endpoint Detail
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            <CheckCircle2 size={12} />
                            Ready for Deployment
                         </div>
                      </div>
                      <div className="flex items-baseline gap-8">
                         <span className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedEndpoint.method}</span>
                         <span className="text-3xl font-mono text-zinc-500 tracking-tighter break-all hover:text-white transition-colors cursor-pointer" onClick={copyPath}>{selectedEndpoint.path}</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={handleSpeak}
                        className={`p-5 rounded-2xl border transition-all flex items-center justify-center gap-4 ${isSpeaking ? 'bg-blue-600 text-white border-blue-500 animate-pulse' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'}`}
                        title="Neural Narration"
                      >
                         <Volume2 size={24} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{isSpeaking ? 'Speaking...' : 'Listen to Spec'}</span>
                      </button>
                      <button onClick={copyPath} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl">
                        <Copy size={24} />
                      </button>
                   </div>
                </div>
                <p className="text-zinc-400 text-3xl font-bold italic leading-relaxed max-w-4xl">
                  "{selectedEndpoint.description}"
                </p>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4">
                     <Smartphone size={16} className="text-blue-500" /> Authorized Request
                   </h4>
                   <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 font-mono text-xs text-zinc-400 shadow-inner group hover:border-blue-500/30 transition-all">
                      <pre className="whitespace-pre-wrap leading-relaxed">
{`// Header Handshake
{
  "Authorization": "Bearer lq_live_...",
  "X-Parity-Token": "rsa-4096-...",
  "Accept": "application/json"
}

// Payload Template
${selectedEndpoint.method === 'GET' ? '// [Query Parameters Only]' : '{\n  "id": "req_882190",\n  "intent": "execute",\n  "metadata": {\n    "node": "nexus_1",\n    "region": "global"\n  }\n}'}`}
                      </pre>
                   </div>
                </div>

                <div className="space-y-8">
                   <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4">
                     <Activity size={16} className="text-emerald-500" /> Response Body
                   </h4>
                   <div className="bg-black border border-zinc-900 rounded-[3rem] p-10 font-mono text-xs text-emerald-500/80 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <ShieldCheck size={140} />
                      </div>
                      <pre className="whitespace-pre-wrap relative z-10 leading-relaxed">{selectedEndpoint.responseSchema}</pre>
                   </div>
                </div>
             </div>

             <div className="space-y-10">
                <div className="flex items-center justify-between">
                   <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4">
                     <Code size={18} className="text-blue-500" /> Integration Logic
                   </h4>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden shadow-2xl">
                   <div className="bg-zinc-900/50 px-12 py-6 border-b border-zinc-800 flex justify-between items-center">
                      <div className="flex items-center gap-6">
                         <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                         <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                         <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                         <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] ml-4">protocol_execute.ts</span>
                      </div>
                      <Copy size={16} className="text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                   </div>
                   <div className="p-16 font-mono text-base text-blue-400/80 leading-relaxed overflow-x-auto custom-scrollbar">
<pre>{`const response = await fetch('https://api.aibanking.dev${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': 'Bearer <YOUR_GEMINI_KEY>',
    'X-Client-Node': 'LQI-MASTER-NODE'
  }
});

const { data, parity } = await response.json();
if (parity === 'verified') {
  console.log('Nexus Handshake Established.');
}`}</pre>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Institutional Call to Action */}
      <div className="p-16 bg-white/5 border border-white/10 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 group backdrop-blur-3xl shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
         <div className="flex items-center gap-10 flex-1 relative z-10">
            <div className="p-8 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-[2.5rem] group-hover:scale-110 transition-transform duration-700 shadow-2xl">
              <ShieldCheck size={48} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Enterprise <span className="text-blue-500">Node Compliance</span></h4>
              <p className="text-zinc-500 text-lg font-bold italic leading-relaxed max-w-2xl">
                "Our API mesh utilizes FDX-standard protocols. Every endpoint listed is cryptographically signed and verified by the Lumina Oracle."
              </p>
            </div>
         </div>
         <div className="flex gap-6 relative z-10">
            <button onClick={() => navigate('/documentation')} className="px-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all border border-zinc-800">System Manual</button>
            <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/40">Request Custom Node</button>
         </div>
      </div>
    </div>
  );
};

export default ApiReference;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/ApiReference.tsx
================================================================================

import React, { useState, useMemo } from 'react';
// fix: added useNavigate import to resolve "Cannot find name 'navigate'" error
import { useNavigate } from 'react-router-dom';
import { 
  Search, Terminal, ArrowRight, Activity, Globe, Database, 
  Code, ShieldCheck, Zap, Copy, Volume2, Loader2, Filter, 
  CheckCircle2, ChevronRight, Smartphone, Eye
} from 'lucide-react';
import { API_REGISTRY, ApiEndpoint } from './technical/apiRegistry';
import { synthesizeSpeech } from '../services/geminiService';

const ApiReference: React.FC = () => {
  // fix: initialized navigate using useNavigate hook
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_REGISTRY[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const filtered = useMemo(() => {
    return API_REGISTRY.filter(e => {
      const matchSearch = e.path.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = activeCategory === 'All' || e.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, activeCategory]);

  const categories = ['All', 'Accounts', 'Payments', 'Identity', 'Intelligence', 'Foundry', 'Fabric', 'Compliance'];

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const text = `Endpoint: ${selectedEndpoint.method} ${selectedEndpoint.path}. Description: ${selectedEndpoint.description}`;
    await synthesizeSpeech(text, 'Kore');
    setIsSpeaking(false);
  };

  const copyPath = () => {
    navigator.clipboard.writeText(`https://api.aibanking.dev${selectedEndpoint.path}`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Protocol <span className="text-blue-500 not-italic">Registry</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional API Reference • 100 Unique Endpoints Synchronized</p>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
           <div className="px-6 py-2.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3 bg-blue-600 shadow-xl shadow-blue-900/40">
             <Terminal size={14} /> v1.4.0 Production
           </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden flex h-[800px] shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative">
        {/* Sidebar Explorer */}
        <div className="w-96 border-r border-zinc-900 flex flex-col bg-black/40 backdrop-blur-3xl">
          <div className="p-10 border-b border-zinc-900 space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                 <Search size={18} />
               </div>
               <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Node Explorer</span>
            </div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Query 100 nodes..."
                className="w-full bg-black border border-zinc-800 rounded-[1.5rem] py-4 pl-14 pr-6 text-[10px] font-black text-white outline-none focus:border-blue-500 transition-all placeholder:text-zinc-800"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
               {categories.map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filtered.map((e, i) => (
              <button 
                key={i}
                onClick={() => setSelectedEndpoint(e)}
                className={`w-full p-8 text-left border-b border-zinc-900/50 transition-all hover:bg-white/[0.02] group relative ${selectedEndpoint.path === e.path ? 'bg-blue-600/5' : ''}`}
              >
                {selectedEndpoint.path === e.path && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>}
                <div className="flex items-center gap-4 mb-3">
                   <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${
                     e.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' : 
                     e.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                   }`}>
                     {e.method}
                   </span>
                   <span className="text-[10px] font-black text-zinc-600 group-hover:text-zinc-400">{e.category}</span>
                </div>
                <p className="text-[12px] font-mono text-zinc-300 truncate tracking-tight">{e.path}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Logic View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 relative">
          <div className="p-20 space-y-16">
             <div className="space-y-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="px-5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                           Endpoint Detail
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            <CheckCircle2 size={12} />
                            Ready for Deployment
                         </div>
                      </div>
                      <div className="flex items-baseline gap-8">
                         <span className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedEndpoint.method}</span>
                         <span className="text-3xl font-mono text-zinc-500 tracking-tighter break-all hover:text-white transition-colors cursor-pointer" onClick={copyPath}>{selectedEndpoint.path}</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={handleSpeak}
                        className={`p-5 rounded-2xl border transition-all flex items-center justify-center gap-4 ${isSpeaking ? 'bg-blue-600 text-white border-blue-500 animate-pulse' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'}`}
                        title="Neural Narration"
                      >
                         <Volume2 size={24} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{isSpeaking ? 'Speaking...' : 'Listen to Spec'}</span>
                      </button>
                      <button onClick={copyPath} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl">
                        <Copy size={24} />
                      </button>
                   </div>
                </div>
                <p className="text-zinc-400 text-3xl font-bold italic leading-relaxed max-w-4xl">
                  "{selectedEndpoint.description}"
                </p>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4">
                     <Smartphone size={16} className="text-blue-500" /> Authorized Request
                   </h4>
                   <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 font-mono text-xs text-zinc-400 shadow-inner group hover:border-blue-500/30 transition-all">
                      <pre className="whitespace-pre-wrap leading-relaxed">
{`// Header Handshake
{
  "Authorization": "Bearer lq_live_...",
  "X-Parity-Token": "rsa-4096-...",
  "Accept": "application/json"
}

// Payload Template
${selectedEndpoint.method === 'GET' ? '// [Query Parameters Only]' : '{\n  "id": "req_882190",\n  "intent": "execute",\n  "metadata": {\n    "node": "nexus_1",\n    "region": "global"\n  }\n}'}`}
                      </pre>
                   </div>
                </div>

                <div className="space-y-8">
                   <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4">
                     <Activity size={16} className="text-emerald-500" /> Response Body
                   </h4>
                   <div className="bg-black border border-zinc-900 rounded-[3rem] p-10 font-mono text-xs text-emerald-500/80 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <ShieldCheck size={140} />
                      </div>
                      <pre className="whitespace-pre-wrap relative z-10 leading-relaxed">{selectedEndpoint.responseSchema}</pre>
                   </div>
                </div>
             </div>

             <div className="space-y-10">
                <div className="flex items-center justify-between">
                   <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4">
                     <Code size={18} className="text-blue-500" /> Integration Logic
                   </h4>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden shadow-2xl">
                   <div className="bg-zinc-900/50 px-12 py-6 border-b border-zinc-800 flex justify-between items-center">
                      <div className="flex items-center gap-6">
                         <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                         <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                         <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                         <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] ml-4">protocol_execute.ts</span>
                      </div>
                      <Copy size={16} className="text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                   </div>
                   <div className="p-16 font-mono text-base text-blue-400/80 leading-relaxed overflow-x-auto custom-scrollbar">
<pre>{`const response = await fetch('https://api.aibanking.dev${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': 'Bearer <YOUR_GEMINI_KEY>',
    'X-Client-Node': 'LQI-MASTER-NODE'
  }
});

const { data, parity } = await response.json();
if (parity === 'verified') {
  console.log('Nexus Handshake Established.');
}`}</pre>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Institutional Call to Action */}
      <div className="p-16 bg-white/5 border border-white/10 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 group backdrop-blur-3xl shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
         <div className="flex items-center gap-10 flex-1 relative z-10">
            <div className="p-8 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-[2.5rem] group-hover:scale-110 transition-transform duration-700 shadow-2xl">
              <ShieldCheck size={48} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Enterprise <span className="text-blue-500">Node Compliance</span></h4>
              <p className="text-zinc-500 text-lg font-bold italic leading-relaxed max-w-2xl">
                "Our API mesh utilizes FDX-standard protocols. Every endpoint listed is cryptographically signed and verified by the Lumina Oracle."
              </p>
            </div>
         </div>
         <div className="flex gap-6 relative z-10">
            <button onClick={() => navigate('/documentation')} className="px-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all border border-zinc-800">System Manual</button>
            <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/40">Request Custom Node</button>
         </div>
      </div>
    </div>
  );
};

export default ApiReference;