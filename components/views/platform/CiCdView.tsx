// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/CiCdView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast, Toaster } from 'react-hot-toast';
import { FileCode, GitBranch, GitCommit, User, Clock, Calendar, Shield, TestTube2, Server, Search, ChevronDown, ChevronUp, Star, Settings, Play, AlertCircle, X, CheckCircle, BrainCircuit, Bot } from 'lucide-react';

import Card from '../../Card';

// --- TYPES AND INTERFACES ---
// Comprehensive type definitions for a real-world, enterprise-grade CI/CD system.

export type BuildStatus = 'success' | 'failed' | 'running' | 'queued' | 'cancelled' | 'pending' | 'manual';

export type JobStatus = BuildStatus;

export type StageStatus = BuildStatus;

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
}

export interface Commit {
  sha: string;
  message: string;
  author: UserProfile;
  timestamp: string;
  url: string;
}

export interface Artifact {
  id: string;
  name: string;
  size: number; // in bytes
  url: string;
  expiresAt: string;
  mimeType: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'TRACE';
  message: string;
  context?: Record<string, any>;
}

export interface TestReport {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number; // in seconds
    suites: TestSuite[];
}

export interface TestSuite {
    name: string;
    total: number;
    passed: number;
    failed: number;
    cases: TestCase[];
}

export interface TestCase {
    name: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number; // in ms
    errorMessage?: string;
}

export interface SecurityVulnerability {
    id: string;
    cveId?: string;
    packageName: string;
    version: string;
    severity: Severity;
    description: string;
    remediation: string;
    url: string;
}

export interface CostAnalysis {
    computeCost: number; // in USD
    storageCost: number; // in USD
    totalCost: number; // in USD
    currency: 'USD';
}

export interface Environment {
    name: string;
    url: string;
    region: string;
    status: 'healthy' | 'degraded' | 'down';
}

export interface Deployment {
    id: string;
    environment: Environment;
    status: 'success' | 'failed' | 'in_progress';
    deployedAt: string;
    buildId: number;
    version: string;
}

export interface Job {
  id: number;
  name: string;
  status: JobStatus;
  startedAt?: string;
  finishedAt?: string;
  logs: LogEntry[];
  artifacts: Artifact[];
  testReport?: TestReport;
  vulnerabilities?: SecurityVulnerability[];
  cost?: CostAnalysis;
  allowFailure: boolean;
}

export interface Stage {
  id: number;
  name: string;
  status: StageStatus;
  jobs: Job[];
  startedAt?: string;
  finishedAt?: string;
}

export interface Build {
  id: number;
  buildNumber: number;
  pipelineId: string;
  status: BuildStatus;
  triggeredBy: UserProfile;
  triggerType: 'commit' | 'manual' | 'scheduled';
  commit: Commit;
  branch: string;
  stages: Stage[];
  startedAt: string;
  finishedAt?: string;
  duration: number; // in seconds
  artifacts: Artifact[];
  deploymentHistory: Deployment[];
  coverage?: number; // 0-100
  cost?: CostAnalysis;
}

export interface Pipeline {
  id: string;
  name: string;
  repository: string;
  description: string;
  lastBuild?: Build;
  buildHistory: Build[];
  avgDuration: number; // in seconds
  successRate: number; // 0-1
  lastTriggered: string;
  isFavorite: boolean;
  tags: string[];
  owner: UserProfile;
  deploymentFrequency: number; // per day
}

export interface AIInsight {
    id: string;
    type: 'performance' | 'reliability' | 'cost' | 'security';
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
    recommendation: string;
    relatedEntity: {
        type: 'pipeline' | 'job' | 'build';
        id: string | number;
    };
}

export type SortablePipelineKeys = 'name' | 'lastTriggered' | 'avgDuration' | 'successRate';
export type SortDirection = 'asc' | 'desc';

// --- CONSTANTS ---
// Centralized constants for styling, configuration, and icons.

