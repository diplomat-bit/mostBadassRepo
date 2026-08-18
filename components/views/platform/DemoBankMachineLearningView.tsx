// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankMachineLearningView.tsx
================================================================================

import React, { useState, useMemo, useCallback, useEffect, FC } from 'react';
import Card from '../../Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { v4 as uuidv4 } from 'uuid';

// --- EXISTING DATA (KEPT FOR COMPATIBILITY) ---

const trainingRunsData = [
    { name: 'Mon', runs: 5 }, { name: 'Tue', runs: 8 }, { name: 'Wed', runs: 6 },
    { name: 'Thu', runs: 12 }, { name: 'Fri', runs: 10 }, { name: 'Sat', runs: 3 }, { name: 'Sun', runs: 4 },
];

const experimentAccuracyData = [
    { experiment: 1, accuracy: 92.1, params: 1.2 },
    { experiment: 2, accuracy: 93.5, params: 1.5 },
    { experiment: 3, accuracy: 93.2, params: 1.4 },
    { experiment: 4, accuracy: 94.8, params: 2.1 },
    { experiment: 5, accuracy: 94.5, params: 2.0 },
];

const registeredModels = [
    { id: 1, name: 'fraud-detection', version: 3, stage: 'Production' },
    { id: 2, name: 'fraud-detection', version: 4, stage: 'Staging' },
    { id: 3, name: 'churn-predictor', version: 2, stage: 'Production' },
    { id: 4, name: 'product-recommender', version: 1, stage: 'Archived' },
];


// --- START OF NEW CODE ---
// --- ENHANCED TYPES AND INTERFACES FOR A REAL-WORLD APPLICATION ---

export type ModelStage = 'Production' | 'Staging' | 'Archived' | 'None';
export type RunStatus = 'Completed' | 'Failed' | 'Running';
export type DeploymentStatus = 'Online' | 'Offline' | 'Error' | 'Updating';
export type FeatureType = 'Numerical' | 'Categorical' | 'Text' | 'Timestamp';
export type AlertSeverity = 'Critical' | 'Warning' | 'Info';
export type AITaskType = 'DEBUG_RUN' | 'GENERATE_MODEL_CARD' | 'EXPLAIN_METRIC' | 'QUERY_DATA';

export interface Artifact {
    name: string;
    path: string;
    sizeMB: number;
    type: 'model' | 'dataset' | 'image' | 'log' | 'other';
}

export interface Metric {
    key: string;
    value: number;
    step: number;
}

export interface Parameter {
    key:string;
    value: string | number | boolean;
}

export interface TrainingRun {
    id: string;
    experimentId: string;
    experimentName: string;
    startTime: Date;
    endTime?: Date;
    durationSeconds?: number;
    status: RunStatus;
    metrics: Record<string, number>;
    params: Record<string, string | number | boolean>;
    tags: Record<string, string>;
    artifacts: Artifact[];
    sourceCode: {
        gitRepoUrl: string;
        commitHash: string;
    };
    costUSD: number;
    logs: string[];
}

export interface AuditEvent {
    timestamp: Date;
    user: string;
    action: string;
    details: string;
}

export interface ModelVersion {
    id: string;
    name: string;
    version: number;
    description: string;
    creationTimestamp: Date;
    lastUpdatedTimestamp: Date;
    stage: ModelStage;
    runId: string;
    metrics: Record<string, number>;
    tags: Record<string, string>;
    lineage: {
        parentModelVersionId?: string;
        datasets: string[];
    };
    explainabilityReportUrl?: string;
    auditTrail: AuditEvent[];
}

export interface RegisteredModel {
    name: string;
    description: string;
    creationTimestamp: Date;
    lastUpdatedTimestamp: Date;
    versions: ModelVersion[];
}

export interface BiasMetric {
    group: string;
    metric: 'disparate_impact' | 'statistical_parity_difference';
    value: number;
    threshold: number;
    pass: boolean;
}

export interface DriftMetric {
    feature: string;
    drift_score: number;
    drift_detected: boolean;
}

export interface Deployment {
    id: string;
    modelName: string;
    modelVersion: number;
    endpoint: string;
    status: DeploymentStatus;
    creationTimestamp: Date;
    instanceType: string;
    replicas: number;
    trafficSplit: number; // Percentage
    monitoring: {
        latencyP95: number;
        requestsPerSecond: number;
        errorRate: number;
        dataDrift: DriftMetric[];
        conceptDriftScore: number;
        biasMetrics: BiasMetric[];
    };
}

export interface Feature {
    id: string;
    name: string;
    description: string;
    featureType: FeatureType;
    creationTimestamp: Date;
    lastUpdatedTimestamp: Date;
    source: string;
    freshness: string; // e.g., '1h', '24h'
    version: number;
}

export interface MLOpsAlert {
    id: string;
    title: string;
    message: string;
    severity: AlertSeverity;
    timestamp: Date;
    relatedEntity: {
        type: 'Model' | 'Deployment' | 'Feature' | 'Pipeline';
        id: string;
    };
    acknowledged: boolean;
}

export interface MLPipeline {
    id: string;
    name: string;
    description: string;
    creationTimestamp: Date;
    lastRunStatus: RunStatus;
    schedule: string;
    steps: string[];
}

export interface AIInsight {
    id: string;
    title: string;
    severity: AlertSeverity;
    insight: string;
    recommendation: string;
    relatedEntity: {
        type: 'Model' | 'Deployment' | 'Feature' | 'Pipeline';
        id: string;
    };
    timestamp: Date;
}


// --- MOCK DATA GENERATION ---

const MODEL_NAMES = ['fraud-detection', 'churn-predictor', 'product-recommender', 'credit-scoring', 'loan-approval'];
const USER_NAMES = ['ml.team', 'jane.smith', 'john.doe', 'data.science', 'ops.team', 'sec.audit'];
const GIT_REPOS = [
    'https://github.com/demobank/fraud-model',
    'https://github.com/demobank/customer-analytics',
    'https://github.com/demobank/recommendation-engine'
];
const DATASETS = ['transactions_q1_2023.csv', 'user_profiles_snapshot.parquet', 'clickstream_logs.json'];

export const generateMockTrainingRuns = (count: number): TrainingRun[] => {
    const runs: TrainingRun[] = [];
    for (let i = 0; i < count; i++) {
        const startTime = new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 30);
        const duration = Math.random() * 3600;
        const endTime = new Date(startTime.getTime() + duration * 1000);
        const status: RunStatus = i % 10 === 0 ? 'Failed' : ['Completed', 'Running'][Math.floor(Math.random() * 2)];
        const experimentName = MODEL_NAMES[i % MODEL_NAMES.length];
        const failed = status === 'Failed';
        runs.push({
            id: `run-${uuidv4().substring(0, 8)}`,
            experimentId: `exp-${experimentName}`,
            experimentName: experimentName,
            startTime,
            endTime: status !== 'Running' ? endTime : undefined,
            durationSeconds: status !== 'Running' ? duration : undefined,
            status,
            metrics: {
                accuracy: !failed ? Math.random() * (0.98 - 0.85) + 0.85 : 0,
                precision: !failed ? Math.random() * (0.99 - 0.80) + 0.80 : 0,
                recall: !failed ? Math.random() * (0.97 - 0.82) + 0.82 : 0,
                f1_score: !failed ? Math.random() * (0.98 - 0.83) + 0.83 : 0,
                log_loss: !failed ? Math.random() * 0.5 + 0.1 : 99,
            },
            params: {
                learning_rate: Math.random() * 0.01,
                epochs: [5, 10, 15, 20][Math.floor(Math.random() * 4)],
                batch_size: [32, 64, 128][Math.floor(Math.random() * 3)],
                optimizer: ['Adam', 'SGD', 'RMSprop'][Math.floor(Math.random() * 3)],
            },
            tags: {
                user: USER_NAMES[i % USER_NAMES.length],
                version: `v1.${Math.floor(Math.random() * 5)}`,
                priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
            },
            artifacts: [
                { name: 'model.pkl', path: `/artifacts/run-${i}/model.pkl`, sizeMB: Math.random() * 50 + 10, type: 'model' },
                { name: 'confusion_matrix.png', path: `/artifacts/run-${i}/cm.png`, sizeMB: Math.random() * 1 + 0.1, type: 'image' },
                { name: 'training_log.txt', path: `/artifacts/run-${i}/log.txt`, sizeMB: Math.random() * 0.5, type: 'log' },
            ],
            sourceCode: {
                gitRepoUrl: GIT_REPOS[i % GIT_REPOS.length],
                commitHash: uuidv4().replace(/-/g, '').substring(0, 12),
            },
            costUSD: duration / 3600 * (Math.random() * 5 + 1), // Cost based on duration and instance type factor
            logs: failed ? ['INFO: Starting training...', 'INFO: Loading data...', 'ERROR: OOMKilled: Out of memory on GPU 0.', 'Traceback...'] : ['INFO: Starting training...', 'INFO: Loading data...', 'INFO: Epoch 1/10 complete.', '...','INFO: Training complete.'],
        });
    }
    return runs.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
};

export const generateMockRegisteredModels = (names: string[], runs: TrainingRun[]): RegisteredModel[] => {
    return names.map(name => {
        const versions: ModelVersion[] = [];
        const numVersions = Math.floor(Math.random() * 5) + 2;
        let prodVersion = Math.floor(Math.random() * numVersions) + 1;
        let stagingVersion = Math.floor(Math.random() * numVersions) + 1;
        if (prodVersion === stagingVersion) stagingVersion++;

        for (let i = 1; i <= numVersions; i++) {
            const linkedRun = runs.find(r => r.experimentName === name && r.status === 'Completed');
            if (!linkedRun) continue;

            let stage: ModelStage = 'None';
            if (i === prodVersion) stage = 'Production';
            else if (i === stagingVersion) stage = 'Staging';
            else if (i < prodVersion - 2) stage = 'Archived';
            
            const creationTimestamp = new Date(linkedRun.startTime.getTime() + (linkedRun.durationSeconds || 0) * 1000 + 3600000);
            versions.push({
                id: `mv-${name}-${i}-${uuidv4().substring(0, 4)}`,
                name: name,
                version: i,
                description: `Version ${i} of the ${name} model. Trained with ${linkedRun.params.optimizer} optimizer.`,
                creationTimestamp,
                lastUpdatedTimestamp: new Date(),
                stage,
                runId: linkedRun.id,
                metrics: linkedRun.metrics,
                tags: { ...linkedRun.tags, 'registered_by': USER_NAMES[i % USER_NAMES.length] },
                lineage: {
                    parentModelVersionId: i > 1 ? `mv-${name}-${i-1}-${uuidv4().substring(0,4)}` : undefined,
                    datasets: [DATASETS[i % DATASETS.length]],
                },
                explainabilityReportUrl: stage === 'Production' ? `/reports/xai-${name}-v${i}.pdf` : undefined,
                auditTrail: [
                    { timestamp: creationTimestamp, user: linkedRun.tags.user, action: 'Registered', details: `Registered from run ${linkedRun.id}`},
                    ...(stage !== 'None' ? [{ timestamp: new Date(creationTimestamp.getTime() + 100000), user: 'ops.team', action: `Promoted to ${stage}`, details: `Passed all validation checks.`}] : [])
                ],
            });
        }

        return {
            name: name,
            description: `A model to perform ${name.replace('-', ' ')} for Demo Bank customers.`,
            creationTimestamp: new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 180),
            lastUpdatedTimestamp: new Date(),
            versions: versions.sort((a, b) => b.version - a.version),
        };
    });
};

