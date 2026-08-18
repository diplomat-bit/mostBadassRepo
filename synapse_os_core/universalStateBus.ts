// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/synapse_os_core/universalStateBus.ts
================================================================================

/**
 * Synapse OS Core - Universal State Bus
 *
 * @description Implements a high-performance, event-driven state management bus for seamless,
 * real-time data flow between all platform modules. It combines the features of a traditional
 * event bus with a centralized state store, inspired by Flux/Redux patterns but adapted for
 * a highly dynamic, AI-driven environment.
 *
 * @features
 * - Singleton pattern for a single source of truth.
 * - Type-safe event publishing and subscription using TypeScript generics.
 * - Centralized, immutable state management.
 * - Middleware support for logging, analytics, and action interception.
 * - Wildcard event subscriptions for flexible module communication.
 * - State persistence and rehydration (e.g., to localStorage).
 * - Time-travel debugging capabilities (undo/redo).
 * - State selectors for optimized component updates.
 * - Robust error handling for listener stability.
 */

// ================================================================= //
// TYPE DEFINITIONS
// ================================================================= //

/**
 * Defines the contract for all events within the Synapse OS.
 * This mapped type is the single source of truth for event names and their payload structures.
 */
export interface EventPayloads {
    // --- System Events ---
    'SYSTEM_APP_INIT': { startTime: number };
    'SYSTEM_APP_READY': { readyTime: number };
    'SYSTEM_ERROR_OCCURRED': { error: Error; context: string; severity: 'critical' | 'warning' | 'info' };
    'SYSTEM_NOTIFICATION_SENT': { id: string; type: 'success' | 'error' | 'info' | 'warning'; message: string; duration?: number };
    'SYSTEM_API_HEALTH_CHANGED': { service: string; status: 'online' | 'offline' | 'degraded'; latency: number };
    'SYSTEM_MODULE_LOADED': { moduleName: string };
    'SYSTEM_THEME_CHANGED': { theme: 'dark' | 'light' | 'quantum_glow' };

    // --- User Events ---
    'USER_AUTHENTICATION_STARTED': { method: 'password' | 'biometric' | 'quantum_key' };
    'USER_AUTHENTICATED': { userId: string; token: string; sessionExpires: number };
    'USER_LOGGED_OUT': { reason: 'user_action' | 'session_expired' };
    'USER_PROFILE_FETCHED': { profile: UserProfile };
    'USER_PROFILE_UPDATED': { updates: Partial<UserProfile> };
    'USER_PREFERENCES_CHANGED': { preferences: UserPreferences };
    'USER_API_KEY_CREATED': { service: string; apiKey: string };
    'USER_API_KEY_REVOKED': { service: string };

    // --- AI & Machine Learning Events ---
    'AI_TASK_CREATED': { taskId: string; agent: string; description: string };
    'AI_TASK_STATUS_CHANGED': { taskId:string; status: 'pending' | 'running' | 'completed' | 'failed'; progress?: number; result?: any };
    'AI_INSIGHT_GENERATED': { insightId: string; type: 'prediction' | 'anomaly' | 'recommendation'; data: any; narrative: string };
    'AI_CHAT_MESSAGE_SENT': { sessionId: string; message: string; sender: 'user' | 'ai' };
    'AI_MODEL_TRAINING_STARTED': { modelId: string };
    'AI_MODEL_TRAINING_COMPLETED': { modelId: string; performanceMetrics: Record<string, number> };
    'AI_AGENT_ACTIVATED': { agentId: string; capabilities: string[] };

    // --- Financial & Economic Events ---
    'FINANCE_ACCOUNT_ADDED': { accountId: string; type: 'checking' | 'savings' | 'investment'; provider: string };
    'FINANCE_TRANSACTION_PROCESSED': { transactionId: string; accountId: string; amount: number; currency: string; status: 'posted' | 'pending' };
    'FINANCE_BUDGET_THRESHOLD_REACHED': { budgetId: string; category: string; spent: number; limit: number };
    'FINANCE_GOAL_PROGRESS_UPDATED': { goalId: string; currentAmount: number; targetAmount: number };
    'FINANCE_PORTFOLIO_REBALANCED': { portfolioId: string; assetChanges: Array<{ asset: string; from: number; to: number }> };
    'FINANCE_MARKET_DATA_RECEIVED': { symbol: string; price: number; volume: number };

