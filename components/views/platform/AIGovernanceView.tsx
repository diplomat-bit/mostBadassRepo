// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/AIGovernanceView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef, Fragment } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { useForm, Controller } from 'react-hook-form';
import { Transition, Dialog } from '@headlessui/react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import {
  Shield, CheckCircle, XCircle, AlertTriangle, Info, Bot, FileText, BarChart2, GitCommit, Sliders, History, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, Settings, X, Filter, LayoutDashboard, Database, BrainCircuit, Flag, Bell, Users, Building, MoreVertical, FileDown
} from 'lucide-react';

// --- TYPE DEFINITIONS for a FORTUNE 500-GRADE AI Governance PLATFORM ---

export enum ModelStatus {
    DEVELOPMENT = 'Development',
    STAGING = 'Staging',
    PRODUCTION = 'Production',
    ARCHIVED = 'Archived',
    DECOMMISSIONED = 'Decommissioned',
}

export enum RiskLevel {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    CRITICAL = 'Critical',
}

export enum AlertSeverity {
    INFO = 'Info',
    WARNING = 'Warning',
    CRITICAL = 'Critical',
}

export enum AlertType {
    PERFORMANCE_DEGRADATION = 'Performance Degradation',
    DATA_DRIFT = 'Data Drift',
    CONCEPT_DRIFT = 'Concept Drift',
    BIAS_VIOLATION = 'Bias Violation',
    EXPLAINABILITY_FAILURE = 'Explainability Failure',
    POLICY_VIOLATION = 'Policy Violation',
    SECURITY_VULNERABILITY = 'Security Vulnerability',
}

export type UserRole = 'Model Owner' | 'Data Scientist' | 'Auditor' | 'Governance Officer' | 'Admin' | 'ML Engineer';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
}

export interface MetricTimeseriesDataPoint {
    timestamp: string;
    value: number;
}

export interface PerformanceMetrics {
    accuracy: MetricTimeseriesDataPoint[];
    precision: MetricTimeseriesDataPoint[];
    recall: MetricTimeseriesDataPoint[];
    f1Score: MetricTimeseriesDataPoint[];
    auc: MetricTimeseriesDataPoint[];
    logLoss: MetricTimeseriesDataPoint[];
}

export interface FairnessMetric {
    id: string;
    group: string;
    metricName: 'Disparate Impact' | 'Statistical Parity Difference' | 'Equal Opportunity Difference';
    value: number;
    threshold: number;
    isCompliant: boolean;
}

export interface DriftMetrics {
    dataDriftScore: MetricTimeseriesDataPoint[];
    conceptDriftScore: MetricTimeseriesDataPoint[];
}

export interface SHAPFeatureImportance {
    feature: string;
    importance: number;
}

export interface LIMEExplanation {
    predictionId: string;
    featureContributions: { feature: string; contribution: number }[];
    predictedClass: string;
    probability: number;
}

export type AuditLogAction = 'MODEL_CREATED' | 'VERSION_DEPLOYED' | 'POLICY_VIOLATED' | 'ALERT_ACKNOWLEDGED' | 'AUDIT_REQUESTED' | 'MODEL_RETRAINED' | 'SETTINGS_CHANGED';

export interface AuditLog {
    id: string;
    timestamp: string;
    user: User;
    action: AuditLogAction;
    details: string;
    entityId: string; // modelId, policyId, etc.
}

export interface ModelVersion {
    version: string;
    createdAt: string;
    deployedAt?: string;
    createdBy: User;
    description: string;
    algorithm: string;
    trainingDataset: string;
    performanceMetrics: PerformanceMetrics;
    fairnessMetrics: FairnessMetric[];
    driftMetrics: DriftMetrics;
    explainability: {
        global: SHAPFeatureImportance[];
        local: LIMEExplanation[];
    };
    gitCommitHash: string;
    dockerImageUri: string;
}

export interface GovernancePolicy {
    id: string;
    name: string;
    description: string;
    category: 'Fairness' | 'Performance' | 'Drift' | 'Security' | 'Explainability';
    metric: string;
    condition: 'gt' | 'lt' | 'eq' | 'between';
    thresholds: [number, number?];
    appliesTo: 'all' | RiskLevel[];
    isActive: boolean;
    createdBy: User;
    createdAt: string;
}

export interface ModelAlert {
    id: string;
    modelId: string;
    modelName: string;
    timestamp: string;
    severity: AlertSeverity;
    type: AlertType;
    description: string;
    metric: string;
    value: number;
    threshold: number;
    status: 'new' | 'investigating' | 'resolved' | 'ignored';
    assignedTo?: User;
    resolutionNotes?: string;
    history: { status: 'new' | 'investigating' | 'resolved' | 'ignored'; timestamp: string; user?: User }[];
}

export interface AIModel {
    id: string;
    name: string;
    description: string;
    businessUnit: string;
    owner: User;
    status: ModelStatus;
    riskLevel: RiskLevel;
    createdAt: string;
    lastUpdatedAt: string;
    versions: ModelVersion[];
    activeVersion: string;
    tags: string[];
    documentationLink: string;
    policies: string[]; // Array of policy IDs
}

// --- MOCK DATA GENERATION for a REAL-WORLD APPLICATION ---

