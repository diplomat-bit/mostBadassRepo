// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/EconomicSynthesisEngineView.tsx
================================================================================

```tsx
// components/views/platform/EconomicSynthesisEngineView.tsx
import React, { useState, useReducer, useMemo, useCallback } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { v4 as uuidv4 } from 'uuid';

// --- ICONS (as inline SVGs to avoid external dependencies) ---
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586L7.707 10.293zM5 3a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1V3z" />
    </svg>
);
const LoadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 hover:text-red-300" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


// --- TYPES AND INTERFACES ---

type EconomicParameterCategory = 'monetary' | 'fiscal' | 'labor' | 'trade' | 'innovation' | 'environment';

interface EconomicParameter {
    value: number;
    min: number;
    max: number;
    step: number;
    format: (value: number) => string;
    description: string;
}

type ParameterSet = Record<string, number>;

interface TimeSeriesDataPoint {
    year: number;
    gdp: number;
    inflation: number;
    unemployment: number;
    govtDebtToGdp: number;
    giniCoefficient: number;
}

interface SectoralDataPoint {
    year: number;
    technology: number;
    manufacturing: number;
    services: number;
    agriculture: number;
    energy: number;
}

interface EventShock {
    id: string;
    year: number;
    type: 'Supply' | 'Demand' | 'Financial' | 'Geopolitical' | 'Pandemic';
    magnitude: number; // -100 to 100
    description: string;
}

interface SimulationResult {
    narrativeSummary: string;
    policyRecommendations: string;
    riskAnalysis: {
        shortTerm: string[];
        longTerm: string[];
    };
    timeSeries: TimeSeriesDataPoint[];
    sectoralAnalysis: SectoralDataPoint[];
}

interface Scenario {
    id: string;
    name: string;
    parameters: ParameterSet;
    shocks: EventShock[];
    result?: SimulationResult;
}

type AdvisorMessage = {
    sender: 'user' | 'ai';
    text: string;
};

// --- INITIAL STATE & CONFIGURATION ---

const initialParameters: ParameterSet = {
    interestRate: 2.5,
    quantitativeEasing: 0,
    fiscalSpending: 20,
    corporateTaxRate: 21,
    incomeTaxRate: 25,
    vatRate: 15,
    minWage: 15,
    unionizationRate: 10,
    tradeTariffs: 5,
    tradeOpenness: 0.8,
    techShock: 0.02,
    educationInvestment: 4.5,
    carbonTax: 50,
    greenInvestment: 1,
    geopoliticalRisk: 0.3,
    populationGrowth: 0.005,
    regulatoryBurden: 0.4,
};

const parameterConfig: Record<keyof typeof initialParameters, EconomicParameter & { label: string; category: EconomicParameterCategory }> = {
    // Monetary
    interestRate: { label: "Base Interest Rate", value: 2.5, min: 0, max: 15, step: 0.25, format: v => `${v.toFixed(2)}%`, category: 'monetary', description: "Central bank's key lending rate, influencing borrowing costs across the economy." },
    quantitativeEasing: { label: "Quantitative Easing (Bns/Mo)", value: 0, min: -200, max: 200, step: 10, format: v => `$${v}B`, category: 'monetary', description: "Asset purchases by the central bank to increase money supply. Negative values indicate tightening." },
    // Fiscal
    fiscalSpending: { label: "Govt. Spending (% GDP)", value: 20, min: 10, max: 60, step: 1, format: v => `${v}%`, category: 'fiscal', description: "Total government expenditure as a percentage of the nation's Gross Domestic Product." },
    corporateTaxRate: { label: "Corporate Tax Rate", value: 21, min: 0, max: 50, step: 1, format: v => `${v}%`, category: 'fiscal', description: "The tax rate levied on corporate profits." },
    incomeTaxRate: { label: "Avg. Income Tax Rate", value: 25, min: 5, max: 60, step: 1, format: v => `${v}%`, category: 'fiscal', description: "The average effective tax rate on personal income." },
    vatRate: { label: "Consumption Tax (VAT/GST)", value: 15, min: 0, max: 30, step: 1, format: v => `${v}%`, category: 'fiscal', description: "Value-added or sales tax on goods and services." },
    // Labor
    minWage: { label: "Minimum Wage ($/hr)", value: 15, min: 5, max: 30, step: 0.5, format: v => `$${v.toFixed(2)}`, category: 'labor', description: "The legally mandated minimum hourly wage for workers." },
    unionizationRate: { label: "Unionization Rate", value: 10, min: 0, max: 80, step: 1, format: v => `${v}%`, category: 'labor', description: "Percentage of the workforce belonging to a labor union." },
    educationInvestment: { label: "Education Spending (% GDP)", value: 4.5, min: 1, max: 10, step: 0.1, format: v => `${v.toFixed(1)}%`, category: 'labor', description: "Public investment in education, affecting long-term human capital." },
    // Trade
    tradeTariffs: { label: "Average Import Tariffs", value: 5, min: 0, max: 50, step: 1, format: v => `${v}%`, category: 'trade', description: "Average tax imposed on imported goods and services." },
    tradeOpenness: { label: "Trade Openness Index", value: 0.8, min: 0.1, max: 1.0, step: 0.05, format: v => v.toFixed(2), category: 'trade', description: "An index representing the ease of international trade (1 = full free trade)." },
    geopoliticalRisk: { label: "Geopolitical Risk Index", value: 0.3, min: 0, max: 1, step: 0.05, format: v => v.toFixed(2), category: 'trade', description: "Abstract measure of global tensions affecting trade and investment." },
    // Innovation
    techShock: { label: "Tech Innovation Rate", value: 0.02, min: 0, max: 0.1, step: 0.005, format: v => `${(v * 100).toFixed(1)}%`, category: 'innovation', description: "Annual rate of exogenous technological progress boosting productivity." },
    regulatoryBurden: { label: "Regulatory Burden", value: 0.4, min: 0, max: 1, step: 0.05, format: v => v.toFixed(2), category: 'innovation', description: "Index representing the cost and complexity of business regulations." },
    // Environment
    carbonTax: { label: "Carbon Tax ($/ton CO2)", value: 50, min: 0, max: 500, step: 10, format: v => `$${v}`, category: 'environment', description: "A tax levied on carbon emissions to disincentivize pollution." },
    greenInvestment: { label: "Green Subsidies (% GDP)", value: 1, min: 0, max: 10, step: 0.5, format: v => `${v.toFixed(1)}%`, category: 'environment', description: "Government investment in renewable energy and sustainable technologies." },
    populationGrowth: { label: "Population Growth Rate", value: 0.005, min: -0.01, max: 0.03, step: 0.001, format: v => `${(v * 100).toFixed(1)}%`, category: 'labor', description: "Annual change in population size." }
};

const PARAMETER_CATEGORIES: { id: EconomicParameterCategory; name: string }[] = [
    { id: 'monetary', name: 'Monetary Policy' },
    { id: 'fiscal', name: 'Fiscal Policy' },
    { id: 'labor', name: 'Labor & Demographics' },
    { id: 'trade', name: 'Global & Trade' },
    { id: 'innovation', name: 'Innovation & Regulation' },
    { id: 'environment', name: 'Environmental Policy' },
];

const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// --- CUSTOM HOOKS & REDUCERS ---

function scenariosReducer(state: Scenario[], action: any): Scenario[] {
    switch (action.type) {
        case 'ADD':
            return [...state, action.payload];
        case 'UPDATE_RESULT':
            return state.map(s => s.id === action.payload.id ? { ...s, result: action.payload.result } : s);
        case 'DELETE':
            return state.filter(s => s.id !== action.payload.id);
        case 'LOAD_PRESET':
            return action.payload;
        default:
            return state;
    }
}

// --- CHILD COMPONENTS ---

const ParameterSlider: React.FC<{id: string, config: EconomicParameter, value: number, onChange: (id: string, value: number) => void}> = ({ id, config, value, onChange }) => (
    <div className="group relative">
        <div className="flex justify-between items-baseline mb-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300">{config.label}</label>
            <span className="text-sm font-mono text-cyan-300">{config.format(value)}</span>
        </div>
        <input id={id} type="range" min={config.min} max={config.max} step={config.step} value={value} onChange={e => onChange(id, Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-cyan" />
        <div className="absolute left-0 bottom-8 mb-1 w-64 p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <InfoIcon /> {config.description}
        </div>
    </div>
);

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <p className="label font-bold text-white">{`Year: ${label}`}</p>
                {payload.map((entry: any) => (
                    <p key={entry.name} style={{ color: entry.color }}>
                        {`${entry.name}: ${entry.value.toLocaleString()}${entry.unit || ''}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- MAIN VIEW COMPONENT ---

