// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/TheVisionView.tsx
================================================================================

// components/views/platform/TheVisionView.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef, FC, ReactNode } from 'react';
import Card from '../../Card';

// --- START: ADVANCED UTILITY TYPES AND INTERFACES ---
// To simulate a real-world enterprise application, we need robust and detailed typing for our data models.

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'BTC' | 'ETH' | 'SOL';

export interface FinancialAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit_card' | 'crypto' | 'loan';
  subtype?: 'student' | 'mortgage' | 'auto';
  provider: 'Plaid' | 'Stripe' | 'Coinbase' | 'Internal' | 'Marqeta' | 'Modern Treasury';
  balance: number;
  currency: Currency;
  lastUpdated: string;
  creditLimit?: number;
  apr?: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  currency: Currency;
  timestamp: string;
  category: string;
  status: 'pending' | 'posted' | 'failed' | 'cleared';
  paymentChannel: 'online' | 'in-store' | 'p2p' | 'ach' | 'wire';
  isRecurring: boolean;
  location?: {
    city: string;
    country: string;
  };
  merchant: {
    name: string;
    logoUrl?: string;
  };
}

export interface InvestmentHolding {
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  value: number;
  changePercent24hr: number;
  assetClass: 'equity' | 'etf' | 'fixed-income' | 'crypto';
  costBasis?: number;
}

export interface CryptoHolding extends InvestmentHolding {
  blockchain: 'Bitcoin' | 'Ethereum' | 'Solana';
  assetClass: 'crypto';
}

export interface NFT {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  floorPrice: number;
  currency: 'ETH' | 'SOL';
  lastSalePrice?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  financialGoals: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  settings: {
    theme: 'dark' | 'light';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    }
  };
  security: {
    twoFactorEnabled: boolean;
    lastLogin: string;
  };
}

export interface IncubatorProject {
  id: string;
  name: string;
  description: string;
  founder: string;
  fundingGoal: number;
  fundingRaised: number;
  stage: 'idea' | 'prototype' | 'mvp' | 'scaling';
  milestones: { description: string; completed: boolean; dueDate: string }[];
  pitchDeckUrl?: string;
  investorCount: number;
}

export interface AdCampaign {
  id:string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targetAudience: {
    ageRange: [number, number];
    interests: string[];
    locations: string[];
  };
  performance: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    cpa: number; // Cost Per Acquisition
    roas: number; // Return On Ad Spend
  };
  creatives: { id: string, type: 'image' | 'video', url: string, performance_score: number }[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string | ReactNode;
  timestamp: string;
  metadata?: {
    component?: ReactNode;
    isActionable?: boolean;
  };
}

export interface EconomicScenario {
  id: string;
  name: string;
  description: string;
  parameters: {
    marketChange: number; // e.g., -0.1 for -10%
    interestRateChange: number; // e.g., 0.01 for +1%
    inflationChange: number; // e.g., 0.02 for +2%
  };
}

// --- END: ADVANCED UTILITY TYPES AND INTERFACES ---

// --- START: ADVANCED MOCK DATA GENERATORS ---
// In a real application, this data would come from various microservices. Here, we simulate it with high fidelity.

export const generateMockTransactions = (count: number, accountId: string): Transaction[] => {
    const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transport', 'Shopping', 'Dining', 'Health', 'Income'];
    const merchants = [
        { name: 'Whole Foods' }, { name: 'PG&E' }, { name: 'Netflix' }, { name: 'Uber' }, 
        { name: 'Amazon' }, { name: 'Starbucks' }, { name: 'CVS Pharmacy' }, { name: 'Salary Deposit' }
    ];
    const statuses: ('pending' | 'posted' | 'failed' | 'cleared')[] = ['posted', 'posted', 'posted', 'cleared', 'pending'];
    const channels: ('online' | 'in-store' | 'p2p' | 'ach' | 'wire')[] = ['in-store', 'online', 'online', 'in-store', 'ach'];
    
    return Array.from({ length: count }, (_, i) => {
        const isIncome = (i % merchants.length) === 7;
        return {
            id: `txn_${accountId}_${i}_${Date.now()}`,
            accountId,
            description: `${merchants[i % merchants.length].name} ${isIncome ? '' : 'Purchase'}`,
            amount: isIncome ? (Math.random() * 2000 + 3000) : -(Math.random() * 200 + 5),
            currency: 'USD',
            timestamp: new Date(Date.now() - i * 3600 * 1000 * 18).toISOString(),
            category: categories[i % categories.length],
            status: statuses[i % statuses.length],
            merchant: merchants[i % merchants.length],
            paymentChannel: channels[i % channels.length],
            isRecurring: i % 5 === 0, // Every 5th transaction is recurring
        };
    });
};

