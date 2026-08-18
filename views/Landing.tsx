// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Landing.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Cpu, Sparkles, ArrowRight, Loader2, ChevronDown, 
  ShieldCheck, Globe, Activity, Layers, Database, Lock, Eye, Building2, BarChart3, Radio, RefreshCw,
  BrainCircuit, Network, Server, Fingerprint, Key, Wallet, FileText, Zap, 
  ChevronLeft, GitPullRequest, Box, Code, ChevronRight, Shield, MessageSquare, Plus, Info, 
  ArrowUpRight, FileCode, Terminal, ArrowRightLeft, Bitcoin, Landmark, Briefcase, Gavel, 
  Workflow, Microscope, Telescope, Radar, Compass, Crown, Star
} from 'lucide-react';
import { apiClient } from '../services/api';
import { useAppTier } from '../App';

// Landing Page Components
import NexusNode from './landing/NexusNode';
import IntelligenceAlpha from './landing/IntelligenceAlpha';
import SystemFabric from './landing/SystemFabric';
import RegistryVault from './landing/RegistryVault';
import PrivacyManifesto from './landing/PrivacyManifesto';
import AssetFoundry from './landing/AssetFoundry';
import QuantumCompute from './landing/QuantumCompute';
import LiquidityMesh from './landing/LiquidityMesh';
import EncryptionProtocol from './landing/EncryptionProtocol';
import OracleAuthority from './landing/OracleAuthority';

