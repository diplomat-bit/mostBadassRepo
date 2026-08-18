// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankWorkflowEngineView.tsx
================================================================================

// components/views/platform/DemoBankWorkflowEngineView.tsx
import React, { useState, useEffect, useRef, useCallback, FC, memo } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    MiniMap,
    Background,
    Node,
    Edge,
    Connection,
    useReactFlow,
    NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dagre from 'dagre';
import { FiPlay, FiSave, FiUpload, FiDownload, FiTrash2, FiShare2, FiZap, FiFileText, FiLayout, FiDollarSign, FiMessageSquare, FiSidebar, FiSettings } from 'react-icons/fi';
import { FaSlack, FaStripe, FaAws, FaSalesforce } from 'react-icons/fa';
import { SiSendgrid, SiTwilio } from 'react-icons/si';

import Card from '../../Card';

// --- TYPES AND INTERFACES ---

interface NodeData {
    label: string;
    icon?: React.ReactNode;
    description?: string;
    config?: Record<string, any>;
    status?: 'idle' | 'running' | 'completed' | 'failed';
}

type CustomNode = Node<NodeData>;

interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    nodes: CustomNode[];
    edges: Edge[];
}

// --- CONSTANTS & MOCK DATA ---

const MOCK_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "your_google_gemini_api_key";
const ai = new GoogleGenerativeAI(MOCK_API_KEY);

const nodeDefaults = {
    style: {
        background: '#1f2937',
        color: '#e5e7eb',
        border: '1px solid #4b5563',
        borderRadius: '8px',
        padding: '15px',
        minWidth: 180,
    },
};

const PALETTE_NODES = [
    { type: 'trigger', label: 'Manual Trigger', icon: <FiPlay className="text-green-400" />, config: { schedule: 'manual' } },
    { type: 'action', label: 'Approval Step', icon: <FiCheckSquare className="text-blue-400" />, config: { approverRole: 'Manager' } },
    { type: 'integration', label: 'Send Slack Message', service: 'slack', icon: <FaSlack className="text-pink-500" />, config: { channel: '#general', message: '' } },
    { type: 'integration', label: 'Send Email (SendGrid)', service: 'sendgrid', icon: <SiSendgrid className="text-blue-500" />, config: { to: '', subject: '', body: '' } },
    { type: 'integration', label: 'Send SMS (Twilio)', service: 'twilio', icon: <SiTwilio className="text-red-500" />, config: { to: '', message: '' } },
    { type: 'integration', label: 'Charge Card (Stripe)', service: 'stripe', icon: <FaStripe className="text-purple-500" />, config: { amount: 0, currency: 'USD', customerId: '' } },
    { type: 'integration', label: 'Run Lambda (AWS)', service: 'aws', icon: <FaAws className="text-yellow-500" />, config: { functionArn: '', payload: {} } },
    { type: 'integration', label: 'Update Lead (Salesforce)', service: 'salesforce', icon: <FaSalesforce className="text-sky-400" />, config: { object: 'Lead', recordId: '', fields: {} } },
    { type: 'logic', label: 'Conditional Logic', icon: <FiShare2 className="text-indigo-400" />, config: { conditions: [] } },
    { type: 'delay', label: 'Wait', icon: <FiClock className="text-teal-400" />, config: { duration: 5, unit: 'minutes' } },
];

const MOCK_TEMPLATES: WorkflowTemplate[] = [
    {
        id: 'expense-approval',
        name: 'Expense Approval',
        description: 'A standard workflow for employees to submit expenses and get manager approval.',
        nodes: [
            { id: '1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Expense Submitted' } },
            { id: '2', position: { x: 0, y: 0 }, data: { label: 'Manager Approval' } },
            { id: '3', position: { x: 0, y: 0 }, data: { label: 'Finance Review' } },
            { id: '4', position: { x: 0, y: 0 }, data: { label: 'Payment Processed' } },
            { id: '5', type: 'output', position: { x: 0, y: 0 }, data: { label: 'Notify Employee' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e2-3', source: '2', target: '3', animated: true },
            { id: 'e3-4', source: '3', target: '4', animated: true },
            { id: 'e4-5', source: '4', target: '5' },
        ],
    },
    // ... more templates
];

// --- UTILITY FUNCTIONS ---

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: CustomNode[], edges: Edge[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: node.width || 180, height: node.height || 60 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? 'left' : 'top';
        node.sourcePosition = isHorizontal ? 'right' : 'bottom';
        node.position = {
            x: nodeWithPosition.x - (node.width || 180) / 2,
            y: nodeWithPosition.y - (node.height || 60) / 2,
        };
        return node;
    });

    return { nodes: layoutedNodes, edges };
};


