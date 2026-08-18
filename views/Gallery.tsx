// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Gallery.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Search, Filter, Layout, Cpu, Globe, Zap, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { TECHNICAL_REGISTRY } from './technical/technicalRegistry';
import { generateProtocolVisual } from '../services/geminiService';

// fix: Use React.FC to properly handle standard React props like 'key' in list mapping
const LazyArtifact: React.FC<{ item: any }> = ({ item }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const synthesize = async () => {
      setLoading(true);
      // Real-time synthesis using the API Key
      const result = await generateProtocolVisual(item.title, item.description);
      setImage(result);
      setLoading(false);
    };
    synthesize();
  }, [item]);

  return (
    <div 
      onClick={() => navigate(`/protocol/${item.key}`)}
      className="group bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden relative cursor-pointer hover:border-blue-500/40 transition-all shadow-2xl hover:-translate-y-2 duration-500"
    >
       <div className="aspect-[4/5] relative overflow-hidden bg-black">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <Loader2 size={32} className="animate-spin text-zinc-800" />
              <p className="text-[8px] font-black text-zinc-800 uppercase tracking-widest animate-pulse">Forging Schematic...</p>
            </div>
          ) : image ? (
            <img 
              src={image} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
              alt={item.title} 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-900">
               <ImageIcon size={48} />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute top-6 right-6 p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 opacity-0 group-hover:opacity-10 transition-opacity">
             <Sparkles size={16} className="text-blue-500" />
          </div>
          
          <div className="absolute bottom-8 left-8 right-8 space-y-3">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{item.id}</p>
             </div>
             <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{item.title}</h3>
             <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
               {item.description}
             </p>
          </div>
       </div>
       <div className="p-6 bg-zinc-900/30 flex justify-between items-center border-t border-zinc-900">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.category}</span>
          <span className="px-2 py-0.5 bg-black rounded text-[8px] font-black text-zinc-400 border border-zinc-800">UNLOCKED</span>
       </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const allArtifacts = useMemo(() => {
    return Object.entries(TECHNICAL_REGISTRY).map(([key, value]) => ({
      key,
      ...value
    }));
  }, []);

  const filtered = useMemo(() => {
    return allArtifacts.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allArtifacts, searchTerm]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-zinc-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Artifact <span className="text-blue-500 not-italic">Archive</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.4em]">Neural Schematic Database • {allArtifacts.length} Uniquely Synthesized Nodes</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search registry..."
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-blue-500/50 rounded-2xl py-4 pl-14 pr-6 text-white text-xs font-bold outline-none transition-all"
            />
          </div>
          <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filtered.map((item) => (
          <LazyArtifact key={item.key} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="h-[400px] flex flex-col items-center justify-center text-center opacity-30 gap-6">
           <Layout size={80} />
           <p className="text-xl font-black uppercase tracking-[0.4em] text-zinc-600">No Nodes Found</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Gallery.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Search, Filter, Layout, Cpu, Globe, Zap, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { TECHNICAL_REGISTRY } from './technical/technicalRegistry';
import { generateProtocolVisual } from '../services/geminiService';

// fix: Use React.FC to properly handle standard React props like 'key' in list mapping
const LazyArtifact: React.FC<{ item: any }> = ({ item }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const synthesize = async () => {
      setLoading(true);
      // Real-time synthesis using the API Key
      const result = await generateProtocolVisual(item.title, item.description);
      setImage(result);
      setLoading(false);
    };
    synthesize();
  }, [item]);

  return (
    <div 
      onClick={() => navigate(`/protocol/${item.key}`)}
      className="group bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden relative cursor-pointer hover:border-blue-500/40 transition-all shadow-2xl hover:-translate-y-2 duration-500"
    >
       <div className="aspect-[4/5] relative overflow-hidden bg-black">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <Loader2 size={32} className="animate-spin text-zinc-800" />
              <p className="text-[8px] font-black text-zinc-800 uppercase tracking-widest animate-pulse">Forging Schematic...</p>
            </div>
          ) : image ? (
            <img 
              src={image} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
              alt={item.title} 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-900">
               <ImageIcon size={48} />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute top-6 right-6 p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 opacity-0 group-hover:opacity-10 transition-opacity">
             <Sparkles size={16} className="text-blue-500" />
          </div>
          
          <div className="absolute bottom-8 left-8 right-8 space-y-3">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{item.id}</p>
             </div>
             <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{item.title}</h3>
             <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
               {item.description}
             </p>
          </div>
       </div>
       <div className="p-6 bg-zinc-900/30 flex justify-between items-center border-t border-zinc-900">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.category}</span>
          <span className="px-2 py-0.5 bg-black rounded text-[8px] font-black text-zinc-400 border border-zinc-800">UNLOCKED</span>
       </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const allArtifacts = useMemo(() => {
    return Object.entries(TECHNICAL_REGISTRY).map(([key, value]) => ({
      key,
      ...value
    }));
  }, []);

  const filtered = useMemo(() => {
    return allArtifacts.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allArtifacts, searchTerm]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-zinc-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Artifact <span className="text-blue-500 not-italic">Archive</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.4em]">Neural Schematic Database • {allArtifacts.length} Uniquely Synthesized Nodes</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search registry..."
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-blue-500/50 rounded-2xl py-4 pl-14 pr-6 text-white text-xs font-bold outline-none transition-all"
            />
          </div>
          <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filtered.map((item) => (
          <LazyArtifact key={item.key} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="h-[400px] flex flex-col items-center justify-center text-center opacity-30 gap-6">
           <Layout size={80} />
           <p className="text-xl font-black uppercase tracking-[0.4em] text-zinc-600">No Nodes Found</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Gallery.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Search, Filter, Layout, Cpu, Globe, Zap, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { TECHNICAL_REGISTRY } from './technical/technicalRegistry';
import { generateProtocolVisual } from '../services/geminiService';

// fix: Use React.FC to properly handle standard React props like 'key' in list mapping
const LazyArtifact: React.FC<{ item: any }> = ({ item }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const synthesize = async () => {
      setLoading(true);
      // Real-time synthesis using the API Key
      const result = await generateProtocolVisual(item.title, item.description);
      setImage(result);
      setLoading(false);
    };
    synthesize();
  }, [item]);

  return (
    <div 
      onClick={() => navigate(`/protocol/${item.key}`)}
      className="group bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden relative cursor-pointer hover:border-blue-500/40 transition-all shadow-2xl hover:-translate-y-2 duration-500"
    >
       <div className="aspect-[4/5] relative overflow-hidden bg-black">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <Loader2 size={32} className="animate-spin text-zinc-800" />
              <p className="text-[8px] font-black text-zinc-800 uppercase tracking-widest animate-pulse">Forging Schematic...</p>
            </div>
          ) : image ? (
            <img 
              src={image} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
              alt={item.title} 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-900">
               <ImageIcon size={48} />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute top-6 right-6 p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 opacity-0 group-hover:opacity-10 transition-opacity">
             <Sparkles size={16} className="text-blue-500" />
          </div>
          
          <div className="absolute bottom-8 left-8 right-8 space-y-3">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{item.id}</p>
             </div>
             <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{item.title}</h3>
             <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
               {item.description}
             </p>
          </div>
       </div>
       <div className="p-6 bg-zinc-900/30 flex justify-between items-center border-t border-zinc-900">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.category}</span>
          <span className="px-2 py-0.5 bg-black rounded text-[8px] font-black text-zinc-400 border border-zinc-800">UNLOCKED</span>
       </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const allArtifacts = useMemo(() => {
    return Object.entries(TECHNICAL_REGISTRY).map(([key, value]) => ({
      key,
      ...value
    }));
  }, []);

  const filtered = useMemo(() => {
    return allArtifacts.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allArtifacts, searchTerm]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-zinc-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Artifact <span className="text-blue-500 not-italic">Archive</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.4em]">Neural Schematic Database • {allArtifacts.length} Uniquely Synthesized Nodes</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search registry..."
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-blue-500/50 rounded-2xl py-4 pl-14 pr-6 text-white text-xs font-bold outline-none transition-all"
            />
          </div>
          <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filtered.map((item) => (
          <LazyArtifact key={item.key} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="h-[400px] flex flex-col items-center justify-center text-center opacity-30 gap-6">
           <Layout size={80} />
           <p className="text-xl font-black uppercase tracking-[0.4em] text-zinc-600">No Nodes Found</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
