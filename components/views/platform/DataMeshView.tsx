// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DataMeshView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext, ReactNode, Reducer, useReducer, FC } from 'react';
import Card from '../../Card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    RadialBarChart,
    RadialBar,
    PolarAngleAxis
} from 'recharts';
import ReactFlow, { MiniMap, Controls, Background, Node, Edge, Position } from 'reactflow';
import 'reactflow/dist/style.css';


// SECTION: Types and Interfaces
// =================================================================================

export type DataProductLifecycleStatus = 'DRAFT' | 'PUBLISHED' | 'DEPRECATED' | 'RETIRED';
export type PortType = 'input' | 'output';
export type DataType = 'string' | 'integer' | 'float' | 'boolean' | 'timestamp' | 'json' | 'binary' | 'struct';
export type ComplianceTag = 'PII' | 'Confidential' | 'Sensitive' | 'Public' | 'PCI' | 'GDPR';
export type DataQualitySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ChangeType = 'SCHEMA_CHANGE' | 'SLA_UPDATE' | 'OWNER_CHANGE' | 'NEW_VERSION' | 'CONTRACT_UPDATE';
export type UserRole = 'ADMIN' | 'OWNER' | 'CONSUMER' | 'GUEST';

export interface Owner {
    id: string;
    name: string;
    email: string;
    team: string;
}

export interface Domain {
    id: string;
    name: string;
    description: string;
    owner: Owner;
}

export interface SchemaField {
    name: string;
    type: DataType;
    description: string;
    nullable: boolean;
    tags?: ComplianceTag[];
    nestedFields?: SchemaField[];
}

export interface Port {
    id: string;
    name: string;
    type: PortType;
    description: string;
    schema: SchemaField[];
    format: 'JSON' | 'AVRO' | 'PARQUET' | 'CSV' | 'DELTA';
    location: string; // e.g., S3 URI, Kafka topic, API endpoint
}

export interface SLA {
    freshness: string; // e.g., '1 hour', '24 hours'
    uptime: number; // e.g., 99.9
    supportResponseTime: string; // e.g., '4 business hours'
}

export interface CostBreakdown {
    compute: number;
    storage: number;
    processing: number;
    egress: number;
}

export interface ServiceLevelObjective {
    id: string;
    description: string;
    metric: string;
    target: number;
    actual: number;
}

export interface DataContract {
    version: string;
    schemaVersion: string;
    serviceLevelObjectives: ServiceLevelObjective[];
    qualityGates: DataQualityMetric[];
}

export interface DataQualityMetric {
    id: string;
    metricName: string; // e.g., 'Completeness', 'Uniqueness', 'Validity'
    value: number; // e.g., 0.98 (98%)
    threshold: number;
    lastChecked: string;
    description: string;
}

export interface DataQualityIssue {
    id:string;
    description: string;
    severity: DataQualitySeverity;
    detectedAt: string;
    resolvedAt?: string;
    assignedTo?: Owner;
}

export interface VersionHistory {
    version: string;
    date: string;
    author: string;
    summary: string;
    changes: { type: ChangeType; description: string }[];
}

export interface AccessControlPolicy {
    role: string;
    permissions: ('READ' | 'WRITE' | 'CONSUME' | 'MANAGE')[];
}

export interface DataProduct {
    id: string;
    name: string;
    domain: Domain;
    description: string;
    owner: Owner;
    status: DataProductLifecycleStatus;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    inputPorts: Port[];
    outputPorts: Port[];
    dependencies: string[]; // Array of DataProduct IDs
    dependents: string[]; // Array of DataProduct IDs
    sla: SLA;
    dataQualityScore: number;
    qualityMetrics: DataQualityMetric[];
    qualityIssues: DataQualityIssue[];
    version: string;
    versionHistory: VersionHistory[];
    accessControl: AccessControlPolicy[];
    documentationLink: string;
    cost: CostBreakdown;
    contract?: DataContract;
}

// SECTION: Mock Data and API Layer
// =================================================================================

const MOCK_OWNERS: Owner[] = [
    { id: 'owner-1', name: 'Alice Johnson', email: 'alice.j@example.com', team: 'Marketing Analytics' },
    { id: 'owner-2', name: 'Bob Williams', email: 'bob.w@example.com', team: 'Finance BI' },
    { id: 'owner-3', name: 'Charlie Brown', email: 'charlie.b@example.com', team: 'Sales Operations' },
    { id: 'owner-4', name: 'Diana Prince', email: 'diana.p@example.com', team: 'Product Insights' },
    { id: 'owner-5', name: 'Ethan Hunt', email: 'ethan.h@example.com', team: 'Infrastructure Engineering' },
    { id: 'owner-6', name: 'Fiona Glenanne', email: 'fiona.g@example.com', team: 'Risk & Compliance' },
];

const MOCK_DOMAINS: Domain[] = [
    { id: 'domain-1', name: 'Marketing', description: 'Data products related to marketing campaigns, customer engagement, and lead generation.', owner: MOCK_OWNERS[0] },
    { id: 'domain-2', name: 'Finance', description: 'Core financial data, including revenue, expenses, and forecasts.', owner: MOCK_OWNERS[1] },
    { id: 'domain-3', name: 'Sales', description: 'Sales performance, CRM data, and customer account information.', owner: MOCK_OWNERS[2] },
    { id: 'domain-4', name: 'Product', description: 'User behavior, product features, and application telemetry.', owner: MOCK_OWNERS[3] },
    { id: 'domain-5', name: 'Core Infrastructure', description: 'Platform-level data about system health and performance.', owner: MOCK_OWNERS[4] },
    { id: 'domain-6', name: 'Risk', description: 'Data products for fraud detection, compliance, and risk modeling.', owner: MOCK_OWNERS[5] },
];

