// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/DashboardView.tsx
================================================================================

// components/views/personal/DashboardView.tsx
import React from 'react';
import { View } from '../../../types';

// Import the restored widget components
import BalanceSummary from '../../BalanceSummary';
import RecentTransactions from '../../RecentTransactions';
import InvestmentPortfolio from '../../InvestmentPortfolio';
import AIInsights from '../../AIInsights';
import ImpactTracker from '../../ImpactTracker';
import WealthTimeline from '../../WealthTimeline';

interface DashboardViewProps {
    setActiveView: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Personal Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-6">
                    <BalanceSummary />
                    <RecentTransactions setActiveView={setActiveView} />
                    <WealthTimeline />
                </div>
                {/* Side column */}
                <div className="space-y-6">
                    <InvestmentPortfolio />
                    <AIInsights />
                    <ImpactTracker />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/DashboardView.tsx
================================================================================

```typescript
// components/views/personal/DashboardView.tsx

// This component represents a highly advanced, AI-powered personal finance dashboard.
// It is designed to be a single, comprehensive file for demonstration purposes,
// showcasing a wide range of features, UI patterns, and best practices.

// DEPENDENCIES: This component assumes the following packages are installed:
// - react
// - react-dom
// - typescript
// - tailwindcss
// - recharts (for data visualization)
// - react-beautiful-dnd (for drag-and-drop functionality)

import React, { useState, useEffect, useMemo, useCallback, useReducer, createContext, useContext, useRef } from 'react';
import { View } from '../../../types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';


// SECTION 1: ADVANCED TYPES & INTERFACES
// =================================================================

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';
export type AccountType = 'checking' | 'savings' | 'investment' | 'credit_card' | 'loan' | 'real_estate' | 'crypto';
export type TransactionCategory = 'Groceries' | 'Utilities' | 'Rent' | 'Transportation' | 'Dining Out' | 'Shopping' | 'Health' | 'Entertainment' | 'Income' | 'Investment' | 'Other';
export type AssetClass = 'Stocks' | 'Bonds' | 'Real Estate' | 'Crypto' | 'Cash' | 'Commodities';
export type GoalType = 'Retirement' | 'House Down Payment' | 'Vacation' | 'Emergency Fund' | 'Education';
export type AlertLevel = 'info' | 'warning' | 'critical';
export type ReportFormat = 'pdf' | 'csv' | 'json';
export type MarketTrend = 'up' | 'down' | 'stable';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    riskTolerance: 'low' | 'medium' | 'high';
    financialGoals: string[];
    preferredCurrency: Currency;
    lastLogin: string;
}

export interface Account {
    id: string;
    name: string;
    type: AccountType;
    balance: number;
    currency: Currency;
    institution: string;
    lastUpdated: string;
    interestRate?: number;
    creditLimit?: number;
}

export interface Transaction {
    id: string;
    accountId: string;
    date: string;
    description: string;
    amount: number;
    category: TransactionCategory;
    isRecurring: boolean;
}

export interface InvestmentHolding {
    id: string;
    ticker: string;
    name: string;
    shares: number;
    purchasePrice: number;
    currentPrice: number;
    assetClass: AssetClass;
}

export interface FinancialGoal {
    id: string;
    name: string;
    type: GoalType;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    priority: 'high' | 'medium' | 'low';
}

export interface Budget {
    category: TransactionCategory;
    allocated: number;
    spent: number;
}

export interface Alert {
    id: string;
    title: string;
    message: string;
    level: AlertLevel;
    timestamp: string;
}

export interface MarketNewsArticle {
    id: string;
    source: string;
    headline: string;
    summary: string;
    url: string;
    publishedAt: string;
    trend: MarketTrend;
}

export interface UpcomingBill {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    isAutoPay: boolean;
    category: TransactionCategory;
}

export interface InsurancePolicy {
    id:string;
    provider: string;
    type: 'Life' | 'Health' | 'Auto' | 'Home';
    policyNumber: string;
    coverage: number;
    premium: number;
    nextPaymentDate: string;
}

export interface FinancialHealthMetrics {
    creditScore: number;
    savingsRate: number; // percentage
    debtToIncomeRatio: number; // percentage
    emergencyFundCoverage: number; // in months
    investmentAllocation: Record<AssetClass, number>;
}

export interface WealthDataPoint {
    date: string;
    netWorth: number;
    assets: number;
    liabilities: number;
}

export interface DashboardWidget {
    id: string;
    component: React.ComponentType<any>;
    title: string;
    gridSpan: number;
    defaultPosition: number;
}


// SECTION 2: MOCK DATA & API SIMULATION
// =================================================================

const mockUserProfile: UserProfile = {
    id: 'user-123',
    name: 'Alex Ryder',
    email: 'alex.ryder@example.com',
    avatarUrl: `https://i.pravatar.cc/150?u=alexryder`,
    riskTolerance: 'medium',
    financialGoals: ['Retirement', 'Buy a new car'],
    preferredCurrency: 'USD',
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
};

