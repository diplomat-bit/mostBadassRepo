// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/LineItems.tsx
================================================================================


import React, { useState } from 'react';
/* Fix: react-router-dom exports may be flaky in this environment, using standard v6 imports */
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ListTree, 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  MoreVertical, 
  Search, 
  Hash, 
  FileText,
  Tag
} from 'lucide-react';
import { LineItem, LineItemUpdateRequest } from '../types/index';

const MOCK_LINE_ITEMS: LineItem[] = [
  { id: 'LI-001', amount: 12000.50, currency: 'USD', description: 'Monthly Compute - Node A', ledger_account_id: 'LED-991', itemizable_id: 'TXN-8821', itemizable_type: 'payment_orders', createdAt: '2024-03-25' },
  { id: 'LI-002', amount: 2500.00, currency: 'USD', description: 'Storage Surcharge - Region East', ledger_account_id: 'LED-992', itemizable_id: 'TXN-8821', itemizable_type: 'payment_orders', createdAt: '2024-03-25' },
  { id: 'LI-003', amount: 30499.50, currency: 'USD', description: 'Quantum Networking Handshake', ledger_account_id: 'LED-991', itemizable_id: 'TXN-8821', itemizable_type: 'payment_orders', createdAt: '2024-03-25' },
];

const LineItems: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<LineItem[]>(MOCK_LINE_ITEMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<LineItemUpdateRequest>({});

  const handleEdit = (item: LineItem) => {
    setEditingId(item.id);
    setEditForm({ description: item.description });
  };

  const handleSave = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...editForm } : item));
    setEditingId(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Line <span className="text-blue-500 not-italic">Ledger</span></h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
              {type?.replace('_', ' ')} ID: <span className="text-zinc-400 mono">{id}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              placeholder="Search Items..."
              className="bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex justify-between items-center bg-black/20">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <ListTree size={20} />
            </div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Granular Breakdown</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-5">Item Detail</th>
                <th className="py-5">Ledger Mapping</th>
                <th className="py-5">Created At</th>
                <th className="py-5 text-right">Amount (USD)</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {items.map(item => (
                <tr key={item.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
                        <Tag size={18} />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        {editingId === item.id ? (
                          <input 
                            value={editForm.description}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-1 text-xs text-white outline-none focus:border-blue-500/50"
                            autoFocus
                          />
                        ) : (
                          <p className="text-white font-black text-xs uppercase italic">{item.description}</p>
                        )}
                        <p className="text-[10px] text-zinc-600 font-mono font-bold mt-1 uppercase tracking-tighter">ID: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <Hash size={12} className="text-zinc-600" />
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.ledger_account_id}</p>
                    </div>
                  </td>
                  <td className="py-8">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.createdAt}</p>
                  </td>
                  <td className="py-8 text-right">
                    <p className="text-sm font-black text-white mono tracking-tighter">${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">{item.currency}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {editingId === item.id ? (
                        <>
                          <button onClick={() => handleSave(item.id)} className="p-2 text-emerald-500 hover:text-emerald-400 transition-colors">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-rose-500 hover:text-rose-400 transition-colors">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(item)} className="p-2 text-zinc-500 hover:text-white" title="Update Line Item">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2 text-zinc-500 hover:text-white"><MoreVertical size={16} /></button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-zinc-800 rounded-2xl text-zinc-400">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1 italic">Total Aggregate</h4>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Calculated from {items.length} granular entries</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white mono tracking-tighter">
            ${items.reduce((sum, i) => sum + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Verified Audit Payload</p>
        </div>
      </div>
    </div>
  );
};

export default LineItems;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/LineItems.tsx
================================================================================


import React, { useState } from 'react';
/* Fix: react-router-dom exports may be flaky in this environment, using standard v6 imports */
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ListTree, 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  MoreVertical, 
  Search, 
  Hash, 
  FileText,
  Tag
} from 'lucide-react';
import { LineItem, LineItemUpdateRequest } from '../types/index';

const MOCK_LINE_ITEMS: LineItem[] = [
  { id: 'LI-001', amount: 12000.50, currency: 'USD', description: 'Monthly Compute - Node A', ledger_account_id: 'LED-991', itemizable_id: 'TXN-8821', itemizable_type: 'payment_orders', createdAt: '2024-03-25' },
  { id: 'LI-002', amount: 2500.00, currency: 'USD', description: 'Storage Surcharge - Region East', ledger_account_id: 'LED-992', itemizable_id: 'TXN-8821', itemizable_type: 'payment_orders', createdAt: '2024-03-25' },
  { id: 'LI-003', amount: 30499.50, currency: 'USD', description: 'Quantum Networking Handshake', ledger_account_id: 'LED-991', itemizable_id: 'TXN-8821', itemizable_type: 'payment_orders', createdAt: '2024-03-25' },
];

const LineItems: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<LineItem[]>(MOCK_LINE_ITEMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<LineItemUpdateRequest>({});

  const handleEdit = (item: LineItem) => {
    setEditingId(item.id);
    setEditForm({ description: item.description });
  };

  const handleSave = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...editForm } : item));
    setEditingId(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Line <span className="text-blue-500 not-italic">Ledger</span></h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
              {type?.replace('_', ' ')} ID: <span className="text-zinc-400 mono">{id}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              placeholder="Search Items..."
              className="bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex justify-between items-center bg-black/20">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <ListTree size={20} />
            </div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Granular Breakdown</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-5">Item Detail</th>
                <th className="py-5">Ledger Mapping</th>
                <th className="py-5">Created At</th>
                <th className="py-5 text-right">Amount (USD)</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {items.map(item => (
                <tr key={item.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
                        <Tag size={18} />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        {editingId === item.id ? (
                          <input 
                            value={editForm.description}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-1 text-xs text-white outline-none focus:border-blue-500/50"
                            autoFocus
                          />
                        ) : (
                          <p className="text-white font-black text-xs uppercase italic">{item.description}</p>
                        )}
                        <p className="text-[10px] text-zinc-600 font-mono font-bold mt-1 uppercase tracking-tighter">ID: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <Hash size={12} className="text-zinc-600" />
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.ledger_account_id}</p>
                    </div>
                  </td>
                  <td className="py-8">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.createdAt}</p>
                  </td>
                  <td className="py-8 text-right">
                    <p className="text-sm font-black text-white mono tracking-tighter">${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">{item.currency}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {editingId === item.id ? (
                        <>
                          <button onClick={() => handleSave(item.id)} className="p-2 text-emerald-500 hover:text-emerald-400 transition-colors">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-rose-500 hover:text-rose-400 transition-colors">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(item)} className="p-2 text-zinc-500 hover:text-white" title="Update Line Item">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2 text-zinc-500 hover:text-white"><MoreVertical size={16} /></button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-zinc-800 rounded-2xl text-zinc-400">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1 italic">Total Aggregate</h4>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Calculated from {items.length} granular entries</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white mono tracking-tighter">
            ${items.reduce((sum, i) => sum + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Verified Audit Payload</p>
        </div>
      </div>
    </div>
  );
};

export default LineItems;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/LineItems.tsx
================================================================================


import React, { useState } from 'react';
/* Fix: react-router-dom exports may be flaky in this environment, using standard v6 imports */
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ListTree, 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  MoreVertical, 
  Search, 
  Hash, 
  FileText,
  Tag
} from 'lucide-react';
import { LineItem, LineItemUpdateRequest } from '../types/index';

const MOCK_LINE_ITEMS: LineItem[] = [
  { id: 'LI-001', amount: 12000.50, currency: 'USD', description: 'Monthly Compute - Node A', ledger_account_id: 'LED-991', itemizable_id: 'TXN-8821', itemizable_type: 'payment_orders', createdAt: '2024-03-25' },
  { id: 'LI-002', amount: 2500.00, currency: 'USD', description: 'Storage Surcharge - Region East', ledger_account_id: 'LED-992', itemizable_id: 'TXN-8821', itemizable_type: 'payment_orders', createdAt: '2024-03-25' },
  { id: 'LI-003', amount: 30499.50, currency: 'USD', description: 'Quantum Networking Handshake', ledger_account_id: 'LED-991', itemizable_id: 'TXN-8821', itemizable_type: 'payment_orders', createdAt: '2024-03-25' },
];

const LineItems: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<LineItem[]>(MOCK_LINE_ITEMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<LineItemUpdateRequest>({});

  const handleEdit = (item: LineItem) => {
    setEditingId(item.id);
    setEditForm({ description: item.description });
  };

  const handleSave = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...editForm } : item));
    setEditingId(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Line <span className="text-blue-500 not-italic">Ledger</span></h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
              {type?.replace('_', ' ')} ID: <span className="text-zinc-400 mono">{id}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              placeholder="Search Items..."
              className="bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex justify-between items-center bg-black/20">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <ListTree size={20} />
            </div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Granular Breakdown</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-5">Item Detail</th>
                <th className="py-5">Ledger Mapping</th>
                <th className="py-5">Created At</th>
                <th className="py-5 text-right">Amount (USD)</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {items.map(item => (
                <tr key={item.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
                        <Tag size={18} />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        {editingId === item.id ? (
                          <input 
                            value={editForm.description}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-1 text-xs text-white outline-none focus:border-blue-500/50"
                            autoFocus
                          />
                        ) : (
                          <p className="text-white font-black text-xs uppercase italic">{item.description}</p>
                        )}
                        <p className="text-[10px] text-zinc-600 font-mono font-bold mt-1 uppercase tracking-tighter">ID: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <Hash size={12} className="text-zinc-600" />
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.ledger_account_id}</p>
                    </div>
                  </td>
                  <td className="py-8">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.createdAt}</p>
                  </td>
                  <td className="py-8 text-right">
                    <p className="text-sm font-black text-white mono tracking-tighter">${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">{item.currency}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {editingId === item.id ? (
                        <>
                          <button onClick={() => handleSave(item.id)} className="p-2 text-emerald-500 hover:text-emerald-400 transition-colors">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-rose-500 hover:text-rose-400 transition-colors">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(item)} className="p-2 text-zinc-500 hover:text-white" title="Update Line Item">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2 text-zinc-500 hover:text-white"><MoreVertical size={16} /></button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-zinc-800 rounded-2xl text-zinc-400">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1 italic">Total Aggregate</h4>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Calculated from {items.length} granular entries</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white mono tracking-tighter">
            ${items.reduce((sum, i) => sum + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Verified Audit Payload</p>
        </div>
      </div>
    </div>
  );
};

export default LineItems;
