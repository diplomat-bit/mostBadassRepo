// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/ExternalIframeCollection.tsx
================================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal } from 'lucide-react';

const AI_MODULES = [
  "https://admin08077-aibankinguniversity.static.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-ai-ban-king-demo.static.hf.space",
  "https://admin08077-1233.static.hf.space",
  "https://admin08077-inventions.static.hf.space",
  "https://admin08077-gemini-app-citibank-demo-business-inc-google.static.hf.space",
  "https://admin08077-aibankdemo2.static.hf.space",
  "https://admin08077-airenderer.static.hf.space",
  "https://admin08077-book.static.hf.space",
  "https://admin08077-merrychristmas.static.hf.space",
  "https://admin08077-apiai.static.hf.space",
  "https://admin08077-projectatlas.static.hf.space",
  "https://admin08077-jocall3.static.hf.space",
  "https://admin08077-demob.static.hf.space",
  "https://admin08077-static.static.hf.space",
  "https://admin08077-demoo.static.hf.space",
  "https://admin08077-webgenai.static.hf.space",
  "https://admin08077-aiab.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-app.static.hf.space",
  "https://admin08077-aib8nking.static.hf.space",
  "https://admin08077-bb.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-apps.static.hf.space",
  "https://admin08077-newwa.static.hf.space",
  "https://admin08077-jamesocallaghanprivatebank.hf.space",
  "https://admin08077-drip-faucet.static.hf.space",
  "https://admin08077-transactpro.hf.space",
  "https://admin08077-quantumbank.hf.space",
  "https://admin08077-test.hf.space"
];

// Helper to pull the nice title from those huge ugly URLs
const getModuleTitle = (url: string) => {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    // Strip the huggifnace generic suffixes
    hostname = hostname.replace('.static.hf.space', '').replace('.hf.space', '');
    // Strip your user prefix
    hostname = hostname.replace(/^admin\d+-/, '');
    
    // Convert 'citi-bank-demo' -> 'Citi Bank Demo'
    return hostname
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'AI Module';
  } catch (e) {
    return 'AI Module';
  }
};

const ExternalIframeCollection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % AI_MODULES.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + AI_MODULES.length) % AI_MODULES.length);

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden font-sans">
      
      {/* 🚀 LEFT NAVIGATION / SIDEBAR */}
      <div className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} transition-all duration-300 border-r border-gray-800 bg-gray-950 flex flex-col fixed md:relative z-20 h-full`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="font-mono font-bold text-gray-200 tracking-wider">SOVEREIGN_MODULES</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-white">
            <ArrowLeft size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {AI_MODULES.map((url, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-mono transition-all duration-200 flex items-center gap-3 ${
                activeIndex === index
                  ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300 border border-transparent'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${activeIndex === index ? 'bg-cyan-400 animate-pulse' : 'bg-gray-700'}`} />
              <span className="truncate">{getModuleTitle(url)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🌌 MAIN STAGE AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative">
        
        {/* TOP COMMAND BAR */}
        <div className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Terminal size={20} />
              </button>
            )}
            
            {/* ESCAPE ROUTE - Goes back to the Dashboard Hub */}
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <div className="p-1.5 rounded-md bg-gray-900 group-hover:bg-gray-800 border border-gray-800 group-hover:border-gray-700">
                <ArrowLeft size={14} />
              </div>
              <span className="text-xs font-mono tracking-widest uppercase">RETURN_TO_CORE_OS</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
               STREAM {activeIndex + 1} / {AI_MODULES.length}
             </div>
          </div>
        </div>

        {/* 🌠 IFRAME CONTAINER / PLAYER */}
        <div className="flex-1 p-2 md:p-6 flex flex-col items-center justify-center overflow-hidden relative">
           
           {/* BIG ARROW NAV BUTTONS - Left */}
           <button 
             onClick={handlePrev}
             className="absolute left-2 md:left-6 z-10 p-3 rounded-full bg-black/60 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/40 transition-all duration-300 group shadow-lg"
           >
             <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           </button>

           {/* BIG ARROW NAV BUTTONS - Right */}
           <button 
             onClick={handleNext}
             className="absolute right-2 md:right-6 z-10 p-3 rounded-full bg-black/60 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/40 transition-all duration-300 group shadow-lg"
           >
             <ArrowLeft size={24} className="rotate-180 group-hover:translate-x-1 transition-transform" />
           </button>

           {/* THE IFRAME VIEWPORT */}
           <div className="w-full h-full max-w-[1400px] bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)] relative group">
             
             {/* Fallback header for the embedded content frame */}
             <div className="h-10 border-b border-gray-800 bg-gray-950 flex items-center px-4 w-full">
               <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse mr-2" />
               <span className="text-xs font-mono font-bold text-gray-400">{getModuleTitle(AI_MODULES[activeIndex])}</span>
             </div>

             <iframe
               src={AI_MODULES[activeIndex]}
               key={AI_MODULES[activeIndex]} // Forces iframe rebuild on URL switch to kill residual ghosting
               className="w-full h-[calc(100%-2.5rem)] border-0"
               title="Sovereign AI Payload Frame"
               sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
             />
           </div>

        </div>
      </div>
    </div>
  );
};

export default ExternalIframeCollection;