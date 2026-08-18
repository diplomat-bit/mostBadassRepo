// REPOSITORY SOURCE: diplomat-bit/partnerportal-microsoft | PATH: diplomat-bit-partnerportal-microsoft-81d9840/src/components/FilterBar.tsx
================================================================================

import React from 'react';
import { Plus } from 'lucide-react';

interface FilterChipProps {
  label: string;
  value: string;
  isBold?: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, value, isBold }) => (
  <div className="flex items-center bg-[#F3F2F1] rounded-full px-4 py-1.5 text-sm cursor-pointer hover:bg-[#EDEBE9] transition-colors">
    <span className="text-[#605E5C] mr-1">{label} :</span>
    <span className={`${isBold ? 'font-bold' : 'font-semibold'} text-[#323130]`}>{value}</span>
  </div>
);

export const FilterBar: React.FC = () => {
  return (
    <div className="px-6 py-4 flex flex-wrap items-center gap-3 bg-white">
      <FilterChip label="Date Range" value="Last 30 Days" isBold />
      <FilterChip label="Account" value="All Accounts" />
      <FilterChip label="Category" value="All Categories" />
      <FilterChip label="Transaction Type" value="All" />
      <FilterChip label="Status" value="All" />
      <button className="flex items-center gap-1 text-sm text-[#0078D4] hover:underline ml-2">
        <Plus size={16} />
        <span>Add filters</span>
      </button>
    </div>
  );
};