export const STATUS_DETAILS: { [key in BuildStatus]: { color: string; bgColor: string; text: string; icon: React.ComponentType<any> } } = {
    success: { color: 'text-green-400', bgColor: 'bg-green-900/50', text: 'Success', icon: CheckCircle },
    failed: { color: 'text-red-400', bgColor: 'bg-red-900/50', text: 'Failed', icon: X },
    running: { color: 'text-blue-400', bgColor: 'bg-blue-900/50', text: 'Running', icon: Play },
    queued: { color: 'text-yellow-400', bgColor: 'bg-yellow-900/50', text: 'Queued', icon: Clock },
    cancelled: { color: 'text-gray-400', bgColor: 'bg-gray-700/50', text: 'Cancelled', icon: AlertCircle },
    pending: { color: 'text-gray-500', bgColor: 'bg-gray-800/50', text: 'Pending', icon: Clock },
    manual: { color: 'text-indigo-400', bgColor: 'bg-indigo-900/50', text: 'Manual', icon: User },
};

export const SEVERITY_COLORS: { [key in Severity]: string } = {
    Critical: 'bg-red-700',
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500',
    Info: 'bg-gray-500',
};


// --- MOCK DATA GENERATION ---
// Simulates a realistic data source for the CI/CD dashboard.

const MOCK_USERS: UserProfile[] = [
    { id: 'u1', name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=alice', email: 'alice.j@example.corp' },
    { id: 'u2', name: 'Bob Williams', avatarUrl: 'https://i.pravatar.cc/150?u=bob', email: 'bob.w@example.corp' },
    { id: 'u3', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=charlie', email: 'charlie.b@example.corp' },
    { id: 'u4', name: 'Diana Prince', avatarUrl: 'https://i.pravatar.cc/150?u=diana', email: 'diana.p@example.corp' },
];

const MOCK_COMMIT_MESSAGES = [
    'feat: Implement user authentication service with JWT', 'fix: Correct layout issue on mobile dashboard view', 'docs: Update README with comprehensive setup instructions', 'refactor: Simplify API data fetching logic using TanStack Query', 'chore: Upgrade dependencies to latest versions for security compliance', 'test: Add e2e tests for payment processing workflow', 'revert: Revert previous commit due to critical production bug', 'style: Format entire codebase with Prettier and ESLint',
];

const MOCK_PACKAGES = ['react', 'express', 'lodash', 'moment', 'next', 'vite', 'postgres', 'redis'];
const MOCK_VULN_DESCRIPTIONS = [
    'Cross-site scripting (XSS) vulnerability in package', 'Denial of service (DoS) vulnerability', 'Prototype pollution in utility function', 'Insecure default configuration allows remote code execution',
];

const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number): number => Math.random() * (max - min) + min;

const generateMockVulnerabilities = (count: number): SecurityVulnerability[] => Array.from({ length: count }, (_, i) => ({
    id: `vuln-${i}-${Date.now()}`,
    cveId: `CVE-2023-${randomInt(10000, 50000)}`,
    packageName: randomElement(MOCK_PACKAGES),
    version: `${randomInt(1, 5)}.${randomInt(0, 10)}.${randomInt(0, 20)}`,
    severity: randomElement(['Critical', 'High', 'Medium', 'Low']),
    description: randomElement(MOCK_VULN_DESCRIPTIONS),
    remediation: 'Upgrade package to version > 6.0.0',
    url: 'https://example.com/cve/CVE-2023-xxxxx',
}));

const generateMockTestReport = (): TestReport => {
    const total = randomInt(50, 200);
    const failed = randomInt(0, Math.floor(total * 0.1));
    const skipped = randomInt(0, Math.floor(total * 0.05));
    const passed = total - failed - skipped;
    return {
        total, passed, failed, skipped, duration: randomInt(60, 300),
        suites: [{ name: 'Unit Tests', total, passed, failed, cases: [] }] // Simplified for brevity
    };
};

export const generateMockData = (pipelineCount: number = 25, buildsPerPipeline: number = 50): Pipeline[] => {
    const pipelines: Pipeline[] = [];
    for (let i = 1; i <= pipelineCount; i++) {
        const buildHistory: Build[] = [];
        let totalDuration = 0;
        let successCount = 0;

        for (let j = 1; j <= buildsPerPipeline; j++) {
            const status: BuildStatus = randomElement(['success', 'success', 'success', 'failed', 'running', 'cancelled']);
            const user = randomElement(MOCK_USERS);
            const startedAt = new Date(Date.now() - (buildsPerPipeline - j) * 86400000 - randomInt(0, 80000000)).toISOString();
            
            const buildStageStatus = status === 'running' ? 'running' : 'success';
            const testStageStatus = status === 'running' ? 'running' : (Math.random() > 0.1 ? 'success' : 'failed');
            const deployStageStatus = status;

            const stages: Stage[] = [
                { id: 1, name: 'Build', status: buildStageStatus, jobs: [{ id: 1, name: 'Compile & Package', status: buildStageStatus, logs: [], artifacts: [{id: 'art-1', name: 'app.jar', size: 50 * 1024 * 1024, url: '#', expiresAt: '', mimeType: 'application/java-archive' }], allowFailure: false }] },
                { id: 2, name: 'Test', status: testStageStatus, jobs: [
                    { id: 2, name: 'Unit Tests', status: testStageStatus, logs: [], artifacts: [], testReport: generateMockTestReport(), allowFailure: false }, 
                    { id: 3, name: 'Security Scan', status: 'success', logs: [], artifacts: [], vulnerabilities: generateMockVulnerabilities(randomInt(0,5)), allowFailure: true }
                ]},
                { id: 3, name: 'Deploy', status: deployStageStatus, jobs: [{ id: 4, name: `Deploy to Staging`, status: deployStageStatus, logs: [], artifacts: [], allowFailure: false }] }
            ];

            let build: Build = {
                id: (i * 1000) + j,
                buildNumber: buildsPerPipeline - j + 1,
                pipelineId: `pipeline-${i}`,
                status: j === 1 && Math.random() > 0.5 ? 'running' : status,
                triggeredBy: user,
                triggerType: randomElement(['commit', 'manual', 'scheduled']),
                commit: {
                    sha: (Math.random() + 1).toString(36).substring(2, 9),
                    message: randomElement(MOCK_COMMIT_MESSAGES),
                    author: user,
                    timestamp: new Date(new Date(startedAt).getTime() - 3600000).toISOString(),
                    url: 'http://example.com/commit/sha'
                },
                branch: randomElement(['main', 'develop', 'feature/new-login-flow']),
                stages: stages,
                startedAt,
                duration: 0,
                artifacts: [],
                deploymentHistory: [],
                coverage: randomFloat(75, 98),
                cost: { computeCost: randomFloat(0.5, 5), storageCost: 0.1, totalCost: 0, currency: 'USD' }
            };
            
            if (build.status !== 'running' && build.status !== 'queued') {
                const duration = randomInt(120, 900);
                build.duration = duration;
                build.finishedAt = new Date(new Date(startedAt).getTime() + duration * 1000).toISOString();
                totalDuration += duration;
                if (build.status === 'success') {
                    successCount++;
                    build.deploymentHistory.push({
                        id: `dep-${build.id}`,
                        environment: {name: 'Production', url: 'https://prod.example.com', region: 'us-east-1', status: 'healthy'},
                        status: 'success',
                        deployedAt: build.finishedAt,
                        buildId: build.id,
                        version: `v1.${i}.${build.buildNumber}`
                    })
                }
            }
            if(build.cost) build.cost.totalCost = build.cost.computeCost + build.cost.storageCost;
            
            buildHistory.push(build);
        }

        pipelines.push({
            id: `pipeline-${i}`,
            name: `Project ${String.fromCharCode(64 + i)} Service`,
            repository: `corp-org/project-${String.fromCharCode(64 + i).toLowerCase()}`,
            description: `Manages the build and deployment for the Project ${String.fromCharCode(64 + i)} primary service.`,
            lastBuild: buildHistory[0],
            buildHistory: buildHistory,
            avgDuration: totalDuration / (buildsPerPipeline || 1),
            successRate: successCount / (buildsPerPipeline || 1),
            lastTriggered: buildHistory[0].startedAt,
            isFavorite: Math.random() > 0.8,
            tags: randomElement([['backend', 'java', 'critical'], ['frontend', 'react'], ['infra', 'terraform']]),
            owner: randomElement(MOCK_USERS),
            deploymentFrequency: randomFloat(0.5, 5)
        });
    }
    return pipelines;
};

const MOCK_PIPELINES = generateMockData();

// --- API SIMULATION ---
// This simulates fetching data from a backend API with artificial latency and AI interaction.

export const mockApi = {
    fetchPipelines: (): Promise<Pipeline[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_PIPELINES), 500));
    },
    fetchPipelineById: (id: string): Promise<Pipeline | undefined> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_PIPELINES.find(p => p.id === id)), 300));
    },
    fetchBuildById: (pipelineId: string, buildId: number): Promise<Build | undefined> => {
        const pipeline = MOCK_PIPELINES.find(p => p.id === pipelineId);
        const build = pipeline?.buildHistory.find(b => b.id === buildId);
        return new Promise(resolve => setTimeout(() => resolve(build), 400));
    },
    fetchJobLogs: (jobId: number): Promise<LogEntry[]> => {
        const logs: LogEntry[] = [];
        for (let i = 0; i < 500; i++) {
            logs.push({
                timestamp: new Date(Date.now() - (500 - i) * 100).toISOString(),
                level: randomElement(['INFO', 'INFO', 'INFO', 'DEBUG', 'WARN', 'ERROR']),
                message: `Log line ${i + 1}: ${randomElement(MOCK_COMMIT_MESSAGES)}`,
            });
        }
        return new Promise(resolve => setTimeout(() => resolve(logs), 600));
    },
    triggerPipelineRun: (pipelineId: string): Promise<Build> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const pipeline = MOCK_PIPELINES.find(p => p.id === pipelineId);
                if (!pipeline) return reject(new Error('Pipeline not found'));
                
                const newBuild: Build = {
                    id: Math.floor(Math.random() * 100000),
                    buildNumber: (pipeline.lastBuild?.buildNumber || 0) + 1,
                    pipelineId: pipeline.id,
                    status: 'queued',
                    triggeredBy: MOCK_USERS[0],
                    triggerType: 'manual',
                    commit: pipeline.lastBuild?.commit || { sha: 'abcdef', message: 'Manual trigger', author: MOCK_USERS[0], timestamp: new Date().toISOString(), url: '#' },
                    branch: pipeline.lastBuild?.branch || 'main',
                    stages: [],
                    startedAt: new Date().toISOString(),
                    duration: 0,
                    artifacts: [],
                    deploymentHistory: []
                };
                
                pipeline.buildHistory.unshift(newBuild);
                pipeline.lastBuild = newBuild;
                
                resolve(newBuild);
            }, 700);
        });
    },
    askAIForLogAnalysis: (logs: LogEntry[]): Promise<string> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const errorLogs = logs.filter(l => l.level === 'ERROR');
                if (errorLogs.length === 0) {
                    resolve("AI Analysis: The logs show no critical errors. The process seems to have completed successfully or was terminated gracefully.");
                    return;
                }
                const firstError = errorLogs[0].message;
                const analysis = `
### AI-Powered Log Analysis

**Summary:** The build failed due to a critical error during the compilation phase.

**Root Cause Identification:**
The primary error appears to be: \`${firstError}\`. 
This suggests a potential null pointer exception or a configuration issue in the database connection string.

**Suggested Remediation Steps:**
1.  **Verify Configuration:** Double-check the environment variables for database credentials (\`DB_HOST\`, \`DB_USER\`) in the CI/CD settings.
2.  **Code Review:** Examine the recent commit (\`a4f5c6d\`) for changes related to \`DatabaseConnection.java\`. Pay close attention to object initializations.
3.  **Increase Logging:** Add more detailed debug logging around the database connection logic to capture variable states before the error occurs.

**Further Insights:**
- There are multiple \`WARN\` level logs indicating deprecated API usage. While not critical, these should be addressed in a future sprint to maintain code health.
                `;
                resolve(analysis);
            }, 1500);
        });
    }
};

