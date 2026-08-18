// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/ecosystem/IntegrationsMarketplaceView.tsx
================================================================================

// components/views/megadashboard/ecosystem/IntegrationsMarketplaceView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

const IntegrationsMarketplaceView: React.FC = () => {
    const [isIdeaModalOpen, setIdeaModalOpen] = useState(false);
    const [prompt, setPrompt] = useState("an integration that syncs customer data with our CRM");
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setIdea('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `Brainstorm a brief, high-level implementation plan for the following integration idea: "${prompt}". Suggest the key API endpoints that would be needed from Demo Bank.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            setIdea(response.text);
        } catch (err) {
            setIdea("Error generating idea.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Integrations Marketplace</h2>
                    <button onClick={() => setIdeaModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Integration Ideator</button>
                </div>
                <Card title="Featured Integrations">
                     <p className="text-gray-400">This section would showcase popular integrations like Slack, Salesforce, etc.</p>
                </Card>
            </div>
            {isIdeaModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setIdeaModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Integration Ideator</h3></div>
                        <div className="p-6 space-y-4">
                             <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your integration idea..." className="w-full h-24 bg-gray-700/50 p-2 rounded text-white" />
                             <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Plan'}</button>
                            <Card title="Generated Plan"><div className="min-h-[10rem] text-sm text-gray-300 whitespace-pre-line">{isLoading ? '...' : idea}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default IntegrationsMarketplaceView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/ecosystem/IntegrationsMarketplaceView.tsx
================================================================================

import React, { useState, useEffect, useCallback, useReducer, useRef, createContext, useContext } from 'react';
import Card from '../../../Card';
import { GoogleGenerativeAI } from "@google/generative-ai";

// region: --- Shared Utility Functions & Types ---

/**
 * Generates a unique identifier (UUID v4 style).
 * @returns {string} A UUID string.
 */
const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Debounces a function call.
 * @param func The function to debounce.
 * @param delay The delay in milliseconds.
 * @returns A debounced version of the function.
 */
const useDebounce = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    const debouncedFunc = useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            func(...args);
        }, delay);
    }, [func, delay]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedFunc as T;
};

/**
 * Formats a date string.
 * @param dateString The date string to format.
 * @returns A formatted date string.
 */
const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Type for a generic notification/toast message.
 */
export type ToastMessage = {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number; // Milliseconds
};

/**
 * Context for managing global toast notifications.
 */
export const ToastContext = createContext<{
    addToast: (message: Omit<ToastMessage, 'id'>) => void;
}>({
    addToast: () => {}
});

/**
 * A hook to easily add toast messages.
 */
export const useToast = () => useContext(ToastContext);

// endregion

// region: --- Data Models & Mock Data ---

/**
 * Represents a category for integrations.
 */
export type IntegrationCategory = 'CRM' | 'Analytics' | 'Marketing' | 'Finance' | 'Communication' | 'Productivity' | 'Developer Tools' | 'Security' | 'HR' | 'E-commerce' | 'Data Sync' | 'AI & ML' | 'ERP' | 'Payments';

/**
 * Represents a tag for integrations.
 */
export type IntegrationTag = 'popular' | 'new' | 'free' | 'premium' | 'enterprise' | 'data-sync' | 'automation' | 'reporting' | 'notifications' | 'payments' | 'dev-ops' | 'ai-powered';

/**
 * Represents a feature an integration offers.
 */
export type IntegrationFeature = {
    id: string;
    name: string;
    description: string;
    icon?: string; // e.g., 'fas fa-sync-alt'
};

/**
 * Represents compatibility information for an integration.
 */
export type IntegrationCompatibility = {
    platform: string; // e.g., 'Web', 'Mobile', 'Desktop'
    version?: string;
    notes?: string;
};

/**
 * Defines pricing models for integrations.
 */
export type IntegrationPricingModel = 'Free' | 'Freemium' | 'Subscription' | 'Per-usage' | 'Enterprise';

/**
 * Represents a specific pricing plan for an integration.
 */
export type IntegrationPlan = {
    id: string;
    name: string;
    description: string;
    price: number; // In USD, 0 for free
    currency: string;
    interval?: 'month' | 'year' | 'one-time'; // For subscriptions
    features: string[]; // List of features included
    isTrialAvailable: boolean;
    trialDurationDays?: number;
};

/**
 * Represents the status of an integration in the marketplace.
 */
export type IntegrationStatus = 'active' | 'pending-review' | 'rejected' | 'draft' | 'archived';

/**
 * Represents a changelog entry for an integration version.
 */
export type ChangelogEntry = {
    version: string;
    date: string;
    description: string;
    changes: {
        type: 'feature' | 'fix' | 'improvement' | 'breaking';
        details: string;
    }[];
};


/**
 * Main type for an Integration.
 */
export type Integration = {
    id: string;
    name: string;
    slug: string; // URL friendly identifier
    shortDescription: string;
    longDescription: string;
    logoUrl: string;
    bannerUrl?: string;
    category: IntegrationCategory;
    tags: IntegrationTag[];
    developerId: string;
    developerName: string;
    website: string;
    documentationUrl: string;
    supportEmail: string;
    features: IntegrationFeature[];
    compatibility: IntegrationCompatibility[];
    pricingModel: IntegrationPricingModel;
    pricingPlans: IntegrationPlan[];
    averageRating: number;
    totalReviews: number;
    installationCount: number;
    status: IntegrationStatus;
    createdAt: string;
    updatedAt: string;
    version: string;
    changelog: ChangelogEntry[];
    compliance?: {
        gdpr: boolean;
        soc2: boolean;
        hipaa: boolean;
    };
    setupGuideMarkdown: string; // Markdown content for setup instructions
    apiEndpointsNeeded: string[]; // Key Demo Bank API endpoints this integration typically uses
    configSchema?: Record<string, any>; // JSON schema for configuration
    webhookEventsSupported?: WebhookEvent[];
    dataSyncCapabilities?: {
        direction: 'inbound' | 'outbound' | 'bidirectional';
        entities: string[]; // e.g., 'customers', 'transactions', 'invoices'
    };
};

/**
 * Represents a user review for an integration.
 */
export type Review = {
    id: string;
    integrationId: string;
    userId: string;
    userName: string;
    rating: number; // 1-5 stars
    title: string;
    comment: string;
    createdAt: string;
    responseFromDeveloper?: {
        developerId: string;
        comment: string;
        createdAt: string;
    };
};

/**
 * Represents a developer profile.
 */
export type Developer = {
    id: string;
    name: string;
    email: string;
    website: string;
    integrations: string[]; // IDs of integrations developed
    memberSince: string;
    contactPerson: string;
    isVerified: boolean;
};

/**
 * Represents an API Key for developer access.
 */
export type APIKey = {
    id: string;
    key: string;
    name: string;
    developerId: string;
    createdAt: string;
    expiresAt?: string;
    permissions: string[]; // e.g., 'integrations:read', 'integrations:write', 'webhooks:manage'
    isActive: boolean;
};

/**
 * Represents an event type that can trigger a webhook.
 */
export type WebhookEvent = 'customer.created' | 'customer.updated' | 'transaction.completed' | 'transaction.failed' | 'invoice.paid' | 'invoice.created' | 'integration.installed' | 'integration.uninstalled';

/**
 * Represents a webhook subscription made by a developer.
 */
export type WebhookSubscription = {
    id: string;
    developerId: string;
    integrationId?: string; // Optional: if webhook is specific to an integration
    callbackUrl: string;
    events: WebhookEvent[];
    secret: string; // Used for signature verification
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastTriggeredAt?: string;
    failureCount: number;
    status: 'active' | 'inactive' | 'suspended';
};

/**
 * Represents a log entry for a webhook delivery attempt.
 */
export type WebhookLog = {
    id: string;
    subscriptionId: string;
    eventId: string; // Unique ID for the event that triggered the webhook
    eventType: WebhookEvent;
    payload: string; // JSON string of the payload
    statusCode: number;
    responseBody: string;
    attemptedAt: string;
    isSuccess: boolean;
    error?: string;
};

/**
 * Represents an instance of an integration activated by a user.
 */
export type IntegrationInstance = {
    id: string;
    integrationId: string;
    userId: string;
    installedAt: string;
    lastSyncedAt?: string;
    status: 'active' | 'disconnected' | 'error' | 'degraded';
    configuration: Record<string, any>; // User-specific configuration
    planId?: string; // The pricing plan selected
    metadata?: Record<string, any>; // Any additional metadata
};

/**
 * Represents a step in an AI-generated setup guide.
 */
export type AISetupStep = {
    order: number;
    title: string;
    description: string;
    codeSnippet?: string;
    type: 'instruction' | 'api-call' | 'configuration' | 'verification';
    expectedResult?: string;
};

/**
 * Represents an AI-generated integration template or code snippet.
 */
export type AICodeSnippet = {
    id: string;
    name: string;
    language: 'javascript' | 'python' | 'go' | 'ruby' | 'java' | 'curl' | 'shell';
    description: string;
    code: string;
    integrationTarget?: string; // e.g., 'Salesforce CRM API', 'Slack Webhooks'
    apiEndpointsUsed: string[]; // Specific Demo Bank API endpoints
};

// --- Mock Data Generation Functions (for large datasets) ---

const mockIntegrations: Integration[] = [];
const mockReviews: Review[] = [];
const mockIntegrationInstances: IntegrationInstance[] = [];
const mockAPIKeys: APIKey[] = [];
const mockWebhookSubscriptions: WebhookSubscription[] = [];
const mockWebhookLogs: WebhookLog[] = [];
const mockDevelopers: Developer[] = [];
const mockCodeSnippets: AICodeSnippet[] = [];

const categories: IntegrationCategory[] = ['CRM', 'Analytics', 'Marketing', 'Finance', 'Communication', 'Productivity', 'Developer Tools', 'Security', 'HR', 'E-commerce', 'Data Sync', 'AI & ML', 'ERP', 'Payments'];
const tags: IntegrationTag[] = ['popular', 'new', 'free', 'premium', 'enterprise', 'data-sync', 'automation', 'reporting', 'notifications', 'payments', 'dev-ops', 'ai-powered'];
const webhookEvents: WebhookEvent[] = ['customer.created', 'customer.updated', 'transaction.completed', 'invoice.paid', 'integration.installed'];
const apiEndpoints: string[] = ['GET /customers', 'POST /customers', 'PUT /customers/{id}', 'GET /transactions', 'POST /transactions', 'GET /accounts/{id}/balance', 'POST /payments', 'GET /invoices', 'POST /webhooks/subscribe', 'GET /webhooks/events'];
const fortune500inspiredNames = ['Salesforce Connect', 'Slack Alerter', 'Stripe Payments', 'SAP ERP Sync', 'Google Analytics Pro', 'Microsoft Teams Bridge', 'Zendesk Support Link'];

const generateMockDeveloper = (id: string, name: string): Developer => ({
    id,
    name,
    email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
    website: `https://${name.toLowerCase().replace(/\s/g, '')}.com`,
    integrations: [],
    memberSince: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5).toISOString(), // Up to 5 years ago
    contactPerson: `${name} Support`,
    isVerified: Math.random() > 0.3,
});

