// REPOSITORY SOURCE: diplomat-bit/partnerportal-microsoft | PATH: diplomat-bit-partnerportal-microsoft-81d9840/src/components/PlaidLink.tsx
================================================================================

import React, { useCallback, useState, useEffect } from 'react';
import { usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccess } from 'react-plaid-link';

interface PlaidLinkProps {
  onSuccess: (publicToken: string) => void;
}

export const PlaidLink: React.FC<PlaidLinkProps> = ({ onSuccess }) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const generateToken = async () => {
    try {
      const response = await fetch('/api/create_link_token', {
        method: 'POST',
      });
      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (error) {
      console.error('Error generating link token:', error);
    }
  };

  useEffect(() => {
    generateToken();
  }, []);

  const handleOnSuccess = useCallback<PlaidLinkOnSuccess>((public_token, metadata) => {
    onSuccess(public_token);
  }, [onSuccess]);

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess: handleOnSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="px-4 py-2 bg-[#0078D4] text-white rounded font-semibold hover:bg-[#005A9E] transition-colors disabled:opacity-50"
    >
      Connect Bank Account
    </button>
  );
};
