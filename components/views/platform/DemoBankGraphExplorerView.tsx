// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankGraphExplorerView.tsx
================================================================================

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import Card from '../../Card';

// --- ICONS (Self-contained SVGs) ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ExpandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9V5a1 1 0 012 0v4h4a1 1 0 010 2H9a1 1 0 01-1-1z" /></svg>;
const PathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/></svg>;


// --- TYPES & INTERFACES ---
type NodeType = 'company' | 'person' | 'transaction' | 'account' | 'regulatory_filing' | 'news_article' | 'asset' | 'contract';

interface BaseNode {
  id: string;
  type: NodeType;
  name: string;
  val?: number; // for node size
  color?: string;
}

interface CompanyNode extends BaseNode { type: 'company'; industry: string; marketCap: number; headquarters: string; }
interface PersonNode extends BaseNode { type: 'person'; role: string; companyId: string; }
interface TransactionNode extends BaseNode { type: 'transaction'; amount: number; date: string; from: string; to: string; riskScore: number; }
interface AccountNode extends BaseNode { type: 'account'; accountId: string; balance: number; ownerId: string; }
interface RegulatoryFilingNode extends BaseNode { type: 'regulatory_filing'; formType: '8-K' | '10-K' | '10-Q'; date: string; }
interface NewsArticleNode extends BaseNode { type: 'news_article'; source: string; publishedAt: string; sentiment: 'positive' | 'negative' | 'neutral'; }

type GraphNode = CompanyNode | PersonNode | TransactionNode | AccountNode | RegulatoryFilingNode | NewsArticleNode;

interface GraphLink {
  source: string;
  target: string;
  type: string;
  color?: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// --- MOCK DATA SERVICES ---
const generateMockData = (nodeCount = 50): GraphData => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    const industries = ['Technology', 'Finance', 'Healthcare', 'Energy', 'Retail'];
    const roles = ['CEO', 'CFO', 'CTO', 'Board Member', 'Lead Engineer'];

    // Create companies
    for (let i = 0; i < nodeCount / 5; i++) {
        nodes.push({
            id: `comp-${i}`, type: 'company', name: `Corp${i} Inc.`, industry: industries[i % industries.length],
            marketCap: Math.random() * 1e12, headquarters: 'New York, NY'
        });
    }

    // Create people and link to companies
    for (let i = 0; i < nodeCount / 3; i++) {
        const companyId = `comp-${i % (nodeCount / 5)}`;
        nodes.push({
            id: `person-${i}`, type: 'person', name: `Person ${i}`, role: roles[i % roles.length], companyId
        });
        links.push({ source: `person-${i}`, target: companyId, type: 'WORKS_FOR' });
    }
    
    // Create accounts and link to owners (companies or people)
    for (let i = 0; i < nodeCount / 2; i++) {
        const ownerId = Math.random() > 0.5 ? `comp-${i % (nodeCount / 5)}` : `person-${i % (nodeCount / 3)}`;
        nodes.push({
           id: `acc-${i}`, type: 'account', name: `Account ${i}`, accountId: `...${Math.floor(Math.random()*9000)+1000}`, balance: Math.random() * 1e7, ownerId 
        });
        links.push({ source: `acc-${i}`, target: ownerId, type: 'OWNED_BY' });
    }

    // Create transactions
    for (let i = 0; i < nodeCount; i++) {
        const fromAcc = `acc-${Math.floor(Math.random() * (nodeCount / 2))}`;
        const toAcc = `acc-${Math.floor(Math.random() * (nodeCount / 2))}`;
        if (fromAcc === toAcc) continue;

        nodes.push({
            id: `txn-${i}`, type: 'transaction', name: `TXN ${i}`, amount: Math.random() * 1e6, date: new Date().toISOString(),
            from: fromAcc, to: toAcc, riskScore: Math.random()
        });
        links.push({ source: fromAcc, target: `txn-${i}`, type: 'SENT' });
        links.push({ source: `txn-${i}`, target: toAcc, type: 'RECEIVED' });
    }

    // Assign visual properties
    nodes.forEach(node => {
        switch(node.type) {
            case 'company': node.color = '#facc15'; node.val = 20; break;
            case 'person': node.color = '#ef4444'; node.val = 10; break;
            case 'account': node.color = '#6366f1'; node.val = 8; break;
            case 'transaction': node.color = '#f97316'; node.val = 5; break;
            default: node.color = '#9ca3af'; node.val = 5; break;
        }
    });

