// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/LedgerExplorerView.tsx
================================================================================

// components/views/platform/LedgerExplorerView.tsx
import React, { useState, useMemo, useReducer, useCallback, useEffect, useRef } from 'react';
import Card from '../../Card';
import { LedgerAccount } from '../../../types';
import { MOCK_LEDGER_ACCOUNTS } from '../../../data/ledgerAccounts'; // For fallback
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid, Sankey, Layer, TooltipProps } from 'recharts';
import { FaRobot, FaSearch, FaExclamationTriangle, FaFileCsv, FaMagic, FaPlus, FaArrowLeft, FaSync, FaFilter } from 'react-icons/fa';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#64748b', '#f97316'];
const DEBIT_COLOR = '#06b6d4';
const CREDIT_COLOR = '#f59e0b';
const NET_COLOR = '#10b981';
const ANOMALY_COLOR = '#ef4444';

// --- ENHANCED TYPES FOR A REAL-WORLD APPLICATION ---

/**
 * Represents a single entry in a ledger transaction.
 */
export interface LedgerEntry {
    id: string;
    ledger_account_id: string;
    direction: 'credit' | 'debit';
    amount: number;
    // other fields like currency, currency_exponent, etc.
}

/**
 * AI-powered analysis results for a transaction.
 */
export interface AITransactionAnalysis {
    suggestedCategory: string;
    confidence: number;
    narrative: string;
    isAnomaly: boolean;
    anomalyReason: string | null;
}

/**
 * Enriched data from external APIs.
 */
export interface CounterpartyEnrichment {
    name: string;
    logoUrl?: string;
    stockTicker?: string;
    description?: string;
    website?: string;
}

/**
 * Represents a ledger transaction, which consists of one or more entries.
 */
export interface LedgerTransaction {
    id: string;
    object: 'ledger_transaction';
    live_mode: boolean;
    description: string | null;
    status: 'posted' | 'pending' | 'archived';
    metadata: Record<string, string>;
    ledger_entries: LedgerEntry[];
    posted_at: string;
    effective_date: string;
    ledger_id: string;
    ledgerable_type: string | null;
    ledgerable_id: string | null;
    reversed_by_id: string | null;
    reverses_id: string | null;
    created_at: string;
    updated_at: string;
    aiAnalysis?: AITransactionAnalysis; // AI-generated insights
    enrichment?: CounterpartyEnrichment; // Data from external services
}

/**
 * Represents AI-generated insights for a set of accounts or transactions.
 */
export interface AILedgerInsights {
    summary: string;
    keyObservations: string[];
    potentialRisks: string[];
    optimizationSuggestions: string[];
}

/**
 * Represents the state for the entire Ledger Explorer view.
 */
export interface LedgerExplorerState {
    apiKey: string;
    isLoadingAccounts: boolean;
    isLoadingTransactions: boolean;
    isLoadingDetails: boolean;
    isLoadingAIInsights: boolean;
    error: string | null;
    ledgerAccounts: LedgerAccount[];
    filteredAccounts: LedgerAccount[];
    ledgerTransactions: LedgerTransaction[];
    selectedAccount: LedgerAccount | null;
    selectedAccountTransactions: LedgerTransaction[];
    aiInsights: AILedgerInsights | null;
    anomalousTransactionIds: Set<string>;
    filters: {
        accountName: string;
        normalBalance: 'all' | 'debit' | 'credit';
        dateRange: { start: string, end: string };
        minAmount: number;
        maxAmount: number | null;
        status: 'all' | 'posted' | 'pending' | 'archived';
    };
    nlpQuery: string;
    isProcessingNlp: boolean;
    pagination: {
        accounts: { currentPage: number; pageSize: number; };
        transactions: { currentPage: number; pageSize: number; };
    };
    isCreateModalOpen: boolean;
}

/**
 * Defines the actions that can be dispatched to update the explorer's state.
 */
