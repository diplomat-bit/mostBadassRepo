// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/OrchestrationView.tsx
================================================================================

import React, { useState, useCallback, useEffect, useMemo, FC, ChangeEvent } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    addEdge,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Connection,
    Position,
    Handle,
    NodeProps,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    FiPlay,
    FiSave,
    FiPlus,
    FiTrash2,
    FiCpu,
    FiZap,
    FiAlertTriangle,
    FiCheckCircle,
    FiShare2,
    FiSettings,
    FiClock,
    FiMessageSquare,
    FiGitBranch,
    FiDatabase,
    FiExternalLink,
    FiCloudLightning,
    FiTerminal,
    FiMail,
    FiCode
} from 'react-icons/fi';
import { SiOpenai, SiGooglegemini, SiDatabricks, SiStripe, SiSalesforce } from 'react-icons/si';
import { VscJson } from 'react-icons/vsc';

// --- MOCK API & SERVICES ---

// A mock service to simulate backend operations for workflows
const workflowApiService = {
    fetchWorkflow: async (id: string): Promise<any> => {
        console.log(`Fetching workflow ${id}...`);
        await new Promise(res => setTimeout(res, 800));
        // In a real app, this would fetch from a database.
        const savedState = localStorage.getItem(`workflow_${id}`);
        if (savedState) {
            console.log("Workflow found in local storage.");
            return JSON.parse(savedState);
        }
        console.log("No saved workflow found, returning initial state.");
        return { nodes: initialNodes, edges: initialEdges, name: "New Marketing Campaign Workflow" };
    },
    saveWorkflow: async (id: string, name: string, nodes: Node[], edges: Edge[]): Promise<{ success: boolean }> => {
        console.log(`Saving workflow ${id}: ${name}...`);
        await new Promise(res => setTimeout(res, 1200));
        // In a real app, this would save to a database.
        localStorage.setItem(`workflow_${id}`, JSON.stringify({ name, nodes, edges }));
        console.log("Workflow saved successfully.");
        return { success: true };
    },
    runWorkflow: async (id: string, nodes: Node[], edges: Edge[]): Promise<{ success: boolean; log: string[] }> => {
        console.log(`Running workflow ${id}...`);
        await new Promise(res => setTimeout(res, 2500));
        const log = [
            `[${new Date().toISOString()}] Workflow execution started.`,
            ...nodes.map(node => `[${new Date().toISOString()}] Executing node: ${node.data.label} (ID: ${node.id})`),
            `[${new Date().toISOString()}] Workflow execution completed successfully.`
        ];
        console.log("Workflow run completed.");
        return { success: true, log };
    },
};

// A mock AI service for workflow analysis and generation
const aiOrchestrationService = {
    analyzeWorkflow: async (nodes: Node[], edges: Edge[]): Promise<{ issues: string[], suggestions: string[] }> => {
        console.log("AI analyzing workflow...");
        await new Promise(res => setTimeout(res, 2000));
        const issues = [];
        const suggestions = [];

        if (nodes.length > 10) {
            suggestions.push("This workflow is complex. Consider breaking it into sub-workflows for better maintainability.");
        }
        if (!edges.some(e => nodes.find(n => n.id === e.target)?.type === 'outputNode')) {
            issues.push("Critical: Workflow has no defined output or termination node. It may run indefinitely or produce no result.");
        }
        const apiNodes = nodes.filter(n => n.type === 'apiNode');
        if (apiNodes.length > 3) {
            suggestions.push("Multiple API calls detected. Consider batching requests or using a GraphQL endpoint to improve performance.");
        }

        console.log("AI analysis complete.");
        return { issues, suggestions };
    }
};


// --- TYPES & INTERFACES ---

type NodeType =
    | 'triggerNode'
    | 'apiNode'
    | 'aiModelNode'
    | 'conditionalNode'
    | 'delayNode'
    | 'scriptNode'
    | 'databaseNode'
    | 'notificationNode'
    | 'integrationNode'
    | 'outputNode';

interface BaseNodeData {
    label: string;
    description: string;
}

interface ApiNodeData extends BaseNodeData {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers: string; // JSON string
    body: string; // JSON string
}

interface AiModelNodeData extends BaseNodeData {
    provider: 'OpenAI' | 'Gemini';
    model: string;
    prompt: string;
    temperature: number;
}

