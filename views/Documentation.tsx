// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Documentation.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, Code, LayoutDashboard, Building2, Cpu, ShieldCheck, Zap, 
  Bitcoin, Terminal, ArrowRight, ChevronRight, Activity, Globe, Database, 
  Layers, Lock, Server, FileText, Smartphone, ArrowLeft, Shield, Filter, 
  Eye, Copy, CheckCircle2, ChevronDown, Radio, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_REGISTRY, ApiEndpoint } from './technical/apiRegistry';

const DocSection: React.FC<{ icon: any, title: string, description: string, details: string[], code?: string }> = ({ icon: Icon, title, description, details, code }) => (
  <div className="group bg-zinc-950 border border-zinc-900 p-12 rounded-[4rem] hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-10 transition-opacity">
      <Icon size={180} />
    </div>
    <div className="flex items-center gap-8 mb-10 relative z-10">
      <div className="p-5 bg-zinc-900 rounded-3xl text-blue-500 group-hover:scale-110 transition-transform duration-500 border border-zinc-800 shadow-xl">
        <Icon size={32} />
      </div>
      <div>
        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{title}</h3>
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Protocol Segment v6.5 • Synchronized</p>
      </div>
    </div>
    <p className="text-zinc-400 text-lg leading-relaxed mb-12 font-medium italic relative z-10">"{description}"</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
      <div className="space-y-6">
        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6">Core Functions</h4>
        <div className="space-y-4">
          {details.map((d, i) => (
            <div key={i} className="flex items-start gap-4 text-sm font-bold text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_8px_#3b82f6]"></div>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
      {code && (
        <div className="bg-black border border-zinc-900 rounded-3xl p-8 font-mono text-[10px] text-emerald-500/80 shadow-inner group-hover:border-zinc-700 transition-colors h-48 overflow-y-auto custom-scrollbar">
          <p className="text-zinc-700 italic mb-4">// Protocol Implementation</p>
          <pre className="whitespace-pre-wrap">{code}</pre>
        </div>
      )}
    </div>
  </div>
);

const ApiReferenceTerminal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_REGISTRY[0]);

  const filtered = useMemo(() => {
    return API_REGISTRY.filter(e => {
      const matchSearch = e.path.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = activeCategory === 'All' || e.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, activeCategory]);

  const categories = ['All', 'Accounts', 'Payments', 'Intelligence', 'Foundry', 'Identity', 'Fabric', 'Compliance'];

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden flex h-[800px] shadow-2xl relative">
      {/* Sidebar */}
      <div className="w-80 border-r border-zinc-900 flex flex-col bg-black/40">
        <div className="p-8 border-b border-zinc-900 space-y-6">
          <div className="flex items-center gap-3">
             <Terminal size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Registry Explorer</span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 100 endpoints..."
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-[10px] font-black text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="p-4 border-b border-zinc-900 flex flex-wrap gap-2">
           {categories.map(cat => (
             <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}
             >
               {cat}
             </button>
           ))}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.map((e, i) => (
            <button 
              key={i}
              onClick={() => setSelectedEndpoint(e)}
              className={`w-full p-6 text-left border-b border-zinc-900/50 transition-all hover:bg-white/[0.02] group ${selectedEndpoint.path === e.path ? 'bg-blue-600/5 border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2">
                 <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                   e.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' : 
                   e.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                 }`}>
                   {e.method}
                 </span>
                 <span className="text-[10px] font-black text-zinc-600 group-hover:text-zinc-400">{e.category}</span>
              </div>
              <p className="text-[11px] font-mono text-zinc-300 truncate">{e.path}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Detail View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 relative">
        <div className="p-16 space-y-12">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="px-4 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                   v1.0 Institutional
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <CheckCircle2 size={12} />
                    Production Ready
                 </div>
              </div>
              <div className="flex items-baseline gap-6">
                 <span className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedEndpoint.method}</span>
                 <span className="text-2xl font-mono text-zinc-500 tracking-tighter break-all">{selectedEndpoint.path}</span>
              </div>
              <p className="text-zinc-400 text-xl font-medium italic leading-relaxed">"{selectedEndpoint.description}"</p>
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Smartphone size={14} /> Request Schema
                 </h4>
                 <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 font-mono text-xs text-zinc-400">
                    <pre className="whitespace-pre-wrap">
{`Header: {
  "Authorization": "Bearer lq_live_...",
  "X-Parity-Token": "rsa-4096-..."
}
Body: ${selectedEndpoint.method === 'GET' ? 'N/A' : '{\n  "id": "string",\n  "intent": "execute",\n  "metadata": {}\n}'}`}
                    </pre>
                 </div>
              </div>

              <div className="space-y-8">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Activity size={14} /> Response Payload
                 </h4>
                 <div className="bg-black border border-zinc-800 rounded-3xl p-8 font-mono text-xs text-emerald-500/80 shadow-inner">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(selectedEndpoint.responseSchema), null, 2)}</pre>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Code size={14} /> Implementation Guide
                 </h4>
                 <div className="flex gap-4">
                    <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">Node.js</button>
                    <button className="text-[9px] font-black text-zinc-700 uppercase tracking-widest hover:text-white transition-colors">Python</button>
                 </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden">
                 <div className="bg-zinc-900/50 px-10 py-5 border-b border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <Terminal size={14} className="text-zinc-600" />
                       <span className="text-[9px] font-mono text-zinc-600">execute_protocol.ts</span>
                    </div>
                    <button className="text-zinc-700 hover:text-blue-500 transition-colors"><Copy size={16} /></button>
                 </div>
                 <div className="p-10 font-mono text-sm text-blue-400/80 leading-relaxed">
<pre>{`const response = await fetch('https://api.aibanking.dev${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'X-Node-Identity': 'LQI-MASTER-1'
  }
});

const { data, parity } = await response.json();
console.log('Parity Verified:', parity);`}</pre>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Documentation: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'manual' | 'reference'>('manual');

  return (
    <div className="min-h-screen bg-black text-white py-20 px-10 animate-in slide-in-from-bottom-6 duration-1000">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-zinc-900 pb-20">
          <div className="space-y-10">
             <button onClick={() => navigate(-1)} className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Return to Nexus</span>
             </button>
            <div className="inline-flex items-center space-x-3 px-6 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[11px] font-black text-blue-500 uppercase tracking-widest">
              <BookOpen size={16} />
              <span>Lumina System Manual v6.5.0</span>
            </div>
            <h1 className="text-[8rem] font-black italic text-white uppercase tracking-tighter leading-none">
              Manual <br /> <span className="text-blue-500 not-italic">Registry</span>
            </h1>
          </div>
          
          <div className="flex bg-zinc-950 p-2 rounded-[2rem] border border-zinc-900 shadow-2xl">
             <button 
                onClick={() => setActiveTab('manual')}
                className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-white text-black shadow-xl' : 'text-zinc-600 hover:text-white'}`}
             >
               System Manual
             </button>
             <button 
                onClick={() => setActiveTab('reference')}
                className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reference' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-zinc-600 hover:text-white'}`}
             >
               API Reference
             </button>
          </div>
        </div>

        {activeTab === 'manual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-700">
            <DocSection 
              icon={LayoutDashboard}
              title="Command Interface"
              description="The central nervous system of the Lumina Quantum Ledger. Aggregates live data from multiple institutional nodes into a singular dashboard."
              details={["Real-time Cash Curve Monitoring", "AI-Driven Liquidity Alerts", "Carbon Deficit Tracking", "Node Health Verification"]}
              code={`const dashboard = await Lumina.Core.initialize({
  nodeParity: 'STRICT',
  refreshInterval: 'REALTIME',
  metrics: ['liquidity', 'alpha', 'esg']
});`}
            />
            <DocSection 
              icon={Building2}
              title="Bank Registry"
              description="Managed corporate treasury nodes connecting directly to tier-1 banks via the FDX v6 protocol. Secure, read-write access to institutional vaults."
              details={["FDX Native Handshakes", "Multi-Institution Syncing", "Available Balance Polling", "Real-time Node Status"]}
              code={`await Registry.Handshake('CITI-USA-1', {
  protocol: 'FDX_V6_NATIVE',
  scope: ['READ_WRITE'],
  auth: { type: 'RSA-OAEP-4096' }
});`}
            />
            <DocSection 
              icon={Cpu}
              title="Quantum Oracle"
              description="Neural financial forecasting engine. Runs complex 'What-If' simulations using high-fidelity economic models and predictive drift analysis."
              details={["Inflation Spike Modeling", "Compute Cost Forecasting", "Market Volatility Stress Testing", "Resilience AA- Ratings"]}
              code={`const forecast = await Oracle.Simulate({
  scenario: 'HYPER_INFLATION_Q3',
  assetClass: 'REAL_ESTATE',
  confidence: 0.98
});`}
            />
            <DocSection 
              icon={ShieldCheck}
              title="Record Vault"
              description="Encrypted long-term storage for audit compliance. Every document is cryptographically signed and stored with sha256 checksum integrity."
              details={["Institutional Archive Export", "Cryptographic Metadata Storage", "Compliance Audit Trails", "Multi-format Ledger Support"]}
              code={`const record = await Vault.Seal(payload, {
  encryption: 'AES-256-GCM',
  sign: 'RSA-PSS-4096',
  auditTrail: true
});`}
            />
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-10 duration-700">
            <ApiReferenceTerminal />
          </div>
        )}

        <div className="p-20 bg-zinc-950 border border-zinc-900 rounded-[5rem] shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_50%)] opacity-30"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-16">
              <div className="space-y-8 flex-1">
                 <div className="p-6 bg-blue-600/10 text-blue-500 rounded-[2.5rem] border border-blue-500/20 shadow-2xl inline-block group-hover:scale-110 transition-transform duration-700">
                    <Terminal size={48} />
                 </div>
                 <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">Need Direct <br /> <span className="text-blue-500">Handshake?</span></h2>
                 <p className="text-zinc-500 text-xl font-bold italic leading-relaxed max-w-2xl">
                    "Our AI Terminal architects are online 24/7 to help you deploy custom node integrations and quantum-resistant treasury flows."
                 </p>
              </div>
              <div className="w-full md:w-auto flex flex-col gap-6">
                 <button onClick={() => navigate('/advisor')} className="px-16 py-8 bg-white text-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] hover:scale-105 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)] flex items-center justify-center gap-6">
                    Open Advisor <ChevronRight size={24} />
                 </button>
                 <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-16 py-8 bg-zinc-900 text-white border border-zinc-800 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-6"
                 >
                    Institutional Billing <ExternalLink size={24} />
                 </a>
              </div>
           </div>
        </div>

        <div className="pt-20 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-20 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
           {['AES-256', 'RSA-4096', 'SHA-256', 'RSA-PSS'].map((label, i) => (
             <div key={i} className="text-center space-y-4">
                <Shield size={32} className="mx-auto text-zinc-500" />
                <span className="text-[12px] font-black uppercase tracking-[1em] text-zinc-600">{label}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Documentation;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Documentation.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, Code, LayoutDashboard, Building2, Cpu, ShieldCheck, Zap, 
  Bitcoin, Terminal, ArrowRight, ChevronRight, Activity, Globe, Database, 
  Layers, Lock, Server, FileText, Smartphone, ArrowLeft, Shield, Filter, 
  Eye, Copy, CheckCircle2, ChevronDown, Radio, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_REGISTRY, ApiEndpoint } from './technical/apiRegistry';

const DocSection: React.FC<{ icon: any, title: string, description: string, details: string[], code?: string }> = ({ icon: Icon, title, description, details, code }) => (
  <div className="group bg-zinc-950 border border-zinc-900 p-12 rounded-[4rem] hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-10 transition-opacity">
      <Icon size={180} />
    </div>
    <div className="flex items-center gap-8 mb-10 relative z-10">
      <div className="p-5 bg-zinc-900 rounded-3xl text-blue-500 group-hover:scale-110 transition-transform duration-500 border border-zinc-800 shadow-xl">
        <Icon size={32} />
      </div>
      <div>
        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{title}</h3>
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Protocol Segment v6.5 • Synchronized</p>
      </div>
    </div>
    <p className="text-zinc-400 text-lg leading-relaxed mb-12 font-medium italic relative z-10">"{description}"</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
      <div className="space-y-6">
        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6">Core Functions</h4>
        <div className="space-y-4">
          {details.map((d, i) => (
            <div key={i} className="flex items-start gap-4 text-sm font-bold text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_8px_#3b82f6]"></div>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
      {code && (
        <div className="bg-black border border-zinc-900 rounded-3xl p-8 font-mono text-[10px] text-emerald-500/80 shadow-inner group-hover:border-zinc-700 transition-colors h-48 overflow-y-auto custom-scrollbar">
          <p className="text-zinc-700 italic mb-4">// Protocol Implementation</p>
          <pre className="whitespace-pre-wrap">{code}</pre>
        </div>
      )}
    </div>
  </div>
);

const ApiReferenceTerminal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_REGISTRY[0]);

  const filtered = useMemo(() => {
    return API_REGISTRY.filter(e => {
      const matchSearch = e.path.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = activeCategory === 'All' || e.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, activeCategory]);

  const categories = ['All', 'Accounts', 'Payments', 'Intelligence', 'Foundry', 'Identity', 'Fabric', 'Compliance'];

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden flex h-[800px] shadow-2xl relative">
      {/* Sidebar */}
      <div className="w-80 border-r border-zinc-900 flex flex-col bg-black/40">
        <div className="p-8 border-b border-zinc-900 space-y-6">
          <div className="flex items-center gap-3">
             <Terminal size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Registry Explorer</span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 100 endpoints..."
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-[10px] font-black text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="p-4 border-b border-zinc-900 flex flex-wrap gap-2">
           {categories.map(cat => (
             <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}
             >
               {cat}
             </button>
           ))}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.map((e, i) => (
            <button 
              key={i}
              onClick={() => setSelectedEndpoint(e)}
              className={`w-full p-6 text-left border-b border-zinc-900/50 transition-all hover:bg-white/[0.02] group ${selectedEndpoint.path === e.path ? 'bg-blue-600/5 border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2">
                 <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                   e.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' : 
                   e.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                 }`}>
                   {e.method}
                 </span>
                 <span className="text-[10px] font-black text-zinc-600 group-hover:text-zinc-400">{e.category}</span>
              </div>
              <p className="text-[11px] font-mono text-zinc-300 truncate">{e.path}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Detail View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 relative">
        <div className="p-16 space-y-12">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="px-4 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                   v1.0 Institutional
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <CheckCircle2 size={12} />
                    Production Ready
                 </div>
              </div>
              <div className="flex items-baseline gap-6">
                 <span className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedEndpoint.method}</span>
                 <span className="text-2xl font-mono text-zinc-500 tracking-tighter break-all">{selectedEndpoint.path}</span>
              </div>
              <p className="text-zinc-400 text-xl font-medium italic leading-relaxed">"{selectedEndpoint.description}"</p>
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Smartphone size={14} /> Request Schema
                 </h4>
                 <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 font-mono text-xs text-zinc-400">
                    <pre className="whitespace-pre-wrap">
{`Header: {
  "Authorization": "Bearer lq_live_...",
  "X-Parity-Token": "rsa-4096-..."
}
Body: ${selectedEndpoint.method === 'GET' ? 'N/A' : '{\n  "id": "string",\n  "intent": "execute",\n  "metadata": {}\n}'}`}
                    </pre>
                 </div>
              </div>

              <div className="space-y-8">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Activity size={14} /> Response Payload
                 </h4>
                 <div className="bg-black border border-zinc-800 rounded-3xl p-8 font-mono text-xs text-emerald-500/80 shadow-inner">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(selectedEndpoint.responseSchema), null, 2)}</pre>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Code size={14} /> Implementation Guide
                 </h4>
                 <div className="flex gap-4">
                    <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">Node.js</button>
                    <button className="text-[9px] font-black text-zinc-700 uppercase tracking-widest hover:text-white transition-colors">Python</button>
                 </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden">
                 <div className="bg-zinc-900/50 px-10 py-5 border-b border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <Terminal size={14} className="text-zinc-600" />
                       <span className="text-[9px] font-mono text-zinc-600">execute_protocol.ts</span>
                    </div>
                    <button className="text-zinc-700 hover:text-blue-500 transition-colors"><Copy size={16} /></button>
                 </div>
                 <div className="p-10 font-mono text-sm text-blue-400/80 leading-relaxed">
<pre>{`const response = await fetch('https://api.aibanking.dev${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'X-Node-Identity': 'LQI-MASTER-1'
  }
});

