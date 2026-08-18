// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankSearchSuiteView.tsx
================================================================================

// components/views/platform/DemoBankSearchSuiteView.tsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

// --- TYPE DEFINITIONS ---
type SearchScope = 'documents' | 'transactions' | 'customers' | 'knowledge_base';

interface SearchQuery {
    [key: string]: any;
}

interface SearchResultItem {
    id: string;
    score: number;
    title: string;
    snippet: string;
    metadata: Record<string, any>;
}

interface SearchResponse {
    hits: SearchResultItem[];
    total: number;
    took: number;
    aggregations?: Record<string, any>;
}

interface HistoryItem {
    id: string;
    timestamp: string;
    prompt: string;
    scope: SearchScope;
    config: SearchQuery;
}

// --- ICONS (inlined SVGs to avoid external dependencies) ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.19-9.51L1 10"></path></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const WandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H18a2 2 0 0 1 2 2v3.5L8.5 18H5a2 2 0 0 1-2-2V12.5L14.5 2z"></path><line x1="12" y1="15" x2="18" y2="9"></line></svg>;

// --- MOCK DATA & UTILITIES ---
const generateMockResults = (query: SearchQuery): SearchResponse => {
    const total = Math.floor(Math.random() * 200) + 50;
    const size = query.pagination?.size ?? 10;
    const hits = Array.from({ length: Math.min(size, total) }, (_, i) => ({
        id: `doc_${Math.random().toString(36).substring(2, 15)}`,
        score: Math.random() * 10,
        title: `Financial Result ${i + 1} for ${query.query || 'query'}`,
        snippet: `This document contains details about financial performance, including revenue, profit margins, and projections. Generated based on query: ${JSON.stringify(query)}`,
        metadata: {
            author: ['John Doe', 'Jane Smith', 'AI Analyst'][Math.floor(Math.random() * 3)],
            createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            category: query.filters?.find(f => f.field === 'category')?.value || 'General',
        },
    }));

    let aggregations = {};
    if (query.aggregations) {
        query.aggregations.forEach(agg => {
            if (agg.type === 'terms') {
                aggregations[agg.name] = {
                    buckets: [
                        { key: 'Q1 Reports', doc_count: 120 },
                        { key: 'Annual Summaries', doc_count: 85 },
                        { key: 'SEC Filings', doc_count: 40 },
                    ]
                };
            }
            if (agg.type === 'sum') {
                aggregations[agg.name] = { value: Math.random() * 1e6 };
            }
        });
    }

    return {
        hits,
        total,
        took: Math.floor(Math.random() * 100) + 10,
        aggregations: Object.keys(aggregations).length > 0 ? aggregations : undefined,
    };
};

const SEARCH_PROMPT_EXAMPLES: Record<SearchScope, string[]> = {
    documents: [
        "Find all financial reports from last quarter, boosting new results",
        "Search for compliance documents related to GDPR, filter by author 'Legal Team'",
        "Show me marketing presentations from 2023 sorted by last modified date"
    ],
    transactions: [
        "What was our total spending on software last month? Group by merchant.",
        "Find all transactions over $10,000 in the last 7 days",
        "Show me all international payments to 'Supplier Corp' sorted by amount descending"
    ],
    customers: [
        "List all enterprise customers in 'North America' who signed up this year",
        "Find customers with a high 'engagement_score' but no recent purchases",
        "Show me a list of customers in the 'Finance' industry sorted by 'ARR'"
    ],
    knowledge_base: [
        "How to reset my password for the trading platform?",
        "Articles about setting up multi-factor authentication",
        "Search for API documentation regarding the 'payments' endpoint"
    ]
};

