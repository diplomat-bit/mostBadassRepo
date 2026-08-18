// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/components/Amount.tsx
================================================================================

import React from 'react';

export const Amount: React.FC<{ amount: number; currency: string; className?: string }> = ({ amount, currency, className }) => (
  <span className={className}>
    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)}
  </span>
);