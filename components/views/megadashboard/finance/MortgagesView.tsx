// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/finance/MortgagesView.tsx
================================================================================

// components/views/megadashboard/finance/MortgagesView.tsx
import React from 'react';
import Card from '../../../Card';

const MortgagesView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Mortgage Command Center</h2>
            <Card title="Mission Brief">
                <p className="text-gray-400">A comprehensive platform for mortgage origination, servicing, and portfolio management. This system is enhanced with AI-driven forecasting and real-time risk analysis to navigate the complexities of the housing market.</p>
            </Card>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="AI Interest Rate Forecasting"><p>Our predictive models forecast future interest rate movements, allowing for proactive hedging and informed decisions on new mortgage products.</p></Card>
                 <Card title="AI-Based Property Valuation"><p>Get instant, data-driven property valuation estimates using our proprietary AI models, trained on millions of real estate transactions.</p></Card>
                 <Card title="Predictive Refinancing Alerts"><p>Identify clients in your portfolio who are prime candidates for refinancing based on market conditions and their financial profile, creating new business opportunities.</p></Card>
            </div>
        </div>
    );
};

export default MortgagesView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/finance/MortgagesView.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import Card from '../../../Card';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler, RadialLinearScale } from 'chart.js';
import faker from 'faker'; // Using faker for mock data generation

// Register Chart.js components including Radar for advanced analytics
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler, RadialLinearScale);

// --- Contexts for Global State Management (Scalability) ---
interface MortgageAppContextType {
    currentUser: UserProfile | null;
    settings: AppSettings;
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    login: (user: UserProfile) => void;
    logout: () => void;
}

const MortgageAppContext = createContext<MortgageAppContextType | undefined>(undefined);

export const useMortgageApp = () => {
    const context = useContext(MortgageAppContext);
    if (context === undefined) {
        throw new Error('useMortgageApp must be used within a MortgageAppProvider');
    }
    return context;
};

// --- Data Models and Interfaces (Type Safety & Structure) ---

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'loan_officer' | 'underwriter' | 'servicing_agent' | 'portfolio_manager' | 'compliance_officer';
    permissions: string[];
    avatarUrl?: string;
}

export interface AppSettings {
    theme: 'dark' | 'light';
    currency: 'USD' | 'EUR' | 'GBP';
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY';
    notificationPreferences: {
        email: boolean;
        sms: boolean;
        inApp: boolean;
    };
    defaultPortfolioFilter: string;
    aiConfidenceThreshold: number; // 0 to 1
}

export interface Notification {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    timestamp: Date;
    read: boolean;
    link?: string;
}

export interface MortgageLoan {
    id: string;
    loanNumber: string;
    borrower: BorrowerProfile;
    property: PropertyDetails;
    loanDetails: LoanDetails;
    status: 'application' | 'pre_approved' | 'approved' | 'funded' | 'servicing' | 'defaulted' | 'refinanced' | 'paid_off' | 'denied';
    currentBalance: number;
    originalBalance: number;
    originationDate: Date;
    nextPaymentDate: Date;
    nextPaymentAmount: number;
    escrowBalance: number;
    loanOfficerId: string;
    underwriterId?: string;
    servicingAgentId?: string;
    notes: LoanNote[];
    documents: LoanDocument[];
    riskScore: number; // AI-driven risk score
    aiRecommendations: AiRecommendation[];
    valuationHistory: PropertyValuation[];
    paymentHistory: LoanPayment[];
    refinanceEligibility: RefinanceEligibility;
    underwritingAnalysis: UnderwritingAnalysis; // AI Underwriting details
    communicationLogs: CommunicationLog[]; // History of communications
    complianceRecords: ComplianceRecord[]; // Compliance checks
}

export interface BorrowerProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: Address;
    creditScore: number;
    income: number;
    debtToIncomeRatio: number;
    employmentStatus: string;
    dependents: number;
    kycStatus: 'verified' | 'pending' | 'rejected';
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface PropertyDetails {
    id: string;
    address: Address;
    propertyType: 'single_family' | 'multi_family' | 'condo' | 'townhouse' | 'commercial';
    yearBuilt: number;
    squareFootage: number;
    bedrooms: number;
    bathrooms: number;
    zoning: string;
    currentValue: number; // AI-based valuation
    lastAppraisalDate?: Date;
    propertyTax: number; // Annual
    homeInsurance: number; // Annual
    lienStatus: 'clear' | 'encumbered';
    floodZone: 'X' | 'A' | 'AE' | 'V'; // FEMA Flood Zones
}

export interface LoanDetails {
    loanType: 'fixed_rate' | 'adjustable_rate' | 'fha' | 'va' | 'usd_rural';
    interestRate: number; // Annual percentage rate
    termMonths: number;
    amortizationSchedule: AmortizationPayment[];
    emi: number; // Equated Monthly Installment
    closingCosts: number;
    originationFees: number;
    pmtInsurance?: number; // Private Mortgage Insurance
    isEscrowed: boolean;
}

export interface AmortizationPayment {
    month: number;
    principalPayment: number;
    interestPayment: number;
    remainingBalance: number;
    totalPayment: number;
}

export interface LoanNote {
    id: string;
    authorId: string;
    authorName: string;
    timestamp: Date;
    content: string;
}

export interface LoanDocument {
    id: string;
    fileName: string;
    documentType: 'application' | 'income_proof' | 'credit_report' | 'appraisal' | 'deed' | 'closing_disclosure' | 'other';
    uploadDate: Date;
    url: string;
    uploadedById: string;
    verificationStatus: 'verified' | 'pending' | 'rejected'; // AI-verified status
}

export interface PropertyValuation {
    id: string;
    timestamp: Date;
    value: number;
    source: 'AI' | 'Appraisal' | 'Manual' | 'AVM'; // Automated Valuation Model
    analystId?: string;
}

export interface LoanPayment {
    id: string;
    paymentDate: Date;
    amount: number;
    principalPaid: number;
    interestPaid: number;
    escrowPaid: number;
    lateFeeApplied: number;
    isLate: boolean;
}

export interface RefinanceEligibility {
    isEligible: boolean;
    suggestedRate?: number;
    estimatedSavingsMonthly?: number;
    reasonCodes: string[]; // e.g., 'Lower_Rate_Available', 'Credit_Score_Improvement', 'Property_Value_Increase'
    lastChecked: Date;
}

export interface AiRecommendation {
    id: string;
    type: 'refinance_alert' | 'risk_mitigation' | 'cross_sell_opportunity' | 'portfolio_adjustment' | 'compliance_flag';
    severity: 'low' | 'medium' | 'high';
    message: string;
    timestamp: Date;
    actionItems: string[];
    relatedLoanId?: string;
}