const mockAccounts: Account[] = [
    { id: 'acc-001', name: 'Main Checking', type: 'checking', balance: 12540.50, currency: 'USD', institution: 'Global Bank', lastUpdated: new Date().toISOString() },
    { id: 'acc-002', name: 'High-Yield Savings', type: 'savings', balance: 55200.00, currency: 'USD', institution: 'Digital Trust', lastUpdated: new Date().toISOString(), interestRate: 4.5 },
    { id: 'acc-003', name: 'Visa Sapphire', type: 'credit_card', balance: -1850.75, currency: 'USD', institution: 'Global Bank', lastUpdated: new Date().toISOString(), creditLimit: 15000 },
    { id: 'acc-004', name: 'Brokerage Account', type: 'investment', balance: 125000.00, currency: 'USD', institution: 'InvestForward', lastUpdated: new Date().toISOString() },
    { id: 'acc-005', name: '401(k) Retirement', type: 'investment', balance: 350000.00, currency: 'USD', institution: 'FutureSecure', lastUpdated: new Date().toISOString() },
    { id: 'acc-006', name: 'Mortgage', type: 'loan', balance: -250000.00, currency: 'USD', institution: 'Home Loans Inc.', lastUpdated: new Date().toISOString(), interestRate: 3.25 },
    { id: 'acc-007', name: 'Crypto Wallet', type: 'crypto', balance: 8345.21, currency: 'USD', institution: 'CryptoVault', lastUpdated: new Date().toISOString() },
    { id: 'acc-008', name: 'Primary Residence', type: 'real_estate', balance: 450000.00, currency: 'USD', institution: 'Self-Valued', lastUpdated: new Date().toISOString() },
];

const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => {
    const categories: TransactionCategory[] = ['Groceries', 'Utilities', 'Rent', 'Transportation', 'Dining Out', 'Shopping', 'Health', 'Entertainment', 'Income', 'Investment'];
    const type = Math.random() > 0.2 ? 'expense' : 'income';
    const category = type === 'income' ? 'Income' : categories[Math.floor(Math.random() * (categories.length - 1))];
    const amount = type === 'income' ? Math.random() * 5000 + 1000 : -(Math.random() * 500 + 5);
    const descriptions = ['Spotify Subscription', 'Netflix', 'Adobe Creative Cloud', 'Gym Membership', 'Groceries at Whole Foods', 'Gas Station', 'Amazon Purchase'];
    return {
        id: `txn-${i}`,
        accountId: mockAccounts[Math.floor(Math.random() * 3)].id,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        amount: parseFloat(amount.toFixed(2)),
        category,
        isRecurring: Math.random() > 0.8,
    };
});

const mockHoldings: InvestmentHolding[] = [
    { id: 'h-01', ticker: 'AAPL', name: 'Apple Inc.', shares: 50, purchasePrice: 150, currentPrice: 195.50, assetClass: 'Stocks' },
    { id: 'h-02', ticker: 'VOO', name: 'Vanguard S&P 500 ETF', shares: 100, purchasePrice: 380, currentPrice: 430.10, assetClass: 'Stocks' },
    { id: 'h-03', ticker: 'BND', name: 'Vanguard Total Bond Market ETF', shares: 150, purchasePrice: 75, currentPrice: 72.50, assetClass: 'Bonds' },
    { id: 'h-04', ticker: 'BTC', name: 'Bitcoin', shares: 0.1, purchasePrice: 30000, currentPrice: 41726.05, assetClass: 'Crypto' },
    { id: 'h-05', ticker: 'REIT.L', name: 'Real Estate Investment Trust', shares: 200, purchasePrice: 90, currentPrice: 110.00, assetClass: 'Real Estate' },
];

const mockGoals: FinancialGoal[] = [
    { id: 'g-01', name: 'Retirement Fund', type: 'Retirement', targetAmount: 2000000, currentAmount: 350000, targetDate: '2050-01-01', priority: 'high' },
    { id: 'g-02', name: 'House Down Payment', type: 'House Down Payment', targetAmount: 100000, currentAmount: 55200, targetDate: '2027-06-01', priority: 'high' },
    { id: 'g-03', name: 'European Vacation', type: 'Vacation', targetAmount: 15000, currentAmount: 3500, targetDate: '2025-08-01', priority: 'medium' },
];

const mockBudgets: Budget[] = [
    { category: 'Groceries', allocated: 800, spent: 650.25 },
    { category: 'Dining Out', allocated: 400, spent: 450.80 },
    { category: 'Shopping', allocated: 500, spent: 250.00 },
    { category: 'Transportation', allocated: 300, spent: 280.50 },
    { category: 'Entertainment', allocated: 200, spent: 150.00 },
];

const mockAlerts: Alert[] = [
    { id: 'al-01', title: 'Large Transaction', message: 'A transaction of $1,200 to "TechStore" was just made.', level: 'info', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'al-02', title: 'Credit Limit Approaching', message: 'You have used 85% of your Visa Sapphire credit limit.', level: 'warning', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'al-03', title: 'Upcoming Bill', message: 'Your mortgage payment of $1,800 is due in 3 days.', level: 'critical', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
];

const mockNews: MarketNewsArticle[] = [
    { id: 'n-01', source: 'Finance Today', headline: 'Tech Stocks Rally on Positive Inflation Report', summary: 'Major tech indices saw significant gains...', url: '#', publishedAt: new Date().toISOString(), trend: 'up' },
    { id: 'n-02', source: 'MarketWatch', headline: 'Federal Reserve Hints at Pausing Rate Hikes', summary: 'The Fed chair suggested that current monetary policy may be sufficiently restrictive...', url: '#', publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(), trend: 'stable' },
    { id: 'n-03', source: 'Crypto News', headline: 'Volatility in Crypto Markets as Scrutiny Increases', summary: 'Bitcoin and Ethereum experience sharp price swings...', url: '#', publishedAt: new Date(Date.now() - 86400000).toISOString(), trend: 'down' },
];

const mockBills: UpcomingBill[] = [
    { id: 'b-01', name: 'Mortgage', amount: 1800.00, dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), isAutoPay: true, category: 'Rent' },
    { id: 'b-02', name: 'Car Payment', amount: 450.00, dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), isAutoPay: true, category: 'Transportation' },
    { id: 'b-03', name: 'Netflix Subscription', amount: 19.99, dueDate: new Date(Date.now() + 10 * 86400000).toISOString(), isAutoPay: true, category: 'Entertainment' },
    { id: 'b-04', name: 'Electricity Bill', amount: 120.50, dueDate: new Date(Date.now() + 15 * 86400000).toISOString(), isAutoPay: false, category: 'Utilities' },
];

