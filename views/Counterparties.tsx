// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Counterparties.tsx
================================================================================


import React, { useState } from 'react';
/* Fix: react-router-dom exports may be flaky in this environment, using standard v6 imports */
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Globe, 
  ShieldCheck, 
  MoreHorizontal,
  Loader2,
  X,
  ArrowRight,
  Building2,
  Calendar,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { Counterparty } from '../types/index';

const MOCK_CP: Counterparty[] = [
  { id: 'CP-8801', name: 'Global Logistics Corp', email: 'billing@globallogistics.io', status: 'ACTIVE', createdAt: '2023-11-20', accounts: [{ id: 'ACC-1', accountType: 'CHECKING', accountNumber: '•••• 4421' }] },
  { id: 'CP-9902', name: 'Neural Dynamics Research', email: 'treasury@neuraldynamics.ai', status: 'PENDING', createdAt: '2024-01-05', accounts: [] },
  { id: 'CP-1105', name: 'Skyline Real Estate', email: 'payments@skyline.co', status: 'ACTIVE', createdAt: '2023-08-12', accounts: [{ id: 'ACC-2', accountType: 'SAVINGS', accountNumber: '•••• 1022' }] },
];

const Counterparties: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState(MOCK_CP);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Counterparty | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', email: '' });

  const registerPartner = () => {
    if (!newPartner.name || !newPartner.email) return;
    setConnecting(true);
    setTimeout(() => {
      const partner: Counterparty = {
        id: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
        name: newPartner.name,
        email: newPartner.email,
        status: 'PENDING',
        createdAt: new Date().toISOString().split('T')[0],
        accounts: []
      };
      setPartners([...partners, partner]);
      setConnecting(false);
      setShowModal(false);
      setNewPartner({ name: '', email: '' });
    }, 1500);
  };

  const openProfile = (partner: Counterparty) => {
    setSelectedPartner(partner);
    setShowProfile(true);
  };

  const handleSendFunds = (partner: Counterparty) => {
    // Navigate to disbursements with partner intent
    navigate('/payments', { state: { selectedPayeeId: partner.id } });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Partner <span className="text-blue-500 not-italic">CRM</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Managed Third-Party Entities & KYC Handshakes</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30"
        >
          <Plus size={14} />
          <span>Register Counterparty</span>
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex flex-col md:flex-row justify-between items-center bg-black/20 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Users size={20} />
            </div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Active Directory</h3>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              placeholder="Search Partners..."
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-px bg-zinc-900/50">
          {partners.map(cp => (
            <div key={cp.id} className="bg-zinc-950 p-10 hover:bg-white/[0.02] transition-all group border border-transparent hover:border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
                 <Building2 size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-blue-400 transition-colors shadow-2xl">
                    <Globe size={32} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${cp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {cp.status}
                  </div>
                </div>
                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{cp.name}</h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-10 truncate">{cp.email}</p>
                <div className="flex gap-4">
                  <button onClick={() => openProfile(cp)} className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-800 hover:bg-zinc-800 flex items-center justify-center gap-2">
                    Profile
                  </button>
                  <button onClick={() => handleSendFunds(cp)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-500 flex items-center justify-center gap-2">
                    Send Funds
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && selectedPartner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-black/70">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-10 pb-8 border-b border-zinc-900">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center">
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedPartner.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Institutional Entity Record • {selectedPartner.id}</p>
                </div>
              </div>
              <button onClick={() => setShowProfile(false)} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Entity Email</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Mail size={14} className="text-blue-500" />
                      {selectedPartner.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Relationship Established</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" />
                      {new Date(selectedPartner.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">KYC Verification Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedPartner.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                      <span className={`${selectedPartner.status === 'ACTIVE' ? 'text-emerald-500' : 'text-amber-500'} font-black text-[10px] uppercase tracking-widest`}>
                        {selectedPartner.status === 'ACTIVE' ? 'Identity Verified' : 'Handshake Pending'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Primary Registry Type</p>
                    <p className="text-white font-black italic uppercase tracking-tighter">FDX_CORPORATE_NODE</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-black border border-zinc-800 rounded-3xl space-y-4">
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                   <CreditCard size={12} />
                   Linked Financial Handshakes
                 </p>
                 {selectedPartner.accounts && selectedPartner.accounts.length > 0 ? (
                    selectedPartner.accounts.map(acc => (
                      <div key={acc.id} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                        <div>
                          <p className="text-white text-xs font-bold uppercase">{acc.accountType} Account</p>
                          <p className="text-zinc-500 text-[10px] font-mono mt-0.5">{acc.accountNumber}</p>
                        </div>
                        <span className="text-[8px] font-black uppercase text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">RTP Enabled</span>
                      </div>
                    ))
                 ) : (
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-800 text-center">
                      <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">No verified external accounts found</p>
                    </div>
                 )}
              </div>

              <div className="flex gap-4">
                 <button className="flex-1 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all border border-zinc-800 flex items-center justify-center gap-3">
                   <ExternalLink size={18} />
                   Open Documents
                 </button>
                 <button 
                  onClick={() => handleSendFunds(selectedPartner)}
                  className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl"
                 >
                   Send Disbursement
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Add <span className="text-blue-500 not-italic">Partner</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">KYC/KYB Initialization</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-zinc-600 hover:text-white"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Entity Name</label>
                <input 
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                  placeholder="Legal Company Name"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-xl py-4 px-4 text-white font-bold outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Treasury Email</label>
                <input 
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                  placeholder="treasury@partner.io"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-xl py-4 px-4 text-white font-bold outline-none transition-all"
                />
              </div>

              <button 
                onClick={registerPartner}
                disabled={connecting || !newPartner.name}
                className="w-full mt-4 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-900/30"
              >
                {connecting ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                <span>{connecting ? 'Dispatching Handshake...' : 'Register Entity'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Counterparties;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Counterparties.tsx
================================================================================


import React, { useState } from 'react';
/* Fix: react-router-dom exports may be flaky in this environment, using standard v6 imports */
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Globe, 
  ShieldCheck, 
  MoreHorizontal,
  Loader2,
  X,
  ArrowRight,
  Building2,
  Calendar,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { Counterparty } from '../types/index';

const MOCK_CP: Counterparty[] = [
  { id: 'CP-8801', name: 'Global Logistics Corp', email: 'billing@globallogistics.io', status: 'ACTIVE', createdAt: '2023-11-20', accounts: [{ id: 'ACC-1', accountType: 'CHECKING', accountNumber: '•••• 4421' }] },
  { id: 'CP-9902', name: 'Neural Dynamics Research', email: 'treasury@neuraldynamics.ai', status: 'PENDING', createdAt: '2024-01-05', accounts: [] },
  { id: 'CP-1105', name: 'Skyline Real Estate', email: 'payments@skyline.co', status: 'ACTIVE', createdAt: '2023-08-12', accounts: [{ id: 'ACC-2', accountType: 'SAVINGS', accountNumber: '•••• 1022' }] },
];

const Counterparties: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState(MOCK_CP);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Counterparty | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', email: '' });

  const registerPartner = () => {
    if (!newPartner.name || !newPartner.email) return;
    setConnecting(true);
    setTimeout(() => {
      const partner: Counterparty = {
        id: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
        name: newPartner.name,
        email: newPartner.email,
        status: 'PENDING',
        createdAt: new Date().toISOString().split('T')[0],
        accounts: []
      };
      setPartners([...partners, partner]);
      setConnecting(false);
      setShowModal(false);
      setNewPartner({ name: '', email: '' });
    }, 1500);
  };

  const openProfile = (partner: Counterparty) => {
    setSelectedPartner(partner);
    setShowProfile(true);
  };

  const handleSendFunds = (partner: Counterparty) => {
    // Navigate to disbursements with partner intent
    navigate('/payments', { state: { selectedPayeeId: partner.id } });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Partner <span className="text-blue-500 not-italic">CRM</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Managed Third-Party Entities & KYC Handshakes</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30"
        >
          <Plus size={14} />
          <span>Register Counterparty</span>
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex flex-col md:flex-row justify-between items-center bg-black/20 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Users size={20} />
            </div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Active Directory</h3>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              placeholder="Search Partners..."
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-px bg-zinc-900/50">
          {partners.map(cp => (
            <div key={cp.id} className="bg-zinc-950 p-10 hover:bg-white/[0.02] transition-all group border border-transparent hover:border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
                 <Building2 size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-blue-400 transition-colors shadow-2xl">
                    <Globe size={32} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${cp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {cp.status}
                  </div>
                </div>
                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{cp.name}</h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-10 truncate">{cp.email}</p>
                <div className="flex gap-4">
                  <button onClick={() => openProfile(cp)} className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-800 hover:bg-zinc-800 flex items-center justify-center gap-2">
                    Profile
                  </button>
                  <button onClick={() => handleSendFunds(cp)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-500 flex items-center justify-center gap-2">
                    Send Funds
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && selectedPartner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-black/70">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-10 pb-8 border-b border-zinc-900">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center">
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedPartner.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Institutional Entity Record • {selectedPartner.id}</p>
                </div>
              </div>
              <button onClick={() => setShowProfile(false)} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Entity Email</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Mail size={14} className="text-blue-500" />
                      {selectedPartner.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Relationship Established</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" />
                      {new Date(selectedPartner.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">KYC Verification Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedPartner.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                      <span className={`${selectedPartner.status === 'ACTIVE' ? 'text-emerald-500' : 'text-amber-500'} font-black text-[10px] uppercase tracking-widest`}>
                        {selectedPartner.status === 'ACTIVE' ? 'Identity Verified' : 'Handshake Pending'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Primary Registry Type</p>
                    <p className="text-white font-black italic uppercase tracking-tighter">FDX_CORPORATE_NODE</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-black border border-zinc-800 rounded-3xl space-y-4">
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                   <CreditCard size={12} />
                   Linked Financial Handshakes
                 </p>
                 {selectedPartner.accounts && selectedPartner.accounts.length > 0 ? (
                    selectedPartner.accounts.map(acc => (
                      <div key={acc.id} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                        <div>
                          <p className="text-white text-xs font-bold uppercase">{acc.accountType} Account</p>
                          <p className="text-zinc-500 text-[10px] font-mono mt-0.5">{acc.accountNumber}</p>
                        </div>
                        <span className="text-[8px] font-black uppercase text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">RTP Enabled</span>
                      </div>
                    ))
                 ) : (
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-800 text-center">
                      <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">No verified external accounts found</p>
                    </div>
                 )}
              </div>

              <div className="flex gap-4">
                 <button className="flex-1 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all border border-zinc-800 flex items-center justify-center gap-3">
                   <ExternalLink size={18} />
                   Open Documents
                 </button>
                 <button 
                  onClick={() => handleSendFunds(selectedPartner)}
                  className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl"
                 >
                   Send Disbursement
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Add <span className="text-blue-500 not-italic">Partner</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">KYC/KYB Initialization</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-zinc-600 hover:text-white"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Entity Name</label>
                <input 
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                  placeholder="Legal Company Name"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-xl py-4 px-4 text-white font-bold outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Treasury Email</label>
                <input 
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                  placeholder="treasury@partner.io"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-xl py-4 px-4 text-white font-bold outline-none transition-all"
                />
              </div>

              <button 
                onClick={registerPartner}
                disabled={connecting || !newPartner.name}
                className="w-full mt-4 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-900/30"
              >
                {connecting ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                <span>{connecting ? 'Dispatching Handshake...' : 'Register Entity'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Counterparties;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Counterparties.tsx
================================================================================


import React, { useState } from 'react';
/* Fix: react-router-dom exports may be flaky in this environment, using standard v6 imports */
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Globe, 
  ShieldCheck, 
  MoreHorizontal,
  Loader2,
  X,
  ArrowRight,
  Building2,
  Calendar,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { Counterparty } from '../types/index';

const MOCK_CP: Counterparty[] = [
  { id: 'CP-8801', name: 'Global Logistics Corp', email: 'billing@globallogistics.io', status: 'ACTIVE', createdAt: '2023-11-20', accounts: [{ id: 'ACC-1', accountType: 'CHECKING', accountNumber: '•••• 4421' }] },
  { id: 'CP-9902', name: 'Neural Dynamics Research', email: 'treasury@neuraldynamics.ai', status: 'PENDING', createdAt: '2024-01-05', accounts: [] },
  { id: 'CP-1105', name: 'Skyline Real Estate', email: 'payments@skyline.co', status: 'ACTIVE', createdAt: '2023-08-12', accounts: [{ id: 'ACC-2', accountType: 'SAVINGS', accountNumber: '•••• 1022' }] },
];

const Counterparties: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState(MOCK_CP);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Counterparty | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', email: '' });

  const registerPartner = () => {
    if (!newPartner.name || !newPartner.email) return;
    setConnecting(true);
    setTimeout(() => {
      const partner: Counterparty = {
        id: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
        name: newPartner.name,
        email: newPartner.email,
        status: 'PENDING',
        createdAt: new Date().toISOString().split('T')[0],
        accounts: []
      };
      setPartners([...partners, partner]);
      setConnecting(false);
      setShowModal(false);
      setNewPartner({ name: '', email: '' });
    }, 1500);
  };

  const openProfile = (partner: Counterparty) => {
    setSelectedPartner(partner);
    setShowProfile(true);
  };

  const handleSendFunds = (partner: Counterparty) => {
    // Navigate to disbursements with partner intent
    navigate('/payments', { state: { selectedPayeeId: partner.id } });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Partner <span className="text-blue-500 not-italic">CRM</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Managed Third-Party Entities & KYC Handshakes</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30"
        >
          <Plus size={14} />
          <span>Register Counterparty</span>
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex flex-col md:flex-row justify-between items-center bg-black/20 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Users size={20} />
            </div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Active Directory</h3>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              placeholder="Search Partners..."
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-px bg-zinc-900/50">
          {partners.map(cp => (
            <div key={cp.id} className="bg-zinc-950 p-10 hover:bg-white/[0.02] transition-all group border border-transparent hover:border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
                 <Building2 size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-blue-400 transition-colors shadow-2xl">
                    <Globe size={32} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${cp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {cp.status}
                  </div>
                </div>
                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{cp.name}</h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-10 truncate">{cp.email}</p>
                <div className="flex gap-4">
                  <button onClick={() => openProfile(cp)} className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-800 hover:bg-zinc-800 flex items-center justify-center gap-2">
                    Profile
                  </button>
                  <button onClick={() => handleSendFunds(cp)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-500 flex items-center justify-center gap-2">
                    Send Funds
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && selectedPartner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-black/70">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-10 pb-8 border-b border-zinc-900">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center">
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedPartner.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Institutional Entity Record • {selectedPartner.id}</p>
                </div>
              </div>
              <button onClick={() => setShowProfile(false)} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Entity Email</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Mail size={14} className="text-blue-500" />
                      {selectedPartner.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Relationship Established</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" />
                      {new Date(selectedPartner.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">KYC Verification Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedPartner.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                      <span className={`${selectedPartner.status === 'ACTIVE' ? 'text-emerald-500' : 'text-amber-500'} font-black text-[10px] uppercase tracking-widest`}>
                        {selectedPartner.status === 'ACTIVE' ? 'Identity Verified' : 'Handshake Pending'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Primary Registry Type</p>
                    <p className="text-white font-black italic uppercase tracking-tighter">FDX_CORPORATE_NODE</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-black border border-zinc-800 rounded-3xl space-y-4">
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                   <CreditCard size={12} />
                   Linked Financial Handshakes
                 </p>
                 {selectedPartner.accounts && selectedPartner.accounts.length > 0 ? (
                    selectedPartner.accounts.map(acc => (
                      <div key={acc.id} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                        <div>
                          <p className="text-white text-xs font-bold uppercase">{acc.accountType} Account</p>
                          <p className="text-zinc-500 text-[10px] font-mono mt-0.5">{acc.accountNumber}</p>
                        </div>
                        <span className="text-[8px] font-black uppercase text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">RTP Enabled</span>
                      </div>
                    ))
                 ) : (
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-800 text-center">
                      <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">No verified external accounts found</p>
                    </div>
                 )}
              </div>

              <div className="flex gap-4">
                 <button className="flex-1 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all border border-zinc-800 flex items-center justify-center gap-3">
                   <ExternalLink size={18} />
                   Open Documents
                 </button>
                 <button 
                  onClick={() => handleSendFunds(selectedPartner)}
                  className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl"
                 >
                   Send Disbursement
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Add <span className="text-blue-500 not-italic">Partner</span></h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">KYC/KYB Initialization</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-zinc-600 hover:text-white"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Entity Name</label>
                <input 
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                  placeholder="Legal Company Name"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-xl py-4 px-4 text-white font-bold outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Treasury Email</label>
                <input 
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                  placeholder="treasury@partner.io"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500/50 rounded-xl py-4 px-4 text-white font-bold outline-none transition-all"
                />
              </div>

              <button 
                onClick={registerPartner}
                disabled={connecting || !newPartner.name}
                className="w-full mt-4 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-900/30"
              >
                {connecting ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                <span>{connecting ? 'Dispatching Handshake...' : 'Register Entity'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Counterparties;
