// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankQuantumServicesView.tsx
================================================================================

// components/views/platform/DemoBankQuantumServicesView.tsx
import React, { useState, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

// SECTION: Type Definitions for a Real-World Application

export type QubitState = [number, number]; // [alpha, beta] complex coefficients (represented as simple numbers for this demo)
export type QuantumRegister = QubitState[];
export type MeasurementResult = { [state: string]: number }; // e.g., { "001": 512, "101": 488 }

export type GateType = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CNOT' | 'CZ' | 'SWAP' | 'RX' | 'RY' | 'RZ' | 'U' | 'TOFFOLI';

export interface QuantumGate {
    id: string; // Unique ID for drag-and-drop
    type: GateType;
    target: number;
    control?: number;
    control2?: number; // For gates like Toffoli (CCNOT)
    theta?: number; // For rotation gates
    phi?: number;
    lambda?: number;
}

export interface QuantumCircuit {
    qubits: number;
    gates: QuantumGate[];
    measurements?: number[]; // Qubits to measure at the end
}

export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface QuantumJob {
    id: string;
    name: string;
    submittedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    status: JobStatus;
    backend: QuantumBackend;
    circuit: QuantumCircuit;
    shots: number;
    result?: JobResult;
    logs: string[];
    userId: string;
    parameters?: Record<string, any>; // For parameterized circuits
    tags?: string[];
    priority: 'LOW' | 'NORMAL' | 'HIGH';
}

export interface JobResult {
    counts: MeasurementResult;
    statevector?: number[]; // For simulator backends
    executionTimeMs: number;
    queueTimeMs: number;
    metadata: Record<string, any>;
    errorMitigation?: {
        method: string;
        applied: boolean;
        improvementFactor?: number;
    };
    aiSummary?: string;
}

export interface QuantumBackend {
    id: string;
    name: string;
    provider: string;
    type: 'SIMULATOR' | 'QUANTUM_COMPUTER';
    qubits: number;
    status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
    avgQueueTimeMs: number;
    basisGates: string[];
    connectivity: [number, number][]; // Qubit connection graph
    errorRates: {
        readout: number;
        singleQubitGate: number;
        cxGate: number;
    };
    calibrationData?: {
        lastCalibrated: string;
        t1_us?: number[];
        t2_us?: number[];
        [key: string]: any;
    };
    features: string[]; // e.g., 'Pulse-level control', 'Error suppression'
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    organization: string;
    apiKey: string;
    role: 'ADMIN' | 'RESEARCHER' | 'DEVELOPER';
    usage: {
        shotsUsed: number;
        shotsLimit: number;
        executionTimeUsedMs: number;
        executionTimeLimitMs: number;
        jobsSubmitted: number;
    };
    preferences: {
        theme: 'dark' | 'light';
        notifications: 'all' | 'mentions' | 'none';
    };
}

export interface QuantumAlgorithm {
    id: string;
    name: string;
    description: string;
    category: 'Optimization' | 'Simulation' | 'Cryptography' | 'Machine Learning';
    parameters: {
        name: string;
        type: 'number' | 'string' | 'list_of_numbers';
        description: string;
        defaultValue: any;
    }[];
    qasmTemplate: (params: Record<string, any>) => string;
}

// SECTION: Mock Data and Services

export const MOCK_USER: UserProfile = {
    id: 'user-123',
    name: 'Dr. Evelyn Reed',
    email: 'e.reed@demobank-research.com',
    organization: 'Demo Bank Quantum Research Division',
    apiKey: `dbq-live-${crypto.randomUUID()}`,
    role: 'ADMIN',
    usage: {
        shotsUsed: 1_250_800,
        shotsLimit: 10_000_000,
        executionTimeUsedMs: 3_600_000 * 5, // 5 hours
        executionTimeLimitMs: 3_600_000 * 50, // 50 hours
        jobsSubmitted: 137,
    },
    preferences: {
        theme: 'dark',
        notifications: 'all',
    }
};

export const MOCK_BACKENDS: QuantumBackend[] = [
    {
        id: 'dbq_simulator_high_perf',
        name: 'High-Performance Statevector Simulator',
        provider: 'Demo Bank Cloud',
        type: 'SIMULATOR',
        qubits: 128,
        status: 'ONLINE',
        avgQueueTimeMs: 50,
        basisGates: ['H', 'X', 'Y', 'Z', 'S', 'T', 'CNOT', 'CZ', 'SWAP', 'RX', 'RY', 'RZ', 'U'],
        connectivity: [], // Fully connected
        errorRates: { readout: 0, singleQubitGate: 0, cxGate: 0 },
        calibrationData: { lastCalibrated: new Date().toISOString(), details: "Ideal simulator, no calibration needed."},
        features: ['Statevector output', 'Parameterized circuits']
    },
    {
        id: 'dbq_osprey_qpu',
        name: 'Osprey Quantum Processor',
        provider: 'Demo Bank Labs',
        type: 'QUANTUM_COMPUTER',
        qubits: 64,
        status: 'ONLINE',
        avgQueueTimeMs: 25000,
        basisGates: ['X', 'SX', 'RZ', 'CNOT'],
        connectivity: Array.from({ length: 63 }, (_, i) => [i, i + 1] as [number, number]), // Linear chain for simplicity
        errorRates: { readout: 0.015, singleQubitGate: 0.0002, cxGate: 0.007 },
        calibrationData: { lastCalibrated: new Date(Date.now() - 3600*1000*2).toISOString(), t1_us: [75.3, 80.1, 72.4], t2_us: [50.1, 48.9, 52.3] },
        features: ['Error suppression', 'Mid-circuit measurement']
    },
    {
        id: 'dbq_condor_qpu',
        name: 'Condor Quantum Processor',
        provider: 'Demo Bank Labs',
        type: 'QUANTUM_COMPUTER',
        qubits: 128,
        status: 'MAINTENANCE',
        avgQueueTimeMs: 45000,
        basisGates: ['X', 'SX', 'RZ', 'CNOT'],
        connectivity: Array.from({ length: 127 }, (_, i) => [i, i + 1] as [number, number]),
        errorRates: { readout: 0.021, singleQubitGate: 0.0004, cxGate: 0.009 },
        calibrationData: { lastCalibrated: new Date(Date.now() - 3600*1000*24*3).toISOString(), reason: "Upgrading cryogenic systems." },
        features: ['High coherence', 'Pulse-level control']
    },
    {
        id: 'dbq_phoenix_qpu',
        name: 'Phoenix Annealing Processor',
        provider: 'Demo Bank Advanced Systems',
        type: 'QUANTUM_COMPUTER',
        qubits: 512,
        status: 'ONLINE',
        avgQueueTimeMs: 15000,
        basisGates: ['ISING'],
        connectivity: [], // Chimera graph, too complex to list
        errorRates: { readout: 0.05, singleQubitGate: 0, cxGate: 0 }, // Not applicable for annealers
        calibrationData: { lastCalibrated: new Date(Date.now() - 3600*1000*8).toISOString(), details: "Optimized for QUBO problems." },
        features: ['Quantum Annealing', 'Optimization problems']
    }
];

// A mock service to simulate a real quantum computing backend API
export class MockQuantumService {
    private jobs: QuantumJob[] = [];
    private backends: QuantumBackend[] = MOCK_BACKENDS;

    constructor() {
        // Pre-populate with some historical jobs
        for (let i = 0; i < 15; i++) {
            const status: JobStatus = i < 5 ? 'COMPLETED' : (i < 8 ? 'FAILED' : (i < 10 ? 'RUNNING' : 'QUEUED'));
            const submittedAt = new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 5);
            const job: QuantumJob = {
                id: `dbq-job-${crypto.randomUUID()}`,
                name: `Historical Job ${i + 1}`,
                submittedAt,
                status,
                backend: this.backends[Math.floor(Math.random() * this.backends.length)],
                circuit: { qubits: 2, gates: [{ id: 'g1', type: 'H', target: 0 }, { id: 'g2', type: 'CNOT', target: 1, control: 0 }] },
                shots: 1024,
                logs: [`Job created at ${submittedAt.toISOString()}`],
                userId: 'user-123',
                priority: 'NORMAL',
                tags: ['research', 'entanglement']
            };
            if (status === 'COMPLETED' || status === 'FAILED' || status === 'RUNNING') {
                const queueTime = 10000 + Math.random() * 5000;
                job.startedAt = new Date(submittedAt.getTime() + queueTime);
                job.logs.push(`Job started running at ${job.startedAt.toISOString()}`);

                if (status === 'COMPLETED' || status === 'FAILED') {
                    job.completedAt = new Date(job.startedAt.getTime() + 30000);
                    if (status === 'COMPLETED') {
                        job.result = {
                            counts: { '00': 501, '11': 523 },
                            executionTimeMs: 28500,
                            queueTimeMs: queueTime,
                            metadata: { info: "Simulated result" },
                            aiSummary: "The experiment successfully created a Bell state, showing strong correlation between qubits 0 and 1, indicative of quantum entanglement."
                        };
                        job.logs.push(`Job completed successfully.`);
                    } else {
                        job.logs.push(`Job failed due to a simulated decoherence error.`);
                    }
                }
            }
            this.jobs.push(job);
        }
        // Start processing the queue
        setInterval(this.processQueue.bind(this), 5000);
    }

    private processQueue() {
        const jobToRun = this.jobs.find(j => j.status === 'QUEUED');
        if (jobToRun) {
            const backend = this.backends.find(b => b.id === jobToRun.backend.id);
            if (backend && backend.status === 'ONLINE') {
                jobToRun.status = 'RUNNING';
                jobToRun.startedAt = new Date();
                jobToRun.logs.push(`[${new Date().toISOString()}] Job execution started on ${backend.name}.`);

                const executionTime = jobToRun.backend.avgQueueTimeMs + Math.random() * 5000;
                setTimeout(() => {
                    if (Math.random() > 0.1) { // 10% chance of failure
                        jobToRun.status = 'COMPLETED';
                        jobToRun.result = this.simulateResult(jobToRun.circuit, jobToRun.shots, backend);
                        jobToRun.logs.push(`[${new Date().toISOString()}] Execution successful. Results are available.`);
                    } else {
                        jobToRun.status = 'FAILED';
                        jobToRun.logs.push(`[${new Date().toISOString()}] ERROR: Simulated hardware calibration failure.`);
                    }
                    jobToRun.completedAt = new Date();
                }, executionTime);
            }
        }
    }

    private simulateResult(circuit: QuantumCircuit, shots: number, backend: QuantumBackend): JobResult {
        // This is a hyper-simplified "simulation" that vaguely respects error rates
        const finalState: { [key: string]: number } = {};
        const isBellState = circuit.gates.some(g => g.type === 'H') && circuit.gates.some(g => g.type === 'CNOT');
        
        for(let i = 0; i < shots; i++){
            let outcome = '00';
            if (isBellState) {
                // Ideal Bell state
                outcome = Math.random() > 0.5 ? '11' : '00';
                // Simulate readout error
                if (Math.random() < backend.errorRates.readout) {
                    const bitToFlip = Math.floor(Math.random() * 2);
                    const currentBit = outcome[bitToFlip];
                    outcome = outcome.substring(0, bitToFlip) + (currentBit === '0' ? '1' : '0') + outcome.substring(bitToFlip + 1);
                }
            }
            const paddedOutcome = outcome.padStart(circuit.qubits, '0');
            finalState[paddedOutcome] = (finalState[paddedOutcome] || 0) + 1;
        }
        return {
            counts: finalState,
            executionTimeMs: Math.random() * 10000 + 15000,
            queueTimeMs: backend.avgQueueTimeMs * (0.8 + Math.random() * 0.4),
            metadata: { simulation_method: 'mock_noisy_simulator', circuit_depth: circuit.gates.length, backend_id: backend.id },
            aiSummary: "The experimental results show a high probability of measuring |00> and |11>, consistent with the creation of an entangled Bell state. Minor deviations from the ideal 50/50 distribution are attributed to simulated device noise."
        };
    }

    async getBackends(): Promise<QuantumBackend[]> {
        return new Promise(resolve => setTimeout(() => resolve(this.backends), 500));
    }

    async getJobs(userId: string): Promise<QuantumJob[]> {
        return new Promise(resolve => setTimeout(() => resolve(this.jobs.filter(j => j.userId === userId).sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())), 300));
    }

    async getJob(jobId: string): Promise<QuantumJob | undefined> {
        return new Promise(resolve => setTimeout(() => resolve(this.jobs.find(j => j.id === jobId)), 100));
    }

    async submitJob(job: Omit<QuantumJob, 'id' | 'submittedAt' | 'status' | 'logs'>): Promise<QuantumJob> {
        return new Promise(resolve => {
            const newJob: QuantumJob = {
                ...job,
                id: `dbq-job-${crypto.randomUUID()}`,
                submittedAt: new Date(),
                status: 'QUEUED',
                logs: [`[${new Date().toISOString()}] Job submitted to queue for ${job.backend.name}.`],
            };
            this.jobs.unshift(newJob);
            resolve(newJob);
        });
    }
}