export const generateMockDeployments = (models: RegisteredModel[]): Deployment[] => {
    const deployments: Deployment[] = [];
    models.forEach(model => {
        const prodVersion = model.versions.find(v => v.stage === 'Production');
        if (prodVersion) {
            deployments.push({
                id: `deploy-prod-${model.name}`, modelName: model.name, modelVersion: prodVersion.version,
                endpoint: `https://api.demobank.com/ml/models/${model.name}/predict`, status: 'Online',
                creationTimestamp: new Date(prodVersion.creationTimestamp.getTime() + 7200000),
                instanceType: 'ml.m5.large', replicas: Math.floor(Math.random() * 3) + 2, trafficSplit: 100,
                monitoring: {
                    latencyP95: Math.random() * 50 + 20, requestsPerSecond: Math.random() * 100 + 50, errorRate: Math.random() * 0.01,
                    conceptDriftScore: Math.random() * 0.2,
                    dataDrift: [{ feature: 'transaction_amount', drift_score: Math.random() * 0.3, drift_detected: Math.random() > 0.9 }],
                    biasMetrics: [{ group: 'age_group_under_25', metric: 'statistical_parity_difference', value: Math.random() * 0.1, threshold: 0.1, pass: true }],
                }
            });
        }
        const stagingVersion = model.versions.find(v => v.stage === 'Staging');
        if (stagingVersion) {
            deployments.push({
                id: `deploy-staging-${model.name}`, modelName: model.name, modelVersion: stagingVersion.version,
                endpoint: `https://staging-api.demobank.com/ml/models/${model.name}/predict`, status: ['Online', 'Updating'][Math.floor(Math.random() * 2)] as DeploymentStatus,
                creationTimestamp: new Date(stagingVersion.creationTimestamp.getTime() + 7200000),
                instanceType: 'ml.t3.medium', replicas: 1, trafficSplit: 100,
                monitoring: {
                    latencyP95: Math.random() * 80 + 40, requestsPerSecond: Math.random() * 10 + 1, errorRate: Math.random() * 0.02,
                    conceptDriftScore: Math.random() * 0.4,
                    dataDrift: [{ feature: 'transaction_amount', drift_score: Math.random() * 0.5, drift_detected: Math.random() > 0.7 }],
                    biasMetrics: [{ group: 'age_group_under_25', metric: 'statistical_parity_difference', value: Math.random() * 0.15, threshold: 0.1, pass: false }],
                }
            });
        }
    });
    return deployments;
};

export const generateMockFeatures = (count: number): Feature[] => {
    const features: Feature[] = [];
    const prefixes = ['user', 'transaction', 'session', 'account', 'loan'];
    const suffixes = ['amount', 'count_7d', 'avg_balance', 'duration', 'country_code', 'device_type', 'description_embedding'];
    for (let i = 0; i < count; i++) {
        const name = `${prefixes[i % prefixes.length]}_${suffixes[i % suffixes.length]}_v${Math.floor(i / (prefixes.length * suffixes.length)) + 1}`;
        let featureType: FeatureType = 'Numerical';
        if (name.includes('country') || name.includes('device')) featureType = 'Categorical';
        if (name.includes('embedding')) featureType = 'Text';
        features.push({
            id: `feat-${uuidv4().substring(0, 8)}`, name,
            description: `Calculates the ${name.replace(/_/g, ' ')}. Updated daily.`,
            featureType, creationTimestamp: new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 365), lastUpdatedTimestamp: new Date(),
            source: ['Kafka Stream: transactions', 'Data Warehouse: user_profiles', 'Batch Job: daily_aggregation'][i % 3],
            freshness: ['1h', '24h', '7d'][i % 3], version: Math.floor(i / (prefixes.length * suffixes.length)) + 1
        });
    }
    return features;
};

export const generateMockAlerts = (count: number, deployments: Deployment[]): MLOpsAlert[] => {
    const alerts: MLOpsAlert[] = [];
    const alertTypes = [
        { title: 'High Prediction Latency', severity: 'Warning' }, { title: 'Concept Drift Detected', severity: 'Critical' },
        { title: 'High Error Rate', severity: 'Critical' }, { title: 'Deployment Offline', severity: 'Critical' },
        { title: 'Feature Freshness Stale', severity: 'Warning' }, { title: 'Bias Threshold Breached', severity: 'Critical' }
    ];
    for (let i = 0; i < count; i++) {
        const alertType = alertTypes[i % alertTypes.length];
        const relatedDeployment = deployments[i % deployments.length];
        if(!relatedDeployment) continue;
        alerts.push({
            id: `alert-${uuidv4().substring(0, 8)}`, title: `${alertType.title} on ${relatedDeployment.modelName}`,
            message: `Model ${relatedDeployment.modelName} v${relatedDeployment.modelVersion} is experiencing ${alertType.title.toLowerCase()}. Please investigate immediately.`,
            severity: alertType.severity as AlertSeverity, timestamp: new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 2),
            relatedEntity: { type: 'Deployment', id: relatedDeployment.id }, acknowledged: Math.random() > 0.5,
        });
    }
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateMockPipelines = (count: number): MLPipeline[] => {
    const pipelines: MLPipeline[] = [];
    for (let i = 0; i < count; i++) {
        const name = `${MODEL_NAMES[i % MODEL_NAMES.length]}-training-pipeline`;
        pipelines.push({
            id: `pipe-${uuidv4().substring(0,8)}`, name,
            description: `End-to-end pipeline for retraining and deploying the ${name} model.`,
            creationTimestamp: new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 90),
            lastRunStatus: ['Completed', 'Failed', 'Running'][Math.floor(Math.random() * 3)] as RunStatus,
            schedule: 'Daily at 02:00 UTC',
            steps: ["Data Ingestion", "Data Validation", "Feature Engineering", "Model Training", "Model Evaluation", "Model Registration", "Conditional Deployment"]
        });
    }
    return pipelines;
};

