// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankBIView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useReducer, useRef } from 'react';
import Card from '../../Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// ===================================================================================
// 1. TYPE DEFINITIONS
// ===================================================================================

export type TUserRole = 'Admin' | 'Editor' | 'Viewer' | 'Guest';
export type TDataSourceStatus = 'online' | 'offline' | 'syncing' | 'error' | 'degraded';
export type TActivityType = 'view' | 'create' | 'update' | 'delete' | 'share' | 'export' | 'comment' | 'run_query';
export type TSortDirection = 'asc' | 'desc';
export type TResourceType = 'Dashboard' | 'Report' | 'DataSource' | 'User';
export type TModalType = 'none' | 'shareDashboard' | 'aiInsights' | 'deleteDashboard' | 'viewUser';

export interface User {
    id: string;
    name: string;
    email: string;
    role: TUserRole;
    avatarUrl: string;
    lastLogin: Date;
    department: 'Sales' | 'Marketing' | 'Product' | 'Engineering' | 'Executive' | 'HR' | 'Finance';
}

export interface Report {
    id: string;
    name: string;
    createdAt: Date;
    lastUpdated: Date;
    dataSourceId: string;
    query: string;
    visualizationType: 'table' | 'bar' | 'line' | 'pie';
    lastRunDuration: number; // in ms
}

export interface Dashboard {
    id:string;
    name: string;
    ownerId: string;
    description: string;
    views: number;
    createdAt: Date;
    lastAccessed: Date;
    tags: string[];
    isFavorite: boolean;
    relatedReports: Report[];
    accessList: { userId: string; role: 'Editor' | 'Viewer' }[];
    versionHistory: { version: number, modifiedAt: Date, modifiedById: string }[];
}

export interface UserActivity {
    id: string;
    userId: string;
    activityType: TActivityType;
    targetId: string; // Dashboard or Report ID
    targetType: TResourceType;
    timestamp: Date;
    details: string;
    ipAddress: string;
}

export interface PerformanceMetric {
    timestamp: string; // ISO string for charting
    avgLoadTime: number; // in seconds
    queryExecutionTime: number; // in seconds
    concurrentUsers: number;
    errorRate: number; // percentage
    memoryUsage: number; // in MB
    cpuUtilization: number; // percentage
}

export interface DataSource {
    id: string;
    name: string;
    type: 'PostgreSQL' | 'Snowflake' | 'BigQuery' | 'MySQL' | 'API' | 'S3';
    status: TDataSourceStatus;
    lastSync: Date;
    dataFreshness: number; // in minutes
    queryCount: number;
    avgQueryTime: number; // in ms
}

export interface KpiData {
    totalDashboards: number;
    totalReports: number;
    dailyActiveUsers: number;
    avgLoadTime: number;
    dashboardTrend: { name: string; value: number }[];
    reportTrend: { name: string; value: number }[];
    userActivityTrend: { name: string; value: number }[];
    loadTimeTrend: { name: string; value: number }[];
}

export interface FilterState {
    searchTerm: string;
    ownerId: string | 'all';
    tag: string | 'all';
    dateRange: '24h' | '7d' | '30d' | 'all';
}

export interface SortState {
    key: keyof Dashboard | 'ownerName';
    direction: TSortDirection;
}

export interface AIInsight {
    id: string;
    title: string;
    summary: string;
    severity: 'info' | 'warning' | 'critical';
    recommendation: string;
    relatedData: any;
    generatedAt: Date;
}

// ===================================================================================
// 2. MOCK DATA GENERATION
// ===================================================================================

const firstNames = ['Aisha', 'Ben', 'Carla', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Isla', 'Jack', 'Liam', 'Olivia', 'Noah', 'Emma'];
const lastNames = ['Williams', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Smith', 'Brown'];
const departments: User['department'][] = ['Sales', 'Marketing', 'Product', 'Engineering', 'Executive', 'HR', 'Finance'];
const roles: TUserRole[] = ['Admin', 'Editor', 'Viewer', 'Guest'];
const dashboardAdjectives = ['Executive', 'Sales', 'Marketing', 'Product', 'Financial', 'Operational', 'Customer', 'Regional', 'Global'];
const dashboardNouns = ['Overview', 'Dashboard', 'Analysis', 'Report', 'KPIs', 'Metrics', 'Summary', 'Deep Dive', 'Pulse'];
const tags = ['finance', 'q2-2024', 'sales', 'emea', 'product-launch', 'kpi', 'daily-standup', 'confidential', 'board-meeting', 'strategy'];

const generateRandomIp = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
export const generateRandomName = () => `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

export const generateMockUsers = (count: number): User[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `user_${i + 1}`,
        name: generateRandomName(),
        email: `user${i + 1}@demobank.com`,
        role: roles[i % roles.length],
        avatarUrl: `https://i.pravatar.cc/40?u=user${i + 1}`,
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        department: departments[i % departments.length],
    }));
};