const MOCK_DATA_PRODUCTS: DataProduct[] = [
    {
        id: 'dp-001',
        name: 'Customer 360 View',
        domain: MOCK_DOMAINS[0],
        description: 'A comprehensive, aggregated view of customer interactions across all touchpoints.',
        owner: MOCK_OWNERS[0],
        status: 'PUBLISHED',
        tags: ['customer', 'analytics', 'golden-record', 'pii'],
        createdAt: '2023-01-15T09:30:00Z',
        updatedAt: '2023-10-28T14:00:00Z',
        inputPorts: [],
        outputPorts: [{
            id: 'port-1-out', name: 'Customer360-Parquet-S3', type: 'output', description: 'Daily snapshot of the C360 view in Parquet format.',
            schema: [
                { name: 'customer_id', type: 'string', description: 'Unique customer identifier', nullable: false, tags: ['PII'] },
                { name: 'full_name', type: 'string', description: 'Customer full name', nullable: false, tags: ['PII'] },
                { name: 'email', type: 'string', description: 'Customer email address', nullable: true, tags: ['PII', 'GDPR'] },
                { name: 'first_seen_date', type: 'timestamp', description: 'Date of first interaction', nullable: false },
                { name: 'last_seen_date', type: 'timestamp', description: 'Date of most recent interaction', nullable: false },
                { name: 'total_orders', type: 'integer', description: 'Total number of orders placed', nullable: false },
                { name: 'lifetime_value', type: 'float', description: 'Predicted customer lifetime value', nullable: true },
                {
                    name: 'address', type: 'struct', description: 'Customer primary address', nullable: true, tags: ['PII'],
                    nestedFields: [
                        { name: 'street', type: 'string', description: 'Street address', nullable: true },
                        { name: 'city', type: 'string', description: 'City', nullable: true },
                        { name: 'zip_code', type: 'string', description: 'ZIP code', nullable: true },
                    ]
                }
            ],
            format: 'PARQUET', location: 's3://data-mesh-prod/marketing/customer_360/'
        }],
        dependencies: ['dp-003', 'dp-005'], dependents: ['dp-002', 'dp-006'],
        sla: { freshness: '24 hours', uptime: 99.9, supportResponseTime: '8 business hours' },
        dataQualityScore: 0.98,
        qualityMetrics: [
            { id: 'qm-1', metricName: 'Completeness', value: 0.99, threshold: 0.95, lastChecked: '2023-11-10T08:00:00Z', description: 'All required fields are present.' },
            { id: 'qm-2', metricName: 'Uniqueness (customer_id)', value: 1.0, threshold: 1.0, lastChecked: '2023-11-10T08:00:00Z', description: 'No duplicate customer IDs.' }
        ],
        qualityIssues: [], version: '2.1.0',
        versionHistory: [
            { version: '2.1.0', date: '2023-10-28', author: 'Alice Johnson', summary: 'Added lifetime_value field.', changes: [{ type: 'SCHEMA_CHANGE', description: 'Added `lifetime_value` (float) to output port.' }] },
            { version: '2.0.0', date: '2023-09-01', author: 'Alice Johnson', summary: 'Major schema refactor for performance.', changes: [{ type: 'SCHEMA_CHANGE', description: 'Changed address from string to nested JSON.' }] }
        ],
        accessControl: [{ role: 'Marketing Analysts', permissions: ['CONSUME'] }, { role: 'BI Team', permissions: ['CONSUME'] }, {role: 'Data Product Admins', permissions: ['MANAGE']}],
        documentationLink: 'https://confluence.example.com/display/DATA/Customer+360+View',
        cost: { compute: 500, storage: 650.50, processing: 50, egress: 0 }
    },
    {
        id: 'dp-002', name: 'Quarterly Revenue Forecast', domain: MOCK_DOMAINS[1], description: 'Predictive model output for the upcoming quarter\'s revenue.',
        owner: MOCK_OWNERS[1], status: 'PUBLISHED', tags: ['finance', 'forecasting', 'revenue', 'critical'], createdAt: '2023-02-20T11:00:00Z', updatedAt: '2023-11-01T10:00:00Z',
        inputPorts: [{ id: 'port-2-in', name: 'Customer360-Consumer', type: 'input', description: 'Consumes the daily C360 view.', schema: [], format: 'PARQUET', location: 's3://data-mesh-prod/marketing/customer_360/' }],
        outputPorts: [{
            id: 'port-2-out', name: 'Forecast-CSV-S3', type: 'output', description: 'CSV file with product-level revenue forecasts.',
            schema: [
                { name: 'product_sku', type: 'string', description: 'Product SKU', nullable: false },
                { name: 'forecast_date', type: 'timestamp', description: 'Date of the forecast', nullable: false },
                { name: 'predicted_revenue', type: 'float', description: 'Predicted revenue amount in USD', nullable: false },
                { name: 'confidence_interval_low', type: 'float', description: 'Lower bound of the 95% confidence interval', nullable: false },
                { name: 'confidence_interval_high', type: 'float', description: 'Upper bound of the 95% confidence interval', nullable: false },
            ],
            format: 'CSV', location: 's3://data-mesh-prod/finance/quarterly_forecast/'
        }],
        dependencies: ['dp-001'], dependents: [],
        sla: { freshness: '90 days', uptime: 99.5, supportResponseTime: '24 business hours' },
        dataQualityScore: 0.92,
        qualityMetrics: [{ id: 'qm-3', metricName: 'Timeliness', value: 0.95, threshold: 0.9, lastChecked: '2023-11-01T09:00:00Z', description: 'Forecast is generated on schedule.' }],
        qualityIssues: [{ id: 'qi-1', description: 'Revenue prediction for SKU X-123 seems abnormally high.', severity: 'MEDIUM', detectedAt: '2023-11-02T14:00:00Z', assignedTo: MOCK_OWNERS[1] }],
        version: '1.3.2',
        versionHistory: [{ version: '1.3.2', date: '2023-11-01', author: 'Bob Williams', summary: 'Updated model algorithm for seasonality.', changes: [{ type: 'NEW_VERSION', description: 'Deployed new forecasting model v2.4.' }] }],
        accessControl: [{ role: 'Finance Leadership', permissions: ['CONSUME'] }],
        documentationLink: 'https://confluence.example.com/display/DATA/Quarterly+Revenue+Forecast',
        cost: { compute: 200, storage: 50, processing: 200, egress: 0 }
    },
    {
        id: 'dp-003', name: 'CRM Contact Data', domain: MOCK_DOMAINS[2], description: 'Raw export of contact information from the corporate CRM system.',
        owner: MOCK_OWNERS[2], status: 'DEPRECATED', tags: ['crm', 'sales', 'raw-data', 'pii'], createdAt: '2022-05-10T18:00:00Z', updatedAt: '2023-09-15T12:00:00Z',
        inputPorts: [], outputPorts: [], dependencies: [], dependents: ['dp-001'],
        sla: { freshness: '12 hours', uptime: 99.99, supportResponseTime: '4 business hours' },
        dataQualityScore: 0.75, qualityMetrics: [],
        qualityIssues: [{ id: 'qi-2', description: 'High percentage of null values in `phone_number` field.', severity: 'HIGH', detectedAt: '2023-08-01T10:00:00Z' }],
        version: '3.0.0', versionHistory: [], accessControl: [],
        documentationLink: 'https://confluence.example.com/display/DATA/CRM+Contact+Data',
        cost: { compute: 50, storage: 200, processing: 0, egress: 0 }
    },
    {
        id: 'dp-004', name: 'App Clickstream Events', domain: MOCK_DOMAINS[3], description: 'Real-time stream of user interaction events from the mobile and web applications.',
        owner: MOCK_OWNERS[3], status: 'PUBLISHED', tags: ['product', 'events', 'real-time', 'kafka'], createdAt: '2023-06-01T00:00:00Z', updatedAt: '2023-11-05T18:30:00Z',
        inputPorts: [],
        outputPorts: [{
            id: 'port-4-out', name: 'Clickstream-Kafka-Topic', type: 'output', description: 'Kafka topic with AVRO-formatted clickstream events.',
            schema: [
                { name: 'event_id', type: 'string', description: 'Unique event identifier', nullable: false },
                { name: 'user_id', type: 'string', description: 'User identifier', nullable: true, tags: ['PII'] },
                { name: 'session_id', type: 'string', description: 'Session identifier', nullable: false },
                { name: 'event_timestamp', type: 'timestamp', description: 'Timestamp of the event', nullable: false },
                { name: 'event_type', type: 'string', description: 'Type of event (e.g., page_view, click, purchase)', nullable: false },
                { name: 'payload', type: 'json', description: 'JSON object with event-specific data', nullable: true },
            ],
            format: 'AVRO', location: 'kafka://kafka-prod-bus/topics/app_clickstream'
        }],
        dependencies: [], dependents: ['dp-005'],
        sla: { freshness: '1 second', uptime: 99.95, supportResponseTime: '2 business hours' },
        dataQualityScore: 0.99, qualityMetrics: [], qualityIssues: [], version: '1.0.0',
        versionHistory: [{ version: '1.0.0', date: '2023-06-01', author: 'Diana Prince', summary: 'Initial release of the event stream.', changes: [{ type: 'NEW_VERSION', description: 'First published version.' }] }],
        accessControl: [{ role: 'Product Analytics', permissions: ['CONSUME'] }],
        documentationLink: 'https://confluence.example.com/display/DATA/App+Clickstream+Events',
        cost: { compute: 1500, storage: 500, processing: 1500, egress: 0.75 }
    },
    {
        id: 'dp-005', name: 'User Session Aggregates', domain: MOCK_DOMAINS[3], description: 'Hourly aggregated user session data derived from the clickstream.',
        owner: MOCK_OWNERS[3], status: 'DRAFT', tags: ['product', 'analytics', 'aggregates'], createdAt: '2023-10-10T10:10:10Z', updatedAt: '2023-11-09T17:00:00Z',
        inputPorts: [{ id: 'port-5-in', name: 'Clickstream-Consumer', type: 'input', description: 'Consumes the real-time clickstream topic.', schema: [], format: 'AVRO', location: 'kafka://kafka-prod-bus/topics/app_clickstream' }],
        outputPorts: [], dependencies: ['dp-004'], dependents: ['dp-001'],
        sla: { freshness: '1 hour', uptime: 99.9, supportResponseTime: '8 business hours' },
        dataQualityScore: 0.0, qualityMetrics: [], qualityIssues: [],
        version: '0.1.0', versionHistory: [], accessControl: [], documentationLink: '',
        cost: { compute: 400, storage: 200, processing: 200, egress: 0 }
    },
    {
        id: 'dp-006', name: 'Marketing Campaign Performance', domain: MOCK_DOMAINS[0], description: 'Aggregated metrics on marketing campaign performance, including CTR, CPC, and conversion rates.',
        owner: MOCK_OWNERS[0], status: 'PUBLISHED', tags: ['marketing', 'performance', 'analytics'], createdAt: '2023-03-12T14:00:00Z', updatedAt: '2023-11-08T11:20:00Z',
        inputPorts: [], outputPorts: [], dependencies: ['dp-001'], dependents: [],
        sla: { freshness: '24 hours', uptime: 99.8, supportResponseTime: '12 business hours' },
        dataQualityScore: 0.95, qualityMetrics: [], qualityIssues: [],
        version: '1.5.0', versionHistory: [], accessControl: [{ role: 'Marketing Team', permissions: ['CONSUME'] }],
        documentationLink: 'https://confluence.example.com/display/DATA/Campaign+Performance',
        cost: { compute: 150, storage: 100, processing: 50, egress: 0 }
    },
    {
        id: 'dp-007', name: 'Server Health Metrics', domain: MOCK_DOMAINS[4], description: 'Time-series data of CPU, memory, and disk usage across all production servers.',
        owner: MOCK_OWNERS[4], status: 'PUBLISHED', tags: ['infrastructure', 'monitoring', 'observability'], createdAt: '2022-11-01T00:00:00Z', updatedAt: '2023-11-10T23:59:59Z',
        inputPorts: [], outputPorts: [], dependencies: [], dependents: [],
        sla: { freshness: '1 minute', uptime: 99.99, supportResponseTime: '1 business hour' },
        dataQualityScore: 0.999, qualityMetrics: [], qualityIssues: [],
        version: '2.0.1', versionHistory: [], accessControl: [{ role: 'SRE Team', permissions: ['CONSUME'] }],
        documentationLink: 'https://confluence.example.com/display/DATA/Server+Health+Metrics',
        cost: { compute: 800, storage: 2000, processing: 200, egress: 100 }
    },
    {
        id: 'dp-008', name: 'Transaction Fraud Score', domain: MOCK_DOMAINS[5], description: 'Real-time fraud score for financial transactions, generated by a machine learning model.',
        owner: MOCK_OWNERS[5], status: 'PUBLISHED', tags: ['risk', 'fraud-detection', 'ml', 'real-time'], createdAt: '2023-08-15T12:00:00Z', updatedAt: '2023-10-30T16:45:00Z',
        inputPorts: [], outputPorts: [], dependencies: [], dependents: [],
        sla: { freshness: '200 milliseconds', uptime: 99.98, supportResponseTime: '30 minutes' },
        dataQualityScore: 0.97, qualityMetrics: [], qualityIssues: [],
        version: '1.2.0', versionHistory: [], accessControl: [{ role: 'Payments API', permissions: ['CONSUME'] }],
        documentationLink: 'https://confluence.example.com/display/DATA/Transaction+Fraud+Score',
        cost: { compute: 2500, storage: 100, processing: 4000, egress: 50 }
    },
    {
        id: 'dp-009', name: 'Archived User Profiles', domain: MOCK_DOMAINS[2], description: 'Cold storage of user profiles for accounts that have been inactive for over 5 years.',
        owner: MOCK_OWNERS[2], status: 'RETIRED', tags: ['archive', 'pii', 'gdpr'], createdAt: '2021-01-01T00:00:00Z', updatedAt: '2023-07-01T00:00:00Z',
        inputPorts: [], outputPorts: [], dependencies: [], dependents: [],
        sla: { freshness: 'N/A', uptime: 99.0, supportResponseTime: '5 business days' },
        dataQualityScore: 0.80, qualityMetrics: [], qualityIssues: [],
        version: '1.0.0', versionHistory: [], accessControl: [{ role: 'Legal Team', permissions: ['READ'] }],
        documentationLink: 'https://confluence.example.com/display/DATA/Archived+User+Profiles',
        cost: { compute: 0, storage: 5000, processing: 0, egress: 0 }
    },
];

