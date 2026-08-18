// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankEventGridView.tsx
================================================================================

// components/views/platform/DemoBankEventGridView.tsx
import React, { useState, useEffect, useCallback, useMemo, createContext, useContext, useRef, useReducer, ReactNode } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai"; // Assuming this is available, will mock interaction

// --- GLOBAL CONSTANTS & CONFIGURATION ---
const EVENT_STREAM_INTERVAL_MS = 2000;
const MAX_EVENTS_IN_MEMORY = 1000;
const PAGINATION_PAGE_SIZE = 50;
const NOTIFICATION_DISPLAY_TIME_MS = 5000;
const AUDIT_LOG_RETENTION_DAYS = 90;
const AI_MODEL_NAME = 'gemini-2.5-flash';
const MOCK_API_LATENCY_MS = 300;
const DEBOUNCE_DELAY_MS = 500;
const MOCK_USERS = ['ops-user-01', 'fraud-analyst-02', 'support-agent-03', 'system-admin-01'];

// --- UTILITY FUNCTIONS ---
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(date: Date, includeTime: boolean = true): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...(includeTime && { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function getUniqueId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime()) as any;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item)) as any;
    }
    const cloned: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone((obj as any)[key]);
        }
    }
    return cloned as T;
}

export function getEventSeverityColor(severity: EventSeverity): string {
    switch (severity) {
        case EventSeverity.Critical: return 'text-red-400 bg-red-900/30 border border-red-700';
        case EventSeverity.High: return 'text-orange-400 bg-orange-900/30 border border-orange-700';
        case EventSeverity.Medium: return 'text-yellow-400 bg-yellow-900/30 border border-yellow-700';
        case EventSeverity.Low: return 'text-green-400 bg-green-900/30 border border-green-700';
        default: return 'text-gray-400 bg-gray-700/30 border border-gray-600';
    }
}

export function getEventStatusColor(status: EventStatus): string {
    switch (status) {
        case EventStatus.Pending: return 'text-yellow-400 bg-yellow-900/30';
        case EventStatus.Processed: return 'text-green-400 bg-green-900/30';
        case EventStatus.Failed: return 'text-red-400 bg-red-900/30';
        case EventStatus.Acknowledged: return 'text-blue-400 bg-blue-900/30';
        case EventStatus.Resolved: return 'text-teal-400 bg-teal-900/30';
        case EventStatus.Warning: return 'text-orange-400 bg-orange-900/30';
        case EventStatus.Info: return 'text-gray-400 bg-gray-700/30';
        case EventStatus.Completed: return 'text-green-400 bg-green-900/30';
        case EventStatus.Canceled: return 'text-gray-500 bg-gray-800/30';
        default: return 'text-gray-400 bg-gray-700/30';
    }
}

// --- ENUMS & INTERFACES ---

export enum EventCategory {
    Transaction = 'Transaction',
    Security = 'Security',
    AccountManagement = 'AccountManagement',
    System = 'System',
    Compliance = 'Compliance',
    Marketing = 'Marketing',
    Login = 'Login',
    Fraud = 'Fraud',
    CustomerSupport = 'CustomerSupport'
}

export enum EventType {
    // Transaction events
    Deposit = 'Deposit', Withdrawal = 'Withdrawal', Transfer = 'Transfer', PaymentIn = 'PaymentIn',
    PaymentOut = 'PaymentOut', BillPay = 'BillPay', Purchase = 'Purchase', Refund = 'Refund', FeeCharged = 'FeeCharged',

    // Security events
    LoginSuccess = 'LoginSuccess', LoginFailure = 'LoginFailure', PasswordChange = 'PasswordChange',
    TwoFactorAuthAttempt = 'TwoFactorAuthAttempt', SecurityAlert = 'SecurityAlert', IPAddressChange = 'IPAddressChange',
    DeviceEnrollment = 'DeviceEnrollment', SessionTimeout = 'SessionTimeout',

    // Account Management events
    AccountOpened = 'AccountOpened', AccountClosed = 'AccountClosed', ProfileUpdate = 'ProfileUpdate',
    AddressChange = 'AddressChange', CardIssued = 'CardIssued', CardBlocked = 'CardBlocked',
    StatementGenerated = 'StatementGenerated', CreditLimitChange = 'CreditLimitChange', LoanApplication = 'LoanApplication',

