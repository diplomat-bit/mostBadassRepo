// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/finance/TaxCenterView.tsx
================================================================================

// components/views/megadashboard/finance/TaxCenterView.tsx
import React, { useState, useContext } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI, Type } from "@google/genai";

const TaxCenterView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("TaxCenterView must be within a DataProvider");
    
    const { transactions } = context;
    const [deductions, setDeductions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const findDeductions = async () => {
        setIsLoading(true);
        setDeductions([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are an expert tax AI. Analyze this list of transactions and identify potential tax deductions for a freelance consultant. For each, provide the transaction description, amount, a potential deduction category, and a brief justification. Transactions:\n${transactions.map(t => `${t.description} - $${t.amount}`).join('\n')}`;
            const schema = { type: Type.OBJECT, properties: { deductions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, amount: { type: Type.NUMBER }, category: { type: Type.STRING }, justification: { type: Type.STRING } } } } } };
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setDeductions(JSON.parse(response.text).deductions);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Tax Center</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">$15,250</p><p className="text-sm text-gray-400 mt-1">Estimated Liability</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">${deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</p><p className="text-sm text-gray-400 mt-1">Deductions Found</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">15%</p><p className="text-sm text-gray-400 mt-1">Effective Tax Rate</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-yellow-400">Low</p><p className="text-sm text-gray-400 mt-1">AI Audit Risk</p></Card>
            </div>

            <Card title="AI Deduction Finder">
                <div className="text-center">
                    <button onClick={findDeductions} disabled={isLoading} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50">
                        {isLoading ? 'Scanning Transactions...' : 'Run AI Deduction Scan'}
                    </button>
                </div>
                {deductions.length > 0 && (
                    <div className="mt-6 space-y-3">
                        {deductions.map((d, i) => (
                            <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-white">{d.description} - ${d.amount}</h4>
                                    <span className="text-xs bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-full">{d.category}</span>
                                </div>
                                <p className="text-sm text-gray-400 italic mt-1">"{d.justification}"</p>
                            </div>
                        ))}
                    </div>
                )}
                 { !isLoading && deductions.length === 0 && <p className="text-center text-gray-500 mt-4">Run the scan to find potential tax deductions.</p>}
            </Card>
        </div>
    );
};

export default TaxCenterView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/finance/TaxCenterView.tsx
================================================================================

// components/views/megadashboard/finance/TaxCenterView.tsx
import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI, Type } from "@google/genai";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


// --- ENUMERATIONS AND TYPE DEFINITIONS (Approximately 1500 lines) ---

/**
 * @typedef {object} Transaction
 * @property {string} id - Unique identifier for the transaction.
 * @property {string} description - A brief description of the transaction.
 * @property {number} amount - The monetary value of the transaction.
 * @property {Date} date - The date of the transaction.
 * @property {string} type - 'income' or 'expense'.
 * @property {string} [category] - Optional category assigned to the transaction.
 * @property {string} [merchant] - Optional merchant name.
 * @property {string} [currency] - Currency of the transaction (e.g., 'USD').
 */
export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: Date;
    type: 'income' | 'expense';
    category?: string;
    merchant?: string;
    currency?: string;
    rawDetails?: string; // Additional raw data for AI analysis
}

/**
 * @typedef {object} Deduction
 * @property {string} id - Unique identifier for the deduction.
 * @property {string} description - Detailed description of the deduction.
 * @property {number} amount - The deductible amount.
 * @property {DeductionCategory} category - The tax deduction category.
 * @property {string} justification - AI-generated or user-provided justification.
 * @property {string[]} [transactionIds] - IDs of transactions supporting this deduction.
 * @property {boolean} [isApproved] - Whether the user has approved this deduction.
 * @property {boolean} [isAIRecommended] - Whether this deduction was initially AI-recommended.
 * @property {string} [receiptUrl] - URL to an uploaded receipt.
 * @property {string} [notes] - User notes about the deduction.
 * @property {Date} [dateAdded] - Date the deduction was added.
 */
export interface Deduction {
    id: string;
    description: string;
    amount: number;
    category: DeductionCategory;
    justification: string;
    transactionIds?: string[];
    isApproved?: boolean;
    isAIRecommended?: boolean;
    receiptUrl?: string;
    notes?: string;
    dateAdded?: Date;
}

/**
 * @typedef {object} IncomeSource
 * @property {string} id - Unique ID.
 * @property {string} name - Name of the income source (e.g., "Client A", "Salary").
 * @property {IncomeType} type - Type of income (W2, 1099-NEC, etc.).
 * @property {number} amountYTD - Year-to-date income from this source.
 * @property {string} [employerId] - For W2 income.
 * @property {string} [ein] - For 1099 income (Employer Identification Number).
 * @property {boolean} [isPassive] - If income is passive (e.g., rental, investments).
 * @property {string} [notes] - Additional notes.
 */
export interface IncomeSource {
    id: string;
    name: string;
    type: IncomeType;
    amountYTD: number;
    employerId?: string;
    ein?: string;
    isPassive?: boolean;
    notes?: string;
}

/**
 * @typedef {object} TaxProfile
 * @property {string} userId - User's ID.
 * @property {number} taxYear - The current tax year.
 * @property {FilingStatus} filingStatus - User's tax filing status.
 * @property {number} dependents - Number of dependents.
 * @property {string} stateOfResidence - User's primary state of residence.
 * @property {boolean} hasHealthInsurance - Whether the user has health insurance.
 * @property {boolean} isSelfEmployed - True if the user is self-employed.
 * @property {number} [estimatedAGI] - Estimated Adjusted Gross Income for the year.
 * @property {number} [federalTaxWithheldYTD] - Total federal tax withheld YTD.
 * @property {number} [stateTaxWithheldYTD] - Total state tax withheld YTD.
 * @property {number} [federalEstimatedTaxPaid] - Total federal estimated tax payments made.
 * @property {number} [stateEstimatedTaxPaid] - Total state estimated tax payments made.
 * @property {number} [priorYearAGI] - AGI from previous tax year (for safe harbor).
 * @property {boolean} [isFirstTimeFiler] - If the user is filing for the first time.
 * @property {boolean} [isStudent] - If the user is a student.
 * @property {boolean} [isHomeowner] - If the user owns a home.
 * @property {boolean} [hasInvestments] - If the user has investment income/losses.
 * @property {boolean} [hasRentalIncome] - If the user has rental property income.
 */
export interface TaxProfile {
    userId: string;
    taxYear: number;
    filingStatus: FilingStatus;
    dependents: number;
    stateOfResidence: string;
    hasHealthInsurance: boolean;
    isSelfEmployed: boolean;
    estimatedAGI?: number;
    federalTaxWithheldYTD?: number;
    stateTaxWithheldYTD?: number;
    federalEstimatedTaxPaid?: number;
    stateEstimatedTaxPaid?: number;
    priorYearAGI?: number;
    isFirstTimeFiler?: boolean;
    isStudent?: boolean;
    isHomeowner?: boolean;
    hasInvestments?: boolean;
    hasRentalIncome?: boolean;
}

/**
 * @typedef {object} EstimatedPayment
 * @property {string} id - Unique ID.
 * @property {number} quarter - Tax quarter (1-4).
 * @property {number} amountFederal - Federal estimated tax paid for this quarter.
 * @property {number} amountState - State estimated tax paid for this quarter.
 * @property {Date} paymentDate - Date the payment was made.
 * @property {boolean} isPaid - Whether the payment has been made.
 * @property {Date} dueDate - Due date for the estimated payment.
 */
export interface EstimatedPayment {
    id: string;
    quarter: number;
    amountFederal: number;
    amountState: number;
    paymentDate?: Date;
    isPaid: boolean;
    dueDate: Date;
}

/**
 * @typedef {object} AuditFactor
 * @property {string} name - Name of the audit factor (e.g., "High Deductions relative to Income").
 * @property {number} score - A numerical score indicating risk level (0-100).
 * @property {AuditRiskLevel} level - Categorical risk level.
 * @property {string} explanation - A brief explanation of the factor.
 * @property {string[]} recommendations - Actionable steps to mitigate risk.
 */
export interface AuditFactor {
    name: string;
    score: number;
    level: AuditRiskLevel;
    explanation: string;
    recommendations: string[];
}

/**
 * @typedef {object} TaxScenario
 * @property {string} id - Unique ID.
 * @property {string} name - Name of the scenario (e.g., "Buy a house", "Increase 401k").
 * @property {Partial<TaxProfile>} profileChanges - Changes to the tax profile for this scenario.
 * @property {number} incomeChanges - Delta in income for the scenario.
 * @property {Partial<Deduction>[]} newDeductions - Deductions added in this scenario.
 * @property {Date} dateCreated - Date the scenario was created.
 * @property {ReturnType<typeof calculateFullTaxLiability>} [simulationResult] - Calculated impact on tax liability.
 */
export interface TaxScenario {
    id: string;
    name: string;
    profileChanges: Partial<TaxProfile>;
    incomeChanges: number;
    newDeductions: Partial<Deduction>[];
    dateCreated: Date;
    simulationResult?: ReturnType<typeof calculateFullTaxLiability>;
}


/**
 * @typedef {object} TaxConceptExplanation
 * @property {string} concept - The tax concept being explained.
 * @property {string} explanation - Detailed explanation.
 * @property {string} [example] - An example illustrating the concept.
 * @property {string[]} [relatedConcepts] - Other related tax topics.
 * @property {string[]} [keywords] - Keywords for searchability.
 */
export interface TaxConceptExplanation {
    concept: string;
    explanation: string;
    example?: string;
    relatedConcepts?: string[];
    keywords?: string[];
}

/**
 * @typedef {object} TaxAlert
 * @property {string} id - Unique ID.
 * @property {string} title - Title of the alert.
 * @property {string} description - Detailed description of the alert.
 * @property {TaxAlertSeverity} severity - Severity level of the alert.
 * @property {Date} dateIssued - Date the alert was issued.
 * @property {boolean} isRead - Whether the user has read the alert.
 * @property {string[]} [relatedTaxYears] - Tax years relevant to the alert.
 * @property {string[]} [affectedStates] - States affected by the alert.
 * @property {string} [callToAction] - Optional call to action.
 * @property {string} [learnMoreUrl] - URL for more information.
 */
export interface TaxAlert {
    id: string;
    title: string;
    description: string;
    severity: TaxAlertSeverity;
    dateIssued: Date;
    isRead: boolean;
    relatedTaxYears?: string[];
    affectedStates?: string[];
    callToAction?: string;
    learnMoreUrl?: string;
}

/**
 * @typedef {object} Receipt
 * @property {string} id - Unique ID.
 * @property {string} fileName - Original file name.
 * @property {string} url - URL to the stored receipt image/PDF.
 * @property {Date} uploadDate - Date of upload.
 * @property {string[]} [linkedDeductionIds] - IDs of deductions linked to this receipt.
 * @property {string} [extractedText] - Text extracted by OCR (if applicable).
 * @property {string} [aiSummary] - AI-generated summary of the receipt.
 * @property {number} [amount] - Amount parsed from receipt.
 * @property {Date} [transactionDate] - Date parsed from receipt.
 */
export interface Receipt {
    id: string;
    fileName: string;
    url: string;
    uploadDate: Date;
    linkedDeductionIds?: string[];
    extractedText?: string;
    aiSummary?: string;
    amount?: number;
    transactionDate?: Date;
}

export interface CryptoTransaction {
    id: string;
    assetId: string;
    symbol: string;
    type: 'buy' | 'sell' | 'staking_reward' | 'airdrop' | 'transfer_in' | 'transfer_out';
    date: Date;
    quantity: number; 
    pricePerCoin: number;
    totalValue: number;
    fees: number;
    notes?: string;
    costBasis?: number;
}

export interface CryptoAsset {
    id: string;
    name: string;
    symbol: string;
    totalHoldings: number;
    averageCostBasis: number;
    currentMarketValue: number;
}


export enum DeductionCategory {
    HomeOffice = 'Home Office',
    BusinessTravel = 'Business Travel',
    ProfessionalDevelopment = 'Professional Development',
    SoftwareSubscriptions = 'Software & Subscriptions',
    ClientEntertainment = 'Client Entertainment',
    MarketingAdvertising = 'Marketing & Advertising',
    VehicleExpenses = 'Vehicle Expenses',
    HealthInsurancePremiums = 'Health Insurance Premiums',
    RetirementContributions = 'Retirement Contributions',
    OfficeSupplies = 'Office Supplies',
    LegalProfessionalFees = 'Legal & Professional Fees',
    Utilities = 'Utilities',
    OtherBusinessExpense = 'Other Business Expense',
    MedicalExpenses = 'Medical Expenses',
    CharitableContributions = 'Charitable Contributions',
    StateLocalTaxes = 'State & Local Taxes',
    MortgageInterest = 'Mortgage Interest',
    StudentLoanInterest = 'Student Loan Interest',
    ChildCareExpenses = 'Child Care Expenses',
    EducationalExpenses = 'Educational Expenses',
    InvestmentExpenses = 'Investment Expenses',
    RealEstateTaxes = 'Real Estate Taxes',
    CasualtyLosses = 'Casualty Losses',
    AlimonyPayments = 'Alimony Payments',
    OtherItemizedDeduction = 'Other Itemized Deduction',
}

export enum IncomeType {
    W2 = 'W2 Salary',
    NEC1099 = '1099-NEC (Non-employee Compensation)',
    K1 = 'K-1 (Partnership/S-Corp)',
    Dividends = 'Dividends (1099-DIV)',
    Interest = 'Interest (1099-INT)',
    CapitalGains = 'Capital Gains (1099-B)',
    RentalIncome = 'Rental Income',
    SocialSecurity = 'Social Security',
    PensionAnnuity = 'Pension/Annuity',
    Unemployment = 'Unemployment Benefits',
    CryptoRewards = 'Crypto Staking/Rewards',
    Other = 'Other Income',
}

export enum FilingStatus {
    Single = 'Single',
    MarriedFilingJointly = 'Married Filing Jointly',
    MarriedFilingSeparately = 'Married Filing Separately',
    HeadOfHousehold = 'Head of Household',
    QualifyingWidow = 'Qualifying Widow(er)',
}

export enum AuditRiskLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    VeryHigh = 'Very High',
}

export enum TaxAlertSeverity {
    Info = 'Info',
    Warning = 'Warning',
    Critical = 'Critical',
}

export enum TaxFormType {
    Form1040 = 'Form 1040',
    ScheduleC = 'Schedule C',
    ScheduleSE = 'Schedule SE',
    Form1040ES = 'Form 1040-ES',
    ScheduleA = 'Schedule A',
    Form8829 = 'Form 8829', // Home Office Expenses
    Form4562 = 'Form 4562', // Depreciation
    Form8949 = 'Form 8949', // Sales and Dispositions of Capital Assets
    ScheduleD = 'Schedule D', // Capital Gains and Losses
    FormW2 = 'Form W-2',
    Form1099NEC = 'Form 1099-NEC',
}

export enum FinancialMetric {
    TotalIncome = 'Total Income',
    TotalExpenses = 'Total Expenses',
    NetProfit = 'Net Profit',
    TotalDeductions = 'Total Deductions',
    EstimatedTaxLiability = 'Estimated Tax Liability',
    EffectiveTaxRate = 'Effective Tax Rate',
    EstimatedQuarterlyPayment = 'Estimated Quarterly Payment',
}

// --- CONSTANTS AND MOCK DATA (Approximately 800 lines) ---

export const TAX_YEAR = new Date().getFullYear();

export const DEDUCTION_CATEGORIES_OPTIONS = Object.values(DeductionCategory).map(cat => ({ value: cat, label: cat }));
export const INCOME_TYPE_OPTIONS = Object.values(IncomeType).map(type => ({ value: type, label: type }));
export const FILING_STATUS_OPTIONS = Object.values(FilingStatus).map(status => ({ value: status, label: status }));

export const FEDERAL_TAX_BRACKETS_SINGLE = [
    { income: 0, rate: 0.10, limit: 11600 },
    { income: 11601, rate: 0.12, limit: 47150 },
    { income: 47151, rate: 0.22, limit: 100525 },
    { income: 100526, rate: 0.24, limit: 191950 },
    { income: 191951, rate: 0.32, limit: 243725 },
    { income: 243726, rate: 0.35, limit: 609350 },
    { income: 609351, rate: 0.37, limit: Infinity },
];

export const FEDERAL_TAX_BRACKETS_MFJ = [ // Married Filing Jointly
    { income: 0, rate: 0.10, limit: 23200 },
    { income: 23201, rate: 0.12, limit: 94300 },
    { income: 94301, rate: 0.22, limit: 201050 },
    { income: 201051, rate: 0.24, limit: 383900 },
    { income: 383901, rate: 0.32, limit: 487450 },
    { income: 487451, rate: 0.35, limit: 731200 },
    { income: 731201, rate: 0.37, limit: Infinity },
];

export const STANDARD_DEDUCTION_2024: Record<FilingStatus, number> = {
    [FilingStatus.Single]: 14600,
    [FilingStatus.MarriedFilingJointly]: 29200,
    [FilingStatus.MarriedFilingSeparately]: 14600,
    [FilingStatus.HeadOfHousehold]: 21900,
    [FilingStatus.QualifyingWidow]: 29200,
};

export const SELF_EMPLOYMENT_TAX_RATE = 0.153; // 12.4% SS + 2.9% Medicare
export const SS_MAX_EARNINGS = 168600; // Social Security wage base limit 2024
export const SE_DEDUCTION_PERCENTAGE = 0.5; // Deduction for one-half of SE tax

export const CA_STATE_TAX_BRACKETS_SINGLE = [
    { income: 0, rate: 0.01, limit: 10412 },
    { income: 10413, rate: 0.02, limit: 24684 },
    { income: 24685, rate: 0.04, limit: 38959 },
    { income: 38960, rate: 0.06, limit: 53909 },
    { income: 53910, rate: 0.08, limit: 68179 },
    { income: 68180, rate: 0.093, limit: 348637 },
    { income: 348638, rate: 0.103, limit: 418361 },
    { income: 418362, rate: 0.113, limit: 697268 },
    { income: 697269, rate: 0.123, limit: 1000000 },
    { income: 1000001, rate: 0.133, limit: Infinity },
];

export const QUARTERLY_DUE_DATES: { [key: number]: Date } = {
    1: new Date(TAX_YEAR, 3, 15), // April 15
    2: new Date(TAX_YEAR, 5, 17), // June 17 (15th is a Saturday)
    3: new Date(TAX_YEAR, 8, 16), // September 16 (15th is a Sunday)
    4: new Date(TAX_YEAR + 1, 0, 15), // January 15 of next year
};

export const MOCK_ALERTS: TaxAlert[] = [
    {
        id: 'alert1',
        title: 'New Health Insurance Deduction Limit for Self-Employed',
        description: 'The IRS has updated the maximum deductible amount for self-employed health insurance premiums. Review your entries to ensure compliance.',
        severity: TaxAlertSeverity.Warning,
        dateIssued: new Date(TAX_YEAR, 0, 10),
        isRead: false,
        relatedTaxYears: [`${TAX_YEAR}`],
        callToAction: 'Update Deduction',
        learnMoreUrl: 'https://www.irs.gov/newsroom/self-employed-health-insurance-deduction',
    },
    {
        id: 'alert2',
        title: 'Q2 Estimated Tax Payment Due Soon!',
        description: `Your second quarter estimated tax payment for ${TAX_YEAR} is due soon. Ensure you have sufficient funds and consider making your payment to avoid penalties.`,
        severity: TaxAlertSeverity.Critical,
        dateIssued: new Date(TAX_YEAR, 4, 20),
        isRead: false,
        relatedTaxYears: [`${TAX_YEAR}`],
        callToAction: 'Make Payment',
        learnMoreUrl: 'https://www.irs.gov/payments/pay-as-you-go- withholding-estimated-tax',
    },
];

export const MOCK_RECEIPTS: Receipt[] = [
    {
        id: 'rec1',
        fileName: 'uber_receipt_1.pdf',
        url: '/receipts/rec1.pdf',
        uploadDate: new Date(TAX_YEAR, 1, 15),
        linkedDeductionIds: ['ded123'],
        extractedText: 'Uber trip to client office. Amount: $45.50. Date: Feb 10, 2024.',
        aiSummary: 'Business travel expense for client meeting.',
        amount: 45.50,
        transactionDate: new Date(TAX_YEAR, 1, 10),
    },
    {
        id: 'rec2',
        fileName: 'adobe_cc_invoice.png',
        url: '/receipts/rec2.png',
        uploadDate: new Date(TAX_YEAR, 2, 10),
        linkedDeductionIds: ['ded456'],
        extractedText: 'Adobe Creative Cloud subscription. Amount: $52.99. Monthly. March 2024.',
        aiSummary: 'Software subscription for professional use.',
        amount: 52.99,
        transactionDate: new Date(TAX_YEAR, 2, 5),
    },
];

export const MOCK_CRYPTO_ASSETS: CryptoAsset[] = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', totalHoldings: 0.5, averageCostBasis: 40000, currentMarketValue: 32500 },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', totalHoldings: 10, averageCostBasis: 2000, currentMarketValue: 18000 },
];

export const MOCK_CRYPTO_TRANSACTIONS: CryptoTransaction[] = [
    { id: 'ctx1', assetId: 'btc', symbol: 'BTC', type: 'buy', date: new Date(TAX_YEAR, 0, 15), quantity: 0.2, pricePerCoin: 42000, totalValue: 8400, fees: 15 },
    { id: 'ctx2', assetId: 'eth', symbol: 'ETH', type: 'buy', date: new Date(TAX_YEAR, 1, 2), quantity: 5, pricePerCoin: 2200, totalValue: 11000, fees: 10 },
    { id: 'ctx3', assetId: 'btc', symbol: 'BTC', type: 'buy', date: new Date(TAX_YEAR, 2, 20), quantity: 0.3, pricePerCoin: 38000, totalValue: 11400, fees: 18 },
    { id: 'ctx4', assetId: 'eth', symbol: 'ETH', type: 'staking_reward', date: new Date(TAX_YEAR, 3, 1), quantity: 0.05, pricePerCoin: 2400, totalValue: 120, fees: 0, notes: 'Staking reward on platform X' },
    { id: 'ctx5', assetId: 'eth', symbol: 'ETH', type: 'sell', date: new Date(TAX_YEAR, 4, 5), quantity: 1, pricePerCoin: 2600, totalValue: 2600, fees: 5 },
];


// --- HELPER FUNCTIONS AND TAX CALCULATION LOGIC (Approximately 4500 lines) ---
const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d', '#4ddbff', '#ffcce0'];


export const generateUniqueId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const formatCurrency = (amount: number | undefined | null): string => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return '$0.00';
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const calculateFederalTax = (taxableIncome: number, filingStatus: FilingStatus): number => {
    if (taxableIncome <= 0) return 0;
    let tax = 0;
    const brackets = filingStatus === FilingStatus.MarriedFilingJointly ? FEDERAL_TAX_BRACKETS_MFJ : FEDERAL_TAX_BRACKETS_SINGLE;
    let remainingIncome = taxableIncome;

    for (let i = 0; i < brackets.length; i++) {
        const lowerBound = i === 0 ? 0 : brackets[i-1].limit;
        const upperBound = brackets[i].limit;
        
        if (remainingIncome > 0) {
            const incomeInBracket = Math.min(remainingIncome, upperBound - lowerBound);
            tax += incomeInBracket * brackets[i].rate;
            remainingIncome -= incomeInBracket;
        } else {
            break;
        }
    }

    return tax;
};


export const calculateStateTax = (taxableIncome: number, stateOfResidence: string, filingStatus: FilingStatus): number => {
    if (taxableIncome <= 0) return 0;

    let tax = 0;
    switch (stateOfResidence.toUpperCase()) {
        case 'CA':
            const caBrackets = filingStatus === FilingStatus.Single ? CA_STATE_TAX_BRACKETS_SINGLE : CA_STATE_TAX_BRACKETS_SINGLE;
             let remainingIncome = taxableIncome;
            for (let i = 0; i < caBrackets.length; i++) {
                const lowerBound = i === 0 ? 0 : caBrackets[i-1].limit;
                const upperBound = caBrackets[i].limit;
                if(remainingIncome > 0){
                    const incomeInBracket = Math.min(remainingIncome, upperBound - lowerBound);
                    tax += incomeInBracket * caBrackets[i].rate;
                    remainingIncome -= incomeInBracket;
                } else {
                    break;
                }
            }
            return tax;
        default:
            return 0;
    }
};

export const calculateNetSelfEmploymentEarnings = (totalSelfEmploymentIncome: number, totalBusinessExpenses: number): number => {
    const netProfit = totalSelfEmploymentIncome - totalBusinessExpenses;
    return Math.max(0, netProfit * 0.9235);
};

export const calculateSETax = (netSelfEmploymentEarnings: number): number => {
    const ssEarnings = Math.min(netSelfEmploymentEarnings, SS_MAX_EARNINGS);
    const medicareEarnings = netSelfEmploymentEarnings;
    const ssTax = ssEarnings * 0.124;
    const medicareTax = medicareEarnings * 0.029;
    return ssTax + medicareTax;
};

export const calculateSEDeduction = (seTax: number): number => {
    return seTax * SE_DEDUCTION_PERCENTAGE;
};

export const calculateAGI = (totalIncome: number, aboveTheLineDeductions: number): number => {
    return Math.max(0, totalIncome - aboveTheLineDeductions);
};

export const calculateItemizedDeductions = (approvedDeductions: Deduction[], taxProfile: TaxProfile): number => {
    let total = 0;
    const businessExpenseCategories = new Set([
        DeductionCategory.HomeOffice, DeductionCategory.BusinessTravel, DeductionCategory.ProfessionalDevelopment,
        DeductionCategory.SoftwareSubscriptions, DeductionCategory.ClientEntertainment, DeductionCategory.MarketingAdvertising,
        DeductionCategory.VehicleExpenses, DeductionCategory.OfficeSupplies, DeductionCategory.LegalProfessionalFees,
        DeductionCategory.Utilities, DeductionCategory.OtherBusinessExpense
    ]);

    for (const d of approvedDeductions) {
        if (!businessExpenseCategories.has(d.category)) {
            total += d.amount;
        }
    }
    return total;
};

export const getApplicableDeduction = (totalItemizedDeductions: number, filingStatus: FilingStatus): number => {
    const standardDeduction = STANDARD_DEDUCTION_2024[filingStatus] || STANDARD_DEDUCTION_2024[FilingStatus.Single];
    return Math.max(standardDeduction, totalItemizedDeductions);
};

export const calculateTotalGrossIncome = (incomeSources: IncomeSource[]): number => {
    return incomeSources.reduce((sum, source) => sum + source.amountYTD, 0);
};

export const calculateScheduleCDetails = (incomeSources: IncomeSource[], approvedDeductions: Deduction[]) => {
    const businessIncome = incomeSources
        .filter(s => s.type === IncomeType.NEC1099 || s.type === IncomeType.Other)
        .reduce((sum, s) => sum + s.amountYTD, 0);

    const businessExpenses = approvedDeductions
        .filter(d =>
            d.isApproved && (
                d.category === DeductionCategory.HomeOffice || d.category === DeductionCategory.BusinessTravel ||
                d.category === DeductionCategory.ProfessionalDevelopment || d.category === DeductionCategory.SoftwareSubscriptions ||
                d.category === DeductionCategory.ClientEntertainment || d.category === DeductionCategory.MarketingAdvertising ||
                d.category === DeductionCategory.VehicleExpenses || d.category === DeductionCategory.OfficeSupplies ||
                d.category === DeductionCategory.LegalProfessionalFees || d.category === DeductionCategory.Utilities ||
                d.category === DeductionCategory.OtherBusinessExpense
            )
        )
        .reduce((sum, d) => sum + d.amount, 0);

    const netBusinessProfit = businessIncome - businessExpenses;
    return { businessIncome, businessExpenses, netBusinessProfit };
};

export const calculateFullTaxLiability = (
    incomeSources: IncomeSource[],
    approvedDeductions: Deduction[],
    taxProfile: TaxProfile
) => {
    const totalGrossIncome = calculateTotalGrossIncome(incomeSources);
    const { businessIncome, businessExpenses, netBusinessProfit } = calculateScheduleCDetails(incomeSources, approvedDeductions);
    const netSelfEmploymentEarnings = calculateNetSelfEmploymentEarnings(businessIncome, businessExpenses);
    const selfEmploymentTax = calculateSETax(netSelfEmploymentEarnings);
    const seTaxDeduction = calculateSEDeduction(selfEmploymentTax);
    
    const otherAboveTheLineDeductions = approvedDeductions
        .filter(d => d.isApproved && (d.category === DeductionCategory.HealthInsurancePremiums || d.category === DeductionCategory.RetirementContributions || d.category === DeductionCategory.StudentLoanInterest))
        .reduce((sum, d) => sum + d.amount, 0);

    const totalAboveTheLineDeductions = seTaxDeduction + otherAboveTheLineDeductions;
    const agi = calculateAGI(totalGrossIncome, totalAboveTheLineDeductions);
    const totalItemizedDeductions = calculateItemizedDeductions(approvedDeductions, taxProfile);
    const applicableDeduction = getApplicableDeduction(totalItemizedDeductions, taxProfile.filingStatus);
    const taxableIncome = Math.max(0, agi - applicableDeduction);
    const federalTaxLiability = calculateFederalTax(taxableIncome, taxProfile.filingStatus);
    const stateTaxLiability = calculateStateTax(taxableIncome, taxProfile.stateOfResidence, taxProfile.filingStatus);
    
    const totalEstimatedTaxLiability = federalTaxLiability + selfEmploymentTax + stateTaxLiability;
    
    const federalTaxWithheldYTD = taxProfile.federalTaxWithheldYTD || 0;
    const stateTaxWithheldYTD = taxProfile.stateTaxWithheldYTD || 0;
    const federalEstimatedTaxPaidYTD = taxProfile.federalEstimatedTaxPaid || 0;
    const stateEstimatedTaxPaidYTD = taxProfile.stateEstimatedTaxPaid || 0;

    const netFederalTaxDue = federalTaxLiability + selfEmploymentTax - federalTaxWithheldYTD - federalEstimatedTaxPaidYTD;
    const netStateTaxDue = stateTaxLiability - stateTaxWithheldYTD - stateEstimatedTaxPaidYTD;

    const effectiveTaxRate = totalGrossIncome > 0 ? (totalEstimatedTaxLiability / totalGrossIncome) * 100 : 0;

    return {
        totalGrossIncome, scheduleCIncome: businessIncome, scheduleCExpenses: businessExpenses, netBusinessProfit,
        netSelfEmploymentEarnings, selfEmploymentTax, seTaxDeduction, totalAboveTheLineDeductions, agi,
        totalItemizedDeductions, applicableDeduction, taxableIncome, federalTaxLiability, stateTaxLiability,
        totalEstimatedTaxLiability, federalTaxWithheldYTD, stateTaxWithheldYTD, netFederalTaxDue, netStateTaxDue, effectiveTaxRate,
    };
};


export const calculateEstimatedQuarterlyPayments = (
    totalEstimatedTaxLiability: number,
    federalTaxWithheldYTD: number,
    stateTaxWithheldYTD: number,
    federalEstimatedTaxPaid: number,
    stateEstimatedTaxPaid: number
): EstimatedPayment[] => {
    const today = new Date();
    const currentMonth = today.getMonth();

    const totalFederalTax = totalEstimatedTaxLiability; // Simplified, assumes SE tax is federal
    const totalStateTax = 0; // Needs state calculation logic

    const remainingFederalTax = totalFederalTax - federalTaxWithheldYTD - federalEstimatedTaxPaid;
    const remainingStateTax = totalStateTax - stateTaxWithheldYTD - stateEstimatedTaxPaid;

    const payments: EstimatedPayment[] = [];
    let quartersRemaining = 0;

    if (today < QUARTERLY_DUE_DATES[1]) quartersRemaining = 4;
    else if (today < QUARTERLY_DUE_DATES[2]) quartersRemaining = 3;
    else if (today < QUARTERLY_DUE_DATES[3]) quartersRemaining = 2;
    else if (today < QUARTERLY_DUE_DATES[4]) quartersRemaining = 1;

    let paidQuarters = 4 - quartersRemaining;
    if (today > QUARTERLY_DUE_DATES[4] && today.getFullYear() === TAX_YEAR) paidQuarters = 4;


    for (let q = 1; q <= 4; q++) {
        const dueDate = QUARTERLY_DUE_DATES[q];
        const isPaid = q <= paidQuarters;

        let amountFederal = 0;
        let amountState = 0;

        if (!isPaid && quartersRemaining > 0) {
            amountFederal = remainingFederalTax / quartersRemaining;
            amountState = remainingStateTax / quartersRemaining;
        }

        payments.push({
            id: generateUniqueId(),
            quarter: q,
            amountFederal: Math.max(0, amountFederal),
            amountState: Math.max(0, amountState),
            paymentDate: isPaid ? new Date() : undefined,
            isPaid: isPaid,
            dueDate: dueDate,
        });
    }

    return payments;
};

export const assessAuditRiskAI = (
    income: number, deductionsTotal: number, homeOfficeDeduction: number,
    mealsEntertainmentDeduction: number, businessTravelDeduction: number,
    priorYearAGI: number = 0, cryptoTransactions: boolean = false, foreignAccounts: boolean = false
): AuditFactor[] => {
    const factors: AuditFactor[] = [];
    
    const deductionToIncomeRatio = income > 0 ? deductionsTotal / income : 0;
    if (deductionToIncomeRatio > 0.4) {
        const score = Math.min(100, (deductionToIncomeRatio - 0.4) * 200);
        factors.push({
            name: 'High Deductions Relative to Income', score,
            level: score > 70 ? AuditRiskLevel.VeryHigh : (score > 40 ? AuditRiskLevel.High : AuditRiskLevel.Medium),
            explanation: `Your total deductions (${formatCurrency(deductionsTotal)}) are a significant portion (${(deductionToIncomeRatio * 100).toFixed(1)}%) of your income.`,
            recommendations: ['Ensure all deductions are documented.', 'Review each deduction for accuracy.'],
        });
    }

    if (homeOfficeDeduction > 0) {
        const score = Math.min(100, homeOfficeDeduction / 50);
        factors.push({
            name: 'Home Office Deduction', score,
            level: score > 60 ? AuditRiskLevel.High : (score > 30 ? AuditRiskLevel.Medium : AuditRiskLevel.Low),
            explanation: `Claiming a home office deduction of ${formatCurrency(homeOfficeDeduction)} is often reviewed for compliance.`,
            recommendations: ['Maintain detailed records.', 'Ensure the space is used exclusively for business.'],
        });
    }
    
    if (cryptoTransactions) {
        factors.push({
            name: 'Cryptocurrency Transactions', score: 70, level: AuditRiskLevel.High,
            explanation: 'The IRS is increasingly scrutinizing cryptocurrency transactions.',
            recommendations: ['Keep meticulous records of all crypto transactions.', 'Report all gains, losses, and income from crypto.'],
        });
    }

    if (factors.length === 0) {
        factors.push({ name: 'General Audit Risk', score: 10, level: AuditRiskLevel.Low, explanation: 'Overall audit risk appears low.', recommendations: ['Continue maintaining diligent records.'] });
    }

    return factors.sort((a, b) => b.score - a.score);
};

export const getAISummaryAndInsights = async (
    taxSummaryData: any, // Simplified for brevity
    ai: GoogleGenAI
): Promise<string> => {
    const prompt = `You are an expert tax advisor AI. Provide a concise summary of the user's current tax situation and actionable insights based on the following data.
    - Total Gross Income: ${formatCurrency(taxSummaryData.totalGrossIncome)}
    - Net Business Profit: ${formatCurrency(taxSummaryData.netBusinessProfit)}
    - Estimated Total Tax Liability: ${formatcurrency(taxSummaryData.totalEstimatedTaxLiability)}
    - Effective Tax Rate: ${taxSummaryData.effectiveTaxRate.toFixed(2)}%
    - Net Federal Tax Due: ${formatCurrency(taxSummaryData.netFederalTaxDue)}
    Focus on key numbers and actionable advice.`;

    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [{ text: prompt }], config: { responseMimeType: "text/plain" } });
        return response.text;
    } catch (err) {
        console.error("AI Summary generation failed:", err);
        return "Failed to generate AI summary.";
    }
};

export const processReceiptWithAI = async (receiptUrl: string): Promise<Partial<Receipt>> => {
    console.log(`Simulating AI processing for receipt: ${receiptUrl}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData = MOCK_RECEIPTS.find(r => r.url === receiptUrl) || {
                fileName: receiptUrl.split('/').pop() || 'unknown.pdf',
                extractedText: 'Simulated text: expense, $100.00.',
                aiSummary: 'General business expense.',
                amount: 100.00,
                transactionDate: new Date(TAX_YEAR, 2, 1),
            };
            resolve({ ...mockData, id: generateUniqueId(), uploadDate: new Date() });
        }, 2000);
    });
};

