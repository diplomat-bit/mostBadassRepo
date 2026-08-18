// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/Documents.tsx
================================================================================


import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  Tag,
  Loader2
} from 'lucide-react';
import { Document } from '../types/index.ts';

const MOCK_DOCS: Document[] = [
  { id: 'DOC-8821', documentableId: 'TXN-9021', documentableType: 'transaction', documentType: 'Invoice', fileName: 'INV_CloudCompute_Q1.pdf', size: 124000, createdAt: '2024-03-31', format: 'PDF' },
  { id: 'DOC-9942', documentableId: 'IA-4401', documentableType: 'internal_account', documentType: 'Tax Form', fileName: 'US_1099_Lumina.pdf', size: 450000, createdAt: '2024-03-15', format: 'PDF' },
  { id: 'DOC-1025', documentableId: 'PO-5512', documentableType: 'payment_order', documentType: 'JSON Payload', fileName: 'PO_DISBURSE_882.json', size: 12000, createdAt: '2024-03-30', format: 'JSON' },
];

const Documents: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportArchive = async () => {
    setIsExporting(true);
    // Artificial latency for institutional "packaging" feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const exportData = {
      vault_export_id: `LQI-EXP-${Math.random().toString(36).substring(7).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      record_count: MOCK_DOCS.length,
      documents: MOCK_DOCS,
      checksum: "sha256-f2e3c4d5a6b7c8d9e0f1..."
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `Lumina_Vault_Archive_${new Date().toISOString().split('T')[0]}.json`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Institutional <span className="text-blue-500 not-italic">Vault</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Storage for Compliance & Treasury Records</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExportArchive}
            disabled={isExporting}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span>{isExporting ? 'Packaging Archive...' : 'Export Archive'}</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30">
            <FileText size={14} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex flex-col md:flex-row justify-between items-center bg-black/20 gap-8">
          <div className="flex items-center space-x-10 w-full md:w-auto">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Compliant Storage</h3>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
              <input 
                placeholder="Search Archive..."
                className="w-full bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-5">Record Identifier</th>
                <th className="py-5">Associated Object</th>
                <th className="py-5">Metadata</th>
                <th className="py-5">Created At</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {MOCK_DOCS.map(doc => (
                <tr key={doc.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic truncate max-w-[200px]">{doc.fileName}</p>
                        <p className="text-[10px] text-zinc-600 font-mono font-bold mt-1 uppercase tracking-tighter">ID: {doc.id} • {(doc.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <Tag size={12} className="text-zinc-600" />
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        {doc.documentableType.replace('_', ' ')}: <span className="text-white mono">{doc.documentableId}</span>
                      </p>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[8px] font-black uppercase text-zinc-500 rounded">{doc.format}</span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{doc.documentType}</span>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Calendar size={12} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">{doc.createdAt}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-500 hover:text-white" title="Download"><Download size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><ChevronRight size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/Documents.tsx
================================================================================


import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  Tag,
  Loader2
} from 'lucide-react';
import { Document } from '../types/index.ts';

const MOCK_DOCS: Document[] = [
  { id: 'DOC-8821', documentableId: 'TXN-9021', documentableType: 'transaction', documentType: 'Invoice', fileName: 'INV_CloudCompute_Q1.pdf', size: 124000, createdAt: '2024-03-31', format: 'PDF' },
  { id: 'DOC-9942', documentableId: 'IA-4401', documentableType: 'internal_account', documentType: 'Tax Form', fileName: 'US_1099_Lumina.pdf', size: 450000, createdAt: '2024-03-15', format: 'PDF' },
  { id: 'DOC-1025', documentableId: 'PO-5512', documentableType: 'payment_order', documentType: 'JSON Payload', fileName: 'PO_DISBURSE_882.json', size: 12000, createdAt: '2024-03-30', format: 'JSON' },
];

const Documents: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportArchive = async () => {
    setIsExporting(true);
    // Artificial latency for institutional "packaging" feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const exportData = {
      vault_export_id: `LQI-EXP-${Math.random().toString(36).substring(7).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      record_count: MOCK_DOCS.length,
      documents: MOCK_DOCS,
      checksum: "sha256-f2e3c4d5a6b7c8d9e0f1..."
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `Lumina_Vault_Archive_${new Date().toISOString().split('T')[0]}.json`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Institutional <span className="text-blue-500 not-italic">Vault</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Storage for Compliance & Treasury Records</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExportArchive}
            disabled={isExporting}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span>{isExporting ? 'Packaging Archive...' : 'Export Archive'}</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30">
            <FileText size={14} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex flex-col md:flex-row justify-between items-center bg-black/20 gap-8">
          <div className="flex items-center space-x-10 w-full md:w-auto">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Compliant Storage</h3>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
              <input 
                placeholder="Search Archive..."
                className="w-full bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-5">Record Identifier</th>
                <th className="py-5">Associated Object</th>
                <th className="py-5">Metadata</th>
                <th className="py-5">Created At</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {MOCK_DOCS.map(doc => (
                <tr key={doc.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic truncate max-w-[200px]">{doc.fileName}</p>
                        <p className="text-[10px] text-zinc-600 font-mono font-bold mt-1 uppercase tracking-tighter">ID: {doc.id} • {(doc.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <Tag size={12} className="text-zinc-600" />
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        {doc.documentableType.replace('_', ' ')}: <span className="text-white mono">{doc.documentableId}</span>
                      </p>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[8px] font-black uppercase text-zinc-500 rounded">{doc.format}</span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{doc.documentType}</span>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Calendar size={12} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">{doc.createdAt}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-500 hover:text-white" title="Download"><Download size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><ChevronRight size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/Documents.tsx
================================================================================


import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  Tag,
  Loader2
} from 'lucide-react';
import { Document } from '../types/index.ts';

const MOCK_DOCS: Document[] = [
  { id: 'DOC-8821', documentableId: 'TXN-9021', documentableType: 'transaction', documentType: 'Invoice', fileName: 'INV_CloudCompute_Q1.pdf', size: 124000, createdAt: '2024-03-31', format: 'PDF' },
  { id: 'DOC-9942', documentableId: 'IA-4401', documentableType: 'internal_account', documentType: 'Tax Form', fileName: 'US_1099_Lumina.pdf', size: 450000, createdAt: '2024-03-15', format: 'PDF' },
  { id: 'DOC-1025', documentableId: 'PO-5512', documentableType: 'payment_order', documentType: 'JSON Payload', fileName: 'PO_DISBURSE_882.json', size: 12000, createdAt: '2024-03-30', format: 'JSON' },
];

const Documents: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportArchive = async () => {
    setIsExporting(true);
    // Artificial latency for institutional "packaging" feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const exportData = {
      vault_export_id: `LQI-EXP-${Math.random().toString(36).substring(7).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      record_count: MOCK_DOCS.length,
      documents: MOCK_DOCS,
      checksum: "sha256-f2e3c4d5a6b7c8d9e0f1..."
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `Lumina_Vault_Archive_${new Date().toISOString().split('T')[0]}.json`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Institutional <span className="text-blue-500 not-italic">Vault</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Storage for Compliance & Treasury Records</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExportArchive}
            disabled={isExporting}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span>{isExporting ? 'Packaging Archive...' : 'Export Archive'}</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30">
            <FileText size={14} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-zinc-900 flex flex-col md:flex-row justify-between items-center bg-black/20 gap-8">
          <div className="flex items-center space-x-10 w-full md:w-auto">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-white font-black uppercase tracking-[0.2em] italic">Compliant Storage</h3>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
              <input 
                placeholder="Search Archive..."
                className="w-full bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-5">Record Identifier</th>
                <th className="py-5">Associated Object</th>
                <th className="py-5">Metadata</th>
                <th className="py-5">Created At</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {MOCK_DOCS.map(doc => (
                <tr key={doc.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase italic truncate max-w-[200px]">{doc.fileName}</p>
                        <p className="text-[10px] text-zinc-600 font-mono font-bold mt-1 uppercase tracking-tighter">ID: {doc.id} • {(doc.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <Tag size={12} className="text-zinc-600" />
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        {doc.documentableType.replace('_', ' ')}: <span className="text-white mono">{doc.documentableId}</span>
                      </p>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[8px] font-black uppercase text-zinc-500 rounded">{doc.format}</span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{doc.documentType}</span>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Calendar size={12} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">{doc.createdAt}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-500 hover:text-white" title="Download"><Download size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><ChevronRight size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;