    // System events
    SystemMaintenance = 'SystemMaintenance', APILimitExceeded = 'APILimitExceeded', ServiceDegradation = 'ServiceDegradation',
    DataExport = 'DataExport', DatabaseError = 'DatabaseError', CacheInvalidation = 'CacheInvalidation',

    // Compliance events
    KYCReviewNeeded = 'KYCReviewNeeded', AMLFlagged = 'AMLFlagged', RegulatoryReportGenerated = 'RegulatoryReportGenerated',
    SanctionScreeningHit = 'SanctionScreeningHit',

    // Marketing events
    OfferAccepted = 'OfferAccepted', ProductApplication = 'ProductApplication', NewsletterSubscription = 'NewsletterSubscription',

    // Fraud events
    PotentialFraudAlert = 'PotentialFraudAlert', TransactionReviewRequired = 'TransactionReviewRequired',
    ChargebackInitiated = 'ChargebackInitiated', FraudCaseOpened = 'FraudCaseOpened',

    // Customer Support events
    SupportTicketCreated = 'SupportTicketCreated', SupportTicketResolved = 'SupportTicketResolved',
    LiveChatStarted = 'LiveChatStarted', ComplaintFiled = 'ComplaintFiled'
}

export enum EventSeverity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Critical = 'Critical',
    Informational = 'Informational'
}

export enum EventStatus {
    Pending = 'Pending', Processed = 'Processed', Failed = 'Failed', Acknowledged = 'Acknowledged',
    Resolved = 'Resolved', Warning = 'Warning', Info = 'Info', Canceled = 'Canceled', Completed = 'Completed'
}

export interface BankEventData {
    amount?: number; currency?: string; fromAccount?: string; toAccount?: string; beneficiary?: string;
    merchant?: string; description?: string; loginAttemptIp?: string; userId?: string; accountId?: string;
    deviceId?: string; fraudScore?: number; reason?: string; details?: string; oldValue?: string;
    newValue?: string; statusDetail?: string; channel?: 'Web' | 'Mobile' | 'API' | 'Branch' | 'ATM' | 'POS';
    transactionId?: string; sessionDuration?: number; geographicalLocation?: string;
    cardType?: 'Visa' | 'MasterCard' | 'Amex' | 'Discover'; lastFourDigits?: string;
    documentType?: 'ID' | 'Passport' | 'DriverLicense'; serviceImpact?: 'None' | 'Partial' | 'Full';
    riskScore?: number; targetSystem?: string; complianceRuleId?: string; marketingCampaignId?: string;
    ticketId?: string; agentId?: string; resolutionTime?: number;
}

export interface EventNote {
    id: string; timestamp: Date; userId: string; content: string;
}

export interface BankEvent {
    id: string; timestamp: Date; category: EventCategory; type: EventType; severity: EventSeverity;
    status: EventStatus; source: string; metadata: BankEventData; correlationId?: string;
    tags: string[]; isAcknowledged: boolean; acknowledgedBy?: string; acknowledgmentTime?: Date;
    notes: EventNote[];
}

export interface AdvancedFilter {
    key: string; operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty';
    value: string | number | boolean | null;
}

export interface EventFilter {
    category?: EventCategory[]; type?: EventType[]; severity?: EventSeverity[]; status?: EventStatus[];
    source?: string[]; minAmount?: number; maxAmount?: number; startDate?: Date | null; endDate?: Date | null;
    searchText?: string; userId?: string; accountId?: string; fraudFlagged?: boolean;
    advancedFilters?: AdvancedFilter[]; tags?: string[]; isAcknowledged?: boolean;
}

export interface SortConfig {
    key: keyof BankEvent | `metadata.${keyof BankEventData}` | 'timestamp';
    direction: 'asc' | 'desc';
}

export interface PaginationConfig {
    currentPage: number; pageSize: number; totalItems: number;
}

export interface AlertRule {
    id: string; name: string; description: string; criteria: EventFilter; targetSeverity: EventSeverity;
    action: 'notify_email' | 'notify_sms' | 'create_ticket' | 'trigger_fraud_review' | 'escalate_to_team';
    isActive: boolean; createdAt: Date; updatedAt: Date; lastTriggered?: Date;
    triggerCount: number; cooldownPeriodMinutes?: number; notificationRecipients: string[];
}

export interface ActiveAlert {
    id: string; ruleId: string; eventId: string; timestamp: Date; message: string; severity: EventSeverity;
    isResolved: boolean; resolvedBy?: string; resolvedAt?: Date; notes: string[];
}

