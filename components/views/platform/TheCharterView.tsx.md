// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/TheCharterView.tsx.md
================================================================================

---
```typescript
import React, { useState, useEffect, useReducer, useContext, useCallback, useMemo, FC, ReactNode } from 'react';

// For a real project, these would be installed via npm/yarn.
// We'll assume they are available for this component.
// import {
//     Box, Grid, Card, CardContent, Typography, Button, Modal, TextField,
//     Select, MenuItem, InputLabel, FormControl, Chip, IconButton, Switch,
//     List, ListItem, ListItemText, Divider, Tabs, Tab, CircularProgress,
//     Alert, Snackbar, Tooltip, Paper, Accordion, AccordionSummary, AccordionDetails
// } from '@mui/material';
// import {
//     AddCircleOutline, Edit, Delete, CheckCircle, Cancel, Gavel, History,
//     BarChart, Lightbulb, ExpandMore, AccountBalance, HealthAndSafety,
//     Code, People, Public
// } from '@mui/icons-material';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';


namespace TheCreatorsCharter {
    // --- CORE TYPES AND INTERFACES (EXPANDED) ---

    export type Principle = string;
    export type Charter = ReadonlyArray<Principle>;
    export type MandateStatus = "Pending Signature" | "Granted" | "Revoked" | "Expired" | "Under Review";
    export type UUID = string;
    export type ISO8601Timestamp = string;
    
    export enum PriorityLevel {
        SUGGESTION = 0, // AI can suggest this, but it's not binding.
        TRIVIAL = 1,
        LOW = 2,
        MEDIUM = 3,
        HIGH = 4,
        CRITICAL = 5,
        ABSOLUTE = 6, // Violation immediately blocks action.
    }

    export enum PrincipleCategory {
        FINANCIAL = "FINANCIAL",
        ETHICAL = "ETHICAL",
        OPERATIONAL = "OPERATIONAL",
        HEALTH_WELLBEING = "HEALTH_WELLBEING",
        PROFESSIONAL_DEVELOPMENT = "PROFESSIONAL_DEVELOPMENT",
        PERSONAL_RELATIONSHIPS = "PERSONAL_RELATIONSHIPS",
        SECURITY_PRIVACY = "SECURITY_PRIVACY",
        SOCIAL_IMPACT = "SOCIAL_IMPACT",
        ENVIRONMENTAL = "ENVIRONMENTAL",
        INTELLECTUAL_CURIOSITY = "INTELLECTUAL_CURIOSITY",
        CUSTOM = "CUSTOM",
    }
    
    export enum PrincipleAuthor {
        CREATOR = "CREATOR",
        AI_SUGGESTED = "AI_SUGGESTED",
        TEMPLATE = "TEMPLATE"
    }

    export enum ExternalDataSource {
        PLAID = "PLAID",
        ALPHA_VANTAGE = "ALPHA_VANTAGE",
        REFINITIV_ESG = "REFINITIV_ESG",
        OURA_RING = "OURA_RING",
        WHOOP_STRAP = "WHOOP_STRAP",
        GOOGLE_CALENDAR = "GOOGLE_CALENDAR",
        TODOIST = "TODOIST"
    }

    export interface StructuredPrinciple {
        id: UUID;
        naturalLanguage: Principle;
        category: PrincipleCategory;
        priority: PriorityLevel;
        conditions: Condition[];
        actions: Action[];
        createdAt: ISO8601Timestamp;
        updatedAt: ISO8601Timestamp;
        tags: string[];
        isMutable: boolean; // Can the AI suggest modifications to this principle?
        explanation?: string; // Creator's rationale for the principle.
        author: PrincipleAuthor;
        version: number;
        nextReviewDate?: ISO8601Timestamp;
    }

    export enum ConditionEvaluator {
        // NUMERIC
        GreaterThan = 'GreaterThan',
        LessThan = 'LessThan',
        EqualTo = 'EqualTo',
        NotEqualTo = 'NotEqualTo',
        Between = 'Between',
        // STRING
        Contains = 'Contains',
        NotContains = 'NotContains',
        StartsWith = 'StartsWith',
        EndsWith = 'EndsWith',
        In = 'In', // Is value in a list
        NotIn = 'NotIn',
        // TEMPORAL
        HappenedSince = 'HappenedSince',
        HappenedBefore = 'HappenedBefore',
        IsWeekday = 'IsWeekday',
        IsWeekend = 'IsWeekend',
        // BOOLEAN
        IsTrue = 'IsTrue',
        IsFalse = 'IsFalse',
        // EVENT
        Occurs = 'Occurs'
    }

    export interface Condition {
        type: "DataPoint" | "Time" | "Event" | "State" | "ExternalData";
        evaluator: ConditionEvaluator;
        parameters: Record<string, any>;
        dataSource?: ExternalDataSource; // For ExternalData type
    }
    
    export enum ActionType {
        // Control flow
        Forbid = "Forbid",
        Require = "Require",
        Modify = "Modify",
        // Communication
        Alert = "Alert",
        Notify = "Notify", // Less urgent than Alert
        Escalate = "Escalate",
        // Recommendation
        Recommend = "Recommend",
        // Logging & Analytics
        Log = "Log",
        // Optimization
        Optimize = "Optimize"
    }

    export interface Action {
        type: ActionType;
        target: string; // e.g., 'Transaction', 'Investment', 'Communication', 'CalendarEvent'
        details?: Record<string, any>;
        escalationPolicy?: {
            afterAttempts: number;
            escalateTo: "Creator" | "Support" | "Guardian";
        };
    }

    export type StructuredCharter = ReadonlyArray<StructuredPrinciple>;

    export interface CharterVersion {
        versionId: UUID;
        charter: StructuredCharter;
        timestamp: ISO8601Timestamp;
        changeLog: string; // Description of changes from the previous version.
        author: PrincipleAuthor | 'SYSTEM';
    }

    export interface DecisionContext {
        decisionId: UUID;
        timestamp: ISO8601Timestamp;
        category: PrincipleCategory;
        proposedAction: Record<string, any>;
        metadata?: Record<string, any>;
        trigger: "AI_PROACTIVE" | "CREATOR_REQUEST" | "SYSTEM_EVENT";
    }

    export interface ComplianceCheckResult {
        isCompliant: boolean;
        violatedPrinciples: Array<{ principleId: UUID; reason: string; priority: PriorityLevel }>;
        consultedPrinciples: UUID[];
        suggestedModifications?: Record<string, any>;
        confidenceScore: number; // 0.0 to 1.0
        reasoningTrace: string[]; // Step-by-step explanation of the compliance check
    }
    
    export interface DecisionLogEntry {
        logId: UUID;
        decisionContext: DecisionContext;
        complianceResult: ComplianceCheckResult;
        finalAction: "Proceed" | "Block" | "AlertCreator" | "ModifiedProceed";
        outcome: string;
        timestamp: ISO8601Timestamp;
        feedback?: {
            rating: 1 | 2 | 3 | 4 | 5;
            comment: string;
        };
    }

    // --- CUSTOM ERROR CLASSES ---

    export class CharterError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'CharterError';
        }
    }
    
    export class MandateError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'MandateError';
        }
    }
    
    export class ComplianceError extends Error {
        constructor(message: string, public readonly context?: any) {
            super(message);
            this.name = 'ComplianceError';
        }
    }
    
    export class PrincipleValidationError extends CharterError {
        constructor(message: string, public readonly principle: Partial<StructuredPrinciple>) {
            super(message);
            this.name = 'PrincipleValidationError';
        }
    }
    
    // --- MOCK UTILITIES ---

    export function generateUUID(): UUID {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    export function getCurrentTimestamp(): ISO8601Timestamp {
        return new Date().toISOString();
    }
    
    // --- EVENT EMITTER FOR APPLICATION-WIDE COMMUNICATION ---
    
    export type EventListener<T> = (data: T) => void;

    export class EventEmitter {
        private listeners: Record<string, Array<EventListener<any>>> = {};
    
        public on<T>(eventName: string, listener: EventListener<T>): () => void {
            if (!this.listeners[eventName]) {
                this.listeners[eventName] = [];
            }
            this.listeners[eventName].push(listener);
            
            return () => {
                this.listeners[eventName] = this.listeners[eventName].filter(l => l !== listener);
            };
        }
    
        public emit<T>(eventName: string, data: T): void {
            if (this.listeners[eventName]) {
                this.listeners[eventName].forEach(listener => {
                    try {
                        listener(data);
                    } catch (error) {
                        console.error(`Error in event listener for ${eventName}:`, error);
                    }
                });
            }
        }
    }

    export const GlobalAppEvents = new EventEmitter();

    // --- MOCK PERSISTENCE LAYER ---
    
    export class InMemoryDatabase {
        private static instance: InMemoryDatabase;
        private data: Map<string, any> = new Map();
        
        private constructor() {}

        public static getInstance(): InMemoryDatabase {
            if (!InMemoryDatabase.instance) {
                InMemoryDatabase.instance = new InMemoryDatabase();
            }
            return InMemoryDatabase.instance;
        }

        public set<T>(key: string, value: T): void {
            this.data.set(key, JSON.stringify(value));
        }
        
        public get<T>(key: string): T | null {
            const storedValue = this.data.get(key);
            if (storedValue) {
                return JSON.parse(storedValue) as T;
            }
            return null;
        }

        public delete(key: string): boolean { return this.data.delete(key); }
        public clear(): void { this.data.clear(); }
    }

    // --- NLP & AI SERVICES (MOCK) ---
    export class NlpService {
        public static async parsePrincipleFromText(text: string): Promise<Partial<StructuredPrinciple>> {
            console.log(`[NLP Service] Parsing principle: "${text}"`);
            // Simulate API call to Gemini/ChatGPT
            await new Promise(res => setTimeout(res, 500)); 

            const pLower = text.toLowerCase();
            let category = PrincipleCategory.CUSTOM;
            if (pLower.includes("invest") || pLower.includes("income") || pLower.includes("fund") || pLower.includes("spending")) category = PrincipleCategory.FINANCIAL;
            if (pLower.includes("esg") || pLower.includes("ethical")) category = PrincipleCategory.ETHICAL;
            if (pLower.includes("health") || pLower.includes("sleep") || pLower.includes("exercise")) category = PrincipleCategory.HEALTH_WELLBEING;
            if (pLower.includes("learn") || pLower.includes("skill") || pLower.includes("course")) category = PrincipleCategory.PROFESSIONAL_DEVELOPMENT;

            // This is a very simplistic inference logic. A real LLM would provide a much richer JSON structure.
            return {
                naturalLanguage: text,
                category,
                priority: pLower.includes("never") || pLower.includes("always") ? PriorityLevel.CRITICAL : PriorityLevel.MEDIUM,
                tags: text.split(' ').filter(word => word.length > 3 && !['the', 'and', 'for', 'with'].includes(word)),
                explanation: `AI interpretation of the core intent behind "${text}".`,
            };
        }
    }

    // --- ENHANCED TheCreator CLASS ---

    class TheCreator {
        private charter: Charter;
        private mandateStatus: MandateStatus;
        private structuredCharter: StructuredCharter;
        private charterHistory: CharterVersion[] = [];
        public readonly id: UUID;
        private db: InMemoryDatabase;

        constructor(id?: UUID) {
            this.id = id || generateUUID();
            this.db = InMemoryDatabase.getInstance();
            this.mandateStatus = "Pending Signature";

            const loadedState = this.loadFromPersistence();
            if (loadedState) {
                this.charter = loadedState.charter;
                this.structuredCharter = loadedState.structuredCharter;
                this.charterHistory = loadedState.charterHistory;
                this.mandateStatus = loadedState.mandateStatus;
            } else {
                this.charter = [
                    "My risk tolerance is aggressive in pursuit of long-term growth, but I will never invest in entities with an ESG rating below A-.",
                    "Dedicate 10% of all freelance income directly to the 'Down Payment' goal, bypassing my main account.",
                    "Maintain a liquid emergency fund equal to six months of expenses. If it dips below, prioritize replenishing it above all other discretionary spending.",
                ];
                this.structuredCharter = this.parseCharter(this.charter);
                this.archiveCurrentCharter("Initial Charter creation.", 'SYSTEM');
            }
        }

        private saveToPersistence(): void {
            const state = {
                charter: this.charter,
                structuredCharter: this.structuredCharter,
                charterHistory: this.charterHistory,
                mandateStatus: this.mandateStatus
            };
            this.db.set(`creator_${this.id}`, state);
        }

        private loadFromPersistence(): any | null {
            return this.db.get(`creator_${this.id}`);
        }

        private parseCharter(charter: Charter): StructuredCharter {
             return charter.map(p => {
                const newPrinciple: StructuredPrinciple = {
                    id: generateUUID(),
                    naturalLanguage: p,
                    category: this.inferCategory(p),
                    priority: PriorityLevel.MEDIUM,
                    conditions: this.inferConditions(p),
                    actions: this.inferActions(p),
                    createdAt: getCurrentTimestamp(),
                    updatedAt: getCurrentTimestamp(),
                    tags: this.inferTags(p),
                    isMutable: true,
                    author: PrincipleAuthor.CREATOR,
                    version: 1
                };
                return newPrinciple;
            });
        }
        
        private inferCategory(principle: Principle): PrincipleCategory {
            const pLower = principle.toLowerCase();
            if (pLower.includes("invest") || pLower.includes("income") || pLower.includes("fund") || pLower.includes("spending")) return PrincipleCategory.FINANCIAL;
            if (pLower.includes("esg") || pLower.includes("ethical")) return PrincipleCategory.ETHICAL;
            if (pLower.includes("health") || pLower.includes("sleep") || pLower.includes("exercise")) return PrincipleCategory.HEALTH_WELLBEING;
            return PrincipleCategory.CUSTOM;
        }
        
        private inferConditions(principle: Principle): Condition[] {
            if (principle.includes("ESG rating below A-")) {
                return [{
                    type: "ExternalData", dataSource: ExternalDataSource.REFINITIV_ESG,
                    evaluator: ConditionEvaluator.LessThan,
                    parameters: { dataKey: "investment.esgRating", value: "A-" }
                }];
            }
             if (principle.includes("freelance income")) {
                return [{
                    type: "Event", evaluator: ConditionEvaluator.Occurs,
                    parameters: { eventType: "IncomeReceived", source: "freelance" }
                }];
            }
            if (principle.includes("emergency fund dips below")) {
                return [{
                    type: "State", evaluator: ConditionEvaluator.LessThan,
                    parameters: { stateKey: "emergencyFundBalance", valuePath: "sixMonthsExpenses" }
                }];
            }
            return [];
        }
        
        private inferActions(principle: Principle): Action[] {
            if (principle.includes("never invest")) {
                return [{ type: ActionType.Forbid, target: "Investment" }];
            }
            if (principle.includes("Dedicate 10%")) {
                return [{ type: ActionType.Require, target: "Transaction", details: { amountPercentage: 0.10, from: "source.income", to: "goal.Down Payment" } }];
            }
            if (principle.includes("prioritize replenishing")) {
                return [{ type: ActionType.Modify, target: "Budget.Discretionary", details: { newAllocation: 0 } }, { type: ActionType.Require, target: "Savings", details: { destination: "emergencyFund" } }];
            }
            return [];
        }

        private inferTags(principle: Principle): string[] {
            const tags = new Set<string>();
            const pLower = principle.toLowerCase();
            if (pLower.includes("invest")) tags.add("investment");
            if (pLower.includes("income")) tags.add("income");
            if (pLower.includes("esg")) tags.add("esg");
            if (pLower.includes("fund")) tags.add("savings");
            return Array.from(tags);
        }

        private archiveCurrentCharter(changeLog: string, author: PrincipleAuthor | 'SYSTEM'): void {
            const newVersion: CharterVersion = {
                versionId: generateUUID(),
                charter: JSON.parse(JSON.stringify(this.structuredCharter)),
                timestamp: getCurrentTimestamp(),
                changeLog: changeLog,
                author: author
            };
            this.charterHistory.push(newVersion);
        }
        
        public addStructuredPrinciple(principle: Omit<StructuredPrinciple, 'id' | 'createdAt' | 'updatedAt' | 'version'>): void {
            const newPrinciple: StructuredPrinciple = {
                ...principle,
                id: generateUUID(),
                createdAt: getCurrentTimestamp(),
                updatedAt: getCurrentTimestamp(),
                version: 1,
            };
            this.structuredCharter = [...this.structuredCharter, newPrinciple];
            this.charter = [...this.charter, principle.naturalLanguage];
            this.archiveCurrentCharter(`Added: "${principle.naturalLanguage}"`, principle.author);
            this.saveToPersistence();
            GlobalAppEvents.emit('charter:updated', { creatorId: this.id });
        }
        
        public updateStructuredPrinciple(principleId: UUID, updates: Partial<Omit<StructuredPrinciple, 'id' | 'createdAt'>>): void {
            const principleIndex = this.structuredCharter.findIndex(p => p.id === principleId);
            if (principleIndex === -1) throw new CharterError(`Principle with ID ${principleId} not found.`);

            const originalPrinciple = this.structuredCharter[principleIndex];
            const updatedPrinciple: StructuredPrinciple = { 
                ...originalPrinciple, 
                ...updates, 
                updatedAt: getCurrentTimestamp(),
                version: originalPrinciple.version + 1,
            };
            
            const newCharter = [...this.structuredCharter];
            newCharter[principleIndex] = updatedPrinciple;
            this.structuredCharter = newCharter;
            
            if (updates.naturalLanguage) {
                const simpleIndex = this.charter.indexOf(originalPrinciple.naturalLanguage);
                if (simpleIndex > -1) {
                    const newSimpleCharter = [...this.charter];
                    newSimpleCharter[simpleIndex] = updates.naturalLanguage;
                    this.charter = newSimpleCharter;
                }
            }

            this.archiveCurrentCharter(`Updated: "${updatedPrinciple.naturalLanguage}"`, PrincipleAuthor.CREATOR);
            this.saveToPersistence();
            GlobalAppEvents.emit('charter:updated', { creatorId: this.id });
        }
        
        public removePrinciple(principleId: UUID): void {
            const principleToRemove = this.structuredCharter.find(p => p.id === principleId);
            if (!principleToRemove) throw new CharterError(`Principle with ID ${principleId} not found.`);

            this.structuredCharter = this.structuredCharter.filter(p => p.id !== principleId);
            this.charter = this.charter.filter(p => p !== principleToRemove.naturalLanguage);
            
            this.archiveCurrentCharter(`Removed: "${principleToRemove.naturalLanguage}"`, PrincipleAuthor.CREATOR);
            this.saveToPersistence();
            GlobalAppEvents.emit('charter:updated', { creatorId: this.id });
        }

        public grantMandate(): void {
            if (this.structuredCharter.length === 0) throw new MandateError("Cannot grant mandate with an empty charter.");
            this.mandateStatus = "Granted";
            this.saveToPersistence();
            GlobalAppEvents.emit('mandate:granted', { creatorId: this.id, timestamp: getCurrentTimestamp() });
        }
        
        public revokeMandate(): void {
            this.mandateStatus = "Revoked";
            this.saveToPersistence();
            GlobalAppEvents.emit('mandate:revoked', { creatorId: this.id, timestamp: getCurrentTimestamp() });
        }
        
        public getCharter(): Charter { return [...this.charter]; }
        public getStructuredCharter(): StructuredCharter { return JSON.parse(JSON.stringify(this.structuredCharter)); }
        public getMandateStatus(): MandateStatus { return this.mandateStatus; }
        public getCharterHistory(): ReadonlyArray<CharterVersion> { return this.charterHistory; }
    }

    // --- COMPLIANCE ENGINE ---
    
    export type ComplianceCheckFunction = (context: DecisionContext, principle: StructuredPrinciple, globalState: any) => Promise<{ compliant: boolean; reason: string }>;

    export class ComplianceEngine {
        private checkerRegistry: Map<string, ComplianceCheckFunction> = new Map();

        constructor() {
            this.registerDefaultCheckers();
        }

        private registerDefaultCheckers() {
            this.registerChecker("GenericFallback", async (context, principle) => {
                return { compliant: true, reason: "Fallback checker assumes compliance as no specific logic was found." };
            });
            
            this.registerChecker("Financial.Investment.ESG", async (context, principle) => {
                const proposedInvestment = context.proposedAction;
                if (proposedInvestment.type !== "INVESTMENT") return { compliant: true, reason: "N/A: Action is not an investment." };

                const esgCondition = principle.conditions.find(c => c.parameters.dataKey === 'investment.esgRating');
                if (!esgCondition) return { compliant: true, reason: "N/A: Principle lacks a specific ESG condition." };
                
                // Mock fetching external data
                const actualRating = proposedInvestment.security.esgRating;
                if (!actualRating) return { compliant: false, reason: `Investment in ${proposedInvestment.security.ticker} has no ESG rating.`};

                const ratingValues = { "AAA": 7, "AA": 6, "A": 5, "A-": 4, "BBB": 3, "BB": 2, "B": 1, "CCC": 0 };
                const minRating = esgCondition.parameters.value;
                const compliant = (ratingValues[actualRating] || -1) >= (ratingValues[minRating] || -1);

                return {
                    compliant,
                    reason: compliant ? `ESG rating ${actualRating} meets minimum of ${minRating}.` : `ESG rating ${actualRating} is below minimum of ${minRating}.`
                };
            });
            
            this.registerChecker("Financial.Savings.EmergencyFund", async (context, principle, globalState) => {
                 const emergencyFundBalance = globalState?.accounts?.emergencyFund?.balance || 0;
                 const sixMonthsExpenses = globalState?.creatorProfile?.monthlyExpenses * 6 || 0;
                 if (emergencyFundBalance >= sixMonthsExpenses) return { compliant: true, reason: "Emergency fund is fully funded." };

                 const proposedTransaction = context.proposedAction;
                 if (proposedTransaction.type === 'TRANSACTION' && proposedTransaction.category === 'Discretionary') {
                    return { compliant: false, reason: `Discretionary spending of ${proposedTransaction.amount} is forbidden while emergency fund is below target.` };
                 }
                 return { compliant: true, reason: "Action is not discretionary spending, proceeding allowed." };
            });
            
            this.registerChecker("Financial.Income.Allocation", async (context) => {
                if (context.proposedAction.type !== 'INCOME_RECEIVED' || context.proposedAction.source !== 'freelance') return { compliant: true, reason: "N/A: Not freelance income." };
                return { compliant: true, reason: "Compliance requires a subsequent automated transaction to be created." };
            });

            this.registerChecker("Health.Sleep.Minimum", async(context, principle, globalState) => {
                if (context.proposedAction.type !== 'PLAN_DAY') return { compliant: true, reason: "N/A: Not a day planning action." };
                
                const lastNightSleep = globalState?.healthData?.sleep?.lastNight?.durationHours || 8;
                const sleepCondition = principle.conditions.find(c => c.parameters.metric === 'sleepDuration');
                if (!sleepCondition) return { compliant: true, reason: "N/A: No sleep condition."};
                
                const minSleep = sleepCondition.parameters.value;
                if (lastNightSleep < minSleep) {
                     return { compliant: false, reason: `Last night's sleep (${lastNightSleep}h) was below the minimum of ${minSleep}h. Schedule should be modified to be less demanding.`};
                }
                return { compliant: true, reason: `Sleep duration of ${lastNightSleep}h meets the minimum.`};
            });
        }
        
        public registerChecker(id: string, checker: ComplianceCheckFunction): void {
            this.checkerRegistry.set(id, checker);
        }
        
        private selectChecker(principle: StructuredPrinciple): ComplianceCheckFunction {
            // This logic could be much more sophisticated, using tags, categories, etc.
            if (principle.category === PrincipleCategory.FINANCIAL && principle.naturalLanguage.includes("ESG")) return this.checkerRegistry.get("Financial.Investment.ESG")!;
            if (principle.category === PrincipleCategory.FINANCIAL && principle.naturalLanguage.includes("emergency fund")) return this.checkerRegistry.get("Financial.Savings.EmergencyFund")!;
            if (principle.category === PrincipleCategory.FINANCIAL && principle.naturalLanguage.includes("freelance income")) return this.checkerRegistry.get("Financial.Income.Allocation")!;
            if (principle.category === PrincipleCategory.HEALTH_WELLBEING && principle.naturalLanguage.includes("sleep")) return this.checkerRegistry.get("Health.Sleep.Minimum")!;

            return this.checkerRegistry.get("GenericFallback")!;
        }

        public async run(charter: StructuredCharter, context: DecisionContext, globalState: any): Promise<ComplianceCheckResult> {
            if (!charter || charter.length === 0) throw new ComplianceError("Cannot run compliance check on an empty or null charter.");

            const relevantPrinciples = charter
                .filter(p => p.category === context.category || p.category === PrincipleCategory.CUSTOM)
                .sort((a, b) => b.priority - a.priority);
            
            const reasoningTrace: string[] = [`Starting compliance check for action: ${context.proposedAction.type}.`, `Found ${relevantPrinciples.length} relevant principles.`];

            if (relevantPrinciples.length === 0) {
                return { isCompliant: true, violatedPrinciples: [], consultedPrinciples: [], confidenceScore: 1.0, reasoningTrace: [...reasoningTrace, "No relevant principles found, action is compliant by default."] };
            }

            const violatedPrinciples: Array<{ principleId: UUID; reason: string; priority: PriorityLevel }> = [];
            const consultedPrinciples: UUID[] = relevantPrinciples.map(p => p.id);

            for (const principle of relevantPrinciples) {
                const checker = this.selectChecker(principle);
                reasoningTrace.push(`Consulting principle ID ${principle.id}: "${principle.naturalLanguage}"`);
                try {
                    const result = await checker(context, principle, globalState);
                    if (!result.compliant) {
                        reasoningTrace.push(`-> VIOLATION: ${result.reason}`);
                        violatedPrinciples.push({ principleId: principle.id, reason: result.reason, priority: principle.priority });
                        if (principle.priority === PriorityLevel.ABSOLUTE) {
                            reasoningTrace.push("Absolute principle violated. Halting further checks.");
                            break;
                        }
                    } else {
                        reasoningTrace.push(`-> COMPLIANT: ${result.reason}`);
                    }
                } catch (error) {
                    const reason = "Compliance checker failed to execute.";
                    reasoningTrace.push(`-> ERROR: ${reason}`);
                    violatedPrinciples.push({ principleId: principle.id, reason, priority: principle.priority });
                }
            }
            
            reasoningTrace.push(`Check complete. ${violatedPrinciples.length} violations found.`);
            return {
                isCompliant: violatedPrinciples.length === 0,
                violatedPrinciples,
                consultedPrinciples,
                confidenceScore: 1 - (violatedPrinciples.length / relevantPrinciples.length),
                reasoningTrace
            };
        }
    }


    // --- ENHANCED TheCoPilotAI CLASS ---

    class TheCoPilotAI {
        private mandate: StructuredCharter | null;
        private creatorId: UUID | null;
        private complianceEngine: ComplianceEngine;
        private decisionLog: DecisionLogEntry[] = [];
        private db: InMemoryDatabase;
        public readonly aiId: UUID;
        
        private globalState: any = {
            accounts: {
                main: { balance: 5000 }, savings: { balance: 2500 }, emergencyFund: { balance: 10000 }, investment: { value: 75000 },
            },
            creatorProfile: {
                monthlyExpenses: 3000, riskTolerance: 'aggressive', goals: { 'Down Payment': { current: 15000, target: 50000 } }
            },
            marketData: {
                'GOODCORP': { esgRating: 'AAA' }, 'OKAYCO': { esgRating: 'A-' }, 'BADCORP': { esgRating: 'B' },
            },
            healthData: { sleep: { lastNight: { durationHours: 6.5, quality: 'fair'}}}
        };

        constructor(aiId?: UUID) {
            this.aiId = aiId || generateUUID();
            this.mandate = null;
            this.creatorId = null;
            this.complianceEngine = new ComplianceEngine();
            this.db = InMemoryDatabase.getInstance();
            this.loadDecisionLog();
            
            GlobalAppEvents.on('mandate:revoked', (data: { creatorId: UUID }) => {
                if(data.creatorId === this.creatorId) {
                    this.mandate = null;
                }
            });
        }
        
        private loadDecisionLog() { this.decisionLog = this.db.get<DecisionLogEntry[]>(`decision_log_${this.aiId}`) || []; }
        private saveDecisionLog() { this.db.set(`decision_log_${this.aiId}`, this.decisionLog); }

        public acceptMandate(charter: Charter, structuredCharter: StructuredCharter, creatorId: UUID): void {
            if (structuredCharter.length === 0) throw new MandateError("AI cannot accept an empty mandate.");
            this.mandate = structuredCharter;
            this.creatorId = creatorId;
            GlobalAppEvents.emit('mandate:accepted', { creatorId, aiId: this.aiId });
        }
        
        public async makeDecision(situation: any, trigger: DecisionContext['trigger']): Promise<string> {
            if (!this.mandate) {
                return "Awaiting mandate. Cannot act without a guiding philosophy.";
            }

            const context: DecisionContext = {
                decisionId: generateUUID(),
                timestamp: getCurrentTimestamp(),
                category: this.categorizeSituation(situation),
                proposedAction: situation,
                trigger,
            };

            const complianceResult = await this.complianceEngine.run(this.mandate, context, this.globalState);
            
            let finalAction: DecisionLogEntry['finalAction'];
            let outcome: string;

            if (complianceResult.isCompliant) {
                finalAction = "Proceed";
                outcome = `Decision is compliant. Proceeding with action. Consulted ${complianceResult.consultedPrinciples.length} principles. Confidence: ${(complianceResult.confidenceScore * 100).toFixed(1)}%`;
                this.executeAction(situation);
            } else {
                finalAction = "Block";
                const violationReasons = complianceResult.violatedPrinciples.map(v => {
                    const principle = this.mandate?.find(p => p.id === v.principleId);
                    return `Principle Violation: "${principle?.naturalLanguage || 'Unknown Principle'}" (Reason: ${v.reason})`;
                }).join('\n');

                outcome = `Decision violates the Charter. Action is forbidden.\n${violationReasons}`;
            }

            const logEntry: DecisionLogEntry = {
                logId: generateUUID(),
                decisionContext: context,
                complianceResult,
                finalAction,
                outcome,
                timestamp: getCurrentTimestamp(),
            };
            
            this.decisionLog.push(logEntry);
            this.saveDecisionLog();

            GlobalAppEvents.emit('decision:made', { aiId: this.aiId, logEntry });
            return outcome;
        }
        
        private categorizeSituation(situation: any): PrincipleCategory {
            if(['INVESTMENT', 'TRANSACTION', 'INCOME_RECEIVED'].includes(situation.type)) return PrincipleCategory.FINANCIAL;
            if(situation.type === 'PLAN_DAY') return PrincipleCategory.HEALTH_WELLBEING;
            return PrincipleCategory.CUSTOM;
        }
        
        private executeAction(action: any) {
            console.log(`[AI ${this.aiId}] EXECUTING ACTION:`, action);
            if (action.type === 'INVESTMENT') {
                const cost = action.shares * action.price;
                this.globalState.accounts.main.balance -= cost;
                this.globalState.accounts.investment.value += cost;
            }
        }
        
        public getDecisionLogs(): ReadonlyArray<DecisionLogEntry> {
            return this.decisionLog;
        }
    }

    // --- APPLICATION ORCHESTRATION AND SIMULATION ---

    export function establishThePartnership(): { creator: TheCreator, aI: TheCoPilotAI } {
        const creator = new TheCreator();
        const theAI = new TheCoPilotAI();
        try {
            creator.grantMandate();
            if (creator.getMandateStatus() === "Granted") {
                theAI.acceptMandate(creator.getCharter(), creator.getStructuredCharter(), creator.id);
            }
        } catch (e) {
            if (e instanceof MandateError) {
                console.error("Failed to establish partnership:", e.message);
            } else { throw e; }
        }
        return { creator, aI: theAI };
    }

    // --- UI VIEW MODELS AND HELPERS ---
    
    export interface PrincipleViewModel {
        id: UUID;
        text: string;
        category: {
            label: string;
            color: string;
            icon: string;
        };
        priority: {
            label: string;
            level: number;
        };
        tags: string[];
        lastUpdated: string;
        author: PrincipleAuthor;
    }

    export function getCategoryDisplay(category: PrincipleCategory): PrincipleViewModel['category'] {
        switch (category) {
            case PrincipleCategory.FINANCIAL: return { label: "Financial", color: "#2E86C1", icon: "AccountBalance" };
            case PrincipleCategory.ETHICAL: return { label: "Ethical", color: "#28B463", icon: "Gavel" };
            case PrincipleCategory.OPERATIONAL: return { label: "Operational", color: "#F39C12", icon: "Code" };
            case PrincipleCategory.HEALTH_WELLBEING: return { label: "Health & Wellbeing", color: "#9B59B6", icon: "HealthAndSafety" };
            case PrincipleCategory.SOCIAL_IMPACT: return { label: "Social Impact", color: "#E74C3C", icon: "People" };
            case PrincipleCategory.ENVIRONMENTAL: return { label: "Environmental", color: "#1ABC9C", icon: "Public" };
            default: return { label: "Custom", color: "#7F8C8D", icon: "Edit" };
        }
    }

    export function getPriorityDisplay(priority: PriorityLevel): { label: string; level: number } {
        const labels = {
            [PriorityLevel.SUGGESTION]: "Suggestion", [PriorityLevel.TRIVIAL]: "Trivial", [PriorityLevel.LOW]: "Low",
            [PriorityLevel.MEDIUM]: "Medium", [PriorityLevel.HIGH]: "High", [PriorityLevel.CRITICAL]: "Critical", [PriorityLevel.ABSOLUTE]: "Absolute",
        };
        return { label: labels[priority], level: priority };
    }
    
    export function formatTimestampForUI(timestamp: ISO8601Timestamp): string {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
    
    export class CharterViewModelAdapter {
        public static toViewModel(principle: StructuredPrinciple): PrincipleViewModel {
            return {
                id: principle.id,
                text: principle.naturalLanguage,
                category: getCategoryDisplay(principle.category),
                priority: getPriorityDisplay(principle.priority),
                tags: principle.tags,
                lastUpdated: formatTimestampForUI(principle.updatedAt),
                author: principle.author,
            };
        }
        
        public static charterToViewModel(charter: StructuredCharter): PrincipleViewModel[] {
            return charter
                .sort((a, b) => b.priority - a.priority)
                .map(this.toViewModel);
        }
    }

    export interface DecisionLogViewModel {
        id: UUID;
        timestamp: string;
        actionDescription: string;
        outcome: {
            text: 'Approved' | 'Blocked' | 'Alerted';
            color: string;
        };
        complianceSummary: string;
        details: DecisionLogEntry;
    }
    
    export class DecisionLogViewModelAdapter {
        public static toViewModel(logEntry: DecisionLogEntry): DecisionLogViewModel {
            let outcomeText: DecisionLogViewModel['outcome']['text'];
            let outcomeColor: string;
            switch(logEntry.finalAction) {
                case 'Proceed': case 'ModifiedProceed': outcomeText = 'Approved'; outcomeColor = 'green'; break;
                case 'Block': outcomeText = 'Blocked'; outcomeColor = 'red'; break;
                case 'AlertCreator': outcomeText = 'Alerted'; outcomeColor = 'orange'; break;
            }
            
            const complianceSummary = logEntry.complianceResult.isCompliant
                ? `Passed ${logEntry.complianceResult.consultedPrinciples.length} checks.`
                : `Failed ${logEntry.complianceResult.violatedPrinciples.length}/${logEntry.complianceResult.consultedPrinciples.length} checks.`;

            return {
                id: logEntry.logId,
                timestamp: formatTimestampForUI(logEntry.timestamp),
                actionDescription: this.summarizeAction(logEntry.decisionContext.proposedAction),
                outcome: { text: outcomeText, color: outcomeColor },
                complianceSummary,
                details: logEntry,
            };
        }
        
        public static logToViewModel(log: DecisionLogEntry[]): DecisionLogViewModel[] {
            return log.map(this.toViewModel).sort((a,b) => new Date(b.details.timestamp).getTime() - new Date(a.details.timestamp).getTime());
        }

        private static summarizeAction(action: any): string {
            switch(action.type) {
                case 'INVESTMENT': return `Invest in ${action.shares} shares of ${action.security.ticker}`;
                case 'TRANSACTION': return `Transfer ${action.amount} to ${action.recipient}`;
                case 'INCOME_RECEIVED': return `Process income of ${action.amount} from ${action.source}`;
                default: return 'Perform a custom action';
            }
        }
    }
    
    // --- CHARTER TEMPLATES ---

    export const CharterTemplates: Record<string, Omit<StructuredPrinciple, 'id' | 'createdAt' | 'updatedAt' | 'version'>[]> = {
        "AggressiveGrowthInvestor": [
            { naturalLanguage: "Prioritize long-term capital appreciation above short-term stability, accepting higher volatility.", category: PrincipleCategory.FINANCIAL, priority: PriorityLevel.HIGH, conditions: [], actions: [{ type: ActionType.Modify, target: "Investment.Strategy", details: { riskProfile: "High" } }], tags: ["investment", "growth"], isMutable: true, author: PrincipleAuthor.TEMPLATE, explanation: "Sets the overarching investment philosophy towards growth." },
            { naturalLanguage: "Maintain a minimum of 70% of the portfolio in equity-based assets.", category: PrincipleCategory.FINANCIAL, priority: PriorityLevel.CRITICAL, conditions: [{ type: 'State', evaluator: ConditionEvaluator.LessThan, parameters: { stateKey: 'portfolio.equityAllocation', value: 0.70 } }], actions: [{ type: ActionType.Alert, target: 'Creator', details: { message: "Equity allocation has fallen below 70% threshold."} }], tags: ["investment", "asset-allocation"], isMutable: true, author: PrincipleAuthor.TEMPLATE, explanation: "Ensures the portfolio composition aligns with the growth strategy." },
            { naturalLanguage: "Invest up to 15% of the portfolio in emerging technologies and venture capital.", category: PrincipleCategory.FINANCIAL, priority: PriorityLevel.MEDIUM, conditions: [], actions: [], tags: ["investment", "venture-capital", "emerging-tech"], isMutable: true, author: PrincipleAuthor.TEMPLATE, explanation: "Allows for high-risk, high-reward speculative investments within a controlled limit." }
        ],
        "EthicalAndSustainable": [
            { naturalLanguage: "Only invest in companies with an ESG rating of A or higher.", category: PrincipleCategory.ETHICAL, priority: PriorityLevel.ABSOLUTE, conditions: [{ type: "ExternalData", evaluator: ConditionEvaluator.LessThan, parameters: { dataKey: "investment.esgRating", value: "A" } }], actions: [{ type: ActionType.Forbid, target: "Investment" }], tags: ["esg", "investment", "sustainability"], isMutable: false, author: PrincipleAuthor.TEMPLATE, explanation: "A hard rule to filter out companies with poor environmental, social, and governance practices." },
            { naturalLanguage: "Exclude investments in fossil fuels, tobacco, and weapons manufacturing industries.", category: PrincipleCategory.ETHICAL, priority: PriorityLevel.ABSOLUTE, conditions: [{ type: "ExternalData", evaluator: ConditionEvaluator.In, parameters: { dataKey: "investment.industry", value: ["fossil_fuels", "tobacco", "weapons"] } }], actions: [{ type: ActionType.Forbid, target: "Investment" }], tags: ["esg", "investment", "exclusion"], isMutable: false, author: PrincipleAuthor.TEMPLATE, explanation: "Divests from specific industries deemed harmful or unethical." },
            { naturalLanguage: "Dedicate 5% of annual investment gains to charitable donations aligned with climate action.", category: PrincipleCategory.FINANCIAL, priority: PriorityLevel.HIGH, conditions: [], actions: [{ type: ActionType.Require, target: "Donation" }], tags: ["charity", "climate-action"], isMutable: true, author: PrincipleAuthor.TEMPLATE, explanation: "Proactively uses financial gains to support positive environmental change." }
        ]
    };

    export function applyCharterTemplate(creator: TheCreator, templateName: keyof typeof CharterTemplates): void {
        const template = CharterTemplates[templateName];
        if (!template) throw new CharterError(`Template "${templateName}" not found.`);
        
        const currentCharter = creator.getStructuredCharter();
        currentCharter.forEach(p => creator.removePrinciple(p.id));
        template.forEach(p => creator.addStructuredPrinciple(p));
    }

} // End of TheCreatorsCharter namespace

