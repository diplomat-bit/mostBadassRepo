// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3 | PATH: diplomat-bit-aibanking.dev-jocall3-91b6490/components/TaxonomyExplorer.tsx
================================================================================

import React, { useState, useMemo } from 'react';
import { 
  Search, Book, Fingerprint, Box, Cpu, 
  MapPin, User, Calendar, DollarSign, Clock,
  Code, Info, ChevronRight, Copy, Check
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  extractor?: boolean;
}

const TAXONOMY_DATA: Feature[] = [
  // General Financial Node Attributes
  { id: '11337432-B2D1-4488-8165-EA5CBEED2B31', name: 'AccountType', description: 'Institutional account classification (Checking, Savings, Debt)', category: 'Account' },
  { id: '9C8B901B-7F36-4391-9A6C-D222FB33A048', name: 'AccountNumber', description: 'Unique identifier for the financial node', category: 'Account' },
  { id: 'AFD29442-EBBE-4540-8349-8D76166C83B4', name: 'AccountName', description: 'Human-readable nickname for the account', category: 'Account' },
  { id: '362A99F1-7A89-4143-BDB8-E131D52C63BD', name: 'PrimaryKey', description: 'Root unique identifier for mesh reconciliation', category: 'System', extractor: true },
  
  // Physical & Geo Features
  { id: '7A0A9BD6-8862-47D6-B5CB-3BBAAA6A5A2E', name: 'GeoCentroidX', description: 'Geographic coordinate X for physical assets', category: 'Geography' },
  { id: '49181CBA-DD4F-45C2-B660-404A7D920703', name: 'GeoCentroidY', description: 'Geographic coordinate Y for physical assets', category: 'Geography' },
  { id: 'F8FEC989-5663-4C57-9634-D0FF43277C2F', name: 'GeoBoundaryPolygon', description: 'Vector data defining geographic territory', category: 'Geography' },
  
  // Person & Demographic
  { id: '8A88920A-43C8-4B48-837D-FFFAFF045B8A', name: 'PersonFullName', description: 'Unified legal name string', category: 'Person' },
  { id: '8d63c59e-af64-4ee1-a5fc-c764e16de20d', name: 'Gender', description: 'Biological gender for underwriting compliance', category: 'Person', extractor: true },
  { id: 'a47a763a-b3cc-4c9d-bf4a-7a5df4618aaf', name: 'MaritalStatus', description: 'Legal marital status for joint liability checks', category: 'Person', extractor: true },
  
  // Currency & ISO
  { id: '126edb74-b40c-4326-a573-976823151c49', name: 'CurrencyNamesISO4217', description: 'Standardized currency labels (USD, EUR, GBP)', category: 'Currency', extractor: true },
  { id: '5600f204-3e80-41bf-87ce-8d105342f228', name: 'CurrencyCodesISO4217', description: 'Alphabetic ISO codes', category: 'Currency', extractor: true },
  
  // Time & Fiscal
  { id: 'c87efea5-590c-4925-86cf-e025acff081d', name: 'FiscalYear', description: 'Operational financial year ending marker', category: 'Fiscal' },
  { id: 'ef93668f-9324-417d-81a5-f16389e8b3d1', name: 'QuarterOfYear', description: 'Fiscal quarter (Q1-Q4)', category: 'Fiscal' },
  
  // Advanced Data Types
  { id: 'b47be76c-ec48-4756-b99a-94dcd4eadd4e', name: 'Email', description: 'Electronic communication address', category: 'Connectivity', extractor: true },
  { id: '37519a69-2552-4adf-afe6-fa4f410574dd', name: 'IPAddress', description: 'Network identifier for transaction origin', category: 'Connectivity', extractor: true },
  { id: 'f786b1ce-8985-4df1-857f-5a34fc0ebc47', name: 'CreditCardNumber', description: 'PAN or tokenized card identifier', category: 'Payments', extractor: true },
  
  // Industry & Registry
  { id: '87C8846A-F5F0-4B52-ACC9-76D88AD0FD39', name: 'NAICSTitles2007', description: 'North American Industry Classification System', category: 'Industry', extractor: true },
  { id: '646e8235-2b86-497f-a415-66a822ff1f5e', name: 'DunsNumber', description: 'Dun & Bradstreet corporate identifier', category: 'Industry', extractor: true },
  
  // Data Schema Mapping
  { id: 'e8a6f0ca-06a4-42c7-93f1-2b5c3020e4de', name: 'AddressSchema', description: 'Unified schema for physical addresses', category: 'Schema', extractor: true },
  { id: '73804697-a938-49df-924c-2c6e28b983eb', name: 'CompanySchema', description: 'Unified schema for corporate entities', category: 'Schema', extractor: true },
  { id: '1f987eb6-5ddd-4b33-a91c-6a2866bfd17d', name: 'SSN', description: 'Social Security Number (Encrypted/Tokenized)', category: 'Identification', extractor: true },
];

