// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/synapse_os_core/mainOrchestrator.ts
================================================================================

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { PromptLibrary, PromptKey } from '../ai/promptLibrary';
import { GeminiService, OpenAIService } from '../google/ai_studio/services/GeminiService'; // Assuming a unified interface
import { AITaskManagerService } from '../components/services/ai/AITaskManagerService';
import { preferenceApiService } from '../components/preferences/preferenceApiService';
import { UserPreferences } from '../components/preferences/preferenceTypes';

// --- Enums and Core Types ---

export enum AgentStatus {
    IDLE = 'IDLE',
    BUSY = 'BUSY',
    INITIALIZING = 'INITIALIZING',
    DEGRADED = 'DEGRADED',
    ERROR = 'ERROR',
    TERMINATED = 'TERMINATED',
}

export enum TaskStatus {
    PENDING = 'PENDING',
    QUEUED = 'QUEUED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    AWAITING_DEPENDENCIES = 'AWAITING_DEPENDENCIES',
}

export enum TaskPriority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    CRITICAL = 4,
}

export type AgentCapability =
    | 'CODE_GENERATION'
    | 'CODE_ANALYSIS'
    | 'FINANCIAL_PROJECTION'
    | 'ECONOMIC_MODELING'
    | 'STRATEGIC_PLANNING'
    | 'DATA_VISUALIZATION'
    | 'NATURAL_LANGUAGE_QUERY'
    | 'QUANTUM_COMPUTING_SIMULATION'
    | 'SENTIMENT_ANALYSIS'
    | 'THREAT_INTELLIGENCE'
    | 'TASK_DECOMPOSITION'
    | 'MARKETING_COPY_GENERATION'
    | 'LEGAL_DOCUMENT_ANALYSIS';

export interface Task<T = any> {
    id: string;
    name: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    payload: T;
    requiredCapabilities: AgentCapability[];
    dependencies: string[]; // Array of task IDs this task depends on
    result?: TaskResult;
    submittedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    assignedAgentId?: string;
    retries: number;
}

export interface TaskResult<T = any> {
    taskId: string;
    status: 'SUCCESS' | 'FAILURE';
    data?: T;
    error?: {
        message: string;
        stack?: string;
        code?: string;
    };
    metadata: {
        agentId: string;
        executionTimeMs: number;
        tokenUsage?: {
            prompt: number;
            completion: number;
            total: number;
        };
    };
}

export interface AgentMetadata {
    id: string;
    name: string;
    description: string;
    version: string;
    capabilities: AgentCapability[];
    maxConcurrentTasks: number;
}

export interface AIAgent {
    getMetadata(): AgentMetadata;
    initialize(orchestrator: MainOrchestrator): Promise<void>;
    executeTask<T, R>(task: Task<T>): Promise<TaskResult<R>>;
    terminate(): Promise<void>;
    getStatus(): { status: AgentStatus; currentTasks: number };
}

export interface OrchestratorConfig {
    maxConcurrentTasks: number;
    taskRetryLimit: number;
    logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    aiProviders: {
        gemini: GeminiService;
        openai: OpenAIService;
    };
    promptLibrary: PromptLibrary;
    taskManagerService: AITaskManagerService;
}

// --- Internal Wrapper for Agent State Management ---

class AIAgentWrapper {
    public status: AgentStatus = AgentStatus.INITIALIZING;
    public currentTasks: Set<string> = new Set();
    public lastError: string | null = null;
    public readonly metadata: AgentMetadata;

    constructor(public readonly agent: AIAgent) {
        this.metadata = agent.getMetadata();
    }

    canAcceptTask(): boolean {
        return (
            this.status === AgentStatus.IDLE ||
            (this.status === AgentStatus.BUSY && this.currentTasks.size < this.metadata.maxConcurrentTasks)
        );
    }
}

// --- MainOrchestrator Singleton Class ---

export class MainOrchestrator extends EventEmitter {
    private static instance: MainOrchestrator;