// --- SEARCH SCHEMAS FOR AI ---
const SEARCH_SCHEMAS: Record<SearchScope, object> = {
    documents: {
        type: Type.OBJECT,
        properties: {
            query: { type: Type.STRING, description: "The main search keyword or phrase." },
            filters: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { field: {type: Type.STRING}, value: {type: Type.STRING}} } },
            date_range: { type: Type.OBJECT, properties: { field: { type: Type.STRING }, gte: { type: Type.STRING, description: "start date in ISO format" }, lte: { type: Type.STRING, description: "end date in ISO format" } } },
            boost: { type: Type.OBJECT, properties: { field: { type: Type.STRING }, factor: { type: Type.NUMBER } } },
            sort: { type: Type.OBJECT, properties: { field: { type: Type.STRING }, order: { type: Type.ENUM, enum: ['asc', 'desc'] } } },
            pagination: { type: Type.OBJECT, properties: { from: { type: Type.NUMBER }, size: { type: Type.NUMBER } } }
        },
        required: ["query"]
    },
    transactions: {
        type: Type.OBJECT,
        properties: {
            query_string: { type: Type.STRING, description: "A free-text search across multiple fields like merchant name, description, etc." },
            filters: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { field: {type: Type.STRING}, value: {type: Type.STRING | Type.NUMBER}} } },
            amount_range: { type: Type.OBJECT, properties: { gte: { type: Type.NUMBER }, lte: { type: Type.NUMBER } } },
            date_range: { type: Type.OBJECT, properties: { field: { type: Type.STRING }, gte: { type: Type.STRING }, lte: { type: Type.STRING } } },
            sort: { type: Type.OBJECT, properties: { field: { type: Type.STRING }, order: { type: Type.ENUM, enum: ['asc', 'desc'] } } },
            aggregations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.ENUM, enum: ['terms', 'sum', 'avg']}, field: {type: Type.STRING}} } }
        }
    },
    customers: {
        type: Type.OBJECT,
        properties: {
            query: { type: Type.STRING, description: "Search query for customer name, company, or email." },
            filters: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { field: { type: Type.STRING }, operator: { type: Type.ENUM, enum: ['eq', 'neq', 'gt', 'lt'] }, value: { type: Type.STRING | Type.NUMBER | Type.BOOLEAN } } } },
            sort: { type: Type.OBJECT, properties: { field: { type: Type.STRING }, order: { type: Type.ENUM, enum: ['asc', 'desc'] } } },
            pagination: { type: Type.OBJECT, properties: { page: { type: Type.NUMBER }, per_page: { type: Type.NUMBER } } }
        },
        required: ["filters"]
    },
    knowledge_base: {
        type: Type.OBJECT,
        properties: {
            natural_language_query: { type: Type.STRING, description: "The user's question in plain English." },
            vector_search: { type: Type.BOOLEAN, description: "Set to true to use semantic vector search for better relevance." },
            filters: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, tags: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
        },
        required: ["natural_language_query"]
    }
};