export interface MarketData {
    timestamp: Date;
    interestRate30YrFixed: number;
    interestRate15YrFixed: number;
    housingPriceIndex: number;
    inflationRate: number;
    gdpGrowth: number;
    unemploymentRate: number;
}

export interface PortfolioSummary {
    totalLoans: number;
    totalPortfolioValue: number;
    avgInterestRate: number;
    avgLTV: number;
    delinquencyRate: number;
    forecastedDefaults: number; // AI-driven
    topPerformers: string[]; // Loan IDs
    highRiskLoans: string[]; // Loan IDs
    geographicDistribution: { [state: string]: number };
    loanTypeDistribution: { [type: string]: number };
}

export interface UnderwritingAnalysis {
    id: string;
    decision: 'approved' | 'denied' | 'manual_review';
    confidenceScore: number;
    keyFactors: {
        creditScore: number;
        dti: number;
        ltv: number;
        incomeStability: number;
        propertyViability: number;
    };
    positiveFlags: string[];
    negativeFlags: string[];
    recommendation: string;
    timestamp: Date;
}

export interface CommunicationLog {
    id: string;
    timestamp: Date;
    channel: 'email' | 'phone' | 'sms' | 'portal_message';
    direction: 'inbound' | 'outbound';
    agentId: string;
    summary: string;
    sentiment?: 'positive' | 'neutral' | 'negative'; // AI-driven sentiment analysis
}

export interface ComplianceRecord {
    id: string;
    checkType: 'TRID' | 'RESPA' | 'AML' | 'ECOA' | 'HMDA';
    status: 'pass' | 'fail' | 'pending';
    checkedDate: Date;
    details: string;
    auditorId?: string;
}

// --- Utility Functions (Reusable Logic) ---

export const formatCurrency = (amount: number, currency: 'USD' | 'EUR' | 'GBP' = 'USD', locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

export const formatDate = (date: Date, dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' = 'MM/DD/YYYY'): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    if (dateFormat === 'DD/MM/YYYY') {
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    }
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const calculateLTV = (loanAmount: number, propertyValue: number): number => {
    if (propertyValue === 0) return 0;
    return (loanAmount / propertyValue) * 100;
};

export const generateAmortizationSchedule = (
    principal: number,
    annualInterestRate: number,
    loanTermMonths: number
): AmortizationPayment[] => {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const amortizationSchedule: AmortizationPayment[] = [];

    if (monthlyInterestRate === 0) {
        const monthlyPrincipal = principal / loanTermMonths;
        for (let month = 1; month <= loanTermMonths; month++) {
            amortizationSchedule.push({
                month,
                principalPayment: monthlyPrincipal,
                interestPayment: 0,
                remainingBalance: principal - (monthlyPrincipal * month),
                totalPayment: monthlyPrincipal,
            });
        }
        return amortizationSchedule;
    }

    const emi =
        principal *
        monthlyInterestRate /
        (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));

    let remainingBalance = principal;

    for (let month = 1; month <= loanTermMonths; month++) {
        const interestPayment = remainingBalance * monthlyInterestRate;
        const principalPayment = emi - interestPayment;
        remainingBalance -= principalPayment;

        amortizationSchedule.push({
            month,
            principalPayment,
            interestPayment,
            remainingBalance: Math.max(0, remainingBalance),
            totalPayment: emi,
        });
    }
    return amortizationSchedule;
};

// --- Mock Data Generators ---

const generateMockAddress = (): Address => ({
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    zipCode: faker.address.zipCode(),
    country: 'USA',
});

const generateMockPropertyDetails = (): PropertyDetails => ({
    id: faker.datatype.uuid(),
    address: generateMockAddress(),
    propertyType: faker.random.arrayElement(['single_family', 'multi_family', 'condo', 'townhouse']),
    yearBuilt: faker.datatype.number({ min: 1950, max: 2022 }),
    squareFootage: faker.datatype.number({ min: 800, max: 5000 }),
    bedrooms: faker.datatype.number({ min: 1, max: 6 }),
    bathrooms: faker.datatype.number({ min: 1, max: 5 }),
    zoning: faker.random.alphaNumeric(5).toUpperCase(),
    currentValue: faker.datatype.number({ min: 200000, max: 1500000 }),
    lastAppraisalDate: faker.date.recent(365),
    propertyTax: faker.datatype.number({ min: 2000, max: 15000 }),
    homeInsurance: faker.datatype.number({ min: 800, max: 4000 }),
    lienStatus: 'clear',
    floodZone: faker.random.arrayElement(['X', 'A', 'AE', 'V']),
});

const generateMockBorrowerProfile = (): BorrowerProfile => ({
    id: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    address: generateMockAddress(),
    creditScore: faker.datatype.number({ min: 600, max: 850 }),
    income: faker.datatype.number({ min: 50000, max: 300000 }),
    debtToIncomeRatio: faker.datatype.float({ min: 0.2, max: 0.5, precision: 0.01 }),
    employmentStatus: faker.random.arrayElement(['employed', 'self-employed', 'retired']),
    dependents: faker.datatype.number({ min: 0, max: 5 }),
    kycStatus: faker.random.arrayElement(['verified', 'pending']),
});

const generateMockLoanDetails = (principal: number): LoanDetails => {
    const termMonths = faker.random.arrayElement([180, 240, 360]);
    const annualRate = faker.datatype.float({ min: 2.5, max: 7.5, precision: 0.1 });
    const amortizationSchedule = generateAmortizationSchedule(principal, annualRate, termMonths);
    const emi = amortizationSchedule.length > 0 ? amortizationSchedule[0].totalPayment : 0;

    return {
        loanType: faker.random.arrayElement(['fixed_rate', 'adjustable_rate', 'fha', 'va']),
        interestRate: annualRate,
        termMonths: termMonths,
        amortizationSchedule: amortizationSchedule,
        emi: emi,
        closingCosts: faker.datatype.number({ min: 5000, max: 20000 }),
        originationFees: faker.datatype.number({ min: 0, max: 5000 }),
        pmtInsurance: faker.datatype.boolean() ? faker.datatype.number({ min: 50, max: 200 }) : undefined,
        isEscrowed: faker.datatype.boolean(),
    };
};

const generateMockLoanNote = (authorId: string, authorName: string): LoanNote => ({
    id: faker.datatype.uuid(),
    authorId: authorId,
    authorName: authorName,
    timestamp: faker.date.recent(30),
    content: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
});

const generateMockLoanDocument = (uploadedById: string): LoanDocument => ({
    id: faker.datatype.uuid(),
    fileName: faker.system.fileName(),
    documentType: faker.random.arrayElement(['application', 'income_proof', 'credit_report', 'appraisal', 'deed', 'closing_disclosure']),
    uploadDate: faker.date.recent(90),
    url: faker.internet.url(),
    uploadedById: uploadedById,
    verificationStatus: faker.random.arrayElement(['verified', 'pending', 'rejected']),
});

const generateMockPropertyValuation = (): PropertyValuation => ({
    id: faker.datatype.uuid(),
    timestamp: faker.date.recent(365),
    value: faker.datatype.number({ min: 250000, max: 1600000 }),
    source: faker.random.arrayElement(['AI', 'Appraisal', 'Manual', 'AVM']),
});

const generateMockLoanPayment = (originationDate: Date, emi: number, termMonths: number): LoanPayment[] => {
    const payments: LoanPayment[] = [];
    let paymentDate = new Date(originationDate);
    paymentDate.setMonth(paymentDate.getMonth() + 1);

    const numPayments = faker.datatype.number({ min: 1, max: Math.min(termMonths, 60) });

    for (let i = 0; i < numPayments; i++) {
        const principalPayment = faker.datatype.float({ min: emi * 0.3, max: emi * 0.7 });
        const interestPayment = emi - principalPayment;
        const escrowPaid = faker.datatype.number({ min: 100, max: 500 });
        const isLate = faker.datatype.boolean({ probability: 0.05 });
        const lateFee = isLate ? faker.datatype.number({ min: 25, max: 100 }) : 0;

        payments.push({
            id: faker.datatype.uuid(),
            paymentDate: new Date(paymentDate),
            amount: emi + lateFee + escrowPaid,
            principalPaid: principalPayment,
            interestPaid: interestPayment,
            escrowPaid: escrowPaid,
            lateFeeApplied: lateFee,
            isLate: isLate,
        });
        paymentDate.setMonth(paymentDate.getMonth() + 1);
    }
    return payments;
};

const generateMockRefinanceEligibility = (): RefinanceEligibility => ({
    isEligible: faker.datatype.boolean({ probability: 0.7 }),
    suggestedRate: faker.datatype.float({ min: 2.0, max: 6.0, precision: 0.1 }),
    estimatedSavingsMonthly: faker.datatype.number({ min: 50, max: 500 }),
    reasonCodes: faker.random.arrayElements(['Lower_Rate_Available', 'Credit_Score_Improvement', 'Property_Value_Increase', 'Market_Conditions'], faker.datatype.number({ min: 1, max: 3 })),
    lastChecked: faker.date.recent(30),
});

const generateMockAiRecommendation = (loanId: string): AiRecommendation => ({
    id: faker.datatype.uuid(),
    type: faker.random.arrayElement(['refinance_alert', 'risk_mitigation', 'cross_sell_opportunity', 'portfolio_adjustment']),
    severity: faker.random.arrayElement(['low', 'medium', 'high']),
    message: faker.lorem.sentence(),
    timestamp: faker.date.recent(7),
    actionItems: [faker.lorem.words(3), faker.lorem.words(3)],
    relatedLoanId: loanId,
});

const generateMockUnderwritingAnalysis = (): UnderwritingAnalysis => ({
    id: faker.datatype.uuid(),
    decision: faker.random.arrayElement(['approved', 'denied', 'manual_review']),
    confidenceScore: faker.datatype.float({ min: 0.65, max: 0.99, precision: 0.01 }),
    keyFactors: {
        creditScore: faker.datatype.float({ min: 0.5, max: 1.0, precision: 0.01 }),
        dti: faker.datatype.float({ min: 0.5, max: 1.0, precision: 0.01 }),
        ltv: faker.datatype.float({ min: 0.5, max: 1.0, precision: 0.01 }),
        incomeStability: faker.datatype.float({ min: 0.5, max: 1.0, precision: 0.01 }),
        propertyViability: faker.datatype.float({ min: 0.5, max: 1.0, precision: 0.01 }),
    },
    positiveFlags: ['Consistent employment history', 'Low credit utilization'],
    negativeFlags: ['High debt-to-income ratio'],
    recommendation: faker.lorem.sentence(),
    timestamp: faker.date.recent(10),
});

const generateMockCommunicationLog = (): CommunicationLog => ({
    id: faker.datatype.uuid(),
    timestamp: faker.date.recent(180),
    channel: faker.random.arrayElement(['email', 'phone', 'sms', 'portal_message']),
    direction: faker.random.arrayElement(['inbound', 'outbound']),
    agentId: faker.datatype.uuid(),
    summary: faker.lorem.sentence(),
    sentiment: faker.random.arrayElement(['positive', 'neutral', 'negative']),
});

const generateMockComplianceRecord = (): ComplianceRecord => ({
    id: faker.datatype.uuid(),
    checkType: faker.random.arrayElement(['TRID', 'RESPA', 'AML', 'ECOA', 'HMDA']),
    status: faker.random.arrayElement(['pass', 'fail', 'pending']),
    checkedDate: faker.date.recent(365),
    details: faker.lorem.sentence(),
    auditorId: faker.datatype.uuid(),
});

export const generateMockMortgageLoan = (loanOfficerId: string): MortgageLoan => {
    const originalBalance = faker.datatype.number({ min: 150000, max: 1000000 });
    const loanDetails = generateMockLoanDetails(originalBalance);
    const originationDate = faker.date.past(5);

    return {
        id: faker.datatype.uuid(),
        loanNumber: faker.finance.account(10),
        borrower: generateMockBorrowerProfile(),
        property: generateMockPropertyDetails(),
        loanDetails: loanDetails,
        status: faker.random.arrayElement(['application', 'pre_approved', 'approved', 'funded', 'servicing', 'defaulted', 'refinanced', 'paid_off']),
        originalBalance,
        currentBalance: faker.datatype.number({ min: originalBalance * 0.2, max: originalBalance * 0.95 }),
        originationDate,
        nextPaymentDate: faker.date.future(0.5, originationDate),
        nextPaymentAmount: loanDetails.emi + (loanDetails.isEscrowed ? faker.datatype.number({ min: 100, max: 500 }) : 0),
        escrowBalance: faker.datatype.number({ min: 0, max: 3000 }),
        loanOfficerId,
        underwriterId: faker.datatype.uuid(),
        servicingAgentId: faker.datatype.uuid(),
        notes: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => generateMockLoanNote(loanOfficerId, `${faker.name.firstName()} ${faker.name.lastName()}`)),
        documents: Array.from({ length: faker.datatype.number({ min: 3, max: 8 }) }, () => generateMockLoanDocument(loanOfficerId)),
        riskScore: faker.datatype.number({ min: 1, max: 100 }),
        aiRecommendations: Array.from({ length: faker.datatype.number({ min: 1, max: 3 }) }, () => generateMockAiRecommendation(faker.datatype.uuid())),
        valuationHistory: Array.from({ length: faker.datatype.number({ min: 2, max: 5 }) }, generateMockPropertyValuation),
        paymentHistory: generateMockLoanPayment(originationDate, loanDetails.emi, loanDetails.termMonths),
        refinanceEligibility: generateMockRefinanceEligibility(),
        underwritingAnalysis: generateMockUnderwritingAnalysis(),
        communicationLogs: Array.from({ length: faker.datatype.number({ min: 5, max: 15 }) }, generateMockCommunicationLog),
        complianceRecords: Array.from({ length: faker.datatype.number({ min: 2, max: 5 }) }, generateMockComplianceRecord),
    };
};

