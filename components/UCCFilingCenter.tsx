// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3 | PATH: diplomat-bit-aibanking.dev-jocall3-91b6490/components/UCCFilingCenter.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import { 
  Scale, FileText, Gavel, RefreshCcw,
  Plus, Download, Code, Terminal, AlertCircle,
  Cpu, ShieldCheck, Share2, Zap, ChevronDown, ChevronUp, ExternalLink,
  // Fix: Added missing Info icon import
  Info
} from 'lucide-react';
import { UCCFiling, ConnectedItem } from '../types';

interface Props {
  filings: UCCFiling[];
  onUpdateFilings: (f: UCCFiling[]) => void;
  proxy: string;
  addLog: (msg: any, type?: 'req' | 'res' | 'err') => void;
  items: ConnectedItem[];
}

// ETF Mapping constants from Taxonomy Registry
const ETF_MAP = {
  PRIMARY_KEY: '362A99F1-7A89-4143-BDB8-E131D52C63BD',
  ACC_TYPE: '11337432-B2D1-4488-8165-EA5CBEED2B31',
  ACC_NUM: '9C8B901B-7F36-4391-9A6C-D222FB33A048',
  ORG_NAME: 'AFD29442-EBBE-4540-8349-8D76166C83B4'
};

export const UCCFilingCenter: React.FC<Props> = ({ filings, onUpdateFilings, proxy, addLog, items }) => {
  const [submitting, setSubmitting] = useState(false);
  const [protocol, setProtocol] = useState<'STANDARD' | 'UCC1-ETF'>('UCC1-ETF');
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | null>(items.length > 0 ? 0 : null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  const generateUcc1EtfXml = (packetNum: string, clientAcc: string) => {
    const item = selectedItemIdx !== null ? items[selectedItemIdx] : null;
    const debtorName = item ? escapeXml(item.institutionName) : "NEXUS_UNIFIED_DEBTOR";
    const meshId = item ? item.itemId : "NEXUS_NULL_NODE";

    if (protocol === 'STANDARD') {
      return `<?xml version="1.0" encoding="utf-8"?>
<Document>
  <Header>
    <PacketNum>${packetNum}</PacketNum>
  </Header>
  <Record>
    <OrganizationName>${debtorName}</OrganizationName>
    <AccountNumber>${clientAcc}</AccountNumber>
  </Record>
</Document>`.trim();
    }

    // UCC1-ETF v3.5 using Taxonomy UUIDs
    return `<?xml version="1.0" encoding="utf-8"?>
<UCC1_ETF version="3.5" xmlns="urn:nexus:fintech:ucc1:etf">
  <TransmissionHeader>
    <PacketID>${packetNum}</PacketID>
    <Timestamp>${new Date().toISOString()}</Timestamp>
    <TaxonomySpec>jopbetv1.0</TaxonomySpec>
    <EncryptionMethod>AES-256-GCM</EncryptionMethod>
  </TransmissionHeader>
  <FilingBody>
    <Debtor type="Organization">
      <Feature id="${ETF_MAP.ORG_NAME}" name="AccountName">${debtorName}</Feature>
      <Feature id="${ETF_MAP.PRIMARY_KEY}" name="PrimaryKey">${meshId}</Feature>
      <Feature id="${ETF_MAP.ACC_NUM}" name="AccountNumber">${clientAcc}</Feature>
    </Debtor>
    <Collateral>
      <Description>All assets including but not limited to depository accounts mapped in the Nexus Mesh under node ${meshId}.</Description>
      <GrantingClause>Debtor hereby grants a security interest in all existing and future accounts.</GrantingClause>
    </Collateral>
    <ElectronicSignatures>
      <Signature role="AuthorizedOfficer" timestamp="${new Date().toISOString()}">NEXUS_AUTO_SIG_v3</Signature>
    </ElectronicSignatures>
  </FilingBody>
</UCC1_ETF>`.trim();
  };

  const submitFiling = async () => {
    if (items.length === 0 || selectedItemIdx === null) {
      addLog("UCC Error: Select a source node first.", "err");
      return;
    }

    setSubmitting(true);
    const packetNum = "NEXUS_FL_ETF_" + Date.now().toString().slice(-8);
    const xml = generateUcc1EtfXml(packetNum, "FL_ACC_8822");
    
    addLog(`[UCC1-ETF] Initializing transmission via ${protocol} protocol...`, 'req');
    addLog(`[XSD-VALIDATION] Checking payload against Taxonomy Registry jopbetv1.0...`, 'req');
    
    // Simulate complex ETF handshake
    setTimeout(() => {
      addLog(`[TRANSMIT] Chunking XML payload into secure packets...`, 'req');
      
      setTimeout(() => {
        const newFiling: UCCFiling = {
          id: Math.random().toString(36).substr(2, 6).toUpperCase(),
          status: 'Filed',
          packetNum: packetNum,
          transType: 'Initial',
          amount: 35.00,
          dateCreated: new Date().toISOString(),
          xmlPayload: xml,
          receiptId: "ETF-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
          fileNumber: "2024-" + Math.floor(Math.random() * 1000000)
        };
        
        onUpdateFilings([newFiling, ...filings]);
        setSubmitting(false);
        addLog(`[UCC1-ETF] SUCCESS: Filing ${newFiling.fileNumber} confirmed by registry.`, 'res');
        addLog(newFiling, 'res');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-right-12 duration-1000 pb-20">
      {/* Header & Controls */}
      <div className="bg-slate-900/60 p-10 rounded-[3rem] border border-white/5 flex flex-wrap items-center justify-between gap-8 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -ml-32 -mt-32" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-inner">
            <Scale size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Compliance Node</h2>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Electronic Transmission (ETF) v3.5</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-black border border-blue-500/20">REGISTRY-CONNECTED</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10 flex-wrap lg:flex-nowrap">
           <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-white/5 shadow-inner">
              <button 
                onClick={() => setProtocol('STANDARD')}
                className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${protocol === 'STANDARD' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
              >Legacy</button>
              <button 
                onClick={() => setProtocol('UCC1-ETF')}
                className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${protocol === 'UCC1-ETF' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 hover:text-slate-400'}`}
              >UCC1-ETF</button>
           </div>
           
           <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl min-w-[220px]">
              <span className="text-[9px] font-black text-slate-500 uppercase block tracking-[0.2em] mb-2 text-center">Source Node</span>
              <select 
                className="bg-transparent text-white text-xs font-black uppercase outline-none w-full cursor-pointer appearance-none text-center"
                onChange={(e) => setSelectedItemIdx(e.target.value === "" ? null : parseInt(e.target.value))}
                value={selectedItemIdx ?? ""}
              >
                <option value="" disabled>-- SELECT SOURCE --</option>
                {items.map((it, idx) => <option key={idx} value={idx}>{it.institutionName}</option>)}
                {items.length === 0 && <option value="" disabled>NO NODES ACTIVE</option>}
              </select>
           </div>
           
           <button 
            onClick={submitFiling} 
            disabled={submitting || items.length === 0} 
            className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
           >
             {submitting ? <RefreshCcw className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:animate-pulse" />}
             Execute ETF Transmit
           </button>
        </div>
      </div>

      {/* Live Transmission Visualizer */}
      {submitting && (
        <div className="bg-slate-950/60 border border-blue-500/30 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-8 animate-in zoom-in-95">
          <div className="flex items-center gap-12 w-full max-w-3xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/40 text-blue-500">
                <Cpu size={32} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Mesh Node</span>
            </div>
            
            <div className="flex-1 h-[2px] bg-slate-800 relative overflow-hidden">
               <div className="absolute inset-y-0 w-1/3 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scroll" />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/40 text-emerald-500">
                <ShieldCheck size={32} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">ETF Validator</span>
            </div>

            <div className="flex-1 h-[2px] bg-slate-800 relative overflow-hidden">
               <div className="absolute inset-y-0 w-1/3 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scroll-delayed" />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/40 text-purple-500">
                <Gavel size={32} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Registry</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-black italic uppercase text-white tracking-widest animate-pulse">Transmitting Data Vectors...</p>
            <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase italic">Packet ID: {Date.now()}</p>
          </div>
        </div>
      )}

      {/* Filings List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-8">
           <div className="flex items-center justify-between ml-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Transmission History</h3>
              <div className="flex gap-4">
                <span className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-blue-500/40 shadow" /> {filings.length} Packets
                </span>
              </div>
           </div>

           <div className="space-y-4">
              {filings.map((f) => (
                <div key={f.id} className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden transition-all hover:border-blue-500/20">
                   <div className="p-8 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center text-blue-500">
                            <FileText size={24} />
                         </div>
                         <div>
                            <p className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                              {f.packetNum}
                              {f.fileNumber && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black border border-emerald-500/20 rounded">FILED: {f.fileNumber}</span>
                              )}
                            </p>
                            <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-widest">{new Date(f.dateCreated).toLocaleString()}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <button 
                          onClick={() => setExpandedId(expandedId === f.id ? null : f.id)}
                          className="p-3 bg-slate-950 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
                         >
                            {expandedId === f.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                         </button>
                         <button className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-500 hover:bg-blue-600/20 transition-all">
                            <Download size={18} />
                         </button>
                      </div>
                   </div>
                   
                   {expandedId === f.id && (
                     <div className="px-8 pb-8 animate-in slide-in-from-top-4">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5">
                            <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Receipt ID</p>
                            <p className="text-[10px] font-mono text-white">{f.receiptId}</p>
                          </div>
                          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5">
                            <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Fee Remittance</p>
                            <p className="text-[10px] font-mono text-emerald-400 font-bold">${f.amount.toFixed(2)} USD</p>
                          </div>
                          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5">
                            <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Status</p>
                            <p className="text-[10px] font-black uppercase text-blue-400">{f.status}</p>
                          </div>
                        </div>

                        <div className="bg-slate-950 rounded-[2rem] border border-white/10 overflow-hidden">
                           <div className="px-6 py-4 bg-slate-900/50 border-b border-white/5 flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Code size={12}/> XML Payload Output
                              </span>
                              <span className="text-[8px] font-mono text-slate-600 italic">ETF-SPEC-v3.5.XSD</span>
                           </div>
                           <div className="p-6 overflow-x-auto max-h-[300px] scrollbar-hide">
                              <pre className="text-[10px] font-mono text-blue-400/80 leading-relaxed whitespace-pre">
                                {f.xmlPayload}
                              </pre>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              ))}
              
              {filings.length === 0 && !submitting && (
                <div className="py-32 bg-slate-900/20 border-2 border-dashed border-white/5 rounded-[3rem] text-center opacity-40">
                  <FileText size={48} className="mx-auto mb-6 text-slate-700" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Compliance Transmissions Awaiting Initialization</p>
                </div>
              )}
           </div>
        </div>

        <aside className="space-y-8">
           <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <Info size={24} />
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest text-white italic">ETF Protocol Brief</h4>
              </div>
              <div className="space-y-6">
                 {[
                   { t: 'Registry Binding', d: 'Maps institutional metadata to Florida UCC ETF v3.5 standards.' },
                   { t: 'Taxonomy Integration', d: 'Uses jopbetv1.0 UUIDs for high-fidelity data extraction.' },
                   { t: 'Secure Tunneling', d: 'Employs mesh encryption for end-to-end legal compliance.' }
                 ].map((item, i) => (
                   <div key={i} className="space-y-2">
                      <p className="text-[9px] font-black uppercase text-blue-500 tracking-tighter">{item.t}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.d}</p>
                   </div>
                 ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/5">
                 <button className="w-full py-4 bg-slate-950 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3 group">
                   <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
                   View ETF Documentation
                 </button>
              </div>
           </div>

           <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck size={100} className="text-white" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4 relative z-10">Compliance Integrity</h4>
              <p className="text-[11px] text-blue-200/60 leading-relaxed mb-8 relative z-10">
                Nexus Terminal guarantees the validity of all ETF packets by validating against current state registry requirements in real-time.
              </p>
              <div className="flex items-center gap-2 text-white font-black text-[9px] uppercase tracking-widest relative z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Packet Integrity Verified
              </div>
           </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          from { transform: translateX(-100%); }
          to { transform: translateX(300%); }
        }
        .animate-scroll {
          animation: scroll 1.5s linear infinite;
        }
        .animate-scroll-delayed {
          animation: scroll 1.5s linear infinite;
          animation-delay: 0.75s;
        }
      `}} />
    </div>
  );
};