    // --- Corporate & Business Events ---
    'CORPORATE_INVOICE_CREATED': { invoiceId: string; clientId: string; amount: number; dueDate: string };
    'CORPORATE_PAYROLL_EXECUTED': { payrollRunId: string; totalAmount: number; employeeCount: number };
    'CORPORATE_COMPLIANCE_STATUS_CHANGED': { regulation: string; status: 'compliant' | 'at_risk' | 'non_compliant' };
    'CORPORATE_SUPPLY_CHAIN_EVENT': { eventType: 'shipment_dispatched' | 'delivery_confirmed'; shipmentId: string };

    // --- Code Generation & Developer Events ---
    'CODEGEN_REQUEST_STARTED': { requestId: string; language: string; prompt: string };
    'CODEGEN_REQUEST_COMPLETED': { requestId: string; success: boolean; code?: string; error?: string };
    'CODEGEN_FILE_WRITTEN': { filePath: string; content: string };
    'CODEGEN_PIPELINE_EXECUTED': { pipelineId: string; status: 'success' | 'failure' };

    // --- Multiverse & Simulation Events ---
    'MULTIVERSE_SIMULATION_STARTED': { simulationId: string; scenario: string; parameters: Record<string, any> };
    'MULTIVERSE_SIMULATION_COMPLETED': { simulationId: string; results: any; insights: string[] };
    'MULTIVERSE_PROJECTION_UPDATED': { projectionId: string; timeline: 'alpha' | 'beta' | 'gamma'; data: any };

    // --- Quantum Computing Events ---
    'QUANTUM_ORACLE_QUERY_SENT': { queryId: string; oracleName: string };
    'QUANTUM_ORACLE_RESPONSE_RECEIVED': { queryId: string; response: any };
    'QUANTUM_COMPUTATION_SUCCESS': { computationId: string; qubits: number; result: any };
    'QUANTUM_ENTANGLEMENT_DETECTED': { assetA: string; assetB: string; correlation: number };
}

export type EventKey = keyof EventPayloads;

export interface Event<K extends EventKey> {
    type: K;
    payload: EventPayloads[K];
    timestamp: number;
    metadata?: Record<string, any>;
}

export type Listener<P> = (payload: P, event?: Event<any>) => void | Promise<void>;

export type MiddlewareContext = {
    event: Event<any>;
    getState: () => UniversalState;
};
export type MiddlewareNext = () => void;
export type Middleware = (context: MiddlewareContext, next: MiddlewareNext) => void;

// Define a placeholder for the global state structure.
// This should be expanded to cover the entire application's state.
export interface UniversalState {
    system: {
        isInitialized: boolean;
        lastError: EventPayloads['SYSTEM_ERROR_OCCURRED'] | null;
        activeTheme: 'dark' | 'light' | 'quantum_glow';
        apiHealth: Record<string, 'online' | 'offline' | 'degraded'>;
    };
    user: {
        isAuthenticated: boolean;
        profile: UserProfile | null;
        preferences: UserPreferences | null;
        apiKeys: Record<string, { key: string; createdAt: string }>;
    };
    ai: {
        tasks: Record<string, { status: 'pending' | 'running' | 'completed' | 'failed'; progress: number }>;
        insights: Array<EventPayloads['AI_INSIGHT_GENERATED']>;
        chatSessions: Record<string, Array<EventPayloads['AI_CHAT_MESSAGE_SENT']>>;
    };
    finance: {
        accounts: Record<string, any>;
        transactions: Record<string, any>;
        portfolio: any;
    };
    // Add other state slices as needed...
}

// Dummy types for state, replace with actual interfaces
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    biometricEnabled: boolean;
}
export interface UserPreferences {
    notifications: {
        email: boolean;
        push: boolean;
    };
    dashboardLayout: any[];
}


// ================================================================= //
// UNIVERSAL STATE BUS IMPLEMENTATION
// ================================================================= //

class UniversalStateBus {
    private static instance: UniversalStateBus;

    private listeners: Map<EventKey, Set<Listener<any>>> = new Map();
    private wildcardListeners: Map<string, Set<Listener<any>>> = new Map();
    private middleware: Middleware[] = [];
    private state: UniversalState;
    
    // For time-travel debugging
    private history: UniversalState[] = [];
    private historyIndex = -1;