const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Alice Johnson', email: 'alice@fortune500.com', role: 'Model Owner', avatarUrl: `https://i.pravatar.cc/150?u=u1` },
    { id: 'u2', name: 'Bob Williams', email: 'bob@fortune500.com', role: 'Data Scientist', avatarUrl: `https://i.pravatar.cc/150?u=u2` },
    { id: 'u3', name: 'Charlie Brown', email: 'charlie@fortune500.com', role: 'Auditor', avatarUrl: `https://i.pravatar.cc/150?u=u3` },
    { id: 'u4', name: 'Diana Prince', email: 'diana@fortune500.com', role: 'Governance Officer', avatarUrl: `https://i.pravatar.cc/150?u=u4` },
    { id: 'u5', name: 'Ethan Hunt', email: 'ethan@fortune500.com', role: 'Admin', avatarUrl: `https://i.pravatar.cc/150?u=u5` },
    { id: 'u6', name: 'Fiona Glenanne', email: 'fiona@fortune500.com', role: 'ML Engineer', avatarUrl: `https://i.pravatar.cc/150?u=u6` },
];

const generateTimeseries = (days: number, startValue: number, volatility: number, trend: number = 0): MetricTimeseriesDataPoint[] => {
    const data: MetricTimeseriesDataPoint[] = [];
    let currentValue = startValue;
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        currentValue += (Math.random() - 0.5) * volatility + (trend / days);
        currentValue = Math.max(0, Math.min(1, currentValue)); // Clamp between 0 and 1
        data.push({ timestamp: date.toISOString(), value: parseFloat(currentValue.toFixed(4)) });
    }
    return data;
};

const generateMockModelVersion = (version: string, idx: number): ModelVersion => {
    const creationDate = new Date();
    creationDate.setMonth(creationDate.getMonth() - idx * 2);
    return {
        version: version,
        createdAt: creationDate.toISOString(),
        deployedAt: idx < 2 ? creationDate.toISOString() : undefined,
        createdBy: MOCK_USERS[1],
        description: `Version ${version} with improved feature engineering and hyperparameter tuning.`,
        algorithm: 'XGBoost',
        trainingDataset: `s3://datasets/customer_churn_v${version}.csv`,
        performanceMetrics: {
            accuracy: generateTimeseries(90, 0.92 - idx * 0.02, 0.01),
            precision: generateTimeseries(90, 0.88 - idx * 0.02, 0.02),
            recall: generateTimeseries(90, 0.85 - idx * 0.02, 0.03),
            f1Score: generateTimeseries(90, 0.86 - idx * 0.02, 0.02),
            auc: generateTimeseries(90, 0.95 - idx * 0.02, 0.01),
            logLoss: generateTimeseries(90, 0.25 + idx * 0.01, 0.02),
        },
        fairnessMetrics: [
            { id: 'fm1', group: 'Age > 60', metricName: 'Disparate Impact', value: 0.85 - idx*0.02, threshold: 0.8, isCompliant: 0.85 - idx*0.02 >= 0.8 },
            { id: 'fm2', group: 'Gender=Female', metricName: 'Statistical Parity Difference', value: 0.08 + idx*0.01, threshold: 0.1, isCompliant: 0.08 + idx*0.01 <= 0.1 },
            { id: 'fm3', group: 'Region=EU', metricName: 'Equal Opportunity Difference', value: -0.05, threshold: 0.08, isCompliant: true },
        ],
        driftMetrics: {
            dataDriftScore: generateTimeseries(90, 0.05 + idx * 0.01, 0.02),
            conceptDriftScore: generateTimeseries(90, 0.02 + idx * 0.01, 0.01),
        },
        explainability: {
            global: [
                { feature: 'monthly_tenure', importance: 0.45 }, { feature: 'contract_type', importance: 0.23 },
                { feature: 'total_charges', importance: 0.18 }, { feature: 'last_support_interaction', importance: 0.11 },
                { feature: 'device_type', importance: 0.03 },
            ],
            local: [
                {
                    predictionId: 'pred_123',
                    featureContributions: [{ feature: 'monthly_tenure', contribution: 0.3 }, { feature: 'total_charges', contribution: -0.1 }],
                    predictedClass: 'Churn', probability: 0.88
                }
            ]
        },
        gitCommitHash: `a1b2c3d${idx}e4f5g6h7`,
        dockerImageUri: `gcr.io/my-project/churn-predictor:${version}`
    };
};

