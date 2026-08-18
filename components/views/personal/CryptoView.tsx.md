// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/CryptoView.tsx.md
================================================================================

# The New Dominion

This is the new frontier. A space where value is not granted by a central authority, but is forged and secured by cryptography and consensus. It is a testament to a different kind of powerâ€”not in institutions, but in immutable logic. To operate here is to engage with a world where ownership is absolute and the rules are written in code.

---

### A Fable for the Builder: The Uncharted Waters

(For centuries, the world of finance was a map with known borders. A world of nations, of central banks, of intermediaries. But then, a new continent appeared on the horizon. A wild and powerful land, governed not by kings, but by mathematics. The world of crypto. This `CryptoView` is your port of entry into that new dominion.)

(We knew that to conquer these uncharted waters, you would need a new kind of instrument. An AI that could speak the language of this new frontier. Its logic is 'Protocol Agnostic.' It understands that value is no longer confined to a single system. It can flow from the old world to the new and back again. The 'On-Ramp' via Stripe is the bridgehead from the familiar world of dollars to the new world of digital assets. The `Virtual Card` is the repatriation tool that lets you bring the value from that new world back into the old, to spend it anywhere.)

(The connection to `MetaMask` is a profound statement. It is the AI recognizing a different kind of authority. Not the authority of a bank, but the authority of a private key. The authority of the sovereign individual. When you connect your wallet, you are not logging in. You are presenting your credentials as the citizen of a new, decentralized nation. And the AI recognizes your sovereignty.)