export const generateAIInsights = (count: number, models: RegisteredModel[], deployments: Deployment[]): AIInsight[] => {
    const insights: AIInsight[] = [];
    const insightTemplates = [
        {
            title: "Performance Degradation Detected", severity: "Warning",
            insight: (d: Deployment) => `Deployment for ${d.modelName} v${d.modelVersion} shows a 15% increase in P95 latency over the last 24 hours.`,
            recommendation: "Investigate underlying infrastructure or model complexity. Consider rolling back to the previous version if performance impact is critical."
        },
        {
            title: "New Champion Model Identified", severity: "Info",
            insight: (m: RegisteredModel) => `A new staging version (v${m.versions[0].version}) of ${m.name} shows a 7% improvement in accuracy over the current production model (v${m.versions.find(v=>v.stage==='Production')?.version}).`,
            recommendation: "Initiate the promotion process to production after final review."
        },
        {
            title: "Potential Data Drift", severity: "Warning",
            insight: (d: Deployment) => `Feature 'transaction_amount' in model ${d.modelName} has a high drift score (0.78), indicating a potential shift in the input data distribution.`,
            recommendation: "Trigger a model retraining pipeline with the latest data to ensure continued performance."
        }
    ];
    for (let i = 0; i < count; i++) {
        const template = insightTemplates[i % insightTemplates.length];
        const deployment = deployments[i % deployments.length];
        const model = models.find(m => m.name === deployment?.modelName);
        if(!deployment || !model) continue;

        insights.push({
            id: `insight-${uuidv4().substring(0,8)}`, title: template.title, severity: template.severity as AlertSeverity,
            insight: template.insight(deployment as any), recommendation: template.recommendation,
            relatedEntity: { type: 'Deployment', id: deployment.id },
            timestamp: new Date(Date.now() - Math.random() * 1000 * 3600 * 48),
        });
    }
    return insights.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// --- UTILITY & HELPER FUNCTIONS ---

export const formatDate = (date?: Date): string => {
    if (!date) return 'N/A';
    return date.toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '');
};

export const formatNumber = (num?: number, places: number = 4): string => {
    if (num === undefined || num === null) return 'N/A';
    return num.toFixed(places);
};

export const getStageColor = (stage: ModelStage): string => {
    switch (stage) {
        case 'Production': return 'bg-green-500/20 text-green-300';
        case 'Staging': return 'bg-cyan-500/20 text-cyan-300';
        case 'Archived': return 'bg-gray-500/20 text-gray-300';
        default: return 'bg-yellow-500/20 text-yellow-300';
    }
};

export const getStatusColor = (status: RunStatus | DeploymentStatus): string => {
    switch (status) {
        case 'Completed': case 'Online': return 'text-green-400';
        case 'Running': case 'Updating': return 'text-cyan-400 animate-pulse';
        case 'Failed': case 'Error': return 'text-red-400';
        case 'Offline': return 'text-gray-400';
        default: return 'text-white';
    }
};


// --- AI SIMULATION SERVICE ---

class AIService {
    private static async simulateLLMResponse(prompt: string, delay: number = 1500): Promise<string> {
        return new Promise(resolve => setTimeout(() => {
            if (prompt.includes("DEBUG_RUN")) {
                resolve(`**Analysis of Failed Run:**

**Root Cause:** The training process terminated unexpectedly due to an \`OOMKilled\` error on GPU 0. This indicates the model and batch size required more memory than was available on the GPU.

**Recommendations:**
1.  **Reduce Batch Size:** The current batch size is 128. Try reducing it to 64 or 32 in your training script.
2.  **Use Gradient Accumulation:** This technique allows you to simulate a larger batch size without increasing memory usage.
3.  **Upgrade Instance Type:** If performance is critical, consider using an instance with more GPU memory, such as an \`ml.p3.8xlarge\`.
4.  **Check for Memory Leaks:** Review your data loading and training loop code for potential memory leaks where tensors are not being detached from the computation graph.`);
            } else if (prompt.includes("GENERATE_MODEL_CARD")) {
                resolve(`**Model Card: fraud-detection v5**

*   **Model Details:** This model is a Gradient Boosted Tree classifier designed to detect fraudulent transactions in real-time.
*   **Intended Use:** To provide a risk score for incoming financial transactions, flagging suspicious ones for manual review.
*   **Training Data:** Trained on 1.5 million anonymized transactions from Q1 2023.
*   **Key Metrics:**
    *   Accuracy: 0.9852
    *   Precision: 0.9630
    *   Recall: 0.9410
    *   F1-Score: 0.9519
*   **Ethical Considerations:** The model has been tested for bias across demographic groups. Bias metrics are within acceptable thresholds. Continuous monitoring is in place.`);
            } else {
                resolve("I am a simulated AI assistant. I can help with debugging failed runs and generating model cards.");
            }
        }, delay));
    }

    public static async getAIResponse(task: AITaskType, context: any): Promise<string> {
        const prompt = `${task} - Context: ${JSON.stringify(context)}`;
        return this.simulateLLMResponse(prompt);
    }
}


// --- CUSTOM UI COMPONENTS ---

