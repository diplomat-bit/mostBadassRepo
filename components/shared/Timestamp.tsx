// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/shared/Timestamp.tsx
================================================================================


import React from 'react';

export const Timestamp: React.FC<{ ts: number }> = ({ ts }) => (
  <span title={new Date(ts * 1000).toISOString()}>
    {new Date(ts * 1000).toLocaleString()}
  </span>
);


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/shared/Timestamp.tsx
================================================================================

import React from 'react';

interface TimestampProps {
  ts?: number | string | null;
  className?: string;
}

export const Timestamp: React.FC<TimestampProps> = ({ ts, className }) => {
  if (!ts) return <span className="text-gray-500 italic">N/A</span>;

  // Stripe sends seconds (10 digits), JS needs milliseconds (13 digits)
  const dateValue = typeof ts === 'number' && ts < 10000000000 ? ts * 1000 : ts;
  const date = new Date(dateValue);

  // Check if the date is actually valid before calling toISOString()
  if (isNaN(date.getTime())) {
    return <span className="text-gray-500 italic">Invalid Date</span>;
  }

  return (
    <span className={className} title={date.toISOString()}>
      {date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </span>
  );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/shared/Timestamp.tsx
================================================================================

import React from 'react';

interface TimestampProps {
  ts?: number | string | null;
  className?: string;
}

export const Timestamp: React.FC<TimestampProps> = ({ ts, className }) => {
  if (!ts) return <span className="text-gray-500 italic">N/A</span>;

  // Stripe sends seconds (10 digits), JS needs milliseconds (13 digits)
  const dateValue = typeof ts === 'number' && ts < 10000000000 ? ts * 1000 : ts;
  const date = new Date(dateValue);

  // Check if the date is actually valid before calling toISOString()
  if (isNaN(date.getTime())) {
    return <span className="text-gray-500 italic">Invalid Date</span>;
  }

  return (
    <span className={className} title={date.toISOString()}>
      {date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </span>
  );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/shared/Timestamp.tsx
================================================================================

import React from 'react';

export const Timestamp: React.FC<{ ts: number }> = ({ ts }) => (
  <span title={new Date(ts * 1000).toISOString()}>
    {new Date(ts * 1000).toLocaleString()}
  </span>
);

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/shared/Timestamp.tsx
================================================================================

import React from 'react';

interface TimestampProps {
  ts?: number | string | null;
  className?: string;
}

export const Timestamp: React.FC<TimestampProps> = ({ ts, className }) => {
  if (!ts) return <span className="text-gray-500 italic">N/A</span>;

  // Stripe sends seconds (10 digits), JS needs milliseconds (13 digits)
  const dateValue = typeof ts === 'number' && ts < 10000000000 ? ts * 1000 : ts;
  const date = new Date(dateValue);

  // Check if the date is actually valid before calling toISOString()
  if (isNaN(date.getTime())) {
    return <span className="text-gray-500 italic">Invalid Date</span>;
  }

  return (
    <span className={className} title={date.toISOString()}>
      {date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </span>
  );
};