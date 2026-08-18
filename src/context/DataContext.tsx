// REPOSITORY SOURCE: diplomat-bit/jamesburvelocallaghaniiiand | PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/src/context/DataContext.tsx
================================================================================

import React, { createContext, useState, ReactNode } from 'react';
import { addMonths, addDays } from 'date-fns';

// Define the unified brand namespace
const BRAND_NAMESPACE = "Citibankdemobusinessinc";

// --- Type Definitions ---
export interface License {
    id: string;
    name: string;
    jurisdiction: string;
    status: 'Active' | 'Expired' | 'Pending Renewal' | 'Revoked' | 'Suspended';
    expiryDate: string; // ISO string
    issueDate: string; // ISO string
    regulatoryBody: string;
    licenseNumber: string;
    scope: string; // e.g., "Money Transmitter", "Payment Institution"
    renewalFrequencyMonths: number;
    documents: LicenseDocument[];
    auditTrail: LicenseAuditEntry[];
    associatedPolicies: string[]; // IDs of compliance policies
    notes: string;
    contactPerson: string;
    contactEmail: string;
    renewalCostUSD: number;
    lastRenewalDate: string; // ISO string
    nextRenewalReminderDate: string; // ISO string
    jurisdictionId: string; // To link to a predefined list of jurisdictions
}

export interface LicenseDocument {
    id: string;
    name: string;
    url: string; // Or base64 for simulation
    type: 'Application' | 'Certificate' | 'Renewal' | 'Amendment' | 'Correspondence' | 'Other';
    uploadedBy: string;
    uploadDate: string; // ISO string
    version: string;
}

export interface LicenseAuditEntry {
    id: string;
    timestamp: string; // ISO string
    action: string; // e.g., "Created", "Updated", "Document Uploaded", "Status Changed"
    changerId: string;
    details: string;
}

export interface CompliancePolicy {
    id: string;
    name: string;
    description: string;
    category: 'AML' | 'KYC' | 'Sanctions' | 'Consumer Protection' | 'Data Privacy' | 'Operational Risk' | 'Other';
    version: string;
    effectiveDate: string; // ISO string
    reviewDate: string; // ISO string
    documents: PolicyDocument[];
    applicableJurisdictions: string[]; // List of jurisdiction IDs
    responsibleDepartment: string;
    status: 'Active' | 'Draft' | 'Under Review' | 'Retired';
    lastUpdatedBy: string;
    lastUpdateDate: string; // ISO string
    relatedLicenses: string[]; // IDs of licenses this policy affects
}

export interface PolicyDocument {
    id: string;
    name: string;
    url: string;
    type: 'Policy Text' | 'Guidance' | 'Training Material' | 'Change Log';
    uploadedBy: string;
    uploadDate: string; // ISO string
}

export interface RegulatoryUpdate {
    id: string;
    title: string;
    source: string; // e.g., "FinCEN", "FCA", "EU Parliament"
    publicationDate: string; // ISO string
    summary: string;
    fullTextUrl: string;
    severity: 'High' | 'Medium' | 'Low';
    status: 'New' | 'Under Review' | 'Impact Assessed' | 'Implemented';
    relevantJurisdictions: string[]; // List of jurisdiction IDs
    assignedTo: string; // User ID or Department
    impactAssessmentNotes: string;
    actionItems: ActionItem[];
    lastUpdated: string; // ISO string
}

export interface ActionItem {
    id: string;
    description: string;
    assignedTo: string;
    dueDate: string; // ISO string
    status: 'Open' | 'In Progress' | 'Completed' | 'Blocked';
    completionDate?: string; // ISO string
}

export interface ComplianceCheckResult {
    id: string;
    featureDescription: string;
    checkDate: string; // ISO string
    aiReport: string;
    suggestedLicenses: string[];
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Completed' | 'Pending Review';
    reviewedBy?: string;
    reviewDate?: string; // ISO string
    notes?: string;
    associatedFeatureId?: string; // If linked to a product feature in another system
}

export interface RiskAssessment {
    id: string;
    assessmentDate: string; // ISO string
    assessedBy: string;
    scope: string; // e.g., "New Feature: Cross-border payments"
    identifiedRisks: RiskItem[];
    overallRiskRating: 'Low' | 'Medium' | 'High' | 'Critical';
    mitigationPlan: string;
    status: 'Completed' | 'Pending' | 'Rejected';
    reviewDate: string;
}

