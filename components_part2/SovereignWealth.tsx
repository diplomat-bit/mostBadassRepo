// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/SovereignWealth.tsx
================================================================================



import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Settings, DollarSign, Activity, TrendingUp, Zap, Server, Shield, Globe, Cpu, BarChart3, ZapIcon, Rocket, Brain, Landmark, Clock, Database, Aperture } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';

// --- AI Integration Types (Simulated) ---
type AIInsight = {
  id: string;
  source: 'MarketSentiment' | 'GeopoliticalRisk' | 'InternalEfficiency';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendation: string;
  confidence: number; // 0.0 to 1.0
};

type ProfileSummary = {
  id: string;
  name: string;
  role: string;
  aiScore: number; // Predictive performance score
  lastActionTurn: number;
};

// --- Core Data Structures ---
type NationMetrics = {
  gdp: number; // Trillions USD, Real Growth
  nationalReserve: number; // Trillions USD, Liquid Assets
  debtToGdp: number; // Percentage, Adjusted for Future Liabilities
  unemploymentRate: number; // Percentage, Structural & Cyclical
  inflationRate: number; // Percentage, Core CPI
  tradeBalance: number; // Billions USD, Net Exports
  infrastructureQualityIndex: number; // 0-100, Physical & Digital Backbone
  technologicalAdvancementScore: number; // 0-100, R&D Investment & Patent Velocity
  humanCapitalIndex: number; // 0-100, Education & Health Outcomes
  regulatoryComplexity: number; // 1-100, Friction for new ventures
  cyberDefensePosture: number; // 0-100, Resilience against state actors
};

type EconomicLever = {
  name: string;
  currentValue: number;
  min: number;
  max: number;
  unit: string;
  description: string;
  icon: React.ReactNode;
  aiOptimizationTarget: 'Growth' | 'Stability' | 'Equity';
};

type ScenarioResult = {
  turn: number;
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  reserveChange: number;
  aiModelVersion: string;
};

// --- Initial Configuration ---
const CORE_AI_VERSION = "IdgafAI_v7.1.9";

const initialMetrics: NationMetrics = {
  gdp: 25.0,
  nationalReserve: 4.5,
  debtToGdp: 120.5,
  unemploymentRate: 4.2,
  inflationRate: 3.5,
  tradeBalance: -50.0,
  infrastructureQualityIndex: 88,
  technologicalAdvancementScore: 92,
  humanCapitalIndex: 85,
  regulatoryComplexity: 45,
  cyberDefensePosture: 78,
};

const initialLevers: EconomicLever[] = [
  { name: 'Interest Rate', currentValue: 3.0, min: 0.0, max: 10.0, unit: '%', description: 'Central Bank Policy Rate. Primary tool for liquidity management.', icon: <DollarSign size={16} />, aiOptimizationTarget: 'Stability' },
  { name: 'Fiscal Stimulus', currentValue: 500, min: 0, max: 2000, unit: 'B', description: 'Government spending injection (Billions). Targeted infrastructure/R&D allocation.', icon: <Activity size={16} />, aiOptimizationTarget: 'Growth' },
  { name: 'Corporate Tax Rate', currentValue: 21.0, min: 10.0, max: 50.0, unit: '%', description: 'Taxation on corporate profits. Calibrated for capital retention vs. public funding.', icon: <Server size={16} />, aiOptimizationTarget: 'Equity' },
  { name: 'Reserve Requirement', currentValue: 10.0, min: 5.0, max: 25.0, unit: '%', description: 'Fraction of deposits banks must hold. Controls fractional reserve expansion.', icon: <Zap size={16} />, aiOptimizationTarget: 'Stability' },
  { name: 'Digital Infrastructure Bond Rate', currentValue: 5.5, min: 1.0, max: 12.0, unit: '%', description: 'Incentive rate for private investment in quantum/AI infrastructure.', icon: <Cpu size={16} />, aiOptimizationTarget: 'Growth' },
];

const initialHistory: ScenarioResult[] = [
  { turn: 1, gdpGrowth: 2.1, inflation: 3.2, unemployment: 4.5, reserveChange: 10, aiModelVersion: CORE_AI_VERSION },
  { turn: 2, gdpGrowth: 2.5, inflation: 3.5, unemployment: 4.2, reserveChange: 15, aiModelVersion: CORE_AI_VERSION },
  { turn: 3, gdpGrowth: 3.1, inflation: 3.8, unemployment: 3.9, reserveChange: 22, aiModelVersion: CORE_AI_VERSION },
  { turn: 4, gdpGrowth: 2.9, inflation: 4.1, unemployment: 4.0, reserveChange: 18, aiModelVersion: CORE_AI_VERSION },
  { turn: 5, gdpGrowth: 3.5, inflation: 3.5, unemployment: 3.5, reserveChange: 30, aiModelVersion: CORE_AI_VERSION },
];

const initialProfiles: ProfileSummary[] = [
    { id: 'P001', name: 'Dr. Elara Vance', role: 'Chief Economist', aiScore: 98.2, lastActionTurn: 5 },
    { id: 'P002', name: 'Director Kaelen Rix', role: 'Cyber Command Lead', aiScore: 95.1, lastActionTurn: 4 },
    { id: 'P003', name: 'Minister of Trade', role: 'External Relations', aiScore: 89.5, lastActionTurn: 5 },
];

// --- Utility Components ---

const MetricCard: React.FC<{ title: string; value: string | number; unit: string; trend: 'up' | 'down' | 'flat'; color: string; icon: React.ReactNode }> = ({ title, value, unit, trend, color, icon }) => {
  const trendIcon = useMemo(() => {
    if (trend === 'up') return <TrendingUp className="w-6 h-6 text-green-400" />;
    if (trend === 'down') return <TrendingUp className="w-6 h-6 text-red-400 transform rotate-180" />;
    return <div className="w-6 h-6 text-gray-500">{icon}</div>;
  }, [trend, icon]);

  return (
    <div className="p-5 rounded-2xl shadow-2xl border border-indigo-800/50 backdrop-blur-md bg-gray-800/80 hover:bg-gray-700/80 transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col">
            <div className="flex items-center text-sm font-medium text-indigo-400 uppercase mb-1">
                {icon}
                <span className='ml-2'>{title}</span>
            </div>
            <div className="mt-1 flex items-baseline">
                <p className={`text-5xl font-extrabold ${color} transition-transform duration-300 group-hover:translate-x-1`}>{value}</p>
                <span className="ml-2 text-xl font-semibold text-gray-400">{unit}</span>
            </div>
        </div>
        <div className="p-2 bg-gray-900/50 rounded-full border border-gray-700">
            {trendIcon}
        </div>
      </div>
    </div>
  );
};

const LeverControl: React.FC<{ lever: EconomicLever; onUpdate: (name: string, value: number) => void }> = ({ lever, onUpdate }) => {
  const [value, setValue] = useState(lever.currentValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    onUpdate(lever.name, newValue);
  };

  const targetColor = lever.aiOptimizationTarget === 'Growth' ? 'text-green-400' : lever.aiOptimizationTarget === 'Stability' ? 'text-yellow-400' : 'text-cyan-400';

  return (
    <div className="p-5 bg-gray-900/70 rounded-xl border border-purple-700/50 mb-4 shadow-xl hover:shadow-purple-500/20 transition duration-300">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center text-lg font-bold text-white">
          {lever.icon}
          <h4 className="ml-3">{lever.name}</h4>
        </div>
        <span className={`text-2xl font-extrabold ${targetColor}`}>
          {value.toFixed(lever.unit.includes('%') ? 1 : 0)} {lever.unit}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3 italic border-l-2 border-gray-700 pl-2">{lever.description}</p>
      
      <div className='flex items-center space-x-3'>
        <span className='text-xs text-gray-400'>Target:</span>
        <span className={`text-sm font-bold ${targetColor}`}>{lever.aiOptimizationTarget}</span>
      </div>

      <input
        type="range"
        min={lever.min}
        max={lever.max}
        step={(lever.max - lever.min) / 200} // Finer granularity
        value={value}
        onChange={handleChange}
        className="w-full h-3 mt-3 bg-gray-700 rounded-full appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span className='font-mono'>{lever.min.toFixed(lever.unit.includes('%') ? 1 : 0)}{lever.unit}</span>
        <span className='font-mono'>{lever.max.toFixed(lever.unit.includes('%') ? 1 : 0)}{lever.unit}</span>
      </div>
    </div>
  );
};

const AIInsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
    const colorMap = {
        Critical: 'bg-red-900/50 border-red-500 text-red-300',
        High: 'bg-orange-900/50 border-orange-500 text-orange-300',
        Medium: 'bg-yellow-900/50 border-yellow-500 text-yellow-300',
        Low: 'bg-green-900/50 border-green-500 text-green-300',
    };
    const IconMap = {
        MarketSentiment: <BarChart3 size={18} />,
        GeopoliticalRisk: <Landmark size={18} />,
        InternalEfficiency: <Cpu size={18} />,
    };

    return (
        <div className={`p-4 rounded-lg border-l-4 ${colorMap[insight.severity]} shadow-lg mb-3 transition duration-300 hover:shadow-xl`}>
            <div className="flex justify-between items-center mb-1">
                <div className='flex items-center font-semibold text-sm'>
                    {IconMap[insight.source]}
                    <span className='ml-2'>{insight.source} Alert</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colorMap[insight.severity].replace('bg-', 'bg-').replace('text-', 'text-')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm mt-1">{insight.recommendation}</p>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Confidence: {(insight.confidence * 100).toFixed(1)}%</span>
                <span>Model: {CORE_AI_VERSION}</span>
            </div>
        </div>
    );
};

// --- Simulation Core Logic ---

const generateAIInsights = (metrics: NationMetrics, levers: EconomicLever[], turn: number): AIInsight[] => {
    const insights: AIInsight[] = [];

    // 1. Debt Sustainability Check
    if (metrics.debtToGdp > 130) {
        insights.push({
            id: `D${turn}1`,
            source: 'GeopoliticalRisk',
            severity: 'Critical',
            recommendation: 'Immediate 15% reduction in non-essential capital expenditure required. Debt servicing ratio approaching critical threshold.',
            confidence: 0.95,
        });
    } else if (metrics.debtToGdp > 110) {
        insights.push({
            id: `D${turn}2`,
            source: 'InternalEfficiency',
            severity: 'High',
            recommendation: 'Re-evaluate current Interest Rate lever setting; 0.5% reduction could free up 40B USD in annual servicing costs.',
            confidence: 0.88,
        });
    }

    // 2. Inflation/Growth Balance Check
    if (metrics.inflationRate > 4.5 && metrics.gdp > 3.0) {
        insights.push({
            id: `I${turn}1`,
            source: 'MarketSentiment',
            severity: 'High',
            recommendation: 'Aggressive tightening cycle recommended. Increase Interest Rate by 50bps next cycle to anchor expectations.',
            confidence: 0.91,
        });
    }

    // 3. Infrastructure Lag Check
    if (metrics.infrastructureQualityIndex < 80 && metrics.gdp > 2.0) {
        const stimulusLever = levers.find(l => l.name === 'Fiscal Stimulus');
        if (stimulusLever && stimulusLever.currentValue < 1000) {
            insights.push({
                id: `T${turn}1`,
                source: 'InternalEfficiency',
                severity: 'Medium',
                recommendation: 'Infrastructure deficit is suppressing potential growth. Allocate 300B USD from reserves to Digital Infrastructure Bond Rate.',
                confidence: 0.75,
            });
        }
    }
    
    // 4. Tech Score Stagnation Check
    if (metrics.technologicalAdvancementScore < 95 && turn % 10 === 0) {
        insights.push({
            id: `R${turn}1`,
            source: 'MarketSentiment',
            severity: 'Low',
            recommendation: 'R&D pipeline review initiated. Consider tax incentives for deep-tech startups.',
            confidence: 0.65,
        });
    }

    return insights;
};


