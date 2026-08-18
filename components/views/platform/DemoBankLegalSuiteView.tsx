// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankLegalSuiteView.tsx
================================================================================

// components/views/platform/DemoBankLegalSuiteView.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { format, addMonths, isBefore, parseISO } from 'date-fns';
import { toast, Toaster } from 'react-hot-toast';
import { 
    FileText, Search, Filter, ChevronsUpDown, Calendar, AlertTriangle, CheckCircle2, Shield, 
    Bot, Sparkles, FilePlus2, Download, GanttChartSquare, History, X, Building, User, Mail, DollarSign, Clock, FileClock 
} from 'lucide-react';

// =================================================================================================
// TYPE DEFINITIONS FOR A REAL-WORLD LEGAL SUITE APPLICATION (EXPANDED)
// =================================================================================================

export type ContractStatus = 'Active' | 'Drafting' | 'Under Review' | 'Expired' | 'Terminated' | 'Pending Signature';
export type ContractType = 'MSA' | 'NDA' | 'SOW' | 'SaaS' | 'Vendor' | 'Lease' | 'Employment' | 'Partnership';
export type ComplianceStatus = 'Compliant' | 'At Risk' | 'Non-Compliant' | 'Pending Audit';
export type ClauseCategory = 'Liability' | 'Confidentiality' | 'Termination' | 'Indemnification' | 'Governing Law' | 'IP Rights' | 'Data Privacy';
export type DocumentFormat = 'PDF' | 'DOCX' | 'Signed PDF';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type AiAnalysisAspect = 'Risk Assessment' | 'Key Term Extraction' | 'Obligation Summary' | 'Clause Comparison' | 'Sentiment Analysis';
export type AuditLogAction = 'Created' | 'Viewed' | 'Edited' | 'Document Uploaded' | 'Status Changed' | 'AI Analysis Run';
export type TimelineEventType = 'Signature' | 'Renewal' | 'Expiration' | 'Notice Period' | 'Audit' | 'Milestone';

export interface Counterparty {
    id: string;
    name: string;
    address: string;
    contactPerson: string;
    contactEmail: string;
    riskScore: number; // 0-100
    tier: 'Strategic' | 'Standard' | 'Low-Value';
    onboardingDate: string;
}

export interface ContractDocument {
    id: string;
    fileName: string;
    format: DocumentFormat;
    version: number;
    uploadDate: string;
    url: string; // link to cloud storage
    uploaderId: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    action: AuditLogAction;
    details: string;
}

export interface ContractTimelineEvent {
    id: string;
    date: string;
    type: TimelineEventType;
    title: string;
    description: string;
}

export interface Contract {
    id: string;
    name: string;
    type: ContractType;
    status: ContractStatus;
    counterpartyId: string;
    startDate: string;
    endDate: string | null;
    renewalDate: string | null;
    value: number; // Annual Contract Value (ACV)
    currency: 'USD' | 'EUR' | 'GBP';
    assignedLawyerId: string;
    description: string;
    documents: ContractDocument[];
    versionHistory: string[];
    keyTerms: Record<string, string>;
    riskLevel: RiskLevel;
    relatedContractIds?: string[];
}

export interface LegalTeamMember {
    id: string;
    name: string;
    role: 'General Counsel' | 'Associate Counsel' | 'Paralegal' | 'Contract Manager' | 'Legal Operations';
    email: string;
}

export interface ComplianceTask {
    id: string;
    name: string;
    relatedContractId: string | null;
    dueDate: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
    ownerId: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
}

export interface StandardClause {
    id: string;
    title: string;
    category: ClauseCategory;
    content: string;
    version: number;
    usageGuidelines: string;
    approvedBy: string;
    isPreferred: boolean;
}

export interface AiAnalysisRequest {
    documentText: string;
    aspects: AiAnalysisAspect[];
}

export interface AiAnalysisResult {
    summary: string;
    riskAssessment: { level: RiskLevel; details: string[] };
    extractedTerms: Record<string, string>;
    obligations: { party: 'Our Company' | 'Counterparty'; obligation: string }[];
    clauseComparison?: { clause: string; similarityScore: number; recommendation: string }[];
    sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Mixed';
}

export interface AiChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
}

// =================================================================================================
// MOCK DATA & API SERVICE SIMULATION (EXPANDED & MORE REALISTIC)
// =================================================================================================

export const mockLegalTeam: LegalTeamMember[] = [
    { id: 'LT-01', name: 'Eleanor Vance', role: 'General Counsel', email: 'e.vance@demobank.com' },
    { id: 'LT-02', name: 'Ben Carter', role: 'Associate Counsel', email: 'b.carter@demobank.com' },
    { id: 'LT-03', name: 'Olivia Martinez', role: 'Paralegal', email: 'o.martinez@demobank.com' },
    { id: 'LT-04', name: 'Kenji Tanaka', role: 'Contract Manager', email: 'k.tanaka@demobank.com' },
    { id: 'LT-05', name: 'Sophia Chen', role: 'Legal Operations', email: 's.chen@demobank.com' },
];