    private agents: Map<string, AIAgentWrapper> = new Map();
    private taskQueue: Task<any>[] = [];
    private runningTasks: Map<string, Task<any>> = new Map();
    private completedTasks: Map<string, Task<any>> = new Map();
    private capabilityRegistry: Map<AgentCapability, string[]> = new Map();
    private sharedContext: Map<string, any> = new Map();
    private config!: OrchestratorConfig;
    private isProcessing = false;
    private tickInterval: NodeJS.Timeout | null = null;
    private userPreferences: UserPreferences | null = null;

    private constructor() {
        super();
        this.setMaxListeners(100); // Allow for many listeners from agents and UI components
    }

    public static getInstance(): MainOrchestrator {
        if (!MainOrchestrator.instance) {
            MainOrchestrator.instance = new MainOrchestrator();
        }
        return MainOrchestrator.instance;
    }

    public async initialize(config: OrchestratorConfig): Promise<void> {
        if (this.tickInterval) {
            this.log('WARN', 'Orchestrator already initialized.');
            return;
        }

        this.config = config;
        this.log('INFO', 'Initializing Synapse OS Core MainOrchestrator...');

        // Fetch initial user preferences
        try {
            this.userPreferences = await preferenceApiService.getPreferences();
            this.log('INFO', 'User preferences loaded.');
        } catch (error) {
            this.log('ERROR', 'Failed to load user preferences', error);
        }

        // Initialize a core agent for meta-tasks
        // In a real scenario, this would be dynamically loaded
        const metaAgent = new MetaCognitionAgent();
        await this.registerAgent(metaAgent);

        this.tickInterval = setInterval(() => this.processTaskQueue(), 100);
        this.log('INFO', 'Orchestrator initialized and task processing started.');
        this.emit('initialized');
    }

    public async registerAgent(agent: AIAgent): Promise<string> {
        const metadata = agent.getMetadata();
        if (this.agents.has(metadata.id)) {
            throw new Error(`Agent with ID ${metadata.id} is already registered.`);
        }

        const wrapper = new AIAgentWrapper(agent);
        this.agents.set(metadata.id, wrapper);
        this.log('INFO', `Registering agent: ${metadata.name} (ID: ${metadata.id})`);

        try {
            await agent.initialize(this);
            wrapper.status = AgentStatus.IDLE;

            metadata.capabilities.forEach(capability => {
                const agentsWithCapability = this.capabilityRegistry.get(capability) || [];
                agentsWithCapability.push(metadata.id);
                this.capabilityRegistry.set(capability, agentsWithCapability);
            });

            this.log('INFO', `Agent ${metadata.name} successfully initialized and registered.`);
            this.emit('agentRegistered', metadata);
            return metadata.id;
        } catch (error) {
            wrapper.status = AgentStatus.ERROR;
            wrapper.lastError = (error as Error).message;
            this.agents.delete(metadata.id); // Rollback registration
            this.log('ERROR', `Failed to initialize agent ${metadata.name}`, error);
            throw new Error(`Initialization failed for agent ${metadata.id}: ${(error as Error).message}`);
        }
    }

    public async deregisterAgent(agentId: string): Promise<void> {
        const wrapper = this.agents.get(agentId);
        if (!wrapper) {
            this.log('WARN', `Attempted to deregister non-existent agent with ID ${agentId}`);
            return;
        }

        this.log('INFO', `Deregistering agent: ${wrapper.metadata.name} (ID: ${agentId})`);
        wrapper.status = AgentStatus.TERMINATED;

        // Wait for current tasks to finish gracefully (with a timeout)
        await this.gracefulShutdownAgentTasks(wrapper, 30000);

        await wrapper.agent.terminate();

        wrapper.metadata.capabilities.forEach(capability => {
            const agentsWithCapability = (this.capabilityRegistry.get(capability) || []).filter(id => id !== agentId);
            if (agentsWithCapability.length > 0) {
                this.capabilityRegistry.set(capability, agentsWithCapability);
            } else {
                this.capabilityRegistry.delete(capability);
            }
        });

        this.agents.delete(agentId);
        this.log('INFO', `Agent ${agentId} deregistered.`);
        this.emit('agentDeregistered', agentId);
    }
    
