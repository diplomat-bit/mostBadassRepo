// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankDevOpsView.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from '../../Card';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, AreaChart, Area,
    PieChart, Pie, Cell
} from 'recharts';

// --- Original Data (for Overview tab) ---
const buildDurationData = [
    { name: 'Build #501', duration: 5.2, success: true }, { name: 'Build #502', duration: 5.5, success: true },
    { name: 'Build #503', duration: 4.8, success: true }, { name: 'Build #504', duration: 6.1, success: false },
    { name: 'Build #505', duration: 5.4, success: true }, { name: 'Build #506', duration: 5.8, success: true },
    { name: 'Build #507', duration: 5.1, success: true }, { name: 'Build #508', duration: 6.3, success: false },
    { name: 'Build #509', duration: 5.0, success: true }, { name: 'Build #510', duration: 5.7, success: true },
    { name: 'Build #511', duration: 4.9, success: true }, { name: 'Build #512', duration: 6.0, success: true },
    { name: 'Build #513', duration: 5.6, success: true }, { name: 'Build #514', duration: 6.5, success: false },
    { name: 'Build #515', duration: 5.3, success: true }, { name: 'Build #516', duration: 5.9, success: true },
    { name: 'Build #517', duration: 4.7, success: true }, { name: 'Build #518', duration: 6.2, success: false },
    { name: 'Build #519', duration: 5.0, success: true }, { name: 'Build #520', duration: 5.5, success: true },
    { name: 'Build #521', duration: 5.2, success: true }, { name: 'Build #522', duration: 5.5, success: true },
    { name: 'Build #523', duration: 4.8, success: true }, { name: 'Build #524', duration: 6.1, success: false },
    { name: 'Build #525', duration: 5.4, success: true }, { name: 'Build #526', duration: 5.8, success: true },
    { name: 'Build #527', duration: 5.1, success: true }, { name: 'Build #528', duration: 6.3, success: false },
    { name: 'Build #529', duration: 5.0, success: true }, { name: 'Build #530', duration: 5.7, success: true },
    { name: 'Build #531', duration: 4.9, success: true }, { name: 'Build #532', duration: 6.0, success: true },
    { name: 'Build #533', duration: 5.6, success: true }, { name: 'Build #534', duration: 6.5, success: false },
    { name: 'Build #535', duration: 5.3, success: true }, { name: 'Build #536', duration: 5.9, success: true },
    { name: 'Build #537', duration: 4.7, success: true }, { name: 'Build #538', duration: 6.2, success: false },
    { name: 'Build #539', duration: 5.0, success: true }, { name: 'Build #540', duration: 5.5, success: true },
    { name: 'Build #541', duration: 5.2, success: true }, { name: 'Build #542', duration: 5.5, success: true },
    { name: 'Build #543', duration: 4.8, success: true }, { name: 'Build #544', duration: 6.1, success: false },
    { name: 'Build #545', duration: 5.4, success: true }, { name: 'Build #546', duration: 5.8, success: true },
    { name: 'Build #547', duration: 5.1, success: true }, { name: 'Build #548', duration: 6.3, success: false },
    { name: 'Build #549', duration: 5.0, success: true }, { name: 'Build #550', duration: 5.7, success: true },
    { name: 'Build #551', duration: 4.9, success: true }, { name: 'Build #552', duration: 6.0, success: true },
    { name: 'Build #553', duration: 5.6, success: true }, { name: 'Build #554', duration: 6.5, success: false },
    { name: 'Build #555', duration: 5.3, success: true }, { name: 'Build #556', duration: 5.9, success: true },
    { name: 'Build #557', duration: 4.7, success: true }, { name: 'Build #558', duration: 6.2, success: false },
    { name: 'Build #559', duration: 5.0, success: true }, { name: 'Build #560', duration: 5.5, success: true },
    { name: 'Build #561', duration: 5.2, success: true }, { name: 'Build #562', duration: 5.5, success: true },
    { name: 'Build #563', duration: 4.8, success: true }, { name: 'Build #564', duration: 6.1, success: false },
    { name: 'Build #565', duration: 5.4, success: true }, { name: 'Build #566', duration: 5.8, success: true },
    { name: 'Build #567', duration: 5.1, success: true }, { name: 'Build #568', duration: 6.3, success: false },
    { name: 'Build #569', duration: 5.0, success: true }, { name: 'Build #570', duration: 5.7, success: true },
    { name: 'Build #571', duration: 4.9, success: true }, { name: 'Build #572', duration: 6.0, success: true },
    { name: 'Build #573', duration: 5.6, success: true }, { name: 'Build #574', duration: 6.5, success: false },
    { name: 'Build #575', duration: 5.3, success: true }, { name: 'Build #576', duration: 5.9, success: true },
    { name: 'Build #577', duration: 4.7, success: true }, { name: 'Build #578', duration: 6.2, success: false },
    { name: 'Build #579', duration: 5.0, success: true }, { name: 'Build #580', duration: 5.5, success: true },
    { name: 'Build #581', duration: 5.2, success: true }, { name: 'Build #582', duration: 5.5, success: true },
    { name: 'Build #583', duration: 4.8, success: true }, { name: 'Build #584', duration: 6.1, success: false },
    { name: 'Build #585', duration: 5.4, success: true }, { name: 'Build #586', duration: 5.8, success: true },
    { name: 'Build #587', duration: 5.1, success: true }, { name: 'Build #588', duration: 6.3, success: false },
    { name: 'Build #589', duration: 5.0, success: true }, { name: 'Build #590', duration: 5.7, success: true },
    { name: 'Build #591', duration: 4.9, success: true }, { name: 'Build #592', duration: 6.0, success: true },
    { name: 'Build #593', duration: 5.6, success: true }, { name: 'Build #594', duration: 6.5, success: false },
    { name: 'Build #595', duration: 5.3, success: true }, { name: 'Build #596', duration: 5.9, success: true },
    { name: 'Build #597', duration: 4.7, success: true }, { name: 'Build #598', duration: 6.2, success: false },
    { name: 'Build #599', duration: 5.0, success: true }, { name: 'Build #600', duration: 5.5, success: true },
];

const deploymentFrequencyData = [
    { name: 'Jan', deployments: 22 }, { name: 'Feb', deployments: 25 }, { name: 'Mar', deployments: 30 },
    { name: 'Apr', deployments: 28 }, { name: 'May', deployments: 35 }, { name: 'Jun', deployments: 42 },
    { name: 'Jul', deployments: 38 }, { name: 'Aug', deployments: 45 }, { name: 'Sep', deployments: 40 },
    { name: 'Oct', deployments: 50 }, { name: 'Nov', deployments: 48 }, { name: 'Dec', deployments: 55 },
];

const recentDeployments = [
    { id: 1, service: 'API Gateway', version: 'v1.25.3', status: 'Success', date: '2h ago', environment: 'Production', author: 'alice.d' },
    { id: 2, service: 'Frontend App', version: 'v2.10.1', status: 'Success', date: '8h ago', environment: 'Production', author: 'bob.s' },
    { id: 3, service: 'Transactions API', version: 'v1.15.0', status: 'Failed', date: '1d ago', environment: 'Production', author: 'charlie.m' },
    { id: 4, service: 'AI Advisor API', version: 'v1.8.2', status: 'Success', date: '2d ago', environment: 'Production', author: 'diana.p' },
    { id: 5, service: 'User Service', version: 'v3.0.5', status: 'Success', date: '3d ago', environment: 'Production', author: 'eve.w' },
    { id: 6, service: 'Reporting Service', version: 'v0.9.1', status: 'Pending', date: '4d ago', environment: 'Staging', author: 'frank.z' },
];

