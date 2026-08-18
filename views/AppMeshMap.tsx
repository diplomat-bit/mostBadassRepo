// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/AppMeshMap.tsx
================================================================================


import React, { useMemo, useState, useEffect } from 'react';
import { Network, Globe, Activity, Zap, ShieldCheck, Database, Search, Filter, Maximize2, Loader2 } from 'lucide-react';

const AppMeshMap: React.FC = () => {
  const [hoverNode, setHoverNode] = useState<number | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const int = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(int);
  }, []);

  // Simulate 999 nodes as visual points
  const points = useMemo(() => {
    return Array.from({ length: 999 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      intensity: Math.random(),
      active: Math.random() > 0.05
    }));
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Mesh <span className="text-blue-500 not-italic">Map</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Visualizing the 999 Sovereign Application Cluster</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cluster Size: 999 Nodes</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden h-[800px] flex flex-col">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_transparent_70%)] opacity-30"></div>
         
         <div className="flex justify-between items-start relative z-10 mb-12">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl">
                  <Globe size={28} className="animate-spin [animation-duration:20s]" />
               </div>
               <div>
                  <h3 className="text-white font-black uppercase tracking-widest italic">Global Node Topology</h3>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Inter-node latency: 0.0004ns (avg)</p>
               </div>
            </div>
            <div className="flex gap-4">
               <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><Search size={20} /></button>
               <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><Filter size={20} /></button>
               <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><Maximize2 size={20} /></button>
            </div>
         </div>

         <div className="flex-1 relative bg-black/40 border border-zinc-900 rounded-[3rem] overflow-hidden cursor-crosshair group/mesh">
            <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d">
               {/* Background grid */}
               <defs>
                  <pattern id="grid-3d" width="10" height="10" patternUnits="userSpaceOnUse">
                     <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ffffff08" strokeWidth="0.1"/>
                  </pattern>
               </defs>
               <rect width="100" height="100" fill="url(#grid-3d)" />

               {/* Connections simulation (sparse) */}
               {points.slice(0, 50).map((p, i) => {
                 const target = points[Math.floor(Math.random() * points.length)];
                 return (
                   <line 
                     key={`line-${i}`}
                     x1={p.x} y1={p.y} x2={target.x} y2={target.y}
                     stroke="#3b82f6" strokeWidth="0.05" opacity={p.intensity * 0.2}
                     className={pulse ? 'animate-pulse' : ''}
                   />
                 );
               })}

               {/* The 999 Nodes */}
               {points.map((p) => (
                 <circle 
                   key={p.id}
                   cx={p.x} cy={p.y}
                   r={hoverNode === p.id ? 1.5 : 0.25}
                   fill={p.active ? (hoverNode === p.id ? '#3b82f6' : '#10b981') : '#ef4444'}
                   opacity={p.active ? (0.3 + p.intensity * 0.7) : 0.1}
                   onMouseEnter={() => setHoverNode(p.id)}
                   onMouseLeave={() => setHoverNode(null)}
                   className="transition-all duration-300"
                 >
                   {hoverNode === p.id && <animate attributeName="r" from="0.5" to="2" dur="1s" repeatCount="indefinite" />}
                 </circle>
               ))}
            </svg>

            {hoverNode !== null && (
              <div className="absolute top-10 right-10 p-8 bg-zinc-950/90 backdrop-blur-3xl border border-blue-500/30 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 w-64 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center">
                       <Zap size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Node LQI-{hoverNode}</p>
                       <p className="text-[8px] text-emerald-500 font-bold uppercase">Status: ACTIVE</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600">
                       <span>Region</span>
                       <span className="text-zinc-400">EU-CENTRAL-1</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600">
                       <span>Parity</span>
                       <span className="text-white mono">100.00%</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600">
                       <span>Hardware</span>
                       <span className="text-zinc-400">HSM-v4</span>
                    </div>
                 </div>
                 <div className="h-px w-full bg-zinc-900"></div>
                 <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-blue-500 transition-all">Direct Handshake</button>
              </div>
            )}

            <div className="absolute bottom-10 left-10 flex gap-6">
               <LegendItem color="bg-emerald-500" label="Sovereign Active" />
               <LegendItem color="bg-blue-500" label="Syncing Parity" />
               <LegendItem color="bg-rose-500" label="Node Isolated" />
            </div>
         </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/5">
     <div className={`w-1.5 h-1.5 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></div>
     <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</span>
  </div>
);

export default AppMeshMap;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/AppMeshMap.tsx
================================================================================


import React, { useMemo, useState, useEffect } from 'react';
import { Network, Globe, Activity, Zap, ShieldCheck, Database, Search, Filter, Maximize2, Loader2 } from 'lucide-react';

const AppMeshMap: React.FC = () => {
  const [hoverNode, setHoverNode] = useState<number | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const int = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(int);
  }, []);

  // Simulate 999 nodes as visual points
  const points = useMemo(() => {
    return Array.from({ length: 999 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      intensity: Math.random(),
      active: Math.random() > 0.05
    }));
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Mesh <span className="text-blue-500 not-italic">Map</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Visualizing the 999 Sovereign Application Cluster</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cluster Size: 999 Nodes</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden h-[800px] flex flex-col">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_transparent_70%)] opacity-30"></div>
         
         <div className="flex justify-between items-start relative z-10 mb-12">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl">
                  <Globe size={28} className="animate-spin [animation-duration:20s]" />
               </div>
               <div>
                  <h3 className="text-white font-black uppercase tracking-widest italic">Global Node Topology</h3>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Inter-node latency: 0.0004ns (avg)</p>
               </div>
            </div>
            <div className="flex gap-4">
               <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><Search size={20} /></button>
               <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><Filter size={20} /></button>
               <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><Maximize2 size={20} /></button>
            </div>
         </div>

         <div className="flex-1 relative bg-black/40 border border-zinc-900 rounded-[3rem] overflow-hidden cursor-crosshair group/mesh">
            <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d">
               {/* Background grid */}
               <defs>
                  <pattern id="grid-3d" width="10" height="10" patternUnits="userSpaceOnUse">
                     <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ffffff08" strokeWidth="0.1"/>
                  </pattern>
               </defs>
               <rect width="100" height="100" fill="url(#grid-3d)" />

               {/* Connections simulation (sparse) */}
               {points.slice(0, 50).map((p, i) => {
                 const target = points[Math.floor(Math.random() * points.length)];
                 return (
                   <line 
                     key={`line-${i}`}
                     x1={p.x} y1={p.y} x2={target.x} y2={target.y}
                     stroke="#3b82f6" strokeWidth="0.05" opacity={p.intensity * 0.2}
                     className={pulse ? 'animate-pulse' : ''}
                   />
                 );
               })}

               {/* The 999 Nodes */}
               {points.map((p) => (
                 <circle 
                   key={p.id}
                   cx={p.x} cy={p.y}
                   r={hoverNode === p.id ? 1.5 : 0.25}
                   fill={p.active ? (hoverNode === p.id ? '#3b82f6' : '#10b981') : '#ef4444'}
                   opacity={p.active ? (0.3 + p.intensity * 0.7) : 0.1}
                   onMouseEnter={() => setHoverNode(p.id)}
                   onMouseLeave={() => setHoverNode(null)}
                   className="transition-all duration-300"
                 >
                   {hoverNode === p.id && <animate attributeName="r" from="0.5" to="2" dur="1s" repeatCount="indefinite" />}
                 </circle>
               ))}
            </svg>

            {hoverNode !== null && (
              <div className="absolute top-10 right-10 p-8 bg-zinc-950/90 backdrop-blur-3xl border border-blue-500/30 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 w-64 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center">
                       <Zap size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Node LQI-{hoverNode}</p>
                       <p className="text-[8px] text-emerald-500 font-bold uppercase">Status: ACTIVE</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600">
                       <span>Region</span>
                       <span className="text-zinc-400">EU-CENTRAL-1</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600">
                       <span>Parity</span>
                       <span className="text-white mono">100.00%</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600">
                       <span>Hardware</span>
                       <span className="text-zinc-400">HSM-v4</span>
                    </div>
                 </div>
                 <div className="h-px w-full bg-zinc-900"></div>
                 <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-blue-500 transition-all">Direct Handshake</button>
              </div>
            )}

            <div className="absolute bottom-10 left-10 flex gap-6">
               <LegendItem color="bg-emerald-500" label="Sovereign Active" />
               <LegendItem color="bg-blue-500" label="Syncing Parity" />
               <LegendItem color="bg-rose-500" label="Node Isolated" />
            </div>
         </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/5">
     <div className={`w-1.5 h-1.5 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></div>
     <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</span>
  </div>
);

export default AppMeshMap;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/AppMeshMap.tsx
================================================================================


import React, { useMemo, useState, useEffect } from 'react';
import { Network, Globe, Activity, Zap, ShieldCheck, Database, Search, Filter, Maximize2, Loader2 } from 'lucide-react';

const AppMeshMap: React.FC = () => {
  const [hoverNode, setHoverNode] = useState<number | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const int = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(int);
  }, []);

  // Simulate 999 nodes as visual points
  const points = useMemo(() => {
    return Array.from({ length: 999 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      intensity: Math.random(),
      active: Math.random() > 0.05
    }));
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Mesh <span className="text-blue-500 not-italic">Map</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Visualizing the 999 Sovereign Application Cluster</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cluster Size: 999 Nodes</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden h-[800px] flex flex-col">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_transparent_70%)] opacity-30"></div>
         
         <div className="flex justify-between items-start relative z-10 mb-12">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl">
                  <Globe size={28} className="animate-spin [animation-duration:20s]" />
               </div>
               <div>
                  <h3 className="text-white font-black uppercase tracking-widest italic">Global Node Topology</h3>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Inter-node latency: 0.0004ns (avg)</p>
               </div>
            </div>
            <div className="flex gap-4">
               <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><Search size={20} /></button>
               <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><Filter size={20} /></button>
               <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"><Maximize2 size={20} /></button>
            </div>
         </div>

         <div className="flex-1 relative bg-black/40 border border-zinc-900 rounded-[3rem] overflow-hidden cursor-crosshair group/mesh">
            <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d">
               {/* Background grid */}
               <defs>
                  <pattern id="grid-3d" width="10" height="10" patternUnits="userSpaceOnUse">
                     <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ffffff08" strokeWidth="0.1"/>
                  </pattern>
               </defs>
               <rect width="100" height="100" fill="url(#grid-3d)" />

               {/* Connections simulation (sparse) */}
               {points.slice(0, 50).map((p, i) => {
                 const target = points[Math.floor(Math.random() * points.length)];
                 return (
                   <line 
                     key={`line-${i}`}
                     x1={p.x} y1={p.y} x2={target.x} y2={target.y}
                     stroke="#3b82f6" strokeWidth="0.05" opacity={p.intensity * 0.2}
                     className={pulse ? 'animate-pulse' : ''}
                   />
                 );
               })}

               {/* The 999 Nodes */}
               {points.map((p) => (
                 <circle 
                   key={p.id}
                   cx={p.x} cy={p.y}
                   r={hoverNode === p.id ? 1.5 : 0.25}
                   fill={p.active ? (hoverNode === p.id ? '#3b82f6' : '#10b981') : '#ef4444'}
                   opacity={p.active ? (0.3 + p.intensity * 0.7) : 0.1}
                   onMouseEnter={() => setHoverNode(p.id)}
                   onMouseLeave={() => setHoverNode(null)}
                   className="transition-all duration-300"
                 >
                   {hoverNode === p.id && <animate attributeName="r" from="0.5" to="2" dur="1s" repeatCount="indefinite" />}
                 </circle>
               ))}
            </svg>

            {hoverNode !== null && (
              <div className="absolute top-10 right-10 p-8 bg-zinc-950/90 backdrop-blur-3xl border border-blue-500/30 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 w-64 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center">
                       <Zap size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Node LQI-{hoverNode}</p>
                       <p className="text-[8px] text-emerald-500 font-bold uppercase">Status: ACTIVE</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600">
                       <span>Region</span>
                       <span className="text-zinc-400">EU-CENTRAL-1</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600">
                       <span>Parity</span>
                       <span className="text-white mono">100.00%</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600">
                       <span>Hardware</span>
                       <span className="text-zinc-400">HSM-v4</span>
                    </div>
                 </div>
                 <div className="h-px w-full bg-zinc-900"></div>
                 <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-blue-500 transition-all">Direct Handshake</button>
              </div>
            )}

            <div className="absolute bottom-10 left-10 flex gap-6">
               <LegendItem color="bg-emerald-500" label="Sovereign Active" />
               <LegendItem color="bg-blue-500" label="Syncing Parity" />
               <LegendItem color="bg-rose-500" label="Node Isolated" />
            </div>
         </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/5">
     <div className={`w-1.5 h-1.5 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></div>
     <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</span>
  </div>
);

export default AppMeshMap;
