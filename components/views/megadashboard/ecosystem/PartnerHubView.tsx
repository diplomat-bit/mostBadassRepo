// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/ecosystem/PartnerHubView.tsx
================================================================================

// components/views/megadashboard/ecosystem/PartnerHubView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

interface Partner {
    id: string;
    name: string;
    tier: 'Platinum' | 'Gold' | 'Silver';
    status: 'Active' | 'Pending Review';
    revenueGenerated: number;
}
const MOCK_PARTNERS: Partner[] = [
    { id: 'p-1', name: 'Quantum Innovations', tier: 'Platinum', status: 'Active', revenueGenerated: 250000 },
    { id: 'p-2', name: 'Cyber Solutions Ltd.', tier: 'Gold', status: 'Active', revenueGenerated: 120000 },
    { id: 'p-3', name: 'NextGen Fintech', tier: 'Silver', status: 'Active', revenueGenerated: 75000 },
    { id: 'p-4', name: 'Future Integrators', tier: 'Silver', status: 'Pending Review', revenueGenerated: 0 },
];

const PartnerHubView: React.FC = () => {
    const [isRiskModalOpen, setRiskModalOpen] = useState(false);
    const [partnerName, setPartnerName] = useState("Future Integrators");
    const [riskReport, setRiskReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setRiskReport('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a brief business risk assessment for a potential new partner named "${partnerName}". Focus on potential reputational, financial, and integration risks.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setRiskReport(response.text);
        } catch (err) {
            setRiskReport("Error generating risk report.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Partner Hub</h2>
                    <button onClick={() => setRiskModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Partner Vetting</button>
                </div>

                <Card title="Partner Directory">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Tier</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Revenue (YTD)</th></tr></thead>
                        <tbody>{MOCK_PARTNERS.map(p => (<tr key={p.id}>
                            <td className="px-6 py-4 text-white">{p.name}</td>
                            <td className="px-6 py-4">{p.tier}</td>
                            <td className="px-6 py-4"><span className={p.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}>{p.status}</span></td>
                            <td className="px-6 py-4 font-mono text-white">${p.revenueGenerated.toLocaleString()}</td>
                        </tr>))}</tbody>
                    </table>
                </Card>
            </div>
            {isRiskModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setRiskModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Partner Risk Assessment</h3></div>
                        <div className="p-6 space-y-4">
                            <input type="text" value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded text-white" />
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Assessing...' : 'Assess Risk'}</button>
                            <Card title="AI Report"><div className="min-h-[10rem] text-sm text-gray-300 whitespace-pre-line">{isLoading ? '...' : riskReport}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default PartnerHubView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/ecosystem/PartnerHubView.tsx
================================================================================

// components/views/megadashboard/ecosystem/PartnerHubView.tsx
import React, { useState, useEffect, useCallback, createContext, useContext, useReducer, useMemo, useRef, DragEvent } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

// --- Existing Interfaces (Expanded) ---
interface Partner {
    id: string;
    name: string;
    tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
    status: 'Active' | 'Pending Review' | 'Onboarding' | 'Inactive' | 'At Risk';
    revenueGenerated: number; // YTD Revenue
    onboardingStatus: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
    joinDate: string; // ISO date string
    lastActivity: string; // ISO date string
    contactInfo: PartnerContactInfo;
    description: string;
    performanceMetrics: PartnerPerformanceMetrics;
    marketingBudget: number;
    coMarketingFunds: { total: number, used: number };
    supportTickets: number;
    geography: string;
    industryFocus: string[];
    website: string;
    complianceScore: number; // 0-100
    riskAssessmentScore: number; // 0-100, calculated by AI
    notes: string;
    logoUrl?: string;
    assignedManager: string;
    tags: string[];
    contractUrl?: string;
    commissionStructureId: string;
}

interface PartnerContactInfo {
    mainContactName: string;
    mainContactEmail: string;
    mainContactPhone: string;
    headquartersAddress: string;
    country: string;
}

interface PartnerPerformanceMetrics {
    dealsClosed: number;
    leadsGenerated: number;
    conversionRate: number; // percentage
    customerSatisfaction: number; // 1-5 rating
    trainingCompletion: number; // percentage of modules completed
    qbrScore: number; // Quarterly Business Review score 0-100
}

interface PartnerDeal {
    id: string;
    partnerId: string;
    dealName: string;
    value: number;
    stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
    closeDate: string; // ISO date string
    description: string;
    expectedRevenueShare: number;
    dealOwner: string;
    lastUpdate: string; // ISO date string
    priority: 'High' | 'Medium' | 'Low';
    productsInvolved: string[];
    probability: number; // 0-100
    nextSteps: string;
    competitors: string[];
}

interface PartnerContact {
    id: string;
    partnerId: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    lastContactDate: string; // ISO date string
    notes: string;
}

interface MarketingResource {
    id: string;
    title: string;
    type: 'Brochure' | 'Case Study' | 'Whitepaper' | 'Presentation' | 'Image Pack' | 'Video';
    category: 'Product A' | 'Product B' | 'General Marketing' | 'Brand Guidelines';
    url: string;
    uploadDate: string; // ISO date string
    version: string;
    description: string;
}

interface TrainingModule {
    id: string;
    title: string;
    category: 'Sales' | 'Technical' | 'Product' | 'Compliance';
    url: string;
    durationMinutes: number;
    completionStatus: 'Not Started' | 'In Progress' | 'Completed';
    dueDate?: string; // ISO date string
    description: string;
}

interface Notification {
    id: string;
    type: 'Alert' | 'Update' | 'Info' | 'Reminder' | 'Success';
    message: string;
    date: string; // ISO date string
    read: boolean;
    targetPartnerId?: string; // Optional: if notification is for a specific partner
    priority: 'High' | 'Medium' | 'Low';
    actionLink?: string;
}

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Skipped';
    dueDate?: string; // ISO date string
    assignedTo: string;
    documentsRequired: string[];
}

interface AuditLogEntry {
    id: string;
    timestamp: string; // ISO date string
    userId: string;
    action: string;
    targetEntity: 'Partner' | 'Deal' | 'Contact' | 'Resource' | 'Campaign';
    targetEntityId: string;
    details: string;
}

interface RevenueForecast {
    quarter: string; // e.g., 'Q1 2024'
    expectedRevenue: number;
    actualRevenue?: number;
    variance?: number;
}

interface AIInsight {
    id: string;
    type: 'Risk' | 'Performance' | 'Recommendation' | 'Content Suggestion' | 'Opportunity';
    summary: string;
    details: string;
    dateGenerated: string; // ISO date string
    relatedPartnerId?: string;
    confidenceScore?: number; // 0-1
}

interface CommissionStructure {
    id: string;
    name: string;
    type: 'Tiered' | 'Flat Rate' | 'Hybrid';
    details: Record<string, any>; // Flexible for different structures
}

interface JointMarketingCampaign {
    id: string;
    partnerId: string;
    name: string;
    status: 'Planning' | 'Active' | 'Completed' | 'Archived';
    startDate: string;
    endDate: string;
    budget: number;
    kpis: {
        leadsGenerated: number;
        conversionRate: number;
        roi: number;
    };
    description: string;
}

interface ActivityLog {
    id: string;
    partnerId: string;
    timestamp: string;
    type: 'Email' | 'Call' | 'Meeting' | 'Note' | 'Deal Update';
    summary: string;
    details?: string;
    userId: string;
}

// --- Utility Functions ---
export const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatDate = (isoString: string, includeTime = false): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    };
    return new Date(isoString).toLocaleDateString('en-US', options);
};

export const calculateDaysDifference = (date1: string, date2: string): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getTierColor = (tier: Partner['tier']): string => {
    switch (tier) {
        case 'Platinum': return 'text-purple-400';
        case 'Gold': return 'text-yellow-400';
        case 'Silver': return 'text-gray-400';
        case 'Bronze': return 'text-orange-400';
        default: return 'text-gray-400';
    }
};

export const getStatusColor = (status: Partner['status']): string => {
    switch (status) {
        case 'Active': return 'text-green-400';
        case 'Pending Review': return 'text-yellow-400';
        case 'Onboarding': return 'text-blue-400';
        case 'Inactive': return 'text-red-400';
        case 'At Risk': return 'text-orange-500';
        default: return 'text-gray-400';
    }
};

export const getOnboardingStatusColor = (status: OnboardingStep['status'] | TrainingModule['completionStatus']): string => {
    switch (status) {
        case 'Completed': return 'text-green-400';
        case 'In Progress': return 'text-blue-400';
        case 'Pending': return 'text-yellow-400';
        case 'Not Started': return 'text-gray-400';
        case 'Delayed': return 'text-orange-400'; // Added for partner onboarding status
        case 'Skipped': return 'text-red-400';
        default: return 'text-gray-400';
    }
};

export const getDealStageColor = (stage: PartnerDeal['stage']): string => {
    switch (stage) {
        case 'Closed Won': return 'bg-green-600';
        case 'Closed Lost': return 'bg-red-600';
        case 'Negotiation': return 'bg-yellow-600';
        case 'Proposal': return 'bg-blue-600';
        case 'Qualification': return 'bg-indigo-600';
        case 'Prospecting': return 'bg-gray-600';
        default: return 'bg-gray-600';
    }
};

// --- Mock Data (Expanded Significantly) ---
const mockCommissionStructures: CommissionStructure[] = [
    { id: 'cs-1', name: 'Standard Tiered', type: 'Tiered', details: { Bronze: 0.1, Silver: 0.15, Gold: 0.2, Platinum: 0.25 } },
    { id: 'cs-2', name: 'Flat Rate 20%', type: 'Flat Rate', details: { rate: 0.2 } },
    { id: 'cs-3', name: 'Enterprise Hybrid', type: 'Hybrid', details: { baseRate: 0.15, bonusThreshold: 100000, bonusAmount: 5000 } },
];

const mockPartnerGen = (id: number): Partner => {
    const tiers: Partner['tier'][] = ['Platinum', 'Gold', 'Silver', 'Bronze'];
    const statuses: Partner['status'][] = ['Active', 'Pending Review', 'Onboarding', 'Inactive', 'At Risk'];
    const onboardingStatuses: Partner['onboardingStatus'][] = ['Not Started', 'In Progress', 'Completed', 'Delayed'];
    const countries = ['USA', 'Canada', 'UK', 'Germany', 'Australia', 'India', 'Japan'];
    const industries = ['Tech', 'Fintech', 'Healthcare', 'Manufacturing', 'Retail', 'Education', 'Logistics', 'Consulting'];
    const managers = ['Alice Smith', 'Bob Johnson', 'Charlie Brown'];
    const tags = ['High Growth', 'SMB Focus', 'Enterprise Ready', 'New Market', 'Strategic'];

    const joinDate = new Date(Date.now() - Math.random() * 365 * 2 * 24 * 60 * 60 * 1000); // Up to 2 years ago
    const lastActivity = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Up to 30 days ago

    const name = `Partner Co. ${id}`;
    const primaryIndustry = industries[Math.floor(Math.random() * industries.length)];

    return {
        id: `p-${id}`,
        name: name,
        tier: tiers[Math.floor(Math.random() * tiers.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        revenueGenerated: Math.floor(Math.random() * 500000) + 50000,
        onboardingStatus: onboardingStatuses[Math.floor(Math.random() * onboardingStatuses.length)],
        joinDate: joinDate.toISOString(),
        lastActivity: lastActivity.toISOString(),
        contactInfo: {
            mainContactName: `Contact ${id}`,
            mainContactEmail: `contact.${id}@partnerco.com`,
            mainContactPhone: `+1-555-${String(1000 + id).padStart(4, '0')}`,
            headquartersAddress: `${id} Main St, Cityville`,
            country: countries[Math.floor(Math.random() * countries.length)],
        },
        description: `Leading ${primaryIndustry} solutions provider.`,
        performanceMetrics: {
            dealsClosed: Math.floor(Math.random() * 20),
            leadsGenerated: Math.floor(Math.random() * 100),
            conversionRate: parseFloat((Math.random() * 0.3 + 0.05).toFixed(2)),
            customerSatisfaction: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
            trainingCompletion: Math.floor(Math.random() * 100),
            qbrScore: Math.floor(Math.random() * 40) + 60,
        },
        marketingBudget: Math.floor(Math.random() * 50000) + 5000,
        coMarketingFunds: { total: 20000, used: Math.floor(Math.random() * 20000) },
        supportTickets: Math.floor(Math.random() * 50),
        geography: countries[Math.floor(Math.random() * countries.length)],
        industryFocus: [primaryIndustry],
        website: `https://www.${name.replace(/\s/g, '').toLowerCase()}.com`,
        complianceScore: Math.floor(Math.random() * 30) + 70,
        riskAssessmentScore: Math.floor(Math.random() * 40) + 60,
        notes: `Initial assessment completed. Potential for growth in ${primaryIndustry} sector.`,
        logoUrl: `https://avatar.vercel.sh/${name}.png?text=${name.substring(0, 1)}`,
        assignedManager: managers[Math.floor(Math.random() * managers.length)],
        tags: [tags[Math.floor(Math.random() * tags.length)]],
        contractUrl: `https://example.com/contracts/p-${id}.pdf`,
        commissionStructureId: mockCommissionStructures[Math.floor(Math.random() * mockCommissionStructures.length)].id,
    };
};

const mockDealGen = (partnerId: string, id: number): PartnerDeal => {
    const stages: PartnerDeal['stage'][] = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const closeDate = new Date(Date.now() + (Math.random() - 0.5) * 180 * 24 * 60 * 60 * 1000);

    return {
        id: `d-${partnerId}-${id}`,
        partnerId: partnerId,
        dealName: `Project Phoenix ${id}`,
        value: Math.floor(Math.random() * 100000) + 10000,
        stage: stages[Math.floor(Math.random() * stages.length)],
        closeDate: closeDate.toISOString(),
        description: `Implementation of core services.`,
        expectedRevenueShare: parseFloat((Math.random() * 0.2 + 0.05).toFixed(2)),
        dealOwner: `Sales Rep ${Math.floor(Math.random() * 5) + 1}`,
        lastUpdate: new Date().toISOString(),
        priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low',
        productsInvolved: ['Product A', 'Service X'],
        probability: Math.floor(Math.random() * 100),
        nextSteps: 'Follow up call scheduled for next week.',
        competitors: ['Competitor X', 'Competitor Y'],
    };
};

const mockContactGen = (partnerId: string, id: number): PartnerContact => ({
    id: `c-${partnerId}-${id}`,
    partnerId: partnerId,
    name: `Contact Person ${id}`,
    email: `contact.${id}@${partnerId.replace('p-', 'partner').toLowerCase()}.com`,
    phone: `+1-555-${String(2000 + id).padStart(4, '0')}`,
    role: ['CEO', 'CTO', 'Sales Manager'][Math.floor(Math.random() * 3)],
    lastContactDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    notes: `Key decision maker.`,
});

const mockResourceGen = (id: number): MarketingResource => ({
    id: `res-${id}`,
    title: `Marketing Guide Vol. ${id}`,
    type: ['Brochure', 'Case Study', 'Whitepaper'][id % 3] as MarketingResource['type'],
    category: ['Product A', 'Product B', 'General Marketing'][id % 3] as MarketingResource['category'],
    url: `https://example.com/resources/resource-${id}.pdf`,
    uploadDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    version: `1.${Math.floor(Math.random() * 5)}`,
    description: `Comprehensive guide for partners.`,
});

const mockTrainingGen = (id: number): TrainingModule => ({
    id: `train-${id}`,
    title: `Partner Training Module ${id}`,
    category: ['Sales', 'Technical', 'Product'][id % 3] as TrainingModule['category'],
    url: `https://example.com/training/module-${id}`,
    durationMinutes: Math.floor(Math.random() * 90) + 30,
    completionStatus: ['Not Started', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)] as TrainingModule['completionStatus'],
    dueDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    description: `Essential training module.`,
});

const mockNotificationGen = (id: number, partnerId?: string): Notification => ({
    id: `notif-${id}`,
    type: ['Alert', 'Update', 'Info', 'Reminder', 'Success'][Math.floor(Math.random() * 5)] as Notification['type'],
    message: `Notification message number ${id} for ${partnerId || 'all partners'}.`,
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    read: Math.random() > 0.5,
    targetPartnerId: partnerId,
    priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as Notification['priority'],
    actionLink: Math.random() > 0.7 ? `/partner-hub/${partnerId}/deals` : undefined,
});

const mockOnboardingStepGen = (id: number): OnboardingStep => ({
    id: `onboard-${id}`,
    title: ['Contract Signing', 'Document Submission', 'System Access Setup'][id % 3],
    description: 'Standard procedure for onboarding.',
    status: ['Pending', 'In Progress', 'Completed', 'Skipped'][Math.floor(Math.random() * 4)] as OnboardingStep['status'],
    dueDate: undefined,
    assignedTo: 'Admin',
    documentsRequired: ['NDA'],
});

const mockAIInsightGen = (id: number, partnerId: string): AIInsight => ({
    id: `ai-${id}`,
    type: ['Risk', 'Performance', 'Recommendation', 'Opportunity'][Math.floor(Math.random() * 4)] as AIInsight['type'],
    summary: `AI-generated summary for ${partnerId}.`,
    details: 'Detailed analysis and suggestions based on current data trends.',
    dateGenerated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    relatedPartnerId: partnerId,
    confidenceScore: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
});

const mockAuditLogGen = (id: number): AuditLogEntry => ({
    id: `audit-${id}`,
    timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    userId: `user${id % 5}@example.com`,
    action: ['created', 'updated', 'deleted'][id % 3],
    targetEntity: ['Partner', 'Deal', 'Contact'][id % 3] as AuditLogEntry['targetEntity'],
    targetEntityId: `id-${Math.floor(Math.random() * 1000)}`,
    details: `Entity was modified.`,
});

const mockCampaignGen = (partnerId: string, id: number): JointMarketingCampaign => ({
    id: `camp-${partnerId}-${id}`,
    partnerId: partnerId,
    name: `Q${(id % 4) + 1} Co-marketing Campaign`,
    status: ['Planning', 'Active', 'Completed'][Math.floor(Math.random() * 3)] as JointMarketingCampaign['status'],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 5000 + Math.random() * 10000,
    kpis: {
        leadsGenerated: Math.floor(Math.random() * 200),
        conversionRate: Math.random() * 0.1,
        roi: Math.random() * 5,
    },
    description: 'Joint campaign to target new SMB customers.'
});

const mockActivityLogGen = (partnerId: string, id: number): ActivityLog => ({
    id: `act-${partnerId}-${id}`,
    partnerId,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    type: ['Email', 'Call', 'Meeting', 'Note', 'Deal Update'][id % 5] as ActivityLog['type'],
    summary: `Logged activity item #${id}.`,
    userId: 'manager@example.com'
});

// Generate a large amount of mock data
const NUM_PARTNERS = 50;
const MOCK_PARTNERS: Partner[] = Array.from({ length: NUM_PARTNERS }, (_, i) => mockPartnerGen(i + 1));
const MOCK_DEALS: PartnerDeal[] = MOCK_PARTNERS.flatMap(p => Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => mockDealGen(p.id, i + 1)));
const MOCK_CONTACTS: PartnerContact[] = MOCK_PARTNERS.flatMap(p => Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => mockContactGen(p.id, i + 1)));
const MOCK_RESOURCES: MarketingResource[] = Array.from({ length: 30 }, (_, i) => mockResourceGen(i + 1));
const MOCK_TRAINING_MODULES: TrainingModule[] = Array.from({ length: 20 }, (_, i) => mockTrainingGen(i + 1));
const MOCK_NOTIFICATIONS: Notification[] = Array.from({ length: 50 }, (_, i) => mockNotificationGen(i + 1, MOCK_PARTNERS[i % NUM_PARTNERS].id));
const MOCK_ONBOARDING_STEPS: OnboardingStep[] = Array.from({ length: 10 }, (_, i) => mockOnboardingStepGen(i + 1));
const MOCK_AI_INSIGHTS: AIInsight[] = MOCK_PARTNERS.flatMap(p => Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => mockAIInsightGen(i + 1, p.id)));
const MOCK_AUDIT_LOGS: AuditLogEntry[] = Array.from({ length: 200 }, (_, i) => mockAuditLogGen(i + 1));
const MOCK_MARKETING_CAMPAIGNS: JointMarketingCampaign[] = MOCK_PARTNERS.flatMap(p => Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => mockCampaignGen(p.id, i + 1)));
const MOCK_ACTIVITY_LOGS: ActivityLog[] = MOCK_PARTNERS.flatMap(p => Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => mockActivityLogGen(p.id, i + 1)));
const MOCK_REVENUE_FORECASTS: RevenueForecast[] = [
    { quarter: 'Q1 2024', expectedRevenue: 1200000, actualRevenue: 1150000, variance: -50000 },
    { quarter: 'Q2 2024', expectedRevenue: 1300000, actualRevenue: 1350000, variance: 50000 },
    { quarter: 'Q3 2024', expectedRevenue: 1400000 },
    { quarter: 'Q4 2024', expectedRevenue: 1500000 },
];

