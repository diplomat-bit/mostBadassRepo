// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/digitalassets/NftVaultView.tsx
================================================================================

// components/views/megadashboard/digitalassets/NftVaultView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

const NftVaultView: React.FC = () => {
    const [isValuationModalOpen, setValuationModalOpen] = useState(false);
    const [nftName, setNftName] = useState("CryptoPunk #7804");
    const [valuation, setValuation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setValuation('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Provide a brief, high-level valuation analysis for the NFT named "${nftName}", considering its collection, rarity, and recent market trends.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setValuation(response.text);
        } catch (err) {
            setValuation("Error generating valuation.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">NFT Vault</h2>
                     <button onClick={() => setValuationModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Valuation</button>
                </div>
                <Card title="Your Collection">
                     <p className="text-gray-400">This would display a gallery of the user's NFTs.</p>
                </Card>
            </div>
             {isValuationModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setValuationModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI NFT Valuation Estimator</h3></div>
                        <div className="p-6 space-y-4">
                             <input type="text" value={nftName} onChange={e => setNftName(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded text-white" />
                             <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Estimating...' : 'Estimate Value'}</button>
                            <Card title={`Valuation for ${nftName}`}><div className="min-h-[10rem] text-sm text-gray-300 whitespace-pre-line">{isLoading ? '...' : valuation}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default NftVaultView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/digitalassets/NftVaultView.tsx
================================================================================

// components/views/megadashboard/digitalassets/NftVaultView.tsx
import React, { useState, useEffect, useCallback, useReducer, createContext, useContext, useMemo, FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell, Sector } from 'recharts';
import { ChevronDown, ChevronsUpDown, Search, Filter, X, Zap, Bot, Shield, History, Wallet, ExternalLink, RefreshCw, AlertTriangle, Info, Copy } from 'lucide-react';

// --- I. TYPE DEFINITIONS ---
// Comprehensive type definitions for a robust NFT management system.

export interface NftTrait {
    trait_type: string;
    value: string | number;
    rarity_score?: number;
    percentile?: number;
}

export interface NftMedia {
    uri: string;
    type: 'image' | 'video' | 'audio' | '3d_model';
    thumbnail?: string;
}

export interface NftOffer {
    id: string;
    makerAddress: string;
    price: number;
    currency: 'ETH' | 'WETH' | 'SOL' | 'USDC';
    expiresAt: number; // Unix timestamp
    marketplace: 'OpenSea' | 'MagicEden' | 'LooksRare' | 'Blur';
}

export interface NftListing {
    id: string;
    sellerAddress: string;
    price: number;
    currency: 'ETH' | 'WETH' | 'SOL' | 'USDC';
    listedAt: number; // Unix timestamp
    marketplace: 'OpenSea' | 'MagicEden' | 'LooksRare' | 'Blur';
}

export interface NftCollectionMetadata {
    id: string; // e.g., contract address
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    bannerImageUrl?: string;
    externalUrl?: string;
    stats: {
        floorPrice: number;
        totalVolume: number;
        numOwners: number;
        totalSupply: number;
        oneDayChange: number; // % change
        sevenDayChange: number; // % change
        thirtyDayChange: number; // % change
    };
}

export interface ValuationResult {
    timestamp: number;
    estimatedValueEth: number;
    confidenceScore: number; // 0-1
    details: string; // Breakdown from AI
    modelUsed: 'gemini-pro' | 'gpt-4-turbo';
    prompt: string;
}

export interface SecurityAuditResult {
    timestamp: number;
    scanner: 'Mythril' | 'Slither' | 'Internal AI Scanner';
    vulnerabilities: {
        severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
        description: string;
        cwe: string; // Common Weakness Enumeration
    }[];
    overallScore: number; // 0-100
}

export interface Nft {
    id: string; // contractAddress-tokenId
    tokenId: string;
    contractAddress: string;
    chain: 'ethereum' | 'solana' | 'polygon';
    name: string;
    description: string;
    media: NftMedia;
    collection: NftCollectionMetadata;
    ownerAddress: string;
    acquiredAt: number; // Unix timestamp
    acquiredPrice: {
        amount: number;
        currency: 'ETH' | 'WETH' | 'SOL' | 'USDC';
    };
    traits: NftTrait[];
    rarity: {
        score: number;
        rank: number;
    };
    metadataUrl: string;
    currentListing?: NftListing;
    offers?: NftOffer[];
    aiValuations: ValuationResult[];
    securityAudits: SecurityAuditResult[];
}

export interface WalletInfo {
    address: string;
    chain: 'ethereum' | 'solana' | 'polygon';
    balance: number; // Native currency (ETH, SOL, MATIC)
}

export interface PortfolioStats {
    totalValueEth: number;
    totalNfts: number;
    unrealizedPnlEth: number;
    realizedPnlEth: number;
    topPerformingNft: Nft | null;
    worstPerformingNft: Nft | null;
    valueByCollection: { name: string, value: number }[];
}

export interface Transaction {
    id: string; // txHash
    type: 'purchase' | 'sale' | 'transfer_in' | 'transfer_out' | 'mint';
    nftId: string;
    nftName: string;
    collectionName: string;
    price?: { amount: number; currency: 'ETH' | 'WETH' | 'SOL' | 'USDC' };
    fromAddress: string;
    toAddress: string;
    timestamp: number;
    marketplace?: string;
    gasFeeEth?: number;
    aiFraudRisk?: { score: number; reason: string };
}

// --- II. MOCK DATA & GENERATORS ---

const MOCK_COLLECTIONS: NftCollectionMetadata[] = [
    {
        id: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', name: 'Bored Ape Yacht Club', slug: 'boredapeyachtclub', description: 'A collection of 10,000 unique Bored Ape NFTs.', imageUrl: 'https://i.seadn.io/gae/Ju9yW_W_t_s_1a-7b-v-3f/256.png', bannerImageUrl: 'https://i.seadn.io/gcs/files/b4959146522c71ce85d6ed79e7826359.png',
        stats: { floorPrice: 30.5, totalVolume: 1200000, numOwners: 5400, totalSupply: 10000, oneDayChange: 2.1, sevenDayChange: -5.3, thirtyDayChange: 12.0 }
    },
    {
        id: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', name: 'CryptoPunks', slug: 'cryptopunks', description: 'The original pixel art NFTs.', imageUrl: 'https://i.seadn.io/gae/BdxvLseXcflCxrk3fiLRUSrckzEfxn5TzRJuxL58XvJx5LUGgjh_YkLAgONPVD5McdgqzFscHWNCpt58kvcERcVEarFdhrByW2gNKQ/256.png', bannerImageUrl: 'https://i.seadn.io/gcs/files/61a295111d19b784a0d9b5e3a514d351.png',
        stats: { floorPrice: 55.2, totalVolume: 2500000, numOwners: 3100, totalSupply: 10000, oneDayChange: -0.5, sevenDayChange: 1.8, thirtyDayChange: 9.4 }
    },
    {
        id: 'SOL_1234567890', name: 'Solana Monkey Business', slug: 'solana-monkey-business', description: '5000 unique pixelated monkeys on Solana.', imageUrl: 'https://i.seadn.io/gcs/files/5435e070c73223f2f0a1ce5328738897.png?w=500&auto=format', bannerImageUrl: 'https://i.seadn.io/gcs/files/69a3350438a08d169f436d4f1345f442.jpg',
        stats: { floorPrice: 150, totalVolume: 800000, numOwners: 2800, totalSupply: 5000, oneDayChange: 4.5, sevenDayChange: 15.2, thirtyDayChange: 35.1 }
    }
];

const MOCK_TRAITS: { [key: string]: string[] } = {
    'Background': ['Blue', 'Red', 'Green', 'Purple', 'Orange'],
    'Fur': ['Brown', 'Golden', 'Black', 'White', 'Robot'],
    'Eyes': ['Closed', 'Bored', 'Laser', '3D Glasses'],
    'Mouth': ['Grin', 'Dumbfounded', 'Cigar', 'Phoneme Vuh'],
    'Hat': ['Cowboy Hat', 'Fez', 'Crown', 'Beanie'],
    'Clothes': ['Tuxedo', 'Leather Jacket', 'Lab Coat', 'Sailor Shirt']
};

const generateMockNfts = (count: number): Nft[] => {
    const nfts: Nft[] = [];
    for (let i = 0; i < count; i++) {
        const collection = MOCK_COLLECTIONS[i % MOCK_COLLECTIONS.length];
        const tokenId = Math.floor(Math.random() * collection.stats.totalSupply).toString();
        const acquiredPrice = collection.stats.floorPrice * (0.5 + Math.random());
        const lastValuation = collection.stats.floorPrice * (0.8 + Math.random() * 0.4);
        const traits: NftTrait[] = Object.keys(MOCK_TRAITS).map(traitType => ({
            trait_type: traitType,
            value: MOCK_TRAITS[traitType][Math.floor(Math.random() * MOCK_TRAITS[traitType].length)],
            rarity_score: Math.random(),
            percentile: Math.random()
        }));

        nfts.push({
            id: `${collection.id}-${tokenId}`,
            tokenId,
            contractAddress: collection.id,
            chain: collection.id.startsWith('SOL') ? 'solana' : 'ethereum',
            name: `${collection.name} #${tokenId}`,
            description: `A unique programmatically generated ${collection.name}.`,
            media: { uri: `https://via.placeholder.com/500?text=${collection.slug}+${tokenId}`, type: 'image' },
            collection,
            ownerAddress: '0x1A2b3c4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b',
            acquiredAt: Date.now() - Math.floor(Math.random() * 31536000000), // up to 1 year ago
            acquiredPrice: { amount: parseFloat(acquiredPrice.toFixed(2)), currency: collection.id.startsWith('SOL') ? 'SOL' : 'ETH' },
            traits,
            rarity: { score: Math.random() * 1000, rank: Math.floor(Math.random() * collection.stats.totalSupply) + 1 },
            metadataUrl: `https://api.example.com/nft/${collection.id}/${tokenId}`,
            aiValuations: [{
                timestamp: Date.now() - 86400000,
                estimatedValueEth: parseFloat(lastValuation.toFixed(2)),
                confidenceScore: 0.85 + Math.random() * 0.1,
                details: 'Valuation based on recent collection sales, trait rarity, and overall market sentiment.',
                modelUsed: 'gemini-pro',
                prompt: '...'
            }],
            securityAudits: [],
        });
    }
    return nfts;
};

const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 50 }, (_, i) => {
    const isSale = Math.random() > 0.5;
    const collection = MOCK_COLLECTIONS[i % MOCK_COLLECTIONS.length];
    const price = collection.stats.floorPrice * (0.8 + Math.random() * 0.4);
    return {
        id: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        type: isSale ? 'sale' : 'purchase',
        nftId: `${collection.id}-${i}`,
        nftName: `${collection.name} #${i}`,
        collectionName: collection.name,
        price: { amount: parseFloat(price.toFixed(2)), currency: collection.id.startsWith('SOL') ? 'SOL' : 'ETH' },
        fromAddress: isSale ? '0x1A2b...9A0b' : `0xSELLER...${i}`,
        toAddress: isSale ? `0xBUYER...${i}` : '0x1A2b...9A0b',
        timestamp: Date.now() - Math.floor(Math.random() * 31536000000),
        marketplace: ['OpenSea', 'MagicEden', 'Blur'][i % 3],
        gasFeeEth: parseFloat((Math.random() * 0.05).toFixed(4)),
        aiFraudRisk: Math.random() > 0.9 ? { score: Math.random() * 0.5 + 0.5, reason: 'Transaction price significantly deviates from floor price. Potential wash trading.' } : { score: Math.random() * 0.1, reason: 'Normal activity detected.' }
    };
});


// --- III. STATE MANAGEMENT (CONTEXT & REDUCER) ---

type NftVaultState = {
    isLoading: boolean;
    nfts: Nft[];
    transactions: Transaction[];
    wallets: WalletInfo[];
    portfolioStats: PortfolioStats | null;
    selectedNftId: string | null;
    error: string | null;
    filters: {
        searchQuery: string;
        collections: string[];
        chains: string[];
        priceRange: [number, number];
    };
    apiKey: string | null;
};

const initialState: NftVaultState = {
    isLoading: true,
    nfts: [],
    transactions: [],
    wallets: [{ address: '0x1A2b3c4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b', chain: 'ethereum', balance: 12.5 }],
    portfolioStats: null,
    selectedNftId: null,
    error: null,
    filters: { searchQuery: '', collections: [], chains: [], priceRange: [0, 1000] },
    apiKey: null,
};

type Action =
    | { type: 'FETCH_DATA_START' }
    | { type: 'FETCH_DATA_SUCCESS'; payload: { nfts: Nft[]; transactions: Transaction[] } }
    | { type: 'FETCH_DATA_FAILURE'; payload: string }
    | { type: 'SELECT_NFT'; payload: string | null }
    | { type: 'UPDATE_NFT'; payload: Nft }
    | { type: 'SET_FILTER'; payload: { filter: keyof NftVaultState['filters']; value: any } }
    | { type: 'SET_API_KEY'; payload: string };

const NftVaultContext = createContext<{ state: NftVaultState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const calculatePortfolioStats = (nfts: Nft[]): PortfolioStats => {
    if (nfts.length === 0) return { totalValueEth: 0, totalNfts: 0, unrealizedPnlEth: 0, realizedPnlEth: 0, topPerformingNft: null, worstPerformingNft: null, valueByCollection: [] };
    
    let totalValueEth = 0;
    let totalAcquiredValueEth = 0;
    let topPerformer = { nft: nfts[0], pnl: -Infinity };
    let worstPerformer = { nft: nfts[0], pnl: Infinity };
    const collectionValues: { [key: string]: number } = {};

    nfts.forEach(nft => {
        const currentValue = nft.aiValuations[0]?.estimatedValueEth || nft.collection.stats.floorPrice;
        const acquiredValue = nft.acquiredPrice.currency === 'ETH' ? nft.acquiredPrice.amount : 0; // Simplified for demo
        totalValueEth += currentValue;
        totalAcquiredValueEth += acquiredValue;
        
        const pnl = currentValue - acquiredValue;
        if (pnl > topPerformer.pnl) topPerformer = { nft, pnl };
        if (pnl < worstPerformer.pnl) worstPerformer = { nft, pnl };

        collectionValues[nft.collection.name] = (collectionValues[nft.collection.name] || 0) + currentValue;
    });

    return {
        totalValueEth,
        totalNfts: nfts.length,
        unrealizedPnlEth: totalValueEth - totalAcquiredValueEth,
        realizedPnlEth: 15.2, // Mocked
        topPerformingNft: topPerformer.nft,
        worstPerformingNft: worstPerformer.nft,
        valueByCollection: Object.entries(collectionValues).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value)
    };
};


const nftVaultReducer = (state: NftVaultState, action: Action): NftVaultState => {
    switch (action.type) {
        case 'FETCH_DATA_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_DATA_SUCCESS':
            const { nfts, transactions } = action.payload;
            return {
                ...state,
                isLoading: false,
                nfts,
                transactions,
                portfolioStats: calculatePortfolioStats(nfts),
            };
        case 'FETCH_DATA_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case 'SELECT_NFT':
            return { ...state, selectedNftId: action.payload };
        case 'UPDATE_NFT':
            const updatedNfts = state.nfts.map(nft => nft.id === action.payload.id ? action.payload : nft);
            return {
                ...state,
                nfts: updatedNfts,
                portfolioStats: calculatePortfolioStats(updatedNfts),
                ...(state.selectedNftId === action.payload.id && { selectedNftId: action.payload.id }), // Keep it selected
            };
        case 'SET_FILTER':
            return {
                ...state,
                filters: { ...state.filters, [action.payload.filter]: action.payload.value },
            };
        case 'SET_API_KEY':
            return { ...state, apiKey: action.payload };
        default:
            return state;
    }
};

const useNftVault = () => {
    const context = useContext(NftVaultContext);
    if (!context) {
        throw new Error('useNftVault must be used within a NftVaultProvider');
    }
    return context;
};

// --- IV. API & SERVICE LAYER ---

const api = {
    fetchNfts: async (walletAddress: string): Promise<Nft[]> => {
        console.log(`Fetching NFTs for ${walletAddress}...`);
        await new Promise(res => setTimeout(res, 1500)); // Simulate network delay
        if (Math.random() < 0.1) throw new Error("Failed to fetch from blockchain API.");
        return generateMockNfts(50);
    },
    fetchTransactions: async (walletAddress: string): Promise<Transaction[]> => {
        console.log(`Fetching transactions for ${walletAddress}...`);
        await new Promise(res => setTimeout(res, 1000));
        return MOCK_TRANSACTIONS.sort((a, b) => b.timestamp - a.timestamp);
    },
    runAiValuation: async (nft: Nft, apiKey: string): Promise<ValuationResult> => {
        console.log(`Running AI valuation for ${nft.name} with key ${apiKey ? 'provided' : 'missing'}`);
        await new Promise(res => setTimeout(res, 2500));
        
        const prompt = `
            Analyze the following NFT for valuation purposes. Provide a JSON response with 'estimatedValueEth', 'confidenceScore' (0-1), and 'details'.
            
            NFT Details:
            - Name: ${nft.name}
            - Collection: ${nft.collection.name}
            - Rarity Rank: ${nft.rarity.rank} / ${nft.collection.stats.totalSupply}
            - Traits: ${JSON.stringify(nft.traits, null, 2)}
            
            Market Data:
            - Collection Floor Price: ${nft.collection.stats.floorPrice} ETH
            - Collection 7-day Volume Change: ${nft.collection.stats.sevenDayChange}%
            - Last 5 sales for similar rarity rank: [${(nft.collection.stats.floorPrice * 1.1).toFixed(2)}, ${(nft.collection.stats.floorPrice * 0.95).toFixed(2)}, ${(nft.collection.stats.floorPrice * 1.25).toFixed(2)}] ETH
            
            Consider trait rarity, market trends for the collection, and overall NFT market sentiment.
        `;

        if (Math.random() < 0.1) throw new Error("AI valuation model timed out.");

        const newValue = nft.collection.stats.floorPrice * (0.9 + Math.random() * 0.5);

        return {
            timestamp: Date.now(),
            estimatedValueEth: parseFloat(newValue.toFixed(2)),
            confidenceScore: 0.9 + Math.random() * 0.09,
            details: "Valuation is strong due to the rare 'Golden Fur' trait and positive 30-day momentum for the BAYC collection. Current market liquidity is high, supporting this price point.",
            modelUsed: 'gemini-pro',
            prompt
        };
    },
    runSecurityAudit: async (nft: Nft): Promise<SecurityAuditResult> => {
        console.log(`Running security audit on contract ${nft.contractAddress}...`);
        await new Promise(res => setTimeout(res, 3000));
        
        const hasVulnerability = Math.random() > 0.7;
        return {
            timestamp: Date.now(),
            scanner: 'Internal AI Scanner',
            vulnerabilities: hasVulnerability ? [{
                severity: 'medium',
                description: 'Potential reentrancy vulnerability in the `claimAirdrop` function. Although not directly exploitable for theft, it could lead to denial-of-service.',
                cwe: 'CWE-841'
            }] : [],
            overallScore: hasVulnerability ? 75 : 98,
        };
    }
};

// --- V. UTILITY & HELPER FUNCTIONS ---

const formatCurrency = (amount: number, currency: string) => `${amount.toLocaleString()} ${currency}`;
const truncateAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
const timeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return `${Math.floor(seconds)}s ago`;
};

// --- VI. UI COMPONENTS (SUB-COMPONENTS) ---

const LoadingSpinner: FC = () => (
    <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const ErrorDisplay: FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center h-full w-full bg-red-900/20 text-red-300 p-8 rounded-lg">
        <AlertTriangle className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
        <p className="mb-4 text-center">{message}</p>
        <button onClick={onRetry} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </button>
    </div>
);

const PriceDisplay: FC<{ amount: number; currency: string; usdValue?: number; size?: 'sm' | 'md' | 'lg' }> = ({ amount, currency, usdValue, size = 'md' }) => {
    const textSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm';
    return (
        <div>
            <p className={`${textSize} font-bold text-gray-100`}>{formatCurrency(amount, currency)}</p>
            {usdValue && <p className="text-sm text-gray-400">${usdValue.toLocaleString()}</p>}
        </div>
    );
};

const PortfolioSummary: FC = () => {
    const { state } = useNftVault();
    const { portfolioStats: stats } = state;
    if (!stats) return null;

    const data = [
        { title: 'Total Estimated Value', value: `${stats.totalValueEth.toFixed(2)} ETH`, change: '+2.5%' },
        { title: 'Total NFTs', value: stats.totalNfts.toString(), change: '' },
        { title: 'Unrealized P&L', value: `${stats.unrealizedPnlEth.toFixed(2)} ETH`, isPositive: stats.unrealizedPnlEth > 0 },
        { title: 'Realized P&L', value: `${stats.realizedPnlEth.toFixed(2)} ETH`, isPositive: stats.realizedPnlEth > 0 },
    ];
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {data.map(item => (
                <div key={item.title} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h4 className="text-gray-400 text-sm font-medium">{item.title}</h4>
                    <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
                    {item.change && <p className="text-sm text-green-400 mt-1">{item.change}</p>}
                    {item.isPositive !== undefined && <p className={`text-sm mt-1 ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>{item.isPositive ? '▲' : '▼'}</p>}
                </div>
            ))}
        </div>
    );
};

const CollectionDistributionChart: FC = () => {
    const { state } = useNftVault();
    const data = state.portfolioStats?.valueByCollection.slice(0, 5) || [];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
    
    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96">
            <h4 className="text-gray-200 text-lg font-bold mb-4">Collection Distribution</h4>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)} ETH`}/>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const FilterControls: FC = () => {
    const { state, dispatch } = useNftVault();
    const collections = useMemo(() => [...new Set(state.nfts.map(nft => nft.collection.name))], [state.nfts]);

    return (
        <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-800/50 rounded-lg mb-6 border border-gray-700">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or token ID..."
                    className="bg-gray-700 border border-gray-600 rounded-md pl-10 pr-4 py-2 w-full text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={state.filters.searchQuery}
                    onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { filter: 'searchQuery', value: e.target.value } })}
                />
            </div>
            {/* Simple dropdown for collections for brevity */}
            <select
              className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { filter: 'collections', value: e.target.value ? [e.target.value] : [] } })}
            >
                <option value="">All Collections</option>
                {collections.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
    );
};

const NftCard: FC<{ nft: Nft }> = ({ nft }) => {
    const { dispatch } = useNftVault();
    const latestValuation = nft.aiValuations[0]?.estimatedValueEth || nft.collection.stats.floorPrice;
    const pnl = latestValuation - nft.acquiredPrice.amount;

    return (
        <div onClick={() => dispatch({ type: 'SELECT_NFT', payload: nft.id })}
            className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer group">
            <img src={nft.media.uri} alt={nft.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
            <div className="p-4">
                <p className="text-xs text-gray-400">{nft.collection.name}</p>
                <h3 className="font-bold text-white truncate">{nft.name}</h3>
                <div className="mt-2 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-400">Value (AI)</p>
                        <p className="font-semibold text-white">{latestValuation.toFixed(2)} ETH</p>
                    </div>
                    <div className={`text-right text-sm ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <p>{pnl >= 0 ? '▲' : '▼'} {Math.abs(pnl).toFixed(2)}</p>
                        <p className="text-xs">P&L</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NftGallery: FC = () => {
    const { state } = useNftVault();

    const filteredNfts = useMemo(() => {
        return state.nfts.filter(nft => {
            const searchLower = state.filters.searchQuery.toLowerCase();
            const inSearch = nft.name.toLowerCase().includes(searchLower) || nft.tokenId.includes(searchLower);
            const inCollection = state.filters.collections.length === 0 || state.filters.collections.includes(nft.collection.name);
            // More filters could be added here
            return inSearch && inCollection;
        });
    }, [state.nfts, state.filters]);
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredNfts.map(nft => <NftCard key={nft.id} nft={nft} />)}
        </div>
    );
};

const PriceHistoryChart: FC<{ nft: Nft }> = ({ nft }) => {
    const data = nft.aiValuations.map(v => ({
        date: new Date(v.timestamp).toLocaleDateString(),
        value: v.estimatedValueEth,
    })).reverse();
    
    // Add acquired price as the first data point
    data.unshift({
        date: new Date(nft.acquiredAt).toLocaleDateString(),
        value: nft.acquiredPrice.amount
    });

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="date" stroke="#a0aec0" />
                <YAxis stroke="#a0aec0" domain={['dataMin - 1', 'dataMax + 1']}/>
                <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }}/>
                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" name="Value (ETH)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

const AIValuationPanel: FC<{ nft: Nft }> = ({ nft }) => {
    const { dispatch, state } = useNftVault();
    const [isValuating, setIsValuating] = useState(false);

    const handleRunValuation = async () => {
        if (!state.apiKey) {
            alert("Please set your AI API Key in settings.");
            return;
        }
        setIsValuating(true);
        try {
            const result = await api.runAiValuation(nft, state.apiKey);
            const updatedNft = { ...nft, aiValuations: [result, ...nft.aiValuations] };
            dispatch({ type: 'UPDATE_NFT', payload: updatedNft });
        } catch (error) {
            console.error("Valuation failed:", error);
            alert("AI Valuation failed. Please try again later.");
        } finally {
            setIsValuating(false);
        }
    };
    
    const latestValuation = nft.aiValuations[0];

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-white flex items-center"><Bot className="mr-2" /> AI Valuation</h4>
                <button
                    onClick={handleRunValuation}
                    disabled={isValuating}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center disabled:bg-gray-500"
                >
                    {isValuating ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Valuating...
                        </>
                    ) : (
                        <>
                            <Zap className="mr-2 w-4 h-4" /> Get Latest Valuation
                        </>
                    )}
                </button>
            </div>
            {latestValuation && (
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <PriceDisplay amount={latestValuation.estimatedValueEth} currency="ETH" size="lg" />
                        <p className="text-gray-400 text-sm">as of {timeAgo(latestValuation.timestamp)}</p>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">Confidence: <span className="font-semibold text-green-400">{(latestValuation.confidenceScore * 100).toFixed(1)}%</span></p>
                    <p className="text-gray-400 bg-gray-800 p-3 rounded-md text-sm">{latestValuation.details}</p>
                </div>
            )}
        </div>
    );
};

const SecurityAuditPanel: FC<{ nft: Nft }> = ({ nft }) => {
    const { dispatch } = useNftVault();
    const [isAuditing, setIsAuditing] = useState(false);

    const handleRunAudit = async () => {
        setIsAuditing(true);
        try {
            const result = await api.runSecurityAudit(nft);
            const updatedNft = { ...nft, securityAudits: [result, ...nft.securityAudits] };
            dispatch({ type: 'UPDATE_NFT', payload: updatedNft });
        } catch (error) {
            console.error("Audit failed:", error);
            alert("Security audit failed.");
        } finally {
            setIsAuditing(false);
        }
    };

    const latestAudit = nft.securityAudits[0];

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg mt-4 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-white flex items-center"><Shield className="mr-2" /> Contract Security</h4>
                 <button onClick={handleRunAudit} disabled={isAuditing} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center disabled:bg-gray-500">
                     {isAuditing ? 'Auditing...' : 'Run New Audit'}
                 </button>
            </div>
            {!latestAudit ? (
                <p className="text-gray-400">No security audit has been performed yet.</p>
            ) : (
                <div>
                    <p className="text-gray-300">Overall Score: <span className={`font-bold ${latestAudit.overallScore > 85 ? 'text-green-400' : 'text-yellow-400'}`}>{latestAudit.overallScore}/100</span></p>
                    <p className="text-xs text-gray-500 mb-2">Scanned {timeAgo(latestAudit.timestamp)}</p>
                    {latestAudit.vulnerabilities.length > 0 ? (
                         latestAudit.vulnerabilities.map((vuln, i) => (
                             <div key={i} className="bg-yellow-900/30 border border-yellow-700 p-2 rounded-md mt-2">
                                <p className="font-bold text-yellow-300 capitalize">{vuln.severity} Risk</p>
                                <p className="text-sm text-yellow-400">{vuln.description}</p>
                             </div>
                         ))
                    ) : (
                        <p className="text-green-400">No critical vulnerabilities found.</p>
                    )}
                </div>
            )}
        </div>
    );
};


const NftDetailModal: FC = () => {
    const { state, dispatch } = useNftVault();
    const nft = useMemo(() => state.nfts.find(n => n.id === state.selectedNftId), [state.nfts, state.selectedNftId]);

    if (!nft) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={() => dispatch({ type: 'SELECT_NFT', payload: null })}>
            <div className="bg-gray-800 text-white w-full max-w-6xl h-[90vh] rounded-2xl flex overflow-hidden border border-gray-600" onClick={(e) => e.stopPropagation()}>
                {/* Left Panel: Media */}
                <div className="w-1/2 bg-black flex items-center justify-center p-4">
                    <img src={nft.media.uri} alt={nft.name} className="max-w-full max-h-full object-contain rounded-lg" />
                </div>
                {/* Right Panel: Details */}
                <div className="w-1/2 p-6 overflow-y-auto">
                    <button onClick={() => dispatch({ type: 'SELECT_NFT', payload: null })} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                        <X className="w-8 h-8" />
                    </button>
                    <div className="flex items-center mb-2">
                        <img src={nft.collection.imageUrl} className="w-10 h-10 rounded-full mr-3" />
                        <h3 className="text-lg font-semibold text-gray-300">{nft.collection.name}</h3>
                    </div>
                    <h2 className="text-4xl font-bold mb-4">{nft.name}</h2>
                    <p className="text-gray-400 mb-6">{nft.description}</p>
                    
                    <AIValuationPanel nft={nft} />
                    
                    <div className="my-6">
                        <h4 className="font-bold text-lg mb-2">Price History</h4>
                        <PriceHistoryChart nft={nft} />
                    </div>

                    <div className="my-6">
                        <h4 className="font-bold text-lg mb-2">Traits</h4>
                        <div className="flex flex-wrap gap-2">
                            {nft.traits.map(trait => (
                                <div key={trait.trait_type} className="bg-gray-700 rounded-md p-2 text-center">
                                    <p className="text-xs text-blue-300 uppercase">{trait.trait_type}</p>
                                    <p className="font-semibold text-sm">{trait.value}</p>
                                    <p className="text-xs text-gray-400">Top {((trait.percentile || 0) * 100).toFixed(1)}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <SecurityAuditPanel nft={nft}/>
                </div>
            </div>
        </div>
    );
};

const TransactionHistoryTable: FC = () => {
    const { state } = useNftVault();
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;
    const paginatedTxs = state.transactions.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mt-8">
            <h3 className="text-xl font-bold mb-4">Transaction History</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">NFT</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Value</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Fraud Risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTxs.map(tx => (
                            <tr key={tx.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{tx.nftName}</td>
                                <td className="px-6 py-4 capitalize">{tx.type.replace('_', ' ')}</td>
                                <td className="px-6 py-4">{tx.price ? formatCurrency(tx.price.amount, tx.price.currency) : '-'}</td>
                                <td className="px-6 py-4">{timeAgo(tx.timestamp)}</td>
                                <td className="px-6 py-4">
                                    {tx.aiFraudRisk && tx.aiFraudRisk.score > 0.5 && (
                                        <span className="text-yellow-400 flex items-center">
                                            <AlertTriangle className="w-4 h-4 mr-1"/> High
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {/* Pagination controls */}
             <div className="flex justify-end items-center mt-4">
                 <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 bg-gray-700 rounded-md disabled:opacity-50 mr-2">Prev</button>
                 <span className="text-gray-400">Page {page + 1}</span>
                 <button onClick={() => setPage(p => p + 1)} disabled={paginatedTxs.length < rowsPerPage} className="px-3 py-1 bg-gray-700 rounded-md disabled:opacity-50 ml-2">Next</button>
             </div>
        </div>
    );
};

const ApiKeyModal: FC<{ onSetKey: (key: string) => void }> = ({ onSetKey }) => {
    const [key, setKey] = useState('');
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg text-white max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Set AI Provider API Key</h2>
                <p className="text-gray-400 mb-6">To enable AI-powered features like valuation and insights, please provide your API key (e.g., from Google AI Studio).</p>
                <input 
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white mb-6"
                    placeholder="sk-..."
                />
                <button 
                    onClick={() => onSetKey(key)}
                    className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-md"
                >
                    Save Key
                </button>
            </div>
        </div>
    );
};


// --- VII. MAIN COMPONENT ---

export const NftVaultView: React.FC = () => {
    const { state, dispatch } = useNftVault();
    const { isLoading, error, wallets, apiKey } = state;

    useEffect(() => {
        const loadData = async () => {
            dispatch({ type: 'FETCH_DATA_START' });
            try {
                const [nfts, transactions] = await Promise.all([
                    api.fetchNfts(wallets[0].address),
                    api.fetchTransactions(wallets[0].address),
                ]);
                dispatch({ type: 'FETCH_DATA_SUCCESS', payload: { nfts, transactions } });
            } catch (err: any) {
                dispatch({ type: 'FETCH_DATA_FAILURE', payload: err.message });
            }
        };
        if (apiKey) {
           loadData();
        }
    }, [dispatch, wallets, apiKey]);

    const handleRetry = () => {
       const loadData = async () => {
            dispatch({ type: 'FETCH_DATA_START' });
            try {
                const [nfts, transactions] = await Promise.all([
                    api.fetchNfts(wallets[0].address),
                    api.fetchTransactions(wallets[0].address),
                ]);
                dispatch({ type: 'FETCH_DATA_SUCCESS', payload: { nfts, transactions } });
            } catch (err: any) {
                dispatch({ type: 'FETCH_DATA_FAILURE', payload: err.message });
            }
        };
        loadData();
    };

    if (!apiKey) {
        return <ApiKeyModal onSetKey={(key) => dispatch({ type: 'SET_API_KEY', payload: key })} />;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-2">NFT Vault</h1>
            <p className="text-gray-400 mb-8">An AI-powered dashboard to manage and analyze your digital assets.</p>

            {isLoading ? (
                <div className="h-[60vh]"><LoadingSpinner /></div>
            ) : error ? (
                <ErrorDisplay message={error} onRetry={handleRetry} />
            ) : (
                <>
                    <PortfolioSummary />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2">
                             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96">
                                <h4 className="text-gray-200 text-lg font-bold mb-4">Portfolio Value Over Time (ETH)</h4>
                                {/* Placeholder for portfolio chart */}
                             </div>
                        </div>
                        <CollectionDistributionChart />
                    </div>
                    <FilterControls />
                    <NftGallery />
                    <TransactionHistoryTable />
                </>
            )}
            <NftDetailModal />
        </div>
    );
};

// --- VIII. WRAPPER COMPONENT ---
// Provides the context to the main view, making it a self-contained feature.
const NftVaultViewContainer: React.FC = () => {
    const [state, dispatch] = useReducer(nftVaultReducer, initialState);

    return (
        <NftVaultContext.Provider value={{ state, dispatch }}>
            <NftVaultView />
        </NftVaultContext.Provider>
    );
};

export default NftVaultViewContainer;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/digitalassets/NftVaultView.tsx
================================================================================

// components/views/megadashboard/digitalassets/NftVaultView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

const NftVaultView: React.FC = () => {
    const [isValuationModalOpen, setValuationModalOpen] = useState(false);
    const [nftName, setNftName] = useState("CryptoPunk #7804");
    const [valuation, setValuation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setValuation('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Provide a brief, high-level valuation analysis for the NFT named "${nftName}", considering its collection, rarity, and recent market trends.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setValuation(response.text);
        } catch (err) {
            setValuation("Error generating valuation.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">NFT Vault</h2>
                     <button onClick={() => setValuationModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Valuation</button>
                </div>
                <Card title="Your Collection">
                     <p className="text-gray-400">This would display a gallery of the user's NFTs.</p>
                </Card>
            </div>
             {isValuationModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setValuationModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI NFT Valuation Estimator</h3></div>
                        <div className="p-6 space-y-4">
                             <input type="text" value={nftName} onChange={e => setNftName(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded text-white" />
                             <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Estimating...' : 'Estimate Value'}</button>
                            <Card title={`Valuation for ${nftName}`}><div className="min-h-[10rem] text-sm text-gray-300 whitespace-pre-line">{isLoading ? '...' : valuation}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default NftVaultView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/digitalassets/NftVaultView.tsx
================================================================================

// components/views/megadashboard/digitalassets/NftVaultView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

const NftVaultView: React.FC = () => {
    const [isValuationModalOpen, setValuationModalOpen] = useState(false);
    const [nftName, setNftName] = useState("CryptoPunk #7804");
    const [valuation, setValuation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setValuation('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Provide a brief, high-level valuation analysis for the NFT named "${nftName}", considering its collection, rarity, and recent market trends.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setValuation(response.text);
        } catch (err) {
            setValuation("Error generating valuation.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">NFT Vault</h2>
                     <button onClick={() => setValuationModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Valuation</button>
                </div>
                <Card title="Your Collection">
                     <p className="text-gray-400">This would display a gallery of the user's NFTs.</p>
                </Card>
            </div>
             {isValuationModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setValuationModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI NFT Valuation Estimator</h3></div>
                        <div className="p-6 space-y-4">
                             <input type="text" value={nftName} onChange={e => setNftName(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded text-white" />
                             <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Estimating...' : 'Estimate Value'}</button>
                            <Card title={`Valuation for ${nftName}`}><div className="min-h-[10rem] text-sm text-gray-300 whitespace-pre-line">{isLoading ? '...' : valuation}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default NftVaultView;