const FEATURE_CARDS = [
  { id: 1, title: "Neural Parity", desc: "Real-time ledger consensus across 1,200 nodes with zero-drift synchronization.", icon: Fingerprint, color: "blue", img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" },
  { id: 2, title: "Quantum Oracle", desc: "Predictive treasury drift detection using qubit-stabilized neural forecasting models.", icon: Cpu, color: "purple", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2872&auto=format&fit=crop" },
  { id: 3, title: "Liquidity Mesh", desc: "High-velocity disbursement fabrics optimized for sub-millisecond M2M settlement.", icon: Network, color: "emerald", img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2570&auto=format&fit=crop" },
  { id: 4, title: "Sovereign ID", desc: "Encapsulated identity vault utilizing RSA-OAEP-4096 and rotating high-entropy seeds.", icon: Lock, color: "rose", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2546&auto=format&fit=crop" },
  { id: 5, title: "Foundry Sync", desc: "Global distribution node Map with proximity-optimized gateway handshakes.", icon: Globe, color: "cyan", img: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=2832&auto=format&fit=crop" }
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { tier } = useAppTier();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoAccess = async () => {
    if (isDemoLoading) return;
    setIsDemoLoading(true);
    try {
      const { success } = await apiClient.auth.login('alex', 'password123');
      if (success) {
        window.dispatchEvent(new Event('auth-update'));
        navigate('/overview');
      }
    } catch (err) {
      console.error("Handshake failed.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const nextFeature = () => setActiveFeatureIndex(p => (p + 1) % FEATURE_CARDS.length);
  const prevFeature = () => setActiveFeatureIndex(p => (p - 1 + FEATURE_CARDS.length) % FEATURE_CARDS.length);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden relative selection:bg-blue-600/30 selection:text-white">
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_60%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* INSTITUTIONAL GRADE HEADER */}
      <nav className={`fixed top-0 left-0 w-full z-[100] px-10 py-6 flex justify-between items-center transition-all duration-700 ${scrollY > 50 ? 'backdrop-blur-3xl bg-black/90 border-b border-white/5 py-4 shadow-2xl' : 'bg-transparent'}`}>
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-6 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 shadow-2xl border border-zinc-900 ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
              <Landmark size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">AIBanking<span className="text-blue-500 not-italic">.dev</span></h1>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${tier === 'ENTERPRISE' ? 'text-blue-400 border-blue-500/30 bg-blue-500/5' : 'text-zinc-600 border-zinc-800'}`}>
                  {tier}
                </span>
              </div>
              <p className="text-[8px] uppercase tracking-[0.6em] font-black text-zinc-600 mt-1">Institutional Consensus</p>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-10">
            <MegaNavItem label="Global Core" items={[
              { icon: Landmark, title: "Treasury Hub", desc: "Enterprise Liquidity Mesh.", to: "/protocol/treasury" },
              { icon: ArrowRightLeft, title: "Swift Handshake", desc: "Cross-border settlement.", to: "/payments" },
              { icon: Briefcase, title: "Corporate Trust", desc: "Managed asset custody.", to: "/institutional/trust" }
            ]} />
            <MegaNavItem label="Intelligence" restricted items={[
              { icon: BrainCircuit, title: "Neural Oracle", desc: "Predictive Alpha signals.", to: "/oracle" },
              { icon: Microscope, title: "Drift Audit", desc: "Ledger anomaly detection.", to: "/intelligence/drift" },
              { icon: Radar, title: "Market Polling", desc: "Sentiment analysis v4.", to: "/intelligence/sentiment" }
            ]} />
            <MegaNavItem label="Infrastructure" restricted items={[
              { icon: Network, title: "Mesh Fabric", desc: "Global node distribution.", to: "/connectivity" },
              { icon: ShieldCheck, title: "RSA-4096 Gate", desc: "Military grade encryption.", to: "/protocol/rsa-oaep" },
              { icon: Code, title: "API Registry", desc: "FDX standard integration.", to: "/documentation" }
            ]} />
            <MegaNavItem label="Digital Assets" items={[
              { icon: Bitcoin, title: "Ledger Foundry", desc: "Asset synthesis node.", to: "/crypt" },
              { icon: Telescope, title: "Chain Explorer", desc: "Real-time block audit.", to: "/network/explorer" },
              { icon: Zap, title: "Flash Liquidity", desc: "Atomic swap protocols.", to: "/protocol/flash" }
            ]} />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/login')} className="hidden md:block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors">Client Terminal</button>
          <button onClick={handleDemoAccess} className={`px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center gap-4 shadow-xl group active:scale-95 border ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white border-blue-400/20 hover:bg-blue-500 shadow-blue-900/30' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'}`}>
            {isDemoLoading ? <Loader2 size={14} className="animate-spin" /> : tier === 'ENTERPRISE' ? <Crown size={14} className="group-hover:scale-125 transition-transform" /> : <Star size={14} className="group-hover:scale-125 transition-transform" />}
            Connect {tier === 'ENTERPRISE' ? 'High Tier' : 'Standard'} Node
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center px-10 pt-40 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop" className="w-full h-full object-cover blur-[140px] scale-110" alt="Liquid Space" />
        </div>

        <div className="relative z-10 space-y-16">
          <div className="inline-flex items-center gap-4 px-10 py-4 bg-blue-600/10 border border-blue-600/20 rounded-full animate-in zoom-in-95 duration-1000 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]"></div>
            <Activity size={18} className="text-blue-500" />
            <span className="text-[12px] font-black uppercase tracking-[0.8em] text-blue-500">{tier}_PROTOCOL_STABLE</span>
          </div>

          <h1 className="text-[9rem] lg:text-[14rem] font-black italic tracking-tighter uppercase leading-[0.7] mb-12 drop-shadow-2xl">
            {tier === 'ENTERPRISE' ? 'Apex' : 'Unified'} <br /><span className="text-blue-600 not-italic decoration-blue-900/40 underline-offset-[30px] underline decoration-[20px]">Intelligence</span>
          </h1>

          <p className="text-zinc-500 text-3xl lg:text-4xl font-bold italic max-w-6xl mx-auto mb-16 leading-relaxed">
            "The undisputed interface for <span className="text-white">autonomous corporate treasury</span>. Route neural instructions through the global mesh with {tier === 'ENTERPRISE' ? '0.0004ms' : '2.1ms'} latency."
          </p>

          <div className="flex flex-wrap justify-center gap-10 pt-10">
            <button 
              onClick={handleDemoAccess} 
              className="px-16 py-8 bg-white text-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.6em] flex items-center gap-8 hover:bg-blue-600 hover:text-white transition-all shadow-[0_40px_80px_rgba(255,255,255,0.1)] group active:scale-95"
            >
              {isDemoLoading ? <Loader2 size={24} className="animate-spin" /> : <span>Start {tier === 'ENTERPRISE' ? 'Enterprise' : 'Free'} Drive</span>}
              <ArrowRight size={24} className="group-hover:translate-x-4 transition-transform duration-700" />
            </button>
            <button onClick={() => navigate('/documentation')} className="px-16 py-8 bg-zinc-950 border border-zinc-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.6em] flex items-center gap-8 hover:border-blue-600 transition-all shadow-2xl group active:scale-95">
              <FileCode size={24} className="text-blue-500" />
              Manual_v6.5
            </button>
          </div>
        </div>
        <div className="mt-40 animate-bounce opacity-20"><ChevronDown size={64} /></div>
      </section>

      {/* FEATURE SHUFFLE */}
      <section className="relative z-10 py-60 px-10 bg-zinc-950/20">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
               <div className="space-y-6">
                  <h3 className="text-blue-500 font-black text-xs uppercase tracking-[0.8em]">Endless Feature Stack</h3>
                  <h2 className="text-8xl lg:text-[10rem] font-black italic text-white tracking-tighter uppercase leading-[0.85]">Infinite <br /> <span className="text-blue-600 not-italic">Capabilities</span></h2>
               </div>
               <p className="text-zinc-500 text-2xl font-bold leading-relaxed italic max-w-2xl">
                 "Our architectural layers are infinite. Swipe through the core protocols that define the future of sovereign digital wealth management."
               </p>
               <div className="flex gap-8">
                  <button onClick={prevFeature} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"><ChevronLeft size={32} /></button>
                  <button onClick={nextFeature} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"><ChevronRight size={32} /></button>
               </div>
            </div>

            <div className="relative h-[800px] flex items-center justify-center">
               {FEATURE_CARDS.map((card, i) => {
                 const isActive = activeFeatureIndex === i;
                 const isPrev = (activeFeatureIndex - 1 + FEATURE_CARDS.length) % FEATURE_CARDS.length === i;
                 const isNext = (activeFeatureIndex + 1) % FEATURE_CARDS.length === i;
                 let offset = isActive ? 0 : isNext ? 80 : isPrev ? -80 : 160;
                 let opacity = isActive ? 1 : isNext || isPrev ? 0.4 : 0;
                 let scale = isActive ? 1 : 0.8;
                 let zIndex = isActive ? 50 : 30;

                 return (
                   <div 
                     key={card.id}
                     className="absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                     style={{ transform: `translateX(${offset}px) scale(${scale})`, opacity, zIndex }}
                   >
                     <div className="w-full h-full bg-zinc-950 border border-zinc-900 rounded-[5rem] overflow-hidden shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative group">
                        <img src={card.img} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-[3s]" alt={card.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        <div className="absolute bottom-16 left-16 right-16 space-y-8">
                           <div className={`p-8 bg-white/10 text-white rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-xl inline-block w-20 h-20`}>
                              <card.icon size={40} />
                           </div>
                           <div className="space-y-4">
                              <h4 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">{card.title}</h4>
                              <p className="text-zinc-400 text-xl font-bold leading-relaxed italic pr-10">"{card.desc}"</p>
                           </div>
                        </div>
                     </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </section>

      {/* DEEP LEDGER SECTIONS */}
      <NexusNode />
      <IntelligenceAlpha />
      <SystemFabric />
      <RegistryVault />
      <PrivacyManifesto />
      <AssetFoundry />
      <QuantumCompute />
      <LiquidityMesh />
      <EncryptionProtocol />
      <OracleAuthority />

      {/* CORPORATE MEGA FOOTER */}
      <footer className="relative z-10 bg-black pt-80 pb-40 px-10 border-t border-zinc-900">
         <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-20 mb-60">
               <div className="col-span-2 space-y-12">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border-4 border-zinc-900 shadow-2xl">
                      <Landmark size={40} className="text-black" />
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">AIBanking<span className="text-blue-500 not-italic">.dev</span></h2>
                  </div>
                  <p className="text-zinc-500 text-xl font-bold italic leading-relaxed max-w-md">
                    "The undisputed leader in neural treasury automation and institutional mesh fabrics. Verified 2026."
                  </p>
                  <div className="flex gap-8">
                     <SocialIcon icon={Globe} /><SocialIcon icon={Shield} /><SocialIcon icon={Zap} /><SocialIcon icon={MessageSquare} />
                  </div>
               </div>
               
               <FooterColumn title="Foundation" links={[
                 { l: 'System Overview', to: '/overview' },
                 { l: 'Network Connectivity', to: '/connectivity' },
                 { l: 'Sovereign Nodes', to: '/protocol/nodes' },
                 { l: 'Registry Protocol', to: '/protocol/registry' },
                 { l: 'Identity Handshake', to: '/protocol/handshake' },
                 { l: 'Institutional SLA', to: '/protocol/sla' },
                 { l: 'Genesis Archive', to: '/network/archive' }
               ]} />
               <FooterColumn title="Protocols" links={[
                 { l: 'FDX v6.5 Standard', to: '/protocol/fdx' },
                 { l: 'RSA-OAEP-4096', to: '/protocol/rsa' },
                 { l: 'Subspace Settlement', to: '/protocol/settlement' },
                 { l: 'M2M Consensus', to: '/protocol/m2m' },
                 { l: 'Zero-Knowledge Vaults', to: '/protocol/zk' },
                 { l: 'Layer 2 Fabrics', to: '/protocol/l2' },
                 { l: 'Hard Consensus', to: '/protocol/consensus' }
               ]} />
               <FooterColumn title="Intelligence" links={[
                 { l: 'Neural Advisor', to: '/advisor' },
                 { l: 'Predictive Alpha', to: '/intelligence/alpha' },
                 { l: 'Drift Analytics', to: '/intelligence/drift' },
                 { l: 'Sentiment Matrix', to: '/intelligence/sentiment' },
                 { l: 'Oracle Simulations', to: '/oracle' },
                 { l: 'Entropy Rotation', to: '/intelligence/entropy' },
                 { l: 'Risk Thresholds', to: '/intelligence/risk' }
               ]} />
               <FooterColumn title="Compliance" links={[
                 { l: 'Privacy Manifesto', to: '/manifesto' },
                 { l: 'Audit Vault', to: '/vault' },
                 { l: 'Regulatory Handshake', to: '/institutional/reg' },
                 { l: 'KYC Identity Core', to: '/institutional/kyc' },
                 { l: 'Asset Sanctions', to: '/institutional/sanctions' },
                 { l: 'Transparent Ledger', to: '/institutional/ledger' },
                 { l: 'ESG Carbon Audit', to: '/sustainability' }
               ]} />
            </div>

            <div className="pt-20 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-12">
               <div className="flex flex-wrap justify-center md:justify-start gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                  <button onClick={() => navigate('/manifesto')} className="hover:text-white transition-colors">Manifesto</button>
                  <button onClick={() => navigate('/documentation')} className="hover:text-white transition-colors">Manual Registry</button>
                  <button onClick={() => navigate('/airdrop')} className="hover:text-white transition-colors">Genesis Airdrop</button>
                  <button onClick={() => navigate('/documentation')} className="hover:text-white transition-colors">API Docs</button>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-800">Citibank Demo Business Inc • aibanking.dev Protocol</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

const MegaNavItem = ({ label, items, restricted }: { label: string, items: any[], restricted?: boolean }) => {
  const { tier } = useAppTier();
  const isLocked = restricted && tier === 'STANDARD';

  return (
    <div className="group relative py-4">
      <button className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 group-hover:text-white transition-colors flex items-center gap-3">
        {label} <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-500" />
      </button>
      <div className="absolute top-full left-0 w-[520px] bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-700 shadow-[0_100px_200px_rgba(0,0,0,0.9)] space-y-8 z-[110] backdrop-blur-3xl">
        <div className="grid grid-cols-1 gap-8">
          {items.map((item, i) => (
            <Link key={i} to={isLocked ? '#' : item.to} className={`flex gap-8 items-start transition-transform group/link ${isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:translate-x-4'}`}>
              <div className="p-4 bg-zinc-900 rounded-2xl text-zinc-600 group-hover/link:text-blue-500 group-hover/link:bg-blue-500/10 transition-all border border-transparent group-hover/link:border-blue-500/20 shadow-xl">
                <item.icon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-black text-white uppercase italic tracking-widest leading-none">{item.title}</h4>
                  {isLocked && <Lock size={12} className="text-zinc-600" />}
                </div>
                <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">{isLocked ? 'ENTERPRISE_PROTOCOL_LOCKED' : item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        {isLocked && (
          <div className="pt-4 border-t border-zinc-900">
             <button onClick={() => window.location.reload()} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all">Upgrade to Enterprise</button>
          </div>
        )}
        <div className="pt-8 border-t border-zinc-900">
           <Link to="/documentation" className="flex items-center justify-between group/all">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">View Full Map</span>
              <ChevronRight size={14} className="text-zinc-800 group-hover/all:text-blue-500 group-hover/all:translate-x-2 transition-all" />
           </Link>
        </div>
      </div>
    </div>
  );
};

const FooterColumn = ({ title, links }: { title: string, links: {l: string, to: string}[] }) => (
  <div className="space-y-12">
     <h4 className="text-[14px] font-black uppercase tracking-[0.6em] text-white italic">{title}</h4>
     <ul className="space-y-6">
        {links.map((link, i) => (
          <li key={i}>
            <Link to={link.to} className="text-[11px] font-bold text-zinc-600 hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">{link.l}</Link>
          </li>
        ))}
     </ul>
  </div>
);

const SocialIcon = ({ icon: Icon }: any) => (
  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white hover:border-blue-500 transition-all cursor-pointer shadow-xl active:scale-95">
    <Icon size={24} />
  </div>
);

export default Landing;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Landing.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Cpu, Sparkles, ArrowRight, Loader2, ChevronDown, 
  ShieldCheck, Globe, Activity, Layers, Database, Lock, Eye, Building2, BarChart3, Radio, RefreshCw,
  BrainCircuit, Network, Server, Fingerprint, Key, Wallet, FileText, Zap, 
  ChevronLeft, GitPullRequest, Box, Code, ChevronRight, Shield, MessageSquare, Plus, Info, 
  ArrowUpRight, FileCode, Terminal, ArrowRightLeft, Bitcoin, Landmark, Briefcase, Gavel, 
  Workflow, Microscope, Telescope, Radar, Compass, Crown, Star
} from 'lucide-react';
import { apiClient } from '../services/api';
import { useAppTier } from '../App';

// Landing Page Components
import NexusNode from './landing/NexusNode';
import IntelligenceAlpha from './landing/IntelligenceAlpha';
import SystemFabric from './landing/SystemFabric';
import RegistryVault from './landing/RegistryVault';
import PrivacyManifesto from './landing/PrivacyManifesto';
import AssetFoundry from './landing/AssetFoundry';
import QuantumCompute from './landing/QuantumCompute';
import LiquidityMesh from './landing/LiquidityMesh';
import EncryptionProtocol from './landing/EncryptionProtocol';
import OracleAuthority from './landing/OracleAuthority';

const FEATURE_CARDS = [
  { id: 1, title: "Neural Parity", desc: "Real-time ledger consensus across 1,200 nodes with zero-drift synchronization.", icon: Fingerprint, color: "blue", img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" },
  { id: 2, title: "Quantum Oracle", desc: "Predictive treasury drift detection using qubit-stabilized neural forecasting models.", icon: Cpu, color: "purple", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2872&auto=format&fit=crop" },
  { id: 3, title: "Liquidity Mesh", desc: "High-velocity disbursement fabrics optimized for sub-millisecond M2M settlement.", icon: Network, color: "emerald", img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2570&auto=format&fit=crop" },
  { id: 4, title: "Sovereign ID", desc: "Encapsulated identity vault utilizing RSA-OAEP-4096 and rotating high-entropy seeds.", icon: Lock, color: "rose", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2546&auto=format&fit=crop" },
  { id: 5, title: "Foundry Sync", desc: "Global distribution node Map with proximity-optimized gateway handshakes.", icon: Globe, color: "cyan", img: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=2832&auto=format&fit=crop" }
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { tier } = useAppTier();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoAccess = async () => {
    if (isDemoLoading) return;
    setIsDemoLoading(true);
    try {
      const { success } = await apiClient.auth.login('alex', 'password123');
      if (success) {
        window.dispatchEvent(new Event('auth-update'));
        navigate('/overview');
      }
    } catch (err) {
      console.error("Handshake failed.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const nextFeature = () => setActiveFeatureIndex(p => (p + 1) % FEATURE_CARDS.length);
  const prevFeature = () => setActiveFeatureIndex(p => (p - 1 + FEATURE_CARDS.length) % FEATURE_CARDS.length);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden relative selection:bg-blue-600/30 selection:text-white">
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_60%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* INSTITUTIONAL GRADE HEADER */}
      <nav className={`fixed top-0 left-0 w-full z-[100] px-10 py-6 flex justify-between items-center transition-all duration-700 ${scrollY > 50 ? 'backdrop-blur-3xl bg-black/90 border-b border-white/5 py-4 shadow-2xl' : 'bg-transparent'}`}>
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-6 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 shadow-2xl border border-zinc-900 ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
              <Landmark size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">AIBanking<span className="text-blue-500 not-italic">.dev</span></h1>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${tier === 'ENTERPRISE' ? 'text-blue-400 border-blue-500/30 bg-blue-500/5' : 'text-zinc-600 border-zinc-800'}`}>
                  {tier}
                </span>
              </div>
              <p className="text-[8px] uppercase tracking-[0.6em] font-black text-zinc-600 mt-1">Institutional Consensus</p>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-10">
            <MegaNavItem label="Global Core" items={[
              { icon: Landmark, title: "Treasury Hub", desc: "Enterprise Liquidity Mesh.", to: "/protocol/treasury" },
              { icon: ArrowRightLeft, title: "Swift Handshake", desc: "Cross-border settlement.", to: "/payments" },
              { icon: Briefcase, title: "Corporate Trust", desc: "Managed asset custody.", to: "/institutional/trust" }
            ]} />
            <MegaNavItem label="Intelligence" restricted items={[
              { icon: BrainCircuit, title: "Neural Oracle", desc: "Predictive Alpha signals.", to: "/oracle" },
              { icon: Microscope, title: "Drift Audit", desc: "Ledger anomaly detection.", to: "/intelligence/drift" },
              { icon: Radar, title: "Market Polling", desc: "Sentiment analysis v4.", to: "/intelligence/sentiment" }
            ]} />
            <MegaNavItem label="Infrastructure" restricted items={[
              { icon: Network, title: "Mesh Fabric", desc: "Global node distribution.", to: "/connectivity" },
              { icon: ShieldCheck, title: "RSA-4096 Gate", desc: "Military grade encryption.", to: "/protocol/rsa-oaep" },
              { icon: Code, title: "API Registry", desc: "FDX standard integration.", to: "/documentation" }
            ]} />
            <MegaNavItem label="Digital Assets" items={[
              { icon: Bitcoin, title: "Ledger Foundry", desc: "Asset synthesis node.", to: "/crypt" },
              { icon: Telescope, title: "Chain Explorer", desc: "Real-time block audit.", to: "/network/explorer" },
              { icon: Zap, title: "Flash Liquidity", desc: "Atomic swap protocols.", to: "/protocol/flash" }
            ]} />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/login')} className="hidden md:block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors">Client Terminal</button>
          <button onClick={handleDemoAccess} className={`px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center gap-4 shadow-xl group active:scale-95 border ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white border-blue-400/20 hover:bg-blue-500 shadow-blue-900/30' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'}`}>
            {isDemoLoading ? <Loader2 size={14} className="animate-spin" /> : tier === 'ENTERPRISE' ? <Crown size={14} className="group-hover:scale-125 transition-transform" /> : <Star size={14} className="group-hover:scale-125 transition-transform" />}
            Connect {tier === 'ENTERPRISE' ? 'High Tier' : 'Standard'} Node
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center px-10 pt-40 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop" className="w-full h-full object-cover blur-[140px] scale-110" alt="Liquid Space" />
        </div>

        <div className="relative z-10 space-y-16">
          <div className="inline-flex items-center gap-4 px-10 py-4 bg-blue-600/10 border border-blue-600/20 rounded-full animate-in zoom-in-95 duration-1000 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]"></div>
            <Activity size={18} className="text-blue-500" />
            <span className="text-[12px] font-black uppercase tracking-[0.8em] text-blue-500">{tier}_PROTOCOL_STABLE</span>
          </div>

          <h1 className="text-[9rem] lg:text-[14rem] font-black italic tracking-tighter uppercase leading-[0.7] mb-12 drop-shadow-2xl">
            {tier === 'ENTERPRISE' ? 'Apex' : 'Unified'} <br /><span className="text-blue-600 not-italic decoration-blue-900/40 underline-offset-[30px] underline decoration-[20px]">Intelligence</span>
          </h1>

          <p className="text-zinc-500 text-3xl lg:text-4xl font-bold italic max-w-6xl mx-auto mb-16 leading-relaxed">
            "The undisputed interface for <span className="text-white">autonomous corporate treasury</span>. Route neural instructions through the global mesh with {tier === 'ENTERPRISE' ? '0.0004ms' : '2.1ms'} latency."
          </p>

          <div className="flex flex-wrap justify-center gap-10 pt-10">
            <button 
              onClick={handleDemoAccess} 
              className="px-16 py-8 bg-white text-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.6em] flex items-center gap-8 hover:bg-blue-600 hover:text-white transition-all shadow-[0_40px_80px_rgba(255,255,255,0.1)] group active:scale-95"
            >
              {isDemoLoading ? <Loader2 size={24} className="animate-spin" /> : <span>Start {tier === 'ENTERPRISE' ? 'Enterprise' : 'Free'} Drive</span>}
              <ArrowRight size={24} className="group-hover:translate-x-4 transition-transform duration-700" />
            </button>
            <button onClick={() => navigate('/documentation')} className="px-16 py-8 bg-zinc-950 border border-zinc-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.6em] flex items-center gap-8 hover:border-blue-600 transition-all shadow-2xl group active:scale-95">
              <FileCode size={24} className="text-blue-500" />
              Manual_v6.5
            </button>
          </div>
        </div>
        <div className="mt-40 animate-bounce opacity-20"><ChevronDown size={64} /></div>
      </section>

      {/* FEATURE SHUFFLE */}
      <section className="relative z-10 py-60 px-10 bg-zinc-950/20">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
               <div className="space-y-6">
                  <h3 className="text-blue-500 font-black text-xs uppercase tracking-[0.8em]">Endless Feature Stack</h3>
                  <h2 className="text-8xl lg:text-[10rem] font-black italic text-white tracking-tighter uppercase leading-[0.85]">Infinite <br /> <span className="text-blue-600 not-italic">Capabilities</span></h2>
               </div>
               <p className="text-zinc-500 text-2xl font-bold leading-relaxed italic max-w-2xl">
                 "Our architectural layers are infinite. Swipe through the core protocols that define the future of sovereign digital wealth management."
               </p>
               <div className="flex gap-8">
                  <button onClick={prevFeature} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"><ChevronLeft size={32} /></button>
                  <button onClick={nextFeature} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"><ChevronRight size={32} /></button>
               </div>
            </div>

            <div className="relative h-[800px] flex items-center justify-center">
               {FEATURE_CARDS.map((card, i) => {
                 const isActive = activeFeatureIndex === i;
                 const isPrev = (activeFeatureIndex - 1 + FEATURE_CARDS.length) % FEATURE_CARDS.length === i;
                 const isNext = (activeFeatureIndex + 1) % FEATURE_CARDS.length === i;
                 let offset = isActive ? 0 : isNext ? 80 : isPrev ? -80 : 160;
                 let opacity = isActive ? 1 : isNext || isPrev ? 0.4 : 0;
                 let scale = isActive ? 1 : 0.8;
                 let zIndex = isActive ? 50 : 30;

                 return (
                   <div 
                     key={card.id}
                     className="absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                     style={{ transform: `translateX(${offset}px) scale(${scale})`, opacity, zIndex }}
                   >
                     <div className="w-full h-full bg-zinc-950 border border-zinc-900 rounded-[5rem] overflow-hidden shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative group">
                        <img src={card.img} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-[3s]" alt={card.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        <div className="absolute bottom-16 left-16 right-16 space-y-8">
                           <div className={`p-8 bg-white/10 text-white rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-xl inline-block w-20 h-20`}>
                              <card.icon size={40} />
                           </div>
                           <div className="space-y-4">
                              <h4 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">{card.title}</h4>
                              <p className="text-zinc-400 text-xl font-bold leading-relaxed italic pr-10">"{card.desc}"</p>
                           </div>
                        </div>
                     </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </section>

      {/* DEEP LEDGER SECTIONS */}
      <NexusNode />
      <IntelligenceAlpha />
      <SystemFabric />
      <RegistryVault />
      <PrivacyManifesto />
      <AssetFoundry />
      <QuantumCompute />
      <LiquidityMesh />
      <EncryptionProtocol />
      <OracleAuthority />

      {/* CORPORATE MEGA FOOTER */}
      <footer className="relative z-10 bg-black pt-80 pb-40 px-10 border-t border-zinc-900">
         <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-20 mb-60">
               <div className="col-span-2 space-y-12">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border-4 border-zinc-900 shadow-2xl">
                      <Landmark size={40} className="text-black" />
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">AIBanking<span className="text-blue-500 not-italic">.dev</span></h2>
                  </div>
                  <p className="text-zinc-500 text-xl font-bold italic leading-relaxed max-w-md">
                    "The undisputed leader in neural treasury automation and institutional mesh fabrics. Verified 2026."
                  </p>
                  <div className="flex gap-8">
                     <SocialIcon icon={Globe} /><SocialIcon icon={Shield} /><SocialIcon icon={Zap} /><SocialIcon icon={MessageSquare} />
                  </div>
               </div>
               
               <FooterColumn title="Foundation" links={[
                 { l: 'System Overview', to: '/overview' },
                 { l: 'Network Connectivity', to: '/connectivity' },
                 { l: 'Sovereign Nodes', to: '/protocol/nodes' },
                 { l: 'Registry Protocol', to: '/protocol/registry' },
                 { l: 'Identity Handshake', to: '/protocol/handshake' },
                 { l: 'Institutional SLA', to: '/protocol/sla' },
                 { l: 'Genesis Archive', to: '/network/archive' }
               ]} />
               <FooterColumn title="Protocols" links={[
                 { l: 'FDX v6.5 Standard', to: '/protocol/fdx' },
                 { l: 'RSA-OAEP-4096', to: '/protocol/rsa' },
                 { l: 'Subspace Settlement', to: '/protocol/settlement' },
                 { l: 'M2M Consensus', to: '/protocol/m2m' },
                 { l: 'Zero-Knowledge Vaults', to: '/protocol/zk' },
                 { l: 'Layer 2 Fabrics', to: '/protocol/l2' },
                 { l: 'Hard Consensus', to: '/protocol/consensus' }
               ]} />
               <FooterColumn title="Intelligence" links={[
                 { l: 'Neural Advisor', to: '/advisor' },
                 { l: 'Predictive Alpha', to: '/intelligence/alpha' },
                 { l: 'Drift Analytics', to: '/intelligence/drift' },
                 { l: 'Sentiment Matrix', to: '/intelligence/sentiment' },
                 { l: 'Oracle Simulations', to: '/oracle' },
                 { l: 'Entropy Rotation', to: '/intelligence/entropy' },
                 { l: 'Risk Thresholds', to: '/intelligence/risk' }
               ]} />
               <FooterColumn title="Compliance" links={[
                 { l: 'Privacy Manifesto', to: '/manifesto' },
                 { l: 'Audit Vault', to: '/vault' },
                 { l: 'Regulatory Handshake', to: '/institutional/reg' },
                 { l: 'KYC Identity Core', to: '/institutional/kyc' },
                 { l: 'Asset Sanctions', to: '/institutional/sanctions' },
                 { l: 'Transparent Ledger', to: '/institutional/ledger' },
                 { l: 'ESG Carbon Audit', to: '/sustainability' }
               ]} />
            </div>

            <div className="pt-20 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-12">
               <div className="flex flex-wrap justify-center md:justify-start gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                  <button onClick={() => navigate('/manifesto')} className="hover:text-white transition-colors">Manifesto</button>
                  <button onClick={() => navigate('/documentation')} className="hover:text-white transition-colors">Manual Registry</button>
                  <button onClick={() => navigate('/airdrop')} className="hover:text-white transition-colors">Genesis Airdrop</button>
                  <button onClick={() => navigate('/documentation')} className="hover:text-white transition-colors">API Docs</button>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-800">Citibank Demo Business Inc • aibanking.dev Protocol</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

const MegaNavItem = ({ label, items, restricted }: { label: string, items: any[], restricted?: boolean }) => {
  const { tier } = useAppTier();
  const isLocked = restricted && tier === 'STANDARD';

  return (
    <div className="group relative py-4">
      <button className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 group-hover:text-white transition-colors flex items-center gap-3">
        {label} <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-500" />
      </button>
      <div className="absolute top-full left-0 w-[520px] bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-700 shadow-[0_100px_200px_rgba(0,0,0,0.9)] space-y-8 z-[110] backdrop-blur-3xl">
        <div className="grid grid-cols-1 gap-8">
          {items.map((item, i) => (
            <Link key={i} to={isLocked ? '#' : item.to} className={`flex gap-8 items-start transition-transform group/link ${isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:translate-x-4'}`}>
              <div className="p-4 bg-zinc-900 rounded-2xl text-zinc-600 group-hover/link:text-blue-500 group-hover/link:bg-blue-500/10 transition-all border border-transparent group-hover/link:border-blue-500/20 shadow-xl">
                <item.icon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-black text-white uppercase italic tracking-widest leading-none">{item.title}</h4>
                  {isLocked && <Lock size={12} className="text-zinc-600" />}
                </div>
                <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">{isLocked ? 'ENTERPRISE_PROTOCOL_LOCKED' : item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        {isLocked && (
          <div className="pt-4 border-t border-zinc-900">
             <button onClick={() => window.location.reload()} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all">Upgrade to Enterprise</button>
          </div>
        )}
        <div className="pt-8 border-t border-zinc-900">
           <Link to="/documentation" className="flex items-center justify-between group/all">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">View Full Map</span>
              <ChevronRight size={14} className="text-zinc-800 group-hover/all:text-blue-500 group-hover/all:translate-x-2 transition-all" />
           </Link>
        </div>
      </div>
    </div>
  );
};

const FooterColumn = ({ title, links }: { title: string, links: {l: string, to: string}[] }) => (
  <div className="space-y-12">
     <h4 className="text-[14px] font-black uppercase tracking-[0.6em] text-white italic">{title}</h4>
     <ul className="space-y-6">
        {links.map((link, i) => (
          <li key={i}>
            <Link to={link.to} className="text-[11px] font-bold text-zinc-600 hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">{link.l}</Link>
          </li>
        ))}
     </ul>
  </div>
);

const SocialIcon = ({ icon: Icon }: any) => (
  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white hover:border-blue-500 transition-all cursor-pointer shadow-xl active:scale-95">
    <Icon size={24} />
  </div>
);

export default Landing;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Landing.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Cpu, Sparkles, ArrowRight, Loader2, ChevronDown, 
  ShieldCheck, Globe, Activity, Layers, Database, Lock, Eye, Building2, BarChart3, Radio, RefreshCw,
  BrainCircuit, Network, Server, Fingerprint, Key, Wallet, FileText, Zap, 
  ChevronLeft, GitPullRequest, Box, Code, ChevronRight, Shield, MessageSquare, Plus, Info, 
  ArrowUpRight, FileCode, Terminal, ArrowRightLeft, Bitcoin, Landmark, Briefcase, Gavel, 
  Workflow, Microscope, Telescope, Radar, Compass, Crown, Star
} from 'lucide-react';
import { apiClient } from '../services/api';
import { useAppTier } from '../App';

// Landing Page Components
import NexusNode from './landing/NexusNode';
import IntelligenceAlpha from './landing/IntelligenceAlpha';
import SystemFabric from './landing/SystemFabric';
import RegistryVault from './landing/RegistryVault';
import PrivacyManifesto from './landing/PrivacyManifesto';
import AssetFoundry from './landing/AssetFoundry';
import QuantumCompute from './landing/QuantumCompute';
import LiquidityMesh from './landing/LiquidityMesh';
import EncryptionProtocol from './landing/EncryptionProtocol';
import OracleAuthority from './landing/OracleAuthority';

const FEATURE_CARDS = [
  { id: 1, title: "Neural Parity", desc: "Real-time ledger consensus across 1,200 nodes with zero-drift synchronization.", icon: Fingerprint, color: "blue", img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" },
  { id: 2, title: "Quantum Oracle", desc: "Predictive treasury drift detection using qubit-stabilized neural forecasting models.", icon: Cpu, color: "purple", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2872&auto=format&fit=crop" },
  { id: 3, title: "Liquidity Mesh", desc: "High-velocity disbursement fabrics optimized for sub-millisecond M2M settlement.", icon: Network, color: "emerald", img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2570&auto=format&fit=crop" },
  { id: 4, title: "Sovereign ID", desc: "Encapsulated identity vault utilizing RSA-OAEP-4096 and rotating high-entropy seeds.", icon: Lock, color: "rose", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2546&auto=format&fit=crop" },
  { id: 5, title: "Foundry Sync", desc: "Global distribution node Map with proximity-optimized gateway handshakes.", icon: Globe, color: "cyan", img: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=2832&auto=format&fit=crop" }
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { tier } = useAppTier();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoAccess = async () => {
    if (isDemoLoading) return;
    setIsDemoLoading(true);
    try {
      const { success } = await apiClient.auth.login('alex', 'password123');
      if (success) {
        window.dispatchEvent(new Event('auth-update'));
        navigate('/overview');
      }
    } catch (err) {
      console.error("Handshake failed.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const nextFeature = () => setActiveFeatureIndex(p => (p + 1) % FEATURE_CARDS.length);
  const prevFeature = () => setActiveFeatureIndex(p => (p - 1 + FEATURE_CARDS.length) % FEATURE_CARDS.length);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden relative selection:bg-blue-600/30 selection:text-white">
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_60%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* INSTITUTIONAL GRADE HEADER */}
      <nav className={`fixed top-0 left-0 w-full z-[100] px-10 py-6 flex justify-between items-center transition-all duration-700 ${scrollY > 50 ? 'backdrop-blur-3xl bg-black/90 border-b border-white/5 py-4 shadow-2xl' : 'bg-transparent'}`}>
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-6 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 shadow-2xl border border-zinc-900 ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
              <Landmark size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">AIBanking<span className="text-blue-500 not-italic">.dev</span></h1>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${tier === 'ENTERPRISE' ? 'text-blue-400 border-blue-500/30 bg-blue-500/5' : 'text-zinc-600 border-zinc-800'}`}>
                  {tier}
                </span>
              </div>
              <p className="text-[8px] uppercase tracking-[0.6em] font-black text-zinc-600 mt-1">Institutional Consensus</p>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-10">
            <MegaNavItem label="Global Core" items={[
              { icon: Landmark, title: "Treasury Hub", desc: "Enterprise Liquidity Mesh.", to: "/protocol/treasury" },
              { icon: ArrowRightLeft, title: "Swift Handshake", desc: "Cross-border settlement.", to: "/payments" },
              { icon: Briefcase, title: "Corporate Trust", desc: "Managed asset custody.", to: "/institutional/trust" }
            ]} />
            <MegaNavItem label="Intelligence" restricted items={[
              { icon: BrainCircuit, title: "Neural Oracle", desc: "Predictive Alpha signals.", to: "/oracle" },
              { icon: Microscope, title: "Drift Audit", desc: "Ledger anomaly detection.", to: "/intelligence/drift" },
              { icon: Radar, title: "Market Polling", desc: "Sentiment analysis v4.", to: "/intelligence/sentiment" }
            ]} />
            <MegaNavItem label="Infrastructure" restricted items={[
              { icon: Network, title: "Mesh Fabric", desc: "Global node distribution.", to: "/connectivity" },
              { icon: ShieldCheck, title: "RSA-4096 Gate", desc: "Military grade encryption.", to: "/protocol/rsa-oaep" },
              { icon: Code, title: "API Registry", desc: "FDX standard integration.", to: "/documentation" }
            ]} />
            <MegaNavItem label="Digital Assets" items={[
              { icon: Bitcoin, title: "Ledger Foundry", desc: "Asset synthesis node.", to: "/crypt" },
              { icon: Telescope, title: "Chain Explorer", desc: "Real-time block audit.", to: "/network/explorer" },
              { icon: Zap, title: "Flash Liquidity", desc: "Atomic swap protocols.", to: "/protocol/flash" }
            ]} />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/login')} className="hidden md:block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors">Client Terminal</button>
          <button onClick={handleDemoAccess} className={`px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center gap-4 shadow-xl group active:scale-95 border ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white border-blue-400/20 hover:bg-blue-500 shadow-blue-900/30' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'}`}>
            {isDemoLoading ? <Loader2 size={14} className="animate-spin" /> : tier === 'ENTERPRISE' ? <Crown size={14} className="group-hover:scale-125 transition-transform" /> : <Star size={14} className="group-hover:scale-125 transition-transform" />}
            Connect {tier === 'ENTERPRISE' ? 'High Tier' : 'Standard'} Node
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center px-10 pt-40 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop" className="w-full h-full object-cover blur-[140px] scale-110" alt="Liquid Space" />
        </div>

        <div className="relative z-10 space-y-16">
          <div className="inline-flex items-center gap-4 px-10 py-4 bg-blue-600/10 border border-blue-600/20 rounded-full animate-in zoom-in-95 duration-1000 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]"></div>
            <Activity size={18} className="text-blue-500" />
            <span className="text-[12px] font-black uppercase tracking-[0.8em] text-blue-500">{tier}_PROTOCOL_STABLE</span>
          </div>

          <h1 className="text-[9rem] lg:text-[14rem] font-black italic tracking-tighter uppercase leading-[0.7] mb-12 drop-shadow-2xl">
            {tier === 'ENTERPRISE' ? 'Apex' : 'Unified'} <br /><span className="text-blue-600 not-italic decoration-blue-900/40 underline-offset-[30px] underline decoration-[20px]">Intelligence</span>
          </h1>

          <p className="text-zinc-500 text-3xl lg:text-4xl font-bold italic max-w-6xl mx-auto mb-16 leading-relaxed">
            "The undisputed interface for <span className="text-white">autonomous corporate treasury</span>. Route neural instructions through the global mesh with {tier === 'ENTERPRISE' ? '0.0004ms' : '2.1ms'} latency."
          </p>

          <div className="flex flex-wrap justify-center gap-10 pt-10">
            <button 
              onClick={handleDemoAccess} 
              className="px-16 py-8 bg-white text-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.6em] flex items-center gap-8 hover:bg-blue-600 hover:text-white transition-all shadow-[0_40px_80px_rgba(255,255,255,0.1)] group active:scale-95"
            >
              {isDemoLoading ? <Loader2 size={24} className="animate-spin" /> : <span>Start {tier === 'ENTERPRISE' ? 'Enterprise' : 'Free'} Drive</span>}
              <ArrowRight size={24} className="group-hover:translate-x-4 transition-transform duration-700" />
            </button>
            <button onClick={() => navigate('/documentation')} className="px-16 py-8 bg-zinc-950 border border-zinc-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.6em] flex items-center gap-8 hover:border-blue-600 transition-all shadow-2xl group active:scale-95">
              <FileCode size={24} className="text-blue-500" />
              Manual_v6.5
            </button>
          </div>
        </div>
        <div className="mt-40 animate-bounce opacity-20"><ChevronDown size={64} /></div>
      </section>

      {/* FEATURE SHUFFLE */}
      <section className="relative z-10 py-60 px-10 bg-zinc-950/20">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
               <div className="space-y-6">
                  <h3 className="text-blue-500 font-black text-xs uppercase tracking-[0.8em]">Endless Feature Stack</h3>
                  <h2 className="text-8xl lg:text-[10rem] font-black italic text-white tracking-tighter uppercase leading-[0.85]">Infinite <br /> <span className="text-blue-600 not-italic">Capabilities</span></h2>
               </div>
               <p className="text-zinc-500 text-2xl font-bold leading-relaxed italic max-w-2xl">
                 "Our architectural layers are infinite. Swipe through the core protocols that define the future of sovereign digital wealth management."
               </p>
               <div className="flex gap-8">
                  <button onClick={prevFeature} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"><ChevronLeft size={32} /></button>
                  <button onClick={nextFeature} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"><ChevronRight size={32} /></button>
               </div>
            </div>

            <div className="relative h-[800px] flex items-center justify-center">
               {FEATURE_CARDS.map((card, i) => {
                 const isActive = activeFeatureIndex === i;
                 const isPrev = (activeFeatureIndex - 1 + FEATURE_CARDS.length) % FEATURE_CARDS.length === i;
                 const isNext = (activeFeatureIndex + 1) % FEATURE_CARDS.length === i;
                 let offset = isActive ? 0 : isNext ? 80 : isPrev ? -80 : 160;
                 let opacity = isActive ? 1 : isNext || isPrev ? 0.4 : 0;
                 let scale = isActive ? 1 : 0.8;
                 let zIndex = isActive ? 50 : 30;

                 return (
                   <div 
                     key={card.id}
                     className="absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                     style={{ transform: `translateX(${offset}px) scale(${scale})`, opacity, zIndex }}
                   >
                     <div className="w-full h-full bg-zinc-950 border border-zinc-900 rounded-[5rem] overflow-hidden shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative group">
                        <img src={card.img} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-[3s]" alt={card.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        <div className="absolute bottom-16 left-16 right-16 space-y-8">
                           <div className={`p-8 bg-white/10 text-white rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-xl inline-block w-20 h-20`}>
                              <card.icon size={40} />
                           </div>
                           <div className="space-y-4">
                              <h4 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">{card.title}</h4>
                              <p className="text-zinc-400 text-xl font-bold leading-relaxed italic pr-10">"{card.desc}"</p>
                           </div>
                        </div>
                     </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </section>

      {/* DEEP LEDGER SECTIONS */}
      <NexusNode />
      <IntelligenceAlpha />
      <SystemFabric />
      <RegistryVault />
      <PrivacyManifesto />
      <AssetFoundry />
      <QuantumCompute />
      <LiquidityMesh />
      <EncryptionProtocol />
      <OracleAuthority />

      {/* CORPORATE MEGA FOOTER */}
      <footer className="relative z-10 bg-black pt-80 pb-40 px-10 border-t border-zinc-900">
         <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-20 mb-60">
               <div className="col-span-2 space-y-12">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border-4 border-zinc-900 shadow-2xl">
                      <Landmark size={40} className="text-black" />
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">AIBanking<span className="text-blue-500 not-italic">.dev</span></h2>
                  </div>
                  <p className="text-zinc-500 text-xl font-bold italic leading-relaxed max-w-md">
                    "The undisputed leader in neural treasury automation and institutional mesh fabrics. Verified 2026."
                  </p>
                  <div className="flex gap-8">
                     <SocialIcon icon={Globe} /><SocialIcon icon={Shield} /><SocialIcon icon={Zap} /><SocialIcon icon={MessageSquare} />
                  </div>
               </div>
               
               <FooterColumn title="Foundation" links={[
                 { l: 'System Overview', to: '/overview' },
                 { l: 'Network Connectivity', to: '/connectivity' },
                 { l: 'Sovereign Nodes', to: '/protocol/nodes' },
                 { l: 'Registry Protocol', to: '/protocol/registry' },
                 { l: 'Identity Handshake', to: '/protocol/handshake' },
                 { l: 'Institutional SLA', to: '/protocol/sla' },
                 { l: 'Genesis Archive', to: '/network/archive' }
               ]} />
               <FooterColumn title="Protocols" links={[
                 { l: 'FDX v6.5 Standard', to: '/protocol/fdx' },
                 { l: 'RSA-OAEP-4096', to: '/protocol/rsa' },
                 { l: 'Subspace Settlement', to: '/protocol/settlement' },
                 { l: 'M2M Consensus', to: '/protocol/m2m' },
                 { l: 'Zero-Knowledge Vaults', to: '/protocol/zk' },
                 { l: 'Layer 2 Fabrics', to: '/protocol/l2' },
                 { l: 'Hard Consensus', to: '/protocol/consensus' }
               ]} />
               <FooterColumn title="Intelligence" links={[
                 { l: 'Neural Advisor', to: '/advisor' },
                 { l: 'Predictive Alpha', to: '/intelligence/alpha' },
                 { l: 'Drift Analytics', to: '/intelligence/drift' },
                 { l: 'Sentiment Matrix', to: '/intelligence/sentiment' },
                 { l: 'Oracle Simulations', to: '/oracle' },
                 { l: 'Entropy Rotation', to: '/intelligence/entropy' },
                 { l: 'Risk Thresholds', to: '/intelligence/risk' }
               ]} />
               <FooterColumn title="Compliance" links={[
                 { l: 'Privacy Manifesto', to: '/manifesto' },
                 { l: 'Audit Vault', to: '/vault' },
                 { l: 'Regulatory Handshake', to: '/institutional/reg' },
                 { l: 'KYC Identity Core', to: '/institutional/kyc' },
                 { l: 'Asset Sanctions', to: '/institutional/sanctions' },
                 { l: 'Transparent Ledger', to: '/institutional/ledger' },
                 { l: 'ESG Carbon Audit', to: '/sustainability' }
               ]} />
            </div>

            <div className="pt-20 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-12">
               <div className="flex flex-wrap justify-center md:justify-start gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                  <button onClick={() => navigate('/manifesto')} className="hover:text-white transition-colors">Manifesto</button>
                  <button onClick={() => navigate('/documentation')} className="hover:text-white transition-colors">Manual Registry</button>
                  <button onClick={() => navigate('/airdrop')} className="hover:text-white transition-colors">Genesis Airdrop</button>
                  <button onClick={() => navigate('/documentation')} className="hover:text-white transition-colors">API Docs</button>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-800">Citibank Demo Business Inc • aibanking.dev Protocol</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

const MegaNavItem = ({ label, items, restricted }: { label: string, items: any[], restricted?: boolean }) => {
  const { tier } = useAppTier();
  const isLocked = restricted && tier === 'STANDARD';

  return (
    <div className="group relative py-4">
      <button className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 group-hover:text-white transition-colors flex items-center gap-3">
        {label} <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-500" />
      </button>
      <div className="absolute top-full left-0 w-[520px] bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-700 shadow-[0_100px_200px_rgba(0,0,0,0.9)] space-y-8 z-[110] backdrop-blur-3xl">
        <div className="grid grid-cols-1 gap-8">
          {items.map((item, i) => (
            <Link key={i} to={isLocked ? '#' : item.to} className={`flex gap-8 items-start transition-transform group/link ${isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:translate-x-4'}`}>
              <div className="p-4 bg-zinc-900 rounded-2xl text-zinc-600 group-hover/link:text-blue-500 group-hover/link:bg-blue-500/10 transition-all border border-transparent group-hover/link:border-blue-500/20 shadow-xl">
                <item.icon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-black text-white uppercase italic tracking-widest leading-none">{item.title}</h4>
                  {isLocked && <Lock size={12} className="text-zinc-600" />}
                </div>
                <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">{isLocked ? 'ENTERPRISE_PROTOCOL_LOCKED' : item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        {isLocked && (
          <div className="pt-4 border-t border-zinc-900">
             <button onClick={() => window.location.reload()} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all">Upgrade to Enterprise</button>
          </div>
        )}
        <div className="pt-8 border-t border-zinc-900">
           <Link to="/documentation" className="flex items-center justify-between group/all">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">View Full Map</span>
              <ChevronRight size={14} className="text-zinc-800 group-hover/all:text-blue-500 group-hover/all:translate-x-2 transition-all" />
           </Link>
        </div>
      </div>
    </div>
  );
};

const FooterColumn = ({ title, links }: { title: string, links: {l: string, to: string}[] }) => (
  <div className="space-y-12">
     <h4 className="text-[14px] font-black uppercase tracking-[0.6em] text-white italic">{title}</h4>
     <ul className="space-y-6">
        {links.map((link, i) => (
          <li key={i}>
            <Link to={link.to} className="text-[11px] font-bold text-zinc-600 hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">{link.l}</Link>
          </li>
        ))}
     </ul>
  </div>
);

const SocialIcon = ({ icon: Icon }: any) => (
  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white hover:border-blue-500 transition-all cursor-pointer shadow-xl active:scale-95">
    <Icon size={24} />
  </div>
);

export default Landing;