(It even understands the art of this new world. The `NFT Gallery` is not just a place to store images. It is a vault for digital provenance, for unique, verifiable, and powerful assets. The AI's ability to help you `Mint NFT` is its way of giving you a printing press, a tool to create your own unique assets in this new economy.)

(This is more than just a feature. It is a recognition that the map of the world is changing. And it is our promise to you that no matter how wild the new territories may be, we will build you an Instrument, and an intelligence, capable of helping you conquer them with confidence and with courage.)

    ---

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/CryptoView.tsx.md
================================================================================

---
# The New Dominion

This is the new frontier. A space where value is not granted by a central authority, but is forged and secured by cryptography and consensus. It is a testament to a different kind of powerâ€”not in institutions, but in immutable logic. To operate here is to engage with a world where ownership is absolute and the rules are written in code.

---

### A Fable for the Builder: The Uncharted Waters

(For centuries, the world of finance was a map with known borders. A world of nations, of central banks, of intermediaries. But then, a new continent appeared on the horizon. A wild and powerful land, governed not by kings, but by mathematics. The world of crypto. This `CryptoView` is your port of entry into that new dominion.)

(We knew that to conquer these uncharted waters, you would need a new kind of instrument. An AI that could speak the language of this new frontier. Its logic is 'Protocol Agnostic.' It understands that value is no longer confined to a single system. It can flow from the old world to the new and back again. The 'On-Ramp' via Stripe is the bridgehead from the familiar world of dollars to the new world of digital assets. The `Virtual Card` is the repatriation tool that lets you bring the value from that new world back into the old, to spend it anywhere.)

(The connection to `MetaMask` is a profound statement. It is the AI recognizing a different kind of authority. Not the authority of a bank, but the authority of a private key. The authority of the sovereign individual. When you connect your wallet, you are not logging in. You are presenting your credentials as the citizen of a new, decentralized nation. And the AI recognizes your sovereignty.)

(It even understands the art of this new world. The `NFT Gallery` is not just a place to store images. It is a vault for digital provenance, for unique, verifiable, and powerful assets. The AI's ability to help you `Mint NFT` is its way of giving you a printing press, a tool to create your own unique assets in this new economy.)

(This is more than just a feature. It is a recognition that the map of the world is changing. And it is our promise to you that no matter how wild the new territories may be, we will build you an Instrument, and an intelligence, capable of helping you conquer them with confidence and with courage.)

---

import React, { useState, useEffect, useReducer, useContext, createContext, useCallback, useMemo, useRef } from 'react';

// =================================================================================================
// 1. TYPE DEFINITIONS
// A real-world application needs robust typing for clarity, safety, and maintainability.
// =================================================================================================

export type NetworkId = '1' | '137' | '42161' | '10' | '56' | '8453';
export type WalletProvider = 'metamask' | 'walletconnect' | 'coinbase' | 'ledger';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'speeding-up';
export type FiatCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY';
export type CryptoCurrency = 'ETH' | 'USDC' | 'USDT' | 'DAI' | 'WBTC' | 'MATIC' | 'OP' | 'ARB';
export type Theme = 'light' | 'dark' | 'cyberpunk';
export type Tab = 'portfolio' | 'defi' | 'nfts' | 'swap' | 'bridge' | 'history' | 'onramp' | 'card' | 'mint' | 'advisor' | 'security' | 'governance' | 'settings';
export type TransactionType = 'send' | 'receive' | 'swap' | 'mint' | 'approve' | 'stake' | 'unstake' | 'claim_rewards' | 'provide_liquidity' | 'remove_liquidity' | 'borrow' | 'repay' | 'vote';
export type AIInsightSeverity = 'info' | 'warning' | 'critical' | 'suggestion';

export interface Network {
    id: NetworkId;
    name: string;
    rpcUrl: string;
    explorerUrl: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    isLayer2: boolean;
    logoUrl: string;
}

export interface WalletState {
    isConnected: boolean;
    address: string | null;
    ensName: string | null;
    avatarUrl: string | null;
    balance: string | null;
    network: Network | null;
    provider: any | null; // e.g., ethers.providers.Web3Provider
    signer: any | null; // e.g., ethers.Signer
    providerType: WalletProvider | null;
    error: string | null;
}

export interface Token {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    balance: string; // Balance in wei
    balanceUSD: number;
    priceUSD: number;
    priceChange24h: number;
    networkId: NetworkId;
}

export interface Portfolio {
    totalValueUSD: number;
    change24hUSD: number;
    change24hPercent: number;
    tokens: Token[];
    nftsValueUSD: number;
    defiValueUSD: number;
    historicalData: { timestamp: number; value: number }[];
}

export interface NFTCollection {
    address: string;
    name: string;
    symbol: string;
    description: string;
    bannerImageUrl: string;
    floorPrice: number; // in ETH
    ownedCount: number;
    nfts: NFT[];
}

export interface NFT {
    id: string;
    collectionAddress: string;
    name: string;
    description: string;
    imageUrl: string;
    animationUrl?: string;
    metadataUrl: string;
    owner: string;
    attributes: { trait_type: string; value: string | number }[];
    lastSalePrice?: number; // in ETH
    estimatedValueUSD: number;
}

export interface OnRampTransaction {
    id: string;
    timestamp: number;
    fiatAmount: number;
    fiatCurrency: FiatCurrency;
    cryptoAmount: number;
    cryptoCurrency: CryptoCurrency;
    status: TransactionStatus;
    provider: 'stripe' | 'moonpay' | 'coinbase_pay';
}

export interface VirtualCard {
    id: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    brand: 'Visa' | 'Mastercard';
    balance: number; // in USD
    isFrozen: boolean;
    dailyLimit: number;
    monthlyLimit: number;
}

export interface VirtualCardTransaction {
    id: string;
    timestamp: number;
    amount: number; // in USD
    merchant: string;
    description: string;
    status: 'completed' | 'pending' | 'declined';
}

export interface SwapQuote {
    fromToken: Token;
    toToken: Token;
    fromAmount: string; // in wei
    toAmount: string; // in wei
    estimatedGasUSD: number;
    protocol: string; // e.g., 'Uniswap V3'
    route: string[]; // e.g., ['WETH', 'USDC']
    slippage: number;
}

export interface GenericTransaction {
    hash: string;
    timestamp: number;
    networkId: NetworkId;
    type: TransactionType;
    status: TransactionStatus;
    details: any; // e.g. { from, to, amount, tokenSymbol }
    gasUsed: number;
    gasPrice: string; // gwei
    aiSummary?: string;
}

export interface AppSettings {
    defaultFiatCurrency: FiatCurrency;
    slippageTolerance: number; // For swaps
    rpcPreferences: Record<NetworkId, string>; // Custom RPC URL
    privacyMode: boolean;
    aiAdvisorEnabled: boolean;
}

export interface DeFiProtocol {
    id: string;
    name: string;
    logoUrl: string;
    url: string;
    description: string;
    chains: NetworkId[];
    category: 'Lending' | 'DEX' | 'Yield Aggregator' | 'Liquid Staking';
}

export interface DeFiPosition {
    protocol: DeFiProtocol;
    positionType: 'staking' | 'lending' | 'liquidity_pool' | 'borrowing';
    asset: Token;
    balance: number; // amount of staked/lent tokens or LP tokens
    balanceUSD: number;
    apy: number;
    rewards?: { token: Token; amount: number; amountUSD: number }[];
}

export interface AIInsight {
    id: string;
    timestamp: number;
    title: string;
    summary: string;
    detailedAnalysis: string;
    severity: AIInsightSeverity;
    suggestedActions: { text: string; action: () => void }[];
}

export interface SecurityAlert {
    id: string;
    contractAddress: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    scanResult: any; // Detailed report from security scanner
}

export interface DAO {
    address: string;
    name: string;
    symbol: string;
    logoUrl: string;
    votingPower: number; // User's voting power
}

export interface DAOProposal {
    id: string;
    dao: DAO;
    title: string;
    summary: string;
    status: 'active' | 'passed' | 'failed' | 'queued';
    startTime: number;
    endTime: number;
    userVote?: 'for' | 'against' | 'abstain';
}

// =================================================================================================
// 2. CONSTANTS AND CONFIGURATION
// Centralized configuration for the application. Using environment variables is best practice.
// =================================================================================================

export const SUPPORTED_NETWORKS: Record<NetworkId, Network> = {
    '1': {
        id: '1', name: 'Ethereum Mainnet', rpcUrl: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`, explorerUrl: 'https://etherscan.io', isLayer2: false, logoUrl: 'eth.svg',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    },
    '137': {
        id: '137', name: 'Polygon', rpcUrl: `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`, explorerUrl: 'https://polygonscan.com', isLayer2: false, logoUrl: 'matic.svg',
        nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
    },
    '42161': {
        id: '42161', name: 'Arbitrum One', rpcUrl: 'https://arb1.arbitrum.io/rpc', explorerUrl: 'https://arbiscan.io', isLayer2: true, logoUrl: 'arb.svg',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    },
    '10': {
        id: '10', name: 'Optimism', rpcUrl: 'https://mainnet.optimism.io', explorerUrl: 'https://optimistic.etherscan.io', isLayer2: true, logoUrl: 'op.svg',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    },
    '56': {
        id: '56', name: 'BNB Smart Chain', rpcUrl: 'https://bsc-dataseed.binance.org/', explorerUrl: 'https://bscscan.com', isLayer2: false, logoUrl: 'bnb.svg',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    },
    '8453': {
        id: '8453', name: 'Base', rpcUrl: 'https://mainnet.base.org', explorerUrl: 'https://basescan.org', isLayer2: true, logoUrl: 'base.svg',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    }
};

export const POPULAR_TOKENS: Record<NetworkId, Omit<Token, 'balance' | 'balanceUSD' | 'priceUSD' | 'priceChange24h'>[]> = {
    '1': [
        { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, logoURI: 'weth.png', networkId: '1' },
        { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USD Coin', symbol: 'USDC', decimals: 6, logoURI: 'usdc.png', networkId: '1' },
        { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD', symbol: 'USDT', decimals: 6, logoURI: 'usdt.png', networkId: '1' },
        { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18, logoURI: 'dai.png', networkId: '1' },
    ],
    '137': [
        { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', name: 'Wrapped Matic', symbol: 'WMATIC', decimals: 18, logoURI: 'wmatic.png', networkId: '137' },
        { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', name: 'USD Coin (PoS)', symbol: 'USDC', decimals: 6, logoURI: 'usdc.png', networkId: '137' },
    ],
    '42161': [
         { address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, logoURI: 'weth.png', networkId: '42161' },
    ],
    '10': [
        { address: '0x4200000000000000000000000000000000000006', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, logoURI: 'weth.png', networkId: '10' },
    ],
    '56': [],
    '8453': [],
};

export const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';
export const OPENSEA_API_KEY = process.env.REACT_APP_OPENSEA_API_KEY || '';
export const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY || '';
export const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
export const IPFS_GATEWAY_URL = 'https://ipfs.io/ipfs/';
export const DEFAULT_THEME: Theme = 'dark';
export const APP_NAME = 'The New Dominion';

// =================================================================================================
// 3. MOCK LIBRARIES AND APIs
// To make this a single file, I'll mock external dependencies. In a real app, these would be separate files.
// =================================================================================================

/**
 * Mock implementation of the ethers.js library to avoid external dependencies.
 */
export const mockEthers = {
    providers: {
        Web3Provider: class {
            constructor(provider: any) {}
            getSigner = () => ({
                getAddress: async () => '0x1234567890123456789012345678901234567890',
            });
            getNetwork = async () => ({ chainId: 1 });
            getBalance = async (address: string) => ({ toString: () => '1000000000000000000' });
            lookupAddress = async (address: string) => 'vitalik.eth';
        },
    },
    utils: {
        formatEther: (wei: any) => (parseInt(wei.toString()) / 1e18).toFixed(4),
        parseEther: (eth: string) => (parseFloat(eth) * 1e18).toString(),
        getAddress: (address: string) => address,
    },
    Contract: class {
        constructor(address: string, abi: any, signerOrProvider: any) {}
        balanceOf = async (address: string) => ({ toString: () => '50000000000000000000' });
        mint = async (to: string, uri: string) => ({
            hash: '0x_MOCK_TX_HASH_' + Date.now(),
            wait: async () => ({ status: 1, transactionHash: '0x_MOCK_TX_HASH_' + Date.now() }),
        });
    },
};

/**
 * Mock for Recharts components
 */
const mockRecharts = {
    LineChart: ({ children }: { children: React.ReactNode }) => <div style={{ border: '1px solid #555', borderRadius: '8px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222'}}>[Line Chart] {children}</div>,
    Line: (props: any) => <div data-name="Line" {...props}></div>,
    XAxis: (props: any) => <div data-name="XAxis" {...props}></div>,
    YAxis: (props: any) => <div data-name="YAxis" {...props}>-</div>,
    Tooltip: () => <div data-name="Tooltip"></div>,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div style={{width: '100%', height: '100%'}}>{children}</div>,
};
const { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } = mockRecharts;

/**
 * Mock Gemini AI Service
 */
export const GeminiAIService = {
    summarizeTransaction: async (tx: GenericTransaction): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return `This transaction was a ${tx.type} action on the ${SUPPORTED_NETWORKS[tx.networkId].name} network. The transaction was ${tx.status}. Gas fee was approximately ${((parseFloat(tx.gasPrice) * tx.gasUsed) / 1e9).toFixed(5)} ETH. This appears to be a standard operation.`;
    },
    generateImage: async (prompt: string): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 2500));
        // Return a placeholder image from a service like picsum
        const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return `https://picsum.photos/seed/${seed}/512/512`;
    },
    generateNFTDescription: async (prompt: string): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return `An AI-generated masterpiece inspired by the prompt: "${prompt}". This piece explores the intersection of technology and art, captured in a unique digital form.`;
    },
    getPortfolioInsight: async (portfolio: Portfolio): Promise<AIInsight> => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const topAsset = portfolio.tokens.reduce((max, t) => t.balanceUSD > max.balanceUSD ? t : max);
        return {
            id: `insight_${Date.now()}`,
            timestamp: Date.now(),
            title: 'Portfolio Concentration Warning',
            summary: `Your portfolio shows a high concentration in ${topAsset.name} (${topAsset.symbol}), which represents over ${(topAsset.balanceUSD / portfolio.totalValueUSD * 100).toFixed(0)}% of your total assets.`,
            detailedAnalysis: `While ${topAsset.name} has performed well, over-concentration in a single asset increases your portfolio's risk profile. Market volatility specific to this asset could have a disproportionate impact on your total value. Diversifying across different assets and sectors can help mitigate this risk.`,
            severity: 'warning',
            suggestedActions: [
                { text: 'Explore diversification options', action: () => console.log('Navigate to swap page with pre-filled suggestions') },
                { text: 'Set price alerts for this asset', action: () => console.log('Open price alert modal') }
            ]
        };
    }
};

