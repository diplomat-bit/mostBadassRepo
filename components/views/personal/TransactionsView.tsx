// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/TransactionsView.tsx
================================================================================

// components/views/personal/TransactionsView.tsx
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import type { Transaction, DetectedSubscription } from '../../../types';
import { GoogleGenAI, Type } from "@google/genai";

// ================================================================================================
// MODAL & DETAIL COMPONENTS
// ================================================================================================

const TransactionDetailModal: React.FC<{ transaction: Transaction | null; onClose: () => void }> = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Description:</span> <span className="text-white font-semibold">{transaction.description}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Amount:</span> <span className={`font-mono font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Date:</span> <span className="text-white">{transaction.date}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Category:</span> <span className="text-white">{transaction.category}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Transaction ID:</span> <span className="text-white font-mono text-xs">{transaction.id}</span></div>
                    {transaction.carbonFootprint && <div className="flex justify-between text-sm"><span className="text-gray-400">Carbon Footprint:</span> <span className="text-green-300">{transaction.carbonFootprint.toFixed(1)} kg CO₂</span></div>}
                </div>
            </div>
        </div>
    );
};

// ================================================================================================
// PLATO'S INTELLIGENCE SUITE (AI WIDGETS)
// ================================================================================================

const AITransactionWidget: React.FC<{
    title: string;
    insightType: 'subscriptions' | 'anomaly' | 'tax' | 'savings';
    transactions: Transaction[];
    children?: (result: any) => React.ReactNode;
}> = ({ title, insightType, transactions, children }) => {
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setResult(null);
        
        let prompt = '';
        let responseSchema: any = null;
        let isTextOnly = true;

        switch(insightType) {
            case 'subscriptions':
                prompt = "Analyze these transactions to find potential recurring subscriptions the user might have forgotten about. Look for repeated payments to the same merchant around the same time each month.";
                responseSchema = { type: Type.OBJECT, properties: { subscriptions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, estimatedAmount: { type: Type.NUMBER }, lastCharged: { type: Type.STRING } } } } } };
                isTextOnly = false;
                break;
            case 'anomaly':
                prompt = "Analyze these transactions and identify one transaction that seems most unusual or out of place compared to the others. Briefly explain why.";
                break;
            case 'tax':
                prompt = "Scan these transactions and identify one potential tax-deductible expense. Explain your reasoning.";
                break;
            case 'savings':
                prompt = "Based on spending patterns, suggest one specific and actionable way to save money.";
                break;
            default:
                setError('Invalid insight type');
                setIsLoading(false);
                return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const transactionSummary = transactions.slice(0, 20).map(t => `${t.date} - ${t.description}: $${t.amount.toFixed(2)} (${t.type})`).join('\n');
            const fullPrompt = `${prompt}\n\nHere are the most recent transactions for context:\n${transactionSummary}`;
            
            const config: any = {};
            if (responseSchema) {
                config.responseMimeType = "application/json";
                config.responseSchema = responseSchema;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: config,
            });

            const textResult = response.text.trim();
            setResult(isTextOnly ? { text: textResult } : JSON.parse(textResult));

        } catch (err) {
            console.error(`Error generating ${title}:`, err);
            setError('Plato AI could not generate this insight.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-700/50 h-full flex flex-col">
            <h4 className="font-semibold text-gray-200 text-sm mb-2">{title}</h4>
            <div className="space-y-2 min-h-[5rem] flex-grow flex flex-col justify-center">
                {error && <p className="text-red-400 text-xs text-center p-2">{error}</p>}
                {isLoading && (
                    <div className="flex items-center justify-center space-x-2">
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    </div>
                )}
                {!isLoading && result && children && children(result)}
                {!isLoading && result && !children && <p className="text-gray-300 text-xs p-2">{result.text}</p>}
                {!isLoading && !result && !error && (
                    <div className="text-center">
                        <button onClick={handleGenerate} className="text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors">
                            Ask Plato AI
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ================================================================================================
// MAIN TRANSACTIONS VIEW (FlowMatrix)
// ================================================================================================
const TransactionsView: React.FC = () => {
    const context = useContext(DataContext);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [sort, setSort] = useState<'date' | 'amount'>('date');
    const [searchTerm, setSearchTerm] = useState('');

    if (!context) {
        throw new Error("TransactionsView must be within a DataProvider");
    }
    const { transactions } = context;

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(tx => filter === 'all' || tx.type === filter)
            .filter(tx => tx.description.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sort === 'date') {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
                return b.amount - a.amount;
            });
    }, [transactions, filter, sort, searchTerm]);
    
    return (
        <>
            <div className="space-y-6">
                 <h2 className="text-3xl font-bold text-white tracking-wider">Transaction History (FlowMatrix)</h2>
                 <Card title="Plato's Intelligence Suite" isCollapsible>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <AITransactionWidget title="Subscription Hunter" insightType="subscriptions" transactions={transactions}>
                           {(result: { subscriptions: DetectedSubscription[] }) => (
                                <ul className="text-xs text-gray-300 space-y-1 p-2">
                                    {result.subscriptions && result.subscriptions.length > 0 ? result.subscriptions.map(sub => <li key={sub.name}>- {sub.name} (~${sub.estimatedAmount.toFixed(2)})</li>) : <li>No potential subscriptions found.</li>}
                                </ul>
                           )}
                        </AITransactionWidget>
                        <AITransactionWidget title="Anomaly Detection" insightType="anomaly" transactions={transactions}/>
                        <AITransactionWidget title="Tax Deduction Finder" insightType="tax" transactions={transactions}/>
                        <AITransactionWidget title="Savings Finder" insightType="savings" transactions={transactions}/>
                     </div>
                </Card>
                <Card>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-1/3 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        <div className="flex items-center gap-4">
                            <select value={filter} onChange={e => setFilter(e.target.value as any)} className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
                                <option value="all">All Types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                             <select value={sort} onChange={e => setSort(e.target.value as any)} className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
                                <option value="date">Sort by Date</option>
                                <option value="amount">Sort by Amount</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                             <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Category</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(tx => (
                                    <tr key={tx.id} onClick={() => setSelectedTransaction(tx)} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer">
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{tx.description}</th>
                                        <td className="px-6 py-4">{tx.category}</td>
                                        <td className="px-6 py-4">{tx.date}</td>
                                        <td className={`px-6 py-4 text-right font-mono ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <TransactionDetailModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
        </>
    );
};

