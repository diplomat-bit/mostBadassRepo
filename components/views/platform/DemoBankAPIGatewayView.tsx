// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankAPIGatewayView.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Card from '../../Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line, Legend, CartesianGrid, PieChart, Pie, Cell, BarChart, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

// In a real app, this data would come from a dedicated file or a live API call
const originalTrafficData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  requests: 1500 + Math.sin(i / 4) * 500 + Math.random() * 300,
}));
const originalLatencyData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  p95: 120 + Math.random() * 20,
  p99: 180 + Math.random() * 40,
}));
const originalEndpoints = [
    { id: 1, method: 'GET', path: '/v1/users/me', avgLatency: '85ms', errorRate: '0.1%', status: 'Healthy' },
    { id: 2, method: 'POST', path: '/v1/transactions', avgLatency: '120ms', errorRate: '0.3%', status: 'Healthy' },
    { id: 3, method: 'GET', path: '/v1/ai/advisor/chat', avgLatency: '450ms', errorRate: '1.2%', status: 'Degraded' },
    { id: 4, method: 'POST', path: '/v1/payments/send', avgLatency: '150ms', errorRate: '0.0%', status: 'Healthy' },
];


// SECTION: SVG ICONS AS REACT COMPONENTS
// As per directive, no new imports are allowed. Icons are defined as inline components.

export const IconAlertTriangle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);

export const IconShieldCheck: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
);

export const IconSearch: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);

export const IconPlusCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
);

export const IconTrash2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);

export const IconEdit: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);

export const IconXCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
);

export const IconCopy: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);

export const IconCheck: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>
);

export const IconChevronDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9" /></svg>
);

export const IconChevronUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="18 15 12 9 6 15" /></svg>
);

export const IconInfo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
);

export const IconChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6" /></svg>
);

export const IconChevronLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6" /></svg>
);

export const IconBot: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
);

export const IconSettings: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);

export const IconFileText: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
);

export const IconMapPin: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);

export const IconDatabase: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
);

export const IconTrendingUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);

export const IconFilter: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
);

export const IconRefreshCw: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
);

// SECTION: TYPE DEFINITIONS

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
export type EndpointStatus = 'Healthy' | 'Degraded' | 'Down';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
export type SecurityEventType = 'SQLi Attempt' | 'XSS Attempt' | 'Anomalous Traffic' | 'Credential Stuffing' | 'Auth Failure';
export type TimeRange = '1h' | '24h' | '7d' | '30d';
export type AIInsightCategory = 'PERFORMANCE' | 'COST' | 'SECURITY' | 'RELIABILITY';
export type RuleAction = 'block' | 'throttle' | 'log';

export interface Endpoint {
    id: string;
    method: HttpMethod;
    path: string;
    avgLatency: number;
    errorRate: number;
    status: EndpointStatus;
    requests: number;
    peakLatency: number;
    uptime: number;
}

export interface TrafficPoint {
    time: string;
    requests: number;
}

export interface LatencyPoint {
    time: string;
    p95: number;
    p99: number;
}

export interface LogEntry {
    id: string;
    timestamp: Date;
    level: LogLevel;
    message: string;
    requestId?: string;
    path?: string;
    method?: HttpMethod;
    statusCode?: number;
    ip?: string;
}

export interface ApiKey {
    id: string;
    name: string;
    keyPrefix: string;
    lastUsed: Date | null;
    created: Date;
    expires: Date | null;
    scopes: string[];
    isActive: boolean;
}

export interface RateLimitRule {
    id: string;
    pathPattern: string;
    methods: HttpMethod[] | ['*'];
    requests: number;
    perSeconds: number;
    action: RuleAction;
    isEnabled: boolean;
}

export interface CacheRule {
    id: string;
    pathPattern: string;
    ttlSeconds: number;
    isEnabled: boolean;
}

export interface CacheStats {
    hitRate: number;
    missRate: number;
    totalEntries: number;
    memoryUsageMB: number;
    readOpsPerSec: number;
    writeOpsPerSec: number;
}

export interface GeoLocation {
    country: string;
    countryCode: string;
    city: string;
    lat: number;
    lon: number;
}

export interface SecurityEvent {
    id: string;
    timestamp: Date;
    type: SecurityEventType;
    sourceIp: string;
    path: string;
    details: string;
    actionTaken: 'Blocked' | 'Logged' | 'Alerted' | 'Rate Limited';
    geo: GeoLocation;
}

export interface DashboardMetrics {
    totalRequests: number;
    errorRate: number;
    avgLatency: number;
    uptime: number;
}

export interface AIInsight {
    id: string;
    category: AIInsightCategory;
    title: string;
    description: string;
    recommendation: string;
    severity: 'Low' | 'Medium' | 'High';
    timestamp: Date;
}

export interface Integration {
    id: 'datadog' | 'pagerduty' | 'slack' | 'github';
    name: string;
    description: string;
    isEnabled: boolean;
}

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

// SECTION: CONSTANTS & ENUMS

export const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
];