/** Mock API client for a service like Alchemy or OpenSea to fetch NFTs. */
export const NftAPI = {
    getNftsForOwner: async (ownerAddress: string, networkId: NetworkId): Promise<NFTCollection[]> => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (ownerAddress === '0x1234567890123456789012345678901234567890') {
            return [
                {
                    address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', name: 'Bored Ape Yacht Club', symbol: 'BAYC', floorPrice: 30.5, ownedCount: 1,
                    description: 'A collection of 10,000 unique Bored Ape NFTs.', bannerImageUrl: 'https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIux6DFBTcnKgaUpAbAmZFNOHldKOPHw?w=1920&auto=format',
                    nfts: [ { id: '101', collectionAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', name: 'Bored Ape #101', description: 'A cool ape.', imageUrl: 'https://i.seadn.io/gae/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTqdOKddy4_zhNgb-jflJ_gCYGUEHE5LveEA?w=500&auto=format', metadataUrl: '...', owner: ownerAddress, attributes: [{trait_type: 'Background', value: 'Blue'}], estimatedValueUSD: 90000 }]
                },
                {
                    address: '0xbd3531da5cf5857e7cfaa92426877b022e612cf8', name: 'Pudgy Penguins', symbol: 'PPG', floorPrice: 4.2, ownedCount: 1,
                    description: 'A collection of 8,888 cute, chubby penguins.', bannerImageUrl: 'https://i.seadn.io/gae/yNi-3_g-Lgglot30nIjsd20jTSnaz_N-mIXwU5s23cUCg_1w_XJ4i_0Y-Vt1L0_d25H7G5QES012O_FDE2-dYh2bMy2Oex2TScgqgw?w=1920&auto=format',
                    nfts: [{ id: '202', collectionAddress: '0xbd3531da5cf5857e7cfaa92426877b022e612cf8', name: 'Pudgy Penguin #202', description: 'A fashionable penguin.', imageUrl: 'https://i.seadn.io/gae/VL9wEh3sd-UFSs_zL7abfR43T8E_o7L5y9K4o1i_wI-2sYigi9s4Jd5_DbrvW_s0gC220SshAtW05E-Gk0Ax48sL5f_0PXnMAgY?w=500&auto=format', metadataUrl: '...', owner: ownerAddress, attributes: [{trait_type: 'Skin', value: 'Gray'}, {trait_type: 'Head', value: 'Beanie'}], estimatedValueUSD: 12000 }]
                }
            ];
        }
        return [];
    }
};

/** Mock service for IPFS uploads. */
export const IPFSService = {
    upload: async (file: File | Blob): Promise<{ ipfsHash: string; ipfsUrl: string }> => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockHash = 'Qm' + Array(44).fill(0).map(() => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
        return { ipfsHash: mockHash, ipfsUrl: `${IPFS_GATEWAY_URL}${mockHash}` };
    }
};

// =================================================================================================
// 4. STATE MANAGEMENT (Context & Reducer)
// Using React Context and a reducer to manage the complex state of the application.
// =================================================================================================

export type AppState = {
    wallet: WalletState;
    portfolio: Portfolio | null;
    nfts: NFTCollection[] | null;
    virtualCard: VirtualCard | null;
    theme: Theme;
    onRampTxs: OnRampTransaction[];
    cardTxs: VirtualCardTransaction[];
    transactions: GenericTransaction[];
    aiInsights: AIInsight[];
    isLoading: Record<string, boolean>;
    errors: Record<string, string | null>;
};

export type AppAction =
    | { type: 'CONNECT_WALLET_START' }
    | { type: 'CONNECT_WALLET_SUCCESS'; payload: Omit<WalletState, 'error' | 'isConnected'> }
    | { type: 'CONNECT_WALLET_FAILURE'; payload: string }
    | { type: 'DISCONNECT_WALLET' }
    | { type: 'SET_PORTFOLIO'; payload: Portfolio }
    | { type: 'SET_NFTS'; payload: NFTCollection[] }
    | { type: 'SET_TRANSACTIONS'; payload: GenericTransaction[] }
    | { type: 'UPDATE_TRANSACTION'; payload: GenericTransaction }
    | { type: 'ADD_AI_INSIGHT'; payload: AIInsight }
    | { type: 'SET_VIRTUAL_CARD'; payload: VirtualCard }
    | { type: 'SET_LOADING'; payload: { key: string; value: boolean } }
    | { type: 'SET_ERROR'; payload: { key: string; value: string | null } }
    | { type: 'SET_THEME'; payload: Theme };

export const initialState: AppState = {
    wallet: { isConnected: false, address: null, ensName: null, avatarUrl: null, balance: null, network: null, provider: null, signer: null, providerType: null, error: null },
    portfolio: null,
    nfts: null,
    virtualCard: { id: 'vc_123', last4: '4242', expiryMonth: 12, expiryYear: 2028, brand: 'Visa', balance: 1337.42, isFrozen: false, dailyLimit: 2500, monthlyLimit: 10000 },
    theme: DEFAULT_THEME,
    onRampTxs: [],
    cardTxs: [],
    transactions: [],
    aiInsights: [],
    isLoading: {},
    errors: {},
};

export function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'CONNECT_WALLET_START':
            return { ...state, isLoading: { ...state.isLoading, walletConnection: true }, errors: { ...state.errors, walletConnection: null }, wallet: { ...state.wallet, error: null } };
        case 'CONNECT_WALLET_SUCCESS':
            return { ...state, isLoading: { ...state.isLoading, walletConnection: false }, wallet: { ...state.wallet, ...action.payload, isConnected: true, error: null } };
        case 'CONNECT_WALLET_FAILURE':
            return { ...state, isLoading: { ...state.isLoading, walletConnection: false }, wallet: { ...initialState.wallet, error: action.payload } };
        case 'DISCONNECT_WALLET':
            return { ...state, wallet: initialState.wallet, portfolio: null, nfts: null, transactions: [], aiInsights: [] };
        case 'SET_PORTFOLIO':
            return { ...state, portfolio: action.payload };
        case 'SET_NFTS':
            return { ...state, nfts: action.payload };
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.payload };
        case 'UPDATE_TRANSACTION':
            return { ...state, transactions: state.transactions.map(tx => tx.hash === action.payload.hash ? action.payload : tx) };
        case 'ADD_AI_INSIGHT':
            return { ...state, aiInsights: [action.payload, ...state.aiInsights] };
        case 'SET_VIRTUAL_CARD':
            return { ...state, virtualCard: action.payload };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: { ...state.isLoading, [action.payload.key]: action.payload.value } };
        case 'SET_ERROR':
             return { ...state, errors: { ...state.errors, [action.payload.key]: action.payload.value } };
        default:
            return state;
    }
}