const { data, parity } = await response.json();
console.log('Parity Verified:', parity);`}</pre>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Documentation: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'manual' | 'reference'>('manual');

  return (
    <div className="min-h-screen bg-black text-white py-20 px-10 animate-in slide-in-from-bottom-6 duration-1000">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-zinc-900 pb-20">
          <div className="space-y-10">
             <button onClick={() => navigate(-1)} className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Return to Nexus</span>
             </button>
            <div className="inline-flex items-center space-x-3 px-6 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[11px] font-black text-blue-500 uppercase tracking-widest">
              <BookOpen size={16} />
              <span>Lumina System Manual v6.5.0</span>
            </div>
            <h1 className="text-[8rem] font-black italic text-white uppercase tracking-tighter leading-none">
              Manual <br /> <span className="text-blue-500 not-italic">Registry</span>
            </h1>
          </div>
          
          <div className="flex bg-zinc-950 p-2 rounded-[2rem] border border-zinc-900 shadow-2xl">
             <button 
                onClick={() => setActiveTab('manual')}
                className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-white text-black shadow-xl' : 'text-zinc-600 hover:text-white'}`}
             >
               System Manual
             </button>
             <button 
                onClick={() => setActiveTab('reference')}
                className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reference' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-zinc-600 hover:text-white'}`}
             >
               API Reference
             </button>
          </div>
        </div>

        {activeTab === 'manual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-700">
            <DocSection 
              icon={LayoutDashboard}
              title="Command Interface"
              description="The central nervous system of the Lumina Quantum Ledger. Aggregates live data from multiple institutional nodes into a singular dashboard."
              details={["Real-time Cash Curve Monitoring", "AI-Driven Liquidity Alerts", "Carbon Deficit Tracking", "Node Health Verification"]}
              code={`const dashboard = await Lumina.Core.initialize({
  nodeParity: 'STRICT',
  refreshInterval: 'REALTIME',
  metrics: ['liquidity', 'alpha', 'esg']
});`}
            />
            <DocSection 
              icon={Building2}
              title="Bank Registry"
              description="Managed corporate treasury nodes connecting directly to tier-1 banks via the FDX v6 protocol. Secure, read-write access to institutional vaults."
              details={["FDX Native Handshakes", "Multi-Institution Syncing", "Available Balance Polling", "Real-time Node Status"]}
              code={`await Registry.Handshake('CITI-USA-1', {
  protocol: 'FDX_V6_NATIVE',
  scope: ['READ_WRITE'],
  auth: { type: 'RSA-OAEP-4096' }
});`}
            />
            <DocSection 
              icon={Cpu}
              title="Quantum Oracle"
              description="Neural financial forecasting engine. Runs complex 'What-If' simulations using high-fidelity economic models and predictive drift analysis."
              details={["Inflation Spike Modeling", "Compute Cost Forecasting", "Market Volatility Stress Testing", "Resilience AA- Ratings"]}
              code={`const forecast = await Oracle.Simulate({
  scenario: 'HYPER_INFLATION_Q3',
  assetClass: 'REAL_ESTATE',
  confidence: 0.98
});`}
            />
            <DocSection 
              icon={ShieldCheck}
              title="Record Vault"
              description="Encrypted long-term storage for audit compliance. Every document is cryptographically signed and stored with sha256 checksum integrity."
              details={["Institutional Archive Export", "Cryptographic Metadata Storage", "Compliance Audit Trails", "Multi-format Ledger Support"]}
              code={`const record = await Vault.Seal(payload, {
  encryption: 'AES-256-GCM',
  sign: 'RSA-PSS-4096',
  auditTrail: true
});`}
            />
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-10 duration-700">
            <ApiReferenceTerminal />
          </div>
        )}

        <div className="p-20 bg-zinc-950 border border-zinc-900 rounded-[5rem] shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_50%)] opacity-30"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-16">
              <div className="space-y-8 flex-1">
                 <div className="p-6 bg-blue-600/10 text-blue-500 rounded-[2.5rem] border border-blue-500/20 shadow-2xl inline-block group-hover:scale-110 transition-transform duration-700">
                    <Terminal size={48} />
                 </div>
                 <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">Need Direct <br /> <span className="text-blue-500">Handshake?</span></h2>
                 <p className="text-zinc-500 text-xl font-bold italic leading-relaxed max-w-2xl">
                    "Our AI Terminal architects are online 24/7 to help you deploy custom node integrations and quantum-resistant treasury flows."
                 </p>
              </div>
              <div className="w-full md:w-auto flex flex-col gap-6">
                 <button onClick={() => navigate('/advisor')} className="px-16 py-8 bg-white text-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] hover:scale-105 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)] flex items-center justify-center gap-6">
                    Open Advisor <ChevronRight size={24} />
                 </button>
                 <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-16 py-8 bg-zinc-900 text-white border border-zinc-800 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-6"
                 >
                    Institutional Billing <ExternalLink size={24} />
                 </a>
              </div>
           </div>
        </div>

        <div className="pt-20 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-20 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
           {['AES-256', 'RSA-4096', 'SHA-256', 'RSA-PSS'].map((label, i) => (
             <div key={i} className="text-center space-y-4">
                <Shield size={32} className="mx-auto text-zinc-500" />
                <span className="text-[12px] font-black uppercase tracking-[1em] text-zinc-600">{label}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Documentation;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Documentation.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, Code, LayoutDashboard, Building2, Cpu, ShieldCheck, Zap, 
  Bitcoin, Terminal, ArrowRight, ChevronRight, Activity, Globe, Database, 
  Layers, Lock, Server, FileText, Smartphone, ArrowLeft, Shield, Filter, 
  Eye, Copy, CheckCircle2, ChevronDown, Radio, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_REGISTRY, ApiEndpoint } from './technical/apiRegistry';

const DocSection: React.FC<{ icon: any, title: string, description: string, details: string[], code?: string }> = ({ icon: Icon, title, description, details, code }) => (
  <div className="group bg-zinc-950 border border-zinc-900 p-12 rounded-[4rem] hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-10 transition-opacity">
      <Icon size={180} />
    </div>
    <div className="flex items-center gap-8 mb-10 relative z-10">
      <div className="p-5 bg-zinc-900 rounded-3xl text-blue-500 group-hover:scale-110 transition-transform duration-500 border border-zinc-800 shadow-xl">
        <Icon size={32} />
      </div>
      <div>
        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{title}</h3>
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Protocol Segment v6.5 • Synchronized</p>
      </div>
    </div>
    <p className="text-zinc-400 text-lg leading-relaxed mb-12 font-medium italic relative z-10">"{description}"</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
      <div className="space-y-6">
        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6">Core Functions</h4>
        <div className="space-y-4">
          {details.map((d, i) => (
            <div key={i} className="flex items-start gap-4 text-sm font-bold text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_8px_#3b82f6]"></div>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
      {code && (
        <div className="bg-black border border-zinc-900 rounded-3xl p-8 font-mono text-[10px] text-emerald-500/80 shadow-inner group-hover:border-zinc-700 transition-colors h-48 overflow-y-auto custom-scrollbar">
          <p className="text-zinc-700 italic mb-4">// Protocol Implementation</p>
          <pre className="whitespace-pre-wrap">{code}</pre>
        </div>
      )}
    </div>
  </div>
);

const ApiReferenceTerminal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_REGISTRY[0]);

  const filtered = useMemo(() => {
    return API_REGISTRY.filter(e => {
      const matchSearch = e.path.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = activeCategory === 'All' || e.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, activeCategory]);

  const categories = ['All', 'Accounts', 'Payments', 'Intelligence', 'Foundry', 'Identity', 'Fabric', 'Compliance'];

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden flex h-[800px] shadow-2xl relative">
      {/* Sidebar */}
      <div className="w-80 border-r border-zinc-900 flex flex-col bg-black/40">
        <div className="p-8 border-b border-zinc-900 space-y-6">
          <div className="flex items-center gap-3">
             <Terminal size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Registry Explorer</span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 100 endpoints..."
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-[10px] font-black text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="p-4 border-b border-zinc-900 flex flex-wrap gap-2">
           {categories.map(cat => (
             <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}
             >
               {cat}
             </button>
           ))}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.map((e, i) => (
            <button 
              key={i}
              onClick={() => setSelectedEndpoint(e)}
              className={`w-full p-6 text-left border-b border-zinc-900/50 transition-all hover:bg-white/[0.02] group ${selectedEndpoint.path === e.path ? 'bg-blue-600/5 border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2">
                 <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                   e.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' : 
                   e.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                 }`}>
                   {e.method}
                 </span>
                 <span className="text-[10px] font-black text-zinc-600 group-hover:text-zinc-400">{e.category}</span>
              </div>
              <p className="text-[11px] font-mono text-zinc-300 truncate">{e.path}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Detail View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 relative">
        <div className="p-16 space-y-12">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="px-4 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                   v1.0 Institutional
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <CheckCircle2 size={12} />
                    Production Ready
                 </div>
              </div>
              <div className="flex items-baseline gap-6">
                 <span className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedEndpoint.method}</span>
                 <span className="text-2xl font-mono text-zinc-500 tracking-tighter break-all">{selectedEndpoint.path}</span>
              </div>
              <p className="text-zinc-400 text-xl font-medium italic leading-relaxed">"{selectedEndpoint.description}"</p>
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Smartphone size={14} /> Request Schema
                 </h4>
                 <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 font-mono text-xs text-zinc-400">
                    <pre className="whitespace-pre-wrap">
{`Header: {
  "Authorization": "Bearer lq_live_...",
  "X-Parity-Token": "rsa-4096-..."
}
Body: ${selectedEndpoint.method === 'GET' ? 'N/A' : '{\n  "id": "string",\n  "intent": "execute",\n  "metadata": {}\n}'}`}
                    </pre>
                 </div>
              </div>

              <div className="space-y-8">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Activity size={14} /> Response Payload
                 </h4>
                 <div className="bg-black border border-zinc-800 rounded-3xl p-8 font-mono text-xs text-emerald-500/80 shadow-inner">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(selectedEndpoint.responseSchema), null, 2)}</pre>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Code size={14} /> Implementation Guide
                 </h4>
                 <div className="flex gap-4">
                    <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">Node.js</button>
                    <button className="text-[9px] font-black text-zinc-700 uppercase tracking-widest hover:text-white transition-colors">Python</button>
                 </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden">
                 <div className="bg-zinc-900/50 px-10 py-5 border-b border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <Terminal size={14} className="text-zinc-600" />
                       <span className="text-[9px] font-mono text-zinc-600">execute_protocol.ts</span>
                    </div>
                    <button className="text-zinc-700 hover:text-blue-500 transition-colors"><Copy size={16} /></button>
                 </div>
                 <div className="p-10 font-mono text-sm text-blue-400/80 leading-relaxed">
<pre>{`const response = await fetch('https://api.aibanking.dev${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'X-Node-Identity': 'LQI-MASTER-1'
  }
});

