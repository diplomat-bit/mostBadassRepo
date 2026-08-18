// REPOSITORY SOURCE: diplomat-bit/partnerportal-microsoft | PATH: diplomat-bit-partnerportal-microsoft-81d9840/src/components/DataTable.tsx
================================================================================

import React from 'react';
import { ArrowUpDown, CheckCircle2, Clock, XCircle, Calendar, Activity } from 'lucide-react';
import { TransactionEntry } from '../types';

const StatusIcon: React.FC<{ status: TransactionEntry['status'] }> = ({ status }) => {
  switch (status) {
    case 'Completed': return <CheckCircle2 size={16} className="text-[#107C10]" />;
    case 'Pending': return <Clock size={16} className="text-[#797775]" />;
    case 'Failed': return <XCircle size={16} className="text-[#A4262C]" />;
    case 'Scheduled': return <Calendar size={16} className="text-[#0078D4]" />;
    default: return null;
  }
};

interface DataTableProps {
  onSelectLog: (log: TransactionEntry) => void;
  selectedLogId?: string;
  transactions: TransactionEntry[];
}

export const DataTable: React.FC<DataTableProps> = ({ onSelectLog, selectedLogId, transactions }) => {
  return (
    <div className="flex-1 overflow-auto bg-white">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-[#EDEBE9]">
            {[
              'Date', 'Description', 'Category', 'Amount', 'Status', 
              'Account', 'Merchant', 'Reference'
            ].map((header) => (
              <th key={header} className="text-left px-4 py-3 font-semibold text-[#323130] hover:bg-[#F3F2F1] cursor-pointer group">
                <div className="flex items-center justify-between">
                  <span>{header}</span>
                  <ArrowUpDown size={14} className="text-[#605E5C] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((log) => (
            <tr 
              key={log.id} 
              className={`border-b border-[#EDEBE9] hover:bg-[#F3F2F1] transition-colors cursor-pointer ${
                selectedLogId === log.id ? 'bg-[#E5F1FF]' : ''
              }`}
              onClick={() => onSelectLog(log)}
            >
              <td className="px-4 py-3 text-[#323130] whitespace-nowrap">{log.date}</td>
              <td className="px-4 py-3 text-[#323130] font-medium">{log.description}</td>
              <td className="px-4 py-3 text-[#323130]">{log.category}</td>
              <td className={`px-4 py-3 font-semibold ${log.amount < 0 ? 'text-[#107C10]' : 'text-[#A4262C]'}`}>
                {log.amount < 0 ? '+' : '-'}${Math.abs(log.amount).toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <StatusIcon status={log.status} />
                  <span className="text-[#323130]">{log.status}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-[#605E5C]">{log.account}</td>
              <td className="px-4 py-3 text-[#323130]">{log.merchant}</td>
              <td className="px-4 py-3 text-[#605E5C] font-mono text-xs">{log.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {transactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-[#605E5C]">
          <Activity size={48} className="mb-4 opacity-20" />
          <p>No transactions found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};
