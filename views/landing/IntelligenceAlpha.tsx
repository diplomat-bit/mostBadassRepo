// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/landing/IntelligenceAlpha.tsx
================================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Activity, BrainCircuit, Zap, BarChart3, Database, Shield, Globe, Cpu, ArrowUpRight } from 'lucide-react';

const IntelligenceAlpha: React.FC = () => {
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [predictionCycle, setPredictionCycle] = useState(0);
  const [confidence, setConfidence] = useState(98.4);
  const [marketBias, setMarketBias] = useState('BULLISH');

  // High-density grid simulation
  const grid = useMemo(() => Array.from({ length: 64 }, (_, i) => ({
    id: i,
    intensity: Math.random() * 100,
    signal: (Math.random() * 10).toFixed(2),
    coord: `NODE_${Math.floor(i/8)}_${i%8}`
  })), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPredictionCycle(prev => (prev + 1) % 100);
      setConfidence(prev => Math.max(95, Math.min(99.9, prev + (Math.random() - 0.5))));
      if (Math.random() > 0.95) setMarketBias(b => b === 'BULLISH' ? 'STABLE' : 'BULLISH');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-60 border-b border-zinc-900 bg-[#050505] relative overflow-hidden">
      {/* Decorative Neural Web Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#3b82f6" />
              <path d="M0 0 L100 100 M100 0 L0 100" stroke="#3b82f6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="order-2 lg:order-1 relative group">
             <div className="absolute -inset-10 bg-emerald-500/5 blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
             
             <div className="bg-black border border-zinc-900 rounded-[5rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-[1.8rem] border border-emerald-500/20 shadow-2xl">
                         <BrainCircuit size={32} />
                      </div>
                      <div>
                         <h4 className="text-white font-black uppercase tracking-[0.3em] italic text-sm">Neural Synthesis Grid</h4>
                         <p className="text-[9px] text-zinc-600 font-black uppercase mt-1">Matrix: 8x8 • Entropy: 0.0042</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Cycle #{predictionCycle}</span>
                      </div>
                      <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Parity Synchronized</p>
                   </div>
                </div>

                {/* Dense Interaction Grid */}
                <div className="grid grid-cols-8 gap-4 h-96">
                   {grid.map((cell) => (
                     <div 
                        key={cell.id} 
                        onMouseEnter={() => setActiveCell(cell.id)}
                        onMouseLeave={() => setActiveCell(null)}
                        className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl relative overflow-hidden group cursor-crosshair transition-all hover:scale-125 hover:z-30 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10"
                     >
                        <div 
                           className="absolute inset-0 bg-emerald-500 transition-opacity duration-1000" 
                           style={{ opacity: cell.intensity / 500 }}
                        ></div>
                        {activeCell === cell.id && (
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 animate-in zoom-in-50 duration-300">
                              <span className="text-[8px] font-black text-emerald-500 mono leading-none mb-0.5">{cell.signal}</span>
                              <span className="text-[6px] font-black text-zinc-600 mono leading-none">{cell.coord}</span>
                           </div>
                        )}
                        <div className="absolute top-1 left-1 w-0.5 h-0.5 rounded-full bg-white/5"></div>
                     </div>
                   ))}
                </div>

                <div className="mt-12 grid grid-cols-2 gap-8">
                   <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[3rem] space-y-4 group/box hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Activity size={18} className="text-emerald-500" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Sentiment Bias</span>
                         </div>
                         <span className="text-xs font-black text-emerald-500 mono">{marketBias}</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" style={{ width: '74%' }}></div>
                      </div>
                   </div>
                   <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[3rem] space-y-4 group/box hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <ArrowUpRight size={18} className="text-emerald-500" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Alpha Prediction</span>
                         </div>
                         <span className="text-xs font-black text-emerald-500 mono">+14.2%</span>
                      </div>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase leading-none">Expected Drift (24h)</p>
                   </div>
                </div>

                <div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]">
                   <p className="text-xs text-zinc-500 font-medium leading-relaxed italic text-center">
                     "LQI Oracle detects high-confidence institutional accumulation patterns on Layer 2 protocols. Executing directional alpha signals."
                   </p>
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2 space-y-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-in slide-in-from-right-4 duration-700">
                <Cpu size={16} className="text-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">Neural_Logic_Tier_1</span>
              </div>
              <h2 className="text-[6rem] lg:text-[10rem] font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-4">Neural <br /> <span className="text-emerald-500 not-italic">Alpha</span></h2>
              <p className="text-zinc-400 text-3xl font-bold italic leading-relaxed">
                "Our <span className="text-white">Lumina Oracle</span> processes petabytes of financial metadata to generate actionable insights. By leveraging subspace <span className="text-emerald-500">entanglement</span>, we predict market shifts before they reach consensus."
              </p>
            </div>

            <div className="space-y-8">
              {[
                { title: 'Alpha Signal', desc: 'Real-time directional drift detection', state: 'ACTIVE', icon: Zap, color: 'emerald' },
                { title: 'Confidence', desc: 'Predictive mathematical precision', state: `${confidence.toFixed(1)}%`, icon: BarChart3, color: 'blue' },
                { title: 'Protocol Mask', desc: 'Deterministic consensus trace', state: 'VERIFIED', icon: Database, color: 'purple' },
                { title: 'Global Parity', desc: 'Node-to-Node verification', state: '100%', icon: Globe, color: 'amber' },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between p-10 bg-zinc-950 border border-zinc-900 rounded-[3.5rem] group hover:border-emerald-500/20 transition-all hover:translate-x-4 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                    <node.icon size={120} />
                  </div>
                  <div className="flex items-center gap-10">
                    <div className={`p-6 bg-zinc-900 rounded-3xl text-zinc-700 group-hover:text-${node.color}-500 transition-colors shadow-2xl border border-white/5`}>
                      <node.icon size={32} />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-lg uppercase tracking-widest italic leading-none mb-2">{node.title}</h4>
                      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">{node.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-emerald-500 font-black text-xl mono tracking-tighter italic">{node.state}</span>
                    <div className="h-1 w-12 bg-zinc-900 rounded-full mt-2 ml-auto overflow-hidden">
                       <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntelligenceAlpha;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/landing/IntelligenceAlpha.tsx
================================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Activity, BrainCircuit, Zap, BarChart3, Database, Shield, Globe, Cpu, ArrowUpRight } from 'lucide-react';

const IntelligenceAlpha: React.FC = () => {
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [predictionCycle, setPredictionCycle] = useState(0);
  const [confidence, setConfidence] = useState(98.4);
  const [marketBias, setMarketBias] = useState('BULLISH');

  // High-density grid simulation
  const grid = useMemo(() => Array.from({ length: 64 }, (_, i) => ({
    id: i,
    intensity: Math.random() * 100,
    signal: (Math.random() * 10).toFixed(2),
    coord: `NODE_${Math.floor(i/8)}_${i%8}`
  })), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPredictionCycle(prev => (prev + 1) % 100);
      setConfidence(prev => Math.max(95, Math.min(99.9, prev + (Math.random() - 0.5))));
      if (Math.random() > 0.95) setMarketBias(b => b === 'BULLISH' ? 'STABLE' : 'BULLISH');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-60 border-b border-zinc-900 bg-[#050505] relative overflow-hidden">
      {/* Decorative Neural Web Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#3b82f6" />
              <path d="M0 0 L100 100 M100 0 L0 100" stroke="#3b82f6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="order-2 lg:order-1 relative group">
             <div className="absolute -inset-10 bg-emerald-500/5 blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
             
             <div className="bg-black border border-zinc-900 rounded-[5rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-[1.8rem] border border-emerald-500/20 shadow-2xl">
                         <BrainCircuit size={32} />
                      </div>
                      <div>
                         <h4 className="text-white font-black uppercase tracking-[0.3em] italic text-sm">Neural Synthesis Grid</h4>
                         <p className="text-[9px] text-zinc-600 font-black uppercase mt-1">Matrix: 8x8 • Entropy: 0.0042</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Cycle #{predictionCycle}</span>
                      </div>
                      <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Parity Synchronized</p>
                   </div>
                </div>

                {/* Dense Interaction Grid */}
                <div className="grid grid-cols-8 gap-4 h-96">
                   {grid.map((cell) => (
                     <div 
                        key={cell.id} 
                        onMouseEnter={() => setActiveCell(cell.id)}
                        onMouseLeave={() => setActiveCell(null)}
                        className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl relative overflow-hidden group cursor-crosshair transition-all hover:scale-125 hover:z-30 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10"
                     >
                        <div 
                           className="absolute inset-0 bg-emerald-500 transition-opacity duration-1000" 
                           style={{ opacity: cell.intensity / 500 }}
                        ></div>
                        {activeCell === cell.id && (
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 animate-in zoom-in-50 duration-300">
                              <span className="text-[8px] font-black text-emerald-500 mono leading-none mb-0.5">{cell.signal}</span>
                              <span className="text-[6px] font-black text-zinc-600 mono leading-none">{cell.coord}</span>
                           </div>
                        )}
                        <div className="absolute top-1 left-1 w-0.5 h-0.5 rounded-full bg-white/5"></div>
                     </div>
                   ))}
                </div>

                <div className="mt-12 grid grid-cols-2 gap-8">
                   <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[3rem] space-y-4 group/box hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Activity size={18} className="text-emerald-500" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Sentiment Bias</span>
                         </div>
                         <span className="text-xs font-black text-emerald-500 mono">{marketBias}</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" style={{ width: '74%' }}></div>
                      </div>
                   </div>
                   <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[3rem] space-y-4 group/box hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <ArrowUpRight size={18} className="text-emerald-500" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Alpha Prediction</span>
                         </div>
                         <span className="text-xs font-black text-emerald-500 mono">+14.2%</span>
                      </div>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase leading-none">Expected Drift (24h)</p>
                   </div>
                </div>

                <div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]">
                   <p className="text-xs text-zinc-500 font-medium leading-relaxed italic text-center">
                     "LQI Oracle detects high-confidence institutional accumulation patterns on Layer 2 protocols. Executing directional alpha signals."
                   </p>
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2 space-y-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-in slide-in-from-right-4 duration-700">
                <Cpu size={16} className="text-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">Neural_Logic_Tier_1</span>
              </div>
              <h2 className="text-[6rem] lg:text-[10rem] font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-4">Neural <br /> <span className="text-emerald-500 not-italic">Alpha</span></h2>
              <p className="text-zinc-400 text-3xl font-bold italic leading-relaxed">
                "Our <span className="text-white">Lumina Oracle</span> processes petabytes of financial metadata to generate actionable insights. By leveraging subspace <span className="text-emerald-500">entanglement</span>, we predict market shifts before they reach consensus."
              </p>
            </div>

            <div className="space-y-8">
              {[
                { title: 'Alpha Signal', desc: 'Real-time directional drift detection', state: 'ACTIVE', icon: Zap, color: 'emerald' },
                { title: 'Confidence', desc: 'Predictive mathematical precision', state: `${confidence.toFixed(1)}%`, icon: BarChart3, color: 'blue' },
                { title: 'Protocol Mask', desc: 'Deterministic consensus trace', state: 'VERIFIED', icon: Database, color: 'purple' },
                { title: 'Global Parity', desc: 'Node-to-Node verification', state: '100%', icon: Globe, color: 'amber' },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between p-10 bg-zinc-950 border border-zinc-900 rounded-[3.5rem] group hover:border-emerald-500/20 transition-all hover:translate-x-4 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                    <node.icon size={120} />
                  </div>
                  <div className="flex items-center gap-10">
                    <div className={`p-6 bg-zinc-900 rounded-3xl text-zinc-700 group-hover:text-${node.color}-500 transition-colors shadow-2xl border border-white/5`}>
                      <node.icon size={32} />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-lg uppercase tracking-widest italic leading-none mb-2">{node.title}</h4>
                      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">{node.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-emerald-500 font-black text-xl mono tracking-tighter italic">{node.state}</span>
                    <div className="h-1 w-12 bg-zinc-900 rounded-full mt-2 ml-auto overflow-hidden">
                       <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntelligenceAlpha;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/landing/IntelligenceAlpha.tsx
================================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Activity, BrainCircuit, Zap, BarChart3, Database, Shield, Globe, Cpu, ArrowUpRight } from 'lucide-react';

const IntelligenceAlpha: React.FC = () => {
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [predictionCycle, setPredictionCycle] = useState(0);
  const [confidence, setConfidence] = useState(98.4);
  const [marketBias, setMarketBias] = useState('BULLISH');

  // High-density grid simulation
  const grid = useMemo(() => Array.from({ length: 64 }, (_, i) => ({
    id: i,
    intensity: Math.random() * 100,
    signal: (Math.random() * 10).toFixed(2),
    coord: `NODE_${Math.floor(i/8)}_${i%8}`
  })), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPredictionCycle(prev => (prev + 1) % 100);
      setConfidence(prev => Math.max(95, Math.min(99.9, prev + (Math.random() - 0.5))));
      if (Math.random() > 0.95) setMarketBias(b => b === 'BULLISH' ? 'STABLE' : 'BULLISH');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-60 border-b border-zinc-900 bg-[#050505] relative overflow-hidden">
      {/* Decorative Neural Web Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#3b82f6" />
              <path d="M0 0 L100 100 M100 0 L0 100" stroke="#3b82f6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="order-2 lg:order-1 relative group">
             <div className="absolute -inset-10 bg-emerald-500/5 blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
             
             <div className="bg-black border border-zinc-900 rounded-[5rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-[1.8rem] border border-emerald-500/20 shadow-2xl">
                         <BrainCircuit size={32} />
                      </div>
                      <div>
                         <h4 className="text-white font-black uppercase tracking-[0.3em] italic text-sm">Neural Synthesis Grid</h4>
                         <p className="text-[9px] text-zinc-600 font-black uppercase mt-1">Matrix: 8x8 • Entropy: 0.0042</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Cycle #{predictionCycle}</span>
                      </div>
                      <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Parity Synchronized</p>
                   </div>
                </div>

                {/* Dense Interaction Grid */}
                <div className="grid grid-cols-8 gap-4 h-96">
                   {grid.map((cell) => (
                     <div 
                        key={cell.id} 
                        onMouseEnter={() => setActiveCell(cell.id)}
                        onMouseLeave={() => setActiveCell(null)}
                        className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl relative overflow-hidden group cursor-crosshair transition-all hover:scale-125 hover:z-30 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10"
                     >
                        <div 
                           className="absolute inset-0 bg-emerald-500 transition-opacity duration-1000" 
                           style={{ opacity: cell.intensity / 500 }}
                        ></div>
                        {activeCell === cell.id && (
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 animate-in zoom-in-50 duration-300">
                              <span className="text-[8px] font-black text-emerald-500 mono leading-none mb-0.5">{cell.signal}</span>
                              <span className="text-[6px] font-black text-zinc-600 mono leading-none">{cell.coord}</span>
                           </div>
                        )}
                        <div className="absolute top-1 left-1 w-0.5 h-0.5 rounded-full bg-white/5"></div>
                     </div>
                   ))}
                </div>

                <div className="mt-12 grid grid-cols-2 gap-8">
                   <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[3rem] space-y-4 group/box hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Activity size={18} className="text-emerald-500" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Sentiment Bias</span>
                         </div>
                         <span className="text-xs font-black text-emerald-500 mono">{marketBias}</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" style={{ width: '74%' }}></div>
                      </div>
                   </div>
                   <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[3rem] space-y-4 group/box hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <ArrowUpRight size={18} className="text-emerald-500" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Alpha Prediction</span>
                         </div>
                         <span className="text-xs font-black text-emerald-500 mono">+14.2%</span>
                      </div>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase leading-none">Expected Drift (24h)</p>
                   </div>
                </div>

                <div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]">
                   <p className="text-xs text-zinc-500 font-medium leading-relaxed italic text-center">
                     "LQI Oracle detects high-confidence institutional accumulation patterns on Layer 2 protocols. Executing directional alpha signals."
                   </p>
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2 space-y-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-in slide-in-from-right-4 duration-700">
                <Cpu size={16} className="text-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">Neural_Logic_Tier_1</span>
              </div>
              <h2 className="text-[6rem] lg:text-[10rem] font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-4">Neural <br /> <span className="text-emerald-500 not-italic">Alpha</span></h2>
              <p className="text-zinc-400 text-3xl font-bold italic leading-relaxed">
                "Our <span className="text-white">Lumina Oracle</span> processes petabytes of financial metadata to generate actionable insights. By leveraging subspace <span className="text-emerald-500">entanglement</span>, we predict market shifts before they reach consensus."
              </p>
            </div>

            <div className="space-y-8">
              {[
                { title: 'Alpha Signal', desc: 'Real-time directional drift detection', state: 'ACTIVE', icon: Zap, color: 'emerald' },
                { title: 'Confidence', desc: 'Predictive mathematical precision', state: `${confidence.toFixed(1)}%`, icon: BarChart3, color: 'blue' },
                { title: 'Protocol Mask', desc: 'Deterministic consensus trace', state: 'VERIFIED', icon: Database, color: 'purple' },
                { title: 'Global Parity', desc: 'Node-to-Node verification', state: '100%', icon: Globe, color: 'amber' },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between p-10 bg-zinc-950 border border-zinc-900 rounded-[3.5rem] group hover:border-emerald-500/20 transition-all hover:translate-x-4 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                    <node.icon size={120} />
                  </div>
                  <div className="flex items-center gap-10">
                    <div className={`p-6 bg-zinc-900 rounded-3xl text-zinc-700 group-hover:text-${node.color}-500 transition-colors shadow-2xl border border-white/5`}>
                      <node.icon size={32} />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-lg uppercase tracking-widest italic leading-none mb-2">{node.title}</h4>
                      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">{node.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-emerald-500 font-black text-xl mono tracking-tighter italic">{node.state}</span>
                    <div className="h-1 w-12 bg-zinc-900 rounded-full mt-2 ml-auto overflow-hidden">
                       <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntelligenceAlpha;