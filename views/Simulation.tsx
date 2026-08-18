// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Simulation.tsx
================================================================================


import React, { useState } from 'react';
import { Play, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
// fix: removed .ts extension from imports to follow project pattern and resolved missing member error
import { runSimulationForecast } from '../services/geminiService';
import { SimulationResult } from '../types/index';

const ScenarioButton = ({ label, description, onClick }: any) => (
  <button 
    onClick={() => onClick(label)}
    className="text-left p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all group"
  >
    <h4 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">{label}</h4>
    <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
  </button>
);

const Simulation: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleRun = async (overridePrompt?: string) => {
    const finalPrompt = overridePrompt || prompt;
    if (!finalPrompt) return;
    
    setLoading(true);
    const data = await runSimulationForecast(finalPrompt);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-900/20 via-zinc-900 to-zinc-900 border border-zinc-800 rounded-3xl p-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Gemini Oracle Simulation</h2>
          </div>
          <p className="text-zinc-400 text-lg mb-8 max-w-2xl">
            Simulate complex market shifts, regulatory shocks, or internal expenditure reallocations using neural financial forecasting.
          </p>
          
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Simulate a 5% inflation spike over 12 months with a focus on cloud compute costs'"
                className="w-full bg-black border-2 border-zinc-800 focus:border-indigo-500/50 rounded-2xl p-6 text-white text-lg min-h-[160px] outline-none transition-all resize-none placeholder:text-zinc-700"
              ></textarea>
              <button 
                onClick={() => handleRun()}
                disabled={loading || !prompt}
                className="absolute bottom-4 right-4 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-900/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} fill="currentColor" />}
                <span>{loading ? 'Thinking...' : 'Run Simulation'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScenarioButton 
          label="Market Crash" 
          description="Simulate 2008-style housing collapse on commercial real estate portfolio." 
          onClick={handleRun}
        />
        <ScenarioButton 
          label="Hyperinflation" 
          description="Model assets against 15%+ annual CPI growth over a 3-year horizon." 
          onClick={handleRun}
        />
        <ScenarioButton 
          label="AI Expansion" 
          description="Forecast ROI on $2M compute spend increase vs reduced dev headcount." 
          onClick={handleRun}
        />
      </div>

      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-zinc-800">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Simulation Results</h3>
                <p className="text-zinc-500 text-sm mono">REF: {result.simulationId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Confidence Score</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-32 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${result.confidenceScore * 100}%` }}></div>
                </div>
                <span className="text-sm font-bold text-zinc-300">{Math.round(result.confidenceScore * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h4 className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-4">Neural Narrative</h4>
              <p className="text-zinc-200 leading-relaxed italic border-l-2 border-blue-500/30 pl-6 py-2">
                "{result.outcomeNarrative}"
              </p>
            </div>
            <div className="bg-black/40 rounded-2xl p-8 border border-zinc-800">
              <div className="space-y-6">
                <div>
                  <p className="text-zinc-500 text-xs mb-1">Projected Portfolio Value (12M)</p>
                  <p className="text-4xl font-bold text-white mono tracking-tighter">
                    ${result.projectedValue?.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Risk Exposure</p>
                    <div className="flex items-center space-x-2 text-rose-500">
                      <AlertCircle size={16} />
                      <span className="font-bold">Elevated</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Resilience Rating</p>
                    <div className="flex items-center space-x-2 text-blue-400">
                      <ChevronRight size={16} />
                      <span className="font-bold">AA-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Simulation.tsx
================================================================================


import React, { useState } from 'react';
import { Play, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
// fix: removed .ts extension from imports to follow project pattern and resolved missing member error
import { runSimulationForecast } from '../services/geminiService';
import { SimulationResult } from '../types/index';

const ScenarioButton = ({ label, description, onClick }: any) => (
  <button 
    onClick={() => onClick(label)}
    className="text-left p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all group"
  >
    <h4 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">{label}</h4>
    <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
  </button>
);

const Simulation: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleRun = async (overridePrompt?: string) => {
    const finalPrompt = overridePrompt || prompt;
    if (!finalPrompt) return;
    
    setLoading(true);
    const data = await runSimulationForecast(finalPrompt);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-900/20 via-zinc-900 to-zinc-900 border border-zinc-800 rounded-3xl p-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Gemini Oracle Simulation</h2>
          </div>
          <p className="text-zinc-400 text-lg mb-8 max-w-2xl">
            Simulate complex market shifts, regulatory shocks, or internal expenditure reallocations using neural financial forecasting.
          </p>
          
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Simulate a 5% inflation spike over 12 months with a focus on cloud compute costs'"
                className="w-full bg-black border-2 border-zinc-800 focus:border-indigo-500/50 rounded-2xl p-6 text-white text-lg min-h-[160px] outline-none transition-all resize-none placeholder:text-zinc-700"
              ></textarea>
              <button 
                onClick={() => handleRun()}
                disabled={loading || !prompt}
                className="absolute bottom-4 right-4 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-900/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} fill="currentColor" />}
                <span>{loading ? 'Thinking...' : 'Run Simulation'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScenarioButton 
          label="Market Crash" 
          description="Simulate 2008-style housing collapse on commercial real estate portfolio." 
          onClick={handleRun}
        />
        <ScenarioButton 
          label="Hyperinflation" 
          description="Model assets against 15%+ annual CPI growth over a 3-year horizon." 
          onClick={handleRun}
        />
        <ScenarioButton 
          label="AI Expansion" 
          description="Forecast ROI on $2M compute spend increase vs reduced dev headcount." 
          onClick={handleRun}
        />
      </div>

      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-zinc-800">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Simulation Results</h3>
                <p className="text-zinc-500 text-sm mono">REF: {result.simulationId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Confidence Score</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-32 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${result.confidenceScore * 100}%` }}></div>
                </div>
                <span className="text-sm font-bold text-zinc-300">{Math.round(result.confidenceScore * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h4 className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-4">Neural Narrative</h4>
              <p className="text-zinc-200 leading-relaxed italic border-l-2 border-blue-500/30 pl-6 py-2">
                "{result.outcomeNarrative}"
              </p>
            </div>
            <div className="bg-black/40 rounded-2xl p-8 border border-zinc-800">
              <div className="space-y-6">
                <div>
                  <p className="text-zinc-500 text-xs mb-1">Projected Portfolio Value (12M)</p>
                  <p className="text-4xl font-bold text-white mono tracking-tighter">
                    ${result.projectedValue?.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Risk Exposure</p>
                    <div className="flex items-center space-x-2 text-rose-500">
                      <AlertCircle size={16} />
                      <span className="font-bold">Elevated</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Resilience Rating</p>
                    <div className="flex items-center space-x-2 text-blue-400">
                      <ChevronRight size={16} />
                      <span className="font-bold">AA-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Simulation.tsx
================================================================================


import React, { useState } from 'react';
import { Play, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
// fix: removed .ts extension from imports to follow project pattern and resolved missing member error
import { runSimulationForecast } from '../services/geminiService';
import { SimulationResult } from '../types/index';

const ScenarioButton = ({ label, description, onClick }: any) => (
  <button 
    onClick={() => onClick(label)}
    className="text-left p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all group"
  >
    <h4 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">{label}</h4>
    <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
  </button>
);

const Simulation: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleRun = async (overridePrompt?: string) => {
    const finalPrompt = overridePrompt || prompt;
    if (!finalPrompt) return;
    
    setLoading(true);
    const data = await runSimulationForecast(finalPrompt);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-900/20 via-zinc-900 to-zinc-900 border border-zinc-800 rounded-3xl p-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Gemini Oracle Simulation</h2>
          </div>
          <p className="text-zinc-400 text-lg mb-8 max-w-2xl">
            Simulate complex market shifts, regulatory shocks, or internal expenditure reallocations using neural financial forecasting.
          </p>
          
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Simulate a 5% inflation spike over 12 months with a focus on cloud compute costs'"
                className="w-full bg-black border-2 border-zinc-800 focus:border-indigo-500/50 rounded-2xl p-6 text-white text-lg min-h-[160px] outline-none transition-all resize-none placeholder:text-zinc-700"
              ></textarea>
              <button 
                onClick={() => handleRun()}
                disabled={loading || !prompt}
                className="absolute bottom-4 right-4 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-900/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} fill="currentColor" />}
                <span>{loading ? 'Thinking...' : 'Run Simulation'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScenarioButton 
          label="Market Crash" 
          description="Simulate 2008-style housing collapse on commercial real estate portfolio." 
          onClick={handleRun}
        />
        <ScenarioButton 
          label="Hyperinflation" 
          description="Model assets against 15%+ annual CPI growth over a 3-year horizon." 
          onClick={handleRun}
        />
        <ScenarioButton 
          label="AI Expansion" 
          description="Forecast ROI on $2M compute spend increase vs reduced dev headcount." 
          onClick={handleRun}
        />
      </div>

      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-zinc-800">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Simulation Results</h3>
                <p className="text-zinc-500 text-sm mono">REF: {result.simulationId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Confidence Score</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-32 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${result.confidenceScore * 100}%` }}></div>
                </div>
                <span className="text-sm font-bold text-zinc-300">{Math.round(result.confidenceScore * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h4 className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-4">Neural Narrative</h4>
              <p className="text-zinc-200 leading-relaxed italic border-l-2 border-blue-500/30 pl-6 py-2">
                "{result.outcomeNarrative}"
              </p>
            </div>
            <div className="bg-black/40 rounded-2xl p-8 border border-zinc-800">
              <div className="space-y-6">
                <div>
                  <p className="text-zinc-500 text-xs mb-1">Projected Portfolio Value (12M)</p>
                  <p className="text-4xl font-bold text-white mono tracking-tighter">
                    ${result.projectedValue?.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Risk Exposure</p>
                    <div className="flex items-center space-x-2 text-rose-500">
                      <AlertCircle size={16} />
                      <span className="font-bold">Elevated</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Resilience Rating</p>
                    <div className="flex items-center space-x-2 text-blue-400">
                      <ChevronRight size={16} />
                      <span className="font-bold">AA-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;
