// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/TheNexusView.tsx
================================================================================

// components/views/platform/TheNexusView.tsx
import React, { useContext, useEffect, useRef, useState, useReducer, useMemo, useCallback } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import type { NexusGraphData, NexusNode as OriginalNexusNode, NexusLink as OriginalNexusLink } from '../../../types';
import { FaBrain, FaProjectDiagram, FaRegObjectUngroup, FaSearch, FaSync, FaTimes } from 'react-icons/fa';
import { FiZoomIn, FiZoomOut, FiMaximize } from 'react-icons/fi';

// --- D3 DECLARATION ---
// In a real project, you would install @types/d3
declare const d3: any;

// --- EXPANDED TYPES AND INTERFACES ---

export interface NexusNode extends OriginalNexusNode {
    timestamp: number; // Unix timestamp of node creation/relevance
    metadata?: {
        ticker?: string;
        description?: string;
        apiEndpoint?: string;
        [key: string]: any;
    };
}

export interface NexusLink extends OriginalNexusLink {
    timestamp: number; // Unix timestamp of link creation
}

export type EnhancedNexusGraphData = {
    nodes: NexusNode[];
    links: NexusLink[];
};

// --- CONSTANTS AND CONFIGURATION ---

export const GRAPH_SETTINGS = {
    simulation: {
        chargeStrength: -400,
        linkDistance: 150,
        alphaDecay: 0.0228,
        velocityDecay: 0.4,
    },
    zoom: {
        minScale: 0.1,
        maxScale: 10,
    },
    node: {
        minRadius: 8,
        maxRadius: 40,
        strokeWidth: 2.5,
        hoverStrokeColor: '#00ffff', // Cyan
        selectedStrokeColor: '#f87171', // Red-400
        highlightColor: '#facc15', // Yellow-400
    },
    link: {
        strokeWidth: 2.5,
        strokeOpacity: 0.5,
        highlightedOpacity: 1.0,
        color: '#999',
    },
    labels: {
        fontSize: '12px',
        fontColor: '#e5e7eb',
        strokeColor: '#111827',
        strokeWidth: '3px',
    },
    animation: {
        duration: 400,
    }
};

// --- MOCK SERVICES ---

/**
 * Simulates fetching external financial data for a given entity.
 */
const FinancialDataService = {
    async getStockData(ticker: string) {
        // Simulate API latency
        await new Promise(res => setTimeout(res, 500));
        if (!ticker) return null;
        const isUp = Math.random() > 0.4;
        return {
            ticker,
            price: (Math.random() * 1000 + 50).toFixed(2),
            change: (Math.random() * 20).toFixed(2),
            changePercent: (Math.random() * 5).toFixed(2),
            isUp,
            volume: `${(Math.random() * 10).toFixed(2)}M`,
            marketCap: `${(Math.random() * 2000).toFixed(2)}B`,
        };
    },
    async getRelatedNews(entity: string) {
        await new Promise(res => setTimeout(res, 700));
        return [
            { id: 1, headline: `${entity} announces record quarterly earnings.`, source: 'Financial Times' },
            { id: 2, headline: `Analysts debate future of ${entity}'s market share.`, source: 'Bloomberg' },
            { id: 3, headline: `New product launch from ${entity} receives mixed reviews.`, source: 'Reuters' },
        ];
    }
};

/**
 * Simulates an AI assistant that provides insights and parses natural language.
 */