export const mockCounterparties: Counterparty[] = [
    { id: 'CP-01', name: 'Quantum Corp', address: '123 Quantum Way, Silicon Valley, CA', contactPerson: 'Dr. Evelyn Reed', contactEmail: 'evelyn.r@quantum.com', riskScore: 25, tier: 'Strategic', onboardingDate: '2022-12-01' },
    { id: 'CP-02', name: 'Cyberdyne Systems', address: '456 Skynet Blvd, Sunnyvale, CA', contactPerson: 'Miles Dyson', contactEmail: 'm.dyson@cyberdyne.com', riskScore: 65, tier: 'Standard', onboardingDate: '2022-10-15' },
    { id: 'CP-03', name: 'Office Supplies Co.', address: '789 Paper St, Scranton, PA', contactPerson: 'Pamela Beesly', contactEmail: 'pbeesly@officesupplies.com', riskScore: 10, tier: 'Low-Value', onboardingDate: '2021-05-20' },
    { id: 'CP-04', name: 'NeuroLink Inc.', address: '1 Neural Plaza, Austin, TX', contactPerson: 'Elon Musk', contactEmail: 'elon@neurolink.io', riskScore: 40, tier: 'Strategic', onboardingDate: '2024-01-10' },
    { id: 'CP-05', name: 'Stark Industries', address: '1 Stark Tower, New York, NY', contactPerson: 'Pepper Potts', contactEmail: 'ppotts@stark.com', riskScore: 30, tier: 'Strategic', onboardingDate: '2020-03-01' },
    { id: 'CP-06', name: 'Innovate Solutions', address: '8 Innovation Drive, Boston, MA', contactPerson: 'Alex Chen', contactEmail: 'achen@innovate.com', riskScore: 15, tier: 'Standard', onboardingDate: '2023-08-11' },
    { id: 'CP-07', name: 'Global Logistics', address: '55 Shipping Lane, Long Beach, CA', contactPerson: 'Maria Garcia', contactEmail: 'm.garcia@globallogistics.com', riskScore: 55, tier: 'Standard', onboardingDate: '2022-02-22' },
];