const MOCK_MODELS: AIModel[] = [
    {
        id: 'model_1', name: 'Customer Churn Prediction', description: 'Predicts the likelihood of a customer churning in the next 30 days. This model is crucial for retention marketing campaigns.',
        businessUnit: 'Marketing', owner: MOCK_USERS[0], status: ModelStatus.PRODUCTION, riskLevel: RiskLevel.HIGH,
        createdAt: new Date('2023-01-15').toISOString(), lastUpdatedAt: new Date().toISOString(),
        versions: [generateMockModelVersion('2.1.0', 0), generateMockModelVersion('2.0.0', 1), generateMockModelVersion('1.5.0', 2)],
        activeVersion: '2.1.0', tags: ['classification', 'churn', 'marketing', 'xgboost'],
        documentationLink: 'https://internal.wiki/docs/customer-churn-v2', policies: ['p1', 'p3'],
    },
    {
        id: 'model_2', name: 'Product Recommendation Engine', description: 'Recommends products to users based on their browsing history and purchase patterns.',
        businessUnit: 'E-commerce', owner: MOCK_USERS[0], status: ModelStatus.PRODUCTION, riskLevel: RiskLevel.MEDIUM,
        createdAt: new Date('2022-11-20').toISOString(), lastUpdatedAt: new Date().toISOString(),
        versions: [generateMockModelVersion('1.3.2', 0), generateMockModelVersion('1.3.1', 1)],
        activeVersion: '1.3.2', tags: ['recommendation', 'personalization', 'collaborative-filtering'],
        documentationLink: 'https://internal.wiki/docs/product-reco-v1', policies: ['p2'],
    },
    {
        id: 'model_3', name: 'Credit Risk Assessment', description: 'Assesses the credit risk for loan applications using a variety of financial and behavioral data points.',
        businessUnit: 'Finance', owner: MOCK_USERS[0], status: ModelStatus.PRODUCTION, riskLevel: RiskLevel.CRITICAL,
        createdAt: new Date('2022-05-10').toISOString(), lastUpdatedAt: new Date().toISOString(),
        versions: [generateMockModelVersion('3.0.1', 0), generateMockModelVersion('3.0.0', 1)],
        activeVersion: '3.0.1', tags: ['finance', 'risk', 'credit', 'deep-learning'],
        documentationLink: 'https://internal.wiki/docs/credit-risk-v3', policies: ['p1', 'p2', 'p3', 'p4'],
    },
    {
        id: 'model_4', name: 'Sentiment Analysis Bot', description: 'Analyzes customer feedback from support tickets and social media for sentiment.',
        businessUnit: 'Support', owner: MOCK_USERS[1], status: ModelStatus.STAGING, riskLevel: RiskLevel.LOW,
        createdAt: new Date('2023-08-01').toISOString(), lastUpdatedAt: new Date().toISOString(),
        versions: [generateMockModelVersion('0.5.0', 0)],
        activeVersion: '0.5.0', tags: ['nlp', 'sentiment', 'transformer'],
        documentationLink: 'https://internal.wiki/docs/sentiment-bot-v0.5', policies: [],
    },
    {
        id: 'model_5', name: 'Legacy Fraud Detection', description: 'Old fraud detection system pending decommissioning. To be replaced by model_6.',
        businessUnit: 'Security', owner: MOCK_USERS[1], status: ModelStatus.DECOMMISSIONED, riskLevel: RiskLevel.HIGH,
        createdAt: new Date('2020-03-01').toISOString(), lastUpdatedAt: new Date('2023-06-01').toISOString(),
        versions: [generateMockModelVersion('4.2.0', 5)],
        activeVersion: '4.2.0', tags: ['fraud', 'legacy', 'rule-based'],
        documentationLink: 'https://internal.wiki/docs/legacy-fraud-v4', policies: ['p1'],
    },
     {
        id: 'model_6', name: 'Next-Gen Fraud Detection', description: 'Advanced fraud detection using graph neural networks to identify complex fraud rings.',
        businessUnit: 'Security', owner: MOCK_USERS[5], status: ModelStatus.DEVELOPMENT, riskLevel: RiskLevel.CRITICAL,
        createdAt: new Date('2023-09-10').toISOString(), lastUpdatedAt: new Date().toISOString(),
        versions: [generateMockModelVersion('0.1.0-alpha', 0)],
        activeVersion: '0.1.0-alpha', tags: ['fraud', 'gnn', 'security'],
        documentationLink: 'https://internal.wiki/docs/next-gen-fraud-v0.1', policies: [],
    },
];

const MOCK_POLICIES: GovernancePolicy[] = [
    { id: 'p1', name: 'Minimum F1 Score', description: 'All production models must maintain an F1 score above 0.8.', category: 'Performance', metric: 'f1Score', condition: 'gt', thresholds: [0.8], appliesTo: [RiskLevel.HIGH, RiskLevel.CRITICAL], isActive: true, createdBy: MOCK_USERS[3], createdAt: new Date('2022-01-01').toISOString() },
    { id: 'p2', name: 'Data Drift Threshold', description: 'Data drift score must not exceed 0.2 for an extended period.', category: 'Drift', metric: 'dataDriftScore', condition: 'lt', thresholds: [0.2], appliesTo: 'all', isActive: true, createdBy: MOCK_USERS[3], createdAt: new Date('2022-02-15').toISOString() },
    { id: 'p3', name: 'Disparate Impact for Gender', description: 'Disparate impact ratio for gender must be between 0.8 and 1.25.', category: 'Fairness', metric: 'disparateImpact', condition: 'between', thresholds: [0.8, 1.25], appliesTo: [RiskLevel.HIGH, RiskLevel.CRITICAL], isActive: true, createdBy: MOCK_USERS[3], createdAt: new Date('2022-03-10').toISOString() },
    { id: 'p4', name: 'Critical Model Uptime', description: 'Critical models must have 99.9% uptime.', category: 'Performance', metric: 'uptime', condition: 'gt', thresholds: [0.999], appliesTo: [RiskLevel.CRITICAL], isActive: false, createdBy: MOCK_USERS[3], createdAt: new Date('2022-04-01').toISOString() },
];

