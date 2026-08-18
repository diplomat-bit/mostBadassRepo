// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankGamingServicesView.tsx
================================================================================

```tsx
// components/views/platform/DemoBankGamingServicesView.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { ShieldCheck, Cpu, Users, DollarSign, AlertTriangle, Wand2, BookOpen, MessageSquare, Scale, Twitch, Bot, Server, Zap, Globe, ChevronsRight, BrainCircuit, BugPlay, Trophy, Star } from 'lucide-react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

// --- TYPES & INTERFACES ---

type Tab = 'dashboard' | 'ai-tools' | 'player-management' | 'server-health' | 'integrations';
type AITool = 'item-generator' | 'quest-generator' | 'dialogue-writer' | 'balance-assistant';

interface Player {
    id: string;
    rank: number;
    name: string;
    score: number;
    country: string;
    status: 'Online' | 'Offline' | 'In-Game';
    lastSeen: string;
    joinDate: string;
    flags: number;
}

interface ServerStatus {
    id: string;
    region: string;
    name: string;
    status: 'Online' | 'Maintenance' | 'Offline';
    population: number;
    maxPopulation: number;
    latency: number;
}

interface Anomaly {
    id: string;
    playerId: string;
    playerName: string;
    timestamp: string;
    type: 'Anomalous Currency Gain' | 'Impossible Movement' | 'Botting Activity';
    confidence: number;
    actionTaken: 'None' | 'Warned' | 'Suspended' | 'Banned';
}

interface TimeSeriesData {
    date: string;
    DAU: number;
    Revenue: number;
    NewPlayers: number;
}

// --- MOCK DATA GENERATION ---

const countries = ['🇺🇸', '🇪🇺', '🇯🇵', '🇰🇷', '🇨🇳', '🇨🇦', '🇧🇷', '🇦🇺'];
const playerNames = ['CyberNinja', 'GlitchMaster', 'VoidWalker', 'PixelVixen', 'DataWraith', 'QuantumLeap', 'ZeroCool', 'AcidBurn', 'CrashOverride', 'LordNikon'];

const generatePlayers = (count: number): Player[] => {
    return Array.from({ length: count }, (_, i) => {
        const name = `${playerNames[Math.floor(Math.random() * playerNames.length)]}${Math.floor(Math.random() * 900) + 100}`;
        const score = Math.floor(1_500_000 - i * (Math.random() * 20000));
        return {
            id: `p_${i + 1}`,
            rank: i + 1,
            name: name,
            score: score,
            country: countries[Math.floor(Math.random() * countries.length)],
            status: ['Online', 'Offline', 'In-Game'][Math.floor(Math.random() * 3)] as 'Online' | 'Offline' | 'In-Game',
            lastSeen: `${Math.floor(Math.random() * 24)}h ago`,
            joinDate: `2023-10-${Math.floor(Math.random() * 30) + 1}`,
            flags: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0,
        };
    });
};

const generateTimeSeriesData = (days: number): TimeSeriesData[] => {
    return Array.from({ length: days }, (_, i) => {
        const date = `Day ${i + 1}`;
        return {
            date,
            DAU: 1_200_000 + Math.floor(Math.sin(i / 3) * 100000) + Math.floor(Math.random() * 50000),
            Revenue: 45000 + Math.floor(Math.sin(i / 5) * 5000) + Math.floor(Math.random() * 3000),
            NewPlayers: 5000 + Math.floor(Math.sin(i / 2) * 1000) + Math.floor(Math.random() * 500),
        };
    });
};

const servers: ServerStatus[] = [
    { id: 'us-east-1', region: 'US East', name: 'Aegis', status: 'Online', population: 4802, maxPopulation: 5000, latency: 25 },
    { id: 'eu-west-1', region: 'EU West', name: 'Bastion', status: 'Online', population: 4950, maxPopulation: 5000, latency: 40 },
    { id: 'ap-ne-1', region: 'Asia Pacific', name: 'Citadel', status: 'Maintenance', population: 0, maxPopulation: 5000, latency: 90 },
    { id: 'sa-east-1', region: 'South America', name: 'Dominion', status: 'Online', population: 3120, maxPopulation: 4000, latency: 120 },
    { id: 'us-west-2', region: 'US West', name: 'Elysium', status: 'Offline', population: 0, maxPopulation: 5000, latency: 30 },
];

const generateAnomalies = (players: Player[]): Anomaly[] => {
    return players.filter(p => p.flags > 0).slice(0, 5).map((p, i) => ({
        id: `anom_${i}`,
        playerId: p.id,
        playerName: p.name,
        timestamp: new Date().toISOString(),
        type: ['Anomalous Currency Gain', 'Impossible Movement', 'Botting Activity'][Math.floor(Math.random() * 3)] as any,
        confidence: parseFloat((0.85 + Math.random() * 0.14).toFixed(2)),
        actionTaken: 'None'
    }));
};


// --- AI Service Hook ---

const useAIGeneration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateContent = useCallback(async (prompt: string, responseSchema: any) => {
        setIsLoading(true);
        setError(null);
        try {
            // In a real app, API key management would be more secure (e.g., proxied through your backend)
            if (!process.env.REACT_APP_GEMINI_API_KEY) {
                throw new Error("Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your environment.");
            }
            const ai = new GoogleGenAI(process.env.REACT_APP_GEMINI_API_KEY as string);
            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema
                }
            });
            return JSON.parse(response.text);
        } catch (err: any) {
            console.error("AI Generation Error:", err);
            setError(err.message || "An error occurred while generating content.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { generateContent, isLoading, error };
};

// --- Sub-Components ---

const AIToolsView: React.FC = () => {
    const [activeTool, setActiveTool] = useState<AITool>('item-generator');
    const { generateContent, isLoading, error } = useAIGeneration();
    
    // State for Item Generator
    const [itemParams, setItemParams] = useState({ type: 'Legendary Sword', theme: 'celestial fire', rarity: 'Mythic', level: '100' });
    const [generatedItem, setGeneratedItem] = useState<any>(null);

    // State for Quest Generator
    const [questParams, setQuestParams] = useState({ theme: 'Haunted Crypt', location: 'The Whispering Catacombs', difficulty: 'Hard' });
    const [generatedQuest, setGeneratedQuest] = useState<any>(null);

    const handleGenerateItem = async () => {
        setGeneratedItem(null);
        const prompt = `Generate a detailed in-game item for a fantasy RPG. Item Type: "${itemParams.type}", Theme: "${itemParams.theme}", Rarity: "${itemParams.rarity}", Required Level: ${itemParams.level}. Provide a cool, unique name, a short flavorful description, and three relevant stats with specific values (e.g., Damage, Speed, a special effect).`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Unique name of the item." },
                description: { type: Type.STRING, description: "Flavorful description of the item." },
                stats: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.STRING } } } }
            }
        };
        const result = await generateContent(prompt, schema);
        if (result) setGeneratedItem(result);
    };

    const handleGenerateQuest = async () => {
        setGeneratedQuest(null);
        const prompt = `Generate a fantasy RPG quest. Theme: "${questParams.theme}", Location: "${questParams.location}", Difficulty: "${questParams.difficulty}". Provide a compelling title, a paragraph of story/description, a list of 3-5 clear objectives, and a list of suitable rewards.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                rewards: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        };
        const result = await generateContent(prompt, schema);
        if (result) setGeneratedQuest(result);
    };

    const renderTool = () => {
        switch (activeTool) {
            case 'item-generator':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" value={itemParams.type} onChange={e => setItemParams(p => ({ ...p, type: e.target.value }))} placeholder="Item Type" className="w-full bg-gray-700/50 p-2 rounded text-white placeholder-gray-400" />
                            <input type="text" value={itemParams.theme} onChange={e => setItemParams(p => ({ ...p, theme: e.target.value }))} placeholder="Item Theme" className="w-full bg-gray-700/50 p-2 rounded text-white placeholder-gray-400" />
                            <select value={itemParams.rarity} onChange={e => setItemParams(p => ({ ...p, rarity: e.target.value }))} className="w-full bg-gray-700/50 p-2 rounded text-white">
                                <option>Common</option><option>Uncommon</option><option>Rare</option><option>Epic</option><option>Legendary</option><option>Mythic</option>
                            </select>
                            <input type="number" value={itemParams.level} onChange={e => setItemParams(p => ({ ...p, level: e.target.value }))} placeholder="Level" className="w-full bg-gray-700/50 p-2 rounded text-white placeholder-gray-400" />
                        </div>
                        <button onClick={handleGenerateItem} disabled={isLoading} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors flex items-center justify-center">
                            <Wand2 className="mr-2 h-4 w-4" /> {isLoading ? 'Generating...' : 'Generate Item'}
                        </button>
                        {(isLoading || generatedItem) && (
                            <Card title={generatedItem?.name || "Generating..."} className="mt-4 bg-gray-900/50">
                                <div className="min-h-[10rem] p-4">
                                    {isLoading ? <div className="animate-pulse space-y-2"><div className="h-4 bg-gray-700 rounded w-3/4"></div><div className="h-4 bg-gray-700 rounded w-1/2"></div><div className="h-4 bg-gray-700 rounded w-2/3"></div></div> :
                                        generatedItem && <>
                                            <p className="text-sm italic text-gray-400 mb-3">"{generatedItem.description}"</p>
                                            <ul className="text-sm space-y-1">
                                                {generatedItem.stats.map((s: any, i: number) => <li key={i}><strong className="text-cyan-300 font-semibold">{s.name}:</strong> {s.value}</li>)}
                                            </ul>
                                        </>}
                                </div>
                            </Card>
                        )}
                    </div>
                );
            case 'quest-generator':
                 return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" value={questParams.theme} onChange={e => setQuestParams(p => ({ ...p, theme: e.target.value }))} placeholder="Quest Theme" className="w-full bg-gray-700/50 p-2 rounded text-white placeholder-gray-400" />
                            <input type="text" value={questParams.location} onChange={e => setQuestParams(p => ({ ...p, location: e.target.value }))} placeholder="Location" className="w-full bg-gray-700/50 p-2 rounded text-white placeholder-gray-400" />
                            <select value={questParams.difficulty} onChange={e => setQuestParams(p => ({ ...p, difficulty: e.target.value }))} className="w-full bg-gray-700/50 p-2 rounded text-white">
                                <option>Easy</option><option>Medium</option><option>Hard</option><option>Heroic</option>
                            </select>
                        </div>
                        <button onClick={handleGenerateQuest} disabled={isLoading} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors flex items-center justify-center">
                            <BookOpen className="mr-2 h-4 w-4" /> {isLoading ? 'Generating...' : 'Generate Quest'}
                        </button>
                        {(isLoading || generatedQuest) && (
                            <Card title={generatedQuest?.title || "Generating..."} className="mt-4 bg-gray-900/50">
                                <div className="min-h-[16rem] p-4 space-y-4">
                                     {isLoading ? <div className="animate-pulse space-y-3"><div className="h-4 bg-gray-700 rounded w-full"></div><div className="h-4 bg-gray-700 rounded w-5/6"></div><div className="h-4 bg-gray-700 rounded w-3/4 mt-4"></div><div className="h-4 bg-gray-700 rounded w-1/2"></div></div> :
                                        generatedQuest && <>
                                            <p className="text-sm text-gray-300 leading-relaxed">{generatedQuest.description}</p>
                                            <div>
                                                <h4 className="font-semibold text-cyan-300 mb-1">Objectives:</h4>
                                                <ul className="list-disc list-inside text-sm space-y-1">
                                                    {generatedQuest.objectives.map((o: string, i: number) => <li key={i}>{o}</li>)}
                                                </ul>
                                            </div>
                                             <div>
                                                <h4 className="font-semibold text-cyan-300 mb-1">Rewards:</h4>
                                                <ul className="list-disc list-inside text-sm space-y-1">
                                                    {generatedQuest.rewards.map((r: string, i: number) => <li key={i}>{r}</li>)}
                                                </ul>
                                            </div>
                                        </>}
                                </div>
                            </Card>
                        )}
                    </div>
                 );
            default: return null;
        }
    };
    
    const ToolButton = ({ tool, icon, label }: { tool: AITool, icon: React.ReactNode, label: string }) => (
        <button onClick={() => setActiveTool(tool)} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTool === tool ? 'bg-cyan-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <Card title="Generative AI Toolkit" icon={<BrainCircuit className="h-6 w-6 text-cyan-400" />}>
            <div className="p-4">
                <div className="flex space-x-2 mb-4 border-b border-gray-700 pb-2">
                    <ToolButton tool="item-generator" icon={<Wand2 className="h-4 w-4" />} label="Item Generator" />
                    <ToolButton tool="quest-generator" icon={<BookOpen className="h-4 w-4" />} label="Quest Generator" />
                    {/* Add more tool buttons here */}
                </div>
                {error && <div className="bg-red-900/50 border border-red-700 text-red-200 text-sm p-3 rounded-md mb-4">{error}</div>}
                {renderTool()}
            </div>
        </Card>
    );
};