export const mockUserProfile: UserProfile = {
    id: 'user_123',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    avatarUrl: `https://i.pravatar.cc/150?u=alexjohnson`,
    financialGoals: ['Save for a house down payment', 'Start a side business', 'Invest for retirement'],
    riskTolerance: 'medium',
    settings: {
        theme: 'dark',
        notifications: { email: true, push: true, sms: false }
    },
    security: {
        twoFactorEnabled: true,
        lastLogin: new Date().toISOString()
    }
};

export const mockAccounts: FinancialAccount[] = [
    { id: 'acc_plaid_1', name: 'Chase Checking', type: 'checking', provider: 'Plaid', balance: 12540.32, currency: 'USD', lastUpdated: new Date().toISOString() },
    { id: 'acc_plaid_2', name: 'Wells Fargo Savings', type: 'savings', provider: 'Plaid', balance: 85200.50, currency: 'USD', lastUpdated: new Date().toISOString() },
    { id: 'acc_stripe_1', name: 'Stripe Balance', type: 'checking', provider: 'Stripe', balance: 5321.10, currency: 'USD', lastUpdated: new Date().toISOString() },
    { id: 'acc_crypto_1', name: 'Ethereum Wallet', type: 'crypto', provider: 'Coinbase', balance: 3.5, currency: 'ETH', lastUpdated: new Date().toISOString() },
    { id: 'acc_crypto_2', name: 'Bitcoin Wallet', type: 'crypto', provider: 'Internal', balance: 0.75, currency: 'BTC', lastUpdated: new Date().toISOString() },
];

export const mockTradFiHoldings: InvestmentHolding[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', quantity: 50, price: 175.20, value: 8760, changePercent24hr: 1.25, assetClass: 'equity' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 20, price: 140.50, value: 2810, changePercent24hr: -0.5, assetClass: 'equity' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 30, price: 330.00, value: 9900, changePercent24hr: 2.1, assetClass: 'equity' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', quantity: 100, price: 220.75, value: 22075, changePercent24hr: 0.8, assetClass: 'etf' },
];

export const mockCryptoHoldings: CryptoHolding[] = [
    { symbol: 'ETH', name: 'Ethereum', quantity: 3.5, price: 2000, value: 7000, changePercent24hr: 3.5, blockchain: 'Ethereum', assetClass: 'crypto' },
    { symbol: 'BTC', name: 'Bitcoin', quantity: 0.75, price: 30000, value: 22500, changePercent24hr: -1.2, blockchain: 'Bitcoin', assetClass: 'crypto' },
    { symbol: 'SOL', name: 'Solana', quantity: 150, price: 25, value: 3750, changePercent24hr: 5.8, blockchain: 'Solana', assetClass: 'crypto' },
];

