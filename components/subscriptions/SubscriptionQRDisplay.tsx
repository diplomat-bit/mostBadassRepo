// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/subscriptions/SubscriptionQRDisplay.tsx
================================================================================

import React from 'react';
import QRCode from 'qrcode.react';

interface SubscriptionQRDisplayProps {
  subscriptionId: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  fgColor?: string;
  bgColor?: string;
  includeMargin?: boolean;
}

const SubscriptionQRDisplay: React.FC<SubscriptionQRDisplayProps> = ({
  subscriptionId,
  size = 128,
  level = 'M',
  fgColor = '#000000',
  bgColor = '#ffffff',
  includeMargin = true,
}) => {
  if (!subscriptionId) {
    return <div className="text-red-500">Subscription ID is missing.</div>;
  }

  return (
    <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md">
      <QRCode
        value={subscriptionId}
        size={size}
        level={level}
        fgColor={fgColor}
        bgColor={bgColor}
        includeMargin={includeMargin}
      />
    </div>
  );
};

export default SubscriptionQRDisplay;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/subscriptions/SubscriptionQRDisplay.tsx
================================================================================

import React from 'react';
import QRCode from 'qrcode.react';

interface SubscriptionQRDisplayProps {
  subscriptionId: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  fgColor?: string;
  bgColor?: string;
  includeMargin?: boolean;
}

const SubscriptionQRDisplay: React.FC<SubscriptionQRDisplayProps> = ({
  subscriptionId,
  size = 128,
  level = 'M',
  fgColor = '#000000',
  bgColor = '#ffffff',
  includeMargin = true,
}) => {
  if (!subscriptionId) {
    return <div className="text-red-500">Subscription ID is missing.</div>;
  }

  return (
    <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md">
      <QRCode
        value={subscriptionId}
        size={size}
        level={level}
        fgColor={fgColor}
        bgColor={bgColor}
        includeMargin={includeMargin}
      />
    </div>
  );
};

export default SubscriptionQRDisplay;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/subscriptions/SubscriptionQRDisplay.tsx
================================================================================

import React from 'react';
import QRCode from 'qrcode.react';

interface SubscriptionQRDisplayProps {
  subscriptionId: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  fgColor?: string;
  bgColor?: string;
  includeMargin?: boolean;
}

const SubscriptionQRDisplay: React.FC<SubscriptionQRDisplayProps> = ({
  subscriptionId,
  size = 128,
  level = 'M',
  fgColor = '#000000',
  bgColor = '#ffffff',
  includeMargin = true,
}) => {
  if (!subscriptionId) {
    return <div className="text-red-500">Subscription ID is missing.</div>;
  }

  return (
    <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md">
      <QRCode
        value={subscriptionId}
        size={size}
        level={level}
        fgColor={fgColor}
        bgColor={bgColor}
        includeMargin={includeMargin}
      />
    </div>
  );
};

export default SubscriptionQRDisplay;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/subscriptions/SubscriptionQRDisplay.tsx
================================================================================

import React from 'react';
import QRCode from 'qrcode.react';

interface SubscriptionQRDisplayProps {
  subscriptionId: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  fgColor?: string;
  bgColor?: string;
  includeMargin?: boolean;
}

const SubscriptionQRDisplay: React.FC<SubscriptionQRDisplayProps> = ({
  subscriptionId,
  size = 128,
  level = 'M',
  fgColor = '#000000',
  bgColor = '#ffffff',
  includeMargin = true,
}) => {
  if (!subscriptionId) {
    return <div className="text-red-500">Subscription ID is missing.</div>;
  }

  return (
    <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md">
      <QRCode
        value={subscriptionId}
        size={size}
        level={level}
        fgColor={fgColor}
        bgColor={bgColor}
        includeMargin={includeMargin}
      />
    </div>
  );
};

export default SubscriptionQRDisplay;