export const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm'|'md'|'lg'|'xl' }> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
    if (!isOpen) return null;
    const sizeClasses = {
        sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl'
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={onClose}>
            <div className={`bg-gray-800 rounded-lg shadow-xl w-full p-6 border border-gray-700 ${sizeClasses[size]}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-600">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export const CustomTooltip: FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-gray-900/80 border border-gray-700 rounded-md shadow-lg">
        <p className="label text-gray-300 font-bold">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="text-sm">
                {`${pld.name}: ${formatNumber(pld.value, 4)}`}
            </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Pill: FC<{ text: string; colorClass: string; }> = ({ text, colorClass }) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>{text}</span>
);

export const SortableTable: FC<{ columns: any[]; data: any[]; onRowClick?: (item: any) => void }> = ({ columns, data, onRowClick }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                const valA = sortConfig.key.split('.').reduce((o,i)=>o?.[i], a);
                const valB = sortConfig.key.split('.').reduce((o,i)=>o?.[i], b);
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => col.sortable !== false && requestSort(col.key)}>
                                {col.header}
                                {sortConfig?.key === col.key && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item, index) => (
                        <tr key={index} className={`border-b border-gray-800 hover:bg-gray-800/50 ${onRowClick ? 'cursor-pointer' : ''}`} onClick={() => onRowClick?.(item)}>
                            {columns.map(col => (
                                <td key={col.key} className="px-6 py-4">
                                    {col.render ? col.render(item) : col.key.split('.').reduce((o:any, i:string) => o?.[i], item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// --- SVG ICONS ---
const Icon: FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <div className={className}>{children}</div>;
const ChartBarIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></Icon>;
const CodeIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg></Icon>;
const CubeIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></Icon>;
const ServerIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg></Icon>;
const BellIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></Icon>;
const PipelineIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></Icon>;
const ShieldCheckIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.344.672-.697.978-1.063m-1.958-4.077A6.002 6.002 0 0013 11a6 6 0 10-3.465 5.337" /></svg></Icon>;
const DatabaseIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7v5c0 2.21 3.582 4 8 4s8-1.79 8-4V7" /></svg></Icon>;
const SparklesIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zM3 10a1 1 0 011 1v1h1a1 1 0 110 2H4v1a1 1 0 11-2 0v-1H1a1 1 0 110-2h1v-1a1 1 0 011-1zm12 0a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" /></svg></Icon>;

// --- DETAILED VIEW COMPONENTS ---

export const RunDetailView: FC<{ run: TrainingRun | null, onDebug: (run: TrainingRun) => void }> = ({ run, onDebug }) => {
    if (!run) return <div className="text-gray-400 p-4">Select a run to see details.</div>;

    return (
        <div className="space-y-6">
             {run.status === 'Failed' && (
                <div className="p-4 bg-red-900/50 border border-red-700 rounded-md">
                    <p className="font-bold text-red-300">This run failed.</p>
                    <p className="text-sm text-red-400">Use the AI Assistant to help diagnose the issue.</p>
                    <button onClick={() => onDebug(run)} className="mt-2 px-3 py-1 bg-cyan-600 text-white rounded-md text-sm hover:bg-cyan-700 flex items-center gap-2">
                        <SparklesIcon /> Debug with AI
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Metrics">
                    <ul>{Object.entries(run.metrics).map(([k, v]) => <li key={k} className="flex justify-between py-1 border-b border-gray-800/50"><span className="text-gray-400 font-mono">{k}</span><span className="text-white font-bold">{formatNumber(v)}</span></li>)}</ul>
                </Card>
                <Card title="Parameters">
                    <ul>{Object.entries(run.params).map(([k, v]) => <li key={k} className="flex justify-between py-1 border-b border-gray-800/50"><span className="text-gray-400 font-mono">{k}</span><span className="text-white font-bold">{v.toString()}</span></li>)}</ul>
                </Card>
            </div>
        </div>
    );
};

export const ModelDetailView: FC<{ model: RegisteredModel | null; onPromote: (modelName: string, version: number, stage: ModelStage) => void; onGenerateCard: (modelVersion: ModelVersion) => void; }> = ({ model, onPromote, onGenerateCard }) => {
    if (!model) return <div className="text-gray-400 p-4">Select a model to see details.</div>;

    const versionsColumns = [
        { key: 'version', header: 'Version', render: (item: ModelVersion) => <span className="font-bold text-white">{`v${item.version}`}</span> },
        { key: 'stage', header: 'Stage', render: (item: ModelVersion) => <Pill text={item.stage} colorClass={getStageColor(item.stage)} /> },
        { key: 'metrics.accuracy', header: 'Accuracy', render: (item: ModelVersion) => formatNumber(item.metrics.accuracy) },
        { key: 'metrics.f1_score', header: 'F1 Score', render: (item: ModelVersion) => formatNumber(item.metrics.f1_score) },
        { key: 'creationTimestamp', header: 'Created At', render: (item: ModelVersion) => formatDate(item.creationTimestamp) },
        { key: 'actions', header: 'Actions', sortable: false, render: (item: ModelVersion) => (
            <div className="space-x-2 flex">
                <button onClick={(e) => {e.stopPropagation(); onGenerateCard(item)}} className="text-xs px-2 py-1 bg-purple-600/50 text-purple-200 rounded hover:bg-purple-600/80">AI Model Card</button>
                {item.stage !== 'Production' && <button onClick={(e) => {e.stopPropagation(); onPromote(item.name, item.version, 'Production')}} className="text-xs px-2 py-1 bg-green-600/50 text-green-200 rounded hover:bg-green-600/80">To Prod</button>}
                {item.stage !== 'Staging' && <button onClick={(e) => {e.stopPropagation(); onPromote(item.name, item.version, 'Staging')}} className="text-xs px-2 py-1 bg-cyan-600/50 text-cyan-200 rounded hover:bg-cyan-600/80">To Staging</button>}
            </div>
        )},
    ];
    
    return (<ModelDetailViewContent model={model} versionsColumns={versionsColumns} />);
}

const ModelDetailViewContent: FC<{ model: RegisteredModel; versionsColumns: any[] }> = ({ model, versionsColumns }) => {
    const [selectedVersion, setSelectedVersion] = useState<ModelVersion | null>(null);
    useEffect(() => { setSelectedVersion(null); }, [model]);
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{model.name}</h3>
                <p className="text-gray-400 max-w-2xl">{model.description}</p>
            </div>
            <Card title="Model Versions">
                <SortableTable columns={versionsColumns} data={model.versions} onRowClick={setSelectedVersion} />
            </Card>
            {selectedVersion && (
                 <Card title={`Details for v${selectedVersion.version}`}>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><p className="text-gray-400">Run ID</p><p className="font-mono text-white">{selectedVersion.runId}</p></div>
                        <div><p className="text-gray-400">Parent Model</p><p className="font-mono text-white">{selectedVersion.lineage.parentModelVersionId || 'None'}</p></div>
                        <div><p className="text-gray-400">Dataset(s)</p><p className="font-mono text-white">{selectedVersion.lineage.datasets.join(', ')}</p></div>
                        <div><p className="text-gray-400">Explainability Report</p><p className="font-mono text-cyan-400">{selectedVersion.explainabilityReportUrl ? 'Available' : 'Not Generated'}</p></div>
                    </div>
                 </Card>
            )}
        </div>
    )
}

// --- TABBED VIEWS ---

export const DashboardView: FC<{ stats: any; runs: TrainingRun[]; models: RegisteredModel[]; deployments: Deployment[]; insights: AIInsight[] }> = ({ stats, runs, models, deployments, insights }) => {
    const costData = useMemo(() => {
        const costs: {[key: string]: number} = {};
        runs.forEach(r => {
            const day = r.startTime.toISOString().split('T')[0];
            costs[day] = (costs[day] || 0) + r.costUSD;
        });
        return Object.entries(costs).map(([name, cost]) => ({name, cost})).slice(-30);
    }, [runs]);

    const modelHealthData = deployments.map(d => ({
        name: `${d.modelName} v${d.modelVersion}`,
        healthScore: 100 * (1 - d.monitoring.errorRate) * (1 - d.monitoring.conceptDriftScore)
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><p className="text-3xl font-bold text-white">{stats.activeExperiments}</p><p className="text-sm text-gray-400 mt-1">Active Experiments</p></Card>
                <Card><p className="text-3xl font-bold text-white">{stats.totalRuns}</p><p className="text-sm text-gray-400 mt-1">Total Training Runs</p></Card>
                <Card><p className="text-3xl font-bold text-white">{stats.modelsInProduction}</p><p className="text-sm text-gray-400 mt-1">Models in Production</p></Card>
                <Card><p className="text-3xl font-bold text-white">${stats.totalCost.toFixed(2)}</p><p className="text-sm text-gray-400 mt-1">Compute Cost (30d)</p></Card>
            </div>
            
            <Card title="AI-Powered Insights">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {insights.slice(0, 3).map(insight => (
                        <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${insight.severity === 'Critical' ? 'border-red-500 bg-red-900/40' : insight.severity === 'Warning' ? 'border-yellow-500 bg-yellow-900/40' : 'border-cyan-500 bg-cyan-900/40'}`}>
                            <h4 className="font-bold text-white">{insight.title}</h4>
                            <p className="text-sm text-gray-300 mt-1">{insight.insight}</p>
                            <p className="text-xs text-cyan-300 mt-2 font-semibold">Recommendation: <span className="font-normal text-gray-300">{insight.recommendation}</span></p>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Training Compute Cost (Last 30 Days)">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={costData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="cost" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} unit="$" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Production Model Health">
                     <ResponsiveContainer width="100%" height={300}>
                        <RadialBarChart innerRadius="20%" outerRadius="80%" data={modelHealthData} startAngle={180} endAngle={0}>
                           <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                           <RadialBar background dataKey='healthScore' cornerRadius={10} />
                           <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                           <Tooltip />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    )
}

