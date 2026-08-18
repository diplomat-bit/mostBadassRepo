// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/stripe-nexus/stripe-nexus-provider.tsx
================================================================================


import React, { useContext, createContext } from 'react';
const Context = createContext({ data: { charge: [] } });
export const useStripeNexus = () => useContext(Context);
      