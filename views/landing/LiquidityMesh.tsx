// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/landing/LiquidityMesh.tsx
================================================================================

import React from 'react';
import { Waves, Zap, Globe, ArrowDownLeft, Activity, Network } from 'lucide-react';

const LiquidityMesh: React.FC = () => {
  return (
    <section className="py-40 border-b border-zinc-900 bg-black relative">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Velocity_Protocol</span>
              </div>
              <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
                Liquidity <br /> <span className="text-blue-600 not-italic">Mesh_Net</span>
              </h2>
            </div>
            <p className="text-zinc-400 text-2xl leading-relaxed font-bold italic">
              "Sub-millisecond <span className="text-white">settlement</span> across every node in the fleet. We optimize for high-volume disbursements where speed is the primary <span className="text-blue-500">security</span> factor."
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              {[
                { label: 'Mesh Load', val: 'OPTIMAL', sub: 'Sub-space verified', icon: Network },
                { label: 'Settlement', val: 'REAL-TIME', sub: 'M2M Native', icon: Zap },
                { label: 'RTP Sync', val: 'ACTIVE', sub: 'Lumina Protocol', icon: Activity },
                { label: 'Node Range', val: 'GLOBAL', sub: '24 Regions', icon: Globe },
              ].map((stat, i) => (
                <div key={i} className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <stat.icon size={12} className="text-blue-500" />
                    {stat.label}
                  </p>
                  <div className="flex items-center gap-3">
                    <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">{stat.val}</h4>
                    {stat.val === 'OPTIMAL' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>}
                  </div>
                  <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 h-[600px] shadow-2xl relative z-10 flex flex-col justify-end overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
               
               <div className="absolute inset-x-0 bottom-0 h-[70%] flex items-end gap-1.5 px-10 opacity-30 pb-20">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div 
                       key={i} 
                       className="flex-1 bg-blue-600 hover:bg-white transition-all cursor-pointer rounded-t-full" 
                       style={{ 
                          height: `${20 + Math.random() * 80}%`,
                          animation: `float-bar 3s ease-in-out infinite`,
                          animationDelay: `${i * 0.05}s`
                       }}
                    ></div>
                  ))}
               </div>

               <div className="relative z-10 space-y-8 bg-zinc-950/80 backdrop-blur-xl p-10 rounded-[3rem] border border-zinc-900 shadow-2xl animate-in slide-in-from-bottom-10 duration-1000">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                          <Waves size={24} />
                       </div>
                       <div>
                          <h5 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">Displacement Wave</h5>
                          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Registry Signal: STABLE</p>
                       </div>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl text-blue-400">
                       <ArrowDownLeft size={20} />
                    </div>
                  </div>
                  <div className="h-px w-full bg-zinc-900"></div>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed italic">"Global node range coverage verified across all 24 sub-space clusters. Mesh load rebalancing currently executing."</p>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Velocity Sync: 100%</span>
                     </div>
                     <span className="text-[10px] font-black text-white mono uppercase tracking-widest">FDX_NATIVE</span>
                  </div>
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full"></div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float-bar {
          0%, 100% { transform: scaleY(1); opacity: 0.2; }
          50% { transform: scaleY(1.3); opacity: 0.5; }
        }
      `}</style>
    </section>
  );
};

export default LiquidityMesh;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/landing/LiquidityMesh.tsx
================================================================================

import React from 'react';
import { Waves, Zap, Globe, ArrowDownLeft, Activity, Network } from 'lucide-react';

const LiquidityMesh: React.FC = () => {
  return (
    <section className="py-40 border-b border-zinc-900 bg-black relative">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Velocity_Protocol</span>
              </div>
              <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
                Liquidity <br /> <span className="text-blue-600 not-italic">Mesh_Net</span>
              </h2>
            </div>
            <p className="text-zinc-400 text-2xl leading-relaxed font-bold italic">
              "Sub-millisecond <span className="text-white">settlement</span> across every node in the fleet. We optimize for high-volume disbursements where speed is the primary <span className="text-blue-500">security</span> factor."
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              {[
                { label: 'Mesh Load', val: 'OPTIMAL', sub: 'Sub-space verified', icon: Network },
                { label: 'Settlement', val: 'REAL-TIME', sub: 'M2M Native', icon: Zap },
                { label: 'RTP Sync', val: 'ACTIVE', sub: 'Lumina Protocol', icon: Activity },
                { label: 'Node Range', val: 'GLOBAL', sub: '24 Regions', icon: Globe },
              ].map((stat, i) => (
                <div key={i} className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <stat.icon size={12} className="text-blue-500" />
                    {stat.label}
                  </p>
                  <div className="flex items-center gap-3">
                    <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">{stat.val}</h4>
                    {stat.val === 'OPTIMAL' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>}
                  </div>
                  <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 h-[600px] shadow-2xl relative z-10 flex flex-col justify-end overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
               
               <div className="absolute inset-x-0 bottom-0 h-[70%] flex items-end gap-1.5 px-10 opacity-30 pb-20">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div 
                       key={i} 
                       className="flex-1 bg-blue-600 hover:bg-white transition-all cursor-pointer rounded-t-full" 
                       style={{ 
                          height: `${20 + Math.random() * 80}%`,
                          animation: `float-bar 3s ease-in-out infinite`,
                          animationDelay: `${i * 0.05}s`
                       }}
                    ></div>
                  ))}
               </div>

               <div className="relative z-10 space-y-8 bg-zinc-950/80 backdrop-blur-xl p-10 rounded-[3rem] border border-zinc-900 shadow-2xl animate-in slide-in-from-bottom-10 duration-1000">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                          <Waves size={24} />
                       </div>
                       <div>
                          <h5 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">Displacement Wave</h5>
                          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Registry Signal: STABLE</p>
                       </div>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl text-blue-400">
                       <ArrowDownLeft size={20} />
                    </div>
                  </div>
                  <div className="h-px w-full bg-zinc-900"></div>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed italic">"Global node range coverage verified across all 24 sub-space clusters. Mesh load rebalancing currently executing."</p>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Velocity Sync: 100%</span>
                     </div>
                     <span className="text-[10px] font-black text-white mono uppercase tracking-widest">FDX_NATIVE</span>
                  </div>
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full"></div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float-bar {
          0%, 100% { transform: scaleY(1); opacity: 0.2; }
          50% { transform: scaleY(1.3); opacity: 0.5; }
        }
      `}</style>
    </section>
  );
};

