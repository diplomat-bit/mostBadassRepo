// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/shared/Amount.tsx
================================================================================


import React from 'react';

export const Amount: React.FC<{ amount: number; currency: string; className?: string }> = ({ amount, currency, className }) => (
  <span className={className}>
    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)}
  </span>
);


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/shared/Amount.tsx
================================================================================

import React from 'react';

interface AmountProps {
  amount: number;
  currency?: string;
  className?: string;
}

export const Amount: React.FC<AmountProps> = ({ amount, currency = 'USD', className }) => {
  const safeCurrency = (currency && currency.length === 3) ? currency.toUpperCase() : 'USD';

  try {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
    }).format(amount / 100);

    return <span className={className}>{formatted}</span>;
  } catch (e) {
    return <span className={className}>{safeCurrency} {(amount / 100).toFixed(2)}</span>;
  }
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/shared/Amount.tsx
================================================================================

import React from 'react';

interface AmountProps {
  amount: number;
  currency?: string;
  className?: string;
}

export const Amount: React.FC<AmountProps> = ({ amount, currency = 'USD', className }) => {
  const safeCurrency = (currency && currency.length === 3) ? currency.toUpperCase() : 'USD';

  try {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
    }).format(amount / 100);

    return <span className={className}>{formatted}</span>;
  } catch (e) {
    return <span className={className}>{safeCurrency} {(amount / 100).toFixed(2)}</span>;
  }
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/shared/Amount.tsx
================================================================================

import React from 'react';

export const Amount: React.FC<{ amount: number; currency: string; className?: string }> = ({ amount, currency, className }) => (
  <span className={className}>
    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)}
  </span>
);

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/shared/Amount.tsx
================================================================================

import React from 'react';

interface AmountProps {
  amount: number;
  currency?: string;
  className?: string;
}

export const Amount: React.FC<AmountProps> = ({ amount, currency = 'USD', className }) => {
  const safeCurrency = (currency && currency.length === 3) ? currency.toUpperCase() : 'USD';

  try {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
    }).format(amount / 100);

    return <span className={className}>{formatted}</span>;
  } catch (e) {
    return <span className={className}>{safeCurrency} {(amount / 100).toFixed(2)}</span>;
  }
};