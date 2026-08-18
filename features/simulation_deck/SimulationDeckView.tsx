// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/simulation_deck/SimulationDeckView.tsx
================================================================================

import React, { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FiPlay, FiStopCircle, FiSettings, FiBarChart2, FiCpu, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { IoIosFlash } from 'react-icons/io';
import { FaRobot, FaTachometerAlt } from 'react-icons/fa';
import { Card } from '../../components/Card';
import { AISuggestionsPanel } from '../../components/components/AISuggestionsPanel';
import { InteractiveAIResponse } from '../../components/components/InteractiveAIResponse';

// --- Complex Types Definitions ---

// Define the simulation inputs
interface SimulationParameter {
    key: string;
    label: string;
    type: 'number' | 'range' | 'select' | 'boolean';
    defaultValue: any;
    min?: number;
    max?: number;
    options?: { value: string | number; label: string }[];
    unit: string;
}

interface ScenarioDefinition {
    id: string;
    name: string;
    description: string;
    model_id: string; // Refers to the underlying predictive model (e.g., a specific ML pipeline)
    input_parameters: SimulationParameter[];
}

// Define the simulation output data points (time series)
interface KpiDataPoint {
    timeStep: number; // e.g., week, quarter
    revenue: number;
    operatingExpense: number;
    cashFlow: number;
    marketShareDelta: number;
    riskScore: number; // Operational/Financial Risk Index (0-100)
}

// Define the final simulation result structure
interface SimulationResult {
    status: 'RUNNING' | 'COMPLETED' | 'FAILED';
    executionTimeMs: number;
    kpiTrajectory: KpiDataPoint[];
    narrativeSummary: string; // AI generated summary of outcomes
    anomalyReport: { step: number; kpi: string; severity: 'HIGH' | 'MEDIUM' }[];
    strategicRecommendations: string[]; // High-level AI actions derived from the outcome
}

// Define configuration for visualization
interface KpiVisualizationConfig {
    kpiKey: keyof KpiDataPoint;
    label: string;
    color: string;
    type: 'line' | 'bar';
    unit: string;
}

// --- Configuration Constants & Mock Data ---

const AVAILABLE_SCENARIOS: ScenarioDefinition[] = [
    {
        id: 'S001_GLOBAL_RECESSION',
        name: 'Global Economic Downturn (2025 H1)',
        description: 'Simulates a 15% drop in consumer confidence affecting discretionary spending. Integrates economic data streams from OECD and Google Analytics API proxies.',
        model_id: 'MACRO_V2.1_QUANTUM_FILTER',
        input_parameters: [
            { key: 'confidence_drop', label: 'Consumer Confidence Index Drop', type: 'range', defaultValue: 15, min: 5, max: 30, unit: '%' },
            { key: 'duration_quarters', label: 'Duration', type: 'select', defaultValue: 4, options: [{ value: 2, label: '6 Months' }, { value: 4, label: '1 Year' }, { value: 8, label: '2 Years' }], unit: 'Quarters' },
            { key: 'interest_rate_hike', label: 'Central Bank Rate Increase (bps)', type: 'number', defaultValue: 100, min: 50, max: 500, unit: 'bps' },
        ],
    },
    {
        id: 'S002_SUPPLY_CHAIN_DISRUPTION',
        name: 'Major Logistics Network Failure (Asia)',
        description: 'Models the impact of disruption on component delivery. Uses real-time freight index data (simulating FedEx/UPS API integration).',
        model_id: 'LOGI_RISK_M3.0_SENTIENT',
        input_parameters: [
            { key: 'freight_cost_increase', label: 'Freight Cost Surge', type: 'range', defaultValue: 40, min: 10, max: 200, unit: '%' },
            { key: 'inventory_buffer', label: 'Current Inventory Buffer', type: 'select', defaultValue: 'MEDIUM', options: [{ value: 'HIGH', label: 'High (12 weeks)' }, { value: 'MEDIUM', label: 'Medium (6 weeks)' }, { value: 'LOW', label: 'Low (2 weeks)' }], unit: '' },
            { key: 'supplier_diversity', label: 'Supplier Diversity Index', type: 'number', defaultValue: 0.75, min: 0.1, max: 1.0, unit: '' },
        ],
    },
    {
        id: 'S003_CYBER_ATTACK',
        name: 'Massive Data Breach & Regulatory Fine',
        description: 'Simulates a major security incident impacting customer trust and resulting in significant compliance costs. Data sourced from simulated IBM Security/Splunk logs.',
        model_id: 'SECURITY_COMPLIANCE_A1',
        input_parameters: [
            { key: 'fine_multiplier', label: 'Regulatory Fine Multiplier (x Base)', type: 'number', defaultValue: 1.5, min: 0.5, max: 5.0, unit: 'x' },
            { key: 'reputation_damage', label: 'Reputation Damage Index', type: 'range', defaultValue: 60, min: 10, max: 100, unit: 'Index Pts' },
            { key: 'insurance_coverage', label: 'Cyber Insurance Coverage', type: 'boolean', defaultValue: true, unit: '' },
        ]
    }
];

const KPI_VISUALIZATIONS: KpiVisualizationConfig[] = [
    { kpiKey: 'revenue', label: 'Projected Revenue', color: '#10b981', type: 'line', unit: '$M' },
    { kpiKey: 'cashFlow', label: 'Net Cash Flow', color: '#3b82f6', type: 'bar', unit: '$M' },
    { kpiKey: 'riskScore', label: 'Operational Risk Index', color: '#ef4444', type: 'line', unit: 'Score' },
    { kpiKey: 'marketShareDelta', label: 'Market Share Delta', color: '#f59e0b', type: 'line', unit: '%' }
];

const INITIAL_PARAMETERS: Record<string, any> = AVAILABLE_SCENARIOS.reduce((acc, scenario) => {
    scenario.input_parameters.forEach(param => {
        acc[param.key] = param.defaultValue;
    });
    return acc;
}, {} as Record<string, any>);


// --- Mock Simulation Service ---
/**
 * Simulates a call to the core AI-Sentient Asset Management API (ai-sentient-asset-management.yaml)
 * to execute the wargaming model.
 */
const runSimulationService = (scenarioId: string, parameters: Record<string, any>): Promise<SimulationResult> => {

    const generateMockData = (initialRevenue: number, steps = 12): KpiDataPoint[] => {
        const data: KpiDataPoint[] = [];
        let currentRevenue = initialRevenue;
        let currentCashFlow = initialRevenue * 0.15;
        let currentRisk = 30;

        for (let i = 1; i <= steps; i++) {
            let revenueImpact = 0;
            let costImpact = 0;
            let riskIncrease = 0;

            // Scenario S001: Recession Logic
            if (scenarioId === 'S001_GLOBAL_RECESSION') {
                const drop = parameters.confidence_drop / 100;
                const hike = parameters.interest_rate_hike / 100;
                revenueImpact = -currentRevenue * (drop * (i / steps));
                costImpact = -currentCashFlow * (hike * 0.1);
                riskIncrease = 4 * hike;
            } 
            
            // Scenario S002: Supply Chain Logic
            else if (scenarioId === 'S002_SUPPLY_CHAIN_DISRUPTION') {
                const costIncrease = parameters.freight_cost_increase / 100;
                const bufferFactor = parameters.inventory_buffer === 'LOW' ? 1.5 : (parameters.inventory_buffer === 'MEDIUM' ? 1.0 : 0.5);
                
                // Inventory buffer mitigates initial shock
                revenueImpact = i < 4 ? 0 : -currentRevenue * costIncrease * bufferFactor * 0.1;
                costImpact = currentRevenue * 0.08 * costIncrease; // Higher OpEx
                riskIncrease = 10 * bufferFactor;
            }

            currentRevenue = Math.max(100, currentRevenue + revenueImpact + (Math.random() * 5 - 2.5));
            
            // Apply cost impact relative to current revenue
            const baseOpEx = currentRevenue * 0.7;
            const expenseAdjustment = costImpact > 0 ? costImpact : 0; 
            
            currentCashFlow = currentCashFlow * 0.95 + (currentRevenue - baseOpEx - expenseAdjustment) * 0.8;

            currentRisk = Math.min(100, Math.max(10, currentRisk * 0.95 + riskIncrease + (Math.random() * 4) - 2));

            data.push({
                timeStep: i,
                revenue: Math.round(currentRevenue),
                operatingExpense: Math.round(baseOpEx + expenseAdjustment),
                cashFlow: Math.round(currentCashFlow),
                marketShareDelta: Math.random() * 4 - 2 + (revenueImpact/50),
                riskScore: Math.round(currentRisk),
            });
        }
        return data;
    };

    const isFailure = Math.random() < 0.05; // 5% chance of catastrophic failure
    
    if (isFailure) {
        return Promise.reject(new Error("Quantum coherence loss during predictive cycle. Model data integrity compromised."));
    }

    const mockResults: SimulationResult = {
        status: 'COMPLETED',
        executionTimeMs: Math.floor(4000 + Math.random() * 2000),
        kpiTrajectory: generateMockData(850, parameters.duration_quarters ? parameters.duration_quarters * 4 : 12),
        narrativeSummary: `The detailed analysis of scenario ${scenarioId} using model ${selectedScenarioId} reveals significant volatility in Q3, specifically tied to the parameter configuration provided. The peak operational risk index hit ${Math.max(...generateMockData(850).map(d => d.riskScore))} at the midpoint of the forecast. This requires proactive intervention documented in the strategic recommendations section below. The system automatically flagged a 'High' severity cash flow dip at step 5, indicating a potential liquidity crunch before the simulated mitigation effects take hold.`,
        anomalyReport: [
            { step: 5, kpi: 'cashFlow', severity: 'HIGH' },
            { step: 8, kpi: 'riskScore', severity: 'MEDIUM' },
        ],
        strategicRecommendations: [
            "Initiate dynamic portfolio rebalancing utilizing the Multiversal Financial Projection API to hedge against forecast inflation.",
            "Deploy the AI-driven budget reallocation mandate, focusing cost cuts on non-critical CapEx identified by the ERP integration.",
            "Launch a 'Crisis Communication Protocol' via the LinkedIn API integration to manage investor sentiment regarding projected market share loss.",
            "Review supplier contracts immediately using the Legal Document Summarizer feature to identify early termination penalties.",
        ],
    };

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockResults);
        }, mockResults.executionTimeMs); 
    });
};