// Generate 10 mock developers
for (let i = 0; i < 10; i++) {
    const dev = generateMockDeveloper(generateUUID(), `Dev Company ${i + 1}`);
    mockDevelopers.push(dev);
}

const generateMockIntegration = (index: number): Integration => {
    const dev = mockDevelopers[Math.floor(Math.random() * mockDevelopers.length)];
    const name = index < fortune500inspiredNames.length ? fortune500inspiredNames[index] : `Integration App ${index + 1}`;
    const slug = name.toLowerCase().replace(/\s/g, '-');
    const category = categories[Math.floor(Math.random() * categories.length)];
    const numTags = Math.floor(Math.random() * 3) + 1;
    const selectedTags = Array.from({ length: numTags }, () => tags[Math.floor(Math.random() * tags.length)]);
    const rating = parseFloat((Math.random() * 2 + 3).toFixed(1)); // 3.0 to 5.0
    const totalReviews = Math.floor(Math.random() * 200) + 10;
    const installationCount = Math.floor(Math.random() * 5000) + 50;
    const version = "1.2.3";

    const pricingModel = ['Free', 'Freemium', 'Subscription'][Math.floor(Math.random() * 3)] as IntegrationPricingModel;
    const pricingPlans: IntegrationPlan[] = [];
    if (pricingModel === 'Free') {
        pricingPlans.push({
            id: generateUUID(), name: 'Free Tier', description: 'Basic features for free.', price: 0, currency: 'USD',
            features: ['Basic sync', 'Limited reports'], isTrialAvailable: false
        });
    } else if (pricingModel === 'Freemium' || pricingModel === 'Subscription') {
        pricingPlans.push({
            id: generateUUID(), name: 'Basic', description: 'Essential features.', price: Math.floor(Math.random() * 20) + 5, currency: 'USD',
            interval: 'month', features: ['Core sync', 'Standard reports'], isTrialAvailable: true, trialDurationDays: 14
        });
        pricingPlans.push({
            id: generateUUID(), name: 'Pro', description: 'Advanced capabilities.', price: Math.floor(Math.random() * 50) + 25, currency: 'USD',
            interval: 'month', features: ['All features', 'Priority support', 'Advanced Analytics'], isTrialAvailable: true, trialDurationDays: 14
        });
        pricingPlans.push({
            id: generateUUID(), name: 'Enterprise', description: 'For large-scale deployments.', price: Math.floor(Math.random() * 200) + 100, currency: 'USD',
            interval: 'month', features: ['All features', 'Dedicated Support', 'SLA Guarantee'], isTrialAvailable: false
        });
    }

    const numEndpoints = Math.floor(Math.random() * 3) + 1;
    const selectedEndpoints = Array.from({ length: numEndpoints }, () => apiEndpoints[Math.floor(Math.random() * apiEndpoints.length)]);

    const integration: Integration = {
        id: generateUUID(),
        name,
        slug,
        version,
        shortDescription: `A powerful integration to connect your ${category} workflows with Demo Bank.`,
        longDescription: `Unlock the full potential of your business operations by seamlessly integrating ${name} with Demo Bank. This robust solution offers advanced data synchronization, real-time analytics, and automated workflows. Whether you're looking to streamline customer data, automate financial reporting, or enhance your marketing campaigns, ${name} provides a comprehensive suite of features designed to boost efficiency and drive growth. Enjoy easy setup, reliable performance, and dedicated support.`,
        logoUrl: `https://placehold.co/150x150/0ea5e9/white?text=${name.split(' ').map(n => n[0]).join('')}`,
        bannerUrl: `https://placehold.co/1200x400/1f2937/9ca3af?text=${name.replace(/\s/g, '+')}`,
        category,
        tags: selectedTags,
        developerId: dev.id,
        developerName: dev.name,
        website: dev.website,
        documentationUrl: `${dev.website}/docs/${slug}`,
        supportEmail: dev.email,
        features: [
            { id: generateUUID(), name: 'Real-time Sync', description: 'Synchronize data instantly between systems.' },
            { id: generateUUID(), name: 'Automated Workflows', description: 'Set up rules to automate routine tasks.' },
            { id: generateUUID(), name: 'Customizable Dashboards', description: 'Build dashboards with relevant metrics.' },
            { id: generateUUID(), name: 'Secure Data Handling', description: 'Ensure data privacy and compliance.' },
        ],
        compatibility: [{ platform: 'Web', version: '1.0', notes: 'Compatible with modern web browsers.' }],
        pricingModel,
        pricingPlans,
        averageRating: rating,
        totalReviews,
        installationCount,
        status: (['active', 'pending-review', 'draft'] as IntegrationStatus[])[Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        compliance: {
            gdpr: Math.random() > 0.3,
            soc2: Math.random() > 0.5,
            hipaa: Math.random() > 0.8,
        },
        changelog: [
            {
                version: '1.2.3', date: new Date().toISOString(), description: 'Maintenance release.',
                changes: [{ type: 'fix', details: 'Fixed a bug with transaction syncing.' }]
            },
            {
                version: '1.2.0', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), description: 'New features and improvements.',
                changes: [
                    { type: 'feature', details: 'Added support for invoice webhooks.' },
                    { type: 'improvement', details: 'Improved UI for configuration settings.' },
                ]
            },
        ],
        setupGuideMarkdown: `# Getting Started with ${name} Integration...`, // Abridged for brevity
        apiEndpointsNeeded: selectedEndpoints,
        configSchema: {
            type: "object",
            properties: {
                syncInterval: { type: "number", default: 60, title: "Sync Interval (minutes)" },
                syncCustomers: { type: "boolean", default: true, title: "Sync Customer Data" },
                syncTransactions: { type: "boolean", default: true, title: "Sync Transaction Data" },
                sendNotifications: { type: "boolean", default: false, title: "Send Sync Notifications" },
            },
            required: ["syncInterval"]
        },
        webhookEventsSupported: Math.random() > 0.5 ? [webhookEvents[Math.floor(Math.random() * webhookEvents.length)]] : [],
        dataSyncCapabilities: Math.random() > 0.3 ? {
            direction: ['inbound', 'outbound', 'bidirectional'][Math.floor(Math.random() * 3)] as any,
            entities: ['customers', 'transactions', 'invoices'].filter(() => Math.random() > 0.4)
        } : undefined,
    };
    dev.integrations.push(integration.id);
    return integration;
};

