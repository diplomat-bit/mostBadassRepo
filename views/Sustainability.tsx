// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Sustainability.tsx
================================================================================


import React, { useState } from 'react';
import { Leaf, Wind, Droplets, Factory, Info, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
/* Fix: react-router-dom exports may be flaky in this environment, using standard v6 imports */
import { useNavigate } from 'react-router-dom';

const MOCK_DATA = [
  { name: 'Data Centers', value: 45, color: '#3b82f6' },
  { name: 'Supply Chain', value: 25, color: '#10b981' },
  { name: 'Office Logistics', value: 15, color: '#8b5cf6' },
  { name: 'Business Travel', value: 15, color: '#f59e0b' },
];

const Sustainability: React.FC = () => {
  const [buying, setBuying] = useState(false);
  const isInitiallyNeutral = localStorage.getItem('esg_neutral') === 'true';
  const [success, setSuccess] = useState(isInitiallyNeutral);
  const navigate = useNavigate();

  const handleBuyCredits = () => {
    setBuying(true);
    setTimeout(() => {
      setBuying(false);
      setSuccess(true);
      localStorage.setItem('esg_neutral', 'true');
      window.dispatchEvent(new Event('esg-update'));
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-10 border-r border-zinc-800 min-w-0">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 rounded-2xl ${success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'} transition-colors`}>
                <Leaf size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white">Carbon Ledger</h2>
            </div>
            
            <div className="mb-10">
              <p className="text-zinc-500 text-sm font-medium mb-2 uppercase tracking-widest">Aggregate Carbon Intensity</p>
              <div className="flex items-baseline space-x-3">
                <h3 className={`text-6xl font-bold tracking-tighter mono transition-colors ${success ? 'text-emerald-500' : 'text-white'}`}>
                  {success ? '0' : '1,242'}
                </h3>
                <span className="text-zinc-400 font-bold text-xl uppercase">Kg CO2e</span>
              </div>
              {success && <p className="text-emerald-500 text-xs font-bold mt-2 uppercase tracking-[0.2em]">Net Zero Achieved</p>}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-zinc-800">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Wind size={20} /></div>
                  <span className="font-semibold text-zinc-300">Renewable Energy</span>
                </div>
                <span className="text-emerald-500 font-bold">100% Offset</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-zinc-800">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Factory size={20} /></div>
                  <span className="font-semibold text-zinc-300">Verified Projects</span>
                </div>
                <span className="text-zinc-400 font-bold">{success ? '4 Active' : 'None'}</span>
              </div>
            </div>
          </div>

          <div className="p-10 bg-zinc-950/50 flex flex-col min-w-0">
            <h4 className="text-white font-bold text-xl mb-2">Emission Matrix</h4>
            <p className="text-zinc-500 text-sm mb-8">Quantum audit of environmental externalities</p>
            
            {/* Explicit container fix for Recharts dimension warning */}
            <div className="flex-1 relative min-h-[300px] h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {MOCK_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={success ? '#10b981' : entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">ESG Rating</p>
                  <p className="text-emerald-500 font-bold text-sm">{success ? 'AAA' : 'AA-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 ${success ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-blue-600/10 border-blue-500/20'} border rounded-[32px] p-10`}>
        <div className="flex items-start space-x-6">
          <div className={`p-4 ${success ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-blue-600 shadow-blue-900/40'} text-white rounded-2xl shadow-xl transition-all`}>
            {success ? <CheckCircle2 size={32} /> : <Info size={32} />}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-2xl mb-2 tracking-tight">
              {success ? 'Portfolio Neutrality Confirmed' : 'Action Required: Q3 Carbon Deficit'}
            </h3>
            <p className={`${success ? 'text-emerald-100/70' : 'text-blue-100/70'} text-lg leading-relaxed mb-8`}>
              {success 
                ? "Your corporate ledger is now verified Carbon Neutral. 25 Carbon Credits have been successfully retired. Certificate #QC-8841-B is available in your Audit Report."
                : "Quantum analysis identifies 1,242Kg of unmitigated emissions. Purchase 25 verified credits to achieve neutrality."}
            </p>
            <div className="flex gap-4">
              {!success ? (
                <button 
                  onClick={handleBuyCredits}
                  disabled={buying}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-blue-900/30"
                >
                  {buying ? <Loader2 size={20} className="animate-spin" /> : <Leaf size={20} />}
                  <span>{buying ? 'Executing Quantum Offset...' : 'Buy Carbon Credits'}</span>
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/analytics')}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-900/30"
                >
                  View ESG Audit Report
                </button>
              )}
              <button 
                onClick={() => navigate('/analytics')}
                className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-2xl font-bold transition-all flex items-center gap-2"
              >
                <span>Full ESG Transparency</span>
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Sustainability.tsx
================================================================================


import React, { useState } from 'react';
import { Leaf, Wind, Droplets, Factory, Info, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
/* Fix: react-router-dom exports may be flaky in this environment, using standard v6 imports */
import { useNavigate } from 'react-router-dom';

const MOCK_DATA = [
  { name: 'Data Centers', value: 45, color: '#3b82f6' },
  { name: 'Supply Chain', value: 25, color: '#10b981' },
  { name: 'Office Logistics', value: 15, color: '#8b5cf6' },
  { name: 'Business Travel', value: 15, color: '#f59e0b' },
];

const Sustainability: React.FC = () => {
  const [buying, setBuying] = useState(false);
  const isInitiallyNeutral = localStorage.getItem('esg_neutral') === 'true';
  const [success, setSuccess] = useState(isInitiallyNeutral);
  const navigate = useNavigate();

  const handleBuyCredits = () => {
    setBuying(true);
    setTimeout(() => {
      setBuying(false);
      setSuccess(true);
      localStorage.setItem('esg_neutral', 'true');
      window.dispatchEvent(new Event('esg-update'));
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-10 border-r border-zinc-800 min-w-0">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 rounded-2xl ${success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'} transition-colors`}>
                <Leaf size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white">Carbon Ledger</h2>
            </div>
            
            <div className="mb-10">
              <p className="text-zinc-500 text-sm font-medium mb-2 uppercase tracking-widest">Aggregate Carbon Intensity</p>
              <div className="flex items-baseline space-x-3">
                <h3 className={`text-6xl font-bold tracking-tighter mono transition-colors ${success ? 'text-emerald-500' : 'text-white'}`}>
                  {success ? '0' : '1,242'}
                </h3>
                <span className="text-zinc-400 font-bold text-xl uppercase">Kg CO2e</span>
              </div>
              {success && <p className="text-emerald-500 text-xs font-bold mt-2 uppercase tracking-[0.2em]">Net Zero Achieved</p>}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-zinc-800">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Wind size={20} /></div>
                  <span className="font-semibold text-zinc-300">Renewable Energy</span>
                </div>
                <span className="text-emerald-500 font-bold">100% Offset</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-zinc-800">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Factory size={20} /></div>
                  <span className="font-semibold text-zinc-300">Verified Projects</span>
                </div>
                <span className="text-zinc-400 font-bold">{success ? '4 Active' : 'None'}</span>
              </div>
            </div>
          </div>

          <div className="p-10 bg-zinc-950/50 flex flex-col min-w-0">
            <h4 className="text-white font-bold text-xl mb-2">Emission Matrix</h4>
            <p className="text-zinc-500 text-sm mb-8">Quantum audit of environmental externalities</p>
            
            {/* Explicit container fix for Recharts dimension warning */}
            <div className="flex-1 relative min-h-[300px] h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {MOCK_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={success ? '#10b981' : entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">ESG Rating</p>
                  <p className="text-emerald-500 font-bold text-sm">{success ? 'AAA' : 'AA-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 ${success ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-blue-600/10 border-blue-500/20'} border rounded-[32px] p-10`}>
        <div className="flex items-start space-x-6">
          <div className={`p-4 ${success ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-blue-600 shadow-blue-900/40'} text-white rounded-2xl shadow-xl transition-all`}>
            {success ? <CheckCircle2 size={32} /> : <Info size={32} />}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-2xl mb-2 tracking-tight">
              {success ? 'Portfolio Neutrality Confirmed' : 'Action Required: Q3 Carbon Deficit'}
            </h3>
            <p className={`${success ? 'text-emerald-100/70' : 'text-blue-100/70'} text-lg leading-relaxed mb-8`}>
              {success 
                ? "Your corporate ledger is now verified Carbon Neutral. 25 Carbon Credits have been successfully retired. Certificate #QC-8841-B is available in your Audit Report."
                : "Quantum analysis identifies 1,242Kg of unmitigated emissions. Purchase 25 verified credits to achieve neutrality."}
            </p>
            <div className="flex gap-4">
              {!success ? (
                <button 
                  onClick={handleBuyCredits}
                  disabled={buying}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-blue-900/30"
                >
                  {buying ? <Loader2 size={20} className="animate-spin" /> : <Leaf size={20} />}
                  <span>{buying ? 'Executing Quantum Offset...' : 'Buy Carbon Credits'}</span>
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/analytics')}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-900/30"
                >
                  View ESG Audit Report
                </button>
              )}
              <button 
                onClick={() => navigate('/analytics')}
                className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-2xl font-bold transition-all flex items-center gap-2"
              >
                <span>Full ESG Transparency</span>
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Sustainability.tsx
================================================================================


import React, { useState } from 'react';
import { Leaf, Wind, Droplets, Factory, Info, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
/* Fix: react-router-dom exports may be flaky in this environment, using standard v6 imports */
import { useNavigate } from 'react-router-dom';

const MOCK_DATA = [
  { name: 'Data Centers', value: 45, color: '#3b82f6' },
  { name: 'Supply Chain', value: 25, color: '#10b981' },
  { name: 'Office Logistics', value: 15, color: '#8b5cf6' },
  { name: 'Business Travel', value: 15, color: '#f59e0b' },
];

const Sustainability: React.FC = () => {
  const [buying, setBuying] = useState(false);
  const isInitiallyNeutral = localStorage.getItem('esg_neutral') === 'true';
  const [success, setSuccess] = useState(isInitiallyNeutral);
  const navigate = useNavigate();

  const handleBuyCredits = () => {
    setBuying(true);
    setTimeout(() => {
      setBuying(false);
      setSuccess(true);
      localStorage.setItem('esg_neutral', 'true');
      window.dispatchEvent(new Event('esg-update'));
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-10 border-r border-zinc-800 min-w-0">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 rounded-2xl ${success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'} transition-colors`}>
                <Leaf size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white">Carbon Ledger</h2>
            </div>
            
            <div className="mb-10">
              <p className="text-zinc-500 text-sm font-medium mb-2 uppercase tracking-widest">Aggregate Carbon Intensity</p>
              <div className="flex items-baseline space-x-3">
                <h3 className={`text-6xl font-bold tracking-tighter mono transition-colors ${success ? 'text-emerald-500' : 'text-white'}`}>
                  {success ? '0' : '1,242'}
                </h3>
                <span className="text-zinc-400 font-bold text-xl uppercase">Kg CO2e</span>
              </div>
              {success && <p className="text-emerald-500 text-xs font-bold mt-2 uppercase tracking-[0.2em]">Net Zero Achieved</p>}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-zinc-800">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Wind size={20} /></div>
                  <span className="font-semibold text-zinc-300">Renewable Energy</span>
                </div>
                <span className="text-emerald-500 font-bold">100% Offset</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-zinc-800">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Factory size={20} /></div>
                  <span className="font-semibold text-zinc-300">Verified Projects</span>
                </div>
                <span className="text-zinc-400 font-bold">{success ? '4 Active' : 'None'}</span>
              </div>
            </div>
          </div>

          <div className="p-10 bg-zinc-950/50 flex flex-col min-w-0">
            <h4 className="text-white font-bold text-xl mb-2">Emission Matrix</h4>
            <p className="text-zinc-500 text-sm mb-8">Quantum audit of environmental externalities</p>
            
            {/* Explicit container fix for Recharts dimension warning */}
            <div className="flex-1 relative min-h-[300px] h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {MOCK_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={success ? '#10b981' : entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">ESG Rating</p>
                  <p className="text-emerald-500 font-bold text-sm">{success ? 'AAA' : 'AA-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 ${success ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-blue-600/10 border-blue-500/20'} border rounded-[32px] p-10`}>
        <div className="flex items-start space-x-6">
          <div className={`p-4 ${success ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-blue-600 shadow-blue-900/40'} text-white rounded-2xl shadow-xl transition-all`}>
            {success ? <CheckCircle2 size={32} /> : <Info size={32} />}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-2xl mb-2 tracking-tight">
              {success ? 'Portfolio Neutrality Confirmed' : 'Action Required: Q3 Carbon Deficit'}
            </h3>
            <p className={`${success ? 'text-emerald-100/70' : 'text-blue-100/70'} text-lg leading-relaxed mb-8`}>
              {success 
                ? "Your corporate ledger is now verified Carbon Neutral. 25 Carbon Credits have been successfully retired. Certificate #QC-8841-B is available in your Audit Report."
                : "Quantum analysis identifies 1,242Kg of unmitigated emissions. Purchase 25 verified credits to achieve neutrality."}
            </p>
            <div className="flex gap-4">
              {!success ? (
                <button 
                  onClick={handleBuyCredits}
                  disabled={buying}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-blue-900/30"
                >
                  {buying ? <Loader2 size={20} className="animate-spin" /> : <Leaf size={20} />}
                  <span>{buying ? 'Executing Quantum Offset...' : 'Buy Carbon Credits'}</span>
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/analytics')}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-900/30"
                >
                  View ESG Audit Report
                </button>
              )}
              <button 
                onClick={() => navigate('/analytics')}
                className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-2xl font-bold transition-all flex items-center gap-2"
              >
                <span>Full ESG Transparency</span>
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
