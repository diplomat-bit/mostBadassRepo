// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/QuantumOracleView.tsx.md
================================================================================

```typescript
import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { ArrowRight, BrainCircuit, ChevronDown, Download, Eye, FileText, FlaskConical, HelpCircle, Info, Lightbulb, Loader2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, differenceInMonths, parseISO } from 'date-fns';

// --- TYPE DEFINITIONS ---
// Represents a comprehensive snapshot of a user's financial state
interface FinancialState {
  netWorth: number;
  liquidAssets: number;
  investedAssets: number;
  totalDebt: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  accounts: Account[];
  goals: Goal[];
  timestamp: string;
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit_card' | 'loan';
  balance: number;
  apy?: number; // Annual Percentage Yield for savings/investments
  apr?: number; // Annual Percentage Rate for debts
}

interface Goal {
  id: string;
  name:string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
}

// Defines a "what-if" scenario to be simulated
interface Scenario {
  id: string;
  name: string;
  description: string;
  perturbations: Perturbation[];
}

interface Perturbation {
  type: 'INCOME_CHANGE' | 'EXPENSE_CHANGE' | 'LUMP_SUM' | 'MARKET_EVENT' | 'GOAL_CHANGE';
  amount: number; // Can be percentage or absolute value
  startDate: string;
  durationMonths: number; // 0 for permanent, >0 for temporary
  details?: Record<string, any>;
}

// The output from a single simulation run
interface SimulationResult {
  scenarioId: string;
  projection: DataPoint[];
  narrativeSummary: string;
  keyImpacts: KeyImpact[];
  recommendations: Recommendation[];
  finalState: FinancialState;
}

interface DataPoint {
  date: string; // "YYYY-MM"
  netWorth: number;
  liquidAssets: number;
  investedAssets: number;
  totalDebt: number;
}

interface KeyImpact {
  id: string;
  date: string; // "YYYY-MM"
  title: string;
  description: string;
  severity: 'positive' | 'neutral' | 'negative' | 'critical';
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'SAVINGS' | 'INVESTING' | 'DEBT' | 'INCOME' | 'SPENDING';
  actionability: 'high' | 'medium' | 'low';
}

type SimulationStatus = 'idle' | 'loading' | 'success' | 'error';

// --- MOCK API SERVICES & DATA ---

// Simulates fetching the user's current financial state
const mockFinancialApiService = {
  fetchCurrentState: async (): Promise<FinancialState> => {
    await new Promise(res => setTimeout(res, 800)); // Simulate network delay
    return {
      netWorth: 150000,
      liquidAssets: 25000,
      investedAssets: 150000,
      totalDebt: 25000,
      monthlyIncome: 8000,
      monthlyExpenses: 5000,
      timestamp: new Date().toISOString(),
      accounts: [
        { id: 'acc1', name: 'Primary Checking', type: 'checking', balance: 5000 },
        { id: 'acc2', name: 'High-Yield Savings', type: 'savings', balance: 20000, apy: 0.045 },
        { id: 'acc3', name: '401(k) Retirement', type: 'investment', balance: 120000 },
        { id: 'acc4', name: 'Brokerage Account', type: 'investment', balance: 30000 },
        { id: 'acc5', name: 'Venture Visa', type: 'credit_card', balance: -5000, apr: 0.22 },
        { id: 'acc6', name: 'Auto Loan', type: 'loan', balance: -20000, apr: 0.05 },
      ],
      goals: [
        { id: 'goal1', name: 'Buy a House', targetAmount: 100000, currentAmount: 20000, targetDate: '2028-12-01', priority: 'high' },
        { id: 'goal2', name: 'European Vacation', targetAmount: 10000, currentAmount: 3000, targetDate: '2025-06-01', priority: 'medium' },
      ],
    };
  }
};

// This is the core simulation engine logic, mocked as a service
const mockSimulationService = {
  runProjection: async (initialState: FinancialState, scenario: Scenario, baseline: DataPoint[]): Promise<SimulationResult> => {
    console.log(`Engaging Oracle for scenario: ${scenario.name}`);
    await new Promise(res => setTimeout(res, 2500)); // Simulate complex computation

    const projection: DataPoint[] = [];
    let currentState = JSON.parse(JSON.stringify(initialState));
    const projectionYears = 10;
    const projectionMonths = projectionYears * 12;

    for (let i = 0; i < projectionMonths; i++) {
        const currentDate = addMonths(new Date(), i);
        let currentIncome = currentState.monthlyIncome;
        let currentExpenses = currentState.monthlyExpenses;
        let marketReturn = 0.07 / 12; // Average monthly market return

        // Apply perturbations
        scenario.perturbations.forEach(p => {
            const pStartDate = parseISO(p.startDate);
            const monthsIntoScenario = differenceInMonths(currentDate, pStartDate);
            if (monthsIntoScenario >= 0 && monthsIntoScenario < p.durationMonths) {
                switch(p.type) {
                    case 'INCOME_CHANGE':
                        currentIncome += p.amount;
                        break;
                    case 'EXPENSE_CHANGE':
                        currentExpenses += p.amount;
                        break;
                    case 'MARKET_EVENT':
                        marketReturn = p.amount / 12;
                        break;
                }
            }
        });

        // Simple financial model
        const netMonthlyFlow = currentIncome - currentExpenses;
        currentState.liquidAssets += netMonthlyFlow;
        currentState.investedAssets *= (1 + marketReturn);
        currentState.totalDebt *= (1 + (0.05 / 12)); // Average debt interest
        currentState.netWorth = currentState.liquidAssets + currentState.investedAssets - Math.abs(currentState.totalDebt);

        projection.push({
            date: format(currentDate, 'yyyy-MM'),
            netWorth: Math.round(currentState.netWorth),
            liquidAssets: Math.round(currentState.liquidAssets),
            investedAssets: Math.round(currentState.investedAssets),
            totalDebt: Math.round(currentState.totalDebt),
        });
    }

    // A simple logic to generate mock insights
    const finalState = projection[projection.length - 1];
    const baseFinalState = baseline[baseline.length - 1];
    const netWorthImpact = finalState.netWorth - baseFinalState.netWorth;

    return {
        scenarioId: scenario.id,
        projection,
        finalState: { ...initialState, netWorth: finalState.netWorth, liquidAssets: finalState.liquidAssets, investedAssets: finalState.investedAssets, totalDebt: finalState.totalDebt, timestamp: new Date().toISOString() },
        narrativeSummary: `In the timeline shaped by "${scenario.name}", your financial trajectory shifts significantly. Over the next ${projectionYears} years, your net worth is projected to reach approximately $${finalState.netWorth.toLocaleString()}, a change of $${netWorthImpact.toLocaleString()} compared to your current path. The initial phase will test your financial resilience, but strategic adjustments could mitigate long-term impacts and open new avenues for growth.`,
        keyImpacts: [
            { id: 'ki1', date: scenario.perturbations[0].startDate, title: `Scenario Begins: ${scenario.name}`, description: 'The "what-if" event occurs, marking the divergence from your baseline future.', severity: 'neutral' },
            { id: 'ki2', date: format(addMonths(new Date(), 24), 'yyyy-MM'), title: 'Projected Recovery Point', description: 'After an initial period of adjustment, your finances begin to stabilize and show signs of recovery.', severity: 'positive' },
            { id: 'ki3', date: format(addMonths(new Date(), 60), 'yyyy-MM'), title: 'Goal Achievement Impact', description: `Your goal to 'Buy a House' is now projected to be delayed by approximately ${netWorthImpact < 0 ? 18 : -6} months.`, severity: netWorthImpact < 0 ? 'negative' : 'positive' },
        ],
        recommendations: [
            { id: 'rec1', title: 'Bolster Emergency Fund', description: `This scenario highlights a potential strain on your liquid assets. Consider increasing your emergency fund to cover 6 months of expenses, which is approximately $${(initialState.monthlyExpenses * 6).toLocaleString()}.`, category: 'SAVINGS', actionability: 'high' },
            { id: 'rec2', title: 'Review Investment Allocation', description: 'Given the market volatility in this simulation, a portfolio review is advisable. Ensure your risk tolerance aligns with your long-term goals.', category: 'INVESTING', actionability: 'medium' },
            { id: 'rec3', title: 'Explore Income Diversification', description: 'To build resilience against income shocks like the one simulated, research potential side hustles or freelance opportunities in your field.', category: 'INCOME', actionability: 'low' },
        ],
    };
  }
};

const PRESET_SCENARIOS: Scenario[] = [
  { id: 's1', name: 'Aggressive Market Downturn', description: 'Simulate a 30% drop in investments over 6 months, followed by a slow recovery.', perturbations: [{ type: 'MARKET_EVENT', amount: -0.6, startDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'), durationMonths: 12 }] },
  { id: 's2', name: 'Major Career Promotion', description: 'A significant salary increase of $40,000 annually.', perturbations: [{ type: 'INCOME_CHANGE', amount: 40000 / 12, startDate: format(addMonths(new Date(), 3), 'yyyy-MM-dd'), durationMonths: 999 }] },
  { id: 's3', name: 'Temporary Job Loss', description: 'Lose primary income for 6 months, relying on liquid assets.', perturbations: [{ type: 'INCOME_CHANGE', amount: -8000, startDate: format(addMonths(new Date(), 2), 'yyyy-MM-dd'), durationMonths: 6 }] },
  { id: 's4', name: 'Large Unexpected Expense', description: 'A one-time major expense, such as a home repair, costing $15,000.', perturbations: [{ type: 'EXPENSE_CHANGE', amount: 15000, startDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'), durationMonths: 1 }] },
];


// --- UTILITY & UI COMPONENTS ---

const OracleCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg shadow-xl shadow-cyan-900/20 p-6 ${className}`}>
        {children}
    </div>
);

