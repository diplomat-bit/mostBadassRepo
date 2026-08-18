// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/analytics/DataLakesView.tsx
================================================================================

// components/views/megadashboard/analytics/DataLakesView.tsx
import React, { useState, useContext } from 'react';
import Card from '../../../Card';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { DataContext } from '../../../../context/DataContext';

const DataLakesView: React.FC = () => {
    const context = useContext(DataContext);
    if(!context) throw new Error("DataLakesView must be within a DataProvider");

    const { dataLakeStats } = context;

    const [prompt, setPrompt] = useState("real-time user clickstream data");
    const [generatedSchema, setGeneratedSchema] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateSchema = async () => {
        setIsLoading(true);
        setGeneratedSchema(null);
        try {
            // Using the provided API endpoint directly for schema generation
            const response = await fetch('https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/oracle/simulate/advanced', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `You are a data architect AI. Design a simple, effective table schema for a new data source described as: "${prompt}". Provide column names and appropriate data types.`,
                    scenarios: [
                        {
                            name: "Schema Generation",
                            events: [],
                            durationYears: 0,
                            sensitivityAnalysisParams: []
                        }
                    ],
                    globalEconomicFactors: {},
                    personalAssumptions: {}
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            // Assuming the API returns the schema in a predictable format within the response
            // This part might need adjustment based on the actual API response structure
            if (result.scenarioResults && result.scenarioResults.length > 0 && result.scenarioResults[0].narrativeSummary) {
                // Attempt to parse the narrative summary as JSON, assuming it contains the schema
                try {
                    setGeneratedSchema(JSON.parse(result.scenarioResults[0].narrativeSummary));
                } catch (parseError) {
                    console.error("Failed to parse schema from API response:", parseError);
                    setGeneratedSchema({ error: "Could not parse schema from response.", rawResponse: result.scenarioResults[0].narrativeSummary });
                }
            } else {
                setGeneratedSchema({ error: "No schema found in API response.", rawResponse: result });
            }
        } catch (err) {
            console.error("Error generating schema:", err);
            setGeneratedSchema({ error: "An error occurred while generating the schema.", details: (err as Error).message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Data Lake Management</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">22.4 PB</p><p className="text-sm text-gray-400 mt-1">Total Volume</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">1,250</p><p className="text-sm text-gray-400 mt-1">Datasets</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">5.2 TB/day</p><p className="text-sm text-gray-400 mt-1">Ingestion Rate</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">500</p><p className="text-sm text-gray-400 mt-1">Active Queries</p></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <Card title="AI Schema Suggester">
                        <p className="text-sm text-gray-400 mb-4">Describe a new data source to ingest.</p>
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-2 rounded text-white" />
                        <button onClick={generateSchema} disabled={isLoading} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50">{isLoading ? 'Generating...' : 'Suggest Schema'}</button>
                        {generatedSchema && (
                            <pre className="text-xs mt-4 bg-gray-900/50 p-2 rounded max-h-48 overflow-auto">
                                {JSON.stringify(generatedSchema, null, 2)}
                            </pre>
                        )}
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <Card title="Data Volume by Domain (PB)">
                        <ResponsiveContainer width="100%" height={400}>
                            <Treemap data={dataLakeStats} dataKey="size" ratio={16 / 9} stroke="#fff" fill="#8884d8">
                                 <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => `${value} PB`}/>
                            </Treemap>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DataLakesView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/analytics/DataLakesView.tsx
================================================================================

```tsx
// components/views/megadashboard/analytics/DataLakesView.tsx
import React, { useState, useContext, useMemo, useCallback } from 'react';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI, Type } from "@google/genai";
import { Treemap, ResponsiveContainer, Tooltip, AreaChart, BarChart, XAxis, YAxis, CartesianGrid, Area, Bar, Legend } from 'recharts';
import ReactFlow, { MiniMap, Controls, Background, BackgroundVariant, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Database, FileCode, Bot, BrainCircuit, LineChart, BarChart2, Search, ChevronsUpDown, ChevronDown, Network, Cable, ShieldCheck } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface DataLakeMetric {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
}

interface IngestionDataPoint {
    date: string;
    rate: number;
}

interface QueryPerformanceMetric {
    name: string;
    'Avg Latency (ms)': number;
    'Queries per Second': number;
}

interface Dataset {
    id: string;
    name: string;
    domain: string;
    owner: string;
    size: number; // in TB
    freshness: string;
    qualityScore: number;
    description: string;
    tags: string[];
    schema: { name: string; type: string }[];
}

interface Connector {
    name: string;
    icon: string; // URL to logo or component
    type: 'Database' | 'SaaS' | 'Storage' | 'Streaming';
}

const TABS = ['Overview', 'Dataset Catalog', 'AI Co-pilot', 'Data Lineage', 'Connectivity Hub'];

// --- MOCK DATA (assumed to be from DataContext or API calls) ---
const mockIngestionHistory: IngestionDataPoint[] = Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    rate: 4.5 + Math.sin(i / 5) + Math.random() * 0.5,
}));

const mockQueryPerformance: QueryPerformanceMetric[] = [
    { name: 'Marketing Analytics', 'Avg Latency (ms)': 120, 'Queries per Second': 50 },
    { name: 'Sales Reporting', 'Avg Latency (ms)': 85, 'Queries per Second': 75 },
    { name: 'Fraud Detection', 'Avg Latency (ms)': 30, 'Queries per Second': 200 },
    { name: 'Product Recommendation', 'Avg Latency (ms)': 55, 'Queries per Second': 150 },
    { name: 'Risk Assessment', 'Avg Latency (ms)': 250, 'Queries per Second': 20 },
];

const mockDatasets: Dataset[] = [
    { id: 'ds-001', name: 'customer_profiles', domain: 'CRM', owner: 'Sales Team', size: 1.2, freshness: '2 hours ago', qualityScore: 95, description: 'Core customer data including demographics and contact info.', tags: ['PII', 'customer', 'core'], schema: [{name: 'id', type: 'UUID'}, {name: 'first_name', type: 'VARCHAR'}, {name: 'email', type: 'VARCHAR'}]},
    { id: 'ds-002', name: 'product_catalog', domain: 'E-commerce', owner: 'Product Team', size: 0.5, freshness: '1 day ago', qualityScore: 99, description: 'All products available for sale on the platform.', tags: ['product', 'catalog'], schema: [{name: 'sku', type: 'VARCHAR'}, {name: 'price', type: 'DECIMAL'}]},
    { id: 'ds-003', name: 'web_events_stream', domain: 'Analytics', owner: 'Marketing Team', size: 15.0, freshness: 'Real-time', qualityScore: 88, description: 'Raw user clickstream data from the website.', tags: ['events', 'clickstream'], schema: [{name: 'session_id', type: 'VARCHAR'}, {name: 'event_type', type: 'VARCHAR'}, {name: 'timestamp', type: 'TIMESTAMP'}]},
    { id: 'ds-004', name: 'financial_transactions', domain: 'Finance', owner: 'Finance Team', size: 3.2, freshness: '30 minutes ago', qualityScore: 98, description: 'All financial transactions processed by the system.', tags: ['finance', 'transactions', 'sensitive'], schema: [{name: 'transaction_id', type: 'UUID'}, {name: 'amount', type: 'DECIMAL'}, {name: 'user_id', type: 'UUID'}]},
];

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Web Events Stream' }, type: 'input' },
  { id: '2', position: { x: 0, y: 200 }, data: { label: 'CRM Customer Data' }, type: 'input' },
  { id: '3', position: { x: 300, y: 100 }, data: { label: 'ETL: Sessionize Events' } },
  { id: '4', position: { x: 600, y: 100 }, data: { label: 'Aggregated User Sessions' }, type: 'output' },
  { id: '5', position: { x: 900, y: 200 }, data: { label: 'Marketing Analytics Dashboard' }, type: 'output' },
];

const initialEdges: Edge[] = [
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5', animated: true },
];

const mockConnectors: Connector[] = [
    { name: 'AWS S3', icon: 'aws', type: 'Storage' },
    { name: 'Google BigQuery', icon: 'gcp', type: 'Database' },
    { name: 'Salesforce', icon: 'salesforce', type: 'SaaS' },
    { name: 'Snowflake', icon: 'snowflake', type: 'Database' },
    { name: 'Azure Blob Storage', icon: 'azure', type: 'Storage' },
    { name: 'Apache Kafka', icon: 'kafka', type: 'Streaming' },
    { name: 'Databricks', icon: 'databricks', type: 'Database'},
    { name: 'HubSpot', icon: 'hubspot', type: 'SaaS'}
];

// --- API HELPER ---
const callGenerativeAI = async (promptText: string, jsonSchema?: any) => {
    // In a real app, API key management would be more secure.
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY is not set in environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const modelConfig = jsonSchema 
        ? { responseMimeType: "application/json", responseSchema: jsonSchema } 
        : {};

    const response = await ai.models.generateContent({ 
        model: 'gemini-pro', 
        contents: promptText, 
        config: modelConfig 
    });
    
    return jsonSchema ? JSON.parse(response.text) : response.text;
};

// --- SUB-COMPONENTS ---

const StatCard: React.FC<DataLakeMetric> = ({ title, value, description, icon: Icon }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-800 transition-colors duration-300">
        <div className="bg-gray-700 p-3 rounded-full">
             <Icon className="text-cyan-400 h-6 w-6" />
        </div>
        <div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{title}</p>
        </div>
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-700 border border-gray-600 rounded-lg shadow-xl text-white">
        <p className="label font-bold">{label}</p>
        {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value.toFixed(2)} TB/day`}</p>
        ))}
      </div>
    );
  }
  return null;
};

