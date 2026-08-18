// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/CryptoView.tsx
================================================================================

import React, { useContext, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

// SECTION: Enhanced Types and Interfaces for a Real-World Application

export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type TransactionType = 'buy' | 'sell' | 'send' | 'receive' | 'stake' | 'unstake' | 'swap';
export type BlockchainNetwork = 'Ethereum' | 'Polygon' | 'Solana' | 'Arbitrum' | 'Optimism';

export interface HistoricalDataPoint {
    timestamp: number;
    value: number;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    status: TransactionStatus;
    asset: string;
    amount: number;
    valueUSD: number;
    fromAddress?: string;
    toAddress?: string;
    timestamp: number;
    network: BlockchainNetwork;
    txHash: string;
}

export interface StakingPool {
    id: string;
    asset: string;
    apy: number;
    totalStaked: number;
    myStake: number;
    logoUrl: string;
    network: BlockchainNetwork;
}

export interface DeFiProtocol {
    id: string;
    name: string;
    tvl: number;
    category: 'DEX' | 'Lending' | 'Liquid Staking';
    logoUrl: string;
    description: string;
}

export interface NewsArticle {
    id: string;
    title: string;
    source: string;
    publishedAt: string;
    url: string;
    imageUrl: string;
    sentiment: 'positive' | 'negative' | 'neutral';
}

export interface GasPrices {
    standard: number;
    fast: number;
    rapid: number;
}

export interface PriceAlert {
    id: string;
    asset: string;
    targetPrice: number;
    condition: 'above' | 'below';
    isActive: boolean;
}

export interface AdvancedCryptoAsset extends CryptoAsset {
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
    sparkline: number[];
    logoUrl: string;
    symbol: string;
}

// SECTION: SVG Icons as React Components for clean, dependency-free UI

export const EthereumIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.69769L11.9323 2.74316V15.185L18.4201 11.514L12 2.69769Z" fill="#C0C0C0"/>
        <path d="M12 2.69769L5.57993 11.514L12 15.185V2.69769Z" fill="white"/>
        <path d="M12 16.327L11.9406 16.3813V21.3023L12 21.4395L18.4201 12.656L12 16.327Z" fill="#C0C0C0"/>
        <path d="M12 21.4395V16.327L5.57993 12.656L12 21.4395Z" fill="white"/>
        <path d="M12 15.185L18.4201 11.514L12.0001 7.85093L12 15.185Z" fill="#E0E0E0"/>
        <path d="M5.57993 11.514L12 15.185V7.85093L5.57993 11.514Z" fill="#F0F0F0"/>
    </svg>
);

export const SwapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
);

export const StakeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

// SECTION: Utility Functions for Data Formatting

