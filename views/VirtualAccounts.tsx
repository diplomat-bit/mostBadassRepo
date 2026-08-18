// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/VirtualAccounts.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Layers, 
  Search, 
  RefreshCw, 
  ArrowUpRight, 
  Building,
  ShieldCheck,
  Plus,
  Trash2,
  ChevronRight,
  MoreVertical,
  X,
  Loader2,
  Terminal,
  Activity,
  Settings2,
  CheckCircle2,
  Cpu,
  AlertCircle
} from 'lucide-react';
import { VirtualAccount } from '../types/index.ts';
import { callGemini } from '../services/geminiService.ts';

const INITIAL_MOCK_VA: VirtualAccount[] = [
  {
    id: 'VA-88021',
    object: 'virtual_account',
    live_mode: true,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-03-31T14:20:00Z',
    name: 'Q1 Sales Collection - UK',
    description: 'Virtual account for routing Sterling sales to main treasury.',
    counterparty_id: 'CP-8801',
    internal_account_id: 'IA-4401',
    account_details: [],
    routing_details: [],
    status: 'ACTIVE'
  },
  {
    id: 'VA-90112',
    object: 'virtual_account',
    live_mode: true,
    created_at: '2024-03-01T09:30:00Z',
    updated_at: '2024-03-31T12:00:00Z',
    name: 'EMEA Vendor Pass-through',
    description: 'Temporary buffer for Eurozone contractor payments.',
    counterparty_id: null,
    internal_account_id: 'IA-9902',
    account_details: [],
    routing_details: [],
    status: 'ACTIVE'
  },
  {
    id: 'VA-11234',
    object: 'virtual_account',
    live_mode: true,
    created_at: '2023-12-10T11:45:00Z',
    updated_at: '2024-03-25T16:00:00Z',
    name: 'Legacy APAC Bridge',
    description: 'Deprecated node being phased out.',
    counterparty_id: 'CP-1105',
    internal_account_id: 'IA-4401',
    account_details: [],
    routing_details: [],
    status: 'PENDING'
  }
];

