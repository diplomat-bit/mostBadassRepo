// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Advisor.tsx
================================================================================


import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Bot, Sparkles, Loader2, Volume2, VolumeX, ChevronRight, Zap
} from 'lucide-react';
import { synthesizeSpeech, getFinancialAdviceStream } from '../services/geminiService';
import { apiClient } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const Advisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMemory = async () => {
      try {
        const history = await apiClient.chat.getHistory();
        if (history && history.length > 0) {
          setMessages(history.map((h: any) => ({ ...h, id: h.id.toString() })));
        } else {
          setMessages([{ id: '1', role: 'assistant', content: "Neural Core online. Standing by for institutional instructions.", timestamp: new Date().toISOString() }]);
        }
      } catch (err) {
        setMessages([{ id: '1', role: 'assistant', content: "Neural Core online. Safe mode registry active.", timestamp: new Date().toISOString() }]);
      }
    };
    initMemory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (forcedInput?: string) => {
    const query = (forcedInput || input).trim();
    if (!query || loading) return;

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { 
      id: userMsgId, 
      role: 'user', 
      content: query, 
      timestamp: new Date().toISOString() 
    }]);
    
    setInput('');
    setLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { 
      id: assistantMsgId, 
      role: 'assistant', 
      content: '', 
      timestamp: new Date().toISOString(), 
      isStreaming: true 
    }]);

    try {
      const context = { system: "LUMINA_ADVISORY_NODE", mode: "Institutional_Treasury" };
      const stream = await getFinancialAdviceStream(query, context);
      
      let fullContent = '';
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullContent += text;
          setMessages(prev => prev.map(m => 
            m.id === assistantMsgId ? { ...m, content: fullContent } : m
          ));
        }
      }
      
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { ...m, isStreaming: false } : m
      ));
      
      await apiClient.chat.saveMessage('user', query);
      await apiClient.chat.saveMessage('assistant', fullContent);
      
      if (voiceEnabled) {
        setIsSpeaking(true);
        await synthesizeSpeech(fullContent, 'Kore');
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Stream error:", error);
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { 
          ...m, 
          content: "Neural link lost. Parity handshake error.", 
          isStreaming: false 
        } : m
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-10 animate-in fade-in duration-700">
      <div className="hidden lg:flex flex-col w-96 space-y-8">
        <div className="bg-zinc-950 border border-zinc-800 rounded-[3rem] p-10 flex flex-col h-full relative overflow-hidden shadow-2xl">
          <div className="flex items-center space-x-3 mb-10 relative z-10">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-white font-black italic tracking-tighter uppercase text-xl">Nexus_Core</h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Mode: Neural Advisory</p>
            </div>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar relative z-10">
             {isSpeaking && (
               <div className="mb-6 p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center gap-4 animate-pulse">
                  <Volume2 size={24} className="text-blue-500" />
                  <div className="flex-1">
                     <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Active Transmission</p>
                     <p className="text-[10px] text-zinc-300 font-bold uppercase mt-1">Neural Audio Stream</p>
                  </div>
               </div>
             )}
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2 mb-4">Command Presets</p>
            {["Analyze Liquidity Drift", "Stress-test Commercial Portfolio", "Model Inflation Spike impact"].map((text, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(text)} 
                disabled={loading} 
                className="w-full text-left p-6 rounded-2xl bg-black border border-zinc-900 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group flex items-start justify-between disabled:opacity-30"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-blue-400 leading-relaxed">{text}</span>
                <ChevronRight size={16} className="text-zinc-800 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="h-24 border-b border-zinc-900 px-12 flex items-center justify-between bg-black/40 backdrop-blur-xl z-20">
          <div className="flex items-center space-x-6">
            <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_#10b981] ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <span className="font-black text-white text-base uppercase tracking-[0.4em] italic">Quantum_Advisory_Node</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setVoiceEnabled(!voiceEnabled)} 
              className={`flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all ${voiceEnabled ? 'bg-blue-600/10 border-blue-500/20 text-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{voiceEnabled ? 'Voice Online' : 'Voice Muted'}</span>
              {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
              <div className={`flex max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-8`}>
                <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center border transition-all ${m.role === 'user' ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-900/40'}`}>
                  {m.role === 'user' ? <User size={24} /> : <Bot size={28} />}
                </div>
                <div className={`p-10 rounded-[3rem] ${m.role === 'user' ? 'bg-zinc-900 text-zinc-100 rounded-tr-none border border-zinc-800' : 'bg-black border border-zinc-800 text-zinc-300 rounded-tl-none shadow-2xl'}`}>
                  <div className="text-lg font-medium leading-relaxed tracking-tight whitespace-pre-wrap italic">
                    {m.content || (m.isStreaming ? (
                      <div className="flex items-center gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] animate-pulse">Calculating Alpha...</span>
                      </div>
                    ) : "Establishing Handshake...")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-10 bg-black/20 border-t border-zinc-900 backdrop-blur-2xl z-20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="relative group max-w-6xl mx-auto flex gap-6"
          >
            <div className="relative flex-1">
              <Zap className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Authorize treasury instructions..." 
                className="w-full bg-black border border-zinc-800 focus:border-blue-500 rounded-[2.5rem] py-8 pl-16 pr-10 text-white text-lg outline-none transition-all placeholder:text-zinc-900 font-bold shadow-inner" 
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !input.trim()} 
              className="px-12 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-4 disabled:opacity-50 shadow-2xl shadow-blue-900/40 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              <span>Dispatch</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Advisor;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Advisor.tsx
================================================================================


import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Bot, Sparkles, Loader2, Volume2, VolumeX, ChevronRight, Zap
} from 'lucide-react';
import { synthesizeSpeech, getFinancialAdviceStream } from '../services/geminiService';
import { apiClient } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const Advisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMemory = async () => {
      try {
        const history = await apiClient.chat.getHistory();
        if (history && history.length > 0) {
          setMessages(history.map((h: any) => ({ ...h, id: h.id.toString() })));
        } else {
          setMessages([{ id: '1', role: 'assistant', content: "Neural Core online. Standing by for institutional instructions.", timestamp: new Date().toISOString() }]);
        }
      } catch (err) {
        setMessages([{ id: '1', role: 'assistant', content: "Neural Core online. Safe mode registry active.", timestamp: new Date().toISOString() }]);
      }
    };
    initMemory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (forcedInput?: string) => {
    const query = (forcedInput || input).trim();
    if (!query || loading) return;

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { 
      id: userMsgId, 
      role: 'user', 
      content: query, 
      timestamp: new Date().toISOString() 
    }]);
    
    setInput('');
    setLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { 
      id: assistantMsgId, 
      role: 'assistant', 
      content: '', 
      timestamp: new Date().toISOString(), 
      isStreaming: true 
    }]);

    try {
      const context = { system: "LUMINA_ADVISORY_NODE", mode: "Institutional_Treasury" };
      const stream = await getFinancialAdviceStream(query, context);
      
      let fullContent = '';
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullContent += text;
          setMessages(prev => prev.map(m => 
            m.id === assistantMsgId ? { ...m, content: fullContent } : m
          ));
        }
      }
      
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { ...m, isStreaming: false } : m
      ));
      
      await apiClient.chat.saveMessage('user', query);
      await apiClient.chat.saveMessage('assistant', fullContent);
      
      if (voiceEnabled) {
        setIsSpeaking(true);
        await synthesizeSpeech(fullContent, 'Kore');
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Stream error:", error);
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { 
          ...m, 
          content: "Neural link lost. Parity handshake error.", 
          isStreaming: false 
        } : m
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-10 animate-in fade-in duration-700">
      <div className="hidden lg:flex flex-col w-96 space-y-8">
        <div className="bg-zinc-950 border border-zinc-800 rounded-[3rem] p-10 flex flex-col h-full relative overflow-hidden shadow-2xl">
          <div className="flex items-center space-x-3 mb-10 relative z-10">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-white font-black italic tracking-tighter uppercase text-xl">Nexus_Core</h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Mode: Neural Advisory</p>
            </div>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar relative z-10">
             {isSpeaking && (
               <div className="mb-6 p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center gap-4 animate-pulse">
                  <Volume2 size={24} className="text-blue-500" />
                  <div className="flex-1">
                     <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Active Transmission</p>
                     <p className="text-[10px] text-zinc-300 font-bold uppercase mt-1">Neural Audio Stream</p>
                  </div>
               </div>
             )}
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2 mb-4">Command Presets</p>
            {["Analyze Liquidity Drift", "Stress-test Commercial Portfolio", "Model Inflation Spike impact"].map((text, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(text)} 
                disabled={loading} 
                className="w-full text-left p-6 rounded-2xl bg-black border border-zinc-900 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group flex items-start justify-between disabled:opacity-30"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-blue-400 leading-relaxed">{text}</span>
                <ChevronRight size={16} className="text-zinc-800 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="h-24 border-b border-zinc-900 px-12 flex items-center justify-between bg-black/40 backdrop-blur-xl z-20">
          <div className="flex items-center space-x-6">
            <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_#10b981] ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <span className="font-black text-white text-base uppercase tracking-[0.4em] italic">Quantum_Advisory_Node</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setVoiceEnabled(!voiceEnabled)} 
              className={`flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all ${voiceEnabled ? 'bg-blue-600/10 border-blue-500/20 text-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{voiceEnabled ? 'Voice Online' : 'Voice Muted'}</span>
              {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
              <div className={`flex max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-8`}>
                <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center border transition-all ${m.role === 'user' ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-900/40'}`}>
                  {m.role === 'user' ? <User size={24} /> : <Bot size={28} />}
                </div>
                <div className={`p-10 rounded-[3rem] ${m.role === 'user' ? 'bg-zinc-900 text-zinc-100 rounded-tr-none border border-zinc-800' : 'bg-black border border-zinc-800 text-zinc-300 rounded-tl-none shadow-2xl'}`}>
                  <div className="text-lg font-medium leading-relaxed tracking-tight whitespace-pre-wrap italic">
                    {m.content || (m.isStreaming ? (
                      <div className="flex items-center gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] animate-pulse">Calculating Alpha...</span>
                      </div>
                    ) : "Establishing Handshake...")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-10 bg-black/20 border-t border-zinc-900 backdrop-blur-2xl z-20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="relative group max-w-6xl mx-auto flex gap-6"
          >
            <div className="relative flex-1">
              <Zap className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Authorize treasury instructions..." 
                className="w-full bg-black border border-zinc-800 focus:border-blue-500 rounded-[2.5rem] py-8 pl-16 pr-10 text-white text-lg outline-none transition-all placeholder:text-zinc-900 font-bold shadow-inner" 
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !input.trim()} 
              className="px-12 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-4 disabled:opacity-50 shadow-2xl shadow-blue-900/40 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              <span>Dispatch</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Advisor;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Advisor.tsx
================================================================================


import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Bot, Sparkles, Loader2, Volume2, VolumeX, ChevronRight, Zap
} from 'lucide-react';
import { synthesizeSpeech, getFinancialAdviceStream } from '../services/geminiService';
import { apiClient } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const Advisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMemory = async () => {
      try {
        const history = await apiClient.chat.getHistory();
        if (history && history.length > 0) {
          setMessages(history.map((h: any) => ({ ...h, id: h.id.toString() })));
        } else {
          setMessages([{ id: '1', role: 'assistant', content: "Neural Core online. Standing by for institutional instructions.", timestamp: new Date().toISOString() }]);
        }
      } catch (err) {
        setMessages([{ id: '1', role: 'assistant', content: "Neural Core online. Safe mode registry active.", timestamp: new Date().toISOString() }]);
      }
    };
    initMemory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (forcedInput?: string) => {
    const query = (forcedInput || input).trim();
    if (!query || loading) return;

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { 
      id: userMsgId, 
      role: 'user', 
      content: query, 
      timestamp: new Date().toISOString() 
    }]);
    
    setInput('');
    setLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { 
      id: assistantMsgId, 
      role: 'assistant', 
      content: '', 
      timestamp: new Date().toISOString(), 
      isStreaming: true 
    }]);

    try {
      const context = { system: "LUMINA_ADVISORY_NODE", mode: "Institutional_Treasury" };
      const stream = await getFinancialAdviceStream(query, context);
      
      let fullContent = '';
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullContent += text;
          setMessages(prev => prev.map(m => 
            m.id === assistantMsgId ? { ...m, content: fullContent } : m
          ));
        }
      }
      
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { ...m, isStreaming: false } : m
      ));
      
      await apiClient.chat.saveMessage('user', query);
      await apiClient.chat.saveMessage('assistant', fullContent);
      
      if (voiceEnabled) {
        setIsSpeaking(true);
        await synthesizeSpeech(fullContent, 'Kore');
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Stream error:", error);
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { 
          ...m, 
          content: "Neural link lost. Parity handshake error.", 
          isStreaming: false 
        } : m
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-10 animate-in fade-in duration-700">
      <div className="hidden lg:flex flex-col w-96 space-y-8">
        <div className="bg-zinc-950 border border-zinc-800 rounded-[3rem] p-10 flex flex-col h-full relative overflow-hidden shadow-2xl">
          <div className="flex items-center space-x-3 mb-10 relative z-10">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-white font-black italic tracking-tighter uppercase text-xl">Nexus_Core</h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Mode: Neural Advisory</p>
            </div>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar relative z-10">
             {isSpeaking && (
               <div className="mb-6 p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center gap-4 animate-pulse">
                  <Volume2 size={24} className="text-blue-500" />
                  <div className="flex-1">
                     <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Active Transmission</p>
                     <p className="text-[10px] text-zinc-300 font-bold uppercase mt-1">Neural Audio Stream</p>
                  </div>
               </div>
             )}
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2 mb-4">Command Presets</p>
            {["Analyze Liquidity Drift", "Stress-test Commercial Portfolio", "Model Inflation Spike impact"].map((text, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(text)} 
                disabled={loading} 
                className="w-full text-left p-6 rounded-2xl bg-black border border-zinc-900 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group flex items-start justify-between disabled:opacity-30"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-blue-400 leading-relaxed">{text}</span>
                <ChevronRight size={16} className="text-zinc-800 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="h-24 border-b border-zinc-900 px-12 flex items-center justify-between bg-black/40 backdrop-blur-xl z-20">
          <div className="flex items-center space-x-6">
            <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_#10b981] ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <span className="font-black text-white text-base uppercase tracking-[0.4em] italic">Quantum_Advisory_Node</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setVoiceEnabled(!voiceEnabled)} 
              className={`flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all ${voiceEnabled ? 'bg-blue-600/10 border-blue-500/20 text-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{voiceEnabled ? 'Voice Online' : 'Voice Muted'}</span>
              {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
              <div className={`flex max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-8`}>
                <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center border transition-all ${m.role === 'user' ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-900/40'}`}>
                  {m.role === 'user' ? <User size={24} /> : <Bot size={28} />}
                </div>
                <div className={`p-10 rounded-[3rem] ${m.role === 'user' ? 'bg-zinc-900 text-zinc-100 rounded-tr-none border border-zinc-800' : 'bg-black border border-zinc-800 text-zinc-300 rounded-tl-none shadow-2xl'}`}>
                  <div className="text-lg font-medium leading-relaxed tracking-tight whitespace-pre-wrap italic">
                    {m.content || (m.isStreaming ? (
                      <div className="flex items-center gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] animate-pulse">Calculating Alpha...</span>
                      </div>
                    ) : "Establishing Handshake...")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-10 bg-black/20 border-t border-zinc-900 backdrop-blur-2xl z-20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="relative group max-w-6xl mx-auto flex gap-6"
          >
            <div className="relative flex-1">
              <Zap className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Authorize treasury instructions..." 
                className="w-full bg-black border border-zinc-800 focus:border-blue-500 rounded-[2.5rem] py-8 pl-16 pr-10 text-white text-lg outline-none transition-all placeholder:text-zinc-900 font-bold shadow-inner" 
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !input.trim()} 
              className="px-12 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-4 disabled:opacity-50 shadow-2xl shadow-blue-900/40 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              <span>Dispatch</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