export const MOCK_USERS = generateMockUsers(50);

export const generateMockReports = (count: number, dataSourceId: string): Report[] => {
    const vizTypes: Report['visualizationType'][] = ['table', 'bar', 'line', 'pie'];
    return Array.from({ length: count }, (_, i) => ({
        id: `report_${dataSourceId}_${i + 1}`,
        name: `Report ${i + 1} for ${dataSourceId}`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(),
        dataSourceId: dataSourceId,
        query: `SELECT * FROM table_${i} WHERE date > '2023-01-01' LIMIT 100;`,
        visualizationType: vizTypes[i % vizTypes.length],
        lastRunDuration: Math.floor(Math.random() * 5000) + 200,
    }));
};

export const generateMockDashboards = (count: number, users: User[]): Dashboard[] => {
    return Array.from({ length: count }, (_, i) => {
        const owner = users[Math.floor(Math.random() * users.length)];
        const numReports = Math.floor(Math.random() * 5) + 1;
        const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        return {
            id: `dash_${i + 1}`,
            name: `${dashboardAdjectives[i % dashboardAdjectives.length]} ${dashboardNouns[i % dashboardNouns.length]}`,
            ownerId: owner.id,
            description: `A detailed dashboard focusing on ${dashboardAdjectives[i % dashboardAdjectives.length].toLowerCase()} metrics. Maintained by the ${owner.department} department.`,
            views: Math.floor(Math.random() * 5000) + 100,
            createdAt,
            lastAccessed: new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())),
            tags: Array.from(new Set(Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => tags[Math.floor(Math.random() * tags.length)]))),
            isFavorite: Math.random() > 0.8,
            relatedReports: generateMockReports(numReports, `ds_${i % 5}`),
            accessList: Array.from({ length: Math.floor(Math.random() * 10) + 2 }, () => ({
                userId: users[Math.floor(Math.random() * users.length)].id,
                role: Math.random() > 0.3 ? 'Viewer' : 'Editor',
            })),
            versionHistory: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, v) => ({
                version: v + 1,
                modifiedAt: new Date(createdAt.getTime() + (v + 1) * 30 * 24 * 60 * 60 * 1000),
                modifiedById: users[Math.floor(Math.random() * users.length)].id,
            })),
        };
    });
};

export const MOCK_DASHBOARDS = generateMockDashboards(42, MOCK_USERS);

export const generateMockUserActivity = (count: number, users: User[], dashboards: Dashboard[]): UserActivity[] => {
    const activityTypes: TActivityType[] = ['view', 'create', 'update', 'delete', 'share', 'export', 'comment'];
    return Array.from({ length: count }, (_, i) => {
        const user = users[Math.floor(Math.random() * users.length)];
        const dashboard = dashboards[Math.floor(Math.random() * dashboards.length)];
        const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        return {
            id: `activity_${i + 1}`,
            userId: user.id,
            activityType,
            targetId: dashboard.id,
            targetType: 'Dashboard',
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            details: `User ${user.name} performed '${activityType}' on dashboard '${dashboard.name}'`,
            ipAddress: generateRandomIp(),
        };
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const MOCK_ACTIVITIES = generateMockUserActivity(200, MOCK_USERS, MOCK_DASHBOARDS);

export const generatePerformanceData = (days: number): PerformanceMetric[] => {
    return Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return {
            timestamp: date.toISOString().split('T')[0],
            avgLoadTime: 2.5 + Math.sin(i / 5) + Math.random(),
            queryExecutionTime: 1.2 + Math.sin(i / 6) * 0.5 + Math.random() * 0.5,
            concurrentUsers: 150 + Math.floor(Math.sin(i / 10) * 50) + Math.floor(Math.random() * 20),
            errorRate: Math.max(0, 0.5 + Math.sin(i / 3) * 0.5 + (Math.random() - 0.5) * 0.2),
            memoryUsage: 4096 + Math.sin(i / 4) * 1024 + Math.random() * 512,
            cpuUtilization: 60 + Math.sin(i / 8) * 20 + Math.random() * 10,
        };
    });
};

export const MOCK_PERFORMANCE_DATA = generatePerformanceData(30);

export const MOCK_DATA_SOURCES: DataSource[] = [
    { id: 'ds_1', name: 'Primary Transaction DB', type: 'PostgreSQL', status: 'online', lastSync: new Date(), dataFreshness: 5, queryCount: 1205, avgQueryTime: 150 },
    { id: 'ds_2', name: 'Data Warehouse', type: 'Snowflake', status: 'syncing', lastSync: new Date(Date.now() - 60 * 60 * 1000), dataFreshness: 60, queryCount: 850, avgQueryTime: 2500 },
    { id: 'ds_3', name: 'Marketing Analytics', type: 'BigQuery', status: 'online', lastSync: new Date(), dataFreshness: 15, queryCount: 3420, avgQueryTime: 800 },
    { id: 'ds_4', name: 'Legacy CRM', type: 'MySQL', status: 'error', lastSync: new Date(Date.now() - 3 * 60 * 60 * 1000), dataFreshness: 180, queryCount: 50, avgQueryTime: 4500 },
    { id: 'ds_5', name: 'External Partner API', type: 'API', status: 'degraded', lastSync: new Date(Date.now() - 15 * 60 * 1000), dataFreshness: 15, queryCount: 5230, avgQueryTime: 450 },
    { id: 'ds_6', name: 'Log Storage', type: 'S3', status: 'offline', lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), dataFreshness: 1440, queryCount: 12, avgQueryTime: 10000 },
];

