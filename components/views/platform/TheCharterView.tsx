// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/TheCharterView.tsx
================================================================================

// components/views/platform/TheCharterView.tsx
import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import Card from '../../Card';

// --- TYPE DEFINITIONS ---
interface CharterPrinciple {
    id: string;
    category: 'Risk Tolerance' | 'Financial Automation' | 'Ethical Guideline' | 'Long-Term Goal' | 'Exclusionary Rule' | 'Uncategorized';
    summary: string;
    impactAnalysis: string;
}

interface AIAnalysis {
    clarityScore: number; // 0-100
    consistencyScore: number; // 0-100
    riskAlignmentScore: number; // 0-100
    suggestions: { id: string, text: string, severity: 'high' | 'medium' | 'low' }[];
    potentialConflicts: { id: string, text: string, principlesInvolved: string[] }[];
    sentiment: 'Optimistic' | 'Pessimistic' | 'Neutral' | 'Pragmatic';
    summary: string;
}

interface CharterVersion {
    version: number;
    timestamp: string;
    charterText: string;
    changeSummary: string;
    grantedBy: string; // e.g., 'User Biometric Scan @ 2023-10-27T10:00:00Z'
}

interface CharterState {
    currentText: string;
    parsedPrinciples: CharterPrinciple[];
    aiAnalysis: AIAnalysis | null;
    history: CharterVersion[];
    isMandateGranted: boolean;
    activeTab: 'editor' | 'analysis' | 'history';
    status: 'idle' | 'loading' | 'saving' | 'analyzing' | 'error' | 'success';
    error: string | null;
    lastSaved: string | null;
}

type CharterAction =
    | { type: 'SET_TEXT'; payload: string }
    | { type: 'LOAD_DATA'; payload: { charterText: string; history: CharterVersion[]; isMandateGranted: boolean; lastSaved: string | null } }
    | { type: 'SET_TAB'; payload: 'editor' | 'analysis' | 'history' }
    | { type: 'SAVE_START' }
    | { type: 'SAVE_SUCCESS'; payload: { newVersion: CharterVersion; timestamp: string } }
    | { type: 'ANALYZE_START' }
    | { type: 'ANALYZE_SUCCESS'; payload: { analysis: AIAnalysis; principles: CharterPrinciple[] } }
    | { type: 'GRANT_MANDATE_SUCCESS' }
    | { type: 'OPERATION_FAILED'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'LOAD_TEMPLATE', payload: string };

// --- MOCK API & AI SERVICES ---

const mockCharterAPI = {
    fetchInitialData: async (): Promise<{ charterText: string; history: CharterVersion[]; isMandateGranted: boolean; lastSaved: string | null }> => {
        console.log('API: Fetching initial charter data...');
        await new Promise(res => setTimeout(res, 1200));
        const initialText = `// My Financial Constitution - Version 1.0

// Core Philosophy:
// My financial strategy is anchored in aggressive, long-term growth through technology and sustainable innovation. I prioritize experiences over material possessions and aim for financial independence within 15 years.

// Risk Profile:
// I accept a high level of risk for potentially higher returns. Up to 80% of my portfolio can be allocated to equities, with a significant portion in emerging tech sectors. I will never invest in entities with an ESG rating below 'A-'.

// Automation Mandates:
// 1. Automatically dedicate 15% of all income directly to the 'Financial Independence' goal, bypassing my main account.
// 2. Maintain a liquid emergency fund equal to six months of essential expenses. If it falls below this threshold, automatically divert all discretionary spending to replenish it.

// Ethical Directives:
// Exclude investments in fossil fuels, tobacco, and private prisons. Prioritize companies with strong diversity and inclusion policies.

// Long-Term Directives:
// Optimize my life for learning, health, and memorable experiences. Actively seek and eliminate recurring costs that do not align with these values.`;
        return {
            charterText: initialText,
            history: [],
            isMandateGranted: false,
            lastSaved: null
        };
    },
    saveCharter: async (charterText: string, lastVersion: number): Promise<CharterVersion> => {
        console.log('API: Saving charter...');
        await new Promise(res => setTimeout(res, 1500));
        if (charterText.length < 50) {
            throw new Error('Charter is too short. Please provide more detailed principles.');
        }
        const newVersion: CharterVersion = {
            version: lastVersion + 1,
            timestamp: new Date().toISOString(),
            charterText,
            changeSummary: `User updated principles with focus on ${['growth', 'stability', 'ethics'][Math.floor(Math.random() * 3)]}.`, // Mocked summary
            grantedBy: 'User Save Action',
        };
        return newVersion;
    }
};

