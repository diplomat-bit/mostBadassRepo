// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankFeatureManagementView.tsx
================================================================================

// components/views/platform/DemoBankFeatureManagementView.tsx
import React, { useState, useReducer, useEffect, useCallback, useMemo, FC, ReactNode, useRef, Suspense, lazy } from 'react';
import { create } from 'zustand';
import { produce } from 'immer';
import { Toaster, toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ReactFlow, { MiniMap, Controls, Background, Elements, isNode, Position, ArrowHeadType } from 'reactflow';
// Note: In a real project, you would import the CSS for reactflow: import 'reactflow/dist/style.css';
import {
    ChevronDown, ChevronUp, ChevronRight, AlertTriangle, CheckCircle, XCircle, FileCode, Search, BrainCircuit,
    Plus, Trash2, Copy, Zap, History, TestTube2, Puzzle, SlidersHorizontal, Package, Wand2, Info, Moon, Sun, Settings
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// SECTION: Icon Library
// ==========================================================
const icons = {
    chevronDown: <ChevronDown size={16} />,
    chevronUp: <ChevronUp size={16} />,
    chevronRight: <ChevronRight size={16} />,
    warning: <AlertTriangle size={16} className="text-yellow-400" />,
    success: <CheckCircle size={16} className="text-green-400" />,
    error: <XCircle size={16} className="text-red-400" />,
    code: <FileCode size={16} />,
    search: <Search size={18} />,
    ai: <BrainCircuit size={18} />,
    add: <Plus size={16} />,
    delete: <Trash2 size={16} />,
    copy: <Copy size={16} />,
    zap: <Zap size={16} />,
    history: <History size={18} />,
    abTest: <TestTube2 size={18} />,
    dependencies: <Puzzle size={18} />,
    targeting: <SlidersHorizontal size={18} />,
    sdk: <Package size={18} />,
    aiMagic: <Wand2 size={16} />,
    info: <Info size={16} />,
    moon: <Moon size={18} />,
    sun: <Sun size={18} />,
    settings: <Settings size={18} />
};


// SECTION: Type Definitions for a Real-World Application
// ==========================================================

export type FeatureFlagStatus = 'enabled' | 'disabled' | 'archived';
export type Environment = 'development' | 'staging' | 'production';
export type TargetingRuleOperator = 'is' | 'is_not' | 'contains' | 'does_not_contain' | 'is_one_of' | 'is_not_one_of' | 'greater_than' | 'less_than' | 'semver_equals' | 'semver_greater_than' | 'semver_less_than';
export type RolloutStrategy = 'percentage' | 'ring' | 'canary' | 'scheduled';
export type AiModelType = 'gemini-2.5-flash' | 'gemini-pro' | 'gemini-advanced';

export interface TargetingRule {
    id: string;
    property: string;
    operator: TargetingRuleOperator;
    value: string | string[] | number;
}

export interface TargetingGroup {
    id: string;
    rules: TargetingRule[];
    condition: 'AND' | 'OR';
}

export interface FeatureFlagDependency {
    id: string;
    sourceFlagKey: string;
    targetFlagKey: string;
    condition: 'enabled' | 'disabled'; // Target is only active if source is in this state
}

export interface CodeReference {
    id: string;
    filePath: string;
    line: number;
    codeSnippet: string;
    lastDetected: string;
}

export interface FeatureFlag {
    id: string;
    key: string;
    name: string;
    description: string;
    status: Record<Environment, FeatureFlagStatus>;
    tags: string[];
    ownerTeam: string;
    createdAt: string;
    updatedAt: string;
    rolloutPercentage: Record<Environment, number>;
    targetingRules: Record<Environment, TargetingGroup[]>;
    rolloutStrategy: RolloutStrategy;
    isTemporary: boolean;
    expiryDate?: string;
    dependencies: FeatureFlagDependency[];
    codeReferences: CodeReference[];
}

export interface RolloutStage {
    name: string;
    target: string;
    duration: string;
    kpis: string[];
    rollback_criteria: string;
    communication_plan: string;
    required_teams: string[];
    status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface GeneratedRolloutPlan {
    feature_name: string;
    risk_assessment: 'low' | 'medium' | 'high';
    suggested_strategy: RolloutStrategy;
    stages: RolloutStage[];
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    user: string;
    featureFlagKey: string;
    environment: Environment;
    action: string;
    details: string;
    beforeState: Partial<FeatureFlag>;
    afterState: Partial<FeatureFlag>;
}

export interface ABTestVariant {
    id: string;
    name: string;
    trafficSplit: number;
}

export interface ABTestResult {
    conversions: number;
    visitors: number;
    rate: number;
    confidenceInterval: [number, number];
    pValue: number;
    uplift: number; // vs control
}

export interface ABTest {
    id: string;
    name: string;
    hypothesis: string;
    featureFlagKey: string;
    status: 'draft' | 'running' | 'completed' | 'paused';
    variants: ABTestVariant[];
    goalMetric: string;
    startDate: string;
    endDate?: string;
    results?: Record<string, ABTestResult>;
    winner?: string; // variant id
}

export interface StaleFlagInfo {
    flagKey: string;
    reason: 'temporary_expired' | 'fully_rolled_out' | 'inactive' | 'no_code_references';
    lastUpdated: string;
    suggestion: string;
}

// SECTION: Mock Data Generation & API Simulation
// ==========================================================

const MOCK_TEAMS = ['Core Banking', 'Mobile App', 'Growth & Marketing', 'Platform Infrastructure', 'Data Science', 'Security', 'Compliance'];
const MOCK_TAGS = ['q1-2024', 'mobile', 'web', 'internal-tool', 'performance', 'new-feature', 'beta', 'pci-dss', 'refactor'];
const MOCK_USERS = ['dev-team@demobank.com', 'product-manager-jane', 'qa-tester-bob', 'release-engineer-sara', 'data-scientist-mike'];
const MOCK_USER_PROPERTIES = ['country', 'email', 'subscriptionTier', 'internalTester', 'appVersion', 'userAge'];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const generateId = () => Math.random().toString(36).substring(2, 12);

export const generateMockCodeReferences = (): CodeReference[] => Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
    id: generateId(),
    filePath: `/src/components/views/feature_${i}/${getRandomElement(['CheckoutButton.tsx', 'UserProfile.vue', 'api/payments.py'])}`,
    line: 50 + Math.floor(Math.random() * 100),
    codeSnippet: `if (featureFlags.isEnabled('${generateId()}')) { ... }`,
    lastDetected: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
}));

