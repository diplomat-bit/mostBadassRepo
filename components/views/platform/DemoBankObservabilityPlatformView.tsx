// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankObservabilityPlatformView.tsx
================================================================================

// components/views/platform/DemoBankObservabilityPlatformView.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } from 'eact';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

// --- CONSTANTS ---

export const SERVICE_NAMES = [
    'payments-api', 'users-service', 'fraud-detection-engine', 'loan-processing-queue',
    'frontend-gateway', 'auth-service', 'database-cluster-1', 'database-cluster-2',
    'kafka-stream-processor', 'risk-assessment-ml-model', 'notification-service'
];

export const LOG_LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG', 'FATAL'];
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
export const HTTP_STATUS_CODES = [200, 201, 204, 400, 401, 403, 404, 500, 502, 503, 504];

export const ERROR_MESSAGES = [
    'Database connection failed', 'Upstream provider timeout', 'Invalid credentials provided',
    'Schema validation failed for request body', 'User not found', 'Payment declined by gateway',
    'Service temporarily unavailable', 'Failed to acquire lock on resource', 'Disk space running low',
    'Kafka message queue is full', 'Authentication token expired', 'Circuit breaker is open'
];

export const REGIONS = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-southeast-2', 'sa-east-1'];
export const K8S_POD_NAMESPACES = ['prod', 'staging', 'default'];

export const MOCK_USER_EMAILS = [
    'sre-team@demobank.com', 'devops@demobank.com', 'platform-eng@demobank.com',
    'security@demobank.com', 'jane.doe@demobank.com', 'john.doe@demobank.com'
];

// --- TYPES AND INTERFACES ---

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'FATAL';
export type ViewType = 'dashboard' | 'logs' | 'metrics' | 'traces' | 'alerts' | 'slos' | 'settings';
export type TimeRange = '5m' | '15m' | '1h' | '6h' | '1d' | '3d' | 'custom';

export interface LogEntry {
    id: string;
    timestamp: string;
    level: LogLevel;
    service: string;
    region: string;
    message: string;
    traceId?: string;
    spanId?: string;
    commit?: string;
    statusCode?: number;
    method?: string;
    path?: string;
    latencyMs?: number;
    user?: string;
    k8s_pod_name?: string;
    k8s_namespace?: string;
    metadata?: Record<string, any>;
}

export interface MetricDataPoint {
    timestamp: number; // Unix timestamp in seconds
    value: number;
}

export interface TimeSeries {
    metricName: string;
    tags: Record<string, string>;
    data: MetricDataPoint[];
}

export interface Span {
    id: string;
    traceId: string;
    parentId?: string;
    name: string;
    service: string;
    startTime: number; // Unix timestamp in microseconds
    endTime: number; // Unix timestamp in microseconds
    duration: number; // in microseconds
    tags: Record<string, string | number | boolean>;
    logs: { timestamp: number, fields: Record<string, any> }[];
}

export interface Trace {
    traceId: string;
    rootSpanId: string;
    spans: Span[];
    startTime: number;
    endTime: number;
    duration: number;
    services: string[];
    totalSpans: number;
    hasError: boolean;
}

export type WidgetType = 'timeseries' | 'stat' | 'log_list' | 'gauge' | 'trace_list' | 'slo_status';
export interface Widget {
    id: string;
    type: WidgetType;
    title: string;
    gridPos: { x: number; y: number; w: number; h: number; };
    query: string;
    options: Record<string, any>;
}

export interface Dashboard {
    id: string;
    name: string;
    widgets: Widget[];
}

export type AlertState = 'OK' | 'PENDING' | 'FIRING';
export interface AlertRule {
    id:string;
    name: string;
    query: string;
    duration: string;
    threshold: number;
    comparison: '>' | '<' | '==' | '!=';
    severity: 'critical' | 'warning' | 'info';
    description: string;
    lastState: AlertState;
    lastEvaluated: string;
    activeSince?: string;
}

export interface SLO {
    id: string;
    name: string;
    description: string;
    service: string;
    sli: { type: 'latency' | 'availability'; query: string; };
    slo: { target: number; window: '7d' | '14d' | '30d'; };
    errorBudget: { remainingMinutes: number; totalMinutes: number; consumptionRate: number; };
    status: 'HEALTHY' | 'AT_RISK' | 'BREACHED';
}