export default TransactionsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/TransactionsView.tsx
================================================================================

// components/views/personal/TransactionsView.tsx
import React, { useContext, useState, useMemo, useEffect, useCallback, useRef, useReducer } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import type { Transaction, DetectedSubscription } from '../../../types';
import { GoogleGenAI, Type } from "@google/genai";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// ================================================================================================
// CONSTANTS & CONFIGURATION
// ================================================================================================
const ITEMS_PER_PAGE_OPTIONS = [15, 30, 50, 100];
const DEBOUNCE_DELAY = 350;
const NOTIFICATION_TIMEOUT = 5000;
const MOCK_API_LATENCY = 500;
const CATEGORY_COLORS = ['#38bdf8', '#34d399', '#f87171', '#fbbf24', '#a78bfa', '#f472b6', '#818cf8', '#fb923c'];

// ================================================================================================
// ENHANCED TYPES & INTERFACES
// ================================================================================================

export type TransactionStatus = 'posted' | 'pending' | 'refunded' | 'cancelled';
export type SortDirection = 'asc' | 'desc';
export type TransactionField = keyof EnhancedTransaction | 'merchantName';
export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type AIEnhancedInsightType = 'subscriptions' | 'anomaly' | 'tax' | 'savings' | 'fraud' | 'categorization_suggestion' | 'spending_report' | 'forecast';

export interface TransactionSplit {
    splitId: string;
    description: string;
    amount: number;
    category: string;
    notes?: string;
}

export interface MerchantDetails {
    name: string;
    logoUrl?: string;
    location?: string;
    address?: string;
    category?: string; // e.g., MCC code description
    website?: string;
}

export interface EnhancedTransaction extends Transaction {
    status: TransactionStatus;
    notes?: string;
    splits?: TransactionSplit[];
    merchant?: MerchantDetails;
    tags?: string[];
    receiptUrl?: string;
    warrantyEndDate?: string;
    carbonFootprint?: number; // in kg CO₂e
}

export interface SortState {
    field: TransactionField;
    direction: SortDirection;
}

export interface FilterState {
    searchTerm: string;
    transactionType: 'all' | 'income' | 'expense';
    dateRange: {
        startDate: string | null;
        endDate: string | null;
    };
    amountRange: {
        min: number | string;
        max: number | string;
    };
    categories: string[];
    statuses: TransactionStatus[];
    tags: string[];
}

export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
}

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

export interface AutomationRule {
    id: string;
    name: string;
    conditions: {
        field: 'description' | 'amount' | 'merchantName';
        operator: 'contains' | 'equals' | 'greater_than' | 'less_than';
        value: string | number;
    }[];
    actions: {
        type: 'set_category' | 'add_tag';
        value: string;
    }[];
    isEnabled: boolean;
}

// ================================================================================================
// MOCK API SERVICES
// ================================================================================================

/**
 * Mocks fetching detailed merchant information from a service like Google Places API.
 * @param merchantName The name of the merchant.
 * @returns A promise that resolves to detailed merchant information.
 */
const fetchMerchantDetails = (merchantName: string): Promise<MerchantDetails> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // In a real app, this would be a call to a backend service that uses Google Places API
            const mockDb: Record<string, MerchantDetails> = {
                "starbucks": { name: "Starbucks", logoUrl: "https://logo.clearbit.com/starbucks.com", location: "Seattle, WA", category: "Coffee Shops", website: "starbucks.com" },
                "netflix": { name: "Netflix", logoUrl: "https://logo.clearbit.com/netflix.com", location: "Los Gatos, CA", category: "Streaming Services", website: "netflix.com" },
                "uber": { name: "Uber", logoUrl: "https://logo.clearbit.com/uber.com", location: "San Francisco, CA", category: "Ride Sharing", website: "uber.com" },
            };
            const key = merchantName.toLowerCase().split(' ')[0];
            const details = mockDb[key] || { name: merchantName, category: "General Retail" };
            resolve(details);
        }, MOCK_API_LATENCY);
    });
};

/**
 * Mocks estimating the carbon footprint of a transaction.
 * @param category The transaction category.
 * @param amount The transaction amount.
 * @returns A promise that resolves to an estimated carbon footprint in kg CO₂e.
 */
const estimateCarbonFootprint = (category: string, amount: number): Promise<number> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const multipliers: Record<string, number> = {
                'Groceries': 0.1,
                'Travel': 0.5,
                'Utilities': 0.2,
                'Dining': 0.15,
                'Shopping': 0.08,
            };
            const footprint = (multipliers[category] || 0.05) * amount;
            resolve(parseFloat(footprint.toFixed(2)));
        }, MOCK_API_LATENCY / 2);
    });
};


// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

export const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        return utcDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        return dateString;
    }
};

