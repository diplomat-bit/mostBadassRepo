// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/weaver_core/sdk/agentDevelopmentKit.ts
================================================================================

```typescript
// weaver_core/sdk/agentDevelopmentKit.ts

// ================================================================= //
//                            PREAMBLE                               //
// ================================================================= //

/**
 * @file weaver_core/sdk/agentDevelopmentKit.ts
 * @description The official Agent Development Kit (ADK) for the Weaver Core Platform.
 * This SDK provides all the necessary types, interfaces, and utilities for third-party
 * developers to create, test, and publish powerful AI agents to the Agora Marketplace.
 * Agents built with this SDK can interact with user data, leverage platform AI services,
 * and contribute custom UI elements to the user's dashboard.
 *
 * @version 2.0.0
 * @author Weaver Core Platform Team
 * @license MIT
 */

// ================================================================= //
//                      GLOBAL & PLATFORM TYPES                      //
// ================================================================= //
// Note: In a real environment, these might be imported from a shared
// types package, e.g., '@weaver-core/platform-types'. For the purpose
// of this self-contained SDK, we define them here.

/**
 * Represents the profile of the user interacting with the agent.
 */
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    preferredLocale: string;
    timezone: string;
    riskAppetite: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
    financialGoals: string[];
}

/**
 * Represents a single financial transaction.
 */
export interface Transaction {
    id: string;
    accountId: string;
    amount: number;
    currency: string; // ISO 4217 currency code
    date: string; // ISO 8601 date string
    description: string;
    category: string;
    isPending: boolean;
    merchantInfo?: {
        name: string;
        logoUrl?: string;
    };
}

/**
 * Represents a user's investment holding.
 */
export interface PortfolioHolding {
    assetId: string;
    ticker: string;
    name: string;
    quantity: number;
    averageCost: number;
    currentValue: number;
    assetClass: 'EQUITY' | 'FIXED_INCOME' | 'CRYPTO' | 'REAL_ESTATE' | 'COMMODITY' | 'CASH';
}

/**
 * Represents a market data snapshot for a given ticker.
 */
export interface MarketData {
    ticker: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: number; // Unix timestamp
}

/**
 * Represents a trading order to be executed.
 */
export interface TradeOrder {
    ticker: string;
    quantity: number;
    orderType: 'MARKET' | 'LIMIT';
    side: 'BUY' | 'SELL';
    limitPrice?: number;
    timeInForce?: 'DAY' | 'GTC'; // Good 'til Canceled
}


// ================================================================= //
//                              ENUMS                                //
// ================================================================= //

/**
 * Defines the permissions an agent can request. The platform will ask
 * the user to grant these permissions upon agent installation.
 */
export enum Permission {
    // Data Read Permissions
    DATA_READ_PROFILE = "data:read:profile",
    DATA_READ_TRANSACTIONS = "data:read:transactions",
    DATA_READ_PORTFOLIO = "data:read:portfolio",
    DATA_READ_BUDGETS = "data:read:budgets",
    DATA_READ_GOALS = "data:read:goals",
    DATA_READ_CONTACTS = "data:read:contacts", // For payment agents

    // Data Write Permissions (High-Risk)
    DATA_WRITE_GOALS = "data:write:goals",
    DATA_CREATE_BUDGET = "data:write:budget",

    // Action Permissions (High-Risk)
    ACTION_EXECUTE_TRADE = "action:execute:trade",
    ACTION_TRANSFER_FUNDS = "action:transfer:funds",
    ACTION_SCHEDULE_PAYMENT = "action:schedule:payment",

    // AI Service Permissions
    AI_ACCESS_LANGUAGE_MODELS = "ai:access:llm",
    AI_ACCESS_IMAGE_GENERATION = "ai:access:image_gen",
    AI_ACCESS_DATA_ANALYSIS = "ai:access:data_analysis",
    AI_ACCESS_SENTIMENT_ANALYSIS = "ai:access:sentiment",
    AI_ACCESS_FORECASTING = "ai:access:forecasting",

    // UI Interaction Permissions
    UI_CREATE_NOTIFICATION = "ui:create:notification",
    UI_RENDER_DASHBOARD_CARD = "ui:render:dashboard_card",
    UI_RENDER_MODAL = "ui:render:modal",
    UI_RENDER_VIEW = "ui:render:view", // Full-screen view
    UI_ADD_COMMAND = "ui:add:command",

    // Network Permissions
    NETWORK_ACCESS_EXTERNAL_API = "network:access:external",
}

/**
 * Defines the types of triggers that can activate an agent's execution logic.
 */
export enum TriggerType {
    /** The agent is executed on a recurring schedule (defined by a cron string). */
    SCHEDULE = "SCHEDULE",
    /** The agent is executed in response to a specific platform event. */
    PLATFORM_EVENT = "PLATFORM_EVENT",
    /** The agent is executed when the user invokes a custom command. */
    USER_COMMAND = "USER_COMMAND",
    /** The agent is executed when a configured webhook URL is called. */
    WEBHOOK = "WEBHOOK",
    /** The agent is executed manually by the user from the agent's UI. */
    MANUAL = "MANUAL",
}

/**
 * Defines the available Large Language Models (LLMs) that agents can leverage.
 * The platform abstracts the underlying provider (e.g., Gemini, OpenAI).
 */
export enum AIModel {
    /** Optimized for speed and general tasks. */
    FAST = "weaver-ai-fast",
    /** The most capable and intelligent model, suitable for complex reasoning. */
    ADVANCED = "weaver-ai-advanced",
    /** A model fine-tuned for code generation and understanding. */
    CODE = "weaver-ai-code",
    /** A model optimized for financial data analysis and insights. */
    FINANCE = "weaver-ai-finance",
}

/**
 * Defines the severity level for notifications created by an agent.
 */
export enum NotificationSeverity {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    CRITICAL = "CRITICAL",
}

/**
 * The status of an agent submission to the Agora Marketplace.
 */
export enum SubmissionStatus {
    PENDING_REVIEW = "PENDING_REVIEW",
    IN_REVIEW = "IN_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PUBLISHED = "PUBLISHED",
}


// ================================================================= //
//                      AGENT MANIFEST & CONFIG                      //
// ================================================================= //

/**
 * Represents a custom UI element an agent contributes to the platform.
 */
export interface UIContribution {
    /** The type of UI element to contribute. */
    type: 'DASHBOARD_CARD' | 'FULL_VIEW' | 'SETTINGS_PANEL';
    /** A unique identifier for this contribution within the agent. */
    id: string;
    /** The title displayed to the user for this UI element. */
    title: string;
    /** An optional description. */
    description?: string;
    /** The function name exported from the agent's code that renders this component. */
    renderFunction: string;
}

/**
 * Defines the structure for an agent's activation trigger.
 */
export type AgentTrigger =
    | { type: TriggerType.SCHEDULE; schedule: string /* cron string */ }
    | { type: TriggerType.PLATFORM_EVENT; eventName: string /* e.g., 'transaction.created' */ }
    | { type: TriggerType.USER_COMMAND; command: string /* e.g., 'analyze-portfolio' */, description: string }
    | { type: TriggerType.WEBHOOK };

/**
 * The Agent Manifest is the central piece of metadata for an agent.
 * It describes the agent's identity, capabilities, required permissions,
 * and how it integrates with the Weaver Core Platform.
 */
export interface AgentManifest {
    /** A unique, reverse-domain identifier for the agent (e.g., 'com.acme.risk-analyzer'). */
    id: string;
    /** The human-readable name of the agent. */
    name: string;
    /** The semantic version of the agent (e.g., '1.2.3'). */
    version: string;
    /** A concise description of what the agent does. */
    description: string;
    /** Information about the author or company that created the agent. */
    author: {
        name: string;
        url?: string;
        email?: string;
    };
    /** An array of permissions required by the agent to function correctly. */
    permissions: Permission[];
    /** An array of triggers that will activate the agent. */
    triggers: AgentTrigger[];
    /** An array of custom UI elements this agent provides. */
    uiContributions?: UIContribution[];
    /**
     * A JSON schema object defining the configuration options for the agent.
     * The platform will use this to automatically generate a settings UI.
     * See: https://json-schema.org/
     */
    configSchema?: Record<string, any>;
    /**
     * If the agent requires external API access, specify the allowed domains here.
     * This must be accompanied by the NETWORK_ACCESS_EXTERNAL_API permission.
     */
    allowedDomains?: string[];
}


// ================================================================= //
//               AGENT EXECUTION CONTEXT & PAYLOADS                  //
// ================================================================= //

/**
 * The context object provided to an agent during every execution.
 * It is the primary way for an agent to interact with the platform and its own state.
 * @template ConfigType - The type generated from the agent's `configSchema`.
 */
export interface AgentContext<ConfigType = Record<string, any>> {
    /**
     * Access to the agent's configuration, as set by the user.
     * The shape of this object matches the `configSchema` in the manifest.
     */
    config: ConfigType;
    /**
     * A persistent, namespaced key-value store for the agent.
     * Data stored here will be available across executions.
     * The platform handles encryption and storage securely.
     */
    state: {
        /**
         * Retrieves a value from the agent's state.
         * @param key The key of the value to retrieve.
         * @returns A promise that resolves to the value, or undefined if not found.
         */
        get<T>(key: string): Promise<T | undefined>;
        /**
         * Stores a value in the agent's state.
         * @param key The key to store the value under.
         * @param value The value to store. Must be JSON-serializable.
         * @returns A promise that resolves when the value is saved.
         */
        set<T>(key: string, value: T): Promise<void>;
        /**
         * Deletes a value from the agent's state.
         * @param key The key of the value to delete.
         * @returns A promise that resolves when the value is deleted.
         */
        delete(key: string): Promise<void>;
    };
    /**
     * A secure store for sensitive data like API keys. Values are write-only
     * from the agent's settings UI and read-only from the agent's code.
     */
    secrets: {
        /**
         * Retrieves a secret value.
         * @param key The key of the secret to retrieve.
         * @returns A promise that resolves to the secret string, or undefined if not set.
         */
        get(key: string): Promise<string | undefined>;
    };
    /**
     * Provides access to all platform services and APIs.
     * This is the gateway for an agent to perform actions and retrieve data.
     */
    platform: PlatformAPI;
    /**
     * Information about the user who installed and is running the agent.
     */
    user: UserProfile;
}

/**
 * The payload of data that accompanies a trigger. The structure of this
 * object depends on the type of trigger that activated the agent.
 */
export type TriggerPayload =
    | { type: TriggerType.SCHEDULE; scheduledTime: string; }
    | { type: TriggerType.PLATFORM_EVENT; eventName: string; data: any; }
    | { type: TriggerType.USER_COMMAND; command: string; args: string[]; }
    | { type: TriggerType.WEBHOOK; body: any; headers: Record<string, string>; }
    | { type: TriggerType.MANUAL; source: { uiContributionId: string; } };

/**
 * The expected result from an agent's `onExecute` method.
 */
export interface ExecutionResult {
    /** Indicates whether the execution was successful. */
    success: boolean;
    /** An optional message for logging or display purposes. */
    message?: string;
    /**
     * An optional array of operations to perform on the agent's UI contributions.
     * This allows an agent to dynamically update its own UI after an execution.
     */
    uiOperations?: UIOperation[];
}

/**
 * Represents an operation to be performed on a UI contribution.
 */
export interface UIOperation {
    /** The ID of the UI contribution to target, as defined in the manifest. */
    targetId: string;
    /** The type of operation to perform. */
    operation: 'REFRESH_DATA' | 'SET_PROPERTY';
    /** The payload for the operation (e.g., for SET_PROPERTY, `{ key: 'title', value: 'New Title' }`). */
    payload?: any;
}


// ================================================================= //
//                         PLATFORM API                              //
// ================================================================= //

/**
 * The PlatformAPI provides a sandboxed, permission-controlled interface to the
 * full power of the Weaver Core Platform.
 */
export interface PlatformAPI {
    /**
     * The AI service provides access to a suite of powerful AI models for various tasks.
     * Usage is subject to rate limits and requires the appropriate `AI_ACCESS_*` permissions.
     */
    ai: {
        /**
         * Generates a text response from a given prompt using a specified language model.
         * @param prompt The input text to the model.
         * @param options Configuration options for the generation.
         * @returns A promise that resolves to the model's response string.
         */
        chatCompletion(prompt: string, options?: { model?: AIModel; systemMessage?: string; }): Promise<string>;
        /**
         * Generates an image based on a descriptive text prompt.
         * @param prompt A detailed description of the desired image.
         * @param options Configuration for image generation.
         * @returns A promise that resolves to the URL of the generated image.
         */
        generateImage(prompt: string, options?: { size?: '256x256' | '512x512' | '1024x1024'; quality?: 'standard' | 'hd'; }): Promise<string>;
        /**
         * Performs sentiment analysis on a piece of text.
         * @param text The text to analyze.
         * @returns A promise that resolves to an object containing the sentiment score.
         */
        analyzeSentiment(text: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral'; score: number; }>;
        /**
         * Provides financial forecasting based on historical data.
         * @param data An array of historical data points.
         * @param options Forecasting parameters.
         * @returns A promise that resolves to an array of forecasted data points.
         */
        getForecast(data: { timestamp: number; value: number }[], options: { periods: number; model: 'ARIMA' | 'LSTM' }): Promise<{ timestamp: number; value: number }[]>;
    };

    /**
     * The Data service provides secure, read-only access to the user's financial data,
     * contingent on granted permissions.
     */
    data: {
        /**
         * Retrieves a list of the user's financial transactions.
         * @param options Filtering options for the query.
         * @returns A promise that resolves to an array of Transaction objects.
         */
        getTransactions(options?: { from?: Date; to?: Date; accountId?: string; limit?: number; }): Promise<Transaction[]>;
        /**
         * Retrieves the user's current investment portfolio.
         * @returns A promise that resolves to an array of PortfolioHolding objects.
         */
        getPortfolio(): Promise<PortfolioHolding[]>;
        /**
         * Fetches real-time or delayed market data for a given list of tickers.
         * @param tickers An array of stock/crypto tickers.
         * @returns A promise that resolves to an array of MarketData objects.
         */
        getMarketData(tickers: string[]): Promise<MarketData[]>;
    };

    /**
     * The Actions service allows an agent to perform operations on behalf of the user.
     * These are high-risk operations and require explicit permissions and often user confirmation.
     */
    actions: {
        /**
         * Executes a trade in the user's brokerage account.
         * Requires `ACTION_EXECUTE_TRADE` permission. The platform will typically require
         * multi-factor authentication from the user before finalizing the trade.
         * @param order The trade order to execute.
         * @returns A promise that resolves with the trade confirmation ID.
         */
        executeTrade(order: TradeOrder): Promise<{ confirmationId: string; status: 'PENDING_CONFIRMATION' | 'EXECUTED' }>;
        /**
         * Creates a notification in the user's main dashboard feed.
         * Requires `UI_CREATE_NOTIFICATION` permission.
         * @param message The content of the notification.
         * @param severity The importance level of the notification.
         * @param options Additional options, like a call-to-action button.
         */
        createNotification(message: string, severity: NotificationSeverity, options?: { ctaLabel?: string; ctaAction?: string; }): Promise<void>;
    };

    /**
     * The UI service allows an agent to interact with the user interface, such as
     * rendering custom modals or views.
     */
    ui: {
        /**
         * Renders a custom UI component in a modal dialog.
         * Requires `UI_RENDER_MODAL` permission.
         * @param renderFunction The name of the exported render function to call.
         * @param props The properties to pass to the render function.
         * @returns A promise that resolves with any data returned by the modal when it closes.
         */
        showModal(renderFunction: string, props: Record<string, any>): Promise<any>;
    };
    
    /**
     * A simple logging utility that integrates with the platform's central logging system.
     * Logs are viewable by the user and the developer for debugging purposes.
     */
    log: {
        info(message: string, data?: Record<string, any>): void;
        warn(message: string, data?: Record<string, any>): void;
        error(error: Error | string, data?: Record<string, any>): void;
    };
}


// ================================================================= //
//                      AGENT IMPLEMENTATION                         //
// ================================================================= //

/**
 * The core interface that every agent must implement.
 * @template ConfigType - The type for the agent's configuration object.
 */
export interface Agent<ConfigType = Record<string, any>> {
    /**
     * The agent's manifest. This is static metadata that describes the agent.
     */
    manifest: AgentManifest;

    /**
     * The main execution logic of the agent. This method is called by the platform
     * whenever one of the agent's declared triggers is activated.
     * @param trigger The payload of the trigger that initiated this execution.
     * @param context The execution context, providing access to state and platform APIs.
     * @returns A promise that resolves to an ExecutionResult.
     */
    onExecute(trigger: TriggerPayload, context: AgentContext<ConfigType>): Promise<ExecutionResult>;

    /**
     * An optional lifecycle method called once when the agent is first installed by a user.
     * This is a good place to set up initial state.
     * @param context The execution context.
     * @returns A promise that resolves when initialization is complete.
     */
    onInstall?(context: AgentContext<ConfigType>): Promise<void>;

    /**
     * An optional lifecycle method called when a user updates the agent to a new version.
     * This is the place to perform state migrations or other update tasks.
     * @param context The execution context.
     * @param oldVersion The semantic version the user is updating from.
     * @returns A promise that resolves when the update logic is complete.
     */
    onUpdate?(context: AgentContext<ConfigType>, oldVersion: string): Promise<void>;

    /**
     * An optional lifecycle method called when the agent is uninstalled by a user.
     * This can be used for cleanup tasks.
     * @param context The execution context.
     * @returns A promise that resolves when cleanup is complete.
     */
    onUninstall?(context: AgentContext<ConfigType>): Promise<void>;
}


// ================================================================= //
//                            SDK UTILITIES                          //
// ================================================================= //

/**
 * A wrapper function used to declare an agent. While it simply returns the
 * agent object, it provides type safety and may be used by future platform
* toolchains for static analysis, packaging, and validation.
 *
 * @example
 * ```
 * export default defineAgent({
 *   manifest: { ... },
 *   async onExecute(trigger, context) {
 *     // agent logic here
 *     return { success: true };
 *   }
 * });
 * ```
 * @param agent The agent implementation object.
 * @returns The validated and typed agent implementation.
 */
export function defineAgent<T>(agent: Agent<T>): Agent<T> {
    // In a real SDK, this function could perform extensive validation
    // on the manifest, check for required methods, etc.
    if (!agent.manifest.id || !agent.manifest.name || !agent.manifest.version) {
        throw new Error("Agent manifest is missing required fields: id, name, version.");
    }
    if (!agent.onExecute || typeof agent.onExecute !== 'function') {
        throw new Error("Agent must implement the 'onExecute' method.");
    }
    // TODO: Add more validation logic here.
    return agent;
}

/**
 * Represents a packaged agent ready for submission to the marketplace.
 * This is an opaque type; developers should not construct it directly.
 */
export type AgentPackage = {
    payload: string; // Base64 encoded tarball of agent code and assets
    signature: string; // Signature of the payload
    manifest: AgentManifest;
};

/**
 * A client for interacting with the Agora Marketplace API to publish and manage agents.
 * This would typically be used in a separate publishing script, not within the agent code itself.
 */
export class MarketplacePublisher {
    private readonly apiKey: string;
    private readonly apiBaseUrl: string = "https://agora.weaver-core.com/api/v1";

    /**
     * Creates a new MarketplacePublisher instance.
     * @param apiKey Your developer API key for the Agora Marketplace.
     */
    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error("An Agora Marketplace API key is required.");
        }
        this.apiKey = apiKey;
    }

    /**
     * Packages the agent's code and manifest into a distributable format.
     * NOTE: This is a placeholder for a more complex local CLI operation.
     * In a real SDK, this would likely involve a separate CLI tool that bundles
     * the TypeScript code, assets, and signs the package.
     * @param agent The agent object to package.
     * @param privateKey A developer private key for signing the package.
     * @returns A promise that resolves to the packaged agent.
     */
    public async package(agent: Agent<any>, privateKey: string): Promise<AgentPackage> {
        console.log(`Packaging agent '${agent.manifest.id}' version ${agent.manifest.version}...`);
        // Placeholder for actual packaging logic (e.g., esbuild, tar, sign)
        const payload = Buffer.from(JSON.stringify({ manifest: agent.manifest, code: "/* transpiled code here */" })).toString('base64');
        const signature = `signed(${payload.substring(0, 10)}..., ${privateKey.substring(0, 5)}...)`;
        console.log("Packaging complete.");
        return {
            payload,
            signature,
            manifest: agent.manifest,
        };
    }

    /**
     * Submits a packaged agent to the Agora Marketplace for review.
     * @param pkg The agent package returned by the `package` method.
     * @returns A promise that resolves to an object containing the submission ID.
     */
    public async submit(pkg: AgentPackage): Promise<{ submissionId: string }> {
        console.log(`Submitting '${pkg.manifest.id}' to the Agora Marketplace...`);
        const response = await fetch(`${this.apiBaseUrl}/submissions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pkg),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Failed to submit package: ${errorBody.message || response.statusText}`);
        }
        
        console.log("Submission successful.");
        return await response.json();
    }

    /**
     * Checks the status of a previous submission.
     * @param submissionId The ID of the submission to check.
     * @returns A promise that resolves to an object containing the submission status.
     */
    public async getStatus(submissionId: string): Promise<{ status: SubmissionStatus; reviewNotes?: string; }> {
        const response = await fetch(`${this.apiBaseUrl}/submissions/${submissionId}`, {
            headers: { 'Authorization': `Bearer ${this.apiKey}` }
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Failed to get submission status: ${errorBody.message || response.statusText}`);
        }

        return await response.json();
    }
}
```