// --- New Icons ---
export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
export const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
export const ExclamationCircleIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
export const CogIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
export const BugAntIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L9 8.586l4.293-4.293a1 1 0 011.414 0zm-11.414 2.828a1 1 0 011.414 0L5 8.586l-1.293-1.293a1 1 0 010-1.414zM10 2a8 8 0 100 16 8 8 0 000-16zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
export const CloudIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
export const SecurityShieldIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.276A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.78 12.02 12.02 0 00-3.047 9.141 12.02 12.02 0 0013.972 6.096c4.015-.493 5.792-3.003 5.792-3.003s2.964-1.547 3.992-4.502l.648-1.944z" /></svg>;
export const ServerStackIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
export const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
export const RocketLaunchIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25l-2.25 2.25M12 2.25l2.25 2.25M12 2.25V4.5m-2.25 2.25L9 9m2.25-2.25L12 9m-2.25-2.25H9m5.25 2.25L15 9m-2.25-2.25L12 9m2.25-2.25H15m0 0l-2.25-2.25M12 21.75V19.5m0-2.25V15m0-2.25V12.75m0-2.25V10.5M4.5 9.75H2.25M2.25 9.75L4.5 7.5M4.5 9.75V12.75M19.5 9.75H21.75M21.75 9.75L19.5 7.5M19.5 9.75V12.75M9.75 4.5V2.25M9.75 4.5H7.5M9.75 4.5L12 2.25M14.25 4.5V2.25M14.25 4.5H16.5M14.25 4.5L12 2.25" /></svg>;
export const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2h-2v4L15 9.5 13 5H9L7 9.5 5 9V5H3a2 2 0 00-2 2v11a2 2 0 002 2h2v-4h4v4h2v-4h4v4z" /></svg>;
export const FolderOpenIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
export const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

// --- Data Interfaces ---
export interface Incident {
    id: string;
    title: string;
    service: string;
    status: 'Open' | 'Resolved' | 'Investigating' | 'Closed';
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    reportedAt: string;
    resolvedAt?: string;
    mttr?: number; // Mean Time To Resolution in minutes
    description: string;
    assignedTo: string;
    affectedUsers: number;
}

export interface MetricDataPoint {
    time: string; // e.g., '10:00', 'Jul 1'
    value: number;
}

export interface ServiceHealth {
    service: string;
    status: 'Operational' | 'Degraded' | 'Outage' | 'Maintenance';
    latency: number; // ms
    errorRate: number; // %
    throughput: number; // requests/sec
    lastUpdated: string;
}

export interface Vulnerability {
    id: string;
    service: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    type: string;
    description: string;
    status: 'Open' | 'Fixed' | 'False Positive' | 'Ignored';
    reportedAt: string;
    fixedAt?: string;
}

export interface CloudCost {
    month: string;
    totalCost: number;
    compute: number;
    storage: number;
    network: number;
    database: number;
    other: number;
}

export interface EnvironmentStatus {
    id: string;
    name: string;
    status: 'Healthy' | 'Degraded' | 'Offline';
    deployedServices: { name: string; version: string; }[];
    lastSync: string;
}

export interface FeatureFlag {
    id: string;
    name: string;
    service: string;
    environment: string;
    enabled: boolean;
    rolloutPercentage: number;
    description: string;
    lastUpdated: string;
    updatedBy: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    resourceType: string;
    resourceId: string;
    details: string;
    ipAddress: string;
}

export interface PullRequestMetric {
    date: string;
    open: number;
    merged: number;
    cycleTime: number; // in hours
}

export interface CodeQualityMetric {
    service: string;
    linesOfCode: number;
    bugsFound: number;
    vulnerabilitiesFound: number;
    coverage: number; // percentage
    technicalDebtHours: number;
}

// --- Mock Data Generation Functions ---
const services = ['API Gateway', 'Frontend App', 'Transactions API', 'AI Advisor API', 'User Service', 'Payment Gateway', 'Reporting Service', 'Auth Service', 'Fraud Detection', 'Notifications', 'Investment API', 'Loan Service', 'Card Service', 'ATM API', 'Merchant API', 'Compliance API', 'Onboarding Service', 'Risk Engine', 'FX Service', 'Settlement Service'];
const users = ['alice.d', 'bob.s', 'charlie.m', 'diana.p', 'eve.w', 'frank.z', 'grace.l', 'harry.k', 'isabel.t', 'john.j', 'karen.b', 'liam.g', 'mia.r', 'noah.s', 'olivia.m', 'peter.w', 'quinn.a'];
const environments = ['Development', 'Staging', 'Production', 'UAT'];
const severities = ['Critical', 'High', 'Medium', 'Low'];
const statusOptions = ['Open', 'Resolved', 'Investigating', 'Closed'];

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number, decimals: number) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateIncidents = (count: number): Incident[] => {
    const incidents: Incident[] = [];
    for (let i = 0; i < count; i++) {
        const reportedDate = getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()); // Last 30 days
        const status = getRandomElement(statusOptions);
        const resolvedDate = status === 'Resolved' || status === 'Closed' ? getRandomDate(reportedDate, new Date()) : undefined;
        const mttr = resolvedDate ? Math.round((resolvedDate.getTime() - reportedDate.getTime()) / (1000 * 60)) : undefined; // minutes

        incidents.push({
            id: `INC-${1000 + i}`,
            title: `Service ${getRandomElement(services)} experiencing ${getRandomElement(['latency spikes', 'error rate increase', 'connection issues', 'data inconsistency'])}`,
            service: getRandomElement(services),
            status: status as any,
            severity: getRandomElement(severities) as any,
            reportedAt: reportedDate.toLocaleString(),
            resolvedAt: resolvedDate?.toLocaleString(),
            mttr,
            description: `Detailed investigation for incident INC-${1000 + i}. Root cause analysis initiated.`,
            assignedTo: getRandomElement(users),
            affectedUsers: getRandomInt(100, 50000),
        });
    }
    return incidents;
};

const generateMetricData = (serviceName: string, startDate: Date, endDate: Date, type: 'latency' | 'errors' | 'throughput'): MetricDataPoint[] => {
    const data: MetricDataPoint[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        let value: number;
        switch (type) {
            case 'latency': value = getRandomFloat(20, 200, 2); break;
            case 'errors': value = getRandomFloat(0.1, 5, 2); break;
            case 'throughput': value = getRandomInt(1000, 10000); break;
        }
        data.push({
            time: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value
        });
        currentDate.setMinutes(currentDate.getMinutes() + 5);
    }
    return data;
};

const generateServiceHealth = (count: number): ServiceHealth[] => {
    const health: ServiceHealth[] = [];
    for (let i = 0; i < count; i++) {
        health.push({
            service: services[i % services.length],
            status: getRandomElement(['Operational', 'Degraded', 'Outage']) as any,
            latency: getRandomFloat(50, 500, 2),
            errorRate: getRandomFloat(0.01, 10, 2),
            throughput: getRandomInt(500, 15000),
            lastUpdated: getRandomDate(new Date(Date.now() - 60 * 60 * 1000), new Date()).toLocaleTimeString(),
        });
    }
    return health;
};

const vulnerabilityTypes = ['SQL Injection', 'XSS', 'Broken Authentication', 'Insecure Deserialization', 'Missing Security Headers', 'Sensitive Data Exposure'];
const vulnerabilityStatus = ['Open', 'Fixed', 'False Positive', 'Ignored'];

const generateVulnerabilities = (count: number): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];
    for (let i = 0; i < count; i++) {
        const reportedDate = getRandomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date());
        const status = getRandomElement(vulnerabilityStatus);
        const fixedAt = status === 'Fixed' ? getRandomDate(reportedDate, new Date()) : undefined;

        vulnerabilities.push({
            id: `VULN-${2000 + i}`,
            service: getRandomElement(services),
            severity: getRandomElement(severities) as any,
            type: getRandomElement(vulnerabilityTypes),
            description: `Found a ${getRandomElement(vulnerabilityTypes)} vulnerability in ${getRandomElement(services)}.`,
            status: status as any,
            reportedAt: reportedDate.toLocaleString(),
            fixedAt: fixedAt?.toLocaleString(),
        });
    }
    return vulnerabilities;
};