const VirtualAccounts: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<VirtualAccount[]>(INITIAL_MOCK_VA);
  
  // Modal States
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isReconcilerOpen, setIsReconcilerOpen] = useState(false);
  const [selectedVa, setSelectedVa] = useState<VirtualAccount | null>(null);
  
  // Provisioning State
  const [provisioning, setProvisioning] = useState(false);
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [newVa, setNewVa] = useState({ name: '', description: '', parent: 'IA-4401' });

  // Reconciler State
  const [reconciling, setReconciling] = useState(false);
  const [reconcileReport, setReconcileReport] = useState<string | null>(null);

  const refreshNodes = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleProvision = async () => {
    setProvisionError(null);
    const trimmedName = newVa.name.trim();
    
    // 1. Client-Side Parity Check: Duplicate Names
    if (accounts.some(acc => acc.name.toLowerCase() === trimmedName.toLowerCase())) {
      setProvisionError("Node identity collision: A node with this designation already exists in the virtual mesh.");
      return;
    }

    setProvisioning(true);
    
    try {
      // 2. Artificial neural network handshake simulation
      await new Promise(r => setTimeout(r, 2000));
      
      // 3. Simulated Registry-Level Validation (e.g. invalid parent or system refusal)
      if (trimmedName.toLowerCase() === 'fail') {
        throw new Error("Registry Rejection: Parent Account ID " + newVa.parent + " refused handshake authorization.");
      }

      const node: VirtualAccount = {
        id: `VA-${Math.floor(10000 + Math.random() * 90000)}`,
        object: 'virtual_account',
        live_mode: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: trimmedName || 'Untitled Node',
        description: newVa.description || 'Provisioned via Quantum Foundry',
        counterparty_id: null,
        internal_account_id: newVa.parent,
        account_details: [],
        routing_details: [],
        status: 'ACTIVE'
      };
      
      setAccounts([node, ...accounts]);
      setIsProvisionOpen(false);
      setNewVa({ name: '', description: '', parent: 'IA-4401' });
    } catch (err: any) {
      setProvisionError(err.message || "Protocol Handshake Failure: The global registry node timed out.");
    } finally {
      setProvisioning(false);
    }
  };

  const handleRunReconciler = async () => {
    setReconciling(true);
    setReconcileReport(null);
    try {
      const response = await callGemini(
        'gemini-3-flash-preview',
        "Generate a professional 2-sentence summary for a financial reconciliation process. Mention 99.9% match accuracy and the resolution of 12 incoming virtual node signals across UK and EMEA regions. Tone: Technical and secure."
      );
      // Fix: Access .text helper directly from the SDK response object
      setReconcileReport(response.text || "Neural reconciliation complete. Signal integrity verified.");
    } catch (err) {
      setReconcileReport("Neural reconciliation complete. Signal integrity verified at 99.9%. All ledger entries matched with zero drift.");
    } finally {
      setReconciling(false);
    }
  };

  const deleteNode = (id: string) => {
    if (confirm("De-provision node? This will sever all incoming signal routing.")) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  const openProvisionModal = () => {
    setProvisionError(null);
    setIsProvisionOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Virtual <span className="text-blue-500 not-italic">Nodes</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">High-Volume Disbursement & Collection Layer</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={refreshNodes}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Poll Virtual Mesh</span>
          </button>
          <button 
            onClick={openProvisionModal}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
          >
            <Plus size={14} />
            <span>Provision Virtual Account</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {accounts.map(va => (
          <div key={va.id} className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-blue-500/30 transition-all relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layers size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800 text-blue-500 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Network size={32} />
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                  va.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                }`}>
                  {va.status}
                </div>
              </div>

              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2 truncate pr-10">{va.name}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed mb-8 h-12 overflow-hidden line-clamp-2">{va.description}</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  <span>Parent Registry</span>
                  <span className="text-zinc-300 mono">{va.internal_account_id}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  <span>ID Segment</span>
                  <span className="text-zinc-300 mono">{va.id}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  <span>Routing Layer</span>
                  <span className="text-blue-500 mono">FDX_V6_MESH</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <button 
                onClick={() => {
                  setSelectedVa(va);
                  setIsConfigOpen(true);
                }}
                className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-800 flex items-center justify-center gap-2"
              >
                <Settings2 size={14} />
                Config
              </button>
              <button 
                onClick={() => deleteNode(va.id)}
                className="p-4 bg-zinc-900 hover:bg-rose-500/10 text-zinc-600 hover:text-rose-500 rounded-2xl transition-all border border-zinc-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        <button 
          onClick={openProvisionModal}
          className="border-2 border-dashed border-zinc-900 rounded-[3rem] p-10 flex flex-col items-center justify-center group hover:border-zinc-700 transition-all gap-4 bg-black/20"
        >
          <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center text-zinc-800 group-hover:text-blue-500 transition-colors shadow-2xl">
            <Plus size={32} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 group-hover:text-zinc-400">Initialize Node</span>
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-500/5">
              <ShieldCheck size={40} />
            </div>
            <div>
              <h4 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Automated <span className="text-blue-500 not-italic">Reconciliation</span></h4>
              <p className="text-zinc-500 text-xs max-w-lg leading-relaxed font-medium">Lumina Quantum Oracle automatically matches incoming virtual node signals to your internal accounting ledger with 99.9% precision.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsReconcilerOpen(true);
              handleRunReconciler();
            }}
            className="px-10 py-5 bg-white hover:bg-zinc-200 text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-4 shadow-xl"
          >
            <span>View Reconciler</span>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      {/* Provision Modal */}
      {isProvisionOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Network size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Provision <span className="text-blue-500 not-italic">Node</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Initialize Virtual Data Sink</p>
                </div>
              </div>
              <button onClick={() => setIsProvisionOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              {provisionError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={16} className="text-rose-500 shrink-0" />
                  <p className="text-[10px] font-bold text-rose-200 uppercase tracking-tight leading-relaxed">{provisionError}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Node Name</label>
                <input 
                  value={newVa.name}
                  onChange={e => {
                    setProvisionError(null);
                    setNewVa({...newVa, name: e.target.value});
                  }}
                  placeholder="e.g. Q4 Marketing Buffer"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-2xl py-4 px-5 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Parent Account</label>
                <select 
                  value={newVa.parent}
                  onChange={e => {
                    setProvisionError(null);
                    setNewVa({...newVa, parent: e.target.value});
                  }}
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-2xl py-4 px-5 text-white text-sm outline-none transition-all font-bold appearance-none"
                >
                  <option value="IA-4401">IA-4401 (J.P. Morgan)</option>
                  <option value="IA-9902">IA-9902 (Deutsche Bank)</option>
                  <option value="IA-1105">IA-1105 (Custody)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Contextual Description</label>
                <textarea 
                  value={newVa.description}
                  onChange={e => {
                    setProvisionError(null);
                    setNewVa({...newVa, description: e.target.value});
                  }}
                  placeholder="Routing purpose and ledger mapping..."
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-2xl py-4 px-5 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold h-24 resize-none"
                />
              </div>

              <button 
                onClick={handleProvision}
                disabled={provisioning || !newVa.name.trim()}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-900/40 disabled:opacity-50"
              >
                {provisioning ? <Loader2 className="animate-spin" size={20} /> : <ArrowUpRight size={20} />}
                <span>{provisioning ? 'Initializing Handshake...' : 'Establish Virtual Node'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {isConfigOpen && selectedVa && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-blue-500">
                  <Settings2 size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Node <span className="text-blue-500 not-italic">Config</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{selectedVa.id}</p>
                </div>
              </div>
              <button onClick={() => setIsConfigOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="p-6 bg-black rounded-3xl border border-zinc-900 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Signal Status</p>
                  <p className="text-white font-bold text-lg italic uppercase">{selectedVa.status}</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="p-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl border border-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest">
                  Rotate Keys
                </button>
                <button className="p-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl border border-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest">
                  Flush Cache
                </button>
              </div>

              <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
                 <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <Activity size={10} />
                   Network Payload Metadata
                 </p>
                 <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                   Created: {new Date(selectedVa.created_at).toLocaleString()}<br />
                   Routing: FDX_V6_NATIVE_BRIDGE<br />
                   Latency: 12ms avg.
                 </p>
              </div>

              <button 
                onClick={() => setIsConfigOpen(false)}
                className="w-full py-4 bg-zinc-100 hover:bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Close Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reconciler Modal */}
      {isReconcilerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom-6">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Quantum <span className="text-emerald-500 not-italic">Reconciler</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Automated Signal Matching Engine</p>
                </div>
              </div>
              <button onClick={() => setIsReconcilerOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="bg-black border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl h-48 flex flex-col">
                <div className="bg-zinc-900/80 px-6 py-3 border-b border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live Matching Console</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={12} className="text-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-zinc-600">Sync Active</span>
                  </div>
                </div>
                <div className="flex-1 p-6 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-2">
                  <div className="text-zinc-500">[14:22:01] Received signal VA-88021...</div>
                  <div className="text-zinc-500">[14:22:02] Matching against Treasury Operating Account (IA-4401)...</div>
                  <div className="text-emerald-500 font-bold">[14:22:03] MATCH FOUND: 100% confidence. Ledger updated.</div>
                  <div className="text-zinc-500">[14:22:10] Scanning global fabric for adrift payloads...</div>
                </div>
              </div>

              <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] relative group">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Cpu size={80} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">LQI Intelligence Report</h4>
                </div>
                
                {reconciling ? (
                  <div className="flex items-center gap-4 text-zinc-500">
                    <Loader2 size={20} className="animate-spin text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Running Neural Pattern Analysis...</span>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-zinc-300 italic leading-relaxed">
                    "{reconcileReport}"
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleRunReconciler}
                  disabled={reconciling}
                  className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-zinc-800 flex items-center justify-center gap-3"
                >
                  <RefreshCw size={14} className={reconciling ? 'animate-spin' : ''} />
                  <span>{reconciling ? 'Re-analyzing...' : 'Refresh Audit'}</span>
                </button>
                <button 
                  onClick={() => setIsReconcilerOpen(false)}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20"
                >
                  Confirm Audits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualAccounts;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/VirtualAccounts.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Layers, 
  Search, 
  RefreshCw, 
  ArrowUpRight, 
  Building,
  ShieldCheck,
  Plus,
  Trash2,
  ChevronRight,
  MoreVertical,
  X,
  Loader2,
  Terminal,
  Activity,
  Settings2,
  CheckCircle2,
  Cpu,
  AlertCircle
} from 'lucide-react';
import { VirtualAccount } from '../types/index.ts';
import { callGemini } from '../services/geminiService.ts';

const INITIAL_MOCK_VA: VirtualAccount[] = [
  {
    id: 'VA-88021',
    object: 'virtual_account',
    live_mode: true,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-03-31T14:20:00Z',
    name: 'Q1 Sales Collection - UK',
    description: 'Virtual account for routing Sterling sales to main treasury.',
    counterparty_id: 'CP-8801',
    internal_account_id: 'IA-4401',
    account_details: [],
    routing_details: [],
    status: 'ACTIVE'
  },
  {
    id: 'VA-90112',
    object: 'virtual_account',
    live_mode: true,
    created_at: '2024-03-01T09:30:00Z',
    updated_at: '2024-03-31T12:00:00Z',
    name: 'EMEA Vendor Pass-through',
    description: 'Temporary buffer for Eurozone contractor payments.',
    counterparty_id: null,
    internal_account_id: 'IA-9902',
    account_details: [],
    routing_details: [],
    status: 'ACTIVE'
  },
  {
    id: 'VA-11234',
    object: 'virtual_account',
    live_mode: true,
    created_at: '2023-12-10T11:45:00Z',
    updated_at: '2024-03-25T16:00:00Z',
    name: 'Legacy APAC Bridge',
    description: 'Deprecated node being phased out.',
    counterparty_id: 'CP-1105',
    internal_account_id: 'IA-4401',
    account_details: [],
    routing_details: [],
    status: 'PENDING'
  }
];

const VirtualAccounts: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<VirtualAccount[]>(INITIAL_MOCK_VA);
  
  // Modal States
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isReconcilerOpen, setIsReconcilerOpen] = useState(false);
  const [selectedVa, setSelectedVa] = useState<VirtualAccount | null>(null);
  
  // Provisioning State
  const [provisioning, setProvisioning] = useState(false);
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [newVa, setNewVa] = useState({ name: '', description: '', parent: 'IA-4401' });

  // Reconciler State
  const [reconciling, setReconciling] = useState(false);
  const [reconcileReport, setReconcileReport] = useState<string | null>(null);

  const refreshNodes = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleProvision = async () => {
    setProvisionError(null);
    const trimmedName = newVa.name.trim();
    
    // 1. Client-Side Parity Check: Duplicate Names
    if (accounts.some(acc => acc.name.toLowerCase() === trimmedName.toLowerCase())) {
      setProvisionError("Node identity collision: A node with this designation already exists in the virtual mesh.");
      return;
    }

    setProvisioning(true);
    
    try {
      // 2. Artificial neural network handshake simulation
      await new Promise(r => setTimeout(r, 2000));
      
      // 3. Simulated Registry-Level Validation (e.g. invalid parent or system refusal)
      if (trimmedName.toLowerCase() === 'fail') {
        throw new Error("Registry Rejection: Parent Account ID " + newVa.parent + " refused handshake authorization.");
      }

      const node: VirtualAccount = {
        id: `VA-${Math.floor(10000 + Math.random() * 90000)}`,
        object: 'virtual_account',
        live_mode: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: trimmedName || 'Untitled Node',
        description: newVa.description || 'Provisioned via Quantum Foundry',
        counterparty_id: null,
        internal_account_id: newVa.parent,
        account_details: [],
        routing_details: [],
        status: 'ACTIVE'
      };
      
      setAccounts([node, ...accounts]);
      setIsProvisionOpen(false);
      setNewVa({ name: '', description: '', parent: 'IA-4401' });
    } catch (err: any) {
      setProvisionError(err.message || "Protocol Handshake Failure: The global registry node timed out.");
    } finally {
      setProvisioning(false);
    }
  };

  const handleRunReconciler = async () => {
    setReconciling(true);
    setReconcileReport(null);
    try {
      const response = await callGemini(
        'gemini-3-flash-preview',
        "Generate a professional 2-sentence summary for a financial reconciliation process. Mention 99.9% match accuracy and the resolution of 12 incoming virtual node signals across UK and EMEA regions. Tone: Technical and secure."
      );
      // Fix: Access .text helper directly from the SDK response object
      setReconcileReport(response.text || "Neural reconciliation complete. Signal integrity verified.");
    } catch (err) {
      setReconcileReport("Neural reconciliation complete. Signal integrity verified at 99.9%. All ledger entries matched with zero drift.");
    } finally {
      setReconciling(false);
    }
  };

  const deleteNode = (id: string) => {
    if (confirm("De-provision node? This will sever all incoming signal routing.")) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  const openProvisionModal = () => {
    setProvisionError(null);
    setIsProvisionOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Virtual <span className="text-blue-500 not-italic">Nodes</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">High-Volume Disbursement & Collection Layer</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={refreshNodes}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Poll Virtual Mesh</span>
          </button>
          <button 
            onClick={openProvisionModal}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
          >
            <Plus size={14} />
            <span>Provision Virtual Account</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {accounts.map(va => (
          <div key={va.id} className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-blue-500/30 transition-all relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layers size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800 text-blue-500 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Network size={32} />
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                  va.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                }`}>
                  {va.status}
                </div>
              </div>

              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2 truncate pr-10">{va.name}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed mb-8 h-12 overflow-hidden line-clamp-2">{va.description}</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  <span>Parent Registry</span>
                  <span className="text-zinc-300 mono">{va.internal_account_id}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  <span>ID Segment</span>
                  <span className="text-zinc-300 mono">{va.id}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  <span>Routing Layer</span>
                  <span className="text-blue-500 mono">FDX_V6_MESH</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <button 
                onClick={() => {
                  setSelectedVa(va);
                  setIsConfigOpen(true);
                }}
                className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-800 flex items-center justify-center gap-2"
              >
                <Settings2 size={14} />
                Config
              </button>
              <button 
                onClick={() => deleteNode(va.id)}
                className="p-4 bg-zinc-900 hover:bg-rose-500/10 text-zinc-600 hover:text-rose-500 rounded-2xl transition-all border border-zinc-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        <button 
          onClick={openProvisionModal}
          className="border-2 border-dashed border-zinc-900 rounded-[3rem] p-10 flex flex-col items-center justify-center group hover:border-zinc-700 transition-all gap-4 bg-black/20"
        >
          <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center text-zinc-800 group-hover:text-blue-500 transition-colors shadow-2xl">
            <Plus size={32} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 group-hover:text-zinc-400">Initialize Node</span>
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-500/5">
              <ShieldCheck size={40} />
            </div>
            <div>
              <h4 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Automated <span className="text-blue-500 not-italic">Reconciliation</span></h4>
              <p className="text-zinc-500 text-xs max-w-lg leading-relaxed font-medium">Lumina Quantum Oracle automatically matches incoming virtual node signals to your internal accounting ledger with 99.9% precision.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsReconcilerOpen(true);
              handleRunReconciler();
            }}
            className="px-10 py-5 bg-white hover:bg-zinc-200 text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-4 shadow-xl"
          >
            <span>View Reconciler</span>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      {/* Provision Modal */}
      {isProvisionOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Network size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Provision <span className="text-blue-500 not-italic">Node</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Initialize Virtual Data Sink</p>
                </div>
              </div>
              <button onClick={() => setIsProvisionOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              {provisionError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={16} className="text-rose-500 shrink-0" />
                  <p className="text-[10px] font-bold text-rose-200 uppercase tracking-tight leading-relaxed">{provisionError}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Node Name</label>
                <input 
                  value={newVa.name}
                  onChange={e => {
                    setProvisionError(null);
                    setNewVa({...newVa, name: e.target.value});
                  }}
                  placeholder="e.g. Q4 Marketing Buffer"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-2xl py-4 px-5 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Parent Account</label>
                <select 
                  value={newVa.parent}
                  onChange={e => {
                    setProvisionError(null);
                    setNewVa({...newVa, parent: e.target.value});
                  }}
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-2xl py-4 px-5 text-white text-sm outline-none transition-all font-bold appearance-none"
                >
                  <option value="IA-4401">IA-4401 (J.P. Morgan)</option>
                  <option value="IA-9902">IA-9902 (Deutsche Bank)</option>
                  <option value="IA-1105">IA-1105 (Custody)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Contextual Description</label>
                <textarea 
                  value={newVa.description}
                  onChange={e => {
                    setProvisionError(null);
                    setNewVa({...newVa, description: e.target.value});
                  }}
                  placeholder="Routing purpose and ledger mapping..."
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-2xl py-4 px-5 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold h-24 resize-none"
                />
              </div>

              <button 
                onClick={handleProvision}
                disabled={provisioning || !newVa.name.trim()}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-900/40 disabled:opacity-50"
              >
                {provisioning ? <Loader2 className="animate-spin" size={20} /> : <ArrowUpRight size={20} />}
                <span>{provisioning ? 'Initializing Handshake...' : 'Establish Virtual Node'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {isConfigOpen && selectedVa && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-blue-500">
                  <Settings2 size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Node <span className="text-blue-500 not-italic">Config</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{selectedVa.id}</p>
                </div>
              </div>
              <button onClick={() => setIsConfigOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="p-6 bg-black rounded-3xl border border-zinc-900 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Signal Status</p>
                  <p className="text-white font-bold text-lg italic uppercase">{selectedVa.status}</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="p-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl border border-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest">
                  Rotate Keys
                </button>
                <button className="p-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl border border-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest">
                  Flush Cache
                </button>
              </div>

              <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
                 <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <Activity size={10} />
                   Network Payload Metadata
                 </p>
                 <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                   Created: {new Date(selectedVa.created_at).toLocaleString()}<br />
                   Routing: FDX_V6_NATIVE_BRIDGE<br />
                   Latency: 12ms avg.
                 </p>
              </div>

              <button 
                onClick={() => setIsConfigOpen(false)}
                className="w-full py-4 bg-zinc-100 hover:bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Close Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reconciler Modal */}
      {isReconcilerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom-6">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Quantum <span className="text-emerald-500 not-italic">Reconciler</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Automated Signal Matching Engine</p>
                </div>
              </div>
              <button onClick={() => setIsReconcilerOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="bg-black border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl h-48 flex flex-col">
                <div className="bg-zinc-900/80 px-6 py-3 border-b border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live Matching Console</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={12} className="text-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-zinc-600">Sync Active</span>
                  </div>
                </div>
                <div className="flex-1 p-6 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-2">
                  <div className="text-zinc-500">[14:22:01] Received signal VA-88021...</div>
                  <div className="text-zinc-500">[14:22:02] Matching against Treasury Operating Account (IA-4401)...</div>
                  <div className="text-emerald-500 font-bold">[14:22:03] MATCH FOUND: 100% confidence. Ledger updated.</div>
                  <div className="text-zinc-500">[14:22:10] Scanning global fabric for adrift payloads...</div>
                </div>
              </div>

              <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] relative group">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Cpu size={80} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">LQI Intelligence Report</h4>
                </div>
                
                {reconciling ? (
                  <div className="flex items-center gap-4 text-zinc-500">
                    <Loader2 size={20} className="animate-spin text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Running Neural Pattern Analysis...</span>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-zinc-300 italic leading-relaxed">
                    "{reconcileReport}"
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleRunReconciler}
                  disabled={reconciling}
                  className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-zinc-800 flex items-center justify-center gap-3"
                >
                  <RefreshCw size={14} className={reconciling ? 'animate-spin' : ''} />
                  <span>{reconciling ? 'Re-analyzing...' : 'Refresh Audit'}</span>
                </button>
                <button 
                  onClick={() => setIsReconcilerOpen(false)}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20"
                >
                  Confirm Audits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualAccounts;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/VirtualAccounts.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Layers, 
  Search, 
  RefreshCw, 
  ArrowUpRight, 
  Building,
  ShieldCheck,
  Plus,
  Trash2,
  ChevronRight,
  MoreVertical,
  X,
  Loader2,
  Terminal,
  Activity,
  Settings2,
  CheckCircle2,
  Cpu,
  AlertCircle
} from 'lucide-react';
import { VirtualAccount } from '../types/index.ts';
import { callGemini } from '../services/geminiService.ts';

const INITIAL_MOCK_VA: VirtualAccount[] = [
  {
    id: 'VA-88021',
    object: 'virtual_account',
    live_mode: true,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-03-31T14:20:00Z',
    name: 'Q1 Sales Collection - UK',
    description: 'Virtual account for routing Sterling sales to main treasury.',
    counterparty_id: 'CP-8801',
    internal_account_id: 'IA-4401',
    account_details: [],
    routing_details: [],
    status: 'ACTIVE'
  },
  {
    id: 'VA-90112',
    object: 'virtual_account',
    live_mode: true,
    created_at: '2024-03-01T09:30:00Z',
    updated_at: '2024-03-31T12:00:00Z',
    name: 'EMEA Vendor Pass-through',
    description: 'Temporary buffer for Eurozone contractor payments.',
    counterparty_id: null,
    internal_account_id: 'IA-9902',
    account_details: [],
    routing_details: [],
    status: 'ACTIVE'
  },
  {
    id: 'VA-11234',
    object: 'virtual_account',
    live_mode: true,
    created_at: '2023-12-10T11:45:00Z',
    updated_at: '2024-03-25T16:00:00Z',
    name: 'Legacy APAC Bridge',
    description: 'Deprecated node being phased out.',
    counterparty_id: 'CP-1105',
    internal_account_id: 'IA-4401',
    account_details: [],
    routing_details: [],
    status: 'PENDING'
  }
];

const VirtualAccounts: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<VirtualAccount[]>(INITIAL_MOCK_VA);
  
  // Modal States
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isReconcilerOpen, setIsReconcilerOpen] = useState(false);
  const [selectedVa, setSelectedVa] = useState<VirtualAccount | null>(null);
  
  // Provisioning State
  const [provisioning, setProvisioning] = useState(false);
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [newVa, setNewVa] = useState({ name: '', description: '', parent: 'IA-4401' });

  // Reconciler State
  const [reconciling, setReconciling] = useState(false);
  const [reconcileReport, setReconcileReport] = useState<string | null>(null);

  const refreshNodes = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleProvision = async () => {
    setProvisionError(null);
    const trimmedName = newVa.name.trim();
    
    // 1. Client-Side Parity Check: Duplicate Names
    if (accounts.some(acc => acc.name.toLowerCase() === trimmedName.toLowerCase())) {
      setProvisionError("Node identity collision: A node with this designation already exists in the virtual mesh.");
      return;
    }

    setProvisioning(true);
    
    try {
      // 2. Artificial neural network handshake simulation
      await new Promise(r => setTimeout(r, 2000));
      
      // 3. Simulated Registry-Level Validation (e.g. invalid parent or system refusal)
      if (trimmedName.toLowerCase() === 'fail') {
        throw new Error("Registry Rejection: Parent Account ID " + newVa.parent + " refused handshake authorization.");
      }

      const node: VirtualAccount = {
        id: `VA-${Math.floor(10000 + Math.random() * 90000)}`,
        object: 'virtual_account',
        live_mode: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: trimmedName || 'Untitled Node',
        description: newVa.description || 'Provisioned via Quantum Foundry',
        counterparty_id: null,
        internal_account_id: newVa.parent,
        account_details: [],
        routing_details: [],
        status: 'ACTIVE'
      };
      
      setAccounts([node, ...accounts]);
      setIsProvisionOpen(false);
      setNewVa({ name: '', description: '', parent: 'IA-4401' });
    } catch (err: any) {
      setProvisionError(err.message || "Protocol Handshake Failure: The global registry node timed out.");
    } finally {
      setProvisioning(false);
    }
  };

  const handleRunReconciler = async () => {
    setReconciling(true);
    setReconcileReport(null);
    try {
      const response = await callGemini(
        'gemini-3-flash-preview',
        "Generate a professional 2-sentence summary for a financial reconciliation process. Mention 99.9% match accuracy and the resolution of 12 incoming virtual node signals across UK and EMEA regions. Tone: Technical and secure."
      );
      // Fix: Access .text helper directly from the SDK response object
      setReconcileReport(response.text);
    } catch (err) {
      setReconcileReport("Neural reconciliation complete. Signal integrity verified at 99.9%. All ledger entries matched with zero drift.");
    } finally {
      setReconciling(false);
    }
  };

  const deleteNode = (id: string) => {
    if (confirm("De-provision node? This will sever all incoming signal routing.")) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  const openProvisionModal = () => {
    setProvisionError(null);
    setIsProvisionOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Virtual <span className="text-blue-500 not-italic">Nodes</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">High-Volume Disbursement & Collection Layer</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={refreshNodes}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Poll Virtual Mesh</span>
          </button>
          <button 
            onClick={openProvisionModal}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
          >
            <Plus size={14} />
            <span>Provision Virtual Account</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {accounts.map(va => (
          <div key={va.id} className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-blue-500/30 transition-all relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layers size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800 text-blue-500 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Network size={32} />
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                  va.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                }`}>
                  {va.status}
                </div>
              </div>

              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2 truncate pr-10">{va.name}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed mb-8 h-12 overflow-hidden line-clamp-2">{va.description}</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  <span>Parent Registry</span>
                  <span className="text-zinc-300 mono">{va.internal_account_id}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  <span>ID Segment</span>
                  <span className="text-zinc-300 mono">{va.id}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  <span>Routing Layer</span>
                  <span className="text-blue-500 mono">FDX_V6_MESH</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <button 
                onClick={() => {
                  setSelectedVa(va);
                  setIsConfigOpen(true);
                }}
                className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-800 flex items-center justify-center gap-2"
              >
                <Settings2 size={14} />
                Config
              </button>
              <button 
                onClick={() => deleteNode(va.id)}
                className="p-4 bg-zinc-900 hover:bg-rose-500/10 text-zinc-600 hover:text-rose-500 rounded-2xl transition-all border border-zinc-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        <button 
          onClick={openProvisionModal}
          className="border-2 border-dashed border-zinc-900 rounded-[3rem] p-10 flex flex-col items-center justify-center group hover:border-zinc-700 transition-all gap-4 bg-black/20"
        >
          <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center text-zinc-800 group-hover:text-blue-500 transition-colors shadow-2xl">
            <Plus size={32} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 group-hover:text-zinc-400">Initialize Node</span>
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-500/5">
              <ShieldCheck size={40} />
            </div>
            <div>
              <h4 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Automated <span className="text-blue-500 not-italic">Reconciliation</span></h4>
              <p className="text-zinc-500 text-xs max-w-lg leading-relaxed font-medium">Lumina Quantum Oracle automatically matches incoming virtual node signals to your internal accounting ledger with 99.9% precision.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsReconcilerOpen(true);
              handleRunReconciler();
            }}
            className="px-10 py-5 bg-white hover:bg-zinc-200 text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-4 shadow-xl"
          >
            <span>View Reconciler</span>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      {/* Provision Modal */}
      {isProvisionOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Network size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Provision <span className="text-blue-500 not-italic">Node</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Initialize Virtual Data Sink</p>
                </div>
              </div>
              <button onClick={() => setIsProvisionOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              {provisionError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={16} className="text-rose-500 shrink-0" />
                  <p className="text-[10px] font-bold text-rose-200 uppercase tracking-tight leading-relaxed">{provisionError}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Node Name</label>
                <input 
                  value={newVa.name}
                  onChange={e => {
                    setProvisionError(null);
                    setNewVa({...newVa, name: e.target.value});
                  }}
                  placeholder="e.g. Q4 Marketing Buffer"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-2xl py-4 px-5 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Parent Account</label>
                <select 
                  value={newVa.parent}
                  onChange={e => {
                    setProvisionError(null);
                    setNewVa({...newVa, parent: e.target.value});
                  }}
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-2xl py-4 px-5 text-white text-sm outline-none transition-all font-bold appearance-none"
                >
                  <option value="IA-4401">IA-4401 (J.P. Morgan)</option>
                  <option value="IA-9902">IA-9902 (Deutsche Bank)</option>
                  <option value="IA-1105">IA-1105 (Custody)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Contextual Description</label>
                <textarea 
                  value={newVa.description}
                  onChange={e => {
                    setProvisionError(null);
                    setNewVa({...newVa, description: e.target.value});
                  }}
                  placeholder="Routing purpose and ledger mapping..."
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-2xl py-4 px-5 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold h-24 resize-none"
                />
              </div>

              <button 
                onClick={handleProvision}
                disabled={provisioning || !newVa.name.trim()}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-900/40 disabled:opacity-50"
              >
                {provisioning ? <Loader2 className="animate-spin" size={20} /> : <ArrowUpRight size={20} />}
                <span>{provisioning ? 'Initializing Handshake...' : 'Establish Virtual Node'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {isConfigOpen && selectedVa && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-blue-500">
                  <Settings2 size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Node <span className="text-blue-500 not-italic">Config</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{selectedVa.id}</p>
                </div>
              </div>
              <button onClick={() => setIsConfigOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="p-6 bg-black rounded-3xl border border-zinc-900 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Signal Status</p>
                  <p className="text-white font-bold text-lg italic uppercase">{selectedVa.status}</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="p-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl border border-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest">
                  Rotate Keys
                </button>
                <button className="p-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl border border-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest">
                  Flush Cache
                </button>
              </div>

              <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
                 <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <Activity size={10} />
                   Network Payload Metadata
                 </p>
                 <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                   Created: {new Date(selectedVa.created_at).toLocaleString()}<br />
                   Routing: FDX_V6_NATIVE_BRIDGE<br />
                   Latency: 12ms avg.
                 </p>
              </div>

              <button 
                onClick={() => setIsConfigOpen(false)}
                className="w-full py-4 bg-zinc-100 hover:bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Close Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reconciler Modal */}
      {isReconcilerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom-6">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Quantum <span className="text-emerald-500 not-italic">Reconciler</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Automated Signal Matching Engine</p>
                </div>
              </div>
              <button onClick={() => setIsReconcilerOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="bg-black border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl h-48 flex flex-col">
                <div className="bg-zinc-900/80 px-6 py-3 border-b border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live Matching Console</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={12} className="text-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-zinc-600">Sync Active</span>
                  </div>
                </div>
                <div className="flex-1 p-6 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-2">
                  <div className="text-zinc-500">[14:22:01] Received signal VA-88021...</div>
                  <div className="text-zinc-500">[14:22:02] Matching against Treasury Operating Account (IA-4401)...</div>
                  <div className="text-emerald-500 font-bold">[14:22:03] MATCH FOUND: 100% confidence. Ledger updated.</div>
                  <div className="text-zinc-500">[14:22:10] Scanning global fabric for adrift payloads...</div>
                </div>
              </div>

              <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] relative group">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Cpu size={80} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">LQI Intelligence Report</h4>
                </div>
                
                {reconciling ? (
                  <div className="flex items-center gap-4 text-zinc-500">
                    <Loader2 size={20} className="animate-spin text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Running Neural Pattern Analysis...</span>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-zinc-300 italic leading-relaxed">
                    "{reconcileReport}"
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleRunReconciler}
                  disabled={reconciling}
                  className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-zinc-800 flex items-center justify-center gap-3"
                >
                  <RefreshCw size={14} className={reconciling ? 'animate-spin' : ''} />
                  <span>{reconciling ? 'Re-analyzing...' : 'Refresh Audit'}</span>
                </button>
                <button 
                  onClick={() => setIsReconcilerOpen(false)}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20"
                >
                  Confirm Audits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualAccounts;
