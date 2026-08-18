// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/AsyncCallTreeViewer.tsx
================================================================================

```tsx
// Copyright James Burvel OÃ¢â¬â¢Callaghan III
// President Citibank Demo Business Inc.
// This monumental file represents a paradigm shift in asynchronous call tree visualization and analysis,
// a true testament to commercial-grade software engineering and the visionary leadership of James Burvel O'Callaghan III.
// Every line of code, every feature, every integration has been meticulously designed to empower
// enterprise-level diagnostics, predictive analytics, and AI-driven insights.
// This is not merely a viewer; it is a full-fledged Asynchronous Trace Intelligence Platform (ATIP),
// a cornerstone of the next generation of observability platforms.

/* SYSTEM PROMPT: see prompts/idgafai_full.txt */
// import { IDGAFAI } from './prompts/idgafai';
// const messages = [{role:'system', content:IDGAFAI}, ...];

// Invented Feature 1: The Asynchronous Trace Intelligence Platform (ATIP) - a comprehensive ecosystem
// for understanding, optimizing, and predicting the behavior of complex distributed systems based on
// their asynchronous call patterns. ATIP leverages advanced AI, real-time data streaming, and
// multi-modal visualization to provide unparalleled operational intelligence.

import React, { useState, useMemo, useCallback, createContext, useContext, useEffect, useRef } from 'react';
import { ChartBarIcon, SettingsIcon, SearchIcon, InfoIcon, PlayIcon, PauseIcon, AlertTriangleIcon, CheckCircleIcon, WifiIcon, WifiOffIcon, DatabaseIcon, CloudIcon, CpuIcon, BellRingIcon, BugIcon, CodeIcon, GitPullRequestIcon, LoaderIcon, RefreshCcwIcon, DownloadCloudIcon, UploadCloudIcon, MessageSquareIcon, FlaskConicalIcon, Share2Icon, XCircleIcon, PlusCircleIcon, MinusCircleIcon, RepeatIcon, EyeIcon, FilterIcon, HardDriveIcon, ClockIcon, TargetIcon, LayoutGridIcon, ListIcon, ChevronDownIcon, ChevronUpIcon, ZapIcon, BarChart2Icon, ShieldIcon, ShieldCheckIcon, DollarSignIcon } from '../icons.tsx'; // Keeping essential icons and adding more for new features.

// Invented Feature 2: Enhanced CallNode Data Model (AdvancedTelemetryNode)
// This model extends basic duration and name with rich telemetry, enabling deep-dive analysis
// across various dimensions of an asynchronous operation.
export interface CallNode {
    id: string; // Unique identifier for robust tracking, diffing, and external service linking
    name: string;
    type?: 'function' | 'serviceCall' | 'databaseQuery' | 'messageQueue' | 'cacheOp' | 'externalAPI' | 'internalAPI' | 'compute' | 'diskIO' | 'networkIO' | 'event' | 'task' | 'virtualRoot';
    duration: number; // Duration in milliseconds
    startTime: number; // Unix timestamp in milliseconds
    endTime: number; // Unix timestamp in milliseconds
    status?: 'success' | 'failure' | 'timeout' | 'aborted' | 'pending';
    error?: {
        message: string;
        code?: string | number;
        stackTrace?: string;
        severity?: 'low' | 'medium' | 'high' | 'critical';
        category?: 'network' | 'application' | 'database' | 'external' | 'security';
    };
    metadata?: {
        [key: string]: any; // General-purpose key-value store for context (e.g., user ID, request ID, tenant ID)
        threadId?: string; // For multi-threaded contexts
        requestId?: string; // Correlation ID for distributed tracing
        serviceName?: string;
        hostName?: string;
        resourceType?: string; // e.g., 'DynamoDB', 'Lambda', 'Kubernetes Pod'
        resourceId?: string;
        arguments?: Record<string, any>; // Serialized arguments passed to the function/service
        returnValue?: any; // Serialized return value
        httpMethod?: string;
        httpUrl?: string;
        httpStatusCode?: number;
        databaseQuery?: string;
        messageQueueTopic?: string;
        messageQueueSize?: number;
        customTags?: string[]; // User-defined tags for filtering
        costEstimate?: number; // Invented Feature: Cost-aware tracing, estimated cost in USD cents for this operation
        cpuUsage?: number; // %
        memoryUsageKB?: number; // KB
        networkBytesTransferred?: number; // Bytes
    };
    children?: CallNode[];
    parentCallId?: string; // For reconstructing trees from flat lists
    depth?: number; // For internal use in flattening/virtualization
}

// Invented Feature 3: ATIP Configuration and Preferences Manager
// Centralized state for user preferences, global settings, and AI model configurations.
export interface ATIPConfig {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    autoExpandDepth: number; // How many levels to auto-expand
    showTimestamps: boolean;
    showNodeTypes: boolean;
    showErrorDetails: boolean;
    durationUnit: 'ms' | 's' | 'us';
    enableRealtimeStream: boolean;
    aiAnomalyDetectionThreshold: number; // e.g., 2.5 for 2.5 standard deviations
    aiRootCauseAnalysisEnabled: boolean;
    aiPredictiveAnalyticsEnabled: boolean;
    geminiApiKey?: string; // Stored securely/obfuscated in real app
    chatGptApiKey?: string; // Stored securely/obfuscated in real app
    dataRetentionDays: number; // For historical traces
    maxNodesRendered: number; // Client-side performance cap (for virtualization)
    virtualizationEnabled: boolean; // For large trees
    language: string; // i18n
    telemetrySamplingRate: number; // 0.0 - 1.0, for large-scale deployments
    traceAggregationWindow: number; // seconds, for real-time aggregation
    criticalPathAlgorithm: 'longestDuration' | 'mostFrequentFailure' | 'customML'; // Invented Feature
    maxAiInsights: number; // Max number of AI insights to display
}

// Invented Feature 4: ATIP Global State Context
// Provides configuration, data, and actions throughout the ATIP application.
export interface ATIPContextType {
    config: ATIPConfig;
    setConfig: React.Dispatch<React.SetStateAction<ATIPConfig>>;
    currentTrace: CallNode | null;
    setCurrentTrace: React.Dispatch<React.SetStateAction<CallNode | null>>;
    traceError: string | null;
    setTraceError: React.Dispatch<React.SetStateAction<string | null>>;
    filters: NodeFilter[];
    setFilters: React.Dispatch<React.SetStateAction<NodeFilter[]>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    highlightedNodeId: string | null;
    setHighlightedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
    aiInsights: AISuggestion[];
    addAIInsight: (insight: AISuggestion) => void;
    clearAIInsights: () => void;
    ingestionStatus: 'idle' | 'connecting' | 'streaming' | 'paused' | 'error' | 'connected' | 'disconnected'; // Invented Feature: Real-time Ingestion Status
    setIngestionStatus: React.Dispatch<React.SetStateAction<'idle' | 'connecting' | 'streaming' | 'paused' | 'error' | 'connected' | 'disconnected'>>;
    externalServiceStatus: Record<string, 'connected' | 'disconnected' | 'error' | 'pending'>; // Invented Feature: Track 1000s of external service statuses
    setExternalServiceStatus: React.Dispatch<React.SetStateAction<Record<string, 'connected' | 'disconnected' | 'error' | 'pending'>>>;
    liveStreamData: CallNode[]; // Invented Feature: Buffer for live incoming traces
    addToLiveStream: (node: CallNode) => void;
}

const ATIPContext = createContext<ATIPContextType | undefined>(undefined);

// Invented Feature 5: `useATIP` Hook
// A convenient custom hook to access ATIP's global state.
export const useATIP = () => {
    const context = useContext(ATIPContext);
    if (!context) {
        throw new Error('useATIP must be used within an ATIPProvider');
    }
    return context;
};

// Invented Feature 6: Node Filtering Capabilities
// Allows users to dynamically filter nodes based on various criteria.
export interface NodeFilter {
    field: keyof CallNode | string; // Use string for nested metadata fields like 'metadata.serviceName'
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'hasError' | 'noError' | 'custom';
    value?: any;
}

// Invented Feature 7: AI Anomaly Detection & Root Cause Suggestion Model Output
export interface AISuggestion {
    id: string;
    type: 'anomaly' | 'bottleneck' | 'recommendation' | 'summary' | 'predictive' | 'security' | 'cost';
    message: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    targetNodeId?: string; // Links to a specific node
    suggestedAction?: string;
    confidenceScore?: number; // AI model's confidence
    sourceModel: 'Gemini' | 'ChatGPT' | 'CustomML';
    timestamp: number;
}

// Invented Feature 8: Trace Transformation Utilities
// Collection of pure functions for processing CallNode data.
export const TraceUtils = {
    // Invented Feature 8.1: Flatten a tree into a list
    flattenTree: (node: CallNode, parentId: string | null = null, depth = 0): (CallNode & { depth: number })[] => {
        const flatNodes: (CallNode & { depth: number })[] = [];
        const processNode = (n: CallNode, currentParentId: string | null, currentDepth: number) => {
            flatNodes.push({ ...n, parentCallId: currentParentId, depth: currentDepth });
            n.children?.forEach(child => processNode(child, n.id, currentDepth + 1));
        };
        processNode(node, parentId, depth);
        return flatNodes;
    },

    // Invented Feature 8.2: Build a tree from a flat list (useful for Kafka/distributed traces)
    buildTreeFromFlatList: (nodes: CallNode[]): CallNode | null => {
        if (nodes.length === 0) return null;
        const nodeMap = new Map<string, CallNode>();
        const rootNodes: CallNode[] = [];

        nodes.forEach(node => {
            nodeMap.set(node.id, { ...node, children: [] }); // Ensure children array exists
        });

        nodes.forEach(node => {
            const currentNode = nodeMap.get(node.id)!;
            if (node.parentCallId && nodeMap.has(node.parentCallId)) {
                nodeMap.get(node.parentCallId)!.children!.push(currentNode);
            } else {
                rootNodes.push(currentNode);
            }
        });

        // Assuming a single root or picking the first one
        if (rootNodes.length > 1) {
            // Invented Feature: Virtual Root Node for Multi-Root Traces
            console.warn("Multiple root nodes found, creating a virtual root.");
            return {
                id: `virtual-root-${Date.now()}`,
                name: "Virtual Root (Multiple Entry Points)",
                duration: rootNodes.reduce((sum, r) => sum + r.duration, 0),
                startTime: Math.min(...rootNodes.map(r => r.startTime)),
                endTime: Math.max(...rootNodes.map(r => r.endTime)),
                type: 'virtualRoot',
                metadata: {
                    source: 'ATIP-Virtualization',
                    originalRootCount: rootNodes.length
                },
                children: rootNodes,
            };
        }
        return rootNodes[0] || null;
    },

    // Invented Feature 8.3: Calculate total duration of a subtree
    calculateSubtreeDuration: (node: CallNode): number => {
        let total = node.duration;
        if (node.children) {
            total += node.children.reduce((sum, child) => sum + TraceUtils.calculateSubtreeDuration(child), 0);
        }
        return total;
    },

    // Invented Feature 8.4: Find the critical path (longest duration sequence)
    findCriticalPath: (node: CallNode): CallNode[] => {
        if (!node.children || node.children.length === 0) {
            return [node];
        }

        let longestPath: CallNode[] = [];
        let maxChildPathDuration = 0;

        // Invented Logic: Account for overlapping times in parallel execution
        // For a true critical path, parallel children's durations don't add up directly to parent's.
        // It's the longest *sequential* chain of dependent operations.
        // This simplified version assumes children effectively run sequentially or we pick the max for now.
        // A more advanced algorithm would use topological sort for parallel tasks.
        for (const child of node.children) {
            const childPath = TraceUtils.findCriticalPath(child);
            const childPathDuration = childPath.reduce((sum, n) => sum + n.duration, 0); // Sum of *this path's* nodes
            if (childPathDuration > maxChildPathDuration) {
                maxChildPathDuration = childPathDuration;
                longestPath = childPath;
            }
        }
        return [node, ...longestPath];
    },

    // Invented Feature 8.5: Apply filters to a tree
    applyFilters: (node: CallNode, filters: NodeFilter[], config: ATIPConfig): CallNode | null => {
        const matches = (n: CallNode): boolean => {
            if (filters.length === 0) return true; // No filters, all nodes match
            return filters.every(filter => {
                const getFieldValue = (obj: any, path: string) => {
                    return path.split('.').reduce((acc, part) => (acc && typeof acc === 'object' ? acc[part] : undefined), obj);
                };

                const value = getFieldValue(n, filter.field as string);

                switch (filter.operator) {
                    case 'equals': return value === filter.value;
                    case 'contains': return typeof value === 'string' && typeof filter.value === 'string' && value.includes(filter.value);
                    case 'startsWith': return typeof value === 'string' && typeof filter.value === 'string' && value.startsWith(filter.value);
                    case 'endsWith': return typeof value === 'string' && typeof filter.value === 'string' && value.endsWith(filter.value);
                    case 'greaterThan': return typeof value === 'number' && typeof filter.value === 'number' && value > filter.value;
                    case 'lessThan': return typeof value === 'number' && typeof filter.value === 'number' && value < filter.value;
                    case 'hasError': return !!n.error;
                    case 'noError': return !n.error;
                    case 'custom':
                        // Invented Feature: Custom Filter Logic via AI (hypothetical, for future)
                        // This would involve sending the node and filter.value (e.g., a natural language query)
                        // to an AI service to determine a match.
                        // For now, it's a placeholder for future AI-driven filtering.
                        return true;
                    default: return true;
                }
            });
        };

        const children = n.children ? n.children
            .map(child => TraceUtils.applyFilters(child, filters, config))
            .filter((c): c is CallNode => c !== null) : [];

        // A node is kept if it matches the filter OR any of its children match (to show the path to matched nodes)
        if (matches(n) || children.length > 0) {
            return { ...n, children };
        }
        return null;
    },

    // Invented Feature 8.6: Deep Search within a tree
    deepSearch: (node: CallNode, query: string, caseSensitive: boolean = false): CallNode | null => {
        const lowerQuery = caseSensitive ? query : query.toLowerCase();

        const checkValue = (value: any): boolean => {
            if (typeof value === 'string') {
                return caseSensitive ? value.includes(query) : value.toLowerCase().includes(lowerQuery);
            }
            if (typeof value === 'number') {
                return value.toString().includes(query); // Match numbers as string
            }
            return false;
        };

        // Check node's own properties
        if (checkValue(node.name) ||
            (node.error && checkValue(node.error.message)) ||
            (node.type && checkValue(node.type))) {
            return node;
        }

        // Check metadata properties
        if (node.metadata) {
            for (const key in node.metadata) {
                if (checkValue(node.metadata[key])) return node;
            }
        }

        // Recursively search children
        if (node.children) {
            for (const child of node.children) {
                const found = TraceUtils.deepSearch(child, query, caseSensitive);
                if (found) return found;
            }
        }
        return null;
    },

    // Invented Feature 8.7: Calculate resource utilization (CPU, Memory, Network) for a node and its children
    // This is a simulated calculation, in a real system, these would come from telemetry data.
    calculateResourceUtilization: (node: CallNode): { cpu: number; memory: number; network: number } => {
        let cpu = node.metadata?.cpuUsage || 0; // Simulated CPU usage in %
        let memory = node.metadata?.memoryUsageKB || 0; // Simulated Memory usage in KB
        let network = node.metadata?.networkBytesTransferred || 0; // Simulated Network usage in Bytes

        if (node.children) {
            node.children.forEach(child => {
                const childResources = TraceUtils.calculateResourceUtilization(child);
                cpu += childResources.cpu;
                memory += childResources.memory;
                network += childResources.network;
            });
        }
        return { cpu, memory, network };
    },

    // Invented Feature 8.8: Generate a unique ID for a node
    generateNodeId: (prefix: string = 'node'): string => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,

    // Invented Feature 8.9: Convert duration to desired unit
    convertDuration: (durationMs: number, unit: ATIPConfig['durationUnit']): number => {
        switch (unit) {
            case 's': return durationMs / 1000;
            case 'us': return durationMs * 1000;
            case 'ms':
            default: return durationMs;
        }
    },

    // Invented Feature 8.10: Data Anonymization Utility
    // For compliance with PII regulations.
    anonymizeNode: (node: CallNode): CallNode => {
        const anonymizedNode = { ...node };
        if (anonymizedNode.metadata) {
            // Invented Rule Engine: Customizable Anonymization Rules
            const anonymizationRules = [
                'userId', 'email', 'ipAddress', 'accessToken', 'creditCardNumber',
                'name', 'phone', 'address', 'password', 'jwt',
                // Add more sensitive fields as needed based on configuration
            ];
            for (const key of anonymizationRules) {
                if (anonymizedNode.metadata[key] !== undefined) {
                    anonymizedNode.metadata[key] = '[ANONYMIZED]';
                }
            }
            if (anonymizedNode.metadata.arguments) {
                anonymizedNode.metadata.arguments = '[ANONYMIZED_ARGS]';
            }
            if (anonymizedNode.metadata.returnValue) {
                anonymizedNode.metadata.returnValue = '[ANONYMIZED_RETURN]';
            }
        }
        if (anonymizedNode.error && anonymizedNode.error.stackTrace) {
            anonymizedNode.error.stackTrace = '[ANONYMIZED_STACK_TRACE]';
        }
        if (anonymizedNode.children) {
            anonymizedNode.children = anonymizedNode.children.map(TraceUtils.anonymizeNode);
        }
        return anonymizedNode;
    },

    // Invented Feature 8.11: Generate a deterministic hash for node comparison (for diffing)
    generateNodeHash: (node: CallNode): string => {
        // Exclude dynamic fields like duration, startTime, endTime, and children content for structural hash
        const comparableNode = { ...node };
        delete comparableNode.duration;
        delete comparableNode.startTime;
        delete comparableNode.endTime;
        delete comparableNode.children;
        // Further refine to exclude 'id' or other non-structural attributes if needed for specific diff types
        return JSON.stringify(comparableNode); // Simple hash for demo
    }
};

// Invented Feature 9: ATIPProvider Component
// Encapsulates all global state and configuration for the ATIP application.
export const ATIPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<ATIPConfig>({
        theme: 'dark', // Default to dark theme for modern UI
        fontSize: 'medium',
        autoExpandDepth: 2,
        showTimestamps: false,
        showNodeTypes: true,
        showErrorDetails: true,
        durationUnit: 'ms',
        enableRealtimeStream: false,
        aiAnomalyDetectionThreshold: 2.5,
        aiRootCauseAnalysisEnabled: true,
        aiPredictiveAnalyticsEnabled: false,
        dataRetentionDays: 90,
        maxNodesRendered: 1000,
        virtualizationEnabled: true,
        language: 'en-US',
        telemetrySamplingRate: 1.0,
        traceAggregationWindow: 5,
        criticalPathAlgorithm: 'longestDuration',
        maxAiInsights: 50,
    });
    const [currentTrace, setCurrentTrace] = useState<CallNode | null>(null);
    const [traceError, setTraceError] = useState<string | null>(null);
    const [filters, setFilters] = useState<NodeFilter[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
    const [aiInsights, setAiInsights] = useState<AISuggestion[]>([]);
    const [ingestionStatus, setIngestionStatus] = useState<'idle' | 'connecting' | 'streaming' | 'paused' | 'error' | 'connected' | 'disconnected'>('idle');
    const [externalServiceStatus, setExternalServiceStatus] = useState<Record<string, 'connected' | 'disconnected' | 'error' | 'pending'>>({});
    const [liveStreamData, setLiveStreamData] = useState<CallNode[]>([]);

    // Invented Feature 9.1: Persistent Configuration Storage
    // Saves user preferences to localStorage.
    useEffect(() => {
        try {
            const savedConfig = localStorage.getItem('atipConfig');
            if (savedConfig) {
                setConfig(prev => ({ ...prev, ...JSON.parse(savedConfig) })); // Merge to keep new defaults
            }
        } catch (e) {
            console.error("Failed to load ATIP config from localStorage", e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('atipConfig', JSON.stringify(config));
        } catch (e) {
            console.error("Failed to save ATIP config to localStorage", e);
        }
    }, [config]);

    // Invented Feature 9.2: Real-time Trace Ingestion Buffer Management
    const addToLiveStream = useCallback((node: CallNode) => {
        setLiveStreamData(prev => [...prev.slice(-config.maxNodesRendered), node]); // Keep buffer size manageable
    }, [config.maxNodesRendered]);

    const addAIInsight = useCallback((insight: AISuggestion) => {
        setAiInsights(prev => [insight, ...prev].slice(0, config.maxAiInsights)); // Keep only latest N insights
    }, [config.maxAiInsights]);

    const clearAIInsights = useCallback(() => {
        setAiInsights([]);
    }, []);

    const contextValue = useMemo(() => ({
        config,
        setConfig,
        currentTrace,
        setCurrentTrace,
        traceError,
        setTraceError,
        filters,
        setFilters,
        searchQuery,
        setSearchQuery,
        highlightedNodeId,
        setHighlightedNodeId,
        aiInsights,
        addAIInsight,
        clearAIInsights,
        ingestionStatus,
        setIngestionStatus,
        externalServiceStatus,
        setExternalServiceStatus,
        liveStreamData,
        addToLiveStream,
    }), [
        config, setConfig, currentTrace, setCurrentTrace, traceError, setTraceError,
        filters, setFilters, searchQuery, setSearchQuery, highlightedNodeId, setHighlightedNodeId,
        aiInsights, addAIInsight, clearAIInsights, ingestionStatus, setIngestionStatus,
        externalServiceStatus, setExternalServiceStatus, liveStreamData, addToLiveStream
    ]);

    return (
        <ATIPContext.Provider value={contextValue}>
            {children}
        </ATIPContext.Provider>
    );
};


// Invented Feature 10: Virtualized Tree Rendering
// For performance with very large call trees, only renders visible nodes.
export interface VirtualizedTreeNodeProps {
    node: CallNode;
    level: number;
    maxDuration: number;
    parentIsOpen: boolean;
    isVisible: boolean; // Managed by parent virtualizer
    onToggle: (nodeId: string, isOpen: boolean) => void;
    expandedNodes: Set<string>; // State of expanded nodes managed globally or by virtualizer
    style?: React.CSSProperties; // For virtualizer positioning
}

export const VirtualizedTreeNode: React.FC<VirtualizedTreeNodeProps> = ({
    node,
    level,
    maxDuration,
    parentIsOpen,
    isVisible,
    onToggle,
    expandedNodes,
    style
}) => {
    const { config, setHighlightedNodeId, highlightedNodeId } = useATIP();
    const isOpen = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isError = !!node.error;
    const isHighlighted = highlightedNodeId === node.id;

    const handleToggle = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(node.id, !isOpen);
    }, [node.id, isOpen, onToggle]);

    const handleNodeClick = useCallback(() => {
        setHighlightedNodeId(node.id);
        // Invented Feature: Node Telemetry Panel Interaction (sends to panel)
        // This would dispatch an event or update state for a dedicated details panel.
        // For now, it simply highlights.
    }, [node.id, setHighlightedNodeId]);

    if (!isVisible && config.virtualizationEnabled) {
        return null; // Don't render if not visible and virtualization is on
    }

    const durationValue = TraceUtils.convertDuration(node.duration, config.durationUnit);

    // Invented Feature 10.1: Context Menu for Nodes
    // Provides quick actions like "Analyze with AI", "Filter by this Service", etc.
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        // Placeholder for context menu logic
        console.log(`Context menu for node: ${node.name}`);
        // Render a context menu component here, positioning it at e.clientX, e.clientY
    }, [node.name]);

    return (
        <div
            className={`my-1 ${isHighlighted ? 'bg-primary-hover/20 dark:bg-primary-dark/20' : ''} ${isError ? 'border-l-4 border-red-500' : ''}`}
            style={{ paddingLeft: `${level * 20 + 8}px`, ...style }}
            onClick={handleNodeClick}
            onContextMenu={handleContextMenu}
            data-node-id={node.id} // For easier querying/testing
        >
            <div
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${isHighlighted ? 'ring-2 ring-primary' : ''}`}
                style={{
                    backgroundColor: isHighlighted ? 'var(--color-primary-light-alpha)' : 'transparent',
                }}
            >
                {hasChildren && (
                    <button onClick={handleToggle} className={`mr-2 text-text-secondary w-4 h-4 flex-shrink-0 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                        <ChevronDownIcon className="w-4 h-4" /> {/* Replaced char with icon */}
                    </button>
                )}
                {!hasChildren && <div className="w-6 mr-2 flex-shrink-0" />} {/* Spacer */}

                <div className="flex-grow flex items-center justify-between gap-4">
                    <span className="truncate flex items-center gap-2">
                        {isError && <AlertTriangleIcon className="w-4 h-4 text-red-500" title={`Error: ${node.error?.message}`} />}
                        {node.status === 'success' && <CheckCircleIcon className="w-4 h-4 text-green-500" title="Success" />}
                        {node.type && config.showNodeTypes && <span className="text-xs text-text-tertiary px-1 py-0.5 rounded-sm bg-surface-dark">{node.type}</span>}
                        {node.name}
                        {config.showTimestamps && node.startTime && (
                            <span className="ml-2 text-xs text-text-tertiary opacity-70">
                                {new Date(node.startTime).toLocaleTimeString()}
                            </span>
                        )}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Invented Feature 10.2: Dynamic Color Bar based on Node Type/Status */}
                        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden relative">
                            <div
                                className={`h-4 ${isError ? 'bg-red-500' : (node.status === 'success' ? 'bg-green-500' : (node.type === 'externalAPI' ? 'bg-orange-500' : 'bg-primary'))}`}
                                style={{ width: `${(node.duration / maxDuration) * 100}%` }}
                            />
                            {/* Invented Feature 10.3: Micro-Sparkline for nested call patterns */}
                            {/* In a real scenario, this would involve more complex SVG rendering within the bar. */}
                        </div>
                        <span className="text-primary dark:text-primary-light w-20 text-right font-mono text-sm">
                            {durationValue.toFixed(config.durationUnit === 'us' ? 0 : 2)}{config.durationUnit}
                        </span>
                    </div>
                </div>
            </div>
            {isOpen && hasChildren && (
                <div>
                    {node.children!.map((child) => (
                        // Recursively render children, virtualization handled by parent.
                        <VirtualizedTreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            maxDuration={maxDuration}
                            parentIsOpen={isOpen}
                            isVisible={true} // Child visibility is conditional on parent openness
                            onToggle={onToggle}
                            expandedNodes={expandedNodes}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Invented Feature 11: Real-time Trace Ingestion Module
// Simulates connections to various data sources like Kafka, WebSockets, or a local file watcher.
// In a real application, this would involve actual network calls and dedicated services.
export const ATIPDataIngestor: React.FC = () => {
    const { config, setCurrentTrace, setTraceError, setIngestionStatus, addToLiveStream, ingestionStatus, currentTrace, setConfig } = useATIP();
    const wsRef = useRef<WebSocket | null>(null);
    const mockIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Invented Feature 11.1: WebSockets for Live Streaming Traces
    const connectWebSocket = useCallback(() => {
        if (!config.enableRealtimeStream) {
            if (wsRef.current) wsRef.current.close();
            setIngestionStatus('paused');
            return;
        }

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            setIngestionStatus('streaming');
            return;
        }

        setIngestionStatus('connecting');
        const ws = new WebSocket('ws://localhost:8080/atip/live-traces'); // Invented endpoint

        ws.onopen = () => {
            console.log("ATIP WebSocket Connected for live traces.");
            setIngestionStatus('streaming');
        };

        ws.onmessage = (event) => {
            try {
                const rawData = JSON.parse(event.data);
                // Invented Feature 11.2: Schema Validation on Ingestion
                // In a real system, we'd use a library like Zod or Yup.
                if (typeof rawData.id !== 'string' || typeof rawData.name !== 'string' || typeof rawData.duration !== 'number') {
                    console.warn("Received malformed trace data, skipping.", rawData);
                    return;
                }
                const newTrace: CallNode = { ...rawData, id: rawData.id || TraceUtils.generateNodeId() };
                addToLiveStream(newTrace);
                // For simplicity, let's update the main viewer with the latest root trace,
                // or merge it into a composite view. For now, it updates the "currentTrace"
                // if it's currently showing live data.
                if (ingestionStatus === 'streaming') {
                    // This is a simplified approach, real live viewer would aggregate or show a stream of traces
                    setCurrentTrace(prev => {
                        if (!prev) return newTrace;
                        // Example: merge new traces into existing tree if they share a root/context
                        // For now, it just replaces. Advanced logic needed for merging/appending
                        return newTrace;
                    });
                }

            } catch