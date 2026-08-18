// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/QuantumOracleView.tsx
================================================================================

import React, { useState, useContext, useReducer, useEffect, useRef } from 'react';
import Card from '../../Card';
import { DataContext } from '../../../context/DataContext';
import { GoogleGenAI } from '@google/genai';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FaFilePdf, FaRobot, FaChartLine, FaFlask, FaExclamationTriangle, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


// --- TYPE DEFINITIONS ---

interface KPI {
  name: string;
  category: 'Income' | 'Savings' | 'Debt' | 'Investments' | 'Net Worth' | 'Expenses' | 'Risk' | 'Goals' | 'Lifestyle';
  baselineValue: number;
  projectedValue: number;
  unit: string;
  changePercentage: number;
  severity: 'low' | 'medium' | 'high' | 'neutral' | 'critical';
  description: string;
}

interface TimeSeriesPoint {
  month: number;
  netWorth: number;
  savingsBalance: number;
  debtBalance: number;
  investmentValue: number;
  discretionaryCash: number;
  emergencyFundCoverage: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

interface MonteCarloPath {
  percentile: '10th' | '50th' | '90th';
  finalNetWorth: number;
  monthsToRecovery: number | null;
  goalAchievementProbability: number;
}

interface AssetAllocation {
  name: string;
  value: number;
}

interface SimulationRequest {
  prompt: string;
  parameters: {
    durationMonths: number;
    amountUSD: number;
    marketCondition: 'bear' | 'neutral' | 'bull';
    inflationScenario: 'low' | 'average' | 'high';
  };
  currentFinancialState: UserFinancialProfile;
}

interface SimulationResponse {
  simulationId: string;
  narrativeSummary: string;
  shortTermOutlook: string;
  longTermProjections: string;
  keyImpacts: {
    metric: string;
    value: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  recommendations: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category: 'Savings' | 'Debt' | 'Investment' | 'Income' | 'Spending';
  }[];
  kpis: KPI[];
  projectedTimeSeries: TimeSeriesPoint[];
  monteCarloAnalysis: {
    summary: string;
    paths: MonteCarloPath[];
  };
  projectedAssetAllocation: {
    baseline: AssetAllocation[];
    projected: AssetAllocation[];
  };
}

interface UserFinancialProfile {
    totalAssets: number;
    totalLiabilities: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    emergencyFund: number;
    savingsGoals: { name: string; target: number; current: number }[];
    investmentAccounts: { name: string; value: number; type: string }[];
    debtAccounts: { name: string; balance: number; monthlyPayment: number; interestRate: number }[];
    creditScore: number;
    age: number;
    employmentStatus: string;
    riskTolerance: 'Low' | 'Moderate' | 'High';
}

const defaultUserData: UserFinancialProfile = {
  totalAssets: 150000,
  totalLiabilities: 75000,
  monthlyIncome: 6000,
  monthlyExpenses: 4500,
  emergencyFund: 12000,
  savingsGoals: [
    { name: "Condo Down Payment", target: 50000, current: 15000 },
    { name: "Retirement Early", target: 1000000, current: 50000 }
  ],
  investmentAccounts: [
    { name: "Roth IRA", value: 30000, type: "Retirement" },
    { name: "Brokerage", value: 20000, type: "General" }
  ],
  debtAccounts: [
    { name: "Mortgage", balance: 200000, monthlyPayment: 1200, interestRate: 3.5 },
    { name: "Student Loan", balance: 15000, monthlyPayment: 150, interestRate: 4.0 },
    { name: "Credit Card", balance: 2500, monthlyPayment: 75, interestRate: 18.0 }
  ],
  creditScore: 720,
  age: 35,
  employmentStatus: "Freelance/Contractor",
  riskTolerance: "Moderate",
};

// --- UI SUB-COMPONENTS ---

const ImpactSeverityIndicator: React.FC<{ severity: 'low' | 'medium' | 'high' | 'neutral' | 'critical' }> = ({ severity }) => {
    let colorsClass;
    let icon;
    switch (severity) {
        case 'low': colorsClass = 'bg-green-500 text-green-100'; icon = <FaCheckCircle/>; break;
        case 'medium': colorsClass = 'bg-yellow-500 text-yellow-100'; icon = <FaLightbulb/>; break;
        case 'high': colorsClass = 'bg-orange-500 text-orange-100'; icon = <FaExclamationTriangle/>; break;
        case 'critical': colorsClass = 'bg-red-600 text-red-100'; icon = <FaExclamationTriangle/>; break;
        case 'neutral': default: colorsClass = 'bg-gray-500 text-gray-100'; icon = <FaRobot/>; break;
    }
    return <div className={`w-6 h-6 rounded-full ${colorsClass} flex items-center justify-center`} title={`Severity: ${severity}`}>{icon}</div>;
};

const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
    const isPositiveChange = kpi.changePercentage >= 0;
    const changeColorClass = kpi.severity === 'critical' ? 'text-red-400' : kpi.severity === 'high' ? 'text-orange-400' : isPositiveChange ? 'text-green-400' : 'text-red-400';
    const changeArrow = kpi.changePercentage === 0 ? '→' : isPositiveChange ? '↑' : '↓';
    const unitDisplay = kpi.unit === '$' ? '$' : kpi.unit === '%' ? '%' : '';
    const unitSuffix = kpi.unit !== '$' && kpi.unit !== '%' ? ` ${kpi.unit}` : '';

