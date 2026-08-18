// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankAIPlatformView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Card from '../../Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area, CartesianGrid, PieChart, Pie, Cell, Sector } from 'recharts';

// In a real app, this data would come from a dedicated file or a live API call
const modelPerformanceData = [
  { name: 'Jan', accuracy: 92.5 }, { name: 'Feb', accuracy: 93.1 },
  { name: 'Mar', accuracy: 92.8 }, { name: 'Apr', accuracy: 94.2 },
  { name: 'May', accuracy: 94.5 }, { name: 'Jun', accuracy: 95.1 },
];
const apiUsageData = [
    { name: 'Vision API', calls: 120000 }, { name: 'NLP API', calls: 85000 },
    { name: 'Translation API', calls: 45000 }, { name: 'Prediction API', calls: 250000 },
];
const deployedModels = [
    { id: 1, name: 'fraud-detection-v3', endpoint: '...', status: 'Online' },
    { id: 2, name: 'product-recommender-v1.2', endpoint: '...', status: 'Online' },
    { id: 3, name: 'churn-predictor-v2', endpoint: '...', status: 'Scaling' },
    { id: 4, name: 'sentiment-analyzer-v1', endpoint: '...', status: 'Offline' },
];


// --- START OF EXPANDED CODE ---

// =================================================================
// 1. ADVANCED TYPE DEFINITIONS FOR A REAL-WORLD AI PLATFORM
// =================================================================

export enum ModelStatus {
    Online = 'Online',
    Offline = 'Offline',
    Scaling = 'Scaling',
    Error = 'Error',
    Deploying = 'Deploying',
    Training = 'Training',
}

export enum AlertSeverity {
    Info = 'Info',
    Warning = 'Warning',
    Critical = 'Critical',
}

export enum PipelineStatus {
    Running = 'Running',
    Completed = 'Completed',
    Failed = 'Failed',
    Pending = 'Pending',
}

export interface ModelResourceUsage {
    timestamp: number;
    cpuPercent: number;
    memoryMb: number;
    gpuPercent: number | null;
}

export interface PerformanceMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
    confusionMatrix: number[][];
}

export interface DeployedModel {
    id: string;
    name: string;
    version: string;
    status: ModelStatus;
    endpoint: string;
    deployedAt: string;
    author: string;
    project: string;
    description: string;
    avgInferenceTimeMs: number;
    errorRatePercent: number;
    dailyRequests: number;
    performance: PerformanceMetrics;
    resourceAllocation: {
        cpu: string;
        memory: string;
        gpu: string | null;
    };
}

export interface PlatformAlert {
    id: string;
    timestamp: string;
    severity: AlertSeverity;
    title: string;
    description: string;
    relatedModelId?: string;
}

export interface TrainingExperiment {
    id: string;
    modelName: string;
    startTime: string;
    durationMinutes: number;
    status: 'Running' | 'Completed' | 'Failed';
    hyperparameters: Record<string, any>;
    metrics: Partial<PerformanceMetrics>;
    datasetVersion: string;
}

export interface DataPipeline {
    id: string;
    name: string;
    status: PipelineStatus;
    lastRun: string;
    nextRun: string;
    avgDurationMinutes: number;
}

export interface ApiUsageDetailed {
    name: string;
    calls: number;
    errors: number;
    avgLatency: number;
}


// =================================================================
// 2. SVG ICONS (to avoid external dependencies)
// =================================================================

export const IconSpinner: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const IconCheckCircle: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const IconXCircle: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const IconExclamation: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const IconInfo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const IconChevronDown: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

// =================================================================
// 3. MOCK API AND DATA GENERATORS
// =================================================================

const MOCK_API_DELAY = 800; // ms

// --- Helper Functions for Data Generation ---
const getRandom = (min: number, max: number, decimals: number = 0) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

const subtractHours = (date: Date, hours: number) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - hours);
    return newDate;
};

// --- Data Generators ---

