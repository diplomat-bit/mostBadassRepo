// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3 | PATH: diplomat-bit-aibanking.dev-jocall3-91b6490/components/ModernTreasuryNode.tsx
================================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Landmark, RefreshCw, Zap, ShieldCheck, CheckCircle2, 
  Terminal, Database, Search, Sparkles
} from 'lucide-react';
import { ConnectedItem, Transaction, ModernTreasuryCredentials } from '../types';

interface Props {
  creds: ModernTreasuryCredentials;
  connectedItems: ConnectedItem[];
  addLog: (msg: any, type?: 'req' | 'res' | 'err') => void;
  proxy: string;
}

interface LedgerAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  status: string;
}

export const ModernTreasuryNode: React.FC<Props> = ({ creds, connectedItems, addLog, proxy }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciledIds, setReconciledIds] = useState<Set<string>>(new Set());
  const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccount[]>([]);

  const allTransactions = useMemo(() => {
    return connectedItems.flatMap(i => i.transactions.map(t => ({ 
      ...t, 
      institution_origin: i.institutionName 
    })));
  }, [connectedItems]);

  const loadLedger = async () => {
    if (!creds.orgId || !creds.apiKey) return;
    
    setIsSyncing(true);
    addLog(`[MODERN_TREASURY] Fetching Ledgers (Org: ${creds.orgId})`, 'req');
    
    // Auth: OrgID:ApiKey
    const auth = btoa(`${creds.orgId}:${creds.apiKey}`);
    try {
      const resp = await fetch(`${proxy}${encodeURIComponent('https://app.moderntreasury.com/api/ledgers')}`, {
        headers: { 
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });
      
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text }; }

      if (!resp.ok) {
        addLog(`MT Auth Failure: ${data.errors?.message || data.message || resp.status}`, "err");
      } else {
        addLog(`MT Sync Success: Received ledger definitions.`, "res");
        addLog(data, 'res');
      }
    } catch (e: any) {
      addLog(`MT Node Connection Error: ${e.message}`, "err");
    }

    // Always provide UI accounts for operational testing
    setTimeout(() => {
      const mockAccounts: LedgerAccount[] = [
        { id: 'la_01', name: 'Primary Sub-Ledger', type: 'internal', balance: 500000, status: 'active' },
        { id: 'la_02', name: 'Accounts Payable Reserve', type: 'internal', balance: 125000, status: 'active' },
        { id: 'va_01', name: 'Virtual Account - Payroll', type: 'virtual', balance: 45000, status: 'active' }
      ];
      setLedgerAccounts(mockAccounts);
      setIsSyncing(false);
    }, 800);
  };

  useEffect(() => {
    loadLedger();
  }, [creds.orgId, creds.apiKey]);

  const findMatches = () => {
    setIsReconciling(true);
    addLog("RECONCILE ENGINE: Scanning mesh for transaction parity...", "req");
    
    // Improved matching logic: matching by amount (absolute) AND same date
    const matches = new Set<string>();
    const amountDateMap: Record<string, string[]> = {};

    allTransactions.forEach(tx => {
      // Key is absolute amount rounded to 2 decimals plus the date
      const key = `${Math.abs(tx.amount).toFixed(2)}_${tx.date}`;
      if (!amountDateMap[key]) amountDateMap[key] = [];
      amountDateMap[key].push(tx.id);
    });

    Object.values(amountDateMap).forEach(ids => {
      if (ids.length > 1) {
        ids.forEach(id => matches.add(id));
      }
    });

    setTimeout(() => {
      setReconciledIds(matches);
      setIsReconciling(false);
      addLog(`MATCH RESULT: ${matches.size} transactions linked across nodes.`, "res");
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 flex flex-wrap items-center justify-between gap-8 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[80px] rounded-full -mr-16 -mt-16" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-500">
            <Landmark size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Treasury Terminal</h2>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                ORG: {creds.orgId} • AUTH: {creds.apiKey ? 'BASIC ACTIVE' : 'NONE'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 relative z-10">
          <button 
            onClick={loadLedger} 
            disabled={isSyncing}
            className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2"
          >
            <RefreshCw className={isSyncing ? 'animate-spin' : ''} size={14} />
            Refresh Ledgers
          </button>
          <button 
            onClick={findMatches}
            disabled={isReconciling || allTransactions.length === 0}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-purple-500/20"
          >
            {isReconciling ? <Sparkles className="animate-pulse" size={16} /> : <Zap size={16}/>}
            Execute Match
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between ml-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Active Ledgers</h3>
            <Database size={14} className="text-slate-700" />
          </div>
          <div className="space-y-4">
            {ledgerAccounts.map(acc => (
              <div key={acc.id} className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 group hover:border-purple-500/30 transition-all">
                <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest mb-1">{acc.id}</p>
                <h4 className="text-white font-bold tracking-tight mb-4">{acc.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black italic text-white tracking-tighter">${acc.balance.toLocaleString()}</span>
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-slate-500 uppercase">{acc.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between ml-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Cross-Node Settlement</h3>
            <div className="flex gap-4">
              <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-emerald-500/40 shadow" /> {reconciledIds.size} Linked
              </span>
              <span className="text-[10px] font-bold text-amber-500 uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {allTransactions.length - reconciledIds.size} Orphaned
              </span>
            </div>
          </div>

          <div className="bg-slate-950/40 rounded-[3rem] border border-white/5 overflow-hidden backdrop-blur-sm">
             <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left">
                   <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                    <tr className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/10">
                      <th className="p-6">Transaction</th>
                      <th className="p-6">Origin</th>
                      <th className="p-6">Amount</th>
                      <th className="p-6 text-right">Ledger Status</th>
                    </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 font-mono">
                      {allTransactions.map((tx) => (
                        <tr key={tx.id} className={`text-xs transition-colors hover:bg-white/5 ${reconciledIds.has(tx.id) ? 'bg-purple-500/10' : ''}`}>
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${reconciledIds.has(tx.id) ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-900 border-white/5 text-slate-600'}`}>
                                {reconciledIds.has(tx.id) ? <CheckCircle2 size={14} /> : <Terminal size={14} />}
                              </div>
                              <div>
                                <p className={`font-bold tracking-tight ${reconciledIds.has(tx.id) ? 'text-emerald-400' : 'text-white'}`}>{tx.name}</p>
                                <p className="text-[8px] text-slate-600 mt-1 uppercase italic">{tx.date}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                             <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter italic">
                              {tx.institution_origin}
                            </span>
                          </td>
                          <td className={`p-6 font-black tracking-tighter ${tx.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            ${Math.abs(tx.amount).toFixed(2)}
                          </td>
                          <td className="p-6 text-right">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${reconciledIds.has(tx.id) ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/40' : 'bg-slate-900 text-slate-600 border-white/5'}`}>
                              {reconciledIds.has(tx.id) ? 'LINKED' : 'UNRESOLVED'}
                            </span>
                          </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
                {allTransactions.length === 0 && (
                  <div className="py-32 text-center opacity-20">
                    <Search size={48} className="mx-auto mb-4 text-slate-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Scan Banking Mesh for Transactions</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};