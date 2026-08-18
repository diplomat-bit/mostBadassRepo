// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankRoboticsView.tsx
================================================================================

```typescript
// components/views/platform/DemoBankRoboticsView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bot, BatteryFull, BatteryMedium, BatteryLow, WifiOff, PlayCircle, Wrench, BrainCircuit, Loader2, ListChecks, CheckCircle2, XCircle } from 'lucide-react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

// --- TYPES AND INTERFACES ---

type RobotStatus = 'idle' | 'active' | 'charging' | 'maintenance' | 'offline';

interface Robot {
  id: string;
  model: string;
  status: RobotStatus;
  battery: number;
  location: { x: number; y: number; z: number };
  currentTask: string | null;
  telemetry: {
    motorTemp: number[];
    jointAngles: number[];
    uptime: number; // in hours
    lastErrorCode: string | null;
  };
}

interface RobotCommand {
  action: string;
  target: string;
  parameters: Record<string, any>;
  speed?: number;
}

interface RobotTask {
    id: string;
    description: string;
    robotId: string | null;
    status: 'queued' | 'in_progress' | 'completed' | 'failed';
    commands: RobotCommand[];
}

// --- MOCK DATA ---

const MOCK_ROBOTS: Robot[] = [
  { id: 'ARM-001', model: 'KUKA KR 1000', status: 'idle', battery: 95, location: { x: 10, y: 5, z: 0 }, currentTask: null, telemetry: { motorTemp: [45, 47, 46, 48], jointAngles: [0, 0, 90, 0, 90, 0], uptime: 1200, lastErrorCode: null } },
  { id: 'ARM-002', model: 'Fanuc R-2000iC', status: 'active', battery: 78, location: { x: 12, y: 15, z: 2 }, currentTask: 'Task-001', telemetry: { motorTemp: [65, 68, 67, 66], jointAngles: [30, -45, 110, 15, 70, -20], uptime: 850, lastErrorCode: null } },
  { id: 'ARM-003', model: 'ABB IRB 6700', status: 'charging', battery: 34, location: { x: 0, y: 0, z: 0 }, currentTask: null, telemetry: { motorTemp: [35, 36, 35, 34], jointAngles: [0, -90, 0, 0, 0, 0], uptime: 2500, lastErrorCode: 'E-4041' } },
  { id: 'ARM-004', model: 'KUKA KR 1000', status: 'maintenance', battery: 100, location: { x: -5, y: -5, z: 0 }, currentTask: null, telemetry: { motorTemp: [30, 31, 29, 32], jointAngles: [0, 0, 0, 0, 0, 0], uptime: 1800, lastErrorCode: 'W-2100' } },
  { id: 'ARM-005', model: 'Yaskawa Motoman GP25', status: 'offline', battery: 0, location: { x: 20, y: 8, z: 1 }, currentTask: null, telemetry: { motorTemp: [25, 25, 25, 25], jointAngles: [0, 0, 0, 0, 0, 0], uptime: 500, lastErrorCode: 'E-9999' } },
  { id: 'ARM-006', model: 'Fanuc R-2000iC', status: 'idle', battery: 99, location: { x: 18, y: 2, z: 0 }, currentTask: null, telemetry: { motorTemp: [42, 43, 41, 44], jointAngles: [0, 0, 90, 0, 90, 0], uptime: 940, lastErrorCode: null } },
];

const MOCK_TASKS: RobotTask[] = [
    { id: 'Task-001', description: 'Weld seam on part #XYZ-123', robotId: 'ARM-002', status: 'in_progress', commands: [
        { action: 'moveTo', target: 'part_xyz_123_start', parameters: { approach: 'linear' }, speed: 0.8 },
        { action: 'setTool', target: 'welder', parameters: { state: 'on', temperature: 1200 } },
        { action: 'weld', target: 'seam_a', parameters: { duration: 15, wire_feed: 5 } },
        { action: 'setTool', target: 'welder', parameters: { state: 'off' } },
        { action: 'moveTo', target: 'home', parameters: { approach: 'joint' }, speed: 1.0 },
    ]},
    { id: 'Task-002', description: 'Pick up assembly from conveyor and place on pallet A', robotId: null, status: 'queued', commands: [] },
    { id: 'Task-003', description: 'Quality inspection scan on component #ABC-456', robotId: null, status: 'queued', commands: [] },
];

// --- UI HELPER COMPONENTS & CONSTANTS ---

const STATUS_CONFIG = {
  idle: { icon: Bot, color: 'text-green-400' },
  active: { icon: PlayCircle, color: 'text-cyan-400' },
  charging: { icon: BatteryMedium, color: 'text-yellow-400' },
  maintenance: { icon: Wrench, color: 'text-orange-400' },
  offline: { icon: WifiOff, color: 'text-gray-500' },
};

const BATTERY_CONFIG = (level: number) => {
  if (level > 75) return { icon: BatteryFull, color: 'text-green-400' };
  if (level > 25) return { icon: BatteryMedium, color: 'text-yellow-400' };
  return { icon: BatteryLow, color: 'text-red-500' };
};

const PIE_CHART_COLORS = {
    idle: '#4ade80',
    active: '#22d3ee',
    charging: '#facc15',
    maintenance: '#fb923c',
    offline: '#6b7280',
};


const DemoBankRoboticsView: React.FC = () => {
    const [prompt, setPrompt] = useState("pick up the red cube at position A and precisely place it inside the blue container at position B");
    const [generatedCommands, setGeneratedCommands] = useState<{ commands: RobotCommand[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'commands' | 'diagnostics'>('overview');
    const [robots] = useState<Robot[]>(MOCK_ROBOTS);
    const [tasks] = useState<RobotTask[]>(MOCK_TASKS);
    const [selectedRobotId, setSelectedRobotId] = useState<string | null>(MOCK_ROBOTS[0]?.id || null);
    const [diagnosticReport, setDiagnosticReport] = useState<string | null>(null);
    const [isDiagnosing, setIsDiagnosing] = useState(false);
    const [simulationLog, setSimulationLog] = useState<string[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleGenerateCommands = async () => {
        setIsLoading(true);
        setGeneratedCommands(null);
        setSimulationLog([]);
        try {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || (window as any).apiKey;
            if (!apiKey) {
                alert("API Key not found. Please set it in your environment or a global variable.");
                setIsLoading(false);
                return;
            }
            const ai = new GoogleGenAI({ apiKey });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    commands: {
                        type: Type.ARRAY,
                        description: "A sequence of commands for the robotic arm.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                action: { type: Type.STRING, description: "Action to perform, e.g., 'moveTo', 'grip', 'release', 'wait'." },
                                target: { type: Type.STRING, description: "Named target location, object, or tool." },
                                parameters: { type: Type.OBJECT, description: "Action-specific parameters, e.g., coordinates, pressure." },
                                speed: { type: Type.NUMBER, description: "Optional speed multiplier (0.1 to 1.5)." }
                            },
                            required: ["action", "target", "parameters"]
                        }
                    }
                }
            };
            const fullPrompt = `You are a world-class robotics control engineer. Translate the following high-level task into a precise sequence of JSON commands for a 6-axis robotic arm. Be concise and logical. Available Actions: moveTo, grip, release, wait, setTool. Task: "${prompt}"`;
            
            const response = await ai.models.generateContent({ model: 'gemini-1.5-flash', contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setGeneratedCommands(JSON.parse(response.text));
        } catch (error) {
            console.error("Error generating commands:", error);
            alert("Failed to generate commands. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRunDiagnostics = async () => {
        if (!selectedRobotId) return;
        setIsDiagnosing(true);
        setDiagnosticReport(null);
        const selectedRobot = robots.find(r => r.id === selectedRobotId);
        if (!selectedRobot) {
            setIsDiagnosing(false);
            return;
        }

        try {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || (window as any).apiKey;
             if (!apiKey) {
                alert("API Key not found. Please set it in your environment or a global variable.");
                setIsDiagnosing(false);
                return;
            }
            const ai = new GoogleGenAI({ apiKey });
            const telemetryData = JSON.stringify(selectedRobot.telemetry, null, 2);
            const prompt = `You are an expert AI robotics maintenance engineer. Analyze the following telemetry data for robot ${selectedRobot.id} (Model: ${selectedRobot.model}). Provide a concise, professional diagnostic report in Markdown format, including: Overall Health Assessment, Key Observations, Potential Issues, and Recommended Actions. Telemetry Data: \`\`\`json\n${telemetryData}\n\`\`\``;
            const response = await ai.models.generateContent({ model: 'gemini-1.5-flash', contents: prompt });
            setDiagnosticReport(response.text);

        } catch (error) {
            console.error("Error running diagnostics:", error);
            setDiagnosticReport("Failed to generate report. An error occurred.");
        } finally {
            setIsDiagnosing(false);
        }
    };

    const runSimulation = () => {
        if (!generatedCommands || generatedCommands.commands.length === 0) return;
        setIsSimulating(true);
        setSimulationLog([]);
        let log: string[] = [];

        generatedCommands.commands.forEach((command, index) => {
            setTimeout(() => {
                const newLogEntry = `[STEP ${index + 1}] Executing: ${command.action} on target '${command.target}' with params ${JSON.stringify(command.parameters)}`;
                log = [...log, newLogEntry];
                setSimulationLog(log);

                if (index === generatedCommands.commands.length - 1) {
                    setTimeout(() => {
                         const finalLog = [...log, `[INFO] Simulation finished.`];
                         setSimulationLog(finalLog);
                         setIsSimulating(false);
                    }, 500);
                }
            }, index * 750);
        });
    };

    const fleetStatusData = useMemo(() => {
        const counts = robots.reduce((acc, robot) => {
            acc[robot.status] = (acc[robot.status] || 0) + 1;
            return acc;
        }, {} as Record<RobotStatus, number>);

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [robots]);

    const renderFleetOverview = () => (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">{robots.length}</p><p className="text-sm text-gray-400 mt-1">Total Robots</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{robots.filter(r => r.status !== 'offline').length}</p><p className="text-sm text-gray-400 mt-1">Online</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{robots.filter(r => r.status === 'active').length}</p><p className="text-sm text-gray-400 mt-1">Actively Working</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{tasks.filter(t => t.status === 'in_progress' || t.status === 'queued').length}</p><p className="text-sm text-gray-400 mt-1">Pending Tasks</p></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Fleet Status" className="lg:col-span-1">
                     <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={fleetStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {fleetStatusData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={PIE_CHART_COLORS[entry.name as RobotStatus]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                 <Card title="Task Queue" className="lg:col-span-2">
                    <div className="max-h-[250px] overflow-y-auto">
                        <ul className="divide-y divide-gray-700">
                           {tasks.map(task => {
                                const statusIcon = {
                                    queued: <ListChecks className="w-5 h-5 text-yellow-400" />,
                                    in_progress: <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />,
                                    completed: <CheckCircle2 className="w-5 h-5 text-green-400" />,
                                    failed: <XCircle className="w-5 h-5 text-red-500" />
                                }[task.status];
                                return (
                                <li key={task.id} className="py-2 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {statusIcon}
                                        <div>
                                            <p className="text-white font-medium">{task.id}: {task.description}</p>
                                            <p className="text-sm text-gray-400">Assigned to: {task.robotId || 'Unassigned'}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono px-2 py-1 bg-gray-700 rounded">{task.status.toUpperCase()}</span>
                                </li>
                                );
                            })}
                        </ul>
                    </div>
                </Card>
            </div>
            <Card title="Robot Fleet Details">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-4 py-3">Robot ID</th>
                                <th scope="col" className="px-4 py-3">Model</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3">Battery</th>
                                <th scope="col" className="px-4 py-3">Location</th>
                                <th scope="col" className="px-4 py-3">Current Task</th>
                            </tr>
                        </thead>
                        <tbody>
                           {robots.map(robot => {
                               const StatusIcon = STATUS_CONFIG[robot.status].icon;
                               const statusColor = STATUS_CONFIG[robot.status].color;
                               const Battery = BATTERY_CONFIG(robot.battery);
                                return (
                                <tr key={robot.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                    <th scope="row" className="px-4 py-4 font-medium text-white whitespace-nowrap">{robot.id}</th>
                                    <td className="px-4 py-4">{robot.model}</td>
                                    <td className={`px-4 py-4 flex items-center space-x-2 ${statusColor}`}>
                                        <StatusIcon className="w-4 h-4" />
                                        <span>{robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center space-x-2">
                                            <Battery.icon className={`w-5 h-5 ${Battery.color}`} />
                                            <span>{robot.battery}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-mono">X:{robot.location.x}, Y:{robot.location.y}, Z:{robot.location.z}</td>
                                    <td className="px-4 py-4">{robot.currentTask || 'N/A'}</td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    const renderCommandAndSim = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="AI Robotics Command Generator">
                <p className="text-gray-400 mb-4">Describe a high-level task for a robotic arm. The more specific you are, the better the generated command sequence will be.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-32 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="e.g., 'Gently pick up the fragile vial from the rack and place it into the centrifuge.'"
                />
                <button onClick={handleGenerateCommands} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors flex items-center justify-center space-x-2">
                    {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Generating...</span></> : <><BrainCircuit className="w-5 h-5"/><span>Generate Command Sequence</span></>}
                </button>
            </Card>

            <Card title="Generated Sequence & Simulation">
                {generatedCommands && !isLoading ? (
                     <>
                        <div className="bg-gray-900/50 p-4 rounded max-h-60 overflow-auto mb-4">
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                                {JSON.stringify(generatedCommands, null, 2)}
                            </pre>
                        </div>
                        <button onClick={runSimulation} disabled={isSimulating} className="w-full py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 transition-colors flex items-center justify-center space-x-2">
                            {isSimulating ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Simulating...</span></> : <><PlayCircle className="w-5 h-5"/><span>Run Simulation</span></>}
                        </button>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        {isLoading ? 'Generating command sequence...' : 'Generate a command sequence to see it here.'}
                    </div>
                )}
                 {simulationLog.length > 0 && (
                     <div className="mt-4 bg-black p-4 rounded-lg max-h-60 overflow-auto font-mono text-xs text-green-400">
                        <p className="font-bold mb-2">Simulation Log:</p>
                        {simulationLog.map((log, index) => <p key={index}>{log}</p>)}
                    </div>
                 )}
            </Card>
        </div>
    );
    
     const renderDiagnostics = () => (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Robot Selection" className="lg:col-span-1">
                 <p className="text-gray-400 mb-4">Select a robot to run AI-powered diagnostics on its latest telemetry data.</p>
                 <select
                    value={selectedRobotId || ''}
                    onChange={e => setSelectedRobotId(e.target.value)}
                    className="w-full bg-gray-700/50 p-3 rounded text-white focus:ring-cyan-500 focus:border-cyan-500"
                 >
                    {robots.map(robot => <option key={robot.id} value={robot.id}>{robot.id} - {robot.model}</option>)}
                 </select>
                 <button onClick={handleRunDiagnostics} disabled={isDiagnosing || !selectedRobotId} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors flex items-center justify-center space-x-2">
                    {isDiagnosing ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Analyzing Data...</span></> : <><BrainCircuit className="w-5 h-5"/><span>Run AI Diagnostics</span></>}
                </button>
             </Card>
             <Card title="AI Diagnostic Report" className="lg:col-span-2">
                {isDiagnosing ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mr-3" /> AI is analyzing telemetry data...
                    </div>
                ) : diagnosticReport ? (
                    <div className="prose prose-invert prose-sm max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: diagnosticReport.replace(/\n/g, '<br />') }} />
                ) : (
                     <div className="h-full flex items-center justify-center text-gray-500">
                        Select a robot and run diagnostics to see the report.
                    </div>
                )}
             </Card>
        </div>
     );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Robotics Control Center</h2>
            
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('overview')} className={`${activeTab === 'overview' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}>
                        <Bot className="w-5 h-5" /><span>Fleet Overview</span>
                    </button>
                    <button onClick={() => setActiveTab('commands')} className={`${activeTab === 'commands' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}>
                       <BrainCircuit className="w-5 h-5" /><span>AI Command & Simulation</span>
                    </button>
                    <button onClick={() => setActiveTab('diagnostics')} className={`${activeTab === 'diagnostics' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}>
                        <Wrench className="w-5 h-5" /><span>Diagnostics & Maintenance</span>
                    </button>
                </nav>
            </div>
            
            <div>
                {activeTab === 'overview' && renderFleetOverview()}
                {activeTab === 'commands' && renderCommandAndSim()}
                {activeTab === 'diagnostics' && renderDiagnostics()}
            </div>
        </div>
    );
};

export default DemoBankRoboticsView;
```