export const formatCurrency = (value: number, decimals = 2) => `$${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
export const shortenAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
export const timeAgo = (timestamp: number): string => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};
export const getChainInfo = (network: BlockchainNetwork) => {
    const info = {
        Ethereum: { name: 'Ethereum', color: '#627eea' },
        Polygon: { name: 'Polygon', color: '#8247e5' },
        Solana: { name: 'Solana', color: '#9945FF' },
        Arbitrum: { name: 'Arbitrum', color: '#28a0f0' },
        Optimism: { name: 'Optimism', color: '#FF0420' },
    };
    return info[network];
};

// SECTION: Mock Data Generators to Simulate a Real Backend

export const generateMockTransactions = (count: number): Transaction[] => {
    const assets = ['ETH', 'BTC', 'SOL', 'USDC', 'MATIC'];
    const types: TransactionType[] = ['buy', 'sell', 'send', 'receive', 'stake', 'unstake', 'swap'];
    const statuses: TransactionStatus[] = ['completed', 'completed', 'completed', 'pending', 'failed'];
    const networks: BlockchainNetwork[] = ['Ethereum', 'Polygon', 'Solana', 'Arbitrum', 'Optimism'];
    return Array.from({ length: count }, (_, i) => ({
        id: `tx-${i}-${Date.now()}`,
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        asset: assets[Math.floor(Math.random() * assets.length)],
        amount: Math.random() * 10,
        valueUSD: Math.random() * 5000,
        fromAddress: `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        toAddress: `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // last 30 days
        network: networks[Math.floor(Math.random() * networks.length)],
        txHash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    })).sort((a, b) => b.timestamp - a.timestamp);
};

export const generateMockHistoricalData = (days: number): HistoricalDataPoint[] => {
    let value = 50000 + Math.random() * 20000;
    const now = Date.now();
    return Array.from({ length: days }, (_, i) => {
        value *= 1 + (Math.random() - 0.49) * 0.05; // Simulate daily fluctuation
        return {
            timestamp: now - (days - i - 1) * 24 * 60 * 60 * 1000,
            value,
        };
    });
};

export const generateAdvancedCryptoAssets = (baseAssets: CryptoAsset[]): AdvancedCryptoAsset[] => {
    const logoMap: {[key:string]: string} = {
        'BTC': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
        'ETH': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        'SOL': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
        'USDC': 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    }
    return baseAssets.map(asset => ({
        ...asset,
        price: asset.value / asset.amount,
        change24h: (Math.random() - 0.5) * 10, // -5% to +5%
        marketCap: asset.value * (1000 + Math.random() * 5000),
        volume24h: asset.value * (100 + Math.random() * 500),
        sparkline: Array.from({ length: 30 }, () => Math.random() * asset.value),
        logoUrl: logoMap[asset.ticker] || '',
        symbol: asset.ticker
    }));
};

export const generateMockStakingPools = (): StakingPool[] => [
    { id: 'eth-lido', asset: 'ETH', apy: 3.8, totalStaked: 9500000, myStake: 2.5, logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png', network: 'Ethereum' },
    { id: 'matic-lido', asset: 'MATIC', apy: 5.2, totalStaked: 850000000, myStake: 1500, logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png', network: 'Polygon' },
    { id: 'sol-jito', asset: 'SOL', apy: 7.1, totalStaked: 6800000, myStake: 25.5, logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', network: 'Solana' },
    { id: 'arb-gmx', asset: 'ARB', apy: 4.5, totalStaked: 12000000, myStake: 0, logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png', network: 'Arbitrum' },
];

export const generateMockDeFiProtocols = (): DeFiProtocol[] => [
    { id: 'uniswap', name: 'Uniswap', tvl: 4120000000, category: 'DEX', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png', description: 'A decentralized exchange for swapping ERC20 tokens.' },
    { id: 'aave', name: 'Aave', tvl: 6800000000, category: 'Lending', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png', description: 'A decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers.' },
    { id: 'lido', name: 'Lido', tvl: 14200000000, category: 'Liquid Staking', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png', description: 'A liquid staking solution for ETH and other PoS assets.' },
    { id: 'curve', name: 'Curve Finance', tvl: 2900000000, category: 'DEX', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6538.png', description: 'An exchange liquidity pool on Ethereum designed for extremely efficient stablecoin trading.' },
];

// SECTION: Custom Hooks for State Management and Data Fetching Simulation

export const useCryptoDataFeed = (initialGasPrices: GasPrices) => {
    const [gasPrices, setGasPrices] = useState<GasPrices>(initialGasPrices);
    const [livePortfolioValue, setLivePortfolioValue] = useState(0);

    useEffect(() => {
        const gasInterval = setInterval(() => {
            setGasPrices({
                standard: 40 + (Math.random() - 0.5) * 10,
                fast: 50 + (Math.random() - 0.5) * 12,
                rapid: 60 + (Math.random() - 0.5) * 15,
            });
        }, 5000); // Update every 5 seconds

        const portfolioInterval = setInterval(() => {
            setLivePortfolioValue(prev => prev * (1 + (Math.random() - 0.5) * 0.0001));
        }, 1000); // Update every second

        return () => {
            clearInterval(gasInterval);
            clearInterval(portfolioInterval);
        };
    }, []);

    return { gasPrices, livePortfolioValue };
};

// SECTION: Advanced Reusable UI Components

export const AssetSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => (
    <div className="h-10 w-24">
        <ResponsiveContainer>
            <LineChart data={data.map(v => ({ value: v }))}>
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export const AssetTable: React.FC<{ assets: AdvancedCryptoAsset[] }> = ({ assets }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof AdvancedCryptoAsset; direction: 'asc' | 'desc' } | null>(null);

    const sortedAssets = useMemo(() => {
        let sortableAssets = [...assets];
        if (sortConfig !== null) {
            sortableAssets.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableAssets;
    }, [assets, sortConfig]);

    const requestSort = (key: keyof AdvancedCryptoAsset) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortArrow = (key: keyof AdvancedCryptoAsset) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                    <tr>
                        {['Asset', 'Price', '24h %', 'Holdings', 'Market Cap', '24h Volume', 'Last 7 Days'].map(header => {
                            const key = {
                                'Asset': 'name', 'Price': 'price', '24h %': 'change24h',
                                'Holdings': 'value', 'Market Cap': 'marketCap', '24h Volume': 'volume24h'
                            }[header] as keyof AdvancedCryptoAsset;
                            return (
                                <th key={header} scope="col" className="px-4 py-3 cursor-pointer" onClick={() => key && requestSort(key)}>
                                    {header}{getSortArrow(key)}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {sortedAssets.map(asset => (
                        <tr key={asset.name} className="border-b border-gray-700 hover:bg-gray-800/50">
                            <th scope="row" className="px-4 py-4 font-medium text-white whitespace-nowrap flex items-center">
                                <img src={asset.logoUrl} alt={asset.name} className="w-6 h-6 mr-3 rounded-full" />
                                <div>
                                    <div>{asset.name}</div>
                                    <div className="text-xs text-gray-500">{asset.symbol}</div>
                                </div>
                            </th>
                            <td className="px-4 py-4">{formatCurrency(asset.price, 2)}</td>
                            <td className={`px-4 py-4 ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {asset.change24h.toFixed(2)}%
                            </td>
                            <td className="px-4 py-4">
                                <div>{formatCurrency(asset.value)}</div>
                                <div className="text-xs text-gray-500">{asset.amount.toFixed(4)} {asset.symbol}</div>
                            </td>
                            <td className="px-4 py-4">{formatCurrency(asset.marketCap, 0)}</td>
                            <td className="px-4 py-4">{formatCurrency(asset.volume24h, 0)}</td>
                            <td className="px-4 py-4">
                                <AssetSparkline data={asset.sparkline} color={asset.change24h >= 0 ? '#4ade80' : '#f87171'} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const TransactionHistoryTable: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const [filter, setFilter] = useState<TransactionType | 'all'>('all');
    
    const filteredTransactions = transactions.filter(tx => filter === 'all' || tx.type === filter);
    
    const getStatusIndicator = (status: TransactionStatus) => {
        switch (status) {
            case 'completed': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900/50 rounded-full">Completed</span>;
            case 'pending': return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900/50 rounded-full">Pending</span>;
            case 'failed': return <span className="px-2 py-1 text-xs font-medium text-red-300 bg-red-900/50 rounded-full">Failed</span>;
        }
    };
    
    return (
        <div>
            <div className="flex space-x-2 mb-4">
                {(['all', 'buy', 'sell', 'send', 'receive', 'swap'] as const).map(f =>
                    <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-sm rounded-full ${filter === f ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                )}
            </div>
            <div className="overflow-y-auto max-h-96">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">Date</th>
                            <th scope="col" className="px-4 py-3">Type</th>
                            <th scope="col" className="px-4 py-3">Asset</th>
                            <th scope="col" className="px-4 py-3">Amount</th>
                            <th scope="col" className="px-4 py-3">Network</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(tx => (
                            <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                <td className="px-4 py-4">{timeAgo(tx.timestamp)}</td>
                                <td className="px-4 py-4 capitalize">{tx.type}</td>
                                <td className="px-4 py-4 font-medium text-white">{tx.asset}</td>
                                <td className="px-4 py-4">
                                    <div>{tx.amount.toFixed(4)} {tx.asset}</div>
                                    <div className="text-xs text-gray-500">{formatCurrency(tx.valueUSD)}</div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="font-mono text-xs px-2 py-1 rounded" style={{ backgroundColor: `${getChainInfo(tx.network).color}20`, color: getChainInfo(tx.network).color }}>
                                        {tx.network}
                                    </span>
                                </td>
                                <td className="px-4 py-4">{getStatusIndicator(tx.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const PortfolioHistoryChart: React.FC<{ data: HistoricalDataPoint[] }> = ({ data }) => {
    return (
        <div className="h-80 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        stroke="#9ca3af"
                        fontSize={12}
                    />
                    <YAxis 
                        orientation="right" 
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`}
                        domain={['dataMin', 'dataMax']}
                    />
                    <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#4b5563', borderRadius: '0.5rem' }}
                        labelFormatter={(ts) => new Date(ts).toLocaleString()}
                        formatter={(value) => [formatCurrency(Number(value)), 'Portfolio Value']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export const GasTracker: React.FC<{ prices: GasPrices }> = ({ prices }) => (
    <div className="flex items-center space-x-4 text-sm bg-gray-900/50 p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v11a1 1 0 100 2h1.333l.4-1.6a.5.5 0 01.976 0l.4 1.6H17a1 1 0 100-2V5a1 1 0 000-2H3zm12.978 4.846a.5.5 0 00-.707-.707l-3.09 3.09-1.293-1.293a.5.5 0 00-.707.707l1.646 1.647a.5.5 0 00.707 0l3.5-3.5z" clipRule="evenodd" />
        </svg>
        <span className="text-gray-400">Gas (Gwei):</span>
        <div className="flex items-center space-x-3">
            <span title="Standard">🐢 {prices.standard.toFixed(0)}</span>
            <span title="Fast">🚗 {prices.fast.toFixed(0)}</span>
            <span title="Rapid">🚀 {prices.rapid.toFixed(0)}</span>
        </div>
    </div>
);

// SECTION: Feature-Rich Dashboard Tabs

export const DashboardTab: React.FC<{
    advancedAssets: AdvancedCryptoAsset[],
    historicalData: HistoricalDataPoint[],
    transactions: Transaction[],
}> = ({ advancedAssets, historicalData, transactions }) => {
    return (
        <div className="space-y-6">
            <Card title="Portfolio Performance">
                <PortfolioHistoryChart data={historicalData} />
            </Card>
            <Card title="Asset Allocation">
                <AssetTable assets={advancedAssets} />
            </Card>
            <Card title="Transaction History">
                <TransactionHistoryTable transactions={transactions} />
            </Card>
        </div>
    );
};

export const DeFiTab: React.FC<{
    stakingPools: StakingPool[],
    protocols: DeFiProtocol[],
    cryptoAssets: AdvancedCryptoAsset[]
}> = ({ stakingPools, protocols, cryptoAssets }) => {
    const [swapFrom, setSwapFrom] = useState({ asset: 'ETH', amount: 1 });
    const [swapTo, setSwapTo] = useState({ asset: 'USDC', amount: 3000 });
    
    const handleSwap = () => {
        // Mock swap logic
        console.log(`Swapping ${swapFrom.amount} ${swapFrom.asset} for ${swapTo.amount} ${swapTo.asset}`);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card title="Crypto Swap">
                    <div className="space-y-4 p-4">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <label className="text-xs text-gray-400">You Pay</label>
                            <div className="flex items-center justify-between mt-1">
                                <input type="number" value={swapFrom.amount} onChange={e => setSwapFrom({...swapFrom, amount: parseFloat(e.target.value)})} className="text-2xl bg-transparent text-white w-full focus:outline-none" />
                                <div className="flex items-center bg-gray-700 p-2 rounded-full">
                                    <img src={cryptoAssets.find(a => a.symbol === swapFrom.asset)?.logoUrl} className="w-6 h-6 mr-2" />
                                    <span className="text-white font-semibold">{swapFrom.asset}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button className="p-2 bg-gray-700 rounded-full text-gray-400 hover:bg-cyan-500 hover:text-white transition-transform duration-300 transform hover:rotate-180">
                                <SwapIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <label className="text-xs text-gray-400">You Receive (estimated)</label>
                            <div className="flex items-center justify-between mt-1">
                                <input type="number" value={swapTo.amount} readOnly className="text-2xl bg-transparent text-white w-full focus:outline-none" />
                                <div className="flex items-center bg-gray-700 p-2 rounded-full">
                                    <img src={cryptoAssets.find(a => a.symbol === swapTo.asset)?.logoUrl} className="w-6 h-6 mr-2" />
                                    <span className="text-white font-semibold">{swapTo.asset}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleSwap} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg">Swap Tokens</button>
                    </div>
                </Card>
                <Card title="Top DeFi Protocols by TVL">
                    <div className="space-y-3">
                        {protocols.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded-lg">
                                <div className="flex items-center">
                                    <img src={p.logoUrl} alt={p.name} className="w-8 h-8 mr-3"/>
                                    <div>
                                        <p className="font-semibold text-white">{p.name}</p>
                                        <p className="text-xs text-gray-400">{p.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-white">{formatCurrency(p.tvl, 0)}</p>
                                    <p className="text-xs text-gray-400">TVL</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card title="Staking & Yield">
                    <div className="space-y-4">
                        {stakingPools.map(pool => (
                            <div key={pool.id} className="p-3 bg-gray-800/50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <img src={pool.logoUrl} alt={pool.asset} className="w-8 h-8 mr-3"/>
                                        <div>
                                            <p className="font-bold text-white">{pool.asset} Pool</p>
                                            <p className="text-xs font-mono" style={{color: getChainInfo(pool.network).color}}>{pool.network}</p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-bold text-green-400">{pool.apy}% APY</p>
                                </div>
                                <div className="text-xs mt-3 flex justify-between text-gray-400">
                                    <span>Your Stake:</span>
                                    <span className="font-semibold text-white">{pool.myStake} {pool.asset}</span>
                                </div>
                                <div className="text-xs flex justify-between text-gray-400">
                                    <span>Total Staked:</span>
                                    <span className="font-semibold text-white">{formatCurrency(pool.totalStaked, 0)}</span>
                                </div>
                                <button className="mt-3 w-full text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                                    {pool.myStake > 0 ? 'Manage Stake' : 'Stake Now'}
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};


const CryptoView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CryptoView must be within a DataProvider.");
    
    const { cryptoAssets, walletInfo, virtualCard, connectWallet, issueCard, buyCrypto, nftAssets, mintNFT } = context;
    
    const [isIssuingCard, setIsIssuingCard] = useState(false);
    const [isMetaMaskModalOpen, setIsMetaMaskModalOpen] = useState(false);
    const [isStripeModalOpen, setStripeModalOpen] = useState(false);
    const [buyAmount, setBuyAmount] = useState('100');
    
    // State for new advanced features
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'DeFi' | 'NFTs' | 'Services'>('Dashboard');
    const { gasPrices } = useCryptoDataFeed({ standard: 45, fast: 52, rapid: 60 });
    const [mockTransactions] = useState(() => generateMockTransactions(50));
    const [mockHistoricalData] = useState(() => generateMockHistoricalData(90));
    const [mockStakingPools] = useState(() => generateMockStakingPools());
    const [mockDeFiProtocols] = useState(() => generateMockDeFiProtocols());
    
    const advancedCryptoAssets = useMemo(() => generateAdvancedCryptoAssets(cryptoAssets), [cryptoAssets]);

    const handleIssueCard = () => { setIsIssuingCard(true); setTimeout(() => { issueCard(); setIsIssuingCard(false); }, 2000); };
    const handleMetaMaskConnect = () => { connectWallet(); setIsMetaMaskModalOpen(false); };
    const handleBuyCrypto = () => { buyCrypto(parseFloat(buyAmount), 'ETH'); setStripeModalOpen(false); };
    
    const MetaMaskConnectModal: React.FC<{ isOpen: boolean; onClose: () => void; onConnect: () => void; }> = ({ isOpen, onClose, onConnect }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
                <div className="bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full border border-gray-700 flex flex-col" onClick={e=>e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700 text-center"><h3 className="font-semibold text-white">MetaMask</h3></div>
                    <div className="p-6 flex-grow flex flex-col items-center text-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="Metamask" className="h-16 w-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-white mt-4">Connect With MetaMask</h4>
                        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg w-full">
                            <p className="text-sm text-gray-300">Allow this site to:</p>
                            <ul className="text-xs text-gray-400 list-disc list-inside mt-1 text-left ml-2"><li>View the addresses of your permitted accounts.</li><li>Suggest transactions to approve.</li></ul>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-900/50 grid grid-cols-2 gap-3">
                         <button onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancel</button>
                         <button onClick={onConnect} className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg">Connect</button>
                    </div>
                </div>
            </div>
        );
    };
    
    const StripeCheckoutModal: React.FC<{ isOpen: boolean; onClose: () => void; onPay: () => void; amountUSD: string; }> = ({ isOpen, onClose, onPay, amountUSD }) => {
        const [isProcessing, setIsProcessing] = useState(false);
        const handlePayClick = () => { setIsProcessing(true); setTimeout(() => { onPay(); setIsProcessing(false); }, 2000); };
        if (!isOpen) return null;
        return ( <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}><div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full border border-gray-700 flex flex-col" onClick={e=>e.stopPropagation()}><div className="p-6 bg-gray-800 rounded-t-lg"><h3 className="font-semibold text-white">Demo Bank Inc.</h3><p className="text-2xl font-bold text-white mt-2">${parseFloat(amountUSD).toFixed(2)}</p></div><div className="p-6 space-y-4"><input type="email" placeholder="Email" className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" defaultValue="visionary@demobank.com" /><input type="text" placeholder="Card information" className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" defaultValue="4242 4242 4242 4242" /><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="MM / YY" className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" defaultValue="12 / 28" /><input type="text" placeholder="CVC" className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" defaultValue="123" /></div><button onClick={handlePayClick} disabled={isProcessing} className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center">{isProcessing && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}{isProcessing ? 'Processing...' : `Pay $${parseFloat(amountUSD).toFixed(2)}`}</button></div></div></div>);
    }
    
    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <DashboardTab advancedAssets={advancedCryptoAssets} historicalData={mockHistoricalData} transactions={mockTransactions} />;
            case 'DeFi':
                return <DeFiTab stakingPools={mockStakingPools} protocols={mockDeFiProtocols} cryptoAssets={advancedCryptoAssets} />;
            case 'NFTs':
                return <Card title="NFT Gallery"><div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">{nftAssets.map(nft => (<div key={nft.id}><img src={nft.imageUrl} alt={nft.name} className="w-full rounded-lg aspect-square object-cover" /><p className="text-xs font-semibold text-white mt-2 truncate">{nft.name}</p></div>))}<button onClick={() => mintNFT("Quantum Vision Pass", "/IMG_5610.webp")} className="w-full rounded-lg aspect-square border-2 border-dashed border-gray-600 hover:border-cyan-400 flex flex-col items-center justify-center text-gray-400 hover:text-cyan-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg><span className="text-xs mt-2">Mint NFT</span></button></div></Card>;
            case 'Services':
                return (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Virtual Card" subtitle="Web3-enabled payments" className="h-full">
                            <div className="flex flex-col items-center justify-center text-center h-full min-h-[15rem]">{virtualCard ? (<div className="w-full max-w-sm aspect-[85.6/54] rounded-xl p-4 flex flex-col justify-between bg-gradient-to-br from-cyan-900 via-gray-900 to-indigo-900 border border-cyan-500/30"><div className="flex justify-between items-start"><p className="font-semibold text-white">Quantum Card</p></div><div><p className="font-mono text-lg text-white tracking-widest text-left">{virtualCard.cardNumber}</p><div className="flex justify-between text-xs font-mono text-gray-300 mt-2"><span>{virtualCard.holderName.toUpperCase()}</span><span>EXP: {virtualCard.expiry}</span><span>CVV: {virtualCard.cvv}</span></div></div></div>) : (<><p className="text-gray-400 mb-4">Issue a virtual card to spend your crypto assets anywhere.</p><button onClick={handleIssueCard} disabled={isIssuingCard} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">{isIssuingCard ? 'Issuing Card...' : 'Issue Virtual Card'}</button></>)}</div>
                        </Card>
                        <Card title="Buy Crypto (On-Ramp)" className="h-full">
                             <div className="flex flex-col items-center justify-center text-center h-full min-h-[15rem]"><p className="text-gray-400">Buy crypto via our Stripe integration.</p><div className="flex items-center my-4"><span className="text-2xl font-bold text-white mr-2">$</span><input type="number" value={buyAmount} onChange={e => setBuyAmount(e.target.value)} className="w-32 text-center text-2xl font-bold text-white bg-transparent border-b-2 border-cyan-500 focus:outline-none"/></div><button onClick={() => setStripeModalOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Buy with Stripe</button></div>
                        </Card>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-wider">Crypto & Web3 Hub</h2>
                    <p className="text-gray-400 mt-1">Your unified gateway to the decentralized world.</p>
                </div>
                <div className="hidden lg:flex items-center space-x-4">
                    <GasTracker prices={gasPrices} />
                     <Card title="" className="!p-0 !bg-transparent !border-none">
                        <div className="flex flex-col items-center justify-center text-center h-full">
                            {walletInfo ? (
                                <div className="bg-gray-800/80 px-4 py-2 rounded-lg text-left">
                                    <p className="text-sm text-green-400 font-semibold">Wallet Connected</p>
                                    <p className="text-sm text-gray-300 font-mono break-all">{shortenAddress(walletInfo.address)}</p>
                                    <p className="text-md text-white">{walletInfo.balance.toFixed(4)} ETH</p>
                                </div>
                            ) : (
                                <button onClick={() => setIsMetaMaskModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg">Connect Metamask</button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {(['Dashboard', 'DeFi', 'NFTs', 'Services'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                    ? 'border-cyan-500 text-cyan-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="mt-6">
                {renderContent()}
            </div>

            <MetaMaskConnectModal isOpen={isMetaMaskModalOpen} onClose={() => setIsMetaMaskModalOpen(false)} onConnect={handleMetaMaskConnect} />
            <StripeCheckoutModal isOpen={isStripeModalOpen} onClose={() => setStripeModalOpen(false)} onPay={handleBuyCrypto} amountUSD={buyAmount} />
        </div>
    );
};

export default CryptoView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/CryptoView.tsx
================================================================================

import React, { useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Coins, Zap, Shield, Globe, Database, Cpu } from 'lucide-react';

const CryptoView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { assets, simulationData } = context;

  const cryptoAssets = useMemo(() => assets.filter(a => a.assetClass === 'CRYPTO'), [assets]);
  const COLORS = ['#f59e0b', '#6366f1', '#10b981', '#ef4444'];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-4 h-4 text-orange-400" />
            <h2 className="text-xs font-mono text-orange-400 uppercase tracking-[0.3em]">DLT Liquidity Node 7x</h2>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">Crypto & Web3</h1>
        </div>
        <div className="flex gap-4">
           <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl text-right">
              <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Total Web3 Exposure</p>
              <p className="text-xl font-mono text-white font-bold">${cryptoAssets.reduce((acc, a) => acc + a.value, 0).toLocaleString()}</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <Card title="Global Crypto Sentiment" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={simulationData.length > 0 ? simulationData : [{time: '0', value: 0}]}>
                    <defs>
                      <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorOrange)" />
                 </AreaChart>
              </ResponsiveContainer>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card title="Smart Contract Health" icon={<Shield className="w-5 h-5 text-green-400" />}>
                 <div className="space-y-4 pt-2">
                    {['L1 Consensus', 'Cross-chain Bridge', 'DEX Liquidity', 'Oracle Sync'].map(label => (
                      <div key={label} className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800">
                         <span className="text-sm font-medium text-gray-400">{label}</span>
                         <span className="text-xs font-mono text-green-400 font-bold uppercase">Safe</span>
                      </div>
                    ))}
                 </div>
              </Card>

              <Card title="Mining & Staking Hash" icon={<Zap className="w-5 h-5 text-yellow-400" />}>
                 <div className="flex flex-col items-center justify-center h-full py-6 space-y-4">
                    <div className="text-4xl font-black text-white font-mono">14.2 EH/s</div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Pooled Network Power</p>
                 </div>
              </Card>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
           <Card title="Asset Distribution">
              {cryptoAssets.length > 0 ? (
                <>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                              data={cryptoAssets} 
                              cx="50%" 
                              cy="50%" 
                              innerRadius={60} 
                              outerRadius={80} 
                              paddingAngle={5} 
                              dataKey="value" 
                              stroke="none"
                          >
                            {cryptoAssets.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3 mt-4">
                    {cryptoAssets.map((asset, i) => (
                        <div key={asset.id} className="flex justify-between items-center p-3 bg-gray-900 border border-gray-800 rounded-2xl">
                          <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                              <span className="text-sm font-bold text-white">{asset.name}</span>
                          </div>
                          <span className="text-xs font-mono text-gray-400">${asset.value.toLocaleString()}</span>
                        </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-20 text-center text-gray-600 font-mono text-xs uppercase">No Crypto Assets Found</div>
              )}
           </Card>

           <Card title="On-Chain Directives" icon={<Cpu className="w-5 h-5 text-cyan-400" />}>
              <div className="space-y-4 pt-2">
                 <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                    <p className="text-xs text-orange-300 italic leading-relaxed">"Neural Core: High volatility in DeFi yield aggregators detected. Suggest migrating 12% of USDC pool to Aave v4."</p>
                 </div>
                 <button className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black tracking-widest rounded-2xl transition-all shadow-lg shadow-orange-500/20">
                    EXECUTE REBALANCE
                 </button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default CryptoView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CryptoView (1).tsx
================================================================================

import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset, EIP6963ProviderDetail } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

// --- Expanded Types & Interfaces for Hyper-Dimensional UI ---

interface AIInsight {
    id: string;
    type: 'opportunity' | 'warning' | 'neutral' | 'alpha';
    message: string;
    confidence: number;
    timestamp: string;
    actionable: boolean;
}

interface MarketSentiment {
    bullish: number;
    bearish: number;
    neutral: number;
    trend: 'strong up' | 'up' | 'down' | 'stable' | 'volatile';
    volatilityIndex: number;
}

interface AIChatMessage {
    id: string;
    sender: 'user' | 'system' | 'ai_core';
    text: string;
    timestamp: Date;
    actions?: { label: string; action: () => void }[];
}

interface HFTOrder {
    id: string;
    pair: string;
    type: 'LIMIT' | 'MARKET';
    side: 'BUY' | 'SELL';
    price: number;
    amount: number;
    status: 'OPEN' | 'FILLED' | 'CANCELLED';
    timestamp: string;
}

interface AITradingBot {
    id: string;
    name: string;
    strategy: 'Arbitrage' | 'Momentum' | 'Mean Reversion';
    status: 'active' | 'paused' | 'error';
    pnl: number;
    uptime: string;
}

interface GovernanceProposal {
    id: string;
    protocol: string;
    protocolIcon: string;
    title: string;
    status: 'active' | 'passed' | 'failed';
    userVote?: 'for' | 'against' | 'abstain';
}

// --- Super-Components ---

const AIStatusBadge: React.FC<{ status: 'active' | 'learning' | 'processing' | 'securing' | 'thinking' }> = ({ status }) => {
    const colors = {
        active: 'bg-green-500',
        learning: 'bg-blue-500',
        processing: 'bg-purple-500',
        securing: 'bg-yellow-500',
        thinking: 'bg-cyan-400',
    };
    const text = {
        active: 'Online',
        learning: 'Adapting',
        processing: 'Computing',
        securing: 'Guarding',
        thinking: 'Thinking...',
    }
    
    return (
        <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700 shadow-inner">
            <span className={`w-2 h-2 rounded-full animate-pulse ${colors[status]}`}></span>
            <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">AI Core: {text[status]}</span>
        </div>
    );
};

const ConfidenceMeter: React.FC<{ score: number }> = ({ score }) => (
    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
        <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-1000" 
            style={{ width: `${score}%` }}
        ></div>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-300 border-b-2 whitespace-nowrap ${
            active 
            ? 'border-cyan-500 text-white bg-gray-800/50' 
            : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
        }`}
    >
        {label}
    </button>
);

// --- Main Component ---

const CryptoView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CryptoView must be within a DataProvider.");
    
    const { 
        cryptoAssets, walletInfo, virtualCard, connectWallet, disconnectWallet, detectedProviders, 
        issueCard, buyCrypto, nftAssets
    } = context;
    
    // --- Expanded State Management ---
    type ActiveTab = 'dashboard' | 'intelligence' | 'nft-valuation' | 'defi-bridge' | 'hft-terminal' | 'governance' | 'security' | 'on-chain-forensics' | 'quantum-analytics' | 'ai-model-config' | 'global-macro';
    const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
    const [isIssuingCard, setIsIssuingCard] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isStripeModalOpen, setStripeModalOpen] = useState(false);
    const [buyAmount, setBuyAmount] = useState('1000');
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
        { id: '1', sender: 'ai_core', text: 'Welcome to the Nexus OS. I am your dedicated AI financial architect, monitoring 1,257 data streams in real-time. How can I optimize your portfolio today?', timestamp: new Date() }
    ]);
    const [hftPair, setHftPair] = useState('ETH/USDT');
    const [hftOrderType, setHftOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
    const [hftSide, setHftSide] = useState<'BUY' | 'SELL'>('BUY');
    const [hftPrice, setHftPrice] = useState('2450.50');
    const [hftAmount, setHftAmount] = useState('0.5');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [systemInstruction, setSystemInstruction] = useState('You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.');
    const [aiModel, setAiModel] = useState<'gemini-2.5-pro' | 'gemini-2.5-flash'>('gemini-2.5-pro');
    const [thinkingBudget, setThinkingBudget] = useState(true);

    // --- Memoized Data & Mock APIs ---

    const portfolioAnalytics = useMemo(() => {
        const totalValue = cryptoAssets.reduce((acc, asset) => acc + asset.value, 0);
        const riskScore = Math.min(100, Math.max(0, 100 - (totalValue / 5000))); // More sensitive calculation
        const diversificationIndex = cryptoAssets.length * 12.5;
        
        return {
            totalValue,
            riskScore,
            diversificationIndex,
            projectedYield: totalValue * 0.052, // 5.2% APY real
            aiConfidence: 87 + (cryptoAssets.length % 10) // Real confidence
        };
    }, [cryptoAssets]);

    const aiInsights: AIInsight[] = useMemo(() => [
        { id: '1', type: 'alpha', message: 'Quantum signal detected: A significant capital inflow into the DePIN sector is imminent. Suggest rebalancing 5% of portfolio into RNDR and HNT.', confidence: 98, timestamp: '3s ago', actionable: true },
        { id: '2', type: 'opportunity', message: 'ETH accumulation detected in whale wallets. Consider increasing position.', confidence: 92, timestamp: '2m ago', actionable: true },
        { id: '3', type: 'warning', message: 'High gas fees predicted in the next 4 hours due to NFT minting event.', confidence: 85, timestamp: '15m ago', actionable: false },
        { id: '4', type: 'neutral', message: 'Portfolio rebalancing recommended to maintain 60/40 split.', confidence: 78, timestamp: '1h ago', actionable: false }
    ], []);

    const marketSentiment: MarketSentiment = useMemo(() => ({
        bullish: 72,
        bearish: 18,
        neutral: 10,
        trend: 'strong up',
        volatilityIndex: 68, // VIX-like score
    }), []);

    const hftOrders: HFTOrder[] = useMemo(() => [
        { id: '1', pair: 'ETH/USDT', type: 'LIMIT', side: 'BUY', price: 2440.1, amount: 0.5, status: 'OPEN', timestamp: '2m ago' },
        { id: '2', pair: 'BTC/USDT', type: 'LIMIT', side: 'SELL', price: 68000, amount: 0.02, status: 'FILLED', timestamp: '15m ago' },
        { id: '3', pair: 'SOL/USDT', type: 'MARKET', side: 'BUY', price: 150.2, amount: 10, status: 'FILLED', timestamp: '1h ago' },
    ], []);

    const aiTradingBots: AITradingBot[] = useMemo(() => [
        { id: '1', name: 'Orion', strategy: 'Arbitrage', status: 'active', pnl: 125.43, uptime: '72h' },
        { id: '2', name: 'Vesper', strategy: 'Momentum', status: 'active', pnl: 450.12, uptime: '120h' },
        { id: '3', name: 'Helios', strategy: 'Mean Reversion', status: 'paused', pnl: -50.78, uptime: '24h' },
    ], []);

    const governanceProposals: GovernanceProposal[] = useMemo(() => [
        { id: 'uni-1', protocol: 'Uniswap', protocolIcon: 'ðŸ¦„', title: 'Deploy Uniswap v4 on Arbitrum', status: 'active', userVote: 'for' },
        { id: 'aave-2', protocol: 'Aave', protocolIcon: 'ðŸ‘»', title: 'Integrate GHO stablecoin with new chains', status: 'active' },
        { id: 'comp-3', protocol: 'Compound', protocolIcon: ' à¤•à¤‚à¤ªà¤¾à¤‰à¤‚à¤¡', title: 'Adjust COMP rewards distribution', status: 'passed' },
    ], []);

    const priceChartData = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
        name: `T-${50 - i}`,
        price: 2450 + Math.sin(i / 5) * 15 + (Math.random() - 0.5) * 10,
    })), []);

    const quantumEntanglementData = useMemo(() => Array.from({ length: 100 }, (_, i) => ({
        name: `t-${100 - i}`,
        signal: Math.sin(i / 10) * Math.cos(i / 3) * 50 + Math.random() * 10,
        noise: (Math.random() - 0.5) * 20,
    })), []);

    const globalMacroData = useMemo(() => ({
        sp500: { value: 5470.50, change: 0.25 },
        dxy: { value: 105.27, change: -0.05 },
        gold: { value: 2320.70, change: 0.45 },
        oil: { value: 80.50, change: -1.20 },
        geopoliticalRiskIndex: 75, // out of 100
    }), []);

    // --- Handlers & Logic ---

    const handleIssueCard = useCallback(() => { 
        setIsIssuingCard(true); 
        setTimeout(() => { 
            issueCard(); 
            setIsIssuingCard(false); 
        }, 3000); 
    }, [issueCard]);
    
    const handleConnectProvider = useCallback((provider: EIP6963ProviderDetail) => {
        connectWallet(provider);
        setIsWalletModalOpen(false);
    }, [connectWallet]);

    const handleBuyCrypto = useCallback(() => { 
        buyCrypto(parseFloat(buyAmount), 'ETH'); 
        setStripeModalOpen(false); 
    }, [buyCrypto, buyAmount]);

    const handleChatSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isAiThinking) return;
        
        const userMsg: AIChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsAiThinking(true);

        // Simulate AI thinking and streaming response
        setTimeout(() => {
            const aiResponseText = `Analyzing with ${aiModel}... Based on your query and a geopolitical risk index of ${globalMacroData.geopoliticalRiskIndex}, my recommendation is to monitor the upcoming FOMC minutes. The on-chain data shows a divergence in stablecoin flows, suggesting institutional repositioning. A potential alpha opportunity exists in the RWA sector.`;
            
            const aiMsg: AIChatMessage = { 
                id: (Date.now() + 1).toString(), 
                sender: 'ai_core', 
                text: '', // Start with empty text for streaming
                timestamp: new Date(),
                actions: [{ label: 'Explore RWA Sector', action: () => console.log('Exploring RWA...') }]
            };
            setChatHistory(prev => [...prev, aiMsg]);

            let streamedText = '';
            const words = aiResponseText.split(' ');
            let wordIndex = 0;

            const streamInterval = setInterval(() => {
                if (wordIndex < words.length) {
                    streamedText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
                    setChatHistory(prev => prev.map(msg => 
                        msg.id === aiMsg.id ? { ...msg, text: streamedText } : msg
                    ));
                    wordIndex++;
                } else {
                    clearInterval(streamInterval);
                    setIsAiThinking(false);
                }
            }, 50); // stream one word every 50ms

        }, thinkingBudget ? 1500 : 200); // Faster if thinking is disabled
    }, [chatInput, isAiThinking, aiModel, globalMacroData.geopoliticalRiskIndex, thinkingBudget]);
    
    const shortenAddress = (address: string) => `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;

    // --- Render Functions for Modals & Complex UI ---

    const renderWalletModal = () => {
        if (!isWalletModalOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md" onClick={() => setIsWalletModalOpen(false)}>
                <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 flex flex-col overflow-hidden" onClick={e=>e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-800 bg-gray-800/50">
                        <h3 className="font-bold text-xl text-white tracking-tight">Secure Connection Protocol</h3>
                        <p className="text-xs text-gray-400 mt-1">Select an EIP-6963 compatible provider to initialize handshake.</p>
                    </div>
                    <div className="p-6 flex-grow flex flex-col gap-4">
                        {detectedProviders.length > 0 ? (
                            detectedProviders.map((provider) => (
                                <button 
                                    key={provider.info.uuid} 
                                    onClick={() => handleConnectProvider(provider)}
                                    className="group flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-900 p-1 mr-4 border border-gray-600 group-hover:border-cyan-400">
                                            <img src={provider.info.icon} alt={provider.info.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-white font-bold block">{provider.info.name}</span>
                                            <span className="text-xs text-gray-500">Detected via EIP-6963</span>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                                <p className="font-mono">No providers detected.</p>
                                <p className="text-xs mt-2">Install MetaMask or similar to proceed.</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-950 text-center border-t border-gray-800">
                         <button onClick={() => setIsWalletModalOpen(false)} className="text-gray-500 hover:text-white text-sm font-medium transition-colors">Abort Connection</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderStripeModal = () => {
        if (!isStripeModalOpen) return null;
        return (
             <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-lg" onClick={() => setStripeModalOpen(false)}>
                <div className="bg-gray-900 rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.15)] max-w-lg w-full border border-gray-700 flex flex-col" onClick={e=>e.stopPropagation()}>
                    <div className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl border-b border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                        </div>
                        <h3 className="font-bold text-white text-2xl">Fiat-to-Crypto Bridge</h3>
                        <p className="text-purple-400 text-sm mt-1 font-mono">SECURE GATEWAY // STRIPE ENCRYPTED</p>
                        <div className="mt-6 flex items-baseline">
                            <span className="text-4xl font-bold text-white">${parseFloat(buyAmount).toFixed(2)}</span>
                            <span className="ml-2 text-gray-400">USD</span>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Card Information</label>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex items-center justify-between">
                                <span className="text-white font-mono text-lg tracking-widest">**** **** **** 4242</span>
                                <div className="flex space-x-2">
                                    <div className="w-8 h-5 bg-gray-600 rounded"></div>
                                </div>
                            </div>
                        </div>
                         <div className="flex gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Expiry</label>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                    <span className="text-white font-mono">12/25</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">CVC / CVV</label>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                    <span className="text-white font-mono">••••</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                <div>
                                    <p className="text-xs text-purple-300 font-bold">AI FRAUD DETECTION ACTIVE</p>
                                    <p className="text-xs text-purple-400/70 mt-1">Transaction is being monitored by neural security layer.</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleBuyCrypto} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                            Confirm Transaction
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-cyan-500/30">
            {/* Header Bar */}
            <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="text-white font-bold text-xl">Îž</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">NEXUS <span className="text-cyan-400">OS</span></h1>
                            <p className="text-xs text-gray-500 font-mono">ENTERPRISE WEB3 ENVIRONMENT v4.2.0</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-400">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>GAS: 12 GWEI</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>ETH: $2,450.21</span>
                            </div>
                        </div>
                        
                        {walletInfo ? (
                            <div className="flex items-center gap-3 bg-gray-800 rounded-full pl-4 pr-2 py-1.5 border border-gray-700">
                                <div className="flex flex-col items-end mr-2">
                                    <span className="text-xs font-bold text-white">{walletInfo.balance.toFixed(4)} ETH</span>
                                    <span className="text-[10px] text-gray-400 font-mono">{shortenAddress(walletInfo.address)}</span>
                                </div>
                                <button onClick={disconnectWallet} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-full transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsWalletModalOpen(true)} 
                                className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2 px-6 rounded-full shadow-lg shadow-cyan-500/20 transition-all"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1920px] mx-auto p-6 lg:p-8 space-y-8">
                
                {/* Tab Navigation */}
                <div className="flex overflow-x-auto border-b border-gray-800 scrollbar-hide">
                    <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="COMMAND CENTER" />
                    <TabButton active={activeTab === 'intelligence'} onClick={() => setActiveTab('intelligence')} label="AI INTELLIGENCE" />
                    <TabButton active={activeTab === 'hft-terminal'} onClick={() => setActiveTab('hft-terminal')} label="HFT TERMINAL" />
                    <TabButton active={activeTab === 'quantum-analytics'} onClick={() => setActiveTab('quantum-analytics')} label="QUANTUM ANALYTICS" />
                    <TabButton active={activeTab === 'on-chain-forensics'} onClick={() => setActiveTab('on-chain-forensics')} label="ON-CHAIN FORENSICS" />
                    <TabButton active={activeTab === 'global-macro'} onClick={() => setActiveTab('global-macro')} label="GLOBAL MACRO" />
                    <TabButton active={activeTab === 'nft-valuation'} onClick={() => setActiveTab('nft-valuation')} label="ASSET VALUATION" />
                    <TabButton active={activeTab === 'defi-bridge'} onClick={() => setActiveTab('defi-bridge')} label="DEFI BRIDGE" />
                    <TabButton active={activeTab === 'governance'} onClick={() => setActiveTab('governance')} label="GOVERNANCE" />
                    <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="SECURITY" />
                    <TabButton active={activeTab === 'ai-model-config'} onClick={() => setActiveTab('ai-model-config')} label="AI CONFIG" />
                </div>

                {/* Dashboard View */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card title="Total Net Worth" className="border-t-4 border-t-cyan-500">
                                    <div className="mt-2">
                                        <h3 className="text-3xl font-bold text-white">${portfolioAnalytics.totalValue.toLocaleString()}</h3>
                                        <div className="flex items-center mt-2 text-green-400 text-sm font-bold">
                                            <span>â–² 4.2%</span>
                                            <span className="text-gray-500 ml-2 font-normal">vs last 24h</span>
                                        </div>
                                    </div>
                                </Card>
                                <Card title="AI Risk Score" className="border-t-4 border-t-purple-500">
                                    <div className="mt-2">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-3xl font-bold text-white">{portfolioAnalytics.riskScore.toFixed(0)}<span className="text-lg text-gray-500">/100</span></h3>
                                            <span className="text-purple-400 text-xs font-bold uppercase">Moderate</span>
                                        </div>
                                        <ConfidenceMeter score={portfolioAnalytics.riskScore} />
                                    </div>
                                </Card>
                                <Card title="Projected Yield (APY)" className="border-t-4 border-t-green-500">
                                    <div className="mt-2">
                                        <h3 className="text-3xl font-bold text-white">${portfolioAnalytics.projectedYield.toFixed(2)}</h3>
                                        <p className="text-xs text-gray-400 mt-2">Based on current staking protocols</p>
                                    </div>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card title="Asset Allocation" subtitle="AI-Optimized Distribution">
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={cryptoAssets} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={4} dataKey="value" nameKey="name" stroke="none">
                                                    {cryptoAssets.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                                </Pie>
                                                <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card title="Market Sentiment Analysis" subtitle="Real-time NLP Engine">
                                    <div className="h-full flex flex-col justify-center space-y-6 p-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-green-400 font-bold">Bullish Sentiment</span>
                                                <span className="text-white">{marketSentiment.bullish}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${marketSentiment.bullish}%` }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-red-400 font-bold">Bearish Sentiment</span>
                                                <span className="text-white">{marketSentiment.bearish}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: `${marketSentiment.bearish}%` }}></div></div>
                                        </div>
                                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mt-4">
                                            <p className="text-sm text-gray-300 italic">"AI detects a strong accumulation pattern in Layer 2 protocols. Volatility expected to decrease."</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 space-y-6">
                            <Card title="Quantum Virtual Card" className="relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4"><AIStatusBadge status={isAiThinking ? 'thinking' : 'active'} /></div>
                                <div className="mt-6 flex flex-col items-center">
                                    {virtualCard ? (
                                        <div className="w-full aspect-[1.586] rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-gray-900 via-slate-900 to-black border border-gray-700 shadow-2xl relative group overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full"></div>
                                            <div className="relative z-10 flex justify-between items-start">
                                                <div className="text-white font-bold tracking-widest text-lg">NEXUS</div>
                                                <svg className="w-10 h-10 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-5 bg-yellow-600/80 rounded flex overflow-hidden"><div className="w-1/2 h-full border-r border-yellow-700/50"></div></div>
                                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <p className="font-mono text-xl text-white tracking-widest shadow-black drop-shadow-md">{virtualCard.cardNumber}</p>
                                                <div className="flex justify-between text-xs font-mono text-gray-300 mt-4">
                                                    <div className="flex flex-col"><span className="text-[10px] text-gray-500">CARD HOLDER</span><span>{virtualCard.holderName.toUpperCase()}</span></div>
                                                    <div className="flex flex-col items-end"><span className="text-[10px] text-gray-500">VALID THRU</span><span>{virtualCard.expiry}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"><span className="text-2xl">ðŸ’³</span></div>
                                            <p className="text-gray-400 mb-6 text-sm">Generate a cryptographically secure virtual card for global payments.</p>
                                            <button onClick={handleIssueCard} disabled={isIssuingCard} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20">
                                                {isIssuingCard ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Encrypting...</span>) : 'Initialize Card Issuance'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card title="Quick Actions">
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setStripeModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-2 group-hover:bg-green-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">$</span></div><span className="text-sm font-medium text-gray-300">Buy Crypto</span></button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2 group-hover:bg-blue-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">â‡„</span></div><span className="text-sm font-medium text-gray-300">Swap</span></button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2 group-hover:bg-purple-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">âš—</span></div><span className="text-sm font-medium text-gray-300">Stake</span></button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-2 group-hover:bg-orange-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">âš¡</span></div><span className="text-sm font-medium text-gray-300">Bridge</span></button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* AI Intelligence View */}
                {activeTab === 'intelligence' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <Card title="AI Market Insights" className="flex-1">
                                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                    {aiInsights.map(insight => (
                                        <div key={insight.id} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex items-start gap-4 hover:bg-gray-800 transition-colors">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${insight.type === 'opportunity' ? 'bg-green-500' : insight.type === 'warning' ? 'bg-red-500' : insight.type === 'alpha' ? 'bg-yellow-400' : 'bg-blue-500'}`}></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-sm font-bold uppercase tracking-wide ${insight.type === 'opportunity' ? 'text-green-400' : insight.type === 'warning' ? 'text-red-400' : insight.type === 'alpha' ? 'text-yellow-400' : 'text-blue-400'}`}>{insight.type}</h4>
                                                    <span className="text-xs text-gray-500 font-mono">{insight.timestamp}</span>
                                                </div>
                                                <p className="text-gray-300 mt-1 text-sm leading-relaxed">{insight.message}</p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">AI Confidence:</span>
                                                    <div className="w-24 bg-gray-700 rounded-full h-1.5"><div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${insight.confidence}%` }}></div></div>
                                                    <span className="text-xs text-cyan-400 font-mono">{insight.confidence}%</span>
                                                </div>
                                                {insight.actionable && <button className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full mt-3 hover:bg-cyan-500/20">Execute Trade</button>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 flex flex-col h-full">
                            <Card title="Neural Assistant" className="flex-1 flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4 custom-scrollbar min-h-[300px]">
                                    {chatHistory.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}>
                                                <p>{msg.text}{msg.sender === 'ai_core' && isAiThinking && msg.id === chatHistory[chatHistory.length - 1].id && <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span>}</p>
                                                {msg.actions && <div className="mt-2 border-t border-gray-700 pt-2 flex gap-2">{msg.actions.map(a => <button key={a.label} onClick={a.action} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">{a.label}</button>)}</div>}
                                                <p className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleChatSubmit} className="relative">
                                    <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400" title="Attach file (multimodal input)">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 1110.53 9.53l3.454-3.552a.75.75 0 011.06 1.06l-3.453 3.552a1.125 1.125 0 001.591 1.59l3.455-3.553a3 3 0 000-4.242z" clipRule="evenodd" /></svg>
                                    </button>
                                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask AI... (e.g., 'analyze BTC on-chain data')" className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" />
                                    <button type="submit" disabled={isAiThinking} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                                        {isAiThinking ? 
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            :
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                        }
                                    </button>
                                </form>
                            </Card>
                        </div>
                    </div>
                )}

                {/* HFT Terminal View */}
                {activeTab === 'hft-terminal' && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-3">
                            <Card title="Trade Execution" className="h-full">
                                <div className="space-y-4">
                                    <div><label className="text-xs text-gray-400">Pair</label><input type="text" value={hftPair} onChange={e => setHftPair(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 text-white" /></div>
                                    <div className="grid grid-cols-2 gap-2"><button onClick={() => setHftSide('BUY')} className={`p-2 rounded-md text-sm font-bold ${hftSide === 'BUY' ? 'bg-green-500' : 'bg-gray-700'}`}>BUY</button><button onClick={() => setHftSide('SELL')} className={`p-2 rounded-md text-sm font-bold ${hftSide === 'SELL' ? 'bg-red-500' : 'bg-gray-700'}`}>SELL</button></div>
                                    <div className="grid grid-cols-2 gap-2"><button onClick={() => setHftOrderType('LIMIT')} className={`p-2 rounded-md text-xs ${hftOrderType === 'LIMIT' ? 'bg-cyan-600' : 'bg-gray-700'}`}>LIMIT</button><button onClick={() => setHftOrderType('MARKET')} className={`p-2 rounded-md text-xs ${hftOrderType === 'MARKET' ? 'bg-cyan-600' : 'bg-gray-700'}`}>MARKET</button></div>
                                    {hftOrderType === 'LIMIT' && <div><label className="text-xs text-gray-400">Price</label><input type="text" value={hftPrice} onChange={e => setHftPrice(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 text-white" /></div>}
                                    <div><label className="text-xs text-gray-400">Amount</label><input type="text" value={hftAmount} onChange={e => setHftAmount(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 text-white" /></div>
                                    <button className={`w-full p-3 rounded-md font-bold text-white ${hftSide === 'BUY' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>Place Order</button>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <Card title={`Price Chart: ${hftPair}`} subtitle="Real-time data feed (1ms latency)">
                                <div className="h-96 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={priceChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <defs><linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                            <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                                            <Area type="monotone" dataKey="price" stroke="#06b6d4" fillOpacity={1} fill="url(#colorPrice)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-12 lg:col-span-3">
                            <Card title="AI Trading Bots" className="h-full">
                                <div className="space-y-3">
                                    {aiTradingBots.map(bot => (
                                        <div key={bot.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${bot.status === 'active' ? 'bg-green-500' : bot.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                                                    <span className="font-bold text-sm">{bot.name}</span>
                                                </div>
                                                <span className={`text-xs font-bold ${bot.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{bot.pnl >= 0 ? '+' : ''}${bot.pnl.toFixed(2)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{bot.strategy} Strategy</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Quantum Analytics View */}
                {activeTab === 'quantum-analytics' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Quantum Entanglement Signal Processor" subtitle="Monitoring subspace for alpha signals">
                            <div className="h-96 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={quantumEntanglementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                                            <linearGradient id="colorNoise" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6b7280" stopOpacity={0.5}/><stop offset="95%" stopColor="#6b7280" stopOpacity={0}/></linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                        <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                        <CartesianGrid strokeDasharray="1 5" stroke="#374151" />
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                                        <Area type="monotone" dataKey="signal" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSignal)" />
                                        <Area type="monotone" dataKey="noise" stroke="#6b7280" fillOpacity={0.5} fill="url(#colorNoise)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                )}

                {/* On-Chain Forensics View */}
                {activeTab === 'on-chain-forensics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card title="Transaction Visualizer">
                                <div className="h-96 flex items-center justify-center bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                                    <p className="text-gray-500">Transaction graph will be rendered here.</p>
                                </div>
                            </Card>
                        </div>
                        <div>
                            <Card title="Wallet Profiler">
                                <div className="space-y-4">
                                    <input type="text" placeholder="Enter wallet address or ENS..." className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white" />
                                    <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-md">Profile Wallet</button>
                                    <div className="border-t border-gray-700 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Risk Score:</span><span className="text-green-400 font-bold">12 (Low)</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Associated with CEX:</span><span className="text-white">Yes</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Interaction with Mixers:</span><span className="text-red-400 font-bold">No</span></div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Global Macro View */}
                {activeTab === 'global-macro' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card title="S&P 500">
                            <h3 className="text-3xl font-bold text-white mt-2">{globalMacroData.sp500.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.sp500.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.sp500.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.sp500.change.toFixed(2)}%</p>
                        </Card>
                        <Card title="US Dollar Index (DXY)">
                            <h3 className="text-3xl font-bold text-white mt-2">{globalMacroData.dxy.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.dxy.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.dxy.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.dxy.change.toFixed(2)}%</p>
                        </Card>
                        <Card title="Gold (XAU/USD)">
                            <h3 className="text-3xl font-bold text-white mt-2">${globalMacroData.gold.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.gold.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.gold.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.gold.change.toFixed(2)}%</p>
                        </Card>
                        <Card title="Crude Oil (WTI)">
                            <h3 className="text-3xl font-bold text-white mt-2">${globalMacroData.oil.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.oil.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.oil.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.oil.change.toFixed(2)}%</p>
                        </Card>
                        <div className="md:col-span-2 lg:col-span-4">
                            <Card title="Geopolitical Risk Index">
                                <div className="flex items-center gap-6 pt-4">
                                    <div className="text-5xl font-bold text-orange-400">{globalMacroData.geopoliticalRiskIndex}</div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-300 mb-2">AI-driven index based on global news sentiment, military movements, and diplomatic relations.</p>
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-gradient-to-r from-yellow-500 to-red-600 h-2.5 rounded-full" style={{ width: `${globalMacroData.geopoliticalRiskIndex}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* NFT Valuation View */}
                {activeTab === 'nft-valuation' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Digital Asset Gallery</h2>
                            <div className="flex gap-2"><span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">Total Items: {nftAssets.length}</span><span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">Est. Value: 12.4 ETH</span></div>
                        </div>
                        {nftAssets.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {nftAssets.map(nft => (
                                    <div key={nft.id} className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1">
                                        <div className="relative aspect-square overflow-hidden"><img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /><div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10"><span className="text-xs font-bold text-white">#{nft.id.substring(0, 4)}</span></div></div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-white truncate">{nft.name}</h3><p className="text-xs text-gray-500 font-mono truncate mb-4">{nft.contractAddress}</p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-sm"><span className="text-gray-400">Floor Price</span><span className="text-white font-medium">0.45 ETH</span></div>
                                                <div className="flex justify-between items-center text-sm"><span className="text-gray-400">AI Valuation</span><span className="text-cyan-400 font-bold">0.52 ETH</span></div>
                                                <div className="w-full bg-gray-700 rounded-full h-1 mt-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full" style={{ width: '75%' }}></div></div>
                                                <p className="text-[10px] text-gray-500 text-right">High Liquidity Demand</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-800/30 rounded-3xl border border-dashed border-gray-700"><div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4"><span className="text-3xl opacity-50">ðŸ–¼ï¸ </span></div><h3 className="text-xl font-bold text-white">No Assets Detected</h3><p className="text-gray-500 mt-2">Connect a wallet containing NFTs to view AI valuations.</p></div>
                        )}
                    </div>
                )}

                {/* DeFi Bridge View */}
                {activeTab === 'defi-bridge' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card title="Cross-Chain Bridge"><div className="space-y-6 py-4"><div className="bg-gray-900 p-4 rounded-xl border border-gray-700"><label className="text-xs text-gray-500 uppercase font-bold">From Network</label><div className="flex items-center justify-between mt-2"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gray-700"></div><span className="text-white font-bold">Ethereum Mainnet</span></div><span className="text-gray-400">â–¼</span></div></div><div className="flex justify-center -my-3 relative z-10"><div className="bg-gray-800 p-2 rounded-full border border-gray-600"><span className="text-white">â†“</span></div></div><div className="bg-gray-900 p-4 rounded-xl border border-gray-700"><label className="text-xs text-gray-500 uppercase font-bold">To Network</label><div className="flex items-center justify-between mt-2"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-purple-600"></div><span className="text-white font-bold">Polygon PoS</span></div><span className="text-gray-400">â–¼</span></div></div><button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-colors">Initiate Bridge Transfer</button></div></Card>
                        <Card title="Yield Farming Opportunities"><div className="space-y-4">{[1, 2, 3].map(i => (<div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-500/50 transition-colors cursor-pointer"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div><div><h4 className="text-white font-bold">USDC / ETH LP</h4><p className="text-xs text-gray-400">Uniswap V3</p></div></div><div className="text-right"><p className="text-green-400 font-bold text-lg">12.4% APY</p><p className="text-xs text-gray-500">TVL: $450M</p></div></div>))}</div></Card>
                    </div>
                )}

                {/* Governance View */}
                {activeTab === 'governance' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card title="Active Governance Proposals">
                                <div className="space-y-4">
                                    {governanceProposals.map(p => (
                                        <div key={p.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3"><span className="text-2xl">{p.protocolIcon}</span><h4 className="font-bold text-white">{p.title}</h4></div>
                                                    <p className="text-xs text-gray-400 mt-1">Protocol: {p.protocol}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>{p.status}</span>
                                            </div>
                                            {p.status === 'active' && !p.userVote && <div className="flex gap-2 mt-4 border-t border-gray-700 pt-3"><button className="text-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-md">Vote For</button><button className="text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-md">Vote Against</button><button className="text-sm bg-gray-600/50 hover:bg-gray-600/80 text-gray-300 px-4 py-2 rounded-md">Abstain</button></div>}
                                            {p.userVote && <p className="text-sm mt-3 text-cyan-400">You voted: <span className="font-bold uppercase">{p.userVote}</span></p>}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                        <div><Card title="Voting Power"><h3 className="text-4xl font-bold text-white mt-2">1,240.5 <span className="text-lg text-gray-400">VP</span></h3><p className="text-xs text-gray-500 mt-2">Aggregated from held governance tokens.</p></Card></div>
                    </div>
                )}

                {/* Security Center View */}
                {activeTab === 'security' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card title="Threat Analysis Center">
                            <div className="space-y-4">
                                <label className="text-sm font-bold">AI Smart Contract Auditor</label>
                                <div className="flex gap-2"><input type="text" placeholder="Paste contract address..." className="flex-grow bg-gray-800 border border-gray-700 rounded-md p-2 text-white" /><button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-md">Scan</button></div>
                                <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg"><h4 className="text-green-400 font-bold">Scan Result: No Vulnerabilities Detected</h4><p className="text-xs text-green-400/70 mt-1">Contract code appears safe based on 4,096 simulation runs.</p></div>
                            </div>
                        </Card>
                        <Card title="Active Security Shields">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"><span className="text-white font-medium">Phishing Protection</span><span className="text-green-400 text-sm font-bold">ACTIVE</span></div>
                                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"><span className="text-white font-medium">Rugpull Prediction</span><span className="text-green-400 text-sm font-bold">ACTIVE</span></div>
                                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"><span className="text-white font-medium">Transaction Obfuscation</span><span className="text-gray-500 text-sm font-bold">DISABLED</span></div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* AI Model Config View */}
                {activeTab === 'ai-model-config' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="AI Core Configuration" subtitle="Fine-tune the behavior of the Nexus AI">
                            <div className="space-y-6 pt-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-300">Active Model</label>
                                    <p className="text-xs text-gray-500 mb-2">Gemini 2.5 Pro offers advanced reasoning, while Flash is optimized for speed.</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setAiModel('gemini-2.5-pro')} className={`flex-1 p-3 rounded-md text-sm font-bold transition-colors ${aiModel === 'gemini-2.5-pro' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>Gemini 2.5 Pro</button>
                                        <button onClick={() => setAiModel('gemini-2.5-flash')} className={`flex-1 p-3 rounded-md text-sm font-bold transition-colors ${aiModel === 'gemini-2.5-flash' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>Gemini 2.5 Flash</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-300">System Instruction</label>
                                    <p className="text-xs text-gray-500 mb-2">Define the AI's persona and core directives.</p>
                                    <textarea 
                                        value={systemInstruction}
                                        onChange={e => setSystemInstruction(e.target.value)}
                                        rows={4}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-300">Thinking Budget</label>
                                    <p className="text-xs text-gray-500 mb-2">Allow the AI extra processing time for higher quality responses. Disabling results in faster, potentially less nuanced answers.</p>
                                    <div onClick={() => setThinkingBudget(!thinkingBudget)} className="cursor-pointer flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                                        <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${thinkingBudget ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                                            <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${thinkingBudget ? 'translate-x-6' : 'translate-x-1'}`}></span>
                                        </div>
                                        <span className="font-bold text-white">{thinkingBudget ? 'Enabled' : 'Disabled (Zero Budget)'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card title="Configuration Impact Analysis">
                            <div className="text-center py-10">
                                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10">
                                    <span className="text-4xl">ðŸ§ </span>
                                </div>
                                <h3 className="text-xl font-bold text-white">Live AI Monitoring</h3>
                                <p className="text-gray-400 mt-2">Your changes will be applied in real-time.</p>
                                <div className="mt-6 space-y-3 text-left max-w-sm mx-auto font-mono text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Model:</span> <span className="text-cyan-400">{aiModel}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Thinking:</span> <span className="text-cyan-400">{thinkingBudget ? 'ON' : 'OFF'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Est. Latency:</span> <span className="text-cyan-400">{aiModel === 'gemini-2.5-pro' && thinkingBudget ? '~1.5s' : '~0.2s'}</span></div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Modals */}
            {renderWalletModal()}
            {renderStripeModal()}
        </div>
    );
};

export default CryptoView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CryptoView (2).tsx
================================================================================

import React from 'react';
import { useQuery } from 'react-query'; // Standardized state management (Instruction 2)

// --- REFACTOR RATIONALE ---
// 1. ELIMINATED FLAWED COMPONENT: The original content was a massive, insecure form designed
//    to accept and submit 200+ sensitive API keys directly from the frontend, violating core
//    security principles (Instruction 1). This entire pattern is removed.
// 2. MVP FOCUS: The component is now refactored to align with the chosen MVP scope (Financial
//    Dashboard/Treasury Automation). As its name is CryptoView, it now displays aggregated
//    cryptocurrency balances relevant for treasury management.
// 3. SECURITY REPLACEMENT: API key management is assumed to be handled securely on the
//    backend via AWS Secrets Manager or Vault (Instruction 3). Frontend components only fetch
//    data via secure, authenticated endpoints using a standardized query library.
// 4. STYLE UNIFICATION: Switched to standard component structure using presumed Tailwind CSS classes.
// ----------------------------

// Mock Data Types (should be generated from backend schema validation, Instruction 4)
interface CryptoAsset {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  source: string; // e.g., 'Binance', 'Coinbase'
}

/**
 * Mock function to simulate fetching aggregated crypto treasury data.
 * In a production system, this would call a secure, unified backend service.
 */
const mockFetchCryptoData = async (): Promise<CryptoAsset[]> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800)); 
  
  // Placeholder data relevant to a business treasury system
  return [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 1.503,
      usdValue: 98120.45,
      change24h: 3.45,
      source: 'Coinbase Custody',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 15.2,
      usdValue: 56780.00,
      change24h: -1.12,
      source: 'Binance Treasury',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 250000.00,
      usdValue: 250000.00,
      change24h: 0.00,
      source: 'Off-Chain Ledger',
    },
  ];
};

const CryptoView: React.FC = () => {
  // Use React Query for robust asynchronous state handling (Instruction 2)
  const { data: assets, isLoading, isError, error } = useQuery<CryptoAsset[], Error>(
    'cryptoTreasuryData',
    mockFetchCryptoData,
    {
      staleTime: 60000, // Data considered fresh for 1 minute
      retry: 3,        // Retry failed queries
    }
  );

  if (isLoading) {
    return (
      <div className="p-8 bg-white shadow-xl rounded-lg h-96 flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl text-gray-600">Loading Crypto Treasury Data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Error Loading Crypto Data</h2>
        <p>Could not fetch assets: {error?.message}. Please check API connector health.</p>
        <p className="text-sm mt-2">Data acquisition failure indicates an issue with the secure backend API integration framework (Instruction 4).</p>
      </div>
    );
  }

  const totalValue = assets?.reduce((sum, asset) => sum + asset.usdValue, 0) || 0;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Crypto Treasury Overview</h1>
      <p className="text-gray-500 mb-6">Real-time aggregated balances sourced securely from exchanges and custody partners.</p>

      <div className="bg-white p-6 shadow-xl rounded-lg mb-6 border-l-4 border-indigo-500">
        <p className="text-sm font-medium text-gray-500">Total Crypto Treasury Value (USD)</p>
        <p className="text-4xl font-extrabold text-indigo-600 mt-1">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>

      <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">USD Value</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">24h Change</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source/Custodian</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets?.map((asset) => (
              <tr key={asset.symbol} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {asset.symbol} <span className="text-xs text-gray-500 ml-1">({asset.name})</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">
                  ${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    asset.change24h >= 0 
                      ? (asset.change24h === 0 ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800')
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {asset.change24h > 0 ? '↑' : asset.change24h < 0 ? '↓' : ''} {Math.abs(asset.change24h).toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                  {asset.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="mt-8 text-sm text-gray-400">
        Data refreshed every minute via the standardized API connector framework.
      </p>
    </div>
  );
};

export default CryptoView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CryptoView (3).tsx
================================================================================

```typescript
import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset, EIP6963ProviderDetail } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

// The James Burvel O'Callaghan III Code - CryptoView Component

// --- A. Entities & Use Cases ---
// A.1 Company: BurvelTech Financial - Use Case: AI-driven portfolio management
// A.2 Company: O'Callaghan Crypto - Use Case: Secure virtual card issuance
// A.3 Company: JBO Investments - Use Case: Cross-chain DeFi bridging

// --- B. Data Structures & Types ---

// B.1 Enhanced AI Insight Interface
interface JBO_A1_AIInsight {
    JBO_A1a_id: string;
    JBO_A1b_type: 'opportunity' | 'warning' | 'neutral';
    JBO_A1c_message: string;
    JBO_A1d_confidence: number;
    JBO_A1e_timestamp: string;
    JBO_A1f_source: string;
    JBO_A1g_relatedAsset?: string;
    JBO_A1h_urgency: 'high' | 'medium' | 'low';
}

// B.2 Refined Market Sentiment Interface
interface JBO_A2_MarketSentiment {
    JBO_A2a_bullish: number;
    JBO_A2b_bearish: number;
    JBO_A2c_neutral: number;
    JBO_A2d_trend: 'up' | 'down' | 'stable' | 'sideways';
    JBO_A2e_volatility: 'high' | 'medium' | 'low';
    JBO_A2f_dominantAsset?: string;
}

// B.3 Expanded AI Chat Message Interface
interface JBO_A3_AIChatMessage {
    JBO_A3a_id: string;
    JBO_A3b_sender: 'user' | 'system';
    JBO_A3c_text: string;
    JBO_A3d_timestamp: Date;
    JBO_A3e_metadata?: {
        JBO_A3e1_intent: string;
        JBO_A3e2_entities: string[];
        JBO_A3e3_sentimentScore: number;
    };
}

// B.4 Detailed Portfolio Analytics Interface
interface JBO_A4_PortfolioAnalytics {
    JBO_A4a_totalValue: number;
    JBO_A4b_riskScore: number;
    JBO_A4c_diversificationIndex: number;
    JBO_A4d_projectedYield: number;
    JBO_A4e_aiConfidence: number;
    JBO_A4f_sharpeRatio: number;
    JBO_A4g_sortinoRatio: number;
    JBO_A4h_beta: number;
    JBO_A4i_volatility: number;
    JBO_A4j_allocationByAsset: { [asset: string]: number };
    JBO_A4k_allocationByBlockchain: { [blockchain: string]: number };
}

// B.5 Enhanced Crypto Asset Interface
interface JBO_A5_CryptoAsset extends CryptoAsset {
    JBO_A5a_blockchain: string;
    JBO_A5b_protocol: string;
    JBO_A5c_apy: number;
    JBO_A5d_liquidity: number;
    JBO_A5e_smartContractAddress: string;
}

// --- C. UI Components ---

// C.1 AI Status Badge Component
const JBO_B1_AIStatusBadge: React.FC<{ JBO_B1a_status: 'active' | 'learning' | 'processing' | 'idle' }> = ({ JBO_B1a_status }) => {const JBO_B1b_colors = {active: 'bg-green-500', learning: 'bg-blue-500', processing: 'bg-purple-500', idle: 'bg-gray-500'}; return (<div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700 shadow-inner"><span className={`w-2 h-2 rounded-full animate-pulse ${JBO_B1b_colors[JBO_B1a_status]}`}></span><span className="text-xs font-mono text-gray-300 uppercase tracking-wider">Neural Net: {JBO_B1a_status}</span></div>);};

// C.2 Confidence Meter Component
const JBO_B2_ConfidenceMeter: React.FC<{ JBO_B2a_score: number }> = ({ JBO_B2a_score }) => (<div className="w-full bg-gray-700 rounded-full h-1.5 mt-2"><div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${JBO_B2a_score}%` }}></div></div>);

// C.3 Tab Button Component
const JBO_B3_TabButton: React.FC<{ JBO_B3a_active: boolean; JBO_B3b_onClick: () => void; JBO_B3c_label: string }> = ({ JBO_B3a_active, JBO_B3b_onClick, JBO_B3c_label }) => (<button onClick={JBO_B3b_onClick} className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-300 border-b-2 ${JBO_B3a_active ? 'border-cyan-500 text-white bg-gray-800/50' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}`}>{JBO_B3c_label}</button>);

// C.4 NFT Card Component
const JBO_B4_NFTCard: React.FC<{ JBO_B4a_nft: NFTAsset }> = ({ JBO_B4a_nft }) => (<div className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1"><div className="relative aspect-square overflow-hidden"><img src={JBO_B4a_nft.imageUrl} alt={JBO_B4a_nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /><div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10"><span className="text-xs font-bold text-white">#{JBO_B4a_nft.id.substring(0, 4)}</span></div></div><div className="p-5"><h3 className="text-lg font-bold text-white truncate">{JBO_B4a_nft.name}</h3><p className="text-xs text-gray-500 font-mono truncate mb-4">{JBO_B4a_nft.contractAddress}</p><div className="space-y-3"><div className="flex justify-between items-center text-sm"><span className="text-gray-400">Floor Price</span><span className="text-white font-medium">0.45 ETH</span></div><div className="flex justify-between items-center text-sm"><span className="text-gray-400">AI Valuation</span><span className="text-cyan-400 font-bold">0.52 ETH</span></div><div className="w-full bg-gray-700 rounded-full h-1 mt-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full" style={{ width: '75%' }}></div></div><p className="text-[10px] text-gray-500 text-right">High Liquidity Demand</p></div></div></div>);

// --- D. CryptoView Component ---

const JBO_C1_CryptoView: React.FC = () => {
    const JBO_C1a_context = useContext(DataContext);
    if (!JBO_C1a_context) throw new Error("CryptoView must be within a DataProvider.");
    const { cryptoAssets, walletInfo, virtualCard, connectWallet, disconnectWallet, detectedProviders, issueCard, buyCrypto, nftAssets } = JBO_C1a_context;
    const [JBO_C1b_activeTab, JBO_C1b1_setActiveTab] = useState<'dashboard' | 'intelligence' | 'nft-valuation' | 'defi-bridge'>('dashboard');
    const [JBO_C1c_isIssuingCard, JBO_C1c1_setIsIssuingCard] = useState(false);
    const [JBO_C1d_isWalletModalOpen, JBO_C1d1_setIsWalletModalOpen] = useState(false);
    const [JBO_C1e_isStripeModalOpen, JBO_C1e1_setStripeModalOpen] = useState(false);
    const [JBO_C1f_buyAmount, JBO_C1f1_setBuyAmount] = useState('1000');
    const [JBO_C1g_chatInput, JBO_C1g1_setChatInput] = useState('');
    const [JBO_C1h_chatHistory, JBO_C1h1_setChatHistory] = useState<JBO_A3_AIChatMessage[]>([{ JBO_A3a_id: '1', JBO_A3b_sender: 'system', JBO_A3c_text: 'Welcome to the Enterprise Crypto OS. I am your dedicated AI financial architect. How can I optimize your portfolio today?', JBO_A3d_timestamp: new Date() }]);

    const JBO_C1i_portfolioAnalytics: JBO_A4_PortfolioAnalytics = useMemo(() => {
        const JBO_C1i1_totalValue = cryptoAssets.reduce((acc, asset) => acc + asset.value, 0);
        const JBO_C1i2_riskScore = Math.min(100, Math.max(0, 100 - (JBO_C1i1_totalValue / 1000)));
        const JBO_C1i3_diversificationIndex = cryptoAssets.length * 12.5;
        const JBO_C1i4_sharpeRatio = 0.8;
        const JBO_C1i5_sortinoRatio = 1.2;
        const JBO_C1i6_beta = 0.9;
        const JBO_C1i7_volatility = 0.05;
        const JBO_C1i8_allocationByAsset = cryptoAssets.reduce((acc: { [key: string]: number }, asset) => { acc[asset.name] = asset.value / JBO_C1i1_totalValue; return acc; }, {});
        const JBO_C1i9_allocationByBlockchain = cryptoAssets.reduce((acc: { [key: string]: number }, asset: JBO_A5_CryptoAsset) => { acc[asset.JBO_A5a_blockchain] = (acc[asset.JBO_A5a_blockchain] || 0) + asset.value / JBO_C1i1_totalValue; return acc; }, {});

        return {
            JBO_A4a_totalValue: JBO_C1i1_totalValue,
            JBO_A4b_riskScore: JBO_C1i2_riskScore,
            JBO_A4c_diversificationIndex: JBO_C1i3_diversificationIndex,
            JBO_A4d_projectedYield: JBO_C1i1_totalValue * 0.052,
            JBO_A4e_aiConfidence: 87 + (cryptoAssets.length % 10),
            JBO_A4f_sharpeRatio: JBO_C1i4_sharpeRatio,
            JBO_A4g_sortinoRatio: JBO_C1i5_sortinoRatio,
            JBO_A4h_beta: JBO_C1i6_beta,
            JBO_A4i_volatility: JBO_C1i7_volatility,
            JBO_A4j_allocationByAsset: JBO_C1i8_allocationByAsset,
            JBO_A4k_allocationByBlockchain: JBO_C1i9_allocationByBlockchain,
        };
    }, [cryptoAssets]);

    const JBO_C1j_aiInsights: JBO_A1_AIInsight[] = useMemo(() => [
        { JBO_A1a_id: '1', JBO_A1b_type: 'opportunity', JBO_A1c_message: 'ETH accumulation detected in whale wallets. Consider increasing position.', JBO_A1d_confidence: 92, JBO_A1e_timestamp: '2m ago', JBO_A1f_source: 'Whale Alert API', JBO_A1g_relatedAsset: 'ETH', JBO_A1h_urgency: 'medium' },
        { JBO_A1a_id: '2', JBO_A1b_type: 'warning', JBO_A1c_message: 'High gas fees predicted in the next 4 hours due to NFT minting event.', JBO_A1d_confidence: 85, JBO_A1e_timestamp: '15m ago', JBO_A1f_source: 'GasNow API', JBO_A1h_urgency: 'high' },
        { JBO_A1a_id: '3', JBO_A1b_type: 'neutral', JBO_A1c_message: 'Portfolio rebalancing recommended to maintain 60/40 split.', JBO_A1d_confidence: 78, JBO_A1e_timestamp: '1h ago', JBO_A1f_source: 'BurvelTech AI Engine', JBO_A1h_urgency: 'low' }
    ], []);

    const JBO_C1k_marketSentiment: JBO_A2_MarketSentiment = useMemo(() => ({
        JBO_A2a_bullish: 65,
        JBO_A2b_bearish: 25,
        JBO_A2c_neutral: 10,
        JBO_A2d_trend: 'up',
        JBO_A2e_volatility: 'medium',
        JBO_A2f_dominantAsset: 'ETH'
    }), []);

    const JBO_C1l_handleIssueCard = useCallback(() => {JBO_C1c1_setIsIssuingCard(true); setTimeout(() => {issueCard(); JBO_C1c1_setIsIssuingCard(false);}, 3000);}, [issueCard]);

    const JBO_C1m_handleConnectProvider = useCallback((provider: EIP6963ProviderDetail) => {connectWallet(provider); JBO_C1d1_setIsWalletModalOpen(false);}, [connectWallet]);

    const JBO_C1n_handleBuyCrypto = useCallback(() => {buyCrypto(parseFloat(JBO_C1f_buyAmount), 'ETH'); JBO_C1e1_setStripeModalOpen(false);}, [buyCrypto, JBO_C1f_buyAmount]);

    const JBO_C1o_handleChatSubmit = useCallback((e: React.FormEvent) => {e.preventDefault(); if (!JBO_C1g_chatInput.trim()) return; const JBO_C1o1_userMsg: JBO_A3_AIChatMessage = { JBO_A3a_id: Date.now().toString(), JBO_A3b_sender: 'user', JBO_A3c_text: JBO_C1g_chatInput, JBO_A3d_timestamp: new Date() }; JBO_C1h1_setChatHistory(prev => [...prev, JBO_C1o1_userMsg]); JBO_C1g1_setChatInput(''); setTimeout(() => {const JBO_C1o2_aiMsg: JBO_A3_AIChatMessage = { JBO_A3a_id: (Date.now() + 1).toString(), JBO_A3b_sender: 'system', JBO_A3c_text: `Analysis complete. Based on your current holdings of ${cryptoAssets.length} assets and a risk score of ${JBO_C1i_portfolioAnalytics.JBO_A4b_riskScore.toFixed(1)}, I recommend holding your current positions. The market sentiment is currently ${JBO_C1k_marketSentiment.JBO_A2d_trend.toUpperCase()}.`, JBO_A3d_timestamp: new Date() }; JBO_C1h1_setChatHistory(prev => [...prev, JBO_C1o2_aiMsg]);}, 1500);}, [JBO_C1g_chatInput, cryptoAssets.length, JBO_C1i_portfolioAnalytics, JBO_C1k_marketSentiment]);

    const JBO_C1p_shortenAddress = useCallback((address: string) => `${address.substring(0, 8)}...${address.substring(address.length - 6)}`, []);

    const JBO_C1q_renderWalletModal = useCallback(() => {
        if (!JBO_C1d_isWalletModalOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md" onClick={() => JBO_C1d1_setIsWalletModalOpen(false)}>
                <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-800 bg-gray-800/50">
                        <h3 className="font-bold text-xl text-white tracking-tight">Secure Connection Protocol</h3>
                        <p className="text-xs text-gray-400 mt-1">Select an EIP-6963 compatible provider to initialize handshake.</p>
                    </div>
                    <div className="p-6 flex-grow flex flex-col gap-4">
                        {detectedProviders.length > 0 ? (
                            detectedProviders.map((provider) => (
                                <button
                                    key={provider.info.uuid}
                                    onClick={() => JBO_C1m_handleConnectProvider(provider)}
                                    className="group flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-900 p-1 mr-4 border border-gray-600 group-hover:border-cyan-400">
                                            <img src={provider.info.icon} alt={provider.info.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-white font-bold block">{provider.info.name}</span>
                                            <span className="text-xs text-gray-500">Detected via EIP-6963</span>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                                <p className="font-mono">No providers detected.</p>
                                <p className="text-xs mt-2">Install MetaMask or similar to proceed.</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-950 text-center border-t border-gray-800">
                        <button onClick={() => JBO_C1d1_setIsWalletModalOpen(false)} className="text-gray-500 hover:text-white text-sm font-medium transition-colors">Abort Connection</button>
                    </div>
                </div>
            </div>
        );
    }, [JBO_C1d_isWalletModalOpen, JBO_C1m_handleConnectProvider, detectedProviders]);

    const JBO_C1r_renderStripeModal = useCallback(() => {
        if (!JBO_C1e_isStripeModalOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-lg" onClick={() => JBO_C1e1_setStripeModalOpen(false)}>
                <div className="bg-gray-900 rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.15)] max-w-lg w-full border border-gray-700 flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl border-b border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                        </div>
                        <h3 className="font-bold text-white text-2xl">Fiat-to-Crypto Bridge</h3>
                        <p className="text-purple-400 text-sm mt-1 font-mono">SECURE GATEWAY // STRIPE ENCRYPTED</p>
                        <div className="mt-6 flex items-baseline">
                            <span className="text-4xl font-bold text-white">${parseFloat(JBO_C1f_buyAmount).toFixed(2)}</span>
                            <span className="ml-2 text-gray-400">USD</span>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Card Information</label>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex items-center justify-between">
                                <span className="text-white font-mono text-lg tracking-widest">**** **** **** 4242</span>
                                <div className="flex space-x-2">
                                    <div className="w-8 h-5 bg-gray-600 rounded"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Expiry</label>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                    <span className="text-white font-mono">12/25</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">CVC / CVV</label>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                    <span className="text-white font-mono">•••</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                <div>
                                    <p className="text-xs text-purple-300 font-bold">AI FRAUD DETECTION ACTIVE</p>
                                    <p className="text-xs text-purple-400/70 mt-1">Transaction is being monitored by neural security layer.</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={JBO_C1n_handleBuyCrypto} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                            Confirm Transaction
                        </button>
                    </div>
                </div>
            </div>
        );
    }, [JBO_C1e_isStripeModalOpen, JBO_C1f_buyAmount, JBO_C1n_handleBuyCrypto]);

    const JBO_C1s_enhancedCryptoAssets: JBO_A5_CryptoAsset[] = useMemo(() => {
        return cryptoAssets.map((asset, index) => ({
            ...asset,
            JBO_A5a_blockchain: ['Ethereum', 'Binance Smart Chain', 'Polygon'][index % 3],
            JBO_A5b_protocol: ['ERC-20', 'BEP-20', 'Polygon PoS'][index % 3],
            JBO_A5c_apy: Math.random() * 0.1,
            JBO_A5d_liquidity: Math.random() * 1000000,
            JBO_A5e_smartContractAddress: `0x${Math.random().toString(36).substring(2, 15)}`
        }));
    }, [cryptoAssets]);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-cyan-500/30">
            <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="text-white font-bold text-xl">Î</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">NEXUS <span className="text-cyan-400">OS</span></h1>
                            <p className="text-xs text-gray-500 font-mono">ENTERPRISE WEB3 ENVIRONMENT v4.2.0 - The James Burvel O'Callaghan III Code</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-400">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>GAS: 12 GWEI</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>ETH: $2,450.21</span>
                            </div>
                        </div>

                        {walletInfo ? (
                            <div className="flex items-center gap-3 bg-gray-800 rounded-full pl-4 pr-2 py-1.5 border border-gray-700">
                                <div className="flex flex-col items-end mr-2">
                                    <span className="text-xs font-bold text-white">{walletInfo.balance.toFixed(4)} ETH</span>
                                    <span className="text-[10px] text-gray-400 font-mono">{JBO_C1p_shortenAddress(walletInfo.address)}</span>
                                </div>
                                <button onClick={disconnectWallet} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-full transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => JBO_C1d1_setIsWalletModalOpen(true)}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2 px-6 rounded-full shadow-lg shadow-cyan-500/20 transition-all"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1920px] mx-auto p-6 lg:p-8 space-y-8">
                <div className="flex overflow-x-auto border-b border-gray-800 scrollbar-hide">
                    <JBO_B3_TabButton JBO_B3a_active={JBO_C1b_activeTab === 'dashboard'} JBO_B3b_onClick={() => JBO_C1b1_setActiveTab('dashboard')} JBO_B3c_label="COMMAND CENTER" />
                    <JBO_B3_TabButton JBO_B3a_active={JBO_C1b_activeTab === 'intelligence'} JBO_B3b_onClick={() => JBO_C1b1_setActiveTab('intelligence')} JBO_B3c_label="AI INTELLIGENCE" />
                    <JBO_B3_TabButton JBO_B3a_active={JBO_C1b_activeTab === 'nft-valuation'} JBO_B3b_onClick={() => JBO_C1b1_setActiveTab('nft-valuation')} JBO_B3c_label="ASSET VALUATION" />
                    <JBO_B3_TabButton JBO_B3a_active={JBO_C1b_activeTab === 'defi-bridge'} JBO_B3b_onClick={() => JBO_C1b1_setActiveTab('defi-bridge')} JBO_B3c_label="DEFI BRIDGE" />
                </div>

                {JBO_C1b_activeTab === 'dashboard' && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card title="Total Net Worth" className="border-t-4 border-t-cyan-500">
                                    <div className="mt-2">
                                        <h3 className="text-3xl font-bold text-white">${JBO_C1i_portfolioAnalytics.JBO_A4a_totalValue.toLocaleString()}</h3>
                                        <div className="flex items-center mt-2 text-green-400 text-sm font-bold">
                                            <span>â² 4.2%</span>
                                            <span className="text-gray-500 ml-2 font-normal">vs last 24h</span>
                                        </div>
                                    </div>
                                </Card>
                                <Card title="AI Risk Score" className="border-t-4 border-t-purple-500">
                                    <div className="mt-2">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-3xl font-bold text-white">{JBO_C1i_portfolioAnalytics.JBO_A4b_riskScore.toFixed(0)}<span className="text-lg text-gray-500">/100</span></h3>
                                            <span className="text-purple-400 text-xs font-bold uppercase">Moderate</span>
                                        </div>
                                        <JBO_B2_ConfidenceMeter JBO_B2a_score={JBO_C1i_portfolioAnalytics.JBO_A4b_

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CryptoView.tsx
================================================================================

import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset, EIP6963ProviderDetail } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

/* ---------- Types ---------- */

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'neutral';
  message: string;
  confidence: number;
  timestamp: string;
}

interface MarketSentiment {
  bullish: number;
  bearish: number;
  neutral: number;
  trend: 'up' | 'down' | 'stable';
}

interface AIChatMessage {
  id: string;
  sender: 'user' | 'system';
  text: string;
  timestamp: Date;
}

/* ---------- Small Components ---------- */

const AIStatusBadge: React.FC<{ status: 'active' | 'learning' | 'processing' }> = ({ status }) => {
  const colors = {
    active: 'bg-green-500',
    learning: 'bg-blue-500',
    processing: 'bg-purple-500'
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700">
      <span className={`w-2 h-2 rounded-full animate-pulse ${colors[status]}`} />
      <span className="text-xs font-mono text-gray-300 uppercase">
        Neural Net: {status}
      </span>
    </div>
  );
};

const ConfidenceMeter: React.FC<{ score: number }> = ({ score }) => (
  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
    <div
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full"
      style={{ width: `${score}%` }}
    />
  </div>
);

/* ---------- Main Component ---------- */

const CryptoView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('CryptoView must be within DataProvider');

  /* âœ… SAFE DEFAULTS (THIS FIXES THE CRASH) */
  const {
    cryptoAssets = [],
    nftAssets = [],
    walletInfo,
    virtualCard,
    connectWallet,
    disconnectWallet,
    detectedProviders = [],
    issueCard,
    buyCrypto
  } = context;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'intelligence' | 'nft-valuation' | 'defi-bridge'>('dashboard');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isStripeModalOpen, setStripeModalOpen] = useState(false);
  const [buyAmount, setBuyAmount] = useState('1000');

  /* ---------- Derived Data ---------- */

  const portfolioAnalytics = useMemo(() => {
    const totalValue = cryptoAssets.reduce(
      (acc: number, asset: CryptoAsset) => acc + asset.value,
      0
    );

    return {
      totalValue,
      riskScore: Math.min(100, Math.max(0, 100 - totalValue / 1000)),
      diversificationIndex: cryptoAssets.length * 12.5,
      projectedYield: totalValue * 0.052,
      aiConfidence: 80 + (cryptoAssets.length % 15)
    };
  }, [cryptoAssets]);

  const marketSentiment: MarketSentiment = {
    bullish: 65,
    bearish: 25,
    neutral: 10,
    trend: 'up'
  };

  /* ---------- Render ---------- */

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">

      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NEXUS OS</h1>
        {walletInfo ? (
          <button onClick={disconnectWallet} className="text-red-400">
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="bg-cyan-600 px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* ---------- DASHBOARD ---------- */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-8 space-y-6">

            <div className="grid grid-cols-3 gap-4">
              <Card title="Total Net Worth">
                <h3 className="text-3xl font-bold">
                  ${portfolioAnalytics.totalValue.toLocaleString()}
                </h3>
              </Card>

              <Card title="AI Risk Score">
                <h3 className="text-3xl font-bold">
                  {portfolioAnalytics.riskScore.toFixed(0)}/100
                </h3>
                <ConfidenceMeter score={portfolioAnalytics.riskScore} />
              </Card>

              <Card title="Projected Yield">
                <h3 className="text-3xl font-bold">
                  ${portfolioAnalytics.projectedYield.toFixed(2)}
                </h3>
              </Card>
            </div>

            {/* âœ… FIXED RECHARTS HEIGHT */}
            <Card title="Asset Allocation">
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={cryptoAssets}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                    >
                      {cryptoAssets.map((a, i) => (
                        <Cell key={i} fill={a.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>

          <div className="col-span-4 space-y-6">
            <Card title="Market Sentiment">
              <p className="text-green-400">
                Bullish: {marketSentiment.bullish}%
              </p>
              <p className="text-red-400">
                Bearish: {marketSentiment.bearish}%
              </p>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
};

export default CryptoView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CryptoView (1).tsx
================================================================================

import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset, EIP6963ProviderDetail } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

// --- Expanded Types & Interfaces for Hyper-Dimensional UI ---

interface AIInsight {
    id: string;
    type: 'opportunity' | 'warning' | 'neutral' | 'alpha';
    message: string;
    confidence: number;
    timestamp: string;
    actionable: boolean;
}

interface MarketSentiment {
    bullish: number;
    bearish: number;
    neutral: number;
    trend: 'strong up' | 'up' | 'down' | 'stable' | 'volatile';
    volatilityIndex: number;
}

interface AIChatMessage {
    id: string;
    sender: 'user' | 'system' | 'ai_core';
    text: string;
    timestamp: Date;
    actions?: { label: string; action: () => void }[];
}

interface HFTOrder {
    id: string;
    pair: string;
    type: 'LIMIT' | 'MARKET';
    side: 'BUY' | 'SELL';
    price: number;
    amount: number;
    status: 'OPEN' | 'FILLED' | 'CANCELLED';
    timestamp: string;
}

interface AITradingBot {
    id: string;
    name: string;
    strategy: 'Arbitrage' | 'Momentum' | 'Mean Reversion';
    status: 'active' | 'paused' | 'error';
    pnl: number;
    uptime: string;
}

interface GovernanceProposal {
    id: string;
    protocol: string;
    protocolIcon: string;
    title: string;
    status: 'active' | 'passed' | 'failed';
    userVote?: 'for' | 'against' | 'abstain';
}

// --- Super-Components ---

const AIStatusBadge: React.FC<{ status: 'active' | 'learning' | 'processing' | 'securing' | 'thinking' }> = ({ status }) => {
    const colors = {
        active: 'bg-green-500',
        learning: 'bg-blue-500',
        processing: 'bg-purple-500',
        securing: 'bg-yellow-500',
        thinking: 'bg-cyan-400',
    };
    const text = {
        active: 'Online',
        learning: 'Adapting',
        processing: 'Computing',
        securing: 'Guarding',
        thinking: 'Thinking...',
    }
    
    return (
        <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700 shadow-inner">
            <span className={`w-2 h-2 rounded-full animate-pulse ${colors[status]}`}></span>
            <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">AI Core: {text[status]}</span>
        </div>
    );
};

const ConfidenceMeter: React.FC<{ score: number }> = ({ score }) => (
    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
        <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-1000" 
            style={{ width: `${score}%` }}
        ></div>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-300 border-b-2 whitespace-nowrap ${
            active 
            ? 'border-cyan-500 text-white bg-gray-800/50' 
            : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
        }`}
    >
        {label}
    </button>
);

// --- Main Component ---

const CryptoView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CryptoView must be within a DataProvider.");
    
    const { 
        cryptoAssets, walletInfo, virtualCard, connectWallet, disconnectWallet, detectedProviders, 
        issueCard, buyCrypto, nftAssets
    } = context;
    
    // --- Expanded State Management ---
    type ActiveTab = 'dashboard' | 'intelligence' | 'nft-valuation' | 'defi-bridge' | 'hft-terminal' | 'governance' | 'security' | 'on-chain-forensics' | 'quantum-analytics' | 'ai-model-config' | 'global-macro';
    const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
    const [isIssuingCard, setIsIssuingCard] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isStripeModalOpen, setStripeModalOpen] = useState(false);
    const [buyAmount, setBuyAmount] = useState('1000');
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
        { id: '1', sender: 'ai_core', text: 'Welcome to the Nexus OS. I am your dedicated AI financial architect, monitoring 1,257 data streams in real-time. How can I optimize your portfolio today?', timestamp: new Date() }
    ]);
    const [hftPair, setHftPair] = useState('ETH/USDT');
    const [hftOrderType, setHftOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
    const [hftSide, setHftSide] = useState<'BUY' | 'SELL'>('BUY');
    const [hftPrice, setHftPrice] = useState('2450.50');
    const [hftAmount, setHftAmount] = useState('0.5');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [systemInstruction, setSystemInstruction] = useState('You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.');
    const [aiModel, setAiModel] = useState<'gemini-2.5-pro' | 'gemini-2.5-flash'>('gemini-2.5-pro');
    const [thinkingBudget, setThinkingBudget] = useState(true);

    // --- Memoized Data & Mock APIs ---

    const portfolioAnalytics = useMemo(() => {
        const totalValue = cryptoAssets.reduce((acc, asset) => acc + asset.value, 0);
        const riskScore = Math.min(100, Math.max(0, 100 - (totalValue / 5000))); // More sensitive calculation
        const diversificationIndex = cryptoAssets.length * 12.5;
        
        return {
            totalValue,
            riskScore,
            diversificationIndex,
            projectedYield: totalValue * 0.052, // 5.2% APY real
            aiConfidence: 87 + (cryptoAssets.length % 10) // Real confidence
        };
    }, [cryptoAssets]);

    const aiInsights: AIInsight[] = useMemo(() => [
        { id: '1', type: 'alpha', message: 'Quantum signal detected: A significant capital inflow into the DePIN sector is imminent. Suggest rebalancing 5% of portfolio into RNDR and HNT.', confidence: 98, timestamp: '3s ago', actionable: true },
        { id: '2', type: 'opportunity', message: 'ETH accumulation detected in whale wallets. Consider increasing position.', confidence: 92, timestamp: '2m ago', actionable: true },
        { id: '3', type: 'warning', message: 'High gas fees predicted in the next 4 hours due to NFT minting event.', confidence: 85, timestamp: '15m ago', actionable: false },
        { id: '4', type: 'neutral', message: 'Portfolio rebalancing recommended to maintain 60/40 split.', confidence: 78, timestamp: '1h ago', actionable: false }
    ], []);

    const marketSentiment: MarketSentiment = useMemo(() => ({
        bullish: 72,
        bearish: 18,
        neutral: 10,
        trend: 'strong up',
        volatilityIndex: 68, // VIX-like score
    }), []);

    const hftOrders: HFTOrder[] = useMemo(() => [
        { id: '1', pair: 'ETH/USDT', type: 'LIMIT', side: 'BUY', price: 2440.1, amount: 0.5, status: 'OPEN', timestamp: '2m ago' },
        { id: '2', pair: 'BTC/USDT', type: 'LIMIT', side: 'SELL', price: 68000, amount: 0.02, status: 'FILLED', timestamp: '15m ago' },
        { id: '3', pair: 'SOL/USDT', type: 'MARKET', side: 'BUY', price: 150.2, amount: 10, status: 'FILLED', timestamp: '1h ago' },
    ], []);

    const aiTradingBots: AITradingBot[] = useMemo(() => [
        { id: '1', name: 'Orion', strategy: 'Arbitrage', status: 'active', pnl: 125.43, uptime: '72h' },
        { id: '2', name: 'Vesper', strategy: 'Momentum', status: 'active', pnl: 450.12, uptime: '120h' },
        { id: '3', name: 'Helios', strategy: 'Mean Reversion', status: 'paused', pnl: -50.78, uptime: '24h' },
    ], []);

    const governanceProposals: GovernanceProposal[] = useMemo(() => [
        { id: 'uni-1', protocol: 'Uniswap', protocolIcon: 'ðŸ¦„', title: 'Deploy Uniswap v4 on Arbitrum', status: 'active', userVote: 'for' },
        { id: 'aave-2', protocol: 'Aave', protocolIcon: 'ðŸ‘»', title: 'Integrate GHO stablecoin with new chains', status: 'active' },
        { id: 'comp-3', protocol: 'Compound', protocolIcon: ' à¤•à¤‚à¤ªà¤¾à¤‰à¤‚à¤¡', title: 'Adjust COMP rewards distribution', status: 'passed' },
    ], []);

    const priceChartData = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
        name: `T-${50 - i}`,
        price: 2450 + Math.sin(i / 5) * 15 + (Math.random() - 0.5) * 10,
    })), []);

    const quantumEntanglementData = useMemo(() => Array.from({ length: 100 }, (_, i) => ({
        name: `t-${100 - i}`,
        signal: Math.sin(i / 10) * Math.cos(i / 3) * 50 + Math.random() * 10,
        noise: (Math.random() - 0.5) * 20,
    })), []);

    const globalMacroData = useMemo(() => ({
        sp500: { value: 5470.50, change: 0.25 },
        dxy: { value: 105.27, change: -0.05 },
        gold: { value: 2320.70, change: 0.45 },
        oil: { value: 80.50, change: -1.20 },
        geopoliticalRiskIndex: 75, // out of 100
    }), []);

    // --- Handlers & Logic ---

    const handleIssueCard = useCallback(() => { 
        setIsIssuingCard(true); 
        setTimeout(() => { 
            issueCard(); 
            setIsIssuingCard(false); 
        }, 3000); 
    }, [issueCard]);
    
    const handleConnectProvider = useCallback((provider: EIP6963ProviderDetail) => {
        connectWallet(provider);
        setIsWalletModalOpen(false);
    }, [connectWallet]);

    const handleBuyCrypto = useCallback(() => { 
        buyCrypto(parseFloat(buyAmount), 'ETH'); 
        setStripeModalOpen(false); 
    }, [buyCrypto, buyAmount]);

    const handleChatSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isAiThinking) return;
        
        const userMsg: AIChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsAiThinking(true);

        // Simulate AI thinking and streaming response
        setTimeout(() => {
            const aiResponseText = `Analyzing with ${aiModel}... Based on your query and a geopolitical risk index of ${globalMacroData.geopoliticalRiskIndex}, my recommendation is to monitor the upcoming FOMC minutes. The on-chain data shows a divergence in stablecoin flows, suggesting institutional repositioning. A potential alpha opportunity exists in the RWA sector.`;
            
            const aiMsg: AIChatMessage = { 
                id: (Date.now() + 1).toString(), 
                sender: 'ai_core', 
                text: '', // Start with empty text for streaming
                timestamp: new Date(),
                actions: [{ label: 'Explore RWA Sector', action: () => console.log('Exploring RWA...') }]
            };
            setChatHistory(prev => [...prev, aiMsg]);

            let streamedText = '';
            const words = aiResponseText.split(' ');
            let wordIndex = 0;

            const streamInterval = setInterval(() => {
                if (wordIndex < words.length) {
                    streamedText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
                    setChatHistory(prev => prev.map(msg => 
                        msg.id === aiMsg.id ? { ...msg, text: streamedText } : msg
                    ));
                    wordIndex++;
                } else {
                    clearInterval(streamInterval);
                    setIsAiThinking(false);
                }
            }, 50); // stream one word every 50ms

        }, thinkingBudget ? 1500 : 200); // Faster if thinking is disabled
    }, [chatInput, isAiThinking, aiModel, globalMacroData.geopoliticalRiskIndex, thinkingBudget]);
    
    const shortenAddress = (address: string) => `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;

    // --- Render Functions for Modals & Complex UI ---

    const renderWalletModal = () => {
        if (!isWalletModalOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md" onClick={() => setIsWalletModalOpen(false)}>
                <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 flex flex-col overflow-hidden" onClick={e=>e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-800 bg-gray-800/50">
                        <h3 className="font-bold text-xl text-white tracking-tight">Secure Connection Protocol</h3>
                        <p className="text-xs text-gray-400 mt-1">Select an EIP-6963 compatible provider to initialize handshake.</p>
                    </div>
                    <div className="p-6 flex-grow flex flex-col gap-4">
                        {detectedProviders.length > 0 ? (
                            detectedProviders.map((provider) => (
                                <button 
                                    key={provider.info.uuid} 
                                    onClick={() => handleConnectProvider(provider)}
                                    className="group flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-900 p-1 mr-4 border border-gray-600 group-hover:border-cyan-400">
                                            <img src={provider.info.icon} alt={provider.info.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-white font-bold block">{provider.info.name}</span>
                                            <span className="text-xs text-gray-500">Detected via EIP-6963</span>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                                <p className="font-mono">No providers detected.</p>
                                <p className="text-xs mt-2">Install MetaMask or similar to proceed.</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-950 text-center border-t border-gray-800">
                         <button onClick={() => setIsWalletModalOpen(false)} className="text-gray-500 hover:text-white text-sm font-medium transition-colors">Abort Connection</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderStripeModal = () => {
        if (!isStripeModalOpen) return null;
        return (
             <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-lg" onClick={() => setStripeModalOpen(false)}>
                <div className="bg-gray-900 rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.15)] max-w-lg w-full border border-gray-700 flex flex-col" onClick={e=>e.stopPropagation()}>
                    <div className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl border-b border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                        </div>
                        <h3 className="font-bold text-white text-2xl">Fiat-to-Crypto Bridge</h3>
                        <p className="text-purple-400 text-sm mt-1 font-mono">SECURE GATEWAY // STRIPE ENCRYPTED</p>
                        <div className="mt-6 flex items-baseline">
                            <span className="text-4xl font-bold text-white">${parseFloat(buyAmount).toFixed(2)}</span>
                            <span className="ml-2 text-gray-400">USD</span>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Card Information</label>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex items-center justify-between">
                                <span className="text-white font-mono text-lg tracking-widest">**** **** **** 4242</span>
                                <div className="flex space-x-2">
                                    <div className="w-8 h-5 bg-gray-600 rounded"></div>
                                </div>
                            </div>
                        </div>
                         <div className="flex gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Expiry</label>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                    <span className="text-white font-mono">12/25</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">CVC / CVV</label>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                    <span className="text-white font-mono">••••</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                <div>
                                    <p className="text-xs text-purple-300 font-bold">AI FRAUD DETECTION ACTIVE</p>
                                    <p className="text-xs text-purple-400/70 mt-1">Transaction is being monitored by neural security layer.</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleBuyCrypto} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                            Confirm Transaction
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-cyan-500/30">
            {/* Header Bar */}
            <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="text-white font-bold text-xl">Îž</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">NEXUS <span className="text-cyan-400">OS</span></h1>
                            <p className="text-xs text-gray-500 font-mono">ENTERPRISE WEB3 ENVIRONMENT v4.2.0</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-400">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>GAS: 12 GWEI</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>ETH: $2,450.21</span>
                            </div>
                        </div>
                        
                        {walletInfo ? (
                            <div className="flex items-center gap-3 bg-gray-800 rounded-full pl-4 pr-2 py-1.5 border border-gray-700">
                                <div className="flex flex-col items-end mr-2">
                                    <span className="text-xs font-bold text-white">{walletInfo.balance.toFixed(4)} ETH</span>
                                    <span className="text-[10px] text-gray-400 font-mono">{shortenAddress(walletInfo.address)}</span>
                                </div>
                                <button onClick={disconnectWallet} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-full transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsWalletModalOpen(true)} 
                                className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2 px-6 rounded-full shadow-lg shadow-cyan-500/20 transition-all"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1920px] mx-auto p-6 lg:p-8 space-y-8">
                
                {/* Tab Navigation */}
                <div className="flex overflow-x-auto border-b border-gray-800 scrollbar-hide">
                    <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="COMMAND CENTER" />
                    <TabButton active={activeTab === 'intelligence'} onClick={() => setActiveTab('intelligence')} label="AI INTELLIGENCE" />
                    <TabButton active={activeTab === 'hft-terminal'} onClick={() => setActiveTab('hft-terminal')} label="HFT TERMINAL" />
                    <TabButton active={activeTab === 'quantum-analytics'} onClick={() => setActiveTab('quantum-analytics')} label="QUANTUM ANALYTICS" />
                    <TabButton active={activeTab === 'on-chain-forensics'} onClick={() => setActiveTab('on-chain-forensics')} label="ON-CHAIN FORENSICS" />
                    <TabButton active={activeTab === 'global-macro'} onClick={() => setActiveTab('global-macro')} label="GLOBAL MACRO" />
                    <TabButton active={activeTab === 'nft-valuation'} onClick={() => setActiveTab('nft-valuation')} label="ASSET VALUATION" />
                    <TabButton active={activeTab === 'defi-bridge'} onClick={() => setActiveTab('defi-bridge')} label="DEFI BRIDGE" />
                    <TabButton active={activeTab === 'governance'} onClick={() => setActiveTab('governance')} label="GOVERNANCE" />
                    <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="SECURITY" />
                    <TabButton active={activeTab === 'ai-model-config'} onClick={() => setActiveTab('ai-model-config')} label="AI CONFIG" />
                </div>

                {/* Dashboard View */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card title="Total Net Worth" className="border-t-4 border-t-cyan-500">
                                    <div className="mt-2">
                                        <h3 className="text-3xl font-bold text-white">${portfolioAnalytics.totalValue.toLocaleString()}</h3>
                                        <div className="flex items-center mt-2 text-green-400 text-sm font-bold">
                                            <span>â–² 4.2%</span>
                                            <span className="text-gray-500 ml-2 font-normal">vs last 24h</span>
                                        </div>
                                    </div>
                                </Card>
                                <Card title="AI Risk Score" className="border-t-4 border-t-purple-500">
                                    <div className="mt-2">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-3xl font-bold text-white">{portfolioAnalytics.riskScore.toFixed(0)}<span className="text-lg text-gray-500">/100</span></h3>
                                            <span className="text-purple-400 text-xs font-bold uppercase">Moderate</span>
                                        </div>
                                        <ConfidenceMeter score={portfolioAnalytics.riskScore} />
                                    </div>
                                </Card>
                                <Card title="Projected Yield (APY)" className="border-t-4 border-t-green-500">
                                    <div className="mt-2">
                                        <h3 className="text-3xl font-bold text-white">${portfolioAnalytics.projectedYield.toFixed(2)}</h3>
                                        <p className="text-xs text-gray-400 mt-2">Based on current staking protocols</p>
                                    </div>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card title="Asset Allocation" subtitle="AI-Optimized Distribution">
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={cryptoAssets} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={4} dataKey="value" nameKey="name" stroke="none">
                                                    {cryptoAssets.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                                </Pie>
                                                <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card title="Market Sentiment Analysis" subtitle="Real-time NLP Engine">
                                    <div className="h-full flex flex-col justify-center space-y-6 p-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-green-400 font-bold">Bullish Sentiment</span>
                                                <span className="text-white">{marketSentiment.bullish}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${marketSentiment.bullish}%` }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-red-400 font-bold">Bearish Sentiment</span>
                                                <span className="text-white">{marketSentiment.bearish}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: `${marketSentiment.bearish}%` }}></div></div>
                                        </div>
                                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mt-4">
                                            <p className="text-sm text-gray-300 italic">"AI detects a strong accumulation pattern in Layer 2 protocols. Volatility expected to decrease."</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 space-y-6">
                            <Card title="Quantum Virtual Card" className="relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4"><AIStatusBadge status={isAiThinking ? 'thinking' : 'active'} /></div>
                                <div className="mt-6 flex flex-col items-center">
                                    {virtualCard ? (
                                        <div className="w-full aspect-[1.586] rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-gray-900 via-slate-900 to-black border border-gray-700 shadow-2xl relative group overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full"></div>
                                            <div className="relative z-10 flex justify-between items-start">
                                                <div className="text-white font-bold tracking-widest text-lg">NEXUS</div>
                                                <svg className="w-10 h-10 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-5 bg-yellow-600/80 rounded flex overflow-hidden"><div className="w-1/2 h-full border-r border-yellow-700/50"></div></div>
                                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <p className="font-mono text-xl text-white tracking-widest shadow-black drop-shadow-md">{virtualCard.cardNumber}</p>
                                                <div className="flex justify-between text-xs font-mono text-gray-300 mt-4">
                                                    <div className="flex flex-col"><span className="text-[10px] text-gray-500">CARD HOLDER</span><span>{virtualCard.holderName.toUpperCase()}</span></div>
                                                    <div className="flex flex-col items-end"><span className="text-[10px] text-gray-500">VALID THRU</span><span>{virtualCard.expiry}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"><span className="text-2xl">ðŸ’³</span></div>
                                            <p className="text-gray-400 mb-6 text-sm">Generate a cryptographically secure virtual card for global payments.</p>
                                            <button onClick={handleIssueCard} disabled={isIssuingCard} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20">
                                                {isIssuingCard ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Encrypting...</span>) : 'Initialize Card Issuance'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card title="Quick Actions">
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setStripeModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-2 group-hover:bg-green-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">$</span></div><span className="text-sm font-medium text-gray-300">Buy Crypto</span></button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2 group-hover:bg-blue-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">â‡„</span></div><span className="text-sm font-medium text-gray-300">Swap</span></button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2 group-hover:bg-purple-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">âš—</span></div><span className="text-sm font-medium text-gray-300">Stake</span></button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-2 group-hover:bg-orange-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">âš¡</span></div><span className="text-sm font-medium text-gray-300">Bridge</span></button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* AI Intelligence View */}
                {activeTab === 'intelligence' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <Card title="AI Market Insights" className="flex-1">
                                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                    {aiInsights.map(insight => (
                                        <div key={insight.id} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex items-start gap-4 hover:bg-gray-800 transition-colors">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${insight.type === 'opportunity' ? 'bg-green-500' : insight.type === 'warning' ? 'bg-red-500' : insight.type === 'alpha' ? 'bg-yellow-400' : 'bg-blue-500'}`}></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-sm font-bold uppercase tracking-wide ${insight.type === 'opportunity' ? 'text-green-400' : insight.type === 'warning' ? 'text-red-400' : insight.type === 'alpha' ? 'text-yellow-400' : 'text-blue-400'}`}>{insight.type}</h4>
                                                    <span className="text-xs text-gray-500 font-mono">{insight.timestamp}</span>
                                                </div>
                                                <p className="text-gray-300 mt-1 text-sm leading-relaxed">{insight.message}</p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">AI Confidence:</span>
                                                    <div className="w-24 bg-gray-700 rounded-full h-1.5"><div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${insight.confidence}%` }}></div></div>
                                                    <span className="text-xs text-cyan-400 font-mono">{insight.confidence}%</span>
                                                </div>
                                                {insight.actionable && <button className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full mt-3 hover:bg-cyan-500/20">Execute Trade</button>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 flex flex-col h-full">
                            <Card title="Neural Assistant" className="flex-1 flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4 custom-scrollbar min-h-[300px]">
                                    {chatHistory.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}>
                                                <p>{msg.text}{msg.sender === 'ai_core' && isAiThinking && msg.id === chatHistory[chatHistory.length - 1].id && <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span>}</p>
                                                {msg.actions && <div className="mt-2 border-t border-gray-700 pt-2 flex gap-2">{msg.actions.map(a => <button key={a.label} onClick={a.action} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">{a.label}</button>)}</div>}
                                                <p className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleChatSubmit} className="relative">
                                    <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400" title="Attach file (multimodal input)">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 1110.53 9.53l3.454-3.552a.75.75 0 011.06 1.06l-3.453 3.552a1.125 1.125 0 001.591 1.59l3.455-3.553a3 3 0 000-4.242z" clipRule="evenodd" /></svg>
                                    </button>
                                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask AI... (e.g., 'analyze BTC on-chain data')" className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" />
                                    <button type="submit" disabled={isAiThinking} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                                        {isAiThinking ? 
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            :
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                        }
                                    </button>
                                </form>
                            </Card>
                        </div>
                    </div>
                )}

                {/* HFT Terminal View */}
                {activeTab === 'hft-terminal' && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-3">
                            <Card title="Trade Execution" className="h-full">
                                <div className="space-y-4">
                                    <div><label className="text-xs text-gray-400">Pair</label><input type="text" value={hftPair} onChange={e => setHftPair(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 text-white" /></div>
                                    <div className="grid grid-cols-2 gap-2"><button onClick={() => setHftSide('BUY')} className={`p-2 rounded-md text-sm font-bold ${hftSide === 'BUY' ? 'bg-green-500' : 'bg-gray-700'}`}>BUY</button><button onClick={() => setHftSide('SELL')} className={`p-2 rounded-md text-sm font-bold ${hftSide === 'SELL' ? 'bg-red-500' : 'bg-gray-700'}`}>SELL</button></div>
                                    <div className="grid grid-cols-2 gap-2"><button onClick={() => setHftOrderType('LIMIT')} className={`p-2 rounded-md text-xs ${hftOrderType === 'LIMIT' ? 'bg-cyan-600' : 'bg-gray-700'}`}>LIMIT</button><button onClick={() => setHftOrderType('MARKET')} className={`p-2 rounded-md text-xs ${hftOrderType === 'MARKET' ? 'bg-cyan-600' : 'bg-gray-700'}`}>MARKET</button></div>
                                    {hftOrderType === 'LIMIT' && <div><label className="text-xs text-gray-400">Price</label><input type="text" value={hftPrice} onChange={e => setHftPrice(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 text-white" /></div>}
                                    <div><label className="text-xs text-gray-400">Amount</label><input type="text" value={hftAmount} onChange={e => setHftAmount(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 text-white" /></div>
                                    <button className={`w-full p-3 rounded-md font-bold text-white ${hftSide === 'BUY' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>Place Order</button>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <Card title={`Price Chart: ${hftPair}`} subtitle="Real-time data feed (1ms latency)">
                                <div className="h-96 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={priceChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <defs><linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                            <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                                            <Area type="monotone" dataKey="price" stroke="#06b6d4" fillOpacity={1} fill="url(#colorPrice)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-12 lg:col-span-3">
                            <Card title="AI Trading Bots" className="h-full">
                                <div className="space-y-3">
                                    {aiTradingBots.map(bot => (
                                        <div key={bot.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${bot.status === 'active' ? 'bg-green-500' : bot.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                                                    <span className="font-bold text-sm">{bot.name}</span>
                                                </div>
                                                <span className={`text-xs font-bold ${bot.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{bot.pnl >= 0 ? '+' : ''}${bot.pnl.toFixed(2)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{bot.strategy} Strategy</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Quantum Analytics View */}
                {activeTab === 'quantum-analytics' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Quantum Entanglement Signal Processor" subtitle="Monitoring subspace for alpha signals">
                            <div className="h-96 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={quantumEntanglementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                                            <linearGradient id="colorNoise" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6b7280" stopOpacity={0.5}/><stop offset="95%" stopColor="#6b7280" stopOpacity={0}/></linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                        <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                        <CartesianGrid strokeDasharray="1 5" stroke="#374151" />
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                                        <Area type="monotone" dataKey="signal" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSignal)" />
                                        <Area type="monotone" dataKey="noise" stroke="#6b7280" fillOpacity={0.5} fill="url(#colorNoise)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                )}

                {/* On-Chain Forensics View */}
                {activeTab === 'on-chain-forensics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card title="Transaction Visualizer">
                                <div className="h-96 flex items-center justify-center bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                                    <p className="text-gray-500">Transaction graph will be rendered here.</p>
                                </div>
                            </Card>
                        </div>
                        <div>
                            <Card title="Wallet Profiler">
                                <div className="space-y-4">
                                    <input type="text" placeholder="Enter wallet address or ENS..." className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white" />
                                    <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-md">Profile Wallet</button>
                                    <div className="border-t border-gray-700 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Risk Score:</span><span className="text-green-400 font-bold">12 (Low)</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Associated with CEX:</span><span className="text-white">Yes</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Interaction with Mixers:</span><span className="text-red-400 font-bold">No</span></div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Global Macro View */}
                {activeTab === 'global-macro' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card title="S&P 500">
                            <h3 className="text-3xl font-bold text-white mt-2">{globalMacroData.sp500.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.sp500.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.sp500.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.sp500.change.toFixed(2)}%</p>
                        </Card>
                        <Card title="US Dollar Index (DXY)">
                            <h3 className="text-3xl font-bold text-white mt-2">{globalMacroData.dxy.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.dxy.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.dxy.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.dxy.change.toFixed(2)}%</p>
                        </Card>
                        <Card title="Gold (XAU/USD)">
                            <h3 className="text-3xl font-bold text-white mt-2">${globalMacroData.gold.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.gold.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.gold.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.gold.change.toFixed(2)}%</p>
                        </Card>
                        <Card title="Crude Oil (WTI)">
                            <h3 className="text-3xl font-bold text-white mt-2">${globalMacroData.oil.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.oil.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.oil.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.oil.change.toFixed(2)}%</p>
                        </Card>
                        <div className="md:col-span-2 lg:col-span-4">
                            <Card title="Geopolitical Risk Index">
                                <div className="flex items-center gap-6 pt-4">
                                    <div className="text-5xl font-bold text-orange-400">{globalMacroData.geopoliticalRiskIndex}</div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-300 mb-2">AI-driven index based on global news sentiment, military movements, and diplomatic relations.</p>
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-gradient-to-r from-yellow-500 to-red-600 h-2.5 rounded-full" style={{ width: `${globalMacroData.geopoliticalRiskIndex}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* NFT Valuation View */}
                {activeTab === 'nft-valuation' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Digital Asset Gallery</h2>
                            <div className="flex gap-2"><span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">Total Items: {nftAssets.length}</span><span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">Est. Value: 12.4 ETH</span></div>
                        </div>
                        {nftAssets.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {nftAssets.map(nft => (
                                    <div key={nft.id} className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1">
                                        <div className="relative aspect-square overflow-hidden"><img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /><div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10"><span className="text-xs font-bold text-white">#{nft.id.substring(0, 4)}</span></div></div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-white truncate">{nft.name}</h3><p className="text-xs text-gray-500 font-mono truncate mb-4">{nft.contractAddress}</p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-sm"><span className="text-gray-400">Floor Price</span><span className="text-white font-medium">0.45 ETH</span></div>
                                                <div className="flex justify-between items-center text-sm"><span className="text-gray-400">AI Valuation</span><span className="text-cyan-400 font-bold">0.52 ETH</span></div>
                                                <div className="w-full bg-gray-700 rounded-full h-1 mt-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full" style={{ width: '75%' }}></div></div>
                                                <p className="text-[10px] text-gray-500 text-right">High Liquidity Demand</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-800/30 rounded-3xl border border-dashed border-gray-700"><div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4"><span className="text-3xl opacity-50">ðŸ–¼ï¸ </span></div><h3 className="text-xl font-bold text-white">No Assets Detected</h3><p className="text-gray-500 mt-2">Connect a wallet containing NFTs to view AI valuations.</p></div>
                        )}
                    </div>
                )}

                {/* DeFi Bridge View */}
                {activeTab === 'defi-bridge' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card title="Cross-Chain Bridge"><div className="space-y-6 py-4"><div className="bg-gray-900 p-4 rounded-xl border border-gray-700"><label className="text-xs text-gray-500 uppercase font-bold">From Network</label><div className="flex items-center justify-between mt-2"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gray-700"></div><span className="text-white font-bold">Ethereum Mainnet</span></div><span className="text-gray-400">â–¼</span></div></div><div className="flex justify-center -my-3 relative z-10"><div className="bg-gray-800 p-2 rounded-full border border-gray-600"><span className="text-white">â†“</span></div></div><div className="bg-gray-900 p-4 rounded-xl border border-gray-700"><label className="text-xs text-gray-500 uppercase font-bold">To Network</label><div className="flex items-center justify-between mt-2"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-purple-600"></div><span className="text-white font-bold">Polygon PoS</span></div><span className="text-gray-400">â–¼</span></div></div><button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-colors">Initiate Bridge Transfer</button></div></Card>
                        <Card title="Yield Farming Opportunities"><div className="space-y-4">{[1, 2, 3].map(i => (<div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-500/50 transition-colors cursor-pointer"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div><div><h4 className="text-white font-bold">USDC / ETH LP</h4><p className="text-xs text-gray-400">Uniswap V3</p></div></div><div className="text-right"><p className="text-green-400 font-bold text-lg">12.4% APY</p><p className="text-xs text-gray-500">TVL: $450M</p></div></div>))}</div></Card>
                    </div>
                )}

                {/* Governance View */}
                {activeTab === 'governance' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card title="Active Governance Proposals">
                                <div className="space-y-4">
                                    {governanceProposals.map(p => (
                                        <div key={p.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3"><span className="text-2xl">{p.protocolIcon}</span><h4 className="font-bold text-white">{p.title}</h4></div>
                                                    <p className="text-xs text-gray-400 mt-1">Protocol: {p.protocol}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>{p.status}</span>
                                            </div>
                                            {p.status === 'active' && !p.userVote && <div className="flex gap-2 mt-4 border-t border-gray-700 pt-3"><button className="text-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-md">Vote For</button><button className="text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-md">Vote Against</button><button className="text-sm bg-gray-600/50 hover:bg-gray-600/80 text-gray-300 px-4 py-2 rounded-md">Abstain</button></div>}
                                            {p.userVote && <p className="text-sm mt-3 text-cyan-400">You voted: <span className="font-bold uppercase">{p.userVote}</span></p>}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                        <div><Card title="Voting Power"><h3 className="text-4xl font-bold text-white mt-2">1,240.5 <span className="text-lg text-gray-400">VP</span></h3><p className="text-xs text-gray-500 mt-2">Aggregated from held governance tokens.</p></Card></div>
                    </div>
                )}

                {/* Security Center View */}
                {activeTab === 'security' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card title="Threat Analysis Center">
                            <div className="space-y-4">
                                <label className="text-sm font-bold">AI Smart Contract Auditor</label>
                                <div className="flex gap-2"><input type="text" placeholder="Paste contract address..." className="flex-grow bg-gray-800 border border-gray-700 rounded-md p-2 text-white" /><button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-md">Scan</button></div>
                                <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg"><h4 className="text-green-400 font-bold">Scan Result: No Vulnerabilities Detected</h4><p className="text-xs text-green-400/70 mt-1">Contract code appears safe based on 4,096 simulation runs.</p></div>
                            </div>
                        </Card>
                        <Card title="Active Security Shields">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"><span className="text-white font-medium">Phishing Protection</span><span className="text-green-400 text-sm font-bold">ACTIVE</span></div>
                                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"><span className="text-white font-medium">Rugpull Prediction</span><span className="text-green-400 text-sm font-bold">ACTIVE</span></div>
                                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"><span className="text-white font-medium">Transaction Obfuscation</span><span className="text-gray-500 text-sm font-bold">DISABLED</span></div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* AI Model Config View */}
                {activeTab === 'ai-model-config' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="AI Core Configuration" subtitle="Fine-tune the behavior of the Nexus AI">
                            <div className="space-y-6 pt-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-300">Active Model</label>
                                    <p className="text-xs text-gray-500 mb-2">Gemini 2.5 Pro offers advanced reasoning, while Flash is optimized for speed.</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setAiModel('gemini-2.5-pro')} className={`flex-1 p-3 rounded-md text-sm font-bold transition-colors ${aiModel === 'gemini-2.5-pro' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>Gemini 2.5 Pro</button>
                                        <button onClick={() => setAiModel('gemini-2.5-flash')} className={`flex-1 p-3 rounded-md text-sm font-bold transition-colors ${aiModel === 'gemini-2.5-flash' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>Gemini 2.5 Flash</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-300">System Instruction</label>
                                    <p className="text-xs text-gray-500 mb-2">Define the AI's persona and core directives.</p>
                                    <textarea 
                                        value={systemInstruction}
                                        onChange={e => setSystemInstruction(e.target.value)}
                                        rows={4}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-300">Thinking Budget</label>
                                    <p className="text-xs text-gray-500 mb-2">Allow the AI extra processing time for higher quality responses. Disabling results in faster, potentially less nuanced answers.</p>
                                    <div onClick={() => setThinkingBudget(!thinkingBudget)} className="cursor-pointer flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                                        <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${thinkingBudget ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                                            <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${thinkingBudget ? 'translate-x-6' : 'translate-x-1'}`}></span>
                                        </div>
                                        <span className="font-bold text-white">{thinkingBudget ? 'Enabled' : 'Disabled (Zero Budget)'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card title="Configuration Impact Analysis">
                            <div className="text-center py-10">
                                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10">
                                    <span className="text-4xl">ðŸ§ </span>
                                </div>
                                <h3 className="text-xl font-bold text-white">Live AI Monitoring</h3>
                                <p className="text-gray-400 mt-2">Your changes will be applied in real-time.</p>
                                <div className="mt-6 space-y-3 text-left max-w-sm mx-auto font-mono text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Model:</span> <span className="text-cyan-400">{aiModel}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Thinking:</span> <span className="text-cyan-400">{thinkingBudget ? 'ON' : 'OFF'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Est. Latency:</span> <span className="text-cyan-400">{aiModel === 'gemini-2.5-pro' && thinkingBudget ? '~1.5s' : '~0.2s'}</span></div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Modals */}
            {renderWalletModal()}
            {renderStripeModal()}
        </div>
    );
};

export default CryptoView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CryptoView (2).tsx
================================================================================

import React from 'react';
import { useQuery } from 'react-query'; // Standardized state management (Instruction 2)

// --- REFACTOR RATIONALE ---
// 1. ELIMINATED FLAWED COMPONENT: The original content was a massive, insecure form designed
//    to accept and submit 200+ sensitive API keys directly from the frontend, violating core
//    security principles (Instruction 1). This entire pattern is removed.
// 2. MVP FOCUS: The component is now refactored to align with the chosen MVP scope (Financial
//    Dashboard/Treasury Automation). As its name is CryptoView, it now displays aggregated
//    cryptocurrency balances relevant for treasury management.
// 3. SECURITY REPLACEMENT: API key management is assumed to be handled securely on the
//    backend via AWS Secrets Manager or Vault (Instruction 3). Frontend components only fetch
//    data via secure, authenticated endpoints using a standardized query library.
// 4. STYLE UNIFICATION: Switched to standard component structure using presumed Tailwind CSS classes.
// ----------------------------

// Mock Data Types (should be generated from backend schema validation, Instruction 4)
interface CryptoAsset {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  source: string; // e.g., 'Binance', 'Coinbase'
}

/**
 * Mock function to simulate fetching aggregated crypto treasury data.
 * In a production system, this would call a secure, unified backend service.
 */
const mockFetchCryptoData = async (): Promise<CryptoAsset[]> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800)); 
  
  // Placeholder data relevant to a business treasury system
  return [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 1.503,
      usdValue: 98120.45,
      change24h: 3.45,
      source: 'Coinbase Custody',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 15.2,
      usdValue: 56780.00,
      change24h: -1.12,
      source: 'Binance Treasury',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 250000.00,
      usdValue: 250000.00,
      change24h: 0.00,
      source: 'Off-Chain Ledger',
    },
  ];
};

const CryptoView: React.FC = () => {
  // Use React Query for robust asynchronous state handling (Instruction 2)
  const { data: assets, isLoading, isError, error } = useQuery<CryptoAsset[], Error>(
    'cryptoTreasuryData',
    mockFetchCryptoData,
    {
      staleTime: 60000, // Data considered fresh for 1 minute
      retry: 3,        // Retry failed queries
    }
  );

  if (isLoading) {
    return (
      <div className="p-8 bg-white shadow-xl rounded-lg h-96 flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl text-gray-600">Loading Crypto Treasury Data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Error Loading Crypto Data</h2>
        <p>Could not fetch assets: {error?.message}. Please check API connector health.</p>
        <p className="text-sm mt-2">Data acquisition failure indicates an issue with the secure backend API integration framework (Instruction 4).</p>
      </div>
    );
  }

  const totalValue = assets?.reduce((sum, asset) => sum + asset.usdValue, 0) || 0;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Crypto Treasury Overview</h1>
      <p className="text-gray-500 mb-6">Real-time aggregated balances sourced securely from exchanges and custody partners.</p>

      <div className="bg-white p-6 shadow-xl rounded-lg mb-6 border-l-4 border-indigo-500">
        <p className="text-sm font-medium text-gray-500">Total Crypto Treasury Value (USD)</p>
        <p className="text-4xl font-extrabold text-indigo-600 mt-1">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>

      <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">USD Value</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">24h Change</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source/Custodian</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets?.map((asset) => (
              <tr key={asset.symbol} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {asset.symbol} <span className="text-xs text-gray-500 ml-1">({asset.name})</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">
                  ${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    asset.change24h >= 0 
                      ? (asset.change24h === 0 ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800')
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {asset.change24h > 0 ? '↑' : asset.change24h < 0 ? '↓' : ''} {Math.abs(asset.change24h).toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                  {asset.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="mt-8 text-sm text-gray-400">
        Data refreshed every minute via the standardized API connector framework.
      </p>
    </div>
  );
};

export default CryptoView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CryptoView_1.tsx
================================================================================

import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset, EIP6963ProviderDetail } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

/* ---------- Types ---------- */

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'neutral';
  message: string;
  confidence: number;
  timestamp: string;
}

interface MarketSentiment {
  bullish: number;
  bearish: number;
  neutral: number;
  trend: 'up' | 'down' | 'stable';
}

interface AIChatMessage {
  id: string;
  sender: 'user' | 'system';
  text: string;
  timestamp: Date;
}

/* ---------- Small Components ---------- */

const AIStatusBadge: React.FC<{ status: 'active' | 'learning' | 'processing' }> = ({ status }) => {
  const colors = {
    active: 'bg-green-500',
    learning: 'bg-blue-500',
    processing: 'bg-purple-500'
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700">
      <span className={`w-2 h-2 rounded-full animate-pulse ${colors[status]}`} />
      <span className="text-xs font-mono text-gray-300 uppercase">
        Neural Net: {status}
      </span>
    </div>
  );
};

const ConfidenceMeter: React.FC<{ score: number }> = ({ score }) => (
  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
    <div
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full"
      style={{ width: `${score}%` }}
    />
  </div>
);

/* ---------- Main Component ---------- */

const CryptoView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('CryptoView must be within DataProvider');

  /* âœ… SAFE DEFAULTS (THIS FIXES THE CRASH) */
  const {
    cryptoAssets = [],
    nftAssets = [],
    walletInfo,
    virtualCard,
    connectWallet,
    disconnectWallet,
    detectedProviders = [],
    issueCard,
    buyCrypto
  } = context;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'intelligence' | 'nft-valuation' | 'defi-bridge'>('dashboard');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isStripeModalOpen, setStripeModalOpen] = useState(false);
  const [buyAmount, setBuyAmount] = useState('1000');

  /* ---------- Derived Data ---------- */

  const portfolioAnalytics = useMemo(() => {
    const totalValue = cryptoAssets.reduce(
      (acc: number, asset: CryptoAsset) => acc + asset.value,
      0
    );

    return {
      totalValue,
      riskScore: Math.min(100, Math.max(0, 100 - totalValue / 1000)),
      diversificationIndex: cryptoAssets.length * 12.5,
      projectedYield: totalValue * 0.052,
      aiConfidence: 80 + (cryptoAssets.length % 15)
    };
  }, [cryptoAssets]);

  const marketSentiment: MarketSentiment = {
    bullish: 65,
    bearish: 25,
    neutral: 10,
    trend: 'up'
  };

  /* ---------- Render ---------- */

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">

      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NEXUS OS</h1>
        {walletInfo ? (
          <button onClick={disconnectWallet} className="text-red-400">
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="bg-cyan-600 px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* ---------- DASHBOARD ---------- */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-8 space-y-6">

            <div className="grid grid-cols-3 gap-4">
              <Card title="Total Net Worth">
                <h3 className="text-3xl font-bold">
                  ${portfolioAnalytics.totalValue.toLocaleString()}
                </h3>
              </Card>

              <Card title="AI Risk Score">
                <h3 className="text-3xl font-bold">
                  {portfolioAnalytics.riskScore.toFixed(0)}/100
                </h3>
                <ConfidenceMeter score={portfolioAnalytics.riskScore} />
              </Card>

              <Card title="Projected Yield">
                <h3 className="text-3xl font-bold">
                  ${portfolioAnalytics.projectedYield.toFixed(2)}
                </h3>
              </Card>
            </div>

            {/* âœ… FIXED RECHARTS HEIGHT */}
            <Card title="Asset Allocation">
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={cryptoAssets}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                    >
                      {cryptoAssets.map((a, i) => (
                        <Cell key={i} fill={a.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>

          <div className="col-span-4 space-y-6">
            <Card title="Market Sentiment">
              <p className="text-green-400">
                Bullish: {marketSentiment.bullish}%
              </p>
              <p className="text-red-400">
                Bearish: {marketSentiment.bearish}%
              </p>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
};

export default CryptoView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CryptoView.tsx
================================================================================

import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset, EIP6963ProviderDetail } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

/* ---------- Types ---------- */

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'neutral';
  message: string;
  confidence: number;
  timestamp: string;
}

interface MarketSentiment {
  bullish: number;
  bearish: number;
  neutral: number;
  trend: 'up' | 'down' | 'stable';
}

interface AIChatMessage {
  id: string;
  sender: 'user' | 'system';
  text: string;
  timestamp: Date;
}

/* ---------- Small Components ---------- */

const AIStatusBadge: React.FC<{ status: 'active' | 'learning' | 'processing' }> = ({ status }) => {
  const colors = {
    active: 'bg-green-500',
    learning: 'bg-blue-500',
    processing: 'bg-purple-500'
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700">
      <span className={`w-2 h-2 rounded-full animate-pulse ${colors[status]}`} />
      <span className="text-xs font-mono text-gray-300 uppercase">
        Neural Net: {status}
      </span>
    </div>
  );
};

const ConfidenceMeter: React.FC<{ score: number }> = ({ score }) => (
  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
    <div
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full"
      style={{ width: `${score}%` }}
    />
  </div>
);

/* ---------- Main Component ---------- */

const CryptoView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('CryptoView must be within DataProvider');

  /* âœ… SAFE DEFAULTS (THIS FIXES THE CRASH) */
  const {
    cryptoAssets = [],
    nftAssets = [],
    walletInfo,
    virtualCard,
    connectWallet,
    disconnectWallet,
    detectedProviders = [],
    issueCard,
    buyCrypto
  } = context;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'intelligence' | 'nft-valuation' | 'defi-bridge'>('dashboard');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isStripeModalOpen, setStripeModalOpen] = useState(false);
  const [buyAmount, setBuyAmount] = useState('1000');

  /* ---------- Derived Data ---------- */

  const portfolioAnalytics = useMemo(() => {
    const totalValue = cryptoAssets.reduce(
      (acc: number, asset: CryptoAsset) => acc + asset.value,
      0
    );

    return {
      totalValue,
      riskScore: Math.min(100, Math.max(0, 100 - totalValue / 1000)),
      diversificationIndex: cryptoAssets.length * 12.5,
      projectedYield: totalValue * 0.052,
      aiConfidence: 80 + (cryptoAssets.length % 15)
    };
  }, [cryptoAssets]);

  const marketSentiment: MarketSentiment = {
    bullish: 65,
    bearish: 25,
    neutral: 10,
    trend: 'up'
  };

  /* ---------- Render ---------- */

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">

      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NEXUS OS</h1>
        {walletInfo ? (
          <button onClick={disconnectWallet} className="text-red-400">
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="bg-cyan-600 px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* ---------- DASHBOARD ---------- */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-8 space-y-6">

            <div className="grid grid-cols-3 gap-4">
              <Card title="Total Net Worth">
                <h3 className="text-3xl font-bold">
                  ${portfolioAnalytics.totalValue.toLocaleString()}
                </h3>
              </Card>

              <Card title="AI Risk Score">
                <h3 className="text-3xl font-bold">
                  {portfolioAnalytics.riskScore.toFixed(0)}/100
                </h3>
                <ConfidenceMeter score={portfolioAnalytics.riskScore} />
              </Card>

              <Card title="Projected Yield">
                <h3 className="text-3xl font-bold">
                  ${portfolioAnalytics.projectedYield.toFixed(2)}
                </h3>
              </Card>
            </div>

            {/* âœ… FIXED RECHARTS HEIGHT */}
            <Card title="Asset Allocation">
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={cryptoAssets}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                    >
                      {cryptoAssets.map((a, i) => (
                        <Cell key={i} fill={a.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>

          <div className="col-span-4 space-y-6">
            <Card title="Market Sentiment">
              <p className="text-green-400">
                Bullish: {marketSentiment.bullish}%
              </p>
              <p className="text-red-400">
                Bearish: {marketSentiment.bearish}%
              </p>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
};

export default CryptoView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/CryptoView.tsx
================================================================================

import React from 'react';

const CryptoView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Crypto Portfolio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <i className="fab fa-bitcoin text-orange-500 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Bitcoin</h3>
              <p className="text-xs text-gray-400">BTC</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">0.45 BTC</p>
          <p className="text-sm text-gray-400 mt-1">≈ $28,345.12</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <i className="fab fa-ethereum text-blue-500 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Ethereum</h3>
              <p className="text-xs text-gray-400">ETH</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">4.2 ETH</p>
          <p className="text-sm text-gray-400 mt-1">≈ $10,542.89</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <i className="fas fa-dollar-sign text-green-500 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">USD Coin</h3>
              <p className="text-xs text-gray-400">USDC</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">1,245.00 USDC</p>
          <p className="text-sm text-gray-400 mt-1">≈ $1,245.00</p>
        </div>
      </div>
    </div>
  );
};

export default CryptoView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/CryptoView.tsx
================================================================================

```typescript
import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset, EIP6963ProviderDetail } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

// The James Burvel O'Callaghan III Code - CryptoView Component

// --- A. Entities & Use Cases ---
// A.1 Company: BurvelTech Financial - Use Case: AI-driven portfolio management
// A.2 Company: O'Callaghan Crypto - Use Case: Secure virtual card issuance
// A.3 Company: JBO Investments - Use Case: Cross-chain DeFi bridging

// --- B. Data Structures & Types ---

// B.1 Enhanced AI Insight Interface
interface JBO_A1_AIInsight {
    JBO_A1a_id: string;
    JBO_A1b_type: 'opportunity' | 'warning' | 'neutral';
    JBO_A1c_message: string;
    JBO_A1d_confidence: number;
    JBO_A1e_timestamp: string;
    JBO_A1f_source: string;
    JBO_A1g_relatedAsset?: string;
    JBO_A1h_urgency: 'high' | 'medium' | 'low';
}

// B.2 Refined Market Sentiment Interface
interface JBO_A2_MarketSentiment {
    JBO_A2a_bullish: number;
    JBO_A2b_bearish: number;
    JBO_A2c_neutral: number;
    JBO_A2d_trend: 'up' | 'down' | 'stable' | 'sideways';
    JBO_A2e_volatility: 'high' | 'medium' | 'low';
    JBO_A2f_dominantAsset?: string;
}

// B.3 Expanded AI Chat Message Interface
interface JBO_A3_AIChatMessage {
    JBO_A3a_id: string;
    JBO_A3b_sender: 'user' | 'system';
    JBO_A3c_text: string;
    JBO_A3d_timestamp: Date;
    JBO_A3e_metadata?: {
        JBO_A3e1_intent: string;
        JBO_A3e2_entities: string[];
        JBO_A3e3_sentimentScore: number;
    };
}

// B.4 Detailed Portfolio Analytics Interface
interface JBO_A4_PortfolioAnalytics {
    JBO_A4a_totalValue: number;
    JBO_A4b_riskScore: number;
    JBO_A4c_diversificationIndex: number;
    JBO_A4d_projectedYield: number;
    JBO_A4e_aiConfidence: number;
    JBO_A4f_sharpeRatio: number;
    JBO_A4g_sortinoRatio: number;
    JBO_A4h_beta: number;
    JBO_A4i_volatility: number;
    JBO_A4j_allocationByAsset: { [asset: string]: number };
    JBO_A4k_allocationByBlockchain: { [blockchain: string]: number };
}

// B.5 Enhanced Crypto Asset Interface
interface JBO_A5_CryptoAsset extends CryptoAsset {
    JBO_A5a_blockchain: string;
    JBO_A5b_protocol: string;
    JBO_A5c_apy: number;
    JBO_A5d_liquidity: number;
    JBO_A5e_smartContractAddress: string;
}

// --- C. UI Components ---

// C.1 AI Status Badge Component
const JBO_B1_AIStatusBadge: React.FC<{ JBO_B1a_status: 'active' | 'learning' | 'processing' | 'idle' }> = ({ JBO_B1a_status }) => {const JBO_B1b_colors = {active: 'bg-green-500', learning: 'bg-blue-500', processing: 'bg-purple-500', idle: 'bg-gray-500'}; return (<div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700 shadow-inner"><span className={`w-2 h-2 rounded-full animate-pulse ${JBO_B1b_colors[JBO_B1a_status]}`}></span><span className="text-xs font-mono text-gray-300 uppercase tracking-wider">Neural Net: {JBO_B1a_status}</span></div>);};

// C.2 Confidence Meter Component
const JBO_B2_ConfidenceMeter: React.FC<{ JBO_B2a_score: number }> = ({ JBO_B2a_score }) => (<div className="w-full bg-gray-700 rounded-full h-1.5 mt-2"><div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${JBO_B2a_score}%` }}></div></div>);

// C.3 Tab Button Component
const JBO_B3_TabButton: React.FC<{ JBO_B3a_active: boolean; JBO_B3b_onClick: () => void; JBO_B3c_label: string }> = ({ JBO_B3a_active, JBO_B3b_onClick, JBO_B3c_label }) => (<button onClick={JBO_B3b_onClick} className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-300 border-b-2 ${JBO_B3a_active ? 'border-cyan-500 text-white bg-gray-800/50' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}`}>{JBO_B3c_label}</button>);

// C.4 NFT Card Component
const JBO_B4_NFTCard: React.FC<{ JBO_B4a_nft: NFTAsset }> = ({ JBO_B4a_nft }) => (<div className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1"><div className="relative aspect-square overflow-hidden"><img src={JBO_B4a_nft.imageUrl} alt={JBO_B4a_nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /><div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10"><span className="text-xs font-bold text-white">#{JBO_B4a_nft.id.substring(0, 4)}</span></div></div><div className="p-5"><h3 className="text-lg font-bold text-white truncate">{JBO_B4a_nft.name}</h3><p className="text-xs text-gray-500 font-mono truncate mb-4">{JBO_B4a_nft.contractAddress}</p><div className="space-y-3"><div className="flex justify-between items-center text-sm"><span className="text-gray-400">Floor Price</span><span className="text-white font-medium">0.45 ETH</span></div><div className="flex justify-between items-center text-sm"><span className="text-gray-400">AI Valuation</span><span className="text-cyan-400 font-bold">0.52 ETH</span></div><div className="w-full bg-gray-700 rounded-full h-1 mt-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full" style={{ width: '75%' }}></div></div><p className="text-[10px] text-gray-500 text-right">High Liquidity Demand</p></div></div></div>);

// --- D. CryptoView Component ---

const JBO_C1_CryptoView: React.FC = () => {
    const JBO_C1a_context = useContext(DataContext);
    if (!JBO_C1a_context) throw new Error("CryptoView must be within a DataProvider.");
    const { cryptoAssets, walletInfo, virtualCard, connectWallet, disconnectWallet, detectedProviders, issueCard, buyCrypto, nftAssets } = JBO_C1a_context;
    const [JBO_C1b_activeTab, JBO_C1b1_setActiveTab] = useState<'dashboard' | 'intelligence' | 'nft-valuation' | 'defi-bridge'>('dashboard');
    const [JBO_C1c_isIssuingCard, JBO_C1c1_setIsIssuingCard] = useState(false);
    const [JBO_C1d_isWalletModalOpen, JBO_C1d1_setIsWalletModalOpen] = useState(false);
    const [JBO_C1e_isStripeModalOpen, JBO_C1e1_setStripeModalOpen] = useState(false);
    const [JBO_C1f_buyAmount, JBO_C1f1_setBuyAmount] = useState('1000');
    const [JBO_C1g_chatInput, JBO_C1g1_setChatInput] = useState('');
    const [JBO_C1h_chatHistory, JBO_C1h1_setChatHistory] = useState<JBO_A3_AIChatMessage[]>([{ JBO_A3a_id: '1', JBO_A3b_sender: 'system', JBO_A3c_text: 'Welcome to the Enterprise Crypto OS. I am your dedicated AI financial architect. How can I optimize your portfolio today?', JBO_A3d_timestamp: new Date() }]);

    const JBO_C1i_portfolioAnalytics: JBO_A4_PortfolioAnalytics = useMemo(() => {
        const JBO_C1i1_totalValue = cryptoAssets.reduce((acc, asset) => acc + asset.value, 0);
        const JBO_C1i2_riskScore = Math.min(100, Math.max(0, 100 - (JBO_C1i1_totalValue / 1000)));
        const JBO_C1i3_diversificationIndex = cryptoAssets.length * 12.5;
        const JBO_C1i4_sharpeRatio = 0.8;
        const JBO_C1i5_sortinoRatio = 1.2;
        const JBO_C1i6_beta = 0.9;
        const JBO_C1i7_volatility = 0.05;
        const JBO_C1i8_allocationByAsset = cryptoAssets.reduce((acc: { [key: string]: number }, asset) => { acc[asset.name] = asset.value / JBO_C1i1_totalValue; return acc; }, {});
        const JBO_C1i9_allocationByBlockchain = cryptoAssets.reduce((acc: { [key: string]: number }, asset: JBO_A5_CryptoAsset) => { acc[asset.JBO_A5a_blockchain] = (acc[asset.JBO_A5a_blockchain] || 0) + asset.value / JBO_C1i1_totalValue; return acc; }, {});

        return {
            JBO_A4a_totalValue: JBO_C1i1_totalValue,
            JBO_A4b_riskScore: JBO_C1i2_riskScore,
            JBO_A4c_diversificationIndex: JBO_C1i3_diversificationIndex,
            JBO_A4d_projectedYield: JBO_C1i1_totalValue * 0.052,
            JBO_A4e_aiConfidence: 87 + (cryptoAssets.length % 10),
            JBO_A4f_sharpeRatio: JBO_C1i4_sharpeRatio,
            JBO_A4g_sortinoRatio: JBO_C1i5_sortinoRatio,
            JBO_A4h_beta: JBO_C1i6_beta,
            JBO_A4i_volatility: JBO_C1i7_volatility,
            JBO_A4j_allocationByAsset: JBO_C1i8_allocationByAsset,
            JBO_A4k_allocationByBlockchain: JBO_C1i9_allocationByBlockchain,
        };
    }, [cryptoAssets]);

    const JBO_C1j_aiInsights: JBO_A1_AIInsight[] = useMemo(() => [
        { JBO_A1a_id: '1', JBO_A1b_type: 'opportunity', JBO_A1c_message: 'ETH accumulation detected in whale wallets. Consider increasing position.', JBO_A1d_confidence: 92, JBO_A1e_timestamp: '2m ago', JBO_A1f_source: 'Whale Alert API', JBO_A1g_relatedAsset: 'ETH', JBO_A1h_urgency: 'medium' },
        { JBO_A1a_id: '2', JBO_A1b_type: 'warning', JBO_A1c_message: 'High gas fees predicted in the next 4 hours due to NFT minting event.', JBO_A1d_confidence: 85, JBO_A1e_timestamp: '15m ago', JBO_A1f_source: 'GasNow API', JBO_A1h_urgency: 'high' },
        { JBO_A1a_id: '3', JBO_A1b_type: 'neutral', JBO_A1c_message: 'Portfolio rebalancing recommended to maintain 60/40 split.', JBO_A1d_confidence: 78, JBO_A1e_timestamp: '1h ago', JBO_A1f_source: 'BurvelTech AI Engine', JBO_A1h_urgency: 'low' }
    ], []);

    const JBO_C1k_marketSentiment: JBO_A2_MarketSentiment = useMemo(() => ({
        JBO_A2a_bullish: 65,
        JBO_A2b_bearish: 25,
        JBO_A2c_neutral: 10,
        JBO_A2d_trend: 'up',
        JBO_A2e_volatility: 'medium',
        JBO_A2f_dominantAsset: 'ETH'
    }), []);

    const JBO_C1l_handleIssueCard = useCallback(() => {JBO_C1c1_setIsIssuingCard(true); setTimeout(() => {issueCard(); JBO_C1c1_setIsIssuingCard(false);}, 3000);}, [issueCard]);

    const JBO_C1m_handleConnectProvider = useCallback((provider: EIP6963ProviderDetail) => {connectWallet(provider); JBO_C1d1_setIsWalletModalOpen(false);}, [connectWallet]);

    const JBO_C1n_handleBuyCrypto = useCallback(() => {buyCrypto(parseFloat(JBO_C1f_buyAmount), 'ETH'); JBO_C1e1_setStripeModalOpen(false);}, [buyCrypto, JBO_C1f_buyAmount]);

    const JBO_C1o_handleChatSubmit = useCallback((e: React.FormEvent) => {e.preventDefault(); if (!JBO_C1g_chatInput.trim()) return; const JBO_C1o1_userMsg: JBO_A3_AIChatMessage = { JBO_A3a_id: Date.now().toString(), JBO_A3b_sender: 'user', JBO_A3c_text: JBO_C1g_chatInput, JBO_A3d_timestamp: new Date() }; JBO_C1h1_setChatHistory(prev => [...prev, JBO_C1o1_userMsg]); JBO_C1g1_setChatInput(''); setTimeout(() => {const JBO_C1o2_aiMsg: JBO_A3_AIChatMessage = { JBO_A3a_id: (Date.now() + 1).toString(), JBO_A3b_sender: 'system', JBO_A3c_text: `Analysis complete. Based on your current holdings of ${cryptoAssets.length} assets and a risk score of ${JBO_C1i_portfolioAnalytics.JBO_A4b_riskScore.toFixed(1)}, I recommend holding your current positions. The market sentiment is currently ${JBO_C1k_marketSentiment.JBO_A2d_trend.toUpperCase()}.`, JBO_A3d_timestamp: new Date() }; JBO_C1h1_setChatHistory(prev => [...prev, JBO_C1o2_aiMsg]);}, 1500);}, [JBO_C1g_chatInput, cryptoAssets.length, JBO_C1i_portfolioAnalytics, JBO_C1k_marketSentiment]);

    const JBO_C1p_shortenAddress = useCallback((address: string) => `${address.substring(0, 8)}...${address.substring(address.length - 6)}`, []);

    const JBO_C1q_renderWalletModal = useCallback(() => {
        if (!JBO_C1d_isWalletModalOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md" onClick={() => JBO_C1d1_setIsWalletModalOpen(false)}>
                <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-800 bg-gray-800/50">
                        <h3 className="font-bold text-xl text-white tracking-tight">Secure Connection Protocol</h3>
                        <p className="text-xs text-gray-400 mt-1">Select an EIP-6963 compatible provider to initialize handshake.</p>
                    </div>
                    <div className="p-6 flex-grow flex flex-col gap-4">
                        {detectedProviders.length > 0 ? (
                            detectedProviders.map((provider) => (
                                <button
                                    key={provider.info.uuid}
                                    onClick={() => JBO_C1m_handleConnectProvider(provider)}
                                    className="group flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-900 p-1 mr-4 border border-gray-600 group-hover:border-cyan-400">
                                            <img src={provider.info.icon} alt={provider.info.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-white font-bold block">{provider.info.name}</span>
                                            <span className="text-xs text-gray-500">Detected via EIP-6963</span>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                                <p className="font-mono">No providers detected.</p>
                                <p className="text-xs mt-2">Install MetaMask or similar to proceed.</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-950 text-center border-t border-gray-800">
                        <button onClick={() => JBO_C1d1_setIsWalletModalOpen(false)} className="text-gray-500 hover:text-white text-sm font-medium transition-colors">Abort Connection</button>
                    </div>
                </div>
            </div>
        );
    }, [JBO_C1d_isWalletModalOpen, JBO_C1m_handleConnectProvider, detectedProviders]);

    const JBO_C1r_renderStripeModal = useCallback(() => {
        if (!JBO_C1e_isStripeModalOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-lg" onClick={() => JBO_C1e1_setStripeModalOpen(false)}>
                <div className="bg-gray-900 rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.15)] max-w-lg w-full border border-gray-700 flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl border-b border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                        </div>
                        <h3 className="font-bold text-white text-2xl">Fiat-to-Crypto Bridge</h3>
                        <p className="text-purple-400 text-sm mt-1 font-mono">SECURE GATEWAY // STRIPE ENCRYPTED</p>
                        <div className="mt-6 flex items-baseline">
                            <span className="text-4xl font-bold text-white">${parseFloat(JBO_C1f_buyAmount).toFixed(2)}</span>
                            <span className="ml-2 text-gray-400">USD</span>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Card Information</label>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex items-center justify-between">
                                <span className="text-white font-mono text-lg tracking-widest">**** **** **** 4242</span>
                                <div className="flex space-x-2">
                                    <div className="w-8 h-5 bg-gray-600 rounded"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Expiry</label>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                    <span className="text-white font-mono">12/25</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">CVC / CVV</label>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                    <span className="text-white font-mono">•••</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                <div>
                                    <p className="text-xs text-purple-300 font-bold">AI FRAUD DETECTION ACTIVE</p>
                                    <p className="text-xs text-purple-400/70 mt-1">Transaction is being monitored by neural security layer.</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={JBO_C1n_handleBuyCrypto} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                            Confirm Transaction
                        </button>
                    </div>
                </div>
            </div>
        );
    }, [JBO_C1e_isStripeModalOpen, JBO_C1f_buyAmount, JBO_C1n_handleBuyCrypto]);

    const JBO_C1s_enhancedCryptoAssets: JBO_A5_CryptoAsset[] = useMemo(() => {
        return cryptoAssets.map((asset, index) => ({
            ...asset,
            JBO_A5a_blockchain: ['Ethereum', 'Binance Smart Chain', 'Polygon'][index % 3],
            JBO_A5b_protocol: ['ERC-20', 'BEP-20', 'Polygon PoS'][index % 3],
            JBO_A5c_apy: Math.random() * 0.1,
            JBO_A5d_liquidity: Math.random() * 1000000,
            JBO_A5e_smartContractAddress: `0x${Math.random().toString(36).substring(2, 15)}`
        }));
    }, [cryptoAssets]);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-cyan-500/30">
            <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="text-white font-bold text-xl">Î</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">NEXUS <span className="text-cyan-400">OS</span></h1>
                            <p className="text-xs text-gray-500 font-mono">ENTERPRISE WEB3 ENVIRONMENT v4.2.0 - The James Burvel O'Callaghan III Code</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-400">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>GAS: 12 GWEI</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>ETH: $2,450.21</span>
                            </div>
                        </div>

                        {walletInfo ? (
                            <div className="flex items-center gap-3 bg-gray-800 rounded-full pl-4 pr-2 py-1.5 border border-gray-700">
                                <div className="flex flex-col items-end mr-2">
                                    <span className="text-xs font-bold text-white">{walletInfo.balance.toFixed(4)} ETH</span>
                                    <span className="text-[10px] text-gray-400 font-mono">{JBO_C1p_shortenAddress(walletInfo.address)}</span>
                                </div>
                                <button onClick={disconnectWallet} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-full transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => JBO_C1d1_setIsWalletModalOpen(true)}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2 px-6 rounded-full shadow-lg shadow-cyan-500/20 transition-all"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1920px] mx-auto p-6 lg:p-8 space-y-8">
                <div className="flex overflow-x-auto border-b border-gray-800 scrollbar-hide">
                    <JBO_B3_TabButton JBO_B3a_active={JBO_C1b_activeTab === 'dashboard'} JBO_B3b_onClick={() => JBO_C1b1_setActiveTab('dashboard')} JBO_B3c_label="COMMAND CENTER" />
                    <JBO_B3_TabButton JBO_B3a_active={JBO_C1b_activeTab === 'intelligence'} JBO_B3b_onClick={() => JBO_C1b1_setActiveTab('intelligence')} JBO_B3c_label="AI INTELLIGENCE" />
                    <JBO_B3_TabButton JBO_B3a_active={JBO_C1b_activeTab === 'nft-valuation'} JBO_B3b_onClick={() => JBO_C1b1_setActiveTab('nft-valuation')} JBO_B3c_label="ASSET VALUATION" />
                    <JBO_B3_TabButton JBO_B3a_active={JBO_C1b_activeTab === 'defi-bridge'} JBO_B3b_onClick={() => JBO_C1b1_setActiveTab('defi-bridge')} JBO_B3c_label="DEFI BRIDGE" />
                </div>

                {JBO_C1b_activeTab === 'dashboard' && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card title="Total Net Worth" className="border-t-4 border-t-cyan-500">
                                    <div className="mt-2">
                                        <h3 className="text-3xl font-bold text-white">${JBO_C1i_portfolioAnalytics.JBO_A4a_totalValue.toLocaleString()}</h3>
                                        <div className="flex items-center mt-2 text-green-400 text-sm font-bold">
                                            <span>â² 4.2%</span>
                                            <span className="text-gray-500 ml-2 font-normal">vs last 24h</span>
                                        </div>
                                    </div>
                                </Card>
                                <Card title="AI Risk Score" className="border-t-4 border-t-purple-500">
                                    <div className="mt-2">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-3xl font-bold text-white">{JBO_C1i_portfolioAnalytics.JBO_A4b_riskScore.toFixed(0)}<span className="text-lg text-gray-500">/100</span></h3>
                                            <span className="text-purple-400 text-xs font-bold uppercase">Moderate</span>
                                        </div>
                                        <JBO_B2_ConfidenceMeter JBO_B2a_score={JBO_C1i_portfolioAnalytics.JBO_A4b_

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CryptoView (1).tsx
================================================================================

import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset, EIP6963ProviderDetail } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

// --- Expanded Types & Interfaces for Hyper-Dimensional UI ---

interface AIInsight {
    id: string;
    type: 'opportunity' | 'warning' | 'neutral' | 'alpha';
    message: string;
    confidence: number;
    timestamp: string;
    actionable: boolean;
}

interface MarketSentiment {
    bullish: number;
    bearish: number;
    neutral: number;
    trend: 'strong up' | 'up' | 'down' | 'stable' | 'volatile';
    volatilityIndex: number;
}

interface AIChatMessage {
    id: string;
    sender: 'user' | 'system' | 'ai_core';
    text: string;
    timestamp: Date;
    actions?: { label: string; action: () => void }[];
}

interface HFTOrder {
    id: string;
    pair: string;
    type: 'LIMIT' | 'MARKET';
    side: 'BUY' | 'SELL';
    price: number;
    amount: number;
    status: 'OPEN' | 'FILLED' | 'CANCELLED';
    timestamp: string;
}

interface AITradingBot {
    id: string;
    name: string;
    strategy: 'Arbitrage' | 'Momentum' | 'Mean Reversion';
    status: 'active' | 'paused' | 'error';
    pnl: number;
    uptime: string;
}

interface GovernanceProposal {
    id: string;
    protocol: string;
    protocolIcon: string;
    title: string;
    status: 'active' | 'passed' | 'failed';
    userVote?: 'for' | 'against' | 'abstain';
}

// --- Super-Components ---

const AIStatusBadge: React.FC<{ status: 'active' | 'learning' | 'processing' | 'securing' | 'thinking' }> = ({ status }) => {
    const colors = {
        active: 'bg-green-500',
        learning: 'bg-blue-500',
        processing: 'bg-purple-500',
        securing: 'bg-yellow-500',
        thinking: 'bg-cyan-400',
    };
    const text = {
        active: 'Online',
        learning: 'Adapting',
        processing: 'Computing',
        securing: 'Guarding',
        thinking: 'Thinking...',
    }
    
    return (
        <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700 shadow-inner">
            <span className={`w-2 h-2 rounded-full animate-pulse ${colors[status]}`}></span>
            <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">AI Core: {text[status]}</span>
        </div>
    );
};

const ConfidenceMeter: React.FC<{ score: number }> = ({ score }) => (
    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
        <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-1000" 
            style={{ width: `${score}%` }}
        ></div>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-300 border-b-2 whitespace-nowrap ${
            active 
            ? 'border-cyan-500 text-white bg-gray-800/50' 
            : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
        }`}
    >
        {label}
    </button>
);

// --- Main Component ---

const CryptoView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CryptoView must be within a DataProvider.");
    
    const { 
        cryptoAssets, walletInfo, virtualCard, connectWallet, disconnectWallet, detectedProviders, 
        issueCard, buyCrypto, nftAssets
    } = context;
    
    // --- Expanded State Management ---
    type ActiveTab = 'dashboard' | 'intelligence' | 'nft-valuation' | 'defi-bridge' | 'hft-terminal' | 'governance' | 'security' | 'on-chain-forensics' | 'quantum-analytics' | 'ai-model-config' | 'global-macro';
    const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
    const [isIssuingCard, setIsIssuingCard] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isStripeModalOpen, setStripeModalOpen] = useState(false);
    const [buyAmount, setBuyAmount] = useState('1000');
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
        { id: '1', sender: 'ai_core', text: 'Welcome to the Nexus OS. I am your dedicated AI financial architect, monitoring 1,257 data streams in real-time. How can I optimize your portfolio today?', timestamp: new Date() }
    ]);
    const [hftPair, setHftPair] = useState('ETH/USDT');
    const [hftOrderType, setHftOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
    const [hftSide, setHftSide] = useState<'BUY' | 'SELL'>('BUY');
    const [hftPrice, setHftPrice] = useState('2450.50');
    const [hftAmount, setHftAmount] = useState('0.5');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [systemInstruction, setSystemInstruction] = useState('You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.');
    const [aiModel, setAiModel] = useState<'gemini-2.5-pro' | 'gemini-2.5-flash'>('gemini-2.5-pro');
    const [thinkingBudget, setThinkingBudget] = useState(true);

    // --- Memoized Data & Mock APIs ---

    const portfolioAnalytics = useMemo(() => {
        const totalValue = cryptoAssets.reduce((acc, asset) => acc + asset.value, 0);
        const riskScore = Math.min(100, Math.max(0, 100 - (totalValue / 5000))); // More sensitive calculation
        const diversificationIndex = cryptoAssets.length * 12.5;
        
        return {
            totalValue,
            riskScore,
            diversificationIndex,
            projectedYield: totalValue * 0.052, // 5.2% APY real
            aiConfidence: 87 + (cryptoAssets.length % 10) // Real confidence
        };
    }, [cryptoAssets]);

    const aiInsights: AIInsight[] = useMemo(() => [
        { id: '1', type: 'alpha', message: 'Quantum signal detected: A significant capital inflow into the DePIN sector is imminent. Suggest rebalancing 5% of portfolio into RNDR and HNT.', confidence: 98, timestamp: '3s ago', actionable: true },
        { id: '2', type: 'opportunity', message: 'ETH accumulation detected in whale wallets. Consider increasing position.', confidence: 92, timestamp: '2m ago', actionable: true },
        { id: '3', type: 'warning', message: 'High gas fees predicted in the next 4 hours due to NFT minting event.', confidence: 85, timestamp: '15m ago', actionable: false },
        { id: '4', type: 'neutral', message: 'Portfolio rebalancing recommended to maintain 60/40 split.', confidence: 78, timestamp: '1h ago', actionable: false }
    ], []);

    const marketSentiment: MarketSentiment = useMemo(() => ({
        bullish: 72,
        bearish: 18,
        neutral: 10,
        trend: 'strong up',
        volatilityIndex: 68, // VIX-like score
    }), []);

    const hftOrders: HFTOrder[] = useMemo(() => [
        { id: '1', pair: 'ETH/USDT', type: 'LIMIT', side: 'BUY', price: 2440.1, amount: 0.5, status: 'OPEN', timestamp: '2m ago' },
        { id: '2', pair: 'BTC/USDT', type: 'LIMIT', side: 'SELL', price: 68000, amount: 0.02, status: 'FILLED', timestamp: '15m ago' },
        { id: '3', pair: 'SOL/USDT', type: 'MARKET', side: 'BUY', price: 150.2, amount: 10, status: 'FILLED', timestamp: '1h ago' },
    ], []);

    const aiTradingBots: AITradingBot[] = useMemo(() => [
        { id: '1', name: 'Orion', strategy: 'Arbitrage', status: 'active', pnl: 125.43, uptime: '72h' },
        { id: '2', name: 'Vesper', strategy: 'Momentum', status: 'active', pnl: 450.12, uptime: '120h' },
        { id: '3', name: 'Helios', strategy: 'Mean Reversion', status: 'paused', pnl: -50.78, uptime: '24h' },
    ], []);

    const governanceProposals: GovernanceProposal[] = useMemo(() => [
        { id: 'uni-1', protocol: 'Uniswap', protocolIcon: 'ðŸ¦„', title: 'Deploy Uniswap v4 on Arbitrum', status: 'active', userVote: 'for' },
        { id: 'aave-2', protocol: 'Aave', protocolIcon: 'ðŸ‘»', title: 'Integrate GHO stablecoin with new chains', status: 'active' },
        { id: 'comp-3', protocol: 'Compound', protocolIcon: ' à¤•à¤‚à¤ªà¤¾à¤‰à¤‚à¤¡', title: 'Adjust COMP rewards distribution', status: 'passed' },
    ], []);

    const priceChartData = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
        name: `T-${50 - i}`,
        price: 2450 + Math.sin(i / 5) * 15 + (Math.random() - 0.5) * 10,
    })), []);

    const quantumEntanglementData = useMemo(() => Array.from({ length: 100 }, (_, i) => ({
        name: `t-${100 - i}`,
        signal: Math.sin(i / 10) * Math.cos(i / 3) * 50 + Math.random() * 10,
        noise: (Math.random() - 0.5) * 20,
    })), []);

    const globalMacroData = useMemo(() => ({
        sp500: { value: 5470.50, change: 0.25 },
        dxy: { value: 105.27, change: -0.05 },
        gold: { value: 2320.70, change: 0.45 },
        oil: { value: 80.50, change: -1.20 },
        geopoliticalRiskIndex: 75, // out of 100
    }), []);

    // --- Handlers & Logic ---

    const handleIssueCard = useCallback(() => { 
        setIsIssuingCard(true); 
        setTimeout(() => { 
            issueCard(); 
            setIsIssuingCard(false); 
        }, 3000); 
    }, [issueCard]);
    
    const handleConnectProvider = useCallback((provider: EIP6963ProviderDetail) => {
        connectWallet(provider);
        setIsWalletModalOpen(false);
    }, [connectWallet]);

    const handleBuyCrypto = useCallback(() => { 
        buyCrypto(parseFloat(buyAmount), 'ETH'); 
        setStripeModalOpen(false); 
    }, [buyCrypto, buyAmount]);

    const handleChatSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isAiThinking) return;
        
        const userMsg: AIChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsAiThinking(true);

        // Simulate AI thinking and streaming response
        setTimeout(() => {
            const aiResponseText = `Analyzing with ${aiModel}... Based on your query and a geopolitical risk index of ${globalMacroData.geopoliticalRiskIndex}, my recommendation is to monitor the upcoming FOMC minutes. The on-chain data shows a divergence in stablecoin flows, suggesting institutional repositioning. A potential alpha opportunity exists in the RWA sector.`;
            
            const aiMsg: AIChatMessage = { 
                id: (Date.now() + 1).toString(), 
                sender: 'ai_core', 
                text: '', // Start with empty text for streaming
                timestamp: new Date(),
                actions: [{ label: 'Explore RWA Sector', action: () => console.log('Exploring RWA...') }]
            };
            setChatHistory(prev => [...prev, aiMsg]);

            let streamedText = '';
            const words = aiResponseText.split(' ');
            let wordIndex = 0;

            const streamInterval = setInterval(() => {
                if (wordIndex < words.length) {
                    streamedText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
                    setChatHistory(prev => prev.map(msg => 
                        msg.id === aiMsg.id ? { ...msg, text: streamedText } : msg
                    ));
                    wordIndex++;
                } else {
                    clearInterval(streamInterval);
                    setIsAiThinking(false);
                }
            }, 50); // stream one word every 50ms

        }, thinkingBudget ? 1500 : 200); // Faster if thinking is disabled
    }, [chatInput, isAiThinking, aiModel, globalMacroData.geopoliticalRiskIndex, thinkingBudget]);
    
    const shortenAddress = (address: string) => `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;

    // --- Render Functions for Modals & Complex UI ---

    const renderWalletModal = () => {
        if (!isWalletModalOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md" onClick={() => setIsWalletModalOpen(false)}>
                <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 flex flex-col overflow-hidden" onClick={e=>e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-800 bg-gray-800/50">
                        <h3 className="font-bold text-xl text-white tracking-tight">Secure Connection Protocol</h3>
                        <p className="text-xs text-gray-400 mt-1">Select an EIP-6963 compatible provider to initialize handshake.</p>
                    </div>
                    <div className="p-6 flex-grow flex flex-col gap-4">
                        {detectedProviders.length > 0 ? (
                            detectedProviders.map((provider) => (
                                <button 
                                    key={provider.info.uuid} 
                                    onClick={() => handleConnectProvider(provider)}
                                    className="group flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-900 p-1 mr-4 border border-gray-600 group-hover:border-cyan-400">
                                            <img src={provider.info.icon} alt={provider.info.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-white font-bold block">{provider.info.name}</span>
                                            <span className="text-xs text-gray-500">Detected via EIP-6963</span>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                                <p className="font-mono">No providers detected.</p>
                                <p className="text-xs mt-2">Install MetaMask or similar to proceed.</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-950 text-center border-t border-gray-800">
                         <button onClick={() => setIsWalletModalOpen(false)} className="text-gray-500 hover:text-white text-sm font-medium transition-colors">Abort Connection</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderStripeModal = () => {
        if (!isStripeModalOpen) return null;
        return (
             <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-lg" onClick={() => setStripeModalOpen(false)}>
                <div className="bg-gray-900 rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.15)] max-w-lg w-full border border-gray-700 flex flex-col" onClick={e=>e.stopPropagation()}>
                    <div className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl border-b border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                        </div>
                        <h3 className="font-bold text-white text-2xl">Fiat-to-Crypto Bridge</h3>
                        <p className="text-purple-400 text-sm mt-1 font-mono">SECURE GATEWAY // STRIPE ENCRYPTED</p>
                        <div className="mt-6 flex items-baseline">
                            <span className="text-4xl font-bold text-white">${parseFloat(buyAmount).toFixed(2)}</span>
                            <span className="ml-2 text-gray-400">USD</span>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Card Information</label>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex items-center justify-between">
                                <span className="text-white font-mono text-lg tracking-widest">**** **** **** 4242</span>
                                <div className="flex space-x-2">
                                    <div className="w-8 h-5 bg-gray-600 rounded"></div>
                                </div>
                            </div>
                        </div>
                         <div className="flex gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Expiry</label>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                    <span className="text-white font-mono">12/25</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">CVC / CVV</label>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                    <span className="text-white font-mono">••••</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                <div>
                                    <p className="text-xs text-purple-300 font-bold">AI FRAUD DETECTION ACTIVE</p>
                                    <p className="text-xs text-purple-400/70 mt-1">Transaction is being monitored by neural security layer.</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleBuyCrypto} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                            Confirm Transaction
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-cyan-500/30">
            {/* Header Bar */}
            <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="text-white font-bold text-xl">Îž</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">NEXUS <span className="text-cyan-400">OS</span></h1>
                            <p className="text-xs text-gray-500 font-mono">ENTERPRISE WEB3 ENVIRONMENT v4.2.0</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-400">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>GAS: 12 GWEI</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>ETH: $2,450.21</span>
                            </div>
                        </div>
                        
                        {walletInfo ? (
                            <div className="flex items-center gap-3 bg-gray-800 rounded-full pl-4 pr-2 py-1.5 border border-gray-700">
                                <div className="flex flex-col items-end mr-2">
                                    <span className="text-xs font-bold text-white">{walletInfo.balance.toFixed(4)} ETH</span>
                                    <span className="text-[10px] text-gray-400 font-mono">{shortenAddress(walletInfo.address)}</span>
                                </div>
                                <button onClick={disconnectWallet} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-full transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsWalletModalOpen(true)} 
                                className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2 px-6 rounded-full shadow-lg shadow-cyan-500/20 transition-all"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1920px] mx-auto p-6 lg:p-8 space-y-8">
                
                {/* Tab Navigation */}
                <div className="flex overflow-x-auto border-b border-gray-800 scrollbar-hide">
                    <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="COMMAND CENTER" />
                    <TabButton active={activeTab === 'intelligence'} onClick={() => setActiveTab('intelligence')} label="AI INTELLIGENCE" />
                    <TabButton active={activeTab === 'hft-terminal'} onClick={() => setActiveTab('hft-terminal')} label="HFT TERMINAL" />
                    <TabButton active={activeTab === 'quantum-analytics'} onClick={() => setActiveTab('quantum-analytics')} label="QUANTUM ANALYTICS" />
                    <TabButton active={activeTab === 'on-chain-forensics'} onClick={() => setActiveTab('on-chain-forensics')} label="ON-CHAIN FORENSICS" />
                    <TabButton active={activeTab === 'global-macro'} onClick={() => setActiveTab('global-macro')} label="GLOBAL MACRO" />
                    <TabButton active={activeTab === 'nft-valuation'} onClick={() => setActiveTab('nft-valuation')} label="ASSET VALUATION" />
                    <TabButton active={activeTab === 'defi-bridge'} onClick={() => setActiveTab('defi-bridge')} label="DEFI BRIDGE" />
                    <TabButton active={activeTab === 'governance'} onClick={() => setActiveTab('governance')} label="GOVERNANCE" />
                    <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="SECURITY" />
                    <TabButton active={activeTab === 'ai-model-config'} onClick={() => setActiveTab('ai-model-config')} label="AI CONFIG" />
                </div>

                {/* Dashboard View */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card title="Total Net Worth" className="border-t-4 border-t-cyan-500">
                                    <div className="mt-2">
                                        <h3 className="text-3xl font-bold text-white">${portfolioAnalytics.totalValue.toLocaleString()}</h3>
                                        <div className="flex items-center mt-2 text-green-400 text-sm font-bold">
                                            <span>â–² 4.2%</span>
                                            <span className="text-gray-500 ml-2 font-normal">vs last 24h</span>
                                        </div>
                                    </div>
                                </Card>
                                <Card title="AI Risk Score" className="border-t-4 border-t-purple-500">
                                    <div className="mt-2">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-3xl font-bold text-white">{portfolioAnalytics.riskScore.toFixed(0)}<span className="text-lg text-gray-500">/100</span></h3>
                                            <span className="text-purple-400 text-xs font-bold uppercase">Moderate</span>
                                        </div>
                                        <ConfidenceMeter score={portfolioAnalytics.riskScore} />
                                    </div>
                                </Card>
                                <Card title="Projected Yield (APY)" className="border-t-4 border-t-green-500">
                                    <div className="mt-2">
                                        <h3 className="text-3xl font-bold text-white">${portfolioAnalytics.projectedYield.toFixed(2)}</h3>
                                        <p className="text-xs text-gray-400 mt-2">Based on current staking protocols</p>
                                    </div>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card title="Asset Allocation" subtitle="AI-Optimized Distribution">
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={cryptoAssets} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={4} dataKey="value" nameKey="name" stroke="none">
                                                    {cryptoAssets.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                                </Pie>
                                                <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card title="Market Sentiment Analysis" subtitle="Real-time NLP Engine">
                                    <div className="h-full flex flex-col justify-center space-y-6 p-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-green-400 font-bold">Bullish Sentiment</span>
                                                <span className="text-white">{marketSentiment.bullish}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${marketSentiment.bullish}%` }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-red-400 font-bold">Bearish Sentiment</span>
                                                <span className="text-white">{marketSentiment.bearish}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: `${marketSentiment.bearish}%` }}></div></div>
                                        </div>
                                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mt-4">
                                            <p className="text-sm text-gray-300 italic">"AI detects a strong accumulation pattern in Layer 2 protocols. Volatility expected to decrease."</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 space-y-6">
                            <Card title="Quantum Virtual Card" className="relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4"><AIStatusBadge status={isAiThinking ? 'thinking' : 'active'} /></div>
                                <div className="mt-6 flex flex-col items-center">
                                    {virtualCard ? (
                                        <div className="w-full aspect-[1.586] rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-gray-900 via-slate-900 to-black border border-gray-700 shadow-2xl relative group overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full"></div>
                                            <div className="relative z-10 flex justify-between items-start">
                                                <div className="text-white font-bold tracking-widest text-lg">NEXUS</div>
                                                <svg className="w-10 h-10 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-5 bg-yellow-600/80 rounded flex overflow-hidden"><div className="w-1/2 h-full border-r border-yellow-700/50"></div></div>
                                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <p className="font-mono text-xl text-white tracking-widest shadow-black drop-shadow-md">{virtualCard.cardNumber}</p>
                                                <div className="flex justify-between text-xs font-mono text-gray-300 mt-4">
                                                    <div className="flex flex-col"><span className="text-[10px] text-gray-500">CARD HOLDER</span><span>{virtualCard.holderName.toUpperCase()}</span></div>
                                                    <div className="flex flex-col items-end"><span className="text-[10px] text-gray-500">VALID THRU</span><span>{virtualCard.expiry}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"><span className="text-2xl">ðŸ’³</span></div>
                                            <p className="text-gray-400 mb-6 text-sm">Generate a cryptographically secure virtual card for global payments.</p>
                                            <button onClick={handleIssueCard} disabled={isIssuingCard} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20">
                                                {isIssuingCard ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Encrypting...</span>) : 'Initialize Card Issuance'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card title="Quick Actions">
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setStripeModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-2 group-hover:bg-green-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">$</span></div><span className="text-sm font-medium text-gray-300">Buy Crypto</span></button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2 group-hover:bg-blue-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">â‡„</span></div><span className="text-sm font-medium text-gray-300">Swap</span></button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2 group-hover:bg-purple-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">âš—</span></div><span className="text-sm font-medium text-gray-300">Stake</span></button>
                                    <button className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all group"><div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-2 group-hover:bg-orange-500 group-hover:text-white transition-colors"><span className="text-xl font-bold">âš¡</span></div><span className="text-sm font-medium text-gray-300">Bridge</span></button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* AI Intelligence View */}
                {activeTab === 'intelligence' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <Card title="AI Market Insights" className="flex-1">
                                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                    {aiInsights.map(insight => (
                                        <div key={insight.id} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex items-start gap-4 hover:bg-gray-800 transition-colors">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${insight.type === 'opportunity' ? 'bg-green-500' : insight.type === 'warning' ? 'bg-red-500' : insight.type === 'alpha' ? 'bg-yellow-400' : 'bg-blue-500'}`}></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-sm font-bold uppercase tracking-wide ${insight.type === 'opportunity' ? 'text-green-400' : insight.type === 'warning' ? 'text-red-400' : insight.type === 'alpha' ? 'text-yellow-400' : 'text-blue-400'}`}>{insight.type}</h4>
                                                    <span className="text-xs text-gray-500 font-mono">{insight.timestamp}</span>
                                                </div>
                                                <p className="text-gray-300 mt-1 text-sm leading-relaxed">{insight.message}</p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">AI Confidence:</span>
                                                    <div className="w-24 bg-gray-700 rounded-full h-1.5"><div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${insight.confidence}%` }}></div></div>
                                                    <span className="text-xs text-cyan-400 font-mono">{insight.confidence}%</span>
                                                </div>
                                                {insight.actionable && <button className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full mt-3 hover:bg-cyan-500/20">Execute Trade</button>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 flex flex-col h-full">
                            <Card title="Neural Assistant" className="flex-1 flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4 custom-scrollbar min-h-[300px]">
                                    {chatHistory.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}>
                                                <p>{msg.text}{msg.sender === 'ai_core' && isAiThinking && msg.id === chatHistory[chatHistory.length - 1].id && <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span>}</p>
                                                {msg.actions && <div className="mt-2 border-t border-gray-700 pt-2 flex gap-2">{msg.actions.map(a => <button key={a.label} onClick={a.action} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">{a.label}</button>)}</div>}
                                                <p className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleChatSubmit} className="relative">
                                    <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400" title="Attach file (multimodal input)">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 1110.53 9.53l3.454-3.552a.75.75 0 011.06 1.06l-3.453 3.552a1.125 1.125 0 001.591 1.59l3.455-3.553a3 3 0 000-4.242z" clipRule="evenodd" /></svg>
                                    </button>
                                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask AI... (e.g., 'analyze BTC on-chain data')" className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" />
                                    <button type="submit" disabled={isAiThinking} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                                        {isAiThinking ? 
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            :
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                        }
                                    </button>
                                </form>
                            </Card>
                        </div>
                    </div>
                )}

                {/* HFT Terminal View */}
                {activeTab === 'hft-terminal' && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-3">
                            <Card title="Trade Execution" className="h-full">
                                <div className="space-y-4">
                                    <div><label className="text-xs text-gray-400">Pair</label><input type="text" value={hftPair} onChange={e => setHftPair(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 text-white" /></div>
                                    <div className="grid grid-cols-2 gap-2"><button onClick={() => setHftSide('BUY')} className={`p-2 rounded-md text-sm font-bold ${hftSide === 'BUY' ? 'bg-green-500' : 'bg-gray-700'}`}>BUY</button><button onClick={() => setHftSide('SELL')} className={`p-2 rounded-md text-sm font-bold ${hftSide === 'SELL' ? 'bg-red-500' : 'bg-gray-700'}`}>SELL</button></div>
                                    <div className="grid grid-cols-2 gap-2"><button onClick={() => setHftOrderType('LIMIT')} className={`p-2 rounded-md text-xs ${hftOrderType === 'LIMIT' ? 'bg-cyan-600' : 'bg-gray-700'}`}>LIMIT</button><button onClick={() => setHftOrderType('MARKET')} className={`p-2 rounded-md text-xs ${hftOrderType === 'MARKET' ? 'bg-cyan-600' : 'bg-gray-700'}`}>MARKET</button></div>
                                    {hftOrderType === 'LIMIT' && <div><label className="text-xs text-gray-400">Price</label><input type="text" value={hftPrice} onChange={e => setHftPrice(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 text-white" /></div>}
                                    <div><label className="text-xs text-gray-400">Amount</label><input type="text" value={hftAmount} onChange={e => setHftAmount(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 text-white" /></div>
                                    <button className={`w-full p-3 rounded-md font-bold text-white ${hftSide === 'BUY' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>Place Order</button>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <Card title={`Price Chart: ${hftPair}`} subtitle="Real-time data feed (1ms latency)">
                                <div className="h-96 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={priceChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <defs><linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                            <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                                            <Area type="monotone" dataKey="price" stroke="#06b6d4" fillOpacity={1} fill="url(#colorPrice)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-12 lg:col-span-3">
                            <Card title="AI Trading Bots" className="h-full">
                                <div className="space-y-3">
                                    {aiTradingBots.map(bot => (
                                        <div key={bot.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${bot.status === 'active' ? 'bg-green-500' : bot.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                                                    <span className="font-bold text-sm">{bot.name}</span>
                                                </div>
                                                <span className={`text-xs font-bold ${bot.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{bot.pnl >= 0 ? '+' : ''}${bot.pnl.toFixed(2)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{bot.strategy} Strategy</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Quantum Analytics View */}
                {activeTab === 'quantum-analytics' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Quantum Entanglement Signal Processor" subtitle="Monitoring subspace for alpha signals">
                            <div className="h-96 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={quantumEntanglementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                                            <linearGradient id="colorNoise" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6b7280" stopOpacity={0.5}/><stop offset="95%" stopColor="#6b7280" stopOpacity={0}/></linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                        <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#374151" />
                                        <CartesianGrid strokeDasharray="1 5" stroke="#374151" />
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                                        <Area type="monotone" dataKey="signal" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSignal)" />
                                        <Area type="monotone" dataKey="noise" stroke="#6b7280" fillOpacity={0.5} fill="url(#colorNoise)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                )}

                {/* On-Chain Forensics View */}
                {activeTab === 'on-chain-forensics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card title="Transaction Visualizer">
                                <div className="h-96 flex items-center justify-center bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                                    <p className="text-gray-500">Transaction graph will be rendered here.</p>
                                </div>
                            </Card>
                        </div>
                        <div>
                            <Card title="Wallet Profiler">
                                <div className="space-y-4">
                                    <input type="text" placeholder="Enter wallet address or ENS..." className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white" />
                                    <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-md">Profile Wallet</button>
                                    <div className="border-t border-gray-700 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Risk Score:</span><span className="text-green-400 font-bold">12 (Low)</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Associated with CEX:</span><span className="text-white">Yes</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400">Interaction with Mixers:</span><span className="text-red-400 font-bold">No</span></div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Global Macro View */}
                {activeTab === 'global-macro' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card title="S&P 500">
                            <h3 className="text-3xl font-bold text-white mt-2">{globalMacroData.sp500.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.sp500.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.sp500.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.sp500.change.toFixed(2)}%</p>
                        </Card>
                        <Card title="US Dollar Index (DXY)">
                            <h3 className="text-3xl font-bold text-white mt-2">{globalMacroData.dxy.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.dxy.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.dxy.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.dxy.change.toFixed(2)}%</p>
                        </Card>
                        <Card title="Gold (XAU/USD)">
                            <h3 className="text-3xl font-bold text-white mt-2">${globalMacroData.gold.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.gold.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.gold.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.gold.change.toFixed(2)}%</p>
                        </Card>
                        <Card title="Crude Oil (WTI)">
                            <h3 className="text-3xl font-bold text-white mt-2">${globalMacroData.oil.value.toFixed(2)}</h3>
                            <p className={`text-sm font-bold ${globalMacroData.oil.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{globalMacroData.oil.change >= 0 ? 'â–²' : 'â–¼'} {globalMacroData.oil.change.toFixed(2)}%</p>
                        </Card>
                        <div className="md:col-span-2 lg:col-span-4">
                            <Card title="Geopolitical Risk Index">
                                <div className="flex items-center gap-6 pt-4">
                                    <div className="text-5xl font-bold text-orange-400">{globalMacroData.geopoliticalRiskIndex}</div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-300 mb-2">AI-driven index based on global news sentiment, military movements, and diplomatic relations.</p>
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-gradient-to-r from-yellow-500 to-red-600 h-2.5 rounded-full" style={{ width: `${globalMacroData.geopoliticalRiskIndex}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* NFT Valuation View */}
                {activeTab === 'nft-valuation' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Digital Asset Gallery</h2>
                            <div className="flex gap-2"><span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">Total Items: {nftAssets.length}</span><span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">Est. Value: 12.4 ETH</span></div>
                        </div>
                        {nftAssets.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {nftAssets.map(nft => (
                                    <div key={nft.id} className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1">
                                        <div className="relative aspect-square overflow-hidden"><img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /><div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10"><span className="text-xs font-bold text-white">#{nft.id.substring(0, 4)}</span></div></div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-white truncate">{nft.name}</h3><p className="text-xs text-gray-500 font-mono truncate mb-4">{nft.contractAddress}</p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-sm"><span className="text-gray-400">Floor Price</span><span className="text-white font-medium">0.45 ETH</span></div>
                                                <div className="flex justify-between items-center text-sm"><span className="text-gray-400">AI Valuation</span><span className="text-cyan-400 font-bold">0.52 ETH</span></div>
                                                <div className="w-full bg-gray-700 rounded-full h-1 mt-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full" style={{ width: '75%' }}></div></div>
                                                <p className="text-[10px] text-gray-500 text-right">High Liquidity Demand</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-800/30 rounded-3xl border border-dashed border-gray-700"><div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4"><span className="text-3xl opacity-50">ðŸ–¼ï¸ </span></div><h3 className="text-xl font-bold text-white">No Assets Detected</h3><p className="text-gray-500 mt-2">Connect a wallet containing NFTs to view AI valuations.</p></div>
                        )}
                    </div>
                )}

                {/* DeFi Bridge View */}
                {activeTab === 'defi-bridge' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card title="Cross-Chain Bridge"><div className="space-y-6 py-4"><div className="bg-gray-900 p-4 rounded-xl border border-gray-700"><label className="text-xs text-gray-500 uppercase font-bold">From Network</label><div className="flex items-center justify-between mt-2"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gray-700"></div><span className="text-white font-bold">Ethereum Mainnet</span></div><span className="text-gray-400">â–¼</span></div></div><div className="flex justify-center -my-3 relative z-10"><div className="bg-gray-800 p-2 rounded-full border border-gray-600"><span className="text-white">â†“</span></div></div><div className="bg-gray-900 p-4 rounded-xl border border-gray-700"><label className="text-xs text-gray-500 uppercase font-bold">To Network</label><div className="flex items-center justify-between mt-2"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-purple-600"></div><span className="text-white font-bold">Polygon PoS</span></div><span className="text-gray-400">â–¼</span></div></div><button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-colors">Initiate Bridge Transfer</button></div></Card>
                        <Card title="Yield Farming Opportunities"><div className="space-y-4">{[1, 2, 3].map(i => (<div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-500/50 transition-colors cursor-pointer"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div><div><h4 className="text-white font-bold">USDC / ETH LP</h4><p className="text-xs text-gray-400">Uniswap V3</p></div></div><div className="text-right"><p className="text-green-400 font-bold text-lg">12.4% APY</p><p className="text-xs text-gray-500">TVL: $450M</p></div></div>))}</div></Card>
                    </div>
                )}

                {/* Governance View */}
                {activeTab === 'governance' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card title="Active Governance Proposals">
                                <div className="space-y-4">
                                    {governanceProposals.map(p => (
                                        <div key={p.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3"><span className="text-2xl">{p.protocolIcon}</span><h4 className="font-bold text-white">{p.title}</h4></div>
                                                    <p className="text-xs text-gray-400 mt-1">Protocol: {p.protocol}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>{p.status}</span>
                                            </div>
                                            {p.status === 'active' && !p.userVote && <div className="flex gap-2 mt-4 border-t border-gray-700 pt-3"><button className="text-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-md">Vote For</button><button className="text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-md">Vote Against</button><button className="text-sm bg-gray-600/50 hover:bg-gray-600/80 text-gray-300 px-4 py-2 rounded-md">Abstain</button></div>}
                                            {p.userVote && <p className="text-sm mt-3 text-cyan-400">You voted: <span className="font-bold uppercase">{p.userVote}</span></p>}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                        <div><Card title="Voting Power"><h3 className="text-4xl font-bold text-white mt-2">1,240.5 <span className="text-lg text-gray-400">VP</span></h3><p className="text-xs text-gray-500 mt-2">Aggregated from held governance tokens.</p></Card></div>
                    </div>
                )}

                {/* Security Center View */}
                {activeTab === 'security' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card title="Threat Analysis Center">
                            <div className="space-y-4">
                                <label className="text-sm font-bold">AI Smart Contract Auditor</label>
                                <div className="flex gap-2"><input type="text" placeholder="Paste contract address..." className="flex-grow bg-gray-800 border border-gray-700 rounded-md p-2 text-white" /><button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-md">Scan</button></div>
                                <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg"><h4 className="text-green-400 font-bold">Scan Result: No Vulnerabilities Detected</h4><p className="text-xs text-green-400/70 mt-1">Contract code appears safe based on 4,096 simulation runs.</p></div>
                            </div>
                        </Card>
                        <Card title="Active Security Shields">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"><span className="text-white font-medium">Phishing Protection</span><span className="text-green-400 text-sm font-bold">ACTIVE</span></div>
                                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"><span className="text-white font-medium">Rugpull Prediction</span><span className="text-green-400 text-sm font-bold">ACTIVE</span></div>
                                <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"><span className="text-white font-medium">Transaction Obfuscation</span><span className="text-gray-500 text-sm font-bold">DISABLED</span></div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* AI Model Config View */}
                {activeTab === 'ai-model-config' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="AI Core Configuration" subtitle="Fine-tune the behavior of the Nexus AI">
                            <div className="space-y-6 pt-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-300">Active Model</label>
                                    <p className="text-xs text-gray-500 mb-2">Gemini 2.5 Pro offers advanced reasoning, while Flash is optimized for speed.</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setAiModel('gemini-2.5-pro')} className={`flex-1 p-3 rounded-md text-sm font-bold transition-colors ${aiModel === 'gemini-2.5-pro' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>Gemini 2.5 Pro</button>
                                        <button onClick={() => setAiModel('gemini-2.5-flash')} className={`flex-1 p-3 rounded-md text-sm font-bold transition-colors ${aiModel === 'gemini-2.5-flash' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>Gemini 2.5 Flash</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-300">System Instruction</label>
                                    <p className="text-xs text-gray-500 mb-2">Define the AI's persona and core directives.</p>
                                    <textarea 
                                        value={systemInstruction}
                                        onChange={e => setSystemInstruction(e.target.value)}
                                        rows={4}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-300">Thinking Budget</label>
                                    <p className="text-xs text-gray-500 mb-2">Allow the AI extra processing time for higher quality responses. Disabling results in faster, potentially less nuanced answers.</p>
                                    <div onClick={() => setThinkingBudget(!thinkingBudget)} className="cursor-pointer flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                                        <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${thinkingBudget ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                                            <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${thinkingBudget ? 'translate-x-6' : 'translate-x-1'}`}></span>
                                        </div>
                                        <span className="font-bold text-white">{thinkingBudget ? 'Enabled' : 'Disabled (Zero Budget)'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card title="Configuration Impact Analysis">
                            <div className="text-center py-10">
                                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10">
                                    <span className="text-4xl">ðŸ§ </span>
                                </div>
                                <h3 className="text-xl font-bold text-white">Live AI Monitoring</h3>
                                <p className="text-gray-400 mt-2">Your changes will be applied in real-time.</p>
                                <div className="mt-6 space-y-3 text-left max-w-sm mx-auto font-mono text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Model:</span> <span className="text-cyan-400">{aiModel}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Thinking:</span> <span className="text-cyan-400">{thinkingBudget ? 'ON' : 'OFF'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Est. Latency:</span> <span className="text-cyan-400">{aiModel === 'gemini-2.5-pro' && thinkingBudget ? '~1.5s' : '~0.2s'}</span></div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Modals */}
            {renderWalletModal()}
            {renderStripeModal()}
        </div>
    );
};

export default CryptoView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CryptoView (2).tsx
================================================================================

import React from 'react';
import { useQuery } from 'react-query'; // Standardized state management (Instruction 2)

// --- REFACTOR RATIONALE ---
// 1. ELIMINATED FLAWED COMPONENT: The original content was a massive, insecure form designed
//    to accept and submit 200+ sensitive API keys directly from the frontend, violating core
//    security principles (Instruction 1). This entire pattern is removed.
// 2. MVP FOCUS: The component is now refactored to align with the chosen MVP scope (Financial
//    Dashboard/Treasury Automation). As its name is CryptoView, it now displays aggregated
//    cryptocurrency balances relevant for treasury management.
// 3. SECURITY REPLACEMENT: API key management is assumed to be handled securely on the
//    backend via AWS Secrets Manager or Vault (Instruction 3). Frontend components only fetch
//    data via secure, authenticated endpoints using a standardized query library.
// 4. STYLE UNIFICATION: Switched to standard component structure using presumed Tailwind CSS classes.
// ----------------------------

// Mock Data Types (should be generated from backend schema validation, Instruction 4)
interface CryptoAsset {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  source: string; // e.g., 'Binance', 'Coinbase'
}

/**
 * Mock function to simulate fetching aggregated crypto treasury data.
 * In a production system, this would call a secure, unified backend service.
 */
const mockFetchCryptoData = async (): Promise<CryptoAsset[]> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800)); 
  
  // Placeholder data relevant to a business treasury system
  return [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 1.503,
      usdValue: 98120.45,
      change24h: 3.45,
      source: 'Coinbase Custody',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 15.2,
      usdValue: 56780.00,
      change24h: -1.12,
      source: 'Binance Treasury',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 250000.00,
      usdValue: 250000.00,
      change24h: 0.00,
      source: 'Off-Chain Ledger',
    },
  ];
};

const CryptoView: React.FC = () => {
  // Use React Query for robust asynchronous state handling (Instruction 2)
  const { data: assets, isLoading, isError, error } = useQuery<CryptoAsset[], Error>(
    'cryptoTreasuryData',
    mockFetchCryptoData,
    {
      staleTime: 60000, // Data considered fresh for 1 minute
      retry: 3,        // Retry failed queries
    }
  );

  if (isLoading) {
    return (
      <div className="p-8 bg-white shadow-xl rounded-lg h-96 flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl text-gray-600">Loading Crypto Treasury Data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Error Loading Crypto Data</h2>
        <p>Could not fetch assets: {error?.message}. Please check API connector health.</p>
        <p className="text-sm mt-2">Data acquisition failure indicates an issue with the secure backend API integration framework (Instruction 4).</p>
      </div>
    );
  }

  const totalValue = assets?.reduce((sum, asset) => sum + asset.usdValue, 0) || 0;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Crypto Treasury Overview</h1>
      <p className="text-gray-500 mb-6">Real-time aggregated balances sourced securely from exchanges and custody partners.</p>

      <div className="bg-white p-6 shadow-xl rounded-lg mb-6 border-l-4 border-indigo-500">
        <p className="text-sm font-medium text-gray-500">Total Crypto Treasury Value (USD)</p>
        <p className="text-4xl font-extrabold text-indigo-600 mt-1">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>

      <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">USD Value</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">24h Change</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source/Custodian</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets?.map((asset) => (
              <tr key={asset.symbol} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {asset.symbol} <span className="text-xs text-gray-500 ml-1">({asset.name})</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">
                  ${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    asset.change24h >= 0 
                      ? (asset.change24h === 0 ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800')
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {asset.change24h > 0 ? '↑' : asset.change24h < 0 ? '↓' : ''} {Math.abs(asset.change24h).toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                  {asset.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="mt-8 text-sm text-gray-400">
        Data refreshed every minute via the standardized API connector framework.
      </p>
    </div>
  );
};

export default CryptoView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CryptoView.tsx
================================================================================

import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset, EIP6963ProviderDetail } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

/* ---------- Types ---------- */

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'neutral';
  message: string;
  confidence: number;
  timestamp: string;
}

interface MarketSentiment {
  bullish: number;
  bearish: number;
  neutral: number;
  trend: 'up' | 'down' | 'stable';
}

interface AIChatMessage {
  id: string;
  sender: 'user' | 'system';
  text: string;
  timestamp: Date;
}

/* ---------- Small Components ---------- */

const AIStatusBadge: React.FC<{ status: 'active' | 'learning' | 'processing' }> = ({ status }) => {
  const colors = {
    active: 'bg-green-500',
    learning: 'bg-blue-500',
    processing: 'bg-purple-500'
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700">
      <span className={`w-2 h-2 rounded-full animate-pulse ${colors[status]}`} />
      <span className="text-xs font-mono text-gray-300 uppercase">
        Neural Net: {status}
      </span>
    </div>
  );
};

const ConfidenceMeter: React.FC<{ score: number }> = ({ score }) => (
  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
    <div
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full"
      style={{ width: `${score}%` }}
    />
  </div>
);

/* ---------- Main Component ---------- */

const CryptoView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('CryptoView must be within DataProvider');

  /* âœ… SAFE DEFAULTS (THIS FIXES THE CRASH) */
  const {
    cryptoAssets = [],
    nftAssets = [],
    walletInfo,
    virtualCard,
    connectWallet,
    disconnectWallet,
    detectedProviders = [],
    issueCard,
    buyCrypto
  } = context;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'intelligence' | 'nft-valuation' | 'defi-bridge'>('dashboard');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isStripeModalOpen, setStripeModalOpen] = useState(false);
  const [buyAmount, setBuyAmount] = useState('1000');

  /* ---------- Derived Data ---------- */

  const portfolioAnalytics = useMemo(() => {
    const totalValue = cryptoAssets.reduce(
      (acc: number, asset: CryptoAsset) => acc + asset.value,
      0
    );

    return {
      totalValue,
      riskScore: Math.min(100, Math.max(0, 100 - totalValue / 1000)),
      diversificationIndex: cryptoAssets.length * 12.5,
      projectedYield: totalValue * 0.052,
      aiConfidence: 80 + (cryptoAssets.length % 15)
    };
  }, [cryptoAssets]);

  const marketSentiment: MarketSentiment = {
    bullish: 65,
    bearish: 25,
    neutral: 10,
    trend: 'up'
  };

  /* ---------- Render ---------- */

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">

      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NEXUS OS</h1>
        {walletInfo ? (
          <button onClick={disconnectWallet} className="text-red-400">
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="bg-cyan-600 px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* ---------- DASHBOARD ---------- */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-8 space-y-6">

            <div className="grid grid-cols-3 gap-4">
              <Card title="Total Net Worth">
                <h3 className="text-3xl font-bold">
                  ${portfolioAnalytics.totalValue.toLocaleString()}
                </h3>
              </Card>

              <Card title="AI Risk Score">
                <h3 className="text-3xl font-bold">
                  {portfolioAnalytics.riskScore.toFixed(0)}/100
                </h3>
                <ConfidenceMeter score={portfolioAnalytics.riskScore} />
              </Card>

              <Card title="Projected Yield">
                <h3 className="text-3xl font-bold">
                  ${portfolioAnalytics.projectedYield.toFixed(2)}
                </h3>
              </Card>
            </div>

            {/* âœ… FIXED RECHARTS HEIGHT */}
            <Card title="Asset Allocation">
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={cryptoAssets}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                    >
                      {cryptoAssets.map((a, i) => (
                        <Cell key={i} fill={a.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>

          <div className="col-span-4 space-y-6">
            <Card title="Market Sentiment">
              <p className="text-green-400">
                Bullish: {marketSentiment.bullish}%
              </p>
              <p className="text-red-400">
                Bearish: {marketSentiment.bearish}%
              </p>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
};

export default CryptoView;