const AIAssistantService = {
    async getGraphInsights(data: EnhancedNexusGraphData) {
        await new Promise(res => setTimeout(res, 1500));
        const insights = [
            `Detected a high concentration of spending (${data.nodes.filter(n => n.type === 'expense').length} nodes) in the 'Retail' sector.`,
            `The node 'Monthly Salary' appears to be a primary funding source for 3 major investment accounts.`,
            `There are 4 recurring 'Subscription' nodes. Consider reviewing for potential consolidation.`,
            `Prediction: Based on current trends, a new 'Large Purchase' node is likely to appear in the next 30 days.`
        ];
        return insights[Math.floor(Math.random() * insights.length)];
    },
    async parseNaturalLanguageQuery(query: string, data: EnhancedNexusGraphData): Promise<{ action: string, payload: any }> {
        await new Promise(res => setTimeout(res, 800));
        const q = query.toLowerCase();
        if (q.includes("highlight") || q.includes("show me")) {
            const types = ['investment', 'subscription', 'expense', 'income', 'savings'];
            const foundType = types.find(t => q.includes(t));
            if(foundType) {
                return { action: 'HIGHLIGHT_NODE_TYPE', payload: foundType };
            }
        }
        if (q.includes("find path") || q.includes("connect")) {
            // This would require a real pathfinding algorithm (e.g., A* or Dijkstra)
            return { action: 'SHOW_MESSAGE', payload: `Pathfinding between nodes is an advanced feature under development.` };
        }
        if (q.includes("most connected") || q.includes("most influential")) {
            const nodeDegrees = data.links.reduce((acc, link) => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                acc[sourceId] = (acc[sourceId] || 0) + 1;
                acc[targetId] = (acc[targetId] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            
            const mostConnectedId = Object.keys(nodeDegrees).sort((a, b) => nodeDegrees[b] - nodeDegrees[a])[0];
            return { action: 'SELECT_NODE', payload: mostConnectedId };
        }
        return { action: 'SHOW_MESSAGE', payload: `Sorry, I didn't understand that. Try 'highlight investment nodes'.` };
    }
};


// --- STATE MANAGEMENT (REDUCER) ---

export type GraphFilterState = {
    nodeTypes: Set<string>;
    valueRange: [number, number];
    timeRange: [number, number];
    searchTerm: string;
};

export type GraphUIState = {
    selectedNodeId: string | null;
    hoveredNodeId: string | null;
    highlightedNodeIds: Set<string>;
    layoutAlgorithm: 'force' | 'radial' | 'tree';
    isContextMenuOpen: boolean;
    contextMenuPosition: { x: number; y: number };
    contextMenuNodeId: string | null;
    isAiPanelOpen: boolean;
};

export type GraphAIState = {
    query: string;
    insights: string[];
    isLoading: boolean;
    message: string | null;
};

export type GraphState = {
    filters: GraphFilterState;
    ui: GraphUIState;
    ai: GraphAIState;
};

export type GraphAction =
    | { type: 'TOGGLE_NODE_TYPE_FILTER'; payload: string }
    | { type: 'SET_VALUE_RANGE_FILTER'; payload: [number, number] }
    | { type: 'SET_TIME_RANGE_FILTER'; payload: [number, number] }
    | { type: 'SET_SEARCH_TERM'; payload: string }
    | { type: 'CLEAR_FILTERS' }
    | { type: 'SELECT_NODE'; payload: string | null }
    | { type: 'HOVER_NODE'; payload: string | null }
    | { type: 'SET_HIGHLIGHTED_NODES'; payload: Set<string> }
    | { type: 'CLEAR_HIGHLIGHTS' }
    | { type: 'SET_LAYOUT_ALGORITHM'; payload: 'force' | 'radial' | 'tree' }
    | { type: 'OPEN_CONTEXT_MENU'; payload: { nodeId: string; x: number; y: number } }
    | { type: 'CLOSE_CONTEXT_MENU' }
    | { type: 'TOGGLE_AI_PANEL' }
    | { type: 'SET_AI_QUERY'; payload: string }
    | { type: 'FETCH_AI_INSIGHTS_START' }
    | { type: 'FETCH_AI_INSIGHTS_SUCCESS'; payload: string }
    | { type: 'SET_AI_MESSAGE'; payload: string | null };

export const getInitialGraphState = (fullData: EnhancedNexusGraphData | null): GraphState => {
    const timeRange = getTimeRange(fullData);
    const valueRange = getValueRange(fullData);
    return {
        filters: {
            nodeTypes: new Set(),
            valueRange: valueRange,
            timeRange: timeRange,
            searchTerm: '',
        },
        ui: {
            selectedNodeId: null,
            hoveredNodeId: null,
            highlightedNodeIds: new Set(),
            layoutAlgorithm: 'force',
            isContextMenuOpen: false,
            contextMenuPosition: { x: 0, y: 0 },
            contextMenuNodeId: null,
            isAiPanelOpen: false,
        },
        ai: {
            query: '',
            insights: [],
            isLoading: false,
            message: null,
        },
    };
};

export function graphReducer(state: GraphState, action: GraphAction): GraphState {
    switch (action.type) {
        case 'TOGGLE_NODE_TYPE_FILTER': {
            const newTypes = new Set(state.filters.nodeTypes);
            newTypes.has(action.payload) ? newTypes.delete(action.payload) : newTypes.add(action.payload);
            return { ...state, filters: { ...state.filters, nodeTypes: newTypes } };
        }
        case 'SET_VALUE_RANGE_FILTER':
            return { ...state, filters: { ...state.filters, valueRange: action.payload } };
        case 'SET_TIME_RANGE_FILTER':
            return { ...state, filters: { ...state.filters, timeRange: action.payload } };
        case 'SET_SEARCH_TERM':
            return { ...state, filters: { ...state.filters, searchTerm: action.payload } };
        case 'CLEAR_FILTERS':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    nodeTypes: new Set(),
                    searchTerm: ''
                    // Note: We don't reset value/time ranges to avoid re-calculating them
                },
                ui: { ...state.ui, highlightedNodeIds: new Set() }
            };
        case 'SELECT_NODE':
            const newSelectedNodeId = state.ui.selectedNodeId === action.payload ? null : action.payload;
            return { ...state, ui: { ...state.ui, selectedNodeId: newSelectedNodeId } };
        case 'HOVER_NODE':
            return { ...state, ui: { ...state.ui, hoveredNodeId: action.payload } };
        case 'SET_HIGHLIGHTED_NODES':
            return { ...state, ui: { ...state.ui, highlightedNodeIds: action.payload } };
        case 'CLEAR_HIGHLIGHTS':
            return { ...state, ui: { ...state.ui, highlightedNodeIds: new Set() } };
        case 'SET_LAYOUT_ALGORITHM':
            return { ...state, ui: { ...state.ui, layoutAlgorithm: action.payload } };
        case 'OPEN_CONTEXT_MENU':
            return { ...state, ui: { ...state.ui, isContextMenuOpen: true, contextMenuPosition: { x: action.payload.x, y: action.payload.y }, contextMenuNodeId: action.payload.nodeId } };
        case 'CLOSE_CONTEXT_MENU':
            return { ...state, ui: { ...state.ui, isContextMenuOpen: false, contextMenuNodeId: null } };
        case 'TOGGLE_AI_PANEL':
            return { ...state, ui: { ...state.ui, isAiPanelOpen: !state.ui.isAiPanelOpen } };
        case 'SET_AI_QUERY':
            return { ...state, ai: { ...state.ai, query: action.payload } };
        case 'FETCH_AI_INSIGHTS_START':
            return { ...state, ai: { ...state.ai, isLoading: true } };
        case 'FETCH_AI_INSIGHTS_SUCCESS':
            return { ...state, ai: { ...state.ai, isLoading: false, insights: [...state.ai.insights, action.payload] } };
        case 'SET_AI_MESSAGE':
            return { ...state, ai: { ...state.ai, message: action.payload } };
        default:
            return state;
    }
}