const generateCloudCosts = (months: number): CloudCost[] => {
    const costs: CloudCost[] = [];
    const baseCost = 10000;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < months; i++) {
        const totalCost = baseCost + getRandomInt(-1000, 5000);
        const compute = getRandomFloat(0.4 * totalCost, 0.6 * totalCost, 2);
        const storage = getRandomFloat(0.1 * totalCost, 0.2 * totalCost, 2);
        const network = getRandomFloat(0.05 * totalCost, 0.15 * totalCost, 2);
        const database = getRandomFloat(0.1 * totalCost, 0.25 * totalCost, 2);
        const other = parseFloat((totalCost - compute - storage - network - database).toFixed(2));

        costs.push({
            month: monthNames[i % 12],
            totalCost: parseFloat(totalCost.toFixed(2)),
            compute,
            storage,
            network,
            database,
            other: other > 0 ? other : 0,
        });
    }
    return costs;
};

const generateEnvironmentStatus = (count: number): EnvironmentStatus[] => {
    const envs: EnvironmentStatus[] = [];
    for (let i = 0; i < count; i++) {
        const deployedServices = Array.from({ length: getRandomInt(3, 10) }).map(() => ({
            name: getRandomElement(services),
            version: `v${getRandomInt(1, 5)}.${getRandomInt(0, 10)}.${getRandomInt(0, 50)}`,
        }));
        envs.push({
            id: `ENV-${300 + i}`,
            name: environments[i % environments.length] + (i >= environments.length ? `-${Math.floor(i / environments.length) + 1}` : ''),
            status: getRandomElement(['Healthy', 'Degraded', 'Offline']) as any,
            deployedServices: [...new Set(deployedServices.map(s => s.name))].map(name => deployedServices.find(s => s.name === name)!), // unique services
            lastSync: getRandomDate(new Date(Date.now() - 12 * 60 * 60 * 1000), new Date()).toLocaleString(),
        });
    }
    return envs;
};

const generateFeatureFlags = (count: number): FeatureFlag[] => {
    const flags: FeatureFlag[] = [];
    for (let i = 0; i < count; i++) {
        flags.push({
            id: `FF-${400 + i}`,
            name: `feature-x-${i}`,
            service: getRandomElement(services),
            environment: getRandomElement(environments),
            enabled: Math.random() > 0.3,
            rolloutPercentage: getRandomElement([0, 10, 25, 50, 75, 100]),
            description: `Enables or disables feature X for testing.`,
            lastUpdated: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()).toLocaleString(),
            updatedBy: getRandomElement(users),
        });
    }
    return flags;
};

const generateAuditLogs = (count: number): AuditLogEntry[] => {
    const logs: AuditLogEntry[] = [];
    const actions = ['DEPLOY', 'UPDATE_CONFIG', 'CREATE_RESOURCE', 'DELETE_RESOURCE', 'ACCESS_DATA', 'MODIFY_DATA', 'LOGIN', 'LOGOUT', 'FEATURE_TOGGLE'];
    const resourceTypes = ['Service', 'Environment', 'Database', 'User', 'Feature Flag', 'Incident'];

    for (let i = 0; i < count; i++) {
        const action = getRandomElement(actions);
        const resourceType = getRandomElement(resourceTypes);
        const resourceId = `${resourceType.substring(0, 3).toUpperCase()}-${getRandomInt(100, 999)}`;
        logs.push({
            id: `AUDIT-${5000 + i}`,
            timestamp: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()).toLocaleString(),
            user: getRandomElement(users),
            action: action,
            resourceType: resourceType,
            resourceId: resourceId,
            details: `${action} action performed on ${resourceType} ${resourceId}.`,
            ipAddress: `192.168.${getRandomInt(1, 255)}.${getRandomInt(1, 255)}`,
        });
    }
    return logs;
};