export interface RiskItem {
    id: string;
    description: string;
    likelihood: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    inherentRisk: 'Low' | 'Medium' | 'High' | 'Critical';
    mitigationControls: string[];
    residualRisk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Jurisdiction {
    id: string;
    name: string;
    countryCode: string;
    currency: string;
    isEEA: boolean;
    primaryRegulator: string;
}

// --- Internal Generative Data Functions ---
let nextId = 1000;
const generateId = () => `_${nextId++}_${Date.now()}`;

export const CoreJurisdictions: Jurisdiction[] = [
    { id: 'JUR001', name: 'California', countryCode: 'US', currency: 'USD', isEEA: false, primaryRegulator: 'DFPI' },
    { id: 'JUR002', name: 'New York', countryCode: 'US', currency: 'USD', isEEA: false, primaryRegulator: 'DFS' },
    { id: 'JUR003', name: 'United Kingdom', countryCode: 'GB', currency: 'GBP', isEEA: true, primaryRegulator: 'FCA' },
    { id: 'JUR004', name: 'Ireland', countryCode: 'IE', currency: 'EUR', isEEA: true, primaryRegulator: 'CBI' },
    { id: 'JUR005', name: 'Brazil', countryCode: 'BR', currency: 'BRL', isEEA: false, primaryRegulator: 'BACEN' },
    { id: 'JUR006', name: 'Australia', countryCode: 'AU', currency: 'AUD', isEEA: false, primaryRegulator: 'ASIC' },
    { id: 'JUR007', name: 'Singapore', countryCode: 'SG', currency: 'SGD', isEEA: false, primaryRegulator: 'MAS' },
];

const generateLicenseData = (overrides?: Partial<License>): License => {
    const id = generateId();
    const issue = addMonths(new Date(), -Math.floor(Math.random() * 24));
    const expiry = addMonths(issue, Math.floor(Math.random() * 36) + 12); // 1 to 4 years
    const statusOptions: License['status'][] = ['Active', 'Pending Renewal', 'Expired', 'Revoked'];
    const selectedStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const jurisdiction = CoreJurisdictions[Math.floor(Math.random() * CoreJurisdictions.length)];

    return {
        id: `LIC-${id}`,
        name: `${BRAND_NAMESPACE} Money Transmitter License ${jurisdiction.name}`,
        jurisdiction: jurisdiction.name,
        status: selectedStatus,
        expiryDate: expiry.toISOString(),
        issueDate: issue.toISOString(),
        regulatoryBody: jurisdiction.primaryRegulator,
        licenseNumber: `L${Math.floor(100000 + Math.random() * 900000)}`,
        scope: "General Money Transmission & Electronic Payments",
        renewalFrequencyMonths: 12 + Math.floor(Math.random() * 24),
        documents: [],
        auditTrail: [],
        associatedPolicies: [],
        notes: "Standard license for payment operations.",
        contactPerson: "John Doe",
        contactEmail: "john.doe@example.com",
        renewalCostUSD: 5000 + Math.floor(Math.random() * 15000),
        lastRenewalDate: addMonths(issue, Math.floor(Math.random() * 12)).toISOString(),
        nextRenewalReminderDate: addMonths(expiry, -3).toISOString(),
        jurisdictionId: jurisdiction.id,
        ...overrides,
    };
};

const generatePolicyData = (overrides?: Partial<CompliancePolicy>): CompliancePolicy => {
    const id = generateId();
    const categoryOptions: CompliancePolicy['category'][] = ['AML', 'KYC', 'Sanctions', 'Consumer Protection', 'Data Privacy', 'Operational Risk'];
    const effective = addMonths(new Date(), -Math.floor(Math.random() * 18));
    const review = addMonths(effective, 12 + Math.floor(Math.random() * 24));
    const jurisdictionIds = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => CoreJurisdictions[Math.floor(Math.random() * CoreJurisdictions.length)].id);

    return {
        id: `POL-${id}`,
        name: `${BRAND_NAMESPACE} Policy: Anti-Money Laundering v${Math.floor(Math.random() * 3) + 1}.0`,
        description: "Comprehensive policy outlining procedures to prevent money laundering activities.",
        category: categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
        version: `${Math.floor(Math.random() * 3) + 1}.0`,
        effectiveDate: effective.toISOString(),
        reviewDate: review.toISOString(),
        documents: [],
        applicableJurisdictions: jurisdictionIds,
        responsibleDepartment: "Compliance",
        status: "Active",
        lastUpdatedBy: "Admin User",
        lastUpdateDate: new Date().toISOString(),
        relatedLicenses: [],
        ...overrides,
    };
};

const generateRegulatoryUpdateData = (overrides?: Partial<RegulatoryUpdate>): RegulatoryUpdate => {
    const id = generateId();
    const severityOptions: RegulatoryUpdate['severity'][] = ['High', 'Medium', 'Low'];
    const statusOptions: RegulatoryUpdate['status'][] = ['New', 'Under Review', 'Impact Assessed', 'Implemented'];
    const publication = addDays(new Date(), -Math.floor(Math.random() * 90));
    const jurisdictionIds = Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => CoreJurisdictions[Math.floor(Math.random() * CoreJurisdictions.length)].id);

    return {
        id: `REG-${id}`,
        title: `Reg Update: New AML Directive for ${jurisdictionIds.map(jid => CoreJurisdictions.find(j => j.id === jid)?.name).join(', ')}`,
        source: "EU Parliament",
        publicationDate: publication.toISOString(),
        summary: "New directive introduces stricter requirements for customer due diligence and suspicious transaction reporting.",
        fullTextUrl: "https://example.com/new-directive-full-text",
        severity: severityOptions[Math.floor(Math.random() * severityOptions.length)],
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        relevantJurisdictions: jurisdictionIds,
        assignedTo: "Compliance Team",
        impactAssessmentNotes: "",
        actionItems: [],
        lastUpdated: new Date().toISOString(),
        ...overrides,
    };
};