const EconomicSynthesisEngineView: React.FC = () => {
    const [apiKey, setApiKey] = useState<string | null>(process.env.NEXT_PUBLIC_GEMINI_API_KEY || null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState<EconomicParameterCategory>('monetary');
    const [resultsTab, setResultsTab] = useState('summary');
    const [advisorMessages, setAdvisorMessages] = useState<AdvisorMessage[]>([]);
    const [advisorInput, setAdvisorInput] = useState("");
    const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);

    const [scenarios, dispatch] = useReducer(scenariosReducer, []);
    const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

    const [parameters, setParameters] = useState<ParameterSet>(initialParameters);
    const [shocks, setShocks] = useState<EventShock[]>([]);

    const activeScenario = useMemo(() => scenarios.find(s => s.id === activeScenarioId), [scenarios, activeScenarioId]);

    const handleParamChange = useCallback((id: string, value: number) => {
        setParameters(p => ({ ...p, [id]: value }));
    }, []);

    const handleAddShock = () => {
        setShocks(s => [...s, { id: uuidv4(), year: 5, type: 'Demand', magnitude: -10, description: "Sudden consumer confidence drop." }]);
    };
    
    const handleShockChange = (id: string, field: keyof EventShock, value: any) => {
        setShocks(s => s.map(shock => shock.id === id ? {...shock, [field]: value} : shock));
    };

    const handleRemoveShock = (id: string) => {
        setShocks(s => s.filter(shock => shock.id !== id));
    };

    const handleSaveScenario = () => {
        const scenarioName = prompt("Enter scenario name:", `Scenario ${scenarios.length + 1}`);
        if (scenarioName) {
            const newScenario: Scenario = {
                id: uuidv4(),
                name: scenarioName,
                parameters,
                shocks,
            };
            dispatch({ type: 'ADD', payload: newScenario });
            setActiveScenarioId(newScenario.id);
        }
    };

    const handleLoadScenario = (id: string) => {
        const scenarioToLoad = scenarios.find(s => s.id === id);
        if (scenarioToLoad) {
            setParameters(scenarioToLoad.parameters);
            setShocks(scenarioToLoad.shocks);
            setActiveScenarioId(id);
        }
    };
    
    const buildSimulationPrompt = (params: ParameterSet, eventShocks: EventShock[]): string => {
        let prompt = `You are a world-class macroeconomic simulator running a sophisticated agent-based model. Your task is to generate a 20-year economic forecast for a synthetic G7-style economy.

        **Initial Conditions & Core Parameters:**
        `;
        
        Object.entries(params).forEach(([key, value]) => {
            const config = parameterConfig[key as keyof typeof initialParameters];
            if (config) {
                prompt += `- ${config.label}: ${config.format(value)} (${config.description})\n`;
            }
        });
        
        if (eventShocks.length > 0) {
            prompt += `\n**Exogenous Event Shocks:**\n`;
            eventShocks.forEach(shock => {
                prompt += `- Year ${shock.year}: A ${shock.type} shock with a magnitude of ${shock.magnitude}%. Description: ${shock.description}\n`;
            });
        }

        prompt += `
        **Simulation Output Requirements:**
        Please provide your output as a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON. The JSON object must conform to the following schema:
        
        {
            "narrativeSummary": "A 3-4 paragraph qualitative analysis of the economic trajectory, highlighting key turning points, policy impacts, and overall outcomes.",
            "policyRecommendations": "Based on the simulation results, provide three actionable policy recommendations to improve economic outcomes.",
            "riskAnalysis": {
                "shortTerm": ["Identify 2-3 immediate risks in the first 5 years."],
                "longTerm": ["Identify 2-3 structural risks that emerge over the 20-year horizon."]
            },
            "timeSeries": [
                { "year": 1, "gdp": 20000.0, "inflation": 2.0, "unemployment": 5.0, "govtDebtToGdp": 80.0, "giniCoefficient": 0.35 },
                ... (20 years of data)
            ],
            "sectoralAnalysis": [
                { "year": 1, "technology": 15.0, "manufacturing": 20.0, "services": 55.0, "agriculture": 2.0, "energy": 8.0 },
                ... (20 years of data, percentages must sum to 100 for each year)
            ]
        }
        
        Ensure all numerical data is realistic and internally consistent based on established macroeconomic principles. The simulation must explicitly model the interplay between all provided parameters and shocks.
        `;

        return prompt;
    }

    const handleSimulate = async () => {
        if (!activeScenarioId) {
            alert("Please save the current settings as a new scenario before running a simulation.");
            return;
        }
        if (!apiKey) {
            alert("Please set your Gemini API Key.");
            return;
        }

        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({apiKey});
            const prompt = buildSimulationPrompt(parameters, shocks);
            
            const schema = {
                type: Type.OBJECT, properties: {
                    narrativeSummary: { type: Type.STRING },
                    policyRecommendations: { type: Type.STRING },
                    riskAnalysis: { type: Type.OBJECT, properties: {
                        shortTerm: { type: Type.ARRAY, items: { type: Type.STRING }},
                        longTerm: { type: Type.ARRAY, items: { type: Type.STRING }},
                    }},
                    timeSeries: { type: Type.ARRAY, items: {
                        type: Type.OBJECT, properties: {
                            year: { type: Type.NUMBER },
                            gdp: { type: Type.NUMBER },
                            inflation: { type: Type.NUMBER },
                            unemployment: { type: Type.NUMBER },
                            govtDebtToGdp: { type: Type.NUMBER },
                            giniCoefficient: { type: Type.NUMBER },
                        }
                    }},
                    sectoralAnalysis: { type: Type.ARRAY, items: {
                        type: Type.OBJECT, properties: {
                            year: { type: Type.NUMBER },
                            technology: { type: Type.NUMBER },
                            manufacturing: { type: Type.NUMBER },
                            services: { type: Type.NUMBER },
                            agriculture: { type: Type.NUMBER },
                            energy: { type: Type.NUMBER },
                        }
                    }},
                }
            };

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: [{role: 'user', parts: [{text: prompt}]}],
                generationConfig: { responseMimeType: "application/json", responseSchema: schema }
            });
            
            const result: SimulationResult = JSON.parse(response.text);
            dispatch({ type: 'UPDATE_RESULT', payload: { id: activeScenarioId, result } });
            setAdvisorMessages([]); // Clear advisor chat on new simulation

        } catch (err) {
            console.error("Simulation Error:", err);
            alert("An error occurred during the simulation. Please check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdvisorQuery = async () => {
        if (!advisorInput.trim() || !activeScenario?.result) return;
        
        const newMessages: AdvisorMessage[] = [...advisorMessages, { sender: 'user', text: advisorInput }];
        setAdvisorMessages(newMessages);
        setAdvisorInput("");
        setIsAdvisorLoading(true);

        try {
            if (!apiKey) throw new Error("API Key not found.");
            const ai = new GoogleGenAI({ apiKey });

            const context = `You are an expert economic advisor. You are analyzing the results of a macroeconomic simulation.
            
            Here is the summary of the simulation:
            ${activeScenario.result.narrativeSummary}
            
            Here is the time-series data:
            ${JSON.stringify(activeScenario.result.timeSeries, null, 2)}
            
            Here is the user's question. Please provide a concise, insightful answer based *only* on the provided simulation data and summary.
            
            User question: "${advisorInput}"
            `;
            
            const response = await ai.models.generateContent(context);
            setAdvisorMessages([...newMessages, { sender: 'ai', text: response.text }]);

        } catch (err) {
            console.error("Advisor Error:", err);
            setAdvisorMessages([...newMessages, { sender: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsAdvisorLoading(false);
        }
    };

    const sectoralPieData = useMemo(() => {
        if (!activeScenario?.result) return [];
        const lastYearData = activeScenario.result.sectoralAnalysis[activeScenario.result.sectoralAnalysis.length - 1];
        return Object.entries(lastYearData)
            .filter(([key]) => key !== 'year')
            .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    }, [activeScenario]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Economic Synthesis Engine</h2>
                {!apiKey && (
                    <div className="flex items-center space-x-2">
                        <input 
                            type="password"
                            placeholder="Enter Gemini API Key"
                            className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white placeholder-gray-500"
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                         <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm">Get Key</a>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Configuration */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Scenario Manager">
                        <div className="space-y-3">
                            <div className="flex space-x-2">
                                <button onClick={handleSaveScenario} className="w-full flex items-center justify-center py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"><SaveIcon /> Save Current</button>
                            </div>
                            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                                {scenarios.map(s => (
                                    <div key={s.id} className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${activeScenarioId === s.id ? 'bg-cyan-900/50' : 'bg-gray-700/50 hover:bg-gray-600/50'}`} onClick={() => handleLoadScenario(s.id)}>
                                        <span className="font-medium text-sm">{s.name}</span>
                                        {s.result && <span className="text-xs text-green-400">Simulated</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card title="Economic Parameters">
                        <div className="border-b border-gray-700 mb-4">
                            <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                                {PARAMETER_CATEGORIES.map(tab => (
                                    <button key={tab.id} onClick={() => setCurrentTab(tab.id)} className={`${currentTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(parameterConfig)
                                .filter(([, config]) => config.category === currentTab)
                                .map(([id, config]) => (
                                    <ParameterSlider key={id} id={id} config={config} value={parameters[id]} onChange={handleParamChange} />
                                ))}
                        </div>
                    </Card>

                    <Card title="Event Shocks (20-Year Timeline)">
                        <div className="space-y-3">
                            <button onClick={handleAddShock} className="w-full flex items-center justify-center py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm"><PlusIcon />Add Shock</button>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {shocks.map(shock => (
                                <div key={shock.id} className="p-2 border border-gray-700 rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                       <p className="text-sm font-semibold">Shock at Year {shock.year}</p>
                                       <button onClick={() => handleRemoveShock(shock.id)}><TrashIcon /></button>
                                    </div>
                                     <input type="range" min={1} max={20} step={1} value={shock.year} onChange={e => handleShockChange(shock.id, 'year', Number(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-red" />
                                     <select value={shock.type} onChange={e => handleShockChange(shock.id, 'type', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm">
                                         <option>Supply</option><option>Demand</option><option>Financial</option><option>Geopolitical</option><option>Pandemic</option>
                                     </select>
                                     <input type="text" placeholder="Description" value={shock.description} onChange={e => handleShockChange(shock.id, 'description', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm" />
                                </div>
                            ))}
                            </div>
                        </div>
                    </Card>

                    <button onClick={handleSimulate} disabled={isLoading || !activeScenarioId} className="w-full py-3 text-lg bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4 font-bold tracking-wider">
                        {isLoading ? 'Synthesizing...' : 'Run 20-Year Simulation'}
                    </button>
                </div>

                {/* Right Panel: Results */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title={activeScenario ? `Simulation Results: ${activeScenario.name}` : "Simulation Results"}>
                        <div className="min-h-[600px]">
                            {isLoading && <p className="text-center pt-20">Synthesizing economic trajectory... This may take a moment.</p>}
                            {!isLoading && !activeScenario?.result && <p className="text-gray-500 text-center pt-20">Configure parameters, save a scenario, and run a simulation. Output will appear here.</p>}
                            {activeScenario?.result && (
                                <>
                                    <div className="border-b border-gray-700 mb-4">
                                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                            {['summary', 'macro', 'social', 'sectors'].map(tab => (
                                                <button key={tab} onClick={() => setResultsTab(tab)} className={`${resultsTab === tab ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} capitalize whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                                                    {tab} View
                                                </button>
                                            ))}
                                        </nav>
                                    </div>

                                    {resultsTab === 'summary' && (
                                        <div className="space-y-4 animate-fade-in">
                                            <h3 className="text-xl font-semibold text-white">Narrative Summary</h3>
                                            <p className="text-sm text-gray-300 leading-relaxed italic">"{activeScenario.result.narrativeSummary}"</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-white">Policy Recommendations</h4>
                                                    <p className="text-sm text-gray-300 mt-2">{activeScenario.result.policyRecommendations}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-white">Risk Analysis</h4>
                                                    <ul className="list-disc list-inside text-sm text-gray-300 mt-2 space-y-1">
                                                        <li className="font-bold">Short-Term:</li>
                                                        {activeScenario.result.riskAnalysis.shortTerm.map((risk, i) => <li key={i} className="ml-4">{risk}</li>)}
                                                        <li className="font-bold mt-2">Long-Term:</li>
                                                        {activeScenario.result.riskAnalysis.longTerm.map((risk, i) => <li key={i} className="ml-4">{risk}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {resultsTab === 'macro' && (
                                        <div className="space-y-8 animate-fade-in">
                                            <div>
                                                <h4 className="text-lg font-semibold text-center mb-2">GDP Growth</h4>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <AreaChart data={activeScenario.result.timeSeries}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                                        <XAxis dataKey="year" stroke="#9ca3af" />
                                                        <YAxis stroke="#9ca3af" tickFormatter={(val) => `$${(val/1000).toFixed(1)}T`}/>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Area type="monotone" dataKey="gdp" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="GDP (Billions)" unit="B" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-center mb-2">Inflation vs. Unemployment</h4>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <LineChart data={activeScenario.result.timeSeries}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                                        <XAxis dataKey="year" stroke="#9ca3af" />
                                                        <YAxis stroke="#9ca3af" tickFormatter={(val) => `${val}%`} />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Line type="monotone" dataKey="inflation" stroke="#ff7300" name="Inflation" unit="%" />
                                                        <Line type="monotone" dataKey="unemployment" stroke="#387908" name="Unemployment" unit="%" />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}
                                    {resultsTab === 'social' && (
                                        <div className="space-y-8 animate-fade-in">
                                             <div>
                                                <h4 className="text-lg font-semibold text-center mb-2">Government Debt to GDP</h4>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <BarChart data={activeScenario.result.timeSeries}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                                        <XAxis dataKey="year" stroke="#9ca3af" />
                                                        <YAxis stroke="#9ca3af" unit="%"/>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Bar dataKey="govtDebtToGdp" fill="#4ade80" name="Debt to GDP Ratio" unit="%" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                             <div>
                                                <h4 className="text-lg font-semibold text-center mb-2">Income Inequality (Gini Coefficient)</h4>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <AreaChart data={activeScenario.result.timeSeries}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                                        <XAxis dataKey="year" stroke="#9ca3af" />
                                                        <YAxis stroke="#9ca3af" domain={[0, 1]} />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Area type="monotone" dataKey="giniCoefficient" stroke="#facc15" fill="#facc15" fillOpacity={0.3} name="Gini Coefficient" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}
                                     {resultsTab === 'sectors' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                            <div>
                                                <h4 className="text-lg font-semibold text-center mb-2">Sectoral Composition Over Time</h4>
                                                <ResponsiveContainer width="100%" height={300}>
                                                     <AreaChart data={activeScenario.result.sectoralAnalysis}>
                                                         <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                                         <XAxis dataKey="year" stroke="#9ca3af" />
                                                         <YAxis stroke="#9ca3af" unit="%"/>
                                                         <Tooltip content={<CustomTooltip />} />
                                                         <Legend />
                                                         <Area type="monotone" stackId="1" dataKey="technology" stroke="#0088FE" fill="#0088FE" name="Tech" unit="%" />
                                                         <Area type="monotone" stackId="1" dataKey="manufacturing" stroke="#00C49F" fill="#00C49F" name="Manufacturing" unit="%" />
                                                         <Area type="monotone" stackId="1" dataKey="services" stroke="#FFBB28" fill="#FFBB28" name="Services" unit="%" />
                                                         <Area type="monotone" stackId="1" dataKey="energy" stroke="#FF8042" fill="#FF8042" name="Energy" unit="%" />
                                                         <Area type="monotone" stackId="1" dataKey="agriculture" stroke="#AF19FF" fill="#AF19FF" name="Agriculture" unit="%" />
                                                     </AreaChart>
                                                 </ResponsiveContainer>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-center mb-2">Final Year Sectoral GDP Share</h4>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie data={sectoralPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                                            {sectoralPieData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </Card>

                    <Card title="AI Policy Advisor">
                        <div className="flex flex-col h-96">
                            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-900/50 rounded-t-lg">
                                {!activeScenario?.result && <div className="text-center text-gray-500 pt-10">Run a simulation to activate the advisor.</div>}
                                {activeScenario?.result && advisorMessages.length === 0 && <div className="text-center text-gray-500 pt-10">Ask a question about the simulation results, e.g., "What caused the inflation spike in year 8?"</div>}
                                {advisorMessages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-800' : 'bg-gray-700'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isAdvisorLoading && <div className="text-center text-gray-400">Advisor is thinking...</div>}
                            </div>
                            <div className="flex items-center p-2 border-t border-gray-700">
                                <input
                                    type="text"
                                    value={advisorInput}
                                    onChange={e => setAdvisorInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleAdvisorQuery()}
                                    placeholder={activeScenario?.result ? "Ask about the results..." : "Run a simulation first"}
                                    disabled={!activeScenario?.result || isAdvisorLoading}
                                    className="flex-grow bg-gray-800 border-gray-600 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                                />
                                <button onClick={handleAdvisorQuery} disabled={!activeScenario?.result || isAdvisorLoading} className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-r-md text-sm font-semibold disabled:opacity-50">Send</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EconomicSynthesisEngineView;
```