// Instantiate a single service for the component lifetime
export const quantumService = new MockQuantumService();


// SECTION: State Management (useReducer)

type AppState = {
    currentView: 'DASHBOARD' | 'DESIGNER' | 'JOBS' | 'HARDWARE' | 'ACCOUNT' | 'ALGORITHMS';
    jobs: QuantumJob[];
    backends: QuantumBackend[];
    selectedJobId: string | null;
    isLoading: boolean;
    error: string | null;
    designer: {
        prompt: string;
        generatedCircuit: QuantumCircuit | null;
        isGenerating: boolean;
        qasm: string;
        selectedBackendId: string;
        shots: number;
    };
    userProfile: UserProfile;
};

type AppAction =
    | { type: 'SET_VIEW'; payload: AppState['currentView'] }
    | { type: 'FETCH_DATA_START' }
    | { type: 'FETCH_DATA_SUCCESS'; payload: { jobs: QuantumJob[]; backends: QuantumBackend[] } }
    | { type: 'FETCH_DATA_FAILURE'; payload: string }
    | { type: 'UPDATE_JOBS'; payload: QuantumJob[] }
    | { type: 'SELECT_JOB'; payload: string | null }
    | { type: 'SET_DESIGNER_PROMPT'; payload: string }
    | { type: 'SET_DESIGNER_QASM'; payload: string }
    | { type: 'GENERATE_CIRCUIT_START' }
    | { type: 'GENERATE_CIRCUIT_SUCCESS'; payload: QuantumCircuit }
    | { type: 'GENERATE_CIRCUIT_FAILURE' }
    | { type: 'SET_DESIGNER_BACKEND'; payload: string }
    | { type: 'SET_DESIGNER_SHOTS'; payload: number }
    | { type: 'SUBMIT_JOB_SUCCESS'; payload: QuantumJob }
    | { type: 'UPDATE_API_KEY' };


