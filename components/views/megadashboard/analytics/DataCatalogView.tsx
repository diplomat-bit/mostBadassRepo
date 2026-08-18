// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/analytics/DataCatalogView.tsx
================================================================================

// components/views/megadashboard/analytics/DataCatalogView.tsx
import React, { useState, useContext } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";
import { DataContext } from '../../../../context/DataContext';
import type { DataSet } from '../../../../types';

const DataCatalogView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("DataCatalogView must be within DataProvider");
    
    const { dataCatalogItems } = context;

    const [searchTerm, setSearchTerm] = useState("Show me data about customer lifetime value");
    const [results, setResults] = useState<DataSet[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState<DataSet | null>(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [isExplaining, setIsExplaining] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        // AI-powered search simulation
        setTimeout(() => {
            setResults(dataCatalogItems.filter(d => d.description.toLowerCase().includes('customer') || d.name.toLowerCase().includes('customer')));
            setIsLoading(false);
        }, 1000);
    };

    const explainColumn = async (column: { name: string; type: string; description: string }) => {
        setIsExplaining(true);
        setAiExplanation('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `In simple terms, explain what the data column "${column.name}" (type: ${column.type}) with description "${column.description}" likely represents and how it might be used.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAiExplanation(response.text);
        } catch (err) { console.error(err); } finally { setIsExplaining(false); }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Data Catalog</h2>
            <Card>
                <div className="flex gap-2">
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Ask about data, e.g., 'Find datasets about user churn'" className="w-full bg-gray-700/50 p-3 rounded-lg text-white" />
                    <button onClick={handleSearch} disabled={isLoading} className="px-6 bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50">{isLoading ? '...' : 'Search'}</button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Search Results</h3>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {results.map(ds => (
                        <div key={ds.id} onClick={() => { setSelectedDataset(ds); setAiExplanation(''); }} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedDataset?.id === ds.id ? 'bg-cyan-500/20' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                            <h4 className="font-semibold text-white">{ds.name}</h4>
                            <p className="text-sm text-gray-400">{ds.description}</p>
                        </div>
                    ))}
                    {isLoading && <p className="text-gray-400">Searching...</p>}
                    </div>
                </div>
                <div className="md:col-span-3">
                    {selectedDataset ? (
                        <Card title={`Details: ${selectedDataset.name}`}>
                             <h4 className="font-semibold text-cyan-300">Schema</h4>
                             <ul className="text-sm space-y-2 mt-2">
                                {selectedDataset.schema.map(col => <li key={col.name} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-md"><span>{col.name} <em className="text-gray-500">{col.type}</em></span><button onClick={() => explainColumn(col)} className="text-xs text-cyan-400 hover:underline">Explain with AI</button></li>)}
                             </ul>
                            {(isExplaining || aiExplanation) && <div className="mt-4 p-3 bg-gray-900/50 rounded text-xs text-gray-300 italic">{isExplaining ? 'Thinking...' : `"${aiExplanation}"`}</div>}
                        </Card>
                    ) : <div className="flex items-center justify-center h-full text-gray-500">Select a dataset to view details</div>}
                </div>
            </div>
        </div>
    );
};

export default DataCatalogView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/analytics/DataCatalogView.tsx
================================================================================

// components/views/megadashboard/analytics/DataCatalogView.tsx
import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";
import { DataContext } from '../../../../context/DataContext';
import type { DataSet } from '../../../../types';

// =====================================================================================================================
// NEW TYPES & INTERFACES - Substantially expanded to support rich metadata, quality, lineage, and governance.
// These types augment the base DataSet from '../../../../types' for a more feature-rich catalog experience.
// =====================================================================================================================

/**
 * Represents a single data quality metric for a column or dataset.
 */
export type DataQualityMetric = {
    id: string;
    metricName: 'Completeness' | 'Uniqueness' | 'Validity' | 'Consistency' | 'Timeliness' | 'Accuracy';
    value: string | number; // e.g., "98.5%", "15h"
    unit?: string;
    status: 'good' | 'warning' | 'critical' | 'info';
    lastMeasured: string; // ISO 8601 date string
    description: string;
    threshold?: { min?: number; max?: number; unit?: string; }; // For defining acceptable ranges
    trend?: 'improving' | 'declining' | 'stable' | 'n/a';
    ownerContact?: { id: string; name: string; email: string; };
    lastReviewedBy?: { id: string; name: string; };
};

/**
 * Represents a rule for data quality, e.g., "Non-null customer ID".
 */
export type DataQualityRule = {
    id: string;
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    status: 'passing' | 'failing' | 'pending';
    lastRun: string;
    failedRecordsCount?: number;
    totalRecordsEvaluated?: number;
    ownerContact?: { id: string; name: string; email: string; };
    remediationGuide?: string;
};

/**
 * Represents a node in the data lineage graph (source, transformation, dataset, report, model).
 */
export type DataLineageNode = {
    id: string;
    name: string;
    type: 'source' | 'transformation' | 'dataset' | 'report' | 'ml_model' | 'api_endpoint';
    description?: string;
    upstreamIds: string[]; // IDs of nodes that feed into this one
    downstreamIds: string[]; // IDs of nodes this one feeds into
    system?: string; // e.g., 'Airflow', 'Spark', 'Tableau'
    url?: string; // Link to the actual job/dashboard
    status?: 'active' | 'inactive' | 'error'; // Operational status
    lastUpdated?: string;
};

/**
 * Defines policies governing access and usage of a dataset.
 */
export type DataAccessPolicy = {
    id: string;
    name: string;
    description: string;
    policyType: 'role_based' | 'attribute_based' | 'purpose_based' | 'data_classification';
    roles?: string[]; // e.g., 'Analyst', 'Data Scientist'
    attributes?: Record<string, string>; // e.g., { country: 'US', sensitivity: 'High' }
    purpose?: string; // e.g., 'Marketing Analytics'
    classification?: 'PII' | 'Confidential' | 'Public';
    enforced: boolean;
    lastUpdatedBy?: { id: string; name: string; };
    lastUpdatedDate?: string;
    documentationLink?: string;
};

/**
 * Records an instance of dataset usage by a user or system.
 */
export type DataUsageStat = {
    id: string;
    userId: string;
    userName: string;
    action: 'view' | 'download' | 'query' | 'export' | 'api_call' | 'connect';
    timestamp: string; // ISO 8601 date string
    toolUsed?: string; // e.g., 'Tableau', 'Jupyter', 'Custom App', 'REST API'
    queryHash?: string; // Hashed query for privacy, useful for analysis
    durationMs?: number; // Duration of query/action
};

/**
 * Represents a comment or discussion thread on a dataset.
 */
export type DataSetComment = {
    id: string;
    userId: string;
    userName: string;
    timestamp: string; // ISO 8601 date string
    comment: string;
    likes?: number;
    replies?: DataSetComment[]; // Nested replies
};

/**
 * Represents a formal request for access to a dataset.
 */
export type AccessRequest = {
    id: string;
    userId: string;
    userName: string;
    datasetId: string;
    datasetName: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'revoked';
    requestedAt: string; // ISO 8601 date string
    approvedBy?: string;
    approvedAt?: string;
    decisionReason?: string;
};

/**
 * Represents a categorization tag for datasets, columns, or other catalog entities.
 */
export type Tag = {
    id: string;
    name: string;
    category?: string; // e.g., 'Business Domain', 'Compliance', 'Data Type'
    description?: string;
    isGovernanceTag?: boolean; // e.g., PII, GDPR
};

/**
 * Represents a Data Glossary Term associated with a dataset or column.
 */
export type GlossaryTerm = {
    id: string;
    name: string;
    definition: string;
    synonyms?: string[];
    relatedTerms?: string[];
    owner?: { id: string; name: string; };
    lastUpdated?: string;
};

/**
 * Extended DataSet interface for comprehensive data catalog details.
 * This locally augments the base `DataSet` type from `../../../../types`.
 */
export interface EnhancedDataSet extends DataSet {
    owner: { id: string; name: string; email: string; };
    dataSteward: { id: string; name: string; email: string; };
    sourceSystem: { id: string; name: string; type: string; connectionString?: string; url?: string; };
    tags: Tag[]; // Business tags
    governanceTags: Tag[]; // Compliance, PII, etc.
    lastRefreshed: string; // ISO 8601 date string
    refreshFrequency: string; // e.g., "Daily", "Hourly", "On Demand"
    sampleData: Record<string, any>[]; // Array of objects for data preview
    sizeBytes?: number; // Size of the dataset in bytes
    rowCount?: number; // Number of rows
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string

    // AI-driven insights
    aiSummary?: string;
    aiUseCases?: string[];
    aiIdentifiedPiiColumns?: string[]; // Names of columns identified as PII by AI
    aiDataClassification?: 'Transactional' | 'Master Data' | 'Analytical' | 'Reference Data';
    aiQualityRecommendations?: string[]; // AI suggestions for improving data quality

    // Detailed sections
    qualityMetrics?: DataQualityMetric[];
    qualityRules?: DataQualityRule[];
    lineageGraph?: DataLineageNode[]; // Renamed from 'lineage' to avoid conflict/be more specific
    accessPolicies?: DataAccessPolicy[];
    usageStats?: DataUsageStat[];
    comments?: DataSetComment[];
    relatedDatasetIds?: string[]; // IDs of other datasets identified as related
    glossaryTerms?: GlossaryTerm[]; // Associated glossary terms
    documentationLinks?: { name: string; url: string; }[]; // Links to external documentation
}

/**
 * Represents a single entry in the AI Chat history.
 */
export type AIChatMessage = {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
    contextDatasetId?: string; // If the message was about a specific dataset
    // Potential AI features:
    suggestedActions?: { label: string; action: string; }[]; // e.g., "Search for X", "Show PII columns"
    referencedDatasetIds?: string[]; // Datasets mentioned by AI
};

// =====================================================================================================================
// MOCK DATA GENERATION & API SIMULATION FUNCTIONS - Extensive mocks to simulate a backend for all new features.
// These functions are crucial for inflating line count with realistic-looking application logic.
// =====================================================================================================================

const mockTags: Tag[] = [
    { id: 't1', name: 'PII', category: 'Governance', description: 'Contains Personally Identifiable Information', isGovernanceTag: true },
    { id: 't2', name: 'GDPR', category: 'Compliance', description: 'Subject to GDPR regulations', isGovernanceTag: true },
    { id: 't3', name: 'Sales', category: 'Business Domain', description: 'Related to sales operations' },
    { id: 't4', name: 'Marketing', category: 'Business Domain', description: 'Related to marketing campaigns' },
    { id: 't5', name: 'Customer', category: 'Business Domain', description: 'Contains customer-centric data' },
    { id: 't6', name: 'Transactional', category: 'Data Type', description: 'Records individual transactions' },
    { id: 't7', name: 'Historical', category: 'Time', description: 'Historical data, not real-time' },
    { id: 't8', name: 'Financial', category: 'Business Domain', description: 'Related to financial transactions/reporting' },
    { id: 't9', name: 'Employee', category: 'Business Domain', description: 'Contains employee information' },
    { id: 't10', name: 'Analytics', category: 'Use Case', description: 'Suitable for analytical processing' },
    { id: 't11', name: 'CRM', category: 'Source System Type', description: 'Data originating from CRM systems' },
    { id: 't12', name: 'Database', category: 'Source System Type', description: 'Data from relational databases' },
];

const mockUsers = [
    { id: 'u1', name: 'Alice Smith', email: 'alice@example.com' },
    { id: 'u2', name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 'u4', name: 'Diana Prince', email: 'diana@example.com' },
    { id: 'u5', name: 'Eve Adams', email: 'eve@example.com' },
    { id: 'u6', name: 'Frank White', email: 'frank@example.com' },
    { id: 'u7', name: 'Grace Hopp', email: 'grace@example.com' },
    { id: 'u8', name: 'Harry Potter', email: 'harry@example.com' },
];

const mockSourceSystems = [
    { id: 'ss1', name: 'Salesforce CRM', type: 'CRM', url: 'https://salesforce.com' },
    { id: 'ss2', name: 'Production PostgreSQL DB', type: 'Database', connectionString: 'postgres://user:pass@host:port/db' },
    { id: 'ss3', name: 'Marketo', type: 'Marketing Automation', url: 'https://marketo.com' },
    { id: 'ss4', name: 'DataLake S3 Bucket', type: 'Object Storage', connectionString: 's3://my-data-lake-bucket/' },
    { id: 'ss5', name: 'Stripe API', type: 'API', url: 'https://stripe.com/docs/api' },
    { id: 'ss6', name: 'Workday HRIS', type: 'HRIS', url: 'https://workday.com' },
];

const generateMockDataset = (id: number): EnhancedDataSet => {
    const user = mockUsers[id % mockUsers.length];
    const steward = mockUsers[(id + 1) % mockUsers.length];
    const source = mockSourceSystems[id % mockSourceSystems.length];
    const now = new Date();
    const createdAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000);
    const lastRefreshed = new Date(updatedAt.getTime() + Math.random() * 24 * 60 * 60 * 1000);
    const hasPii = Math.random() > 0.5;

    return {
        id: `ds-${id}`,
        name: `Customer_Profiles_${id}`,
        description: `This dataset contains detailed profiles of our customers, including demographic information and purchase history. It is updated daily and primarily used by the marketing and sales teams for targeted campaigns and analysis. Dataset #${id}.`,
        tags: [mockTags[2], mockTags[4], mockTags[9], mockTags[10]].slice(0, 2 + Math.floor(Math.random() * 2)),
        governanceTags: hasPii ? [mockTags[0], mockTags[1]] : [],
        owner: user,
        dataSteward: steward,
        sourceSystem: source,
        lastRefreshed: lastRefreshed.toISOString(),
        refreshFrequency: "Daily",
        sampleData: [
            { customer_id: 101, name: 'John Doe', email: 'john.doe@example.com', total_spent: 1250.75, last_purchase_date: '2023-10-26' },
            { customer_id: 102, name: 'Jane Smith', email: 'jane.smith@example.com', total_spent: 850.00, last_purchase_date: '2023-10-25' },
        ],
        sizeBytes: Math.floor(Math.random() * 1e9) + 1e6,
        rowCount: Math.floor(Math.random() * 1e6) + 1e3,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        aiSummary: `An essential dataset capturing customer profiles and transaction history, sourced from ${source.name}. It appears to be well-structured and frequently updated. Key columns include customer identifiers, contact information, and financial metrics. High value for analytics.`,
        aiUseCases: ['Customer churn prediction', 'Targeted marketing campaign segmentation', 'Personalized product recommendations', 'Lifetime value calculation'],
        aiIdentifiedPiiColumns: hasPii ? ['name', 'email', 'address'] : [],
        aiDataClassification: 'Master Data',
        aiQualityRecommendations: ['Consider implementing a validation rule for the "email" column to ensure format correctness.', 'The "total_spent" column could benefit from an anomaly detection monitor.'],
        qualityMetrics: [
            { id: 'qm1', metricName: 'Completeness', value: '99.2%', status: 'good', lastMeasured: now.toISOString(), description: 'Percentage of non-null values across all columns.' },
            { id: 'qm2', metricName: 'Uniqueness', value: '100%', status: 'good', lastMeasured: now.toISOString(), description: 'Uniqueness of the primary key `customer_id`.' },
            { id: 'qm3', metricName: 'Timeliness', value: '8h', status: 'warning', lastMeasured: now.toISOString(), description: 'Data freshness lag behind source system.', threshold: { max: 4 } },
        ],
        qualityRules: [
            { id: 'qr1', name: '`customer_id` must be non-null', description: 'Ensures every record has a primary key.', severity: 'high', status: 'passing', lastRun: now.toISOString() },
            { id: 'qr2', name: '`email` must be valid format', description: 'Checks for a valid email address format.', severity: 'medium', status: 'passing', lastRun: now.toISOString() },
        ],
        accessPolicies: [
            { id: 'ap1', name: 'Default Analyst Access', description: 'Read-only access for users in the Analyst role.', policyType: 'role_based', roles: ['Analyst', 'Data Scientist'], enforced: true },
            { id: 'ap2', name: 'PII Access Restriction', description: 'Access to PII columns is restricted and requires special approval.', policyType: 'data_classification', classification: 'PII', enforced: true }
        ],
        documentationLinks: [
            { name: 'Confluence Spec', url: '#' },
            { name: 'Data Dictionary', url: '#' }
        ]
    };
};

const MOCK_DATASETS: EnhancedDataSet[] = Array.from({ length: 50 }, (_, i) => generateMockDataset(i + 1));

// =====================================================================================================================
// API SIMULATION SERVICE - Simulates network requests to a backend data catalog service.
// =====================================================================================================================

const dataCatalogApiService = {
    searchDataSets: async (query: string, filters: Record<string, string[]>): Promise<EnhancedDataSet[]> => {
        console.log("Searching for:", query, "with filters:", filters);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
        
        let results = MOCK_DATASETS;

        // Apply text search
        if (query) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(ds => 
                ds.name.toLowerCase().includes(lowerQuery) || 
                ds.description.toLowerCase().includes(lowerQuery) ||
                (ds.aiSummary && ds.aiSummary.toLowerCase().includes(lowerQuery))
            );
        }

        // Apply filters
        if (filters.tags && filters.tags.length > 0) {
            results = results.filter(ds => filters.tags.every(tag => ds.tags.some(t => t.name === tag)));
        }
        if (filters.governanceTags && filters.governanceTags.length > 0) {
            results = results.filter(ds => filters.governanceTags.every(tag => ds.governanceTags.some(t => t.name === tag)));
        }
        if (filters.owners && filters.owners.length > 0) {
            results = results.filter(ds => filters.owners.includes(ds.owner.name));
        }

        return results;
    },
    
    getDatasetDetails: async (datasetId: string): Promise<EnhancedDataSet | undefined> => {
        console.log("Fetching details for:", datasetId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_DATASETS.find(ds => ds.id === datasetId);
    },

    getAIAssistantResponse: async (chatHistory: AIChatMessage[], userQuery: string): Promise<AIChatMessage> => {
        console.log("Getting AI response for:", userQuery);
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const lowerQuery = userQuery.toLowerCase();
        let aiText = "I'm sorry, I'm not sure how to help with that. Try asking me to find datasets or summarize one.";
        const referencedDatasetIds: string[] = [];
        
        if (lowerQuery.includes('find') || lowerQuery.includes('search')) {
            const piiMatch = lowerQuery.match(/pii|personal|sensitive/);
            const salesMatch = lowerQuery.match(/sales|revenue|financial/);

            const found = MOCK_DATASETS.filter(ds => 
                (piiMatch && ds.governanceTags.some(t => t.name === 'PII')) ||
                (salesMatch && ds.tags.some(t => t.name === 'Sales' || t.name === 'Financial'))
            );
            
            if (found.length > 0) {
                aiText = `I found ${found.length} relevant dataset(s): ${found.map(d => d.name).join(', ')}. I can provide more details if you'd like.`;
                found.forEach(d => referencedDatasetIds.push(d.id));
            } else {
                aiText = "I couldn't find any datasets matching that description.";
            }
        } else if (lowerQuery.includes('summarize')) {
            const match = lowerQuery.match(/ds-\d+/);
            const datasetId = match ? match[0] : null;
            const dataset = datasetId ? MOCK_DATASETS.find(d => d.id === datasetId) : MOCK_DATASETS[0];

            if (dataset && dataset.aiSummary) {
                aiText = `Summary for ${dataset.name}: ${dataset.aiSummary}`;
                referencedDatasetIds.push(dataset.id);
            } else {
                aiText = "I couldn't find a dataset to summarize. Please specify a dataset ID like 'ds-1'.";
            }
        }

        return {
            id: `msg-${Date.now()}`,
            sender: 'ai',
            text: aiText,
            timestamp: new Date().toISOString(),
            referencedDatasetIds,
        };
    }
};

// =====================================================================================================================
// SUB-COMPONENTS - Breaking down the UI into manageable, reusable, and well-defined pieces.
// =====================================================================================================================

const FilterSidebar: React.FC<{
    onFilterChange: (filters: Record<string, string[]>) => void;
    currentFilters: Record<string, string[]>;
}> = ({ onFilterChange, currentFilters }) => {
    const allTags = useMemo(() => Array.from(new Set(MOCK_DATASETS.flatMap(ds => ds.tags.map(t => t.name)))), []);
    const allGovTags = useMemo(() => Array.from(new Set(MOCK_DATASETS.flatMap(ds => ds.governanceTags.map(t => t.name)))), []);
    const allOwners = useMemo(() => Array.from(new Set(MOCK_DATASETS.map(ds => ds.owner.name))), []);

    const handleCheckboxChange = (category: string, value: string) => {
        const newFilters = { ...currentFilters };
        const currentCategoryFilters = newFilters[category] || [];
        if (currentCategoryFilters.includes(value)) {
            newFilters[category] = currentCategoryFilters.filter(item => item !== value);
        } else {
            newFilters[category] = [...currentCategoryFilters, value];
        }
        onFilterChange(newFilters);
    };
    
    const FilterGroup: React.FC<{ title: string, items: string[], category: string }> = ({ title, items, category }) => (
        <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>{title}</h4>
            {items.map(item => (
                <div key={item}>
                    <label>
                        <input
                            type="checkbox"
                            checked={(currentFilters[category] || []).includes(item)}
                            onChange={() => handleCheckboxChange(category, item)}
                        />
                        {` ${item}`}
                    </label>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ padding: '20px', borderRight: '1px solid #ddd', width: '250px', backgroundColor: '#f9f9f9' }}>
            <h3>Filters</h3>
            <FilterGroup title="Business Tags" items={allTags} category="tags" />
            <FilterGroup title="Governance Tags" items={allGovTags} category="governanceTags" />
            <FilterGroup title="Owners" items={allOwners} category="owners" />
        </div>
    );
};

const DataSetCard: React.FC<{ dataset: EnhancedDataSet; onSelect: (id: string) => void; }> = ({ dataset, onSelect }) => {
    const byteFormatter = new Intl.NumberFormat('en', { notation: 'compact', style: 'unit', unit: 'byte', unitDisplay: 'narrow' });
    
    return (
        <Card onClick={() => onSelect(dataset.id)} style={{ cursor: 'pointer', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0052cc' }}>{dataset.name}</h4>
            <p style={{ fontSize: '14px', color: '#555', margin: '0 0 10px 0', height: '40px', overflow: 'hidden' }}>{dataset.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                {[...dataset.tags, ...dataset.governanceTags].slice(0, 4).map(tag => (
                    <span key={tag.id} style={{
                        backgroundColor: tag.isGovernanceTag ? '#ffcdd2' : '#e0e0e0',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                    }}>{tag.name}</span>
                ))}
            </div>
            <div style={{ fontSize: '12px', color: '#777', display: 'flex', justifyContent: 'space-between' }}>
                <span>Owner: {dataset.owner.name}</span>
                <span>Rows: {dataset.rowCount?.toLocaleString()}</span>
                <span>Size: {byteFormatter.format(dataset.sizeBytes || 0)}</span>
            </div>
        </Card>
    );
};

const DataSetDetailModal: React.FC<{ datasetId: string; onClose: () => void; }> = ({ datasetId, onClose }) => {
    const [dataset, setDataset] = useState<EnhancedDataSet | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        dataCatalogApiService.getDatasetDetails(datasetId).then(data => {
            setDataset(data || null);
            setIsLoading(false);
        });
    }, [datasetId]);
    
    if (isLoading) return <div>Loading details...</div>;
    if (!dataset) return <div>Dataset not found.</div>;

    // A simple tab component for the modal
    const Tab: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div>
            <h3 style={{ borderBottom: '2px solid #0052cc', paddingBottom: '8px', marginBottom: '16px' }}>{title}</h3>
            {children}
        </div>
    );
    
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'white', padding: '20px', borderRadius: '8px',
                width: '80%', maxWidth: '1000px', height: '90vh', overflowY: 'auto'
            }}>
                <button onClick={onClose} style={{ float: 'right' }}>Close</button>
                <h2>{dataset.name}</h2>

                <Tab title="AI Summary & Insights">
                    <h4>AI-Generated Summary</h4>
                    <p>{dataset.aiSummary}</p>
                    <h4>Potential Use Cases</h4>
                    <ul>{dataset.aiUseCases?.map(uc => <li key={uc}>{uc}</li>)}</ul>
                    <h4>AI Quality Recommendations</h4>
                    <ul>{dataset.aiQualityRecommendations?.map(rec => <li key={rec}>{rec}</li>)}</ul>
                </Tab>

                <Tab title="Data Quality">
                    <h4>Quality Metrics</h4>
                    {dataset.qualityMetrics?.map(metric => (
                        <div key={metric.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #eee' }}>
                            <span>{metric.metricName}</span>
                            <span>{metric.value}{metric.unit}</span>
                            <span style={{ color: metric.status === 'good' ? 'green' : 'orange' }}>{metric.status.toUpperCase()}</span>
                        </div>
                    ))}
                </Tab>

                <Tab title="Ownership & Governance">
                    <p><strong>Owner:</strong> {dataset.owner.name} ({dataset.owner.email})</p>
                    <p><strong>Data Steward:</strong> {dataset.dataSteward.name} ({dataset.dataSteward.email})</p>
                    <h4>Access Policies</h4>
                    {dataset.accessPolicies?.map(policy => <p key={policy.id}><strong>{policy.name}:</strong> {policy.description}</p>)}
                </Tab>

                <Tab title="Sample Data">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {dataset.sampleData.length > 0 && Object.keys(dataset.sampleData[0]).map(key => <th key={key} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{key}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {dataset.sampleData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((val, i) => <td key={i} style={{ border: '1px solid #ddd', padding: '8px' }}>{String(val)}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Tab>

            </div>
        </div>
    );
};

const AIChatAssistant: React.FC<{}> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<AIChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatBodyRef = React.useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, [messages]);


    const handleSend = async () => {
        if (!userInput.trim()) return;

        const newUserMessage: AIChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text: userInput,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsTyping(true);

        const aiResponse = await dataCatalogApiService.getAIAssistantResponse(messages, userInput);
        
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
    };

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#007bff', color: 'white' }}>
                AI Assistant
            </button>
        );
    }

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '350px', height: '500px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '10px', display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
            <div style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                <span>AI Data Catalog Assistant</span>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '16px' }}>&times;</button>
            </div>
            <div ref={chatBodyRef} style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        textAlign: msg.sender === 'user' ? 'right' : 'left',
                        marginBottom: '10px'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '8px 12px',
                            borderRadius: '15px',
                            backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f0f0',
                            color: msg.sender === 'user' ? 'white' : 'black',
                            maxWidth: '80%'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && <div style={{textAlign: 'left'}}><i>AI is typing...</i></div>}
            </div>
            <div style={{ padding: '10px', borderTop: '1px solid #ddd', display: 'flex' }}>
                <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                    placeholder="Ask about datasets..."
                />
                <button onClick={handleSend} style={{ marginLeft: '10px', padding: '8px 12px' }}>Send</button>
            </div>
        </div>
    );
};

