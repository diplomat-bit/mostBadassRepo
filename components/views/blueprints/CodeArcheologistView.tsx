// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/blueprints/CodeArcheologistView.tsx
================================================================================

// components/views/blueprints/CodeArcheologistView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

const CodeArcheologistView: React.FC = () => {
    const [goal, setGoal] = useState('Refactor the Python `payment_processor` service to use a class-based structure instead of standalone functions.');
    const [log, setLog] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const runSimulation = async () => {
        setIsLoading(true);
        setLog([]);
        
        const addLog = (content: string) => setLog(prev => [...prev, content]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            addLog('Goal Received. Reading relevant files: `payment_processor.py`...');
            await new Promise(r => setTimeout(r, 1500));

            const planPrompt = `Generate a step-by-step plan to refactor a Python file from functions to a class.`;
            addLog('Generating refactoring plan...');
            const planResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: planPrompt });
            addLog(`Plan generated:\n${planResponse.text}`);
            await new Promise(r => setTimeout(r, 2000));
            
            addLog('Executing Step 1: Create `PaymentProcessor` class structure...');
            await new Promise(r => setTimeout(r, 1500));
            addLog('Running tests... All tests pass.');
            await new Promise(r => setTimeout(r, 2000));

            addLog('Executing Step 2: Move `process_payment` into the class...');
            await new Promise(r => setTimeout(r, 1500));
            addLog('Running tests... All tests pass.');
            await new Promise(r => setTimeout(r, 2000));

            addLog('Refactoring complete. Submitting pull request for human review...');

        } catch (error) {
            addLog('An error occurred during the refactoring cycle.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">Blueprint 112: Code Archeologist</h1>
            <Card title="Refactoring Goal">
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-700/50 p-3 rounded text-white text-lg focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={runSimulation} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                    {isLoading ? 'Refactoring...' : 'Start Autonomous Refactor'}
                </button>
            </Card>

            {(isLoading || log.length > 0) && (
                <Card title="Agent Log">
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto p-2 font-mono text-xs text-gray-300 whitespace-pre-line">
                        {log.map((entry, i) => <p key={i}>{`[${new Date().toLocaleTimeString()}] ${entry}`}</p>)}
                         {isLoading && <p className="text-yellow-400 animate-pulse">Working...</p>}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default CodeArcheologistView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/blueprints/CodeArcheologistView.tsx
================================================================================

/**
 * This module delivers the Code Archeologist View, a sophisticated interface for an Agentic AI system
 * designed to autonomously monitor, plan, and execute code refactoring and remediation tasks within a
 * secure, enterprise-grade financial infrastructure. It integrates advanced digital identity,
 * an internal secure messaging layer, and robust governance mechanisms to ensure auditable,
 * policy-compliant, and high-performance operations.
 *
 * Business Impact: This isn't just a view; it's a command deck for a digital ghost in the machine. A ghost
 * that exorcises the demons of technical debt, rewrites the sins of past developers, and ensures the codebase
 * is so clean it squeaks. By automating the soul-crushing, error-prone tasks of code maintenance, it frees up
 * human developers to do what they do best: innovate, create, and drink coffee. The ROI isn't measured in
 * dollars, but in reclaimed sanity and the sheer velocity of progress. This system is the difference between
 * a legacy codebase that's a haunted house and a modern one that's a self-building skyscraper. This system
 * represents a revolutionary, multi-million-dollar infrastructure leap by providing continuous codebase
 * integrity and security. It's the future, awkwardly staring back at you from a terminal window.
 */
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Card from '../../Card';

// --- Global Constants for Simulation ---
export const SYSTEM_AGENT_ID = 'system-orchestrator-001';
export const CODE_ARCHEOLOGIST_AGENT_ID = 'agent-code-arch-001';
export const GOVERNANCE_AGENT_ID = 'agent-governance-002';
export const USER_INTERACTION_AGENT_ID = 'agent-ui-chat-003';


// --- Multi-Model AI Service Abstraction Layer ---

/**
 * A standardized interface for interacting with various Large Language Models.
 * This is the Rosetta Stone that allows our agents to speak to Gemini, ChatGPT, Claude, and whatever
 * eldritch AI horror comes next, without having to learn their specific dialects.
 */
export interface LLMService {
    provider: 'Google' | 'OpenAI' | 'Anthropic' | 'Mock';
    generateContent(prompt: string, model?: string): Promise<string>;
}

/**
 * A concrete implementation for Google's Gemini models via the @google/genai package.
 * It's fast, it's powerful, and it's from the company that probably knows what you're thinking right now anyway.
 */
export class GeminiService implements LLMService {
    provider: 'Google' = 'Google';
    private genAI: any; // Using `any` to avoid a hard dependency on `@google/genai` types if not installed.

    constructor(apiKey: string) {
        // Dynamically import to avoid errors if the package isn't installed. A bit of a hack, but so is most of software.
        // In a real app, this would be handled by build-time checks or dynamic imports.
        if (typeof window !== 'undefined') {
            // @ts-ignore - Assuming GoogleGenerativeAI is available on window or imported elsewhere
            if (window.GoogleGenerativeAI) {
                // @ts-ignore
                this.genAI = new window.GoogleGenerativeAI(apiKey);
            } else {
                console.error("Google GenAI SDK not loaded. GeminiService will not function.");
            }
        }
    }

    async generateContent(prompt: string, model: string = 'gemini-pro'): Promise<string> {
        if (!this.genAI) {
            throw new Error("Gemini AI SDK not initialized. Is the API key correct and the script loaded?");
        }
        try {
            const modelInstance = this.genAI.getGenerativeModel({ model });
            const result = await modelInstance.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating content with Gemini:', error);
            throw new Error(`Gemini API call failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * A placeholder implementation for OpenAI's models (ChatGPT).
 * This is where you'd wire up the logic to call the OpenAI API. For now, it just politely tells you it's not done.
 * Like a "Coming Soon" page from 1998, but in code form.
 */
export class OpenAIService implements LLMService {
    provider: 'OpenAI' = 'OpenAI';
    private apiKey: string;
    constructor(apiKey: string) { this.apiKey = apiKey; }

    async generateContent(prompt: string, model: string = 'gpt-4'): Promise<string> {
        console.warn(`OpenAI Service called with model ${model}, but it's a simulation. Did you remember to wire it up? The prompt was: "${prompt}"`);
        await new Promise(r => setTimeout(r, 500));
        return `(Simulated OpenAI Response) To properly address your request, "${prompt.substring(0, 50)}...", one must first consider the philosophical implications of procedural to object-oriented conversion. Here is a plan: 1. Ponder the void. 2. Create a class. 3. Copy-paste everything into it.`;
    }
}

/**
 * A placeholder implementation for Anthropic's Claude models.
 * Another "TODO" in the grand cathedral of our codebase. It dreams of one day being a real API call.
 */
export class AnthropicService implements LLMService {
    provider: 'Anthropic' = 'Anthropic';
    private apiKey: string;
    constructor(apiKey: string) { this.apiKey = apiKey; }

    async generateContent(prompt: string, model: string = 'claude-3-opus'): Promise<string> {
        console.warn(`Anthropic Service called with model ${model}, but it's a simulation. This feature is still on the whiteboard. The prompt was: "${prompt}"`);
        await new Promise(r => setTimeout(r, 500));
        return `(Simulated Claude Response) Hello! I've analyzed your request: "${prompt.substring(0, 50)}...". I believe a more constitutional and safe approach would be to form a committee to discuss the refactoring. My plan emphasizes safety and thoughtful consideration: 1. Establish ethical guidelines for the new class. 2. Ensure all functions are treated with respect as they transition to methods. 3. Validate the final code against our core principles.`;
    }
}

/**
 * A mock LLM service for when you don't have an API key or the internet has ceased to exist.
 * It provides canned responses with the reliability of a microwave dinner.
 */
export class MockLLMService implements LLMService {
    provider: 'Mock' = 'Mock';
    async generateContent(prompt: string): Promise<string> {
        console.warn(`Mocking AI response for prompt: ${prompt}`);
        await new Promise(r => setTimeout(r, 300));
        if (prompt.toLowerCase().includes('refactor')) {
            return 'Mock Plan:\n1. Create a `PaymentProcessor` class.\n2. Move `process_payment` into the class as a method.\n3. Update the calling code to instantiate the class.';
        }
        return 'This is a mock response. I am a simple AI, content in my simulated world.';
    }
}


// --- Digital Identity and Trust Layer ---

/**
 * Represents a digital identity within the system, encapsulating cryptographic keys
 * for secure authentication and authorization. This is foundational for all secure
 * communications and role-based access controls across the platform. It's the system's
 * equivalent of a high-tech, unforgeable ID card.
 */
export interface DigitalIdentity {
    id: string;
    publicKey: string; // Simulated public key
    privateKey: string; // Simulated private key (NEVER expose in real world)
    role: string;
    sign(data: string): string; // Simulates cryptographic signing
    verify(data: string, signature: string, publicKey: string): boolean; // Simulates cryptographic verification
}

/**
 * The DigitalIdentityService manages the lifecycle and operations of digital identities.
 * It provides core functionalities for generating, authenticating, and authorizing
 * entities (agents, users, services) within the platform, establishing a root of trust.
 * Commercial Value: Enables secure, verifiable interactions critical for financial compliance,
 * fraud prevention, and maintaining data integrity in high-stakes environments. It's the bouncer
 * at the door of our digital nightclub.
 */
export class DigitalIdentityService {
    private identities = new Map<string, DigitalIdentity>();

    public createIdentity(id: string, role: string): DigitalIdentity {
        const privateKey = `PK_${id}_${Math.random().toString(36).substring(2, 15)}`;
        const publicKey = `PUBK_${id}_${Math.random().toString(36).substring(2, 15)}`;

        const identity: DigitalIdentity = {
            id,
            publicKey,
            privateKey,
            role,
            sign: (data: string) => btoa(`${data}:${privateKey}`).substring(0, 64),
            verify: (data: string, signature: string, targetPublicKey: string) =>
                targetPublicKey === publicKey && signature === btoa(`${data}:${privateKey}`).substring(0, 64),
        };
        this.identities.set(id, identity);
        return identity;
    }

    public getIdentity(id: string): DigitalIdentity | undefined {
        return this.identities.get(id);
    }

    public authenticate(senderId: string, data: string, signature: string): boolean {
        const identity = this.getIdentity(senderId);
        if (!identity) return false;
        return identity.verify(data, signature, identity.publicKey);
    }

    public authorize(identityId: string, requiredRole: string, action: string): boolean {
        const identity = this.getIdentity(identityId);
        if (!identity) {
            console.warn(`Authorization failed: Identity ${identityId} not found for action ${action}.`);
            return false;
        }
        const authorized = identity.role === requiredRole || identity.role === 'admin';
        if (!authorized) {
            console.warn(`Authorization failed for ${identityId} (role: ${identity.role}) attempting ${action}. Required role: ${requiredRole}`);
        }
        return authorized;
    }
}

// --- Agentic Intelligence Layer - Core Components ---

/**
 * Defines the structure of a message exchanged between autonomous agents.
 * Messages are cryptographically signed and include a nonce for replay protection,
 * ensuring secure and reliable inter-agent communication. Think of it as a tamper-proof
 * envelope for digital carrier pigeons.
 */
export interface AgentMessage {
    senderId: string;
    recipientId: string;
    type: string;
    payload: any;
    timestamp: string;
    nonce: string;
    signature: string;
}

/**
 * The AgentMessageBus facilitates secure, auditable communication between autonomous agents.
 * It's the central nervous system, the secure post office, and the gossip corner for all our
 * digital agents.
 * Commercial Value: Enables robust, distributed decision-making and execution without compromising
 * security or auditability, enhancing the platform's resilience and responsiveness to complex events.
 */
export class AgentMessageBus {
    private listeners = new Map<string, ((message: AgentMessage) => void)[]>();
    private digitalIdentityService: DigitalIdentityService;
    private processedNonces = new Set<string>();

    constructor(digitalIdentityService: DigitalIdentityService) {
        this.digitalIdentityService = digitalIdentityService;
    }

    public sendMessage(senderIdentity: DigitalIdentity, recipientId: string, type: string, payload: any): boolean {
        const timestamp = new Date().toISOString();
        const nonce = Math.random().toString(36).substring(2, 15) + timestamp;
        const messageData = JSON.stringify({ senderId: senderIdentity.id, recipientId, type, payload, timestamp, nonce });
        const signature = senderIdentity.sign(messageData);

        const message: AgentMessage = { senderId: senderIdentity.id, recipientId, type, payload, timestamp, nonce, signature };

        if (!this.digitalIdentityService.authenticate(message.senderId, messageData, message.signature)) {
            console.error(`Message from ${message.senderId} failed authentication.`);
            return false;
        }
        if (this.processedNonces.has(nonce)) {
            console.error(`Replay attack detected: Nonce ${nonce} already processed.`);
            return false;
        }

        this.processedNonces.add(nonce);
        const recipientListeners = this.listeners.get(recipientId);
        if (recipientListeners) {
            recipientListeners.forEach(listener => listener(message));
        } else {
            console.warn(`No listeners for agent ${recipientId}. Message sent but not consumed.`);
        }
        return true;
    }

    public subscribe(agentId: string, listener: (message: AgentMessage) => void): void {
        if (!this.listeners.has(agentId)) {
            this.listeners.set(agentId, []);
        }
        this.listeners.get(agentId)?.push(listener);
    }

    public unsubscribe(agentId: string, listener: (message: AgentMessage) => void): void {
        const currentListeners = this.listeners.get(agentId);
        if (currentListeners) {
            this.listeners.set(agentId, currentListeners.filter(l => l !== listener));
        }
    }
}

/**
 * The core structure for any autonomous agent. They are digital beings with an identity, a job,
 * a set of skills, and a penchant for leaving a very detailed paper trail.
 */
export interface Agent {
    id: string;
    name: string;
    role: string;
    digitalIdentity: DigitalIdentity;
    skills: Map<string, AgentSkill>;
    status: 'idle' | 'running' | 'paused' | 'error';
    auditLog: AgentLogEntry[];
    messageBus: AgentMessageBus;

    addSkill(skill: AgentSkill): void;
    execute(goal: string, context?: any): Promise<void>;
    logAction(action: string, details?: any): Promise<void>;
    sendMessage(recipientId: string, type: string, payload: any): boolean;
    handleMessage(message: AgentMessage): Promise<void>;
}

/**
 * An entry in an agent's audit log. It's the immutable diary of an AI, cryptographically
 * sealed to prevent any retroactive editing of history. Crucial for when things go wrong
 * and you need to know exactly which AI to blame.
 */
export interface AgentLogEntry {
    timestamp: string;
    action: string;
    details?: any;
    agentId: string;
    hash?: string;
}

/**
 * A pluggable skill that an agent can possess. Like a tool in a Swiss Army knife, each
 * skill gives an agent a specific, powerful capability.
 */
export interface AgentSkill {
    name: string;
    description: string;
    execute(context: any, agentIdentity: DigitalIdentity, messageBus: AgentMessageBus, auditLogger: SecureAuditLogger): Promise<string>;
}

/**
 * A secure, tamper-evident audit log system. It creates an immutable, hash-linked chain
 * of events, which is a fancy way of saying it's a digital tattletale that never forgets
 * and can't be bribed.
 * Commercial Value: Provides an indisputable record of all system activities, enabling
 * stringent compliance, facilitating rapid incident response, and building trust through
 * transparent, verifiable operations.
 */
export class SecureAuditLogger {
    private logs: AgentLogEntry[] = [];
    private lastHash: string = '';

    public async addEntry(entry: AgentLogEntry): Promise<AgentLogEntry> {
        const newEntry = { ...entry, timestamp: new Date().toISOString() };
        newEntry.hash = this.generateSimulatedHash(newEntry, this.lastHash);
        this.logs.push(newEntry);
        this.lastHash = newEntry.hash;
        return newEntry;
    }

    private generateSimulatedHash(entry: AgentLogEntry, prevHash: string): string {
        const data = JSON.stringify({ timestamp: entry.timestamp, action: entry.action, details: entry.details, agentId: entry.agentId, prevHash });
        return btoa(data).substring(0, 32);
    }

    public getLogs(): AgentLogEntry[] {
        return [...this.logs];
    }
}

// --- Governance Context Layer ---

/**
 * A policy for governance. It's the rulebook that keeps our highly intelligent, autonomous
 * agents from deciding to refactor the production database into a recipe for pancakes.
 */
export interface GovernancePolicy {
    id: string;
    name: string;
    description: string;
    rules: string[];
    enforce(context: any): boolean;
}

/**
 * The GovernancePolicyService manages and enforces governance policies. It is the stern,
 * but fair, digital bureaucrat of our system.
 * Commercial Value: Minimizes operational risk, ensures regulatory compliance, and provides
 * auditable policy enforcement, preventing unauthorized or non-compliant actions. It saves
 * the company from its own best intentions.
 */
export class GovernancePolicyService {
    private policies = new Map<string, GovernancePolicy>();

    constructor() {
        this.addPolicy({
            id: 'REF_001',
            name: 'RefactoringApprovalPolicy',
            description: 'Requires human approval for code modifications in critical modules.',
            rules: ['code_modification_requires_human_review'],
            enforce: (context: { filePath: string; isAutomated: boolean }) => {
                if (context.isAutomated && context.filePath.includes('payment_processor')) {
                    console.warn(`Policy REF_001 triggered: Automated modification of ${context.filePath} requires human review.`);
                    return false;
                }
                return true;
            }
        });
        this.addPolicy({
            id: 'TEST_001',
            name: 'AutomatedTestingPolicy',
            description: 'Requires successful automated tests after any code modification.',
            rules: ['all_tests_must_pass_after_modification'],
            enforce: (context: { testResult: 'pass' | 'fail' }) => context.testResult === 'pass'
        });
    }

    public addPolicy(policy: GovernancePolicy): void {
        this.policies.set(policy.id, policy);
    }

    public enforcePolicies(actionContext: any): boolean {
        for (const policy of Array.from(this.policies.values())) {
            if (!policy.enforce(actionContext)) {
                console.error(`Governance Policy ${policy.name} failed for action context:`, actionContext);
                return false;
            }
        }
        return true;
    }
}


// --- Agentic AI System - Skills ---

export class CodeMonitoringSkill implements AgentSkill {
    name = 'CodeMonitoringSkill';
    description = 'Monitors codebase health, identifies files, and detects potential refactoring opportunities or issues.';

    async execute(context: { filePath: string }, agentIdentity: DigitalIdentity, messageBus: AgentMessageBus, auditLogger: SecureAuditLogger): Promise<string> {
        await new Promise(r => setTimeout(r, 1000));
        messageBus.sendMessage(agentIdentity, GOVERNANCE_AGENT_ID, 'MONITORING_REPORT', { filePath: context.filePath, status: 'ok' });

        if (context.filePath.includes('payment_processor.py')) {
            const issue = `Identified opportunities for class-based refactoring in ${context.filePath} due to procedural design, improving modularity and testability.`;
            await auditLogger.addEntry({ action: `Monitoring detected issue`, details: { filePath: context.filePath, issue }, agentId: agentIdentity.id, timestamp: '' });
            return issue;
        }
        return `Successfully monitored ${context.filePath}. No immediate refactoring needs detected. Code health is good.`;
    }
}

export class RefactoringPlanningSkill implements AgentSkill {
    name = 'RefactoringPlanningSkill';
    description = 'Generates a detailed step-by-step refactoring plan using an AI.';
    private llmService: LLMService;

    constructor(llmService: LLMService) {
        this.llmService = llmService;
    }

    async execute(context: { goal: string; fileContent?: string }, agentIdentity: DigitalIdentity, messageBus: AgentMessageBus, auditLogger: SecureAuditLogger): Promise<string> {
        const prompt = `Given the goal: "${context.goal}", generate a step-by-step refactoring plan for a Python file. Focus on converting procedural functions into a class-based structure. Provide the plan concisely, numbered, and with clear actions for each step.`;
        await new Promise(r => setTimeout(r, 2000));
        try {
            const plan = await this.llmService.generateContent(prompt);
            messageBus.sendMessage(agentIdentity, GOVERNANCE_AGENT_ID, 'PLANNING_REPORT', { goal: context.goal, planSummary: plan.substring(0, 100) });
            return `Plan generated via ${this.llmService.provider}:\n${plan}`;
        } catch (error) {
            const errorMessage = `Error generating refactoring plan: ${error instanceof Error ? error.message : String(error)}.`;
            console.error(errorMessage, error);
            messageBus.sendMessage(agentIdentity, GOVERNANCE_AGENT_ID, 'PLANNING_ERROR', { goal: context.goal, error: errorMessage });
            return `${errorMessage} Providing a fallback plan. Fallback Plan: 1. Create a new class. 2. Move existing functions into methods. 3. Update calls.`;
        }
    }
}

export class CodeModificationSkill implements AgentSkill {
    name = 'CodeModificationSkill';
    description = 'Applies code changes based on a given refactoring step.';

    async execute(context: { step: string; filePath: string; attempt: number }, agentIdentity: DigitalIdentity, messageBus: AgentMessageBus, auditLogger: SecureAuditLogger): Promise<string> {
        await new Promise(r => setTimeout(r, 1500));
        if (context.attempt > 1) {
            return `Modification for step: "${context.step}" to ${context.filePath} was already applied or is idempotent. No further action needed.`;
        }
        messageBus.sendMessage(agentIdentity, GOVERNANCE_AGENT_ID, 'CODE_MODIFICATION_EVENT', { filePath: context.filePath, step: context.step });
        return `Applied modification for step: "${context.step}" to ${context.filePath}. Successfully integrated changes.`;
    }
}

export class TestingSkill implements AgentSkill {
    name = 'TestingSkill';
    description = 'Executes tests to verify code changes and ensure functionality is preserved.';

    async execute(context: { filePath: string; testCommand?: string }, agentIdentity: DigitalIdentity, messageBus: AgentMessageBus, auditLogger: SecureAuditLogger): Promise<string> {
        await new Promise(r => setTimeout(r, 1500));
        const testPass = Math.random() > 0.1;
        messageBus.sendMessage(agentIdentity, GOVERNANCE_AGENT_ID, 'TEST_RESULT', { filePath: context.filePath, result: testPass ? 'pass' : 'fail' });

        if (testPass) {
            return `Successfully ran tests for ${context.filePath}. All tests pass.`;
        } else {
            messageBus.sendMessage(agentIdentity, GOVERNANCE_AGENT_ID, 'TEST_FAILURE_ALERT', { filePath: context.filePath, error: 'Tests failed.' });
            throw new Error(`Tests failed for ${context.filePath}. Review and remediation required.`);
        }
    }
}

export class PolicyEnforcementSkill implements AgentSkill {
    name = 'PolicyEnforcementSkill';
    description = 'Enforces governance policies for agent actions.';
    private governancePolicyService: GovernancePolicyService;

    constructor(governancePolicyService: GovernancePolicyService) {
        this.governancePolicyService = governancePolicyService;
    }

    async execute(context: any, agentIdentity: DigitalIdentity, messageBus: AgentMessageBus, auditLogger: SecureAuditLogger): Promise<string> {
        const policyContext = { ...context, agentId: agentIdentity.id, agentRole: agentIdentity.role };
        const policiesMet = this.governancePolicyService.enforcePolicies(policyContext);

        if (policiesMet) {
            return `Policies checked for action '${context.actionType || "unknown"}' by ${agentIdentity.id}. All policies met.`;
        } else {
            throw new Error(`Policy violation detected for action '${context.actionType || "unknown"}' by ${agentIdentity.id}.`);
        }
    }
}


/**
 * The CodeArcheologistAgent is a specialized autonomous agent focused on improving code quality.
 * It's a digital craftsman, patiently chipping away at legacy code to reveal the masterpiece within.
 * Or, more often, to turn a tangled mess into a slightly less tangled mess. Progress is progress.
 */
export class CodeArcheologistAgent implements Agent {
    id: string; name: string; role: string; digitalIdentity: DigitalIdentity;
    skills = new Map<string, AgentSkill>();
    status: 'idle' | 'running' | 'paused' | 'error' = 'idle';
    auditLog: AgentLogEntry[] = [];
    messageBus: AgentMessageBus;
    private auditLogger: SecureAuditLogger;
    private logCallback: (entry: AgentLogEntry) => void;
    private governancePolicyService: GovernancePolicyService;

    constructor(
        id: string, name: string, role: string, digitalIdentity: DigitalIdentity, auditLogger: SecureAuditLogger,
        logCallback: (entry: AgentLogEntry) => void, messageBus: AgentMessageBus, governancePolicyService: GovernancePolicyService, llmService: LLMService
    ) {
        this.id = id; this.name = name; this.role = role; this.digitalIdentity = digitalIdentity;
        this.auditLogger = auditLogger; this.logCallback = logCallback; this.messageBus = messageBus;
        this.governancePolicyService = governancePolicyService;

        this.addSkill(new CodeMonitoringSkill());
        this.addSkill(new RefactoringPlanningSkill(llmService));
        this.addSkill(new CodeModificationSkill());
        this.addSkill(new TestingSkill());
        this.addSkill(new PolicyEnforcementSkill(this.governancePolicyService));
        this.messageBus.subscribe(this.id, this.handleMessage.bind(this));
    }

    addSkill(skill: AgentSkill): void { this.skills.set(skill.name, skill); }
    async logAction(action: string, details?: any): Promise<void> {
        const entry = await this.auditLogger.addEntry({ timestamp: '', action, details, agentId: this.id });
        this.auditLog.push(entry);
        this.logCallback(entry);
    }
    sendMessage(recipientId: string, type: string, payload: any): boolean { return this.messageBus.sendMessage(this.digitalIdentity, recipientId, type, payload); }
    async handleMessage(message: AgentMessage): Promise<void> { await this.logAction(`Received message from ${message.senderId} (Type: ${message.type})`, { payload: message.payload }); }

    async execute(goal: string, context?: any): Promise<void> {
        this.status = 'running';
        await this.logAction(`Initiating Refactoring Goal: ${goal}`, { agentStatus: this.status });
        let currentFilePath = 'payment_processor.py';

        try {
            await this.logAction('Enforcing policies before execution...', { skill: 'PolicyEnforcementSkill' });
            await this.skills.get('PolicyEnforcementSkill')?.execute({ actionType: 'initiate_refactoring', filePath: currentFilePath, isAutomated: true }, this.digitalIdentity, this.messageBus, this.auditLogger);

            await this.logAction(`Monitoring target file: ${currentFilePath}`, { skill: 'CodeMonitoringSkill' });
            const monitoringResult = await this.skills.get('CodeMonitoringSkill')?.execute({ filePath: currentFilePath }, this.digitalIdentity, this.messageBus, this.auditLogger);
            await this.logAction(`Monitoring complete: ${monitoringResult}`);

            await this.logAction('Generating refactoring plan...', { skill: 'RefactoringPlanningSkill' });
            const planResult = await this.skills.get('RefactoringPlanningSkill')?.execute({ goal }, this.digitalIdentity, this.messageBus, this.auditLogger);
            await this.logAction(planResult || 'Plan generation failed.');

            const planSteps = planResult?.split('\n').filter(line => line.match(/^\d+\./)) || [];
            if (planSteps.length === 0) throw new Error('No valid refactoring plan could be generated. Aborting.');

            for (let i = 0; i < planSteps.length; i++) {
                const step = planSteps[i];
                let attempt = 0;
                let stepSuccess = false;
                while (!stepSuccess && attempt < 3) {
                    attempt++;
                    try {
                        await this.logAction(`Enforcing policies before step ${i + 1} modification...`, { skill: 'PolicyEnforcementSkill' });
                        await this.skills.get('PolicyEnforcementSkill')?.execute({ actionType: 'code_modification', filePath: currentFilePath, isAutomated: true, step }, this.digitalIdentity, this.messageBus, this.auditLogger);

                        await this.logAction(`Executing Step ${i + 1}/${planSteps.length}: ${step}`, { skill: 'CodeModificationSkill' });
                        const modResult = await this.skills.get('CodeModificationSkill')?.execute({ step, filePath: currentFilePath, attempt }, this.digitalIdentity, this.messageBus, this.auditLogger);
                        await this.logAction(modResult);

                        await this.logAction(`Running tests after Step ${i + 1}...`, { skill: 'TestingSkill' });
                        const testResult = await this.skills.get('TestingSkill')?.execute({ filePath: currentFilePath }, this.digitalIdentity, this.messageBus, this.auditLogger);
                        await this.logAction(testResult);

                        await this.logAction(`Enforcing policies after step ${i + 1} tests...`, { skill: 'PolicyEnforcementSkill' });
                        await this.skills.get('PolicyEnforcementSkill')?.execute({ actionType: 'post_modification_test', testResult: 'pass' }, this.digitalIdentity, this.messageBus, this.auditLogger);
                        
                        stepSuccess = true;
                    } catch (stepError) {
                        await this.logAction(`Error during Step ${i + 1} (Attempt ${attempt}): ${stepError instanceof Error ? stepError.message : String(stepError)}`, { agentStatus: 'error' });
                        if (attempt >= 3) throw new Error(`Step ${i + 1} failed after multiple attempts.`);
                        await this.logAction(`Retrying Step ${i + 1}...`, { delay: '2s' });
                        await new Promise(r => setTimeout(r, 2000));
                    }
                }
            }
            await this.logAction('Refactoring complete. Awaiting human review.', { result: 'success' });
        } catch (error) {
            this.status = 'error';
            await this.logAction(`A critical error occurred: ${error instanceof Error ? error.message : String(error)}. Escalating.`, { agentStatus: 'error' });
            console.error('CodeArcheologistAgent error:', error);
        } finally {
            this.status = 'idle';
        }
    }
}

/**
 * The AgentOrchestrator manages the lifecycle and coordination of multiple autonomous agents.
 * It's the conductor of our digital orchestra, ensuring everyone plays in harmony. Or at least,
 * ensuring the ensuing cacophony is well-documented and auditable.
 * Commercial Value: Provides a robust and scalable framework for intelligent automation,
 * maximizing operational efficiency, and ensuring cryptographic integrity across all automated processes.
 * This is the central nervous system for advanced financial automation.
 */
export class AgentOrchestrator {
    private agents = new Map<string, Agent>();
    private auditLogger: SecureAuditLogger;
    private messageBus: AgentMessageBus;
    private digitalIdentityService: DigitalIdentityService;
    private governancePolicyService: GovernancePolicyService;
    private logCallback: (entry: AgentLogEntry) => void;
    public status: 'idle' | 'running' | 'error' = 'idle';

    constructor(
        auditLogger: SecureAuditLogger, messageBus: AgentMessageBus, digitalIdentityService: DigitalIdentityService,
        governancePolicyService: GovernancePolicyService, logCallback: (entry: AgentLogEntry) => void, llmService: LLMService
    ) {
        this.auditLogger = auditLogger; this.messageBus = messageBus; this.digitalIdentityService = digitalIdentityService;
        this.governancePolicyService = governancePolicyService; this.logCallback = logCallback;

        const archeologistIdentity = this.digitalIdentityService.createIdentity(CODE_ARCHEOLOGIST_AGENT_ID, 'CodeRefactorAgent');
        const governanceIdentity = this.digitalIdentityService.createIdentity(GOVERNANCE_AGENT_ID, 'GovernanceAgent');

        this.addAgent(new CodeArcheologistAgent(
            CODE_ARCHEOLOGIST_AGENT_ID, 'CodeArcheologistBot', 'CodeRefactorAgent', archeologistIdentity,
            this.auditLogger, this.logCallback, this.messageBus, this.governancePolicyService, llmService
        ));

        this.addAgent({
            id: GOVERNANCE_AGENT_ID, name: 'PolicyEnforcerBot', role: 'GovernanceAgent', digitalIdentity: governanceIdentity,
            skills: new Map(), status: 'idle', auditLog: [], messageBus: this.messageBus, addSkill: () => {},
            execute: async () => {}, logAction: this.logAction.bind(this),
            sendMessage: (r, t, p) => this.messageBus.sendMessage(governanceIdentity, r, t, p),
            handleMessage: async (message) => {
                await this.logAction(`Governance Agent received message from ${message.senderId}`, { type: message.type });
                if (message.type === 'TEST_FAILURE_ALERT') {
                    await this.logAction(`Governance Alert: Test failure reported for ${message.payload.filePath}. Remediation required.`, { severity: 'high' });
                }
            }
        });
    }

    public addAgent(agent: Agent): void { this.agents.set(agent.id, agent); }
    public getAgent(id: string): Agent | undefined { return this.agents.get(id); }
    public async logAction(action: string, details?: any): Promise<void> {
        const entry = await this.auditLogger.addEntry({ timestamp: '', action, details, agentId: SYSTEM_AGENT_ID });
        this.logCallback(entry);
    }

    public async startWorkflow(workflowGoal: string): Promise<void> {
        this.status = 'running';
        await this.logAction(`Orchestrator initiating workflow: ${workflowGoal}`, { status: this.status });
        const archeologistAgent = this.getAgent(CODE_ARCHEOLOGIST_AGENT_ID);
        if (!archeologistAgent) {
            await this.logAction('Code Archeologist Agent not found.', { severity: 'critical' });
            this.status = 'error';
            return;
        }

        try {
            await this.logAction(`Delegating refactoring task to ${archeologistAgent.name}...`);
            await archeologistAgent.execute(workflowGoal);
            await this.logAction(`Workflow '${workflowGoal}' completed.`, { status: archeologistAgent.status });
        } catch (error) {
            this.status = 'error';
            await this.logAction(`Orchestrator detected a critical error: ${error instanceof Error ? error.message : String(error)}`, { status: this.status });
        } finally {
            this.status = 'idle';
            await this.logAction(`Orchestrator workflow finished.`, { status: this.status });
        }
    }
}


const CodeArcheologistView: React.FC = () => {
    const [goal, setGoal] = useState('Refactor the Python `payment_processor` service to use a class-based structure instead of standalone functions.');
    const [logEntries, setLogEntries] = useState<AgentLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [orchestratorStatus, setOrchestratorStatus] = useState<AgentOrchestrator['status']>('idle');
    const [apiKey, setApiKey] = useState('');
    const [apiProvider, setApiProvider] = useState<'Google' | 'OpenAI' | 'Anthropic' | 'Mock'>('Mock');
    const logContainerRef = useRef<HTMLDivElement>(null);

    const { orchestrator } = useMemo(() => {
        const digitalIdentityService = new DigitalIdentityService();
        const auditLogger = new SecureAuditLogger();
        const messageBus = new AgentMessageBus(digitalIdentityService);
        const governancePolicyService = new GovernancePolicyService();
        
        let llmService: LLMService;
        switch (apiProvider) {
            case 'Google':
                // Assuming Google GenAI SDK is loaded via a script tag for this simulation
                llmService = apiKey ? new GeminiService(apiKey) : new MockLLMService();
                break;
            case 'OpenAI':
                llmService = apiKey ? new OpenAIService(apiKey) : new MockLLMService();
                break;
            case 'Anthropic':
                llmService = apiKey ? new AnthropicService(apiKey) : new MockLLMService();
                break;
            default:
                llmService = new MockLLMService();
        }
        
        const orchestratorInstance = new AgentOrchestrator(
            auditLogger, messageBus, digitalIdentityService, governancePolicyService,
            (entry) => setLogEntries(prev => [...prev, entry]),
            llmService
        );

        return { orchestrator: orchestratorInstance };
    }, [apiKey, apiProvider]);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logEntries]);

    const runSimulation = useCallback(async () => {
        if ((apiProvider !== 'Mock' && !apiKey)) {
            alert(`Please enter an API key for the ${apiProvider} provider.`);
            return;
        }
        setIsLoading(true);
        setLogEntries([]);
        setOrchestratorStatus('running');

        try {
            await orchestrator.startWorkflow(goal);
        } catch (error) {
            const errorMessage = `View-level error: ${error instanceof Error ? error.message : String(error)}`;
            setLogEntries(prev => [...prev, {
                timestamp: new Date().toISOString(), action: 'Orchestrator Workflow Error',
                details: errorMessage, agentId: SYSTEM_AGENT_ID, hash: ''
            }]);
            setOrchestratorStatus('error');
        } finally {
            setIsLoading(false);
            setOrchestratorStatus(orchestrator.status);
        }
    }, [goal, orchestrator, apiKey, apiProvider]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">Blueprint 112: Code Archeologist Agent Workflow (Orchestrated)</h1>
            
            <Card title="AI Configuration">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-300 mb-1">AI Provider</label>
                        <select
                            value={apiProvider}
                            onChange={e => setApiProvider(e.target.value as any)}
                            className="w-full bg-gray-700/50 p-2 rounded text-white focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            <option value="Mock">Mock (No Key Needed)</option>
                            <option value="Google">Google Gemini</option>
                            <option value="OpenAI">OpenAI GPT</option>
                            <option value="Anthropic">Anthropic Claude</option>
                        </select>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-300 mb-1">API Key ({apiProvider})</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            className="w-full bg-gray-700/50 p-2 rounded text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder={apiProvider === 'Mock' ? 'Not Required' : `Enter your ${apiProvider} API Key`}
                            disabled={apiProvider === 'Mock'}
                        />
                    </div>
                </div>
            </Card>

            <Card title="Agentic Refactoring Goal & Orchestration">
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-700/50 p-3 rounded text-white text-lg focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Enter the refactoring goal for the agent..."
                    aria-label="Refactoring Goal Input"
                />
                <button
                    onClick={runSimulation}
                    disabled={isLoading || orchestratorStatus === 'running'}
                    className={`w-full mt-4 py-2 rounded transition-colors text-lg font-semibold ${isLoading || orchestratorStatus === 'running'
                        ? 'bg-gray-600 cursor-not-allowed opacity-70'
                        : 'bg-cyan-600 hover:bg-cyan-700'
                    }`}
                >
                    {isLoading ? 'Orchestrator Working...' : `Start Autonomous Refactor Workflow`}
                </button>
            </Card>

            {(isLoading || logEntries.length > 0) && (
                <Card title="Agent Orchestration Audit Log">
                    <div ref={logContainerRef} className="space-y-2 max-h-[60vh] overflow-y-auto p-2 font-mono text-xs text-gray-300 whitespace-pre-wrap break-words bg-gray-800 rounded">
                        {logEntries.map((entry, i) => (
                            <div key={i} className="flex items-start">
                                <span className="text-gray-500 mr-2 min-w-[100px] flex-shrink-0">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                                <div className={
                                    entry.action.toLowerCase().includes('error') || entry.action.toLowerCase().includes('fail') || entry.action.toLowerCase().includes('abort') || entry.action.toLowerCase().includes('alert') || entry.action.toLowerCase().includes('violation')
                                        ? 'text-red-400'
                                        : entry.agentId === SYSTEM_AGENT_ID ? 'text-purple-400'
                                        : entry.agentId === GOVERNANCE_AGENT_ID ? 'text-yellow-400'
                                        : 'text-green-400'
                                }>
                                    <span className="font-bold mr-1">
                                        [{entry.agentId === SYSTEM_AGENT_ID ? 'ORCH' : entry.agentId === GOVERNANCE_AGENT_ID ? 'GOV' : 'ARCH'}]
                                    </span>
                                    {entry.action}
                                    {entry.hash && <span className="text-gray-600 ml-2">Hash: {entry.hash.substring(0, 8)}...</span>}
                                    {entry.details && typeof entry.details === 'object' && (
                                        <pre className="text-gray-500 text-xs mt-1 ml-2 overflow-x-auto bg-gray-900/50 p-1 rounded">{JSON.stringify(entry.details, null, 2)}</pre>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && <p className="text-cyan-400 animate-pulse mt-2">Orchestrator is actively managing agents...</p>}
                    </div>
                </Card>
            )}
            <Card title="System Overview & Governance">
                <div className="text-sm text-gray-400 space-y-2">
                    <p><span className="font-semibold text-white">Orchestrator ID:</span> {SYSTEM_AGENT_ID}</p>
                    <p><span className="font-semibold text-white">Current Orchestrator Status:</span> <span className={`font-bold ${orchestratorStatus === 'running' ? 'text-cyan-400' : orchestratorStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>{orchestratorStatus.toUpperCase()}</span></p>
                    <p className="pt-2 text-cyan-200">
                        This orchestrator manages a multi-agent system, operating under strict governance policies,
                        with every action and communication logged to a tamper-evident audit trail.
                        Digital identities ensure agents perform only permitted operations,
                        reducing operational risk and providing full transparency for all automated
                        code transformations within this next-generation financial infrastructure.
                    </p>
                    <p className="pt-2 text-purple-200">
                        <span className="font-semibold text-white">Managed Agents:</span>
                        <ul className="list-disc list-inside">
                            <li>Code Archeologist Agent ({CODE_ARCHEOLOGIST_AGENT_ID}): Focuses on code quality and refactoring.</li>
                            <li>Governance Agent ({GOVERNANCE_AGENT_ID}): Monitors policy compliance and responds to alerts.</li>
                        </ul>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default CodeArcheologistView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/blueprints/CodeArcheologistView.tsx
================================================================================

// components/views/blueprints/CodeArcheologistView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

const CodeArcheologistView: React.FC = () => {
    const [goal, setGoal] = useState('Refactor the Python `payment_processor` service to use a class-based structure instead of standalone functions.');
    const [log, setLog] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const runSimulation = async () => {
        setIsLoading(true);
        setLog([]);
        
        const addLog = (content: string) => setLog(prev => [...prev, content]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            addLog('Goal Received. Reading relevant files: `payment_processor.py`...');
            await new Promise(r => setTimeout(r, 1500));

            const planPrompt = `Generate a step-by-step plan to refactor a Python file from functions to a class.`;
            addLog('Generating refactoring plan...');
            const planResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: planPrompt });
            addLog(`Plan generated:\n${planResponse.text}`);
            await new Promise(r => setTimeout(r, 2000));
            
            addLog('Executing Step 1: Create `PaymentProcessor` class structure...');
            await new Promise(r => setTimeout(r, 1500));
            addLog('Running tests... All tests pass.');
            await new Promise(r => setTimeout(r, 2000));

            addLog('Executing Step 2: Move `process_payment` into the class...');
            await new Promise(r => setTimeout(r, 1500));
            addLog('Running tests... All tests pass.');
            await new Promise(r => setTimeout(r, 2000));

            addLog('Refactoring complete. Submitting pull request for human review...');

        } catch (error) {
            addLog('An error occurred during the refactoring cycle.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">Blueprint 112: Code Archeologist</h1>
            <Card title="Refactoring Goal">
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-700/50 p-3 rounded text-white text-lg focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={runSimulation} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                    {isLoading ? 'Refactoring...' : 'Start Autonomous Refactor'}
                </button>
            </Card>

            {(isLoading || log.length > 0) && (
                <Card title="Agent Log">
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto p-2 font-mono text-xs text-gray-300 whitespace-pre-line">
                        {log.map((entry, i) => <p key={i}>{`[${new Date().toLocaleTimeString()}] ${entry}`}</p>)}
                         {isLoading && <p className="text-yellow-400 animate-pulse">Working...</p>}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default CodeArcheologistView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/blueprints/CodeArcheologistView.tsx
================================================================================

// components/views/blueprints/CodeArcheologistView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

const CodeArcheologistView: React.FC = () => {
    const [goal, setGoal] = useState('Refactor the Python `payment_processor` service to use a class-based structure instead of standalone functions.');
    const [log, setLog] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const runSimulation = async () => {
        setIsLoading(true);
        setLog([]);
        
        const addLog = (content: string) => setLog(prev => [...prev, content]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            addLog('Goal Received. Reading relevant files: `payment_processor.py`...');
            await new Promise(r => setTimeout(r, 1500));

            const planPrompt = `Generate a step-by-step plan to refactor a Python file from functions to a class.`;
            addLog('Generating refactoring plan...');
            const planResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: planPrompt });
            addLog(`Plan generated:\n${planResponse.text}`);
            await new Promise(r => setTimeout(r, 2000));
            
            addLog('Executing Step 1: Create `PaymentProcessor` class structure...');
            await new Promise(r => setTimeout(r, 1500));
            addLog('Running tests... All tests pass.');
            await new Promise(r => setTimeout(r, 2000));

            addLog('Executing Step 2: Move `process_payment` into the class...');
            await new Promise(r => setTimeout(r, 1500));
            addLog('Running tests... All tests pass.');
            await new Promise(r => setTimeout(r, 2000));

            addLog('Refactoring complete. Submitting pull request for human review...');

        } catch (error) {
            addLog('An error occurred during the refactoring cycle.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">Blueprint 112: Code Archeologist</h1>
            <Card title="Refactoring Goal">
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-700/50 p-3 rounded text-white text-lg focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={runSimulation} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                    {isLoading ? 'Refactoring...' : 'Start Autonomous Refactor'}
                </button>
            </Card>

            {(isLoading || log.length > 0) && (
                <Card title="Agent Log">
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto p-2 font-mono text-xs text-gray-300 whitespace-pre-line">
                        {log.map((entry, i) => <p key={i}>{`[${new Date().toLocaleTimeString()}] ${entry}`}</p>)}
                         {isLoading && <p className="text-yellow-400 animate-pulse">Working...</p>}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default CodeArcheologistView;
