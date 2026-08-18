// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/shared/BillingDetails.tsx
================================================================================


import React from 'react';
import { DetailItem } from './DetailItem';

export const BillingDetails: React.FC<{ details: any }> = ({ details }) => {
  if (!details) return null;
  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">Billing Details</h4>
      <DetailItem title="Name" value={details.name || 'N/A'} />
      <DetailItem title="Email" value={details.email || 'N/A'} />
      <DetailItem title="Phone" value={details.phone || 'N/A'} />
      {details.address && (
        <div className="mt-2 text-sm text-gray-400">
          <p>{details.address.line1}</p>
          {details.address.line2 && <p>{details.address.line2}</p>}
          <p>{details.address.city}, {details.address.state} {details.address.postal_code}</p>
          <p>{details.address.country}</p>
        </div>
      )}
    </div>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/shared/BillingDetails.tsx
================================================================================

import React from 'react';
import { DetailItem } from './DetailItem';

export const BillingDetails: React.FC<{ details: any }> = ({ details }) => {
  if (!details) return null;
  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">Billing Details</h4>
      <DetailItem title="Name" value={details.name || 'N/A'} />
      <DetailItem title="Email" value={details.email || 'N/A'} />
      <DetailItem title="Phone" value={details.phone || 'N/A'} />
      {details.address && (
        <div className="mt-2 text-sm text-gray-400">
          <p>{details.address.street}</p>
          {details.address.line2 && <p>{details.address.line2}</p>}
          <p>{details.address.city}, {details.address.state} {details.address.zip}</p>
          <p>{details.address.country}</p>
        </div>
      )}
    </div>
  );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/shared/BillingDetails.tsx
================================================================================

import React from 'react';
import { DetailItem } from './DetailItem';

export const BillingDetails: React.FC<{ details: any }> = ({ details }) => {
  if (!details) return null;
  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">Billing Details</h4>
      <DetailItem title="Name" value={details.name || 'N/A'} />
      <DetailItem title="Email" value={details.email || 'N/A'} />
      <DetailItem title="Phone" value={details.phone || 'N/A'} />
      {details.address && (
        <div className="mt-2 text-sm text-gray-400">
          <p>{details.address.street}</p>
          {details.address.line2 && <p>{details.address.line2}</p>}
          <p>{details.address.city}, {details.address.state} {details.address.zip}</p>
          <p>{details.address.country}</p>
        </div>
      )}
    </div>
  );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/shared/BillingDetails.tsx
================================================================================

import React from 'react';
import { DetailItem } from './DetailItem';

export const BillingDetails: React.FC<{ details: any }> = ({ details }) => {
  if (!details) return null;
  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">Billing Details</h4>
      <DetailItem title="Name" value={details.name || 'N/A'} />
      <DetailItem title="Email" value={details.email || 'N/A'} />
      <DetailItem title="Phone" value={details.phone || 'N/A'} />
      {details.address && (
        <div className="mt-2 text-sm text-gray-400">
          <p>{details.address.line1}</p>
          {details.address.line2 && <p>{details.address.line2}</p>}
          <p>{details.address.city}, {details.address.state} {details.address.postal_code}</p>
          <p>{details.address.country}</p>
        </div>
      )}
    </div>
  );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/shared/BillingDetails.tsx
================================================================================

import React from 'react';
import { DetailItem } from './DetailItem';

export const BillingDetails: React.FC<{ details: any }> = ({ details }) => {
  if (!details) return null;
  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">Billing Details</h4>
      <DetailItem title="Name" value={details.name || 'N/A'} />
      <DetailItem title="Email" value={details.email || 'N/A'} />
      <DetailItem title="Phone" value={details.phone || 'N/A'} />
      {details.address && (
        <div className="mt-2 text-sm text-gray-400">
          <p>{details.address.street}</p>
          {details.address.line2 && <p>{details.address.line2}</p>}
          <p>{details.address.city}, {details.address.state} {details.address.zip}</p>
          <p>{details.address.country}</p>
        </div>
      )}
    </div>
  );
};