const runAdvancedSimulationTurn = (
    currentMetrics: NationMetrics, 
    currentLevers: EconomicLever[], 
    currentTurn: number
): { newMetrics: NationMetrics, newResult: ScenarioResult, insights: AIInsight[] } => {
    
    const rates = currentLevers.reduce((acc, l) => ({ ...acc, [l.name.replace(/\s/g, '')]: l.currentValue }), {} as any);
    const randomFactor = (Math.random() - 0.5) * 0.5; // General noise factor

    // --- 1. Complex Interdependency Model ---
    
    // Base Growth influenced by Tech, Infrastructure, and Regulatory Friction
    let baseGrowth = 2.5 + (currentMetrics.technologicalAdvancementScore / 100) * 1.5 - (currentMetrics.regulatoryComplexity / 100) * 1.0;
    
    // Monetary Policy Impact (Interest Rate & Reserve Requirement)
    const monetaryDampening = (rates.InterestRate - 3.0) * 0.15 + (rates.ReserveRequirement - 10.0) * 0.05;
    
    // Fiscal Impact (Stimulus vs. Tax Rate)
    const fiscalStimulation = (rates.FiscalStimulus / 1500) * 1.0 - (rates.CorporateTaxRate - 20) * 0.08;
    
    // Infrastructure Investment Feedback Loop
    const infraBoost = (rates.DigitalInfrastructureBondRate / 10) * 0.2;

    let newGdpGrowth = baseGrowth + monetaryDampening + fiscalStimulation + infraBoost + randomFactor;

    // Inflation Model: Driven by growth overshoot and reserve liquidity
    let newInflation = 3.0 + (newGdpGrowth - 3.0) * 0.6 + (rates.FiscalStimulus / 2000) * 0.5 - (currentMetrics.infrastructureQualityIndex / 100) * 0.5;
    
    // Unemployment Model: Okun's Law approximation
    let newUnemployment = 4.0 - (newGdpGrowth - 3.0) * 0.7 + (currentMetrics.humanCapitalIndex / 100) * 0.5;

    // --- 2. Metric Updates & Clamping ---
    
    // Clamp Growth and Inflation
    newGdpGrowth = Math.max(0.5, Math.min(6.0, newGdpGrowth));
    newInflation = Math.max(0.5, Math.min(12.0, newInflation));
    newUnemployment = Math.max(0.5, Math.min(15.0, newUnemployment));

    // Reserve Change: Simplified based on Trade Balance and Tax Revenue proxy
    const reserveChange = (currentMetrics.tradeBalance / 100) + (rates.CorporateTaxRate / 100) * currentMetrics.gdp * 0.05 + (rates.FiscalStimulus / 5000);
    const newReserve = currentMetrics.nationalReserve + reserveChange * 0.1; // Only 10% of net flow is immediately liquid

    // Dynamic Index Updates (Slow decay/growth)
    const newTechScore = Math.min(100, currentMetrics.technologicalAdvancementScore + (newGdpGrowth > 4.0 ? 0.5 : 0.1) + infraBoost * 2);
    const newInfra = Math.min(100, currentMetrics.infrastructureQualityIndex + (rates.FiscalStimulus > 1000 ? 0.8 : 0.2));
    const newDebt = Math.max(50, currentMetrics.debtToGdp * (1 + (newGdpGrowth / 100)) - (currentMetrics.gdp * (rates.CorporateTaxRate / 100) * 0.02)); // Debt reduction via tax revenue proxy
    
    const newMetrics: NationMetrics = {
      ...currentMetrics,
      gdp: parseFloat((currentMetrics.gdp * (1 + newGdpGrowth / 100)).toFixed(3)),
      inflationRate: parseFloat(newInflation.toFixed(2)),
      unemploymentRate: parseFloat(newUnemployment.toFixed(2)),
      nationalReserve: parseFloat(newReserve.toFixed(3)),
      debtToGdp: parseFloat(newDebt.toFixed(2)),
      technologicalAdvancementScore: parseFloat(newTechScore.toFixed(1)),
      infrastructureQualityIndex: parseFloat(newInfra.toFixed(1)),
      tradeBalance: parseFloat((currentMetrics.tradeBalance + randomFactor * 10).toFixed(1)), // Trade balance fluctuates slightly
    };

    const newResult: ScenarioResult = {
      turn: currentTurn + 1,
      gdpGrowth: parseFloat(newGdpGrowth.toFixed(2)),
      inflation: parseFloat(newInflation.toFixed(2)),
      unemployment: parseFloat(newUnemployment.toFixed(2)),
      reserveChange: parseFloat(reserveChange.toFixed(2)),
      aiModelVersion: CORE_AI_VERSION,
    };

    const insights = generateAIInsights(newMetrics, currentLevers, currentTurn + 1);

    return { newMetrics, newResult, insights };
};