const { data, parity } = await response.json();
console.log('Parity Verified:', parity);`}</pre>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Documentation: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'manual' | 'reference'>('manual');

  return (
    <div className="min-h-screen bg-black text-white py-20 px-10 animate-in slide-in-from-bottom-6 duration-1000">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-zinc-900 pb-20">
          <div className="space-y-10">
             <button onClick={() => navigate(-1)} className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Return to Nexus</span>
             </button>
            <div className="inline-flex items-center space-x-3 px-6 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[11px] font-black text-blue-500 uppercase tracking-widest">
              <BookOpen size={16} />
              <span>Lumina System Manual v6.5.0</span>
            </div>
            <h1 className="text-[8rem] font-black italic text-white uppercase tracking-tighter leading-none">
              Manual <br /> <span className="text-blue-500 not-italic">Registry</span>
            </h1>
          </div>
          
          <div className="flex bg-zinc-950 p-2 rounded-[2rem] border border-zinc-900 shadow-2xl">
             <button 
                onClick={() => setActiveTab('manual')}
                className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-white text-black shadow-xl' : 'text-zinc-600 hover:text-white'}`}
             >
               System Manual
             </button>
             <button 
                onClick={() => setActiveTab('reference')}
                className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reference' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-zinc-600 hover:text-white'}`}
             >
               API Reference
             </button>
          </div>
        </div>

        {activeTab === 'manual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-700">
            <DocSection 
              icon={LayoutDashboard}
              title="Command Interface"
              description="The central nervous system of the Lumina Quantum Ledger. Aggregates live data from multiple institutional nodes into a singular dashboard."
              details={["Real-time Cash Curve Monitoring", "AI-Driven Liquidity Alerts", "Carbon Deficit Tracking", "Node Health Verification"]}
              code={`const dashboard = await Lumina.Core.initialize({
  nodeParity: 'STRICT',
  refreshInterval: 'REALTIME',
  metrics: ['liquidity', 'alpha', 'esg']
});`}
            />
            <DocSection 
              icon={Building2}
              title="Bank Registry"
              description="Managed corporate treasury nodes connecting directly to tier-1 banks via the FDX v6 protocol. Secure, read-write access to institutional vaults."
              details={["FDX Native Handshakes", "Multi-Institution Syncing", "Available Balance Polling", "Real-time Node Status"]}
              code={`await Registry.Handshake('CITI-USA-1', {
  protocol: 'FDX_V6_NATIVE',
  scope: ['READ_WRITE'],
  auth: { type: 'RSA-OAEP-4096' }
});`}
            />
            <DocSection 
              icon={Cpu}
              title="Quantum Oracle"
              description="Neural financial forecasting engine. Runs complex 'What-If' simulations using high-fidelity economic models and predictive drift analysis."
              details={["Inflation Spike Modeling", "Compute Cost Forecasting", "Market Volatility Stress Testing", "Resilience AA- Ratings"]}
              code={`const forecast = await Oracle.Simulate({
  scenario: 'HYPER_INFLATION_Q3',
  assetClass: 'REAL_ESTATE',
  confidence: 0.98
});`}
            />
            <DocSection 
              icon={ShieldCheck}
              title="Record Vault"
              description="Encrypted long-term storage for audit compliance. Every document is cryptographically signed and stored with sha256 checksum integrity."
              details={["Institutional Archive Export", "Cryptographic Metadata Storage", "Compliance Audit Trails", "Multi-format Ledger Support"]}
              code={`const record = await Vault.Seal(payload, {
  encryption: 'AES-256-GCM',
  sign: 'RSA-PSS-4096',
  auditTrail: true
});`}
            />
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-10 duration-700">
            <ApiReferenceTerminal />
          </div>
        )}

        <div className="p-20 bg-zinc-950 border border-zinc-900 rounded-[5rem] shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_50%)] opacity-30"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-16">
              <div className="space-y-8 flex-1">
                 <div className="p-6 bg-blue-600/10 text-blue-500 rounded-[2.5rem] border border-blue-500/20 shadow-2xl inline-block group-hover:scale-110 transition-transform duration-700">
                    <Terminal size={48} />
                 </div>
                 <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">Need Direct <br /> <span className="text-blue-500">Handshake?</span></h2>
                 <p className="text-zinc-500 text-xl font-bold italic leading-relaxed max-w-2xl">
                    "Our AI Terminal architects are online 24/7 to help you deploy custom node integrations and quantum-resistant treasury flows."
                 </p>
              </div>
              <div className="w-full md:w-auto flex flex-col gap-6">
                 <button onClick={() => navigate('/advisor')} className="px-16 py-8 bg-white text-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] hover:scale-105 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)] flex items-center justify-center gap-6">
                    Open Advisor <ChevronRight size={24} />
                 </button>
                 <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-16 py-8 bg-zinc-900 text-white border border-zinc-800 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-6"
                 >
                    Institutional Billing <ExternalLink size={24} />
                 </a>
              </div>
           </div>
        </div>

        <div className="pt-20 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-20 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
           {['AES-256', 'RSA-4096', 'SHA-256', 'RSA-PSS'].map((label, i) => (
             <div key={i} className="text-center space-y-4">
                <Shield size={32} className="mx-auto text-zinc-500" />
                <span className="text-[12px] font-black uppercase tracking-[1em] text-zinc-600">{label}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