export const generateMockMarketData = (days: number): MarketData[] => {
    const data: MarketData[] = [];
    let currentDate = new Date();
    let base30Yr = 3.5;
    let baseHPI = 200;

    for (let i = 0; i < days; i++) {
        currentDate.setDate(currentDate.getDate() - 1);
        base30Yr += faker.datatype.float({ min: -0.05, max: 0.05, precision: 0.01 });
        baseHPI += faker.datatype.float({ min: -1, max: 2, precision: 0.1 });

        data.unshift({
            timestamp: new Date(currentDate),
            interestRate30YrFixed: parseFloat(base30Yr.toFixed(2)),
            interestRate15YrFixed: parseFloat((base30Yr - 0.5).toFixed(2)),
            housingPriceIndex: parseFloat(baseHPI.toFixed(1)),
            inflationRate: faker.datatype.float({ min: 1.5, max: 4.5, precision: 0.1 }),
            gdpGrowth: faker.datatype.float({ min: -1.0, max: 3.0, precision: 0.1 }),
            unemploymentRate: faker.datatype.float({ min: 3.5, max: 6.0, precision: 0.1 }),
        });
    }
    return data;
};

// --- Mock API Service Layer ---

export const mockApiService = {
    fetchMortgageLoans: async (userId: string, filter?: string): Promise<MortgageLoan[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const loans = Array.from({ length: 50 }, () => generateMockMortgageLoan(userId));
                resolve(loans);
            }, 500);
        });
    },
    fetchLoanById: async (loanId: string): Promise<MortgageLoan | null> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const consistentLoan = generateMockMortgageLoan(faker.datatype.uuid());
                consistentLoan.id = loanId;
                resolve(consistentLoan);
            }, 300);
        });
    },
    updateLoanStatus: async (loanId: string, status: MortgageLoan['status']): Promise<MortgageLoan> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockLoan = generateMockMortgageLoan(faker.datatype.uuid());
                mockLoan.id = loanId;
                mockLoan.status = status;
                resolve(mockLoan);
            }, 300);
        });
    },
    fetchMarketData: async (period: '7d' | '30d' | '90d' | '1y'): Promise<MarketData[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let days = 0;
                switch (period) {
                    case '7d': days = 7; break;
                    case '30d': days = 30; break;
                    case '90d': days = 90; break;
                    case '1y': days = 365; break;
                }
                resolve(generateMockMarketData(days));
            }, 400);
        });
    },
    fetchPortfolioSummary: async (userId: string): Promise<PortfolioSummary> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const loans = Array.from({ length: 50 }, () => generateMockMortgageLoan(userId));
                const totalLoans = loans.length;
                const totalPortfolioValue = loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
                const avgInterestRate = loans.reduce((sum, loan) => sum + loan.loanDetails.interestRate, 0) / totalLoans;
                const avgLTV = loans.reduce((sum, loan) => sum + calculateLTV(loan.currentBalance, loan.property.currentValue), 0) / totalLoans;
                const delinquencyRate = loans.filter(l => l.status === 'defaulted' || (l.paymentHistory.length > 0 && l.paymentHistory[l.paymentHistory.length - 1].isLate)).length / totalLoans;
                const highRiskLoans = loans.filter(l => l.riskScore > 70).map(l => l.id).slice(0, 5);
                const geographicDistribution: { [state: string]: number } = {};
                loans.forEach(loan => {
                    const state = loan.property.address.state;
                    geographicDistribution[state] = (geographicDistribution[state] || 0) + 1;
                });
                const loanTypeDistribution: { [type: string]: number } = {};
                loans.forEach(loan => {
                    const type = loan.loanDetails.loanType;
                    loanTypeDistribution[type] = (loanTypeDistribution[type] || 0) + 1;
                });

                resolve({
                    totalLoans,
                    totalPortfolioValue,
                    avgInterestRate,
                    avgLTV,
                    delinquencyRate: parseFloat(delinquencyRate.toFixed(2)),
                    forecastedDefaults: faker.datatype.number({ min: 1, max: 5 }),
                    topPerformers: faker.random.arrayElements(loans.map(l => l.id), 3),
                    highRiskLoans,
                    geographicDistribution,
                    loanTypeDistribution,
                });
            }, 600);
        });
    },
    fetchAiRecommendations: async (userId: string, loanId?: string): Promise<AiRecommendation[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Array.from({ length: faker.datatype.number({ min: 5, max: 15 }) }, () => generateMockAiRecommendation(loanId || faker.datatype.uuid())));
            }, 300);
        });
    },
    fetchUserProfile: async (userId: string): Promise<UserProfile> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: userId,
                    firstName: "Jane",
                    lastName: "Doe",
                    email: "jane.doe@megacorp.com",
                    role: "portfolio_manager",
                    permissions: ["view_all_loans", "manage_portfolio", "approve_refinance", "run_stress_tests"],
                    avatarUrl: "https://i.pravatar.cc/150?img=3"
                });
            }, 200);
        });
    },
    fetchAppSettings: async (userId: string): Promise<AppSettings> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    theme: 'dark',
                    currency: 'USD',
                    dateFormat: 'MM/DD/YYYY',
                    notificationPreferences: { email: true, sms: false, inApp: true },
                    defaultPortfolioFilter: 'all',
                    aiConfidenceThreshold: 0.85,
                });
            }, 200);
        });
    },
    saveAppSettings: async (userId: string, settings: AppSettings): Promise<AppSettings> => {
        return new Promise((resolve) => setTimeout(() => resolve(settings), 200));
    },
    runStressTest: async (scenario: 'Recession' | 'Rate Hike' | 'Housing Crash') => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    scenario,
                    projectedDefaultRate: faker.datatype.float({ min: 0.05, max: 0.25, precision: 0.01 }),
                    portfolioValueAtRisk: faker.datatype.number({ min: 5000000, max: 20000000 }),
                    mostImpactedSegments: ['FHA Loans', 'High LTV Properties', `Loans in ${faker.address.stateAbbr()}`],
                });
            }, 1500);
        });
    },
};