export const ExperimentTrackingView: FC<{ runs: TrainingRun[]; onDebug: (run:TrainingRun) => void; }> = ({ runs, onDebug }) => {
    const [selectedRun, setSelectedRun] = useState<TrainingRun | null>(null);

    const columns = [
        { key: 'status', header: 'Status', render: (item: TrainingRun) => <Pill text={item.status} colorClass={getStatusColor(item.status) + ' font-bold'} /> },
        { key: 'id', header: 'Run ID', render: (item: TrainingRun) => <span className="font-mono text-white">{item.id}</span> },
        { key: 'experimentName', header: 'Experiment', render: (item: TrainingRun) => <span className="font-mono">{item.experimentName}</span> },
        { key: 'metrics.accuracy', header: 'Accuracy', render: (item: TrainingRun) => formatNumber(item.metrics.accuracy) },
        { key: 'metrics.f1_score', header: 'F1 Score', render: (item: TrainingRun) => formatNumber(item.metrics.f1_score) },
        { key: 'startTime', header: 'Start Time', render: (item: TrainingRun) => formatDate(item.startTime) },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card title="All Training Runs">
                    <SortableTable columns={columns} data={runs} onRowClick={setSelectedRun} />
                </Card>
            </div>
            <div>
                 <Card title="Run Details">
                    <RunDetailView run={selectedRun} onDebug={onDebug} />
                 </Card>
            </div>
        </div>
    );
};

export const ModelRegistryView: FC<{ models: RegisteredModel[]; onPromote: (modelName: string, version: number, stage: ModelStage) => void; onGenerateCard: (modelVersion: ModelVersion) => void; }> = ({ models, onPromote, onGenerateCard }) => {
    const [selectedModel, setSelectedModel] = useState<RegisteredModel | null>(models[0] || null);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
                <Card title="Models">
                    <ul className="space-y-2">{models.map(model => (<li key={model.name}><button onClick={() => setSelectedModel(model)} className={`w-full text-left p-3 rounded-md font-mono ${selectedModel?.name === model.name ? 'bg-cyan-600/30 text-white' : 'hover:bg-gray-800/50 text-gray-300'}`}>{model.name}</button></li>))}</ul>
                </Card>
            </div>
            <div className="lg:col-span-3">
                 <Card title="Model Details">
                    <ModelDetailView model={selectedModel} onPromote={onPromote} onGenerateCard={onGenerateCard} />
                 </Card>
            </div>
        </div>
    );
}