// --- CUSTOM REACT FLOW NODES ---

const CustomNodeComponent: FC<NodeProps<NodeData>> = memo(({ data }) => {
    return (
        <div className="flex items-center space-x-3">
            {data.icon && <div className="text-2xl">{data.icon}</div>}
            <div>
                <div className="font-bold text-white">{data.label}</div>
                {data.description && <div className="text-xs text-gray-400">{data.description}</div>}
            </div>
        </div>
    );
});

const nodeTypes = {
    custom: CustomNodeComponent,
};


// --- SUB-COMPONENTS ---

const Toolbar = ({ onLayout, onClear, onSave, onLoad, onExport }) => (
    <Card>
        <div className="flex items-center space-x-2">
            <button onClick={() => onLayout('TB')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded" title="Layout Vertically"><FiLayout className="transform rotate-90" /></button>
            <button onClick={() => onLayout('LR')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded" title="Layout Horizontally"><FiLayout /></button>
            <div className="w-px h-6 bg-gray-600" />
            <button onClick={onSave} className="p-2 bg-gray-700 hover:bg-gray-600 rounded" title="Save Workflow"><FiSave /></button>
            <button onClick={onLoad} className="p-2 bg-gray-700 hover:bg-gray-600 rounded" title="Load Workflow"><FiUpload /></button>
            <button onClick={onExport} className="p-2 bg-gray-700 hover:bg-gray-600 rounded" title="Export as JSON"><FiDownload /></button>
            <div className="w-px h-6 bg-gray-600" />
            <button onClick={onClear} className="p-2 text-red-400 bg-gray-700 hover:bg-red-900/50 rounded" title="Clear Canvas"><FiTrash2 /></button>
        </div>
    </Card>
);

const NodePalette = ({ onDragStart }) => (
    <Card title="Integrations & Logic">
        <div className="space-y-2">
            <p className="text-sm text-gray-400">Drag nodes onto the canvas.</p>
            {PALETTE_NODES.map((node, index) => (
                <div
                    key={index}
                    className="p-3 bg-gray-700/50 rounded-lg flex items-center space-x-3 cursor-grab hover:bg-gray-700 transition-colors"
                    onDragStart={(event) => onDragStart(event, node)}
                    draggable
                >
                    <div className="text-2xl">{node.icon}</div>
                    <span className="text-white">{node.label}</span>
                </div>
            ))}
        </div>
    </Card>
);

const PropertiesPanel = ({ selectedNode, updateNodeConfig }) => {
    if (!selectedNode) {
        return (
            <Card title="Properties">
                <div className="text-gray-400 text-center p-8">Select a node to view its properties.</div>
            </Card>
        );
    }

    const handleConfigChange = (key, value) => {
        updateNodeConfig(selectedNode.id, { ...selectedNode.data.config, [key]: value });
    };

    return (
        <Card title={`Properties: ${selectedNode.data.label}`}>
            <div className="space-y-4 p-2">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Node ID</label>
                    <input type="text" value={selectedNode.id} readOnly className="mt-1 w-full bg-gray-800 p-2 rounded text-gray-400" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Label</label>
                    <input type="text" value={selectedNode.data.label} onChange={(e) => updateNodeConfig(selectedNode.id, { ...selectedNode.data, label: e.target.value })} className="mt-1 w-full bg-gray-700 p-2 rounded text-white" />
                </div>
                {selectedNode.data.config && Object.entries(selectedNode.data.config).map(([key, value]) => (
                    <div key={key}>
                        <label className="block text-sm font-medium text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <input
                            type={typeof value === 'number' ? 'number' : 'text'}
                            value={value}
                            onChange={(e) => handleConfigChange(key, e.target.value)}
                            className="mt-1 w-full bg-gray-700 p-2 rounded text-white"
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
};


const AIInteractionPanel = ({ onGenerate, onAction, isLoading }) => {
    const [prompt, setPrompt] = useState("User signs up -> Send welcome email -> Wait 1 day -> Send follow-up email with a special offer");

    return (
        <Card title="AI Workflow Assistant">
            <div className="space-y-4">
                <div>
                    <p className="text-gray-400 mb-2">Describe a workflow and the AI will generate it for you.</p>
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder='e.g., Request -> Manager Approval -> Finance Approval -> Done'
                    />
                    <button onClick={() => onGenerate(prompt)} disabled={isLoading} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                        {isLoading ? 'Generating...' : 'Generate from Description'}
                    </button>
                </div>
                <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-400 mb-2">Apply AI enhancements to the current workflow.</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => onAction('optimize')} disabled={isLoading} className="py-2 px-2 text-sm bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"><FiZap /><span>Optimize</span></button>
                        <button onClick={() => onAction('document')} disabled={isLoading} className="py-2 px-2 text-sm bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"><FiFileText /><span>Document</span></button>
                        <button onClick={() => onAction('cost')} disabled={isLoading} className="py-2 px-2 text-sm bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"><FiDollarSign /><span>Estimate Cost</span></button>
                        <button onClick={() => onAction('explain')} disabled={isLoading} className="py-2 px-2 text-sm bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"><FiMessageSquare /><span>Explain</span></button>
                    </div>
                </div>
            </div>
        </Card>
    );
};


// --- MAIN WORKFLOW ENGINE VIEW ---

const WorkflowCanvas = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const { setViewport, toObject } = useReactFlow();

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#9ca3af' } }, eds)), [setEdges]);

    useEffect(() => {
        onNodesChange([]); // Resets internal node state
    }, []);

    const onLayout = useCallback((direction) => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
    }, [nodes, edges, setNodes, setEdges]);


    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();
        if (!reactFlowWrapper.current) return;

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const nodeInfo = JSON.parse(event.dataTransfer.getData('application/reactflow'));

        const position = {
            x: event.clientX - reactFlowBounds.left - 75,
            y: event.clientY - reactFlowBounds.top - 20,
        };
        
        const newNode: CustomNode = {
            id: `${nodeInfo.label.replace(/\s+/g, '-')}-${+new Date()}`,
            type: 'custom',
            position,
            data: { 
                label: nodeInfo.label, 
                icon: PALETTE_NODES.find(n => n.label === nodeInfo.label)?.icon,
                config: nodeInfo.config 
            },
            ...nodeDefaults,
        };

        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    const onNodeClick = (event: React.MouseEvent, node: CustomNode) => {
        setSelectedNode(node);
    };

    const updateNodeConfig = (nodeId: string, data: NodeData) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            )
        );
        if (selectedNode?.id === nodeId) {
            setSelectedNode(prev => prev ? ({ ...prev, data: { ...prev.data, ...data } }) : null);
        }
    };
    
    const handleAIGenerate = async (prompt: string) => {
        setIsLoading(true);
        setError('');
        setAiResponse('');

        try {
            const fullPrompt = `You are a workflow design expert. Convert the following description into a JSON object representing nodes and edges for a flowchart.
            The JSON should have two keys: "nodes" and "edges".
            - "nodes" should be an array of objects, each with an "id" and a "data" object containing a "label". The "id" should be a short, descriptive slug.
            - "edges" should be an array of objects, each with a unique "id" (e.g., "e1-2"), a "source" (the id of the source node), and a "target" (the id of the target node).
            Do not include any explanation, only the JSON object.
            
            Workflow Description: "${prompt}"`;

            const result = await ai.getGenerativeModel({ model: "gemini-pro" }).generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text().replace(/```json\n|```/g, '').trim();
            const workflowData = JSON.parse(text);

            if (workflowData.nodes && workflowData.edges) {
                const newNodes: CustomNode[] = workflowData.nodes.map(n => ({
                    ...n,
                    position: { x: 0, y: 0 },
                    ...nodeDefaults,
                    type: 'custom',
                    data: {
                      ...n.data,
                      icon: <FiSettings />
                    }
                }));
                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, workflowData.edges, 'LR');
                setNodes(layoutedNodes);
                setEdges(layoutedEdges);
                setSelectedNode(null);
            } else {
                throw new Error("Invalid JSON structure from AI.");
            }
        } catch (e) {
            console.error("Failed to generate workflow from description", e);
            setError('The AI could not generate a workflow. Please check your prompt or API key.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAIAction = async (action: string) => {
        setIsLoading(true);
        setError('');
        setAiResponse('');
        const currentWorkflow = toObject();

        try {
            let fullPrompt = `You are a senior business process analyst. You are given a workflow as a JSON object.`;
            switch(action) {
                case 'explain':
                    fullPrompt += `\nProvide a concise, step-by-step explanation of this workflow in plain English.`;
                    break;
                case 'document':
                    fullPrompt += `\nGenerate a detailed markdown documentation for this workflow, including purpose, steps, roles involved, and potential failure points.`;
                    break;
                case 'optimize':
                    fullPrompt += `\nAnalyze this workflow for inefficiencies. Suggest specific, actionable improvements in a bulleted list. For example, suggest parallelizing steps, automating approvals, or removing redundant actions.`;
                    break;
                case 'cost':
                     fullPrompt += `\nAssuming each integration step (like sending an email or using a cloud function) has a small cost and each manual step has a time cost, provide a high-level cost and time-to-completion estimate for this workflow. Present it in a short summary.`;
                    break;
                default:
                    throw new Error("Unknown AI action");
            }
            fullPrompt += `\n\nWorkflow JSON:\n${JSON.stringify(currentWorkflow, null, 2)}`;

            const result = await ai.getGenerativeModel({ model: "gemini-pro" }).generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();
            setAiResponse(text);

        } catch (e) {
            console.error(`AI action '${action}' failed`, e);
            setError(`The AI could not perform the action. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setNodes([]);
        setEdges([]);
        setSelectedNode(null);
        setAiResponse('');
    };

    const handleSave = () => {
        const workflow = toObject();
        localStorage.setItem('demobank-workflow', JSON.stringify(workflow));
        alert('Workflow saved to local storage!');
    };

    const handleLoad = () => {
        const savedWorkflow = localStorage.getItem('demobank-workflow');
        if (savedWorkflow) {
            const { nodes, edges, viewport } = JSON.parse(savedWorkflow);
            setNodes(nodes);
            setEdges(edges);
            setViewport(viewport);
        } else {
            alert('No saved workflow found.');
        }
    };
    
    const handleExport = () => {
        const workflow = toObject();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflow, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "workflow.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const onDragStart = (event, nodeInfo) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeInfo));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="flex space-x-6 h-full">
            <div className="w-1/4 space-y-4">
                <NodePalette onDragStart={onDragStart} />
                <AIInteractionPanel onGenerate={handleAIGenerate} onAction={handleAIAction} isLoading={isLoading} />
            </div>

            <div className="flex-grow h-full flex flex-col space-y-4">
                <Toolbar onLayout={onLayout} onClear={handleClear} onSave={handleSave} onLoad={handleLoad} onExport={handleExport} />
                <div className="flex-grow rounded-lg bg-gray-900/50 relative" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={() => setSelectedNode(null)}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-gray-800"
                    >
                        <Controls />
                        <MiniMap />
                        <Background variant="dots" gap={12} size={1} />
                    </ReactFlow>
                </div>
                 {(aiResponse || error) && (
                    <Card title="AI Response">
                        <div className="p-4 bg-gray-900/50 rounded max-h-48 overflow-y-auto">
                            {error && <p className="text-red-400">{error}</p>}
                            {aiResponse && <pre className="text-gray-300 whitespace-pre-wrap font-sans">{aiResponse}</pre>}
                        </div>
                    </Card>
                )}
            </div>

            <div className="w-1/4">
                <PropertiesPanel selectedNode={selectedNode} updateNodeConfig={updateNodeConfig} />
            </div>
        </div>
    );
};


const DemoBankWorkflowEngineView: React.FC = () => {
    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Workflow Engine</h2>
            <p className="text-gray-400 -mt-4">
                Visually design, automate, and manage complex business processes with an AI-powered, enterprise-grade workflow engine.
            </p>
            <div className="flex-grow">
                 <ReactFlowProvider>
                    <WorkflowCanvas />
                </ReactFlowProvider>
            </div>
        </div>
    );
};

// Add FiCheckSquare and FiClock if they are missing
import { FiCheckSquare, FiClock } from 'react-icons/fi';

export default DemoBankWorkflowEngineView;