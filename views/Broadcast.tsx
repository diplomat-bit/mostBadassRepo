// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Broadcast.tsx
================================================================================


import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, 
  Volume2, 
  Mic2, 
  Settings2, 
  Loader2, 
  Zap, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Users, 
  ChevronRight, 
  Activity,
  ShieldCheck,
  Search,
  Filter,
  X
} from 'lucide-react';
import { synthesizeSpeech, TTS_VOICES, TTS_LANGUAGES, callGemini } from '../services/geminiService';

const Broadcast: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState(TTS_LANGUAGES.find(l => l.code === 'en')!);
  const [selectedVoice, setSelectedVoice] = useState(TTS_VOICES[0]);
  const [directorNotes, setDirectorNotes] = useState('Professional, authoritative corporate tone.');
  const [transcript, setTranscript] = useState("Greetings, this is a global institutional broadcast via the Lumina Quantum Node. System parity achieved.");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const filteredLangs = useMemo(() => 
    TTS_LANGUAGES.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase())), 
  [searchTerm]);

  const handleGenerateNotes = async () => {
    try {
      const response = await callGemini('gemini-3-flash-preview', 
        `Generate professional director's notes for a TTS reading in ${selectedLang.name}. The theme is "Institutional Treasury Release". Tone should be ${selectedVoice.style}. Native dialect.`
      );
      setDirectorNotes(response.text || '');
    } catch (e) {
      console.error(e);
    }
  };

  const handleBroadcast = async () => {
    setIsSynthesizing(true);
    // This now triggers a true translation and native voice synth
    await synthesizeSpeech({
      text: transcript,
      voiceName: selectedVoice.name,
      language: selectedLang.name,
      directorNotes: directorNotes
    });
    setIsSynthesizing(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Global <span className="text-blue-500 not-italic">Broadcast</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Globe size={12} className="text-blue-500" />
            Polyglot Neural Synthesis • Native Waveforms Online
          </p>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
           <div className="px-6 py-2.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3 bg-blue-600 shadow-xl shadow-blue-900/40">
             <Mic2 size={14} /> Neural Soundstage
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 shadow-2xl h-[calc(100vh-350px)] flex flex-col relative overflow-hidden">
             <div className="relative z-10 mb-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest italic">Target Language Node</h3>
                  <span className="text-[9px] font-black text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full">{filteredLangs.length} Nodes</span>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Language..."
                    className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
                  />
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 relative z-10">
                {filteredLangs.map(lang => (
                  <button 
                    key={lang.code}
                    onClick={() => setSelectedLang(lang)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedLang.code === lang.code ? 'bg-blue-600 border-blue-500 text-white shadow-xl' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang.name}</span>
                    <span className={`text-[9px] mono font-bold opacity-40 ${selectedLang.code === lang.code ? 'text-white' : ''}`}>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                        <Volume2 size={32} className="animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedLang.name} Link</h4>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Active Node: {selectedLang.code.toUpperCase()}_PARITY</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="px-6 py-2 bg-black border border-white/10 rounded-full flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Translator Ready</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Native Voice Profile</label>
                        <select 
                          value={selectedVoice.name}
                          onChange={(e) => setSelectedVoice(TTS_VOICES.find(v => v.name === e.target.value)!)}
                          className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          {TTS_VOICES.map(v => (
                            <option key={v.name} value={v.name}>{v.name} — {v.style}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Directorial Notes</label>
                          <button onClick={handleGenerateNotes} className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                             <Sparkles size={10} /> Neural Architect
                          </button>
                        </div>
                        <textarea 
                          value={directorNotes}
                          onChange={(e) => setDirectorNotes(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-2xl p-6 text-zinc-300 text-[11px] font-medium leading-relaxed italic h-32 outline-none focus:border-blue-500 transition-all resize-none"
                        />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">English Script (Auto-Translated)</label>
                      <div className="relative">
                        <textarea 
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-[2.5rem] p-8 text-white text-base font-bold leading-relaxed tracking-tight h-[280px] outline-none focus:border-blue-500 transition-all resize-none placeholder:text-zinc-800"
                          placeholder="Input the global broadcast content in English..."
                        />
                        <div className="absolute bottom-6 right-8 text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                          {transcript.length} Chars
                        </div>
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleBroadcast}
                    disabled={isSynthesizing || !transcript.trim()}
                    className="w-full py-7 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-6 shadow-2xl shadow-blue-900/40 group"
                  >
                    {isSynthesizing ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        <span>Translating & Synthesizing Waveform...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={24} className="group-hover:scale-125 transition-transform" />
                        <span>Execute Multilingual Broadcast</span>
                        <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
             </div>
          </div>

          <div className="p-8 bg-white/5 border border-white/5 rounded-[3rem] backdrop-blur-xl flex items-center gap-8">
             <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <ShieldCheck size={28} />
             </div>
             <div>
                <h5 className="text-white font-black text-xs uppercase tracking-widest italic">Translation Fidelity: Verified</h5>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Lumina is currently using Gemini 2.5 Flash to perform native stylistic translations for over 6 target regions.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Broadcast.tsx
================================================================================


import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, 
  Volume2, 
  Mic2, 
  Settings2, 
  Loader2, 
  Zap, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Users, 
  ChevronRight, 
  Activity,
  ShieldCheck,
  Search,
  Filter,
  X
} from 'lucide-react';
import { synthesizeSpeech, TTS_VOICES, TTS_LANGUAGES, callGemini } from '../services/geminiService';

const Broadcast: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState(TTS_LANGUAGES.find(l => l.code === 'en')!);
  const [selectedVoice, setSelectedVoice] = useState(TTS_VOICES[0]);
  const [directorNotes, setDirectorNotes] = useState('Professional, authoritative corporate tone.');
  const [transcript, setTranscript] = useState("Greetings, this is a global institutional broadcast via the Lumina Quantum Node. System parity achieved.");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const filteredLangs = useMemo(() => 
    TTS_LANGUAGES.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase())), 
  [searchTerm]);

  const handleGenerateNotes = async () => {
    try {
      const response = await callGemini('gemini-3-flash-preview', 
        `Generate professional director's notes for a TTS reading in ${selectedLang.name}. The theme is "Institutional Treasury Release". Tone should be ${selectedVoice.style}. Native dialect.`
      );
      setDirectorNotes(response.text || '');
    } catch (e) {
      console.error(e);
    }
  };

  const handleBroadcast = async () => {
    setIsSynthesizing(true);
    // This now triggers a true translation and native voice synth
    await synthesizeSpeech({
      text: transcript,
      voiceName: selectedVoice.name,
      language: selectedLang.name,
      directorNotes: directorNotes
    });
    setIsSynthesizing(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Global <span className="text-blue-500 not-italic">Broadcast</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Globe size={12} className="text-blue-500" />
            Polyglot Neural Synthesis • Native Waveforms Online
          </p>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
           <div className="px-6 py-2.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3 bg-blue-600 shadow-xl shadow-blue-900/40">
             <Mic2 size={14} /> Neural Soundstage
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 shadow-2xl h-[calc(100vh-350px)] flex flex-col relative overflow-hidden">
             <div className="relative z-10 mb-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest italic">Target Language Node</h3>
                  <span className="text-[9px] font-black text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full">{filteredLangs.length} Nodes</span>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Language..."
                    className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
                  />
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 relative z-10">
                {filteredLangs.map(lang => (
                  <button 
                    key={lang.code}
                    onClick={() => setSelectedLang(lang)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedLang.code === lang.code ? 'bg-blue-600 border-blue-500 text-white shadow-xl' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang.name}</span>
                    <span className={`text-[9px] mono font-bold opacity-40 ${selectedLang.code === lang.code ? 'text-white' : ''}`}>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                        <Volume2 size={32} className="animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedLang.name} Link</h4>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Active Node: {selectedLang.code.toUpperCase()}_PARITY</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="px-6 py-2 bg-black border border-white/10 rounded-full flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Translator Ready</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Native Voice Profile</label>
                        <select 
                          value={selectedVoice.name}
                          onChange={(e) => setSelectedVoice(TTS_VOICES.find(v => v.name === e.target.value)!)}
                          className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          {TTS_VOICES.map(v => (
                            <option key={v.name} value={v.name}>{v.name} — {v.style}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Directorial Notes</label>
                          <button onClick={handleGenerateNotes} className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                             <Sparkles size={10} /> Neural Architect
                          </button>
                        </div>
                        <textarea 
                          value={directorNotes}
                          onChange={(e) => setDirectorNotes(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-2xl p-6 text-zinc-300 text-[11px] font-medium leading-relaxed italic h-32 outline-none focus:border-blue-500 transition-all resize-none"
                        />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">English Script (Auto-Translated)</label>
                      <div className="relative">
                        <textarea 
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-[2.5rem] p-8 text-white text-base font-bold leading-relaxed tracking-tight h-[280px] outline-none focus:border-blue-500 transition-all resize-none placeholder:text-zinc-800"
                          placeholder="Input the global broadcast content in English..."
                        />
                        <div className="absolute bottom-6 right-8 text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                          {transcript.length} Chars
                        </div>
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleBroadcast}
                    disabled={isSynthesizing || !transcript.trim()}
                    className="w-full py-7 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-6 shadow-2xl shadow-blue-900/40 group"
                  >
                    {isSynthesizing ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        <span>Translating & Synthesizing Waveform...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={24} className="group-hover:scale-125 transition-transform" />
                        <span>Execute Multilingual Broadcast</span>
                        <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
             </div>
          </div>

          <div className="p-8 bg-white/5 border border-white/5 rounded-[3rem] backdrop-blur-xl flex items-center gap-8">
             <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <ShieldCheck size={28} />
             </div>
             <div>
                <h5 className="text-white font-black text-xs uppercase tracking-widest italic">Translation Fidelity: Verified</h5>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Lumina is currently using Gemini 2.5 Flash to perform native stylistic translations for over 6 target regions.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Broadcast.tsx
================================================================================


import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, 
  Volume2, 
  Mic2, 
  Settings2, 
  Loader2, 
  Zap, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Users, 
  ChevronRight, 
  Activity,
  ShieldCheck,
  Search,
  Filter,
  X
} from 'lucide-react';
import { synthesizeSpeech, TTS_VOICES, TTS_LANGUAGES, callGemini } from '../services/geminiService';

const Broadcast: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState(TTS_LANGUAGES.find(l => l.code === 'en')!);
  const [selectedVoice, setSelectedVoice] = useState(TTS_VOICES[0]);
  const [directorNotes, setDirectorNotes] = useState('Professional, authoritative corporate tone.');
  const [transcript, setTranscript] = useState("Greetings, this is a global institutional broadcast via the Lumina Quantum Node. System parity achieved.");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const filteredLangs = useMemo(() => 
    TTS_LANGUAGES.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase())), 
  [searchTerm]);

  const handleGenerateNotes = async () => {
    try {
      const response = await callGemini('gemini-3-flash-preview', 
        `Generate professional director's notes for a TTS reading in ${selectedLang.name}. The theme is "Institutional Treasury Release". Tone should be ${selectedVoice.style}. Native dialect.`
      );
      setDirectorNotes(response.text || '');
    } catch (e) {
      console.error(e);
    }
  };

  const handleBroadcast = async () => {
    setIsSynthesizing(true);
    // This now triggers a true translation and native voice synth
    await synthesizeSpeech({
      text: transcript,
      voiceName: selectedVoice.name,
      language: selectedLang.name,
      directorNotes: directorNotes
    });
    setIsSynthesizing(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Global <span className="text-blue-500 not-italic">Broadcast</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Globe size={12} className="text-blue-500" />
            Polyglot Neural Synthesis • Native Waveforms Online
          </p>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
           <div className="px-6 py-2.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3 bg-blue-600 shadow-xl shadow-blue-900/40">
             <Mic2 size={14} /> Neural Soundstage
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 shadow-2xl h-[calc(100vh-350px)] flex flex-col relative overflow-hidden">
             <div className="relative z-10 mb-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest italic">Target Language Node</h3>
                  <span className="text-[9px] font-black text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full">{filteredLangs.length} Nodes</span>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Language..."
                    className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
                  />
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 relative z-10">
                {filteredLangs.map(lang => (
                  <button 
                    key={lang.code}
                    onClick={() => setSelectedLang(lang)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedLang.code === lang.code ? 'bg-blue-600 border-blue-500 text-white shadow-xl' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang.name}</span>
                    <span className={`text-[9px] mono font-bold opacity-40 ${selectedLang.code === lang.code ? 'text-white' : ''}`}>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                        <Volume2 size={32} className="animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedLang.name} Link</h4>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Active Node: {selectedLang.code.toUpperCase()}_PARITY</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="px-6 py-2 bg-black border border-white/10 rounded-full flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Translator Ready</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Native Voice Profile</label>
                        <select 
                          value={selectedVoice.name}
                          onChange={(e) => setSelectedVoice(TTS_VOICES.find(v => v.name === e.target.value)!)}
                          className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          {TTS_VOICES.map(v => (
                            <option key={v.name} value={v.name}>{v.name} — {v.style}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Directorial Notes</label>
                          <button onClick={handleGenerateNotes} className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                             <Sparkles size={10} /> Neural Architect
                          </button>
                        </div>
                        <textarea 
                          value={directorNotes}
                          onChange={(e) => setDirectorNotes(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-2xl p-6 text-zinc-300 text-[11px] font-medium leading-relaxed italic h-32 outline-none focus:border-blue-500 transition-all resize-none"
                        />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">English Script (Auto-Translated)</label>
                      <div className="relative">
                        <textarea 
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-[2.5rem] p-8 text-white text-base font-bold leading-relaxed tracking-tight h-[280px] outline-none focus:border-blue-500 transition-all resize-none placeholder:text-zinc-800"
                          placeholder="Input the global broadcast content in English..."
                        />
                        <div className="absolute bottom-6 right-8 text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                          {transcript.length} Chars
                        </div>
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleBroadcast}
                    disabled={isSynthesizing || !transcript.trim()}
                    className="w-full py-7 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-6 shadow-2xl shadow-blue-900/40 group"
                  >
                    {isSynthesizing ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        <span>Translating & Synthesizing Waveform...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={24} className="group-hover:scale-125 transition-transform" />
                        <span>Execute Multilingual Broadcast</span>
                        <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
             </div>
          </div>

          <div className="p-8 bg-white/5 border border-white/5 rounded-[3rem] backdrop-blur-xl flex items-center gap-8">
             <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <ShieldCheck size={28} />
             </div>
             <div>
                <h5 className="text-white font-black text-xs uppercase tracking-widest italic">Translation Fidelity: Verified</h5>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Lumina is currently using Gemini 2.5 Flash to perform native stylistic translations for over 6 target regions.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
