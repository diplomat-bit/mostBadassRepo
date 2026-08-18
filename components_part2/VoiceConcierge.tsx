// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/components/VoiceConcierge.tsx
================================================================================


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Zap, Activity, Volume2, ShieldAlert, BrainCircuit, Loader2, Maximize2, Minimize2, Eye } from 'lucide-react';
import { connectVoiceSession, createPcmBlob, decodeAudio, decodeAudioData } from '../services/geminiLiveService';

const VoiceConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);

  const handleDisconnect = useCallback(() => {
    if (sessionRef.current) {
      // In a real scenario, we'd call session.close()
      sessionRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (frameIntervalRef.current) {
      window.clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    activeSourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    activeSourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const captureFrame = useCallback((session: any) => {
    if (!canvasRef.current) return;
    
    // Capture the entire document body or the main app content
    const root = document.getElementById('root');
    if (!root) return;

    // We can't easily capture the screen without mediaDevices.getDisplayMedia
    // but we can simulate visual context or just use audio.
    // For a real integration, we might use html2canvas if we need pixel data.
    // However, to keep it lightweight, let's stick to high-quality audio interaction
    // and assume the user describes what they see or we use route-based context.
  }, []);

  const handleConnect = async () => {
    if (isConnecting || isActive) return;
    setIsConnecting(true);
    setError(null);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (!outAudioContextRef.current) {
        outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = connectVoiceSession({
        onopen: () => {
          setIsActive(true);
          setIsConnecting(false);
          const source = audioContextRef.current!.createMediaStreamSource(micStreamRef.current!);
          const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(processor);
          processor.connect(audioContextRef.current!.destination);
          
          // Store these so we can disconnect them later
          (sessionRef.current as any) = { source, processor };
        },
        onmessage: async (msg) => {
          const base64Audio = msg.serverContent?.modelTurn?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
          if (base64Audio) {
            const ctx = outAudioContextRef.current!;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const audioBuffer = await decodeAudioData(decodeAudio(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            activeSourcesRef.current.add(source);
            source.onended = () => activeSourcesRef.current.delete(source);
          }

          if (msg.serverContent?.interrupted) {
            activeSourcesRef.current.forEach(s => {
               try { s.stop(); } catch(e) {}
            });
            activeSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (err) => {
          console.error("Concierge Error", err);
          setError("Node parity error. Handshake interrupted.");
          handleDisconnect();
        },
        onclose: () => handleDisconnect()
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error(err);
      setError("Authorization denied. Check microphone permissions.");
      setIsConnecting(false);
    }
  };

  const toggleConcierge = () => {
    if (isOpen) {
      handleDisconnect();
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[200] flex flex-col items-end">
      {isOpen && (
        <div className={`mb-6 transition-all duration-500 ease-out transform ${isMinimized ? 'w-20 h-20 opacity-0 pointer-events-none' : 'w-[400px] opacity-100'}`}>
          <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden relative group">
            {/* Top Identity bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>
            
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl border transition-all ${isActive ? 'bg-blue-600/20 border-blue-500/30 text-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                  <BrainCircuit size={28} className={isActive ? 'animate-pulse' : ''} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase italic tracking-tighter leading-none">Quantum Concierge</h3>
                  <p className="text-[9px] text-zinc-500 font-black uppercase mt-2 tracking-widest">Live Node Handshake</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsMinimized(true)} className="p-2 text-zinc-600 hover:text-white transition-colors"><Minimize2 size={18} /></button>
                <button onClick={toggleConcierge} className="p-2 text-zinc-600 hover:text-rose-500 transition-colors"><X size={18} /></button>
              </div>
            </div>

            {/* Visualization Area */}
            <div className="h-44 bg-black/40 rounded-[2.5rem] border border-zinc-900 flex items-center justify-center relative overflow-hidden group/viz">
              {isActive ? (
                <div className="flex items-end gap-1.5 h-16 relative z-10">
                   {[...Array(12)].map((_, i) => (
                     <div 
                       key={i} 
                       className="w-1.5 bg-blue-500 rounded-full animate-bounce" 
                       style={{ 
                         height: `${30 + Math.random() * 70}%`, 
                         animationDuration: `${0.4 + Math.random() * 0.4}s`,
                         animationDelay: `${i * 0.05}s`
                       }}
                     ></div>
                   ))}
                   <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
                </div>
              ) : isConnecting ? (
                <div className="flex flex-col items-center gap-4 text-zinc-600">
                   <Loader2 size={40} className="animate-spin text-blue-500" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing Protocols...</p>
                </div>
              ) : (
                <div className="text-center space-y-6 opacity-30 group-hover/viz:opacity-50 transition-opacity">
                   <MicOff size={48} className="mx-auto text-zinc-800" />
                   <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Node Idle</p>
                     <p className="text-[8px] font-bold text-zinc-700 uppercase">Handshake required</p>
                   </div>
                </div>
              )}
              {/* Optional: Visual context status */}
              <div className="absolute top-4 right-6 flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-500 animate-pulse' : 'bg-zinc-800'}`}></div>
                 <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Audio_L2</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 animate-in zoom-in-95">
                <ShieldAlert size={18} className="text-rose-500 shrink-0" />
                <p className="text-[10px] font-bold text-rose-300 uppercase tracking-tight leading-relaxed">{error}</p>
              </div>
            )}

            {/* Instruction Box */}
            {!error && !isActive && !isConnecting && (
              <div className="mt-8 p-6 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 border-dashed">
                 <p className="text-[10px] text-zinc-500 leading-relaxed font-medium italic text-center">
                   "Authorize the neural node to begin an institutional walkthrough. I can explain any feature in the mesh."
                 </p>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-10">
              <button 
                onClick={isActive ? handleDisconnect : handleConnect}
                disabled={isConnecting}
                className={`w-full py-6 rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 ${
                  isActive 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 disabled:opacity-50'
                }`}
              >
                {isActive ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isActive ? 'Disconnect Node' : isConnecting ? 'Establishing...' : 'Authorize Concierge'}</span>
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-900 text-center">
               <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.6em]">Powered by Gemini 2.5 Flash Native Audio</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button / Restore Minimized UI */}
      <div className="relative">
        {isMinimized && isOpen && (
          <div className="absolute -top-16 right-0 animate-bounce">
             <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-xl border border-blue-400/20">
                <Volume2 size={16} />
             </div>
          </div>
        )}
        
        <button 
          onClick={() => {
            if (isMinimized) {
              setIsMinimized(false);
            } else {
              toggleConcierge();
            }
          }}
          className={`w-24 h-24 rounded-[2.8rem] flex items-center justify-center transition-all duration-700 shadow-2xl border relative group overflow-hidden ${
            isOpen 
              ? 'bg-white text-black border-zinc-200 rotate-0' 
              : 'bg-zinc-950 text-blue-500 border-zinc-800 hover:border-blue-500/50 hover:scale-110'
          }`}
        >
          {isOpen && !isMinimized ? <Minimize2 size={36} className="animate-in zoom-in-50" /> : <BrainCircuit size={40} className={isActive ? 'animate-pulse' : ''} />}
          
          {!isOpen && (
            <>
              <div className="absolute inset-0 rounded-[2.8rem] border-2 border-blue-500/30 animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </>
          )}
        </button>
      </div>

      {/* Hidden canvas for potential future screen capture frames */}
      <canvas ref={canvasRef} className="hidden" width={1024} height={768} />
    </div>
  );
};

export default VoiceConcierge;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/components/VoiceConcierge.tsx
================================================================================


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Zap, Activity, Volume2, ShieldAlert, BrainCircuit, Loader2, Maximize2, Minimize2, Eye } from 'lucide-react';
import { connectVoiceSession, createPcmBlob, decodeAudio, decodeAudioData } from '../services/geminiLiveService';

const VoiceConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);

  const handleDisconnect = useCallback(() => {
    if (sessionRef.current) {
      // In a real scenario, we'd call session.close()
      sessionRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (frameIntervalRef.current) {
      window.clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    activeSourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    activeSourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const captureFrame = useCallback((session: any) => {
    if (!canvasRef.current) return;
    
    // Capture the entire document body or the main app content
    const root = document.getElementById('root');
    if (!root) return;

    // We can't easily capture the screen without mediaDevices.getDisplayMedia
    // but we can simulate visual context or just use audio.
    // For a real integration, we might use html2canvas if we need pixel data.
    // However, to keep it lightweight, let's stick to high-quality audio interaction
    // and assume the user describes what they see or we use route-based context.
  }, []);

  const handleConnect = async () => {
    if (isConnecting || isActive) return;
    setIsConnecting(true);
    setError(null);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (!outAudioContextRef.current) {
        outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = connectVoiceSession({
        onopen: () => {
          setIsActive(true);
          setIsConnecting(false);
          const source = audioContextRef.current!.createMediaStreamSource(micStreamRef.current!);
          const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(processor);
          processor.connect(audioContextRef.current!.destination);
          
          // Store these so we can disconnect them later
          (sessionRef.current as any) = { source, processor };
        },
        onmessage: async (msg) => {
          const base64Audio = msg.serverContent?.modelTurn?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
          if (base64Audio) {
            const ctx = outAudioContextRef.current!;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const audioBuffer = await decodeAudioData(decodeAudio(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            activeSourcesRef.current.add(source);
            source.onended = () => activeSourcesRef.current.delete(source);
          }

          if (msg.serverContent?.interrupted) {
            activeSourcesRef.current.forEach(s => {
               try { s.stop(); } catch(e) {}
            });
            activeSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (err) => {
          console.error("Concierge Error", err);
          setError("Node parity error. Handshake interrupted.");
          handleDisconnect();
        },
        onclose: () => handleDisconnect()
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error(err);
      setError("Authorization denied. Check microphone permissions.");
      setIsConnecting(false);
    }
  };

  const toggleConcierge = () => {
    if (isOpen) {
      handleDisconnect();
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[200] flex flex-col items-end">
      {isOpen && (
        <div className={`mb-6 transition-all duration-500 ease-out transform ${isMinimized ? 'w-20 h-20 opacity-0 pointer-events-none' : 'w-[400px] opacity-100'}`}>
          <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden relative group">
            {/* Top Identity bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>
            
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl border transition-all ${isActive ? 'bg-blue-600/20 border-blue-500/30 text-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                  <BrainCircuit size={28} className={isActive ? 'animate-pulse' : ''} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase italic tracking-tighter leading-none">Quantum Concierge</h3>
                  <p className="text-[9px] text-zinc-500 font-black uppercase mt-2 tracking-widest">Live Node Handshake</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsMinimized(true)} className="p-2 text-zinc-600 hover:text-white transition-colors"><Minimize2 size={18} /></button>
                <button onClick={toggleConcierge} className="p-2 text-zinc-600 hover:text-rose-500 transition-colors"><X size={18} /></button>
              </div>
            </div>

            {/* Visualization Area */}
            <div className="h-44 bg-black/40 rounded-[2.5rem] border border-zinc-900 flex items-center justify-center relative overflow-hidden group/viz">
              {isActive ? (
                <div className="flex items-end gap-1.5 h-16 relative z-10">
                   {[...Array(12)].map((_, i) => (
                     <div 
                       key={i} 
                       className="w-1.5 bg-blue-500 rounded-full animate-bounce" 
                       style={{ 
                         height: `${30 + Math.random() * 70}%`, 
                         animationDuration: `${0.4 + Math.random() * 0.4}s`,
                         animationDelay: `${i * 0.05}s`
                       }}
                     ></div>
                   ))}
                   <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
                </div>
              ) : isConnecting ? (
                <div className="flex flex-col items-center gap-4 text-zinc-600">
                   <Loader2 size={40} className="animate-spin text-blue-500" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing Protocols...</p>
                </div>
              ) : (
                <div className="text-center space-y-6 opacity-30 group-hover/viz:opacity-50 transition-opacity">
                   <MicOff size={48} className="mx-auto text-zinc-800" />
                   <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Node Idle</p>
                     <p className="text-[8px] font-bold text-zinc-700 uppercase">Handshake required</p>
                   </div>
                </div>
              )}
              {/* Optional: Visual context status */}
              <div className="absolute top-4 right-6 flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-500 animate-pulse' : 'bg-zinc-800'}`}></div>
                 <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Audio_L2</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 animate-in zoom-in-95">
                <ShieldAlert size={18} className="text-rose-500 shrink-0" />
                <p className="text-[10px] font-bold text-rose-300 uppercase tracking-tight leading-relaxed">{error}</p>
              </div>
            )}

            {/* Instruction Box */}
            {!error && !isActive && !isConnecting && (
              <div className="mt-8 p-6 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 border-dashed">
                 <p className="text-[10px] text-zinc-500 leading-relaxed font-medium italic text-center">
                   "Authorize the neural node to begin an institutional walkthrough. I can explain any feature in the mesh."
                 </p>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-10">
              <button 
                onClick={isActive ? handleDisconnect : handleConnect}
                disabled={isConnecting}
                className={`w-full py-6 rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 ${
                  isActive 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 disabled:opacity-50'
                }`}
              >
                {isActive ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isActive ? 'Disconnect Node' : isConnecting ? 'Establishing...' : 'Authorize Concierge'}</span>
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-900 text-center">
               <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.6em]">Powered by Gemini 2.5 Flash Native Audio</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button / Restore Minimized UI */}
      <div className="relative">
        {isMinimized && isOpen && (
          <div className="absolute -top-16 right-0 animate-bounce">
             <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-xl border border-blue-400/20">
                <Volume2 size={16} />
             </div>
          </div>
        )}
        
        <button 
          onClick={() => {
            if (isMinimized) {
              setIsMinimized(false);
            } else {
              toggleConcierge();
            }
          }}
          className={`w-24 h-24 rounded-[2.8rem] flex items-center justify-center transition-all duration-700 shadow-2xl border relative group overflow-hidden ${
            isOpen 
              ? 'bg-white text-black border-zinc-200 rotate-0' 
              : 'bg-zinc-950 text-blue-500 border-zinc-800 hover:border-blue-500/50 hover:scale-110'
          }`}
        >
          {isOpen && !isMinimized ? <Minimize2 size={36} className="animate-in zoom-in-50" /> : <BrainCircuit size={40} className={isActive ? 'animate-pulse' : ''} />}
          
          {!isOpen && (
            <>
              <div className="absolute inset-0 rounded-[2.8rem] border-2 border-blue-500/30 animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </>
          )}
        </button>
      </div>

      {/* Hidden canvas for potential future screen capture frames */}
      <canvas ref={canvasRef} className="hidden" width={1024} height={768} />
    </div>
  );
};

export default VoiceConcierge;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/components/VoiceConcierge.tsx
================================================================================


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Zap, Activity, Volume2, ShieldAlert, BrainCircuit, Loader2, Maximize2, Minimize2, Eye } from 'lucide-react';
import { connectVoiceSession, createPcmBlob, decodeAudio, decodeAudioData } from '../services/geminiLiveService';

const VoiceConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);

  const handleDisconnect = useCallback(() => {
    if (sessionRef.current) {
      // In a real scenario, we'd call session.close()
      sessionRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (frameIntervalRef.current) {
      window.clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    activeSourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    activeSourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const captureFrame = useCallback((session: any) => {
    if (!canvasRef.current) return;
    
    // Capture the entire document body or the main app content
    const root = document.getElementById('root');
    if (!root) return;

    // We can't easily capture the screen without mediaDevices.getDisplayMedia
    // but we can simulate visual context or just use audio.
    // For a real integration, we might use html2canvas if we need pixel data.
    // However, to keep it lightweight, let's stick to high-quality audio interaction
    // and assume the user describes what they see or we use route-based context.
  }, []);

  const handleConnect = async () => {
    if (isConnecting || isActive) return;
    setIsConnecting(true);
    setError(null);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (!outAudioContextRef.current) {
        outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = connectVoiceSession({
        onopen: () => {
          setIsActive(true);
          setIsConnecting(false);
          const source = audioContextRef.current!.createMediaStreamSource(micStreamRef.current!);
          const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(processor);
          processor.connect(audioContextRef.current!.destination);
          
          // Store these so we can disconnect them later
          (sessionRef.current as any) = { source, processor };
        },
        onmessage: async (msg) => {
          const base64Audio = msg.serverContent?.modelTurn?.parts.find(p => p.inlineData)?.inlineData?.data;
          if (base64Audio) {
            const ctx = outAudioContextRef.current!;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const audioBuffer = await decodeAudioData(decodeAudio(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            activeSourcesRef.current.add(source);
            source.onended = () => activeSourcesRef.current.delete(source);
          }

          if (msg.serverContent?.interrupted) {
            activeSourcesRef.current.forEach(s => {
               try { s.stop(); } catch(e) {}
            });
            activeSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (err) => {
          console.error("Concierge Error", err);
          setError("Node parity error. Handshake interrupted.");
          handleDisconnect();
        },
        onclose: () => handleDisconnect()
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error(err);
      setError("Authorization denied. Check microphone permissions.");
      setIsConnecting(false);
    }
  };

  const toggleConcierge = () => {
    if (isOpen) {
      handleDisconnect();
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[200] flex flex-col items-end">
      {isOpen && (
        <div className={`mb-6 transition-all duration-500 ease-out transform ${isMinimized ? 'w-20 h-20 opacity-0 pointer-events-none' : 'w-[400px] opacity-100'}`}>
          <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden relative group">
            {/* Top Identity bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>
            
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl border transition-all ${isActive ? 'bg-blue-600/20 border-blue-500/30 text-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                  <BrainCircuit size={28} className={isActive ? 'animate-pulse' : ''} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase italic tracking-tighter leading-none">Quantum Concierge</h3>
                  <p className="text-[9px] text-zinc-500 font-black uppercase mt-2 tracking-widest">Live Node Handshake</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsMinimized(true)} className="p-2 text-zinc-600 hover:text-white transition-colors"><Minimize2 size={18} /></button>
                <button onClick={toggleConcierge} className="p-2 text-zinc-600 hover:text-rose-500 transition-colors"><X size={18} /></button>
              </div>
            </div>

            {/* Visualization Area */}
            <div className="h-44 bg-black/40 rounded-[2.5rem] border border-zinc-900 flex items-center justify-center relative overflow-hidden group/viz">
              {isActive ? (
                <div className="flex items-end gap-1.5 h-16 relative z-10">
                   {[...Array(12)].map((_, i) => (
                     <div 
                       key={i} 
                       className="w-1.5 bg-blue-500 rounded-full animate-bounce" 
                       style={{ 
                         height: `${30 + Math.random() * 70}%`, 
                         animationDuration: `${0.4 + Math.random() * 0.4}s`,
                         animationDelay: `${i * 0.05}s`
                       }}
                     ></div>
                   ))}
                   <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
                </div>
              ) : isConnecting ? (
                <div className="flex flex-col items-center gap-4 text-zinc-600">
                   <Loader2 size={40} className="animate-spin text-blue-500" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing Protocols...</p>
                </div>
              ) : (
                <div className="text-center space-y-6 opacity-30 group-hover/viz:opacity-50 transition-opacity">
                   <MicOff size={48} className="mx-auto text-zinc-800" />
                   <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Node Idle</p>
                     <p className="text-[8px] font-bold text-zinc-700 uppercase">Handshake required</p>
                   </div>
                </div>
              )}
              {/* Optional: Visual context status */}
              <div className="absolute top-4 right-6 flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-500 animate-pulse' : 'bg-zinc-800'}`}></div>
                 <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Audio_L2</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 animate-in zoom-in-95">
                <ShieldAlert size={18} className="text-rose-500 shrink-0" />
                <p className="text-[10px] font-bold text-rose-300 uppercase tracking-tight leading-relaxed">{error}</p>
              </div>
            )}

            {/* Instruction Box */}
            {!error && !isActive && !isConnecting && (
              <div className="mt-8 p-6 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 border-dashed">
                 <p className="text-[10px] text-zinc-500 leading-relaxed font-medium italic text-center">
                   "Authorize the neural node to begin an institutional walkthrough. I can explain any feature in the mesh."
                 </p>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-10">
              <button 
                onClick={isActive ? handleDisconnect : handleConnect}
                disabled={isConnecting}
                className={`w-full py-6 rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 ${
                  isActive 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 disabled:opacity-50'
                }`}
              >
                {isActive ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isActive ? 'Disconnect Node' : isConnecting ? 'Establishing...' : 'Authorize Concierge'}</span>
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-900 text-center">
               <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.6em]">Powered by Gemini 2.5 Flash Native Audio</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button / Restore Minimized UI */}
      <div className="relative">
        {isMinimized && isOpen && (
          <div className="absolute -top-16 right-0 animate-bounce">
             <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-xl border border-blue-400/20">
                <Volume2 size={16} />
             </div>
          </div>
        )}
        
        <button 
          onClick={() => {
            if (isMinimized) {
              setIsMinimized(false);
            } else {
              toggleConcierge();
            }
          }}
          className={`w-24 h-24 rounded-[2.8rem] flex items-center justify-center transition-all duration-700 shadow-2xl border relative group overflow-hidden ${
            isOpen 
              ? 'bg-white text-black border-zinc-200 rotate-0' 
              : 'bg-zinc-950 text-blue-500 border-zinc-800 hover:border-blue-500/50 hover:scale-110'
          }`}
        >
          {isOpen && !isMinimized ? <Minimize2 size={36} className="animate-in zoom-in-50" /> : <BrainCircuit size={40} className={isActive ? 'animate-pulse' : ''} />}
          
          {!isOpen && (
            <>
              <div className="absolute inset-0 rounded-[2.8rem] border-2 border-blue-500/30 animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </>
          )}
        </button>
      </div>

      {/* Hidden canvas for potential future screen capture frames */}
      <canvas ref={canvasRef} className="hidden" width={1024} height={768} />
    </div>
  );
};

export default VoiceConcierge;
