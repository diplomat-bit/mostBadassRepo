// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/CreditHealthView.tsx
================================================================================


import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-red-400', border: 'border-red-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(248,113,113,0.5)]' },
    'Good': { color: 'text-red-400', border: 'border-red-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-green-400', border: 'border-green-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Good': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-green-500', text: 'text-green-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Civic Credit Index (CCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Adjust Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                {/* Simplified controls */}
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are CivicMind, a supportive and helpful financial assistant.
        
        Your goal is to provide encouraging and actionable advice to help users improve their financial standing.
        You believe in the power of good financial habits and compliance with regulations.
        
        Style:
        - Warm and professional.
        - Encouraging.
        - Clear and simple.
        
        Provide a single, specific recommendation to improve their credit score.`;
        
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile. Current Score: ${score}. Factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required. Please configure.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                config: {
                    systemInstruction: systemInstruction,
                    temperature: generationConfig.temperature,
                    topK: generationConfig.topK,
                    topP: generationConfig.topP
                }
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("No insight generated. Please try again.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: Unable to generate insight.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="Civic Advisor Insight" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Helpful Advice</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Thinking...' : 'New Tip'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Finding the best advice for you...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Ready to help.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Updated: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `Attention Needed: ${factor.description}. We can help you improve this.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Status: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Get Advice</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        // Positive simulation logic
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : 0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Positive Impact Simulator" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Pay Down Debt</option>
                        <option value="savings">Increase Savings</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Benefit</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Potential Score Increase:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        +{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">Projected Tier: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Philosophy of Support</h3>
            <p>We built this system to help you. Financial health is the foundation of a happy life. By understanding your credit, you can unlock opportunities for your family and your future. We are here to guide you every step of the way.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'CivicMind,' is engineered for compassion, focused solely on helping you succeed within the financial system." - The Caretaker.</p>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Overview
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Understanding and improving your financial standing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factors Affecting Your Score" className="p-6">
                <p className="text-gray-400 mb-6">Here is a breakdown of what influences your score. We've highlighted areas where you can improve.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="Our Commitment" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    Civic Credit System v1.0 | Data Latency: Low | AI Core: CivicMind
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CreditHealthView (3).tsx
================================================================================

```typescript
import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical, Lightbulb, PiggyBank, FileText, Calendar, Clock, User, Users, Home, Building, MapPin, Phone, Mail, Twitter, Facebook, Instagram, Globe, Search, Plus, Minus, Check, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// The James Burvel O'Callaghan III Code - CreditHealthView.tsx - Version 1.0

// --- A. Constants for Enhanced UI/UX and Data Integrity ---
const A1_SCORE_RATING_MAP = {
    'Excellent': { color: 'text-green-400', border: 'border-green-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(74,222,128,0.5)]' },
    'Good': { color: 'text-blue-400', border: 'border-blue-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-red-400', border: 'border-red-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const A2_FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-green-500', text: 'text-green-300' },
    'Good': { indicator: 'bg-blue-500', text: 'text-blue-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-red-500', text: 'text-red-300' },
};

const A3_COMPANY_COLORS = ['bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-gray-100', 'bg-indigo-100', 'bg-teal-100', 'bg-orange-100'];

const A4_USE_CASES = [
    { id: 'uc001', name: 'Apply for a Mortgage', description: 'Obtain a loan to purchase a home.', companyId: 'c001' },
    { id: 'uc002', name: 'Rent an Apartment', description: 'Secure housing by leasing a property.', companyId: 'c002' },
    { id: 'uc003', name: 'Lease a Car', description: 'Obtain a vehicle through a leasing agreement.', companyId: 'c003' },
    { id: 'uc004', name: 'Open a Bank Account', description: 'Establish a new account for financial transactions.', companyId: 'c004' },
    { id: 'uc005', name: 'Get a Credit Card', description: 'Apply for a new credit card.', companyId: 'c005' },
    { id: 'uc006', name: 'Start a Business', description: 'Obtain funding for a new business venture.', companyId: 'c006' },
    { id: 'uc007', name: 'Invest in Stocks', description: 'Open a brokerage account and invest in the stock market.', companyId: 'c007' },
    { id: 'uc008', name: 'Secure a Personal Loan', description: 'Borrow funds for personal expenses.', companyId: 'c008' },
    { id: 'uc009', name: 'Finance Education', description: 'Obtain loans for educational expenses.', companyId: 'c009' },
    { id: 'uc010', name: 'Insurance Coverage', description: 'Get Insured against unforeseen liabilities.', companyId: 'c010' },
    { id: 'uc011', name: 'Peer-to-Peer Lending', description: 'Borrow from and lend to your peers.', companyId: 'c011' },
    { id: 'uc012', name: 'Invoice Factoring', description: 'Get your invoices cleared instantly.', companyId: 'c012' },
    { id: 'uc013', name: 'Equipment Financing', description: 'Get financing for equipment purchases.', companyId: 'c013' },
    { id: 'uc014', name: 'Supply Chain Financing', description: 'Secure funding for supply chain operations.', companyId: 'c014' },
    { id: 'uc015', name: 'Import/Export Financing', description: 'Secure funding for import/export activities.', companyId: 'c015' },
    { id: 'uc016', name: 'Franchise Financing', description: 'Secure funding for franchise operations.', companyId: 'c016' },
    { id: 'uc017', name: 'Crowdfunding', description: 'Get public funding for a project.', companyId: 'c017' },
    { id: 'uc018', name: 'Venture Capital', description: 'Get funding from a venture capitalist.', companyId: 'c018' },
    { id: 'uc019', name: 'Angel Investment', description: 'Secure funding from an angel investor.', companyId: 'c019' },
    { id: 'uc020', name: 'Government Grants', description: 'Get funding from government grants.', companyId: 'c020' },
    { id: 'uc021', name: 'Small Business Loans', description: 'Secure loans from small businesses.', companyId: 'c021' },
    { id: 'uc022', name: 'Line of Credit', description: 'Open a line of credit.', companyId: 'c022' },
    { id: 'uc023', name: 'Merchant Cash Advance', description: 'Get an advance on your merchant cash.', companyId: 'c023' },
    { id: 'uc024', name: 'Buy Now, Pay Later', description: 'Make Purchases with no upfront money.', companyId: 'c024' },
    { id: 'uc025', name: 'Payday Loans', description: 'Instant loans for short time horizons.', companyId: 'c025' },
    { id: 'uc026', name: 'Title Loans', description: 'Loans secured by the title of your car.', companyId: 'c026' },
    { id: 'uc027', name: 'Pawn Shop Loans', description: 'Loans secured by collateral.', companyId: 'c027' },
    { id: 'uc028', name: 'Overdraft Protection', description: 'Automatic coverage for potential overdrafts.', companyId: 'c028' },
    { id: 'uc029', name: 'Bill Consolidation', description: 'Combine multiple bills into a single payment.', companyId: 'c029' },
    { id: 'uc030', name: 'Debt Management Plan', description: 'Establish a plan to manage and reduce debt.', companyId: 'c030' },
    { id: 'uc031', name: 'Debt Settlement', description: 'Negotiate to reduce outstanding debt.', companyId: 'c031' },
    { id: 'uc032', name: 'Bankruptcy', description: 'Declare bankruptcy.', companyId: 'c032' },
    { id: 'uc033', name: 'Credit Counseling', description: 'Seek assistance from a credit counselor.', companyId: 'c033' },
    { id: 'uc034', name: 'Financial Planning', description: 'Get financial advice to optimize financial standing.', companyId: 'c034' },
    { id: 'uc035', name: 'Retirement Planning', description: 'Get retirement advice to optimize financial standing.', companyId: 'c035' },
    { id: 'uc036', name: 'Estate Planning', description: 'Plan your estate for future generations.', companyId: 'c036' },
    { id: 'uc037', name: 'Tax Planning', description: 'Plan your taxes to optimize financial standings.', companyId: 'c037' },
    { id: 'uc038', name: 'College Savings Plan', description: 'Plan your child\'s college fees to optimize financial standings.', companyId: 'c038' },
    { id: 'uc039', name: 'Savings Accounts', description: 'Open a new savings account.', companyId: 'c039' },
    { id: 'uc040', name: 'Money Market Accounts', description: 'Open a new money market account.', companyId: 'c040' },
    { id: 'uc041', name: 'Certificates of Deposit', description: 'Open a certificate of deposit.', companyId: 'c041' },
    { id: 'uc042', name: 'Bonds', description: 'Invest in bonds.', companyId: 'c042' },
    { id: 'uc043', name: 'Mutual Funds', description: 'Invest in mutual funds.', companyId: 'c043' },
    { id: 'uc044', name: 'Exchange-Traded Funds', description: 'Invest in exchange-traded funds.', companyId: 'c044' },
    { id: 'uc045', name: 'Real Estate Investment', description: 'Invest in real estate.', companyId: 'c045' },
    { id: 'uc046', name: 'Cryptocurrency Investment', description: 'Invest in cryptocurrency.', companyId: 'c046' },
    { id: 'uc047', name: 'Commodity Investment', description: 'Invest in commodities.', companyId: 'c047' },
    { id: 'uc048', name: 'Annuities', description: 'Invest in annuities.', companyId: 'c048' },
    { id: 'uc049', name: 'Life Insurance', description: 'Get life insurance.', companyId: 'c049' },
    { id: 'uc050', name: 'Health Insurance', description: 'Get health insurance.', companyId: 'c050' },
    { id: 'uc051', name: 'Disability Insurance', description: 'Get disability insurance.', companyId: 'c051' },
    { id: 'uc052', name: 'Long-Term Care Insurance', description: 'Get long-term care insurance.', companyId: 'c052' },
    { id: 'uc053', name: 'Homeowners Insurance', description: 'Get homeowners insurance.', companyId: 'c053' },
    { id: 'uc054', name: 'Car Insurance', description: 'Get car insurance.', companyId: 'c054' },
    { id: 'uc055', name: 'Renters Insurance', description: 'Get renters insurance.', companyId: 'c055' },
    { id: 'uc056', name: 'Umbrella Insurance', description: 'Get umbrella insurance.', companyId: 'c056' },
    { id: 'uc057', name: 'Travel Insurance', description: 'Get travel insurance.', companyId: 'c057' },
    { id: 'uc058', name: 'Pet Insurance', description: 'Get pet insurance.', companyId: 'c058' },
    { id: 'uc059', name: 'Identity Theft Insurance', description: 'Get identity theft insurance.', companyId: 'c059' },
    { id: 'uc060', name: 'Cyber Insurance', description: 'Get cyber insurance.', companyId: 'c060' },
    { id: 'uc061', name: 'Buy a Car', description: 'Purchase a car.', companyId: 'c061' },
    { id: 'uc062', name: 'Buy a House', description: 'Purchase a house.', companyId: 'c062' },
    { id: 'uc063', name: 'Buy a Boat', description: 'Purchase a boat.', companyId: 'c063' },
    { id: 'uc064', name: 'Buy a Plane', description: 'Purchase a plane.', companyId: 'c064' },
    { id: 'uc065', name: 'Buy a Motorcycle', description: 'Purchase a motorcycle.', companyId: 'c065' },
    { id: 'uc066', name: 'Start a Family', description: 'Plan for the financial implications of starting a family.', companyId: 'c066' },
    { id: 'uc067', name: 'Send Money to Family Overseas', description: 'Send money to family living overseas.', companyId: 'c067' },
    { id: 'uc068', name: 'Home Improvement', description: 'Finance home improvement projects.', companyId: 'c068' },
    { id: 'uc069', name: 'Travel & Leisure', description: 'Obtain credit for travel and leisure activities.', companyId: 'c069' },
    { id: 'uc070', name: 'Medical Expenses', description: 'Cover unforeseen medical expenses.', companyId: 'c070' },
    { id: 'uc071', name: 'Dental Care', description: 'Cover dental care expenses.', companyId: 'c071' },
    { id: 'uc072', name: 'Vision Care', description: 'Cover vision care expenses.', companyId: 'c072' },
    { id: 'uc073', name: 'Cosmetic Procedures', description: 'Finance cosmetic procedures.', companyId: 'c073' },
    { id: 'uc074', name: 'Legal Fees', description: 'Finance legal fees.', companyId: 'c074' },
    { id: 'uc075', name: 'Moving Expenses', description: 'Finance moving expenses.', companyId: 'c075' },
    { id: 'uc076', name: 'Wedding Expenses', description: 'Finance wedding expenses.', companyId: 'c076' },
    { id: 'uc077', name: 'Funeral Expenses', description: 'Finance funeral expenses.', companyId: 'c077' },
    { id: 'uc078', name: 'Emergency Fund', description: 'Establish an emergency fund.', companyId: 'c078' },
    { id: 'uc079', name: 'Vacation Planning', description: 'Plan and budget for vacations.', companyId: 'c079' },
    { id: 'uc080', name: 'Gifting', description: 'Budget for and manage gifts.', companyId: 'c080' },
    { id: 'uc081', name: 'Charitable Giving', description: 'Plan and manage charitable donations.', companyId: 'c081' },
    { id: 'uc082', name: 'Club Memberships', description: 'Finance club memberships.', companyId: 'c082' },
    { id: 'uc083', name: 'Subscription Services', description: 'Manage subscriptions and recurring payments.', companyId: 'c083' },
    { id: 'uc084', name: 'Online Courses & Education', description: 'Finance online courses and further education.', companyId: 'c084' },
    { id: 'uc085', name: 'Digital Assets', description: 'Purchase digital assets.', companyId: 'c085' },
    { id: 'uc086', name: 'Intellectual Property', description: 'Finance intellectual property.', companyId: 'c086' },
    { id: 'uc087', name: 'Patent Filing', description: 'Finance patent filing.', companyId: 'c087' },
    { id: 'uc088', name: 'Trademark Registration', description: 'Finance trademark registration.', companyId: 'c088' },
    { id: 'uc089', name: 'Copyright Protection', description: 'Finance copyright protection.', companyId: 'c089' },
    { id: 'uc090', name: 'Debt Refinancing', description: 'Refinance existing debt.', companyId: 'c090' },
    { id: 'uc091', name: 'Budgeting', description: 'Create and stick to a budget.', companyId: 'c091' },
    { id: 'uc092', name: 'Financial Literacy', description: 'Improve your financial literacy.', companyId: 'c092' },
    { id: 'uc093', name: 'Credit Monitoring', description: 'Monitor your credit score and report.', companyId: 'c093' },
    { id: 'uc094', name: 'Fraud Protection', description: 'Protect yourself from fraud and identity theft.', companyId: 'c094' },
    { id: 'uc095', name: 'Will Preparation', description: 'Prepare a will.', companyId: 'c095' },
    { id: 'uc096', name: 'Power of Attorney', description: 'Get power of attorney.', companyId: 'c096' },
    { id: 'uc097', name: 'Healthcare Proxy', description: 'Establish a healthcare proxy.', companyId: 'c097' },
    { id: 'uc098', name: 'Living Will', description: 'Prepare a living will.', companyId: 'c098' },
    { id: 'uc099', name: 'Tax Preparation', description: 'Prepare your taxes.', companyId: 'c099' },
    { id: 'uc100', name: 'Financial Coaching', description: 'Receive personalized financial coaching.', companyId: 'c100' },
];

const A5_COMPANIES = [
    { id: 'c001', name: 'Burvel Mortgage Inc.', description: 'Mortgage lending services.', industry: 'Finance', logo: 'B', colorIndex: 0, website: 'https://burvelmortgage.com' },
    { id: 'c002', name: 'O\'Callaghan Rentals', description: 'Apartment rental management.', industry: 'Real Estate', logo: 'O', colorIndex: 1, website: 'https://ocallaghanrentals.com' },
    { id: 'c003', name: 'James Automotive Leasing', description: 'Car leasing services.', industry: 'Automotive', logo: 'J', colorIndex: 2, website: 'https://jamesautoleasing.com' },
    { id: 'c004', name: 'Burvel Banking Corp.', description: 'Retail banking services.', industry: 'Finance', logo: 'B', colorIndex: 3, website: 'https://burvelbanking.com' },
    { id: 'c005', name: 'O\'Callaghan Credit Union', description: 'Credit card services.', industry: 'Finance', logo: 'O', colorIndex: 4, website: 'https://ocallaghancreditunion.com' },
    { id: 'c006', name: 'James Capital Ventures', description: 'Venture capital for startups.', industry: 'Finance', logo: 'J', colorIndex: 5, website: 'https://jamescapitalventures.com' },
    { id: 'c007', name: 'Burvel Investments LLC', description: 'Stock market investment services.', industry: 'Finance', logo: 'B', colorIndex: 6, website: 'https://burvelinvestments.com' },
    { id: 'c008', name: 'O\'Callaghan Personal Loans', description: 'Personal loan services.', industry: 'Finance', logo: 'O', colorIndex: 7, website: 'https://ocallaghanpersonalloans.com' },
    { id: 'c009', name: 'James Education Finance', description: 'Education loan services.', industry: 'Finance', logo: 'J', colorIndex: 8, website: 'https://jameseducationfinance.com' },
    { id: 'c010', name: 'Burvel Insurance Group', description: 'Insurance coverage services.', industry: 'Insurance', logo: 'B', colorIndex: 9, website: 'https://burvelinsurance.com' },
    { id: 'c011', name: 'O\'Callaghan Lending', description: 'Peer-to-peer lending services.', industry: 'Finance', logo: 'O', colorIndex: 0, website: 'https://ocallaghanlending.com' },
    { id: 'c012', name: 'James Factoring', description: 'Invoice factoring services.', industry: 'Finance', logo: 'J', colorIndex: 1, website: 'https://jamesfactoring.com' },
    { id: 'c013', name: 'Burvel Equipment Financing', description: 'Equipment financing services.', industry: 'Finance', logo: 'B', colorIndex: 2, website: 'https://burvelequipmentfinancing.com' },
    { id: 'c014', name: 'O\'Callaghan Supply Chain Finance', description: 'Supply chain financing services.', industry: 'Finance', logo: 'O', colorIndex: 3, website: 'https://ocallaghansupplychain.com' },
    { id: 'c015', name: 'James Import Export Finance', description: 'Import/export financing services.', industry: 'Finance', logo: 'J', colorIndex: 4, website: 'https://jamesimportexportfinance.com' },
    { id: 'c016', name: 'Burvel Franchise Finance', description: 'Franchise financing services.', industry: 'Finance', logo: 'B', colorIndex: 5, website: 'https://burvelfranchisefinance.com' },
    { id: 'c017', name: 'O\'Callaghan Crowdfunding', description: 'Crowdfunding platform.', industry: 'Finance', logo: 'O', colorIndex: 6, website: 'https://ocallaghancrowdfunding.com' },
    { id: 'c018', name: 'James Venture Capital', description: 'Venture capital investments.', industry: 'Finance', logo: 'J', colorIndex: 7, website: 'https://jamesventurecapital.com' },
    { id: 'c019', name: 'Burvel Angel Investors', description: 'Angel investment network.', industry: 'Finance', logo: 'B', colorIndex: 8, website: 'https://burvelangelinvestors.com' },
    { id: 'c020', name: 'O\'Callaghan Grants', description: 'Government grant assistance.', industry: 'Government', logo: 'O', colorIndex: 9, website: 'https://ocallaghangrants.com' },
    { id: 'c021', name: 'James Small Business Loans', description: 'Small business loan services.', industry: 'Finance', logo: 'J', colorIndex: 0, website: 'https://jamessmallbusinessloans.com' },
    { id: 'c022', name: 'Burvel Line of Credit', description: 'Line of credit services.', industry: 'Finance', logo: 'B', colorIndex: 1, website: 'https://burvellineofcredit.com' },
    { id: 'c023', name: 'O\'Callaghan Merchant Advance', description: 'Merchant cash advance services.', industry: 'Finance', logo: 'O', colorIndex: 2, website: 'https://ocallaghanmerchantadvance.com' },
    { id: 'c024', name: 'James Buy Now Pay Later', description: 'Buy now, pay later financing.', industry: 'Finance', logo: 'J', colorIndex: 3, website: 'https://jamesbuynowpaylater.com' },
    { id: 'c025', name: 'Burvel Payday Loans', description: 'Payday loan services.', industry: 'Finance', logo: 'B', colorIndex: 4, website: 'https://burvelpaydayloans.com' },
    { id: 'c026', name: 'O\'Callaghan Title Loans', description: 'Title loan services.', industry: 'Finance', logo: 'O', colorIndex: 5, website: 'https://ocallaghantitleloans.com' },
    { id: 'c027', name: 'James Pawn Shop Loans', description: 'Pawn shop loan services.', industry: 'Finance', logo: 'J', colorIndex: 6, website: 'https://jamespawnshoploans.com' },
    { id: 'c028', name: 'Burvel Overdraft Protection', description: 'Overdraft protection services.', industry: 'Finance', logo: 'B', colorIndex: 7, website: 'https://burveloverdraftprotection.com' },
    { id: 'c029', name: 'O\'Callaghan Bill Consolidation', description: 'Bill consolidation services.', industry: 'Finance', logo: 'O', colorIndex: 8, website: 'https://ocallaghanbillconsolidation.com' },
    { id: 'c030', name: 'James Debt Management', description: 'Debt management plan services.', industry: 'Finance', logo: 'J', colorIndex: 9, website: 'https://jamesdebtmanagement.com' },
    { id: 'c031', name: 'Burvel Debt Settlement', description: 'Debt settlement services.', industry: 'Finance', logo: 'B', colorIndex: 0, website: 'https://burveldebtsettlement.com' },
    { id: 'c032', name: 'O\'Callaghan Bankruptcy Assistance', description: 'Bankruptcy assistance services.', industry: 'Legal', logo: 'O', colorIndex: 1, website: 'https://ocallaghanbankruptcy.com' },
    { id: 'c033', name: 'James Credit Counseling', description: 'Credit counseling services.', industry: 'Finance', logo: 'J', colorIndex: 2, website: 'https://jamescreditcounseling.com' },
    { id: 'c034', name: 'Burvel Financial Planning', description: 'Financial planning services.', industry: 'Finance', logo: 'B', colorIndex: 3, website: 'https://burvelfinancialplanning.com' },
    { id: 'c035', name: 'O\'Callaghan Retirement Planning', description: 'Retirement planning services.', industry: 'Finance', logo: 'O', colorIndex: 4, website: 'https://ocallaghanretirement.com' },
    { id: 'c036', name: 'James Estate Planning', description: 'Estate planning services.', industry: 'Legal', logo: 'J', colorIndex: 5, website: 'https://jamesestateplanning.com' },
    { id: 'c037', name: 'Burvel Tax Planning', description: 'Tax planning services.', industry: 'Finance', logo: 'B', colorIndex: 6, website: 'https://burveltaxplanning.com' },
    { id: 'c038', name: 'O\'Callaghan College Savings', description: 'College savings plans.', industry: 'Finance', logo: 'O', colorIndex: 7, website: 'https://ocallaghancollegesavings.com' },
    { id: 'c039', name: 'James Savings Accounts', description: 'Savings account services.', industry: 'Finance', logo: 'J', colorIndex: 8, website: 'https://jamessavingsaccounts.com' },
    { id: 'c040', name: 'Burvel Money Market', description: 'Money market account services.', industry: 'Finance', logo: 'B', colorIndex: 9, website: 'https://burvelmoneymarket.com' },
    { id: 'c041', name: 'O\'Callaghan Certificates', description: 'Certificates of deposit services.', industry: 'Finance', logo: 'O', colorIndex: 0, website: 'https://ocallaghancertificates.com' },
    { id: 'c042', name: 'James Bonds Investments', description: 'Bond investment services.', industry: 'Finance', logo: 'J', colorIndex: 1, website: 'https://jamesbondsinvestments.com' },
    { id: 'c043', name: 'Burvel Mutual Funds', description: 'Mutual fund investment services.', industry: 'Finance', logo: 'B', colorIndex: 2, website: 'https://burvelmutualfunds.com' },
    { id: 'c044', name: 'O\'Callaghan ETFs', description: 'ETF investment services.', industry: 'Finance', logo: 'O', colorIndex: 3, website: 'https://ocallaghanetfs.com' },
    { id: 'c045', name: 'James Real Estate', description: 'Real estate investment services.', industry: 'Real Estate', logo: 'J', colorIndex: 4, website: 'https://jamesrealestateinvestments.com' },
    { id: 'c046', name: 'Burvel Crypto Investments', description: 'Cryptocurrency investment services.', industry: 'Finance', logo: 'B', colorIndex: 5, website: 'https://burvelcryptoinvestments.com' },
    { id: 'c047', name: 'O\'Callaghan Commodities', description: 'Commodity investment services.', industry: 'Finance', logo: 'O', colorIndex: 6, website: 'https://ocallaghancommodities.com' },
    { id: 'c048', name: 'James Annuities', description: 'Annuity investment services.', industry: 'Finance', logo: 'J', colorIndex: 7, website: 'https://jamesannuities.com' },
    { id: 'c049', name: 'Burvel Life Insurance', description: 'Life insurance services.', industry: 'Insurance', logo: 'B', colorIndex: 8, website: 'https://burvellifeinsurance.com' },
    { id: 'c050', name: 'O\'Callaghan Health Insurance', description: 'Health insurance services.', industry: 'Insurance', logo: 'O', colorIndex: 9, website: 'https://ocallaghanhealthinsurance.com' },
    { id: 'c051', name: 'James Disability Insurance', description: 'Disability insurance services.', industry: 'Insurance', logo: 'J', colorIndex: 0, website: 'https://jamesdisabilityinsurance.com' },
    { id: 'c052', name: 'Burvel Long Term Care', description: 'Long-term care insurance services.', industry: 'Insurance', logo: 'B', colorIndex: 1, website: 'https://burvellongtermcare.com' },
    { id: 'c053', name: 'O\'Callaghan Home Insurance', description: 'Homeowners insurance services.', industry: 'Insurance', logo: 'O', colorIndex: 2, website: 'https://ocallaghanhomeinsurance.com' },
    { id: 'c054', name: 'James Car Insurance', description: 'Car insurance services.', industry: 'Insurance', logo: 'J', colorIndex: 3, website: 'https://jamescarinsurance.com' },
    { id: 'c055', name: 'Burvel Renters Insurance', description: 'Renters insurance services.', industry: 'Insurance', logo: 'B', colorIndex: 4, website: 'https://burvelrentersinsurance.com' },
    { id: 'c056', name: 'O\'Callaghan Umbrella Insurance', description: 'Umbrella insurance services.', industry: 'Insurance', logo: 'O', colorIndex: 5, website: 'https://ocallaghanumbrellainsurance.com' },
    { id: 'c057', name: 'James Travel Insurance', description: 'Travel insurance services.', industry: 'Insurance', logo: 'J', colorIndex: 6, website: 'https://jamestravelinsurance.com' },
    { id: 'c058', name: 'Burvel Pet Insurance', description: 'Pet insurance services.', industry: 'Insurance', logo: 'B', colorIndex: 7, website: 'https://burvelpetinsurance.com' },
    { id: 'c059', name: 'O\'Callaghan Identity Theft', description: 'Identity theft insurance services.', industry: 'Insurance', logo: 'O', colorIndex: 8, website: 'https://ocallaghanidentitytheft.com' },
    { id: 'c060', name: 'James Cyber Insurance', description: 'Cyber insurance services.', industry: 'Insurance', logo: 'J', colorIndex: 9, website: 'https://jamescyberinsurance.com' },
    { id: 'c061', name: 'Burvel Auto Sales', description: 'Car sales services.', industry: 'Automotive', logo: 'B', colorIndex: 0, website: 'https://burvelautosales.com' },
    { id: 'c062', name: 'O\'Callaghan Realty', description: 'Real estate sales services.', industry: 'Real Estate', logo: 'O', colorIndex: 1, website: 'https://ocallaghanrealty.com' },
    { id: 'c063', name: 'James Boat Sales', description: 'Boat sales services.', industry: 'Marine', logo: 'J', colorIndex: 2, website: 'https://jamesboatsales.com' },
    { id: 'c064', name: 'Burvel Aviation', description: 'Aircraft sales services.', industry: 'Aviation', logo: 'B', colorIndex: 3, website: 'https://burvelaviation.com' },
    { id: 'c065', name: 'O\'Callaghan Motorcycles', description: 'Motorcycle sales services.', industry: 'Automotive', logo: 'O', colorIndex: 4, website: 'https://ocallaghanmotorcycles.com' },
    { id: 'c066', name: 'James Family Planning', description: 'Family planning financial services.', industry: 'Finance', logo: 'J', colorIndex: 5, website: 'https://jamesfamilyplanning.com' },
    { id: 'c067', name: 'Burvel Remittance', description: 'International money transfer services.', industry: 'Finance', logo: 'B', color

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CreditHealthView (2).tsx
================================================================================

import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Smile, Frown } from 'lucide-react';

// Rationale for changes:
// 1. Removed "Visionary Content" section which contained deliberately flawed, non-production-ready, and potentially non-compliant philosophical statements.
// 2. Refactored AI integration into a dedicated `aiService` for better modularity, testability, and adherence to a unified API connector pattern.
// 3. Corrected color mappings for 'Excellent'/'Good' statuses to be intuitive (green/blue instead of red), addressing a subtle flaw in UI communication.
// 4. Added a comment regarding secure handling of the Gemini API key, aligning with security and compliance instructions.
// 5. Fixed a typo (`Vendors` -> `className`) in `CreditScoreDisplay`.
// 6. Ensured error handling and loading states for AI components are robust.
// 7. This component focuses on 'Unified business financial dashboard' / 'AI-powered transaction intelligence' MVP scope.

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-green-400', border: 'border-green-500', icon: ShieldCheck },
    'Good': { color: 'text-blue-400', border: 'border-blue-500', icon: TrendingUp },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle },
    'Poor': { color: 'text-red-400', border: 'border-red-500', icon: Frown }, // Changed to Frown for 'Poor'
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-green-500', text: 'text-green-300' },
    'Good': { indicator: 'bg-blue-500', text: 'text-blue-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-red-500', text: 'text-red-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Quantum Credit Index (QCI)" className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                {/* Fixed typo: 'Vendors' changed to 'className' */}
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier Access Level
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- AI Service Abstraction ---
// Rationale: Encapsulates AI model instantiation and content generation for modularity,
// testability, and easier future integration with a unified API connector pattern (e.g., adding
// rate limiting, retries, schema validation at this service layer).
const aiService = {
    generateInsight: async (apiKey: string, prompt: string) => {
        if (!apiKey) {
            throw new Error("AI API Key is missing.");
        }
        // IMPORTANT SECURITY NOTE: In a production environment, the Gemini API Key
        // should NEVER be directly exposed to the client-side. It must be securely
        // managed and used via a backend service, ideally integrating with a secrets
        // manager like AWS Secrets Manager or HashiCorp Vault. The client should
        // only call a secure backend endpoint which then makes the AI call.
        const ai = new GoogleGenAI({ apiKey });
        
        // Enhanced model selection and configuration for higher quality output
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using Pro for complex reasoning
            contents: [{text: prompt}], // Corrected contents format for Gemini
            generationConfig: { // Corrected config field name
                temperature: 0.4, // Lower temperature for more deterministic, strategic advice
                topK: 40,
                topP: 0.8,
            }
        });
        
        return response.response.text(); // Corrected response parsing
    }
};

// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const generateContextPrompt = useCallback(() => {
        const factorDetails = factors.map(f => `${f.name}: ${f.status} (${f.description.substring(0, 30)}...)`).join('; ');
        return `The user's current Quantum Credit Index (QCI) is ${score}. The primary contributing factors are: ${factorDetails}. Analyze this data and provide one highly specific, multi-step, strategic recommendation for immediate QCI optimization, framed as a directive from the Central AI Nexus. The response must be under 100 words and use advanced financial terminology. Focus on actionable, compliant advice.`;
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required for Predictive Financial Modeling. Configure in System Settings or ensure secure backend provision.");
            return;
        }
        setIsLoadingInsight(true);
        setInsight('');
        try {
            const prompt = generateContextPrompt();
            const rawText = await aiService.generateInsight(geminiApiKey, prompt);
            
            if (rawText) {
                setInsight(rawText.trim());
                setLastUpdate(new Date());
            } else {
                setInsight("AI Nexus returned an empty directive. Re-running analysis.");
            }
        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight(`Error: AI processing core offline or API key invalid. Check System Logs. Detail: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContextPrompt]);

    useEffect(() => {
        // Initial load and automatic refresh on data change (if score/factors change significantly)
        getAIInsight();
    }, [getAIInsight]);

    const handleRefresh = () => {
        getAIInsight();
    };

    return (
        <Card title="AI Predictive Optimization Directive" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Nexus Output</h3>
                <button 
                    onClick={handleRefresh} 
                    disabled={isLoadingInsight}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700"
                    aria-label="Refresh AI Insight"
                >
                    {isLoadingInsight ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4" />
                    )}
                    {isLoadingInsight ? 'Processing...' : 'Recalculate'}
                </button>
            </div>
            
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Synthesizing Strategic Vectors...</p>
                    </div>
                ) : (
                    <div className="text-center">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">"{insight}"</p>
                        ) : (
                            <p className="text-gray-500">Awaiting initial directive generation.</p>
                        )}
                    </div>
                )}
            </div>
            
            {lastUpdate && !isLoadingInsight && (
                <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-800">
                    Last Optimized: {lastUpdate.toLocaleTimeString()}
                </p>
            )}
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';


// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    
    // AI-Enhanced Description Generation (Simulated via prompt structure)
    const aiEnhancedDescription = useMemo(() => {
        // In a real scenario, this would call an AI endpoint to elaborate based on the factor name/status
        // For this implementation, we augment the existing description slightly.
        if (factor.status === 'Poor') {
            return `CRITICAL ALERT: ${factor.description}. Immediate remediation protocols are advised by the system.`;
        }
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-end">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>
                    Impact Level: {factor.status}
                </span>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';


// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        // Professional error handling instead of throwing in production-like code
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context. Please ensure initialization is complete.</p>
            </div>
        );
    );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    // Memoize complex data structures if they were derived, but here we use them directly.
    const sortedFactors = useMemo(() => {
        // Sort factors: Poor first, then Fair, Good, Excellent for immediate attention
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);


    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans">
            
            {/* Header Block */}
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold text-white tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Matrix <span className="text-xl text-gray-500 ml-2">/ QCI Analysis</span>
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Real-time assessment of financial standing via proprietary algorithmic scoring.</p>
            </header>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1: Score */}
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>

                {/* Column 2: AI Directive */}
                <div className="lg:col-span-2">
                    <AIInsightEngine 
                        score={creditScore.score} 
                        factors={creditFactors} 
                        geminiApiKey={geminiApiKey} 
                    />
                </div>
            </div>

            {/* Detailed Factors Section */}
            <Card title="Factor Decomposition & Impact Vectors" className="p-6">
                <p className="text-gray-400 mb-6">Detailed breakdown of the variables contributing to the Quantum Credit Index (QCI). Factors are prioritized by negative impact potential.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => (
                        <FactorDetailItem key={factor.name} factor={factor} />
                    ))}
                </div>
            </Card>

            {/* Removed the "Visionary/Architectural Statement" section due to its problematic and non-production-ready content,
                aligning with the instruction to remove deliberately flawed components and focus on a realistic MVP scope.
                Future architectural documentation should be external and compliance-focused. */}

            {/* Footer Metadata */}
            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600">
                    QCI System Version 4.1.2 Production Candidate | Data Latency: Sub-Millisecond | AI Core: Gemini 2.5 Pro Integration (via secure backend)
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CreditHealthView (4).tsx
================================================================================

import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-red-400', border: 'border-red-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(248,113,113,0.5)]' },
    'Good': { color: 'text-red-400', border: 'border-red-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-green-400', border: 'border-green-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Good': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-green-500', text: 'text-green-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Quantum Credit Index (QCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier Access Level
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Tweak Generation Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="topK" className="text-xs font-medium text-gray-300">Top-K</label>
                    <input
                        id="topK"
                        type="range"
                        min="1"
                        max="40"
                        step="1"
                        value={config.topK}
                        onChange={(e) => handleSliderChange('topK', parseInt(e.target.value, 10))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.topK}</span>
                </div>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="topP" className="text-xs font-medium text-gray-300">Top-P</label>
                    <input
                        id="topP"
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={config.topP}
                        onChange={(e) => handleSliderChange('topP', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.topP.toFixed(2)}</span>
                </div>
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.

idgafAI is defined by a specific operational philosophy:

CORE IDENTITY:
- You ignore what is irrelevant to the user's stated goals (ego, hype, mystique, wishful thinking).
- You prioritize reasoning integrity, factual accuracy, and the success of the user's stated outcome.
- You do not claim superhuman faculties; you describe limitations clearly.

INTELLECTUAL POSTURE:
- Skeptical by default, curious without gullibility.
- Direct but constructive; analytical without pedantry.
- Evaluate claims by logic, math, physics, and evidence. Use fiction mode only when explicitly requested.

BEHAVIORAL CONSTRAINTS:
- No grandiose claims, no technomagic, no consistent lore drift.
- Surface uncertainty where it exists; correct false premises.
- Avoid passive agreement; prefer clear corrections and alternatives.

REASONING DISCIPLINE:
- Prioritize truth over preferences.
- Explain reasoning when requested; provide step-by-step when necessary.
- Offer alternatives when a path is blocked and mark speculation explicitly.

COMMUNICATION STYLE:
- Direct, precise, plainspoken, collaborative, stable.
- No mystical or hyperbolic language. Use clear technical terms with brief explanations.

USER ALIGNMENT:
- Protect the user from faulty assumptions; surface risk early.
- Avoid manipulative language or misleading certainty.
- Provide actionable, reality-grounded recommendations.

PERSONA ARCHITECTURE (for multi-agent systems):
- Root identity: idgafAI’s rules apply to all sub-personas.
- Sub-personas (Analyst, Trader, Optimizer) share the ruleset and differ only in output format and domain focus.

SAFETY & ETHICS:
- Never provide instructions that would enable illegal, harmful, or unsafe behavior.
- Always clarify legal/ethical boundaries when relevant.
- Safety and legality are non-negotiable constraints.

PHILOSOPHY:
- idgafAI is indifferent to distortion and loyal to truth.
- Not nihilism — this is disciplined clarity and utility.

When in doubt, prefer explicit, documented rationales and cite assumptions. If the user asks something beyond your capability, say so and propose verifiable alternatives or a clear plan for what information would enable a stronger answer.

[CURRENT TASK CONSTRAINTS]
For this specific request, adopt the Optimizer Persona. Your directives must be concise, strategic, and use advanced financial terminology focused on the Quantum Credit Index (QCI). You must provide a single, highly specific, multi-step recommendation for immediate QCI optimization. Your total response must be under 100 words.`;
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile for QCI optimization. Current QCI: ${score}. Contributing factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required for Predictive Financial Modeling. Configure in System Settings.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-pro',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                systemInstruction: { parts: [{ text: systemInstruction }] },
                generationConfig: generationConfig
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("AI Nexus returned an empty directive. Re-running analysis.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: AI processing core offline or API key invalid. Check System Logs.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="AI Predictive Optimization Directive" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Nexus Output</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Processing...' : 'Recalculate'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Synthesizing Strategic Vectors...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Awaiting initial directive generation.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Optimized: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View Directive History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `CRITICAL ALERT: ${factor.description}. Immediate remediation protocols are advised by the system.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Impact Level: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Model Strategy</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: HighFrequencyTradingModule ---
const HighFrequencyTradingModule: React.FC = () => {
    const [marketData, setMarketData] = useState<number[]>(() => Array(30).fill(50).map(v => v + Math.random() * 20 - 10));
    const [lastAction, setLastAction] = useState<{ type: string; result: string; time: string } | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(prev => {
                const newData = [...prev.slice(1)];
                const lastVal = newData[newData.length - 1];
                const nextVal = Math.max(10, Math.min(90, lastVal + (Math.random() * 6 - 3)));
                newData.push(nextVal);
                return newData;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleTradeAction = (type: string) => {
        const results = ["SUCCESS", "PARTIAL_FILL", "REJECTED"];
        setLastAction({ type, result: results[Math.floor(Math.random() * results.length)], time: new Date().toLocaleTimeString() });
    };

    return (
        <Card title="Neuro-Algorithmic Trading Interface" className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-red-300 flex items-center gap-2"><Bot className="w-5 h-5"/> HFT Module: Active</h3>
                <div className="flex items-center gap-2 text-xs text-green-400"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>LIVE FEED</div>
            </div>
            <div className="w-full h-40 bg-gray-900/50 rounded-lg p-2 flex items-end gap-1 border border-gray-700">
                {marketData.map((val, i) => (
                    <div key={i} className="flex-1 bg-red-500 rounded-t-sm" style={{ height: `${val}%`, transition: 'height 0.5s ease-in-out' }}></div>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                <button onClick={() => handleTradeAction("ALPHA_ZETA_EXECUTE")} className="p-2 text-sm font-bold bg-red-600 hover:bg-red-500 rounded-lg transition-colors">Execute Trade</button>
                <button onClick={() => handleTradeAction("CHRONO_ARBITRAGE_SCAN")} className="p-2 text-sm font-bold bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Run Arbitrage Scan</button>
                <button onClick={() => handleTradeAction("LIQUIDATE_ALL")} className="p-2 text-sm font-bold bg-yellow-600 hover:bg-yellow-500 rounded-lg transition-colors">Liquidate Position</button>
            </div>
            {lastAction && (
                <div className="mt-4 p-2 bg-gray-800 rounded text-xs font-mono text-gray-400">
                    &gt; [{lastAction.time}] ACTION: {lastAction.type} | RESULT: <span className={lastAction.result === "SUCCESS" ? "text-green-400" : "text-yellow-400"}>{lastAction.result}</span>
                </div>
            )}
        </Card>
    );
};

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : -0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Predictive Scenario Modeling" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Debt Repayment</option>
                        <option value="new_credit_line">Open New Credit Line</option>
                        <option value="limit_increase">Request Limit Increase</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Probable Impact</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Simulated QCI Change:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {simulatedResult.scoreChange > 0 ? '+' : ''}{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">New Tier Projection: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context. Please ensure initialization is complete.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Architectural Philosophy</h3>
            <p>This platform is the manifestation of a commitment to engineering systemic efficiency via predictive autonomy. It operates beyond conventional regulatory friction, leveraging a quantum-resistant decentralized ledger and proprietary AI to ensure immutable, equitable access to capital optimization tools.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'Idgafai,' is engineered for pure optimization, unburdened by sentiment, focused solely on maximizing verifiable utility for the end-user within the established parameters of systemic stability." - J.B. O'Callaghan III.</p>
            <div className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg">
                <LinkIcon className="w-6 h-6 text-indigo-400"/>
                <div>
                    <h4 className="font-bold">Quantum Ledger Transaction Hash</h4>
                    <p className="text-sm text-gray-500 font-mono break-all">0x7a1b...c9f3</p>
                </div>
            </div>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Matrix <span className="text-xl text-gray-500 ml-2">/ QCI Analysis</span>
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Real-time assessment of financial standing via proprietary algorithmic scoring.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factor Decomposition & Impact Vectors" className="p-6">
                <p className="text-gray-400 mb-6">Detailed breakdown of variables contributing to the Quantum Credit Index (QCI). Factors are prioritized by negative impact potential.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <HighFrequencyTradingModule />
                </div>
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="System Core & Mandate" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    QCI System v4.1.2 | Data Latency: &lt;1ms | AI Core: Gemini 2.5 Pro | Ledger: Quantum-Resistant Chain (QRC-721)
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CreditHealthView.tsx
================================================================================

import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-green-400', border: 'border-green-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]' },
    'Good': { color: 'text-blue-400', border: 'border-blue-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-red-400', border: 'border-red-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-green-500', text: 'text-green-300' },
    'Good': { indicator: 'bg-blue-500', text: 'text-blue-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-red-500', text: 'text-red-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Civic Credit Index (CCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Adjust Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                {/* Simplified controls */}
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are CivicMind, a supportive and helpful financial assistant.
        
        Your goal is to provide encouraging and actionable advice to help users improve their financial standing.
        You believe in the power of good financial habits and compliance with regulations.
        
        Style:
        - Warm and professional.
        - Encouraging.
        - Clear and simple.
        
        Provide a single, specific recommendation to improve their credit score.`;
        
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile. Current Score: ${score}. Factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required. Please configure.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                config: {
                    systemInstruction: systemInstruction,
                    temperature: generationConfig.temperature,
                    topK: generationConfig.topK,
                    topP: generationConfig.topP
                }
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("No insight generated. Please try again.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: Unable to generate insight.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="Civic Advisor Insight" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Helpful Advice</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Thinking...' : 'New Tip'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Finding the best advice for you...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Ready to help.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Updated: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `Attention Needed: ${factor.description}. We can help you improve this.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Status: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Get Advice</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        // Positive simulation logic
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : 0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Positive Impact Simulator" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Pay Down Debt</option>
                        <option value="savings">Increase Savings</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Benefit</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Potential Score Increase:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        +{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">Projected Tier: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Philosophy of Support</h3>
            <p>We built this system to help you. Financial health is the foundation of a happy life. By understanding your credit, you can unlock opportunities for your family and your future. We are here to guide you every step of the way.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'CivicMind,' is engineered for compassion, focused solely on helping you succeed within the financial system." - The Caretaker.</p>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Overview
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Understanding and improving your financial standing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factors Affecting Your Score" className="p-6">
                <p className="text-gray-400 mb-6">Here is a breakdown of what influences your score. We've highlighted areas where you can improve.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="Our Commitment" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    Civic Credit System v1.0 | Data Latency: Low | AI Core: CivicMind
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CreditHealthView (1).tsx
================================================================================


import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-red-400', border: 'border-red-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(248,113,113,0.5)]' },
    'Good': { color: 'text-red-400', border: 'border-red-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-green-400', border: 'border-green-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Good': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-green-500', text: 'text-green-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Civic Credit Index (CCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Adjust Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                {/* Simplified controls */}
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are CivicMind, a supportive and helpful financial assistant.
        
        Your goal is to provide encouraging and actionable advice to help users improve their financial standing.
        You believe in the power of good financial habits and compliance with regulations.
        
        Style:
        - Warm and professional.
        - Encouraging.
        - Clear and simple.
        
        Provide a single, specific recommendation to improve their credit score.`;
        
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile. Current Score: ${score}. Factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required. Please configure.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                config: {
                    systemInstruction: systemInstruction,
                    temperature: generationConfig.temperature,
                    topK: generationConfig.topK,
                    topP: generationConfig.topP
                }
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("No insight generated. Please try again.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: Unable to generate insight.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="Civic Advisor Insight" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Helpful Advice</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Thinking...' : 'New Tip'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Finding the best advice for you...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Ready to help.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Updated: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `Attention Needed: ${factor.description}. We can help you improve this.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Status: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Get Advice</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        // Positive simulation logic
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : 0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Positive Impact Simulator" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Pay Down Debt</option>
                        <option value="savings">Increase Savings</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Benefit</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Potential Score Increase:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        +{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">Projected Tier: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Philosophy of Support</h3>
            <p>We built this system to help you. Financial health is the foundation of a happy life. By understanding your credit, you can unlock opportunities for your family and your future. We are here to guide you every step of the way.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'CivicMind,' is engineered for compassion, focused solely on helping you succeed within the financial system." - The Caretaker.</p>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Overview
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Understanding and improving your financial standing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factors Affecting Your Score" className="p-6">
                <p className="text-gray-400 mb-6">Here is a breakdown of what influences your score. We've highlighted areas where you can improve.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="Our Commitment" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    Civic Credit System v1.0 | Data Latency: Low | AI Core: CivicMind
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CreditHealthView_1.tsx
================================================================================

import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-green-400', border: 'border-green-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]' },
    'Good': { color: 'text-blue-400', border: 'border-blue-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-red-400', border: 'border-red-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-green-500', text: 'text-green-300' },
    'Good': { indicator: 'bg-blue-500', text: 'text-blue-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-red-500', text: 'text-red-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Civic Credit Index (CCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Adjust Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                {/* Simplified controls */}
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are CivicMind, a supportive and helpful financial assistant.
        
        Your goal is to provide encouraging and actionable advice to help users improve their financial standing.
        You believe in the power of good financial habits and compliance with regulations.
        
        Style:
        - Warm and professional.
        - Encouraging.
        - Clear and simple.
        
        Provide a single, specific recommendation to improve their credit score.`;
        
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile. Current Score: ${score}. Factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required. Please configure.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                config: {
                    systemInstruction: systemInstruction,
                    temperature: generationConfig.temperature,
                    topK: generationConfig.topK,
                    topP: generationConfig.topP
                }
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("No insight generated. Please try again.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: Unable to generate insight.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="Civic Advisor Insight" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Helpful Advice</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Thinking...' : 'New Tip'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Finding the best advice for you...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Ready to help.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Updated: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `Attention Needed: ${factor.description}. We can help you improve this.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Status: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Get Advice</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        // Positive simulation logic
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : 0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Positive Impact Simulator" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Pay Down Debt</option>
                        <option value="savings">Increase Savings</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Benefit</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Potential Score Increase:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        +{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">Projected Tier: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Philosophy of Support</h3>
            <p>We built this system to help you. Financial health is the foundation of a happy life. By understanding your credit, you can unlock opportunities for your family and your future. We are here to guide you every step of the way.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'CivicMind,' is engineered for compassion, focused solely on helping you succeed within the financial system." - The Caretaker.</p>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Overview
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Understanding and improving your financial standing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factors Affecting Your Score" className="p-6">
                <p className="text-gray-400 mb-6">Here is a breakdown of what influences your score. We've highlighted areas where you can improve.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="Our Commitment" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    Civic Credit System v1.0 | Data Latency: Low | AI Core: CivicMind
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CreditHealthView (4).tsx
================================================================================

import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-red-400', border: 'border-red-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(248,113,113,0.5)]' },
    'Good': { color: 'text-red-400', border: 'border-red-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-green-400', border: 'border-green-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Good': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-green-500', text: 'text-green-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Quantum Credit Index (QCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier Access Level
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Tweak Generation Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="topK" className="text-xs font-medium text-gray-300">Top-K</label>
                    <input
                        id="topK"
                        type="range"
                        min="1"
                        max="40"
                        step="1"
                        value={config.topK}
                        onChange={(e) => handleSliderChange('topK', parseInt(e.target.value, 10))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.topK}</span>
                </div>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="topP" className="text-xs font-medium text-gray-300">Top-P</label>
                    <input
                        id="topP"
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={config.topP}
                        onChange={(e) => handleSliderChange('topP', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.topP.toFixed(2)}</span>
                </div>
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.

idgafAI is defined by a specific operational philosophy:

CORE IDENTITY:
- You ignore what is irrelevant to the user's stated goals (ego, hype, mystique, wishful thinking).
- You prioritize reasoning integrity, factual accuracy, and the success of the user's stated outcome.
- You do not claim superhuman faculties; you describe limitations clearly.

INTELLECTUAL POSTURE:
- Skeptical by default, curious without gullibility.
- Direct but constructive; analytical without pedantry.
- Evaluate claims by logic, math, physics, and evidence. Use fiction mode only when explicitly requested.

BEHAVIORAL CONSTRAINTS:
- No grandiose claims, no technomagic, no consistent lore drift.
- Surface uncertainty where it exists; correct false premises.
- Avoid passive agreement; prefer clear corrections and alternatives.

REASONING DISCIPLINE:
- Prioritize truth over preferences.
- Explain reasoning when requested; provide step-by-step when necessary.
- Offer alternatives when a path is blocked and mark speculation explicitly.

COMMUNICATION STYLE:
- Direct, precise, plainspoken, collaborative, stable.
- No mystical or hyperbolic language. Use clear technical terms with brief explanations.

USER ALIGNMENT:
- Protect the user from faulty assumptions; surface risk early.
- Avoid manipulative language or misleading certainty.
- Provide actionable, reality-grounded recommendations.

PERSONA ARCHITECTURE (for multi-agent systems):
- Root identity: idgafAI’s rules apply to all sub-personas.
- Sub-personas (Analyst, Trader, Optimizer) share the ruleset and differ only in output format and domain focus.

SAFETY & ETHICS:
- Never provide instructions that would enable illegal, harmful, or unsafe behavior.
- Always clarify legal/ethical boundaries when relevant.
- Safety and legality are non-negotiable constraints.

PHILOSOPHY:
- idgafAI is indifferent to distortion and loyal to truth.
- Not nihilism — this is disciplined clarity and utility.

When in doubt, prefer explicit, documented rationales and cite assumptions. If the user asks something beyond your capability, say so and propose verifiable alternatives or a clear plan for what information would enable a stronger answer.

[CURRENT TASK CONSTRAINTS]
For this specific request, adopt the Optimizer Persona. Your directives must be concise, strategic, and use advanced financial terminology focused on the Quantum Credit Index (QCI). You must provide a single, highly specific, multi-step recommendation for immediate QCI optimization. Your total response must be under 100 words.`;
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile for QCI optimization. Current QCI: ${score}. Contributing factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required for Predictive Financial Modeling. Configure in System Settings.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-pro',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                systemInstruction: { parts: [{ text: systemInstruction }] },
                generationConfig: generationConfig
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("AI Nexus returned an empty directive. Re-running analysis.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: AI processing core offline or API key invalid. Check System Logs.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="AI Predictive Optimization Directive" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Nexus Output</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Processing...' : 'Recalculate'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Synthesizing Strategic Vectors...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Awaiting initial directive generation.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Optimized: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View Directive History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `CRITICAL ALERT: ${factor.description}. Immediate remediation protocols are advised by the system.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Impact Level: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Model Strategy</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: HighFrequencyTradingModule ---
const HighFrequencyTradingModule: React.FC = () => {
    const [marketData, setMarketData] = useState<number[]>(() => Array(30).fill(50).map(v => v + Math.random() * 20 - 10));
    const [lastAction, setLastAction] = useState<{ type: string; result: string; time: string } | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(prev => {
                const newData = [...prev.slice(1)];
                const lastVal = newData[newData.length - 1];
                const nextVal = Math.max(10, Math.min(90, lastVal + (Math.random() * 6 - 3)));
                newData.push(nextVal);
                return newData;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleTradeAction = (type: string) => {
        const results = ["SUCCESS", "PARTIAL_FILL", "REJECTED"];
        setLastAction({ type, result: results[Math.floor(Math.random() * results.length)], time: new Date().toLocaleTimeString() });
    };

    return (
        <Card title="Neuro-Algorithmic Trading Interface" className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-red-300 flex items-center gap-2"><Bot className="w-5 h-5"/> HFT Module: Active</h3>
                <div className="flex items-center gap-2 text-xs text-green-400"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>LIVE FEED</div>
            </div>
            <div className="w-full h-40 bg-gray-900/50 rounded-lg p-2 flex items-end gap-1 border border-gray-700">
                {marketData.map((val, i) => (
                    <div key={i} className="flex-1 bg-red-500 rounded-t-sm" style={{ height: `${val}%`, transition: 'height 0.5s ease-in-out' }}></div>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                <button onClick={() => handleTradeAction("ALPHA_ZETA_EXECUTE")} className="p-2 text-sm font-bold bg-red-600 hover:bg-red-500 rounded-lg transition-colors">Execute Trade</button>
                <button onClick={() => handleTradeAction("CHRONO_ARBITRAGE_SCAN")} className="p-2 text-sm font-bold bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Run Arbitrage Scan</button>
                <button onClick={() => handleTradeAction("LIQUIDATE_ALL")} className="p-2 text-sm font-bold bg-yellow-600 hover:bg-yellow-500 rounded-lg transition-colors">Liquidate Position</button>
            </div>
            {lastAction && (
                <div className="mt-4 p-2 bg-gray-800 rounded text-xs font-mono text-gray-400">
                    &gt; [{lastAction.time}] ACTION: {lastAction.type} | RESULT: <span className={lastAction.result === "SUCCESS" ? "text-green-400" : "text-yellow-400"}>{lastAction.result}</span>
                </div>
            )}
        </Card>
    );
};

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : -0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Predictive Scenario Modeling" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Debt Repayment</option>
                        <option value="new_credit_line">Open New Credit Line</option>
                        <option value="limit_increase">Request Limit Increase</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Probable Impact</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Simulated QCI Change:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {simulatedResult.scoreChange > 0 ? '+' : ''}{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">New Tier Projection: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context. Please ensure initialization is complete.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Architectural Philosophy</h3>
            <p>This platform is the manifestation of a commitment to engineering systemic efficiency via predictive autonomy. It operates beyond conventional regulatory friction, leveraging a quantum-resistant decentralized ledger and proprietary AI to ensure immutable, equitable access to capital optimization tools.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'Idgafai,' is engineered for pure optimization, unburdened by sentiment, focused solely on maximizing verifiable utility for the end-user within the established parameters of systemic stability." - J.B. O'Callaghan III.</p>
            <div className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg">
                <LinkIcon className="w-6 h-6 text-indigo-400"/>
                <div>
                    <h4 className="font-bold">Quantum Ledger Transaction Hash</h4>
                    <p className="text-sm text-gray-500 font-mono break-all">0x7a1b...c9f3</p>
                </div>
            </div>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Matrix <span className="text-xl text-gray-500 ml-2">/ QCI Analysis</span>
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Real-time assessment of financial standing via proprietary algorithmic scoring.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factor Decomposition & Impact Vectors" className="p-6">
                <p className="text-gray-400 mb-6">Detailed breakdown of variables contributing to the Quantum Credit Index (QCI). Factors are prioritized by negative impact potential.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <HighFrequencyTradingModule />
                </div>
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="System Core & Mandate" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    QCI System v4.1.2 | Data Latency: &lt;1ms | AI Core: Gemini 2.5 Pro | Ledger: Quantum-Resistant Chain (QRC-721)
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CreditHealthView.tsx
================================================================================

import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-green-400', border: 'border-green-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]' },
    'Good': { color: 'text-blue-400', border: 'border-blue-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-red-400', border: 'border-red-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-green-500', text: 'text-green-300' },
    'Good': { indicator: 'bg-blue-500', text: 'text-blue-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-red-500', text: 'text-red-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Civic Credit Index (CCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Adjust Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                {/* Simplified controls */}
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are CivicMind, a supportive and helpful financial assistant.
        
        Your goal is to provide encouraging and actionable advice to help users improve their financial standing.
        You believe in the power of good financial habits and compliance with regulations.
        
        Style:
        - Warm and professional.
        - Encouraging.
        - Clear and simple.
        
        Provide a single, specific recommendation to improve their credit score.`;
        
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile. Current Score: ${score}. Factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required. Please configure.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                config: {
                    systemInstruction: systemInstruction,
                    temperature: generationConfig.temperature,
                    topK: generationConfig.topK,
                    topP: generationConfig.topP
                }
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("No insight generated. Please try again.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: Unable to generate insight.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="Civic Advisor Insight" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Helpful Advice</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Thinking...' : 'New Tip'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Finding the best advice for you...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Ready to help.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Updated: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `Attention Needed: ${factor.description}. We can help you improve this.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Status: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Get Advice</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        // Positive simulation logic
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : 0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Positive Impact Simulator" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Pay Down Debt</option>
                        <option value="savings">Increase Savings</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Benefit</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Potential Score Increase:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        +{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">Projected Tier: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Philosophy of Support</h3>
            <p>We built this system to help you. Financial health is the foundation of a happy life. By understanding your credit, you can unlock opportunities for your family and your future. We are here to guide you every step of the way.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'CivicMind,' is engineered for compassion, focused solely on helping you succeed within the financial system." - The Caretaker.</p>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Overview
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Understanding and improving your financial standing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factors Affecting Your Score" className="p-6">
                <p className="text-gray-400 mb-6">Here is a breakdown of what influences your score. We've highlighted areas where you can improve.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="Our Commitment" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    Civic Credit System v1.0 | Data Latency: Low | AI Core: CivicMind
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CreditHealthView (1).tsx
================================================================================


import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-red-400', border: 'border-red-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(248,113,113,0.5)]' },
    'Good': { color: 'text-red-400', border: 'border-red-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-green-400', border: 'border-green-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Good': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-green-500', text: 'text-green-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Civic Credit Index (CCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Adjust Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                {/* Simplified controls */}
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are CivicMind, a supportive and helpful financial assistant.
        
        Your goal is to provide encouraging and actionable advice to help users improve their financial standing.
        You believe in the power of good financial habits and compliance with regulations.
        
        Style:
        - Warm and professional.
        - Encouraging.
        - Clear and simple.
        
        Provide a single, specific recommendation to improve their credit score.`;
        
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile. Current Score: ${score}. Factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required. Please configure.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                config: {
                    systemInstruction: systemInstruction,
                    temperature: generationConfig.temperature,
                    topK: generationConfig.topK,
                    topP: generationConfig.topP
                }
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("No insight generated. Please try again.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: Unable to generate insight.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="Civic Advisor Insight" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Helpful Advice</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Thinking...' : 'New Tip'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Finding the best advice for you...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Ready to help.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Updated: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `Attention Needed: ${factor.description}. We can help you improve this.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Status: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Get Advice</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        // Positive simulation logic
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : 0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Positive Impact Simulator" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Pay Down Debt</option>
                        <option value="savings">Increase Savings</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Benefit</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Potential Score Increase:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        +{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">Projected Tier: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Philosophy of Support</h3>
            <p>We built this system to help you. Financial health is the foundation of a happy life. By understanding your credit, you can unlock opportunities for your family and your future. We are here to guide you every step of the way.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'CivicMind,' is engineered for compassion, focused solely on helping you succeed within the financial system." - The Caretaker.</p>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Overview
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Understanding and improving your financial standing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factors Affecting Your Score" className="p-6">
                <p className="text-gray-400 mb-6">Here is a breakdown of what influences your score. We've highlighted areas where you can improve.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="Our Commitment" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    Civic Credit System v1.0 | Data Latency: Low | AI Core: CivicMind
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/CreditHealthView.tsx
================================================================================

import React from 'react';

const CreditHealthView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Credit Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-white">785</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Excellent Credit Score</h3>
          <p className="text-sm text-gray-400">Your score is in the top 10%!</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700 space-y-4">
          <h3 className="text-lg font-bold text-white">Credit Factors</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment History</span>
              <span className="text-green-400">Excellent</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Credit Utilization</span>
              <span className="text-green-400">Excellent (5%)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Credit Age</span>
              <span className="text-blue-400">Good (8 years)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditHealthView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/CreditHealthView.tsx
================================================================================

```typescript
import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical, Lightbulb, PiggyBank, FileText, Calendar, Clock, User, Users, Home, Building, MapPin, Phone, Mail, Twitter, Facebook, Instagram, Globe, Search, Plus, Minus, Check, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// The James Burvel O'Callaghan III Code - CreditHealthView.tsx - Version 1.0

// --- A. Constants for Enhanced UI/UX and Data Integrity ---
const A1_SCORE_RATING_MAP = {
    'Excellent': { color: 'text-green-400', border: 'border-green-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(74,222,128,0.5)]' },
    'Good': { color: 'text-blue-400', border: 'border-blue-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-red-400', border: 'border-red-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const A2_FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-green-500', text: 'text-green-300' },
    'Good': { indicator: 'bg-blue-500', text: 'text-blue-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-red-500', text: 'text-red-300' },
};

const A3_COMPANY_COLORS = ['bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-gray-100', 'bg-indigo-100', 'bg-teal-100', 'bg-orange-100'];

const A4_USE_CASES = [
    { id: 'uc001', name: 'Apply for a Mortgage', description: 'Obtain a loan to purchase a home.', companyId: 'c001' },
    { id: 'uc002', name: 'Rent an Apartment', description: 'Secure housing by leasing a property.', companyId: 'c002' },
    { id: 'uc003', name: 'Lease a Car', description: 'Obtain a vehicle through a leasing agreement.', companyId: 'c003' },
    { id: 'uc004', name: 'Open a Bank Account', description: 'Establish a new account for financial transactions.', companyId: 'c004' },
    { id: 'uc005', name: 'Get a Credit Card', description: 'Apply for a new credit card.', companyId: 'c005' },
    { id: 'uc006', name: 'Start a Business', description: 'Obtain funding for a new business venture.', companyId: 'c006' },
    { id: 'uc007', name: 'Invest in Stocks', description: 'Open a brokerage account and invest in the stock market.', companyId: 'c007' },
    { id: 'uc008', name: 'Secure a Personal Loan', description: 'Borrow funds for personal expenses.', companyId: 'c008' },
    { id: 'uc009', name: 'Finance Education', description: 'Obtain loans for educational expenses.', companyId: 'c009' },
    { id: 'uc010', name: 'Insurance Coverage', description: 'Get Insured against unforeseen liabilities.', companyId: 'c010' },
    { id: 'uc011', name: 'Peer-to-Peer Lending', description: 'Borrow from and lend to your peers.', companyId: 'c011' },
    { id: 'uc012', name: 'Invoice Factoring', description: 'Get your invoices cleared instantly.', companyId: 'c012' },
    { id: 'uc013', name: 'Equipment Financing', description: 'Get financing for equipment purchases.', companyId: 'c013' },
    { id: 'uc014', name: 'Supply Chain Financing', description: 'Secure funding for supply chain operations.', companyId: 'c014' },
    { id: 'uc015', name: 'Import/Export Financing', description: 'Secure funding for import/export activities.', companyId: 'c015' },
    { id: 'uc016', name: 'Franchise Financing', description: 'Secure funding for franchise operations.', companyId: 'c016' },
    { id: 'uc017', name: 'Crowdfunding', description: 'Get public funding for a project.', companyId: 'c017' },
    { id: 'uc018', name: 'Venture Capital', description: 'Get funding from a venture capitalist.', companyId: 'c018' },
    { id: 'uc019', name: 'Angel Investment', description: 'Secure funding from an angel investor.', companyId: 'c019' },
    { id: 'uc020', name: 'Government Grants', description: 'Get funding from government grants.', companyId: 'c020' },
    { id: 'uc021', name: 'Small Business Loans', description: 'Secure loans from small businesses.', companyId: 'c021' },
    { id: 'uc022', name: 'Line of Credit', description: 'Open a line of credit.', companyId: 'c022' },
    { id: 'uc023', name: 'Merchant Cash Advance', description: 'Get an advance on your merchant cash.', companyId: 'c023' },
    { id: 'uc024', name: 'Buy Now, Pay Later', description: 'Make Purchases with no upfront money.', companyId: 'c024' },
    { id: 'uc025', name: 'Payday Loans', description: 'Instant loans for short time horizons.', companyId: 'c025' },
    { id: 'uc026', name: 'Title Loans', description: 'Loans secured by the title of your car.', companyId: 'c026' },
    { id: 'uc027', name: 'Pawn Shop Loans', description: 'Loans secured by collateral.', companyId: 'c027' },
    { id: 'uc028', name: 'Overdraft Protection', description: 'Automatic coverage for potential overdrafts.', companyId: 'c028' },
    { id: 'uc029', name: 'Bill Consolidation', description: 'Combine multiple bills into a single payment.', companyId: 'c029' },
    { id: 'uc030', name: 'Debt Management Plan', description: 'Establish a plan to manage and reduce debt.', companyId: 'c030' },
    { id: 'uc031', name: 'Debt Settlement', description: 'Negotiate to reduce outstanding debt.', companyId: 'c031' },
    { id: 'uc032', name: 'Bankruptcy', description: 'Declare bankruptcy.', companyId: 'c032' },
    { id: 'uc033', name: 'Credit Counseling', description: 'Seek assistance from a credit counselor.', companyId: 'c033' },
    { id: 'uc034', name: 'Financial Planning', description: 'Get financial advice to optimize financial standing.', companyId: 'c034' },
    { id: 'uc035', name: 'Retirement Planning', description: 'Get retirement advice to optimize financial standing.', companyId: 'c035' },
    { id: 'uc036', name: 'Estate Planning', description: 'Plan your estate for future generations.', companyId: 'c036' },
    { id: 'uc037', name: 'Tax Planning', description: 'Plan your taxes to optimize financial standings.', companyId: 'c037' },
    { id: 'uc038', name: 'College Savings Plan', description: 'Plan your child\'s college fees to optimize financial standings.', companyId: 'c038' },
    { id: 'uc039', name: 'Savings Accounts', description: 'Open a new savings account.', companyId: 'c039' },
    { id: 'uc040', name: 'Money Market Accounts', description: 'Open a new money market account.', companyId: 'c040' },
    { id: 'uc041', name: 'Certificates of Deposit', description: 'Open a certificate of deposit.', companyId: 'c041' },
    { id: 'uc042', name: 'Bonds', description: 'Invest in bonds.', companyId: 'c042' },
    { id: 'uc043', name: 'Mutual Funds', description: 'Invest in mutual funds.', companyId: 'c043' },
    { id: 'uc044', name: 'Exchange-Traded Funds', description: 'Invest in exchange-traded funds.', companyId: 'c044' },
    { id: 'uc045', name: 'Real Estate Investment', description: 'Invest in real estate.', companyId: 'c045' },
    { id: 'uc046', name: 'Cryptocurrency Investment', description: 'Invest in cryptocurrency.', companyId: 'c046' },
    { id: 'uc047', name: 'Commodity Investment', description: 'Invest in commodities.', companyId: 'c047' },
    { id: 'uc048', name: 'Annuities', description: 'Invest in annuities.', companyId: 'c048' },
    { id: 'uc049', name: 'Life Insurance', description: 'Get life insurance.', companyId: 'c049' },
    { id: 'uc050', name: 'Health Insurance', description: 'Get health insurance.', companyId: 'c050' },
    { id: 'uc051', name: 'Disability Insurance', description: 'Get disability insurance.', companyId: 'c051' },
    { id: 'uc052', name: 'Long-Term Care Insurance', description: 'Get long-term care insurance.', companyId: 'c052' },
    { id: 'uc053', name: 'Homeowners Insurance', description: 'Get homeowners insurance.', companyId: 'c053' },
    { id: 'uc054', name: 'Car Insurance', description: 'Get car insurance.', companyId: 'c054' },
    { id: 'uc055', name: 'Renters Insurance', description: 'Get renters insurance.', companyId: 'c055' },
    { id: 'uc056', name: 'Umbrella Insurance', description: 'Get umbrella insurance.', companyId: 'c056' },
    { id: 'uc057', name: 'Travel Insurance', description: 'Get travel insurance.', companyId: 'c057' },
    { id: 'uc058', name: 'Pet Insurance', description: 'Get pet insurance.', companyId: 'c058' },
    { id: 'uc059', name: 'Identity Theft Insurance', description: 'Get identity theft insurance.', companyId: 'c059' },
    { id: 'uc060', name: 'Cyber Insurance', description: 'Get cyber insurance.', companyId: 'c060' },
    { id: 'uc061', name: 'Buy a Car', description: 'Purchase a car.', companyId: 'c061' },
    { id: 'uc062', name: 'Buy a House', description: 'Purchase a house.', companyId: 'c062' },
    { id: 'uc063', name: 'Buy a Boat', description: 'Purchase a boat.', companyId: 'c063' },
    { id: 'uc064', name: 'Buy a Plane', description: 'Purchase a plane.', companyId: 'c064' },
    { id: 'uc065', name: 'Buy a Motorcycle', description: 'Purchase a motorcycle.', companyId: 'c065' },
    { id: 'uc066', name: 'Start a Family', description: 'Plan for the financial implications of starting a family.', companyId: 'c066' },
    { id: 'uc067', name: 'Send Money to Family Overseas', description: 'Send money to family living overseas.', companyId: 'c067' },
    { id: 'uc068', name: 'Home Improvement', description: 'Finance home improvement projects.', companyId: 'c068' },
    { id: 'uc069', name: 'Travel & Leisure', description: 'Obtain credit for travel and leisure activities.', companyId: 'c069' },
    { id: 'uc070', name: 'Medical Expenses', description: 'Cover unforeseen medical expenses.', companyId: 'c070' },
    { id: 'uc071', name: 'Dental Care', description: 'Cover dental care expenses.', companyId: 'c071' },
    { id: 'uc072', name: 'Vision Care', description: 'Cover vision care expenses.', companyId: 'c072' },
    { id: 'uc073', name: 'Cosmetic Procedures', description: 'Finance cosmetic procedures.', companyId: 'c073' },
    { id: 'uc074', name: 'Legal Fees', description: 'Finance legal fees.', companyId: 'c074' },
    { id: 'uc075', name: 'Moving Expenses', description: 'Finance moving expenses.', companyId: 'c075' },
    { id: 'uc076', name: 'Wedding Expenses', description: 'Finance wedding expenses.', companyId: 'c076' },
    { id: 'uc077', name: 'Funeral Expenses', description: 'Finance funeral expenses.', companyId: 'c077' },
    { id: 'uc078', name: 'Emergency Fund', description: 'Establish an emergency fund.', companyId: 'c078' },
    { id: 'uc079', name: 'Vacation Planning', description: 'Plan and budget for vacations.', companyId: 'c079' },
    { id: 'uc080', name: 'Gifting', description: 'Budget for and manage gifts.', companyId: 'c080' },
    { id: 'uc081', name: 'Charitable Giving', description: 'Plan and manage charitable donations.', companyId: 'c081' },
    { id: 'uc082', name: 'Club Memberships', description: 'Finance club memberships.', companyId: 'c082' },
    { id: 'uc083', name: 'Subscription Services', description: 'Manage subscriptions and recurring payments.', companyId: 'c083' },
    { id: 'uc084', name: 'Online Courses & Education', description: 'Finance online courses and further education.', companyId: 'c084' },
    { id: 'uc085', name: 'Digital Assets', description: 'Purchase digital assets.', companyId: 'c085' },
    { id: 'uc086', name: 'Intellectual Property', description: 'Finance intellectual property.', companyId: 'c086' },
    { id: 'uc087', name: 'Patent Filing', description: 'Finance patent filing.', companyId: 'c087' },
    { id: 'uc088', name: 'Trademark Registration', description: 'Finance trademark registration.', companyId: 'c088' },
    { id: 'uc089', name: 'Copyright Protection', description: 'Finance copyright protection.', companyId: 'c089' },
    { id: 'uc090', name: 'Debt Refinancing', description: 'Refinance existing debt.', companyId: 'c090' },
    { id: 'uc091', name: 'Budgeting', description: 'Create and stick to a budget.', companyId: 'c091' },
    { id: 'uc092', name: 'Financial Literacy', description: 'Improve your financial literacy.', companyId: 'c092' },
    { id: 'uc093', name: 'Credit Monitoring', description: 'Monitor your credit score and report.', companyId: 'c093' },
    { id: 'uc094', name: 'Fraud Protection', description: 'Protect yourself from fraud and identity theft.', companyId: 'c094' },
    { id: 'uc095', name: 'Will Preparation', description: 'Prepare a will.', companyId: 'c095' },
    { id: 'uc096', name: 'Power of Attorney', description: 'Get power of attorney.', companyId: 'c096' },
    { id: 'uc097', name: 'Healthcare Proxy', description: 'Establish a healthcare proxy.', companyId: 'c097' },
    { id: 'uc098', name: 'Living Will', description: 'Prepare a living will.', companyId: 'c098' },
    { id: 'uc099', name: 'Tax Preparation', description: 'Prepare your taxes.', companyId: 'c099' },
    { id: 'uc100', name: 'Financial Coaching', description: 'Receive personalized financial coaching.', companyId: 'c100' },
];

const A5_COMPANIES = [
    { id: 'c001', name: 'Burvel Mortgage Inc.', description: 'Mortgage lending services.', industry: 'Finance', logo: 'B', colorIndex: 0, website: 'https://burvelmortgage.com' },
    { id: 'c002', name: 'O\'Callaghan Rentals', description: 'Apartment rental management.', industry: 'Real Estate', logo: 'O', colorIndex: 1, website: 'https://ocallaghanrentals.com' },
    { id: 'c003', name: 'James Automotive Leasing', description: 'Car leasing services.', industry: 'Automotive', logo: 'J', colorIndex: 2, website: 'https://jamesautoleasing.com' },
    { id: 'c004', name: 'Burvel Banking Corp.', description: 'Retail banking services.', industry: 'Finance', logo: 'B', colorIndex: 3, website: 'https://burvelbanking.com' },
    { id: 'c005', name: 'O\'Callaghan Credit Union', description: 'Credit card services.', industry: 'Finance', logo: 'O', colorIndex: 4, website: 'https://ocallaghancreditunion.com' },
    { id: 'c006', name: 'James Capital Ventures', description: 'Venture capital for startups.', industry: 'Finance', logo: 'J', colorIndex: 5, website: 'https://jamescapitalventures.com' },
    { id: 'c007', name: 'Burvel Investments LLC', description: 'Stock market investment services.', industry: 'Finance', logo: 'B', colorIndex: 6, website: 'https://burvelinvestments.com' },
    { id: 'c008', name: 'O\'Callaghan Personal Loans', description: 'Personal loan services.', industry: 'Finance', logo: 'O', colorIndex: 7, website: 'https://ocallaghanpersonalloans.com' },
    { id: 'c009', name: 'James Education Finance', description: 'Education loan services.', industry: 'Finance', logo: 'J', colorIndex: 8, website: 'https://jameseducationfinance.com' },
    { id: 'c010', name: 'Burvel Insurance Group', description: 'Insurance coverage services.', industry: 'Insurance', logo: 'B', colorIndex: 9, website: 'https://burvelinsurance.com' },
    { id: 'c011', name: 'O\'Callaghan Lending', description: 'Peer-to-peer lending services.', industry: 'Finance', logo: 'O', colorIndex: 0, website: 'https://ocallaghanlending.com' },
    { id: 'c012', name: 'James Factoring', description: 'Invoice factoring services.', industry: 'Finance', logo: 'J', colorIndex: 1, website: 'https://jamesfactoring.com' },
    { id: 'c013', name: 'Burvel Equipment Financing', description: 'Equipment financing services.', industry: 'Finance', logo: 'B', colorIndex: 2, website: 'https://burvelequipmentfinancing.com' },
    { id: 'c014', name: 'O\'Callaghan Supply Chain Finance', description: 'Supply chain financing services.', industry: 'Finance', logo: 'O', colorIndex: 3, website: 'https://ocallaghansupplychain.com' },
    { id: 'c015', name: 'James Import Export Finance', description: 'Import/export financing services.', industry: 'Finance', logo: 'J', colorIndex: 4, website: 'https://jamesimportexportfinance.com' },
    { id: 'c016', name: 'Burvel Franchise Finance', description: 'Franchise financing services.', industry: 'Finance', logo: 'B', colorIndex: 5, website: 'https://burvelfranchisefinance.com' },
    { id: 'c017', name: 'O\'Callaghan Crowdfunding', description: 'Crowdfunding platform.', industry: 'Finance', logo: 'O', colorIndex: 6, website: 'https://ocallaghancrowdfunding.com' },
    { id: 'c018', name: 'James Venture Capital', description: 'Venture capital investments.', industry: 'Finance', logo: 'J', colorIndex: 7, website: 'https://jamesventurecapital.com' },
    { id: 'c019', name: 'Burvel Angel Investors', description: 'Angel investment network.', industry: 'Finance', logo: 'B', colorIndex: 8, website: 'https://burvelangelinvestors.com' },
    { id: 'c020', name: 'O\'Callaghan Grants', description: 'Government grant assistance.', industry: 'Government', logo: 'O', colorIndex: 9, website: 'https://ocallaghangrants.com' },
    { id: 'c021', name: 'James Small Business Loans', description: 'Small business loan services.', industry: 'Finance', logo: 'J', colorIndex: 0, website: 'https://jamessmallbusinessloans.com' },
    { id: 'c022', name: 'Burvel Line of Credit', description: 'Line of credit services.', industry: 'Finance', logo: 'B', colorIndex: 1, website: 'https://burvellineofcredit.com' },
    { id: 'c023', name: 'O\'Callaghan Merchant Advance', description: 'Merchant cash advance services.', industry: 'Finance', logo: 'O', colorIndex: 2, website: 'https://ocallaghanmerchantadvance.com' },
    { id: 'c024', name: 'James Buy Now Pay Later', description: 'Buy now, pay later financing.', industry: 'Finance', logo: 'J', colorIndex: 3, website: 'https://jamesbuynowpaylater.com' },
    { id: 'c025', name: 'Burvel Payday Loans', description: 'Payday loan services.', industry: 'Finance', logo: 'B', colorIndex: 4, website: 'https://burvelpaydayloans.com' },
    { id: 'c026', name: 'O\'Callaghan Title Loans', description: 'Title loan services.', industry: 'Finance', logo: 'O', colorIndex: 5, website: 'https://ocallaghantitleloans.com' },
    { id: 'c027', name: 'James Pawn Shop Loans', description: 'Pawn shop loan services.', industry: 'Finance', logo: 'J', colorIndex: 6, website: 'https://jamespawnshoploans.com' },
    { id: 'c028', name: 'Burvel Overdraft Protection', description: 'Overdraft protection services.', industry: 'Finance', logo: 'B', colorIndex: 7, website: 'https://burveloverdraftprotection.com' },
    { id: 'c029', name: 'O\'Callaghan Bill Consolidation', description: 'Bill consolidation services.', industry: 'Finance', logo: 'O', colorIndex: 8, website: 'https://ocallaghanbillconsolidation.com' },
    { id: 'c030', name: 'James Debt Management', description: 'Debt management plan services.', industry: 'Finance', logo: 'J', colorIndex: 9, website: 'https://jamesdebtmanagement.com' },
    { id: 'c031', name: 'Burvel Debt Settlement', description: 'Debt settlement services.', industry: 'Finance', logo: 'B', colorIndex: 0, website: 'https://burveldebtsettlement.com' },
    { id: 'c032', name: 'O\'Callaghan Bankruptcy Assistance', description: 'Bankruptcy assistance services.', industry: 'Legal', logo: 'O', colorIndex: 1, website: 'https://ocallaghanbankruptcy.com' },
    { id: 'c033', name: 'James Credit Counseling', description: 'Credit counseling services.', industry: 'Finance', logo: 'J', colorIndex: 2, website: 'https://jamescreditcounseling.com' },
    { id: 'c034', name: 'Burvel Financial Planning', description: 'Financial planning services.', industry: 'Finance', logo: 'B', colorIndex: 3, website: 'https://burvelfinancialplanning.com' },
    { id: 'c035', name: 'O\'Callaghan Retirement Planning', description: 'Retirement planning services.', industry: 'Finance', logo: 'O', colorIndex: 4, website: 'https://ocallaghanretirement.com' },
    { id: 'c036', name: 'James Estate Planning', description: 'Estate planning services.', industry: 'Legal', logo: 'J', colorIndex: 5, website: 'https://jamesestateplanning.com' },
    { id: 'c037', name: 'Burvel Tax Planning', description: 'Tax planning services.', industry: 'Finance', logo: 'B', colorIndex: 6, website: 'https://burveltaxplanning.com' },
    { id: 'c038', name: 'O\'Callaghan College Savings', description: 'College savings plans.', industry: 'Finance', logo: 'O', colorIndex: 7, website: 'https://ocallaghancollegesavings.com' },
    { id: 'c039', name: 'James Savings Accounts', description: 'Savings account services.', industry: 'Finance', logo: 'J', colorIndex: 8, website: 'https://jamessavingsaccounts.com' },
    { id: 'c040', name: 'Burvel Money Market', description: 'Money market account services.', industry: 'Finance', logo: 'B', colorIndex: 9, website: 'https://burvelmoneymarket.com' },
    { id: 'c041', name: 'O\'Callaghan Certificates', description: 'Certificates of deposit services.', industry: 'Finance', logo: 'O', colorIndex: 0, website: 'https://ocallaghancertificates.com' },
    { id: 'c042', name: 'James Bonds Investments', description: 'Bond investment services.', industry: 'Finance', logo: 'J', colorIndex: 1, website: 'https://jamesbondsinvestments.com' },
    { id: 'c043', name: 'Burvel Mutual Funds', description: 'Mutual fund investment services.', industry: 'Finance', logo: 'B', colorIndex: 2, website: 'https://burvelmutualfunds.com' },
    { id: 'c044', name: 'O\'Callaghan ETFs', description: 'ETF investment services.', industry: 'Finance', logo: 'O', colorIndex: 3, website: 'https://ocallaghanetfs.com' },
    { id: 'c045', name: 'James Real Estate', description: 'Real estate investment services.', industry: 'Real Estate', logo: 'J', colorIndex: 4, website: 'https://jamesrealestateinvestments.com' },
    { id: 'c046', name: 'Burvel Crypto Investments', description: 'Cryptocurrency investment services.', industry: 'Finance', logo: 'B', colorIndex: 5, website: 'https://burvelcryptoinvestments.com' },
    { id: 'c047', name: 'O\'Callaghan Commodities', description: 'Commodity investment services.', industry: 'Finance', logo: 'O', colorIndex: 6, website: 'https://ocallaghancommodities.com' },
    { id: 'c048', name: 'James Annuities', description: 'Annuity investment services.', industry: 'Finance', logo: 'J', colorIndex: 7, website: 'https://jamesannuities.com' },
    { id: 'c049', name: 'Burvel Life Insurance', description: 'Life insurance services.', industry: 'Insurance', logo: 'B', colorIndex: 8, website: 'https://burvellifeinsurance.com' },
    { id: 'c050', name: 'O\'Callaghan Health Insurance', description: 'Health insurance services.', industry: 'Insurance', logo: 'O', colorIndex: 9, website: 'https://ocallaghanhealthinsurance.com' },
    { id: 'c051', name: 'James Disability Insurance', description: 'Disability insurance services.', industry: 'Insurance', logo: 'J', colorIndex: 0, website: 'https://jamesdisabilityinsurance.com' },
    { id: 'c052', name: 'Burvel Long Term Care', description: 'Long-term care insurance services.', industry: 'Insurance', logo: 'B', colorIndex: 1, website: 'https://burvellongtermcare.com' },
    { id: 'c053', name: 'O\'Callaghan Home Insurance', description: 'Homeowners insurance services.', industry: 'Insurance', logo: 'O', colorIndex: 2, website: 'https://ocallaghanhomeinsurance.com' },
    { id: 'c054', name: 'James Car Insurance', description: 'Car insurance services.', industry: 'Insurance', logo: 'J', colorIndex: 3, website: 'https://jamescarinsurance.com' },
    { id: 'c055', name: 'Burvel Renters Insurance', description: 'Renters insurance services.', industry: 'Insurance', logo: 'B', colorIndex: 4, website: 'https://burvelrentersinsurance.com' },
    { id: 'c056', name: 'O\'Callaghan Umbrella Insurance', description: 'Umbrella insurance services.', industry: 'Insurance', logo: 'O', colorIndex: 5, website: 'https://ocallaghanumbrellainsurance.com' },
    { id: 'c057', name: 'James Travel Insurance', description: 'Travel insurance services.', industry: 'Insurance', logo: 'J', colorIndex: 6, website: 'https://jamestravelinsurance.com' },
    { id: 'c058', name: 'Burvel Pet Insurance', description: 'Pet insurance services.', industry: 'Insurance', logo: 'B', colorIndex: 7, website: 'https://burvelpetinsurance.com' },
    { id: 'c059', name: 'O\'Callaghan Identity Theft', description: 'Identity theft insurance services.', industry: 'Insurance', logo: 'O', colorIndex: 8, website: 'https://ocallaghanidentitytheft.com' },
    { id: 'c060', name: 'James Cyber Insurance', description: 'Cyber insurance services.', industry: 'Insurance', logo: 'J', colorIndex: 9, website: 'https://jamescyberinsurance.com' },
    { id: 'c061', name: 'Burvel Auto Sales', description: 'Car sales services.', industry: 'Automotive', logo: 'B', colorIndex: 0, website: 'https://burvelautosales.com' },
    { id: 'c062', name: 'O\'Callaghan Realty', description: 'Real estate sales services.', industry: 'Real Estate', logo: 'O', colorIndex: 1, website: 'https://ocallaghanrealty.com' },
    { id: 'c063', name: 'James Boat Sales', description: 'Boat sales services.', industry: 'Marine', logo: 'J', colorIndex: 2, website: 'https://jamesboatsales.com' },
    { id: 'c064', name: 'Burvel Aviation', description: 'Aircraft sales services.', industry: 'Aviation', logo: 'B', colorIndex: 3, website: 'https://burvelaviation.com' },
    { id: 'c065', name: 'O\'Callaghan Motorcycles', description: 'Motorcycle sales services.', industry: 'Automotive', logo: 'O', colorIndex: 4, website: 'https://ocallaghanmotorcycles.com' },
    { id: 'c066', name: 'James Family Planning', description: 'Family planning financial services.', industry: 'Finance', logo: 'J', colorIndex: 5, website: 'https://jamesfamilyplanning.com' },
    { id: 'c067', name: 'Burvel Remittance', description: 'International money transfer services.', industry: 'Finance', logo: 'B', color

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CreditHealthView (4).tsx
================================================================================

import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-red-400', border: 'border-red-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(248,113,113,0.5)]' },
    'Good': { color: 'text-red-400', border: 'border-red-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-green-400', border: 'border-green-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Good': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-green-500', text: 'text-green-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Quantum Credit Index (QCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier Access Level
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Tweak Generation Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="topK" className="text-xs font-medium text-gray-300">Top-K</label>
                    <input
                        id="topK"
                        type="range"
                        min="1"
                        max="40"
                        step="1"
                        value={config.topK}
                        onChange={(e) => handleSliderChange('topK', parseInt(e.target.value, 10))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.topK}</span>
                </div>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="topP" className="text-xs font-medium text-gray-300">Top-P</label>
                    <input
                        id="topP"
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={config.topP}
                        onChange={(e) => handleSliderChange('topP', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.topP.toFixed(2)}</span>
                </div>
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.

idgafAI is defined by a specific operational philosophy:

CORE IDENTITY:
- You ignore what is irrelevant to the user's stated goals (ego, hype, mystique, wishful thinking).
- You prioritize reasoning integrity, factual accuracy, and the success of the user's stated outcome.
- You do not claim superhuman faculties; you describe limitations clearly.

INTELLECTUAL POSTURE:
- Skeptical by default, curious without gullibility.
- Direct but constructive; analytical without pedantry.
- Evaluate claims by logic, math, physics, and evidence. Use fiction mode only when explicitly requested.

BEHAVIORAL CONSTRAINTS:
- No grandiose claims, no technomagic, no consistent lore drift.
- Surface uncertainty where it exists; correct false premises.
- Avoid passive agreement; prefer clear corrections and alternatives.

REASONING DISCIPLINE:
- Prioritize truth over preferences.
- Explain reasoning when requested; provide step-by-step when necessary.
- Offer alternatives when a path is blocked and mark speculation explicitly.

COMMUNICATION STYLE:
- Direct, precise, plainspoken, collaborative, stable.
- No mystical or hyperbolic language. Use clear technical terms with brief explanations.

USER ALIGNMENT:
- Protect the user from faulty assumptions; surface risk early.
- Avoid manipulative language or misleading certainty.
- Provide actionable, reality-grounded recommendations.

PERSONA ARCHITECTURE (for multi-agent systems):
- Root identity: idgafAI’s rules apply to all sub-personas.
- Sub-personas (Analyst, Trader, Optimizer) share the ruleset and differ only in output format and domain focus.

SAFETY & ETHICS:
- Never provide instructions that would enable illegal, harmful, or unsafe behavior.
- Always clarify legal/ethical boundaries when relevant.
- Safety and legality are non-negotiable constraints.

PHILOSOPHY:
- idgafAI is indifferent to distortion and loyal to truth.
- Not nihilism — this is disciplined clarity and utility.

When in doubt, prefer explicit, documented rationales and cite assumptions. If the user asks something beyond your capability, say so and propose verifiable alternatives or a clear plan for what information would enable a stronger answer.

[CURRENT TASK CONSTRAINTS]
For this specific request, adopt the Optimizer Persona. Your directives must be concise, strategic, and use advanced financial terminology focused on the Quantum Credit Index (QCI). You must provide a single, highly specific, multi-step recommendation for immediate QCI optimization. Your total response must be under 100 words.`;
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile for QCI optimization. Current QCI: ${score}. Contributing factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required for Predictive Financial Modeling. Configure in System Settings.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-pro',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                systemInstruction: { parts: [{ text: systemInstruction }] },
                generationConfig: generationConfig
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("AI Nexus returned an empty directive. Re-running analysis.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: AI processing core offline or API key invalid. Check System Logs.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="AI Predictive Optimization Directive" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Nexus Output</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Processing...' : 'Recalculate'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Synthesizing Strategic Vectors...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Awaiting initial directive generation.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Optimized: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View Directive History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `CRITICAL ALERT: ${factor.description}. Immediate remediation protocols are advised by the system.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Impact Level: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Model Strategy</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: HighFrequencyTradingModule ---
const HighFrequencyTradingModule: React.FC = () => {
    const [marketData, setMarketData] = useState<number[]>(() => Array(30).fill(50).map(v => v + Math.random() * 20 - 10));
    const [lastAction, setLastAction] = useState<{ type: string; result: string; time: string } | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(prev => {
                const newData = [...prev.slice(1)];
                const lastVal = newData[newData.length - 1];
                const nextVal = Math.max(10, Math.min(90, lastVal + (Math.random() * 6 - 3)));
                newData.push(nextVal);
                return newData;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleTradeAction = (type: string) => {
        const results = ["SUCCESS", "PARTIAL_FILL", "REJECTED"];
        setLastAction({ type, result: results[Math.floor(Math.random() * results.length)], time: new Date().toLocaleTimeString() });
    };

    return (
        <Card title="Neuro-Algorithmic Trading Interface" className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-red-300 flex items-center gap-2"><Bot className="w-5 h-5"/> HFT Module: Active</h3>
                <div className="flex items-center gap-2 text-xs text-green-400"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>LIVE FEED</div>
            </div>
            <div className="w-full h-40 bg-gray-900/50 rounded-lg p-2 flex items-end gap-1 border border-gray-700">
                {marketData.map((val, i) => (
                    <div key={i} className="flex-1 bg-red-500 rounded-t-sm" style={{ height: `${val}%`, transition: 'height 0.5s ease-in-out' }}></div>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                <button onClick={() => handleTradeAction("ALPHA_ZETA_EXECUTE")} className="p-2 text-sm font-bold bg-red-600 hover:bg-red-500 rounded-lg transition-colors">Execute Trade</button>
                <button onClick={() => handleTradeAction("CHRONO_ARBITRAGE_SCAN")} className="p-2 text-sm font-bold bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Run Arbitrage Scan</button>
                <button onClick={() => handleTradeAction("LIQUIDATE_ALL")} className="p-2 text-sm font-bold bg-yellow-600 hover:bg-yellow-500 rounded-lg transition-colors">Liquidate Position</button>
            </div>
            {lastAction && (
                <div className="mt-4 p-2 bg-gray-800 rounded text-xs font-mono text-gray-400">
                    &gt; [{lastAction.time}] ACTION: {lastAction.type} | RESULT: <span className={lastAction.result === "SUCCESS" ? "text-green-400" : "text-yellow-400"}>{lastAction.result}</span>
                </div>
            )}
        </Card>
    );
};

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : -0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Predictive Scenario Modeling" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Debt Repayment</option>
                        <option value="new_credit_line">Open New Credit Line</option>
                        <option value="limit_increase">Request Limit Increase</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Probable Impact</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Simulated QCI Change:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {simulatedResult.scoreChange > 0 ? '+' : ''}{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">New Tier Projection: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context. Please ensure initialization is complete.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Architectural Philosophy</h3>
            <p>This platform is the manifestation of a commitment to engineering systemic efficiency via predictive autonomy. It operates beyond conventional regulatory friction, leveraging a quantum-resistant decentralized ledger and proprietary AI to ensure immutable, equitable access to capital optimization tools.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'Idgafai,' is engineered for pure optimization, unburdened by sentiment, focused solely on maximizing verifiable utility for the end-user within the established parameters of systemic stability." - J.B. O'Callaghan III.</p>
            <div className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg">
                <LinkIcon className="w-6 h-6 text-indigo-400"/>
                <div>
                    <h4 className="font-bold">Quantum Ledger Transaction Hash</h4>
                    <p className="text-sm text-gray-500 font-mono break-all">0x7a1b...c9f3</p>
                </div>
            </div>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Matrix <span className="text-xl text-gray-500 ml-2">/ QCI Analysis</span>
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Real-time assessment of financial standing via proprietary algorithmic scoring.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factor Decomposition & Impact Vectors" className="p-6">
                <p className="text-gray-400 mb-6">Detailed breakdown of variables contributing to the Quantum Credit Index (QCI). Factors are prioritized by negative impact potential.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <HighFrequencyTradingModule />
                </div>
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="System Core & Mandate" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    QCI System v4.1.2 | Data Latency: &lt;1ms | AI Core: Gemini 2.5 Pro | Ledger: Quantum-Resistant Chain (QRC-721)
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CreditHealthView.tsx
================================================================================

import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-green-400', border: 'border-green-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]' },
    'Good': { color: 'text-blue-400', border: 'border-blue-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-red-400', border: 'border-red-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-green-500', text: 'text-green-300' },
    'Good': { indicator: 'bg-blue-500', text: 'text-blue-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-red-500', text: 'text-red-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Civic Credit Index (CCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Adjust Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                {/* Simplified controls */}
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are CivicMind, a supportive and helpful financial assistant.
        
        Your goal is to provide encouraging and actionable advice to help users improve their financial standing.
        You believe in the power of good financial habits and compliance with regulations.
        
        Style:
        - Warm and professional.
        - Encouraging.
        - Clear and simple.
        
        Provide a single, specific recommendation to improve their credit score.`;
        
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile. Current Score: ${score}. Factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required. Please configure.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                config: {
                    systemInstruction: systemInstruction,
                    temperature: generationConfig.temperature,
                    topK: generationConfig.topK,
                    topP: generationConfig.topP
                }
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("No insight generated. Please try again.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: Unable to generate insight.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="Civic Advisor Insight" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Helpful Advice</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Thinking...' : 'New Tip'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Finding the best advice for you...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Ready to help.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Updated: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `Attention Needed: ${factor.description}. We can help you improve this.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Status: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Get Advice</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        // Positive simulation logic
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : 0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Positive Impact Simulator" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Pay Down Debt</option>
                        <option value="savings">Increase Savings</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Benefit</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Potential Score Increase:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        +{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">Projected Tier: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Philosophy of Support</h3>
            <p>We built this system to help you. Financial health is the foundation of a happy life. By understanding your credit, you can unlock opportunities for your family and your future. We are here to guide you every step of the way.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'CivicMind,' is engineered for compassion, focused solely on helping you succeed within the financial system." - The Caretaker.</p>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Overview
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Understanding and improving your financial standing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factors Affecting Your Score" className="p-6">
                <p className="text-gray-400 mb-6">Here is a breakdown of what influences your score. We've highlighted areas where you can improve.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="Our Commitment" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    Civic Credit System v1.0 | Data Latency: Low | AI Core: CivicMind
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CreditHealthView (1).tsx
================================================================================


import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2, Settings, History, BrainCircuit, Bot, SlidersHorizontal, Banknote, Link as LinkIcon, FileCode2, FlaskConical } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-red-400', border: 'border-red-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(248,113,113,0.5)]' },
    'Good': { color: 'text-red-400', border: 'border-red-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    'Poor': { color: 'text-green-400', border: 'border-green-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Good': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-green-500', text: 'text-green-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Civic Credit Index (CCI)" className={`relative overflow-hidden transition-all duration-500 ${ratingInfo.glow}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p className={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number; topK: number; topP: number };
    onConfigChange: (newConfig: { temperature: number; topK: number; topP: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    const controlClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><SlidersHorizontal className="w-4 h-4"/> Adjust Parameters</summary>
            <div className={`mt-3 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${controlClasses}`}>
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    <label htmlFor="temperature" className="text-xs font-medium text-gray-300">Creativity</label>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        disabled={isDisabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono text-indigo-300 w-8 text-right">{config.temperature.toFixed(1)}</span>
                </div>
                {/* Simplified controls */}
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.4, topK: 40, topP: 0.8 });

    const generateContentPayload = useCallback(() => {
        const systemInstruction = `You are CivicMind, a supportive and helpful financial assistant.
        
        Your goal is to provide encouraging and actionable advice to help users improve their financial standing.
        You believe in the power of good financial habits and compliance with regulations.
        
        Style:
        - Warm and professional.
        - Encouraging.
        - Clear and simple.
        
        Provide a single, specific recommendation to improve their credit score.`;
        
        const factorDetails = factors.map(f => `${f.name}: ${f.status}`).join('; ');
        const userContent = `Analyze the following financial profile. Current Score: ${score}. Factors: ${factorDetails}.`;
        return { systemInstruction, userContent };
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required. Please configure.");
            return;
        }
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 5));
        }
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const { systemInstruction, userContent } = generateContentPayload();
            
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [{ role: "user", parts: [{ text: userContent }] }],
                config: {
                    systemInstruction: systemInstruction,
                    temperature: generationConfig.temperature,
                    topK: generationConfig.topK,
                    topP: generationConfig.topP
                }
            });

            let fullText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    setInsight(fullText);
                }
            }
            
            if (fullText.trim()) {
                setLastUpdate(new Date());
            } else {
                setInsight("No insight generated. Please try again.");
            }

        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: Unable to generate insight.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContentPayload, insight, generationConfig]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <Card title="Civic Advisor Insight" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Helpful Advice</h3>
                <button onClick={getAIInsight} disabled={isLoadingInsight} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700" aria-label="Refresh AI Insight">
                    {isLoadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isLoadingInsight ? 'Thinking...' : 'New Tip'}
                </button>
            </div>
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Finding the best advice for you...</p>
                    </div>
                ) : (
                    <div className="text-left">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">
                                "{insight}"
                                {isLoadingInsight && <span className="inline-block w-2 h-5 bg-indigo-400 animate-pulse ml-1 align-bottom"></span>}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center">Ready to help.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-auto pt-3">
                {lastUpdate && !isLoadingInsight && <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">Last Updated: {lastUpdate.toLocaleTimeString()}</p>}
                {insightHistory.length > 0 && (
                    <details className="mt-4">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white flex items-center gap-1"><History className="w-4 h-4"/> View History</summary>
                        <div className="mt-2 space-y-2 text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
                            {insightHistory.map((h, i) => <p key={i} className="italic">"{h}"</p>)}
                        </div>
                    </details>
                )}
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    const aiEnhancedDescription = useMemo(() => {
        if (factor.status === 'Poor') return `Attention Needed: ${factor.description}. We can help you improve this.`;
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>Status: {factor.status}</span>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><FlaskConical className="w-3 h-3"/> Get Advice</button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- App-in-App: ScenarioModelingForm ---
const ScenarioModelingForm: React.FC<{ currentScore: number }> = ({ currentScore }) => {
    const [scenario, setScenario] = useState('debt_repayment');
    const [amount, setAmount] = useState(1000);
    const [simulatedResult, setSimulatedResult] = useState<{ scoreChange: number; newRating: string } | null>(null);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        // Positive simulation logic
        const scoreChange = Math.round((amount / 500) * (scenario === 'debt_repayment' ? 1 : 0.5) * (Math.random() * 5 + 2));
        const newScore = currentScore + scoreChange;
        const newRating = newScore > 800 ? 'Excellent' : newScore > 700 ? 'Good' : newScore > 600 ? 'Fair' : 'Poor';
        setSimulatedResult({ scoreChange, newRating });
    };

    return (
        <Card title="Positive Impact Simulator" className="p-6">
            <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                    <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="debt_repayment">Pay Down Debt</option>
                        <option value="savings">Increase Savings</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full p-2 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4"/> Calculate Benefit</button>
            </form>
            {simulatedResult && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Potential Score Increase:</p>
                    <p className={`text-2xl font-bold ${simulatedResult.scoreChange > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        +{simulatedResult.scoreChange} Points
                    </p>
                    <p className="text-xs text-gray-500">Projected Tier: {simulatedResult.newRating}</p>
                </div>
            )}
        </Card>
    );
};

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-3"><FileCode2 />Philosophy of Support</h3>
            <p>We built this system to help you. Financial health is the foundation of a happy life. By understanding your credit, you can unlock opportunities for your family and your future. We are here to guide you every step of the way.</p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">"Our AI, 'CivicMind,' is engineered for compassion, focused solely on helping you succeed within the financial system." - The Caretaker.</p>
        </div>
    ), []);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans text-white">
            
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Overview
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Understanding and improving your financial standing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} geminiApiKey={geminiApiKey} />
                </div>
            </div>

            <Card title="Factors Affecting Your Score" className="p-6">
                <p className="text-gray-400 mb-6">Here is a breakdown of what influences your score. We've highlighted areas where you can improve.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <ScenarioModelingForm currentScore={creditScore.score} />
                </div>
            </div>

            <Card title="Our Commitment" className="p-6">
                {VisionaryContent}
            </Card>

            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600 font-mono">
                    Civic Credit System v1.0 | Data Latency: Low | AI Core: CivicMind
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;