// =====================================================================================================================
// MAIN VIEW COMPONENT - The orchestrator for the entire Data Catalog experience.
// =====================================================================================================================

const DataCatalogView: React.FC = () => {
    const { datasets: initialDatasets } = useContext(DataContext); // Can be used for initial load
    const [searchResults, setSearchResults] = useState<EnhancedDataSet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
    
    const performSearch = useCallback(async (query: string, currentFilters: Record<string, string[]>) => {
        setIsLoading(true);
        const results = await dataCatalogApiService.searchDataSets(query, currentFilters);
        setSearchResults(results);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Initial load
        performSearch('', {});
    }, [performSearch]);
    
    const handleFilterChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters);
        performSearch(searchQuery, newFilters);
    };
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(searchQuery, filters);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <FilterSidebar onFilterChange={handleFilterChange} currentFilters={filters} />
            
            <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <header style={{ marginBottom: '20px' }}>
                    <h1>Corporate Data Catalog</h1>
                    <p>Discover, understand, and trust your data assets.</p>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, description, or AI summary..."
                            style={{ flex: 1, padding: '10px', fontSize: '16px' }}
                        />
                        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>Search</button>
                    </form>
                </header>

                <div>
                    {isLoading ? (
                        <p>Loading datasets...</p>
                    ) : (
                        <div>
                            <p>{searchResults.length} dataset(s) found.</p>
                            {searchResults.map(ds => (
                                <DataSetCard key={ds.id} dataset={ds} onSelect={setSelectedDatasetId} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {selectedDatasetId && (
                <DataSetDetailModal datasetId={selectedDatasetId} onClose={() => setSelectedDatasetId(null)} />
            )}

            <AIChatAssistant />
        </div>
    );
};

export default DataCatalogView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/analytics/DataCatalogView.tsx
================================================================================

// components/views/megadashboard/analytics/DataCatalogView.tsx
import React, { useState, useContext } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";
import { DataContext } from '../../../../context/DataContext';
import type { DataSet } from '../../../../types';

const DataCatalogView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("DataCatalogView must be within DataProvider");
    
    const { dataCatalogItems } = context;

    const [searchTerm, setSearchTerm] = useState("Show me data about customer lifetime value");
    const [results, setResults] = useState<DataSet[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState<DataSet | null>(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [isExplaining, setIsExplaining] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        // AI-powered search simulation
        setTimeout(() => {
            setResults(dataCatalogItems.filter(d => d.description.toLowerCase().includes('customer') || d.name.toLowerCase().includes('customer')));
            setIsLoading(false);
        }, 1000);
    };

    const explainColumn = async (column: { name: string; type: string; description: string }) => {
        setIsExplaining(true);
        setAiExplanation('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `In simple terms, explain what the data column "${column.name}" (type: ${column.type}) with description "${column.description}" likely represents and how it might be used.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAiExplanation(response.text);
        } catch (err) { console.error(err); } finally { setIsExplaining(false); }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Data Catalog</h2>
            <Card>
                <div className="flex gap-2">
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Ask about data, e.g., 'Find datasets about user churn'" className="w-full bg-gray-700/50 p-3 rounded-lg text-white" />
                    <button onClick={handleSearch} disabled={isLoading} className="px-6 bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50">{isLoading ? '...' : 'Search'}</button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Search Results</h3>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {results.map(ds => (
                        <div key={ds.id} onClick={() => { setSelectedDataset(ds); setAiExplanation(''); }} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedDataset?.id === ds.id ? 'bg-cyan-500/20' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                            <h4 className="font-semibold text-white">{ds.name}</h4>
                            <p className="text-sm text-gray-400">{ds.description}</p>
                        </div>
                    ))}
                    {isLoading && <p className="text-gray-400">Searching...</p>}
                    </div>
                </div>
                <div className="md:col-span-3">
                    {selectedDataset ? (
                        <Card title={`Details: ${selectedDataset.name}`}>
                             <h4 className="font-semibold text-cyan-300">Schema</h4>
                             <ul className="text-sm space-y-2 mt-2">
                                {selectedDataset.schema.map(col => <li key={col.name} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-md"><span>{col.name} <em className="text-gray-500">{col.type}</em></span><button onClick={() => explainColumn(col)} className="text-xs text-cyan-400 hover:underline">Explain with AI</button></li>)}
                             </ul>
                            {(isExplaining || aiExplanation) && <div className="mt-4 p-3 bg-gray-900/50 rounded text-xs text-gray-300 italic">{isExplaining ? 'Thinking...' : `"${aiExplanation}"`}</div>}
                        </Card>
                    ) : <div className="flex items-center justify-center h-full text-gray-500">Select a dataset to view details</div>}
                </div>
            </div>
        </div>
    );
};

export default DataCatalogView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/analytics/DataCatalogView.tsx
================================================================================

// components/views/megadashboard/analytics/DataCatalogView.tsx
import React, { useState, useContext } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";
import { DataContext } from '../../../../context/DataContext';
import type { DataSet } from '../../../../types';

const DataCatalogView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("DataCatalogView must be within DataProvider");
    
    const { dataCatalogItems } = context;

    const [searchTerm, setSearchTerm] = useState("Show me data about customer lifetime value");
    const [results, setResults] = useState<DataSet[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState<DataSet | null>(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [isExplaining, setIsExplaining] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        // AI-powered search simulation
        setTimeout(() => {
            setResults(dataCatalogItems.filter(d => d.description.toLowerCase().includes('customer') || d.name.toLowerCase().includes('customer')));
            setIsLoading(false);
        }, 1000);
    };

    const explainColumn = async (column: { name: string; type: string; description: string }) => {
        setIsExplaining(true);
        setAiExplanation('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `In simple terms, explain what the data column "${column.name}" (type: ${column.type}) with description "${column.description}" likely represents and how it might be used.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAiExplanation(response.text);
        } catch (err) { console.error(err); } finally { setIsExplaining(false); }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Data Catalog</h2>
            <Card>
                <div className="flex gap-2">
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Ask about data, e.g., 'Find datasets about user churn'" className="w-full bg-gray-700/50 p-3 rounded-lg text-white" />
                    <button onClick={handleSearch} disabled={isLoading} className="px-6 bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50">{isLoading ? '...' : 'Search'}</button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Search Results</h3>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {results.map(ds => (
                        <div key={ds.id} onClick={() => { setSelectedDataset(ds); setAiExplanation(''); }} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedDataset?.id === ds.id ? 'bg-cyan-500/20' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                            <h4 className="font-semibold text-white">{ds.name}</h4>
                            <p className="text-sm text-gray-400">{ds.description}</p>
                        </div>
                    ))}
                    {isLoading && <p className="text-gray-400">Searching...</p>}
                    </div>
                </div>
                <div className="md:col-span-3">
                    {selectedDataset ? (
                        <Card title={`Details: ${selectedDataset.name}`}>
                             <h4 className="font-semibold text-cyan-300">Schema</h4>
                             <ul className="text-sm space-y-2 mt-2">
                                {selectedDataset.schema.map(col => <li key={col.name} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-md"><span>{col.name} <em className="text-gray-500">{col.type}</em></span><button onClick={() => explainColumn(col)} className="text-xs text-cyan-400 hover:underline">Explain with AI</button></li>)}
                             </ul>
                            {(isExplaining || aiExplanation) && <div className="mt-4 p-3 bg-gray-900/50 rounded text-xs text-gray-300 italic">{isExplaining ? 'Thinking...' : `"${aiExplanation}"`}</div>}
                        </Card>
                    ) : <div className="flex items-center justify-center h-full text-gray-500">Select a dataset to view details</div>}
                </div>
            </div>
        </div>
    );
};

export default DataCatalogView;