const MOCK_ALERTS: ModelAlert[] = [
    { id: 'a1', modelId: 'model_1', modelName: 'Customer Churn Prediction', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), severity: AlertSeverity.WARNING, type: AlertType.PERFORMANCE_DEGRADATION, description: "F1 score dropped below policy threshold.", metric: 'f1Score', value: 0.79, threshold: 0.8, status: 'new', history: [{status: 'new', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString() }] },
    { id: 'a2', modelId: 'model_3', modelName: 'Credit Risk Assessment', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), severity: AlertSeverity.CRITICAL, type: AlertType.BIAS_VIOLATION, description: "Disparate impact for 'Age > 65' is 0.75, violating policy.", metric: 'disparateImpact', value: 0.75, threshold: 0.8, status: 'investigating', assignedTo: MOCK_USERS[3], history: [{status: 'new', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString() }, {status: 'investigating', timestamp: new Date(Date.now() - 22 * 3600 * 1000).toISOString(), user: MOCK_USERS[3] }] },
    { id: 'a3', modelId: 'model_2', modelName: 'Product Recommendation Engine', timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), severity: AlertSeverity.INFO, type: AlertType.DATA_DRIFT, description: "Slight data drift detected in user feature 'avg_session_length'.", metric: 'dataDriftScore', value: 0.22, threshold: 0.2, status: 'resolved', assignedTo: MOCK_USERS[1], resolutionNotes: 'Drift was temporary due to marketing campaign. Model performance is stable.', history: [{status: 'new', timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString() }, {status: 'investigating', timestamp: new Date(Date.now() - 2.5 * 24 * 3600 * 1000).toISOString(), user: MOCK_USERS[1] }, {status: 'resolved', timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), user: MOCK_USERS[1] }]},
    { id: 'a4', modelId: 'model_1', modelName: 'Customer Churn Prediction', timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), severity: AlertSeverity.INFO, type: AlertType.CONCEPT_DRIFT, description: "Concept drift score slightly elevated.", metric: 'conceptDriftScore', value: 0.15, threshold: 0.15, status: 'resolved', resolutionNotes: 'Monitored, no impact on performance.', history: [{status: 'new', timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()}, {status: 'resolved', timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), user: MOCK_USERS[1] }] },
    { id: 'a5', modelId: 'model_3', modelName: 'Credit Risk Assessment', timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), severity: AlertSeverity.CRITICAL, type: AlertType.SECURITY_VULNERABILITY, description: "A potential vulnerability was detected in a dependency of the model's serving environment.", metric: 'CVE-2023-XXXX', value: 9.8, threshold: 7.0, status: 'new', history: [{status: 'new', timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString() }] },
];

const MOCK_AUDIT_LOGS: AuditLog[] = Array.from({ length: 50 }).map((_, i) => {
    const user = MOCK_USERS[i % MOCK_USERS.length];
    const model = MOCK_MODELS[i % MOCK_MODELS.length];
    const actions: AuditLogAction[] = ['MODEL_CREATED', 'VERSION_DEPLOYED', 'POLICY_VIOLATED', 'ALERT_ACKNOWLEDGED', 'AUDIT_REQUESTED', 'MODEL_RETRAINED', 'SETTINGS_CHANGED'];
    const action = actions[i % actions.length];
    const date = new Date(Date.now() - i * 12 * 3600 * 1000);

    return {
        id: `log_${i}`,
        timestamp: date.toISOString(),
        user,
        action,
        details: `${user.name} performed action ${action} on model ${model.name}.`,
        entityId: model.id,
    }
});


// --- UTILITY & HELPER FUNCTIONS ---

export const formatDate = (isoString: string): string => format(parseISO(isoString), 'PPpp');
export const formatRelativeTime = (isoString: string): string => formatDistanceToNow(parseISO(isoString), { addSuffix: true });


export const getStatusColor = (status: ModelStatus) => {
    const colors = {
        [ModelStatus.PRODUCTION]: 'bg-green-500',
        [ModelStatus.STAGING]: 'bg-yellow-500',
        [ModelStatus.DEVELOPMENT]: 'bg-blue-500',
        [ModelStatus.ARCHIVED]: 'bg-gray-500',
        [ModelStatus.DECOMMISSIONED]: 'bg-red-700',
    };
    return colors[status] || 'bg-gray-400';
};

export const getRiskColor = (risk: RiskLevel) => {
    const colors = {
        [RiskLevel.CRITICAL]: 'border-red-500 text-red-400',
        [RiskLevel.HIGH]: 'border-orange-500 text-orange-400',
        [RiskLevel.MEDIUM]: 'border-yellow-500 text-yellow-400',
        [RiskLevel.LOW]: 'border-green-500 text-green-400',
    };
    return colors[risk] || 'border-gray-400 text-gray-400';
};

export const getAlertSeverityColor = (severity: AlertSeverity) => {
    const colors = {
        [AlertSeverity.CRITICAL]: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertTriangle },
        [AlertSeverity.WARNING]: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle },
        [AlertSeverity.INFO]: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Info },
    };
    return colors[severity] || { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Info };
};

// --- MOCK API SERVICE ---