export interface UserPreferences {
    theme: 'dark' | 'light';
    defaultTimeRange: TimeRange;
    defaultDashboardId: string;
    notifications: { email: boolean; slack: boolean; pagerduty: boolean; };
    integrations: { slackWebhookUrl?: string; pagerdutyApiKey?: string; githubToken?: string; };
}

export interface AppState {
    currentView: ViewType;
    timeRange: { start: Date; end: Date; };
    isLoading: boolean;
    error: string | null;
    preferences: UserPreferences;
}

// --- MOCK DATA GENERATION ---

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number): number => Math.random() * (max - min) + min;

export const generateMockLogEntry = (timestamp: Date): LogEntry => {
    const level = randomFrom(LOG_LEVELS);
    const hasError = level === 'ERROR' || level === 'FATAL';
    const traceId = Math.random().toString(36).substring(2, 18);
    const service = randomFrom(SERVICE_NAMES);
    return {
        id: Math.random().toString(36).substring(2, 12),
        timestamp: timestamp.toISOString(),
        level,
        service,
        region: randomFrom(REGIONS),
        message: hasError ? `Operation failed: ${randomFrom(ERROR_MESSAGES)}` : 'Request processed successfully',
        traceId,
        spanId: Math.random().toString(36).substring(2, 18),
        commit: Math.random().toString(16).substring(2, 9),
        statusCode: hasError ? randomFrom([500, 503, 400, 401]) : randomFrom([200, 201, 204]),
        method: randomFrom(HTTP_METHODS),
        path: `/api/v1/${randomFrom(['users', 'payments', 'loans', 'transactions'])}/${randomInt(1000, 9999)}`,
        latencyMs: randomInt(10, hasError ? 5000 : 500),
        user: randomFrom(MOCK_USER_EMAILS),
        k8s_pod_name: `${service}-${Math.random().toString(36).substring(2, 10)}`,
        k8s_namespace: randomFrom(K8S_POD_NAMESPACES),
        metadata: { deployment_id: `v${randomInt(1,3)}.${randomInt(0,9)}.${randomInt(0,20)}` }
    };
};

export const generateMockLogs = (count: number, timeWindowSeconds: number): LogEntry[] => {
    const logs: LogEntry[] = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        const timestamp = new Date(now.getTime() - randomInt(0, timeWindowSeconds * 1000));
        logs.push(generateMockLogEntry(timestamp));
    }
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateMockTimeSeries = (metricName: string, tags: Record<string, string>, startTime: Date, endTime: Date, stepSeconds: number): TimeSeries => {
    const data: MetricDataPoint[] = [];
    let currentTime = Math.floor(startTime.getTime() / 1000);
    const endTimeSec = Math.floor(endTime.getTime() / 1000);
    while (currentTime <= endTimeSec) {
        let value = 0;
        if (metricName.includes('cpu')) value = randomFloat(10, 90) + Math.sin(currentTime / 3600) * 10;
        else if (metricName.includes('memory')) value = randomFloat(8, 16) * 1024;
        else if (metricName.includes('latency')) value = Math.abs(randomFloat(20, 200) + Math.sin(currentTime / 600) * 50);
        else if (metricName.includes('error_rate')) value = randomFloat(0, 0.05);
        else value = randomFloat(0, 1000);
        data.push({ timestamp: currentTime, value: parseFloat(value.toFixed(2)) });
        currentTime += stepSeconds;
    }
    return { metricName, tags, data };
};

export const generateMockTrace = (): Trace => {
    const traceId = Math.random().toString(36).substring(2, 22);
    const totalSpans = randomInt(3, 15);
    const spans: Span[] = [];
    const servicesInTrace = new Set<string>();
    const startTime = new Date().getTime() * 1000 - randomInt(1000000, 60000000); // in microseconds
    let rootSpan: Span | null = null;
    let lastSpanEndTime = startTime;
    let hasError = false;

    for (let i = 0; i < totalSpans; i++) {
        const service = randomFrom(SERVICE_NAMES);
        servicesInTrace.add(service);
        const parentSpan = i > 0 ? spans[Math.floor(Math.random() * spans.length)] : undefined;
        const spanStartTime = parentSpan ? parentSpan.endTime + randomInt(1000, 50000) : startTime;
        const duration = randomInt(10000, 500000);
        const spanEndTime = spanStartTime + duration;
        lastSpanEndTime = Math.max(lastSpanEndTime, spanEndTime);
        const isError = Math.random() < 0.1;
        if (isError) hasError = true;

        const span: Span = {
            id: Math.random().toString(36).substring(2, 18), traceId, parentId: parentSpan?.id,
            name: `${randomFrom(HTTP_METHODS)} /api/${service.split('-')[0]}`, service,
            startTime: spanStartTime, endTime: spanEndTime, duration,
            tags: {
                'http.method': randomFrom(HTTP_METHODS),
                'http.status_code': isError ? randomFrom([500, 503]) : 200,
                'region': randomFrom(REGIONS), 'error': isError,
                'db.statement': isError ? '' : 'SELECT * FROM users WHERE id=?',
            },
            logs: isError ? [{ timestamp: spanEndTime - 1000, fields: { event: 'error', message: randomFrom(ERROR_MESSAGES) }}] : [],
        };
        if (i === 0) rootSpan = span;
        spans.push(span);
    }

    return {
        traceId, rootSpanId: rootSpan!.id, spans, startTime, endTime: lastSpanEndTime,
        duration: lastSpanEndTime - startTime, services: Array.from(servicesInTrace), totalSpans, hasError
    };
};

