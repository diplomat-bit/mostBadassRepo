// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankExperimentationPlatformView.tsx
================================================================================

// components/views/platform/DemoBankExperimentationPlatformView.tsx
import React, { useState, useReducer, useEffect, useCallback, useMemo, createContext, useContext, ReactNode, FC } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- ENHANCED FEATURE SET: TYPE DEFINITIONS ---

export type ExperimentStatus = 'Draft' | 'Running' | 'Paused' | 'Completed' | 'Archived';
export type ViewMode = 'dashboard' | 'list' | 'details' | 'create' | 'edit' | 'settings';
export type SignificanceLevel = 0.90 | 0.95 | 0.99;
export type WinnerDeterminationLogic = 'frequentist' | 'bayesian';
export type IntegrationProvider = 'Google Analytics' | 'Mixpanel' | 'Segment' | 'LaunchDarkly';

export interface Variant {
    id: string;
    name: string;
    description: string;
    trafficSplit: number; // Percentage
}

export interface Metric {
    id:string;
    name: string;
    type: 'Primary' | 'Secondary';
    description: string;
    goal: 'Increase' | 'Decrease';
    source: string; // e.g., 'GA Event: user_signup'
}

export interface AudienceRule {
    attribute: 'country' | 'device' | 'browser' | 'isNewVisitor' | 'utmSource';
    operator: 'is' | 'is_not' | 'contains' | 'does_not_contain';
    value: string | boolean;
}

export interface Audience {
    id: string;
    name: string;
    rules: AudienceRule[];
}

export interface Experiment {
    id: string;
    name: string;
    hypothesis: string;
    status: ExperimentStatus;
    variants: Variant[];
    metrics: Metric[];
    audience: Audience;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
}

export interface VariantResult {
    variantId: string;
    visitors: number;
    conversions: number;
    dailyPerformance: { date: string; visitors: number; conversions: number }[];
}

export interface MetricResult {
    metricId: string;
    variantResults: { [variantId: string]: VariantResult };
}

export interface ExperimentResults {
    experimentId: string;
    metrics: MetricResult[];
    lastUpdatedAt: string;
}

export interface AIInsight {
    summary: string;
    observations: string[];
    recommendations: string[];
    confidence: 'High' | 'Medium' | 'Low';
}

export interface PlatformSettings {
    defaultSignificanceLevel: SignificanceLevel;
    winnerLogic: WinnerDeterminationLogic;
    notifications: {
        onWinnerDeclared: boolean;
        onSignificantUplift: boolean;
    };
}

// --- UTILITY & HELPER FUNCTIONS ---

/**
 * Generates a unique identifier.
 * @returns A unique string.
 */
export const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};


/**
 * Formats a date string or Date object into a more readable format.
 * @param date - The date to format.
 * @returns A formatted date string.
 */
