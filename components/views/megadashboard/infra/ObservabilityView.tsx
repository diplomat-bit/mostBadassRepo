// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/infra/ObservabilityView.tsx
================================================================================

// components/views/megadashboard/infra/ObservabilityView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

const ObservabilityView: React.FC = () => {
    const [prompt, setPrompt] = useState("Show me all 500 errors from the payments-api in the last hour.");
    const [logResults, setLogResults] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleQuery = async () => {
        setIsLoading(true); setLogResults('');
        // Simulate log query
        setTimeout(() => {
            setLogResults(`[2024-07-24T10:35:12Z] payments-api ERROR: Database connection failed. Status: 500\n[2024-07-24T10:42:01Z] payments-api ERROR: Upstream provider timeout. Status: 503`);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Observability</h2>
            <Card title="Natural Language Log Query">
                <div className="flex gap-2">
                    <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded" />
                    <button onClick={handleQuery} disabled={isLoading} className="px-4 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? '...' : 'Query'}</button>
                </div>
                <div className="mt-4 bg-gray-900/50 p-4 rounded font-mono text-xs min-h-[10rem]">{isLoading ? 'Querying...' : logResults}</div>
            </Card>
        </div>
    );
};

export default ObservabilityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/infra/ObservabilityView.tsx
================================================================================

import React, { useState, useEffect, useRef, useCallback, useReducer, createContext, useContext } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";
// import type { MessageContent, Part } from "@google/genai"; // Assuming these types exist in @google/genai if we were to use them explicitly
import {
    ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, ChartBarIcon,
    BellIcon, CubeIcon, Squares2X2Icon, BoltIcon, Cog6ToothIcon, ClockIcon,
    ArrowPathIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon,
    PlusIcon, PencilIcon, TrashIcon, DocumentDuplicateIcon, PlayIcon, StopIcon,
    TableCellsIcon, CodeBracketIcon, ServerStackIcon, EyeIcon, AdjustmentsHorizontalIcon,
    FunnelIcon, ShareIcon, PrinterIcon, ArrowTopRightOnSquareIcon, MinusIcon, SunIcon, MoonIcon,
    Bars3BottomLeftIcon, XMarkIcon, SparklesIcon, CpuChipIcon, CloudIcon, CircleStackIcon,
    CommandLineIcon, BugAntIcon, RocketLaunchIcon, WrenchScrewdriverIcon, ChartPieIcon
} from '@heroicons/react/24/outline'; // Assuming Heroicons for a richer UI

// --- Start of new code for 10000 lines ---

// #region 1. Global Constants and Configurations

/**
 * @file This file contains the ObservabilityView component, a comprehensive
 * dashboard for logs, metrics, traces, alerts, and AI-driven insights.
 * It is designed to be a "real application in the real world" by providing
 * a vast array of features and functionalities, even if some backend integrations
 * are simulated for the purpose of this example.
 *
 * The goal is to demonstrate a large-scale, enterprise-grade observability platform
 * within a single file, showcasing a wide range of React patterns, state management,
 * data structures, and UI components.
 */

export const APP_NAME = "MegaDashboard Observability";
export const API_BASE_URL = "/api/observability"; // Placeholder for API endpoints
export const DEFAULT_TIME_RANGE_MS = 60 * 60 * 1000; // 1 hour
export const REFRESH_INTERVAL_MS = 30 * 1000; // 30 seconds
export const MAX_LOG_LINES_DISPLAY = 1000;
export const MAX_AI_TOKEN_LENGTH = 4000; // Example for Gemini 1.0 Pro
export const VIRTUALIZED_ROW_HEIGHT = 28; // Pixels for log table rows

export enum ObservabilityTab {
    Logs = 'logs',
    Metrics = 'metrics',
    Traces = 'traces',
    Alerts = 'alerts',
    Dashboards = 'dashboards',
    AIInsights = 'ai-insights',
    Settings = 'settings',
}

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL',
}

export enum MetricAggregationType {
    SUM = 'sum',
    AVG = 'avg',
    MIN = 'min',
    MAX = 'max',
    COUNT = 'count',
    P99 = 'p99',
    P95 = 'p95',
}

export enum AlertSeverity {
    INFO = 'info',
    WARNING = 'warning',
    CRITICAL = 'critical',
    EMERGENCY = 'emergency',
}

export enum DataSourceType {
    LOGS = 'logs',
    METRICS = 'metrics',
    TRACES = 'traces',
    COMBINED = 'combined', // For data sources that provide multiple types
}

export enum AIInsightType {
    SUMMARY = 'summary',
    ROOT_CAUSE = 'root_cause',
    ANOMALY_EXPLANATION = 'anomaly_explanation',
    RECOMMENDATION = 'recommendation',
    PREDICTION = 'prediction',
}

export const QUICK_TIME_RANGES = [
    { label: 'Last 5 minutes', value: 5 * 60 * 1000 },
    { label: 'Last 15 minutes', value: 15 * 60 * 1000 },
    { label: 'Last 30 minutes', value: 30 * 60 * 1000 },
    { label: 'Last 1 hour', value: 60 * 60 * 1000 },
    { label: 'Last 3 hours', value: 3 * 60 * 60 * 1000 },
    { label: 'Last 6 hours', value: 6 * 60 * 60 * 1000 },
    { label: 'Last 12 hours', value: 12 * 60 * 60 * 1000 },
    { label: 'Last 24 hours', value: 24 * 60 * 60 * 1000 },
    { label: 'Last 7 days', value: 7 * 24 * 60 * 60 * 1000 },
    { label: 'Last 30 days', value: 30 * 24 * 60 * 60 * 1000 },
];

export const SERVICE_NAMES = [
    'payments-api', 'auth-service', 'user-profile-service', 'inventory-service',
    'order-processing', 'notification-service', 'frontend-bff', 'data-ingestion-worker',
    'reporting-service', 'search-engine', 'billing-processor', 'shipping-tracker',
];

export const HTTP_STATUS_CODES = [200, 201, 204, 400, 401, 403, 404, 429, 500, 502, 503, 504];

export const LOG_FIELDS_COMMON = [
    'timestamp', 'level', 'service', 'message', 'traceId', 'spanId', 'userId',
    'requestId', 'statusCode', 'method', 'path', 'durationMs', 'region',
    'env', 'host', 'containerId', 'threadName', 'className',
];

// #endregion

// #region 2. Interfaces and Types

export interface TimeRange {
    start: number; // Unix timestamp in milliseconds
    end: number;   // Unix timestamp in milliseconds
    label?: string; // e.g., "Last 1 hour"
}

export interface LogEntry {
    id: string;
    timestamp: number; // Unix timestamp in milliseconds
    level: LogLevel;
    service: string;
    message: string;
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic log fields
    [key: string]: any; // Arbitrary additional fields
}

export interface LogFilter {
    timeRange: TimeRange;
    levels: LogLevel[];
    services: string[];
    searchText: string;
    fields: Record<string, string>; // e.g., { 'statusCode': '500' }
    pageSize: number;
    page: number;
    sortField: keyof LogEntry;
    sortOrder: 'asc' | 'desc';
}

export interface LogAggregationResult {
    timestamp: number;
    count: number;
    levels: Record<LogLevel, number>;
}

export interface MetricSeries {
    name: string;
    labels: Record<string, string>;
    datapoints: Array<[number, number]>; // [timestamp, value]
}

export interface MetricQueryConfig {
    metricName: string;
    aggregation: MetricAggregationType;
    groupBy: string[]; // Labels to group by
    filters: Record<string, string>; // Label filters
    timeRange: TimeRange;
    resolutionMs: number; // Interval between datapoints
}

export interface TraceSpan {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    serviceName: string;
    operationName: string;
    startTime: number; // Unix timestamp in microseconds
    duration: number;  // Microseconds
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic trace tags
    tags: Record<string, any>;
    logs?: LogEntry[]; // Associated logs
    error?: boolean;
}

export interface TraceSegment {
    id: string;
    parentId?: string;
    traceId: string;
    serviceName: string;
    operationName: string;
    startTime: number;
    duration: number;
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic trace tags
    tags: Record<string, any>;
    children: TraceSegment[];
    logs?: LogEntry[];
    error: boolean;
}

export interface AlertCondition {
    metricName: string;
    threshold: number;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
    aggregation: MetricAggregationType;
    durationMs: number; // How long condition must be met
}

export interface AlertNotificationChannel {
    id: string;
    type: 'email' | 'slack' | 'webhook';
    name: string;
    target: string; // e.g., email address, slack channel ID, webhook URL
}

export interface AlertRule {
    id: string;
    name: string;
    description: string;
    severity: AlertSeverity;
    enabled: boolean;
    conditions: AlertCondition[];
    notificationChannels: string[]; // Array of channel IDs
    lastEvaluated?: number;
    lastTriggered?: number;
}

export interface ActiveAlert extends AlertRule {
    triggeredAt: number;
    resolvedAt?: number;
    currentValue: number;
    triggeringCondition: AlertCondition;
    status: 'triggered' | 'acknowledged' | 'resolved';
}

export interface DashboardPanel {
    id: string;
    title: string;
    type: 'logTable' | 'metricChart' | 'traceServiceMap' | 'alertSummary' | 'customMarkdown';
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic panel config
    config: any; // e.g., LogFilter for logTable, MetricQueryConfig for metricChart
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface DashboardConfig {
    id: string;
    name: string;
    description?: string;
    panels: DashboardPanel[];
    layout: 'grid' | 'freeform';
    timeRange?: TimeRange;
    isPublic: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface DataSourceConfig {
    id:string;
    name: string;
    type: DataSourceType;
    endpoint: string;
    apiKey?: string;
    enabled: boolean;
    metadata?: Record<string, string>; // e.g., region, provider
}

export interface SavedQuery {
    id: string;
    name: string;
    description?: string;
    queryType: ObservabilityTab; // e.g., 'logs', 'metrics'
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic query config
    queryConfig: any; // e.g., LogFilter, MetricQueryConfig
    createdAt: number;
    lastUsedAt: number;
}

export interface AIAnalysisResult {
    id: string;
    type: AIInsightType;
    timestamp: number;
    summary: string;
    details: string | Record<string, unknown>;
    confidenceScore: number;
    relatedEntities: { type: string; id: string }[];
}

// #endregion

// #region 3. MOCK DATA GENERATION UTILITIES

const MOCK_MESSAGES = [
    'User authentication successful for user_id={userId}',
    'Processing payment for order_id={orderId}',
    'Failed to connect to database: Connection timed out',
    'Inventory stock low for product_id={productId}',
    'New user registered: {username}',
    'API request to {path} returned status {statusCode} in {durationMs}ms',
    'Cache miss for key: {cacheKey}',
    'Starting background job: {jobName}',
    'Unhandled exception: NullPointerException at {className}.{methodName}:{lineNumber}',
    'Successfully sent notification to user {userId}',
];

const MOCK_USERS = ['alice', 'bob', 'charlie', 'david', 'eve', 'frank'];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const generateUUID = (): string => crypto.randomUUID();

const generateLogEntry = (timestamp: number): LogEntry => {
    const level = getRandomElement(Object.values(LogLevel));
    const service = getRandomElement(SERVICE_NAMES);
    let message = getRandomElement(MOCK_MESSAGES);

    message = message.replace('{userId}', getRandomInt(1000, 9999).toString());
    message = message.replace('{orderId}', generateUUID().substring(0, 8));
    message = message.replace('{productId}', `prod-${getRandomInt(100, 999)}`);
    message = message.replace('{username}', getRandomElement(MOCK_USERS));
    message = message.replace('{path}', `/${service}/${getRandomElement(['users', 'items', 'orders'])}`);
    const statusCode = getRandomElement(HTTP_STATUS_CODES);
    message = message.replace('{statusCode}', statusCode.toString());
    const durationMs = getRandomInt(10, 2000);
    message = message.replace('{durationMs}', durationMs.toString());
    message = message.replace('{cacheKey}', `cache:user:${getRandomInt(1000, 9999)}`);
    message = message.replace('{jobName}', `job-${getRandomInt(1, 10)}`);
    message = message.replace('{className}', 'com.example.Processor');
    message = message.replace('{methodName}', 'processRequest');
    message = message.replace('{lineNumber}', getRandomInt(50, 250).toString());

    const entry: LogEntry = {
        id: generateUUID(),
        timestamp,
        level,
        service,
        message,
        traceId: generateUUID(),
        spanId: generateUUID().substring(0, 16),
        userId: getRandomInt(1000, 9999),
        requestId: generateUUID(),
        statusCode,
        method: getRandomElement(['GET', 'POST', 'PUT', 'DELETE']),
        path: `/${service}/v1/resource`,
        durationMs,
        region: getRandomElement(['us-east-1', 'us-west-2', 'eu-central-1']),
        env: 'production',
        host: `ip-10-0-${getRandomInt(1, 255)}-${getRandomInt(1, 255)}.ec2.internal`,
        containerId: generateUUID() + generateUUID(),
    };

    if (level === LogLevel.ERROR || level === LogLevel.CRITICAL) {
        entry.error = {
            message: 'An unexpected error occurred',
            stack: `Error: An unexpected error occurred\n    at com.example.Processor.processRequest(Processor.java:123)\n    at com.example.Main.main(Main.java:45)`,
        };
    }

    return entry;
};

const generateLogData = (count: number, timeRange: TimeRange): LogEntry[] => {
    const logs: LogEntry[] = [];
    const timeStep = (timeRange.end - timeRange.start) / count;
    for (let i = 0; i < count; i++) {
        logs.push(generateLogEntry(timeRange.end - i * timeStep));
    }
    return logs.sort((a, b) => b.timestamp - a.timestamp);
};

const generateMetricData = (query: MetricQueryConfig): MetricSeries[] => {
    const series: MetricSeries[] = [];
    const { start, end } = query.timeRange;
    const numPoints = Math.floor((end - start) / query.resolutionMs);

    // Simulate multiple series if groupBy is used
    const seriesLabels = query.groupBy.length > 0
        ? [ { [query.groupBy[0]]: 'a' }, { [query.groupBy[0]]: 'b' } ]
        : [{}];

    seriesLabels.forEach(labels => {
        const datapoints: Array<[number, number]> = [];
        let value = getRandomInt(50, 150);
        for (let i = 0; i < numPoints; i++) {
            const timestamp = start + i * query.resolutionMs;
            value += (Math.random() - 0.5) * 10; // Fluctuate value
            if (value < 0) value = 0;
            datapoints.push([timestamp, Math.round(value * 100) / 100]);
        }
        series.push({
            name: `${query.metricName}{${Object.entries(labels).map(([k,v]) => `${k}="${v}"`).join(',')}}`,
            labels: labels,
            datapoints,
        });
    });

    return series;
};

// #endregion

// #region 4. MOCK API SERVICE

class MockObservabilityApi {
    private latencyMs: number;

    constructor(latencyMs = 300) {
        this.latencyMs = latencyMs;
    }

    private simulateNetwork<T>(data: T): Promise<T> {
        return new Promise(resolve => {
            setTimeout(() => resolve(data), this.latencyMs * (0.5 + Math.random()));
        });
    }

    async fetchLogs(filter: LogFilter): Promise<{ logs: LogEntry[], total: number }> {
        console.log("Fetching logs with filter:", filter);
        const allLogs = generateLogData(5000, filter.timeRange); // Generate a large pool to filter from

        const filteredLogs = allLogs.filter(log => {
            if (filter.levels.length > 0 && !filter.levels.includes(log.level)) return false;
            if (filter.services.length > 0 && !filter.services.includes(log.service)) return false;
            if (filter.searchText && !log.message.toLowerCase().includes(filter.searchText.toLowerCase())) return false;
            for (const [key, value] of Object.entries(filter.fields)) {
                if (!log[key] || log[key].toString() !== value) return false;
            }
            return true;
        });

        const total = filteredLogs.length;
        const start = (filter.page - 1) * filter.pageSize;
        const end = start + filter.pageSize;
        const paginatedLogs = filteredLogs.slice(start, end);

        return this.simulateNetwork({ logs: paginatedLogs, total });
    }
    
    async fetchMetricData(query: MetricQueryConfig): Promise<MetricSeries[]> {
        console.log("Fetching metrics with query:", query);
        const data = generateMetricData(query);
        return this.simulateNetwork(data);
    }
    
    // Simulate Gemini/ChatGPT AI interactions
    async getAIInsight(prompt: string, context: unknown): Promise<AIAnalysisResult> {
        console.log("Requesting AI insight with prompt:", prompt, "and context:", context);
        
        let summary = "AI analysis is in progress...";
        let details: Record<string, unknown> | string = {};
        let type = AIInsightType.SUMMARY;

        if (prompt.includes("summarize")) {
            type = AIInsightType.SUMMARY;
            summary = "Log Summary: The system is experiencing a high rate of HTTP 500 errors from the 'payments-api' service.";
            details = {
                error_rate: "15%",
                affected_service: "payments-api",
                common_error_message: "Failed to connect to database: Connection timed out",
                impacted_users: 1250,
            };
        } else if (prompt.includes("root cause")) {
            type = AIInsightType.ROOT_CAUSE;
            summary = "Potential Root Cause: Database connection pool exhaustion.";
            details = "The 'payments-api' service is attempting to create more database connections than the configured maximum. This is correlated with a sudden spike in traffic from the 'frontend-bff' service starting at 10:45 AM. The increased load is causing timeouts when acquiring a database connection.";
        } else if (prompt.includes("recommend")) {
            type = AIInsightType.RECOMMENDATION;
            summary = "Recommendations:";
            details = [
                "1. Increase the maximum size of the database connection pool for the 'payments-api' service.",
                "2. Investigate the traffic spike from 'frontend-bff'. Check for deployment changes or new features that could be causing this.",
                "3. Implement a circuit breaker pattern in 'frontend-bff' to gracefully handle downstream failures from 'payments-api'."
            ];
        }

        const result: AIAnalysisResult = {
            id: generateUUID(),
            type,
            timestamp: Date.now(),
            summary,
            details,
            confidenceScore: Math.random() * 0.2 + 0.75, // 0.75 - 0.95
            relatedEntities: [{ type: 'service', id: 'payments-api' }],
        };
        
        return this.simulateNetwork(result);
    }
}

const api = new MockObservabilityApi();

// #endregion

// #region 5. STATE MANAGEMENT (Context & Reducer)

interface ObservabilityState {
    globalTimeRange: TimeRange;
    activeTab: ObservabilityTab;
    theme: 'light' | 'dark';
    logs: {
        isLoading: boolean;
        data: LogEntry[];
        total: number;
        filter: LogFilter;
        error: string | null;
        selectedLog: LogEntry | null;
    };
    metrics: {
        isLoading: boolean;
        // biome-ignore lint/suspicious/noExplicitAny: complex structure
        queries: Record<string, any>; // Keyed by a unique ID
        // biome-ignore lint/suspicious/noExplicitAny: complex structure
        data: Record<string, MetricSeries[]>; // Keyed by query ID
        error: string | null;
    };
    ai: {
        isGenerating: boolean;
        lastResult: AIAnalysisResult | null;
        history: AIAnalysisResult[];
        error: string | null;
    };
    // ... other states for traces, alerts, dashboards etc.
}

type Action =
    | { type: 'SET_ACTIVE_TAB'; payload: ObservabilityTab }
    | { type: 'SET_GLOBAL_TIME_RANGE'; payload: TimeRange }
    | { type: 'TOGGLE_THEME' }
    | { type: 'LOGS_FETCH_START' }
    | { type: 'LOGS_FETCH_SUCCESS'; payload: { logs: LogEntry[]; total: number } }
    | { type: 'LOGS_FETCH_ERROR'; payload: string }
    | { type: 'LOGS_SET_FILTER'; payload: Partial<LogFilter> }
    | { type: 'LOGS_SELECT_LOG'; payload: LogEntry | null }
    | { type: 'AI_FETCH_START' }
    | { type: 'AI_FETCH_SUCCESS'; payload: AIAnalysisResult }
    | { type: 'AI_FETCH_ERROR'; payload: string };
    

const initialState: ObservabilityState = {
    globalTimeRange: {
        start: Date.now() - DEFAULT_TIME_RANGE_MS,
        end: Date.now(),
        label: 'Last 1 hour'
    },
    activeTab: ObservabilityTab.Logs,
    theme: 'dark',
    logs: {
        isLoading: false,
        data: [],
        total: 0,
        filter: {
            timeRange: { start: Date.now() - DEFAULT_TIME_RANGE_MS, end: Date.now() },
            levels: [],
            services: [],
            searchText: '',
            fields: {},
            pageSize: 100,
            page: 1,
            sortField: 'timestamp',
            sortOrder: 'desc',
        },
        error: null,
        selectedLog: null,
    },
    metrics: {
        isLoading: false,
        queries: {},
        data: {},
        error: null,
    },
    ai: {
        isGenerating: false,
        lastResult: null,
        history: [],
        error: null,
    }
};

const observabilityReducer = (state: ObservabilityState, action: Action): ObservabilityState => {
    switch (action.type) {
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };
        case 'SET_GLOBAL_TIME_RANGE': {
            const newTimeRange = action.payload;
            return {
                ...state,
                globalTimeRange: newTimeRange,
                logs: {
                    ...state.logs,
                    filter: { ...state.logs.filter, timeRange: newTimeRange, page: 1 },
                },
            };
        }
        case 'TOGGLE_THEME':
            return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
        case 'LOGS_FETCH_START':
            return { ...state, logs: { ...state.logs, isLoading: true, error: null } };
        case 'LOGS_FETCH_SUCCESS':
            return { ...state, logs: { ...state.logs, isLoading: false, data: action.payload.logs, total: action.payload.total } };
        case 'LOGS_FETCH_ERROR':
            return { ...state, logs: { ...state.logs, isLoading: false, error: action.payload } };
        case 'LOGS_SET_FILTER':
            return { ...state, logs: { ...state.logs, filter: { ...state.logs.filter, ...action.payload } } };
        case 'LOGS_SELECT_LOG':
            return { ...state, logs: { ...state.logs, selectedLog: action.payload } };
        case 'AI_FETCH_START':
            return { ...state, ai: { ...state.ai, isGenerating: true, error: null } };
        case 'AI_FETCH_SUCCESS':
            return {
                ...state,
                ai: {
                    ...state.ai,
                    isGenerating: false,
                    lastResult: action.payload,
                    history: [action.payload, ...state.ai.history].slice(0, 10), // Keep last 10
                },
            };
        case 'AI_FETCH_ERROR':
            return { ...state, ai: { ...state.ai, isGenerating: false, error: action.payload } };
        default:
            return state;
    }
};

const ObservabilityContext = createContext<{ state: ObservabilityState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const useObservability = () => {
    const context = useContext(ObservabilityContext);
    if (!context) {
        throw new Error('useObservability must be used within an ObservabilityProvider');
    }
    return context;
};

// #endregion

// #region 6. CUSTOM HOOKS

const useDebounce = <T,>(value: T, delay: number): T => {
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

// #endregion

// #region 7. LOW-LEVEL UI COMPONENTS

const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => (
    <div className="group relative flex">
        {children}
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs scale-0 transform rounded bg-gray-700 p-2 text-xs text-white transition-all group-hover:scale-100 dark:bg-gray-200 dark:text-gray-800 z-50">
            {text}
        </span>
    </div>
);

const IconButton = ({ icon: Icon, onClick, tooltip, className = '' }: { icon: React.ElementType, onClick?: () => void, tooltip: string, className?: string }) => (
    <Tooltip text={tooltip}>
        <button
            type="button"
            onClick={onClick}
            className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors ${className}`}
        >
            <Icon className="h-5 w-5" />
        </button>
    </Tooltip>
);

const LogLevelBadge = ({ level }: { level: LogLevel }) => {
    const colors = {
        [LogLevel.DEBUG]: 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200',
        [LogLevel.INFO]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        [LogLevel.WARN]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        [LogLevel.ERROR]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        [LogLevel.CRITICAL]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors[level]}`}>
            {level}
        </span>
    );
};

const Spinner = () => (
    <div className="flex justify-center items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

// #endregion

// #region 8. HIGH-LEVEL FEATURE COMPONENTS

// #region 8.1 Logs View Components

const LogFilterBar = () => {
    const { state, dispatch } = useObservability();
    const { filter } = state.logs;
    const [searchText, setSearchText] = useState(filter.searchText);
    const debouncedSearchText = useDebounce(searchText, 500);

    useEffect(() => {
        dispatch({ type: 'LOGS_SET_FILTER', payload: { searchText: debouncedSearchText, page: 1 } });
    }, [debouncedSearchText, dispatch]);

    const handleLevelChange = (level: LogLevel) => {
        const newLevels = filter.levels.includes(level)
            ? filter.levels.filter(l => l !== level)
            : [...filter.levels, level];
        dispatch({ type: 'LOGS_SET_FILTER', payload: { levels: newLevels, page: 1 } });
    };

    return (
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap items-center gap-2">
            <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-sm w-64 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-2">
                {Object.values(LogLevel).map(level => (
                    <button
                        key={level}
                        type="button"
                        onClick={() => handleLevelChange(level)}
                        className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                            filter.levels.includes(level)
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>
    );
};

const LogTable = () => {
    const { state, dispatch } = useObservability();
    const { data: logs, isLoading, total, filter } = state.logs;

    if (isLoading && logs.length === 0) {
        return <div className="flex items-center justify-center h-64"><Spinner /> Loading logs...</div>;
    }
    
    if (!isLoading && logs.length === 0) {
        return <div className="text-center py-16 text-gray-500">No logs found for the selected criteria.</div>;
    }

    const handleRowClick = (log: LogEntry) => {
        dispatch({ type: 'LOGS_SELECT_LOG', payload: state.logs.selectedLog?.id === log.id ? null : log });
    };

    return (
        <div className="flex-grow overflow-y-auto">
            <table className="w-full text-sm font-mono whitespace-nowrap">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th className="text-left p-2 font-semibold">Timestamp</th>
                        <th className="text-left p-2 font-semibold">Level</th>
                        <th className="text-left p-2 font-semibold">Service</th>
                        <th className="text-left p-2 font-semibold w-full">Message</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <React.Fragment key={log.id}>
                            <tr
                                className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${state.logs.selectedLog?.id === log.id ? 'bg-blue-100/50 dark:bg-blue-900/50' : ''}`}
                                onClick={() => handleRowClick(log)}
                            >
                                <td className="p-2 text-gray-500 dark:text-gray-400 align-top">{new Date(log.timestamp).toISOString()}</td>
                                <td className="p-2 align-top"><LogLevelBadge level={log.level} /></td>
                                <td className="p-2 text-green-600 dark:text-green-400 align-top">{log.service}</td>
                                <td className="p-2 w-full truncate align-top">{log.message}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const LogDetailPanel = () => {
    const { state, dispatch } = useObservability();
    const { selectedLog } = state.logs;

    if (!selectedLog) {
        return null;
    }

    return (
        <div className="w-1/3 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold">Log Details</h3>
                <IconButton icon={XMarkIcon} onClick={() => dispatch({ type: 'LOGS_SELECT_LOG', payload: null })} tooltip="Close panel" />
            </div>
            <div className="flex-grow p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                    {JSON.stringify(selectedLog, null, 2)}
                </pre>
            </div>
        </div>
    );
};

const LogsView = () => {
    const { state, dispatch } = useObservability();
    const { filter } = state.logs;

    const fetchLogs = useCallback(() => {
        dispatch({ type: 'LOGS_FETCH_START' });
        api.fetchLogs(filter)
            .then(response => dispatch({ type: 'LOGS_FETCH_SUCCESS', payload: response }))
            .catch(error => dispatch({ type: 'LOGS_FETCH_ERROR', payload: error.message }));
    }, [dispatch, filter]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return (
        <div className="h-full flex flex-col">
            <LogFilterBar />
            <div className="flex-grow flex overflow-hidden">
                <div className="flex-grow flex flex-col">
                    <LogTable />
                </div>
                <LogDetailPanel />
            </div>
        </div>
    );
};

// #endregion

// #region 8.2 AI Insights Components

const AIInsightPanel = () => {
    const { state, dispatch } = useObservability();
    const { logs } = state;

    const handleAIRequest = (prompt: string) => {
        dispatch({ type: 'AI_FETCH_START' });
        api.getAIInsight(prompt, { logs: logs.data.slice(0, 50) }) // Send first 50 logs as context
            .then(result => dispatch({ type: 'AI_FETCH_SUCCESS', payload: result }))
            .catch(error => dispatch({ type: 'AI_FETCH_ERROR', payload: error.message }));
    };

    return (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-purple-600 dark:text-purple-400">
                    <SparklesIcon className="h-6 w-6" />
                    <span>AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleAIRequest("summarize logs")} className="px-3 py-1 text-sm rounded-md border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">Summarize</button>
                    <button type="button" onClick={() => handleAIRequest("find root cause")} className="px-3 py-1 text-sm rounded-md border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">Root Cause</button>
                    <button type="button" onClick={() => handleAIRequest("recommend actions")} className="px-3 py-1 text-sm rounded-md border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">Recommend</button>
                </div>
            </div>
            {state.ai.isGenerating && <div className="flex items-center gap-2 text-sm text-gray-500"><Spinner /> Generating insights...</div>}
            {state.ai.error && <div className="text-sm text-red-500">Error: {state.ai.error}</div>}
            {state.ai.lastResult && !state.ai.isGenerating && (
                <div className="p-3 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold mb-1">{state.ai.lastResult.summary}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {typeof state.ai.lastResult.details === 'string'
                            ? state.ai.lastResult.details
                            : <pre className="text-xs whitespace-pre-wrap font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md">{JSON.stringify(state.ai.lastResult.details, null, 2)}</pre>
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

// #endregion

// #region 9. MAIN TAB COMPONENTS

const TabContent = () => {
    const { state } = useObservability();
    switch (state.activeTab) {
        case ObservabilityTab.Logs:
            return <LogsView />;
        // Placeholder for other tabs
        case ObservabilityTab.Metrics:
            return <div className="p-4">Metrics View (Not Implemented)</div>;
        case ObservabilityTab.Traces:
            return <div className="p-4">Traces View (Not Implemented)</div>;
        case ObservabilityTab.Alerts:
            return <div className="p-4">Alerts View (Not Implemented)</div>;
        case ObservabilityTab.Dashboards:
            return <div className="p-4">Dashboards View (Not Implemented)</div>;
        case ObservabilityTab.AIInsights:
            return <div className="p-4">AI Insights View (Not Implemented)</div>;
        case ObservabilityTab.Settings:
            return <div className="p-4">Settings View (Not Implemented)</div>;
        default:
            return null;
    }
};

const HeaderBar = () => {
    const { state, dispatch } = useObservability();
    const { globalTimeRange, theme } = state;
    const [isTimePickerOpen, setTimePickerOpen] = useState(false);

    const handleTimeRangeChange = (rangeMs: number, label: string) => {
        dispatch({ type: 'SET_GLOBAL_TIME_RANGE', payload: { start: Date.now() - rangeMs, end: Date.now(), label } });
        setTimePickerOpen(false);
    };

    return (
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">Observability</h2>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setTimePickerOpen(!isTimePickerOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    >
                        <ClockIcon className="h-4 w-4" />
                        <span>{globalTimeRange.label || `${new Date(globalTimeRange.start).toLocaleString()} to ${new Date(globalTimeRange.end).toLocaleString()}`}</span>
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    {isTimePickerOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                                {QUICK_TIME_RANGES.map(range => (
                                    <button
                                        key={range.label}
                                        onClick={() => handleTimeRangeChange(range.value, range.label)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <IconButton
                    icon={theme === 'dark' ? SunIcon : MoonIcon}
                    onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                    tooltip={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                />
            </div>
        </div>
    );
};

// #endregion

// #region 10. MAIN OBSERVABILITY VIEW COMPONENT

const ObservabilityViewInternal = () => {
    const { state, dispatch } = useObservability();

    const TABS = [
        { id: ObservabilityTab.Logs, label: 'Logs', icon: Bars3BottomLeftIcon },
        { id: ObservabilityTab.Metrics, label: 'Metrics', icon: ChartBarIcon },
        { id: ObservabilityTab.Traces, label: 'Traces', icon: BugAntIcon },
        { id: ObservabilityTab.Alerts, label: 'Alerts', icon: BellIcon },
        { id: ObservabilityTab.Dashboards, label: 'Dashboards', icon: Squares2X2Icon },
        { id: ObservabilityTab.AIInsights, label: 'AI Insights', icon: SparklesIcon },
        { id: ObservabilityTab.Settings, label: 'Settings', icon: Cog6ToothIcon },
    ];

    return (
        <Card className={`h-[90vh] w-full flex flex-col ${state.theme}`}>
            <div className="h-full w-full flex flex-col text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
                <HeaderBar />
                <div className="flex-grow flex overflow-hidden">
                    <nav className="w-48 border-r border-gray-200 dark:border-gray-700 p-2">
                        <ul>
                            {TABS.map(tab => (
                                <li key={tab.id}>
                                    <button
                                        type="button"
                                        onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
                                        className={`w-full flex items-center gap-3 px-3 py-2 my-1 text-sm rounded-md transition-colors ${
                                            state.activeTab === tab.id
                                                ? 'bg-blue-500 text-white font-semibold'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <tab.icon className="h-5 w-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <main className="flex-grow flex flex-col overflow-hidden">
                        <div className="flex-grow overflow-auto">
                            <TabContent />
                        </div>
                         {state.activeTab === ObservabilityTab.Logs && <AIInsightPanel />}
                    </main>
                </div>
            </div>
        </Card>
    );
};

const ObservabilityView = () => {
    const [state, dispatch] = useReducer(observabilityReducer, initialState);

    return (
        <ObservabilityContext.Provider value={{ state, dispatch }}>
            <ObservabilityViewInternal />
        </ObservabilityContext.Provider>
    );
};

export default ObservabilityView;
// --- End of new code ---

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/infra/ObservabilityView.tsx
================================================================================

// components/views/megadashboard/infra/ObservabilityView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

const ObservabilityView: React.FC = () => {
    const [prompt, setPrompt] = useState("Show me all 500 errors from the payments-api in the last hour.");
    const [logResults, setLogResults] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleQuery = async () => {
        setIsLoading(true); setLogResults('');
        // Simulate log query
        setTimeout(() => {
            setLogResults(`[2024-07-24T10:35:12Z] payments-api ERROR: Database connection failed. Status: 500\n[2024-07-24T10:42:01Z] payments-api ERROR: Upstream provider timeout. Status: 503`);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Observability</h2>
            <Card title="Natural Language Log Query">
                <div className="flex gap-2">
                    <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded" />
                    <button onClick={handleQuery} disabled={isLoading} className="px-4 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? '...' : 'Query'}</button>
                </div>
                <div className="mt-4 bg-gray-900/50 p-4 rounded font-mono text-xs min-h-[10rem]">{isLoading ? 'Querying...' : logResults}</div>
            </Card>
        </div>
    );
};

export default ObservabilityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/infra/ObservabilityView.tsx
================================================================================

// components/views/megadashboard/infra/ObservabilityView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

const ObservabilityView: React.FC = () => {
    const [prompt, setPrompt] = useState("Show me all 500 errors from the payments-api in the last hour.");
    const [logResults, setLogResults] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleQuery = async () => {
        setIsLoading(true); setLogResults('');
        // Simulate log query
        setTimeout(() => {
            setLogResults(`[2024-07-24T10:35:12Z] payments-api ERROR: Database connection failed. Status: 500\n[2024-07-24T10:42:01Z] payments-api ERROR: Upstream provider timeout. Status: 503`);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Observability</h2>
            <Card title="Natural Language Log Query">
                <div className="flex gap-2">
                    <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded" />
                    <button onClick={handleQuery} disabled={isLoading} className="px-4 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? '...' : 'Query'}</button>
                </div>
                <div className="mt-4 bg-gray-900/50 p-4 rounded font-mono text-xs min-h-[10rem]">{isLoading ? 'Querying...' : logResults}</div>
            </Card>
        </div>
    );
};

export default ObservabilityView;