// ... other specific node data types can be added here

// --- CUSTOM NODES ---

const nodeStyles = {
    base: 'border-2 rounded-lg shadow-md bg-gray-800 text-white w-64',
    header: 'p-2 border-b-2 flex items-center',
    content: 'p-3 text-sm text-gray-300',
    icon: 'mr-2 h-5 w-5',
};

const CustomNodeWrapper: FC<NodeProps> = ({ data, children, type }) => {
    const typeMap: Record<NodeType, { icon: React.ReactElement; color: string }> = {
        triggerNode: { icon: <FiZap />, color: 'border-green-500' },
        apiNode: { icon: <FiExternalLink />, color: 'border-blue-500' },
        aiModelNode: { icon: <FiCpu />, color: 'border-purple-500' },
        conditionalNode: { icon: <FiGitBranch />, color: 'border-yellow-500' },
        delayNode: { icon: <FiClock />, color: 'border-gray-500' },
        scriptNode: { icon: <FiTerminal />, color: 'border-indigo-500' },
        databaseNode: { icon: <FiDatabase />, color: 'border-pink-500' },
        notificationNode: { icon: <FiMail />, color: 'border-teal-500' },
        integrationNode: { icon: <FiShare2 />, color: 'border-orange-500' },
        outputNode: { icon: <FiCheckCircle />, color: 'border-green-700' },
    };

    const { icon, color } = typeMap[type as NodeType];

    return (
        <div className={`${nodeStyles.base} ${color}`}>
            <div className={`${nodeStyles.header} ${color}`}>
                {React.cloneElement(icon, { className: nodeStyles.icon })}
                <strong className="text-md">{data.label}</strong>
            </div>
            <div className={nodeStyles.content}>
                {children || <p>{data.description}</p>}
            </div>
            <Handle type="target" position={Position.Left} className="!bg-gray-400" />
            <Handle type="source" position={Position.Right} className="!bg-gray-400" />
        </div>
    );
};

const TriggerNode: FC<NodeProps> = ({ data }) => (
    <CustomNodeWrapper data={data} type="triggerNode">
        <Handle type="source" position={Position.Right} className="!bg-gray-400" />
    </CustomNodeWrapper>
);
const ApiNode: FC<NodeProps> = ({ data }) => <CustomNodeWrapper data={data} type="apiNode" />;
const AiModelNode: FC<NodeProps> = ({ data }) => <CustomNodeWrapper data={data} type="aiModelNode" />;
const ConditionalNode: FC<NodeProps> = ({ data }) => (
    <CustomNodeWrapper data={data} type="conditionalNode">
        <p>{data.description}</p>
        <Handle type="source" id="true" position={Position.Right} style={{ top: '35%' }} className="!bg-green-500" />
        <Handle type="source" id="false" position={Position.Right} style={{ top: '65%' }} className="!bg-red-500" />
    </CustomNodeWrapper>
);
const OutputNode: FC<NodeProps> = ({ data }) => (
     <CustomNodeWrapper data={data} type="outputNode">
        <Handle type="target" position={Position.Left} className="!bg-gray-400" />
    </CustomNodeWrapper>
);

const nodeTypes = {
    triggerNode: TriggerNode,
    apiNode: ApiNode,
    aiModelNode: AiModelNode,
    conditionalNode: ConditionalNode,
    outputNode: OutputNode,
    // You can register other custom nodes here
};