// --- UTILITY/HELPER FUNCTIONS ---
// Common functions used across multiple components.

export function formatDuration(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}

export function timeAgo(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "just now";
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
}

export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


// --- UI HELPER & ATOMIC COMPONENTS ---
// Small, reusable components that form the building blocks of the UI.

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-16 h-16' };
    return (
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizeClasses[size]}`}></div>
    );
};

export const StatusPill: React.FC<{ status: BuildStatus; showText?: boolean }> = ({ status, showText = true }) => {
    const details = STATUS_DETAILS[status] || STATUS_DETAILS.pending;
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${details.bgColor} ${details.color}`}>
            <details.icon className="h-4 w-4" />
            {showText && <span>{details.text}</span>}
        </div>
    );
};

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
    <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative text-center" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
        {onRetry && (
            <button onClick={onRetry} className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                Retry
            </button>
        )}
    </div>
);

export const Tooltip: React.FC<{ content: React.ReactNode; children: React.ReactNode }> = ({ content, children }) => (
    <div className="relative group flex items-center">
        {children}
        <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
            {content}
            <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
    </div>
);

export const Tab: React.FC<{ label: string; count?: number; isActive: boolean; onClick: () => void }> = ({ label, count, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out border-b-2 flex items-center gap-2
            ${isActive ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
    >
        {label}
        {count !== undefined && <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}>{count}</span>}
    </button>
);


// --- LARGER UI COMPONENTS ---
// More complex components that compose the different views of the dashboard.

export const AILogAnalyzer: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setAnalysis(null);
        mockApi.askAIForLogAnalysis(logs).then(res => {
            setAnalysis(res);
        }).finally(() => {
            setIsAnalyzing(false);
        });
    };
    
    return (
        <div className="my-4">
            <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">
                {isAnalyzing ? <LoadingSpinner size="sm" /> : <Bot size={16} />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Logs with AI'}
            </button>
            {isAnalyzing && <p className="text-indigo-300 mt-2">AI is processing logs. This may take a moment...</p>}
            {analysis && (
                 <div className="mt-4 p-4 bg-gray-800 border border-indigo-500 rounded-lg prose prose-invert prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
                 </div>
            )}
        </div>
    );
};