// --- Context Definition ---
export interface DataContextType {
    licenses: License[];
    setLicenses: React.Dispatch<React.SetStateAction<License[]>>;
    policies: CompliancePolicy[];
    setPolicies: React.Dispatch<React.SetStateAction<CompliancePolicy[]>>;
    regulatoryUpdates: RegulatoryUpdate[];
    setRegulatoryUpdates: React.Dispatch<React.SetStateAction<RegulatoryUpdate[]>>;
    complianceChecks: ComplianceCheckResult[];
    setComplianceChecks: React.Dispatch<React.SetStateAction<ComplianceCheckResult[]>>;
    riskAssessments: RiskAssessment[];
    setRiskAssessments: React.Dispatch<React.SetStateAction<RiskAssessment[]>>;
    jurisdictions: Jurisdiction[];
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

// --- Provider Component ---
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize using internal generative functions
    const [licenses, setLicenses] = useState<License[]>(() => 
        Array.from({ length: 50 }, (_, i) => generateLicenseData({
            name: `License ${i + 1} - ${CoreJurisdictions[i % CoreJurisdictions.length].name}`,
            status: i % 5 === 0 ? 'Expired' : (i % 7 === 0 ? 'Pending Renewal' : 'Active'),
        }))
    );

    const [policies, setPolicies] = useState<CompliancePolicy[]>(() => 
        Array.from({ length: 30 }, (_, i) => generatePolicyData({
            name: `Policy ${i + 1} - ${['AML', 'KYC', 'Data Privacy'][i % 3]}`,
            status: i % 10 === 0 ? 'Draft' : 'Active',
        }))
    );

    const [regulatoryUpdates, setRegulatoryUpdates] = useState<RegulatoryUpdate[]>(() => 
        Array.from({ length: 40 }, (_, i) => generateRegulatoryUpdateData({
            title: `Reg Update ${i + 1}: ${['New Reporting', 'Customer Due Diligence', 'Sanctions Update'][i % 3]}`,
            severity: ['High', 'Medium', 'Low'][i % 3],
        }))
    );

    const [complianceChecks, setComplianceChecks] = useState<ComplianceCheckResult[]>([]);
    const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
    
    // Jurisdictions are static in this setup, sourced from CoreJurisdictions
    const jurisdictions = CoreJurisdictions;