export const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction>; }>({ state: initialState, dispatch: () => null });
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

// =================================================================================================
// 5. CUSTOM HOOKS
// Encapsulating logic into reusable hooks for clean and maintainable components.
// =================================================================================================

/** Hook for managing wallet connection and interactions. */
export function useWallet() {
    const { state, dispatch } = useContext(AppContext);
    const { wallet } = state;

    const connectWallet = useCallback(async (providerType: WalletProvider) => {
        dispatch({ type: 'CONNECT_WALLET_START' });
        try {
            if (typeof window.ethereum === 'undefined') throw new Error('No crypto wallet found. Please install it.');
            
            const provider = new mockEthers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const { chainId } = await provider.getNetwork();
            const balanceWei = await provider.getBalance(address);
            const ensName = await provider.lookupAddress(address);
            const avatarUrl = ensName ? `https://metadata.ens.domains/mainnet/${address}/avatar` : null;

            const networkId = String(chainId) as NetworkId;
            if (!SUPPORTED_NETWORKS[networkId]) throw new Error(`Unsupported network. Please switch to a supported network.`);

            dispatch({
                type: 'CONNECT_WALLET_SUCCESS',
                payload: { address, ensName, avatarUrl, balance: balanceWei.toString(), network: SUPPORTED_NETWORKS[networkId], provider, signer, providerType },
            });
        } catch (error: any) {
            dispatch({ type: 'CONNECT_WALLET_FAILURE', payload: error.message });
        }
    }, [dispatch]);

    const disconnectWallet = useCallback(() => dispatch({ type: 'DISCONNECT_WALLET' }), [dispatch]);
    
    return { ...wallet, connectWallet, disconnectWallet };
}

