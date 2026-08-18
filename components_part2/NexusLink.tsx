// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/components/NexusLink.tsx
================================================================================

import React from 'react';

export const NexusLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <span className="text-blue-400 hover:text-blue-300 cursor-pointer underline">
    {children}
  </span>
);