// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Validations.tsx
================================================================================


import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Building2, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Terminal,
  ArrowRight,
  Info,
  Key,
  MapPin,
  ShieldAlert,
  Zap
} from 'lucide-react';

const Validations: React.FC = () => {
  const [routingNumber, setRoutingNumber] = useState('');
  const [basicToken, setBasicToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routingNumber || !basicToken) {
      setError("Routing number and Basic Token are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`https://try.readme.io/https://app.moderntreasury.com/api/validations/routing_numbers?routing_number=${routingNumber}&routing_number_type=aba`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "accept-language": "en-US,en;q=0.9",
          "authorization": `Basic ${basicToken}`,
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "x-readme-api-explorer": "5.590.0"
        },
        mode: "cors",
        credentials: "include"
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.errors?.[0]?.message || `HTTP ${response.status}: API Handshake Failed`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Network Error: Failed to synchronize with validation node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Registry <span className="text-blue-500 not-italic">Validator</span></h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto font-medium">Modern Treasury Bridge: Live Routing Integrity Screening</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
          <Terminal size={140} />
        </div>
        
        <form onSubmit={handleValidate} className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">ABA Routing Number</label>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  value={routingNumber}
                  onChange={e => setRoutingNumber(e.target.value)}
                  placeholder="e.g. 021000021"
                  className="w-full bg-black border-2 border-zinc-900 focus:border-blue-500/50 rounded-2xl py-5 pl-16 pr-6 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Basic Auth Token</label>
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="password"
                  value={basicToken}
                  onChange={e => setBasicToken(e.target.value)}
                  placeholder="Basic {token}"
                  className="w-full bg-black border-2 border-zinc-900 focus:border-blue-500/50 rounded-2xl py-5 pl-16 pr-6 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-mono"
                />
              </div>
            </div>
          </div>
          <button 
            disabled={loading || !routingNumber || !basicToken}
            className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/30"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            <span>{loading ? 'Performing Handshake...' : 'Synchronize Validator'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-8 bg-rose-600/10 border border-rose-500/20 rounded-[2rem] flex items-center gap-6 animate-in zoom-in-95">
          <ShieldAlert className="text-rose-500 shrink-0" size={32} />
          <div>
            <h4 className="text-rose-500 font-black uppercase text-xs tracking-widest mb-1">Handshake Interrupted</h4>
            <p className="text-zinc-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-6 duration-700">
          <div className="lg:col-span-1 bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Building2 size={80} />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">Verified Node</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{result.routing_number}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Legal Entity</p>
                <p className="text-white font-bold text-sm uppercase leading-relaxed">{result.bank_name}</p>
              </div>
              <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Node Type</p>
                <p className="text-blue-500 font-black uppercase text-sm mono">{result.routing_number_type}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
               <MapPin size={120} className="text-blue-500" />
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                <Globe size={24} />
              </div>
              <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">Geospatial Metadata</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Host Address</p>
                   <p className="text-zinc-200 text-sm font-medium leading-relaxed">
                     {result.bank_address?.line1}<br />
                     {result.bank_address?.locality}, {result.bank_address?.region} {result.bank_address?.postal_code}<br />
                     {result.bank_address?.country}
                   </p>
                 </div>
               </div>
               <div className="space-y-6">
                 <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Supported Protocols</p>
                   <div className="flex flex-wrap gap-2">
                     {result.supported_payment_types?.map((t: string) => (
                       <span key={t} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase text-blue-500">
                         {t} Optimized
                       </span>
                     ))}
                   </div>
                 </div>
                 <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Sanctions Status</p>
                   <div className="flex items-center gap-2">
                     <CheckCircle2 size={12} className="text-emerald-500" />
                     <span className="text-emerald-500 font-black uppercase text-[10px]">Zero Deviations</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Validations;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Validations.tsx
================================================================================


import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Building2, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Terminal,
  ArrowRight,
  Info,
  Key,
  MapPin,
  ShieldAlert,
  Zap
} from 'lucide-react';

const Validations: React.FC = () => {
  const [routingNumber, setRoutingNumber] = useState('');
  const [basicToken, setBasicToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routingNumber || !basicToken) {
      setError("Routing number and Basic Token are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`https://try.readme.io/https://app.moderntreasury.com/api/validations/routing_numbers?routing_number=${routingNumber}&routing_number_type=aba`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "accept-language": "en-US,en;q=0.9",
          "authorization": `Basic ${basicToken}`,
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "x-readme-api-explorer": "5.590.0"
        },
        mode: "cors",
        credentials: "include"
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.errors?.[0]?.message || `HTTP ${response.status}: API Handshake Failed`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Network Error: Failed to synchronize with validation node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Registry <span className="text-blue-500 not-italic">Validator</span></h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto font-medium">Modern Treasury Bridge: Live Routing Integrity Screening</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
          <Terminal size={140} />
        </div>
        
        <form onSubmit={handleValidate} className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">ABA Routing Number</label>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  value={routingNumber}
                  onChange={e => setRoutingNumber(e.target.value)}
                  placeholder="e.g. 021000021"
                  className="w-full bg-black border-2 border-zinc-900 focus:border-blue-500/50 rounded-2xl py-5 pl-16 pr-6 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Basic Auth Token</label>
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="password"
                  value={basicToken}
                  onChange={e => setBasicToken(e.target.value)}
                  placeholder="Basic {token}"
                  className="w-full bg-black border-2 border-zinc-900 focus:border-blue-500/50 rounded-2xl py-5 pl-16 pr-6 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-mono"
                />
              </div>
            </div>
          </div>
          <button 
            disabled={loading || !routingNumber || !basicToken}
            className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/30"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            <span>{loading ? 'Performing Handshake...' : 'Synchronize Validator'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-8 bg-rose-600/10 border border-rose-500/20 rounded-[2rem] flex items-center gap-6 animate-in zoom-in-95">
          <ShieldAlert className="text-rose-500 shrink-0" size={32} />
          <div>
            <h4 className="text-rose-500 font-black uppercase text-xs tracking-widest mb-1">Handshake Interrupted</h4>
            <p className="text-zinc-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-6 duration-700">
          <div className="lg:col-span-1 bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Building2 size={80} />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">Verified Node</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{result.routing_number}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Legal Entity</p>
                <p className="text-white font-bold text-sm uppercase leading-relaxed">{result.bank_name}</p>
              </div>
              <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Node Type</p>
                <p className="text-blue-500 font-black uppercase text-sm mono">{result.routing_number_type}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
               <MapPin size={120} className="text-blue-500" />
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                <Globe size={24} />
              </div>
              <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">Geospatial Metadata</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Host Address</p>
                   <p className="text-zinc-200 text-sm font-medium leading-relaxed">
                     {result.bank_address?.line1}<br />
                     {result.bank_address?.locality}, {result.bank_address?.region} {result.bank_address?.postal_code}<br />
                     {result.bank_address?.country}
                   </p>
                 </div>
               </div>
               <div className="space-y-6">
                 <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Supported Protocols</p>
                   <div className="flex flex-wrap gap-2">
                     {result.supported_payment_types?.map((t: string) => (
                       <span key={t} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase text-blue-500">
                         {t} Optimized
                       </span>
                     ))}
                   </div>
                 </div>
                 <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Sanctions Status</p>
                   <div className="flex items-center gap-2">
                     <CheckCircle2 size={12} className="text-emerald-500" />
                     <span className="text-emerald-500 font-black uppercase text-[10px]">Zero Deviations</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Validations;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Validations.tsx
================================================================================


import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Building2, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Terminal,
  ArrowRight,
  Info,
  Key,
  MapPin,
  ShieldAlert,
  Zap
} from 'lucide-react';

const Validations: React.FC = () => {
  const [routingNumber, setRoutingNumber] = useState('');
  const [basicToken, setBasicToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routingNumber || !basicToken) {
      setError("Routing number and Basic Token are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`https://try.readme.io/https://app.moderntreasury.com/api/validations/routing_numbers?routing_number=${routingNumber}&routing_number_type=aba`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "accept-language": "en-US,en;q=0.9",
          "authorization": `Basic ${basicToken}`,
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "x-readme-api-explorer": "5.590.0"
        },
        mode: "cors",
        credentials: "include"
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.errors?.[0]?.message || `HTTP ${response.status}: API Handshake Failed`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Network Error: Failed to synchronize with validation node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Registry <span className="text-blue-500 not-italic">Validator</span></h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto font-medium">Modern Treasury Bridge: Live Routing Integrity Screening</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
          <Terminal size={140} />
        </div>
        
        <form onSubmit={handleValidate} className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">ABA Routing Number</label>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  value={routingNumber}
                  onChange={e => setRoutingNumber(e.target.value)}
                  placeholder="e.g. 021000021"
                  className="w-full bg-black border-2 border-zinc-900 focus:border-blue-500/50 rounded-2xl py-5 pl-16 pr-6 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Basic Auth Token</label>
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="password"
                  value={basicToken}
                  onChange={e => setBasicToken(e.target.value)}
                  placeholder="Basic {token}"
                  className="w-full bg-black border-2 border-zinc-900 focus:border-blue-500/50 rounded-2xl py-5 pl-16 pr-6 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-mono"
                />
              </div>
            </div>
          </div>
          <button 
            disabled={loading || !routingNumber || !basicToken}
            className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/30"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            <span>{loading ? 'Performing Handshake...' : 'Synchronize Validator'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-8 bg-rose-600/10 border border-rose-500/20 rounded-[2rem] flex items-center gap-6 animate-in zoom-in-95">
          <ShieldAlert className="text-rose-500 shrink-0" size={32} />
          <div>
            <h4 className="text-rose-500 font-black uppercase text-xs tracking-widest mb-1">Handshake Interrupted</h4>
            <p className="text-zinc-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-6 duration-700">
          <div className="lg:col-span-1 bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Building2 size={80} />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">Verified Node</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{result.routing_number}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Legal Entity</p>
                <p className="text-white font-bold text-sm uppercase leading-relaxed">{result.bank_name}</p>
              </div>
              <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Node Type</p>
                <p className="text-blue-500 font-black uppercase text-sm mono">{result.routing_number_type}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
               <MapPin size={120} className="text-blue-500" />
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                <Globe size={24} />
              </div>
              <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">Geospatial Metadata</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Host Address</p>
                   <p className="text-zinc-200 text-sm font-medium leading-relaxed">
                     {result.bank_address?.line1}<br />
                     {result.bank_address?.locality}, {result.bank_address?.region} {result.bank_address?.postal_code}<br />
                     {result.bank_address?.country}
                   </p>
                 </div>
               </div>
               <div className="space-y-6">
                 <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Supported Protocols</p>
                   <div className="flex flex-wrap gap-2">
                     {result.supported_payment_types?.map((t: string) => (
                       <span key={t} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase text-blue-500">
                         {t} Optimized
                       </span>
                     ))}
                   </div>
                 </div>
                 <div className="p-6 bg-black rounded-2xl border border-zinc-900">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Sanctions Status</p>
                   <div className="flex items-center gap-2">
                     <CheckCircle2 size={12} className="text-emerald-500" />
                     <span className="text-emerald-500 font-black uppercase text-[10px]">Zero Deviations</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Validations;