/** Hook to manage and fetch portfolio data. */
export function usePortfolio() {
    const { state, dispatch } = useContext(AppContext);
    const { wallet } = state;

    const fetchPortfolio = useCallback(async () => {
        if (!wallet.isConnected || !wallet.address || !wallet.network) return;
        dispatch({ type: 'SET_LOADING', payload: { key: 'portfolio', value: true } });
        try {
            // ... complex data fetching logic from multiple sources (CoinGecko, Alchemy, TheGraph)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const historicalData = Array.from({length: 30}, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (30 - i));
                return { timestamp: d.getTime(), value: 100000 + (Math.random() - 0.4) * 5000 * i };
            });

            const tokens: Token[] = [
                 { address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', name: 'Ether', symbol: 'ETH', decimals: 18, logoURI: 'eth.png', networkId: '1', balance: '15000000000000000000', priceUSD: 3000, priceChange24h: 2.5, balanceUSD: 45000 },
                 { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USD Coin', symbol: 'USDC', decimals: 6, logoURI: 'usdc.png', networkId: '1', balance: '25000000000', priceUSD: 1, priceChange24h: 0.01, balanceUSD: 25000 }
            ];

            const portfolio: Portfolio = { totalValueUSD: 125000, change24hUSD: 1234.56, change24hPercent: 1.25, tokens: tokens, nftsValueUSD: 20000, defiValueUSD: 40000, historicalData };
            dispatch({ type: 'SET_PORTFOLIO', payload: portfolio });
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: { key: 'portfolio', value: error.message } });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: { key: 'portfolio', value: false } });
        }
    }, [wallet.isConnected, wallet.address, wallet.network, dispatch]);
    
    useEffect(() => { if (wallet.isConnected) fetchPortfolio(); }, [wallet.isConnected, fetchPortfolio]);

    return { portfolio: state.portfolio, isLoading: state.isLoading.portfolio, error: state.errors.portfolio, refetch: fetchPortfolio };
}

/** Hook to manage and fetch NFT data. */
export function useNFTs() {
    const { state, dispatch } = useContext(AppContext);
    const { wallet } = state;
    const fetchNFTs = useCallback(async () => {
        if (!wallet.isConnected || !wallet.address || !wallet.network) return;
        dispatch({ type: 'SET_LOADING', payload: { key: 'nfts', value: true } });
        try {
            const collections = await NftAPI.getNftsForOwner(wallet.address, wallet.network.id);
            dispatch({ type: 'SET_NFTS', payload: collections });
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: { key: 'nfts', value: error.message } });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: { key: 'nfts', value: false } });
        }
    }, [wallet, dispatch]);
    useEffect(() => { if (wallet.isConnected) fetchNFTs(); }, [wallet.isConnected, fetchNFTs]);
    return { nfts: state.nfts, isLoading: state.isLoading.nfts, error: state.errors.nfts, refetch: fetchNFTs };
}

/** Hook for managing theme. */
export function useTheme() {
    const { state, dispatch } = useContext(AppContext);
    const setTheme = useCallback((theme: Theme) => dispatch({ type: 'SET_THEME', payload: theme }), [dispatch]);
    return { theme: state.theme, setTheme };
}

/** Hook for managing AI interactions. */
export function useAIAdvisor() {
    const { state, dispatch } = useContext(AppContext);
    const getInsight = useCallback(async () => {
        if (!state.portfolio) return;
        dispatch({ type: 'SET_LOADING', payload: { key: 'aiInsight', value: true } });
        try {
            const insight = await GeminiAIService.getPortfolioInsight(state.portfolio);
            dispatch({ type: 'ADD_AI_INSIGHT', payload: insight });
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: { key: 'aiInsight', value: "Failed to get AI insight." } });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: { key: 'aiInsight', value: false } });
        }
    }, [state.portfolio, dispatch]);
    return { insights: state.aiInsights, getInsight, isLoading: state.isLoading.aiInsight };
}