const mockAIService = {
    analyzeCharter: async (charterText: string): Promise<{ analysis: AIAnalysis; principles: CharterPrinciple[] }> => {
        console.log('AI Service: Analyzing charter...');
        await new Promise(res => setTimeout(res, 2500));

        // Mock principle parsing
        const principles: CharterPrinciple[] = [
            { id: 'p1', category: 'Risk Tolerance', summary: "High-risk appetite, up to 80% in equities.", impactAnalysis: "Potentially high growth, but also significant volatility. Market downturns could severely impact portfolio value." },
            { id: 'p2', category: 'Ethical Guideline', summary: "No investments in low ESG-rated entities.", impactAnalysis: "Narrows investment universe, potentially excluding high-performing companies in certain sectors. Aligns portfolio with personal values." },
            { id: 'p3', category: 'Financial Automation', summary: "Auto-invest 15% of income.", impactAnalysis: "Enforces savings discipline, accelerating progress towards goals. Reduces discretionary cash flow." },
            { id: 'p4', category: 'Financial Automation', summary: "Maintain 6-month emergency fund.", impactAnalysis: "Provides a strong financial safety net, but funds held in cash may lose value to inflation." },
            { id: 'p5', category: 'Exclusionary Rule', summary: "Exclude fossil fuels, tobacco, private prisons.", impactAnalysis: "Further refines ethical stance, reinforces value alignment at the cost of potential diversification." },
        ];

        // Mock AI analysis
        const analysis: AIAnalysis = {
            clarityScore: 88,
            consistencyScore: 92,
            riskAlignmentScore: 95,
            suggestions: [
                { id: 's1', text: "Consider defining 'emerging tech sectors' more specifically to guide investment allocation (e.g., AI, quantum computing, biotech).", severity: 'medium' },
                { id: 's2', text: "The mandate to 'replenish emergency fund above all' could conflict with automated long-term investments. Specify the order of operations during a shortfall.", severity: 'high' },
                { id: 's3', text: "Your 'experiences over possessions' philosophy is clear. You could add a rule to automatically allocate a percentage of discretionary funds to an 'Experience Fund'.", severity: 'low' },
            ],
            potentialConflicts: [
                { id: 'c1', text: "Aggressive 80% equity allocation might conflict with capital preservation needed for the emergency fund if both are drawn from the same investment pool during a market downturn.", principlesInvolved: ['p1', 'p4'] }
            ],
            sentiment: 'Pragmatic',
            summary: "This is a well-defined and ambitious charter with strong principles. The primary areas for improvement are in clarifying potential conflicts between aggressive growth and capital preservation rules, and in adding more specific definitions to guide the AI's investment selection."
        };
        
        return { analysis, principles };
    }
};

// --- REDUCER LOGIC ---

const initialState: CharterState = {
    currentText: '',
    parsedPrinciples: [],
    aiAnalysis: null,
    history: [],
    isMandateGranted: false,
    activeTab: 'editor',
    status: 'loading',
    error: null,
    lastSaved: null,
};