export const LogViewer: React.FC<{ jobId: number }> = ({ jobId }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoading(true);
        mockApi.fetchJobLogs(jobId)
            .then(data => setLogs(data))
            .catch(() => setError("Failed to fetch logs."))
            .finally(() => setIsLoading(false));
    }, [jobId]);
    
    useEffect(() => {
        if(logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);
    
    const filteredLogs = logs.filter(log => log.message.toLowerCase().includes(searchTerm.toLowerCase()));

    const getLogLineColor = (level: LogEntry['level']) => ({
        'ERROR': 'text-red-400', 'WARN': 'text-yellow-400', 'DEBUG': 'text-gray-500', 'TRACE': 'text-purple-400',
    }[level] || 'text-gray-300');

    return (
        <div className="bg-gray-900 rounded-lg p-4 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-white">Job Logs</h4>
                <input
                    type="text" placeholder="Search logs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-sm text-white" />
            </div>
            <div ref={logContainerRef} className="flex-grow overflow-y-auto font-mono text-xs bg-black p-2 rounded">
                {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                {error && <ErrorMessage message={error} />}
                {!isLoading && !error && filteredLogs.map((log, index) => (
                    <div key={index} className="flex hover:bg-gray-800">
                        <span className="text-gray-600 mr-4 select-none">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`mr-2 font-bold ${getLogLineColor(log.level)}`}>[{log.level}]</span>
                        <span className={getLogLineColor(log.level)}>{log.message}</span>
                    </div>
                ))}
            </div>
            <AILogAnalyzer logs={logs} />
        </div>
    );
};

export const BuildStagesView: React.FC<{ stages: Stage[] }> = ({ stages }) => {
    if (!stages || stages.length === 0) {
        return <div className="text-gray-400 text-center py-8">No stages have started for this build.</div>;
    }
    
    return (
        <div className="flex space-x-4 overflow-x-auto p-4">
            {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                    <div className="flex-shrink-0 w-72">
                        <Card title={stage.name}>
                            <div className="flex flex-col space-y-2">
                                <StatusPill status={stage.status} />
                                {stage.jobs.map(job => (
                                    <div key={job.id} className="bg-gray-800 p-2 rounded-md flex justify-between items-center">
                                        <span className="text-sm">{job.name}</span>
                                        <StatusPill status={job.status} showText={false} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    {index < stages.length - 1 && (
                        <div className="flex items-center">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const SecurityPanel: React.FC<{ vulnerabilities?: SecurityVulnerability[] }> = ({ vulnerabilities }) => {
    if (!vulnerabilities || vulnerabilities.length === 0) return <p className="text-gray-400 p-4">No vulnerabilities detected.</p>;
    return (
        <Card title="Security Vulnerabilities">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-400">
                        <th className="p-2">Severity</th><th className="p-2">Package</th><th className="p-2">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {vulnerabilities.map(vuln => (
                        <tr key={vuln.id} className="border-t border-gray-700">
                            <td className="p-2"><span className={`px-2 py-1 rounded-full text-xs text-white ${SEVERITY_COLORS[vuln.severity]}`}>{vuln.severity}</span></td>
                            <td className="p-2 font-mono">{vuln.packageName}@{vuln.version}</td>
                            <td className="p-2">{vuln.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

const TestResultsPanel: React.FC<{ report?: TestReport }> = ({ report }) => {
    if (!report) return <p className="text-gray-400 p-4">No test report available.</p>;
    const data = [
        { name: 'Passed', value: report.passed, fill: '#22c55e' },
        { name: 'Failed', value: report.failed, fill: '#ef4444' },
        { name: 'Skipped', value: report.skipped, fill: '#6b7280' },
    ];
    return (
        <Card title="Test Results">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p><strong>Total Tests:</strong> {report.total}</p>
                    <p className="text-green-400"><strong>Passed:</strong> {report.passed}</p>
                    <p className="text-red-400"><strong>Failed:</strong> {report.failed}</p>
                    <p className="text-gray-400"><strong>Skipped:</strong> {report.skipped}</p>
                    <p><strong>Duration:</strong> {formatDuration(report.duration)}</p>
                </div>
                <div style={{ width: '100%', height: 150 }}>
                    <ResponsiveContainer>
                        <BarChart data={data} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Bar dataKey="value" barSize={20} layout="vertical" stackId="a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};


export const BuildDetailsView: React.FC<{ pipelineId: string, buildId: number, onBack: () => void }> = ({ pipelineId, buildId, onBack }) => {
    const [build, setBuild] = useState<Build | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'stages' | 'logs' | 'tests' | 'security' | 'artifacts'>('stages');

    useEffect(() => {
        setIsLoading(true);
        mockApi.fetchBuildById(pipelineId, buildId)
            .then(data => data ? setBuild(data) : setError("Build not found."))
            .catch(() => setError("Failed to fetch build details."))
            .finally(() => setIsLoading(false));
    }, [pipelineId, buildId]);

    if (isLoading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
    if (error) return <ErrorMessage message={error} />;
    if (!build) return <div className="text-center p-8">Build data is unavailable.</div>;
    
    const allVulnerabilities = build.stages.flatMap(s => s.jobs.flatMap(j => j.vulnerabilities || []));
    const testReport = build.stages.flatMap(s => s.jobs).find(j => j.testReport)?.testReport;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <button onClick={onBack} className="text-blue-400 hover:text-blue-300 mb-2">&larr; Back to Pipeline</button>
                    <h2 className="text-3xl font-bold text-white">Build #{build.buildNumber}</h2>
                    <p className="text-gray-400">{build.commit.message}</p>
                </div>
                <StatusPill status={build.status} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <Card title="Details"><p><strong>Branch:</strong> {build.branch}</p><p><strong>Triggered By:</strong> {build.triggeredBy.name}</p><p><strong>Started:</strong> {timeAgo(build.startedAt)}</p><p><strong>Duration:</strong> {build.status === 'running' ? 'In progress...' : formatDuration(build.duration)}</p></Card>
                <Card title="Commit"><p><strong>SHA:</strong> <a href={build.commit.url} className="text-blue-400 hover:underline">{build.commit.sha}</a></p><p><strong>Author:</strong> {build.commit.author.name}</p><p><strong>Timestamp:</strong> {new Date(build.commit.timestamp).toLocaleString()}</p></Card>
                <div className="flex flex-col space-y-2"><button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Re-run Build</button><button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full">View Raw Logs</button></div>
            </div>

            <div>
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-4">
                        <Tab label="Stages" isActive={activeTab === 'stages'} onClick={() => setActiveTab('stages')} />
                        <Tab label="Logs" isActive={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
                        <Tab label="Tests" count={testReport?.total} isActive={activeTab === 'tests'} onClick={() => setActiveTab('tests')} />
                        <Tab label="Security" count={allVulnerabilities.length} isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                        <Tab label="Artifacts" isActive={activeTab === 'artifacts'} onClick={() => setActiveTab('artifacts')} />
                    </nav>
                </div>
                <div className="mt-4">
                    {activeTab === 'stages' && <BuildStagesView stages={build.stages} />}
                    {activeTab === 'logs' && <LogViewer jobId={build.stages[0]?.jobs[0]?.id || 1} />}
                    {activeTab === 'tests' && <TestResultsPanel report={testReport} />}
                    {activeTab === 'security' && <SecurityPanel vulnerabilities={allVulnerabilities} />}
                    {activeTab === 'artifacts' && <Card title="Build Artifacts"><p className="text-gray-400">No artifacts were produced.</p></Card>}
                </div>
            </div>
        </div>
    );
};


export const PipelineDetailsView: React.FC<{ pipelineId: string; onBack: () => void; onSelectBuild: (buildId: number) => void }> = ({ pipelineId, onBack, onSelectBuild }) => {
    const [pipeline, setPipeline] = useState<Pipeline | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTriggering, setIsTriggering] = useState(false);
    
    const fetchPipeline = useCallback(() => {
        setIsLoading(true);
        mockApi.fetchPipelineById(pipelineId)
            .then(data => data ? setPipeline(data) : setError("Pipeline not found."))
            .catch(() => setError("Failed to fetch pipeline details."))
            .finally(() => setIsLoading(false));
    }, [pipelineId]);
    
    useEffect(() => { fetchPipeline(); }, [fetchPipeline]);

    const handleTriggerRun = () => {
        setIsTriggering(true);
        toast.promise(
            mockApi.triggerPipelineRun(pipelineId),
            {
                loading: 'Triggering pipeline run...',
                success: () => {
                    setTimeout(fetchPipeline, 1000);
                    return 'Pipeline run queued successfully!';
                },
                error: (err) => `Error: ${err.message}`
            }
        ).finally(() => setIsTriggering(false));
    };

    if (isLoading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
    if (error) return <ErrorMessage message={error} onRetry={fetchPipeline} />;
    if (!pipeline) return <div className="text-center p-8">Pipeline data is unavailable.</div>;

    const chartData = pipeline.buildHistory.slice(0, 20).reverse().map(b => ({
        name: `#${b.buildNumber}`,
        duration: b.duration / 60, // in minutes
        success: b.status === 'success' ? 1 : 0
    }));

    return (
        <div className="space-y-6">
             <Toaster position="top-right" toastOptions={{ style: { background: '#333', color: '#fff' } }}/>
            <div className="flex items-start justify-between">
                <div>
                    <button onClick={onBack} className="text-blue-400 hover:text-blue-300 mb-2">&larr; All Pipelines</button>
                    <h2 className="text-3xl font-bold text-white">{pipeline.name}</h2>
                    <p className="text-gray-400">{pipeline.description}</p>
                    <a href={pipeline.repository} className="text-sm text-blue-400 hover:underline">{pipeline.repository}</a>
                </div>
                <button onClick={handleTriggerRun} disabled={isTriggering} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded flex items-center gap-2">
                    {isTriggering ? <LoadingSpinner size="sm" /> : <Play size={16} />} Trigger Run
                </button>
            </div>

            <Card title="Pipeline Analytics (Last 20 Builds)">
                <div style={{width: '100%', height: 250}}>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" />
                            <YAxis yAxisId="left" label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }} stroke="#a0aec0" />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="duration" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            
            <Card title="Build History">
                <table className="w-full text-left text-sm">
                    <thead className="text-gray-400 border-b border-gray-700">
                        <tr>
                            <th className="py-2 px-4">Status</th><th className="py-2 px-4">Build</th><th className="py-2 px-4">Commit</th><th className="py-2 px-4">Branch</th><th className="py-2 px-4">Duration</th><th className="py-2 px-4">Triggered</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {pipeline.buildHistory.map(build => (
                            <tr key={build.id} onClick={() => onSelectBuild(build.id)} className="hover:bg-gray-800/50 cursor-pointer">
                                <td className="py-3 px-4"><StatusPill status={build.status} /></td>
                                <td className="py-3 px-4"><div className="font-medium text-white">#{build.buildNumber}</div><div className="text-gray-400">by {build.triggeredBy.name}</div></td>
                                <td className="py-3 px-4"><div className="text-white truncate max-w-xs">{build.commit.message}</div><div className="text-gray-500 font-mono">{build.commit.sha}</div></td>
                                <td className="py-3 px-4 text-gray-300">{build.branch}</td>
                                <td className="py-3 px-4 text-gray-300">{formatDuration(build.duration)}</td>
                                <td className="py-3 px-4 text-gray-300">{timeAgo(build.startedAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const PipelineList: React.FC<{ pipelines: Pipeline[]; onSelectPipeline: (id: string) => void }> = ({ pipelines, onSelectPipeline }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelines.map(pipeline => (
                <div key={pipeline.id} onClick={() => onSelectPipeline(pipeline.id)} className="cursor-pointer">
                    <Card title={pipeline.name} isHoverable={true}>
                        <div className="space-y-3">
                            <p className="text-gray-400 text-sm h-10">{pipeline.description}</p>
                            {pipeline.lastBuild && <StatusPill status={pipeline.lastBuild.status} />}
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>Last run: {timeAgo(pipeline.lastTriggered)}</p>
                                <p>Avg Duration: {formatDuration(pipeline.avgDuration)}</p>
                                <p>Success Rate: {(pipeline.successRate * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export const CiCdDashboardMetrics: React.FC<{ pipelines: Pipeline[] }> = ({ pipelines }) => {
    const runningBuilds = pipelines.reduce((sum, p) => sum + (p.lastBuild?.status === 'running' ? 1 : 0), 0);
    const failedLast24h = pipelines.reduce((sum, p) => {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        return sum + p.buildHistory.filter(b => b.status === 'failed' && new Date(b.startedAt) > yesterday).length;
    }, 0);
    const overallSuccessRate = pipelines.length > 0 ? pipelines.reduce((sum, p) => sum + p.successRate, 0) / pipelines.length : 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card title="Total Pipelines"><p className="text-3xl font-bold">{pipelines.length}</p></Card>
            <Card title="Builds Running"><p className="text-3xl font-bold text-blue-400">{runningBuilds}</p></Card>
            <Card title="Failed (24h)"><p className="text-3xl font-bold text-red-400">{failedLast24h}</p></Card>
            <Card title="Avg. Success Rate"><p className="text-3xl font-bold text-green-400">{(overallSuccessRate * 100).toFixed(1)}%</p></Card>
        </div>
    );
};


// --- MAIN VIEW COMPONENT ---
// The primary component that orchestrates the entire CI/CD view.

const CiCdView: React.FC = () => {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [currentView, setCurrentView] = useState<'dashboard' | 'pipeline_details' | 'build_details'>('dashboard');
    const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
    const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortablePipelineKeys>('lastTriggered');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    useEffect(() => {
        setIsLoading(true);
        mockApi.fetchPipelines()
            .then(data => setPipelines(data))
            .catch(() => setError('Could not fetch pipeline data. Please try again later.'))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSelectPipeline = (pipelineId: string) => { setSelectedPipelineId(pipelineId); setCurrentView('pipeline_details'); };
    const handleSelectBuild = (buildId: number) => { setSelectedBuildId(buildId); setCurrentView('build_details'); };
    const handleBackToDashboard = () => { setSelectedPipelineId(null); setSelectedBuildId(null); setCurrentView('dashboard'); };
    const handleBackToPipeline = () => { setSelectedBuildId(null); setCurrentView('pipeline_details'); };

    const sortedAndFilteredPipelines = useMemo(() => {
        return pipelines
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.repository.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                let compareA = a[sortBy];
                let compareB = b[sortBy];
                if (sortBy === 'name') return sortDirection === 'asc' ? (compareA as string).localeCompare(compareB as string) : (compareB as string).localeCompare(compareA as string);
                return sortDirection === 'asc' ? (compareA as number) - (compareB as number) : (compareB as number) - (compareA as number);
            });
    }, [pipelines, searchTerm, sortBy, sortDirection]);

    const renderContent = () => {
        if (isLoading) return <div className="flex justify-center items-center p-20"><LoadingSpinner size="lg" /></div>;
        if (error) return <ErrorMessage message={error} />;
        
        switch (currentView) {
            case 'pipeline_details':
                return selectedPipelineId && <PipelineDetailsView pipelineId={selectedPipelineId} onBack={handleBackToDashboard} onSelectBuild={handleSelectBuild} />;
            case 'build_details':
                return selectedPipelineId && selectedBuildId && <BuildDetailsView pipelineId={selectedPipelineId} buildId={selectedBuildId} onBack={handleBackToPipeline} />;
            default:
                return (
                    <>
                        <p className="text-gray-400 mb-6">Monitor the status of all continuous integration and deployment pipelines across the organization.</p>
                        <CiCdDashboardMetrics pipelines={pipelines} />
                        <div className="mb-4 flex items-center justify-between">
                            <input
                                type="text" placeholder="Filter pipelines..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <PipelineList pipelines={sortedAndFilteredPipelines} onSelectPipeline={handleSelectPipeline} />
                    </>
                );
        }
    };

    return (
        <Card title="CI/CD Pipelines Dashboard">
            <div className="p-4 sm:p-6">
                {renderContent()}
            </div>
        </Card>
    );
};

export default CiCdView;