    public submitTask<T>(taskDetails: Omit<Task<T>, 'id' | 'status' | 'submittedAt' | 'retries'>): string {
        const task: Task<T> = {
            ...taskDetails,
            id: uuidv4(),
            status: TaskStatus.PENDING,
            submittedAt: new Date(),
            retries: 0,
        };

        this.log('DEBUG', `Task submitted: ${task.name} (ID: ${task.id})`);
        
        if (task.dependencies && task.dependencies.length > 0) {
            const allDependenciesMet = task.dependencies.every(depId => this.completedTasks.has(depId) && this.completedTasks.get(depId)?.status === TaskStatus.COMPLETED);
            if (!allDependenciesMet) {
                task.status = TaskStatus.AWAITING_DEPENDENCIES;
                this.runningTasks.set(task.id, task); // Track it so it can be activated later
                this.log('INFO', `Task ${task.id} is awaiting dependencies.`);
                this.emit('taskStatusChanged', task);
                return task.id;
            }
        }
        
        task.status = TaskStatus.QUEUED;
        this.taskQueue.push(task);
        this.taskQueue.sort((a, b) => b.priority - a.priority); // Re-sort queue on every add
        this.emit('taskQueued', task);
        
        return task.id;
    }

    public getSystemStatus() {
        return {
            totalAgents: this.agents.size,
            agents: Array.from(this.agents.values()).map(w => ({
                id: w.metadata.id,
                name: w.metadata.name,
                status: w.status,
                currentTasks: w.currentTasks.size,
            })),
            taskQueueSize: this.taskQueue.length,
            runningTasks: this.runningTasks.size,
            completedTasks: this.completedTasks.size,
            sharedContextSize: this.sharedContext.size,
        };
    }

    public readSharedContext(key: string): any {
        return this.sharedContext.get(key);
    }
    
    public updateSharedContext(key: string, value: any): void {
        const oldValue = this.sharedContext.get(key);
        this.sharedContext.set(key, value);
        this.emit('contextUpdated', { key, newValue: value, oldValue });
    }

    public getConfig(): OrchestratorConfig {
        return this.config;
    }

    private async processTaskQueue(): Promise<void> {
        if (this.isProcessing || this.taskQueue.length === 0) {
            return;
        }

        this.isProcessing = true;

        const task = this.taskQueue[0]; // Highest priority task
        
        const agent = this.selectAgentForTask(task);
        
        if (agent) {
            this.taskQueue.shift(); // Remove from queue
            
            task.status = TaskStatus.IN_PROGRESS;
            task.startedAt = new Date();
            task.assignedAgentId = agent.metadata.id;
            
            this.runningTasks.set(task.id, task);
            
            agent.currentTasks.add(task.id);
            agent.status = agent.currentTasks.size >= agent.metadata.maxConcurrentTasks ? AgentStatus.BUSY : AgentStatus.IDLE;
            if (agent.currentTasks.size > 0 && agent.status === AgentStatus.IDLE) agent.status = AgentStatus.BUSY;
            
            this.log('INFO', `Assigning task ${task.id} to agent ${agent.metadata.id}`);
            this.emit('taskStatusChanged', task);
            this.emit('agentStatusChanged', { agentId: agent.metadata.id, status: agent.status });

            // Execute without awaiting to allow processing of other tasks
            this.executeAndMonitorTask(agent, task);
        }

        this.isProcessing = false;
    }

    private selectAgentForTask(task: Task<any>): AIAgentWrapper | null {
        const candidateAgentIds: string[] = [];
        
        task.requiredCapabilities.forEach(capability => {
            const agents = this.capabilityRegistry.get(capability);
            if (agents) {
                candidateAgentIds.push(...agents);
            }
        });

        const uniqueCandidateIds = [...new Set(candidateAgentIds)];
        const availableAgents = uniqueCandidateIds
            .map(id => this.agents.get(id)!)
            .filter(wrapper => wrapper && wrapper.canAcceptTask());

        if (availableAgents.length === 0) {
            return null;
        }

        // Simple load balancing: prefer agent with fewest tasks
        availableAgents.sort((a, b) => a.currentTasks.size - b.currentTasks.size);
        
        return availableAgents[0];
    }
    