export const generateMockModels = (count: number): DeployedModel[] => {
    const models: DeployedModel[] = [];
    const modelNames = ['fraud-detection', 'product-recommender', 'churn-predictor', 'sentiment-analyzer', 'credit-scoring', 'risk-assessment', 'demand-forecasting'];
    const projects = ['Retail Banking', 'Wealth Management', 'Corporate Lending', 'Marketing'];
    const authors = ['Alice', 'Bob', 'Charlie', 'Diana'];
    for (let i = 0; i < count; i++) {
        const statusValues = Object.values(ModelStatus);
        const name = modelNames[i % modelNames.length];
        const version = `${getRandom(1, 5)}.${getRandom(0, 9)}.${getRandom(0, 20)}`;
        models.push({
            id: `model_${i + 1}_${Date.now()}`,
            name: `${name}`,
            version,
            status: statusValues[getRandom(0, statusValues.length - 1)],
            endpoint: `https://api.demobank.ai/v1/predict/${name}`,
            deployedAt: subtractHours(new Date(), getRandom(1, 500)).toISOString(),
            author: authors[getRandom(0, authors.length - 1)],
            project: projects[getRandom(0, projects.length - 1)],
            description: `This model predicts ${name.replace('-', ' ')} based on user transaction history and behavioral data.`,
            avgInferenceTimeMs: getRandom(50, 300),
            errorRatePercent: getRandom(0.1, 5, 2),
            dailyRequests: getRandom(10000, 500000),
            performance: {
                accuracy: getRandom(92, 99.5, 2),
                precision: getRandom(90, 99, 2),
                recall: getRandom(88, 98, 2),
                f1Score: getRandom(90, 99, 2),
                auc: getRandom(0.93, 0.99, 3),
                confusionMatrix: [
                    [getRandom(1000, 1200), getRandom(10, 50)],
                    [getRandom(20, 60), getRandom(800, 1000)]
                ]
            },
            resourceAllocation: {
                cpu: `${getRandom(1, 4)}c`,
                memory: `${getRandom(2, 16)}Gi`,
                gpu: i % 3 === 0 ? 'NVIDIA T4' : null,
            },
        });
    }
    return models;
};

export const generateMockAlerts = (count: number): PlatformAlert[] => {
    const alerts: PlatformAlert[] = [];
    const severityValues = Object.values(AlertSeverity);
    const titles = {
        [AlertSeverity.Critical]: ['High Latency Detected', 'Model Performance Degraded', 'High Error Rate'],
        [AlertSeverity.Warning]: ['Resource Usage High', 'New Version Deployment Failed', 'Data Skew Detected'],
        [AlertSeverity.Info]: ['Model Retraining Completed', 'New Model Deployed', 'System Maintenance Scheduled']
    };
    for (let i = 0; i < count; i++) {
        const severity = severityValues[getRandom(0, severityValues.length - 1)];
        const titleOptions = titles[severity];
        alerts.push({
            id: `alert_${i + 1}`,
            timestamp: subtractHours(new Date(), getRandom(0, 24)).toISOString(),
            severity,
            title: titleOptions[getRandom(0, titleOptions.length - 1)],
            description: `Detailed description for alert ${i + 1} regarding the event.`,
            relatedModelId: `model_${getRandom(1, 10)}`,
        });
    }
    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateMockResourceUsage = (points: number): ModelResourceUsage[] => {
    const data: ModelResourceUsage[] = [];
    const now = Date.now();
    for (let i = points - 1; i >= 0; i--) {
        data.push({
            timestamp: now - i * 60000, // one point per minute
            cpuPercent: getRandom(10, 85, 1),
            memoryMb: getRandom(512, 4096),
            gpuPercent: getRandom(5, 60, 1),
        });
    }
    return data;
};

export const generateMockLogs = (count: number): string[] => {
    const logs: string[] = [];
    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    for (let i = 0; i < count; i++) {
        const level = levels[getRandom(0, levels.length-1)];
        const timestamp = new Date(Date.now() - getRandom(0, 10000)).toISOString();
        logs.push(`${timestamp} [${level}] Request ID: ${Math.random().toString(36).substring(2, 10)} - Prediction processed in ${getRandom(50, 200)}ms.`);
    }
    return logs;
}

export const generateMockTrainingExperiments = (count: number): TrainingExperiment[] => {
    const experiments: TrainingExperiment[] = [];
    const modelNames = ['fraud-detection', 'product-recommender', 'churn-predictor'];
    const statuses: Array<'Running' | 'Completed' | 'Failed'> = ['Running', 'Completed', 'Failed'];
    for (let i = 0; i < count; i++) {
        const status = statuses[getRandom(0, statuses.length - 1)];
        experiments.push({
            id: `exp_${i + 1}`,
            modelName: `${modelNames[i % modelNames.length]}-v${getRandom(4, 6)}`,
            startTime: subtractHours(new Date(), getRandom(1, 72)).toISOString(),
            durationMinutes: status === 'Running' ? getRandom(10, 50) : getRandom(60, 240),
            status,
            hyperparameters: {
                learning_rate: getRandom(0.001, 0.01, 4),
                epochs: getRandom(50, 100),
                batch_size: 32,
            },
            metrics: {
                accuracy: status === 'Completed' ? getRandom(95, 99, 2) : undefined,
                f1Score: status === 'Completed' ? getRandom(94, 98, 2) : undefined,
            },
            datasetVersion: `ds_v${getRandom(5, 10)}_${new Date().getFullYear()}`,
        });
    }
    return experiments.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const generateMockDataPipelines = (count: number): DataPipeline[] => {
    const pipelines: DataPipeline[] = [];
    const names = ['User Transactions Ingest', 'Behavioral Data ETL', 'Feature Engineering', 'Data Validation'];
    const statuses = Object.values(PipelineStatus);
    for (let i = 0; i < count; i++) {
        pipelines.push({
            id: `pipe_${i + 1}`,
            name: names[i % names.length],
            status: statuses[getRandom(0, statuses.length - 1)],
            lastRun: subtractHours(new Date(), getRandom(1, 8)).toISOString(),
            nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
            avgDurationMinutes: getRandom(15, 90),
        });
    }
    return pipelines;
};

// --- Mock API Fetch Functions ---

const mockApi = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), MOCK_API_DELAY);
    });
};

