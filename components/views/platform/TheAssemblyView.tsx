// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/TheAssemblyView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import Card from '../../Card';

// --- TYPE DEFINITIONS ---

type ProposalStatus = 'voting' | 'debate' | 'passed' | 'failed' | 'vetoed';
type ProposalType = 'treasury' | 'protocol' | 'constitutional' | 'policy';

interface DebateMessage {
    id: string;
    authorId: string;
    timestamp: string;
    content: string;
    replies?: DebateMessage[];
}

interface Proposal {
    id: string;
    title: string;
    proposerId: string;
    description: string;
    status: ProposalStatus;
    type: ProposalType;
    votesFor: number;
    votesAgainst: number;
    votesAbstain: number;
    startDate: string;
    endDate: string;
    debateThread: DebateMessage[];
    contractAddress: string;
    executionData: string;
}

interface Member {
    id: string;
    name: string;
    avatar: string;
    votingPower: number;
    delegatedTo?: string;
    joinedDate: string;
}

// --- MOCK DATA ---

const members: Member[] = [
    { id: 'mem-001', name: 'Aelia Vance', avatar: 'https://i.pravatar.cc/150?u=mem-001', votingPower: 150000, joinedDate: '2023-01-15T09:00:00Z' },
    { id: 'mem-002', name: 'Kenji Tanaka', avatar: 'https://i.pravatar.cc/150?u=mem-002', votingPower: 120000, joinedDate: '2023-02-20T14:30:00Z' },
    { id: 'mem-003', name: 'Dr. Lena Petrova', avatar: 'https://i.pravatar.cc/150?u=mem-003', votingPower: 95000, delegatedTo: 'mem-001', joinedDate: '2023-03-10T11:45:00Z' },
    { id: 'mem-004', name: 'Javier "Synth" Morales', avatar: 'https://i.pravatar.cc/150?u=mem-004', votingPower: 210000, joinedDate: '2022-11-05T18:00:00Z' },
    { id: 'mem-005', name: 'Chairman Kai', avatar: 'https://i.pravatar.cc/150?u=mem-005', votingPower: 500000, joinedDate: '2022-09-01T00:00:00Z' },
];

const proposals: Proposal[] = [
    {
        id: 'prop-073',
        title: 'Quantum-Resistant Cryptography Upgrade (QRCU)',
        proposerId: 'mem-003',
        description: 'This proposal outlines a multi-phase plan to upgrade the platform\'s core cryptographic libraries to be resistant to attacks from future quantum computers. Phase 1 involves research and selection of appropriate algorithms (e.g., CRYSTALS-Kyber, CRYSTALS-Dilithium). Phase 2 will focus on implementation and rigorous testing on a dedicated testnet. Phase 3 will be the mainnet rollout, coordinated with all major ecosystem partners. A budget of $2.5M is requested from the treasury for research grants, security audits, and developer bounties.',
        status: 'voting',
        type: 'protocol',
        votesFor: 875321,
        votesAgainst: 120450,
        votesAbstain: 55100,
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        contractAddress: '0xabc...def',
        executionData: '0x123...',
        debateThread: [
            { id: 'msg-001', authorId: 'mem-004', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), content: 'Strongly in favor. Proactive security is non-negotiable. The threat is distant but existential.' },
            { id: 'msg-002', authorId: 'mem-002', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), content: 'The budget seems high for Phase 1. Can we get a more detailed breakdown of the allocation for research grants vs. audits?' }
        ]
    },
    {
        id: 'prop-072',
        title: 'Economic Synthesis Engine (ESE) Integration',
        proposerId: 'mem-005',
        description: 'Proposal to allocate $5M from the treasury to fund the integration of the Economic Synthesis Engine. This will enable dynamic monetary policies, predictive market modeling, and automated yield strategies, fundamentally enhancing the platform\'s economic stability and growth potential. The integration will be led by the core development team over a 6-month timeline.',
        status: 'passed',
        type: 'treasury',
        votesFor: 1200500,
        votesAgainst: 50100,
        votesAbstain: 20300,
        startDate: '2023-10-01T12:00:00Z',
        endDate: '2023-10-08T12:00:00Z',
        contractAddress: '0x123...456',
        executionData: '0x456...',
        debateThread: []
    },
    {
        id: 'prop-071',
        title: 'Amend Article IV of The Charter: Veto Power',
        proposerId: 'mem-001',
        description: 'This proposal seeks to amend The Charter to introduce a Council Veto mechanism. A unanimous vote from a designated 5-member security council could veto any passed proposal deemed an existential threat to the platform. This serves as a critical safeguard against governance attacks.',
        status: 'failed',
        type: 'constitutional',
        votesFor: 650000,
        votesAgainst: 780000,
        votesAbstain: 15000,
        startDate: '2023-09-15T12:00:00Z',
        endDate: '2023-09-22T12:00:00Z',
        contractAddress: '0x789...abc',
        executionData: '0x789...',
        debateThread: []
    }
];