// --- UTILITY FUNCTIONS ---

export function applyGraphFilters(data: EnhancedNexusGraphData, filters: GraphFilterState): EnhancedNexusGraphData {
    const { nodeTypes, valueRange, timeRange, searchTerm } = filters;
    const [minVal, maxVal] = valueRange;
    const [startTime, endTime] = timeRange;
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const filteredNodes = data.nodes.filter(node => {
        const typeMatch = nodeTypes.size === 0 || nodeTypes.has(node.type);
        const valueMatch = node.value >= minVal && node.value <= maxVal;
        const timeMatch = node.timestamp >= startTime && node.timestamp <= endTime;
        const searchMatch = searchTerm === '' || node.label.toLowerCase().includes(lowercasedSearchTerm) || node.id.toLowerCase().includes(lowercasedSearchTerm);
        return typeMatch && valueMatch && timeMatch && searchMatch;
    });

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredLinks = data.links.filter(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        const timeMatch = link.timestamp >= startTime && link.timestamp <= endTime;
        return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId) && timeMatch;
    });

    return { nodes: filteredNodes, links: filteredLinks };
}

export function getUniqueNodeTypes(data: EnhancedNexusGraphData | null): string[] {
    if (!data) return [];
    return Array.from(new Set(data.nodes.map(node => node.type))).sort();
}

export function getValueRange(data: EnhancedNexusGraphData | null): [number, number] {
    if (!data || data.nodes.length === 0) return [0, 100];
    const values = data.nodes.map(n => n.value);
    return [Math.min(...values), Math.max(...values)];
}

export function getTimeRange(data: EnhancedNexusGraphData | null): [number, number] {
    if (!data || (data.nodes.length === 0 && data.links.length === 0)) return [Date.now() - 31536000000, Date.now()];
    const nodeTimestamps = data.nodes.map(n => n.timestamp);
    const linkTimestamps = data.links.map(l => l.timestamp);
    const allTimestamps = [...nodeTimestamps, ...linkTimestamps];
    return [Math.min(...allTimestamps), Math.max(...allTimestamps)];
}

// --- CUSTOM D3 HOOK ---