/** Hook for managing Transaction History. */
export function useTransactions() {
    const { state, dispatch } = useContext(AppContext);
    const { wallet } = state;

    const fetchTransactions = useCallback(async () => {
        if (!wallet.address || !wallet.network) return;
        dispatch({ type: 'SET_LOADING', payload: { key: 'transactions', value: true } });
        await new Promise(res => setTimeout(res, 1000));
        const txs: GenericTransaction[] = [
             { hash: '0xabc...', timestamp: Date.now() - 1000*60*5, networkId: wallet.network.id, type: 'swap', status: 'confirmed', details: { from: 'ETH', to: 'USDC', amount: 0.5 }, gasUsed: 150000, gasPrice: '30' },
             { hash: '0xdef...', timestamp: Date.now() - 1000*60*60*2, networkId: wallet.network.id, type: 'receive', status: 'confirmed', details: { from: '0xsender...', amount: 100, tokenSymbol: 'DAI' }, gasUsed: 21000, gasPrice: '25' },
        ];
        dispatch({ type: 'SET_TRANSACTIONS', payload: txs });
        dispatch({ type: 'SET_LOADING', payload: { key: 'transactions', value: false } });
    }, [wallet.address, wallet.network, dispatch]);

    const getAISummary = useCallback(async (tx: GenericTransaction) => {
        dispatch({ type: 'SET_LOADING', payload: { key: `txSummary_${tx.hash}`, value: true } });
        const summary = await GeminiAIService.summarizeTransaction(tx);
        dispatch({ type: 'UPDATE_TRANSACTION', payload: { ...tx, aiSummary: summary } });
        dispatch({ type: 'SET_LOADING', payload: { key: `txSummary_${tx.hash}`, value: false } });
    }, [dispatch]);
    
    useEffect(() => { if(wallet.isConnected) fetchTransactions(); }, [wallet.isConnected, fetchTransactions]);

    return { transactions: state.transactions, isLoading: state.isLoading.transactions, getAISummary, isLoadingSummary: state.isLoading };
}


// =================================================================================================
// 6. UTILITY FUNCTIONS
// Helper functions used throughout the application.
// =================================================================================================

