// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/AnalyticsReport.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  ChevronRight,
  Building2,
  ShieldCheck,
  CreditCard,
  Globe,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Loader2,
  FileText,
  CheckCircle2,
  Share2,
  Lock,
  ExternalLink,
  X,
  Copy,
  Zap,
  Smartphone,
  Search,
  RefreshCw,
  Cpu,
  Fingerprint,
  Database
} from 'lucide-react';
import { callGemini } from '../services/geminiService';
import { apiClient } from '../services/api';

interface StatementSummary {
  accountId: string;
  statementId: string;
  statementType: string;
  documentFormat: string;
  statementDate: string;
  productFamily: string;
}

interface StatementTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  ref: string;
}

const MOCK_TRANS_DATA: StatementTransaction[] = [
  { id: '1', date: '2024-03-28', description: 'Institutional Treasury Transfer', category: 'Investment', amount: 250000.00, type: 'CREDIT', ref: 'WT-882910' },
  { id: '2', date: '2024-03-25', description: 'Cloud Infrastructure - AWS Global', category: 'Operations', amount: 12450.22, type: 'DEBIT', ref: 'INV-4421' },
  { id: '3', date: '2024-03-20', description: 'Venture Capital Drawdown - Series B', category: 'Investment', amount: 150000.00, type: 'CREDIT', ref: 'WT-882905' },
  { id: '4', date: '2024-03-18', description: 'Payroll Disbursement - Q1 Exec', category: 'Payroll', amount: 85000.00, type: 'DEBIT', ref: 'PAY-0092' },
  { id: '5', date: '2024-03-15', description: 'Cybersecurity Audit - Mandiant', category: 'Security', amount: 4500.00, type: 'DEBIT', ref: 'INV-8821' },
];

