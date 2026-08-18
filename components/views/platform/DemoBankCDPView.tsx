// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankCDPView.tsx
================================================================================

```typescript
// components/views/platform/DemoBankCDPView.tsx
import React, { useState, useEffect, useCallback, useMemo, FC, ReactNode, createContext, useContext, useReducer, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { format, subDays, parseISO } from 'date-fns';

// SECTION: ICONS
// In a real application, these would be imported from a library like lucide-react.
const Icon: FC<{ svg: string; className?: string }> = ({ svg, className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} dangerouslySetInnerHTML={{ __html: svg }} />
);
const ICONS = {
    dashboard: '<path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20V16"/>',
    segments: '<path d="M17 10h.01"/><path d="M7 10h.01"/><path d="M12 5a7.7 7.7 0 0 0-7.7 7.7A7.7 7.7 0 0 0 12 20.4a7.7 7.7 0 0 0 7.7-7.7A7.7 7.7 0 0 0 12 5z"/><path d="M12 12a3 3 0 0 0-3 3"/>',
    profiles: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    datasources: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    journeys: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
    activations: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.82l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.82l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    chevronDown: '<polyline points="6 9 12 15 18 9"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    magicWand: '<path d="M2 11h16"/><path d="m11 2 3.06 6.94a2 2 0 0 0 1.83 1.25h0a2 2 0 0 0 1.83-1.25L22 11"/><path d="M7 21v-8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8"/><path d="M14 21v-5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v5"/>',
};

// SECTION: TYPES AND INTERFACES
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';
export type Operator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in_list' | 'is_true' | 'is_false' | 'last_seen_before' | 'last_seen_after';

export interface SegmentRule {
    id: string;
    field: string;
    operator: Operator;
    value: string | number | boolean | string[];
}

export interface RuleGroup {
    id: string;
    combinator: 'AND' | 'OR';
    rules: (SegmentRule | RuleGroup)[];
}

export interface ActivationTarget {
    id: string;
    name: string;
    type: 'Google Ads' | 'Facebook Ads' | 'Braze' | 'Salesforce Marketing Cloud' | 'Webhooks';
    status: 'Active' | 'Paused';
    lastSync: string;
}

export interface AudienceSegment {
    id: number;
    name: string;
    description: string;
    size: number;
    status: 'Active' | 'Building' | 'Archived' | 'Draft' | 'Error';
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    definition: RuleGroup;
    tags: string[];
    activationTargets: string[]; // Array of ActivationTarget IDs
    performance?: { conversionRate: number, engagementScore: number };
}

export interface DataSource {
    id: string;
    name: string;
    type: 'CRM' | 'Web Analytics' | 'Mobile App' | 'Transactional DB' | 'Support Desk' | 'Data Warehouse';
    status: 'Connected' | 'Error' | 'Pending' | 'Syncing';
    lastIngested: string;
    ingestionVolume: number; // GB per month
    schema: { field: string, type: string, description: string }[];
}

export interface CustomerEvent {
    id: string;
    timestamp: string;
    type: string;
    properties: Record<string, any>;
    sourceId: string; // ID of the data source
}

export interface ComputedTrait {
    id: string;
    name: string;
    type: 'Predictive LTV' | 'Churn Propensity' | 'Product Affinity';
    value: number | string;
    lastCalculated: string;
    model_version: string;
}

export interface CustomerProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: string;
    lastSeen: string;
    totalSpend: number;
    orderCount: number;
    segments: number[]; // Array of segment IDs
    attributes: Record<string, any>;
    computedTraits: ComputedTrait[];
    timeline: CustomerEvent[];
    consent: { marketing: boolean, analytics: boolean, personalization: boolean };
}

export interface AnalyticsDataPoint {
    date: string;
    value: number;
    [key: string]: any;
}

export interface DashboardMetrics {
    unifiedProfiles: number;
    dataSources: number;
    activeSegments: number;
    eventsIngestedToday: number;
    profileGrowth: AnalyticsDataPoint[];
    segmentSizeDistribution: { name: string; value: number }[];
    topEvents: { name: string; count: number }[];
    recentActivity: { type: string, description: string, timestamp: string }[];
}

// SECTION: MOCK API SERVICE
class MockCdpApiService {
    private segments: AudienceSegment[] = MOCK_SEGMENTS;
    private profiles: CustomerProfile[] = MOCK_PROFILES;
    private dataSources: DataSource[] = MOCK_DATA_SOURCES;
    private metrics: DashboardMetrics = MOCK_METRICS;

    private simulateLatency<T>(data: T, delay: number = Math.random() * 800 + 200): Promise<T> {
        return new Promise(resolve => setTimeout(() => resolve(data), delay));
    }

    async getDashboardMetrics(): Promise<DashboardMetrics> {
        return this.simulateLatency(this.metrics);
    }

    async getSegments(params: { page?: number; limit?: number; sortBy?: keyof AudienceSegment; sortOrder?: 'asc' | 'desc'; filter?: string } = {}): Promise<{ data: AudienceSegment[]; total: number }> {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', filter = '' } = params;
        let filteredSegments = this.segments.filter(s =>
            s.name.toLowerCase().includes(filter.toLowerCase()) ||
            s.description.toLowerCase().includes(filter.toLowerCase())
        );

        filteredSegments.sort((a, b) => {
            const valA = a[sortBy];
            const valB = b[sortBy];
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        
        const paginatedData = filteredSegments.slice((page - 1) * limit, page * limit);
        return this.simulateLatency({ data: paginatedData, total: filteredSegments.length });
    }

    async getSegmentById(id: number): Promise<AudienceSegment | undefined> {
        const segment = this.segments.find(s => s.id === id);
        return this.simulateLatency(segment);
    }
    
    async createSegment(segmentData: Omit<AudienceSegment, 'id' | 'createdAt' | 'updatedAt' | 'size'>): Promise<AudienceSegment> {
        const newSegment: AudienceSegment = {
            ...segmentData,
            id: Math.max(...this.segments.map(s => s.id)) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            size: Math.floor(Math.random() * 20000) + 1000,
        };
        this.segments.unshift(newSegment);
        this.metrics.activeSegments++;
        return this.simulateLatency(newSegment, 800);
    }

    async updateSegment(id: number, updates: Partial<AudienceSegment>): Promise<AudienceSegment | undefined> {
        const segmentIndex = this.segments.findIndex(s => s.id === id);
        if (segmentIndex === -1) return this.simulateLatency(undefined);
        const updatedSegment = { ...this.segments[segmentIndex], ...updates, updatedAt: new Date().toISOString() };
        this.segments[segmentIndex] = updatedSegment;
        return this.simulateLatency(updatedSegment);
    }
    
    async deleteSegment(id: number): Promise<{ success: boolean }> {
        const initialLength = this.segments.length;
        this.segments = this.segments.filter(s => s.id !== id);
        if(this.segments.length < initialLength) {
            this.metrics.activeSegments--;
            return this.simulateLatency({ success: true });
        }
        return this.simulateLatency({ success: false });
    }
    
    async getSegmentAnalytics(segmentId: number, timeRange: '7d' | '30d' | '90d'): Promise<{ sizeHistory: AnalyticsDataPoint[] }> {
        const days = { '7d': 7, '30d': 30, '90d': 90 }[timeRange];
        const segment = this.segments.find(s => s.id === segmentId);
        const baseSize = segment ? segment.size : 10000;
        const sizeHistory: AnalyticsDataPoint[] = Array.from({ length: days }, (_, i) => {
            const date = subDays(new Date(), days - 1 - i);
            const fluctuation = (Math.random() - 0.5) * 0.1;
            const value = Math.round(baseSize * (1 + fluctuation));
            return { date: date.toISOString().split('T')[0], value };
        });
        return this.simulateLatency({ sizeHistory }, 700);
    }

    async getDataSources(): Promise<DataSource[]> {
        return this.simulateLatency(this.dataSources);
    }

    async searchProfiles(query: string): Promise<CustomerProfile[]> {
        if (!query) return this.simulateLatency([]);
        const lowerQuery = query.toLowerCase();
        const results = this.profiles.filter(p => 
            p.firstName.toLowerCase().includes(lowerQuery) ||
            p.lastName.toLowerCase().includes(lowerQuery) ||
            p.email.toLowerCase().includes(lowerQuery)
        ).slice(0, 10);
        return this.simulateLatency(results, 400);
    }

    async getProfileById(id: string): Promise<CustomerProfile | undefined> {
        const profile = this.profiles.find(p => p.id === id);
        if (profile) {
            profile.timeline.sort((a,b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
        }
        return this.simulateLatency(profile);
    }

    async estimateAudienceSize(definition: RuleGroup): Promise<number> {
        const complexity = JSON.stringify(definition).length;
        const baseSize = 1_500_000;
        const estimatedSize = Math.floor(baseSize / (complexity / 100 + 1) * (Math.random() * 0.4 + 0.8));
        return this.simulateLatency(estimatedSize, 1200);
    }
    
    async getPossibleFieldsForSegments(): Promise<{field: string, type: 'string' | 'number' | 'date' | 'boolean', values?: string[]}[]> {
        return this.simulateLatency([
            { field: 'lifetime_value', type: 'number' },
            { field: 'total_orders', type: 'number' },
            { field: 'last_purchase_date', type: 'date' },
            { field: 'signup_date', type: 'date' },
            { field: 'status', type: 'string', values: ['active', 'inactive', 'guest'] },
            { field: 'state', type: 'string' },
            { field: 'plan_type', type: 'string', values: ['Premium', 'Standard', 'Free'] },
            { field: 'is_subscribed_to_newsletter', type: 'boolean'},
        ]);
    }
}

const cdpApiService = new MockCdpApiService();

// SECTION: MOCK DATA
const MOCK_DATA_SOURCES: DataSource[] = [
    { id: 'ds-1', name: 'Salesforce CRM', type: 'CRM', status: 'Connected', lastIngested: '2023-10-27T10:00:00Z', ingestionVolume: 15.2, schema: [{field: 'lead_status', type: 'string', description: 'Current status of a lead'}] },
    { id: 'ds-2', name: 'Website Analytics (GA4)', type: 'Web Analytics', status: 'Connected', lastIngested: '2023-10-27T10:05:00Z', ingestionVolume: 45.8, schema: [{field: 'page_url', type: 'string', description: 'The URL of the page viewed'}] },
    { id: 'ds-3', name: 'iOS App Events', type: 'Mobile App', status: 'Error', lastIngested: '2023-10-26T18:00:00Z', ingestionVolume: 22.1, schema: [] },
    { id: 'ds-4', name: 'PostgreSQL Orders DB', type: 'Transactional DB', status: 'Syncing', lastIngested: '2023-10-27T09:30:00Z', ingestionVolume: 8.5, schema: [{field: 'order_total', type: 'number', description: 'Total value of an order'}] },
    { id: 'ds-5', name: 'Zendesk Tickets', type: 'Support Desk', status: 'Pending', lastIngested: new Date().toISOString(), ingestionVolume: 2.1, schema: [] },
    { id: 'ds-6', name: 'Snowflake DWH', type: 'Data Warehouse', status: 'Connected', lastIngested: '2023-10-27T08:00:00Z', ingestionVolume: 120.5, schema: [] },
];

const MOCK_SEGMENTS: AudienceSegment[] = [
    { id: 1, name: 'High-Value Customers', description: "Customers with LTV > $5,000 and at least 5 orders.", size: 12500, status: 'Active', createdAt: '2023-01-15T14:20:11Z', updatedAt: '2023-10-25T09:15:00Z', createdBy: 'admin@demobank.com', tags: ['Loyalty', 'VIP'], activationTargets: ['at-1', 'at-3'], definition: { id: 'root', combinator: 'AND', rules: [{ id: 'rule1', field: 'lifetime_value', operator: 'greater_than', value: 5000 }, { id: 'rule2', field: 'total_orders', operator: 'greater_than', value: 5 }] } },
    { id: 2, name: 'Churn Risk (Q4)', description: "Active users who haven't made a purchase in 90 days.", size: 3200, status: 'Active', createdAt: '2023-02-20T11:00:00Z', updatedAt: '2023-10-20T18:00:00Z', createdBy: 'marketing@demobank.com', tags: ['Retention'], activationTargets: ['at-2'], definition: { id: 'root', combinator: 'AND', rules: [{ id: 'rule1', field: 'last_purchase_date', operator: 'last_seen_before', value: '90_days_ago' }, { id: 'rule2', field: 'status', operator: 'equals', value: 'active' }] } },
    { id: 3, name: 'New Leads - West Coast', description: "Users who signed up in the last 30 days from CA, WA, OR.", size: 8500, status: 'Building', createdAt: '2023-10-01T10:00:00Z', updatedAt: '2023-10-26T12:00:00Z', createdBy: 'sales.ops@demobank.com', tags: ['Acquisition', 'Regional'], activationTargets: [], definition: { id: 'root', combinator: 'AND', rules: [{ id: 'rule1', field: 'signup_date', operator: 'last_seen_after', value: '30_days_ago' }, { id: 'rule2', field: 'state', operator: 'in_list', value: ['CA', 'WA', 'OR'] }] } },
    { id: 4, name: 'Engaged App Users', description: "Users who opened the app at least 10 times in the last month.", size: 25400, status: 'Active', createdAt: '2023-05-10T09:00:00Z', updatedAt: '2023-10-24T10:00:00Z', createdBy: 'product@demobank.com', tags: ['Engagement', 'Mobile'], activationTargets: ['at-3'], definition: { id: 'root', combinator: 'AND', rules: [] } },
    { id: 5, name: 'Cart Abandoners (Last 7 Days)', description: "Users who added to cart but did not purchase in the last week.", size: 11250, status: 'Active', createdAt: '2023-06-01T16:00:00Z', updatedAt: '2023-10-27T08:00:00Z', createdBy: 'ecommerce@demobank.com', tags: ['Retargeting'], activationTargets: ['at-1', 'at-2'], definition: { id: 'root', combinator: 'AND', rules: [] } },
    { id: 6, name: 'Archived - Q2 Promos', description: "Old segment for a past campaign.", size: 19800, status: 'Archived', createdAt: '2022-04-01T00:00:00Z', updatedAt: '2022-07-01T00:00:00Z', createdBy: 'admin@demobank.com', tags: [], activationTargets: [], definition: { id: 'root', combinator: 'AND', rules: [] } },
    { id: 7, name: 'Upcoming: Holiday Shoppers', description: "Segment for the upcoming holiday season.", size: 0, status: 'Draft', createdAt: '2023-10-26T15:00:00Z', updatedAt: '2023-10-26T15:00:00Z', createdBy: 'marketing@demobank.com', tags: ['Seasonal'], activationTargets: [], definition: { id: 'root', combinator: 'AND', rules: [] } },
];

const MOCK_PROFILES: CustomerProfile[] = Array.from({ length: 50 }, (_, i) => {
    const firstName = `User${i}`;
    const lastName = `Test${i}`;
    return {
        id: `user-${1000 + i}`, firstName, lastName, email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `+1-555-010-${i.toString().padStart(2, '0')}`,
        createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString(),
        lastSeen: new Date(Date.now() - Math.random() * 1e8).toISOString(),
        totalSpend: Math.random() * 10000,
        orderCount: Math.floor(Math.random() * 50),
        segments: [1, 5],
        attributes: { city: 'New York', country: 'USA', plan_type: i % 3 === 0 ? 'Premium' : 'Standard' },
        computedTraits: [
            { id: 'ct-1', name: 'Predictive LTV', value: Math.random() * 5000 + 500, lastCalculated: new Date().toISOString(), model_version: 'v1.2.0'},
            { id: 'ct-2', name: 'Churn Propensity', value: Math.random(), lastCalculated: new Date().toISOString(), model_version: 'v2.1.0'},
        ],
        consent: { marketing: true, analytics: true, personalization: false },
        timeline: [
            { id: `evt-${i}-1`, timestamp: new Date(Date.now() - Math.random() * 1e7).toISOString(), type: 'page_view', properties: { url: '/pricing' }, sourceId: 'ds-2' },
            { id: `evt-${i}-2`, timestamp: new Date(Date.now() - Math.random() * 1e8).toISOString(), type: 'purchase', properties: { amount: 99.99, items: 3 }, sourceId: 'ds-4' },
            { id: `evt-${i}-3`, timestamp: new Date(Date.now() - Math.random() * 1e9).toISOString(), type: 'app_open', properties: { version: '2.5.1' }, sourceId: 'ds-3' },
        ]
    }
});

const MOCK_METRICS: DashboardMetrics = {
    unifiedProfiles: 1_500_000,
    dataSources: 6,
    activeSegments: 25,
    eventsIngestedToday: 12_345_678,
    profileGrowth: Array.from({ length: 30 }, (_, i) => ({
        date: subDays(new Date(), 29 - i).toISOString().split('T')[0],
        value: 1_450_000 + i * 1500 + Math.random() * 10000,
    })),
    segmentSizeDistribution: MOCK_SEGMENTS.filter(s => s.status === 'Active').map(s => ({ name: s.name, value: s.size })),
    topEvents: [{name: 'page_view', count: 4500000}, {name: 'add_to_cart', count: 1200000}, {name: 'purchase', count: 850000}],
    recentActivity: [{type: 'Segment Update', description: 'High-Value Customers was updated by admin@', timestamp: new Date().toISOString()}]
};

// SECTION: HELPER UTILS & HOOKS
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
}

export const formatCompactNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
    return num.toString();
};

export const formatDate = (dateString: string): string => {
    return format(parseISO(dateString), 'MMM d, yyyy');
};

// SECTION: UI COMPONENTS
const Card: FC<{ title?: string; children: ReactNode; className?: string; }> = ({ title, children, className = '' }) => (
    <div className={`bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-lg ${className}`}>
        {title && <h3 className="text-lg font-semibold text-white p-4 border-b border-gray-700/50">{title}</h3>}
        <div className="p-4">{children}</div>
    </div>
);

const LineChart: FC<{ data: AnalyticsDataPoint[], width?: number, height?: number, color?: string }> = ({ data, width = 500, height = 200, color = 'cyan' }) => {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-gray-500">No data available</div>;

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min === 0 ? 1 : max - min;

    const points = data.map((d, i) => `${(i / (data.length - 1)) * chartWidth},${chartHeight - ((d.value - min) / range) * chartHeight}`).join(' ');
    
    const yLabels = Array.from({length: 5}, (_, i) => {
        const value = min + (range / 4) * i;
        const y = chartHeight - ((value - min) / range) * chartHeight;
        return { value, y };
    });

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <g transform={`translate(${padding}, ${padding})`}>
                {yLabels.map(({ value, y }, i) => (
                    <g key={i}>
                        <text x="-10" y={y + 5} textAnchor="end" className="text-xs fill-current text-gray-400">{formatCompactNumber(value)}</text>
                        <line x1="0" y1={y} x2={chartWidth} y2={y} className="stroke-current text-gray-700/50" strokeWidth="1" strokeDasharray="2,2" />
                    </g>
                ))}
                <text x="0" y={chartHeight + 20} textAnchor="start" className="text-xs fill-current text-gray-400">{formatDate(data[0].date)}</text>
                <text x={chartWidth} y={chartHeight + 20} textAnchor="end" className="text-xs fill-current text-gray-400">{formatDate(data[data.length - 1].date)}</text>
                <polyline fill="none" className={`stroke-current text-${color}-500`} strokeWidth="2" points={points} />
            </g>
        </svg>
    );
};

const BarChart: FC<{ data: { name: string; value: number }[], width?: number, height?: number, color?: string }> = ({ data, width = 500, height = 250, color = 'cyan' }) => {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-gray-500">No data available</div>;
    
    const padding = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const max = Math.max(...data.map(d => d.value));
    const barWidth = chartWidth / data.length;
    
    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <g transform={`translate(${padding.left}, ${padding.top})`}>
                {data.map((d, i) => (
                    <g key={d.name}>
                        <rect x={i * barWidth + barWidth * 0.1} y={chartHeight - (d.value / max) * chartHeight} width={barWidth * 0.8} height={(d.value / max) * chartHeight} className={`fill-current text-${color}-600 hover:text-${color}-500 transition-colors`} />
                        <text x={i * barWidth + barWidth / 2} y={chartHeight + 15} textAnchor="middle" className="text-xs fill-current text-gray-400 transform -rotate-45" transform={`rotate(-45, ${i * barWidth + barWidth / 2}, ${chartHeight + 15})`}>
                            {d.name.length > 15 ? `${d.name.substring(0, 12)}...` : d.name}
                        </text>
                    </g>
                ))}
            </g>
        </svg>
    );
};

const Pill: FC<{ text: string; color: 'green' | 'cyan' | 'gray' | 'yellow' | 'red' | 'blue' }> = ({ text, color }) => {
    const colorClasses = {
        green: 'bg-green-500/20 text-green-300', cyan: 'bg-cyan-500/20 text-cyan-300', gray: 'bg-gray-500/20 text-gray-300',
        yellow: 'bg-yellow-500/20 text-yellow-300', red: 'bg-red-500/20 text-red-300', blue: 'bg-blue-500/20 text-blue-300',
    };
    return <span className={`px-2 py-1 text-xs rounded-full font-medium ${colorClasses[color]}`}>{text}</span>;
};

const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;
    const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl', '2xl': 'max-w-4xl' };
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className={`bg-gray-800 rounded-lg shadow-2xl w-full border border-gray-700 ${sizeClasses[size]}`} onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

const AIAudienceBuilderModal: FC<{
    isOpen: boolean; onClose: () => void;
    onCreateSegment: (segmentData: Omit<AudienceSegment, 'id' | 'createdAt' | 'updatedAt' | 'size'>) => void;
}> = ({ isOpen, onClose, onCreateSegment }) => {
    const [prompt, setPrompt] = useState("High-value customers who haven't made a purchase in 3 months but have viewed the new product page.");
    const [generatedRules, setGeneratedRules] = useState<RuleGroup | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [segmentName, setSegmentName] = useState('');
    const [estimatedSize, setEstimatedSize] = useState<number | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true); setGeneratedRules(null); setEstimatedSize(null); setSegmentName('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = { type: Type.OBJECT, properties: { segmentName: { type: Type.STRING }, rules: { type: Type.OBJECT, properties: { combinator: { type: Type.STRING, enum: ['AND', 'OR'] }, rules: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, field: { type: Type.STRING }, operator: { type: Type.STRING }, value: { type: Type.ANY } } } } } } } };
            const fullPrompt = `Translate the following natural language description into a structured set of rules for a customer data platform audience segment. Provide a suitable name for the segment. Description: "${prompt}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            const result = JSON.parse(response.text);
            const rulesWithIds = { id: 'root', combinator: result.rules.combinator, rules: result.rules.rules.map((r: any, i: number) => ({ ...r, id: `rule-${i}` })) };
            setGeneratedRules(rulesWithIds);
            setSegmentName(result.segmentName);
            const size = await cdpApiService.estimateAudienceSize(rulesWithIds);
            setEstimatedSize(size);
        } catch (error) { console.error("AI Generation Error:", error); } finally { setIsLoading(false); }
    };
    
    const handleCreate = () => {
        if (!generatedRules || !segmentName) return;
        const newSegmentData = { name: segmentName, description: `AI-generated segment for: "${prompt}"`, status: 'Draft' as const, createdBy: 'ai-builder@demobank.com', definition: generatedRules, tags: ['AI-Generated'], activationTargets: [] };
        onCreateSegment(newSegmentData); onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="AI Audience Builder" size="xl">
            <div className="space-y-4">
                <p className="text-sm text-gray-400">Describe the customer segment you want to build in plain English. The AI will translate it into a structured ruleset.</p>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., 'Users from California who have spent more than $500 and visited the pricing page in the last 7 days'" className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">{isLoading ? 'Generating...' : 'Generate Rules'}</button>
                {(isLoading || generatedRules) && (
                    <Card title="Generated Segment">
                        <div className="space-y-4">
                            {isLoading ? <p className="text-sm text-gray-300">Generating rules and estimating audience size...</p> : (
                                <>
                                    <div className="flex justify-between items-center">
                                        <input type="text" value={segmentName} onChange={(e) => setSegmentName(e.target.value)} className="text-lg font-semibold bg-transparent text-white border-b border-gray-600 focus:outline-none focus:border-cyan-500" />
                                        <div className="text-right"><p className="text-xl font-bold text-white">{estimatedSize?.toLocaleString() ?? '...'}</p><p className="text-xs text-gray-400">Estimated Audience</p></div>
                                    </div>
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded">{JSON.stringify(generatedRules, null, 2)}</pre>
                                    <button onClick={handleCreate} disabled={!generatedRules || !segmentName} className="w-full py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50">Create Segment</button>
                                </>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </Modal>
    );
};

const MainDashboard: FC<{ metrics: DashboardMetrics | null; onOpenBuilder: () => void; }> = ({ metrics, onOpenBuilder }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white tracking-wider">CDP Dashboard</h2>
            <button onClick={onOpenBuilder} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium"><Icon svg={ICONS.magicWand} className="w-4 h-4"/>AI Audience Builder</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center"><p className="text-3xl font-bold text-white">{metrics ? formatCompactNumber(metrics.unifiedProfiles) : '...'}</p><p className="text-sm text-gray-400 mt-1">Unified Profiles</p></Card>
            <Card className="text-center"><p className="text-3xl font-bold text-white">{metrics ? formatCompactNumber(metrics.eventsIngestedToday) : '...'}</p><p className="text-sm text-gray-400 mt-1">Events Today</p></Card>
            <Card className="text-center"><p className="text-3xl font-bold text-white">{metrics ? metrics.dataSources : '...'}</p><p className="text-sm text-gray-400 mt-1">Data Sources</p></Card>
            <Card className="text-center"><p className="text-3xl font-bold text-white">{metrics ? metrics.activeSegments : '...'}</p><p className="text-sm text-gray-400 mt-1">Active Segments</p></Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Profile Growth (Last 30 Days)">{metrics ? <LineChart data={metrics.profileGrowth} height={250} /> : <div className="h-[250px] flex items-center justify-center">Loading...</div>}</Card>
            <Card title="Active Segment Size Distribution">{metrics ? <BarChart data={metrics.segmentSizeDistribution} height={250} /> : <div className="h-[250px] flex items-center justify-center">Loading...</div>}</Card>
        </div>
    </div>
);

const AudienceSegmentsTable: FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [segments, setSegments] = useState<AudienceSegment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        cdpApiService.getSegments().then(({ data }) => {
            setSegments(data);
            setIsLoading(false);
        });
    }, []);

    const getStatusPillColor = (status: AudienceSegment['status']) => ({ Active: 'green', Building: 'cyan', Archived: 'gray', Draft: 'yellow', Error: 'red' } as const)[status] || 'gray';

    return (
        <Card title="Audience Segments">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                     <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr>
                            <th className="px-6 py-3">Name</th><th className="px-6 py-3">Size</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Created At</th><th className="px-6 py-3">Tags</th><th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && <tr><td colSpan={6} className="text-center p-8">Loading segments...</td></tr>}
                        {!isLoading && segments.map(s => (
                            <tr key={s.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium text-white">{s.name}</td>
                                <td className="px-6 py-4">{s.size.toLocaleString()}</td>
                                <td className="px-6 py-4"><Pill text={s.status} color={getStatusPillColor(s.status)} /></td>
                                <td className="px-6 py-4">{formatDate(s.createdAt)}</td>
                                <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{s.tags.map(tag => <Pill key={tag} text={tag} color="gray" />)}</div></td>
                                <td className="px-6 py-4"><button onClick={() => onNavigate(`/segments/${s.id}`)} className="font-medium text-cyan-500 hover:underline">Details</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const SegmentDetailView: FC<{ segmentId: number; onNavigate: (path: string) => void; }> = ({ segmentId, onNavigate }) => {
    const [segment, setSegment] = useState<AudienceSegment | null>(null);
    const [analytics, setAnalytics] = useState<{ sizeHistory: AnalyticsDataPoint[] } | null>(null);
    const [status, setStatus] = useState<ApiStatus>('loading');

    useEffect(() => {
        const fetchSegmentData = async () => {
            setStatus('loading');
            try {
                const [segmentData, analyticsData] = await Promise.all([ cdpApiService.getSegmentById(segmentId), cdpApiService.getSegmentAnalytics(segmentId, '30d') ]);
                if (segmentData) { setSegment(segmentData); setAnalytics(analyticsData); setStatus('success'); } else { setStatus('error'); }
            } catch (error) { console.error("Failed to fetch segment details:", error); setStatus('error'); }
        };
        fetchSegmentData();
    }, [segmentId]);

    if (status === 'loading') return <div className="p-8 text-center">Loading segment details...</div>;
    if (status === 'error' || !segment) return <div className="p-8 text-center text-red-400">Failed to load segment. <button onClick={() => onNavigate('/segments')} className="underline">Go back</button>.</div>;

    return (
        <div className="space-y-6">
            <div>
                <button onClick={() => onNavigate('/segments')} className="text-cyan-400 hover:text-cyan-300 mb-4">&larr; Back to all segments</button>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-white">{segment.name}</h2>
                        <p className="text-gray-400 mt-1">{segment.description}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"><Icon svg={ICONS.edit} className="w-4 h-4"/> Edit</button>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"><Icon svg={ICONS.copy} className="w-4 h-4"/> Clone</button>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-red-500/50 hover:bg-red-500/20 text-red-400 rounded-lg text-sm"><Icon svg={ICONS.trash} className="w-4 h-4"/> Delete</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-2xl font-bold text-white">{segment.size.toLocaleString()}</p><p className="text-sm text-gray-400 mt-1">Current Size</p></Card>
                <Card className="text-center"><p className="text-2xl font-bold text-white">{segment.status}</p><p className="text-sm text-gray-400 mt-1">Status</p></Card>
                <Card className="text-center"><p className="text-2xl font-bold text-white">{formatDate(segment.createdAt)}</p><p className="text-sm text-gray-400 mt-1">Created On</p></Card>
                <Card className="text-center"><p className="text-2xl font-bold text-white">{segment.activationTargets.length}</p><p className="text-sm text-gray-400 mt-1">Activations</p></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><Card title="Size History (Last 30 Days)">{analytics ? <LineChart data={analytics.sizeHistory} height={300} /> : "Loading..."}</Card></div>
                <div className="space-y-6">
                     <Card title="Details">
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between"><span className="text-gray-400">Created By:</span><span className="text-white font-mono">{segment.createdBy}</span></li>
                             <li className="flex justify-between"><span className="text-gray-400">Last Updated:</span><span className="text-white">{formatDate(segment.updatedAt)}</span></li>
                        </ul>
                    </Card>
                     <Card title="Activation Targets">{segment.activationTargets.length > 0 ? (<ul className="space-y-2 text-sm">{segment.activationTargets.map(target => <li key={target} className="text-white">{target}</li>)}</ul>) : (<p className="text-sm text-gray-500">No activation targets configured.</p>)}</Card>
                </div>
            </div>
            <Card title="Segment Definition"><pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded">{JSON.stringify(segment.definition, null, 2)}</pre></Card>
        </div>
    );
};

const DataSourcesView: FC = () => {
    const [sources, setSources] = useState<DataSource[]>([]);
    useEffect(() => { cdpApiService.getDataSources().then(setSources); }, []);
    
    const getStatusPillColor = (status: DataSource['status']) => ({ Connected: 'green', Syncing: 'cyan', Error: 'red', Pending: 'yellow' } as const)[status] || 'gray';

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Data Sources</h2>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sources.map(source => (
                        <div key={source.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-white">{source.name}</h4>
                                <Pill text={source.status} color={getStatusPillColor(source.status)} />
                            </div>
                            <p className="text-sm text-gray-400">{source.type}</p>
                            <div className="mt-4 text-xs text-gray-300 space-y-1">
                                <p>Last Ingested: {formatDate(source.lastIngested)}</p>
                                <p>Volume: {source.ingestionVolume} GB/month</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const ProfileDetailView: FC<{ profileId: string, onNavigate: (path: string) => void }> = ({ profileId, onNavigate }) => {
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    useEffect(() => { cdpApiService.getProfileById(profileId).then(p => setProfile(p || null)); }, [profileId]);

    if (!profile) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="space-y-6">
            <button onClick={() => onNavigate('/profiles')} className="text-cyan-400 hover:text-cyan-300 mb-4">&larr; Back to Profiles</button>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-cyan-800 rounded-full flex items-center justify-center text-2xl font-bold text-cyan-200">
                    {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{profile.firstName} {profile.lastName}</h2>
                    <p className="text-gray-400">{profile.email}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Key Attributes">
                        <ul className="text-sm space-y-2">
                            <li className="flex justify-between"><span className="text-gray-400">Total Spend</span><span className="font-mono text-white">${profile.totalSpend.toFixed(2)}</span></li>
                            <li className="flex justify-between"><span className="text-gray-400">Total Orders</span><span className="font-mono text-white">{profile.orderCount}</span></li>
                            <li className="flex justify-between"><span className="text-gray-400">Last Seen</span><span className="font-mono text-white">{formatDate(profile.lastSeen)}</span></li>
                        </ul>
                    </Card>
                    <Card title="Segments">
                        <div className="flex flex-wrap gap-2">
                            {profile.segments.map(id => <Pill key={id} text={`Segment ${id}`} color="blue" />)}
                        </div>
                    </Card>
                    <Card title="Computed Traits">
                         <ul className="text-sm space-y-3">
                            {profile.computedTraits.map(trait => (
                                <li key={trait.id}>
                                    <div className="flex justify-between text-gray-300">
                                        <span>{trait.name}</span>
                                        <span className="font-mono text-white">{typeof trait.value === 'number' ? trait.value.toFixed(2) : trait.value}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Model: {trait.model_version}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="Customer Timeline">
                        <ul className="space-y-4">
                           {profile.timeline.map(event => (
                               <li key={event.id} className="flex gap-4">
                                   <div className="text-xs text-gray-400 w-24 text-right">
                                       <p>{format(parseISO(event.timestamp), 'MMM d')}</p>
                                       <p>{format(parseISO(event.timestamp), 'h:mm a')}</p>
                                   </div>
                                   <div className="relative">
                                       <div className="w-3 h-3 bg-cyan-500 rounded-full absolute top-1 -left-[22px] border-2 border-gray-800"></div>
                                       <div className="pl-4 border-l border-gray-700">
                                           <p className="font-semibold text-white">{event.type}</p>
                                           <pre className="text-xs text-gray-400 font-mono bg-gray-900/50 p-2 rounded mt-1">{JSON.stringify(event.properties, null, 2)}</pre>
                                       </div>
                                   </div>
                               </li>
                           ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const ProfileSearchView: FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CustomerProfile[]>([]);
    const [status, setStatus] = useState<ApiStatus>('idle');
    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        if (debouncedQuery) {
            setStatus('loading');
            cdpApiService.searchProfiles(debouncedQuery).then(res => {
                setResults(res);
                setStatus('success');
            });
        } else {
            setResults([]);
            setStatus('idle');
        }
    }, [debouncedQuery]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Customer Profiles</h2>
            <div className="relative">
                <input 
                    type="text" 
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pl-10 text-white focus:ring-cyan-500 focus:border-cyan-500"
                />
                <Icon svg={ICONS.search} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            
            {status === 'loading' && <p>Searching...</p>}
            {status === 'success' && results.length > 0 && (
                <Card>
                    <ul>
                        {results.map(profile => (
                            <li key={profile.id} className="p-2 border-b border-gray-700 hover:bg-gray-800/50 cursor-pointer" onClick={() => onNavigate(`/profiles/${profile.id}`)}>
                                <p className="font-semibold text-white">{profile.firstName} {profile.lastName}</p>
                                <p className="text-sm text-gray-400">{profile.email}</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
             {status === 'success' && results.length === 0 && <p>No results found.</p>}
        </div>
    );
};


// SECTION: MAIN COMPONENT
const DemoBankCDPView: React.FC = () => {
    const [route, setRoute] = useState('/dashboard'); // Simple router state
    const [isBuilderOpen, setBuilderOpen] = useState(false);
    const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);

    const onNavigate = (path: string) => setRoute(path);

    useEffect(() => {
        if (route === '/dashboard') {
            cdpApiService.getDashboardMetrics().then(setDashboardMetrics);
        }
    }, [route]);

    const handleCreateSegment = async (segmentData: Omit<AudienceSegment, 'id' | 'createdAt' | 'updatedAt' | 'size'>) => {
        try {
            const newSegment = await cdpApiService.createSegment(segmentData);
            onNavigate(`/segments/${newSegment.id}`);
        } catch (error) { console.error("Failed to create segment:", error); }
    };
    
    const renderCurrentView = () => {
        if (route.startsWith('/segments/')) {
            const id = parseInt(route.split('/')[2]);
            return <SegmentDetailView segmentId={id} onNavigate={onNavigate} />;
        }
        if (route.startsWith('/profiles/')) {
            const id = route.split('/')[2];
            return <ProfileDetailView profileId={id} onNavigate={onNavigate} />;
        }
        switch (route) {
            case '/dashboard': return <MainDashboard metrics={dashboardMetrics} onOpenBuilder={() => setBuilderOpen(true)} />;
            case '/segments': return <AudienceSegmentsTable onNavigate={onNavigate} />;
            case '/profiles': return <ProfileSearchView onNavigate={onNavigate} />;
            case '/datasources': return <DataSourcesView />;
            default: return <h2 className="text-white">Page Not Found</h2>;
        }
    };
    
    const NAV_ITEMS = [
        { path: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
        { path: '/segments', label: 'Segments', icon: ICONS.segments },
        { path: '/profiles', label: 'Profiles', icon: ICONS.profiles },
        { path: '/datasources', label: 'Data Sources', icon: ICONS.datasources },
        { path: '/journeys', label: 'Journeys', icon: ICONS.journeys },
        { path: '/activations', label: 'Activations', icon: ICONS.activations },
        { path: '/settings', label: 'Settings', icon: ICONS.settings },
    ];

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen flex font-sans">
            <nav className="w-64 bg-gray-800/30 border-r border-gray-700/50 p-4 flex flex-col">
                <h1 className="text-xl font-bold text-white mb-8">DemoBank CDP</h1>
                <ul className="space-y-2">
                    {NAV_ITEMS.map(item => (
                        <li key={item.path}>
                            <a href="#" onClick={(e) => {e.preventDefault(); onNavigate(item.path)}} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route.startsWith(item.path) ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700/50'}`}>
                                <Icon svg={item.icon} className="w-5 h-5" />
                                <span>{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="flex-1 p-8 overflow-y-auto">
                {renderCurrentView()}
            </main>
            <AIAudienceBuilderModal isOpen={isBuilderOpen} onClose={() => setBuilderOpen(false)} onCreateSegment={handleCreateSegment} />
        </div>
    );
};

export default DemoBankCDPView;
```