// --- MAIN COMPONENT ---
const DemoBankSearchSuiteView: React.FC = () => {
    const [prompt, setPrompt] = useState<string>("search for 'financial report' but boost results from the last quarter");
    const [selectedScope, setSelectedScope] = useState<SearchScope>('documents');
    const [generatedConfig, setGeneratedConfig] = useState<SearchQuery | null>(null);
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string>('');
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

    const ai = useMemo(() => apiKey ? new GoogleGenAI({ apiKey }) : null, [apiKey]);

    useEffect(() => {
        const storedApiKey = localStorage.getItem('gemini_api_key');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        } else {
            setIsApiKeyModalOpen(true);
        }

        const storedHistory = localStorage.getItem('searchSuiteHistory');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);
    
    const saveApiKey = (key: string) => {
        if(key) {
            setApiKey(key);
            localStorage.setItem('gemini_api_key', key);
            setIsApiKeyModalOpen(false);
        }
    };

    const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
        setHistory(prev => {
            const newHistory = [
                { ...item, id: new Date().toISOString(), timestamp: new Date().toLocaleString() },
                ...prev
            ].slice(0, 20); // Keep last 20 items
            localStorage.setItem('searchSuiteHistory', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const handleGenerate = useCallback(async () => {
        if (!ai) {
            setIsApiKeyModalOpen(true);
            setError("API Key is not configured.");
            return;
        }
        if (!prompt) return;

        setIsLoading(true);
        setError(null);
        setGeneratedConfig(null);
        setSearchResults(null);

        try {
            const schema = SEARCH_SCHEMAS[selectedScope];
            const fullPrompt = `You are an expert search engineer. Your task is to translate a natural language search request into a structured JSON query object that conforms to the provided schema. Request: "${prompt}"`;
            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: fullPrompt,
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            
            const config = JSON.parse(response.text);
            setGeneratedConfig(config);
            addToHistory({ prompt, scope: selectedScope, config });
        } catch (err: any) {
            console.error(err);
            setError(`Failed to generate query: ${err.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, selectedScope, ai]);

    const handleExecuteSearch = useCallback(async () => {
        if (!generatedConfig) return;
        setIsSearching(true);
        setSearchResults(null);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            const results = generateMockResults(generatedConfig);
            setSearchResults(results);
        } catch (err: any) {
             setError(`Failed to execute search: ${err.message || 'Unknown error'}`);
        } finally {
            setIsSearching(false);
        }
    }, [generatedConfig]);

    const handleSelectHistory = (item: HistoryItem) => {
        setPrompt(item.prompt);
        setSelectedScope(item.scope);
        setGeneratedConfig(item.config);
        setSearchResults(null);
        setError(null);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('searchSuiteHistory');
    }

    const handleSelectExample = (example: string) => {
        setPrompt(example);
        setGeneratedConfig(null);
        setSearchResults(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
             {isApiKeyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Enter Google AI API Key</h2>
                        <p className="text-gray-400 mb-6">To use the AI-powered features, please provide your Google Gemini API key. It will be stored locally in your browser.</p>
                        <input
                            type="password"
                            placeholder="Your Gemini API Key"
                            className="w-full bg-gray-700 p-3 rounded text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            onKeyDown={(e) => { if (e.key === 'Enter') saveApiKey((e.target as HTMLInputElement).value); }}
                            id="apiKeyInput"
                        />
                        <button 
                            onClick={() => saveApiKey((document.getElementById('apiKeyInput') as HTMLInputElement).value)} 
                            className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded transition-colors font-semibold"
                        >
                            Save Key
                        </button>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold tracking-wider flex items-center gap-3"><SearchIcon /> Demo Bank Search Suite</h1>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* --- LEFT PANEL: History & Configuration --- */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                     <Card title="Search History" icon={<HistoryIcon />} headerActions={<button onClick={clearHistory} className="text-gray-400 hover:text-white"><TrashIcon/></button>}>
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {history.length > 0 ? history.map(item => (
                                <div key={item.id} onClick={() => handleSelectHistory(item)} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/70 cursor-pointer transition-colors">
                                    <p className="text-sm text-cyan-400 font-mono truncate" title={item.prompt}>{item.prompt}</p>
                                    <p className="text-xs text-gray-400">{item.timestamp} - <span className="font-semibold capitalize">{item.scope}</span></p>
                                </div>
                            )) : <p className="text-sm text-gray-500 italic">Your search history will appear here.</p>}
                        </div>
                    </Card>
                </div>
                
                {/* --- MIDDLE PANEL: Query Builder & Generated Config --- */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <Card title="AI Search Query Generator" icon={<WandIcon/>}>
                        <div className="space-y-4">
                             <div>
                                <label className="text-sm font-semibold text-gray-300 mb-2 block">Search Scope</label>
                                <select value={selectedScope} onChange={e => setSelectedScope(e.target.value as SearchScope)} className="w-full bg-gray-700 p-3 rounded text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none capitalize">
                                    {Object.keys(SEARCH_SCHEMAS).map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-2 block">Natural Language Prompt</label>
                                <textarea
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    placeholder="e.g., 'Find all transactions over $5000 from last month'"
                                    className="w-full h-32 bg-gray-700 p-3 rounded text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                />
                            </div>
                            <div className="text-xs text-gray-400 space-y-1">
                                <p>Examples for "{selectedScope.replace('_', ' ')}":</p>
                                {SEARCH_PROMPT_EXAMPLES[selectedScope].map(ex => (
                                    <button key={ex} onClick={() => handleSelectExample(ex)} className="block text-left text-cyan-400 hover:text-cyan-300 hover:underline">
                                        - {ex}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full mt-2 py-3 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2">
                                {isLoading ? 'Generating...' : 'Generate Query Configuration'}
                            </button>
                            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        </div>
                    </Card>
                    
                    {(isLoading || generatedConfig) && (
                        <Card title="Generated Search Config">
                             <div className="relative">
                                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded-lg max-h-96 overflow-auto">
                                    {isLoading ? 'Generating...' :
                                        <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0, margin: 0 }}>
                                            {JSON.stringify(generatedConfig, null, 2)}
                                        </SyntaxHighlighter>
                                    }
                                </pre>
                                {!isLoading && generatedConfig && (
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedConfig, null, 2))} className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"><CopyIcon/></button>
                                        <button onClick={handleExecuteSearch} disabled={isSearching} className="p-2 bg-cyan-600 rounded hover:bg-cyan-500 transition-colors flex items-center gap-1 disabled:opacity-50">
                                            <PlayIcon/>
                                            <span className="text-sm font-semibold">{isSearching ? 'Executing...' : 'Execute'}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* --- RIGHT PANEL: Search Results --- */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <Card title="Simulated Search Results">
                         {isSearching && <p className="text-gray-400">Searching...</p>}
                         {!isSearching && !searchResults && <p className="text-gray-500 italic">Execute a query to see simulated results here.</p>}
                         {searchResults && (
                             <div className="space-y-4">
                                 <p className="text-sm text-gray-400">Found {searchResults.total} results in {searchResults.took}ms.</p>
                                 <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                                     {searchResults.hits.map(hit => (
                                         <div key={hit.id} className="p-4 bg-gray-800/50 rounded-lg">
                                             <h4 className="font-semibold text-cyan-400">{hit.title}</h4>
                                             <p className="text-sm text-gray-300 mt-1">{hit.snippet}</p>
                                             <div className="text-xs text-gray-500 mt-2 flex gap-4">
                                                 <span>Score: {hit.score.toFixed(2)}</span>
                                                 <span>By: {hit.metadata.author}</span>
                                                 <span>Date: {new Date(hit.metadata.createdAt).toLocaleDateString()}</span>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                                 {searchResults.aggregations && (
                                    <div>
                                        <h4 className="font-semibold text-lg mt-6 mb-2">Aggregations</h4>
                                        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded-lg">
                                            <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0, margin: 0 }}>
                                                {JSON.stringify(searchResults.aggregations, null, 2)}
                                            </SyntaxHighlighter>
                                        </pre>
                                    </div>
                                 )}
                             </div>
                         )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DemoBankSearchSuiteView;
        