// --- REACT IMPLEMENTATION ---
// NOTE: This assumes a UI library like Material-UI is available.
// For brevity, component implementations will be conceptual placeholders.
// A full implementation would require thousands of lines for styling and state management.

// --- Mock Components (to make code runnable without MUI) ---
const Box: FC<{ component?: string, sx?: any, children: ReactNode }> = ({ children, sx }) => <div style={sx}>{children}</div>;
const Typography: FC<{ variant?: string, component?: string, sx?: any, children: ReactNode }> = ({ children, sx, variant }) => {
    const style = { ...sx };
    if (variant === 'h4') style.fontSize = '2rem';
    if (variant === 'h6') style.fontSize = '1.25rem';
    if (variant === 'body1') style.fontSize = '1rem';
    if (variant === 'body2') style.fontSize = '0.875rem';
    if (variant === 'caption') style.fontSize = '0.75rem';
    return <div style={style}>{children}</div>;
};
const Button: FC<{ variant?: "contained" | "outlined", color?: string, onClick?: () => void, children: ReactNode, startIcon?: ReactNode }> = ({ children, onClick }) => <button onClick={onClick}>{children}</button>;
const Paper: FC<{ elevation?: number, sx?: any, children: ReactNode }> = ({ children, sx }) => <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '4px', ...sx }}>{children}</div>;
const Chip: FC<{ label: string, sx?: any }> = ({ label, sx }) => <span style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '16px', ...sx }}>{label}</span>;
const Accordion: FC<{ children: ReactNode }> = ({ children }) => <div>{children}</div>;
const AccordionSummary: FC<{ children: ReactNode, expandIcon?: ReactNode }> = ({ children }) => <div>{children}</div>;
const AccordionDetails: FC<{ children: ReactNode }> = ({ children }) => <div>{children}</div>;