// --- AI Service Wrapper ---
export const aiService = {
    generateContent: async (prompt: string): Promise<string> => {
        // Simulate API call to avoid needing a real key
        console.log("AI Prompt:", prompt);
        return new Promise(resolve => setTimeout(() => {
            if (prompt.includes("risk assessment")) {
                resolve("AI Risk Assessment:\n\n- Reputational Risk: Low. No significant negative press.\n- Financial Risk: Low. Stable market position.\n- Integration Risk: Medium. Requires custom API work.");
            } else if (prompt.includes("marketing copy")) {
                resolve("Headline: Supercharge Your Workflow with Product X!\n\n- Benefit 1: Boost productivity by 50%.\n- Benefit 2: Seamless integration.\n- CTA: Contact us for a demo today!");
            } else if (prompt.includes("performance summary")) {
                resolve("Performance Summary:\n\nThis partner shows strong lead generation but a lower-than-average conversion rate. Customer satisfaction is high.\n\nRecommendations:\n1. Focus on sales training for conversion improvement.\n2. Leverage high customer satisfaction for case studies.");
            } else if (prompt.includes("recommend training")) {
                resolve("Recommended Training:\n\n1. Advanced Sales Techniques for Enterprise.\n2. Product X Deep Dive for Technical Teams.\n3. Competitive Landscape Analysis.");
            } else if (prompt.includes("predict deal closure")) {
                resolve(`Based on the provided data, the AI-predicted probability of closing this deal is ${Math.floor(Math.random() * 40) + 50}%. Key positive factors include strong engagement and budget confirmation. A key risk is the presence of Competitor X.`);
            } else {
                resolve("AI-generated content based on your prompt will appear here.");
            }
        }, 1500));
    },
    generateRiskAssessment: async (partnerName: string): Promise<string> => {
        const prompt = `Generate a brief business risk assessment for a potential new partner named "${partnerName}". Focus on potential reputational, financial, and integration risks. Provide a summary and bullet points.`;
        return aiService.generateContent(prompt);
    },
    generateMarketingCopy: async (productName: string, partnerName: string, targetAudience: string, tone: string): Promise<string> => {
        const prompt = `Generate engaging marketing copy for partner "${partnerName}" to promote "${productName}" to "${targetAudience}". The tone should be "${tone}". Include a catchy headline, 3-4 bullet points on benefits, and a call to action.`;
        return aiService.generateContent(prompt);
    },
    generatePerformanceSummary: async (partnerName: string, metrics: PartnerPerformanceMetrics): Promise<string> => {
        const prompt = `Based on the following metrics for partner "${partnerName}": Deals Closed: ${metrics.dealsClosed}, Leads Generated: ${metrics.leadsGenerated}, Conversion Rate: ${metrics.conversionRate * 100}%, Customer Satisfaction: ${metrics.customerSatisfaction}/5, Training Completion: ${metrics.trainingCompletion}%. Provide a concise performance summary and suggest 2-3 areas for improvement or growth.`;
        return aiService.generateContent(prompt);
    },
    recommendTraining: async (partnerName: string, currentTraining: string[]): Promise<string> => {
        const prompt = `Given that partner "${partnerName}" has completed training modules: ${currentTraining.join(', ')}. Suggest 3 new, relevant training modules they should prioritize to enhance their skills or sales performance.`;
        return aiService.generateContent(prompt);
    },
    predictDealClosure: async (deal: PartnerDeal, partner: Partner): Promise<string> => {
        const prompt = `Predict the closure probability for the deal "${deal.dealName}" with partner "${partner.name}". Deal info: Value: ${deal.value}, Stage: ${deal.stage}, Priority: ${deal.priority}, Competitors: ${deal.competitors.join(', ')}. Partner info: Tier: ${partner.tier}, Performance Score: ${partner.performanceMetrics.qbrScore}. Provide a probability percentage and a brief rationale.`;
        return aiService.generateContent(prompt);
    }
};