export type LedgerExplorerAction =
    | { type: 'SET_API_KEY'; payload: string }
    | { type: 'FETCH_ACCOUNTS_START' }
    | { type: 'FETCH_ACCOUNTS_SUCCESS'; payload: LedgerAccount[] }
    | { type: 'FETCH_ACCOUNTS_FAILURE'; payload: string }
    | { type: 'FETCH_TRANSACTIONS_START' }
    | { type: 'FETCH_TRANSACTIONS_SUCCESS'; payload: LedgerTransaction[] }
    | { type: 'FETCH_TRANSACTIONS_FAILURE'; payload: string }
    | { type: 'SELECT_ACCOUNT_START'; payload: LedgerAccount }
    | { type: 'SELECT_ACCOUNT_SUCCESS'; payload: LedgerTransaction[] }
    | { type: 'SELECT_ACCOUNT_FAILURE'; payload: string }
    | { type: 'CLEAR_SELECTION' }
    | { type: 'SET_FILTER'; payload: { filter: keyof LedgerExplorerState['filters']; value: any } }
    | { type: 'APPLY_FILTERS' }
    | { type: 'SET_PAGINATION'; payload: { target: 'accounts' | 'transactions'; newPage: number } }
    | { type: 'TOGGLE_CREATE_MODAL'; payload: boolean }
    | { type: 'FETCH_AI_INSIGHTS_START' }
    | { type: 'FETCH_AI_INSIGHTS_SUCCESS'; payload: { insights: AILedgerInsights; anomalies: string[] } }
    | { type: 'FETCH_AI_INSIGHTS_FAILURE'; payload: string }
    | { type: 'SET_NLP_QUERY', payload: string }
    | { type: 'PROCESS_NLP_QUERY_START' }
    | { type: 'PROCESS_NLP_QUERY_SUCCESS', payload: LedgerAccount[] }
    | { type: 'PROCESS_NLP_QUERY_FAILURE', payload: string };


// --- STATE MANAGEMENT (useReducer) ---

const getInitialState = (): LedgerExplorerState => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    return {
        apiKey: '',
        isLoadingAccounts: false,
        isLoadingTransactions: false,
        isLoadingDetails: false,
        isLoadingAIInsights: false,
        error: null,
        ledgerAccounts: [],
        filteredAccounts: [],
        ledgerTransactions: [],
        selectedAccount: null,
        selectedAccountTransactions: [],
        aiInsights: null,
        anomalousTransactionIds: new Set(),
        filters: {
            accountName: '',
            normalBalance: 'all',
            dateRange: {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0],
            },
            minAmount: 0,
            maxAmount: null,
            status: 'all',
        },
        nlpQuery: '',
        isProcessingNlp: false,
        pagination: {
            accounts: { currentPage: 1, pageSize: 10 },
            transactions: { currentPage: 1, pageSize: 10 },
        },
        isCreateModalOpen: false,
    };
};

const ledgerExplorerReducer = (state: LedgerExplorerState, action: LedgerExplorerAction): LedgerExplorerState => {
    switch (action.type) {
        case 'SET_API_KEY':
            return { ...state, apiKey: action.payload };
        case 'FETCH_ACCOUNTS_START':
            return { ...state, isLoadingAccounts: true, error: null, ledgerAccounts: [], filteredAccounts: [], selectedAccount: null };
        case 'FETCH_ACCOUNTS_SUCCESS':
            return { ...state, isLoadingAccounts: false, ledgerAccounts: action.payload, filteredAccounts: action.payload };
        case 'FETCH_ACCOUNTS_FAILURE':
            return { ...state, isLoadingAccounts: false, error: action.payload, ledgerAccounts: MOCK_LEDGER_ACCOUNTS, filteredAccounts: MOCK_LEDGER_ACCOUNTS };
        case 'FETCH_TRANSACTIONS_START':
             return { ...state, isLoadingTransactions: true, error: null, ledgerTransactions: [], aiInsights: null, anomalousTransactionIds: new Set() };
        case 'FETCH_TRANSACTIONS_SUCCESS':
            return { ...state, isLoadingTransactions: false, ledgerTransactions: action.payload };
        case 'FETCH_TRANSACTIONS_FAILURE':
            return { ...state, isLoadingTransactions: false, error: action.payload };
        case 'SELECT_ACCOUNT_START':
            return { ...state, isLoadingDetails: true, selectedAccount: action.payload, selectedAccountTransactions: [] };
        case 'SELECT_ACCOUNT_SUCCESS':
            return { ...state, isLoadingDetails: false, selectedAccountTransactions: action.payload };
        case 'SELECT_ACCOUNT_FAILURE':
            return { ...state, isLoadingDetails: false, error: action.payload };
        case 'CLEAR_SELECTION':
            return { ...state, selectedAccount: null, selectedAccountTransactions: [] };
        case 'SET_FILTER':
            return { ...state, filters: { ...state.filters, [action.payload.filter]: action.payload.value } };
        case 'APPLY_FILTERS': {
            const { accountName, normalBalance } = state.filters;
            const filtered = state.ledgerAccounts.filter(acc => {
                const nameMatch = acc.name.toLowerCase().includes(accountName.toLowerCase());
                const balanceMatch = normalBalance === 'all' || acc.normal_balance === normalBalance;
                return nameMatch && balanceMatch;
            });
            return { ...state, filteredAccounts: filtered, pagination: { ...state.pagination, accounts: { ...state.pagination.accounts, currentPage: 1 } } };
        }
        case 'SET_PAGINATION':
            return { ...state, pagination: { ...state.pagination, [action.payload.target]: { ...state.pagination[action.payload.target], currentPage: action.payload.newPage } } };
        case 'TOGGLE_CREATE_MODAL':
            return { ...state, isCreateModalOpen: action.payload };
        case 'FETCH_AI_INSIGHTS_START':
            return { ...state, isLoadingAIInsights: true };
        case 'FETCH_AI_INSIGHTS_SUCCESS':
            return { ...state, isLoadingAIInsights: false, aiInsights: action.payload.insights, anomalousTransactionIds: new Set(action.payload.anomalies) };
        case 'FETCH_AI_INSIGHTS_FAILURE':
            return { ...state, isLoadingAIInsights: false, error: action.payload };
        case 'SET_NLP_QUERY':
            return { ...state, nlpQuery: action.payload };
        case 'PROCESS_NLP_QUERY_START':
            return { ...state, isProcessingNlp: true };
        case 'PROCESS_NLP_QUERY_SUCCESS':
            return { ...state, isProcessingNlp: false, filteredAccounts: action.payload, error: null };
        case 'PROCESS_NLP_QUERY_FAILURE':
            return { ...state, isProcessingNlp: false, error: action.payload };
        default:
            return state;
    }
};

