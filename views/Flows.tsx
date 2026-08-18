// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Flows.tsx
================================================================================


import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  ArrowRightLeft, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy,
  Terminal,
  ExternalLink,
  Code,
  X,
  Loader2,
  Cpu,
  ShieldCheck,
  Key,
  Plus,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Eye,
  Trash2,
  Lock,
  Globe
} from 'lucide-react';
import { AccountCollectionFlow, PaymentFlow } from '../types/index.ts';
import { callGemini } from '../services/geminiService.ts';

const BRIDGE_URL = "https://admin08077-ai-banking.static.hf.space";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  scope: string;
  created_at: string;
  status: 'ACTIVE' | 'REVOKED';
}

const INITIAL_ACCOUNT_FLOWS: AccountCollectionFlow[] = [
  {
    id: 'ACF-1102',
    object: 'account_collection_flow',
    live_mode: true,
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-31T14:00:00Z',
    client_token: 'acf_tok_882910398291',
    status: 'pending',
    counterparty_id: 'CP-8801',
    external_account_id: null,
    payment_types: ['ach', 'wire']
  }
];

const INITIAL_PAYMENT_FLOWS: PaymentFlow[] = [
  {
    id: 'PF-4421',
    object: 'payment_flow',
    live_mode: true,
    created_at: '2024-03-25T12:00:00Z',
    updated_at: '2024-03-25T12:30:00Z',
    client_token: 'pf_tok_4429188',
    status: 'pending',
    amount: 500000,
    currency: 'USD',
    direction: 'debit',
    counterparty_id: 'CP-8801',
    receiving_account_id: null,
    originating_account_id: 'IA-4401'
  }
];

