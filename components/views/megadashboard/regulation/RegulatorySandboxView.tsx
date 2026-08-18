// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/regulation/RegulatorySandboxView.tsx
================================================================================

// components/views/megadashboard/regulation/RegulatorySandboxView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";

const RegulatorySandboxView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("RegulatorySandboxView must be within DataProvider");
    
    const { sandboxExperiments } = context;
    const [isPlannerOpen, setPlannerOpen] = useState(false);
    const [prompt, setPrompt] = useState("Testing a new P2P payment feature in the UK market.");
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePlan = async () => {
        setIsLoading(true); setPlan('');
        try {
            // Using the OpenAPI spec's server URL directly for the API call
            const response = await fetch('https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/oracle/simulate/advanced', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `You are a compliance AI. Create a high-level test plan for a regulatory sandbox experiment. Experiment: "${prompt}". Include objectives, scope, and key success metrics.`,
                    scenarios: [], // No specific scenarios provided in the prompt
                    parameters: {} // No specific parameters provided in the prompt
                }),
            });
            
            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            // Assuming the relevant part of the response is in 'narrativeSummary' or similar
            // Adjust this based on the actual response structure from the OpenAPI spec
            setPlan(data.narrativeSummary || data.overallSummary || JSON.stringify(data, null, 2));
        } catch(err) { 
            console.error(err); 
            setPlan(`Error generating plan: ${err.message}`);
        } finally { setIsLoading(false); }
    };

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Regulatory Sandbox</h2>
                    <button onClick={() => setPlannerOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Test Plan Generator</button>
                </div>
                 <Card title="Active Experiments">
                     <table className="w-full text-sm">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th>Name</th><th>Status</th><th>Start Date</th></tr></thead>
                        <tbody>{sandboxExperiments.map(e => <tr key={e.id}><td className="px-6 py-4 text-white">{e.name}</td><td><span className="text-green-400">{e.status}</span></td><td>{e.startDate}</td></tr>)}</tbody>
                    </table>
                </Card>
            </div>
            {isPlannerOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setPlannerOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Test Plan Generator</h3></div>
                        <div className="p-6 space-y-4">
                            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-2 rounded" />
                            <button onClick={handlePlan} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Plan'}</button>
                            {plan && <Card title="Generated Plan"><div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line">{plan}</div></Card>}
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default RegulatorySandboxView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/regulation/RegulatorySandboxView.tsx
================================================================================

```tsx
// components/views/megadashboard/regulation/RegulatorySandboxView.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, FlaskConical, PlayCircle, ShieldCheck, Milestone, Search, SlidersHorizontal, X, BrainCircuit, Globe, Cpu, FilePlus2, Lightbulb } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type ExperimentStatus = 'Planning' | 'Active' | 'Completed' | 'Halted';
type RegulatoryJurisdiction = 'USA' | 'UK' | 'EU' | 'Singapore' | 'Global';

interface SandboxExperiment {
    id: string;
    name: string;
    description: string;
    status: ExperimentStatus;
    startDate: string;
    endDate: string | null;
    jurisdiction: RegulatoryJurisdiction;
    team: string[];
    progress: number; // Percentage
    keyRegulations: string[];
    findingsSummary: string | null;
    testPlan?: GeneratedTestPlan;
}

interface GeneratedTestPlanSection {
    title: string;
    content: string;
}

interface GeneratedTestPlan {
    overview: string;
    sections: GeneratedTestPlanSection[];
}

interface ComplianceFinding {
    id: string;
    severity: 'Low' | 'Medium' | 'High';
    description: string;
    recommendation: string;
    regulation: string;
}


// --- MOCK DATA (Expanded for richer UI) ---
const mockSandboxExperiments: SandboxExperiment[] = [
    {
        id: 'exp-001',
        name: 'Quantum-Secured P2P Payments',
        description: 'Testing a new peer-to-peer payment feature utilizing post-quantum cryptographic algorithms for enhanced security in the UK market.',
        status: 'Active',
        startDate: '2023-11-01',
        endDate: null,
        jurisdiction: 'UK',
        team: ['Alice', 'Bob', 'Charlie'],
        progress: 65,
        keyRegulations: ['PSR 2017', 'GDPR', 'UK AML Regulations'],
        findingsSummary: null,
    },
    {
        id: 'exp-002',
        name: 'AI-Driven Credit Scoring Model',
        description: 'An experiment to validate a novel AI model for credit scoring that aims to reduce bias and improve accuracy for underserved populations.',
        status: 'Completed',
        startDate: '2023-05-15',
        endDate: '2023-10-30',
        jurisdiction: 'USA',
        team: ['David', 'Eve'],
        progress: 100,
        keyRegulations: ['Equal Credit Opportunity Act (ECOA)', 'Fair Credit Reporting Act (FCRA)'],
        findingsSummary: 'Model showed a 15% reduction in bias metrics while maintaining 98% accuracy compared to traditional models. Approved for limited rollout.',
    },
    {
        id: 'exp-003',
        name: 'Decentralized Identity Verification',
        description: 'Piloting a DID solution for KYC/AML processes to enhance user privacy and data security across the EU.',
        status: 'Planning',
        startDate: '2024-03-01',
        endDate: null,
        jurisdiction: 'EU',
        team: ['Frank', 'Grace', 'Heidi'],
        progress: 10,
        keyRegulations: ['eIDAS', 'GDPR', '5AMLD'],
        findingsSummary: null,
    },
     {
        id: 'exp-004',
        name: 'Cross-Border CBDC Settlement',
        description: 'A joint experiment with regulatory bodies in Singapore to test the efficiency and security of using Central Bank Digital Currencies for international trade finance settlement.',
        status: 'Active',
        startDate: '2024-01-10',
        endDate: null,
        jurisdiction: 'Singapore',
        team: ['Ivan', 'Judy', 'Mallory'],
        progress: 40,
        keyRegulations: ['Payment Services Act', 'MAS Notice 626'],
        findingsSummary: null,
    },
];


// --- API SERVICE ABSTRACTION (Helper Function) ---
const getGenAI = () => {
    // In a production environment, API keys should be handled securely, typically via a backend proxy.
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API key for Google GenAI is not configured in environment variables (e.g., NEXT_PUBLIC_GEMINI_API_KEY).");
        return null;
    }
    return new GoogleGenerativeAI(apiKey);
};

// --- SUB-COMPONENTS ---

const StatusBadge: React.FC<{ status: ExperimentStatus }> = ({ status }) => {
    const colorMap: Record<ExperimentStatus, string> = {
        Active: 'bg-blue-500/20 text-blue-300',
        Completed: 'bg-green-500/20 text-green-300',
        Planning: 'bg-yellow-500/20 text-yellow-300',
        Halted: 'bg-red-500/20 text-red-300',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
};

const ExperimentCard: React.FC<{ experiment: SandboxExperiment, onSelect: () => void }> = ({ experiment, onSelect }) => (
    <div onClick={onSelect} className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 hover:border-cyan-500 hover:bg-gray-800 transition-all cursor-pointer space-y-4 shadow-lg">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white pr-4">{experiment.name}</h3>
            <StatusBadge status={experiment.status} />
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{experiment.description}</p>
        <div className="space-y-2">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-cyan-600 h-2.5 rounded-full" style={{ width: `${experiment.progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
                <span>Progress: {experiment.progress}%</span>
                <span>Jurisdiction: {experiment.jurisdiction}</span>
            </div>
        </div>
    </div>
);

const AITestPlanGeneratorModal: React.FC<{ isOpen: boolean, onClose: () => void, onCreate: (plan: GeneratedTestPlan, details: {prompt: string, jurisdiction: RegulatoryJurisdiction, techStack: string}) => void }> = ({ isOpen, onClose, onCreate }) => {
    const [prompt, setPrompt] = useState("Testing a new P2P payment feature in the UK market.");
    const [jurisdiction, setJurisdiction] = useState<RegulatoryJurisdiction>('UK');
    const [techStack, setTechStack] = useState('React Native, Node.js, PostgreSQL, AWS');
    const [plan, setPlan] = useState<GeneratedTestPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setPlan(null);
        setError(null);
        const ai = getGenAI();
        if (!ai) {
            setError("AI Service is not configured. Please check API key.");
            setIsLoading(false);
            return;
        }

        const fullPrompt = `
You are a world-class financial compliance and regulatory strategy AI. Your task is to generate a comprehensive test plan for a regulatory sandbox experiment.
The output MUST be a valid JSON object with the structure: { "overview": "string", "sections": [{ "title": "string", "content": "string" }] }.
Do not include any text or markdown formatting before or after the JSON object.

Experiment Details:
- Concept: "${prompt}"
- Jurisdiction: ${jurisdiction}
- Technology Stack: ${techStack}

Generate a test plan with the following sections:
1.  **Objectives**: What are the primary goals of this experiment?
2.  **Scope**: Define the boundaries of the test (e.g., user segments, transaction limits, features).
3.  **Methodology**: How will the test be conducted? What data will be collected?
4.  **Key Success Metrics (KPIs)**: Quantifiable metrics to measure success (e.g., transaction success rate, fraud detection accuracy, user adoption).
5.  **Regulatory Compliance Checks**: Specific regulations to test against and how.
6.  **Risk Mitigation Plan**: Potential risks (e.g., security, consumer harm) and mitigation strategies.
7.  **Reporting Framework**: How and when will findings be reported to regulators?
`;
        try {
            const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(fullPrompt);
            const responseText = result.response.text();
            
            const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedPlan: GeneratedTestPlan = JSON.parse(jsonString);

            setPlan(parsedPlan);
        } catch (err) {
            console.error("AI Generation Error:", err);
            setError("Failed to generate test plan. The AI model might have returned an unexpected format. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-4xl w-full flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2"><Lightbulb className="text-cyan-400" /> AI Experiment Planner</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6" style={{maxHeight: '80vh'}}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                             <h4 className="text-lg font-semibold text-cyan-400">1. Define Your Experiment</h4>
                             <div>
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2"><BrainCircuit size={16}/> Experiment Concept</label>
                                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-800 p-2 rounded border border-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="e.g., AI-powered robo-advisor for sustainable investments" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2"><Globe size={16}/> Target Jurisdiction</label>
                                <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value as RegulatoryJurisdiction)} className="w-full bg-gray-800 p-2 rounded border border-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none">
                                    <option>USA</option><option>UK</option><option>EU</option><option>Singapore</option><option>Global</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2"><Cpu size={16} /> Technology Stack</label>
                                <input type="text" value={techStack} onChange={e => setTechStack(e.target.value)} className="w-full bg-gray-800 p-2 rounded border border-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="e.g., Python, TensorFlow, GCP" />
                            </div>
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center justify-center gap-2 transition-opacity disabled:opacity-50">
                                {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Generating...</> : 'Generate Test Plan'}
                            </button>
                             {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
                        </div>

                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                             <h4 className="text-lg font-semibold text-cyan-400 mb-4">2. Generated Test Plan</h4>
                             {plan ? (
                                 <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                                     <p className="text-gray-300 italic">{plan.overview}</p>
                                     {plan.sections.map((section, index) => (
                                         <div key={index}>
                                             <h5 className="font-semibold text-white">{section.title}</h5>
                                             <p className="text-sm text-gray-400 whitespace-pre-line">{section.content}</p>
                                         </div>
                                     ))}
                                 </div>
                             ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    {isLoading ? 'AI is drafting the plan...' : 'Your generated plan will appear here.'}
                                </div>
                             )}
                        </div>
                    </div>
                </div>
                 <div className="p-4 bg-gray-900 border-t border-gray-700 text-right">
                    <button onClick={() => plan && onCreate(plan, {prompt, jurisdiction, techStack})} disabled={!plan} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        Create Experiment from Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

const ComplianceSimulator: React.FC<{ experiment: SandboxExperiment }> = ({ experiment }) => {
    const [findings, setFindings] = useState<ComplianceFinding[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const runSimulation = useCallback(async () => {
        setIsSimulating(true);
        setError(null);
        setFindings([]);
        const ai = getGenAI();
        if (!ai) {
            setError("AI Service is not configured.");
            setIsSimulating(false);
            return;
        }

        const prompt = `
You are an AI Compliance Officer specialized in financial regulations for the ${experiment.jurisdiction} jurisdiction.
Analyze the following sandbox experiment and identify potential compliance risks or issues.
Output your findings as a valid JSON array of objects with the structure: [{ "id": "string", "severity": "Low" | "Medium" | "High", "description": "string", "recommendation": "string", "regulation": "string (e.g., GDPR Article 5)" }].
If there are no significant findings, return an empty array [].
Do not include any text or markdown formatting before or after the JSON array.

Experiment Details:
- Name: "${experiment.name}"
- Description: "${experiment.description}"
- Key Regulations Considered: ${experiment.keyRegulations.join(', ')}
`;

        try {
            const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedFindings: ComplianceFinding[] = JSON.parse(jsonString);
            setFindings(parsedFindings);
        } catch (err) {
            console.error("AI Simulation Error:", err);
            setError("Failed to run simulation. The AI model might have returned an unexpected format.");
        } finally {
            setIsSimulating(false);
        }
    }, [experiment]);

    const severityColorMap = {
        High: 'border-red-500 bg-red-500/10',
        Medium: 'border-yellow-500 bg-yellow-500/10',
        Low: 'border-blue-500 bg-blue-500/10',
    };
    
    return (
        <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-4">This AI-powered simulator analyzes your experiment against known regulations in its target jurisdiction to proactively identify potential compliance issues. It is a guide and not a substitute for legal advice.</p>
                <button onClick={runSimulation} disabled={isSimulating} className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-opacity disabled:opacity-50">
                    {isSimulating ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>Simulating...</> : <><PlayCircle size={18}/>Run Compliance Simulation</>}
                </button>
                {error && <p className="text-sm text-red-400 mt-2 text-center">{error}</p>}
            </div>
            <div className="space-y-3">
                <h4 className="font-semibold text-lg text-white">Simulation Results</h4>
                {isSimulating && <p className="text-gray-400">AI is analyzing, please wait...</p>}
                {!isSimulating && findings.length === 0 && <p className="text-gray-400">No simulation run yet, or no issues found.</p>}
                {findings.map(finding => (
                    <div key={finding.id} className={`p-4 rounded-lg border-l-4 ${severityColorMap[finding.severity]}`}>
                        <div className="flex justify-between items-center">
                            <h5 className="font-bold text-white">{finding.regulation}</h5>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${severityColorMap[finding.severity]}`}>{finding.severity} Risk</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{finding.description}</p>
                        <p className="text-sm text-cyan-300 mt-2"><span className="font-semibold">Recommendation:</span> {finding.recommendation}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ExperimentDetailsModal: React.FC<{isOpen: boolean, onClose: () => void, experiment: SandboxExperiment | null}> = ({ isOpen, onClose, experiment }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'simulation'>('overview');

    if (!isOpen || !experiment) return null;

    const chartData = [
        { name: 'Progress', value: experiment.progress },
        { name: 'Remaining', value: 100 - experiment.progress },
    ];
    
    return (
         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-5xl w-full flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <div>
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2"><FlaskConical className="text-cyan-400" /> {experiment.name}</h3>
                        <p className="text-sm text-gray-400">{experiment.jurisdiction} Sandbox</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 flex gap-6" style={{maxHeight: '80vh'}}>
                    <div className="w-1/4 space-y-2">
                         <button onClick={() => setActiveTab('overview')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 ${activeTab === 'overview' ? 'bg-cyan-600/50 text-white' : 'hover:bg-gray-700/50'}`}>
                            <Milestone size={18}/> Overview
                         </button>
                         <button onClick={() => setActiveTab('plan')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 ${activeTab === 'plan' ? 'bg-cyan-600/50 text-white' : 'hover:bg-gray-700/50'}`} disabled={!experiment.testPlan}>
                            <FileText size={18}/> Test Plan
                            {!experiment.testPlan && <span className="text-xs text-gray-500">(Not set)</span>}
                         </button>
                         <button onClick={() => setActiveTab('simulation')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 ${activeTab === 'simulation' ? 'bg-cyan-600/50 text-white' : 'hover:bg-gray-700/50'}`}>
                             <ShieldCheck size={18}/> AI Simulation
                         </button>
                    </div>
                    
                    <div className="w-3/4 bg-gray-800/30 p-4 rounded-lg">
                        {activeTab === 'overview' && (
                             <div className="space-y-4">
                                <h4 className="font-semibold text-lg text-white">Experiment Overview</h4>
                                <p className="text-gray-300">{experiment.description}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-gray-700/50 p-3 rounded-lg"><strong>Status:</strong> <StatusBadge status={experiment.status} /></div>
                                    <div className="bg-gray-700/50 p-3 rounded-lg"><strong>Timeline:</strong> {experiment.startDate} to {experiment.endDate || 'Ongoing'}</div>
                                    <div className="bg-gray-700/50 p-3 rounded-lg"><strong>Team:</strong> {experiment.team.join(', ')}</div>
                                    <div className="bg-gray-700/50 p-3 rounded-lg"><strong>Key Regulations:</strong> {experiment.keyRegulations.join(', ')}</div>
                                </div>
                                 <h4 className="font-semibold text-lg text-white pt-4">Progress</h4>
                                 <ResponsiveContainer width="100%" height={100}>
                                    <BarChart layout="vertical" data={chartData} stackOffset="expand">
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" hide />
                                        <Tooltip formatter={(value, name) => [`${(value * 100).toFixed(0)}%`, name as string]} />
                                        <Bar dataKey="value" fill="#0891b2" stackId="a" isAnimationActive={false}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        {activeTab === 'plan' && experiment.testPlan && (
                           <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                <h4 className="font-semibold text-lg text-white">Test Plan</h4>
                                <p className="text-gray-300 italic">{experiment.testPlan.overview}</p>
                                {experiment.testPlan.sections.map((section, index) => (
                                    <div key={index}>
                                        <h5 className="font-semibold text-white">{section.title}</h5>
                                        <p className="text-sm text-gray-400 whitespace-pre-line">{section.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                         {activeTab === 'simulation' && (
                             <ComplianceSimulator experiment={experiment} />
                         )}
                    </div>
                </div>
            </div>
         </div>
    );
};

const RegulatorySandboxView: React.FC = () => {
    const [experiments, setExperiments] = useState<SandboxExperiment[]>(mockSandboxExperiments);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ExperimentStatus | 'All'>('All');
    const [jurisdictionFilter, setJurisdictionFilter] = useState<RegulatoryJurisdiction | 'All'>('All');
    const [isPlannerOpen, setPlannerOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedExperiment, setSelectedExperiment] = useState<SandboxExperiment | null>(null);

    const filteredExperiments = useMemo(() => {
        return experiments.filter(exp => {
            const matchesSearch = exp.name.toLowerCase().includes(searchTerm.toLowerCase()) || exp.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || exp.status === statusFilter;
            const matchesJurisdiction = jurisdictionFilter === 'All' || exp.jurisdiction === jurisdictionFilter;
            return matchesSearch && matchesStatus && matchesJurisdiction;
        });
    }, [experiments, searchTerm, statusFilter, jurisdictionFilter]);
    
    const handleSelectExperiment = (experiment: SandboxExperiment) => {
        setSelectedExperiment(experiment);
        setIsDetailsOpen(true);
    };

    const handleCreateExperiment = (plan: GeneratedTestPlan, details: {prompt: string, jurisdiction: RegulatoryJurisdiction, techStack: string}) => {
        const newExperiment: SandboxExperiment = {
            id: `exp-${Date.now()}`,
            name: details.prompt.length > 50 ? details.prompt.substring(0, 50) + '...' : details.prompt,
            description: `Experiment based on the concept: "${details.prompt}" using a ${details.techStack} stack.`,
            status: 'Planning',
            startDate: new Date().toISOString().split('T')[0],
            endDate: null,
            jurisdiction: details.jurisdiction,
            team: ['New Team'],
            progress: 5,
            keyRegulations: plan.sections.find(s => s.title.includes('Regulatory'))?.content.split('\n').map(s => s.trim().replace('- ', '')) || [],
            findingsSummary: null,
            testPlan: plan
        };
        setExperiments(prev => [...prev, newExperiment]);
        setPlannerOpen(false);
        setSelectedExperiment(newExperiment);
        setIsDetailsOpen(true);
    };
    
    return (
        <div className="h-full w-full bg-gray-900 text-white p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-wider">Regulatory Sandbox</h2>
                <button onClick={() => setPlannerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-transform transform hover:scale-105">
                    <FilePlus2 size={18}/>
                    New AI-Powered Experiment
                </button>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-wrap gap-4 items-center">
                <div className="relative flex-grow">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                     <input 
                        type="text" 
                        placeholder="Search experiments..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700/50 rounded-lg pl-10 pr-4 py-2 border border-transparent focus:border-cyan-500 focus:ring-0 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-gray-400"/>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="bg-gray-700/50 rounded-lg px-3 py-2 border border-transparent focus:border-cyan-500 focus:ring-0 outline-none">
                        <option value="All">All Statuses</option>
                        <option value="Planning">Planning</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Halted">Halted</option>
                    </select>
                </div>
                 <div className="flex items-center gap-2">
                     <Globe size={18} className="text-gray-400"/>
                     <select value={jurisdictionFilter} onChange={e => setJurisdictionFilter(e.target.value as any)} className="bg-gray-700/50 rounded-lg px-3 py-2 border border-transparent focus:border-cyan-500 focus:ring-0 outline-none">
                        <option value="All">All Jurisdictions</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="EU">EU</option>
                        <option value="Singapore">Singapore</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperiments.length > 0 ? (
                    filteredExperiments.map(exp => <ExperimentCard key={exp.id} experiment={exp} onSelect={() => handleSelectExperiment(exp)} />)
                ) : (
                    <div className="col-span-full text-center py-10 bg-gray-800/30 rounded-lg">
                        <p className="text-gray-400">No experiments match your criteria.</p>
                    </div>
                )}
            </div>

            <AITestPlanGeneratorModal isOpen={isPlannerOpen} onClose={() => setPlannerOpen(false)} onCreate={handleCreateExperiment}/>
            <ExperimentDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} experiment={selectedExperiment} />
        </div>
    );
};

export default RegulatorySandboxView;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/regulation/RegulatorySandboxView.tsx
================================================================================

// components/views/megadashboard/regulation/RegulatorySandboxView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";

const RegulatorySandboxView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("RegulatorySandboxView must be within DataProvider");
    
    const { sandboxExperiments } = context;
    const [isPlannerOpen, setPlannerOpen] = useState(false);
    const [prompt, setPrompt] = useState("Testing a new P2P payment feature in the UK market.");
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePlan = async () => {
        setIsLoading(true); setPlan('');
        try {
            // Using the OpenAPI spec's server URL directly for the API call
            const response = await fetch('https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/oracle/simulate/advanced', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `You are a compliance AI. Create a high-level test plan for a regulatory sandbox experiment. Experiment: "${prompt}". Include objectives, scope, and key success metrics.`,
                    scenarios: [], // No specific scenarios provided in the prompt
                    parameters: {} // No specific parameters provided in the prompt
                }),
            });
            
            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            // Assuming the relevant part of the response is in 'narrativeSummary' or similar
            // Adjust this based on the actual response structure from the OpenAPI spec
            setPlan(data.narrativeSummary || data.overallSummary || JSON.stringify(data, null, 2));
        } catch(err) { 
            console.error(err); 
            setPlan(`Error generating plan: ${err.message}`);
        } finally { setIsLoading(false); }
    };

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Regulatory Sandbox</h2>
                    <button onClick={() => setPlannerOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Test Plan Generator</button>
                </div>
                 <Card title="Active Experiments">
                     <table className="w-full text-sm">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th>Name</th><th>Status</th><th>Start Date</th></tr></thead>
                        <tbody>{sandboxExperiments.map(e => <tr key={e.id}><td className="px-6 py-4 text-white">{e.name}</td><td><span className="text-green-400">{e.status}</span></td><td>{e.startDate}</td></tr>)}</tbody>
                    </table>
                </Card>
            </div>
            {isPlannerOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setPlannerOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Test Plan Generator</h3></div>
                        <div className="p-6 space-y-4">
                            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-2 rounded" />
                            <button onClick={handlePlan} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Plan'}</button>
                            {plan && <Card title="Generated Plan"><div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line">{plan}</div></Card>}
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default RegulatorySandboxView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/regulation/RegulatorySandboxView.tsx
================================================================================

// components/views/megadashboard/regulation/RegulatorySandboxView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";

const RegulatorySandboxView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("RegulatorySandboxView must be within DataProvider");
    
    const { sandboxExperiments } = context;
    const [isPlannerOpen, setPlannerOpen] = useState(false);
    const [prompt, setPrompt] = useState("Testing a new P2P payment feature in the UK market.");
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePlan = async () => {
        setIsLoading(true); setPlan('');
        try {
            // Using the OpenAPI spec's server URL directly for the API call
            const response = await fetch('https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/oracle/simulate/advanced', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `You are a compliance AI. Create a high-level test plan for a regulatory sandbox experiment. Experiment: "${prompt}". Include objectives, scope, and key success metrics.`,
                    scenarios: [], // No specific scenarios provided in the prompt
                    parameters: {} // No specific parameters provided in the prompt
                }),
            });
            
            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            // Assuming the relevant part of the response is in 'narrativeSummary' or similar
            // Adjust this based on the actual response structure from the OpenAPI spec
            setPlan(data.narrativeSummary || data.overallSummary || JSON.stringify(data, null, 2));
        } catch(err) { 
            console.error(err); 
            setPlan(`Error generating plan: ${err.message}`);
        } finally { setIsLoading(false); }
    };

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Regulatory Sandbox</h2>
                    <button onClick={() => setPlannerOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Test Plan Generator</button>
                </div>
                 <Card title="Active Experiments">
                     <table className="w-full text-sm">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th>Name</th><th>Status</th><th>Start Date</th></tr></thead>
                        <tbody>{sandboxExperiments.map(e => <tr key={e.id}><td className="px-6 py-4 text-white">{e.name}</td><td><span className="text-green-400">{e.status}</span></td><td>{e.startDate}</td></tr>)}</tbody>
                    </table>
                </Card>
            </div>
            {isPlannerOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setPlannerOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Test Plan Generator</h3></div>
                        <div className="p-6 space-y-4">
                            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-2 rounded" />
                            <button onClick={handlePlan} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Plan'}</button>
                            {plan && <Card title="Generated Plan"><div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line">{plan}</div></Card>}
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default RegulatorySandboxView;