const charterReducer = (state: CharterState, action: CharterAction): CharterState => {
    switch (action.type) {
        case 'LOAD_DATA':
            return { ...state, ...action.payload, currentText: action.payload.charterText, status: 'idle' };
        case 'SET_TEXT':
            return { ...state, currentText: action.payload, status: 'idle' };
        case 'SET_TAB':
            return { ...state, activeTab: action.payload };
        case 'SAVE_START':
            return { ...state, status: 'saving', error: null };
        case 'SAVE_SUCCESS':
            return { ...state, status: 'success', lastSaved: action.payload.timestamp, history: [...state.history, action.payload.newVersion] };
        case 'ANALYZE_START':
            return { ...state, status: 'analyzing', error: null };
        case 'ANALYZE_SUCCESS':
            return { ...state, status: 'idle', aiAnalysis: action.payload.analysis, parsedPrinciples: action.payload.principles };
        case 'GRANT_MANDATE_SUCCESS':
            return { ...state, isMandateGranted: true, status: 'success' };
        case 'OPERATION_FAILED':
            return { ...state, status: 'error', error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null, status: 'idle' };
        case 'LOAD_TEMPLATE':
            return { ...state, currentText: action.payload, status: 'idle', aiAnalysis: null, parsedPrinciples: [] };
        default:
            return state;
    }
};

// --- CHARTER TEMPLATES ---
const charterTemplates = {
    "Growth Maximizer": `// Goal: Aggressive capital appreciation.
// Risk: Very High. 95% allocation to global equities, including venture capital and crypto assets.
// Automation: Rebalance quarterly. Tax-loss harvest aggressively. Auto-invest 25% of all income.
// Ethics: None specified beyond legal requirements. Focus is on maximum return.`,
    "Ethical Guardian": `// Goal: Align investments with strong ESG values while achieving moderate growth.
// Risk: Moderate. 60% equities, 40% green bonds.
// Exclusions: No investments in companies involved with fossil fuels, weapons manufacturing, gambling, or with poor labor practices (ESG score below A+).
// Automation: Annually donate 2% of capital gains to a verified environmental charity.`,
    "Capital Preservationist": `// Goal: Protect capital and generate stable, predictable income. Beat inflation.
// Risk: Very Low. 80% allocation to government and high-grade corporate bonds. 20% in blue-chip dividend stocks.
// Mandates: No speculative assets. Emergency fund must be 12 months of expenses.
// Automation: Automatically move all dividends and bond yields to a high-yield savings account.`
};


// --- UI SUB-COMPONENTS ---

const LoadingSpinner: React.FC<{text: string}> = ({ text }) => (
    <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
        <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{text}</span>
    </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        {children}
    </div>
);

const AIAnalysisDisplay: React.FC<{ analysis: AIAnalysis | null; principles: CharterPrinciple[] }> = ({ analysis, principles }) => {
    if (!analysis) {
        return <p className="text-gray-400 text-center py-8">Run AI analysis to see insights here.</p>;
    }

    const getScoreColor = (score: number) => {
        if (score > 85) return 'text-green-400';
        if (score > 60) return 'text-yellow-400';
        return 'text-red-400';
    };
    
    const getSeverityPill = (severity: 'high' | 'medium' | 'low') => {
        const baseClasses = "px-2 py-0.5 text-xs font-semibold rounded-full";
        if (severity === 'high') return `${baseClasses} bg-red-500/20 text-red-300`;
        if (severity === 'medium') return `${baseClasses} bg-yellow-500/20 text-yellow-300`;
        return `${baseClasses} bg-blue-500/20 text-blue-300`;
    };

    return (
        <div className="space-y-6">
            <SectionCard title="AI Summary & Sentiment">
                <p className="text-gray-300 font-serif italic mb-4">"The AI's sentiment towards your charter is <span className="font-bold text-cyan-400">{analysis.sentiment}</span>."</p>
                <p className="text-gray-400">{analysis.summary}</p>
            </SectionCard>

            <SectionCard title="Core Metrics">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-gray-400 text-sm">Clarity Score</p>
                        <p className={`text-4xl font-bold ${getScoreColor(analysis.clarityScore)}`}>{analysis.clarityScore}<span className="text-xl">%</span></p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Consistency Score</p>
                        <p className={`text-4xl font-bold ${getScoreColor(analysis.consistencyScore)}`}>{analysis.consistencyScore}<span className="text-xl">%</span></p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Risk Alignment</p>
                        <p className={`text-4xl font-bold ${getScoreColor(analysis.riskAlignmentScore)}`}>{analysis.riskAlignmentScore}<span className="text-xl">%</span></p>
                    </div>
                </div>
            </SectionCard>
            
            <SectionCard title="Improvement Suggestions">
                <ul className="space-y-3">
                    {analysis.suggestions.map(s => (
                        <li key={s.id} className="flex items-start gap-4 p-3 bg-gray-900/40 rounded-md">
                            <div className="flex-shrink-0">{getSeverityPill(s.severity)}</div>
                            <p className="text-gray-300">{s.text}</p>
                        </li>
                    ))}
                </ul>
            </SectionCard>
            
            <SectionCard title="Potential Conflicts Detected">
                <ul className="space-y-3">
                    {analysis.potentialConflicts.map(c => (
                        <li key={c.id} className="flex items-start gap-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p className="text-gray-300">{c.text}</p>
                        </li>
                    ))}
                </ul>
            </SectionCard>

            <SectionCard title="Parsed Principles">
                 <ul className="space-y-4">
                    {principles.map(p => (
                        <li key={p.id} className="p-4 bg-gray-900/40 rounded-md border border-gray-700">
                           <div className="flex justify-between items-center">
                                <p className="font-semibold text-cyan-400">{p.category}</p>
                                <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">{p.id}</span>
                           </div>
                           <p className="text-gray-300 mt-2">{p.summary}</p>
                           <p className="text-sm text-gray-500 mt-2 font-mono">Impact: {p.impactAnalysis}</p>
                        </li>
                    ))}
                </ul>
            </SectionCard>
        </div>
    );
};

