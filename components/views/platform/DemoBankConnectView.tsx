// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankConnectView.tsx
================================================================================

```typescript
import React, { useState, useMemo, useCallback } from 'react';
import Card from '../../Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Zap, Play, Pause, History, Rss, Code, Settings, Plus, Search, Filter, Mail, Slack, Database, BarChart2, Briefcase, ShoppingCart, Cpu, BrainCircuit, Shield, MoreHorizontal, ChevronRight, Copy, RefreshCw, AlertCircle, CheckCircle, Info, ExternalLink } from 'lucide-react';

// --- TYPES ---

type FlowStatus = 'Enabled' | 'Disabled' | 'Error';
type TaskStatus = 'Success' | 'Failed' | 'Running';
type ConnectorCategory = 'Communication' | 'CRM' | 'Developer Tools' | 'File Management' | 'Finance' | 'AI & Machine Learning' | 'Marketing' | 'Project Management' | 'E-commerce' | 'Security';

interface Flow {
    id: string;
    name: string;
    status: FlowStatus;
    lastRun: string;
    runCount: number;
    successRate: number;
    connectors: string[]; // e.g., ['Gmail', 'Slack']
    trigger: string;
    avgDuration: number; // in ms
}

interface TaskRun {
    id: string;
    flowId: string;
    flowName: string;
    status: TaskStatus;
    timestamp: string;
    duration: number; // in ms
    inputData: object;
    outputData: object;
    error?: string;
}

interface Connector {
    id: string;
    name: string;
    description: string;
    category: ConnectorCategory;
    logo: React.ReactNode;
    triggers: string[];
    actions: string[];
}


// --- MOCK DATA ---

const mockFlows: Flow[] = [
    { id: 'flow_1', name: 'When new Invoice is Paid, send Slack notification', status: 'Enabled', lastRun: '5m ago', runCount: 1250, successRate: 99.8, connectors: ['Stripe', 'Slack'], trigger: 'Stripe: New Successful Payment', avgDuration: 350 },
    { id: 'flow_2', name: 'Create new CRM contact from new Counterparty', status: 'Enabled', lastRun: '1h ago', runCount: 430, successRate: 100, connectors: ['Internal API', 'Salesforce'], trigger: 'Webhook: New Counterparty Created', avgDuration: 800 },
    { id: 'flow_3', name: 'Sync daily transactions to QuantumBooks', status: 'Enabled', lastRun: '3h ago', runCount: 1, successRate: 100, connectors: ['Plaid', 'QuantumBooks'], trigger: 'Schedule: Every Day at 1 AM', avgDuration: 12500 },
    { id: 'flow_4', name: 'If corporate card spend > $1000, request approval', status: 'Disabled', lastRun: '2d ago', runCount: 89, successRate: 98.5, connectors: ['Brex', 'Jira'], trigger: 'Brex: New Expense', avgDuration: 1200 },
    { id: 'flow_5', name: 'Generate AI summary for high-priority support tickets', status: 'Enabled', lastRun: '15s ago', runCount: 3512, successRate: 99.1, connectors: ['Zendesk', 'OpenAI'], trigger: 'Zendesk: New Ticket with "Urgent" tag', avgDuration: 4500 },
    { id: 'flow_6', name: 'Log all new GitHub commits to a database', status: 'Error', lastRun: '45m ago', runCount: 780, successRate: 92.3, connectors: ['GitHub', 'PostgreSQL'], trigger: 'GitHub: New Commit to main branch', avgDuration: 600 },
];

const taskRunsData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    runs: 5000 + Math.random() * 2000,
    errors: Math.floor(Math.random() * 50)
}));

const mockTaskHistory: TaskRun[] = Array.from({ length: 100 }, (_, i) => {
    const flow = mockFlows[i % mockFlows.length];
    const status: TaskStatus = Math.random() > 0.1 ? 'Success' : 'Failed';
    return {
        id: `run_${Date.now() - i * 100000}`,
        flowId: flow.id,
        flowName: flow.name,
        status,
        timestamp: new Date(Date.now() - i * 100000).toISOString(),
        duration: Math.floor(Math.random() * 5000) + 200,
        inputData: { trigger: 'mock trigger data', value: `value_${i}` },
        outputData: status === 'Success' ? { result: 'mock success data', detail: `detail_${i}` } : {},
        error: status === 'Failed' ? 'API connection timeout at step 2' : undefined,
    };
});

const connectorList: Connector[] = [
    { id: 'slack', name: 'Slack', description: 'Team communication and collaboration.', category: 'Communication', logo: <Slack className="w-8 h-8 text-[#4A154B]" />, triggers: ['New Message', 'New Channel'], actions: ['Send Message', 'Create Channel'] },
    { id: 'gmail', name: 'Gmail', description: 'Email service by Google.', category: 'Communication', logo: <Mail className="w-8 h-8 text-[#EA4335]" />, triggers: ['New Email', 'New Labeled Email'], actions: ['Send Email', 'Create Draft'] },
    { id: 'salesforce', name: 'Salesforce', description: 'Cloud-based CRM software.', category: 'CRM', logo: <Briefcase className="w-8 h-8 text-[#00A1E0]" />, triggers: ['New Record', 'Updated Record'], actions: ['Create Record', 'Update Record'] },
    { id: 'github', name: 'GitHub', description: 'Code hosting platform.', category: 'Developer Tools', logo: <Code className="w-8 h-8 text-white" />, triggers: ['New Commit', 'New Issue'], actions: ['Create Issue', 'Create Repository'] },
    { id: 'stripe', name: 'Stripe', description: 'Online payment processing.', category: 'Finance', logo: <CreditCard className="w-8 h-8 text-[#6772E5]" />, triggers: ['New Charge', 'New Customer'], actions: ['Create Charge', 'Create Customer'] },
    { id: 'openai', name: 'OpenAI', description: 'Advanced AI models like GPT-4.', category: 'AI & Machine Learning', logo: <BrainCircuit className="w-8 h-8 text-green-500" />, triggers: [], actions: ['Generate Text', 'Analyze Image'] },
    { id: 'aws_s3', name: 'AWS S3', description: 'Scalable object storage in the cloud.', category: 'File Management', logo: <Database className="w-8 h-8 text-[#FF9900]" />, triggers: ['New Object'], actions: ['Upload Object', 'Delete Object'] },
    { id: 'google_drive', name: 'Google Drive', description: 'File storage and synchronization service.', category: 'File Management', logo: <Folder className="w-8 h-8 text-[#4285F4]" />, triggers: ['New File in Folder'], actions: ['Upload File', 'Create Folder'] },
    { id: 'jira', name: 'Jira', description: 'Issue tracking and project management.', category: 'Project Management', logo: <CheckSquare className="w-8 h-8 text-[#0052CC]" />, triggers: ['New Issue', 'Issue Updated'], actions: ['Create Issue', 'Transition Issue'] },
    { id: 'shopify', name: 'Shopify', description: 'E-commerce platform.', category: 'E-commerce', logo: <ShoppingCart className="w-8 h-8 text-[#95BF47]" />, triggers: ['New Order', 'New Customer'], actions: ['Create Product', 'Update Inventory'] },
    { id: 'hubspot', name: 'HubSpot', description: 'Marketing, sales, and service software.', category: 'Marketing', logo: <BarChart2 className="w-8 h-8 text-[#FF7A59]" />, triggers: ['New Contact', 'Form Submission'], actions: ['Create Contact', 'Add Contact to List'] },
    { id: 'quantum_shield', name: 'QuantumShield', description: 'Next-gen biometric security services.', category: 'Security', logo: <Shield className="w-8 h-8 text-cyan-400" />, triggers: ['High-Risk Login Detected'], actions: ['Initiate Biometric Scan', 'Lock Account'] },
];

// --- SUB-COMPONENTS ---

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card>
        <div className="flex items-center">
            <div className="p-3 bg-gray-800 rounded-lg mr-4">{icon}</div>
            <div>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-400 mt-1">{title}</p>
            </div>
        </div>
    </Card>
);

const DashboardTab: React.FC = () => {
    const totalRuns = useMemo(() => taskRunsData.reduce((acc, day) => acc + day.runs, 0), []);
    const successRate = useMemo(() => {
        const totalErrors = taskRunsData.reduce((acc, day) => acc + day.errors, 0);
        return (100 * (1 - totalErrors / totalRuns)).toFixed(2) + '%';
    }, [totalRuns]);

    const flowStatusData = useMemo(() => {
        const counts = mockFlows.reduce((acc, flow) => {
            acc[flow.status] = (acc[flow.status] || 0) + 1;
            return acc;
        }, {} as Record<FlowStatus, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, []);

    const COLORS = { 'Enabled': '#22c55e', 'Disabled': '#f97316', 'Error': '#ef4444' };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Flows" value={mockFlows.filter(f => f.status === 'Enabled').length.toString()} icon={<Zap className="w-6 h-6 text-green-400"/>} />
                <StatCard title="Connectors" value={`${connectorList.length}+`} icon={<Cpu className="w-6 h-6 text-indigo-400"/>} />
                <StatCard title="Task Runs (30d)" value={`${(totalRuns / 1000).toFixed(1)}k`} icon={<Play className="w-6 h-6 text-blue-400"/>} />
                <StatCard title="Success Rate (30d)" value={successRate} icon={<CheckCircle className="w-6 h-6 text-teal-400"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Task Runs (Last 30 Days)" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={taskRunsData}>
                            <defs>
                                <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                                <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                            </defs>
                            <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#4b5563', borderRadius: '0.5rem' }}/>
                            <Legend />
                            <Area type="monotone" dataKey="runs" stroke="#6366f1" fill="url(#colorRuns)" name="Task Runs" />
                            <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="url(#colorErrors)" name="Errors" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Flow Status">
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={flowStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {flowStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as FlowStatus]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#4b5563', borderRadius: '0.5rem' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            
            <Card title="Recent Activity">
                <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Flow Name</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Timestamp</th>
                                <th scope="col" className="px-6 py-3">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockTaskHistory.slice(0, 10).map(task => (
                                <tr key={task.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{task.flowName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            task.status === 'Success' ? 'bg-green-500/20 text-green-400' :
                                            task.status === 'Failed' ? 'bg-red-500/20 text-red-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(task.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4">{task.duration}ms</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const FlowCardComponent: React.FC<{ flow: Flow }> = ({ flow }) => {
    const [status, setStatus] = useState(flow.status === 'Enabled');

    return (
        <Card className="flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <p className="font-bold text-white text-lg mb-2 pr-4">{flow.name}</p>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-xs m-1"><MoreHorizontal /></label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a>Edit Flow</a></li>
                            <li><a>View History</a></li>
                            <li><a>Duplicate</a></li>
                            <li><a className="text-red-500">Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center space-x-2 my-2">
                    {flow.connectors.map(c => {
                        const connector = connectorList.find(cl => cl.name === c);
                        return connector ? <div key={c} className="tooltip" data-tip={c}>{connector.logo}</div> : null;
                    })}
                </div>
                <p className="text-xs text-gray-400 mt-2">Trigger: {flow.trigger}</p>
            </div>
            <div className="mt-4 border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">Status</span>
                        <input type="checkbox" className="toggle toggle-sm toggle-cyan" checked={status} onChange={() => setStatus(!status)} />
                        <span className={`font-semibold ${status ? 'text-cyan-400' : 'text-gray-500'}`}>{status ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400">Last run: {flow.lastRun}</p>
                        <p className="text-gray-400">Success: {flow.successRate}%</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const MyFlowsTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFlows, setFilteredFlows] = useState<Flow[]>(mockFlows);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (!term) {
            setFilteredFlows(mockFlows);
        } else {
            setFilteredFlows(mockFlows.filter(flow => 
                flow.name.toLowerCase().includes(term.toLowerCase()) ||
                flow.connectors.some(c => c.toLowerCase().includes(term.toLowerCase()))
            ));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search flows..."
                        className="input input-bordered w-full max-w-xs pl-10"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <button className="btn btn-primary"><Plus className="w-4 h-4 mr-2" /> Create New Flow</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFlows.map(flow => <FlowCardComponent key={flow.id} flow={flow} />)}
            </div>
        </div>
    );
}

const ConnectorCard: React.FC<{ connector: Connector }> = ({ connector }) => (
    <Card className="hover:border-cyan-400 transition-colors duration-300 group">
        <div className="flex items-center mb-4">
            {connector.logo}
            <h3 className="text-xl font-bold text-white ml-4">{connector.name}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4 h-10">{connector.description}</p>
        <div className="flex justify-between items-center">
            <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">{connector.category}</span>
            <button className="btn btn-sm btn-outline btn-primary opacity-0 group-hover:opacity-100 transition-opacity">Connect</button>
        </div>
    </Card>
);

const ConnectorsTab: React.FC = () => {
    const categories = useMemo(() => Array.from(new Set(connectorList.map(c => c.category))), []);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConnectors = useMemo(() => {
        return connectorList.filter(c => {
            const matchesCategory = selectedCategory ? c.category === selectedCategory : true;
            const matchesSearch = searchTerm ? c.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search connectors..."
                        className="input input-bordered w-full md:w-72 pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="tabs tabs-boxed">
                    <a className={`tab ${!selectedCategory ? 'tab-active' : ''}`} onClick={() => setSelectedCategory(null)}>All</a>
                    {categories.map(cat => (
                        <a key={cat} className={`tab ${selectedCategory === cat ? 'tab-active' : ''}`} onClick={() => setSelectedCategory(cat)}>{cat}</a>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredConnectors.map(c => <ConnectorCard key={c.id} connector={c} />)}
            </div>
        </div>
    );
};

const TaskHistoryTab: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<TaskRun | null>(null);
    return (
        <Card title="Task Run History">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Flow Name</th>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                            <th scope="col" className="px-6 py-3">Duration (ms)</th>
                            <th scope="col" className="px-6 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTaskHistory.map(task => (
                            <tr key={task.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-6 py-4">
                                    {task.status === 'Success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                    {task.status === 'Failed' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                    {task.status === 'Running' && <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
                                </td>
                                <td className="px-6 py-4 font-medium text-white">{task.flowName}</td>
                                <td className="px-6 py-4">{new Date(task.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4">{task.duration}</td>
                                <td className="px-6 py-4">
                                    <button className="btn btn-xs btn-ghost" onClick={() => setSelectedTask(task)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-4xl">
                        <h3 className="font-bold text-lg mb-4">Task Details: {selectedTask.id}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><strong className="text-gray-300">Flow Name:</strong> {selectedTask.flowName}</p>
                            <p><strong className="text-gray-300">Timestamp:</strong> {new Date(selectedTask.timestamp).toISOString()}</p>
                            <p><strong className="text-gray-300">Status:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                                    selectedTask.status === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>{selectedTask.status}</span>
                            </p>
                            <p><strong className="text-gray-300">Duration:</strong> {selectedTask.duration}ms</p>
                        </div>
                        {selectedTask.error && (
                            <div className="alert alert-error mt-4">
                                <AlertCircle />
                                <div>
                                    <h3 className="font-bold">Error</h3>
                                    <div className="text-xs">{selectedTask.error}</div>
                                </div>
                            </div>
                        )}
                        <div className="space-y-4 mt-4">
                            <div>
                                <h4 className="font-bold text-md text-gray-200 mb-2">Input Data</h4>
                                <pre className="bg-gray-900 p-4 rounded-lg text-xs overflow-auto max-h-48">
                                    {JSON.stringify(selectedTask.inputData, null, 2)}
                                </pre>
                            </div>
                             <div>
                                <h4 className="font-bold text-md text-gray-200 mb-2">Output Data</h4>
                                <pre className="bg-gray-900 p-4 rounded-lg text-xs overflow-auto max-h-48">
                                    {JSON.stringify(selectedTask.outputData, null, 2)}
                                </pre>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setSelectedTask(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

const FlowBuilderTab: React.FC = () => {
    return (
        <Card title="Flow Builder">
            <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                <label className="label">
                    <span className="label-text flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-cyan-400"/> Describe your flow with AI</span>
                </label>
                <div className="flex gap-2">
                    <input type="text" placeholder="e.g., 'When a new file is added to Google Drive, summarize it with AI and send to Slack'" className="input input-bordered w-full" />
                    <button className="btn btn-primary">Generate Flow</button>
                </div>
            </div>
            <div className="flex h-[600px] border border-gray-700 rounded-lg">
                {/* Left Panel: Triggers & Actions */}
                <div className="w-1/4 bg-gray-900/30 p-4 overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4">Connectors</h3>
                    <ul className="menu bg-base-800 w-full rounded-box">
                        {connectorList.map(c => (
                            <li key={c.id}>
                                <details>
                                    <summary className="flex items-center gap-2">{c.logo}{c.name}</summary>
                                    <ul>
                                        {c.triggers.map(t => <li key={t}><a><Rss className="w-4 h-4 text-yellow-400"/>{t}</a></li>)}
                                        {c.actions.map(a => <li key={a}><a><Zap className="w-4 h-4 text-blue-400"/>{a}</a></li>)}
                                    </ul>
                                </details>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Center Panel: Canvas */}
                <div className="w-1/2 bg-grid-gray-700/[0.2] p-8 flex flex-col items-center space-y-4 relative">
                    {/* Visual representation of a flow */}
                    <div className="flow-step">
                        <Rss className="w-5 h-5 text-yellow-400 mr-2" />
                        <span>Trigger: New Stripe Payment</span>
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flow-step">
                        <Filter className="w-5 h-5 text-orange-400 mr-2" />
                        <span>Filter: Amount > $100</span>
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flow-step">
                        <BrainCircuit className="w-5 h-5 text-green-400 mr-2" />
                        <span>AI: Extract Customer Name</span>
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flow-step">
                         <Slack className="w-5 h-5 text-purple-400 mr-2" />
                        <span>Action: Send Slack Message</span>
                    </div>
                </div>
                {/* Right Panel: Config */}
                <div className="w-1/4 bg-gray-900/30 p-4 border-l border-gray-700">
                    <h3 className="font-bold text-lg mb-4">Configure Step</h3>
                    <div className="space-y-4">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Channel</span></div>
                            <select className="select select-bordered">
                                <option>#general</option>
                                <option>#sales-alerts</option>
                                <option>#finance</option>
                            </select>
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Message Text</span></div>
                            <textarea className="textarea textarea-bordered h-24" placeholder="Use data from previous steps..."></textarea>
                        </label>
                        <button className="btn btn-outline btn-sm w-full">Test Action</button>
                    </div>
                </div>
            </div>
             <style jsx>{`
                .bg-grid-gray-700\\[\\[0\\.2\\]] {
                    background-image: linear-gradient(to right, rgba(107, 114, 128, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(107, 114, 128, 0.2) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .flow-step {
                    @apply bg-gray-800 border border-gray-600 rounded-lg p-4 w-72 flex items-center cursor-pointer hover:border-cyan-400 transition-colors shadow-lg;
                }
            `}</style>
        </Card>
    );
};

const ApiWebhooksTab: React.FC = () => {
    const apiKey = "db_conn_****************************";
    return (
        <div className="space-y-6">
            <Card title="API Key">
                <p className="text-gray-400 mb-4">Use this key to authenticate with the Demo Bank Connect API.</p>
                <div className="flex items-center gap-2">
                    <input type="text" readOnly value={apiKey} className="input input-bordered w-full font-mono" />
                    <button className="btn btn-square" onClick={() => navigator.clipboard.writeText(apiKey)}><Copy /></button>
                    <button className="btn btn-square"><RefreshCw /></button>
                </div>
                <a href="#" className="text-cyan-400 hover:underline text-sm mt-4 inline-flex items-center">
                    Read API Documentation <ExternalLink className="w-4 h-4 ml-1" />
                </a>
            </Card>
            <Card title="Incoming Webhooks">
                 <p className="text-gray-400 mb-4">Use webhooks to trigger flows from your own applications or external services.</p>
                 <button className="btn btn-primary mb-4"><Plus className="w-4 h-4 mr-2" /> Create Webhook</button>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">URL</th>
                                <th className="px-6 py-3">Associated Flows</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                         <tbody>
                            <tr className="border-b border-gray-800">
                                <td className="px-6 py-4">New User Webhook</td>
                                <td className="px-6 py-4 font-mono">https://connect.demobank.com/hook/xyz...</td>
                                <td className="px-6 py-4">2</td>
                                <td className="px-6 py-4"><button className="btn btn-xs btn-ghost">Manage</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

// --- MAIN COMPONENT ---

const DemoBankConnectView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const tabs = ['Dashboard', 'My Flows', 'Connectors', 'Task History', 'Flow Builder', 'API & Webhooks'];
    const tabIcons: { [key: string]: React.ReactNode } = {
        'Dashboard': <BarChart2 className="w-5 h-5 mr-2" />,
        'My Flows': <Zap className="w-5 h-5 mr-2" />,
        'Connectors': <Cpu className="w-5 h-5 mr-2" />,
        'Task History': <History className="w-5 h-5 mr-2" />,
        'Flow Builder': <Plus className="w-5 h-5 mr-2" />,
        'API & Webhooks': <Code className="w-5 h-5 mr-2" />,
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': return <DashboardTab />;
            case 'My Flows': return <MyFlowsTab />;
            case 'Connectors': return <ConnectorsTab />;
            case 'Task History': return <TaskHistoryTab />;
            case 'Flow Builder': return <FlowBuilderTab />;
            case 'API & Webhooks': return <ApiWebhooksTab />;
            default: return <DashboardTab />;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white tracking-tight">Demo Bank Connect</h1>
            <p className="text-lg text-gray-400 max-w-3xl">Automate your workflows by connecting your favorite apps. Build powerful, custom integrations with no code, or extend your capabilities with our developer-friendly API.</p>
            
            <div className="tabs tabs-boxed bg-gray-900/50">
                {tabs.map(tab => (
                    <a
                        key={tab}
                        className={`tab tab-lg text-base ${activeTab === tab ? 'tab-active !bg-cyan-600 !text-white' : 'hover:bg-gray-700/50'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tabIcons[tab]} {tab}
                    </a>
                ))}
            </div>

            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

// Temporary icons for placeholders if not already imported from a library
const CreditCard: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);
const Folder: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"></path>
  </svg>
);
const CheckSquare: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);


export default DemoBankConnectView;
```