// --- Custom Hooks ---

type CharterState = {
    creator: TheCreatorsCharter.TheCreator | null;
    ai: TheCreatorsCharter.TheCoPilotAI | null;
    charter: TheCreatorsCharter.StructuredCharter;
    decisionLog: TheCreatorsCharter.DecisionLogEntry[];
    mandateStatus: TheCreatorsCharter.MandateStatus;
    isLoading: boolean;
};

type CharterAction =
    | { type: 'INIT_SUCCESS'; payload: { creator: TheCreatorsCharter.TheCreator; ai: TheCreatorsCharter.TheCoPilotAI } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'UPDATE_STATE' };


function charterReducer(state: CharterState, action: CharterAction): CharterState {
    switch (action.type) {
        case 'INIT_SUCCESS':
            return {
                ...state,
                creator: action.payload.creator,
                ai: action.payload.ai,
                charter: action.payload.creator.getStructuredCharter(),
                decisionLog: action.payload.ai.getDecisionLogs(),
                mandateStatus: action.payload.creator.getMandateStatus(),
                isLoading: false,
            };
        case 'UPDATE_STATE':
            if (!state.creator || !state.ai) return state;
            return {
                ...state,
                charter: state.creator.getStructuredCharter(),
                decisionLog: state.ai.getDecisionLogs(),
                mandateStatus: state.creator.getMandateStatus(),
            };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
}

const useCharterManager = () => {
    const initialState: CharterState = {
        creator: null, ai: null, charter: [], decisionLog: [], mandateStatus: 'Pending Signature', isLoading: true,
    };
    const [state, dispatch] = useReducer(charterReducer, initialState);

    useEffect(() => {
        TheCreatorsCharter.InMemoryDatabase.getInstance().clear();
        const { creator, aI } = TheCreatorsCharter.establishThePartnership();
        dispatch({ type: 'INIT_SUCCESS', payload: { creator, ai: aI } });

        const handleCharterUpdate = () => dispatch({ type: 'UPDATE_STATE' });
        const unsubscribe = TheCreatorsCharter.GlobalAppEvents.on('charter:updated', handleCharterUpdate);
        return () => unsubscribe();
    }, []);

    const addPrinciple = useCallback((principle: Omit<TheCreatorsCharter.StructuredPrinciple, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
        state.creator?.addStructuredPrinciple(principle);
        dispatch({ type: 'UPDATE_STATE' });
    }, [state.creator]);

    const updatePrinciple = useCallback((id: string, updates: Partial<TheCreatorsCharter.StructuredPrinciple>) => {
        state.creator?.updateStructuredPrinciple(id, updates);
        dispatch({ type: 'UPDATE_STATE' });
    }, [state.creator]);

    const removePrinciple = useCallback((id: string) => {
        state.creator?.removePrinciple(id);
        dispatch({ type: 'UPDATE_STATE' });
    }, [state.creator]);

    return { ...state, addPrinciple, updatePrinciple, removePrinciple };
};


// --- UI Components ---

const PrincipleCard: FC<{ principle: TheCreatorsCharter.PrincipleViewModel }> = ({ principle }) => {
    const categoryStyle = {
        borderLeft: `5px solid ${principle.category.color}`,
        marginBottom: '16px',
    };

    return (
        <Paper elevation={2} sx={categoryStyle}>
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="h3">{principle.category.label}: {TheCreatorsCharter.getPriorityDisplay(principle.priority.level).label} Priority</Typography>
                    <Chip label={principle.author} />
                </Box>
                <Typography variant="body1" sx={{ my: 2 }}>{principle.text}</Typography>
                <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {principle.tags.map(tag => <Chip key={tag} label={tag} />)}
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>Last Updated: {principle.lastUpdated}</Typography>
            </Box>
        </Paper>
    );
};

const PrinciplesList: FC<{ principles: TheCreatorsCharter.StructuredCharter }> = ({ principles }) => {
    const viewModels = useMemo(() => TheCreatorsCharter.CharterViewModelAdapter.charterToViewModel(principles), [principles]);
    
    return (
        <Box>
            {viewModels.map(p => <PrincipleCard key={p.id} principle={p} />)}
        </Box>
    );
};

const DecisionLogItem: FC<{ log: TheCreatorsCharter.DecisionLogViewModel }> = ({ log }) => {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<div>&gt;</div>}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Box>
                        <Typography>{log.actionDescription}</Typography>
                        <Typography variant="caption">{log.timestamp}</Typography>
                    </Box>
                    <Chip label={log.outcome.text} sx={{ backgroundColor: log.outcome.color, color: 'white' }} />
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', p: 2, borderRadius: '4px' }}>
                    {log.details.complianceResult.reasoningTrace.join('\n')}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}

