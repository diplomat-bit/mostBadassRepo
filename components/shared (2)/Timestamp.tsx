// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/shared (2)/Timestamp.tsx
================================================================================


import React from 'react';

export const Timestamp: React.FC<{ ts: number }> = ({ ts }) => (
  <span title={new Date(ts * 1000).toISOString()}>
    {new Date(ts * 1000).toLocaleString()}
  </span>
);


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/shared (2)/Timestamp.tsx
================================================================================


import React from 'react';

export const Timestamp: React.FC<{ ts: number }> = ({ ts }) => (
  <span title={new Date(ts * 1000).toISOString()}>
    {new Date(ts * 1000).toLocaleString()}
  </span>
);


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/shared (2)/Timestamp.tsx
================================================================================


import React from 'react';

export const Timestamp: React.FC<{ ts: number }> = ({ ts }) => (
  <span title={new Date(ts * 1000).toISOString()}>
    {new Date(ts * 1000).toLocaleString()}
  </span>
);