export const MOCK_KPI_DATA: KpiData = {
    totalDashboards: 42,
    totalReports: 120,
    dailyActiveUsers: 342,
    avgLoadTime: 3.1,
    dashboardTrend: Array.from({ length: 10 }, (_, i) => ({ name: `Day ${i+1}`, value: Math.floor(Math.random() * 10 + 40)})),
    reportTrend: Array.from({ length: 10 }, (_, i) => ({ name: `Day ${i+1}`, value: Math.floor(Math.random() * 20 + 110)})),
    userActivityTrend: Array.from({ length: 10 }, (_, i) => ({ name: `Day ${i+1}`, value: Math.floor(Math.random() * 500 + 2500)})),
    loadTimeTrend: Array.from({ length: 10 }, (_, i) => ({ name: `Day ${i+1}`, value: parseFloat((Math.random() * 0.5 + 2.9).toFixed(2))})),
};

const popularDashboards = MOCK_DASHBOARDS.slice(0, 4).map(d => ({
    id: d.id,
    name: d.name,
    views: d.views,
    owner: MOCK_USERS.find(u => u.id === d.ownerId)?.name || 'Unknown',
}));

// ===================================================================================
// 3. MOCK API SERVICE
// ===================================================================================

const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
    fetchKpiData: async (): Promise<KpiData> => {
        await networkDelay(500);
        return MOCK_KPI_DATA;
    },
    fetchDashboards: async (filters: FilterState): Promise<{ dashboards: Dashboard[], total: number }> => {
        await networkDelay(800);
        let filtered = MOCK_DASHBOARDS;

        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(d =>
                d.name.toLowerCase().includes(term) ||
                d.description.toLowerCase().includes(term) ||
                d.tags.some(t => t.toLowerCase().includes(term))
            );
        }

        if (filters.ownerId !== 'all') {
            filtered = filtered.filter(d => d.ownerId === filters.ownerId);
        }

        if (filters.tag !== 'all') {
            filtered = filtered.filter(d => d.tags.includes(filters.tag));
        }

        if (filters.dateRange !== 'all') {
            const now = Date.now();
            const days = { '24h': 1, '7d': 7, '30d': 30 }[filters.dateRange];
            const cutoff = now - days * 24 * 60 * 60 * 1000;
            filtered = filtered.filter(d => d.lastAccessed.getTime() >= cutoff);
        }
        
        return { dashboards: filtered, total: filtered.length };
    },
    fetchPerformanceMetrics: async (): Promise<PerformanceMetric[]> => {
        await networkDelay(1200);
        return MOCK_PERFORMANCE_DATA;
    },
    fetchUserActivity: async (): Promise<UserActivity[]> => {
        await networkDelay(700);
        return MOCK_ACTIVITIES.slice(0, 100);
    },
    fetchDataSources: async (): Promise<DataSource[]> => {
        await networkDelay(400);
        return MOCK_DATA_SOURCES;
    },
    fetchDashboardDetails: async (id: string): Promise<Dashboard | undefined> => {
        await networkDelay(300);
        return MOCK_DASHBOARDS.find(d => d.id === id);
    },
    generateAIInsight: async (dashboard: Dashboard): Promise<AIInsight> => {
        await networkDelay(2500);
        const insights = [
            { title: "Unusual Spike in EMEA Sales", severity: 'warning', recommendation: "Investigate the top contributing factors in the EMEA region. Consider cross-referencing with marketing campaigns from the last 7 days." },
            { title: "Q2 Product Engagement Dropping", severity: 'critical', recommendation: "Drill down into user segments to identify churn risks. A/B test new onboarding flows for the affected product lines." },
            { title: "Operational Costs Trending High", severity: 'warning', recommendation: "Review the 'Operational Deep Dive' report for cost-center breakdowns. Potential for optimization in logistics." },
            { title: "Customer Satisfaction KPI is Stable", severity: 'info', recommendation: "Performance is meeting targets. Continue monitoring and consider setting more ambitious goals for next quarter." },
        ];
        const insight = insights[Math.floor(Math.random() * insights.length)];
        return {
            id: `insight_${Date.now()}`,
            title: insight.title,
            summary: `Analysis of '${dashboard.name}' data reveals a significant trend. ${insight.title.toLowerCase()}. This pattern emerged over the last 14 days and deviates from the 90-day average by 2.5 standard deviations.`,
            severity: insight.severity,
            recommendation: insight.recommendation,
            relatedData: {
                keyMetric: "Views",
                currentValue: dashboard.views,
                previousValue: dashboard.views * (1 + (Math.random() - 0.5) * 0.2),
            },
            generatedAt: new Date(),
        };
    },
    deleteDashboard: async (id: string): Promise<{ success: boolean }> => {
        await networkDelay(600);
        const index = MOCK_DASHBOARDS.findIndex(d => d.id === id);
        if (index > -1) {
            // MOCK_DASHBOARDS.splice(index, 1);
            console.log(`(Mock) Deleted dashboard ${id}`);
            return { success: true };
        }
        return { success: false };
    }
};