// --- MAIN TAX CENTER VIEW COMPONENT AND SUB-COMPONENTS ---

export const TaxCenterView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("TaxCenterView must be within a DataProvider");

    const { transactions: globalTransactions, userId } = context;

    // --- State Management ---
    const [deductions, setDeductions] = useState<Deduction[]>([]);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [taxProfile, setTaxProfile] = useState<TaxProfile>(() => ({
        userId: userId || 'mock-user-123',
        taxYear: TAX_YEAR,
        filingStatus: FilingStatus.Single,
        dependents: 0,
        stateOfResidence: 'CA',
        hasHealthInsurance: true,
        isSelfEmployed: true,
        federalTaxWithheldYTD: 5000,
        stateTaxWithheldYTD: 1500,
        federalEstimatedTaxPaid: 4000,
        stateEstimatedTaxPaid: 1000,
        priorYearAGI: 70000,
        hasInvestments: true,
    }));
    const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
    const [estimatedPayments, setEstimatedPayments] = useState<EstimatedPayment[]>([]);
    const [auditFactors, setAuditFactors] = useState<AuditFactor[]>([]);
    const [aiSummary, setAiSummary] = useState<string>('');
    const [taxAlerts, setTaxAlerts] = useState<TaxAlert[]>(MOCK_ALERTS);
    const [receipts, setReceipts] = useState<Receipt[]>(MOCK_RECEIPTS);
    const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(MOCK_CRYPTO_ASSETS);
    const [cryptoTransactions, setCryptoTransactions] = useState<CryptoTransaction[]>(MOCK_CRYPTO_TRANSACTIONS);
    const [taxScenarios, setTaxScenarios] = useState<TaxScenario[]>([]);

    const [activeTab, setActiveTab] = useState('overview');
    const [showAddDeductionModal, setShowAddDeductionModal] = useState(false);
    const [newDeduction, setNewDeduction] = useState<Partial<Deduction>>({ category: DeductionCategory.OtherBusinessExpense });
    const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    const [currentTaxConcept, setCurrentTaxConcept] = useState<string>('');
    const [explanationLoading, setExplanationLoading] = useState(false);
    const [taxConceptExplanation, setTaxConceptExplanation] = useState<TaxConceptExplanation | null>(null);

    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_KEY as string }), []);

    const transactions: Transaction[] = useMemo(() => {
        return globalTransactions.map(t => ({
            id: t.id.toString(), description: t.description, amount: t.amount,
            date: new Date(t.date), type: t.amount > 0 ? 'income' : 'expense',
            category: t.category, merchant: t.merchant, currency: 'USD',
            rawDetails: JSON.stringify(t),
        }));
    }, [globalTransactions]);

    const approvedDeductions = useMemo(() => deductions.filter(d => d.isApproved), [deductions]);

    useEffect(() => {
        const incomeMap = new Map<string, IncomeSource>();
        transactions.forEach(t => {
            if (t.type === 'income') {
                const sourceName = t.merchant || 'Uncategorized Income';
                const existing = incomeMap.get(sourceName);
                if (existing) {
                    incomeMap.set(sourceName, { ...existing, amountYTD: existing.amountYTD + t.amount });
                } else {
                    incomeMap.set(sourceName, {
                        id: generateUniqueId(), name: sourceName,
                        type: sourceName.toLowerCase().includes('salary') ? IncomeType.W2 : IncomeType.NEC1099,
                        amountYTD: t.amount,
                    });
                }
            }
        });
        setIncomeSources(Array.from(incomeMap.values()));
    }, [transactions]);

    const fullTaxSummary = useMemo(() => {
        return calculateFullTaxLiability(incomeSources, approvedDeductions, taxProfile);
    }, [incomeSources, approvedDeductions, taxProfile]);

    useEffect(() => {
        setEstimatedPayments(
            calculateEstimatedQuarterlyPayments(
                fullTaxSummary.totalEstimatedTaxLiability,
                taxProfile.federalTaxWithheldYTD || 0, taxProfile.stateTaxWithheldYTD || 0,
                taxProfile.federalEstimatedTaxPaid || 0, taxProfile.stateEstimatedTaxPaid || 0
            )
        );
    }, [fullTaxSummary.totalEstimatedTaxLiability, taxProfile]);


    const findDeductions = useCallback(async () => {
        setIsLoadingAI(true);
        setDeductions(prev => prev.filter(d => !d.isAIRecommended));
        try {
            const prompt = `Analyze these transactions for a freelance consultant and identify potential tax deductions. Transactions:\n${transactions.map(t => `${t.id}: ${t.description} - $${t.amount}`).join('\n')}`;
            const schema = { type: Type.OBJECT, properties: { deductions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { transactionId: { type: Type.STRING }, description: { type: Type.STRING }, amount: { type: Type.NUMBER }, category: { type: Type.STRING, enum: Object.values(DeductionCategory) }, justification: { type: Type.STRING } } } } } };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: [{ text: prompt }],
                config: { responseMimeType: "application/json", responseSchema: schema }
            });

            const aiDetectedDeductions = JSON.parse(response.text).deductions.map((d: any) => ({
                id: generateUniqueId(), ...d, transactionIds: [d.transactionId],
                isAIRecommended: true, isApproved: false, dateAdded: new Date(),
            }));
            setDeductions(prev => [...prev, ...aiDetectedDeductions]);
        } catch (err) {
            console.error("AI Deduction scan failed:", err);
        } finally {
            setIsLoadingAI(false);
        }
    }, [transactions, taxProfile, ai]);

    const runAIAuditRiskAssessment = useCallback(async () => {
        setIsLoadingAI(true);
        try {
            const homeOffice = approvedDeductions.filter(d => d.category === DeductionCategory.HomeOffice).reduce((sum, d) => sum + d.amount, 0);
            const mealsEntertainment = approvedDeductions.filter(d => d.category === DeductionCategory.ClientEntertainment).reduce((sum, d) => sum + d.amount, 0);
            const businessTravel = approvedDeductions.filter(d => d.category === DeductionCategory.BusinessTravel).reduce((sum, d) => sum + d.amount, 0);

            const factors = assessAuditRiskAI(
                fullTaxSummary.totalGrossIncome, approvedDeductions.reduce((sum, d) => sum + d.amount, 0),
                homeOffice, mealsEntertainment, businessTravel, taxProfile.priorYearAGI, taxProfile.hasInvestments
            );
            setAuditFactors(factors);
        } catch (err) {
            console.error("AI Audit Risk Assessment failed:", err);
        } finally {
            setIsLoadingAI(false);
        }
    }, [approvedDeductions, fullTaxSummary.totalGrossIncome, taxProfile, ai]);

    const getTaxConceptExplanation = useCallback(async (concept: string) => {
        setExplanationLoading(true);
        try {
            const prompt = `Explain the tax concept "${concept}" simply for a self-employed person. Provide an example. Respond in JSON format with properties: concept, explanation, example.`;
            const schema = { type: Type.OBJECT, properties: { concept: { type: Type.STRING }, explanation: { type: Type.STRING }, example: { type: Type.STRING, optional: true } } };
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: [{ text: prompt }],
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            setTaxConceptExplanation(JSON.parse(response.text));
        } catch (err) {
            console.error(`AI explanation for '${concept}' failed:`, err);
        } finally {
            setExplanationLoading(false);
        }
    }, [ai]);

    useEffect(() => {
        if (activeTab === 'audit' && auditFactors.length === 0 && !isLoadingAI) runAIAuditRiskAssessment();
    }, [activeTab, auditFactors.length, isLoadingAI, runAIAuditRiskAssessment]);

    const handleApproveDeduction = (id: string, approved: boolean) => {
        setDeductions(prev => prev.map(d => d.id === id ? { ...d, isApproved: approved } : d));
    };

    const handleAddDeduction = () => {
        if (newDeduction.description && newDeduction.amount && newDeduction.category) {
            setDeductions(prev => [...prev, { ...newDeduction as Deduction, id: generateUniqueId(), isApproved: true }]);
            setShowAddDeductionModal(false);
            setNewDeduction({ category: DeductionCategory.OtherBusinessExpense });
        }
    };

    const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            setIsProcessingReceipt(true);
            const mockUrl = `/receipts/${event.target.files[0].name}`;
            const processedReceipt = await processReceiptWithAI(mockUrl);
            setReceipts(prev => [...prev, processedReceipt as Receipt]);
            setIsProcessingReceipt(false);
        }
    };
    
    const handleViewConceptExplanation = (concept: string) => {
        setCurrentTaxConcept(concept);
        setShowExplanationModal(true);
        getTaxConceptExplanation(concept);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setTaxProfile(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaxProfile(prev => ({ ...prev, [e.target.name]: e.target.checked }));
    };

    const { totalEstimatedTaxLiability, netFederalTaxDue, netStateTaxDue, effectiveTaxRate, taxableIncome } = fullTaxSummary;
    const totalDeductions = approvedDeductions.reduce((sum, d) => sum + d.amount, 0);

    const tabs = ['overview', 'deductions', 'income', 'estimated', 'audit', 'planning', 'forms', 'crypto', 'receipts', 'alerts'];

    return (
        <div className="space-y-6 p-4 md:p-8 bg-gray-950 min-h-screen text-gray-100">
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-6 flex items-center">
                <svg className="w-10 h-10 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                AI Tax Center ({TAX_YEAR})
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-2">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-cyan-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}>
                        {tab} {tab === 'alerts' && taxAlerts.filter(a => !a.isRead).length > 0 && <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{taxAlerts.filter(a => !a.isRead).length}</span>}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center bg-gradient-to-br from-purple-800 to-indigo-800">
                    <p className="text-4xl font-extrabold text-white">{formatCurrency(totalEstimatedTaxLiability)}</p>
                    <p className="text-sm text-gray-200 mt-1">Estimated Liability</p>
                </Card>
                <Card className="text-center bg-gradient-to-br from-green-700 to-emerald-700">
                    <p className="text-4xl font-extrabold text-white">{formatCurrency(totalDeductions)}</p>
                    <p className="text-sm text-gray-200 mt-1">Approved Deductions</p>
                </Card>
                <Card className="text-center bg-gradient-to-br from-blue-700 to-cyan-700">
                    <p className="text-4xl font-extrabold text-white">{effectiveTaxRate.toFixed(2)}%</p>
                    <p className="text-sm text-gray-200 mt-1">Effective Tax Rate</p>
                </Card>
                <Card className="text-center bg-gradient-to-br from-yellow-700 to-orange-700">
                    <p className="text-4xl font-extrabold text-yellow-300">{auditFactors[0]?.level || 'Low'}</p>
                    <p className="text-sm text-gray-200 mt-1">AI Audit Risk</p>
                </Card>
            </div>
            
            {/* Conditional Tab Content */}
            {activeTab === 'overview' && (
                 <Card title="Financial Overview">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Deduction Categories</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={Object.values(DeductionCategory).map(cat => ({name: cat, value: approvedDeductions.filter(d => d.category === cat).reduce((sum, d) => sum + d.amount, 0)})).filter(d => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                       {Object.values(DeductionCategory).map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Income vs. Deductions vs. Tax</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={[{name: 'Financials', income: fullTaxSummary.totalGrossIncome, deductions: totalDeductions, tax: totalEstimatedTaxLiability}]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                    <XAxis dataKey="name" stroke="#A0AEC0" />
                                    <YAxis stroke="#A0AEC0" tickFormatter={(value) => formatCurrency(value as number)} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} formatter={(value: number) => formatCurrency(value)}/>
                                    <Legend />
                                    <Bar dataKey="income" fill="#48BB78" />
                                    <Bar dataKey="deductions" fill="#F6E05E" />
                                    <Bar dataKey="tax" fill="#F56565" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                 </Card>
            )}
            
            {activeTab === 'deductions' && (
                <Card title="AI Deduction Finder & Management">
                    <div className="text-center mb-6">
                        <button onClick={findDeductions} disabled={isLoadingAI} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 mr-3">
                            {isLoadingAI ? 'Scanning...' : 'Run AI Deduction Scan'}
                        </button>
                        <button onClick={() => setShowAddDeductionModal(true)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
                            Add Manual Deduction
                        </button>
                    </div>
                    {deductions.length > 0 && (
                        <div className="mt-6 space-y-3 max-h-96 overflow-y-auto pr-2">
                            {deductions.map(d => (
                                <div key={d.id} className={`p-4 rounded-lg border ${d.isApproved ? 'bg-gray-800 border-green-600/50' : 'bg-gray-900/50 border-yellow-600/50'}`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold text-white">{d.description}</h4>
                                            <p className="text-sm text-gray-400">{formatCurrency(d.amount)}</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700">{d.category}</span>
                                            {d.isAIRecommended && <span className="text-xs bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-full">AI</span>}
                                            <button onClick={() => handleApproveDeduction(d.id, !d.isApproved)} className={`text-sm font-medium ${d.isApproved ? 'text-red-400' : 'text-green-400'}`}>{d.isApproved ? 'Unapprove' : 'Approve'}</button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 italic mt-2">"{d.justification}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'income' && (
                <Card title="Tax Profile & Settings">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Filing Status</label>
                            <select name="filingStatus" value={taxProfile.filingStatus} onChange={handleProfileChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md">
                                {FILING_STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-400">Dependents</label>
                            <input type="number" name="dependents" value={taxProfile.dependents} onChange={handleProfileChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Federal Tax Withheld YTD</label>
                            <input type="number" name="federalTaxWithheldYTD" value={taxProfile.federalTaxWithheldYTD} onChange={handleProfileChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Federal Estimated Tax Paid</label>
                            <input type="number" name="federalEstimatedTaxPaid" value={taxProfile.federalEstimatedTaxPaid} onChange={handleProfileChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md" />
                        </div>
                    </form>
                </Card>
            )}

            {activeTab === 'estimated' && (
                <Card title="Estimated Quarterly Tax Payments">
                     <table className="min-w-full divide-y divide-gray-700 text-gray-300">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Quarter</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Due Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase">Federal Amount</th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {estimatedPayments.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4">{p.quarter}</td>
                                    <td className="px-6 py-4">{p.dueDate.toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">{formatCurrency(p.amountFederal)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${p.isPaid ? 'bg-green-500/20 text-green-200' : 'bg-yellow-500/20 text-yellow-200'}`}>{p.isPaid ? 'Paid' : 'Upcoming'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}
            
            {activeTab === 'forms' && (
                <Card title="Tax Form Preview (Simulated)">
                    <div className="bg-gray-800 p-6 rounded-lg font-mono text-sm text-white">
                        <h3 className="text-lg font-bold mb-4">Form 1040 (U.S. Individual Income Tax Return) {TAX_YEAR}</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            <div>1. Wages, salaries, tips, etc.</div> <div className="text-right">{formatCurrency(incomeSources.filter(s => s.type === IncomeType.W2).reduce((sum,s) => sum + s.amountYTD, 0))}</div>
                            <div>...</div> <div></div>
                            <div>8. Other income from Schedule 1</div> <div className="text-right">{formatCurrency(fullTaxSummary.scheduleCIncome)}</div>
                            <div className="font-bold">11. Adjusted gross income (AGI)</div> <div className="text-right font-bold">{formatCurrency(fullTaxSummary.agi)}</div>
                            <div>12. Standard or itemized deductions</div> <div className="text-right">{formatCurrency(fullTaxSummary.applicableDeduction)}</div>
                            <div className="font-bold">15. Taxable income</div> <div className="text-right font-bold">{formatCurrency(fullTaxSummary.taxableIncome)}</div>
                            <div>16. Tax</div> <div className="text-right">{formatCurrency(fullTaxSummary.federalTaxLiability)}</div>
                            <div>23. Other taxes (inc. SE tax)</div> <div className="text-right">{formatCurrency(fullTaxSummary.selfEmploymentTax)}</div>
                            <div className="font-bold">24. Total tax</div> <div className="text-right font-bold">{formatCurrency(fullTaxSummary.federalTaxLiability + fullTaxSummary.selfEmploymentTax)}</div>
                        </div>
                    </div>
                </Card>
            )}

            {activeTab === 'crypto' && (
                 <Card title="Crypto & Digital Assets">
                    <h3 className="text-lg font-semibold mb-4">Asset Holdings</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {cryptoAssets.map(asset => (
                            <div key={asset.id} className="bg-gray-800 p-4 rounded-lg">
                                <p className="font-bold text-lg">{asset.name} ({asset.symbol})</p>
                                <p>Holdings: {asset.totalHoldings}</p>
                                <p>Avg. Cost Basis: {formatCurrency(asset.averageCostBasis)}</p>
                            </div>
                        ))}
                     </div>
                     <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                    <table className="min-w-full divide-y divide-gray-700 text-gray-300">
                        <thead className="bg-gray-800"><tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Asset</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase">Quantity</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase">Total Value</th>
                        </tr></thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                        {cryptoTransactions.map(tx => (
                            <tr key={tx.id}>
                                <td className="px-6 py-4">{tx.date.toLocaleDateString()}</td>
                                <td className="px-6 py-4 capitalize">{tx.type.replace('_', ' ')}</td>
                                <td className="px-6 py-4">{tx.symbol}</td>
                                <td className="px-6 py-4 text-right">{tx.quantity}</td>
                                <td className="px-6 py-4 text-right">{formatCurrency(tx.totalValue)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                 </Card>
            )}

            {/* Modals */}
            {showAddDeductionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-xl w-full">
                        <h3 className="text-2xl font-bold text-white mb-4">Add New Deduction</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Description" value={newDeduction.description || ''} onChange={e => setNewDeduction(p => ({...p, description: e.target.value}))} className="w-full bg-gray-800 border-gray-600 rounded-md" />
                            <input type="number" placeholder="Amount" value={newDeduction.amount || ''} onChange={e => setNewDeduction(p => ({...p, amount: parseFloat(e.target.value)}))} className="w-full bg-gray-800 border-gray-600 rounded-md" />
                            <select value={newDeduction.category} onChange={e => setNewDeduction(p => ({...p, category: e.target.value as DeductionCategory}))} className="w-full bg-gray-800 border-gray-600 rounded-md">
                                {DEDUCTION_CATEGORIES_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={() => setShowAddDeductionModal(false)} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
                            <button onClick={handleAddDeduction} className="px-4 py-2 bg-indigo-600 rounded-lg">Add</button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TaxCenterView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/finance/TaxCenterView.tsx
================================================================================

// components/views/megadashboard/finance/TaxCenterView.tsx
import React, { useState, useContext } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI, Type } from "@google/genai";

const TaxCenterView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("TaxCenterView must be within a DataProvider");
    
    const { transactions } = context;
    const [deductions, setDeductions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const findDeductions = async () => {
        setIsLoading(true);
        setDeductions([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are an expert tax AI. Analyze this list of transactions and identify potential tax deductions for a freelance consultant. For each, provide the transaction description, amount, a potential deduction category, and a brief justification. Transactions:\n${transactions.map(t => `${t.description} - $${t.amount}`).join('\n')}`;
            const schema = { type: Type.OBJECT, properties: { deductions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, amount: { type: Type.NUMBER }, category: { type: Type.STRING }, justification: { type: Type.STRING } } } } } };
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setDeductions(JSON.parse(response.text).deductions);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Tax Center</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">$15,250</p><p className="text-sm text-gray-400 mt-1">Estimated Liability</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">${deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</p><p className="text-sm text-gray-400 mt-1">Deductions Found</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">15%</p><p className="text-sm text-gray-400 mt-1">Effective Tax Rate</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-yellow-400">Low</p><p className="text-sm text-gray-400 mt-1">AI Audit Risk</p></Card>
            </div>

            <Card title="AI Deduction Finder">
                <div className="text-center">
                    <button onClick={findDeductions} disabled={isLoading} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50">
                        {isLoading ? 'Scanning Transactions...' : 'Run AI Deduction Scan'}
                    </button>
                </div>
                {deductions.length > 0 && (
                    <div className="mt-6 space-y-3">
                        {deductions.map((d, i) => (
                            <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-white">{d.description} - ${d.amount}</h4>
                                    <span className="text-xs bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-full">{d.category}</span>
                                </div>
                                <p className="text-sm text-gray-400 italic mt-1">"{d.justification}"</p>
                            </div>
                        ))}
                    </div>
                )}
                 { !isLoading && deductions.length === 0 && <p className="text-center text-gray-500 mt-4">Run the scan to find potential tax deductions.</p>}
            </Card>
        </div>
    );
};

export default TaxCenterView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/finance/TaxCenterView.tsx
================================================================================

// components/views/megadashboard/finance/TaxCenterView.tsx
import React, { useState, useContext } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI, Type } from "@google/genai";

const TaxCenterView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("TaxCenterView must be within a DataProvider");
    
    const { transactions } = context;
    const [deductions, setDeductions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const findDeductions = async () => {
        setIsLoading(true);
        setDeductions([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are an expert tax AI. Analyze this list of transactions and identify potential tax deductions for a freelance consultant. For each, provide the transaction description, amount, a potential deduction category, and a brief justification. Transactions:\n${transactions.map(t => `${t.description} - $${t.amount}`).join('\n')}`;
            const schema = { type: Type.OBJECT, properties: { deductions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, amount: { type: Type.NUMBER }, category: { type: Type.STRING }, justification: { type: Type.STRING } } } } } };
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setDeductions(JSON.parse(response.text).deductions);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Tax Center</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">$15,250</p><p className="text-sm text-gray-400 mt-1">Estimated Liability</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">${deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</p><p className="text-sm text-gray-400 mt-1">Deductions Found</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">15%</p><p className="text-sm text-gray-400 mt-1">Effective Tax Rate</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-yellow-400">Low</p><p className="text-sm text-gray-400 mt-1">AI Audit Risk</p></Card>
            </div>

            <Card title="AI Deduction Finder">
                <div className="text-center">
                    <button onClick={findDeductions} disabled={isLoading} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50">
                        {isLoading ? 'Scanning Transactions...' : 'Run AI Deduction Scan'}
                    </button>
                </div>
                {deductions.length > 0 && (
                    <div className="mt-6 space-y-3">
                        {deductions.map((d, i) => (
                            <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-white">{d.description} - ${d.amount}</h4>
                                    <span className="text-xs bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-full">{d.category}</span>
                                </div>
                                <p className="text-sm text-gray-400 italic mt-1">"{d.justification}"</p>
                            </div>
                        ))}
                    </div>
                )}
                 { !isLoading && deductions.length === 0 && <p className="text-center text-gray-500 mt-4">Run the scan to find potential tax deductions.</p>}
            </Card>
        </div>
    );
};

export default TaxCenterView;