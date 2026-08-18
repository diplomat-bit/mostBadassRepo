// REPOSITORY SOURCE: diplomat-bit/G20 | PATH: diplomat-bit-G20-0199fa7/context/Web3Provider.tsx
================================================================================


import React, { useMemo } from 'react';
import { WagmiProvider } from 'wagmi';
import { mainnet, base } from 'viem/chains';
import type { AppKitNetwork } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit';
import { QueryClientProvider } from '@tanstack/react-query';
// FIX: QueryClient is imported from @tanstack/query-core as some build environments fail to resolve it from the @tanstack/react-query entry point.
import { QueryClient } from '@tanstack/query-core';

const queryClient = new QueryClient();

/**
 * CRITICAL: Stable Project ID for cryptographic anchoring. 
 * DO NOT ALLOW USER OVERRIDE - This breaks Reown handshake and domain verification.
 */
const PROJECT_ID = '04a6c1309e33a508aa9cffdcf6bd5cc6';

let appKitInstance: any = null;

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const config = useMemo(() => {
    const metadata = {
      name: 'Demai Sovereign',
      description: 'The World\'s Most Powerful Financial Nexus',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://citibankdemobusiness.dev',
      icons: ['https://avatars.githubusercontent.com/u/221693154?s=48&v=4']
    };

    const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet as AppKitNetwork, base as AppKitNetwork];

    const wagmiAdapter = new WagmiAdapter({
      networks,
      projectId: PROJECT_ID,
      ssr: true
    });

    if (!appKitInstance) {
      appKitInstance = createAppKit({
        adapters: [wagmiAdapter],
        networks,
        projectId: PROJECT_ID,
        metadata,
        features: {
          analytics: true,
          socials: ['google', 'x', 'github', 'discord', 'apple'],
          email: true,
        },
        allWallets: 'SHOW',
        connectorImages: {
          coinbaseWallet: 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4'
        }
      });
    }

    return wagmiAdapter.wagmiConfig;
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}