// --- MOCK AI & EXTERNAL SERVICES ---

/**
 * Simulates an AI service for ledger analysis. In a real app, this would make API calls to a backend connected to Gemini, OpenAI, etc.
 */
class AILedgerService {
    public async getInsights(transactions: LedgerTransaction[]): Promise<{ insights: AILedgerInsights, anomalies: string[] }> {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        if (transactions.length === 0) {
            return { insights: { summary: "No transaction data to analyze.", keyObservations: [], potentialRisks: [], optimizationSuggestions: [] }, anomalies: [] };
        }

        const totalValue = transactions.reduce((sum, tx) => sum + (tx.ledger_entries[0]?.amount || 0), 0);
        const debitCount = transactions.filter(tx => tx.ledger_entries.some(e => e.direction === 'debit')).length;
        
        const anomalies = transactions.filter(tx => (tx.ledger_entries[0]?.amount || 0) > 900000 || new Date(tx.posted_at).getUTCHours() < 6).map(tx => tx.id);

        return {
            insights: {
                summary: `Analyzed ${transactions.length} transactions totaling ${formatCurrency(totalValue)}. The activity is predominantly driven by ${debitCount > transactions.length / 2 ? 'debits' : 'credits'}, with notable high-value transfers.`,
                keyObservations: [
                    `Highest transaction value was ${formatCurrency(Math.max(...transactions.map(tx => tx.ledger_entries[0]?.amount || 0)))}.`,
                    `Most activity occurred around the start of the month, suggesting payroll or subscription cycles.`,
                    `${anomalies.length} potential anomalies detected based on value and time of transaction.`,
                ],
                potentialRisks: [
                    `High concentration of funds flowing to a single new liability account. Recommend diversifying capital allocation.`,
                    `Lack of detailed descriptions on several large transactions could pose an audit risk.`,
                ],
                optimizationSuggestions: [
                    `Automate categorization for recurring transactions from known vendors to improve data quality.`,
                    `Consider setting up velocity alerts for transactions exceeding $100,000 to new accounts.`,
                ]
            },
            anomalies
        };
    }
    
    public async processNlpQuery(query: string, accounts: LedgerAccount[]): Promise<LedgerAccount[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes("asset")) {
            return accounts.filter(a => a.normal_balance === 'debit');
        }
        if (lowerQuery.includes("liability") || lowerQuery.includes("equity")) {
            return accounts.filter(a => a.normal_balance === 'credit');
        }
        if (lowerQuery.includes("high balance") || lowerQuery.includes("large accounts")) {
            return [...accounts].sort((a,b) => b.balances.posted_balance.amount - a.balances.posted_balance.amount).slice(0, 5);
        }
        if (lowerQuery.includes("cash")) {
             return accounts.filter(a => a.name.toLowerCase().includes('cash'));
        }
        
        throw new Error("Sorry, I couldn't understand that query. Try 'show all asset accounts' or 'find accounts with high balances'.");
    }
}


// --- API HELPER CLASS ---

/**
 * A simple client for interacting with the Modern Treasury API.
 * In a real app, this would be in a separate file.
 */