export const mockContracts: Contract[] = [
    { id: 'CTR-001', name: 'Master Services Agreement - Quantum Corp', type: 'MSA', status: 'Active', counterpartyId: 'CP-01', startDate: '2023-01-15', endDate: '2026-01-14', renewalDate: '2025-11-15', value: 5000000, currency: 'USD', assignedLawyerId: 'LT-02', description: 'Comprehensive MSA for quantum computing research services.', documents: [{id: 'DOC-001', fileName: 'MSA_Quantum_Signed.pdf', format: 'Signed PDF', version: 2, uploadDate: '2023-01-14', url: '#', uploaderId: 'LT-04'}], versionHistory: ['v1 Draft', 'v2 Signed'], keyTerms: { 'Payment Terms': 'Net 60', 'Liability Cap': '$5,000,000' }, riskLevel: 'Medium' },
    { id: 'CTR-002', name: 'SaaS Subscription - Cyberdyne Systems', type: 'SaaS', status: 'Active', counterpartyId: 'CP-02', startDate: '2022-11-30', endDate: null, renewalDate: '2024-11-30', value: 750000, currency: 'USD', assignedLawyerId: 'LT-04', description: 'Annual subscription for Cyberdyne\'s AI-driven security platform.', documents: [{id: 'DOC-002', fileName: 'SaaS_Cyberdyne_v3.pdf', format: 'Signed PDF', version: 3, uploadDate: '2022-11-28', url: '#', uploaderId: 'LT-04'}], versionHistory: ['v1 Initial', 'v2 Redlined', 'v3 Signed'], keyTerms: { 'SLA': '99.99% Uptime', 'Data Privacy': 'GDPR & CCPA Compliant' }, riskLevel: 'High' },
    { id: 'CTR-003', name: 'Vendor Agreement - Office Supplies Co.', type: 'Vendor', status: 'Expired', counterpartyId: 'CP-03', startDate: '2023-06-30', endDate: '2024-06-30', renewalDate: null, value: 50000, currency: 'USD', assignedLawyerId: 'LT-03', description: 'Annual contract for office supply procurement.', documents: [{id: 'DOC-003', fileName: 'Office_Supplies_Vendor.pdf', format: 'Signed PDF', version: 1, uploadDate: '2023-06-25', url: '#', uploaderId: 'LT-03'}], versionHistory: ['v1 Signed'], keyTerms: { 'Delivery': 'Within 2 business days' }, riskLevel: 'Low' },
    { id: 'CTR-004', name: 'NDA - NeuroLink Inc.', type: 'NDA', status: 'Active', counterpartyId: 'CP-04', startDate: '2024-02-01', endDate: '2029-02-01', renewalDate: null, value: 0, currency: 'USD', assignedLawyerId: 'LT-02', description: 'Mutual non-disclosure agreement for collaborative brain-computer interface research.', documents: [{id: 'DOC-004', fileName: 'NDA_NeuroLink_Mutual.pdf', format: 'Signed PDF', version: 1, uploadDate: '2024-01-30', url: '#', uploaderId: 'LT-02'}], versionHistory: ['v1 Signed'], keyTerms: { 'Term': '5 years', 'Residuals Clause': 'Included' }, riskLevel: 'Medium' },
    { id: 'CTR-005', name: 'Statement of Work - Stark Industries', type: 'SOW', status: 'Under Review', counterpartyId: 'CP-05', startDate: '2024-09-01', endDate: '2025-03-01', renewalDate: null, value: 1200000, currency: 'USD', assignedLawyerId: 'LT-01', description: 'SOW for developing a new arc reactor power management system.', documents: [{id: 'DOC-005', fileName: 'SOW_Stark_ArcReactor_DRAFT.docx', format: 'DOCX', version: 1, uploadDate: '2024-07-20', url: '#', uploaderId: 'LT-01'}], versionHistory: ['v1 Draft'], keyTerms: { 'Milestone 1': 'System Architecture Design', 'Acceptance Criteria': 'Defined in Appendix A' }, riskLevel: 'Medium', relatedContractIds: ['CTR-010'] },
    { id: 'CTR-006', name: 'Project Phoenix MSA - Internal Draft', type: 'MSA', status: 'Drafting', counterpartyId: 'CP-01', startDate: '2025-01-01', endDate: '2028-01-01', renewalDate: null, value: 8000000, currency: 'USD', assignedLawyerId: 'LT-02', description: 'New master services agreement for Project Phoenix.', documents: [], versionHistory: [], keyTerms: {}, riskLevel: 'High' },
    { id: 'CTR-007', name: 'Cloud Services Agreement - Innovate', type: 'SaaS', status: 'Active', counterpartyId: 'CP-06', startDate: '2023-09-01', endDate: null, renewalDate: '2024-09-01', value: 250000, currency: 'USD', assignedLawyerId: 'LT-04', description: 'Subscription for cloud hosting services.', documents: [{id: 'DOC-007', fileName: 'Cloud_Innovate_v1.pdf', format: 'Signed PDF', version: 1, uploadDate: '2023-08-28', url: '#', uploaderId: 'LT-04'}], versionHistory: ['v1 Signed'], keyTerms: { 'Data Residency': 'US-East', 'Security': 'SOC 2 Type II' }, riskLevel: 'Medium' },
    { id: 'CTR-008', name: 'Logistics Partnership - Global Logistics', type: 'Partnership', status: 'Terminated', counterpartyId: 'CP-07', startDate: '2022-03-01', endDate: '2024-03-01', renewalDate: null, value: 400000, currency: 'USD', assignedLawyerId: 'LT-05', description: 'Partnership for global shipping and logistics.', documents: [], versionHistory: [], keyTerms: {}, riskLevel: 'Low' },
    { id: 'CTR-009', name: 'HQ Office Lease', type: 'Lease', status: 'Active', counterpartyId: 'CP-03', startDate: '2020-01-01', endDate: '2030-01-01', renewalDate: '2029-07-01', value: 1800000, currency: 'USD', assignedLawyerId: 'LT-03', description: '10-year lease for main headquarters.', documents: [], versionHistory: [], keyTerms: { 'CAM Charges': 'Pro-rata share' }, riskLevel: 'Low' },
    { id: 'CTR-010', name: 'Master Services Agreement - Stark Industries', type: 'MSA', status: 'Active', counterpartyId: 'CP-05', startDate: '2021-06-01', endDate: '2025-06-01', renewalDate: '2025-04-01', value: 3000000, currency: 'USD', assignedLawyerId: 'LT-01', description: 'General MSA governing all work with Stark Industries.', documents: [], versionHistory: [], keyTerms: {}, riskLevel: 'Medium' },
    { id: 'CTR-011', name: 'AI Model Development SOW', type: 'SOW', status: 'Pending Signature', counterpartyId: 'CP-04', startDate: '2024-08-15', endDate: '2025-02-15', renewalDate: null, value: 650000, currency: 'USD', assignedLawyerId: 'LT-02', description: 'SOW for custom AI model development.', documents: [], versionHistory: [], keyTerms: {'IP Ownership': 'Demo Bank'}, riskLevel: 'High' }
];

export const mockComplianceTasks: ComplianceTask[] = [
    { id: 'CT-001', name: 'GDPR Data Processing Audit', relatedContractId: 'CTR-002', dueDate: '2024-10-15', status: 'In Progress', ownerId: 'LT-03', description: 'Annual audit of data processing clauses and practices with Cyberdyne Systems.', priority: 'High' },
    { id: 'CT-002', name: 'Export Control Check for Quantum Corp', relatedContractId: 'CTR-001', dueDate: '2024-08-30', status: 'Pending', ownerId: 'LT-02', description: 'Verify compliance with international export control regulations for quantum technology.', priority: 'High' },
    { id: 'CT-003', name: 'Renew Business License', relatedContractId: null, dueDate: '2024-12-31', status: 'Completed', ownerId: 'LT-03', description: 'File for annual renewal of the primary business operating license.', priority: 'Medium' },
    { id: 'CT-004', name: 'Review Stark SOW Liability Clause', relatedContractId: 'CTR-005', dueDate: '2024-07-30', status: 'Overdue', ownerId: 'LT-01', description: 'Liability clause proposed by Stark Industries exceeds standard risk tolerance.', priority: 'High' },
    { id: 'CT-005', name: 'SOC 2 Report Collection', relatedContractId: 'CTR-007', dueDate: '2024-09-15', status: 'Pending', ownerId: 'LT-05', description: 'Collect latest SOC 2 Type II report from Innovate Solutions.', priority: 'Medium' },
];

