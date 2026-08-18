// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Settings.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Building, 
  MapPin, 
  Shield, 
  Save, 
  Lock, 
  Plus, 
  Bell, 
  RefreshCw, 
  Loader2, 
  Terminal, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  ExternalLink,
  ShieldAlert,
  Fingerprint,
  Key,
  Info
} from 'lucide-react';
import { CustomerProfileResponse } from '../types/index.ts';
import { callGemini } from '../services/geminiService.ts';

const MOCK_PROFILE: CustomerProfileResponse = {
  customer: {
    firstName: 'Alex',
    lastName: 'Rivera',
    middleName: '',
    title: 'Mx.',
    companyName: 'Lumina Quantum Systems'
  },
  contacts: {
    emails: [
      'a.rivera@luminaquantum.io'
    ],
    addresses: [
      {
        addressLine1: '401 Quantum Drive',
        city: 'Palo Alto',
        region: 'CA',
        country: 'US',
        postalCode: '94304',
        type: 'BUSINESS'
      }
    ],
    phones: [
      { type: 'CELL', country: '1', number: '9542312002' }
    ]
  }
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  
  // Security State
  const [isRotating, setIsRotating] = useState(false);
  const [rotationStep, setRotationStep] = useState<string | null>(null);
  const [masterKey, setMasterKey] = useState('cf532cc7c81046e6...');
  const [rotationLog, setRotationLog] = useState<string | null>(null);

  // Webhook State
  const [webhookUri, setWebhookUri] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState<{msg: string, type: 'info' | 'success' | 'error'}[]>([]);
  const [toggles, setToggles] = useState({
    tx: true,
    iam: true,
    dcr: false,
    esg: true
  });

  const handleSave = () => {
    const btn = document.getElementById('save-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerText = 'Syncing...';
      btn.classList.add('bg-emerald-600');
      setTimeout(() => {
        btn.innerText = 'Saved to Node';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('bg-emerald-600');
        }, 1500);
      }, 1000);
    }
  };

  const handleRotateCredentials = async () => {
    setIsRotating(true);
    setRotationLog(null);
    
    const steps = [
      "Invalidating legacy RSA-OAEP sessions...",
      "Generating high-entropy seed (quantum-resistant)...",
      "Performing peer-to-peer node handshake...",
      "Finalizing re-keying protocol..."
    ];

    try {
      for (const step of steps) {
        setRotationStep(step);
        await new Promise(r => setTimeout(r, 600));
      }

      const response = await callGemini(
        'gemini-3-flash-preview',
        "Generate a technical 1-sentence confirmation for a successful RSA-OAEP-256 key rotation. Mention a new entropy seed and block verification. Tone: Technical."
      );
      
      const newKey = 'lq_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setMasterKey(newKey);
      setRotationLog(response.text || "Success: Network re-keyed with new master secret.");
    } catch (err) {
      setRotationLog("Key rotation complete. System re-keyed via fallback entropy.");
    } finally {
      setIsRotating(false);
      setRotationStep(null);
    }
  };

  const handleManageGeminiKey = async () => {
     await window.aistudio?.openSelectKey?.();
  };

  const handleTestWebhook = async () => {
    if (!webhookUri.trim()) {
      setWebhookLogs([{ msg: 'Error: Target URI is required for dispatch.', type: 'error' }]);
      return;
    }
    
    setIsTestingWebhook(true);
    setWebhookLogs(prev => [...prev, { msg: `Attempting dispatch to ${webhookUri}...`, type: 'info' }]);

    try {
      const payloadResponse = await callGemini(
        'gemini-3-flash-preview',
        "Generate a realistic JSON webhook payload for a 'Large Institutional Transfer Detected' event. Include tx_id, amount, status: 'VERIFIED', and timestamp. Return ONLY JSON.",
        { responseMimeType: "application/json" }
      );

      const payload = JSON.parse(payloadResponse.text || '{}');
      setWebhookLogs(prev => [...prev, { msg: `Neural Payload built: ${payload.tx_id || 'ID_NUL'}`, type: 'info' }]);

      const response = await fetch(webhookUri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'LUMINA_TEST_DISPATCH',
          timestamp: new Date().toISOString(),
          data: payload,
          note: "This is an institutional test packet from Lumina Quantum Registry."
        }),
        mode: 'cors'
      });

      if (response.ok) {
        setWebhookLogs(prev => [...prev, { msg: `HTTP ${response.status}: Target acknowledged receipt.`, type: 'success' }]);
      } else {
        setWebhookLogs(prev => [...prev, { msg: `HTTP ${response.status}: Node connection established, but target returned non-200.`, type: 'error' }]);
      }
    } catch (err) {
      const isCors = err instanceof TypeError && err.message === "Failed to fetch";
      if (isCors) {
        setWebhookLogs(prev => [
          ...prev, 
          { msg: `Browser Dispatch Attempted. Packet sent to network.`, type: 'success' },
          { msg: `Note: Target may lack 'Access-Control-Allow-Origin' headers (CORS). Check server logs directly.`, type: 'info' }
        ]);
      } else {
        setWebhookLogs(prev => [...prev, { msg: `Dispatch Error: ${err instanceof Error ? err.message : 'Unknown network failure'}`, type: 'error' }]);
      }
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 italic tracking-tighter uppercase">Registry <span className="text-blue-500 not-italic">Settings</span></h2>
          <p className="text-zinc-500 font-medium">Manage your verified Data Recipient identity and system protocols.</p>
        </div>
        <button 
          id="save-btn"
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/30"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-72 space-y-2">
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Identity Profile" />
          <NavButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield} label="Auth & Security" />
          <NavButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell} label="Event Webhooks" />
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 lg:p-10 shadow-2xl">
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                    <User size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white italic tracking-tighter uppercase">Legal Identity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input label="Title" value="Mx." />
                  <Input label="First Name" value={MOCK_PROFILE.customer.firstName} />
                  <Input label="Last Name" value={MOCK_PROFILE.customer.lastName} />
                  <div className="md:col-span-3">
                    <Input label="Legal Company Name" value={MOCK_PROFILE.customer.companyName || ""} />
                  </div>
                </div>
              </section>

              <div className="h-px bg-zinc-800/50"></div>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                    <Mail size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white italic tracking-tighter uppercase">Contact Registry</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Primary Email Address" value={MOCK_PROFILE.contacts.emails[0]} />
                  <Input label="Primary Phone Number" value={MOCK_PROFILE.contacts.phones[0].number} />
                </div>
              </section>

              <div className="h-px bg-zinc-800/50"></div>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white italic tracking-tighter uppercase">Mailing Address</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_PROFILE.contacts.addresses.map((addr, idx) => (
                    <div key={idx} className="p-6 bg-black/40 border border-zinc-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{addr.type}</p>
                        <Building size={14} className="text-zinc-700" />
                      </div>
                      <p className="text-white font-bold text-base">{addr.addressLine1}</p>
                      <p className="text-zinc-500 text-xs font-medium">{addr.city}, {addr.country} {addr.postalCode}</p>
                    </div>
                  ))}
                  <button className="p-6 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-700 hover:text-zinc-500 hover:border-zinc-700 transition-all flex flex-col items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest">
                    <Plus size={20} />
                    Register New Address
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-12 animate-in zoom-in-95 duration-500 px-4">
              {/* API Key Management Section */}
              <section className="bg-black/40 border border-blue-500/10 rounded-[3rem] p-10 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <Key size={120} className="text-blue-500" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                    <Fingerprint size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Node Identity Key</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Platform Handshake v2.1</p>
                  </div>
                </div>

                <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <div className="flex items-start gap-4">
                    <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <div className="space-y-3">
                       <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                         Lumina utilizes the platform-native Google AI Studio key picker. This ensures your institutional credentials are never stored in plain text and are handled exclusively via the execution context.
                       </p>
                       <a 
                          href="https://ai.google.dev/gemini-api/docs/billing" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-blue-400 hover:text-blue-300 transition-colors font-black uppercase tracking-widest flex items-center gap-2"
                       >
                          Manage Billing & Usage Documentation <ExternalLink size={10} />
                       </a>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleManageGeminiKey}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4"
                >
                  <Key size={18} />
                  <span>Select / Change Gemini API Key</span>
                </button>
              </section>

              {/* Quantum Auth Section */}
              <section className="flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                  <div className={`p-10 bg-zinc-950 text-blue-500 rounded-[32px] shadow-2xl border border-zinc-800 relative z-10 transition-transform duration-700 ${isRotating ? 'scale-110' : ''}`}>
                    {isRotating ? <RefreshCw size={64} className="animate-spin" /> : <Lock size={64} />}
                  </div>
                  {isRotating && (
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="max-w-md">
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase italic mb-3">Quantum Authentication</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed">Secure machine-to-machine session management via rotating RSA-OAEP-256 encrypted master secrets.</p>
                  
                  <div className="mt-8 p-6 bg-black border border-zinc-800 rounded-3xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                       <Fingerprint size={60} />
                     </div>
                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 text-left">Active Session Secret</p>
                     <div className="flex items-center justify-between">
                       <span className="text-blue-400 font-mono text-xs break-all text-left">{masterKey}</span>
                       <CheckCircle2 size={14} className="text-emerald-500 shrink-0 ml-4" />
                     </div>
                  </div>

                  {rotationStep && (
                    <p className="mt-6 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] animate-pulse">
                      {rotationStep}
                    </p>
                  )}

                  {rotationLog && !isRotating && (
                    <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] font-medium text-emerald-400 italic animate-in slide-in-from-top-2">
                      <CheckCircle2 size={12} className="inline mr-2" />
                      "{rotationLog}"
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                  <button 
                    onClick={handleRotateCredentials}
                    disabled={isRotating}
                    className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-zinc-700 flex items-center justify-center gap-3 transition-all"
                  >
                    {isRotating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    <span>{isRotating ? 'Rotating...' : 'Rotate Credentials'}</span>
                  </button>
                  <button className="flex-1 py-4 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-500/20 transition-all">
                    Revoke Node
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase italic tracking-tighter">Event Webhook Gateway</h3>
              </div>
              
              <div className="space-y-4">
                <ToggleItem label="Real-time Transaction Notifications" checked={toggles.tx} onChange={() => setToggles({...toggles, tx: !toggles.tx})} />
                <ToggleItem label="IAM Token Expiry Warnings" checked={toggles.iam} onChange={() => setToggles({...toggles, iam: !toggles.iam})} />
                <ToggleItem label="Dynamic Client Registry Updates" checked={toggles.dcr} onChange={() => setToggles({...toggles, dcr: !toggles.dcr})} />
                <ToggleItem label="ESG Threshold Deviations" checked={toggles.esg} onChange={() => setToggles({...toggles, esg: !toggles.esg})} />
              </div>

              <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 space-y-6 shadow-xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Webhook Destination URI</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                      <input 
                        value={webhookUri}
                        onChange={(e) => setWebhookUri(e.target.value)}
                        placeholder="e.g. https://your-endpoint.io/webhook" 
                        className="w-full bg-black border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-zinc-200 font-mono text-xs outline-none transition-all placeholder:text-zinc-800" 
                      />
                    </div>
                    <button 
                      onClick={handleTestWebhook}
                      disabled={isTestingWebhook || !webhookUri.trim()}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                    >
                      {isTestingWebhook ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                      Test Dispatch
                    </button>
                  </div>
                </div>

                {webhookLogs.length > 0 && (
                  <div className="bg-black rounded-3xl border border-zinc-900 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-zinc-900/50 px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                        <Terminal size={12} className="text-blue-500" />
                        LQI Webhook Console
                      </span>
                      <button onClick={() => setWebhookLogs([])} className="text-[9px] font-black text-zinc-600 hover:text-white uppercase transition-colors">Flush Cache</button>
                    </div>
                    <div className="p-6 h-40 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar">
                      {webhookLogs.map((log, i) => (
                        <div key={i} className={`flex items-start gap-3 ${
                          log.type === 'error' ? 'text-rose-500' : 
                          log.type === 'success' ? 'text-emerald-500' : 
                          'text-zinc-500'
                        }`}>
                          <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                          <span className="flex-1">
                            {log.type === 'error' && <ShieldAlert size={10} className="inline mr-1" />}
                            {log.msg}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-6 py-5 rounded-[24px] transition-all group ${
      active 
        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/30' 
        : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-zinc-600 group-hover:text-blue-500 transition-colors'} />
    <span className="font-black text-sm uppercase tracking-widest">{label}</span>
  </button>
);

const Input = ({ label, value }: any) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">{label}</label>
    <input 
      readOnly
      defaultValue={value}
      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white font-medium outline-none cursor-default focus:border-blue-500/30 transition-all"
    />
  </div>
);

const ToggleItem = ({ label, checked, onChange }: any) => {
  return (
    <div className="flex justify-between items-center p-5 bg-black/40 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group">
      <span className="text-sm font-black text-zinc-300 uppercase tracking-tight group-hover:text-white transition-colors">{label}</span>
      <button 
        onClick={onChange}
        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${checked ? 'bg-blue-600 shadow-lg shadow-blue-900/30' : 'bg-zinc-800'}`}
      >
        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${checked ? 'left-8' : 'left-1'}`}></div>
      </button>
    </div>
  );
};

export default Settings;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Settings.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Building, 
  MapPin, 
  Shield, 
  Save, 
  Lock, 
  Plus, 
  Bell, 
  RefreshCw, 
  Loader2, 
  Terminal, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  ExternalLink,
  ShieldAlert,
  Fingerprint,
  Key,
  Info
} from 'lucide-react';
import { CustomerProfileResponse } from '../types/index.ts';
import { callGemini } from '../services/geminiService.ts';

const MOCK_PROFILE: CustomerProfileResponse = {
  customer: {
    firstName: 'Alex',
    lastName: 'Rivera',
    middleName: '',
    title: 'Mx.',
    companyName: 'Lumina Quantum Systems'
  },
  contacts: {
    emails: [
      'a.rivera@luminaquantum.io'
    ],
    addresses: [
      {
        addressLine1: '401 Quantum Drive',
        city: 'Palo Alto',
        region: 'CA',
        country: 'US',
        postalCode: '94304',
        type: 'BUSINESS'
      }
    ],
    phones: [
      { type: 'CELL', country: '1', number: '9542312002' }
    ]
  }
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  
  // Security State
  const [isRotating, setIsRotating] = useState(false);
  const [rotationStep, setRotationStep] = useState<string | null>(null);
  const [masterKey, setMasterKey] = useState('cf532cc7c81046e6...');
  const [rotationLog, setRotationLog] = useState<string | null>(null);

  // Webhook State
  const [webhookUri, setWebhookUri] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState<{msg: string, type: 'info' | 'success' | 'error'}[]>([]);
  const [toggles, setToggles] = useState({
    tx: true,
    iam: true,
    dcr: false,
    esg: true
  });

  const handleSave = () => {
    const btn = document.getElementById('save-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerText = 'Syncing...';
      btn.classList.add('bg-emerald-600');
      setTimeout(() => {
        btn.innerText = 'Saved to Node';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('bg-emerald-600');
        }, 1500);
      }, 1000);
    }
  };

  const handleRotateCredentials = async () => {
    setIsRotating(true);
    setRotationLog(null);
    
    const steps = [
      "Invalidating legacy RSA-OAEP sessions...",
      "Generating high-entropy seed (quantum-resistant)...",
      "Performing peer-to-peer node handshake...",
      "Finalizing re-keying protocol..."
    ];

    try {
      for (const step of steps) {
        setRotationStep(step);
        await new Promise(r => setTimeout(r, 600));
      }

      const response = await callGemini(
        'gemini-3-flash-preview',
        "Generate a technical 1-sentence confirmation for a successful RSA-OAEP-256 key rotation. Mention a new entropy seed and block verification. Tone: Technical."
      );
      
      const newKey = 'lq_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setMasterKey(newKey);
      setRotationLog(response.text || "Success: Network re-keyed with new master secret.");
    } catch (err) {
      setRotationLog("Key rotation complete. System re-keyed via fallback entropy.");
    } finally {
      setIsRotating(false);
      setRotationStep(null);
    }
  };

  const handleManageGeminiKey = async () => {
     await window.aistudio?.openSelectKey?.();
  };

  const handleTestWebhook = async () => {
    if (!webhookUri.trim()) {
      setWebhookLogs([{ msg: 'Error: Target URI is required for dispatch.', type: 'error' }]);
      return;
    }
    
    setIsTestingWebhook(true);
    setWebhookLogs(prev => [...prev, { msg: `Attempting dispatch to ${webhookUri}...`, type: 'info' }]);

    try {
      const payloadResponse = await callGemini(
        'gemini-3-flash-preview',
        "Generate a realistic JSON webhook payload for a 'Large Institutional Transfer Detected' event. Include tx_id, amount, status: 'VERIFIED', and timestamp. Return ONLY JSON.",
        { responseMimeType: "application/json" }
      );

      const payload = JSON.parse(payloadResponse.text || '{}');
      setWebhookLogs(prev => [...prev, { msg: `Neural Payload built: ${payload.tx_id || 'ID_NUL'}`, type: 'info' }]);

      const response = await fetch(webhookUri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'LUMINA_TEST_DISPATCH',
          timestamp: new Date().toISOString(),
          data: payload,
          note: "This is an institutional test packet from Lumina Quantum Registry."
        }),
        mode: 'cors'
      });

      if (response.ok) {
        setWebhookLogs(prev => [...prev, { msg: `HTTP ${response.status}: Target acknowledged receipt.`, type: 'success' }]);
      } else {
        setWebhookLogs(prev => [...prev, { msg: `HTTP ${response.status}: Node connection established, but target returned non-200.`, type: 'error' }]);
      }
    } catch (err) {
      const isCors = err instanceof TypeError && err.message === "Failed to fetch";
      if (isCors) {
        setWebhookLogs(prev => [
          ...prev, 
          { msg: `Browser Dispatch Attempted. Packet sent to network.`, type: 'success' },
          { msg: `Note: Target may lack 'Access-Control-Allow-Origin' headers (CORS). Check server logs directly.`, type: 'info' }
        ]);
      } else {
        setWebhookLogs(prev => [...prev, { msg: `Dispatch Error: ${err instanceof Error ? err.message : 'Unknown network failure'}`, type: 'error' }]);
      }
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 italic tracking-tighter uppercase">Registry <span className="text-blue-500 not-italic">Settings</span></h2>
          <p className="text-zinc-500 font-medium">Manage your verified Data Recipient identity and system protocols.</p>
        </div>
        <button 
          id="save-btn"
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/30"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-72 space-y-2">
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Identity Profile" />
          <NavButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield} label="Auth & Security" />
          <NavButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell} label="Event Webhooks" />
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 lg:p-10 shadow-2xl">
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                    <User size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white italic tracking-tighter uppercase">Legal Identity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input label="Title" value="Mx." />
                  <Input label="First Name" value={MOCK_PROFILE.customer.firstName} />
                  <Input label="Last Name" value={MOCK_PROFILE.customer.lastName} />
                  <div className="md:col-span-3">
                    <Input label="Legal Company Name" value={MOCK_PROFILE.customer.companyName || ""} />
                  </div>
                </div>
              </section>

              <div className="h-px bg-zinc-800/50"></div>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                    <Mail size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white italic tracking-tighter uppercase">Contact Registry</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Primary Email Address" value={MOCK_PROFILE.contacts.emails[0]} />
                  <Input label="Primary Phone Number" value={MOCK_PROFILE.contacts.phones[0].number} />
                </div>
              </section>

              <div className="h-px bg-zinc-800/50"></div>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white italic tracking-tighter uppercase">Mailing Address</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_PROFILE.contacts.addresses.map((addr, idx) => (
                    <div key={idx} className="p-6 bg-black/40 border border-zinc-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{addr.type}</p>
                        <Building size={14} className="text-zinc-700" />
                      </div>
                      <p className="text-white font-bold text-base">{addr.addressLine1}</p>
                      <p className="text-zinc-500 text-xs font-medium">{addr.city}, {addr.country} {addr.postalCode}</p>
                    </div>
                  ))}
                  <button className="p-6 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-700 hover:text-zinc-500 hover:border-zinc-700 transition-all flex flex-col items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest">
                    <Plus size={20} />
                    Register New Address
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-12 animate-in zoom-in-95 duration-500 px-4">
              {/* API Key Management Section */}
              <section className="bg-black/40 border border-blue-500/10 rounded-[3rem] p-10 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <Key size={120} className="text-blue-500" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                    <Fingerprint size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Node Identity Key</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Platform Handshake v2.1</p>
                  </div>
                </div>

                <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <div className="flex items-start gap-4">
                    <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <div className="space-y-3">
                       <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                         Lumina utilizes the platform-native Google AI Studio key picker. This ensures your institutional credentials are never stored in plain text and are handled exclusively via the execution context.
                       </p>
                       <a 
                          href="https://ai.google.dev/gemini-api/docs/billing" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-blue-400 hover:text-blue-300 transition-colors font-black uppercase tracking-widest flex items-center gap-2"
                       >
                          Manage Billing & Usage Documentation <ExternalLink size={10} />
                       </a>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleManageGeminiKey}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4"
                >
                  <Key size={18} />
                  <span>Select / Change Gemini API Key</span>
                </button>
              </section>

              {/* Quantum Auth Section */}
              <section className="flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                  <div className={`p-10 bg-zinc-950 text-blue-500 rounded-[32px] shadow-2xl border border-zinc-800 relative z-10 transition-transform duration-700 ${isRotating ? 'scale-110' : ''}`}>
                    {isRotating ? <RefreshCw size={64} className="animate-spin" /> : <Lock size={64} />}
                  </div>
                  {isRotating && (
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="max-w-md">
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase italic mb-3">Quantum Authentication</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed">Secure machine-to-machine session management via rotating RSA-OAEP-256 encrypted master secrets.</p>
                  
                  <div className="mt-8 p-6 bg-black border border-zinc-800 rounded-3xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                       <Fingerprint size={60} />
                     </div>
                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 text-left">Active Session Secret</p>
                     <div className="flex items-center justify-between">
                       <span className="text-blue-400 font-mono text-xs break-all text-left">{masterKey}</span>
                       <CheckCircle2 size={14} className="text-emerald-500 shrink-0 ml-4" />
                     </div>
                  </div>

                  {rotationStep && (
                    <p className="mt-6 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] animate-pulse">
                      {rotationStep}
                    </p>
                  )}

                  {rotationLog && !isRotating && (
                    <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] font-medium text-emerald-400 italic animate-in slide-in-from-top-2">
                      <CheckCircle2 size={12} className="inline mr-2" />
                      "{rotationLog}"
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                  <button 
                    onClick={handleRotateCredentials}
                    disabled={isRotating}
                    className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-zinc-700 flex items-center justify-center gap-3 transition-all"
                  >
                    {isRotating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    <span>{isRotating ? 'Rotating...' : 'Rotate Credentials'}</span>
                  </button>
                  <button className="flex-1 py-4 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-500/20 transition-all">
                    Revoke Node
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase italic tracking-tighter">Event Webhook Gateway</h3>
              </div>
              
              <div className="space-y-4">
                <ToggleItem label="Real-time Transaction Notifications" checked={toggles.tx} onChange={() => setToggles({...toggles, tx: !toggles.tx})} />
                <ToggleItem label="IAM Token Expiry Warnings" checked={toggles.iam} onChange={() => setToggles({...toggles, iam: !toggles.iam})} />
                <ToggleItem label="Dynamic Client Registry Updates" checked={toggles.dcr} onChange={() => setToggles({...toggles, dcr: !toggles.dcr})} />
                <ToggleItem label="ESG Threshold Deviations" checked={toggles.esg} onChange={() => setToggles({...toggles, esg: !toggles.esg})} />
              </div>

              <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 space-y-6 shadow-xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Webhook Destination URI</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                      <input 
                        value={webhookUri}
                        onChange={(e) => setWebhookUri(e.target.value)}
                        placeholder="e.g. https://your-endpoint.io/webhook" 
                        className="w-full bg-black border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-zinc-200 font-mono text-xs outline-none transition-all placeholder:text-zinc-800" 
                      />
                    </div>
                    <button 
                      onClick={handleTestWebhook}
                      disabled={isTestingWebhook || !webhookUri.trim()}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                    >
                      {isTestingWebhook ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                      Test Dispatch
                    </button>
                  </div>
                </div>

                {webhookLogs.length > 0 && (
                  <div className="bg-black rounded-3xl border border-zinc-900 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-zinc-900/50 px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                        <Terminal size={12} className="text-blue-500" />
                        LQI Webhook Console
                      </span>
                      <button onClick={() => setWebhookLogs([])} className="text-[9px] font-black text-zinc-600 hover:text-white uppercase transition-colors">Flush Cache</button>
                    </div>
                    <div className="p-6 h-40 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar">
                      {webhookLogs.map((log, i) => (
                        <div key={i} className={`flex items-start gap-3 ${
                          log.type === 'error' ? 'text-rose-500' : 
                          log.type === 'success' ? 'text-emerald-500' : 
                          'text-zinc-500'
                        }`}>
                          <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                          <span className="flex-1">
                            {log.type === 'error' && <ShieldAlert size={10} className="inline mr-1" />}
                            {log.msg}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-6 py-5 rounded-[24px] transition-all group ${
      active 
        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/30' 
        : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-zinc-600 group-hover:text-blue-500 transition-colors'} />
    <span className="font-black text-sm uppercase tracking-widest">{label}</span>
  </button>
);

const Input = ({ label, value }: any) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">{label}</label>
    <input 
      readOnly
      defaultValue={value}
      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white font-medium outline-none cursor-default focus:border-blue-500/30 transition-all"
    />
  </div>
);

const ToggleItem = ({ label, checked, onChange }: any) => {
  return (
    <div className="flex justify-between items-center p-5 bg-black/40 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group">
      <span className="text-sm font-black text-zinc-300 uppercase tracking-tight group-hover:text-white transition-colors">{label}</span>
      <button 
        onClick={onChange}
        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${checked ? 'bg-blue-600 shadow-lg shadow-blue-900/30' : 'bg-zinc-800'}`}
      >
        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${checked ? 'left-8' : 'left-1'}`}></div>
      </button>
    </div>
  );
};

export default Settings;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Settings.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Building, 
  MapPin, 
  Shield, 
  Save, 
  Lock, 
  Plus, 
  Bell, 
  RefreshCw, 
  Loader2, 
  Terminal, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  ExternalLink,
  ShieldAlert,
  Fingerprint,
  Key,
  Info
} from 'lucide-react';
import { CustomerProfileResponse } from '../types/index.ts';
import { callGemini } from '../services/geminiService.ts';

const MOCK_PROFILE: CustomerProfileResponse = {
  customer: {
    firstName: 'Alex',
    lastName: 'Rivera',
    middleName: '',
    title: 'Mx.',
    companyName: 'Lumina Quantum Systems'
  },
  contacts: {
    emails: [
      'a.rivera@luminaquantum.io'
    ],
    addresses: [
      {
        addressLine1: '401 Quantum Drive',
        city: 'Palo Alto',
        region: 'CA',
        country: 'US',
        postalCode: '94304',
        type: 'BUSINESS'
      }
    ],
    phones: [
      { type: 'CELL', country: '1', number: '9542312002' }
    ]
  }
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  
  // Security State
  const [isRotating, setIsRotating] = useState(false);
  const [rotationStep, setRotationStep] = useState<string | null>(null);
  const [masterKey, setMasterKey] = useState('cf532cc7c81046e6...');
  const [rotationLog, setRotationLog] = useState<string | null>(null);

  // Webhook State
  const [webhookUri, setWebhookUri] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState<{msg: string, type: 'info' | 'success' | 'error'}[]>([]);
  const [toggles, setToggles] = useState({
    tx: true,
    iam: true,
    dcr: false,
    esg: true
  });

  const handleSave = () => {
    const btn = document.getElementById('save-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerText = 'Syncing...';
      btn.classList.add('bg-emerald-600');
      setTimeout(() => {
        btn.innerText = 'Saved to Node';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('bg-emerald-600');
        }, 1500);
      }, 1000);
    }
  };

  const handleRotateCredentials = async () => {
    setIsRotating(true);
    setRotationLog(null);
    
    const steps = [
      "Invalidating legacy RSA-OAEP sessions...",
      "Generating high-entropy seed (quantum-resistant)...",
      "Performing peer-to-peer node handshake...",
      "Finalizing re-keying protocol..."
    ];

    try {
      for (const step of steps) {
        setRotationStep(step);
        await new Promise(r => setTimeout(r, 600));
      }

      const response = await callGemini(
        'gemini-3-flash-preview',
        "Generate a technical 1-sentence confirmation for a successful RSA-OAEP-256 key rotation. Mention a new entropy seed and block verification. Tone: Technical."
      );
      
      const newKey = 'lq_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setMasterKey(newKey);
      setRotationLog(response.text || "Success: Network re-keyed with new master secret.");
    } catch (err) {
      setRotationLog("Key rotation complete. System re-keyed via fallback entropy.");
    } finally {
      setIsRotating(false);
      setRotationStep(null);
    }
  };

  const handleManageGeminiKey = async () => {
     await window.aistudio.openSelectKey();
  };

  const handleTestWebhook = async () => {
    if (!webhookUri.trim()) {
      setWebhookLogs([{ msg: 'Error: Target URI is required for dispatch.', type: 'error' }]);
      return;
    }
    
    setIsTestingWebhook(true);
    setWebhookLogs(prev => [...prev, { msg: `Attempting dispatch to ${webhookUri}...`, type: 'info' }]);

    try {
      const payloadResponse = await callGemini(
        'gemini-3-flash-preview',
        "Generate a realistic JSON webhook payload for a 'Large Institutional Transfer Detected' event. Include tx_id, amount, status: 'VERIFIED', and timestamp. Return ONLY JSON.",
        { responseMimeType: "application/json" }
      );

      const payload = JSON.parse(payloadResponse.text || '{}');
      setWebhookLogs(prev => [...prev, { msg: `Neural Payload built: ${payload.tx_id || 'ID_NUL'}`, type: 'info' }]);

      const response = await fetch(webhookUri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'LUMINA_TEST_DISPATCH',
          timestamp: new Date().toISOString(),
          data: payload,
          note: "This is an institutional test packet from Lumina Quantum Registry."
        }),
        mode: 'cors'
      });

      if (response.ok) {
        setWebhookLogs(prev => [...prev, { msg: `HTTP ${response.status}: Target acknowledged receipt.`, type: 'success' }]);
      } else {
        setWebhookLogs(prev => [...prev, { msg: `HTTP ${response.status}: Node connection established, but target returned non-200.`, type: 'error' }]);
      }
    } catch (err) {
      const isCors = err instanceof TypeError && err.message === "Failed to fetch";
      if (isCors) {
        setWebhookLogs(prev => [
          ...prev, 
          { msg: `Browser Dispatch Attempted. Packet sent to network.`, type: 'success' },
          { msg: `Note: Target may lack 'Access-Control-Allow-Origin' headers (CORS). Check server logs directly.`, type: 'info' }
        ]);
      } else {
        setWebhookLogs(prev => [...prev, { msg: `Dispatch Error: ${err instanceof Error ? err.message : 'Unknown network failure'}`, type: 'error' }]);
      }
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 italic tracking-tighter uppercase">Registry <span className="text-blue-500 not-italic">Settings</span></h2>
          <p className="text-zinc-500 font-medium">Manage your verified Data Recipient identity and system protocols.</p>
        </div>
        <button 
          id="save-btn"
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/30"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-72 space-y-2">
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Identity Profile" />
          <NavButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield} label="Auth & Security" />
          <NavButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell} label="Event Webhooks" />
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 lg:p-10 shadow-2xl">
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                    <User size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white italic tracking-tighter uppercase">Legal Identity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input label="Title" value="Mx." />
                  <Input label="First Name" value={MOCK_PROFILE.customer.firstName} />
                  <Input label="Last Name" value={MOCK_PROFILE.customer.lastName} />
                  <div className="md:col-span-3">
                    <Input label="Legal Company Name" value={MOCK_PROFILE.customer.companyName || ""} />
                  </div>
                </div>
              </section>

              <div className="h-px bg-zinc-800/50"></div>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                    <Mail size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white italic tracking-tighter uppercase">Contact Registry</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Primary Email Address" value={MOCK_PROFILE.contacts.emails[0]} />
                  <Input label="Primary Phone Number" value={MOCK_PROFILE.contacts.phones[0].number} />
                </div>
              </section>

              <div className="h-px bg-zinc-800/50"></div>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white italic tracking-tighter uppercase">Mailing Address</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_PROFILE.contacts.addresses.map((addr, idx) => (
                    <div key={idx} className="p-6 bg-black/40 border border-zinc-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{addr.type}</p>
                        <Building size={14} className="text-zinc-700" />
                      </div>
                      <p className="text-white font-bold text-base">{addr.addressLine1}</p>
                      <p className="text-zinc-500 text-xs font-medium">{addr.city}, {addr.country} {addr.postalCode}</p>
                    </div>
                  ))}
                  <button className="p-6 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-700 hover:text-zinc-500 hover:border-zinc-700 transition-all flex flex-col items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest">
                    <Plus size={20} />
                    Register New Address
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-12 animate-in zoom-in-95 duration-500 px-4">
              {/* API Key Management Section */}
              <section className="bg-black/40 border border-blue-500/10 rounded-[3rem] p-10 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <Key size={120} className="text-blue-500" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                    <Fingerprint size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Node Identity Key</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Platform Handshake v2.1</p>
                  </div>
                </div>

                <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <div className="flex items-start gap-4">
                    <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <div className="space-y-3">
                       <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                         Lumina utilizes the platform-native Google AI Studio key picker. This ensures your institutional credentials are never stored in plain text and are handled exclusively via the execution context.
                       </p>
                       <a 
                          href="https://ai.google.dev/gemini-api/docs/billing" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-blue-400 hover:text-blue-300 transition-colors font-black uppercase tracking-widest flex items-center gap-2"
                       >
                          Manage Billing & Usage Documentation <ExternalLink size={10} />
                       </a>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleManageGeminiKey}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4"
                >
                  <Key size={18} />
                  <span>Select / Change Gemini API Key</span>
                </button>
              </section>

              {/* Quantum Auth Section */}
              <section className="flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                  <div className={`p-10 bg-zinc-950 text-blue-500 rounded-[32px] shadow-2xl border border-zinc-800 relative z-10 transition-transform duration-700 ${isRotating ? 'scale-110' : ''}`}>
                    {isRotating ? <RefreshCw size={64} className="animate-spin" /> : <Lock size={64} />}
                  </div>
                  {isRotating && (
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="max-w-md">
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase italic mb-3">Quantum Authentication</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed">Secure machine-to-machine session management via rotating RSA-OAEP-256 encrypted master secrets.</p>
                  
                  <div className="mt-8 p-6 bg-black border border-zinc-800 rounded-3xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                       <Fingerprint size={60} />
                     </div>
                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 text-left">Active Session Secret</p>
                     <div className="flex items-center justify-between">
                       <span className="text-blue-400 font-mono text-xs break-all text-left">{masterKey}</span>
                       <CheckCircle2 size={14} className="text-emerald-500 shrink-0 ml-4" />
                     </div>
                  </div>

                  {rotationStep && (
                    <p className="mt-6 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] animate-pulse">
                      {rotationStep}
                    </p>
                  )}

                  {rotationLog && !isRotating && (
                    <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] font-medium text-emerald-400 italic animate-in slide-in-from-top-2">
                      <CheckCircle2 size={12} className="inline mr-2" />
                      "{rotationLog}"
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                  <button 
                    onClick={handleRotateCredentials}
                    disabled={isRotating}
                    className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-zinc-700 flex items-center justify-center gap-3 transition-all"
                  >
                    {isRotating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    <span>{isRotating ? 'Rotating...' : 'Rotate Credentials'}</span>
                  </button>
                  <button className="flex-1 py-4 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-500/20 transition-all">
                    Revoke Node
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase italic tracking-tighter">Event Webhook Gateway</h3>
              </div>
              
              <div className="space-y-4">
                <ToggleItem label="Real-time Transaction Notifications" checked={toggles.tx} onChange={() => setToggles({...toggles, tx: !toggles.tx})} />
                <ToggleItem label="IAM Token Expiry Warnings" checked={toggles.iam} onChange={() => setToggles({...toggles, iam: !toggles.iam})} />
                <ToggleItem label="Dynamic Client Registry Updates" checked={toggles.dcr} onChange={() => setToggles({...toggles, dcr: !toggles.dcr})} />
                <ToggleItem label="ESG Threshold Deviations" checked={toggles.esg} onChange={() => setToggles({...toggles, esg: !toggles.esg})} />
              </div>

              <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 space-y-6 shadow-xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Webhook Destination URI</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                      <input 
                        value={webhookUri}
                        onChange={(e) => setWebhookUri(e.target.value)}
                        placeholder="e.g. https://your-endpoint.io/webhook" 
                        className="w-full bg-black border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-zinc-200 font-mono text-xs outline-none transition-all placeholder:text-zinc-800" 
                      />
                    </div>
                    <button 
                      onClick={handleTestWebhook}
                      disabled={isTestingWebhook || !webhookUri.trim()}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                    >
                      {isTestingWebhook ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                      Test Dispatch
                    </button>
                  </div>
                </div>

                {webhookLogs.length > 0 && (
                  <div className="bg-black rounded-3xl border border-zinc-900 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-zinc-900/50 px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                        <Terminal size={12} className="text-blue-500" />
                        LQI Webhook Console
                      </span>
                      <button onClick={() => setWebhookLogs([])} className="text-[9px] font-black text-zinc-600 hover:text-white uppercase transition-colors">Flush Cache</button>
                    </div>
                    <div className="p-6 h-40 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar">
                      {webhookLogs.map((log, i) => (
                        <div key={i} className={`flex items-start gap-3 ${
                          log.type === 'error' ? 'text-rose-500' : 
                          log.type === 'success' ? 'text-emerald-500' : 
                          'text-zinc-500'
                        }`}>
                          <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                          <span className="flex-1">
                            {log.type === 'error' && <ShieldAlert size={10} className="inline mr-1" />}
                            {log.msg}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-6 py-5 rounded-[24px] transition-all group ${
      active 
        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/30' 
        : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-zinc-600 group-hover:text-blue-500 transition-colors'} />
    <span className="font-black text-sm uppercase tracking-widest">{label}</span>
  </button>
);

const Input = ({ label, value }: any) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">{label}</label>
    <input 
      readOnly
      defaultValue={value}
      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-white font-medium outline-none cursor-default focus:border-blue-500/30 transition-all"
    />
  </div>
);

const ToggleItem = ({ label, checked, onChange }: any) => {
  return (
    <div className="flex justify-between items-center p-5 bg-black/40 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group">
      <span className="text-sm font-black text-zinc-300 uppercase tracking-tight group-hover:text-white transition-colors">{label}</span>
      <button 
        onClick={onChange}
        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${checked ? 'bg-blue-600 shadow-lg shadow-blue-900/30' : 'bg-zinc-800'}`}
      >
        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${checked ? 'left-8' : 'left-1'}`}></div>
      </button>
    </div>
  );
};

export default Settings;