// --- INITIAL DATA ---

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'triggerNode',
        data: { label: 'Webhook Trigger', description: 'Starts on incoming webhook call.' },
        position: { x: 50, y: 150 },
    },
    {
        id: '2',
        type: 'apiNode',
        data: {
            label: 'Fetch User Data',
            description: 'GET request to user API.',
            url: 'https://api.example.com/users/{{webhook.userId}}',
            method: 'GET',
            headers: '{}',
            body: '{}'
        },
        position: { x: 350, y: 50 },
    },
    {
        id: '3',
        type: 'aiModelNode',
        data: {
            label: 'Analyze Sentiment',
            description: 'Uses Gemini to analyze user comment sentiment.',
            provider: 'Gemini',
            model: 'gemini-pro',
            prompt: 'Analyze the sentiment of the following text: {{webhook.comment}}. Respond with only POSITIVE, NEGATIVE, or NEUTRAL.',
            temperature: 0.2
        },
        position: { x: 350, y: 250 },
    },
    {
        id: '4',
        type: 'outputNode',
        data: { label: 'Workflow End', description: 'Outputs the final result.' },
        position: { x: 650, y: 150 },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    { id: 'e2-4', source: '2', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-4', source: '3', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
];


// --- UI COMPONENTS ---

const PropertiesPanel: FC<{
    selectedNode: Node | null;
    onNodeDataChange: (nodeId: string, newData: any) => void;
    onClose: () => void;
}> = ({ selectedNode, onNodeDataChange, onClose }) => {
    if (!selectedNode) return null;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedData = { ...selectedNode.data, [name]: value };
        onNodeDataChange(selectedNode.id, updatedData);
    };

    const renderCommonFields = () => (
        <>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="label">Node Label</label>
                <input
                    id="label"
                    name="label"
                    type="text"
                    value={selectedNode.data.label}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={selectedNode.data.description}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </>
    );

    const renderNodeSpecificFields = () => {
        switch (selectedNode.type) {
            case 'apiNode':
                const data = selectedNode.data as ApiNodeData;
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="url">URL</label>
                            <input id="url" name="url" type="text" value={data.url} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="method">Method</label>
                            <select id="method" name="method" value={data.method} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600">
                                <option>GET</option>
                                <option>POST</option>
                                <option>PUT</option>
                                <option>DELETE</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="headers">Headers (JSON)</label>
                            <textarea id="headers" name="headers" rows={3} value={data.headers} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600 font-mono" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="body">Body (JSON)</label>
                            <textarea id="body" name="body" rows={5} value={data.body} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600 font-mono" />
                        </div>
                    </>
                );
            case 'aiModelNode':
                const aiData = selectedNode.data as AiModelNodeData;
                return (
                    <>
                         <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="provider">AI Provider</label>
                            <select id="provider" name="provider" value={aiData.provider} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600">
                                <option>OpenAI</option>
                                <option>Gemini</option>
                            </select>
                        </div>
                         <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="model">Model</label>
                            <input id="model" name="model" type="text" value={aiData.model} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="prompt">System Prompt</label>
                            <textarea id="prompt" name="prompt" rows={8} value={aiData.prompt} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600 font-mono" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="temperature">Temperature: {aiData.temperature}</label>
                            <input id="temperature" name="temperature" type="range" min="0" max="1" step="0.1" value={aiData.temperature} onChange={handleInputChange} className="w-full" />
                        </div>
                    </>
                )
            default:
                return <p className="text-gray-400">No specific configuration for this node type.</p>;
        }
    };

    return (
        <div className="absolute top-0 right-0 h-full w-96 bg-gray-900 bg-opacity-90 backdrop-blur-sm text-white p-4 z-10 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-bold">Node Properties</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"> &times; </button>
            </div>
            {renderCommonFields()}
            <hr className="my-4 border-gray-700" />
            {renderNodeSpecificFields()}
        </div>
    );
};


// --- MAIN VIEW COMPONENT ---