// --- Custom Hooks ---

export const useLoans = (userId: string, initialFilter?: string) => {
    const [loans, setLoans] = useState<MortgageLoan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>(initialFilter || 'all');

    const fetchLoans = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await mockApiService.fetchMortgageLoans(userId, filter);
            setLoans(data);
        } catch (err) {
            setError('Failed to fetch mortgage loans.');
        } finally {
            setLoading(false);
        }
    }, [userId, filter]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const updateLoanStatus = useCallback(async (loanId: string, status: MortgageLoan['status']) => {
        try {
            const updatedLoan = await mockApiService.updateLoanStatus(loanId, status);
            setLoans(prevLoans => prevLoans.map(loan => loan.id === loanId ? updatedLoan : loan));
            return updatedLoan;
        } catch (err) {
            setError('Failed to update loan status.');
            throw err;
        }
    }, []);

    return { loans, loading, error, setFilter, updateLoanStatus, refreshLoans: fetchLoans };
};

export const useMarketData = (period: '7d' | '30d' | '90d' | '1y') => {
    const [marketData, setMarketData] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await mockApiService.fetchMarketData(period);
                setMarketData(data);
            } catch (err) {
                setError('Failed to fetch market data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [period]);

    return { marketData, loading, error };
};

export const usePortfolioSummary = (userId: string) => {
    const [summary, setSummary] = useState<PortfolioSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await mockApiService.fetchPortfolioSummary(userId);
                setSummary(data);
            } catch (err) {
                setError('Failed to fetch portfolio summary.');
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [userId]);

    return { summary, loading, error };
};

export const useAiRecommendations = (userId: string, loanId?: string) => {
    const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await mockApiService.fetchAiRecommendations(userId, loanId);
                setRecommendations(data);
            } catch (err) {
                setError('Failed to fetch AI recommendations.');
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, [userId, loanId]);

    return { recommendations, loading, error };
};

// --- MortgageAppProvider for Global State ---
export const MortgageAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [settings, setSettings] = useState<AppSettings>({
        theme: 'dark',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        notificationPreferences: { email: true, sms: false, inApp: true },
        defaultPortfolioFilter: 'all',
        aiConfidenceThreshold: 0.85,
    });
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const initApp = async () => {
            const mockUserId = 'user-123';
            const user = await mockApiService.fetchUserProfile(mockUserId);
            setCurrentUser(user);
            const userSettings = await mockApiService.fetchAppSettings(user.id);
            setSettings(userSettings);
        };
        initApp();
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        setNotifications(prev => [{ ...notification, id: faker.datatype.uuid(), timestamp: new Date(), read: false }, ...prev]);
    }, []);

    const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
        if (currentUser) {
            const updated = await mockApiService.saveAppSettings(currentUser.id, { ...settings, ...newSettings });
            setSettings(updated);
            addNotification({ type: 'success', message: 'Settings updated successfully.' });
        }
    }, [currentUser, settings, addNotification]);

    const login = useCallback((user: UserProfile) => {
        setCurrentUser(user);
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
    }, []);

    const contextValue = useMemo(() => ({
        currentUser,
        settings,
        notifications,
        addNotification,
        updateSettings,
        login,
        logout,
    }), [currentUser, settings, notifications, addNotification, updateSettings, login, logout]);

    return (
        <MortgageAppContext.Provider value={contextValue}>
            {children}
        </MortgageAppContext.Provider>
    );
};

// --- UI Components ---

export const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-400">Loading...</p>
    </div>
);

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-800 p-3 rounded-lg text-white">
        <p className="font-bold">Error:</p>
        <p>{message}</p>
    </div>
);