export const formatCurrency = (amount: number, currency: string = '$'): string => {
    return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getCategoryColor = (category: string) => {
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};


export const exportTransactionsToCSV = (transactions: EnhancedTransaction[], filename: string = 'transactions.csv') => {
    if (transactions.length === 0) {
        alert("No transactions to export.");
        return;
    }

    const headers = ['id', 'date', 'description', 'amount', 'type', 'category', 'status', 'notes', 'tags', 'merchantName', 'carbonFootprint'];
    const csvRows = [headers.join(',')];

    for (const tx of transactions) {
        const values = [
            tx.id,
            tx.date,
            `"${tx.description.replace(/"/g, '""')}"`,
            tx.amount,
            tx.type,
            tx.category,
            tx.status,
            `"${(tx.notes || '').replace(/"/g, '""')}"`,
            `"${(tx.tags || []).join(', ')}"`,
            `"${(tx.merchant?.name || '').replace(/"/g, '""')}"`,
            tx.carbonFootprint || ''
        ];
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// ================================================================================================
// CUSTOM HOOKS
// ================================================================================================

export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

export const useNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const counterRef = useRef(0);

    const addNotification = useCallback((message: string, type: NotificationType) => {
        const id = counterRef.current++;
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, NOTIFICATION_TIMEOUT);
    }, []);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return { notifications, addNotification, removeNotification };
};

/**
 * Encapsulates the logic for processing transactions: filtering, sorting, and pagination.
 */
export const useTransactionProcessor = (transactions: EnhancedTransaction[]) => {
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        transactionType: 'all',
        dateRange: { startDate: null, endDate: null },
        amountRange: { min: '', max: '' },
        categories: [],
        statuses: [],
        tags: []
    });

    const [sort, setSort] = useState<SortState>({ field: 'date', direction: 'desc' });
    const [pagination, setPagination] = useState<PaginationState>({ currentPage: 1, itemsPerPage: 15 });
    const debouncedSearchTerm = useDebounce(filters.searchTerm, DEBOUNCE_DELAY);

    const allCategories = useMemo(() => [...new Set(transactions.map(tx => tx.category))], [transactions]);
    const allTags = useMemo(() => [...new Set(transactions.flatMap(tx => tx.tags || []))], [transactions]);

    const processedTransactions = useMemo(() => {
        let filtered = [...transactions];

        if (debouncedSearchTerm) {
            const lowercasedTerm = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter(tx =>
                tx.description.toLowerCase().includes(lowercasedTerm) ||
                tx.category.toLowerCase().includes(lowercasedTerm) ||
                (tx.merchant?.name || '').toLowerCase().includes(lowercasedTerm) ||
                (tx.notes || '').toLowerCase().includes(lowercasedTerm)
            );
        }

        if (filters.transactionType !== 'all') {
            filtered = filtered.filter(tx => tx.type === filters.transactionType);
        }
        
        if (filters.dateRange.startDate) {
            filtered = filtered.filter(tx => new Date(tx.date) >= new Date(filters.dateRange.startDate!));
        }
        if (filters.dateRange.endDate) {
            filtered = filtered.filter(tx => new Date(tx.date) <= new Date(filters.dateRange.endDate!));
        }

        if (filters.amountRange.min) {
            filtered = filtered.filter(tx => tx.amount >= Number(filters.amountRange.min!));
        }
        if (filters.amountRange.max) {
            filtered = filtered.filter(tx => tx.amount <= Number(filters.amountRange.max!));
        }

        if (filters.categories.length > 0) {
            filtered = filtered.filter(tx => filters.categories.includes(tx.category));
        }
        if (filters.statuses.length > 0) {
            filtered = filtered.filter(tx => filters.statuses.includes(tx.status));
        }
        if (filters.tags.length > 0) {
            filtered = filtered.filter(tx => tx.tags && tx.tags.some(t => filters.tags.includes(t)));
        }

        filtered.sort((a, b) => {
            const field = sort.field;
            let valA: any = a[field];
            let valB: any = b[field];

            if (field === 'merchantName') {
                valA = a.merchant?.name || '';
                valB = b.merchant?.name || '';
            }

            let comparison = 0;
            if (valA === null || valA === undefined) valA = '';
            if (valB === null || valB === undefined) valB = '';

            if (typeof valA === 'string' && typeof valB === 'string') {
                comparison = valA.localeCompare(valB);
            } else if (typeof valA === 'number' && typeof valB === 'number') {
                comparison = valA - valB;
            } else if (field === 'date') {
                comparison = new Date(valA).getTime() - new Date(valB).getTime();
            }

            return sort.direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [transactions, filters, debouncedSearchTerm, sort]);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        return processedTransactions.slice(startIndex, startIndex + pagination.itemsPerPage);
    }, [processedTransactions, pagination]);
    
    const totalPages = Math.ceil(processedTransactions.length / pagination.itemsPerPage);

    const setPage = (page: number) => {
        setPagination(p => ({ ...p, currentPage: Math.max(1, Math.min(page, totalPages)) }));
    };

    return { filters, setFilters, sort, setSort, pagination, setPagination, setPage, paginatedTransactions, totalTransactionCount: processedTransactions.length, totalPages, allCategories, allTags };
};

export const useBulkSelection = (transactionIds: string[]) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };
    const toggleSelectAll = () => {
        setSelectedIds(prev => prev.size === transactionIds.length ? new Set() : new Set(transactionIds));
    };
    const clearSelection = () => setSelectedIds(new Set());
    const isAllSelected = transactionIds.length > 0 && selectedIds.size === transactionIds.length;
    return { selectedIds, setSelectedIds, toggleSelection, toggleSelectAll, clearSelection, isAllSelected };
};

// ================================================================================================
// GENERIC UI COMPONENTS
// ================================================================================================
export const LoadingSkeleton: React.FC = () => (
    <div className="space-y-2 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
        ))}
    </div>
);

export const NotificationToast: React.FC<{ notification: Notification; onDismiss: (id: number) => void }> = ({ notification, onDismiss }) => {
    const colorClasses = {
        success: 'bg-green-600 border-green-500', error: 'bg-red-600 border-red-500',
        info: 'bg-blue-600 border-blue-500', warning: 'bg-yellow-600 border-yellow-500',
    };
    return (
        <div className={`w-80 p-4 rounded-lg shadow-lg text-white border-l-4 ${colorClasses[notification.type]} animate-fade-in-up`}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{notification.message}</p>
                <button onClick={() => onDismiss(notification.id)} className="text-lg leading-none">&times;</button>
            </div>
        </div>
    );
};

export const ConfirmationModal: React.FC<{
    isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void;
    confirmText?: string; cancelText?: string; confirmVariant?: 'danger' | 'primary';
}> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", confirmVariant = 'danger' }) => {
    if (!isOpen) return null;
    const confirmClasses = confirmVariant === 'danger'
        ? "bg-red-600 hover:bg-red-500"
        : "bg-cyan-600 hover:bg-cyan-500";
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md">
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors">{cancelText}</button>
                    <button onClick={onConfirm} className={`px-4 py-2 rounded-md ${confirmClasses} text-white font-semibold transition-colors`}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};