    const value: DataContextType = {
        licenses,
        setLicenses,
        policies,
        setPolicies,
        regulatoryUpdates,
        setRegulatoryUpdates,
        complianceChecks,
        setComplianceChecks,
        riskAssessments,
        setRiskAssessments,
        jurisdictions
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/my-appaibanking | ORIGINAL PATH: diplomat-bit-my-appaibanking-43962ef/src/context/DataContext.tsx
================================================================================


import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { 
    Transaction, Asset, BudgetCategory, GamificationState, View, Notification, 
    PaymentOrder, Invoice, ComplianceCase, CorporateTransaction, DatabaseConfig, WebDriverStatus,
    FinancialGoal, AIGoalPlan, RecurringContribution, LinkedGoal, Contribution,
    CreditScore, UpcomingBill, SavingsGoal, MarketMover, APIStatus, Subscription,
    DataSharingPolicy, APIKey, TrustedContact, SecurityAwarenessModule, ThreatAlert, AuditLogEntry, SecurityScoreMetric,
    MarqetaCardProduct, TransactionRule
} from '../types';

interface DataContextType {
    // --- App State ---
    isLoading: boolean;
    error: string | null;

    // --- Navigation & UI ---
    activeView: View;
    setActiveView: (view: View) => void;
    
    // --- Financial Data ---
    transactions: Transaction[];
    assets: Asset[];
    budgets: BudgetCategory[];
    creditScore: any;
    upcomingBills: any[];
    savingsGoals: any[];
    financialGoals: FinancialGoal[];
    marketMovers: any[];
    linkedAccounts: any[];
    notifications: Notification[];
    subscriptions: Subscription[]; // Added
    
    // --- Corporate & Treasury ---
    paymentOrders: PaymentOrder[];
    invoices: Invoice[];
    complianceCases: ComplianceCase[];
    corporateTransactions: CorporateTransaction[];
    
    // --- Crypto & Web3 ---
    cryptoAssets: any[]; // Added placeholder type
    walletInfo: any; // Added placeholder
    virtualCard: any; // Added placeholder
    nftAssets: any[]; // Added placeholder
    connectWallet: (provider: any) => void; // Added
    disconnectWallet: () => void; // Added
    detectedProviders: any[]; // Added
    issueCard: () => void; // Added
    buyCrypto: (amount: number, currency: string) => void; // Added

    // --- Integrations & Config ---
    plaidApiKey: string | null;
    plaidClientId: string | null;
    stripeApiKey: string | null;
    geminiApiKey: string | null;
    marqetaApiToken: string | null;
    marqetaApiSecret: string | null;
    modernTreasuryApiKey: string | null;
    modernTreasuryOrganizationId: string | null;
    
    // --- Marqeta ---
    marqetaCardProducts: MarqetaCardProduct[]; // Added
    fetchMarqetaProducts: () => void; // Added
    isMarqetaLoading: boolean; // Added

    // --- Database & Infrastructure ---
    dbConfig: DatabaseConfig;
    updateDbConfig: (config: Partial<DatabaseConfig>) => void;
    connectDatabase: () => Promise<void>;
    
    // --- Web Driver / Automation ---
    webDriverStatus: WebDriverStatus;
    launchWebDriver: (taskName: string) => Promise<void>;

    // --- Security & Compliance ---
    showSystemAlert: (message: string, type: string) => void; // Added
    unlinkAccount: (id: string) => void; // Added
    securityMetrics: SecurityScoreMetric[]; // Added
    auditLogs: AuditLogEntry[]; // Added
    threatAlerts: ThreatAlert[]; // Added
    dataSharingPolicies: DataSharingPolicy[]; // Added
    apiKeys: APIKey[]; // Added
    trustedContacts: TrustedContact[]; // Added
    securityAwarenessModules: SecurityAwarenessModule[]; // Added
    transactionRules: TransactionRule[]; // Added

    // --- Actions ---
    addTransaction: (transaction: Transaction) => void;
    updateBudget: (id: string, spent: number) => void;
    addBudget: (name: string, limit: number) => void;
    markNotificationRead: (id: string) => void;
    setGeminiApiKey: (key: string) => void;
    setModernTreasuryApiKey: (key: string) => void;
    setModernTreasuryOrganizationId: (id: string) => void;
    setMarqetaCredentials: (token: string, secret: string) => void;
    addFinancialGoal: (goalData: Omit<FinancialGoal, 'id' | 'currentAmount' | 'plan' | 'contributions' | 'recurringContributions' | 'linkedGoals' | 'status'>) => void;
    generateGoalPlan: (goalId: string) => Promise<void>;
    addContributionToGoal: (goalId: string, amount: number) => void;
    addRecurringContributionToGoal: (goalId: string, contribution: Omit<RecurringContribution, 'id'>) => void;
    updateRecurringContributionInGoal: (goalId: string, contributionId: string, updates: Partial<RecurringContribution>) => void;
    deleteRecurringContributionFromGoal: (goalId: string, contributionId: string) => void;
    updateFinancialGoal: (goalId: string, updates: Partial<FinancialGoal>) => void;
    linkGoals: (sourceGoalId: string, targetGoalId: string, relationshipType: LinkedGoal['relationshipType'], triggerAmount?: number) => void;
    unlinkGoals: (sourceGoalId: string, targetGoalId: string) => void;
    
    // --- Other ---
    impactData: { treesPlanted: number; progressToNextTree: number };
    gamification: GamificationState;
    rewardPoints: { balance: number; lastEarned: number; lastRedeemed: number; currency: string };
    creditFactors: any[];
    apiStatus: any[];
    
    // --- Legacy / Helpers ---
    handlePlaidSuccess: (publicToken: string, metadata: any) => void;
    isImportingData: boolean;
    userProfile: any;
    askSovereignAI: (prompt: string) => Promise<string>;
    broadcastEvent: (eventType: string, payload: any) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- App State ---
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Navigation ---
    const [activeView, setActiveView] = useState<View>(View.Dashboard);

    // --- Financial Data State ---
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
    const [creditScore, setCreditScore] = useState<CreditScore>({ score: 0, change: 0, rating: '---' });
    const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>([]);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
    const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
    const [marketMovers, setMarketMovers] = useState<MarketMover[]>([]);
    const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]); // Added
    
    // --- Corporate State ---
    const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [complianceCases, setComplianceCases] = useState<ComplianceCase[]>([]);
    const [corporateTransactions, setCorporateTransactions] = useState<CorporateTransaction[]>([]);
    
    // --- API Status ---
    const [apiStatus, setApiStatus] = useState<APIStatus[]>([]);
    