    return { nodes, links };
};

// --- MOCK AI Services ---
const getAiSummaryForNode = async (node: GraphNode): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API latency
    switch(node.type) {
        case 'company':
            return `**AI Insight:** ${(node as CompanyNode).name} is a major player in the ${(node as CompanyNode).industry} sector with a market cap of over $${((node as CompanyNode).marketCap / 1e9).toFixed(2)}B. Our models detect a high volume of transactions with related entities, suggesting complex subsidiary structures. We recommend a deeper dive into their recent 10-K filings for potential risk factors.`;
        case 'transaction':
            const txn = node as TransactionNode;
            const riskLevel = txn.riskScore > 0.8 ? 'HIGH' : txn.riskScore > 0.5 ? 'MEDIUM' : 'LOW';
            return `**AI Insight:** This transaction of $${txn.amount.toFixed(2)} shows a ${riskLevel} risk profile. The amount is anomalous compared to the historical activity of account ${txn.from}. This pattern is often associated with potential layering techniques in money laundering. Flagged for Level 2 review.`;
        default:
            return `**AI Insight:** No specific insights available for this entity type. Our system continuously learns and will provide more detailed analysis as new data patterns emerge.`;
    }
};

const processNaturalLanguageQuery = async (query: string): Promise<{ highlights: string[]; centerOn?: string; summary: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API latency
    if (query.toLowerCase().includes('risk')) {
        return {
            highlights: ['txn-10', 'txn-25', 'comp-3'],
            centerOn: 'comp-3',
            summary: "AI analysis complete. I've highlighted transactions with high risk scores and the associated corporate entity. Corp3 Inc. appears to be a central node for these potentially fraudulent activities."
        };
    }
    if (query.toLowerCase().includes('ceo of corp2')) {
        return {
            highlights: ['person-2', 'comp-2'],
            centerOn: 'person-2',
            summary: "Found it. Person 2 is the CEO of Corp2 Inc. I've highlighted both entities for you."
        };
    }
    return {
        highlights: [],
        summary: "Sorry, I couldn't parse that request. Please try asking about 'high risk transactions' or 'the CEO of a specific company'."
    };
};