export const FeatureStoreView: FC<{ features: Feature[] }> = ({ features }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredFeatures = useMemo(() => features.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.description.toLowerCase().includes(searchTerm.toLowerCase())), [features, searchTerm]);
    const columns = [
        { key: 'name', header: 'Feature Name', render: (f: Feature) => <span className="font-mono text-white">{f.name}</span> },
        { key: 'featureType', header: 'Type', render: (f: Feature) => <Pill text={f.featureType} colorClass="bg-purple-500/20 text-purple-300" /> },
        { key: 'source', header: 'Source' }, { key: 'freshness', header: 'Freshness' },
        { key: 'creationTimestamp', header: 'Created At', render: (f: Feature) => formatDate(f.creationTimestamp) },
    ];
    return (
        <Card title="Feature Store">
            <input type="text" placeholder="Search features..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 mb-4 bg-gray-900/50 border border-gray-700 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500" />
            <SortableTable columns={columns} data={filteredFeatures} />
        </Card>
    );
};

export const DeploymentsView: FC<{ deployments: Deployment[]; alerts: MLOpsAlert[]; }> = ({ deployments, alerts }) => {
     const columns = [
        { key: 'modelName', header: 'Model', render: (d: Deployment) => <span className="font-mono text-white">{d.modelName} (v{d.modelVersion})</span>},
        { key: 'status', header: 'Status', render: (d: Deployment) => <span className={`font-bold ${getStatusColor(d.status)}`}>{d.status}</span>},
        { key: 'monitoring.requestsPerSecond', header: 'RPS', render: (d: Deployment) => d.monitoring.requestsPerSecond.toFixed(2)},
        { key: 'monitoring.latencyP95', header: 'P95 Latency (ms)', render: (d: Deployment) => d.monitoring.latencyP95.toFixed(2)},
        { key: 'monitoring.errorRate', header: 'Error Rate', render: (d: Deployment) => `${(d.monitoring.errorRate * 100).toFixed(3)}%`},
        { key: 'monitoring.conceptDriftScore', header: 'Concept Drift', render: (d: Deployment) => <span className={d.monitoring.conceptDriftScore > 0.5 ? 'text-yellow-400' : 'text-gray-300'}>{d.monitoring.conceptDriftScore.toFixed(3)}</span>},
        { key: 'monitoring.biasMetrics', header: 'Bias', render: (d: Deployment) => d.monitoring.biasMetrics.every(m => m.pass) ? <span className="text-green-400">Pass</span> : <span className="text-red-400">Fail</span>},
    ];
    return (
        <div className="space-y-6">
            <Card title="Model Deployments">
                <SortableTable columns={columns} data={deployments}/>
            </Card>
            <Card title="Active Alerts">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.filter(a => !a.acknowledged).slice(0, 6).map(alert => (
                    <div key={alert.id} className={`p-3 rounded-md border-l-4 ${alert.severity === 'Critical' ? 'border-red-500 bg-red-500/10' : 'border-yellow-500 bg-yellow-500/10'}`}>
                        <p className="font-bold text-white">{alert.title}</p>
                        <p className="text-sm text-gray-300">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(alert.timestamp)}</p>
                    </div>
                ))}
                </div>
            </Card>
        </div>
    );
};

export const PipelinesView: FC<{ pipelines: MLPipeline[] }> = ({ pipelines }) => {
    const columns = [
        { key: 'name', header: 'Pipeline Name', render: (p: MLPipeline) => <span className="font-mono text-white">{p.name}</span>},
        { key: 'lastRunStatus', header: 'Last Run', render: (p: MLPipeline) => <Pill text={p.lastRunStatus} colorClass={getStatusColor(p.lastRunStatus) + ' font-bold'} />},
        { key: 'schedule', header: 'Schedule' },
        { key: 'creationTimestamp', header: 'Created At', render: (p: MLPipeline) => formatDate(p.creationTimestamp) },
        { key: 'steps', header: 'Steps', render: (p: MLPipeline) => <span className="text-xs text-gray-400">{p.steps.length} steps</span>}
    ];
    return <Card title="ML Pipelines"><SortableTable columns={columns} data={pipelines} /></Card>;
}

export const GovernanceView: FC<{ models: RegisteredModel[] }> = ({ models }) => {
    const allAuditEvents = useMemo(() => models.flatMap(m => m.versions.flatMap(v => v.auditTrail.map(a => ({...a, modelName: m.name, modelVersion: v.version})) )).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()), [models]);
    const columns = [
        { key: 'timestamp', header: 'Timestamp', render: (a: any) => formatDate(a.timestamp)},
        { key: 'modelName', header: 'Model', render: (a: any) => <span className="font-mono text-white">{a.modelName} v{a.modelVersion}</span>},
        { key: 'user', header: 'User', render: (a: any) => <span className="font-mono">{a.user}</span>},
        { key: 'action', header: 'Action', render: (a: any) => <span className="font-semibold">{a.action}</span>},
        { key: 'details', header: 'Details' }
    ];
    return <Card title="Platform Audit Trail"><SortableTable columns={columns} data={allAuditEvents} /></Card>;
};

// --- AI ASSISTANT MODAL ---

const AIAssistantModal: FC<{ isOpen: boolean; onClose: () => void; task: AITaskType | null; context: any }> = ({ isOpen, onClose, task, context }) => {
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && task && context) {
            const fetchResponse = async () => {
                setIsLoading(true);
                setResponse("");
                const res = await AIService.getAIResponse(task, context);
                setResponse(res);
                setIsLoading(false);
            };
            fetchResponse();
        }
    }, [isOpen, task, context]);
    
    const title = task === 'DEBUG_RUN' ? `AI Debug Assistant for ${context?.id}` : `AI Assistant`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
            <div className="prose prose-invert prose-sm max-w-none bg-gray-900 p-4 rounded-md min-h-[300px]">
                {isLoading && <div className="flex items-center gap-2 text-gray-400"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>Thinking...</div>}
                {response.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) return <h3 key={i} className="text-cyan-400">{line.replaceAll('**', '')}</h3>
                    if (line.startsWith('*   ')) return <li key={i}>{line.replace('*   ', '')}</li>
                    return <p key={i}>{line}</p>
                })}
            </div>
        </Modal>
    );
};