    private async executeAndMonitorTask(agentWrapper: AIAgentWrapper, task: Task<any>): Promise<void> {
        const startTime = Date.now();
        try {
            const result = await agentWrapper.agent.executeTask(task);
            const executionTimeMs = Date.now() - startTime;
            result.metadata.executionTimeMs = executionTimeMs;
            
            this.handleTaskCompletion(task, result);
        } catch (error) {
            const executionTimeMs = Date.now() - startTime;
            const result: TaskResult = {
                taskId: task.id,
                status: 'FAILURE',
                error: {
                    message: (error as Error).message,
                    stack: (error as Error).stack,
                },
                metadata: {
                    agentId: agentWrapper.metadata.id,
                    executionTimeMs,
                },
            };
            this.handleTaskCompletion(task, result);
        }
    }

    private handleTaskCompletion(task: Task<any>, result: TaskResult<any>) {
        const agentWrapper = this.agents.get(task.assignedAgentId!);
        
        if (result.status === 'SUCCESS') {
            task.status = TaskStatus.COMPLETED;
            this.log('INFO', `Task ${task.id} completed successfully by ${task.assignedAgentId}.`);
        } else {
            this.log('ERROR', `Task ${task.id} failed on agent ${task.assignedAgentId}. Reason: ${result.error?.message}`);
            if (task.retries < this.config.taskRetryLimit) {
                task.retries++;
                task.status = TaskStatus.QUEUED;
                task.assignedAgentId = undefined; // Allow rescheduling
                this.taskQueue.unshift(task); // Re-queue with high priority
                this.log('INFO', `Retrying task ${task.id} (attempt ${task.retries}).`);
                this.emit('taskStatusChanged', task);
                return; // Exit before finalizing task
            } else {
                task.status = TaskStatus.FAILED;
                this.log('ERROR', `Task ${task.id} failed after ${task.retries} retries.`);
            }
        }
        
        task.completedAt = new Date();
        task.result = result;
        
        this.runningTasks.delete(task.id);
        this.completedTasks.set(task.id, task);

        if (agentWrapper) {
            agentWrapper.currentTasks.delete(task.id);
            if (agentWrapper.currentTasks.size === 0) {
                agentWrapper.status = AgentStatus.IDLE;
                this.emit('agentStatusChanged', { agentId: agentWrapper.metadata.id, status: agentWrapper.status });
            }
        }
        
        this.emit('taskCompleted', task);
        this.checkDependentTasks(task.id);
    }
    
    private checkDependentTasks(completedTaskId: string) {
        this.runningTasks.forEach(task => {
            if (task.status === TaskStatus.AWAITING_DEPENDENCIES) {
                const depIndex = task.dependencies.indexOf(completedTaskId);
                if (depIndex > -1) {
                    // Check if all dependencies are now met
                    const allDependenciesMet = task.dependencies.every(depId => 
                        this.completedTasks.has(depId) && this.completedTasks.get(depId)?.status === TaskStatus.COMPLETED
                    );
                    if (allDependenciesMet) {
                        this.log('INFO', `All dependencies met for task ${task.id}. Moving to queue.`);
                        task.status = TaskStatus.QUEUED;
                        this.runningTasks.delete(task.id);
                        this.taskQueue.push(task);
                        this.taskQueue.sort((a, b) => b.priority - a.priority);
                        this.emit('taskStatusChanged', task);
                    }
                }
            }
        });
    }

    private log(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', message: string, data?: any) {
        if (this.config && this.config.logLevel) {
            const levels = { DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4 };
            if (levels[level] >= levels[this.config.logLevel]) {
                console.log(`[SynapseOS][${level}][${new Date().toISOString()}] ${message}`, data || '');
            }
        }
    }

