// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/finance/LoanApplicationsView.tsx
================================================================================

// components/views/megadashboard/finance/LoanApplicationsView.tsx
import React from 'react';
import Card from '../../../Card';

const LoanApplicationsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Loan Origination System</h2>
            <Card title="Mission Brief">
                <p className="text-gray-400">An AI-powered loan origination and management system built for speed and precision. Automate underwriting, scoring, and document verification to accelerate the entire lending lifecycle from application to closing.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="AI Pre-Approval Scoring"><p>Get an instant, AI-driven risk assessment and pre-approval decision for new applications, cutting review times from days to seconds.</p></Card>
                <Card title="Risk-Adjusted Loan Offers"><p>Automatically generate personalized loan offers with terms dynamically adjusted for the applicant's holistic risk profile.</p></Card>
                <Card title="Predictive Default Monitoring"><p>Our AI models continuously monitor active loans to predict and flag potential defaults months before they occur, enabling proactive intervention.</p></Card>
            </div>
        </div>
    );
};

export default LoanApplicationsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/finance/LoanApplicationsView.tsx
================================================================================

```tsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Card from '../../../Card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler, TimeScale } from 'chart.js';
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    AcademicCapIcon, AdjustmentsVerticalIcon, ArchiveBoxIcon, ArrowDownTrayIcon, ArrowPathIcon, ArrowPathRoundedSquareIcon,
    ArrowTopRightOnSquareIcon, ArrowUpOnSquareStackIcon, BanknotesIcon, Bars3Icon, BeakerIcon, BellIcon, BoltIcon, BookmarkIcon,
    BriefcaseIcon, BugAntIcon, BuildingOffice2Icon, BuildingOfficeIcon, CalendarDaysIcon, CalendarIcon, ChartBarIcon,
    ChartBarSquareIcon, ChartLineUpIcon, ChartPieIcon, ChatBubbleLeftEllipsisIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon,
    ClipboardDocumentCheckIcon, ClipboardDocumentIcon, ClipboardDocumentListIcon, ClockIcon, CloudArrowDownIcon, CloudArrowUpIcon,
    CloudIcon, CodeBracketIcon, CodeBracketSquareIcon, Cog6ToothIcon, ComputerDesktopIcon, CreditCardIcon, CubeIcon,
    CubeTransparentIcon, CurrencyDollarIcon, CurrencyEuroIcon, CursorArrowRaysIcon, DevicePhoneIcon, DocumentChartBarIcon,
    DocumentDuplicateIcon, DocumentMagnifyingGlassIcon, DocumentTextIcon, EllipsisVerticalIcon, EnvelopeIcon, EnvelopeOpenIcon,
    ExclamationTriangleIcon, EyeIcon, FingerPrintIcon, FolderIcon, FunnelIcon, GiftIcon, GlobeAltIcon, GlobeAmericasIcon,
    HandThumbDownIcon, HandThumbUpIcon, HeadphonesIcon, InboxArrowDownIcon, InboxStackIcon, InformationCircleIcon, KeyIcon,
    LightBulbIcon, LinkIcon, ListBulletIcon, LockClosedIcon, MagnifyingGlassIcon, MegaphoneIcon, MicrophoneIcon, MoonIcon,
    PaintBrushIcon, PaperClipIcon, PencilSquareIcon, PhotoIcon, PlayCircleIcon, PlusIcon, PowerIcon, PresentationChartBarIcon,
    PresentationChartLineIcon, PuzzlePieceIcon, QrCodeIcon, QuestionMarkCircleIcon, QueueListIcon, ReceiptPercentIcon,
    RectangleGroupIcon, RocketLaunchIcon, ScaleIcon, ServerIcon, ServerStackIcon, ShareIcon, ShieldCheckIcon, ShieldExclamationIcon,
    SparklesIcon, SpeakerWaveIcon, Square3Stack3DIcon, StarIcon, SunIcon, SwatchIcon, TableCellsIcon, TagIcon, TicketIcon,
    TrashIcon, TruckIcon, TvIcon, UserCircleIcon, UserGroupIcon, UsersIcon, VariableIcon, VideoCameraIcon, WalletIcon, WifiIcon,
    WindowIcon, XCircleIcon
} from '@heroicons/react/24/outline';


// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale
);

// --- Constants and Enums ---
export enum ApplicationStatus {
    PENDING_REVIEW = 'PENDING_REVIEW',
    AI_PRE_SCREEN = 'AI_PRE_SCREEN',
    DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION',
    UNDERWRITING = 'UNDERWRITING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    FUNDED = 'FUNDED',
    WITHDRAWN = 'WITHDRAWN',
    CLOSED = 'CLOSED',
    ON_HOLD = 'ON_HOLD',
    PENDING_CUSTOMER_ACTION = 'PENDING_CUSTOMER_ACTION',
    ESCALATED = 'ESCALATED',
    COLLECTION = 'COLLECTION',
    REFINANCED = 'REFINANCED',
}

export enum LoanType {
    PERSONAL = 'PERSONAL',
    BUSINESS = 'BUSINESS',
    MORTGAGE = 'MORTGAGE',
    AUTO = 'AUTO',
    STUDENT = 'STUDENT',
    SME = 'SME',
    COMMERCIAL_REAL_ESTATE = 'COMMERCIAL_REAL_ESTATE',
    EQUIPMENT_FINANCE = 'EQUIPMENT_FINANCE',
    INVOICE_FINANCE = 'INVOICE_FINANCE',
    MICRO_LOAN = 'MICRO_LOAN',
    REVOLVING_CREDIT = 'REVOLVING_CREDIT',
    BRIDGE_LOAN = 'BRIDGE_LOAN',
}

export enum RiskLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
    UNKNOWN = 'UNKNOWN',
}

export enum DocumentType {
    IDENTIFICATION = 'IDENTIFICATION',
    PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
    INCOME_STATEMENT = 'INCOME_STATEMENT',
    BANK_STATEMENT = 'BANK_STATEMENT',
    BUSINESS_PLAN = 'BUSINESS_PLAN',
    COLLATERAL_DOCS = 'COLLATERAL_DOCS',
    CREDIT_REPORT = 'CREDIT_REPORT',
    TAX_RETURNS = 'TAX_RETURNS',
    LEASE_AGREEMENT = 'LEASE_AGREEMENT',
    INVOICES = 'INVOICES',
    OTHER = 'OTHER',
}

export enum PaymentStatus {
    PAID = 'PAID',
    PARTIAL = 'PARTIAL',
    DUE = 'DUE',
    OVERDUE = 'OVERDUE',
    SETTLED = 'SETTLED',
    DEFAULTED = 'DEFAULTED',
    PENDING = 'PENDING',
}

export const API_BASE_URL = '/api/loan-origination';
export const ITEMS_PER_PAGE = 10;

// --- Interfaces for Data Models ---
export interface LoanApplicant {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    nationality: string;
    nationalId: string;
    employmentStatus: string;
    annualIncome: number;
    dependents: number;
    creditScore: number;
    existingDebts: number;
    assetsValue: number;
    businessType?: string;
    yearsInBusiness?: number;
    registrationNumber?: string;
}

export interface LoanApplication {
    id: string;
    applicantId: string;
    applicantName: string; // Denormalized for display
    loanType: LoanType;
    amountRequested: number;
    termMonths: number;
    purpose: string;
    applicationDate: string;
    status: ApplicationStatus;
    aiScore: number;
    riskLevel: RiskLevel;
    assignedUnderwriterId?: string;
    assignedUnderwriterName?: string;
    lastUpdated: string;
    rejectionReason?: string;
    offerDetails?: LoanOffer;
    documents: LoanDocument[];
    notes: ApplicationNote[];
    auditTrail: AuditLog[];
    relatedTasks: LoanTask[];
    paymentSchedule?: LoanPayment[];
    collateralDetails?: Collateral[];
    sourceChannel: string; // e.g., 'Website', 'Partner API', 'Referral'
    marketingCampaignId?: string;
    processingFee?: number;
    insurancePremium?: number;
    decisionEngineOutput?: DecisionEngineOutput;
    complianceChecks?: ComplianceCheck[];
    fraudDetectionScore?: number;
    sentimentAnalysisScore?: number; // from applicant communications
    recommendedAction?: string; // AI recommendation
    customFields?: { [key: string]: string };
    debtToIncomeRatio?: number;
    loanToValueRatio?: number;
    communicationLogs: CommunicationLog[];
}

export interface LoanOffer {
    loanApplicationId: string;
    offeredAmount: number;
    interestRate: number;
    annualPercentageRate: number;
    termMonths: number;
    monthlyPayment: number;
    totalRepayment: number;
    acceptanceDeadline: string;
    offerDate: string;
    offerStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    conditions: string[];
    fees: { type: string; amount: number }[];
    amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
    month: number;
    startingBalance: number;
    interestPayment: number;
    principalPayment: number;
    totalPayment: number;
    endingBalance: number;
}

export interface LoanDocument {
    id: string;
    loanApplicationId: string;
    documentType: DocumentType;
    fileName: string;
    fileUrl: string;
    uploadDate: string;
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MISSING';
    verificationNotes?: string;
    uploadedBy: string;
    checksum?: string;
    ocrData?: { [key: string]: string }; // Extracted data from OCR
    signatureStatus?: 'SIGNED' | 'PENDING_SIGNATURE' | 'NOT_REQUIRED';
    aiVerificationScore?: number;
    sensitiveDataMasked?: boolean;
}

export interface ApplicationNote {
    id: string;
    loanApplicationId: string;
    authorId: string;
    authorName: string;
    timestamp: string;
    content: string;
    isPrivate: boolean;
    tags: string[];
}

export interface AuditLog {
    id: string;
    loanApplicationId: string;
    timestamp: string;
    userId: string;
    userName: string;
    action: string; // e.g., 'STATUS_CHANGE', 'DOCUMENT_UPLOAD', 'NOTE_ADDED'
    details: string;
    ipAddress?: string;
}

export interface LoanTask {
    id: string;
    loanApplicationId: string;
    title: string;
    description: string;
    assignedToId: string;
    assignedToName: string;
    dueDate: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    creationDate: string;
    completionDate?: string;
    relatedDocumentId?: string;
}

export interface LoanPayment {
    id: string;
    loanApplicationId: string;
    paymentNumber: number;
    dueDate: string;
    amountDue: number;
    amountPaid: number;
    paymentDate?: string;
    status: PaymentStatus;
    principalAmount: number;
    interestAmount: number;
    penaltyFee?: number;
    remainingBalance: number;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'UNDERWRITER' | 'SALES' | 'COLLECTIONS' | 'COMPLIANCE' | 'CUSTOMER_SERVICE' | 'DATA_ANALYST';
    firstName: string;
    lastName: string;
    isActive: boolean;
    lastLogin: string;
    assignedApplicationsCount: number;
    permissions: string[];
}

export interface Collateral {
    id: string;
    loanApplicationId: string;
    type: string; // e.g., 'Real Estate', 'Vehicle', 'Equipment'
    description: string;
    estimatedValue: number;
    valuationDate: string;
    lienStatus: 'CLEAR' | 'ENCUMBERED';
    documentIds: string[]; // IDs of related documents
    valuationReportUrl?: string;
    insurancePolicyNumber?: string;
    riskAssessment?: RiskLevel;
}

export interface DecisionEngineOutput {
    decision: 'APPROVE' | 'REJECT' | 'REFER';
    reasonCodes: string[];
    riskScore: number;
    recommendedLoanAmount?: number;
    recommendedInterestRate?: number;
    modelVersion: string;
    timestamp: string;
    rulesTriggered: string[];
    confidenceScore: number;
}

export interface ComplianceCheck {
    id: string;
    loanApplicationId: string;
    checkType: string; // e.g., 'AML', 'KYC', 'GDPR', 'Fair Lending'
    status: 'PASSED' | 'FAILED' | 'PENDING';
    details: string;
    checkedBy: string;
    checkDate: string;
    remediationActions?: string[];
    severity?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Alert {
    id: string;
    loanApplicationId?: string;
    type: 'FRAUD' | 'HIGH_RISK_CHANGE' | 'DEFAULT_PREDICTION' | 'COMPLIANCE_BREACH' | 'SYSTEM_ERROR' | 'ANOMALY';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    timestamp: string;
    resolved: boolean;
    resolvedBy?: string;
    resolutionNotes?: string;
    triggerDetails: { [key: string]: any }; // Detailed context for the alert
}

export interface CommunicationLog {
    id: string;
    loanApplicationId: string;
    timestamp: string;
    type: 'EMAIL_IN' | 'EMAIL_OUT' | 'CALL' | 'SMS' | 'CHAT';
    author: string;
    subject?: string;
    content: string;
    sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    aiSummary?: string;
}

export interface CreditReport {
    provider: 'Experian' | 'Equifax' | 'TransUnion';
    reportDate: string;
    score: number;
    inquiries: number;
    publicRecords: number;
    openAccounts: number;
    creditUtilization: number;
    paymentHistory: {
        totalAccounts: number;
        onTimePayments: number;
        latePayments: number;
    };
    debtSummary: {
        totalDebt: number;
        revolvingDebt: number;
        mortgageDebt: number;
    };
    alerts: string[];
}


// --- Mock Data Service (Replace with actual API calls in production) ---
const mockApplications: LoanApplication[] = Array.from({ length: 50 }, (_, i) => ({
    id: `app-${i + 1}`,
    applicantId: `user-${i + 1}`,
    applicantName: `John Doe ${i + 1}`,
    loanType: Object.values(LoanType)[Math.floor(Math.random() * Object.values(LoanType).length)],
    amountRequested: 10000 + i * 500,
    termMonths: 12 + (i % 24),
    purpose: `Personal loan for home improvement ${i + 1}`,
    applicationDate: new Date(Date.now() - i * 86400000).toISOString(),
    status: Object.values(ApplicationStatus)[Math.floor(Math.random() * Object.values(ApplicationStatus).length)],
    aiScore: 300 + i * 10,
    riskLevel: Object.values(RiskLevel)[Math.floor(Math.random() * Object.values(RiskLevel).length)],
    assignedUnderwriterId: `uw-${(i % 5) + 1}`,
    assignedUnderwriterName: `Underwriter ${Math.floor(Math.random() * 5) + 1}`,
    lastUpdated: new Date(Date.now() - i * 3600000).toISOString(),
    documents: [],
    notes: [],
    auditTrail: [],
    relatedTasks: [],
    communicationLogs: [],
    sourceChannel: Math.random() > 0.5 ? 'Website' : 'Partner API',
    fraudDetectionScore: Math.random() * 100,
    sentimentAnalysisScore: Math.random() * 2 - 1,
    recommendedAction: Math.random() > 0.7 ? 'Approve' : 'Refer to Senior UW',
    debtToIncomeRatio: parseFloat((Math.random() * 0.5).toFixed(2)),
    loanToValueRatio: Math.random() > 0.5 ? parseFloat((Math.random() * 0.9).toFixed(2)) : undefined,
    complianceChecks: [],
    decisionEngineOutput: {
        decision: Math.random() > 0.7 ? 'APPROVE' : Math.random() > 0.5 ? 'REJECT' : 'REFER',
        reasonCodes: ['CRITICAL_RISK', 'LOW_CREDIT_SCORE', 'INSUFFICIENT_INCOME'],
        riskScore: Math.floor(Math.random() * 1000),
        modelVersion: 'v1.2.3',
        timestamp: new Date().toISOString(),
        rulesTriggered: ['Rule_A', 'Rule_B'],
        confidenceScore: Math.random(),
    },
    offerDetails: i % 3 === 0 ? {
        loanApplicationId: `app-${i + 1}`,
        offeredAmount: 10000 + i * 450,
        interestRate: parseFloat((0.05 + Math.random() * 0.1).toFixed(4)),
        annualPercentageRate: parseFloat((0.07 + Math.random() * 0.1).toFixed(4)),
        termMonths: 12 + (i % 24),
        monthlyPayment: 500 + i * 10,
        totalRepayment: 12000 + i * 1500,
        acceptanceDeadline: new Date(Date.now() + 7 * 86400000).toISOString(),
        offerDate: new Date().toISOString(),
        offerStatus: 'PENDING',
        conditions: ['Provide additional ID', 'Sign digital agreement'],
        fees: [{ type: 'Origination', amount: 250 }],
        amortizationSchedule: [], // Filled dynamically
    } : undefined,
}));

const mockUnderwriters: UserProfile[] = Array.from({ length: 5 }, (_, i) => ({
    id: `uw-${i + 1}`,
    username: `underwriter${i + 1}`,
    email: `uw${i + 1}@example.com`,
    role: 'UNDERWRITER',
    firstName: `Underwriter ${i + 1}`,
    lastName: `Lastname ${i + 1}`,
    isActive: true,
    lastLogin: new Date().toISOString(),
    assignedApplicationsCount: Math.floor(Math.random() * 10),
    permissions: ['view_all_applications', 'approve_loans', 'reject_loans', 'add_notes', 'assign_tasks'],
}));

const mockAlerts: Alert[] = Array.from({ length: 15 }, (_, i) => ({
    id: `alert-${i + 1}`,
    loanApplicationId: `app-${i + 1}`,
    type: ['FRAUD', 'HIGH_RISK_CHANGE', 'DEFAULT_PREDICTION', 'COMPLIANCE_BREACH', 'SYSTEM_ERROR', 'ANOMALY'][i % 6] as any,
    severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 4] as any,
    message: `Alert message for application ${i + 1}: Something happened.`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    resolved: i % 3 === 0,
    triggerDetails: { field: 'income', oldValue: 50000, newValue: 10000 },
}));

const generateAmortizationSchedule = (principal: number, annualInterestRate: number, termMonths: number): AmortizationEntry[] => {
    const monthlyInterestRate = annualInterestRate / 12;
    const monthlyPayment = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths)) / (Math.pow(1 + monthlyInterestRate, termMonths) - 1);
    const schedule: AmortizationEntry[] = [];
    let remainingBalance = principal;
    for (let month = 1; month <= termMonths; month++) {
        const interestPayment = remainingBalance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        schedule.push({
            month,
            startingBalance: parseFloat((remainingBalance + principalPayment).toFixed(2)),
            interestPayment: parseFloat(interestPayment.toFixed(2)),
            principalPayment: parseFloat(principalPayment.toFixed(2)),
            totalPayment: parseFloat(monthlyPayment.toFixed(2)),
            endingBalance: parseFloat(remainingBalance.toFixed(2))
        });
    }
    return schedule;
};


const fetchApplications = async (page: number, limit: number, filters: any, sort: any): Promise<{ applications: LoanApplication[]; total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = mockApplications;
    // ... (filtering and sorting logic remains the same)
    if (filters.status) filtered = filtered.filter(app => app.status === filters.status);
    if (filters.loanType) filtered = filtered.filter(app => app.loanType === filters.loanType);
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(app =>
            app.applicantName.toLowerCase().includes(searchTerm) ||
            app.id.toLowerCase().includes(searchTerm) ||
            app.purpose.toLowerCase().includes(searchTerm)
        );
    }
    if (filters.minAmount) filtered = filtered.filter(app => app.amountRequested >= filters.minAmount);
    if (filters.maxAmount) filtered = filtered.filter(app => app.amountRequested <= filters.maxAmount);
    if (filters.riskLevel) filtered = filtered.filter(app => app.riskLevel === filters.riskLevel);
    if (filters.underwriterId) filtered = filtered.filter(app => app.assignedUnderwriterId === filters.underwriterId);
    if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const start = new Date(filters.dateRange.startDate);
        const end = new Date(filters.dateRange.endDate);
        filtered = filtered.filter(app => {
            const appDate = new Date(app.applicationDate);
            return appDate >= start && appDate <= end;
        });
    }

    if (sort.field && sort.direction) {
        filtered.sort((a, b) => {
            const aValue = a[sort.field as keyof LoanApplication];
            const bValue = b[sort.field as keyof LoanApplication];
            if (typeof aValue === 'string' && typeof bValue === 'string') return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            if (typeof aValue === 'number' && typeof bValue === 'number') return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
            return 0;
        });
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    return { applications: filtered.slice(start, end), total: filtered.length };
};

const fetchApplicationById = async (id: string): Promise<LoanApplication> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const app = mockApplications.find(app => app.id === id);
    if (!app) throw new Error('Application not found');
    if (app.offerDetails && app.offerDetails.amortizationSchedule.length === 0) {
        app.offerDetails.amortizationSchedule = generateAmortizationSchedule(app.offerDetails.offeredAmount, app.offerDetails.interestRate, app.offerDetails.termMonths);
    }
    return app;
};

const updateApplication = async (updatedApp: LoanApplication): Promise<LoanApplication> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockApplications.findIndex(app => app.id === updatedApp.id);
    if (index > -1) {
        mockApplications[index] = { ...mockApplications[index], ...updatedApp, lastUpdated: new Date().toISOString() };
        return mockApplications[index];
    }
    throw new Error('Application not found for update');
};

const createApplication = async (newApp: Partial<LoanApplication>): Promise<LoanApplication> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const application: LoanApplication = {
        id: `app-${mockApplications.length + 1}`,
        applicantId: newApp.applicantId || `temp-user-${mockApplications.length + 1}`,
        applicantName: newApp.applicantName || 'New Applicant',
        loanType: newApp.loanType || LoanType.PERSONAL,
        amountRequested: newApp.amountRequested || 0,
        termMonths: newApp.termMonths || 0,
        purpose: newApp.purpose || 'Not specified',
        applicationDate: new Date().toISOString(),
        status: ApplicationStatus.PENDING_REVIEW,
        aiScore: 0,
        riskLevel: RiskLevel.UNKNOWN,
        lastUpdated: new Date().toISOString(),
        documents: [], notes: [], auditTrail: [], relatedTasks: [], communicationLogs: [],
        sourceChannel: newApp.sourceChannel || 'Manual Entry',
        fraudDetectionScore: 0,
        sentimentAnalysisScore: 0,
        recommendedAction: 'Process manually',
        complianceChecks: [],
        decisionEngineOutput: {
            decision: 'REFER',
            reasonCodes: ['MANUAL_ENTRY'],
            riskScore: 0,
            modelVersion: 'v0.0.1',
            timestamp: new Date().toISOString(),
            rulesTriggered: [],
            confidenceScore: 0,
        },
        ...newApp,
    };
    mockApplications.unshift(application);
    return application;
};

const fetchUnderwriters = async (): Promise<UserProfile[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUnderwriters.filter(uw => uw.role === 'UNDERWRITER');
};

const fetchAlerts = async (): Promise<Alert[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAlerts.filter(alert => !alert.resolved);
}

const fetchCreditReport = async (applicantId: string): Promise<CreditReport> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    // Simulate fetching a credit report for a given applicant
    const seed = applicantId.split('-')[1] ? parseInt(applicantId.split('-')[1], 10) : 1;
    return {
        provider: ['Experian', 'Equifax', 'TransUnion'][seed % 3] as any,
        reportDate: new Date().toISOString(),
        score: 600 + (seed * 7 % 250),
        inquiries: seed % 5,
        publicRecords: seed % 2,
        openAccounts: 5 + (seed % 10),
        creditUtilization: parseFloat((0.1 + Math.random() * 0.7).toFixed(2)),
        paymentHistory: {
            totalAccounts: 10 + (seed % 15),
            onTimePayments: 9 + (seed % 15) - (seed % 3),
            latePayments: seed % 3,
        },
        debtSummary: {
            totalDebt: 50000 + (seed * 1000 % 150000),
            revolvingDebt: 5000 + (seed * 200 % 20000),
            mortgageDebt: seed % 2 === 0 ? 250000 : 0,
        },
        alerts: seed % 4 === 0 ? ['New inquiry reported', 'Address mismatch'] : [],
    };
};

// Mock AI Service
const geminiService = {
    getSummary: async (application: LoanApplication): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const summaryPoints = [];
        if (application.riskLevel === RiskLevel.CRITICAL) summaryPoints.push("critical risk level detected");
        else if (application.riskLevel === RiskLevel.HIGH) summaryPoints.push("high risk level detected");
        if ((application.debtToIncomeRatio || 0) > 0.45) summaryPoints.push("high debt-to-income ratio");
        if (application.aiScore > 750) summaryPoints.push("strong AI-driven credit score");
        if (application.fraudDetectionScore && application.fraudDetectionScore > 70) summaryPoints.push("high fraud detection score indicates potential risk");

        if (summaryPoints.length === 0) return "This is a standard application with no significant outliers detected by the AI. Standard underwriting procedures are recommended.";

        return `AI analysis highlights several key points for this application: ${summaryPoints.join(', ')}. It is recommended to proceed with caution and verify all documentation.`;
    },
    getNextBestAction: async (application: LoanApplication): Promise<{ action: string, reason: string, icon: React.ElementType }> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        switch (application.status) {
            case ApplicationStatus.PENDING_REVIEW:
                return { action: "Run AI Pre-Screen", reason: "Automated initial check for red flags.", icon: SparklesIcon };
            case ApplicationStatus.AI_PRE_SCREEN:
                return { action: "Request Initial Documents", reason: "Gather necessary documents for verification.", icon: DocumentTextIcon };
            case ApplicationStatus.DOCUMENT_VERIFICATION:
                return { action: "Begin Underwriting", reason: "All documents are verified; ready for manual review.", icon: UserCircleIcon };
            case ApplicationStatus.UNDERWRITING:
                if (application.riskLevel === 'HIGH' || application.riskLevel === 'CRITICAL')
                    return { action: "Escalate to Senior Underwriter", reason: "High risk profile requires senior approval.", icon: ArrowUpOnSquareStackIcon };
                return { action: "Make Final Decision", reason: "Sufficient data for an approval or rejection decision.", icon: CheckCircleIcon };
            default:
                return { action: "Monitor Application", reason: "No immediate action required at this stage.", icon: EyeIcon };
        }
    }
};

// --- Utility Functions ---
export const formatCurrency = (value: number, currency: string = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
export const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const getStatusColor = (status: ApplicationStatus) => {
    const colorMap: Record<ApplicationStatus, string> = {
        [ApplicationStatus.APPROVED]: 'text-green-500 bg-green-900/20',
        [ApplicationStatus.FUNDED]: 'text-blue-500 bg-blue-900/20',
        [ApplicationStatus.REJECTED]: 'text-red-500 bg-red-900/20',
        [ApplicationStatus.WITHDRAWN]: 'text-red-500 bg-red-900/20',
        [ApplicationStatus.UNDERWRITING]: 'text-yellow-500 bg-yellow-900/20',
        [ApplicationStatus.AI_PRE_SCREEN]: 'text-indigo-500 bg-indigo-900/20',
        [ApplicationStatus.DOCUMENT_VERIFICATION]: 'text-indigo-500 bg-indigo-900/20',
        [ApplicationStatus.PENDING_REVIEW]: 'text-indigo-500 bg-indigo-900/20',
        [ApplicationStatus.PENDING_CUSTOMER_ACTION]: 'text-indigo-500 bg-indigo-900/20',
        [ApplicationStatus.ON_HOLD]: 'text-orange-500 bg-orange-900/20',
        [ApplicationStatus.ESCALATED]: 'text-pink-500 bg-pink-900/20',
        [ApplicationStatus.COLLECTION]: 'text-red-600 bg-red-900/30',
        [ApplicationStatus.REFINANCED]: 'text-teal-500 bg-teal-900/20',
        [ApplicationStatus.CLOSED]: 'text-gray-500 bg-gray-900/20',
    };
    return colorMap[status] || 'text-gray-400 bg-gray-700/20';
};

export const getRiskColor = (risk: RiskLevel) => {
    const colorMap: Record<RiskLevel, string> = {
        [RiskLevel.LOW]: 'text-green-400',
        [RiskLevel.MEDIUM]: 'text-yellow-400',
        [RiskLevel.HIGH]: 'text-orange-400',
        [RiskLevel.CRITICAL]: 'text-red-400',
        [RiskLevel.UNKNOWN]: 'text-gray-400',
    };
    return colorMap[risk] || 'text-gray-400';
};

export const getPriorityColor = (priority: 'LOW' | 'MEDIUM' | 'HIGH') => ({ LOW: 'text-green-400', MEDIUM: 'text-yellow-400', HIGH: 'text-red-400' }[priority]);

// --- Custom Hooks ---
const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};
export const useApplications = (page: number, limit: number, filters: any, sort: any) => {
    const debouncedFilters = useDebounce(filters, 300);
    return useQuery<{ applications: LoanApplication[]; total: number }, Error>(
        ['loanApplications', page, limit, debouncedFilters, sort],
        () => fetchApplications(page, limit, debouncedFilters, sort),
        { keepPreviousData: true, staleTime: 5 * 60 * 1000 }
    );
};
export const useApplicationById = (id: string | null) => useQuery<LoanApplication, Error>(['loanApplication', id], () => fetchApplicationById(id!), { enabled: !!id, staleTime: 5 * 60 * 1000 });
export const useUpdateApplication = () => {
    const queryClient = useQueryClient();
    return useMutation<LoanApplication, Error, LoanApplication>(updateApplication, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(['loanApplications']);
            queryClient.setQueryData(['loanApplication', data.id], data);
            toast.success(`Application ${data.id} updated successfully!`);
        },
        onError: (error) => toast.error(`Error updating application: ${error.message}`),
    });
};
export const useCreateApplication = () => {
    const queryClient = useQueryClient();
    return useMutation<LoanApplication, Error, Partial<LoanApplication>>(createApplication, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(['loanApplications']);
            toast.success(`New application ${data.id} created!`);
        },
        onError: (error) => toast.error(`Error creating application: ${error.message}`),
    });
}
export const useUnderwriters = () => useQuery<UserProfile[], Error>(['underwriters'], fetchUnderwriters, { staleTime: Infinity });
export const useAlerts = () => useQuery<Alert[], Error>(['alerts'], fetchAlerts, { refetchInterval: 30 * 1000 });
export const useCreditReport = (applicantId: string | null) => useQuery<CreditReport, Error>(['creditReport', applicantId], () => fetchCreditReport(applicantId!), { enabled: !!applicantId });

// --- Components ---
export const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>{status.replace(/_/g, ' ')}</span>;
export const RiskBadge: React.FC<{ riskLevel: RiskLevel }> = ({ riskLevel }) => <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(riskLevel)} bg-gray-900/20`}><ExclamationTriangleIcon className="inline-block w-3 h-3 mr-1" />{riskLevel.replace(/_/g, ' ')}</span>;
export const PriorityBadge: React.FC<{ priority: 'LOW' | 'MEDIUM' | 'HIGH' }> = ({ priority }) => <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(priority)} bg-gray-900/20`}><TagIcon className="inline-block w-3 h-3 mr-1" />{priority}</span>;

export const FilterButton: React.FC<{ label: string; icon: React.ElementType; onClick: () => void; isActive: boolean; }> = ({ label, icon: Icon, onClick, isActive }) => (
    <button onClick={onClick} className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}>
        <Icon className="w-4 h-4" />
        <span>{label}</span>
    </button>
);

export const SortableHeader: React.FC<{ label: string; field: string; currentSort: { field: string; direction: 'asc' | 'desc' }; onSort: (field: string) => void; }> = ({ label, field, currentSort, onSort }) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer select-none" onClick={() => onSort(field)}>
        <div className="flex items-center">{label}{currentSort.field === field && <span className="ml-1">{currentSort.direction === 'asc' ? ' ↑' : ' ↓'}</span>}</div>
    </th>
);

export const Paginator: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalPages, onPageChange }) => (
    <nav className="flex items-center justify-between border-t border-gray-700 px-4 py-3 sm:px-6">
        <p className="text-sm text-gray-400">Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span></p>
        <div className="flex space-x-2">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRightIcon className="h-5 w-5" />
            </button>
        </div>
    </nav>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'; }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;
    const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl', '3xl': 'max-w-3xl', '4xl': 'max-w-4xl', '5xl': 'max-w-5xl' };
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className={`relative bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]}`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XCircleIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export const CustomSelect: React.FC<any> = (props) => (
    <Select {...props} styles={{
        control: (base) => ({ ...base, backgroundColor: '#374151', borderColor: '#4b5563', color: 'white', '&:hover': { borderColor: '#6b7280' } }),
        menu: (base) => ({ ...base, backgroundColor: '#374151', zIndex: 9999 }),
        option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#4b5563' : state.isSelected ? '#1f2937' : '#374151', color: 'white', '&:hover': { backgroundColor: '#4b5563' } }),
        singleValue: (base) => ({ ...base, color: 'white' }),
        input: (base) => ({ ...base, color: 'white' }),
        placeholder: (base) => ({ ...base, color: '#9ca3af' }),
    }} />
);

export const DropdownMenu: React.FC<{ trigger: React.ReactNode; children: React.ReactNode }> = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false); };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"><div className="py-1">{children}</div></div>}
        </div>
    );
};

export const DropdownMenuItem: React.FC<{ onClick: () => void; icon?: React.ElementType; children: React.ReactNode }> = ({ onClick, icon: Icon, children }) => (
    <button onClick={onClick} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left flex items-center space-x-2">
        {Icon && <Icon className="w-4 h-4" />}<span>{children}</span>
    </button>
);

// --- Detailed Views / Sub-components ---
export const AIInsightCard: React.FC<{ application: LoanApplication }> = ({ application }) => {
    const [summary, setSummary] = useState('');
    const [nextAction, setNextAction] = useState<{ action: string, reason: string, icon: React.ElementType } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            setIsLoading(true);
            try {
                const [summaryRes, nextActionRes] = await Promise.all([
                    geminiService.getSummary(application),
                    geminiService.getNextBestAction(application),
                ]);
                setSummary(summaryRes);
                setNextAction(nextActionRes);
            } catch (error) {
                console.error("Failed to fetch AI insights", error);
                setSummary("Error fetching AI summary.");
            }
            setIsLoading(false);
        };
        fetchInsights();
    }, [application]);

    if (isLoading) {
        return <Card title="AI Co-Pilot"><div className="flex items-center space-x-2 text-gray-400"><ArrowPathIcon className="w-5 h-5 animate-spin" /><span>Analyzing application...</span></div></Card>;
    }

    return (
        <Card title="AI Co-Pilot Insights">
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-200 mb-1 flex items-center space-x-2"><SparklesIcon className="w-5 h-5 text-purple-400" /><span>AI Summary</span></h4>
                    <p className="text-sm text-gray-300 italic">{summary}</p>
                </div>
                {nextAction && (
                    <div>
                        <h4 className="font-semibold text-gray-200 mb-2 flex items-center space-x-2"><RocketLaunchIcon className="w-5 h-5 text-blue-400" /><span>Next Best Action</span></h4>
                        <div className="flex items-center space-x-3 bg-gray-700/50 p-3 rounded-md">
                            <nextAction.icon className="w-8 h-8 text-blue-400 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-white">{nextAction.action}</p>
                                <p className="text-sm text-gray-400">{nextAction.reason}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export const CreditReportTab: React.FC<{ applicantId: string }> = ({ applicantId }) => {
    const { data: report, isLoading, error } = useCreditReport(applicantId);

    if (isLoading) return <div className="text-center py-8"><ArrowPathIcon className="w-8 h-8 mx-auto animate-spin text-blue-500" /></div>;
    if (error) return <div className="text-center py-8 text-red-400"><XCircleIcon className="w-8 h-8 mx-auto" /><p>Error fetching credit report: {error.message}</p></div>;
    if (!report) return <p>No credit report available.</p>;

    return (
        <div className="space-y-4">
            <Card title={`Credit Report from ${report.provider}`}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-400">Credit Score</p>
                        <p className="text-3xl font-bold text-blue-400">{report.score}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-400">Total Debt</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(report.debtSummary.totalDebt)}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-400">Credit Utilization</p>
                        <p className="text-3xl font-bold text-white">{(report.creditUtilization * 100).toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-400">Inquiries (2Y)</p>
                        <p className="text-3xl font-bold text-white">{report.inquiries}</p>
                    </div>
                </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="Payment History">
                    <p>On-Time Payments: <span className="font-semibold text-green-400">{report.paymentHistory.onTimePayments} / {report.paymentHistory.totalAccounts}</span></p>
                    <p>Late Payments: <span className="font-semibold text-red-400">{report.paymentHistory.latePayments}</span></p>
                </Card>
                <Card title="Debt Summary">
                    <p>Revolving Debt: <span className="font-semibold text-white">{formatCurrency(report.debtSummary.revolvingDebt)}</span></p>
                    <p>Mortgage Debt: <span className="font-semibold text-white">{formatCurrency(report.debtSummary.mortgageDebt)}</span></p>
                </Card>
            </div>
        </div>
    );
};

export const LoanApplicationDetail: React.FC<{ application: LoanApplication; onClose: () => void; onUpdate: (updatedApp: LoanApplication) => void; }> = ({ application, onClose, onUpdate }) => {
    const [currentTab, setCurrentTab] = useState('overview');
    const updateAppMutation = useUpdateApplication();

    const handleUpdate = (field: keyof LoanApplication, value: any) => {
        const updatedApp = { ...application, [field]: value };
        updateAppMutation.mutate(updatedApp, {
            onSuccess: (data) => onUpdate(data),
        });
    };
    
    const getTabClassName = (tabName: string) => `px-4 py-2 text-sm font-medium rounded-t-md transition-colors duration-200 ${currentTab === tabName ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;
    const tabs = ['overview', 'documents', 'notes', 'tasks', 'audit', 'credit_report'];
    if (application.offerDetails) tabs.push('offer');
    if (application.paymentSchedule) tabs.push('payments');
    if (application.collateralDetails?.length) tabs.push('collateral');
    if (application.complianceChecks?.length) tabs.push('compliance');

    return (
        <div className="w-full h-full flex flex-col bg-gray-900 text-white">
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h3 className="text-2xl font-bold">{application.applicantName}</h3>
                    <StatusBadge status={application.status} />
                    <RiskBadge riskLevel={application.riskLevel} />
                    <span className="text-lg text-gray-400">{formatCurrency(application.amountRequested)} ({application.loanType.replace(/_/g, ' ')})</span>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"><XCircleIcon className="w-6 h-6" /></button>
            </div>
            <div className="flex-shrink-0 px-6 pt-4 border-b border-gray-700 overflow-x-auto"><div className="flex space-x-2">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setCurrentTab(tab)} className={getTabClassName(tab)}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/_/g, ' ')}
                    </button>
                ))}
            </div></div>
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {currentTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card title="Application Summary">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                                    <div>
                                        <p><span className="font-semibold">ID:</span> {application.id}</p>
                                        <p><span className="font-semibold">Applicant:</span> {application.applicantName}</p>
                                        <p><span className="font-semibold">Amount:</span> {formatCurrency(application.amountRequested)}</p>
                                        <p><span className="font-semibold">DTI Ratio:</span> {application.debtToIncomeRatio ? `${(application.debtToIncomeRatio * 100).toFixed(1)}%` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p><span className="font-semibold">Date:</span> {formatDate(application.applicationDate)}</p>
                                        <p><span className="font-semibold">Underwriter:</span> {application.assignedUnderwriterName || 'N/A'}</p>
                                        <p><span className="font-semibold">Purpose:</span> {application.purpose}</p>
                                        <p><span className="font-semibold">LTV Ratio:</span> {application.loanToValueRatio ? `${(application.loanToValueRatio * 100).toFixed(1)}%` : 'N/A'}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card title="AI Risk & Decision Engine Insights">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                                   <div>
                                       <p><span className="font-semibold">AI Score:</span> <span className="text-xl font-bold">{application.aiScore}</span></p>
                                       <p className="flex items-center space-x-1"><span className="font-semibold">Risk Level:</span> <RiskBadge riskLevel={application.riskLevel} /></p>
                                       <p><span className="font-semibold">Recommended Action:</span> <span className="text-blue-400 font-semibold">{application.recommendedAction}</span></p>
                                   </div>
                                   {application.decisionEngineOutput && (
                                       <div>
                                           <p><span className="font-semibold">Decision Engine:</span> <span className={`font-bold ${application.decisionEngineOutput.decision === 'APPROVE' ? 'text-green-400' : application.decisionEngineOutput.decision === 'REJECT' ? 'text-red-400' : 'text-yellow-400'}`}>{application.decisionEngineOutput.decision}</span></p>
                                           <p><span className="font-semibold">Reason Codes:</span> {application.decisionEngineOutput.reasonCodes.join(', ') || 'N/A'}</p>
                                           <p><span className="font-semibold">Confidence Score:</span> {(application.decisionEngineOutput.confidenceScore * 100).toFixed(2)}%</p>
                                       </div>
                                   )}
                               </div>
                           </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <AIInsightCard application={application} />
                        </div>
                    </div>
                )}
                {currentTab === 'credit_report' && <CreditReportTab applicantId={application.applicantId} />}
                {/* Other tab implementations would go here... */}
            </div>
        </div>
    );
};