const mockWealthTimeline: WealthDataPoint[] = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const baseNetWorth = 600000 + i * 5000;
    const netWorth = baseNetWorth + (Math.random() - 0.5) * 20000;
    const assets = netWorth * 1.3 + (Math.random() - 0.5) * 10000;
    const liabilities = assets - netWorth;
    return {
        date: date.toISOString(),
        netWorth,
        assets,
        liabilities
    };
});

// SECTION 3: DASHBOARD DATA CONTEXT
// =================================================================

interface DashboardDataContextProps {
    userProfile: UserProfile | null;
    accounts: Account[] | null;
    transactions: Transaction[] | null;
    investments: InvestmentHolding[] | null;
    goals: FinancialGoal[] | null;
    budgets: Budget[] | null;
    bills: UpcomingBill[] | null;
    news: MarketNewsArticle[] | null;
    wealthTimelineData: WealthDataPoint[] | null;
    loading: boolean;
    error: string | null;
}

const DashboardDataContext = createContext<DashboardDataContextProps | undefined>(undefined);

export const useDashboardData = () => {
    const context = useContext(DashboardDataContext);
    if (!context) throw new Error('useDashboardData must be used within a DashboardDataProvider');
    return context;
};

export const DashboardDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Omit<DashboardDataContextProps, 'loading' | 'error'>>({
        userProfile: null, accounts: null, transactions: null, investments: null, goals: null,
        budgets: null, bills: null, news: null, wealthTimelineData: null,
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const results = await Promise.all([
                    new Promise<UserProfile>(res => setTimeout(() => res(mockUserProfile), 500)),
                    new Promise<Account[]>(res => setTimeout(() => res(mockAccounts), 800)),
                    new Promise<Transaction[]>(res => setTimeout(() => res(mockTransactions), 1200)),
                    new Promise<InvestmentHolding[]>(res => setTimeout(() => res(mockHoldings), 1000)),
                    new Promise<FinancialGoal[]>(res => setTimeout(() => res(mockGoals), 1100)),
                    new Promise<Budget[]>(res => setTimeout(() => res(mockBudgets), 900)),
                    new Promise<UpcomingBill[]>(res => setTimeout(() => res(mockBills), 700)),
                    new Promise<MarketNewsArticle[]>(res => setTimeout(() => res(mockNews), 1500)),
                    new Promise<WealthDataPoint[]>(res => setTimeout(() => res(mockWealthTimeline), 1300)),
                ]);

                setData({
                    userProfile: results[0], accounts: results[1], transactions: results[2],
                    investments: results[3], goals: results[4], budgets: results[5],
                    bills: results[6], news: results[7], wealthTimelineData: results[8],
                });
            } catch (e) {
                setError('Failed to load dashboard data.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const value = { ...data, loading, error };

    return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
};


// SECTION 4: UTILITY FUNCTIONS & HOOKS
// =================================================================

export const formatCurrency = (amount: number, currency: Currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
};

export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', ...options };
    return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
};

export const getRelativeTime = (dateString: string): string => {
    const diffInSeconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    const units = [{ name: 'year', seconds: 31536000 }, { name: 'month', seconds: 2592000 }, { name: 'week', seconds: 604800 }, { name: 'day', seconds: 86400 }, { name: 'hour', seconds: 3600 }, { name: 'minute', seconds: 60 }];
    for (const unit of units) {
        const interval = Math.floor(diffInSeconds / unit.seconds);
        if (interval >= 1) return `${interval} ${unit.name}${interval > 1 ? 's' : ''} ago`;
    }
    return 'just now';
};

export const getCategoryIcon = (category: TransactionCategory): React.ReactNode => {
    const iconMap: Record<TransactionCategory, string> = {
        'Groceries': "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
        'Utilities': "M13 10V3L4 14h7v7l9-11h-7z",
        'Rent': "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        'Transportation': "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
        'Dining Out': "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
        'Shopping': "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
        'Health': "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
        'Entertainment': "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z",
        'Income': "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01",
        'Investment': "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
        'Other': "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    };
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconMap[category] || iconMap['Other']} /></svg>;
};

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) { console.error(error); return initialValue; }
    });

    const setValue = (value: T) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) { console.error(error); }
    };
    return [storedValue, setValue];
};

// SECTION 5: GENERIC UI COMPONENTS
// =================================================================

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode; }> = ({ children, className = '', title, action }) => (
    <div className={`bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 h-full flex flex-col ${className}`}>
        {(title || action) && (
            <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                {action}
            </div>
        )}
        <div className="p-4 flex-grow relative">{children}</div>
    </div>
);

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
    return <div className="flex justify-center items-center h-full"><div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-500 border-t-purple-500`}></div></div>;
};

export const ErrorDisplay: React.FC<{ message: string; }> = ({ message }) => (
    <div className="bg-red-900 bg-opacity-50 text-red-300 p-4 rounded-lg border border-red-700"><p className="font-semibold">An error occurred</p><p>{message}</p></div>
);

export const ProgressBar: React.FC<{ value: number; max: number; colorClass?: string; }> = ({ value, max, colorClass = 'bg-green-500' }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return <div className="w-full bg-gray-700 rounded-full h-2.5"><div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div></div>;
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl border border-gray-700 m-4" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                <p className="label text-white font-bold">{`${formatDate(label)}`}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.color }}>
                        {`${pld.name}: ${formatCurrency(pld.value)}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// SECTION 6: INLINE WIDGET IMPLEMENTATIONS