    const formatValue = (value: number) => {
        return kpi.unit === '%' ? (value * 100).toFixed(1) : value.toLocaleString('en-US', { maximumFractionDigits: 0 });
    };

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex flex-col space-y-2 hover:bg-gray-800/80 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-md flex items-center gap-2">
                    <ImpactSeverityIndicator severity={kpi.severity} />
                    {kpi.name}
                </h4>
                <span className="text-xs text-gray-400 font-mono bg-gray-700 px-2 py-1 rounded-full">{kpi.category}</span>
            </div>
            <p className="text-gray-300 text-sm h-12 overflow-hidden line-clamp-2">{kpi.description}</p>
            <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-700">
                <div className="text-center">
                    <div className="text-xs text-gray-500">Baseline</div>
                    <div className="text-white text-md font-mono">
                        {unitDisplay}{formatValue(kpi.baselineValue)}{unitSuffix}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500">Projected</div>
                    <div className="text-cyan-400 text-lg font-bold font-mono">
                        {unitDisplay}{formatValue(kpi.projectedValue)}{unitSuffix}
                    </div>
                </div>
                <div className={`text-sm flex items-center ${changeColorClass} font-mono gap-1`}>
                    {changeArrow} {Math.abs(kpi.changePercentage * 100).toFixed(1)}%
                </div>
            </div>
        </div>
    );
};