export const formatDate = (date: string | Date | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// --- STATISTICAL CALCULATION ENGINE ---

/**
 * Calculates the conversion rate.
 * @param conversions - Number of conversions.
 * @param visitors - Number of visitors.
 * @returns The conversion rate (0 to 1).
 */
export const calculateConversionRate = (conversions: number, visitors: number): number => {
    if (visitors === 0) return 0;
    return conversions / visitors;
};

/**
 * Calculates the standard error for a proportion.
 * @param conversionRate - The conversion rate.
 * @param visitors - The number of visitors.
 * @returns The standard error.
 */
export const calculateStandardError = (conversionRate: number, visitors: number): number => {
    if (visitors === 0) return 0;
    return Math.sqrt(conversionRate * (1 - conversionRate) / visitors);
};

/**
 * Calculates the Z-score for comparing two proportions.
 * @param crA - Conversion rate of variant A.
 * @param visitorsA - Visitors for variant A.
 * @param crB - Conversion rate of variant B.
 * @param visitorsB - Visitors for variant B.
 * @returns The Z-score.
 */
export const calculateZScore = (crA: number, visitorsA: number, crB: number, visitorsB: number): number => {
    const seA = calculateStandardError(crA, visitorsA);
    const seB = calculateStandardError(crB, visitorsB);
    const seDiff = Math.sqrt(seA ** 2 + seB ** 2);
    if (seDiff === 0) return 0;
    return (crB - crA) / seDiff;
};

/**
 * A simplified function to get a p-value from a Z-score (approximates a two-tailed test).
 * This is a simplified implementation. A real application should use a more accurate lookup table or library.
 * @param z - The Z-score.
 * @returns The p-value.
 */
export const calculatePValue = (z: number): number => {
    // Simplified erf approximation
    const t = 1.0 / (1.0 + 0.5 * Math.abs(z));
    const tau = t * Math.exp(-z*z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    const p = z >= 0 ? 1 - tau / 2 : tau / 2;
    return 2 * p; // Two-tailed test
};

/**
 * Calculates the confidence interval for the difference between two proportions.
 * @param crA - Conversion rate of variant A.
 * @param visitorsA - Visitors for variant A.
 * @param crB - Conversion rate of variant B.
 * @param visitorsB - Visitors for variant B.
 * @param significanceLevel - The desired confidence level (e.g., 0.95).
 * @returns A tuple with the lower and upper bounds of the confidence interval.
 */
export const calculateConfidenceInterval = (crA: number, visitorsA: number, crB: number, visitorsB: number, significanceLevel: SignificanceLevel): [number, number] => {
    const z_critical: { [key in SignificanceLevel]: number } = {
        0.90: 1.645,
        0.95: 1.96,
        0.99: 2.576
    };
    
    const diff = crB - crA;
    const seA = calculateStandardError(crA, visitorsA);
    const seB = calculateStandardError(crB, visitorsB);
    const seDiff = Math.sqrt(seA ** 2 + seB ** 2);

    const marginOfError = z_critical[significanceLevel] * seDiff;
    
    return [diff - marginOfError, diff + marginOfError];
};


/**
 * A comprehensive result analysis for a single metric between a control and a variant.
 * @param control - The result data for the control variant.
 * @param variant - The result data for the variant.
 * @param significanceLevel - The desired confidence level.
 * @returns An object containing detailed statistical analysis.
 */
export const runSignificanceTest = (control: VariantResult, variant: VariantResult, significanceLevel: SignificanceLevel = 0.95) => {
    if (control.visitors === 0 || variant.visitors === 0) {
        return {
            pValue: 1,
            isStatisticallySignificant: false,
            confidenceInterval: [0, 0] as [number, number],
            uplift: 0,
            winner: null as 'control' | 'variant' | 'tie',
        };
    }

    const crControl = calculateConversionRate(control.conversions, control.visitors);
    const crVariant = calculateConversionRate(variant.conversions, variant.visitors);

    const zScore = calculateZScore(crControl, control.visitors, crVariant, variant.visitors);
    const pValue = calculatePValue(zScore);
    const confidenceInterval = calculateConfidenceInterval(crControl, control.visitors, crVariant, variant.visitors, significanceLevel);
    
    const isStatisticallySignificant = pValue < (1 - significanceLevel);
    
    const uplift = crControl > 0 ? (crVariant - crControl) / crControl : Infinity;

    let winner: 'control' | 'variant' | 'tie' = 'tie';
    if (isStatisticallySignificant) {
        if (uplift > 0) winner = 'variant';
        else if (uplift < 0) winner = 'control';
    }

    return { pValue, isStatisticallySignificant, confidenceInterval, uplift, winner };
};


// --- MOCK DATA & SERVICE LAYER ---

const initialAudience: Audience = {
    id: 'aud-global',
    name: 'All Visitors',
    rules: [{ attribute: 'country', operator: 'is_not', value: 'Internal' }]
};

const MOCK_EXPERIMENTS: Experiment[] = [
    {
        id: 'exp-1',
        name: 'Homepage CTA Color Test',
        hypothesis: 'Changing the main CTA button from blue to green will increase sign-ups.',
        status: 'Completed',
        variants: [
            { id: 'var-1a', name: 'Control', description: 'Original blue button.', trafficSplit: 50 },
            { id: 'var-1b', name: 'Variant B', description: 'New green button.', trafficSplit: 50 }
        ],
        metrics: [
            { id: 'met-1-pri', name: 'Sign-up Rate', type: 'Primary', description: 'Percentage of visitors who complete the sign-up form.', goal: 'Increase', source: 'Internal Event: signup_complete' },
            { id: 'met-1-sec', name: 'Button Click-through Rate', type: 'Secondary', description: 'Percentage of visitors who click the main CTA.', goal: 'Increase', source: 'Internal Event: cta_click' }
        ],
        audience: initialAudience,
        startDate: new Date('2023-10-01T00:00:00Z').toISOString(),
        endDate: new Date('2023-10-15T00:00:00Z').toISOString(),
        createdAt: new Date('2023-09-28T10:00:00Z').toISOString(),
        updatedAt: new Date('2023-10-15T00:00:00Z').toISOString(),
        tags: ['Homepage', 'Conversion Optimization']
    },
    {
        id: 'exp-2',
        name: 'New User Onboarding Flow',
        hypothesis: 'A simplified 3-step onboarding will improve user activation over the current 5-step process.',
        status: 'Running',
        variants: [
            { id: 'var-2a', name: 'Control (5-step)', description: 'The existing user onboarding flow.', trafficSplit: 50 },
            { id: 'var-2b', name: 'Simplified (3-step)', description: 'A condensed onboarding experience.', trafficSplit: 50 }
        ],
        metrics: [
            { id: 'met-2-pri', name: 'User Activation', type: 'Primary', description: 'Percentage of users who complete a key action within 7 days of sign-up.', goal: 'Increase', source: 'Segment: user_activated' },
            { id: 'met-2-sec', name: 'Onboarding Completion Rate', type: 'Secondary', description: 'Percentage of users who finish the entire onboarding flow.', goal: 'Increase', source: 'Internal Event: onboarding_finished' }
        ],
        audience: { ...initialAudience, rules: [{ attribute: 'isNewVisitor', operator: 'is', value: true }] },
        startDate: new Date('2023-11-01T00:00:00Z').toISOString(),
        endDate: new Date('2023-11-30T00:00:00Z').toISOString(),
        createdAt: new Date('2023-10-25T14:00:00Z').toISOString(),
        updatedAt: new Date('2023-11-05T12:00:00Z').toISOString(),
        tags: ['Onboarding', 'User Experience']
    },
    {
        id: 'exp-3',
        name: 'Pricing Page Layout Revision',
        hypothesis: 'Displaying an "Annual" pricing option first will increase selection of annual plans.',
        status: 'Draft',
        variants: [
            { id: 'var-3a', name: 'Control (Monthly First)', description: 'Current layout with monthly plans featured.', trafficSplit: 50 },
            { id: 'var-3b', name: 'Variant (Annual First)', description: 'New layout with annual plans featured.', trafficSplit: 50 }
        ],
        metrics: [
            { id: 'met-3-pri', name: 'Annual Plan Selection Rate', type: 'Primary', description: 'Percentage of new subscriptions that are for an annual plan.', goal: 'Increase', source: 'Stripe: annual_plan_subscribed'}
        ],
        audience: initialAudience,
        createdAt: new Date('2023-11-10T09:00:00Z').toISOString(),
        updatedAt: new Date('2023-11-10T09:00:00Z').toISOString(),
        tags: ['Pricing', 'Monetization']
    }
];

const generateDailyData = (startDate: Date, days: number, baseVisitors: number, baseConversions: number) => {
    const data = [];
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        data.push({
            date: date.toISOString().split('T')[0],
            visitors: Math.floor(baseVisitors + (Math.random() - 0.5) * baseVisitors * 0.2),
            conversions: Math.floor(baseConversions + (Math.random() - 0.5) * baseConversions * 0.3)
        });
    }
    return data;
};

const MOCK_RESULTS: { [key: string]: ExperimentResults } = {
    'exp-1': {
        experimentId: 'exp-1',
        lastUpdatedAt: new Date().toISOString(),
        metrics: [
            { 
                metricId: 'met-1-pri',
                variantResults: {
                    'var-1a': { variantId: 'var-1a', visitors: 10250, conversions: 410, dailyPerformance: generateDailyData(new Date('2023-10-01'), 15, 680, 27) },
                    'var-1b': { variantId: 'var-1b', visitors: 10310, conversions: 526, dailyPerformance: generateDailyData(new Date('2023-10-01'), 15, 685, 35) }
                }
            },
            {
                metricId: 'met-1-sec',
                variantResults: {
                    'var-1a': { variantId: 'var-1a', visitors: 10250, conversions: 1230, dailyPerformance: generateDailyData(new Date('2023-10-01'), 15, 680, 82) },
                    'var-1b': { variantId: 'var-1b', visitors: 10310, conversions: 1546, dailyPerformance: generateDailyData(new Date('2023-10-01'), 15, 685, 103) }
                }
            }
        ]
    },
    'exp-2': {
        experimentId: 'exp-2',
        lastUpdatedAt: new Date().toISOString(),
        metrics: [
            {
                metricId: 'met-2-pri',
                variantResults: {
                    'var-2a': { variantId: 'var-2a', visitors: 5400, conversions: 2100, dailyPerformance: generateDailyData(new Date('2023-11-01'), 10, 540, 210) },
                    'var-2b': { variantId: 'var-2b', visitors: 5350, conversions: 2120, dailyPerformance: generateDailyData(new Date('2023-11-01'), 10, 535, 212) }
                }
            },
            {
                metricId: 'met-2-sec',
                variantResults: {
                    'var-2a': { variantId: 'var-2a', visitors: 5400, conversions: 3500, dailyPerformance: generateDailyData(new Date('2023-11-01'), 10, 540, 350) },
                    'var-2b': { variantId: 'var-2b', visitors: 5350, conversions: 4200, dailyPerformance: generateDailyData(new Date('2023-11-01'), 10, 535, 420) }
                }
            }
        ]
    }
};

/**
 * A mock service to simulate API calls for experiment data.
 */
export const mockExperimentService = {
    getExperiments: async (): Promise<Experiment[]> => {
        console.log("MOCK_API: Fetching all experiments...");
        return new Promise(resolve => setTimeout(() => resolve(MOCK_EXPERIMENTS), 500));
    },
    getExperimentById: async (id: string): Promise<Experiment | undefined> => {
        console.log(`MOCK_API: Fetching experiment ${id}...`);
        return new Promise(resolve => setTimeout(() => resolve(MOCK_EXPERIMENTS.find(e => e.id === id)), 300));
    },
    getExperimentResults: async (id: string): Promise<ExperimentResults | undefined> => {
        console.log(`MOCK_API: Fetching results for experiment ${id}...`);
        return new Promise(resolve => setTimeout(() => {
            const results = MOCK_RESULTS[id];
            if (results && MOCK_EXPERIMENTS.find(e => e.id === id)?.status === 'Running') {
                const updatedResults = JSON.parse(JSON.stringify(results));
                for (const metric of updatedResults.metrics) {
                    for (const variantId in metric.variantResults) {
                        const newVisitors = Math.floor(Math.random() * 100);
                        const newConversions = Math.floor(Math.random() * 10);
                        metric.variantResults[variantId].visitors += newVisitors;
                        metric.variantResults[variantId].conversions += newConversions;
                        metric.variantResults[variantId].dailyPerformance.push({ date: new Date().toISOString().split('T')[0], visitors: newVisitors, conversions: newConversions });
                    }
                }
                MOCK_RESULTS[id] = updatedResults;
                resolve(updatedResults);
            } else {
                resolve(results);
            }
        }, 700));
    },
    saveExperiment: async (experiment: Experiment): Promise<Experiment> => {
        console.log(`MOCK_API: Saving experiment ${experiment.id}...`);
        return new Promise(resolve => setTimeout(() => {
            const index = MOCK_EXPERIMENTS.findIndex(e => e.id === experiment.id);
            const updatedExperiment = { ...experiment, updatedAt: new Date().toISOString() };
            if (index > -1) {
                MOCK_EXPERIMENTS[index] = updatedExperiment;
            } else {
                MOCK_EXPERIMENTS.push(updatedExperiment);
            }
            resolve(updatedExperiment);
        }, 400));
    },
    updateExperimentStatus: async (id: string, status: ExperimentStatus): Promise<Experiment> => {
         console.log(`MOCK_API: Updating status for ${id} to ${status}...`);
         return new Promise((resolve, reject) => setTimeout(() => {
            const experiment = MOCK_EXPERIMENTS.find(e => e.id === id);
            if (experiment) {
                experiment.status = status;
                experiment.updatedAt = new Date().toISOString();
                if (status === 'Running' && !experiment.startDate) {
                    experiment.startDate = new Date().toISOString();
                }
                if (status === 'Completed' && !experiment.endDate) {
                    experiment.endDate = new Date().toISOString();
                }
                resolve(experiment);
            } else {
                reject(new Error("Experiment not found"));
            }
         }, 400));
    },
    getAIInsight: async (results: ExperimentResults, experiment: Experiment): Promise<AIInsight> => {
        console.log(`MOCK_API: Generating AI insight for ${experiment.name}`);
        // In a real app, this would be a complex prompt to a powerful model.
        // Here we simulate the response.
        return new Promise(resolve => setTimeout(() => {
            resolve({
                summary: `The experiment appears to be successful. The variant '${experiment.variants[1].name}' is outperforming the control for the primary metric '${experiment.metrics[0].name}'.`,
                observations: [
                    "Statistically significant uplift detected in the primary metric.",
                    "Secondary metrics are also showing positive trends, reinforcing the primary hypothesis.",
                    "No significant anomalies detected in traffic distribution or conversion patterns."
                ],
                recommendations: [
                    "Consider rolling out the winning variant to 100% of traffic.",
                    "Plan a follow-up experiment to iterate on the winning design, perhaps testing copy variations.",
                    "Archive this experiment and document the learnings for the team."
                ],
                confidence: "High"
            });
        }, 1500));
    }
};

// --- STATE MANAGEMENT (useReducer & Context) ---

interface ExperimentationPlatformState {
    view: ViewMode;
    experiments: Experiment[];
    selectedExperimentId: string | null;
    currentExperimentData: Experiment | null;
    currentResults: ExperimentResults | null;
    isLoading: boolean;
    error: string | null;
    settings: PlatformSettings;
}

const initialState: ExperimentationPlatformState = {
    view: 'dashboard',
    experiments: [],
    selectedExperimentId: null,
    currentExperimentData: null,
    currentResults: null,
    isLoading: true,
    error: null,
    settings: {
        defaultSignificanceLevel: 0.95,
        winnerLogic: 'frequentist',
        notifications: { onWinnerDeclared: true, onSignificantUplift: false }
    }
};

type Action =
    | { type: 'SET_VIEW'; payload: ViewMode }
    | { type: 'FETCH_INIT_START' }
    | { type: 'FETCH_INIT_SUCCESS'; payload: Experiment[] }
    | { type: 'FETCH_INIT_FAILURE'; payload: string }
    | { type: 'SELECT_EXPERIMENT_START'; payload: string }
    | { type: 'SELECT_EXPERIMENT_SUCCESS'; payload: { experiment: Experiment; results?: ExperimentResults } }
    | { type: 'SELECT_EXPERIMENT_FAILURE'; payload: string }
    | { type: 'UPDATE_EXPERIMENT_SUCCESS'; payload: Experiment }
    | { type: 'CLEAR_SELECTION' }
    | { type: 'REFRESH_RESULTS_SUCCESS'; payload: ExperimentResults };


const reducer = (state: ExperimentationPlatformState, action: Action): ExperimentationPlatformState => {
    switch (action.type) {
        case 'SET_VIEW':
            return { ...state, view: action.payload, selectedExperimentId: action.payload === 'details' ? state.selectedExperimentId : null, currentExperimentData: null, currentResults: null };
        case 'FETCH_INIT_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_INIT_SUCCESS':
            return { ...state, isLoading: false, experiments: action.payload };
        case 'FETCH_INIT_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case 'SELECT_EXPERIMENT_START':
            return { ...state, isLoading: true, selectedExperimentId: action.payload, view: 'details', error: null };
        case 'SELECT_EXPERIMENT_SUCCESS':
            return {
                ...state,
                isLoading: false,
                currentExperimentData: action.payload.experiment,
                currentResults: action.payload.results || null
            };
        case 'SELECT_EXPERIMENT_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case 'UPDATE_EXPERIMENT_SUCCESS':
            return {
                ...state,
                experiments: state.experiments.map(exp => exp.id === action.payload.id ? action.payload : exp),
                currentExperimentData: state.currentExperimentData?.id === action.payload.id ? action.payload : state.currentExperimentData,
            };
        case 'CLEAR_SELECTION':
            return { ...state, selectedExperimentId: null, currentExperimentData: null, currentResults: null, view: 'list' };
        case 'REFRESH_RESULTS_SUCCESS':
            return { ...state, currentResults: action.payload };
        default:
            return state;
    }
};

const ExperimentationPlatformContext = createContext<{
    state: ExperimentationPlatformState;
    dispatch: React.Dispatch<Action>;
} | null>(null);

const useExperimentationPlatform = () => {
    const context = useContext(ExperimentationPlatformContext);
    if (!context) {
        throw new Error('useExperimentationPlatform must be used within a ExperimentationPlatformProvider');
    }
    return context;
};

// --- REUSABLE UI COMPONENTS ---

export const Spinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
    </div>
);