const OrchestrationView: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [workflowName, setWorkflowName] = useState("New Marketing Campaign Workflow");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [runLogs, setRunLogs] = useState<string[]>([]);
    const [aiAnalysis, setAiAnalysis] = useState<{ issues: string[], suggestions: string[] } | null>(null);

    const WORKFLOW_ID = "_demo_workflow_01"; // In a real app, this would be dynamic

    useEffect(() => {
        setIsLoading(true);
        workflowApiService.fetchWorkflow(WORKFLOW_ID).then(data => {
            setNodes(data.nodes || initialNodes);
            setEdges(data.edges || initialEdges);
            setWorkflowName(data.name || "New Workflow");
            setIsLoading(false);
        });
    }, [setNodes, setEdges]);
    
    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);
    
    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const onNodeDataChange = useCallback((nodeId: string, newData: any) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
            )
        );
        // Also update the selected node to reflect changes immediately in the panel
        setSelectedNode(prev => prev ? {...prev, data: {...prev.data, ...newData}} : null);
    }, [setNodes]);

    const addNode = () => {
        const newNodeId = `node_${Date.now()}`;
        const newNode: Node = {
            id: newNodeId,
            type: 'apiNode',
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { label: 'New API Call', description: 'Configure this API call.' },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await workflowApiService.saveWorkflow(WORKFLOW_ID, workflowName, nodes, edges);
        setIsSaving(false);
        // You would typically show a notification here
    };

    const handleRun = async () => {
        setIsRunning(true);
        setRunLogs([]);
        const result = await workflowApiService.runWorkflow(WORKFLOW_ID, nodes, edges);
        setRunLogs(result.log);
        setIsRunning(false);
    };

    const handleAiAnalysis = async () => {
        setIsLoading(true);
        setAiAnalysis(null);
        const result = await aiOrchestrationService.analyzeWorkflow(nodes, edges);
        setAiAnalysis(result);
        setIsLoading(false);
    }

    const nodeColor = (node: Node) => {
        switch (node.type) {
            case 'triggerNode': return '#10B981';
            case 'apiNode': return '#3B82F6';
            case 'aiModelNode': return '#8B5CF6';
            default: return '#6B7280';
        }
    };
    
    return (
        <div className="h-[calc(100vh-100px)] w-full bg-gray-900 text-white flex flex-col">
            {/* Header and Toolbar */}
            <div className="p-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between z-20">
                <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="bg-transparent text-xl font-bold focus:outline-none border-b-2 border-transparent focus:border-blue-500"
                />
                <div className="flex items-center space-x-2">
                    <button onClick={addNode} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"><FiPlus className="mr-2"/> Add Node</button>
                    <button onClick={handleAiAnalysis} disabled={isLoading} className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors disabled:opacity-50"><SiGooglegemini className="mr-2"/> AI Analysis</button>
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors disabled:opacity-50">
                        {isSaving ? 'Saving...' : <><FiSave className="mr-2"/> Save</>}
                    </button>
                    <button onClick={handleRun} disabled={isRunning} className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors disabled:opacity-50">
                        {isRunning ? 'Running...' : <><FiPlay className="mr-2"/> Run</>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-gray-800"
                >
                    <Controls />
                    <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
                    <Background color="#4A5568" gap={16} />
                </ReactFlow>

                <PropertiesPanel 
                    selectedNode={selectedNode}
                    onNodeDataChange={onNodeDataChange}
                    onClose={() => setSelectedNode(null)}
                />

                {/* Overlays for logs and AI analysis */}
                {isRunning && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"><div className="text-2xl animate-pulse">Executing Workflow...</div></div>}
                {runLogs.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-900 bg-opacity-90 z-20 p-4 border-t-2 border-blue-500 overflow-y-auto">
                        <button onClick={() => setRunLogs([])} className="absolute top-2 right-2 p-1">&times;</button>
                        <h4 className="text-lg font-bold mb-2 flex items-center"><FiTerminal className="mr-2"/> Execution Log</h4>
                        <div className="font-mono text-sm">
                            {runLogs.map((log, i) => <p key={i}>{log}</p>)}
                        </div>
                    </div>
                )}
                {aiAnalysis && (
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1/2 max-w-2xl bg-gray-800 border border-purple-500 rounded-lg shadow-2xl z-30 p-6">
                        <button onClick={() => setAiAnalysis(null)} className="absolute top-2 right-2 p-1">&times;</button>
                        <h4 className="text-xl font-bold mb-4 flex items-center"><SiGooglegemini className="mr-2"/> AI Analysis Report</h4>
                        {aiAnalysis.issues.length > 0 && (
                            <div className="mb-4">
                                <h5 className="text-md font-semibold text-red-400 flex items-center mb-2"><FiAlertTriangle className="mr-2"/> Critical Issues</h5>
                                <ul className="list-disc list-inside bg-red-900 bg-opacity-20 p-3 rounded">
                                    {aiAnalysis.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                                </ul>
                            </div>
                        )}
                         {aiAnalysis.suggestions.length > 0 && (
                            <div>
                                <h5 className="text-md font-semibold text-green-400 flex items-center mb-2"><FiCheckCircle className="mr-2"/> Suggestions</h5>
                                <ul className="list-disc list-inside bg-green-900 bg-opacity-20 p-3 rounded">
                                    {aiAnalysis.suggestions.map((sugg, i) => <li key={i}>{sugg}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrchestrationView;
