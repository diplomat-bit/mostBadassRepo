// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Cards.tsx
================================================================================


import React, { useState } from 'react';
import { Plus, Shield, Globe, Lock, Unlock, Settings2, Trash2, X, CreditCard, Loader2, CheckCircle2, ChevronRight, MapPin, Activity } from 'lucide-react';

const CardVisual = ({ holder, number, balance, type, frozen }: any) => (
  <div className={`relative h-56 w-96 rounded-[2.5rem] p-8 overflow-hidden transition-all duration-700 ${frozen ? 'grayscale opacity-40 scale-95 shadow-none' : 'hover:scale-[1.02] shadow-2xl shadow-blue-900/30'}`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${type === 'Rewards+' ? 'from-indigo-600 via-blue-800 to-zinc-950' : 'from-blue-600 via-blue-800 to-zinc-950'}`}></div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/5 blur-2xl rounded-full -ml-16 -mb-16"></div>
    
    <div className="relative z-10 h-full flex flex-col justify-between text-white">
      <div className="flex justify-between items-start">
        <div className="w-12 h-9 bg-white/10 rounded-lg backdrop-blur-xl border border-white/20 flex items-center justify-center">
           <Activity size={20} className="opacity-50" />
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60 mb-0.5">Corporate Elite</p>
          <p className="text-[10px] font-black uppercase italic tracking-tighter">{type}</p>
        </div>
      </div>
      
      <div className="mono text-2xl tracking-[0.25em] font-medium shadow-black drop-shadow-lg">{number}</div>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60 mb-1">Controller</p>
          <p className="text-[10px] font-black uppercase italic tracking-tight">{holder}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60 mb-1">Threshold</p>
          <p className="text-xs font-black mono text-blue-300 tracking-tighter">${balance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);

const Cards: React.FC = () => {
  const [cards, setCards] = useState([
    { id: '1', holder: 'ALEX RIVERA', number: '•••• •••• •••• 7899', balance: 50000, type: 'Rewards+', frozen: false, regions: ['US', 'EU', 'UK'] },
    { id: '2', holder: 'ALEX RIVERA', number: '•••• •••• •••• 1035', balance: 120000, type: 'Elite Savings', frozen: false, regions: ['US', 'SG'] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLimitsOpen, setIsLimitsOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  
  const [isIssuing, setIsIssuing] = useState(false);
  const [newCardType, setNewCardType] = useState('Rewards+');
  const [tempLimit, setTempLimit] = useState('');

  const toggleFreeze = (id: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, frozen: !c.frozen } : c));
  };

  const updateLimit = () => {
    if (!activeCardId || !tempLimit) return;
    setCards(prev => prev.map(c => c.id === activeCardId ? { ...c, balance: parseFloat(tempLimit) } : c));
    setIsLimitsOpen(false);
    setTempLimit('');
  };

  const toggleRegion = (region: string) => {
    if (!activeCardId) return;
    setCards(prev => prev.map(c => {
      if (c.id === activeCardId) {
        const regions = c.regions.includes(region) 
          ? c.regions.filter(r => r !== region)
          : [...c.regions, region];
        return { ...c, regions };
      }
      return c;
    }));
  };

  const handleIssueCard = () => {
    setIsIssuing(true);
    setTimeout(() => {
      const newCard = {
        id: Date.now().toString(),
        holder: 'ALEX RIVERA',
        number: `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
        balance: newCardType === 'Rewards+' ? 50000 : 250000,
        type: newCardType,
        frozen: false,
        regions: ['US']
      };
      setCards(prev => [...prev, newCard]);
      setIsIssuing(false);
      setIsModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Elite <span className="text-blue-500 not-italic">Instruments</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Spend Nodes & Routing Policy Control</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
        >
          <Plus size={18} />
          <span>Provision New Node</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {cards.map(card => (
          <div key={card.id} className="bg-zinc-950 border border-zinc-900 rounded-[3.5rem] p-10 flex flex-col md:flex-row gap-10 items-center md:items-stretch shadow-2xl group hover:border-blue-500/20 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
               <CreditCard size={150} />
            </div>
            
            <CardVisual {...card} />
            
            <div className="flex-1 flex flex-col justify-between py-2 w-full relative z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.25em]">Registry Integrity</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${card.frozen ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {card.frozen ? 'SUSPENDED' : 'OPERATIONAL'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => toggleFreeze(card.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all group/btn ${card.frozen ? 'bg-blue-600 text-white border-blue-500' : 'bg-black border-zinc-900 hover:border-zinc-700'}`}
                  >
                    <div className="flex items-center space-x-4">
                      {card.frozen ? <Unlock size={16} /> : <Lock size={16} className="text-zinc-600 group-hover/btn:text-white transition-colors" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{card.frozen ? 'REACTIVATE NODE' : 'SUSPEND NODE'}</span>
                    </div>
                    <ChevronRight size={14} className={card.frozen ? 'opacity-100' : 'opacity-30'} />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveCardId(card.id);
                      setTempLimit(card.balance.toString());
                      setIsLimitsOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-black border border-zinc-900 hover:border-blue-500/50 transition-all group/btn"
                  >
                    <div className="flex items-center space-x-4">
                      <Settings2 size={16} className="text-zinc-600 group-hover/btn:text-blue-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-white">THRESHOLD: ${card.balance.toLocaleString()}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-30" />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveCardId(card.id);
                      setIsRegionsOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-black border border-zinc-900 hover:border-blue-500/50 transition-all group/btn"
                  >
                    <div className="flex items-center space-x-4">
                      <Globe size={16} className="text-zinc-600 group-hover/btn:text-blue-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-white">ROUTING: {card.regions.join(', ')}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-30" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Plus size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Issue <span className="text-blue-500 not-italic">New Card</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Quantum Foundry Authorization</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setNewCardType('Rewards+')}
                  className={`p-6 rounded-2xl border transition-all text-left group ${newCardType === 'Rewards+' ? 'bg-blue-600/10 border-blue-600 shadow-xl shadow-blue-900/10' : 'bg-black border-zinc-900 opacity-50'}`}
                >
                  <p className="text-white font-black text-xs uppercase italic mb-1">Rewards+</p>
                  <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">5% Cloud Credit</p>
                </button>
                <button 
                  onClick={() => setNewCardType('Platinum Founders')}
                  className={`p-6 rounded-2xl border transition-all text-left group ${newCardType === 'Platinum Founders' ? 'bg-blue-600/10 border-blue-600 shadow-xl shadow-blue-900/10' : 'bg-black border-zinc-900 opacity-50'}`}
                >
                  <p className="text-white font-black text-xs uppercase italic mb-1">Founder Elite</p>
                  <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">High Yield Sweep</p>
                </button>
              </div>
              <button 
                onClick={handleIssueCard}
                disabled={isIssuing}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/40"
              >
                {isIssuing ? <Loader2 className="animate-spin" size={22} /> : <CheckCircle2 size={22} />}
                <span>{isIssuing ? 'ENCRYPTING NODE...' : 'INITIALIZE INSTRUMENT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limits Modal */}
      {isLimitsOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Settings2 size={28} />
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Adjust <span className="text-blue-500 not-italic">Threshold</span></h3>
              </div>
              <button onClick={() => setIsLimitsOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Maximum Authorized Velocity (USD)</label>
                <input 
                  type="number"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500 rounded-2xl py-5 px-6 text-white font-mono text-2xl outline-none transition-all shadow-inner"
                  placeholder="0.00"
                />
              </div>
              <button 
                onClick={updateLimit}
                className="w-full py-5 bg-white hover:bg-zinc-200 text-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-white/10"
              >
                Finalize Registry Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regions Modal */}
      {isRegionsOpen && activeCardId && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Globe size={28} />
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Routing <span className="text-blue-500 not-italic">Policy</span></h3>
              </div>
              <button onClick={() => setIsRegionsOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['US', 'EU', 'UK', 'SG', 'JP', 'AU', 'CA', 'BR'].map(reg => (
                <button 
                  key={reg}
                  onClick={() => toggleRegion(reg)}
                  className={`p-6 rounded-2xl border flex items-center justify-between transition-all group ${
                    cards.find(c => c.id === activeCardId)?.regions.includes(reg)
                      ? 'bg-blue-600/10 border-blue-600 text-white shadow-xl shadow-blue-900/10'
                      : 'bg-black border-zinc-900 text-zinc-700 opacity-50'
                  }`}
                >
                  <span className="font-black text-xs uppercase tracking-widest">{reg}</span>
                  {cards.find(c => c.id === activeCardId)?.regions.includes(reg) && <CheckCircle2 size={16} className="text-blue-500" />}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsRegionsOpen(false)}
              className="w-full mt-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all border border-zinc-800"
            >
              Update Global Routing Node
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Cards.tsx
================================================================================


import React, { useState } from 'react';
import { Plus, Shield, Globe, Lock, Unlock, Settings2, Trash2, X, CreditCard, Loader2, CheckCircle2, ChevronRight, MapPin, Activity } from 'lucide-react';

const CardVisual = ({ holder, number, balance, type, frozen }: any) => (
  <div className={`relative h-56 w-96 rounded-[2.5rem] p-8 overflow-hidden transition-all duration-700 ${frozen ? 'grayscale opacity-40 scale-95 shadow-none' : 'hover:scale-[1.02] shadow-2xl shadow-blue-900/30'}`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${type === 'Rewards+' ? 'from-indigo-600 via-blue-800 to-zinc-950' : 'from-blue-600 via-blue-800 to-zinc-950'}`}></div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/5 blur-2xl rounded-full -ml-16 -mb-16"></div>
    
    <div className="relative z-10 h-full flex flex-col justify-between text-white">
      <div className="flex justify-between items-start">
        <div className="w-12 h-9 bg-white/10 rounded-lg backdrop-blur-xl border border-white/20 flex items-center justify-center">
           <Activity size={20} className="opacity-50" />
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60 mb-0.5">Corporate Elite</p>
          <p className="text-[10px] font-black uppercase italic tracking-tighter">{type}</p>
        </div>
      </div>
      
      <div className="mono text-2xl tracking-[0.25em] font-medium shadow-black drop-shadow-lg">{number}</div>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60 mb-1">Controller</p>
          <p className="text-[10px] font-black uppercase italic tracking-tight">{holder}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60 mb-1">Threshold</p>
          <p className="text-xs font-black mono text-blue-300 tracking-tighter">${balance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);

const Cards: React.FC = () => {
  const [cards, setCards] = useState([
    { id: '1', holder: 'ALEX RIVERA', number: '•••• •••• •••• 7899', balance: 50000, type: 'Rewards+', frozen: false, regions: ['US', 'EU', 'UK'] },
    { id: '2', holder: 'ALEX RIVERA', number: '•••• •••• •••• 1035', balance: 120000, type: 'Elite Savings', frozen: false, regions: ['US', 'SG'] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLimitsOpen, setIsLimitsOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  
  const [isIssuing, setIsIssuing] = useState(false);
  const [newCardType, setNewCardType] = useState('Rewards+');
  const [tempLimit, setTempLimit] = useState('');

  const toggleFreeze = (id: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, frozen: !c.frozen } : c));
  };

  const updateLimit = () => {
    if (!activeCardId || !tempLimit) return;
    setCards(prev => prev.map(c => c.id === activeCardId ? { ...c, balance: parseFloat(tempLimit) } : c));
    setIsLimitsOpen(false);
    setTempLimit('');
  };

  const toggleRegion = (region: string) => {
    if (!activeCardId) return;
    setCards(prev => prev.map(c => {
      if (c.id === activeCardId) {
        const regions = c.regions.includes(region) 
          ? c.regions.filter(r => r !== region)
          : [...c.regions, region];
        return { ...c, regions };
      }
      return c;
    }));
  };

  const handleIssueCard = () => {
    setIsIssuing(true);
    setTimeout(() => {
      const newCard = {
        id: Date.now().toString(),
        holder: 'ALEX RIVERA',
        number: `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
        balance: newCardType === 'Rewards+' ? 50000 : 250000,
        type: newCardType,
        frozen: false,
        regions: ['US']
      };
      setCards(prev => [...prev, newCard]);
      setIsIssuing(false);
      setIsModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Elite <span className="text-blue-500 not-italic">Instruments</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Spend Nodes & Routing Policy Control</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
        >
          <Plus size={18} />
          <span>Provision New Node</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {cards.map(card => (
          <div key={card.id} className="bg-zinc-950 border border-zinc-900 rounded-[3.5rem] p-10 flex flex-col md:flex-row gap-10 items-center md:items-stretch shadow-2xl group hover:border-blue-500/20 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
               <CreditCard size={150} />
            </div>
            
            <CardVisual {...card} />
            
            <div className="flex-1 flex flex-col justify-between py-2 w-full relative z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.25em]">Registry Integrity</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${card.frozen ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {card.frozen ? 'SUSPENDED' : 'OPERATIONAL'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => toggleFreeze(card.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all group/btn ${card.frozen ? 'bg-blue-600 text-white border-blue-500' : 'bg-black border-zinc-900 hover:border-zinc-700'}`}
                  >
                    <div className="flex items-center space-x-4">
                      {card.frozen ? <Unlock size={16} /> : <Lock size={16} className="text-zinc-600 group-hover/btn:text-white transition-colors" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{card.frozen ? 'REACTIVATE NODE' : 'SUSPEND NODE'}</span>
                    </div>
                    <ChevronRight size={14} className={card.frozen ? 'opacity-100' : 'opacity-30'} />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveCardId(card.id);
                      setTempLimit(card.balance.toString());
                      setIsLimitsOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-black border border-zinc-900 hover:border-blue-500/50 transition-all group/btn"
                  >
                    <div className="flex items-center space-x-4">
                      <Settings2 size={16} className="text-zinc-600 group-hover/btn:text-blue-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-white">THRESHOLD: ${card.balance.toLocaleString()}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-30" />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveCardId(card.id);
                      setIsRegionsOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-black border border-zinc-900 hover:border-blue-500/50 transition-all group/btn"
                  >
                    <div className="flex items-center space-x-4">
                      <Globe size={16} className="text-zinc-600 group-hover/btn:text-blue-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-white">ROUTING: {card.regions.join(', ')}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-30" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Plus size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Issue <span className="text-blue-500 not-italic">New Card</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Quantum Foundry Authorization</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setNewCardType('Rewards+')}
                  className={`p-6 rounded-2xl border transition-all text-left group ${newCardType === 'Rewards+' ? 'bg-blue-600/10 border-blue-600 shadow-xl shadow-blue-900/10' : 'bg-black border-zinc-900 opacity-50'}`}
                >
                  <p className="text-white font-black text-xs uppercase italic mb-1">Rewards+</p>
                  <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">5% Cloud Credit</p>
                </button>
                <button 
                  onClick={() => setNewCardType('Platinum Founders')}
                  className={`p-6 rounded-2xl border transition-all text-left group ${newCardType === 'Platinum Founders' ? 'bg-blue-600/10 border-blue-600 shadow-xl shadow-blue-900/10' : 'bg-black border-zinc-900 opacity-50'}`}
                >
                  <p className="text-white font-black text-xs uppercase italic mb-1">Founder Elite</p>
                  <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">High Yield Sweep</p>
                </button>
              </div>
              <button 
                onClick={handleIssueCard}
                disabled={isIssuing}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/40"
              >
                {isIssuing ? <Loader2 className="animate-spin" size={22} /> : <CheckCircle2 size={22} />}
                <span>{isIssuing ? 'ENCRYPTING NODE...' : 'INITIALIZE INSTRUMENT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limits Modal */}
      {isLimitsOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Settings2 size={28} />
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Adjust <span className="text-blue-500 not-italic">Threshold</span></h3>
              </div>
              <button onClick={() => setIsLimitsOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Maximum Authorized Velocity (USD)</label>
                <input 
                  type="number"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500 rounded-2xl py-5 px-6 text-white font-mono text-2xl outline-none transition-all shadow-inner"
                  placeholder="0.00"
                />
              </div>
              <button 
                onClick={updateLimit}
                className="w-full py-5 bg-white hover:bg-zinc-200 text-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-white/10"
              >
                Finalize Registry Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regions Modal */}
      {isRegionsOpen && activeCardId && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Globe size={28} />
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Routing <span className="text-blue-500 not-italic">Policy</span></h3>
              </div>
              <button onClick={() => setIsRegionsOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['US', 'EU', 'UK', 'SG', 'JP', 'AU', 'CA', 'BR'].map(reg => (
                <button 
                  key={reg}
                  onClick={() => toggleRegion(reg)}
                  className={`p-6 rounded-2xl border flex items-center justify-between transition-all group ${
                    cards.find(c => c.id === activeCardId)?.regions.includes(reg)
                      ? 'bg-blue-600/10 border-blue-600 text-white shadow-xl shadow-blue-900/10'
                      : 'bg-black border-zinc-900 text-zinc-700 opacity-50'
                  }`}
                >
                  <span className="font-black text-xs uppercase tracking-widest">{reg}</span>
                  {cards.find(c => c.id === activeCardId)?.regions.includes(reg) && <CheckCircle2 size={16} className="text-blue-500" />}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsRegionsOpen(false)}
              className="w-full mt-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all border border-zinc-800"
            >
              Update Global Routing Node
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Cards.tsx
================================================================================


import React, { useState } from 'react';
import { Plus, Shield, Globe, Lock, Unlock, Settings2, Trash2, X, CreditCard, Loader2, CheckCircle2, ChevronRight, MapPin, Activity } from 'lucide-react';

const CardVisual = ({ holder, number, balance, type, frozen }: any) => (
  <div className={`relative h-56 w-96 rounded-[2.5rem] p-8 overflow-hidden transition-all duration-700 ${frozen ? 'grayscale opacity-40 scale-95 shadow-none' : 'hover:scale-[1.02] shadow-2xl shadow-blue-900/30'}`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${type === 'Rewards+' ? 'from-indigo-600 via-blue-800 to-zinc-950' : 'from-blue-600 via-blue-800 to-zinc-950'}`}></div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/5 blur-2xl rounded-full -ml-16 -mb-16"></div>
    
    <div className="relative z-10 h-full flex flex-col justify-between text-white">
      <div className="flex justify-between items-start">
        <div className="w-12 h-9 bg-white/10 rounded-lg backdrop-blur-xl border border-white/20 flex items-center justify-center">
           <Activity size={20} className="opacity-50" />
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60 mb-0.5">Corporate Elite</p>
          <p className="text-[10px] font-black uppercase italic tracking-tighter">{type}</p>
        </div>
      </div>
      
      <div className="mono text-2xl tracking-[0.25em] font-medium shadow-black drop-shadow-lg">{number}</div>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60 mb-1">Controller</p>
          <p className="text-[10px] font-black uppercase italic tracking-tight">{holder}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60 mb-1">Threshold</p>
          <p className="text-xs font-black mono text-blue-300 tracking-tighter">${balance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);

const Cards: React.FC = () => {
  const [cards, setCards] = useState([
    { id: '1', holder: 'ALEX RIVERA', number: '•••• •••• •••• 7899', balance: 50000, type: 'Rewards+', frozen: false, regions: ['US', 'EU', 'UK'] },
    { id: '2', holder: 'ALEX RIVERA', number: '•••• •••• •••• 1035', balance: 120000, type: 'Elite Savings', frozen: false, regions: ['US', 'SG'] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLimitsOpen, setIsLimitsOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  
  const [isIssuing, setIsIssuing] = useState(false);
  const [newCardType, setNewCardType] = useState('Rewards+');
  const [tempLimit, setTempLimit] = useState('');

  const toggleFreeze = (id: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, frozen: !c.frozen } : c));
  };

  const updateLimit = () => {
    if (!activeCardId || !tempLimit) return;
    setCards(prev => prev.map(c => c.id === activeCardId ? { ...c, balance: parseFloat(tempLimit) } : c));
    setIsLimitsOpen(false);
    setTempLimit('');
  };

  const toggleRegion = (region: string) => {
    if (!activeCardId) return;
    setCards(prev => prev.map(c => {
      if (c.id === activeCardId) {
        const regions = c.regions.includes(region) 
          ? c.regions.filter(r => r !== region)
          : [...c.regions, region];
        return { ...c, regions };
      }
      return c;
    }));
  };

  const handleIssueCard = () => {
    setIsIssuing(true);
    setTimeout(() => {
      const newCard = {
        id: Date.now().toString(),
        holder: 'ALEX RIVERA',
        number: `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
        balance: newCardType === 'Rewards+' ? 50000 : 250000,
        type: newCardType,
        frozen: false,
        regions: ['US']
      };
      setCards(prev => [...prev, newCard]);
      setIsIssuing(false);
      setIsModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Elite <span className="text-blue-500 not-italic">Instruments</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Spend Nodes & Routing Policy Control</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
        >
          <Plus size={18} />
          <span>Provision New Node</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {cards.map(card => (
          <div key={card.id} className="bg-zinc-950 border border-zinc-900 rounded-[3.5rem] p-10 flex flex-col md:flex-row gap-10 items-center md:items-stretch shadow-2xl group hover:border-blue-500/20 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
               <CreditCard size={150} />
            </div>
            
            <CardVisual {...card} />
            
            <div className="flex-1 flex flex-col justify-between py-2 w-full relative z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.25em]">Registry Integrity</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${card.frozen ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {card.frozen ? 'SUSPENDED' : 'OPERATIONAL'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => toggleFreeze(card.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all group/btn ${card.frozen ? 'bg-blue-600 text-white border-blue-500' : 'bg-black border-zinc-900 hover:border-zinc-700'}`}
                  >
                    <div className="flex items-center space-x-4">
                      {card.frozen ? <Unlock size={16} /> : <Lock size={16} className="text-zinc-600 group-hover/btn:text-white transition-colors" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{card.frozen ? 'REACTIVATE NODE' : 'SUSPEND NODE'}</span>
                    </div>
                    <ChevronRight size={14} className={card.frozen ? 'opacity-100' : 'opacity-30'} />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveCardId(card.id);
                      setTempLimit(card.balance.toString());
                      setIsLimitsOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-black border border-zinc-900 hover:border-blue-500/50 transition-all group/btn"
                  >
                    <div className="flex items-center space-x-4">
                      <Settings2 size={16} className="text-zinc-600 group-hover/btn:text-blue-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-white">THRESHOLD: ${card.balance.toLocaleString()}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-30" />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveCardId(card.id);
                      setIsRegionsOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-black border border-zinc-900 hover:border-blue-500/50 transition-all group/btn"
                  >
                    <div className="flex items-center space-x-4">
                      <Globe size={16} className="text-zinc-600 group-hover/btn:text-blue-500 transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-white">ROUTING: {card.regions.join(', ')}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-30" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Plus size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Issue <span className="text-blue-500 not-italic">New Card</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Quantum Foundry Authorization</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setNewCardType('Rewards+')}
                  className={`p-6 rounded-2xl border transition-all text-left group ${newCardType === 'Rewards+' ? 'bg-blue-600/10 border-blue-600 shadow-xl shadow-blue-900/10' : 'bg-black border-zinc-900 opacity-50'}`}
                >
                  <p className="text-white font-black text-xs uppercase italic mb-1">Rewards+</p>
                  <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">5% Cloud Credit</p>
                </button>
                <button 
                  onClick={() => setNewCardType('Platinum Founders')}
                  className={`p-6 rounded-2xl border transition-all text-left group ${newCardType === 'Platinum Founders' ? 'bg-blue-600/10 border-blue-600 shadow-xl shadow-blue-900/10' : 'bg-black border-zinc-900 opacity-50'}`}
                >
                  <p className="text-white font-black text-xs uppercase italic mb-1">Founder Elite</p>
                  <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">High Yield Sweep</p>
                </button>
              </div>
              <button 
                onClick={handleIssueCard}
                disabled={isIssuing}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/40"
              >
                {isIssuing ? <Loader2 className="animate-spin" size={22} /> : <CheckCircle2 size={22} />}
                <span>{isIssuing ? 'ENCRYPTING NODE...' : 'INITIALIZE INSTRUMENT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limits Modal */}
      {isLimitsOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Settings2 size={28} />
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Adjust <span className="text-blue-500 not-italic">Threshold</span></h3>
              </div>
              <button onClick={() => setIsLimitsOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Maximum Authorized Velocity (USD)</label>
                <input 
                  type="number"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500 rounded-2xl py-5 px-6 text-white font-mono text-2xl outline-none transition-all shadow-inner"
                  placeholder="0.00"
                />
              </div>
              <button 
                onClick={updateLimit}
                className="w-full py-5 bg-white hover:bg-zinc-200 text-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-white/10"
              >
                Finalize Registry Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regions Modal */}
      {isRegionsOpen && activeCardId && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-md bg-black/80">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Globe size={28} />
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Routing <span className="text-blue-500 not-italic">Policy</span></h3>
              </div>
              <button onClick={() => setIsRegionsOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['US', 'EU', 'UK', 'SG', 'JP', 'AU', 'CA', 'BR'].map(reg => (
                <button 
                  key={reg}
                  onClick={() => toggleRegion(reg)}
                  className={`p-6 rounded-2xl border flex items-center justify-between transition-all group ${
                    cards.find(c => c.id === activeCardId)?.regions.includes(reg)
                      ? 'bg-blue-600/10 border-blue-600 text-white shadow-xl shadow-blue-900/10'
                      : 'bg-black border-zinc-900 text-zinc-700 opacity-50'
                  }`}
                >
                  <span className="font-black text-xs uppercase tracking-widest">{reg}</span>
                  {cards.find(c => c.id === activeCardId)?.regions.includes(reg) && <CheckCircle2 size={16} className="text-blue-500" />}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsRegionsOpen(false)}
              className="w-full mt-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all border border-zinc-800"
            >
              Update Global Routing Node
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