export class ModernTreasuryAPI {
    private apiKey: string;
    private baseUrl = 'https://app.moderntreasury.com/api';

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error("API Key is required for ModernTreasuryAPI client.");
        }
        this.apiKey = apiKey;
    }

    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Basic ${btoa(this.apiKey)}` // Correct Basic Auth encoding
        };
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // NOTE: This will be blocked by CORS in a browser. A backend proxy is required for production.
        const url = `${this.baseUrl}${endpoint}`;
        try {
            const response = await fetch(url, {
                ...options,
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
                throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody.errors?.message || 'Unknown error'}`);
            }
            return response.json() as T;
        } catch (e: any) {
             console.error(`API request to ${endpoint} failed:`, e);
             throw new Error(`Network or API request failed: ${e.message}. Check browser console for CORS errors. A backend proxy is required to use this feature in a browser.`);
        }
    }

    public async getLedgerAccounts(perPage = 100): Promise<LedgerAccount[]> {
        return this.request<LedgerAccount[]>(`/ledger_accounts?per_page=${perPage}`);
    }
    
    public async getLedgerTransactions(params: { after_cursor?: string, per_page?: number, ledger_account_id?: string, posted_at_start?: string, posted_at_end?: string }): Promise<LedgerTransaction[]> {
        const query = new URLSearchParams();
        if(params.after_cursor) query.append('after_cursor', params.after_cursor);
        if(params.per_page) query.append('per_page', String(params.per_page));
        if(params.ledger_account_id) query.append('ledger_account_id', params.ledger_account_id);
        if(params.posted_at_start) query.append('posted_at[gte]', params.posted_at_start);
        if(params.posted_at_end) query.append('posted_at[lte]', params.posted_at_end);
        
        return this.request<LedgerTransaction[]>(`/ledger_transactions?${query.toString()}`);
    }

    public async createLedgerTransaction(payload: {
        description?: string;
        effective_date: string;
        ledger_entries: Array<{ amount: number; direction: 'credit' | 'debit'; ledger_account_id: string }>;
        metadata?: Record<string, string>;
    }): Promise<LedgerTransaction> {
        return this.request<LedgerTransaction>('/ledger_transactions', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }
}


// --- UTILITY FUNCTIONS ---

export const formatCurrency = (amount: number, currency: string = 'USD', exponent: number = 2): string => {
    const value = amount / Math.pow(10, exponent);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
};