export const SimulationDeckView: React.FC = () => {
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>(AVAILABLE_SCENARIOS[0].id);
    const [currentParameters, setCurrentParameters] = useState<Record<string, any>>(INITIAL_PARAMETERS);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [lastRunTime, setLastRunTime] = useState<number | null>(null);

    const selectedScenario = useMemo(() => {
        return AVAILABLE_SCENARIOS.find(s => s.id === selectedScenarioId);
    }, [selectedScenarioId]);

    const handleParameterChange = useCallback((key: string, value: any) => {
        setCurrentParameters(prev => ({
            ...prev,
            [key]: value,
        }));
        setSimulationResult(null); // Clear results on parameter change
    }, []);

    const handleRunSimulation = useCallback(async () => {
        if (!selectedScenario || isSimulating) return;

        setIsSimulating(true);
        setSimulationResult({ status: 'RUNNING', executionTimeMs: 0, kpiTrajectory: [], narrativeSummary: "Running...", anomalyReport: [], strategicRecommendations: [] });
        setLastRunTime(Date.now());

        try {
            const result = await runSimulationService(selectedScenarioId, currentParameters);
            setSimulationResult(result);
        } catch (error: any) {
            console.error("Simulation failed:", error);
            setSimulationResult({
                status: 'FAILED',
                executionTimeMs: Date.now() - lastRunTime!,
                kpiTrajectory: [],
                narrativeSummary: `FATAL ERROR: ${error.message || "Simulation engine encountered an unrecoverable error during execution. Review model parameters and API connectivity."}`,
                anomalyReport: [{ step: 0, kpi: 'System', severity: 'HIGH' }],
                strategicRecommendations: ["Urgent technical audit required. Check DemoBankAPIGateway logs for request failures."],
            });
        } finally {
            setIsSimulating(false);
        }
    }, [selectedScenarioId, currentParameters, isSimulating, lastRunTime, selectedScenario]);

    const handleResetSimulation = () => {
        setCurrentParameters(INITIAL_PARAMETERS);
        setSimulationResult(null);
        setLastRunTime(null);
    };

    // --- Sub-Components ---

    const ParameterInput: React.FC<{ param: SimulationParameter }> = ({ param }) => {
        const value = currentParameters[param.key];

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            let newValue: any = e.target.value;

            if (param.type === 'number' || param.type === 'range') {
                newValue = parseFloat(newValue);
            } else if (param.type === 'boolean') {
                newValue = e.target.value === 'true' || e.target.value === 'false' ? e.target.value === 'true' : newValue;
            }
            handleParameterChange(param.key, newValue);
        };

        const renderInput = () => {
            switch (param.type) {
                case 'range':
                    return (
                        <>
                        <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={param.key === 'supplier_diversity' ? 0.05 : (param.max! - param.min!) / 100}
                            value={value}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-500"
                        />
                         <div className="flex justify-between text-xs text-gray-500 pt-1">
                            <span>{param.min}</span>
                            <span>{param.max}</span>
                        </div>
                        </>
                    );
                case 'number':
                    return (
                        <input
                            type="number"
                            min={param.min}
                            max={param.max}
                            step="any"
                            value={value}
                            onChange={handleChange}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        />
                    );
                case 'select':
                    return (
                        <select
                            value={value}
                            onChange={handleChange as any}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        >
                            {param.options?.map(opt => (
                                <option key={String(opt.value)} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    );
                case 'boolean':
                    return (
                        <select
                            value={value}
                            onChange={handleChange as any}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        >
                            <option value="true">Yes (Enabled)</option>
                            <option value="false">No (Disabled)</option>
                        </select>
                    );
                default:
                    return <p className="text-red-500">Unsupported type.</p>;
            }
        };

        return (
            <div className="mb-6 p-4 border border-gray-700 rounded-xl bg-gray-800 transition duration-300 hover:border-indigo-500/70">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {param.label}
                    <span className="float-right text-indigo-400 font-bold tabular-nums">
                        {typeof value === 'boolean' ? (value ? 'YES' : 'NO') : `${value} ${param.unit}`}
                    </span>
                </label>
                {renderInput()}
            </div>
        );
    };

    const KpiTimeSeriesChart: React.FC<{ data: KpiDataPoint[] }> = ({ data }) => {
        if (data.length === 0) return <p className="text-center text-gray-500 py-10">No data points generated yet.</p>;

        const isRunning = simulationResult?.status === 'RUNNING';

        return (
            <div className={`h-[450px] w-full ${isRunning ? 'opacity-80' : ''}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="timeStep" stroke="#9ca3af" label={{ value: `Time Step (${selectedScenario?.input_parameters.find(p => p.key === 'duration_quarters')?.unit})`, position: 'bottom', fill: '#9ca3af' }} />
                        
                        {/* Primary Y-Axis for Revenue/Cashflow */}
                        <YAxis yAxisId="left" stroke="#9ca3af" orientation="left" domain={['auto', 'auto']} tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`} />
                        
                        {/* Secondary Y-Axis for Risk Score / Percentage Metrics */}
                        <YAxis yAxisId="right" stroke="#9ca3af" orientation="right" domain={[0, 100]} />
                        
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '4px' }}
                            formatter={(value: number, name: string, props: any) => {
                                const kpiConfig = KPI_VISUALIZATIONS.find(k => k.kpiKey === props.dataKey);
                                return [`${value.toFixed(1)}${kpiConfig?.unit}`, kpiConfig?.label || name];
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />

                        {KPI_VISUALIZATIONS.map((kpi) => {
                            if (kpi.type === 'line') {
                                return (
                                    <Line
                                        key={kpi.kpiKey}
                                        yAxisId={kpi.kpiKey === 'riskScore' || kpi.kpiKey === 'marketShareDelta' ? 'right' : 'left'}
                                        type="monotone"
                                        dataKey={kpi.kpiKey}
                                        stroke={kpi.color}
                                        name={`${kpi.label}`}
                                        dot={false}
                                        strokeWidth={3}
                                        activeDot={{ r: 6 }}
                                    />
                                );
                            }
                            // Using a separate BarChart or combining Bar/Line is complex, sticking to LineChart definition
                            // If Bar is required, we layer it using the same chart component
                            return null;
                        })}

                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const SimulationDashboard = () => {
        if (!simulationResult || simulationResult.status === 'RUNNING') return null;
        const result = simulationResult;
        
        const lastStep = result.kpiTrajectory.length > 0 ? result.kpiTrajectory[result.kpiTrajectory.length - 1] : null;

        const maxRisk = result.kpiTrajectory.reduce((max, point) => Math.max(max, point.riskScore), 0);
        const minRevenue = result.kpiTrajectory.reduce((min, point) => Math.min(min, point.revenue), Infinity);
        const finalCashFlow = lastStep?.cashFlow || 0;

        return (
            <div className="mt-8 space-y-10">
                <h2 className="text-3xl font-extrabold text-indigo-300 tracking-wide flex items-center">
                    <FiBarChart2 className="mr-3 text-indigo-400" />
                    Simulation Results: {selectedScenario?.name}
                </h2>

                {/* KPI Summary Tiles */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card title="Peak Risk Score" className="bg-gray-800 border-t-4 border-red-500 shadow-xl">
                        <p className={`text-4xl font-extrabold ${maxRisk > 60 ? 'text-red-400' : 'text-green-400'}`}>{maxRisk}</p>
                        <p className="text-sm text-gray-400">Max Operational Index hit</p>
                    </Card>
                    <Card title="Min Revenue Projection" className="bg-gray-800 border-t-4 border-yellow-500 shadow-xl">
                        <p className="text-4xl font-extrabold text-yellow-400">${(minRevenue / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-gray-400">Lowest forecast revenue</p>
                    </Card>
                    <Card title="Final Cash Position" className="bg-gray-800 border-t-4 border-blue-500 shadow-xl">
                        <p className="text-4xl font-extrabold text-blue-400">${(finalCashFlow / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-gray-400">Net Cash Flow (End of Term)</p>
                    </Card>
                    <Card title="Execution Latency" className="bg-gray-800 border-t-4 border-indigo-500 shadow-xl">
                        <p className="text-4xl font-extrabold text-indigo-400 tabular-nums">{result.executionTimeMs}ms</p>
                        <p className="text-sm text-gray-400">Wargaming engine runtime</p>
                    </Card>
                </div>

                {/* Main Visualization and AI Narrative */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    {/* Time Series Visualization */}
                    <Card title="KPI Trajectory Over Time" icon={<FaTachometerAlt />} className="bg-gray-800 xl:col-span-3">
                        <KpiTimeSeriesChart data={result.kpiTrajectory} />
                    </Card>
                    
                    {/* AI Narrative Summary & Anomaly */}
                    <div className="xl:col-span-2 space-y-6">
                        <Card title="AI Scenario Narrative" icon={<FaRobot />} className="bg-gray-800 h-full">
                            <InteractiveAIResponse
                                response={result.narrativeSummary}
                                sourceMetadata={`Model: ${selectedScenario?.model_id}, Run Time: ${new Date(lastRunTime!).toLocaleString()}`}
                            />
                        </Card>
                        
                        <Card title="Simulation Anomaly Report" icon={<FiAlertTriangle />} className="bg-gray-800">
                            <ul className="space-y-3 max-h-48 overflow-y-auto">
                                {result.anomalyReport.length > 0 ? (
                                    result.anomalyReport.map((anomaly, index) => (
                                        <li key={index} className={`p-3 rounded-lg flex items-start text-sm ${anomaly.severity === 'HIGH' ? 'bg-red-900/40 border border-red-600' : 'bg-yellow-900/40 border border-yellow-600'}`}>
                                            <IoIosFlash className={`mt-1 mr-3 text-lg flex-shrink-0 ${anomaly.severity === 'HIGH' ? 'text-red-400' : 'text-yellow-400'}`} />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-white">{anomaly.kpi} Deviation Detected</p>
                                                <p className="text-gray-300">Severity: <span className='font-mono'>{anomaly.severity}</span> | Step: {anomaly.step}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No critical anomalies detected in the projection window.</p>
                                )}
                            </ul>
                        </Card>
                    </div>
                </div>


                {/* AI Strategic Recommendations (Using dedicated component for richer features) */}
                <AISuggestionsPanel
                    title="AI Strategic Governance Recommendations"
                    icon={<FiCpu />}
                    suggestions={result.strategicRecommendations.map((rec, index) => ({
                        id: `rec-${index}`,
                        summary: rec,
                        source: index % 2 === 0 ? 'AI Sentient Asset Management' : 'Hyper-Personalized Economic Governance Engine',
                        priority: index < 2 ? 'HIGH' : 'MEDIUM',
                        actionable: true,
                        linkedKpi: index % 3 === 0 ? 'Cash Flow' : 'Risk Score'
                    }))}
                />

            </div>
        );
    };


    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white font-sans">
            <header className="mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-4xl font-extrabold text-indigo-400 tracking-tight">Enterprise Wargaming Deck</h1>
                <p className="text-gray-400 mt-1">Harnessing AI to simulate complex geopolitical and financial risks. Powering strategic foresight with Fortune 500 API data.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* -------------------- Configuration Sidebar -------------------- */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Scenario Selection" icon={<FiSettings />} className="bg-gray-800">
                        <label htmlFor="scenario-select" className="block text-sm font-medium text-gray-300 mb-2">
                            Select Predictive Model
                        </label>
                        <select
                            id="scenario-select"
                            value={selectedScenarioId}
                            onChange={(e) => {
                                setSelectedScenarioId(e.target.value);
                                setSimulationResult(null); 
                            }}
                            className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {AVAILABLE_SCENARIOS.map(scenario => (
                                <option key={scenario.id} value={scenario.id}>[{scenario.id}] {scenario.name}</option>
                            ))}
                        </select>

                        {selectedScenario && (
                            <div className="p-3 bg-gray-900 rounded-xl border border-indigo-900/50">
                                <p className="text-sm font-semibold text-indigo-400">{selectedScenario.model_id}</p>
                                <p className="text-xs text-gray-400 mt-1">{selectedScenario.description}</p>
                            </div>
                        )}
                    </Card>

                    {/* Parameter Input Panel */}
                    {selectedScenario && (
                        <Card title="Configurable Parameters" icon={<FiSettings />} className="bg-gray-800">
                            {selectedScenario.input_parameters.map(param => (
                                <ParameterInput key={param.key} param={param} />
                            ))}
                        </Card>
                    )}

                    {/* Simulation Controls */}
                    <Card title="Control Panel" className="bg-gray-800 p-4">
                        <button
                            onClick={handleRunSimulation}
                            disabled={isSimulating}
                            className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-lg font-bold rounded-xl shadow-lg transition duration-300 ${
                                isSimulating
                                    ? 'bg-indigo-700 cursor-wait opacity-80'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900'
                            }`}
                        >
                            {isSimulating ? (
                                <>
                                    <FiCpu className="animate-pulse mr-3" />
                                    Executing Wargame...
                                </>
                            ) : (
                                <>
                                    <FiPlay className="mr-3" />
                                    Run Quantum Simulation
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleResetSimulation}
                            className="mt-3 w-full flex items-center justify-center px-6 py-2 border border-gray-600 text-sm font-medium rounded-xl text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-150"
                        >
                            <FiStopCircle className="mr-2" />
                            Reset Deck Configuration
                        </button>

                        {simulationResult && (
                            <div className={`mt-4 p-3 rounded-lg flex items-center text-sm font-semibold ${simulationResult.status === 'FAILED' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                                {simulationResult.status === 'COMPLETED' ? (
                                    <FiCheckCircle className="mr-2 text-green-400 w-5 h-5" />
                                ) : (
                                    <FiAlertTriangle className="mr-2 text-red-400 w-5 h-5" />
                                )}
                                <span>Execution Status: {simulationResult.status}</span>
                            </div>
                        )}
                    </Card>
                </div>

                {/* -------------------- Results Area -------------------- */}
                <div className="lg:col-span-3">
                    {isSimulating && simulationResult?.status === 'RUNNING' && (
                        <div className="flex flex-col items-center justify-center h-[700px] bg-gray-800 rounded-3xl border-4 border-dashed border-indigo-600/50 p-10 shadow-2xl">
                            <FiCpu className="w-20 h-20 text-indigo-400 animate-spin" />
                            <h3 className="mt-6 text-2xl font-bold text-white">Synthesizing Economic Trajectories...</h3>
                            <p className="text-gray-400 mt-3 text-center max-w-lg">
                                Querying Hyper-Personalized Economic Governance APIs and running multi-variate Monte Carlo simulations on the underlying data mesh.
                            </p>
                            <div className="w-full max-w-md h-4 bg-gray-700 rounded-full mt-8 overflow-hidden">
                                <div className="h-full bg-indigo-500 w-3/4 animate-pulse"></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Expected wait time: ~{Math.ceil((lastRunTime ? Date.now() - lastRunTime : 0) / 1000) + 4} seconds (Optimizing for low latency computation).</p>
                        </div>
                    )}
                    
                    {!simulationResult && !isSimulating && (
                         <div className="flex flex-col items-center justify-center h-[700px] bg-gray-800 rounded-3xl border border-gray-700 p-10">
                            <FaRobot className="w-20 h-20 text-gray-500 opacity-30 mb-6" />
                            <h3 className="text-2xl font-bold text-gray-300">Awaiting Strategic Mandate</h3>
                            <p className="text-gray-500 mt-2 text-center max-w-xl">Define your variables and execute a predictive scenario. The system will deliver KPI forecasts and actionable AI strategies designed for systemic resilience.</p>
                        </div>
                    )}

                    {simulationResult && simulationResult.status !== 'RUNNING' && <SimulationDashboard />}
                </div>
            </div>
        </div>
    );
};