    // --- API Keys & Config ---
    const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(process.env.GEMINI_API_KEY || null);
    const [stripeApiKey, setStripeApiKey] = useState<string | null>(process.env.STRIPE_SECRET_KEY || null);
    const [plaidClientId] = useState<string | null>(process.env.PLAID_CLIENT_ID || null);
    const [plaidApiKey] = useState<string | null>(process.env.PLAID_SECRET || null);
    const [marqetaApiToken, setMarqetaApiToken] = useState<string | null>(null);
    const [marqetaApiSecret, setMarqetaApiSecret] = useState<string | null>(null);
    const [modernTreasuryApiKey, setModernTreasuryApiKey] = useState<string | null>(null);
    const [modernTreasuryOrgId, setModernTreasuryOrgId] = useState<string | null>(null);

    // --- Crypto State ---
    const [cryptoAssets, setCryptoAssets] = useState<any[]>([]);
    const [walletInfo, setWalletInfo] = useState<any>(null);
    const [virtualCard, setVirtualCard] = useState<any>(null);
    const [nftAssets, setNftAssets] = useState<any[]>([]);
    const [detectedProviders, setDetectedProviders] = useState<any[]>([]);

    // --- Security State ---
    const [securityMetrics, setSecurityMetrics] = useState<SecurityScoreMetric[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [threatAlerts, setThreatAlerts] = useState<ThreatAlert[]>([]);
    const [dataSharingPolicies, setDataSharingPolicies] = useState<DataSharingPolicy[]>([]);
    const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
    const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
    const [securityAwarenessModules, setSecurityAwarenessModules] = useState<SecurityAwarenessModule[]>([]);
    const [transactionRules, setTransactionRules] = useState<TransactionRule[]>([]);

    // --- Marqeta State ---
    const [marqetaCardProducts, setMarqetaCardProducts] = useState<MarqetaCardProduct[]>([]);
    const [isMarqetaLoading, setIsMarqetaLoading] = useState(false);

    // --- Database Configuration ---
    const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        databaseName: process.env.DB_NAME || 'sovereign_bank',
        sslMode: 'require',
        connectionStatus: 'disconnected'
    });

    // --- Web Driver Status ---
    const [webDriverStatus, setWebDriverStatus] = useState<WebDriverStatus>({
        status: 'idle',
        activeTask: null,
        logs: []
    });
    
    const [isImportingData, setIsImportingData] = useState(false);

    // --- AI-Powered Mock Data Generation ---
    useEffect(() => {
        const generateInitialData = async () => {
            if (!geminiApiKey) {
                setError("Gemini API key is not configured. Cannot generate mock data for the dashboard.");
                setIsLoading(false);
                return;
            }

            try {
                const ai = new GoogleGenAI({ apiKey: geminiApiKey });
                
                const mockDataSchema = {
                    type: Type.OBJECT,
                    properties: {
                        transactions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING }, type: { type: Type.STRING }, category: { type: Type.STRING },
                                    description: { type: Type.STRING }, amount: { type: Type.NUMBER }, date: { type: Type.STRING },
                                    carbonFootprint: { type: Type.NUMBER },
                                }
                            }
                        },
                        assets: {
                            type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER }, color: { type: Type.STRING }, performanceYTD: { type: Type.NUMBER } } }
                        },
                        budgets: {
                            type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, limit: { type: Type.NUMBER }, spent: { type: Type.NUMBER }, color: { type: Type.STRING } } }
                        },
                        creditScore: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, change: { type: Type.INTEGER }, rating: { type: Type.STRING } } },
                        upcomingBills: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, amount: { type: Type.NUMBER }, dueDate: { type: Type.STRING } } } },
                        savingsGoals: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, target: { type: Type.NUMBER }, saved: { type: Type.NUMBER }, iconName: { type: Type.STRING } } } },
                        marketMovers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { ticker: { type: Type.STRING }, name: { type: Type.STRING }, price: { type: Type.NUMBER }, change: { type: Type.NUMBER } } } },
                        financialGoals: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING }, name: { type: Type.STRING }, targetAmount: { type: Type.NUMBER }, targetDate: { type: Type.STRING },
                                    currentAmount: { type: Type.NUMBER }, iconName: { type: Type.STRING }, startDate: { type: Type.STRING }, status: { type: Type.STRING }
                                }
                            }
                        },
                        notifications: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, message: { type: Type.STRING }, timestamp: { type: Type.STRING }, read: { type: Type.BOOLEAN }, view: { type: Type.STRING } } } },
                        apiStatus: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { provider: { type: Type.STRING }, status: { type: Type.STRING }, responseTime: { type: Type.NUMBER } } } },
                        paymentOrders: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, counterpartyName: { type: Type.STRING }, amount: { type: Type.NUMBER }, currency: { type: Type.STRING }, direction: { type: Type.STRING }, status: { type: Type.STRING }, date: { type: Type.STRING }, type: { type: Type.STRING } } } },
                        invoices: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, invoiceNumber: { type: Type.STRING }, counterpartyName: { type: Type.STRING }, dueDate: { type: Type.STRING }, amount: { type: Type.NUMBER }, status: { type: Type.STRING } } } },
                        complianceCases: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, reason: { type: Type.STRING }, entityType: { type: Type.STRING }, entityId: { type: Type.STRING }, status: { type: Type.STRING }, openedDate: { type: Type.STRING } } } },
                        corporateTransactions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, cardId: { type: Type.STRING }, holderName: { type: Type.STRING }, merchant: { type: Type.STRING }, amount: { type: Type.NUMBER }, status: { type: Type.STRING }, timestamp: { type: Type.STRING }, date: { type: Type.STRING } } } },
                        subscriptions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, amount: { type: Type.NUMBER }, nextPayment: { type: Type.STRING }, iconName: { type: Type.STRING } } } }, // Added
                    }
                };

                const prompt = `Generate a cohesive and realistic set of mock financial data for a visionary fintech user named "James B. O'Callaghan III". The data should populate a next-generation banking dashboard. It should reflect the activities of a high-net-worth, tech-savvy individual involved in personal finance, investments, and corporate treasury operations. The data must be internally consistent (e.g., transaction amounts relate to budget spending) and adhere strictly to the provided JSON schema. Generate a rich and interesting dataset including about 15 transactions over the last few months, 4 asset classes, 4 budget categories, a few financial goals, some corporate transactions, and other relevant data points to create a compelling demo.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: mockDataSchema
                    }
                });

                const data = JSON.parse(response.text);

                // Set all states from the AI response
                setTransactions(data.transactions || []);
                setAssets(data.assets || []);
                setBudgets(data.budgets || []);
                setCreditScore(data.creditScore || { score: 780, change: 5, rating: 'Excellent' });
                setUpcomingBills(data.upcomingBills || []);
                setSavingsGoals(data.savingsGoals || []);
                setFinancialGoals((data.financialGoals || []).map((g: any) => ({...g, plan: null, contributions: [], recurringContributions: [], linkedGoals: []})));
                setMarketMovers(data.marketMovers || []);
                setNotifications(data.notifications || []);
                setPaymentOrders(data.paymentOrders || []);
                setInvoices(data.invoices || []);
                setComplianceCases(data.complianceCases || []);
                setCorporateTransactions(data.corporateTransactions || []);
                setApiStatus(data.apiStatus || []);
                setSubscriptions(data.subscriptions || []); // Added

                // Initialize mock security data
                setSecurityMetrics([{ metricName: 'OverallSecurityScore', currentValue: '0.85' }]);
                setAuditLogs([{ id: 'log-1', timestamp: new Date().toISOString(), userId: 'user-1', action: 'LOGIN', targetResource: 'System', success: true }]);
                setThreatAlerts([]);
                setDataSharingPolicies([{ policyId: 'pol-1', policyName: 'Default Privacy', scope: 'Global', isActive: true, lastReviewed: new Date().toISOString() }]);
                setApiKeys([{ id: 'key-1', keyName: 'Default Key', creationDate: new Date().toISOString(), scopes: ['read'] }]);
                setTrustedContacts([]);
                setSecurityAwarenessModules([]);
                setTransactionRules([]);

                // Initialize mock crypto data
                setCryptoAssets([{ ticker: 'BTC', name: 'Bitcoin', value: 45000, amount: 1.5, color: '#F7931A' }]);
                setNftAssets([]);
                setWalletInfo({ balance: 1.5, address: '0x123...abc' });


            } catch (e) {
                console.error("Failed to generate initial mock data:", e);
                setError("Failed to generate initial app data from AI. The simulation cannot proceed. Please check your Gemini API key.");
            } finally {
                setIsLoading(false);
            }
        };

        generateInitialData();
    }, [geminiApiKey]);


    // --- Database Logic ---
    const updateDbConfig = useCallback((config: Partial<DatabaseConfig>) => {
        setDbConfig(prev => ({ ...prev, ...config }));
    }, []);

    const connectDatabase = useCallback(async () => {
        setDbConfig(prev => ({ ...prev, connectionStatus: 'connecting' }));
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const isSuccess = Math.random() > 0.1; 
            if (isSuccess) {
                setDbConfig(prev => ({ ...prev, connectionStatus: 'connected' }));
            } else {
                throw new Error("Connection timeout");
            }
        } catch (e) {
            setDbConfig(prev => ({ ...prev, connectionStatus: 'error' }));
        }
    }, []);

    // --- Web Driver Logic ---
    const launchWebDriver = useCallback(async (taskName: string) => {
        setWebDriverStatus({ status: 'running', activeTask: taskName, logs: [`Initializing WebDriver for task: ${taskName}...`] });
        const steps = ["Launching browser...", "Navigating...", "Injecting tokens...", "Scraping data...", "Standardizing format...", "Closing session."];
        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 1200));
            setWebDriverStatus(prev => ({ ...prev, logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${step}`] }));
        }
        setWebDriverStatus(prev => ({ ...prev, status: 'completed', logs: [...prev.logs, "Task completed successfully."] }));
        setTimeout(() => setWebDriverStatus(prev => ({ ...prev, status: 'idle', activeTask: null })), 5000);
    }, []);

    // --- Actions ---
    const addTransaction = (transaction: Transaction) => setTransactions(prev => [transaction, ...prev]);
    const updateBudget = (id: string, spent: number) => setBudgets(prev => prev.map(b => b.id === id ? { ...b, spent } : b));
    const addBudget = (name: string, limit: number) => setBudgets(prev => [...prev, { id: uuidv4(), name, limit, spent: 0, color: '#3b82f6' }]);
    const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const handlePlaidSuccess = (publicToken: string, metadata: any) => {
        setIsImportingData(true);
        setTimeout(() => {
            setLinkedAccounts(prev => [...prev, { id: metadata.institution.institution_id, name: metadata.institution.name, mask: '****', type: 'linked' }]);
            setIsImportingData(false);
            setTransactions(prev => [...prev, { id: `new-${Date.now()}`, type: 'expense', category: 'Transfer', description: `Import from ${metadata.institution.name}`, amount: 0, date: new Date().toISOString().split('T')[0] }]);
        }, 3000);
    };

    const setGeminiApiKey = (key: string) => setGeminiApiKeyState(key);
    const setMarqetaCredentials = (token: string, secret: string) => { setMarqetaApiToken(token); setMarqetaApiSecret(secret); };

    const askSovereignAI = async (prompt: string): Promise<string> => {
        if (!geminiApiKey) return "AI Offline. Please configure API Key.";
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            return response.text;
        } catch (e) {
            console.error("AI Processing Error:", e);
            return "AI Processing Error.";
        }
    };
    
    const addFinancialGoal = (goalData: Omit<FinancialGoal, 'id' | 'currentAmount' | 'plan' | 'contributions' | 'recurringContributions' | 'linkedGoals' | 'status'>) => {
        const newGoal: FinancialGoal = { ...goalData, id: uuidv4(), currentAmount: 0, plan: null, contributions: [], recurringContributions: [], linkedGoals: [], status: 'on_track' };
        setFinancialGoals(prev => [...prev, newGoal]);
    };

    const updateFinancialGoal = (goalId: string, updates: Partial<FinancialGoal>) => setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...updates } : g));

    const generateGoalPlan = async (goalId: string) => {
        const goal = financialGoals.find(g => g.id === goalId);
        if (!goal || !geminiApiKey) return;
        const prompt = `Based on the financial goal "${goal.name}" to save $${goal.targetAmount} by ${goal.targetDate}, create a concise, actionable plan. Current amount is $${goal.currentAmount}. Provide a JSON response with: "summary" (string), "monthlyContribution" (number), and "actionableSteps" (array of 3 strings).`;
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json" } });
            const planData = JSON.parse(response.text);
            const newPlan: AIGoalPlan = {
                summary: planData.summary, monthlyContribution: planData.monthlyContribution, actionableSteps: planData.actionableSteps,
                feasibilitySummary: '', steps: planData.actionableSteps.map((step: string) => ({ title: step.split(' ')[0], description: step, category: 'General' }))
            };
            updateFinancialGoal(goalId, { plan: newPlan });
        } catch (error) {
            console.error("Error generating goal plan:", error);
            updateFinancialGoal(goalId, { plan: { summary: "Error generating plan.", monthlyContribution: 0, actionableSteps: [], feasibilitySummary: '', steps: [] } });
        }
    };
    
    const addContributionToGoal = (goalId: string, amount: number) => {
        const newContribution: Contribution = { id: uuidv4(), amount, date: new Date().toISOString().split('T')[0], type: 'manual' };
        setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount, contributions: [newContribution, ...g.contributions] } : g));
    };

    const addRecurringContributionToGoal = (goalId: string, contribution: Omit<RecurringContribution, 'id'>) => {
        const newRecurring: RecurringContribution = { ...contribution, id: uuidv4() };
        setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, recurringContributions: [...(g.recurringContributions || []), newRecurring] } : g));
    };
    
    const updateRecurringContributionInGoal = (goalId: string, contributionId: string, updates: Partial<RecurringContribution>) => {
        setFinancialGoals(prev => prev.map(g => g.id !== goalId ? g : { ...g, recurringContributions: (g.recurringContributions || []).map(rc => rc.id === contributionId ? { ...rc, ...updates } : rc) }));
    };
    
    const deleteRecurringContributionFromGoal = (goalId: string, contributionId: string) => {
         setFinancialGoals(prev => prev.map(g => g.id !== goalId ? g : { ...g, recurringContributions: (g.recurringContributions || []).filter(rc => rc.id !== contributionId) }));
    };
    
    const linkGoals = (sourceGoalId: string, targetGoalId: string, relationshipType: LinkedGoal['relationshipType'], triggerAmount?: number) => {
        const newLink: LinkedGoal = { id: targetGoalId, relationshipType, triggerAmount };
        setFinancialGoals(prev => prev.map(g => g.id === sourceGoalId ? { ...g, linkedGoals: [...(g.linkedGoals || []), newLink] } : g));
    };
    
    const unlinkGoals = (sourceGoalId: string, targetGoalId: string) => {
        setFinancialGoals(prev => prev.map(g => g.id === sourceGoalId ? { ...g, linkedGoals: (g.linkedGoals || []).filter(l => l.id !== targetGoalId) } : g));
    };

    const broadcastEvent = (eventType: string, payload: any) => console.log(`[EventBus] ${eventType}:`, payload);

    // --- Crypto Mock Actions ---
    const connectWallet = (provider: any) => { console.log("Connected wallet", provider); setWalletInfo({ address: '0x123...', balance: 10 }); };
    const disconnectWallet = () => { setWalletInfo(null); };
    const issueCard = () => { setVirtualCard({ cardNumber: '4242 4242 4242 4242', holderName: 'J. Doe', expiry: '12/25' }); };
    const buyCrypto = (amount: number, currency: string) => { console.log(`Bought ${amount} ${currency}`); };

    // --- Security Mock Actions ---
    const showSystemAlert = (message: string, type: string) => console.log(`ALERT [${type}]: ${message}`);
    const unlinkAccount = (id: string) => setLinkedAccounts(prev => prev.filter(a => a.id !== id));
    
    // --- Marqeta Mock Actions ---
    const fetchMarqetaProducts = () => {
        setIsMarqetaLoading(true);
        setTimeout(() => {
            setMarqetaCardProducts([
                { token: 'mq_1', name: 'Standard Debit', active: true, start_date: '2023-01-01', config: { fulfillment: { bin_prefix: '123456', fulfillment_provider: 'arrow', payment_instrument: 'physical' }, poi: { other: { allow: true } }, jit_funding: { program_funding_source: { enabled: true } } } },
                { token: 'mq_2', name: 'Virtual Rewards', active: true, start_date: '2023-05-01', config: { fulfillment: { bin_prefix: '654321', fulfillment_provider: 'virtual', payment_instrument: 'virtual' }, poi: { other: { allow: false } }, jit_funding: { program_funding_source: { enabled: true } } } },
            ]);
            setIsMarqetaLoading(false);
        }, 1000);
    };


    const contextValue: DataContextType = {
        isLoading,
        error,
        activeView,
        setActiveView,
        transactions,
        assets,
        budgets,
        creditScore,
        upcomingBills,
        savingsGoals,
        financialGoals,
        marketMovers,
        linkedAccounts,
        notifications,
        subscriptions,
        paymentOrders,
        invoices,
        complianceCases,
        corporateTransactions,
        plaidApiKey,
        plaidClientId,
        stripeApiKey,
        geminiApiKey,
        marqetaApiToken,
        marqetaApiSecret,
        modernTreasuryApiKey,
        modernTreasuryOrganizationId: modernTreasuryOrgId,
        dbConfig,
        updateDbConfig,
        connectDatabase,
        webDriverStatus,
        launchWebDriver,
        addTransaction,
        updateBudget,
        addBudget,
        markNotificationRead,
        setGeminiApiKey,
        setModernTreasuryApiKey,
        setModernTreasuryOrganizationId: setModernTreasuryOrgId,
        setMarqetaCredentials,
        addFinancialGoal,
        generateGoalPlan,
        addContributionToGoal,
        addRecurringContributionToGoal,
        updateRecurringContributionInGoal,
        deleteRecurringContributionFromGoal,
        updateFinancialGoal,
        linkGoals,
        unlinkGoals,
        impactData: { treesPlanted: 124, progressToNextTree: 65 },
        gamification: { score: 1250, level: 5, levelName: "Financial Architect", progress: 45, credits: 500 },
        rewardPoints: { balance: 45200, lastEarned: 150, lastRedeemed: 0, currency: "PTS" },
        creditFactors: [{ name: "Payment History", status: 'Good', description: "On time" }, { name: "Utilization", status: 'Excellent', description: "Low usage" }],
        apiStatus,
        handlePlaidSuccess,
        isImportingData,
        userProfile: { name: "James B. O'Callaghan III", email: "visionary@idgaf.ai" },
        askSovereignAI,
        broadcastEvent,
        
        // Crypto
        cryptoAssets,
        walletInfo,
        virtualCard,
        nftAssets,
        connectWallet,
        disconnectWallet,
        detectedProviders,
        issueCard,
        buyCrypto,

        // Security
        showSystemAlert,
        unlinkAccount,
        securityMetrics,
        auditLogs,
        threatAlerts,
        dataSharingPolicies,
        apiKeys,
        trustedContacts,
        securityAwarenessModules,
        transactionRules,

        // Marqeta
        marqetaCardProducts,
        fetchMarqetaProducts,
        isMarqetaLoading
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};
