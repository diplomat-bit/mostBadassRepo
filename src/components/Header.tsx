// REPOSITORY SOURCE: diplomat-bit/partnerportal-microsoft | PATH: diplomat-bit-partnerportal-microsoft-81d9840/src/components/Header.tsx
================================================================================

import React from 'react';
import { Download, RefreshCw, Columns, MessageSquare, X } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-[#EDEBE9]">
      <div className="px-6 py-2 flex items-center text-xs text-[#605E5C] gap-2">
        <span>Dashboard</span>
        <span>/</span>
        <span>Accounts</span>
      </div>
      
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-[#323130]">Sovereign Bank</h1>
          <span className="text-2xl text-[#605E5C]">|</span>
          <h2 className="text-2xl font-light text-[#323130]">Transaction History</h2>
          <button className="ml-2 text-[#605E5C] hover:text-[#323130]">
            <span className="text-xl">...</span>
          </button>
        </div>
        <button className="p-1 hover:bg-[#F3F2F1] rounded">
          <X size={20} className="text-[#605E5C]" />
        </button>
      </div>

      <div className="px-6 py-2 flex items-center gap-6 border-t border-[#EDEBE9]">
        <button className="flex items-center gap-2 text-sm text-[#0078D4] hover:underline">
          <Download size={16} />
          <span>Export CSV</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-[#0078D4] hover:underline">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-[#0078D4] hover:underline">
          <Columns size={16} />
          <span>View Options</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-[#0078D4] hover:underline">
          <MessageSquare size={16} />
          <span>Support</span>
        </button>
      </div>
    </header>
  );
};