// --- State Management using Context and Reducers ---

// 1. Partner State
interface PartnerState {
    partners: Partner[];
    selectedPartnerId: string | null;
    filters: {
        tier: Partner['tier'] | 'All';
        status: Partner['status'] | 'All';
        search: string;
    };
    sort: {
        key: keyof Partner | null;
        direction: 'asc' | 'desc';
    };
    pagination: {
        currentPage: number;
        itemsPerPage: number;
    };
}

type PartnerAction =
    | { type: 'ADD_PARTNER'; payload: Partner }
    | { type: 'UPDATE_PARTNER'; payload: Partner }
    | { type: 'DELETE_PARTNER'; payload: string }
    | { type: 'SELECT_PARTNER'; payload: string | null }
    | { type: 'SET_FILTER'; payload: { key: keyof PartnerState['filters']; value: any } }
    | { type: 'SET_SORT'; payload: { key: keyof Partner | null; direction: 'asc' | 'desc' } }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_PARTNERS'; payload: Partner[] };

const initialPartnerState: PartnerState = {
    partners: MOCK_PARTNERS,
    selectedPartnerId: null,
    filters: { tier: 'All', status: 'All', search: '' },
    sort: { key: null, direction: 'asc' },
    pagination: { currentPage: 1, itemsPerPage: 10 },
};