// --- AI SERVICE MOCKS ---

const aiSimulationService = {
    getEconomicImpact: async (proposal: Proposal) => {
        await new Promise(res => setTimeout(res, 2500));
        const impact = (proposal.id.charCodeAt(8) % 3) - 1; // -1, 0, or 1
        const summary = impact > 0
            ? "The model projects a net positive impact on the platform's treasury value and token velocity. Increased developer activity from the allocated budget is a primary driver."
            : impact < 0
                ? "The simulation indicates a short-term risk to treasury diversification due to the large capital allocation. The model suggests mitigating this by phasing the budget release contingent on milestones."
                : "The model predicts a neutral short-term economic impact. The proposal primarily affects security posture, with economic effects being indirect and long-term.";

        return {
            summary,
            projectionData: Array.from({ length: 12 }, (_, i) => ({
                month: `M${i + 1}`,
                value: 100 + (i * impact * 2) + (Math.random() - 0.5) * 5
            }))
        };
    },
    getRiskAssessment: async (proposal: Proposal) => {
        await new Promise(res => setTimeout(res, 1500));
        return [
            { severity: 'High', area: 'Technical', description: 'Risk of implementation bugs in novel cryptographic libraries. Mitigation: Phased rollout and multiple independent security audits.' },
            { severity: 'Medium', area: 'Economic', description: 'Budget overrun potential. Mitigation: Milestone-based funding release.' },
            { severity: 'Low', area: 'Social', description: 'Community may perceive the threat as too distant, affecting morale. Mitigation: Clear communication and educational materials.' }
        ];
    },
    getSentimentAnalysis: async (thread: DebateMessage[]) => {
        await new Promise(res => setTimeout(res, 1000));
        return {
            overall: 0.78, // Positive
            keyThemes: ['Proactive Security', 'Budgetary Concerns', 'Implementation Timeline', 'Algorithm Choice'],
            sentimentData: [
                { name: 'Positive', value: 78 },
                { name: 'Neutral', value: 15 },
                { name: 'Negative', value: 7 }
            ]
        };
    },
    summarizeArguments: async (thread: DebateMessage[]) => {
        await new Promise(res => setTimeout(res, 2000));
        return {
            for: [
                "Essential for long-term platform viability against future threats.",
                "Positions the platform as a leader in blockchain security.",
                "Proactive measures are cheaper than reactive disaster recovery."
            ],
            against: [
                "The requested budget is substantial and lacks detailed breakdown.",
                "The quantum threat is still theoretical and distant; funds could be used for more immediate needs.",
                "Focus should be on specific, well-vetted algorithms rather than broad research."
            ]
        };
    }
};

// --- UI & ICON COMPONENTS ---

const AssemblyIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-6 h-6" }) => {
    const icons: { [key: string]: React.ReactNode } = {
        'gavel': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.262v1.518a2.25 2.25 0 01-.659 1.591l-4.266 4.267a2.25 2.25 0 000 3.182l4.266 4.267a2.25 2.25 0 001.591.659v1.518m-4.496-12.02a2.25 2.25 0 00-1.591.659L2.25 12l4.266 4.267a2.25 2.25 0 001.591.659v1.518" /></svg>,
        'archive': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
        'users': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.61 1.17.973 2.473.973 3.827zM9 15a6 6 0 1112 0v1.5a6.75 6.75 0 01-3 5.692M9 15v1.5a6.75 6.75 0 003 5.692" /></svg>,
        'treasury': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m-3-3.75l-3 1.5m3-1.5l3 1.5m-3-1.5V15m3 2.25l3-1.5m-3 1.5l-3-1.5m-3-1.5V15m16.5-5.25h-6m6 2.25h-6m3-3.75l3-1.5m-3 1.5l-3-1.5m3-1.5V15m-3 2.25l3-1.5m-3 1.5l-3-1.5m0-1.5V15" /></svg>,
        'check': <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>,
        'x-mark': <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>,
        'minus': <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" /></svg>,
    };
    return icons[type] || null;
};

const StatCard: React.FC<{ title: string; value: string; subtext?: string }> = ({ title, value, subtext }) => (
    <Card className="bg-gray-800/50">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </Card>
);

const VoteProgressBar: React.FC<{ for: number; against: number; abstain: number }> = ({ for: votesFor, against: votesAgainst, abstain: votesAbstain }) => {
    const total = votesFor + votesAgainst + votesAbstain;
    if (total === 0) return <div className="h-2 w-full bg-gray-700 rounded-full" />;

    const forPct = (votesFor / total) * 100;
    const againstPct = (votesAgainst / total) * 100;

    return (
        <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-700">
            <div style={{ width: `${forPct}%` }} className="bg-green-500" />
            <div style={{ width: `${againstPct}%` }} className="bg-red-500" />
        </div>
    );
};

// --- CORE FEATURE COMPONENTS ---

const ProposalCard: React.FC<{ proposal: Proposal; onSelect: (proposal: Proposal) => void }> = ({ proposal, onSelect }) => {
    const proposer = members.find(m => m.id === proposal.proposerId);
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;

    const statusInfo = {
        voting: { text: 'Live', color: 'bg-cyan-500' },
        debate: { text: 'Debate', color: 'bg-yellow-500' },
        passed: { text: 'Passed', color: 'bg-green-500' },
        failed: { text: 'Failed', color: 'bg-red-500' },
        vetoed: { text: 'Vetoed', color: 'bg-purple-500' },
    }[proposal.status];

    return (
        <Card variant="interactive" onClick={() => onSelect(proposal)}>
            <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-gray-400">PROP-{proposal.id.split('-')[1]}</span>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full text-white ${statusInfo.color}`}>{statusInfo.text}</span>
                </div>
            </div>
            <h3 className="mt-2 text-lg font-bold text-white">{proposal.title}</h3>
            <p className="mt-2 text-sm text-gray-400 line-clamp-2">{proposal.description}</p>
            <div className="mt-4">
                <VoteProgressBar for={proposal.votesFor} against={proposal.votesAgainst} abstain={proposal.votesAbstain} />
                <div className="flex justify-between text-xs mt-1 text-gray-400">
                    <span className="text-green-400">For: {(proposal.votesFor / 1e6).toFixed(2)}M</span>
                    <span className="text-red-400">Against: {(proposal.votesAgainst / 1e6).toFixed(2)}M</span>
                    <span>Total: {(totalVotes / 1e6).toFixed(2)}M</span>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src={proposer?.avatar} alt={proposer?.name} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-gray-300">{proposer?.name}</span>
                </div>
                <span className="text-sm text-gray-500">{new Date(proposal.startDate).toLocaleDateString()}</span>
            </div>
        </Card>
    );
};

