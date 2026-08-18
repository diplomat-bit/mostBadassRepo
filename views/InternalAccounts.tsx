// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/InternalAccounts.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  RefreshCw, 
  Activity, 
  Search, 
  History, 
  ExternalLink, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Loader2,
  Fingerprint,
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  Terminal,
  CreditCard
} from 'lucide-react';
import { apiClient } from '../services/api.ts';
import { InternalAccount, CustomerProfileResponse } from '../types/index.ts';
import { TableRowSkeleton, Skeleton } from '../components/Skeleton.tsx';

const InternalAccounts: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<InternalAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [newBank, setNewBank] = useState('Wells Fargo');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [activeProfile, setActiveProfile] = useState<CustomerProfileResponse | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const mappedAccounts = await apiClient.getRegistryNodes();
      setAccounts(mappedAccounts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (accountId: string) => {
    setIsProfileOpen(true);
    setFetchingProfile(true);
    setActiveProfile(null);
    try {
      const data = await apiClient.getCustomerProfile(accountId);
      // Brief aesthetic pause for "neural verification"
      await new Promise(r => setTimeout(r, 800));
      setActiveProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingProfile(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Internal <span className="text-blue-500 not-italic">Registry</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Managed Corporate Nodes & Citi-Sync v2.0.0</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchAccounts}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Polling Nodes...' : 'Sync All Balances'}</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30"
          >
            <Building2 size={14} />
            <span>Establish Connection</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex justify-between items-center bg-black/20">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Activity size={20} />
            </div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Real-time Node Status</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              placeholder="Filter Nodes..."
              className="bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-5">Node Identity</th>
                <th className="py-5">Host Institution</th>
                <th className="py-5">Sync Status</th>
                <th className="py-5 text-right">Balance (USD)</th>
                <th className="px-10 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : accounts.map(node => (
                <tr key={node.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
                        {node.productName.toLowerCase().includes('card') ? <CreditCard size={18} /> : <Building2 size={18} />}
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic">{node.productName}</p>
                        <p className="text-[10px] text-zinc-600 font-mono font-bold mt-1 uppercase tracking-tighter">{node.displayAccountNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{node.institutionName}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Ref: {node.connectionId}</p>
                  </td>
                  <td className="py-8">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${
                      node.status === 'ACTIVE' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-zinc-500/5 border-zinc-500/20 text-zinc-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-widest">{node.status}</span>
                    </div>
                  </td>
                  <td className="py-8 text-right">
                    <p className="text-sm font-black text-white mono tracking-tighter">${node.currentBalance.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Available: ${node.availableBalance.toLocaleString()}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleViewProfile(node.id)} className="p-2 text-zinc-500 hover:text-blue-500" title="View Account Profile"><User size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><History size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-blue-500"><ExternalLink size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Fingerprint size={200} className="text-blue-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Identity <span className="text-blue-500 not-italic">Vault</span></h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Compliance Level: FDX v6.0</p>
                  </div>
                </div>
                <button onClick={() => setIsProfileOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors bg-zinc-900 rounded-2xl"><X size={24} /></button>
              </div>

              {fetchingProfile ? (
                <div className="h-[400px] flex flex-col items-center justify-center space-y-8">
                  <Loader2 className="animate-spin text-blue-500" size={48} />
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Requesting Profile Node...</p>
                </div>
              ) : activeProfile ? (
                <div className="space-y-10 animate-in slide-in-from-bottom-6">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={12} className="text-blue-500" />Legal Name Registry</p>
                        <h4 className="text-white font-bold text-lg italic uppercase">{activeProfile.customer.title} {activeProfile.customer.firstName} {activeProfile.customer.lastName}</h4>
                        <p className="text-[9px] text-zinc-500 font-black uppercase mt-1 tracking-widest">{activeProfile.customer.companyName}</p>
                      </div>
                      <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Mail size={12} className="text-blue-500" />Verified Signals</p>
                        {activeProfile.contacts.emails.map((email, i) => (
                          <p key={i} className="text-blue-400 font-mono text-xs mb-1">{email}</p>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="p-8 bg-black border border-zinc-900 rounded-[2.5rem]">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={12} className="text-blue-500" />Geospatial Registry</p>
                        {activeProfile.contacts.addresses.map((addr, i) => (
                          <div key={i} className="space-y-1">
                            <p className="text-white font-bold text-xs uppercase">{addr.addressLine1}</p>
                            <p className="text-zinc-500 text-xs font-medium">{addr.city}, {addr.region} {addr.postalCode}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Terminal size={10} />Node Metadata</p>
                        <p className="text-[9px] text-zinc-600 font-mono leading-relaxed">
                          PROTOCOL: FDX_V6_NATIVE<br />ACTOR: PARTNER_USER<br />TRUST_SCORE: 100/100
                        </p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setIsProfileOpen(false)} className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-zinc-200 shadow-2xl">
                    Seal Identity Node
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalAccounts;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/InternalAccounts.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  RefreshCw, 
  Activity, 
  Search, 
  History, 
  ExternalLink, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Loader2,
  Fingerprint,
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  Terminal,
  CreditCard
} from 'lucide-react';
import { apiClient } from '../services/api.ts';
import { InternalAccount, CustomerProfileResponse } from '../types/index.ts';
import { TableRowSkeleton, Skeleton } from '../components/Skeleton.tsx';

const InternalAccounts: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<InternalAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [newBank, setNewBank] = useState('Wells Fargo');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [activeProfile, setActiveProfile] = useState<CustomerProfileResponse | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const mappedAccounts = await apiClient.getRegistryNodes();
      setAccounts(mappedAccounts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (accountId: string) => {
    setIsProfileOpen(true);
    setFetchingProfile(true);
    setActiveProfile(null);
    try {
      const data = await apiClient.getCustomerProfile(accountId);
      // Brief aesthetic pause for "neural verification"
      await new Promise(r => setTimeout(r, 800));
      setActiveProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingProfile(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Internal <span className="text-blue-500 not-italic">Registry</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Managed Corporate Nodes & Citi-Sync v2.0.0</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchAccounts}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Polling Nodes...' : 'Sync All Balances'}</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30"
          >
            <Building2 size={14} />
            <span>Establish Connection</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex justify-between items-center bg-black/20">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Activity size={20} />
            </div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Real-time Node Status</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              placeholder="Filter Nodes..."
              className="bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-5">Node Identity</th>
                <th className="py-5">Host Institution</th>
                <th className="py-5">Sync Status</th>
                <th className="py-5 text-right">Balance (USD)</th>
                <th className="px-10 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : accounts.map(node => (
                <tr key={node.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
                        {node.productName.toLowerCase().includes('card') ? <CreditCard size={18} /> : <Building2 size={18} />}
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic">{node.productName}</p>
                        <p className="text-[10px] text-zinc-600 font-mono font-bold mt-1 uppercase tracking-tighter">{node.displayAccountNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{node.institutionName}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Ref: {node.connectionId}</p>
                  </td>
                  <td className="py-8">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${
                      node.status === 'ACTIVE' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-zinc-500/5 border-zinc-500/20 text-zinc-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-widest">{node.status}</span>
                    </div>
                  </td>
                  <td className="py-8 text-right">
                    <p className="text-sm font-black text-white mono tracking-tighter">${node.currentBalance.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Available: ${node.availableBalance.toLocaleString()}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleViewProfile(node.id)} className="p-2 text-zinc-500 hover:text-blue-500" title="View Account Profile"><User size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><History size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-blue-500"><ExternalLink size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Fingerprint size={200} className="text-blue-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Identity <span className="text-blue-500 not-italic">Vault</span></h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Compliance Level: FDX v6.0</p>
                  </div>
                </div>
                <button onClick={() => setIsProfileOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors bg-zinc-900 rounded-2xl"><X size={24} /></button>
              </div>

              {fetchingProfile ? (
                <div className="h-[400px] flex flex-col items-center justify-center space-y-8">
                  <Loader2 className="animate-spin text-blue-500" size={48} />
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Requesting Profile Node...</p>
                </div>
              ) : activeProfile ? (
                <div className="space-y-10 animate-in slide-in-from-bottom-6">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={12} className="text-blue-500" />Legal Name Registry</p>
                        <h4 className="text-white font-bold text-lg italic uppercase">{activeProfile.customer.title} {activeProfile.customer.firstName} {activeProfile.customer.lastName}</h4>
                        <p className="text-[9px] text-zinc-500 font-black uppercase mt-1 tracking-widest">{activeProfile.customer.companyName}</p>
                      </div>
                      <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Mail size={12} className="text-blue-500" />Verified Signals</p>
                        {activeProfile.contacts.emails.map((email, i) => (
                          <p key={i} className="text-blue-400 font-mono text-xs mb-1">{email}</p>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="p-8 bg-black border border-zinc-900 rounded-[2.5rem]">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={12} className="text-blue-500" />Geospatial Registry</p>
                        {activeProfile.contacts.addresses.map((addr, i) => (
                          <div key={i} className="space-y-1">
                            <p className="text-white font-bold text-xs uppercase">{addr.addressLine1}</p>
                            <p className="text-zinc-500 text-xs font-medium">{addr.city}, {addr.region} {addr.postalCode}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Terminal size={10} />Node Metadata</p>
                        <p className="text-[9px] text-zinc-600 font-mono leading-relaxed">
                          PROTOCOL: FDX_V6_NATIVE<br />ACTOR: PARTNER_USER<br />TRUST_SCORE: 100/100
                        </p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setIsProfileOpen(false)} className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-zinc-200 shadow-2xl">
                    Seal Identity Node
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalAccounts;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/InternalAccounts.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  RefreshCw, 
  Activity, 
  Search, 
  History, 
  ExternalLink, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Loader2,
  Fingerprint,
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  Terminal,
  CreditCard
} from 'lucide-react';
import { apiClient } from '../services/api.ts';
import { InternalAccount, CustomerProfileResponse } from '../types/index.ts';
import { TableRowSkeleton, Skeleton } from '../components/Skeleton.tsx';

const InternalAccounts: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<InternalAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [newBank, setNewBank] = useState('Wells Fargo');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [activeProfile, setActiveProfile] = useState<CustomerProfileResponse | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const mappedAccounts = await apiClient.getRegistryNodes();
      setAccounts(mappedAccounts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (accountId: string) => {
    setIsProfileOpen(true);
    setFetchingProfile(true);
    setActiveProfile(null);
    try {
      const data = await apiClient.getCustomerProfile(accountId);
      // Brief aesthetic pause for "neural verification"
      await new Promise(r => setTimeout(r, 800));
      setActiveProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingProfile(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Internal <span className="text-blue-500 not-italic">Registry</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Managed Corporate Nodes & Citi-Sync v2.0.0</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchAccounts}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Polling Nodes...' : 'Sync All Balances'}</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30"
          >
            <Building2 size={14} />
            <span>Establish Connection</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex justify-between items-center bg-black/20">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Activity size={20} />
            </div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Real-time Node Status</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              placeholder="Filter Nodes..."
              className="bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-5">Node Identity</th>
                <th className="py-5">Host Institution</th>
                <th className="py-5">Sync Status</th>
                <th className="py-5 text-right">Balance (USD)</th>
                <th className="px-10 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : accounts.map(node => (
                <tr key={node.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
                        {node.productName.toLowerCase().includes('card') ? <CreditCard size={18} /> : <Building2 size={18} />}
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic">{node.productName}</p>
                        <p className="text-[10px] text-zinc-600 font-mono font-bold mt-1 uppercase tracking-tighter">{node.displayAccountNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{node.institutionName}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Ref: {node.connectionId}</p>
                  </td>
                  <td className="py-8">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${
                      node.status === 'ACTIVE' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-zinc-500/5 border-zinc-500/20 text-zinc-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-widest">{node.status}</span>
                    </div>
                  </td>
                  <td className="py-8 text-right">
                    <p className="text-sm font-black text-white mono tracking-tighter">${node.currentBalance.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Available: ${node.availableBalance.toLocaleString()}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleViewProfile(node.id)} className="p-2 text-zinc-500 hover:text-blue-500" title="View Account Profile"><User size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><History size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-blue-500"><ExternalLink size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Fingerprint size={200} className="text-blue-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Identity <span className="text-blue-500 not-italic">Vault</span></h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Compliance Level: FDX v6.0</p>
                  </div>
                </div>
                <button onClick={() => setIsProfileOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors bg-zinc-900 rounded-2xl"><X size={24} /></button>
              </div>

              {fetchingProfile ? (
                <div className="h-[400px] flex flex-col items-center justify-center space-y-8">
                  <Loader2 className="animate-spin text-blue-500" size={48} />
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Requesting Profile Node...</p>
                </div>
              ) : activeProfile ? (
                <div className="space-y-10 animate-in slide-in-from-bottom-6">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={12} className="text-blue-500" />Legal Name Registry</p>
                        <h4 className="text-white font-bold text-lg italic uppercase">{activeProfile.customer.title} {activeProfile.customer.firstName} {activeProfile.customer.lastName}</h4>
                        <p className="text-[9px] text-zinc-500 font-black uppercase mt-1 tracking-widest">{activeProfile.customer.companyName}</p>
                      </div>
                      <div className="p-6 bg-black border border-zinc-900 rounded-3xl">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Mail size={12} className="text-blue-500" />Verified Signals</p>
                        {activeProfile.contacts.emails.map((email, i) => (
                          <p key={i} className="text-blue-400 font-mono text-xs mb-1">{email}</p>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="p-8 bg-black border border-zinc-900 rounded-[2.5rem]">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={12} className="text-blue-500" />Geospatial Registry</p>
                        {activeProfile.contacts.addresses.map((addr, i) => (
                          <div key={i} className="space-y-1">
                            <p className="text-white font-bold text-xs uppercase">{addr.addressLine1}</p>
                            <p className="text-zinc-500 text-xs font-medium">{addr.city}, {addr.region} {addr.postalCode}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Terminal size={10} />Node Metadata</p>
                        <p className="text-[9px] text-zinc-600 font-mono leading-relaxed">
                          PROTOCOL: FDX_V6_NATIVE<br />ACTOR: PARTNER_USER<br />TRUST_SCORE: 100/100
                        </p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setIsProfileOpen(false)} className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-zinc-200 shadow-2xl">
                    Seal Identity Node
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalAccounts;