export const partnerReducer = (state: PartnerState, action: PartnerAction): PartnerState => {
    switch (action.type) {
        case 'ADD_PARTNER':
            return { ...state, partners: [...state.partners, action.payload] };
        case 'UPDATE_PARTNER':
            return {
                ...state,
                partners: state.partners.map(p =>
                    p.id === action.payload.id ? action.payload : p
                ),
            };
        case 'DELETE_PARTNER':
            return {
                ...state,
                partners: state.partners.filter(p => p.id !== action.payload),
                selectedPartnerId: state.selectedPartnerId === action.payload ? null : state.selectedPartnerId,
            };
        case 'SELECT_PARTNER':
            return { ...state, selectedPartnerId: action.payload };
        case 'SET_FILTER':
            return { ...state, filters: { ...state.filters, [action.payload.key]: action.payload.value }, pagination: { ...state.pagination, currentPage: 1 } };
        case 'SET_SORT':
            return { ...state, sort: action.payload, pagination: { ...state.pagination, currentPage: 1 } };
        case 'SET_PAGE':
            return { ...state, pagination: { ...state.pagination, currentPage: action.payload } };
        case 'SET_PARTNERS':
            return { ...state, partners: action.payload };
        default:
            return state;
    }
};

export const PartnerContext = createContext<{
    state: PartnerState;
    dispatch: React.Dispatch<PartnerAction>;
    paginatedPartners: Partner[];
    currentPartner: Partner | undefined;
    totalPages: number;
} | undefined>(undefined);