    private async gracefulShutdownAgentTasks(wrapper: AIAgentWrapper, timeout: number): Promise<void> {
        if (wrapper.currentTasks.size === 0) {
            return;
        }

        const shutdownPromise = new Promise<void>(resolve => {
            const checkInterval = setInterval(() => {
                if (wrapper.currentTasks.size === 0) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });

        const timeoutPromise = new Promise<void>((_, reject) => {
            setTimeout(() => reject(new Error(`Timeout waiting for agent ${wrapper.metadata.id} tasks to complete`)), timeout);
        });

        try {
            await Promise.race([shutdownPromise, timeoutPromise]);
        } catch (error) {
            this.log('WARN', `Graceful shutdown for agent ${wrapper.metadata.id} timed out. Ongoing tasks will be abandoned.`, error);
            // In a real system, we might mark these tasks as failed or requeue them.
            wrapper.currentTasks.forEach(taskId => {
                const task = this.runningTasks.get(taskId);
                if (task) {
                    this.handleTaskCompletion(task, {
                        taskId: task.id,
                        status: 'FAILURE',
                        error: { message: 'Agent was forcefully deregistered' },
                        metadata: { agentId: wrapper.metadata.id, executionTimeMs: 0 },
                    });
                }
            });
        }
    }
    
    public async shutdown(): Promise<void> {
        this.log('INFO', 'Shutting down orchestrator...');
        if(this.tickInterval) clearInterval(this.tickInterval);
        this.tickInterval = null;

        const agentIds = Array.from(this.agents.keys());
        for(const agentId of agentIds) {
            await this.deregisterAgent(agentId);
        }

        this.taskQueue = [];
        this.runningTasks.clear();
        this.log('INFO', 'Orchestrator shutdown complete.');
        this.emit('shutdown');
    }
}


// --- Example of a Core Agent for Meta-Tasks ---

class MetaCognitionAgent implements AIAgent {
    private orchestrator!: MainOrchestrator;
    private metadata: AgentMetadata = {
        id: 'agent-metacognition-001',
        name: 'MetaCognition Agent',
        description: 'A core agent responsible for task decomposition, planning, and agent selection strategy.',
        version: '1.0.0',
        capabilities: ['TASK_DECOMPOSITION'],
        maxConcurrentTasks: 2,
    };

    getMetadata = () => this.metadata;
    getStatus = () => ({ status: AgentStatus.IDLE, currentTasks: 0 }); // Simplified for example

    async initialize(orchestrator: MainOrchestrator) {
        this.orchestrator = orchestrator;
    }

    async terminate() { /* No-op */ }

    async executeTask<T, R>(task: Task<T>): Promise<TaskResult<R>> {
        if (task.requiredCapabilities.includes('TASK_DECOMPOSITION')) {
            return this.decomposeTask(task) as Promise<TaskResult<R>>;
        }
        return {
            taskId: task.id,
            status: 'FAILURE',
            error: { message: 'Unsupported capability for MetaCognitionAgent' },
            metadata: { agentId: this.metadata.id, executionTimeMs: 1 },
        };
    }

    private async decomposeTask(task: Task<{ goal: string }>): Promise<TaskResult<{ subTasks: any[] }>> {
        const { goal } = task.payload;
        const config = this.orchestrator.getConfig();

        const availableCapabilities = Array.from(this.orchestrator.getSystemStatus().agents.flatMap(a => a.id !== this.metadata.id ? this.orchestrator.agents.get(a.id)?.metadata.capabilities || [] : []));
        const uniqueCapabilities = [...new Set(availableCapabilities)];

        const prompt = config.promptLibrary.get(PromptKey.TASK_DECOMPOSITION, {
            goal,
            capabilities: uniqueCapabilities.join(', '),
        });

        try {
            const response = await config.aiProviders.gemini.generateContent(prompt);
            // Assuming response is structured JSON defining subtasks
            const subTasks = JSON.parse(response).subTasks;

            // Here you would use the orchestrator to submit these new subtasks,
            // creating a dependency chain. For this example, we just return them.

            return {
                taskId: task.id,
                status: 'SUCCESS',
                data: { subTasks },
                metadata: { agentId: this.metadata.id, executionTimeMs: 0 }, // Filled by orchestrator
            };

        } catch (error) {
            return {
                taskId: task.id,
                status: 'FAILURE',
                error: { message: `AI-powered decomposition failed: ${(error as Error).message}` },
                metadata: { agentId: this.metadata.id, executionTimeMs: 0 },
            };
        }
    }
}