export const mockApi = {
    fetchDataProducts: async (): Promise<DataProduct[]> => new Promise(resolve => setTimeout(() => resolve(MOCK_DATA_PRODUCTS), 1000)),
    fetchDomains: async (): Promise<Domain[]> => new Promise(resolve => setTimeout(() => resolve(MOCK_DOMAINS), 500)),
    fetchOwners: async (): Promise<Owner[]> => new Promise(resolve => setTimeout(() => resolve(MOCK_OWNERS), 500)),
    fetchDataProductById: async (id: string): Promise<DataProduct | undefined> => new Promise(resolve => setTimeout(() => resolve(MOCK_DATA_PRODUCTS.find(dp => dp.id === id)), 700)),
};

// SECTION: AI Service (Mock)
// =================================================================================

export const aiService = {
    generateSummary: async (description: string): Promise<string> => {
        return new Promise(resolve => setTimeout(() => resolve(
            `This data product provides a critical, comprehensive view of ${description.toLowerCase().substring(0, 30)}... It is primarily consumed by teams requiring up-to-date information for strategic decision-making. Key attributes include high-frequency updates and strong data quality guarantees, making it a reliable source for downstream analytical models and operational dashboards.`
        ), 1200));
    },
    getQueryInsights: async (query: string, products: DataProduct[]): Promise<string> => {
         if (query.toLowerCase().includes('pii')) {
             const piiProducts = products.filter(p => JSON.stringify(p.outputPorts).includes('PII'));
             return `I found ${piiProducts.length} data products containing PII. These include: ${piiProducts.map(p => p.name).join(', ')}. Please handle this data with care according to company policy.`;
         }
         if (query.toLowerCase().includes('cost')) {
             return `I can help with cost analysis. Are you interested in the most expensive data products, or costs by domain?`;
         }
         if (query.toLowerCase().includes('deprecated')) {
             const depProducts = products.filter(p => p.status === 'DEPRECATED');
             return `There are ${depProducts.length} deprecated products. These should not be used for new development. They are: ${depProducts.map(p => p.name).join(', ')}.`;
         }
         return new Promise(resolve => setTimeout(() => resolve(
             `I'm sorry, I'm still learning. I can help you find products with PII, analyze costs, or list deprecated products. Try asking "show me products with PII".`
         ), 800));
    },
    generateLineageSummary: async (product: DataProduct, allProducts: DataProduct[]): Promise<string> => {
        const upstreamCount = product.dependencies.length;
        const downstreamCount = product.dependents.length;
        const upstreamNames = product.dependencies.map(id => allProducts.find(p => p.id === id)?.name).filter(Boolean).join(', ');
        
        return new Promise(resolve => setTimeout(() => resolve(
            `"${product.name}" is a key node in the data mesh. It consumes data from ${upstreamCount} upstream source(s) including ${upstreamNames}. It serves as a foundational dataset for ${downstreamCount} downstream consumer(s). Any changes to this product could have a significant ripple effect on business intelligence and operations.`
        ), 1500));
    }
};