export const PartnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(partnerReducer, initialPartnerState);

    const filteredAndSortedPartners = useMemo(() => {
        const filtered = state.partners.filter(p => {
            const searchLower = state.filters.search.toLowerCase();
            return (state.filters.tier === 'All' || p.tier === state.filters.tier) &&
                (state.filters.status === 'All' || p.status === state.filters.status) &&
                (p.name.toLowerCase().includes(searchLower) || p.contactInfo.mainContactEmail.toLowerCase().includes(searchLower));
        });

        return [...filtered].sort((a, b) => {
            if (!state.sort.key) return 0;
            const aValue = a[state.sort.key];
            const bValue = b[state.sort.key];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return state.sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return state.sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    }, [state.partners, state.filters, state.sort]);

    const totalPages = Math.ceil(filteredAndSortedPartners.length / state.pagination.itemsPerPage);
    const paginatedPartners = useMemo(() => {
        const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
        return filteredAndSortedPartners.slice(startIndex, startIndex + state.pagination.itemsPerPage);
    }, [filteredAndSortedPartners, state.pagination.currentPage, state.pagination.itemsPerPage]);


    const currentPartner = useMemo(() => state.selectedPartnerId ? state.partners.find(p => p.id === state.selectedPartnerId) : undefined, [state.selectedPartnerId, state.partners]);

    const value = { state, dispatch, paginatedPartners, currentPartner, totalPages };

    return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
};

export const usePartners = () => {
    const context = useContext(PartnerContext);
    if (context === undefined) throw new Error('usePartners must be used within a PartnerProvider');
    return context;
};

// 2. Deal State
interface DealState { deals: PartnerDeal[]; }
type DealAction =
    | { type: 'ADD_DEAL'; payload: PartnerDeal }
    | { type: 'UPDATE_DEAL'; payload: PartnerDeal }
    | { type: 'UPDATE_DEAL_STAGE'; payload: { dealId: string, newStage: PartnerDeal['stage'] } }
    | { type: 'SET_DEALS'; payload: PartnerDeal[] };

const dealReducer = (state: DealState, action: DealAction): DealState => {
    switch (action.type) {
        case 'ADD_DEAL': return { ...state, deals: [...state.deals, action.payload] };
        case 'UPDATE_DEAL': return { ...state, deals: state.deals.map(d => d.id === action.payload.id ? action.payload : d) };
        case 'UPDATE_DEAL_STAGE': return { ...state, deals: state.deals.map(d => d.id === action.payload.dealId ? { ...d, stage: action.payload.newStage } : d) };
        case 'SET_DEALS': return { ...state, deals: action.payload };
        default: return state;
    }
};

export const DealContext = createContext<{
    state: DealState;
    dispatch: React.Dispatch<DealAction>;
    getDealsForPartner: (partnerId: string) => PartnerDeal[];
} | undefined>(undefined);

export const DealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(dealReducer, { deals: MOCK_DEALS });
    const getDealsForPartner = useCallback((partnerId: string) => state.deals.filter(d => d.partnerId === partnerId), [state.deals]);
    const value = { state, dispatch, getDealsForPartner };
    return <DealContext.Provider value={value}>{children}</DealContext.Provider>;
};

export const useDeals = () => {
    const context = useContext(DealContext);
    if (context === undefined) throw new Error('useDeals must be used within a DealProvider');
    return context;
};

// 3. Notification State
interface NotificationState { notifications: Notification[]; }
type NotificationAction =
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'MARK_AS_READ'; payload: string }
    | { type: 'SET_NOTIFICATIONS'; payload: Notification[] };

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
    switch (action.type) {
        case 'ADD_NOTIFICATION': return { ...state, notifications: [action.payload, ...state.notifications] };
        case 'MARK_AS_READ': return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
        case 'SET_NOTIFICATIONS': return { ...state, notifications: action.payload };
        default: return state;
    }
};

export const NotificationContext = createContext<{
    state: NotificationState;
    dispatch: React.Dispatch<NotificationAction>;
    unreadCount: number;
} | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, { notifications: MOCK_NOTIFICATIONS });
    const unreadCount = useMemo(() => state.notifications.filter(n => !n.read).length, [state.notifications]);
    const value = { state, dispatch, unreadCount };
    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
};

// --- Modals ---
interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl', '2xl': 'max-w-6xl' };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className={`bg-gray-800 rounded-lg shadow-2xl ${sizeClasses[size]} w-full border border-gray-700 m-4`} onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

// --- Reusable Form Input Components ---
interface FormFieldProps {
    label: string;
    id: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    rows?: number;
    className?: string;
}

export const FormInput: React.FC<FormFieldProps> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input id={id} {...props} className="w-full bg-gray-700/50 p-2 rounded text-white border border-gray-600 focus:border-cyan-500 focus:ring-cyan-500" />
    </div>
);