const CATEGORIES = [
  { id: 'all', name: 'Unified View', icon: Box },
  { id: 'Account', name: 'Institutional Nodes', icon: Fingerprint },
  { id: 'Person', name: 'Human Entities', icon: User },
  { id: 'Geography', name: 'Spatial Data', icon: MapPin },
  { id: 'Currency', name: 'Monetary Units', icon: DollarSign },
  { id: 'Fiscal', name: 'Time Dimensions', icon: Clock },
  { id: 'Connectivity', name: 'Network Vectors', icon: Cpu },
  { id: 'Schema', name: 'Logic Schemas', icon: Code },
];

export const TaxonomyExplorer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return TAXONOMY_DATA.filter(f => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.description.toLowerCase().includes(search.toLowerCase()) ||
                          f.id.includes(search);
      const matchCat = activeCat === 'all' || f.category === activeCat;
      return matchSearch && matchCat;
    });
  }, [search, activeCat]);

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-12 animate-in fade-in slide-in-from-left-8 duration-700">
      <aside className="xl:w-80 space-y-4">
        <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Book size={18} className="text-blue-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Registry Spec</h3>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed italic">
            Standardized financial feature dictionary v1.0. Use these UUIDs for cross-institutional mesh reconciliation.
          </p>
        </div>

        <nav className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeCat === cat.id ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-500'}`}
            >
              <div className="flex items-center gap-3">
                <cat.icon size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform ${activeCat === cat.id ? 'rotate-90' : 'opacity-20'}`} />
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 space-y-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-600 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input 
            type="text"
            placeholder="Filter by Feature Name, UUID, or Extraction Logic..."
            className="w-full pl-16 pr-8 py-6 bg-slate-900/60 border border-white/5 rounded-[2.5rem] text-white font-mono text-xs outline-none focus:border-blue-500/40 transition-all shadow-xl backdrop-blur-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(feature => (
            <div key={feature.id} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => copyToClipboard(feature.id)}
                  className={`p-3 rounded-xl transition-all ${copiedId === feature.id ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                >
                  {copiedId === feature.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-lg bg-blue-600/10 text-blue-500 text-[8px] font-black uppercase tracking-widest border border-blue-500/20">
                  {feature.category}
                </span>
                {feature.extractor && (
                  <span className="px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 text-[8px] font-black uppercase tracking-widest border border-teal-500/20 flex items-center gap-1">
                    <Cpu size={8} /> Logic-Extractor
                  </span>
                )}
              </div>

              <h4 className="text-xl font-black italic uppercase text-white tracking-tighter mb-2 group-hover:text-blue-400 transition-colors">
                {feature.name}
              </h4>
              <p className="text-[11px] text-slate-500 mb-8 leading-relaxed font-medium">
                {feature.description}
              </p>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Global Resource Identifier</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">{feature.id}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-700">
                  <Info size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-40 text-center opacity-20">
            <Box size={64} className="mx-auto mb-6 text-slate-600" />
            <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-600">No Registry Matches Found</p>
          </div>
        )}
      </div>
    </div>
  );
};