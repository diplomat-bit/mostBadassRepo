// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/QuantumWeaverView.tsx
================================================================================

```typescript
// components/views/platform/QuantumWeaverView.tsx
import React, { useState, useContext, useEffect, useReducer, createContext, useCallback, useRef, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_
// SECTION: CORE TYPES AND INTERFACES
// This section defines the data structures for the entire Quantum Weaver feature.
// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_

export type WeaverStage =
    | 'IDLE'
    | 'ANALYZING_PITCH'
    | 'PITCH_FEEDBACK_READY'
    | 'SUBMITTING_ANSWERS'
    | 'AWAITING_DECISION'
    | 'DECISION_REJECTED'
    | 'DECISION_APPROVED'
    | 'FINALIZING_PACKAGE'
    | 'DASHBOARD_READY'
    | 'ERROR';

export type KPIKey = 'mrr' | 'cac' | 'ltv' | 'churn' | 'user_growth' | 'burn_rate' | 'net_profit_margin';

export interface KPI {
    key: KPIKey;
    name: string;
    value: number;
    trend: number; // Percentage change
    unit: 'currency' | 'percentage' | 'integer';
    description: string;
    historicalData: { month: string; value: number }[];
}

export interface AIPlan {
    title: string;
    summary: string;
    steps: {
        title: string;
        description: string;
        timeline: string;
    }[];
}

export interface AIQuestion {
    question: string;
    category: 'Market' | 'Product' | 'Finance' | 'Team' | 'Strategy';
}

export interface CoachingStep extends AIPlan['steps'][0] {
    id: string;
    status: 'pending' | 'in_progress' | 'completed';
    subtasks: { id: string; text: string; completed: boolean }[];
    notes?: string;
}

export interface EnhancedCoachingPlan extends AIPlan {
    steps: CoachingStep[];
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'plato';
    text: string;
    timestamp: number;
    isLoading?: boolean;
}

export interface MarketSimulationResult {
    scenario: 'Optimistic' | 'Pessimistic' | 'Aggressive Competition';
    projectedRevenue: number[];
    projectedUsers: number[];
    narrative: string;
}

export interface Competitor {
    name: string;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
}

// The main state object for the entire application view.
export interface WeaverState {
    stage: WeaverStage;
    businessPlan: string;
    feedback: string;
    questions: AIQuestion[];
    userAnswers: string[];
    rejectionReason: string | null;
    loanAmount: number;
    coachingPlan: EnhancedCoachingPlan | null;
    kpis: KPI[];
    chatHistory: ChatMessage[];
    marketSimulations: MarketSimulationResult[];
    competitors: Competitor[];
    error: string | null;
    isStateHydrated: boolean;
    apiKey: string | null;
}

export type WeaverAction =
    | { type: 'SET_API_KEY'; payload: { apiKey: string } }
    | { type: 'START_ANALYSIS'; payload: { plan: string } }
    | { type: 'ANALYSIS_FAILED'; payload: { error: string } }
    | { type: 'ANALYSIS_SUCCEEDED'; payload: { feedback: string; questions: AIQuestion[] } }
    | { type: 'START_TEST_SUBMISSION'; payload: { answers: string[] } }
    | { type: 'TEST_PASSED'; payload: { loanAmount: number; coachingPlan: AIPlan; kpis: KPI[], marketSimulations: MarketSimulationResult[], competitors: Competitor[] } }
    | { type: 'TEST_FAILED'; payload: { reason: string } }
    | { type: 'FINALIZATION_FAILED'; payload: { error: string } }
    | { type: 'RETRY_FROM_ERROR' }
    | { type: 'RESET_PROCESS' }
    | { type: 'TOGGLE_COACHING_STEP'; payload: { stepId: string } }
    | { type: 'TOGGLE_SUBTASK'; payload: { stepId: string; subtaskId: string } }
    | { type: 'ADD_CHAT_MESSAGE'; payload: { message: ChatMessage } }
    | { type: 'RECEIVE_CHAT_RESPONSE'; payload: { message: ChatMessage } }
    | { type: 'STREAM_CHAT_RESPONSE'; payload: { messagePart: string } }
    | { type: 'FINISH_CHAT_STREAM' }
    | { type: 'UPDATE_KPIS'; payload: { kpis: KPI[] } }
    | { type: 'HYDRATE_STATE'; payload: { state: Partial<WeaverState> } };

// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_
// SECTION: AI API CLIENT
// A robust, mockable client for interacting with the generative AI model.
// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_

export class WeaverAPIClient {
    private ai: GoogleGenAI | null = null;

    constructor(apiKey: string) {
        if (!apiKey) {
            console.error("QuantumWeaver: API key is missing. AI features will be disabled.");
        } else {
            // This structure would allow for different AI providers in the future
            this.ai = new GoogleGenAI({ apiKey });
        }
    }

    private async generate(prompt: string, schema?: any) {
        if (!this.ai?.models) {
            throw new Error("AI Client not initialized. Please provide a valid API key.");
        }
        const response = await this.ai.models.generateContent({
            model: 'gemini-pro',
            contents: prompt,
            ...(schema && {
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            })
        });
        return schema ? JSON.parse(response.text) : response.text;
    }

    public async analyzePitch(plan: string) {
        const prompt = `You are Plato, an AI venture capitalist. Analyze this business plan with a critical but encouraging tone. Provide brief initial feedback (2-3 sentences) and 4 insightful follow-up questions for the founder across different domains (Market, Product, Finance, Team). Plan: "${plan}"`;
        const schema = {
            type: Type.OBJECT, properties: {
                feedback: { type: Type.STRING, description: "Constructive, brief feedback on the business plan." },
                questions: {
                    type: Type.ARRAY, items: {
                        type: Type.OBJECT, properties: {
                            question: { type: Type.STRING, description: "An insightful question for the founder." },
                            category: { type: Type.STRING, enum: ['Market', 'Product', 'Finance', 'Team', 'Strategy'], description: "The category of the question." }
                        }
                    }
                }
            }
        };
        return this.generate(prompt, schema);
    }

    public async evaluateAnswers(plan: string, questions: AIQuestion[], answers: string[]) {
        const qaPairs = questions.map((q, i) => `Q (${q.category}): ${q.question}\nA: ${answers[i]}`).join('\n\n');
        const prompt = `You are Plato, an AI venture capitalist. The founder has submitted a business plan and answered your follow-up questions. Based on their answers, decide if you will fund them. If yes, respond with "APPROVED". If no, provide a concise, constructive reason for rejection (3-4 sentences). Your decision should be based on the coherence, foresight, and realism demonstrated in their answers. \n\nOriginal Plan: "${plan}"\n\n${qaPairs}`;
        const schema = {
            type: Type.OBJECT, properties: {
                decision: { type: Type.STRING, enum: ['APPROVED', 'REJECTED'] },
                reason: { type: Type.STRING, description: "A concise reason for the decision. Only populated if REJECTED." }
            }
        };
        return this.generate(prompt, schema);
    }

    public async generateFundingPackage(plan: string) {
        const prompt = `A business plan has been approved for seed funding. You are Plato, an AI VC. Generate a comprehensive funding package.

        1.  **Funding Amount**: Determine an appropriate seed funding amount between $75,000 and $500,000, in increments of $5,000. Base this on the perceived potential and capital needs from the plan.
        2.  **Coaching Plan**: Create a detailed 5-step coaching plan. Each step needs a title, a detailed description, a realistic timeline (e.g., "Weeks 1-2"), and 3 actionable subtasks.
        3.  **Initial KPIs**: Define 5 key performance indicators (KPIs) to track. For each, provide a name, a realistic starting value, a description, and 12 months of mock historical data to simulate a trend. Include MRR, Churn, and User Growth.
        4.  **Market Simulation**: Create 3 market simulation scenarios (Optimistic, Pessimistic, Aggressive Competition). For each, provide a brief narrative and 12 months of projected revenue and user data.
        5.  **Competitive Landscape**: Identify 3 likely competitors. For each, estimate their market share and list 2 strengths and 2 weaknesses.

        Original Plan: "${plan}"`;

        const kpiSchema = {
            type: Type.OBJECT, properties: {
                key: { type: Type.STRING, enum: ['mrr', 'cac', 'ltv', 'churn', 'user_growth', 'burn_rate', 'net_profit_margin'] },
                name: { type: Type.STRING },
                value: { type: Type.NUMBER },
                trend: { type: Type.NUMBER },
                unit: { type: Type.STRING, enum: ['currency', 'percentage', 'integer'] },
                description: { type: Type.STRING },
                historicalData: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { month: { type: Type.STRING }, value: { type: Type.NUMBER } } } }
            }
        };

        const schema = {
            type: Type.OBJECT, properties: {
                loanAmount: { type: Type.NUMBER },
                coachingPlan: {
                    type: Type.OBJECT, properties: {
                        title: { type: Type.STRING }, summary: { type: Type.STRING },
                        steps: {
                            type: Type.ARRAY, items: {
                                type: Type.OBJECT, properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    timeline: { type: Type.STRING },
                                    subtasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                                }
                            }
                        }
                    }
                },
                kpis: { type: Type.ARRAY, items: kpiSchema },
                marketSimulations: {
                    type: Type.ARRAY, items: {
                        type: Type.OBJECT, properties: {
                            scenario: { type: Type.STRING, enum: ['Optimistic', 'Pessimistic', 'Aggressive Competition'] },
                            projectedRevenue: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                            projectedUsers: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                            narrative: { type: Type.STRING }
                        }
                    }
                },
                competitors: {
                    type: Type.ARRAY, items: {
                        type: Type.OBJECT, properties: {
                            name: { type: Type.STRING },
                            marketShare: { type: Type.NUMBER },
                            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            }
        };
        return this.generate(prompt, schema);
    }

    public async getMentorshipAdvice(plan: string, chatHistory: ChatMessage[], userQuery: string) {
        const history = chatHistory.map(m => `${m.sender === 'user' ? 'Founder' : 'Plato'}: ${m.text}`).join('\n');
        const prompt = `You are Plato, an AI business mentor. A founder you've funded needs advice. Provide a helpful, concise, and actionable response. Be encouraging but direct. Use markdown for formatting if it helps clarity (e.g., lists, bolding).
        
        Original Business Plan Context: "${plan}"
        
        Conversation History:
        ${history}
        
        Founder's New Question: "${userQuery}"`;

        return this.generate(prompt);
    }
}

// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_
// SECTION: UTILITIES & ICONS
// Helper functions and a simple SVG icon component library.
// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_

export const formatCurrency = (amount: number, compact = false): string => {
    if (compact) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = "h-6 w-6" }) => {
    const icons: { [key: string]: JSX.Element } = {
        'check': <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
        'send': <path d="M10.894 2.886l4.118 4.118a1 1 0 010 1.414l-4.118 4.118" />,
        'bulb': <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
        'chart': <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
        'x': <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
        'arrow-right': <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />,
        'robot': <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-2 2-2-2z" />,
        'user': <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
        'clipboard': <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
        'money': <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14v1m0-6.01V10m0 4.01V14m0-4c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        'chevron-down': <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />,
        'chevron-up': <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />,
        'spinner': <path d="M12 3a9 9 0 1 0 9 9" />,
        'external-link': <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />,
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {icons[name] || <circle cx="12" cy="12" r="10" />}
        </svg>
    );
};


// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_
// SECTION: STATE MANAGEMENT (REDUCER, CONTEXT, PROVIDER)
// Centralized logic for managing the application state via a reducer and context.
// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_

const initialState: WeaverState = {
    stage: 'IDLE',
    businessPlan: '',
    feedback: '',
    questions: [],
    userAnswers: [],
    rejectionReason: null,
    loanAmount: 0,
    coachingPlan: null,
    kpis: [],
    chatHistory: [],
    marketSimulations: [],
    competitors: [],
    error: null,
    isStateHydrated: false,
    apiKey: null,
};