// ===================================================================================
// 4. UTILITY & HELPER FUNCTIONS
// ===================================================================================

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric', month: 'short', day: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(date);
};

export const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
};

export const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
};

export const getStatusColor = (status: TDataSourceStatus) => {
    switch (status) {
        case 'online': return 'bg-green-500';
        case 'syncing': return 'bg-blue-500';
        case 'error': return 'bg-red-500';
        case 'offline': return 'bg-gray-500';
        case 'degraded': return 'bg-yellow-500';
    }
};

export const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF198A'];

// ===================================================================================
// 5. ICONS (Inline SVG Components)
// ===================================================================================

const Icon = ({ path, className = "w-6 h-6" }: { path: string; className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
        <path d={path} />
    </svg>
);
const SearchIcon = () => <Icon path="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />;
const StarIcon = ({ filled = false }: { filled?: boolean }) => <Icon path={filled ? "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" : "M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"} />;
const SortAscIcon = () => <Icon path="M19 17H22L18 21L14 17H17V3H19V17M2 17H12V19H2V17M6 5V7H2V5H6M2 11H9V13H2V11Z" />;
const SortDescIcon = () => <Icon path="M19 7H22L18 3L14 7H17V21H19V7M2 17H12V19H2V17M6 5V7H2V5H6M2 11H9V13H2V11Z" />;
const InfoIcon = () => <Icon path="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />;
const CloseIcon = () => <Icon path="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />;
const BotIcon = () => <Icon path="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
const ShareIcon = () => <Icon path="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L16.04,7.15C16.56,7.62 17.24,7.92 18,7.92C19.66,7.92 21,6.58 21,4.92C21,3.26 19.66,1.92 18,1.92C16.34,1.92 15,3.26 15,4.92C15,5.16 15.04,5.39 15.09,5.62L7.96,9.77C7.44,9.3 6.76,9 6,9C4.34,9 3,10.34 3,12C3,13.66 4.34,15 6,15C6.76,15 7.44,14.7 7.96,14.23L15.09,18.38C15.04,18.61 15,18.84 15,19.08C15,20.74 16.34,22.08 18,22.08C19.66,22.08 21,20.74 21,19.08C21,17.42 19.66,16.08 18,16.08Z" />;
const TrashIcon = () => <Icon path="M9,3V4H4V6H5V19C5,20.1 5.9,21 7,21H17C18.1,21 19,20.1 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />;
const EditIcon = () => <Icon path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25Z" />;

// ===================================================================================
// 6. UI SUB-COMPONENTS
// ===================================================================================

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={onClose}>
            <div className={`bg-gray-800 rounded-lg shadow-xl p-6 relative w-full ${sizeClasses[size]}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <CloseIcon />
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
};

export const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-gray-900 bg-opacity-90 text-white border border-gray-600 rounded-md shadow-lg">
                <p className="label font-bold">{`${label}`}</p>
                {payload.map((pld: any, index: number) => (
                    <p key={index} style={{ color: pld.color }}>
                        {`${pld.name}: ${typeof pld.value === 'number' ? pld.value.toFixed(2) : pld.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const KPICard: React.FC<{ title: string; value: string; trendData: {name:string; value:number}[]; color: string; icon: React.ReactNode }> = React.memo(({ title, value, trendData, color, icon }) => (
    <Card>
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center space-x-2">
                    <div className="text-gray-400">{icon}</div>
                    <p className="text-sm text-gray-400">{title}</p>
                </div>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className="w-28 h-14">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`color-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${title.replace(/\s+/g, '')})`} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </Card>
));

export const FilterPanel: React.FC<{
    filters: FilterState;
    onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    allUsers: User[];
    allTags: string[];
}> = React.memo(({ filters, onFilterChange, allUsers, allTags }) => {
    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Search</label>
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            placeholder="Search dashboards..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-md pl-10 pr-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={filters.searchTerm}
                            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="owner" className="block text-sm font-medium text-gray-300 mb-1">Owner</label>
                    <select
                        id="owner"
                        className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.ownerId}
                        onChange={(e) => onFilterChange('ownerId', e.target.value)}
                    >
                        <option value="all">All Owners</option>
                        {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="tag" className="block text-sm font-medium text-gray-300 mb-1">Tag</label>
                    <select
                        id="tag"
                        className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.tag}
                        onChange={(e) => onFilterChange('tag', e.target.value)}
                    >
                        <option value="all">All Tags</option>
                        {[...tags].sort().map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="dateRange" className="block text-sm font-medium text-gray-300 mb-1">Last Accessed</label>
                    <select
                        id="dateRange"
                        className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.dateRange}
                        onChange={(e) => onFilterChange('dateRange', e.target.value as FilterState['dateRange'])}
                    >
                        <option value="all">Any time</option>
                        <option value="24h">Past 24 hours</option>
                        <option value="7d">Past 7 days</option>
                        <option value="30d">Past 30 days</option>
                    </select>
                </div>
            </div>
        </Card>
    );
});

