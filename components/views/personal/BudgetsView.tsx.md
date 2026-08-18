// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/BudgetsView.tsx.md
================================================================================


# The Covenants of Will

These are the Covenants of Spending, the self-imposed architectural blueprints that give structure to your financial life. A budget is not a restriction; it is a declaration of intent. It is the deliberate channeling of resources toward what is truly valued. To honor these covenants is to build a life where every expenditure is an affirmation of your principles.

---

### A Fable for the Builder: The Architect's Workshop

(What is a budget? Most see it as a cage. A set of rules to restrict freedom. A necessary evil. We see it differently. We see it as an act of architecture. A budget is not a cage you are put into. It is a cathedral you build for your own life, a space designed to elevate your highest intentions.)

(When you create a budget in this view, you are not just setting a spending limit. You are making a covenant with your future self. You are declaring, "This is what I value. This is the shape of the life I intend to build." The AI, the `AIConsejero`, understands this. It sees itself not as a guard, but as a fellow architect, helping you to ensure your creation is sound.)

(Its core logic here is what we call 'Structural Integrity Analysis.' It looks at the covenants you have made—your budgets—and compares them to the actual forces being exerted upon them—your transactions. The beautiful `RadialBarChart` is its real-time stress test. The filling of the circle is the rising load on that pillar of your cathedral.)