export const fetchDashboardMetrics = () => mockApi({
    deployedModels: 12,
    apiCalls24h: 1_250_345,
    avgAccuracy: 96.3,
    avgInferenceTime: 125,
});

export const fetchDeployedModels = () => mockApi(generateMockModels(12));
export const fetchApiUsage = () => mockApi<ApiUsageDetailed[]>([
    { name: 'Fraud Detection', calls: 580000, errors: 120, avgLatency: 80 },
    { name: 'Product Recs', calls: 320000, errors: 45, avgLatency: 150 },
    { name: 'Churn Prediction', calls: 210000, errors: 88, avgLatency: 110 },
    { name: 'Credit Scoring', calls: 140000, errors: 12, avgLatency: 200 },
]);
export const fetchModelPerformanceHistory = () => mockApi(
    Array.from({ length: 12 }, (_, i) => ({
        name: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
        accuracy: getRandom(92, 96, 1),
        f1Score: getRandom(90, 95, 1),
    }))
);
export const fetchAlerts = () => mockApi(generateMockAlerts(8));
export const fetchResourceUsage = () => mockApi(generateMockResourceUsage(60));
export const fetchLogs = () => mockApi(generateMockLogs(1));
export const fetchTrainingExperiments = () => mockApi(generateMockTrainingExperiments(5));
export const fetchDataPipelines = () => mockApi(generateMockDataPipelines(4));


// =================================================================
// 4. CUSTOM HOOKS
// =================================================================