const initialState: AppState = {
    currentView: 'DASHBOARD',
    jobs: [],
    backends: [],
    selectedJobId: null,
    isLoading: true,
    error: null,
    designer: {
        prompt: 'Create a Bell state on two qubits',
        generatedCircuit: null,
        isGenerating: false,
        qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[2];\nh q[0];\ncx q[0],q[1];\nmeasure q -> c;',
        selectedBackendId: MOCK_BACKENDS[0].id,
        shots: 1024,
    },
    userProfile: MOCK_USER,
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_VIEW':
            return { ...state, currentView: action.payload, selectedJobId: action.payload === 'JOBS' ? state.selectedJobId : null };
        case 'FETCH_DATA_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_DATA_SUCCESS':
            return { ...state, isLoading: false, jobs: action.payload.jobs, backends: action.payload.backends };
        case 'FETCH_DATA_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case 'UPDATE_JOBS':
            // A more robust way to update jobs to prevent re-ordering
            const newJobs = action.payload;
            const jobMap = new Map(state.jobs.map(job => [job.id, job]));
            newJobs.forEach(job => jobMap.set(job.id, job));
            const updatedJobs = Array.from(jobMap.values()).sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
            return { ...state, jobs: updatedJobs };
        case 'SELECT_JOB':
            return { ...state, selectedJobId: action.payload, currentView: 'JOBS' };
        case 'SET_DESIGNER_PROMPT':
            return { ...state, designer: { ...state.designer, prompt: action.payload } };
        case 'SET_DESIGNER_QASM':
             return { ...state, designer: { ...state.designer, qasm: action.payload } };
        case 'GENERATE_CIRCUIT_START':
            return { ...state, designer: { ...state.designer, isGenerating: true, generatedCircuit: null } };
        case 'GENERATE_CIRCUIT_SUCCESS':
            return { ...state, designer: { ...state.designer, isGenerating: false, generatedCircuit: action.payload } };
        case 'GENERATE_CIRCUIT_FAILURE':
            return { ...state, designer: { ...state.designer, isGenerating: false } };
        case 'SET_DESIGNER_BACKEND':
            return { ...state, designer: { ...state.designer, selectedBackendId: action.payload } };
        case 'SET_DESIGNER_SHOTS':
            return { ...state, designer: { ...state.designer, shots: action.payload } };
        case 'SUBMIT_JOB_SUCCESS':
            return { ...state, jobs: [action.payload, ...state.jobs] };
        case 'UPDATE_API_KEY':
            return { ...state, userProfile: { ...state.userProfile, apiKey: `dbq-live-${crypto.randomUUID()}` } };
        default:
            return state;
    }
}

// SECTION: Reusable UI Components