export const mockClauseLibrary: StandardClause[] = [
    { id: 'CL-LIAB-001', title: 'Standard Mutual Limitation of Liability', category: 'Liability', content: 'EXCEPT FOR OBLIGATIONS UNDER SECTION [CONFIDENTIALITY] AND [INDEMNIFICATION], EACH PARTY\'S AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE TO THE OTHER PARTY IN THE PRECEDING TWELVE (12) MONTHS.', version: 3, usageGuidelines: 'Use for standard risk SaaS and service agreements. Do not use for high-risk data processing agreements.', approvedBy: 'LT-01', isPreferred: true },
    { id: 'CL-CONF-001', title: 'Standard Unilateral Confidentiality', category: 'Confidentiality', content: 'The Receiving Party shall hold in strict confidence and shall not disclose any Confidential Information of the Disclosing Party. "Confidential Information" means...', version: 5, usageGuidelines: 'Use when Demo Bank is the primary disclosing party. For mutual disclosures, use CL-CONF-002.', approvedBy: 'LT-01', isPreferred: false },
    { id: 'CL-TERM-002', title: 'Termination for Convenience', category: 'Termination', content: 'Either party may terminate this Agreement for any reason or no reason upon ninety (90) days prior written notice to the other party.', version: 2, usageGuidelines: 'Preferable in all vendor agreements. May be negotiated out by strategic partners.', approvedBy: 'LT-01', isPreferred: true },
    { id: 'CL-IP-001', title: 'IP Ownership (Customer Owns Deliverables)', category: 'IP Rights', content: 'All right, title, and interest in and to the Deliverables, including all intellectual property rights therein, shall be the sole and exclusive property of Customer. Service Provider hereby assigns...', version: 4, usageGuidelines: 'Use for SOWs where custom work is being created for Demo Bank.', approvedBy: 'LT-01', isPreferred: true },
];

const mockContractDetails: Record<string, { auditLog: AuditLogEntry[], timeline: ContractTimelineEvent[] }> = {
    'CTR-001': {
        auditLog: [
            { id: 'AL-001', timestamp: '2023-01-14T14:00:00Z', userId: 'LT-04', action: 'Document Uploaded', details: 'Uploaded MSA_Quantum_Signed.pdf' },
            { id: 'AL-002', timestamp: '2023-01-15T09:00:00Z', userId: 'LT-02', action: 'Status Changed', details: 'Status changed from Pending Signature to Active' },
            { id: 'AL-003', timestamp: '2024-05-20T11:30:00Z', userId: 'LT-02', action: 'Viewed', details: 'Ben Carter viewed the contract' },
        ],
        timeline: [
            { id: 'TL-001', date: '2023-01-15', type: 'Signature', title: 'Contract Signed', description: 'MSA executed by both parties.' },
            { id: 'TL-002', date: '2025-10-16', type: 'Notice Period', title: 'Renewal Notice Period Starts', description: '90-day notice period for renewal begins.' },
            { id: 'TL-003', date: '2026-01-14', type: 'Expiration', title: 'Contract Expires', description: 'The current term of the contract ends.' },
        ]
    },
};

export const LegalSuiteApiService = {
    fetchContracts: async (): Promise<Contract[]> => new Promise(res => setTimeout(() => res(mockContracts), 500)),
    fetchContractById: async (id: string): Promise<Contract | undefined> => new Promise(res => setTimeout(() => res(mockContracts.find(c => c.id === id)), 300)),
    fetchComplianceTasks: async (): Promise<ComplianceTask[]> => new Promise(res => setTimeout(() => res(mockComplianceTasks), 400)),
    fetchClauseLibrary: async (): Promise<StandardClause[]> => new Promise(res => setTimeout(() => res(mockClauseLibrary), 200)),
    fetchContractDetails: async (id: string): Promise<{ auditLog: AuditLogEntry[], timeline: ContractTimelineEvent[] }> => new Promise(res => setTimeout(() => res(mockContractDetails[id] || { auditLog: [], timeline: [] }), 600)),
    getCounterpartyById: (id: string): Counterparty | undefined => mockCounterparties.find(cp => cp.id === id),
    getLawyerById: (id: string): LegalTeamMember | undefined => mockLegalTeam.find(lt => lt.id === id),
};

// =================================================================================================
// CUSTOM HOOKS
// =================================================================================================