// Generate 100 mock integrations
for (let i = 0; i < 100; i++) {
    mockIntegrations.push(generateMockIntegration(i));
}

// Generate reviews for existing integrations
mockIntegrations.forEach(integration => {
    for (let i = 0; i < integration.totalReviews; i++) {
        const rating = Math.floor(Math.random() * 3) + 3; // Skew reviews to be positive
        mockReviews.push({
            id: generateUUID(),
            integrationId: integration.id,
            userId: generateUUID(),
            userName: `User ${i + 1}`,
            rating: rating,
            title: rating > 3 ? `Great app for ${integration.category}!` : 'Could be better',
            comment: rating > 3 ? `This integration has significantly improved our workflow. Highly recommend it for anyone needing to manage ${integration.category.toLowerCase()} data efficiently.` : `It works, but the setup was complicated and the UI is a bit clunky.`,
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        });
    }
});

// Generate mock installed instances for a hypothetical user
const MOCK_USER_ID = 'user-abc-123';
mockIntegrations.slice(0, 5).forEach(integration => {
    mockIntegrationInstances.push({
        id: generateUUID(),
        integrationId: integration.id,
        userId: MOCK_USER_ID,
        installedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastSyncedAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: (['active', 'degraded', 'error'] as const)[Math.floor(Math.random() * 3)],
        configuration: {
            syncInterval: Math.floor(Math.random() * 60) + 10,
            syncCustomers: true,
            syncTransactions: Math.random() > 0.5,
            sendNotifications: Math.random() > 0.5,
        },
        planId: integration.pricingPlans.length > 0 ? integration.pricingPlans[Math.floor(Math.random() * integration.pricingPlans.length)].id : undefined,
    });
});