export interface UserActivity {
    id:string; timestamp: Date; userId: string; action: string; details: Record<string, any>;
}

export interface SystemHealthMetric {
    id: string; timestamp: Date; metricName: 'event_ingestion_rate' | 'avg_processing_latency' | 'db_connection_health' | 'api_error_rate';
    value: number; unit: 'eps' | 'ms' | '%' | 'count'; status: 'healthy' | 'degraded' | 'critical';
}

export interface UserPreferences {
    theme: 'dark' | 'light';
    defaultPageSize: number;
    timezone: string;
    notifications: {
        emailOnCritical: boolean;
        smsOnCritical: boolean;
        toastOnHigh: boolean;
    };
}

// --- MOCK DATA GENERATION ---
const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, decimals: number = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const generateMockBankEvent = (): BankEvent => {
    const category = randomElement(Object.values(EventCategory));
    const typeMapping: Record<EventCategory, EventType[]> = {
        [EventCategory.Transaction]: [EventType.Deposit, EventType.Withdrawal, EventType.Transfer, EventType.Purchase, EventType.PaymentOut],
        [EventCategory.Security]: [EventType.LoginFailure, EventType.LoginSuccess, EventType.PasswordChange, EventType.TwoFactorAuthAttempt],
        [EventCategory.AccountManagement]: [EventType.ProfileUpdate, EventType.CardIssued, EventType.CardBlocked],
        [EventCategory.System]: [EventType.APILimitExceeded, EventType.ServiceDegradation, EventType.DatabaseError],
        [EventCategory.Compliance]: [EventType.KYCReviewNeeded, EventType.AMLFlagged, EventType.SanctionScreeningHit],
        [EventCategory.Marketing]: [EventType.OfferAccepted, EventType.ProductApplication],
        [EventCategory.Login]: [EventType.LoginSuccess, EventType.LoginFailure, EventType.SessionTimeout],
        [EventCategory.Fraud]: [EventType.PotentialFraudAlert, EventType.TransactionReviewRequired, EventType.ChargebackInitiated],
        [EventCategory.CustomerSupport]: [EventType.SupportTicketCreated, EventType.SupportTicketResolved]
    };
    const type = randomElement(typeMapping[category]);
    const severity = randomElement(Object.values(EventSeverity));
    const status = randomElement(Object.values(EventStatus));
    const source = randomElement(['Payments API', 'Auth Service', 'Core Banking', 'CRM', 'Fraud Detection Engine', 'Mobile App Gateway']);

    const metadata: BankEventData = {
        userId: `user-${randomInt(1000, 9999)}`,
        accountId: `acct-${randomInt(100000, 999999)}`,
        channel: randomElement(['Web', 'Mobile', 'API', 'Branch']),
        geographicalLocation: randomElement(['New York, US', 'London, UK', 'Tokyo, JP', 'Sydney, AU']),
    };

    if (category === EventCategory.Transaction || category === EventCategory.Fraud) {
        metadata.amount = randomFloat(5, 5000);
        metadata.currency = 'USD';
        metadata.transactionId = `txn_${getUniqueId()}`;
        metadata.merchant = randomElement(['Amazon', 'Starbucks', 'Walmart', 'Apple Store']);
        if (type === EventType.Transfer) {
            metadata.fromAccount = `acct-${randomInt(100000, 999999)}`;
            metadata.toAccount = `acct-${randomInt(100000, 999999)}`;
        }
    }
    if (category === EventCategory.Security) {
        metadata.loginAttemptIp = `${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}`;
        metadata.deviceId = `device-${getUniqueId()}`;
    }
    if (category === EventCategory.Fraud) {
        metadata.fraudScore = randomFloat(0.1, 0.99);
        metadata.riskScore = randomFloat(1, 100);
    }

    return {
        id: getUniqueId(),
        timestamp: new Date(Date.now() - randomInt(0, 1000 * 60 * 60 * 24 * 7)),
        category,
        type,
        severity,
        status,
        source,
        metadata,
        tags: severity === EventSeverity.Critical ? ['critical'] : [],
        isAcknowledged: false,
        notes: [],
    };
};