export const useLegalData = () => {
    const [data, setData] = useState<{
        contracts: Contract[];
        tasks: ComplianceTask[];
        clauses: StandardClause[];
        isLoading: boolean;
    }>({ contracts: [], tasks: [], clauses: [], isLoading: true });

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const [contractData, taskData, clauseData] = await Promise.all([
                    LegalSuiteApiService.fetchContracts(),
                    LegalSuiteApiService.fetchComplianceTasks(),
                    LegalSuiteApiService.fetchClauseLibrary(),
                ]);
                setData({ contracts: contractData, tasks: taskData, clauses: clauseData, isLoading: false });
            } catch (error) {
                console.error("Failed to load legal data:", error);
                toast.error("Failed to load legal data.");
                setData(d => ({ ...d, isLoading: false }));
            }
        };
        loadAllData();
    }, []);

    return { ...data, counterparties: mockCounterparties, legalTeam: mockLegalTeam };
};

// =================================================================================================
// HELPER FUNCTIONS & UTILITIES
// =================================================================================================

export const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return format(parseISO(dateString), 'MMM d, yyyy');
};

export const formatCurrency = (amount: number, currency: 'USD' | 'EUR' | 'GBP'): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export const getStatusColor = (status: ContractStatus | ComplianceTask['status']) => {
    const colors: Record<string, string> = {
        'Active': 'bg-green-500/20 text-green-300', 'Under Review': 'bg-yellow-500/20 text-yellow-300',
        'Drafting': 'bg-blue-500/20 text-blue-300', 'Expired': 'bg-gray-500/20 text-gray-300',
        'Terminated': 'bg-red-500/20 text-red-300', 'Pending Signature': 'bg-purple-500/20 text-purple-300',
        'In Progress': 'bg-cyan-500/20 text-cyan-300', 'Completed': 'bg-green-500/20 text-green-300',
        'Pending': 'bg-gray-500/20 text-gray-300', 'Overdue': 'bg-red-600/30 text-red-400 font-bold'
    };
    return colors[status] || 'bg-gray-600/20 text-gray-400';
};

export const getRiskColor = (level: RiskLevel) => {
    const colors: Record<RiskLevel, string> = {
        'Low': 'text-green-400', 'Medium': 'text-yellow-400', 'High': 'text-orange-400', 'Critical': 'text-red-500'
    };
    return colors[level];
};

const Icon = ({ name, className }: { name: React.ElementType, className?: string }) => {
    const LucideIcon = name;
    return <LucideIcon className={className || "w-4 h-4"} />;
};

// =================================================================================================
// REUSABLE UI COMPONENTS
// =================================================================================================

const PageHeader: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white tracking-wider">{title}</h2>
        <div className="flex items-center space-x-2">{children}</div>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
);

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-4 space-x-4">
        <div className="p-3 bg-cyan-500/10 rounded-lg"><Icon name={icon} className="w-6 h-6 text-cyan-400" /></div>
        <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400">{title}</p>
        </div>
    </Card>
);

const TabNavigation: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; tabs: string[] }> = ({ activeTab, setActiveTab, tabs }) => (
    <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                        activeTab === tab
                            ? 'border-cyan-500 text-cyan-400'
                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                >
                    {tab}
                </button>
            ))}
        </nav>
    </div>
);

// =================================================================================================
// AI-POWERED COMPONENTS
// =================================================================================================