export const Icon: React.FC<{ path: string; className?: string }> = ({ path, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

export const ICONS = {
    dashboard: "M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375zM1.5 9.75v10.5c0 .621.504 1.125 1.125 1.125H21.375c.621 0 1.125-.504 1.125-1.125V9.75M8.25 12a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V12.75A.75.75 0 018.25 12zm3.75 0a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V12.75A.75.75 0 0112 12zm3.75 0a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V12.75A.75.75 0 0115.75 12z",
    designer: "M10.5 6h9.75M10.5 12.75h9.75M10.5 19.5h9.75M3.75 6a2.25 2.25 0 012.25-2.25h.008a2.25 2.25 0 012.25 2.25v.008a2.25 2.25 0 01-2.25 2.25h-.008a2.25 2.25 0 01-2.25-2.25v-.008zM3.75 12.75a2.25 2.25 0 012.25-2.25h.008a2.25 2.25 0 012.25 2.25v.008a2.25 2.25 0 01-2.25 2.25h-.008a2.25 2.25 0 01-2.25-2.25v-.008zM3.75 19.5a2.25 2.25 0 012.25-2.25h.008a2.25 2.25 0 012.25 2.25v.008a2.25 2.25 0 01-2.25 2.25h-.008a2.25 2.25 0 01-2.25-2.25v-.008z",
    jobs: "M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    hardware: "M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M12 4.5V3m0 18v-1.5m3.75-15H21M12 18.75V21m3.75-1.5H21m-18 0h1.5M4.5 5.25H3M12 3.75A8.25 8.25 0 003.75 12 8.25 8.25 0 0012 20.25a8.25 8.25 0 008.25-8.25A8.25 8.25 0 0012 3.75z",
    account: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
    algorithms: "M6.75 7.5a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9zM3.75 16.5a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zM3 3.75A2.25 2.25 0 015.25 1.5h13.5A2.25 2.25 0 0121 3.75v16.5A2.25 2.25 0 0118.75 22.5H5.25A2.25 2.25 0 013 20.25V3.75z",
    status_queued: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
    status_running: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L12 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L18.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.25 21.75l-.648-1.178a3.375 3.375 0 00-4.518-4.518L9.75 15l1.178-.648a3.375 3.375 0 004.518-4.518L16.25 9l.648 1.178a3.375 3.375 0 004.518 4.518L22.5 15l-1.178.648a3.375 3.375 0 00-4.518 4.518z",
    status_completed: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    status_failed: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
    info: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
};

export const AppSidebar: React.FC<{
    currentView: AppState['currentView'];
    onSetView: (view: AppState['currentView']) => void;
    user: UserProfile;
}> = ({ currentView, onSetView, user }) => {
    const navItems = [
        { id: 'DASHBOARD', label: 'Dashboard', icon: ICONS.dashboard },
        { id: 'DESIGNER', label: 'Circuit Designer', icon: ICONS.designer },
        { id: 'JOBS', label: 'Job Monitor', icon: ICONS.jobs },
        { id: 'HARDWARE', label: 'Hardware', icon: ICONS.hardware },
        { id: 'ALGORITHMS', label: 'Algorithm Library', icon: ICONS.algorithms },
        { id: 'ACCOUNT', label: 'Account', icon: ICONS.account },
    ];

    const NavButton = ({ id, label, icon }: { id: AppState['currentView'], label: string, icon: string }) => (
        <button
            onClick={() => onSetView(id)}
            className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                currentView === id
                    ? 'bg-cyan-600/80 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
        >
            <Icon path={icon} className="w-5 h-5 mr-4" />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="w-64 bg-gray-900/70 backdrop-blur-sm p-4 flex flex-col h-full rounded-lg border border-gray-700/50">
            <div className="flex items-center mb-8 px-2">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-gray-900 text-xl mr-3">Q</div>
                <h1 className="text-xl font-bold text-white tracking-wider">Quantum Cloud</h1>
            </div>
            <nav className="flex-grow space-y-2">
                {navItems.map(item => <NavButton key={item.id} id={item.id as AppState['currentView']} label={item.label} icon={item.icon} />)}
            </nav>
            <div className="mt-auto pt-4 border-t border-gray-700">
                 <div className="flex items-center p-2 rounded-lg bg-gray-800/50">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white text-lg">
                         {user.name.charAt(0)}
                     </div>
                     <div className="ml-3">
                         <p className="text-sm font-semibold text-white">{user.name}</p>
                         <p className="text-xs text-gray-400">{user.organization}</p>
                     </div>
                 </div>
            </div>
        </div>
    );
};


// SECTION: Feature Views

export const DashboardView: React.FC<{
    jobs: QuantumJob[];
    backends: QuantumBackend[];
    onSelectJob: (jobId: string) => void;
}> = ({ jobs, backends, onSelectJob }) => {
    const onlineBackends = backends.filter(b => b.status === 'ONLINE');
    const totalQubits = onlineBackends.reduce((sum, b) => sum + b.qubits, 0);
    const jobsInQueue = jobs.filter(j => j.status === 'QUEUED').length;
    const avgExecutionTime = jobs.length > 0
        ? jobs.filter(j => j.result).reduce((sum, j) => sum + j.result!.executionTimeMs, 0) / jobs.filter(j => j.result).length
        : 0;
    
    const recentJobs = jobs.slice(0, 5);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Platform Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">{totalQubits.toLocaleString()}</p><p className="text-sm text-gray-400 mt-1">Total Qubits Online</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{jobsInQueue}</p><p className="text-sm text-gray-400 mt-1">Jobs in Queue</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{(avgExecutionTime / 1000).toFixed(2)}s</p><p className="text-sm text-gray-400 mt-1">Avg. Execution Time</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Recent Quantum Jobs">
                    <ul className="space-y-3">
                        {recentJobs.map(job => (
                            <li key={job.id} onClick={() => onSelectJob(job.id)} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors">
                                <div>
                                    <p className="font-mono text-sm text-cyan-400">{job.name}</p>
                                    <p className="text-xs text-gray-400">{job.backend.name}</p>
                                </div>
                                <StatusBadge status={job.status} />
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card title="Hardware Status">
                     <ul className="space-y-3">
                        {backends.map(backend => (
                            <li key={backend.id} className="flex items-center justify-between p-2 rounded-lg">
                                <div>
                                    <p className="font-semibold text-white">{backend.name}</p>
                                    <p className="text-xs text-gray-400">{backend.qubits} Qubits ({backend.type})</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                    backend.status === 'ONLINE' ? 'bg-green-500/20 text-green-400' :
                                    backend.status === 'OFFLINE' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                    {backend.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export const CircuitDesigner: React.FC<{
    designerState: AppState['designer'];
    backends: QuantumBackend[];
    dispatch: React.Dispatch<AppAction>;
}> = ({ designerState, backends, dispatch }) => {
    const { prompt, generatedCircuit, isGenerating, qasm, selectedBackendId, shots } = designerState;
    const [activeTab, setActiveTab] = useState<'ai' | 'qasm'>('ai');

    const handleGenerate = useCallback(async () => {
        dispatch({ type: 'GENERATE_CIRCUIT_START' });
        try {
            // NOTE: In a real app, the API key would be securely managed.
            // Using a placeholder or environment variable is standard practice.
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "YOUR_API_KEY_HERE";
            if (apiKey === "YOUR_API_KEY_HERE") {
                 console.warn("Using placeholder API Key for Gemini. AI generation will be mocked.");
                 // Mock response for environments without an API key
                setTimeout(() => {
                    const mockCircuit: QuantumCircuit = {
                        qubits: 2,
                        gates: [
                            { id: 'g1', type: 'H', target: 0 },
                            { id: 'g2', type: 'CNOT', target: 1, control: 0 }
                        ],
                        measurements: [0, 1]
                    };
                    dispatch({ type: 'GENERATE_CIRCUIT_SUCCESS', payload: mockCircuit });
                }, 1500);
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const schema: any = {
                type: Type.OBJECT,
                properties: {
                    qubits: { type: Type.NUMBER, description: "Number of qubits required" },
                    gates: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING, description: "A unique string ID for the gate, e.g., 'g1', 'g2'" },
                                type: { type: Type.STRING, enum: ['H', 'X', 'Y', 'Z', 'S', 'T', 'CNOT', 'CZ', 'SWAP', 'RX', 'RY', 'RZ', 'U', 'TOFFOLI'] },
                                target: { type: Type.NUMBER, description: "The target qubit index, starting from 0" },
                                control: { type: Type.NUMBER, description: "Control qubit index, for controlled gates" },
                                control2: { type: Type.NUMBER, description: "Second control qubit for gates like Toffoli" },
                                theta: { type: Type.NUMBER, description: "Theta angle for rotation gates" }
                            },
                            required: ['id', 'type', 'target']
                        }
                    },
                    measurements: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Array of qubit indices to measure" }
                },
                required: ['qubits', 'gates']
            };
            const fullPrompt = `You are a quantum computing expert. Translate the following request into a quantum circuit JSON representation. A Bell state is H on q0, then CNOT with q0 as control and q1 as target. A GHZ state for 3 qubits is H on q0, then CNOT(0,1), then CNOT(0,2). Always include measurements for all qubits unless specified otherwise. Request: "${prompt}"`;
            const response = await ai.models.generateContent({ model: 'gemini-1.5-flash', contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            const parsedCircuit = JSON.parse(response.text) as QuantumCircuit;
            dispatch({ type: 'GENERATE_CIRCUIT_SUCCESS', payload: parsedCircuit });
        } catch (error) {
            console.error("AI Circuit Generation Error:", error);
            dispatch({ type: 'GENERATE_CIRCUIT_FAILURE' });
        }
    }, [prompt, dispatch]);

    const handleSubmitJob = useCallback(() => {
        // In a real app, we'd parse the QASM into the circuit structure.
        // For this demo, we'll use the AI-generated one if it exists.
        const circuitToSubmit = generatedCircuit;
        if (!circuitToSubmit) {
            alert("Please generate a circuit first.");
            return;
        }

        const backend = backends.find(b => b.id === selectedBackendId);
        if (!backend) {
            alert("Invalid backend selected.");
            return;
        }

        quantumService.submitJob({
            name: `Job: ${prompt.slice(0, 20)}...`,
            userId: 'user-123',
            circuit: circuitToSubmit,
            backend,
            shots,
            priority: 'NORMAL'
        }).then(newJob => {
            dispatch({ type: 'SUBMIT_JOB_SUCCESS', payload: newJob });
            dispatch({ type: 'SET_VIEW', payload: 'JOBS' });
            dispatch({ type: 'SELECT_JOB', payload: newJob.id });
        });
    }, [generatedCircuit, prompt, selectedBackendId, shots, backends, dispatch]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Quantum Circuit Designer</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="1. Design Circuit">
                    <div className="flex border-b border-gray-700 mb-4">
                        <button onClick={() => setActiveTab('ai')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'ai' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>AI Assistant</button>
                        <button onClick={() => setActiveTab('qasm')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'qasm' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>QASM Editor</button>
                    </div>

                    {activeTab === 'ai' && (
                        <div>
                            <p className="text-gray-400 mb-4">Describe a quantum circuit in plain English.</p>
                            <textarea
                                value={prompt}
                                onChange={e => dispatch({ type: 'SET_DESIGNER_PROMPT', payload: e.target.value })}
                                className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder="e.g., Create a 3-qubit GHZ state"
                            />
                            <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                                {isGenerating ? 'Generating...' : 'Generate Circuit with AI'}
                            </button>
                        </div>
                    )}
                    
                    {activeTab === 'qasm' && (
                        <div>
                            <p className="text-gray-400 mb-4">Write or paste OPENQASM 2.0 code.</p>
                            <div className="w-full h-48 bg-gray-900 p-3 rounded text-white font-mono text-sm focus-within:ring-2 focus-within:ring-cyan-500">
                                <textarea
                                    value={qasm}
                                    onChange={e => dispatch({ type: 'SET_DESIGNER_QASM', payload: e.target.value })}
                                    className="w-full h-full bg-transparent text-white font-mono text-sm outline-none resize-none"
                                    placeholder="OPENQASM 2.0;"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Note: QASM editing is for display. Job submission uses the AI-generated circuit for this demo.</p>
                        </div>
                    )}
                </Card>

                <Card title="2. Configure & Run">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="backend" className="block text-sm font-medium text-gray-300 mb-1">Select Backend</label>
                            <select
                                id="backend"
                                value={selectedBackendId}
                                onChange={e => dispatch({ type: 'SET_DESIGNER_BACKEND', payload: e.target.value })}
                                className="w-full bg-gray-700/50 p-2 rounded text-white focus:ring-cyan-500 focus:border-cyan-500"
                            >
                                {backends.map(b => (
                                    <option key={b.id} value={b.id} disabled={b.status !== 'ONLINE'}>
                                        {b.name} ({b.status})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="shots" className="block text-sm font-medium text-gray-300 mb-1">Shots</label>
                            <input
                                type="number"
                                id="shots"
                                value={shots}
                                onChange={e => dispatch({ type: 'SET_DESIGNER_SHOTS', payload: parseInt(e.target.value, 10) })}
                                className="w-full bg-gray-700/50 p-2 rounded text-white focus:ring-cyan-500 focus:border-cyan-500"
                                min="1"
                                max="100000"
                            />
                        </div>
                        <button onClick={handleSubmitJob} disabled={!generatedCircuit} className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 transition-colors">
                            Submit Job
                        </button>
                    </div>
                </Card>
            </div>

            {(isGenerating || generatedCircuit) && (
                <Card title="Generated Quantum Circuit">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded max-h-96 overflow-auto">
                        {isGenerating ? 'Generating...' : JSON.stringify(generatedCircuit, null, 2)}
                    </pre>
                </Card>
            )}
        </div>
    );
};

export const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
    const statusInfo = {
        QUEUED: { color: 'yellow', icon: ICONS.status_queued, text: 'Queued' },
        RUNNING: { color: 'blue', icon: ICONS.status_running, text: 'Running' },
        COMPLETED: { color: 'green', icon: ICONS.status_completed, text: 'Completed' },
        FAILED: { color: 'red', icon: ICONS.status_failed, text: 'Failed' },
        CANCELLED: { color: 'gray', icon: ICONS.status_failed, text: 'Cancelled' },
    };
    const { color, icon, text } = statusInfo[status];
    const colorClasses = {
        yellow: 'bg-yellow-500/20 text-yellow-400',
        blue: 'bg-blue-500/20 text-blue-400',
        green: 'bg-green-500/20 text-green-400',
        red: 'bg-red-500/20 text-red-400',
        gray: 'bg-gray-500/20 text-gray-400',
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon path={icon} className="w-4 h-4 mr-1.5" />
            {text}
        </span>
    );
};

export const HistogramChart: React.FC<{ data: MeasurementResult }> = ({ data }) => {
    const chartHeight = 300;
    const barWidth = 40;
    const gap = 20;
    const labels = Object.keys(data).sort();
    const values = labels.map(label => data[label]);
    const maxValue = Math.max(...values);
    const totalShots = values.reduce((sum, v) => sum + v, 0);

    if (totalShots === 0) {
        return <div className="text-center text-gray-400 p-8">No measurement data available.</div>;
    }

    return (
        <div className="p-4">
            <h4 className="text-lg font-semibold text-white mb-2">Measurement Outcomes</h4>
            <svg width="100%" height={chartHeight + 40} className="font-sans">
                <g transform="translate(40, 10)">
                    {/* Y-Axis */}
                    <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#6b7280" />
                    {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                        <g key={tick}>
                            <line x1="-5" y1={chartHeight * (1 - tick)} x2={labels.length * (barWidth + gap)} y2={chartHeight * (1 - tick)} stroke="#4b5563" strokeDasharray="2,2"/>
                            <text x="-10" y={chartHeight * (1 - tick) + 4} fill="#9ca3af" textAnchor="end" fontSize="12">
                                {(tick * 100).toFixed(0)}%
                            </text>
                        </g>
                    ))}

                    {/* Bars */}
                    {labels.map((label, i) => {
                        const probability = data[label] / totalShots;
                        const barHeight = probability * chartHeight;
                        const x = i * (barWidth + gap);
                        const y = chartHeight - barHeight;
                        return (
                            <g key={label} className="transition-transform duration-300 hover:scale-105 origin-bottom">
                                <rect x={x} y={y} width={barWidth} height={barHeight} fill="url(#barGradient)" rx="2" />
                                <text x={x + barWidth / 2} y={chartHeight + 20} fill="#d1d5db" textAnchor="middle" fontSize="14" className="font-mono">
                                    |{label}⟩
                                </text>
                                <text x={x + barWidth / 2} y={y - 8} fill="#f9fafb" textAnchor="middle" fontSize="12" fontWeight="bold">
                                    {(probability * 100).toFixed(1)}%
                                </text>
                            </g>
                        );
                    })}
                </g>
                <defs>
                    <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};


export const JobDetailsView: React.FC<{ job: QuantumJob }> = ({ job }) => {
    return (
        <Card title={`Job Details: ${job.name}`} className="col-span-2">
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><p className="text-gray-400">Job ID</p><p className="font-mono text-white break-all">{job.id}</p></div>
                        <div><p className="text-gray-400">Status</p><p><StatusBadge status={job.status} /></p></div>
                        <div><p className="text-gray-400">Backend</p><p className="text-white">{job.backend.name}</p></div>
                        <div><p className="text-gray-400">Shots</p><p className="text-white">{job.shots.toLocaleString()}</p></div>
                        <div><p className="text-gray-400">Submitted</p><p className="text-white">{job.submittedAt.toLocaleString()}</p></div>
                        <div><p className="text-gray-400">Completed</p><p className="text-white">{job.completedAt ? job.completedAt.toLocaleString() : 'N/A'}</p></div>
                        {job.result && <>
                            <div><p className="text-gray-400">Queue Time</p><p className="text-white">{(job.result.queueTimeMs/1000).toFixed(2)}s</p></div>
                            <div><p className="text-gray-400">Execution Time</p><p className="text-white">{(job.result.executionTimeMs/1000).toFixed(2)}s</p></div>
                        </>}
                    </div>
                </div>

                {job.result && (
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Results</h3>
                        {job.result.aiSummary && 
                            <div className="p-4 mb-4 bg-gray-800/50 border border-cyan-500/30 rounded-lg">
                                <p className="text-sm text-cyan-300 font-semibold mb-2">AI Analysis</p>
                                <p className="text-sm text-gray-300">{job.result.aiSummary}</p>
                            </div>
                        }
                        <HistogramChart data={job.result.counts} />
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Circuit Definition</h3>
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded max-h-60 overflow-auto">
                            {JSON.stringify(job.circuit, null, 2)}
                        </pre>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Execution Logs</h3>
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded max-h-60 overflow-auto">
                            {job.logs.join('\n')}
                        </pre>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export const JobMonitor: React.FC<{
    jobs: QuantumJob[];
    selectedJobId: string | null;
    onSelectJob: (id: string | null) => void;
}> = ({ jobs, selectedJobId, onSelectJob }) => {
    const selectedJob = useMemo(() => jobs.find(j => j.id === selectedJobId), [jobs, selectedJobId]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Job Monitor</h2>
                 <button onClick={() => onSelectJob(null)} className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded transition-colors disabled:opacity-50" disabled={!selectedJobId}>
                    Back to Job List
                </button>
            </div>
            
            <div className={`grid grid-cols-1 ${selectedJob ? 'lg:grid-cols-3' : ''} gap-6`}>
                <div className={`${selectedJob ? 'lg:col-span-1' : 'col-span-1'}`}>
                    <Card title="Job Queue">
                        <div className="max-h-[70vh] overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-gray-700 text-gray-400">
                                    <tr>
                                        <th className="p-2">Name</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2">Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map(job => (
                                        <tr 
                                            key={job.id} 
                                            onClick={() => onSelectJob(job.id)}
                                            className={`border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors ${selectedJobId === job.id ? 'bg-cyan-900/30' : ''}`}
                                        >
                                            <td className="p-2 text-white font-medium">{job.name}</td>
                                            <td className="p-2"><StatusBadge status={job.status} /></td>
                                            <td className="p-2 text-gray-400">{job.submittedAt.toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {selectedJob && (
                    <JobDetailsView job={selectedJob} />
                )}
            </div>
        </div>
    );
};

export const HardwareStatusView: React.FC<{ backends: QuantumBackend[] }> = ({ backends }) => {
    const [selectedBackend, setSelectedBackend] = useState<QuantumBackend | null>(backends[0] || null);
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Hardware Status & Calibration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="Available Backends">
                        <ul className="space-y-2">
                           {backends.map(b => (
                               <li 
                                key={b.id} 
                                onClick={() => setSelectedBackend(b)}
                                className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${selectedBackend?.id === b.id ? 'bg-cyan-900/30 border-cyan-500' : 'border-transparent hover:bg-gray-800/50'}`}
                                >
                                   <div className="flex justify-between items-center">
                                       <p className="font-semibold text-white">{b.name}</p>
                                       <span className={`px-2 py-1 text-xs font-bold rounded-full ${ b.status === 'ONLINE' ? 'bg-green-500/20 text-green-400' : b.status === 'OFFLINE' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400' }`}>
                                           {b.status}
                                       </span>
                                   </div>
                                   <p className="text-sm text-gray-400">{b.qubits} Qubits - {b.provider}</p>
                               </li>
                           ))} 
                        </ul>
                    </Card>
                </div>
                {selectedBackend && (
                    <Card title={`Details for ${selectedBackend.name}`} className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Specifications</h4>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between"><span>Type:</span> <span className="text-gray-300">{selectedBackend.type}</span></li>
                                    <li className="flex justify-between"><span>Qubits:</span> <span className="text-gray-300">{selectedBackend.qubits}</span></li>
                                    <li className="flex justify-between"><span>Avg. Queue Time:</span> <span className="text-gray-300">{(selectedBackend.avgQueueTimeMs / 1000).toFixed(1)}s</span></li>
                                    <li className="flex justify-between"><span>Basis Gates:</span> <span className="text-gray-300 font-mono">{selectedBackend.basisGates.join(', ')}</span></li>
                                    <li className="flex justify-between"><span>Features:</span> <span className="text-gray-300">{selectedBackend.features.join(', ')}</span></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Performance Metrics</h4>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between"><span>Avg. Readout Error:</span> <span className="text-gray-300">{(selectedBackend.errorRates.readout * 100).toFixed(3)}%</span></li>
                                    <li className="flex justify-between"><span>Avg. Single-Qubit Gate Error:</span> <span className="text-gray-300">{(selectedBackend.errorRates.singleQubitGate * 100).toFixed(4)}%</span></li>
                                    <li className="flex justify-between"><span>Avg. CNOT Gate Error:</span> <span className="text-gray-300">{(selectedBackend.errorRates.cxGate * 100).toFixed(3)}%</span></li>
                                </ul>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="text-lg font-semibold text-white mb-2">Calibration Data</h4>
                                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded">
                                    {JSON.stringify(selectedBackend.calibrationData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}

export const AccountView: React.FC<{ user: UserProfile; dispatch: React.Dispatch<AppAction> }> = ({ user, dispatch }) => {
    const usagePercentage = (value: number, limit: number) => (limit > 0 ? (value / limit) * 100 : 0);

    const shotsUsage = usagePercentage(user.usage.shotsUsed, user.usage.shotsLimit);
    const timeUsage = usagePercentage(user.usage.executionTimeUsedMs, user.usage.executionTimeLimitMs);

    const ProgressBar: React.FC<{ value: number, color: string }> = ({ value, color }) => {
        const safeValue = Math.min(100, Math.max(0, value));
        const colorClass = {
            cyan: 'bg-cyan-500',
            blue: 'bg-blue-500',
        };
        return (
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className={`${colorClass[color as keyof typeof colorClass]} h-2.5 rounded-full`} style={{ width: `${safeValue}%` }}></div>
            </div>
        );
    }
    
    const [apiKeyCopied, setApiKeyCopied] = useState(false);
    const handleCopyKey = () => {
        navigator.clipboard.writeText(user.apiKey);
        setApiKeyCopied(true);
        setTimeout(() => setApiKeyCopied(false), 2000);
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white tracking-wider">Account & Usage</h2>
            <Card title="User Profile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><p className="text-sm text-gray-400">Name</p><p className="text-white">{user.name}</p></div>
                    <div><p className="text-sm text-gray-400">Email</p><p className="text-white">{user.email}</p></div>
                    <div><p className="text-sm text-gray-400">Organization</p><p className="text-white">{user.organization}</p></div>
                    <div><p className="text-sm text-gray-400">Role</p><p className="text-white">{user.role}</p></div>
                </div>
            </Card>

            <Card title="Current Usage">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1 text-sm">
                            <span className="font-medium text-gray-300">Shots Used</span>
                            <span className="text-gray-400">{user.usage.shotsUsed.toLocaleString()} / {user.usage.shotsLimit.toLocaleString()}</span>
                        </div>
                        <ProgressBar value={shotsUsage} color="cyan" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1 text-sm">
                            <span className="font-medium text-gray-300">Execution Time Used</span>
                            <span className="text-gray-400">{(user.usage.executionTimeUsedMs / 3600000).toFixed(1)}h / {(user.usage.executionTimeLimitMs / 3600000).toFixed(1)}h</span>
                        </div>
                        <ProgressBar value={timeUsage} color="blue" />
                    </div>
                </div>
            </Card>

            <Card title="API Access">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Your API Key</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            readOnly
                            value={user.apiKey}
                            className="w-full bg-gray-900/50 p-2 rounded text-white font-mono text-sm border border-gray-700"
                        />
                         <button onClick={handleCopyKey} className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm whitespace-nowrap">
                            {apiKeyCopied ? 'Copied!' : 'Copy'}
                        </button>
                        <button onClick={() => dispatch({type: 'UPDATE_API_KEY'})} className="px-3 py-2 bg-yellow-600/50 hover:bg-yellow-600/70 rounded text-sm whitespace-nowrap text-yellow-300">
                            Regenerate
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// Dummy view for unimplemented feature
export const AlgorithmLibraryView: React.FC = () => (
    <div>
        <h2 className="text-3xl font-bold text-white tracking-wider">Algorithm Library</h2>
        <Card className="mt-6 text-center">
            <p className="text-gray-300">This feature is under development.</p>
            <p className="text-sm text-gray-500">Explore pre-built quantum algorithms for various applications.</p>
        </Card>
    </div>
);


// SECTION: Main Component

export const DemoBankQuantumServicesView = () => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const pollingRef = useRef<number | null>(null);

    const fetchData = useCallback(() => {
        dispatch({ type: 'FETCH_DATA_START' });
        Promise.all([
            quantumService.getJobs(MOCK_USER.id),
            quantumService.getBackends(),
        ]).then(([jobs, backends]) => {
            dispatch({ type: 'FETCH_DATA_SUCCESS', payload: { jobs, backends } });
        }).catch(err => {
            dispatch({ type: 'FETCH_DATA_FAILURE', payload: 'Failed to fetch platform data.' });
            console.error(err);
        });
    }, []);

    const pollJobUpdates = useCallback(() => {
        quantumService.getJobs(MOCK_USER.id).then(jobs => {
            dispatch({ type: 'UPDATE_JOBS', payload: jobs });
        });
    }, []);

    useEffect(() => {
        fetchData();
        // Set up polling for job status updates
        pollingRef.current = window.setInterval(pollJobUpdates, 5000);
        return () => {
            if (pollingRef.current) {
                window.clearInterval(pollingRef.current);
            }
        };
    }, [fetchData, pollJobUpdates]);


    const renderView = () => {
        if (state.isLoading) {
            return <div className="text-white text-center p-10">Loading Quantum Platform...</div>
        }
        if (state.error) {
            return <div className="text-red-400 text-center p-10">Error: {state.error}</div>
        }
        switch (state.currentView) {
            case 'DASHBOARD':
                return <DashboardView jobs={state.jobs} backends={state.backends} onSelectJob={(jobId) => dispatch({ type: 'SELECT_JOB', payload: jobId })} />;
            case 'DESIGNER':
                return <CircuitDesigner designerState={state.designer} backends={state.backends} dispatch={dispatch} />;
            case 'JOBS':
                return <JobMonitor jobs={state.jobs} selectedJobId={state.selectedJobId} onSelectJob={(id) => dispatch({ type: 'SELECT_JOB', payload: id })} />;
            case 'HARDWARE':
                return <HardwareStatusView backends={state.backends} />;
            case 'ACCOUNT':
                return <AccountView user={state.userProfile} dispatch={dispatch} />;
            case 'ALGORITHMS':
                return <AlgorithmLibraryView />;
            default:
                return <div>View not found</div>;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans bg-grid-gray-700/[0.2]">
            <div className="flex h-screen p-4 gap-4">
                <AppSidebar
                    currentView={state.currentView}
                    onSetView={(view) => dispatch({ type: 'SET_VIEW', payload: view })}
                    user={state.userProfile}
                />
                <main className="flex-1 bg-gray-800/50 backdrop-blur-md rounded-lg p-6 overflow-y-auto border border-gray-700/50">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default DemoBankQuantumServicesView;