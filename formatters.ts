// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/formatters.ts
================================================================================


export const formatCurrency = (amount: number, currency: string) => `${amount} ${currency}`;
export const formatDate = (date: number | string) => new Date(date).toLocaleDateString();
      