const AiContractAnalysisTool: React.FC = () => {
    const [contractText, setContractText] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AiAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!contractText.trim()) return;
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        toast.loading('AI analysis in progress...');

        try {
            // This is a simulation. In a real app, ensure API key is securely managed.
            if (!process.env.API_KEY) {
                throw new Error("API key is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are a sophisticated legal AI assistant for a Fortune 500 company. Analyze the following contract text.
                Provide the output in a structured JSON format with keys: "summary", "riskAssessment", "extractedTerms", "obligations".
                
                - "summary": A concise, one-paragraph summary of the agreement's purpose, key deliverables, and commercial terms.
                - "riskAssessment": An object with "level" ('Low', 'Medium', 'High', 'Critical') and "details" (an array of strings explaining potential legal, financial, and operational risks).
                - "extractedTerms": An object of key-value pairs for critical terms like "Term Length", "Governing Law", "Liability Cap", "Payment Terms", "Renewal Notice Period", "IP Ownership".
                - "obligations": An array of objects, each with "party" ('Our Company' or 'Counterparty') and "obligation" (a string describing a key non-standard or critical obligation).
                
                Contract Text:
                ---
                ${contractText}
                ---
            `;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const jsonResponse = JSON.parse(response.text.replace(/```json|```/g, '').trim());
            setAnalysisResult(jsonResponse);
            toast.dismiss();
            toast.success('AI analysis complete!');
        } catch (e) {
            console.error("AI Analysis Error:", e);
            setError("Failed to analyze the contract. The AI model may be unavailable or the response was invalid.");
            setAnalysisResult(null);
            toast.dismiss();
            toast.error("AI analysis failed.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card title="AI Contract Analyzer" icon={Sparkles}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="text-white font-semibold">Paste Contract Text</h4>
                    <textarea 
                        className="w-full h-96 bg-gray-900/50 p-3 rounded text-white text-sm font-mono resize-y border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder="Paste the full text of a contract here for analysis..."
                        value={contractText}
                        onChange={e => setContractText(e.target.value)}
                    />
                    <button onClick={handleAnalyze} disabled={isLoading || !contractText} className="w-full flex items-center justify-center space-x-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                        <Icon name={Sparkles} />
                        <span>{isLoading ? 'Analyzing...' : 'Run AI Analysis'}</span>
                    </button>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg overflow-y-auto h-[488px] border border-gray-700">
                    <h4 className="text-white font-semibold mb-4">Analysis Results</h4>
                    {isLoading && <p className="text-cyan-400">AI is analyzing the document...</p>}
                    {error && <p className="text-red-400">{error}</p>}
                    {analysisResult ? (
                        <div className="space-y-4 text-sm">
                            <div>
                                <h5 className="font-bold text-gray-300">Summary</h5>
                                <p className="text-gray-400">{analysisResult.summary}</p>
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-300">Risk Assessment</h5>
                                <p className={`font-bold ${getRiskColor(analysisResult.riskAssessment.level)}`}>
                                    Level: {analysisResult.riskAssessment.level}
                                </p>
                                <ul className="list-disc list-inside text-gray-400 pl-2">
                                    {analysisResult.riskAssessment.details.map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h5 className="font-bold text-gray-300">Key Terms</h5>
                                <ul className="text-gray-400 grid grid-cols-2 gap-x-4">
                                    {Object.entries(analysisResult.extractedTerms).map(([key, value]) => (
                                        <li key={key}><strong className="text-gray-200">{key}:</strong> {value}</li>
                                    ))}
                                </ul>
                            </div>
                             <div>
                                <h5 className="font-bold text-gray-300">Key Obligations</h5>
                                <ul className="list-disc list-inside text-gray-400 pl-2">
                                    {analysisResult.obligations.map((o, i) => (
                                        <li key={i}><strong>{o.party}:</strong> {o.obligation}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : !isLoading && !error && (
                        <div className="text-center text-gray-500 pt-20">
                            <Icon name={Bot} className="w-16 h-16 mx-auto mb-4" />
                            <p>Analysis results will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

const AiClauseComparisonTool: React.FC<{ clauseLibrary: StandardClause[] }> = ({ clauseLibrary }) => {
    const [externalClause, setExternalClause] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ClauseCategory>('Liability');
    const [comparisonResult, setComparisonResult] = useState<{ similarity: number; recommendation: string; risk: RiskLevel } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCompare = async () => {
        if (!externalClause.trim()) return;
        setIsLoading(true);
        setComparisonResult(null);
        toast.loading('Comparing clauses...');
        
        const standardClause = clauseLibrary.find(c => c.category === selectedCategory && c.isPreferred);
        if (!standardClause) {
            toast.error(`No preferred standard clause found for ${selectedCategory}.`);
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
                You are a legal AI assistant. Compare the "External Clause" against our "Standard Clause" for the same category.
                Provide a JSON response with keys: "similarity" (a score from 0 to 100), "recommendation" (a detailed explanation of the differences and a recommendation for redlining), and "risk" ('Low', 'Medium', 'High', or 'Critical').

                Standard Clause (${standardClause.category}):
                ---
                ${standardClause.content}
                ---

                External Clause:
                ---
                ${externalClause}
                ---
            `;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const jsonResponse = JSON.parse(response.text.replace(/```json|```/g, '').trim());
            setComparisonResult(jsonResponse);
            toast.dismiss();
            toast.success('Comparison complete!');
        } catch (e) {
            console.error(e);
            toast.dismiss();
            toast.error('Failed to compare clauses.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="AI Clause Comparator" icon={ChevronsUpDown}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-white font-semibold mb-2">Standard Clause Library</h4>
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value as ClauseCategory)}
                        className="w-full bg-gray-900/50 p-2 rounded border border-gray-700 text-white mb-2"
                    >
                        {Array.from(new Set(clauseLibrary.map(c => c.category))).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <div className="h-40 bg-gray-800 p-3 rounded text-xs text-gray-300 overflow-y-auto font-mono border border-gray-700">
                        {clauseLibrary.find(c => c.category === selectedCategory && c.isPreferred)?.content || "No preferred clause selected."}
                    </div>
                </div>
                <div>
                     <h4 className="text-white font-semibold mb-2">External Clause</h4>
                    <textarea 
                        className="w-full h-48 bg-gray-900/50 p-3 rounded text-sm text-white resize-y border border-gray-700"
                        placeholder="Paste external clause here..."
                        value={externalClause}
                        onChange={e => setExternalClause(e.target.value)}
                    />
                </div>
            </div>
            <button onClick={handleCompare} disabled={isLoading || !externalClause} className="mt-4 w-full flex items-center justify-center space-x-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                <Icon name={ChevronsUpDown} />
                <span>{isLoading ? 'Comparing...' : 'Compare Clauses'}</span>
            </button>
            {comparisonResult && (
                <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <h4 className="text-white font-semibold">Comparison Result</h4>
                    <div className="flex items-center space-x-4 mt-2">
                        <p><strong>Similarity:</strong> {comparisonResult.similarity}%</p>
                        <p><strong>Risk Level:</strong> <span className={getRiskColor(comparisonResult.risk)}>{comparisonResult.risk}</span></p>
                    </div>
                    <p className="mt-2 text-gray-300"><strong>Recommendation:</strong></p>
                    <p className="text-gray-400 text-sm whitespace-pre-wrap">{comparisonResult.recommendation}</p>
                </div>
            )}
        </Card>
    );
};

// =================================================================================================
// VIEWS / TABS
// =================================================================================================

const DashboardView: React.FC<{ contracts: Contract[], tasks: ComplianceTask[] }> = ({ contracts, tasks }) => {
    const dashboardMetrics = useMemo(() => {
        const now = new Date();
        const nextQuarter = addMonths(now, 3);
        return {
            active: contracts.filter(c => c.status === 'Active').length,
            pending: contracts.filter(c => ['Under Review', 'Pending Signature'].includes(c.status)).length,
            renewals: contracts.filter(c => c.renewalDate && isBefore(parseISO(c.renewalDate), nextQuarter)).length,
            overdueTasks: tasks.filter(t => t.status === 'Overdue').length,
        };
    }, [contracts, tasks]);

    const contractsByStatus = useMemo(() => {
        const statusCounts = contracts.reduce((acc, c) => {
            acc[c.status] = (acc[c.status] || 0) + 1;
            return acc;
        }, {} as Record<ContractStatus, number>);
        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [contracts]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Active Contracts" value={dashboardMetrics.active} icon={FileText} />
                <MetricCard title="Pending Review" value={dashboardMetrics.pending} icon={Clock} />
                <MetricCard title="Renewals (Next 90 Days)" value={dashboardMetrics.renewals} icon={Calendar} />
                <MetricCard title="Overdue Tasks" value={dashboardMetrics.overdueTasks} icon={AlertTriangle} />
            </div>
            <Card title="Contract Overview">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={contractsByStatus}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }} />
                        <Legend />
                        <Bar dataKey="value" fill="#22d3ee" name="Number of Contracts" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
            {/* Add more charts and widgets here */}
        </div>
    );
};