const OverviewTab: React.FC<{ dataLakeStats: any[] }> = ({ dataLakeStats }) => {
    const metrics: DataLakeMetric[] = [
        { title: 'Total Volume', value: '22.4 PB', description: 'Total data stored across all lakes.', icon: Database },
        { title: 'Datasets', value: '1,250', description: 'Total number of distinct datasets.', icon: FileCode },
        { title: 'Avg Ingestion Rate', value: '5.2 TB/day', description: 'Average data ingested daily.', icon: LineChart },
        { title: 'Active Queries', value: '500+', description: 'Concurrent queries running now.', icon: BarChart2 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map(metric => <StatCard key={metric.title} {...metric} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Ingestion Rate (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={mockIngestionHistory}>
                            <defs>
                                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} unit=" TB/d" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="rate" stroke="#22d3ee" fillOpacity={1} fill="url(#colorRate)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg">
                     <h3 className="text-xl font-semibold text-white mb-4">Data Volume by Domain</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <Treemap data={dataLakeStats} dataKey="size" ratio={16 / 9} stroke="#1f2937" fill="#0891b2" content={<CustomizedContent colors={['#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9']}/>}>
                             <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => `${value} PB`}/>
                        </Treemap>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Query Performance by Workload</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockQueryPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" fontSize={12} unit=" ms" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" fontSize={12} unit=" q/s" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                        <Legend />
                        <Bar yAxisId="left" dataKey="Avg Latency (ms)" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="Queries per Second" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const CustomizedContent = ({ root, depth, x, y, width, height, index, colors, name }: any) => {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth === 1 ? colors[index % colors.length] : 'none',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {depth === 1 ? (
                <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
                    {name}
                </text>
            ) : null}
        </g>
    );
};


const DatasetCatalogTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Dataset; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

    const filteredAndSortedDatasets = useMemo(() => {
        const filtered = mockDatasets.filter(ds => 
            ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ds.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ds.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        return filtered.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [searchTerm, sortConfig]);

    const requestSort = (key: keyof Dataset) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const renderSortArrow = (key: keyof Dataset) => {
        if (sortConfig.key !== key) return <ChevronsUpDown className="h-4 w-4 inline ml-1 text-gray-500" />;
        return <ChevronDown className={`h-4 w-4 inline ml-1 text-white transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Dataset Catalog</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search datasets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-700/50 pl-10 pr-4 py-2 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead className="bg-gray-700/50 text-xs text-gray-400 uppercase">
                                <tr>
                                    {['name', 'domain', 'owner', 'size', 'freshness', 'qualityScore'].map(key => (
                                        <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key as keyof Dataset)}>
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            {renderSortArrow(key as keyof Dataset)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedDatasets.map(ds => (
                                    <tr key={ds.id} className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer" onClick={() => setSelectedDataset(ds)}>
                                        <td className="px-6 py-4 font-medium text-white">{ds.name}</td>
                                        <td className="px-6 py-4">{ds.domain}</td>
                                        <td className="px-6 py-4">{ds.owner}</td>
                                        <td className="px-6 py-4">{ds.size} TB</td>
                                        <td className="px-6 py-4">{ds.freshness}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-full bg-gray-600 rounded-full h-2.5">
                                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${ds.qualityScore}%` }}></div>
                                            </div>
                                            <span className="text-xs">{ds.qualityScore}%</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1">
                {selectedDataset && (
                    <div className="bg-gray-800/50 p-6 rounded-lg sticky top-6">
                        <h4 className="text-2xl font-bold text-white mb-2">{selectedDataset.name}</h4>
                        <p className="text-gray-400 mb-4">{selectedDataset.description}</p>
                        <div className="space-y-2 text-sm">
                            <p><strong>Owner:</strong> {selectedDataset.owner}</p>
                            <p><strong>Domain:</strong> {selectedDataset.domain}</p>
                            <p><strong>Size:</strong> {selectedDataset.size} TB</p>
                            <p><strong>Last Updated:</strong> {selectedDataset.freshness}</p>
                            <p><strong>Tags:</strong> {selectedDataset.tags.map(t => <span key={t} className="bg-cyan-800/50 text-cyan-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{t}</span>)}</p>
                        </div>
                        <h5 className="text-lg font-semibold text-white mt-6 mb-2">Schema</h5>
                        <div className="max-h-60 overflow-y-auto bg-gray-900/70 p-3 rounded">
                            <ul className="text-sm">
                                {selectedDataset.schema.map(col => (
                                    <li key={col.name} className="flex justify-between font-mono">
                                        <span>{col.name}</span>
                                        <span className="text-cyan-400">{col.type}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AICopilotTab: React.FC = () => {
    const [activeTool, setActiveTool] = useState('Schema Architect');
    const [prompt, setPrompt] = useState("real-time user clickstream data");
    const [sqlPrompt, setSqlPrompt] = useState("Show me the total number of unique users from the web events stream for yesterday.");
    const [piiSchema, setPiiSchema] = useState(JSON.stringify(mockDatasets[0].schema, null, 2));
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedContent(null);
        setError(null);

        let promptText = '';
        let jsonSchema = undefined;

        try {
            switch (activeTool) {
                case 'Schema Architect':
                    promptText = `You are a world-class data architect AI. Design a comprehensive and efficient table schema for a new data source described as: "${prompt}". 
                    Provide a suitable table name, column names with appropriate, specific data types (e.g., VARCHAR(255), TIMESTAMP WITH TIME ZONE, DECIMAL(10, 2)), and a brief description for each column.
                    Also, provide recommendations for partitioning strategy (e.g., by date, by region) and a list of suggested indexes to optimize query performance.
                    Finally, generate a boilerplate Python script using Pandas and PyArrow to ingest a sample CSV into a Parquet file based on this schema.`;
                    jsonSchema = {
                        type: Type.OBJECT,
                        properties: {
                            tableName: { type: Type.STRING },
                            columns: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        type: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                    }
                                }
                            },
                            partitioningStrategy: { type: Type.STRING },
                            suggestedIndexes: { type: Type.ARRAY, items: { type: Type.STRING } },
                            ingestionScript: { type: Type.STRING },
                        }
                    };
                    break;
                case 'Natural Language to SQL':
                    const schemaContext = mockDatasets.map(ds => `Table ${ds.name}: columns(${ds.schema.map(s => `${s.name} ${s.type}`).join(', ')})`).join('\n');
                    promptText = `You are an expert SQL analyst AI. Given the following table schemas:\n${schemaContext}\n\nTranslate the following natural language question into a valid, efficient SQL query for a PostgreSQL database. Do not explain the query, just provide the SQL code. Question: "${sqlPrompt}"`;
                    break;
                case 'Data Governance AI':
                    promptText = `You are a data privacy and governance expert. Analyze the following table schema: ${piiSchema}.
                    Identify any columns that are likely to contain Personally Identifiable Information (PII) or other sensitive data.
                    For each identified column, explain the risk and suggest a concrete remediation strategy (e.g., 'Mask with SHA-256 hash', 'Redact with XXXX', 'Tokenize via API').
                    Provide your output as a structured JSON object.`;
                    jsonSchema = {
                        type: Type.OBJECT,
                        properties: {
                            analysis: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        column: { type: Type.STRING },
                                        piiType: { type: Type.STRING },
                                        risk: { type: Type.STRING },
                                        remediation: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    };
                    break;
            }

            const response = await callGenerativeAI(promptText, jsonSchema);
            setGeneratedContent(response);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred while communicating with the AI service.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderTool = () => {
        switch (activeTool) {
            case 'Schema Architect':
                return <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe a new data source to ingest..." className="w-full h-24 bg-gray-700/50 p-2 rounded text-white" />;
            case 'Natural Language to SQL':
                return <textarea value={sqlPrompt} onChange={e => setSqlPrompt(e.target.value)} placeholder="Ask a question about your data in plain English..." className="w-full h-24 bg-gray-700/50 p-2 rounded text-white" />;
            case 'Data Governance AI':
                return <textarea value={piiSchema} onChange={e => setPiiSchema(e.target.value)} placeholder="Paste a JSON schema here..." className="w-full h-24 bg-gray-700/50 p-2 rounded text-white font-mono text-xs" />;
            default:
                return null;
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-gray-800/50 p-6 rounded-lg space-y-3">
                    <h3 className="text-xl font-semibold text-white">AI Tools</h3>
                    {['Schema Architect', 'Natural Language to SQL', 'Data Governance AI'].map(tool => (
                        <button key={tool} onClick={() => { setActiveTool(tool); setGeneratedContent(null); setError(null); }} className={`w-full text-left p-3 rounded-lg transition-colors ${activeTool === tool ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            {tool}
                        </button>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-2">
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">{activeTool}</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        {activeTool === 'Schema Architect' && 'Describe a data source, and our AI will design a complete, optimized schema and ingestion pipeline for it.'}
                        {activeTool === 'Natural Language to SQL' && 'Ask questions in plain English, and our AI will translate them into executable SQL queries against your datasets.'}
                        {activeTool === 'Data Governance AI' && 'Provide a schema, and our AI will scan for potential PII and suggest remediation strategies.'}
                    </p>
                    {renderTool()}
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Generating...
                            </>
                        ) : 'Generate'}
                    </button>
                    {error && <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">{error}</div>}
                    {generatedContent && (
                        <div className="mt-4 bg-gray-900/50 p-4 rounded max-h-[60vh] overflow-auto">
                            <h4 className="text-lg font-semibold text-white mb-2">AI Response</h4>
                            <pre className="text-xs text-gray-200 whitespace-pre-wrap font-mono">
                                {typeof generatedContent === 'string' ? generatedContent : JSON.stringify(generatedContent, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DataLineageTab = () => (
    <div className="bg-gray-800/50 p-6 rounded-lg" style={{ height: '75vh' }}>
        <h3 className="text-xl font-semibold text-white mb-4">Data Lineage Explorer</h3>
        <p className="text-gray-400 mb-4">Visualize how data flows and transforms between datasets.</p>
        <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            fitView
        >
            <MiniMap nodeColor="#06b6d4" />
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
    </div>
);

const ConnectivityHubTab = () => (
    <div className="bg-gray-800/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Connectivity Hub</h3>
        <p className="text-gray-400 mb-6">Connect to a wide range of data sources to ingest into your data lake.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockConnectors.map(connector => (
                <div key={connector.name} className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-gray-700 transition-colors cursor-pointer">
                    {/* In a real app, this would be an actual logo component/SVG */}
                    <div className="text-4xl mb-3">🌐</div> 
                    <p className="font-semibold text-white">{connector.name}</p>
                    <p className="text-xs text-gray-400">{connector.type}</p>
                </div>
            ))}
            <div className="bg-gray-700/50 border-2 border-dashed border-gray-600 p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-gray-700 hover:border-cyan-500 transition-colors cursor-pointer">
                <div className="text-4xl mb-3 text-gray-500">+</div>
                <p className="font-semibold text-white">Add New</p>
                <p className="text-xs text-gray-400">Connector</p>
            </div>
        </div>
    </div>
);

// --- MAIN COMPONENT ---
const DataLakesView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("DataLakesView must be within a DataProvider");

    const { dataLakeStats } = context;
    const [activeTab, setActiveTab] = useState(TABS[0]);

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewTab dataLakeStats={dataLakeStats} />;
            case 'Dataset Catalog':
                return <DatasetCatalogTab />;
            case 'AI Co-pilot':
                return <AICopilotTab />;
            case 'Data Lineage':
                return <DataLineageTab />;
            case 'Connectivity Hub':
                return <ConnectivityHubTab />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Data Lake Management</h2>
                <div className="flex items-center space-x-2 bg-gray-800/50 p-1 rounded-lg">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                activeTab === tab
                                    ? 'bg-cyan-600 text-white shadow'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="mt-6">
                {renderActiveTab()}
            </div>
        </div>
    );
};

export default DataLakesView;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/analytics/DataLakesView.tsx
================================================================================

// components/views/megadashboard/analytics/DataLakesView.tsx
import React, { useState, useContext } from 'react';
import Card from '../../../Card';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { DataContext } from '../../../../context/DataContext';

const DataLakesView: React.FC = () => {
    const context = useContext(DataContext);
    if(!context) throw new Error("DataLakesView must be within a DataProvider");

    const { dataLakeStats } = context;

    const [prompt, setPrompt] = useState("real-time user clickstream data");
    const [generatedSchema, setGeneratedSchema] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateSchema = async () => {
        setIsLoading(true);
        setGeneratedSchema(null);
        try {
            // Using the provided API endpoint directly for schema generation
            const response = await fetch('https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/oracle/simulate/advanced', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `You are a data architect AI. Design a simple, effective table schema for a new data source described as: "${prompt}". Provide column names and appropriate data types.`,
                    scenarios: [
                        {
                            name: "Schema Generation",
                            events: [],
                            durationYears: 0,
                            sensitivityAnalysisParams: []
                        }
                    ],
                    globalEconomicFactors: {},
                    personalAssumptions: {}
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            // Assuming the API returns the schema in a predictable format within the response
            // This part might need adjustment based on the actual API response structure
            if (result.scenarioResults && result.scenarioResults.length > 0 && result.scenarioResults[0].narrativeSummary) {
                // Attempt to parse the narrative summary as JSON, assuming it contains the schema
                try {
                    setGeneratedSchema(JSON.parse(result.scenarioResults[0].narrativeSummary));
                } catch (parseError) {
                    console.error("Failed to parse schema from API response:", parseError);
                    setGeneratedSchema({ error: "Could not parse schema from response.", rawResponse: result.scenarioResults[0].narrativeSummary });
                }
            } else {
                setGeneratedSchema({ error: "No schema found in API response.", rawResponse: result });
            }
        } catch (err) {
            console.error("Error generating schema:", err);
            setGeneratedSchema({ error: "An error occurred while generating the schema.", details: (err as Error).message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Data Lake Management</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">22.4 PB</p><p className="text-sm text-gray-400 mt-1">Total Volume</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">1,250</p><p className="text-sm text-gray-400 mt-1">Datasets</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">5.2 TB/day</p><p className="text-sm text-gray-400 mt-1">Ingestion Rate</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">500</p><p className="text-sm text-gray-400 mt-1">Active Queries</p></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <Card title="AI Schema Suggester">
                        <p className="text-sm text-gray-400 mb-4">Describe a new data source to ingest.</p>
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-2 rounded text-white" />
                        <button onClick={generateSchema} disabled={isLoading} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50">{isLoading ? 'Generating...' : 'Suggest Schema'}</button>
                        {generatedSchema && (
                            <pre className="text-xs mt-4 bg-gray-900/50 p-2 rounded max-h-48 overflow-auto">
                                {JSON.stringify(generatedSchema, null, 2)}
                            </pre>
                        )}
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <Card title="Data Volume by Domain (PB)">
                        <ResponsiveContainer width="100%" height={400}>
                            <Treemap data={dataLakeStats} dataKey="size" ratio={16 / 9} stroke="#fff" fill="#8884d8">
                                 <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => `${value} PB`}/>
                            </Treemap>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DataLakesView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/analytics/DataLakesView.tsx
================================================================================

// components/views/megadashboard/analytics/DataLakesView.tsx
import React, { useState, useContext } from 'react';
import Card from '../../../Card';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { DataContext } from '../../../../context/DataContext';

const DataLakesView: React.FC = () => {
    const context = useContext(DataContext);
    if(!context) throw new Error("DataLakesView must be within a DataProvider");

    const { dataLakeStats } = context;

    const [prompt, setPrompt] = useState("real-time user clickstream data");
    const [generatedSchema, setGeneratedSchema] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateSchema = async () => {
        setIsLoading(true);
        setGeneratedSchema(null);
        try {
            // Using the provided API endpoint directly for schema generation
            const response = await fetch('https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/oracle/simulate/advanced', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `You are a data architect AI. Design a simple, effective table schema for a new data source described as: "${prompt}". Provide column names and appropriate data types.`,
                    scenarios: [
                        {
                            name: "Schema Generation",
                            events: [],
                            durationYears: 0,
                            sensitivityAnalysisParams: []
                        }
                    ],
                    globalEconomicFactors: {},
                    personalAssumptions: {}
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            // Assuming the API returns the schema in a predictable format within the response
            // This part might need adjustment based on the actual API response structure
            if (result.scenarioResults && result.scenarioResults.length > 0 && result.scenarioResults[0].narrativeSummary) {
                // Attempt to parse the narrative summary as JSON, assuming it contains the schema
                try {
                    setGeneratedSchema(JSON.parse(result.scenarioResults[0].narrativeSummary));
                } catch (parseError) {
                    console.error("Failed to parse schema from API response:", parseError);
                    setGeneratedSchema({ error: "Could not parse schema from response.", rawResponse: result.scenarioResults[0].narrativeSummary });
                }
            } else {
                setGeneratedSchema({ error: "No schema found in API response.", rawResponse: result });
            }
        } catch (err) {
            console.error("Error generating schema:", err);
            setGeneratedSchema({ error: "An error occurred while generating the schema.", details: (err as Error).message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Data Lake Management</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">22.4 PB</p><p className="text-sm text-gray-400 mt-1">Total Volume</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">1,250</p><p className="text-sm text-gray-400 mt-1">Datasets</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">5.2 TB/day</p><p className="text-sm text-gray-400 mt-1">Ingestion Rate</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">500</p><p className="text-sm text-gray-400 mt-1">Active Queries</p></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <Card title="AI Schema Suggester">
                        <p className="text-sm text-gray-400 mb-4">Describe a new data source to ingest.</p>
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-2 rounded text-white" />
                        <button onClick={generateSchema} disabled={isLoading} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50">{isLoading ? 'Generating...' : 'Suggest Schema'}</button>
                        {generatedSchema && (
                            <pre className="text-xs mt-4 bg-gray-900/50 p-2 rounded max-h-48 overflow-auto">
                                {JSON.stringify(generatedSchema, null, 2)}
                            </pre>
                        )}
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <Card title="Data Volume by Domain (PB)">
                        <ResponsiveContainer width="100%" height={400}>
                            <Treemap data={dataLakeStats} dataKey="size" ratio={16 / 9} stroke="#fff" fill="#8884d8">
                                 <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => `${value} PB`}/>
                            </Treemap>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DataLakesView;