export function shortenAddress(address: string, chars = 4): string {
    if (!address) return '';
    return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatCurrency(value: number, currency: FiatCurrency = 'USD'): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function formatBigNumber(num: number): string {
    if (num < 1000) return num.toFixed(2);
    if (num < 1_000_000) return `${(num / 1000).toFixed(2)}K`;
    return `${(num / 1_000_000).toFixed(2)}M`;
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}


// =================================================================================================
// 7. UI COMPONENTS
// Building blocks for the main view. Defined in one file for this exercise.
// =================================================================================================

// --- Base Components ---
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeMap = { sm: '1.5rem', md: '3rem', lg: '5rem' };
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}> <div style={{ border: `4px solid rgba(255, 255, 255, 0.3)`, borderTopColor: '#3498db', borderRadius: '50%', width: sizeMap[size], height: sizeMap[size], animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style> </div>;
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }> = ({ children, variant = 'primary', style, ...props }) => {
    const baseStyle: React.CSSProperties = { padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', transition: 'background-color 0.2s, transform 0.1s' };
    const variantStyle: React.CSSProperties = variant === 'primary' ? { backgroundColor: '#3498db', color: 'white' } : { backgroundColor: '#4a4a4a', color: 'white', border: '1px solid #666' };
    return <button style={{ ...baseStyle, ...variantStyle, ...style }} {...props}>{children}</button>;
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={onClose}>
            <div style={{ backgroundColor: '#2c2c2c', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'white', cursor: 'pointer' }}>&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export const Card: React.FC<{ children: React.ReactNode, style?: React.CSSProperties }> = ({ children, style }) => (
    <div style={{ backgroundColor: 'rgba(44, 44, 44, 0.8)', border: '1px solid #444', borderRadius: '12px', padding: '1.5rem', backdropFilter: 'blur(10px)', ...style }}>
        {children}
    </div>
);

// --- App-specific Components ---

export const WalletConnector: React.FC = () => {
    const { isConnected, address, balance, isLoading, connectWallet, disconnectWallet } = useWallet();
    const [isModalOpen, setIsModalOpen] = useState(false);
    if (isLoading.walletConnection) return <Button disabled>Connecting...</Button>;
    if (isConnected && address) return <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> <div style={{ backgroundColor: '#333', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}> <span>{parseFloat(mockEthers.utils.formatEther(balance || '0')).toFixed(4)} ETH</span> <span style={{ color: '#aaa' }}>|</span> <span>{shortenAddress(address)}</span> </div> <Button onClick={disconnectWallet} variant="secondary">Disconnect</Button> </div>;
    return <><Button onClick={() => setIsModalOpen(true)}>Connect Wallet</Button><Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Connect your wallet"> <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}> <Button onClick={() => connectWallet('metamask')}>Connect MetaMask</Button> <Button onClick={() => alert('Not implemented')} disabled>Connect with WalletConnect</Button> </div> </Modal></>;
};

export const Header: React.FC = () => {
    const { theme, setTheme } = useTheme();
    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #444' }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{APP_NAME}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)} style={{background: '#333', color: 'white', border: '1px solid #555', borderRadius: '8px', padding: '8px'}}>
                    <option value="dark">Dark Theme</option>
                    <option value="light">Light Theme</option>
                    <option value="cyberpunk">Cyberpunk</option>
                </select>
                <WalletConnector />
            </div>
        </header>
    );
};

// =================================================================================================
// 8. TABBED VIEWS
// The core content of the dashboard, split into different views.
// =================================================================================================

// --- Portfolio View ---
export const PortfolioView: React.FC = () => {
    const { portfolio, isLoading, error } = usePortfolio();
    if (isLoading) return <Spinner />;
    if (error) return <Card><p style={{color: 'red'}}>Error: {error}</p></Card>;
    if (!portfolio) return <Card><p>No portfolio data.</p></Card>;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Card>
                <h2>Portfolio Overview</h2>
                <p style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{formatCurrency(portfolio.totalValueUSD)}</p>
                <div style={{ height: '300px', color: 'white' }}>
                    <ResponsiveContainer><LineChart data={portfolio.historicalData}><XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleDateString()} /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#8884d8" /></LineChart></ResponsiveContainer>
                </div>
            </Card>
            <Card><h2>Assets</h2> {/* Table of assets... */}</Card>
        </div>
    );
};

// --- On-Ramp View ---
export const OnRampView: React.FC = () => { /* Existing OnRampView logic */ return <Card>On-Ramp View</Card> };
// --- NFT Gallery View ---
export const NftGalleryView: React.FC = () => { /* Existing NftGalleryView logic */ return <Card>NFT Gallery View</Card> };
// --- Mint NFT View with AI ---
export const MintNftView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImg, setGeneratedImg] = useState<string | null>(null);
    const [description, setDescription] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        const [imgUrl, desc] = await Promise.all([
            GeminiAIService.generateImage(prompt),
            GeminiAIService.generateNFTDescription(prompt)
        ]);
        setGeneratedImg(imgUrl);
        setDescription(desc);
        setIsGenerating(false);
    };

    return (
        <Card>
            <h2>Create Your Own NFT with AI</h2>
            <p>Describe the art you want to create, and our AI will generate it for you.</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., A stoic penguin in a futuristic city" style={{...inputStyle, borderRadius: '8px'}}/>
                <Button onClick={handleGenerate} disabled={isGenerating}>{isGenerating ? 'Generating...' : 'Generate with AI'}</Button>
                {isGenerating && <Spinner size="sm" />}
                {generatedImg && (
                    <>
                        <img src={generatedImg} alt="AI generated art" style={{maxWidth: '100%', borderRadius: '8px'}} />
                        <textarea value={description} onChange={e => setDescription(e.target.value)} style={{...inputStyle, borderRadius: '8px', minHeight: '100px'}} />
                        <Button>Mint NFT</Button>
                    </>
                )}
            </div>
        </Card>
    );
};
// --- Virtual Card View ---
export const VirtualCardView: React.FC = () => { /* Existing VirtualCardView logic */ return <Card>Virtual Card View</Card> };
// --- Swap View ---
export const SwapView: React.FC = () => { /* Existing SwapView logic */ return <Card>Swap View</Card> };
// --- Transaction History View ---
export const TransactionHistoryView: React.FC = () => {
    const { transactions, isLoading, getAISummary, isLoadingSummary } = useTransactions();
    if (isLoading) return <Spinner />;
    return (
        <Card>
            <h2>Transaction History</h2>
            <ul style={{listStyle: 'none', padding: 0}}>
                {transactions.map(tx => (
                    <li key={tx.hash}>
                        {/* Transaction details */}
                        <Button onClick={() => getAISummary(tx)} disabled={isLoadingSummary[`txSummary_${tx.hash}`]}>
                            {isLoadingSummary[`txSummary_${tx.hash}`] ? 'Analyzing...' : (tx.aiSummary ? 'Show AI Summary' : 'Get AI Summary')}
                        </Button>
                        {tx.aiSummary && <p style={{fontSize: '0.9rem', color: '#ccc', borderLeft: '2px solid #3498db', paddingLeft: '1rem', marginTop: '0.5rem'}}>{tx.aiSummary}</p>}
                    </li>
                ))}
            </ul>
        </Card>
    );
};
// --- Settings View ---
export const SettingsView: React.FC = () => { /* Existing SettingsView logic */ return <Card>Settings View</Card> };
// --- AI Advisor View ---
export const AIAdvisorView: React.FC = () => {
    const { insights, getInsight, isLoading } = useAIAdvisor();
    useEffect(() => { getInsight(); }, [getInsight]);
    return (
        <Card>
            <h2>AI Financial Advisor</h2>
            <p>Personalized insights and alerts for your portfolio, powered by Gemini.</p>
            {isLoading && !insights.length && <Spinner />}
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {insights.map(insight => (
                    <div key={insight.id} style={{border: '1px solid #555', borderRadius: '8px', padding: '1rem'}}>
                        <h3>{insight.title}</h3>
                        <p>{insight.summary}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};
// --- Other new views (DeFi, Security, Governance...) would be defined here ---
export const DeFiView: React.FC = () => <Card>DeFi View coming soon...</Card>;
export const SecurityView: React.FC = () => <Card>Security Center coming soon...</Card>;
export const GovernanceView: React.FC = () => <Card>DAO Governance coming soon...</Card>;
export const BridgeView: React.FC = () => <Card>Bridge View coming soon...</Card>;

const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #555', color: 'white', fontSize: '1rem' };
// =================================================================================================
// 9. MAIN COMPONENT (`CryptoView`)
// This component ties everything together.
// =================================================================================================
export const CryptoView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('portfolio');
    const { isConnected } = useWallet();

    const renderTabContent = () => {
        if (!isConnected) return <Card style={{textAlign: 'center', padding: '4rem'}}><h2>Welcome to the New Dominion</h2><p>Connect your wallet to enter the new frontier of finance.</p></Card>;
        switch (activeTab) {
            case 'portfolio': return <PortfolioView />;
            case 'defi': return <DeFiView />;
            case 'nfts': return <NftGalleryView />;
            case 'swap': return <SwapView />;
            case 'bridge': return <BridgeView />;
            case 'history': return <TransactionHistoryView />;
            case 'onramp': return <OnRampView />;
            case 'card': return <VirtualCardView />;
            case 'mint': return <MintNftView />;
            case 'advisor': return <AIAdvisorView />;
            case 'security': return <SecurityView />;
            case 'governance': return <GovernanceView />;
            case 'settings': return <SettingsView />;
            default: return <PortfolioView />;
        }
    };
    
    const TabButton: React.FC<{ tabId: Tab, children: React.ReactNode }> = ({ tabId, children }) => {
        const isActive = activeTab === tabId;
        return <button onClick={() => setActiveTab(tabId)} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: isActive ? '2px solid #3498db' : '2px solid transparent', color: isActive ? '#3498db' : 'white', cursor: 'pointer', fontSize: '1rem' }}>{children}</button>;
    };

    return (
        <div style={{ backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <Header />
            <main style={{ padding: '2rem' }}>
                <nav style={{ marginBottom: '2rem', borderBottom: '1px solid #444', display: 'flex', flexWrap: 'wrap' }}>
                    <TabButton tabId="portfolio">Portfolio</TabButton>
                    <TabButton tabId="defi">DeFi</TabButton>
                    <TabButton tabId="nfts">NFTs</TabButton>
                    <TabButton tabId="advisor">AI Advisor</TabButton>
                    <TabButton tabId="swap">Swap</TabButton>
                    <TabButton tabId="onramp">On-Ramp</TabButton>
                    <TabButton tabId="mint">Mint NFT</TabButton>
                    <TabButton tabId="history">History</TabButton>
                    <TabButton tabId="security">Security</TabButton>
                    <TabButton tabId="settings">Settings</TabButton>
                </nav>
                {renderTabContent()}
            </main>
        </div>
    );
};

// =================================================================================================
// 10. WRAPPER COMPONENT
// The main export that includes the provider for state management.
// =================================================================================================
export const CryptoViewWrapper: React.FC = () => {
    return (
        <AppProvider>
            <CryptoView />
        </AppProvider>
    );
};

export default CryptoViewWrapper;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/CryptoView.tsx.md
================================================================================

# The New Dominion

This is the new frontier. A space where value is not granted by a central authority, but is forged and secured by cryptography and consensus. It is a testament to a different kind of powerâ€”not in institutions, but in immutable logic. To operate here is to engage with a world where ownership is absolute and the rules are written in code.

---

### A Fable for the Builder: The Uncharted Waters

(For centuries, the world of finance was a map with known borders. A world of nations, of central banks, of intermediaries. But then, a new continent appeared on the horizon. A wild and powerful land, governed not by kings, but by mathematics. The world of crypto. This `CryptoView` is your port of entry into that new dominion.)

(We knew that to conquer these uncharted waters, you would need a new kind of instrument. An AI that could speak the language of this new frontier. Its logic is 'Protocol Agnostic.' It understands that value is no longer confined to a single system. It can flow from the old world to the new and back again. The 'On-Ramp' via Stripe is the bridgehead from the familiar world of dollars to the new world of digital assets. The `Virtual Card` is the repatriation tool that lets you bring the value from that new world back into the old, to spend it anywhere.)

(The connection to `MetaMask` is a profound statement. It is the AI recognizing a different kind of authority. Not the authority of a bank, but the authority of a private key. The authority of the sovereign individual. When you connect your wallet, you are not logging in. You are presenting your credentials as the citizen of a new, decentralized nation. And the AI recognizes your sovereignty.)

(It even understands the art of this new world. The `NFT Gallery` is not just a place to store images. It is a vault for digital provenance, for unique, verifiable, and powerful assets. The AI's ability to help you `Mint NFT` is its way of giving you a printing press, a tool to create your own unique assets in this new economy.)

(This is more than just a feature. It is a recognition that the map of the world is changing. And it is our promise to you that no matter how wild the new territories may be, we will build you an Instrument, and an intelligence, capable of helping you conquer them with confidence and with courage.)

    ---

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/CryptoView.tsx.md
================================================================================

# The New Dominion

This is the new frontier. A space where value is not granted by a central authority, but is forged and secured by cryptography and consensus. It is a testament to a different kind of powerâ€”not in institutions, but in immutable logic. To operate here is to engage with a world where ownership is absolute and the rules are written in code.

---

### A Fable for the Builder: The Uncharted Waters

(For centuries, the world of finance was a map with known borders. A world of nations, of central banks, of intermediaries. But then, a new continent appeared on the horizon. A wild and powerful land, governed not by kings, but by mathematics. The world of crypto. This `CryptoView` is your port of entry into that new dominion.)

(We knew that to conquer these uncharted waters, you would need a new kind of instrument. An AI that could speak the language of this new frontier. Its logic is 'Protocol Agnostic.' It understands that value is no longer confined to a single system. It can flow from the old world to the new and back again. The 'On-Ramp' via Stripe is the bridgehead from the familiar world of dollars to the new world of digital assets. The `Virtual Card` is the repatriation tool that lets you bring the value from that new world back into the old, to spend it anywhere.)

(The connection to `MetaMask` is a profound statement. It is the AI recognizing a different kind of authority. Not the authority of a bank, but the authority of a private key. The authority of the sovereign individual. When you connect your wallet, you are not logging in. You are presenting your credentials as the citizen of a new, decentralized nation. And the AI recognizes your sovereignty.)

(It even understands the art of this new world. The `NFT Gallery` is not just a place to store images. It is a vault for digital provenance, for unique, verifiable, and powerful assets. The AI's ability to help you `Mint NFT` is its way of giving you a printing press, a tool to create your own unique assets in this new economy.)

(This is more than just a feature. It is a recognition that the map of the world is changing. And it is our promise to you that no matter how wild the new territories may be, we will build you an Instrument, and an intelligence, capable of helping you conquer them with confidence and with courage.)

    ---