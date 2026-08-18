// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/InstitutionalApps.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Search, LayoutGrid, List, Activity, ShieldCheck, 
  Terminal, ArrowUpRight, CheckCircle2, AlertCircle,
  ExternalLink, Fingerprint, Database, Zap, Loader2,
  RefreshCw, ChevronLeft, ChevronRight, Globe, ShieldAlert,
  Info, Server, HardDrive, X, Calendar, Shield, Copy, Link as LinkIcon,
  Play, Hammer
} from 'lucide-react';
import { APP_NODES, AppNode } from './technical/appsRegistry';
import { synthesizeSpeech } from '../services/geminiService';

const PAGE_SIZE = 24;

const InstitutionalApps: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<'ALL' | 'Activated' | 'Deactivated'>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [currentPage, setCurrentPage] = useState(1);
  const [syncingAll, setSyncingAll] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);

  const stats = useMemo(() => {
    return {
      total: APP_NODES.length,
      active: APP_NODES.filter(n => n.state === 'Activated').length,
      inactive: APP_NODES.filter(n => n.state === 'Deactivated').length,
      visibility: APP_NODES.filter(n => n.appVisibility === 'Visible').length
    };
  }, []);

  const filteredNodes = useMemo(() => {
    return APP_NODES.filter(node => {
      const name = node.displayName || '';
      const appId = node.appId || '';
      const id = node.id || '';
      
      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterState === 'ALL' || node.state === filterState;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterState]);

  const totalPages = Math.ceil(filteredNodes.length / PAGE_SIZE);
  const paginatedNodes = filteredNodes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSyncMesh = async () => {
    setSyncingAll(true);
    await synthesizeSpeech(`Initializing global mesh parity check. Synchronizing ${stats.total} institutional nodes.`, "Kore");
    setTimeout(() => {
      setSyncingAll(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterState]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40 relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
        <div className="space-y-4">
           <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Node <span className="text-blue-500 not-italic">Registry</span></h2>
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.5em] flex items-center gap-3">
              <Server size={14} className="text-blue-500" />
              Institutional Mesh Status: STABLE
           </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => navigate('/app-factory')}
             className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center gap-4"
           >
             <Hammer size={16} /> Deploy 999 Nodes
           </button>
           <button 
             onClick={handleSyncMesh}
             disabled={syncingAll}
             className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-4"
           >
             {syncingAll ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
             Parity Check
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Database size={80} />
           </div>
           <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Total Registry</p>
           <h3 className="text-4xl font-black text-white italic tracking-tighter mono">{stats.total}</h3>
           <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2">Distributed Nodes</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={80} />
           </div>
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Activated</p>
           <h3 className="text-4xl font-black text-white italic tracking-tighter mono">{stats.active}</h3>
           <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2">Identity Verified</p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldAlert size={80} />
           </div>
           <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Deactivated</p>
           <h3 className="text-4xl font-black text-white italic tracking-tighter mono">{stats.inactive}</h3>
           <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2">Dormant Nodes</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl">
           <div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Expansion Pack</p>
              <h4 className="text-xl font-black text-blue-500 uppercase italic tracking-tighter">999 Protocol</h4>
           </div>
           <button onClick={() => navigate('/app-factory')} className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
              Run Expansion <Zap size={10} />
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-zinc-950 border border-zinc-900 p-8 rounded-[3rem] shadow-2xl">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search institutional nodes by name, identity, or AppID..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-5 pl-16 pr-8 text-white text-xs font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-800"
            />
         </div>
         <div className="flex gap-4 p-1.5 bg-black rounded-2xl border border-zinc-800">
            <button onClick={() => setViewMode('GRID')} className={`p-3 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}><LayoutGrid size={18} /></button>
            <button onClick={() => setViewMode('TABLE')} className={`p-3 rounded-xl transition-all ${viewMode === 'TABLE' ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}><List size={18} /></button>
         </div>
      </div>

      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-700">
          {paginatedNodes.map(node => (
            <div 
              key={node.id} 
              className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all group shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                 <Server size={100} />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-xl border ${node.state === 'Activated' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                  <Box size={20} />
                </div>
                <button 
                  onClick={() => navigate(`/app-node/${node.id}`)}
                  className="p-3 bg-blue-600 text-white rounded-xl shadow-xl hover:scale-110 transition-transform"
                >
                   <Play size={16} fill="currentColor" />
                </button>
              </div>
              <h4 onClick={() => setSelectedNode(node)} className="text-white font-black text-sm uppercase italic truncate mb-1 pr-6 cursor-pointer hover:text-blue-500 transition-colors">{node.displayName}</h4>
              <p className="text-[10px] text-zinc-600 font-mono mb-6 truncate">{node.id}</p>
              
              <div className="space-y-3 pt-4 border-t border-zinc-900">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-700 tracking-widest">
                    <span>App ID</span>
                    <span className="text-zinc-400 mono">{node.appId ? node.appId.split('-')[0] : 'N/A'}...</span>
                 </div>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-700 tracking-widest">
                    <span>Created</span>
                    <span className="text-zinc-400">{node.createdDateTime}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
                <th className="px-10 py-6">Node Identity</th>
                <th className="py-6">Application ID</th>
                <th className="py-6">Parity Date</th>
                <th className="py-6">Registry State</th>
                <th className="py-6">App Status</th>
                <th className="px-10 py-6 text-right">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {paginatedNodes.map(node => (
                <tr key={node.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td onClick={() => setSelectedNode(node)} className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${node.state === 'Activated' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' : 'bg-rose-500/5 border-rose-500/10 text-rose-500'}`}>
                        <Box size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic truncate max-w-[200px]">{node.displayName}</p>
                        <p className="text-[10px] text-zinc-600 font-mono mt-0.5 truncate max-w-[150px]">{node.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-mono text-zinc-500 select-all">{node.appId}</span>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{node.createdDateTime}</span>
                  </td>
                  <td className="py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                      node.state === 'Activated' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      {node.state}
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${node.appStatus === 'Enabled' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{node.appStatus}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/app-node/${node.id}`); }}
                      className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-zinc-950 border border-zinc-900 p-8 rounded-[3rem] shadow-2xl">
           <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">
             Showing {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filteredNodes.length)} of {filteredNodes.length} Nodes
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center px-6 text-[10px] font-black text-white uppercase tracking-[0.4em]">
                Block {currentPage} / {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
           </div>
        </div>
      )}

      {selectedNode && (
        <div className="fixed inset-0 z-[150] flex items-center justify-end p-6 backdrop-blur-md bg-black/80">
           <div className="bg-zinc-950 border border-zinc-900 h-full w-full max-w-xl rounded-[4rem] p-12 shadow-2xl animate-in slide-in-from-right-10 duration-500 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <Fingerprint size={200} className="text-blue-500" />
              </div>

              <div className="flex justify-between items-start mb-16 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                       <Terminal size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Node <span className="text-blue-500 not-italic">Inspector</span></h3>
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Secure Metadata Handshake</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedNode(null)} className="p-3 text-zinc-600 hover:text-white bg-zinc-900 rounded-2xl transition-colors"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 relative z-10">
                 <section className="space-y-6">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Identity Registry</p>
                    <div className="space-y-4">
                       <div className="p-8 bg-black border border-zinc-800 rounded-[2.5rem]">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Display Designation</p>
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedNode.displayName}</h4>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-black border border-zinc-800 rounded-3xl">
                             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">State</p>
                             <p className="text-emerald-500 font-black text-sm uppercase italic">{selectedNode.state}</p>
                          </div>
                          <div className="p-6 bg-black border border-zinc-800 rounded-3xl">
                             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Visibility</p>
                             <p className="text-blue-400 font-black text-sm uppercase italic">{selectedNode.appVisibility}</p>
                          </div>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Network Parameters</p>
                    <div className="space-y-4 font-mono">
                       <div className="flex justify-between items-center p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800 group/id">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Internal ID</span>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] text-zinc-300">{selectedNode.id}</span>
                             <button onClick={() => copyToClipboard(selectedNode.id)} className="text-zinc-700 hover:text-blue-500"><Copy size={12} /></button>
                          </div>
                       </div>
                       <div className="flex justify-between items-center p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Global App ID</span>
                          <span className="text-[10px] text-zinc-300">{selectedNode.appId}</span>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Identifier URIs</p>
                    <div className="bg-black border border-zinc-800 rounded-[2rem] p-8 space-y-4">
                       {selectedNode.identifierUri && typeof selectedNode.identifierUri === 'string' ? selectedNode.identifierUri.split(',').map((uri, idx) => {
                         const cleanUri = uri.trim();
                         if (!cleanUri) return null;
                         return (
                           <div key={idx} className="flex items-center justify-between group/uri py-2 border-b border-zinc-900 last:border-0">
                              <span className="text-[10px] font-mono text-zinc-400 truncate mr-4">{cleanUri}</span>
                              <div className="flex gap-2">
                                 <button onClick={() => copyToClipboard(cleanUri)} className="p-1 text-zinc-700 hover:text-blue-500"><Copy size={12} /></button>
                                 {cleanUri.startsWith('http') && <ExternalLink size={12} className="text-zinc-700 hover:text-blue-500 cursor-pointer" onClick={() => window.open(cleanUri, '_blank')} />}
                              </div>
                           </div>
                         );
                       }) : <p className="text-[10px] text-zinc-700 italic">No assigned URIs</p>}
                    </div>
                 </section>
              </div>

              <div className="mt-auto pt-10 border-t border-zinc-900 relative z-10 flex gap-4">
                 <button 
                  onClick={() => navigate(`/app-node/${selectedNode.id}`)}
                  className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-4"
                 >
                    <Play size={18} fill="currentColor" />
                    <span>Run Node Logic</span>
                 </button>
                 <button 
                  onClick={() => window.open(selectedNode.homepage, '_blank')}
                  disabled={!selectedNode.homepage}
                  className="py-6 px-10 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] transition-all border border-zinc-800 flex items-center justify-center gap-4"
                 >
                    <Globe size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionalApps;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/InstitutionalApps.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Search, LayoutGrid, List, Activity, ShieldCheck, 
  Terminal, ArrowUpRight, CheckCircle2, AlertCircle,
  ExternalLink, Fingerprint, Database, Zap, Loader2,
  RefreshCw, ChevronLeft, ChevronRight, Globe, ShieldAlert,
  Info, Server, HardDrive, X, Calendar, Shield, Copy, Link as LinkIcon,
  Play, Hammer
} from 'lucide-react';
import { APP_NODES, AppNode } from './technical/appsRegistry';
import { synthesizeSpeech } from '../services/geminiService';

const PAGE_SIZE = 24;

const InstitutionalApps: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<'ALL' | 'Activated' | 'Deactivated'>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [currentPage, setCurrentPage] = useState(1);
  const [syncingAll, setSyncingAll] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);

  const stats = useMemo(() => {
    return {
      total: APP_NODES.length,
      active: APP_NODES.filter(n => n.state === 'Activated').length,
      inactive: APP_NODES.filter(n => n.state === 'Deactivated').length,
      visibility: APP_NODES.filter(n => n.appVisibility === 'Visible').length
    };
  }, []);

  const filteredNodes = useMemo(() => {
    return APP_NODES.filter(node => {
      const name = node.displayName || '';
      const appId = node.appId || '';
      const id = node.id || '';
      
      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterState === 'ALL' || node.state === filterState;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterState]);

  const totalPages = Math.ceil(filteredNodes.length / PAGE_SIZE);
  const paginatedNodes = filteredNodes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSyncMesh = async () => {
    setSyncingAll(true);
    await synthesizeSpeech(`Initializing global mesh parity check. Synchronizing ${stats.total} institutional nodes.`, "Kore");
    setTimeout(() => {
      setSyncingAll(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterState]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40 relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
        <div className="space-y-4">
           <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Node <span className="text-blue-500 not-italic">Registry</span></h2>
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.5em] flex items-center gap-3">
              <Server size={14} className="text-blue-500" />
              Institutional Mesh Status: STABLE
           </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => navigate('/app-factory')}
             className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center gap-4"
           >
             <Hammer size={16} /> Deploy 999 Nodes
           </button>
           <button 
             onClick={handleSyncMesh}
             disabled={syncingAll}
             className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-4"
           >
             {syncingAll ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
             Parity Check
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Database size={80} />
           </div>
           <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Total Registry</p>
           <h3 className="text-4xl font-black text-white italic tracking-tighter mono">{stats.total}</h3>
           <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2">Distributed Nodes</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={80} />
           </div>
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Activated</p>
           <h3 className="text-4xl font-black text-white italic tracking-tighter mono">{stats.active}</h3>
           <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2">Identity Verified</p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldAlert size={80} />
           </div>
           <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Deactivated</p>
           <h3 className="text-4xl font-black text-white italic tracking-tighter mono">{stats.inactive}</h3>
           <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2">Dormant Nodes</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl">
           <div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Expansion Pack</p>
              <h4 className="text-xl font-black text-blue-500 uppercase italic tracking-tighter">999 Protocol</h4>
           </div>
           <button onClick={() => navigate('/app-factory')} className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
              Run Expansion <Zap size={10} />
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-zinc-950 border border-zinc-900 p-8 rounded-[3rem] shadow-2xl">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search institutional nodes by name, identity, or AppID..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-5 pl-16 pr-8 text-white text-xs font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-800"
            />
         </div>
         <div className="flex gap-4 p-1.5 bg-black rounded-2xl border border-zinc-800">
            <button onClick={() => setViewMode('GRID')} className={`p-3 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}><LayoutGrid size={18} /></button>
            <button onClick={() => setViewMode('TABLE')} className={`p-3 rounded-xl transition-all ${viewMode === 'TABLE' ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}><List size={18} /></button>
         </div>
      </div>

      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-700">
          {paginatedNodes.map(node => (
            <div 
              key={node.id} 
              className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all group shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                 <Server size={100} />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-xl border ${node.state === 'Activated' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                  <Box size={20} />
                </div>
                <button 
                  onClick={() => navigate(`/app-node/${node.id}`)}
                  className="p-3 bg-blue-600 text-white rounded-xl shadow-xl hover:scale-110 transition-transform"
                >
                   <Play size={16} fill="currentColor" />
                </button>
              </div>
              <h4 onClick={() => setSelectedNode(node)} className="text-white font-black text-sm uppercase italic truncate mb-1 pr-6 cursor-pointer hover:text-blue-500 transition-colors">{node.displayName}</h4>
              <p className="text-[10px] text-zinc-600 font-mono mb-6 truncate">{node.id}</p>
              
              <div className="space-y-3 pt-4 border-t border-zinc-900">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-700 tracking-widest">
                    <span>App ID</span>
                    <span className="text-zinc-400 mono">{node.appId ? node.appId.split('-')[0] : 'N/A'}...</span>
                 </div>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-700 tracking-widest">
                    <span>Created</span>
                    <span className="text-zinc-400">{node.createdDateTime}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
                <th className="px-10 py-6">Node Identity</th>
                <th className="py-6">Application ID</th>
                <th className="py-6">Parity Date</th>
                <th className="py-6">Registry State</th>
                <th className="py-6">App Status</th>
                <th className="px-10 py-6 text-right">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {paginatedNodes.map(node => (
                <tr key={node.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td onClick={() => setSelectedNode(node)} className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${node.state === 'Activated' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' : 'bg-rose-500/5 border-rose-500/10 text-rose-500'}`}>
                        <Box size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic truncate max-w-[200px]">{node.displayName}</p>
                        <p className="text-[10px] text-zinc-600 font-mono mt-0.5 truncate max-w-[150px]">{node.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-mono text-zinc-500 select-all">{node.appId}</span>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{node.createdDateTime}</span>
                  </td>
                  <td className="py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                      node.state === 'Activated' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      {node.state}
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${node.appStatus === 'Enabled' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{node.appStatus}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/app-node/${node.id}`); }}
                      className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-zinc-950 border border-zinc-900 p-8 rounded-[3rem] shadow-2xl">
           <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">
             Showing {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filteredNodes.length)} of {filteredNodes.length} Nodes
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center px-6 text-[10px] font-black text-white uppercase tracking-[0.4em]">
                Block {currentPage} / {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
           </div>
        </div>
      )}

      {selectedNode && (
        <div className="fixed inset-0 z-[150] flex items-center justify-end p-6 backdrop-blur-md bg-black/80">
           <div className="bg-zinc-950 border border-zinc-900 h-full w-full max-w-xl rounded-[4rem] p-12 shadow-2xl animate-in slide-in-from-right-10 duration-500 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <Fingerprint size={200} className="text-blue-500" />
              </div>

              <div className="flex justify-between items-start mb-16 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                       <Terminal size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Node <span className="text-blue-500 not-italic">Inspector</span></h3>
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Secure Metadata Handshake</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedNode(null)} className="p-3 text-zinc-600 hover:text-white bg-zinc-900 rounded-2xl transition-colors"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 relative z-10">
                 <section className="space-y-6">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Identity Registry</p>
                    <div className="space-y-4">
                       <div className="p-8 bg-black border border-zinc-800 rounded-[2.5rem]">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Display Designation</p>
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedNode.displayName}</h4>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-black border border-zinc-800 rounded-3xl">
                             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">State</p>
                             <p className="text-emerald-500 font-black text-sm uppercase italic">{selectedNode.state}</p>
                          </div>
                          <div className="p-6 bg-black border border-zinc-800 rounded-3xl">
                             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Visibility</p>
                             <p className="text-blue-400 font-black text-sm uppercase italic">{selectedNode.appVisibility}</p>
                          </div>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Network Parameters</p>
                    <div className="space-y-4 font-mono">
                       <div className="flex justify-between items-center p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800 group/id">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Internal ID</span>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] text-zinc-300">{selectedNode.id}</span>
                             <button onClick={() => copyToClipboard(selectedNode.id)} className="text-zinc-700 hover:text-blue-500"><Copy size={12} /></button>
                          </div>
                       </div>
                       <div className="flex justify-between items-center p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Global App ID</span>
                          <span className="text-[10px] text-zinc-300">{selectedNode.appId}</span>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Identifier URIs</p>
                    <div className="bg-black border border-zinc-800 rounded-[2rem] p-8 space-y-4">
                       {selectedNode.identifierUri && typeof selectedNode.identifierUri === 'string' ? selectedNode.identifierUri.split(',').map((uri, idx) => {
                         const cleanUri = uri.trim();
                         if (!cleanUri) return null;
                         return (
                           <div key={idx} className="flex items-center justify-between group/uri py-2 border-b border-zinc-900 last:border-0">
                              <span className="text-[10px] font-mono text-zinc-400 truncate mr-4">{cleanUri}</span>
                              <div className="flex gap-2">
                                 <button onClick={() => copyToClipboard(cleanUri)} className="p-1 text-zinc-700 hover:text-blue-500"><Copy size={12} /></button>
                                 {cleanUri.startsWith('http') && <ExternalLink size={12} className="text-zinc-700 hover:text-blue-500 cursor-pointer" onClick={() => window.open(cleanUri, '_blank')} />}
                              </div>
                           </div>
                         );
                       }) : <p className="text-[10px] text-zinc-700 italic">No assigned URIs</p>}
                    </div>
                 </section>
              </div>

              <div className="mt-auto pt-10 border-t border-zinc-900 relative z-10 flex gap-4">
                 <button 
                  onClick={() => navigate(`/app-node/${selectedNode.id}`)}
                  className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-4"
                 >
                    <Play size={18} fill="currentColor" />
                    <span>Run Node Logic</span>
                 </button>
                 <button 
                  onClick={() => window.open(selectedNode.homepage, '_blank')}
                  disabled={!selectedNode.homepage}
                  className="py-6 px-10 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] transition-all border border-zinc-800 flex items-center justify-center gap-4"
                 >
                    <Globe size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionalApps;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/InstitutionalApps.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Search, LayoutGrid, List, Activity, ShieldCheck, 
  Terminal, ArrowUpRight, CheckCircle2, AlertCircle,
  ExternalLink, Fingerprint, Database, Zap, Loader2,
  RefreshCw, ChevronLeft, ChevronRight, Globe, ShieldAlert,
  Info, Server, HardDrive, X, Calendar, Shield, Copy, Link as LinkIcon,
  Play, Hammer
} from 'lucide-react';
import { APP_NODES, AppNode } from './technical/appsRegistry';
import { synthesizeSpeech } from '../services/geminiService';

const PAGE_SIZE = 24;

const InstitutionalApps: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<'ALL' | 'Activated' | 'Deactivated'>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [currentPage, setCurrentPage] = useState(1);
  const [syncingAll, setSyncingAll] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);

  const stats = useMemo(() => {
    return {
      total: APP_NODES.length,
      active: APP_NODES.filter(n => n.state === 'Activated').length,
      inactive: APP_NODES.filter(n => n.state === 'Deactivated').length,
      visibility: APP_NODES.filter(n => n.appVisibility === 'Visible').length
    };
  }, []);

  const filteredNodes = useMemo(() => {
    return APP_NODES.filter(node => {
      const name = node.displayName || '';
      const appId = node.appId || '';
      const id = node.id || '';
      
      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterState === 'ALL' || node.state === filterState;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterState]);

  const totalPages = Math.ceil(filteredNodes.length / PAGE_SIZE);
  const paginatedNodes = filteredNodes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSyncMesh = async () => {
    setSyncingAll(true);
    await synthesizeSpeech(`Initializing global mesh parity check. Synchronizing ${stats.total} institutional nodes.`, "Kore");
    setTimeout(() => {
      setSyncingAll(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterState]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40 relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
        <div className="space-y-4">
           <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Node <span className="text-blue-500 not-italic">Registry</span></h2>
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.5em] flex items-center gap-3">
              <Server size={14} className="text-blue-500" />
              Institutional Mesh Status: STABLE
           </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => navigate('/app-factory')}
             className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center gap-4"
           >
             <Hammer size={16} /> Deploy 999 Nodes
           </button>
           <button 
             onClick={handleSyncMesh}
             disabled={syncingAll}
             className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-4"
           >
             {syncingAll ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
             Parity Check
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Database size={80} />
           </div>
           <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Total Registry</p>
           <h3 className="text-4xl font-black text-white italic tracking-tighter mono">{stats.total}</h3>
           <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2">Distributed Nodes</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={80} />
           </div>
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Activated</p>
           <h3 className="text-4xl font-black text-white italic tracking-tighter mono">{stats.active}</h3>
           <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2">Identity Verified</p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldAlert size={80} />
           </div>
           <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Deactivated</p>
           <h3 className="text-4xl font-black text-white italic tracking-tighter mono">{stats.inactive}</h3>
           <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2">Dormant Nodes</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl">
           <div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Expansion Pack</p>
              <h4 className="text-xl font-black text-blue-500 uppercase italic tracking-tighter">999 Protocol</h4>
           </div>
           <button onClick={() => navigate('/app-factory')} className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
              Run Expansion <Zap size={10} />
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-zinc-950 border border-zinc-900 p-8 rounded-[3rem] shadow-2xl">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search institutional nodes by name, identity, or AppID..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-5 pl-16 pr-8 text-white text-xs font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-800"
            />
         </div>
         <div className="flex gap-4 p-1.5 bg-black rounded-2xl border border-zinc-800">
            <button onClick={() => setViewMode('GRID')} className={`p-3 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}><LayoutGrid size={18} /></button>
            <button onClick={() => setViewMode('TABLE')} className={`p-3 rounded-xl transition-all ${viewMode === 'TABLE' ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}><List size={18} /></button>
         </div>
      </div>

      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-700">
          {paginatedNodes.map(node => (
            <div 
              key={node.id} 
              className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all group shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                 <Server size={100} />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-xl border ${node.state === 'Activated' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                  <Box size={20} />
                </div>
                <button 
                  onClick={() => navigate(`/app-node/${node.id}`)}
                  className="p-3 bg-blue-600 text-white rounded-xl shadow-xl hover:scale-110 transition-transform"
                >
                   <Play size={16} fill="currentColor" />
                </button>
              </div>
              <h4 onClick={() => setSelectedNode(node)} className="text-white font-black text-sm uppercase italic truncate mb-1 pr-6 cursor-pointer hover:text-blue-500 transition-colors">{node.displayName}</h4>
              <p className="text-[10px] text-zinc-600 font-mono mb-6 truncate">{node.id}</p>
              
              <div className="space-y-3 pt-4 border-t border-zinc-900">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-700 tracking-widest">
                    <span>App ID</span>
                    <span className="text-zinc-400 mono">{node.appId ? node.appId.split('-')[0] : 'N/A'}...</span>
                 </div>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-700 tracking-widest">
                    <span>Created</span>
                    <span className="text-zinc-400">{node.createdDateTime}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
                <th className="px-10 py-6">Node Identity</th>
                <th className="py-6">Application ID</th>
                <th className="py-6">Parity Date</th>
                <th className="py-6">Registry State</th>
                <th className="py-6">App Status</th>
                <th className="px-10 py-6 text-right">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {paginatedNodes.map(node => (
                <tr key={node.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td onClick={() => setSelectedNode(node)} className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${node.state === 'Activated' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' : 'bg-rose-500/5 border-rose-500/10 text-rose-500'}`}>
                        <Box size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic truncate max-w-[200px]">{node.displayName}</p>
                        <p className="text-[10px] text-zinc-600 font-mono mt-0.5 truncate max-w-[150px]">{node.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-mono text-zinc-500 select-all">{node.appId}</span>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{node.createdDateTime}</span>
                  </td>
                  <td className="py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                      node.state === 'Activated' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      {node.state}
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${node.appStatus === 'Enabled' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{node.appStatus}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/app-node/${node.id}`); }}
                      className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-zinc-950 border border-zinc-900 p-8 rounded-[3rem] shadow-2xl">
           <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">
             Showing {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filteredNodes.length)} of {filteredNodes.length} Nodes
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center px-6 text-[10px] font-black text-white uppercase tracking-[0.4em]">
                Block {currentPage} / {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
           </div>
        </div>
      )}

      {selectedNode && (
        <div className="fixed inset-0 z-[150] flex items-center justify-end p-6 backdrop-blur-md bg-black/80">
           <div className="bg-zinc-950 border border-zinc-900 h-full w-full max-w-xl rounded-[4rem] p-12 shadow-2xl animate-in slide-in-from-right-10 duration-500 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <Fingerprint size={200} className="text-blue-500" />
              </div>

              <div className="flex justify-between items-start mb-16 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                       <Terminal size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Node <span className="text-blue-500 not-italic">Inspector</span></h3>
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Secure Metadata Handshake</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedNode(null)} className="p-3 text-zinc-600 hover:text-white bg-zinc-900 rounded-2xl transition-colors"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 relative z-10">
                 <section className="space-y-6">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Identity Registry</p>
                    <div className="space-y-4">
                       <div className="p-8 bg-black border border-zinc-800 rounded-[2.5rem]">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Display Designation</p>
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedNode.displayName}</h4>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-black border border-zinc-800 rounded-3xl">
                             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">State</p>
                             <p className="text-emerald-500 font-black text-sm uppercase italic">{selectedNode.state}</p>
                          </div>
                          <div className="p-6 bg-black border border-zinc-800 rounded-3xl">
                             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Visibility</p>
                             <p className="text-blue-400 font-black text-sm uppercase italic">{selectedNode.appVisibility}</p>
                          </div>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Network Parameters</p>
                    <div className="space-y-4 font-mono">
                       <div className="flex justify-between items-center p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800 group/id">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Internal ID</span>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] text-zinc-300">{selectedNode.id}</span>
                             <button onClick={() => copyToClipboard(selectedNode.id)} className="text-zinc-700 hover:text-blue-500"><Copy size={12} /></button>
                          </div>
                       </div>
                       <div className="flex justify-between items-center p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Global App ID</span>
                          <span className="text-[10px] text-zinc-300">{selectedNode.appId}</span>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Identifier URIs</p>
                    <div className="bg-black border border-zinc-800 rounded-[2rem] p-8 space-y-4">
                       {selectedNode.identifierUri && typeof selectedNode.identifierUri === 'string' ? selectedNode.identifierUri.split(',').map((uri, idx) => {
                         const cleanUri = uri.trim();
                         if (!cleanUri) return null;
                         return (
                           <div key={idx} className="flex items-center justify-between group/uri py-2 border-b border-zinc-900 last:border-0">
                              <span className="text-[10px] font-mono text-zinc-400 truncate mr-4">{cleanUri}</span>
                              <div className="flex gap-2">
                                 <button onClick={() => copyToClipboard(cleanUri)} className="p-1 text-zinc-700 hover:text-blue-500"><Copy size={12} /></button>
                                 {cleanUri.startsWith('http') && <ExternalLink size={12} className="text-zinc-700 hover:text-blue-500 cursor-pointer" onClick={() => window.open(cleanUri, '_blank')} />}
                              </div>
                           </div>
                         );
                       }) : <p className="text-[10px] text-zinc-700 italic">No assigned URIs</p>}
                    </div>
                 </section>
              </div>

              <div className="mt-auto pt-10 border-t border-zinc-900 relative z-10 flex gap-4">
                 <button 
                  onClick={() => navigate(`/app-node/${selectedNode.id}`)}
                  className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-4"
                 >
                    <Play size={18} fill="currentColor" />
                    <span>Run Node Logic</span>
                 </button>
                 <button 
                  onClick={() => window.open(selectedNode.homepage, '_blank')}
                  disabled={!selectedNode.homepage}
                  className="py-6 px-10 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] transition-all border border-zinc-800 flex items-center justify-center gap-4"
                 >
                    <Globe size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionalApps;