const generateInitialEvents = (count: number): BankEvent[] => {
    return Array.from({ length: count }, generateMockBankEvent).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// --- MOCK AI & API SERVICES ---
const mockAIService = {
    async analyzeText(prompt: string, context?: any): Promise<any> {
        console.log("AI Service request:", { prompt, context });
        await new Promise(resolve => setTimeout(resolve, MOCK_API_LATENCY_MS + randomInt(200, 800)));

        if (prompt.toLowerCase().includes("summarize")) {
            const count = context?.eventCount || 0;
            const highSeverityCount = context?.highSeverityCount || 0;
            return {
                summary: `Analyzed ${count} events. Found ${highSeverityCount} high or critical severity events. Key themes include frequent login failures from new IP addresses and several large, anomalous transactions requiring review.`,
                actionableInsights: [
                    'Investigate IP address `182.55.101.3` for repeated login failures.',
                    'Review transaction `txn_...` for potential fraud.',
                    'Consider tightening security policies for international transfers.'
                ]
            };
        }
        if (prompt.toLowerCase().includes("detect anomalies")) {
            return {
                anomalies: [
                    { eventId: context?.events[randomInt(0, context.events.length - 1)]?.id, reason: "Unusually high transaction amount for this user." },
                    { eventId: context?.events[randomInt(0, context.events.length - 1)]?.id, reason: "Login from a previously unseen geographical location." },
                ]
            };
        }
        if (prompt.toLowerCase().includes("natural language to filter")) {
            // Very basic NLP simulation
            let filter: EventFilter = {};
            if (context.query.includes("failed")) filter.status = [EventStatus.Failed];
            if (context.query.includes("transaction")) filter.category = [EventCategory.Transaction];
            if (context.query.includes("security")) filter.category = [EventCategory.Security];
            if (context.query.includes("critical")) filter.severity = [EventSeverity.Critical];
            const amountMatch = context.query.match(/\$\d+/);
            if (amountMatch) {
                filter.minAmount = parseInt(amountMatch[0].slice(1), 10);
            }
            return { filter };
        }
        return { error: "AI model could not process the request." };
    }
};

// --- STATE MANAGEMENT (useReducer) ---
type EventGridState = {
    allEvents: BankEvent[];
    filteredEvents: BankEvent[];
    selectedEvent: BankEvent | null;
    filters: EventFilter;
    sortConfig: SortConfig;
    pagination: PaginationConfig;
    isLoading: boolean;
    isStreaming: boolean;
    notifications: { id: string, message: string, severity: EventSeverity }[];
    alertRules: AlertRule[];
    activeAlerts: ActiveAlert[];
    aiAnalysisResult: any | null;
    isAILoading: boolean;
};

type Action =
    | { type: 'START_STREAMING' }
    | { type: 'STOP_STREAMING' }
    | { type: 'RECEIVE_NEW_EVENT'; payload: BankEvent }
    | { type: 'SET_FILTER'; payload: EventFilter }
    | { type: 'SET_SORT'; payload: SortConfig }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SELECT_EVENT'; payload: BankEvent | null }
    | { type: 'ACKNOWLEDGE_EVENT'; payload: { eventId: string; user: string } }
    | { type: 'ADD_NOTE'; payload: { eventId: string; note: EventNote } }
    | { type: 'ADD_NOTIFICATION'; payload: { message: string; severity: EventSeverity } }
    | { type: 'REMOVE_NOTIFICATION'; payload: string }
    | { type: 'SET_AI_LOADING'; payload: boolean }
    | { type: 'SET_AI_RESULT'; payload: any };

const initialState: EventGridState = {
    allEvents: generateInitialEvents(200),
    filteredEvents: [],
    selectedEvent: null,
    filters: {},
    sortConfig: { key: 'timestamp', direction: 'desc' },
    pagination: { currentPage: 1, pageSize: PAGINATION_PAGE_SIZE, totalItems: 0 },
    isLoading: true,
    isStreaming: true,
    notifications: [],
    alertRules: [], // Should be loaded from a config/API
    activeAlerts: [],
    aiAnalysisResult: null,
    isAILoading: false,
};

const filterAndSortEvents = (state: Pick<EventGridState, 'allEvents' | 'filters' | 'sortConfig'>): BankEvent[] => {
    const { allEvents, filters, sortConfig } = state;
    
    let filtered = allEvents.filter(event => {
        if (filters.category?.length && !filters.category.includes(event.category)) return false;
        if (filters.type?.length && !filters.type.includes(event.type)) return false;
        if (filters.severity?.length && !filters.severity.includes(event.severity)) return false;
        if (filters.status?.length && !filters.status.includes(event.status)) return false;
        if (filters.source?.length && !filters.source.includes(event.source)) return false;
        if (filters.isAcknowledged !== undefined && event.isAcknowledged !== filters.isAcknowledged) return false;
        if (filters.startDate && event.timestamp < filters.startDate) return false;
        if (filters.endDate && event.timestamp > filters.endDate) return false;
        if (filters.searchText) {
            const searchTerm = filters.searchText.toLowerCase();
            const searchable = `${event.type} ${event.source} ${JSON.stringify(event.metadata)}`.toLowerCase();
            if (!searchable.includes(searchTerm)) return false;
        }
        return true;
    });

    return filtered.sort((a, b) => {
        const aVal = sortConfig.key === 'timestamp' ? a.timestamp.getTime() : a[sortConfig.key as keyof BankEvent];
        const bVal = sortConfig.key === 'timestamp' ? b.timestamp.getTime() : b[sortConfig.key as keyof BankEvent];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
};

const reducer = (state: EventGridState, action: Action): EventGridState => {
    switch (action.type) {
        case 'START_STREAMING': return { ...state, isStreaming: true };
        case 'STOP_STREAMING': return { ...state, isStreaming: false };
        case 'RECEIVE_NEW_EVENT': {
            const newAllEvents = [action.payload, ...state.allEvents].slice(0, MAX_EVENTS_IN_MEMORY);
            const newState = { ...state, allEvents: newAllEvents };
            const filteredEvents = filterAndSortEvents(newState);
            return { ...newState, filteredEvents, pagination: { ...state.pagination, totalItems: filteredEvents.length } };
        }
        case 'SET_FILTER': {
            const newState = { ...state, filters: action.payload, pagination: { ...state.pagination, currentPage: 1 } };
            const filteredEvents = filterAndSortEvents(newState);
            return { ...newState, filteredEvents, pagination: { ...state.pagination, totalItems: filteredEvents.length, currentPage: 1 } };
        }
        case 'SET_SORT': {
            const newState = { ...state, sortConfig: action.payload };
            const filteredEvents = filterAndSortEvents(newState);
            return { ...newState, filteredEvents };
        }
        case 'SET_PAGE': return { ...state, pagination: { ...state.pagination, currentPage: action.payload } };
        case 'SELECT_EVENT': return { ...state, selectedEvent: action.payload };
        case 'ACKNOWLEDGE_EVENT': {
            const newAllEvents = state.allEvents.map(e => e.id === action.payload.eventId ? { ...e, isAcknowledged: true, acknowledgedBy: action.payload.user, acknowledgmentTime: new Date() } : e);
            const newState = { ...state, allEvents: newAllEvents };
            return { ...newState, filteredEvents: filterAndSortEvents(newState), selectedEvent: newState.selectedEvent?.id === action.payload.eventId ? newAllEvents.find(e => e.id === action.payload.eventId) || null : state.selectedEvent };
        }
        case 'ADD_NOTE': {
            const newAllEvents = state.allEvents.map(e => e.id === action.payload.eventId ? { ...e, notes: [...e.notes, action.payload.note] } : e);
            const newState = { ...state, allEvents: newAllEvents };
             return { ...newState, filteredEvents: filterAndSortEvents(newState), selectedEvent: newState.selectedEvent?.id === action.payload.eventId ? newAllEvents.find(e => e.id === action.payload.eventId) || null : state.selectedEvent };
        }
        case 'ADD_NOTIFICATION': return { ...state, notifications: [...state.notifications, { id: getUniqueId(), ...action.payload }] };
        case 'REMOVE_NOTIFICATION': return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
        case 'SET_AI_LOADING': return { ...state, isAILoading: action.payload };
        case 'SET_AI_RESULT': return { ...state, aiAnalysisResult: action.payload, isAILoading: false };
        default: return state;
    }
};

// --- CUSTOM HOOKS ---
const useEventGrid = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // Initial filter and sort
        const filteredEvents = filterAndSortEvents(state);
        dispatch({ type: 'SET_FILTER', payload: {} }); // This triggers the re-calculation
    }, []);

    useEffect(() => {
        if (!state.isStreaming) return;
        const interval = setInterval(() => {
            const newEvent = generateMockBankEvent();
            dispatch({ type: 'RECEIVE_NEW_EVENT', payload: newEvent });
            if (newEvent.severity === EventSeverity.Critical || newEvent.severity === EventSeverity.High) {
                dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `New ${newEvent.severity} event: ${newEvent.type}`, severity: newEvent.severity } });
            }
        }, EVENT_STREAM_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [state.isStreaming]);

    const paginatedEvents = useMemo(() => {
        const { currentPage, pageSize } = state.pagination;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return state.filteredEvents.slice(start, end);
    }, [state.filteredEvents, state.pagination]);

    return { state, dispatch, paginatedEvents };
};


