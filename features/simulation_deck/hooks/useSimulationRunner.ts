// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/simulation_deck/hooks/useSimulationRunner.ts
================================================================================

import { useState, useCallback, useEffect, useRef } from 'react';

// =================================================================================================
// --- TYPE DEFINITIONS (Normally imported from simulation_deck/types) ---
// Defining them here to ensure commercial-grade completeness without external dependency assumptions.

/**
 * Parameters required to initiate a high-fidelity financial simulation.
 */
interface SimulationParameters {
    scenarioId: string;
    inputVector: { [key: string]: number | string | boolean };
    runtimeConfig: {
        maxDurationSeconds: number;
        fidelityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM';
        outputFormat: 'JSON' | 'GRAPH_DB' | 'TIME_SERIES';
    };
    externalDataSources: string[]; // e.g., 'NYSE_TICKER', 'GEMINI_API'
}

type SimulationStatus = 'IDLE' | 'PENDING' | 'RUNNING' | 'COMPLETED' | 'CANCELLED' | 'ERROR';

/**
 * Details of a specific step in the simulation lifecycle.
 */
interface SimulationStep {
    name: string;
    progress: number; // 0 to 100
    timestamp: number;
    details: string;
}

/**
 * The full output and metadata of the simulation job.
 */
interface SimulationResult {
    simulationId: string;
    status: SimulationStatus;
    executionTimeMs: number;
    finalOutput: any; // The synthesized economic or financial projection data
    progressLog: SimulationStep[];
    riskAssessment: {
        confidenceScore: number;
        volatilityIndex: number;
        modelUncertainty: number; // 0.0-1.0, where 1.0 is highest uncertainty
    };
}

// =================================================================================================
// --- MOCK SERVICE (Normally imported from simulation_deck/services/SimulationService) ---

const SimulationServiceMock = {
    async startSimulation(params: SimulationParameters): Promise<{ simulationId: string }> {
        // Simulate API latency and job ID creation
        await new Promise(resolve => setTimeout(resolve, 500));
        const newId = `SIM-${Date.now()}-${params.scenarioId.toUpperCase().substring(0, 5)}`;
        return { simulationId: newId };
    },

    async getSimulationStatus(simulationId: string): Promise<SimulationResult> {
        // Mock progression based on time elapsed since creation
        const startTime = parseInt(simulationId.split('-')[1]) || Date.now() - 60000;
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

        let progress = Math.min(100, Math.floor(elapsedSeconds * 1.5));
        let status: SimulationStatus = 'RUNNING';
        let output = null;

        if (progress >= 95) {
            status = 'COMPLETED';
            progress = 100;
            output = {
                projectedROI: 0.18 + Math.random() * 0.05,
                marketDelta: { T_1: 0.03, T_5: 0.12 },
                optimalStrategy: 'Adaptive Momentum Strategy',
            };
        } else if (elapsedSeconds > 50 && Math.random() < 0.05) { // Simulate rare failure
             status = 'ERROR';
             progress = 70;
        }

        return {
            simulationId,
            status: status,
            executionTimeMs: Date.now() - startTime,
            finalOutput: output,
            progressLog: [
                { name: 'Historical Data Aggregation', progress: 100, timestamp: startTime, details: '10TB of historical market data ingested.' },
                { name: 'Stochastic Model Projection', progress: Math.min(progress, 60), timestamp: startTime + 10000, details: 'Running Monte Carlo scenario analysis.' },
                { name: 'Economic Synthesis & Validation', progress: progress, timestamp: Date.now(), details: status === 'COMPLETED' ? 'Validated against backtesting data.' : 'Validating model convergence.' }
            ],
            riskAssessment: {
                confidenceScore: progress / 100,
                volatilityIndex: 0.25 - (progress / 400),
                modelUncertainty: 1 - (progress / 100) * 0.95, // Uncertainty decreases as simulation progresses
            },
        };
    },

    async cancelSimulation(simulationId: string): Promise<void> {
        // Simulate async cancellation confirmation
        await new Promise(resolve => setTimeout(resolve, 800));
        console.info(`[Simulation Core] Simulation ${simulationId} terminated by user.`);
    }
};

const SimulationService = SimulationServiceMock; // Use the mock for logic implementation

// =================================================================================================
// --- HOOK IMPLEMENTATION ---

interface SimulationRunnerConfig {
    /** Time interval in milliseconds for polling the simulation status (default: 5000ms). */
    pollingInterval?: number;
}

interface SimulationRunnerHook {
    simulationId: string | null;
    status: SimulationStatus;
    isRunning: boolean;
    isLoading: boolean;
    results: SimulationResult | null;
    error: string | null;
    runSimulation: (params: SimulationParameters) => Promise<void>;
    cancelSimulation: () => Promise<void>;
    resetSimulation: () => void;
}