export default LiquidityMesh;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/landing/LiquidityMesh.tsx
================================================================================

import React from 'react';
import { Waves, Zap, Globe, ArrowDownLeft, Activity, Network } from 'lucide-react';

const LiquidityMesh: React.FC = () => {
  return (
    <section className="py-40 border-b border-zinc-900 bg-black relative">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Velocity_Protocol</span>
              </div>
              <h2 className="text-7xl lg:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">
                Liquidity <br /> <span className="text-blue-600 not-italic">Mesh_Net</span>
              </h2>
            </div>
            <p className="text-zinc-400 text-2xl leading-relaxed font-bold italic">
              "Sub-millisecond <span className="text-white">settlement</span> across every node in the fleet. We optimize for high-volume disbursements where speed is the primary <span className="text-blue-500">security</span> factor."
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              {[
                { label: 'Mesh Load', val: 'OPTIMAL', sub: 'Sub-space verified', icon: Network },
                { label: 'Settlement', val: 'REAL-TIME', sub: 'M2M Native', icon: Zap },
                { label: 'RTP Sync', val: 'ACTIVE', sub: 'Lumina Protocol', icon: Activity },
                { label: 'Node Range', val: 'GLOBAL', sub: '24 Regions', icon: Globe },
              ].map((stat, i) => (
                <div key={i} className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <stat.icon size={12} className="text-blue-500" />
                    {stat.label}
                  </p>
                  <div className="flex items-center gap-3">
                    <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">{stat.val}</h4>
                    {stat.val === 'OPTIMAL' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>}
                  </div>
                  <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="bg-zinc-950 border border-zinc-900 rounded-[5rem] p-16 h-[600px] shadow-2xl relative z-10 flex flex-col justify-end overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
               
               <div className="absolute inset-x-0 bottom-0 h-[70%] flex items-end gap-1.5 px-10 opacity-30 pb-20">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div 
                       key={i} 
                       className="flex-1 bg-blue-600 hover:bg-white transition-all cursor-pointer rounded-t-full" 
                       style={{ 
                          height: `${20 + Math.random() * 80}%`,
                          animation: `float-bar 3s ease-in-out infinite`,
                          animationDelay: `${i * 0.05}s`
                       }}
                    ></div>
                  ))}
               </div>

               <div className="relative z-10 space-y-8 bg-zinc-950/80 backdrop-blur-xl p-10 rounded-[3rem] border border-zinc-900 shadow-2xl animate-in slide-in-from-bottom-10 duration-1000">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                          <Waves size={24} />
                       </div>
                       <div>
                          <h5 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">Displacement Wave</h5>
                          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Registry Signal: STABLE</p>
                       </div>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl text-blue-400">
                       <ArrowDownLeft size={20} />
                    </div>
                  </div>
                  <div className="h-px w-full bg-zinc-900"></div>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed italic">"Global node range coverage verified across all 24 sub-space clusters. Mesh load rebalancing currently executing."</p>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Velocity Sync: 100%</span>
                     </div>
                     <span className="text-[10px] font-black text-white mono uppercase tracking-widest">FDX_NATIVE</span>
                  </div>
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full"></div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float-bar {
          0%, 100% { transform: scaleY(1); opacity: 0.2; }
          50% { transform: scaleY(1.3); opacity: 0.5; }
        }
      `}</style>
    </section>
  );
};

export default LiquidityMesh;