// Generate mock API keys for a developer
if (mockDevelopers.length > 0) {
    for (let i = 0; i < 3; i++) {
        mockAPIKeys.push({
            id: generateUUID(),
            key: `db_pk_test_${generateUUID().replace(/-/g, '').slice(0, 32)}`,
            name: `My Dev Key ${i + 1}`,
            developerId: mockDevelopers[0].id,
            createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
            expiresAt: i === 0 ? undefined : new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            permissions: ['integrations:read', 'webhooks:manage'],
            isActive: true,
        });
    }

    // Generate mock webhooks for a developer
    for (let i = 0; i < 2; i++) {
        const subId = generateUUID();
        mockWebhookSubscriptions.push({
            id: subId,
            developerId: mockDevelopers[0].id,
            callbackUrl: `https://webhook.site/abc-${i + 1}`,
            events: [webhookEvents[i], webhookEvents[i + 1 % webhookEvents.length]],
            secret: generateUUID().replace(/-/g, ''),
            isActive: true,
            createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            lastTriggeredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            failureCount: Math.floor(Math.random() * 3),
            status: 'active',
        });
        // Add some logs for the webhook
        for (let j = 0; j < 5; j++) {
            const isSuccess = Math.random() > 0.2;
            mockWebhookLogs.push({
                id: generateUUID(),
                subscriptionId: subId,
                eventId: generateUUID(),
                eventType: webhookEvents[i],
                payload: JSON.stringify({ event: webhookEvents[i], data: { id: generateUUID(), type: 'mock' } }),
                statusCode: isSuccess ? 200 : (Math.random() > 0.5 ? 400 : 500),
                responseBody: isSuccess ? 'OK' : 'Error processing webhook',
                attemptedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                isSuccess,
                error: isSuccess ? undefined : 'Simulated error',
            });
        }
    }
}

// Generate mock AI Code Snippets
for (let i = 0; i < 10; i++) {
    const target = mockIntegrations[Math.floor(Math.random() * mockIntegrations.length)].name;
    const lang = ['javascript', 'python', 'curl', 'go'][Math.floor(Math.random() * 4)];
    const endpoints = Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => apiEndpoints[Math.floor(Math.random() * apiEndpoints.length)]);
    const code = `...`; // Abridged for brevity
    mockCodeSnippets.push({
        id: generateUUID(),
        name: `Code Snippet for ${target} (${lang})`,
        language: lang as any,
        description: `Example code to interact with Demo Bank's APIs, often used by ${target}.`,
        code,
        integrationTarget: target,
        apiEndpointsUsed: endpoints,
    });
}

// endregion

// region: --- Generic UI Components ---

/**
 * A simple modal component.
 */
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' }> = ({
    isOpen, onClose, title, children, size = 'md'
}) => {
    if (!isOpen) return null;

    const modalSizes = {
        sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl', '3xl': 'max-w-3xl', '4xl': 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm" onClick={onClose}>
            <div className={`bg-gray-800 rounded-lg shadow-2xl ${modalSizes[size]} w-full border border-gray-700`} onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

/**
 * A basic confirmation modal.
 */
export const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isLoading = false }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 text-sm" disabled={isLoading}>{cancelText}</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>{isLoading ? 'Processing...' : confirmText}</button>
            </div>
        </Modal>
    );
};