const ContractListView: React.FC<{ contracts: Contract[], onContractClick: (contract: Contract) => void }> = ({ contracts, onContractClick }) => {
    // Basic filtering and search state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ContractStatus | 'All'>('All');
    
    const filteredContracts = useMemo(() => {
        return contracts.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  LegalSuiteApiService.getCounterpartyById(c.counterpartyId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [contracts, searchTerm, statusFilter]);

    return (
        <Card title="Contract Repository">
            <div className="flex justify-between items-center mb-4 p-4 bg-gray-900/50 rounded-lg">
                <div className="relative">
                    <Icon name={Search} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search contracts or counterparties..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Icon name={Filter} className="text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2"
                    >
                        <option value="All">All Statuses</option>
                        {Array.from(new Set(contracts.map(c => c.status))).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr>
                            <th className="px-6 py-3">Contract Name</th>
                            <th className="px-6 py-3">Counterparty</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Value</th>
                            <th className="px-6 py-3">Renewal Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContracts.map(c => (
                            <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer" onClick={() => onContractClick(c)}>
                                <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                                <td className="px-6 py-4">{LegalSuiteApiService.getCounterpartyById(c.counterpartyId)?.name || 'N/A'}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(c.status)}`}>{c.status}</span></td>
                                <td className="px-6 py-4">{c.type}</td>
                                <td className="px-6 py-4 text-white font-mono">{formatCurrency(c.value, c.currency)}</td>
                                <td className="px-6 py-4">{formatDate(c.renewalDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredContracts.length === 0 && <p className="text-center py-8 text-gray-500">No contracts match your criteria.</p>}
            </div>
        </Card>
    );
};

const ComplianceTrackerView: React.FC<{ tasks: ComplianceTask[] }> = ({ tasks }) => (
    <Card title="Compliance Dashboard">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                    <tr>
                        <th className="px-6 py-3">Task</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Priority</th>
                        <th className="px-6 py-3">Due Date</th>
                        <th className="px-6 py-3">Owner</th>
                        <th className="px-6 py-3">Related Contract</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.sort((a,b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime()).map(task => (
                        <tr key={task.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="px-6 py-4 font-medium text-white">{task.name}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>{task.status}</span></td>
                            <td className="px-6 py-4">{task.priority}</td>
                            <td className="px-6 py-4">{formatDate(task.dueDate)}</td>
                            <td className="px-6 py-4">{LegalSuiteApiService.getLawyerById(task.ownerId)?.name || 'N/A'}</td>
                            <td className="px-6 py-4">{mockContracts.find(c => c.id === task.relatedContractId)?.name || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const ClauseLibraryView: React.FC<{ clauses: StandardClause[] }> = ({ clauses }) => (
    <Card title="Standard Clause Library">
        <div className="space-y-4">
            {clauses.map(clause => (
                <div key={clause.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-white flex items-center">{clause.title} {clause.isPreferred && <span className="ml-2 text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">Preferred</span>}</h4>
                    <p className="text-xs text-gray-400">({clause.category} / v{clause.version})</p>
                    <p className="text-xs text-gray-500 mt-1 mb-2">Guidelines: {clause.usageGuidelines}</p>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-gray-800 p-3 rounded">{clause.content}</pre>
                </div>
            ))}
        </div>
    </Card>
);

const AiToolsView: React.FC<{ clauses: StandardClause[] }> = ({ clauses }) => (
    <div className="space-y-6">
        <AiContractAnalysisTool />
        <AiClauseComparisonTool clauseLibrary={clauses} />
    </div>
);

// =================================================================================================
// MODAL & DETAIL VIEWS
// =================================================================================================

const ContractDetailView: React.FC<{ contractId: string; onClose: () => void }> = ({ contractId, onClose }) => {
    const [contract, setContract] = useState<Contract | null>(null);
    const [details, setDetails] = useState<{ auditLog: AuditLogEntry[], timeline: ContractTimelineEvent[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const [contractData, detailData] = await Promise.all([
                LegalSuiteApiService.fetchContractById(contractId),
                LegalSuiteApiService.fetchContractDetails(contractId),
            ]);
            setContract(contractData || null);
            setDetails(detailData);
            setIsLoading(false);
        };
        loadData();
    }, [contractId]);

    if (isLoading || !contract) {
        return (
             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
                <LoadingSpinner />
            </div>
        )
    }

    const counterparty = LegalSuiteApiService.getCounterpartyById(contract.counterpartyId);
    const lawyer = LegalSuiteApiService.getLawyerById(contract.assignedLawyerId);
    const tabs = ['Overview', 'Documents', 'Timeline', 'AI Insights', 'Audit Log'];

    const InfoItem: React.FC<{icon: React.ElementType, label: string, value: React.ReactNode}> = ({icon, label, value}) => (
        <div className="flex items-start space-x-3">
            <Icon name={icon} className="text-gray-400 mt-1 flex-shrink-0" />
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm text-white">{value}</p>
            </div>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-5xl w-full border border-gray-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-white">{contract.name}</h3>
                        <p className="text-sm text-gray-400">{contract.type} with {counterparty?.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <div className="p-6">
                        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
                    </div>
                    <div className="px-6 pb-6">
                        {activeTab === 'Overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <h4 className="text-white font-semibold">Key Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoItem icon={FileText} label="Status" value={<span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contract.status)}`}>{contract.status}</span>} />
                                        <InfoItem icon={DollarSign} label="Annual Value" value={formatCurrency(contract.value, contract.currency)} />
                                        <InfoItem icon={Calendar} label="Effective Date" value={formatDate(contract.startDate)} />
                                        <InfoItem icon={FileClock} label="Renewal Date" value={formatDate(contract.renewalDate)} />
                                        <InfoItem icon={AlertTriangle} label="Risk Level" value={<span className={getRiskColor(contract.riskLevel)}>{contract.riskLevel}</span>} />
                                    </div>
                                    <h4 className="text-white font-semibold pt-4">Description</h4>
                                    <p className="text-sm text-gray-300">{contract.description}</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-white font-semibold">Parties</h4>
                                    <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                                        <InfoItem icon={Building} label="Counterparty" value={counterparty?.name} />
                                        <InfoItem icon={User} label="Contact" value={counterparty?.contactPerson} />
                                        <InfoItem icon={Mail} label="Email" value={counterparty?.contactEmail} />
                                    </div>
                                    <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                                        <InfoItem icon={Shield} label="Assigned Lawyer" value={lawyer?.name} />
                                        <InfoItem icon={Mail} label="Email" value={lawyer?.email} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Other tab contents would go here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

// =================================================================================================
// MAIN VIEW COMPONENT
// =================================================================================================

const DemoBankLegalSuiteView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
    const { contracts, tasks, clauses, isLoading } = useLegalData();
    
    const tabs = ['Dashboard', 'Contracts', 'Compliance', 'Clause Library', 'AI Tools'];

    const handleContractClick = useCallback((contract: Contract) => {
        setSelectedContractId(contract.id);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedContractId(null);
    }, []);

    return (
        <>
            <Toaster position="top-right" toastOptions={{
                style: { background: '#333', color: '#fff' },
            }} />
            <div className="space-y-6">
                <PageHeader title="Demo Bank Legal Suite">
                    <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                        <Icon name={FilePlus2} />
                        <span>New Contract</span>
                    </button>
                </PageHeader>
                
                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

                <div className="mt-6">
                    {isLoading ? <LoadingSpinner /> : (
                        <>
                            {activeTab === 'Dashboard' && <DashboardView contracts={contracts} tasks={tasks} />}
                            {activeTab === 'Contracts' && <ContractListView contracts={contracts} onContractClick={handleContractClick} />}
                            {activeTab === 'Compliance' && <ComplianceTrackerView tasks={tasks} />}
                            {activeTab === 'Clause Library' && <ClauseLibraryView clauses={clauses} />}
                            {activeTab === 'AI Tools' && <AiToolsView clauses={clauses} />}
                        </>
                    )}
                </div>
            </div>

            {selectedContractId && <ContractDetailView contractId={selectedContractId} onClose={handleCloseModal} />}
        </>
    );
};

export default DemoBankLegalSuiteView;