const OracleButton = ({ children, onClick, icon, isLoading = false, disabled = false }: { children: React.ReactNode, onClick: () => void, icon?: React.ReactNode, isLoading?: boolean, disabled?: boolean }) => (
    <button
        onClick={onClick}
        disabled={isLoading || disabled}
        className="group relative inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-cyan-300 transition-all duration-300 bg-gray-800 rounded-md hover:bg-cyan-900/50 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
    >
        <span className="absolute top-0 left-0 w-full h-full transition-all duration-300 opacity-20 group-hover:opacity-50 group-active:opacity-70 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md filter blur-sm"></span>
        <span className="relative flex items-center gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
            {children}
        </span>
    </button>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-gray-800/80 backdrop-blur-sm border border-cyan-700 rounded-lg text-white">
                <p className="label font-bold text-cyan-400">{`Date: ${format(parseISO(label + '-01'), 'MMM yyyy')}`}</p>
                {payload.map((pld: any) => (
                     <p key={pld.name} style={{ color: pld.color }}>
                        {`${pld.name}: $${pld.value.toLocaleString()}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- CORE UI SUB-COMPONENTS ---

const ScenarioBuilder = ({ onSimulate, isLoading }: { onSimulate: (scenario: Scenario) => void, isLoading: boolean }) => {
    const [selectedScenario, setSelectedScenario] = useState<Scenario>(PRESET_SCENARIOS[0]);

    return (
        <OracleCard>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <FlaskConical className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white tracking-wider">The Oracle's Chamber</h2>
                </div>
                <p className="text-gray-400 text-sm">
                    Pose a "what if" to the fabric of your financial reality. Choose a potential future, and the Oracle will weave its possibilities.
                </p>
                <div className="relative">
                    <select
                        value={selectedScenario.id}
                        onChange={(e) => setSelectedScenario(PRESET_SCENARIOS.find(s => s.id === e.target.value)!)}
                        className="w-full bg-gray-800/80 border border-cyan-700/50 rounded-md px-4 py-2 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        {PRESET_SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 h-8">{selectedScenario.description}</p>
                <div className="flex justify-end">
                    <OracleButton onClick={() => onSimulate(selectedScenario)} icon={<BrainCircuit className="w-4 h-4" />} isLoading={isLoading}>
                        Engage The Oracle
                    </OracleButton>
                </div>
            </div>
        </OracleCard>
    );
};

const SimulationResultsTabs = ({ result }: { result: SimulationResult }) => {
    const [activeTab, setActiveTab] = useState('narrative');

    const tabs = [
        { id: 'narrative', label: 'Narrative', icon: FileText },
        { id: 'charts', label: 'Projections', icon: Sparkles },
        { id: 'impacts', label: 'Key Impacts', icon: Eye },
        { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    ];
    
    const renderContent = () => {
        switch(activeTab) {
            case 'narrative': return <NarrativeView summary={result.narrativeSummary} />;
            case 'charts': return <ChartsView projection={result.projection} />;
            case 'impacts': return <ImpactsTimeline impacts={result.keyImpacts} />;
            case 'recommendations': return <RecommendationsPanel recommendations={result.recommendations} />;
            default: return null;
        }
    }
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex border-b border-cyan-500/20">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                            activeTab === tab.id
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex-grow p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const NarrativeView = ({ summary }: { summary: string }) => (
    <div className="prose prose-invert prose-p:text-gray-300">
        <p>{summary}</p>
    </div>
);

const ChartsView = ({ projection }: { projection: DataPoint[] }) => {
    const baseline = useContext(BaselineContext);

    const combinedData = useMemo(() => {
        return projection.map((p, i) => ({
            date: p.date,
            'Scenario Net Worth': p.netWorth,
            'Baseline Net Worth': baseline ? baseline[i]?.netWorth : 0,
        }));
    }, [projection, baseline]);

    return (
        <div className="h-[400px] w-full flex flex-col gap-4">
             <h3 className="text-lg font-semibold text-white">Net Worth Projection</h3>
            <ResponsiveContainer>
                <AreaChart data={combinedData}>
                    <defs>
                        <linearGradient id="colorScenario" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6b7280" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="date" tickFormatter={(tick) => format(parseISO(tick + '-01'), 'yyyy')} stroke="#6b7280" />
                    <YAxis tickFormatter={(value) => `$${(Number(value) / 1000)}k`} stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#9ca3af' }}/>
                    <Area type="monotone" dataKey="Baseline Net Worth" stroke="#6b7280" fillOpacity={1} fill="url(#colorBaseline)" />
                    <Area type="monotone" dataKey="Scenario Net Worth" stroke="#06b6d4" fillOpacity={1} fill="url(#colorScenario)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};


const ImpactsTimeline = ({ impacts }: { impacts: KeyImpact[] }) => {
    const severityStyles = {
        positive: "border-green-500/50 bg-green-900/20 text-green-300",
        neutral: "border-gray-500/50 bg-gray-900/20 text-gray-300",
        negative: "border-yellow-500/50 bg-yellow-900/20 text-yellow-300",
        critical: "border-red-500/50 bg-red-900/20 text-red-300",
    }
    return (
        <div className="space-y-6">
             <h3 className="text-lg font-semibold text-white">Projected Timeline of Key Events</h3>
            {impacts.map((impact, index) => (
                <div key={impact.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ring-4 ring-gray-800 ${severityStyles[impact.severity].split(' ')[0].replace('border-','bg-')}`}></div>
                        {index < impacts.length - 1 && <div className="w-px h-full bg-gray-700"></div>}
                    </div>
                    <div className={`-mt-1 pb-4 flex-1 border-l-2 pl-4 ${severityStyles[impact.severity]}`}>
                        <p className="text-sm font-semibold text-cyan-400">{format(parseISO(impact.date + '-01'), 'MMMM yyyy')}</p>
                        <h4 className="font-bold text-white">{impact.title}</h4>
                        <p className="text-sm text-gray-400">{impact.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const RecommendationsPanel = ({ recommendations }: { recommendations: Recommendation[] }) => {
     const categoryStyles = {
        SAVINGS: "bg-blue-900/50 text-blue-300",
        INVESTING: "bg-purple-900/50 text-purple-300",
        DEBT: "bg-red-900/50 text-red-300",
        INCOME: "bg-green-900/50 text-green-300",
        SPENDING: "bg-yellow-900/50 text-yellow-300",
    };
    return (
         <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">AI-Powered Strategic Recommendations</h3>
            {recommendations.map(rec => (
                <div key={rec.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white mb-1">{rec.title}</h4>
                         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryStyles[rec.category]}`}>
                            {rec.category}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">{rec.description}</p>
                     <div className="mt-3 flex justify-end">
                        <OracleButton onClick={()=>{/* TODO: link to action */}} icon={<ArrowRight className="w-4 h-4" />}>
                           Explore Action
                        </OracleButton>
                     </div>
                </div>
            ))}
        </div>
    );
};


const PlaceholderView = ({ title, message, icon: Icon }: { title: string, message: string, icon: React.ElementType }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <Icon className="w-16 h-16 mb-4 text-cyan-800" />
        <h3 className="text-xl font-bold text-gray-400">{title}</h3>
        <p className="max-w-md">{message}</p>
    </div>
);

const BaselineContext = createContext<DataPoint[] | null>(null);

// --- MAIN COMPONENT: QuantumOracleView ---

export default function QuantumOracleView() {
    const [status, setStatus] = useState<SimulationStatus>('idle');
    const [financialState, setFinancialState] = useState<FinancialState | null>(null);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [baselineProjection, setBaselineProjection] = useState<DataPoint[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setStatus('loading');
                const state = await mockFinancialApiService.fetchCurrentState();
                setFinancialState(state);

                // Generate baseline projection
                const baselineScenario: Scenario = { id: 'baseline', name: 'Baseline', description: 'Your current financial trajectory.', perturbations: [] };
                const baseResult = await mockSimulationService.runProjection(state, baselineScenario, []);
                setBaselineProjection(baseResult.projection);

                setStatus('idle');
            } catch (err) {
                setError("Failed to connect to the Oracle's core. Please try again later.");
                setStatus('error');
            }
        };
        loadInitialData();
    }, []);

    const handleSimulate = useCallback(async (scenario: Scenario) => {
        if (!financialState || !baselineProjection) return;
        setStatus('loading');
        setSimulationResult(null);
        setError(null);
        try {
            const result = await mockSimulationService.runProjection(financialState, scenario, baselineProjection);
            setSimulationResult(result);
            setStatus('success');
        } catch (err) {
            setError("The Oracle's vision is clouded. The simulation could not be completed.");
            setStatus('error');
        }
    }, [financialState, baselineProjection]);

    return (
        <BaselineContext.Provider value={baselineProjection}>
            <div className="h-screen w-full bg-gray-900 text-white p-4 lg:p-8 overflow-hidden font-sans bg-grid-cyan-500/10 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/80 to-gray-900"></div>
                <div className="relative z-10 h-full flex flex-col gap-6">
                    <header className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tighter text-cyan-400">Quantum Oracle</h1>
                            <p className="text-gray-500">Weave the threads of possibility and gaze into your financial futures.</p>
                        </div>
                         <div className="flex items-center gap-2">
                             <OracleButton onClick={() => {}} icon={<HelpCircle className="w-4 h-4"/>}>Help</OracleButton>
                             <OracleButton onClick={() => {}} icon={<Download className="w-4 h-4"/>}>Export Report</OracleButton>
                         </div>
                    </header>
                    <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
                        <aside className="lg:col-span-1 flex flex-col gap-6">
                            <ScenarioBuilder onSimulate={handleSimulate} isLoading={status === 'loading'} />
                            {financialState && (
                                <OracleCard className="hidden lg:block">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-cyan-400" /> Current Financial State</h3>
                                    <ul className="text-sm space-y-2 text-gray-300">
                                        <li className="flex justify-between"><span>Net Worth:</span> <span className="font-mono text-white">${financialState.netWorth.toLocaleString()}</span></li>
                                        <li className="flex justify-between"><span>Monthly Income:</span> <span className="font-mono text-white">${financialState.monthlyIncome.toLocaleString()}</span></li>
                                        <li className="flex justify-between"><span>Monthly Expenses:</span> <span className="font-mono text-white">${financialState.monthlyExpenses.toLocaleString()}</span></li>
                                        <li className="flex justify-between"><span>Total Debt:</span> <span className="font-mono text-red-400">${Math.abs(financialState.totalDebt).toLocaleString()}</span></li>
                                    </ul>
                                </OracleCard>
                            )}
                        </aside>
                        <section className="lg:col-span-2 min-h-0">
                            <OracleCard className="h-full flex flex-col">
                                <AnimatePresence mode="wait">
                                    {status === 'loading' && (
                                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col items-center justify-center">
                                            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                                            <p className="mt-4 text-lg text-cyan-300">The Oracle is weaving the timelines...</p>
                                            <p className="text-sm text-gray-500">This may take a moment.</p>
                                        </motion.div>
                                    )}
                                    {status === 'error' && error && (
                                        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow">
                                            <PlaceholderView title="An Error Occurred" message={error} icon={X} />
                                        </motion.div>
                                    )}
                                    {status === 'idle' && (
                                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow">
                                            <PlaceholderView title="The Loom is Ready" message="Select a scenario and engage the Oracle to begin your journey into the possible futures." icon={BrainCircuit} />
                                        </motion.div>
                                    )}
                                    {status === 'success' && simulationResult && (
                                        <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                            <SimulationResultsTabs result={simulationResult} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </OracleCard>
                        </section>
                    </main>
                </div>
            </div>
        </BaselineContext.Provider>
    );
}

// Custom CSS-in-JS for background pattern (to avoid needing external CSS file)
const GlobalStyles = () => (
    <style jsx global>{`
        body {
            background-color: #030712; /* Corresponds to bg-gray-900 */
        }
        .bg-grid-cyan-500\/10 {
            background-image: linear-gradient(theme(colors.cyan.500 / 10%) 1px, transparent 1px), linear-gradient(to right, theme(colors.cyan.500 / 10%) 1px, transparent 1px);
            background-size: 2rem 2rem;
        }
        .prose-invert {
            color: #d1d5db; /* gray-300 */
        }
        .prose-invert p {
            line-height: 1.75;
        }
    `}</style>
);

// We can imagine QuantumOracleView wrapped in a layout that provides GlobalStyles.
// For this single-file component, it is not included but would be part of the app shell.
```