export function useD3Graph(
    svgRef: React.RefObject<SVGSVGElement>,
    data: EnhancedNexusGraphData,
    state: GraphState,
    dispatch: React.Dispatch<GraphAction>
) {
    const simulationRef = useRef<any>();
    const zoomRef = useRef<any>();
    const zoomGroupRef = useRef<any>();

    // Centralized function to get node radius
    const getNodeRadius = useCallback((d: NexusNode) => {
        const valueRange = getValueRange({ nodes: data.nodes, links: [] });
        const scale = d3.scaleSqrt().domain(valueRange).range([GRAPH_SETTINGS.node.minRadius, GRAPH_SETTINGS.node.maxRadius]);
        return scale(d.value);
    }, [data.nodes]);

    useEffect(() => {
        if (!svgRef.current || !data) return;

        const svg = d3.select(svgRef.current);
        const parent = svg.node().parentElement;
        const width = parent?.clientWidth || 800;
        const height = parent?.clientHeight || 700;
        
        svg.attr('width', width).attr('height', height);

        // --- SIMULATION SETUP ---
        if (!simulationRef.current) {
            simulationRef.current = d3.forceSimulation()
                .force("link", d3.forceLink().id((d: any) => d.id))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("collide", d3.forceCollide().radius((d: any) => getNodeRadius(d) + 5));
        }
        const simulation = simulationRef.current;
        
        // --- ZOOM/PAN LOGIC ---
        if (!zoomRef.current) {
             zoomRef.current = d3.zoom()
                .scaleExtent([GRAPH_SETTINGS.zoom.minScale, GRAPH_SETTINGS.zoom.maxScale])
                .on("zoom", (event: any) => {
                    zoomGroupRef.current?.attr("transform", event.transform);
                });
            svg.call(zoomRef.current);
        }
        
        // --- SVG ELEMENT GROUPS ---
        let g = svg.selectAll("g.zoom-container").data([null]);
        g = g.enter().append("g").attr("class", "zoom-container").merge(g);
        zoomGroupRef.current = g;

        g.selectAll("g.links-group").data([null]).enter().append("g").attr("class", "links-group");
        g.selectAll("g.nodes-group").data([null]).enter().append("g").attr("class", "nodes-group");

        const linkGroup = g.select("g.links-group");
        const nodeGroup = g.select("g.nodes-group");

        // Arrowhead definition
        svg.selectAll('defs').data([null]).enter().append('defs')
          .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', (d: any) => 15)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', GRAPH_SETTINGS.link.color)
            .style('stroke', 'none');

        // --- LINKS ---
        const link = linkGroup.selectAll("line").data(data.links, (d: any) => `${d.source.id}-${d.target.id}`);
        link.exit().transition().duration(GRAPH_SETTINGS.animation.duration).attr("stroke-opacity", 0).remove();
        const linkEnter = link.enter().append("line")
            .attr("stroke", GRAPH_SETTINGS.link.color)
            .attr("stroke-opacity", 0)
            .attr("stroke-width", GRAPH_SETTINGS.link.strokeWidth)
            .attr('marker-end', 'url(#arrowhead)');
        const linkUpdate = linkEnter.merge(link).transition().duration(GRAPH_SETTINGS.animation.duration)
            .attr("stroke-opacity", GRAPH_SETTINGS.link.strokeOpacity);

        // --- NODES ---
        const node = nodeGroup.selectAll("g.node").data(data.nodes, (d: any) => d.id);
        node.exit().transition().duration(GRAPH_SETTINGS.animation.duration).attr("transform", "scale(0)").remove();
        
        const nodeEnter = node.enter().append("g").attr("class", "node cursor-pointer")
            .call(drag(simulation))
            .on("click", (event: any, d: any) => {
                dispatch({ type: 'SELECT_NODE', payload: d.id });
                event.stopPropagation();
            })
            .on("mouseover", (event: any, d: any) => dispatch({ type: 'HOVER_NODE', payload: d.id }))
            .on("mouseout", () => dispatch({ type: 'HOVER_NODE', payload: null }))
            .on("contextmenu", (event: any, d: any) => {
                event.preventDefault();
                dispatch({ type: 'OPEN_CONTEXT_MENU', payload: { nodeId: d.id, x: event.clientX, y: event.clientY } });
            });

        nodeEnter.append("circle")
            .attr("r", (d: any) => getNodeRadius(d))
            .attr("fill", (d: any) => d.color || '#374151')
            .attr("stroke", "#fff")
            .attr("stroke-width", GRAPH_SETTINGS.node.strokeWidth);
            
        nodeEnter.append("text")
            .text((d: any) => d.label)
            .attr("x", (d: any) => getNodeRadius(d) + 5)
            .attr("y", "0.35em")
            .attr("fill", GRAPH_SETTINGS.labels.fontColor)
            .attr("font-size", GRAPH_SETTINGS.labels.fontSize)
            .attr("paint-order", "stroke")
            .attr("stroke", GRAPH_SETTINGS.labels.strokeColor)
            .attr("stroke-width", GRAPH_SETTINGS.labels.strokeWidth);
            
        const nodeUpdate = nodeEnter.merge(node);
        nodeUpdate.select('circle').transition().duration(GRAPH_SETTINGS.animation.duration)
            .attr("r", (d: any) => getNodeRadius(d))
            .attr("fill", (d: any) => d.color || '#374151');
        nodeUpdate.select('text').attr("x", (d: any) => getNodeRadius(d) + 5)

        // --- DYNAMIC SIMULATION FORCES BASED ON LAYOUT ---
        simulation.force("center", d3.forceCenter(width / 2, height / 2));
        if (state.ui.layoutAlgorithm === 'force') {
            simulation.force("charge", d3.forceManyBody().strength(GRAPH_SETTINGS.simulation.chargeStrength));
            simulation.force("link").links(data.links).distance(GRAPH_SETTINGS.simulation.linkDistance);
            simulation.force("x", null);
            simulation.force("y", null);
        } else if (state.ui.layoutAlgorithm === 'radial') {
            simulation.force("charge", d3.forceManyBody().strength(-100));
            simulation.force("link").links(data.links).distance(80);
            simulation.force("r", d3.forceRadial(Math.min(width, height) / 2.5).strength(0.8));
        } else if (state.ui.layoutAlgorithm === 'tree') {
            // Tree layout is complex and requires hierarchical data. This is a simplified approach.
            simulation.force("charge", null);
            simulation.force("link").links(data.links).distance(100).strength(1);
            simulation.force("x", d3.forceX(width / 2).strength(0.1));
            simulation.force("y", d3.forceY(height / 2).strength(0.1));
        }
        
        // --- INTERACTIVITY HIGHLIGHTING ---
        const { hoveredNodeId, selectedNodeId, highlightedNodeIds } = state.ui;
        const adjacentNodeIds = new Set();
        if (hoveredNodeId || selectedNodeId) {
            const focusNodeId = hoveredNodeId || selectedNodeId;
            data.links.forEach(l => {
                const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                if (sourceId === focusNodeId) adjacentNodeIds.add(targetId);
                if (targetId === focusNodeId) adjacentNodeIds.add(sourceId);
            });
        }
        
        nodeUpdate.transition().duration(200)
            .attr("opacity", d => (hoveredNodeId || selectedNodeId) ? (d.id === (hoveredNodeId || selectedNodeId) || adjacentNodeIds.has(d.id) ? 1 : 0.2) : 1);
        
        linkUpdate.transition().duration(200).attr("stroke-opacity", d => {
            const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
            const targetId = typeof d.target === 'object' ? d.target.id : d.target;
            const focusNodeId = hoveredNodeId || selectedNodeId;
            return focusNodeId ? (sourceId === focusNodeId || targetId === focusNodeId ? GRAPH_SETTINGS.link.highlightedOpacity : 0.1) : GRAPH_SETTINGS.link.strokeOpacity;
        });

        nodeUpdate.select('circle')
            .attr("stroke", d => {
                if (d.id === selectedNodeId) return GRAPH_SETTINGS.node.selectedStrokeColor;
                if (highlightedNodeIds.has(d.id)) return GRAPH_SETTINGS.node.highlightColor;
                if (d.id === hoveredNodeId) return GRAPH_SETTINGS.node.hoverStrokeColor;
                return "#fff";
            });

        // --- SIMULATION TICK & UPDATE ---
        simulation.nodes(data.nodes).on("tick", () => {
            linkUpdate
                .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
            nodeUpdate.attr("transform", d => `translate(${d.x},${d.y})`);
        });
        
        simulation.alpha(0.3).restart();

        function drag(simulation: any) {
            const dragstarted = (event: any, d: any) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; };
            const dragged = (event: any, d: any) => { d.fx = event.x; d.fy = event.y; };
            const dragended = (event: any, d: any) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; };
            return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
        }

    }, [data, state.ui, dispatch, getNodeRadius, svgRef]);
}