// SECTION: UI Utility Components
// =================================================================================

export const Spinner: FC = () => (
    <div className="flex justify-center items-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
);

export const Badge: FC<{ color: string; children: ReactNode }> = ({ color, children }) => (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{children}</span>
);

export const StatusBadge: FC<{ status: DataProductLifecycleStatus }> = ({ status }) => {
    const statusMap: Record<DataProductLifecycleStatus, { text: string; color: string }> = {
        PUBLISHED: { text: 'Published', color: 'bg-green-500/20 text-green-300' },
        DRAFT: { text: 'Draft', color: 'bg-yellow-500/20 text-yellow-300' },
        DEPRECATED: { text: 'Deprecated', color: 'bg-orange-500/20 text-orange-300' },
        RETIRED: { text: 'Retired', color: 'bg-red-500/20 text-red-300' },
    };
    const { text, color } = statusMap[status];
    return <Badge color={color}>{text}</Badge>;
};

export const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode, size?: 'xl' | '2xl' | '4xl' | '6xl' }> = ({ isOpen, onClose, title, children, size='4xl' }) => {
    if (!isOpen) return null;
    const sizeClasses = { 'xl': 'max-w-xl', '2xl': 'max-w-2xl', '4xl': 'max-w-4xl', '6xl': 'max-w-6xl'};
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={onClose}>
            <div className={`bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export const Tooltip: FC<{ text: string; children: ReactNode }> = ({ text, children }) => (
    <div className="relative group">
        {children}
        <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">{text}</div>
    </div>
);

// SECTION: SVG Icons
// =================================================================================

export const SearchIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
export const GridIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>);
export const ListIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
export const ExternalLinkIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>);
export const BotIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4zm0 10a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2h4zm8-10a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V5a2 2 0 012-2h4zm0 10a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4a2 2 0 012-2h4z" /></svg>);

// SECTION: Data Product Sub-Components
// =================================================================================

export const DataProductCard: FC<{ product: DataProduct; onSelect: (product: DataProduct) => void }> = ({ product, onSelect }) => (
    <div onClick={() => onSelect(product)} className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-colors duration-200 flex flex-col justify-between h-full">
        <div>
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-blue-400 mb-1">{product.name}</h3>
                <StatusBadge status={product.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">Domain: <span className="font-semibold text-gray-300">{product.domain.name}</span></p>
            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        </div>
        <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Owner: {product.owner.name}</span>
                <Tooltip text={`Data Quality Score: ${product.dataQualityScore * 100}%`}>
                    <div className="flex items-center">
                        <span className="mr-1">{`Q: ${(product.dataQualityScore * 100).toFixed(0)}%`}</span>
                        <div className={`w-2 h-2 rounded-full ${product.dataQualityScore > 0.95 ? 'bg-green-500' : product.dataQualityScore > 0.8 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    </div>
                </Tooltip>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
                {product.tags.slice(0, 3).map(tag => <Badge key={tag} color="bg-gray-600 text-gray-300">{tag}</Badge>)}
            </div>
        </div>
    </div>
);

export const SchemaViewer: FC<{ schema: SchemaField[] }> = ({ schema }) => {
    const renderField = (field: SchemaField, level: number) => (
        <div key={field.name} style={{ marginLeft: `${level * 20}px` }} className="py-2 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center"><code className="text-purple-400">{field.name}</code><span className="text-gray-500 mx-2">:</span><code className="text-cyan-400">{field.type}</code>{!field.nullable && <span className="ml-2 text-red-400 text-xs font-mono">REQUIRED</span>}</div>
                <div className="flex items-center gap-2">{field.tags?.map(tag => <Badge key={tag} color="bg-red-500/30 text-red-300">{tag}</Badge>)}</div>
            </div>
            <p className="text-sm text-gray-400 mt-1">{field.description}</p>
            {field.nestedFields && <div className="mt-2 border-l-2 border-gray-600 pl-2">{field.nestedFields.map(nested => renderField(nested, level + 1))}</div>}
        </div>
    );
    return <div className="bg-gray-900/50 p-4 rounded-lg font-mono text-sm">{schema.map(field => renderField(field, 0))}</div>;
};

// SECTION: Advanced Visualization Components
// =================================================================================

const DataLineageGraph: FC<{ product: DataProduct; allProducts: DataProduct[] }> = ({ product, allProducts }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        const productMap = new Map(allProducts.map(p => [p.id, p]));
        const initialNodes: Node[] = [];
        const initialEdges: Edge[] = [];

        const addNode = (p: DataProduct, type: 'main' | 'upstream' | 'downstream') => {
            if (!initialNodes.some(n => n.id === p.id)) {
                let nodeStyle = {};
                if (type === 'main') nodeStyle = { background: '#2563eb', color: 'white' };
                if (type === 'upstream') nodeStyle = { background: '#166534', color: 'white' };
                if (type === 'downstream') nodeStyle = { background: '#991b1b', color: 'white' };
                
                initialNodes.push({ id: p.id, data: { label: p.name }, position: { x: 0, y: 0 }, style: nodeStyle });
            }
        };

        addNode(product, 'main');
        
        product.dependencies.forEach(depId => {
            const depProduct = productMap.get(depId);
            if (depProduct) {
                addNode(depProduct, 'upstream');
                initialEdges.push({ id: `e-${depId}-${product.id}`, source: depId, target: product.id, animated: true });
            }
        });

        product.dependents.forEach(depId => {
            const depProduct = productMap.get(depId);
            if (depProduct) {
                addNode(depProduct, 'downstream');
                initialEdges.push({ id: `e-${product.id}-${depId}`, source: product.id, target: depId });
            }
        });

        // Basic auto-layout logic
        const mainNode = initialNodes.find(n => n.id === product.id);
        if (mainNode) {
            mainNode.position = { x: 250, y: 150 };
            const upstreamNodes = product.dependencies.map(id => initialNodes.find(n => n.id === id)).filter(Boolean) as Node[];
            const downstreamNodes = product.dependents.map(id => initialNodes.find(n => n.id === id)).filter(Boolean) as Node[];

            upstreamNodes.forEach((node, i) => node.position = { x: 0, y: i * 100 });
            downstreamNodes.forEach((node, i) => node.position = { x: 500, y: i * 100 });
        }
        
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [product, allProducts]);

    if (!product) return null;

    return (
        <div style={{ height: 400 }} className="bg-gray-900 rounded-lg">
            <ReactFlow nodes={nodes} edges={edges} fitView>
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};


const DataQualityDashboard: FC<{ product: DataProduct }> = ({ product }) => {
    const overallScore = [{ name: 'Quality', value: product.dataQualityScore * 100 }];
    const costData = Object.entries(product.cost).map(([name, value]) => ({ name, value }));
    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-gray-900/50 p-4 rounded-lg flex flex-col items-center justify-center">
                <h4 className="text-lg font-semibold text-gray-200 mb-2">Overall Quality Score</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart innerRadius="80%" outerRadius="100%" data={overallScore} startAngle={90} endAngle={-270}>
                         <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                         <RadialBar background dataKey='value' angleAxisId={0} fill={product.dataQualityScore > 0.9 ? "#22c55e" : product.dataQualityScore > 0.8 ? "#eab308" : "#ef4444"} />
                         <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-current text-white">
                            {(product.dataQualityScore * 100).toFixed(1)}%
                         </text>
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
             <div className="md:col-span-2 bg-gray-900/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-200 mb-2">Quality Metrics Breakdown</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={product.qualityMetrics} layout="vertical">
                        <XAxis type="number" domain={[0, 1]} hide />
                        <YAxis type="category" dataKey="metricName" width={100} tick={{ fill: '#d1d5db' }} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                        <Bar dataKey="value" fill="#3b82f6" background={{ fill: '#374151' }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <div className="md:col-span-3 bg-gray-900/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-200 mb-2">Estimated Monthly Cost Breakdown</h4>
                 <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                         <Pie data={costData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, value }) => `${name}: $${value}`}>
                             {costData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                         </Pie>
                         <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                         <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// SECTION: AI-Powered Components
// =================================================================================

const AIAssistantChat: FC<{ allProducts: DataProduct[] }> = ({ allProducts }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{sender: 'user'|'ai', text: string}[]>([{sender: 'ai', text: 'Hello! How can I help you explore the data mesh today?'}]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { sender: 'user' as 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setIsThinking(true);
        const aiResponse = await aiService.getQueryInsights(input, allProducts);
        setMessages([...newMessages, { sender: 'ai' as 'ai', text: aiResponse }]);
        setIsThinking(false);
    };

    if (!isOpen) {
        return <button onClick={() => setIsOpen(true)} className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform hover:scale-110"><BotIcon className="w-8 h-8" /></button>;
    }

    return (
        <div className="fixed bottom-5 right-5 w-96 h-[500px] bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50">
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-t-lg">
                <h3 className="text-white font-semibold">Data Mesh AI Assistant</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-xl">&times;</button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>{msg.text}</div>
                    </div>
                ))}
                {isThinking && <div className="flex justify-start"><div className="px-3 py-2 rounded-lg bg-gray-700 text-gray-200">Thinking...</div></div>}
            </div>
            <div className="p-3 border-t border-gray-700">
                <div className="flex gap-2">
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Ask about PII, cost, etc." className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Send</button>
                </div>
            </div>
        </div>
    );
}

// SECTION: Data Product Details Modal
// =================================================================================

export const DataProductDetailsModal: FC<{ product: DataProduct | null; onClose: () => void; allProducts: DataProduct[] }> = ({ product, onClose, allProducts }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'lineage' | 'quality' | 'access'>('overview');
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    useEffect(() => {
        if(product){
            setActiveTab('overview'); // Reset tab on new product
            setIsSummaryLoading(true);
            aiService.generateSummary(product.description).then(summary => {
                setAiSummary(summary);
                setIsSummaryLoading(false);
            });
        }
    }, [product]);

    if (!product) return null;
    
    const TabButton: FC<{ tabId: typeof activeTab; children: ReactNode }> = ({ tabId, children }) => (
        <button onClick={() => setActiveTab(tabId)} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tabId ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>{children}</button>
    );

    const totalCost = Object.values(product.cost).reduce((sum, val) => sum + val, 0);

    return (
        <Modal isOpen={!!product} onClose={onClose} title={product.name} size="6xl">
            <div className="border-b border-gray-700"><nav className="-mb-px flex space-x-4"><TabButton tabId="overview">Overview</TabButton><TabButton tabId="schema">Schema</TabButton><TabButton tabId="lineage">Lineage</TabButton><TabButton tabId="quality">Quality & Cost</TabButton><TabButton tabId="access">Access</TabButton></nav></div>
            <div className="mt-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div className="md:col-span-2 space-y-4">
                            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                <h4 className="font-semibold text-blue-300 mb-2">AI-Generated Summary</h4>
                                {isSummaryLoading ? <div className="text-gray-400">Generating summary...</div> : <p className="text-gray-300">{aiSummary}</p>}
                            </div>
                            <div><strong className="text-gray-400">Description:</strong> <p className="text-gray-300">{product.description}</p></div>
                            <div><strong className="text-gray-400">Domain:</strong> <span className="text-gray-300">{product.domain.name}</span></div>
                            <div><strong className="text-gray-400">Owner:</strong> <span className="text-gray-300">{product.owner.name} ({product.owner.email})</span></div>
                            <div><strong className="text-gray-400">Status:</strong> <StatusBadge status={product.status} /></div>
                            <div><strong className="text-gray-400">Version:</strong> <span className="text-gray-300">{product.version}</span></div>
                        </div>
                        <div className="space-y-4 bg-gray-700/50 p-4 rounded-lg">
                            <div><strong className="text-gray-400">Created:</strong> <span className="text-gray-300">{new Date(product.createdAt).toLocaleDateString()}</span></div>
                            <div><strong className="text-gray-400">Last Updated:</strong> <span className="text-gray-300">{new Date(product.updatedAt).toLocaleDateString()}</span></div>
                            <div><strong className="text-gray-400">Documentation:</strong><a href={product.documentationLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-400 hover:underline flex items-center">Confluence <ExternalLinkIcon className="w-4 h-4 ml-1" /></a></div>
                            <div><strong className="text-gray-400">Est. Monthly Cost:</strong> <span className="text-gray-300 font-bold">${totalCost.toFixed(2)}</span></div>
                        </div>
                    </div>
                )}
                {activeTab === 'schema' && (
                    <div className="space-y-6">
                       {product.outputPorts.map(port => (<div key={port.id}><h4 className="text-lg font-semibold text-gray-200 mb-2">{port.name} ({port.format})</h4><p className="text-gray-400 mb-2 text-sm">{port.description}</p><SchemaViewer schema={port.schema} /></div>))}
                       {product.outputPorts.length === 0 && <p className="text-gray-500">No output ports defined for this data product.</p>}
                    </div>
                )}
                {activeTab === 'lineage' && <DataLineageGraph product={product} allProducts={allProducts} />}
                {activeTab === 'quality' && <DataQualityDashboard product={product} />}
                {activeTab === 'access' && (<div><h4 className="text-lg font-semibold text-gray-200 mb-4">Access Control Policies</h4><div className="overflow-x-auto"><table className="min-w-full bg-gray-800 border border-gray-700"><thead><tr className="bg-gray-700/50"><th className="text-left p-3 text-sm font-semibold text-gray-300">Role/Group</th><th className="text-left p-3 text-sm font-semibold text-gray-300">Permissions</th></tr></thead><tbody>{product.accessControl.map((policy, index) => (<tr key={index} className="border-t border-gray-700"><td className="p-3 text-gray-300">{policy.role}</td><td className="p-3"><div className="flex gap-2">{policy.permissions.map(p => <Badge key={p} color="bg-blue-500/20 text-blue-300">{p}</Badge>)}</div></td></tr>))}</tbody></table></div></div>)}
            </div>
        </Modal>
    );
};