export const LOG_LEVEL_COLORS: { [key in LogLevel]: string } = {
    INFO: 'text-cyan-400',
    WARN: 'text-yellow-400',
    ERROR: 'text-red-400',
    DEBUG: 'text-gray-500',
};

export const STATUS_INDICATORS: { [key in EndpointStatus]: string } = {
    Healthy: 'bg-green-500',
    Degraded: 'bg-yellow-500',
    Down: 'bg-red-500',
};

// SECTION: UTILITY FUNCTIONS

export const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
};

export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


// SECTION: MOCK DATA GENERATION

const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateId = (): string => Math.random().toString(36).substring(2, 10);

const GEO_LOCATIONS: GeoLocation[] = [
    { country: 'United States', countryCode: 'US', city: 'New York', lat: 40.7128, lon: -74.0060 },
    { country: 'Germany', countryCode: 'DE', city: 'Berlin', lat: 52.5200, lon: 13.4050 },
    { country: 'Japan', countryCode: 'JP', city: 'Tokyo', lat: 35.6895, lon: 139.6917 },
    { country: 'Brazil', countryCode: 'BR', city: 'São Paulo', lat: -23.5505, lon: -46.6333 },
    { country: 'India', countryCode: 'IN', city: 'Bangalore', lat: 12.9716, lon: 77.5946 },
    { country: 'Nigeria', countryCode: 'NG', city: 'Lagos', lat: 6.5244, lon: 3.3792 },
];

export const generateEndpoints = (): Endpoint[] => [
    { id: generateId(), method: 'GET', path: '/v1/users/me', avgLatency: 85, errorRate: 0.1, status: 'Healthy', requests: 120500, peakLatency: 250, uptime: 99.99 },
    { id: generateId(), method: 'POST', path: '/v1/transactions', avgLatency: 120, errorRate: 0.3, status: 'Healthy', requests: 85000, peakLatency: 400, uptime: 99.98 },
    { id: generateId(), method: 'GET', path: '/v1/ai/advisor/chat', avgLatency: 450, errorRate: 1.2, status: 'Degraded', requests: 15200, peakLatency: 1500, uptime: 99.80 },
    { id: generateId(), method: 'POST', path: '/v1/payments/send', avgLatency: 150, errorRate: 0.05, status: 'Healthy', requests: 65000, peakLatency: 300, uptime: 99.99 },
    { id: generateId(), method: 'GET', path: '/v1/accounts', avgLatency: 95, errorRate: 0.2, status: 'Healthy', requests: 250000, peakLatency: 280, uptime: 99.99 },
    { id: generateId(), method: 'GET', path: '/v1/accounts/{id}/balance', avgLatency: 50, errorRate: 0.01, status: 'Healthy', requests: 850000, peakLatency: 150, uptime: 100 },
    { id: generateId(), method: 'DELETE', path: '/v1/sessions', avgLatency: 70, errorRate: 0.0, status: 'Healthy', requests: 75000, peakLatency: 200, uptime: 100 },
    { id: generateId(), method: 'PUT', path: '/v1/users/profile', avgLatency: 180, errorRate: 0.8, status: 'Healthy', requests: 23000, peakLatency: 500, uptime: 99.95 },
    { id: generateId(), method: 'GET', path: '/v3/data/market-trends', avgLatency: 850, errorRate: 5.6, status: 'Down', requests: 500, peakLatency: 3000, uptime: 94.5 },
];

export const generateTrafficData = (range: TimeRange): TrafficPoint[] => {
    const now = new Date();
    let points: number, interval: number; // in minutes

    switch (range) {
        case '1h': points = 60; interval = 1; break;
        case '7d': points = 7 * 24; interval = 60; break;
        case '30d': points = 30 * 24; interval = 60; break;
        case '24h':
        default: points = 24; interval = 60; break;
    }

    return Array.from({ length: points }, (_, i) => {
        const time = new Date(now.getTime() - (points - 1 - i) * interval * 60 * 1000);
        const timeKey = range === '1h' ? time.toLocaleTimeString([], { minute: '2-digit' }) : 
                        range === '24h' ? `${time.getHours()}:00` : 
                        time.toLocaleDateString();
        return {
            time: timeKey,
            requests: 1500 + Math.sin(i / (points / 24)) * 500 + Math.random() * 300,
        };
    }).reduce((acc, curr) => { // Aggregate data for 7d and 30d views
        const last = acc[acc.length - 1];
        if (last && last.time === curr.time) {
            last.requests += curr.requests;
        } else {
            acc.push(curr);
        }
        return acc;
    }, [] as TrafficPoint[]);
};

export const generateLatencyData = (range: TimeRange): LatencyPoint[] => {
    let points: number;
    switch (range) {
        case '1h': points = 60; break;
        case '24h': points = 24; break;
        case '7d': points = 7; break;
        case '30d':
        default: points = 30; break;
    }
    const now = new Date();
    return Array.from({ length: points }, (_, i) => {
        const time = new Date(now.getTime() - (points - 1 - i) * (range === '1h' ? 60000 : 24*60*60000));
        const timeKey = range === '1h' ? time.toLocaleTimeString([], { minute: '2-digit' }) : 
                        range === '24h' ? `${time.getHours()}:00` :
                        time.toLocaleDateString([], { month: 'short', day: 'numeric' });
        return {
            time: timeKey,
            p95: 120 + Math.random() * 20 + Math.sin(i / 5) * 10,
            p99: 180 + Math.random() * 40 + Math.sin(i / 5) * 20,
        };
    });
};