// ================================================================================================
// DATA VISUALIZATION COMPONENTS
// ================================================================================================

export const CategorySpendingChart: React.FC<{ transactions: EnhancedTransaction[] }> = ({ transactions }) => {
    const expenseData = useMemo(() => {
        const expensesByCategory = transactions
            .filter(tx => tx.type === 'expense')
            .reduce<Record<string, number>>((acc, tx) => {
                acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                return acc;
            }, {});
        
        return Object.entries(expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, value], i) => ({ name, value, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }));
    }, [transactions]);

    if (expenseData.length === 0) return <div className="text-center text-gray-500 p-4">No spending data to display.</div>;

    return (
        <Card title="Top Spending Categories" isCollapsible>
            <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                    <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                </RechartsPieChart>
            </ResponsiveContainer>
        </Card>
    );
};

export const MonthlyTrendChart: React.FC<{ transactions: EnhancedTransaction[] }> = ({ transactions }) => {
    const trendData = useMemo(() => {
        const dataByMonth: Record<string, { income: number, expense: number }> = {};
        transactions.forEach(tx => {
            const month = tx.date.substring(0, 7); // YYYY-MM
            if (!dataByMonth[month]) {
                dataByMonth[month] = { income: 0, expense: 0 };
            }
            if (tx.type === 'income') dataByMonth[month].income += tx.amount;
            else dataByMonth[month].expense += tx.amount;
        });

        return Object.entries(dataByMonth)
            .map(([month, data]) => ({ month, ...data }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }, [transactions]);

    if (trendData.length < 2) return <div className="text-center text-gray-500 p-4">Not enough data for a trend analysis.</div>;

    return (
        <Card title="Income vs. Expense Trend" isCollapsible>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="month" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" tickFormatter={(value) => `$${Number(value)/1000}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} />
                    <Legend />
                    <Bar dataKey="income" fill="#34d399" name="Income" />
                    <Bar dataKey="expense" fill="#f87171" name="Expenses" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}

// ================================================================================================
// MODAL & DETAIL COMPONENTS
// ================================================================================================

const TransactionDetailModal: React.FC<{
    transaction: EnhancedTransaction | null; onClose: () => void;
    onEdit: (tx: EnhancedTransaction) => void; onDelete: (id: string) => void;
}> = ({ transaction, onClose, onEdit, onDelete }) => {
    if (!transaction) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Description:</span> <span className="text-white font-semibold text-right">{transaction.description}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Amount:</span> <span className={`font-mono font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Date:</span> <span className="text-white">{formatDate(transaction.date)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Category:</span> <span className="text-white bg-gray-700 px-2 py-1 rounded-md text-xs">{transaction.category}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Status:</span> <span className="text-white capitalize">{transaction.status}</span></div>
                    {transaction.merchant && <div className="flex justify-between text-sm"><span className="text-gray-400">Merchant:</span> <span className="text-white">{transaction.merchant.name}</span></div>}
                    {transaction.tags && transaction.tags.length > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">Tags:</span> <div className="flex gap-2 flex-wrap justify-end">{transaction.tags.map(tag => <span key={tag} className="text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full text-xs">{tag}</span>)}</div></div>}
                    {transaction.notes && <div className="text-sm"><span className="text-gray-400 block mb-1">Notes:</span><p className="text-white bg-gray-900/50 p-2 rounded-md whitespace-pre-wrap">{transaction.notes}</p></div>}
                    {transaction.carbonFootprint && <div className="flex justify-between text-sm"><span className="text-gray-400">Carbon Footprint:</span> <span className="text-green-300">{transaction.carbonFootprint.toFixed(1)} kg CO₂</span></div>}
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Transaction ID:</span> <span className="text-white font-mono text-xs">{transaction.id}</span></div>
                </div>
                <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
                    <button onClick={() => onDelete(transaction.id)} className="px-4 py-2 text-sm rounded-md bg-red-800 hover:bg-red-700 text-white font-semibold transition-colors">Delete</button>
                    <button onClick={() => onEdit(transaction)} className="px-4 py-2 text-sm rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors">Edit</button>
                </div>
            </div>
        </div>
    );
};

export const AddEditTransactionModal: React.FC<{
    isOpen: boolean; onClose: () => void;
    onSave: (transaction: Omit<EnhancedTransaction, 'id'> | EnhancedTransaction) => void;
    existingTransaction?: EnhancedTransaction | null; categories: string[];
}> = ({ isOpen, onClose, onSave, existingTransaction, categories }) => {
    const [formData, setFormData] = useState<Omit<EnhancedTransaction, 'id'>>({ description: '', amount: 0, date: new Date().toISOString().split('T')[0], type: 'expense', category: categories[0] || 'General', status: 'posted', notes: '', tags: [] });
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(existingTransaction || { description: '', amount: 0, date: new Date().toISOString().split('T')[0], type: 'expense', category: categories[0] || 'General', status: 'posted', notes: '', tags: [] });
            setErrors({});
        }
    }, [isOpen, existingTransaction, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !formData.tags?.includes(newTag)) {
                setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
            }
            setTagInput('');
        }
    };
    
    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: (prev.tags || []).filter(tag => tag !== tagToRemove) }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.description.trim()) newErrors.description = "Description is required.";
        if (formData.amount <= 0) newErrors.amount = "Amount must be positive.";
        if (!formData.date) newErrors.date = "Date is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">{existingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl" aria-label="Close modal">&times;</button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Description</label>
                            <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
                            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Amount</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} step="0.01" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
                                {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white">
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
                                 {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white">
                                    <option value="posted">Posted</option>
                                    <option value="pending">Pending</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                        </div>
                        <div>
                             <label className="text-sm text-gray-400 mb-1 block">Category</label>
                             <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white">
                                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Tags (comma-separated)</label>
                            <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-700 border border-gray-600 rounded-md">
                                {formData.tags?.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full text-xs">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="text-cyan-200 hover:text-white">&times;</button>
                                    </span>
                                ))}
                                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Add a tag..." className="bg-transparent focus:outline-none text-white flex-grow" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Notes</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors">Save Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ================================================================================================
// PLATO'S INTELLIGENCE SUITE (AI WIDGETS)
// ================================================================================================

const AITransactionWidget: React.FC<{ title: string; insightType: AIEnhancedInsightType; transactions: Transaction[]; children?: (result: any) => React.ReactNode; }> = ({ title, insightType, transactions, children }) => {
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true); setError(''); setResult(null);
        let prompt = '', responseSchema: any = null, isTextOnly = true;

        switch(insightType) {
            case 'subscriptions':
                prompt = "Analyze these transactions to find potential recurring subscriptions. Look for repeated payments to the same merchant around the same time each month.";
                responseSchema = { type: Type.OBJECT, properties: { subscriptions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, estimatedAmount: { type: Type.NUMBER }, lastCharged: { type: Type.STRING } } } } } };
                isTextOnly = false;
                break;
            case 'anomaly': prompt = "Analyze these transactions and identify one transaction that seems most unusual or out of place. Briefly explain why."; break;
            case 'tax': prompt = "Scan these transactions and identify one potential tax-deductible expense. Explain your reasoning."; break;
            case 'savings': prompt = "Based on spending patterns, suggest one specific and actionable way to save money."; break;
            case 'fraud': prompt = "Analyze these transactions for signs of potential fraudulent activity. Highlight one most suspicious transaction and explain."; break;
            case 'spending_report':
                 prompt = "Generate a concise summary of spending habits for the provided transaction period. Include total income, total expenses, top spending category, and one key observation or piece of advice.";
                 responseSchema = { type: Type.OBJECT, properties: { report: { type: Type.OBJECT, properties: { totalIncome: { type: Type.NUMBER }, totalExpense: { type: Type.NUMBER }, topCategory: { type: Type.STRING }, keyObservation: { type: Type.STRING } } } } };
                 isTextOnly = false;
                 break;
            default: setError('Invalid insight type'); setIsLoading(false); return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const transactionSummary = transactions.slice(0, 50).map(t => `${t.date} - ${t.description}: $${t.amount.toFixed(2)} (${t.type})`).join('\n');
            const fullPrompt = `${prompt}\n\nHere are the most recent transactions for context:\n${transactionSummary}`;
            
            const config: any = {};
            if (responseSchema) {
                config.responseMimeType = "application/json";
                config.responseSchema = responseSchema;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash-latest', contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
                generationConfig: config,
            });
            const textResult = response.text.trim();
            setResult(isTextOnly ? { text: textResult } : JSON.parse(textResult));
        } catch (err) {
            console.error(`Error generating ${title}:`, err);
            setError('Plato AI could not generate this insight.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-700/50 h-full flex flex-col">
            <h4 className="font-semibold text-gray-200 text-sm mb-2">{title}</h4>
            <div className="space-y-2 min-h-[5rem] flex-grow flex flex-col justify-center">
                {error && <p className="text-red-400 text-xs text-center p-2">{error}</p>}
                {isLoading && (
                    <div className="flex items-center justify-center space-x-2">
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    </div>
                )}
                {!isLoading && result && children && children(result)}
                {!isLoading && result && !children && <p className="text-gray-300 text-xs p-2">{result.text}</p>}
                {!isLoading && !result && !error && (
                    <div className="text-center">
                        <button onClick={handleGenerate} className="text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors">Ask Plato AI</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ================================================================================================
// ADVANCED UI & TABLE COMPONENTS
// ================================================================================================

export const PaginationControls: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
    if (endPage - startPage + 1 < pagesToShow) { startPage = Math.max(1, endPage - pagesToShow + 1); }
    const pageNumbers = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="px-3 py-1 text-sm rounded bg-gray-700 disabled:opacity-50">« First</button>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm rounded bg-gray-700 disabled:opacity-50">‹ Prev</button>
            {startPage > 1 && <span className="px-3 py-1">...</span>}
            {pageNumbers.map(num => <button key={num} onClick={() => onPageChange(num)} className={`px-3 py-1 text-sm rounded ${currentPage === num ? 'bg-cyan-500 text-white' : 'bg-gray-700'}`}>{num}</button>)}
            {endPage < totalPages && <span className="px-3 py-1">...</span>}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm rounded bg-gray-700 disabled:opacity-50">Next ›</button>
            <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm rounded bg-gray-700 disabled:opacity-50">Last »</button>
        </div>
    );
};

// ================================================================================================
// MAIN TRANSACTIONS VIEW (FlowMatrix)
// ================================================================================================
const TransactionsView: React.FC = () => {
    const context = useContext(DataContext);
    const [selectedTransaction, setSelectedTransaction] = useState<EnhancedTransaction | null>(null);
    const [modalState, setModalState] = useState<{
        addEditOpen: boolean; deleteConfirmOpen: boolean;
        transactionToEdit: EnhancedTransaction | null; transactionIdToDelete: string | null;
    }>({ addEditOpen: false, deleteConfirmOpen: false, transactionToEdit: null, transactionIdToDelete: null });

    const { notifications, addNotification, removeNotification } = useNotification();

    if (!context) throw new Error("TransactionsView must be within a DataProvider");
    const { transactions, setTransactions } = context;

    const enhancedTransactions = useMemo(() => transactions.map(tx => ({
        ...tx, status: (tx as any).status || 'posted', tags: (tx as any).tags || [],
    })), [transactions]);

    const { filters, setFilters, sort, setSort, pagination, setPage, paginatedTransactions, totalTransactionCount, totalPages, allCategories, allTags } = useTransactionProcessor(enhancedTransactions);
    const { selectedIds, toggleSelection, toggleSelectAll, isAllSelected } = useBulkSelection(paginatedTransactions.map(tx => tx.id));

    const handleOpenEditModal = (tx: EnhancedTransaction) => {
        setSelectedTransaction(null);
        setModalState(s => ({...s, addEditOpen: true, transactionToEdit: tx}));
    };
    
    const handleOpenDeleteModal = (id: string) => {
        setSelectedTransaction(null);
        setModalState(s => ({...s, deleteConfirmOpen: true, transactionIdToDelete: id}));
    };
    
    const handleCloseModals = () => setModalState({ addEditOpen: false, deleteConfirmOpen: false, transactionToEdit: null, transactionIdToDelete: null });

    const handleSaveTransaction = async (txData: Omit<EnhancedTransaction, 'id'> | EnhancedTransaction) => {
        if ('id' in txData) { // Editing
            setTransactions(prev => prev.map(t => t.id === txData.id ? txData as EnhancedTransaction : t));
            addNotification('Transaction updated!', 'success');
        } else { // Adding
            const newTransaction: EnhancedTransaction = {
                ...txData,
                id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            };
            // Simulate fetching merchant data and carbon footprint for new transactions
            newTransaction.merchant = await fetchMerchantDetails(newTransaction.description);
            newTransaction.carbonFootprint = await estimateCarbonFootprint(newTransaction.category, newTransaction.amount);

            setTransactions(prev => [newTransaction, ...prev]);
            addNotification('Transaction added!', 'success');
        }
    };

    const handleDeleteTransaction = () => {
        if(modalState.transactionIdToDelete) {
            setTransactions(prev => prev.filter(t => t.id !== modalState.transactionIdToDelete));
            addNotification('Transaction deleted.', 'info');
            handleCloseModals();
        }
    };
    
    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Transaction History (FlowMatrix)</h2>
                    <button onClick={() => setModalState(s => ({...s, addEditOpen: true, transactionToEdit: null}))} className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-bold transition-colors">Add Transaction</button>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-1">
                        <MonthlyTrendChart transactions={enhancedTransactions} />
                    </div>
                    <div className="lg:col-span-1">
                        <CategorySpendingChart transactions={enhancedTransactions} />
                    </div>
                 </div>

                <Card title="Plato's Intelligence Suite" isCollapsible>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <AITransactionWidget title="Subscription Hunter" insightType="subscriptions" transactions={transactions}>
                           {(result: { subscriptions: DetectedSubscription[] }) => (
                                <ul className="text-xs text-gray-300 space-y-1 p-2">
                                    {result.subscriptions && result.subscriptions.length > 0 ? result.subscriptions.slice(0, 3).map(sub => <li key={sub.name}>- {sub.name} (~${sub.estimatedAmount.toFixed(2)})</li>) : <li>No potential subscriptions found.</li>}
                                </ul>
                           )}
                        </AITransactionWidget>
                        <AITransactionWidget title="Anomaly Detection" insightType="anomaly" transactions={transactions}/>
                        <AITransactionWidget title="Fraud Scan" insightType="fraud" transactions={transactions}/>
                        <AITransactionWidget title="Savings Finder" insightType="savings" transactions={transactions}/>
                     </div>
                </Card>
                
                <Card>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <input type="text" placeholder="Search transactions..." value={filters.searchTerm} onChange={e => setFilters({...filters, searchTerm: e.target.value})} className="w-full md:w-1/3 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        <div className="flex items-center gap-4">
                            <select value={filters.transactionType} onChange={e => setFilters({...filters, transactionType: e.target.value as any})} className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
                                <option value="all">All Types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                             <select value={sort.field} onChange={e => setSort({...sort, field: e.target.value as any})} className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
                                <option value="date">Sort by Date</option>
                                <option value="amount">Sort by Amount</option>
                                <option value="description">Sort by Description</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                             <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th scope="col" className="p-4"><input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} className="bg-gray-700 border-gray-600"/></th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Category</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTransactions.map(tx => (
                                    <tr key={tx.id} onClick={() => setSelectedTransaction(tx)} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer">
                                        <td className="p-4"><input type="checkbox" checked={selectedIds.has(tx.id)} onChange={() => toggleSelection(tx.id)} onClick={e => e.stopPropagation()} className="bg-gray-700 border-gray-600"/></td>
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{tx.description}</th>
                                        <td className="px-6 py-4"><span style={{ backgroundColor: getCategoryColor(tx.category) }} className="px-2 py-1 text-xs rounded-full text-white bg-opacity-70">{tx.category}</span></td>
                                        <td className="px-6 py-4">{formatDate(tx.date)}</td>
                                        <td className="px-6 py-4 capitalize">{tx.status}</td>
                                        <td className={`px-6 py-4 text-right font-mono ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {paginatedTransactions.length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">No transactions match your criteria.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                        <div>
                            Showing {pagination.itemsPerPage * (pagination.currentPage -1) + 1}-{Math.min(pagination.itemsPerPage * pagination.currentPage, totalTransactionCount)} of {totalTransactionCount} transactions.
                        </div>
                        <PaginationControls currentPage={pagination.currentPage} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                </Card>
            </div>

            <TransactionDetailModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteModal} />
            <AddEditTransactionModal isOpen={modalState.addEditOpen} onClose={handleCloseModals} onSave={handleSaveTransaction} existingTransaction={modalState.transactionToEdit} categories={allCategories} />
            <ConfirmationModal isOpen={modalState.deleteConfirmOpen} title="Delete Transaction" message="Are you sure you want to permanently delete this transaction? This action cannot be undone." onConfirm={handleDeleteTransaction} onCancel={handleCloseModals} confirmText="Delete" />

            <div className="fixed bottom-5 right-5 z-[100] space-y-2">
                {notifications.map(n => <NotificationToast key={n.id} notification={n} onDismiss={removeNotification} />)}
            </div>
        </>
    );
};

export default TransactionsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/TransactionsView.tsx
================================================================================

// components/views/personal/TransactionsView.tsx
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import type { Transaction, DetectedSubscription } from '../../../types';
import { GoogleGenAI, Type } from "@google/genai";

// ================================================================================================
// MODAL & DETAIL COMPONENTS
// ================================================================================================

const TransactionDetailModal: React.FC<{ transaction: Transaction | null; onClose: () => void }> = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Description:</span> <span className="text-white font-semibold">{transaction.description}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Amount:</span> <span className={`font-mono font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Date:</span> <span className="text-white">{transaction.date}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Category:</span> <span className="text-white">{transaction.category}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Transaction ID:</span> <span className="text-white font-mono text-xs">{transaction.id}</span></div>
                    {transaction.carbonFootprint && <div className="flex justify-between text-sm"><span className="text-gray-400">Carbon Footprint:</span> <span className="text-green-300">{transaction.carbonFootprint.toFixed(1)} kg CO₂</span></div>}
                </div>
            </div>
        </div>
    );
};

// ================================================================================================
// PLATO'S INTELLIGENCE SUITE (AI WIDGETS)
// ================================================================================================

const AITransactionWidget: React.FC<{
    title: string;
    insightType: 'subscriptions' | 'anomaly' | 'tax' | 'savings';
    transactions: Transaction[];
    children?: (result: any) => React.ReactNode;
}> = ({ title, insightType, transactions, children }) => {
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setResult(null);
        
        let prompt = '';
        let responseSchema: any = null;
        let isTextOnly = true;

        switch(insightType) {
            case 'subscriptions':
                prompt = "Analyze these transactions to find potential recurring subscriptions the user might have forgotten about. Look for repeated payments to the same merchant around the same time each month.";
                responseSchema = { type: Type.OBJECT, properties: { subscriptions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, estimatedAmount: { type: Type.NUMBER }, lastCharged: { type: Type.STRING } } } } } };
                isTextOnly = false;
                break;
            case 'anomaly':
                prompt = "Analyze these transactions and identify one transaction that seems most unusual or out of place compared to the others. Briefly explain why.";
                break;
            case 'tax':
                prompt = "Scan these transactions and identify one potential tax-deductible expense. Explain your reasoning.";
                break;
            case 'savings':
                prompt = "Based on spending patterns, suggest one specific and actionable way to save money.";
                break;
            default:
                setError('Invalid insight type');
                setIsLoading(false);
                return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const transactionSummary = transactions.slice(0, 20).map(t => `${t.date} - ${t.description}: $${t.amount.toFixed(2)} (${t.type})`).join('\n');
            const fullPrompt = `${prompt}\n\nHere are the most recent transactions for context:\n${transactionSummary}`;
            
            const config: any = {};
            if (responseSchema) {
                config.responseMimeType = "application/json";
                config.responseSchema = responseSchema;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: config,
            });

            const textResult = response.text.trim();
            setResult(isTextOnly ? { text: textResult } : JSON.parse(textResult));

        } catch (err) {
            console.error(`Error generating ${title}:`, err);
            setError('Plato AI could not generate this insight.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-700/50 h-full flex flex-col">
            <h4 className="font-semibold text-gray-200 text-sm mb-2">{title}</h4>
            <div className="space-y-2 min-h-[5rem] flex-grow flex flex-col justify-center">
                {error && <p className="text-red-400 text-xs text-center p-2">{error}</p>}
                {isLoading && (
                    <div className="flex items-center justify-center space-x-2">
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    </div>
                )}
                {!isLoading && result && children && children(result)}
                {!isLoading && result && !children && <p className="text-gray-300 text-xs p-2">{result.text}</p>}
                {!isLoading && !result && !error && (
                    <div className="text-center">
                        <button onClick={handleGenerate} className="text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors">
                            Ask Plato AI
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ================================================================================================
// MAIN TRANSACTIONS VIEW (FlowMatrix)
// ================================================================================================
const TransactionsView: React.FC = () => {
    const context = useContext(DataContext);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [sort, setSort] = useState<'date' | 'amount'>('date');
    const [searchTerm, setSearchTerm] = useState('');

    if (!context) {
        throw new Error("TransactionsView must be within a DataProvider");
    }
    const { transactions } = context;

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(tx => filter === 'all' || tx.type === filter)
            .filter(tx => tx.description.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sort === 'date') {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
                return b.amount - a.amount;
            });
    }, [transactions, filter, sort, searchTerm]);
    
    return (
        <>
            <div className="space-y-6">
                 <h2 className="text-3xl font-bold text-white tracking-wider">Transaction History (FlowMatrix)</h2>
                 <Card title="Plato's Intelligence Suite" isCollapsible>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <AITransactionWidget title="Subscription Hunter" insightType="subscriptions" transactions={transactions}>
                           {(result: { subscriptions: DetectedSubscription[] }) => (
                                <ul className="text-xs text-gray-300 space-y-1 p-2">
                                    {result.subscriptions && result.subscriptions.length > 0 ? result.subscriptions.map(sub => <li key={sub.name}>- {sub.name} (~${sub.estimatedAmount.toFixed(2)})</li>) : <li>No potential subscriptions found.</li>}
                                </ul>
                           )}
                        </AITransactionWidget>
                        <AITransactionWidget title="Anomaly Detection" insightType="anomaly" transactions={transactions}/>
                        <AITransactionWidget title="Tax Deduction Finder" insightType="tax" transactions={transactions}/>
                        <AITransactionWidget title="Savings Finder" insightType="savings" transactions={transactions}/>
                     </div>
                </Card>
                <Card>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-1/3 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        <div className="flex items-center gap-4">
                            <select value={filter} onChange={e => setFilter(e.target.value as any)} className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
                                <option value="all">All Types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                             <select value={sort} onChange={e => setSort(e.target.value as any)} className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
                                <option value="date">Sort by Date</option>
                                <option value="amount">Sort by Amount</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                             <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Category</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(tx => (
                                    <tr key={tx.id} onClick={() => setSelectedTransaction(tx)} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer">
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{tx.description}</th>
                                        <td className="px-6 py-4">{tx.category}</td>
                                        <td className="px-6 py-4">{tx.date}</td>
                                        <td className={`px-6 py-4 text-right font-mono ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <TransactionDetailModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
        </>
    );
};

export default TransactionsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/TransactionsView.tsx
================================================================================

// components/views/personal/TransactionsView.tsx
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import type { Transaction, DetectedSubscription } from '../../../types';
import { GoogleGenAI, Type } from "@google/genai";

// ================================================================================================
// MODAL & DETAIL COMPONENTS
// ================================================================================================

const TransactionDetailModal: React.FC<{ transaction: Transaction | null; onClose: () => void }> = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Description:</span> <span className="text-white font-semibold">{transaction.description}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Amount:</span> <span className={`font-mono font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Date:</span> <span className="text-white">{transaction.date}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Category:</span> <span className="text-white">{transaction.category}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Transaction ID:</span> <span className="text-white font-mono text-xs">{transaction.id}</span></div>
                    {transaction.carbonFootprint && <div className="flex justify-between text-sm"><span className="text-gray-400">Carbon Footprint:</span> <span className="text-green-300">{transaction.carbonFootprint.toFixed(1)} kg CO₂</span></div>}
                </div>
            </div>
        </div>
    );
};

// ================================================================================================
// PLATO'S INTELLIGENCE SUITE (AI WIDGETS)
// ================================================================================================

const AITransactionWidget: React.FC<{
    title: string;
    insightType: 'subscriptions' | 'anomaly' | 'tax' | 'savings';
    transactions: Transaction[];
    children?: (result: any) => React.ReactNode;
}> = ({ title, insightType, transactions, children }) => {
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setResult(null);
        
        let prompt = '';
        let responseSchema: any = null;
        let isTextOnly = true;

        switch(insightType) {
            case 'subscriptions':
                prompt = "Analyze these transactions to find potential recurring subscriptions the user might have forgotten about. Look for repeated payments to the same merchant around the same time each month.";
                responseSchema = { type: Type.OBJECT, properties: { subscriptions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, estimatedAmount: { type: Type.NUMBER }, lastCharged: { type: Type.STRING } } } } } };
                isTextOnly = false;
                break;
            case 'anomaly':
                prompt = "Analyze these transactions and identify one transaction that seems most unusual or out of place compared to the others. Briefly explain why.";
                break;
            case 'tax':
                prompt = "Scan these transactions and identify one potential tax-deductible expense. Explain your reasoning.";
                break;
            case 'savings':
                prompt = "Based on spending patterns, suggest one specific and actionable way to save money.";
                break;
            default:
                setError('Invalid insight type');
                setIsLoading(false);
                return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const transactionSummary = transactions.slice(0, 20).map(t => `${t.date} - ${t.description}: $${t.amount.toFixed(2)} (${t.type})`).join('\n');
            const fullPrompt = `${prompt}\n\nHere are the most recent transactions for context:\n${transactionSummary}`;
            
            const config: any = {};
            if (responseSchema) {
                config.responseMimeType = "application/json";
                config.responseSchema = responseSchema;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: config,
            });

            const textResult = response.text.trim();
            setResult(isTextOnly ? { text: textResult } : JSON.parse(textResult));

        } catch (err) {
            console.error(`Error generating ${title}:`, err);
            setError('Plato AI could not generate this insight.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-700/50 h-full flex flex-col">
            <h4 className="font-semibold text-gray-200 text-sm mb-2">{title}</h4>
            <div className="space-y-2 min-h-[5rem] flex-grow flex flex-col justify-center">
                {error && <p className="text-red-400 text-xs text-center p-2">{error}</p>}
                {isLoading && (
                    <div className="flex items-center justify-center space-x-2">
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                         <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    </div>
                )}
                {!isLoading && result && children && children(result)}
                {!isLoading && result && !children && <p className="text-gray-300 text-xs p-2">{result.text}</p>}
                {!isLoading && !result && !error && (
                    <div className="text-center">
                        <button onClick={handleGenerate} className="text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors">
                            Ask Plato AI
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ================================================================================================
// MAIN TRANSACTIONS VIEW (FlowMatrix)
// ================================================================================================
const TransactionsView: React.FC = () => {
    const context = useContext(DataContext);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [sort, setSort] = useState<'date' | 'amount'>('date');
    const [searchTerm, setSearchTerm] = useState('');

    if (!context) {
        throw new Error("TransactionsView must be within a DataProvider");
    }
    const { transactions } = context;

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(tx => filter === 'all' || tx.type === filter)
            .filter(tx => tx.description.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sort === 'date') {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
                return b.amount - a.amount;
            });
    }, [transactions, filter, sort, searchTerm]);
    
    return (
        <>
            <div className="space-y-6">
                 <h2 className="text-3xl font-bold text-white tracking-wider">Transaction History (FlowMatrix)</h2>
                 <Card title="Plato's Intelligence Suite" isCollapsible>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <AITransactionWidget title="Subscription Hunter" insightType="subscriptions" transactions={transactions}>
                           {(result: { subscriptions: DetectedSubscription[] }) => (
                                <ul className="text-xs text-gray-300 space-y-1 p-2">
                                    {result.subscriptions && result.subscriptions.length > 0 ? result.subscriptions.map(sub => <li key={sub.name}>- {sub.name} (~${sub.estimatedAmount.toFixed(2)})</li>) : <li>No potential subscriptions found.</li>}
                                </ul>
                           )}
                        </AITransactionWidget>
                        <AITransactionWidget title="Anomaly Detection" insightType="anomaly" transactions={transactions}/>
                        <AITransactionWidget title="Tax Deduction Finder" insightType="tax" transactions={transactions}/>
                        <AITransactionWidget title="Savings Finder" insightType="savings" transactions={transactions}/>
                     </div>
                </Card>
                <Card>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-1/3 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        <div className="flex items-center gap-4">
                            <select value={filter} onChange={e => setFilter(e.target.value as any)} className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
                                <option value="all">All Types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                             <select value={sort} onChange={e => setSort(e.target.value as any)} className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
                                <option value="date">Sort by Date</option>
                                <option value="amount">Sort by Amount</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                             <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Category</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(tx => (
                                    <tr key={tx.id} onClick={() => setSelectedTransaction(tx)} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer">
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{tx.description}</th>
                                        <td className="px-6 py-4">{tx.category}</td>
                                        <td className="px-6 py-4">{tx.date}</td>
                                        <td className={`px-6 py-4 text-right font-mono ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <TransactionDetailModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
        </>
    );
};

export default TransactionsView;