export const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}> = React.memo(({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    if (totalPages <= 1) return null;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return (
        <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
             <p>Showing {startItem}-{endItem} of {totalItems} results</p>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
});

const DataSourcesMonitor: React.FC<{ dataSources: DataSource[] }> = React.memo(({ dataSources }) => (
    <Card>
        <h3 className="text-lg font-bold text-white mb-4">Data Source Status</h3>
        <div className="space-y-3">
            {dataSources.map(ds => (
                <div key={ds.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(ds.status)}`}></span>
                        <span className="text-gray-300">{ds.name} ({ds.type})</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-400 capitalize">{ds.status}</span>
                        <span className="text-gray-500 text-xs">Last sync: {timeAgo(ds.lastSync)}</span>
                    </div>
                </div>
            ))}
        </div>
    </Card>
));

const ActivityLog: React.FC<{ activities: UserActivity[]; users: User[] }> = React.memo(({ activities, users }) => (
    <Card>
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {activities.map(activity => {
                const user = users.find(u => u.id === activity.userId);
                return (
                    <li key={activity.id} className="flex items-start space-x-3">
                        <img src={user?.avatarUrl} alt={user?.name} className="w-8 h-8 rounded-full" />
                        <div>
                            <p className="text-sm text-gray-300" dangerouslySetInnerHTML={{__html: activity.details.replace(/'(.*?)'/g, `<strong class="font-semibold text-indigo-400">$1</strong>`)}} />
                            <p className="text-xs text-gray-500">{timeAgo(activity.timestamp)}</p>
                        </div>
                    </li>
                );
            })}
        </ul>
    </Card>
));

const SystemPerformanceView: React.FC<{ data: PerformanceMetric[] }> = React.memo(({ data }) => (
    <Card>
        <h3 className="text-lg font-bold text-white mb-4">System Performance (Last 30 Days)</h3>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="timestamp" stroke="#A0AEC0" tickFormatter={(ts) => formatDate(new Date(ts), { month: 'short', day: 'numeric' })} />
                    <YAxis yAxisId="left" stroke="#A0AEC0" />
                    <YAxis yAxisId="right" orientation="right" stroke="#A0AEC0" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="avgLoadTime" name="Avg Load Time (s)" stroke="#8884d8" dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="concurrentUsers" name="Concurrent Users" stroke="#82ca9d" dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="errorRate" name="Error Rate (%)" stroke="#ffc658" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </Card>
));

const AIInsightGenerator: React.FC<{ dashboard: Dashboard; onInsight: (insight: AIInsight) => void; onClose: () => void }> = ({ dashboard, onInsight, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [insight, setInsight] = useState<AIInsight | null>(null);

    useEffect(() => {
        const generate = async () => {
            const result = await api.generateAIInsight(dashboard);
            setInsight(result);
            setIsLoading(false);
        };
        generate();
    }, [dashboard]);

    const severityClasses = {
        info: 'bg-blue-500 border-blue-400',
        warning: 'bg-yellow-500 border-yellow-400',
        critical: 'bg-red-500 border-red-400',
    };

    return (
        <div>
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-48">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-300">AI is analyzing your dashboard...</p>
                </div>
            ) : insight && (
                <div className="space-y-4">
                    <div className={`p-4 rounded-md border ${severityClasses[insight.severity]}`}>
                        <h4 className="text-lg font-bold text-white">{insight.title}</h4>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-200 mb-1">Summary</h5>
                        <p className="text-gray-300 text-sm">{insight.summary}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-200 mb-1">Recommendation</h5>
                        <p className="text-gray-300 text-sm">{insight.recommendation}</p>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                        Generated on {formatDate(insight.generatedAt, { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                </div>
            )}
            <div className="mt-6 flex justify-end space-x-3">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">Close</button>
                {!isLoading && insight && (
                     <button onClick={() => onInsight(insight)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors">Add to Dashboard Notes</button>
                )}
            </div>
        </div>
    );
};


// ===================================================================================
// 7. MAIN VIEW COMPONENT
// ===================================================================================

type BIViewState = {
    loading: { [key: string]: boolean };
    kpiData: KpiData | null;
    dashboards: Dashboard[];
    performanceData: PerformanceMetric[];
    userActivity: UserActivity[];
    dataSources: DataSource[];
    filters: FilterState;
    sort: SortState;
    pagination: { currentPage: number; itemsPerPage: number; totalItems: number; };
    selectedDashboardId: string | null;
    activeModal: TModalType;
    error: string | null;
};

type BIViewAction =
    | { type: 'SET_LOADING'; payload: { key: string; value: boolean } }
    | { type: 'SET_DATA'; payload: { key: keyof BIViewState; value: any } }
    | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
    | { type: 'SET_SORT'; payload: SortState }
    | { type: 'SET_PAGINATION'; payload: Partial<BIViewState['pagination']> }
    | { type: 'SET_SELECTED_DASHBOARD'; payload: string | null }
    | { type: 'SET_MODAL'; payload: TModalType }
    | { type: 'SET_ERROR'; payload: string | null };
    

const initialState: BIViewState = {
    loading: { kpis: true, dashboards: true, performance: true, activity: true, sources: true },
    kpiData: null,
    dashboards: [],
    performanceData: [],
    userActivity: [],
    dataSources: [],
    filters: { searchTerm: '', ownerId: 'all', tag: 'all', dateRange: 'all' },
    sort: { key: 'lastAccessed', direction: 'desc' },
    pagination: { currentPage: 1, itemsPerPage: 10, totalItems: 0 },
    selectedDashboardId: null,
    activeModal: 'none',
    error: null,
};

function biViewReducer(state: BIViewState, action: BIViewAction): BIViewState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: { ...state.loading, [action.payload.key]: action.payload.value } };
        case 'SET_DATA':
            return { ...state, [action.payload.key]: action.payload.value };
        case 'SET_FILTERS':
            return { ...state, filters: { ...state.filters, ...action.payload }, pagination: { ...state.pagination, currentPage: 1 } };
        case 'SET_SORT':
            return { ...state, sort: action.payload };
        case 'SET_PAGINATION':
            return { ...state, pagination: { ...state.pagination, ...action.payload } };
        case 'SET_SELECTED_DASHBOARD':
            return { ...state, selectedDashboardId: action.payload };
        case 'SET_MODAL':
            return { ...state, activeModal: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: { ...initialState.loading, kpis: false } };
        default:
            return state;
    }
}


export default function DemoBankBIView() {
    const [state, dispatch] = useReducer(biViewReducer, initialState);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const loadDashboards = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: { key: 'dashboards', value: true } });
        try {
            const { dashboards, total } = await api.fetchDashboards(state.filters);
            dispatch({ type: 'SET_DATA', payload: { key: 'dashboards', value: dashboards } });
            dispatch({ type: 'SET_PAGINATION', payload: { totalItems: total } });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: "Failed to load dashboards." });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: { key: 'dashboards', value: false } });
        }
    }, [state.filters]);
    
    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            loadDashboards();
        }, 300); // Debounce search
        return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current) };
    }, [state.filters, loadDashboards]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [kpiData, performanceData, userActivity, dataSources] = await Promise.all([
                    api.fetchKpiData(),
                    api.fetchPerformanceMetrics(),
                    api.fetchUserActivity(),
                    api.fetchDataSources(),
                ]);
                dispatch({ type: 'SET_DATA', payload: { key: 'kpiData', value: kpiData } });
                dispatch({ type: 'SET_LOADING', payload: { key: 'kpis', value: false } });
                dispatch({ type: 'SET_DATA', payload: { key: 'performanceData', value: performanceData } });
                dispatch({ type: 'SET_LOADING', payload: { key: 'performance', value: false } });
                dispatch({ type: 'SET_DATA', payload: { key: 'userActivity', value: userActivity } });
                dispatch({ type: 'SET_LOADING', payload: { key: 'activity', value: false } });
                dispatch({ type: 'SET_DATA', payload: { key: 'dataSources', value: dataSources } });
                dispatch({ type: 'SET_LOADING', payload: { key: 'sources', value: false } });
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: 'Failed to load initial BI data.' });
            }
        };
        fetchInitialData();
    }, []);

    const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        dispatch({ type: 'SET_FILTERS', payload: { [key]: value } });
    };

    const handleSort = (key: SortState['key']) => {
        const direction = state.sort.key === key && state.sort.direction === 'asc' ? 'desc' : 'asc';
        dispatch({ type: 'SET_SORT', payload: { key, direction } });
    };

    const sortedDashboards = useMemo(() => {
        return [...state.dashboards].sort((a, b) => {
            const { key, direction } = state.sort;
            const dir = direction === 'asc' ? 1 : -1;

            if (key === 'ownerName') {
                const ownerA = MOCK_USERS.find(u => u.id === a.ownerId)?.name || '';
                const ownerB = MOCK_USERS.find(u => u.id === b.ownerId)?.name || '';
                return ownerA.localeCompare(ownerB) * dir;
            }

            const valA = a[key as keyof Dashboard];
            const valB = b[key as keyof Dashboard];

            if (typeof valA === 'number' && typeof valB === 'number') return (valA - valB) * dir;
            if (valA instanceof Date && valB instanceof Date) return (valA.getTime() - valB.getTime()) * dir;
            if (typeof valA === 'string' && typeof valB === 'string') return valA.localeCompare(valB) * dir;
            if (typeof valA === 'boolean' && typeof valB === 'boolean') return (Number(valA) - Number(valB)) * dir;

            return 0;
        });
    }, [state.dashboards, state.sort]);

    const paginatedDashboards = useMemo(() => {
        const { currentPage, itemsPerPage } = state.pagination;
        const start = (currentPage - 1) * itemsPerPage;
        return sortedDashboards.slice(start, start + itemsPerPage);
    }, [sortedDashboards, state.pagination]);

    const totalPages = Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage);

    const openModal = (modal: TModalType, dashboardId: string | null = null) => {
        dispatch({ type: 'SET_SELECTED_DASHBOARD', payload: dashboardId });
        dispatch({ type: 'SET_MODAL', payload: modal });
    };

    const closeModal = () => {
        dispatch({ type: 'SET_MODAL', payload: 'none' });
        dispatch({ type: 'SET_SELECTED_DASHBOARD', payload: null });
    };

    const selectedDashboard = MOCK_DASHBOARDS.find(d => d.id === state.selectedDashboardId);

    const handleDeleteDashboard = async () => {
        if (state.selectedDashboardId) {
            await api.deleteDashboard(state.selectedDashboardId);
            closeModal();
            loadDashboards();
        }
    };
    
    if (state.error) {
        return <div className="p-8 text-red-400 bg-red-900 border border-red-700 rounded-lg">{state.error}</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">BI & Analytics Portal</h1>

            {state.loading.kpis ? <LoadingSpinner /> : state.kpiData && (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                    <KPICard title="Total Dashboards" value={formatNumber(state.kpiData.totalDashboards)} trendData={state.kpiData.dashboardTrend} color="#8884d8" icon={<Icon path="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20C4,21.1 4.9,22 6,22H18C19.1,22 20,21.1 20,20V8L14,2H6Z" />} />
                    <KPICard title="Total Reports" value={formatNumber(state.kpiData.totalReports)} trendData={state.kpiData.reportTrend} color="#82ca9d" icon={<Icon path="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z" />} />
                    <KPICard title="Daily Active Users" value={formatNumber(state.kpiData.dailyActiveUsers)} trendData={state.kpiData.userActivityTrend} color="#ffc658" icon={<Icon path="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />} />
                    <KPICard title="Avg. Load Time" value={`${state.kpiData.avgLoadTime.toFixed(2)}s`} trendData={state.kpiData.loadTimeTrend} color="#ff8042" icon={<Icon path="M12,20C11.45,20 11,20.45 11,21C11,21.55 11.45,22 12,22C12.55,22 13,21.55 13,21C13,20.45 12.55,20 12,20M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.5 17.5,2 12,2M12.5,12.25L17,14.92L16.25,16.15L11,12.8V7H12.5V12.25Z" />} />
                </div>
            )}

            <div className="mb-6">
                <FilterPanel filters={state.filters} onFilterChange={handleFilterChange} allUsers={MOCK_USERS} allTags={tags} />
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                {[{ name: 'Favorite', key: 'isFavorite' }, { name: 'Dashboard Name', key: 'name' }, { name: 'Owner', key: 'ownerName' }, { name: 'Views', key: 'views' }, { name: 'Last Accessed', key: 'lastAccessed' }, { name: 'Actions', key: null }].map(header => (
                                    <th key={header.key || 'actions'} scope="col" className="px-6 py-3">
                                        {header.key ? (
                                            <button onClick={() => handleSort(header.key as SortState['key'])} className="flex items-center space-x-1 hover:text-white">
                                                <span>{header.name}</span>
                                                {state.sort.key === header.key && (state.sort.direction === 'asc' ? <SortAscIcon/> : <SortDescIcon/>)}
                                            </button>
                                        ) : header.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {state.loading.dashboards ? (
                                <tr><td colSpan={6}><div className="h-64"><LoadingSpinner /></div></td></tr>
                            ) : paginatedDashboards.map(d => {
                                const owner = MOCK_USERS.find(u => u.id === d.ownerId);
                                return (
                                    <tr key={d.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                                        <td className="px-6 py-4"><StarIcon filled={d.isFavorite} /></td>
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{d.name}</th>
                                        <td className="px-6 py-4 flex items-center space-x-2">
                                            <img src={owner?.avatarUrl} alt={owner?.name} className="w-6 h-6 rounded-full" />
                                            <span>{owner?.name || 'Unknown'}</span>
                                        </td>
                                        <td className="px-6 py-4">{formatNumber(d.views)}</td>
                                        <td className="px-6 py-4">{timeAgo(d.lastAccessed)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button onClick={() => openModal('aiInsights', d.id)} title="Get AI Insights" className="p-1 text-gray-400 hover:text-indigo-400"><BotIcon /></button>
                                                <button onClick={() => {}} title="Edit Dashboard" className="p-1 text-gray-400 hover:text-blue-400"><EditIcon /></button>
                                                <button onClick={() => {}} title="Share Dashboard" className="p-1 text-gray-400 hover:text-green-400"><ShareIcon /></button>
                                                <button onClick={() => openModal('deleteDashboard', d.id)} title="Delete Dashboard" className="p-1 text-gray-400 hover:text-red-400"><TrashIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={state.pagination.currentPage} totalPages={totalPages} onPageChange={(page) => dispatch({type: 'SET_PAGINATION', payload: { currentPage: page }})} totalItems={state.pagination.totalItems} itemsPerPage={state.pagination.itemsPerPage} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                 <div className="lg:col-span-2">
                    {state.loading.performance ? <LoadingSpinner/> : <SystemPerformanceView data={state.performanceData} />}
                </div>
                <div>
                    {state.loading.sources ? <LoadingSpinner/> : <DataSourcesMonitor dataSources={state.dataSources} />}
                </div>
                <div className="lg:col-span-3">
                     {state.loading.activity ? <LoadingSpinner/> : <ActivityLog activities={state.userActivity} users={MOCK_USERS} />}
                </div>
            </div>

            {selectedDashboard && (
                <>
                    <Modal isOpen={state.activeModal === 'aiInsights'} onClose={closeModal} title={`AI Insights for "${selectedDashboard.name}"`} size="lg">
                        <AIInsightGenerator dashboard={selectedDashboard} onInsight={(insight) => console.log(insight)} onClose={closeModal} />
                    </Modal>

                    <Modal isOpen={state.activeModal === 'deleteDashboard'} onClose={closeModal} title="Confirm Deletion" size="sm">
                        <p className="text-gray-300">Are you sure you want to delete the dashboard "{selectedDashboard.name}"? This action cannot be undone.</p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">Cancel</button>
                            <button onClick={handleDeleteDashboard} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors">Delete</button>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
}