// --- MAIN APPLICATION COMPONENT ---

const DemoBankMachineLearningView: React.FC = () => {
    const [activeView, setActiveView] = useState('Dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [aiAssistantState, setAIAssistantState] = useState<{isOpen: boolean; task: AITaskType | null; context: any}>({isOpen: false, task: null, context: null});

    const [mlData, setMlData] = useState<{ runs: TrainingRun[]; models: RegisteredModel[]; deployments: Deployment[]; features: Feature[]; alerts: MLOpsAlert[]; pipelines: MLPipeline[]; insights: AIInsight[] }>({ runs: [], models: [], deployments: [], features: [], alerts: [], pipelines: [], insights: [] });

    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
            setTimeout(() => {
                const runs = generateMockTrainingRuns(150);
                const models = generateMockRegisteredModels(MODEL_NAMES, runs);
                const deployments = generateMockDeployments(models);
                const features = generateMockFeatures(50);
                const alerts = generateMockAlerts(15, deployments);
                const pipelines = generateMockPipelines(MODEL_NAMES.length);
                const insights = generateAIInsights(5, models, deployments);
                setMlData({ runs, models, deployments, features, alerts, pipelines, insights });
                setIsLoading(false);
            }, 1000);
        };
        fetchData();
    }, []);
    
    const handlePromoteModel = useCallback((modelName: string, version: number, newStage: ModelStage) => {
        setMlData(prevData => {
            const newModels = prevData.models.map(m => {
                if (m.name === modelName) {
                    const auditEvent: AuditEvent = { timestamp: new Date(), user: 'ops.team', action: `Promoted to ${newStage}`, details: 'Promotion via MLOps UI' };
                    const updatedVersions = m.versions.map(v => {
                        if (v.stage === newStage) return { ...v, stage: 'None' as ModelStage, auditTrail: [...v.auditTrail, {...auditEvent, action: `Demoted from ${newStage}`}] };
                        if (v.version === version) return { ...v, stage: newStage, auditTrail: [...v.auditTrail, auditEvent] };
                        return v;
                    });
                    return { ...m, versions: updatedVersions };
                }
                return m;
            });
            return { ...prevData, models: newModels };
        });
    }, []);
    
    const handleDebugWithAI = (run: TrainingRun) => setAIAssistantState({ isOpen: true, task: 'DEBUG_RUN', context: { id: run.id, logs: run.logs }});
    const handleGenerateModelCard = (modelVersion: ModelVersion) => setAIAssistantState({ isOpen: true, task: 'GENERATE_MODEL_CARD', context: { name: modelVersion.name, version: modelVersion.version, metrics: modelVersion.metrics }});

    const dashboardStats = useMemo(() => ({
        activeExperiments: new Set(mlData.runs.map(r => r.experimentId)).size,
        totalRuns: mlData.runs.length,
        modelsInProduction: mlData.models.flatMap(m => m.versions).filter(v => v.stage === 'Production').length,
        totalCost: mlData.runs.reduce((sum, run) => sum + run.costUSD, 0),
    }), [mlData]);

    const navItems = [
        { name: 'Dashboard', icon: <ChartBarIcon /> }, { name: 'Experiments', icon: <CodeIcon /> },
        { name: 'Model Registry', icon: <CubeIcon /> }, { name: 'Deployments', icon: <ServerIcon /> },
        { name: 'Pipelines', icon: <PipelineIcon />}, { name: 'Feature Store', icon: <DatabaseIcon /> },
        { name: 'Governance', icon: <ShieldCheckIcon />}
    ];

    const renderActiveView = () => {
        if (isLoading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div></div>;
        switch (activeView) {
            case 'Dashboard': return <DashboardView stats={dashboardStats} {...mlData} />;
            case 'Experiments': return <ExperimentTrackingView runs={mlData.runs} onDebug={handleDebugWithAI}/>;
            case 'Model Registry': return <ModelRegistryView models={mlData.models} onPromote={handlePromoteModel} onGenerateCard={handleGenerateModelCard}/>;
            case 'Deployments': return <DeploymentsView deployments={mlData.deployments} alerts={mlData.alerts} />;
            case 'Pipelines': return <PipelinesView pipelines={mlData.pipelines} />;
            case 'Feature Store': return <FeatureStoreView features={mlData.features} />;
            case 'Governance': return <GovernanceView models={mlData.models} />;
            default: return <div>View not found</div>;
        }
    };

    return (
        <div className="space-y-6">
            <AIAssistantModal {...aiAssistantState} onClose={() => setAIAssistantState(s => ({...s, isOpen: false}))} />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank MLOps Platform</h2>
                <div className="relative mt-2 md:mt-0">
                    <BellIcon />
                    {mlData.alerts.filter(a => !a.acknowledged).length > 0 &&
                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {mlData.alerts.filter(a => !a.acknowledged).length}
                        </span>
                    }
                </div>
            </div>

            <nav className="flex space-x-1 border-b border-gray-700 overflow-x-auto pb-px">
                {navItems.map(item => (
                    <button key={item.name} onClick={() => setActiveView(item.name)}
                        className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
                            activeView === item.name ? 'border-cyan-500 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>
                        {item.icon}<span>{item.name}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-6">{renderActiveView()}</div>
            
            <div className="hidden"> {/* Original components hidden */}
                 <Card title="Registered Models">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Model Name</th>
                                    <th scope="col" className="px-6 py-3">Version</th>
                                    <th scope="col" className="px-6 py-3">Stage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registeredModels.map(model => (
                                    <tr key={model.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-mono text-white">{model.name}</td>
                                        <td className="px-6 py-4">{`v${model.version}`}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${model.stage === 'Production' ? 'bg-green-500/20 text-green-300' : model.stage === 'Staging' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-500/20 text-gray-300'}`}>{model.stage}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DemoBankMachineLearningView;