export const generateMockFeatureFlag = (id: number): FeatureFlag => {
    const key = `feature-${id}-${generateId()}`;
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    return {
        id: `ff-${id}`,
        key,
        name: `Feature Flag ${id}`,
        description: `This is a detailed description for the feature flag with key: ${key}. It controls a critical part of the application.`,
        status: {
            development: getRandomElement(['enabled', 'disabled']),
            staging: getRandomElement(['enabled', 'disabled']),
            production: 'disabled',
        },
        tags: [getRandomElement(MOCK_TAGS), getRandomElement(MOCK_TAGS)],
        ownerTeam: getRandomElement(MOCK_TEAMS),
        createdAt,
        updatedAt: new Date(new Date(createdAt).getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
        rolloutPercentage: {
            development: 100,
            staging: 50,
            production: 0,
        },
        targetingRules: {
            development: [],
            staging: [{
                id: `tg-staging-${id}`,
                condition: 'AND',
                rules: [{ id: `rule-${id}-1`, property: 'internalTester', operator: 'is', value: 'true' }]
            }],
            production: [],
        },
        rolloutStrategy: getRandomElement(['percentage', 'ring', 'canary']),
        isTemporary: Math.random() > 0.8,
        dependencies: [],
        codeReferences: generateMockCodeReferences(),
    };
};

export const generateMockAuditLog = (flag: FeatureFlag, action: string = 'UPDATE_ROLLOUT_PERCENTAGE'): AuditLogEntry => ({
    id: `log-${generateId()}`,
    timestamp: new Date().toISOString(),
    user: getRandomElement(MOCK_USERS),
    featureFlagKey: flag.key,
    environment: getRandomElement(['staging', 'production']),
    action,
    details: `Changed rollout percentage from 25% to 50%`,
    beforeState: { rolloutPercentage: { development: 100, staging: 25, production: 0 } },
    afterState: { rolloutPercentage: { development: 100, staging: 50, production: 0 } },
});


export class MockFeatureManagementAPI {
    private static _instance: MockFeatureManagementAPI;
    private featureFlags: FeatureFlag[];
    private auditLogs: AuditLogEntry[];
    private abTests: ABTest[];

    private constructor() {
        this.featureFlags = Array.from({ length: 150 }, (_, i) => generateMockFeatureFlag(i + 1));
        this.auditLogs = this.featureFlags.slice(0, 50).map(flag => generateMockAuditLog(flag));
        this.abTests = [{
            id: 'ab-test-1',
            name: 'New Checkout Button Color',
            hypothesis: 'Changing the checkout button from blue to green will increase conversion rate by at least 2%.',
            featureFlagKey: this.featureFlags[0].key,
            status: 'running',
            variants: [
                { id: 'v1', name: 'Control (Blue)', trafficSplit: 50 },
                { id: 'v2', name: 'Variant A (Green)', trafficSplit: 50 },
            ],
            goalMetric: 'checkout_conversion_rate',
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            results: {
                'v1': { conversions: 1024, visitors: 10000, rate: 10.24, confidenceInterval: [9.9, 10.5], pValue: 0.5, uplift: 0 },
                'v2': { conversions: 1150, visitors: 10000, rate: 11.50, confidenceInterval: [11.2, 11.8], pValue: 0.04, uplift: 12.3 },
            },
            winner: 'v2',
        }];
    }

    public static getInstance(): MockFeatureManagementAPI {
        if (!MockFeatureManagementAPI._instance) {
            MockFeatureManagementAPI._instance = new MockFeatureManagementAPI();
        }
        return MockFeatureManagementAPI._instance;
    }

    private simulateLatency = <T>(data: T, duration?: number): Promise<T> => {
        return new Promise(resolve => setTimeout(() => resolve(data), duration ?? 300 + Math.random() * 500));
    };

    public async getFeatureFlags(): Promise<FeatureFlag[]> {
        return this.simulateLatency([...this.featureFlags]);
    }

    public async getFeatureFlag(id: string): Promise<FeatureFlag | undefined> {
        const flag = this.featureFlags.find(f => f.id === id);
        return this.simulateLatency(flag ? { ...flag } : undefined);
    }
    
    public async createFeatureFlag(flagData: Omit<FeatureFlag, 'id' | 'createdAt' | 'updatedAt' | 'dependencies' | 'codeReferences'>): Promise<FeatureFlag> {
        const newFlag: FeatureFlag = {
            ...flagData,
            id: `ff-${this.featureFlags.length + 1}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dependencies: [],
            codeReferences: [],
        };
        this.featureFlags.unshift(newFlag);
        this.auditLogs.unshift(generateMockAuditLog(newFlag, 'CREATE_FLAG'));
        return this.simulateLatency(newFlag);
    }

    public async updateFeatureFlag(updatedFlag: FeatureFlag): Promise<FeatureFlag> {
        const index = this.featureFlags.findIndex(f => f.id === updatedFlag.id);
        if (index !== -1) {
            const oldFlag = this.featureFlags[index];
            this.featureFlags[index] = { ...updatedFlag, updatedAt: new Date().toISOString() };
            this.auditLogs.unshift({
                id: `log-${generateId()}`,
                timestamp: new Date().toISOString(),
                user: 'api-user@demobank.com',
                featureFlagKey: updatedFlag.key,
                environment: 'production',
                action: 'UPDATE_FLAG',
                details: `Flag ${updatedFlag.key} was updated.`,
                beforeState: oldFlag,
                afterState: updatedFlag,
            });
            return this.simulateLatency(this.featureFlags[index]);
        }
        throw new Error("Feature flag not found");
    }

    public async getAuditLogs(limit: number = 100): Promise<AuditLogEntry[]> {
        const sortedLogs = [...this.auditLogs].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return this.simulateLatency(sortedLogs.slice(0, limit));
    }

    public async getABTests(): Promise<ABTest[]> {
        return this.simulateLatency([...this.abTests]);
    }

    public async getStaleFlags(): Promise<StaleFlagInfo[]> {
        const staleFlags: StaleFlagInfo[] = [
            {
                flagKey: this.featureFlags[10].key,
                reason: 'fully_rolled_out',
                lastUpdated: this.featureFlags[10].updatedAt,
                suggestion: 'Flag is at 100% in production for over 90 days. Consider archiving and removing from code.',
            },
            {
                flagKey: this.featureFlags[25].key,
                reason: 'inactive',
                lastUpdated: this.featureFlags[25].updatedAt,
                suggestion: 'Flag has been disabled in all environments for 6 months. Consider archiving.',
            },
            {
                flagKey: this.featureFlags[40].key,
                reason: 'no_code_references',
                lastUpdated: this.featureFlags[40].updatedAt,
                suggestion: 'Our scanner found no code references for this flag. It may be obsolete. Please verify before archiving.',
            }
        ];
        return this.simulateLatency(staleFlags, 800);
    }
}

export const api = MockFeatureManagementAPI.getInstance();


// SECTION: State Management (Zustand)
// ==========================================================
type AppStore = {
    view: string;
    featureFlags: FeatureFlag[];
    auditLogs: AuditLogEntry[];
    abTests: ABTest[];
    staleFlags: StaleFlagInfo[];
    selectedFlag: FeatureFlag | null;
    isLoading: { [key: string]: boolean };
    theme: 'dark' | 'light';

    // Actions
    setView: (view: string) => void;
    loadInitialData: () => Promise<void>;
    selectFlag: (flag: FeatureFlag | null) => void;
    updateFlag: (updatedFlag: FeatureFlag) => Promise<void>;
    toggleTheme: () => void;
};

const useStore = create<AppStore>((set, get) => ({
    view: 'feature_flags_list',
    featureFlags: [],
    auditLogs: [],
    abTests: [],
    staleFlags: [],
    selectedFlag: null,
    isLoading: { initial: true },
    theme: 'dark',

    setView: (view) => set({ view, selectedFlag: view.startsWith('feature_flag_') ? get().selectedFlag : null }),

    loadInitialData: async () => {
        set(produce(draft => { draft.isLoading.initial = true; }));
        const [flags, logs, tests, stale] = await Promise.all([
            api.getFeatureFlags(),
            api.getAuditLogs(),
            api.getABTests(),
            api.getStaleFlags()
        ]);
        set(produce(draft => {
            draft.featureFlags = flags;
            draft.auditLogs = logs;
            draft.abTests = tests;
            draft.staleFlags = stale;
            draft.isLoading.initial = false;
        }));
    },

    selectFlag: (flag) => set({ selectedFlag: flag, view: flag ? 'feature_flag_detail' : 'feature_flags_list' }),
    
    updateFlag: async (updatedFlag) => {
        set(produce(draft => { draft.isLoading[updatedFlag.id] = true; }));
        const savedFlag = await api.updateFeatureFlag(updatedFlag);
        set(produce(draft => {
            const index = draft.featureFlags.findIndex(f => f.id === savedFlag.id);
            if (index !== -1) draft.featureFlags[index] = savedFlag;
            if (draft.selectedFlag?.id === savedFlag.id) draft.selectedFlag = savedFlag;
            draft.isLoading[savedFlag.id] = false;
        }));
        toast.success(`Flag "${savedFlag.name}" updated successfully!`);
    },

    toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));


// SECTION: UI Helper Components
// ==========================================================

export const Pill: FC<{ color: string; children: ReactNode; className?: string }> = ({ color, children, className }) => {
    const colorClasses = {
        green: 'bg-green-800 text-green-200',
        blue: 'bg-blue-800 text-blue-200',
        yellow: 'bg-yellow-800 text-yellow-200',
        red: 'bg-red-800 text-red-200',
        gray: 'bg-gray-700 text-gray-300',
        purple: 'bg-purple-800 text-purple-200',
    }[color] || 'bg-gray-700 text-gray-300';
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${colorClasses} ${className}`}>
            {children}
        </span>
    );
};

export const LoadingSpinner: FC<{ size?: number }> = ({ size = 24 }) => (
    <svg className="animate-spin text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{width: size, height: size}}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const Tab: FC<{ active: boolean; onClick: () => void; children: ReactNode; icon?: ReactNode }> = ({ active, onClick, children, icon }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none flex items-center gap-2 ${
            active
                ? 'border-b-2 border-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
        }`}
    >
        {icon}{children}
    </button>
);

export const Card: FC<{ title?: string; children: ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg p-6 ${className}`}>
        {title && <h3 className="text-xl font-bold text-white mb-4">{title}</h3>}
        {children}
    </div>
);