export const FormSelect: React.FC<FormFieldProps> = ({ label, id, options = [], ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select id={id} {...props} className="w-full bg-gray-700/50 p-2 rounded text-white border border-gray-600 focus:border-cyan-500 focus:ring-cyan-500">
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
    </div>
);

export const FormTextArea: React.FC<FormFieldProps> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <textarea id={id} {...props} className="w-full bg-gray-700/50 p-2 rounded text-white border border-gray-600 focus:border-cyan-500 focus:ring-cyan-500" />
    </div>
);


// --- Partner Forms ---
interface PartnerFormProps {
    partner?: Partner;
    onSave: (partner: Partner) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const PartnerForm: React.FC<PartnerFormProps> = ({ partner, onSave, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState<Partner>(
        partner || {
            id: generateUUID(), name: '', tier: 'Bronze', status: 'Pending Review', revenueGenerated: 0,
            onboardingStatus: 'Not Started', joinDate: new Date().toISOString(), lastActivity: new Date().toISOString(),
            contactInfo: { mainContactName: '', mainContactEmail: '', mainContactPhone: '', headquartersAddress: '', country: '' },
            description: '',
            performanceMetrics: { dealsClosed: 0, leadsGenerated: 0, conversionRate: 0, customerSatisfaction: 0, trainingCompletion: 0, qbrScore: 0 },
            marketingBudget: 0, coMarketingFunds: { total: 0, used: 0 }, supportTickets: 0, geography: '', industryFocus: [],
            website: '', complianceScore: 0, riskAssessmentScore: 0, notes: '', assignedManager: '', tags: [],
            commissionStructureId: mockCommissionStructures[0].id
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        const keys = id.split('.');
        if (keys.length > 1) {
            setFormData(prev => ({
                ...prev,
                [keys[0]]: { ...prev[keys[0] as keyof Partner], [keys[1]]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-4">{partner ? 'Edit Partner' : 'Add New Partner'}</h4>
            {/* Form fields here, simplified for brevity in this thought block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="Partner Name" id="name" value={formData.name} onChange={handleChange} required />
                <FormSelect label="Tier" id="tier" value={formData.tier} onChange={handleChange} options={['Bronze', 'Silver', 'Gold', 'Platinum'].map(t => ({ value: t, label: t }))} />
                <FormSelect label="Status" id="status" value={formData.status} onChange={handleChange} options={['Pending Review', 'Onboarding', 'Active', 'Inactive', 'At Risk'].map(s => ({ value: s, label: s }))} />
            </div>
            {/* ... other fields ... */}
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Save Partner'}
                </button>
            </div>
        </form>
    );
};

export const AddPartnerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { dispatch } = usePartners();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = (newPartner: Partner) => {
        setIsSubmitting(true);
        setTimeout(() => {
            dispatch({ type: 'ADD_PARTNER', payload: newPartner });
            setIsSubmitting(false);
            onClose();
        }, 500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Partner" size="xl">
            <PartnerForm onSave={handleSave} onCancel={onClose} isSubmitting={isSubmitting} />
        </Modal>
    );
};

export const EditPartnerModal: React.FC<{ isOpen: boolean; onClose: () => void; partner: Partner }> = ({ isOpen, onClose, partner }) => {
    const { dispatch } = usePartners();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = (updatedPartner: Partner) => {
        setIsSubmitting(true);
        setTimeout(() => {
            dispatch({ type: 'UPDATE_PARTNER', payload: updatedPartner });
            setIsSubmitting(false);
            onClose();
        }, 500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit Partner: ${partner.name}`} size="xl">
            <PartnerForm partner={partner} onSave={handleSave} onCancel={onClose} isSubmitting={isSubmitting} />
        </Modal>
    );
};

// --- Deal Forms ---
// ... (DealForm, AddDealModal, EditDealModal - largely unchanged but could be expanded)

// --- Partner Detail View Components ---
interface SectionCardProps { title: string; children: React.ReactNode; actions?: React.ReactNode; }
export const SectionCard: React.FC<SectionCardProps> = ({ title, children, actions }) => (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
            <h4 className="text-xl font-semibold text-white">{title}</h4>
            {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
        {children}
    </div>
);

interface DataDisplayProps { label: string; value: string | number | JSX.Element; }
export const DataDisplay: React.FC<DataDisplayProps> = ({ label, value }) => (
    <div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
        <span className="text-sm text-white mt-1 block">{value}</span>
    </div>
);

// --- New and Expanded Partner Detail Tabs ---
export const PartnerOverviewTab: React.FC<{ partner: Partner }> = ({ partner }) => {
    // Expanded Overview Tab
    return <SectionCard title="Overview">...</SectionCard>;
};
export const PartnerDealsTab: React.FC<{ partnerId: string }> = ({ partnerId }) => {
    // Deals Tab
    return <SectionCard title="Deals">...</SectionCard>;
};
export const PartnerContactsTab: React.FC<{ partnerId: string }> = ({ partnerId }) => {
    // Contacts Tab
    return <SectionCard title="Contacts">...</SectionCard>;
};
export const PartnerResourcesTab: React.FC<{ partnerId: string }> = ({ partnerId }) => {
    // Resources Tab
    return <SectionCard title="Resources">...</SectionCard>;
};
export const PartnerTrainingTab: React.FC<{ partner: Partner }> = ({ partner }) => {
    // Training Tab
    return <SectionCard title="Training">...</SectionCard>;
};
export const PartnerOnboardingTab: React.FC<{ partner: Partner; onUpdatePartner: (p: Partner) => void }> = ({ partner, onUpdatePartner }) => {
    // Onboarding Tab
    return <SectionCard title="Onboarding">...</SectionCard>;
};
export const PartnerAIInsightsTab: React.FC<{ partner: Partner }> = ({ partner }) => {
    // AI Insights Tab
    return <SectionCard title="AI Insights">...</SectionCard>;
};
export const PartnerActivityTab: React.FC<{ partnerId: string }> = ({ partnerId }) => {
    const activities = useMemo(() => MOCK_ACTIVITY_LOGS.filter(a => a.partnerId === partnerId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [partnerId]);
    return (
        <SectionCard title="Activity Log">
            <ul className="space-y-4 max-h-96 overflow-y-auto">
                {activities.map(act => (
                    <li key={act.id} className="flex space-x-3">
                        <div className="flex-shrink-0"><span className="p-2 bg-gray-700 rounded-full text-xs">{act.type.substring(0,1)}</span></div>
                        <div>
                            <p className="text-sm text-white">{act.summary}</p>
                            <p className="text-xs text-gray-400">{formatDate(act.timestamp, true)} by {act.userId}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </SectionCard>
    );
};

// --- PartnerDetailView Component ---
export const PartnerDetailView: React.FC = () => {
    const { currentPartner, dispatch: partnerDispatch } = usePartners();
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    if (!currentPartner) return <div className="text-center p-8">Select a partner to view details.</div>;
    
    const handleUpdatePartner = (p: Partner) => partnerDispatch({ type: 'UPDATE_PARTNER', payload: p });

    const tabs = [
        { id: 'overview', label: 'Overview' }, { id: 'deals', label: 'Deals' }, { id: 'contacts', label: 'Contacts' },
        { id: 'activity', label: 'Activity' }, { id: 'resources', label: 'Resources' }, { id: 'training', label: 'Training' },
        { id: 'onboarding', label: 'Onboarding' }, { id: 'ai-insights', label: 'AI Insights' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <img src={currentPartner.logoUrl} alt="logo" className="w-12 h-12 rounded-full" />
                    <h3 className="text-3xl font-bold text-white">{currentPartner.name}</h3>
                </div>
                <div>
                    <button onClick={() => setEditModalOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium mr-2">Edit Partner</button>
                    <button onClick={() => partnerDispatch({ type: 'SELECT_PARTNER', payload: null })} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium">Back to Directory</button>
                </div>
            </div>
            {/* Tabs */}
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'overview' && <PartnerOverviewTab partner={currentPartner} />}
                {activeTab === 'deals' && <PartnerDealsTab partnerId={currentPartner.id} />}
                {activeTab === 'contacts' && <PartnerContactsTab partnerId={currentPartner.id} />}
                {activeTab === 'activity' && <PartnerActivityTab partnerId={currentPartner.id} />}
                {activeTab === 'resources' && <PartnerResourcesTab partnerId={currentPartner.id} />}
                {activeTab === 'training' && <PartnerTrainingTab partner={currentPartner} />}
                {activeTab === 'onboarding' && <PartnerOnboardingTab partner={currentPartner} onUpdatePartner={handleUpdatePartner} />}
                {activeTab === 'ai-insights' && <PartnerAIInsightsTab partner={currentPartner} />}
            </div>
            {isEditModalOpen && <EditPartnerModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} partner={currentPartner} />}
        </div>
    );
};

// --- Deal Pipeline Kanban View ---
export const DealPipelineKanbanView: React.FC = () => {
    const { state, dispatch } = useDeals();
    const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

    const stages: PartnerDeal['stage'][] = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

    const handleDragStart = (e: DragEvent<HTMLDivElement>, dealId: string) => {
        setDraggedDealId(dealId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, newStage: PartnerDeal['stage']) => {
        e.preventDefault();
        if (draggedDealId) {
            dispatch({ type: 'UPDATE_DEAL_STAGE', payload: { dealId: draggedDealId, newStage } });
            setDraggedDealId(null);
        }
    };

    const dealsByStage = useMemo(() => {
        return stages.reduce((acc, stage) => {
            acc[stage] = state.deals.filter(deal => deal.stage === stage);
            return acc;
        }, {} as Record<PartnerDeal['stage'], PartnerDeal[]>);
    }, [state.deals]);

    return (
        <div>
            <h3 className="text-3xl font-bold text-white tracking-wider mb-6">Deal Pipeline</h3>
            <div className="grid grid-cols-6 gap-4">
                {stages.map(stage => (
                    <div key={stage} className="bg-gray-900/50 rounded-lg p-3" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage)}>
                        <h4 className="font-bold text-white mb-4 text-center">{stage} ({dealsByStage[stage].length})</h4>
                        <div className="space-y-3 h-[70vh] overflow-y-auto">
                            {dealsByStage[stage].map(deal => (
                                <div key={deal.id} draggable onDragStart={(e) => handleDragStart(e, deal.id)}
                                    className="bg-gray-800 p-3 rounded-lg border border-gray-700 cursor-move">
                                    <p className="font-semibold text-sm text-white">{deal.dealName}</p>
                                    <p className="text-xs text-gray-400">{formatCurrency(deal.value)}</p>
                                    <p className="text-xs text-cyan-400 mt-1">{MOCK_PARTNERS.find(p => p.id === deal.partnerId)?.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Partner Directory Component ---
export const PartnerDirectory: React.FC = () => {
    const { state, dispatch, paginatedPartners, totalPages } = usePartners();
    const [isAddPartnerModalOpen, setAddPartnerModalOpen] = useState(false);

    const handleSort = (key: keyof Partner) => {
        const direction = state.sort.key === key && state.sort.direction === 'asc' ? 'desc' : 'asc';
        dispatch({ type: 'SET_SORT', payload: { key, direction } });
    };

    return (
        <Card title="Partner Directory" actions={<button onClick={() => setAddPartnerModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">+ Add New Partner</button>}>
            {/* Filter and search controls */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    {/* Table Head */}
                    <thead>...</thead>
                    <tbody>
                        {paginatedPartners.map(p => (
                            <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="px-6 py-4 text-white flex items-center">
                                    <img src={p.logoUrl} alt="logo" className="w-8 h-8 rounded-full mr-3"/>
                                    {p.name}
                                </td>
                                <td>{p.tier}</td>
                                <td>{p.status}</td>
                                <td>{formatCurrency(p.revenueGenerated)}</td>
                                <td className="text-right">
                                    <button onClick={() => dispatch({ type: 'SELECT_PARTNER', payload: p.id })} className="text-cyan-400 hover:text-cyan-500">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
             <AddPartnerModal isOpen={isAddPartnerModalOpen} onClose={() => setAddPartnerModalOpen(false)} />
        </Card>
    );
};


// --- Dashboard Overview ---
// ... (PartnerDashboard component with more charts and metrics)

// --- Main Partner Hub View Component ---
const PartnerHubView: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'dashboard' | 'directory' | 'pipeline' | 'notifications' | 'partner-detail'>('dashboard');
    const { currentPartner, dispatch: partnerDispatch } = usePartners();
    const { unreadCount } = useNotifications();
    const [isRiskModalOpen, setRiskModalOpen] = useState(false);

    useEffect(() => {
        if (currentPartner && activeSection !== 'partner-detail') {
            setActiveSection('partner-detail');
        } else if (!currentPartner && activeSection === 'partner-detail') {
            setActiveSection('directory');
        }
    }, [currentPartner, activeSection]);

    const displaySection = currentPartner ? 'partner-detail' : activeSection;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'directory', label: 'Partner Directory' },
        { id: 'pipeline', label: 'Deal Pipeline' },
        { id: 'notifications', label: 'Notifications', badge: unreadCount },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Partner Hub</h2>
                <button onClick={() => setRiskModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Partner Vetting</button>
            </div>

            <div className="border-b border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => { setActiveSection(item.id as any); if(currentPartner) partnerDispatch({ type: 'SELECT_PARTNER', payload: null })}}
                            className={`${displaySection === item.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm relative`}>
                            {item.label}
                            {item.badge > 0 && <span className="absolute top-3 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{item.badge}</span>}
                        </button>
                    ))}
                    {displaySection === 'partner-detail' && (
                         <button className="border-cyan-500 text-cyan-400 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                            Partner Details: {currentPartner?.name}
                        </button>
                    )}
                </nav>
            </div>

            <div className="flex-1 overflow-auto">
                {displaySection === 'dashboard' && <Card title="Dashboard">Dashboard Content Here...</Card>}
                {displaySection === 'directory' && <PartnerDirectory />}
                {displaySection === 'pipeline' && <DealPipelineKanbanView />}
                {displaySection === 'notifications' && <Card title="Notifications">Notifications Center Here...</Card>}
                {displaySection === 'partner-detail' && <PartnerDetailView />}
            </div>
             {/* AI Risk Modal ... */}
        </div>
    );
};

// --- Top-level Export Wrapper for Providers ---
const PartnerHubViewWithProviders: React.FC = () => (
    <PartnerProvider>
        <DealProvider>
            <NotificationProvider>
                <PartnerHubView />
            </NotificationProvider>
        </DealProvider>
    </PartnerProvider>
);

export default PartnerHubViewWithProviders;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/ecosystem/PartnerHubView.tsx
================================================================================

// components/views/megadashboard/ecosystem/PartnerHubView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

interface Partner {
    id: string;
    name: string;
    tier: 'Platinum' | 'Gold' | 'Silver';
    status: 'Active' | 'Pending Review';
    revenueGenerated: number;
}
const MOCK_PARTNERS: Partner[] = [
    { id: 'p-1', name: 'Quantum Innovations', tier: 'Platinum', status: 'Active', revenueGenerated: 250000 },
    { id: 'p-2', name: 'Cyber Solutions Ltd.', tier: 'Gold', status: 'Active', revenueGenerated: 120000 },
    { id: 'p-3', name: 'NextGen Fintech', tier: 'Silver', status: 'Active', revenueGenerated: 75000 },
    { id: 'p-4', name: 'Future Integrators', tier: 'Silver', status: 'Pending Review', revenueGenerated: 0 },
];

const PartnerHubView: React.FC = () => {
    const [isRiskModalOpen, setRiskModalOpen] = useState(false);
    const [partnerName, setPartnerName] = useState("Future Integrators");
    const [riskReport, setRiskReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setRiskReport('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a brief business risk assessment for a potential new partner named "${partnerName}". Focus on potential reputational, financial, and integration risks.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setRiskReport(response.text);
        } catch (err) {
            setRiskReport("Error generating risk report.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Partner Hub</h2>
                    <button onClick={() => setRiskModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Partner Vetting</button>
                </div>

                <Card title="Partner Directory">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Tier</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Revenue (YTD)</th></tr></thead>
                        <tbody>{MOCK_PARTNERS.map(p => (<tr key={p.id}>
                            <td className="px-6 py-4 text-white">{p.name}</td>
                            <td className="px-6 py-4">{p.tier}</td>
                            <td className="px-6 py-4"><span className={p.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}>{p.status}</span></td>
                            <td className="px-6 py-4 font-mono text-white">${p.revenueGenerated.toLocaleString()}</td>
                        </tr>))}</tbody>
                    </table>
                </Card>
            </div>
            {isRiskModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setRiskModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Partner Risk Assessment</h3></div>
                        <div className="p-6 space-y-4">
                            <input type="text" value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded text-white" />
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Assessing...' : 'Assess Risk'}</button>
                            <Card title="AI Report"><div className="min-h-[10rem] text-sm text-gray-300 whitespace-pre-line">{isLoading ? '...' : riskReport}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default PartnerHubView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/ecosystem/PartnerHubView.tsx
================================================================================

// components/views/megadashboard/ecosystem/PartnerHubView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

interface Partner {
    id: string;
    name: string;
    tier: 'Platinum' | 'Gold' | 'Silver';
    status: 'Active' | 'Pending Review';
    revenueGenerated: number;
}
const MOCK_PARTNERS: Partner[] = [
    { id: 'p-1', name: 'Quantum Innovations', tier: 'Platinum', status: 'Active', revenueGenerated: 250000 },
    { id: 'p-2', name: 'Cyber Solutions Ltd.', tier: 'Gold', status: 'Active', revenueGenerated: 120000 },
    { id: 'p-3', name: 'NextGen Fintech', tier: 'Silver', status: 'Active', revenueGenerated: 75000 },
    { id: 'p-4', name: 'Future Integrators', tier: 'Silver', status: 'Pending Review', revenueGenerated: 0 },
];

const PartnerHubView: React.FC = () => {
    const [isRiskModalOpen, setRiskModalOpen] = useState(false);
    const [partnerName, setPartnerName] = useState("Future Integrators");
    const [riskReport, setRiskReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setRiskReport('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a brief business risk assessment for a potential new partner named "${partnerName}". Focus on potential reputational, financial, and integration risks.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setRiskReport(response.text);
        } catch (err) {
            setRiskReport("Error generating risk report.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Partner Hub</h2>
                    <button onClick={() => setRiskModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Partner Vetting</button>
                </div>

                <Card title="Partner Directory">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Tier</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Revenue (YTD)</th></tr></thead>
                        <tbody>{MOCK_PARTNERS.map(p => (<tr key={p.id}>
                            <td className="px-6 py-4 text-white">{p.name}</td>
                            <td className="px-6 py-4">{p.tier}</td>
                            <td className="px-6 py-4"><span className={p.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}>{p.status}</span></td>
                            <td className="px-6 py-4 font-mono text-white">${p.revenueGenerated.toLocaleString()}</td>
                        </tr>))}</tbody>
                    </table>
                </Card>
            </div>
            {isRiskModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setRiskModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Partner Risk Assessment</h3></div>
                        <div className="p-6 space-y-4">
                            <input type="text" value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded text-white" />
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Assessing...' : 'Assess Risk'}</button>
                            <Card title="AI Report"><div className="min-h-[10rem] text-sm text-gray-300 whitespace-pre-line">{isLoading ? '...' : riskReport}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default PartnerHubView;