export const generateLogEntry = (): LogEntry => {
    const endpoints = generateEndpoints();
    const endpoint = randomChoice(endpoints);
    const levels: LogLevel[] = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR', 'DEBUG'];
    const level = randomChoice(levels);
    let statusCode: number;
    let message: string;

    switch (level) {
        case 'ERROR':
            statusCode = randomChoice([500, 502, 503, 404, 401]);
            message = randomChoice(['Database connection lost', 'Upstream service unavailable', 'Null pointer exception in UserService', 'Authentication failed']);
            break;
        case 'WARN':
            statusCode = randomChoice([200, 429]);
            message = randomChoice(['Latency threshold exceeded: 800ms', 'Rate limit hit for IP 123.45.67.89', 'Deprecated API version used']);
            break;
        default:
            statusCode = randomChoice([200, 201, 204]);
            message = 'Request processed successfully';
            break;
    }

    return {
        id: generateId(),
        timestamp: new Date(Date.now() - Math.random() * 10000),
        level,
        message,
        requestId: `req-${generateId()}`,
        path: endpoint.path,
        method: endpoint.method,
        statusCode,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`
    };
};

export const generateApiKeys = (): ApiKey[] => {
    const now = new Date();
    return [
        { id: generateId(), name: 'Frontend App', keyPrefix: 'pk_live_a1b2c3d4', lastUsed: new Date(now.getTime() - 1000 * 60 * 5), created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30), expires: null, scopes: ['read:accounts', 'write:transactions'], isActive: true },
        { id: generateId(), name: 'Analytics Service', keyPrefix: 'sk_live_e5f6g7h8', lastUsed: new Date(now.getTime() - 1000 * 60 * 60), created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 90), expires: null, scopes: ['read:all'], isActive: true },
        { id: generateId(), name: 'Mobile App (iOS)', keyPrefix: 'pk_live_i9j0k1l2', lastUsed: new Date(now.getTime() - 1000 * 60 * 2), created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15), expires: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 180), scopes: ['read:user', 'write:payments'], isActive: true },
        { id: generateId(), name: 'Legacy Batch Processor', keyPrefix: 'sk_test_m3n4o5p6', lastUsed: null, created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365), expires: null, scopes: ['read:transactions'], isActive: false },
    ];
};

export const generateRateLimitRules = (): RateLimitRule[] => [
    { id: generateId(), pathPattern: '/v1/payments/send', methods: ['POST'], requests: 5, perSeconds: 60, action: 'throttle', isEnabled: true },
    { id: generateId(), pathPattern: '/v1/login', methods: ['POST'], requests: 10, perSeconds: 60, action: 'block', isEnabled: true },
    { id: generateId(), pathPattern: '/v1/ai/advisor/*', methods: ['*'], requests: 20, perSeconds: 3600, action: 'throttle', isEnabled: true },
    { id: generateId(), pathPattern: '/*', methods: ['*'], requests: 100, perSeconds: 1, action: 'throttle', isEnabled: false },
];

export const generateCacheStats = (): CacheStats => ({
    hitRate: 92.5 + Math.random(),
    missRate: 7.5 - Math.random(),
    totalEntries: 1_250_000 + Math.floor(Math.random() * 10000),
    memoryUsageMB: 512 + Math.random() * 10,
    readOpsPerSec: 8500 + Math.random() * 500,
    writeOpsPerSec: 1200 + Math.random() * 100,
});

export const generateSecurityEvents = (): SecurityEvent[] => [
    { id: generateId(), timestamp: new Date(Date.now() - 1000 * 60 * 2), type: 'SQLi Attempt', sourceIp: '198.51.100.23', path: '/v1/login', details: "UNION SELECT username, password FROM users", actionTaken: 'Blocked', geo: randomChoice(GEO_LOCATIONS) },
    { id: generateId(), timestamp: new Date(Date.now() - 1000 * 60 * 15), type: 'XSS Attempt', sourceIp: '203.0.113.88', path: '/v1/users/me/profile', details: "<script>alert('XSS')</script> in bio field", actionTaken: 'Blocked', geo: randomChoice(GEO_LOCATIONS) },
    { id: generateId(), timestamp: new Date(Date.now() - 1000 * 60 * 45), type: 'Anomalous Traffic', sourceIp: '192.0.2.14', path: '/v1/accounts', details: "500 requests in 10s from single IP", actionTaken: 'Alerted', geo: randomChoice(GEO_LOCATIONS) },
    { id: generateId(), timestamp: new Date(Date.now() - 1000 * 60 * 120), type: 'Credential Stuffing', sourceIp: '198.51.100.0/24', path: '/v1/login', details: "High failure rate from multiple IPs in subnet", actionTaken: 'Logged', geo: randomChoice(GEO_LOCATIONS) },
    { id: generateId(), timestamp: new Date(Date.now() - 1000 * 60 * 180), type: 'Auth Failure', sourceIp: '192.0.2.14', path: '/v1/sessions', details: "Invalid JWT token", actionTaken: 'Logged', geo: randomChoice(GEO_LOCATIONS) },
];

export const generateAIInsights = (): AIInsight[] => [
    { id: generateId(), category: 'PERFORMANCE', title: "High Latency on AI Advisor", description: "The p99 latency for the `/v1/ai/advisor/chat` endpoint has increased by 80% in the last 24 hours.", recommendation: "Investigate the downstream AI model service for performance degradation. Consider adding a dedicated cache for common queries.", severity: 'High', timestamp: new Date() },
    { id: generateId(), category: 'COST', title: "Uncached Static Assets", description: "The `/v1/assets/*` path has a low cache hit rate (15%) but accounts for 25% of total egress traffic.", recommendation: "Implement a cache rule with a 24-hour TTL for this path to significantly reduce data transfer costs.", severity: 'Medium', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8) },
    { id: generateId(), category: 'SECURITY', title: "Anomalous Traffic from New ASN", description: "A sudden spike of 404 errors is originating from ASN 12345 (BogusNet), targeting non-existent user profiles.", recommendation: "Monitor traffic from this ASN and consider adding a rate-limiting rule or blocking it at the WAF if the pattern persists.", severity: 'Medium', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: generateId(), category: 'RELIABILITY', title: "High Error Rate on Market Data", description: "The `/v3/data/market-trends` endpoint is experiencing a 5.6% error rate, indicating potential issues with the upstream data provider.", recommendation: "Enable the circuit breaker for this service to prevent cascading failures and notify the data provider of the issue.", severity: 'High', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
];

// SECTION: MOCK API SERVICE

export const apiService = {
    getDashboardMetrics: (range: TimeRange): Promise<DashboardMetrics> => new Promise(res => setTimeout(() => res({ totalRequests: 1200000, errorRate: 0.8, avgLatency: 112, uptime: 99.98 }), 500)),
    getEndpoints: (): Promise<Endpoint[]> => new Promise(res => setTimeout(() => res(generateEndpoints()), 800)),
    getTrafficData: (range: TimeRange): Promise<TrafficPoint[]> => new Promise(res => setTimeout(() => res(generateTrafficData(range)), 600)),
    getLatencyData: (range: TimeRange): Promise<LatencyPoint[]> => new Promise(res => setTimeout(() => res(generateLatencyData(range)), 700)),
    getApiKeys: (): Promise<ApiKey[]> => new Promise(res => setTimeout(() => res(generateApiKeys()), 400)),
    createApiKey: (name: string, scopes: string[], expires: Date | null): Promise<ApiKey> => new Promise(res => setTimeout(() => res({ id: generateId(), name, keyPrefix: `sk_live_${generateId()}`, lastUsed: null, created: new Date(), expires, scopes, isActive: true }), 1000)),
    revokeApiKey: (id: string): Promise<boolean> => new Promise(res => setTimeout(() => res(true), 500)),
    getRateLimitRules: (): Promise<RateLimitRule[]> => new Promise(res => setTimeout(() => res(generateRateLimitRules()), 300)),
    getCacheStats: (): Promise<CacheStats> => new Promise(res => setTimeout(() => res(generateCacheStats()), 450)),
    getSecurityEvents: (): Promise<SecurityEvent[]> => new Promise(res => setTimeout(() => res(generateSecurityEvents()), 900)),
    getAIInsights: (): Promise<AIInsight[]> => new Promise(res => setTimeout(() => res(generateAIInsights()), 1200)),
    getNaturalLanguageResponse: (query: string): Promise<string> => {
        const lowerQuery = query.toLowerCase();
        let response = "I'm not sure how to answer that. Try asking about 'errors', 'latency', or 'traffic'.";
        if (lowerQuery.includes('error')) response = `The total error rate in the last 24 hours is ${ (0.8 + Math.random() * 0.1).toFixed(2) }%. The endpoint with the highest error rate is /v3/data/market-trends.`;
        if (lowerQuery.includes('latency')) response = `The average p99 latency across all services is ${ (180 + Math.random() * 20).toFixed(0) }ms.`;
        if (lowerQuery.includes('traffic')) response = `Total requests in the last 24 hours were approximately ${formatNumber(1200000 + (Math.random() - 0.5) * 100000)}. Peak traffic occurred around 14:00 UTC.`;
        return new Promise(res => setTimeout(() => res(response), 1500));
    },
};

// SECTION: REUSABLE UI COMPONENTS

export const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <svg className="animate-spin h-8 w-8 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

export const SkeletonLoader: React.FC<{className?: string}> = ({className}) => (
    <div className={`bg-gray-700/50 animate-pulse rounded-md ${className || ''}`} />
);

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-lg relative text-white" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold tracking-wide">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <IconXCircle className="w-6 h-6" />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};


export interface TabsProps {
    tabs: { id: string; label: string, icon?: React.ReactNode }[];
    activeTab: string;
    onTabClick: (id: string) => void;
}
export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick }) => (
    <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={`${
                        activeTab === tab.id
                            ? 'border-sky-400 text-sky-400'
                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </nav>
    </div>
);

// SECTION: FEATURE COMPONENTS

export const MetricCard: React.FC<{ title: string; value: string; isLoading: boolean }> = ({ title, value, isLoading }) => (
    <Card className="text-center">
        {isLoading ? (
            <div className="space-y-2">
                <SkeletonLoader className="h-9 w-24 mx-auto" />
                <SkeletonLoader className="h-5 w-32 mx-auto" />
            </div>
        ) : (
            <>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-400 mt-1">{title}</p>
            </>
        )}
    </Card>
);

export interface LiveLogViewerProps { }
export const LiveLogViewer: React.FC<LiveLogViewerProps> = () => {
    const [logs, setLogs] = React.useState<LogEntry[]>([]);
    const [isPaused, setIsPaused] = React.useState(false);
    const logContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const initialLogs = Array.from({ length: 50 }, generateLogEntry).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
        setLogs(initialLogs);
    }, []);

    React.useEffect(() => {
        if (isPaused) return;

        const intervalId = setInterval(() => {
            setLogs(prevLogs => {
                const newLogs = [...prevLogs, generateLogEntry()];
                if (newLogs.length > 200) {
                    newLogs.shift();
                }
                return newLogs;
            });

            if (logContainerRef.current) {
                const { scrollHeight, clientHeight, scrollTop } = logContainerRef.current;
                // Auto-scroll if user is near the bottom
                if (scrollHeight - scrollTop < clientHeight + 100) {
                    setTimeout(() => {
                      if (logContainerRef.current) {
                        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
                      }
                    }, 0);
                }
            }
        }, 1500);

        return () => clearInterval(intervalId);
    }, [isPaused]);

    return (
        <Card title="Live Log Stream" rightHeaderContent={
            <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1 text-sm rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
            >
                {isPaused ? 'Resume' : 'Pause'}
            </button>
        }>
            <div ref={logContainerRef} className="h-96 overflow-y-auto bg-gray-900/50 p-4 rounded-md font-mono text-xs text-gray-300 space-y-2">
                {logs.map(log => (
                    <div key={log.id} className="flex items-start">
                        <span className="text-gray-500 mr-4">{log.timestamp.toISOString().split('T')[1].slice(0, 12)}</span>
                        <span className={`${LOG_LEVEL_COLORS[log.level]} font-bold w-12`}>{log.level}</span>
                        <span className="flex-1 whitespace-pre-wrap">{`${log.method || ''} ${log.path || ''} ${log.statusCode || ''} - ${log.message}`}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export interface ApiKeyManagerProps {
    addNotification: (message: string, type: 'success' | 'error') => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ addNotification }) => {
    const [keys, setKeys] = React.useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
    const [keyToRevoke, setKeyToRevoke] = React.useState<ApiKey | null>(null);
    const [newKey, setNewKey] = React.useState<{ name: string; scopes: string }>({ name: '', scopes: 'read:*,write:*' });
    const [generatedSecret, setGeneratedSecret] = React.useState<string | null>(null);
    const [hasCopied, setHasCopied] = React.useState(false);

    React.useEffect(() => {
        apiService.getApiKeys().then(data => {
            setKeys(data);
            setIsLoading(false);
        });
    }, []);

    const handleCreateKey = () => {
        if (!newKey.name) {
            addNotification('Key name is required.', 'error');
            return;
        }
        const secret = `dbank_sk_live_${generateId()}${generateId()}`;
        setGeneratedSecret(secret);
        apiService.createApiKey(newKey.name, newKey.scopes.split(','), null).then(createdKey => {
            setKeys(prev => [createdKey, ...prev]);
        });
        addNotification('API Key created successfully!', 'success');
    };
    
    const handleRevokeKey = () => {
        if (!keyToRevoke) return;
        apiService.revokeApiKey(keyToRevoke.id).then(() => {
            setKeys(prev => prev.map(k => k.id === keyToRevoke.id ? {...k, isActive: false} : k));
            addNotification(`API Key "${keyToRevoke.name}" has been revoked.`, 'success');
            setKeyToRevoke(null);
        });
    };

    const copyToClipboard = () => {
        if (generatedSecret) {
            navigator.clipboard.writeText(generatedSecret);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        }
    };
    
    return (
        <Card title="API Key Management" rightHeaderContent={
            <button onClick={() => { setCreateModalOpen(true); setGeneratedSecret(null); setNewKey({ name: '', scopes: 'read:*,write:*' }); }} className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-sky-600 hover:bg-sky-500 transition-colors font-semibold">
                <IconPlusCircle className="w-4 h-4" />
                Create Key
            </button>
        }>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Key Prefix</th>
                            <th scope="col" className="px-6 py-3">Scopes</th>
                            <th scope="col" className="px-6 py-3">Last Used</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-800">
                                    <td className="px-6 py-4"><SkeletonLoader className="h-4 w-32" /></td>
                                    <td className="px-6 py-4"><SkeletonLoader className="h-4 w-24" /></td>
                                    <td className="px-6 py-4"><SkeletonLoader className="h-4 w-40" /></td>
                                    <td className="px-6 py-4"><SkeletonLoader className="h-4 w-28" /></td>
                                    <td className="px-6 py-4"><SkeletonLoader className="h-4 w-16" /></td>
                                    <td className="px-6 py-4"><SkeletonLoader className="h-4 w-20" /></td>
                                </tr>
                            ))
                        ) : (
                            keys.map(key => (
                                <tr key={key.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{key.name}</td>
                                    <td className="px-6 py-4 font-mono text-cyan-300">{key.keyPrefix}...</td>
                                    <td className="px-6 py-4 font-mono text-xs">{key.scopes.join(', ')}</td>
                                    <td className="px-6 py-4">{key.lastUsed ? key.lastUsed.toLocaleString() : 'Never'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${key.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{key.isActive ? 'Active' : 'Revoked'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {key.isActive && (
                                            <button onClick={() => setKeyToRevoke(key)} className="text-red-400 hover:text-red-300">
                                                <IconTrash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Key Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New API Key">
                {!generatedSecret ? (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="keyName" className="block text-sm font-medium text-gray-300 mb-1">Key Name</label>
                            <input type="text" id="keyName" value={newKey.name} onChange={e => setNewKey({...newKey, name: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                        <div>
                            <label htmlFor="keyScopes" className="block text-sm font-medium text-gray-300 mb-1">Scopes (comma-separated)</label>
                            <input type="text" id="keyScopes" value={newKey.scopes} onChange={e => setNewKey({...newKey, scopes: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white font-mono focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600">Cancel</button>
                            <button onClick={handleCreateKey} className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 font-semibold">Create Key</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-3 rounded-md text-sm flex items-start gap-2">
                            <IconAlertTriangle className="w-8 h-8 flex-shrink-0"/>
                            <span>Make sure to copy your new secret key now. You won’t be able to see it again!</span>
                        </div>
                        <div className="relative bg-gray-800 border border-gray-600 rounded-md p-3 font-mono text-green-300">
                            {generatedSecret}
                            <button onClick={copyToClipboard} className="absolute top-2 right-2 text-gray-400 hover:text-white">
                                {hasCopied ? <IconCheck className="w-5 h-5 text-green-400" /> : <IconCopy className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 font-semibold">Done</button>
                        </div>
                    </div>
                )}
            </Modal>
            
            {/* Revoke Key Modal */}
            <Modal isOpen={!!keyToRevoke} onClose={() => setKeyToRevoke(null)} title="Revoke API Key">
                <p>Are you sure you want to revoke the key "{keyToRevoke?.name}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-4 pt-6">
                    <button onClick={() => setKeyToRevoke(null)} className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600">Cancel</button>
                    <button onClick={handleRevokeKey} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 font-semibold">Revoke Key</button>
                </div>
            </Modal>
        </Card>
    );
};