// --- SUB-COMPONENTS ---

export const GraphControls: React.FC<{
    state: GraphState;
    dispatch: React.Dispatch<GraphAction>;
    uniqueNodeTypes: string[];
    fullValueRange: [number, number];
}> = ({ state, dispatch, uniqueNodeTypes, fullValueRange }) => {
    return (
        <div className="w-80 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700 space-y-6">
            <h3 className="text-xl font-semibold text-white">Graph Controls</h3>
            <div>
                <label htmlFor="search-node" className="block text-sm font-medium text-gray-300 mb-1">Search Nodes</label>
                <input id="search-node" type="text" value={state.filters.searchTerm} onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })} placeholder="e.g., 'Amazon'" className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            <div>
                <h4 className="text-md font-medium text-gray-300 mb-2">Node Types</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {uniqueNodeTypes.map(type => (
                        <label key={type} className="flex items-center cursor-pointer">
                            <input type="checkbox" checked={state.filters.nodeTypes.has(type)} onChange={() => dispatch({ type: 'TOGGLE_NODE_TYPE_FILTER', payload: type })} className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-cyan-500 focus:ring-cyan-600" />
                            <span className="ml-3 text-sm text-gray-400 capitalize">{type}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-md font-medium text-gray-300 mb-2">Value Range</h4>
                <div className="flex justify-between text-xs text-gray-400"><span>{state.filters.valueRange[0].toFixed(0)}</span><span>{state.filters.valueRange[1].toFixed(0)}</span></div>
                <input type="range" min={fullValueRange[0]} max={fullValueRange[1]} value={state.filters.valueRange[1]} onChange={e => dispatch({type: 'SET_VALUE_RANGE_FILTER', payload: [state.filters.valueRange[0], +e.target.value]})} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            </div>
            <button onClick={() => dispatch({ type: 'CLEAR_FILTERS' })} className="w-full px-4 py-2 bg-red-800/50 text-red-200 rounded-md hover:bg-red-700/50 transition-colors flex items-center justify-center gap-2">
                <FaSync /> Reset Filters
            </button>
        </div>
    );
};

export const NodeDetailPanel: React.FC<{
    node: NexusNode | null;
    links: NexusLink[];
    allNodes: NexusNode[];
    onClose: () => void;
    onSelectNeighbor: (nodeId: string) => void;
}> = ({ node, links, allNodes, onClose, onSelectNeighbor }) => {
    const [financials, setFinancials] = useState<any>(null);
    const [news, setNews] = useState<any[]>([]);

    useEffect(() => {
        if (node?.metadata?.ticker) {
            setFinancials(null);
            setNews([]);
            FinancialDataService.getStockData(node.metadata.ticker).then(setFinancials);
            FinancialDataService.getRelatedNews(node.label).then(setNews);
        } else {
            setFinancials(null);
            setNews([]);
        }
    }, [node]);

    if (!node) return null;

    const connectedLinks = links.filter(l => (typeof l.source === 'object' ? l.source.id : l.source) === node.id || (typeof l.target === 'object' ? l.target.id : l.target) === node.id);

    return (
        <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-md p-4 rounded-lg border border-gray-700 max-w-sm text-sm w-full shadow-2xl z-20 animate-fade-in-right">
            <div className="flex justify-between items-center mb-3">
                 <h4 className="font-bold text-lg text-cyan-300 flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: node.color }}></span>{node.label}</h4>
                <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="space-y-2 text-gray-300">
                <p><span className="font-semibold text-gray-400">Type:</span> <span className="capitalize">{node.type}</span></p>
                <p><span className="font-semibold text-gray-400">Value:</span> {node.value.toFixed(2)}</p>
                <p><span className="font-semibold text-gray-400">Date:</span> {new Date(node.timestamp).toLocaleDateString()}</p>
                {node.metadata?.description && <p className="text-gray-400 italic">{node.metadata.description}</p>}
            </div>
            
            {financials && (
                <div className="my-3 p-3 bg-gray-800/50 rounded-md">
                    <h5 className="text-gray-300 font-semibold mb-2">Market Data ({financials.ticker})</h5>
                    <div className="flex justify-between items-baseline">
                        <p className={`text-2xl font-mono ${financials.isUp ? 'text-green-400' : 'text-red-400'}`}>${financials.price}</p>
                        <p className={`${financials.isUp ? 'text-green-400' : 'text-red-400'}`}>{financials.isUp ? '+' : '-'}{financials.change} ({financials.changePercent}%)</p>
                    </div>
                </div>
            )}
             {news.length > 0 && (
                <div className="my-3">
                    <h5 className="text-gray-300 font-semibold mb-2">Related News</h5>
                    <ul className="list-none space-y-2">
                        {news.map(n => <li key={n.id} className="text-xs text-gray-400 hover:text-cyan-400 cursor-pointer">{n.headline} <span className="text-gray-500">- {n.source}</span></li>)}
                    </ul>
                </div>
            )}
            
            <hr className="my-3 border-gray-700" />
            
            <h5 className="text-gray-300 font-semibold mb-2">Connections ({connectedLinks.length}):</h5>
            <ul className="list-none space-y-2 max-h-60 overflow-y-auto pr-2">
                {connectedLinks.map(l => {
                    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                    const otherNodeId = sourceId === node.id ? targetId : sourceId;
                    const otherNode = allNodes.find(n => n.id === otherNodeId);
                    if (!otherNode) return null;
                    return (
                        <li key={`${sourceId}-${targetId}`} className="p-2 bg-gray-800/50 rounded-md hover:bg-gray-700/50 cursor-pointer transition-colors" onClick={() => onSelectNeighbor(otherNode.id)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: otherNode.color }}></span><span className="text-gray-200">{otherNode.label}</span></div>
                                <span className="text-xs text-gray-500 italic">{l.relationship}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

export const NodeContextMenu: React.FC<{
    state: GraphUIState;
    dispatch: React.Dispatch<GraphAction>;
}> = ({ state, dispatch }) => {
    useEffect(() => {
        const handleClickOutside = () => dispatch({ type: 'CLOSE_CONTEXT_MENU' });
        if (state.isContextMenuOpen) window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [state.isContextMenuOpen, dispatch]);

    if (!state.isContextMenuOpen || !state.contextMenuNodeId) return null;

    return (
        <div className="absolute z-50 bg-gray-800 border border-gray-600 rounded-md shadow-lg text-white text-sm py-2 animate-fade-in" style={{ top: state.contextMenuPosition.y, left: state.contextMenuPosition.x }} onClick={(e) => e.stopPropagation()}>
            <ul className="list-none m-0 p-0">
                <li className="px-4 py-2 hover:bg-cyan-600/50 cursor-pointer" onClick={() => { dispatch({ type: 'SELECT_NODE', payload: state.contextMenuNodeId }); dispatch({ type: 'CLOSE_CONTEXT_MENU' }); }}>Select Node</li>
                <li className="px-4 py-2 hover:bg-cyan-600/50 cursor-pointer">Center View</li>
                <li className="px-4 py-2 hover:bg-cyan-600/50 cursor-pointer">Find Path...</li>
                <hr className="border-gray-600 my-1" />
                <li className="px-4 py-2 hover:bg-red-600/50 cursor-pointer">Hide Node</li>
            </ul>
        </div>
    );
};

export const AIInsightsPanel: React.FC<{
    state: GraphAIState;
    dispatch: React.Dispatch<GraphAction>;
    fullGraphData: EnhancedNexusGraphData | null;
    onClose: () => void;
}> = ({ state, dispatch, fullGraphData, onClose }) => {
    const handleGetInsight = useCallback(() => {
        if (fullGraphData) {
            dispatch({type: 'FETCH_AI_INSIGHTS_START'});
            AIAssistantService.getGraphInsights(fullGraphData).then(insight => {
                dispatch({type: 'FETCH_AI_INSIGHTS_SUCCESS', payload: insight});
            });
        }
    }, [fullGraphData, dispatch]);
    
    const handleQuerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!state.query || !fullGraphData) return;
        const result = await AIAssistantService.parseNaturalLanguageQuery(state.query, fullGraphData);
        switch(result.action) {
            case 'HIGHLIGHT_NODE_TYPE':
                const nodesToHighlight = fullGraphData.nodes.filter(n => n.type === result.payload).map(n => n.id);
                dispatch({ type: 'SET_HIGHLIGHTED_NODES', payload: new Set(nodesToHighlight) });
                break;
            case 'SELECT_NODE':
                dispatch({ type: 'SELECT_NODE', payload: result.payload });
                break;
            case 'SHOW_MESSAGE':
                dispatch({ type: 'SET_AI_MESSAGE', payload: result.payload });
                setTimeout(() => dispatch({type: 'SET_AI_MESSAGE', payload: null}), 3000);
                break;
        }
        dispatch({type: 'SET_AI_QUERY', payload: ''});
    };

    return (
        <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-md p-4 rounded-lg border border-gray-700 max-w-sm w-full shadow-2xl z-20 animate-fade-in-left">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-lg text-purple-300 flex items-center gap-2"><FaBrain/> AI Assistant</h4>
                <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleQuerySubmit} className="relative mb-4">
                <input type="text" value={state.query} onChange={e => dispatch({type: 'SET_AI_QUERY', payload: e.target.value})} placeholder="Ask about your graph..." className="w-full bg-gray-800 border border-gray-600 rounded-md pl-3 pr-10 py-2 text-white focus:ring-purple-500 focus:border-purple-500"/>
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"><FaSearch/></button>
            </form>
            <div className="space-y-4">
                <button onClick={handleGetInsight} disabled={state.isLoading} className="w-full px-4 py-2 bg-purple-800/50 text-purple-200 rounded-md hover:bg-purple-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {state.isLoading ? 'Generating...' : 'Generate New Insight'}
                </button>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {state.message && <div className="p-2 bg-cyan-900/50 text-cyan-200 text-sm rounded-md">{state.message}</div>}
                    {state.insights.map((insight, i) => <div key={i} className="p-3 bg-gray-800/50 text-gray-300 text-sm rounded-md">{insight}</div>).reverse()}
                </div>
            </div>
        </div>
    );
};

const NexusGraph: React.FC<{ 
    data: EnhancedNexusGraphData; 
    state: GraphState;
    dispatch: React.Dispatch<GraphAction>;
}> = ({ data, state, dispatch }) => {
    const ref = useRef<SVGSVGElement>(null);
    useD3Graph(ref, data, state, dispatch);
    return <svg ref={ref}></svg>;
};

// --- MAIN VIEW COMPONENT ---

const TheNexusView: React.FC = () => {
    const context = useContext(DataContext);
    const [fullGraphData, setFullGraphData] = useState<EnhancedNexusGraphData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Initialize state lazily
    const [state, dispatch] = useReducer(graphReducer, null, () => getInitialGraphState(null));

    useEffect(() => {
        if (context) {
            setTimeout(() => {
                const data = context.getNexusData();
                // Augment data with timestamps for timeline feature
                const augmentedData: EnhancedNexusGraphData = {
                    nodes: data.nodes.map((n: OriginalNexusNode) => ({ ...n, timestamp: Date.now() - Math.random() * 31536000000 })), // Randomly within last year
                    links: data.links.map((l: OriginalNexusLink) => ({ ...l, timestamp: Date.now() - Math.random() * 31536000000 }))
                };
                setFullGraphData(augmentedData);
                // Re-initialize reducer state with data-dependent values
                const initialState = getInitialGraphState(augmentedData);
                dispatch({type: 'SET_TIME_RANGE_FILTER', payload: initialState.filters.timeRange});
                dispatch({type: 'SET_VALUE_RANGE_FILTER', payload: initialState.filters.valueRange});
                setIsLoading(false);
            }, 1000);
        }
    }, [context]);

    const filteredGraphData = useMemo(() => {
        if (!fullGraphData) return { nodes: [], links: [] };
        return applyGraphFilters(fullGraphData, state.filters);
    }, [fullGraphData, state.filters]);

    const uniqueNodeTypes = useMemo(() => getUniqueNodeTypes(fullGraphData), [fullGraphData]);
    const fullValueRange = useMemo(() => getValueRange(fullGraphData), [fullGraphData]);
    const fullTimeRange = useMemo(() => getTimeRange(fullGraphData), [fullGraphData]);

    const selectedNode = useMemo(() => {
        return fullGraphData?.nodes.find(n => n.id === state.ui.selectedNodeId) || null;
    }, [state.ui.selectedNodeId, fullGraphData]);
    
    const handleSelectNeighbor = useCallback((nodeId: string) => dispatch({ type: 'SELECT_NODE', payload: nodeId }), []);
    const handleCloseDetails = useCallback(() => dispatch({ type: 'SELECT_NODE', payload: null }), []);
    
    if (!context || isLoading) {
        return <Card title="The Nexus" isLoading={true}><div className="h-[700px]"></div></Card>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">The Nexus</h2>
            <Card title="Map of Emergent Relationships" subtitle="An interactive, AI-enhanced visualization of your financial ecosystem.">
                <div className="flex flex-col lg:flex-row gap-6 mt-4">
                    <GraphControls state={state} dispatch={dispatch} uniqueNodeTypes={uniqueNodeTypes} fullValueRange={fullValueRange} />
                    <div className="flex-grow relative min-w-0 h-[700px] bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                        <div className="absolute top-0 left-0 right-0 p-2 z-10">
                             <div className="absolute top-2 left-2 z-10 flex gap-2">
                                <button onClick={() => dispatch({type: 'TOGGLE_AI_PANEL'})} className="p-2 bg-gray-800/80 rounded-md text-white hover:bg-purple-500"><FaBrain /></button>
                            </div>
                            <div className="absolute top-2 right-2 z-10 flex gap-2">
                                <select value={state.ui.layoutAlgorithm} onChange={(e) => dispatch({ type: 'SET_LAYOUT_ALGORITHM', payload: e.target.value as any })} className="bg-gray-800/80 border border-gray-600 rounded-md px-3 py-1 text-white text-sm focus:ring-cyan-500 focus:border-cyan-500">
                                    <option value="force">Force</option>
                                    <option value="radial">Radial</option>
                                    <option value="tree">Tree</option>
                                </select>
                            </div>
                        </div>

                        {filteredGraphData ? (
                            <NexusGraph data={filteredGraphData} state={state} dispatch={dispatch} />
                        ) : <div>No data to display.</div>}
                        
                        {state.ui.isAiPanelOpen && <AIInsightsPanel state={state.ai} dispatch={dispatch} fullGraphData={fullGraphData} onClose={() => dispatch({type: 'TOGGLE_AI_PANEL'})} />}
                        
                        <NodeDetailPanel node={selectedNode} links={fullGraphData?.links || []} allNodes={fullGraphData?.nodes || []} onClose={handleCloseDetails} onSelectNeighbor={handleSelectNeighbor} />
                        
                        <NodeContextMenu state={state.ui} dispatch={dispatch} />

                        <div className="absolute bottom-4 left-4 right-4 z-10 bg-gray-800/80 p-3 rounded-md border border-gray-600">
                            <label className="text-sm font-medium text-gray-300 mb-1 block">Time Range</label>
                            <input type="range" min={fullTimeRange[0]} max={fullTimeRange[1]} value={state.filters.timeRange[1]} onChange={e => dispatch({ type: 'SET_TIME_RANGE_FILTER', payload: [state.filters.timeRange[0], +e.target.value] })} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>{new Date(state.filters.timeRange[0]).toLocaleDateString()}</span>
                                <span>{new Date(state.filters.timeRange[1]).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TheNexusView;