export const StatusBadge: React.FC<{ status: ExperimentStatus }> = ({ status }) => {
    const colorMap: { [key in ExperimentStatus]: string } = {
        Draft: 'bg-gray-500 text-gray-100',
        Running: 'bg-green-500 text-white animate-pulse',
        Paused: 'bg-yellow-500 text-yellow-900',
        Completed: 'bg-blue-500 text-white',
        Archived: 'bg-indigo-500 text-white'
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorMap[status]}`}>{status}</span>;
};

export const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);

export const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-gray-300 mt-2">{message}</p>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-white transition-colors">Confirm</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APPLICATION COMPONENTS ---

/**
 * The AI-powered A/B test designer component.
 */
export const AITestDesigner: React.FC<{ onDesignComplete: (plan: any) => void }> = ({ onDesignComplete }) => {
    const [prompt, setPrompt] = useState("changing the main call-to-action button from blue to green will increase sign-ups");
    const [generatedTest, setGeneratedTest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedTest(null);
        setError(null);
        try {
            // NOTE: This requires a valid Google AI API Key in environment variables
            if (!process.env.REACT_APP_GEMINI_API_KEY) {
                throw new Error("Gemini API key is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY as string });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "A short, descriptive name for the experiment." },
                    hypothesis: { type: Type.STRING, description: "The core hypothesis being tested, framed as a belief about a change and its expected outcome." },
                    primaryMetric: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            goal: { type: Type.ENUM, values: ["Increase", "Decrease"] }
                        }
                    },
                    secondaryMetric: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            goal: { type: Type.ENUM, values: ["Increase", "Decrease"] }
                        }
                    },
                    variants: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                description: { type: Type.STRING }
                            }
                        }
                    }
                },
                required: ["name", "hypothesis", "primaryMetric", "variants"]
            };
            const fullPrompt = `You are an expert Experimentation Manager at a top tech company. Design a simple, clear A/B test for this hypothesis: "${prompt}". Your output must be a valid JSON object matching the provided schema. Ensure the variants include a 'Control' and at least one 'Variant'.`;
            const response = await ai.models.generateContent({ model: 'gemini-1.5-flash', contents: fullPrompt, generationConfig: { responseMimeType: "application/json" }, tools: [{ functionDeclarations: [], codeExecution: { enable: false } }] });
            const parsedResponse = JSON.parse(response.text);
            setGeneratedTest(parsedResponse);
            onDesignComplete(parsedResponse);
        } catch (err: any) {
            console.error("AI Generation Error:", err);
            setError(`Failed to generate test plan. ${err.message || "Please check your API key and try again."}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="AI A/B Test Designer">
            <p className="text-gray-400 mb-4">State your hypothesis for the experiment, and our AI will generate a structured test plan.</p>
            <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g., A simplified checkout process will reduce cart abandonment."
                className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
            />
            <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                {isLoading ? 'Designing Test...' : 'Design Test With AI'}
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
            {generatedTest && (
                 <div className="mt-4 p-4 bg-gray-900/50 rounded-md space-y-2 border border-cyan-700">
                    <h4 className="text-lg font-bold text-white">AI Generated Plan:</h4>
                    <p><strong className="text-cyan-400">Name:</strong> {generatedTest.name}</p>
                    <p><strong className="text-cyan-400">Hypothesis:</strong> {generatedTest.hypothesis}</p>
                 </div>
            )}
        </Card>
    );
};