export interface SecurityDashboardProps {}
export const SecurityDashboard: React.FC<SecurityDashboardProps> = () => {
    const [events, setEvents] = React.useState<SecurityEvent[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        apiService.getSecurityEvents().then(data => {
            setEvents(data);
            setIsLoading(false);
        });
    }, []);

    const eventTypeStyles = {
        'SQLi Attempt': 'bg-red-500/20 text-red-300',
        'XSS Attempt': 'bg-orange-500/20 text-orange-300',
        'Anomalous Traffic': 'bg-yellow-500/20 text-yellow-300',
        'Credential Stuffing': 'bg-purple-500/20 text-purple-300',
        'Auth Failure': 'bg-pink-500/20 text-pink-300'
    };
    
    return (
        <Card title="WAF & Security Events">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                            <th scope="col" className="px-6 py-3">Event Type</th>
                            <th scope="col" className="px-6 py-3">Source IP</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3">Path</th>
                            <th scope="col" className="px-6 py-3">Details</th>
                            <th scope="col" className="px-6 py-3">Action Taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({length: 4}).map((_, i) => (
                                <tr key={i}><td colSpan={7} className="p-2"><SkeletonLoader className="h-8 w-full"/></td></tr>
                            ))
                        ) : (
                            events.map(event => (
                                <tr key={event.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4">{event.timestamp.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${eventTypeStyles[event.type]}`}>{event.type}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{event.sourceIp}</td>
                                    <td className="px-6 py-4">{event.geo.city}, {event.geo.countryCode}</td>
                                    <td className="px-6 py-4 font-mono text-white">{event.path}</td>
                                    <td className="px-6 py-4">{event.details}</td>
                                    <td className="px-6 py-4">
                                        <span className={event.actionTaken === 'Blocked' ? 'text-red-400' : 'text-yellow-400'}>{event.actionTaken}</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export const DashboardContent: React.FC = () => {
    const [timeRange, setTimeRange] = React.useState<TimeRange>('24h');
    const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);
    const [trafficData, setTrafficData] = React.useState<TrafficPoint[]>([]);
    const [latencyData, setLatencyData] = React.useState<LatencyPoint[]>([]);
    const [endpoints, setEndpoints] = React.useState<Endpoint[]>([]);
    const [loading, setLoading] = React.useState({ metrics: true, traffic: true, latency: true, endpoints: true });

    React.useEffect(() => {
        setLoading(prev => ({ ...prev, metrics: true, traffic: true, latency: true }));
        apiService.getDashboardMetrics(timeRange).then(data => { setMetrics(data); setLoading(prev => ({...prev, metrics: false})); });
        apiService.getTrafficData(timeRange).then(data => { setTrafficData(data); setLoading(prev => ({...prev, traffic: false})); });
        apiService.getLatencyData(timeRange).then(data => { setLatencyData(data); setLoading(prev => ({...prev, latency: false})); });
    }, [timeRange]);

    React.useEffect(() => {
        setLoading(prev => ({ ...prev, endpoints: true }));
        apiService.getEndpoints().then(data => { setEndpoints(data); setLoading(prev => ({...prev, endpoints: false})); });
    }, []);

    const timeRangeSelector = (
        <div className="relative">
            <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="bg-gray-800 border border-gray-600 rounded-md py-2 pl-3 pr-8 text-white focus:ring-sky-500 focus:border-sky-500 appearance-none"
            >
                {TIME_RANGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <IconChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Gateway Overview</h2>
                {timeRangeSelector}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title={`Requests (${timeRange})`} value={metrics ? formatNumber(metrics.totalRequests) : '...'} isLoading={loading.metrics} />
                <MetricCard title={`Error Rate (${timeRange})`} value={metrics ? `${metrics.errorRate.toFixed(2)}%` : '...'} isLoading={loading.metrics} />
                <MetricCard title="Avg. Latency" value={metrics ? `${metrics.avgLatency}ms` : '...'} isLoading={loading.metrics} />
                <MetricCard title="Uptime" value={metrics ? `${metrics.uptime.toFixed(2)}%` : '...'} isLoading={loading.metrics} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title={`API Traffic (${TIME_RANGE_OPTIONS.find(o => o.value === timeRange)?.label})`}>
                    {loading.traffic ? <div className="h-[300px] flex items-center justify-center"><Spinner/></div> : (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={trafficData}>
                                <defs><linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient></defs>
                                <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
                                <YAxis stroke="#9ca3af" tickFormatter={formatNumber} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                                <Area type="monotone" dataKey="requests" stroke="#0ea5e9" fill="url(#colorRequests)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </Card>
                <Card title={`P95/P99 Latency (ms)`}>
                    {loading.latency ? <div className="h-[300px] flex items-center justify-center"><Spinner/></div> : (
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={latencyData}>
                                <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                                <Legend/>
                                <Line type="monotone" dataKey="p95" stroke="#8884d8" name="P95 Latency" />
                                <Line type="monotone" dataKey="p99" stroke="#f43f5e" name="P99 Latency" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </Card>
            </div>

            <Card title="API Endpoints Health">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Method</th>
                                <th scope="col" className="px-6 py-3">Path</th>
                                <th scope="col" className="px-6 py-3">Avg. Latency</th>
                                <th scope="col" className="px-6 py-3">Error Rate</th>
                                <th scope="col" className="px-6 py-3">Requests (24h)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading.endpoints ? (
                                Array.from({length: 5}).map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="p-2"><SkeletonLoader className="h-8 w-full"/></td></tr>
                                ))
                            ) : (
                                endpoints.map(ep => (
                                    <tr key={ep.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${STATUS_INDICATORS[ep.status]}`}></div>
                                                <span className={`${ep.status === 'Healthy' ? 'text-green-400' : ep.status === 'Degraded' ? 'text-yellow-400' : 'text-red-400'}`}>{ep.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className={`px-2 py-0.5 text-xs rounded-full ${ep.method === 'GET' ? 'bg-cyan-500/20 text-cyan-300' : ep.method === 'POST' ? 'bg-green-500/20 text-green-300' : 'bg-purple-500/20 text-purple-300'}`}>{ep.method}</span></td>
                                        <td className="px-6 py-4 font-mono text-white">{ep.path}</td>
                                        <td className="px-6 py-4">{ep.avgLatency}ms</td>
                                        <td className="px-6 py-4">{ep.errorRate}%</td>
                                        <td className="px-6 py-4">{formatNumber(ep.requests)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export const AICopilotView: React.FC = () => {
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [isLoadingInsights, setIsLoadingInsights] = useState(true);
    const [nlQuery, setNlQuery] = useState("");
    const [nlResponse, setNlResponse] = useState("");
    const [isNlLoading, setIsNlLoading] = useState(false);

    useEffect(() => {
        apiService.getAIInsights().then(data => {
            setInsights(data);
            setIsLoadingInsights(false);
        });
    }, []);

    const handleNlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nlQuery.trim()) return;
        setIsNlLoading(true);
        setNlResponse("");
        apiService.getNaturalLanguageResponse(nlQuery).then(response => {
            setNlResponse(response);
            setIsNlLoading(false);
        });
    };

    const insightSeverityStyles = {
        'High': 'border-red-500/50 bg-red-500/10',
        'Medium': 'border-yellow-500/50 bg-yellow-500/10',
        'Low': 'border-sky-500/50 bg-sky-500/10',
    };
    const insightIconStyles = {
        'PERFORMANCE': <IconTrendingUp className="w-6 h-6 text-purple-400" />,
        'COST': <IconInfo className="w-6 h-6 text-green-400" />,
        'SECURITY': <IconShieldCheck className="w-6 h-6 text-red-400" />,
        'RELIABILITY': <IconAlertTriangle className="w-6 h-6 text-yellow-400" />,
    }

    return (
        <div className="space-y-8">
             <Card title="AI Natural Language Query" icon={<IconBot className="w-5 h-5 text-gray-300"/>}>
                <p className="text-sm text-gray-400 mb-4">Ask questions about your API Gateway performance in plain English.</p>
                <form onSubmit={handleNlSubmit} className="flex gap-2">
                    <input 
                        type="text"
                        value={nlQuery}
                        onChange={(e) => setNlQuery(e.target.value)}
                        placeholder="e.g., 'What was the p99 latency for /v1/transactions yesterday?'"
                        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500"
                        disabled={isNlLoading}
                    />
                    <button type="submit" className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 font-semibold" disabled={isNlLoading}>
                        {isNlLoading ? 'Asking...' : 'Ask'}
                    </button>
                </form>
                {isNlLoading && <div className="mt-4"><Spinner /></div>}
                {nlResponse && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-md border border-gray-700 flex items-start gap-3">
                        <IconBot className="w-8 h-8 flex-shrink-0 text-sky-400 mt-1" />
                        <p className="text-gray-300">{nlResponse}</p>
                    </div>
                )}
            </Card>

            <Card title="AI-Generated Insights" icon={<IconBot className="w-5 h-5 text-gray-300"/>}>
                {isLoadingInsights ? (
                    <Spinner />
                ) : (
                    <div className="space-y-4">
                        {insights.map(insight => (
                            <div key={insight.id} className={`border rounded-lg p-4 ${insightSeverityStyles[insight.severity]}`}>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">{insightIconStyles[insight.category]}</div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-white">{insight.title}</h4>
                                            <span className="text-xs text-gray-400">{new Date(insight.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-1">{insight.description}</p>
                                        <p className="text-sm text-sky-300 mt-2 bg-sky-500/10 p-2 rounded-md">
                                            <strong>Recommendation:</strong> {insight.recommendation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}


// SECTION: MAIN VIEW COMPONENT

const DemoBankAPIGatewayView: React.FC = () => {
    const TABS = [
        { id: 'dashboard', label: 'Dashboard', icon: <IconTrendingUp className="w-4 h-4" /> },
        { id: 'logs', label: 'Live Logs', icon: <IconFileText className="w-4 h-4" /> },
        { id: 'api_keys', label: 'API Keys', icon: <IconInfo className="w-4 h-4" /> },
        { id: 'security', label: 'Security', icon: <IconShieldCheck className="w-4 h-4" /> },
        { id: 'ai_copilot', label: 'AI Co-Pilot', icon: <IconBot className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings', icon: <IconSettings className="w-4 h-4" /> },
    ];
    const [activeTab, setActiveTab] = React.useState('dashboard');
    const [notifications, setNotifications] = React.useState<Notification[]>([]);

    const addNotification = React.useCallback((message: string, type: 'success' | 'error') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard':
                return <DashboardContent />;
            case 'logs':
                return <LiveLogViewer />;
            case 'api_keys':
                return <ApiKeyManager addNotification={addNotification} />;
            case 'security':
                return <SecurityDashboard />;
            case 'ai_copilot':
                return <AICopilotView />;
            case 'settings':
                return <Card title="Settings"><p className="text-gray-400">Integration and alert settings will be configured here.</p></Card>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6 bg-gray-900 text-white min-h-screen">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">API Gateway</h1>
                    <p className="text-sm text-gray-400">Monitor, secure, and analyze your API traffic with AI-powered insights.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
                        <IconFileText className="w-4 h-4" />
                        View Docs
                    </button>
                     <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
                        <IconRefreshCw className="w-4 h-4" />
                        Refresh Data
                    </button>
                </div>
            </div>

            <Tabs tabs={TABS} activeTab={activeTab} onTabClick={setActiveTab} />
            <div className="mt-6">
                {renderContent()}
            </div>
            {/* Notification Area */}
            <div className="fixed bottom-5 right-5 z-50 space-y-3">
                {notifications.map(n => (
                    <div key={n.id} className={`flex items-center gap-4 p-4 rounded-lg shadow-lg text-white ${n.type === 'success' ? 'bg-green-600/90' : 'bg-red-600/90'} animate-fade-in-up`}>
                        {n.type === 'success' ? <IconShieldCheck /> : <IconAlertTriangle />}
                        <span>{n.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DemoBankAPIGatewayView;