export const CodeBlock: FC<{ code: string, language: string }> = ({ code, language }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast.success("Copied to clipboard!");
    };
    return (
        <div className="bg-gray-900 rounded-md my-4 relative group">
            <div className="absolute top-2 right-2 flex items-center gap-2">
                <span className="text-xs text-gray-400">{language}</span>
                <button onClick={handleCopy} className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {icons.copy}
                </button>
            </div>
            <pre className="p-4 text-sm text-cyan-200 overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );
};

// SECTION: AI Rollout Plan Generator (Enhanced)
// ==========================================================

export const AiRolloutPlanner: FC = () => {
    const [prompt, setPrompt] = useState("the new AI Ad Studio feature");
    const [generatedPlan, setGeneratedPlan] = useState<GeneratedRolloutPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiModel, setAiModel] = useState<AiModelType>('gemini-2.5-flash');

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedPlan(null);
        setError(null);
        if (!process.env.API_KEY) {
            setError("API key not configured. Please set your Google GenAI API key in the environment variables.");
            setIsLoading(false);
            return;
        }
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    feature_name: { type: Type.STRING },
                    risk_assessment: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                    suggested_strategy: { type: Type.STRING, enum: ['percentage', 'ring', 'canary']},
                    stages: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                target: { type: Type.STRING },
                                duration: { type: Type.STRING },
                                kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
                                rollback_criteria: { type: Type.STRING },
                                communication_plan: { type: Type.STRING },
                                required_teams: { type: Type.ARRAY, items: { type: Type.STRING } },
                                status: { type: Type.STRING, default: 'pending'}
                            },
                            required: ['name', 'target', 'duration', 'kpis', 'rollback_criteria']
                        }
                    }
                },
                required: ['feature_name', 'risk_assessment', 'stages']
            };
            const fullPrompt = `You are a principal release engineer at a major financial institution. Generate a safe, detailed, 4-stage progressive rollout plan for this new banking feature: "${prompt}". 
            The plan must include stages for internal staff, a small percentage of beta users, a larger percentage of general users, and finally a full release.
            For each stage, provide a name, target audience, duration, key performance indicators (KPIs) to monitor, specific rollback criteria, a communication plan, and a list of required teams.
            Also provide an overall risk assessment (low, medium, or high) and a suggested rollout strategy (percentage, ring, or canary).
            The output must be a valid JSON object strictly conforming to the provided schema.`;

            const response = await ai.models.generateContent({ model: aiModel, contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            const parsedPlan = JSON.parse(response.text) as GeneratedRolloutPlan;
            
            parsedPlan.stages = parsedPlan.stages.map(stage => ({ ...stage, status: 'pending' }));
            
            setGeneratedPlan(parsedPlan);
        } catch (err: any) {
            console.error(err);
            setError(`Failed to generate plan. Please check your API key and network connection. Details: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const RiskPill: FC<{ risk: 'low' | 'medium' | 'high' }> = ({ risk }) => {
        const color = risk === 'low' ? 'green' : risk === 'medium' ? 'yellow' : 'red';
        return <Pill color={color}>{risk.toUpperCase()}</Pill>;
    };
    
    return (
         <div className="space-y-6">
            <Card title="AI Rollout Strategy Generator">
                <p className="text-gray-400 mb-4">Describe the feature you want to release, and our AI will generate a safe, progressive rollout plan with risk assessment and KPIs.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-300 block mb-1">Feature Description</label>
                        <input
                            type="text"
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            className="w-full bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="e.g., A new international money transfer feature"
                        />
                    </div>
                    <div>
                         <label className="text-sm font-medium text-gray-300 block mb-1">AI Model</label>
                         <select
                            value={aiModel}
                            onChange={e => setAiModel(e.target.value as AiModelType)}
                            className="w-full bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            <option value="gemini-2.5-flash">Gemini Flash (Fast)</option>
                            <option value="gemini-pro">Gemini Pro (Balanced)</option>
                            <option value="gemini-advanced">Gemini Advanced (High Quality)</option>
                        </select>
                    </div>
                </div>

                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors flex items-center justify-center">
                    {isLoading ? <><LoadingSpinner size={20} /> <span className="ml-2">Generating Plan...</span></> : <><Wand2 size={16} /> <span className="ml-2">Generate Rollout Plan</span></>}
                </button>
            </Card>
            
            {error && (
                <Card title="Error">
                    <div className="flex items-center gap-2 text-red-400"><XCircle/> {error}</div>
                </Card>
            )}

            {(isLoading || generatedPlan) && (
                <Card title="Generated Rollout Plan">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <LoadingSpinner size={48} />
                        </div>
                    ) : generatedPlan && (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-900/50 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{generatedPlan.feature_name}</h3>
                                    <p className="text-gray-400">Strategy: <span className="font-semibold text-cyan-400">{generatedPlan.suggested_strategy}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400 mb-1">Risk Assessment</p>
                                    <RiskPill risk={generatedPlan.risk_assessment} />
                                </div>
                            </div>
                            <div className="relative pl-6">
                                <div className="absolute top-0 left-[34px] w-0.5 h-full bg-gray-700" />

                                {generatedPlan.stages.map((stage: RolloutStage, index: number) => (
                                    <div key={index} className="relative mb-8">
                                        <div className="absolute -left-1.5 top-1.5 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-900 flex items-center justify-center">
                                            <div className="w-3 h-3 bg-cyan-500 rounded-full" />
                                        </div>
                                        <div className="ml-12 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-lg text-white">{index + 1}. {stage.name}</h4>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider">{stage.duration}</p>
                                                </div>
                                                <Pill color="gray">{stage.status}</Pill>
                                            </div>
                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <strong className="text-gray-400 block">Target Audience:</strong>
                                                    <p className="text-gray-300">{stage.target}</p>
                                                </div>
                                                <div>
                                                    <strong className="text-gray-400 block">Rollback Criteria:</strong>
                                                    <p className="text-gray-300">{stage.rollback_criteria}</p>
                                                </div>
                                                <div>
                                                    <strong className="text-gray-400 block">Key Performance Indicators (KPIs):</strong>
                                                    <ul className="list-disc list-inside text-gray-300">
                                                        {stage.kpis.map((kpi, i) => <li key={i}>{kpi}</li>)}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong className="text-gray-400 block">Communication Plan:</strong>
                                                    <p className="text-gray-300">{stage.communication_plan}</p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <strong className="text-gray-400 block">Required Teams:</strong>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {stage.required_teams.map((team, i) => <Pill key={i} color="blue">{team}</Pill>)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <button className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 rounded">Approve Stage</button>
                                                <button className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 rounded">Request Changes</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

// SECTION: Feature Flag List View
// ==========================================================
type SortConfig = { key: keyof FeatureFlag; direction: 'ascending' | 'descending' };

export const FeatureFlagTable: FC<{ flags: FeatureFlag[], onSelectFlag: (flag: FeatureFlag) => void }> = ({ flags, onSelectFlag }) => {
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const sortedAndFilteredFlags = useMemo(() => {
        let filteredFlags = flags.filter(flag =>
            flag.name.toLowerCase().includes(filter.toLowerCase()) ||
            flag.key.toLowerCase().includes(filter.toLowerCase()) ||
            flag.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
        );

        if (sortConfig.key) {
            filteredFlags.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredFlags;
    }, [flags, filter, sortConfig]);
    
    const paginatedFlags = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAndFilteredFlags.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedAndFilteredFlags, currentPage]);

    const totalPages = Math.ceil(sortedAndFilteredFlags.length / itemsPerPage);

    const requestSort = (key: keyof FeatureFlag) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const StatusIndicator: FC<{ status: FeatureFlagStatus }> = ({ status }) => {
        const color = status === 'enabled' ? 'bg-green-500' : status === 'disabled' ? 'bg-gray-500' : 'bg-red-500';
        return <span className={`w-3 h-3 rounded-full inline-block mr-2 ${color}`} title={status}></span>;
    };
    
    return (
        <Card title={`All Feature Flags (${flags.length})`}>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Filter by name, key, or tag..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="w-full bg-gray-800 p-2 pl-10 rounded text-white placeholder-gray-500 border border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icons.search}</div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            {['name', 'key', 'status', 'rolloutPercentage', 'ownerTeam', 'updatedAt'].map(key => (
                                <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    <button onClick={() => requestSort(key as keyof FeatureFlag)} className="flex items-center gap-1">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        {sortConfig.key === key && (sortConfig.direction === 'ascending' ? icons.chevronUp : icons.chevronDown)}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                        {paginatedFlags.map(flag => (
                            <tr key={flag.id} className="hover:bg-gray-800 cursor-pointer" onClick={() => onSelectFlag(flag)}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{flag.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{flag.key}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <div className="flex items-center"><StatusIndicator status={flag.status.production} /> Prod: {flag.status.production}</div>
                                    <div className="flex items-center text-xs text-gray-500"><StatusIndicator status={flag.status.staging} /> Staging: {flag.status.staging}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <div>Prod: {flag.rolloutPercentage.production}%</div>
                                    <div className="text-xs text-gray-500">Staging: {flag.rolloutPercentage.staging}%</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{flag.ownerTeam}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(flag.updatedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">
                    Showing {paginatedFlags.length} of {sortedAndFilteredFlags.length} flags
                </span>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Prev</button>
                    <span className="px-3 py-1 text-sm">{currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Next</button>
                </div>
            </div>
        </Card>
    );
};

// SECTION: Feature Flag Detail View
// ==========================================================

export const FeatureFlagDetailView: FC<{ flag: FeatureFlag, onBack: () => void }> = ({ flag, onBack }) => {
    const [currentEnv, setCurrentEnv] = useState<Environment>('production');
    const updateFlagInStore = useStore(state => state.updateFlag);
    const [localFlag, setLocalFlag] = useState(flag);

    useEffect(() => {
        setLocalFlag(flag);
    }, [flag]);
    
    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setLocalFlag(produce(draft => {
            draft.rolloutPercentage[currentEnv] = value;
        }));
    };
    
    const handleSave = () => {
        updateFlagInStore(localFlag);
    }

    return (
        <Card>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 text-sm mb-2">&larr; Back to all flags</button>
                    <h3 className="text-2xl font-bold text-white">{localFlag.name}</h3>
                    <p className="text-gray-400 font-mono text-sm">{localFlag.key}</p>
                    <p className="text-gray-300 mt-2">{localFlag.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {localFlag.tags.map(tag => <Pill key={tag} color="gray">{tag}</Pill>)}
                    </div>
                </div>
                <div>
                    <Pill color="blue">{localFlag.ownerTeam}</Pill>
                </div>
            </div>
            
            <div className="border-b border-gray-700 mb-4">
                {(['production', 'staging', 'development'] as Environment[]).map(env => (
                    <Tab key={env} active={currentEnv === env} onClick={() => setCurrentEnv(env)}>
                        {env.charAt(0).toUpperCase() + env.slice(1)}
                    </Tab>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card title="Status & Rollout">
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="font-medium text-gray-300">Status:</span>
                            <button className={`px-4 py-2 rounded text-sm ${localFlag.status[currentEnv] === 'enabled' ? 'bg-green-600' : 'bg-gray-600'}`}>Enabled</button>
                            <button className={`px-4 py-2 rounded text-sm ${localFlag.status[currentEnv] === 'disabled' ? 'bg-red-600' : 'bg-gray-600'}`}>Disabled</button>
                        </div>
                        <div className="space-y-2">
                            <label className="font-medium text-gray-300 block">Rollout Percentage: {localFlag.rolloutPercentage[currentEnv]}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={localFlag.rolloutPercentage[currentEnv]}
                                onChange={handlePercentageChange}
                                className="w-full"
                            />
                        </div>
                    </Card>

                    <Card title="Targeting Rules">
                        <p className="text-sm text-gray-400 mb-4">Apply this feature to specific user segments. Rules within a group are combined with the selected condition.</p>
                        {localFlag.targetingRules[currentEnv].length === 0 && <p className="text-gray-500">No targeting rules for this environment.</p>}
                        {/* A full rule builder would be implemented here */}
                    </Card>
                     <Card title="Code References">
                        {localFlag.codeReferences.length > 0 ? (
                            <ul className="space-y-3">
                                {localFlag.codeReferences.map(ref => (
                                    <li key={ref.id} className="bg-gray-900/70 p-3 rounded-md">
                                        <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm">
                                            {icons.code} {ref.filePath}:{ref.line}
                                        </div>
                                        <CodeBlock code={ref.codeSnippet} language="typescript" />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No code references found.</p>
                        )}
                    </Card>
                </div>
                
                <div className="space-y-6">
                     <Card title="Information">
                         <ul className="text-sm space-y-2">
                            <li><strong>Created:</strong> <span className="text-gray-300">{new Date(localFlag.createdAt).toLocaleString()}</span></li>
                            <li><strong>Last Updated:</strong> <span className="text-gray-300">{new Date(localFlag.updatedAt).toLocaleString()}</span></li>
                            <li><strong>Strategy:</strong> <span className="text-gray-300">{localFlag.rolloutStrategy}</span></li>
                         </ul>
                     </Card>
                     <Card title="Actions">
                         <div className="flex flex-col space-y-2">
                             <button onClick={handleSave} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded transition-colors text-sm">Save Changes</button>
                             <button className="w-full py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors text-sm">View History</button>
                             <button className="w-full py-2 bg-red-800 hover:bg-red-900 rounded transition-colors text-sm text-red-200">Archive Flag</button>
                         </div>
                     </Card>
                </div>
            </div>
        </Card>
    );
};

// SECTION: Audit Log View
// ==========================================================

export const AuditLogView: FC = () => {
    const { auditLogs, isLoading } = useStore(state => ({ auditLogs: state.auditLogs, isLoading: state.isLoading.initial }));

    if(isLoading) return <div className="flex justify-center items-center h-64"><LoadingSpinner size={48} /></div>;

    return (
        <Card title="Global Audit Log">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Timestamp</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Feature Flag</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Action</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                        {auditLogs.map(log => (
                            <tr key={log.id}>
                                <td className="px-4 py-3 text-sm text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm text-white font-medium">{log.user}</td>
                                <td className="px-4 py-3 text-sm text-cyan-400 font-mono">{log.featureFlagKey}</td>
                                <td className="px-4 py-3 text-sm">
                                    <Pill color="yellow">{log.action}</Pill>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-300">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

// SECTION: A/B Testing View
// ==========================================================
export const ABTestingView: FC = () => {
    const { abTests, isLoading } = useStore(state => ({ abTests: state.abTests, isLoading: state.isLoading.initial }));

    if (isLoading) return <div className="flex justify-center items-center h-64"><LoadingSpinner size={48} /></div>;
    
    return (
        <div className="space-y-6">
            {abTests.map(test => (
                <Card key={test.id} title={test.name}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <h4 className="font-semibold text-gray-300">Hypothesis</h4>
                            <p className="text-gray-400 mb-4">{test.hypothesis}</p>
                            <h4 className="font-semibold text-gray-300 mb-2">Results</h4>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={Object.entries(test.results || {}).map(([key, value]) => ({ name: test.variants.find(v => v.id === key)?.name, rate: value.rate }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                        <XAxis dataKey="name" stroke="#A0AEC0" />
                                        <YAxis stroke="#A0AEC0" />
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                                        <Legend />
                                        <Bar dataKey="rate" fill="#4FD1C5" name="Conversion Rate (%)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div>
                             <h4 className="font-semibold text-gray-300">Details</h4>
                             <ul className="text-sm space-y-2 mt-2">
                                <li><strong>Status:</strong> <Pill color={test.status === 'running' ? 'green' : 'gray'}>{test.status}</Pill></li>
                                <li><strong>Goal Metric:</strong> <span className="text-gray-300">{test.goalMetric}</span></li>
                                <li><strong>Start Date:</strong> <span className="text-gray-300">{new Date(test.startDate).toLocaleDateString()}</span></li>
                                {test.winner && <li><strong>Winner:</strong> <span className="text-green-400 font-bold">{test.variants.find(v=>v.id === test.winner)?.name}</span></li>}
                             </ul>

                             <div className="mt-4 bg-gray-900/50 p-4 rounded-lg">
                                 <h5 className="font-semibold text-white flex items-center gap-2">{icons.aiMagic} AI Summary</h5>
                                 <p className="text-sm text-gray-300 mt-2">
                                     The 'Variant A (Green)' is the clear winner with a {test.results?.v2.uplift}% uplift in conversion rate and statistical significance (p={test.results?.v2.pValue}). Recommend rolling out the green button to 100% of users.
                                 </p>
                             </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}

// SECTION: Main View Component
// ==========================================================

const DemoBankFeatureManagementView: React.FC = () => {
    const { view, featureFlags, selectedFlag, isLoading, loadInitialData, setView, selectFlag } = useStore();

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);
    
    const handleSelectFlag = useCallback((flag: FeatureFlag) => {
        selectFlag(flag);
    }, [selectFlag]);
    
    const handleBackToList = useCallback(() => {
        selectFlag(null);
    }, [selectFlag]);

    const renderContent = () => {
        if (isLoading.initial && view !== 'ai_planner') {
            return (
                <div className="flex justify-center items-center h-96">
                    <LoadingSpinner size={64} />
                </div>
            );
        }

        switch (view) {
            case 'ai_planner':
                return <AiRolloutPlanner />;
            case 'feature_flags_list':
                return <FeatureFlagTable flags={featureFlags} onSelectFlag={handleSelectFlag} />;
            case 'feature_flag_detail':
                return selectedFlag ? <FeatureFlagDetailView flag={selectedFlag} onBack={handleBackToList} /> : <p>No flag selected.</p>;
            case 'audit_log':
                return <AuditLogView />;
            case 'ab_testing':
                return <ABTestingView />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <Toaster position="top-right" toastOptions={{
                style: { background: '#333', color: '#fff' }
            }}/>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Feature Management</h2>
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded transition-colors font-semibold flex items-center gap-2">
                    {icons.add} New Feature Flag
                </button>
            </div>

            <div className="border-b border-gray-700 mb-6">
                <div className="flex space-x-2">
                    <Tab active={view === 'feature_flags_list' || view === 'feature_flag_detail'} onClick={() => setView('feature_flags_list')} icon={icons.zap}>Feature Flags</Tab>
                    <Tab active={view === 'ai_planner'} onClick={() => setView('ai_planner')} icon={icons.ai}>AI Rollout Planner</Tab>
                    <Tab active={view === 'audit_log'} onClick={() => setView('audit_log')} icon={icons.history}>Audit Log</Tab>
                    <Tab active={view === 'ab_testing'} onClick={() => setView('ab_testing')} icon={icons.abTest}>A/B Testing</Tab>
                </div>
            </div>
            
            <Suspense fallback={<div className="flex justify-center items-center h-96"><LoadingSpinner size={64}/></div>}>
                {renderContent()}
            </Suspense>
        </div>
    );
};

export default DemoBankFeatureManagementView;