function weaverReducer(state: WeaverState, action: WeaverAction): WeaverState {
    switch (action.type) {
        case 'SET_API_KEY':
            return { ...state, apiKey: action.payload.apiKey };
        case 'START_ANALYSIS':
            return { ...initialState, apiKey: state.apiKey, stage: 'ANALYZING_PITCH', businessPlan: action.payload.plan };
        case 'ANALYSIS_FAILED':
            return { ...state, stage: 'ERROR', error: action.payload.error };
        case 'ANALYSIS_SUCCEEDED':
            return { ...state, stage: 'PITCH_FEEDBACK_READY', feedback: action.payload.feedback, questions: action.payload.questions };
        case 'START_TEST_SUBMISSION':
            return { ...state, stage: 'AWAITING_DECISION', userAnswers: action.payload.answers };
        case 'TEST_PASSED':
            const newCoachingPlan: EnhancedCoachingPlan = {
                ...action.payload.coachingPlan,
                steps: action.payload.coachingPlan.steps.map((step, index) => ({
                    ...step,
                    id: `step-${index}`,
                    status: 'pending',
                    subtasks: (step as any).subtasks.map((subtaskText: string, subIndex: number) => ({
                        id: `step-${index}-subtask-${subIndex}`,
                        text: subtaskText,
                        completed: false,
                    }))
                }))
            };
            return {
                ...state,
                stage: 'DECISION_APPROVED',
                loanAmount: action.payload.loanAmount,
                coachingPlan: newCoachingPlan,
                kpis: action.payload.kpis,
                marketSimulations: action.payload.marketSimulations,
                competitors: action.payload.competitors,
                chatHistory: [{ id: 'intro', sender: 'plato', text: `Welcome! I'm here to help you grow. What's on your mind?`, timestamp: Date.now() }]
            };
        case 'TEST_FAILED':
            return { ...state, stage: 'DECISION_REJECTED', rejectionReason: action.payload.reason };
        case 'RETRY_FROM_ERROR':
            return { ...state, stage: 'IDLE', error: null };
        case 'RESET_PROCESS':
            return { ...initialState, apiKey: state.apiKey };
        case 'TOGGLE_COACHING_STEP':
            if (!state.coachingPlan) return state;
            return {
                ...state,
                coachingPlan: {
                    ...state.coachingPlan,
                    steps: state.coachingPlan.steps.map(step =>
                        step.id === action.payload.stepId
                            ? { ...step, status: step.status === 'completed' ? 'pending' : 'completed' }
                            : step
                    ),
                }
            };
        case 'TOGGLE_SUBTASK':
            if (!state.coachingPlan) return state;
            return {
                ...state,
                coachingPlan: {
                    ...state.coachingPlan,
                    steps: state.coachingPlan.steps.map(step =>
                        step.id === action.payload.stepId
                            ? {
                                ...step,
                                subtasks: step.subtasks.map(subtask =>
                                    subtask.id === action.payload.subtaskId
                                        ? { ...subtask, completed: !subtask.completed }
                                        : subtask
                                )
                            }
                            : step
                    ),
                }
            };
        case 'ADD_CHAT_MESSAGE':
            return {
                ...state,
                chatHistory: [...state.chatHistory, action.payload.message, { id: 'loading', sender: 'plato', text: '...', timestamp: Date.now(), isLoading: true }]
            };
        case 'RECEIVE_CHAT_RESPONSE':
            return {
                ...state,
                chatHistory: state.chatHistory.map(m => m.id === 'loading' ? action.payload.message : m)
            };
        case 'HYDRATE_STATE':
            return { ...state, ...action.payload.state, isStateHydrated: true };
        default:
            return state;
    }
}