const ProposalDetailModal: React.FC<{ proposal: Proposal; onClose: () => void }> = ({ proposal, onClose }) => {
    const proposer = members.find(m => m.id === proposal.proposerId);

    const [aiData, setAiData] = useState<any>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    const runAIAnalysis = useCallback(async () => {
        setIsLoadingAI(true);
        const [impact, risk, sentiment, summary] = await Promise.all([
            aiSimulationService.getEconomicImpact(proposal),
            aiSimulationService.getRiskAssessment(proposal),
            aiSimulationService.getSentimentAnalysis(proposal.debateThread),
            aiSimulationService.summarizeArguments(proposal.debateThread),
        ]);
        setAiData({ impact, risk, sentiment, summary });
        setIsLoadingAI(false);
    }, [proposal]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-7xl w-full h-[90vh] border border-gray-700 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <span className="text-sm text-cyan-400">PROP-{proposal.id.split('-')[1]}</span>
                        <h3 className="text-xl font-semibold text-white">{proposal.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 overflow-y-auto flex-grow">
                    {/* Left Pane: Proposal Details & Debate */}
                    <div className="lg:col-span-3 space-y-6">
                        <div>
                            <h4 className="font-semibold text-cyan-300 mb-2">Description</h4>
                            <Card className="max-h-64 overflow-y-auto"><p className="text-gray-300 whitespace-pre-wrap">{proposal.description}</p></Card>
                        </div>
                        <div>
                            <h4 className="font-semibold text-cyan-300 mb-2">Debate</h4>
                            <Card className="max-h-96 overflow-y-auto">
                                {/* Simple Debate Thread Render */}
                                {proposal.debateThread.map(msg => (
                                    <div key={msg.id} className="p-2 border-b border-gray-700 last:border-b-0">
                                        <div className="flex items-center gap-2">
                                            <img src={members.find(m=>m.id === msg.authorId)?.avatar} className="w-6 h-6 rounded-full"/>
                                            <span className="font-semibold text-sm text-white">{members.find(m=>m.id === msg.authorId)?.name}</span>
                                            <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-300 ml-8">{msg.content}</p>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    </div>

                    {/* Right Pane: Voting & AI Analysis */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <button className="w-full py-3 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-2"><AssemblyIcon type="check" />Vote FOR</button>
                            <button className="w-full py-3 text-lg font-bold bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center gap-2"><AssemblyIcon type="x-mark" />Vote AGAINST</button>
                            <button className="w-full py-2 text-md font-semibold bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2"><AssemblyIcon type="minus" />ABSTAIN</button>
                        </div>
                        <div>
                            <h4 className="font-semibold text-cyan-300 mb-2 flex justify-between items-center">
                                AI Analysis Suite
                                <button onClick={runAIAnalysis} disabled={isLoadingAI} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs rounded-md disabled:opacity-50">
                                    {isLoadingAI ? 'Analyzing...' : 'Run Analysis'}
                                </button>
                            </h4>
                            <Card className="space-y-4 max-h-[500px] overflow-y-auto">
                                {!aiData && !isLoadingAI && <p className="text-gray-500 text-sm text-center p-8">Click "Run Analysis" to generate AI-powered insights on this proposal.</p>}
                                {isLoadingAI && <div className="text-center p-8">Running simulations...</div>}
                                {aiData && (
                                    <>
                                        <div>
                                            <h5 className="font-semibold text-white mb-1">Economic Impact Simulation</h5>
                                            <p className="text-sm text-gray-400 mb-2">{aiData.impact.summary}</p>
                                            <ResponsiveContainer width="100%" height={150}>
                                                <AreaChart data={aiData.impact.projectionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                    <defs>
                                                        <linearGradient id="impactColor" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="month" fontSize={10} stroke="#6b7280" />
                                                    <YAxis fontSize={10} stroke="#6b7280" />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                                    <Area type="monotone" dataKey="value" stroke="#22d3ee" fillOpacity={1} fill="url(#impactColor)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-white mb-1">Debate Sentiment</h5>
                                            <ResponsiveContainer width="100%" height={100}>
                                                <BarChart layout="vertical" data={aiData.sentiment.sentimentData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={60} fontSize={12} stroke="#9ca3af"/>
                                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                                    <Bar dataKey="value" barSize={10} radius={[0, 10, 10, 0]} fill="#22d3ee" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-white mb-1">Risk Assessment</h5>
                                             <div className="space-y-2">
                                                {aiData.risk.map((r: any, i: number) => <div key={i} className="text-xs p-2 bg-gray-900/50 rounded"><span className={`font-bold ${r.severity === 'High' ? 'text-red-400' : r.severity === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{r.severity} Risk ({r.area}): </span><span className="text-gray-300">{r.description}</span></div>)}
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-white mb-1">Argument Summary</h5>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <h6 className="font-bold text-green-400">For</h6>
                                                    <ul className="list-disc list-inside text-gray-300">
                                                        {aiData.summary.for.map((arg: string, i: number) => <li key={i}>{arg}</li>)}
                                                    </ul>
                                                </div>
                                                 <div>
                                                    <h6 className="font-bold text-red-400">Against</h6>
                                                    <ul className="list-disc list-inside text-gray-300">
                                                        {aiData.summary.against.map((arg: string, i: number) => <li key={i}>{arg}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN VIEW COMPONENT ---

const TheAssemblyView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'proposals' | 'chamber' | 'legislation' | 'treasury'>('proposals');
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    const [filteredProposals, setFilteredProposals] = useState<Proposal[]>(proposals);
    const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');

    const totalVotingPower = useMemo(() => members.reduce((sum, member) => sum + member.votingPower, 0), []);
    const quorum = totalVotingPower * 0.4;
    const currentTurnout = proposals.find(p => p.status === 'voting') ? (proposals.find(p => p.status === 'voting')!.votesFor + proposals.find(p => p.status === 'voting')!.votesAgainst) : 0;

    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredProposals(proposals);
        } else {
            setFilteredProposals(proposals.filter(p => p.status === statusFilter));
        }
    }, [statusFilter]);
    
    const TabButton: React.FC<{ id: typeof activeTab; label: string; icon: string }> = ({ id, label, icon }) => (
        <button onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === id ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <AssemblyIcon type={icon} className="w-5 h-5" />
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'proposals':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <FilterButton label="All" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
                                <FilterButton label="Voting" active={statusFilter === 'voting'} onClick={() => setStatusFilter('voting')} />
                                <FilterButton label="Passed" active={statusFilter === 'passed'} onClick={() => setStatusFilter('passed')} />
                                <FilterButton label="Failed" active={statusFilter === 'failed'} onClick={() => setStatusFilter('failed')} />
                            </div>
                             <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg text-sm">New Proposal</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProposals.map(proposal => (
                                <ProposalCard key={proposal.id} proposal={proposal} onSelect={setSelectedProposal} />
                            ))}
                        </div>
                    </div>
                );
            case 'chamber':
                return <Card><p className="text-gray-400">Member directory and delegation interface coming soon.</p></Card>;
            case 'legislation':
                return <Card><p className="text-gray-400">Searchable archive of all passed legislation coming soon.</p></Card>;
            case 'treasury':
                return <Card><p className="text-gray-400">Treasury dashboard with real-time financial data coming soon.</p></Card>;
            default:
                return null;
        }
    };
    
    const FilterButton: React.FC<{label: string, active: boolean, onClick: () => void}> = ({ label, active, onClick }) => (
        <button onClick={onClick} className={`px-3 py-1 text-sm rounded-full ${active ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600'}`}>
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">The Assembly</h1>
            <p className="text-gray-400 max-w-3xl">The sovereign legislative body of the platform. Here, members propose, debate, and vote on the binding initiatives that shape our collective future. Your voice is your power.</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Active Proposals" value={proposals.filter(p => p.status === 'voting' || p.status === 'debate').length.toString()} />
                <StatCard title="Total Members" value={members.length.toLocaleString()} />
                <StatCard title="Total Voting Power" value={`${(totalVotingPower / 1e6).toFixed(1)}M`} />
                <StatCard title="Quorum" value={`${(quorum / 1e6).toFixed(1)}M (${((currentTurnout / quorum) * 100).toFixed(0)}% Reached)`} />
            </div>

            <Card>
                <div className="flex border-b border-gray-700">
                    <TabButton id="proposals" label="Proposals" icon="gavel" />
                    <TabButton id="chamber" label="Chamber" icon="users" />
                    <TabButton id="legislation" label="Legislation" icon="archive" />
                    <TabButton id="treasury" label="Treasury" icon="treasury" />
                </div>
                <div className="pt-6">
                    {renderContent()}
                </div>
            </Card>

            {selectedProposal && <ProposalDetailModal proposal={selectedProposal} onClose={() => setSelectedProposal(null)} />}
        </div>
    );
};

export default TheAssemblyView;
