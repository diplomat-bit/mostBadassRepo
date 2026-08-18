// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/shared (2)/Amount.tsx
================================================================================


import React from 'react';

export const Amount: React.FC<{ amount: number; currency: string; className?: string }> = ({ amount, currency, className }) => (
  <span className={className}>
    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)}
  </span>
);


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/shared (2)/Amount.tsx
================================================================================


import React from 'react';

export const Amount: React.FC<{ amount: number; currency: string; className?: string }> = ({ amount, currency, className }) => (
  <span className={className}>
    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)}
  </span>
);


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/shared (2)/Amount.tsx
================================================================================


import React from 'react';

export const Amount: React.FC<{ amount: number; currency: string; className?: string }> = ({ amount, currency, className }) => (
  <span className={className}>
    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)}
  </span>
);