// --- UI COMPONENTS ---

const Icon = ({ path, className }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

const NotificationToast = ({ notification, onDismiss }: { notification: any, onDismiss: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, NOTIFICATION_DISPLAY_TIME_MS);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const severityStyles = {
        [EventSeverity.Critical]: "bg-red-800 border-red-600",
        [EventSeverity.High]: "bg-orange-800 border-orange-600",
        [EventSeverity.Medium]: "bg-yellow-800 border-yellow-600",
    };

    return (
        <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-2xl text-white border ${severityStyles[notification.severity] || 'bg-blue-800 border-blue-600'} animate-fade-in-up`}>
            <div className="flex items-center">
                <p>{notification.message}</p>
                <button onClick={onDismiss} className="ml-4 text-gray-300 hover:text-white">&times;</button>
            </div>
        </div>
    );
};

const EventGridHeader = ({ state, dispatch }: { state: EventGridState, dispatch: React.Dispatch<Action> }) => {
    const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
    
    const handleNLPSearch = async () => {
        if (!naturalLanguageQuery) return;
        dispatch({ type: 'SET_AI_LOADING', payload: true });
        const result = await mockAIService.analyzeText("Convert natural language to filter", { query: naturalLanguageQuery });
        if (result.filter) {
            dispatch({ type: 'SET_FILTER', payload: { ...state.filters, ...result.filter } });
        }
        dispatch({ type: 'SET_AI_LOADING', payload: false });
        setNaturalLanguageQuery('');
    };

    const debouncedSearch = useCallback(debounce((value) => {
        dispatch({ type: 'SET_FILTER', payload: { ...state.filters, searchText: value } });
    }, DEBOUNCE_DELAY_MS), [state.filters, dispatch]);
    
    return (
        <div className="p-4 bg-gray-900 border-b border-gray-700 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-100">Event Grid</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Live Stream</span>
                    <button onClick={() => dispatch({ type: state.isStreaming ? 'STOP_STREAMING' : 'START_STREAMING' })} className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${state.isStreaming ? 'bg-green-500 justify-end' : 'bg-gray-600 justify-start'}`}>
                        <span className="w-4 h-4 bg-white rounded-full block" />
                    </button>
                </div>
            </div>
            <div className="flex space-x-2">
                <input
                    type="text"
                    placeholder="Search events..."
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={e => debouncedSearch(e.target.value)}
                />
                <input
                    type="text"
                    value={naturalLanguageQuery}
                    onChange={e => setNaturalLanguageQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleNLPSearch()}
                    placeholder="AI Search: e.g., 'failed transactions over $1000 last week'"
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button onClick={handleNLPSearch} disabled={state.isAILoading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">
                    {state.isAILoading ? 'Thinking...' : 'Ask AI'}
                </button>
            </div>
        </div>
    );
};

const EventTable = ({ events, onSelect, onSort, sortConfig }: { events: BankEvent[], onSelect: (event: BankEvent) => void, onSort: (key: SortConfig['key']) => void, sortConfig: SortConfig }) => {
    const headers: { key: SortConfig['key'], label: string }[] = [
        { key: 'timestamp', label: 'Timestamp' },
        { key: 'category', label: 'Category' },
        { key: 'type', label: 'Type' },
        { key: 'severity', label: 'Severity' },
        { key: 'status', label: 'Status' },
        { key: 'source', label: 'Source' },
        { key: 'metadata.userId', label: 'User ID' },
    ];
    
    const SortIndicator = ({ direction }: { direction: 'asc' | 'desc' }) => (
        <span className="ml-1">{direction === 'asc' ? '▲' : '▼'}</span>
    );
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                    <tr>
                        {headers.map(header => (
                            <th key={header.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => onSort(header.key)}>
                                {header.label}
                                {sortConfig.key === header.key && <SortIndicator direction={sortConfig.direction} />}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {events.map(event => (
                        <tr key={event.id} onClick={() => onSelect(event)} className="hover:bg-gray-800/50 cursor-pointer">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(event.timestamp)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 py-1 rounded-full ${getEventSeverityColor(event.severity)}`}>{event.severity}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 py-1 rounded-full ${getEventStatusColor(event.status)}`}>{event.status}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.source}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.metadata.userId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const EventDetailView = ({ event, onClose, onAcknowledge, onAddNote }: { event: BankEvent, onClose: () => void, onAcknowledge: (eventId: string, user: string) => void, onAddNote: (eventId: string, note: EventNote) => void }) => {
    const [noteContent, setNoteContent] = useState('');
    const currentUser = MOCK_USERS[0];

    const handleAddNote = () => {
        if (!noteContent.trim()) return;
        const newNote: EventNote = {
            id: getUniqueId(),
            timestamp: new Date(),
            userId: currentUser,
            content: noteContent
        };
        onAddNote(event.id, newNote);
        setNoteContent('');
    };

    return (
        <div className="fixed inset-y-0 right-0 w-1/3 bg-gray-900 border-l border-gray-700 shadow-2xl p-6 overflow-y-auto text-gray-200 animate-slide-in-left">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Event Details</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>

            <div className="space-y-4">
                <div><strong>ID:</strong> {event.id}</div>
                <div><strong>Timestamp:</strong> {formatDate(event.timestamp)}</div>
                <div><strong>Category:</strong> {event.category}</div>
                <div><strong>Type:</strong> {event.type}</div>
                <div><strong>Severity:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getEventSeverityColor(event.severity)}`}>{event.severity}</span></div>
                <div><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getEventStatusColor(event.status)}`}>{event.status}</span></div>
                <div><strong>Source:</strong> {event.source}</div>
                {event.correlationId && <div><strong>Correlation ID:</strong> {event.correlationId}</div>}
                
                <h3 className="text-lg font-semibold pt-4 border-t border-gray-700">Metadata</h3>
                <pre className="bg-gray-800 p-3 rounded-md text-xs overflow-x-auto">{JSON.stringify(event.metadata, null, 2)}</pre>
                
                <div className="pt-4 border-t border-gray-700">
                    {event.isAcknowledged ? (
                        <div className="text-green-400">Acknowledged by {event.acknowledgedBy} at {formatDate(event.acknowledgmentTime!)}</div>
                    ) : (
                        <button onClick={() => onAcknowledge(event.id, currentUser)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                            Acknowledge Event
                        </button>
                    )}
                </div>

                <h3 className="text-lg font-semibold pt-4 border-t border-gray-700">Notes</h3>
                <div className="space-y-2">
                    {event.notes.map(note => (
                        <div key={note.id} className="bg-gray-800 p-2 rounded">
                            <p className="text-sm">{note.content}</p>
                            <p className="text-xs text-gray-400 text-right">-- {note.userId} at {formatDate(note.timestamp)}</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Add a new note..." className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    <button onClick={handleAddNote} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">Add Note</button>
                </div>
            </div>
        </div>
    );
};

const Pagination = ({ pagination, onPageChange }: { pagination: PaginationConfig, onPageChange: (page: number) => void }) => {
    const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    
    return (
        <nav className="bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
                <button onClick={() => onPageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50">Previous</button>
                <button onClick={() => onPageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50">Next</button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-400">
                        Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> to <span className="font-medium">{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}</span> of{' '}
                        <span className="font-medium">{pagination.totalItems}</span> results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {pageNumbers.slice(Math.max(0, pagination.currentPage - 3), Math.min(totalPages, pagination.currentPage + 2)).map(number => (
                             <button key={number} onClick={() => onPageChange(number)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.currentPage === number ? 'z-10 bg-blue-900 border-blue-500 text-blue-300' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'}`}>
                                {number}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </nav>
    );
};


const AIActionsPanel = ({ events, dispatch }: { events: BankEvent[], dispatch: React.Dispatch<Action> }) => {
    const handleSummarize = async () => {
        dispatch({ type: 'SET_AI_LOADING', payload: true });
        const highSeverityCount = events.filter(e => e.severity === 'High' || e.severity === 'Critical').length;
        const result = await mockAIService.analyzeText("Summarize these events", {
            eventCount: events.length,
            highSeverityCount: highSeverityCount
        });
        dispatch({ type: 'SET_AI_RESULT', payload: result });
    };

    const handleDetectAnomalies = async () => {
        dispatch({ type: 'SET_AI_LOADING', payload: true });
        const result = await mockAIService.analyzeText("Detect anomalies in these events", { events: events.slice(0, 20) }); // Send a sample
        dispatch({ type: 'SET_AI_RESULT', payload: result });
    };

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg space-y-3">
            <h3 className="text-lg font-semibold text-purple-300">AI Analytics</h3>
            <div className="flex space-x-2">
                <button onClick={handleSummarize} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">Summarize View</button>
                <button onClick={handleDetectAnomalies} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">Detect Anomalies</button>
            </div>
        </div>
    );
};

const AIResultsDisplay = ({ result, isLoading, onClear }: { result: any, isLoading: boolean, onClear: () => void }) => {
    if (isLoading) return <div className="p-4 bg-gray-800/50 rounded-lg text-center text-purple-300">AI is thinking...</div>;
    if (!result) return null;

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg space-y-4 mt-4 relative">
             <button onClick={onClear} className="absolute top-2 right-2 text-gray-400 hover:text-white">&times;</button>
            <h3 className="text-lg font-semibold text-purple-300">AI Analysis Result</h3>
            {result.summary && <p className="text-gray-300">{result.summary}</p>}
            {result.actionableInsights && (
                <div>
                    <h4 className="font-semibold text-gray-200">Actionable Insights:</h4>
                    <ul className="list-disc list-inside text-gray-300">
                        {result.actionableInsights.map((insight: string, i: number) => <li key={i}>{insight}</li>)}
                    </ul>
                </div>
            )}
            {result.anomalies && (
                <div>
                    <h4 className="font-semibold text-gray-200">Detected Anomalies:</h4>
                    <ul className="list-disc list-inside text-gray-300">
                        {result.anomalies.map((anomaly: any, i: number) => <li key={i}>{anomaly.reason} (Event ID: {anomaly.eventId})</li>)}
                    </ul>
                </div>
            )}
            {result.error && <p className="text-red-400">{result.error}</p>}
        </div>
    );
}


// --- MAIN COMPONENT ---
const DemoBankEventGridView: React.FC = () => {
    const { state, dispatch, paginatedEvents } = useEventGrid();

    const handleSort = (key: SortConfig['key']) => {
        const direction = state.sortConfig.key === key && state.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        dispatch({ type: 'SET_SORT', payload: { key, direction } });
    };

    return (
        <Card className="bg-gray-900 text-white h-full flex flex-col">
            <EventGridHeader state={state} dispatch={dispatch} />
            
            <div className="flex flex-grow overflow-hidden">
                {/* Left filter panel can be added here */}
                <main className="flex-grow flex flex-col">
                     <div className="p-4">
                        <AIActionsPanel events={state.filteredEvents} dispatch={dispatch}/>
                        <AIResultsDisplay result={state.aiAnalysisResult} isLoading={state.isAILoading} onClear={() => dispatch({type: 'SET_AI_RESULT', payload: null})} />
                     </div>
                    <div className="flex-grow overflow-y-auto">
                        <EventTable
                            events={paginatedEvents}
                            onSelect={(event) => dispatch({ type: 'SELECT_EVENT', payload: event })}
                            onSort={handleSort}
                            sortConfig={state.sortConfig}
                        />
                    </div>
                    <Pagination
                        pagination={{ ...state.pagination, totalItems: state.filteredEvents.length }}
                        onPageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
                    />
                </main>
            </div>

            {state.selectedEvent && (
                <EventDetailView
                    event={state.selectedEvent}
                    onClose={() => dispatch({ type: 'SELECT_EVENT', payload: null })}
                    onAcknowledge={(eventId, user) => dispatch({ type: 'ACKNOWLEDGE_EVENT', payload: { eventId, user } })}
                    onAddNote={(eventId, note) => dispatch({ type: 'ADD_NOTE', payload: { eventId, note } })}
                />
            )}
            
            <div className="fixed bottom-5 right-5 z-50 space-y-2">
                {state.notifications.map(n => (
                    <NotificationToast
                        key={n.id}
                        notification={n}
                        onDismiss={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: n.id })}
                    />
                ))}
            </div>
        </Card>
    );
};

export default DemoBankEventGridView;
        