/**
 * A generic loading spinner component.
 */
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg', color?: string }> = ({ size = 'md', color = 'text-cyan-500' }) => {
    const sizeClasses = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
    return (
        <svg className={`animate-spin ${sizeClasses[size]} ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
};

/**
 * Toast Notification component.
 */
export const ToastNotification: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (toast.duration) {
            timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration);
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [toast.id, toast.duration, onDismiss]);

    const bgColor = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600', warning: 'bg-yellow-600' }[toast.type];
    const icon = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }[toast.type];

    return (
        <div className={`flex items-center justify-between p-4 mb-2 text-white rounded-lg shadow-lg ${bgColor} transform transition-all ease-out duration-300 toast-enter-active toast-exit-active`}>
            <div className="flex items-center">
                <span className="mr-3 text-xl">{icon}</span>
                <span>{toast.message}</span>
            </div>
            <button onClick={() => onDismiss(toast.id)} className="ml-4 text-white opacity-70 hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
        </div>
    );
};

/**
 * Toast notification container.
 */
export const ToastContainer: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
        const id = generateUUID();
        setToasts(prevToasts => [...prevToasts, { ...message, id, duration: message.duration || 5000 }]);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    const toastContextValue = { addToast };

    return (
        <ToastContext.Provider value={toastContextValue}>
            {children}
            <div className="fixed bottom-4 right-4 z-[101] w-80 max-w-full">
                {toasts.map(toast => (
                    <ToastNotification key={toast.id} toast={toast} onDismiss={dismissToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};


// endregion

// region: --- Marketplace Specific Components ---

/**
 * Displays a single integration card.
 */
export const IntegrationCard: React.FC<{ integration: Integration; onDetailView: (integration: Integration) => void; isInstalled: boolean }> = ({ integration, onDetailView, isInstalled }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center border border-gray-700 hover:border-cyan-600 transition-all duration-200 shadow-lg">
            <img src={integration.logoUrl} alt={`${integration.name} Logo`} className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-gray-600" />
            <h3 className="text-xl font-bold text-white mb-2">{integration.name}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{integration.shortDescription}</p>
            <div className="flex items-center text-yellow-500 mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} className={`h-5 w-5 ${i < Math.round(integration.averageRating) ? 'text-yellow-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-gray-300 text-sm">({integration.totalReviews})</span>
            </div>
            <div className="mb-4">
                <span className="bg-cyan-800 text-cyan-200 text-xs px-2 py-1 rounded-full">{integration.category}</span>
                {integration.tags.includes('free') && <span className="bg-green-800 text-green-200 text-xs px-2 py-1 rounded-full ml-2">Free</span>}
            </div>
            <div className="mt-auto">
                <button onClick={() => onDetailView(integration)} className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                    {isInstalled ? 'View Installed' : 'View Details'}
                </button>
            </div>
        </div>
    );
};

/**
 * Filter and search controls for integrations.
 */
export const IntegrationsFilterAndSearch: React.FC<{
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedCategory: IntegrationCategory | 'All';
    onCategoryChange: (category: IntegrationCategory | 'All') => void;
    categories: IntegrationCategory[];
}> = ({ searchQuery, onSearchChange, selectedCategory, onCategoryChange, categories }) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow">
                <input type="text" placeholder="Search integrations..." value={searchQuery} onChange={e => onSearchChange(e.target.value)} className="w-full bg-gray-700/50 p-3 rounded-lg text-white placeholder-gray-400 border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200" />
            </div>
            <div>
                <select value={selectedCategory} onChange={e => onCategoryChange(e.target.value as IntegrationCategory | 'All')} className="w-full md:w-auto bg-gray-700/50 p-3 rounded-lg text-white border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200">
                    <option value="All">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

/**
 * Pagination controls for lists of items.
 */
export const PaginationControls: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors duration-200">Previous</button>
            {pageNumbers.map(page => (<button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 rounded-md ${page === currentPage ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors duration-200`}>{page}</button>))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors duration-200">Next</button>
        </div>
    );
};

/**
 * Sub-component for displaying integration features.
 */
export const IntegrationFeaturesList: React.FC<{ features: IntegrationFeature[] }> = ({ features }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map(feature => (
            <div key={feature.id} className="flex items-start p-3 bg-gray-700 rounded-md">
                {feature.icon && <i className={`${feature.icon} text-cyan-400 mr-3 mt-1`}></i>}
                <div>
                    <h4 className="font-semibold text-white text-md">{feature.name}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
            </div>
        ))}
    </div>
);

/**
 * Sub-component for displaying integration pricing plans.
 */
export const IntegrationPricingSection: React.FC<{ pricingModel: IntegrationPricingModel; pricingPlans: IntegrationPlan[]; onSelectPlan: (planId: string) => void }> = ({ pricingModel, pricingPlans, onSelectPlan }) => {
    const { addToast } = useToast();
    const handlePlanSelect = (plan: IntegrationPlan) => {
        onSelectPlan(plan.id);
        addToast({ type: 'info', message: `Selected ${plan.name} plan.` });
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-white mb-4">Pricing Plans ({pricingModel})</h3>
            {pricingPlans.length === 0 && <p className="text-gray-400">No specific plans listed. Contact developer for pricing.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pricingPlans.map(plan => (
                    <div key={plan.id} className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-500 transition-colors duration-200 shadow-md">
                        <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                        <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                        <p className="text-3xl font-extrabold text-cyan-400 mb-4">{plan.price === 0 ? 'Free' : `${plan.currency} ${plan.price}${plan.interval ? `/${plan.interval}` : ''}`}</p>
                        <ul className="list-disc list-inside text-gray-400 text-sm mb-6">{plan.features.map((feature, idx) => <li key={idx}>{feature}</li>)}</ul>
                        {plan.isTrialAvailable && (<p className="text-xs text-blue-300 mb-4">Free {plan.trialDurationDays}-day trial available!</p>)}
                        <button onClick={() => handlePlanSelect(plan)} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md font-medium transition-colors duration-200">Select Plan</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Sub-component for displaying integration reviews.
 */
export const IntegrationReviewsSection: React.FC<{ integration: Integration, reviews: Review[]; onAddReview: (review: Omit<Review, 'id' | 'createdAt' | 'userId' | 'userName' | 'integrationId'>) => void }> = ({ integration, reviews, onAddReview }) => {
    const [newReviewRating, setNewReviewRating] = useState(0);
    const [newReviewTitle, setNewReviewTitle] = useState('');
    const [newReviewComment, setNewReviewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const { addToast } = useToast();
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [reviewSummary, setReviewSummary] = useState('');


    const handleGenerateReviewSummary = async () => {
        setIsGeneratingSummary(true);
        setReviewSummary('');
        try {
            if (!process.env.REACT_APP_GEMINI_API_KEY) {
                throw new Error("API_KEY is not defined in environment variables.");
            }
            const ai = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY as string);
            const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
            
            const reviewTexts = reviews.map(r => `Rating: ${r.rating}/5. Title: ${r.title}. Comment: ${r.comment}`).join('\n\n');
            const prompt = `Based on the following user reviews for the integration "${integration.name}", please provide a concise summary. The summary should include:
1.  A brief overall sentiment.
2.  A bulleted list of the top 3 common praises (pros).
3.  A bulleted list of the top 3 common criticisms (cons).

Here are the reviews:
${reviewTexts.slice(0, 8000)}
`;
            const result = await model.generateContent(prompt);
            setReviewSummary(result.response.text());
            addToast({ type: 'success', message: 'Review summary generated!' });
        } catch (err) {
            console.error("Error generating summary:", err);
            setReviewSummary(`Error: ${(err as Error).message}`);
            addToast({ type: 'error', message: 'Failed to generate review summary.' });
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!newReviewRating || !newReviewComment) {
            addToast({ type: 'error', message: 'Please provide a rating and comment.' });
            return;
        }
        setIsSubmittingReview(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            onAddReview({ rating: newReviewRating, title: newReviewTitle, comment: newReviewComment });
            setNewReviewRating(0); setNewReviewTitle(''); setNewReviewComment('');
            addToast({ type: 'success', message: 'Review submitted successfully!' });
        } catch (error) {
            addToast({ type: 'error', message: 'Failed to submit review.' });
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-white mb-4">Customer Reviews ({reviews.length})</h3>
             {reviews.length > 5 && (
                <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-bold text-white mb-2">AI-Powered Review Summary</h4>
                    {reviewSummary ? (
                        <div className="text-gray-300 text-sm whitespace-pre-line">{reviewSummary}</div>
                    ) : (
                        <button onClick={handleGenerateReviewSummary} disabled={isGeneratingSummary} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center">
                             {isGeneratingSummary && <Spinner size="sm" color="text-white" />}<span className={isGeneratingSummary ? 'ml-2' : ''}>Generate with AI</span>
                        </button>
                    )}
                </div>
            )}
            {reviews.length === 0 && <p className="text-gray-400 mb-6">Be the first to review this integration!</p>}
            <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
                {reviews.map(review => (
                    <div key={review.id} className="bg-gray-700 p-4 rounded-md border border-gray-600">
                        <div className="flex items-center mb-2">
                            <div className="flex items-center text-yellow-500 mr-3">{Array.from({ length: 5 }, (_, i) => (<svg key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div>
                            <p className="font-semibold text-white text-md">{review.title}</p>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                        <p className="text-gray-500 text-xs">By {review.userName} on {formatDate(review.createdAt)}</p>
                    </div>
                ))}
            </div>
            {/* Review submission form */}
        </div>
    );
};

/**
 * Sub-component for displaying integration setup guide.
 */
export const IntegrationSetupGuideSection: React.FC<{ markdown: string }> = ({ markdown }) => {
    return (
        <div>
            <h3 className="text-xl font-bold text-white mb-4">Setup Guide</h3>
            <div className="bg-gray-700 p-6 rounded-lg text-gray-300 whitespace-pre-line border border-gray-600">
                <pre className="text-sm font-mono bg-gray-800 p-4 rounded overflow-auto">{markdown}</pre>
            </div>
        </div>
    );
};

/**
 * Integration Detail Modal component.
 */
export const IntegrationDetailModal: React.FC<{
    integration: Integration;
    onClose: () => void;
    onInstall: (integrationId: string, planId?: string) => void;
    isInstalled: boolean;
}> = ({ integration, onClose, onInstall, isInstalled }) => {
    const [selectedTab, setSelectedTab] = useState<'overview' | 'features' | 'pricing' | 'reviews' | 'setup'>('overview');
    const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(undefined);
    const [isInstalling, setIsInstalling] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (integration.pricingPlans.length > 0) {
            setSelectedPlanId(integration.pricingPlans[0].id); // Select first plan by default
        }
    }, [integration]);

    const handleInstallClick = async () => {
        setIsInstalling(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            onInstall(integration.id, selectedPlanId);
            addToast({ type: 'success', message: `${integration.name} installed successfully!` });
            onClose();
        } catch (error) {
            addToast({ type: 'error', message: `Failed to install ${integration.name}.` });
        } finally { setIsInstalling(false); }
    };
    
    const handleAddReview = (newReviewData: Omit<Review, 'id' | 'createdAt' | 'userId' | 'userName' | 'integrationId'>) => {
        const newReview: Review = { ...newReviewData, id: generateUUID(), integrationId: integration.id, userId: MOCK_USER_ID, userName: 'You', createdAt: new Date().toISOString() };
        mockReviews.unshift(newReview);
        addToast({ type: 'success', message: 'Your review has been added!' });
    };

    const tabs = [{ id: 'overview', name: 'Overview' }, { id: 'features', name: 'Features' }, { id: 'pricing', name: 'Pricing' }, { id: 'reviews', name: 'Reviews' }, { id: 'setup', name: 'Setup Guide' }];

    return (
        <Modal isOpen={true} onClose={onClose} title={`Integration Details: ${integration.name}`} size="4xl">
            {/* Modal content */}
            {selectedTab === 'reviews' && <IntegrationReviewsSection integration={integration} reviews={mockReviews.filter(r => r.integrationId === integration.id)} onAddReview={handleAddReview} />}
            {selectedTab === 'setup' && <IntegrationSetupGuideSection markdown={integration.setupGuideMarkdown} />}
        </Modal>
    );
};

/**
 * Component for displaying and managing an installed integration.
 */
export const InstalledIntegrationCard: React.FC<{
    integrationInstance: IntegrationInstance;
    integration: Integration;
    onManage: (instance: IntegrationInstance) => void;
    onDisconnect: (instanceId: string) => void;
}> = ({ integrationInstance, integration, onManage, onDisconnect }) => {
    const statusColor = { active: 'text-green-400', degraded: 'text-yellow-400', error: 'text-red-400', disconnected: 'text-gray-400'}[integrationInstance.status];
    const statusBg = { active: 'bg-green-800', degraded: 'bg-yellow-800', error: 'bg-red-800', disconnected: 'bg-gray-800'}[integrationInstance.status];
    
    return (
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left border border-gray-700 shadow-lg">
            <img src={integration.logoUrl} alt={`${integration.name} Logo`} className="w-16 h-16 rounded-full mb-4 sm:mb-0 sm:mr-6 object-cover border-2 border-gray-600" />
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-white mb-1">{integration.name}</h3>
                <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm text-gray-300 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBg} ${statusColor} capitalize`}>{integrationInstance.status}</span>
                    <span>Installed: {formatDate(integrationInstance.installedAt)}</span>
                    {integrationInstance.lastSyncedAt && <span>Last Sync: {formatDate(integrationInstance.lastSyncedAt)}</span>}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
                <button onClick={() => onManage(integrationInstance)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">Manage</button>
                <button onClick={() => onDisconnect(integrationInstance.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">Disconnect</button>
            </div>
        </div>
    );
};

/**
 * Modal for configuring an installed integration.
 */
export const IntegrationConfigurationModal: React.FC<{
    instance: IntegrationInstance;
    integration: Integration;
    onSaveConfig: (instanceId: string, config: Record<string, any>) => void;
    isLoading?: boolean;
}> = ({ instance, integration, onSaveConfig, isLoading }) => {
    const [currentConfig, setCurrentConfig] = useState<Record<string, any>>(instance.configuration);
    const { addToast } = useToast();

    useEffect(() => {
        setCurrentConfig(instance.configuration);
    }, [instance.configuration]);

    const handleConfigChange = (key: string, value: any) => setCurrentConfig(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            onSaveConfig(instance.id, currentConfig);
            addToast({ type: 'success', message: `${integration.name} configuration updated.` });
        } catch (error) {
            addToast({ type: 'error', message: `Failed to update configuration for ${integration.name}.` });
        }
    };
    
    if (!integration.configSchema) return <p className="text-gray-400">This integration does not require any configuration.</p>;
    const schemaProperties = integration.configSchema.properties || {};

    return (
        <div className="space-y-4">
             {Object.entries(schemaProperties).map(([key, schema]: [string, any]) => (
                 <div key={key} className="mb-4">
                     <label htmlFor={key} className="block text-gray-300 text-sm font-bold mb-2">{schema.title || key}</label>
                     {schema.type === 'number' && (<input id={key} type="number" value={currentConfig[key] || ''} onChange={e => handleConfigChange(key, parseInt(e.target.value))} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 text-white" />)}
                     {schema.type === 'boolean' && (<input id={key} type="checkbox" checked={currentConfig[key] || false} onChange={e => handleConfigChange(key, e.target.checked)} className="h-5 w-5 text-cyan-600 rounded border-gray-600 focus:ring-cyan-500 bg-gray-700" />)}
                 </div>
             ))}
            <div className="flex justify-end mt-6 space-x-3">
                <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" disabled={isLoading}>
                    {isLoading && <Spinner size="sm" color="text-white" />}<span className={isLoading ? 'ml-2' : ''}>Save Configuration</span>
                </button>
            </div>
        </div>
    );
};

// ... more advanced components would go here ...

// endregion

// region: --- Developer Portal Components ---

/**
 * Component for managing API Keys.
 */
export const APIKeyManager: React.FC<{ developerId: string; initialKeys: APIKey[]; onUpdateKeys: (keys: APIKey[]) => void }> = ({ developerId, initialKeys, onUpdateKeys }) => {
    // Component implementation (abridged for brevity)
    return <Card title="Manage API Keys"><p className="text-gray-400">API keys management UI.</p></Card>;
};

/**
 * Component for managing Webhook Subscriptions.
 */
export const WebhookSubscriptionManager: React.FC<{ developerId: string; initialSubscriptions: WebhookSubscription[]; onUpdateSubscriptions: (subs: WebhookSubscription[]) => void }> = ({ developerId, initialSubscriptions, onUpdateSubscriptions }) => {
    // Component implementation (abridged for brevity)
    return <Card title="Manage Webhook Subscriptions"><p className="text-gray-400">Webhook management UI.</p></Card>;
};

/**
 * AI Code Snippets Library component.
 */
export const AICodeSnippetsLibrary: React.FC<{ snippets: AICodeSnippet[] }> = ({ snippets }) => {
    // Component implementation (abridged for brevity)
    return <Card title="AI-Powered Code Snippets Library"><p className="text-gray-400">Code snippets UI.</p></Card>;
};

// endregion

// region: --- Main View & State Management ---

/**
 * The main Integrations Marketplace View component.
 */
const IntegrationsMarketplaceView: React.FC = () => {
    // Marketplace state
    const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
    const [filteredIntegrations, setFilteredIntegrations] = useState<Integration[]>([]);
    const [installedIntegrations, setInstalledIntegrations] = useState<IntegrationInstance[]>(mockIntegrationInstances);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | 'All'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const integrationsPerPage = 9;
    
    const [selectedIntegrationForDetails, setSelectedIntegrationForDetails] = useState<Integration | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    // ... other state variables ...

    const debouncedSetSearchTerm = useDebounce(setSearchTerm, 300);

    useEffect(() => {
        let currentIntegrations = integrations.filter(i => i.status === 'active');
        if (selectedCategory !== 'All') {
            currentIntegrations = currentIntegrations.filter(integration => integration.category === selectedCategory);
        }
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            currentIntegrations = currentIntegrations.filter(integration =>
                integration.name.toLowerCase().includes(lowercasedTerm) ||
                integration.shortDescription.toLowerCase().includes(lowercasedTerm) ||
                integration.developerName.toLowerCase().includes(lowercasedTerm) ||
                integration.category.toLowerCase().includes(lowercasedTerm)
            );
        }
        setFilteredIntegrations(currentIntegrations);
        setCurrentPage(1);
    }, [integrations, searchTerm, selectedCategory]);

    const totalPages = Math.ceil(filteredIntegrations.length / integrationsPerPage);
    const indexOfLastIntegration = currentPage * integrationsPerPage;
    const indexOfFirstIntegration = indexOfLastIntegration - integrationsPerPage;
    const currentIntegrations = filteredIntegrations.slice(indexOfFirstIntegration, indexOfLastIntegration);
    const availableCategories = Array.from(new Set(integrations.map(i => i.category))).sort();
    const isIntegrationInstalled = useCallback((integrationId: string) => installedIntegrations.some(instance => instance.integrationId === integrationId), [installedIntegrations]);
    
    const handleViewIntegrationDetails = (integration: Integration) => {
        setSelectedIntegrationForDetails(integration);
        setIsDetailModalOpen(true);
    };

    const handleInstallIntegration = async (integrationId: string, planId?: string) => {
        // Installation logic (abridged for brevity)
    };

    // ... other handlers ...

    return (
        <ToastContainer>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Integrations Marketplace</h2>
                    {/* Buttons */}
                </div>

                {installedIntegrations.length > 0 && (
                    <Card title="My Installed Integrations">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {installedIntegrations.map(instance => {
                                const integration = integrations.find(i => i.id === instance.integrationId);
                                if (!integration) return null;
                                return ( <InstalledIntegrationCard key={instance.id} integrationInstance={instance} integration={integration} onManage={()=>{}} onDisconnect={()=>{}} /> );
                            })}
                        </div>
                    </Card>
                )}

                <Card title="Browse All Integrations">
                    <IntegrationsFilterAndSearch
                        searchQuery={searchTerm}
                        onSearchChange={debouncedSetSearchTerm}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        categories={availableCategories as IntegrationCategory[]}
                    />
                    {filteredIntegrations.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">No integrations found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentIntegrations.map(integration => (
                                <IntegrationCard key={integration.id} integration={integration} onDetailView={handleViewIntegrationDetails} isInstalled={isIntegrationInstalled(integration.id)} />
                            ))}
                        </div>
                    )}
                    <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </Card>

                {isDetailModalOpen && selectedIntegrationForDetails && (
                    <IntegrationDetailModal
                        integration={selectedIntegrationForDetails}
                        onClose={() => setIsDetailModalOpen(false)}
                        onInstall={handleInstallIntegration}
                        isInstalled={isIntegrationInstalled(selectedIntegrationForDetails.id)}
                    />
                )}
                
                {/* Other Modals and Developer Portal section */}

            </div>
        </ToastContainer>
    );
};

export default IntegrationsMarketplaceView;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/ecosystem/IntegrationsMarketplaceView.tsx
================================================================================

// components/views/megadashboard/ecosystem/IntegrationsMarketplaceView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

const IntegrationsMarketplaceView: React.FC = () => {
    const [isIdeaModalOpen, setIdeaModalOpen] = useState(false);
    const [prompt, setPrompt] = useState("an integration that syncs customer data with our CRM");
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setIdea('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `Brainstorm a brief, high-level implementation plan for the following integration idea: "${prompt}". Suggest the key API endpoints that would be needed from Demo Bank.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            setIdea(response.text);
        } catch (err) {
            setIdea("Error generating idea.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Integrations Marketplace</h2>
                    <button onClick={() => setIdeaModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Integration Ideator</button>
                </div>
                <Card title="Featured Integrations">
                     <p className="text-gray-400">This section would showcase popular integrations like Slack, Salesforce, etc.</p>
                </Card>
            </div>
            {isIdeaModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setIdeaModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Integration Ideator</h3></div>
                        <div className="p-6 space-y-4">
                             <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your integration idea..." className="w-full h-24 bg-gray-700/50 p-2 rounded text-white" />
                             <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Plan'}</button>
                            <Card title="Generated Plan"><div className="min-h-[10rem] text-sm text-gray-300 whitespace-pre-line">{isLoading ? '...' : idea}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default IntegrationsMarketplaceView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/ecosystem/IntegrationsMarketplaceView.tsx
================================================================================

// components/views/megadashboard/ecosystem/IntegrationsMarketplaceView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

const IntegrationsMarketplaceView: React.FC = () => {
    const [isIdeaModalOpen, setIdeaModalOpen] = useState(false);
    const [prompt, setPrompt] = useState("an integration that syncs customer data with our CRM");
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setIdea('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `Brainstorm a brief, high-level implementation plan for the following integration idea: "${prompt}". Suggest the key API endpoints that would be needed from Demo Bank.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            setIdea(response.text);
        } catch (err) {
            setIdea("Error generating idea.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Integrations Marketplace</h2>
                    <button onClick={() => setIdeaModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Integration Ideator</button>
                </div>
                <Card title="Featured Integrations">
                     <p className="text-gray-400">This section would showcase popular integrations like Slack, Salesforce, etc.</p>
                </Card>
            </div>
            {isIdeaModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setIdeaModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Integration Ideator</h3></div>
                        <div className="p-6 space-y-4">
                             <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your integration idea..." className="w-full h-24 bg-gray-700/50 p-2 rounded text-white" />
                             <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Plan'}</button>
                            <Card title="Generated Plan"><div className="min-h-[10rem] text-sm text-gray-300 whitespace-pre-line">{isLoading ? '...' : idea}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default IntegrationsMarketplaceView;