const WeaverContext = createContext<{ state: WeaverState; dispatch: React.Dispatch<WeaverAction> } | undefined>(undefined);

const useWeaver = () => {
    const context = useContext(WeaverContext);
    if (!context) {
        throw new Error('useWeaver must be used within a WeaverProvider');
    }
    return context;
};

// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_
// SECTION: REUSABLE UI COMPONENTS
// Smaller, specialized components used to build the main views.
// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_

const KpiCard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
    const isPositive = kpi.trend >= 0;
    const trendColor = isPositive ? 'text-green-500' : 'text-red-500';
    const formattedValue = kpi.unit === 'currency' ? formatCurrency(kpi.value, true) : `${kpi.value.toLocaleString()}${kpi.unit === 'percentage' ? '%' : ''}`;

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300">
            <h3 className="text-sm font-medium text-gray-400">{kpi.name}</h3>
            <p className="text-3xl font-bold text-white mt-1">{formattedValue}</p>
            <div className={`flex items-center text-sm mt-1 ${trendColor}`}>
                <Icon name={isPositive ? 'chevron-up' : 'chevron-down'} className="h-4 w-4 mr-1" />
                <span>{Math.abs(kpi.trend)}% vs last period</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
        </div>
    );
};

const CoachingStepComponent: React.FC<{ step: CoachingStep }> = ({ step }) => {
    const { dispatch } = useWeaver();
    const [isOpen, setIsOpen] = useState(false);
    const progress = step.subtasks.length > 0 ? (step.subtasks.filter(s => s.completed).length / step.subtasks.length) * 100 : 0;

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-3">
            <div className="p-4 cursor-pointer flex items-center justify-between" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center">
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center mr-4 ${progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}>
                        {progress === 100 ? <Icon name="check" className="text-white"/> : <Icon name="clipboard" className="h-5 w-5 text-white"/> }
                    </span>
                    <div>
                        <p className="font-bold text-white">{step.title} <span className="text-xs font-normal text-gray-400 ml-2">{step.timeline}</span></p>
                        <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                </div>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} className="h-5 w-5 text-gray-400" />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-2 border-t border-gray-700">
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <ul className="space-y-2">
                                {step.subtasks.map(subtask => (
                                    <li key={subtask.id} className="flex items-center text-gray-300">
                                        <input
                                            type="checkbox"
                                            id={subtask.id}
                                            checked={subtask.completed}
                                            onChange={() => dispatch({ type: 'TOGGLE_SUBTASK', payload: { stepId: step.id, subtaskId: subtask.id } })}
                                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={subtask.id} className={`ml-3 ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                                            {subtask.text}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isPlato = message.sender === 'plato';
    return (
        <div className={`flex items-start gap-3 ${isPlato ? '' : 'flex-row-reverse'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${isPlato ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                <Icon name={isPlato ? 'robot' : 'user'} className="h-5 w-5"/>
            </div>
            <div className={`p-3 rounded-lg max-w-lg ${isPlato ? 'bg-gray-700' : 'bg-blue-600'}`}>
                {message.isLoading ? (
                     <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-300 rounded-full animate-pulse"></span>
                     </div>
                ) : (
                    <p className="text-white text-sm" dangerouslySetInnerHTML={{__html: message.text.replace(/\n/g, '<br />')}}></p>
                )}
            </div>
        </div>
    );
};

// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_
// SECTION: STAGE-BASED VIEWS
// Main view components that are rendered based on the current `WeaverStage`.
// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_

const ApiKeyPromptView: React.FC<{}> = () => {
    const { dispatch } = useWeaver();
    const [key, setKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(key.trim()) {
            dispatch({ type: 'SET_API_KEY', payload: { apiKey: key.trim() } });
            localStorage.setItem('quantum_weaver_api_key', key.trim());
        }
    }

    return (
        <div className="max-w-xl mx-auto text-center">
            <Icon name="robot" className="h-16 w-16 mx-auto text-indigo-400" />
            <h2 className="mt-4 text-2xl font-bold text-white">Welcome to Quantum Weaver</h2>
            <p className="mt-2 text-gray-400">
                To power the AI analysis, please provide your Google Gemini API key. Your key is stored locally and never sent to our servers.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
                <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter your Gemini API Key"
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button type="submit" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors">
                    Continue
                </button>
            </form>
            <p className="mt-4 text-xs text-gray-500">
                You can get a free API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">Google AI Studio</a>.
            </p>
        </div>
    );
}

const PitchSubmissionView: React.FC<{}> = () => {
    const { dispatch } = useWeaver();
    const [plan, setPlan] = useState('');

    const handleSubmit = () => {
        if (plan.trim().length > 50) { // Basic validation
            dispatch({ type: 'START_ANALYSIS', payload: { plan } });
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center">Pitch to Plato, Your AI VC</h2>
            <p className="text-gray-400 text-center mt-2">Submit your business plan for initial analysis. Be concise but comprehensive.</p>
            <textarea
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Describe your business: What is the problem you're solving? What is your solution? Who is your target market? What is your business model?"
                className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-4 mt-6 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
            <button
                onClick={handleSubmit}
                disabled={plan.trim().length < 50}
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg mt-4 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
            >
                Submit for Analysis
            </button>
        </div>
    );
};

const AnalysisFeedbackView: React.FC<{}> = () => {
    const { state, dispatch } = useWeaver();
    const [answers, setAnswers] = useState<string[]>(Array(state.questions.length).fill(''));
    const isSubmittable = answers.every(a => a.trim().length > 10);

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        if (isSubmittable) {
            dispatch({ type: 'START_TEST_SUBMISSION', payload: { answers } });
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white">Initial Feedback from Plato</h2>
            <div className="bg-gray-800 p-4 rounded-lg mt-4 border border-gray-700">
                <p className="text-gray-300 italic">"{state.feedback}"</p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8">Follow-up Questions</h3>
            <div className="space-y-6 mt-4">
                {state.questions.map((q, index) => (
                    <div key={index}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded-full mr-2">{q.category}</span>
                            {q.question}
                        </label>
                        <textarea
                            value={answers[index]}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            placeholder="Your detailed answer..."
                            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!isSubmittable}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg mt-8 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-green-500 transition-colors"
            >
                Submit Answers for Funding Decision
            </button>
        </div>
    );
};

const DecisionView: React.FC<{ approved: boolean }> = ({ approved }) => {
    const { state, dispatch } = useWeaver();

    if (approved) {
        useEffect(() => {
            // Move to the dashboard after a delay to show the approval message
            const timer = setTimeout(() => {
                dispatch({ type: 'DASHBOARD_READY' });
            }, 4000);
            return () => clearTimeout(timer);
        }, [dispatch]);
    }
    
    return (
        <div className="text-center max-w-2xl mx-auto">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
            >
                <div className={`p-8 rounded-full inline-block ${approved ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                     <div className={`p-8 rounded-full inline-block ${approved ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                        <div className={`h-24 w-24 rounded-full flex items-center justify-center ${approved ? 'bg-green-500' : 'bg-red-500'}`}>
                            <Icon name={approved ? 'check' : 'x'} className="h-16 w-16 text-white" />
                        </div>
                    </div>
                </div>
            </motion.div>
            <h2 className="text-4xl font-bold mt-6 text-white">{approved ? "Congratulations, You're Funded!" : "Funding Decision"}</h2>
            {approved ? (
                <>
                    <p className="text-gray-300 text-xl mt-2">
                        Seed Investment Amount: <span className="font-bold text-green-400">{formatCurrency(state.loanAmount)}</span>
                    </p>
                    <p className="text-gray-400 mt-4">Plato was impressed with your vision and responses. We're excited to partner with you. Your personalized dashboard and coaching plan are being prepared...</p>
                </>
            ) : (
                <>
                    <p className="text-gray-300 mt-2">After careful consideration, we've decided not to proceed with funding at this time.</p>
                    <div className="bg-gray-800 p-4 rounded-lg mt-6 border border-gray-700 text-left">
                        <h4 className="font-semibold text-white">Plato's Reasoning:</h4>
                        <p className="text-gray-400 mt-2 italic">"{state.rejectionReason}"</p>
                    </div>
                    <button
                        onClick={() => dispatch({ type: 'RESET_PROCESS' })}
                        className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg mt-8 hover:bg-indigo-500 transition-colors"
                    >
                        Start Over
                    </button>
                </>
            )}
        </div>
    );
};


const ApprovedDashboardView: React.FC = () => {
    const { state, dispatch } = useWeaver();
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const apiClient = useMemo(() => state.apiKey ? new WeaverAPIClient(state.apiKey) : null, [state.apiKey]);


    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.chatHistory]);

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !apiClient) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: chatInput,
            timestamp: Date.now(),
        };
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { message: userMessage } });
        setChatInput('');

        try {
            const response = await apiClient.getMentorshipAdvice(state.businessPlan, state.chatHistory, chatInput);
            const platoMessage: ChatMessage = {
                id: `plato-${Date.now()}`,
                sender: 'plato',
                text: response,
                timestamp: Date.now(),
            };
            dispatch({ type: 'RECEIVE_CHAT_RESPONSE', payload: { message: platoMessage } });
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = {
                id: `plato-error-${Date.now()}`,
                sender: 'plato',
                text: 'I seem to be having trouble connecting. Please try again in a moment.',
                timestamp: Date.now(),
            };
            dispatch({ type: 'RECEIVE_CHAT_RESPONSE', payload: { message: errorMessage } });
        }
    };
    
    return (
        <div className="h-full w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Column: KPIs and Coaching */}
            <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-2xl font-bold text-white">Performance Dashboard</h2>
                         <button onClick={() => dispatch({ type: 'RESET_PROCESS' })} className="text-sm text-gray-400 hover:text-white">Start New Project</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                        {state.kpis.map(kpi => <KpiCard key={kpi.key} kpi={kpi} />)}
                    </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-2xl font-bold text-white mb-4">AI-Generated Coaching Plan</h2>
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        {state.coachingPlan?.steps.map(step => <CoachingStepComponent key={step.id} step={step} />)}
                    </div>
                </motion.div>
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <h2 className="text-2xl font-bold text-white mb-4">Competitive Landscape</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {state.competitors.map(c => (
                            <div key={c.name} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <h3 className="font-bold text-white">{c.name} <span className="text-sm font-normal text-gray-400">({c.marketShare}% share)</span></h3>
                                <div className="mt-2">
                                    <h4 className="text-sm text-green-400">Strengths</h4>
                                    <ul className="list-disc list-inside text-xs text-gray-300">
                                        {c.strengths.map((s,i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                 <div className="mt-2">
                                    <h4 className="text-sm text-red-400">Weaknesses</h4>
                                    <ul className="list-disc list-inside text-xs text-gray-300">
                                        {c.weaknesses.map((s,i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Chat and Simulations */}
            <div className="flex flex-col gap-6">
                <motion.div className="bg-gray-800 rounded-lg border border-gray-700 flex-grow flex flex-col" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                     <h2 className="text-xl font-bold text-white p-4 border-b border-gray-700">Chat with Plato</h2>
                     <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                        {state.chatHistory.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                        <div ref={chatEndRef} />
                     </div>
                     <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-700 flex items-center gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask for advice..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button type="submit" className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-500 transition-colors disabled:bg-gray-600" disabled={!chatInput.trim()}>
                            <Icon name="send" className="h-5 w-5"/>
                        </button>
                     </form>
                </motion.div>

                 <motion.div className="bg-gray-800 rounded-lg border border-gray-700 p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <h2 className="text-xl font-bold text-white mb-4">Market Simulations</h2>
                     <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={state.marketSimulations[0]?.projectedRevenue.map((val, i) => ({name: `M${i+1}`, Optimistic: val, Pessimistic: state.marketSimulations[1].projectedRevenue[i]}))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} />
                            <YAxis stroke="#A0AEC0" fontSize={12} tickFormatter={(value) => formatCurrency(value as number, true)} />
                            <Tooltip contentStyle={{backgroundColor: '#1A202C', border: '1px solid #4A5568'}} labelStyle={{color: '#E2E8F0'}}/>
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                            <Line type="monotone" dataKey="Optimistic" stroke="#48BB78" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="Pessimistic" stroke="#F56565" strokeWidth={2} dot={false}/>
                        </LineChart>
                     </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
};

// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_
// SECTION: MAIN COMPONENT & ORCHESTRATOR
// The primary component that manages the overall view and state transitions.
// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_

const QuantumWeaverView: React.FC = () => {
    const [state, dispatch] = useReducer(weaverReducer, initialState);
    const apiClient = useMemo(() => state.apiKey ? new WeaverAPIClient(state.apiKey) : null, [state.apiKey]);

    // Hydrate state from localStorage on initial load
    useEffect(() => {
        const savedState = localStorage.getItem('quantum_weaver_state');
        const savedApiKey = localStorage.getItem('quantum_weaver_api_key');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            dispatch({ type: 'HYDRATE_STATE', payload: { state: {...parsedState, apiKey: savedApiKey} } });
        } else if (savedApiKey) {
            dispatch({ type: 'SET_API_KEY', payload: { apiKey: savedApiKey } });
        }
    }, []);

    // Persist state to localStorage whenever it changes
    useEffect(() => {
        if (state.isStateHydrated || state.stage !== 'IDLE') {
            const stateToSave = { ...state, isStateHydrated: undefined, apiKey: undefined };
            localStorage.setItem('quantum_weaver_state', JSON.stringify(stateToSave));
        }
    }, [state]);

    const performAnalysis = useCallback(async () => {
        if (state.stage !== 'ANALYZING_PITCH' || !apiClient) return;
        try {
            const result = await apiClient.analyzePitch(state.businessPlan);
            dispatch({ type: 'ANALYSIS_SUCCEEDED', payload: result });
        } catch (error: any) {
            dispatch({ type: 'ANALYSIS_FAILED', payload: { error: error.message } });
        }
    }, [state.stage, state.businessPlan, apiClient]);

    const evaluateAnswers = useCallback(async () => {
        if (state.stage !== 'AWAITING_DECISION' || !apiClient) return;
        try {
            const result = await apiClient.evaluateAnswers(state.businessPlan, state.questions, state.userAnswers);
            if (result.decision === 'APPROVED') {
                const packageResult = await apiClient.generateFundingPackage(state.businessPlan);
                dispatch({ type: 'TEST_PASSED', payload: packageResult });
            } else {
                dispatch({ type: 'TEST_FAILED', payload: { reason: result.reason } });
            }
        } catch (error: any) {
            dispatch({ type: 'ANALYSIS_FAILED', payload: { error: error.message } });
        }
    }, [state.stage, state.businessPlan, state.questions, state.userAnswers, apiClient]);

    useEffect(() => { performAnalysis(); }, [performAnalysis]);
    useEffect(() => { evaluateAnswers(); }, [evaluateAnswers]);

    const renderContent = () => {
        if (!state.apiKey) return <ApiKeyPromptView />;

        switch (state.stage) {
            case 'IDLE':
                return <PitchSubmissionView />;
            case 'ANALYZING_PITCH':
            case 'AWAITING_DECISION':
                return <div className="text-center"><Icon name="spinner" className="h-12 w-12 text-indigo-400 animate-spin mx-auto"/> <p className="mt-4 text-white">Plato is thinking...</p></div>;
            case 'PITCH_FEEDBACK_READY':
                return <AnalysisFeedbackView />;
            case 'DECISION_APPROVED':
                return <DecisionView approved={true} />;
             case 'DECISION_REJECTED':
                return <DecisionView approved={false} />;
            case 'DASHBOARD_READY':
                return <ApprovedDashboardView />;
            case 'ERROR':
                 return (
                    <div className="text-center max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold text-red-400">An Error Occurred</h2>
                        <p className="text-gray-400 mt-2">{state.error}</p>
                        <button onClick={() => dispatch({type: 'RESET_PROCESS'})} className="mt-6 bg-indigo-600 px-4 py-2 rounded-lg text-white">Try Again</button>
                    </div>
                );
            default:
                return <div>Unhandled state</div>;
        }
    };

    return (
        <WeaverContext.Provider value={{ state, dispatch }}>
            <div className="bg-gray-900 text-gray-200 min-h-screen w-full flex items-center justify-center font-sans">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={state.stage}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </WeaverContext.Provider>
    );
};

export default QuantumWeaverView;
```