// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/components/NeuralBackground.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateNeuralSetting, synthesizeSpeech } from '../services/geminiService';
import { Loader2, Sparkles, Activity } from 'lucide-react';

const NeuralBackground: React.FC = () => {
  const location = useLocation();
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const synthesize = async () => {
      setIsSynthesizing(true);
      setGlitch(true);
      
      const path = location.pathname.split('/').pop() || 'overview';
      // More evocative world prompts
      const worlds = [
        `orbital treasury station above a neon planet for ${path}`,
        `deep sea obsidian server vault with glowing currents for ${path}`,
        `crystalline quantum cathedral with data-rings for ${path}`,
        `subterranean volcanic fusion reactor core for ${path}`,
        `floating holographic data-monolith in a heavy storm for ${path}`
      ];
      const context = worlds[Math.floor(Math.random() * worlds.length)];
      
      const [img, _] = await Promise.all([
        generateNeuralSetting(context),
        synthesizeSpeech(`Arriving at ${path} terminal. World parity achieved.`, 'Kore')
      ]);

      if (img) setBgUrl(img);
      setIsSynthesizing(false);
      setTimeout(() => setGlitch(false), 500);
    };

    synthesize();
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-black/50 z-10 backdrop-blur-[1px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)] z-15"></div>
      
      {/* World Image Layer */}
      {bgUrl ? (
        <img 
          src={bgUrl} 
          className={`w-full h-full object-cover transition-all duration-[4000ms] ${isSynthesizing || glitch ? 'scale-125 blur-3xl opacity-20' : 'scale-100 blur-0 opacity-100'}`} 
          alt="Neural World" 
        />
      ) : (
        <div className="w-full h-full bg-[#020202]"></div>
      )}

      {/* HUD Elements */}
      {isSynthesizing && (
        <div className="absolute top-12 right-12 z-20 flex items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-right">
             <div className="flex items-center justify-end gap-3 mb-1">
                <Activity size={12} className="text-blue-500 animate-pulse" />
                <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em]">Genesis_Active</p>
             </div>
             <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest italic">Forging Neural Biome...</p>
          </div>
          <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
             <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        </div>
      )}

      {/* Glitch Overlay */}
      {glitch && (
        <div className="absolute inset-0 z-30 bg-blue-500/5 mix-blend-overlay animate-pulse"></div>
      )}

      {/* CRT Scanline and Noise */}
      <div className="absolute inset-0 z-15 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
    </div>
  );
};

export default NeuralBackground;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/components/NeuralBackground.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateNeuralSetting, synthesizeSpeech } from '../services/geminiService';
import { Loader2, Sparkles, Activity } from 'lucide-react';

const NeuralBackground: React.FC = () => {
  const location = useLocation();
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const synthesize = async () => {
      setIsSynthesizing(true);
      setGlitch(true);
      
      const path = location.pathname.split('/').pop() || 'overview';
      // More evocative world prompts
      const worlds = [
        `orbital treasury station above a neon planet for ${path}`,
        `deep sea obsidian server vault with glowing currents for ${path}`,
        `crystalline quantum cathedral with data-rings for ${path}`,
        `subterranean volcanic fusion reactor core for ${path}`,
        `floating holographic data-monolith in a heavy storm for ${path}`
      ];
      const context = worlds[Math.floor(Math.random() * worlds.length)];
      
      const [img, _] = await Promise.all([
        generateNeuralSetting(context),
        synthesizeSpeech(`Arriving at ${path} terminal. World parity achieved.`, 'Kore')
      ]);

      if (img) setBgUrl(img);
      setIsSynthesizing(false);
      setTimeout(() => setGlitch(false), 500);
    };

    synthesize();
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-black/50 z-10 backdrop-blur-[1px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)] z-15"></div>
      
      {/* World Image Layer */}
      {bgUrl ? (
        <img 
          src={bgUrl} 
          className={`w-full h-full object-cover transition-all duration-[4000ms] ${isSynthesizing || glitch ? 'scale-125 blur-3xl opacity-20' : 'scale-100 blur-0 opacity-100'}`} 
          alt="Neural World" 
        />
      ) : (
        <div className="w-full h-full bg-[#020202]"></div>
      )}

      {/* HUD Elements */}
      {isSynthesizing && (
        <div className="absolute top-12 right-12 z-20 flex items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-right">
             <div className="flex items-center justify-end gap-3 mb-1">
                <Activity size={12} className="text-blue-500 animate-pulse" />
                <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em]">Genesis_Active</p>
             </div>
             <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest italic">Forging Neural Biome...</p>
          </div>
          <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
             <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        </div>
      )}

      {/* Glitch Overlay */}
      {glitch && (
        <div className="absolute inset-0 z-30 bg-blue-500/5 mix-blend-overlay animate-pulse"></div>
      )}

      {/* CRT Scanline and Noise */}
      <div className="absolute inset-0 z-15 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
    </div>
  );
};

export default NeuralBackground;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/components/NeuralBackground.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateNeuralSetting, synthesizeSpeech } from '../services/geminiService';
import { Loader2, Sparkles, Activity } from 'lucide-react';

const NeuralBackground: React.FC = () => {
  const location = useLocation();
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const synthesize = async () => {
      setIsSynthesizing(true);
      setGlitch(true);
      
      const path = location.pathname.split('/').pop() || 'overview';
      // More evocative world prompts
      const worlds = [
        `orbital treasury station above a neon planet for ${path}`,
        `deep sea obsidian server vault with glowing currents for ${path}`,
        `crystalline quantum cathedral with data-rings for ${path}`,
        `subterranean volcanic fusion reactor core for ${path}`,
        `floating holographic data-monolith in a heavy storm for ${path}`
      ];
      const context = worlds[Math.floor(Math.random() * worlds.length)];
      
      const [img, _] = await Promise.all([
        generateNeuralSetting(context),
        synthesizeSpeech(`Arriving at ${path} terminal. World parity achieved.`, 'Kore')
      ]);

      if (img) setBgUrl(img);
      setIsSynthesizing(false);
      setTimeout(() => setGlitch(false), 500);
    };

    synthesize();
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-black/50 z-10 backdrop-blur-[1px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)] z-15"></div>
      
      {/* World Image Layer */}
      {bgUrl ? (
        <img 
          src={bgUrl} 
          className={`w-full h-full object-cover transition-all duration-[4000ms] ${isSynthesizing || glitch ? 'scale-125 blur-3xl opacity-20' : 'scale-100 blur-0 opacity-100'}`} 
          alt="Neural World" 
        />
      ) : (
        <div className="w-full h-full bg-[#020202]"></div>
      )}

      {/* HUD Elements */}
      {isSynthesizing && (
        <div className="absolute top-12 right-12 z-20 flex items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-right">
             <div className="flex items-center justify-end gap-3 mb-1">
                <Activity size={12} className="text-blue-500 animate-pulse" />
                <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em]">Genesis_Active</p>
             </div>
             <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest italic">Forging Neural Biome...</p>
          </div>
          <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
             <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        </div>
      )}

      {/* Glitch Overlay */}
      {glitch && (
        <div className="absolute inset-0 z-30 bg-blue-500/5 mix-blend-overlay animate-pulse"></div>
      )}

      {/* CRT Scanline and Noise */}
      <div className="absolute inset-0 z-15 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
    </div>
  );
};

export default NeuralBackground;