export const exportToCSV = (data: any[], filename: string = 'export.csv') => {
    if (data.length === 0) return;
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
        Object.values(row).map(val => {
            const str = String(val);
            if (str.includes(',') || str.includes('"')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        }).join(',')
    ).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${header}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


// --- REUSABLE SUB-COMPONENTS ---

export const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-gray-700/80 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg text-white">
                <p className="label font-bold text-cyan-400">{`${label}`}</p>
                {payload.map((pld, index) => (
                    <div key={index} style={{ color: pld.color }}>
                        {`${pld.name}: ${formatCurrency(pld.value as number, 'USD', 2)}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const Spinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
    <div className="flex justify-center items-center p-4">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-gray-300">{text}</span>
    </div>
);

export const LedgerAccountTable: React.FC<{
    accounts: LedgerAccount[];
    onSelectAccount: (account: LedgerAccount) => void;
    currentPage: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    anomalousIds: Set<string>;
}> = ({ accounts, onSelectAccount, currentPage, pageSize, onPageChange, anomalousIds }) => {
    const totalPages = Math.ceil(accounts.length / pageSize);
    const paginatedAccounts = accounts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Normal Balance</th>
                        <th scope="col" className="px-6 py-3">Posted Balance</th>
                        <th scope="col" className="px-6 py-3">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedAccounts.map(acc => (
                        <tr key={acc.id} onClick={() => onSelectAccount(acc)} className="border-b border-gray-700 hover:bg-gray-800/50 cursor-pointer">
                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap flex items-center gap-2">
                                {anomalousIds.has(acc.id) && <FaExclamationTriangle className="text-amber-400" title="Account involved in anomalous transactions"/>}
                                {acc.name}
                            </th>
                            <td className={`px-6 py-4 ${acc.normal_balance === 'debit' ? 'text-cyan-400' : 'text-amber-400'}`}>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${acc.normal_balance === 'debit' ? 'bg-cyan-900/50' : 'bg-amber-900/50'}`}>
                                    {acc.normal_balance}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono">{formatCurrency(acc.balances.posted_balance.amount, acc.balances.posted_balance.currency, acc.balances.posted_balance.currency_exponent)}</td>
                            <td className="px-6 py-4 max-w-sm truncate">{acc.description || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">
                    Showing {((currentPage-1)*pageSize)+1} to {Math.min(currentPage*pageSize, accounts.length)} of {accounts.length} accounts
                </span>
                <div className="flex gap-2">
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50">Prev</button>
                    <span className="px-3 py-1 text-gray-300">{currentPage} / {totalPages}</span>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    );
};

export const HistoricalBalanceChart: React.FC<{ transactions: LedgerTransaction[], initialBalance: LedgerAccount['balances']['posted_balance'] }> = ({ transactions, initialBalance }) => {
    const chartData = useMemo(() => {
        if (transactions.length === 0) return [];
        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.posted_at).getTime() - new Date(b.posted_at).getTime());
        let runningBalance = initialBalance.amount;
        
        // Simplified calculation working backwards from current balance
        const reversedTxns = sortedTransactions.slice().reverse();
        const dataPoints: { date: string, balance: number }[] = [{ date: new Date().toISOString().split('T')[0], balance: runningBalance }];

        reversedTxns.forEach(tx => {
            const entry = tx.ledger_entries.find(e => e.ledger_account_id === initialBalance.ledger_account_id);
            if(entry) {
                const change = entry.direction === 'debit' ? entry.amount : -entry.amount;
                runningBalance -= change;
                dataPoints.push({ date: new Date(tx.posted_at).toISOString().split('T')[0], balance: runningBalance });
            }
        });
        
        return dataPoints.reverse();
    }, [transactions, initialBalance]);

    if (chartData.length < 2) {
        return <p className="text-gray-400 text-center flex items-center justify-center h-full">Not enough transaction data to display balance history.</p>
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(val) => formatCurrency(val, initialBalance.currency, initialBalance.currency_exponent)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="balance" name="Posted Balance" stroke={NET_COLOR} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export const FundFlowSankeyChart: React.FC<{ transactions: LedgerTransaction[], accounts: LedgerAccount[] }> = ({ transactions, accounts }) => {
    const sankeyData = useMemo(() => {
        const accountMap = new Map(accounts.map(acc => [acc.id, acc.name]));
        const nodes = Array.from(new Set(transactions.flatMap(tx => tx.ledger_entries.map(e => e.ledger_account_id))))
            .map(id => ({ name: accountMap.get(id) || id }));

        const links: { source: number; target: number; value: number }[] = [];
        const linkMap: Record<string, number> = {};

        transactions.forEach(tx => {
            if (tx.ledger_entries.length < 2) return;
            const debitEntry = tx.ledger_entries.find(e => e.direction === 'debit');
            const creditEntry = tx.ledger_entries.find(e => e.direction === 'credit');

            if (debitEntry && creditEntry) {
                const sourceName = accountMap.get(debitEntry.ledger_account_id);
                const targetName = accountMap.get(creditEntry.ledger_account_id);
                if (sourceName && targetName) {
                    const sourceIndex = nodes.findIndex(n => n.name === sourceName);
                    const targetIndex = nodes.findIndex(n => n.name === targetName);
                    if (sourceIndex === -1 || targetIndex === -1) return;
                    
                    const value = debitEntry.amount / 100; // Assuming exponent 2
                    const key = `${sourceIndex}-${targetIndex}`;
                    linkMap[key] = (linkMap[key] || 0) + value;
                }
            }
        });

        for (const key in linkMap) {
            const [source, target] = key.split('-').map(Number);
            links.push({ source, target, value: linkMap[key] });
        }

        return { nodes, links };
    }, [transactions, accounts]);

    if (sankeyData.links.length === 0) {
        return <p className="text-gray-400 text-center flex items-center justify-center h-full">No transactions with clear fund flows found in the current date range.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={500}>
            <Sankey data={sankeyData} nodePadding={50} margin={{ top: 20, right: 150, bottom: 20, left: 150 }} link={{ stroke: 'rgba(6, 182, 212, 0.5)' }}
                node={({ x, y, width, height, index, payload, containerWidth }) => (
                    <Layer key={`node-${index}`}>
                        <rect x={x} y={y} width={width} height={height} fill={COLORS[index % COLORS.length]} />
                        <text x={x < containerWidth / 2 ? x + width + 6 : x - 6} y={y + height / 2} textAnchor={x < containerWidth / 2 ? 'start' : 'end'} dominantBaseline="middle" fill="#fff">
                            {payload.name}
                        </text>
                    </Layer>
                )}
            >
                 <Tooltip content={<CustomTooltip />} />
            </Sankey>
        </ResponsiveContainer>
    );
};

export const CreateTransactionModal: React.FC<{ isOpen: boolean; onClose: () => void; accounts: LedgerAccount[]; apiClient: ModernTreasuryAPI; onSuccess: () => void; }> = ({ isOpen, onClose, accounts, apiClient, onSuccess }) => {
    const [debitAccountId, setDebitAccountId] = useState('');
    const [creditAccountId, setCreditAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!debitAccountId || !creditAccountId || !amount || !effectiveDate) {
            setError('Please fill all required fields.'); return;
        }
        if (debitAccountId === creditAccountId) {
            setError('Debit and Credit accounts cannot be the same.'); return;
        }
        
        setIsSubmitting(true);
        try {
            await apiClient.createLedgerTransaction({
                description,
                effective_date: effectiveDate,
                ledger_entries: [
                    { amount: Math.round(parseFloat(amount) * 100), direction: 'debit', ledger_account_id: debitAccountId },
                    { amount: Math.round(parseFloat(amount) * 100), direction: 'credit', ledger_account_id: creditAccountId },
                ]
            });
            onSuccess();
            onClose();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative border border-gray-700">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl">&times;</button>
                <h3 className="text-xl font-bold text-white mb-4">Create New Ledger Transaction</h3>
                {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-2 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
                            {isSubmitting ? <Spinner text="Submitting..." /> : 'Create Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const AIInsightCard: React.FC<{ insights: AILedgerInsights | null; isLoading: boolean; onRefresh: () => void; }> = ({ insights, isLoading, onRefresh }) => {
    return (
        <Card title="AI-Powered Ledger Analysis" actions={[{ label: <FaSync/>, onAction: onRefresh, tooltip: 'Refresh Analysis'}]}>
            {isLoading ? <Spinner text="AI is analyzing..." /> : !insights ? <p className="text-gray-400">Click Refresh to generate AI insights.</p> : (
                <div className="space-y-4 text-gray-300 text-sm">
                    <div>
                        <h4 className="font-bold text-cyan-400 mb-1">Executive Summary</h4>
                        <p>{insights.summary}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-cyan-400 mb-1">Key Observations</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {insights.keyObservations.map((obs, i) => <li key={i}>{obs}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-400 mb-1">Potential Risks</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {insights.potentialRisks.map((risk, i) => <li key={i}>{risk}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-green-400 mb-1">Optimization Suggestions</h4>
                         <ul className="list-disc list-inside space-y-1">
                            {insights.optimizationSuggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </Card>
    );
}

// --- MAIN VIEW COMPONENT ---

const LedgerExplorerView: React.FC = () => {
    const [state, dispatch] = useReducer(ledgerExplorerReducer, getInitialState());
    const aiService = useMemo(() => new AILedgerService(), []);
    const apiClient = useMemo(() => state.apiKey ? new ModernTreasuryAPI(state.apiKey) : null, [state.apiKey]);
    const initialFetchCompleted = useRef(false);

    const handleFetch = useCallback(async () => {
        if (!apiClient) {
            dispatch({ type: 'FETCH_ACCOUNTS_FAILURE', payload: "API Key is required. Please provide a valid Base64 encoded 'organization_id:api_key'." });
            return;
        }
        dispatch({ type: 'FETCH_ACCOUNTS_START' });
        try {
            const data = await apiClient.getLedgerAccounts();
            dispatch({ type: 'FETCH_ACCOUNTS_SUCCESS', payload: data });
        } catch (e: any) {
            dispatch({ type: 'FETCH_ACCOUNTS_FAILURE', payload: `Fetch failed: ${e.message}. For demonstration, mock data is loaded.` });
        }
    }, [apiClient]);

    const handleFetchTransactions = useCallback(async () => {
        if (!apiClient) return;
        dispatch({ type: 'FETCH_TRANSACTIONS_START' });
        try {
            const data = await apiClient.getLedgerTransactions({ 
                posted_at_start: state.filters.dateRange.start,
                posted_at_end: state.filters.dateRange.end,
                per_page: 100 // Fetch max for Sankey
            });
            dispatch({ type: 'FETCH_TRANSACTIONS_SUCCESS', payload: data });
        } catch(e: any) {
            dispatch({ type: 'FETCH_TRANSACTIONS_FAILURE', payload: `Failed to fetch transactions: ${e.message}`});
        }
    }, [apiClient, state.filters.dateRange]);
    
    useEffect(() => {
        if (state.ledgerAccounts.length > 0 && !initialFetchCompleted.current) {
            handleFetchTransactions();
            initialFetchCompleted.current = true;
        }
    }, [state.ledgerAccounts, handleFetchTransactions]);

    const handleRunAIAnalysis = useCallback(async () => {
        if (state.ledgerTransactions.length === 0) {
            dispatch({ type: 'FETCH_AI_INSIGHTS_FAILURE', payload: "No transactions to analyze." });
            return;
        }
        dispatch({ type: 'FETCH_AI_INSIGHTS_START' });
        try {
            const result = await aiService.getInsights(state.ledgerTransactions);
            dispatch({ type: 'FETCH_AI_INSIGHTS_SUCCESS', payload: result });
        } catch(e: any) {
            dispatch({ type: 'FETCH_AI_INSIGHTS_FAILURE', payload: `AI analysis failed: ${e.message}` });
        }
    }, [aiService, state.ledgerTransactions]);
    
    const handleNlpQuery = useCallback(async () => {
        dispatch({ type: 'PROCESS_NLP_QUERY_START' });
        try {
            const results = await aiService.processNlpQuery(state.nlpQuery, state.ledgerAccounts);
            dispatch({ type: 'PROCESS_NLP_QUERY_SUCCESS', payload: results });
        } catch(e: any) {
            dispatch({ type: 'PROCESS_NLP_QUERY_FAILURE', payload: e.message });
        }
    }, [aiService, state.nlpQuery, state.ledgerAccounts]);

    const handleSelectAccount = useCallback(async (account: LedgerAccount) => {
        if (!apiClient) return;
        dispatch({ type: 'SELECT_ACCOUNT_START', payload: account });
        try {
            const txns = await apiClient.getLedgerTransactions({ ledger_account_id: account.id, per_page: 50 });
            dispatch({ type: 'SELECT_ACCOUNT_SUCCESS', payload: txns });
        } catch (e: any) {
            dispatch({ type: 'SELECT_ACCOUNT_FAILURE', payload: `Failed to fetch details for ${account.name}: ${e.message}`});
        }
    }, [apiClient]);

    const handleFilterChange = (filter: keyof LedgerExplorerState['filters'], value: any) => dispatch({ type: 'SET_FILTER', payload: { filter, value } });
    const handleDateRangeChange = (part: 'start' | 'end', value: string) => dispatch({ type: 'SET_FILTER', payload: { filter: 'dateRange', value: { ...state.filters.dateRange, [part]: value } } });
    const applyFiltersAndRefresh = () => { dispatch({ type: 'APPLY_FILTERS' }); handleFetchTransactions(); };

    const chartData = useMemo(() => {
        if (state.ledgerAccounts.length === 0) return { balances: [], composition: [] };
        const balances = state.filteredAccounts.map(acc => ({ name: acc.name, balance: acc.normal_balance === 'credit' ? -acc.balances.posted_balance.amount : acc.balances.posted_balance.amount }));
        const composition = state.ledgerAccounts.reduce((acc, account) => {
            const key = account.normal_balance === 'debit' ? 'Assets (Debit)' : 'Liabilities/Equity (Credit)';
            acc[key] = (acc[key] || 0) + account.balances.posted_balance.amount;
            return acc;
        }, {} as Record<string, number>);
        return { balances, composition: Object.entries(composition).map(([name, value]) => ({ name, value })) };
    }, [state.ledgerAccounts, state.filteredAccounts]);
    
    const anomalousAccountIds = useMemo(() => {
        const idSet = new Set<string>();
        state.ledgerTransactions.forEach(tx => {
            if (state.anomalousTransactionIds.has(tx.id)) {
                tx.ledger_entries.forEach(e => idSet.add(e.ledger_account_id));
            }
        });
        return idSet;
    }, [state.anomalousTransactionIds, state.ledgerTransactions]);

    if (state.selectedAccount) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">{state.selectedAccount.name}</h2>
                    <button onClick={() => dispatch({ type: 'CLEAR_SELECTION' })} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center gap-2"><FaArrowLeft /> Back to Overview</button>
                </div>
                {state.isLoadingDetails && <Card><Spinner /></Card>}
                {state.error && !state.isLoadingDetails && <Card><p className="text-center text-red-400">{state.error}</p></Card>}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Account Details" className="md:col-span-1">
                        <div className="space-y-2 text-gray-300">
                           <p><strong>ID:</strong> <span className="font-mono text-sm">{state.selectedAccount.id}</span></p>
                           <p><strong>Description:</strong> {state.selectedAccount.description || 'N/A'}</p>
                           <p><strong>Normal Balance:</strong> <span className={`font-bold ${state.selectedAccount.normal_balance === 'debit' ? 'text-cyan-400' : 'text-amber-400'}`}>{state.selectedAccount.normal_balance}</span></p>
                           <p><strong>Posted Balance:</strong> <span className="font-mono text-lg font-bold text-white">{formatCurrency(state.selectedAccount.balances.posted_balance.amount, 'USD', 2)}</span></p>
                           <p><strong>Pending Balance:</strong> <span className="font-mono">{formatCurrency(state.selectedAccount.balances.pending_balance.amount, 'USD', 2)}</span></p>
                        </div>
                    </Card>
                    <Card title="Balance History" className="md:col-span-2">
                        <HistoricalBalanceChart transactions={state.selectedAccountTransactions} initialBalance={state.selectedAccount.balances.posted_balance} />
                    </Card>
                 </div>
                 <Card title="Recent Transactions">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Direction</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.selectedAccountTransactions.map(tx => {
                                const entry = tx.ledger_entries.find(e => e.ledger_account_id === state.selectedAccount?.id);
                                if (!entry) return null;
                                return (
                                <tr key={tx.id} className="border-b border-gray-700">
                                    <td className="px-6 py-4">{new Date(tx.posted_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{tx.description || 'N/A'}</td>
                                    <td className="px-6 py-4 font-mono">{formatCurrency(entry.amount, 'USD', 2)}</td>
                                    <td className={`px-6 py-4 font-semibold ${entry.direction === 'debit' ? 'text-cyan-400' : 'text-amber-400'}`}>{entry.direction}</td>
                                    <td className="px-6 py-4">{tx.status}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                 </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-white tracking-wider">Ledger Explorer</h2>
                <button onClick={() => dispatch({type: 'TOGGLE_CREATE_MODAL', payload: true})} disabled={!apiClient || state.ledgerAccounts.length === 0} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    <FaPlus/> New Transaction
                </button>
            </div>
            
            <CreateTransactionModal isOpen={state.isCreateModalOpen} onClose={() => dispatch({type: 'TOGGLE_CREATE_MODAL', payload: false})} accounts={state.ledgerAccounts} apiClient={apiClient!} onSuccess={() => { handleFetch(); handleFetchTransactions(); }} />

            <Card title="Modern Treasury Connection">
                <div className="flex flex-col md:flex-row gap-4">
                    <input type="password" value={state.apiKey} onChange={e => dispatch({type: 'SET_API_KEY', payload: e.target.value})} placeholder="Enter your Organization ID and API Key (e.g., org_id:api_key) then Base64 encode it." className="flex-grow bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white font-mono" />
                    <button onClick={handleFetch} disabled={state.isLoadingAccounts || !state.apiKey} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">{state.isLoadingAccounts ? <Spinner text="Fetching..."/> : 'Fetch Ledger Data'}</button>
                </div>
            </Card>

            {state.error && <Card><p className="text-center text-red-400">{state.error}</p></Card>}

            {state.ledgerAccounts.length > 0 && (
                <div className="space-y-6">
                    <Card title="Natural Language Query">
                        <div className="flex gap-4">
                             <input type="text" value={state.nlpQuery} onChange={e => dispatch({type: 'SET_NLP_QUERY', payload: e.target.value})} placeholder="e.g., 'Show all high-balance asset accounts'" className="flex-grow bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" />
                             <button onClick={handleNlpQuery} disabled={state.isProcessingNlp || !state.nlpQuery} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"><FaMagic /> Ask AI</button>
                        </div>
                    </Card>

                    <Card title="Filters & Controls">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            {/* Filter Inputs */}
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mt-4">
                             {/* Date Range Inputs */}
                             <div className="md:col-span-2 flex items-end gap-4">
                                <button onClick={applyFiltersAndRefresh} className="w-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2"><FaFilter/> Apply Filters</button>
                                <button onClick={handleFetchTransactions} disabled={state.isLoadingTransactions} className="w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
                                     {state.isLoadingTransactions ? <Spinner text="Refreshing..."/> : <><FaSync/> Refresh Txns</>}
                                </button>
                             </div>
                        </div>
                    </Card>

                    <Card title="Ledger Accounts Overview" actions={[{label: <><FaFileCsv/> Export CSV</>, onAction: () => exportToCSV(state.filteredAccounts, 'ledger-accounts.csv')}]}>
                       {state.isLoadingAccounts ? <Spinner /> : <LedgerAccountTable 
                            accounts={state.filteredAccounts} 
                            onSelectAccount={handleSelectAccount}
                            currentPage={state.pagination.accounts.currentPage}
                            pageSize={state.pagination.accounts.pageSize}
                            onPageChange={(newPage) => dispatch({ type: 'SET_PAGINATION', payload: {target: 'accounts', newPage} })}
                            anomalousIds={anomalousAccountIds}
                        />}
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AIInsightCard insights={state.aiInsights} isLoading={state.isLoadingAIInsights} onRefresh={handleRunAIAnalysis} />
                        <Card title="Asset vs. Liability/Equity Composition">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={chartData.composition} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {chartData.composition.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>

                    <Card title="Ledger Account Balances">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData.balances} margin={{ top: 5, right: 20, left: 20, bottom: 60 }}>
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} interval={0} angle={-35} textAnchor="end" />
                                <YAxis stroke="#9ca3af" tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="balance" name="Posted Balance">
                                    {chartData.balances.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.balance >= 0 ? DEBIT_COLOR : CREDIT_COLOR} />))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                    
                    <Card title={`Fund Flow (${state.filters.dateRange.start} to ${state.filters.dateRange.end})`}>
                        {state.isLoadingTransactions ? <Spinner /> : <FundFlowSankeyChart transactions={state.ledgerTransactions} accounts={state.ledgerAccounts}/> }
                    </Card>
                </div>
            )}
        </div>
    );
};

export default LedgerExplorerView;