// SECTION: Filters and State Management
// =================================================================================

export interface DataMeshFilters { searchTerm: string; domains: Set<string>; owners: Set<string>; statuses: Set<DataProductLifecycleStatus>; tags: Set<string>; }
type FilterAction = | { type: 'SET_SEARCH_TERM'; payload: string } | { type: 'TOGGLE_DOMAIN'; payload: string } | { type: 'TOGGLE_OWNER'; payload: string } | { type: 'TOGGLE_STATUS'; payload: DataProductLifecycleStatus } | { type: 'TOGGLE_TAG'; payload: string } | { type: 'RESET_FILTERS' };
export const initialFilters: DataMeshFilters = { searchTerm: '', domains: new Set(), owners: new Set(), statuses: new Set(), tags: new Set() };

export function filtersReducer(state: DataMeshFilters, action: FilterAction): DataMeshFilters {
    const toggleSet = <T,>(set: Set<T>, payload: T) => { const newSet = new Set(set); if (newSet.has(payload)) newSet.delete(payload); else newSet.add(payload); return newSet; };
    switch (action.type) {
        case 'SET_SEARCH_TERM': return { ...state, searchTerm: action.payload };
        case 'TOGGLE_DOMAIN': return { ...state, domains: toggleSet(state.domains, action.payload) };
        case 'TOGGLE_OWNER': return { ...state, owners: toggleSet(state.owners, action.payload) };
        case 'TOGGLE_STATUS': return { ...state, statuses: toggleSet(state.statuses, action.payload) };
        case 'TOGGLE_TAG': return { ...state, tags: toggleSet(state.tags, action.payload) };
        case 'RESET_FILTERS': return initialFilters;
        default: return state;
    }
}