const DemoBankGraphExplorerView: React.FC = () => {
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [aiSummary, setAiSummary] = useState<string>('');
    const [isAiSummaryLoading, setIsAiSummaryLoading] = useState(false);

    const [aiQuery, setAiQuery] = useState('');
    const [isAiQueryLoading, setIsAiQueryLoading] = useState(false);
    const [aiQueryResponse, setAiQueryResponse] = useState('');
    
    const fgRef = useRef<any>();

    useEffect(() => {
        const data = generateMockData(100);
        setGraphData(data);
    }, []);
    
    const handleNodeClick = useCallback((node: object) => {
        const graphNode = node as GraphNode;
        if (fgRef.current) {
            fgRef.current.centerAt(graphNode.x, graphNode.y, 1000);
            fgRef.current.zoom(2.5, 1000);
        }
        setSelectedNode(graphNode);
        setIsAiSummaryLoading(true);
        getAiSummaryForNode(graphNode).then(summary => {
            setAiSummary(summary);
            setIsAiSummaryLoading(false);
        });
    }, []);

    const handleNodeHover = useCallback((node: object | null) => {
        const newHighlightNodes = new Set();
        const newHighlightLinks = new Set();

        if (node) {
            newHighlightNodes.add(node);
            graphData.links.forEach(link => {
                if (link.source === (node as GraphNode).id || link.target === (node as GraphNode).id) {
                    newHighlightLinks.add(link);
                    newHighlightNodes.add(graphData.nodes.find(n => n.id === link.source)!);
                    newHighlightNodes.add(graphData.nodes.find(n => n.id === link.target)!);
                }
            });
        }
        setHighlightNodes(newHighlightNodes);
        setHighlightLinks(newHighlightLinks);
    }, [graphData]);

    const handleAiQuerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiQuery) return;
        
        setIsAiQueryLoading(true);
        setAiQueryResponse('');
        const result = await processNaturalLanguageQuery(aiQuery);
        
        setHighlightNodes(new Set(result.highlights));
        
        if(result.centerOn) {
            const centerNode = graphData.nodes.find(n => n.id === result.centerOn);
            if(centerNode && fgRef.current) {
                fgRef.current.centerAt(centerNode.x, centerNode.y, 1000);
                fgRef.current.zoom(3, 1000);
            }
        }

        setAiQueryResponse(result.summary);
        setIsAiQueryLoading(false);
    };

    const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.name;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = highlightNodes.has(node) ? 'cyan' : node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.val / 3, 0, 2 * Math.PI, false);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.fillText(label, node.x, node.y + node.val / 3 + 5 / globalScale);
    }, [highlightNodes]);

    const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
        const isHighlighted = highlightLinks.has(link);
        ctx.strokeStyle = isHighlighted ? 'rgba(100, 255, 255, 0.8)' : 'rgba(156, 163, 175, 0.3)';
        ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.stroke();
    }, [highlightLinks]);

    const memoizedGraphData = useMemo(() => graphData, [graphData]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Graph Explorer</h2>

            <Card title="Graph Intelligence Query Engine">
                <form onSubmit={handleAiQuerySubmit} className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"><AiIcon/></span>
                        <input
                            type="text"
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="Ask the AI... e.g., 'Show me high risk transactions related to Corp3'"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-28 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            disabled={isAiQueryLoading}
                        />
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition duration-200" disabled={isAiQueryLoading}>
                        {isAiQueryLoading ? 'Thinking...' : 'Execute Query'} <SearchIcon/>
                    </button>
                </form>
                {aiQueryResponse && <p className="mt-4 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-md border border-gray-700">{aiQueryResponse}</p>}
            </Card>
            
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow bg-gray-900/50 p-1 rounded-lg border border-gray-700 relative h-96 lg:h-[700px] overflow-hidden">
                    {memoizedGraphData.nodes.length > 0 ? (
                        <ForceGraph2D
                            ref={fgRef}
                            graphData={memoizedGraphData}
                            nodeVal={node => (node as GraphNode).val || 5}
                            nodeLabel={node => `${(node as GraphNode).name} (${(node as GraphNode).type})`}
                            nodeCanvasObject={nodeCanvasObject}
                            onNodeClick={handleNodeClick}
                            onNodeHover={handleNodeHover}
                            linkColor={() => 'rgba(150, 150, 150, 0.5)'}
                            linkWidth={link => highlightLinks.has(link) ? 2 : 0.5}
                            linkDirectionalParticles={1}
                            linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
                            linkDirectionalParticleColor={() => 'rgba(100, 255, 255, 0.8)'}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">Loading graph data...</div>
                    )}
                </div>
                <div className="lg:w-96 flex-shrink-0">
                    <Card title="Selected Entity Details">
                        {selectedNode ? (
                            <div className="space-y-4 text-sm h-[668px] overflow-y-auto pr-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-cyan-300">{selectedNode.name}</h3>
                                    <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                                </div>
                                
                                <div className="bg-gray-800/50 p-3 rounded-md">
                                    <p><span className="font-semibold text-gray-400">ID:</span> <span className="font-mono text-white">{selectedNode.id}</span></p>
                                    <p><span className="font-semibold text-gray-400">Type:</span> <span className="text-white capitalize">{selectedNode.type.replace('_', ' ')}</span></p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-300 border-b border-gray-700 pb-1 mb-2">Attributes</h4>
                                    {Object.entries(selectedNode).filter(([key]) => !['id', 'name', 'type', 'val', 'color', 'x', 'y', 'vx', 'vy', 'index'].includes(key)).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-gray-400 capitalize">{key}:</span>
                                            <span className="text-white text-right font-mono">{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                     <h4 className="font-semibold text-gray-300 border-b border-gray-700 pb-1 mb-2">AI Analysis</h4>
                                     <div className="bg-cyan-900/20 border border-cyan-700/50 p-3 rounded-md text-cyan-200">
                                        {isAiSummaryLoading ? (
                                            <div className="animate-pulse">Loading AI insights...</div>
                                        ) : (
                                            <p style={{ whiteSpace: 'pre-wrap' }}>{aiSummary}</p>
                                        )}
                                     </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-300 border-b border-gray-700 pb-1 mb-2">Actions</h4>
                                    <div className="flex flex-col gap-2">
                                        <button className="w-full text-xs py-2 bg-gray-700 hover:bg-gray-600 rounded text-left px-3 transition duration-200"><ExpandIcon />Expand Neighbors</button>
                                        <button className="w-full text-xs py-2 bg-gray-700 hover:bg-gray-600 rounded text-left px-3 transition duration-200"><PathIcon />Find Path to...</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-20">
                                <p>Click on a node in the graph to view its details and AI-powered insights.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DemoBankGraphExplorerView;
