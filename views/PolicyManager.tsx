// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/PolicyManager.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Lock, Key, ShieldAlert, Fingerprint, 
  Terminal, Activity, RefreshCw, Plus, Trash2, 
  CheckCircle2, Code, Shield, Eye, Database, Zap, Loader2, Globe,
  // fix: Added missing X icon import
  X
} from 'lucide-react';
import { auth0Service, AUTH0_CONFIG } from '../services/auth0Service';

interface PermissionScope {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const PolicyManager: React.FC = () => {
  const [scopes, setScopes] = useState<PermissionScope[]>([
    { id: '1', name: 'read:accounts', description: 'Access aggregate ledger data', enabled: true },
    { id: '2', name: 'write:payments', description: 'Initiate disbursement signals', enabled: true },
    { id: '3', name: 'manage:foundry', description: 'Authorize NFT synthesis', enabled: false },
    { id: '4', name: 'admin:registry', description: 'Full node lifecycle control', enabled: false },
  ]);

  const [isRotating, setIsRotating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const jwtMock = useMemo(() => ({
    header: { alg: "RS256", typ: "JWT", kid: "LQI_SIGNER_KEY_01" },
    payload: {
      iss: AUTH0_CONFIG.issuerBaseURL,
      aud: AUTH0_CONFIG.audience,
      sub: "nexus|node_master_001",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: scopes.filter(s => s.enabled).map(s => s.name).join(' ')
    }
  }), [scopes]);

  const toggleScope = (id: string) => {
    setScopes(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleRotate = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 1500);
  };

  const handleTestHandshake = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const activeScopes = scopes.filter(s => s.enabled).map(s => s.name);
      const token = await auth0Service.getSimulatedToken(activeScopes);
      
      // Simulate network request to the secured resource
      const result = await auth0Service.fetchSecuredResource(token);
      
      if (result.success) {
        setTestResult({ success: true, msg: result.data || 'Secured Resource Accessed Successfully.' });
      } else {
        setTestResult({ success: false, msg: result.error || 'Authorization Rejected.' });
      }
    } catch (err) {
      setTestResult({ success: false, msg: 'Internal Gateway Failure.' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Policy <span className="text-blue-500 not-italic">Manager</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" />
            JWT RS256 Authorization Control Node
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleTestHandshake}
            disabled={isTesting}
            className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40"
          >
            {isTesting ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            <span>Test Secure Bridge</span>
          </button>
          <button 
            onClick={handleRotate}
            disabled={isRotating}
            className="flex items-center space-x-2 px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            {isRotating ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            <span>Rotate Auth0 Secret</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7 space-y-8">
          {testResult && (
            <div className={`p-8 rounded-[2rem] border animate-in zoom-in-95 duration-300 flex items-center gap-6 ${testResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${testResult.success ? 'bg-emerald-500 text-white border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 text-white border-rose-400/30 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`}>
                  {testResult.success ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Handshake Result</p>
                  <p className="text-sm font-bold uppercase italic">{testResult.msg}</p>
               </div>
               <button onClick={() => setTestResult(null)} className="ml-auto p-2 text-zinc-600 hover:text-white"><X size={18} /></button>
            </div>
          )}

          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield size={160} className="text-blue-500" />
            </div>
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Define Permissions</h3>
                   <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-2">Granular OAuth2 Scopes</p>
                </div>
                <button className="p-3 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {scopes.map(scope => (
                  <div key={scope.id} className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${scope.enabled ? 'bg-blue-600/5 border-blue-500/20' : 'bg-black border-zinc-900 opacity-60'}`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${scope.enabled ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-900 text-zinc-700'}`}>
                        <Lock size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic tracking-widest">{scope.name}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{scope.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleScope(scope.id)}
                      className={`w-14 h-7 rounded-full relative transition-all duration-300 ${scope.enabled ? 'bg-blue-600 shadow-lg shadow-blue-900/30' : 'bg-zinc-800'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${scope.enabled ? 'left-8' : 'left-1'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/20 rounded-[3rem] p-10 flex items-center gap-10 shadow-2xl backdrop-blur-xl group">
             <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
               <ShieldAlert size={36} />
             </div>
             <div>
               <h4 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Enforcement Mode: <span className="text-blue-500">STRICT</span></h4>
               <p className="text-zinc-500 text-sm font-medium leading-relaxed italic max-w-lg">
                 "All endpoints defined in the LQI mesh require valid JWT tokens issued by Auth0 university cluster. Unauthorized requests are shredded immediately."
               </p>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 flex flex-col h-full shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Code size={120} className="text-emerald-500" />
            </div>
            
            <div className="mb-10 relative z-10 flex justify-between items-start">
              <div>
                <h3 className="text-white font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active JWT Handshake
                </h3>
                <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1">RS256 Encoded Fragment</p>
              </div>
            </div>

            <div className="space-y-6 flex-1 relative z-10">
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Header</p>
                  <div className="bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-[11px] text-blue-400/80 shadow-inner">
                    <pre>{JSON.stringify(jwtMock.header, null, 2)}</pre>
                  </div>
               </div>
               
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Payload</p>
                  <div className="bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-[11px] text-emerald-400/80 shadow-inner">
                    <pre>{JSON.stringify(jwtMock.payload, null, 2)}</pre>
                  </div>
               </div>

               <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-3">
                     <Terminal size={14} className="text-blue-500" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Signer Identity</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono leading-relaxed truncate">
                    X-Auth0-PubKey: MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA...
                  </p>
               </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-900 flex justify-between items-center relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Node Synced</span>
               </div>
               <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">Auth0_Bridge v1.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyManager;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/PolicyManager.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Lock, Key, ShieldAlert, Fingerprint, 
  Terminal, Activity, RefreshCw, Plus, Trash2, 
  CheckCircle2, Code, Shield, Eye, Database, Zap, Loader2, Globe,
  // fix: Added missing X icon import
  X
} from 'lucide-react';
import { auth0Service, AUTH0_CONFIG } from '../services/auth0Service';

interface PermissionScope {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const PolicyManager: React.FC = () => {
  const [scopes, setScopes] = useState<PermissionScope[]>([
    { id: '1', name: 'read:accounts', description: 'Access aggregate ledger data', enabled: true },
    { id: '2', name: 'write:payments', description: 'Initiate disbursement signals', enabled: true },
    { id: '3', name: 'manage:foundry', description: 'Authorize NFT synthesis', enabled: false },
    { id: '4', name: 'admin:registry', description: 'Full node lifecycle control', enabled: false },
  ]);

  const [isRotating, setIsRotating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const jwtMock = useMemo(() => ({
    header: { alg: "RS256", typ: "JWT", kid: "LQI_SIGNER_KEY_01" },
    payload: {
      iss: AUTH0_CONFIG.issuerBaseURL,
      aud: AUTH0_CONFIG.audience,
      sub: "nexus|node_master_001",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: scopes.filter(s => s.enabled).map(s => s.name).join(' ')
    }
  }), [scopes]);

  const toggleScope = (id: string) => {
    setScopes(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleRotate = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 1500);
  };

  const handleTestHandshake = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const activeScopes = scopes.filter(s => s.enabled).map(s => s.name);
      const token = await auth0Service.getSimulatedToken(activeScopes);
      
      // Simulate network request to the secured resource
      const result = await auth0Service.fetchSecuredResource(token);
      
      if (result.success) {
        setTestResult({ success: true, msg: result.data || 'Secured Resource Accessed Successfully.' });
      } else {
        setTestResult({ success: false, msg: result.error || 'Authorization Rejected.' });
      }
    } catch (err) {
      setTestResult({ success: false, msg: 'Internal Gateway Failure.' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Policy <span className="text-blue-500 not-italic">Manager</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" />
            JWT RS256 Authorization Control Node
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleTestHandshake}
            disabled={isTesting}
            className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40"
          >
            {isTesting ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            <span>Test Secure Bridge</span>
          </button>
          <button 
            onClick={handleRotate}
            disabled={isRotating}
            className="flex items-center space-x-2 px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            {isRotating ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            <span>Rotate Auth0 Secret</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7 space-y-8">
          {testResult && (
            <div className={`p-8 rounded-[2rem] border animate-in zoom-in-95 duration-300 flex items-center gap-6 ${testResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${testResult.success ? 'bg-emerald-500 text-white border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 text-white border-rose-400/30 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`}>
                  {testResult.success ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Handshake Result</p>
                  <p className="text-sm font-bold uppercase italic">{testResult.msg}</p>
               </div>
               <button onClick={() => setTestResult(null)} className="ml-auto p-2 text-zinc-600 hover:text-white"><X size={18} /></button>
            </div>
          )}

          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield size={160} className="text-blue-500" />
            </div>
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Define Permissions</h3>
                   <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-2">Granular OAuth2 Scopes</p>
                </div>
                <button className="p-3 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {scopes.map(scope => (
                  <div key={scope.id} className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${scope.enabled ? 'bg-blue-600/5 border-blue-500/20' : 'bg-black border-zinc-900 opacity-60'}`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${scope.enabled ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-900 text-zinc-700'}`}>
                        <Lock size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic tracking-widest">{scope.name}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{scope.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleScope(scope.id)}
                      className={`w-14 h-7 rounded-full relative transition-all duration-300 ${scope.enabled ? 'bg-blue-600 shadow-lg shadow-blue-900/30' : 'bg-zinc-800'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${scope.enabled ? 'left-8' : 'left-1'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/20 rounded-[3rem] p-10 flex items-center gap-10 shadow-2xl backdrop-blur-xl group">
             <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
               <ShieldAlert size={36} />
             </div>
             <div>
               <h4 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Enforcement Mode: <span className="text-blue-500">STRICT</span></h4>
               <p className="text-zinc-500 text-sm font-medium leading-relaxed italic max-w-lg">
                 "All endpoints defined in the LQI mesh require valid JWT tokens issued by Auth0 university cluster. Unauthorized requests are shredded immediately."
               </p>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 flex flex-col h-full shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Code size={120} className="text-emerald-500" />
            </div>
            
            <div className="mb-10 relative z-10 flex justify-between items-start">
              <div>
                <h3 className="text-white font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active JWT Handshake
                </h3>
                <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1">RS256 Encoded Fragment</p>
              </div>
            </div>

            <div className="space-y-6 flex-1 relative z-10">
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Header</p>
                  <div className="bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-[11px] text-blue-400/80 shadow-inner">
                    <pre>{JSON.stringify(jwtMock.header, null, 2)}</pre>
                  </div>
               </div>
               
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Payload</p>
                  <div className="bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-[11px] text-emerald-400/80 shadow-inner">
                    <pre>{JSON.stringify(jwtMock.payload, null, 2)}</pre>
                  </div>
               </div>

               <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-3">
                     <Terminal size={14} className="text-blue-500" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Signer Identity</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono leading-relaxed truncate">
                    X-Auth0-PubKey: MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA...
                  </p>
               </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-900 flex justify-between items-center relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Node Synced</span>
               </div>
               <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">Auth0_Bridge v1.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyManager;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/PolicyManager.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Lock, Key, ShieldAlert, Fingerprint, 
  Terminal, Activity, RefreshCw, Plus, Trash2, 
  CheckCircle2, Code, Shield, Eye, Database, Zap, Loader2, Globe,
  // fix: Added missing X icon import
  X
} from 'lucide-react';
import { auth0Service, AUTH0_CONFIG } from '../services/auth0Service';

interface PermissionScope {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const PolicyManager: React.FC = () => {
  const [scopes, setScopes] = useState<PermissionScope[]>([
    { id: '1', name: 'read:accounts', description: 'Access aggregate ledger data', enabled: true },
    { id: '2', name: 'write:payments', description: 'Initiate disbursement signals', enabled: true },
    { id: '3', name: 'manage:foundry', description: 'Authorize NFT synthesis', enabled: false },
    { id: '4', name: 'admin:registry', description: 'Full node lifecycle control', enabled: false },
  ]);

  const [isRotating, setIsRotating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const jwtMock = useMemo(() => ({
    header: { alg: "RS256", typ: "JWT", kid: "LQI_SIGNER_KEY_01" },
    payload: {
      iss: AUTH0_CONFIG.issuerBaseURL,
      aud: AUTH0_CONFIG.audience,
      sub: "nexus|node_master_001",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: scopes.filter(s => s.enabled).map(s => s.name).join(' ')
    }
  }), [scopes]);

  const toggleScope = (id: string) => {
    setScopes(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleRotate = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 1500);
  };

  const handleTestHandshake = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const activeScopes = scopes.filter(s => s.enabled).map(s => s.name);
      const token = await auth0Service.getSimulatedToken(activeScopes);
      
      // Simulate network request to the secured resource
      const result = await auth0Service.fetchSecuredResource(token);
      
      if (result.success) {
        setTestResult({ success: true, msg: result.data || 'Secured Resource Accessed Successfully.' });
      } else {
        setTestResult({ success: false, msg: result.error || 'Authorization Rejected.' });
      }
    } catch (err) {
      setTestResult({ success: false, msg: 'Internal Gateway Failure.' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Policy <span className="text-blue-500 not-italic">Manager</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" />
            JWT RS256 Authorization Control Node
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleTestHandshake}
            disabled={isTesting}
            className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40"
          >
            {isTesting ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            <span>Test Secure Bridge</span>
          </button>
          <button 
            onClick={handleRotate}
            disabled={isRotating}
            className="flex items-center space-x-2 px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            {isRotating ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            <span>Rotate Auth0 Secret</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7 space-y-8">
          {testResult && (
            <div className={`p-8 rounded-[2rem] border animate-in zoom-in-95 duration-300 flex items-center gap-6 ${testResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${testResult.success ? 'bg-emerald-500 text-white border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 text-white border-rose-400/30 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`}>
                  {testResult.success ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Handshake Result</p>
                  <p className="text-sm font-bold uppercase italic">{testResult.msg}</p>
               </div>
               <button onClick={() => setTestResult(null)} className="ml-auto p-2 text-zinc-600 hover:text-white"><X size={18} /></button>
            </div>
          )}

          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield size={160} className="text-blue-500" />
            </div>
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Define Permissions</h3>
                   <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-2">Granular OAuth2 Scopes</p>
                </div>
                <button className="p-3 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {scopes.map(scope => (
                  <div key={scope.id} className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${scope.enabled ? 'bg-blue-600/5 border-blue-500/20' : 'bg-black border-zinc-900 opacity-60'}`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${scope.enabled ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-900 text-zinc-700'}`}>
                        <Lock size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic tracking-widest">{scope.name}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{scope.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleScope(scope.id)}
                      className={`w-14 h-7 rounded-full relative transition-all duration-300 ${scope.enabled ? 'bg-blue-600 shadow-lg shadow-blue-900/30' : 'bg-zinc-800'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${scope.enabled ? 'left-8' : 'left-1'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/20 rounded-[3rem] p-10 flex items-center gap-10 shadow-2xl backdrop-blur-xl group">
             <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
               <ShieldAlert size={36} />
             </div>
             <div>
               <h4 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Enforcement Mode: <span className="text-blue-500">STRICT</span></h4>
               <p className="text-zinc-500 text-sm font-medium leading-relaxed italic max-w-lg">
                 "All endpoints defined in the LQI mesh require valid JWT tokens issued by Auth0 university cluster. Unauthorized requests are shredded immediately."
               </p>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 flex flex-col h-full shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Code size={120} className="text-emerald-500" />
            </div>
            
            <div className="mb-10 relative z-10 flex justify-between items-start">
              <div>
                <h3 className="text-white font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active JWT Handshake
                </h3>
                <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1">RS256 Encoded Fragment</p>
              </div>
            </div>

            <div className="space-y-6 flex-1 relative z-10">
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Header</p>
                  <div className="bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-[11px] text-blue-400/80 shadow-inner">
                    <pre>{JSON.stringify(jwtMock.header, null, 2)}</pre>
                  </div>
               </div>
               
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Payload</p>
                  <div className="bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-[11px] text-emerald-400/80 shadow-inner">
                    <pre>{JSON.stringify(jwtMock.payload, null, 2)}</pre>
                  </div>
               </div>

               <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-3">
                     <Terminal size={14} className="text-blue-500" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Signer Identity</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono leading-relaxed truncate">
                    X-Auth0-PubKey: MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA...
                  </p>
               </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-900 flex justify-between items-center relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Node Synced</span>
               </div>
               <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">Auth0_Bridge v1.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyManager;