/**
 * A React hook for managing the state and lifecycle of a running simulation from the Simulation Core.
 * It uses a persistent polling mechanism to track the status of long-running, complex simulations.
 */
export const useSimulationRunner = (config: SimulationRunnerConfig = {}): SimulationRunnerHook => {
    const { pollingInterval = 5000 } = config;

    // State management
    const [simulationId, setSimulationId] = useState<string | null>(null);
    const [status, setStatus] = useState<SimulationStatus>('IDLE');
    const [results, setResults] = useState<SimulationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Ref to manage the polling timer across renders and prevent memory leaks
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isRunning = status === 'PENDING' || status === 'RUNNING';

    /**
     * Clears all simulation state and stops polling.
     */
    const resetSimulation = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setSimulationId(null);
        setStatus('IDLE');
        setResults(null);
        setError(null);
        setIsLoading(false);
    }, []);

    /**
     * Initiates a new simulation job with the Simulation Core.
     */
    const runSimulation = useCallback(async (params: SimulationParameters) => {
        resetSimulation();
        setIsLoading(true);
        setStatus('PENDING');

        try {
            const { simulationId: newId } = await SimulationService.startSimulation(params);
            setSimulationId(newId);
            setIsLoading(false);
            // Polling loop will automatically engage due to simulationId change
        } catch (err) {
            console.error('Failed to initiate simulation:', err);
            const errorMessage = err instanceof Error ? err.message : 'Critical system failure initiating simulation job.';
            setError(errorMessage);
            setStatus('ERROR');
            setIsLoading(false);
        }
    }, [resetSimulation]);

    /**
     * Attempts to cancel the active simulation job on the server.
     */
    const cancelSimulation = useCallback(async () => {
        if (!simulationId || !isRunning) return;

        // Immediately update local UI state optimistically
        const currentId = simulationId;
        setStatus('CANCELLED');
        setIsLoading(true);

        // Stop polling immediately
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        try {
            await SimulationService.cancelSimulation(currentId);
            setResults(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
            setError(null);
        } catch (err) {
            // Revert status if cancellation fails, indicating the job might still be processing
            setStatus('RUNNING');
            setError('Cancellation request failed to reach the Simulation Core. The simulation may still complete.');
            console.error('Cancellation failure:', err);
            // Restart polling to track its eventual status (COMPLETED/ERROR)
            if (currentId) setSimulationId(null); // Trigger useEffect re-run to restart polling logic
            if (currentId) setSimulationId(currentId);
        } finally {
            setIsLoading(false);
        }
    }, [simulationId, isRunning]);


    /**
     * Primary effect hook for managing the asynchronous polling lifecycle.
     */
    useEffect(() => {
        let isCancelled = false;
        
        // Define statuses that terminate polling
        const terminalStatuses: SimulationStatus[] = ['COMPLETED', 'ERROR', 'IDLE', 'CANCELLED'];

        if (!simulationId || terminalStatuses.includes(status)) {
            return; // Exit if no ID or job is finished
        }

        const pollStatus = async () => {
            if (isCancelled) return;
            
            try {
                const latestResult = await SimulationService.getSimulationStatus(simulationId);
                
                if (isCancelled) return;
                
                setResults(latestResult);
                setStatus(latestResult.status);

                if (terminalStatuses.includes(latestResult.status)) {
                    // Job finished, stop recursion
                    if (timerRef.current) clearTimeout(timerRef.current);
                    if (latestResult.status === 'ERROR') {
                        setError('Simulation terminated with an error state detected by the Simulation Core.');
                    }
                } else {
                    // Job still running, schedule next poll
                    timerRef.current = setTimeout(pollStatus, pollingInterval);
                }

            } catch (err) {
                if (isCancelled) return;
                console.error(`Error polling simulation ${simulationId}:`, err);
                setError('Network or API communication failure while updating status.');
                setStatus('ERROR');
                if (timerRef.current) clearTimeout(timerRef.current);
            }
        };

        // Start the initial poll when simulationId is set and status is PENDING/RUNNING
        if (status === 'PENDING' || status === 'RUNNING') {
            // Ensure no duplicate timers are running
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(pollStatus, 500); // Wait a moment after start before first poll
        }

        // Cleanup: runs when the component unmounts or dependencies change
        return () => {
            isCancelled = true;
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [simulationId, status, pollingInterval]);

    return {
        simulationId,
        status,
        isRunning,
        isLoading,
        results,
        error,
        runSimulation,
        cancelSimulation,
        resetSimulation,
    };
};