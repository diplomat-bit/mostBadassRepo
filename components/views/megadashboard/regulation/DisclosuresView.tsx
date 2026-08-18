// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/regulation/DisclosuresView.tsx
================================================================================

// components/views/megadashboard/regulation/DisclosuresView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";

const DisclosuresView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("DisclosuresView must be within DataProvider");
    
    const { disclosures } = context;
    const [isDrafterOpen, setDrafterOpen] = useState(false);
    const [prompt, setPrompt] = useState("A minor data breach affecting 500 users, no PII exposed.");
    const [draft, setDraft] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDraft = async () => {
        setIsLoading(true); setDraft('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const fullPrompt = `You are a legal AI. Draft a concise, professional public disclosure statement for the following event: "${prompt}"`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: fullPrompt});
            setDraft(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Disclosures</h2>
                <button onClick={() => setDrafterOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Disclosure Drafter</button>
            </div>
             <Card title="Regulatory Filings">
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th className="px-6 py-3">Title</th><th className="px-6 py-3">Jurisdiction</th><th className="px-6 py-3">Filing Date</th></tr></thead>
                    <tbody>{disclosures.map(d => <tr key={d.id}><td className="px-6 py-4 text-white">{d.title}</td><td>{d.jurisdiction}</td><td>{d.filingDate}</td></tr>)}</tbody>
                </table>
            </Card>
        </div>
         {isDrafterOpen && (
             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setDrafterOpen(false)}>
                <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Disclosure Drafter</h3></div>
                    <div className="p-6 space-y-4">
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-2 rounded" />
                        <button onClick={handleDraft} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Drafting...' : 'Draft Disclosure'}</button>
                        {draft && <Card title="Generated Draft"><div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line">{draft}</div></Card>}
                    </div>
                </div>
             </div>
        )}
        </>
    );
};

export default DisclosuresView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/regulation/DisclosuresView.tsx
================================================================================

// components/views/megadashboard/regulation/DisclosuresView.tsx
import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";
import classNames from 'classnames';
// Assuming charting library like 'recharts' is available.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { diffWords } from 'diff'; // Assuming 'diff' package is available for text comparison.

// --- Global Type Definitions (Expanded) ---
export interface RegulatoryDisclosure {
    id: string;
    title: string;
    jurisdiction: string;
    filingDate: string; // ISO date string
    status: 'Draft' | 'Pending Legal Review' | 'Pending Compliance Review' | 'Pending Executive Review' | 'Approved' | 'Filed' | 'Rejected';
    type: 'Financial' | 'Environmental' | 'Data Breach' | 'Governance' | 'Product Safety' | 'M&A' | 'Other';
    summary: string;
    fullContent: string;
    lastEditedBy: string;
    lastEditedDate: string; // ISO date string
    version: number;
    associatedRisks: string[]; // IDs of associated risks
    documents: DocumentAttachment[];
    reviewHistory: DisclosureReview[];
    filingScheduleId?: string;
    complianceChecks: ComplianceCheckResult[];
    tags: string[];
    sentimentAnalysis?: SentimentAnalysisResult;
    keywords?: string[];
    audience: 'Public' | 'Regulators' | 'Internal' | 'Investors';
    legalReviewStatus?: 'Not Started' | 'In Progress' | 'Approved' | 'Revisions Required';
    isConfidential: boolean;
    language: string;
    versionHistory?: DisclosureVersion[];
    workflow?: ApprovalWorkflowStep[];
    currentWorkflowStep?: string; // ID of the current step
    evidencePackageId?: string;
}

export interface DisclosureVersion {
    version: number;
    content: string;
    editedBy: string;
    editDate: string;
    changeSummary: string;
}

export interface ApprovalWorkflowStep {
    id: string;
    name: string;
    status: 'Pending' | 'In Progress' | 'Approved' | 'Rejected' | 'Skipped';
    assignedTo: string; // User ID
    completedDate?: string;
    comments?: string;
}

export interface DocumentAttachment {
    id: string;
    name: string;
    url: string;
    type: 'PDF' | 'DOCX' | 'TXT' | 'JSON' | 'CSV' | 'XLSX';
    uploadedBy: string;
    uploadedDate: string; // ISO date string
    description?: string;
    version?: number;
}

export interface DisclosureReview {
    id: string;
    reviewerId: string;
    reviewerName: string;
    reviewDate: string; // ISO date string
    status: 'Approved' | 'Revisions Required' | 'Commented';
    comments: string;
}

export interface ComplianceRule {
    id: string;
    name: string;
    description: string;
    jurisdiction: string;
    effectiveDate: string; // ISO date string
    ruleText: string;
    categories: string[]; // e.g., ['Data Privacy', 'Financial Reporting']
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    referenceUrl?: string;
    lastUpdated: string;
    version: number;
}

export interface ComplianceCheckResult {
    ruleId: string;
    ruleName: string;
    status: 'Pass' | 'Fail' | 'Warning' | 'Not Applicable';
    details: string;
    checkedDate: string; // ISO date string
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    automated: boolean;
}

export interface Risk {
    id: string;
    name: string;
    description: string;
    category: 'Operational' | 'Financial' | 'Compliance' | 'Strategic' | 'Reputational';
    likelihood: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High' | 'Critical';
    mitigationStrategy: string;
    status: 'Active' | 'Mitigated' | 'Closed';
    lastUpdated: string; // ISO date string
    relatedRegulations?: string[]; // IDs of related regulations/rules
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Legal' | 'Compliance' | 'Editor' | 'Viewer' | 'Executive';
    department: string;
}

export interface FilingSchedule {
    id: string;
    disclosureId: string;
    title: string;
    deadline: string; // ISO date string
    jurisdiction: string;
    status: 'Upcoming' | 'Submitted' | 'Overdue';
    remindersSent: number;
    assignedTo: string; // User ID
    notes?: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string; // ISO date string
    userId: string;
    userName: string;
    action: string; // e.g., 'CREATED', 'UPDATED', 'DELETED', 'REVIEWED', 'FILED'
    entityType: 'Disclosure' | 'ComplianceRule' | 'FilingSchedule' | 'Document' | 'Risk';
    entityId: string;
    details: string;
    previousValue?: any;
    newValue?: any;
}

export interface AIMetadata {
    model: string;
    temperature: number;
    timestamp: string;
    promptTokens: number;
    completionTokens: number;
    responseId: string;
}

export interface SentimentAnalysisResult {
    overallSentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
    confidence: number;
    breakdown?: {
        positive: number;
        negative: number;
        neutral: number;
    };
    keywords?: { text: string; sentiment: 'Positive' | 'Negative' | 'Neutral' }[];
}

export interface TranslationResult {
    originalText: string;
    translatedText: string;
    targetLanguage: string;
    sourceLanguage: string;
    aiMetadata: AIMetadata;
}

// --- Mock Data (Expanded for demonstration) ---
const MOCK_USERS: UserProfile[] = [
    { id: 'usr_001', name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', department: 'Executive' },
    { id: 'usr_002', name: 'Bob Johnson', email: 'bob@example.com', role: 'Legal', department: 'Legal' },
    { id: 'usr_003', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Compliance', department: 'Compliance' },
    { id: 'usr_004', name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', department: 'PR' },
    { id: 'usr_005', name: 'Ethan Hunt', email: 'ethan@example.com', role: 'Executive', department: 'Executive' },
];

const MOCK_RISKS: Risk[] = [
    {
        id: 'risk_001', name: 'GDPR Non-Compliance', description: 'Potential fines and reputational damage from GDPR violations.',
        category: 'Compliance', likelihood: 'Medium', impact: 'High', mitigationStrategy: 'Regular audits, employee training, robust data protection measures.',
        status: 'Active', lastUpdated: '2023-10-26T10:00:00Z', relatedRegulations: ['GDPR', 'CCPA']
    },
    {
        id: 'risk_002', name: 'Supply Chain Disruption', description: 'Interruption of critical supplies due to geopolitical events or natural disasters.',
        category: 'Operational', likelihood: 'Low', impact: 'Medium', mitigationStrategy: 'Diversify suppliers, maintain buffer inventory, contingency planning.',
        status: 'Active', lastUpdated: '2023-09-15T14:30:00Z'
    },
    {
        id: 'risk_003', name: 'Cybersecurity Breach', description: 'Unauthorized access to sensitive customer data leading to significant financial and reputational loss.',
        category: 'Reputational', likelihood: 'Medium', impact: 'Critical', mitigationStrategy: 'Enhanced cybersecurity measures, multi-factor authentication, regular penetration testing, and a comprehensive incident response plan.',
        status: 'Active', lastUpdated: '2023-11-01T09:00:00Z'
    }
];

const MOCK_COMPLIANCE_RULES: ComplianceRule[] = [
    {
        id: 'rule_gdpr', name: 'GDPR Article 33', description: 'Notification of a personal data breach to the supervisory authority.',
        jurisdiction: 'EU', effectiveDate: '2018-05-25', ruleText: 'In the case of a personal data breach, the controller shall without undue delay and, where feasible, not later than 72 hours after having become aware of it, notify the personal data breach to the supervisory authority competent in accordance with Article 55...',
        categories: ['Data Breach', 'Data Privacy'], severity: 'Critical', referenceUrl: 'https://gdpr-info.eu/art-33-gdpr/', lastUpdated: '2023-01-01T00:00:00Z', version: 1
    },
    {
        id: 'rule_sec_10b', name: 'SEC Rule 10b-5', description: 'Prohibits any act or omission resulting in fraud or deceit in connection with the purchase or sale of any security.',
        jurisdiction: 'US', effectiveDate: '1942-05-21', ruleText: 'It shall be unlawful for any person, directly or indirectly, by the use of any means or instrumentality of interstate commerce...',
        categories: ['Financial', 'Securities', 'M&A'], severity: 'Critical', referenceUrl: 'https://www.sec.gov/rules/final/34-32304.txt', lastUpdated: '2023-01-01T00:00:00Z', version: 1
    },
    {
        id: 'rule_esg_csrd', name: 'CSRD (Corporate Sustainability Reporting Directive)', description: 'Requires companies to report on sustainability matters.',
        jurisdiction: 'EU', effectiveDate: '2024-01-01', ruleText: 'Companies subject to the CSRD will have to report according to European Sustainability Reporting Standards (ESRS).',
        categories: ['Environmental', 'Governance'], severity: 'High', referenceUrl: 'https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en', lastUpdated: '2023-05-01T00:00:00Z', version: 1
    }
];

const MOCK_DISCLOSURES: RegulatoryDisclosure[] = [
    {
        id: 'disc_001', title: 'Q3 2023 Earnings Report', jurisdiction: 'SEC (US)', filingDate: '2023-11-15', status: 'Filed',
        type: 'Financial', summary: 'Quarterly financial performance disclosure, beating EPS estimates by 5%.', fullContent: 'Detailed financial statements, management discussion and analysis...',
        lastEditedBy: 'Alice Smith', lastEditedDate: '2023-11-14T18:00:00Z', version: 3, associatedRisks: [], documents: [], reviewHistory: [], complianceChecks: [], tags: ['Earnings', 'Financial'], audience: 'Investors', isConfidential: false, language: 'en',
        versionHistory: [
            { version: 1, content: 'Initial draft...', editedBy: 'Diana Prince', editDate: '2023-11-10T10:00:00Z', changeSummary: 'Initial draft based on preliminary numbers.' },
            { version: 2, content: 'Revised financials...', editedBy: 'Alice Smith', editDate: '2023-11-12T15:00:00Z', changeSummary: 'Updated with final financial figures.' },
            { version: 3, content: 'Detailed financial statements, management discussion and analysis...', editedBy: 'Bob Johnson', editDate: '2023-11-14T17:00:00Z', changeSummary: 'Legal review and final sign-off.' }
        ]
    },
    {
        id: 'disc_002', title: 'Minor Data Breach Notification', jurisdiction: 'ICO (UK)', filingDate: '2023-10-20', status: 'Approved',
        type: 'Data Breach', summary: 'Notification to ICO regarding a minor data breach affecting 500 users, no PII exposed.', fullContent: 'On October 18, 2023, we identified unauthorized access to a non-sensitive internal database...',
        lastEditedBy: 'Bob Johnson', lastEditedDate: '2023-10-19T10:30:00Z', version: 2, associatedRisks: ['risk_001', 'risk_003'], documents: [], reviewHistory: [],
        complianceChecks: [{
            ruleId: 'rule_gdpr', ruleName: 'GDPR Article 33', status: 'Pass', details: 'Breach reported within 72 hours. No high risk to data subjects.',
            checkedDate: '2023-10-19T11:00:00Z', severity: 'High', automated: true
        }],
        tags: ['Data Breach', 'GDPR'], sentimentAnalysis: { overallSentiment: 'Neutral', confidence: 0.8 }, keywords: ['data breach', 'notification', 'ICO'], audience: 'Regulators', legalReviewStatus: 'Approved', isConfidential: false, language: 'en',
        workflow: [
            { id: 'wf1', name: 'Drafting', status: 'Approved', assignedTo: 'usr_004', completedDate: '2023-10-18T12:00:00Z' },
            { id: 'wf2', name: 'Legal Review', status: 'Approved', assignedTo: 'usr_002', completedDate: '2023-10-19T10:00:00Z' },
            { id: 'wf3', name: 'Compliance Review', status: 'Approved', assignedTo: 'usr_003', completedDate: '2023-10-19T14:00:00Z' },
            { id: 'wf4', name: 'Executive Review', status: 'Pending', assignedTo: 'usr_005' },
        ],
        currentWorkflowStep: 'wf4'
    },
    {
        id: 'disc_003', title: 'Environmental Impact Statement for New Plant', jurisdiction: 'EPA (US)', filingDate: '2024-03-01', status: 'Draft',
        type: 'Environmental', summary: 'Draft statement assessing environmental impact of proposed new manufacturing plant.', fullContent: 'This document details the potential environmental effects, proposed mitigation strategies, and compliance with local and federal environmental regulations...',
        lastEditedBy: 'Charlie Brown', lastEditedDate: '2023-12-01T14:00:00Z', version: 1, associatedRisks: ['risk_002'], documents: [], reviewHistory: [], complianceChecks: [], tags: ['Environment', 'EPA', 'ESG'], audience: 'Public', isConfidential: false, language: 'en',
    }
];

// --- Utility Functions ---
export const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
export const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
export const generateUniqueId = (prefix: string = 'id_') => `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
export const getStatusColorClass = (status: string) => {
    switch (status) {
        case 'Approved': case 'Filed': case 'Pass': case 'Mitigated': case 'Submitted': return 'text-green-400';
        case 'Pending Review': case 'Pending Legal Review': case 'Pending Compliance Review': case 'Pending Executive Review': case 'Warning': case 'Upcoming': return 'text-yellow-400';
        case 'Rejected': case 'Fail': case 'Overdue': case 'Critical': case 'Revisions Required': return 'text-red-400';
        case 'Draft': case 'In Progress': default: return 'text-blue-400';
    }
};
export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

// --- AI Service Wrapper (Expanded) ---
export class AIComplianceService {
    private genAI: GoogleGenAI;
    private apiKey: string;
    private defaultModel: string;

    constructor(apiKey: string, defaultModel: string = 'gemini-1.5-flash') {
        if (!apiKey) throw new Error("API Key for Google GenAI is not provided.");
        this.apiKey = apiKey;
        this.genAI = new GoogleGenAI({ apiKey });
        this.defaultModel = defaultModel;
    }

    private async generateContent(prompt: string, model: string = this.defaultModel): Promise<string> {
        try {
            const aiModel = this.genAI.getGenerativeModel({ model });
            const result = await aiModel.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error(`Error calling AI model ${model}:`, error);
            throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async draftDisclosure(eventDescription: string, tone: string = 'Professional', targetAudience: string = 'General Public', guidelines: string = ''): Promise<{ draft: string; aiMetadata: AIMetadata }> {
        const prompt = `You are a legal and public relations AI. Draft a concise, professional public disclosure statement for the following event: "${eventDescription}".
        Target audience: ${targetAudience}. Tone: ${tone}. Adhere to these additional guidelines if provided: ${guidelines}.
        The output should be the disclosure text only.`;
        const startTime = Date.now();
        const responseText = await this.generateContent(prompt);
        const aiMetadata: AIMetadata = { model: this.defaultModel, temperature: 0.7, timestamp: new Date().toISOString(), promptTokens: Math.ceil(prompt.length / 4), completionTokens: Math.ceil(responseText.length / 4), responseId: generateUniqueId('aires_') };
        return { draft: responseText, aiMetadata };
    }

    public async analyzeSentiment(text: string): Promise<{ result: SentimentAnalysisResult; aiMetadata: AIMetadata }> {
        const prompt = `Analyze the sentiment of the following text and provide a JSON object with overallSentiment (Positive, Negative, Neutral, Mixed), confidence (0-1), and optionally breakdown for positive/negative/neutral percentages and relevant keywords with their sentiment. Text: "${text}"`;
        const responseText = await this.generateContent(prompt, 'gemini-1.5-pro');
        const aiMetadata: AIMetadata = { model: 'gemini-1.5-pro', temperature: 0.2, timestamp: new Date().toISOString(), promptTokens: Math.ceil(prompt.length / 4), completionTokens: Math.ceil(responseText.length / 4), responseId: generateUniqueId('aisent_') };
        try {
            const result = JSON.parse(responseText);
            if (!result.overallSentiment || !result.confidence) throw new Error("Invalid sentiment analysis response structure.");
            return { result, aiMetadata };
        } catch (e) {
            console.warn("AI sentiment analysis returned non-JSON, returning default.", e);
            return { result: { overallSentiment: 'Neutral', confidence: 0.5 }, aiMetadata };
        }
    }

    public async performComplianceCheck(disclosureContent: string, rules: ComplianceRule[]): Promise<{ checks: ComplianceCheckResult[]; aiMetadata: AIMetadata }> {
        const rulePrompts = rules.map(rule => `- Rule Name: ${rule.name}\n  Rule ID: ${rule.id}\n  Rule Text: ${rule.ruleText}\n  Severity: ${rule.severity}`).join('\n');
        const prompt = `You are an expert compliance AI. Review the following disclosure content against the provided compliance rules.
        For each rule, determine if the disclosure content 'Passes', 'Fails', or has a 'Warning'. Provide details for each check.
        Respond with a JSON array of objects, each containing ruleId, ruleName, status ('Pass'|'Fail'|'Warning'), details, and severity.
        Disclosure Content: "${disclosureContent}"
        Compliance Rules to check: ${rulePrompts}`;
        const responseText = await this.generateContent(prompt, 'gemini-1.5-pro');
        const aiMetadata: AIMetadata = { model: 'gemini-1.5-pro', temperature: 0.3, timestamp: new Date().toISOString(), promptTokens: Math.ceil(prompt.length / 4), completionTokens: Math.ceil(responseText.length / 4), responseId: generateUniqueId('aicompl_') };
        try {
            const checks: ComplianceCheckResult[] = JSON.parse(responseText).map((check: any) => ({ ...check, checkedDate: new Date().toISOString(), automated: true }));
            if (!Array.isArray(checks) || !checks.every(c => c.ruleId && c.status)) throw new Error("Invalid compliance check response structure.");
            return { checks, aiMetadata };
        } catch (e) {
            console.warn("AI compliance check returned non-JSON, returning defaults.", e);
            return { checks: rules.map(r => ({ ruleId: r.id, ruleName: r.name, status: 'Warning', details: 'AI check failed. Manual review required.', checkedDate: new Date().toISOString(), severity: r.severity, automated: true })), aiMetadata };
        }
    }

    public async translateDisclosure(text: string, targetLanguage: string): Promise<{ result: TranslationResult; aiMetadata: AIMetadata }> {
        const prompt = `Translate the following text into ${targetLanguage}. Provide the original text, translated text, target language, and source language in a JSON object. Text: "${text}"`;
        const responseText = await this.generateContent(prompt);
        const aiMetadata: AIMetadata = { model: this.defaultModel, temperature: 0.5, timestamp: new Date().toISOString(), promptTokens: Math.ceil(prompt.length / 4), completionTokens: Math.ceil(responseText.length / 4), responseId: generateUniqueId('aitrans_') };
        try {
            const result: TranslationResult = JSON.parse(responseText);
            if (!result.translatedText || !result.targetLanguage) throw new Error("Invalid translation response structure.");
            return { result, aiMetadata };
        } catch (e) {
            console.warn("AI translation failed, returning original text.", e);
            return { result: { originalText: text, translatedText: `[Translation to ${targetLanguage} failed.]`, targetLanguage, sourceLanguage: 'en', aiMetadata }, aiMetadata };
        }
    }

    public async summarizeDocument(documentContent: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<{ summary: string; aiMetadata: AIMetadata }> {
        const prompt = `Summarize the following document content. The summary should be ${length}. Document Content: "${documentContent}"`;
        const responseText = await this.generateContent(prompt, 'gemini-1.5-pro');
        const aiMetadata: AIMetadata = { model: 'gemini-1.5-pro', temperature: 0.4, timestamp: new Date().toISOString(), promptTokens: Math.ceil(prompt.length / 4), completionTokens: Math.ceil(responseText.length / 4), responseId: generateUniqueId('aisum_') };
        return { summary: responseText, aiMetadata };
    }

    public async generateFAQ(disclosureContent: string): Promise<{ faq: { question: string, answer: string }[]; aiMetadata: AIMetadata }> {
        const prompt = `Based on the following public disclosure, generate a list of 5 frequently asked questions (FAQs) and their answers. The answers should be concise and directly address the questions. Return the result as a JSON array of objects, each with a "question" and "answer" key. Disclosure: "${disclosureContent}"`;
        const responseText = await this.generateContent(prompt, 'gemini-1.5-pro');
        const aiMetadata: AIMetadata = { model: 'gemini-1.5-pro', temperature: 0.6, timestamp: new Date().toISOString(), promptTokens: Math.ceil(prompt.length / 4), completionTokens: Math.ceil(responseText.length / 4), responseId: generateUniqueId('aifaq_') };
        try {
            const faq = JSON.parse(responseText);
            if (!Array.isArray(faq) || !faq.every(item => item.question && item.answer)) throw new Error("Invalid FAQ response structure.");
            return { faq, aiMetadata };
        } catch (e) {
            console.warn("AI FAQ generation failed, returning empty.", e);
            return { faq: [], aiMetadata };
        }
    }

    public async compareVersions(contentA: string, contentB: string): Promise<{ summary: string; aiMetadata: AIMetadata }> {
        const prompt = `Analyze the differences between the two versions of this document and provide a concise, natural language summary of the key changes.
        Version A: "${contentA}"
        Version B: "${contentB}"`;
        const responseText = await this.generateContent(prompt, 'gemini-1.5-pro');
        const aiMetadata: AIMetadata = { model: 'gemini-1.5-pro', temperature: 0.4, timestamp: new Date().toISOString(), promptTokens: Math.ceil(prompt.length / 4), completionTokens: Math.ceil(responseText.length / 4), responseId: generateUniqueId('aidiff_') };
        return { summary: responseText, aiMetadata };
    }
}

// --- Custom Hooks ---
export const useDisclosureManagement = (initialDisclosures: RegulatoryDisclosure[], initialUsers: UserProfile[]) => {
    const [disclosures, setDisclosures] = useState<RegulatoryDisclosure[]>(initialDisclosures);
    const [selectedDisclosure, setSelectedDisclosure] = useState<RegulatoryDisclosure | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterType, setFilterType] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const disclosuresPerPage = 10;
    const allUsers = initialUsers;

    const filteredDisclosures = useMemo(() => {
        let filtered = disclosures;
        if (searchTerm) {
            filtered = filtered.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.summary.toLowerCase().includes(searchTerm.toLowerCase()) || d.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
        }
        if (filterStatus !== 'All') filtered = filtered.filter(d => d.status === filterStatus);
        if (filterType !== 'All') filtered = filtered.filter(d => d.type === filterType);
        return filtered.sort((a, b) => new Date(b.lastEditedDate).getTime() - new Date(a.lastEditedDate).getTime());
    }, [disclosures, searchTerm, filterStatus, filterType]);

    const paginatedDisclosures = useMemo(() => {
        const startIndex = (currentPage - 1) * disclosuresPerPage;
        return filteredDisclosures.slice(startIndex, startIndex + disclosuresPerPage);
    }, [filteredDisclosures, currentPage, disclosuresPerPage]);

    const totalPages = useMemo(() => Math.ceil(filteredDisclosures.length / disclosuresPerPage), [filteredDisclosures, disclosuresPerPage]);

    const addDisclosure = useCallback((newDisclosure: RegulatoryDisclosure) => {
        setDisclosures(prev => [newDisclosure, ...prev]);
        setSelectedDisclosure(newDisclosure);
        setIsAdding(false);
    }, []);

    const updateDisclosure = useCallback((updatedDisclosure: RegulatoryDisclosure) => {
        setDisclosures(prev => prev.map(d => d.id === updatedDisclosure.id ? updatedDisclosure : d));
        if (selectedDisclosure?.id === updatedDisclosure.id) {
            setSelectedDisclosure(updatedDisclosure);
        }
        setIsEditing(false);
    }, [selectedDisclosure]);

    const deleteDisclosure = useCallback((id: string) => {
        setDisclosures(prev => prev.filter(d => d.id !== id));
        setSelectedDisclosure(null);
    }, []);

    return { disclosures, filteredDisclosures, paginatedDisclosures, selectedDisclosure, setSelectedDisclosure, isEditing, setIsEditing, isAdding, setIsAdding, searchTerm, setSearchTerm, filterStatus, setFilterStatus, filterType, setFilterType, currentPage, setCurrentPage, totalPages, addDisclosure, updateDisclosure, deleteDisclosure, allUsers };
};

export const useAuditLog = (initialLogs: AuditLogEntry[]) => {
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialLogs);
    const addLogEntry = useCallback((entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
        const newLog: AuditLogEntry = { id: generateUniqueId('log_'), timestamp: new Date().toISOString(), ...entry };
        setAuditLogs(prev => [newLog, ...prev]);
    }, []);
    return { auditLogs, addLogEntry };
};

// --- Generic UI Components ---
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; className?: string }> = ({ isOpen, onClose, title, children, className }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className={classNames("bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col", className)} onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center"><h3 className="text-lg font-semibold text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button></div>
                <div className="p-6 flex-grow overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};
export const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; placeholder?: string; required?: boolean; rows?: number }> = ({ label, id, value, onChange, type = 'text', placeholder, required = false, rows = 3 }) => (
    <div className="flex flex-col"><label htmlFor={id} className="text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>{type === 'textarea' ? <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows} className="w-full bg-gray-700/50 p-2 rounded text-white border border-gray-600 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50" /> : <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full bg-gray-700/50 p-2 rounded text-white border border-gray-600 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50" />}</div>
);
export const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[]; required?: boolean }> = ({ label, id, value, onChange, options, required = false }) => (
    <div className="flex flex-col"><label htmlFor={id} className="text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-500">*</span>}</label><select id={id} value={value} onChange={onChange} required={required} className="w-full bg-gray-700/50 p-2 rounded text-white border border-gray-600 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50">{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
);
export const CheckboxField: React.FC<{ label: string; id: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, id, checked, onChange }) => (
    <div className="flex items-center space-x-2"><input type="checkbox" id={id} checked={checked} onChange={onChange} className="h-4 w-4 text-cyan-600 rounded border-gray-600 bg-gray-700/50 focus:ring-cyan-500" /><label htmlFor={id} className="text-sm text-gray-300">{label}</label></div>
);
export const Button: React.FC<{ onClick: React.MouseEventHandler<HTMLButtonElement>; children: React.ReactNode; primary?: boolean; disabled?: boolean; className?: string }> = ({ onClick, children, primary = true, disabled = false, className }) => (
    <button onClick={onClick} disabled={disabled} className={classNames("px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200", primary ? "bg-cyan-600 hover:bg-cyan-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600", disabled ? "opacity-50 cursor-not-allowed" : "", className)}>{children}</button>
);
export const Tabs: React.FC<{ tabs: { id: string; label: string; content: React.ReactNode }[]; activeTab: string; onChange: (tabId: string) => void }> = ({ tabs, activeTab, onChange }) => (
    <div><div className="border-b border-gray-700"><nav className="-mb-px flex space-x-8" aria-label="Tabs">{tabs.map(tab => <button key={tab.id} onClick={() => onChange(tab.id)} className={classNames(activeTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200')} aria-current={activeTab === tab.id ? 'page' : undefined}>{tab.label}</button>)}</nav></div><div className="pt-4">{tabs.find(tab => tab.id === activeTab)?.content}</div></div>
);

// --- Disclosure Sub-Components ---
export const DisclosureForm: React.FC<{
    disclosure: RegulatoryDisclosure;
    onChange: (field: keyof RegulatoryDisclosure, value: any) => void;
    onSave: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    isNew?: boolean;
    users: UserProfile[];
    risks: Risk[];
    auditLoggers: { addLogEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void; };
}> = ({ disclosure, onChange, onSave, onCancel, isLoading = false, isNew = false, users, risks, auditLoggers }) => {
    const { addLogEntry } = auditLoggers;
    const handleSave = () => { onSave(); addLogEntry({ userId: 'usr_001', userName: 'Alice Smith', action: isNew ? 'CREATED' : 'UPDATED', entityType: 'Disclosure', entityId: disclosure.id, details: isNew ? `Created new disclosure: ${disclosure.title}` : `Updated disclosure: ${disclosure.title}`, newValue: disclosure }); };
    const statusOptions = ['Draft', 'Pending Legal Review', 'Pending Compliance Review', 'Pending Executive Review', 'Approved', 'Filed', 'Rejected'].map(s => ({ value: s, label: s }));
    const typeOptions = ['Financial', 'Environmental', 'Data Breach', 'Governance', 'Product Safety', 'M&A', 'Other'].map(t => ({ value: t, label: t }));
    const audienceOptions = ['Public', 'Regulators', 'Internal', 'Investors'].map(a => ({ value: a, label: a }));
    const legalReviewOptions = ['Not Started', 'In Progress', 'Approved', 'Revisions Required'].map(s => ({ value: s, label: s }));
    const languageOptions = [{ value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' }];
    const selectedRiskIds = disclosure.associatedRisks || [];
    const handleRiskChange = (riskId: string, isChecked: boolean) => {
        let newRisks = new Set(selectedRiskIds);
        isChecked ? newRisks.add(riskId) : newRisks.delete(riskId);
        onChange('associatedRisks', Array.from(newRisks));
    };
    return (
        <div className="space-y-4">
            <InputField label="Title" id="title" value={disclosure.title} onChange={e => onChange('title', e.target.value)} required />
            <InputField label="Jurisdiction" id="jurisdiction" value={disclosure.jurisdiction} onChange={e => onChange('jurisdiction', e.target.value)} required />
            <InputField label="Filing Date" id="filingDate" type="date" value={disclosure.filingDate ? disclosure.filingDate.split('T')[0] : ''} onChange={e => onChange('filingDate', e.target.value)} />
            <SelectField label="Status" id="status" value={disclosure.status} onChange={e => onChange('status', e.target.value)} options={statusOptions} />
            <SelectField label="Type" id="type" value={disclosure.type} onChange={e => onChange('type', e.target.value)} options={typeOptions} />
            <SelectField label="Audience" id="audience" value={disclosure.audience} onChange={e => onChange('audience', e.target.value)} options={audienceOptions} />
            <SelectField label="Legal Review Status" id="legalReviewStatus" value={disclosure.legalReviewStatus || 'Not Started'} onChange={e => onChange('legalReviewStatus', e.target.value)} options={legalReviewOptions} />
            <SelectField label="Language" id="language" value={disclosure.language} onChange={e => onChange('language', e.target.value)} options={languageOptions} />
            <InputField label="Summary" id="summary" type="textarea" value={disclosure.summary} onChange={e => onChange('summary', e.target.value)} rows={4} />
            <InputField label="Full Content" id="fullContent" type="textarea" value={disclosure.fullContent} onChange={e => onChange('fullContent', e.target.value)} rows={10} required />
            <InputField label="Tags (comma-separated)" id="tags" value={disclosure.tags.join(', ')} onChange={e => onChange('tags', e.target.value.split(',').map(tag => tag.trim()))} placeholder="e.g., Financial, ESG, Data Breach" />
            <CheckboxField label="Confidential" id="isConfidential" checked={disclosure.isConfidential} onChange={e => onChange('isConfidential', e.target.checked)} />
            <div>
                <h4 className="text-md font-semibold text-gray-300 mb-2">Associated Risks</h4>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">{risks.map(risk => <CheckboxField key={risk.id} id={`risk-${risk.id}`} label={risk.name} checked={selectedRiskIds.includes(risk.id)} onChange={(e) => handleRiskChange(risk.id, e.target.checked)} />)}</div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
                <Button onClick={onCancel} primary={false}>Cancel</Button>
                <Button onClick={handleSave} disabled={isLoading || !disclosure.title || !disclosure.fullContent}>{isLoading ? (isNew ? 'Adding...' : 'Saving...') : (isNew ? 'Add Disclosure' : 'Save Changes')}</Button>
            </div>
        </div>
    );
};

export const DisclosureDetails: React.FC<{
    disclosure: RegulatoryDisclosure;
    onEdit: () => void;
    onDelete: (id: string) => void;
    onUpdateStatus: (id: string, newStatus: RegulatoryDisclosure['status']) => void;
    aiService: AIComplianceService;
    onUpdateDisclosure: (updatedDisc: RegulatoryDisclosure) => void;
    complianceRules: ComplianceRule[];
    users: UserProfile[];
    auditLoggers: { addLogEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void; };
}> = ({ disclosure, onEdit, onDelete, onUpdateStatus, aiService, onUpdateDisclosure, complianceRules, users, auditLoggers }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedContent, setTranslatedContent] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('es');
    const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);
    const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
    const [isGeneratingFAQ, setIsGeneratingFAQ] = useState(false);
    const [faq, setFaq] = useState<{ question: string; answer: string }[]>([]);
    const { addLogEntry } = auditLoggers;

    const handleUpdateStatus = (newStatus: RegulatoryDisclosure['status']) => {
        onUpdateStatus(disclosure.id, newStatus);
        addLogEntry({ userId: 'usr_001', userName: 'Alice Smith', action: 'STATUS_UPDATE', entityType: 'Disclosure', entityId: disclosure.id, details: `Updated status of disclosure '${disclosure.title}' to ${newStatus}`, previousValue: disclosure.status, newValue: newStatus });
    };
    const handleTranslate = async () => {
        setIsTranslating(true); setTranslatedContent('');
        try { const { result, aiMetadata } = await aiService.translateDisclosure(disclosure.fullContent, targetLanguage); setTranslatedContent(result.translatedText); addLogEntry({ userId: 'usr_001', userName: 'Alice Smith', action: 'AI_TRANSLATION', entityType: 'Disclosure', entityId: disclosure.id, details: `Translated to ${targetLanguage}`, newValue: { aiMetadata } });
        } catch (error) { console.error("Translation failed:", error); setTranslatedContent("Translation failed."); } finally { setIsTranslating(false); }
    };
    const handlePerformComplianceCheck = async () => {
        setIsCheckingCompliance(true);
        try { const rulesToCheck = complianceRules.filter(rule => disclosure.tags.some(tag => rule.categories.includes(tag))); if (rulesToCheck.length === 0) { alert('No relevant compliance rules found based on tags.'); return; } const { checks, aiMetadata } = await aiService.performComplianceCheck(disclosure.fullContent, rulesToCheck); onUpdateDisclosure({ ...disclosure, complianceChecks: checks }); addLogEntry({ userId: 'usr_001', userName: 'Alice Smith', action: 'AI_COMPLIANCE_CHECK', entityType: 'Disclosure', entityId: disclosure.id, details: `Performed AI compliance check`, newValue: { aiMetadata } });
        } catch (error) { console.error("Compliance check failed:", error); alert("Failed to perform compliance check."); } finally { setIsCheckingCompliance(false); }
    };
    const handleAnalyzeSentiment = async () => {
        setIsAnalyzingSentiment(true);
        try { const { result, aiMetadata } = await aiService.analyzeSentiment(disclosure.fullContent); onUpdateDisclosure({ ...disclosure, sentimentAnalysis: result }); addLogEntry({ userId: 'usr_001', userName: 'Alice Smith', action: 'AI_SENTIMENT_ANALYSIS', entityType: 'Disclosure', entityId: disclosure.id, details: `Performed AI sentiment analysis`, newValue: { aiMetadata } });
        } catch (error) { console.error("Sentiment analysis failed:", error); alert("Failed to perform sentiment analysis."); } finally { setIsAnalyzingSentiment(false); }
    };
    const handleGenerateFAQ = async () => {
        setIsGeneratingFAQ(true); setFaq([]);
        try { const { faq: generatedFaq, aiMetadata } = await aiService.generateFAQ(disclosure.fullContent); setFaq(generatedFaq); addLogEntry({ userId: 'usr_001', userName: 'Alice Smith', action: 'AI_FAQ_GENERATION', entityType: 'Disclosure', entityId: disclosure.id, details: `Generated FAQs`, newValue: { aiMetadata } });
        } catch (error) { console.error("FAQ generation failed:", error); alert("Failed to generate FAQs."); } finally { setIsGeneratingFAQ(false); }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', content: (
            <div className="space-y-3 text-gray-300 text-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <p><strong>Type:</strong> {disclosure.type}</p>
                    <p><strong>Jurisdiction:</strong> {disclosure.jurisdiction}</p>
                    <p><strong>Filing Date:</strong> {formatDate(disclosure.filingDate)}</p>
                    <p><strong>Status:</strong> <span className={getStatusColorClass(disclosure.status)}>{disclosure.status}</span></p>
                    <p><strong>Audience:</strong> {disclosure.audience}</p>
                    <p><strong>Confidential:</strong> {disclosure.isConfidential ? 'Yes' : 'No'}</p>
                </div>
                <p><strong>Last Edited:</strong> {disclosure.lastEditedBy} on {formatDateTime(disclosure.lastEditedDate)} (v{disclosure.version})</p>
                <p><strong>Tags:</strong> <span className="flex flex-wrap gap-1 mt-1">{disclosure.tags.map(t => <span key={t} className="bg-gray-600 text-xs px-2 py-1 rounded-full">{t}</span>)}</span></p>
                <div className="mt-4 p-3 bg-gray-700/50 rounded-md"><h4 className="font-semibold text-white mb-2">Summary</h4><p>{disclosure.summary}</p></div>
                <div className="mt-4 p-3 bg-gray-700/50 rounded-md"><h4 className="font-semibold text-white mb-2">Full Content</h4><pre className="whitespace-pre-wrap font-sans text-gray-200">{disclosure.fullContent}</pre></div>
            </div>
        )},
        { id: 'workflow', label: 'Workflow', content: disclosure.workflow ? <WorkflowVisualizer workflow={disclosure.workflow} users={users} /> : <p className="text-gray-400">No workflow defined.</p> },
        { id: 'compliance', label: 'Compliance', content: (
            <div className="space-y-4">
                <Button onClick={handlePerformComplianceCheck} disabled={isCheckingCompliance}>{isCheckingCompliance ? 'Checking...' : 'Run AI Compliance Check'}</Button>
                {disclosure.complianceChecks?.length > 0 ? <div className="space-y-2">{disclosure.complianceChecks.map((check, idx) => <div key={idx} className="p-3 bg-gray-700/50 rounded-md"><p className="text-white text-md font-semibold">{check.ruleName} (<span className={getStatusColorClass(check.status)}>{check.status}</span>)</p><p className="text-gray-400 text-sm">Severity: {check.severity} | Checked: {formatDateTime(check.checkedDate)}</p><p className="text-gray-300 text-sm mt-1">{check.details}</p></div>)}</div> : <p className="text-gray-400">No compliance checks performed.</p>}
            </div>
        )},
        { id: 'version_history', label: 'Version History', content: disclosure.versionHistory ? <VersionHistoryViewer versions={disclosure.versionHistory} aiService={aiService} /> : <p className="text-gray-400">No version history.</p> },
        { id: 'ai_tools', label: 'AI Tools', content: (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sentiment Analysis */}
                    <div><h4 className="font-semibold text-white mb-2">Sentiment Analysis</h4><Button onClick={handleAnalyzeSentiment} disabled={isAnalyzingSentiment}>{isAnalyzingSentiment ? 'Analyzing...' : 'Run AI Sentiment Analysis'}</Button>
                    {disclosure.sentimentAnalysis && <div className="mt-2 p-3 bg-gray-700/50 rounded-md text-gray-300"><p><strong>Overall:</strong> <span className={getStatusColorClass(disclosure.sentimentAnalysis.overallSentiment === 'Positive' ? 'Approved' : disclosure.sentimentAnalysis.overallSentiment === 'Negative' ? 'Rejected' : 'Draft')}>{disclosure.sentimentAnalysis.overallSentiment}</span> ({(disclosure.sentimentAnalysis.confidence * 100).toFixed(0)}%)</p></div>}</div>
                    {/* FAQ Generation */}
                    <div><h4 className="font-semibold text-white mb-2">FAQ Generation</h4><Button onClick={handleGenerateFAQ} disabled={isGeneratingFAQ}>{isGeneratingFAQ ? 'Generating...' : 'Generate FAQs'}</Button>
                    {faq.length > 0 && <div className="mt-2 p-3 bg-gray-700/50 rounded-md space-y-2 max-h-60 overflow-y-auto">{faq.map((item, i) => <div key={i}><p className="font-semibold text-white">{item.question}</p><p className="text-sm text-gray-300">{item.answer}</p></div>)}</div>}</div>
                </div>
                {/* Translation */}
                <div><h4 className="font-semibold text-white mb-2">Translation</h4><div className="flex items-end space-x-2"><SelectField label="" id="targetLanguage" value={targetLanguage} onChange={e => setTargetLanguage(e.target.value)} options={[{ value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' }, { value: 'de', label: 'German' }]} /><Button onClick={handleTranslate} disabled={isTranslating}>{isTranslating ? 'Translating...' : 'Translate'}</Button></div>{translatedContent && <Card title={`Translated Content (${targetLanguage})`}><div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line">{translatedContent}</div></Card>}</div>
            </div>
        )},
        { id: 'audit', label: 'Audit Log', content: <AuditLogTable filterEntityId={disclosure.id} filterEntityType="Disclosure" /> },
    ];

    return (
        <Card title={disclosure.title} className="p-0">
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
                <div className="flex space-x-2"><Button onClick={onEdit}>Edit</Button><Button onClick={() => onDelete(disclosure.id)} primary={false} className="bg-red-700 hover:bg-red-800 border-red-700">Delete</Button></div>
                <div className="flex space-x-2"><SelectField label="" id="status-update" value={disclosure.status} onChange={e => handleUpdateStatus(e.target.value as RegulatoryDisclosure['status'])} options={['Draft', 'Pending Legal Review', 'Pending Compliance Review', 'Pending Executive Review', 'Approved', 'Filed', 'Rejected'].map(s => ({ value: s, label: s }))}/></div>
            </div>
            <div className="p-4"><Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} /></div>
        </Card>
    );
};

export const AuditLogTable: React.FC<{ filterEntityId?: string; filterEntityType?: AuditLogEntry['entityType'] }> = ({ filterEntityId, filterEntityType }) => {
    const { auditLogs } = useContext(DataContext);
    if (!auditLogs) return <p className="text-gray-400">Audit logs not available.</p>;
    const filteredLogs = useMemo(() => {
        let logs = auditLogs;
        if (filterEntityId) logs = logs.filter(log => log.entityId === filterEntityId && log.entityType === filterEntityType);
        return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [auditLogs, filterEntityId, filterEntityType]);
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;
    const paginatedLogs = useMemo(() => filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage), [filteredLogs, currentPage]);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Audit Log</h3>
            <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-400"><thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th scope="col" className="px-6 py-3">Timestamp</th><th scope="col" className="px-6 py-3">User</th><th scope="col" className="px-6 py-3">Action</th><th scope="col" className="px-6 py-3">Entity</th><th scope="col" className="px-6 py-3">Details</th></tr></thead><tbody>{paginatedLogs.length > 0 ? paginatedLogs.map(log => <tr key={log.id} className="bg-gray-800/50 border-b border-gray-700 hover:bg-gray-700/50"><td className="px-6 py-4 whitespace-nowrap">{formatDateTime(log.timestamp)}</td><td className="px-6 py-4">{log.userName}</td><td className="px-6 py-4"><span className={getStatusColorClass(log.action === 'DELETED' ? 'Rejected' : log.action === 'CREATED' ? 'Approved' : 'Draft')}>{capitalizeFirstLetter(log.action.replace('_', ' '))}</span></td><td className="px-6 py-4">{log.entityType} ({log.entityId.slice(0, 8)}...)</td><td className="px-6 py-4 max-w-xs overflow-hidden text-ellipsis">{log.details}</td></tr>) : <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No audit log entries found.</td></tr>}</tbody></table></div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </div>
    );
};

export const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (<nav className="flex items-center justify-between border-t border-gray-700 px-4 py-3"><p className="text-sm text-gray-400">Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span></p><nav className="isolate inline-flex -space-x-px rounded-md shadow-sm"><button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-700 disabled:opacity-50"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg></button>{pages.map(page => <button key={page} onClick={() => onPageChange(page)} className={classNames('relative inline-flex items-center px-4 py-2 text-sm font-semibold', page === currentPage ? 'z-10 bg-cyan-600 text-white' : 'text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-700')}>{page}</button>)}<button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-700 disabled:opacity-50"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg></button></nav></nav>);
};

export const FilingScheduleComponent: React.FC<{ schedules: FilingSchedule[]; onAdd: (schedule: FilingSchedule) => void; onUpdate: (schedule: FilingSchedule) => void; onDelete: (id: string) => void; disclosures: RegulatoryDisclosure[]; users: UserProfile[]; auditLoggers: { addLogEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void; }; }> = ({ schedules, onAdd, onUpdate, onDelete, disclosures, users, auditLoggers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); const [currentSchedule, setCurrentSchedule] = useState<FilingSchedule | null>(null); const { addLogEntry } = auditLoggers;
    const handleAddClick = () => { setCurrentSchedule({ id: generateUniqueId('sched_'), disclosureId: '', title: '', deadline: '', jurisdiction: '', status: 'Upcoming', remindersSent: 0, assignedTo: users[0]?.id || '', notes: '' }); setIsModalOpen(true); };
    const handleEditClick = (schedule: FilingSchedule) => { setCurrentSchedule(schedule); setIsModalOpen(true); };
    const handleSave = () => { if (currentSchedule) { schedules.find(s => s.id === currentSchedule.id) ? onUpdate(currentSchedule) : onAdd(currentSchedule); addLogEntry({ userId: 'usr_001', userName: 'Alice Smith', action: schedules.find(s => s.id === currentSchedule.id) ? 'UPDATED' : 'CREATED', entityType: 'FilingSchedule', entityId: currentSchedule.id, details: `Saved filing schedule: ${currentSchedule.title}`, newValue: currentSchedule }); setIsModalOpen(false); setCurrentSchedule(null); } };
    const handleChange = (field: keyof FilingSchedule, value: any) => setCurrentSchedule(prev => prev ? { ...prev, [field]: value } : null);
    return (<Card title="Filing Schedules"><div className="flex justify-end mb-4"><Button onClick={handleAddClick}>Add Schedule</Button></div><div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-400"><thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th>Title</th><th>Disclosure</th><th>Deadline</th><th>Jurisdiction</th><th>Assigned</th><th>Status</th><th>Actions</th></tr></thead><tbody>{schedules.length > 0 ? schedules.map(schedule => <tr key={schedule.id} className="bg-gray-800/50 border-b border-gray-700 hover:bg-gray-700/50"><td className="px-6 py-4 text-white">{schedule.title}</td><td>{disclosures.find(d => d.id === schedule.disclosureId)?.title || 'N/A'}</td><td>{formatDate(schedule.deadline)}</td><td>{schedule.jurisdiction}</td><td>{users.find(u => u.id === schedule.assignedTo)?.name || 'N/A'}</td><td><span className={getStatusColorClass(schedule.status)}>{schedule.status}</span></td><td className="flex space-x-2"><Button onClick={() => handleEditClick(schedule)} primary={false}>Edit</Button><Button onClick={() => onDelete(schedule.id)} primary={false} className="bg-red-700">Delete</Button></td></tr>) : <tr><td colSpan={7} className="text-center">No schedules.</td></tr>}</tbody></table></div><Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentSchedule?.id ? "Edit Schedule" : "Add Schedule"}>{currentSchedule && <div className="space-y-4"><InputField label="Title" id="scheduleTitle" value={currentSchedule.title} onChange={e => handleChange('title', e.target.value)} /><div className="flex justify-end space-x-4"><Button onClick={() => setIsModalOpen(false)} primary={false}>Cancel</Button><Button onClick={handleSave}>Save</Button></div></div>}</Modal></Card>);
};

export const RegulatoryFeedComponent: React.FC<{ regulatoryUpdates: ComplianceRule[]; aiService: AIComplianceService; auditLoggers: { addLogEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void; }; }> = ({ regulatoryUpdates, aiService, auditLoggers }) => {
    const [activeRule, setActiveRule] = useState<ComplianceRule | null>(null); const [isSummarizing, setIsSummarizing] = useState(false); const [summary, setSummary] = useState(''); const { addLogEntry } = auditLoggers;
    const handleSummarize = async (rule: ComplianceRule) => { setIsSummarizing(true); setSummary(''); try { const { summary: aiSummary, aiMetadata } = await aiService.summarizeDocument(rule.ruleText, 'medium'); setSummary(aiSummary); addLogEntry({ userId: 'usr_001', userName: 'Alice Smith', action: 'AI_SUMMARY', entityType: 'ComplianceRule', entityId: rule.id, details: `Summarized rule: ${rule.name}`, newValue: { aiMetadata } }); } catch (error) { console.error("Failed to summarize:", error); setSummary("Failed."); } finally { setIsSummarizing(false); } };
    return (<Card title="Regulatory Updates & Feed"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-3 max-h-[60vh] overflow-y-auto">{regulatoryUpdates.map(rule => <div key={rule.id} className="p-3 bg-gray-700/50 rounded-md cursor-pointer hover:bg-gray-600/50" onClick={() => setActiveRule(rule)}><h4 className="font-semibold text-white">{rule.name} - {rule.jurisdiction}</h4><p className="text-sm text-gray-400">Effective: {formatDate(rule.effectiveDate)} | Severity: {rule.severity}</p></div>)}</div>{activeRule && <div className="p-4 bg-gray-700 rounded-md space-y-3"><h3 className="text-lg font-bold text-white">{activeRule.name}</h3><p className="text-gray-300 text-sm mt-2">{activeRule.description}</p><div className="bg-gray-800 p-3 rounded-md max-h-40 overflow-y-auto"><pre className="whitespace-pre-wrap font-sans text-xs text-gray-200">{activeRule.ruleText}</pre></div><Button onClick={() => handleSummarize(activeRule)} disabled={isSummarizing}>{isSummarizing ? 'Summarizing...' : 'AI Summarize'}</Button>{summary && <Card title="AI Summary"><p className="text-sm text-gray-300">{summary}</p></Card>}{activeRule.referenceUrl && <a href={activeRule.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Read Full Document</a>}</div>}</div></Card>);
};

export const ComplianceDashboard: React.FC<{ disclosures: RegulatoryDisclosure[]; }> = ({ disclosures }) => {
    const complianceSummary = useMemo(() => {
        const statusCounts: { [key: string]: number } = { Pass: 0, Fail: 0, Warning: 0, 'Not Applicable': 0, 'Not Checked': 0 };
        disclosures.forEach(d => { if (d.complianceChecks?.length > 0) d.complianceChecks.forEach(check => { statusCounts[check.status]++; }); else statusCounts['Not Checked']++; });
        const disclosuresByStatus = disclosures.reduce((acc, d) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc; }, {} as Record<string, number>);
        return { statusCounts, disclosuresByStatus };
    }, [disclosures]);
    const pieData = Object.entries(complianceSummary.statusCounts).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
    const COLORS = { Pass: '#10B981', Fail: '#EF4444', Warning: '#F59E0B', 'Not Applicable': '#6B7280', 'Not Checked': '#3B82F6' };
    return (<Card title="Compliance Overview Dashboard"><div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><div className="space-y-6"><h3 className="text-xl font-semibold text-white">Overall Compliance Check Status</h3><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div><div className="space-y-6"><h3 className="text-xl font-semibold text-white">Disclosures by Status</h3><ResponsiveContainer width="100%" height={300}><BarChart data={Object.entries(complianceSummary.disclosuresByStatus).map(([name, count]) => ({ name, count }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="count" fill="#3B82F6" /></BarChart></ResponsiveContainer></div></div></Card>);
};

export const VersionHistoryViewer: React.FC<{ versions: DisclosureVersion[]; aiService: AIComplianceService }> = ({ versions, aiService }) => {
    const [selectedVersionA, setSelectedVersionA] = useState<DisclosureVersion | null>(versions[versions.length - 2] || null);
    const [selectedVersionB, setSelectedVersionB] = useState<DisclosureVersion | null>(versions[versions.length - 1] || null);
    const [diffResult, setDiffResult] = useState<ReturnType<typeof diffWords> | null>(null);
    const [aiSummary, setAiSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    useEffect(() => {
        if (selectedVersionA && selectedVersionB) {
            setDiffResult(diffWords(selectedVersionA.content, selectedVersionB.content));
            setAiSummary('');
        }
    }, [selectedVersionA, selectedVersionB]);
    const handleAiCompare = async () => { if (!selectedVersionA || !selectedVersionB) return; setIsLoadingSummary(true); try { const { summary } = await aiService.compareVersions(selectedVersionA.content, selectedVersionB.content); setAiSummary(summary); } catch (e) { setAiSummary('Failed to generate summary.'); } finally { setIsLoadingSummary(false); } };
    return (
        <div className="space-y-4"><div className="grid grid-cols-2 gap-4"><SelectField label="Compare Version" id="versionA" value={String(selectedVersionA?.version || '')} onChange={e => setSelectedVersionA(versions.find(v => String(v.version) === e.target.value) || null)} options={versions.map(v => ({ value: String(v.version), label: `v${v.version}` }))} /><SelectField label="With Version" id="versionB" value={String(selectedVersionB?.version || '')} onChange={e => setSelectedVersionB(versions.find(v => String(v.version) === e.target.value) || null)} options={versions.map(v => ({ value: String(v.version), label: `v${v.version}` }))} /></div><Button onClick={handleAiCompare} disabled={isLoadingSummary || !selectedVersionA || !selectedVersionB}>{isLoadingSummary ? 'Analyzing...' : 'Get AI Summary of Changes'}</Button>{aiSummary && <Card title="AI Summary"><p>{aiSummary}</p></Card>}{diffResult && <Card title={`Comparing v${selectedVersionA?.version} with v${selectedVersionB?.version}`}><div className="p-2 bg-gray-900 rounded whitespace-pre-wrap max-h-80 overflow-y-auto">{diffResult.map((part, i) => <span key={i} className={part.added ? 'bg-green-800' : part.removed ? 'bg-red-800' : ''}>{part.value}</span>)}</div></Card>}</div>
    );
};

export const WorkflowVisualizer: React.FC<{ workflow: ApprovalWorkflowStep[]; users: UserProfile[] }> = ({ workflow, users }) => {
    return (
        <div className="flex items-center space-x-4 overflow-x-auto p-4">
            {workflow.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center min-w-[150px]">
                        <div className={classNames("w-12 h-12 rounded-full flex items-center justify-center border-2", { 'bg-green-600 border-green-400': step.status === 'Approved', 'bg-red-600 border-red-400': step.status === 'Rejected', 'bg-yellow-600 border-yellow-400': step.status === 'In Progress', 'bg-gray-700 border-gray-500': step.status === 'Pending' })}>{index + 1}</div>
                        <p className="mt-2 text-sm font-semibold text-white">{step.name}</p>
                        <p className="text-xs text-gray-400">{users.find(u => u.id === step.assignedTo)?.name || 'N/A'}</p>
                        <p className={classNames("text-xs", getStatusColorClass(step.status))}>{step.status}</p>
                    </div>
                    {index < workflow.length - 1 && <div className="flex-auto border-t-2 border-gray-600"></div>}
                </React.Fragment>
            ))}
        </div>
    );
};


// --- Main DisclosuresView Component ---
const DisclosuresView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("DisclosuresView must be within DataProvider");
    const { disclosures: initialDisclosuresData, auditLogs: initialAuditLogsData, risks: initialRisks, complianceRules: initialRules, filingSchedules: initialSchedules } = context;

    const aiServiceRef = useRef<AIComplianceService | null>(null);
    useEffect(() => {
        if (!aiServiceRef.current && process.env.NEXT_PUBLIC_API_KEY) {
            aiServiceRef.current = new AIComplianceService(process.env.NEXT_PUBLIC_API_KEY);
        }
    }, []);
    const aiService = aiServiceRef.current;
    if (!aiService) console.error("AI Compliance Service could not be initialized. Check API Key.");

    const { disclosures, paginatedDisclosures, selectedDisclosure, setSelectedDisclosure, isEditing, setIsEditing, isAdding, setIsAdding, searchTerm, setSearchTerm, filterStatus, setFilterStatus, filterType, setFilterType, currentPage, setCurrentPage, totalPages, addDisclosure, updateDisclosure, deleteDisclosure, allUsers } = useDisclosureManagement(initialDisclosuresData || MOCK_DISCLOSURES, MOCK_USERS);
    const { auditLogs, addLogEntry } = useAuditLog(initialAuditLogsData || []);
    const auditLoggers = useMemo(() => ({ addLogEntry }), [addLogEntry]);

    const [isDrafterOpen, setDrafterOpen] = useState(false);
    const [prompt, setPrompt] = useState("A minor data breach affecting 500 users, no PII exposed.");
    const [draft, setDraft] = useState('');
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    const [risks] = useState<Risk[]>(initialRisks || MOCK_RISKS);
    const [complianceRules] = useState<ComplianceRule[]>(initialRules || MOCK_COMPLIANCE_RULES);
    const [filingSchedules, setFilingSchedules] = useState<FilingSchedule[]>(initialSchedules || []);

    const handleDraft = async () => { if (!aiService) { alert("AI service unavailable."); return; } setIsLoadingAI(true); setDraft(''); try { const { draft: generatedDraft } = await aiService.draftDisclosure(prompt); setDraft(generatedDraft); } catch (err) { setDraft(`Error: ${err instanceof Error ? err.message : String(err)}`); } finally { setIsLoadingAI(false); } };
    const handleAddNewDisclosure = () => { const newId = generateUniqueId('disc_'); setSelectedDisclosure({ id: newId, title: `New Disclosure`, jurisdiction: '', filingDate: new Date().toISOString(), status: 'Draft', type: 'Other', summary: '', fullContent: draft, lastEditedBy: 'CurrentUser', lastEditedDate: new Date().toISOString(), version: 1, associatedRisks: [], documents: [], reviewHistory: [], complianceChecks: [], tags: [], audience: 'Public', isConfidential: false, language: 'en', versionHistory: [{ version: 1, content: draft, editedBy: 'CurrentUser', editDate: new Date().toISOString(), changeSummary: 'Initial AI Draft' }] }); setIsAdding(true); setDrafterOpen(false); setDraft(''); };
    const handleSaveNewDisclosure = () => { if (selectedDisclosure) { addDisclosure(selectedDisclosure); } };
    const handleSaveUpdatedDisclosure = () => { if (selectedDisclosure) { const newVersionHistory = [...(selectedDisclosure.versionHistory || []), { version: selectedDisclosure.version + 1, content: selectedDisclosure.fullContent, editedBy: 'CurrentUser', editDate: new Date().toISOString(), changeSummary: 'Manual Update' }]; updateDisclosure({ ...selectedDisclosure, lastEditedBy: 'CurrentUser', lastEditedDate: new Date().toISOString(), version: selectedDisclosure.version + 1, versionHistory: newVersionHistory }); } };
    const handleCancelEditOrAdd = () => { setSelectedDisclosure(null); setIsEditing(false); setIsAdding(false); };
    const addFilingSchedule = useCallback((s: FilingSchedule) => setFilingSchedules(p => [...p, s]), []);
    const updateFilingSchedule = useCallback((s: FilingSchedule) => setFilingSchedules(p => p.map(i => i.id === s.id ? s : i)), []);
    const deleteFilingSchedule = useCallback((id: string) => setFilingSchedules(p => p.filter(i => i.id !== id)), []);

    const disclosureStatusOptions = useMemo(() => [{ value: 'All', label: 'All Statuses' }, ...Array.from(new Set(disclosures.map(d => d.status))).map(s => ({ value: s, label: s }))], [disclosures]);
    const disclosureTypeOptions = useMemo(() => [{ value: 'All', label: 'All Types' }, ...Array.from(new Set(disclosures.map(d => d.type))).map(s => ({ value: s, label: s }))], [disclosures]);
    const mainTabs = useMemo(() => [
        { id: 'disclosures', label: 'All Disclosures', content: (<><div className="flex justify-between items-center mb-4"><div className="flex space-x-2"><InputField label="" id="disclosureSearch" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." /><SelectField label="" id="filterStatus" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} options={disclosureStatusOptions} /><SelectField label="" id="filterType" value={filterType} onChange={e => setFilterType(e.target.value)} options={disclosureTypeOptions} /></div><Button onClick={handleAddNewDisclosure}>Add New</Button></div><Card title="Regulatory Filings"><table className="w-full text-sm text-left text-gray-400"><thead><tr><th>Title</th><th>Jurisdiction</th><th>Filing Date</th><th>Status</th><th>Type</th><th>Actions</th></tr></thead><tbody>{paginatedDisclosures.map(d => <tr key={d.id}><td>{d.title}</td><td>{d.jurisdiction}</td><td>{formatDate(d.filingDate)}</td><td><span className={getStatusColorClass(d.status)}>{d.status}</span></td><td>{d.type}</td><td><Button onClick={() => setSelectedDisclosure(d)} primary={false}>View</Button><Button onClick={() => { setSelectedDisclosure(d); setIsEditing(true); }} primary={false}>Edit</Button></td></tr>)}</tbody></table>{totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}</Card></>) },
        { id: 'filing_schedules', label: 'Filing Schedules', content: <FilingScheduleComponent schedules={filingSchedules} onAdd={addFilingSchedule} onUpdate={updateFilingSchedule} onDelete={deleteFilingSchedule} disclosures={disclosures} users={allUsers} auditLoggers={auditLoggers} /> },
        { id: 'compliance_dashboard', label: 'Dashboard', content: <ComplianceDashboard disclosures={disclosures} /> },
        { id: 'regulatory_feed', label: 'Regulatory Feed', content: aiService ? <RegulatoryFeedComponent regulatoryUpdates={complianceRules} aiService={aiService} auditLoggers={auditLoggers} /> : <p>AI Service Not Available</p> },
        { id: 'full_audit_log', label: 'Full Audit Log', content: <AuditLogTable /> },
    ], [searchTerm, filterStatus, filterType, paginatedDisclosures, totalPages, currentPage, disclosures, filingSchedules, complianceRules, aiService]);
    const [activeMainTab, setActiveMainTab] = useState('disclosures');

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center"><h2 className="text-3xl font-bold text-white tracking-wider">Disclosures & Compliance</h2><Button onClick={() => setDrafterOpen(true)}>AI Disclosure Drafter</Button></div>
                <Tabs tabs={mainTabs} activeTab={activeMainTab} onChange={setActiveMainTab} />
            </div>
            <Modal isOpen={isDrafterOpen} onClose={() => setDrafterOpen(false)} title="AI Disclosure Drafter" className="max-w-4xl"><div className="p-6 space-y-4"><InputField label="Event Description" id="prompt" type="textarea" value={prompt} onChange={e => setPrompt(e.target.value)} rows={5} /><Button onClick={handleDraft} disabled={isLoadingAI || !prompt}>{isLoadingAI ? 'Drafting...' : 'Draft Disclosure'}</Button>{draft && <Card title="Generated Draft"><div className="min-h-[10rem] max-h-60 overflow-y-auto whitespace-pre-line p-3 bg-gray-900/30">{draft}</div><div className="mt-4 flex justify-end space-x-2"><Button onClick={() => navigator.clipboard.writeText(draft)} primary={false}>Copy</Button><Button onClick={handleAddNewDisclosure}>Use Draft</Button></div></Card>}</div></Modal>
            {(selectedDisclosure && (isEditing || isAdding)) && <Modal isOpen={true} onClose={handleCancelEditOrAdd} title={isAdding ? "Add Disclosure" : `Edit: ${selectedDisclosure.title}`} className="max-w-4xl"><DisclosureForm disclosure={selectedDisclosure} onChange={(field, value) => setSelectedDisclosure(prev => prev ? { ...prev, [field]: value } : null)} onSave={isAdding ? handleSaveNewDisclosure : handleSaveUpdatedDisclosure} onCancel={handleCancelEditOrAdd} isNew={isAdding} users={allUsers} risks={risks} auditLoggers={auditLoggers} /></Modal>}
            {(selectedDisclosure && !isEditing && !isAdding) && <Modal isOpen={true} onClose={() => setSelectedDisclosure(null)} title={`Details: ${selectedDisclosure.title}`} className="max-w-5xl"><DisclosureDetails disclosure={selectedDisclosure} onEdit={() => setIsEditing(true)} onDelete={(id) => { if (window.confirm('Delete?')) { deleteDisclosure(id); } }} onUpdateStatus={(id, newStatus) => updateDisclosure({ ...selectedDisclosure, status: newStatus })} aiService={aiService!} onUpdateDisclosure={updateDisclosure} complianceRules={complianceRules} users={allUsers} auditLoggers={auditLoggers} /></Modal>}
        </>
    );
};

export default DisclosuresView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/regulation/DisclosuresView.tsx
================================================================================

// components/views/megadashboard/regulation/DisclosuresView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";

const DisclosuresView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("DisclosuresView must be within DataProvider");
    
    const { disclosures } = context;
    const [isDrafterOpen, setDrafterOpen] = useState(false);
    const [prompt, setPrompt] = useState("A minor data breach affecting 500 users, no PII exposed.");
    const [draft, setDraft] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDraft = async () => {
        setIsLoading(true); setDraft('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const fullPrompt = `You are a legal AI. Draft a concise, professional public disclosure statement for the following event: "${prompt}"`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: fullPrompt});
            setDraft(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Disclosures</h2>
                <button onClick={() => setDrafterOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Disclosure Drafter</button>
            </div>
             <Card title="Regulatory Filings">
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th className="px-6 py-3">Title</th><th className="px-6 py-3">Jurisdiction</th><th className="px-6 py-3">Filing Date</th></tr></thead>
                    <tbody>{disclosures.map(d => <tr key={d.id}><td className="px-6 py-4 text-white">{d.title}</td><td>{d.jurisdiction}</td><td>{d.filingDate}</td></tr>)}</tbody>
                </table>
            </Card>
        </div>
         {isDrafterOpen && (
             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setDrafterOpen(false)}>
                <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Disclosure Drafter</h3></div>
                    <div className="p-6 space-y-4">
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-2 rounded" />
                        <button onClick={handleDraft} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Drafting...' : 'Draft Disclosure'}</button>
                        {draft && <Card title="Generated Draft"><div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line">{draft}</div></Card>}
                    </div>
                </div>
             </div>
        )}
        </>
    );
};

export default DisclosuresView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/regulation/DisclosuresView.tsx
================================================================================

// components/views/megadashboard/regulation/DisclosuresView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";

const DisclosuresView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("DisclosuresView must be within DataProvider");
    
    const { disclosures } = context;
    const [isDrafterOpen, setDrafterOpen] = useState(false);
    const [prompt, setPrompt] = useState("A minor data breach affecting 500 users, no PII exposed.");
    const [draft, setDraft] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDraft = async () => {
        setIsLoading(true); setDraft('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const fullPrompt = `You are a legal AI. Draft a concise, professional public disclosure statement for the following event: "${prompt}"`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: fullPrompt});
            setDraft(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Disclosures</h2>
                <button onClick={() => setDrafterOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Disclosure Drafter</button>
            </div>
             <Card title="Regulatory Filings">
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th className="px-6 py-3">Title</th><th className="px-6 py-3">Jurisdiction</th><th className="px-6 py-3">Filing Date</th></tr></thead>
                    <tbody>{disclosures.map(d => <tr key={d.id}><td className="px-6 py-4 text-white">{d.title}</td><td>{d.jurisdiction}</td><td>{d.filingDate}</td></tr>)}</tbody>
                </table>
            </Card>
        </div>
         {isDrafterOpen && (
             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setDrafterOpen(false)}>
                <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Disclosure Drafter</h3></div>
                    <div className="p-6 space-y-4">
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-2 rounded" />
                        <button onClick={handleDraft} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Drafting...' : 'Draft Disclosure'}</button>
                        {draft && <Card title="Generated Draft"><div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line">{draft}</div></Card>}
                    </div>
                </div>
             </div>
        )}
        </>
    );
};

export default DisclosuresView;