export const mockNFTs: NFT[] = [
    { id: 'nft_1', name: 'CryptoPunk #7804', collection: 'CryptoPunks', imageUrl: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1N_oWsGD8cVfoUZ3JyZWg?auto=format&w=1000', floorPrice: 68.9, currency: 'ETH', lastSalePrice: 4200 },
    { id: 'nft_2', name: 'Bored Ape #8817', collection: 'Bored Ape Yacht Club', imageUrl: 'https://i.seadn.io/gae/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTcCuaMTZxvNBunLVBqK6yqY5e55Ln5M5?auto=format&w=1000', floorPrice: 35.5, currency: 'ETH', lastSalePrice: 1080.69 },
];

export const mockIncubatorProjects: IncubatorProject[] = [
    { id: 'proj_1', name: 'AI-Powered Personal Chef', description: 'A subscription service that uses AI to create personalized weekly meal plans and delivers pre-portioned ingredients.', founder: 'Maria Garcia', fundingGoal: 50000, fundingRaised: 27500, stage: 'prototype', investorCount: 12, milestones: [{description: 'Develop recipe generation AI', completed: true, dueDate: '2024-02-15'}, {description: 'Launch beta website', completed: false, dueDate: '2024-04-30'}, {description: 'Secure supplier partnerships', completed: false, dueDate: '2024-06-01'}] },
    { id: 'proj_2', name: 'Decentralized Social Media', description: 'A Web3 social network where users own their data and content, built on the Ethereum blockchain.', founder: 'Kenji Tanaka', fundingGoal: 250000, fundingRaised: 180000, stage: 'mvp', investorCount: 45, milestones: [{description: 'Smart contract audit', completed: true, dueDate: '2024-01-20'}, {description: 'Mobile app launch (iOS/Android)', completed: true, dueDate: '2024-03-10'}, {description: 'Reach 10,000 active users', completed: false, dueDate: '2024-07-01'}]},
    { id: 'proj_3', name: 'Sustainable Packaging Solutions', description: 'Creating biodegradable packaging from agricultural waste to reduce plastic pollution.', founder: 'Aisha Bello', fundingGoal: 100000, fundingRaised: 15000, stage: 'idea', investorCount: 3, milestones: [{description: 'Finalize material composition', completed: false, dueDate: '2024-05-15'}, {description: 'Create working prototype', completed: false, dueDate: '2024-08-01'}]},
];

export const mockAdCampaigns: AdCampaign[] = [
    { id: 'camp_1', name: 'Spring Sale 2024', status: 'active', budget: 5000, spent: 2345.67, startDate: '2024-03-01', endDate: '2024-03-31', targetAudience: { ageRange: [25, 45], interests: ['finance', 'technology'], locations: ['USA', 'Canada']}, performance: { impressions: 150234, clicks: 7512, ctr: 5.00, conversions: 312, cpa: 7.52, roas: 4.2 }, creatives: [{ id: 'c1', type: 'image', url: '', performance_score: 8.5 }]},
    { id: 'camp_2', name: 'New Feature Launch', status: 'completed', budget: 10000, spent: 9876.54, startDate: '2024-02-01', endDate: '2024-02-28', targetAudience: { ageRange: [18, 35], interests: ['startups', 'crypto'], locations: ['Global']}, performance: { impressions: 450123, clicks: 18005, ctr: 4.00, conversions: 950, cpa: 10.39, roas: 5.1 }, creatives: [{ id: 'c2', type: 'video', url: '', performance_score: 9.1 }]},
];

export const mockScenarios: EconomicScenario[] = [
    { id: 'scn_1', name: 'Recession', description: 'Simulates a moderate economic downturn.', parameters: { marketChange: -0.15, interestRateChange: -0.01, inflationChange: -0.02 }},
    { id: 'scn_2', name: 'Bull Market', description: 'Simulates a strong economic growth period.', parameters: { marketChange: 0.20, interestRateChange: 0.005, inflationChange: 0.015 }},
    { id: 'scn_3', name: 'Stagflation', description: 'Simulates high inflation with stagnant growth.', parameters: { marketChange: -0.05, interestRateChange: 0.02, inflationChange: 0.05 }},
];
// --- END: ADVANCED MOCK DATA GENERATORS ---

// --- START: ADVANCED UTILITY FUNCTIONS ---

export const formatCurrency = (amount: number, currency: Currency = 'USD', decimals = 2) => {
    if (['BTC', 'ETH', 'SOL'].includes(currency)) {
        return `${amount.toFixed(4)} ${currency}`;
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount);
};

export const simulateApiCall = <T,>(data: T, delay: number = 1000): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const classNames = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
};

export const groupTransactionsByCategory = (transactions: Transaction[]) => {
    return transactions.reduce((acc, tx) => {
        if (tx.amount < 0) { // Only group expenses
            acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
        }
        return acc;
    }, {} as Record<string, number>);
};

// --- END: ADVANCED UTILITY FUNCTIONS ---

// --- START: NEW REUSABLE UI COMPONENTS (within this file) ---

export const LoadingSpinner: FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
    return (
        <div className="flex justify-center items-center p-4">
            <div className={`${sizeClasses[size]} border-4 border-t-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin`}></div>
        </div>
    );
};

export const ProgressBar: FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
            className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
    </div>
);

export const Tab: FC<{ children: ReactNode; isActive: boolean; onClick: () => void }> = ({ children, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={classNames(
            'px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-all duration-200',
            isActive
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
        )}
    >
        {children}
    </button>
);

export const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center animate-fade-in-fast" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const DonutChart: FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
    let cumulative = 0;

    return (
        <div className="flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-48 h-48">
                <circle cx="18" cy="18" r="15.9154943092" fill="transparent" stroke="#374151" strokeWidth="3"></circle>
                {data.map(item => {
                    const percentage = (item.value / total) * 100;
                    const offset = 25 - cumulative;
                    cumulative += percentage;
                    return (
                        <circle
                            key={item.label}
                            cx="18" cy="18" r="15.9154943092"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="3"
                            strokeDasharray={`${percentage} ${100 - percentage}`}
                            strokeDashoffset={offset}
                            transform="rotate(-90 18 18)"
                            className="transition-all duration-500 ease-out"
                        />
                    );
                })}
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-xl font-bold text-white">{formatCurrency(total)}</span>
            </div>
        </div>
    );
};


