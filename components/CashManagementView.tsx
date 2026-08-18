// REPOSITORY SOURCE: diplomat-bit/G20 | PATH: diplomat-bit-G20-0199fa7/components/CashManagementView.tsx
================================================================================

import React from 'react';

const CashManagementView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Cash Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Available Cash</h3>
          <p className="text-3xl font-bold text-white">$8,450.00</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Transfer Funds</button>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Savings Rate</h3>
          <p className="text-3xl font-bold text-white">4.25% APY</p>
          <p className="text-green-400 text-sm mt-2">High-yield savings enabled</p>
        </div>
      </div>
    </div>
  );
};

export default CashManagementView;