const Flows: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'payment' | 'keys'>('account');
  const [accountFlows, setAccountFlows] = useState<AccountCollectionFlow[]>(INITIAL_ACCOUNT_FLOWS);
  const [paymentFlows, setPaymentFlows] = useState<PaymentFlow[]>(INITIAL_PAYMENT_FLOWS);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const [isSdkModalOpen, setIsSdkModalOpen] = useState(false);
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<any>(null);

  // AI SDK Architect State
  const [sdkChat, setSdkChat] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: `LQI Neural Architect active. I see your bridge is live at ${BRIDGE_URL}. I can generate the Node.js or Python code required to securely trigger RTP payments through your bridge. What environment are you connecting from?` }
  ]);
  const [sdkInput, setSdkInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [finalCode, setFinalCode] = useState<string | null>(null);

  // Init Form State
  const [initType, setInitType] = useState<'account' | 'payment'>('account');
  const [initLoading, setInitLoading] = useState(false);
  const [initForm, setInitForm] = useState({ counterpartyId: 'CP-8801', amount: '0', currency: 'USD' });

  // API Key State
  const [newKeyName, setNewKeyName] = useState('');
  const [generatingKey, setGeneratingKey] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleInitializeFlow = async () => {
    setInitLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const id = initType === 'account' ? `ACF-${Math.floor(1000 + Math.random() * 9000)}` : `PF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newFlow = {
      id,
      object: initType === 'account' ? 'account_collection_flow' : 'payment_flow',
      live_mode: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      client_token: `${initType === 'account' ? 'acf' : 'pf'}_tok_${Math.random().toString(36).substring(7)}`,
      status: 'pending' as const,
      counterparty_id: initForm.counterpartyId,
      ...(initType === 'payment' ? {
        amount: parseInt(initForm.amount) * 100,
        currency: initForm.currency,
        direction: 'debit',
        receiving_account_id: null,
        originating_account_id: 'IA-4401'
      } : {
        external_account_id: null,
        payment_types: ['ach', 'wire']
      })
    };

    if (initType === 'account') {
      setAccountFlows([newFlow as any, ...accountFlows]);
    } else {
      setPaymentFlows([newFlow as any, ...paymentFlows]);
    }

    setInitLoading(false);
    setIsInitModalOpen(false);
  };

  const handleSdkChat = async () => {
    if (!sdkInput.trim() || isAiThinking) return;
    const userMsg = sdkInput;
    setSdkChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setSdkInput('');
    setIsAiThinking(true);

    try {
      const prompt = `
        You are the Lumina Quantum Neural Architect. 
        Context: The user has a Node.js bridge hosted at ${BRIDGE_URL}.
        The bridge endpoint is /webhooks/trigger-payment.
        It expects HMAC-SHA256 signatures and a body with: amount, currency, originating_account_id, receiving_account_id, reference_number.
        
        Chat History: ${JSON.stringify(sdkChat)}
        User Instruction: ${userMsg}

        Task: 
        1. If you need more info (e.g. language or auth secret), ask a short, sharp technical question.
        2. If you have enough info, generate a full implementation snippet to talk to that bridge.
        
        Return JSON format: { "reply": "A brief technical explanation of what you are building", "code": "The full code block or null if still asking questions" }
      `;

      const response = await callGemini(
        'gemini-3-flash-preview',
        prompt,
        { responseMimeType: "application/json" }
      );

      // Fix: Directly access the .text property from the response object as per guidelines
      const data = JSON.parse(response.text || '{}');
      setSdkChat(prev => [...prev, { role: 'ai', text: data.reply }]);
      if (data.code) setFinalCode(data.code);
    } catch (err) {
      setSdkChat(prev => [...prev, { role: 'ai', text: "Handshake sync failed. Please re-specify parameters." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const generateApiKey = async () => {
    if (!newKeyName) return;
    setGeneratingKey(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const key: ApiKey = {
      id: `key_${Math.random().toString(36).substring(7)}`,
      key: `lq_live_${Math.random().toString(36).substring(2, 15)}`,
      name: newKeyName,
      scope: 'registry.read write.payments',
      created_at: new Date().toISOString(),
      status: 'ACTIVE'
    };
    setApiKeys([key, ...apiKeys]);
    setNewKeyName('');
    setGeneratingKey(false);
  };

  const revokeKey = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'REVOKED' } : k));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Onboarding <span className="text-blue-500 not-italic">Flows</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional M2M Integration Protocols</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsSdkModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <Code size={14} />
            <span>SDK Architect</span>
          </button>
          <button 
            onClick={() => setIsInitModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30"
          >
            <Zap size={14} />
            <span>Initialize Flow</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="flex border-b border-zinc-900 bg-black/20">
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'account' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <UserPlus size={16} />
            Account Collection
          </button>
          <button 
            onClick={() => setActiveTab('payment')}
            className={`flex-1 py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'payment' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <ArrowRightLeft size={16} />
            Payment Onboarding
          </button>
          <button 
            onClick={() => setActiveTab('keys')}
            className={`flex-1 py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'keys' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <Key size={16} />
            Node Access Keys
          </button>
        </div>

        <div className="p-10 min-h-[400px]">
          {activeTab === 'keys' ? (
            <div className="space-y-8">
              <div className="bg-black/40 border border-zinc-800 rounded-[2rem] p-8">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Issue Secure Access Token</p>
                <div className="flex gap-4">
                  <input 
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    placeholder="External App Name"
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-6 py-4 text-white text-xs outline-none focus:border-emerald-500/50"
                  />
                  <button onClick={generateApiKey} disabled={generatingKey} className="px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                    {generatingKey ? <Loader2 size={16} className="animate-spin" /> : 'Issue Token'}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {apiKeys.map(k => (
                  <div key={k.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex justify-between items-center group transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-xl ${k.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-600'}`}>
                        <Key size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic">{k.name}</p>
                        <p className="text-[9px] text-zinc-600 font-mono mt-1">{k.key}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {k.status === 'ACTIVE' && <button onClick={() => revokeKey(k.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>}
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${k.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{k.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'account' ? accountFlows : paymentFlows).map((flow: any) => (
                <div key={flow.id} className="bg-black/40 border border-zinc-900 rounded-[2rem] p-8 group hover:border-zinc-700 transition-all flex flex-col lg:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-blue-500 transition-all">
                      {activeTab === 'account' ? <UserPlus size={24} /> : <ArrowRightLeft size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-white font-black text-sm uppercase italic">{flow.id}</p>
                        <StatusBadge status={flow.status} />
                      </div>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">CP_REF: {flow.counterparty_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedFlow(flow)}
                      className="px-8 py-3 bg-zinc-900 hover:bg-white hover:text-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-800"
                    >
                      View Flow
                    </button>
                    <button className="p-3 text-zinc-800 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SDK Architect Modal */}
      {isSdkModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-5xl rounded-[3rem] p-10 shadow-2xl flex flex-col h-[85vh] animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Code size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">SDK <span className="text-blue-500 not-italic">Architect</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                    <Globe size={12} className="text-emerald-500" />
                    Targeting: {BRIDGE_URL}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsSdkModalOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 flex gap-8 overflow-hidden">
              <div className="flex-1 flex flex-col bg-black border border-zinc-900 rounded-[2rem] overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {sdkChat.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-6 rounded-[1.8rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/20' : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isAiThinking && <ThinkingState />}
                </div>
                <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex gap-4">
                  <input 
                    value={sdkInput}
                    onChange={e => setSdkInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSdkChat()}
                    placeholder="e.g. Write a Node.js client to trigger a payment of $500..."
                    className="flex-1 bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white text-xs outline-none focus:border-blue-500 transition-all font-bold"
                  />
                  <button onClick={handleSdkChat} disabled={isAiThinking} className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-900/40">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>

              <div className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex flex-col overflow-hidden">
                <div className="bg-zinc-800/80 px-8 py-5 border-b border-zinc-700 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase text-zinc-400">Implementation Script</span>
                  </div>
                  {finalCode && <button onClick={() => copyToClipboard(finalCode)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-white transition-all"><Copy size={16} /></button>}
                </div>
                <div className="flex-1 p-8 font-mono text-[11px] text-zinc-400 overflow-y-auto custom-scrollbar">
                  {finalCode ? <pre className="whitespace-pre-wrap">{finalCode}</pre> : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <Cpu size={48} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Architect Idle</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Init Modal */}
      {isInitModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                   <Zap size={28} />
                 </div>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Initialize <span className="text-blue-500 not-italic">Flow</span></h3>
               </div>
               <button onClick={() => setIsInitModalOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setInitType('account')} className={`p-6 rounded-2xl border transition-all ${initType === 'account' ? 'bg-blue-600/10 border-blue-600' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                  <UserPlus className="mb-4" size={20} />
                  <p className="text-white font-black text-[10px] uppercase">Account Col.</p>
                </button>
                <button onClick={() => setInitType('payment')} className={`p-6 rounded-2xl border transition-all ${initType === 'payment' ? 'bg-blue-600/10 border-blue-600' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                  <ArrowRightLeft className="mb-4" size={20} />
                  <p className="text-white font-black text-[10px] uppercase">Payment Onbd.</p>
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Target CP</label>
                  <input value={initForm.counterpartyId} onChange={e => setInitForm({...initForm, counterpartyId: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white text-xs outline-none" />
                </div>
                {initType === 'payment' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Limit (USD)</label>
                    <input type="number" value={initForm.amount} onChange={e => setInitForm({...initForm, amount: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white text-xs outline-none" />
                  </div>
                )}
              </div>
              <button onClick={handleInitializeFlow} disabled={initLoading} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4">
                {initLoading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                Establish Flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedFlow && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10 pb-8 border-b border-zinc-900">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center border border-blue-500/20">
                  {selectedFlow.object === 'account_collection_flow' ? <UserPlus size={32} /> : <ArrowRightLeft size={32} />}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedFlow.id}</h3>
                  <div className="flex gap-3 mt-2">
                    <StatusBadge status={selectedFlow.status} />
                    <span className="text-[9px] font-black uppercase text-zinc-600 px-3 py-1 bg-zinc-900 rounded-full tracking-widest">LIVE_NODE</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedFlow(null)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Registry Entity</p>
                  <p className="text-white font-bold">{selectedFlow.counterparty_id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Sync Integrity</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-emerald-500 font-black text-[10px] uppercase">Node Synchronized</span>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-black border border-zinc-900 rounded-[2.5rem] space-y-4">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Node Handshake Token</p>
                    <button onClick={() => copyToClipboard(selectedFlow.client_token)} className="text-blue-500 hover:text-blue-400 transition-colors"><Copy size={16} /></button>
                 </div>
                 <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 font-mono text-[11px] text-blue-400/80 break-all select-all">
                   {selectedFlow.client_token}
                 </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all border border-zinc-800 flex items-center justify-center gap-3">
                  <Eye size={18} /> Inspect Signals
                </button>
                <button className="flex-1 py-5 bg-white hover:bg-zinc-100 text-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl">
                   Refresh Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ThinkingState = () => (
  <div className="flex items-center gap-4 text-zinc-500">
    <Loader2 className="animate-spin" size={18} />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Calculating Neural Implementation...</span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    completed: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
  };
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status] || 'bg-zinc-800 text-zinc-500'}`}>
      {status}
    </div>
  );
};

export default Flows;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Flows.tsx
================================================================================


import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  ArrowRightLeft, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy,
  Terminal,
  ExternalLink,
  Code,
  X,
  Loader2,
  Cpu,
  ShieldCheck,
  Key,
  Plus,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Eye,
  Trash2,
  Lock,
  Globe
} from 'lucide-react';
import { AccountCollectionFlow, PaymentFlow } from '../types/index.ts';
import { callGemini } from '../services/geminiService.ts';

const BRIDGE_URL = "https://admin08077-ai-banking.static.hf.space";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  scope: string;
  created_at: string;
  status: 'ACTIVE' | 'REVOKED';
}

const INITIAL_ACCOUNT_FLOWS: AccountCollectionFlow[] = [
  {
    id: 'ACF-1102',
    object: 'account_collection_flow',
    live_mode: true,
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-31T14:00:00Z',
    client_token: 'acf_tok_882910398291',
    status: 'pending',
    counterparty_id: 'CP-8801',
    external_account_id: null,
    payment_types: ['ach', 'wire']
  }
];

const INITIAL_PAYMENT_FLOWS: PaymentFlow[] = [
  {
    id: 'PF-4421',
    object: 'payment_flow',
    live_mode: true,
    created_at: '2024-03-25T12:00:00Z',
    updated_at: '2024-03-25T12:30:00Z',
    client_token: 'pf_tok_4429188',
    status: 'pending',
    amount: 500000,
    currency: 'USD',
    direction: 'debit',
    counterparty_id: 'CP-8801',
    receiving_account_id: null,
    originating_account_id: 'IA-4401'
  }
];

const Flows: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'payment' | 'keys'>('account');
  const [accountFlows, setAccountFlows] = useState<AccountCollectionFlow[]>(INITIAL_ACCOUNT_FLOWS);
  const [paymentFlows, setPaymentFlows] = useState<PaymentFlow[]>(INITIAL_PAYMENT_FLOWS);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const [isSdkModalOpen, setIsSdkModalOpen] = useState(false);
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<any>(null);

  // AI SDK Architect State
  const [sdkChat, setSdkChat] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: `LQI Neural Architect active. I see your bridge is live at ${BRIDGE_URL}. I can generate the Node.js or Python code required to securely trigger RTP payments through your bridge. What environment are you connecting from?` }
  ]);
  const [sdkInput, setSdkInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [finalCode, setFinalCode] = useState<string | null>(null);

  // Init Form State
  const [initType, setInitType] = useState<'account' | 'payment'>('account');
  const [initLoading, setInitLoading] = useState(false);
  const [initForm, setInitForm] = useState({ counterpartyId: 'CP-8801', amount: '0', currency: 'USD' });

  // API Key State
  const [newKeyName, setNewKeyName] = useState('');
  const [generatingKey, setGeneratingKey] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleInitializeFlow = async () => {
    setInitLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const id = initType === 'account' ? `ACF-${Math.floor(1000 + Math.random() * 9000)}` : `PF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newFlow = {
      id,
      object: initType === 'account' ? 'account_collection_flow' : 'payment_flow',
      live_mode: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      client_token: `${initType === 'account' ? 'acf' : 'pf'}_tok_${Math.random().toString(36).substring(7)}`,
      status: 'pending' as const,
      counterparty_id: initForm.counterpartyId,
      ...(initType === 'payment' ? {
        amount: parseInt(initForm.amount) * 100,
        currency: initForm.currency,
        direction: 'debit',
        receiving_account_id: null,
        originating_account_id: 'IA-4401'
      } : {
        external_account_id: null,
        payment_types: ['ach', 'wire']
      })
    };

    if (initType === 'account') {
      setAccountFlows([newFlow as any, ...accountFlows]);
    } else {
      setPaymentFlows([newFlow as any, ...paymentFlows]);
    }

    setInitLoading(false);
    setIsInitModalOpen(false);
  };

  const handleSdkChat = async () => {
    if (!sdkInput.trim() || isAiThinking) return;
    const userMsg = sdkInput;
    setSdkChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setSdkInput('');
    setIsAiThinking(true);

    try {
      const prompt = `
        You are the Lumina Quantum Neural Architect. 
        Context: The user has a Node.js bridge hosted at ${BRIDGE_URL}.
        The bridge endpoint is /webhooks/trigger-payment.
        It expects HMAC-SHA256 signatures and a body with: amount, currency, originating_account_id, receiving_account_id, reference_number.
        
        Chat History: ${JSON.stringify(sdkChat)}
        User Instruction: ${userMsg}

        Task: 
        1. If you need more info (e.g. language or auth secret), ask a short, sharp technical question.
        2. If you have enough info, generate a full implementation snippet to talk to that bridge.
        
        Return JSON format: { "reply": "A brief technical explanation of what you are building", "code": "The full code block or null if still asking questions" }
      `;

      const response = await callGemini(
        'gemini-3-flash-preview',
        prompt,
        { responseMimeType: "application/json" }
      );

      // Fix: Directly access the .text property from the response object as per guidelines
      const data = JSON.parse(response.text || '{}');
      setSdkChat(prev => [...prev, { role: 'ai', text: data.reply }]);
      if (data.code) setFinalCode(data.code);
    } catch (err) {
      setSdkChat(prev => [...prev, { role: 'ai', text: "Handshake sync failed. Please re-specify parameters." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const generateApiKey = async () => {
    if (!newKeyName) return;
    setGeneratingKey(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const key: ApiKey = {
      id: `key_${Math.random().toString(36).substring(7)}`,
      key: `lq_live_${Math.random().toString(36).substring(2, 15)}`,
      name: newKeyName,
      scope: 'registry.read write.payments',
      created_at: new Date().toISOString(),
      status: 'ACTIVE'
    };
    setApiKeys([key, ...apiKeys]);
    setNewKeyName('');
    setGeneratingKey(false);
  };

  const revokeKey = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'REVOKED' } : k));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Onboarding <span className="text-blue-500 not-italic">Flows</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional M2M Integration Protocols</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsSdkModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <Code size={14} />
            <span>SDK Architect</span>
          </button>
          <button 
            onClick={() => setIsInitModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30"
          >
            <Zap size={14} />
            <span>Initialize Flow</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="flex border-b border-zinc-900 bg-black/20">
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'account' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <UserPlus size={16} />
            Account Collection
          </button>
          <button 
            onClick={() => setActiveTab('payment')}
            className={`flex-1 py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'payment' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <ArrowRightLeft size={16} />
            Payment Onboarding
          </button>
          <button 
            onClick={() => setActiveTab('keys')}
            className={`flex-1 py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'keys' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <Key size={16} />
            Node Access Keys
          </button>
        </div>

        <div className="p-10 min-h-[400px]">
          {activeTab === 'keys' ? (
            <div className="space-y-8">
              <div className="bg-black/40 border border-zinc-800 rounded-[2rem] p-8">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Issue Secure Access Token</p>
                <div className="flex gap-4">
                  <input 
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    placeholder="External App Name"
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-6 py-4 text-white text-xs outline-none focus:border-emerald-500/50"
                  />
                  <button onClick={generateApiKey} disabled={generatingKey} className="px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                    {generatingKey ? <Loader2 size={16} className="animate-spin" /> : 'Issue Token'}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {apiKeys.map(k => (
                  <div key={k.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex justify-between items-center group transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-xl ${k.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-600'}`}>
                        <Key size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic">{k.name}</p>
                        <p className="text-[9px] text-zinc-600 font-mono mt-1">{k.key}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {k.status === 'ACTIVE' && <button onClick={() => revokeKey(k.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>}
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${k.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{k.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'account' ? accountFlows : paymentFlows).map((flow: any) => (
                <div key={flow.id} className="bg-black/40 border border-zinc-900 rounded-[2rem] p-8 group hover:border-zinc-700 transition-all flex flex-col lg:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-blue-500 transition-all">
                      {activeTab === 'account' ? <UserPlus size={24} /> : <ArrowRightLeft size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-white font-black text-sm uppercase italic">{flow.id}</p>
                        <StatusBadge status={flow.status} />
                      </div>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">CP_REF: {flow.counterparty_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedFlow(flow)}
                      className="px-8 py-3 bg-zinc-900 hover:bg-white hover:text-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-800"
                    >
                      View Flow
                    </button>
                    <button className="p-3 text-zinc-800 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SDK Architect Modal */}
      {isSdkModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-5xl rounded-[3rem] p-10 shadow-2xl flex flex-col h-[85vh] animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Code size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">SDK <span className="text-blue-500 not-italic">Architect</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                    <Globe size={12} className="text-emerald-500" />
                    Targeting: {BRIDGE_URL}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsSdkModalOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 flex gap-8 overflow-hidden">
              <div className="flex-1 flex flex-col bg-black border border-zinc-900 rounded-[2rem] overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {sdkChat.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-6 rounded-[1.8rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/20' : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isAiThinking && <ThinkingState />}
                </div>
                <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex gap-4">
                  <input 
                    value={sdkInput}
                    onChange={e => setSdkInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSdkChat()}
                    placeholder="e.g. Write a Node.js client to trigger a payment of $500..."
                    className="flex-1 bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white text-xs outline-none focus:border-blue-500 transition-all font-bold"
                  />
                  <button onClick={handleSdkChat} disabled={isAiThinking} className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-900/40">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>

              <div className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex flex-col overflow-hidden">
                <div className="bg-zinc-800/80 px-8 py-5 border-b border-zinc-700 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase text-zinc-400">Implementation Script</span>
                  </div>
                  {finalCode && <button onClick={() => copyToClipboard(finalCode)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-white transition-all"><Copy size={16} /></button>}
                </div>
                <div className="flex-1 p-8 font-mono text-[11px] text-zinc-400 overflow-y-auto custom-scrollbar">
                  {finalCode ? <pre className="whitespace-pre-wrap">{finalCode}</pre> : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <Cpu size={48} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Architect Idle</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Init Modal */}
      {isInitModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                   <Zap size={28} />
                 </div>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Initialize <span className="text-blue-500 not-italic">Flow</span></h3>
               </div>
               <button onClick={() => setIsInitModalOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setInitType('account')} className={`p-6 rounded-2xl border transition-all ${initType === 'account' ? 'bg-blue-600/10 border-blue-600' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                  <UserPlus className="mb-4" size={20} />
                  <p className="text-white font-black text-[10px] uppercase">Account Col.</p>
                </button>
                <button onClick={() => setInitType('payment')} className={`p-6 rounded-2xl border transition-all ${initType === 'payment' ? 'bg-blue-600/10 border-blue-600' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                  <ArrowRightLeft className="mb-4" size={20} />
                  <p className="text-white font-black text-[10px] uppercase">Payment Onbd.</p>
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Target CP</label>
                  <input value={initForm.counterpartyId} onChange={e => setInitForm({...initForm, counterpartyId: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white text-xs outline-none" />
                </div>
                {initType === 'payment' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Limit (USD)</label>
                    <input type="number" value={initForm.amount} onChange={e => setInitForm({...initForm, amount: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white text-xs outline-none" />
                  </div>
                )}
              </div>
              <button onClick={handleInitializeFlow} disabled={initLoading} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4">
                {initLoading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                Establish Flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedFlow && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10 pb-8 border-b border-zinc-900">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center border border-blue-500/20">
                  {selectedFlow.object === 'account_collection_flow' ? <UserPlus size={32} /> : <ArrowRightLeft size={32} />}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedFlow.id}</h3>
                  <div className="flex gap-3 mt-2">
                    <StatusBadge status={selectedFlow.status} />
                    <span className="text-[9px] font-black uppercase text-zinc-600 px-3 py-1 bg-zinc-900 rounded-full tracking-widest">LIVE_NODE</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedFlow(null)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Registry Entity</p>
                  <p className="text-white font-bold">{selectedFlow.counterparty_id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Sync Integrity</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-emerald-500 font-black text-[10px] uppercase">Node Synchronized</span>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-black border border-zinc-900 rounded-[2.5rem] space-y-4">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Node Handshake Token</p>
                    <button onClick={() => copyToClipboard(selectedFlow.client_token)} className="text-blue-500 hover:text-blue-400 transition-colors"><Copy size={16} /></button>
                 </div>
                 <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 font-mono text-[11px] text-blue-400/80 break-all select-all">
                   {selectedFlow.client_token}
                 </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all border border-zinc-800 flex items-center justify-center gap-3">
                  <Eye size={18} /> Inspect Signals
                </button>
                <button className="flex-1 py-5 bg-white hover:bg-zinc-100 text-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl">
                   Refresh Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ThinkingState = () => (
  <div className="flex items-center gap-4 text-zinc-500">
    <Loader2 className="animate-spin" size={18} />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Calculating Neural Implementation...</span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    completed: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
  };
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status] || 'bg-zinc-800 text-zinc-500'}`}>
      {status}
    </div>
  );
};

export default Flows;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Flows.tsx
================================================================================


import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  ArrowRightLeft, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy,
  Terminal,
  ExternalLink,
  Code,
  X,
  Loader2,
  Cpu,
  ShieldCheck,
  Key,
  Plus,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Eye,
  Trash2,
  Lock,
  Globe
} from 'lucide-react';
import { AccountCollectionFlow, PaymentFlow } from '../types/index.ts';
import { callGemini } from '../services/geminiService.ts';

const BRIDGE_URL = "https://admin08077-ai-banking.static.hf.space";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  scope: string;
  created_at: string;
  status: 'ACTIVE' | 'REVOKED';
}

const INITIAL_ACCOUNT_FLOWS: AccountCollectionFlow[] = [
  {
    id: 'ACF-1102',
    object: 'account_collection_flow',
    live_mode: true,
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-31T14:00:00Z',
    client_token: 'acf_tok_882910398291',
    status: 'pending',
    counterparty_id: 'CP-8801',
    external_account_id: null,
    payment_types: ['ach', 'wire']
  }
];

const INITIAL_PAYMENT_FLOWS: PaymentFlow[] = [
  {
    id: 'PF-4421',
    object: 'payment_flow',
    live_mode: true,
    created_at: '2024-03-25T12:00:00Z',
    updated_at: '2024-03-25T12:30:00Z',
    client_token: 'pf_tok_4429188',
    status: 'pending',
    amount: 500000,
    currency: 'USD',
    direction: 'debit',
    counterparty_id: 'CP-8801',
    receiving_account_id: null,
    originating_account_id: 'IA-4401'
  }
];

const Flows: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'payment' | 'keys'>('account');
  const [accountFlows, setAccountFlows] = useState<AccountCollectionFlow[]>(INITIAL_ACCOUNT_FLOWS);
  const [paymentFlows, setPaymentFlows] = useState<PaymentFlow[]>(INITIAL_PAYMENT_FLOWS);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const [isSdkModalOpen, setIsSdkModalOpen] = useState(false);
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<any>(null);

  // AI SDK Architect State
  const [sdkChat, setSdkChat] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: `LQI Neural Architect active. I see your bridge is live at ${BRIDGE_URL}. I can generate the Node.js or Python code required to securely trigger RTP payments through your bridge. What environment are you connecting from?` }
  ]);
  const [sdkInput, setSdkInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [finalCode, setFinalCode] = useState<string | null>(null);

  // Init Form State
  const [initType, setInitType] = useState<'account' | 'payment'>('account');
  const [initLoading, setInitLoading] = useState(false);
  const [initForm, setInitForm] = useState({ counterpartyId: 'CP-8801', amount: '0', currency: 'USD' });

  // API Key State
  const [newKeyName, setNewKeyName] = useState('');
  const [generatingKey, setGeneratingKey] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleInitializeFlow = async () => {
    setInitLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const id = initType === 'account' ? `ACF-${Math.floor(1000 + Math.random() * 9000)}` : `PF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newFlow = {
      id,
      object: initType === 'account' ? 'account_collection_flow' : 'payment_flow',
      live_mode: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      client_token: `${initType === 'account' ? 'acf' : 'pf'}_tok_${Math.random().toString(36).substring(7)}`,
      status: 'pending' as const,
      counterparty_id: initForm.counterpartyId,
      ...(initType === 'payment' ? {
        amount: parseInt(initForm.amount) * 100,
        currency: initForm.currency,
        direction: 'debit',
        receiving_account_id: null,
        originating_account_id: 'IA-4401'
      } : {
        external_account_id: null,
        payment_types: ['ach', 'wire']
      })
    };

    if (initType === 'account') {
      setAccountFlows([newFlow as any, ...accountFlows]);
    } else {
      setPaymentFlows([newFlow as any, ...paymentFlows]);
    }

    setInitLoading(false);
    setIsInitModalOpen(false);
  };

  const handleSdkChat = async () => {
    if (!sdkInput.trim() || isAiThinking) return;
    const userMsg = sdkInput;
    setSdkChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setSdkInput('');
    setIsAiThinking(true);

    try {
      const prompt = `
        You are the Lumina Quantum Neural Architect. 
        Context: The user has a Node.js bridge hosted at ${BRIDGE_URL}.
        The bridge endpoint is /webhooks/trigger-payment.
        It expects HMAC-SHA256 signatures and a body with: amount, currency, originating_account_id, receiving_account_id, reference_number.
        
        Chat History: ${JSON.stringify(sdkChat)}
        User Instruction: ${userMsg}

        Task: 
        1. If you need more info (e.g. language or auth secret), ask a short, sharp technical question.
        2. If you have enough info, generate a full implementation snippet to talk to that bridge.
        
        Return JSON format: { "reply": "A brief technical explanation of what you are building", "code": "The full code block or null if still asking questions" }
      `;

      const response = await callGemini(
        'gemini-3-flash-preview',
        prompt,
        { responseMimeType: "application/json" }
      );

      // Fix: Directly access the .text property from the response object as per guidelines
      const data = JSON.parse(response.text || '{}');
      setSdkChat(prev => [...prev, { role: 'ai', text: data.reply }]);
      if (data.code) setFinalCode(data.code);
    } catch (err) {
      setSdkChat(prev => [...prev, { role: 'ai', text: "Handshake sync failed. Please re-specify parameters." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const generateApiKey = async () => {
    if (!newKeyName) return;
    setGeneratingKey(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const key: ApiKey = {
      id: `key_${Math.random().toString(36).substring(7)}`,
      key: `lq_live_${Math.random().toString(36).substring(2, 15)}`,
      name: newKeyName,
      scope: 'registry.read write.payments',
      created_at: new Date().toISOString(),
      status: 'ACTIVE'
    };
    setApiKeys([key, ...apiKeys]);
    setNewKeyName('');
    setGeneratingKey(false);
  };

  const revokeKey = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'REVOKED' } : k));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Onboarding <span className="text-blue-500 not-italic">Flows</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional M2M Integration Protocols</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsSdkModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <Code size={14} />
            <span>SDK Architect</span>
          </button>
          <button 
            onClick={() => setIsInitModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30"
          >
            <Zap size={14} />
            <span>Initialize Flow</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="flex border-b border-zinc-900 bg-black/20">
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'account' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <UserPlus size={16} />
            Account Collection
          </button>
          <button 
            onClick={() => setActiveTab('payment')}
            className={`flex-1 py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'payment' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <ArrowRightLeft size={16} />
            Payment Onboarding
          </button>
          <button 
            onClick={() => setActiveTab('keys')}
            className={`flex-1 py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'keys' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <Key size={16} />
            Node Access Keys
          </button>
        </div>

        <div className="p-10 min-h-[400px]">
          {activeTab === 'keys' ? (
            <div className="space-y-8">
              <div className="bg-black/40 border border-zinc-800 rounded-[2rem] p-8">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Issue Secure Access Token</p>
                <div className="flex gap-4">
                  <input 
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    placeholder="External App Name"
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-6 py-4 text-white text-xs outline-none focus:border-emerald-500/50"
                  />
                  <button onClick={generateApiKey} disabled={generatingKey} className="px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                    {generatingKey ? <Loader2 size={16} className="animate-spin" /> : 'Issue Token'}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {apiKeys.map(k => (
                  <div key={k.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex justify-between items-center group transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-xl ${k.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-600'}`}>
                        <Key size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic">{k.name}</p>
                        <p className="text-[9px] text-zinc-600 font-mono mt-1">{k.key}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {k.status === 'ACTIVE' && <button onClick={() => revokeKey(k.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>}
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${k.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{k.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'account' ? accountFlows : paymentFlows).map((flow: any) => (
                <div key={flow.id} className="bg-black/40 border border-zinc-900 rounded-[2rem] p-8 group hover:border-zinc-700 transition-all flex flex-col lg:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-blue-500 transition-all">
                      {activeTab === 'account' ? <UserPlus size={24} /> : <ArrowRightLeft size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-white font-black text-sm uppercase italic">{flow.id}</p>
                        <StatusBadge status={flow.status} />
                      </div>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">CP_REF: {flow.counterparty_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedFlow(flow)}
                      className="px-8 py-3 bg-zinc-900 hover:bg-white hover:text-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-800"
                    >
                      View Flow
                    </button>
                    <button className="p-3 text-zinc-800 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SDK Architect Modal */}
      {isSdkModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-5xl rounded-[3rem] p-10 shadow-2xl flex flex-col h-[85vh] animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Code size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">SDK <span className="text-blue-500 not-italic">Architect</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                    <Globe size={12} className="text-emerald-500" />
                    Targeting: {BRIDGE_URL}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsSdkModalOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 flex gap-8 overflow-hidden">
              <div className="flex-1 flex flex-col bg-black border border-zinc-900 rounded-[2rem] overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {sdkChat.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-6 rounded-[1.8rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/20' : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isAiThinking && <ThinkingState />}
                </div>
                <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex gap-4">
                  <input 
                    value={sdkInput}
                    onChange={e => setSdkInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSdkChat()}
                    placeholder="e.g. Write a Node.js client to trigger a payment of $500..."
                    className="flex-1 bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white text-xs outline-none focus:border-blue-500 transition-all font-bold"
                  />
                  <button onClick={handleSdkChat} disabled={isAiThinking} className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-900/40">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>

              <div className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex flex-col overflow-hidden">
                <div className="bg-zinc-800/80 px-8 py-5 border-b border-zinc-700 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase text-zinc-400">Implementation Script</span>
                  </div>
                  {finalCode && <button onClick={() => copyToClipboard(finalCode)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-white transition-all"><Copy size={16} /></button>}
                </div>
                <div className="flex-1 p-8 font-mono text-[11px] text-zinc-400 overflow-y-auto custom-scrollbar">
                  {finalCode ? <pre className="whitespace-pre-wrap">{finalCode}</pre> : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <Cpu size={48} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Architect Idle</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Init Modal */}
      {isInitModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                   <Zap size={28} />
                 </div>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Initialize <span className="text-blue-500 not-italic">Flow</span></h3>
               </div>
               <button onClick={() => setIsInitModalOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setInitType('account')} className={`p-6 rounded-2xl border transition-all ${initType === 'account' ? 'bg-blue-600/10 border-blue-600' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                  <UserPlus className="mb-4" size={20} />
                  <p className="text-white font-black text-[10px] uppercase">Account Col.</p>
                </button>
                <button onClick={() => setInitType('payment')} className={`p-6 rounded-2xl border transition-all ${initType === 'payment' ? 'bg-blue-600/10 border-blue-600' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                  <ArrowRightLeft className="mb-4" size={20} />
                  <p className="text-white font-black text-[10px] uppercase">Payment Onbd.</p>
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Target CP</label>
                  <input value={initForm.counterpartyId} onChange={e => setInitForm({...initForm, counterpartyId: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white text-xs outline-none" />
                </div>
                {initType === 'payment' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Limit (USD)</label>
                    <input type="number" value={initForm.amount} onChange={e => setInitForm({...initForm, amount: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white text-xs outline-none" />
                  </div>
                )}
              </div>
              <button onClick={handleInitializeFlow} disabled={initLoading} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4">
                {initLoading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                Establish Flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedFlow && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10 pb-8 border-b border-zinc-900">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center border border-blue-500/20">
                  {selectedFlow.object === 'account_collection_flow' ? <UserPlus size={32} /> : <ArrowRightLeft size={32} />}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedFlow.id}</h3>
                  <div className="flex gap-3 mt-2">
                    <StatusBadge status={selectedFlow.status} />
                    <span className="text-[9px] font-black uppercase text-zinc-600 px-3 py-1 bg-zinc-900 rounded-full tracking-widest">LIVE_NODE</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedFlow(null)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Registry Entity</p>
                  <p className="text-white font-bold">{selectedFlow.counterparty_id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Sync Integrity</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-emerald-500 font-black text-[10px] uppercase">Node Synchronized</span>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-black border border-zinc-900 rounded-[2.5rem] space-y-4">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Node Handshake Token</p>
                    <button onClick={() => copyToClipboard(selectedFlow.client_token)} className="text-blue-500 hover:text-blue-400 transition-colors"><Copy size={16} /></button>
                 </div>
                 <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 font-mono text-[11px] text-blue-400/80 break-all select-all">
                   {selectedFlow.client_token}
                 </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all border border-zinc-800 flex items-center justify-center gap-3">
                  <Eye size={18} /> Inspect Signals
                </button>
                <button className="flex-1 py-5 bg-white hover:bg-zinc-100 text-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl">
                   Refresh Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ThinkingState = () => (
  <div className="flex items-center gap-4 text-zinc-500">
    <Loader2 className="animate-spin" size={18} />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Calculating Neural Implementation...</span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    completed: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
  };
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status] || 'bg-zinc-800 text-zinc-500'}`}>
      {status}
    </div>
  );
};

export default Flows;