// --- Dashboard Widgets ---
export const ApplicationStatusChart: React.FC<{ applications?: LoanApplication[] }> = ({ applications = [] }) => {
    const statusCounts = applications.reduce((acc, app) => { acc[app.status] = (acc[app.status] || 0) + 1; return acc; }, {} as Record<ApplicationStatus, number>);
    const data = { labels: Object.keys(statusCounts), datasets: [{ data: Object.values(statusCounts), backgroundColor: Object.keys(statusCounts).map(s => getStatusColor(s as ApplicationStatus).split(' ')[0].replace('text', 'bg').replace('-500', '-600')) }] };
    return <Card title="Status Distribution"><div className="relative h-64"><Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div></Card>;
};
export const LoanTypeDistributionChart: React.FC<{ applications?: LoanApplication[] }> = ({ applications = [] }) => {
    const loanTypeCounts = applications.reduce((acc, app) => { acc[app.loanType] = (acc[app.loanType] || 0) + 1; return acc; }, {} as Record<LoanType, number>);
    const data = { labels: Object.keys(loanTypeCounts).map(lt => lt.replace(/_/g, ' ')), datasets: [{ label: 'Applications', data: Object.values(loanTypeCounts), backgroundColor: '#3B82F6' }] };
    return <Card title="Loan Type Distribution"><div className="relative h-64"><Bar data={data} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } }} /></div></Card>;
};
export const RecentAlertsWidget: React.FC = () => {
    const { data: alerts, isLoading, error } = useAlerts();
    return (
        <Card title="Recent System Alerts">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {alerts && alerts.slice(0, 3).map(alert => <div key={alert.id} className="text-sm border-b border-gray-700 pb-2 mb-2"><p className={`font-semibold ${getRiskColor(alert.severity as any)}`}>{alert.type.replace(/_/g, ' ')}</p><p>{alert.message}</p></div>)}
        </Card>
    );
};
export const PerformanceMetricsWidget: React.FC<{ applications: LoanApplication[] }> = ({ applications }) => {
    const total = applications.length;
    const approved = applications.filter(a => a.status === ApplicationStatus.APPROVED || a.status === ApplicationStatus.FUNDED).length;
    const approvalRate = total > 0 ? (approved / total * 100).toFixed(1) : 0;
    const totalAmount = applications.reduce((sum, app) => sum + app.amountRequested, 0);
    return (
        <Card title="Performance Metrics">
            <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-400">Total Applications</p><p className="text-2xl font-bold">{total}</p></div>
                <div><p className="text-sm text-gray-400">Approval Rate</p><p className="text-2xl font-bold">{approvalRate}%</p></div>
                <div><p className="text-sm text-gray-400">Total Amount Req.</p><p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p></div>
                <div><p className="text-sm text-gray-400">Avg. Amount Req.</p><p className="text-2xl font-bold">{formatCurrency(total > 0 ? totalAmount/total : 0)}</p></div>
            </div>
        </Card>
    );
};