    private constructor(initialState: UniversalState) {
        this.state = structuredClone(initialState);
        this.history.push(this.state);
        this.historyIndex = 0;

        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', this.persistState.bind(this));
        }
    }

    /**
     * Gets the singleton instance of the UniversalStateBus.
     */
    public static getInstance(initialState?: UniversalState): UniversalStateBus {
        if (!UniversalStateBus.instance) {
            const defaultInitialState: UniversalState = {
                system: {
                    isInitialized: false,
                    lastError: null,
                    activeTheme: 'dark',
                    apiHealth: {},
                },
                user: {
                    isAuthenticated: false,
                    profile: null,
                    preferences: null,
                    apiKeys: {},
                },
                ai: {
                    tasks: {},
                    insights: [],
                    chatSessions: {},
                },
                finance: {
                    accounts: {},
                    transactions: {},
                    portfolio: {},
                },
            };
            UniversalStateBus.instance = new UniversalStateBus(initialState || defaultInitialState);
        }
        return UniversalStateBus.instance;
    }

    /**
     * Registers a middleware function to intercept all published events.
     * @param middleware The middleware function to add.
     */
    public use(middleware: Middleware): void {
        this.middleware.push(middleware);
    }

    /**
     * Subscribes a listener to a specific event.
     * @param event The event key to subscribe to.
     * @param listener The function to call when the event is published.
     * @returns A function to unsubscribe the listener.
     */
    public subscribe<K extends EventKey>(event: K, listener: Listener<EventPayloads[K]>): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
        
        return () => this.unsubscribe(event, listener);
    }

    /**
     * Subscribes a listener to a pattern of events (e.g., 'USER_*', 'AI_TASK_*').
     * @param pattern The wildcard pattern (using '*' as a wildcard).
     * @param listener The function to call when a matching event is published.
     * @returns A function to unsubscribe the listener.
     */
    public subscribeWildcard(pattern: string, listener: Listener<any>): () => void {
        if (!this.wildcardListeners.has(pattern)) {
            this.wildcardListeners.set(pattern, new Set());
        }
        this.wildcardListeners.get(pattern)!.add(listener);

        return () => {
            const listeners = this.wildcardListeners.get(pattern);
            if (listeners) {
                listeners.delete(listener);
                if (listeners.size === 0) {
                    this.wildcardListeners.delete(pattern);
                }
            }
        };
    }
    
    /**
     * Unsubscribes a listener from a specific event.
     * @param event The event key.
     * @param listener The listener function to remove.
     */
    public unsubscribe<K extends EventKey>(event: K, listener: Listener<EventPayloads[K]>): void {
        const listeners = this.listeners.get(event);
        if (listeners) {
            listeners.delete(listener);
            if (listeners.size === 0) {
                this.listeners.delete(event);
            }
        }
    }

    /**
     * Publishes an event to all subscribers, processing it through middleware first.
     * @param type The event key.
     * @param payload The data associated with the event.
     */
    public publish<K extends EventKey>(type: K, payload: EventPayloads[K]): void {
        const event: Event<K> = {
            type,
            payload,
            timestamp: Date.now(),
        };

        const processEvent = () => {
            const allListeners: Set<Listener<any>> = new Set();
            
            // Add specific listeners
            const specificListeners = this.listeners.get(type);
            if (specificListeners) {
                specificListeners.forEach(l => allListeners.add(l));
            }

            // Add wildcard listeners
            this.wildcardListeners.forEach((listeners, pattern) => {
                const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
                if (regex.test(type)) {
                    listeners.forEach(l => allListeners.add(l));
                }
            });

            // Asynchronously notify all listeners and handle errors gracefully
            allListeners.forEach(listener => {
                try {
                    // We don't want to block the event bus, so we don't await the promise
                    Promise.resolve(listener(payload, event)).catch(error => {
                        console.error(`Error in listener for event "${type}":`, error);
                        // Optionally, publish a system error event
                        this.publish('SYSTEM_ERROR_OCCURRED', {
                            error: error as Error,
                            context: `Event listener for ${type}`,
                            severity: 'warning'
                        });
                    });
                } catch (error) {
                    console.error(`Synchronous error in listener for event "${type}":`, error);
                    this.publish('SYSTEM_ERROR_OCCURRED', {
                        error: error as Error,
                        context: `Event listener for ${type}`,
                        severity: 'warning'
                    });
                }
            });
        };
        
        // Execute middleware chain
        let index = -1;
        const next = () => {
            index++;
            if (index < this.middleware.length) {
                this.middleware[index]({ event, getState: this.getState.bind(this) }, next);
            } else {
                processEvent();
            }
        };

        next();
    }
    
    /**
     * Updates the central state. This should be the ONLY way to modify the state.
     * It's internal and used by reducers or direct state-setting events.
     * @param updater A function that receives the current state and returns the new state.
     */
    protected setState(updater: (prevState: UniversalState) => UniversalState): void {
        const newState = updater(this.state);
        if (newState === this.state) {
            // No changes, do nothing.
            return;
        }

        this.state = structuredClone(newState);

        // Manage history for time-travel
        // If we've undone actions, slice the history before adding new state
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push(this.state);
        this.historyIndex = this.history.length - 1;
    }


    /**
     * Returns a deep clone of the current state to ensure immutability.
     * @returns The current application state.
     */
    public getState(): UniversalState {
        return structuredClone(this.state);
    }
    
    /**
     * Selects a slice of the state using a selector function.
     * This is useful for components to subscribe to only the parts of the state they need.
     * @param selector A function that takes the full state and returns a specific part of it.
     * @returns The selected state slice.
     */
    public select<T>(selector: (state: UniversalState) => T): T {
        return selector(this.getState());
    }

    /**
     * Reverts the state to the previous step in history.
     */
    public undo(): void {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.state = structuredClone(this.history[this.historyIndex]);
            // Consider publishing a 'STATE_TIME_TRAVEL' event
        }
    }

    /**
     * Moves forward to the next state in history if an undo was performed.
     */
    public redo(): void {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.state = structuredClone(this.history[this.historyIndex]);
            // Consider publishing a 'STATE_TIME_TRAVEL' event
        }
    }

    /**
     * Persists the current state to localStorage.
     */
    public persistState(): void {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const serializedState = JSON.stringify(this.state);
                localStorage.setItem('synapseOS_universalState', serializedState);
            }
        } catch (error) {
            console.error('Failed to persist state:', error);
        }
    }

    /**
     * Rehydrates the state from localStorage if it exists.
     */
    public rehydrateState(): void {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const serializedState = localStorage.getItem('synapseOS_universalState');
                if (serializedState) {
                    const rehydratedState = JSON.parse(serializedState);
                    this.state = rehydratedState;
                    this.history = [rehydratedState];
                    this.historyIndex = 0;
                    console.log('Universal state rehydrated from persistence.');
                }
            }
        } catch (error) {
            console.error('Failed to rehydrate state:', error);
        }
    }
}