const apiService = {
  fetchModels: async (): Promise<AIModel[]> => {
    await new Promise(res => setTimeout(res, 500));
    return MOCK_MODELS;
  },
  fetchModelById: async (id: string): Promise<AIModel | undefined> => {
    await new Promise(res => setTimeout(res, 300));
    return MOCK_MODELS.find(m => m.id === id);
  },
  fetchAlerts: async (): Promise<ModelAlert[]> => {
    await new Promise(res => setTimeout(res, 400));
    return MOCK_ALERTS;
  },
  fetchPolicies: async (): Promise<GovernancePolicy[]> => {
    await new Promise(res => setTimeout(res, 200));
    return MOCK_POLICIES;
  },
  fetchAuditLogs: async (modelId: string): Promise<AuditLog[]> => {
    await new Promise(res => setTimeout(res, 600));
    return MOCK_AUDIT_LOGS.filter(log => log.entityId === modelId);
  },
  generateAIInsight: async (model: AIModel): Promise<string> => {
    await new Promise(res => setTimeout(res, 1500));
    const version = model.versions.find(v => v.version === model.activeVersion);
    if (!version) return "Could not generate insight: active version data not found.";
    
    const performance = version.performanceMetrics.f1Score[version.performanceMetrics.f1Score.length - 1].value > 0.85 ? 'strong' : 'decent';
    const drift = version.driftMetrics.dataDriftScore[version.driftMetrics.dataDriftScore.length - 1].value > 0.2 ? 'high' : 'low';
    const bias = version.fairnessMetrics.some(m => !m.isCompliant) ? 'present' : 'not detected';

    return `**AI Executive Summary for ${model.name} (v${model.activeVersion}):**
- **Overall Health:** The model is currently in a **${model.status}** state with a **${model.riskLevel}** risk level. Its performance is **${performance}**, and data drift is **${drift}**.
- **Key Concerns:** Potential bias is **${bias}**. The recent performance trend shows a slight decline in recall, which may impact our ability to identify all positive cases.
- **Recommendation:** Monitor the recall metric closely. If the downward trend continues for another 48 hours, consider a targeted retraining cycle focusing on the underperforming segments. The data drift score is approaching the policy threshold, and a deeper analysis of input feature distribution is advised.`;
  }
};

// --- REUSABLE UI COMPONENTS ---
const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string, actions?: React.ReactNode }> = ({ title, children, className = '', actions }) => (
    <div className={`bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-lg ${className}`}>
        {title && (
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
                {actions && <div className="flex items-center space-x-2">{actions}</div>}
            </div>
        )}
        <div className="p-4">{children}</div>
    </div>
);

