// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/DCRManagement.tsx
================================================================================


import React, { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  Shield, 
  Plus, 
  RefreshCw, 
  Trash2, 
  ChevronRight, 
  Fingerprint, 
  Terminal, 
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Code
} from 'lucide-react';
import { ClientRegisterRequest, ClientRegisterResponse } from '../types/index.ts';

const MOCK_INITIAL_CLIENTS: ClientRegisterResponse[] = [
  {
    client_id: 'CLI-A192J-B002',
    client_secret: 'SEC-K992-XXXX-Z102',
    appId: 'LUMINA_CORE_NODE',
    client_name: 'Lumina Primary Ledger',
    clientDisplayName: 'Quantum Master Node',
    redirect_uris: ['https://lumina.app/auth/callback'],
    scope: ['accounts_details_transactions', 'customers_profiles'],
    description: 'The main corporate ledger application for treasury management.',
    token_endpoint_auth_method: 'client_secret_post'
  }
];

const SCOPES = [
  'accounts_details_transactions',
  'accounts_routing_number',
  'customers_profiles',
  'accounts_statements',
  'accounts_tax_statements'
];

const DCRManagement: React.FC = () => {
  const [clients, setClients] = useState<ClientRegisterResponse[]>(MOCK_INITIAL_CLIENTS);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientRegisterResponse | null>(null);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(['System: DCR Interface Initialized. Waiting for input...']);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<ClientRegisterRequest>({
    client_name: '',
    redirect_uris: [''],
    scope: [],
    description: '',
    appId: ''
  });

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    addLog(`POST /api/dcr/v1/register - payload: ${JSON.stringify(form)}`);
    
    setTimeout(() => {
      const newClient: ClientRegisterResponse = {
        ...form,
        client_id: `CLI-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        client_secret: `SEC-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        grant_types: ['authorization_code', 'refresh_token'],
        token_endpoint_auth_method: 'client_secret_post'
      };
      
      setClients([...clients, newClient]);
      setIsRegistering(false);
      addLog(`HTTP/1.1 201 Created - New Client ID: ${newClient.client_id}`);
    }, 1200);
  };

  const handleUpdate = (clientId: string) => {
    addLog(`PUT /api/dcr/v1/register/${clientId} - Requesting metadata refresh...`);
    setTimeout(() => {
      addLog(`HTTP/1.1 200 OK - Metadata synchronized for ${clientId}`);
    }, 800);
  };

  const handleRevoke = (clientId: string) => {
    if (!confirm(`Confirm revocation of ${clientId}? This cannot be undone.`)) return;
    addLog(`DELETE /api/dcr/v1/register/${clientId} - Initiating revocation...`);
    setTimeout(() => {
      setClients(clients.filter(c => c.client_id !== clientId));
      if (selectedClient?.client_id === clientId) setSelectedClient(null);
      addLog(`HTTP/1.1 204 No Content - Registration ${clientId} purged from vault.`);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Key className="text-blue-500" />
            Dynamic Client Registry
          </h2>
          <p className="text-zinc-500 font-medium">Manage 4th party Data Recipients via FDX-standard DCR flows.</p>
        </div>
        <button 
          onClick={() => {
            setIsRegistering(true);
            setSelectedClient(null);
            setForm({
              client_name: '',
              redirect_uris: [''],
              scope: [],
              description: '',
              appId: ''
            });
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/30"
        >
          <Plus size={18} />
          <span>New Registration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
          {clients.map(client => (
            <button 
              key={client.client_id}
              onClick={() => {
                setSelectedClient(client);
                setIsRegistering(false);
              }}
              className={`w-full text-left p-6 rounded-3xl border transition-all group ${
                selectedClient?.client_id === client.client_id 
                  ? 'bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-900/10' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${selectedClient?.client_id === client.client_id ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:text-blue-400'}`}>
                  <Fingerprint size={20} />
                </div>
                <div className="flex space-x-2">
                  <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
              <h4 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">{client.client_name}</h4>
              <p className="text-zinc-500 text-xs mono tracking-tight mb-4">{client.client_id}</p>
              <div className="flex items-center gap-4 text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Shield size={12} />
                  <span className="text-[10px] font-bold uppercase">{client.scope.length} Scopes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ExternalLink size={12} />
                  <span className="text-[10px] font-bold uppercase">1 URI</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-8">
          {isRegistering ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 animate-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-3">
                <Plus className="text-blue-500" />
                Register New Recipient
              </h3>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">App ID (optional)</label>
                    <input 
                      value={form.appId}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                      placeholder="e.g. CORE_NODE_01"
                      onChange={e => setForm({...form, appId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Client Name</label>
                    <input 
                      required
                      value={form.client_name}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                      placeholder="Legal Recipient Name"
                      onChange={e => setForm({...form, client_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    value={form.description}
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all h-24 resize-none"
                    placeholder="Brief overview of the recipient's purpose..."
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Execute Registration</button>
                  <button type="button" onClick={() => setIsRegistering(false)} className="px-8 py-4 bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Cancel</button>
                </div>
              </form>
            </div>
          ) : selectedClient ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 animate-in zoom-in-95 duration-300">
               <div className="flex justify-between items-start mb-10 pb-10 border-b border-zinc-800">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center">
                    <Shield size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedClient.client_name}</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Metadata Identity Record</p>
                  </div>
                </div>
                <button onClick={() => handleRevoke(selectedClient.client_id)} className="p-3 text-zinc-500 hover:text-rose-500 transition-colors bg-zinc-800 rounded-xl">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-600 tracking-widest mb-2">OAuth 2.0 Client Identifier</p>
                  <div className="bg-black border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group">
                    <span className="text-white font-mono text-sm">{selectedClient.client_id}</span>
                    <Code size={16} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-600 tracking-widest mb-2">Sync Status</p>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-white font-black text-xs uppercase">Handshake Parity</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-zinc-950/50 border-2 border-dashed border-zinc-900 rounded-[40px] text-center p-20">
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                <Fingerprint size={48} className="text-zinc-800" />
              </div>
              <h3 className="text-xl font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2">Registry Offline</h3>
              <p className="text-zinc-700 text-sm max-w-xs font-medium">Select a recipient node or provision a new registration to view metadata.</p>
            </div>
          )}
          <div className="bg-black border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl h-64 flex flex-col">
            <div className="bg-zinc-900/80 px-6 py-3 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">DCR Node Trace Log</span>
              </div>
            </div>
            <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-zinc-600">{log}</div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DCRManagement;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/DCRManagement.tsx
================================================================================


import React, { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  Shield, 
  Plus, 
  RefreshCw, 
  Trash2, 
  ChevronRight, 
  Fingerprint, 
  Terminal, 
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Code
} from 'lucide-react';
import { ClientRegisterRequest, ClientRegisterResponse } from '../types/index.ts';

const MOCK_INITIAL_CLIENTS: ClientRegisterResponse[] = [
  {
    client_id: 'CLI-A192J-B002',
    client_secret: 'SEC-K992-XXXX-Z102',
    appId: 'LUMINA_CORE_NODE',
    client_name: 'Lumina Primary Ledger',
    clientDisplayName: 'Quantum Master Node',
    redirect_uris: ['https://lumina.app/auth/callback'],
    scope: ['accounts_details_transactions', 'customers_profiles'],
    description: 'The main corporate ledger application for treasury management.',
    token_endpoint_auth_method: 'client_secret_post'
  }
];

const SCOPES = [
  'accounts_details_transactions',
  'accounts_routing_number',
  'customers_profiles',
  'accounts_statements',
  'accounts_tax_statements'
];

const DCRManagement: React.FC = () => {
  const [clients, setClients] = useState<ClientRegisterResponse[]>(MOCK_INITIAL_CLIENTS);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientRegisterResponse | null>(null);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(['System: DCR Interface Initialized. Waiting for input...']);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<ClientRegisterRequest>({
    client_name: '',
    redirect_uris: [''],
    scope: [],
    description: '',
    appId: ''
  });

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    addLog(`POST /api/dcr/v1/register - payload: ${JSON.stringify(form)}`);
    
    setTimeout(() => {
      const newClient: ClientRegisterResponse = {
        ...form,
        client_id: `CLI-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        client_secret: `SEC-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        grant_types: ['authorization_code', 'refresh_token'],
        token_endpoint_auth_method: 'client_secret_post'
      };
      
      setClients([...clients, newClient]);
      setIsRegistering(false);
      addLog(`HTTP/1.1 201 Created - New Client ID: ${newClient.client_id}`);
    }, 1200);
  };

  const handleUpdate = (clientId: string) => {
    addLog(`PUT /api/dcr/v1/register/${clientId} - Requesting metadata refresh...`);
    setTimeout(() => {
      addLog(`HTTP/1.1 200 OK - Metadata synchronized for ${clientId}`);
    }, 800);
  };

  const handleRevoke = (clientId: string) => {
    if (!confirm(`Confirm revocation of ${clientId}? This cannot be undone.`)) return;
    addLog(`DELETE /api/dcr/v1/register/${clientId} - Initiating revocation...`);
    setTimeout(() => {
      setClients(clients.filter(c => c.client_id !== clientId));
      if (selectedClient?.client_id === clientId) setSelectedClient(null);
      addLog(`HTTP/1.1 204 No Content - Registration ${clientId} purged from vault.`);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Key className="text-blue-500" />
            Dynamic Client Registry
          </h2>
          <p className="text-zinc-500 font-medium">Manage 4th party Data Recipients via FDX-standard DCR flows.</p>
        </div>
        <button 
          onClick={() => {
            setIsRegistering(true);
            setSelectedClient(null);
            setForm({
              client_name: '',
              redirect_uris: [''],
              scope: [],
              description: '',
              appId: ''
            });
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/30"
        >
          <Plus size={18} />
          <span>New Registration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
          {clients.map(client => (
            <button 
              key={client.client_id}
              onClick={() => {
                setSelectedClient(client);
                setIsRegistering(false);
              }}
              className={`w-full text-left p-6 rounded-3xl border transition-all group ${
                selectedClient?.client_id === client.client_id 
                  ? 'bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-900/10' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${selectedClient?.client_id === client.client_id ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:text-blue-400'}`}>
                  <Fingerprint size={20} />
                </div>
                <div className="flex space-x-2">
                  <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
              <h4 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">{client.client_name}</h4>
              <p className="text-zinc-500 text-xs mono tracking-tight mb-4">{client.client_id}</p>
              <div className="flex items-center gap-4 text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Shield size={12} />
                  <span className="text-[10px] font-bold uppercase">{client.scope.length} Scopes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ExternalLink size={12} />
                  <span className="text-[10px] font-bold uppercase">1 URI</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-8">
          {isRegistering ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 animate-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-3">
                <Plus className="text-blue-500" />
                Register New Recipient
              </h3>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">App ID (optional)</label>
                    <input 
                      value={form.appId}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                      placeholder="e.g. CORE_NODE_01"
                      onChange={e => setForm({...form, appId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Client Name</label>
                    <input 
                      required
                      value={form.client_name}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                      placeholder="Legal Recipient Name"
                      onChange={e => setForm({...form, client_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    value={form.description}
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all h-24 resize-none"
                    placeholder="Brief overview of the recipient's purpose..."
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Execute Registration</button>
                  <button type="button" onClick={() => setIsRegistering(false)} className="px-8 py-4 bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Cancel</button>
                </div>
              </form>
            </div>
          ) : selectedClient ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 animate-in zoom-in-95 duration-300">
               <div className="flex justify-between items-start mb-10 pb-10 border-b border-zinc-800">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center">
                    <Shield size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedClient.client_name}</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Metadata Identity Record</p>
                  </div>
                </div>
                <button onClick={() => handleRevoke(selectedClient.client_id)} className="p-3 text-zinc-500 hover:text-rose-500 transition-colors bg-zinc-800 rounded-xl">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-600 tracking-widest mb-2">OAuth 2.0 Client Identifier</p>
                  <div className="bg-black border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group">
                    <span className="text-white font-mono text-sm">{selectedClient.client_id}</span>
                    <Code size={16} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-600 tracking-widest mb-2">Sync Status</p>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-white font-black text-xs uppercase">Handshake Parity</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-zinc-950/50 border-2 border-dashed border-zinc-900 rounded-[40px] text-center p-20">
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                <Fingerprint size={48} className="text-zinc-800" />
              </div>
              <h3 className="text-xl font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2">Registry Offline</h3>
              <p className="text-zinc-700 text-sm max-w-xs font-medium">Select a recipient node or provision a new registration to view metadata.</p>
            </div>
          )}
          <div className="bg-black border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl h-64 flex flex-col">
            <div className="bg-zinc-900/80 px-6 py-3 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">DCR Node Trace Log</span>
              </div>
            </div>
            <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-zinc-600">{log}</div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DCRManagement;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/DCRManagement.tsx
================================================================================


import React, { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  Shield, 
  Plus, 
  RefreshCw, 
  Trash2, 
  ChevronRight, 
  Fingerprint, 
  Terminal, 
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Code
} from 'lucide-react';
import { ClientRegisterRequest, ClientRegisterResponse } from '../types/index.ts';

const MOCK_INITIAL_CLIENTS: ClientRegisterResponse[] = [
  {
    client_id: 'CLI-A192J-B002',
    client_secret: 'SEC-K992-XXXX-Z102',
    appId: 'LUMINA_CORE_NODE',
    client_name: 'Lumina Primary Ledger',
    clientDisplayName: 'Quantum Master Node',
    redirect_uris: ['https://lumina.app/auth/callback'],
    scope: ['accounts_details_transactions', 'customers_profiles'],
    description: 'The main corporate ledger application for treasury management.',
    token_endpoint_auth_method: 'client_secret_post'
  }
];

const SCOPES = [
  'accounts_details_transactions',
  'accounts_routing_number',
  'customers_profiles',
  'accounts_statements',
  'accounts_tax_statements'
];

const DCRManagement: React.FC = () => {
  const [clients, setClients] = useState<ClientRegisterResponse[]>(MOCK_INITIAL_CLIENTS);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientRegisterResponse | null>(null);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(['System: DCR Interface Initialized. Waiting for input...']);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<ClientRegisterRequest>({
    client_name: '',
    redirect_uris: [''],
    scope: [],
    description: '',
    appId: ''
  });

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    addLog(`POST /api/dcr/v1/register - payload: ${JSON.stringify(form)}`);
    
    setTimeout(() => {
      const newClient: ClientRegisterResponse = {
        ...form,
        client_id: `CLI-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        client_secret: `SEC-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        grant_types: ['authorization_code', 'refresh_token'],
        token_endpoint_auth_method: 'client_secret_post'
      };
      
      setClients([...clients, newClient]);
      setIsRegistering(false);
      addLog(`HTTP/1.1 201 Created - New Client ID: ${newClient.client_id}`);
    }, 1200);
  };

  const handleUpdate = (clientId: string) => {
    addLog(`PUT /api/dcr/v1/register/${clientId} - Requesting metadata refresh...`);
    setTimeout(() => {
      addLog(`HTTP/1.1 200 OK - Metadata synchronized for ${clientId}`);
    }, 800);
  };

  const handleRevoke = (clientId: string) => {
    if (!confirm(`Confirm revocation of ${clientId}? This cannot be undone.`)) return;
    addLog(`DELETE /api/dcr/v1/register/${clientId} - Initiating revocation...`);
    setTimeout(() => {
      setClients(clients.filter(c => c.client_id !== clientId));
      if (selectedClient?.client_id === clientId) setSelectedClient(null);
      addLog(`HTTP/1.1 204 No Content - Registration ${clientId} purged from vault.`);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Key className="text-blue-500" />
            Dynamic Client Registry
          </h2>
          <p className="text-zinc-500 font-medium">Manage 4th party Data Recipients via FDX-standard DCR flows.</p>
        </div>
        <button 
          onClick={() => {
            setIsRegistering(true);
            setSelectedClient(null);
            setForm({
              client_name: '',
              redirect_uris: [''],
              scope: [],
              description: '',
              appId: ''
            });
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/30"
        >
          <Plus size={18} />
          <span>New Registration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
          {clients.map(client => (
            <button 
              key={client.client_id}
              onClick={() => {
                setSelectedClient(client);
                setIsRegistering(false);
              }}
              className={`w-full text-left p-6 rounded-3xl border transition-all group ${
                selectedClient?.client_id === client.client_id 
                  ? 'bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-900/10' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${selectedClient?.client_id === client.client_id ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:text-blue-400'}`}>
                  <Fingerprint size={20} />
                </div>
                <div className="flex space-x-2">
                  <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
              <h4 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">{client.client_name}</h4>
              <p className="text-zinc-500 text-xs mono tracking-tight mb-4">{client.client_id}</p>
              <div className="flex items-center gap-4 text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Shield size={12} />
                  <span className="text-[10px] font-bold uppercase">{client.scope.length} Scopes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ExternalLink size={12} />
                  <span className="text-[10px] font-bold uppercase">1 URI</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-8">
          {isRegistering ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 animate-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-3">
                <Plus className="text-blue-500" />
                Register New Recipient
              </h3>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">App ID (optional)</label>
                    <input 
                      value={form.appId}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                      placeholder="e.g. CORE_NODE_01"
                      onChange={e => setForm({...form, appId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Client Name</label>
                    <input 
                      required
                      value={form.client_name}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                      placeholder="Legal Recipient Name"
                      onChange={e => setForm({...form, client_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    value={form.description}
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all h-24 resize-none"
                    placeholder="Brief overview of the recipient's purpose..."
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Execute Registration</button>
                  <button type="button" onClick={() => setIsRegistering(false)} className="px-8 py-4 bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Cancel</button>
                </div>
              </form>
            </div>
          ) : selectedClient ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 animate-in zoom-in-95 duration-300">
               <div className="flex justify-between items-start mb-10 pb-10 border-b border-zinc-800">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center">
                    <Shield size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedClient.client_name}</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Metadata Identity Record</p>
                  </div>
                </div>
                <button onClick={() => handleRevoke(selectedClient.client_id)} className="p-3 text-zinc-500 hover:text-rose-500 transition-colors bg-zinc-800 rounded-xl">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-600 tracking-widest mb-2">OAuth 2.0 Client Identifier</p>
                  <div className="bg-black border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group">
                    <span className="text-white font-mono text-sm">{selectedClient.client_id}</span>
                    <Code size={16} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-600 tracking-widest mb-2">Sync Status</p>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-white font-black text-xs uppercase">Handshake Parity</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-zinc-950/50 border-2 border-dashed border-zinc-900 rounded-[40px] text-center p-20">
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                <Fingerprint size={48} className="text-zinc-800" />
              </div>
              <h3 className="text-xl font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2">Registry Offline</h3>
              <p className="text-zinc-700 text-sm max-w-xs font-medium">Select a recipient node or provision a new registration to view metadata.</p>
            </div>
          )}
          <div className="bg-black border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl h-64 flex flex-col">
            <div className="bg-zinc-900/80 px-6 py-3 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">DCR Node Trace Log</span>
              </div>
            </div>
            <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-zinc-600">{log}</div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DCRManagement;
