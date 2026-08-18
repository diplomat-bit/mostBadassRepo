// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Connectivity.tsx
================================================================================


import React, { useState } from 'react';
import { 
  Activity, 
  RefreshCw, 
  Terminal, 
  ShieldCheck, 
  AlertCircle,
  Database,
  Link2,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { Connection } from '../types/index.ts';

const MOCK_CONNS: Connection[] = [
  { id: 'CON-101', vendorCustomerId: 'CUST-A992', entity: 'JPM_USA', status: 'CONNECTED', lastSyncedAt: '2024-03-31T12:00:00Z' },
  { id: 'CON-102', vendorCustomerId: 'CUST-D102', entity: 'DB_EURO', status: 'CONNECTED', lastSyncedAt: '2024-03-31T11:55:00Z' },
  { id: 'CON-103', vendorCustomerId: 'CUST-L551', entity: 'LUMINA_INTERNAL', status: 'ERROR', lastSyncedAt: '2024-03-30T22:00:00Z' },
];

const Connectivity: React.FC = () => {
  const [conns, setConns] = useState<Connection[]>(MOCK_CONNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [newVendor, setNewVendor] = useState({ entity: 'STRIPE_GLOBAL', id: 'CUST-X' });

  const handleProvision = () => {
    setProvisioning(true);
    setTimeout(() => {
      const newConn: Connection = {
        id: `CON-${Math.floor(200 + Math.random() * 800)}`,
        vendorCustomerId: newVendor.id,
        entity: newVendor.entity,
        status: 'CONNECTED',
        lastSyncedAt: new Date().toISOString()
      };
      setConns([newConn, ...conns]);
      setProvisioning(false);
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">System <span className="text-blue-500 not-italic">Fabric</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Machine-to-Machine Integration Node Monitoring</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
        >
          <Link2 size={18} />
          <span>Provision New Vendor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {conns.map(conn => (
          <div key={conn.id} className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 relative overflow-hidden group hover:border-zinc-700 transition-all shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Database size={100} />
            </div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`p-4 rounded-2xl ${conn.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {conn.status === 'CONNECTED' ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                <p className={`text-xs font-black uppercase tracking-widest ${conn.status === 'CONNECTED' ? 'text-emerald-500' : 'text-rose-500'}`}>{conn.status}</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-1">{conn.entity}</h4>
                <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Vendor ID: {conn.vendorCustomerId}</p>
              </div>
              <div className="h-px bg-zinc-900"></div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                <span>Handshake ID</span>
                <span className="text-zinc-400 mono">{conn.id}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-900 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Last Sync: {new Date(conn.lastSyncedAt).toLocaleTimeString()}</span>
               <button className="text-zinc-500 hover:text-white"><MoreVertical size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center border border-blue-500/20">
                     <Link2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Vendor <span className="text-blue-500 not-italic">Handshake</span></h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Fabric Extension Module</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24}/></button>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Vendor Provider</label>
                    <input 
                      value={newVendor.entity}
                      onChange={e => setNewVendor({...newVendor, entity: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:border-blue-500 transition-all font-bold uppercase tracking-widest"
                      placeholder="e.g. STRIPE_US"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Corporate Client ID</label>
                    <input 
                      value={newVendor.id}
                      onChange={e => setNewVendor({...newVendor, id: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:border-blue-500 transition-all font-mono"
                      placeholder="CUST-..."
                    />
                  </div>
               </div>

               <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
                  <p className="text-[10px] font-black text-zinc-500 leading-relaxed uppercase tracking-widest">Establishing a secure tunnel via RSA-OAEP. Metadata persistence will be shredded post-handshake.</p>
               </div>

               <button 
                onClick={handleProvision}
                disabled={provisioning}
                className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4"
               >
                 {provisioning ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                 {provisioning ? 'FORGING FABRIC...' : 'INITIALIZE Integration'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connectivity;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Connectivity.tsx
================================================================================


import React, { useState } from 'react';
import { 
  Activity, 
  RefreshCw, 
  Terminal, 
  ShieldCheck, 
  AlertCircle,
  Database,
  Link2,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { Connection } from '../types/index.ts';

const MOCK_CONNS: Connection[] = [
  { id: 'CON-101', vendorCustomerId: 'CUST-A992', entity: 'JPM_USA', status: 'CONNECTED', lastSyncedAt: '2024-03-31T12:00:00Z' },
  { id: 'CON-102', vendorCustomerId: 'CUST-D102', entity: 'DB_EURO', status: 'CONNECTED', lastSyncedAt: '2024-03-31T11:55:00Z' },
  { id: 'CON-103', vendorCustomerId: 'CUST-L551', entity: 'LUMINA_INTERNAL', status: 'ERROR', lastSyncedAt: '2024-03-30T22:00:00Z' },
];

const Connectivity: React.FC = () => {
  const [conns, setConns] = useState<Connection[]>(MOCK_CONNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [newVendor, setNewVendor] = useState({ entity: 'STRIPE_GLOBAL', id: 'CUST-X' });

  const handleProvision = () => {
    setProvisioning(true);
    setTimeout(() => {
      const newConn: Connection = {
        id: `CON-${Math.floor(200 + Math.random() * 800)}`,
        vendorCustomerId: newVendor.id,
        entity: newVendor.entity,
        status: 'CONNECTED',
        lastSyncedAt: new Date().toISOString()
      };
      setConns([newConn, ...conns]);
      setProvisioning(false);
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">System <span className="text-blue-500 not-italic">Fabric</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Machine-to-Machine Integration Node Monitoring</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
        >
          <Link2 size={18} />
          <span>Provision New Vendor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {conns.map(conn => (
          <div key={conn.id} className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 relative overflow-hidden group hover:border-zinc-700 transition-all shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Database size={100} />
            </div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`p-4 rounded-2xl ${conn.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {conn.status === 'CONNECTED' ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                <p className={`text-xs font-black uppercase tracking-widest ${conn.status === 'CONNECTED' ? 'text-emerald-500' : 'text-rose-500'}`}>{conn.status}</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-1">{conn.entity}</h4>
                <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Vendor ID: {conn.vendorCustomerId}</p>
              </div>
              <div className="h-px bg-zinc-900"></div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                <span>Handshake ID</span>
                <span className="text-zinc-400 mono">{conn.id}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-900 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Last Sync: {new Date(conn.lastSyncedAt).toLocaleTimeString()}</span>
               <button className="text-zinc-500 hover:text-white"><MoreVertical size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center border border-blue-500/20">
                     <Link2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Vendor <span className="text-blue-500 not-italic">Handshake</span></h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Fabric Extension Module</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24}/></button>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Vendor Provider</label>
                    <input 
                      value={newVendor.entity}
                      onChange={e => setNewVendor({...newVendor, entity: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:border-blue-500 transition-all font-bold uppercase tracking-widest"
                      placeholder="e.g. STRIPE_US"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Corporate Client ID</label>
                    <input 
                      value={newVendor.id}
                      onChange={e => setNewVendor({...newVendor, id: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:border-blue-500 transition-all font-mono"
                      placeholder="CUST-..."
                    />
                  </div>
               </div>

               <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
                  <p className="text-[10px] font-black text-zinc-500 leading-relaxed uppercase tracking-widest">Establishing a secure tunnel via RSA-OAEP. Metadata persistence will be shredded post-handshake.</p>
               </div>

               <button 
                onClick={handleProvision}
                disabled={provisioning}
                className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4"
               >
                 {provisioning ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                 {provisioning ? 'FORGING FABRIC...' : 'INITIALIZE Integration'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connectivity;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Connectivity.tsx
================================================================================


import React, { useState } from 'react';
import { 
  Activity, 
  RefreshCw, 
  Terminal, 
  ShieldCheck, 
  AlertCircle,
  Database,
  Link2,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { Connection } from '../types/index.ts';

const MOCK_CONNS: Connection[] = [
  { id: 'CON-101', vendorCustomerId: 'CUST-A992', entity: 'JPM_USA', status: 'CONNECTED', lastSyncedAt: '2024-03-31T12:00:00Z' },
  { id: 'CON-102', vendorCustomerId: 'CUST-D102', entity: 'DB_EURO', status: 'CONNECTED', lastSyncedAt: '2024-03-31T11:55:00Z' },
  { id: 'CON-103', vendorCustomerId: 'CUST-L551', entity: 'LUMINA_INTERNAL', status: 'ERROR', lastSyncedAt: '2024-03-30T22:00:00Z' },
];

const Connectivity: React.FC = () => {
  const [conns, setConns] = useState<Connection[]>(MOCK_CONNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [newVendor, setNewVendor] = useState({ entity: 'STRIPE_GLOBAL', id: 'CUST-X' });

  const handleProvision = () => {
    setProvisioning(true);
    setTimeout(() => {
      const newConn: Connection = {
        id: `CON-${Math.floor(200 + Math.random() * 800)}`,
        vendorCustomerId: newVendor.id,
        entity: newVendor.entity,
        status: 'CONNECTED',
        lastSyncedAt: new Date().toISOString()
      };
      setConns([newConn, ...conns]);
      setProvisioning(false);
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">System <span className="text-blue-500 not-italic">Fabric</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Machine-to-Machine Integration Node Monitoring</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
        >
          <Link2 size={18} />
          <span>Provision New Vendor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {conns.map(conn => (
          <div key={conn.id} className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 relative overflow-hidden group hover:border-zinc-700 transition-all shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Database size={100} />
            </div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`p-4 rounded-2xl ${conn.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {conn.status === 'CONNECTED' ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                <p className={`text-xs font-black uppercase tracking-widest ${conn.status === 'CONNECTED' ? 'text-emerald-500' : 'text-rose-500'}`}>{conn.status}</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-1">{conn.entity}</h4>
                <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Vendor ID: {conn.vendorCustomerId}</p>
              </div>
              <div className="h-px bg-zinc-900"></div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                <span>Handshake ID</span>
                <span className="text-zinc-400 mono">{conn.id}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-900 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Last Sync: {new Date(conn.lastSyncedAt).toLocaleTimeString()}</span>
               <button className="text-zinc-500 hover:text-white"><MoreVertical size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center border border-blue-500/20">
                     <Link2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Vendor <span className="text-blue-500 not-italic">Handshake</span></h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Fabric Extension Module</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24}/></button>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Vendor Provider</label>
                    <input 
                      value={newVendor.entity}
                      onChange={e => setNewVendor({...newVendor, entity: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:border-blue-500 transition-all font-bold uppercase tracking-widest"
                      placeholder="e.g. STRIPE_US"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Corporate Client ID</label>
                    <input 
                      value={newVendor.id}
                      onChange={e => setNewVendor({...newVendor, id: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:border-blue-500 transition-all font-mono"
                      placeholder="CUST-..."
                    />
                  </div>
               </div>

               <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
                  <p className="text-[10px] font-black text-zinc-500 leading-relaxed uppercase tracking-widest">Establishing a secure tunnel via RSA-OAEP. Metadata persistence will be shredded post-handshake.</p>
               </div>

               <button 
                onClick={handleProvision}
                disabled={provisioning}
                className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4"
               >
                 {provisioning ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                 {provisioning ? 'FORGING FABRIC...' : 'INITIALIZE Integration'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connectivity;