// =================================================================

// WIDGET 6.1: Balance Summary
// -----------------------------------------------------------------
export const BalanceSummary: React.FC = () => {
    const { accounts, loading, error } = useDashboardData();
    const summary = useMemo(() => {
        if (!accounts) return { totalAssets: 0, totalLiabilities: 0, netWorth: 0 };
        const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
        const totalLiabilities = accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0);
        return { totalAssets, totalLiabilities, netWorth: totalAssets + totalLiabilities };
    }, [accounts]);

    if (loading) return <Card title="Balance Summary"><LoadingSpinner /></Card>;
    if (error) return <Card title="Balance Summary"><ErrorDisplay message={error} /></Card>;

    return (
        <Card title="Balance Summary" action={<button className="text-purple-400 text-sm hover:text-purple-300">View Accounts</button>}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-400">Total Assets</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(summary.totalAssets)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Total Liabilities</p>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(summary.totalLiabilities)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Net Worth</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(summary.netWorth)}</p>
                </div>
            </div>
        </Card>
    );
};


// WIDGET 6.2: Recent Transactions
// -----------------------------------------------------------------
export const RecentTransactions: React.FC = () => {
    const { transactions, loading, error } = useDashboardData();

    if (loading) return <Card title="Recent Transactions"><LoadingSpinner /></Card>;
    if (error) return <Card title="Recent Transactions"><ErrorDisplay message={error} /></Card>;

    const recent = transactions?.slice(0, 5) || [];

    return (
        <Card title="Recent Transactions" action={<a href="#" className="text-sm text-purple-400 hover:text-purple-300">View All</a>}>
            <ul className="divide-y divide-gray-700">
                {recent.map(tx => (
                    <li key={tx.id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-gray-700">{getCategoryIcon(tx.category)}</div>
                            <div>
                                <p className="font-medium text-white">{tx.description}</p>
                                <p className="text-sm text-gray-400">{formatDate(tx.date)}</p>
                            </div>
                        </div>
                        <p className={`font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(tx.amount)}</p>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

// WIDGET 6.3: Investment Portfolio
// -----------------------------------------------------------------
export const InvestmentPortfolio: React.FC = () => {
    const { investments, loading, error } = useDashboardData();
    const summary = useMemo(() => {
        if (!investments) return { totalValue: 0, totalGain: 0, totalGainPercent: 0 };
        const totalValue = investments.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
        const totalCost = investments.reduce((sum, h) => sum + h.shares * h.purchasePrice, 0);
        const totalGain = totalValue - totalCost;
        const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
        return { totalValue, totalGain, totalGainPercent };
    }, [investments]);

    if (loading) return <Card title="Investment Portfolio"><LoadingSpinner /></Card>;
    if (error) return <Card title="Investment Portfolio"><ErrorDisplay message={error} /></Card>;
    
    return (
        <Card title="Investment Portfolio">
            <div className="text-center mb-4">
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalValue)}</p>
                <p className={`text-sm font-semibold ${summary.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {summary.totalGain >= 0 ? '+' : ''}{formatCurrency(summary.totalGain)} ({summary.totalGainPercent.toFixed(2)}%)
                </p>
            </div>
            <ul className="space-y-2">
                {investments?.slice(0,3).map(h => (
                    <li key={h.id} className="flex justify-between items-center text-sm">
                        <span className="font-bold text-white">{h.ticker}</span>
                        <span>{formatCurrency(h.shares * h.currentPrice)}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

// WIDGET 6.4: AI Insights
// -----------------------------------------------------------------
export const AIInsights: React.FC = () => {
    const { budgets, transactions } = useDashboardData();

    const insights = useMemo(() => {
        const generatedInsights: string[] = [];
        if (budgets) {
            const overspent = budgets.find(b => b.spent > b.allocated);
            if(overspent) {
                generatedInsights.push(`You've overspent in ${overspent.category} by ${formatCurrency(overspent.spent - overspent.allocated)}. Consider reviewing your spending in this area.`);
            }
        }
        if(transactions) {
            const subscriptionCount = transactions.filter(t => t.isRecurring).length;
            if (subscriptionCount > 5) {
                generatedInsights.push(`You have ${subscriptionCount} recurring subscriptions. It might be a good time to review them for potential savings.`);
            }
        }
        generatedInsights.push("Your savings rate is strong! Consider allocating a portion of your savings to investments to accelerate wealth growth.");
        return generatedInsights;
    }, [budgets, transactions]);
    
    return (
        <Card title="AI Insights">
            <ul className="space-y-3 list-disc list-inside text-gray-300">
                {insights.map((insight, i) => <li key={i}>{insight}</li>)}
            </ul>
        </Card>
    );
};

// WIDGET 6.5: Impact Tracker (ESG)
// -----------------------------------------------------------------
export const ImpactTracker: React.FC = () => {
    // This is a simplified mock. A real implementation would fetch ESG scores for each holding.
    const esgScore = 78; // Mock overall portfolio ESG score
    return (
        <Card title="Impact Tracker (ESG)">
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-400 text-sm">Portfolio ESG Score</p>
                <p className="text-5xl font-bold text-green-400 mt-2">{esgScore}</p>
                <p className="text-sm text-gray-300 mt-2">Your investments have a strong positive environmental, social, and governance impact.</p>
            </div>
        </Card>
    );
};

// WIDGET 6.6: Wealth Timeline
// -----------------------------------------------------------------
export const WealthTimeline: React.FC = () => {
    const { wealthTimelineData, loading, error } = useDashboardData();

    if (loading) return <Card title="Wealth Timeline"><LoadingSpinner /></Card>;
    if (error) return <Card title="Wealth Timeline"><ErrorDisplay message={error} /></Card>;

    return (
        <Card title="Wealth Timeline (12 Months)">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={wealthTimelineData || []} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" tickFormatter={(str) => formatDate(str, { month: 'short' })} tick={{ fill: '#a0aec0' }} />
                        <YAxis tickFormatter={(val) => `$${Number(val/1000)}k`} tick={{ fill: '#a0aec0' }} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="netWorth" stroke="#8884d8" fillOpacity={1} fill="url(#colorNetWorth)" name="Net Worth" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

// WIDGET 6.7: Financial Health Score
// -----------------------------------------------------------------
const calculateFinancialHealth = (metrics: FinancialHealthMetrics): { score: number; feedback: string[] } => {
    let score = 0;
    const feedback: string[] = [];
    const creditScorePoints = (Math.max(0, metrics.creditScore - 500) / 350) * 25;
    score += creditScorePoints;
    if (metrics.creditScore < 670) feedback.push('Improving your credit score could open up better financial products.');
    else if (metrics.creditScore > 800) feedback.push('Excellent credit score! Keep up the good work.');
    const savingsRatePoints = (Math.min(metrics.savingsRate, 25) / 25) * 30;
    score += savingsRatePoints;
    if (metrics.savingsRate < 10) feedback.push('Aim to increase your savings rate to at least 15% of your income.');
    else feedback.push('Great job on your savings rate! You are building a strong financial future.');
    const dtiPoints = (1 - Math.min(metrics.debtToIncomeRatio, 50) / 50) * 25;
    score += dtiPoints;
    if (metrics.debtToIncomeRatio > 40) feedback.push('Your debt-to-income ratio is high. Focus on paying down debt.');
    else feedback.push('Your debt levels are manageable. Well done!');
    const emergencyFundPoints = (Math.min(metrics.emergencyFundCoverage, 6) / 6) * 20;
    score += emergencyFundPoints;
    if (metrics.emergencyFundCoverage < 3) feedback.push('Your emergency fund is low. Aim for 3-6 months of living expenses.');
    else feedback.push('You have a solid emergency fund, providing great financial security.');
    return { score: Math.round(score), feedback };
};

export const FinancialHealthScore: React.FC = () => {
    const { loading: dataLoading } = useDashboardData();
    const [healthData] = useState<FinancialHealthMetrics>({
        creditScore: 780, savingsRate: 18, debtToIncomeRatio: 25, emergencyFundCoverage: 4.5,
        investmentAllocation: { 'Stocks': 60, 'Bonds': 25, 'Real Estate': 10, 'Crypto': 5, 'Cash': 0, 'Commodities': 0 },
    });

    if (dataLoading) return <Card title="Financial Health Score"><LoadingSpinner /></Card>;

    const { score, feedback } = calculateFinancialHealth(healthData);
    const circumference = 2 * Math.PI * 52;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const getScoreColor = (s: number) => s < 50 ? 'text-red-400' : s < 75 ? 'text-yellow-400' : 'text-green-400';

    return (
        <Card title="Financial Health Score">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="52" stroke="currentColor" strokeWidth="12" className="text-gray-700" fill="transparent" />
                        <circle cx="64" cy="64" r="52" stroke="currentColor" strokeWidth="12" className={getScoreColor(score)} fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
                    </svg>
                    <span className={`absolute text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
                </div>
                <div className="flex-1"><h4 className="text-xl font-semibold text-white">Your Score Analysis</h4><ul className="mt-2 list-disc list-inside space-y-1 text-gray-300">{feedback.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
            </div>
        </Card>
    );
};

// WIDGET 6.8: Spending Analysis
// -----------------------------------------------------------------
export const SpendingAnalysis: React.FC = () => {
    const { budgets, loading, error } = useDashboardData();
    if (loading) return <Card title="Spending Analysis"><LoadingSpinner /></Card>;
    if (error || !budgets) return <Card title="Spending Analysis"><ErrorDisplay message={error || 'No data available'} /></Card>;

    const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const remaining = totalAllocated - totalSpent;

    return (
        <Card title="Spending Analysis" action={<div className="text-sm text-gray-400">{formatCurrency(totalSpent)} spent of {formatCurrency(totalAllocated)}</div>}>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-1"><span className="text-base font-medium text-white">Total Progress</span><span className={`text-sm font-medium ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(remaining)} {remaining >= 0 ? 'left' : 'over'}</span></div>
                    <ProgressBar value={totalSpent} max={totalAllocated} colorClass={remaining >= 0 ? 'bg-purple-600' : 'bg-red-600'}/>
                </div>
                <div className="space-y-3 pt-2">{budgets.map(budget => { const isOver = budget.spent > budget.allocated; return (<div key={budget.category}><div className="flex justify-between items-center mb-1"><span className="text-sm font-medium text-gray-300 flex items-center"><span className="mr-2 opacity-70">{getCategoryIcon(budget.category)}</span>{budget.category}</span><span className={`text-sm ${isOver ? 'text-red-400' : 'text-gray-400'}`}>{formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}</span></div><ProgressBar value={budget.spent} max={budget.allocated} colorClass={isOver ? 'bg-red-500' : 'bg-indigo-500'} /></div>)})}</div>
            </div>
        </Card>
    );
};

// WIDGET 6.9: Financial Goals Tracker
// -----------------------------------------------------------------
export const GoalTracker: React.FC = () => {
    const { goals, loading, error } = useDashboardData();
    const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);

    if (loading) return <Card title="Financial Goals"><LoadingSpinner /></Card>;
    if (error || !goals) return <Card title="Financial Goals"><ErrorDisplay message={error || 'No data available'} /></Card>;

    return (
        <>
            <Card title="Financial Goals" action={<button className="text-purple-400 text-sm hover:text-purple-300">Add Goal</button>}>
                <div className="space-y-4">{goals.map(goal => (<div key={goal.id} className="cursor-pointer" onClick={() => setSelectedGoal(goal)}><div className="flex justify-between items-center mb-1"><span className="font-semibold text-white">{goal.name}</span><span className="text-sm text-gray-400">{Math.round((goal.currentAmount/goal.targetAmount)*100)}%</span></div><ProgressBar value={goal.currentAmount} max={goal.targetAmount} /><div className="flex justify-between text-xs text-gray-500 mt-1"><span>{formatCurrency(goal.currentAmount)}</span><span>{`${Math.round((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000*60*60*24))} days left`}</span></div></div>))}</div>
            </Card>
            <Modal isOpen={!!selectedGoal} onClose={() => setSelectedGoal(null)} title={selectedGoal?.name || 'Goal Details'}>{selectedGoal && (<div className="space-y-4 text-gray-300"><p><strong>Type:</strong> {selectedGoal.type}</p><p><strong>Target:</strong> {formatCurrency(selectedGoal.targetAmount)}</p><p><strong>Current:</strong> {formatCurrency(selectedGoal.currentAmount)}</p><p><strong>Target Date:</strong> {formatDate(selectedGoal.targetDate)}</p><div className="mt-4"><h4 className="font-semibold text-white mb-2">Progress</h4><ProgressBar value={selectedGoal.currentAmount} max={selectedGoal.targetAmount} colorClass="bg-green-500" /></div></div>)}</Modal>
        </>
    );
};

// WIDGET 6.10: Upcoming Payments
// -----------------------------------------------------------------
export const UpcomingPayments: React.FC = () => {
    const { bills, loading, error } = useDashboardData();

    if (loading) return <Card title="Upcoming Payments"><LoadingSpinner /></Card>;
    if (error || !bills) return <Card title="Upcoming Payments"><ErrorDisplay message={error || 'No data available'} /></Card>;

    return (
        <Card title="Upcoming Payments" action={<a href="#" className="text-sm text-purple-400 hover:text-purple-300">View Calendar</a>}>
            <ul className="divide-y divide-gray-700">{bills.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(bill => { const days = Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000*3600*24)); const color = days <= 3 ? 'text-red-400' : days <= 7 ? 'text-yellow-400' : 'text-gray-400'; return (<li key={bill.id} className="py-3 flex justify-between items-center"><div className="flex items-center space-x-3"><div className={`p-2 rounded-full bg-gray-700 ${color}`}>{getCategoryIcon(bill.category)}</div><div><p className="font-medium text-white">{bill.name}</p><p className={`text-sm ${color}`}>Due in {days} day{days !== 1 ? 's' : ''}</p></div></div><div className="text-right"><p className="font-semibold text-white">{formatCurrency(bill.amount)}</p>{bill.isAutoPay && <p className="text-xs text-green-400">Auto-Pay</p>}</div></li>)})}</ul>
        </Card>
    );
};

// WIDGET 6.11: Market News
// -----------------------------------------------------------------
export const MarketNews: React.FC = () => {
    const { news, loading, error } = useDashboardData();
    const trendIcon = (trend: MarketTrend) => { const icons = { up: <path d="M13 7l5 5m0 0l-5 5m5-5H6" />, down: <path d="M13 17l5-5m0 0l-5-5m5 5H6" />, stable: <path d="M5 12h14" /> }; const colors = { up: 'text-green-400', down: 'text-red-400', stable: 'text-gray-400' }; return <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${colors[trend]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[trend]} /></svg>; };
    if (loading) return <Card title="Market News"><LoadingSpinner /></Card>;
    if (error || !news) return <Card title="Market News"><ErrorDisplay message={error || 'No data available'} /></Card>;

    return (
        <Card title="Market News"><div className="space-y-4">{news.map(article => (<a href={article.url} key={article.id} className="block p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors"><div className="flex items-start justify-between"><div><p className="font-semibold text-white">{article.headline}</p><p className="text-sm text-gray-400 mt-1">{article.source} &middot; {getRelativeTime(article.publishedAt)}</p></div>{trendIcon(article.trend)}</div></a>))}</div></Card>
    );
};

// WIDGET 6.12: Subscription Manager
// -----------------------------------------------------------------
export const SubscriptionManager: React.FC = () => {
    const { transactions, loading } = useDashboardData();
    const subs = useMemo(() => {
        if (!transactions) return [];
        const recurring = transactions.filter(t => t.isRecurring && t.amount < 0);
        const keywords = ['netflix', 'spotify', 'subscription', 'monthly', 'adobe', 'gym'];
        const potential = transactions.filter(t => !t.isRecurring && t.amount < 0 && keywords.some(k => t.description.toLowerCase().includes(k)));
        return Array.from(new Map([...recurring, ...potential].map(item => [item.description, item])).values()).sort((a,b) => a.amount - b.amount);
    }, [transactions]);
    const totalMonthly = subs.reduce((sum, s) => sum + s.amount, 0);

    if (loading) return <Card title="Subscriptions"><LoadingSpinner/></Card>
    return (
        <Card title="Subscriptions" action={<span className="text-white font-bold">{formatCurrency(totalMonthly)}/mo</span>}>
            <ul className="space-y-2 text-sm">{subs.slice(0, 4).map(sub => <li key={sub.id} className="flex justify-between"><span className="text-gray-300">{sub.description}</span><span className="font-semibold text-white">{formatCurrency(sub.amount)}</span></li>)}</ul>
        </Card>
    )
};

// WIDGET 6.13: AI Financial Advisor
// -----------------------------------------------------------------
type ChatMessage = { id: number; text: string; sender: 'user' | 'ai'; };
export const AIFinancialAdvisor: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([{ id: 1, text: "Hello! I'm your AI Financial Advisor. How can I help you today?", sender: 'ai' }]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);
    
    const getAIResponse = (query: string): string => {
        query = query.toLowerCase();
        if (query.includes('invest')) return "A great starting point for investing is a diversified, low-cost index fund like an S&P 500 ETF. It provides broad market exposure. Remember to consider your risk tolerance.";
        if (query.includes('save') || query.includes('emergency')) return "Experts recommend having 3-6 months of living expenses saved in an emergency fund. A high-yield savings account is a great place for these funds.";
        if (query.includes('budget')) return "The 50/30/20 budget rule is a popular guideline: 50% for needs, 30% for wants, and 20% for savings. Adjust it to fit your lifestyle.";
        return "That's a great question. While I'm still learning, a good general principle is to spend less than you earn and invest the difference wisely.";
    };
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        const newUserMessage: ChatMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);
        setTimeout(() => {
            const aiResponse = getAIResponse(inputValue);
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'ai' }]);
        }, 1500);
    };

    return (
        <Card title="AI Financial Advisor" className="flex flex-col">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        <div className={`rounded-lg p-3 max-w-[80%] ${msg.sender === 'ai' ? 'bg-purple-800 text-white' : 'bg-gray-600 text-white'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && <div className="flex items-end gap-2"><div className="rounded-lg p-3 max-w-[80%] bg-purple-800 text-white"><span className="animate-pulse">...</span></div></div>}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 pt-4 border-t border-gray-700">
                <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Ask a financial question..." className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Send</button>
            </form>
        </Card>
    );
};


// SECTION 7: DASHBOARD STATE MANAGEMENT & LAYOUT
// =================================================================

type DashboardAction = | { type: 'SET_LAYOUT'; payload: string[] } | { type: 'MOVE_WIDGET'; payload: { fromIndex: number; toIndex: number } } | { type: 'TOGGLE_WIDGET'; payload: string } | { type: 'SET_EDIT_MODE'; payload: boolean };
interface DashboardState { widgetOrder: string[]; availableWidgets: Record<string, DashboardWidget>; editMode: boolean; }

const WIDGETS_MAP: Record<string, DashboardWidget> = {
    balanceSummary: { id: 'balanceSummary', component: BalanceSummary, title: 'Balance Summary', gridSpan: 2, defaultPosition: 0 },
    recentTransactions: { id: 'recentTransactions', component: RecentTransactions, title: 'Recent Transactions', gridSpan: 1, defaultPosition: 1 },
    wealthTimeline: { id: 'wealthTimeline', component: WealthTimeline, title: 'Wealth Timeline', gridSpan: 2, defaultPosition: 2 },
    investmentPortfolio: { id: 'investmentPortfolio', component: InvestmentPortfolio, title: 'Investments', gridSpan: 1, defaultPosition: 3 },
    aiInsights: { id: 'aiInsights', component: AIInsights, title: 'AI Insights', gridSpan: 1, defaultPosition: 4 },
    spendingAnalysis: { id: 'spendingAnalysis', component: SpendingAnalysis, title: 'Spending', gridSpan: 1, defaultPosition: 5 },
    goalTracker: { id: 'goalTracker', component: GoalTracker, title: 'Goals', gridSpan: 1, defaultPosition: 6 },
    financialHealth: { id: 'financialHealth', component: FinancialHealthScore, title: 'Financial Health', gridSpan: 2, defaultPosition: 7 },
    upcomingPayments: { id: 'upcomingPayments', component: UpcomingPayments, title: 'Upcoming Payments', gridSpan: 1, defaultPosition: 8 },
    impactTracker: { id: 'impactTracker', component: Impact Tracker, title: 'Impact (ESG)', gridSpan: 1, defaultPosition: 9 },
    subscriptionManager: { id: 'subscriptionManager', component: SubscriptionManager, title: 'Subscriptions', gridSpan: 1, defaultPosition: 10 },
    marketNews: { id: 'marketNews', component: MarketNews, title: 'Market News', gridSpan: 1, defaultPosition: 11 },
    aiAdvisor: { id: 'aiAdvisor', component: AIFinancialAdvisor, title: 'AI Advisor', gridSpan: 2, defaultPosition: 12 },
};

const defaultWidgetOrder = Object.values(WIDGETS_MAP).sort((a,b) => a.defaultPosition - b.defaultPosition).map(w => w.id);

const initialDashboardState: DashboardState = { widgetOrder: defaultWidgetOrder, availableWidgets: WIDGETS_MAP, editMode: false };

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
    switch (action.type) {
        case 'SET_LAYOUT': return { ...state, widgetOrder: action.payload };
        case 'MOVE_WIDGET': { const { fromIndex, toIndex } = action.payload; const newOrder = Array.from(state.widgetOrder); const [removed] = newOrder.splice(fromIndex, 1); newOrder.splice(toIndex, 0, removed); return { ...state, widgetOrder: newOrder }; }
        case 'TOGGLE_WIDGET': { const widgetId = action.payload; const isVisible = state.widgetOrder.includes(widgetId); return isVisible ? { ...state, widgetOrder: state.widgetOrder.filter(id => id !== widgetId) } : { ...state, widgetOrder: [...state.widgetOrder, widgetId] }; }
        case 'SET_EDIT_MODE': return { ...state, editMode: action.payload };
        default: return state;
    }
}

// SECTION 8: DASHBOARD CUSTOMIZATION PANEL
// =================================================================

export const DashboardCustomizationPanel: React.FC<{ state: DashboardState; dispatch: React.Dispatch<DashboardAction> }> = ({ state, dispatch }) => (
    <Card title="Customize Your Dashboard">
        <p className="text-gray-400 mb-4">Toggle widget visibility. In edit mode, you can also drag and drop widgets to reorder them.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.values(state.availableWidgets).map(widget => { const isVisible = state.widgetOrder.includes(widget.id); return (<button key={widget.id} onClick={() => dispatch({ type: 'TOGGLE_WIDGET', payload: widget.id })} className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center text-center ${isVisible ? 'bg-purple-800 border-purple-600 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}><span className="font-semibold">{widget.title}</span><span className="text-xs mt-1">{isVisible ? 'Visible' : 'Hidden'}</span></button>);})}
        </div>
    </Card>
);

// SECTION 9: MAIN DASHBOARD VIEW COMPONENT
// =================================================================

const DashboardViewInternal: React.FC<{ setActiveView: (view: View) => void; }> = ({ setActiveView }) => {
    const [persistedState, setPersistedState] = useLocalStorage<DashboardState>('dashboardLayout_v2', initialDashboardState);
    const [state, dispatch] = useReducer(dashboardReducer, persistedState);
    const { userProfile, loading: userLoading, error: dataError } = useDashboardData();

    useEffect(() => { setPersistedState(state); }, [state, setPersistedState]);

    const onDragEnd = (result: DropResult) => { if (!result.destination) return; dispatch({ type: 'MOVE_WIDGET', payload: { fromIndex: result.source.index, toIndex: result.destination.index } }); };
    const handleSaveLayout = () => dispatch({ type: 'SET_EDIT_MODE', payload: false });
    const handleResetLayout = () => dispatch({ type: 'SET_LAYOUT', payload: defaultWidgetOrder });
    
    const welcomeMessage = useMemo(() => {
        if (!userProfile) return "Welcome!";
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
        return `Good ${timeOfDay}, ${userProfile.name.split(' ')[0]}!`;
    }, [userProfile]);
    
    if (userLoading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="lg" /></div>
    if (dataError) return <div className="p-8"><ErrorDisplay message={dataError}/></div>

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div><h2 className="text-3xl font-bold text-white tracking-wider">{welcomeMessage}</h2><p className="text-gray-400 mt-1">Here's your complete financial overview.</p></div>
                <div>{state.editMode ? (<div className="flex items-center gap-2"><button onClick={handleSaveLayout} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Save Layout</button><button onClick={handleResetLayout} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Reset</button></div>) : (<button onClick={() => dispatch({ type: 'SET_EDIT_MODE', payload: true })} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Customize Dashboard</button>)}</div>
            </div>

            {state.editMode && <DashboardCustomizationPanel state={state} dispatch={dispatch} />}

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="dashboard-widgets">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {state.widgetOrder.map((widgetId, index) => {
                                const widget = state.availableWidgets[widgetId];
                                if (!widget) return null;
                                const Component = widget.component;
                                const gridClass = widget.gridSpan === 2 ? 'lg:col-span-2' : '';
                                return (
                                    <Draggable key={widgetId} draggableId={widgetId} index={index} isDragDisabled={!state.editMode}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} className={`${gridClass} ${snapshot.isDragging ? 'shadow-2xl opacity-80' : ''} relative`}>
                                                <div {...provided.dragHandleProps} className={`absolute top-2 right-2 p-1 bg-gray-900/50 rounded-md z-10 cursor-move transition-opacity ${state.editMode ? 'opacity-100' : 'opacity-0'}`} title="Move widget">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                                </div>
                                                <Component setActiveView={setActiveView} />
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {!state.widgetOrder.length && <div className="lg:col-span-3 text-center py-12"><p className="text-gray-400">Your dashboard is empty. Go to "Customize Dashboard" to add widgets.</p></div>}
        </div>
    );
};

const DashboardView: React.FC<{setActiveView: (view: View) => void;}> = ({ setActiveView }) => {
    return (
        <DashboardDataProvider>
            <DashboardViewInternal setActiveView={setActiveView} />
        </DashboardDataProvider>
    )
}

export default DashboardView;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/DashboardView.tsx
================================================================================

// components/views/personal/DashboardView.tsx
import React from 'react';
import { View } from '../../../types';

// Import the restored widget components
import BalanceSummary from '../../BalanceSummary';
import RecentTransactions from '../../RecentTransactions';
import InvestmentPortfolio from '../../InvestmentPortfolio';
import AIInsights from '../../AIInsights';
import ImpactTracker from '../../ImpactTracker';
import WealthTimeline from '../../WealthTimeline';

interface DashboardViewProps {
    setActiveView: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Personal Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-6">
                    <BalanceSummary />
                    <RecentTransactions setActiveView={setActiveView} />
                    <WealthTimeline />
                </div>
                {/* Side column */}
                <div className="space-y-6">
                    <InvestmentPortfolio />
                    <AIInsights />
                    <ImpactTracker />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/DashboardView.tsx
================================================================================

// components/views/personal/DashboardView.tsx
import React from 'react';
import { View } from '../../../types';

// Import the restored widget components
import BalanceSummary from '../../BalanceSummary';
import RecentTransactions from '../../RecentTransactions';
import InvestmentPortfolio from '../../InvestmentPortfolio';
import AIInsights from '../../AIInsights';
import ImpactTracker from '../../ImpactTracker';
import WealthTimeline from '../../WealthTimeline';

interface DashboardViewProps {
    setActiveView: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Personal Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-6">
                    <BalanceSummary />
                    <RecentTransactions setActiveView={setActiveView} />
                    <WealthTimeline />
                </div>
                {/* Side column */}
                <div className="space-y-6">
                    <InvestmentPortfolio />
                    <AIInsights />
                    <ImpactTracker />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;