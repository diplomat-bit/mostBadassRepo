// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Payments.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Building2, 
  ShieldCheck, 
  Loader2, 
  ArrowDownLeft, 
  ArrowUpRight,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { apiClient } from '../services/api';
import { CitiTransaction, InternalAccount } from '../types/index';

const Payments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registry' | 'history'>('registry');
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<InternalAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<CitiTransaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  const fetchRegistry = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getRegistryDetails();
      const mapped: InternalAccount[] = data.accountGroupDetails.flatMap(group => {
        const list: InternalAccount[] = [];
        if (group.checkingAccountsDetails) {
          group.checkingAccountsDetails.forEach(acc => list.push({
            id: acc.accountId,
            productName: acc.productName,
            displayAccountNumber: acc.displayAccountNumber,
            currency: acc.currencyCode,
            status: acc.accountStatus,
            currentBalance: acc.currentBalance,
            availableBalance: acc.availableBalance,
            institutionName: 'Citi US',
            connectionId: 'CITI-G-001'
          }));
        }
        return list;
      });
      setAccounts(mapped);
    } catch (e) {
      console.error("Registry Node Sync Failure");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountId: string) => {
    setLoadingTx(true);
    try {
      const apiTx = await apiClient.getTransactions(accountId);
      setTransactions(apiTx);
      setSelectedAccountId(accountId);
      setActiveTab('history');
    } catch (e) {
      console.error("Transaction Handshake Failed");
    } finally {
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Registry <span className="text-blue-500 not-italic">Settlement</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" />
            Direct Node Handshake Active
          </p>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-black p-1.5 rounded-2xl border border-zinc-900">
              <button 
                onClick={() => setActiveTab('registry')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'registry' ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Nodes
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'history' ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Ledger
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-8 shadow-2xl flex flex-col h-full relative overflow-hidden">
             <div className="relative z-10 mb-8">
                <h3 className="text-white font-black text-xs uppercase tracking-widest italic mb-2">Available Nodes</h3>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Select target registry for granular audit</p>
             </div>

             <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-zinc-900 rounded-2xl animate-pulse"></div>)
                ) : (
                  accounts.map(acc => (
                    <button 
                      key={acc.id}
                      onClick={() => fetchTransactions(acc.id)}
                      className={`w-full text-left p-6 rounded-[2rem] border transition-all group ${selectedAccountId === acc.id ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-black border-zinc-900 hover:border-zinc-700'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${selectedAccountId === acc.id ? 'bg-blue-500 text-white' : 'bg-zinc-900 text-zinc-600 group-hover:text-blue-400'}`}>
                          <Building2 size={20} />
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${acc.status === 'ACTIVE' ? 'text-emerald-500 border-emerald-500/20' : 'text-zinc-500 border-zinc-800'}`}>{acc.status}</span>
                      </div>
                      <h4 className="text-white font-black text-xs uppercase italic truncate">{acc.productName}</h4>
                      <div className="mt-4 flex justify-between items-baseline">
                         <p className="text-[10px] text-zinc-600 font-bold mono tracking-tighter">{acc.displayAccountNumber}</p>
                         <p className="text-sm font-black text-white mono">${acc.currentBalance.toLocaleString()}</p>
                      </div>
                    </button>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
             <div className="p-8 border-b border-zinc-900 bg-black/20 flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                      <History size={24} />
                   </div>
                   <div>
                      <h3 className="text-white font-black uppercase tracking-[0.2em] italic text-sm">Ledger Audit Trace</h3>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                        {selectedAccountId ? `SYNCED_NODE: ${selectedAccountId}` : 'AWAITING_NODE_HANDSHAKE'}
                      </p>
                   </div>
                </div>
                <div className="relative">
                   <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
                   <input 
                    placeholder="Filter handshakes..." 
                    className="bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 w-48"
                   />
                </div>
             </div>

             <div className="flex-1 p-0 overflow-y-auto custom-scrollbar">
                {loadingTx ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] animate-pulse">Requesting Registry Payload...</p>
                  </div>
                ) : !selectedAccountId ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30 grayscale">
                    <ShieldCheck size={80} className="text-zinc-800" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Node Connection Idle</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-900 bg-black/40">
                        <th className="p-8">Handshake Detail</th>
                        <th className="p-8">Protocol/Type</th>
                        <th className="p-8">Status</th>
                        <th className="p-8 text-right">Value (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                      {transactions.map(tx => (
                        <tr key={tx.transactionId} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="p-8">
                             <div className="flex items-center gap-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${tx.transactionAmount < 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                                   {tx.transactionAmount < 0 ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                </div>
                                <div>
                                   <p className="text-xs font-black text-white uppercase italic leading-none">{tx.transactionDescription}</p>
                                   <div className="flex items-center gap-3 mt-2">
                                      <Calendar size={10} className="text-zinc-600" />
                                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{tx.transactionDate} • {tx.transactionId}</p>
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="p-8">
                             <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-black text-zinc-500 uppercase tracking-widest rounded-lg">{tx.transactionType}</span>
                          </td>
                          <td className="p-8">
                             <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${tx.transactionStatus === 'POSTED' || tx.transactionStatus === 'BILLED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`}></div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${tx.transactionStatus === 'POSTED' || tx.transactionStatus === 'BILLED' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.transactionStatus}</span>
                             </div>
                          </td>
                          <td className="p-8 text-right">
                             <p className={`text-sm font-black mono tracking-tighter ${tx.transactionAmount < 0 ? 'text-white' : 'text-emerald-500'}`}>
                                {tx.transactionAmount < 0 ? '' : '+'}${tx.transactionAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                             </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Payments.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Building2, 
  ShieldCheck, 
  Loader2, 
  ArrowDownLeft, 
  ArrowUpRight,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { apiClient } from '../services/api';
import { CitiTransaction, InternalAccount } from '../types/index';

const Payments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registry' | 'history'>('registry');
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<InternalAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<CitiTransaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  const fetchRegistry = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getRegistryDetails();
      const mapped: InternalAccount[] = data.accountGroupDetails.flatMap(group => {
        const list: InternalAccount[] = [];
        if (group.checkingAccountsDetails) {
          group.checkingAccountsDetails.forEach(acc => list.push({
            id: acc.accountId,
            productName: acc.productName,
            displayAccountNumber: acc.displayAccountNumber,
            currency: acc.currencyCode,
            status: acc.accountStatus,
            currentBalance: acc.currentBalance,
            availableBalance: acc.availableBalance,
            institutionName: 'Citi US',
            connectionId: 'CITI-G-001'
          }));
        }
        return list;
      });
      setAccounts(mapped);
    } catch (e) {
      console.error("Registry Node Sync Failure");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountId: string) => {
    setLoadingTx(true);
    try {
      const apiTx = await apiClient.getTransactions(accountId);
      setTransactions(apiTx);
      setSelectedAccountId(accountId);
      setActiveTab('history');
    } catch (e) {
      console.error("Transaction Handshake Failed");
    } finally {
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Registry <span className="text-blue-500 not-italic">Settlement</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" />
            Direct Node Handshake Active
          </p>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-black p-1.5 rounded-2xl border border-zinc-900">
              <button 
                onClick={() => setActiveTab('registry')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'registry' ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Nodes
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'history' ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Ledger
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-8 shadow-2xl flex flex-col h-full relative overflow-hidden">
             <div className="relative z-10 mb-8">
                <h3 className="text-white font-black text-xs uppercase tracking-widest italic mb-2">Available Nodes</h3>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Select target registry for granular audit</p>
             </div>

             <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-zinc-900 rounded-2xl animate-pulse"></div>)
                ) : (
                  accounts.map(acc => (
                    <button 
                      key={acc.id}
                      onClick={() => fetchTransactions(acc.id)}
                      className={`w-full text-left p-6 rounded-[2rem] border transition-all group ${selectedAccountId === acc.id ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-black border-zinc-900 hover:border-zinc-700'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${selectedAccountId === acc.id ? 'bg-blue-500 text-white' : 'bg-zinc-900 text-zinc-600 group-hover:text-blue-400'}`}>
                          <Building2 size={20} />
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${acc.status === 'ACTIVE' ? 'text-emerald-500 border-emerald-500/20' : 'text-zinc-500 border-zinc-800'}`}>{acc.status}</span>
                      </div>
                      <h4 className="text-white font-black text-xs uppercase italic truncate">{acc.productName}</h4>
                      <div className="mt-4 flex justify-between items-baseline">
                         <p className="text-[10px] text-zinc-600 font-bold mono tracking-tighter">{acc.displayAccountNumber}</p>
                         <p className="text-sm font-black text-white mono">${acc.currentBalance.toLocaleString()}</p>
                      </div>
                    </button>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
             <div className="p-8 border-b border-zinc-900 bg-black/20 flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                      <History size={24} />
                   </div>
                   <div>
                      <h3 className="text-white font-black uppercase tracking-[0.2em] italic text-sm">Ledger Audit Trace</h3>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                        {selectedAccountId ? `SYNCED_NODE: ${selectedAccountId}` : 'AWAITING_NODE_HANDSHAKE'}
                      </p>
                   </div>
                </div>
                <div className="relative">
                   <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
                   <input 
                    placeholder="Filter handshakes..." 
                    className="bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 w-48"
                   />
                </div>
             </div>

             <div className="flex-1 p-0 overflow-y-auto custom-scrollbar">
                {loadingTx ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] animate-pulse">Requesting Registry Payload...</p>
                  </div>
                ) : !selectedAccountId ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30 grayscale">
                    <ShieldCheck size={80} className="text-zinc-800" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Node Connection Idle</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-900 bg-black/40">
                        <th className="p-8">Handshake Detail</th>
                        <th className="p-8">Protocol/Type</th>
                        <th className="p-8">Status</th>
                        <th className="p-8 text-right">Value (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                      {transactions.map(tx => (
                        <tr key={tx.transactionId} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="p-8">
                             <div className="flex items-center gap-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${tx.transactionAmount < 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                                   {tx.transactionAmount < 0 ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                </div>
                                <div>
                                   <p className="text-xs font-black text-white uppercase italic leading-none">{tx.transactionDescription}</p>
                                   <div className="flex items-center gap-3 mt-2">
                                      <Calendar size={10} className="text-zinc-600" />
                                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{tx.transactionDate} • {tx.transactionId}</p>
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="p-8">
                             <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-black text-zinc-500 uppercase tracking-widest rounded-lg">{tx.transactionType}</span>
                          </td>
                          <td className="p-8">
                             <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${tx.transactionStatus === 'POSTED' || tx.transactionStatus === 'BILLED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`}></div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${tx.transactionStatus === 'POSTED' || tx.transactionStatus === 'BILLED' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.transactionStatus}</span>
                             </div>
                          </td>
                          <td className="p-8 text-right">
                             <p className={`text-sm font-black mono tracking-tighter ${tx.transactionAmount < 0 ? 'text-white' : 'text-emerald-500'}`}>
                                {tx.transactionAmount < 0 ? '' : '+'}${tx.transactionAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                             </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Payments.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Building2, 
  ShieldCheck, 
  Loader2, 
  ArrowDownLeft, 
  ArrowUpRight,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { apiClient } from '../services/api';
import { CitiTransaction, InternalAccount } from '../types/index';

const Payments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registry' | 'history'>('registry');
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<InternalAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<CitiTransaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  const fetchRegistry = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getRegistryDetails();
      const mapped: InternalAccount[] = data.accountGroupDetails.flatMap(group => {
        const list: InternalAccount[] = [];
        if (group.checkingAccountsDetails) {
          group.checkingAccountsDetails.forEach(acc => list.push({
            id: acc.accountId,
            productName: acc.productName,
            displayAccountNumber: acc.displayAccountNumber,
            currency: acc.currencyCode,
            status: acc.accountStatus,
            currentBalance: acc.currentBalance,
            availableBalance: acc.availableBalance,
            institutionName: 'Citi US',
            connectionId: 'CITI-G-001'
          }));
        }
        return list;
      });
      setAccounts(mapped);
    } catch (e) {
      console.error("Registry Node Sync Failure");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountId: string) => {
    setLoadingTx(true);
    try {
      const apiTx = await apiClient.getTransactions(accountId);
      setTransactions(apiTx);
      setSelectedAccountId(accountId);
      setActiveTab('history');
    } catch (e) {
      console.error("Transaction Handshake Failed");
    } finally {
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Registry <span className="text-blue-500 not-italic">Settlement</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" />
            Direct Node Handshake Active
          </p>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-black p-1.5 rounded-2xl border border-zinc-900">
              <button 
                onClick={() => setActiveTab('registry')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'registry' ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Nodes
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'history' ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Ledger
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-8 shadow-2xl flex flex-col h-full relative overflow-hidden">
             <div className="relative z-10 mb-8">
                <h3 className="text-white font-black text-xs uppercase tracking-widest italic mb-2">Available Nodes</h3>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Select target registry for granular audit</p>
             </div>

             <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-zinc-900 rounded-2xl animate-pulse"></div>)
                ) : (
                  accounts.map(acc => (
                    <button 
                      key={acc.id}
                      onClick={() => fetchTransactions(acc.id)}
                      className={`w-full text-left p-6 rounded-[2rem] border transition-all group ${selectedAccountId === acc.id ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-black border-zinc-900 hover:border-zinc-700'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${selectedAccountId === acc.id ? 'bg-blue-500 text-white' : 'bg-zinc-900 text-zinc-600 group-hover:text-blue-400'}`}>
                          <Building2 size={20} />
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${acc.status === 'ACTIVE' ? 'text-emerald-500 border-emerald-500/20' : 'text-zinc-500 border-zinc-800'}`}>{acc.status}</span>
                      </div>
                      <h4 className="text-white font-black text-xs uppercase italic truncate">{acc.productName}</h4>
                      <div className="mt-4 flex justify-between items-baseline">
                         <p className="text-[10px] text-zinc-600 font-bold mono tracking-tighter">{acc.displayAccountNumber}</p>
                         <p className="text-sm font-black text-white mono">${acc.currentBalance.toLocaleString()}</p>
                      </div>
                    </button>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
             <div className="p-8 border-b border-zinc-900 bg-black/20 flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                      <History size={24} />
                   </div>
                   <div>
                      <h3 className="text-white font-black uppercase tracking-[0.2em] italic text-sm">Ledger Audit Trace</h3>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                        {selectedAccountId ? `SYNCED_NODE: ${selectedAccountId}` : 'AWAITING_NODE_HANDSHAKE'}
                      </p>
                   </div>
                </div>
                <div className="relative">
                   <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
                   <input 
                    placeholder="Filter handshakes..." 
                    className="bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 w-48"
                   />
                </div>
             </div>

             <div className="flex-1 p-0 overflow-y-auto custom-scrollbar">
                {loadingTx ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] animate-pulse">Requesting Registry Payload...</p>
                  </div>
                ) : !selectedAccountId ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30 grayscale">
                    <ShieldCheck size={80} className="text-zinc-800" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Node Connection Idle</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-900 bg-black/40">
                        <th className="p-8">Handshake Detail</th>
                        <th className="p-8">Protocol/Type</th>
                        <th className="p-8">Status</th>
                        <th className="p-8 text-right">Value (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                      {transactions.map(tx => (
                        <tr key={tx.transactionId} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="p-8">
                             <div className="flex items-center gap-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${tx.transactionAmount < 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                                   {tx.transactionAmount < 0 ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                </div>
                                <div>
                                   <p className="text-xs font-black text-white uppercase italic leading-none">{tx.transactionDescription}</p>
                                   <div className="flex items-center gap-3 mt-2">
                                      <Calendar size={10} className="text-zinc-600" />
                                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{tx.transactionDate} • {tx.transactionId}</p>
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="p-8">
                             <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-black text-zinc-500 uppercase tracking-widest rounded-lg">{tx.transactionType}</span>
                          </td>
                          <td className="p-8">
                             <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${tx.transactionStatus === 'POSTED' || tx.transactionStatus === 'BILLED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`}></div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${tx.transactionStatus === 'POSTED' || tx.transactionStatus === 'BILLED' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.transactionStatus}</span>
                             </div>
                          </td>
                          <td className="p-8 text-right">
                             <p className={`text-sm font-black mono tracking-tighter ${tx.transactionAmount < 0 ? 'text-white' : 'text-emerald-500'}`}>
                                {tx.transactionAmount < 0 ? '' : '+'}${tx.transactionAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                             </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;