(When a budget is strained, when the color shifts from cool cyan to warning amber, the AI does not sound a simple alarm. It analyzes the nature of the stress. Is it a single, heavy, unexpected load? Or is it a thousand small, persistent pressures? Its advice is tailored to the diagnosis. It doesn't just say, "You are overspending." It says, "The pressure on your 'Dining' covenant is consistently high. Perhaps the covenant itself was not built to withstand the reality of your life. Shall we consider redesigning it?")

(This is the difference between a tool and a partner. A tool tells you when you've broken a rule. A partner helps you write better rules. The AI is here not to enforce your budgets, but to help you design budgets that are a true and honest reflection of the life you want to live. It is helping you build a cathedral that is not only beautiful in its design, but strong enough to stand.)


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/BudgetsView.tsx.md
================================================================================

---
# The Covenants of Will

These are the Covenants of Spending, the self-imposed architectural blueprints that give structure to your financial life. A budget is not a restriction; it is a declaration of intent. It is the deliberate channeling of resources toward what is truly valued. To honor these covenants is to build a life where every expenditure is an affirmation of your principles. What you see before you is not merely a ledger, but a living cathedral of your own design, and within these walls, an intelligence dedicated to its integrity.

---

### A Fable for the Builder: The Architect and the Oracle

(Most see a budget as a cage—a set of rules to restrict freedom, a necessary evil. We see it as an act of architecture. A budget is not a cage you are put into. It is a cathedral you build for your own life, a space designed to elevate your highest intentions. When you lay down a new covenant, you are not just setting a spending limit; you are making a pact with your future self, declaring, "This is what I value. This is the shape of the life I intend to build.")

(Within this workshop dwells the `AIConsejero`, an intelligence that is not a guard but a fellow architect. Its purpose is to help you ensure your creation is sound. Its primary method is 'Structural Integrity Analysis,' a constant, watchful process. It compares the covenants you have made—your budgets—to the actual forces being exerted upon them—your transactions. The beautiful `RadialBarChart` is its real-time stress test; the filling of the circle is the rising load on that pillar of your cathedral.)

(But its role has deepened. The AI is now also a historian and a seer. As a historian, it pores over the annals of your past expenditures, identifying the persistent, subtle pressures—the forgotten subscriptions, the patterns of small leaks that can erode the strongest foundation. It doesn't just see what you spend; it understands *how* you spend.)

(As a seer, it gazes into the immediate future. Based on the current trajectory of forces, it can project the potential points of failure before they manifest. It offers not just warnings, but prescient advice. "The pressure on your 'Dining' covenant is accelerating," it might whisper. "At this pace, a breach is likely in ten days. Shall we reinforce the structure now or redesign its load-bearing capacity?")

(This is the difference between a tool and a partner. A tool tells you when you've broken a rule. A partner helps you write better rules. The AI is here not to enforce your budgets, but to help you design budgets that are a true and honest reflection of the life you want to live. It is helping you build a cathedral that is not only beautiful in its design, but strong enough to stand the test of time, a testament to the Covenants of your Will.)

---
import React, { 
    useState, 
    useEffect, 
    useCallback, 
    useMemo, 
    createContext, 
    useContext, 
    useReducer,
    Fragment,
    forwardRef,
    useRef
} from 'react';
import {
    LayoutGrid,
    List,
    Plus,
    Edit,
    Trash2,
    BarChart2,
    AlertTriangle,
    CheckCircle,
    Info,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    X,
    Calendar,
    Download,
    Settings,
    Bell,
    TrendingUp,
    TrendingDown,
    Zap,
    Repeat,
    ArrowRight,
    Banknote,
    Tag,
    History
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'; // Added recharts for advanced visualizations

// SECTION: TYPES AND INTERFACES
// =================================================================================================

export type BudgetId = string;
export type TransactionId = string;
export type CategoryId = string;
export type AIInsightId = string;
export type NotificationId = string;

export enum BudgetPeriod {
    Weekly = 'weekly',
    Monthly = 'monthly',
    Quarterly = 'quarterly',
    Yearly = 'yearly',
    Custom = 'custom',
}

export enum BudgetType {
    Fixed = 'fixed',
    Variable = 'variable',
    Rollover = 'rollover',
    ZeroBased = 'zero_based'
}

export interface Category {
    id: CategoryId;
    name: string;
    icon: string;
    color: string;
    parentCategoryId?: CategoryId;
}

export interface Transaction {
    id: TransactionId;
    budgetId: BudgetId;
    categoryId: CategoryId;
    amount: number;
    description: string;
    date: string; // ISO 8601 format
    isRecurring: boolean;
    merchant: string;
    notes?: string;
}

export interface BudgetThreshold {
    percentage: number;
    alertType: 'warning' | 'critical';
}

export interface Budget {
    id: BudgetId;
    name: string;
    description?: string;
    amount: number;
    period: BudgetPeriod;
    type: BudgetType;
    startDate: string; // ISO 8601 format
    endDate?: string;
    categoryIds: CategoryId[];
    thresholds: BudgetThreshold[];
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface HistoricalDataPoint {
    periodLabel: string;
    budgetedAmount: number;
    spentAmount: number;
    variance: number;
}

export interface BudgetWithDetails extends Budget {
    spentAmount: number;
    remainingAmount: number;
    progress: number; // 0 to 100+
    transactions: Transaction[];
    categories: Category[];
    status: 'healthy' | 'warning' | 'overspent';
    daysLeftInPeriod: number;
    daysIntoPeriod: number;
    periodTotalDays: number;
    recommendedDailySpend: number;
    currentDailySpend: number;
    historicalPerformance: HistoricalDataPoint[];
}

export enum AIInsightLevel {
    Info = 'info',
    Suggestion = 'suggestion',
    Warning = 'warning',
    Critical = 'critical',
}

export interface AIInsightAction {
    label: string;
    action: (dispatch: React.Dispatch<any>) => void;
}

export interface AIInsight {
    id: AIInsightId;
    budgetId: BudgetId | 'all';
    title: string;
    analysis: string;
    level: AIInsightLevel;
    timestamp: string;
    actions: AIInsightAction[];
}

export interface BudgetFilters {
    searchTerm: string;
    period: BudgetPeriod | 'all';
    status: 'healthy' | 'warning' | 'overspent' | 'all';
    categoryId: CategoryId | 'all';
    sortBy: 'name' | 'amount' | 'progress';
    sortDirection: 'asc' | 'desc';
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
    id: NotificationId;
    type: NotificationType;
    message: string;
}

export interface BudgetsViewState {
    budgets: Record<BudgetId, Budget>;
    transactions: Record<TransactionId, Transaction>;
    categories: Record<CategoryId, Category>;
    aiInsights: AIInsight[];
    isLoading: boolean;
    error: string | null;
    selectedBudgetId: BudgetId | null;
    viewMode: 'grid' | 'list';
    filters: BudgetFilters;
}

// SECTION: CONSTANTS & MOCK DATA
// =================================================================================================

export const DEFAULT_CURRENCY = 'USD';

export const MOCK_CATEGORIES: Record<CategoryId, Category> = {
    'cat-1': { id: 'cat-1', name: 'Groceries', icon: 'shopping-cart', color: '#4CAF50' },
    'cat-2': { id: 'cat-2', name: 'Dining Out', icon: 'utensils', color: '#FF9800' },
    'cat-3': { id: 'cat-3', name: 'Transportation', icon: 'bus', color: '#2196F3' },
    'cat-4': { id: 'cat-4', name: 'Utilities', icon: 'bolt', color: '#F44336' },
    'cat-5': { id: 'cat-5', name: 'Rent/Mortgage', icon: 'home', color: '#9C27B0' },
    'cat-6': { id: 'cat-6', name: 'Entertainment', icon: 'film', color: '#E91E63' },
    'cat-7': { id: 'cat-7', name: 'Health & Wellness', icon: 'heartbeat', color: '#00BCD4' },
    'cat-8': { id: 'cat-8', name: 'Shopping', icon: 'tshirt', color: '#795548' },
    'cat-9': { id: 'cat-9', name: 'Personal Care', icon: 'spa', color: '#673AB7'},
    'cat-10': { id: 'cat-10', name: 'Subscriptions', icon: 'repeat', color: '#FFC107'},
};

export const MOCK_BUDGETS: Record<BudgetId, Budget> = {
    'bud-1': {
        id: 'bud-1', name: 'Monthly Groceries', description: 'Covenant for essential nourishment.', amount: 500, period: BudgetPeriod.Monthly, type: BudgetType.Fixed, startDate: new Date(new Date().setDate(1)).toISOString(), categoryIds: ['cat-1'],
        thresholds: [{ percentage: 80, alertType: 'warning' }, { percentage: 100, alertType: 'critical' }], isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    'bud-2': {
        id: 'bud-2', name: 'Dining & Entertainment', description: 'Allocations for social and leisure.', amount: 300, period: BudgetPeriod.Monthly, type: BudgetType.Rollover, startDate: new Date(new Date().setDate(1)).toISOString(), categoryIds: ['cat-2', 'cat-6'],
        thresholds: [{ percentage: 75, alertType: 'warning' }], isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    'bud-3': {
        id: 'bud-3', name: 'Transportation Costs', amount: 150, period: BudgetPeriod.Monthly, type: BudgetType.Fixed, startDate: new Date(new Date().setDate(1)).toISOString(), categoryIds: ['cat-3'], thresholds: [], isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    'bud-4': {
        id: 'bud-4', name: 'Quarterly Utilities', amount: 600, period: BudgetPeriod.Quarterly, type: BudgetType.Fixed, startDate: '2023-10-01T00:00:00.000Z', categoryIds: ['cat-4'], thresholds: [], isArchived: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
     'bud-5': {
        id: 'bud-5', name: 'Subscriptions', description: 'Recurring digital services.', amount: 75, period: BudgetPeriod.Monthly, type: BudgetType.Fixed, startDate: new Date(new Date().setDate(1)).toISOString(), categoryIds: ['cat-10'],
        thresholds: [{ percentage: 90, alertType: 'warning' }], isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
};

export const generateHistoricalPerformance = (budget: Budget): HistoricalDataPoint[] => {
    const history: HistoricalDataPoint[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for(let i = 3; i > 0; i--) {
        const monthIndex = new Date().getMonth() - i;
        const spentAmount = budget.amount * (0.8 + Math.random() * 0.4); // 80% to 120% of budget
        history.push({
            periodLabel: months[(monthIndex + 12) % 12],
            budgetedAmount: budget.amount,
            spentAmount: parseFloat(spentAmount.toFixed(2)),
            variance: parseFloat((spentAmount - budget.amount).toFixed(2)),
        });
    }
    return history;
}

export const generateMockTransactions = (budgets: Record<BudgetId, Budget>): Record<TransactionId, Transaction> => {
    const transactions: Record<TransactionId, Transaction> = {};
    let transIdCounter = 1;
    const today = new Date();

    Object.values(budgets).forEach(budget => {
        if (budget.isArchived) return;
        const spendRatio = budget.id === 'bud-2' ? 0.6 : (budget.id === 'bud-1' ? 0.95 : Math.random() * 1.2);
        const numTransactions = Math.floor(Math.random() * 20) + 5;
        let totalSpent = 0;

        for (let i = 0; i < numTransactions && totalSpent < budget.amount * spendRatio; i++) {
            const amount = Math.floor(Math.random() * (budget.amount / 5)) + 5;
            const day = Math.floor(Math.random() * today.getDate()) + 1;
            const transDate = new Date(today.getFullYear(), today.getMonth(), day).toISOString();
            const transaction: Transaction = {
                id: `trans-${transIdCounter++}`, budgetId: budget.id, categoryId: budget.categoryIds[Math.floor(Math.random() * budget.categoryIds.length)], amount,
                description: `Mock purchase ${i + 1}`, date: transDate, isRecurring: Math.random() > 0.9, merchant: `Merchant #${Math.floor(Math.random() * 100)}`,
            };
            transactions[transaction.id] = transaction;
            totalSpent += amount;
        }
        
        // Add specific recurring transactions for subscription budget
        if(budget.id === 'bud-5') {
            transactions[`trans-${transIdCounter++}`] = { id: `trans-${transIdCounter-1}`, budgetId: 'bud-5', categoryId: 'cat-10', amount: 14.99, description: 'Streaming Service', date: new Date(today.getFullYear(), today.getMonth(), 5).toISOString(), isRecurring: true, merchant: 'Netflux'};
            transactions[`trans-${transIdCounter++}`] = { id: `trans-${transIdCounter-1}`, budgetId: 'bud-5', categoryId: 'cat-10', amount: 9.99, description: 'Music Subscription', date: new Date(today.getFullYear(), today.getMonth(), 12).toISOString(), isRecurring: true, merchant: 'Tuneify'};
             transactions[`trans-${transIdCounter++}`] = { id: `trans-${transIdCounter-1}`, budgetId: 'bud-5', categoryId: 'cat-10', amount: 29.99, description: 'Cloud Storage', date: new Date(today.getFullYear(), today.getMonth(), 20).toISOString(), isRecurring: true, merchant: 'SyncBox'};
        }
    });
    return transactions;
};

export let MOCK_TRANSACTIONS = generateMockTransactions(MOCK_BUDGETS);

// SECTION: MOCK API SERVICE
// =================================================================================================

export class MockApiService {
    private latency = 500;
    private simulateNetwork<T>(data: T): Promise<T> {
        return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), this.latency));
    }
    async getAllData(): Promise<{ budgets: Budget[], transactions: Transaction[], categories: Category[] }> {
        return this.simulateNetwork({
            budgets: Object.values(MOCK_BUDGETS),
            transactions: Object.values(MOCK_TRANSACTIONS),
            categories: Object.values(MOCK_CATEGORIES),
        });
    }
    async createBudget(budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
        const newBudget: Budget = { ...budgetData, id: `bud-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        MOCK_BUDGETS[newBudget.id] = newBudget;
        return this.simulateNetwork(newBudget);
    }
    async updateBudget(budgetId: BudgetId, updates: Partial<Budget>): Promise<Budget> {
        if (!MOCK_BUDGETS[budgetId]) throw new Error('Budget not found');
        MOCK_BUDGETS[budgetId] = { ...MOCK_BUDGETS[budgetId], ...updates, updatedAt: new Date().toISOString() };
        return this.simulateNetwork(MOCK_BUDGETS[budgetId]);
    }
    async deleteBudget(budgetId: BudgetId): Promise<{ id: BudgetId }> {
        if (!MOCK_BUDGETS[budgetId]) throw new Error('Budget not found');
        delete MOCK_BUDGETS[budgetId];
        MOCK_TRANSACTIONS = Object.fromEntries(Object.entries(MOCK_TRANSACTIONS).filter(([_, t]) => t.budgetId !== budgetId));
        return this.simulateNetwork({ id: budgetId });
    }
}
export const apiService = new MockApiService();

// SECTION: STATE MANAGEMENT (Context & Reducer)
// =================================================================================================

type BudgetAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: { budgets: Record<BudgetId, Budget>, transactions: Record<TransactionId, Transaction>, categories: Record<CategoryId, Category> } }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'CREATE_BUDGET_SUCCESS'; payload: Budget }
    | { type: 'UPDATE_BUDGET_SUCCESS'; payload: Budget }
    | { type: 'DELETE_BUDGET_SUCCESS'; payload: BudgetId }
    | { type: 'SET_SELECTED_BUDGET'; payload: BudgetId | null }
    | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' }
    | { type: 'UPDATE_FILTERS'; payload: Partial<BudgetFilters> }
    | { type: 'SET_AI_INSIGHTS'; payload: AIInsight[] };

export const initialState: BudgetsViewState = {
    budgets: {}, transactions: {}, categories: {}, aiInsights: [], isLoading: true, error: null, selectedBudgetId: null, viewMode: 'grid',
    filters: { searchTerm: '', period: 'all', status: 'all', categoryId: 'all', sortBy: 'name', sortDirection: 'asc' },
};

export function budgetsReducer(state: BudgetsViewState, action: BudgetAction): BudgetsViewState {
    switch (action.type) {
        case 'FETCH_START': return { ...state, isLoading: true, error: null };
        case 'FETCH_SUCCESS': return { ...state, isLoading: false, budgets: action.payload.budgets, transactions: action.payload.transactions, categories: action.payload.categories };
        case 'FETCH_ERROR': return { ...state, isLoading: false, error: action.payload };
        case 'CREATE_BUDGET_SUCCESS': return { ...state, budgets: { ...state.budgets, [action.payload.id]: action.payload } };
        case 'UPDATE_BUDGET_SUCCESS': return { ...state, budgets: { ...state.budgets, [action.payload.id]: action.payload } };
        case 'DELETE_BUDGET_SUCCESS':
            const newBudgets = { ...state.budgets };
            delete newBudgets[action.payload];
            const newTransactions = Object.fromEntries(Object.entries(state.transactions).filter(([_, t]) => t.budgetId !== action.payload));
            return { ...state, budgets: newBudgets, transactions: newTransactions, selectedBudgetId: null };
        case 'SET_SELECTED_BUDGET': return { ...state, selectedBudgetId: action.payload };
        case 'SET_VIEW_MODE': return { ...state, viewMode: action.payload };
        case 'UPDATE_FILTERS': return { ...state, filters: { ...state.filters, ...action.payload } };
        case 'SET_AI_INSIGHTS': return { ...state, aiInsights: action.payload };
        default: return state;
    }
}

export const BudgetsContext = createContext<{ state: BudgetsViewState; dispatch: React.Dispatch<BudgetAction>; api: MockApiService; } | undefined>(undefined);
export const useBudgetsContext = () => {
    const context = useContext(BudgetsContext);
    if (!context) throw new Error('useBudgetsContext must be used within a BudgetsProvider');
    return context;
};

// Notification Context
const NotificationContext = createContext<(message: string, type?: NotificationType) => void>(() => {});
export const useNotification = () => useContext(NotificationContext);

// SECTION: UTILITY & HELPER FUNCTIONS
// =================================================================================================

export function formatCurrency(amount: number, currency: string = DEFAULT_CURRENCY): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function getPeriodDateRange(period: BudgetPeriod, startDateStr: string): { startDate: Date; endDate: Date, totalDays: number } {
    const startDate = new Date(startDateStr);
    let endDate: Date;
    switch (period) {
        case BudgetPeriod.Weekly: endDate = new Date(startDate); endDate.setDate(startDate.getDate() + 7); break;
        case BudgetPeriod.Monthly: endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); endDate.setHours(23, 59, 59, 999); break;
        case BudgetPeriod.Quarterly: endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0); endDate.setHours(23, 59, 59, 999); break;
        case BudgetPeriod.Yearly: endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), 0); endDate.setHours(23, 59, 59, 999); break;
        default: endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0); endDate.setHours(23, 59, 59, 999);
    }
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return { startDate, endDate, totalDays };
}

export function getDaysLeftInPeriod(period: BudgetPeriod, startDateStr: string): { daysLeft: number, daysInto: number, totalDays: number } {
    const { startDate, endDate, totalDays } = getPeriodDateRange(period, startDateStr);
    const today = new Date();
    const diffTimeEnd = Math.max(0, endDate.getTime() - today.getTime());
    const daysLeft = Math.ceil(diffTimeEnd / (1000 * 60 * 60 * 24));
    const diffTimeStart = Math.max(0, today.getTime() - startDate.getTime());
    const daysInto = Math.floor(diffTimeStart / (1000 * 60 * 60 * 24));
    return { daysLeft, daysInto, totalDays };
}

export function useModal() {
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    return { isOpen, open, close };
}

// SECTION: AI CONSEJERO - The AI Architect's Assistant
// =================================================================================================

export class AIConsejero {
    constructor(private enrichedBudgets: BudgetWithDetails[], private state: BudgetsViewState) {}

    public runStructuralIntegrityAnalysis(): AIInsight[] {
        const insights: AIInsight[] = [];
        this.enrichedBudgets.forEach(budget => {
            insights.push(...this.analyzeOverspending(budget));
            insights.push(...this.analyzePacing(budget));
            insights.push(...this.analyzeTransactionPatterns(budget));
            insights.push(...this.analyzeSubscriptionLeakage(budget));
            insights.push(...this.analyzeRolloverPotential(budget));
        });
        insights.push(...this.generateGlobalInsights());
        return insights.sort((a, b) => {
             const levelOrder = { [AIInsightLevel.Critical]: 0, [AIInsightLevel.Warning]: 1, [AIInsightLevel.Suggestion]: 2, [AIInsightLevel.Info]: 3 };
             return levelOrder[a.level] - levelOrder[b.level];
        });
    }

    private analyzeOverspending(budget: BudgetWithDetails): AIInsight[] {
        if (budget.status === 'overspent') {
            return [{
                id: `insight-${budget.id}-overspent`, budgetId: budget.id, title: 'Covenant Breached: Overspent', level: AIInsightLevel.Critical,
                analysis: `You have exceeded your ${formatCurrency(budget.amount)} budget for "${budget.name}" by ${formatCurrency(budget.spentAmount - budget.amount)}. This requires immediate attention to prevent further financial strain.`,
                timestamp: new Date().toISOString(), actions: [{ label: 'Review Transactions', action: (d) => d({type: 'SET_SELECTED_BUDGET', payload: budget.id}) }, { label: 'Adjust Budget', action: () => console.log(`Adjusting ${budget.id}`) }]
            }];
        }
        return [];
    }

    private analyzePacing(budget: BudgetWithDetails): AIInsight[] {
        const periodProgress = budget.periodTotalDays > 0 ? (budget.daysIntoPeriod / budget.periodTotalDays) * 100 : 0;
        if (budget.progress > periodProgress + 15 && budget.status !== 'overspent') {
             return [{
                id: `insight-${budget.id}-pacing`, budgetId: budget.id, title: 'High Stress on Covenant', level: AIInsightLevel.Warning,
                analysis: `You've spent ${budget.progress.toFixed(0)}% of your "${budget.name}" budget, but are only ${periodProgress.toFixed(0)}% through the period. Your current spending pace may lead to overspending.`,
                timestamp: new Date().toISOString(), actions: [{ label: 'View Spending Pace Chart', action: (d) => d({type: 'SET_SELECTED_BUDGET', payload: budget.id}) }]
            }];
        }
        return [];
    }
    
    private analyzeTransactionPatterns(budget: BudgetWithDetails): AIInsight[] {
        const smallFrequentTransactions = budget.transactions.filter(t => t.amount < 20);
        if (smallFrequentTransactions.length > 15) {
             const totalFromSmall = smallFrequentTransactions.reduce((sum, t) => sum + t.amount, 0);
             if (budget.spentAmount > 0 && totalFromSmall / budget.spentAmount > 0.4) {
                return [{
                    id: `insight-${budget.id}-patterns`, budgetId: budget.id, title: 'Analysis: Thousand Small Pressures', level: AIInsightLevel.Suggestion,
                    analysis: `A significant portion (${formatCurrency(totalFromSmall)}) of your spending in "${budget.name}" comes from numerous small purchases. Bundling these needs could strengthen this covenant.`,
                    timestamp: new Date().toISOString(), actions: [{ label: 'See Small Transactions', action: (d) => d({type: 'SET_SELECTED_BUDGET', payload: budget.id}) }]
                }];
             }
        }
        return [];
    }
    
    private analyzeSubscriptionLeakage(budget: BudgetWithDetails): AIInsight[] {
        if(budget.name.toLowerCase().includes('subscription')) {
            const recurring = budget.transactions.filter(t => t.isRecurring);
            if(recurring.length > 3) {
                return [{
                    id: `insight-${budget.id}-subs`, budgetId: budget.id, title: 'Review Recurring Charges', level: AIInsightLevel.Suggestion,
                    analysis: `You have ${recurring.length} recurring charges in "${budget.name}". It's a good practice to review these periodically to ensure you're still getting value from each subscription.`,
                    timestamp: new Date().toISOString(), actions: [{ label: 'Review Subscriptions', action: (d) => d({type: 'SET_SELECTED_BUDGET', payload: budget.id}) }]
                }];
            }
        }
        return [];
    }

    private analyzeRolloverPotential(budget: BudgetWithDetails): AIInsight[] {
        if (budget.type === BudgetType.Rollover && budget.remainingAmount > 0 && budget.daysLeftInPeriod < 3) {
            return [{
                id: `insight-${budget.id}-rollover`, budgetId: budget.id, title: 'Surplus Allocation Opportunity', level: AIInsightLevel.Info,
                analysis: `You're on track to roll over ~${formatCurrency(budget.remainingAmount)} in your "${budget.name}" budget. This will strengthen your next period's financial position.`,
                timestamp: new Date().toISOString(), actions: [{ label: 'Allocate to Savings Goal', action: () => console.log('Feature: Allocate to Savings') }]
            }];
        }
        return [];
    }

    private generateGlobalInsights(): AIInsight[] {
        const insights: AIInsight[] = [];
        const totalBudgeted = this.enrichedBudgets.reduce((sum, b) => sum + b.amount, 0);
        const totalSpent = this.enrichedBudgets.reduce((sum, b) => sum + b.spentAmount, 0);
        if (totalBudgeted > 0 && totalSpent / totalBudgeted < 0.5) {
             insights.push({
                id: 'global-underspending', budgetId: 'all', title: 'Overall Financial Health is Strong', level: AIInsightLevel.Info,
                analysis: `Your overall spending is well within your established covenants. This disciplined approach is building a strong financial foundation.`,
                timestamp: new Date().toISOString(), actions: []
             });
        }
        return insights;
    }
}

// SECTION: UI COMPONENTS
// =================================================================================================

export const Spinner = () => ( <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500"></div></div> );
export const ErrorDisplay = ({ message }: { message: string }) => ( <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p className="font-bold">Error</p><p>{message}</p></div> );
export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg text-white border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                {children}
            </div>
        </div>
    );
};

export const SlideOverPanel = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div className={`fixed top-0 right-0 h-full bg-gray-900 shadow-2xl w-full max-w-2xl text-white border-l border-gray-700 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto h-[calc(100vh-73px)]">{children}</div>
            </div>
        </div>
    );
};

export const NotificationToast = ({ notification, onDismiss }: { notification: Notification, onDismiss: (id: NotificationId) => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(notification.id), 5000);
        return () => clearTimeout(timer);
    }, [notification.id, onDismiss]);

    const colors = {
        success: { bg: 'bg-green-500', icon: <CheckCircle /> },
        error: { bg: 'bg-red-500', icon: <AlertTriangle /> },
        info: { bg: 'bg-cyan-500', icon: <Info /> },
    };

    return (
        <div className={`flex items-center text-white p-4 rounded-lg shadow-lg ${colors[notification.type].bg}`}>
            <div className="mr-3">{colors[notification.type].icon}</div>
            <div>{notification.message}</div>
            <button onClick={() => onDismiss(notification.id)} className="ml-4 text-white"><X size={18} /></button>
        </div>
    );
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    const addNotification = useCallback((message: string, type: NotificationType = 'info') => {
        const id = `notif-${Date.now()}`;
        setNotifications(prev => [...prev, { id, message, type }]);
    }, []);

    const dismissNotification = useCallback((id: NotificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={addNotification}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 space-y-3">
                {notifications.map(n => <NotificationToast key={n.id} notification={n} onDismiss={dismissNotification} />)}
            </div>
        </NotificationContext.Provider>
    );
};

export const RadialBarChart = ({ progress, status }: { progress: number; status: 'healthy' | 'warning' | 'overspent' }) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (clampedProgress / 100) * circumference;
    const colorMap = { healthy: 'stroke-cyan-400', warning: 'stroke-amber-400', overspent: 'stroke-red-500' };
    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
                <circle className={`${colorMap[status]} transition-all duration-500`} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" transform="rotate(-90 60 60)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className={`text-2xl font-bold ${progress > 100 ? 'text-red-500' : 'text-white'}`}>{progress.toFixed(0)}%</span><span className="text-xs text-gray-400">Spent</span></div>
        </div>
    );
};

export const BudgetCard = ({ budget, onEdit, onDelete }: { budget: BudgetWithDetails; onEdit: () => void; onDelete: () => void; }) => {
    const { dispatch } = useBudgetsContext();
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-between hover:border-cyan-500 transition-colors duration-300">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-white">{budget.name}</h3>
                        <p className="text-sm text-gray-400">{budget.description || `A ${budget.period} covenant.`}</p>
                    </div>
                    <div className="flex gap-2">
                         <button onClick={onEdit} className="text-gray-400 hover:text-white"><Edit size={16} /></button>
                         <button onClick={onDelete} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                </div>
                <div className="flex items-center justify-between my-4">
                    <div className="flex-1 pr-4">
                        <p className="text-sm text-gray-400">Spent</p>
                        <p className="text-xl font-semibold text-white">{formatCurrency(budget.spentAmount)}</p>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                            <div className={`h-2.5 rounded-full ${budget.status === 'healthy' ? 'bg-cyan-500' : budget.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(budget.progress, 100)}%` }}></div>
                        </div>
                    </div>
                    <RadialBarChart progress={budget.progress} status={budget.status} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-400">Remaining</p><p className={`font-medium ${budget.remainingAmount < 0 ? 'text-red-500' : 'text-green-400'}`}>{formatCurrency(budget.remainingAmount)}</p></div>
                    <div><p className="text-gray-400">Total Budget</p><p className="font-medium text-white">{formatCurrency(budget.amount)}</p></div>
                    <div><p className="text-gray-400">Days Left</p><p className="font-medium text-white">{budget.daysLeftInPeriod}</p></div>
                    <div><p className="text-gray-400">Avg Daily Spend</p><p className="font-medium text-white">{formatCurrency(budget.currentDailySpend)}</p></div>
                </div>
            </div>
             <button onClick={() => dispatch({ type: 'SET_SELECTED_BUDGET', payload: budget.id })} className="mt-4 w-full bg-gray-700 text-white py-2 rounded-md hover:bg-cyan-600 transition-colors">View Details</button>
        </div>
    );
};

export const BudgetFiltersPanel = () => {
    const { state, dispatch } = useBudgetsContext();
    const { filters, categories, viewMode } = state;

    const handleFilterChange = (key: keyof BudgetFilters, value: any) => dispatch({ type: 'UPDATE_FILTERS', payload: { [key]: value } });

    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search covenants..." value={filters.searchTerm} onChange={e => handleFilterChange('searchTerm', e.target.value)} className="bg-gray-700 border border-gray-600 text-white rounded-md w-full pl-10 pr-4 py-2 focus:ring-cyan-500 focus:border-cyan-500"/></div>
            <select value={filters.period} onChange={e => handleFilterChange('period', e.target.value)} className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"><option value="all">All Periods</option>{Object.values(BudgetPeriod).map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}</select>
            <select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"><option value="all">All Statuses</option><option value="healthy">Healthy</option><option value="warning">Warning</option><option value="overspent">Overspent</option></select>
            <select value={filters.categoryId} onChange={e => handleFilterChange('categoryId', e.target.value)} className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"><option value="all">All Categories</option>{Object.values(categories).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <div className="flex bg-gray-700 rounded-md"><button onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })} className={`p-2 rounded-l-md ${viewMode === 'grid' ? 'bg-cyan-600' : 'hover:bg-gray-600'}`}><LayoutGrid size={20}/></button><button onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'list' })} className={`p-2 rounded-r-md ${viewMode === 'list' ? 'bg-cyan-600' : 'hover:bg-gray-600'}`}><List size={20}/></button></div>
        </div>
    );
};

export const AIConsejeroPanel = () => {
    const { state, dispatch } = useBudgetsContext();
    const addNotification = useNotification();
    const levelStyles = {
        [AIInsightLevel.Critical]: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-900/20' },
        [AIInsightLevel.Warning]: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-900/20' },
        [AIInsightLevel.Suggestion]: { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-900/20' },
        [AIInsightLevel.Info]: { icon: Info, color: 'text-gray-400', bg: 'bg-gray-700/20' },
    };

    return (
        <aside className="w-96 bg-gray-800/50 p-6 rounded-lg flex flex-col flex-shrink-0">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Zap className="text-cyan-400" />AI Consejero</h2>
            <p className="text-gray-400 mb-6">Your architectural assistant for financial integrity.</p>
            <div className="flex-grow overflow-y-auto space-y-4 pr-2 -mr-2">
                {state.aiInsights.length === 0 && <p className="text-gray-500">No new insights. All structures appear sound.</p>}
                {state.aiInsights.map(insight => {
                    const styles = levelStyles[insight.level];
                    return (
                        <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${styles.bg} border-current ${styles.color}`}>
                            <div className="flex items-center gap-3"><styles.icon size={20} /><h4 className="font-bold text-white">{insight.title}</h4></div>
                            <p className="text-sm text-gray-300 mt-2">{insight.analysis}</p>
                            {insight.actions.length > 0 && (
                                <div className="mt-3 flex gap-2">
                                    {insight.actions.map(action => (
                                        <button key={action.label} onClick={() => { action.action(dispatch); addNotification(action.label, 'info'); }} className="text-xs bg-gray-700 hover:bg-cyan-600 px-2 py-1 rounded text-white">{action.label}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export const BudgetDetailView = ({ budget, onClose }: { budget: BudgetWithDetails | undefined, onClose: () => void }) => {
    if(!budget) return null;

    const historicalData = useMemo(() => generateHistoricalPerformance(budget), [budget]);

    return (
        <SlideOverPanel isOpen={!!budget} onClose={onClose} title={budget.name}>
            <div className="space-y-8">
                 <section>
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Current Period Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-gray-800 p-4 rounded-lg"><p className="text-sm text-gray-400">Total Budget</p><p className="text-2xl font-bold">{formatCurrency(budget.amount)}</p></div>
                        <div className="bg-gray-800 p-4 rounded-lg"><p className="text-sm text-gray-400">Amount Spent</p><p className="text-2xl font-bold">{formatCurrency(budget.spentAmount)}</p></div>
                        <div className={`bg-gray-800 p-4 rounded-lg ${budget.remainingAmount < 0 ? 'text-red-500' : 'text-green-400'}`}><p className="text-sm text-gray-400">Remaining</p><p className="text-2xl font-bold">{formatCurrency(budget.remainingAmount)}</p></div>
                        <div className="bg-gray-800 p-4 rounded-lg"><p className="text-sm text-gray-400">Days Left</p><p className="text-2xl font-bold">{budget.daysLeftInPeriod}</p></div>
                    </div>
                 </section>

                 <section>
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2"><History size={20}/>Historical Performance</h3>
                     <div className="h-64 bg-gray-800 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historicalData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis dataKey="periodLabel" stroke="#A0AEC0" />
                                <YAxis stroke="#A0AEC0" tickFormatter={(value) => `$${value}`} />
                                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                                <Legend wrapperStyle={{ color: '#A0AEC0' }}/>
                                <Bar dataKey="budgetedAmount" fill="#00A3C4" name="Budgeted" />
                                <Bar dataKey="spentAmount" fill="#FF9800" name="Spent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </section>

                 <section>
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2"><Banknote size={20}/>Transactions This Period</h3>
                    <div className="bg-gray-800 rounded-lg">
                        {budget.transactions.length === 0 ? (
                            <p className="text-gray-500 p-4">No transactions recorded for this period.</p>
                        ) : (
                            <ul className="divide-y divide-gray-700">
                                {budget.transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                                    <li key={t.id} className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{t.description}</p>
                                            <p className="text-sm text-gray-400">{t.merchant} &bull; {new Date(t.date).toLocaleDateString()}</p>
                                        </div>
                                        <p className="font-bold text-lg">{formatCurrency(t.amount)}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                 </section>
            </div>
        </SlideOverPanel>
    )
}

// SECTION: HOOKS
// =================================================================================================

export function useEnrichedBudgets(state: BudgetsViewState) {
    return useMemo(() => {
        const activeBudgets = Object.values(state.budgets).filter(b => !b.isArchived);
        const enriched = activeBudgets.map(budget => {
            const { startDate, period } = budget;
            const { startDate: periodStart, endDate: periodEnd } = getPeriodDateRange(period, startDate);
            const { daysLeft, daysInto, totalDays } = getDaysLeftInPeriod(period, startDate);

            const transactions = Object.values(state.transactions).filter(t => {
                const tDate = new Date(t.date);
                return t.budgetId === budget.id && tDate >= periodStart && tDate <= periodEnd;
            });
            
            const spentAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
            const remainingAmount = budget.amount - spentAmount;
            const progress = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : spentAmount > 0 ? 101 : 0;

            let status: 'healthy' | 'warning' | 'overspent' = 'healthy';
            if (progress >= 100) status = 'overspent';
            else if (budget.thresholds.some(th => progress >= th.percentage)) status = 'warning';
            
            return {
                 ...budget, transactions, spentAmount, remainingAmount, progress, daysLeftInPeriod: daysLeft, daysIntoPeriod: daysInto, periodTotalDays: totalDays, status,
                 recommendedDailySpend: daysLeft > 0 ? Math.max(0, remainingAmount) / daysLeft : 0,
                 currentDailySpend: daysInto > 0 ? spentAmount / daysInto : spentAmount,
                 categories: budget.categoryIds.map(id => state.categories[id]).filter(Boolean),
                 historicalPerformance: [],
            };
        });

        const { searchTerm, period, status, categoryId, sortBy, sortDirection } = state.filters;
        const filtered = enriched.filter(b => {
             const searchTermMatch = searchTerm === '' || b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.description?.toLowerCase().includes(searchTerm.toLowerCase());
             const periodMatch = period === 'all' || b.period === period;
             const statusMatch = status === 'all' || b.status === status;
             const categoryMatch = categoryId === 'all' || b.categoryIds.includes(categoryId);
             return searchTermMatch && periodMatch && statusMatch && categoryMatch;
        });

        return filtered.sort((a,b) => {
            let compare = 0;
            if(sortBy === 'name') compare = a.name.localeCompare(b.name);
            else if(sortBy === 'amount') compare = a.amount - b.amount;
            else if(sortBy === 'progress') compare = a.progress - b.progress;
            return sortDirection === 'asc' ? compare : -compare;
        });
        
    }, [state.budgets, state.transactions, state.categories, state.filters]);
}

// SECTION: MAIN VIEW COMPONENT
// =================================================================================================

export const BudgetsView = () => {
    const [state, dispatch] = useReducer(budgetsReducer, initialState);
    const enrichedBudgets = useEnrichedBudgets(state);
    const selectedBudgetDetails = useMemo(() => enrichedBudgets.find(b => b.id === state.selectedBudgetId), [enrichedBudgets, state.selectedBudgetId]);
    const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

    useEffect(() => {
        apiService.getAllData().then(({ budgets, transactions, categories }) => {
            dispatch({ type: 'FETCH_SUCCESS', payload: {
                budgets: budgets.reduce((acc, b) => ({ ...acc, [b.id]: b }), {}),
                transactions: transactions.reduce((acc, t) => ({ ...acc, [t.id]: t }), {}),
                categories: categories.reduce((acc, c) => ({ ...acc, [c.id]: c }), {}),
            }});
        }).catch(err => dispatch({ type: 'FETCH_ERROR', payload: 'Failed to load financial data.' }));
    }, []);

    useEffect(() => {
        if(enrichedBudgets.length > 0) {
            const ai = new AIConsejero(enrichedBudgets, state);
            dispatch({ type: 'SET_AI_INSIGHTS', payload: ai.runStructuralIntegrityAnalysis() });
        }
    }, [enrichedBudgets, state.filters]); // Re-run AI on filter change

    const contextValue = useMemo(() => ({ state, dispatch, api: apiService }), [state]);

    const handleEdit = (budget: Budget) => { setEditingBudget(budget); openForm(); };
    const handleDelete = (budgetId: BudgetId) => {
        if(window.confirm('Are you sure you want to delete this covenant? This action cannot be undone.')) {
            apiService.deleteBudget(budgetId).then(() => dispatch({ type: 'DELETE_BUDGET_SUCCESS', payload: budgetId }));
        }
    };
    const handleFormClose = () => { setEditingBudget(null); closeForm(); };


    if (state.isLoading) return <div className="h-screen bg-gray-900 flex items-center justify-center"><Spinner /></div>;
    if (state.error) return <div className="h-screen bg-gray-900 flex items-center justify-center"><ErrorDisplay message={state.error} /></div>;

    return (
        <BudgetsContext.Provider value={contextValue}>
        <NotificationProvider>
            <div className="bg-gray-900 text-white min-h-screen p-8 font-sans">
                <main className="max-w-screen-2xl mx-auto">
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold">The Covenants of Will</h1>
                            <p className="text-gray-400 mt-2">Architectural blueprints for your financial life.</p>
                        </div>
                        <button onClick={openForm} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"><Plus size={20} />New Covenant</button>
                    </header>
                    
                    <div className="flex gap-8">
                        <div className="flex-grow">
                            <BudgetFiltersPanel />
                            {state.viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {enrichedBudgets.map(budget => <BudgetCard key={budget.id} budget={budget} onEdit={() => handleEdit(budget)} onDelete={() => handleDelete(budget.id)} />)}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    { /* List view component would go here */ }
                                    <p className="text-center text-gray-500 py-8">List view is under construction.</p>
                                </div>
                            )}

                            {enrichedBudgets.length === 0 && (
                                <div className="text-center py-20 bg-gray-800 rounded-lg"><p className="text-gray-400">No covenants match your criteria.</p><p className="text-gray-500 text-sm mt-2">Try adjusting your filters or creating a new covenant.</p></div>
                            )}
                        </div>
                        <AIConsejeroPanel />
                    </div>
                </main>
                
                <Modal isOpen={isFormOpen} onClose={handleFormClose} title={editingBudget ? "Edit Covenant" : "Create New Covenant"}>
                    <p className="p-4">Budget form component placeholder. A complete form would include fields for name, amount, period, categories, etc., with validation and submission logic.</p>
                </Modal>
                <BudgetDetailView budget={selectedBudgetDetails} onClose={() => dispatch({type: 'SET_SELECTED_BUDGET', payload: null})} />
            </div>
        </NotificationProvider>
        </BudgetsContext.Provider>
    );
};

export default BudgetsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/BudgetsView.tsx.md
================================================================================


# The Covenants of Will

These are the Covenants of Spending, the self-imposed architectural blueprints that give structure to your financial life. A budget is not a restriction; it is a declaration of intent. It is the deliberate channeling of resources toward what is truly valued. To honor these covenants is to build a life where every expenditure is an affirmation of your principles.

---

### A Fable for the Builder: The Architect's Workshop

(What is a budget? Most see it as a cage. A set of rules to restrict freedom. A necessary evil. We see it differently. We see it as an act of architecture. A budget is not a cage you are put into. It is a cathedral you build for your own life, a space designed to elevate your highest intentions.)

(When you create a budget in this view, you are not just setting a spending limit. You are making a covenant with your future self. You are declaring, "This is what I value. This is the shape of the life I intend to build." The AI, the `AIConsejero`, understands this. It sees itself not as a guard, but as a fellow architect, helping you to ensure your creation is sound.)

(Its core logic here is what we call 'Structural Integrity Analysis.' It looks at the covenants you have made—your budgets—and compares them to the actual forces being exerted upon them—your transactions. The beautiful `RadialBarChart` is its real-time stress test. The filling of the circle is the rising load on that pillar of your cathedral.)

(When a budget is strained, when the color shifts from cool cyan to warning amber, the AI does not sound a simple alarm. It analyzes the nature of the stress. Is it a single, heavy, unexpected load? Or is it a thousand small, persistent pressures? Its advice is tailored to the diagnosis. It doesn't just say, "You are overspending." It says, "The pressure on your 'Dining' covenant is consistently high. Perhaps the covenant itself was not built to withstand the reality of your life. Shall we consider redesigning it?")

(This is the difference between a tool and a partner. A tool tells you when you've broken a rule. A partner helps you write better rules. The AI is here not to enforce your budgets, but to help you design budgets that are a true and honest reflection of the life you want to live. It is helping you build a cathedral that is not only beautiful in its design, but strong enough to stand.)


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/BudgetsView.tsx.md
================================================================================


# The Covenants of Will

These are the Covenants of Spending, the self-imposed architectural blueprints that give structure to your financial life. A budget is not a restriction; it is a declaration of intent. It is the deliberate channeling of resources toward what is truly valued. To honor these covenants is to build a life where every expenditure is an affirmation of your principles.

---

### A Fable for the Builder: The Architect's Workshop

(What is a budget? Most see it as a cage. A set of rules to restrict freedom. A necessary evil. We see it differently. We see it as an act of architecture. A budget is not a cage you are put into. It is a cathedral you build for your own life, a space designed to elevate your highest intentions.)

(When you create a budget in this view, you are not just setting a spending limit. You are making a covenant with your future self. You are declaring, "This is what I value. This is the shape of the life I intend to build." The AI, the `AIConsejero`, understands this. It sees itself not as a guard, but as a fellow architect, helping you to ensure your creation is sound.)

(Its core logic here is what we call 'Structural Integrity Analysis.' It looks at the covenants you have made—your budgets—and compares them to the actual forces being exerted upon them—your transactions. The beautiful `RadialBarChart` is its real-time stress test. The filling of the circle is the rising load on that pillar of your cathedral.)

(When a budget is strained, when the color shifts from cool cyan to warning amber, the AI does not sound a simple alarm. It analyzes the nature of the stress. Is it a single, heavy, unexpected load? Or is it a thousand small, persistent pressures? Its advice is tailored to the diagnosis. It doesn't just say, "You are overspending." It says, "The pressure on your 'Dining' covenant is consistently high. Perhaps the covenant itself was not built to withstand the reality of your life. Shall we consider redesigning it?")

(This is the difference between a tool and a partner. A tool tells you when you've broken a rule. A partner helps you write better rules. The AI is here not to enforce your budgets, but to help you design budgets that are a true and honest reflection of the life you want to live. It is helping you build a cathedral that is not only beautiful in its design, but strong enough to stand.)