const DecisionLogViewer: FC<{ logs: TheCreatorsCharter.DecisionLogEntry[] }> = ({ logs }) => {
    const viewModels = useMemo(() => TheCreatorsCharter.DecisionLogViewModelAdapter.logToViewModel(logs), [logs]);

    return (
        <Paper elevation={3} sx={{ p: 2, maxHeight: '80vh', overflowY: 'auto' }}>
             <Typography variant="h6" sx={{ mb: 2 }}>AI Decision Log</Typography>
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {viewModels.length > 0 
                    ? viewModels.map(log => <DecisionLogItem key={log.id} log={log} />)
                    : <Typography>No decisions have been made yet.</Typography>
                }
             </Box>
        </Paper>
    );
};

const MandateControls: FC<{ status: TheCreatorsCharter.MandateStatus }> = ({ status }) => {
    const getStatusColor = () => {
        switch(status) {
            case 'Granted': return 'green';
            case 'Revoked': return 'red';
            case 'Pending Signature': return 'orange';
            default: return 'gray';
        }
    };
    return (
        <Paper elevation={3} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Mandate Status</Typography>
            <Chip label={status} sx={{ backgroundColor: getStatusColor(), color: 'white', fontSize: '1rem', p: '12px' }}/>
            <Box>
                <Button variant="contained" color="primary" sx={{ mr: 1 }} disabled={status === 'Granted'}>Grant Mandate</Button>
                <Button variant="outlined" color="secondary" disabled={status !== 'Granted'}>Revoke Mandate</Button>
            </Box>
        </Paper>
    );
};


/**
 * TheCharterView is the main interface for a Creator to define, manage, and
 * oversee the operational constitution that governs their AI Co-Pilot.
 * It provides tools to inscribe principles, observe the AI's decision-making process,
 * and understand the intricate relationship between the stated values and the AI's actions.
 */
export const TheCharterView = () => {
    const { charter, decisionLog, mandateStatus, isLoading } = useCharterManager();

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Typography>Initializing Partnership...</Typography></Box>;
    }

    return (
        <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Typography variant="h4" component="h1" gutterBottom>The Creator's Charter</Typography>
            
            <Box sx={{ my: 3 }}>
                <MandateControls status={mandateStatus} />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <Paper elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                         <Typography variant="h6">Guiding Principles</Typography>
                         <Button variant="contained">Add New Principle</Button>
                    </Box>
                    <PrinciplesList principles={charter} />
                </Paper>
                
                <DecisionLogViewer logs={decisionLog} />
            </Box>
        </Box>
    );
};
```
---