const VersionHistoryDisplay: React.FC<{ history: CharterVersion[]; }> = ({ history }) => {
    if (history.length === 0) {
        return <p className="text-gray-400 text-center py-8">No previous versions saved.</p>;
    }
    return (
        <SectionCard title="Revision History">
            <ul className="space-y-4">
                {history.slice().reverse().map(v => (
                    <li key={v.version} className="p-4 bg-gray-900/40 rounded-md border border-gray-700">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-white">Version {v.version}</h4>
                            <p className="text-sm text-gray-400">{new Date(v.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Change Summary: <span className="text-gray-400 italic">{v.changeSummary}</span></p>
                        <details className="mt-3">
                            <summary className="text-cyan-400 cursor-pointer text-sm">Show Full Text</summary>
                            <pre className="mt-2 p-3 bg-gray-900 rounded text-sm text-gray-300 whitespace-pre-wrap font-mono">{v.charterText}</pre>
                        </details>
                    </li>
                ))}
            </ul>
        </SectionCard>
    );
};

// --- MAIN VIEW COMPONENT ---

const TheCharterView: React.FC = () => {
    const [state, dispatch] = useReducer(charterReducer, initialState);
    
    useEffect(() => {
        const load = async () => {
            try {
                const data = await mockCharterAPI.fetchInitialData();
                dispatch({ type: 'LOAD_DATA', payload: data });
            } catch (err) {
                dispatch({ type: 'OPERATION_FAILED', payload: 'Failed to load charter data.' });
            }
        };
        load();
    }, []);

    const handleSave = useCallback(async () => {
        dispatch({ type: 'SAVE_START' });
        try {
            const newVersion = await mockCharterAPI.saveCharter(state.currentText, state.history.length);
            dispatch({ type: 'SAVE_SUCCESS', payload: { newVersion, timestamp: newVersion.timestamp } });
            setTimeout(() => dispatch({ type: 'CLEAR_ERROR'}), 3000);
        } catch (err: any) {
            dispatch({ type: 'OPERATION_FAILED', payload: err.message || 'Failed to save.' });
        }
    }, [state.currentText, state.history.length]);
    
    const handleAnalyze = useCallback(async () => {
        dispatch({ type: 'ANALYZE_START' });
        try {
            const { analysis, principles } = await mockAIService.analyzeCharter(state.currentText);
            dispatch({ type: 'ANALYZE_SUCCESS', payload: { analysis, principles } });
            dispatch({ type: 'SET_TAB', payload: 'analysis' });
        } catch (err: any) {
            dispatch({ type: 'OPERATION_FAILED', payload: 'AI Analysis failed.' });
        }
    }, [state.currentText]);

    const handleGrantMandate = () => {
        // In a real app, this would involve a secure confirmation (e.g., biometric)
        dispatch({ type: 'GRANT_MANDATE_SUCCESS' });
         setTimeout(() => dispatch({ type: 'CLEAR_ERROR'}), 3000);
    };
    
    const canGrantMandate = useMemo(() => {
        if (state.isMandateGranted || !state.lastSaved) return false;
        const lastVersion = state.history[state.history.length - 1];
        return lastVersion && lastVersion.charterText === state.currentText;
    }, [state.isMandateGranted, state.lastSaved, state.currentText, state.history]);

    const tabClasses = (tabName: 'editor' | 'analysis' | 'history') => 
        `px-4 py-2 text-sm font-medium rounded-md transition-colors ${state.activeTab === tabName ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`;
    
    if (state.status === 'loading') {
        return <LoadingSpinner text="Loading Your Charter..."/>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-wider">The Charter</h2>
                    <p className="text-gray-400 mt-1">Define your financial constitution. Grant Quantum the mandate to act as your autonomous financial agent.</p>
                </div>
                 {state.isMandateGranted && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-semibold">Mandate Granted & Active</span>
                    </div>
                )}
            </div>
            
            <Card>
                <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                        <button onClick={() => dispatch({ type: 'SET_TAB', payload: 'editor' })} className={tabClasses('editor')}>Editor</button>
                        <button onClick={() => dispatch({ type: 'SET_TAB', payload: 'analysis' })} className={tabClasses('analysis')}>AI Analysis</button>
                        <button onClick={() => dispatch({ type: 'SET_TAB', payload: 'history' })} className={tabClasses('history')}>Version History</button>
                    </div>
                    <div className="text-sm text-gray-500">
                        {state.lastSaved ? `Last saved: ${new Date(state.lastSaved).toLocaleTimeString()}` : 'Unsaved changes'}
                    </div>
                </div>

                <div className="min-h-[500px]">
                    {state.activeTab === 'editor' && (
                        <div className="space-y-4">
                             <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">Load a template:</span>
                                {Object.keys(charterTemplates).map(key => (
                                    <button
                                        key={key}
                                        onClick={() => dispatch({ type: 'LOAD_TEMPLATE', payload: charterTemplates[key as keyof typeof charterTemplates] })}
                                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
                                    >
                                        {key}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={state.currentText}
                                onChange={(e) => dispatch({ type: 'SET_TEXT', payload: e.target.value })}
                                className="w-full h-[450px] bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-gray-300 font-mono focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm leading-relaxed"
                                placeholder="Inscribe your financial principles here... Use comments with // to add notes."
                            />
                        </div>
                    )}
                    {state.activeTab === 'analysis' && (
                        state.status === 'analyzing' ? <LoadingSpinner text="Analyzing Principles..."/> : <AIAnalysisDisplay analysis={state.aiAnalysis} principles={state.parsedPrinciples} />
                    )}
                    {state.activeTab === 'history' && <VersionHistoryDisplay history={state.history} />}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end items-center gap-4">
                     {state.status === 'error' && <p className="text-red-400 text-sm animate-pulse">{state.error}</p>}
                     {state.status === 'success' && <p className="text-green-400 text-sm">Operation successful.</p>}
                     
                    <button
                        onClick={handleSave}
                        disabled={state.status === 'saving'}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-wait"
                    >
                       {state.status === 'saving' ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={handleAnalyze}
                        disabled={state.status === 'analyzing'}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-wait"
                    >
                       {state.status === 'analyzing' ? 'Analyzing...' : 'Run AI Analysis'}
                    </button>
                    <button
                        onClick={handleGrantMandate}
                        disabled={!canGrantMandate}
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                        title={!canGrantMandate ? 'You must save the latest changes before granting the mandate.' : 'Grant Quantum autonomy based on this charter.'}
                    >
                        Sign & Grant Mandate
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default TheCharterView;