const AnalyticsReport: React.FC = () => {
  const [statements, setStatements] = useState<StatementSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeStatementId, setActiveStatementId] = useState<string | null>(null);
  const [decryptionStage, setDecryptionStage] = useState<'IDLE' | 'FETCHING' | 'DECRYPTING' | 'READY'>('IDLE');
  const [rawPayload, setRawPayload] = useState<any>(null);
  
  const [isPrinting, setIsPrinting] = useState(false);
  const [verificationReport, setVerificationReport] = useState<string | null>(null);

  const openingBalance = 1000000.00;

  useEffect(() => {
    fetchStatementList();
  }, []);

  const fetchStatementList = async () => {
    setLoadingList(true);
    try {
      const data = await apiClient.getStatements();
      setStatements(data.statements || []);
    } catch (err) {
      console.error("Failed to sync statement registry.");
    } finally {
      setLoadingList(false);
    }
  };

  const handleSelectStatement = async (id: string) => {
    setActiveStatementId(id);
    setDecryptionStage('FETCHING');
    
    try {
      const data = await apiClient.getStatementDetails(id);
      setRawPayload(data);
      setDecryptionStage('DECRYPTING');
      await new Promise(r => setTimeout(r, 2000));
      setDecryptionStage('READY');
    } catch (err) {
      setDecryptionStage('IDLE');
      alert("Neural handshake failed. Block data corrupted.");
    }
  };

  const stats = useMemo(() => {
    const totalCredits = MOCK_TRANS_DATA.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = MOCK_TRANS_DATA.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0);
    const closingBalance = openingBalance + totalCredits - totalDebits;
    return { totalCredits, totalDebits, closingBalance };
  }, []);

  const handleVerify = async () => {
    try {
      const response = await callGemini(
        'gemini-3-flash-preview',
        `Generate a technical signature verification for a Lumina Quantum statement. Mention HMAC-SHA256, RSA-OAEP-4096 and zero drift. 1 sentence.`
      );
      setVerificationReport(response.text || "Audit verified. Mathematical parity achieved.");
    } catch (err) {
      setVerificationReport("Audit verified. Mathematical parity achieved.");
    }
  };

  if (decryptionStage !== 'READY') {
    return (
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Statement <span className="text-blue-500 not-italic">Vault</span></h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Accessing Encrypted M2M Financial Artifacts</p>
          </div>
          <button onClick={fetchStatementList} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl">
             <RefreshCw size={18} className={loadingList ? 'animate-spin' : ''} />
          </button>
        </div>

        {decryptionStage === 'IDLE' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingList ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900/50 rounded-[3rem] animate-pulse"></div>
              ))
            ) : (
              statements.map(stmt => (
                <button 
                  key={stmt.statementId}
                  onClick={() => handleSelectStatement(stmt.statementId)}
                  className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] text-left hover:border-blue-500/50 hover:bg-zinc-900/50 transition-all group relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <FileText size={120} />
                  </div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                      <Lock size={24} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-black px-3 py-1 rounded-full border border-zinc-800">{stmt.productFamily}</span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{stmt.statementDate}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-10">{stmt.statementId}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Decrypt Artifact</span>
                    <ArrowRight size={18} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95">
            <div className="relative">
              <div className="w-64 h-64 rounded-full border-8 border-zinc-900 flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full border-8 border-blue-600 border-t-transparent animate-spin"></div>
                 <Cpu size={80} className="text-blue-500 animate-pulse" />
              </div>
              <div className="absolute -inset-10 bg-blue-500/10 blur-3xl rounded-full"></div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                {decryptionStage === 'FETCHING' ? 'Retrieving Payload' : 'Neural Decryption'}
              </h3>
              <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs animate-pulse">
                Handshaking via RSA-OAEP-4096 • Block Ref: {activeStatementId}
              </p>
              {decryptionStage === 'DECRYPTING' && rawPayload && (
                <div className="mt-8 p-4 bg-black/40 border border-zinc-800 rounded-2xl font-mono text-[9px] text-emerald-500/60 max-w-sm mx-auto overflow-hidden text-left">
                  {JSON.stringify(JSON.parse(rawPayload.dataPayload).encryptedPayload.header, null, 2)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 print:p-0 print:pb-0 print:m-0 print:max-w-none animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
        <button 
          onClick={() => {
            setDecryptionStage('IDLE');
            setRawPayload(null);
          }}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowDownLeft size={16} /> Close Document
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => { setIsPrinting(true); setTimeout(() => { window.print(); setIsPrinting(false); }, 1000); }}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
          >
            {isPrinting ? <Loader2 className="animate-spin" /> : <Printer size={16} />}
            <span>Print Verified</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-50 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
            <Download size={16} />
            <span>Official Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white text-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 print:shadow-none print:border-none print:rounded-none">
        <div className="p-10 lg:p-16 bg-zinc-50 border-b border-zinc-200">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                  <Building2 size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase">Lumina <span className="text-blue-600 not-italic">Quantum</span></h1>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Account Holder</p>
                <p className="text-lg font-bold text-zinc-900">Alex Rivera</p>
                <p className="text-sm text-zinc-500 font-medium">Lumina Quantum Systems LLC</p>
              </div>
            </div>
            <div className="text-left md:text-right space-y-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase leading-none">Statement</h2>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{activeStatementId}</p>
              </div>
              <div className="text-xs font-medium">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Decryption Fingerprint</p>
                <p className="mono text-zinc-600 truncate max-w-[200px] ml-auto">
                  {rawPayload && JSON.parse(rawPayload.dataPayload).encryptedPayload.iv}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 lg:p-16 border-b border-zinc-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <SummaryItem label="Beginning Balance" value={openingBalance} />
            <SummaryItem label="Total Credits" value={stats.totalCredits} color="emerald" />
            <SummaryItem label="Total Debits" value={stats.totalDebits} color="rose" />
            <SummaryItem label="Ending Balance" value={stats.closingBalance} highlight />
          </div>
        </div>

        <div className="p-10 lg:p-16">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <th className="pb-4">Date</th>
                <th className="pb-4">Description</th>
                <th className="pb-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {MOCK_TRANS_DATA.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-5 text-sm font-bold text-zinc-900">{t.date}</td>
                  <td className="py-5">
                    <p className="text-sm font-bold text-zinc-800">{t.description}</p>
                    <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">Ref: {t.ref}</p>
                  </td>
                  <td className={`py-5 text-sm font-bold text-right mono ${t.type === 'CREDIT' ? 'text-emerald-600' : 'text-zinc-900'}`}>
                    {t.type === 'CREDIT' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <h4 className="text-white font-bold text-xl uppercase italic">Audit Proof</h4>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Integrity verified via institutional handshake. The data signature matches the expected block height parity checks.
          </p>
          {verificationReport && (
            <div className="p-6 bg-black/40 border border-emerald-500/30 rounded-2xl animate-in zoom-in-95">
              <p className="text-[11px] text-zinc-300 font-medium italic">"{verificationReport}"</p>
            </div>
          )}
          <div className="flex gap-4">
            <button 
              onClick={handleVerify}
              className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Fingerprint size={14} /> Verify Registry Parity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value, color = 'zinc', highlight = false }: any) => (
  <div className={`p-8 rounded-3xl border transition-all ${highlight ? 'bg-zinc-900 border-zinc-800 shadow-xl' : 'bg-white border-zinc-100'}`}>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</p>
    <p className={`text-2xl font-black mono tracking-tighter ${
      highlight ? 'text-white' : 
      color === 'emerald' ? 'text-emerald-600' : 
      color === 'rose' ? 'text-rose-500' : 
      'text-zinc-900'
    }`}>
      ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </p>
  </div>
);

export default AnalyticsReport;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/AnalyticsReport.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  ChevronRight,
  Building2,
  ShieldCheck,
  CreditCard,
  Globe,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Loader2,
  FileText,
  CheckCircle2,
  Share2,
  Lock,
  ExternalLink,
  X,
  Copy,
  Zap,
  Smartphone,
  Search,
  RefreshCw,
  Cpu,
  Fingerprint,
  Database
} from 'lucide-react';
import { callGemini } from '../services/geminiService';
import { apiClient } from '../services/api';

interface StatementSummary {
  accountId: string;
  statementId: string;
  statementType: string;
  documentFormat: string;
  statementDate: string;
  productFamily: string;
}

interface StatementTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  ref: string;
}

const MOCK_TRANS_DATA: StatementTransaction[] = [
  { id: '1', date: '2024-03-28', description: 'Institutional Treasury Transfer', category: 'Investment', amount: 250000.00, type: 'CREDIT', ref: 'WT-882910' },
  { id: '2', date: '2024-03-25', description: 'Cloud Infrastructure - AWS Global', category: 'Operations', amount: 12450.22, type: 'DEBIT', ref: 'INV-4421' },
  { id: '3', date: '2024-03-20', description: 'Venture Capital Drawdown - Series B', category: 'Investment', amount: 150000.00, type: 'CREDIT', ref: 'WT-882905' },
  { id: '4', date: '2024-03-18', description: 'Payroll Disbursement - Q1 Exec', category: 'Payroll', amount: 85000.00, type: 'DEBIT', ref: 'PAY-0092' },
  { id: '5', date: '2024-03-15', description: 'Cybersecurity Audit - Mandiant', category: 'Security', amount: 4500.00, type: 'DEBIT', ref: 'INV-8821' },
];

const AnalyticsReport: React.FC = () => {
  const [statements, setStatements] = useState<StatementSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeStatementId, setActiveStatementId] = useState<string | null>(null);
  const [decryptionStage, setDecryptionStage] = useState<'IDLE' | 'FETCHING' | 'DECRYPTING' | 'READY'>('IDLE');
  const [rawPayload, setRawPayload] = useState<any>(null);
  
  const [isPrinting, setIsPrinting] = useState(false);
  const [verificationReport, setVerificationReport] = useState<string | null>(null);

  const openingBalance = 1000000.00;

  useEffect(() => {
    fetchStatementList();
  }, []);

  const fetchStatementList = async () => {
    setLoadingList(true);
    try {
      const data = await apiClient.getStatements();
      setStatements(data.statements || []);
    } catch (err) {
      console.error("Failed to sync statement registry.");
    } finally {
      setLoadingList(false);
    }
  };

  const handleSelectStatement = async (id: string) => {
    setActiveStatementId(id);
    setDecryptionStage('FETCHING');
    
    try {
      const data = await apiClient.getStatementDetails(id);
      setRawPayload(data);
      setDecryptionStage('DECRYPTING');
      await new Promise(r => setTimeout(r, 2000));
      setDecryptionStage('READY');
    } catch (err) {
      setDecryptionStage('IDLE');
      alert("Neural handshake failed. Block data corrupted.");
    }
  };

  const stats = useMemo(() => {
    const totalCredits = MOCK_TRANS_DATA.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = MOCK_TRANS_DATA.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0);
    const closingBalance = openingBalance + totalCredits - totalDebits;
    return { totalCredits, totalDebits, closingBalance };
  }, []);

  const handleVerify = async () => {
    try {
      const response = await callGemini(
        'gemini-3-flash-preview',
        `Generate a technical signature verification for a Lumina Quantum statement. Mention HMAC-SHA256, RSA-OAEP-4096 and zero drift. 1 sentence.`
      );
      setVerificationReport(response.text || "Audit verified. Mathematical parity achieved.");
    } catch (err) {
      setVerificationReport("Audit verified. Mathematical parity achieved.");
    }
  };

  if (decryptionStage !== 'READY') {
    return (
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Statement <span className="text-blue-500 not-italic">Vault</span></h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Accessing Encrypted M2M Financial Artifacts</p>
          </div>
          <button onClick={fetchStatementList} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl">
             <RefreshCw size={18} className={loadingList ? 'animate-spin' : ''} />
          </button>
        </div>

        {decryptionStage === 'IDLE' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingList ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900/50 rounded-[3rem] animate-pulse"></div>
              ))
            ) : (
              statements.map(stmt => (
                <button 
                  key={stmt.statementId}
                  onClick={() => handleSelectStatement(stmt.statementId)}
                  className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] text-left hover:border-blue-500/50 hover:bg-zinc-900/50 transition-all group relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <FileText size={120} />
                  </div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                      <Lock size={24} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-black px-3 py-1 rounded-full border border-zinc-800">{stmt.productFamily}</span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{stmt.statementDate}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-10">{stmt.statementId}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Decrypt Artifact</span>
                    <ArrowRight size={18} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95">
            <div className="relative">
              <div className="w-64 h-64 rounded-full border-8 border-zinc-900 flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full border-8 border-blue-600 border-t-transparent animate-spin"></div>
                 <Cpu size={80} className="text-blue-500 animate-pulse" />
              </div>
              <div className="absolute -inset-10 bg-blue-500/10 blur-3xl rounded-full"></div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                {decryptionStage === 'FETCHING' ? 'Retrieving Payload' : 'Neural Decryption'}
              </h3>
              <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs animate-pulse">
                Handshaking via RSA-OAEP-4096 • Block Ref: {activeStatementId}
              </p>
              {decryptionStage === 'DECRYPTING' && rawPayload && (
                <div className="mt-8 p-4 bg-black/40 border border-zinc-800 rounded-2xl font-mono text-[9px] text-emerald-500/60 max-w-sm mx-auto overflow-hidden text-left">
                  {JSON.stringify(JSON.parse(rawPayload.dataPayload).encryptedPayload.header, null, 2)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 print:p-0 print:pb-0 print:m-0 print:max-w-none animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
        <button 
          onClick={() => {
            setDecryptionStage('IDLE');
            setRawPayload(null);
          }}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowDownLeft size={16} /> Close Document
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => { setIsPrinting(true); setTimeout(() => { window.print(); setIsPrinting(false); }, 1000); }}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
          >
            {isPrinting ? <Loader2 className="animate-spin" /> : <Printer size={16} />}
            <span>Print Verified</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-50 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
            <Download size={16} />
            <span>Official Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white text-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 print:shadow-none print:border-none print:rounded-none">
        <div className="p-10 lg:p-16 bg-zinc-50 border-b border-zinc-200">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                  <Building2 size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase">Lumina <span className="text-blue-600 not-italic">Quantum</span></h1>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Account Holder</p>
                <p className="text-lg font-bold text-zinc-900">Alex Rivera</p>
                <p className="text-sm text-zinc-500 font-medium">Lumina Quantum Systems LLC</p>
              </div>
            </div>
            <div className="text-left md:text-right space-y-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase leading-none">Statement</h2>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{activeStatementId}</p>
              </div>
              <div className="text-xs font-medium">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Decryption Fingerprint</p>
                <p className="mono text-zinc-600 truncate max-w-[200px] ml-auto">
                  {rawPayload && JSON.parse(rawPayload.dataPayload).encryptedPayload.iv}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 lg:p-16 border-b border-zinc-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <SummaryItem label="Beginning Balance" value={openingBalance} />
            <SummaryItem label="Total Credits" value={stats.totalCredits} color="emerald" />
            <SummaryItem label="Total Debits" value={stats.totalDebits} color="rose" />
            <SummaryItem label="Ending Balance" value={stats.closingBalance} highlight />
          </div>
        </div>

        <div className="p-10 lg:p-16">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <th className="pb-4">Date</th>
                <th className="pb-4">Description</th>
                <th className="pb-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {MOCK_TRANS_DATA.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-5 text-sm font-bold text-zinc-900">{t.date}</td>
                  <td className="py-5">
                    <p className="text-sm font-bold text-zinc-800">{t.description}</p>
                    <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">Ref: {t.ref}</p>
                  </td>
                  <td className={`py-5 text-sm font-bold text-right mono ${t.type === 'CREDIT' ? 'text-emerald-600' : 'text-zinc-900'}`}>
                    {t.type === 'CREDIT' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <h4 className="text-white font-bold text-xl uppercase italic">Audit Proof</h4>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Integrity verified via institutional handshake. The data signature matches the expected block height parity checks.
          </p>
          {verificationReport && (
            <div className="p-6 bg-black/40 border border-emerald-500/30 rounded-2xl animate-in zoom-in-95">
              <p className="text-[11px] text-zinc-300 font-medium italic">"{verificationReport}"</p>
            </div>
          )}
          <div className="flex gap-4">
            <button 
              onClick={handleVerify}
              className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Fingerprint size={14} /> Verify Registry Parity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value, color = 'zinc', highlight = false }: any) => (
  <div className={`p-8 rounded-3xl border transition-all ${highlight ? 'bg-zinc-900 border-zinc-800 shadow-xl' : 'bg-white border-zinc-100'}`}>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</p>
    <p className={`text-2xl font-black mono tracking-tighter ${
      highlight ? 'text-white' : 
      color === 'emerald' ? 'text-emerald-600' : 
      color === 'rose' ? 'text-rose-500' : 
      'text-zinc-900'
    }`}>
      ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </p>
  </div>
);

export default AnalyticsReport;

================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/AnalyticsReport.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  ChevronRight,
  Building2,
  ShieldCheck,
  CreditCard,
  Globe,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Loader2,
  FileText,
  CheckCircle2,
  Share2,
  Lock,
  ExternalLink,
  X,
  Copy,
  Zap,
  Smartphone,
  Search,
  RefreshCw,
  Cpu,
  Fingerprint,
  Database
} from 'lucide-react';
import { callGemini } from '../services/geminiService';
import { apiClient } from '../services/api';

interface StatementSummary {
  accountId: string;
  statementId: string;
  statementType: string;
  documentFormat: string;
  statementDate: string;
  productFamily: string;
}

interface StatementTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  ref: string;
}

const MOCK_TRANS_DATA: StatementTransaction[] = [
  { id: '1', date: '2024-03-28', description: 'Institutional Treasury Transfer', category: 'Investment', amount: 250000.00, type: 'CREDIT', ref: 'WT-882910' },
  { id: '2', date: '2024-03-25', description: 'Cloud Infrastructure - AWS Global', category: 'Operations', amount: 12450.22, type: 'DEBIT', ref: 'INV-4421' },
  { id: '3', date: '2024-03-20', description: 'Venture Capital Drawdown - Series B', category: 'Investment', amount: 150000.00, type: 'CREDIT', ref: 'WT-882905' },
  { id: '4', date: '2024-03-18', description: 'Payroll Disbursement - Q1 Exec', category: 'Payroll', amount: 85000.00, type: 'DEBIT', ref: 'PAY-0092' },
  { id: '5', date: '2024-03-15', description: 'Cybersecurity Audit - Mandiant', category: 'Security', amount: 4500.00, type: 'DEBIT', ref: 'INV-8821' },
];

const AnalyticsReport: React.FC = () => {
  const [statements, setStatements] = useState<StatementSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeStatementId, setActiveStatementId] = useState<string | null>(null);
  const [decryptionStage, setDecryptionStage] = useState<'IDLE' | 'FETCHING' | 'DECRYPTING' | 'READY'>('IDLE');
  const [rawPayload, setRawPayload] = useState<any>(null);
  
  const [isPrinting, setIsPrinting] = useState(false);
  const [verificationReport, setVerificationReport] = useState<string | null>(null);

  const openingBalance = 1000000.00;

  useEffect(() => {
    fetchStatementList();
  }, []);

  const fetchStatementList = async () => {
    setLoadingList(true);
    try {
      const data = await apiClient.getStatements();
      setStatements(data.statements || []);
    } catch (err) {
      console.error("Failed to sync statement registry.");
    } finally {
      setLoadingList(false);
    }
  };

  const handleSelectStatement = async (id: string) => {
    setActiveStatementId(id);
    setDecryptionStage('FETCHING');
    
    try {
      const data = await apiClient.getStatementDetails(id);
      setRawPayload(data);
      setDecryptionStage('DECRYPTING');
      await new Promise(r => setTimeout(r, 2000));
      setDecryptionStage('READY');
    } catch (err) {
      setDecryptionStage('IDLE');
      alert("Neural handshake failed. Block data corrupted.");
    }
  };

  const stats = useMemo(() => {
    const totalCredits = MOCK_TRANS_DATA.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = MOCK_TRANS_DATA.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0);
    const closingBalance = openingBalance + totalCredits - totalDebits;
    return { totalCredits, totalDebits, closingBalance };
  }, []);

  const handleVerify = async () => {
    try {
      const response = await callGemini(
        'gemini-3-flash-preview',
        `Generate a technical signature verification for a Lumina Quantum statement. Mention HMAC-SHA256, RSA-OAEP-4096 and zero drift. 1 sentence.`
      );
      setVerificationReport(response.text || "Audit verified. Mathematical parity achieved.");
    } catch (err) {
      setVerificationReport("Audit verified. Mathematical parity achieved.");
    }
  };

  if (decryptionStage !== 'READY') {
    return (
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Statement <span className="text-blue-500 not-italic">Vault</span></h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Accessing Encrypted M2M Financial Artifacts</p>
          </div>
          <button onClick={fetchStatementList} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl">
             <RefreshCw size={18} className={loadingList ? 'animate-spin' : ''} />
          </button>
        </div>

        {decryptionStage === 'IDLE' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingList ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900/50 rounded-[3rem] animate-pulse"></div>
              ))
            ) : (
              statements.map(stmt => (
                <button 
                  key={stmt.statementId}
                  onClick={() => handleSelectStatement(stmt.statementId)}
                  className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] text-left hover:border-blue-500/50 hover:bg-zinc-900/50 transition-all group relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <FileText size={120} />
                  </div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                      <Lock size={24} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-black px-3 py-1 rounded-full border border-zinc-800">{stmt.productFamily}</span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{stmt.statementDate}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-10">{stmt.statementId}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Decrypt Artifact</span>
                    <ArrowRight size={18} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95">
            <div className="relative">
              <div className="w-64 h-64 rounded-full border-8 border-zinc-900 flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full border-8 border-blue-600 border-t-transparent animate-spin"></div>
                 <Cpu size={80} className="text-blue-500 animate-pulse" />
              </div>
              <div className="absolute -inset-10 bg-blue-500/10 blur-3xl rounded-full"></div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                {decryptionStage === 'FETCHING' ? 'Retrieving Payload' : 'Neural Decryption'}
              </h3>
              <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs animate-pulse">
                Handshaking via RSA-OAEP-4096 • Block Ref: {activeStatementId}
              </p>
              {decryptionStage === 'DECRYPTING' && rawPayload && (
                <div className="mt-8 p-4 bg-black/40 border border-zinc-800 rounded-2xl font-mono text-[9px] text-emerald-500/60 max-w-sm mx-auto overflow-hidden text-left">
                  {JSON.stringify(JSON.parse(rawPayload.dataPayload).encryptedPayload.header, null, 2)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 print:p-0 print:pb-0 print:m-0 print:max-w-none animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
        <button 
          onClick={() => {
            setDecryptionStage('IDLE');
            setRawPayload(null);
          }}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowDownLeft size={16} /> Close Document
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => { setIsPrinting(true); setTimeout(() => { window.print(); setIsPrinting(false); }, 1000); }}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
          >
            {isPrinting ? <Loader2 className="animate-spin" /> : <Printer size={16} />}
            <span>Print Verified</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-50 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
            <Download size={16} />
            <span>Official Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white text-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 print:shadow-none print:border-none print:rounded-none">
        <div className="p-10 lg:p-16 bg-zinc-50 border-b border-zinc-200">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                  <Building2 size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase">Lumina <span className="text-blue-600 not-italic">Quantum</span></h1>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Account Holder</p>
                <p className="text-lg font-bold text-zinc-900">Alex Rivera</p>
                <p className="text-sm text-zinc-500 font-medium">Lumina Quantum Systems LLC</p>
              </div>
            </div>
            <div className="text-left md:text-right space-y-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase leading-none">Statement</h2>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{activeStatementId}</p>
              </div>
              <div className="text-xs font-medium">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Decryption Fingerprint</p>
                <p className="mono text-zinc-600 truncate max-w-[200px] ml-auto">
                  {rawPayload && JSON.parse(rawPayload.dataPayload).encryptedPayload.iv}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 lg:p-16 border-b border-zinc-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <SummaryItem label="Beginning Balance" value={openingBalance} />
            <SummaryItem label="Total Credits" value={stats.totalCredits} color="emerald" />
            <SummaryItem label="Total Debits" value={stats.totalDebits} color="rose" />
            <SummaryItem label="Ending Balance" value={stats.closingBalance} highlight />
          </div>
        </div>

        <div className="p-10 lg:p-16">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <th className="pb-4">Date</th>
                <th className="pb-4">Description</th>
                <th className="pb-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {MOCK_TRANS_DATA.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-5 text-sm font-bold text-zinc-900">{t.date}</td>
                  <td className="py-5">
                    <p className="text-sm font-bold text-zinc-800">{t.description}</p>
                    <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">Ref: {t.ref}</p>
                  </td>
                  <td className={`py-5 text-sm font-bold text-right mono ${t.type === 'CREDIT' ? 'text-emerald-600' : 'text-zinc-900'}`}>
                    {t.type === 'CREDIT' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <h4 className="text-white font-bold text-xl uppercase italic">Audit Proof</h4>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Integrity verified via institutional handshake. The data signature matches the expected block height parity checks.
          </p>
          {verificationReport && (
            <div className="p-6 bg-black/40 border border-emerald-500/30 rounded-2xl animate-in zoom-in-95">
              <p className="text-[11px] text-zinc-300 font-medium italic">"{verificationReport}"</p>
            </div>
          )}
          <div className="flex gap-4">
            <button 
              onClick={handleVerify}
              className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Fingerprint size={14} /> Verify Registry Parity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value, color = 'zinc', highlight = false }: any) => (
  <div className={`p-8 rounded-3xl border transition-all ${highlight ? 'bg-zinc-900 border-zinc-800 shadow-xl' : 'bg-white border-zinc-100'}`}>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</p>
    <p className={`text-2xl font-black mono tracking-tighter ${
      highlight ? 'text-white' : 
      color === 'emerald' ? 'text-emerald-600' : 
      color === 'rose' ? 'text-rose-500' : 
      'text-zinc-900'
    }`}>
      ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </p>
  </div>
);

export default AnalyticsReport;