/**
 * Displays a list of all experiments.
 */
export const ExperimentList: React.FC<{ experiments: Experiment[]; onSelect: (id: string) => void }> = ({ experiments, onSelect }) => {
    return (
        <Card title="All Experiments">
            <div className="divide-y divide-gray-700">
                {experiments.map(exp => (
                    <div key={exp.id} className="p-4 hover:bg-gray-800/50 cursor-pointer transition-colors duration-200" onClick={() => onSelect(exp.id)}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">{exp.name}</h3>
                            <StatusBadge status={exp.status} />
                        </div>
                        <p className="text-gray-400 mt-1">{exp.hypothesis}</p>
                        <div className="flex items-center justify-between mt-2">
                             <div className="text-xs text-gray-500">
                                <span>Created: {formatDate(exp.createdAt)}</span> | <span>Last Updated: {formatDate(exp.updatedAt)}</span>
                            </div>
                            <div className="flex space-x-2">
                                {exp.tags.map(tag => <span key={tag} className="px-2 py-0.5 text-xs bg-gray-600 rounded-full">{tag}</span>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const AIResultsAnalysis: FC<{ experiment: Experiment, results: ExperimentResults }> = ({ experiment, results }) => {
    const [insight, setInsight] = useState<AIInsight | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateInsight = async () => {
        setIsLoading(true);
        const generatedInsight = await mockExperimentService.getAIInsight(results, experiment);
        setInsight(generatedInsight);
        setIsLoading(false);
    };

    return (
        <Card title="AI-Powered Insight Engine">
            {!insight && (
                <div className="text-center">
                    <p className="text-gray-300 mb-4">Let our AI analyze the results and provide a summary, observations, and recommendations.</p>
                    <button onClick={handleGenerateInsight} disabled={isLoading} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50 transition-colors">
                        {isLoading ? 'Analyzing...' : 'Generate AI Insight'}
                    </button>
                </div>
            )}
            {isLoading && !insight && <Spinner />}
            {insight && (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-cyan-400">Summary (Confidence: {insight.confidence})</h4>
                        <p className="text-gray-200">{insight.summary}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-cyan-400">Key Observations</h4>
                        <ul className="list-disc list-inside text-gray-300 space-y-1 mt-1">
                            {insight.observations.map((obs, i) => <li key={i}>{obs}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-cyan-400">Recommendations</h4>
                         <ul className="list-disc list-inside text-gray-300 space-y-1 mt-1">
                            {insight.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </Card>
    );
};

/**
 * Component for displaying and analyzing experiment results.
 */
export const ResultsDisplay: React.FC<{ experiment: Experiment, results: ExperimentResults }> = ({ experiment, results }) => {
    const { state } = useExperimentationPlatform();
    const significanceLevel = state.settings.defaultSignificanceLevel;
    const controlVariant = useMemo(() => experiment.variants.find(v => v.name.toLowerCase().includes('control')), [experiment.variants]);
    
    if (!controlVariant) {
        return <p className="text-red-400">Error: A 'Control' variant could not be found to calculate results.</p>;
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-bold text-white">Results Analysis</h3>
                 <p className="text-gray-400 text-sm">Last updated: {new Date(results.lastUpdatedAt).toLocaleString()}</p>
            </div>
            
            <AIResultsAnalysis experiment={experiment} results={results} />

            {experiment.metrics.map(metric => {
                const metricResult = results.metrics.find(m => m.metricId === metric.id);
                if (!metricResult) {
                    return <div key={metric.id}>No data for metric: {metric.name}</div>;
                }
                
                const controlResult = metricResult.variantResults[controlVariant.id];

                return (
                    <Card key={metric.id} title={`${metric.type} Metric: ${metric.name}`}>
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-600 text-gray-300">
                                <tr>
                                    <th className="p-2">Variant</th>
                                    <th className="p-2">Visitors</th>
                                    <th className="p-2">Conversions</th>
                                    <th className="p-2">Conv. Rate</th>
                                    <th className="p-2">Uplift</th>
                                    <th className="p-2">Is Winner?</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {experiment.variants.map(variant => {
                                    const variantResultData = metricResult.variantResults[variant.id];
                                    if (!variantResultData) return null;
                                    
                                    const cr = calculateConversionRate(variantResultData.conversions, variantResultData.visitors);
                                    let uplift = 0;
                                    let isWinner = false;
                                    let analysis = null;

                                    if(variant.id !== controlVariant.id && controlResult) {
                                       analysis = runSignificanceTest(controlResult, variantResultData, significanceLevel);
                                       uplift = analysis.uplift;
                                       isWinner = analysis.winner === 'variant' && analysis.isStatisticallySignificant;
                                    }

                                    return (
                                        <tr key={variant.id} className="hover:bg-gray-800/50">
                                            <td className="p-2 font-semibold text-white">{variant.name}</td>
                                            <td className="p-2">{variantResultData.visitors.toLocaleString()}</td>
                                            <td className="p-2">{variantResultData.conversions.toLocaleString()}</td>
                                            <td className="p-2">{(cr * 100).toFixed(2)}%</td>
                                            <td className={`p-2 font-bold ${uplift > 0 ? 'text-green-400' : uplift < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                                                {variant.id === controlVariant.id ? 'Baseline' : `${(uplift * 100).toFixed(2)}%`}
                                            </td>
                                            <td className="p-2">
                                                {isWinner ? <span className="text-green-400 font-bold">✓ Yes</span> : variant.id === controlVariant.id ? '-' : 'No'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                         {experiment.variants.filter(v => v.id !== controlVariant.id).map(variant => {
                                const variantResultData = metricResult.variantResults[variant.id];
                                if (!variantResultData || !controlResult) return null;
                                const analysis = runSignificanceTest(controlResult, variantResultData, significanceLevel);
                                return (
                                    <div key={`summary-${variant.id}`} className="mt-4 p-3 bg-gray-900/50 rounded-md">
                                        <h4 className="font-bold text-white">Summary for "{variant.name}" vs Control</h4>
                                        <p className="text-gray-300">
                                            There is a <strong className={analysis.isStatisticallySignificant ? 'text-cyan-400' : 'text-yellow-400'}>
                                            {analysis.isStatisticallySignificant ? 'statistically significant' : 'non-significant'}</strong> difference.
                                            The p-value is <strong className="font-mono">{analysis.pValue.toFixed(4)}</strong>. We are {significanceLevel * 100}% confident that the true uplift is between{' '}
                                            <strong className="font-mono">{(analysis.confidenceInterval[0]*100).toFixed(2)}%</strong> and <strong className="font-mono">{(analysis.confidenceInterval[1]*100).toFixed(2)}%</strong>.
                                        </p>
                                    </div>
                                )
                            })}
                    </Card>
                );
            })}
        </div>
    );
};


/**
 * A detailed view of a single experiment, allowing for management and result viewing.
 */
export const ExperimentDetailsView: React.FC<{
    experiment: Experiment;
    results: ExperimentResults | null;
    onBack: () => void;
    onStatusChange: (id: string, status: ExperimentStatus) => Promise<void>;
    onRefreshResults: (id: string) => void;
}> = ({ experiment, results, onBack, onStatusChange, onRefreshResults }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState<{ status: ExperimentStatus, verb: string } | null>(null);

    const handleStatusChangeClick = (status: ExperimentStatus, verb: string) => {
        setAction({ status, verb });
        setIsModalOpen(true);
    };
    
    const confirmStatusChange = async () => {
        if (action) {
            await onStatusChange(experiment.id, action.status);
        }
        setIsModalOpen(false);
        setAction(null);
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (experiment.status === 'Running') {
            intervalId = setInterval(() => {
                onRefreshResults(experiment.id);
            }, 5000); // Refresh results every 5 seconds for running experiments
        }
        return () => clearInterval(intervalId);
    }, [experiment.status, experiment.id, onRefreshResults]);

    return (
        <div className="space-y-6">
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmStatusChange}
                title={`${action?.verb || 'Confirm'} Experiment`}
                message={`Are you sure you want to ${action?.verb.toLowerCase() || ''} the experiment "${experiment.name}"?`}
            />

            <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300">&larr; Back to all experiments</button>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-wider">{experiment.name}</h2>
                    <div className="flex items-center space-x-4 mt-2">
                        <StatusBadge status={experiment.status} />
                        <span className="text-sm text-gray-400">Created: {formatDate(experiment.createdAt)}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {experiment.status === 'Draft' && <button onClick={() => handleStatusChangeClick('Running', 'Start')} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">Start</button>}
                    {experiment.status === 'Running' && <button onClick={() => handleStatusChangeClick('Paused', 'Pause')} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded">Pause</button>}
                    {experiment.status === 'Paused' && <button onClick={() => handleStatusChangeClick('Running', 'Resume')} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">Resume</button>}
                    {(experiment.status === 'Running' || experiment.status === 'Paused') && <button onClick={() => handleStatusChangeClick('Completed', 'End')} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">End</button>}
                </div>
            </div>

            <Card title="Experiment Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong className="text-cyan-300">Hypothesis:</strong> <span className="text-gray-200">{experiment.hypothesis}</span></div>
                    <div><strong className="text-cyan-300">Audience:</strong> <span className="text-gray-200">{experiment.audience.name}</span></div>
                    <div><strong className="text-cyan-300">Start Date:</strong> <span className="text-gray-200">{formatDate(experiment.startDate)}</span></div>
                    <div><strong className="text-cyan-300">End Date:</strong> <span className="text-gray-200">{formatDate(experiment.endDate)}</span></div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Variants">
                    {experiment.variants.map(v => (
                        <div key={v.id} className="p-3 mb-2 bg-gray-900/50 rounded-md">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-white">{v.name}</p>
                                <p className="text-sm text-gray-300">{v.trafficSplit}% Split</p>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">{v.description}</p>
                        </div>
                    ))}
                </Card>
                <Card title="Metrics">
                    {experiment.metrics.map(m => (
                        <div key={m.id} className="p-3 mb-2 bg-gray-900/50 rounded-md">
                            <p className="font-bold text-white">{m.name} <span className="text-xs font-normal text-cyan-400">({m.type})</span></p>
                            <p className="text-gray-400 text-sm mt-1">{m.description}</p>
                            <p className="text-gray-500 text-xs mt-1">Source: {m.source}</p>
                        </div>
                    ))}
                </Card>
            </div>

            {results ? (
                <ResultsDisplay experiment={experiment} results={results} />
            ) : (
                <Card title="Results">
                    <p className="text-gray-400">{experiment.status === 'Running' ? 'Waiting for initial data...' : 'No results data available for this experiment.'}</p>
                </Card>
            )}
        </div>
    );
};

const DashboardView: FC = () => {
    const { state } = useExperimentationPlatform();
    const runningExperiments = state.experiments.filter(e => e.status === 'Running');
    const completedExperiments = state.experiments.filter(e => e.status === 'Completed');
    
    // Mock data for charts
    const weeklyWinRate = [
        { name: 'Wk 40', rate: 60 },
        { name: 'Wk 41', rate: 55 },
        { name: 'Wk 42', rate: 70 },
        { name: 'Wk 43', rate: 65 },
        { name: 'Wk 44', rate: 75 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Running Experiments">
                    <p className="text-5xl font-bold text-white">{runningExperiments.length}</p>
                    <p className="text-gray-400">Active tests driving insights.</p>
                </Card>
                <Card title="Completed Last 30 Days">
                     <p className="text-5xl font-bold text-white">{completedExperiments.length}</p>
                     <p className="text-gray-400">Experiments that have concluded recently.</p>
                </Card>
                <Card title="Avg. Uplift (Primary Metric)">
                    <p className="text-5xl font-bold text-green-400">+5.2%</p>
                     <p className="text-gray-400">Average improvement from winning variants.</p>
                </Card>
            </div>
            <Card title="Recent Activity">
                {runningExperiments.slice(0, 3).map(exp => (
                    <div key={exp.id} className="p-3 border-b border-gray-700 last:border-b-0">
                        <div className="flex justify-between">
                            <p className="text-white font-semibold">{exp.name}</p>
                            <StatusBadge status={exp.status} />
                        </div>
                        <p className="text-sm text-gray-400">Started on {formatDate(exp.startDate)}</p>
                    </div>
                ))}
            </Card>
            <Card title="Weekly Experiment Win Rate">
                 <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={weeklyWinRate} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="name" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                        <Area type="monotone" dataKey="rate" stroke="#38B2AC" fill="#38B2AC" fillOpacity={0.3} />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}


/**
 * The main container view for the entire experimentation platform.
 */
const MainView: React.FC = () => {
    const { state, dispatch } = useExperimentationPlatform();

    useEffect(() => {
        dispatch({ type: 'FETCH_INIT_START' });
        mockExperimentService.getExperiments()
            .then(data => dispatch({ type: 'FETCH_INIT_SUCCESS', payload: data }))
            .catch(err => dispatch({ type: 'FETCH_INIT_FAILURE', payload: err.message }));
    }, [dispatch]);

    const handleSelectExperiment = useCallback((id: string) => {
        dispatch({ type: 'SELECT_EXPERIMENT_START', payload: id });
        Promise.all([
            mockExperimentService.getExperimentById(id),
            mockExperimentService.getExperimentResults(id)
        ]).then(([experiment, results]) => {
            if (experiment) {
                dispatch({ type: 'SELECT_EXPERIMENT_SUCCESS', payload: { experiment, results } });
            } else {
                throw new Error("Experiment not found");
            }
        }).catch(err => dispatch({ type: 'SELECT_EXPERIMENT_FAILURE', payload: err.message }));
    }, [dispatch]);
    
    const handleStatusChange = useCallback(async (id: string, status: ExperimentStatus) => {
        const updatedExperiment = await mockExperimentService.updateExperimentStatus(id, status);
        dispatch({ type: 'UPDATE_EXPERIMENT_SUCCESS', payload: updatedExperiment });
    }, [dispatch]);

    const handleRefreshResults = useCallback(async (id: string) => {
        const results = await mockExperimentService.getExperimentResults(id);
        if(results) {
            dispatch({ type: 'REFRESH_RESULTS_SUCCESS', payload: results });
        }
    }, [dispatch]);

    const handleAIDesignComplete = (plan: any) => {
        console.log("AI Plan Received:", plan);
        alert("AI generated test plan received! See console for details. In a real app, this would populate the creation form.");
    };

    const renderContent = () => {
        if (state.isLoading && state.experiments.length === 0) {
            return <Spinner />;
        }
        if (state.error) {
            return <p className="text-red-400">Error: {state.error}</p>;
        }

        switch (state.view) {
            case 'dashboard':
                 return <DashboardView />;
            case 'details':
                if (state.isLoading || !state.currentExperimentData) return <Spinner />;
                return <ExperimentDetailsView
                    experiment={state.currentExperimentData}
                    results={state.currentResults}
                    onBack={() => dispatch({ type: 'CLEAR_SELECTION' })}
                    onStatusChange={handleStatusChange}
                    onRefreshResults={handleRefreshResults}
                />;
            case 'create':
                return <AITestDesigner onDesignComplete={handleAIDesignComplete} />;
            case 'list':
            default:
                return <ExperimentList experiments={state.experiments} onSelect={handleSelectExperiment} />;
        }
    };
    
    const navButtonStyle = (view: ViewMode) => 
        `px-4 py-2 rounded transition-colors ${state.view === view ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Experimentation</h2>
                <nav className="flex space-x-2">
                    <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })} className={navButtonStyle('dashboard')}>Dashboard</button>
                    <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'list' })} className={navButtonStyle('list')}>All Experiments</button>
                    <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'create' })} className={navButtonStyle('create')}>Create with AI</button>
                </nav>
            </div>
            
            {renderContent()}
        </div>
    );
};


const DemoBankExperimentationPlatformView: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ExperimentationPlatformContext.Provider value={{ state, dispatch }}>
            <MainView />
        </ExperimentationPlatformContext.Provider>
    );
};

export default DemoBankExperimentationPlatformView;