const DashboardView: React.FC<{ players: Player[], timeSeriesData: TimeSeriesData[] }> = ({ players, timeSeriesData }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center" icon={<Users className="h-6 w-6 text-cyan-400" />}>
                <p className="text-3xl font-bold text-white">1.2M</p>
                <p className="text-sm text-gray-400 mt-1">Daily Active Users</p>
            </Card>
            <Card className="text-center" icon={<DollarSign className="h-6 w-6 text-green-400" />}>
                <p className="text-3xl font-bold text-white">$50k</p>
                <p className="text-sm text-gray-400 mt-1">Revenue (24h)</p>
            </Card>
            <Card className="text-center" icon={<Cpu className="h-6 w-6 text-yellow-400" />}>
                <p className="text-3xl font-bold text-white">25ms</p>
                <p className="text-sm text-gray-400 mt-1">API Latency (p95)</p>
            </Card>
             <Card className="text-center" icon={<ShieldCheck className="h-6 w-6 text-red-400" />}>
                <p className="text-3xl font-bold text-white">1,204</p>
                <p className="text-sm text-gray-400 mt-1">Actions Taken (24h)</p>
            </Card>
        </div>
        
        <Card title="Key Metrics (Last 30 Days)">
            <div className="h-96 w-full p-4">
                <ResponsiveContainer>
                    <AreaChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorDAU" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                             <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis yAxisId="left" stroke="#9ca3af" />
                        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="DAU" stroke="#22d3ee" fill="url(#colorDAU)" fillOpacity={1} />
                        <Area yAxisId="right" type="monotone" dataKey="Revenue" stroke="#4ade80" fill="url(#colorRevenue)" fillOpacity={1} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card title="Global Leaderboard - Top 10" icon={<Trophy className="h-6 w-6 text-yellow-400" />}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr>
                            <th className="px-6 py-3">Rank</th>
                            <th className="px-6 py-3">Player</th>
                            <th className="px-6 py-3">Country</th>
                            <th className="px-6 py-3">Score</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.slice(0, 10).map(p => (
                            <tr key={p.rank} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-bold text-white">{p.rank}</td>
                                <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                                <td className="px-6 py-4">{p.country}</td>
                                <td className="px-6 py-4 font-mono">{p.score.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'Online' ? 'bg-green-500/20 text-green-300' : p.status === 'In-Game' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-500/20 text-gray-300'}`}>
                                        {p.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
);

const PlayerManagementView: React.FC<{ players: Player[], anomalies: Anomaly[] }> = ({ players, anomalies: initialAnomalies }) => {
    const [anomalies, setAnomalies] = useState(initialAnomalies);
    const handleAction = (id: string, action: Anomaly['actionTaken']) => {
        setAnomalies(anoms => anoms.map(a => a.id === id ? { ...a, actionTaken: action } : a));
    };

    return (
        <div className="space-y-6">
            <Card title="AI-Powered Anomaly Detection" icon={<BugPlay className="h-6 w-6 text-red-400" />}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th className="px-6 py-3">Player</th>
                                <th className="px-6 py-3">Detection Type</th>
                                <th className="px-6 py-3">AI Confidence</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {anomalies.map(a => (
                                <tr key={a.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{a.playerName}</td>
                                    <td className="px-6 py-4">{a.type}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${a.confidence * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs font-mono">{a.confidence}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {a.actionTaken === 'None' ? (
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleAction(a.id, 'Warned')} className="text-xs px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded">Warn</button>
                                                <button onClick={() => handleAction(a.id, 'Suspended')} className="text-xs px-2 py-1 bg-orange-600 hover:bg-orange-700 rounded">Suspend</button>
                                                <button onClick={() => handleAction(a.id, 'Banned')} className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded">Ban</button>
                                            </div>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-600 text-white">{a.actionTaken}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const ServerHealthView: React.FC = () => {
    return (
        <Card title="Global Server Status" icon={<Globe className="h-6 w-6 text-blue-400" />}>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {servers.map(server => (
                    <div key={server.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-white">{server.name} <span className="text-xs text-gray-400 font-normal">({server.region})</span></h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${server.status === 'Online' ? 'bg-green-500/20 text-green-300' : server.status === 'Maintenance' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                                {server.status}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between items-center">
                               <span className="text-gray-400">Population</span>
                               <span className="font-mono text-white">{server.population.toLocaleString()} / {server.maxPopulation.toLocaleString()}</span>
                           </div>
                           <div className="w-full bg-gray-700 rounded-full h-2.5">
                               <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${(server.population / server.maxPopulation) * 100}%` }}></div>
                           </div>
                           <div className="flex justify-between items-center text-gray-400">
                               <span>Latency</span>
                               <span className="font-mono text-white">{server.latency}ms</span>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// --- Main Component ---

const DemoBankGamingServicesView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    
    // Memoize generated data to prevent re-generation on re-renders
    const players = useMemo(() => generatePlayers(50), []);
    const timeSeriesData = useMemo(() => generateTimeSeriesData(30), []);
    const anomalies = useMemo(() => generateAnomalies(players), [players]);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardView players={players} timeSeriesData={timeSeriesData} />;
            case 'ai-tools':
                return <AIToolsView />;
            case 'player-management':
                 return <PlayerManagementView players={players} anomalies={anomalies} />;
            case 'server-health':
                 return <ServerHealthView />;
            case 'integrations':
                return <Card title="Integrations Marketplace"><p className="p-4 text-gray-400">Manage integrations with platforms like Twitch, Discord, and more. (UI Placeholder)</p></Card>;
            default:
                return null;
        }
    };
    
    const NavButton = ({ tab, icon, label }: { tab: Tab, icon: React.ReactNode, label: string }) => (
         <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 group flex items-center justify-center space-x-3 py-3 text-sm font-medium border-b-2 transition-all duration-200 ease-in-out
                ${activeTab === tab 
                    ? 'border-cyan-500 text-cyan-400' 
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="space-y-6 text-gray-200">
             <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Gamepad2 className="h-10 w-10 text-cyan-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-wider">Gaming Services Platform</h1>
                        <p className="text-sm text-gray-400">Real-time analytics and AI-powered tools for your game.</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg">
                <nav className="flex">
                    <NavButton tab="dashboard" icon={<BarChart className="h-5 w-5" />} label="Dashboard" />
                    <NavButton tab="ai-tools" icon={<BrainCircuit className="h-5 w-5" />} label="AI Toolkit" />
                    <NavButton tab="player-management" icon={<Users className="h-5 w-5" />} label="Player Management" />
                    <NavButton tab="server-health" icon={<Server className="h-5 w-5" />} label="Server Health" />
                    <NavButton tab="integrations" icon={<Zap className="h-5 w-5" />} label="Integrations" />
                </nav>
            </div>
            
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default DemoBankGamingServicesView;
```