// --- Main Component ---
const NationalMetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<NationMetrics>(initialMetrics);
  const [levers, setLevers] = useState<EconomicLever[]>(initialLevers);
  const [history, setHistory] = useState<ScenarioResult[]>(initialHistory);
  const [profiles, setProfiles] = useState<ProfileSummary[]>(initialProfiles);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationTurn, setSimulationTurn] = useState(initialHistory.length);

  // Initialize insights on load
  useEffect(() => {
    setInsights(generateAIInsights(metrics, levers, simulationTurn));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateLever = useCallback((name: string, value: number) => {
    setLevers(prev => prev.map(l => (l.name === name ? { ...l, currentValue: value } : l)));
  }, []);

  const runSimulationStep = useCallback(() => {
    setSimulationTurn(prevTurn => {
      const { newMetrics, newResult, insights: newInsights } = runAdvancedSimulationTurn(metrics, levers, prevTurn);
      
      setMetrics(newMetrics);
      setHistory(prev => [...prev, newResult].slice(-50)); // Keep last 50 turns
      setInsights(newInsights);

      // Update Profile activity based on turn progression
      setProfiles(prevProfiles => prevProfiles.map(p => ({
          ...p,
          lastActionTurn: newResult.turn,
      })));

      return newResult.turn;
    });
  }, [metrics, levers]);

  useEffect(() => {
    if (simulationRunning) {
      const interval = setInterval(runSimulationStep, 1500); // Faster turn rate for dramatic effect
      return () => clearInterval(interval);
    }
  }, [simulationRunning, runSimulationStep]);

  const handleRunSimulation = () => {
    setSimulationRunning(true);
  };

  const handlePauseSimulation = () => {
    setSimulationRunning(false);
  };

  const handleStepSimulation = () => {
    if (!simulationRunning) {
        runSimulationStep();
    }
  };

  const getMetricColor = (metric: keyof NationMetrics) => {
    switch (metric) {
      case 'gdp': return metrics.gdp > 30 ? 'text-green-400' : 'text-green-500';
      case 'nationalReserve': return metrics.nationalReserve > 6 ? 'text-yellow-400' : 'text-yellow-500';
      case 'debtToGdp': return metrics.debtToGdp > 130 ? 'text-red-400' : metrics.debtToGdp > 100 ? 'text-orange-400' : 'text-green-400';
      case 'unemploymentRate': return metrics.unemploymentRate > 5.0 ? 'text-red-400' : 'text-green-400';
      case 'inflationRate': return metrics.inflationRate > 4.0 ? 'text-red-400' : metrics.inflationRate > 2.5 ? 'text-yellow-400' : 'text-green-400';
      case 'humanCapitalIndex': return metrics.humanCapitalIndex > 90 ? 'text-cyan-400' : 'text-indigo-400';
      default: return 'text-indigo-400';
    }
  };

  const currentKPIs = useMemo(() => [
    { title: "GDP (T USD)", value: metrics.gdp.toFixed(2), unit: "T", trend: 'up' as const, icon: <Landmark size={18} />, color: getMetricColor('gdp') },
    { title: "Reserves (T USD)", value: metrics.nationalReserve.toFixed(2), unit: "T", trend: 'up' as const, icon: <DollarSign size={18} />, color: getMetricColor('nationalReserve') },
    { title: "Debt/GDP", value: metrics.debtToGdp.toFixed(1), unit: "%", trend: (metrics.debtToGdp > initialMetrics.debtToGdp ? 'up' : 'down') as "up" | "down" | "flat", icon: <TrendingUp size={18} />, color: getMetricColor('debtToGdp') },
    { title: "Unemployment", value: metrics.unemploymentRate.toFixed(1), unit: "%", trend: 'down' as const, icon: <ZapIcon size={18} />, color: getMetricColor('unemploymentRate') },
    { title: "Inflation", value: metrics.inflationRate.toFixed(1), unit: "%", trend: 'up' as const, icon: <TrendingUp size={18} />, color: getMetricColor('inflationRate') },
    { title: "Tech Velocity", value: metrics.technologicalAdvancementScore.toFixed(0), unit: "/100", trend: 'up' as const, icon: <Cpu size={18} />, color: getMetricColor('technologicalAdvancementScore') },
  ], [metrics]);

  return (
    <div className="min-h-screen p-10 text-white bg-gray-950 font-sans relative overflow-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px]"></div>
        <div className="absolute inset-0 opacity-5 bg-[url('/grid.svg')] bg-repeat [background-size:100px_100px]"></div>

      <header className="relative z-20 flex justify-between items-center pb-8 border-b border-indigo-800/50 mb-8">
        <div className='flex items-center'>
            <Aperture className='w-10 h-10 text-purple-400 mr-3 animate-spin-slow' />
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 tracking-tight">
                National Metrics Dashboard: Chronos Engine
            </h1>
        </div>
        <div className="flex space-x-4 items-center">
          <div className='text-sm text-gray-400 bg-gray-800/70 p-2 rounded-lg border border-gray-700'>
            Turn: <span className='font-bold text-lg text-yellow-300'>{simulationTurn}</span> | Core: <span className='text-xs text-green-400'>{CORE_AI_VERSION}</span>
          </div>
          <button
            onClick={simulationRunning ? handlePauseSimulation : handleRunSimulation}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center shadow-lg transform hover:scale-[1.03] ${simulationRunning ? 'bg-red-700 hover:bg-red-600 shadow-red-500/40' : 'bg-green-600 hover:bg-green-500 shadow-green-500/40'}`}
          >
            {simulationRunning ? (
              <>
                <Clock size={20} className="mr-2 animate-spin-slow" /> PAUSE EXECUTION
              </>
            ) : (
              <>
                <Zap size={20} className="mr-2" /> INITIATE CYCLE
              </>
            )}
          </button>
          <button
            onClick={handleStepSimulation}
            disabled={simulationRunning}
            className={`p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition shadow-lg`}
          >
            <Rocket size={24} />
          </button>
          <button className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition">
            <Settings size={24} />
          </button>
        </div>
      </header>

      <main className="grid grid-cols-12 gap-8 relative z-10">

        {/* Column 1: Core Metrics & Status (4/12 width) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <h2 className="text-3xl font-bold text-indigo-300 flex items-center border-b border-gray-800 pb-2"><Globe className="w-7 h-7 mr-3" /> National Economic Dashboard</h2>

          <div className="grid grid-cols-2 gap-5">
            {currentKPIs.map((kpi) => (
                <MetricCard
                    key={kpi.title}
                    title={kpi.title}
                    value={kpi.value}
                    unit={kpi.unit}
                    trend={kpi.trend}
                    color={kpi.color}
                    icon={kpi.icon}
                />
            ))}
          </div>

          {/* Advanced Stability Indicators */}
          <div className="p-6 bg-gray-900 rounded-2xl shadow-2xl border border-cyan-800/50">
            <h3 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center"><Shield className="mr-2 w-6 h-6" /> Resilience Matrix</h3>
            <div className="space-y-4">
              {[
                { label: 'Human Capital Index', value: metrics.humanCapitalIndex, max: 100, color: 'bg-green-500', textColor: getMetricColor('humanCapitalIndex') },
                { label: 'Regulatory Friction', value: metrics.regulatoryComplexity, max: 100, color: 'bg-red-500', textColor: metrics.regulatoryComplexity < 50 ? 'text-green-400' : 'text-red-400' },
                { label: 'Cyber Defense Posture', value: metrics.cyberDefensePosture, max: 100, color: 'bg-indigo-500', textColor: getMetricColor('cyberDefensePosture') },
              ].map(({ label, value, max, color, textColor }) => (
                <div key={label}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className='text-gray-400'>{label}</span>
                    <span className={`font-mono text-lg font-bold ${textColor}`}>
                      {value.toFixed(1)} / {max}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-700 rounded-full">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Economic Levers (Control Panel) (3/12 width) */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <h2 className="text-3xl font-bold text-purple-300 flex items-center border-b border-gray-800 pb-2"><Settings className="w-7 h-7 mr-3" /> Policy Control Nexus</h2>
          <div className="p-5 bg-gray-900/80 rounded-2xl shadow-2xl border border-purple-700/50">
            {levers.map(lever => (
              <LeverControl key={lever.name} lever={lever} onUpdate={updateLever} />
            ))}

            <div className="mt-8 p-4 bg-purple-900/30 rounded-xl border border-purple-600/50">
                <p className="text-sm font-bold text-purple-300 flex items-center"><Brain className='w-4 h-4 mr-2'/> AI Optimization Directives</p>
                <p className="text-xs text-gray-400 mt-1">Levers are dynamically weighted by the AI based on current risk profile and optimization targets ({levers.filter(l => l.aiOptimizationTarget === 'Stability').length} Stability, {levers.filter(l => l.aiOptimizationTarget === 'Growth').length} Growth, {levers.filter(l => l.aiOptimizationTarget === 'Equity').length} Equity).</p>
            </div>
          </div>
        </div>

        {/* Column 3: Simulation & Impact Visualizations (5/12 width) */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <h2 className="text-3xl font-bold text-cyan-300 flex items-center border-b border-gray-800 pb-2"><BarChart3 className="w-7 h-7 mr-3" /> Predictive Modeling & Risk Assessment</h2>

          {/* Primary Chart: Growth/Inflation */}
          <div className="p-6 bg-gray-900 rounded-2xl shadow-2xl border border-cyan-800/50 h-[400px]">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Macro Trajectory (GDP vs. Inflation)</h3>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorInf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="turn" stroke="#4B5563" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#818CF8" domain={[0, 7]} orientation="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" stroke="#4ADE80" domain={[0, 10]} orientation="right" tick={{ fontSize: 10 }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #4B5563', borderRadius: '8px' }} labelStyle={{ color: '#E5E7EB' }} />
                <Area yAxisId="left" type="monotone" dataKey="gdpGrowth" stroke="#818CF8" strokeWidth={2} fillOpacity={1} fill="url(#colorGdp)" name="GDP Growth (%)" />
                <Area yAxisId="right" type="monotone" dataKey="inflation" stroke="#4ADE80" strokeWidth={2} fillOpacity={1} fill="url(#colorInf)" name="Inflation Rate (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insight Feed */}
          <div className="p-6 bg-gray-900 rounded-2xl shadow-2xl border border-red-800/50">
            <h3 className="text-xl font-semibold text-red-300 mb-3 flex items-center"><Zap size={20} className='mr-2'/> IdgafAI Critical Alerts ({insights.filter(i => i.severity !== 'Low').length} Active)</h3>
            <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {insights.length > 0 ? (
                    insights.map(insight => <AIInsightCard key={insight.id} insight={insight} />)
                ) : (
                    <p className='text-gray-500 italic p-4 bg-gray-800 rounded-lg'>System nominal. No immediate high-severity anomalies detected.</p>
                )}
            </div>
          </div>
        </div>
      </main>
      
      <section className="mt-10 p-8 bg-gray-900/70 rounded-2xl border border-indigo-700/50 backdrop-blur-lg shadow-inner">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400 mb-4 flex items-center"><Database className='w-7 h-7 mr-3'/> System Log & Personnel Manifest</h2>
          
          <div className='grid grid-cols-3 gap-6'>
            {/* Personnel Manifest */}
            <div className='col-span-1'>
                <h3 className="text-xl font-semibold text-indigo-300 mb-3">Active Personnel Nodes</h3>
                <div className='space-y-3'>
                    {profiles.map(p => (
                        <div key={p.id} className='p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition'>
                            <p className='font-bold text-white'>{p.name}</p>
                            <p className='text-sm text-gray-400 italic'>{p.role}</p>
                            <div className='flex justify-between text-xs mt-1'>
                                <span>AI Score: <span className='font-mono text-green-400'>{p.aiScore.toFixed(1)}</span></span>
                                <span>Last Sync: T-{simulationTurn - p.lastActionTurn}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Historical Context */}
            <div className='col-span-2'>
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Simulation History Snapshot (Last 5 Turns)</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-800 sticky top-0">
                            <tr>
                                {['Turn', 'GDP Growth', 'Inflation', 'Unemployment', 'Reserve Change', 'Model'].map(header => (
                                    <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {history.slice(-5).reverse().map((res) => (
                                <tr key={res.turn} className='hover:bg-gray-800 transition duration-150'>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-yellow-300">{res.turn}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-400">{res.gdpGrowth.toFixed(2)}%</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-red-400">{res.inflation.toFixed(2)}%</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-cyan-400">{res.unemployment.toFixed(2)}%</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-indigo-400">{res.reserveChange.toFixed(2)} B</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{res.aiModelVersion.split('_')[0]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
      </section>

      <footer className="mt-10 pt-6 border-t border-indigo-900 text-center text-sm text-gray-600">
        National Metrics Dashboard v1.0.0 | Chronos Engine Active | All Rights Reserved to the Collective Future.
      </footer>
    </div>
  );
};

export default NationalMetricsDashboard;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SovereignWealth.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Settings, DollarSign, Activity, TrendingUp, Zap, Server, Shield, Globe, 
  Cpu, BarChart3, ZapIcon, Rocket, Brain, Landmark, Clock, Database, 
  Aperture, Send, ShieldCheck, ShieldAlert, Fingerprint, History, 
  Layers, LayoutDashboard, CreditCard, Wallet, ArrowUpRight, ArrowDownLeft,
  Search, MessageSquare, Bot, Sparkles, Terminal, Lock, Eye, EyeOff,
  FileText, Share2, Download, Filter, Plus, Trash2, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - THE SOVEREIGN COMMAND CENTER
 * 
 * PHILOSOPHY:
 * - This is a "Golden Ticket" experience.
 * - We are letting the user "Test Drive" the car (the code).
 * - It must have "Bells and Whistles" - distinct features, high polish.
 * - It is a "Cheat Sheet" for business banking.
 * - NO PRESSURE environment.
 * - Metaphor: Kick the tires. See the engine roar.
 * 
 * TECHNICAL REQUIREMENTS:
 * - Robust Payment & Collection capabilities (Wire, ACH).
 * - Security is non-negotiable (Multi-factor auth simulations, Fraud monitoring).
 * - Reporting & Analytics (Data visualization).
 * - Integration capabilities (ERP, Accounting).
 * - AUDIT STORAGE: Every sensitive action must be logged.
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

type PaymentType = 'WIRE' | 'ACH' | 'SWIFT' | 'INTERNAL';
type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'FLAGGED';

interface PaymentOrder {
  id: string;
  recipient: string;
  accountNumber: string;
  routingNumber?: string;
  swiftCode?: string;
  amount: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  timestamp: string;
  reference: string;
  initiatedBy: string;
  riskScore: number;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  resourceId?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: any;
}

interface SecurityMetric {
  name: string;
  value: number;
  status: 'SECURE' | 'MONITORING' | 'THREAT_DETECTED';
}

interface BusinessMetric {
  label: string;
  value: number;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
}

// ================================================================================================
// CONSTANTS & MOCK DATA
// ================================================================================================

const CORE_AI_VERSION = "QuantumIntelligence_v9.4.2";
const INSTITUTION_NAME = "Quantum Financial";

const INITIAL_PAYMENTS: PaymentOrder[] = [
  { id: 'TX-9901', recipient: 'Global Logistics Corp', accountNumber: '****8821', routingNumber: '12200024', amount: 450000, currency: 'USD', type: 'WIRE', status: 'COMPLETED', timestamp: new Date(Date.now() - 86400000).toISOString(), reference: 'INV-2024-001', initiatedBy: 'James B. O\'Callaghan', riskScore: 0.02 },
  { id: 'TX-9902', recipient: 'Cloud Infrastructure Ltd', accountNumber: '****4412', routingNumber: '02100002', amount: 125000, currency: 'USD', type: 'ACH', status: 'PROCESSING', timestamp: new Date(Date.now() - 3600000).toISOString(), reference: 'MONTHLY_SUBSCRIPTION', initiatedBy: 'System Auto-Pay', riskScore: 0.01 },
  { id: 'TX-9903', recipient: 'Unknown Entity X', accountNumber: '****0000', swiftCode: 'UNKNUS33', amount: 2500000, currency: 'USD', type: 'SWIFT', status: 'FLAGGED', timestamp: new Date().toISOString(), reference: 'URGENT_TRANSFER', initiatedBy: 'External API', riskScore: 0.89 },
];

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  { id: 'LOG-001', timestamp: new Date(Date.now() - 172800000).toISOString(), action: 'USER_LOGIN', actor: 'James B. O\'Callaghan', details: 'Successful login via Biometric MFA', ipAddress: '192.168.1.105', severity: 'INFO' },
  { id: 'LOG-002', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'WIRE_INITIATED', actor: 'James B. O\'Callaghan', details: 'Wire transfer of $450,000 to Global Logistics Corp', ipAddress: '192.168.1.105', severity: 'INFO', resourceId: 'TX-9901' },
  { id: 'LOG-003', timestamp: new Date().toISOString(), action: 'SECURITY_ALERT', actor: 'Quantum Sentinel', details: 'High-risk SWIFT transfer detected and quarantined', ipAddress: 'Internal AI', severity: 'CRITICAL', resourceId: 'TX-9903' },
];

const CHART_COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

// ================================================================================================
// HELPER COMPONENTS
// ================================================================================================

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; title?: string; icon?: React.ReactNode }> = ({ children, className = "", title, icon }) => (
  <div className={`bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-cyan-500/30 ${className}`}>
    {(title || icon) && (
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/40">
        <div className="flex items-center space-x-3">
          {icon && <div className="text-cyan-400">{icon}</div>}
          {title && <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300">{title}</h3>}
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
        </div>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

const StatWidget: React.FC<BusinessMetric & { icon: React.ReactNode }> = ({ label, value, change, unit, trend, icon }) => (
  <div className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800 hover:bg-gray-800/40 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-gray-800 text-cyan-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className={`flex items-center space-x-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
        <span>{change}%</span>
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline space-x-1">
        <h4 className="text-2xl font-bold text-white">
          {unit === '$' && '$'}
          {value.toLocaleString()}
          {unit !== '$' && unit}
        </h4>
      </div>
    </div>
  </div>
);

// ================================================================================================
// MAIN DASHBOARD COMPONENT
// ================================================================================================

const NationalMetricsDashboard: React.FC = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'security' | 'audit'>('overview');
  const [payments, setPayments] = useState<PaymentOrder[]>(INITIAL_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: "Welcome to the Quantum Financial Command Center. I am your Sovereign AI co-pilot. How can I assist with your global treasury operations today?", timestamp: new Date().toISOString() }
  ]);
  const [userInput, setUserInput] = useState("");
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [mfaCode, setMfaCode] = useState("");
  
  // --- Refs ---
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [chatHistory]);

  // --- AI Logic ---
  const genAI = useMemo(() => {
    const apiKey = process.env.GEMINI_API_KEY || "DEMO_MODE";
    return new GoogleGenAI(apiKey);
  }, []);

  const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'INFO', resourceId?: string) => {
    const newEntry: AuditEntry = {
      id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      actor: "James B. O'Callaghan",
      details,
      ipAddress: "192.168.1.105",
      severity,
      resourceId
    };
    setAuditLogs(prev => [newEntry, ...prev]);
    console.log(`[AUDIT STORAGE] ${action}: ${details}`);
  }, []);

  const handleAiCommand = async (input: string) => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMsg]);
    setUserInput("");
    setIsAiLoading(true);

    try {
      // Simulated Intent Parsing for the "Test Drive" experience
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes("send") || lowerInput.includes("wire") || lowerInput.includes("pay")) {
        // Simulate a payment creation intent
        const amountMatch = input.match(/\d+/);
        const amount = amountMatch ? parseInt(amountMatch[0]) : 50000;
        
        setTimeout(() => {
          const aiMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: `I've prepared a draft WIRE transfer for $${amount.toLocaleString()} to the requested recipient. For security, please authorize this action in the Payments tab or via the MFA prompt I'm about to trigger.`, 
            timestamp: new Date().toISOString() 
          };
          setChatHistory(prev => [...prev, aiMsg]);
          setIsAiLoading(false);
          
          // Trigger MFA for the "Bells and Whistles"
          setPendingAction({ type: 'CREATE_PAYMENT', amount, recipient: 'AI Requested Recipient' });
          setShowMfaModal(true);
        }, 1500);
        return;
      }

      if (lowerInput.includes("audit") || lowerInput.includes("logs")) {
        setTimeout(() => {
          const aiMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: `Retrieving the last 5 high-severity audit entries... System is nominal. No unauthorized access attempts detected in the last 24 hours.`, 
            timestamp: new Date().toISOString() 
          };
          setChatHistory(prev => [...prev, aiMsg]);
          setIsAiLoading(false);
          setActiveTab('audit');
        }, 1000);
        return;
      }

      // Default Gemini Call
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `You are the Quantum Financial Sovereign AI. You are helping a high-net-worth business user manage a global bank demo. 
      The user said: "${input}". 
      Context: We are in a "Golden Ticket" demo environment. Be professional, elite, and helpful. 
      Do not mention Citibank. Use "Quantum Financial". 
      Keep it concise and focused on business banking, treasury, and security.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: text, timestamp: new Date().toISOString() };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: "I'm currently operating in offline mode due to a synchronization delay, but I can still process local treasury commands. Try asking me to 'Send a wire' or 'Show audit logs'.", timestamp: new Date().toISOString() };
      setChatHistory(prev => [...prev, aiMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const confirmMfa = () => {
    if (mfaCode === "123456" || mfaCode === "000000") {
      if (pendingAction?.type === 'CREATE_PAYMENT') {
        const newPayment: PaymentOrder = {
          id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
          recipient: pendingAction.recipient,
          accountNumber: '****9999',
          amount: pendingAction.amount,
          currency: 'USD',
          type: 'WIRE',
          status: 'AUTHORIZED',
          timestamp: new Date().toISOString(),
          reference: 'AI_GENERATED_REF',
          initiatedBy: "James B. O'Callaghan (via AI)",
          riskScore: 0.05
        };
        setPayments(prev => [newPayment, ...prev]);
        logAction('WIRE_AUTHORIZED', `Authorized $${pendingAction.amount} wire to ${pendingAction.recipient}`, 'INFO', newPayment.id);
      }
      setShowMfaModal(false);
      setMfaCode("");
      setPendingAction(null);
    } else {
      alert("Invalid MFA Code. In this demo, use 123456.");
    }
  };

  // --- Render Helpers ---

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget label="Total Liquidity" value={42500000} change={12.5} unit="$" trend="up" icon={<Wallet size={24} />} />
        <StatWidget label="Pending Outbound" value={125000} change={2.1} unit="$" trend="down" icon={<ArrowUpRight size={24} />} />
        <StatWidget label="Security Score" value={98} change={0.5} unit="%" trend="up" icon={<ShieldCheck size={24} />} />
        <StatWidget label="Active Entities" value={14} change={0} unit="" trend="neutral" icon={<Globe size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard title="Cash Flow Projection" icon={<Activity size={18} />} className="lg:col-span-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Mon', inflow: 4000, outflow: 2400 },
                { name: 'Tue', inflow: 3000, outflow: 1398 },
                { name: 'Wed', inflow: 2000, outflow: 9800 },
                { name: 'Thu', inflow: 2780, outflow: 3908 },
                { name: 'Fri', inflow: 1890, outflow: 4800 },
                { name: 'Sat', inflow: 2390, outflow: 3800 },
                { name: 'Sun', inflow: 3490, outflow: 4300 },
              ]}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="inflow" stroke="#06b6d4" fillOpacity={1} fill="url(#colorIn)" strokeWidth={3} />
                <Area type="monotone" dataKey="outflow" stroke="#8b5cf6" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Asset Allocation" icon={<Layers size={18} />}>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Operating', value: 45 },
                    { name: 'Reserve', value: 25 },
                    { name: 'Investment', value: 20 },
                    { name: 'Crypto', value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CHART_COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Global Payment Engine</h2>
        <button 
          onClick={() => {
            setPendingAction({ type: 'CREATE_PAYMENT', amount: 0, recipient: '' });
            setShowMfaModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20"
        >
          <Plus size={18} />
          <span>New Transfer</span>
        </button>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-widest">
              <th className="px-6 py-4 font-semibold">Recipient / Ref</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Risk</th>
              <th className="px-6 py-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {payments.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{tx.recipient}</div>
                  <div className="text-xs text-gray-500">{tx.reference}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded bg-gray-800 text-[10px] font-bold text-gray-300">{tx.type}</span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-white">
                  ${tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'COMPLETED' ? 'bg-emerald-500' : 
                      tx.status === 'FLAGGED' ? 'bg-rose-500 animate-pulse' : 
                      'bg-amber-500'
                    }`} />
                    <span className="text-xs font-medium text-gray-300">{tx.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${tx.riskScore > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${tx.riskScore * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Immutable Audit Vault</h2>
        <div className="flex space-x-2">
          <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors">
            <Download size={18} />
          </button>
          <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {auditLogs.map((log) => (
          <div key={log.id} className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl flex items-start space-x-4 hover:border-gray-700 transition-all">
            <div className={`p-2 rounded-lg ${
              log.severity === 'CRITICAL' ? 'bg-rose-900/20 text-rose-500' : 
              log.severity === 'WARNING' ? 'bg-amber-900/20 text-amber-500' : 
              'bg-cyan-900/20 text-cyan-500'
            }`}>
              {log.severity === 'CRITICAL' ? <ShieldAlert size={20} /> : <History size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-200">{log.action}</h4>
                <span className="text-[10px] font-mono text-gray-500">{log.timestamp}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{log.details}</p>
              <div className="flex items-center space-x-4 mt-2 text-[10px] text-gray-600 font-medium uppercase tracking-tighter">
                <span>Actor: {log.actor}</span>
                <span>IP: {log.ipAddress}</span>
                {log.resourceId && <span>Ref: {log.resourceId}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-300 font-sans selection:bg-cyan-500/30">
      {/* --- Background Effects --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- Sidebar Navigation --- */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-gray-950 border-r border-gray-800 z-50 flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Aperture className="text-white animate-spin-slow" size={24} />
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tighter text-white uppercase italic">Quantum</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {[
            { id: 'overview', label: 'Command Center', icon: <LayoutDashboard size={20} /> },
            { id: 'payments', label: 'Payment Engine', icon: <CreditCard size={20} /> },
            { id: 'security', label: 'Security Vault', icon: <Shield size={20} /> },
            { id: 'audit', label: 'Audit Storage', icon: <Database size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
              }`}
            >
              <div className={activeTab === item.id ? 'text-white' : 'group-hover:text-cyan-400 transition-colors'}>
                {item.icon}
              </div>
              <span className="hidden lg:block font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-gray-900/50 border border-gray-800">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-400">
              <Fingerprint size={18} />
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-bold text-white truncate">James B. O'Callaghan</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Sovereign Architect</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="pl-20 lg:pl-64 pt-24 pb-12 px-8 min-h-screen relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-20 lg:left-64 right-0 h-20 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
            <div className="h-4 w-[1px] bg-gray-800"></div>
            <div className="flex items-center space-x-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>System Live: {CORE_AI_VERSION}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search transactions, entities..." 
                className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 w-64 transition-all"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                <Zap size={20} />
                <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full border-2 border-gray-950"></div>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'audit' && renderAudit()}
          {activeTab === 'security' && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                <ShieldCheck size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Quantum Shield Active</h2>
                <p className="text-gray-500 max-w-md mx-auto">Your environment is protected by multi-layered biometric encryption and real-time heuristic fraud monitoring.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mt-8">
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                  <Fingerprint className="text-cyan-400 mb-4" size={32} />
                  <h4 className="font-bold text-white">Biometric MFA</h4>
                  <p className="text-xs text-gray-500 mt-2">Enforced for all high-value wires and administrative changes.</p>
                </div>
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                  <Brain className="text-purple-400 mb-4" size={32} />
                  <h4 className="font-bold text-white">AI Sentinel</h4>
                  <p className="text-xs text-gray-500 mt-2">Heuristic analysis of transaction patterns to prevent zero-day fraud.</p>
                </div>
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                  <Lock className="text-emerald-400 mb-4" size={32} />
                  <h4 className="font-bold text-white">Quantum Encryption</h4>
                  <p className="text-xs text-gray-500 mt-2">All data at rest and in transit is secured via post-quantum algorithms.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Floating AI Chat Bar --- */}
        <div className="fixed bottom-8 right-8 w-96 z-50">
          <GlassCard className="!p-0 shadow-2xl border-cyan-500/20 flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sovereign AI</h4>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online & Synchronized</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <Sparkles size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-300 rounded-tl-none border border-gray-700'
                  }`}>
                    {msg.content}
                    <div className={`text-[9px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-gray-900/60 border-t border-gray-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAiCommand(userInput); }}
                className="relative"
              >
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask AI to send a wire, check logs..." 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!userInput.trim() || isAiLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400 disabled:text-gray-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </GlassCard>
        </div>
      </main>

      {/* --- MFA / Authorization Modal --- */}
      {showMfaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setShowMfaModal(false)}></div>
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 border border-cyan-500/20 mx-auto shadow-xl">
                <Fingerprint size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Authorization Required</h3>
                <p className="text-gray-500 text-sm">
                  {pendingAction?.type === 'CREATE_PAYMENT' 
                    ? `Confirming a WIRE transfer of $${pendingAction.amount.toLocaleString()} to ${pendingAction.recipient}.`
                    : "Please verify your identity to proceed with this administrative action."}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-10 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-xl font-bold text-white">
                      {mfaCode[i] || ""}
                    </div>
                  ))}
                </div>
                <input 
                  type="text" 
                  maxLength={6}
                  autoFocus
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  className="absolute inset-0 opacity-0 cursor-default"
                />
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Enter 123456 to authorize</p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowMfaModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmMfa}
                  className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-900/20"
                >
                  Authorize
                </button>
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 flex items-center justify-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <Lock size={12} />
              <span>End-to-End Encrypted Session</span>
            </div>
          </div>
        </div>
      )}

      {/* --- Footer / System Status --- */}
      <footer className="pl-20 lg:pl-64 py-6 px-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <span>© 2024 {INSTITUTION_NAME} Global</span>
          <span className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>All Systems Operational</span>
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-500 transition-colors">Security Disclosure</a>
          <span className="text-gray-800">|</span>
          <span className="text-cyan-900">Sovereign Node: 0x77ALPHA</span>
        </div>
      </footer>

      {/* --- Custom Scrollbar Styles --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};

export default NationalMetricsDashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SovereignWealth.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Settings, DollarSign, Activity, TrendingUp, Zap, Server, Shield, Globe, 
  Cpu, BarChart3, ZapIcon, Rocket, Brain, Landmark, Clock, Database, 
  Aperture, Send, ShieldCheck, ShieldAlert, Fingerprint, History, 
  Layers, LayoutDashboard, CreditCard, Wallet, ArrowUpRight, ArrowDownLeft,
  Search, MessageSquare, Bot, Sparkles, Terminal, Lock, Eye, EyeOff,
  FileText, Share2, Download, Filter, Plus, Trash2, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - THE SOVEREIGN COMMAND CENTER
 * 
 * PHILOSOPHY:
 * - This is a "Golden Ticket" experience.
 * - We are letting the user "Test Drive" the car (the code).
 * - It must have "Bells and Whistles" - distinct features, high polish.
 * - It is a "Cheat Sheet" for business banking.
 * - NO PRESSURE environment.
 * - Metaphor: Kick the tires. See the engine roar.
 * 
 * TECHNICAL REQUIREMENTS:
 * - Robust Payment & Collection capabilities (Wire, ACH).
 * - Security is non-negotiable (Multi-factor auth simulations, Fraud monitoring).
 * - Reporting & Analytics (Data visualization).
 * - Integration capabilities (ERP, Accounting).
 * - AUDIT STORAGE: Every sensitive action must be logged.
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

type PaymentType = 'WIRE' | 'ACH' | 'SWIFT' | 'INTERNAL';
type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'FLAGGED';

interface PaymentOrder {
  id: string;
  recipient: string;
  accountNumber: string;
  routingNumber?: string;
  swiftCode?: string;
  amount: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  timestamp: string;
  reference: string;
  initiatedBy: string;
  riskScore: number;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  resourceId?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: any;
}

interface SecurityMetric {
  name: string;
  value: number;
  status: 'SECURE' | 'MONITORING' | 'THREAT_DETECTED';
}

interface BusinessMetric {
  label: string;
  value: number;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
}

// ================================================================================================
// CONSTANTS & MOCK DATA
// ================================================================================================

const CORE_AI_VERSION = "QuantumIntelligence_v9.4.2";
const INSTITUTION_NAME = "Quantum Financial";

const INITIAL_PAYMENTS: PaymentOrder[] = [
  { id: 'TX-9901', recipient: 'Global Logistics Corp', accountNumber: '****8821', routingNumber: '12200024', amount: 450000, currency: 'USD', type: 'WIRE', status: 'COMPLETED', timestamp: new Date(Date.now() - 86400000).toISOString(), reference: 'INV-2024-001', initiatedBy: 'James B. O\'Callaghan', riskScore: 0.02 },
  { id: 'TX-9902', recipient: 'Cloud Infrastructure Ltd', accountNumber: '****4412', routingNumber: '02100002', amount: 125000, currency: 'USD', type: 'ACH', status: 'PROCESSING', timestamp: new Date(Date.now() - 3600000).toISOString(), reference: 'MONTHLY_SUBSCRIPTION', initiatedBy: 'System Auto-Pay', riskScore: 0.01 },
  { id: 'TX-9903', recipient: 'Unknown Entity X', accountNumber: '****0000', swiftCode: 'UNKNUS33', amount: 2500000, currency: 'USD', type: 'SWIFT', status: 'FLAGGED', timestamp: new Date().toISOString(), reference: 'URGENT_TRANSFER', initiatedBy: 'External API', riskScore: 0.89 },
];

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  { id: 'LOG-001', timestamp: new Date(Date.now() - 172800000).toISOString(), action: 'USER_LOGIN', actor: 'James B. O\'Callaghan', details: 'Successful login via Biometric MFA', ipAddress: '192.168.1.105', severity: 'INFO' },
  { id: 'LOG-002', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'WIRE_INITIATED', actor: 'James B. O\'Callaghan', details: 'Wire transfer of $450,000 to Global Logistics Corp', ipAddress: '192.168.1.105', severity: 'INFO', resourceId: 'TX-9901' },
  { id: 'LOG-003', timestamp: new Date().toISOString(), action: 'SECURITY_ALERT', actor: 'Quantum Sentinel', details: 'High-risk SWIFT transfer detected and quarantined', ipAddress: 'Internal AI', severity: 'CRITICAL', resourceId: 'TX-9903' },
];

const CHART_COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

// ================================================================================================
// HELPER COMPONENTS
// ================================================================================================

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; title?: string; icon?: React.ReactNode }> = ({ children, className = "", title, icon }) => (
  <div className={`bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-cyan-500/30 ${className}`}>
    {(title || icon) && (
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/40">
        <div className="flex items-center space-x-3">
          {icon && <div className="text-cyan-400">{icon}</div>}
          {title && <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300">{title}</h3>}
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
        </div>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

const StatWidget: React.FC<BusinessMetric & { icon: React.ReactNode }> = ({ label, value, change, unit, trend, icon }) => (
  <div className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800 hover:bg-gray-800/40 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-gray-800 text-cyan-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className={`flex items-center space-x-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
        <span>{change}%</span>
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline space-x-1">
        <h4 className="text-2xl font-bold text-white">
          {unit === '$' && '$'}
          {value.toLocaleString()}
          {unit !== '$' && unit}
        </h4>
      </div>
    </div>
  </div>
);

// ================================================================================================
// MAIN DASHBOARD COMPONENT
// ================================================================================================

const NationalMetricsDashboard: React.FC = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'security' | 'audit'>('overview');
  const [payments, setPayments] = useState<PaymentOrder[]>(INITIAL_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: "Welcome to the Quantum Financial Command Center. I am your Sovereign AI co-pilot. How can I assist with your global treasury operations today?", timestamp: new Date().toISOString() }
  ]);
  const [userInput, setUserInput] = useState("");
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [mfaCode, setMfaCode] = useState("");
  
  // --- Refs ---
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [chatHistory]);

  // --- AI Logic ---
  const genAI = useMemo(() => {
    const apiKey = process.env.GEMINI_API_KEY || "DEMO_MODE";
    return new GoogleGenAI(apiKey);
  }, []);

  const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'INFO', resourceId?: string) => {
    const newEntry: AuditEntry = {
      id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      actor: "James B. O'Callaghan",
      details,
      ipAddress: "192.168.1.105",
      severity,
      resourceId
    };
    setAuditLogs(prev => [newEntry, ...prev]);
    console.log(`[AUDIT STORAGE] ${action}: ${details}`);
  }, []);

  const handleAiCommand = async (input: string) => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMsg]);
    setUserInput("");
    setIsAiLoading(true);

    try {
      // Simulated Intent Parsing for the "Test Drive" experience
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes("send") || lowerInput.includes("wire") || lowerInput.includes("pay")) {
        // Simulate a payment creation intent
        const amountMatch = input.match(/\d+/);
        const amount = amountMatch ? parseInt(amountMatch[0]) : 50000;
        
        setTimeout(() => {
          const aiMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: `I've prepared a draft WIRE transfer for $${amount.toLocaleString()} to the requested recipient. For security, please authorize this action in the Payments tab or via the MFA prompt I'm about to trigger.`, 
            timestamp: new Date().toISOString() 
          };
          setChatHistory(prev => [...prev, aiMsg]);
          setIsAiLoading(false);
          
          // Trigger MFA for the "Bells and Whistles"
          setPendingAction({ type: 'CREATE_PAYMENT', amount, recipient: 'AI Requested Recipient' });
          setShowMfaModal(true);
        }, 1500);
        return;
      }

      if (lowerInput.includes("audit") || lowerInput.includes("logs")) {
        setTimeout(() => {
          const aiMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: `Retrieving the last 5 high-severity audit entries... System is nominal. No unauthorized access attempts detected in the last 24 hours.`, 
            timestamp: new Date().toISOString() 
          };
          setChatHistory(prev => [...prev, aiMsg]);
          setIsAiLoading(false);
          setActiveTab('audit');
        }, 1000);
        return;
      }

      // Default Gemini Call
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `You are the Quantum Financial Sovereign AI. You are helping a high-net-worth business user manage a global bank demo. 
      The user said: "${input}". 
      Context: We are in a "Golden Ticket" demo environment. Be professional, elite, and helpful. 
      Do not mention Citibank. Use "Quantum Financial". 
      Keep it concise and focused on business banking, treasury, and security.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: text, timestamp: new Date().toISOString() };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: "I'm currently operating in offline mode due to a synchronization delay, but I can still process local treasury commands. Try asking me to 'Send a wire' or 'Show audit logs'.", timestamp: new Date().toISOString() };
      setChatHistory(prev => [...prev, aiMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const confirmMfa = () => {
    if (mfaCode === "123456" || mfaCode === "000000") {
      if (pendingAction?.type === 'CREATE_PAYMENT') {
        const newPayment: PaymentOrder = {
          id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
          recipient: pendingAction.recipient,
          accountNumber: '****9999',
          amount: pendingAction.amount,
          currency: 'USD',
          type: 'WIRE',
          status: 'AUTHORIZED',
          timestamp: new Date().toISOString(),
          reference: 'AI_GENERATED_REF',
          initiatedBy: "James B. O'Callaghan (via AI)",
          riskScore: 0.05
        };
        setPayments(prev => [newPayment, ...prev]);
        logAction('WIRE_AUTHORIZED', `Authorized $${pendingAction.amount} wire to ${pendingAction.recipient}`, 'INFO', newPayment.id);
      }
      setShowMfaModal(false);
      setMfaCode("");
      setPendingAction(null);
    } else {
      alert("Invalid MFA Code. In this demo, use 123456.");
    }
  };

  // --- Render Helpers ---

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget label="Total Liquidity" value={42500000} change={12.5} unit="$" trend="up" icon={<Wallet size={24} />} />
        <StatWidget label="Pending Outbound" value={125000} change={2.1} unit="$" trend="down" icon={<ArrowUpRight size={24} />} />
        <StatWidget label="Security Score" value={98} change={0.5} unit="%" trend="up" icon={<ShieldCheck size={24} />} />
        <StatWidget label="Active Entities" value={14} change={0} unit="" trend="neutral" icon={<Globe size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard title="Cash Flow Projection" icon={<Activity size={18} />} className="lg:col-span-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Mon', inflow: 4000, outflow: 2400 },
                { name: 'Tue', inflow: 3000, outflow: 1398 },
                { name: 'Wed', inflow: 2000, outflow: 9800 },
                { name: 'Thu', inflow: 2780, outflow: 3908 },
                { name: 'Fri', inflow: 1890, outflow: 4800 },
                { name: 'Sat', inflow: 2390, outflow: 3800 },
                { name: 'Sun', inflow: 3490, outflow: 4300 },
              ]}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="inflow" stroke="#06b6d4" fillOpacity={1} fill="url(#colorIn)" strokeWidth={3} />
                <Area type="monotone" dataKey="outflow" stroke="#8b5cf6" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Asset Allocation" icon={<Layers size={18} />}>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Operating', value: 45 },
                    { name: 'Reserve', value: 25 },
                    { name: 'Investment', value: 20 },
                    { name: 'Crypto', value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CHART_COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Global Payment Engine</h2>
        <button 
          onClick={() => {
            setPendingAction({ type: 'CREATE_PAYMENT', amount: 0, recipient: '' });
            setShowMfaModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20"
        >
          <Plus size={18} />
          <span>New Transfer</span>
        </button>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-widest">
              <th className="px-6 py-4 font-semibold">Recipient / Ref</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Risk</th>
              <th className="px-6 py-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {payments.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{tx.recipient}</div>
                  <div className="text-xs text-gray-500">{tx.reference}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded bg-gray-800 text-[10px] font-bold text-gray-300">{tx.type}</span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-white">
                  ${tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'COMPLETED' ? 'bg-emerald-500' : 
                      tx.status === 'FLAGGED' ? 'bg-rose-500 animate-pulse' : 
                      'bg-amber-500'
                    }`} />
                    <span className="text-xs font-medium text-gray-300">{tx.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${tx.riskScore > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${tx.riskScore * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Immutable Audit Vault</h2>
        <div className="flex space-x-2">
          <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors">
            <Download size={18} />
          </button>
          <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {auditLogs.map((log) => (
          <div key={log.id} className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl flex items-start space-x-4 hover:border-gray-700 transition-all">
            <div className={`p-2 rounded-lg ${
              log.severity === 'CRITICAL' ? 'bg-rose-900/20 text-rose-500' : 
              log.severity === 'WARNING' ? 'bg-amber-900/20 text-amber-500' : 
              'bg-cyan-900/20 text-cyan-500'
            }`}>
              {log.severity === 'CRITICAL' ? <ShieldAlert size={20} /> : <History size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-200">{log.action}</h4>
                <span className="text-[10px] font-mono text-gray-500">{log.timestamp}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{log.details}</p>
              <div className="flex items-center space-x-4 mt-2 text-[10px] text-gray-600 font-medium uppercase tracking-tighter">
                <span>Actor: {log.actor}</span>
                <span>IP: {log.ipAddress}</span>
                {log.resourceId && <span>Ref: {log.resourceId}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-300 font-sans selection:bg-cyan-500/30">
      {/* --- Background Effects --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- Sidebar Navigation --- */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-gray-950 border-r border-gray-800 z-50 flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Aperture className="text-white animate-spin-slow" size={24} />
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tighter text-white uppercase italic">Quantum</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {[
            { id: 'overview', label: 'Command Center', icon: <LayoutDashboard size={20} /> },
            { id: 'payments', label: 'Payment Engine', icon: <CreditCard size={20} /> },
            { id: 'security', label: 'Security Vault', icon: <Shield size={20} /> },
            { id: 'audit', label: 'Audit Storage', icon: <Database size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
              }`}
            >
              <div className={activeTab === item.id ? 'text-white' : 'group-hover:text-cyan-400 transition-colors'}>
                {item.icon}
              </div>
              <span className="hidden lg:block font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-gray-900/50 border border-gray-800">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-400">
              <Fingerprint size={18} />
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-bold text-white truncate">James B. O'Callaghan</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Sovereign Architect</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="pl-20 lg:pl-64 pt-24 pb-12 px-8 min-h-screen relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-20 lg:left-64 right-0 h-20 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
            <div className="h-4 w-[1px] bg-gray-800"></div>
            <div className="flex items-center space-x-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>System Live: {CORE_AI_VERSION}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search transactions, entities..." 
                className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 w-64 transition-all"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                <Zap size={20} />
                <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full border-2 border-gray-950"></div>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'audit' && renderAudit()}
          {activeTab === 'security' && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                <ShieldCheck size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Quantum Shield Active</h2>
                <p className="text-gray-500 max-w-md mx-auto">Your environment is protected by multi-layered biometric encryption and real-time heuristic fraud monitoring.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mt-8">
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                  <Fingerprint className="text-cyan-400 mb-4" size={32} />
                  <h4 className="font-bold text-white">Biometric MFA</h4>
                  <p className="text-xs text-gray-500 mt-2">Enforced for all high-value wires and administrative changes.</p>
                </div>
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                  <Brain className="text-purple-400 mb-4" size={32} />
                  <h4 className="font-bold text-white">AI Sentinel</h4>
                  <p className="text-xs text-gray-500 mt-2">Heuristic analysis of transaction patterns to prevent zero-day fraud.</p>
                </div>
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                  <Lock className="text-emerald-400 mb-4" size={32} />
                  <h4 className="font-bold text-white">Quantum Encryption</h4>
                  <p className="text-xs text-gray-500 mt-2">All data at rest and in transit is secured via post-quantum algorithms.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Floating AI Chat Bar --- */}
        <div className="fixed bottom-8 right-8 w-96 z-50">
          <GlassCard className="!p-0 shadow-2xl border-cyan-500/20 flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sovereign AI</h4>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online & Synchronized</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <Sparkles size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-300 rounded-tl-none border border-gray-700'
                  }`}>
                    {msg.content}
                    <div className={`text-[9px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-gray-900/60 border-t border-gray-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAiCommand(userInput); }}
                className="relative"
              >
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask AI to send a wire, check logs..." 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!userInput.trim() || isAiLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400 disabled:text-gray-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </GlassCard>
        </div>
      </main>

      {/* --- MFA / Authorization Modal --- */}
      {showMfaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setShowMfaModal(false)}></div>
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 border border-cyan-500/20 mx-auto shadow-xl">
                <Fingerprint size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Authorization Required</h3>
                <p className="text-gray-500 text-sm">
                  {pendingAction?.type === 'CREATE_PAYMENT' 
                    ? `Confirming a WIRE transfer of $${pendingAction.amount.toLocaleString()} to ${pendingAction.recipient}.`
                    : "Please verify your identity to proceed with this administrative action."}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-10 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-xl font-bold text-white">
                      {mfaCode[i] || ""}
                    </div>
                  ))}
                </div>
                <input 
                  type="text" 
                  maxLength={6}
                  autoFocus
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  className="absolute inset-0 opacity-0 cursor-default"
                />
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Enter 123456 to authorize</p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowMfaModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmMfa}
                  className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-900/20"
                >
                  Authorize
                </button>
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 flex items-center justify-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <Lock size={12} />
              <span>End-to-End Encrypted Session</span>
            </div>
          </div>
        </div>
      )}

      {/* --- Footer / System Status --- */}
      <footer className="pl-20 lg:pl-64 py-6 px-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <span>© 2024 {INSTITUTION_NAME} Global</span>
          <span className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>All Systems Operational</span>
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-500 transition-colors">Security Disclosure</a>
          <span className="text-gray-800">|</span>
          <span className="text-cyan-900">Sovereign Node: 0x77ALPHA</span>
        </div>
      </footer>

      {/* --- Custom Scrollbar Styles --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};

export default NationalMetricsDashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/SovereignWealth.tsx
================================================================================

```typescript
// components/SovereignWealth.tsx
// The James Burvel O’Callaghan III Code - Citibank demo business inc
// Maximalist, Hyper-Structured Software System
// Application Architecture: Aggressively Procedural, Expert-Level Composition

import React, { useState, useEffect } from 'react';

// A. Core UI Components - The foundation of the UI
const A_Citibankdemobusinessinc_CoreUI_Header = () => <header style={{ backgroundColor: '#222', color: 'white', padding: '1em', textAlign: 'center' }}>Citibank demo business inc</header>;
const B_Citibankdemobusinessinc_CoreUI_Navigation = () => <nav style={{ backgroundColor: '#333', padding: '1em' }}><a href="#" style={{ color: 'white', marginRight: '1em' }}>Dashboard</a><a href="#" style={{ color: 'white', marginRight: '1em' }}>Features</a><a href="#" style={{ color: 'white', marginRight: '1em' }}>About</a></nav>;
const C_Citibankdemobusinessinc_CoreUI_Footer = () => <footer style={{ backgroundColor: '#222', color: 'white', padding: '1em', textAlign: 'center', marginTop: 'auto' }}>&copy; 2024 The James Burvel O’Callaghan III Code - Citibank demo business inc</footer>;
const D_Citibankdemobusinessinc_CoreUI_MainContent = ({ children }: { children: React.ReactNode }) => <main style={{ padding: '2em' }}>{children}</main>;
const E_Citibankdemobusinessinc_CoreUI_Sidebar = () => <aside style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1em', borderRight: '1px solid #ccc' }}><p>Sidebar Content</p></aside>;
const F_Citibankdemobusinessinc_CoreUI_Dashboard = () => <div style={{ padding: '1em', border: '1px solid #ccc', marginBottom: '1em' }}><p>Dashboard Panel</p></div>;
const G_Citibankdemobusinessinc_CoreUI_FeaturePanel = () => <div style={{ padding: '1em', border: '1px solid #ccc', marginBottom: '1em' }}><p>Feature Panel</p></div>;
const H_Citibankdemobusinessinc_CoreUI_AboutPanel = () => <div style={{ padding: '1em', border: '1px solid #ccc', marginBottom: '1em' }}><p>About Panel</p></div>;
const I_Citibankdemobusinessinc_CoreUI_ContentSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: '2em', border: '1px solid #eee', padding: '1em' }}>
    <h2 style={{ marginBottom: '0.5em' }}>{title}</h2>
    {children}
  </section>
);
const J_Citibankdemobusinessinc_CoreUI_Form = ({ children }: { children: React.ReactNode }) => <form style={{ marginBottom: '2em', padding: '1em', border: '1px solid #ddd' }}>{children}</form>;
const K_Citibankdemobusinessinc_CoreUI_Input = ({ label, type, name }: { label: string; type: string; name: string }) => (
  <div style={{ marginBottom: '1em' }}>
    <label htmlFor={name} style={{ display: 'block', marginBottom: '0.3em' }}>{label}</label>
    <input type={type} id={name} name={name} style={{ width: '100%', padding: '0.5em', border: '1px solid #ccc' }} />
  </div>
);
const L_Citibankdemobusinessinc_CoreUI_Button = ({ text, onClick }: { text: string; onClick: () => void }) => (
  <button style={{ backgroundColor: '#007bff', color: 'white', padding: '0.75em 1.5em', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={onClick}>{text}</button>
);
const M_Citibankdemobusinessinc_CoreUI_Table = ({ headers, data }: { headers: string[]; data: any[] }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ backgroundColor: '#f2f2f2' }}>
        {headers.map((header, index) => <th key={index} style={{ padding: '0.75em', border: '1px solid #ddd', textAlign: 'left' }}>{header}</th>)}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {headers.map((header, colIndex) => <td key={colIndex} style={{ padding: '0.75em', border: '1px solid #ddd' }}>{row[header]}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
);
const N_Citibankdemobusinessinc_CoreUI_Chart = ({ type, data }: { type: string; data: any }) => (
    <div style={{ padding: '1em', border: '1px solid #ccc', marginBottom: '1em' }}>
      <p>Chart Type: {type}</p>
      {/* Placeholder for chart rendering logic (e.g., using a charting library) */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
);
const O_Citibankdemobusinessinc_CoreUI_Tabs = ({ tabs, onTabChange, activeTab }: { tabs: { label: string; content: React.ReactNode }[]; onTabChange: (tabId: string) => void; activeTab: string }) => (
  <div style={{ marginBottom: '2em' }}>
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
        {tabs.map(tab => (
          <li key={tab.label} style={{ marginRight: '1em', cursor: 'pointer', padding: '0.5em', backgroundColor: activeTab === tab.label ? '#eee' : 'transparent', border: '1px solid #ccc' }} onClick={() => onTabChange(tab.label)}>
            {tab.label}
          </li>
        ))}
      </ul>
    </nav>
    <div>
      {tabs.find(tab => tab.label === activeTab)?.content}
    </div>
  </div>
);

// P. Data Generators - Used throughout the application
const P1_Citibankdemobusinessinc_Data_GenerateRandomString = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const P2_Citibankdemobusinessinc_Data_GenerateRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const P3_Citibankdemobusinessinc_Data_GenerateRandomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const P4_Citibankdemobusinessinc_Data_GenerateMockUserData = (count: number) => {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push({
        id: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(1, 1000),
        username: `user_${P1_Citibankdemobusinessinc_Data_GenerateRandomString(5)}`,
        email: `${P1_Citibankdemobusinessinc_Data_GenerateRandomString(8)}@example.com`,
        registrationDate: P3_Citibankdemobusinessinc_Data_GenerateRandomDate(new Date(2020, 0, 1), new Date()),
      });
    }
    return users;
};
const P5_Citibankdemobusinessinc_Data_GenerateMockTransactionData = (count: number) => {
  const transactions = [];
  for (let i = 0; i < count; i++) {
    transactions.push({
      transactionId: P1_Citibankdemobusinessinc_Data_GenerateRandomString(10),
      amount: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(10, 10000),
      currency: 'USD',
      date: P3_Citibankdemobusinessinc_Data_GenerateRandomDate(new Date(2023, 0, 1), new Date()),
      description: `Transaction ${i + 1}`,
    });
  }
  return transactions;
};
const P6_Citibankdemobusinessinc_Data_GenerateMockProductData = (count: number) => {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push({
        productId: P1_Citibankdemobusinessinc_Data_GenerateRandomString(8),
        name: `Product ${i + 1}`,
        description: `This is product ${i + 1}`,
        price: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(20, 500),
        stock: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(0, 100),
      });
    }
    return products;
};
const P7_Citibankdemobusinessinc_Data_GenerateMockOrderData = (count: number, productData: any[]) => {
  const orders = [];
  for (let i = 0; i < count; i++) {
    const productIndex = P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(0, productData.length - 1);
    const selectedProduct = productData[productIndex];

    orders.push({
      orderId: P1_Citibankdemobusinessinc_Data_GenerateRandomString(12),
      customerId: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(1, 100),
      productId: selectedProduct.productId,
      productName: selectedProduct.name,
      quantity: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(1, 5),
      orderDate: P3_Citibankdemobusinessinc_Data_GenerateRandomDate(new Date(2023, 0, 1), new Date()),
      totalAmount: selectedProduct.price * P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(1, 5),
    });
  }
  return orders;
};
const P8_Citibankdemobusinessinc_Data_GenerateMockFinancialData = (count: number) => {
  const financialData = [];
  for (let i = 0; i < count; i++) {
    financialData.push({
      date: P3_Citibankdemobusinessinc_Data_GenerateRandomDate(new Date(2023, 0, 1), new Date()),
      revenue: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(10000, 100000),
      expenses: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(5000, 50000),
      profit: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(1000, 50000),
    });
  }
  return financialData;
};
const P9_Citibankdemobusinessinc_Data_GenerateMockCustomerSupportData = (count: number) => {
  const supportTickets = [];
  for (let i = 0; i < count; i++) {
    supportTickets.push({
      ticketId: P1_Citibankdemobusinessinc_Data_GenerateRandomString(10),
      customerId: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(1, 100),
      subject: `Support Request ${i + 1}`,
      description: `Description for support request ${i + 1}`,
      status: ['Open', 'In Progress', 'Resolved'][P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(0, 2)],
      dateCreated: P3_Citibankdemobusinessinc_Data_GenerateRandomDate(new Date(2023, 0, 1), new Date()),
    });
  }
  return supportTickets;
};
const P10_Citibankdemobusinessinc_Data_GenerateMockMarketingData = (count: number) => {
    const marketingCampaigns = [];
    for (let i = 0; i < count; i++) {
      marketingCampaigns.push({
        campaignId: P1_Citibankdemobusinessinc_Data_GenerateRandomString(10),
        name: `Campaign ${i + 1}`,
        startDate: P3_Citibankdemobusinessinc_Data_GenerateRandomDate(new Date(2023, 0, 1), new Date()),
        endDate: P3_Citibankdemobusinessinc_Data_GenerateRandomDate(new Date(2023, 6, 1), new Date()),
        channel: ['Email', 'Social Media', 'Paid Ads'][P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(0, 2)],
        budget: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(1000, 10000),
        clicks: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(100, 1000),
        conversions: P2_Citibankdemobusinessinc_Data_GenerateRandomNumber(10, 100),
      });
    }
    return marketingCampaigns;
  };


// Q. Feature Modules - Core business logic, each meticulously detailed
// Q1. Citibankdemobusinessinc.OpenBankingPlatform
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_MissionStatement = () => "To provide a secure, scalable, and compliant open banking platform, facilitating seamless data exchange and empowering third-party developers to create innovative financial solutions, thereby fostering a vibrant and competitive financial ecosystem.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_Monetization = () => "Transaction fees, premium API access, data analytics subscriptions, and white-label platform licensing.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_DefensibleMoat = () => "Secure and compliant data infrastructure, developer community, proprietary AI-driven fraud detection, and regulatory compliance expertise.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_AutoScaling = () => "Horizontally scaled microservices architecture using Kubernetes, with automated scaling based on API request volume and data processing needs.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_RegulatoryAlignment = () => "Fully compliant with PSD2, GDPR, CCPA, and other relevant regulations through continuous monitoring, automated reporting, and proactive adaptation to regulatory changes.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_RiskDetection = () => "Real-time fraud detection using machine learning models, transaction monitoring, and anomaly detection based on user behavior and financial patterns. Continuous risk assessment and proactive alerts.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_LiquidityMonitoring = () => "Real-time monitoring of cash flow, liquidity ratios, and stress testing scenarios to ensure financial stability and solvency. Automated alerts based on pre-defined thresholds and risk appetite.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_Governance = () => "A comprehensive governance framework including a board-level oversight committee, clear policies and procedures, and internal controls to manage risk, ensure compliance, and promote ethical conduct. Regular audits and reviews.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_ComplianceAutomation = () => "Automated compliance checks, reporting, and documentation to ensure adherence to all applicable regulations. Integration with regulatory sandboxes for testing and validation.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_AuditSimulation = () => "Internal audit simulations to proactively identify and address potential compliance gaps. Automated testing and validation of security controls.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_RBAC = () => "Role-Based Access Control (RBAC) to restrict access to sensitive data and functionalities based on user roles and responsibilities. Granular permissions and audit trails.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_Telemetry = () => "Comprehensive monitoring of system performance, user behavior, and security events through a centralized telemetry system. Real-time dashboards and alerting.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_EncryptedStorage = () => "End-to-end encryption of all sensitive data, both in transit and at rest, using industry-standard encryption algorithms and key management practices.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_PrivacyFirst = () => "Privacy-by-design principles incorporated into all aspects of the platform, including data minimization, consent management, and data anonymization techniques.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_Documentation = () => "Automated documentation generation for APIs, system architecture, and user guides. Version control and regular updates.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_ArchitectureDiagrams = () => "Automated generation of architecture diagrams to visualize the system components, data flows, and dependencies. Regular updates based on code changes.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_CodeExplanation = () => "Integrated code explanation tools to provide clear and concise explanations of the codebase. Automated comment generation and code analysis.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_Debugging = () => "Integrated debugging tools and logging mechanisms to facilitate error identification and resolution. Real-time monitoring and alerting.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_TestingFramework = () => "Automated unit testing, integration testing, and end-to-end testing to ensure code quality and system reliability. Continuous integration and delivery.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_RuntimeLibraries = () => "Custom-built, zero-dependency runtime libraries for core functionalities, ensuring stability and performance. Optimized for the platform's specific needs.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_UserDashboard = () => "A personalized dashboard for each user, providing access to their accounts, transactions, and insights. Customizable views and real-time updates.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_AdminDashboard = () => "A comprehensive dashboard for administrators, providing access to system-level information, user management, and configuration settings. Security and performance monitoring.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_CLI = () => "A command-line interface (CLI) for system administration and automation tasks. Scripting capabilities and integration with CI/CD pipelines.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_GUI = () => "A rich graphical user interface (GUI) for system management, configuration, and monitoring. User-friendly interface and intuitive navigation.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_FileOutput = () => "Automated file output for generating reports, logs, and other data in various formats. Customizable templates and scheduling options.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_PluginSystem = () => "A modular plugin system to extend the platform's functionality. Support for third-party integrations and custom modules.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_OfflineFirst = () => "Design for offline-first capabilities, allowing users to access and interact with data even without an internet connection. Data synchronization and caching.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_Resilience = () => "Built-in resilience mechanisms, including automatic failover, data replication, and disaster recovery plans. High availability and fault tolerance.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_UpgradePaths = () => "Stable upgrade paths and backward compatibility to ensure smooth transitions between versions. Automated testing and rollback mechanisms.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_ContainerSafe = () => "Containerized architecture for easy deployment, scalability, and portability across different environments. Docker and Kubernetes support.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_HardwareAgnostic = () => "Hardware-agnostic design to run on any infrastructure, including cloud, on-premise, and hybrid environments. Optimized for performance and resource efficiency.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_SingleBinary = () => "Option to create a single-binary output for simplified deployment and execution. Includes all dependencies and configurations.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_ErrorHandling = () => "Robust error handling with detailed error messages and logging. Support for debugging and troubleshooting.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_HumanReadableErrors = () => "Human-readable error messages for easy understanding and resolution. Contextual information and suggested actions.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_TrainingModules = () => "In-app training modules to guide users through the platform's features and functionalities. Interactive tutorials and documentation.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_Onboarding = () => "Automated onboarding process for new users, including account setup, configuration, and access control. Step-by-step guides and support.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_Analytics = () => "Built-in analytics to track platform usage, performance, and user behavior. Customizable dashboards and reports.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_Forecasting = () => "Forecasting dashboards to predict future trends and identify potential risks. Data visualization and predictive analytics.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_VisualDataGeneration = () => "Tools for generating visual data representations, such as charts and graphs. Customizable visualizations and data export options.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_InterBranchSyncing = () => "Mechanism for inter-branch data synchronization and communication, enabling seamless data flow across different modules.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_SharedKernel = () => "A shared kernel across all applications, providing a common set of services and utilities. Code reusability and consistency.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_CustomLogic = () => "Support for custom logic per branch, allowing for tailored functionality and integrations. Extensible architecture.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_RegulatoryReporting = () => "Templates for generating regulatory reports, such as financial statements and compliance reports. Automated data extraction and reporting.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_ExecutiveSummaries = () => "Tools for generating executive summaries of key performance indicators and business insights. Automated report generation.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_InvestorDecks = () => "Tools for generating investor decks with financial projections and market analysis. Customizable templates and data visualizations.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_CompetitiveAnalysis = () => "Engines for performing competitive analysis and identifying market opportunities. Data-driven insights and market research.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_MarketGapEvaluation = () => "Tools for evaluating market gaps and identifying unmet customer needs. Market research and data analysis.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_CustomerPersonaGeneration = () => "Tools for generating customer personas and understanding customer behavior. Data-driven insights and segmentation.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_ProductRoadmapping = () => "Tools for product roadmapping and prioritization. Agile development and iterative releases.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_MilestoneSystems = () => "Milestone tracking and management systems to monitor progress and ensure timely completion of projects. Project management and task tracking.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_AdoptionCurveAnalysis = () => "Tools for analyzing adoption curves and predicting market penetration. Data analysis and forecasting.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_PricingEngines = () => "Pricing engines to optimize pricing strategies and maximize revenue. Dynamic pricing and competitive analysis.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_ChurnPrediction = () => "Churn prediction models to identify customers at risk of churn and proactively address their needs. Customer retention strategies.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_PartnershipFrameworks = () => "Frameworks for establishing and managing partnerships with other organizations. Collaboration and integration.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_PrivacyCompliance = () => "Templates and tools for privacy compliance, including data privacy impact assessments (DPIAs) and data protection agreements (DPAs). GDPR and CCPA compliance.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_FinancialStatements = () => "Automated generation of financial statements, including balance sheets, income statements, and cash flow statements. Financial reporting and analysis.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_ValuationCalculators = () => "Valuation calculators to determine the fair market value of assets and businesses. Investment analysis and financial modeling.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_IPOReadinessScoring = () => "IPO readiness scoring to assess a company's preparedness for an initial public offering. Financial analysis and risk assessment.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_GlobalExpansion = () => "Logic for global expansion and market entry. Regulatory compliance and localization strategies.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_RiskWeightedAssets = () => "Risk-weighted asset calculators to assess the riskiness of assets and investments. Financial risk management.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_StressScenarios = () => "Stress-scenario generators to simulate extreme market conditions and assess the impact on financial performance. Risk management and financial planning.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_LiquiditySimulations = () => "Liquidity simulations to assess the company's ability to meet its financial obligations. Cash flow management and financial planning.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_CapitalPlanning = () => "Capital planning engines to optimize capital allocation and financial performance. Investment analysis and financial modeling.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_RulesEngines = () => "Rules engines to automate business processes and ensure compliance. Workflow automation and decision support.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_EscalationLogic = () => "Automated escalation logic for handling critical issues and ensuring timely resolution. Incident management and support.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_SustainabilityMetrics = () => "Sustainability metrics and reporting tools to track environmental and social impact. ESG reporting and analysis.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_EnvironmentalModeling = () => "Environmental modeling capabilities to assess the environmental impact of business operations. Sustainability planning and resource management.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_WorkforcePlanning = () => "Workforce planning software to optimize staffing levels and manage human resources. Talent management and organizational planning.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_OrgStructure = () => "Org-structure generation capabilities to visualize and manage organizational structures. Organizational design and planning.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_BoardPack = () => "Tools for generating board packs with financial performance and strategic updates. Executive reporting and governance.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_OpenBankingStrategy = () => "Open banking strategy layers to integrate with external financial institutions and provide financial services. Integration and partnership management.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_CrossBranchOrchestration = () => "Cross-branch orchestration to coordinate operations and data flow between different branches within the open banking platform. Workflow management and integration.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_InternalEventBus = () => "Internal event bus to enable real-time communication and data sharing between different modules. Asynchronous messaging and event-driven architecture.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_SharedIdentity = () => "Shared identity layer for secure user authentication and authorization across the platform. Identity management and access control.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_UnifiedConfiguration = () => "Unified configuration layer to manage platform settings and configurations centrally. System configuration and management.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_SchemaAutoGeneration = () => "Schema auto-generation for data models and APIs. Automatic documentation and code generation.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_AutomatedLinking = () => "Automated linking between branches for seamless data exchange and integration. Workflow automation and system integration.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_SecurityPrimitives = () => "Common security primitives for secure coding and system security. Encryption, authentication, and authorization.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_MessagingQueues = () => "Internal messaging queues for asynchronous communication and data processing. Message queuing and event-driven architecture.";
const Q1_Citibankdemobusinessinc_OpenBankingPlatform_DeterministicBuild = () => "Deterministic build-generation for reproducible deployments and consistent results. Version control and build automation.";

// Q2. Citibankdemobusinessinc.AIpoweredFinancialAdvisor
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_MissionStatement = () => "To provide personalized financial advice and investment management through an AI-powered platform, empowering individuals to achieve their financial goals with confidence and ease.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_Monetization = () => "Subscription fees, asset management fees, and premium service packages.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_DefensibleMoat = () => "Proprietary AI algorithms, personalized investment strategies, user data, and a strong brand reputation.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_AutoScaling = () => "Scalable cloud-based infrastructure with automated scaling based on user volume and data processing needs.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_RegulatoryAlignment = () => "Compliance with all relevant financial regulations, including KYC/AML and investment advisory regulations.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_RiskDetection = () => "Real-time risk assessment and fraud detection using AI-driven anomaly detection and behavioral analysis.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_LiquidityMonitoring = () => "Monitoring of portfolio liquidity and optimization of asset allocation to ensure financial stability.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_Governance = () => "A comprehensive governance framework to manage risk, ensure compliance, and promote ethical conduct. Independent oversight and regular audits.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_ComplianceAutomation = () => "Automated compliance checks and reporting to ensure adherence to all applicable financial regulations.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_AuditSimulation = () => "Internal audit simulations to proactively identify and address potential compliance gaps.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_RBAC = () => "Role-Based Access Control (RBAC) to restrict access to sensitive data and functionalities based on user roles and responsibilities.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_Telemetry = () => "Comprehensive monitoring of system performance, user behavior, and security events through a centralized telemetry system.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_EncryptedStorage = () => "End-to-end encryption of all sensitive data, both in transit and at rest, using industry-standard encryption algorithms and key management practices.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_PrivacyFirst = () => "Privacy-by-design principles incorporated into all aspects of the platform, including data minimization, consent management, and data anonymization techniques.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_Documentation = () => "Automated documentation generation for APIs, system architecture, and user guides. Version control and regular updates.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_ArchitectureDiagrams = () => "Automated generation of architecture diagrams to visualize the system components, data flows, and dependencies. Regular updates based on code changes.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_CodeExplanation = () => "Integrated code explanation tools to provide clear and concise explanations of the codebase. Automated comment generation and code analysis.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_Debugging = () => "Integrated debugging tools and logging mechanisms to facilitate error identification and resolution. Real-time monitoring and alerting.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_TestingFramework = () => "Automated unit testing, integration testing, and end-to-end testing to ensure code quality and system reliability. Continuous integration and delivery.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_RuntimeLibraries = () => "Custom-built, zero-dependency runtime libraries for core functionalities, ensuring stability and performance. Optimized for the platform's specific needs.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_UserDashboard = () => "A personalized dashboard for each user, providing access to their accounts, investments, and financial insights. Customizable views and real-time updates.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_AdminDashboard = () => "A comprehensive dashboard for administrators, providing access to system-level information, user management, and configuration settings. Security and performance monitoring.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_CLI = () => "A command-line interface (CLI) for system administration and automation tasks. Scripting capabilities and integration with CI/CD pipelines.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_GUI = () => "A rich graphical user interface (GUI) for system management, configuration, and monitoring. User-friendly interface and intuitive navigation.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_FileOutput = () => "Automated file output for generating reports, logs, and other data in various formats. Customizable templates and scheduling options.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_PluginSystem = () => "A modular plugin system to extend the platform's functionality. Support for third-party integrations and custom modules.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_OfflineFirst = () => "Design for offline-first capabilities, allowing users to access and interact with data even without an internet connection. Data synchronization and caching.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_Resilience = () => "Built-in resilience mechanisms, including automatic failover, data replication, and disaster recovery plans. High availability and fault tolerance.";
const Q2_Citibankdemobusinessinc_AIpoweredFinancialAdvisor_UpgradePaths = () => "Stable upgrade paths and backward compatibility to ensure smooth transitions between versions. Automated testing and rollback mechanisms.";
const Q2_Citibankdemobusinessinc_

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SovereignWealth.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Settings, DollarSign, Activity, TrendingUp, Zap, Server, Shield, Globe, 
  Cpu, BarChart3, ZapIcon, Rocket, Brain, Landmark, Clock, Database, 
  Aperture, Send, ShieldCheck, ShieldAlert, Fingerprint, History, 
  Layers, LayoutDashboard, CreditCard, Wallet, ArrowUpRight, ArrowDownLeft,
  Search, MessageSquare, Bot, Sparkles, Terminal, Lock, Eye, EyeOff,
  FileText, Share2, Download, Filter, Plus, Trash2, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - THE SOVEREIGN COMMAND CENTER
 * 
 * PHILOSOPHY:
 * - This is a "Golden Ticket" experience.
 * - We are letting the user "Test Drive" the car (the code).
 * - It must have "Bells and Whistles" - distinct features, high polish.
 * - It is a "Cheat Sheet" for business banking.
 * - NO PRESSURE environment.
 * - Metaphor: Kick the tires. See the engine roar.
 * 
 * TECHNICAL REQUIREMENTS:
 * - Robust Payment & Collection capabilities (Wire, ACH).
 * - Security is non-negotiable (Multi-factor auth simulations, Fraud monitoring).
 * - Reporting & Analytics (Data visualization).
 * - Integration capabilities (ERP, Accounting).
 * - AUDIT STORAGE: Every sensitive action must be logged.
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

type PaymentType = 'WIRE' | 'ACH' | 'SWIFT' | 'INTERNAL';
type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'FLAGGED';

interface PaymentOrder {
  id: string;
  recipient: string;
  accountNumber: string;
  routingNumber?: string;
  swiftCode?: string;
  amount: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  timestamp: string;
  reference: string;
  initiatedBy: string;
  riskScore: number;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  resourceId?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: any;
}

interface SecurityMetric {
  name: string;
  value: number;
  status: 'SECURE' | 'MONITORING' | 'THREAT_DETECTED';
}

interface BusinessMetric {
  label: string;
  value: number;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
}

// ================================================================================================
// CONSTANTS & MOCK DATA
// ================================================================================================

const CORE_AI_VERSION = "QuantumIntelligence_v9.4.2";
const INSTITUTION_NAME = "Quantum Financial";

const INITIAL_PAYMENTS: PaymentOrder[] = [
  { id: 'TX-9901', recipient: 'Global Logistics Corp', accountNumber: '****8821', routingNumber: '12200024', amount: 450000, currency: 'USD', type: 'WIRE', status: 'COMPLETED', timestamp: new Date(Date.now() - 86400000).toISOString(), reference: 'INV-2024-001', initiatedBy: 'James B. O\'Callaghan', riskScore: 0.02 },
  { id: 'TX-9902', recipient: 'Cloud Infrastructure Ltd', accountNumber: '****4412', routingNumber: '02100002', amount: 125000, currency: 'USD', type: 'ACH', status: 'PROCESSING', timestamp: new Date(Date.now() - 3600000).toISOString(), reference: 'MONTHLY_SUBSCRIPTION', initiatedBy: 'System Auto-Pay', riskScore: 0.01 },
  { id: 'TX-9903', recipient: 'Unknown Entity X', accountNumber: '****0000', swiftCode: 'UNKNUS33', amount: 2500000, currency: 'USD', type: 'SWIFT', status: 'FLAGGED', timestamp: new Date().toISOString(), reference: 'URGENT_TRANSFER', initiatedBy: 'External API', riskScore: 0.89 },
];

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  { id: 'LOG-001', timestamp: new Date(Date.now() - 172800000).toISOString(), action: 'USER_LOGIN', actor: 'James B. O\'Callaghan', details: 'Successful login via Biometric MFA', ipAddress: '192.168.1.105', severity: 'INFO' },
  { id: 'LOG-002', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'WIRE_INITIATED', actor: 'James B. O\'Callaghan', details: 'Wire transfer of $450,000 to Global Logistics Corp', ipAddress: '192.168.1.105', severity: 'INFO', resourceId: 'TX-9901' },
  { id: 'LOG-003', timestamp: new Date().toISOString(), action: 'SECURITY_ALERT', actor: 'Quantum Sentinel', details: 'High-risk SWIFT transfer detected and quarantined', ipAddress: 'Internal AI', severity: 'CRITICAL', resourceId: 'TX-9903' },
];

const CHART_COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

// ================================================================================================
// HELPER COMPONENTS
// ================================================================================================

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; title?: string; icon?: React.ReactNode }> = ({ children, className = "", title, icon }) => (
  <div className={`bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-cyan-500/30 ${className}`}>
    {(title || icon) && (
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/40">
        <div className="flex items-center space-x-3">
          {icon && <div className="text-cyan-400">{icon}</div>}
          {title && <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300">{title}</h3>}
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
        </div>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

const StatWidget: React.FC<BusinessMetric & { icon: React.ReactNode }> = ({ label, value, change, unit, trend, icon }) => (
  <div className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800 hover:bg-gray-800/40 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-gray-800 text-cyan-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className={`flex items-center space-x-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
        <span>{change}%</span>
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline space-x-1">
        <h4 className="text-2xl font-bold text-white">
          {unit === '$' && '$'}
          {value.toLocaleString()}
          {unit !== '$' && unit}
        </h4>
      </div>
    </div>
  </div>
);

// ================================================================================================
// MAIN DASHBOARD COMPONENT
// ================================================================================================

const NationalMetricsDashboard: React.FC = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'security' | 'audit'>('overview');
  const [payments, setPayments] = useState<PaymentOrder[]>(INITIAL_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: "Welcome to the Quantum Financial Command Center. I am your Sovereign AI co-pilot. How can I assist with your global treasury operations today?", timestamp: new Date().toISOString() }
  ]);
  const [userInput, setUserInput] = useState("");
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [mfaCode, setMfaCode] = useState("");
  
  // --- Refs ---
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [chatHistory]);

  // --- AI Logic ---
  const genAI = useMemo(() => {
    const apiKey = process.env.GEMINI_API_KEY || "DEMO_MODE";
    return new GoogleGenAI(apiKey);
  }, []);

  const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'INFO', resourceId?: string) => {
    const newEntry: AuditEntry = {
      id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      actor: "James B. O'Callaghan",
      details,
      ipAddress: "192.168.1.105",
      severity,
      resourceId
    };
    setAuditLogs(prev => [newEntry, ...prev]);
    console.log(`[AUDIT STORAGE] ${action}: ${details}`);
  }, []);

  const handleAiCommand = async (input: string) => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMsg]);
    setUserInput("");
    setIsAiLoading(true);

    try {
      // Simulated Intent Parsing for the "Test Drive" experience
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes("send") || lowerInput.includes("wire") || lowerInput.includes("pay")) {
        // Simulate a payment creation intent
        const amountMatch = input.match(/\d+/);
        const amount = amountMatch ? parseInt(amountMatch[0]) : 50000;
        
        setTimeout(() => {
          const aiMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: `I've prepared a draft WIRE transfer for $${amount.toLocaleString()} to the requested recipient. For security, please authorize this action in the Payments tab or via the MFA prompt I'm about to trigger.`, 
            timestamp: new Date().toISOString() 
          };
          setChatHistory(prev => [...prev, aiMsg]);
          setIsAiLoading(false);
          
          // Trigger MFA for the "Bells and Whistles"
          setPendingAction({ type: 'CREATE_PAYMENT', amount, recipient: 'AI Requested Recipient' });
          setShowMfaModal(true);
        }, 1500);
        return;
      }

      if (lowerInput.includes("audit") || lowerInput.includes("logs")) {
        setTimeout(() => {
          const aiMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: `Retrieving the last 5 high-severity audit entries... System is nominal. No unauthorized access attempts detected in the last 24 hours.`, 
            timestamp: new Date().toISOString() 
          };
          setChatHistory(prev => [...prev, aiMsg]);
          setIsAiLoading(false);
          setActiveTab('audit');
        }, 1000);
        return;
      }

      // Default Gemini Call
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `You are the Quantum Financial Sovereign AI. You are helping a high-net-worth business user manage a global bank demo. 
      The user said: "${input}". 
      Context: We are in a "Golden Ticket" demo environment. Be professional, elite, and helpful. 
      Do not mention Citibank. Use "Quantum Financial". 
      Keep it concise and focused on business banking, treasury, and security.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: text, timestamp: new Date().toISOString() };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: "I'm currently operating in offline mode due to a synchronization delay, but I can still process local treasury commands. Try asking me to 'Send a wire' or 'Show audit logs'.", timestamp: new Date().toISOString() };
      setChatHistory(prev => [...prev, aiMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const confirmMfa = () => {
    if (mfaCode === "123456" || mfaCode === "000000") {
      if (pendingAction?.type === 'CREATE_PAYMENT') {
        const newPayment: PaymentOrder = {
          id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
          recipient: pendingAction.recipient,
          accountNumber: '****9999',
          amount: pendingAction.amount,
          currency: 'USD',
          type: 'WIRE',
          status: 'AUTHORIZED',
          timestamp: new Date().toISOString(),
          reference: 'AI_GENERATED_REF',
          initiatedBy: "James B. O'Callaghan (via AI)",
          riskScore: 0.05
        };
        setPayments(prev => [newPayment, ...prev]);
        logAction('WIRE_AUTHORIZED', `Authorized $${pendingAction.amount} wire to ${pendingAction.recipient}`, 'INFO', newPayment.id);
      }
      setShowMfaModal(false);
      setMfaCode("");
      setPendingAction(null);
    } else {
      alert("Invalid MFA Code. In this demo, use 123456.");
    }
  };

  // --- Render Helpers ---

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget label="Total Liquidity" value={42500000} change={12.5} unit="$" trend="up" icon={<Wallet size={24} />} />
        <StatWidget label="Pending Outbound" value={125000} change={2.1} unit="$" trend="down" icon={<ArrowUpRight size={24} />} />
        <StatWidget label="Security Score" value={98} change={0.5} unit="%" trend="up" icon={<ShieldCheck size={24} />} />
        <StatWidget label="Active Entities" value={14} change={0} unit="" trend="neutral" icon={<Globe size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard title="Cash Flow Projection" icon={<Activity size={18} />} className="lg:col-span-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Mon', inflow: 4000, outflow: 2400 },
                { name: 'Tue', inflow: 3000, outflow: 1398 },
                { name: 'Wed', inflow: 2000, outflow: 9800 },
                { name: 'Thu', inflow: 2780, outflow: 3908 },
                { name: 'Fri', inflow: 1890, outflow: 4800 },
                { name: 'Sat', inflow: 2390, outflow: 3800 },
                { name: 'Sun', inflow: 3490, outflow: 4300 },
              ]}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="inflow" stroke="#06b6d4" fillOpacity={1} fill="url(#colorIn)" strokeWidth={3} />
                <Area type="monotone" dataKey="outflow" stroke="#8b5cf6" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Asset Allocation" icon={<Layers size={18} />}>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Operating', value: 45 },
                    { name: 'Reserve', value: 25 },
                    { name: 'Investment', value: 20 },
                    { name: 'Crypto', value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CHART_COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Global Payment Engine</h2>
        <button 
          onClick={() => {
            setPendingAction({ type: 'CREATE_PAYMENT', amount: 0, recipient: '' });
            setShowMfaModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20"
        >
          <Plus size={18} />
          <span>New Transfer</span>
        </button>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-widest">
              <th className="px-6 py-4 font-semibold">Recipient / Ref</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Risk</th>
              <th className="px-6 py-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {payments.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{tx.recipient}</div>
                  <div className="text-xs text-gray-500">{tx.reference}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded bg-gray-800 text-[10px] font-bold text-gray-300">{tx.type}</span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-white">
                  ${tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'COMPLETED' ? 'bg-emerald-500' : 
                      tx.status === 'FLAGGED' ? 'bg-rose-500 animate-pulse' : 
                      'bg-amber-500'
                    }`} />
                    <span className="text-xs font-medium text-gray-300">{tx.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${tx.riskScore > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${tx.riskScore * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Immutable Audit Vault</h2>
        <div className="flex space-x-2">
          <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors">
            <Download size={18} />
          </button>
          <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {auditLogs.map((log) => (
          <div key={log.id} className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl flex items-start space-x-4 hover:border-gray-700 transition-all">
            <div className={`p-2 rounded-lg ${
              log.severity === 'CRITICAL' ? 'bg-rose-900/20 text-rose-500' : 
              log.severity === 'WARNING' ? 'bg-amber-900/20 text-amber-500' : 
              'bg-cyan-900/20 text-cyan-500'
            }`}>
              {log.severity === 'CRITICAL' ? <ShieldAlert size={20} /> : <History size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-200">{log.action}</h4>
                <span className="text-[10px] font-mono text-gray-500">{log.timestamp}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{log.details}</p>
              <div className="flex items-center space-x-4 mt-2 text-[10px] text-gray-600 font-medium uppercase tracking-tighter">
                <span>Actor: {log.actor}</span>
                <span>IP: {log.ipAddress}</span>
                {log.resourceId && <span>Ref: {log.resourceId}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-300 font-sans selection:bg-cyan-500/30">
      {/* --- Background Effects --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- Sidebar Navigation --- */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-gray-950 border-r border-gray-800 z-50 flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Aperture className="text-white animate-spin-slow" size={24} />
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tighter text-white uppercase italic">Quantum</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {[
            { id: 'overview', label: 'Command Center', icon: <LayoutDashboard size={20} /> },
            { id: 'payments', label: 'Payment Engine', icon: <CreditCard size={20} /> },
            { id: 'security', label: 'Security Vault', icon: <Shield size={20} /> },
            { id: 'audit', label: 'Audit Storage', icon: <Database size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
              }`}
            >
              <div className={activeTab === item.id ? 'text-white' : 'group-hover:text-cyan-400 transition-colors'}>
                {item.icon}
              </div>
              <span className="hidden lg:block font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-gray-900/50 border border-gray-800">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-400">
              <Fingerprint size={18} />
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-bold text-white truncate">James B. O'Callaghan</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Sovereign Architect</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="pl-20 lg:pl-64 pt-24 pb-12 px-8 min-h-screen relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-20 lg:left-64 right-0 h-20 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
            <div className="h-4 w-[1px] bg-gray-800"></div>
            <div className="flex items-center space-x-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>System Live: {CORE_AI_VERSION}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search transactions, entities..." 
                className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 w-64 transition-all"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                <Zap size={20} />
                <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full border-2 border-gray-950"></div>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'audit' && renderAudit()}
          {activeTab === 'security' && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                <ShieldCheck size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Quantum Shield Active</h2>
                <p className="text-gray-500 max-w-md mx-auto">Your environment is protected by multi-layered biometric encryption and real-time heuristic fraud monitoring.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mt-8">
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                  <Fingerprint className="text-cyan-400 mb-4" size={32} />
                  <h4 className="font-bold text-white">Biometric MFA</h4>
                  <p className="text-xs text-gray-500 mt-2">Enforced for all high-value wires and administrative changes.</p>
                </div>
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                  <Brain className="text-purple-400 mb-4" size={32} />
                  <h4 className="font-bold text-white">AI Sentinel</h4>
                  <p className="text-xs text-gray-500 mt-2">Heuristic analysis of transaction patterns to prevent zero-day fraud.</p>
                </div>
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl">
                  <Lock className="text-emerald-400 mb-4" size={32} />
                  <h4 className="font-bold text-white">Quantum Encryption</h4>
                  <p className="text-xs text-gray-500 mt-2">All data at rest and in transit is secured via post-quantum algorithms.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Floating AI Chat Bar --- */}
        <div className="fixed bottom-8 right-8 w-96 z-50">
          <GlassCard className="!p-0 shadow-2xl border-cyan-500/20 flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sovereign AI</h4>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online & Synchronized</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <Sparkles size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-300 rounded-tl-none border border-gray-700'
                  }`}>
                    {msg.content}
                    <div className={`text-[9px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-gray-900/60 border-t border-gray-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAiCommand(userInput); }}
                className="relative"
              >
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask AI to send a wire, check logs..." 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!userInput.trim() || isAiLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400 disabled:text-gray-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </GlassCard>
        </div>
      </main>

      {/* --- MFA / Authorization Modal --- */}
      {showMfaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setShowMfaModal(false)}></div>
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 border border-cyan-500/20 mx-auto shadow-xl">
                <Fingerprint size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Authorization Required</h3>
                <p className="text-gray-500 text-sm">
                  {pendingAction?.type === 'CREATE_PAYMENT' 
                    ? `Confirming a WIRE transfer of $${pendingAction.amount.toLocaleString()} to ${pendingAction.recipient}.`
                    : "Please verify your identity to proceed with this administrative action."}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-10 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-xl font-bold text-white">
                      {mfaCode[i] || ""}
                    </div>
                  ))}
                </div>
                <input 
                  type="text" 
                  maxLength={6}
                  autoFocus
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  className="absolute inset-0 opacity-0 cursor-default"
                />
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Enter 123456 to authorize</p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowMfaModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmMfa}
                  className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-900/20"
                >
                  Authorize
                </button>
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 flex items-center justify-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <Lock size={12} />
              <span>End-to-End Encrypted Session</span>
            </div>
          </div>
        </div>
      )}

      {/* --- Footer / System Status --- */}
      <footer className="pl-20 lg:pl-64 py-6 px-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <span>© 2024 {INSTITUTION_NAME} Global</span>
          <span className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>All Systems Operational</span>
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-500 transition-colors">Security Disclosure</a>
          <span className="text-gray-800">|</span>
          <span className="text-cyan-900">Sovereign Node: 0x77ALPHA</span>
        </div>
      </footer>

      {/* --- Custom Scrollbar Styles --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};

export default NationalMetricsDashboard;