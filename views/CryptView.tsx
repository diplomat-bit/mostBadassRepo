// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/CryptView.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  Hammer, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Wallet, 
  Key, 
  Loader2, 
  Eye, 
  Image as ImageIcon,
  Zap,
  Globe,
  Share2,
  ExternalLink,
  Info,
  AlertCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { nftService, GeneratedNFT } from '../services/nftService';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CryptView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nft, setNft] = useState<GeneratedNFT | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [mintLogs, setMintLogs] = useState<string[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError("MetaMask not detected. Please install the browser extension to interact with the foundry.");
      return;
    }

    setIsConnecting(true);
    setError(null);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to establish neural handshake with wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        }
      }
    };
    checkConnection();
  }, []);

  const handleSynthesize = async () => {
    if (!prompt.trim()) return;
    setIsSynthesizing(true);
    setNft(null);
    setMintLogs([]);
    setError(null);

    const [imageUrl, metadata] = await Promise.all([
      nftService.generateImage(prompt),
      nftService.generateMetadata(prompt)
    ]);

    if (imageUrl) {
      setNft({
        name: metadata.name || "Neural Artifact",
        description: metadata.description || "Synthesized by Lumina Oracle",
        imageUrl,
        traits: metadata.traits || []
      });
    } else {
      setError("Asset synthesis failed. Registry node refused prompt.");
    }
    setIsSynthesizing(false);
  };

  const handleMint = async () => {
    if (!nft || !walletConnected) return;
    setIsMinting(true);
    setMintLogs(["Starting deployment sequence via Neural Bridge..."]);

    const steps = await nftService.mintToOpenSea(nft, "MOCK_OS_HANDSHAKE", walletAddress);
    
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800));
      setMintLogs(prev => [...prev, step]);
    }
    setIsMinting(false);
  };

  const shortenAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Quantum <span className="text-blue-500 not-italic">Crypt</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Neural Asset Synthesis & Blockchain Deployment</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {walletConnected ? shortenAddress(walletAddress) : 'Foundry Disconnected'}
              </span>
            </div>
          </div>
          {!walletConnected && (
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50"
            >
              {isConnecting ? <Loader2 size={14} className="animate-spin" /> : <Wallet size={14} />}
              <span>{isConnecting ? 'Initializing...' : 'Connect MetaMask'}</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 backdrop-blur-md">
          <AlertCircle size={20} className="text-rose-500 shrink-0" />
          <p className="text-xs font-bold text-rose-200">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-rose-500/10 rounded-lg text-rose-500">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-white font-black text-xs uppercase tracking-widest italic leading-none">Forge Configuration</h3>
                <p className="text-[9px] text-zinc-600 font-black uppercase mt-2">Neural Handshake v2.1</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-1">Synthesis Script</label>
                <textarea 
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe the artifact for the neural engine..."
                  className="w-full bg-black/60 border border-white/10 focus:border-blue-500/50 rounded-3xl py-6 px-6 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold min-h-[160px] resize-none shadow-inner"
                />
              </div>

              <button 
                onClick={handleSynthesize}
                disabled={isSynthesizing || !prompt}
                className="w-full py-6 bg-white text-black hover:bg-blue-600 hover:text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-4 disabled:opacity-30 shadow-2xl active:scale-95"
              >
                {isSynthesizing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                <span>{isSynthesizing ? 'FORGING LAYERS' : 'INITIALIZE FORGE'}</span>
              </button>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl h-[350px] flex flex-col">
            <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-blue-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Fabric Trace</span>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 p-8 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-2">
              {mintLogs.length === 0 ? (
                <div className="text-zinc-700 italic">Foundry node idle. Awaiting authorization.</div>
              ) : (
                mintLogs.map((log, i) => (
                  <div key={i} className={`flex gap-4 ${log.includes('Successfully') ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="tracking-tight">{log}</span>
                  </div>
                ))
              )}
              {isMinting && <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{'>>>'} BROADCASTING BLOCK...</div>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {nft ? (
            <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-12 lg:p-16 shadow-2xl space-y-12 animate-in zoom-in-95">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="aspect-square rounded-[3rem] overflow-hidden bg-black border border-zinc-800 shadow-2xl relative group">
                  <img src={nft.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt={nft.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-8 right-8">
                     <div className="p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5">
                        <ImageIcon size={20} className="text-blue-500" />
                     </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between py-4">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">{nft.name}</h4>
                      <p className="text-zinc-400 text-lg leading-relaxed font-medium italic">"{nft.description}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {nft.traits.map((trait, i) => (
                        <div key={i} className="p-4 bg-black border border-zinc-800 rounded-2xl">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{trait.trait_type}</p>
                          <p className="text-[10px] font-black text-blue-500 uppercase">{trait.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <button 
                      onClick={handleMint}
                      disabled={isMinting || !walletConnected}
                      className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4"
                    >
                      {isMinting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                      <span>{isMinting ? 'MINTING TO MAINNET...' : 'MINT TO OPENSEA'}</span>
                    </button>
                    {!walletConnected && (
                       <p className="text-[9px] text-rose-500 font-black uppercase text-center tracking-widest">Connect Wallet to Enable Minting</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-zinc-900 rounded-[5rem] flex flex-col items-center justify-center text-center p-20 bg-zinc-950/20 group">
               {isSynthesizing ? (
                 <div className="space-y-8">
                    <div className="relative">
                       <div className="w-32 h-32 rounded-full border-8 border-zinc-900 border-t-blue-600 animate-spin"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles size={40} className="text-blue-500 animate-pulse" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-white font-black text-sm uppercase tracking-[0.4em]">Synthesizing Neural Art...</p>
                       <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Applying Institutional Textures</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                       <ImageIcon size={48} className="text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-xl font-black text-zinc-600 uppercase italic tracking-tighter">Crypt Idle</h4>
                       <p className="text-zinc-700 text-xs font-bold uppercase tracking-[0.2em]">Awaiting forge configuration handshake</p>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-20 p-12 bg-white/5 border border-white/10 rounded-[3.5rem] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
         <div className="flex items-center gap-10 flex-1 relative z-10">
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] text-blue-500 shadow-2xl group-hover:scale-110 transition-transform duration-700">
               <Globe size={48} />
            </div>
            <div>
               <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Institutional <span className="text-blue-500">Distribution</span></h4>
               <p className="text-zinc-500 text-lg font-bold italic leading-relaxed max-w-2xl">
                 "Our bridge technology allows for the direct deployment of synthesized assets to various public and private ledger fabrics including Ethereum, Solana, and the Lumina Mesh."
               </p>
            </div>
         </div>
         <div className="relative z-10">
            <button className="px-12 py-6 bg-zinc-100 hover:bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-white/5 flex items-center gap-4">
               <span>Explore Distribution Map</span>
               <ArrowRight size={20} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default CryptView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/CryptView.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  Hammer, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Wallet, 
  Key, 
  Loader2, 
  Eye, 
  Image as ImageIcon,
  Zap,
  Globe,
  Share2,
  ExternalLink,
  Info,
  AlertCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { nftService, GeneratedNFT } from '../services/nftService';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CryptView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nft, setNft] = useState<GeneratedNFT | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [mintLogs, setMintLogs] = useState<string[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError("MetaMask not detected. Please install the browser extension to interact with the foundry.");
      return;
    }

    setIsConnecting(true);
    setError(null);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to establish neural handshake with wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        }
      }
    };
    checkConnection();
  }, []);

  const handleSynthesize = async () => {
    if (!prompt.trim()) return;
    setIsSynthesizing(true);
    setNft(null);
    setMintLogs([]);
    setError(null);

    const [imageUrl, metadata] = await Promise.all([
      nftService.generateImage(prompt),
      nftService.generateMetadata(prompt)
    ]);

    if (imageUrl) {
      setNft({
        name: metadata.name || "Neural Artifact",
        description: metadata.description || "Synthesized by Lumina Oracle",
        imageUrl,
        traits: metadata.traits || []
      });
    } else {
      setError("Asset synthesis failed. Registry node refused prompt.");
    }
    setIsSynthesizing(false);
  };

  const handleMint = async () => {
    if (!nft || !walletConnected) return;
    setIsMinting(true);
    setMintLogs(["Starting deployment sequence via Neural Bridge..."]);

    const steps = await nftService.mintToOpenSea(nft, "MOCK_OS_HANDSHAKE", walletAddress);
    
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800));
      setMintLogs(prev => [...prev, step]);
    }
    setIsMinting(false);
  };

  const shortenAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Quantum <span className="text-blue-500 not-italic">Crypt</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Neural Asset Synthesis & Blockchain Deployment</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {walletConnected ? shortenAddress(walletAddress) : 'Foundry Disconnected'}
              </span>
            </div>
          </div>
          {!walletConnected && (
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50"
            >
              {isConnecting ? <Loader2 size={14} className="animate-spin" /> : <Wallet size={14} />}
              <span>{isConnecting ? 'Initializing...' : 'Connect MetaMask'}</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 backdrop-blur-md">
          <AlertCircle size={20} className="text-rose-500 shrink-0" />
          <p className="text-xs font-bold text-rose-200">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-rose-500/10 rounded-lg text-rose-500">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-white font-black text-xs uppercase tracking-widest italic leading-none">Forge Configuration</h3>
                <p className="text-[9px] text-zinc-600 font-black uppercase mt-2">Neural Handshake v2.1</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-1">Synthesis Script</label>
                <textarea 
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe the artifact for the neural engine..."
                  className="w-full bg-black/60 border border-white/10 focus:border-blue-500/50 rounded-3xl py-6 px-6 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold min-h-[160px] resize-none shadow-inner"
                />
              </div>

              <button 
                onClick={handleSynthesize}
                disabled={isSynthesizing || !prompt}
                className="w-full py-6 bg-white text-black hover:bg-blue-600 hover:text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-4 disabled:opacity-30 shadow-2xl active:scale-95"
              >
                {isSynthesizing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                <span>{isSynthesizing ? 'FORGING LAYERS' : 'INITIALIZE FORGE'}</span>
              </button>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl h-[350px] flex flex-col">
            <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-blue-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Fabric Trace</span>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 p-8 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-2">
              {mintLogs.length === 0 ? (
                <div className="text-zinc-700 italic">Foundry node idle. Awaiting authorization.</div>
              ) : (
                mintLogs.map((log, i) => (
                  <div key={i} className={`flex gap-4 ${log.includes('Successfully') ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="tracking-tight">{log}</span>
                  </div>
                ))
              )}
              {isMinting && <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{'>>>'} BROADCASTING BLOCK...</div>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {nft ? (
            <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-12 lg:p-16 shadow-2xl space-y-12 animate-in zoom-in-95">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="aspect-square rounded-[3rem] overflow-hidden bg-black border border-zinc-800 shadow-2xl relative group">
                  <img src={nft.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt={nft.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-8 right-8">
                     <div className="p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5">
                        <ImageIcon size={20} className="text-blue-500" />
                     </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between py-4">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">{nft.name}</h4>
                      <p className="text-zinc-400 text-lg leading-relaxed font-medium italic">"{nft.description}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {nft.traits.map((trait, i) => (
                        <div key={i} className="p-4 bg-black border border-zinc-800 rounded-2xl">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{trait.trait_type}</p>
                          <p className="text-[10px] font-black text-blue-500 uppercase">{trait.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <button 
                      onClick={handleMint}
                      disabled={isMinting || !walletConnected}
                      className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4"
                    >
                      {isMinting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                      <span>{isMinting ? 'MINTING TO MAINNET...' : 'MINT TO OPENSEA'}</span>
                    </button>
                    {!walletConnected && (
                       <p className="text-[9px] text-rose-500 font-black uppercase text-center tracking-widest">Connect Wallet to Enable Minting</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-zinc-900 rounded-[5rem] flex flex-col items-center justify-center text-center p-20 bg-zinc-950/20 group">
               {isSynthesizing ? (
                 <div className="space-y-8">
                    <div className="relative">
                       <div className="w-32 h-32 rounded-full border-8 border-zinc-900 border-t-blue-600 animate-spin"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles size={40} className="text-blue-500 animate-pulse" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-white font-black text-sm uppercase tracking-[0.4em]">Synthesizing Neural Art...</p>
                       <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Applying Institutional Textures</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                       <ImageIcon size={48} className="text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-xl font-black text-zinc-600 uppercase italic tracking-tighter">Crypt Idle</h4>
                       <p className="text-zinc-700 text-xs font-bold uppercase tracking-[0.2em]">Awaiting forge configuration handshake</p>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-20 p-12 bg-white/5 border border-white/10 rounded-[3.5rem] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
         <div className="flex items-center gap-10 flex-1 relative z-10">
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] text-blue-500 shadow-2xl group-hover:scale-110 transition-transform duration-700">
               <Globe size={48} />
            </div>
            <div>
               <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Institutional <span className="text-blue-500">Distribution</span></h4>
               <p className="text-zinc-500 text-lg font-bold italic leading-relaxed max-w-2xl">
                 "Our bridge technology allows for the direct deployment of synthesized assets to various public and private ledger fabrics including Ethereum, Solana, and the Lumina Mesh."
               </p>
            </div>
         </div>
         <div className="relative z-10">
            <button className="px-12 py-6 bg-zinc-100 hover:bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-white/5 flex items-center gap-4">
               <span>Explore Distribution Map</span>
               <ArrowRight size={20} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default CryptView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/CryptView.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  Hammer, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Wallet, 
  Key, 
  Loader2, 
  Eye, 
  Image as ImageIcon,
  Zap,
  Globe,
  Share2,
  ExternalLink,
  Info,
  AlertCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { nftService, GeneratedNFT } from '../services/nftService';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CryptView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nft, setNft] = useState<GeneratedNFT | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [mintLogs, setMintLogs] = useState<string[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError("MetaMask not detected. Please install the browser extension to interact with the foundry.");
      return;
    }

    setIsConnecting(true);
    setError(null);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to establish neural handshake with wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        }
      }
    };
    checkConnection();
  }, []);

  const handleSynthesize = async () => {
    if (!prompt.trim()) return;
    setIsSynthesizing(true);
    setNft(null);
    setMintLogs([]);
    setError(null);

    const [imageUrl, metadata] = await Promise.all([
      nftService.generateImage(prompt),
      nftService.generateMetadata(prompt)
    ]);

    if (imageUrl) {
      setNft({
        name: metadata.name || "Neural Artifact",
        description: metadata.description || "Synthesized by Lumina Oracle",
        imageUrl,
        traits: metadata.traits || []
      });
    } else {
      setError("Asset synthesis failed. Registry node refused prompt.");
    }
    setIsSynthesizing(false);
  };

  const handleMint = async () => {
    if (!nft || !walletConnected) return;
    setIsMinting(true);
    setMintLogs(["Starting deployment sequence via Neural Bridge..."]);

    const steps = await nftService.mintToOpenSea(nft, "MOCK_OS_HANDSHAKE", walletAddress);
    
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800));
      setMintLogs(prev => [...prev, step]);
    }
    setIsMinting(false);
  };

  const shortenAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Quantum <span className="text-blue-500 not-italic">Crypt</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Neural Asset Synthesis & Blockchain Deployment</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {walletConnected ? shortenAddress(walletAddress) : 'Foundry Disconnected'}
              </span>
            </div>
          </div>
          {!walletConnected && (
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50"
            >
              {isConnecting ? <Loader2 size={14} className="animate-spin" /> : <Wallet size={14} />}
              <span>{isConnecting ? 'Initializing...' : 'Connect MetaMask'}</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 backdrop-blur-md">
          <AlertCircle size={20} className="text-rose-500 shrink-0" />
          <p className="text-xs font-bold text-rose-200">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-rose-500/10 rounded-lg text-rose-500">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-white font-black text-xs uppercase tracking-widest italic leading-none">Forge Configuration</h3>
                <p className="text-[9px] text-zinc-600 font-black uppercase mt-2">Neural Handshake v2.1</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-1">Synthesis Script</label>
                <textarea 
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe the artifact for the neural engine..."
                  className="w-full bg-black/60 border border-white/10 focus:border-blue-500/50 rounded-3xl py-6 px-6 text-white text-sm outline-none transition-all placeholder:text-zinc-800 font-bold min-h-[160px] resize-none shadow-inner"
                />
              </div>

              <button 
                onClick={handleSynthesize}
                disabled={isSynthesizing || !prompt}
                className="w-full py-6 bg-white text-black hover:bg-blue-600 hover:text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-4 disabled:opacity-30 shadow-2xl active:scale-95"
              >
                {isSynthesizing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                <span>{isSynthesizing ? 'FORGING LAYERS' : 'INITIALIZE FORGE'}</span>
              </button>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl h-[350px] flex flex-col">
            <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-blue-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Fabric Trace</span>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 p-8 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-2">
              {mintLogs.length === 0 ? (
                <div className="text-zinc-700 italic">Foundry node idle. Awaiting authorization.</div>
              ) : (
                mintLogs.map((log, i) => (
                  <div key={i} className={`flex gap-4 ${log.includes('Successfully') ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="tracking-tight">{log}</span>
                  </div>
                ))
              )}
              {isMinting && <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{'>>>'} BROADCASTING BLOCK...</div>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {nft ? (
            <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-12 lg:p-16 shadow-2xl space-y-12 animate-in zoom-in-95">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="aspect-square rounded-[3rem] overflow-hidden bg-black border border-zinc-800 shadow-2xl relative group">
                  <img src={nft.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt={nft.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-8 right-8">
                     <div className="p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5">
                        <ImageIcon size={20} className="text-blue-500" />
                     </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between py-4">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">{nft.name}</h4>
                      <p className="text-zinc-400 text-lg leading-relaxed font-medium italic">"{nft.description}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {nft.traits.map((trait, i) => (
                        <div key={i} className="p-4 bg-black border border-zinc-800 rounded-2xl">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{trait.trait_type}</p>
                          <p className="text-[10px] font-black text-blue-500 uppercase">{trait.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <button 
                      onClick={handleMint}
                      disabled={isMinting || !walletConnected}
                      className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4"
                    >
                      {isMinting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                      <span>{isMinting ? 'MINTING TO MAINNET...' : 'MINT TO OPENSEA'}</span>
                    </button>
                    {!walletConnected && (
                       <p className="text-[9px] text-rose-500 font-black uppercase text-center tracking-widest">Connect Wallet to Enable Minting</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-zinc-900 rounded-[5rem] flex flex-col items-center justify-center text-center p-20 bg-zinc-950/20 group">
               {isSynthesizing ? (
                 <div className="space-y-8">
                    <div className="relative">
                       <div className="w-32 h-32 rounded-full border-8 border-zinc-900 border-t-blue-600 animate-spin"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles size={40} className="text-blue-500 animate-pulse" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-white font-black text-sm uppercase tracking-[0.4em]">Synthesizing Neural Art...</p>
                       <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Applying Institutional Textures</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                       <ImageIcon size={48} className="text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-xl font-black text-zinc-600 uppercase italic tracking-tighter">Crypt Idle</h4>
                       <p className="text-zinc-700 text-xs font-bold uppercase tracking-[0.2em]">Awaiting forge configuration handshake</p>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-20 p-12 bg-white/5 border border-white/10 rounded-[3.5rem] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#1e1b4b_0%,_transparent_40%)] opacity-30"></div>
         <div className="flex items-center gap-10 flex-1 relative z-10">
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] text-blue-500 shadow-2xl group-hover:scale-110 transition-transform duration-700">
               <Globe size={48} />
            </div>
            <div>
               <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Institutional <span className="text-blue-500">Distribution</span></h4>
               <p className="text-zinc-500 text-lg font-bold italic leading-relaxed max-w-2xl">
                 "Our bridge technology allows for the direct deployment of synthesized assets to various public and private ledger fabrics including Ethereum, Solana, and the Lumina Mesh."
               </p>
            </div>
         </div>
         <div className="relative z-10">
            <button className="px-12 py-6 bg-zinc-100 hover:bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-white/5 flex items-center gap-4">
               <span>Explore Distribution Map</span>
               <ArrowRight size={20} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default CryptView;