export const NotificationCenter: React.FC = () => {
    const { notifications, addNotification } = useMortgageApp();
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() < 0.3) {
                const types: Notification['type'][] = ['info', 'warning', 'success'];
                const messages = [
                    'New loan application received: Jane Doe',
                    'High-risk alert for Loan #1234567890',
                    'Interest rate forecast updated: rates expected to rise.',
                    'Refinance opportunity detected for client John Smith!',
                    'Portfolio summary generated successfully.'
                ];
                addNotification({
                    message: faker.random.arrayElement(messages),
                    type: faker.random.arrayElement(types),
                });
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [addNotification]);


    if (notifications.length === 0 && !isOpen) return null;

    return (
        <div className="relative">
            <button
                className="relative p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <i className="fas fa-bell text-white"></i>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto border border-gray-700">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-white">Notifications ({unreadCount} unread)</h3>
                        <button className="text-blue-400 text-sm hover:underline">Mark all as read</button>
                    </div>
                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map((n, index) => (
                                <li key={n.id || index} className={`p-3 border-b border-gray-700 last:border-b-0 ${n.read ? 'bg-gray-800' : 'bg-gray-700/50'}`}>
                                    <div className="flex justify-between items-start">
                                        <p className={`text-sm ${n.read ? 'text-gray-400' : 'text-white font-medium'}`}>
                                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${n.type === 'info' ? 'bg-blue-500' : n.type === 'warning' ? 'bg-yellow-500' : n.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                            {n.message}
                                        </p>
                                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{formatDate(n.timestamp, 'MM/DD/YYYY')}</span>
                                    </div>
                                    {n.link && (
                                        <a href={n.link} className="text-blue-400 text-xs hover:underline mt-1 block">View Details</a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (<p className="text-gray-400 p-4 text-center">No new notifications.</p>)}
                </div>
            )}
        </div>
    );
};

export const UserProfileDropdown: React.FC = () => {
    const { currentUser, logout } = useMortgageApp();
    const [isOpen, setIsOpen] = useState(false);

    if (!currentUser) return null;

    return (
        <div className="relative">
            <button
                className="flex items-center space-x-2 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src={currentUser.avatarUrl || `https://i.pravatar.cc/150?u=${currentUser.id}`} alt="User Avatar" className="w-8 h-8 rounded-full border border-gray-500" />
                <span className="hidden md:block">{currentUser.firstName}</span>
                <i className="fas fa-caret-down text-sm"></i>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700">
                    <div className="p-3 border-b border-gray-700">
                        <p className="text-white font-semibold">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-gray-400 text-sm">{currentUser.role.replace(/_/g, ' ').toUpperCase()}</p>
                    </div>
                    <ul className="py-1">
                        <li><a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile Settings</a></li>
                        <li><a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">App Settings</a></li>
                        <li><button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">Logout</button></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export const AppHeader: React.FC<{ onCommandPaletteToggle: () => void }> = ({ onCommandPaletteToggle }) => {
    return (
        <header className="flex justify-between items-center py-4 px-6 bg-gray-900 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">Mortgage Dashboard</h1>
            <div className="flex items-center space-x-4">
                <button onClick={onCommandPaletteToggle} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white" title="Command Palette (Ctrl+K)">
                    <i className="fas fa-terminal"></i>
                </button>
                <NotificationCenter />
                <UserProfileDropdown />
            </div>
        </header>
    );
};

export const MarketTrendChart: React.FC = () => {
    const [timePeriod, setTimePeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const { marketData, loading, error } = useMarketData(timePeriod);

    const data = useMemo(() => ({
        labels: marketData.map(d => formatDate(d.timestamp, 'MM/DD/YYYY')),
        datasets: [
            {
                label: '30-Year Fixed Rate',
                data: marketData.map(d => d.interestRate30YrFixed),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'y',
                fill: false,
                tension: 0.3
            },
            {
                label: 'Housing Price Index',
                data: marketData.map(d => d.housingPriceIndex),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y1',
                fill: false,
                tension: 0.3
            },
        ],
    }), [marketData]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const, labels: { color: 'white' } },
            title: { display: true, text: 'Key Market Trends', color: 'white', font: { size: 16 } },
        },
        scales: {
            x: { ticks: { color: 'rgb(156, 163, 175)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            y: {
                type: 'linear' as const, display: true, position: 'left' as const,
                title: { display: true, text: 'Interest Rate (%)', color: 'rgb(53, 162, 235)' },
                ticks: { color: 'rgb(53, 162, 235)' }, grid: { color: 'rgba(255,255,255,0.1)' },
            },
            y1: {
                type: 'linear' as const, display: true, position: 'right' as const,
                title: { display: true, text: 'Housing Price Index', color: 'rgb(255, 99, 132)' },
                grid: { drawOnChartArea: false, color: 'rgba(255,255,255,0.1)' },
                ticks: { color: 'rgb(255, 99, 132)' },
            },
        },
    };

    return (
        <Card title="Market Trends & AI Forecast">
            <div className="flex justify-end space-x-2 mb-4">
                {['7d', '30d', '90d', '1y'].map(p => (
                    <button
                        key={p}
                        className={`px-3 py-1 text-sm rounded-md ${timePeriod === p ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setTimePeriod(p as typeof timePeriod)}
                    >{p.toUpperCase()}</button>
                ))}
            </div>
            {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : (
                <div style={{ height: '300px' }}>
                    <Line data={data} options={options} />
                </div>
            )}
            <p className="text-gray-400 text-sm mt-4">AI models provide forward-looking insights on rate changes and property value shifts to guide your strategy.</p>
        </Card>
    );
};

export const AiRecommendationList: React.FC = () => {
    const { currentUser } = useMortgageApp();
    const { recommendations, loading, error } = useAiRecommendations(currentUser?.id || 'mock-user-id');

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (recommendations.length === 0) return <p className="text-gray-400">No AI recommendations at this time.</p>;

    return (
        <Card title="AI Insights & Actionable Recommendations">
            <ul className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                {recommendations.map(rec => (
                    <li key={rec.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${rec.severity === 'high' ? 'bg-red-900 text-red-200' : rec.severity === 'medium' ? 'bg-yellow-900 text-yellow-200' : 'bg-blue-900 text-blue-200'}`}>
                                {rec.severity.toUpperCase()}
                            </span>
                            <span className="text-gray-500 text-xs">{formatDate(rec.timestamp, 'MM/DD/YYYY')}</span>
                        </div>
                        <h4 className="font-semibold text-white mb-1">{rec.type.replace(/_/g, ' ')}</h4>
                        <p className="text-gray-300 text-sm">{rec.message}</p>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export const PortfolioOverview: React.FC = () => {
    const { currentUser, settings } = useMortgageApp();
    const { summary, loading, error } = usePortfolioSummary(currentUser?.id || 'mock-user-id');

    const chartData = useMemo(() => {
        if (!summary) return { geographicData: null, loanTypeData: null };
        return {
            geographicData: {
                labels: Object.keys(summary.geographicDistribution),
                datasets: [{ data: Object.values(summary.geographicDistribution), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900'] }]
            },
            loanTypeData: {
                labels: Object.keys(summary.loanTypeDistribution).map(type => type.replace(/_/g, ' ')),
                datasets: [{ data: Object.values(summary.loanTypeDistribution), backgroundColor: ['#50C878', '#FFD700', '#AEC6CF', '#FF6961', '#7FFFD4'] }]
            },
        };
    }, [summary]);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right' as const, labels: { color: 'white' } }, title: { display: false } },
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!summary) return null;

    return (
        <Card title="Portfolio Performance Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Loans</p>
                    <p className="text-white text-2xl font-bold">{summary.totalLoans}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                    <p className="text-gray-400 text-sm">Portfolio Value</p>
                    <p className="text-white text-2xl font-bold">{formatCurrency(summary.totalPortfolioValue, settings.currency)}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                    <p className="text-gray-400 text-sm">Avg. Interest Rate</p>
                    <p className="text-white text-2xl font-bold">{summary.avgInterestRate.toFixed(2)}%</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                    <p className="text-gray-400 text-sm">Delinquency Rate</p>
                    <p className="text-white text-2xl font-bold text-yellow-400">{summary.delinquencyRate.toFixed(2)}%</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                    <h3 className="text-white text-lg font-semibold mb-3">Geographic Distribution</h3>
                    {chartData.geographicData && <div style={{ height: '250px' }}><Doughnut data={chartData.geographicData} options={chartOptions} /></div>}
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                    <h3 className="text-white text-lg font-semibold mb-3">Loan Type Distribution</h3>
                    {chartData.loanTypeData && <div style={{ height: '250px' }}><Doughnut data={chartData.loanTypeData} options={chartOptions} /></div>}
                </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                    <h3 className="text-white text-lg font-semibold mb-3">High-Risk Loans (AI-identified)</h3>
                    <ul className="space-y-2">
                        {summary.highRiskLoans.map(id => <li key={id} className="flex items-center text-red-400"><i className="fas fa-exclamation-triangle mr-2"></i><a href={`/loans/${id}`} className="hover:underline text-sm">Loan ID: {id.substring(0, 8)}</a></li>)}
                    </ul>
                </div>
                 <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                    <h3 className="text-white text-lg font-semibold mb-3">Forecasted Defaults (Next 90 Days)</h3>
                    <p className="text-red-400 text-3xl font-bold">{summary.forecastedDefaults}</p>
                    <p className="text-gray-400 text-sm mt-2">Our AI predicts potential defaults, allowing for proactive intervention.</p>
                </div>
            </div>
        </Card>
    );
};

export const LoanListingTable: React.FC = () => {
    const { currentUser, settings } = useMortgageApp();
    const { loans, loading, error, setFilter, updateLoanStatus } = useLoans(currentUser?.id || 'mock-user-id');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLoan, setSelectedLoan] = useState<MortgageLoan | null>(null);

    const filteredLoans = useMemo(() => {
        return loans.filter(loan =>
            `${loan.borrower.firstName} ${loan.borrower.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loan.property.address.zipCode.includes(searchTerm)
        );
    }, [loans, searchTerm]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <Card title="All Mortgage Loans">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-3 md:space-y-0">
                <input
                    type="text"
                    placeholder="Search by borrower name, loan #, or zip..."
                    className="p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Loan #</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Borrower</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current Balance</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Score</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                        {filteredLoans.map((loan) => (
                            <tr key={loan.id} className="hover:bg-gray-800">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{loan.loanNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{loan.borrower.firstName} {loan.borrower.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(loan.currentBalance, settings.currency)}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.status === 'servicing' ? 'bg-green-100 text-green-800' : loan.status === 'defaulted' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{loan.status.replace(/_/g, ' ')}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{loan.riskScore}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setSelectedLoan(loan)} className="text-blue-400 hover:text-blue-600 mr-3">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedLoan && (
                <LoanDetailsModal loan={selectedLoan} onClose={() => setSelectedLoan(null)} />
            )}
        </Card>
    );
};

export const LoanDetailsModal: React.FC<{ loan: MortgageLoan; onClose: () => void }> = ({ loan, onClose }) => {
    const { settings } = useMortgageApp();
    const TABS = ['overview', 'underwriting', 'payments', 'documents', 'communications', 'compliance', 'amortization'];
    const [activeTab, setActiveTab] = useState(TABS[0]);

    const amortizationChartData = useMemo(() => ({
        labels: loan.loanDetails.amortizationSchedule.map(p => p.month),
        datasets: [{
            label: 'Remaining Balance',
            data: loan.loanDetails.amortizationSchedule.map(p => p.remainingBalance),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true, tension: 0.1,
        }],
    }), [loan.loanDetails.amortizationSchedule]);

    const underwritingRadarData = useMemo(() => ({
        labels: ['Credit Score', 'DTI', 'LTV', 'Income Stability', 'Property Viability'],
        datasets: [{
            label: 'Underwriting Factors',
            data: Object.values(loan.underwritingAnalysis.keyFactors),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    }), [loan.underwritingAnalysis.keyFactors]);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-2xl font-bold text-white">Loan Details: {loan.loanNumber}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="flex border-b border-gray-700 overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Loan & Borrower Info */}
                            <div className="space-y-4">
                                <h4 className="text-xl font-semibold text-white">Borrower & Property</h4>
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p>Borrower: <span className="text-white">{loan.borrower.firstName} {loan.borrower.lastName}</span></p>
                                    <p>Credit Score: <span className="text-white">{loan.borrower.creditScore}</span></p>
                                    <p>Property: <span className="text-white">{loan.property.address.street}, {loan.property.address.city}</span></p>
                                    <p>Current Value (AI): <span className="text-white">{formatCurrency(loan.property.currentValue, settings.currency)}</span></p>
                                </div>
                                <h4 className="text-xl font-semibold text-white">Loan Summary</h4>
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p>Current Balance: <span className="text-white">{formatCurrency(loan.currentBalance, settings.currency)}</span></p>
                                    <p>Interest Rate: <span className="text-white">{loan.loanDetails.interestRate}%</span></p>
                                    <p>Next Payment: <span className="text-white">{formatCurrency(loan.nextPaymentAmount, settings.currency)} on {formatDate(loan.nextPaymentDate, settings.dateFormat)}</span></p>
                                    <p>Risk Score: <span className="text-white font-bold">{loan.riskScore}</span></p>
                                </div>
                            </div>
                            {/* AI Opportunities */}
                            <div className="space-y-4">
                                {loan.refinanceEligibility.isEligible && (
                                    <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-700">
                                        <h4 className="text-xl font-semibold text-blue-200"><i className="fas fa-magic mr-2"></i> Refinance Opportunity</h4>
                                        <p className="text-blue-300 mt-2">Suggested Rate: <span className="font-bold">{loan.refinanceEligibility.suggestedRate}%</span>, saving <span className="font-bold">{formatCurrency(loan.refinanceEligibility.estimatedSavingsMonthly || 0)}/mo</span>.</p>
                                        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Explore Options</button>
                                    </div>
                                )}
                                {loan.aiRecommendations.length > 0 && (
                                    <div className="bg-purple-900/50 p-4 rounded-lg border border-purple-700">
                                        <h4 className="text-xl font-semibold text-purple-200"><i className="fas fa-robot mr-2"></i> AI Recommendations</h4>
                                        <ul className="mt-2 space-y-2">
                                            {loan.aiRecommendations.map(rec => <li key={rec.id} className="text-purple-300 text-sm">{rec.message}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'underwriting' && (
                         <div>
                            <h4 className="text-xl font-semibold text-white mb-4">AI Underwriting Analysis</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div style={{ height: '300px' }}><Radar data={underwritingRadarData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' }}}, scales: { r: { pointLabels: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.2)' }, angleLines: { color: 'rgba(255,255,255,0.2)' }}} }}/></div>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p>Decision: <span className="font-bold text-white">{loan.underwritingAnalysis.decision}</span> (Confidence: {(loan.underwritingAnalysis.confidenceScore * 100).toFixed(1)}%)</p>
                                    <p className="mt-2 text-green-300">Positives: {loan.underwritingAnalysis.positiveFlags.join(', ')}</p>
                                    <p className="mt-2 text-red-300">Negatives: {loan.underwritingAnalysis.negativeFlags.join(', ')}</p>
                                    <p className="mt-4 text-gray-300">AI Note: {loan.underwritingAnalysis.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'payments' && (
                        <div className="overflow-x-auto max-h-96 custom-scrollbar">
                           <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700 sticky top-0">
                                    <tr>
                                        {['Date', 'Amount', 'Principal', 'Interest', 'Status'].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loan.paymentHistory.map(p => (
                                        <tr key={p.id}>
                                            <td className="px-4 py-2 text-sm text-gray-300">{formatDate(p.paymentDate, settings.dateFormat)}</td>
                                            <td className="px-4 py-2 text-sm text-white">{formatCurrency(p.amount)}</td>
                                            <td className="px-4 py-2 text-sm text-green-300">{formatCurrency(p.principalPaid)}</td>
                                            <td className="px-4 py-2 text-sm text-red-300">{formatCurrency(p.interestPaid)}</td>
                                            <td className="px-4 py-2 text-sm"><span className={`px-2 inline-flex text-xs font-semibold rounded-full ${p.isLate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{p.isLate ? 'Late' : 'On Time'}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                           </table>
                        </div>
                    )}
                    {activeTab === 'amortization' && (
                        <div style={{ height: '400px' }}><Line data={amortizationChartData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' }}}, scales: { x: { ticks: { color: 'white' }}, y: { ticks: { color: 'white' }}} }} /></div>
                    )}
                    {/* Add content for other tabs: documents, communications, compliance */}
                </div>
            </div>
        </div>
    );
};

export const StressTestingDashboard: React.FC = () => {
    const [scenario, setScenario] = useState<'Recession' | 'Rate Hike' | 'Housing Crash' | null>(null);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const runTest = async (testScenario: 'Recession' | 'Rate Hike' | 'Housing Crash') => {
        setScenario(testScenario);
        setLoading(true);
        setResults(null);
        const data = await mockApiService.runStressTest(testScenario);
        setResults(data);
        setLoading(false);
    };

    return (
        <Card title="AI-Powered Portfolio Stress Testing">
            <div className="flex space-x-4 mb-4">
                <button onClick={() => runTest('Recession')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-500" disabled={loading}>Simulate Recession</button>
                <button onClick={() => runTest('Rate Hike')} className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-500" disabled={loading}>Simulate Rate Hike</button>
                <button onClick={() => runTest('Housing Crash')} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-500" disabled={loading}>Simulate Housing Crash</button>
            </div>
            {loading && <LoadingSpinner />}
            {results && (
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-2">Results for "{results.scenario}" Scenario</h3>
                    <p className="text-lg text-red-400">Projected Default Rate: <span className="font-mono">{(results.projectedDefaultRate * 100).toFixed(2)}%</span></p>
                    <p className="text-lg text-red-400">Portfolio Value at Risk (VaR): <span className="font-mono">{formatCurrency(results.portfolioValueAtRisk)}</span></p>
                    <div className="mt-2">
                        <h4 className="font-semibold text-gray-300">Most Impacted Segments:</h4>
                        <ul className="list-disc list-inside text-gray-400">
                            {results.mostImpactedSegments.map((seg: string, i: number) => <li key={i}>{seg}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </Card>
    );
};

// --- Main MortgagesView Component ---
const MortgagesView: React.FC = () => {
    const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <MortgageAppProvider>
            <div className="min-h-screen bg-gray-900 flex flex-col">
                <AppHeader onCommandPaletteToggle={() => setCommandPaletteOpen(true)} />
                <main className="flex-1 p-6 space-y-6">
                    <h2 className="text-4xl font-extrabold text-white tracking-wider mb-8">Mortgage Command Center <i className="fas fa-home ml-2 text-blue-400"></i></h2>

                    <Card title="Mission Brief: AI-Powered Mortgage Ecosystem">
                        <p className="text-gray-400 leading-relaxed">
                            Welcome to your advanced Mortgage Command Center. This comprehensive platform integrates mortgage origination, servicing, and portfolio management with cutting-edge AI.
                            Leverage AI-driven forecasting for interest rates, real-time property valuations, and predictive refinancing alerts to optimize your operations and client engagement.
                        </p>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MarketTrendChart />
                        <AiRecommendationList />
                    </div>

                    <StressTestingDashboard />

                    <PortfolioOverview />

                    <LoanListingTable />
                </main>
                <footer className="bg-gray-900 border-t border-gray-700 p-4 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} MegaCorp Mortgage. All rights reserved. Powered by AI.
                </footer>
            </div>
        </MortgageAppProvider>
    );
};

export default MortgagesView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/finance/MortgagesView.tsx
================================================================================

// components/views/megadashboard/finance/MortgagesView.tsx
import React from 'react';
import Card from '../../../Card';

const MortgagesView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Mortgage Command Center</h2>
            <Card title="Mission Brief">
                <p className="text-gray-400">A comprehensive platform for mortgage origination, servicing, and portfolio management. This system is enhanced with AI-driven forecasting and real-time risk analysis to navigate the complexities of the housing market.</p>
            </Card>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="AI Interest Rate Forecasting"><p>Our predictive models forecast future interest rate movements, allowing for proactive hedging and informed decisions on new mortgage products.</p></Card>
                 <Card title="AI-Based Property Valuation"><p>Get instant, data-driven property valuation estimates using our proprietary AI models, trained on millions of real estate transactions.</p></Card>
                 <Card title="Predictive Refinancing Alerts"><p>Identify clients in your portfolio who are prime candidates for refinancing based on market conditions and their financial profile, creating new business opportunities.</p></Card>
            </div>
        </div>
    );
};

export default MortgagesView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/finance/MortgagesView.tsx
================================================================================

// components/views/megadashboard/finance/MortgagesView.tsx
import React from 'react';
import Card from '../../../Card';

const MortgagesView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Mortgage Command Center</h2>
            <Card title="Mission Brief">
                <p className="text-gray-400">A comprehensive platform for mortgage origination, servicing, and portfolio management. This system is enhanced with AI-driven forecasting and real-time risk analysis to navigate the complexities of the housing market.</p>
            </Card>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="AI Interest Rate Forecasting"><p>Our predictive models forecast future interest rate movements, allowing for proactive hedging and informed decisions on new mortgage products.</p></Card>
                 <Card title="AI-Based Property Valuation"><p>Get instant, data-driven property valuation estimates using our proprietary AI models, trained on millions of real estate transactions.</p></Card>
                 <Card title="Predictive Refinancing Alerts"><p>Identify clients in your portfolio who are prime candidates for refinancing based on market conditions and their financial profile, creating new business opportunities.</p></Card>
            </div>
        </div>
    );
};

export default MortgagesView;