// --- END: NEW REUSABLE UI COMPONENTS ---


// --- START: DETAILED SUB-COMPONENTS FOR VISION PILLARS ---

export const AIPartnerSection: FC = () => {
    const [messages, setMessages] = useState<AIMessage[]>([
        { id: '1', sender: 'ai', text: 'Hello! I am your financial co-pilot. How can I assist you today? Try asking me to "design a bank card", "generate a business plan idea", or "analyze my spending".', timestamp: new Date().toISOString() },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent, prompt?: string) => {
        e.preventDefault();
        const query = prompt || input;
        if (!query.trim() || isTyping) return;

        const userMessage: AIMessage = { id: `msg_${Date.now()}`, sender: 'user', text: query, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate API call to Gemini
        await simulateApiCall(null, 1500);

        let aiResponseText: string | ReactNode = "I'm sorry, I can only respond to a few specific prompts in this demo.";
        let metadata: AIMessage['metadata'] = {};
        const lowerInput = query.toLowerCase();

        if (lowerInput.includes('design') && lowerInput.includes('card')) {
            aiResponseText = "Of course! Here is a unique card design generated just for you, inspired by 'Quantum Waves':";
            metadata.component = (
                <div className="w-64 h-40 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 rounded-xl p-4 flex flex-col justify-between shadow-lg border border-purple-500/30">
                    <div className="flex justify-between items-center"><div className="w-8 h-6 bg-yellow-400 rounded-sm"></div><span className="text-white font-mono text-xs italic">QuantumWeaver</span></div>
                    <div className="text-white font-mono text-lg tracking-widest">4202 1337 2024 0069</div>
                    <div className="flex justify-between items-end">
                        <div className="text-white"><p className="text-xs">ALEX JOHNSON</p><p className="text-xs font-mono">12/28</p></div>
                        <div className="text-3xl text-white font-bold italic">V</div>
                    </div>
                </div>
            );
        } else if (lowerInput.includes('business plan') || lowerInput.includes('idea')) {
            aiResponseText = "Excellent! Here is a lean business plan for a startup called 'ChronoCart':";
            metadata.component = (
                <div className="p-3 bg-gray-900/50 rounded-md border border-gray-700 text-sm">
                    <h4 className="font-bold text-cyan-400">ChronoCart: Hyper-Local Nostalgia Delivery</h4>
                    <p><strong className="text-gray-300">Problem:</strong> People miss snacks, drinks, and memorabilia from their childhood or past locations.</p>
                    <p><strong className="text-gray-300">Solution:</strong> An app that uses a network of local couriers to source and deliver nostalgic items on-demand.</p>
                    <p><strong className="text-gray-300">Target Market:</strong> Millennials and Gen X in major urban centers.</p>
                    <p><strong className="text-gray-300">Monetization:</strong> Delivery fee + markup on items.</p>
                </div>
            );
        } else if (lowerInput.includes('analyze') && lowerInput.includes('spending')) {
            aiResponseText = "Certainly. Here is a breakdown of your spending habits for the last 30 days based on your linked accounts:";
            const spendingData = groupTransactionsByCategory(generateMockTransactions(50, 'combined'));
            const chartData = Object.entries(spendingData).map(([label, value], i) => ({
                label,
                value,
                color: ['#22d3ee', '#818cf8', '#a78bfa', '#f472b6', '#fb923c'][i % 5],
            }));
            metadata.component = <DonutChart data={chartData} />;
        }

        const aiMessage: AIMessage = { id: `msg_ai_${Date.now()}`, sender: 'ai', text: aiResponseText, timestamp: new Date().toISOString(), metadata };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
    };

    const suggestionChips = ["Analyze my spending", "Generate a business plan", "Design a credit card"];

    return (
        <Card variant="outline" className="mt-4 p-0">
            <div className="h-[32rem] flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={classNames('flex items-end gap-2', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                           {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex-shrink-0"></div>}
                            <div className={classNames('max-w-md rounded-lg px-4 py-2', msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-300 rounded-bl-none')}>
                                {typeof msg.text === 'string' ? <p>{msg.text}</p> : msg.text}
                                {msg.metadata?.component && <div className="mt-3">{msg.metadata.component}</div>}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex items-end gap-2 justify-start">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex-shrink-0"></div>
                            <div className="bg-gray-700 text-gray-300 rounded-lg px-4 py-2 rounded-bl-none">
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-700/60">
                    <div className="flex gap-2 mb-2">
                        {suggestionChips.map(chip => (
                            <button key={chip} onClick={(e) => handleSendMessage(e, chip)} disabled={isTyping} className="px-3 py-1 bg-gray-700/50 hover:bg-gray-700 text-xs text-gray-300 rounded-full transition-colors">
                                {chip}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage}>
                        <input
                            type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Chat with your financial co-pilot..."
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white"
                            disabled={isTyping}
                        />
                    </form>
                </div>
            </div>
        </Card>
    );
};

export const IntegrationDashboardSection: FC = () => {
    const [activeTab, setActiveTab] = useState<'plaid' | 'stripe' | 'marqeta' | 'modern-treasury'>('plaid');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const accountId = mockAccounts.find(a => a.provider.toLowerCase().replace(' ', '-') === activeTab)?.id || 'acc_plaid_1';
        const data = await simulateApiCall(generateMockTransactions(10, accountId), 800);
        setTransactions(data);
        setIsLoading(false);
    }, [activeTab]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        
        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th><th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Category</th><th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id} className="bg-gray-800/50 border-b border-gray-700/60 hover:bg-gray-700/50">
                                <td className="px-6 py-4">{new Date(tx.timestamp).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-white">{tx.description}</td>
                                <td className="px-6 py-4">{tx.category}</td>
                                <td className="px-6 py-4 text-white font-mono">{formatCurrency(tx.amount, tx.currency)}</td>
                                <td className="px-6 py-4"><span className={classNames('px-2 py-1 rounded-full text-xs font-semibold', tx.status === 'posted' || tx.status === 'cleared' ? 'bg-green-500/20 text-green-300' : tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300')}>{tx.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <Card variant="outline" className="mt-4">
             <div className="flex space-x-2 p-4 border-b border-gray-700/60">
                <Tab isActive={activeTab === 'plaid'} onClick={() => setActiveTab('plaid')}>Plaid</Tab>
                <Tab isActive={activeTab === 'stripe'} onClick={() => setActiveTab('stripe')}>Stripe</Tab>
                <Tab isActive={activeTab === 'marqeta'} onClick={() => setActiveTab('marqeta')}>Marqeta</Tab>
                <Tab isActive={activeTab === 'modern-treasury'} onClick={() => setActiveTab('modern-treasury')}>Modern Treasury</Tab>
            </div>
            <div className="p-4">
                <h4 className="text-lg font-semibold text-white mb-2 capitalize">{activeTab} Data Simulation</h4>
                <p className="text-sm text-gray-400 mb-4">This is a high-fidelity simulation of live transaction data from our enterprise partners, demonstrating real-time integration capabilities.</p>
                {renderContent()}
            </div>
        </Card>
    );
};

export const GrowthPlatformSection: FC = () => {
    const [activeTab, setActiveTab] = useState<'incubator' | 'ad-studio'>('incubator');
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="mt-4 flex space-x-2">
                <Tab isActive={activeTab === 'incubator'} onClick={() => setActiveTab('incubator')}>Quantum Weaver Incubator</Tab>
                <Tab isActive={activeTab === 'ad-studio'} onClick={() => setActiveTab('ad-studio')}>AI Ad Studio</Tab>
            </div>
            {activeTab === 'incubator' && (
                <Card variant="outline" className="mt-2">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-bold text-white">Featured Projects</h4>
                            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-500 transition">Apply for Funding</button>
                        </div>
                        <div className="space-y-6">
                            {mockIncubatorProjects.map(proj => (
                                <div key={proj.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                    <div className="flex justify-between items-start">
                                        <div><h5 className="text-lg font-semibold text-cyan-400">{proj.name}</h5><p className="text-sm text-gray-400">by {proj.founder}</p></div>
                                        <span className="text-xs font-mono px-2 py-1 bg-gray-700 rounded">{proj.stage}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-300">{proj.description}</p>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-400">Funding Progress</span>
                                            <span className="font-semibold text-white">{formatCurrency(proj.fundingRaised)} / {formatCurrency(proj.fundingGoal)}</span>
                                        </div>
                                        <ProgressBar progress={(proj.fundingRaised / proj.fundingGoal) * 100} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            )}
            {activeTab === 'ad-studio' && (
                 <Card variant="outline" className="mt-2">
                     <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-bold text-white">Your Ad Campaigns</h4>
                            <button className="px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-semibold hover:bg-cyan-500 transition">Create New Campaign</button>
                        </div>
                        <div className="space-y-4">
                            {mockAdCampaigns.map(camp => (
                                <div key={camp.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-semibold text-white">{camp.name}</h5>
                                        <span className={classNames('text-xs px-2 py-1 rounded-full', camp.status === 'active' && 'bg-green-500/20 text-green-300', camp.status === 'completed' && 'bg-gray-500/20 text-gray-300')}>{camp.status}</span>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div><p className="text-gray-400">Budget</p><p className="text-white font-mono">{formatCurrency(camp.budget)}</p></div>
                                        <div><p className="text-gray-400">ROAS</p><p className="text-white font-mono">{camp.performance.roas}x</p></div>
                                        <div><p className="text-gray-400">Impressions</p><p className="text-white font-mono">{camp.performance.impressions.toLocaleString()}</p></div>
                                        <div><p className="text-gray-400">Conversions</p><p className="text-white font-mono">{camp.performance.conversions.toLocaleString()}</p></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                 </Card>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Incubator Funding Application">
                <form className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-300">Project Name</label><input type="text" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white" /></div>
                    <div><label className="block text-sm font-medium text-gray-300">One-Liner Pitch</label><input type="text" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white" /></div>
                    <div><label className="block text-sm font-medium text-gray-300">Detailed Description</label><textarea rows={4} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"></textarea></div>
                    <div><label className="block text-sm font-medium text-gray-300">Funding Amount Requested (USD)</label><input type="number" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white" /></div>
                    <div className="pt-4 flex justify-end">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-semibold hover:bg-gray-500 transition mr-2">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-500 transition">Submit Application</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export const MultiRailFinanceSection: FC = () => {
    const [portfolioType, setPortfolioType] = useState<'tradfi' | 'web3'>('tradfi');
    const ethPrice = mockCryptoHoldings.find(c => c.symbol === 'ETH')?.price || 2000;
    
    const totalTradFiValue = useMemo(() => mockTradFiHoldings.reduce((acc, h) => acc + h.value, 0), []);
    const totalCryptoValue = useMemo(() => mockCryptoHoldings.reduce((acc, h) => acc + h.value, 0), []);
    const totalNFTValue = useMemo(() => mockNFTs.reduce((acc, n) => acc + (n.floorPrice * ethPrice), 0), [ethPrice]);
    const totalWeb3Value = totalCryptoValue + totalNFTValue;

    const renderHoldingsTable = (holdings: InvestmentHolding[]) => (
        <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                <tr>
                    <th scope="col" className="px-6 py-3">Asset</th><th scope="col" className="px-6 py-3 text-right">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-right">Price</th><th scope="col" className="px-6 py-3 text-right">Value</th>
                    <th scope="col" className="px-6 py-3 text-right">24h %</th>
                </tr>
            </thead>
            <tbody>
                {holdings.map(h => (
                    <tr key={h.symbol} className="bg-gray-800/50 border-b border-gray-700/60 hover:bg-gray-700/50">
                        <td className="px-6 py-4 font-medium text-white">{h.name} ({h.symbol})</td>
                        <td className="px-6 py-4 text-right font-mono">{h.quantity.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-mono">{formatCurrency(h.price)}</td>
                        <td className="px-6 py-4 text-right font-mono text-white">{formatCurrency(h.value)}</td>
                        <td className={classNames("px-6 py-4 text-right font-mono", h.changePercent24hr >= 0 ? 'text-green-400' : 'text-red-400')}>{h.changePercent24hr >= 0 ? '+' : ''}{h.changePercent24hr.toFixed(2)}%</td>
                    </tr>
                ))}
            </tbody>
        </table></div>
    );
    
    return (
        <Card variant="outline" className="mt-4 p-6">
            <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-white">Portfolio Overview</h4>
                <div className="flex space-x-1 p-1 bg-gray-900/50 rounded-lg">
                    <button onClick={() => setPortfolioType('tradfi')} className={classNames('px-3 py-1 text-sm rounded-md', portfolioType === 'tradfi' && 'bg-cyan-500/20 text-cyan-300')}>TradFi</button>
                    <button onClick={() => setPortfolioType('web3')} className={classNames('px-3 py-1 text-sm rounded-md', portfolioType === 'web3' && 'bg-indigo-500/20 text-indigo-300')}>Web3</button>
                </div>
            </div>
            <div className="mt-4 p-4 bg-gray-900/30 rounded-lg">
                <p className="text-gray-400 text-sm">{portfolioType === 'tradfi' ? 'Traditional Assets' : 'Digital Assets'} Value</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(portfolioType === 'tradfi' ? totalTradFiValue : totalWeb3Value)}</p>
            </div>
            <div className="mt-6">
                {portfolioType === 'tradfi' && (<div><h5 className="text-lg font-semibold text-white mb-2">Stock & ETF Holdings</h5>{renderHoldingsTable(mockTradFiHoldings)}</div>)}
                {portfolioType === 'web3' && (<div className="space-y-6">
                    <div><h5 className="text-lg font-semibold text-white mb-2">Cryptocurrency Holdings</h5>{renderHoldingsTable(mockCryptoHoldings)}</div>
                    <div><h5 className="text-lg font-semibold text-white mb-2">NFT Collection</h5><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mockNFTs.map(nft => (<div key={nft.id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                            <img src={nft.imageUrl} alt={nft.name} className="w-full h-40 object-cover" />
                            <div className="p-3"><p className="text-sm font-semibold text-white truncate">{nft.name}</p><p className="text-xs text-gray-400">{nft.collection}</p><p className="text-xs mt-2 text-gray-300">Floor: {nft.floorPrice} {nft.currency}</p></div>
                        </div>))}
                    </div></div>
                </div>)}
            </div>
        </Card>
    );
};

export const EconomicSynthesisEngineSection: FC = () => {
    const [selectedScenario, setSelectedScenario] = useState<EconomicScenario | null>(null);
    const [simulationResult, setSimulationResult] = useState<{ portfolioImpact: number; narrative: string } | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    const totalPortfolioValue = useMemo(() => {
        const tradFi = mockTradFiHoldings.reduce((acc, h) => acc + h.value, 0);
        const crypto = mockCryptoHoldings.reduce((acc, h) => acc + h.value, 0);
        return tradFi + crypto;
    }, []);

    const runSimulation = useCallback(async () => {
        if (!selectedScenario) return;
        setIsSimulating(true);
        setSimulationResult(null);

        // Complex simulation logic
        const { marketChange, interestRateChange, inflationChange } = selectedScenario.parameters;
        // Asset class sensitivities (beta values)
        const equityBeta = 1.2;
        const cryptoBeta = 2.5;
        const fixedIncomeSensitivity = -0.5;

        let impact = 0;
        mockTradFiHoldings.forEach(h => {
            if (h.assetClass === 'equity') impact += h.value * marketChange * equityBeta;
            if (h.assetClass === 'fixed-income') impact += h.value * interestRateChange * fixedIncomeSensitivity;
        });
        mockCryptoHoldings.forEach(h => {
            impact += h.value * marketChange * cryptoBeta;
        });
        
        // AI Narrative Generation (Simulated)
        await simulateApiCall(null, 2000);
        
        const percentageImpact = (impact / totalPortfolioValue) * 100;
        let narrative = `Under the "${selectedScenario.name}" scenario, your portfolio is projected to change by approximately ${formatCurrency(impact)} (${percentageImpact.toFixed(2)}%). `;
        if (impact < 0) {
            narrative += `The main driver of this downturn is the high sensitivity of your crypto and equity holdings to market fluctuations. Diversifying into assets less correlated with the market, such as commodities or alternative investments, could mitigate this risk.`;
        } else {
            narrative += `This positive projection is largely due to your significant holdings in high-growth assets like equities and crypto, which are expected to outperform in a bull market. Consider taking some profits to rebalance your portfolio and lock in gains.`;
        }

        setSimulationResult({ portfolioImpact: impact, narrative });
        setIsSimulating(false);
    }, [selectedScenario, totalPortfolioValue]);

    return (
        <Card variant="outline" className="mt-4 p-6">
            <h4 className="text-xl font-bold text-white">Economic Synthesis Engine</h4>
            <p className="text-sm text-gray-400 mt-1">Run predictive models against your portfolio to understand potential impacts from various economic scenarios.</p>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300">Select a Scenario</label>
                <select 
                    onChange={(e) => setSelectedScenario(mockScenarios.find(s => s.id === e.target.value) || null)}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-2"
                >
                    <option value="">-- Choose a simulation --</option>
                    {mockScenarios.map(s => <option key={s.id} value={s.id}>{s.name}: {s.description}</option>)}
                </select>
            </div>
            <button onClick={runSimulation} disabled={!selectedScenario || isSimulating} className="mt-4 w-full px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed">
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>

            {isSimulating && <LoadingSpinner />}
            {simulationResult && !isSimulating && (
                <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700 animate-fade-in">
                    <h5 className="font-semibold text-white">Simulation Results:</h5>
                    <div className="mt-2 text-center">
                        <p className="text-gray-400">Projected Portfolio Impact</p>
                        <p className={classNames('text-4xl font-bold', simulationResult.portfolioImpact >= 0 ? 'text-green-400' : 'text-red-400')}>
                            {simulationResult.portfolioImpact >= 0 ? '+' : ''}{formatCurrency(simulationResult.portfolioImpact)}
                        </p>
                    </div>
                    <div className="mt-4">
                        <h6 className="font-semibold text-cyan-400">AI-Generated Narrative Analysis:</h6>
                        <p className="text-sm text-gray-300 mt-1">{simulationResult.narrative}</p>
                    </div>
                </div>
            )}
        </Card>
    )
};


// --- END: DETAILED SUB-COMPONENTS FOR VISION PILLARS ---

const TheVisionView: React.FC = () => (
    <div className="space-y-8 text-gray-300 max-w-5xl mx-auto animate-fade-in p-4">
        <div className="text-center">
            <h1 className="text-5xl font-bold text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500 pb-2">
                The Winning Vision
            </h1>
            <p className="mt-4 text-lg text-gray-400">This is not a bank. It is a financial co-pilot for individuals and enterprises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Card variant="outline"><h3 className="text-xl font-semibold text-cyan-300">Hyper-Personalized</h3><p className="mt-2 text-sm">Every pixel, insight, and recommendation is tailored to your unique financial journey.</p></Card>
            <Card variant="outline"><h3 className="text-xl font-semibold text-cyan-300">Proactive & Predictive</h3><p className="mt-2 text-sm">We don't just show you the past; our AI anticipates your needs and guides your future.</p></Card>
            <Card variant="outline"><h3 className="text-xl font-semibold text-cyan-300">Platform for Growth</h3><p className="mt-2 text-sm">A suite of tools for creators, founders, and businesses to build their visions upon.</p></Card>
        </div>

        <div>
            <h2 className="text-3xl font-semibold text-white mb-4">Core Tenets in Action</h2>
            <ul className="space-y-8">
                <li className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/60">
                    <strong className="text-cyan-400 text-xl">The AI is a Partner, Not Just a Tool</strong>
                    <p className="mt-2 text-gray-400 text-sm">Our integration with Google's Gemini API is designed for collaboration. From co-creating your bank card's design to generating a business plan, the AI is a creative and strategic partner. Below is a live, interactive demo.</p>
                    <AIPartnerSection />
                </li>
                <li className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/60">
                    <strong className="text-cyan-400 text-xl">Seamless Integration is Reality</strong>
                    <p className="mt-2 text-gray-400 text-sm">We demonstrate enterprise-grade readiness with high-fidelity simulations of Plaid, Stripe, Marqeta, and Modern Treasury. This isn't a concept; it's a blueprint for a fully operational financial ecosystem. Explore the simulated data streams below.</p>
                    <IntegrationDashboardSection />
                </li>
                <li className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/60">
                    <strong className="text-cyan-400 text-xl">Finance is a Gateway, Not a Gatekeeper</strong>
                    <p className="mt-2 text-gray-400 text-sm">Features like the Quantum Weaver Incubator and the AI Ad Studio are designed to empower creation. We provide not just the capital, but the tools to build, market, and grow. Interact with our growth platform components.</p>
                    <GrowthPlatformSection />
                </li>
                <li className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/60">
                    <strong className="text-cyan-400 text-xl">The Future is Multi-Rail</strong>
                    <p className="mt-2 text-gray-400 text-sm">Our platform is fluent in both traditional finance (ISO 20022) and the decentralized future (Web3). The Crypto & Corporate hubs are designed to manage value, no matter how it's represented. View a unified portfolio below.</p>
                    <MultiRailFinanceSection />
                </li>
                 <li className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/60">
                    <strong className="text-cyan-400 text-xl">Proactive Economic Synthesis</strong>
                    <p className="mt-2 text-gray-400 text-sm">Move beyond reactive financial management. Our Synthesis Engine uses AI to model the future, allowing you to stress-test your financial strategy against complex economic scenarios and receive actionable, narrative-driven insights.</p>
                    <EconomicSynthesisEngineSection />
                </li>
            </ul>
        </div>
        <style>{`
            @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
        `}</style>
    </div>
);

export default TheVisionView;