export const generateMockTraces = (count: number): Trace[] => Array.from({ length: count }, generateMockTrace);

export const generateMockAlertRules = (): AlertRule[] => {
    return [
        { id: 'alert-1', name: 'High CPU on payments-api', query: 'avg(cpu_usage{service="payments-api"}) > 80', duration: '5m', threshold: 80, comparison: '>', severity: 'critical', description: 'The average CPU usage for the payments-api has been over 80% for the last 5 minutes.', lastState: Math.random() > 0.5 ? 'FIRING' : 'OK', lastEvaluated: new Date().toISOString(), activeSince: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
        { id: 'alert-2', name: 'Increased P99 Latency on frontend-gateway', query: 'p99(latency_ms{service="frontend-gateway"}) > 500', duration: '10m', threshold: 500, comparison: '>', severity: 'warning', description: 'P99 request latency for the frontend-gateway is over 500ms.', lastState: 'OK', lastEvaluated: new Date().toISOString() },
        { id: 'alert-3', name: 'User Service 5xx Error Rate High', query: 'sum(rate(http_requests_total{service="users-service", code=~"5.."}[5m])) / sum(rate(http_requests_total{service="users-service"}[5m])) > 0.05', duration: '5m', threshold: 0.05, comparison: '>', severity: 'critical', description: 'The 5xx error rate for the user service is over 5%.', lastState: 'OK', lastEvaluated: new Date().toISOString() },
        { id: 'alert-4', name: 'Kafka Queue Approaching Capacity', query: 'kafka_queue_size{topic="loan-applications"} > 1000000', duration: '15m', threshold: 1000000, comparison: '>', severity: 'warning', description: 'The loan applications Kafka queue has over 1 million messages.', lastState: Math.random() > 0.8 ? 'FIRING' : 'OK', lastEvaluated: new Date().toISOString(), activeSince: new Date(Date.now() - 3 * 60 * 1000).toISOString() }
    ];
};

export const generateMockSLOs = (): SLO[] => {
    return [
        { id: 'slo-1', service: 'payments-api', name: 'Payments API Availability', description: 'Measures the availability of the core payments endpoint.', sli: { type: 'availability', query: 'rate(http_requests_total{service="payments-api", path="/api/v1/process", code!~"5.."}[1m]) / rate(http_requests_total{service="payments-api", path="/api/v1/process"}[1m])' }, slo: { target: 99.95, window: '30d' }, errorBudget: { remainingMinutes: 20.5, totalMinutes: 21.6, consumptionRate: 1.2 }, status: 'HEALTHY' },
        { id: 'slo-2', service: 'users-service', name: 'User Service Latency', description: 'Measures the P99 latency for user profile lookups.', sli: { type: 'latency', query: 'histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service="users-service"}[5m])) by (le)) < 0.2' }, slo: { target: 99.0, window: '14d' }, errorBudget: { remainingMinutes: 50.1, totalMinutes: 201.6, consumptionRate: 2.5 }, status: 'AT_RISK' },
        { id: 'slo-3', service: 'frontend-gateway', name: 'Web App Availability', description: 'Ensures the main web application is serving traffic correctly.', sli: { type: 'availability', query: 'rate(http_requests_total{service="frontend-gateway", code!~"5.."}[1m]) / rate(http_requests_total{service="frontend-gateway"}[1m])' }, slo: { target: 99.99, window: '30d' }, errorBudget: { remainingMinutes: -5.2, totalMinutes: 4.32, consumptionRate: 8.1 }, status: 'BREACHED' }
    ];
};

export const generateMockDashboard = (): Dashboard => ({
    id: 'default-dashboard', name: 'Default System Overview',
    widgets: [
        { id: 'widget-1', type: 'timeseries', title: 'Payments API CPU Usage (%)', gridPos: { x: 0, y: 0, w: 6, h: 4 }, query: 'avg(cpu_usage{service="payments-api"}) by (region)', options: { chartType: 'line' } },
        { id: 'widget-2', type: 'timeseries', title: 'Users Service P99 Latency (ms)', gridPos: { x: 6, y: 0, w: 6, h: 4 }, query: 'p99(latency_ms{service="users-service"})', options: { chartType: 'area' } },
        { id: 'widget-3', type: 'stat', title: 'Total 5xx Errors (Last Hour)', gridPos: { x: 0, y: 4, w: 4, h: 2 }, query: 'count(logs | level="ERROR" and statusCode >= 500)', options: { color: 'red' } },
        { id: 'widget-4', type: 'gauge', title: 'Database Connection Pool', gridPos: { x: 4, y: 4, w: 4, h: 2 }, query: 'avg(db_connection_pool_usage)', options: { max: 100 } },
        { id: 'widget-5', type: 'log_list', title: 'Recent Critical Errors', gridPos: { x: 8, y: 4, w: 4, h: 6 }, query: 'logs | level="FATAL" or level="ERROR"', options: { limit: 10 } },
        { id: 'widget-6', type: 'timeseries', title: 'Fraud Engine Decisions', gridPos: { x: 0, y: 6, w: 8, h: 4 }, query: 'rate(fraud_decisions{status=~"approved|declined"}) by (status)', options: { chartType: 'bar', stacked: true } }
    ]
});


// --- MOCK API SERVICE ---

export const mockObservabilityApi = {
    async fetchLogs(query: string, startTime: Date, endTime: Date): Promise<LogEntry[]> {
        console.log(`Fetching logs with query "${query}" from ${startTime.toISOString()} to ${endTime.toISOString()}`);
        await new Promise(resolve => setTimeout(resolve, randomInt(300, 1500)));
        const timeWindowSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
        return generateMockLogs(randomInt(50, 500), timeWindowSeconds);
    },
    async fetchMetrics(query: string, startTime: Date, endTime: Date, stepSeconds: number): Promise<TimeSeries[]> {
        console.log(`Fetching metrics with query "${query}" from ${startTime.toISOString()} to ${endTime.toISOString()}`);
        await new Promise(resolve => setTimeout(resolve, randomInt(400, 2000)));
        const metricNameMatch = query.match(/(\w+){/);
        const metricName = metricNameMatch ? metricNameMatch[1] : 'cpu_usage';
        const serviceTagMatch = query.match(/service="([^"]+)"/);
        const serviceTag = serviceTagMatch ? serviceTagMatch[1] : 'payments-api';
        return [generateMockTimeSeries(metricName, { service: serviceTag, region: 'us-east-1' }, startTime, endTime, stepSeconds)];
    },
    async fetchTraces(query: string, startTime: Date, endTime: Date): Promise<Trace[]> {
        console.log(`Fetching traces with query "${query}" from ${startTime.toISOString()} to ${endTime.toISOString()}`);
        await new Promise(resolve => setTimeout(resolve, randomInt(500, 2500)));
        return generateMockTraces(randomInt(10, 50));
    },
    async fetchTraceById(traceId: string): Promise<Trace | null> {
        console.log(`Fetching trace with ID "${traceId}"`);
        await new Promise(resolve => setTimeout(resolve, randomInt(200, 800)));
        if (traceId) { const trace = generateMockTrace(); trace.traceId = traceId; return trace; }
        return null;
    },
    async fetchAlertRules(): Promise<AlertRule[]> {
        console.log('Fetching alert rules');
        await new Promise(resolve => setTimeout(resolve, randomInt(200, 600)));
        return generateMockAlertRules();
    },
    async fetchSLOs(): Promise<SLO[]> {
        console.log('Fetching SLOs');
        await new Promise(resolve => setTimeout(resolve, randomInt(300, 700)));
        return generateMockSLOs();
    },
    async fetchDashboard(id: string): Promise<Dashboard> {
        console.log(`Fetching dashboard with ID "${id}"`);
        await new Promise(resolve => setTimeout(resolve, randomInt(100, 400)));
        return generateMockDashboard();
    }
};

// --- UTILITY FUNCTIONS ---

export const formatTimestamp = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};
export const formatDuration = (us: number): string => {
    if (us >= 1000000) return `${(us / 1000000).toFixed(2)}s`;
    if (us >= 1000) return `${(us / 1000).toFixed(2)}ms`;
    return `${us}µs`;
};
export const getColorForService = (serviceName: string): string => {
    const colors = ['text-red-400', 'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-purple-400', 'text-pink-400', 'text-indigo-400', 'text-teal-400', 'text-orange-400'];
    let hash = 0;
    for (let i = 0; i < serviceName.length; i++) { hash = serviceName.charCodeAt(i) + ((hash << 5) - hash); }
    return colors[Math.abs(hash % colors.length)];
};