// ================================================================= //
// SINGLETON INSTANCE EXPORT
// ================================================================= //

/**
 * The singleton instance of the UniversalStateBus.
 * Import this instance throughout the application to interact with the global state and event system.
 */
export const universalStateBus = UniversalStateBus.getInstance();

// Example of rehydrating state on application startup
if (typeof window !== 'undefined') {
    universalStateBus.rehydrateState();
}

// ================================================================= //
// EXAMPLE USAGE (for demonstration and testing)
// ================================================================= //

function setupExampleListeners() {
    // 1. Specific listener
    const userAuthUnsubscribe = universalStateBus.subscribe('USER_AUTHENTICATED', (payload) => {
        console.log(`[Listener] User Authenticated: ${payload.userId}. Session expires at ${new Date(payload.sessionExpires).toLocaleTimeString()}`);
    });
    
    // 2. Wildcard listener for all system events
    const systemWildcardUnsubscribe = universalStateBus.subscribeWildcard('SYSTEM_*', (payload, event) => {
        console.log(`[Wildcard Listener] System Event Fired: ${event?.type}`, payload);
    });

    // 3. Middleware for logging
    universalStateBus.use(({ event }, next) => {
        console.log(`[Middleware] Event Dispatched -> ${event.type}`, {
            payload: event.payload,
            timestamp: new Date(event.timestamp).toISOString()
        });
        next(); // IMPORTANT: always call next() to continue the chain
    });

    // --- Simulate application flow ---
    setTimeout(() => universalStateBus.publish('SYSTEM_APP_INIT', { startTime: Date.now() }), 500);
    setTimeout(() => universalStateBus.publish('USER_AUTHENTICATION_STARTED', { method: 'biometric' }), 1000);
    setTimeout(() => universalStateBus.publish('USER_AUTHENTICATED', { userId: 'usr_quantum_dev', token: '...', sessionExpires: Date.now() + 3600000 }), 1500);
    setTimeout(() => universalStateBus.publish('SYSTEM_APP_READY', { readyTime: Date.now() }), 2000);
    setTimeout(() => {
        console.log("Unsubscribing from USER_AUTHENTICATED");
        userAuthUnsubscribe();
        universalStateBus.publish('USER_AUTHENTICATED', { userId: 'usr_another_user', token: '...', sessionExpires: Date.now() + 3600000 });
    }, 2500);
}

// Run example if not in a production environment
if (process.env.NODE_ENV !== 'production') {
    // To avoid running this in a real app, you might wrap this call.
    // setupExampleListeners();
}