const generatePullRequestMetrics = (days: number): PullRequestMetric[] => {
    const metrics: PullRequestMetric[] = [];
    let currentDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    for (let i = 0; i < days; i++) {
        const open = getRandomInt(5, 20);
        const merged = getRandomInt(10, 30);
        const cycleTime = getRandomFloat(1.5, 24, 2); // hours
        metrics.push({
            date: currentDate.toISOString().split('T')[0],
            open,
            merged,
            cycleTime,
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return metrics;
};

const generateCodeQualityMetrics = (count: number): CodeQualityMetric[] => {
    const metrics: CodeQualityMetric[] = [];
    for (let i = 0; i < count; i++) {
        metrics.push({
            service: services[i % services.length],
            linesOfCode: getRandomInt(5000, 100000),
            bugsFound: getRandomInt(0, 20),
            vulnerabilitiesFound: getRandomInt(0, 10),
            coverage: getRandomFloat(60, 95, 2),
            technicalDebtHours: getRandomInt(10, 200),
        });
    }
    return metrics;
};

// --- Generated Mock Data ---
export const mockIncidents = generateIncidents(50);
export const mockServiceHealths = generateServiceHealth(services.length);
export const mockVulnerabilities = generateVulnerabilities(100);
export const mockCloudCosts = generateCloudCosts(12); // 12 months
export const mockEnvironmentStatuses = generateEnvironmentStatus(environments.length + 2); // A few more than base environments
export const mockFeatureFlags = generateFeatureFlags(20);
export const mockAuditLogs = generateAuditLogs(500);
export const mockPullRequestMetrics = generatePullRequestMetrics(60); // Last 60 days
export const mockCodeQualityMetrics = generateCodeQualityMetrics(services.length);

export const mockLatencyData = generateMetricData('API Gateway', new Date(Date.now() - 24 * 60 * 60 * 1000), new Date(), 'latency');
export const mockErrorRateData = generateMetricData('Transactions API', new Date(Date.now() - 24 * 60 * 60 * 1000), new Date(), 'errors');
export const mockThroughputData = generateMetricData('Frontend App', new Date(Date.now() - 24 * 60 * 60 * 1000), new Date(), 'throughput');

// --- Helper Components & Functions ---

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Success':
        case 'Resolved':
        case 'Operational':
        case 'Fixed':
        case 'Healthy':
        case 'Open': // for feature flags, open means active
            return 'text-green-400';
        case 'Failed':
        case 'Outage':
        case 'Critical':
        case 'High':
        case 'Offline':
            return 'text-red-400';
        case 'Pending':
        case 'Investigating':
        case 'Degraded':
        case 'Medium':
        case 'Staging':
            return 'text-yellow-400';
        case 'Low':
        case 'Closed':
        case 'Maintenance':
        case 'Development':
        case 'UAT':
            return 'text-blue-400';
        default:
            return 'text-gray-400';
    }
};

export const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Success':
        case 'Resolved':
        case 'Operational':
        case 'Fixed':
        case 'Healthy':
        case 'Open':
            return <CheckCircleIcon className="text-green-400" />;
        case 'Failed':
        case 'Outage':
        case 'Critical':
        case 'High':
        case 'Offline':
            return <XCircleIcon className="text-red-400" />;
        case 'Pending':
        case 'Investigating':
        case 'Degraded':
        case 'Medium':
            return <ExclamationCircleIcon className="text-yellow-400" />;
        case 'Low':
        case 'Closed':
        case 'Maintenance':
            return <InformationCircleIcon className="text-blue-400" />;
        default:
            return null;
    }
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'Success' || status === 'Resolved' || status === 'Operational' || status === 'Fixed' || status === 'Healthy'
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            : status === 'Failed' || status === 'Outage' || status === 'Critical' || status === 'High' || status === 'Offline'
                ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                : status === 'Pending' || status === 'Investigating' || status === 'Degraded' || status === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    }`}>
        {status}
    </span>
);

export const MetricCard: React.FC<{ title: string; value: string | number; description: string; className?: string; icon?: React.ReactNode }> = ({ title, value, description, className, icon }) => (
    <Card className={`flex items-center p-4 ${className}`}>
        {icon && <div className="mr-4 text-gray-500">{icon}</div>}
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
    </Card>
);

export const DetailModal: React.FC<{ title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ title, isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">{title}</h3>
                                <div className="mt-2 text-gray-300">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex justify-center mt-6">
            <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-gray-800 border border-gray-700 rounded-l-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" /></svg>
                    </button>
                </li>
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button
                            onClick={() => onPageChange(number)}
                            className={`flex items-center justify-center px-4 h-10 leading-tight ${
                                currentPage === number
                                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                                    : 'text-gray-500 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-gray-800 border border-gray-700 rounded-r-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="sr-only">Next</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" /></svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

// --- Sub-Dashboards / Sections ---

export const IncidentManagementDashboard: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterService, setFilterService] = useState<string>('All');
    const [filterSeverity, setFilterSeverity] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [currentPage, setCurrentPage] = useState(1);
    const incidentsPerPage = 10;

    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIncidents(mockIncidents);
            setLoading(false);
        }, 500);
    }, []);

    const filteredIncidents = useMemo(() => {
        return incidents.filter(incident => {
            const matchesStatus = filterStatus === 'All' || incident.status === filterStatus;
            const matchesService = filterService === 'All' || incident.service === filterService;
            const matchesSeverity = filterSeverity === 'All' || incident.severity === filterSeverity;
            const matchesSearch = searchTerm === '' ||
                                  incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  incident.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesService && matchesSeverity && matchesSearch;
        });
    }, [incidents, filterStatus, filterService, filterSeverity, searchTerm]);

    const totalPages = Math.ceil(filteredIncidents.length / incidentsPerPage);
    const currentIncidents = useMemo(() => {
        const startIndex = (currentPage - 1) * incidentsPerPage;
        return filteredIncidents.slice(startIndex, startIndex + incidentsPerPage);
    }, [filteredIncidents, currentPage, incidentsPerPage]);

    const handleIncidentClick = (incident: Incident) => {
        setSelectedIncident(incident);
        setIsModalOpen(true);
    };

    const avgMttr = useMemo(() => {
        const resolved = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed');
        if (resolved.length === 0) return 'N/A';
        const totalMttr = resolved.reduce((sum, i) => sum + (i.mttr || 0), 0);
        return `${(totalMttr / resolved.length).toFixed(0)}m`;
    }, [incidents]);

    const incidentSeverityData = useMemo(() => {
        const counts = incidents.reduce((acc, incident) => {
            acc[incident.severity] = (acc[incident.severity] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [incidents]);

    const incidentTrendData = useMemo(() => {
        const trend: Record<string, { date: string; open: number; resolved: number }> = {};
        incidents.forEach(inc => {
            const date = inc.reportedAt.split(',')[0]; // Simple date extraction
            if (!trend[date]) {
                trend[date] = { date, open: 0, resolved: 0 };
            }
            trend[date].open += 1;
            if (inc.status === 'Resolved' || inc.status === 'Closed') {
                trend[date].resolved += 1;
            }
        });
        return Object.values(trend).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [incidents]);


    const uniqueServices = useMemo(() => ['All', ...new Set(incidents.map(i => i.service))], [incidents]);
    const uniqueSeverities = useMemo(() => ['All', ...new Set(incidents.map(i => i.severity))].sort((a, b) => {
        const order = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'All': 0 };
        return order[b as keyof typeof order] - order[a as keyof typeof order];
    }), [incidents]);
    const uniqueStatuses = useMemo(() => ['All', ...new Set(incidents.map(i => i.status))], [incidents]);

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-wider">Incident Management</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Incidents (30d)" value={incidents.length} description="All incidents reported" icon={<BugAntIcon className="h-7 w-7 text-red-500" />} />
                <MetricCard title="Open Incidents" value={incidents.filter(i => i.status === 'Open' || i.status === 'Investigating').length} description="Currently active investigations" icon={<ExclamationCircleIcon className="h-7 w-7 text-yellow-500" />} />
                <MetricCard title="Critical Incidents" value={incidents.filter(i => i.severity === 'Critical' && (i.status === 'Open' || i.status === 'Investigating')).length} description="Highest priority incidents" icon={<XCircleIcon className="h-7 w-7 text-red-500" />} />
                <MetricCard title="Avg. MTTR" value={avgMttr} description="Mean time to resolution" icon={<ClockIcon className="h-7 w-7 text-blue-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Incident Trend (Last 30 Days)">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={incidentTrendData}>
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Legend />
                            <Line type="monotone" dataKey="open" stroke="#ff7300" name="New Incidents" />
                            <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved Incidents" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Incidents by Severity">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={incidentSeverityData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {incidentSeverityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={
                                        entry.name === 'Critical' ? '#ef4444' :
                                        entry.name === 'High' ? '#f59e0b' :
                                        entry.name === 'Medium' ? '#fcd34d' :
                                        '#60a5fa'
                                    } />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <Card title="All Incidents">
                <div className="flex flex-wrap gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by title, ID, description..."
                        className="flex-grow p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    >
                        {uniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterService}
                        onChange={(e) => { setFilterService(e.target.value); setCurrentPage(1); }}
                    >
                        {uniqueServices.map(service => <option key={service} value={service}>{service}</option>)}
                    </select>
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterSeverity}
                        onChange={(e) => { setFilterSeverity(e.target.value); setCurrentPage(1); }}
                    >
                        {uniqueSeverities.map(severity => <option key={severity} value={severity}>{severity}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Service</th>
                                <th scope="col" className="px-6 py-3">Severity</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Reported At</th>
                                <th scope="col" className="px-6 py-3">Assigned To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">Loading incidents...</td></tr>
                            ) : currentIncidents.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">No incidents found matching criteria.</td></tr>
                            ) : (
                                currentIncidents.map(inc => (
                                    <tr key={inc.id} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer" onClick={() => handleIncidentClick(inc)}>
                                        <td className="px-6 py-4 font-mono">{inc.id}</td>
                                        <td className="px-6 py-4 font-medium text-white">{inc.title}</td>
                                        <td className="px-6 py-4">{inc.service}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={inc.severity} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={inc.status} />
                                        </td>
                                        <td className="px-6 py-4">{inc.reportedAt}</td>
                                        <td className="px-6 py-4">{inc.assignedTo}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredIncidents.length > 0 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
            </Card>

            <DetailModal title={`Incident Details: ${selectedIncident?.id}`} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedIncident && (
                    <div className="space-y-4">
                        <p><strong>Title:</strong> {selectedIncident.title}</p>
                        <p><strong>Service:</strong> {selectedIncident.service}</p>
                        <p><strong>Severity:</strong> <StatusBadge status={selectedIncident.severity} /></p>
                        <p><strong>Status:</strong> <StatusBadge status={selectedIncident.status} /></p>
                        <p><strong>Reported At:</strong> {selectedIncident.reportedAt}</p>
                        {selectedIncident.resolvedAt && <p><strong>Resolved At:</strong> {selectedIncident.resolvedAt}</p>}
                        {selectedIncident.mttr && <p><strong>MTTR:</strong> {selectedIncident.mttr} minutes</p>}
                        <p><strong>Description:</strong> {selectedIncident.description}</p>
                        <p><strong>Assigned To:</strong> {selectedIncident.assignedTo}</p>
                        <p><strong>Affected Users:</strong> {selectedIncident.affectedUsers.toLocaleString()}</p>
                    </div>
                )}
            </DetailModal>
        </div>
    );
};

export const MonitoringDashboard: React.FC = () => {
    const [serviceHealths, setServiceHealths] = useState<ServiceHealth[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setServiceHealths(mockServiceHealths);
            setLoading(false);
        }, 600);
    }, []);

    const operationalServices = serviceHealths.filter(s => s.status === 'Operational').length;
    const degradedServices = serviceHealths.filter(s => s.status === 'Degraded').length;
    const outageServices = serviceHealths.filter(s => s.status === 'Outage').length;

    const latencyChartData = useMemo(() => mockLatencyData, []);
    const errorRateChartData = useMemo(() => mockErrorRateData, []);
    const throughputChartData = useMemo(() => mockThroughputData, []);

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-wider">Monitoring & Observability</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MetricCard title="Operational Services" value={operationalServices} description="Currently fully functional" icon={<CheckCircleIcon className="h-7 w-7 text-green-500" />} />
                <MetricCard title="Degraded Services" value={degradedServices} description="Experiencing minor issues" icon={<ExclamationCircleIcon className="h-7 w-7 text-yellow-500" />} />
                <MetricCard title="Services in Outage" value={outageServices} description="Major service interruptions" icon={<XCircleIcon className="h-7 w-7 text-red-500" />} />
                <MetricCard title="Total Services Monitored" value={serviceHealths.length} description="All active application services" icon={<ServerStackIcon className="h-7 w-7 text-blue-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="API Gateway Latency (Past 24h)">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={latencyChartData}>
                            <XAxis dataKey="time" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Latency" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Transactions API Error Rate (Past 24h)">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={errorRateChartData}>
                            <XAxis dataKey="time" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" label={{ value: 'Error Rate (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} domain={[0, 10]} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Error Rate" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Frontend App Throughput (Past 24h)">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={throughputChartData}>
                            <XAxis dataKey="time" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" label={{ value: 'Req/Sec', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Throughput" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Live Service Status Overview">
                    <div className="h-full flex flex-col justify-between">
                        <ul className="divide-y divide-gray-700 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            {loading ? (
                                <li className="py-2 text-center text-gray-500">Loading service health...</li>
                            ) : serviceHealths.length === 0 ? (
                                <li className="py-2 text-center text-gray-500">No service health data.</li>
                            ) : (
                                serviceHealths.map(sh => (
                                    <li key={sh.service} className="flex justify-between items-center py-2">
                                        <div className="flex items-center">
                                            <span className={`mr-2 ${getStatusColor(sh.status)}`}>{getStatusIcon(sh.status)}</span>
                                            <span className="font-medium text-white">{sh.service}</span>
                                        </div>
                                        <div className="text-right text-sm text-gray-400">
                                            <StatusBadge status={sh.status} />
                                            <span className="block text-xs mt-1">Lat: {sh.latency}ms, Err: {sh.errorRate}%</span>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                        <p className="text-xs text-gray-500 mt-4 text-right">Last updated: {new Date().toLocaleTimeString()}</p>
                    </div>
                </Card>
            </div>

            <Card title="All Service Health Checks">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Service</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Latency (ms)</th>
                                <th scope="col" className="px-6 py-3">Error Rate (%)</th>
                                <th scope="col" className="px-6 py-3">Throughput (Req/s)</th>
                                <th scope="col" className="px-6 py-3">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-4 text-center">Loading service healths...</td></tr>
                            ) : serviceHealths.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-4 text-center">No service health data found.</td></tr>
                            ) : (
                                serviceHealths.map(sh => (
                                    <tr key={sh.service} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{sh.service}</td>
                                        <td className="px-6 py-4"><StatusBadge status={sh.status} /></td>
                                        <td className="px-6 py-4">{sh.latency.toFixed(2)}</td>
                                        <td className="px-6 py-4">{sh.errorRate.toFixed(2)}</td>
                                        <td className="px-6 py-4">{sh.throughput.toLocaleString()}</td>
                                        <td className="px-6 py-4">{sh.lastUpdated}</td>
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

export const SecurityComplianceDashboard: React.FC = () => {
    const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterService, setFilterService] = useState<string>('All');
    const [filterSeverity, setFilterSeverity] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const vulnsPerPage = 10;

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setVulnerabilities(mockVulnerabilities);
            setLoading(false);
        }, 700);
    }, []);

    const filteredVulnerabilities = useMemo(() => {
        return vulnerabilities.filter(v => {
            const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
            const matchesService = filterService === 'All' || v.service === filterService;
            const matchesSeverity = filterSeverity === 'All' || v.severity === filterSeverity;
            const matchesSearch = searchTerm === '' ||
                                  v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  v.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesService && matchesSeverity && matchesSearch;
        });
    }, [vulnerabilities, filterStatus, filterService, filterSeverity, searchTerm]);

    const totalPages = Math.ceil(filteredVulnerabilities.length / vulnsPerPage);
    const currentVulnerabilities = useMemo(() => {
        const startIndex = (currentPage - 1) * vulnsPerPage;
        return filteredVulnerabilities.slice(startIndex, startIndex + vulnsPerPage);
    }, [filteredVulnerabilities, currentPage, vulnsPerPage]);

    const vulnerabilitiesBySeverity = useMemo(() => {
        const counts = filteredVulnerabilities.reduce((acc, v) => {
            acc[v.severity] = (acc[v.severity] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [filteredVulnerabilities]);

    const vulnerabilitiesByType = useMemo(() => {
        const counts = filteredVulnerabilities.reduce((acc, v) => {
            acc[v.type] = (acc[v.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [filteredVulnerabilities]);

    const uniqueVulnerabilityStatuses = useMemo(() => ['All', ...new Set(vulnerabilities.map(v => v.status))], [vulnerabilities]);
    const uniqueVulnerabilityServices = useMemo(() => ['All', ...new Set(vulnerabilities.map(v => v.service))], [vulnerabilities]);
    const uniqueVulnerabilitySeverities = useMemo(() => ['All', ...new Set(vulnerabilities.map(v => v.severity))].sort((a, b) => {
        const order = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'All': 0 };
        return order[b as keyof typeof order] - order[a as keyof typeof order];
    }), [vulnerabilities]);

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-wider">Security & Compliance</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Vulnerabilities" value={vulnerabilities.length} description="All identified security flaws" icon={<SecurityShieldIcon className="h-7 w-7 text-blue-500" />} />
                <MetricCard title="Open Vulnerabilities" value={vulnerabilities.filter(v => v.status === 'Open').length} description="Awaiting fix or review" icon={<ExclamationCircleIcon className="h-7 w-7 text-yellow-500" />} />
                <MetricCard title="Critical Vulns (Open)" value={vulnerabilities.filter(v => v.severity === 'Critical' && v.status === 'Open').length} description="Highest risk, immediate action" icon={<XCircleIcon className="h-7 w-7 text-red-500" />} />
                <MetricCard title="Avg. Time to Fix" value="5 days" description="Mean duration to resolve issues" icon={<ClockIcon className="h-7 w-7 text-purple-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Vulnerabilities by Severity">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={vulnerabilitiesBySeverity}>
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Bar dataKey="value" fill="#8884d8">
                                {vulnerabilitiesBySeverity.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={
                                        entry.name === 'Critical' ? '#ef4444' :
                                        entry.name === 'High' ? '#f59e0b' :
                                        entry.name === 'Medium' ? '#fcd34d' :
                                        '#60a5fa'
                                    } />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Vulnerabilities by Type">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={vulnerabilitiesByType}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#82ca9d"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {vulnerabilitiesByType.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <Card title="All Security Vulnerabilities">
                <div className="flex flex-wrap gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by description, type, ID..."
                        className="flex-grow p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    >
                        {uniqueVulnerabilityStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterService}
                        onChange={(e) => { setFilterService(e.target.value); setCurrentPage(1); }}
                    >
                        {uniqueVulnerabilityServices.map(service => <option key={service} value={service}>{service}</option>)}
                    </select>
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterSeverity}
                        onChange={(e) => { setFilterSeverity(e.target.value); setCurrentPage(1); }}
                    >
                        {uniqueVulnerabilitySeverities.map(severity => <option key={severity} value={severity}>{severity}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Service</th>
                                <th scope="col" className="px-6 py-3">Severity</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Reported At</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">Loading vulnerabilities...</td></tr>
                            ) : currentVulnerabilities.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">No vulnerabilities found matching criteria.</td></tr>
                            ) : (
                                currentVulnerabilities.map(v => (
                                    <tr key={v.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-mono">{v.id}</td>
                                        <td className="px-6 py-4 font-medium text-white">{v.service}</td>
                                        <td className="px-6 py-4"><StatusBadge status={v.severity} /></td>
                                        <td className="px-6 py-4">{v.type}</td>
                                        <td className="px-6 py-4"><StatusBadge status={v.status} /></td>
                                        <td className="px-6 py-4">{v.reportedAt}</td>
                                        <td className="px-6 py-4 truncate max-w-xs">{v.description}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredVulnerabilities.length > 0 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
            </Card>
        </div>
    );
};

export const CloudCostManagementDashboard: React.FC = () => {
    const [cloudCosts, setCloudCosts] = useState<CloudCost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setCloudCosts(mockCloudCosts);
            setLoading(false);
        }, 800);
    }, []);

    const totalCostLastMonth = cloudCosts.length > 0 ? cloudCosts[cloudCosts.length - 1].totalCost : 0;
    const previousMonthCost = cloudCosts.length > 1 ? cloudCosts[cloudCosts.length - 2].totalCost : 0;
    const costChange = totalCostLastMonth - previousMonthCost;
    const costChangePercent = previousMonthCost > 0 ? ((costChange / previousMonthCost) * 100).toFixed(2) : '0.00';

    const costBreakdownLastMonth = useMemo(() => {
        if (cloudCosts.length === 0) return [];
        const lastMonth = cloudCosts[cloudCosts.length - 1];
        return [
            { name: 'Compute', value: lastMonth.compute, color: '#8884d8' },
            { name: 'Storage', value: lastMonth.storage, color: '#82ca9d' },
            { name: 'Network', value: lastMonth.network, color: '#ffc658' },
            { name: 'Database', value: lastMonth.database, color: '#ff7300' },
            { name: 'Other', value: lastMonth.other, color: '#a4de6c' },
        ];
    }, [cloudCosts]);

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-wider">Cloud Cost Management</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Spend (Last MTH)" value={`$${totalCostLastMonth.toLocaleString()}`} description="Current month's estimated cloud bill" icon={<CloudIcon className="h-7 w-7 text-blue-500" />} />
                <MetricCard title="Monthly Change" value={`${costChange >= 0 ? '+' : ''}$${costChange.toLocaleString()} (${costChangePercent}%)`} description="Vs. previous month" className={costChange > 0 ? 'bg-red-900/20' : 'bg-green-900/20'} icon={costChange > 0 ? <XCircleIcon className="h-7 w-7 text-red-500" /> : <CheckCircleIcon className="h-7 w-7 text-green-500" />} />
                <MetricCard title="Estimated Annual Spend" value={`$${(totalCostLastMonth * 12).toLocaleString()}`} description="Based on current month's run rate" icon={<ClockIcon className="h-7 w-7 text-gray-500" />} />
                <MetricCard title="Budget Alert Level" value="85%" description="On track to exceed budget" className="bg-yellow-900/20" icon={<ExclamationCircleIcon className="h-7 w-7 text-yellow-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Monthly Cloud Spend Trend">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={cloudCosts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value.toLocaleString()}`} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => `$${value.toLocaleString()}`}/>
                            <Legend />
                            <Area type="monotone" dataKey="totalCost" stackId="1" stroke="#8884d8" fill="#8884d8" name="Total Cost" />
                            <Area type="monotone" dataKey="compute" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Compute" />
                            <Area type="monotone" dataKey="storage" stackId="1" stroke="#ffc658" fill="#ffc658" name="Storage" />
                            <Area type="monotone" dataKey="network" stackId="1" stroke="#ff7300" fill="#ff7300" name="Network" />
                            <Area type="monotone" dataKey="database" stackId="1" stroke="#a4de6c" fill="#a4de6c" name="Database" />
                            <Area type="monotone" dataKey="other" stackId="1" stroke="#d0ed57" fill="#d0ed57" name="Other" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Last Month's Cost Breakdown">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={costBreakdownLastMonth}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {costBreakdownLastMonth.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => `$${value.toLocaleString()}`}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <Card title="Monthly Cost Details">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Month</th>
                                <th scope="col" className="px-6 py-3">Total Cost</th>
                                <th scope="col" className="px-6 py-3">Compute</th>
                                <th scope="col" className="px-6 py-3">Storage</th>
                                <th scope="col" className="px-6 py-3">Network</th>
                                <th scope="col" className="px-6 py-3">Database</th>
                                <th scope="col" className="px-6 py-3">Other</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">Loading costs...</td></tr>
                            ) : cloudCosts.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">No cost data found.</td></tr>
                            ) : (
                                cloudCosts.map(cc => (
                                    <tr key={cc.month} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{cc.month}</td>
                                        <td className="px-6 py-4">${cc.totalCost.toLocaleString()}</td>
                                        <td className="px-6 py-4">${cc.compute.toLocaleString()}</td>
                                        <td className="px-6 py-4">${cc.storage.toLocaleString()}</td>
                                        <td className="px-6 py-4">${cc.network.toLocaleString()}</td>
                                        <td className="px-6 py-4">${cc.database.toLocaleString()}</td>
                                        <td className="px-6 py-4">${cc.other.toLocaleString()}</td>
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

export const EnvironmentServiceDashboard: React.FC = () => {
    const [environmentStatuses, setEnvironmentStatuses] = useState<EnvironmentStatus[]>([]);
    const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
    const [loadingEnvs, setLoadingEnvs] = useState(true);
    const [loadingFlags, setLoadingFlags] = useState(true);

    const [filterEnvName, setFilterEnvName] = useState<string>('All');
    const [filterEnvStatus, setFilterEnvStatus] = useState<string>('All');
    const [flagSearchTerm, setFlagSearchTerm] = useState<string>('');
    const [flagFilterEnv, setFlagFilterEnv] = useState<string>('All');
    const [flagFilterService, setFlagFilterService] = useState<string>('All');

    useEffect(() => {
        setLoadingEnvs(true);
        setTimeout(() => {
            setEnvironmentStatuses(mockEnvironmentStatuses);
            setLoadingEnvs(false);
        }, 900);

        setLoadingFlags(true);
        setTimeout(() => {
            setFeatureFlags(mockFeatureFlags);
            setLoadingFlags(false);
        }, 1000);
    }, []);

    const filteredEnvironmentStatuses = useMemo(() => {
        return environmentStatuses.filter(env => {
            const matchesName = filterEnvName === 'All' || env.name === filterEnvName;
            const matchesStatus = filterEnvStatus === 'All' || env.status === filterEnvStatus;
            return matchesName && matchesStatus;
        });
    }, [environmentStatuses, filterEnvName, filterEnvStatus]);

    const filteredFeatureFlags = useMemo(() => {
        return featureFlags.filter(flag => {
            const matchesSearch = flagSearchTerm === '' ||
                                  flag.name.toLowerCase().includes(flagSearchTerm.toLowerCase()) ||
                                  flag.description.toLowerCase().includes(flagSearchTerm.toLowerCase());
            const matchesEnv = flagFilterEnv === 'All' || flag.environment === flagFilterEnv;
            const matchesService = flagFilterService === 'All' || flag.service === flagFilterService;
            return matchesSearch && matchesEnv && matchesService;
        });
    }, [featureFlags, flagSearchTerm, flagFilterEnv, flagFilterService]);

    const uniqueEnvNames = useMemo(() => ['All', ...new Set(environmentStatuses.map(e => e.name))], [environmentStatuses]);
    const uniqueEnvStatuses = useMemo(() => ['All', ...new Set(environmentStatuses.map(e => e.status))], [environmentStatuses]);
    const uniqueFlagEnvs = useMemo(() => ['All', ...new Set(featureFlags.map(f => f.environment))], [featureFlags]);
    const uniqueFlagServices = useMemo(() => ['All', ...new Set(featureFlags.map(f => f.service))], [featureFlags]);

    const activeFeatureFlags = featureFlags.filter(f => f.enabled).length;
    const environmentsHealthy = environmentStatuses.filter(e => e.status === 'Healthy').length;
    const environmentsDegraded = environmentStatuses.filter(e => e.status === 'Degraded').length;
    const environmentsOffline = environmentStatuses.filter(e => e.status === 'Offline').length;

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-wider">Environment & Service Management</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Environments" value={environmentStatuses.length} description="Defined deployment environments" icon={<FolderOpenIcon className="h-7 w-7 text-green-500" />} />
                <MetricCard title="Healthy Environments" value={environmentsHealthy} description="Fully operational" icon={<CheckCircleIcon className="h-7 w-7 text-green-500" />} />
                <MetricCard title="Degraded/Offline" value={environmentsDegraded + environmentsOffline} description="Requiring attention" icon={<ExclamationCircleIcon className="h-7 w-7 text-yellow-500" />} />
                <MetricCard title="Active Feature Flags" value={activeFeatureFlags} description="Features currently enabled" icon={<CogIcon className="h-7 w-7 text-blue-500" />} />
            </div>

            <Card title="Environment Health Status">
                <div className="flex flex-wrap gap-4 mb-4">
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterEnvName}
                        onChange={(e) => setFilterEnvName(e.target.value)}
                    >
                        {uniqueEnvNames.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterEnvStatus}
                        onChange={(e) => setFilterEnvStatus(e.target.value)}
                    >
                        {uniqueEnvStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Environment</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Deployed Services</th>
                                <th scope="col" className="px-6 py-3">Last Sync</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingEnvs ? (
                                <tr><td colSpan={4} className="px-6 py-4 text-center">Loading environments...</td></tr>
                            ) : filteredEnvironmentStatuses.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-4 text-center">No environments found matching criteria.</td></tr>
                            ) : (
                                filteredEnvironmentStatuses.map(env => (
                                    <tr key={env.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{env.name}</td>
                                        <td className="px-6 py-4"><StatusBadge status={env.status} /></td>
                                        <td className="px-6 py-4">
                                            <ul className="list-disc list-inside text-xs text-gray-500">
                                                {env.deployedServices.slice(0, 3).map((s, idx) => (
                                                    <li key={idx}>{s.name} ({s.version})</li>
                                                ))}
                                                {env.deployedServices.length > 3 && <li>... ({env.deployedServices.length - 3} more)</li>}
                                            </ul>
                                        </td>
                                        <td className="px-6 py-4">{env.lastSync}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card title="Feature Flag Management">
                <div className="flex flex-wrap gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by flag name or description..."
                        className="flex-grow p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={flagSearchTerm}
                        onChange={(e) => setFlagSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={flagFilterEnv}
                        onChange={(e) => setFlagFilterEnv(e.target.value)}
                    >
                        {uniqueFlagEnvs.map(env => <option key={env} value={env}>{env}</option>)}
                    </select>
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={flagFilterService}
                        onChange={(e) => setFlagFilterService(e.target.value)}
                    >
                        {uniqueFlagServices.map(service => <option key={service} value={service}>{service}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Flag Name</th>
                                <th scope="col" className="px-6 py-3">Service</th>
                                <th scope="col" className="px-6 py-3">Environment</th>
                                <th scope="col" className="px-6 py-3">Enabled</th>
                                <th scope="col" className="px-6 py-3">Rollout %</th>
                                <th scope="col" className="px-6 py-3">Last Updated</th>
                                <th scope="col" className="px-6 py-3">Updated By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingFlags ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">Loading feature flags...</td></tr>
                            ) : filteredFeatureFlags.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">No feature flags found matching criteria.</td></tr>
                            ) : (
                                filteredFeatureFlags.map(flag => (
                                    <tr key={flag.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{flag.name}</td>
                                        <td className="px-6 py-4">{flag.service}</td>
                                        <td className="px-6 py-4"><StatusBadge status={flag.environment} /></td>
                                        <td className="px-6 py-4">
                                            {flag.enabled ? <CheckCircleIcon className="text-green-400" /> : <XCircleIcon className="text-red-400" />}
                                        </td>
                                        <td className="px-6 py-4">{flag.rolloutPercentage}%</td>
                                        <td className="px-6 py-4">{flag.lastUpdated}</td>
                                        <td className="px-6 py-4">{flag.updatedBy}</td>
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

export const DeveloperProductivityDashboard: React.FC = () => {
    const [prMetrics, setPrMetrics] = useState<PullRequestMetric[]>([]);
    const [codeQualityMetrics, setCodeQualityMetrics] = useState<CodeQualityMetric[]>([]);
    const [loadingPR, setLoadingPR] = useState(true);
    const [loadingCQ, setLoadingCQ] = useState(true);

    useEffect(() => {
        setLoadingPR(true);
        setTimeout(() => {
            setPrMetrics(mockPullRequestMetrics);
            setLoadingPR(false);
        }, 1100);

        setLoadingCQ(true);
        setTimeout(() => {
            setCodeQualityMetrics(mockCodeQualityMetrics);
            setLoadingCQ(false);
        }, 1200);
    }, []);

    const totalPRsMergedLast30Days = useMemo(() => {
        const last30Days = prMetrics.slice(-30);
        return last30Days.reduce((sum, metric) => sum + metric.merged, 0);
    }, [prMetrics]);

    const averageCycleTimeLast30Days = useMemo(() => {
        const last30Days = prMetrics.slice(-30).filter(m => m.merged > 0);
        if (last30Days.length === 0) return 'N/A';
        const totalCycleTime = last30Days.reduce((sum, metric) => sum + metric.cycleTime, 0);
        return `${(totalCycleTime / last30Days.length).toFixed(1)}h`;
    }, [prMetrics]);

    const avgCodeCoverage = useMemo(() => {
        if (codeQualityMetrics.length === 0) return 'N/A';
        const totalCoverage = codeQualityMetrics.reduce((sum, metric) => sum + metric.coverage, 0);
        return `${(totalCoverage / codeQualityMetrics.length).toFixed(1)}%`;
    }, [codeQualityMetrics]);

    const totalTechnicalDebtHours = useMemo(() => {
        return codeQualityMetrics.reduce((sum, metric) => sum + metric.technicalDebtHours, 0);
    }, [codeQualityMetrics]);


    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-wider">Developer Productivity</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="PRs Merged (30d)" value={totalPRsMergedLast30Days} description="Total pull requests merged" icon={<RocketLaunchIcon className="h-7 w-7 text-green-500" />} />
                <MetricCard title="Avg. PR Cycle Time (30d)" value={averageCycleTimeLast30Days} description="Time from PR open to merge" icon={<ClockIcon className="h-7 w-7 text-blue-500" />} />
                <MetricCard title="Avg. Code Coverage" value={avgCodeCoverage} description="Across all services" icon={<ChartBarIcon className="h-7 w-7 text-purple-500" />} />
                <MetricCard title="Total Technical Debt" value={`${totalTechnicalDebtHours}h`} description="Estimated technical debt across services" icon={<BugAntIcon className="h-7 w-7 text-yellow-500" />} />
            </div>

            <Card title="Pull Request Activity (Last 60 Days)">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={prMetrics}>
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend />
                        <Line type="monotone" dataKey="open" stroke="#ff7300" name="Open PRs" />
                        <Line type="monotone" dataKey="merged" stroke="#82ca9d" name="Merged PRs" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Code Quality Overview">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Service</th>
                                <th scope="col" className="px-6 py-3">Lines of Code</th>
                                <th scope="col" className="px-6 py-3">Bugs Found</th>
                                <th scope="col" className="px-6 py-3">Vulnerabilities</th>
                                <th scope="col" className="px-6 py-3">Coverage (%)</th>
                                <th scope="col" className="px-6 py-3">Tech Debt (Hrs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingCQ ? (
                                <tr><td colSpan={6} className="px-6 py-4 text-center">Loading code quality metrics...</td></tr>
                            ) : codeQualityMetrics.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-4 text-center">No code quality data found.</td></tr>
                            ) : (
                                codeQualityMetrics.map(cq => (
                                    <tr key={cq.service} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{cq.service}</td>
                                        <td className="px-6 py-4">{cq.linesOfCode.toLocaleString()}</td>
                                        <td className="px-6 py-4">{cq.bugsFound}</td>
                                        <td className="px-6 py-4">{cq.vulnerabilitiesFound}</td>
                                        <td className="px-6 py-4">{cq.coverage.toFixed(1)}%</td>
                                        <td className="px-6 py-4">{cq.technicalDebtHours}</td>
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

export const AuditLogViewer: React.FC = () => {
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterUser, setFilterUser] = useState<string>('All');
    const [filterAction, setFilterAction] = useState<string>('All');
    const [filterResource, setFilterResource] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 15;

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAuditLogs(mockAuditLogs);
            setLoading(false);
        }, 1300);
    }, []);

    const filteredAuditLogs = useMemo(() => {
        return auditLogs.filter(log => {
            const matchesUser = filterUser === 'All' || log.user === filterUser;
            const matchesAction = filterAction === 'All' || log.action === filterAction;
            const matchesResource = filterResource === 'All' || log.resourceType === filterResource;
            const matchesSearch = searchTerm === '' ||
                                  log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  log.resourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesUser && matchesAction && matchesResource && matchesSearch;
        });
    }, [auditLogs, filterUser, filterAction, filterResource, searchTerm]);

    const totalPages = Math.ceil(filteredAuditLogs.length / logsPerPage);
    const currentLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * logsPerPage;
        return filteredAuditLogs.slice(startIndex, startIndex + logsPerPage);
    }, [filteredAuditLogs, currentPage, logsPerPage]);

    const uniqueUsers = useMemo(() => ['All', ...new Set(auditLogs.map(log => log.user))], [auditLogs]);
    const uniqueActions = useMemo(() => ['All', ...new Set(auditLogs.map(log => log.action))], [auditLogs]);
    const uniqueResourceTypes = useMemo(() => ['All', ...new Set(auditLogs.map(log => log.resourceType))], [auditLogs]);

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-wider">Audit Log Viewer</h3>

            <Card title="System Audit Logs">
                <div className="flex flex-wrap gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by details, resource ID, IP..."
                        className="flex-grow p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterUser}
                        onChange={(e) => { setFilterUser(e.target.value); setCurrentPage(1); }}
                    >
                        {uniqueUsers.map(user => <option key={user} value={user}>{user}</option>)}
                    </select>
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterAction}
                        onChange={(e) => { setFilterAction(e.target.value); setCurrentPage(1); }}
                    >
                        {uniqueActions.map(action => <option key={action} value={action}>{action}</option>)}
                    </select>
                    <select
                        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterResource}
                        onChange={(e) => { setFilterResource(e.target.value); setCurrentPage(1); }}
                    >
                        {uniqueResourceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Timestamp</th>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                                <th scope="col" className="px-6 py-3">Resource Type</th>
                                <th scope="col" className="px-6 py-3">Resource ID</th>
                                <th scope="col" className="px-6 py-3">Details</th>
                                <th scope="col" className="px-6 py-3">IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">Loading audit logs...</td></tr>
                            ) : currentLogs.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">No audit logs found matching criteria.</td></tr>
                            ) : (
                                currentLogs.map(log => (
                                    <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4">{log.timestamp}</td>
                                        <td className="px-6 py-4 font-medium text-white">{log.user}</td>
                                        <td className="px-6 py-4"><StatusBadge status={log.action} /></td>
                                        <td className="px-6 py-4">{log.resourceType}</td>
                                        <td className="px-6 py-4 font-mono">{log.resourceId}</td>
                                        <td className="px-6 py-4 truncate max-w-xs">{log.details}</td>
                                        <td className="px-6 py-4">{log.ipAddress}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredAuditLogs.length > 0 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
            </Card>
        </div>
    );
};

// --- Main DemoBankDevOpsView Component ---

export enum DashboardTab {
    Overview = 'Overview',
    Incidents = 'Incidents',
    Monitoring = 'Monitoring',
    Security = 'Security',
    Cost = 'Cost',
    Environments = 'Environments',
    Productivity = 'Productivity',
    Audit = 'Audit',
}

const DemoBankDevOpsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.Overview);

    // Calculate metrics for the overview cards
    const totalDeployments = deploymentFrequencyData.reduce((sum, d) => sum + d.deployments, 0);
    const avgBuildDuration = buildDurationData.reduce((sum, b) => sum + b.duration, 0) / buildDurationData.length;
    const changeFailureRate = buildDurationData.filter(b => !b.success).length / buildDurationData.length * 100;

    // Simulate MTTR - using a simple average from mock incidents
    const resolvedIncidents = mockIncidents.filter(i => i.status === 'Resolved' || i.status === 'Closed' && i.mttr !== undefined);
    const meanTimeToRestore = resolvedIncidents.length > 0
        ? (resolvedIncidents.reduce((sum, i) => sum + (i.mttr || 0), 0) / resolvedIncidents.length / 60).toFixed(1) + 'h' // convert minutes to hours
        : 'N/A';

    const tabs = [
        { name: DashboardTab.Overview, icon: <ChartBarIcon /> },
        { name: DashboardTab.Incidents, icon: <BugAntIcon /> },
        { name: DashboardTab.Monitoring, icon: <ChartBarIcon /> },
        { name: DashboardTab.Security, icon: <SecurityShieldIcon /> },
        { name: DashboardTab.Cost, icon: <CloudIcon /> },
        { name: DashboardTab.Environments, icon: <ServerStackIcon /> },
        { name: DashboardTab.Productivity, icon: <UserGroupIcon /> },
        { name: DashboardTab.Audit, icon: <DocumentTextIcon /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case DashboardTab.Overview:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Deployments (YTD)" value={totalDeployments} description="Across all services" icon={<RocketLaunchIcon className="h-7 w-7 text-blue-500" />} />
                            <MetricCard title="Change Failure Rate" value={`${changeFailureRate.toFixed(1)}%`} description="Percentage of failed deployments" className={changeFailureRate > 5 ? 'bg-red-900/20' : ''} icon={<XCircleIcon className="h-7 w-7 text-red-500" />} />
                            <MetricCard title="Avg. Build Duration" value={`${avgBuildDuration.toFixed(1)}m`} description="Mean pipeline execution time" className={avgBuildDuration > 6 ? 'bg-yellow-900/20' : ''} icon={<ClockIcon className="h-7 w-7 text-yellow-500" />} />
                            <MetricCard title="Mean Time to Restore" value={meanTimeToRestore} description="Time to recover from incidents" className={meanTimeToRestore !== 'N/A' && parseFloat(meanTimeToRestore) > 0.5 ? 'bg-red-900/20' : ''} icon={<ClockIcon className="h-7 w-7 text-red-500" />} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Average Build Duration (minutes)">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={buildDurationData}>
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" domain={[4, 7]} />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                        <Line type="monotone" dataKey="duration" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Deployment Frequency (Monthly)">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={deploymentFrequencyData}>
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                        <Bar dataKey="deployments" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>

                        <Card title="Recent Deployments">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-400">
                                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                            <th scope="col" className="px-6 py-3">Service</th>
                                            <th scope="col" className="px-6 py-3">Version</th>
                                            <th scope="col" className="px-6 py-3">Environment</th>
                                            <th scope="col" className="px-6 py-3">Date</th>
                                            <th scope="col" className="px-6 py-3">Author</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentDeployments.slice(0, 10).map(dep => (
                                            <tr key={dep.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                                <td className="px-6 py-4">{getStatusIcon(dep.status)}</td>
                                                <td className="px-6 py-4 font-medium text-white">{dep.service}</td>
                                                <td className="px-6 py-4 font-mono">{dep.version}</td>
                                                <td className="px-6 py-4"><StatusBadge status={dep.environment} /></td>
                                                <td className="px-6 py-4">{dep.date}</td>
                                                <td className="px-6 py-4">{dep.author}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                );
            case DashboardTab.Incidents:
                return <IncidentManagementDashboard />;
            case DashboardTab.Monitoring:
                return <MonitoringDashboard />;
            case DashboardTab.Security:
                return <SecurityComplianceDashboard />;
            case DashboardTab.Cost:
                return <CloudCostManagementDashboard />;
            case DashboardTab.Environments:
                return <EnvironmentServiceDashboard />;
            case DashboardTab.Productivity:
                return <DeveloperProductivityDashboard />;
            case DashboardTab.Audit:
                return <AuditLogViewer />;
            default:
                return <p className="text-white">Select a tab</p>;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank DevOps Platform</h2>

            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`${
                                activeTab === tab.name
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                            <span className="mr-2">{tab.icon}</span> {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6">{renderContent()}</div>
        </div>
    );
};

export default DemoBankDevOpsView;