export function useMockApi<T>(fetcher: () => Promise<T>, deps: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        fetcher()
            .then(result => {
                if (isMounted) setData(result);
            })
            .catch(err => {
                if (isMounted) setError(err);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, deps);

    return { data, isLoading, error };
}

export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

// =================================================================
// 5. REUSABLE UI COMPONENTS
// =================================================================

export const LoadingOverlay: React.FC = () => (
    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10">
        <IconSpinner className="w-8 h-8 text-white" />
    </div>
);

export const StatusBadge: React.FC<{ status: ModelStatus | PipelineStatus }> = ({ status }) => {
    const styles: Record<string, string> = {
        [ModelStatus.Online]: 'bg-green-500/20 text-green-300',
        [ModelStatus.Scaling]: 'bg-cyan-500/20 text-cyan-300',
        [ModelStatus.Offline]: 'bg-gray-500/20 text-gray-300',
        [ModelStatus.Error]: 'bg-red-500/20 text-red-300',
        [ModelStatus.Deploying]: 'bg-blue-500/20 text-blue-300 animate-pulse',
        [ModelStatus.Training]: 'bg-purple-500/20 text-purple-300 animate-pulse',
        [PipelineStatus.Running]: 'bg-blue-500/20 text-blue-300 animate-pulse',
        [PipelineStatus.Completed]: 'bg-green-500/20 text-green-300',
        [PipelineStatus.Failed]: 'bg-red-500/20 text-red-300',
        [PipelineStatus.Pending]: 'bg-yellow-500/20 text-yellow-300',
    };
    return <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[status]}`}>{status}</span>;
};

export const AlertItem: React.FC<{ alert: PlatformAlert }> = ({ alert }) => {
    const icons = {
        [AlertSeverity.Critical]: <IconExclamation className="w-5 h-5 text-red-400" />,
        [AlertSeverity.Warning]: <IconExclamation className="w-5 h-5 text-yellow-400" />,
        [AlertSeverity.Info]: <IconInfo className="w-5 h-5 text-blue-400" />,
    };
    const colors = {
        [AlertSeverity.Critical]: 'border-red-500/50',
        [AlertSeverity.Warning]: 'border-yellow-500/50',
        [AlertSeverity.Info]: 'border-blue-500/50',
    }

    return (
        <div className={`flex items-start p-3 space-x-3 border-l-4 ${colors[alert.severity]} bg-gray-900/30 rounded-r-md`}>
            <div>{icons[alert.severity]}</div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-white">{alert.title}</p>
                <p className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
        </div>
    );
};

export const AIPlatformHeader: React.FC = () => (
    <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank AI Platform</h2>
        <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-md text-gray-300">
                <span>Last 30 Days</span>
                <IconChevronDown className="w-4 h-4" />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow-lg transition-colors duration-200">
                Deploy New Model
            </button>
        </div>
    </div>
);

export const AIInsightAdvisor: React.FC = () => {
    const insights = [
        { id: 1, text: "Model 'fraud-detection' precision dropped by 2%. Consider retraining with the latest 'Q2_Transactions' dataset.", severity: 'Warning' },
        { id: 2, text: "API usage for 'Product Recs' increased by 35% week-over-week. Provision additional resources to maintain low latency.", severity: 'Info' },
        { id: 3, text: "'churn-predictor' is approaching 90% resource utilization. Enable auto-scaling to prevent outages.", severity: 'Critical' },
    ];

    const getIcon = (severity: string) => {
        if (severity === 'Critical') return <IconExclamation className="w-5 h-5 text-red-400" />;
        if (severity === 'Warning') return <IconExclamation className="w-5 h-5 text-yellow-400" />;
        return <IconInfo className="w-5 h-5 text-blue-400" />;
    };

    return (
        <Card title="AI-Powered Insights">
             <div className="space-y-4 h-full">
                {insights.map(insight => (
                    <div key={insight.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 pt-1">{getIcon(insight.severity)}</div>
                        <p className="text-sm text-gray-300">{insight.text}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const TrainingPipelinesPanel: React.FC = () => {
    const { data: experiments, isLoading } = useMockApi(fetchTrainingExperiments);
    const getStatusIcon = (status: 'Running' | 'Completed' | 'Failed') => {
        if (status === 'Running') return <IconSpinner className="w-4 h-4 text-blue-400" />;
        if (status === 'Completed') return <IconCheckCircle className="w-4 h-4 text-green-400" />;
        return <IconXCircle className="w-4 h-4 text-red-400" />;
    };
    return (
        <Card title="Recent Training Experiments">
            <div className="relative" style={{ height: 300 }}>
                {isLoading && <LoadingOverlay />}
                <div className="space-y-3 overflow-y-auto h-full pr-2">
                    {experiments?.map(exp => (
                        <div key={exp.id} className="bg-gray-900/30 p-3 rounded-md">
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-sm text-white">{exp.modelName}</span>
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                    {getStatusIcon(exp.status)}
                                    <span>{exp.status}</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Started: {new Date(exp.startTime).toLocaleDateString()} | Duration: {exp.durationMinutes} min
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export const DataPipelinesPanel: React.FC = () => {
    const { data: pipelines, isLoading } = useMockApi(fetchDataPipelines);
    return (
        <Card title="Data Pipelines">
            <div className="relative" style={{ height: 300 }}>
                {isLoading && <LoadingOverlay />}
                <div className="space-y-3 overflow-y-auto h-full pr-2">
                    {pipelines?.map(pipe => (
                        <div key={pipe.id} className="bg-gray-900/30 p-3 rounded-md">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-white">{pipe.name}</span>
                                <StatusBadge status={pipe.status} />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Last Run: {new Date(pipe.lastRun).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export const AIPlatformAlertsPanel: React.FC = () => {
    const { data: alerts, isLoading } = useMockApi(fetchAlerts);
    return (
        <Card title="Recent Alerts">
            <div className="relative" style={{ height: "100%" }}>
                {isLoading && <LoadingOverlay />}
                {alerts?.length ? (
                    <div className="overflow-y-auto h-full pr-2 space-y-3">
                        {alerts.slice(0, 5).map(alert => <AlertItem key={alert.id} alert={alert} />)}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <IconCheckCircle className="w-6 h-6 mr-2" />
                        No recent alerts.
                    </div>
                )}
            </div>
        </Card>
    );
};

export const AIPlatformModelsTable: React.FC<{ onSelectModel: (model: DeployedModel) => void }> = ({ onSelectModel }) => {
    const { data: models, isLoading } = useMockApi(fetchDeployedModels);
    const [sortConfig, setSortConfig] = useState<{ key: keyof DeployedModel; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });

    const sortedModels = useMemo(() => {
        if (!models) return [];
        let sortableItems = [...models];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [models, sortConfig]);

    const requestSort = (key: keyof DeployedModel) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof DeployedModel) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };
    
    return (
        <Card title="Deployed Models">
            <div className="relative">
                {isLoading && <LoadingOverlay />}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                {(['name', 'version', 'status', 'project', 'deployedAt', 'avgInferenceTimeMs'] as const).map((key) => (
                                    <th scope="col" className="px-6 py-3 cursor-pointer" key={key} onClick={() => requestSort(key)}>
                                        <div className="flex items-center">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} 
                                            <span className="ml-1">{getSortIndicator(key)}</span>
                                        </div>
                                    </th>
                                ))}
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedModels.map(model => (
                                <tr key={model.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-mono text-white">{model.name}</td>
                                    <td className="px-6 py-4 font-mono">{model.version}</td>
                                    <td className="px-6 py-4"><StatusBadge status={model.status} /></td>
                                    <td className="px-6 py-4">{model.project}</td>
                                    <td className="px-6 py-4">{new Date(model.deployedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{model.avgInferenceTimeMs.toFixed(0)} ms</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => onSelectModel(model)} className="font-medium text-blue-400 hover:underline">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
};

export const AIPlatformModelDetailsModal: React.FC<{ model: DeployedModel | null; onClose: () => void }> = ({ model, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!model) return null;

    const tabs = ['overview', 'performance', 'resources', 'logs'];

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-md" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white font-mono">{model.name} <span className="text-base text-gray-400 font-normal">v{model.version}</span></h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="flex-shrink-0 border-b border-gray-700">
                    <nav className="flex space-x-4 px-4">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-2 text-sm font-medium rounded-t-md capitalize ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-6 overflow-y-auto">
                    {activeTab === 'overview' && <ModelOverviewTab model={model} />}
                    {activeTab === 'performance' && <ModelPerformanceTab model={model} />}
                    {activeTab === 'resources' && <ModelResourcesTab />}
                    {activeTab === 'logs' && <ModelLogsTab />}
                </div>
            </div>
        </div>
    );
};


export const ModelOverviewTab: React.FC<{model: DeployedModel}> = ({ model }) => (
    <div className="text-gray-300 space-y-4">
        <p className="text-base">{model.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            <div><strong className="block text-gray-500 text-sm">Version</strong><span className="font-mono">{model.version}</span></div>
            <div><strong className="block text-gray-500 text-sm">Author</strong><span>{model.author}</span></div>
            <div><strong className="block text-gray-500 text-sm">Project</strong><span>{model.project}</span></div>
            <div><strong className="block text-gray-500 text-sm">Deployed At</strong><span>{new Date(model.deployedAt).toLocaleString()}</span></div>
            <div><strong className="block text-gray-500 text-sm">Daily Requests</strong><span>{model.dailyRequests.toLocaleString()}</span></div>
            <div>
                <strong className="block text-gray-500 text-sm">Endpoint</strong>
                <input type="text" readOnly value={model.endpoint} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs font-mono mt-1" />
            </div>
        </div>
    </div>
);


export const ModelPerformanceTab: React.FC<{model: DeployedModel}> = ({ model }) => {
    const { performance } = model;
    const pieData = [
        { name: 'Precision', value: performance.precision },
        { name: 'Recall', value: performance.recall },
        { name: 'F1 Score', value: performance.f1Score },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{performance.accuracy}%</div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{performance.precision}%</div>
                    <div className="text-sm text-gray-400">Precision</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-teal-400">{performance.recall}%</div>
                    <div className="text-sm text-gray-400">Recall</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{performance.f1Score}%</div>
                    <div className="text-sm text-gray-400">F1 Score</div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Confusion Matrix</h4>
                    <table className="w-full text-center text-white">
                        <thead>
                            <tr>
                                <th></th>
                                <th className="font-normal text-gray-400 p-2">Predicted Negative</th>
                                <th className="font-normal text-gray-400 p-2">Predicted Positive</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="font-normal text-gray-400 p-2 text-right">Actual Negative</th>
                                <td className="bg-green-500/20 p-4 rounded">{performance.confusionMatrix[0][0]}</td>
                                <td className="bg-red-500/20 p-4 rounded">{performance.confusionMatrix[0][1]}</td>
                            </tr>
                             <tr>
                                <th className="font-normal text-gray-400 p-2 text-right">Actual Positive</th>
                                <td className="bg-red-500/20 p-4 rounded">{performance.confusionMatrix[1][0]}</td>
                                <td className="bg-green-500/20 p-4 rounded">{performance.confusionMatrix[1][1]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                 <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Key Metrics Distribution</h4>
                    <ResponsiveContainer width="100%" height={200}>
                         <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export const ModelResourcesTab: React.FC = () => {
    const { data, isLoading } = useMockApi(fetchResourceUsage, []);
    
    return (
        <div className="space-y-4 relative">
             {isLoading && <LoadingOverlay />}
            <h4 className="text-lg font-semibold text-white">Resource Utilization (Last 60 mins)</h4>
             <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data ?? []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleTimeString()} stroke="#9ca3af" fontSize={12} />
                    <YAxis yAxisId="left" unit="%" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" unit="MB" stroke="#82ca9d" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="cpuPercent" name="CPU" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area yAxisId="left" type="monotone" dataKey="gpuPercent" name="GPU" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                    <Area yAxisId="right" type="monotone" dataKey="memoryMb" name="Memory" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export const ModelLogsTab: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isLive, setIsLive] = useState(true);
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLogs(generateMockLogs(20));
    }, []);

    useInterval(() => {
        if(isLive) {
            fetchLogs().then(newLogs => {
                setLogs(prev => [...prev.slice(-100), ...newLogs]); // Keep last 100 logs
                if (logContainerRef.current) {
                    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
                }
            });
        }
    }, 2000);

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-white">Live Inference Logs</h4>
                <button onClick={() => setIsLive(!isLive)} className={`px-3 py-1 text-xs rounded ${isLive ? 'bg-red-600' : 'bg-green-600'} text-white`}>
                    {isLive ? 'Pause' : 'Resume'}
                </button>
            </div>
            <div ref={logContainerRef} className="bg-black text-white font-mono text-xs p-4 rounded-lg h-80 overflow-y-scroll">
                {logs.map((log, i) => (
                    <div key={i} className={log.includes('ERROR') ? 'text-red-400' : log.includes('WARN') ? 'text-yellow-400' : 'text-gray-300'}>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/90 p-2 border border-gray-600 rounded">
        <p className="label text-gray-300">{`${label}`}</p>
        {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.color }}>
                {`${pld.name}: ${pld.value.toLocaleString()}${pld.unit || ''}`}
            </p>
        ))}
      </div>
    );
  }
  return null;
};


// =================================================================
// 6. MAIN VIEW COMPONENT - ENHANCED
// =================================================================

const DemoBankAIPlatformView: React.FC = () => {
    const { data: dashboardMetrics, isLoading: metricsLoading } = useMockApi(fetchDashboardMetrics);
    const { data: performanceData, isLoading: performanceLoading } = useMockApi(fetchModelPerformanceHistory);
    const { data: apiData, isLoading: apiLoading } = useMockApi(fetchApiUsage);
    const [selectedModel, setSelectedModel] = useState<DeployedModel | null>(null);

    const formatNumber = (num: number | undefined) => {
        if (num === undefined) return <IconSpinner className="w-6 h-6 inline-block" />;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
        return num.toString();
    };

    const handleCloseModal = useCallback(() => {
        setSelectedModel(null);
    }, []);

    const handleSelectModel = useCallback((model: DeployedModel) => {
        setSelectedModel(model);
    }, []);

    return (
        <div className="space-y-6">
            <AIPlatformHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                    <p className="text-3xl font-bold text-white">{metricsLoading ? <IconSpinner className="w-8 h-8 mx-auto" /> : dashboardMetrics?.deployedModels}</p>
                    <p className="text-sm text-gray-400 mt-1">Deployed Models</p>
                </Card>
                <Card className="text-center">
                    <p className="text-3xl font-bold text-white">{formatNumber(dashboardMetrics?.apiCalls24h)}</p>
                    <p className="text-sm text-gray-400 mt-1">API Calls (24h)</p>
                </Card>
                <Card className="text-center">
                    <p className="text-3xl font-bold text-white">{metricsLoading ? <IconSpinner className="w-8 h-8 mx-auto" /> : `${dashboardMetrics?.avgAccuracy}%`}</p>
                    <p className="text-sm text-gray-400 mt-1">Avg. Model Accuracy</p>
                </Card>
                <Card className="text-center">
                    <p className="text-3xl font-bold text-white">{metricsLoading ? <IconSpinner className="w-8 h-8 mx-auto" /> : `${dashboardMetrics?.avgInferenceTime}ms`}</p>
                    <p className="text-sm text-gray-400 mt-1">Avg. Inference Time</p>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Primary Model Performance Over Time">
                    <div className="relative">
                        {performanceLoading && <LoadingOverlay />}
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={performanceData ?? []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" domain={[90, 100]} unit="%" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" strokeWidth={2} name="Accuracy" />
                                <Line type="monotone" dataKey="f1Score" stroke="#8884d8" strokeWidth={2} name="F1 Score" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card title="API Usage & Latency">
                    <div className="relative">
                        {apiLoading && <LoadingOverlay />}
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={apiData ?? []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                <XAxis type="number" stroke="#9ca3af" />
                                <YAxis type="category" dataKey="name" stroke="#9ca3af" width={120} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="calls" fill="#8884d8" name="API Calls" />
                                <Bar dataKey="avgLatency" fill="#82ca9d" name="Avg Latency (ms)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <TrainingPipelinesPanel />
                 <DataPipelinesPanel />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AIInsightAdvisor />
                </div>
                <AIPlatformAlertsPanel />
            </div>

            <AIPlatformModelsTable onSelectModel={handleSelectModel} />
            
            <AIPlatformModelDetailsModal model={selectedModel} onClose={handleCloseModal} />

        </div>
    );
};

export default DemoBankAIPlatformView;