// --- REUSABLE UI COMPONENTS ---

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
    return <div className={`animate-spin rounded-full border-t-2 border-b-2 border-cyan-500 ${sizeClasses[size]}`}></div>;
};

export const AppIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
    const icons: Record<string, JSX.Element> = {
        dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
        logs: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
        metrics: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
        traces: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l-5 5M21 21l-6-6" />,
        alerts: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
        slos: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
        settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
        ai: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    };
    return <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">{icons[name] || <circle cx="12" cy="12" r="10" strokeWidth="2" />}</svg>;
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};


// --- FEATURE-SPECIFIC COMPONENTS ---

export const LogLine: React.FC<{ log: LogEntry; isExpanded: boolean; onToggle: () => void; }> = React.memo(({ log, isExpanded, onToggle }) => {
    const levelColor = useMemo(() => {
        switch (log.level) {
            case 'ERROR': case 'FATAL': return 'bg-red-900/50 text-red-300';
            case 'WARN': return 'bg-yellow-900/50 text-yellow-300';
            default: return 'bg-gray-800/50 text-gray-400';
        }
    }, [log.level]);

    return (
        <div className="font-mono text-xs border-b border-gray-800 hover:bg-gray-800/30">
            <div className="flex items-center p-2 cursor-pointer" onClick={onToggle}>
                <span className="w-40 text-gray-500">{formatTimestamp(log.timestamp)}</span>
                <span className={`w-12 text-center py-0.5 rounded-sm ${levelColor}`}>{log.level}</span>
                <span className={`w-48 ml-4 font-bold ${getColorForService(log.service)}`}>{log.service}</span>
                <span className="flex-1 ml-4 text-gray-300 truncate">{log.message}</span>
            </div>
            {isExpanded && (
                <div className="bg-gray-900/70 p-4">
                    <h4 className="text-sm font-bold text-cyan-300 mb-2">Log Details</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-400">
                        {Object.entries(log).map(([key, value]) => (
                             <div key={key} className="truncate">
                                <strong className="text-gray-200">{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export const AlertCard: React.FC<{ rule: AlertRule }> = ({ rule }) => {
    const stateColor = useMemo(() => {
        if (rule.lastState === 'FIRING') return rule.severity === 'critical' ? 'border-red-500' : 'border-yellow-500';
        return 'border-green-500';
    }, [rule.lastState, rule.severity]);
    const severityColor = useMemo(() => {
        if (rule.severity === 'critical') return 'bg-red-600';
        if (rule.severity === 'warning') return 'bg-yellow-600';
        return 'bg-blue-600';
    }, [rule.severity]);

    return (
        <Card title={rule.name}>
             <div className={`border-l-4 ${stateColor} pl-4`}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm">{rule.description}</p>
                        <pre className="text-xs text-cyan-300 font-mono bg-gray-900/50 p-2 rounded mt-2">{rule.query}</pre>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${severityColor}`}>{rule.severity.toUpperCase()}</span>
                        <span className="text-sm mt-2 text-gray-300">{rule.lastState}</span>
                    </div>
                </div>
                 <div className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-700">Last evaluated: {formatTimestamp(rule.lastEvaluated)}</div>
             </div>
        </Card>
    );
};

export const SLOCard: React.FC<{ slo: SLO }> = ({ slo }) => {
    const statusColor = {
        HEALTHY: 'border-green-500',
        AT_RISK: 'border-yellow-500',
        BREACHED: 'border-red-500',
    }[slo.status];

    const budgetPercent = (slo.errorBudget.remainingMinutes / slo.errorBudget.totalMinutes) * 100;

    return (
        <Card title={slo.name}>
            <div className={`border-l-4 ${statusColor} pl-4`}>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-white">{slo.service}</h4>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${statusColor.replace('border', 'bg')}/30 ${statusColor.replace('border', 'text')}`}>{slo.status}</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">{slo.description}</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs text-gray-500">SLO Target</div>
                        <div className="text-xl font-bold text-cyan-400">{slo.slo.target}% over {slo.slo.window}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Error Budget Remaining</div>
                        <div className="text-xl font-bold text-white">{budgetPercent.toFixed(2)}% <span className="text-sm font-normal text-gray-400">({slo.errorBudget.remainingMinutes.toFixed(1)}m)</span></div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                            <div className={`${budgetPercent > 30 ? 'bg-green-500' : budgetPercent > 10 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.max(0, budgetPercent)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// --- MAIN VIEW COMPONENTS ---

export const LogsExplorerView: React.FC<{}> = () => {
    const [prompt, setPrompt] = useState("show me all 500 errors from the payments-api in the last hour");
    const [generatedQuery, setGeneratedQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [logResults, setLogResults] = useState<LogEntry[]>([]);
    const [error, setError] = useState('');
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true); setGeneratedQuery(''); setLogResults([]); setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `You are an expert SRE. Translate this natural language request into a log query language syntax (like Splunk or LogQL). Request: "${prompt}". Only return the query itself, no backticks or explanations.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            const query = response.text.replace(/`/g, '').trim();
            setGeneratedQuery(query);
            const now = new Date(); const past = new Date(now.getTime() - 60 * 60 * 1000);
            const logs = await mockObservabilityApi.fetchLogs(query, past, now);
            setLogResults(logs);
        } catch (err: any) {
            setError("Error: Could not generate or execute query. " + err.message);
            setGeneratedQuery("Error: Could not generate query.");
        } finally { setIsLoading(false); }
    };

    const toggleLogExpansion = useCallback((logId: string) => { setExpandedLogId(prevId => (prevId === logId ? null : logId)); }, []);

    return (
        <div className="space-y-6">
            <Card title="AI-Powered Log Explorer">
                <div className="flex items-center gap-4">
                    <AppIcon name="ai" className="w-8 h-8 text-cyan-400" />
                    <p className="text-gray-400">Describe the logs you want to find in plain English, and our AI will generate and run the query.</p>
                </div>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 mt-4 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., 'show me p99 latency for the frontend-gateway grouped by region'" />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                    {isLoading ? <><Spinner size="sm" /> Generating & Executing...</> : 'Generate & Run Query'}
                </button>
            </Card>

            {(isLoading || generatedQuery || error) && (
                <Card title="Query & Results">
                    <div className="space-y-4">
                         {error && <div className="p-3 bg-red-900/50 text-red-300 rounded">{error}</div>}
                        <div>
                            <h4 className="text-sm font-semibold text-cyan-300">Generated Query:</h4>
                            <pre className="text-sm text-gray-300 font-mono bg-gray-900/50 p-2 rounded mt-1 overflow-x-auto">{isLoading && !generatedQuery ? 'Generating...' : generatedQuery}</pre>
                        </div>
                         <div>
                            <h4 className="text-sm font-semibold text-cyan-300">Log Results ({logResults.length} lines):</h4>
                            <div className="bg-gray-900/50 rounded mt-1 max-h-[60vh] overflow-auto">
                               {isLoading && !logResults.length ? <div className="p-4 text-center text-gray-400">Executing query...</div> : 
                                logResults.length > 0 ? (logResults.map(log => <LogLine key={log.id} log={log} isExpanded={expandedLogId === log.id} onToggle={() => toggleLogExpansion(log.id)} />)) 
                                : (<div className="p-4 text-center text-gray-400">No results found.</div>)}
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export const DashboardView: React.FC = () => {
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    useEffect(() => { mockObservabilityApi.fetchDashboard('default-dashboard').then(setDashboard); }, []);
    if (!dashboard) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">{dashboard.name}</h3>
            <div className="grid grid-cols-12 gap-6">
                {dashboard.widgets.map(widget => (
                    <div key={widget.id} style={{ gridColumn: `span ${widget.gridPos.w}`, gridRow: `span ${widget.gridPos.h}` }}>
                        <Card title={widget.title}>
                           <div className="h-full flex items-center justify-center text-gray-500">
                                Mock Widget Content for '{widget.type}' - Query: {widget.query}
                           </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const MetricsExplorerView: React.FC = () => <Card title="Metrics Explorer"><p className="text-gray-400">This feature is under construction. Check back soon for interactive metric charting!</p></Card>;

export const TracesExplorerView: React.FC = () => {
    const [traces, setTraces] = useState<Trace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);

    useEffect(() => {
        const now = new Date();
        const past = new Date(now.getTime() - 60 * 60 * 1000);
        mockObservabilityApi.fetchTraces('', past, now).then(data => {
            setTraces(data.sort((a,b) => b.startTime - a.startTime));
            setIsLoading(false);
        });
    }, []);

    const TraceGanttChart: React.FC<{ trace: Trace }> = ({ trace }) => {
        const totalDuration = trace.duration;
        const spanTree = useMemo(() => {
            const spansById = new Map(trace.spans.map(s => [s.id, { ...s, children: [] as Span[] }]));
            const rootSpans: Span[] = [];
            trace.spans.forEach(s => {
                const spanWithChildren = spansById.get(s.id)!;
                if (s.parentId && spansById.has(s.parentId)) {
                    spansById.get(s.parentId)!.children.push(spanWithChildren);
                } else {
                    rootSpans.push(spanWithChildren);
                }
            });
            return rootSpans;
        }, [trace]);

        const SpanBar: React.FC<{ span: any, level: number }> = ({ span, level }) => {
            const left = ((span.startTime - trace.startTime) / totalDuration) * 100;
            const width = (span.duration / totalDuration) * 100;
            const hasError = span.tags.error;

            return (
                <div>
                    <div className="h-6 flex items-center mb-1" style={{ paddingLeft: `${level * 20}px` }}>
                        <div className="group relative w-full h-full" style={{ marginLeft: `${left}%`, width: `${width}%` }}>
                            <div className={`h-full rounded-sm px-2 flex items-center justify-between text-xs font-semibold truncate ${hasError ? 'bg-red-500/70' : 'bg-cyan-500/70'} hover:opacity-80`}>
                                <span>{span.service}: {span.name}</span>
                                <span>{formatDuration(span.duration)}</span>
                            </div>
                        </div>
                    </div>
                    {span.children.sort((a,b) => a.startTime - b.startTime).map(child => <SpanBar key={child.id} span={child} level={level + 1} />)}
                </div>
            );
        };
        return <div className="font-mono text-white text-xs mt-4 space-y-1">{spanTree.sort((a,b) => a.startTime - b.startTime).map(s => <SpanBar key={s.id} span={s} level={0} />)}</div>;
    };
    
    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    
    if (selectedTrace) {
        return (
            <Card title={`Trace Details: ${selectedTrace.traceId}`}>
                <button onClick={() => setSelectedTrace(null)} className="mb-4 text-cyan-400 hover:underline">{'< Back to all traces'}</button>
                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div><strong className="text-gray-400">Services:</strong> {selectedTrace.services.join(', ')}</div>
                    <div><strong className="text-gray-400">Total Spans:</strong> {selectedTrace.totalSpans}</div>
                    <div><strong className="text-gray-400">Total Duration:</strong> {formatDuration(selectedTrace.duration)}</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto"><TraceGanttChart trace={selectedTrace} /></div>
            </Card>
        );
    }
    
    return (
        <Card title="Distributed Tracing Explorer">
            <div className="divide-y divide-gray-700">
                {traces.map(trace => (
                    <div key={trace.id} className="p-3 hover:bg-gray-800/50 cursor-pointer" onClick={() => setSelectedTrace(trace)}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className={`w-3 h-3 rounded-full ${trace.hasError ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                <div>
                                    <div className="font-bold text-white">{trace.spans.find(s=>s.id === trace.rootSpanId)?.name || 'Unknown Operation'}</div>
                                    <div className="text-xs text-gray-400">{trace.traceId}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold">{formatDuration(trace.duration)}</div>
                                <div className="text-xs text-gray-500">{trace.totalSpans} spans</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const AlertingView: React.FC = () => {
    const [rules, setRules] = useState<AlertRule[]>([]);
    useEffect(() => { mockObservabilityApi.fetchAlertRules().then(setRules); }, []);
    if (!rules.length) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Alerting Rules</h3>
             <div className="space-y-4">
                {rules.map(rule => <AlertCard key={rule.id} rule={rule} />)}
            </div>
        </div>
    );
};

export const SLOsView: React.FC = () => {
    const [slos, setSlos] = useState<SLO[]>([]);
    useEffect(() => { mockObservabilityApi.fetchSLOs().then(setSlos); }, []);
    if (!slos.length) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Service Level Objectives (SLOs)</h3>
            <div className="space-y-4">
                {slos.map(slo => <SLOCard key={slo.id} slo={slo} />)}
            </div>
        </div>
    );
}

export const SettingsView: React.FC = () => {
    const [prefs, setPrefs] = useState<UserPreferences>({ theme: 'dark', defaultTimeRange: '1h', defaultDashboardId: 'default-dashboard', notifications: { email: true, slack: false, pagerduty: false }, integrations: {} });
    return (
        <Card title="Settings">
            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">Preferences</h4>
                    <label className="block text-gray-400">Theme</label>
                    <select value={prefs.theme} onChange={e => setPrefs(p => ({...p, theme: e.target.value as any}))} className="bg-gray-700 p-2 rounded w-full">
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">Notifications</h4>
                    <div className="flex items-center gap-4">
                        <label><input type="checkbox" checked={prefs.notifications.email} onChange={e => setPrefs(p => ({...p, notifications: {...p.notifications, email: e.target.checked}}))} /> Email</label>
                        <label><input type="checkbox" checked={prefs.notifications.slack} onChange={e => setPrefs(p => ({...p, notifications: {...p.notifications, slack: e.target.checked}}))} /> Slack</label>
                        <label><input type="checkbox" checked={prefs.notifications.pagerduty} onChange={e => setPrefs(p => ({...p, notifications: {...p.notifications, pagerduty: e.target.checked}}))} /> PagerDuty</label>
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">Integrations</h4>
                    <div className="space-y-4">
                        <div><label className="block text-gray-400">Slack Webhook URL</label><input type="text" placeholder="https://hooks.slack.com/services/..." className="bg-gray-700 p-2 rounded w-full" /></div>
                        <div><label className="block text-gray-400">PagerDuty API Key</label><input type="password" placeholder="**************" className="bg-gray-700 p-2 rounded w-full" /></div>
                        <div><label className="block text-gray-400">GitHub Token</label><input type="password" placeholder="**************" className="bg-gray-700 p-2 rounded w-full" /></div>
                    </div>
                </div>
                <button className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 rounded">Save Settings</button>
            </div>
        </Card>
    );
};

// --- NAVIGATION ---

export const MainNav: React.FC<{ activeView: ViewType; onViewChange: (view: ViewType) => void }> = ({ activeView, onViewChange }) => {
    const navItems: { id: ViewType; name: string; icon: string }[] = [
        { id: 'dashboard', name: 'Dashboard', icon: 'dashboard' },
        { id: 'logs', name: 'Logs', icon: 'logs' },
        { id: 'metrics', name: 'Metrics', icon: 'metrics' },
        { id: 'traces', name: 'Traces', icon: 'traces' },
        { id: 'alerts', name: 'Alerts', icon: 'alerts' },
        { id: 'slos', name: 'SLOs', icon: 'slos' },
        { id: 'settings', name: 'Settings', icon: 'settings' },
    ];

    return (
        <nav className="bg-gray-900/50 p-4 rounded-lg">
            <ul className="flex items-center justify-around">
                {navItems.map(item => (
                    <li key={item.id}>
                        <button onClick={() => onViewChange(item.id)} className={`flex flex-col items-center gap-1 w-24 p-2 rounded-md transition-colors ${activeView === item.id ? 'bg-cyan-600/50 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                            <AppIcon name={item.icon} className="w-6 h-6" />
                            <span className="text-xs font-medium">{item.name}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

// --- MAIN APPLICATION COMPONENT ---

const DemoBankObservabilityPlatformView: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewType>('logs');

    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardView />;
            case 'logs': return <LogsExplorerView />;
            case 'metrics': return <MetricsExplorerView />;
            case 'traces': return <TracesExplorerView />;
            case 'alerts': return <AlertingView />;
            case 'slos': return <SLOsView />;
            case 'settings': return <SettingsView />;
            default: return <LogsExplorerView />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Observability Platform</h2>
                <div className="text-gray-400">Welcome, SRE Team</div>
            </div>
            <MainNav activeView={currentView} onViewChange={setCurrentView} />
            <main className="mt-6">{renderCurrentView()}</main>
        </div>
    );
};

export default DemoBankObservabilityPlatformView;