export const FilterSidebar: FC<{ domains: Domain[]; owners: Owner[]; allTags: string[]; filters: DataMeshFilters; dispatch: React.Dispatch<FilterAction>; }> = ({ domains, owners, allTags, filters, dispatch }) => {
    const FilterSection: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (<div className="py-4 border-b border-gray-700"><h4 className="font-semibold text-gray-300 mb-2 px-4">{title}</h4>{children}</div>);
    const CheckboxItem: FC<{ label: string; id: string; checked: boolean; onChange: () => void; }> = ({ label, id, checked, onChange }) => (<label htmlFor={id} className="flex items-center space-x-2 px-4 py-1 cursor-pointer hover:bg-gray-700/50 rounded"><input type="checkbox" id={id} checked={checked} onChange={onChange} className="form-checkbox bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500/50" /><span className="text-gray-400 text-sm">{label}</span></label>);

    return (
        <div className="w-64 bg-gray-800/50 border-r border-gray-700 h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-bold text-white">Filters</h3></div>
            <FilterSection title="Status">{(['PUBLISHED', 'DRAFT', 'DEPRECATED', 'RETIRED'] as DataProductLifecycleStatus[]).map(status => (<CheckboxItem key={status} id={`status-${status}`} label={status.charAt(0) + status.slice(1).toLowerCase()} checked={filters.statuses.has(status)} onChange={() => dispatch({ type: 'TOGGLE_STATUS', payload: status })} />))}</FilterSection>
            <FilterSection title="Domains">{domains.map(domain => (<CheckboxItem key={domain.id} id={`domain-${domain.id}`} label={domain.name} checked={filters.domains.has(domain.id)} onChange={() => dispatch({ type: 'TOGGLE_DOMAIN', payload: domain.id })}/>))}</FilterSection>
            <FilterSection title="Owners">{owners.map(owner => (<CheckboxItem key={owner.id} id={`owner-${owner.id}`} label={owner.name} checked={filters.owners.has(owner.id)} onChange={() => dispatch({ type: 'TOGGLE_OWNER', payload: owner.id })}/>))}</FilterSection>
            <FilterSection title="Tags">{allTags.map(tag => (<CheckboxItem key={tag} id={`tag-${tag}`} label={tag} checked={filters.tags.has(tag)} onChange={() => dispatch({ type: 'TOGGLE_TAG', payload: tag })}/>))}</FilterSection>
             <div className="p-4"><button onClick={() => dispatch({ type: 'RESET_FILTERS' })} className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors">Reset All Filters</button></div>
        </div>
    );
};