const ReportGenerator: React.FC<{ result: SimulationResponse | null, isLoading: boolean }> = ({ result, isLoading }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGeneratePdf = async () => {
        if (!result || !reportRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(reportRef.current, { 
                backgroundColor: '#111827', // dark background for the canvas
                scale: 2 
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`QuantumOracle_Report_${result.simulationId}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleGeneratePdf}
                disabled={isLoading || isGenerating || !result}
                className="w-full mt-4 py-3 flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-md rounded-xl transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FaFilePdf />
                {isGenerating ? 'Generating Report...' : 'Download PDF Report'}
            </button>
            {/* The element to be captured for the PDF. It's hidden but available for html2canvas. */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px' }} ref={reportRef}>
                {result && (
                     <div className="p-8 bg-gray-900 text-white font-sans">
                        <h1 className="text-3xl font-bold mb-2">Quantum Oracle Simulation Report</h1>
                        <p className="text-sm text-gray-400 mb-6">Simulation ID: {result.simulationId}</p>
                        
                        <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800">
                           <h2 className="text-xl font-semibold mb-2">Narrative Summary</h2>
                           <p className="text-gray-300 italic">"{result.narrativeSummary}"</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                               <h3 className="font-semibold text-lg text-white mb-2">Short-Term Outlook</h3>
                               <p className="text-gray-400 text-sm">{result.shortTermOutlook}</p>
                            </div>
                            <div className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                               <h3 className="font-semibold text-lg text-white mb-2">Long-Term Projections</h3>
                               <p className="text-gray-400 text-sm">{result.longTermProjections}</p>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold mb-3">Key Strategic Recommendations</h2>
                        <div className="space-y-3">
                        {result.recommendations.map((rec, index) => (
                            <div key={index} className="p-3 bg-gray-800 rounded-lg border-l-4 border-cyan-500">
                                <h4 className="font-bold text-white text-md">{rec.title} ({rec.priority})</h4>
                                <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- GEMINI PROMPT GENERATION ---

const generateGeminiPrompt = (request: SimulationRequest) => `
You are an advanced financial oracle AI, named "Quantum Oracle", capable of performing complex simulations and providing highly detailed, actionable insights for personal finance. Your analysis must be comprehensive, covering a wide array of financial metrics and projections, including probabilistic analysis.

Your task is to analyze a hypothetical financial scenario for a user and provide a comprehensive, structured JSON response.

Here is the user's current detailed financial situation:
- Age: ${request.currentFinancialState.age}
- Employment Status: ${request.currentFinancialState.employmentStatus}
- Risk Tolerance: ${request.currentFinancialState.riskTolerance}
- Total Assets: $${request.currentFinancialState.totalAssets}
- Total Liabilities: $${request.currentFinancialState.totalLiabilities}
- Monthly Income: $${request.currentFinancialState.monthlyIncome}
- Monthly Expenses: $${request.currentFinancialState.monthlyExpenses}
- Emergency Fund: $${request.currentFinancialState.emergencyFund}
- Savings Goals: ${JSON.stringify(request.currentFinancialState.savingsGoals)}
- Investment Accounts: ${JSON.stringify(request.currentFinancialState.investmentAccounts)}
- Debt Accounts: ${JSON.stringify(request.currentFinancialState.debtAccounts)}
- Credit Score: ${request.currentFinancialState.creditScore}

The user's hypothetical scenario: "${request.prompt}"
Simulation Parameters:
- Duration: ${request.parameters.durationMonths} months
- Specific Financial Event Impact: $${request.parameters.amountUSD} USD
- Assumed Market Condition: ${request.parameters.marketCondition}
- Assumed Inflation Scenario: ${request.parameters.inflationScenario}

Please provide a JSON object structured exactly as follows. Fill it with rich narrative, 50 diverse KPIs, detailed multi-series time-series data, strategic recommendations, a Monte Carlo analysis, and asset allocation changes.
- All values must be numeric where applicable.
- Percentages must be decimals (e.g., -0.15 for -15% change).
- All dollar values must be raw numbers.

\`\`\`json
{
  "simulationId": "sim_${Date.now()}",
  "narrativeSummary": "A compelling and detailed story outlining the overall impact, trajectory, and key turning points of the simulation.",
  "shortTermOutlook": "A focused, actionable analysis of the financial situation for the first 1-3 months, highlighting immediate challenges and opportunities.",
  "longTermProjections": "A comprehensive analysis of the financial situation beyond 3 months, discussing long-term trends, goal impacts, and potential future states.",
  "keyImpacts": [
    { "metric": "Emergency Fund Depletion Risk", "value": "Very High, within 3 months", "severity": "critical" },
    { "metric": "Primary Savings Goal Delay", "value": "+18 months", "severity": "high" },
    { "metric": "Credit Score Drop", "value": "-50 points projected", "severity": "medium" },
    { "metric": "Debt Accumulation", "value": "+$15,000", "severity": "high" }
  ],
  "recommendations": [
    { "title": "Immediate Spending Freeze", "description": "Implement a strict zero-based budget. Cut all non-essential discretionary spending (e.g., dining out, entertainment, subscriptions) for at least the next 3 months to preserve liquidity.", "priority": "high", "category": "Spending" },
    { "title": "Income Augmentation Strategy", "description": "Actively pursue short-term freelance gigs, contract work, or consider a temporary part-time job to supplement income. Prioritize opportunities that can be quickly acquired and executed.", "priority": "high", "category": "Income" },
    { "title": "Debt Prioritization and Negotiation", "description": "Review all high-interest debts (e.g., credit cards). Consider negotiating with creditors for lower interest rates or temporary payment deferrals. Focus on minimum payments for lower interest debts.", "priority": "medium", "category": "Debt" },
    { "title": "Re-evaluate Long-Term Goals", "description": "Assess the feasibility of existing long-term goals (e.g., condo down payment, early retirement) in light of the new projections. Adjust timelines or contribution strategies as necessary to maintain realism.", "priority": "low", "category": "Goals" }
  ],
  "kpis": [
    { "name": "Monthly Net Income", "category": "Income", "baselineValue": 1500, "projectedValue": -500, "unit": "$", "changePercentage": -1.33, "severity": "critical", "description": "Average monthly cash flow after all expenses." },
    { "name": "Emergency Fund Runway", "category": "Savings", "baselineValue": 2.6, "projectedValue": 0.8, "unit": "months", "changePercentage": -0.69, "severity": "critical", "description": "Months of essential expenses covered by the emergency fund." },
    { "name": "Total Liquid Net Worth", "category": "Net Worth", "baselineValue": 75000, "projectedValue": 60000, "unit": "$", "changePercentage": -0.20, "severity": "high", "description": "Assets easily convertible to cash minus short-term liabilities." },
    { "name": "Debt-to-Income Ratio", "category": "Debt", "baselineValue": 0.35, "projectedValue": 0.55, "unit": "%", "changePercentage": 0.57, "severity": "high", "description": "Ratio of total monthly debt payments to gross monthly income." },
    { "name": "Investment Portfolio Value", "category": "Investments", "baselineValue": 50000, "projectedValue": 48000, "unit": "$", "changePercentage": -0.04, "severity": "medium", "description": "The projected market value of all investment accounts." },
    { "name": "Savings Rate", "category": "Savings", "baselineValue": 0.15, "projectedValue": 0.05, "unit": "%", "changePercentage": -0.66, "severity": "high", "description": "Percentage of net income allocated to savings and investments." },
    { "name": "Credit Utilization Ratio", "category": "Debt", "baselineValue": 0.20, "projectedValue": 0.45, "unit": "%", "changePercentage": 1.25, "severity": "high", "description": "Amount of credit used relative to total available credit." },
    { "name": "Net Worth Growth Trajectory", "category": "Net Worth", "baselineValue": 0.05, "projectedValue": -0.02, "unit": "%", "changePercentage": -1.40, "severity": "critical", "description": "Projected annual percentage change in total net worth." },
    { "name": "Financial Stress Level", "category": "Risk", "baselineValue": 3, "projectedValue": 8, "unit": "score (1-10)", "changePercentage": 1.66, "severity": "critical", "description": "A subjective score indicating the level of financial worry and pressure." },
    { "name": "Time to Achieve Primary Savings Goal", "category": "Goals", "baselineValue": 36, "projectedValue": 54, "unit": "months", "changePercentage": 0.50, "severity": "high", "description": "Estimated time remaining to reach the largest savings goal." }
  ],
  "projectedTimeSeries": [
    { "month": 0, "netWorth": 75000, "savingsBalance": 15000, "debtBalance": 75000, "investmentValue": 50000, "discretionaryCash": 1500, "emergencyFundCoverage": 2.6, "monthlyIncome": 6000, "monthlyExpenses": 4500 }
  ],
  "monteCarloAnalysis": {
    "summary": "Based on 1,000 simulations with varied market returns and inflation, there is a high degree of uncertainty. The median outcome shows a slow recovery, but the 10th percentile indicates a significant risk of prolonged financial distress.",
    "paths": [
        { "percentile": "10th", "finalNetWorth": 45000, "monthsToRecovery": 24, "goalAchievementProbability": 0.15 },
        { "percentile": "50th", "finalNetWorth": 62000, "monthsToRecovery": 14, "goalAchievementProbability": 0.45 },
        { "percentile": "90th", "finalNetWorth": 85000, "monthsToRecovery": 8, "goalAchievementProbability": 0.80 }
    ]
  },
  "projectedAssetAllocation": {
      "baseline": [
        { "name": "Retirement", "value": 30000 },
        { "name": "General Investments", "value": 20000 },
        { "name": "Cash & Savings", "value": 27000 }
      ],
      "projected": [
        { "name": "Retirement", "value": 28000 },
        { "name": "General Investments", "value": 18000 },
        { "name": "Cash & Savings", "value": 14000 }
      ]
  }
}
\`\`\`

Generate realistic numerical values and narrative based on the prompt. The number of recommendations should be between 5-10. Key impacts should be 3-7. The projectedTimeSeries must have entries for each month up to the simulation duration. The KPIs should be at least 10 diverse metrics as specified in the example.
`;


const QuantumOracleView: React.FC = () => {
    const context = useContext(DataContext);
    const [prompt, setPrompt] = useState("What if I experience a recession and my freelance income drops by 50% for 6 months, and I need to buy a new car for $25,000?");
    const [duration, setDuration] = useState(24);
    const [amount, setAmount] = useState(-25000);
    const [marketCondition, setMarketCondition] = useState<'bear' | 'neutral' | 'bull'>('bear');
    const [inflationScenario, setInflationScenario] = useState<'low' | 'average' | 'high'>('high');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SimulationResponse | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    const financialStateForGemini = context?.userData || defaultUserData;

    const handleSimulate = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            setError("Gemini API Key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.");
            setIsLoading(false);
            return;
        }

        try {
            const genAI = new GoogleGenAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const requestBody: SimulationRequest = {
                prompt,
                parameters: { durationMonths: duration, amountUSD: amount, marketCondition, inflationScenario },
                currentFinancialState: financialStateForGemini
            };

            const fullPrompt = generateGeminiPrompt(requestBody);
            const generationResult = await model.generateContent(fullPrompt);
            const responseText = await generationResult.response.text();

            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
            if (!jsonMatch || jsonMatch.length < 2) {
                console.error("Gemini response did not contain a valid JSON block:", responseText);
                throw new Error("Failed to parse Gemini's response. Expected a JSON block.");
            }

            let parsedResponse: SimulationResponse;
            try {
                parsedResponse = JSON.parse(jsonMatch[1]);
            } catch (jsonError: any) {
                console.error("JSON parsing error:", jsonError, "Raw text:", jsonMatch[1]);
                throw new Error(`Failed to parse Gemini's JSON output: ${jsonError.message}`);
            }

            if (!parsedResponse.kpis || !parsedResponse.projectedTimeSeries || !parsedResponse.monteCarloAnalysis) {
                throw new Error("Gemini response is missing critical data sections.");
            }
            
            setResult(parsedResponse);
            setActiveTab('overview');

        } catch (e: any) {
            console.error("Simulation error:", e);
            setError(e.message || "An unknown error occurred during the simulation.");
        } finally {
            setIsLoading(false);
        }
    };

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">Quantum Oracle: Your Future, Unveiled</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto mt-2">Leveraging advanced AI to simulate complex financial scenarios and deliver unparalleled strategic foresight.</p>
            </div>

            <Card title="Simulate Your Financial Future" className="bg-gray-900/60 border border-gray-700 shadow-xl">
                <p className="text-sm text-gray-400 mb-6">Describe a hypothetical scenario. The Quantum Oracle will utilize a comprehensive model of your financial state to simulate the outcome.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 resize-y"
                    placeholder="e.g., 'What if I get a $10,000 bonus next month and save it all?' or 'What if I lose my job for 3 months and my investments drop by 15%?'"
                    disabled={isLoading}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <div>
                        <label className="block text-md font-medium text-gray-300 mb-2">Duration</label>
                        <input type="range" min="1" max="60" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500" disabled={isLoading}/>
                        <div className="text-center font-mono text-cyan-300 text-sm mt-1">{duration} months</div>
                    </div>
                     <div>
                        <label className="block text-md font-medium text-gray-300 mb-2">Event Impact (USD)</label>
                        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white text-lg" disabled={isLoading}/>
                         <p className="text-xs text-gray-500 mt-1 text-center">+/- value</p>
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-300 mb-2">Market Condition</label>
                        <select value={marketCondition} onChange={e => setMarketCondition(e.target.value as any)} className="w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" disabled={isLoading}>
                            <option value="bear">Bear Market</option>
                            <option value="neutral">Neutral Market</option>
                            <option value="bull">Bull Market</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-md font-medium text-gray-300 mb-2">Inflation</label>
                        <select value={inflationScenario} onChange={e => setInflationScenario(e.target.value as any)} className="w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" disabled={isLoading}>
                            <option value="low">Low Inflation</option>
                            <option value="average">Average Inflation</option>
                            <option value="high">High Inflation</option>
                        </select>
                    </div>
                </div>
                 <button onClick={handleSimulate} disabled={isLoading || !prompt.trim()} className="w-full mt-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg rounded-xl transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                    {isLoading ? (
                        <div className="flex items-center justify-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Exploring Timelines...</div>
                    ) : 'Run Quantum Simulation'}
                </button>
            </Card>

            {isLoading && <Card><div className="text-center p-12 text-white text-xl flex items-center justify-center space-x-3"><svg className="animate-pulse h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-1-3m-6.964-14.964A12 12 0 0121.24 10.35M7.429 7.429a12.012 12.012 0 00-3.321 3.96M2 12h-.01M12 2v.01M19 12h.01M12 22v.01M6.429 19.571a12.012 12.012 0 003.96 3.321M17.571 4.429a12.012 12.012 0 00-3.96-3.321M21.24 13.65a12 12 0 01-18.48 0"/></svg><span>Analyzing vast data streams and projecting future states...</span></div></Card>}
            {error && <Card><p className="text-red-400 p-6 text-center text-lg">{error}</p></Card>}

            {result && (
                <div className="space-y-8 animate-fade-in-up">
                    <Card title="Simulation Results" noPadding>
                        <div className="border-b border-gray-700 flex">
                            {['overview', 'trajectories', 'kpis', 'analysis'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                            ))}
                        </div>
                        <div className="p-6">
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-xl text-white mb-2">Simulation Narrative</h3>
                                        <p className="italic text-gray-300 leading-relaxed mb-4">"{result.narrativeSummary}"</p>
                                        <h4 className="font-semibold text-lg text-white mb-2 border-t border-gray-700 pt-3">Short-Term Outlook</h4>
                                        <p className="text-gray-400 leading-relaxed text-sm mb-4">{result.shortTermOutlook}</p>
                                        <h4 className="font-semibold text-lg text-white mb-2 border-t border-gray-700 pt-3">Long-Term Projections</h4>
                                        <p className="text-gray-400 leading-relaxed text-sm">{result.longTermProjections}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl text-white mb-4">AI Strategic Recommendations</h3>
                                        <div className="space-y-3">
                                            {result.recommendations.map((rec, index) => (
                                                <div key={index} className="p-3 bg-gray-800/60 rounded-lg border-l-4 border-cyan-500 shadow-md">
                                                    <h4 className="font-bold text-white text-md flex items-center justify-between">{rec.title}<span className={`text-xs px-2 py-1 rounded-full font-mono ${rec.priority === 'high' ? 'bg-red-800' : rec.priority === 'medium' ? 'bg-yellow-800' : 'bg-green-800'}`}>{rec.priority}</span></h4>
                                                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">{rec.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'trajectories' && (
                                <Card title="Projected Financial Trajectories">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <AreaChart data={result.projectedTimeSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient>
                                                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/><stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/></linearGradient>
                                                <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" stroke="#9ca3af" unit="m" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(tick) => `$${(tick / 1000).toLocaleString()}k`} />
                                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#4b5563' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                                            <Area type="monotone" dataKey="netWorth" stackId="1" stroke="#8884d8" fill="url(#colorNetWorth)" name="Net Worth" />
                                            <Area type="monotone" dataKey="savingsBalance" stackId="1" stroke="#82ca9d" fill="url(#colorSavings)" name="Savings" />
                                            <Area type="monotone" dataKey="debtBalance" stackId="1" stroke="#ef4444" fill="url(#colorDebt)" name="Total Debt" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Card>
                            )}

                             {activeTab === 'kpis' && (
                                <Card title="Key Performance Indicators (KPIs)">
                                    <p className="text-gray-400 text-sm mb-6">A comprehensive overview of critical financial health metrics, comparing baseline values against projected outcomes.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {result.kpis.map((kpi, index) => <KPICard key={index} kpi={kpi} />)}
                                    </div>
                                </Card>
                            )}
                            
                            {activeTab === 'analysis' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card title="Monte Carlo Probabilistic Analysis">
                                        <p className="text-gray-400 text-sm mb-4">{result.monteCarloAnalysis.summary}</p>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={result.monteCarloAnalysis.paths} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                                                <XAxis type="number" stroke="#9ca3af" tickFormatter={(tick) => `$${(tick/1000)}k`} />
                                                <YAxis type="category" dataKey="percentile" stroke="#9ca3af" width={50} />
                                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)' }} formatter={(value: number) => `$${value.toLocaleString()}`} labelStyle={{color: '#fff'}} />
                                                <Legend />
                                                <Bar dataKey="finalNetWorth" name="Final Net Worth" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card>
                                    <Card title="Asset Allocation Shift">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-center font-semibold text-white mb-2">Baseline</h4>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <PieChart>
                                                        <Pie data={result.projectedAssetAllocation.baseline} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                                            {result.projectedAssetAllocation.baseline.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                                        </Pie>
                                                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div>
                                                <h4 className="text-center font-semibold text-white mb-2">Projected</h4>
                                                 <ResponsiveContainer width="100%" height={250}>
                                                    <PieChart>
                                                        <Pie data={result.projectedAssetAllocation.projected} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label>
                                                             {result.projectedAssetAllocation.projected.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                                        </Pie>
                                                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </Card>
                    <ReportGenerator result={result} isLoading={isLoading} />
                </div>
            )}
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
                .recharts-default-tooltip {
                    background-color: rgba(31, 41, 55, 0.9) !important;
                    border-color: #4b5563 !important;
                    border-radius: 8px !important;
                }
                .recharts-tooltip-label {
                    color: #e5e7eb !important;
                }
            `}</style>
        </div>
    );
};

export default QuantumOracleView;