// --- Main View Component ---
const LoanApplicationsView: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<any>({});
    const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'applicationDate', direction: 'desc' });
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data, isLoading, error, refetch } = useApplications(currentPage, ITEMS_PER_PAGE, filters, sort);
    const { data: selectedApplication, isLoading: isLoadingSelected } = useApplicationById(selectedApplicationId);

    const handleFilterChange = (key: string, value: any) => { setFilters(prev => ({ ...prev, [key]: value })); setCurrentPage(1); };
    const handleSortChange = (field: string) => setSort(prev => ({ field, direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc' }));
    const handleClearFilters = () => { setFilters({}); setSort({ field: 'applicationDate', direction: 'desc' }); };
    const handleApplicationUpdate = () => { refetch(); queryClient.invalidateQueries(['loanApplication', selectedApplicationId]); };
    const createApplicationMutation = useCreateApplication();

    const loanTypeOptions = useMemo(() => Object.values(LoanType).map(type => ({ value: type, label: type.replace(/_/g, ' ') })), []);
    const statusOptions = useMemo(() => Object.values(ApplicationStatus).map(status => ({ value: status, label: status.replace(/_/g, ' ') })), []);
    const { data: underwriters } = useUnderwriters();
    const underwriterOptions = useMemo(() => underwriters?.map(uw => ({ value: uw.id, label: `${uw.firstName} ${uw.lastName}` })) || [], [underwriters]);
    const queryClient = useQueryClient();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Loan Origination System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PerformanceMetricsWidget applications={data?.applications || []} />
                <ApplicationStatusChart applications={data?.applications} />
                <LoanTypeDistributionChart applications={data?.applications} />
                <RecentAlertsWidget />
            </div>
            <Card title="Loan Applications Overview">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <input type="text" placeholder="Search applications..." className="w-full md:w-1/3 pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white" value={filters.search || ''} onChange={(e) => handleFilterChange('search', e.target.value)} />
                    <div className="flex items-center space-x-2">
                        <DropdownMenu trigger={<FilterButton label="Filters" icon={FunnelIcon} onClick={() => {}} isActive={Object.keys(filters).length > 1} />}>
                            <div className="p-4 space-y-3 w-64">
                                <CustomSelect options={statusOptions} onChange={(opt: any) => handleFilterChange('status', opt?.value)} placeholder="Filter by status..." isClearable/>
                                <CustomSelect options={loanTypeOptions} onChange={(opt: any) => handleFilterChange('loanType', opt?.value)} placeholder="Filter by loan type..." isClearable/>
                                <CustomSelect options={underwriterOptions} onChange={(opt: any) => handleFilterChange('underwriterId', opt?.value)} placeholder="Filter by underwriter..." isClearable/>
                                <button onClick={handleClearFilters} className="w-full text-center py-2 bg-gray-600 rounded-md hover:bg-gray-500">Clear Filters</button>
                            </div>
                        </DropdownMenu>
                        <button onClick={() => refetch()} className="p-2 bg-green-600 rounded-md"><ArrowPathIcon className="h-5 w-5" /></button>
                        <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-md"><PlusIcon className="h-5 w-5" /><span>New</span></button>
                    </div>
                </div>
                {isLoading ? <div className="text-center py-8"><ArrowPathIcon className="mx-auto h-12 w-12 animate-spin text-blue-500" /></div> : error ? <div className="text-center py-8 text-red-400">{error.message}</div> : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-800"><tr>
                                    <SortableHeader label="ID" field="id" currentSort={sort} onSort={handleSortChange} />
                                    <SortableHeader label="Applicant" field="applicantName" currentSort={sort} onSort={handleSortChange} />
                                    <SortableHeader label="Amount" field="amountRequested" currentSort={sort} onSort={handleSortChange} />
                                    <SortableHeader label="Status" field="status" currentSort={sort} onSort={handleSortChange} />
                                    <SortableHeader label="Risk" field="riskLevel" currentSort={sort} onSort={handleSortChange} />
                                    <SortableHeader label="Date" field="applicationDate" currentSort={sort} onSort={handleSortChange} />
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr></thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-900">{data.applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-800">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{app.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{app.applicantName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(app.amountRequested)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={app.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><RiskBadge riskLevel={app.riskLevel} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(app.applicationDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => setSelectedApplicationId(app.id)} className="text-blue-400 hover:text-blue-300">View</button>
                                        </td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                        <Paginator currentPage={currentPage} totalPages={Math.ceil((data?.total || 0) / ITEMS_PER_PAGE)} onPageChange={setCurrentPage} />
                    </>
                )}
            </Card>
            <Modal isOpen={!!selectedApplicationId} onClose={() => setSelectedApplicationId(null)} title={isLoadingSelected ? 'Loading...' : `Application: ${selectedApplication?.id}`} size="4xl">
                {isLoadingSelected ? <div className="text-center py-8"><ArrowPathIcon className="mx-auto h-12 w-12 animate-spin" /></div> : selectedApplication && <LoanApplicationDetail application={selectedApplication} onClose={() => setSelectedApplicationId(null)} onUpdate={handleApplicationUpdate} />}
            </Modal>
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="New Loan Application">
                <NewLoanApplicationForm onSubmit={(data) => createApplicationMutation.mutate(data, { onSuccess: () => setIsCreateModalOpen(false) })} onClose={() => setIsCreateModalOpen(false)} />
            </Modal>
        </div>
    );
};
export const NewLoanApplicationForm: React.FC<{ onSubmit: (data: Partial<LoanApplication>) => void; onClose: () => void }> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState<Partial<LoanApplication>>({});
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="applicantName" onChange={e => setFormData(p => ({...p, applicantName: e.target.value}))} placeholder="Applicant Name" className="w-full p-2 bg-gray-700 rounded"/>
            <input type="number" name="amountRequested" onChange={e => setFormData(p => ({...p, amountRequested: +e.target.value}))} placeholder="Amount" className="w-full p-2 bg-gray-700 rounded"/>
            <textarea name="purpose" onChange={e => setFormData(p => ({...p, purpose: e.target.value}))} placeholder="Purpose" className="w-full p-2 bg-gray-700 rounded"/>
            <div className="flex justify-end space-x-2"><button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 rounded">Cancel</button><button type="submit" className="py-2 px-4 bg-blue-600 rounded">Create</button></div>
        </form>
    );
};

export default LoanApplicationsView;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/finance/LoanApplicationsView.tsx
================================================================================

// components/views/megadashboard/finance/LoanApplicationsView.tsx
import React from 'react';
import Card from '../../../Card';

const LoanApplicationsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Loan Origination System</h2>
            <Card title="Mission Brief">
                <p className="text-gray-400">An AI-powered loan origination and management system built for speed and precision. Automate underwriting, scoring, and document verification to accelerate the entire lending lifecycle from application to closing.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="AI Pre-Approval Scoring"><p>Get an instant, AI-driven risk assessment and pre-approval decision for new applications, cutting review times from days to seconds.</p></Card>
                <Card title="Risk-Adjusted Loan Offers"><p>Automatically generate personalized loan offers with terms dynamically adjusted for the applicant's holistic risk profile.</p></Card>
                <Card title="Predictive Default Monitoring"><p>Our AI models continuously monitor active loans to predict and flag potential defaults months before they occur, enabling proactive intervention.</p></Card>
            </div>
        </div>
    );
};

export default LoanApplicationsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/finance/LoanApplicationsView.tsx
================================================================================

// components/views/megadashboard/finance/LoanApplicationsView.tsx
import React from 'react';
import Card from '../../../Card';

const LoanApplicationsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Loan Origination System</h2>
            <Card title="Mission Brief">
                <p className="text-gray-400">An AI-powered loan origination and management system built for speed and precision. Automate underwriting, scoring, and document verification to accelerate the entire lending lifecycle from application to closing.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="AI Pre-Approval Scoring"><p>Get an instant, AI-driven risk assessment and pre-approval decision for new applications, cutting review times from days to seconds.</p></Card>
                <Card title="Risk-Adjusted Loan Offers"><p>Automatically generate personalized loan offers with terms dynamically adjusted for the applicant's holistic risk profile.</p></Card>
                <Card title="Predictive Default Monitoring"><p>Our AI models continuously monitor active loans to predict and flag potential defaults months before they occur, enabling proactive intervention.</p></Card>
            </div>
        </div>
    );
};

export default LoanApplicationsView;