// SECTION: Main View and Layout
// =================================================================================

const DataMeshView: FC = () => {
    const [dataProducts, setDataProducts] = useState<DataProduct[]>([]);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [owners, setOwners] = useState<Owner[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, dispatch] = useReducer(filtersReducer, initialFilters);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedProduct, setSelectedProduct] = useState<DataProduct | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [productsData, domainsData, ownersData] = await Promise.all([ mockApi.fetchDataProducts(), mockApi.fetchDomains(), mockApi.fetchOwners() ]);
                setDataProducts(productsData); setDomains(domainsData); setOwners(ownersData);
            } catch (err) { setError('Failed to load data mesh resources.'); console.error(err); } finally { setIsLoading(false); }
        };
        loadData();
    }, []);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        dataProducts.forEach(p => p.tags.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [dataProducts]);

    const filteredDataProducts = useMemo(() => {
        return dataProducts.filter(product => {
            const searchTermMatch = filters.searchTerm.length === 0 || product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || product.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) || product.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));
            const domainMatch = filters.domains.size === 0 || filters.domains.has(product.domain.id);
            const ownerMatch = filters.owners.size === 0 || filters.owners.has(product.owner.id);
            const statusMatch = filters.statuses.size === 0 || filters.statuses.has(product.status);
            const tagMatch = filters.tags.size === 0 || product.tags.some(tag => filters.tags.has(tag));
            return searchTermMatch && domainMatch && ownerMatch && statusMatch && tagMatch;
        });
    }, [dataProducts, filters]);

    const handleSelectProduct = useCallback((product: DataProduct) => setSelectedProduct(product), []);
    const handleCloseModal = useCallback(() => setSelectedProduct(null), []);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });

    const Header = () => (
        <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b border-gray-700">
            <div><h1 className="text-2xl font-bold text-white">Data Mesh Explorer</h1><p className="text-gray-400">Discover, understand, and use data products across the enterprise.</p></div>
            <div className="flex items-center gap-4">
                <div className="relative"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input type="text" placeholder="Search data products..." value={filters.searchTerm} onChange={handleSearchChange} className="bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                 <div className="flex items-center bg-gray-800 border border-gray-600 rounded-lg p-1"><button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}><GridIcon className="w-5 h-5 text-white" /></button><button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}><ListIcon className="w-5 h-5 text-white" /></button></div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Create Data Product</button>
            </div>
        </div>
    );

    const MainContent = () => {
        if (isLoading) return <Spinner />;
        if (error) return <div className="p-8 text-center text-red-400">{error}</div>;
        if (filteredDataProducts.length === 0) return <div className="p-8 text-center text-gray-500">No data products match your criteria.</div>;

        if (viewMode === 'grid') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                    {filteredDataProducts.map(product => <DataProductCard key={product.id} product={product} onSelect={handleSelectProduct} />)}
                </div>
            );
        }

        return (
            <div className="p-4"><table className="min-w-full bg-gray-800"><thead className="bg-gray-700/50"><tr><th className="text-left p-3 text-sm font-semibold text-gray-300">Name</th><th className="text-left p-3 text-sm font-semibold text-gray-300">Domain</th><th className="text-left p-3 text-sm font-semibold text-gray-300">Owner</th><th className="text-left p-3 text-sm font-semibold text-gray-300">Status</th><th className="text-left p-3 text-sm font-semibold text-gray-300">Last Updated</th></tr></thead><tbody>{filteredDataProducts.map(p => (<tr key={p.id} onClick={() => handleSelectProduct(p)} className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"><td className="p-3 text-blue-400 font-semibold">{p.name}</td><td className="p-3 text-gray-300">{p.domain.name}</td><td className="p-3 text-gray-300">{p.owner.name}</td><td className="p-3"><StatusBadge status={p.status} /></td><td className="p-3 text-gray-400">{new Date(p.updatedAt).toLocaleDateString()}</td></tr>))}</tbody></table></div>
        );
    };

    return (
        <Card title="Data Mesh">
            <div className="bg-gray-900 text-gray-200 min-h-[80vh] flex flex-col">
                <Header />
                <div className="flex flex-grow overflow-hidden">
                    <FilterSidebar domains={domains} owners={owners} allTags={allTags} filters={filters} dispatch={dispatch} />
                    <main className="flex-grow overflow-y-auto"><MainContent /></main>
                </div>
                <DataProductDetailsModal product={selectedProduct} onClose={handleCloseModal} allProducts={dataProducts} />
                <AIAssistantChat allProducts={dataProducts} />
            </div>
        </Card>
    );
};

export default DataMeshView;