const KpiCard: React.FC<{ title: string; value: string; change?: string; changeType?: 'increase' | 'decrease', icon: React.ReactNode }> = ({ title, value, change, changeType, icon }) => {
    const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';
    const changeIcon = changeType === 'increase' ? '▲' : '▼';
    return (
        <Card>
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-600/20 text-indigo-400 mr-4">{icon}</div>
                <div>
                    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-100">{value}</p>
                    {change && (
                        <p className={`mt-1 text-sm ${changeColor} flex items-center`}>
                            {changeIcon} {change} vs last period
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};

const TimeseriesChart: React.FC<{ data: MetricTimeseriesDataPoint[][]; dataKeys: string[]; colors: string[]; title: string }> = ({ data, dataKeys, colors, title }) => (
    <Card title={title}>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="timestamp" stroke="#A0AEC0" tickFormatter={(ts) => format(parseISO(ts), 'MMM d')} />
                <YAxis stroke="#A0AEC0" domain={[0, 1]} />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                    labelFormatter={(label) => format(parseISO(label), 'PPpp')}
                />
                <Legend />
                {dataKeys.map((key, index) => (
                    <Line key={key} type="monotone" dataKey="value" data={data[index]} name={key} stroke={colors[index]} strokeWidth={2} dot={false} />
                ))}
            </LineChart>
        </ResponsiveContainer>
    </Card>
);

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

// --- VIEWS / SECTIONS of the GOVERNANCE DASHBOARD ---

export const DashboardOverview: React.FC<{ onViewModel: (id: string) => void }> = ({ onViewModel }) => {
    const [models, setModels] = useState<AIModel[]>([]);
    const [alerts, setAlerts] = useState<ModelAlert[]>([]);
    const [policies, setPolicies] = useState<GovernancePolicy[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [modelsData, alertsData, policiesData] = await Promise.all([
                apiService.fetchModels(),
                apiService.fetchAlerts(),
                apiService.fetchPolicies(),
            ]);
            setModels(modelsData);
            setAlerts(alertsData);
            setPolicies(policiesData);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <Spinner />;

    const totalModels = models.length;
    const productionModels = models.filter(m => m.status === ModelStatus.PRODUCTION).length;
    const newCriticalAlerts = alerts.filter(a => a.severity === AlertSeverity.CRITICAL && a.status === 'new').length;
    const policiesInForce = policies.filter(p => p.isActive).length;

    const prodModelF1Scores = models
        .filter(m => m.status === ModelStatus.PRODUCTION && m.versions.length > 0)
        .map(m => {
            const activeVersion = m.versions.find(v => v.version === m.activeVersion);
            const f1Data = activeVersion?.performanceMetrics.f1Score || [];
            return f1Data;
        });

    const prodModelNames = models.filter(m => m.status === ModelStatus.PRODUCTION).map(m => m.name);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Models" value={totalModels.toString()} change="+2" changeType="increase" icon={<Database size={24} />} />
                <KpiCard title="Models in Production" value={productionModels.toString()} icon={<CheckCircle size={24} />} />
                <KpiCard title="Active Critical Alerts" value={newCriticalAlerts.toString()} change="+1" changeType='increase' icon={<AlertTriangle size={24} />} />
                <KpiCard title="Active Policies" value={policiesInForce.toString()} icon={<Shield size={24} />} />
            </div>

            <TimeseriesChart 
                title="Production Models F1 Score"
                data={prodModelF1Scores}
                dataKeys={prodModelNames}
                colors={['#8884d8', '#82ca9d', '#ffc658']}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Recent Alerts" actions={<button className="text-sm text-indigo-400 hover:underline">View All</button>}>
                    <ul className="divide-y divide-gray-700">
                        {alerts.filter(a => a.status === 'new').slice(0, 4).map(alert => (
                            <li key={alert.id} className="py-3 px-2 hover:bg-gray-800/50 rounded-md">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-1 rounded-full ${getAlertSeverityColor(alert.severity).bg} ${getAlertSeverityColor(alert.severity).text}`}>
                                       {React.createElement(getAlertSeverityColor(alert.severity).icon, { className: 'h-4 w-4' })}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-200">{alert.modelName}: {alert.type}</p>
                                        <p className="text-xs text-gray-400">{alert.description}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{formatRelativeTime(alert.timestamp)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="High Risk Models" actions={<button className="text-sm text-indigo-400 hover:underline">View All</button>}>
                     <ul className="divide-y divide-gray-700">
                        {models.filter(m => m.riskLevel === RiskLevel.CRITICAL || m.riskLevel === RiskLevel.HIGH).slice(0,4).map(model => (
                            <li key={model.id} className="py-3 px-2 hover:bg-gray-800/50 rounded-md cursor-pointer" onClick={() => onViewModel(model.id)}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">{model.name}</p>
                                        <p className="text-xs text-gray-400">{model.businessUnit}</p>
                                    </div>
                                    <div className={`text-xs font-semibold px-2 py-1 border rounded-full ${getRiskColor(model.riskLevel)}`}>
                                        {model.riskLevel}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export const ModelInventoryView: React.FC<{ onViewModel: (id: string) => void }> = ({ onViewModel }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<{ status: string[]; risk: string[] }>({ status: [], risk: [] });
    const [models, setModels] = useState<AIModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiService.fetchModels().then(data => {
            setModels(data);
            setLoading(false);
        });
    }, []);

    const filteredModels = useMemo(() => {
        return models.filter(model => {
            const lowerSearch = searchTerm.toLowerCase();
            const matchesSearch = model.name.toLowerCase().includes(lowerSearch) ||
                model.description.toLowerCase().includes(lowerSearch) ||
                model.tags.some(tag => tag.toLowerCase().includes(lowerSearch));
            const matchesStatus = filters.status.length === 0 || filters.status.includes(model.status);
            const matchesRisk = filters.risk.length === 0 || filters.risk.includes(model.riskLevel);
            return matchesSearch && matchesStatus && matchesRisk;
        });
    }, [searchTerm, filters, models]);

    const toggleFilter = (category: 'status' | 'risk', value: string) => {
        setFilters(prev => {
            const current = prev[category];
            const newValues = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
            return { ...prev, [category]: newValues };
        });
    };

    if (loading) return <Spinner />;

    return (
        <Card>
            <div className="p-4 space-y-4 border-b border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search models by name, tag, or description..."
                        className="w-full bg-gray-900 border border-gray-700 rounded-md pl-10 pr-3 py-2 text-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-8">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Status</h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(ModelStatus).map(s => (
                                <button key={s} onClick={() => toggleFilter('status', s)} className={`px-2 py-1 text-xs rounded transition-colors ${filters.status.includes(s) ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Risk Level</h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(RiskLevel).map(r => (
                                <button key={r} onClick={() => toggleFilter('risk', r)} className={`px-2 py-1 text-xs rounded transition-colors ${filters.risk.includes(r) ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{r}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Risk Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Owner</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Updated</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {filteredModels.map(model => (
                            <tr key={model.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-100">{model.name}</div>
                                    <div className="text-xs text-gray-400">{model.businessUnit}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                                        <span className={`h-2 w-2 mr-2 rounded-full ${getStatusColor(model.status)}`}></span>
                                        {model.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRiskColor(model.riskLevel)}`}>
                                        {model.riskLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 flex items-center">
                                    <img src={model.owner.avatarUrl} alt={model.owner.name} className="h-6 w-6 rounded-full mr-2"/>
                                    {model.owner.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(model.lastUpdatedAt)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onViewModel(model.id)} className="text-indigo-400 hover:text-indigo-300">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const AIInsightPanel: React.FC<{model: AIModel}> = ({ model }) => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiService.generateAIInsight(model).then(text => {
            setInsight(text);
            setLoading(false);
        })
    }, [model]);

    return (
        <Card title="AI-Powered Insights" actions={<Bot size={20} className="text-indigo-400" />}>
            {loading ? <div className="flex items-center space-x-2 text-gray-400"><Spinner /><span>Generating summary...</span></div> :
            <div className="prose prose-sm prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br />') }}></div>
            }
        </Card>
    )
}

export const ModelDetailView: React.FC<{ modelId: string; onBack: () => void }> = ({ modelId, onBack }) => {
    const [model, setModel] = useState<AIModel | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(true);
        apiService.fetchModelById(modelId).then(foundModel => {
            setModel(foundModel || null);
            setLoading(false);
        });
    }, [modelId]);

    if (loading || !model) {
        return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    }

    const activeVersionData = model.versions.find(v => v.version === model.activeVersion);

    const TABS = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'performance', label: 'Performance', icon: BarChart2 },
        { id: 'fairness', label: 'Fairness & Bias', icon: Users },
        { id: 'explainability', label: 'Explainability', icon: BrainCircuit },
        { id: 'drift', label: 'Data Drift', icon: Sliders },
        { id: 'audit', label: 'Audit Trail', icon: History },
        { id: 'versions', label: 'Versions', icon: GitCommit },
    ];

    const renderTabContent = () => {
        if (!activeVersionData) return <p className="text-red-400">Error: Active version data not found.</p>;
        switch (activeTab) {
            case 'overview': return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <AIInsightPanel model={model} />
                        <Card>
                            <p className="text-gray-300">{model.description}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                               {model.tags.map(tag => <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>)}
                            </div>
                        </Card>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg space-y-2 text-sm self-start">
                        <h3 className="font-semibold text-gray-200 mb-2">Metadata</h3>
                        <p><strong className="text-gray-400">Owner:</strong> {model.owner.name}</p>
                        <p><strong className="text-gray-400">Business Unit:</strong> {model.businessUnit}</p>
                        <p><strong className="text-gray-400">Risk Level:</strong> {model.riskLevel}</p>
                        <p><strong className="text-gray-400">Status:</strong> {model.status}</p>
                        <p><strong className="text-gray-400">Active Version:</strong> {model.activeVersion}</p>
                        <a href={model.documentationLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline flex items-center"><FileText size={16} className="mr-1" /> View Documentation</a>
                    </div>
                </div>
            );
            case 'performance': return (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-200">Live Performance Metrics (v{model.activeVersion})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TimeseriesChart title="Accuracy" data={[activeVersionData.performanceMetrics.accuracy]} dataKeys={['Accuracy']} colors={['#8884d8']} />
                        <TimeseriesChart title="F1 Score" data={[activeVersionData.performanceMetrics.f1Score]} dataKeys={['F1 Score']} colors={['#82ca9d']} />
                        <TimeseriesChart title="Precision vs Recall" data={[activeVersionData.performanceMetrics.precision, activeVersionData.performanceMetrics.recall]} dataKeys={['Precision', 'Recall']} colors={['#ffc658', '#ff8042']} />
                        <TimeseriesChart title="AUC" data={[activeVersionData.performanceMetrics.auc]} dataKeys={['AUC']} colors={['#0088FE']} />
                    </div>
                </div>
            );
            case 'fairness': return (
                 <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-200">Fairness Analysis (v{model.activeVersion})</h3>
                    <p className="text-gray-400">Monitoring for fairness across protected attributes to ensure equitable outcomes.</p>
                    <Card>
                        <table className="min-w-full divide-y divide-gray-700">
                             <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Protected Group</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Metric</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Value</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Threshold</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                </tr>
                             </thead>
                             <tbody>
                                {activeVersionData.fairnessMetrics.map((metric) => (
                                    <tr key={metric.id}>
                                        <td className="px-4 py-3 text-sm text-gray-300">{metric.group}</td>
                                        <td className="px-4 py-3 text-sm text-gray-300">{metric.metricName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-300">{metric.value.toFixed(3)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{`≤ ${metric.threshold}`}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {metric.isCompliant 
                                                ? <span className="flex items-center text-green-400"><CheckCircle size={16} className="mr-1"/> Compliant</span> 
                                                : <span className="flex items-center text-red-400"><XCircle size={16} className="mr-1"/> Violation</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                    </Card>
                </div>
            );
            case 'explainability': return (
                 <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-200">Model Explainability (XAI) (v{model.activeVersion})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Global Feature Importance (SHAP)">
                            <ul className="space-y-2">
                               {activeVersionData.explainability.global.map(f => (
                                   <li key={f.feature}>
                                       <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-300 capitalize">{f.feature.replace(/_/g, ' ')}</span>
                                            <span className="text-gray-400 font-mono">{f.importance.toFixed(3)}</span>
                                       </div>
                                       <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                                           <div className="bg-indigo-500 h-2.5 rounded-full" style={{width: `${f.importance * 100}%`}}></div>
                                       </div>
                                   </li>
                               ))}
                            </ul>
                        </Card>
                         <Card title="Local Explanation Example (LIME)">
                            <div className="text-sm space-y-2">
                               <p>Prediction for ID <code className="bg-gray-700 p-1 rounded font-mono">pred_123</code></p>
                               <p>Outcome: <strong className="text-indigo-400">{activeVersionData.explainability.local[0].predictedClass}</strong> with {(activeVersionData.explainability.local[0].probability * 100).toFixed(1)}% probability.</p>
                               <h4 className="font-semibold pt-2">Feature Contributions:</h4>
                               <ul className="list-disc list-inside text-gray-400">
                                {activeVersionData.explainability.local[0].featureContributions.map(c => (
                                    <li key={c.feature}>
                                        <span className="capitalize">{c.feature.replace(/_/g, ' ')}:</span> <span className={`${c.contribution > 0 ? 'text-green-400' : 'text-red-400'} font-mono`}>{c.contribution > 0 ? '+' : ''}{c.contribution.toFixed(2)}</span>
                                    </li>
                                ))}
                               </ul>
                            </div>
                        </Card>
                    </div>
                </div>
            );
            case 'drift': return (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-200">Drift Monitoring (v{model.activeVersion})</h3>
                    <p className="text-gray-400">Tracking changes in data distributions and model predictions over time.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TimeseriesChart title="Input Data Drift" data={[activeVersionData.driftMetrics.dataDriftScore]} dataKeys={['Data Drift Score']} colors={['#ff7300']} />
                        <TimeseriesChart title="Concept (Prediction) Drift" data={[activeVersionData.driftMetrics.conceptDriftScore]} dataKeys={['Concept Drift Score']} colors={['#387908']} />
                    </div>
                </div>
            );
            case 'audit': return <AuditTrailView modelId={model.id} />;
            default: return <p>This tab is under construction.</p>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <button onClick={onBack} className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 mb-4">
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Inventory
                </button>
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                         <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">{model.name}</h2>
                    </div>
                     <div className="mt-4 flex md:mt-0 md:ml-4">
                        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700">
                           <FileText size={16} className="mr-2" />
                           Request Audit
                        </button>
                         <button type="button" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                           <BrainCircuit size={16} className="mr-2" />
                           Retrain Model
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                            } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <tab.icon size={16} className="mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export const AuditTrailView: React.FC<{ modelId: string }> = ({ modelId }) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiService.fetchAuditLogs(modelId).then(data => {
            setLogs(data);
            setLoading(false);
        });
    }, [modelId]);

    if (loading) return <Spinner />;

    return (
        <Card title="Audit Trail">
            <div className="flow-root">
                <ul className="-mb-8">
                    {logs.map((log, logIdx) => (
                        <li key={log.id}>
                            <div className="relative pb-8">
                                {logIdx !== logs.length - 1 ? (
                                    <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-600" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex items-start space-x-3">
                                    <div className="relative">
                                        <img className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 ring-8 ring-gray-800/50" src={log.user.avatarUrl} alt="" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div>
                                            <div className="text-sm">
                                                <a href="#" className="font-medium text-gray-200">{log.user.name}</a>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                {formatDate(log.timestamp)}
                                            </p>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-300">
                                            <p>{log.action.replace(/_/g, ' ')}: {log.details}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    )
};


// --- MAIN VIEW COMPONENT ---

const AIGovernanceView: React.FC = () => {
    const [currentView, setCurrentView] = useState<'dashboard' | 'inventory' | 'model_detail' | 'policies' | 'alerts'>('dashboard');
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

    const handleViewModel = useCallback((modelId: string) => {
        setSelectedModelId(modelId);
        setCurrentView('model_detail');
    }, []);

    const navigateToInventory = () => setCurrentView('inventory');
    
    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardOverview onViewModel={handleViewModel} />;
            case 'inventory':
                return <ModelInventoryView onViewModel={handleViewModel} />;
            case 'model_detail':
                return selectedModelId ? <ModelDetailView modelId={selectedModelId} onBack={navigateToInventory} /> : <p className="text-gray-400">No model selected. Please return to the inventory.</p>;
            case 'policies':
                return <Card title="Policy Management"><p className="p-4 text-gray-400">Policy management UI is under construction. This section will allow defining, updating, and applying governance policies across the model inventory.</p></Card>;
            case 'alerts':
                return <Card title="Alerts Dashboard"><p className="p-4 text-gray-400">Alerts dashboard UI is under construction. This will provide a centralized view for triaging and managing all model-related alerts.</p></Card>;
            default:
                return <DashboardOverview onViewModel={handleViewModel} />;
        }
    };

    const TABS = [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'inventory', label: 'Model Inventory', icon: Database },
      { id: 'policies', label: 'Policy Management', icon: Shield },
      { id: 'alerts', label: 'Alerts', icon: Bell },
    ];

    const newAlertsCount = MOCK_ALERTS.filter(a => a.status === 'new').length;

    return (
        <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-gray-900 text-gray-200 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center"><BrainCircuit size={32} className="mr-3 text-indigo-400"/> AI Governance Dashboard</h1>
                    <p className="mt-1 text-gray-400">A central hub for managing AI model lifecycles, monitoring for bias, and ensuring ethical compliance.</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <button className="inline-flex items-center px-3 py-2 text-sm bg-gray-700/50 hover:bg-gray-700 rounded-md text-gray-300">
                        <FileDown size={16} className="mr-2" />
                        Generate Report
                    </button>
                     <button className="inline-flex items-center px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold">
                        <Plus size={16} className="mr-2" />
                        Register New Model
                    </button>
                </div>
            </header>

            <nav className="flex space-x-2 sm:space-x-4 border-b border-gray-700 pb-2">
                 {TABS.map(tab => (
                     <button 
                        key={tab.id}
                        onClick={() => setCurrentView(tab.id as any)} 
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            currentView === tab.id || (tab.id === 'inventory' && currentView === 'model_detail')
                            ? 'bg-gray-800 text-white' 
                            : 'text-gray-400 hover:bg-gray-700/50'
                        }`}
                     >
                        <tab.icon size={16} className="mr-2" />
                        {tab.label}
                        {tab.id === 'alerts' && newAlertsCount > 0 && 
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{newAlertsCount}</span>
                        }
                     </button>
                 ))}
            </nav>

            <main>
                {renderCurrentView()}
            </main>
        </div>
    );
};

export default AIGovernanceView;