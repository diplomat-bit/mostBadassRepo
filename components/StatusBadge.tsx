// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/components/StatusBadge.tsx
================================================================================

import React from 'react';

const colors: Record<string, string> = {
  success: 'bg-green-900 text-green-200 border-green-700',
  warning: 'bg-yellow-900 text-yellow-200 border-yellow-700',
  danger: 'bg-red-900 text-red-200 border-red-700',
  default: 'bg-gray-700 text-gray-200 border-gray-500',
};

export const StatusBadge: React.FC<{ status: string; color: string }> = ({ status, color }) => (
  <span className={`px-2 py-0.5 rounded border text-xs uppercase tracking-wide font-semibold ${colors[color] || colors.default}`}>
    {status}
  </span>
);

================================================================================
// APPENDED FROM REPO: diplomat-bit/gatekeeper-bank-verification-ModernTreasury | ORIGINAL PATH: diplomat-bit-gatekeeper-bank-verification-ModernTreasury-c0701fa/components/StatusBadge.tsx
================================================================================

import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, ShieldX } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (s: string) => {
    switch (s) {
      case 'verified':
        return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: ShieldCheck, label: 'Verified' };
      case 'pending_verification':
        return { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Clock, label: 'Pending Verification' };
      case 'unverified':
        return { color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20', icon: ShieldX, label: 'Unverified' };
      default:
        return { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: ShieldAlert, label: status };
    }
  };

  const style = getStatusStyles(status);
  const Icon = style.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${style.bg} ${style.border}`}>
      <Icon className={`w-4 h-4 ${style.color}`} />
      <span className={`text-sm font-semibold ${style.color} uppercase tracking-wide`}>
        {style.label}
      </span>
    </div>
  );
};